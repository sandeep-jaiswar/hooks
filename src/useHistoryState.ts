import { useState, useEffect, useCallback } from 'react';

interface HistoryState {
  [key: string]: any;
}

export const useHistoryState = (
  initialState: HistoryState = {}
): [
  HistoryState,
  {
    set: (newState: HistoryState) => void;
    undo: () => void;
    redo: () => void;
    clear: () => void;
    canUndo: boolean;
    canRedo: boolean;
  },
] => {
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
