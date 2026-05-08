"""
Testes para os Agentes do SCAIO
"""

import pytest
from datetime import datetime

from src.cognitive.state import (
    CognitiveState, 
    ExecutionStatus, 
    HealthState,
    create_initial_state
)
from src.agents.health_agent import HealthAgent
from src.agents.meta_health import MetaHealthAgent


class TestCognitiveState:
    """Testes para o estado cognitivo"""
    
    def test_create_initial_state(self):
        """Testa criação de estado inicial"""
        task = {
            "description": "Buscar editais de saúde",
            "cnpj": "12.345.678/0001-90"
        }
        
        state = create_initial_state(task)
        
        assert state["task_description"] == "Buscar editais de saúde"
        assert state["org_cnpj"] == "12.345.678/0001-90"
        assert state["status"] == ExecutionStatus.PLANNING
        assert state["health_state"] == HealthState.GREEN
        assert state["retry_count"] == 0
        assert state["avg_score"] == 0.0
    
    def test_execution_status_values(self):
        """Testa valores do ExecutionStatus"""
        assert ExecutionStatus.PLANNING.value == "planning"
        assert ExecutionStatus.EXECUTING.value == "executing"
        assert ExecutionStatus.EVALUATING.value == "evaluating"
        assert ExecutionStatus.COMPLETED.value == "completed"
        assert ExecutionStatus.ESCALATED.value == "escalated"
    
    def test_health_state_values(self):
        """Testa valores do HealthState"""
        assert HealthState.GREEN.value == "green"
        assert HealthState.YELLOW.value == "yellow"
        assert HealthState.ORANGE.value == "orange"
        assert HealthState.RED.value == "red"


class TestHealthAgent:
    """Testes para o Health Agent"""
    
    def setup_method(self):
        """Configuração antes de cada teste"""
        self.health_agent = HealthAgent()
    
    def test_initial_state(self):
        """Testa estado inicial"""
        assert self.health_agent.state == HealthState.GREEN
        assert self.health_agent.checks_performed == 0
        assert self.health_agent.consecutive_failures == 0
    
    def test_healthy_agent(self):
        """Testa verificação de agente saudável"""
        metrics = {
            "avg_score": 8.5,
            "success_rate": 95.0,
            "last_task_status": "approved"
        }
        
        state = self.health_agent.check_health(metrics)
        
        assert state == HealthState.GREEN
        assert self.health_agent.checks_performed == 1
    
    def test_warning_agent(self):
        """Testa detecção de estado amarelo"""
        metrics = {
            "avg_score": 6.5,  # Abaixo do ideal
            "success_rate": 60.0,
            "last_task_status": "approved"
        }
        
        state = self.health_agent.check_health(metrics)
        
        assert state == HealthState.YELLOW
    
    def test_critical_agent(self):
        """Testa detecção de estado vermelho"""
        metrics = {
            "avg_score": 3.0,  # Muito baixo
            "success_rate": 30.0,
            "last_task_status": "escalated"
        }
        
        state = self.health_agent.check_health(metrics)
        
        assert state == HealthState.RED
    
    def test_consecutive_failures(self):
        """Testa contagem de falhas consecutivas"""
        metrics_critical = {
            "avg_score": 3.0,
            "last_task_status": "failed"
        }
        
        # Executa várias vezes
        for _ in range(3):
            self.health_agent.check_health(metrics_critical)
        
        assert self.health_agent.consecutive_failures >= 3
    
    def test_metrics(self):
        """Testa retorno de métricas"""
        metrics = self.health_agent.get_metrics()
        
        assert "name" in metrics
        assert "state" in metrics
        assert "checks_performed" in metrics
        assert metrics["name"] == "HealthAgent"


class TestMetaHealthAgent:
    """Testes para o Meta-Health Agent"""
    
    def setup_method(self):
        """Configuração antes de cada teste"""
        self.meta_health = MetaHealthAgent()
    
    def test_initial_state(self):
        """Testa estado inicial"""
        assert self.meta_health.state == HealthState.GREEN
        assert self.meta_health.watchdog_cycles == 0
        assert self.meta_health.restart_count == 0
    
    def test_healthy_watchdog(self):
        """Testa verificação quando Health Agent está OK"""
        state = self.meta_health.check_watchdog("green")
        
        assert state == HealthState.GREEN
        assert self.meta_health.watchdog_cycles == 1
    
    def test_failing_watchdog(self):
        """Testa detecção de falha no Health Agent"""
        state = self.meta_health.check_watchdog("unknown")
        
        assert state in [HealthState.YELLOW, HealthState.ORANGE, HealthState.RED]
    
    def test_backoff_calculation(self):
        """Testa cálculo de backoff exponencial"""
        # Testa diferentes contagens de restart
        self.meta_health.restart_count = 0
        delay0 = self.meta_health._calculate_backoff_delay()
        
        self.meta_health.restart_count = 1
        delay1 = self.meta_health._calculate_backoff_delay()
        
        self.meta_health.restart_count = 2
        delay2 = self.meta_health._calculate_backoff_delay()
        
        # Backoff deve aumentar exponencialmente
        assert delay1 > delay0
        assert delay2 > delay1
    
    def test_escalation_needed(self):
        """Testa necessidade de escalonamento"""
        # Quando restart_count >= max_restarts
        self.meta_health.restart_count = 5
        self.meta_health.max_restarts = 5
        
        assert self.meta_health.should_escalate_to_human() == True
    
    def test_escalation_message(self):
        """Testa geração de mensagem de escalonamento"""
        self.meta_health.restart_count = 5
        self.meta_health.health_agent_state = "red"
        
        message = self.meta_health.get_escalation_message()
        
        assert message["level"] == "CRITICAL"
        assert message["system"] == "SCAIO"
        assert "restart_attempts" in message
    
    def test_metrics(self):
        """Testa retorno de métricas"""
        metrics = self.meta_health.get_metrics()
        
        assert "name" in metrics
        assert "state" in metrics
        assert "watchdog_cycles" in metrics
        assert metrics["name"] == "MetaHealthAgent"


class TestEditalHunterMetrics:
    """Testes para métricas do EditalHunter (sem LLM)"""
    
    def test_metrics_structure(self):
        """Testa estrutura das métricas"""
        from src.agents.edital_hunter import EditalHunter
        
        hunter = EditalHunter()
        metrics = hunter.get_metrics()
        
        assert "name" in metrics
        assert "version" in metrics
        assert "avg_score" in metrics
        assert "total_cycles" in metrics
        assert "successful_cycles" in metrics
        assert "success_rate" in metrics
        assert "health_state" in metrics
        assert metrics["name"] == "EditalHunter"
