"use client";

import { useState, useEffect } from "react";

/**
 * Returns a value that updates only after the input has been stable for `delay` ms.
 * Useful for search inputs to avoid firing requests on every keystroke.
 */
export default function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
