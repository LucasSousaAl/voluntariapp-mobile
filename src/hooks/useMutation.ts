import { useCallback, useRef, useState } from 'react';

interface UseMutationResult<TArgs extends any[], TResult> {
  /** Run the async action; resolves with the result or throws. */
  mutate: (...args: TArgs) => Promise<TResult>;
  loading: boolean;
  error: Error | null;
  reset: () => void;
}

/**
 * Custom mutation hook for POST/PUT/DELETE actions (Etapa 1, item 3).
 * Tracks loading/error and guards against state updates after unmount.
 */
export function useMutation<TArgs extends any[] = any[], TResult = any>(
  fn: (...args: TArgs) => Promise<TResult>,
): UseMutationResult<TArgs, TResult> {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const mountedRef = useRef(true);
  // Avoid stale closures if the caller passes an inline function.
  const fnRef = useRef(fn);
  fnRef.current = fn;

  const mutate = useCallback(async (...args: TArgs): Promise<TResult> => {
    setLoading(true);
    setError(null);
    try {
      return await fnRef.current(...args);
    } catch (err: any) {
      const e = err instanceof Error ? err : new Error(String(err));
      if (mountedRef.current) setError(e);
      throw e;
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setError(null);
    setLoading(false);
  }, []);

  return { mutate, loading, error, reset };
}
