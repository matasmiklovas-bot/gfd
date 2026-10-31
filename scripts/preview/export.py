"""Static preview of the store for hosts without a Node server (GitHub Pages).

Crawls a running production server (`npm run build && npm start`) via the sitemap and writes plain HTML pages with
relative links, the stylesheet with fonts inlined, the product photos and a small script for the menu and sliders.
The bag, checkout, search, filters and forms need the Next.js server and show a notice instead.

Usage: python3 scripts/preview/export.py OUT_DIR [BASE_URL]   (default BASE_URL http://localhost:3000)
The Lithuanian home page becomes index.html; the English home page is en.html.
"""
import base64, html, os, re, shutil, sys, urllib.parse, urllib.request

OUT = sys.argv[1]
BASE = (sys.argv[2] if len(sys.argv) > 2 else 'http://localhost:3000').rstrip('/')
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(HERE))


def get(path, binary=False):
    with urllib.request.urlopen(BASE + path) as r:
        data = r.read()
    return data if binary else data.decode('utf-8')


os.makedirs(OUT, exist_ok=True)
sitemap = get('/sitemap.xml')
paths = [re.sub(r'^https?://[^/]+', '', u) or '/' for u in re.findall(r'<loc>([^<]+)</loc>', sitemap)]
paths += ['/help', '/legal', '/lt/help', '/lt/legal']


def fname(p):
    if p == '/lt':
        return 'index.html'
    if p == '/':
        return 'en.html'
    return p.strip('/').replace('/', '-') + '.html'


PAGES = {p: fname(p) for p in paths}

# Stylesheet with the web fonts inlined, plus the preview notice styles.
css_href = re.search(r'<link rel="stylesheet" href="([^"]+)"', get('/')).group(1)
css = get(css_href)
css = re.sub(
    r'url\((/_next/static/media/[^)]+\.woff2)\)',
    lambda m: 'url(data:font/woff2;base64,' + base64.b64encode(get(m.group(1), binary=True)).decode() + ')',
    css,
)
css += '''
.preview-bar{background:#F4F2EE;color:#0A0A0A;font:500 12px/1.4 system-ui,sans-serif;text-align:center;padding:8px max(16px,env(safe-area-inset-right,0px)) 8px max(16px,env(safe-area-inset-left,0px));border-bottom:1px solid #E2E0DB}
.preview-toast{position:fixed;left:50%;bottom:calc(24px + env(safe-area-inset-bottom,0px));transform:translateX(-50%);background:#0A0A0A;color:#fff;font:500 13px/1.4 system-ui,sans-serif;padding:12px 16px;z-index:9999;max-width:calc(100% - 32px);text-align:center}
'''
open(os.path.join(OUT, 'site.css'), 'w').write(css)
shutil.copyfile(os.path.join(HERE, 'site.js'), os.path.join(OUT, 'site.js'))
shutil.copytree(os.path.join(ROOT, 'public', 'images'), os.path.join(OUT, 'images'), dirs_exist_ok=True)


def fix_img(m):
    tag = m.group(0)
    src = re.search(r' src="([^"]+)"', tag)
    if not src:
        return tag
    url = html.unescape(src.group(1))
    if url.startswith('/_next/image'):
        url = urllib.parse.parse_qs(urllib.parse.urlparse(url).query)['url'][0]
    tag = re.sub(r' srcSet="[^"]*"', '', tag)
    return tag.replace(src.group(0), f' src="{url.lstrip("/")}" loading="lazy"')


def fix_href(m):
    path = html.unescape(m.group(1)).split('#')[0].split('?')[0] or '/'
    return f'href="{PAGES[path]}"' if path in PAGES else 'href="#" data-unavailable=""'


BAR = {
    'lt': 'Demonstracinė versija. Krepšelis, paieška, filtrai ir apmokėjimas veikia pilnoje svetainėje.',
    'en': 'Preview. The bag, search, filters and checkout work on the full site.',
}
for p, f in PAGES.items():
    lang = 'lt' if p == '/lt' or p.startswith('/lt/') else 'en'
    doc = get(p)
    doc = re.sub(r'<script\b[^>]*>.*?</script>', '', doc, flags=re.S)
    doc = re.sub(r'<link\b[^>]*>', '', doc)
    doc = re.sub(r'<meta name="next-size-adjust"[^>]*>', '', doc)
    doc = re.sub(r'<img\b[^>]*>', fix_img, doc)
    doc = re.sub(r'href="(/[^"]*)"', fix_href, doc)
    head = re.search(r'<head>(.*?)</head>', doc, re.S).group(1)
    body = re.search(r'<body[^>]*>(.*)</body>', doc, re.S).group(1)
    title = re.search(r'<title>.*?</title>', head, re.S).group(0)
    desc = re.search(r'<meta name="description"[^>]*>', head)
    out = (
        f'<!doctype html>\n<html lang="{lang}"><head><meta charset="utf-8">'
        '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">'
        f'{title}{desc.group(0) if desc else ""}<meta name="robots" content="noindex">'
        '<link rel="stylesheet" href="site.css"></head>'
        f'<body><div class="preview-bar">{BAR[lang]}</div>{body}<script src="site.js"></script></body></html>\n'
    )
    open(os.path.join(OUT, f), 'w').write(out)
open(os.path.join(OUT, '.nojekyll'), 'w').close()
print(len(PAGES), 'pages')
