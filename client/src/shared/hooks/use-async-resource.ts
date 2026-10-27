import { useCallback, useEffect, useRef, useState } from 'react';

interface AsyncResource<T> {
  data?: T;
  error?: unknown;
  isLoading: boolean;
  reload: () => Promise<void>;
}

export const useAsyncResource = <T>(
  load: () => Promise<T>,
): AsyncResource<T> => {
  const requestId = useRef(0);
  const [data, setData] = useState<T>();
  const [error, setError] = useState<unknown>();
  const [isLoading, setIsLoading] = useState(true);

  const reload = useCallback(async () => {
    const currentRequestId = ++requestId.current;
    setIsLoading(true);
    setError(undefined);

    try {
      const result = await load();
      if (currentRequestId === requestId.current) {
        setData(result);
      }
    } catch (loadError) {
      if (currentRequestId === requestId.current) {
        setError(loadError);
      }
    } finally {
      if (currentRequestId === requestId.current) {
        setIsLoading(false);
      }
    }
  }, [load]);

  useEffect(() => {
    void reload();

    return () => {
      requestId.current += 1;
    };
  }, [reload]);

  return { data, error, isLoading, reload };
};
