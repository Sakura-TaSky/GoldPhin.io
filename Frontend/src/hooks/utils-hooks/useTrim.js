import { useCallback } from 'react';

export default function useTrim(defaultDecimals = 3) {
  return useCallback(
    (value, decimals = defaultDecimals) => {
      if (value == null) return '0';

      const num = typeof value === 'string' ? parseFloat(value) : Number(value);

      if (isNaN(num) || num === 0) return '0';

      const threshold = Math.pow(10, -decimals);

      if (num > 0 && num < threshold) {
        return `<${threshold}`;
      }

      return num.toLocaleString(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: decimals,
      });
    },
    [defaultDecimals]
  );
}
