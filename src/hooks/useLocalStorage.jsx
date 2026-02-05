import { useState, useEffect } from "react";

export const useLocalStorage = (key, initValue) => {
  const [value, setValue] = useState(JSON.parse(localStorage.getItem(key)) || initValue);

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));

  }, [key, value]);

  return [value, setValue];
}