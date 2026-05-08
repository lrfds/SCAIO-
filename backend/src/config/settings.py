"""
SCAIO Configuration Settings
Configurações centralizadas do sistema
"""

from pydantic_settings import BaseSettings
from typing import List, Optional
from pydantic import Field


class Settings(BaseSettings):
    """Configurações centralizadas do SCAIO"""
    
    # API
    API_HOST: str = Field(default="0.0.0.0")
    API_PORT: int = Field(default=8000)
    API_KEY: str = Field(default="scaio_super_secret_key_2026")
    
    # WebSocket
    WEBSOCKET_ENABLED: bool = Field(default=True)
    
    # Databases
    POSTGRES_URL: str = Field(default="postgresql://scaio:scaio_pass@localhost:5432/scaio")
    QDRANT_URL: str = Field(default="http://localhost:6333")
    REDIS_URL: str = Field(default="redis://localhost:6379")
    
    # Qdrant Collections
    QDRANT_SEMANTIC_COLLECTION: str = Field(default="semantic_memory")
    QDRANT_PROCEDURAL_COLLECTION: str = Field(default="procedural_memory")
    
    # Quality Thresholds
    MIN_QUALITY_SCORE: float = Field(default=7.0, ge=0.0, le=10.0)
    MAX_RETRIES: int = Field(default=3, ge=1, le=10)
    MIN_SUCCESS_RATE: float = Field(default=70.0, ge=0.0, le=100.0)
    
    # Monitoring
    HEALTH_CHECK_INTERVAL: int = Field(default=60, ge=10)
    MAX_SILENCE_MINUTES: int = Field(default=30)
    CONSECUTIVE_FAILURES_THRESHOLD: int = Field(default=3)
    
    # Alerting
    WHATSAPP_ENABLED: bool = Field(default=False)
    WHATSAPP_COOLDOWN_MINUTES: int = Field(default=60)
    WHATSAPP_RECIPIENTS: List[str] = Field(default_factory=list)
    ALERT_COOLDOWN_SECONDS: int = Field(default=3600)
    
    # Evolution API (WhatsApp)
    EVOLUTION_API_URL: str = Field(default="http://localhost:8080")
    EVOLUTION_API_KEY: str = Field(default="")
    EVOLUTION_INSTANCE: str = Field(default="scaio_agent")
    
    # Agents
    EDITAL_HUNTER_ENABLED: bool = Field(default=True)
    HEALTH_AGENT_ENABLED: bool = Field(default=True)
    META_HEALTH_ENABLED: bool = Field(default=True)
    
    # LLM Models
    LLM_MODEL_HEAVY: str = Field(default="groq/llama-3-70b")
    LLM_MODEL_LIGHT: str = Field(default="ollama/phi")
    GROQ_API_KEY: Optional[str] = Field(default=None)
    OLLAMA_URL: str = Field(default="http://localhost:11434")
    
    # Logging
    LOG_LEVEL: str = Field(default="INFO")
    LOG_FILE: str = Field(default="/var/log/scaio/scaio.log")
    
    # Search Configuration
    DEFAULT_SEARCH_DOMAINS: List[str] = Field(default_factory=lambda: [".gov.br"])
    DEFAULT_KEYWORDS: List[str] = Field(default_factory=lambda: ["edital", "chamamento público", "chamada pública"])
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        extra = "ignore"


settings = Settings()
