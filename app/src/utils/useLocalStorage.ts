import { useState } from 'react';

export const useLocalStorage = (key: string, initialValue: any) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item === null || item === 'undefined') {
        return initialValue;
      }
      return JSON.parse(item);
    } catch (error) {
      console.log('Error parsing localStorage item:', error);
      return initialValue;
    }
  });

  const setValue = (value: any) => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.log('Error saving to localStorage:', error);
    }
  };

  return [storedValue, setValue] as const;
};
