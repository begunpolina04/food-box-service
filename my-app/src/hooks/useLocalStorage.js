import { useState, useEffect } from "react";

export default function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  useEffect(() => {
    // Debounce: сохраняем через 500мс после последнего изменения
    const timeoutId = setTimeout(() => {
      localStorage.setItem(key, JSON.stringify(value));
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [key, value]);

  return [value, setValue];
}
