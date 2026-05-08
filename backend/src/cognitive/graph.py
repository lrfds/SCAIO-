"""
SCAIO Cognitive Graph
LangGraph workflow para ciclo cognitivo completo
"""

from typing import Dict, Any, Callable
from langgraph.graph import StateGraph, END
from datetime import datetime

from src.cognitive.state import CognitiveState, ExecutionStatus


async def planning_node(state: CognitiveState, memory: Any) -> CognitiveState:
    """
    Nó de Planejamento (Eu Operacional).
    
    Consulta memória procedural para recuperar estratégias anteriores.
    """
    print(f"[{state['agent_name']}] 📋 Planejando: {state['task_description']}")
    
    # Consulta memória procedural
    similar = await memory.search_procedural(
        query=state["task_description"],
        limit=5
    )
    
    state["procedural_memory_hits"] = similar
    state["current_step"] = 1
    state["total_steps"] = 7
    state["last_updated"] = datetime.now()
    
    if similar:
        best = similar[0]
        state["strategy"] = best["payload"].get("strategy", {})
        print(f"   ✅ Estratégia recuperada: {best['id']}")
        
        # Adiciona ao histórico
        state["full_history"].append({
            "step": "planning",
            "action": "strategy_recovered",
            "timestamp": datetime.now().isoformat(),
            "detail": f"Strategy from memory: {best['id']}"
        })
    else:
        state["strategy"] = {
            "keywords": ["edital", "chamamento público", "chamada pública"],
            "domains": [".gov.br"],
            "max_depth": 2,
            "prefer_official": True
        }
        print("   🆕 Nenhuma estratégia anterior. Usando padrão.")
        
        state["full_history"].append({
            "step": "planning",
            "action": "default_strategy",
            "timestamp": datetime.now().isoformat()
        })
    
    state["status"] = ExecutionStatus.EXECUTING
    return state


async def execute_node(state: CognitiveState) -> CognitiveState:
    """
    Nó de Execução.
    
    Realiza a busca em fontes governamentais.
    """
    print(f"[{state['agent_name']}] ⚙️ Executando busca...")
    
    state["current_step"] = 2
    state["last_updated"] = datetime.now()
    
    # TODO: Integrar com Playwright real
    # Simulação de coleta de dados
    domains = state["strategy"].get("domains", [".gov.br"])
    
    state["sources"] = [
        {
            "url": f"https://www.comprasnet.gov.br/editais/{i}",
            "title": f"Edital de Licitação {i}",
            "content_snippet": f"Conteúdo do edital extraído do domínio {domain}...",
            "domain": domain,
            "collected_at": datetime.now().isoformat()
        }
        for i, domain in enumerate(domains[:3], 1)
    ]
    
    state["collected_data"] = state["sources"]
    
    state["full_history"].append({
        "step": "execute",
        "action": "data_collected",
        "timestamp": datetime.now().isoformat(),
        "detail": f"Collected {len(state['sources'])} sources"
    })
    
    print(f"   📦 Coletados {len(state['sources'])} fontes")
    
    state["status"] = ExecutionStatus.EVALUATING
    return state


async def evaluate_node(state: CognitiveState, min_score: float = 7.0) -> CognitiveState:
    """
    Nó de Avaliação (Eu Supervisor).
    
    Avalia a qualidade dos dados coletados.
    Pode aplicar VETO cognitivo se score < min_score.
    """
    print(f"[{state['agent_name']}] 🧠 Avaliando qualidade (Supervisor)")
    
    state["current_step"] = 3
    state["last_updated"] = datetime.now()
    
    scores = []
    for source in state["sources"]:
        # Simulação de score (realmente usaria LLM para avaliação)
        # Em produção: usar Groq/Llama3 para avaliar qualidade
        score = 8.5
        scores.append(score)
        source["score"] = score
    
    state["source_scores"] = scores
    state["avg_score"] = sum(scores) / len(scores) if scores else 0
    
    print(f"   📊 Score médio: {state['avg_score']:.1f}/10")
    
    if state["avg_score"] >= min_score:
        state["evaluation_result"] = "approved"
        state["status"] = ExecutionStatus.REFLECTING
        print("   ✅ APROVADO pelo Supervisor")
    else:
        state["evaluation_result"] = "rejected"
        state["rejection_reason"] = f"Score ({state['avg_score']:.1f}) abaixo do mínimo ({min_score})"
        state["status"] = ExecutionStatus.ADJUSTING
        print(f"   ❌ REJEITADO pelo Supervisor")
    
    state["full_history"].append({
        "step": "evaluate",
        "action": state["evaluation_result"],
        "timestamp": datetime.now().isoformat(),
        "detail": f"Score: {state['avg_score']:.1f}, Result: {state['evaluation_result']}"
    })
    
    return state


async def reflect_node(state: CognitiveState, memory: Any) -> CognitiveState:
    """
    Nó de Reflexão.
    
    Aprende com a execução bem-sucedida.
    """
    print(f"[{state['agent_name']}] 🔄 Refletindo sobre a execução")
    
    state["current_step"] = 4
    state["last_updated"] = datetime.now()
    
    if state["avg_score"] >= 7.0:
        # Salva estratégia de sucesso na memória procedural
        await memory.save_procedural(
            strategy=state["strategy"],
            performance={
                "score": state["avg_score"], 
                "success": True,
                "sources_count": len(state["sources"])
            },
            context=state["task_description"]
        )
        
        state["successful_patterns"].append({
            "strategy": state["strategy"],
            "score": state["avg_score"]
        })
        
        print("   ✅ Estratégia de sucesso salva na memória procedural")
    
    state["lessons_learned"] = f"Execução com score {state['avg_score']:.1f}"
    
    state["full_history"].append({
        "step": "reflect",
        "action": "learning_captured",
        "timestamp": datetime.now().isoformat(),
        "detail": f"Pattern saved: {state['avg_score']:.1f}"
    })
    
    state["status"] = ExecutionStatus.PERSISTING
    return state


async def adjust_node(state: CognitiveState) -> CognitiveState:
    """
    Nó de Ajuste.
    
    Modifica estratégia e tenta novamente (auto-correção).
    """
    print(f"[{state['agent_name']}] 🔧 Ajustando estratégia (tentativa {state['retry_count'] + 1})")
    
    state["current_step"] = 5
    state["last_updated"] = datetime.now()
    state["retry_count"] += 1
    
    if state["retry_count"] >= state["max_retries"]:
        state["evaluation_result"] = "escalated"
        state["health_state"] = "red"
        print("   ⚠️ Tentativas esgotadas. Escalando para humano...")
        
        state["full_history"].append({
            "step": "adjust",
            "action": "escalated",
            "timestamp": datetime.now().isoformat(),
            "detail": f"Max retries ({state['max_retries']}) reached"
        })
    else:
        # Modifica estratégia para próxima tentativa
        strategy = state["strategy"].copy()
        strategy["attempt"] = state["retry_count"]
        strategy["modified_at"] = datetime.now().isoformat()
        state["strategy"] = strategy
        
        state["full_history"].append({
            "step": "adjust",
            "action": "strategy_modified",
            "timestamp": datetime.now().isoformat(),
            "detail": f"Retry {state['retry_count']}/{state['max_retries']}"
        })
        
        state["status"] = ExecutionStatus.PLANNING
        print(f"   🎯 Estratégia ajustada para tentativa {state['retry_count']}")
    
    return state


async def persist_node(state: CognitiveState) -> CognitiveState:
    """
    Nó de Persistência.
    
    Salva o resultado final na memória semântica.
    """
    print(f"[{state['agent_name']}] 💾 Persistindo resultado")
    
    state["current_step"] = 6
    state["last_updated"] = datetime.now()
    
    state["full_history"].append({
        "step": "persist",
        "action": "result_saved",
        "timestamp": datetime.now().isoformat()
    })
    
    state["status"] = ExecutionStatus.DELIVERING
    return state


async def deliver_node(state: CognitiveState) -> CognitiveState:
    """
    Nó de Entrega.
    
    Prepara o resultado final para o cliente.
    """
    print(f"[{state['agent_name']}] 📤 Entregando resultado")
    
    state["current_step"] = 7
    state["last_updated"] = datetime.now()
    
    state["final_result"] = {
        "success": state["evaluation_result"] == "approved",
        "score": state["avg_score"],
        "opportunities": [
            {"title": s.get("title"), "url": s.get("url"), "score": s.get("score")}
            for s in state["sources"]
            if s.get("score", 0) >= 7
        ],
        "retry_count": state["retry_count"],
        "lessons_learned": state["lessons_learned"]
    }
    
    state["full_history"].append({
        "step": "deliver",
        "action": "result_delivered",
        "timestamp": datetime.now().isoformat(),
        "detail": f"Delivered {len(state['final_result']['opportunities'])} opportunities"
    })
    
    state["status"] = ExecutionStatus.COMPLETED
    print(f"   ✅ Ciclo completo: {len(state['final_result']['opportunities'])} oportunidades")
    
    return state


def build_cognitive_graph(
    memory: Any,
    min_quality_score: float = 7.0
) -> StateGraph:
    """
    Constrói o grafo cognitivo completo.
    
    Fluxo: Plan → Execute → Evaluate → [Reflect|Adjust] → Persist → Deliver
    
    Args:
        memory: Instância do QdrantMemory
        min_quality_score: Score mínimo para aprovação
        
    Returns:
        Graph compilado pronto para execução
    """
    
    workflow = StateGraph(CognitiveState)
    
    # Adiciona nós com closures para passar dependências
    workflow.add_node("plan", lambda s: planning_node(s, memory))
    workflow.add_node("execute", execute_node)
    workflow.add_node("evaluate", lambda s: evaluate_node(s, min_quality_score))
    workflow.add_node("reflect", lambda s: reflect_node(s, memory))
    workflow.add_node("adjust", adjust_node)
    workflow.add_node("persist", persist_node)
    workflow.add_node("deliver", deliver_node)
    
    # Define fluxo
    workflow.set_entry_point("plan")
    workflow.add_edge("plan", "execute")
    workflow.add_edge("execute", "evaluate")
    
    # Decisão após avaliação
    workflow.add_conditional_edges(
        "evaluate",
        lambda s: s["evaluation_result"],
        {
            "approved": "reflect",
            "rejected": "adjust",
            "escalated": "persist"
        }
    )
    
    workflow.add_edge("reflect", "persist")
    workflow.add_edge("persist", "deliver")
    
    # Decisão após ajuste (retry ou escalate)
    workflow.add_conditional_edges(
        "adjust",
        lambda s: s["status"].value,
        {
            "planning": "plan",  # Retry
            "persisting": "persist"  # Escalate
        }
    )
    
    workflow.add_edge("deliver", END)
    
    return workflow.compile()
