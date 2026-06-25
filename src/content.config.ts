import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * 모든 기록(일상·작업·생각·맛집·여행·성취)은 하나의 'posts' 컬렉션에 담고
 * category 로 구분한다 → 홈에서 하나의 따뜻한 타임라인으로 렌더 + 카테고리 필터.
 * 프런트매터에 오타가 있으면 빌드가 실패하므로 깨진 글이 발행되지 않는다.
 */
const CATEGORIES = ['work', 'thought', 'daily', 'food', 'travel', 'win'] as const;

const posts = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/posts' }),
  schema: () =>
    z.object({
      title: z.string(),
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      category: z.enum(CATEGORIES),
      tags: z.array(z.string()).default([]),
      summary: z.string().optional(),
      cover: z.string().optional(),
      coverAlt: z.string().optional(),
      draft: z.boolean().default(false),
      featured: z.boolean().default(false),
      pinned: z.boolean().default(false),
      // 완성도(디지털 가든): 🌱 단상 / 🌿 정리 중 / 🌳 완성
      growth: z.enum(['seedling', 'budding', 'evergreen']).default('evergreen'),

      // --- 맛집(food) 전용(선택) ---
      place: z.string().optional(),
      location: z.string().optional(),
      visitedDate: z.coerce.date().optional(),
      rating: z.number().min(0).max(5).optional(),
      priceRange: z.string().optional(),
      recommend: z.string().optional(),

      // --- 여행(travel) 전용(선택) ---
      region: z.string().optional(),
      startDate: z.coerce.date().optional(),
      endDate: z.coerce.date().optional(),
      companions: z.string().optional(),
      course: z.array(z.string()).optional(),

      // --- 작업(work) 전용(선택) ---
      client: z.string().optional(),
      role: z.string().optional(),
      result: z.string().optional(),
      videoUrl: z.string().optional(),
    }),
});

/** 이력·연대기 타임라인 */
const timeline = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/timeline' }),
  schema: () =>
    z.object({
      year: z.number(),
      date: z.string().optional(), // 예: "2024.09"
      title: z.string(),
      description: z.string().optional(),
      type: z.enum(['work', 'award', 'press', 'lecture', 'founding', 'life']).default('work'),
      link: z.string().optional(),
      image: z.string().optional(),
      order: z.number().default(0),
    }),
});

export const collections = { posts, timeline };
