import { useState, useEffect } from 'react';

export function useBreakpointValue<T>(values: { base: T, md: T }): T {
  const [value, setValue] = useState(
    window.innerWidth < 768 ? values.base : values.md
  );

  useEffect(() => {
    const handleResize = () => {
      setValue(window.innerWidth < 768 ? values.base : values.md);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [values.base, values.md]);

  return value;
}