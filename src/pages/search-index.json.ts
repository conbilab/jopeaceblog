import type { APIRoute } from 'astro';
import { getPublishedPosts, excerpt } from '../lib/utils';
import { getCategory } from '../lib/categories';

export const GET: APIRoute = async () => {
  const posts = await getPublishedPosts();
  const index = posts.map((p) => ({
    title: p.data.title,
    url: `/posts/${p.id}`,
    summary: p.data.summary ?? '',
    category: getCategory(p.data.category).name,
    categoryKey: p.data.category,
    emoji: getCategory(p.data.category).emoji,
    tags: p.data.tags,
    date: p.data.pubDate.toISOString().slice(0, 10),
    body: excerpt(
      (p.body ?? '')
        .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ') // 이미지 제거
        .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1') // 링크는 텍스트만
        .replace(/[#>*`_~\-\[\]()!]/g, ' '),
      240
    ),
  }));
  return new Response(JSON.stringify(index), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
};
