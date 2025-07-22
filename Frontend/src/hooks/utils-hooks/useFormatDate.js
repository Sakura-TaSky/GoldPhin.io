import { useCallback } from 'react';

export default function useFormatDate() {
  return useCallback((dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);

    const pad = (num) => String(num).padStart(2, '0');

    const day = pad(date.getDate());
    const month = pad(date.getMonth() + 1);
    const year = date.getFullYear();

    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    const seconds = pad(date.getSeconds());

    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  }, []);
}
