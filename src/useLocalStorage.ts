import { useState } from 'react';

/**
 * Custom hook to persist a value in the browser's localStorage.
 *
 * This hook provides a way to store and retrieve values from localStorage
 * while synchronizing them with your component state. It supports both
 * direct values and functions to update the stored value.
 *
 * @param key - The key under which the value is stored in localStorage.
 * @param initialValue - The initial value to store if there's no value in localStorage.
 * @returns A tuple with the stored value and a setter function to update the value.
 *
 * @example
 * const [name, setName] = useLocalStorage('name', 'John Doe');
 * setName('Jane Doe'); // Will store "Jane Doe" in localStorage under the key 'name'.
 */
export const useLocalStorage = <T>(key: string, initialValue: T) => {
  // Initialize state with value from localStorage or default to initialValue
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key “${key}”: `, error);
      return initialValue;
    }
  });

  /**
   * Set a new value in the localStorage and update the state.
   *
   * @param value - The value to store, or a function that receives the current value.
   */
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key “${key}”: `, error);
      // Fail silently, but log the error
    }
  };

  return [storedValue, setValue] as const;
};
