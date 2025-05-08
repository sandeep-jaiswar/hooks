import { useRef, useEffect } from 'react';

/**
 * Custom hook that returns the previous value of a state or prop.
 *
 * This is useful when you need to compare the previous and current values of a state or prop.
 *
 * @param value - The current value of the state or prop.
 *
 * @returns The previous value of the state or prop.
 *
 * @example
 * const [count, setCount] = useState(0);
 * const prevCount = usePrevious(count);
 *
 * useEffect(() => {
 *   if (prevCount !== undefined) {
 *     console.log(`Previous count: ${prevCount}`);
 *   }
 * }, [count, prevCount]);
 */
export const usePrevious = <T>(value: T): T | undefined => {
  // Ref to hold the previous value
  const ref = useRef<T | undefined>(undefined);

  // Update the ref with the current value on each render
  useEffect(() => {
    ref.current = value;
  }, [value]); // Effect runs when the value changes

  // Return the previous value (stored in ref)
  return ref.current;
};
