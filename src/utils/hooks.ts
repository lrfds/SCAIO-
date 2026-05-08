/**
 * Hook customizado para requisições à API SCAIO
 */

import { useState, useCallback, useEffect } from 'react';
import * as api from './api';

export interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: api.ApiError | null;
}

/**
 * Hook para obter métricas dos agentes
 */
export function useMetrics(interval: number = 5000) {
  const [state, setState] = useState<UseApiState<api.MetricsResponse>>({
    data: null,
    loading: true,
    error: null,
  });

  const fetchMetrics = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      const data = await api.getMetrics();
      setState({ data, loading: false, error: null });
    } catch (error) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: error as api.ApiError,
      }));
    }
  }, []);

  useEffect(() => {
    fetchMetrics();
    const intervalId = setInterval(fetchMetrics, interval);
    return () => clearInterval(intervalId);
  }, [fetchMetrics, interval]);

  return { ...state, refetch: fetchMetrics };
}

/**
 * Hook para verificar saúde da API
 */
export function useHealth(interval: number = 10000) {
  const [state, setState] = useState<UseApiState<api.HealthResponse>>({
    data: null,
    loading: true,
    error: null,
  });

  const fetchHealth = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      const data = await api.checkHealth();
      setState({ data, loading: false, error: null });
    } catch (error) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: error as api.ApiError,
      }));
    }
  }, []);

  useEffect(() => {
    fetchHealth();
    const intervalId = setInterval(fetchHealth, interval);
    return () => clearInterval(intervalId);
  }, [fetchHealth, interval]);

  return { ...state, refetch: fetchHealth };
}

/**
 * Hook para buscar editais
 */
export function useSearch() {
  const [state, setState] = useState<UseApiState<api.SearchResult>>({
    data: null,
    loading: false,
    error: null,
  });

  const search = useCallback(async (description: string, cnpj?: string) => {
    try {
      setState({ data: null, loading: true, error: null });
      const result = await api.searchEditais(description, cnpj);
      setState({ data: result, loading: false, error: null });
      return result;
    } catch (error) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: error as api.ApiError,
      }));
      throw error;
    }
  }, []);

  return { ...state, search };
}

/**
 * Hook para obter estatísticas da memória
 */
export function useMemoryStats(interval: number = 30000) {
  const [state, setState] = useState<UseApiState<api.MemoryStats>>({
    data: null,
    loading: true,
    error: null,
  });

  const fetchStats = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      const data = await api.getMemoryStats();
      setState({ data, loading: false, error: null });
    } catch (error) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: error as api.ApiError,
      }));
    }
  }, []);

  useEffect(() => {
    fetchStats();
    const intervalId = setInterval(fetchStats, interval);
    return () => clearInterval(intervalId);
  }, [fetchStats, interval]);

  return { ...state, refetch: fetchStats };
}

/**
 * Hook para WebSocket de métricas em tempo real
 */
export function useMetricsWebSocket() {
  const [state, setState] = useState<UseApiState<api.MetricsResponse>>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let ws: WebSocket | null = null;

    try {
      ws = api.connectWebSocket(
        (data) => {
          setState({ data, loading: false, error: null });
        },
        () => {
          setState((prev) => ({
            ...prev,
            error: {
              status: 0,
              message: 'WebSocket connection error',
            },
          }));
        }
      );
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: error as api.ApiError,
      }));
    }

    return () => {
      if (ws) ws.close();
    };
  }, []);

  return state;
}
