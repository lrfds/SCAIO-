"""
SCAIO Validation Tools
Ferramentas de avaliação de qualidade (Supervisor Cognitivo)
"""

from typing import List, Dict, Any, Optional
from datetime import datetime


class QualityEvaluator:
    """
    Supervisor que avalia a qualidade das ações do agente executor.
    
    Responsabilidade: VETO cognitivo - pode rejeitar entregas de baixa qualidade
    
    Analogia Jurídica: Limiar de Materialidade
    """
    
    def __init__(self, min_score_threshold: float = 7.0):
        self.min_score = min_score_threshold
        self.evaluations_performed = 0
    
    async def evaluate_batch(self, results: List[Dict]) -> float:
        """
        Avalia um lote de resultados e retorna score médio.
        
        Args:
            results: Lista de resultados para avaliar
            
        Returns:
            Score médio (0-10)
        """
        if not results:
            return 0.0
        
        scores = []
        for result in results:
            score = await self._evaluate_single(result)
            scores.append(score)
        
        self.evaluations_performed += 1
        
        return sum(scores) / len(scores)
    
    async def _evaluate_single(self, result: Dict) -> float:
        """
        Avalia um único resultado.
        
        Critérios de avaliação:
        1. Fonte confiável (.gov.br) - 20%
        2. Informações completas - 30%
        3. Data dentro do prazo - 25%
        4. Relevância para busca - 25%
        
        Args:
            result: Resultado para avaliar
            
        Returns:
            Score de 0 a 10
        """
        score = 0.0
        
        # 1. Avalia fonte
        url = result.get("url", "")
        if ".gov.br" in url:
            score += 2.0  # 20% de 10
        
        # 2. Avalia completude
        title = result.get("title", "")
        snippet = result.get("content_snippet", result.get("snippet", ""))
        
        if title and len(title) > 10:
            score += 1.5
        if snippet and len(snippet) > 50:
            score += 1.5
        
        # 3. Avalia data (simplificado)
        collected_at = result.get("collected_at", "")
        if collected_at:
            try:
                collected = datetime.fromisoformat(collected_at)
                days_old = (datetime.now() - collected).days
                if days_old < 7:
                    score += 2.5
                elif days_old < 30:
                    score += 2.0
                else:
                    score += 1.0
            except:
                score += 1.5
        else:
            score += 1.5
        
        # 4. Avalia relevância (baseado em keywords)
        keywords_relevance = self._check_relevance(result)
        score += keywords_relevance * 2.5
        
        return min(score, 10.0)
    
    def _check_relevance(self, result: Dict) -> float:
        """
        Verifica relevância do resultado (0-1).
        
        Args:
            result: Resultado para verificar
            
        Returns:
            Score de relevância
        """
        text = f"{result.get('title', '')} {result.get('content_snippet', '')}".lower()
        
        high_relevance = ["edital", "chamamento público", "pregão eletrônico"]
        medium_relevance = ["licitação", "contratação", "aquisição"]
        
        for keyword in high_relevance:
            if keyword in text:
                return 1.0
        
        for keyword in medium_relevance:
            if keyword in text:
                return 0.7
        
        return 0.4
    
    def should_approve(self, score: float) -> bool:
        """
        Verifica se o score aprova o resultado.
        
        Args:
            score: Score avaliado
            
        Returns:
            True se aprovado
        """
        return score >= self.min_score
    
    def get_metrics(self) -> Dict[str, Any]:
        """Retorna métricas do avaliador"""
        return {
            "min_score_threshold": self.min_score,
            "evaluations_performed": self.evaluations_performed
        }
