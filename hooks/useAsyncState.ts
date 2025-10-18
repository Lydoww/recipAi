/**
 * Hook personnalisé pour gérer les états async avec TypeScript
 */

import { useState, useCallback } from 'react';
import { AsyncState } from '../types';

export function useAsyncState<T>(
  initialData: T | null = null
): AsyncState<T> & {
  setData: (data: T) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
} {
  const [data, setData] = useState<T | null>(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reset = useCallback(() => {
    setData(initialData);
    setLoading(false);
    setError(null);
  }, [initialData]);

  return {
    data,
    loading,
    error,
    setData,
    setLoading,
    setError,
    reset,
  };
}
