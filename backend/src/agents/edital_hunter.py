"""
SCAIO Edital Hunter Agent
Agente Cognitivo Autônomo para Busca de Editais

Características:
- Metacognição (Executor + Supervisor)
- Memória persistente (Qdrant)
- Aprendizado por reflexão pós-tarefa
- Autocorreção com backoff exponencial
"""

from typing import Dict, Any, Optional
from datetime import datetime

from src.cognitive.state import CognitiveState, ExecutionStatus, HealthState, create_initial_state
from src.cognitive.memory import QdrantMemory
from src.cognitive.graph import build_cognitive_graph
from src.config.settings import settings


class EditalHunter:
    """
    Agente Cognitivo Autônomo para Busca de Editais.
    
    Implementa o ciclo cognitivo completo:
    Planejar → Executar → Avaliar → Refletir → Ajustar → Persistir → Entregar
    """
    
    def __init__(self):
        self.name = "EditalHunter"
        self.version = "1.0.0"
        
        # Inicializa memória persistente
        self.memory = QdrantMemory()
        
        # Métricas
        self.avg_score = 0.0
        self.total_cycles = 0
        self.successful_cycles = 0
        self.health_state = HealthState.GREEN
        
        # Estado atual
        self.current_task: Optional[CognitiveState] = None
        
        # Constrói o grafo cognitivo
        self.graph = build_cognitive_graph(
            memory=self.memory,
            min_quality_score=settings.MIN_QUALITY_SCORE
        )
    
    async def execute(self, task: Dict[str, Any]) -> Dict[str, Any]:
        """
        Executa ciclo cognitivo completo.
        
        Args:
            task: Dicionário com:
                - description: Descrição da busca
                - user_id: ID do usuário (opcional)
                - cnpj: CNPJ da organização (opcional)
                
        Returns:
            Resultado da execução com status e oportunidades
        """
        
        self.total_cycles += 1
        
        # Cria estado inicial
        initial_state = create_initial_state(
            task=task,
            agent_name=self.name,
            agent_version=self.version
        )
        
        # Executa o grafo cognitivo
        result = await self.graph.ainvoke(initial_state)
        
        # Atualiza métricas
        if result.get("evaluation_result") == "approved":
            self.successful_cycles += 1
            self.avg_score = (
                (self.avg_score * (self.total_cycles - 1) + result["avg_score"]) 
                / self.total_cycles
            )
            self.health_state = HealthState.GREEN
        else:
            if result.get("retry_count", 0) >= settings.MAX_RETRIES:
                self.health_state = HealthState.RED
            elif result.get("avg_score", 0) < settings.MIN_QUALITY_SCORE:
                self.health_state = HealthState.ORANGE
        
        self.current_task = result
        
        return result
    
    def get_metrics(self) -> Dict[str, Any]:
        """
        Retorna métricas do agente.
        
        Returns:
            Dicionário com métricas para monitoramento
        """
        return {
            "name": self.name,
            "version": self.version,
            "avg_score": round(self.avg_score, 2),
            "total_cycles": self.total_cycles,
            "successful_cycles": self.successful_cycles,
            "success_rate": round(
                self.successful_cycles / self.total_cycles * 100 
                if self.total_cycles > 0 else 0,
                1
            ),
            "health_state": self.health_state.value,
            "last_task_status": self.current_task.get("evaluation_result") if self.current_task else None,
            "last_task_score": self.current_task.get("avg_score") if self.current_task else None
        }
    
    async def stop(self):
        """Para o agente e limpa recursos"""
        pass
