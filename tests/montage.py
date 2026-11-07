import sys
from PIL import Image
files = sys.argv[2:]; out = sys.argv[1]
ims = [Image.open(f) for f in files]
w = 390; ims = [im.resize((w, int(im.height * w / im.width))) for im in ims]
h = max(im.height for im in ims)
M = Image.new('RGB', (w * len(ims) + 10 * (len(ims) - 1), h), 'white')
x = 0
for im in ims: M.paste(im, (x, 0)); x += w + 10
M.save(out)
