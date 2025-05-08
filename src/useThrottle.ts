import { useEffect, useRef, useState } from 'react';

/**
 * Custom hook that throttles the updates of a value to avoid frequent updates within a short duration.
 *
 * This is useful for limiting updates to a state or value that changes frequently, such as during scrolling,
 * resizing, or typing events.
 *
 * @param value - The value to be throttled.
 * @param delay - The delay in milliseconds to throttle the updates.
 *
 * @returns The throttled value, which only updates after the specified delay.
 *
 * @example
 * const [scrollPosition, setScrollPosition] = useState(0);
 * const throttledScrollPosition = useThrottle(scrollPosition, 200);
 *
 * useEffect(() => {
 *   console.log(throttledScrollPosition); // Logs the scroll position only after every 200ms.
 * }, [throttledScrollPosition]);
 */
export const useThrottle = <T>(value: T, delay: number): T => {
  // State to store the throttled value
  const [throttledValue, setThrottledValue] = useState<T>(value);

  // Ref to keep track of the last time the value was updated
  const lastExecuted = useRef<number>(Date.now());

  useEffect(() => {
    // Set up a timeout to throttle updates based on the delay
    const handler = setTimeout(() => {
      if (Date.now() - lastExecuted.current >= delay) {
        setThrottledValue(value);
        lastExecuted.current = Date.now(); // Update the last executed time
      }
    }, delay);

    // Cleanup the timeout on component unmount or value change
    return () => clearTimeout(handler);
  }, [value, delay]); // Effect runs whenever `value` or `delay` changes

  return throttledValue;
};
