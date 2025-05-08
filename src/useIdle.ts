import { useState, useEffect } from 'react';

export const useIdle = (timeout: number): boolean => {
  const [isIdle, setIsIdle] = useState(false);
  let timeoutId: NodeJS.Timeout;

  const resetTimer = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => setIsIdle(true), timeout);
  };

  useEffect(() => {
    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('keydown', resetTimer);
    window.addEventListener('scroll', resetTimer);

    resetTimer(); // Initialize the timer on component mount

    return () => {
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keydown', resetTimer);
      window.removeEventListener('scroll', resetTimer);
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [timeout]);

  return isIdle;
};
