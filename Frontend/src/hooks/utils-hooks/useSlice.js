import { useCallback } from 'react';

export default function useShorten(length = 7) {
  return useCallback((value) => {
    if (!value || typeof value !== 'string') return '';

    const trimmed = value.trim();
    if (trimmed.length <= length) return trimmed; // already short enough

    const first = trimmed.slice(0, length);
    const last = trimmed.slice(-3);

    return `${first}...${last}`;
  }, []);
}
