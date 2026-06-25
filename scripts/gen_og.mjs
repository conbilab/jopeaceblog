import sharp from 'sharp';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const out = join(__dirname, '..', 'public', 'images', 'og-default.jpg');

const svg = `
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#fbf8f2"/>
      <stop offset="1" stop-color="#f1ede5"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect x="44" y="44" width="1112" height="542" rx="22" fill="none" stroke="#e3ded2" stroke-width="2"/>
  <rect x="44" y="44" width="8" height="542" rx="4" fill="#6b5b95"/>

  <text x="104" y="150" font-family="'Pretendard','Noto Sans KR',sans-serif" font-weight="800" font-size="40" letter-spacing="-1" fill="#222222">피스노트<tspan font-size="20" letter-spacing="3" fill="#6b5b95" dx="16"> PEACE NOTE</tspan></text>

  <text x="100" y="320" font-family="'Pretendard','Noto Sans KR',sans-serif" font-weight="800" font-size="68" letter-spacing="-2.5" fill="#1a1a18">잘 보이기보다,</text>
  <text x="100" y="408" font-family="'Pretendard','Noto Sans KR',sans-serif" font-weight="800" font-size="68" letter-spacing="-2.5" fill="#6b5b95">부끄럽지 않게 살고 싶다.</text>

  <text x="102" y="500" font-family="'Pretendard','Noto Sans KR',sans-serif" font-weight="500" font-size="27" fill="#6f6a61">내가 본 것, 느낀 것, 배운 것, 행동한 것을 정직하게 기록합니다.</text>
  <text x="102" y="548" font-family="'Pretendard','Noto Sans KR',sans-serif" font-weight="600" font-size="22" fill="#968f82">마케팅 · AI · 콘텐츠 · 사업 운영 · 배움 · 맛과 장소 · 지키고 싶은 기준</text>
</svg>`;

await sharp(Buffer.from(svg)).jpeg({ quality: 90 }).toFile(out);
console.log('wrote', out);
