#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
네이버 블로그 글 → 피스노트(records) 마크다운 자동 이전 도구.

[무엇을 하나]
  1) 네이버 블로그 ID로 글 목록을 모은다 (모바일 목록 API → 실패 시 RSS).
  2) 각 글의 본문 HTML을 가져와 마크다운으로 변환한다.
  3) 글마다 '작성날짜 제목' 폴더를 만들고 그 안에 index.md + 이미지(./img-NN)를 저장한다.
     - 기본: 블로그에 바로 넣지 않고 naver-export/ 아래로 "따로" 내보낸다(검토용).
     - --to-records 를 주면 블로그(src/content/records)에 바로 넣는다.
     - 기본 visibility=private-draft (검수 전 자동 공개 방지)

[폴더 구조 예시 — 기본(따로 내보내기)]
  naver-export/
    └─ 2023-05-01 대전 카페에서 일한 하루/
         ├─ index.md          (frontmatter + 본문)
         ├─ img-01.jpg
         └─ img-02.jpg

[사용법]
  pip install -r scripts/requirements.txt
  python scripts/import_naver.py --blog-id 네이버아이디 --dry-run          # 미리보기(파일 안 만듦)
  python scripts/import_naver.py --blog-id 네이버아이디 --limit 3          # 최신 3개만 따로 내보내기
  python scripts/import_naver.py --blog-id 네이버아이디                     # 전체 따로 내보내기
  python scripts/import_naver.py --blog-id 네이버아이디 --to-records        # 블로그에 바로 넣기
  python scripts/import_naver.py --blog-id 네이버아이디 --log-no 22300 22301  # 특정 글만

[설계 메모 — 책임 분리(SRP/DIP)]
  - NaverBlogClient : 외부 연동(HTTP) 담당 (어댑터)
  - 순수 함수들      : HTML 파싱·마크다운 변환·메타 추론·frontmatter 생성 (입력→출력, 테스트 가능)
  - writer 함수들    : 파일/이미지 저장 (IO)
  - main()          : 위 조각들을 조립(오케스트레이션)
"""
from __future__ import annotations

import argparse
import json
import os
import re
import sys
import time
from dataclasses import dataclass, field
from typing import Iterable
from urllib.parse import urljoin, urlparse

try:
    import requests
    from bs4 import BeautifulSoup
    from markdownify import markdownify as md
except ImportError:
    sys.exit(
        "필요 패키지가 없습니다. 먼저 설치하세요:\n"
        "  pip install -r scripts/requirements.txt"
    )

# ----------------------------------------------------------------------------
# 경로 상수
# ----------------------------------------------------------------------------
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RECORDS_DIR = os.path.join(ROOT, "src", "content", "records")
UPLOADS_DIR = os.path.join(ROOT, "public", "uploads", "naver")

UA = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/124.0 Safari/537.36"
)


# ----------------------------------------------------------------------------
# 데이터 모델
# ----------------------------------------------------------------------------
@dataclass
class PostMeta:
    """목록에서 얻는 글 식별 정보."""
    log_no: str
    title: str = ""
    date: str = ""  # YYYY-MM-DD


@dataclass
class ParsedPost:
    """본문 파싱 결과(순수 데이터)."""
    log_no: str
    title: str
    date: str
    tags: list[str] = field(default_factory=list)
    body_html: str = ""
    image_urls: list[str] = field(default_factory=list)


# ----------------------------------------------------------------------------
# 어댑터: 외부 연동(HTTP)만 담당 (DIP — 상위 로직은 이 클래스에만 의존)
# ----------------------------------------------------------------------------
class NaverBlogClient:
    def __init__(self, blog_id: str, delay: float = 0.8):
        self.blog_id = blog_id
        self.delay = delay
        self.s = requests.Session()
        self.s.headers.update({"User-Agent": UA, "Referer": "https://blog.naver.com/"})

    def _get(self, url: str, **kw) -> requests.Response:
        r = self.s.get(url, timeout=20, **kw)
        r.raise_for_status()
        time.sleep(self.delay)  # 과도한 요청 방지(매너 + 차단 회피)
        return r

    def list_post_nos(self, category_no: int = 0, max_count: int | None = None) -> list[PostMeta]:
        """모바일 목록 API로 전체 logNo 수집. 실패하면 RSS로 폴백."""
        try:
            return self._list_via_api(category_no, max_count)
        except Exception as e:  # noqa: BLE001
            print(f"  [경고] 목록 API 실패({e}). RSS로 대체 시도합니다.")
            return self._list_via_rss(max_count)

    def _list_via_api(self, category_no: int, max_count: int | None) -> list[PostMeta]:
        out: list[PostMeta] = []
        page = 1
        while True:
            url = (
                f"https://m.blog.naver.com/api/blogs/{self.blog_id}/post-list"
                f"?categoryNo={category_no}&itemCount=30&page={page}"
            )
            raw = self._get(url).text
            data = json.loads(raw[raw.index("{"):])  # 앞쪽 안전문자 제거
            result = data.get("result", data)
            items = result.get("items", []) or []
            if not items:
                break
            for it in items:
                log_no = str(it.get("logNo") or it.get("logNumber") or "").strip()
                if not log_no:
                    continue
                title = _clean(it.get("titleWithInspectMessage") or it.get("title") or "")
                out.append(PostMeta(log_no=log_no, title=title, date=_norm_date(it.get("addDate", ""))))
                if max_count and len(out) >= max_count:
                    return out
            total = int(result.get("totalCount", 0) or 0)
            if total and len(out) >= total:
                break
            page += 1
            if page > 200:  # 무한루프 안전장치
                break
        return out

    def _list_via_rss(self, max_count: int | None) -> list[PostMeta]:
        url = f"https://rss.blog.naver.com/{self.blog_id}.xml"
        soup = BeautifulSoup(self._get(url).content, "xml")
        out: list[PostMeta] = []
        for item in soup.find_all("item"):
            link = (item.link.text if item.link else "") or ""
            m = re.search(r"logNo=(\d+)", link) or re.search(r"/(\d+)$", link)
            if not m:
                continue
            out.append(PostMeta(
                log_no=m.group(1),
                title=_clean(item.title.text if item.title else ""),
                date=_norm_date(item.pubDate.text if item.pubDate else ""),
            ))
            if max_count and len(out) >= max_count:
                break
        return out

    def fetch_post_html(self, log_no: str) -> str:
        url = (
            f"https://blog.naver.com/PostView.naver?blogId={self.blog_id}"
            f"&logNo={log_no}&redirect=Dlog&widgetTypeCall=true&directAccess=false"
        )
        r = self._get(url)
        r.encoding = r.apparent_encoding or "utf-8"
        return r.text

    def download(self, url: str, dest_path: str) -> bool:
        try:
            r = self._get(url, headers={"Referer": f"https://blog.naver.com/{self.blog_id}"})
            with open(dest_path, "wb") as f:
                f.write(r.content)
            return True
        except Exception as e:  # noqa: BLE001
            print(f"    [경고] 이미지 실패: {url} ({e})")
            return False


# ----------------------------------------------------------------------------
# 순수 함수: 파싱 / 변환 / 추론 (입력 → 출력, 외부 의존 없음 → 테스트 쉬움)
# ----------------------------------------------------------------------------
def parse_post(html: str, meta: PostMeta) -> ParsedPost:
    """PostView HTML에서 제목/날짜/태그/본문/이미지URL을 뽑아낸다."""
    soup = BeautifulSoup(html, "html.parser")

    # 본문 컨테이너: 신형(SmartEditor ONE) → 구형 순으로 탐색
    container = (
        soup.select_one("div.se-main-container")
        or soup.select_one("div#postViewArea")
        or soup.select_one("div.post_ct")
    )

    title = meta.title or _extract_title(soup)
    date = meta.date or _extract_date(soup)
    tags = _extract_tags(soup)

    image_urls: list[str] = []
    if container:
        for img in container.find_all("img"):
            src = img.get("data-lazy-src") or img.get("data-src") or img.get("src") or ""
            src = _hires(src)
            if src.startswith("http"):
                image_urls.append(src)
                img["src"] = src  # 변환 전 정규화
        body_html = str(container)
    else:
        body_html = ""

    return ParsedPost(
        log_no=meta.log_no, title=title, date=date,
        tags=tags, body_html=body_html, image_urls=image_urls,
    )


def to_markdown(body_html: str, url_to_local: dict[str, str]) -> str:
    """본문 HTML → 마크다운. 이미지 src를 로컬 경로로 치환한다."""
    if not body_html:
        return ""
    soup = BeautifulSoup(body_html, "html.parser")
    # 네이버 위젯/지도/스티커 등 불필요 요소 제거
    for sel in ["script", "style", ".se-oglink", ".se-sticker", ".__se_module_data"]:
        for el in soup.select(sel):
            el.decompose()
    # 이미지 경로 치환
    for img in soup.find_all("img"):
        src = _hires(img.get("src", ""))
        if src in url_to_local:
            img["src"] = url_to_local[src]
            img["alt"] = img.get("alt", "")
    text = md(str(soup), heading_style="ATX", strip=["span", "font"], bullets="-")
    return _tidy(text)


def guess_type_topic(title: str, tags: list[str], body: str) -> tuple[str, str]:
    """제목·태그·본문 키워드로 type/topic 추론(검수 전 기본값)."""
    blob = " ".join([title] + tags + [body[:300]]).lower()

    def has(*ws: str) -> bool:
        return any(w.lower() in blob for w in ws)

    if has("맛집", "카페", "식당", "빵", "맛있", "메뉴", "디저트", "커피"):
        return "food-place", "place"
    if has("강의", "후기", "배운", "공부", "ai", "cursor", "claude", "도구", "노하우"):
        return "learning", "ai" if has("ai", "cursor", "claude", "gpt") else "work"
    if has("프로젝트", "작업", "클라이언트", "제작", "촬영", "영상", "마케팅"):
        return "work", "marketing" if has("마케팅", "광고") else "work"
    if has("여행", "출장", "다녀", "풍경"):
        return "action", "place"
    return "thought", "life"


def build_frontmatter(p: ParsedPost, blog_id: str, visibility: str, description: str) -> str:
    rtype, topic = guess_type_topic(p.title, p.tags, p.body_html)
    source_url = f"https://blog.naver.com/{blog_id}/{p.log_no}"
    fm = [
        'title: "%s"' % _esc(p.title or f"네이버 글 {p.log_no}"),
        "date: %s" % (p.date or "2020-01-01"),
        "type: %s" % rtype,
        "topic: %s" % topic,
        "status: completed",
        "visibility: %s" % visibility,
    ]
    if description:
        fm.append('description: "%s"' % _esc(description))
    if p.tags:
        fm.append("tags: [%s]" % ", ".join('"%s"' % _esc(t) for t in p.tags))
    fm.append("source: naver")
    fm.append('sourceUrl: "%s"' % source_url)
    return "---\n" + "\n".join(fm) + "\n---\n"


# ----------------------------------------------------------------------------
# 작은 순수 헬퍼들
# ----------------------------------------------------------------------------
def _clean(s: str) -> str:
    return re.sub(r"\s+", " ", (s or "")).strip()


def _esc(s: str) -> str:
    return str(s).replace("\\", "\\\\").replace('"', '\\"')


def _hires(url: str) -> str:
    """썸네일 쿼리(?type=w80 등)를 큰 이미지로 바꾼다."""
    if not url:
        return url
    if url.startswith("//"):
        url = "https:" + url
    return re.sub(r"\?type=\w+$", "?type=w966", url)


def _norm_date(s: str) -> str:
    if not s:
        return ""
    s = str(s)
    # 1) 타임스탬프(ms)
    if s.isdigit() and len(s) >= 12:
        try:
            t = time.localtime(int(s) / 1000)
            return time.strftime("%Y-%m-%d", t)
        except Exception:  # noqa: BLE001
            pass
    # 2) 2023.05.01. / 2023.5.1 / 2023-05-01
    m = re.search(r"(\d{4})[.\-/]\s*(\d{1,2})[.\-/]\s*(\d{1,2})", s)
    if m:
        return "%04d-%02d-%02d" % (int(m.group(1)), int(m.group(2)), int(m.group(3)))
    # 3) RFC822 (RSS pubDate)
    try:
        from email.utils import parsedate_to_datetime
        return parsedate_to_datetime(s).strftime("%Y-%m-%d")
    except Exception:  # noqa: BLE001
        return ""


def _extract_title(soup: BeautifulSoup) -> str:
    for sel in ["div.se-title-text", ".se_title", ".pcol1", "meta[property='og:title']", "title"]:
        el = soup.select_one(sel)
        if el:
            return _clean(el.get("content") if el.name == "meta" else el.get_text())
    return ""


def _extract_date(soup: BeautifulSoup) -> str:
    for sel in [".se_publishDate", ".date", ".se_date", ".blog2_container .date"]:
        el = soup.select_one(sel)
        if el:
            d = _norm_date(el.get_text())
            if d:
                return d
    return ""


def _extract_tags(soup: BeautifulSoup) -> list[str]:
    tags: list[str] = []
    for el in soup.select(".item_tagfont, .post_tag a, a.tag, .tag_area a"):
        t = _clean(el.get_text()).lstrip("#")
        if t and t not in tags:
            tags.append(t)
    return tags[:8]


def _tidy(md_text: str) -> str:
    md_text = re.sub(r"\n{3,}", "\n\n", md_text)
    md_text = re.sub(r"[ \t]+\n", "\n", md_text)
    return md_text.strip() + "\n"


def _make_description(md_text: str, limit: int = 110) -> str:
    plain = re.sub(r"[#>*_!\[\]()\-`]", "", md_text)
    plain = re.sub(r"https?://\S+", "", plain)
    plain = _clean(plain)
    return (plain[:limit] + "…") if len(plain) > limit else plain


# ----------------------------------------------------------------------------
# IO: 저장 (부수효과 격리)
# ----------------------------------------------------------------------------
def save_images(client: NaverBlogClient, urls: Iterable[str],
                dest_dir: str, url_prefix: str) -> dict[str, str]:
    """이미지를 dest_dir에 내려받고 {원본URL: url_prefix+파일명} 매핑을 반환.

    - 별도 폴더 모드: dest_dir=글 폴더, url_prefix="./"  → 본문은 ./img-01.jpg 참조
    - 블로그 직접 모드: dest_dir=public/uploads/naver/{logNo}, url_prefix="/uploads/naver/{logNo}/"
    """
    mapping: dict[str, str] = {}
    urls = list(dict.fromkeys(urls))  # 중복 제거(순서 유지)
    if not urls:
        return mapping
    os.makedirs(dest_dir, exist_ok=True)
    for i, url in enumerate(urls, 1):
        ext = _guess_ext(url)
        fname = f"img-{i:02d}{ext}"
        if client.download(url, os.path.join(dest_dir, fname)):
            mapping[url] = url_prefix + fname
    return mapping


def _guess_ext(url: str) -> str:
    path = urlparse(url).path.lower()
    for e in (".jpg", ".jpeg", ".png", ".gif", ".webp"):
        if path.endswith(e):
            return e
    return ".jpg"


def write_markdown(path: str, frontmatter: str, body_md: str) -> str:
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        f.write(frontmatter + "\n" + body_md)
    return path


def _safe_folder_name(date: str, title: str, log_no: str, maxlen: int = 80) -> str:
    """폴더 이름 = '작성날짜 제목' (파일시스템 금지문자 제거)."""
    title = title or f"네이버글-{log_no}"
    title = re.sub(r'[\\/:*?"<>|]', "", title)        # 윈도우/맥 금지문자 제거
    title = re.sub(r"\s+", " ", title).strip()
    if len(title) > maxlen:
        title = title[:maxlen].strip()
    prefix = date if date else "날짜미상"
    name = f"{prefix} {title}".strip()
    return name.rstrip(". ")  # 윈도우는 끝 점/공백 금지


# ----------------------------------------------------------------------------
# 오케스트레이션
# ----------------------------------------------------------------------------
def run(args: argparse.Namespace) -> int:
    client = NaverBlogClient(args.blog_id, delay=args.delay)

    # 1) 대상 글 목록 확보
    if args.log_no:
        metas = [PostMeta(log_no=str(n)) for n in args.log_no]
        print(f"지정한 {len(metas)}개 글을 가져옵니다.")
    else:
        print(f"'{args.blog_id}' 블로그의 글 목록을 수집합니다…")
        metas = client.list_post_nos(category_no=args.category, max_count=args.limit)
        print(f"  → {len(metas)}개 글 발견.")

    if not metas:
        print("[빈 상태] 가져올 글이 없습니다. 블로그 ID/공개 여부를 확인하세요.")
        return 1

    ok, fail = 0, 0
    for idx, meta in enumerate(metas, 1):
        try:
            print(f"[{idx}/{len(metas)}] logNo={meta.log_no} 처리 중…")
            html = client.fetch_post_html(meta.log_no)
            parsed = parse_post(html, meta)
            if not parsed.body_html:
                print("    [경고] 본문을 찾지 못했습니다(비공개/삭제 글일 수 있음). 건너뜀.")
                fail += 1
                continue

            if args.dry_run:
                folder = _safe_folder_name(parsed.date, parsed.title, parsed.log_no)
                print(f"    제목: {parsed.title!r}  날짜: {parsed.date or '미상'}  "
                      f"이미지:{len(parsed.image_urls)}장  태그:{parsed.tags}")
                if not args.to_records:
                    print(f"    폴더: {args.out_dir}/{folder}/index.md")
                ok += 1
                continue

            if args.to_records:
                # 모드 B) 블로그에 직접: src/content/records + /uploads/naver
                img_dir = os.path.join(UPLOADS_DIR, parsed.log_no)
                mapping = {} if args.no_images else save_images(
                    client, parsed.image_urls, img_dir, f"/uploads/naver/{parsed.log_no}/")
                body_md = to_markdown(parsed.body_html, mapping)
                fm = build_frontmatter(parsed, args.blog_id, args.visibility, _make_description(body_md))
                path = write_markdown(os.path.join(RECORDS_DIR, f"naver-{parsed.log_no}.md"), fm, body_md)
            else:
                # 모드 A) 따로 폴더로(기본): naver-export/{날짜 제목}/index.md + ./img-01.jpg
                folder = _safe_folder_name(parsed.date, parsed.title, parsed.log_no)
                post_dir = os.path.join(ROOT, args.out_dir, folder)
                mapping = {} if args.no_images else save_images(
                    client, parsed.image_urls, post_dir, "./")
                body_md = to_markdown(parsed.body_html, mapping)
                fm = build_frontmatter(parsed, args.blog_id, args.visibility, _make_description(body_md))
                path = write_markdown(os.path.join(post_dir, "index.md"), fm, body_md)

            print(f"    ✓ 생성: {os.path.relpath(path, ROOT)} (이미지 {len(mapping)}장)")
            ok += 1
        except Exception as e:  # noqa: BLE001
            print(f"    [실패] {e}")
            fail += 1

    print("\n=== 완료 ===")
    print(f"  성공 {ok} / 실패 {fail} / 전체 {len(metas)}")
    if not args.dry_run and ok:
        if args.to_records:
            print("  생성 위치: src/content/records/naver-*.md")
            print("  ⚠️ visibility=private-draft 입니다. 검수 후 public 으로 바꾸면 공개됩니다.")
        else:
            print(f"  생성 위치: {args.out_dir}/<날짜 제목>/index.md  (이미지는 같은 폴더에 ./img-NN)")
            print("  → 검토 후, 옮기고 싶은 글만 src/content/records/ 로 복사하면 됩니다.")
    return 0 if ok else 1


def build_arg_parser() -> argparse.ArgumentParser:
    ap = argparse.ArgumentParser(
        description="네이버 블로그 글을 피스노트(records) 마크다운으로 이전",
    )
    ap.add_argument("--blog-id", required=True, help="네이버 블로그 아이디 (blog.naver.com/<여기>)")
    ap.add_argument("--out-dir", default="naver-export",
                    help="따로 내보낼 폴더(기본 naver-export). 글마다 '날짜 제목' 폴더로 저장")
    ap.add_argument("--to-records", action="store_true",
                    help="블로그에 바로 넣기(src/content/records). 미지정 시 따로 폴더로 내보냄(기본)")
    ap.add_argument("--limit", type=int, default=None, help="가져올 최대 글 수(최신순)")
    ap.add_argument("--log-no", nargs="*", default=None, help="특정 글 번호만 (공백 구분)")
    ap.add_argument("--category", type=int, default=0, help="카테고리 번호(기본 0=전체)")
    ap.add_argument("--visibility", default="private-draft",
                    choices=["public", "careful", "private-draft", "later", "anonymized"],
                    help="생성 글의 공개 상태(기본 private-draft)")
    ap.add_argument("--delay", type=float, default=0.8, help="요청 간격(초)")
    ap.add_argument("--no-images", action="store_true", help="이미지 다운로드 생략")
    ap.add_argument("--dry-run", action="store_true", help="파일을 만들지 않고 미리보기만")
    return ap


def main() -> None:
    # 윈도우 콘솔에서 한글 메시지가 깨지지 않도록 UTF-8 출력 고정
    try:
        sys.stdout.reconfigure(encoding="utf-8")  # type: ignore[attr-defined]
    except Exception:  # noqa: BLE001
        pass
    if not (3, 8) <= sys.version_info[:2]:
        sys.exit("Python 3.8+ 가 필요합니다.")
    args = build_arg_parser().parse_args()
    if not re.fullmatch(r"[A-Za-z0-9_\-]+", args.blog_id or ""):
        sys.exit("[입력 오류] --blog-id 형식이 올바르지 않습니다.")
    sys.exit(run(args))


if __name__ == "__main__":
    main()
