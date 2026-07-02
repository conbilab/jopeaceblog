import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const RECORD_TYPES = [
  "thought",
  "feeling",
  "action",
  "creative",
  "work",
  "food-place",
  "learning",
  "revision",
] as const;
const TOPICS = [
  "life",
  "work",
  "marketing",
  "ai",
  "content",
  "sechago",
  "english",
  "place",
  "book",
  "people",
] as const;
const STATUS = ["seed", "growing", "completed", "revised"] as const;
const VISIBILITY = [
  "public",
  "careful",
  "private-draft",
  "later",
  "anonymized",
] as const;

/** 기록 — 피스노트의 메인 피드(/records). 모든 유형의 글이 모인다. */
const records = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/records" }),
  schema: () =>
    z.object({
      title: z.string(),
      description: z.string().optional(),
      date: z.coerce.date(),
      updated: z.coerce.date().optional(),
      type: z.enum(RECORD_TYPES),
      topic: z.enum(TOPICS).default("life"),
      status: z.enum(STATUS).default("completed"),
      visibility: z.enum(VISIBILITY).default("public"),
      tags: z.array(z.string()).default([]),
      featured: z.boolean().default(false),
      relatedRecords: z.array(z.string()).default([]),
      relatedProjects: z.array(z.string()).default([]),
      // 이 기록에서 남은 질문 (글 하단 블록)
      question: z.string().optional(),
      // 좋았던 것(food-place) 선택 필드
      place: z.string().optional(),
      goodPoint: z.string().optional(),
      badPoint: z.string().optional(),
      revisit: z.string().optional(),
      recommend: z.string().optional(),
      cover: z.string().optional(),
      // 외부에서 옮겨온 글 출처(예: 네이버 블로그 이전). 선택값.
      source: z.string().optional(),
      sourceUrl: z.string().optional(),
    }),
});

/** 일과 프로젝트 (/work) */
const projects = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/projects" }),
  schema: () =>
    z.object({
      title: z.string(),
      oneliner: z.string(),
      status: z.enum(["active", "done", "paused"]).default("active"),
      period: z.string().optional(),
      role: z.string().optional(),
      problem: z.string().optional(),
      learned: z.string().optional(),
      topic: z.enum(TOPICS).default("work"),
      order: z.number().default(0),
      featured: z.boolean().default(false),
      relatedRecords: z.array(z.string()).default([]),
    }),
});

/** 나의 기준 (/standards) — 피스노트의 철학 페이지 */
const standards = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/standards" }),
  schema: () =>
    z.object({
      title: z.string(),
      summary: z.string(),
      careful: z.string().optional(),
      action: z.string().optional(),
      order: z.number().default(0),
      relatedRecords: z.array(z.string()).default([]),
    }),
});

export const collections = { records, projects, standards };
