# 피스노트 (Peace Note) 🕊️

> **잘 보이기보다, 부끄럽지 않게 살고 싶다.**
> 조피스(조재빈)의 개인 공개 기록장 — 내가 본 것, 느낀 것, 배운 것, 행동한 것을 정직하게 기록합니다.
> 전문가 포트폴리오가 아니라, 한 사람이 부끄럽지 않게 살기 위해 남기는 기록장.

---

## 0. 무엇으로 만들었나
- [Astro](https://astro.build) 정적 사이트 + 마크다운 콘텐츠 컬렉션 + Pretendard/Fraunces(self-host)
- 디자인: 따뜻한 종이색 `#fbf8f2` + 차분한 보라 `#6b5b95`, 본문 17px / 720px
- 배포: GitHub(`conbilab/jopeaceblog`) → Vercel 자동 배포

## 1. 내 컴퓨터에서 미리보기
```bash
cd jopis-blog
npm install     # 처음 한 번만
npm run dev     # http://localhost:4321
```
`npm run build` → 배포용 빌드(`dist/`).

## 2. 글(기록) 쓰는 법
`src/content/records/` 에 `.md` 파일 하나 = 기록 한 개.

```markdown
---
title: "좋은 사람으로 보이고 싶은 게 아니라 좋은 사람이 되고 싶다"
date: 2026-06-26
type: thought          # 아래 표 참고
topic: life            # 삶/일/마케팅/ai/콘텐츠/sechago/영어/place/book/people
status: seed           # seed(씨앗)/growing(발전중)/completed(완성)/revised(수정됨)
visibility: public     # public/careful/private-draft/later/anonymized
description: "한 줄 요약"
tags: ["정직", "삶의기준"]
question: "나는 어떤 기준으로 살고 싶은가?"   # 글 하단 '남은 질문'(선택)
---

본문을 마크다운으로 씁니다.
```

**기록 유형(type)**
| type | 뜻 | | type | 뜻 |
|---|---|---|---|---|
| thought | 생각한 것 | | learning | 배운 것 |
| feeling | 느낀 것 | | revision | 고친 것 |
| action | 해본 것 | | food-place | 먹고 간 곳 |
| work | 일한 것 | | | |

- `/good-things`(좋았던 것들)는 `type: food-place` 글이 모입니다.
- `/learning`(배운 것들)은 `type: learning` 글이 모입니다.
- **나의 기준**은 `src/content/standards/`, **프로젝트**는 `src/content/projects/` 에 있습니다.

> `visibility`가 `private-draft`/`later`면 빌드 시 공개에서 제외됩니다(나중에 공개용 초안).

## 3. 페이지 구조 (스펙대로)
```
/            홈
/records     기록 전체 (유형·주제·상태 필터)
/standards   나의 기준 (8가지)
/work        일과 프로젝트
/good-things 좋았던 것들
/learning    배운 것들
/now         지금 하는 일  ← 자주 업데이트!
/about       소개
/contact     문의
```
- Now/소개/문의 문구는 각각 `src/pages/now.astro`·`about.astro`·`contact.astro` 에서 바로 수정.
- 색·폰트 등 디자인은 `src/styles/tokens.css`.

## 4. 배포 (이미 연결됨)
GitHub `conbilab/jopeaceblog` → Vercel 자동 배포. 글을 올리면(push) 자동으로 새 배포됩니다.
도메인 확정 시 `astro.config.mjs`·`src/lib/site.ts`의 주소를 바꿔주세요.

## 5. 다음 단계 (Phase 2) — 아직 안 붙음
사용자 요청으로 재설계 후 붙일 것들:
1. **어디서든 글쓰기** (GitHub 없이) — 노션→사이트 동기화 또는 우분투 셀프호스팅 CMS
2. **로그인** — 구글 + 카카오(+네이버), 또는 아주 단순한 회원가입 (Supabase 등)
3. **뉴스레터** — 신청 폼 + 매일 글을 메일로 (현재 `/contact`에 자리만 있음)

> 한국에서 GitHub 사용률이 낮아, 기존 GitHub 기반(Sveltia CMS·giscus)은 Phase 2에서 교체합니다.

## 6. 영상·사진 (우분투 홈서버)
큰 파일은 깃에 넣지 않고 우분투 MinIO + Cloudflare Tunnel(`media.jopis.kr`)로 서빙 → 글에서 URL로 사용. 편집 영상은 유튜브. 설정: [`server/`](server/) 폴더.

---

🕊️ © 2026 조재빈(조피스). 피스노트는 한 사람이 부끄럽지 않게 살기 위해 남기는 공개 기록장입니다.
