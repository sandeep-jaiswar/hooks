import { useState, useCallback } from 'react';

interface UseCopyToClipboardResult {
  copyToClipboard: (text: string) => void;
  success: boolean;
  error: string | null;
}

export const useCopyToClipboard = (): UseCopyToClipboardResult => {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const copyToClipboard = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setSuccess(true);
      setError(null);
    } catch (err) {
      setSuccess(false);
      setError(err instanceof Error ? err.message : 'Failed to copy');
    }
  }, []);

  return { copyToClipboard, success, error };
};
