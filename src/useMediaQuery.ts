import { useState, useEffect } from 'react';

/**
 * Custom hook to track the match status of a media query.
 * It allows you to listen for changes in the viewport size and check if a given media query matches.
 *
 * @param query - The media query string (e.g., "(max-width: 768px)").
 *
 * @returns A boolean indicating whether the media query matches the current viewport size.
 *
 * @example
 * const isMobile = useMediaQuery('(max-width: 768px)');
 *
 * return <div>{isMobile ? 'Mobile view' : 'Desktop view'}</div>;
 */
export const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState<boolean>(false);

  useEffect(() => {
    const mediaQueryList = window.matchMedia(query);

    // Set initial match status based on current viewport
    setMatches(mediaQueryList.matches);

    // Define a listener to track changes in the media query match status
    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Add the listener for media query changes
    mediaQueryList.addEventListener('change', handleChange);

    // Cleanup the listener on component unmount
    return () => {
      mediaQueryList.removeEventListener('change', handleChange);
    };
  }, [query]);

  return matches;
};
