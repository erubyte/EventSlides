import base64, io, json, os, signal, subprocess, sys
from concurrent.futures import ThreadPoolExecutor
from PIL import Image, ImageOps
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor, white
from reportlab.lib.utils import ImageReader
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

SRC, OUT = sys.argv[1], sys.argv[2]
signal.alarm(25)
TMP_OUT = OUT + '.tmp.pdf'
W, H = 1280, 720
BLUE, INK, MUTED = HexColor('#d9efff'), HexColor('#14283b'), HexColor('#4f6d85')
gradient = Image.new('RGBA', (2, 256), (0, 0, 0, 0))
for gy in range(256):
    alpha = int(242 * (gy / 255) ** 1.35)
    for gx in range(2): gradient.putpixel((gx, gy), (0, 0, 0, alpha))
GRADIENT = ImageReader(gradient)
pdfmetrics.registerFont(TTFont('Arial', '/System/Library/Fonts/Supplemental/Arial.ttf'))
pdfmetrics.registerFont(TTFont('Arial-Bold', '/System/Library/Fonts/Supplemental/Arial Bold.ttf'))

with open(SRC, encoding='utf-8') as f:
    venues = json.load(f)['venues']

def fetch(src):
    try:
        if src.startswith('data:'):
            raw = base64.b64decode(src.split(',', 1)[1])
        else:
            raw = subprocess.run(
                ['curl', '-L', '--silent', '--show-error', '--connect-timeout', '3', '--max-time', '7',
                 '-A', 'Mozilla/5.0', src], capture_output=True, check=True, timeout=9
            ).stdout
        return Image.open(io.BytesIO(raw)).convert('RGB')
    except Exception:
        return None

sources = list(dict.fromkeys(s for v in venues for e in v['exhibitions'] for s in e.get('images', [])))
with ThreadPoolExecutor(max_workers=10) as pool:
    images = dict(zip(sources, pool.map(fetch, sources)))

def text(c, value, x, y, size, color=INK, bold=False):
    c.setFillColor(color); c.setFont('Arial-Bold' if bold else 'Arial', size); c.drawString(x, y, str(value or ''))

def wrap(value, max_chars, lines):
    words, out, line = str(value or '').split(), [], ''
    for word in words:
        nxt = (line + ' ' + word).strip()
        if len(nxt) > max_chars and line:
            out.append(line); line = word
            if len(out) == lines: break
        else: line = nxt
    if len(out) < lines and line: out.append(line)
    return out[:lines]

def draw_image(c, im, x, y, w, h):
    if im is None:
        c.setFillColor(HexColor('#aac8dd')); c.rect(x, y, w, h, fill=1, stroke=0); return
    fitted = ImageOps.fit(im, (max(1, int(w)), max(1, int(h))), Image.Resampling.LANCZOS)
    c.drawImage(ImageReader(fitted), x, y, w, h, mask='auto')

def card(c, ex, x, y, w, h, idx, dense=False):
    c.saveState(); c.setFillColor(HexColor('#17364f')); c.rect(x, y, w, h, fill=1, stroke=0)
    pics = ex.get('images', [])[:4]
    if pics:
        pw = w / len(pics)
        for i, src in enumerate(pics): draw_image(c, images.get(src), x + i * pw, y, pw, h)
    gh = h * .4
    c.drawImage(GRADIENT, x, y, w, gh, mask='auto')
    pad, base = 16, y + 17
    text(c, f'{idx:02d}', x + pad, base + 72, 8, HexColor('#c8d0d5'), True)
    title_size = 15 if dense else (24 if w > 700 else 18)
    title_lines = wrap(ex.get('title', ''), max(18, int(w / (title_size * .54))), 2)
    ty = base + 50
    for line in title_lines:
        text(c, line, x + pad, ty, title_size, white, True); ty -= title_size + 2
    details = '  ·  '.join(v for v in [ex.get('dates', ''), ex.get('price', '')] if v)
    if details: text(c, details, x + pad, base, 9 if dense else 11, HexColor('#e5e9ec'))
    if ex.get('href'): c.linkURL(ex['href'], (x, y, x + w, y + h), relative=0)
    c.restoreState()

def grid(n, x, y, w, h, gap=14):
    if n <= 3: cols, rows = n, 1
    elif n == 4: cols, rows = 2, 2
    else: cols, rows = 3, 2
    cw, ch = (w - gap * (cols - 1)) / cols, (h - gap * (rows - 1)) / rows
    return [(x + (i % cols) * (cw + gap), y + (rows - 1 - i // cols) * (ch + gap), cw, ch) for i in range(n)]

c = canvas.Canvas(TMP_OUT, pagesize=(W, H), pageCompression=1)
for vi, v in enumerate(venues):
    c.setFillColor(BLUE); c.rect(0, 0, W, H, fill=1, stroke=0)
    text(c, 'BUCHAREST · 4–6 SEPTEMBER 2026', 48, 677, 10, MUTED, True)
    name_size = 36 if len(v.get('name', '')) < 35 else 28
    text(c, v.get('name', ''), 48, 628, name_size, INK, True)
    text(c, v.get('sub', ''), 48, 600, 13, MUTED)
    hx = 960
    text(c, 'OPENING HOURS', hx, 677, 8, MUTED, True)
    yy = 658
    if v.get('hoursNote'): text(c, v['hoursNote'], hx, yy, 10, MUTED); yy -= 15
    for line in v.get('hours', []): text(c, line, hx, yy, 11, INK, True); yy -= 15
    if v.get('admission'): text(c, v['admission'], hx, yy - 4, 9, INK)
    c.setStrokeColor(HexColor('#9ebfd6')); c.line(48, 578, 1232, 578)
    exs = v.get('exhibitions', [])
    for i, (ex, box) in enumerate(zip(exs, grid(len(exs), 48, 66, 1184, 490))): card(c, ex, *box, i + 1, len(exs) >= 5)
    text(c, f'{vi + 1:02d} / {len(venues):02d}', 48, 29, 9, MUTED, True)
    label = f"{len(exs)} exhibition" + ('' if len(exs) == 1 else 's')
    text(c, label.upper(), 1140, 29, 9, MUTED, True)
    c.showPage()
c.save()
os.replace(TMP_OUT, OUT)
signal.alarm(0)
print(f'{OUT} | slides={len(venues)} | images={sum(1 for x in images.values() if x is not None)}/{len(images)}')
