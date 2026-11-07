import asyncio, os
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--no-sandbox'])
        ctx = await b.new_context(viewport={'width': 390, 'height': 844}, device_scale_factor=2, is_mobile=True, has_touch=True, accept_downloads=True, locale='en-AU', timezone_id='Australia/Brisbane')
        pg = await ctx.new_page(); errs = []
        pg.on('pageerror', lambda e: errs.append('PAGEERROR ' + str(e))); pg.on('console', lambda m: errs.append(m.type + ' ' + m.text) if m.type in ('error','warning') else None)
        await pg.goto('http://localhost:8765/index.html'); await pg.wait_for_timeout(800)
        await pg.click('[data-act="startEmpty"]'); await pg.wait_for_timeout(300)
        # settings: add a second hospital
        await pg.click('[data-act="settings"]'); await pg.wait_for_timeout(300)
        await pg.fill('#newHospName', 'St Andrew’s War Memorial Hospital'); await pg.fill('#newHospProv', '242652CK')
        await pg.click('.page [data-act="hospAdd"]'); await pg.wait_for_timeout(300)
        el = await pg.query_selector('#set-hosp'); await el.scroll_into_view_if_needed(); await pg.wait_for_timeout(200)
        await pg.screenshot(path='tests/shots/a1_settings_hosp.png')
        print('hospitals', await pg.evaluate('S.settings.hospitals.map(h=>h.name+" "+h.provider)'))
        await pg.click('.page [data-act="closePage"]'); await pg.wait_for_timeout(200)
        # new patient from a blurry label photo
        async with pg.expect_file_chooser() as fc:
            await pg.click('.qa[data-act="newPatient"]')
        await (await fc.value).set_files('/tmp/label_4_1.4.jpg')
        await pg.wait_for_selector('.ocrbox.ok, .ocrbox.warn', timeout=20000); await pg.wait_for_timeout(300)
        await pg.screenshot(path='tests/shots/a2_ocr_filled.png')
        vals = await pg.evaluate("({n: document.querySelector('#pf-n').value, u: document.querySelector('#pf-u').value, f: curSheet().st.fund, r: document.querySelector('#pf-r').value, w: curSheet().st.ward, h: curSheet().st.hospital})")
        print('form after OCR', vals)
        await pg.fill('#pf-b', '4')
        await pg.evaluate("document.querySelector('.sheet .sb').scrollTop = 500"); await pg.wait_for_timeout(200)
        await pg.screenshot(path='tests/shots/a3_form_loc.png')
        await pg.click('.sheet [data-act="pfSave"][data-v="bill"]'); await pg.wait_for_timeout(400)
        await pg.screenshot(path='tests/shots/e1_confirm.png')
        await pg.click('.sheet [data-act="ocrConfirmSave"]'); await pg.wait_for_timeout(500)
        for c in ['13870', '13881', '13876A']:
            await pg.click(f'.sheet .fq[data-code="{c}"]'); await pg.wait_for_timeout(120)
        await pg.click('.sheet [data-act="billSave"]'); await pg.wait_for_timeout(300)
        # next day: moved to HDU bed 2
        pid = await pg.evaluate('S.patients[0].id')
        await pg.evaluate(f"openBill('{pid}', addDays(today(), 1))"); await pg.wait_for_timeout(300)
        await pg.click('.sheet [data-act="useSugg"]'); await pg.click('.sheet [data-act="billLocEdit"]'); await pg.wait_for_timeout(200)
        await pg.fill('.sheet input[data-in="billLoc"][data-k="ward"]', 'HDU'); await pg.fill('.sheet input[data-in="billLoc"][data-k="bed"]', '2')
        await pg.screenshot(path='tests/shots/a4_bill_move.png')
        await pg.click('.sheet [data-act="billLocDone"]'); await pg.wait_for_timeout(200)
        await pg.click('.sheet [data-act="billSave"]'); await pg.wait_for_timeout(300)
        # day 3: moved to St Andrew's ward 3 bed 7
        await pg.evaluate(f"openBill('{pid}', addDays(today(), 2))"); await pg.wait_for_timeout(300)
        await pg.click('.sheet [data-act="tog"][data-code="105"] >> nth=0') if await pg.query_selector('.sheet [data-act="tog"][data-code="105"]') else None
        await pg.click('.sheet [data-act="billLocEdit"]'); await pg.wait_for_timeout(200)
        await pg.click('.sheet [data-act="billLocSet"][data-k="hospital"] >> nth=1'); await pg.wait_for_timeout(200)
        await pg.fill('.sheet input[data-in="billLoc"][data-k="ward"]', '3 West'); await pg.fill('.sheet input[data-in="billLoc"][data-k="bed"]', '7')
        await pg.click('.sheet [data-act="billLocDone"]'); await pg.click('.sheet [data-act="billSave"]'); await pg.wait_for_timeout(300)
        print('days', await pg.evaluate("S.days.map(d=>d.date+' '+hospitalById(d.loc.hospital).name+' '+d.loc.ward+' '+d.loc.bed+' '+d.items.join(','))"))
        print('patient now', await pg.evaluate("locText(patientLoc(S.patients[0]), true)"))
        await pg.click('#tabs [data-tab="billing"]'); await pg.click('.row[data-act="patient"]'); await pg.wait_for_timeout(300)
        await pg.screenshot(path='tests/shots/a5_patient_days.png')
        # report
        await pg.click('.page [data-act="patientReport"]'); await pg.wait_for_timeout(300); await pg.click('.sheet [data-act="repPatientGo"] >> nth=0'); await pg.wait_for_timeout(2500)
        n = await pg.evaluate('document.querySelectorAll(".pv-pages canvas").length'); print('report pages', n)
        async with pg.expect_download() as dl:
            await pg.click('.page [data-act="pvEmail"]')
        d = await dl.value; await d.save_as('tests/shots/moved.pdf')
        print('\n'.join(errs) or 'no console errors')
        await b.close()
asyncio.run(main())
