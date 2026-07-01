/** 피스노트(Peace Note) — 사이트 전역 설정 */
export const SITE = {
  title: '피스노트',
  titleEn: 'Peace Note',
  slogan: '배워서, 남 줍니다.',
  subtitle: '보고 배우고 만든 것을, 정리해서 나누는 기록.',
  description:
    '영상·마케팅·콘텐츠·AI를 넘나드는 제네럴리스트 조피스(조재빈)의 공개 기록장. 12년간 500편 넘는 영상을 만들고, 블로그에 262편을 연재하고, 소상공인 마케팅을 무료로 나눠온 사람. 보고 배운 것을 정리해 남에게 주는, "배워서 남 주는" 기록.',
  author: '조재빈',
  authorHandle: '조피스',
  // ⚠️ 배포 도메인이 정해지면 바꿔주세요 (astro.config.mjs 의 site 와 일치).
  url: 'https://jopeaceblog.vercel.app',
  locale: 'ko_KR',
  lang: 'ko',
  email: 'paigraphy@gmail.com',
  repo: 'conbilab/jopeaceblog',
} as const;

/** 외부 채널 (실제 주소로 채워주세요. '#'은 자동으로 숨겨집니다) */
export const SOCIAL: { label: string; href: string; handle?: string }[] = [
  { label: '유튜브', href: '#', handle: '배워서남주는조피디' },
  { label: '인스타그램', href: '#', handle: '@jopis' },
  { label: '이메일', href: 'mailto:paigraphy@gmail.com' },
];

/** 상단 내비게이션 (스펙 7번) */
export const NAV: { label: string; href: string }[] = [
  { label: '기록', href: '/records' },
  { label: '나의 기준', href: '/standards' },
  { label: '일과 프로젝트', href: '/work' },
  { label: '좋았던 것들', href: '/good-things' },
  { label: '배운 것들', href: '/learning' },
  { label: '지금', href: '/now' },
  { label: '문의', href: '/contact' },
];

/** giscus는 한국에서 GitHub 사용률이 낮아 기본 비활성 (Phase 2에서 구글/카카오 로그인으로 교체 예정) */
export const GISCUS = {
  enabled: false,
  repo: 'conbilab/jopeaceblog',
  repoId: '',
  category: 'Guestbook',
  categoryId: '',
  mapping: 'pathname',
  reactionsEnabled: '1',
  lang: 'ko',
} as const;
