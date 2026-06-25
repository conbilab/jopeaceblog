import type { APIRoute } from 'astro';
import { SITE } from '../lib/site';

export const GET: APIRoute = ({ site }) => {
  const base = (site ?? new URL(SITE.url)).toString().replace(/\/$/, '');
  const body = `User-agent: *
Allow: /
Disallow: /admin

Sitemap: ${base}/sitemap-index.xml
`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
