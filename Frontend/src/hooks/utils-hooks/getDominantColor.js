export default function getDominantColor(img) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = img.width;
  canvas.height = img.height;

  ctx.drawImage(img, 0, 0, img.width, img.height);

  const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
  const color = [0, 0, 0];
  let count = 0;

  for (let i = 0; i < data.length; i += 4) {
    color[0] += data[i];
    color[1] += data[i + 1];
    color[2] += data[i + 2];
    count++;
  }

  return color.map((c) => Math.round(c / count));
}
