import { useEffect, useState } from 'react';

// Define the shape of the window size object
type WindowSize = {
  width: number;
  height: number;
};

/**
 * Custom React hook to track the current size of the browser window.
 * Automatically updates when the window is resized.
 *
 * @returns {WindowSize} An object containing `width` and `height` of the window.
 */
export function useWindowSize(): WindowSize {
  // Initialize state with current window dimensions or fallback to 0 for SSR
  const [size, setSize] = useState<WindowSize>({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  useEffect(() => {
    // Define resize handler that updates state with current window dimensions
    const handleResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    // Add resize event listener on mount
    window.addEventListener('resize', handleResize);

    // Call handler once to set initial dimensions
    handleResize();

    // Remove event listener on cleanup to avoid memory leaks
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return size;
}
