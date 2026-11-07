/* ===== Caring Intensively: report rendering (canvas pages) and a tiny PDF writer ===== */

const PAGE_W = 1240, PAGE_H = 1754; // A4 at 150 dpi
const PFONT = '-apple-system, "SF Pro Text", "Helvetica Neue", Helvetica, Arial, sans-serif';
const INK = '#111c22', SOFT = '#55656b', RULE = '#1d2b31', FAINT = '#e6ecea';

function loadImage(src) {
  return new Promise((res) => {
    if (!src) return res(null);
    const im = new Image();
    im.onload = () => res(im);
    im.onerror = () => res(null);
    im.src = src;
  });
}
function newCanvas() {
  const c = document.createElement('canvas');
  c.width = PAGE_W; c.height = PAGE_H;
  const x = c.getContext('2d');
  x.fillStyle = '#fff'; x.fillRect(0, 0, PAGE_W, PAGE_H);
  x.textBaseline = 'alphabetic';
  return c;
}
function setFont(x, size, weight = 400) { x.font = weight + ' ' + size + 'px ' + PFONT; }
function wrapText(x, str, maxW) {
  const out = [];
  String(str == null ? '' : str).split('\n').forEach((para) => {
    const words = para.split(/\s+/);
    let line = '';
    words.forEach((w) => {
      const t = line ? line + ' ' + w : w;
      if (x.measureText(t).width <= maxW || !line) {
        if (!line && x.measureText(w).width > maxW) { // hard-break a long word
          let chunk = '';
          for (const ch of w) { if (x.measureText(chunk + ch).width > maxW) { out.push(chunk); chunk = ch; } else chunk += ch; }
          line = chunk;
        } else line = t;
      } else { out.push(line); line = w; }
    });
    out.push(line);
  });
  return out;
}
function fitText(x, str, maxW) {
  str = String(str == null ? '' : str);
  if (x.measureText(str).width <= maxW) return str;
  while (str.length > 1 && x.measureText(str + '…').width > maxW) str = str.slice(0, -1);
  return str + '…';
}
function drawTick(x, cx, cy, s) {
  x.save(); x.strokeStyle = INK; x.lineWidth = 3.2; x.lineCap = 'round'; x.lineJoin = 'round';
  x.beginPath(); x.moveTo(cx - s * 0.45, cy); x.lineTo(cx - s * 0.1, cy + s * 0.35); x.lineTo(cx + s * 0.5, cy - s * 0.4); x.stroke(); x.restore();
}
function drawImageContain(x, im, bx, by, bw, bh) {
  const k = Math.min(bw / im.width, bh / im.height);
  const w = im.width * k, h = im.height * k;
  x.drawImage(im, bx + (bw - w) / 2, by + (bh - h) / 2, w, h);
}

/* ---------- Generic document builder (tables, headings, pagination) ---------- */
class Doc {
  constructor(title, subtitle) {
    this.title = title; this.subtitle = subtitle || '';
    this.M = 84; this.pages = []; this.newPage();
  }
  newPage() {
    this.c = newCanvas(); this.x = this.c.getContext('2d'); this.pages.push(this.c);
    this.y = this.M;
    if (this.pages.length > 1) {
      setFont(this.x, 17, 600); this.x.fillStyle = SOFT;
      this.x.fillText(this.title + (this.subtitle ? ', ' + this.subtitle : ''), this.M, this.y + 10);
      this.y += 40;
    }
  }
  room(h) { if (this.y + h > PAGE_H - this.M - 50) { this.newPage(); return false; } return true; }
  gap(h = 16) { this.y += h; }
  heading(t, size = 40) {
    this.room(size + 20); setFont(this.x, size, 700); this.x.fillStyle = INK;
    wrapText(this.x, t, PAGE_W - this.M * 2).forEach((l) => { this.y += size * 1.15; this.x.fillText(l, this.M, this.y); });
    this.y += 10;
  }
  h2(t) {
    this.room(80); this.y += 22; setFont(this.x, 25, 700); this.x.fillStyle = INK;
    this.y += 25; this.x.fillText(t, this.M, this.y); this.y += 14;
    this.x.fillStyle = RULE; this.x.fillRect(this.M, this.y, PAGE_W - this.M * 2, 2); this.y += 16;
  }
  para(t, opts = {}) {
    setFont(this.x, opts.size || 19, opts.weight || 400); this.x.fillStyle = opts.color || INK;
    const lh = (opts.size || 19) * 1.45;
    wrapText(this.x, t, PAGE_W - this.M * 2).forEach((l) => { this.room(lh); this.y += lh; this.x.fillText(l, this.M, this.y); });
    this.y += 6;
  }
  kv(pairs, cols = 2) {
    const colW = (PAGE_W - this.M * 2) / cols; const lh = 50;
    for (let i = 0; i < pairs.length; i += cols) {
      this.room(lh);
      pairs.slice(i, i + cols).forEach(([k, v], j) => {
        const cx = this.M + j * colW;
        setFont(this.x, 15, 600); this.x.fillStyle = SOFT; this.x.fillText(k, cx, this.y + 16);
        setFont(this.x, 20, 500); this.x.fillStyle = INK; this.x.fillText(fitText(this.x, v || '–', colW - 20), cx, this.y + 42);
      });
      this.y += lh + 8;
    }
  }
  /* cols: [{label, w (fraction), align}] rows: [[cell, ...]] cell: string or {t, bold, color} */
  table(cols, rows, opts = {}) {
    const W = PAGE_W - this.M * 2; const fs = opts.size || 17; const lh = fs * 1.35; const padY = 9, padX = 10;
    const widths = cols.map((c) => c.w * W);
    const header = () => {
      this.room(lh + padY * 2 + 30);
      this.x.fillStyle = '#eef3f2'; this.x.fillRect(this.M, this.y, W, lh + padY * 2);
      setFont(this.x, fs - 1, 700); this.x.fillStyle = INK;
      let cx = this.M;
      cols.forEach((c, i) => {
        const t = fitText(this.x, c.label, widths[i] - padX * 2);
        this.x.textAlign = c.align === 'right' ? 'right' : (c.align === 'center' ? 'center' : 'left');
        const tx = c.align === 'right' ? cx + widths[i] - padX : (c.align === 'center' ? cx + widths[i] / 2 : cx + padX);
        this.x.fillText(t, tx, this.y + padY + fs);
        cx += widths[i];
      });
      this.x.textAlign = 'left';
      this.y += lh + padY * 2;
      this.x.fillStyle = RULE; this.x.fillRect(this.M, this.y - 1.5, W, 1.5);
    };
    header();
    rows.forEach((r, ri) => {
      const cells = r.map((cell) => (cell && typeof cell === 'object') ? cell : { t: cell });
      const lines = cells.map((cell, i) => { setFont(this.x, fs, cell.bold ? 700 : 400); return wrapText(this.x, cell.t, widths[i] - padX * 2); });
      const h = Math.max(...lines.map((l) => l.length)) * lh + padY * 2;
      if (this.y + h > PAGE_H - this.M - 50) { this.newPage(); header(); }
      if (opts.zebra !== false && ri % 2 === 1) { this.x.fillStyle = '#f7f9f9'; this.x.fillRect(this.M, this.y, W, h); }
      let cx = this.M;
      cells.forEach((cell, i) => {
        setFont(this.x, fs, cell.bold ? 700 : 400); this.x.fillStyle = cell.color || INK;
        const al = cols[i].align;
        this.x.textAlign = al === 'right' ? 'right' : (al === 'center' ? 'center' : 'left');
        const tx = al === 'right' ? cx + widths[i] - padX : (al === 'center' ? cx + widths[i] / 2 : cx + padX);
        lines[i].forEach((l, li) => this.x.fillText(l, tx, this.y + padY + fs + li * lh));
        cx += widths[i];
      });
      this.x.textAlign = 'left';
      this.y += h;
      this.x.fillStyle = FAINT; this.x.fillRect(this.M, this.y - 1, W, 1);
    });
    if (!rows.length) { setFont(this.x, fs, 400); this.x.fillStyle = SOFT; this.y += lh + 6; this.x.fillText(opts.empty || 'Nothing recorded in this period.', this.M + padX, this.y); this.y += 10; }
    this.y += 10;
  }
  /* progress rows: [{label, have, need, unit}] */
  checklist(items) {
    const W = PAGE_W - this.M * 2;
    items.forEach((it) => {
      this.room(58);
      const ok = it.ok != null ? it.ok : it.have >= it.need;
      setFont(this.x, 20, 600); this.x.fillStyle = INK; this.x.fillText(it.label, this.M + 44, this.y + 26);
      // status mark
      this.x.save(); this.x.lineWidth = 3; this.x.strokeStyle = ok ? '#1a7f5a' : '#b4541a';
      this.x.beginPath(); this.x.arc(this.M + 15, this.y + 19, 13, 0, Math.PI * 2); this.x.stroke();
      if (ok) { this.x.beginPath(); this.x.moveTo(this.M + 8, this.y + 20); this.x.lineTo(this.M + 13, this.y + 26); this.x.lineTo(this.M + 23, this.y + 12); this.x.stroke(); }
      else { this.x.beginPath(); this.x.moveTo(this.M + 15, this.y + 11); this.x.lineTo(this.M + 15, this.y + 21); this.x.moveTo(this.M + 15, this.y + 26); this.x.lineTo(this.M + 15, this.y + 27); this.x.stroke(); }
      this.x.restore();
      setFont(this.x, 20, 500); this.x.textAlign = 'right'; this.x.fillStyle = INK;
      this.x.fillText(it.value != null ? it.value : (fmtH(it.have) + ' of ' + fmtH(it.need) + (it.unit || ' h')), this.M + W, this.y + 26);
      this.x.textAlign = 'left';
      if (it.need && it.value == null) {
        const bw = W - 44; this.x.fillStyle = '#e8eeec'; this.x.fillRect(this.M + 44, this.y + 38, bw, 7);
        this.x.fillStyle = ok ? '#1a7f5a' : '#c9861a'; this.x.fillRect(this.M + 44, this.y + 38, bw * clamp(it.have / it.need, 0, 1), 7);
      }
      this.y += 62;
    });
  }
  signature(lines) {
    this.room(200); this.y += 30;
    const W = (PAGE_W - this.M * 2 - 40) / 2;
    lines.forEach((l, i) => {
      const cx = this.M + (i % 2) * (W + 40);
      if (i % 2 === 0 && i > 0) this.y += 90;
      this.x.fillStyle = RULE; this.x.fillRect(cx, this.y + 50, W, 1.5);
      setFont(this.x, 16, 500); this.x.fillStyle = SOFT; this.x.fillText(l, cx, this.y + 74);
    });
    this.y += 100;
  }
  finish(foot) {
    this.pages.forEach((c, i) => {
      const x = c.getContext('2d'); setFont(x, 14, 400); x.fillStyle = SOFT;
      x.fillText(foot, this.M, PAGE_H - 50);
      x.textAlign = 'right'; x.fillText('Page ' + (i + 1) + ' of ' + this.pages.length, PAGE_W - this.M, PAGE_H - 50); x.textAlign = 'left';
    });
    return this.pages;
  }
}

/* ---------- The billing sheet, laid out like Denzil's paper form ---------- */
async function drawBillingSheet(patient, dates, pageNo, hospId) {
  const c = newCanvas(); const x = c.getContext('2d');
  const byDate = {}; dates.forEach((d) => { if (d) byDate[d] = dayFor(patient.id, d); });
  const used = dates.filter((d) => d && byDate[d]);
  const locs = used.map((d) => dayLoc(byDate[d]));
  const hosp = hospitalById(hospId || (locs[0] || patientLoc(patient)).hospital);
  const L = 66, R = PAGE_W - 66, W = R - L;
  const moved = locs.some((l) => !sameLoc(l, locs[0]));

  // Label box
  const lb = { x: L, y: 56, w: 560, h: 236 };
  const im = await loadImage(await photoForPatient(patient));
  x.fillStyle = '#e9e9e9'; x.fillRect(lb.x, lb.y, lb.w, lb.h);
  if (im) { x.fillStyle = '#fff'; x.fillRect(lb.x, lb.y, lb.w, lb.h); drawImageContain(x, im, lb.x + 4, lb.y + 4, lb.w - 8, lb.h - 8); }
  else {
    setFont(x, 26, 700); x.fillStyle = INK; x.fillText(fitText(x, patientName(patient), lb.w - 40), lb.x + 20, lb.y + 60);
    setFont(x, 20, 400);
    [patient.ur ? 'UR ' + patient.ur : '', patient.fund ? 'Fund: ' + patient.fund : '', 'No label photo'].filter(Boolean).forEach((t, i) => x.fillText(t, lb.x + 20, lb.y + 100 + i * 32));
  }
  // Details box
  const db = { x: L + 590, y: 66, w: W - 590, h: 226 };
  x.strokeStyle = RULE; x.lineWidth = 2; x.strokeRect(db.x, db.y, db.w, db.h);
  const wb = locs.length ? (moved ? 'Moved, see the ward / bed row' : wardBed(locs[0])) : wardBed(patientLoc(patient));
  const rows = [['Referring Doctor:', patient.refDoc], ['Ward / Bed:', wb], ['Admission Dx:', patient.dx], ['Health fund:', patient.fund], ['Patient:', patientName(patient) + (patient.ur ? ', UR ' + patient.ur : '')]];
  rows.forEach(([k, v], i) => {
    const yy = db.y + 40 + i * 40;
    setFont(x, 19, 400); x.fillStyle = '#3b4a50'; x.fillText(k, db.x + 18, yy);
    const kw = x.measureText(k).width;
    setFont(x, 19, 600); x.fillStyle = INK; x.fillText(fitText(x, v || '', db.w - kw - 46), db.x + 26 + kw, yy);
  });

  // Table geometry
  const colCode = 112, colDesc = 520, nDay = 7;
  const dayW = (W - colCode - colDesc) / nDay;
  const top = 320, headH = 52;
  const extras = Array.from(new Set(dates.flatMap((d) => byDate[d] ? byDate[d].items : []))).filter((cd) => ITEM_MAP[cd] && !ITEM_MAP[cd].form);
  const formRows = [{ pseudo: 'loc' }];
  FORM_ITEMS.forEach(([code, sec], i) => {
    const prev = i ? FORM_ITEMS[i - 1][1] : sec;
    if (code === '25014') { formRows.push({ pseudo: 'time' }); formRows.push({ pseudo: 'asa' }); }
    formRows.push({ code, thick: sec !== prev });
  });
  extras.forEach((cd, i) => formRows.push({ code: cd, thick: i === 0 }));
  const noteDays = dates.filter((d) => d && byDate[d] && byDate[d].note);
  const footReserve = 150 + (noteDays.length ? 60 : 0);
  const nUnits = formRows.reduce((a, r) => a + (r.pseudo === 'time' || r.pseudo === 'loc' ? 2 : 1), 0);
  const rowH = Math.min(30, Math.floor((PAGE_H - top - headH - footReserve) / nUnits));

  // Header row
  x.strokeStyle = RULE; x.lineWidth = 2.4;
  x.strokeRect(L, top, W, headH);
  setFont(x, 19, 700); x.fillStyle = INK;
  x.fillText('MBS #', L + 14, top + 33);
  const firstDate = dates.find(Boolean) || today();
  const fd = fromISO(firstDate);
  x.fillText(fitText(x, hosp.name.toUpperCase(), 250), L + colCode + 12, top + 33);
  setFont(x, 17, 700);
  x.fillText('Month: ' + MON[fd.getMonth()], L + colCode + 280, top + 33);
  x.fillText('Year: ' + fd.getFullYear(), L + colCode + 410, top + 33);
  dates.forEach((d, i) => {
    const cx = L + colCode + colDesc + i * dayW;
    if (d) {
      const dd = fromISO(d);
      setFont(x, 17, 700); x.textAlign = 'center'; x.fillStyle = INK;
      x.fillText(fmtDM(d), cx + dayW / 2, top + 24);
      setFont(x, 13, 500); x.fillStyle = SOFT; x.fillText(DOW[dd.getDay()], cx + dayW / 2, top + 43);
      x.textAlign = 'left';
    }
  });

  // Body rows
  let y = top + headH;
  formRows.forEach((r) => {
    const h = r.pseudo === 'time' || r.pseudo === 'loc' ? rowH * 2 : rowH;
    if (r.thick) { x.fillStyle = RULE; x.fillRect(L, y - 1.5, W, 3); }
    x.fillStyle = INK;
    if (r.pseudo === 'loc') {
      x.fillStyle = '#f1f4f3'; x.fillRect(L, y, W, h); x.fillStyle = INK;
      setFont(x, 16, 700); x.fillText('Ward / bed', L + colCode + 10, y + rowH - 8);
      setFont(x, 12, 400); x.fillStyle = SOFT; x.fillText(moved ? 'Patient moved during these days' : 'Location for each day of care', L + colCode + 10, y + rowH * 2 - 9);
    } else if (r.pseudo === 'time') {
      setFont(x, 16, 400); x.fillText('Time modifier:', L + colCode + 10, y + rowH - 8);
      setFont(x, 15, 700); x.fillText('START', L + colCode + 160, y + rowH - 8); x.fillText('FINISH', L + colCode + 340, y + rowH - 8);
      setFont(x, 12, 400); x.fillStyle = SOFT; x.fillText('Start / finish times and time item for each day', L + colCode + 10, y + rowH * 2 - 9);
    } else if (r.pseudo === 'asa') {
      setFont(x, 16, 400); x.fillText('ASA modifier:', L + colCode + 10, y + rowH - 8);
    } else {
      const it = ITEM_MAP[r.code] || { label: r.code };
      setFont(x, 16, 500); x.fillText(r.code, L + 12, y + rowH - 8);
      setFont(x, 16, 400);
      const label = it.label; const hint = it.hint ? ' (' + it.hint + ')' : '';
      const lw = x.measureText(label).width;
      if (lw > colDesc - 20) {
        let fs = 16; while (fs > 12.5) { fs -= 0.5; setFont(x, fs, 400); if (x.measureText(label).width <= colDesc - 20) break; }
        x.fillText(fitText(x, label, colDesc - 20), L + colCode + 10, y + rowH - 8);
      }
      else {
        x.fillText(label, L + colCode + 10, y + rowH - 8);
        if (hint) { setFont(x, 11.5, 400); x.fillText(fitText(x, hint, colDesc - 26 - lw), L + colCode + 14 + lw, y + rowH - 8); }
      }
    }
    // day cells
    dates.forEach((d, i) => {
      const cx = L + colCode + colDesc + i * dayW;
      const day = d && byDate[d];
      if (!day) return;
      x.textAlign = 'center'; x.fillStyle = INK;
      if (r.pseudo === 'loc') {
        const l = dayLoc(day); const prev = i > 0 && dates[i - 1] && byDate[dates[i - 1]] ? dayLoc(byDate[dates[i - 1]]) : null;
        const changedHere = prev && !sameLoc(prev, l);
        setFont(x, 13.5, changedHere ? 800 : 600);
        x.fillText(fitText(x, l.ward || '\u2013', dayW - 6), cx + dayW / 2, y + rowH * 0.78);
        setFont(x, 12.5, changedHere ? 700 : 400);
        x.fillText(fitText(x, l.bed ? 'Bed ' + l.bed : '', dayW - 6), cx + dayW / 2, y + rowH * 1.55);
      } else if (r.pseudo === 'time') {
        if (day.times && (day.times.start || day.times.finish)) {
          setFont(x, 14, 600);
          x.fillText(day.times.start || '–', cx + dayW / 2, y + rowH * 0.62);
          x.fillText(day.times.finish || '–', cx + dayW / 2, y + rowH * 1.18);
          const tc = derivedCodes(day).find((cd) => cd.startsWith('230'));
          const m = minsBetween(day.times.start, day.times.finish);
          setFont(x, 12, 500); x.fillStyle = SOFT;
          x.fillText(tc || (m != null ? m + ' min' : ''), cx + dayW / 2, y + rowH * 1.75);
        }
      } else if (r.pseudo === 'asa') {
        if (day.asa) { setFont(x, 14, 700); x.fillText(day.asa + ' (' + ASA_CODES[day.asa] + ')', cx + dayW / 2, y + rowH - 8); }
      } else if (day.items.includes(r.code)) {
        drawTick(x, cx + dayW / 2, y + rowH / 2, Math.min(22, rowH * 0.75));
      }
      x.textAlign = 'left';
    });
    y += h;
    x.fillStyle = '#9aa7ab'; x.fillRect(L, y - 0.5, W, 1);
  });
  // vertical lines
  x.fillStyle = RULE;
  x.fillRect(L, top, 2.4, y - top); x.fillRect(R - 2.4, top, 2.4, y - top);
  x.fillRect(L + colCode, top, 1.6, y - top); x.fillRect(L + colCode + colDesc, top, 2, y - top);
  for (let i = 1; i < nDay; i++) x.fillRect(L + colCode + colDesc + i * dayW, top, 1, y - top);
  x.fillRect(L, y - 1.5, W, 3);

  // Notes
  let fy = y + 16;
  if (noteDays.length) {
    setFont(x, 15, 400); x.fillStyle = INK;
    const t = 'Notes: ' + noteDays.map((d) => fmtDM(d) + ' ' + byDate[d].note).join('; ');
    wrapText(x, t, W).slice(0, 3).forEach((l) => { fy += 20; x.fillText(l, L, fy); });
    fy += 10;
  }
  // Modifier legend (as on the paper form)
  fy += 8;
  setFont(x, 17, 400); x.fillStyle = INK; x.fillText('Time/ASA Modifier:', L + 30, fy + 30);
  const lx = L + 210, cw = 168, ch = 28;
  const cells = [['16 – 30 min: 23025', '31 – 45 min: 23035', '46 – 60 min: 23045'], ['61 – 75 min: 23055', '76 – 90 min: 23065', 'Other:']];
  x.strokeStyle = RULE; x.lineWidth = 1.5; setFont(x, 14.5, 400);
  cells.forEach((row, ri) => row.forEach((t, ci) => { x.strokeRect(lx + ci * cw, fy + ri * ch, cw, ch); x.fillText(t, lx + ci * cw + 10, fy + ri * ch + 20); }));
  const ax = R - 300;
  ['3: 25000', '4: 25005', '5: 25010'].forEach((t, i) => { x.strokeRect(ax + i * 100, fy + 14, 100, ch); x.fillText(t, ax + i * 100 + 14, fy + 14 + 20); });
  fy += ch * 2 + 46;
  setFont(x, 19, 700); x.fillStyle = INK;
  const nm = (S.settings.name || '').toUpperCase();
  x.fillText('Service Provided By:  ' + nm, L + 30, fy);
  x.fillText('Provider Number:  ' + (hosp.provider || ''), L + 470, fy);
  x.textAlign = 'right'; x.fillText(hosp.name.toUpperCase(), R - 30, fy); x.textAlign = 'left';
  setFont(x, 12.5, 400); x.fillStyle = SOFT;
  x.fillText('Generated by Caring Intensively on ' + fmtDMY(today()) + (pageNo ? '. ' + pageNo : ''), L + 30, PAGE_H - 26);
  return c;
}

/* Split a patient's billed days into sheets: one hospital per sheet (provider numbers differ), 7 dated columns each */
function patientSheets(dayList) {
  const ds = dayList.slice().sort((a, b) => a.date < b.date ? -1 : 1);
  const groups = [];
  ds.forEach((d) => {
    const h = dayLoc(d).hospital;
    let g = groups[groups.length - 1];
    if (!g || g.hosp !== h || g.dates.length === 7) { g = { hosp: h, dates: [] }; groups.push(g); }
    g.dates.push(d.date);
  });
  groups.forEach((g) => { while (g.dates.length < 7) g.dates.push(null); });
  return groups;
}
async function drawPatientSheets(p, dayList) {
  const groups = patientSheets(dayList); const out = [];
  for (let i = 0; i < groups.length; i++) out.push(await drawBillingSheet(p, groups[i].dates, patientName(p) + ', sheet ' + (i + 1) + ' of ' + groups.length, groups[i].hosp));
  return out;
}

function itemSummary(days) {
  const c = {};
  days.forEach((d) => dayAllCodes(d).forEach((cd) => { c[cd] = (c[cd] || 0) + 1; }));
  return Object.keys(c).sort((a, b) => c[b] - c[a] || (a < b ? -1 : 1)).map((cd) => c[cd] > 1 ? cd + ' ×' + c[cd] : cd).join(', ');
}

/* ---------- Report builders: each returns {title, filename, pages, csv?} ---------- */
async function buildSecretaryReport(dayList, opts = {}) {
  const days = dayList.slice().sort((a, b) => a.date < b.date ? -1 : 1);
  const a = days.length ? days[0].date : today(), b = days.length ? days[days.length - 1].date : today();
  const pids = Array.from(new Set(days.map((d) => d.pid)));
  const pats = pids.map(patientById).filter(Boolean).sort((p, q) => patientName(p).localeCompare(patientName(q)));
  const title = opts.title || 'Billing for processing';
  let pages = [];
  if (opts.summary !== false) {
  const doc = new Doc(title, fmtRange(a, b));
  doc.heading(title);
  doc.para(fmtRange(a, b) + '. Prepared ' + fmtDate(today(), { year: true }) + ' by ' + S.settings.name + '.', { color: SOFT });
  doc.gap(10);
  doc.kv([['Patients', String(pats.length)], ['Patient-days', String(days.length)], ['Items', String(sum(days, (d) => dayAllCodes(d).length))], ['Provider numbers', S.settings.hospitals.map((h) => h.name + ' ' + h.provider).join('; ')]], 2);
  doc.h2('Patients');
  doc.table(
    [{ label: 'Patient', w: 0.23 }, { label: 'Fund', w: 0.13 }, { label: 'Hospital and ward / bed', w: 0.2 }, { label: 'Dates of care', w: 0.18 }, { label: 'Items', w: 0.26 }],
    pats.map((p) => {
      const pd = days.filter((d) => d.pid === p.id).sort((u, v) => u.date < v.date ? -1 : 1);
      const hs = Array.from(new Set(pd.map((d) => hospitalById(dayLoc(d).hospital).name)));
      const wbs = []; pd.forEach((d) => { const t = wardBedShort(dayLoc(d)); if (t && wbs[wbs.length - 1] !== t) wbs.push(t); });
      return [{ t: patientName(p) + (p.ur ? '\nUR ' + p.ur : ''), bold: true }, p.fund || '–', hs.join('; ') + (wbs.length ? '\n' + wbs.join(' then ') : ''), pd.map((d) => fmtDM(d.date)).join(', '), itemSummary(pd)];
    })
  );
  const tally = {};
  days.forEach((d) => dayAllCodes(d).forEach((cd) => { tally[cd] = (tally[cd] || 0) + 1; }));
  doc.h2('Item totals');
  doc.table([{ label: 'Item', w: 0.14 }, { label: 'Description', w: 0.72 }, { label: 'Count', w: 0.14, align: 'right' }],
    Object.keys(tally).sort((p, q) => tally[q] - tally[p]).map((cd) => [cd, itemLabel(cd) || modifierLabel(cd), String(tally[cd])]));
  pages = doc.finish('Summary prepared with Caring Intensively. One form sheet per patient follows.');
  }
  if (opts.sheets !== false) {
    for (const p of pats) pages.push(...await drawPatientSheets(p, days.filter((d) => d.pid === p.id)));
  }
  const csv = billingCSV(days);
  const label = opts.fileLabel ? String(opts.fileLabel).replace(/[^A-Za-z0-9 \-]/g, '').replace(/\s+/g, ' ').trim() + ' ' : '';
  return { title, pages, filename: 'Gill billing ' + label + fileRange(a, b), csv, days, range: [a, b] };
}
function modifierLabel(cd) {
  const band = TIME_BANDS.find((b) => b.code === cd);
  if (band) return 'Anaesthesia time ' + band.min + '–' + band.max + ' min';
  const asa = Object.keys(ASA_CODES).find((k) => ASA_CODES[k] === cd);
  if (asa) return 'ASA physical status ' + asa;
  return '';
}
function fileRange(a, b) { return a === b ? fmtDMY(a).replace(/\//g, '-') : fmtDMY(a).replace(/\//g, '-') + ' to ' + fmtDMY(b).replace(/\//g, '-'); }

async function buildFundReport(fund, a, b, opts = {}) {
  const days = S.days.filter((d) => d.date >= a && d.date <= b && (patientById(d.pid) || {}).fund === fund).sort((p, q) => p.date < q.date ? -1 : 1);
  const title = fund + ' billing';
  const doc = new Doc(title, fmtRange(a, b));
  doc.heading(title);
  doc.para(fmtRange(a, b) + '. Prepared ' + fmtDate(today(), { year: true }) + ' by ' + S.settings.name + '.', { color: SOFT });
  const pids = Array.from(new Set(days.map((d) => d.pid)));
  doc.kv([['Health fund', fund], ['Patients', String(pids.length)], ['Patient-days', String(days.length)], ['Items', String(sum(days, (d) => dayAllCodes(d).length))]], 2);
  doc.h2('Services by patient and date');
  const rows = [];
  pids.map(patientById).filter(Boolean).sort((p, q) => patientName(p).localeCompare(patientName(q))).forEach((p) => {
    days.filter((d) => d.pid === p.id).forEach((d, i) => {
      const l = dayLoc(d); const h = hospitalById(l.hospital);
      rows.push([i === 0 ? { t: patientName(p) + (p.ur ? '\nUR ' + p.ur : ''), bold: true } : '', fmtDMY(d.date), (S.settings.hospitals.length > 1 ? h.name + '\n' : '') + (wardBedShort(l) || '–'), h.provider || '', dayAllCodes(d).join(', ')]);
    });
  });
  doc.table([{ label: 'Patient', w: 0.24 }, { label: 'Date', w: 0.13 }, { label: 'Ward / bed', w: 0.15 }, { label: 'Provider no.', w: 0.14 }, { label: 'MBS items', w: 0.34 }], rows, { zebra: false });
  const pages = doc.finish(fund + ' summary prepared with Caring Intensively.');
  if (opts.sheets) {
    for (const pid of pids) { const p = patientById(pid); if (p) pages.push(...await drawPatientSheets(p, days.filter((d) => d.pid === pid))); }
  }
  return { title, pages, filename: fund + ' billing ' + fileRange(a, b), csv: billingCSV(days), days };
}

function billingCSV(days) {
  const rows = [['Date', 'Patient', 'UR', 'Health fund', 'Hospital', 'Provider number', 'Ward', 'Bed', 'Referring doctor', 'Admission diagnosis', 'MBS items', 'Start', 'Finish', 'ASA', 'Note', 'Sent to secretary']];
  days.slice().sort((a, b) => a.date < b.date ? -1 : 1).forEach((d) => {
    const p = patientById(d.pid) || {}; const l = dayLoc(d); const h = hospitalById(l.hospital);
    rows.push([fmtDMY(d.date), patientName(p), p.ur || '', p.fund || '', h.name, h.provider, l.ward || '', l.bed || '', p.refDoc || '', p.dx || '', dayAllCodes(d).join(' '), (d.times || {}).start || '', (d.times || {}).finish || '', d.asa || '', d.note || '', d.sent ? fmtDMY(d.sent.slice(0, 10)) : '']);
  });
  return toCSV(rows);
}

function ecmoDetail(e) {
  const bits = [];
  if (e.mode) bits.push(e.mode);
  if (e.config) bits.push(e.config);
  if (e.role) bits.push(e.role);
  if (e.imaging && e.imaging.length) bits.push(e.imaging.join('/') + ' guided');
  if (e.setting) bits.push(e.setting);
  if (e.complication && e.complication !== 'None') bits.push('Complication: ' + e.complication);
  if (e.reason) bits.push(e.reason);
  if (e.urgency) bits.push(e.urgency);
  if (e.from || e.to) bits.push((e.from || '?') + ' to ' + (e.to || '?'));
  if (e.transport) bits.push(e.transport);
  if (e.cannulatedOnSite) bits.push('Cannulated on site');
  if (e.outcome) bits.push(e.outcome);
  if (e.referrer) bits.push('Referred by ' + e.referrer);
  if (e.kind) bits.push(e.kind);
  if (e.patients) bits.push(e.patients + ' patients');
  if (e.hours) bits.push(fmtH(e.hours) + ' h');
  if (e.topic) bits.push(e.topic);
  if (e.note) bits.push(e.note);
  return bits.join('. ');
}

function buildEcmoReport(a, b) {
  const list = S.ecmo.filter((e) => e.date >= a && e.date <= b).sort((p, q) => p.date < q.date ? -1 : 1);
  const title = 'ECMO practice record';
  const doc = new Doc(title, fmtRange(a, b));
  doc.heading(title);
  doc.para('Record of ECMO clinical activity, quality assurance and education to support credentialing and accreditation.', { color: SOFT });
  doc.kv([['Clinician', S.settings.name], ['Period', fmtRange(a, b)], ['AHPRA registration', S.settings.ahpra || '–'], ['Prepared', fmtDate(today(), { year: true })]], 2);
  doc.h2('Summary against targets');
  const prog = ecmoProgress([a, b]);
  doc.table([{ label: 'Activity', w: 0.46 }, { label: 'Recorded', w: 0.18, align: 'right' }, { label: 'Target', w: 0.18, align: 'right' }, { label: 'Status', w: 0.18 }],
    prog.map((t) => [t.name, String(t.n), t.target ? String(t.target) : '–', t.target ? (t.met ? { t: 'Met', color: '#1a7f5a', bold: true } : { t: (t.target - t.n) + ' to go', color: '#b4541a', bold: true }) : '–']));
  const cann = list.filter((e) => e.type === 'cannulation');
  if (cann.length) {
    doc.h2('Cannulations');
    const by = (k) => { const c = {}; cann.forEach((e) => { const v = e[k] || 'Not recorded'; c[v] = (c[v] || 0) + 1; }); return Object.entries(c).sort((p, q) => q[1] - p[1]).map(([k2, v]) => k2 + ' ' + v).join(', '); };
    doc.kv([['By mode', by('mode')], ['By role', by('role')], ['By configuration', by('config')], ['Complications', String(cann.filter((e) => e.complication && e.complication !== 'None').length)]], 2);
  }
  const hrs = sum(list.filter((e) => e.hours), (e) => e.hours);
  if (hrs) doc.para('Total hours recorded against meetings, rounds, education and retrievals: ' + fmtH(hrs) + ' h.');
  doc.h2('Activity log');
  doc.table([{ label: 'Date', w: 0.13 }, { label: 'Activity', w: 0.18 }, { label: 'Details', w: 0.43 }, { label: 'Location', w: 0.16 }, { label: 'Ref', w: 0.1 }],
    list.map((e) => [fmtDMY(e.date), (ECMO_TYPES.find((t) => t.id === e.type) || {}).name || e.type, ecmoDetail(e), e.location || '', e.ref || '']), { size: 15 });
  doc.signature(['Clinician signature and date', 'Verified by (ECMO director / head of unit)', 'Name of verifier', 'Date']);
  const pages = doc.finish('ECMO practice record for ' + S.settings.name + ', prepared with Caring Intensively.');
  const csvRows = [['Date', 'Activity', 'Details', 'Location', 'Reference']].concat(list.map((e) => [fmtDMY(e.date), (ECMO_TYPES.find((t) => t.id === e.type) || {}).name, ecmoDetail(e), e.location || '', e.ref || '']));
  return { title, pages, filename: 'Gill ECMO record ' + fileRange(a, b), csv: toCSV(csvRows) };
}

function buildCpdReport(year) {
  const P = cpdProgress(year);
  const title = 'CPD record ' + year;
  const doc = new Doc(title, 'CICM CPD Program');
  doc.heading(title);
  doc.para('College of Intensive Care Medicine of Australia and New Zealand CPD Program, 1 January to 31 December ' + year + '.', { color: SOFT });
  doc.kv([['Fellow', S.settings.name], ['CICM ID', S.settings.cicmId || '–'], ['AHPRA registration', S.settings.ahpra || '–'], ['Prepared', fmtDate(today(), { year: true })]], 2);
  doc.h2('Requirements');
  doc.checklist(P.checks.map((c) => ({ label: c.label, have: c.have, need: c.need })));
  doc.checklist([
    { label: 'Professional development plan for ' + year, ok: P.pdp, value: P.pdp ? 'Logged' : 'Not logged' },
    ...CAPE.map((c) => ({ label: c.name, ok: P.cape[c.id], value: P.cape[c.id] ? 'Covered' : 'Not yet covered' })),
    { label: 'Airway management (SHLR), triennium ' + P.triennium[0] + '–' + P.triennium[1], ok: !!P.shlr, value: P.shlr ? 'Completed ' + fmtDMY(P.shlr.date) : 'Not yet completed' }
  ]);
  doc.h2('Activities');
  const list = P.list.slice().sort((p, q) => p.date < q.date ? -1 : 1);
  doc.table([{ label: 'Date', w: 0.12 }, { label: 'Activity', w: 0.3 }, { label: 'Category', w: 0.17 }, { label: 'Hours', w: 0.08, align: 'right' }, { label: 'Location', w: 0.17 }, { label: 'CAPE', w: 0.16 }],
    list.map((e) => [fmtDMY(e.date), (e.title ? e.title + '\n' : '') + cpdType(e.type).name, CPD_CATS[e.cat || cpdType(e.type).cat].short, fmtH(e.hours), e.location || '', (e.cape || []).map((id) => (CAPE.find((c) => c.id === id) || {}).name).filter(Boolean).join(', ')]), { size: 15 });
  doc.para('Total: ' + fmtH(P.total) + ' hours across ' + plural(list.length, 'activity', 'activities') + '. Professional development plan hours are capped at 3, per CICM guidance.', { color: SOFT, size: 16 });
  const refl = list.filter((e) => e.reflection);
  if (refl.length) {
    doc.h2('Reflections');
    refl.forEach((e) => { doc.para(fmtDMY(e.date) + ', ' + (e.title || cpdType(e.type).name), { weight: 700, size: 17 }); doc.para(e.reflection, { size: 17 }); });
  }
  doc.signature(['Signature', 'Date']);
  const pages = doc.finish('CPD record for ' + S.settings.name + ', prepared with Caring Intensively. The CICM portal CPD diary is the official record.');
  const csvRows = [['Date', 'Title', 'Activity type', 'Category', 'Hours', 'Location', 'Provider', 'CAPE', 'Reflection', 'Logged in CICM portal']].concat(list.map((e) => [fmtDMY(e.date), e.title || '', cpdType(e.type).name, CPD_CATS[e.cat || cpdType(e.type).cat].name, e.hours, e.location || '', e.provider || '', (e.cape || []).join(' '), e.reflection || '', e.portal ? 'Yes' : 'No']));
  return { title, pages, filename: 'Gill CPD ' + year, csv: toCSV(csvRows) };
}

/* ---------- PDF writer: one full-page JPEG per page ---------- */
function canvasJPEG(c, q = 0.8) {
  return new Promise((res) => c.toBlob(async (b) => res(new Uint8Array(await b.arrayBuffer())), 'image/jpeg', q));
}
async function pagesToPDF(pages, title) {
  const imgs = [];
  for (const c of pages) imgs.push({ bytes: await canvasJPEG(c), w: c.width, h: c.height });
  const enc = new TextEncoder();
  const chunks = []; let len = 0; const off = [];
  const push = (d) => { const b = typeof d === 'string' ? enc.encode(d) : d; chunks.push(b); len += b.length; };
  push('%PDF-1.4\n'); push(new Uint8Array([0x25, 0xE2, 0xE3, 0xCF, 0xD3, 0x0A]));
  const obj = (n, f) => { off[n] = len; push(n + ' 0 obj\n'); f(); push('\nendobj\n'); };
  const n = imgs.length, PW = 595.28, PH = 841.89;
  obj(1, () => push('<< /Type /Catalog /Pages 2 0 R >>'));
  obj(2, () => push('<< /Type /Pages /Kids [' + imgs.map((_, i) => (3 + 3 * i) + ' 0 R').join(' ') + '] /Count ' + n + ' >>'));
  imgs.forEach((im, i) => {
    const pn = 3 + 3 * i;
    obj(pn, () => push('<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ' + PW + ' ' + PH + '] /Resources << /XObject << /Im' + i + ' ' + (pn + 2) + ' 0 R >> >> /Contents ' + (pn + 1) + ' 0 R >>'));
    const cs = 'q ' + PW + ' 0 0 ' + PH + ' 0 0 cm /Im' + i + ' Do Q';
    obj(pn + 1, () => { push('<< /Length ' + cs.length + ' >>\nstream\n'); push(cs); push('\nendstream'); });
    obj(pn + 2, () => { push('<< /Type /XObject /Subtype /Image /Width ' + im.w + ' /Height ' + im.h + ' /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ' + im.bytes.length + ' >>\nstream\n'); push(im.bytes); push('\nendstream'); });
  });
  const info = 3 + 3 * n;
  const safe = String(title || 'Report').replace(/[^\x20-\x7E]/g, '').replace(/([()\\])/g, '\\$1');
  obj(info, () => push('<< /Title (' + safe + ') /Producer (Caring Intensively) >>'));
  const xref = len;
  push('xref\n0 ' + (info + 1) + '\n0000000000 65535 f \n');
  for (let i = 1; i <= info; i++) push(String(off[i]).padStart(10, '0') + ' 00000 n \n');
  push('trailer\n<< /Size ' + (info + 1) + ' /Root 1 0 R /Info ' + info + ' 0 R >>\nstartxref\n' + xref + '\n%%EOF\n');
  return new Blob(chunks, { type: 'application/pdf' });
}
