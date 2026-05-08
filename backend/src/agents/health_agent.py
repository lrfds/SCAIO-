"""
SCAIO Health Agent
Supervisor Principal que monitora todos os agentes operacionais.

Responsabilidades:
- Coleta métricas de todos os agentes
- Classifica estado de saúde (GREEN/YELLOW/ORANGE/RED)
- Executa ações corretivas automáticas
- Escalona para Meta-Health quando necessário
"""

from typing import Dict, Any, List
from datetime import datetime, timedelta
from enum import Enum

from src.cognitive.state import HealthState
from src.config.settings import settings


class HealthCheckStatus(Enum):
    """Status de uma verificação individual"""
    PASSED = "passed"
    WARNING = "warning"
    FAILED = "failed"


class HealthAgent:
    """
    Supervisor Principal de Saúde do Sistema.
    
    Monitora continuamente os agentes e toma ações
    corretivas quando necessário.
    """
    
    def __init__(self):
        self.name = "HealthAgent"
        self.version = "1.0.0"
        self.state = HealthState.GREEN
        
        # Métricas
        self.checks_performed = 0
        self.alerts_triggered = 0
        self.last_check: datetime = datetime.now()
        self.consecutive_failures = 0
        
        # Histórico de estado
        self.state_history: List[Dict[str, Any]] = []
        
        # Sensores
        self.sensors = {
            "score_monitor": True,
            "success_rate_monitor": True,
            "response_time_monitor": True,
            "memory_health_monitor": True
        }
    
    def check_health(self, agent_metrics: Dict[str, Any]) -> HealthState:
        """
        Executa verificação de saúde completa.
        
        Args:
            agent_metrics: Métricas do agente a ser verificado
            
        Returns:
            Novo estado de saúde
        """
        self.checks_performed += 1
        self.last_check = datetime.now()
        
        issues = []
        
        # 1. Verifica score médio
        avg_score = agent_metrics.get("avg_score", 0)
        if avg_score < 4.0:
            issues.append(("critical", f"Score muito baixo: {avg_score}"))
        elif avg_score < 7.0:
            issues.append(("warning", f"Score abaixo do ideal: {avg_score}"))
        
        # 2. Verifica taxa de sucesso
        success_rate = agent_metrics.get("success_rate", 0)
        if success_rate < settings.MIN_SUCCESS_RATE:
            issues.append(("warning", f"Taxa de sucesso: {success_rate}%"))
        
        # 3. Verifica último status
        last_status = agent_metrics.get("last_task_status")
        if last_status == "escalated":
            issues.append(("critical", "Última tarefa escalada"))
        
        # Classifica estado
        new_state = self._classify_state(issues)
        
        # Atualiza contagem de falhas consecutivas
        if new_state in [HealthState.ORANGE, HealthState.RED]:
            self.consecutive_failures += 1
        else:
            self.consecutive_failures = 0
        
        # Verifica threshold de falhas consecutivas
        if self.consecutive_failures >= settings.CONSECUTIVE_FAILURES_THRESHOLD:
            new_state = HealthState.RED
        
        # Registra mudança de estado
        if new_state != self.state:
            self._record_state_change(new_state, issues)
            self.state = new_state
        
        return self.state
    
    def _classify_state(self, issues: List[tuple]) -> HealthState:
        """Classifica estado baseado nos problemas encontrados"""
        
        critical_count = sum(1 for severity, _ in issues if severity == "critical")
        warning_count = sum(1 for severity, _ in issues if severity == "warning")
        
        if critical_count > 0:
            return HealthState.RED
        elif warning_count >= 2:
            return HealthState.ORANGE
        elif warning_count == 1:
            return HealthState.YELLOW
        else:
            return HealthState.GREEN
    
    def _record_state_change(self, new_state: HealthState, issues: List[tuple]):
        """Registra mudança de estado para auditoria"""
        
        record = {
            "timestamp": datetime.now().isoformat(),
            "previous_state": self.state.value,
            "new_state": new_state.value,
            "issues": [
                {"severity": sev, "message": msg}
                for sev, msg in issues
            ]
        }
        
        self.state_history.append(record)
        
        # Mantém apenas últimos 100 registros
        if len(self.state_history) > 100:
            self.state_history = self.state_history[-100:]
    
    def should_alert(self, alert_type: str) -> bool:
        """
        Verifica se deve enviar alerta (respecta cooldown).
        
        Args:
            alert_type: Tipo do alerta
            
        Returns:
            True se deve alertar
        """
        now = datetime.now()
        cooldown = timedelta(minutes=settings.WHATSAPP_COOLDOWN_MINUTES)
        
        # Verifica último alerta do mesmo tipo
        for record in reversed(self.state_history):
            if record.get("alert_type") == alert_type:
                last_alert = datetime.fromisoformat(record["timestamp"])
                if now - last_alert < cooldown:
                    return False
        
        return True
    
    def get_metrics(self) -> Dict[str, Any]:
        """Retorna métricas do Health Agent"""
        return {
            "name": self.name,
            "version": self.version,
            "state": self.state.value,
            "checks_performed": self.checks_performed,
            "alerts_triggered": self.alerts_triggered,
            "consecutive_failures": self.consecutive_failures,
            "last_check": self.last_check.isoformat(),
            "sensors": self.sensors
        }
    
    def get_state_color(self) -> str:
        """Retorna cor associada ao estado"""
        colors = {
            HealthState.GREEN: "#00ff88",
            HealthState.YELLOW: "#ffd700",
            HealthState.ORANGE: "#ff9900",
            HealthState.RED: "#ff4444"
        }
        return colors.get(self.state, "#888888")
