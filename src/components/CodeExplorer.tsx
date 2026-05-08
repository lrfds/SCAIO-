import { useState } from 'react';
import { FileCode, Folder, FolderOpen, ChevronRight, ChevronDown, X, Terminal } from 'lucide-react';

interface FileNode {
  name: string;
  type: 'file' | 'folder';
  content?: string;
  children?: FileNode[];
}

const fileStructure: FileNode[] = [
  {
    name: 'scaio-backend',
    type: 'folder',
    children: [
      {
        name: 'requirements.txt',
        type: 'file',
        content: `# Core AI
crewai>=0.28.0
langgraph>=0.0.20
langchain>=0.1.0
langchain-community>=0.0.10
langchain-groq>=0.1.0

# Web Automation
playwright>=1.40.0
aiohttp>=3.9.0
beautifulsoup4>=4.12.0

# Database & Vector
psycopg2-binary>=2.9.0
qdrant-client>=1.7.0
redis>=5.0.0
sqlalchemy>=2.0.0

# API
fastapi>=0.104.0
uvicorn[standard]>=0.24.0
websockets>=12.0
pydantic>=2.0.0
pydantic-settings>=2.0.0

# AI Models
ollama>=0.1.0
groq>=0.4.0
openai>=1.0.0
numpy>=1.24.0`
      },
      {
        name: 'docker-compose.yml',
        type: 'file',
        content: `version: '3.8'

services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: scaio
      POSTGRES_USER: scaio
      POSTGRES_PASSWORD: scaio_pass
    ports: ["5432:5432"]
    
  qdrant:
    image: qdrant/qdrant:latest
    ports: ["6333:6333", "6334:6334"]
    
  redis:
    image: redis:7-alpine
    ports: ["6379:6379"]
    
  ollama:
    image: ollama/ollama:latest
    ports: ["11434:11434"]
    
  backend:
    build: .
    ports: ["8000:8000"]
    depends_on: [postgres, qdrant, redis, ollama]`
      },
      {
        name: 'Dockerfile',
        type: 'file',
        content: `FROM python:3.11-slim

WORKDIR /app

RUN apt-get update && apt-get install -y gcc curl \\
    && rm -rf /var/lib/apt/lists/*

RUN pip install playwright && playwright install chromium

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

ENV PYTHONPATH=/app
ENV PYTHONUNBUFFERED=1

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=10s \\
    CMD curl -f http://localhost:8000/health || exit 1

CMD ["uvicorn", "src.api.main:app", "--host", "0.0.0.0", "--port", "8000"]`
      },
      {
        name: 'src',
        type: 'folder',
        children: [
          {
            name: 'config',
            type: 'folder',
            children: [
              {
                name: 'settings.py',
                type: 'file',
                content: `"""
SCAIO Configuration Settings
"""

from pydantic_settings import BaseSettings
from typing import List, Optional
from pydantic import Field


class Settings(BaseSettings):
    """Configurações centralizadas do SCAIO"""
    
    # API
    API_HOST: str = "0.0.0.0"
    API_PORT: int = 8000
    API_KEY: str = "scaio_super_secret_key_2026"
    
    # Databases
    POSTGRES_URL: str = "postgresql://scaio:scaio_pass@localhost:5432/scaio"
    QDRANT_URL: str = "http://localhost:6333"
    REDIS_URL: str = "redis://localhost:6379"
    
    # Qdrant Collections
    QDRANT_SEMANTIC_COLLECTION: str = "semantic_memory"
    QDRANT_PROCEDURAL_COLLECTION: str = "procedural_memory"
    
    # Quality Thresholds (Limiar de Materialidade)
    MIN_QUALITY_SCORE: float = 7.0
    MAX_RETRIES: int = 3
    MIN_SUCCESS_RATE: float = 70.0
    
    # Monitoring
    HEALTH_CHECK_INTERVAL: int = 60
    MAX_SILENCE_MINUTES: int = 30
    CONSECUTIVE_FAILURES_THRESHOLD: int = 3
    
    # Alerting
    WHATSAPP_ENABLED: bool = False
    WHATSAPP_RECIPIENTS: List[str] = []
    
    # LLM Models
    LLM_MODEL_HEAVY: str = "groq/llama-3-70b"
    GROQ_API_KEY: Optional[str] = None
    OLLAMA_URL: str = "http://localhost:11434"
    
    class Config:
        env_file = ".env"
        extra = "ignore"


settings = Settings()`
              }
            ]
          },
          {
            name: 'cognitive',
            type: 'folder',
            children: [
              {
                name: 'state.py',
                type: 'file',
                content: `"""
SCAIO Cognitive State
"""

from typing import TypedDict, List, Optional, Dict, Any
from datetime import datetime
from enum import Enum


class ExecutionStatus(Enum):
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
    GREEN = "green"      # Conformidade plena
    YELLOW = "yellow"    # Observação
    ORANGE = "orange"    # Notificação extrajudicial
    RED = "red"          # Citação judicial


class CognitiveState(TypedDict):
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
    evaluation_result: str
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
    
    # Auditoria
    full_history: List[Dict[str, Any]]`
              },
              {
                name: 'memory.py',
                type: 'file',
                content: `"""
SCAIO Qdrant Memory Client
"""

from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams, PointStruct
import uuid
from typing import List, Dict, Any, Optional
import numpy as np

from src.config.settings import settings


class QdrantMemory:
    """
    Interface para memória persistente.
    
    - Semântica: fatos e conteúdo dos editais
    - Procedural: estratégias e workflows aprendidos
    """
    
    def __init__(self):
        self.client = QdrantClient(url=settings.QDRANT_URL)
        self.semantic_collection = settings.QDRANT_SEMANTIC_COLLECTION
        self.procedural_collection = settings.QDRANT_PROCEDURAL_COLLECTION
        self.vector_size = 1536
        
        self._ensure_collections()
    
    def _ensure_collections(self):
        """Garante que as coleções existam"""
        collections = [c.name for c in self.client.get_collections().collections]
        
        for coll_name in [self.semantic_collection, self.procedural_collection]:
            if coll_name not in collections:
                self.client.create_collection(
                    collection_name=coll_name,
                    vectors_config=VectorParams(size=self.vector_size, distance=Distance.COSINE)
                )
    
    def _get_embedding(self, text: str) -> List[float]:
        """Gera embedding para o texto"""
        np.random.seed(hash(text) % 2**32)
        embedding = np.random.randn(self.vector_size).tolist()
        norm = np.linalg.norm(embedding)
        return [x / norm for x in embedding]
    
    async def save_semantic(self, content: str, source: str, metadata: Dict) -> str:
        """Salva memória semântica (fatos)"""
        point_id = str(uuid.uuid4())
        vector = self._get_embedding(content)
        
        self.client.upsert(
            collection_name=self.semantic_collection,
            points=[PointStruct(id=point_id, vector=vector, payload={
                "content": content, "source": source, "type": "semantic", **metadata
            })]
        )
        return point_id
    
    async def save_procedural(self, strategy: Dict, performance: Dict, context: str) -> str:
        """Salva memória procedural (como fazer)"""
        point_id = str(uuid.uuid4())
        vector = self._get_embedding(f"{context} {strategy}")
        
        self.client.upsert(
            collection_name=self.procedural_collection,
            points=[PointStruct(id=point_id, vector=vector, payload={
                "type": "procedural", "strategy": strategy,
                "performance": performance, "context": context
            })]
        )
        return point_id
    
    async def search_procedural(self, query: str, limit: int = 5) -> List[Dict]:
        """Busca estratégias similares"""
        vector = self._get_embedding(query)
        results = self.client.search(
            collection_name=self.procedural_collection,
            query_vector=vector, limit=limit
        )
        return [{"id": str(h.id), "score": h.score, "payload": h.payload} for h in results]`
              },
              {
                name: 'graph.py',
                type: 'file',
                content: `"""
SCAIO Cognitive Graph
LangGraph workflow para ciclo cognitivo completo
"""

from typing import Dict, Any
from langgraph.graph import StateGraph, END
from datetime import datetime

from src.cognitive.state import CognitiveState, ExecutionStatus


async def planning_node(state: CognitiveState, memory) -> CognitiveState:
    """Planejamento (Eu Operacional)"""
    print(f"[{state['agent_name']}] 📋 Planejando...")
    
    # Consulta memória procedural
    similar = await memory.search_procedural(state["task_description"], limit=5)
    state["procedural_memory_hits"] = similar
    
    if similar:
        state["strategy"] = similar[0]["payload"].get("strategy", {})
    else:
        state["strategy"] = {"keywords": ["edital"], "domains": [".gov.br"]}
    
    state["status"] = ExecutionStatus.EXECUTING
    return state


async def evaluate_node(state: CognitiveState, min_score: float) -> CognitiveState:
    """Avaliação (Eu Supervisor)"""
    print(f"[{state['agent_name']}] 🧠 Avaliando...")
    
    scores = [8.5 for _ in state["sources"]]
    state["source_scores"] = scores
    state["avg_score"] = sum(scores) / len(scores) if scores else 0
    
    state["evaluation_result"] = "approved" if state["avg_score"] >= min_score else "rejected"
    state["status"] = ExecutionStatus.REFLECTING if state["evaluation_result"] == "approved" else ExecutionStatus.ADJUSTING
    
    return state


async def reflect_node(state: CognitiveState, memory) -> CognitiveState:
    """Reflexão e aprendizado"""
    print(f"[{state['agent_name']}] 🔄 Refletindo...")
    
    if state["avg_score"] >= 7.0:
        await memory.save_procedural(
            strategy=state["strategy"],
            performance={"score": state["avg_score"], "success": True},
            context=state["task_description"]
        )
    
    state["status"] = ExecutionStatus.PERSISTING
    return state


def build_cognitive_graph(memory, min_quality_score: float = 7.0) -> StateGraph:
    """Constrói o grafo cognitivo"""
    workflow = StateGraph(CognitiveState)
    
    workflow.add_node("plan", lambda s: planning_node(s, memory))
    workflow.add_node("evaluate", lambda s: evaluate_node(s, min_quality_score))
    workflow.add_node("reflect", lambda s: reflect_node(s, memory))
    workflow.add_node("persist", lambda s: s)
    workflow.add_node("deliver", lambda s: s)
    
    workflow.set_entry_point("plan")
    workflow.add_edge("plan", "evaluate")
    workflow.add_conditional_edges("evaluate", lambda s: s["evaluation_result"],
        {"approved": "reflect", "rejected": "deliver"})
    workflow.add_edge("reflect", "persist")
    workflow.add_edge("persist", "deliver")
    workflow.add_edge("deliver", END)
    
    return workflow.compile()`
              }
            ]
          },
          {
            name: 'agents',
            type: 'folder',
            children: [
              {
                name: 'edital_hunter.py',
                type: 'file',
                content: `"""
SCAIO Edital Hunter Agent
Agente Cognitivo Autônomo para Busca de Editais
"""

from typing import Dict, Any, Optional
from datetime import datetime

from src.cognitive.state import CognitiveState, HealthState, create_initial_state
from src.cognitive.memory import QdrantMemory
from src.cognitive.graph import build_cognitive_graph
from src.config.settings import settings


class EditalHunter:
    """
    Agente Cognitivo Autônomo para Busca de Editais.
    
    Ciclo cognitivo:
    Planejar → Executar → Avaliar → Refletir → Ajustar → Persistir → Entregar
    """
    
    def __init__(self):
        self.name = "EditalHunter"
        self.version = "1.0.0"
        self.memory = QdrantMemory()
        
        # Métricas
        self.avg_score = 0.0
        self.total_cycles = 0
        self.successful_cycles = 0
        self.health_state = HealthState.GREEN
        self.current_task: Optional[CognitiveState] = None
        
        # Grafo cognitivo
        self.graph = build_cognitive_graph(
            memory=self.memory,
            min_quality_score=settings.MIN_QUALITY_SCORE
        )
    
    async def execute(self, task: Dict[str, Any]) -> Dict[str, Any]:
        """Executa ciclo cognitivo completo"""
        self.total_cycles += 1
        
        initial_state = create_initial_state(
            task=task,
            agent_name=self.name,
            agent_version=self.version
        )
        
        result = await self.graph.ainvoke(initial_state)
        
        if result.get("evaluation_result") == "approved":
            self.successful_cycles += 1
            self.avg_score = (self.avg_score * (self.total_cycles - 1) + result["avg_score"]) / self.total_cycles
            self.health_state = HealthState.GREEN
        else:
            self.health_state = HealthState.ORANGE
        
        self.current_task = result
        return result
    
    def get_metrics(self) -> Dict[str, Any]:
        """Retorna métricas do agente"""
        return {
            "name": self.name,
            "version": self.version,
            "avg_score": round(self.avg_score, 2),
            "total_cycles": self.total_cycles,
            "successful_cycles": self.successful_cycles,
            "success_rate": round(self.successful_cycles / self.total_cycles * 100 if self.total_cycles > 0 else 0, 1),
            "health_state": self.health_state.value
        }`
              },
              {
                name: 'health_agent.py',
                type: 'file',
                content: `"""
SCAIO Health Agent
Supervisor Principal
"""

from typing import Dict, Any, List
from datetime import datetime, timedelta
from src.cognitive.state import HealthState
from src.config.settings import settings


class HealthAgent:
    """
    Supervisor Principal de Saúde do Sistema.
    
    Monitora agentes e executa ações corretivas.
    """
    
    def __init__(self):
        self.name = "HealthAgent"
        self.state = HealthState.GREEN
        self.checks_performed = 0
        self.consecutive_failures = 0
        self.state_history: List[Dict] = []
    
    def check_health(self, agent_metrics: Dict[str, Any]) -> HealthState:
        """Executa verificação de saúde"""
        self.checks_performed += 1
        
        issues = []
        
        avg_score = agent_metrics.get("avg_score", 0)
        if avg_score < 4.0:
            issues.append(("critical", f"Score muito baixo: {avg_score}"))
        elif avg_score < 7.0:
            issues.append(("warning", f"Score abaixo do ideal: {avg_score}"))
        
        if agent_metrics.get("last_task_status") == "escalated":
            issues.append(("critical", "Última tarefa escalada"))
        
        new_state = self._classify_state(issues)
        
        if new_state in [HealthState.ORANGE, HealthState.RED]:
            self.consecutive_failures += 1
        else:
            self.consecutive_failures = 0
        
        if self.consecutive_failures >= settings.CONSECUTIVE_FAILURES_THRESHOLD:
            new_state = HealthState.RED
        
        if new_state != self.state:
            self.state_history.append({
                "timestamp": datetime.now().isoformat(),
                "previous": self.state.value,
                "new": new_state.value
            })
            self.state = new_state
        
        return self.state
    
    def _classify_state(self, issues: List[tuple]) -> HealthState:
        critical = sum(1 for s, _ in issues if s == "critical")
        warning = sum(1 for s, _ in issues if s == "warning")
        
        if critical > 0: return HealthState.RED
        if warning >= 2: return HealthState.ORANGE
        if warning == 1: return HealthState.YELLOW
        return HealthState.GREEN
    
    def get_metrics(self) -> Dict[str, Any]:
        return {
            "name": self.name,
            "state": self.state.value,
            "checks_performed": self.checks_performed,
            "consecutive_failures": self.consecutive_failures
        }`
              }
            ]
          },
          {
            name: 'api',
            type: 'folder',
            children: [
              {
                name: 'main.py',
                type: 'file',
                content: `"""
SCAIO FastAPI Application
"""

from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import asyncio
import logging
from datetime import datetime

from src.agents.edital_hunter import EditalHunter
from src.agents.health_agent import HealthAgent
from src.config.settings import settings

logger = logging.getLogger(__name__)

edital_hunter = None
health_agent = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    global edital_hunter, health_agent
    
    logger.info("🚀 Starting SCAIO Backend...")
    edital_hunter = EditalHunter()
    health_agent = HealthAgent()
    
    asyncio.create_task(health_check_loop())
    logger.info("✅ SCAIO Backend started")
    
    yield
    
    logger.info("🛑 Shutting down...")


app = FastAPI(
    title="SCAIO API",
    description="Sistema Cognitivo Autônomo de Inteligência Operacional",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(CORSMiddleware, allow_origins=["*"],
    allow_credentials=True, allow_methods=["*"], allow_headers=["*"])


async def health_check_loop():
    while True:
        if edital_hunter and health_agent:
            metrics = edital_hunter.get_metrics()
            health_agent.check_health(metrics)
        await asyncio.sleep(settings.HEALTH_CHECK_INTERVAL)


@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}


@app.get("/api/metrics")
async def get_metrics():
    if not edital_hunter:
        raise HTTPException(503, "Agent not initialized")
    return {
        "edital_hunter": edital_hunter.get_metrics(),
        "health_agent": health_agent.get_metrics() if health_agent else None
    }


@app.post("/api/search")
async def trigger_search(description: str = "Buscar editais"):
    if not edital_hunter:
        raise HTTPException(503, "Agent not initialized")
    return await edital_hunter.execute({"description": description})


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            if edital_hunter:
                await websocket.send_json({
                    "type": "metrics",
                    "data": edital_hunter.get_metrics()
                })
            await asyncio.sleep(1)
    except WebSocketDisconnect:
        pass`
              }
            ]
          }
        ]
      }
    ]
  }
];

interface CodeExplorerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CodeExplorer({ isOpen, onClose }: CodeExplorerProps) {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['scaio-backend', 'scaio-backend/src']));
  const [selectedFile, setSelectedFile] = useState<FileNode | null>(null);

  if (!isOpen) return null;

  const toggleFolder = (path: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    setExpandedFolders(newExpanded);
  };

  const renderTree = (nodes: FileNode[], parentPath: string = '') => {
    return nodes.map((node) => {
      const currentPath = `${parentPath}/${node.name}`;
      const isExpanded = expandedFolders.has(currentPath);

      if (node.type === 'folder') {
        return (
          <div key={currentPath}>
            <div
              className="flex items-center gap-1.5 py-1.5 px-2 cursor-pointer hover:bg-white/[0.03] rounded-md transition-colors"
              onClick={() => toggleFolder(currentPath)}
            >
              {isExpanded ? (
                <ChevronDown className="w-3.5 h-3.5 text-[#8b949e]" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5 text-[#8b949e]" />
              )}
              {isExpanded ? (
                <FolderOpen className="w-4 h-4 text-cyan-400" />
              ) : (
                <Folder className="w-4 h-4 text-cyan-400/70" />
              )}
              <span className="text-xs font-medium text-[#e6edf3]">{node.name}</span>
            </div>
            {isExpanded && node.children && (
              <div className="ml-4 border-l border-[#21262d] pl-2">
                {renderTree(node.children, currentPath)}
              </div>
            )}
          </div>
        );
      }

      return (
        <div
          key={currentPath}
          className={`flex items-center gap-1.5 py-1.5 px-2 cursor-pointer hover:bg-white/[0.03] rounded-md transition-colors ${
            selectedFile?.name === node.name ? 'bg-cyan-500/10 border border-cyan-500/20' : ''
          }`}
          onClick={() => setSelectedFile(node)}
        >
          <span className="w-3.5" />
          <FileCode className="w-4 h-4 text-emerald-400" />
          <span className={`text-xs ${selectedFile?.name === node.name ? 'text-cyan-400' : 'text-[#8b949e]'}`}>
            {node.name}
          </span>
        </div>
      );
    });
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl h-[85vh] flex rounded-xl overflow-hidden border border-[#21262d] bg-[#0d1117] shadow-2xl">
        {/* Sidebar */}
        <div className="w-72 border-r border-[#21262d] bg-[#06080e] overflow-y-auto">
          <div className="p-4 border-b border-[#21262d] flex items-center justify-between">
            <h3 className="text-xs font-semibold text-[#8b949e] uppercase tracking-wider flex items-center gap-2">
              <Terminal className="w-3.5 h-3.5" />
              SCAIO Backend
            </h3>
            <button onClick={onClose} className="text-[#8b949e] hover:text-white transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="p-2">
            {renderTree(fileStructure)}
          </div>
        </div>

        {/* Code Viewer */}
        <div className="flex-1 flex flex-col bg-[#0d1117]">
          <div className="px-4 py-3 border-b border-[#21262d] flex items-center justify-between">
            <div className="flex items-center gap-2">
              {selectedFile ? (
                <>
                  <FileCode className="w-4 h-4 text-emerald-400" />
                  <span className="text-sm font-medium text-[#e6edf3]">{selectedFile.name}</span>
                  <span className="text-[10px] text-[#8b949e] terminal-font">
                    {selectedFile.content?.split('\n').length} lines
                  </span>
                </>
              ) : (
                <span className="text-sm text-[#8b949e]">Selecione um arquivo</span>
              )}
            </div>
          </div>
          <div className="flex-1 overflow-auto p-4">
            {selectedFile?.content ? (
              <pre className="text-xs terminal-font text-[#8b949e] leading-relaxed">
                <code>{selectedFile.content}</code>
              </pre>
            ) : (
              <div className="flex items-center justify-center h-full text-[#8b949e]">
                <div className="text-center">
                  <FileCode className="w-12 h-12 mx-auto mb-3 opacity-20" />
                  <p className="text-sm">Nenhum arquivo selecionado</p>
                  <p className="text-xs mt-1 opacity-50">Clique em um arquivo na árvore</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
