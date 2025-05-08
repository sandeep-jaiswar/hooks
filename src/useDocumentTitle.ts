import { useEffect } from 'react';

interface UseDocumentTitleOptions {
  title: string;
}

export const useDocumentTitle = ({ title }: UseDocumentTitleOptions) => {
  useEffect(() => {
    const previousTitle = document.title; // Store the previous title

    document.title = title; // Set the new title

    return () => {
      document.title = previousTitle; // Restore the original title when the component unmounts
    };
  }, [title]); // This effect runs whenever the title changes
};
