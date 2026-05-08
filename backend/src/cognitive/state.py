"""
SCAIO Cognitive State
Estado cognitivo do sistema (LangGraph TypedDict)
"""

from typing import TypedDict, List, Optional, Dict, Any
from datetime import datetime
from enum import Enum


class ExecutionStatus(Enum):
    """Status de execução do ciclo cognitivo"""
    PLANNING = "planning"
    EXECUTING = "executing"
    EVALUATING = "evaluating"
    REFLECTING = "reflecting"
    ADJUSTING = "adjusting"
    PERSISTING = "persisting"
    DELIVERING = "delivering"
    COMPLETED = "completed"
    ESCALATED = "escalated"


class HealthState(Enum):
    """Estado de saúde do sistema"""
    GREEN = "green"      # Saudável - conformidade plena
    YELLOW = "yellow"    # Atenção - observação
    ORANGE = "orange"    # Degradação - notificação extrajudicial
    RED = "red"          # Crise - citação judicial


class CognitiveState(TypedDict):
    """
    Estado cognitivo completo do agente.
    
    Utilizado pelo LangGraph para gerenciar o ciclo cognitivo:
    Planejar → Executar → Avaliar → Refletir → Ajustar → Persistir → Entregar
    """
    
    # Identificação
    task_id: str
    agent_name: str
    agent_version: str
    
    # Contexto
    task_description: str
    user_id: Optional[str]
    org_cnpj: Optional[str]
    
    # Planejamento (Eu Operacional)
    strategy: Dict[str, Any]
    current_step: int
    total_steps: int
    
    # Execução
    collected_data: List[Dict[str, Any]]
    sources: List[Dict[str, Any]]
    
    # Avaliação (Eu Supervisor)
    source_scores: List[float]
    avg_score: float
    evaluation_result: str  # approved | rejected | escalated
    rejection_reason: Optional[str]
    
    # Aprendizado
    successful_patterns: List[Dict[str, Any]]
    failed_patterns: List[Dict[str, Any]]
    lessons_learned: str
    
    # Memória Consultada
    procedural_memory_hits: List[Dict[str, Any]]
    semantic_memory_hits: List[Dict[str, Any]]
    
    # Controle
    retry_count: int
    max_retries: int
    status: ExecutionStatus
    health_state: HealthState
    started_at: datetime
    last_updated: datetime
    
    # Resultado Final
    final_result: Optional[Dict[str, Any]]
    
    # Auditoria (trilha completa)
    full_history: List[Dict[str, Any]]


def create_initial_state(
    task: Dict[str, Any],
    agent_name: str = "EditalHunter",
    agent_version: str = "1.0.0"
) -> CognitiveState:
    """Cria estado inicial para um novo ciclo cognitivo"""
    
    now = datetime.now()
    
    return CognitiveState(
        task_id=f"task_{now.timestamp()}",
        agent_name=agent_name,
        agent_version=agent_version,
        task_description=task.get("description", "Buscar editais"),
        user_id=task.get("user_id"),
        org_cnpj=task.get("cnpj"),
        strategy={},
        current_step=0,
        total_steps=0,
        collected_data=[],
        sources=[],
        source_scores=[],
        avg_score=0.0,
        evaluation_result="",
        rejection_reason=None,
        successful_patterns=[],
        failed_patterns=[],
        lessons_learned="",
        procedural_memory_hits=[],
        semantic_memory_hits=[],
        retry_count=0,
        max_retries=task.get("max_retries", 3),
        status=ExecutionStatus.PLANNING,
        health_state=HealthState.GREEN,
        started_at=now,
        last_updated=now,
        final_result=None,
        full_history=[]
    )
