"""
SCAIO API Routes
Endpoints REST para o sistema
"""

from fastapi import APIRouter, HTTPException, Query
from typing import Optional, List

from src.agents.edital_hunter import EditalHunter
from src.agents.health_agent import HealthAgent
from src.models.schemas import (
    SearchRequest, 
    SearchResultResponse,
    OpportunityResponse,
    MetricsResponse
)

router = APIRouter()

# Referência global (será injetada na inicialização)
edital_hunter: Optional[EditalHunter] = None
health_agent: Optional[HealthAgent] = None


def init_routes(hunter: EditalHunter, health: HealthAgent):
    """Inicializa as rotas com as dependências"""
    global edital_hunter, health_agent
    edital_hunter = hunter
    health_agent = health


@router.get("/search", response_model=SearchResultResponse)
async def search_editais(
    description: str = Query(default="Buscar editais de licitação", description="Descrição da busca"),
    cnpj: Optional[str] = Query(default=None, description="CNPJ da organização")
):
    """
    Busca editais públicos baseado na descrição.
    
    - **description**: Descrição do que buscar
    - **cnpj**: CNPJ para personalizar busca (opcional)
    """
    if not edital_hunter:
        raise HTTPException(status_code=503, detail="Agente não inicializado")
    
    result = await edital_hunter.execute({
        "description": description,
        "cnpj": cnpj
    })
    
    return SearchResultResponse(
        success=result.get("evaluation_result") == "approved",
        score=result.get("avg_score", 0),
        opportunities=[
            OpportunityResponse(
                title=opp.get("title", ""),
                url=opp.get("url"),
                score=opp.get("score", 0),
                domain=opp.get("domain")
            )
            for opp in result.get("final_result", {}).get("opportunities", [])
        ],
        retry_count=result.get("retry_count", 0),
        lessons_learned=result.get("lessons_learned"),
        history=result.get("full_history", [])
    )


@router.get("/health-detail")
async def get_health_detail():
    """
    Retorna detalhes do estado de saúde do sistema.
    
    Inclui:
    - Estado atual (GREEN/YELLOW/ORANGE/RED)
    - Número de verificações realizadas
    - Falhas consecutivas
    - Histórico de mudanças de estado
    """
    if not health_agent:
        raise HTTPException(status_code=503, detail="Health Agent não inicializado")
    
    return health_agent.get_metrics()


@router.get("/memory/stats")
async def get_memory_stats():
    """
    Retorna estatísticas da memória vetorial.
    
    Mostra contagem de vetores em cada coleção Qdrant.
    """
    if not edital_hunter:
        raise HTTPException(status_code=503, detail="Agente não inicializado")
    
    return edital_hunter.memory.get_collection_stats()


@router.get("/memory/search")
async def search_memory(
    query: str = Query(description="Consulta para buscar na memória"),
    memory_type: str = Query(default="procedural", description="Tipo: 'procedural' ou 'semantic'"),
    limit: int = Query(default=10, ge=1, le=100)
):
    """
    Busca na memória vetorial.
    
    - **query**: Texto para buscar
    - **memory_type**: 'procedural' (estratégias) ou 'semantic' (fatos)
    - **limit**: Máximo de resultados
    """
    if not edital_hunter:
        raise HTTPException(status_code=503, detail="Agente não inicializado")
    
    if memory_type == "procedural":
        results = await edital_hunter.memory.search_procedural(query, limit)
    else:
        results = await edital_hunter.memory.search_semantic(query, limit)
    
    return {"results": results}


@router.post("/agent/reset")
async def reset_agent():
    """Reseta métricas do agente (para demonstração)"""
    if not edital_hunter:
        raise HTTPException(status_code=503, detail="Agente não inicializado")
    
    edital_hunter.avg_score = 0.0
    edital_hunter.total_cycles = 0
    edital_hunter.successful_cycles = 0
    
    return {"message": "Agente resetado com sucesso"}
