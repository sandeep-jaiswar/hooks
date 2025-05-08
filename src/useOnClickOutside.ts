import { useEffect } from 'react';

/**
 * Custom hook that triggers a callback when a click is detected outside of the referenced element.
 *
 * @param ref - The React ref object pointing to the element you want to detect clicks outside of.
 * @param handler - The callback function to be called when a click occurs outside the referenced element.
 *
 * @example
 * const ref = useRef(null);
 * const handleOutsideClick = () => {
 *   console.log('Clicked outside!');
 * };
 *
 * useOnClickOutside(ref, handleOutsideClick);
 */
export const useOnClickOutside = <T extends HTMLElement>(
  ref: React.RefObject<T>,
  handler: (event: MouseEvent) => void
): void => {
  useEffect(() => {
    // Define the event listener to trigger when a click occurs outside the referenced element
    const handleClickOutside = (event: MouseEvent) => {
      // Check if the event target is outside the ref element
      if (ref.current && !ref.current.contains(event.target as Node)) {
        handler(event); // Call the handler function
      }
    };

    // Add the event listener to the document
    document.addEventListener('mousedown', handleClickOutside);

    // Cleanup event listener on component unmount
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref, handler]); // Re-run the effect if the ref or handler changes
};
