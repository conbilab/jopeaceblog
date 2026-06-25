import sharp from 'sharp';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const out = join(__dirname, '..', 'public', 'images', 'og-default.jpg');

const svg = `
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#fbfaf7"/>
      <stop offset="1" stop-color="#f1ece1"/>
    </linearGradient>
    <radialGradient id="orb" cx="0.85" cy="0.1" r="0.6">
      <stop offset="0" stop-color="#1c6b54" stop-opacity="0.16"/>
      <stop offset="1" stop-color="#1c6b54" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect width="1200" height="630" fill="url(#orb)"/>
  <rect x="40" y="40" width="1120" height="550" rx="28" fill="none" stroke="#cfc8b6" stroke-width="2" stroke-dasharray="3 7"/>

  <!-- dove mark -->
  <g transform="translate(96,96)" fill="none" stroke="#0f4536" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="44" cy="44" r="40" opacity="0.9"/>
    <path d="M22 54c10 1.8 19.5 -1.7 27 -9.6 2.5 4 6.6 6.5 11.8 6.5 0.3 2.9 2 5 5.2 6 -3 2.5 -6.7 3.4 -10.8 3"/>
    <path d="M27 51c1.8 -11 9.2 -19.8 20.6 -23.4 -4.5 5.2 -6.4 10.8 -5.6 17"/>
    <path d="M61 49l5.2 -1.7"/>
  </g>

  <text x="210" y="135" font-family="Georgia, serif" font-style="italic" font-size="30" fill="#8a611f" letter-spacing="1">JOPIS — A record of making peace</text>

  <text x="96" y="320" font-family="'Pretendard', 'Apple SD Gothic Neo', sans-serif" font-weight="800" font-size="104" fill="#0f2c23" letter-spacing="-3">조피스의 기록</text>
  <text x="100" y="400" font-family="Georgia, serif" font-style="italic" font-size="44" fill="#1c6b54">화려하지 않아도 됩니다. 본질을 기록합니다.</text>

  <text x="98" y="500" font-family="'Pretendard', sans-serif" font-weight="600" font-size="28" fill="#46544c">콘텐츠로 평화를 만드는 사람, 조재빈의 일기</text>

  <g font-family="'Pretendard', sans-serif" font-size="24" fill="#76817a">
    <text x="98" y="556">영상 500편+ · 가맹점 90개 · 강의 6년 · 수익 1% 기부</text>
  </g>
</svg>`;

await sharp(Buffer.from(svg)).jpeg({ quality: 88 }).toFile(out);
console.log('wrote', out);
