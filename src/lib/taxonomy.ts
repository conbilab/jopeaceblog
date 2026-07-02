/** 피스노트 분류 체계 — 기록 유형(type) · 주제(topic) · 상태(status) · 공개기준(visibility) */

export type RecordType =
  | 'thought' | 'feeling' | 'action' | 'work'
  | 'food-place' | 'learning' | 'revision';

export interface TypeMeta { key: string; label: string; emoji: string; bg: string; ink: string; }

export const TYPES: Record<string, TypeMeta> = {
  thought:     { key: 'thought',     label: '생각한 것',   emoji: '💭', bg: '--t-thought-bg',   ink: '--t-thought-ink' },
  feeling:     { key: 'feeling',     label: '느낀 것',     emoji: '🫧', bg: '--t-feeling-bg',   ink: '--t-feeling-ink' },
  action:      { key: 'action',      label: '해본 것',     emoji: '🛠️', bg: '--t-action-bg',    ink: '--t-action-ink' },
  work:        { key: 'work',        label: '일한 것',     emoji: '💼', bg: '--t-work-bg',      ink: '--t-work-ink' },
  'food-place':{ key: 'food-place',  label: '먹고 간 곳',  emoji: '🍞', bg: '--t-food-bg',      ink: '--t-food-ink' },
  learning:    { key: 'learning',    label: '배운 것',     emoji: '📖', bg: '--t-learning-bg',  ink: '--t-learning-ink' },
  revision:    { key: 'revision',    label: '고친 것',     emoji: '↻',  bg: '--t-revision-bg',  ink: '--t-revision-ink' },
  creative:    { key: 'creative',    label: '창작',       emoji: '✍️', bg: '--t-creative-bg',  ink: '--t-creative-ink' },
};
export const STANDARD_META: TypeMeta = { key: 'standard', label: '지키고 싶은 것', emoji: '🕊️', bg: '--t-standard-bg', ink: '--t-standard-ink' };

export const TYPE_ORDER: string[] = ['thought', 'feeling', 'action', 'creative', 'work', 'food-place', 'learning', 'revision'];

export function getType(key: string): TypeMeta {
  return TYPES[key] ?? STANDARD_META;
}

/** 주제 */
export const TOPICS: Record<string, string> = {
  life: '삶', work: '일', marketing: '마케팅', ai: 'AI', content: '콘텐츠',
  sechago: '세차의고수', english: '영어/교육', place: '맛과 장소', book: '책과 공부', people: '사람과 관계',
};
export const TOPIC_ORDER = ['life', 'work', 'marketing', 'ai', 'content', 'sechago', 'english', 'place', 'book', 'people'];
export const getTopic = (k?: string) => (k ? TOPICS[k] ?? k : '');

/** 상태(완성도) */
export const STATUS: Record<string, { label: string; emoji: string }> = {
  seed:      { label: '씨앗',    emoji: '🌱' },
  growing:   { label: '발전 중', emoji: '🌿' },
  completed: { label: '완성',    emoji: '🌳' },
  revised:   { label: '수정됨',  emoji: '↻' },
};
export const STATUS_ORDER = ['seed', 'growing', 'completed', 'revised'];
export const getStatus = (k?: string) => STATUS[k ?? 'completed'] ?? STATUS.completed;

/** 공개기준 */
export const VISIBILITY: Record<string, string> = {
  public: '공개 가능',
  careful: '조심해서 공개',
  'private-draft': '비공개 초안',
  later: '나중에 공개',
  anonymized: '익명화 후 공개',
};
/** 공개 목록에 노출되는 visibility */
export const PUBLISHED_VISIBILITY = ['public', 'careful', 'anonymized'];

/** 프로젝트 상태 */
export const PROJECT_STATUS: Record<string, { label: string; color: string }> = {
  active: { label: '진행 중', color: 'var(--color-primary)' },
  done:   { label: '완료',    color: 'var(--color-green)' },
  paused: { label: '보류',    color: 'var(--color-text-muted)' },
};
