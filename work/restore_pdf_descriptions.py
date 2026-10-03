import io, json, os, sys
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from pypdf import PdfReader, PdfWriter

PROJECT, PDF = sys.argv[1], sys.argv[2]
W, H = 1280, 720
pdfmetrics.registerFont(TTFont('Arial', '/System/Library/Fonts/Supplemental/Arial.ttf'))
with open(PROJECT, encoding='utf-8') as f: venues = json.load(f)['venues']

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

def grid(n, x=48, y=66, w=1184, h=490, gap=14):
    if n <= 3: cols, rows = n, 1
    elif n == 4: cols, rows = 2, 2
    else: cols, rows = 3, 2
    cw, ch = (w-gap*(cols-1))/cols, (h-gap*(rows-1))/rows
    return [(x+(i%cols)*(cw+gap), y+(rows-1-i//cols)*(ch+gap), cw, ch) for i in range(n)]

packet = io.BytesIO(); c = canvas.Canvas(packet, pagesize=(W, H), pageCompression=1)
for v in venues:
    exs, dense = v.get('exhibitions', []), len(v.get('exhibitions', [])) >= 5
    for ex, (x, y, w, h) in zip(exs, grid(len(exs))):
        desc = ex.get('description', '')
        if not desc: continue
        c.setFillColor(HexColor('#f3f5f7')); c.setFont('Arial', 7 if dense else 10)
        if dense:
            lines = wrap(desc, max(28, int((w-32)/3.7)), 2)
            start, lead = y + 39, 9
        else:
            lines = wrap(desc, max(42, int((w-32)/5.2)), 4)
            start, lead = y + h*.4 - 18, 12
        for i, line in enumerate(lines): c.drawString(x+16, start-i*lead, line)
    c.showPage()
c.save(); packet.seek(0)

base, overlay, writer = PdfReader(PDF), PdfReader(packet), PdfWriter()
for page, top in zip(base.pages, overlay.pages):
    page.merge_page(top); writer.add_page(page)
tmp = PDF + '.with-text.tmp.pdf'
with open(tmp, 'wb') as f: writer.write(f)
os.replace(tmp, PDF)
print(PDF)
