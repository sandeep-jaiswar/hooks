import { useEffect, useRef } from 'react';

/**
 * usePageLeave
 *
 * Triggers a callback when the user's mouse leaves the page area (e.g., toward browser address bar or outside the viewport).
 * Useful for analytics, saving progress, or warning users before leaving.
 *
 * @param onPageLeave - Function to call when the mouse leaves the document.
 *
 * @example
 * usePageLeave(() => {
 *   console.log('User is about to leave the page');
 * });
 */
export const usePageLeave = (onPageLeave: () => void): void => {
  const callbackRef = useRef(onPageLeave);

  // Update ref if callback changes
  useEffect(() => {
    callbackRef.current = onPageLeave;
  }, [onPageLeave]);

  useEffect(() => {
    const handleMouseOut = (event: MouseEvent) => {
      const relatedTarget = event.relatedTarget as HTMLElement | null;

      if (!relatedTarget && callbackRef.current) {
        callbackRef.current();
      }
    };

    document.addEventListener('mouseout', handleMouseOut);

    return () => {
      document.removeEventListener('mouseout', handleMouseOut);
    };
  }, []);
};
