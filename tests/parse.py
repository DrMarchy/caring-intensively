import asyncio, json
from playwright.async_api import async_playwright
CASES = [
 ["UnitingCare THE WESLEY HOSPITAL", "SMITH, JOHN ALBERT M 76Y", "MRN: 00123456 DOB: 04/05/1950", "BUPA 1234567"],
 ["Name: NGUYEN Thi Mai", "URN 7654321", "D.O.B 01/02/1961 Sex F", "HCF Member 99887766"],
 ["O'BRIEN, Patrick", "UR No. 556677", "DVA Gold Card QX123456", "Dr S McKenzie"],
 ["MR JOHN CITIZEN", "Hospital No: W0123456", "Medibank Private", "Adm: 05/11/2026 Ward 4B Bed 12"],
 ["Surname: WILLIAMS", "Given names: Robert James", "Patient ID 3344556", "nib health funds"],
 ["CHEN, Mei-Ling F 45y", "123456789", "Teachers Health"],
]
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--no-sandbox'])
        pg = await (await b.new_context()).new_page()
        await pg.goto('http://localhost:8765/index.html#demo'); await pg.wait_for_timeout(800)
        for c in CASES:
            print(json.dumps(await pg.evaluate("(l) => parseLabel(l)", c)))
        await b.close()
asyncio.run(main())
