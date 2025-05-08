import { useEffect, useState } from 'react';

/**
 * @function useDebounce
 * @description A custom hook that debounces a given value for a specified delay time.
 * The debounced value will only be updated after the specified delay has passed without
 * the value changing.
 *
 * @template T
 * @param {T} value - The value that needs to be debounced.
 * @param {number} delay - The debounce delay in milliseconds.
 * @returns {T} The debounced value.
 *
 * @example
 * const debouncedSearchTerm = useDebounce(searchTerm, 500);
 */
export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Set up a timeout to update the debounced value after the specified delay
    const handler = setTimeout(() => setDebouncedValue(value), delay);

    // Clean up the timeout if value or delay changes
    return () => clearTimeout(handler);
  }, [value, delay]); // Dependencies: value and delay

  return debouncedValue;
};
