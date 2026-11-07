import asyncio, sys
from playwright.async_api import async_playwright
URL = 'http://localhost:8765/index.html#demo'
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--no-sandbox'])
        ctx = await b.new_context(viewport={'width': 390, 'height': 844}, device_scale_factor=2, is_mobile=True, has_touch=True)
        pg = await ctx.new_page()
        errs = []
        pg.on('console', lambda m: errs.append(m.type + ': ' + m.text) if m.type in ('error', 'warning') else None)
        pg.on('pageerror', lambda e: errs.append('PAGEERROR: ' + str(e)))
        await pg.goto(URL); await pg.wait_for_timeout(1500)
        await pg.screenshot(path='tests/shots/01_home.png', full_page=True)
        for t in ['billing', 'ecmo', 'cpd', 'reports']:
            await pg.click(f'#tabs [data-tab="{t}"]'); await pg.wait_for_timeout(500)
            await pg.screenshot(path=f'tests/shots/02_{t}.png', full_page=True)
        print('\n'.join(errs) or 'no console errors')
        await b.close()
asyncio.run(main())
