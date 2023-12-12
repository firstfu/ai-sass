/**
 * @ Author: firstfu
 * @ Create Time: 2023-12-12 16:07:48
 * @ Description: 防抖hook
 */

import { useEffect, useState } from "react";

export function useDebounce<T>(value: T, delay?: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      //   console.log("useDebounce hook value:", value);
      setDebouncedValue(value);
    }, delay || 500);
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}
