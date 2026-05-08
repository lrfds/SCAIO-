"""
SCAIO Pydantic Schemas
Modelos de dados para API
"""

from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime
from enum import Enum


class HealthStateEnum(str, Enum):
    """Estados de saúde do sistema"""
    GREEN = "green"
    YELLOW = "yellow"
    ORANGE = "orange"
    RED = "red"


class ExecutionStatusEnum(str, Enum):
    """Status de execução"""
    PLANNING = "planning"
    EXECUTING = "executing"
    EVALUATING = "evaluating"
    REFLECTING = "reflecting"
    ADJUSTING = "adjusting"
    PERSISTING = "persisting"
    DELIVERING = "delivering"
    COMPLETED = "completed"
    ESCALATED = "escalated"


# ==================== REQUESTS ====================

class SearchRequest(BaseModel):
    """Request para busca de editais"""
    description: str = Field(
        default="Buscar editais de licitação",
        description="Descrição da busca"
    )
    cnpj: Optional[str] = Field(
        default=None,
        description="CNPJ da organização"
    )
    keywords: List[str] = Field(
        default_factory=lambda: ["edital", "chamamento público"],
        description="Palavras-chave adicionais"
    )
    max_results: int = Field(
        default=10,
        ge=1,
        le=100,
        description="Máximo de resultados"
    )


class MemorySearchRequest(BaseModel):
    """Request para busca na memória"""
    query: str = Field(description="Consulta textual")
    limit: int = Field(default=10, ge=1, le=100)


# ==================== RESPONSES ====================

class OpportunityResponse(BaseModel):
    """Resposta de oportunidade encontrada"""
    title: str
    url: Optional[str] = None
    score: float
    domain: Optional[str] = None


class SearchResultResponse(BaseModel):
    """Resposta de busca de editais"""
    success: bool
    score: float
    opportunities: List[OpportunityResponse]
    retry_count: int
    lessons_learned: Optional[str] = None
    history: List[Dict[str, Any]] = []


class AgentMetricsResponse(BaseModel):
    """Métricas de um agente"""
    name: str
    version: str
    avg_score: float
    total_cycles: int
    successful_cycles: int
    success_rate: float
    health_state: HealthStateEnum
    last_task_status: Optional[str] = None


class HealthAgentMetricsResponse(BaseModel):
    """Métricas do Health Agent"""
    name: str
    version: str
    state: HealthStateEnum
    checks_performed: int
    alerts_triggered: int
    consecutive_failures: int
    sensors: Dict[str, bool]


class MetaHealthMetricsResponse(BaseModel):
    """Métricas do Meta-Health Agent"""
    name: str
    version: str
    state: HealthStateEnum
    watchdog_cycles: int
    restarts_performed: int
    escalations_performed: int


class MetricsResponse(BaseModel):
    """Resposta completa de métricas"""
    timestamp: str
    edital_hunter: Optional[AgentMetricsResponse] = None
    health_agent: Optional[HealthAgentMetricsResponse] = None
    meta_health: Optional[MetaHealthMetricsResponse] = None


class HealthResponse(BaseModel):
    """Resposta de health check"""
    status: str
    timestamp: str
    agents: Dict[str, Any]


class MemoryStatsResponse(BaseModel):
    """Estatísticas da memória"""
    collections: Dict[str, Dict[str, Any]]


class MemorySearchResult(BaseModel):
    """Resultado de busca na memória"""
    id: str
    score: float
    payload: Dict[str, Any]


class MemorySearchResponse(BaseModel):
    """Resposta de busca na memória"""
    results: List[MemorySearchResult]


# ==================== WEBSOCKET ====================

class WSMessage(BaseModel):
    """Mensagem WebSocket"""
    type: str
    data: Dict[str, Any]
    timestamp: str
