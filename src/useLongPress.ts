import { useState, useEffect, useRef, useCallback } from 'react';

interface UseLongPressOptions {
  onLongPress?: () => void;
  onPress?: () => void;
  threshold?: number;
}

export const useLongPress = ({ onLongPress, onPress, threshold = 500 }: UseLongPressOptions = {}): [
  React.RefObject<HTMLElement | null>,
  boolean,
] => {
  const [isPressed, setIsPressed] = useState<boolean>(false);
  const [isLongPress, setIsLongPress] = useState<boolean>(false);
  const pressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const elementRef = useRef<HTMLElement | null>(null);

  const handleMouseDown = useCallback(() => {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
    }
    setIsPressed(true);
    pressTimer.current = setTimeout(() => {
      setIsLongPress(true);
      if (onLongPress) {
        onLongPress();
      }
    }, threshold);
  }, [onLongPress, threshold]);

  const handleMouseUp = useCallback(() => {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
    }
    setIsPressed(false);
    if (!isLongPress && onPress) {
      onPress();
    }
  }, [isLongPress, onPress]);

  const handleTouchStart = useCallback(() => {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
    }
    setIsPressed(true);
    pressTimer.current = setTimeout(() => {
      setIsLongPress(true);
      if (onLongPress) {
        onLongPress();
      }
    }, threshold);
  }, [onLongPress, threshold]);

  const handleTouchEnd = useCallback(() => {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
    }
    setIsPressed(false);
    if (!isLongPress && onPress) {
      onPress();
    }
  }, [isLongPress, onPress]);

  const handleTouchMove = useCallback(() => {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
    }
  }, []);

  useEffect(() => {
    const element = elementRef.current;

    if (element) {
      element.addEventListener('mousedown', handleMouseDown);
      element.addEventListener('mouseup', handleMouseUp);
      element.addEventListener('mouseleave', handleMouseUp);
      element.addEventListener('touchstart', handleTouchStart);
      element.addEventListener('touchend', handleTouchEnd);
      element.addEventListener('touchmove', handleTouchMove);

      return () => {
        element.removeEventListener('mousedown', handleMouseDown);
        element.removeEventListener('mouseup', handleMouseUp);
        element.removeEventListener('mouseleave', handleMouseUp);
        element.removeEventListener('touchstart', handleTouchStart);
        element.removeEventListener('touchend', handleTouchEnd);
        element.removeEventListener('touchmove', handleTouchMove);
      };
    }
  }, [handleMouseDown, handleMouseUp, handleTouchStart, handleTouchEnd, handleTouchMove]);

  return [elementRef, isPressed];
};
