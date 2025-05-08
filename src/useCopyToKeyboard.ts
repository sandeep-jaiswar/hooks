import { useState, useCallback } from 'react';

/**
 * @interface UseCopyToClipboardResult
 * @description Return structure from the `useCopyToClipboard` hook.
 * @property {function(string): void} copyToClipboard - Function to copy the provided text to the clipboard.
 * @property {boolean} success - Indicates whether the copy action was successful.
 * @property {string | null} error - Error message if the copy fails, otherwise null.
 */
interface UseCopyToClipboardResult {
  copyToClipboard: (text: string) => void;
  success: boolean;
  error: string | null;
}

/**
 * @function useCopyToClipboard
 * @description A custom React hook that provides clipboard copying functionality.
 *
 * @returns {UseCopyToClipboardResult} Object containing the copy function, success status, and any error message.
 *
 * @example
 * const { copyToClipboard, success, error } = useCopyToClipboard();
 * copyToClipboard("Text to copy");
 */
export const useCopyToClipboard = (): UseCopyToClipboardResult => {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * @function copyToClipboard
   * @description Copies the given text to the user's clipboard using the Clipboard API.
   * @param {string} text - The string content to be copied to the clipboard.
   */
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
