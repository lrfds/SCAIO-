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
        self.available = False
        self.semantic_collection = settings.QDRANT_SEMANTIC_COLLECTION
        self.procedural_collection = settings.QDRANT_PROCEDURAL_COLLECTION
        self.vector_size = 1536
        try:
            self.client = QdrantClient(url=settings.QDRANT_URL, timeout=5)
            self._ensure_collections()
            self.available = True
        except Exception:
            self.client = None
    
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
        if not self.available:
            return str(uuid.uuid4())
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
        if not self.available:
            return str(uuid.uuid4())
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
        if not self.available:
            return []
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
        if not self.available:
            return []
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
        if not self.available:
            return {
                self.semantic_collection: {"vectors_count": 0, "status": "unavailable"},
                self.procedural_collection: {"vectors_count": 0, "status": "unavailable"},
            }
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
