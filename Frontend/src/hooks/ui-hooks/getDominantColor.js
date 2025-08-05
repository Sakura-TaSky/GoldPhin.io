// utils/getDominantColor.js
export const getDominantColor = () => {
  const hue = Math.floor(Math.random() * 360);
  const saturation = 70 + Math.floor(Math.random() * 30); // 70-100%
  const lightness = 50 + Math.floor(Math.random() * 20); // 50-70%

  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};
