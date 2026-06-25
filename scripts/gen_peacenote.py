# 피스노트 워크플로우 결과 → records/projects/standards 마크다운 생성
import json, os, shutil

SRC = r'C:\Users\User\AppData\Local\Temp\claude\D--peaceworks-landingpage-peaceworks-landing\3d81c116-5f10-4400-a7ad-4320084e1c6e\tasks\wzuf9o4o0.output'
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CONTENT = os.path.join(ROOT, 'src', 'content')

data = json.load(open(SRC, encoding='utf-8'))
res = data['result'] if isinstance(data, dict) and 'result' in data else data

def esc(s):
    return str(s).replace('\\', '\\\\').replace('"', '\\"')

def fm_list(items):
    return '[' + ', '.join('"%s"' % esc(t) for t in items) + ']'

def write(folder, slug, fm_lines, body):
    d = os.path.join(CONTENT, folder)
    os.makedirs(d, exist_ok=True)
    out = '---\n' + '\n'.join(fm_lines) + '\n---\n\n' + (body or '').strip() + '\n'
    open(os.path.join(d, slug + '.md'), 'w', encoding='utf-8').write(out)

# 구버전 컬렉션 정리
for old in ('posts', 'timeline'):
    p = os.path.join(CONTENT, old)
    if os.path.isdir(p):
        shutil.rmtree(p); print('removed old', old)

# featured 지정(홈 노출용)
FEATURED_RECORDS = {'good-person-not-look-good', 'be-a-good-person'}

n = 0
# --- standards ---
for it in res['standards']['items']:
    fm = [
        'title: "%s"' % esc(it['title']),
        'summary: "%s"' % esc(it['summary']),
        'order: %d' % it.get('order', 0),
    ]
    if it.get('careful'): fm.append('careful: "%s"' % esc(it['careful']))
    if it.get('action'): fm.append('action: "%s"' % esc(it['action']))
    write('standards', it['slug'], fm, it.get('body', ''))
    n += 1

# --- projects ---
for it in res['projects']['items']:
    fm = [
        'title: "%s"' % esc(it['title']),
        'oneliner: "%s"' % esc(it['oneliner']),
        'status: %s' % it.get('status', 'active'),
        'topic: %s' % it.get('topic', 'work'),
    ]
    for k in ('period', 'role', 'problem', 'learned'):
        if it.get(k): fm.append('%s: "%s"' % (k, esc(it[k])))
    write('projects', it['slug'], fm, it.get('body', ''))
    n += 1

# --- records ---
for it in res['records']['items']:
    feat = it['slug'] in FEATURED_RECORDS
    fm = [
        'title: "%s"' % esc(it['title']),
        'date: %s' % it['date'],
        'type: %s' % it['type'],
        'topic: %s' % it.get('topic', 'life'),
        'status: %s' % it.get('status', 'completed'),
    ]
    if it.get('description'): fm.append('description: "%s"' % esc(it['description']))
    if it.get('tags'): fm.append('tags: %s' % fm_list(it['tags']))
    if it.get('question'): fm.append('question: "%s"' % esc(it['question']))
    if feat: fm.append('featured: true')
    write('records', it['slug'], fm, it.get('body', ''))
    n += 1

print('wrote', n, 'files (standards/projects/records)')
