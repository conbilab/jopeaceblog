# 워크플로우 결과(JSON) → src/content/posts/*.md 생성
import json, os, re

SRC = r'C:\Users\User\AppData\Local\Temp\claude\D--peaceworks-landingpage-peaceworks-landing\3d81c116-5f10-4400-a7ad-4320084e1c6e\tasks\wz6uglbf5.output'
OUT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'src', 'content', 'posts')
os.makedirs(OUT, exist_ok=True)

data = json.load(open(SRC, 'r', encoding='utf-8'))
posts = data['result'] if isinstance(data, dict) else data

# 슬러그별 메타 보강(커버/완성도/추천/추가필드)
META = {
    'carwash-90-stores': dict(cover='/images/video-1.jpg', coverAlt='세차기 홍보 영상 제작 현장', featured=True, growth='evergreen'),
    'ai-video-real-process': dict(cover='/images/video-3.jpg', coverAlt='AI 영상 작업 화면', featured=True, growth='evergreen'),
    'why-peaceworks': dict(featured=True, growth='evergreen'),
    'pretty-vs-inquiry': dict(growth='evergreen'),
    'solopreneur-daejeon': dict(growth='budding'),
    'empty-classroom': dict(cover='/images/lecture-4.jpg', coverAlt='강의 현장', growth='budding'),
    'press-joongdo': dict(cover='/images/press-photo.jpg', coverAlt='중도일보 인터뷰 사진', featured=True, growth='evergreen'),
    'cafe-daejeon-work': dict(growth='seedling', place='이름 없는 동네 카페', location='대전 서구', rating=4.5, priceRange='5,000~7,000원', recommend='창가 콘센트 자리'),
    'lecture-trip-scenes': dict(growth='seedling', region='지방 출장길', companions='혼자'),
    'one-percent-giving': dict(growth='evergreen'),
}

def esc(s):
    s = s.replace('\\', '\\\\').replace('"', '\\"')
    return s

def fm_list(items):
    return '[' + ', '.join('"%s"' % esc(t) for t in items) + ']'

for p in posts:
    slug = p['slug']
    m = META.get(slug, {})
    lines = ['---']
    lines.append('title: "%s"' % esc(p['title']))
    lines.append('pubDate: %s' % p['pubDate'])
    lines.append('category: %s' % p['cat'])
    lines.append('tags: %s' % fm_list(p.get('tags', [])))
    if p.get('summary'):
        lines.append('summary: "%s"' % esc(p['summary']))
    if m.get('cover'):
        lines.append('cover: %s' % m['cover'])
    if m.get('coverAlt'):
        lines.append('coverAlt: "%s"' % esc(m['coverAlt']))
    lines.append('growth: %s' % m.get('growth', 'evergreen'))
    if m.get('featured'):
        lines.append('featured: true')
    # food
    for k in ('place', 'location', 'priceRange', 'recommend', 'region', 'companions'):
        if m.get(k):
            lines.append('%s: "%s"' % (k, esc(str(m[k]))))
    if m.get('rating') is not None:
        lines.append('rating: %s' % m['rating'])
    lines.append('---')
    lines.append('')
    body = p.get('bodyMarkdown', '').strip()
    # pullQuote를 본문 중간 인용으로 자연 삽입하지 않고, 이미 본문에 녹아있으므로 그대로 둠
    out = '\n'.join(lines) + '\n' + body + '\n'
    fn = os.path.join(OUT, slug + '.md')
    open(fn, 'w', encoding='utf-8').write(out)
    print('wrote', slug, '(%d chars)' % len(body))

print('TOTAL', len(posts), 'posts ->', OUT)
