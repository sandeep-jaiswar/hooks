import { useEffect } from 'react';

/**
 * @function useDocumentTitle
 * @description A custom hook to dynamically update the document's title.
 * It sets the document title to the provided value and restores the original
 * title when the component is unmounted or the title changes.
 *
 * @param {UseDocumentTitleOptions} options - The options object that contains the title.
 * @param {string} options.title - The title to be set on the document.
 *
 * @example
 * useDocumentTitle({ title: 'My New Title' });
 */
interface UseDocumentTitleOptions {
  title: string;
}

export const useDocumentTitle = ({ title }: UseDocumentTitleOptions) => {
  useEffect(() => {
    const previousTitle = document.title; // Store the previous title

    document.title = title; // Set the new title

    // Cleanup function to restore the previous title when the component unmounts or title changes
    return () => {
      document.title = previousTitle; // Restore the original title when the component unmounts
    };
  }, [title]); // This effect runs whenever the title changes
};
