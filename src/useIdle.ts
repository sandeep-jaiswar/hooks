import { useState, useEffect, useRef } from 'react';

/**
 * Custom hook to detect user inactivity based on a specified timeout.
 *
 * The hook will return `true` if the user has been idle for the specified amount of time (in milliseconds),
 * and `false` otherwise. The idle state is reset on any user interaction such as mouse movement, key press, or scroll.
 *
 * @param timeout The time duration (in milliseconds) after which the user is considered idle.
 *
 * @returns {boolean} Whether the user is idle or not.
 *
 * @example
 * const isIdle = useIdle(5000); // user is considered idle after 5 seconds of inactivity
 */
export const useIdle = (timeout: number): boolean => {
  const [isIdle, setIsIdle] = useState(false);
  const timeoutId = useRef<NodeJS.Timeout | null>(null);

  const resetTimer = () => {
    // Clear the previous timeout if any
    if (timeoutId.current) {
      clearTimeout(timeoutId.current);
    }

    // Set a new timeout
    timeoutId.current = setTimeout(() => setIsIdle(true), timeout);
  };

  useEffect(() => {
    // Add event listeners for user activity
    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('keydown', resetTimer);
    window.addEventListener('scroll', resetTimer);

    // Initialize the timer on component mount
    resetTimer();

    // Cleanup event listeners and timeout on unmount
    return () => {
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keydown', resetTimer);
      window.removeEventListener('scroll', resetTimer);
      if (timeoutId.current) {
        clearTimeout(timeoutId.current);
      }
    };
  }, [timeout]); // The effect will rerun if the timeout value changes

  return isIdle;
};
