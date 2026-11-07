import asyncio, sys, os
from playwright.async_api import async_playwright
URL = 'http://localhost:8765/index.html#demo'
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--no-sandbox'])
        ctx = await b.new_context(viewport={'width': 390, 'height': 844}, device_scale_factor=2, is_mobile=True, has_touch=True, accept_downloads=True, locale='en-AU', timezone_id='Australia/Brisbane')
        pg = await ctx.new_page()
        errs = []
        pg.on('console', lambda m: errs.append(m.type + ': ' + m.text) if m.type in ('error', 'warning') else None)
        pg.on('pageerror', lambda e: errs.append('PAGEERROR: ' + str(e)))
        await pg.goto(URL); await pg.wait_for_timeout(1200)
        shot = lambda n: pg.screenshot(path=f'tests/shots/{n}.png')
        # Bill sheet for first unbilled patient
        await pg.click('#tabs [data-tab="billing"]'); await pg.wait_for_timeout(300)
        await pg.click('.row [data-act="bill"] >> nth=0'); await pg.wait_for_timeout(400)
        await shot('10_bill_sheet')
        sug = await pg.query_selector('[data-act="useSugg"]')
        if sug: await sug.click(); await pg.wait_for_timeout(300)
        await shot('11_bill_sugg')
        await pg.click('.sheet [data-act="itemInfo"][data-code="13876A"]'); await pg.wait_for_timeout(300)
        await shot('12_item_info')
        await pg.click('.sheet:last-of-type [data-act="closeSheet"].xbtn'); await pg.wait_for_timeout(200)
        # add an anaesthesia item to test times panel
        await pg.fill('.sheet input[data-in="billQ"]', 'TOE'); await pg.wait_for_timeout(200)
        await pg.click('.sheet [data-act="tog"][data-code="21936"]'); await pg.wait_for_timeout(300)
        await shot('13_bill_anaes')
        await pg.click('.sheet [data-act="billNow"][data-k="start"]'); await pg.wait_for_timeout(100)
        await pg.fill('#bt-f', '23:59'); await pg.dispatch_event('#bt-f', 'change'); await pg.wait_for_timeout(200)
        await pg.click('.sheet [data-act="billSave"]'); await pg.wait_for_timeout(400)
        await shot('14_after_save')
        # Patient page
        await pg.click('.row[data-act="patient"] >> nth=0'); await pg.wait_for_timeout(500)
        await shot('15_patient')
        await pg.click('.page [data-act="closePage"]'); await pg.wait_for_timeout(200)
        # History search
        await pg.click('.seg [data-v="history"]'); await pg.wait_for_timeout(300)
        await pg.fill('input[data-in="histQ"]', '13881'); await pg.wait_for_timeout(300)
        await shot('16_history')
        await pg.click('.seg [data-v="patient"]'); await pg.wait_for_timeout(300)
        await shot('17_history_patient')
        await pg.click('.seg [data-v="stats"]'); await pg.wait_for_timeout(300)
        await pg.screenshot(path='tests/shots/18_stats.png', full_page=True)
        # ECMO
        await pg.click('#tabs [data-tab="ecmo"]'); await pg.wait_for_timeout(300)
        await shot('20_ecmo')
        await pg.click('.tile[data-type="cannulation"]'); await pg.wait_for_timeout(300)
        await shot('21_ecmo_cann')
        await pg.click('.sheet [data-act="ecmoSave"]'); await pg.wait_for_timeout(300)
        await pg.click('.tile[data-type="qa"]'); await pg.wait_for_timeout(300)
        await shot('22_ecmo_qa')
        await pg.click('.sheet [data-act="ecmoSave"]'); await pg.wait_for_timeout(300)
        # CPD
        await pg.click('#tabs [data-tab="cpd"]'); await pg.wait_for_timeout(300)
        await pg.screenshot(path='tests/shots/30_cpd.png', full_page=True)
        await pg.click('button[data-act="cpdNew"]'); await pg.wait_for_timeout(300)
        await shot('31_cpd_sheet')
        await pg.click('.sheet [data-act="cpType"] >> nth=0'); await pg.wait_for_timeout(200)
        await pg.click('.sheet [data-act="cpCape"][data-v="cultural"]'); await pg.wait_for_timeout(200)
        await pg.click('.sheet [data-act="cpdSave"]'); await pg.wait_for_timeout(300)
        # Reports
        await pg.click('#tabs [data-tab="reports"]'); await pg.wait_for_timeout(300)
        await pg.screenshot(path='tests/shots/40_reports.png', full_page=True)
        for kind, sel in [('unsent', '[data-act="repUnsent"]'), ('ecmo', '.card [data-act="openReport"][data-kind="ecmo"]'), ('cpd', '.card [data-act="openReport"][data-kind="cpd"]')]:
            await pg.click(sel); await pg.wait_for_timeout(2500)
            await shot('41_preview_' + kind)
            # Save PDF via download fallback
            try:
                async with pg.expect_download(timeout=8000) as dl:
                    await pg.click('.page [data-act="pvEmail"]')
                d = await dl.value
                path = f'tests/shots/{kind}.pdf'; await d.save_as(path); print(kind, 'pdf', os.path.getsize(path))
            except Exception as e: print(kind, 'download failed', e)
            n = await pg.evaluate('document.querySelectorAll(".pv-pages canvas").length'); print(kind, 'pages', n)
            await pg.click('.page [data-act="closePage"]'); await pg.wait_for_timeout(300)
        # Settings
        await pg.click('#tabs [data-tab="home"]'); await pg.wait_for_timeout(300)
        await pg.click('[data-act="settings"]'); await pg.wait_for_timeout(300)
        await shot('50_settings')
        print('\n'.join(errs) or 'no console errors')
        await b.close()
asyncio.run(main())
