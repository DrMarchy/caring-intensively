import asyncio, os
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--no-sandbox'])
        ctx = await b.new_context(viewport={'width': 390, 'height': 844}, device_scale_factor=2, is_mobile=True, has_touch=True, accept_downloads=True, locale='en-AU', timezone_id='Australia/Brisbane')
        pg = await ctx.new_page(); errs = []
        pg.on('pageerror', lambda e: errs.append('PAGEERROR ' + str(e))); pg.on('console', lambda m: errs.append(m.type + ' ' + m.text) if m.type in ('error','warning') else None)
        await pg.goto('http://localhost:8765/index.html#demo'); await pg.wait_for_timeout(1000)
        await pg.click('#tabs [data-tab="reports"]'); await pg.wait_for_timeout(300)
        await pg.screenshot(path='tests/shots/b1_reports.png', full_page=True)
        async def preview_and_save(name):
            top = pg.locator('.page').last
            await top.locator('#pvSend .btn').first.wait_for(timeout=20000); await pg.wait_for_timeout(1500)
            n = await top.locator('.pv-pages canvas').count()
            title = await top.locator('h1').text_content()
            meta = await top.locator('h1 + p').text_content()
            async with pg.expect_download() as dl:
                await top.locator('[data-act="pvEmail"]').click()
            d = await dl.value; print(name, '|', title, '|', meta, '| pages', n, '| file', d.suggested_filename)
            await d.save_as('tests/shots/' + name + '.pdf')
            await pg.screenshot(path='tests/shots/b_' + name + '.png')
            await top.locator('[data-act="closePage"]').click(); await pg.wait_for_timeout(300)
        # one day (yesterday)
        await pg.click('[data-act="repSet"][data-k="billRange"][data-v="day"]'); await pg.wait_for_timeout(200)
        await pg.click('[data-act="repDayStep"][data-v="-1"]'); await pg.wait_for_timeout(200)
        await pg.click('[data-act="repBill"]'); await preview_and_save('day')
        # one patient: search, pick, whole stay
        await pg.fill('input[data-in="repPQ"]', 'patel'); await pg.wait_for_timeout(300)
        await pg.screenshot(path='tests/shots/b2_pick.png')
        await pg.click('#repPatients [data-act="repPick"] >> nth=0'); await pg.wait_for_timeout(300)
        await pg.click('[data-act="repPatient"]'); await preview_and_save('patient_stay')
        await pg.click('[data-act="repSet"][data-k="pMode"][data-v="day"]'); await pg.wait_for_timeout(200)
        el = await pg.query_selector('[data-act="repPatient"]'); await el.scroll_into_view_if_needed()
        await pg.screenshot(path='tests/shots/b3_patient_day.png')
        await pg.click('[data-act="repPatient"]'); await preview_and_save('patient_day')
        # patient page chooser
        await pg.click('#tabs [data-tab="billing"]'); await pg.click('.row[data-act="patient"] >> nth=0'); await pg.wait_for_timeout(300)
        await pg.click('.page [data-act="patientReport"]'); await pg.wait_for_timeout(300)
        await pg.screenshot(path='tests/shots/b4_chooser.png')
        await pg.click('.sheet [data-act="repPatientGo"] >> nth=1'); await preview_and_save('chooser_day')
        # bill sheet link
        await pg.click('.page [data-act="closePage"]'); await pg.wait_for_timeout(200)
        await pg.evaluate("(() => { const d = S.days.filter(x => x.date < today()).sort((a,b)=>a.date<b.date?1:-1)[0]; openBill(d.pid, d.date); })()"); await pg.wait_for_timeout(300)
        await pg.screenshot(path='tests/shots/b5_billsheet_link.png')
        await pg.click('.sheet [data-act="billReport"]'); await preview_and_save('billsheet_day')
        print('\n'.join(errs) or 'no console errors')
        await b.close()
asyncio.run(main())
