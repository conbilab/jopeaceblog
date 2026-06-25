/** 사이트 전역 설정 — 한 곳에서 관리 */
export const SITE = {
  title: '조피스의 기록',
  titleEn: 'JOPIS',
  tagline: '화려하지 않아도 됩니다. 본질을 기록합니다.',
  subtitle: '콘텐츠로 평화를 만드는 사람, 조재빈의 일기',
  description:
    '영상 12년·마케팅 6년·강의 6년. 대전에서 1인 기업 피스웍스를 운영하는 조재빈(조피스)의 공개 일기 — 일상·작업·생각·맛집·여행·성취를 정직하게 기록합니다.',
  author: '조재빈',
  authorHandle: '조피스',
  // ⚠️ 배포 도메인이 정해지면 바꿔주세요 (astro.config.mjs 의 site 와 일치).
  url: 'https://jopis.kr',
  locale: 'ko_KR',
  lang: 'ko',
  email: 'paigraphy@gmail.com',
  // giscus / Sveltia 가 바라볼 GitHub 저장소 (배포 시 본인 것으로 교체)
  repo: 'jopis/jopis-blog',
} as const;

/** 외부 채널 (실제 주소로 채워주세요) */
export const SOCIAL: { label: string; href: string; handle?: string }[] = [
  { label: '피스웍스(사업)', href: '#', handle: 'peaceworks' },
  { label: '인스타그램', href: '#', handle: '@jopis' },
  { label: '유튜브', href: '#', handle: '배워서남주는조피디' },
  { label: '이메일', href: 'mailto:paigraphy@gmail.com' },
];

/** 상단 내비게이션 (7개 이하 유지) */
export const NAV: { label: string; href: string }[] = [
  { label: '홈', href: '/' },
  { label: '기록', href: '/log' },
  { label: '소개', href: '/about' },
  { label: 'Now', href: '/now' },
  { label: '이력', href: '/timeline' },
  { label: '방명록', href: '/guestbook' },
];

/**
 * giscus(방명록·댓글) 설정 — GitHub Discussions 기반, 로그인 필수 = 스팸 차단.
 * 1) GitHub 저장소를 public 으로 만들고 Discussions 활성화
 * 2) https://giscus.app 에서 repo 입력 → repoId / categoryId 발급
 * 3) 아래 값을 채우고 enabled: true 로 변경하면 방명록/댓글이 켜집니다.
 */
export const GISCUS = {
  enabled: false,
  repo: 'jopis/jopis-blog',
  repoId: '',
  category: 'Guestbook',
  categoryId: '',
  mapping: 'pathname',
  reactionsEnabled: '1',
  lang: 'ko',
} as const;

/** 신뢰 지표(히어로 실적 스트립) */
export const STATS: { value: string; label: string }[] = [
  { value: '500+', label: '제작한 영상' },
  { value: '90', label: '키운 가맹점' },
  { value: '6년', label: '대학·기관 강의' },
  { value: '1%', label: '아이들에게 기부' },
];
