import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'posts'>;

/** 발행된 글만 (draft 제외), 최신순 정렬 */
export async function getPublishedPosts(): Promise<Post[]> {
  const all = await getCollection('posts', ({ data }) => {
    return import.meta.env.PROD ? data.draft !== true : true;
  });
  return all.sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime());
}

export async function getPostsByCategory(category: string): Promise<Post[]> {
  const posts = await getPublishedPosts();
  return posts.filter((p) => p.data.category === category);
}

export async function getFeaturedPosts(limit = 3): Promise<Post[]> {
  const posts = await getPublishedPosts();
  const pinned = posts.filter((p) => p.data.featured || p.data.pinned);
  const pinnedIds = new Set(pinned.map((p) => p.id));
  const pool = pinned.length >= limit ? pinned : [...pinned, ...posts.filter((p) => !pinnedIds.has(p.id))];
  return pool.slice(0, limit);
}

/** 모든 태그 + 개수 */
export async function getAllTags(): Promise<{ tag: string; count: number }[]> {
  const posts = await getPublishedPosts();
  const map = new Map<string, number>();
  for (const p of posts) for (const t of p.data.tags) map.set(t, (map.get(t) ?? 0) + 1);
  return [...map.entries()].map(([tag, count]) => ({ tag, count })).sort((a, b) => b.count - a.count);
}

/** 연관 글 (같은 카테고리 우선, 그다음 태그 겹침) */
export async function getRelatedPosts(current: Post, limit = 3): Promise<Post[]> {
  const posts = (await getPublishedPosts()).filter((p) => p.id !== current.id);
  const scored = posts.map((p) => {
    let score = 0;
    if (p.data.category === current.data.category) score += 3;
    score += p.data.tags.filter((t) => current.data.tags.includes(t)).length;
    return { p, score };
  });
  return scored
    .sort((a, b) => b.score - a.score || b.p.data.pubDate.getTime() - a.p.data.pubDate.getTime())
    .slice(0, limit)
    .map((s) => s.p);
}

const KOR = new Intl.DateTimeFormat('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });
const SHORT = new Intl.DateTimeFormat('ko-KR', { month: 'short', day: 'numeric' });

export function formatDate(d: Date): string {
  return KOR.format(d);
}
export function formatDateShort(d: Date): string {
  return SHORT.format(d);
}
export function isoDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}
export function dateParts(d: Date): { y: string; m: string; day: string } {
  return {
    y: String(d.getFullYear()),
    m: String(d.getMonth() + 1).padStart(2, '0'),
    day: String(d.getDate()).padStart(2, '0'),
  };
}

/** 한글 읽기 시간 (분당 약 500자) */
export function readingTime(body: string | undefined): number {
  if (!body) return 1;
  const chars = body.replace(/\s/g, '').length;
  return Math.max(1, Math.round(chars / 500));
}

/** 연도별 그룹화 (아카이브) */
export function groupByYear(posts: Post[]): { year: string; posts: Post[] }[] {
  const map = new Map<string, Post[]>();
  for (const p of posts) {
    const y = String(p.data.pubDate.getFullYear());
    if (!map.has(y)) map.set(y, []);
    map.get(y)!.push(p);
  }
  return [...map.entries()].sort((a, b) => Number(b[0]) - Number(a[0])).map(([year, posts]) => ({ year, posts }));
}

export function excerpt(text: string | undefined, max = 110): string {
  if (!text) return '';
  const clean = text.replace(/\s+/g, ' ').trim();
  return clean.length > max ? clean.slice(0, max).trimEnd() + '…' : clean;
}
