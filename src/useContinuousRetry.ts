import { useState, useEffect, useCallback } from 'react';

interface UseContinuousRetryOptions {
  retries?: number; // The maximum number of retries
  interval?: number; // The interval (in milliseconds) between each retry
}

export const useContinuousRetry = (
  callback: () => Promise<any>, // The function to retry
  options: UseContinuousRetryOptions = { retries: 5, interval: 2000 }
) => {
  const { retries = 5, interval = 2000 } = options;
  const [retryCount, setRetryCount] = useState(0);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const executeRetry = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      await callback(); // Attempt the callback function
      setIsLoading(false);
    } catch (err) {
      if (retryCount < retries) {
        // Retry if the max retries haven't been reached
        setRetryCount((prev) => prev + 1);
      } else {
        setIsLoading(false);
        setError(err instanceof Error ? err : new Error('Unknown error'));
      }
    }
  }, [callback, retries, retryCount]);

  useEffect(() => {
    if (retryCount <= retries) {
      const retryTimer = setInterval(() => {
        executeRetry();
      }, interval);

      return () => clearInterval(retryTimer); // Cleanup on unmount
    }
  }, [executeRetry, interval, retryCount, retries]);

  return { isLoading, error, retryCount };
};
