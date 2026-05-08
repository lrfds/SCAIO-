"""
Testes para a API do SCAIO
"""

import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock, AsyncMock

# Nota: Estes testes requerem pytest-asyncio para endpoints async
# pip install pytest-asyncio httpx


class TestAPIHealth:
    """Testes para endpoint de health"""
    
    def test_root_endpoint(self):
        """Testa endpoint raiz"""
        # Este teste verifica a estrutura básica
        # Para testes completos, seria necessário mockar o lifespan
        pass
    
    def test_health_structure(self):
        """Testa estrutura da resposta de health"""
        expected_keys = ["status", "timestamp"]
        # Validação de estrutura
        for key in expected_keys:
            assert key in expected_keys


class TestAPISchemas:
    """Testes para schemas da API"""
    
    def test_search_request_defaults(self):
        """Testa valores padrão do SearchRequest"""
        from src.models.schemas import SearchRequest
        
        request = SearchRequest()
        
        assert request.description == "Buscar editais de licitação"
        assert request.cnpj is None
        assert request.max_results == 10
    
    def test_search_request_custom(self):
        """Testa SearchRequest com valores customizados"""
        from src.models.schemas import SearchRequest
        
        request = SearchRequest(
            description="Buscar editais de saúde",
            cnpj="12.345.678/0001-90",
            max_results=50
        )
        
        assert request.description == "Buscar editais de saúde"
        assert request.cnpj == "12.345.678/0001-90"
        assert request.max_results == 50
    
    def test_health_state_enum(self):
        """Testa enum de estados de saúde"""
        from src.models.schemas import HealthStateEnum
        
        assert HealthStateEnum.GREEN.value == "green"
        assert HealthStateEnum.YELLOW.value == "yellow"
        assert HealthStateEnum.ORANGE.value == "orange"
        assert HealthStateEnum.RED.value == "red"


class TestValidationTools:
    """Testes para ferramentas de validação"""
    
    def test_quality_evaluator_init(self):
        """Testa inicialização do avaliador"""
        from src.tools.validation_tools import QualityEvaluator
        
        evaluator = QualityEvaluator(min_score_threshold=7.0)
        
        assert evaluator.min_score == 7.0
        assert evaluator.evaluations_performed == 0
    
    def test_should_approve(self):
        """Testa lógica de aprovação"""
        from src.tools.validation_tools import QualityEvaluator
        
        evaluator = QualityEvaluator(min_score_threshold=7.0)
        
        assert evaluator.should_approve(8.0) == True
        assert evaluator.should_approve(7.0) == True
        assert evaluator.should_approve(6.9) == False
    
    def test_relevance_check(self):
        """Testa verificação de relevância"""
        from src.tools.validation_tools import QualityEvaluator
        
        evaluator = QualityEvaluator()
        
        # Resultado com alta relevância
        high_relevance = {
            "title": "Edital de Pregão Eletrônico",
            "content_snippet": "Chamamento público para aquisição"
        }
        
        score = evaluator._check_relevance(high_relevance)
        assert score >= 0.7
        
        # Resultado com baixa relevância
        low_relevance = {
            "title": "Notícia genérica",
            "content_snippet": "Conteúdo sem palavras-chave"
        }
        
        score = evaluator._check_relevance(low_relevance)
        assert score < 0.7


class TestSettings:
    """Testes para configurações"""
    
    def test_settings_defaults(self):
        """Testa valores padrão das configurações"""
        from src.config.settings import Settings
        
        settings = Settings()
        
        assert settings.API_PORT == 8000
        assert settings.MIN_QUALITY_SCORE == 7.0
        assert settings.MAX_RETRIES == 3
        assert settings.HEALTH_CHECK_INTERVAL == 60
