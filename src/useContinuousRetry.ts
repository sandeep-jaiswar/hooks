import { useState, useEffect, useCallback } from 'react';

/**
 * @interface UseContinuousRetryOptions
 * @description Configuration options for the `useContinuousRetry` hook.
 * @property {number} [retries=5] - Maximum number of retry attempts before giving up.
 * @property {number} [interval=2000] - Time interval in milliseconds between retry attempts.
 */
interface UseContinuousRetryOptions {
  retries?: number;
  interval?: number;
}

/**
 * @function useContinuousRetry
 * @description Custom React hook to continuously retry an asynchronous function until it succeeds or the maximum number of retries is reached.
 *
 * @param {() => Promise<unknown>} callback - An async function that will be retried on failure.
 * @param {UseContinuousRetryOptions} [options={ retries: 5, interval: 2000 }] - Optional settings for retry behavior.
 * @returns {{
 *   isLoading: boolean;
 *   error: Error | null;
 *   retryCount: number;
 * }} - Returns loading state, the last encountered error, and the number of retry attempts made.
 */
export const useContinuousRetry = (
  callback: () => Promise<unknown>,
  options: UseContinuousRetryOptions = { retries: 5, interval: 2000 }
) => {
  const { retries = 5, interval = 2000 } = options;

  const [retryCount, setRetryCount] = useState(0);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Executes the callback and retries on failure until retry limit is reached.
   */
  const executeRetry = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      await callback();
      setIsLoading(false);
    } catch (err) {
      if (retryCount < retries) {
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

      return () => clearInterval(retryTimer);
    }
  }, [executeRetry, interval, retryCount, retries]);

  return {
    isLoading,
    error,
    retryCount,
  };
};
