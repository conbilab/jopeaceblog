# 조피스의 기록 🕊️

> **화려하지 않아도 됩니다. 본질을 기록합니다.**
> 조재빈(조피스)의 퍼스널 브랜딩 블로그 — 일상·작업·생각·맛집·여행·성취를 정직하게 남기는 공개 일기.
> 명함에 적어 "이 블로그를 보면 저를 아실 수 있습니다"가 성립하도록 만들었습니다.

---

## 0. 한눈에 보기

- **무엇으로 만들었나**: [Astro](https://astro.build) (정적 사이트) + 마크다운 + Pretendard/Fraunces 폰트
- **글은 어떻게 쓰나**: ① `사이트주소/admin` 의 GUI 편집기(가장 쉬움) 또는 ② 마크다운 파일 직접 작성(Obsidian 등)
- **어디에 올리나**: GitHub → Vercel 자동 배포 (월 0원)
- **왜 안전한가**: 서버·DB가 아예 없는 **정적 사이트** = 해킹 공격면 최소. 여기에 보안 헤더(CSP 등)까지 적용.

---

## 1. 내 컴퓨터에서 미리보기

> 한 번만 설치하면 됩니다. (Node.js 18+ 필요 — 이미 설치되어 있습니다.)

```bash
cd jopis-blog
npm install        # 처음 한 번만
npm run dev        # 미리보기 서버 시작 → 브라우저에서 http://localhost:4321
```

- `npm run build` : 실제 배포용으로 빌드 (결과는 `dist/` 폴더)
- `npm run preview` : 빌드 결과를 미리보기

---

## 2. 글 쓰는 방법 (3가지)

### ✅ 방법 A — `/admin` GUI 편집기 (가장 쉬움, 추천)
배포 후 **`내사이트주소/admin`** 에 접속 → GitHub로 로그인 → 글 작성/수정 → **저장**하면 자동으로 GitHub에 올라가고 사이트가 새로 배포됩니다.
- 제목, 코너(카테고리), 사진, 태그를 클릭만으로 입력
- **폰에서도** 작성 가능 (출장·여행 중에 바로 기록!)
- "비공개 초안"으로 저장했다가 나중에 공개 가능
- *처음 한 번* GitHub 연결 설정이 필요합니다 → 아래 **5번** 참고

### ✅ 방법 B — 마크다운 파일 직접 쓰기 (Obsidian/메모장)
`src/content/posts/` 폴더에 `.md` 파일을 하나 만들면 글 한 편이 됩니다. 맨 위 `---` 사이가 설정, 그 아래가 본문입니다.

```markdown
---
title: "오늘 대전 천변을 걸었다"
pubDate: 2026-06-25
category: daily        # work / thought / daily / food / travel / win 중 하나
summary: "별일 없던 하루, 그래서 적어두는 기록"
tags: ["대전", "산책"]
growth: seedling       # 🌱 단상 / 🌿 정리 중(budding) / 🌳 완성(evergreen)
# cover: /uploads/사진.jpg   # 대표 이미지가 있으면 (선택)
---

여기부터 본문을 마크다운으로 씁니다.

## 소제목도 이렇게

**굵게**, *기울임*, [링크](https://...) 모두 됩니다.
```

저장 후 GitHub에 올리면(push) 자동 배포됩니다.

### ✅ 방법 C — 맛집/여행은 추가 정보도
맛집 글이면 `category: food` 에 아래를 더하면 예쁜 정보 카드가 나옵니다:
```markdown
place: "○○카페"
location: "대전 둔산동"
rating: 4.5
priceRange: "5,000~7,000원"
recommend: "창가 콘센트 자리"
```
여행 글(`category: travel`)이면: `region`, `companions` 를 추가할 수 있습니다.

> 💡 코너(카테고리) 6종: **work**(만드는 시간) · **thought**(문득) · **daily**(오늘의 결) · **food**(맛의 기록) · **travel**(바람 따라) · **win**(발자국)

---

## 2.5 영상·사진 올리기 (우분투 홈서버 연동)

큰 파일은 블로그(깃)에 넣지 않고 **우분투 홈서버(MinIO)** 에 두고 URL로 불러옵니다. 설정은 [`server/README.md`](server/README.md) 참고.

- **편집한 영상** → 유튜브에 올리고 글의 `videoUrl`에 링크: `https://youtu.be/...`
- **그냥 찍은 raw 영상** → 우분투 서버 링크: `videoUrl: https://media.jopis.kr/blog/2026/clip.mp4`
- **사진** → `cover`나 본문에 `https://media.jopis.kr/blog/...jpg`

블로그가 유튜브·Vimeo는 임베드 플레이어로, 내 서버 mp4는 재생 플레이어로 **자동 구분**해서 띄웁니다.
본문 중간에 여러 개 넣고 싶으면 마크다운에 그대로:
```html
<video src="https://media.jopis.kr/blog/clip.mp4" controls></video>
```

> 🔒 우분투는 **Cloudflare Tunnel**로 공개해 공유기 포트를 안 엽니다(집 IP 숨김). 회사·자동화 시스템은 계속 Tailscale 내부에만 두세요. (도메인이 정해지면 `vercel.json`·`astro.config.mjs`의 `media.jopis.kr`를 실제 주소로 바꾸기)

## 3. 배포하기 (GitHub + Vercel, 처음 한 번)

1. **GitHub 저장소 만들기**: GitHub에서 새 저장소(repository)를 만들고, 이 `jopis-blog` 폴더 전체를 올립니다(push).
   - ⚠️ `jopis-blog` 폴더가 저장소의 **최상위**가 되도록 하세요.
2. **Vercel 연결**: [vercel.com](https://vercel.com) → "New Project" → 방금 만든 GitHub 저장소 선택.
   - Framework는 **Astro**로 자동 인식됩니다. 그대로 **Deploy** 누르면 끝.
3. 이후에는 GitHub에 글을 올릴 때마다(또는 `/admin`에서 저장할 때마다) **자동으로 새로 배포**됩니다.

---

## 4. 내 도메인/주소로 바꾸기

배포 주소가 정해지면 두 군데의 주소를 바꿔주세요(검색·RSS·공유 미리보기에 쓰입니다):

- `astro.config.mjs` → `const SITE = 'https://내도메인'`
- `src/lib/site.ts` → `url: 'https://내도메인'`

Vercel에서 내 도메인 연결은 프로젝트 Settings → Domains 에서 가능합니다.

---

## 5. `/admin` GUI 편집기 켜기 (Sveltia CMS)

> 이 블로그는 보안이 검증된 **Sveltia CMS**를 씁니다. (기존 Decap CMS는 2025년 보안 패치가 끊겨 더 안전한 대체재로 교체)

1. GitHub 저장소를 만들고(3번), `public/admin/config.yml` 파일에서
   ```yaml
   repo: jopis/jopis-blog   # ← 본인 "GitHub아이디/저장소이름" 으로 변경
   ```
2. Sveltia는 **자체 GitHub 로그인**을 내장하고 있어, 복잡한 OAuth 서버를 따로 만들 필요가 없습니다.
   - `내사이트주소/admin` 접속 → "Sign in with GitHub" → 권한 허용 → 바로 글쓰기 화면.
   - (회사/조직 저장소 등 특별한 경우만 별도 OAuth 설정이 필요하며, 방법은 https://sveltiacms.app 참고)
3. **보안 팁**: GitHub 계정에 **2단계 인증(2FA)** 을 꼭 켜세요. 이 GitHub 계정이 블로그의 열쇠입니다.

---

## 6. 방명록·댓글 켜기 (giscus)

방명록은 **GitHub 로그인을 한 사람만** 글을 남길 수 있어 익명 스팸이 원천 차단됩니다.

1. GitHub 저장소를 **public**으로 만들고, Settings → Discussions 활성화.
2. [giscus.app](https://giscus.app) 에 저장소 주소를 넣으면 `repoId`, `categoryId` 를 줍니다.
3. `src/lib/site.ts` 의 `GISCUS` 를 채우고 `enabled: true` 로:
   ```ts
   export const GISCUS = {
     enabled: true,
     repo: '내아이디/내저장소',
     repoId: '여기에_repoId',
     category: 'Guestbook',
     categoryId: '여기에_categoryId',
     ...
   }
   ```
4. 설정 전까지는 방명록 자리에 "곧 열립니다" 안내가 보입니다(깨지지 않음).

---

## 7. 자주 하는 일

| 하고 싶은 것 | 어디서 |
|---|---|
| 글 쓰기/수정/삭제 | `/admin` 또는 `src/content/posts/*.md` |
| **Now(요즘 근황) 업데이트** | `src/pages/now.astro` (자주 바꾸세요!) |
| 이력 추가 | `/admin`의 "이력" 또는 `src/content/timeline/*.md` |
| 소개 글 수정 | `src/pages/about.astro` |
| 연락처·SNS 링크 | `src/lib/site.ts` 의 `SOCIAL` |
| 코너 이름/색 바꾸기 | `src/lib/categories.ts` |
| 색/폰트 등 디자인 토큰 | `src/styles/tokens.css` |

---

## 8. 보안 요약 (해킹 방지)

- **정적 사이트**: 서버·데이터베이스가 없으니 해킹당할 "서버"가 없습니다. (가장 강력한 방어)
- **보안 헤더**(`vercel.json`): CSP(콘텐츠 보안 정책), HSTS, X-Frame-Options(클릭재킹 차단), Referrer-Policy, Permissions-Policy 등 적용.
  - 배포 후 [securityheaders.com](https://securityheaders.com) 에 주소를 넣어 **A 등급**을 확인해보세요.
- **방명록**: GitHub 로그인 필수 → 익명 스팸 불가.
- **글 저장소**: GitHub 한 곳이 전부의 열쇠 → **2FA 필수**, main 브랜치 보호 권장.
- CMS(Sveltia)는 보안 대응이 빠른(24시간 내 패치) 최신 도구로 선택했습니다. 가끔 `public/admin/index.html` 의 버전을 올려주세요.

---

## 9. 폴더 구조

```
jopis-blog/
├─ src/
│  ├─ pages/            # 각 페이지 (홈, 소개, Now, 이력, 방명록, 연락, 검색 …)
│  ├─ content/
│  │  ├─ posts/         # ✍️ 글(마크다운) — 여기에 .md 추가
│  │  └─ timeline/      # 이력 항목
│  ├─ components/       # 헤더·푸터·카드·로고 등
│  ├─ layouts/          # 공통 레이아웃
│  ├─ lib/              # 설정(site.ts)·카테고리·유틸
│  └─ styles/           # 디자인 토큰·글로벌 CSS·폰트
├─ public/
│  ├─ admin/            # /admin CMS (Sveltia)
│  ├─ fonts/            # Pretendard, Fraunces (self-host)
│  ├─ images/           # 사진
│  └─ uploads/          # CMS로 올린 이미지가 여기 저장
├─ docs/DESIGN_BRIEF.md # 디자인·기술 결정 근거(리서치 종합)
├─ astro.config.mjs     # 사이트 주소·통합 설정
└─ vercel.json          # 보안 헤더
```

---

## 10. 디자인에 대하여

이 블로그의 디자인·정보구조·보안은 **5갈래 리서치**(퍼스널 브랜딩 트렌드·정보구조·비주얼 레퍼런스·보안 아키텍처·콘텐츠 전략)를 종합해 결정했습니다.
자세한 근거는 [`docs/DESIGN_BRIEF.md`](docs/DESIGN_BRIEF.md) 에 정리해두었습니다.

핵심 원칙 세 가지:
1. **따뜻한 에디토리얼** — 크림·딥그린·골드, Pretendard 본문 + Fraunces 세리프 포인트. 한글 가독성(줄폭 ~40자, 행간 1.7) 수치까지 맞춤.
2. **큐레이션 우선** — 시간순 나열이 아니라, 처음 온 사람에게 대표 글부터 보여주는 구조.
3. **정직이 곧 브랜드** — 잘된 것도 망한 것도 적는다. 자랑이 아니라 증거로.

---

🕊️ *콘텐츠로 평화를 만드는 일. 수익의 1%는 아이들에게.*
© 2026 조재빈(조피스) · 피스웍스
