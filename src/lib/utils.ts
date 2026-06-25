import { getCollection, type CollectionEntry } from 'astro:content';
import { PUBLISHED_VISIBILITY } from './taxonomy';

export type Record_ = CollectionEntry<'records'>;
export type Project = CollectionEntry<'projects'>;
export type Standard = CollectionEntry<'standards'>;

/** 공개 기록만 (visibility 기준), 최신순 */
export async function getPublishedRecords(): Promise<Record_[]> {
  const all = await getCollection('records', ({ data }) => {
    if (!import.meta.env.PROD) return true;
    return PUBLISHED_VISIBILITY.includes(data.visibility);
  });
  return all.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

export async function getRecordsByType(type: string): Promise<Record_[]> {
  return (await getPublishedRecords()).filter((r) => r.data.type === type);
}

export async function getRecordsByTopic(topic: string): Promise<Record_[]> {
  return (await getPublishedRecords()).filter((r) => r.data.topic === topic);
}

export async function getFeaturedRecords(limit = 6): Promise<Record_[]> {
  const recs = await getPublishedRecords();
  const pinned = recs.filter((r) => r.data.featured);
  const pinnedIds = new Set(pinned.map((r) => r.id));
  const pool = pinned.length >= limit ? pinned : [...pinned, ...recs.filter((r) => !pinnedIds.has(r.id))];
  return pool.slice(0, limit);
}

export async function getRelatedRecords(current: Record_, limit = 3): Promise<Record_[]> {
  const recs = (await getPublishedRecords()).filter((r) => r.id !== current.id);
  const scored = recs.map((r) => {
    let s = 0;
    if (r.data.topic === current.data.topic) s += 2;
    if (r.data.type === current.data.type) s += 1;
    s += r.data.tags.filter((t) => current.data.tags.includes(t)).length;
    return { r, s };
  });
  return scored
    .sort((a, b) => b.s - a.s || b.r.data.date.getTime() - a.r.data.date.getTime())
    .slice(0, limit)
    .map((x) => x.r);
}

export async function getProjects(): Promise<Project[]> {
  const all = await getCollection('projects');
  const rank: Record<string, number> = { active: 0, paused: 1, done: 2 };
  return all.sort(
    (a, b) => a.data.order - b.data.order || (rank[a.data.status] ?? 9) - (rank[b.data.status] ?? 9)
  );
}

export async function getStandards(): Promise<Standard[]> {
  return (await getCollection('standards')).sort((a, b) => a.data.order - b.data.order);
}

export async function getAllTags(): Promise<{ tag: string; count: number }[]> {
  const recs = await getPublishedRecords();
  const map = new Map<string, number>();
  for (const r of recs) for (const t of r.data.tags) map.set(t, (map.get(t) ?? 0) + 1);
  return [...map.entries()].map(([tag, count]) => ({ tag, count })).sort((a, b) => b.count - a.count);
}

const KOR = new Intl.DateTimeFormat('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });
const DOT = new Intl.DateTimeFormat('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' });
export const formatDate = (d: Date) => KOR.format(d);
export const formatDot = (d: Date) => DOT.format(d).replace(/\. /g, '.').replace(/\.$/, '');
export const isoDate = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

export function readingTime(body?: string): number {
  if (!body) return 1;
  return Math.max(1, Math.round(body.replace(/\s/g, '').length / 500));
}

export function excerpt(text?: string, max = 110): string {
  if (!text) return '';
  const clean = text.replace(/\s+/g, ' ').trim();
  return clean.length > max ? clean.slice(0, max).trimEnd() + '…' : clean;
}

export function groupByYear<T extends { data: { date: Date } }>(items: T[]): { year: string; items: T[] }[] {
  const map = new Map<string, T[]>();
  for (const it of items) {
    const y = String(it.data.date.getFullYear());
    if (!map.has(y)) map.set(y, []);
    map.get(y)!.push(it);
  }
  return [...map.entries()].sort((a, b) => Number(b[0]) - Number(a[0])).map(([year, items]) => ({ year, items }));
}
