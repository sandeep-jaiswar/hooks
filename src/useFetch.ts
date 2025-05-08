import { useState, useEffect } from 'react';

interface UseFetchOptions {
  url: string;
  options?: RequestInit; // Optional fetch options, like headers, method, etc.
}

interface UseFetchResponse<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
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
      } catch (err: any) {
        setError(err.message || 'Something went wrong');
        setLoading(false);
      }
    };

    fetchData();
  }, [url, options]); // Re-run effect when URL or options change

  return { data, loading, error };
};
