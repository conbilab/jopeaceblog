/** 피스노트(Peace Note) — 사이트 전역 설정 */
export const SITE = {
  title: '피스노트',
  titleEn: 'Peace Note',
  slogan: '제가 겪고 느낀 것을, 다정하게 적어둡니다.',
  subtitle: '보고 배우고 만든 것을, 천천히 적어둡니다.',
  description:
    '영상·마케팅·콘텐츠·AI를 넘나들며 일해온 조피스(조재빈)의 공개 기록장. 12년간 500편 넘는 영상을 만들고, 블로그에 262편을 써왔습니다. 제가 겪고 배우고 느낀 것을, 화려하지 않아도 진심으로 오래 남기려는 기록입니다.',
  author: '조재빈',
  authorHandle: '조피스',
  // ⚠️ 배포 도메인이 정해지면 바꿔주세요 (astro.config.mjs 의 site 와 일치).
  url: 'https://xn--o80bq93a37lsnc.com', // 피스노트.com
  locale: 'ko_KR',
  lang: 'ko',
  email: 'jopd_prod@kakao.com',
  repo: 'conbilab/jopeaceblog',
} as const;

/** 외부 채널 (실제 주소로 채워주세요. '#'은 자동으로 숨겨집니다) */
export const SOCIAL: { label: string; href: string; handle?: string }[] = [
  { label: '유튜브', href: '#', handle: '배워서남주는조피디' },
  { label: '인스타그램', href: '#', handle: '@jopis' },
  { label: '이메일', href: 'mailto:jopd_prod@kakao.com' },
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
