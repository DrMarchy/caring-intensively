import asyncio, base64, time
from playwright.async_api import async_playwright
JS_MAKE = """async ([deg, blur, q]) => {
  const p = {name:'HARRIS, Margaret', ur:'4458821', fund:'Medibank', memb:'4401 22310', admitted:'2026-11-03', ward:'ICU', bed:'4', refDoc:'Dr R Patel', sex:'F', dob:'12/03/1948', id:'x1'};
  const src = demoLabelImage(p);
  const im = await new Promise(r => { const i = new Image(); i.onload = () => r(i); i.src = src; });
  const c = document.createElement('canvas'); c.width = 1400; c.height = 1000; const x = c.getContext('2d');
  x.fillStyle = '#8a8f8c'; x.fillRect(0,0,1400,1000);
  x.translate(700,500); x.rotate(deg*Math.PI/180); x.filter = 'blur(' + blur + 'px)';
  x.drawImage(im, -im.width*0.65, -im.height*0.65, im.width*1.3, im.height*1.3);
  const g = x.createLinearGradient(-700,0,700,0); g.addColorStop(0,'rgba(0,0,0,0.15)'); g.addColorStop(1,'rgba(255,255,255,0.1)'); x.filter='none'; x.fillStyle=g; x.fillRect(-700,-500,1400,1000);
  return c.toDataURL('image/jpeg', q);
}"""
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--no-sandbox'])
        ctx = await b.new_context(viewport={'width': 390, 'height': 844}, device_scale_factor=2, locale='en-AU', timezone_id='Australia/Brisbane')
        pg = await ctx.new_page(); errs=[]
        pg.on('pageerror', lambda e: errs.append(str(e))); pg.on('console', lambda m: errs.append(m.text) if m.type in ('error','warning') else None)
        await pg.goto('http://localhost:8765/index.html#demo'); await pg.wait_for_timeout(1000)
        for deg, blur, q in [(0, 0, 0.9), (-3, 0.8, 0.7), (4, 1.4, 0.55)]:
            url = await pg.evaluate(JS_MAKE, [deg, blur, q])
            open(f'/tmp/label_{deg}_{blur}.jpg','wb').write(base64.b64decode(url.split(',')[1]))
            t0 = time.time()
            res = await pg.evaluate("async (u) => { const b = await (await fetch(u)).blob(); const r = await readLabel(b); return r; }", url)
            print(f'deg={deg} blur={blur} q={q}  {time.time()-t0:.1f}s  conf={res["confidence"]:.0f}')
            print('   fields:', res['fields'])
            print('   lines:', res['lines'][:7])
        print('errors:', errs or 'none')
        await b.close()
asyncio.run(main())
