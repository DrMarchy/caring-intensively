# Caring Intensively

Home of **Gill-Able**, a phone app for Dr Denzil Gill (intensivist) that handles three jobs:

1. **Private ICU billing.** He photographs a patient label once, and the app reads the name, UR/MRN, health fund and referring doctor and asks him to confirm them. The patient stays on an active list, and he taps MBS items for each day of care. Each day records the hospital, ward and bed. Reports are laid out like his Wesley paper billing form, and he can email them to his secretary.
2. **ECMO logbook.** One-tap logging of cannulations, circuit changes, reviews, QA meetings, rounds, retrievals, consults and other ECMO events, with progress against accreditation targets and a report for credentialing.
3. **CICM CPD tracking.** It logs activities against the CICM CPD Program (50 h a year, the category minimums, program-level requirements, PDP and airway SHLR) and produces an annual report.

It's a static, installable web app (PWA) with no server, no accounts and no running costs. **All records and label photos stay on the phone that uses them**, in the browser's IndexedDB. Label reading runs on the phone too, using Tesseract.

**Live app:** https://drmarchy.github.io/caring-intensively/ (served by GitHub Pages from `docs/`)

## Project layout

| Path | What it is |
|---|---|
| `src/` | Source: `catalog.js` (MBS items, CPD and ECMO reference data), `core.js` (storage, state, calculations), `demo.js` (12 months of sample data), `pdf.js` (report pages and the PDF writer), `ocr.js` (label reading), `app.js` (interface), `styles.css`, `index.template.html`, `sw.js`, `manifest.webmanifest` |
| `src/mbs_criteria.json` | MBS item criteria, rules and schedule fees (MBS Online, schedule from 1 July 2026), merged in at build time |
| `src/ocr/` | Vendored Tesseract.js 7 and core 7 (LSTM builds) plus the English model as `eng-data.js`. See `src/ocr/PATCHES.txt` |
| `build.py` | Builds `docs/` (the live site) and `artifact/` (a single-file preview copy, git-ignored) |
| `docs/` | The built site that GitHub Pages serves. Don't edit it by hand; run `python3 build.py` |
| `tests/` | Playwright browser tests (phone viewport) |
| `reference/` | The Wesley paper billing form and the install guide sent to Denzil |

## Build and test

```bash
pip install pillow playwright      # build needs Pillow (icons); tests need Playwright and Chrome
python3 build.py                   # writes docs/ and artifact/
python3 -m http.server 8765 --directory docs &
python3 -m http.server 8766 &      # repo root, only needed for the sandbox test in flows2.py
mkdir -p tests/shots
python3 tests/ocr.py               # generates sample label photos in /tmp used by flows3.py
python3 tests/flows.py && python3 tests/flows2.py && python3 tests/flows3.py && python3 tests/reports2.py
```

The tests drive the app at `http://localhost:8765` with the `#demo` sample data and save screenshots and PDFs to `tests/shots/`.

## Releasing an update

1. Change files in `src/`, run `python3 build.py`, and run the tests.
2. Bump `CACHE` in `src/sw.js` (e.g. `gillable-v5`) so installed phones pick up the new version, then rebuild.
3. Commit and push to `main`. GitHub Pages republishes `docs/` within a minute or two, and Denzil's phone updates next time it opens online. His records are untouched.

## Installing on a phone

Open the live link in Safari, tap **⋯**, then **Share**, then **Add to Home Screen** (leave **Open as Web App** on), and always open it from the Home Screen icon. In Settings, tap **Test the label reader** once on Wi-Fi so label reading also works offline. More detail is in `reference/install-guide.txt`.
