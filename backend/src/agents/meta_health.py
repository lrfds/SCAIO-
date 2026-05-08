"""
SCAIO Meta-Health Agent
Supervisor do Supervisor - última camada de defesa.

Responsabilidades:
- Monitorar o Health Agent
- Auto-restart com backoff exponencial
- Escalonamento para humano via WhatsApp
- Garantir que nenhum ponto de falha silencioso exista
"""

from typing import Dict, Any, Optional
from datetime import datetime, timedelta
import asyncio
import math

from src.cognitive.state import HealthState
from src.config.settings import settings


class MetaHealthAgent:
    """
    Supervisor Final (Meta-Health).
    
    Camada 4 da arquitetura de supervisão:
    Agent → Health Agent → Meta-Health Agent → systemd
    """
    
    def __init__(self):
        self.name = "MetaHealthAgent"
        self.version = "1.0.0"
        self.state = HealthState.GREEN
        
        # Métricas
        self.watchdog_cycles = 0
        self.restarts_performed = 0
        self.escalations_performed = 0
        self.last_check: datetime = datetime.now()
        
        # Backoff exponencial
        self.restart_count = 0
        self.max_restarts = 5
        self.base_delay = 1  # segundos
        self.max_delay = 300  # 5 minutos
        
        # Estado do Health Agent monitorado
        self.health_agent_state: Optional[str] = None
        self.health_agent_last_seen: Optional[datetime] = None
    
    def check_watchdog(self, health_agent_state: str) -> HealthState:
        """
        Executa verificação do Health Agent.
        
        Args:
            health_agent_state: Estado atual do Health Agent
            
        Returns:
            Estado de saúde do Meta-Health
        """
        self.watchdog_cycles += 1
        self.last_check = datetime.now()
        self.health_agent_state = health_agent_state
        self.health_agent_last_seen = datetime.now()
        
        # Verifica se Health Agent está respondendo
        if health_agent_state == "unknown":
            return self._handle_health_agent_failure()
        
        # Verifica estado do Health Agent
        if health_agent_state == "red":
            self.state = HealthState.ORANGE
        elif health_agent_state == "orange":
            self.state = HealthState.YELLOW
        else:
            self.state = HealthState.GREEN
            self.restart_count = 0  # Reseta backoff
        
        return self.state
    
    def _handle_health_agent_failure(self) -> HealthState:
        """
        Trata falha do Health Agent.
        
        Implementa auto-restart com backoff exponencial.
        """
        self.state = HealthState.ORANGE
        
        # Calcula delay com backoff exponencial
        delay = self._calculate_backoff_delay()
        
        print(f"[{self.name}] ⚠️ Health Agent não respondendo. Backoff: {delay}s")
        
        if self.restart_count < self.max_restarts:
            # Tenta restart
            self.restart_count += 1
            self.restarts_performed += 1
            
            print(f"[{self.name}] 🔄 Reinício {self.restart_count}/{self.max_restarts}")
            
            return HealthState.YELLOW  # Em processo de restart
        else:
            # Escalona para humano
            self.state = HealthState.RED
            self.escalations_performed += 1
            
            print(f"[{self.name}] 🚨 Escalonamento para humano necessário!")
            
            return HealthState.RED
    
    def _calculate_backoff_delay(self) -> int:
        """
        Calcula delay com backoff exponencial.
        
        Fórmula: min(base_delay * 2^restart_count, max_delay)
        """
        delay = self.base_delay * (2 ** self.restart_count)
        return min(delay, self.max_delay)
    
    def should_escalate_to_human(self) -> bool:
        """
        Verifica se deve escalar para humano.
        
        Critérios:
        - Health Agent falhou após todas as tentativas de restart
        - Sistema em estado RED por tempo prolongado
        """
        if self.restart_count >= self.max_restarts:
            return True
        
        if self.state == HealthState.RED:
            return True
        
        return False
    
    def get_escalation_message(self) -> Dict[str, Any]:
        """
        Gera mensagem de escalonamento para humano.
        
        Returns:
            Dicionário com informações para alerta
        """
        return {
            "level": "CRITICAL",
            "system": "SCAIO",
            "message": f"Escalonamento manual necessário. Health Agent em estado {self.health_agent_state}",
            "restart_attempts": self.restart_count,
            "timestamp": datetime.now().isoformat(),
            "action_required": "Verificar logs e reiniciar manualmente se necessário"
        }
    
    def get_metrics(self) -> Dict[str, Any]:
        """Retorna métricas do Meta-Health Agent"""
        return {
            "name": self.name,
            "version": self.version,
            "state": self.state.value,
            "watchdog_cycles": self.watchdog_cycles,
            "restarts_performed": self.restarts_performed,
            "escalations_performed": self.escalations_performed,
            "restart_count": self.restart_count,
            "max_restarts": self.max_restarts,
            "last_check": self.last_check.isoformat(),
            "health_agent_state": self.health_agent_state
        }
    
    def reset(self):
        """Reseta contadores e estado"""
        self.restart_count = 0
        self.state = HealthState.GREEN
