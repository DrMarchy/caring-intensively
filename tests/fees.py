import asyncio
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--no-sandbox'])
        ctx = await b.new_context(viewport={'width': 390, 'height': 844}, device_scale_factor=2, is_mobile=True, has_touch=True, locale='en-AU', timezone_id='Australia/Brisbane')
        pg = await ctx.new_page(); errs = []
        pg.on('pageerror', lambda e: errs.append(str(e))); pg.on('console', lambda m: errs.append(m.text) if m.type == 'error' else None)
        await pg.goto('http://localhost:8765/index.html#demo'); await pg.wait_for_timeout(1200)
        print('fee 13870', await pg.evaluate("itemFee('13870')"), '| 13876A', await pg.evaluate("itemFee('13876A')"), '| 23035', await pg.evaluate("itemFee('23035')"), '| 25025', await pg.evaluate("itemFee('25025')"))
        print('25025 day', await pg.evaluate("dayFee({items:['20410','25025'], times:{start:'10:00',finish:'10:40'}, asa:'3'})"), '(expect 94.80+71.10+23.70 = 189.60, x1.5 = 284.40)')
        print('12m est', await pg.evaluate("Math.round(billingStats(...rangeFor('12m')).est)"))
        await pg.evaluate("S.settings.itemFees['13873']=400; changed()")
        print('override 13873', await pg.evaluate("itemFee('13873')"), 'custom flag', await pg.evaluate("billingStats(...rangeFor('12m')).custom"))
        await pg.evaluate("delete S.settings.itemFees['13873']; changed()")
        await pg.click('#tabs [data-tab="billing"]'); await pg.click('.seg [data-v="stats"]'); await pg.wait_for_timeout(300)
        await pg.screenshot(path='tests/shots/90_stats_fees.png')
        await pg.click('.seg [data-v="active"]'); await pg.click('.row[data-act="patient"] >> nth=3'); await pg.wait_for_timeout(300)
        await pg.screenshot(path='tests/shots/91_patient_fee.png')
        await pg.click('.page [data-act="closePage"]'); await pg.click('.row [data-act="bill"] >> nth=0'); await pg.wait_for_timeout(300)
        await pg.click('.sheet [data-act="itemInfo"][data-code="13870"]'); await pg.wait_for_timeout(300)
        await pg.screenshot(path='tests/shots/92_info_fee.png')
        await pg.keyboard.press('Escape'); await pg.keyboard.press('Escape'); await pg.wait_for_timeout(200)
        await pg.click('[data-act="settings"]'); await pg.wait_for_timeout(200); await pg.click('.page [data-act="itemsPage"]'); await pg.wait_for_timeout(300)
        await pg.screenshot(path='tests/shots/93_items_fee.png')
        print('errors:', errs or 'none')
        await b.close()
asyncio.run(main())
