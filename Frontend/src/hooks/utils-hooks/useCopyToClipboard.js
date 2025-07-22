import { useState } from 'react';

export default function useCopyToClipboard(resetDelay = 3000) {
  const [isCopied, setIsCopied] = useState(false);

  const copy = async (text) => {
    if (!text) return;

    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);

      setTimeout(() => {
        setIsCopied(false);
      }, resetDelay);
    } catch (err) {
      console.error('Failed to copy:', err);
      setIsCopied(false);
    }
  };

  return { copy, isCopied };
}
