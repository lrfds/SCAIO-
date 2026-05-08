"""
SCAIO Qdrant Memory Client
Interface para memória persistente (semântica + procedural)
"""

from qdrant_client import QdrantClient
from qdrant_client.models import (
    Distance, VectorParams, PointStruct, 
    Filter, FieldCondition, MatchValue
)
import uuid
from typing import List, Dict, Any, Optional
import numpy as np

from src.config.settings import settings


class QdrantMemory:
    """
    Interface para memória persistente do sistema.
    
    Responsabilidades:
    - Memória Semântica: fatos e conteúdo dos editais
    - Memória Procedural: estratégias e workflows aprendidos
    """
    
    def __init__(self):
        self.client = QdrantClient(url=settings.QDRANT_URL)
        self.semantic_collection = settings.QDRANT_SEMANTIC_COLLECTION
        self.procedural_collection = settings.QDRANT_PROCEDURAL_COLLECTION
        self.vector_size = 1536  # OpenAI embedding size
        
        self._ensure_collections()
    
    def _ensure_collections(self):
        """Garante que as coleções existam"""
        collections = [c.name for c in self.client.get_collections().collections]
        
        if self.semantic_collection not in collections:
            self.client.create_collection(
                collection_name=self.semantic_collection,
                vectors_config=VectorParams(
                    size=self.vector_size,
                    distance=Distance.COSINE
                )
            )
        
        if self.procedural_collection not in collections:
            self.client.create_collection(
                collection_name=self.procedural_collection,
                vectors_config=VectorParams(
                    size=self.vector_size,
                    distance=Distance.COSINE
                )
            )
    
    def _get_embedding(self, text: str) -> List[float]:
        """
        Gera embedding para o texto.
        
        TODO: Integrar com modelo real (OpenAI, Groq, or local)
        """
        # Embedding simulado para demonstração
        np.random.seed(hash(text) % 2**32)
        embedding = np.random.randn(self.vector_size).tolist()
        # Normaliza
        norm = np.linalg.norm(embedding)
        return [x / norm for x in embedding]
    
    async def save_semantic(
        self, 
        content: str, 
        source: str, 
        metadata: Dict[str, Any]
    ) -> str:
        """
        Salva memória semântica (fatos sobre editais).
        
        Args:
            content: Conteúdo textual do fato
            source: URL ou identificação da fonte
            metadata: Metadados adicionais
            
        Returns:
            ID do ponto salvo
        """
        point_id = str(uuid.uuid4())
        vector = self._get_embedding(content)
        
        self.client.upsert(
            collection_name=self.semantic_collection,
            points=[PointStruct(
                id=point_id,
                vector=vector,
                payload={
                    "content": content,
                    "source": source,
                    "type": "semantic",
                    **metadata
                }
            )]
        )
        return point_id
    
    async def save_procedural(
        self,
        strategy: Dict[str, Any],
        performance: Dict[str, Any],
        context: str
    ) -> str:
        """
        Salva memória procedural (como fazer).
        
        Armazena estratégias que funcionaram ou falharam,
        permitindo aprendizado contínuo.
        
        Args:
            strategy: Estratégia utilizada
            performance: Métricas de desempenho
            context: Contexto da execução
            
        Returns:
            ID do ponto salvo
        """
        point_id = str(uuid.uuid4())
        text_rep = f"{context} {strategy}"
        vector = self._get_embedding(text_rep)
        
        self.client.upsert(
            collection_name=self.procedural_collection,
            points=[PointStruct(
                id=point_id,
                vector=vector,
                payload={
                    "type": "procedural",
                    "strategy": strategy,
                    "performance": performance,
                    "context": context
                }
            )]
        )
        return point_id
    
    async def search_procedural(
        self, 
        query: str, 
        limit: int = 5
    ) -> List[Dict[str, Any]]:
        """
        Busca estratégias similares na memória procedural.
        
        Utilizado pelo agente para aprender com execuções anteriores.
        
        Args:
            query: Consulta textual
            limit: Número máximo de resultados
            
        Returns:
            Lista de estratégias similares com scores
        """
        vector = self._get_embedding(query)
        
        results = self.client.search(
            collection_name=self.procedural_collection,
            query_vector=vector,
            limit=limit
        )
        
        return [
            {
                "id": str(hit.id),
                "score": hit.score,
                "payload": hit.payload
            }
            for hit in results
        ]
    
    async def search_semantic(
        self,
        query: str,
        limit: int = 10,
        filter_type: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        """
        Busca fatos semânticos.
        
        Args:
            query: Consulta textual
            limit: Número máximo de resultados
            filter_type: Filtro por tipo (opcional)
            
        Returns:
            Lista de fatos com scores de similaridade
        """
        vector = self._get_embedding(query)
        
        query_filter = None
        if filter_type:
            query_filter = Filter(
                must=[FieldCondition(
                    key="type",
                    match=MatchValue(value=filter_type)
                )]
            )
        
        results = self.client.search(
            collection_name=self.semantic_collection,
            query_vector=vector,
            query_filter=query_filter,
            limit=limit
        )
        
        return [
            {
                "id": str(hit.id),
                "score": hit.score,
                "payload": hit.payload
            }
            for hit in results
        ]
    
    async def delete_point(
        self,
        collection: str,
        point_id: str
    ) -> bool:
        """
        Remove um ponto da memória.
        
        Args:
            collection: Nome da coleção
            point_id: ID do ponto
            
        Returns:
            True se removido com sucesso
        """
        try:
            self.client.delete(
                collection_name=collection,
                points_selector=[point_id]
            )
            return True
        except Exception:
            return False
    
    def get_collection_stats(self) -> Dict[str, Any]:
        """
        Retorna estatísticas das coleções.
        
        Returns:
            Dicionário com contagens e tamanhos
        """
        stats = {}
        
        for collection_name in [self.semantic_collection, self.procedural_collection]:
            try:
                info = self.client.get_collection(collection_name)
                stats[collection_name] = {
                    "vectors_count": info.vectors_count,
                    "status": info.status.name
                }
            except Exception:
                stats[collection_name] = {
                    "vectors_count": 0,
                    "status": "error"
                }
        
        return stats
