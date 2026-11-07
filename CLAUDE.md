# CLAUDE.md: guidance for working on Caring Intensively / Gill-Able

## What this is
Gill-Able is a phone-first PWA for Dr Denzil Gill, an intensivist at The Wesley Hospital, Brisbane, who also does ECMO work. It covers private ICU billing, an ECMO accreditation logbook and CICM CPD tracking. Tyron (the repo owner, an ICU registrar) built it for him. See README.md for the feature summary.

## Hard constraints
- **No backend, no network calls, no analytics.** Patient data (names, URs, label photos) is health information and must never leave the device. Everything lives in IndexedDB (`gills` database, stores `kv` and `photos`). Don't add fetches to third-party hosts. The CSP-friendly approach is to vendor assets into `src/`.
- **Free to run.** Hosting is GitHub Pages from `docs/`. Don't introduce paid services.
- **Keep storage identifiers stable.** The IndexedDB name `gills`, the backup JSON field `app: 'gills'` and the state shape (`S.settings`, `S.patients`, `S.days`, `S.ecmo`, `S.cpd`) must stay backward compatible. Add migrations in `migrate()` in `core.js` rather than breaking old data.
- **The billing sheet must resemble the Wesley paper form** (`reference/wesley-billing-form.jpg`): the same rows, order and seven dated day columns. Layout is in `drawBillingSheet()` in `src/pdf.js`.

## Architecture
- Plain JavaScript, no framework and no bundler. `build.py` concatenates `catalog.js, core.js, demo.js, pdf.js, ocr.js, app.js` into one inline script in `docs/index.html`, merges `src/mbs_criteria.json` into `MBS_CRITERIA`, runs `node --check`, and copies `src/ocr/` plus the PWA files and icons.
- UI: `render()` redraws the current tab, and `openPage()` / `openSheet()` handle full-screen pages and bottom sheets. Events are delegated through `data-act` (click to `ACT`), `data-in` (input to `IN`) and `data-ch` (change to `CH`) in `app.js`. Sheets keep their state on `sheet.st` and redraw with `sheet.update()`.
- Data model:
  - patient `{id, name, ur, fund, hospital, ward, bed, refDoc, dx, admitted, status, photoId}`
  - day of care `{id, pid, date, items[], times{start,finish}, asa, note, loc{hospital,ward,bed}, sent}`
  - Each day keeps its own location, so moves between wards or hospitals are preserved. Billing sheets split by hospital because provider numbers are location-specific.
- Fees: `itemFee()` returns the user's own rate if set, otherwise the MBS schedule fee. 25025 adds 50% of the day's anaesthesia fee (`dayFee()`).
- Reports: canvas pages at A4 150 dpi, wrapped as a PDF of JPEG pages by `pagesToPDF()`. Shared through the Web Share API (on iOS, Mail opens with the attachment), with a download fallback.
- Label reading: `src/ocr.js` lazily loads Tesseract.js from `src/ocr/` and passes the English model in directly from `eng-data.js` (base64, because the claude.ai preview host won't serve `.gz`/`.bin`). `src/ocr/worker.min.js` carries a one-word bug fix (see `PATCHES.txt`). `parseLabel()` turns label text into name, UR, fund and referring doctor. Auto-filled fields must be confirmed by Denzil before saving (`openOcrConfirm()`).

## Domain sources
- MBS item criteria and fees: MBS Online, schedule from 1 July 2026 (`src/mbs_criteria.json`, including notes where the paper form's wording differs from the MBS descriptor). 13876A/C/P/R are the practice's shorthand for item 13876, once per pressure type per day.
- CICM CPD Program 2026: 50 h total, at least 12.5 educational, at least 25 across reviewing performance and measuring outcomes (at least 5 each), PDP mandatory (up to 3 h), CAPE program-level requirements, airway SHLR once per triennium (2025–2027).
- ECMO targets are editable placeholders (no national standard). Denzil sets his unit's numbers in Settings.

## Workflow
1. Edit `src/`, then run `python3 build.py`.
2. Serve `docs/` on port 8765 and run the Playwright tests in `tests/` (see README).
3. For anything users will see, bump `CACHE` in `src/sw.js` before release.
4. Commit both `src/` and the rebuilt `docs/`. Pages deploys `docs/` from `main`.

Copy style: plain, sentence case, Australian spelling, no exclamation marks.
