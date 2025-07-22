import { useEffect } from 'react';

export default function useShortCuts(keyCombo, callback, options = {}) {
  const { ignoreInput = true } = options;
  useEffect(() => {
    const keys = keyCombo
      .toLowerCase()
      .split('+')
      .map((k) => k.trim());
    const handleKeyPress = (e) => {
      const isInput = ['INPUT', 'TEXTAREA'].includes(e.target.tagName);
      if (ignoreInput && isInput) return;
      const isMatch = keys.every((k) => {
        if (k === 'shift') return e.shiftKey;
        if (k === 'ctrl') return e.ctrlKey;
        if (k === 'alt') return e.altKey;
        if (k === 'meta') return e.metaKey;
        return e.key.toLowerCase() === k;
      });
      if (isMatch) {
        e.preventDefault();
        callback(e);
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [keyCombo, callback, ignoreInput]);
}
