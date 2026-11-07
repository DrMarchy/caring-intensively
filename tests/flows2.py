import asyncio, os
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--no-sandbox'])
        errs = []
        def watch(pg, tag):
            pg.on('console', lambda m: errs.append(tag + ' ' + m.type + ': ' + m.text) if m.type in ('error', 'warning') else None)
            pg.on('pageerror', lambda e: errs.append(tag + ' PAGEERROR: ' + str(e)))
        # a) fresh start, real flow
        ctx = await b.new_context(viewport={'width': 390, 'height': 844}, device_scale_factor=2, is_mobile=True, has_touch=True, accept_downloads=True, locale='en-AU', timezone_id='Australia/Brisbane')
        pg = await ctx.new_page(); watch(pg, 'fresh')
        await pg.goto('http://localhost:8765/index.html'); await pg.wait_for_timeout(800)
        await pg.screenshot(path='tests/shots/60_welcome.png')
        await pg.click('[data-act="startEmpty"]'); await pg.wait_for_timeout(300)
        await pg.screenshot(path='tests/shots/61_empty_home.png')
        async with pg.expect_file_chooser() as fc:
            await pg.click('.qa[data-act="newPatient"]')
        await (await fc.value).set_files('reference/wesley-billing-form.jpg'); await pg.wait_for_timeout(800)
        await pg.fill('#pf-n', 'TEST, Example'); await pg.fill('#pf-u', '123456'); await pg.fill('#pf-b', 'ICU 3')
        await pg.click('.sheet [data-act="pfFund"][data-v="Medibank"]'); await pg.wait_for_timeout(200)
        await pg.screenshot(path='tests/shots/62_new_patient.png')
        await pg.click('.sheet [data-act="pfSave"][data-v="bill"]'); await pg.wait_for_timeout(500)
        for c in ['13870', '13881', '13876A']:
            await pg.click(f'.sheet .fq[data-code="{c}"]'); await pg.wait_for_timeout(150)
        await pg.screenshot(path='tests/shots/63_bill_new.png')
        await pg.click('.sheet [data-act="billSave"]'); await pg.wait_for_timeout(400)
        # next day continuation suggestion
        await pg.click('#tabs [data-tab="billing"]'); await pg.wait_for_timeout(300)
        await pg.click('.row[data-act="patient"]'); await pg.wait_for_timeout(300)
        await pg.click('.page [data-act="billOther"]'); await pg.wait_for_timeout(300)
        await pg.click('.sheet [data-act="billDay"][data-v="1"]'); await pg.wait_for_timeout(300)
        await pg.screenshot(path='tests/shots/64_next_day.png')
        await pg.click('.sheet [data-act="useSugg"]'); await pg.wait_for_timeout(200)
        await pg.click('.sheet [data-act="billSave"]'); await pg.wait_for_timeout(300)
        await pg.screenshot(path='tests/shots/65_patient_days.png')
        # discharge
        await pg.click('.page [data-act="discharge"]'); await pg.wait_for_timeout(300)
        await pg.click('.sheet [data-act="confirmOk"]'); await pg.wait_for_timeout(300)
        act = await pg.evaluate('activePatients().length'); print('active after discharge', act)
        # backup / wipe / restore
        await pg.click('#tabs [data-tab="reports"]'); await pg.wait_for_timeout(200)
        async with pg.expect_download() as dl:
            await pg.click('.card [data-act="backup"]')
        d = await dl.value; await d.save_as('/tmp/gills_backup.json'); print('backup bytes', os.path.getsize('/tmp/gills_backup.json'))
        await pg.evaluate('clearAll().then(()=>{changed()})'); await pg.wait_for_timeout(300)
        print('patients after wipe', await pg.evaluate('S.patients.length'))
        await pg.click('[data-act="settings"]'); await pg.wait_for_timeout(300)
        async with pg.expect_file_chooser() as fc:
            await pg.click('.page [data-act="restore"]')
        await (await fc.value).set_files('/tmp/gills_backup.json'); await pg.wait_for_timeout(500)
        await pg.click('.sheet [data-act="confirmOk"]'); await pg.wait_for_timeout(800)
        print('patients after restore', await pg.evaluate('S.patients.length'), 'days', await pg.evaluate('S.days.length'))
        # reload persists?
        await pg.reload(); await pg.wait_for_timeout(800)
        print('after reload patients', await pg.evaluate('S.patients.length'))
        await ctx.close()
        # b) dark mode
        ctx = await b.new_context(viewport={'width': 390, 'height': 844}, device_scale_factor=2, color_scheme='dark', locale='en-AU', timezone_id='Australia/Brisbane')
        pg = await ctx.new_page(); watch(pg, 'dark')
        await pg.goto('http://localhost:8765/index.html#demo'); await pg.wait_for_timeout(1200)
        await pg.screenshot(path='tests/shots/70_dark_home.png')
        await pg.click('#tabs [data-tab="billing"]'); await pg.wait_for_timeout(300)
        await pg.click('.row [data-act="bill"] >> nth=0'); await pg.wait_for_timeout(300)
        await pg.screenshot(path='tests/shots/71_dark_bill.png')
        await ctx.close()
        # c) sandboxed preview (like claude.ai)
        ctx = await b.new_context(viewport={'width': 390, 'height': 844}, device_scale_factor=2, locale='en-AU', timezone_id='Australia/Brisbane')
        pg = await ctx.new_page(); watch(pg, 'sandbox')
        await pg.goto('http://localhost:8766/tests/sandbox.html'); await pg.wait_for_timeout(2000)
        await pg.screenshot(path='tests/shots/80_sandbox.png')
        fr = pg.frames[1]
        print('sandbox store ok:', await fr.evaluate('Store.ok'), 'patients', await fr.evaluate('S.patients.length'))
        await ctx.close()
        print('\n'.join(errs) or 'no console errors')
        await b.close()
asyncio.run(main())
