/* ===== Gill-Able: read patient labels on the phone (Tesseract, runs locally, no upload) ===== */

const OCR = { worker: null, loading: null, progress: 0, onProgress: null };
const ocrBase = () => new URL('ocr/', location.href).href.replace(/\/$/, '');
function loadScriptOnce(src) {
  return new Promise((res, rej) => {
    if ([...document.scripts].some((s) => s.src === src)) return res();
    const s = document.createElement('script'); s.src = src; s.async = true;
    s.onload = () => res(); s.onerror = () => rej(new Error('The label reader couldn’t load. Check the connection and try again.'));
    document.head.appendChild(s);
  });
}
function ocrWorker() {
  if (OCR.worker) return Promise.resolve(OCR.worker);
  if (!OCR.loading) {
    OCR.loading = (async () => {
      const base = ocrBase();
      if (!window.Tesseract) await loadScriptOnce(base + '/tesseract.min.js');
      if (!window.GILLS_ENG_B64) await loadScriptOnce(base + '/eng-data.js');
      const bin = atob(window.GILLS_ENG_B64); const data = new Uint8Array(bin.length);
      for (let i = 0; i < bin.length; i++) data[i] = bin.charCodeAt(i);
      const w = await window.Tesseract.createWorker([{ code: 'eng', data }], 1, {
        workerPath: base + '/worker.min.js', corePath: base, gzip: true,
        logger: (m) => { if (m.status === 'recognizing text') { OCR.progress = m.progress; OCR.onProgress && OCR.onProgress(m.progress); } }
      });
      await w.setParameters({ preserve_interword_spaces: '1' });
      OCR.worker = w;
      return w;
    })().catch((e) => { OCR.loading = null; throw e; });
  }
  return OCR.loading;
}
const ocrWarmUp = () => { ocrWorker().catch(() => { }); };

/* Greyscale, stretch contrast and scale to a size Tesseract likes */
async function ocrPrepare(blob) {
  const url = URL.createObjectURL(blob);
  const img = await new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = url; });
  URL.revokeObjectURL(url);
  const k = clamp(1800 / Math.max(img.width, img.height), 0.5, 2.5);
  const c = document.createElement('canvas'); c.width = Math.round(img.width * k); c.height = Math.round(img.height * k);
  const x = c.getContext('2d', { willReadFrequently: true });
  x.drawImage(img, 0, 0, c.width, c.height);
  const d = x.getImageData(0, 0, c.width, c.height); const p = d.data;
  const hist = new Uint32Array(256);
  for (let i = 0; i < p.length; i += 4) { const g = (p[i] * 0.299 + p[i + 1] * 0.587 + p[i + 2] * 0.114) | 0; p[i] = g; hist[g]++; }
  const n = p.length / 4; let lo = 0, hi = 255, acc = 0;
  for (let v = 0; v < 256; v++) { acc += hist[v]; if (acc > n * 0.01) { lo = v; break; } }
  acc = 0; for (let v = 255; v >= 0; v--) { acc += hist[v]; if (acc > n * 0.01) { hi = v; break; } }
  const span = Math.max(40, hi - lo);
  for (let i = 0; i < p.length; i += 4) { const g = clamp(((p[i] - lo) * 255) / span, 0, 255); p[i] = p[i + 1] = p[i + 2] = g; }
  x.putImageData(d, 0, 0);
  return c;
}

async function readLabel(blob) {
  const w = await ocrWorker();
  const canvas = await ocrPrepare(blob);
  const { data } = await w.recognize(canvas);
  const lines = String(data.text || '').split('\n').map((l) => l.replace(/[|—_]+/g, ' ').replace(/\s+/g, ' ').trim()).filter((l) => l.length > 1);
  return { lines, fields: parseLabel(lines), confidence: data.confidence };
}

/* ---- Turning label text into fields ---- */
const FUND_ALIASES = {
  'Medibank': ['medibank', 'mpl'], 'Bupa': ['bupa'], 'HCF': ['hcf'], 'nib': ['nib'], 'HBF': ['hbf'], 'ahm': ['ahm'],
  'Australian Unity': ['australian unity', 'aust unity'], 'GMHBA': ['gmhba'], 'Teachers Health': ['teachers health', 'teachers'],
  'Defence Health': ['defence health'], 'CBHS': ['cbhs'], 'Health Partners': ['health partners'], 'Westfund': ['westfund'],
  'Peoplecare': ['peoplecare'], 'Police Health': ['police health'], 'Emergency Services Health': ['emergency services health'],
  'Queensland Country Health Fund': ['queensland country', 'qld country', 'qchf'], 'TUH Health Fund': ['tuh'],
  'Navy Health': ['navy health'], 'Latrobe Health': ['latrobe'], 'HIF': ['hif'], 'RT Health': ['rt health'],
  'Phoenix Health': ['phoenix health'], 'Frank Health': ['frank health'], 'DVA': ['dva', 'veterans', 'gold card', 'white card'],
  'WorkCover Qld': ['workcover'], 'Uninsured / self-funded': ['self funded', 'self-funded', 'uninsured', 'self insured'],
  'Third party (CTP)': ['ctp', 'third party'], 'Overseas visitor cover': ['overseas', 'ovhc', 'allianz']
};
const titleCase = (s) => s.toLowerCase().replace(/(^|[\s'\-])([a-z])/g, (m, a, b) => a + b.toUpperCase());
function parseLabel(lines) {
  const out = {};
  const text = lines.join('\n');
  const hospWords = new Set(S.settings.hospitals.flatMap((h) => h.name.toUpperCase().split(/\s+/)).concat(['HOSPITAL', 'SAMPLE', 'PRIVATE', 'THE', 'WARD', 'BED', 'ICU']));
  const isNoise = (l) => /\b(DOB|D\.O\.B|UR|URN|MRN|MEDICARE|MEMB|ADM|ADMITTED|SEX|AGE|PH|TEL|ADDR|DR)\b/i.test(l);

  // Name: "SURNAME, Firstname", "Name: ...", or "Surname: / Given names:"
  for (const l of lines) {
    const m = l.match(/^(?:Name\s*[:.]?\s*)?(?:Mr|Mrs|Ms|Miss|Dr)?\.?\s*([A-Z][A-Z'’\-]+(?:\s[A-Z][A-Z'’\-]+)?)\s*,\s*([A-Za-z][A-Za-z'’\-]+(?:\s[A-Za-z][A-Za-z'’\-]+){0,2})/);
    if (m && !hospWords.has(m[1].split(' ')[0])) { out.name = m[1] + ', ' + titleCase(m[2].replace(/\s+[MF]$/, '')); break; }
  }
  if (!out.name) {
    const m = text.match(/\bName\s*[:.]\s*([A-Za-z'’\- ,]{3,40})/i);
    if (m) { const v = m[1].trim(); const ws = v.split(/\s+/); out.name = !v.includes(',') && ws.length > 1 && ws[0] === ws[0].toUpperCase() ? ws[0] + ', ' + titleCase(ws.slice(1).join(' ')) : v; }
  }
  if (!out.name) {
    const sur = text.match(/\bSurname\s*[:.]\s*([A-Za-z'’\-]+)/i), giv = text.match(/\b(?:Given|First)\s*names?\s*[:.]\s*([A-Za-z'’\- ]+)/i);
    if (sur) out.name = sur[1].toUpperCase() + (giv ? ', ' + titleCase(giv[1].trim()) : '');
  }
  if (!out.name) {
    const cand = lines.find((l) => !/\b(DOB|UR|URN|MRN|MEDICARE|MEMB|ADM)\b/i.test(l) && /^[A-Z][A-Za-z'’\-]+(\s+[A-Z][A-Za-z'’\-]+){1,3}$/.test(l) && !l.split(/\s+/).every((w) => hospWords.has(w.toUpperCase())));
    if (cand) {
      let ws = cand.split(/\s+/);
      const titled = /^(MR|MRS|MS|MISS|MSTR|MASTER|DR)\.?$/i.test(ws[0]);
      if (titled) ws = ws.slice(1);
      if (ws.length > 1) out.name = titled ? ws[ws.length - 1].toUpperCase() + ', ' + titleCase(ws.slice(0, -1).join(' ')) : ws[0] + ', ' + titleCase(ws.slice(1).join(' '));
    }
  }
  if (out.name) out.name = out.name.replace(/\s+/g, ' ').replace(/[,\s]+$/, '');

  // UR / MRN: labelled first, then a standalone 6 to 9 digit number that isn't a date or phone/Medicare number
  const lab = text.match(/\b(?:MRN|URN|U\.?R\.?(?:\s*No\.?)?|UR|Hosp(?:ital)?\s*No\.?|Patient\s*(?:No|ID)\.?|MR\s*No\.?|Record\s*No\.?)\s*[:#.\-]?\s*([A-Z]{0,2}\s?\d[\d\s]{3,11}\d)/i);
  if (lab) out.ur = lab[1].replace(/\s+/g, '');
  if (!out.ur) {
    for (const l of lines) {
      if (/medicare|memb|ph|tel|mob|dob/i.test(l)) continue;
      const m = l.replace(/\b\d{1,2}[\/.\-]\d{1,2}[\/.\-]\d{2,4}\b/g, ' ').match(/\b\d{6,9}\b/);
      if (m) { out.ur = m[0]; break; }
    }
  }
  // Health fund
  const low = ' ' + text.toLowerCase().replace(/[^a-z0-9\s\-]/g, ' ').replace(/\s+/g, ' ') + ' ';
  const funds = S.settings.funds;
  for (const f of funds) {
    const al = (FUND_ALIASES[f] || [f.toLowerCase()]).concat([f.toLowerCase()]);
    if (al.some((a) => low.includes(' ' + a + ' '))) { out.fund = f; break; }
  }
  // Referring / admitting doctor
  const dr = text.match(/\bDr\.?\s+([A-Z][A-Za-z'’\-]*\.?(?:\s+[A-Z][A-Za-z'’\-]+){0,2})/);
  if (dr) out.refDoc = 'Dr ' + dr[1].replace(/\s*\((?:Adm|Ref).*$/i, '').trim();
  // Ward / bed if printed
  const bed = text.match(/\bBed\s*[:#.]?\s*([A-Z]?\d{1,3}[A-Z]?)\b/i); if (bed) out.bed = bed[1];
  const ward = text.match(/\bWard\s*[:.]?\s*([A-Z0-9][A-Za-z0-9 ]{0,10}?)(?=\s+Bed\b|\s*$|\n)/i); if (ward) out.ward = ward[1].trim();
  if (!out.ward) { const w2 = text.match(/\b(ICU|HDU|CCU|ICCU|CICU)\b/); if (w2) out.ward = w2[1]; }
  return out;
}
