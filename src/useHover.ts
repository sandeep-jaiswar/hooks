import { useState, useRef, useEffect } from 'react';

/**
 * Custom hook that tracks the hover state of an HTML element.
 *
 * @returns A tuple where the first element is a ref that should be attached to
 * an HTML element, and the second element is a boolean representing whether
 * the element is currently being hovered over.
 *
 * Example usage:
 * ```tsx
 * const [ref, isHovered] = useHover();
 * return <div ref={ref}>Hover me: {isHovered ? 'Yes' : 'No'}</div>;
 * ```
 *
 * @remarks
 * - The hook automatically handles adding and removing event listeners for mouse enter and leave.
 * - It cleans up by removing event listeners when the component unmounts.
 *
 * @returns {Array} The first element is a ref object, and the second element is a boolean indicating if the element is hovered.
 */
export const useHover = (): [React.RefObject<HTMLElement | null>, boolean] => {
  const [isHovered, setIsHovered] = useState(false);
  const elementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => setIsHovered(false);

    const element = elementRef.current;
    if (element) {
      // Add event listeners to track hover state
      element.addEventListener('mouseenter', handleMouseEnter);
      element.addEventListener('mouseleave', handleMouseLeave);

      // Cleanup the event listeners when the component unmounts or ref changes
      return () => {
        element.removeEventListener('mouseenter', handleMouseEnter);
        element.removeEventListener('mouseleave', handleMouseLeave);
      };
    }
  }, []); // The effect only runs on mount and unmount

  return [elementRef, isHovered];
};
