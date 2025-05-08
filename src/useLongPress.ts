import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Custom hook to detect long press events on an element.
 * It tracks whether the element is being pressed and detects if it was a long press.
 *
 * @param options - Options for customizing the long press behavior.
 * @param options.onLongPress - Callback triggered when the long press is detected.
 * @param options.onPress - Callback triggered when the press is detected but not long enough.
 * @param options.threshold - Time in milliseconds for detecting a long press (default: 500ms).
 *
 * @returns A tuple containing a ref to attach to the element and a boolean indicating if it's being pressed.
 *
 * @example
 * const [longPressRef, isPressed] = useLongPress({
 *   onLongPress: () => console.log('Long press detected!'),
 *   onPress: () => console.log('Short press detected!'),
 * });
 *
 * return <button ref={longPressRef}>Press me</button>;
 */
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

  // Handle the start of a mouse press (mousedown or touchstart)
  const handleMouseDown = useCallback(() => {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current); // Clear any previous timer
    }
    setIsPressed(true);
    pressTimer.current = setTimeout(() => {
      setIsLongPress(true);
      if (onLongPress) {
        onLongPress(); // Trigger the onLongPress callback
      }
    }, threshold);
  }, [onLongPress, threshold]);

  // Handle mouse or touch release (mouseup or touchend)
  const handleMouseUp = useCallback(() => {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current); // Clear the timeout if the press is released
    }
    setIsPressed(false);
    if (!isLongPress && onPress) {
      onPress(); // Trigger the onPress callback if it wasn't a long press
    }
  }, [isLongPress, onPress]);

  // Handle touchmove to cancel the long press detection
  const handleTouchMove = useCallback(() => {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current); // Cancel long press if the touch moves
    }
  }, []);

  useEffect(() => {
    const element = elementRef.current;

    // Ensure the element exists before attaching event listeners
    if (element) {
      element.addEventListener('mousedown', handleMouseDown);
      element.addEventListener('mouseup', handleMouseUp);
      element.addEventListener('mouseleave', handleMouseUp); // Handle mouse leaving the element
      element.addEventListener('touchstart', handleMouseDown);
      element.addEventListener('touchend', handleMouseUp);
      element.addEventListener('touchmove', handleTouchMove);

      // Cleanup listeners on component unmount
      return () => {
        element.removeEventListener('mousedown', handleMouseDown);
        element.removeEventListener('mouseup', handleMouseUp);
        element.removeEventListener('mouseleave', handleMouseUp);
        element.removeEventListener('touchstart', handleMouseDown);
        element.removeEventListener('touchend', handleMouseUp);
        element.removeEventListener('touchmove', handleTouchMove);
      };
    }

    return undefined; // No cleanup needed if elementRef is not set
  }, [handleMouseDown, handleMouseUp, handleTouchMove]);

  return [elementRef, isPressed];
};
