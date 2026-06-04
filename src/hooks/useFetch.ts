import { useCallback, useEffect, useRef, useState } from 'react';
import { api } from '@/lib/api';

interface UseFetchOptions<T> {
  /** Query string params forwarded to the API. */
  query?: Record<string, string | number | boolean | undefined | null>;
  /** Don't fetch automatically on mount (call refetch() yourself). */
  enabled?: boolean;
  /** Seed value shown before the first response (e.g. cached data). */
  initialData?: T | null;
  /** Transform the raw payload before it hits state. */
  select?: (raw: any) => T;
}

interface UseFetchResult<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  /** Re-run the request. */
  refetch: () => Promise<void>;
  setData: React.Dispatch<React.SetStateAction<T | null>>;
}

/**
 * Custom data hook: GET a path with loading/error/refetch state (Etapa 1, item 3).
 * Handles network errors and unmount safety.
 */
export function useFetch<T = any>(
  path: string | null,
  opts: UseFetchOptions<T> = {},
): UseFetchResult<T> {
  const { query, enabled = true, initialData = null, select } = opts;
  const [data, setData] = useState<T | null>(initialData);
  const [loading, setLoading] = useState<boolean>(enabled && !!path);
  const [error, setError] = useState<Error | null>(null);
  const mountedRef = useRef(true);
  // Keep the latest query/select in refs so the callback identity stays stable
  // even when callers pass inline objects/functions (avoids refetch loops).
  const queryRef = useRef(query);
  queryRef.current = query;
  const selectRef = useRef(select);
  selectRef.current = select;

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const refetch = useCallback(async () => {
    if (!path) return;
    setLoading(true);
    setError(null);
    try {
      const raw = await api.get(path, { query: queryRef.current });
      if (!mountedRef.current) return;
      const sel = selectRef.current;
      setData(sel ? sel(raw) : (raw as T));
    } catch (err: any) {
      if (mountedRef.current) setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, [path]);

  useEffect(() => {
    if (enabled && path) refetch();
  }, [enabled, path, refetch]);

  return { data, loading, error, refetch, setData };
}
