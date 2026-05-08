"""
SCAIO FastAPI Application
Ponto de entrada da API REST e WebSocket
"""

from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import asyncio
import logging
from datetime import datetime
from typing import Optional

from src.agents.edital_hunter import EditalHunter
from src.agents.health_agent import HealthAgent
from src.agents.meta_health import MetaHealthAgent
from src.api.routes import router as api_router, init_routes
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
health_check_task: Optional[asyncio.Task] = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup and shutdown events"""
    global edital_hunter, health_agent, meta_health, health_check_task
    
    logger.info("🚀 Starting SCAIO Backend...")
    
    # Inicializa agentes
    edital_hunter = EditalHunter()
    health_agent = HealthAgent()
    meta_health = MetaHealthAgent()
    
    init_routes(edital_hunter, health_agent)
    
    # Inicia monitoramento em background
    health_check_task = asyncio.create_task(health_check_loop())
    
    logger.info("✅ SCAIO Backend started successfully")
    
    yield
    
    # Shutdown
    logger.info("🛑 Shutting down...")
    if health_check_task:
        health_check_task.cancel()
        try:
            await health_check_task
        except asyncio.CancelledError:
            pass
    if edital_hunter:
        await edital_hunter.stop()


app = FastAPI(
    title="SCAIO API",
    description="Sistema Cognitivo Autônomo de Inteligência Operacional",
    version="1.0.0",
    lifespan=lifespan
)

app.include_router(api_router, prefix="/api")

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
