import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getPublishedPosts } from '../lib/utils';
import { getCategory } from '../lib/categories';
import { SITE } from '../lib/site';

export async function GET(context: APIContext) {
  const posts = await getPublishedPosts();
  return rss({
    title: SITE.title,
    description: SITE.description,
    site: context.site ?? SITE.url,
    items: posts.map((p) => ({
      title: p.data.title,
      pubDate: p.data.pubDate,
      description: p.data.summary ?? '',
      link: `/posts/${p.id}/`,
      categories: [getCategory(p.data.category).name, ...p.data.tags],
    })),
    customData: `<language>ko-kr</language>`,
    stylesheet: false,
  });
}
