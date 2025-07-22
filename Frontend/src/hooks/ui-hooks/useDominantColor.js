import { useEffect, useState } from 'react';
import { getDominantColor } from '@/hooks';

export default function useDominantColor(imageUrl, fallback = [98, 126, 234]) {
  const [color, setColor] = useState(fallback);

  useEffect(() => {
    if (!imageUrl) return;

    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = imageUrl;

    img.onload = () => {
      const dominant = getDominantColor(img);
      setColor(dominant);
    };
  }, [imageUrl]);

  return color;
}
