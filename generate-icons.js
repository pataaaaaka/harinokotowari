const fs = require('fs');
const { createCanvas } = require('canvas');

// アイコンサイズの配列
const sizes = [192, 512];

sizes.forEach(size => {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');

  // 背景
  ctx.fillStyle = '#1a1a2e';
  ctx.fillRect(0, 0, size, size);

  // 円形の背景
  ctx.fillStyle = '#4ecdc4';
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size / 2.5, 0, Math.PI * 2);
  ctx.fill();

  // テキスト（絵文字は使えないので代替）
  ctx.fillStyle = '#ffffff';
  ctx.font = `bold ${size * 0.5}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('経', size / 2, size / 2);

  // ファイル保存
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(`pwa-${size}x${size}.png`, buffer);
  console.log(`Created pwa-${size}x${size}.png`);
});

console.log('Icon generation complete!');
