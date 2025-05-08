import { useState, useEffect, useRef } from 'react';

interface Options extends IntersectionObserverInit {
  threshold?: number | number[];
}

/**
 * Custom hook to observe when an element enters or exits the viewport.
 *
 * This hook uses the `IntersectionObserver` API to track whether an element
 * is in the viewport based on the specified options.
 *
 * @param options Optional settings for the IntersectionObserver.
 * @returns A reference to the target element and a boolean indicating whether it's intersecting the viewport.
 *
 * @example
 * const [ref, isInView] = useIntersectionObserver({ threshold: 0.5 });
 * // `isInView` will be `true` when 50% of the element is visible in the viewport.
 */
export const useIntersectionObserver = (
  options: Options = {}
): [React.RefObject<HTMLElement | null>, boolean] => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const elementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      {
        root: options.root || null,
        rootMargin: options.rootMargin || '0px',
        threshold: options.threshold || 0.1,
      }
    );

    const element = elementRef.current;

    if (element) {
      observer.observe(element);
    }

    // Cleanup the observer on component unmount
    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [options]); // Re-run effect if options change

  return [elementRef, isIntersecting];
};
