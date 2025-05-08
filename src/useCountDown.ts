import { useState, useEffect } from 'react';

interface UseCountDownOptions {
  startTime: number; // The initial time in seconds
  onComplete?: () => void; // Callback when the countdown completes
}

export const useCountDown = ({ startTime, onComplete }: UseCountDownOptions) => {
  const [timeLeft, setTimeLeft] = useState(startTime);
  const [isActive, setIsActive] = useState(false);

  // Start or reset the countdown
  const startCountdown = () => {
    setIsActive(true);
  };

  // Pause the countdown
  const pauseCountdown = () => {
    setIsActive(false);
  };

  // Reset the countdown
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

    return () => clearInterval(interval); // Cleanup on component unmount
  }, [isActive, timeLeft, onComplete]);

  return {
    timeLeft,
    isActive,
    startCountdown,
    pauseCountdown,
    resetCountdown,
  };
};
