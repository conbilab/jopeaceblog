import sharp from 'sharp';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const out = join(__dirname, '..', 'public', 'images', 'og-default.jpg');

const svg = `
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#faf6ee"/>
      <stop offset="1" stop-color="#f0eadd"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect x="44" y="44" width="1112" height="542" rx="18" fill="none" stroke="#e2dac9" stroke-width="2"/>
  <rect x="44" y="44" width="8" height="542" rx="4" fill="#d1552a"/>

  <text x="104" y="150" font-family="'Pretendard','Noto Sans KR',sans-serif" font-weight="800" font-size="40" letter-spacing="-1" fill="#211d16">피스노트<tspan font-size="20" letter-spacing="3" fill="#ad431b" dx="16"> PEACE NOTE</tspan></text>

  <text x="100" y="348" font-family="'Pretendard','Noto Sans KR',sans-serif" font-weight="800" font-size="96" letter-spacing="-3" fill="#211d16">배워서, <tspan fill="#d1552a">남 줍니다.</tspan></text>

  <text x="102" y="452" font-family="'Pretendard','Noto Sans KR',sans-serif" font-weight="600" font-size="30" fill="#6c6456">보고 배우고 만든 것을, 정리해서 나누는 기록.</text>
  <text x="102" y="512" font-family="'Pretendard','Noto Sans KR',sans-serif" font-weight="600" font-size="23" fill="#968d7b">영상 12년 · 500편+ · 블로그 262편 · 마케팅·강의·AI</text>
</svg>`;

await sharp(Buffer.from(svg)).jpeg({ quality: 90 }).toFile(out);
console.log('wrote', out);
