# 우분투 미디어 서버 설정 (MinIO + Cloudflare Tunnel)

블로그의 **사진·raw 영상**을 우분투 홈서버에서 안전하게 공개하는 설정입니다.
공유기 포트를 하나도 열지 않고(= 해킹 표적 안 됨), Cloudflare를 거쳐 `https://media.jopis.kr/blog/...` 로 내보냅니다.

```
블로그(Vercel)  ──<img>/<video>──►  media.jopis.kr  ──Cloudflare(HTTPS·캐시·DDoS방어)──►
   ──Tunnel(cloudflared)──►  MinIO(우분투, 포트 안 엶)
```

---

## 1) 준비
- 우분투에 Docker + docker compose (이미 있으시죠 ✅)
- Cloudflare에 도메인(jopis.kr 등)이 연결돼 있을 것 (이미 사용 중 ✅)

## 2) Cloudflare 터널 만들기 (대시보드, 5분)
1. **Cloudflare Zero Trust** → **Networks → Tunnels → Create a tunnel** → *Cloudflared* 선택 → 이름(예: `jopis-media`).
2. 화면에 나오는 **토큰**을 복사 → 아래 `.env`의 `CLOUDFLARE_TUNNEL_TOKEN`에 붙여넣기.
3. 같은 화면 **Public Hostname** 추가:
   - Subdomain: `media` / Domain: `jopis.kr`
   - Service: **HTTP** → `minio:9000`
   - (Additional settings → HTTP Host Header 에 `media.jopis.kr` 넣어두면 안전)

## 3) 실행
```bash
cd server
cp .env.example .env        # 값 채우기 (MinIO 비번, 터널 토큰)
docker compose up -d        # MinIO + cloudflared 시작
bash init-bucket.sh         # 공개 버킷 'blog' 생성 + 익명 읽기 설정
```

끝! 이제 `https://media.jopis.kr/blog/...` 로 파일이 공개됩니다.

## 4) 파일 올리기 (3가지 방법)
- **관리 콘솔(쉬움)**: 브라우저로 `http://localhost:9001` (또는 Tailscale IP:9001) → 로그인 → `blog` 버킷에 드래그&드롭.
- **명령어**:
  ```bash
  docker run --rm --network jopis_jopis -v $PWD:/w \
    -e MC_HOST_local="http://$MINIO_ROOT_USER:$MINIO_ROOT_PASSWORD@minio:9000" \
    minio/mc cp /w/영상.mp4 local/blog/2026/clip.mp4
  ```
- **영상 자동화 시스템 연동**: 이미 돌리는 자동화가 S3 API로 `blog` 버킷에 바로 업로드하게 하면, 찍은 영상이 자동으로 블로그에 쓸 수 있는 URL이 됩니다. (endpoint: `http://minio:9000`, path-style)

## 5) 블로그에서 쓰기
글 작성 시(`/admin` 또는 마크다운):
- **편집한 영상** → 유튜브 링크를 `videoUrl`에: `https://youtu.be/...`
- **그냥 찍은 raw 영상** → 내 서버 링크를: `videoUrl: https://media.jopis.kr/blog/2026/clip.mp4`
- **사진** → `cover` 또는 본문에 `https://media.jopis.kr/blog/...jpg`

블로그가 알아서 유튜브는 임베드로, mp4는 재생 플레이어로 띄웁니다.

---

## 🔒 보안 체크리스트
- [ ] 공유기 포트포워딩 **안 함** (cloudflared가 아웃바운드로 연결)
- [ ] 터널 Public Hostname은 **media.jopis.kr → minio:9000 하나만** (회사 시스템·자동화는 노출 X, 계속 Tailscale 내부)
- [ ] `blog` 버킷은 **익명 다운로드만**(업로드는 관리자 인증). `init-bucket.sh`가 그렇게 설정함.
- [ ] 콘솔(9001)은 `127.0.0.1` 또는 Tailscale에서만 접근
- [ ] `.env` 는 깃에 올리지 않기 (이미 .gitignore 처리)
- [ ] (영상 많아지면) Cloudflare 무료 약관상 대용량 영상 스트리밍 제한 → **Cloudflare Stream / Bunny Stream**으로 이전 고려

## 참고: CORS
`<img>`/`<video>` 임베드는 CORS가 필요 없습니다. 나중에 JS로 직접 fetch 할 일이 생기면 MinIO 버킷에 CORS 규칙을 추가하세요.
