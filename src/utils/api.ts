/**
 * Utilitários para requisições à API SCAIO
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export interface ApiError {
  status: number;
  message: string;
  detail?: string;
}

export interface HealthResponse {
  status: string;
  timestamp: string;
  agents: {
    edital_hunter: AgentMetrics | null;
    health_agent: HealthAgentMetrics | null;
    meta_health: MetaHealthMetrics | null;
  };
}

export interface AgentMetrics {
  name: string;
  version: string;
  avg_score: number;
  total_cycles: number;
  successful_cycles: number;
  success_rate: number;
  health_state: string;
  last_task_status: string | null;
}

export interface HealthAgentMetrics {
  name: string;
  version: string;
  state: string;
  checks_performed: number;
  alerts_triggered: number;
  consecutive_failures: number;
  sensors: Record<string, boolean>;
}

export interface MetaHealthMetrics {
  name: string;
  version: string;
  state: string;
  watchdog_cycles: number;
  restarts_performed: number;
  escalations_performed: number;
}

export interface MetricsResponse {
  timestamp: string;
  edital_hunter: AgentMetrics | null;
  health_agent: HealthAgentMetrics | null;
  meta_health: MetaHealthMetrics | null;
}

export interface SearchResult {
  success: boolean;
  score: number;
  opportunities: Array<{
    title: string;
    url?: string;
    score: number;
    domain?: string;
  }>;
  retry_count: number;
  lessons_learned?: string;
  history: Array<Record<string, any>>;
}

export interface MemoryStats {
  semantic_memory?: { vectors_count: number; status: string };
  procedural_memory?: { vectors_count: number; status: string };
  [key: string]: any;
}

/**
 * Função auxiliar para tratar erros de API
 */
function handleApiError(response: Response): never {
  const error: ApiError = {
    status: response.status,
    message: `HTTP ${response.status}: ${response.statusText}`,
  };
  throw error;
}

/**
 * Health check da API
 */
export async function checkHealth(): Promise<HealthResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      handleApiError(response);
    }

    return await response.json();
  } catch (error) {
    console.error('Health check failed:', error);
    throw error;
  }
}

/**
 * Obter métricas dos agentes
 */
export async function getMetrics(): Promise<MetricsResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/metrics`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      handleApiError(response);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to fetch metrics:', error);
    throw error;
  }
}

/**
 * Buscar editais
 */
export async function searchEditais(
  description: string,
  cnpj?: string
): Promise<SearchResult> {
  try {
    const params = new URLSearchParams();
    params.append('description', description);
    if (cnpj) params.append('cnpj', cnpj);

    const response = await fetch(`${API_BASE_URL}/api/search?${params}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      handleApiError(response);
    }

    return await response.json();
  } catch (error) {
    console.error('Search failed:', error);
    throw error;
  }
}

/**
 * Obter status de saúde detalhado
 */
export async function getHealthDetail(): Promise<HealthAgentMetrics> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/health-detail`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      handleApiError(response);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to fetch health detail:', error);
    throw error;
  }
}

/**
 * Obter estatísticas da memória
 */
export async function getMemoryStats(): Promise<MemoryStats> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/memory/stats`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      handleApiError(response);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to fetch memory stats:', error);
    throw error;
  }
}

/**
 * Buscar na memória
 */
export async function searchMemory(
  query: string,
  memoryType: 'procedural' | 'semantic' = 'procedural',
  limit: number = 10
): Promise<{ results: Array<Record<string, any>> }> {
  try {
    const params = new URLSearchParams();
    params.append('query', query);
    params.append('memory_type', memoryType);
    params.append('limit', limit.toString());

    const response = await fetch(`${API_BASE_URL}/api/memory/search?${params}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      handleApiError(response);
    }

    return await response.json();
  } catch (error) {
    console.error('Memory search failed:', error);
    throw error;
  }
}

/**
 * Resetar agente
 */
export async function resetAgent(): Promise<{ message: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/agent/reset`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      handleApiError(response);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to reset agent:', error);
    throw error;
  }
}

/**
 * Conectar WebSocket para métricas em tempo real
 */
export function connectWebSocket(
  onMessage: (data: MetricsResponse) => void,
  onError?: (error: Event) => void
): WebSocket {
  const wsUrl = `${API_BASE_URL.replace('http', 'ws')}/ws`;
  const ws = new WebSocket(wsUrl);

  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      if (data.type === 'metrics') {
        onMessage(data.data);
      }
    } catch (error) {
      console.error('WebSocket message parsing failed:', error);
    }
  };

  ws.onerror = (error) => {
    console.error('WebSocket error:', error);
    if (onError) onError(error);
  };

  return ws;
}
