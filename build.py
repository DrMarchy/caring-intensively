import json, re, os, subprocess, sys
from PIL import Image, ImageDraw
SRC = 'src'; DIST = 'docs'
os.makedirs(DIST, exist_ok=True)
rd = lambda f: open(os.path.join(SRC, f), encoding='utf-8').read()

# MBS criteria keyed by item
crit = {}
for o in json.load(open(os.path.join(SRC, 'mbs_criteria.json'))):
    crit[o['item']] = {k: o.get(k) for k in ('title', 'criteria', 'rules', 'fee', 'verified', 'source')}
cat = rd('catalog.js').replace('/*MBS_CRITERIA*/{}/*END*/', json.dumps(crit, ensure_ascii=False))
js = '\n'.join([cat, rd('core.js'), rd('demo.js'), rd('pdf.js'), rd('ocr.js'), rd('app.js')])
open('/tmp/gills_check.js', 'w').write(js)
r = subprocess.run(['node', '--check', '/tmp/gills_check.js'], capture_output=True, text=True)
if r.returncode: print(r.stderr); sys.exit(1)
css = rd('styles.css')
tpl = rd('index.template.html').replace('/*CSS*/', css).replace('/*JS*/', js.replace('</script', '<\\/script'))
pwa = '<link rel="manifest" href="manifest.webmanifest">\n<link rel="apple-touch-icon" href="icon-180.png">'
open(os.path.join(DIST, 'index.html'), 'w', encoding='utf-8').write(tpl.replace('<!--PWA-->', pwa))
os.makedirs('artifact', exist_ok=True)
open('artifact/index.html', 'w', encoding='utf-8').write(tpl.replace('<!--PWA-->', ''))
import shutil
for dst in (DIST, 'artifact'):
    if os.path.exists(os.path.join(dst, 'ocr')): shutil.rmtree(os.path.join(dst, 'ocr'))
    shutil.copytree(os.path.join(SRC, 'ocr'), os.path.join(dst, 'ocr'))
for f in ('sw.js', 'manifest.webmanifest'):
    open(os.path.join(DIST, f), 'w').write(rd(f))

# Icons: ink square with three gill arcs in the module colours
def bez(p0, p1, p2, p3, n=60):
    out = []
    for i in range(n + 1):
        t = i / n; u = 1 - t
        out.append((u**3*p0[0] + 3*u*u*t*p1[0] + 3*u*t*t*p2[0] + t**3*p3[0], u**3*p0[1] + 3*u*u*t*p1[1] + 3*u*t*t*p2[1] + t**3*p3[1]))
    return out
def icon(size, maskable=False, rounded=False):
    S4 = size * 4
    im = Image.new('RGBA', (S4, S4), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    if rounded: d.rounded_rectangle([0, 0, S4 - 1, S4 - 1], radius=int(S4 * 13 / 48), fill='#10232b')
    else: d.rectangle([0, 0, S4, S4], fill='#10232b')
    k = S4 / 48 * (0.78 if maskable else 1.0); off = (S4 - 48 * k) / 2
    w = 4.2 * k
    for x0, col in ((14.5, '#45d8bc'), (23, '#ff5d63'), (31.5, '#ffbb4d')):
        pts = bez((x0, 13), (x0 + 4.5, 19), (x0 + 4.5, 29), (x0, 35))
        pts = [(off + x * k, off + y * k) for x, y in pts]
        d.line(pts, fill=col, width=int(w), joint='curve')
        for px, py in (pts[0], pts[-1]): d.ellipse([px - w / 2, py - w / 2, px + w / 2, py + w / 2], fill=col)
    return im.resize((size, size), Image.LANCZOS)
icon(180).convert('RGB').save(os.path.join(DIST, 'icon-180.png'))
icon(192).save(os.path.join(DIST, 'icon-192.png'))
icon(512).save(os.path.join(DIST, 'icon-512.png'))
icon(512, maskable=True).save(os.path.join(DIST, 'icon-512-maskable.png'))
open(os.path.join(DIST, '.nojekyll'), 'w').close()  # serve docs/ as-is on GitHub Pages
print('built', os.path.getsize(os.path.join(DIST, 'index.html')) // 1024, 'KB')
