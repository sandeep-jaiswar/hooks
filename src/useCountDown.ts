import { useState, useEffect } from 'react';

/**
 * @interface UseCountDownOptions
 * @description Options for configuring the countdown timer.
 * @property {number} startTime - The initial countdown time in seconds.
 * @property {() => void} [onComplete] - Optional callback invoked when the countdown reaches zero.
 */
interface UseCountDownOptions {
  startTime: number;
  onComplete?: () => void;
}

/**
 * @function useCountDown
 * @description A custom hook for managing a countdown timer.
 *
 * @param {UseCountDownOptions} options - Configuration for the countdown behavior.
 * @returns {{
 *   timeLeft: number;
 *   isActive: boolean;
 *   startCountdown: () => void;
 *   pauseCountdown: () => void;
 *   resetCountdown: () => void;
 * }}
 * Countdown state and control functions.
 *
 * @example
 * const {
 *   timeLeft,
 *   isActive,
 *   startCountdown,
 *   pauseCountdown,
 *   resetCountdown
 * } = useCountDown({ startTime: 60, onComplete: () => alert('Done!') });
 */
export const useCountDown = ({ startTime, onComplete }: UseCountDownOptions) => {
  const [timeLeft, setTimeLeft] = useState(startTime);
  const [isActive, setIsActive] = useState(false);

  /**
   * Starts or resumes the countdown.
   */
  const startCountdown = () => {
    setIsActive(true);
  };

  /**
   * Pauses the countdown.
   */
  const pauseCountdown = () => {
    setIsActive(false);
  };

  /**
   * Resets the countdown to the initial startTime.
   */
  const resetCountdown = () => {
    setTimeLeft(startTime);
    setIsActive(false);
  };

  useEffect(() => {
    if (!isActive || timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        const newTimeLeft = prev - 1;
        if (newTimeLeft <= 0 && onComplete) {
          onComplete(); // Trigger the onComplete callback if provided
        }
        return newTimeLeft;
      });
    }, 1000);

    return () => clearInterval(interval); // Clear interval on unmount or change
  }, [isActive, timeLeft, onComplete]);

  return {
    timeLeft,
    isActive,
    startCountdown,
    pauseCountdown,
    resetCountdown,
  };
};
