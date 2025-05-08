import { useState, useCallback } from 'react';

/**
 * @function useHistoryState
 * @description A custom hook to manage state history with undo/redo functionality.
 * It allows setting a new state, undoing changes, redoing changes, and clearing the history.
 * This hook also integrates with the browser's history API for state management.
 *
 * @param {HistoryState} initialState - The initial state to be used for the history.
 * @returns {[HistoryState, HistoryStateActions]} An array containing:
 *   - `HistoryState`: The current state (most recent in history).
 *   - `HistoryStateActions`: An object with functions to manage the history stack:
 *     - `set`: A function to set a new state.
 *     - `undo`: A function to undo to the previous state.
 *     - `redo`: A function to redo to the next state.
 *     - `clear`: A function to clear the history stack.
 *     - `canUndo`: A boolean indicating if an undo action is available.
 *     - `canRedo`: A boolean indicating if a redo action is available.
 *
 * @example
 * const [state, historyActions] = useHistoryState({ name: 'John' });
 * historyActions.set({ name: 'Doe' });
 * historyActions.undo(); // Will revert to { name: 'John' }
 * historyActions.redo(); // Will revert back to { name: 'Doe' }
 * historyActions.clear(); // Clears the history stack
 */
interface HistoryState {
  [key: string]: unknown; // Represents any object used for storing state.
}

interface HistoryStateActions {
  set: (newState: HistoryState) => void; // Sets a new state and updates history.
  undo: () => void; // Undoes the previous state change.
  redo: () => void; // Redoes the next state change.
  clear: () => void; // Clears the entire history stack.
  canUndo: boolean; // Indicates if undo action is possible.
  canRedo: boolean; // Indicates if redo action is possible.
}

export const useHistoryState = (
  initialState: HistoryState = {}
): [HistoryState, HistoryStateActions] => {
  // State history management
  const [history, setHistory] = useState<HistoryState[]>([initialState]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  // Manage undo/redo availability
  const canUndo = currentIndex > 0;
  const canRedo = currentIndex < history.length - 1;

  // Set a new state and update history stack
  const setState = useCallback(
    (newState: HistoryState) => {
      // Discard any future history when new state is added
      const newHistory = history.slice(0, currentIndex + 1);
      newHistory.push(newState);

      setHistory(newHistory);
      setCurrentIndex(newHistory.length - 1);

      // Push the new state to browser history
      window.history.pushState(newState, document.title, window.location.href);
    },
    [history, currentIndex]
  );

  // Undo to the previous state
  const undo = useCallback(() => {
    if (canUndo) {
      const previousState = history[currentIndex - 1];
      setHistory(history.slice(0, currentIndex));
      setCurrentIndex(currentIndex - 1);
      window.history.replaceState(previousState, document.title, window.location.href);
    }
  }, [canUndo, history, currentIndex]);

  // Redo to the next state
  const redo = useCallback(() => {
    if (canRedo) {
      const nextState = history[currentIndex + 1];
      setHistory(history.slice(0, currentIndex + 2));
      setCurrentIndex(currentIndex + 1);
      window.history.replaceState(nextState, document.title, window.location.href);
    }
  }, [canRedo, history, currentIndex]);

  // Clear the history stack
  const clear = useCallback(() => {
    setHistory([initialState]);
    setCurrentIndex(0);
    window.history.replaceState(initialState, document.title, window.location.href);
  }, [initialState]);

  // Return the current state and history management functions
  return [history[currentIndex], { set: setState, undo, redo, clear, canUndo, canRedo }];
};
