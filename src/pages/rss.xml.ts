import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getPublishedRecords } from '../lib/utils';
import { getType, getTopic } from '../lib/taxonomy';
import { SITE } from '../lib/site';

export async function GET(context: APIContext) {
  const records = await getPublishedRecords();
  return rss({
    title: SITE.title,
    description: SITE.description,
    site: context.site ?? SITE.url,
    items: records.map((r) => ({
      title: r.data.title,
      pubDate: r.data.date,
      description: r.data.description ?? '',
      link: `/records/${r.id}/`,
      categories: [getType(r.data.type).label, getTopic(r.data.topic), ...r.data.tags].filter(Boolean),
    })),
    customData: `<language>ko-kr</language>`,
    stylesheet: false,
  });
}
