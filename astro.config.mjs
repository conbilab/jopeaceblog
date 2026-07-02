// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// ⚠️ 배포 도메인이 정해지면 site 값을 실제 주소로 바꿔주세요 (RSS·사이트맵·OG에 사용됩니다)
// 피스노트.com (한글 도메인 → 퓨니코드)
const SITE = 'https://xn--o80bq93a37lsnc.com';

// https://astro.build/config
export default defineConfig({
  site: SITE,
  output: 'static', // 정적 사이트 = 서버/DB 없음 = 해킹 공격면 최소화 (가장 안전)
  trailingSlash: 'ignore',
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'viewport',
  },
  integrations: [
    mdx(),
    sitemap({
      i18n: undefined,
      changefreq: 'weekly',
      priority: 0.7,
    }),
  ],
  markdown: {
    shikiConfig: {
      theme: 'github-light',
      wrap: true,
    },
    remarkPlugins: [],
    rehypePlugins: [],
  },
  image: {
    responsiveStyles: true,
    // ⚠️ 미디어 도메인이 정해지면 바꿔주세요 — 우분투(MinIO)에서 오는 사진을 <Image>로 최적화 허용
    domains: ['media.xn--o80bq93a37lsnc.com'],
  },
  build: {
    // CSS도 외부 파일로 (CSP 단순화). 단, scoped <style>은 head 인라인 → style-src 'unsafe-inline' 허용.
    inlineStylesheets: 'auto',
  },
  vite: {
    build: {
      // 번들 스크립트를 인라인하지 않고 외부 파일(/_astro/*.js)로 → CSP script-src 'self' 로 커버
      assetsInlineLimit: 0,
    },
  },
  devToolbar: { enabled: false },
});
