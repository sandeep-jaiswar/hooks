import { useState, useEffect } from 'react';

/**
 * @function useFetch
 * @description A custom hook that fetches data from a given URL with optional fetch options.
 * It tracks the loading state, fetched data, and any errors encountered during the fetch process.
 *
 * @param {UseFetchOptions} options - The options object containing the URL and optional fetch settings.
 * @param {string} options.url - The URL to fetch data from.
 * @param {RequestInit} [options.options] - Optional fetch options (headers, method, etc.).
 *
 * @returns {UseFetchResponse<T>} The hook returns the fetch status, including:
 *   - `data`: The fetched data (or `null` if no data is fetched yet or an error occurred).
 *   - `loading`: A boolean indicating whether the fetch request is in progress.
 *   - `error`: A string representing any error message encountered during the fetch.
 *
 * @example
 * const { data, loading, error } = useFetch({ url: 'https://api.example.com/data' });
 */
interface UseFetchOptions {
  url: string; // The URL to fetch data from.
  options?: RequestInit; // Optional fetch options, like headers, method, etc.
}

interface UseFetchResponse<T> {
  data: T | null; // The fetched data (or null if no data is fetched yet or an error occurred).
  loading: boolean; // Whether the request is in progress.
  error: string | null; // Error message or null if no error.
}

export const useFetch = <T>({ url, options }: UseFetchOptions): UseFetchResponse<T> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(url, options);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        setData(result);
        setLoading(false);
      } catch (err: unknown) {
        setError((err as Error).message || 'Something went wrong');
        setLoading(false);
      }
    };

    fetchData();
  }, [url, options]); // Re-run effect when URL or options change

  return { data, loading, error };
};
