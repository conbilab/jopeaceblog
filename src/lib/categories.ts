/** 6개 카테고리 = 콘텐츠 기둥. 따뜻한 한글 코너명 + 색 + 한 줄 콘셉트. */
export type CategoryKey = 'work' | 'thought' | 'daily' | 'food' | 'travel' | 'win';

export interface Category {
  key: CategoryKey;
  /** 코너 이름 (따뜻한 한글) */
  name: string;
  /** 분류 이름 (명확한) */
  label: string;
  /** 한 줄 콘셉트 카피 */
  concept: string;
  /** 색 토큰 변수명 */
  colorVar: string;
  bgVar: string;
  emoji: string;
}

export const CATEGORIES: Record<CategoryKey, Category> = {
  work: {
    key: 'work',
    name: '만드는 시간',
    label: '작업',
    concept: '무엇을, 어떻게, 왜 만들었는지. 잘된 것도 망한 것도 다 적습니다.',
    colorVar: '--cat-work',
    bgVar: '--cat-work-bg',
    emoji: '🎬',
  },
  thought: {
    key: 'thought',
    name: '문득',
    label: '생각',
    concept: '정리 안 된 생각도 일단 적어둡니다.',
    colorVar: '--cat-thought',
    bgVar: '--cat-thought-bg',
    emoji: '💭',
  },
  daily: {
    key: 'daily',
    name: '오늘의 결',
    label: '일상',
    concept: '대전에서 1인 기업으로 사는, 평범하지만 나다운 하루.',
    colorVar: '--cat-daily',
    bgVar: '--cat-daily-bg',
    emoji: '🌿',
  },
  food: {
    key: 'food',
    name: '맛의 기록',
    label: '맛집',
    concept: '오늘 뭘 먹었나. 작업이 잘되는 자리도 함께.',
    colorVar: '--cat-food',
    bgVar: '--cat-food-bg',
    emoji: '🍜',
  },
  travel: {
    key: 'travel',
    name: '바람 따라',
    label: '여행',
    concept: '강의 출장길에, 떠난 김에 주운 낯선 장면들.',
    colorVar: '--cat-travel',
    bgVar: '--cat-travel-bg',
    emoji: '🧭',
  },
  win: {
    key: 'win',
    name: '발자국',
    label: '성취',
    concept: '수상·언론·마일스톤. 자랑이 아니라 증거로 남깁니다.',
    colorVar: '--cat-win',
    bgVar: '--cat-win-bg',
    emoji: '🏔️',
  },
};

export const CATEGORY_ORDER: CategoryKey[] = ['work', 'thought', 'daily', 'food', 'travel', 'win'];

export const GROWTH: Record<string, { emoji: string; label: string }> = {
  seedling: { emoji: '🌱', label: '단상' },
  budding: { emoji: '🌿', label: '정리 중' },
  evergreen: { emoji: '🌳', label: '완성' },
};

export function getCategory(key: string): Category {
  return CATEGORIES[key as CategoryKey] ?? CATEGORIES.work;
}
