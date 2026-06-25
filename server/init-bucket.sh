#!/usr/bin/env bash
# 공개 버킷 'blog' 생성 + 익명 '읽기 전용' 설정 (업로드는 인증 필요, 다운로드만 공개)
# 사용:  bash init-bucket.sh
set -euo pipefail

# .env 로드
set -a; [ -f .env ] && . ./.env; set +a

echo "▶ MinIO 버킷 초기화..."
docker run --rm --network jopis_jopis \
  -e MC_HOST_local="http://${MINIO_ROOT_USER}:${MINIO_ROOT_PASSWORD}@minio:9000" \
  minio/mc sh -c '
    mc mb -p local/blog || true
    mc anonymous set download local/blog   # 익명 다운로드(읽기)만 허용
    echo "버킷 정책:"; mc anonymous get local/blog
  '

echo "✓ 완료. 이제 공개 URL 형식:  https://media.jopis.kr/blog/<경로>"
echo "  업로드 예:  docker run --rm --network jopis_jopis -v \$PWD:/w \\"
echo "             -e MC_HOST_local=\"http://\$MINIO_ROOT_USER:\$MINIO_ROOT_PASSWORD@minio:9000\" \\"
echo "             minio/mc cp /w/영상.mp4 local/blog/2026/clip.mp4"
