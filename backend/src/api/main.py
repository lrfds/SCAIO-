"""
SCAIO FastAPI Application
Ponto de entrada da API REST e WebSocket
"""

from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import asyncio
import logging
from datetime import datetime
from typing import Optional

from src.agents.edital_hunter import EditalHunter
from src.agents.health_agent import HealthAgent
from src.agents.meta_health import MetaHealthAgent
from src.config.settings import settings

# Configura logging
logging.basicConfig(
    level=getattr(logging, settings.LOG_LEVEL),
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Instâncias globais
edital_hunter: Optional[EditalHunter] = None
health_agent: Optional[HealthAgent] = None
meta_health: Optional[MetaHealthAgent] = None
active_connections: list[WebSocket] = []


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup and shutdown events"""
    global edital_hunter, health_agent, meta_health
    
    logger.info("🚀 Starting SCAIO Backend...")
    
    # Inicializa agentes
    edital_hunter = EditalHunter()
    health_agent = HealthAgent()
    meta_health = MetaHealthAgent()
    
    # Inicia monitoramento em background
    asyncio.create_task(health_check_loop())
    
    logger.info("✅ SCAIO Backend started successfully")
    
    yield
    
    # Shutdown
    logger.info("🛑 Shutting down...")
    if edital_hunter:
        await edital_hunter.stop()


app = FastAPI(
    title="SCAIO API",
    description="Sistema Cognitivo Autônomo de Inteligência Operacional",
    version="1.0.0",
    lifespan=lifespan
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


async def health_check_loop():
    """Background task for health monitoring"""
    while True:
        try:
            if edital_hunter and health_agent and meta_health:
                # Coleta métricas do EditalHunter
                agent_metrics = edital_hunter.get_metrics()
                
                # Health Agent verifica saúde
                health_state = health_agent.check_health(agent_metrics)
                
                # Meta-Health verifica Health Agent
                meta_health.check_watchdog(health_state.value)
                
                # Log periódico
                logger.debug(f"Health: {health_state.value}")
                
        except Exception as e:
            logger.error(f"Health check error: {e}")
        
        await asyncio.sleep(settings.HEALTH_CHECK_INTERVAL)


# ==================== ENDPOINTS ====================

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "name": "SCAIO API",
        "version": "1.0.0",
        "status": "running",
        "timestamp": datetime.now().isoformat()
    }


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "agents": {
            "edital_hunter": edital_hunter.get_metrics() if edital_hunter else None,
            "health_agent": health_agent.get_metrics() if health_agent else None,
            "meta_health": meta_health.get_metrics() if meta_health else None
        }
    }


@app.get("/api/metrics")
async def get_metrics():
    """Get current system metrics"""
    if not edital_hunter:
        raise HTTPException(status_code=503, detail="Agent not initialized")
    
    return {
        "timestamp": datetime.now().isoformat(),
        "edital_hunter": edital_hunter.get_metrics(),
        "health_agent": health_agent.get_metrics() if health_agent else None,
        "meta_health": meta_health.get_metrics() if meta_health else None
    }


@app.post("/api/search")
async def trigger_search(
    description: str = "Buscar editais",
    cnpj: Optional[str] = None
):
    """Trigger a search manually"""
    if not edital_hunter:
        raise HTTPException(status_code=503, detail="Agent not initialized")
    
    result = await edital_hunter.execute({
        "description": description,
        "cnpj": cnpj
    })
    
    return result


@app.get("/api/memory/stats")
async def get_memory_stats():
    """Get memory statistics"""
    if not edital_hunter:
        raise HTTPException(status_code=503, detail="Agent not initialized")
    
    return edital_hunter.memory.get_collection_stats()


@app.get("/api/memory/procedural")
async def search_procedural_memory(query: str, limit: int = 5):
    """Search procedural memory"""
    if not edital_hunter:
        raise HTTPException(status_code=503, detail="Agent not initialized")
    
    results = await edital_hunter.memory.search_procedural(query, limit)
    return {"results": results}


@app.get("/api/memory/semantic")
async def search_semantic_memory(query: str, limit: int = 10):
    """Search semantic memory"""
    if not edital_hunter:
        raise HTTPException(status_code=503, detail="Agent not initialized")
    
    results = await edital_hunter.memory.search_semantic(query, limit)
    return {"results": results}


# ==================== WEBSOCKET ====================

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    """WebSocket for real-time metrics"""
    await websocket.accept()
    active_connections.append(websocket)
    
    logger.info(f"WebSocket connected. Active: {len(active_connections)}")
    
    try:
        while True:
            if edital_hunter:
                metrics = {
                    "type": "metrics",
                    "data": {
                        "edital_hunter": edital_hunter.get_metrics(),
                        "health_agent": health_agent.get_metrics() if health_agent else None,
                        "meta_health": meta_health.get_metrics() if meta_health else None
                    },
                    "timestamp": datetime.now().isoformat()
                }
                await websocket.send_json(metrics)
            await asyncio.sleep(1)
    except WebSocketDisconnect:
        active_connections.remove(websocket)
        logger.info(f"WebSocket disconnected. Active: {len(active_connections)}")
    except Exception as e:
        logger.error(f"WebSocket error: {e}")
        if websocket in active_connections:
            active_connections.remove(websocket)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "src.api.main:app",
        host=settings.API_HOST,
        port=settings.API_PORT,
        reload=True
    )
