"""
SCAIO Test Configuration
"""

import pytest
from unittest.mock import MagicMock, AsyncMock


@pytest.fixture
def mock_memory():
    """Mock do QdrantMemory para testes"""
    memory = MagicMock()
    memory.search_procedural = AsyncMock(return_value=[])
    memory.search_semantic = AsyncMock(return_value=[])
    memory.save_semantic = AsyncMock(return_value="test-id")
    memory.save_procedural = AsyncMock(return_value="test-id")
    return memory


@pytest.fixture
def sample_task():
    """Tarefa de exemplo para testes"""
    return {
        "description": "Buscar editais de licitação para equipamentos médicos",
        "cnpj": "12.345.678/0001-90",
        "user_id": "user_123"
    }


@pytest.fixture
def sample_agent_metrics():
    """Métricas de exemplo de um agente"""
    return {
        "name": "EditalHunter",
        "version": "1.0.0",
        "avg_score": 8.5,
        "total_cycles": 10,
        "successful_cycles": 9,
        "success_rate": 90.0,
        "health_state": "green",
        "last_task_status": "approved"
    }


@pytest.fixture
def healthy_metrics():
    """Métricas de agente saudável"""
    return {
        "avg_score": 9.0,
        "success_rate": 95.0,
        "last_task_status": "approved"
    }


@pytest.fixture
def warning_metrics():
    """Métricas de agente com atenção"""
    return {
        "avg_score": 6.0,
        "success_rate": 65.0,
        "last_task_status": "approved"
    }


@pytest.fixture
def critical_metrics():
    """Métricas de agente em estado crítico"""
    return {
        "avg_score": 3.0,
        "success_rate": 30.0,
        "last_task_status": "escalated"
    }
