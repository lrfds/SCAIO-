# SCAIO Backend - Tests

"""
Teste do EditalHunter agent
"""

import pytest
import pytest_asyncio
from unittest.mock import Mock, patch, AsyncMock


class TestEditalHunter:
    """Testes unitários do EditalHunter"""

    @pytest.mark.asyncio
    async def test_execute_cycle(self):
        """Testa execução de ciclo cognitivo completo"""
        mock_memory = AsyncMock()
        mock_memory.search_procedural.return_value = []
        
        mock_scraper = AsyncMock()
        mock_scraper.search.return_value = [
            {"url": "https://gov.br/edital", "title": "Edital Test"}
        ]
        
        from src.agents.edital_hunter import EditalHunter
        
        with patch('src.agents.edital_hunter.QdrantMemory', return_value=mock_memory):
            with patch('src.agents.edital_hunter.WebScraper', return_value=mock_scraper):
                hunter = EditalHunter()
                hunter.graph = AsyncMock()
                hunter.graph.ainvoke.return_value = {
                    "evaluation_result": "approved",
                    "avg_score": 8.5,
                    "retry_count": 0
                }
                
                result = await hunter.execute({"description": "Buscar editais"})
                
                assert result["evaluation_result"] == "approved"
                assert hunter.health_state.value == "green"
                assert hunter.total_cycles == 1
                assert hunter.successful_cycles == 1


class TestHealthAgent:
    """Testes unitários do Health Agent"""

    def test_classify_health_green(self):
        """Testa classificação GREEN (sem falhas)"""
        from src.agents.health_agent import HealthAgent
        
        agent = HealthAgent(agents=["EditalHunter"])
        agent.consecutive_failures = 0
        
        assert agent.classify_health().value == "green"

    def test_classify_health_yellow(self):
        """Testa classificação YELLOW (1 falha)"""
        from src.agents.health_agent import HealthAgent
        
        agent = HealthAgent(agents=["EditalHunter"])
        agent.consecutive_failures = 1
        
        assert agent.classify_health().value == "yellow"

    def test_classify_health_orange(self):
        """Testa classificação ORANGE (2+ falhas)"""
        from src.agents.health_agent import HealthAgent
        
        agent = HealthAgent(agents=["EditalHunter"])
        agent.consecutive_failures = 2
        
        assert agent.classify_health().value == "orange"

    def test_classify_health_red(self):
        """Testa classificação RED (threshold exceeded)"""
        from src.config.settings import Settings
        
        settings = Settings()
        agent = HealthAgent(agents=["EditalHunter"])
        agent.consecutive_failures = settings.CONSECUTIVE_FAILURES_THRESHOLD
        
        assert agent.classify_health().value == "red"


class TestSLMRouter:
    """Testes unitários do SLM Router"""

    def test_route_selects_top_domains(self):
        """Testa que roteador seleciona domínios relevantes"""
        from src.cognitive.slm_router import SLMRouter, Domain
        
        router = SLMRouter()
        
        domains = router.route(
            query="edital de licitação pregão eletrônico",
            context={}
        )
        
        assert len(domains) <= 3  # Máximo 3 domínios
        assert len(domains) >= 1  # Mínimo 1 domínio
        assert Domain.LICITACOES in domains

    def test_consumption_metrics(self):
        """Testa métricas de consumo"""
        from src.cognitive.slm_router import SLMRouter
        
        router = SLMRouter()
        metrics = router.get_consumption_metrics()
        
        assert "total_energy" in metrics
        assert "avg_energy_per_inference" in metrics
        assert metrics["estimated_savings_vs_llm"] == 90
        assert metrics["cost_per_1k_inferences_usd"] == 0.15


class TestPrecedentTokens:
    """Testes unitários do sistema de tokens"""

    @pytest.mark.asyncio
    async def test_mint_and_burn_token(self):
        """Testa criação e queima de token"""
        from src.cognitive.precedent_tokens import PrecedentTokenRegistry
        
        registry = PrecedentTokenRegistry()
        
        token = await registry.mint_token(
            decision="edital_analyzed",
            domain="licitacoes",
            context="org_123",
            value_score=0.8
        )
        
        assert token.token_id is not None
        assert not token.burned
        assert registry.get_pool_value() == 0.8
        
        credit = await registry.burn_token(token.token_id, "used_for_analysis")
        
        assert credit > 0
        assert token.burned
        assert token.burn_reason == "used_for_analysis"

    def test_statistics(self):
        """Testa estatísticas do registro"""
        from src.cognitive.precedent_tokens import PrecedentTokenRegistry
        
        registry = PrecedentTokenRegistry()
        stats = registry.get_statistics()
        
        assert "total_tokens" in stats
        assert "active_tokens" in stats
        assert "burned_tokens" in stats
        assert "pool_value" in stats


class TestBiasDetector:
    """Testes unitários do detector de vieses"""

    def test_generate_adversarial_tests(self):
        """Testa geração de testes adversários"""
        from src.cognitive.bias_adversary import BiasAdversarialDetector
        
        detector = BiasAdversarialDetector()
        tests = detector.generate_adversarial_tests(n=5)
        
        assert len(tests) == 5
        for test in tests:
            assert "case" in test
            assert "bias_type" in test
            assert "expected_response" in test

    def test_should_recalibrate(self):
        """Testa lógica de recalibração"""
        from src.cognitive.bias_adversary import BiasAdversarialDetector
        
        detector = BiasAdversarialDetector()
        
        assert not detector.should_recalibrate()
        
        detector.bias_scores["racial"] = [0.2] * 15
        
        assert detector.should_recalibrate()

    @pytest.mark.asyncio
    async def test_recalibrate_resets_scores(self):
        """Testa que recalibração reseta scores"""
        from src.cognitive.bias_adversary import BiasAdversarialDetector
        
        detector = BiasAdversarialDetector()
        detector.bias_scores["gender"] = [0.3] * 20
        
        result = await detector.recalibrate()
        
        assert result["status"] == "completed"
        assert all(len(scores) == 0 for scores in detector.bias_scores.values())
        assert detector.recalibrations == 1


class TestSemanticCache:
    """Testes unitários do cache semântico"""

    def test_store_and_retrieve(self):
        """Testa armazenamento e recuperação do cache"""
        from src.cognitive.semantic_cache import SemanticPredictiveCache
        
        cache = SemanticPredictiveCache()
        
        query_hash = cache.store(
            query="Qual edital para inovação?",
            response={"title": "Edital Inovação 2026"}
        )
        
        result = cache.retrieve(query="Qual edital para inovação?")
        
        assert result is not None
        assert result["cached"] is True
        assert result["response"]["title"] == "Edital Inovação 2026"

    def test_cache_stats(self):
        """Testa estatísticas do cache"""
        from src.cognitive.semantic_cache import SemanticPredictiveCache
        
        cache = SemanticPredictiveCache()
        cache.store("query1", {"response": "data1"})
        cache.retrieve("query1")
        cache.retrieve("nonexistent")
        
        stats = cache.get_cache_stats()
        
        assert stats["size"] == 1
        assert stats["hits"] == 1
        assert stats["misses"] == 1
        assert stats["hit_rate"] == 0.5


class TestCognitiveState:
    """Testes unitários do estado cognitivo"""

    def test_initial_state(self):
        """Testa criação de estado cognitivo"""
        from src.cognitive.state import CognitiveState, ExecutionStatus, HealthState
        from datetime import datetime
        
        state: CognitiveState = {
            "task_id": "test_001",
            "agent_name": "TestAgent",
            "agent_version": "1.0.0",
            "task_description": "Test task",
            "strategy": {},
            "current_step": 0,
            "total_steps": 0,
            "collected_data": [],
            "sources": [],
            "source_scores": [],
            "avg_score": 0.0,
            "evaluation_result": "",
            "rejection_reason": None,
            "successful_patterns": [],
            "failed_patterns": [],
            "lessons_learned": "",
            "procedural_memory_hits": [],
            "semantic_memory_hits": [],
            "retry_count": 0,
            "max_retries": 3,
            "status": ExecutionStatus.PLANNING,
            "health_state": HealthState.GREEN,
            "started_at": datetime.now(),
            "last_updated": datetime.now(),
            "final_result": None,
            "full_history": []
        }
        
        assert state["status"] == ExecutionStatus.PLANNING
        assert state["health_state"] == HealthState.GREEN


class TestSettings:
    """Testes unitários de configurações"""

    def test_default_settings(self):
        """Testa configurações padrão"""
        from src.config.settings import Settings
        
        settings = Settings()
        
        assert settings.MIN_QUALITY_SCORE == 7.0
        assert settings.MAX_RETRIES == 3
        assert settings.HEALTH_CHECK_INTERVAL == 60
        assert settings.CONSECUTIVE_FAILURES_THRESHOLD == 3
        assert settings.WHATSAPP_ENABLED is False

    def test_quality_score_bounds(self):
        """Testa limites do score de qualidade"""
        from src.config.settings import Settings
        
        settings = Settings(MIN_QUALITY_SCORE=0.0)
        assert settings.MIN_QUALITY_SCORE == 0.0
        
        settings = Settings(MIN_QUALITY_SCORE=10.0)
        assert settings.MIN_QUALITY_SCORE == 10.0
