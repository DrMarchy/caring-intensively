/* ===== Caring Intensively: interface ===== */
const SANDBOXED = (() => { try { return window.self !== window.top; } catch (e) { return true; } })();
const IS_IOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
const STANDALONE = (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) || navigator.standalone === true;
const APP_VERSION = '1.0';

const svg = (p, sw = 1.8) => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="' + sw + '" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + p + '</svg>';
const I = {
  home: '<rect x="3" y="4" width="18" height="14" rx="2.5"/><path d="M6 12h2.5l1.5-3 2.5 6 1.5-3H18"/><path d="M9 21h6"/>',
  bed: '<path d="M3 18V6"/><path d="M3 14h18v4"/><path d="M21 14v-2a3 3 0 0 0-3-3h-7v5"/><circle cx="7" cy="10.5" r="2"/>',
  ecmo: '<path d="M5 9a7.5 7.5 0 0 1 13.5-2.5"/><path d="M19 15a7.5 7.5 0 0 1-13.5 2.5"/><path d="M18.8 2.8v4h-4"/><path d="M5.2 21.2v-4h4"/><circle cx="12" cy="12" r="2.3"/>',
  cpd: '<path d="M2 9.5l10-5 10 5-10 5z"/><path d="M6 11.5v4.8c3.2 2.2 8.8 2.2 12 0v-4.8"/><path d="M22 9.5v5"/>',
  doc: '<path d="M7 3h7l5 5v13H7z"/><path d="M14 3v5h5"/><path d="M10 13h6M10 17h6"/>',
  camera: '<path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  gear: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
  check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
  x: '<path d="M6 6l12 12M18 6L6 18"/>',
  left: '<path d="M15 5l-7 7 7 7"/>',
  right: '<path d="M9 5l7 7-7 7"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.6v.4"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3.5 7l8.5 6 8.5-6"/>',
  share: '<path d="M12 3v12"/><path d="M7 8l5-5 5 5"/><path d="M5 13v7h14v-7"/>',
  pen: '<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="M13.5 6.5l4 4"/>',
  image: '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="M21 16l-5-5-9 9"/>'
};
const LOGO = '<svg viewBox="0 0 48 48" aria-hidden="true"><rect width="48" height="48" rx="13" fill="#10232b" stroke="rgba(255,255,255,.14)"/><g fill="none" stroke-width="4.2" stroke-linecap="round"><path d="M14.5 13c4.5 6 4.5 16 0 22" stroke="#45d8bc"/><path d="M23 13c4.5 6 4.5 16 0 22" stroke="#ff5d63"/><path d="M31.5 13c4.5 6 4.5 16 0 22" stroke="#ffbb4d"/></g></svg>';

const UI = {
  tab: 'home', billSeg: 'active',
  hist: { q: '', range: '30d', fund: '', status: '', group: 'date', limit: 120 },
  statsRange: '12m', ecmoQ: '', ecmoFilter: '', cpdYear: Number(today().slice(0, 4)), cpdQ: '',
  rep: { billDay: today(), pid: '', pq: '', pMode: 'stay', pDay: '', pA: '', pB: '', billRange: 'week', billA: today(), billB: today(), fund: '', fundRange: 'month', fundSheets: false, ecmoMode: 'period', ecmoA: addDays(today(), -364), ecmoB: today(), cpdYear: Number(today().slice(0, 4)) }
};
const TABS = [['home', 'Home', 'home', 'bill'], ['billing', 'Patients', 'bed', 'bill'], ['ecmo', 'ECMO', 'ecmo', 'ecmo'], ['cpd', 'CPD', 'cpd', 'cpd'], ['reports', 'Reports', 'doc', 'bill']];

/* ---------------- Rendering ---------------- */
function render() {
  buildItems();
  const root = $('#app');
  if (!S.settings.onboarded) { root.innerHTML = viewWelcome(); $('#tabs').classList.add('hide'); return; }
  $('#tabs').classList.remove('hide');
  const tab = TABS.find((t) => t[0] === UI.tab) || TABS[0];
  root.dataset.mod = tab[3];
  root.innerHTML = ({ home: viewHome, billing: viewBilling, ecmo: viewEcmo, cpd: viewCpd, reports: viewReports })[UI.tab]();
  renderTabs();
  hydrate(root);
}
function renderTabs() {
  const unb = unbilledToday().length;
  $('#tabs .in').innerHTML = TABS.map(([id, label, icon, mod]) =>
    '<button data-act="tab" data-tab="' + id + '" data-mod="' + mod + '" class="' + (UI.tab === id ? 'on' : '') + '" aria-label="' + label + '">' + svg(I[icon]) +
    (id === 'billing' && unb ? '<span class="badge">' + unb + '</span>' : '') + '<span>' + label + '</span></button>').join('');
}
async function hydrate(el) {
  for (const img of $$('img[data-pid]', el)) {
    const p = patientById(img.dataset.pid);
    if (!p) continue;
    const u = await photoForPatient(p);
    if (u) img.src = u; else img.removeAttribute('src');
  }
}
function changed() { save(); render(); refreshPages(); }
function goTab(t) { UI.tab = t; try { history.replaceState(null, '', '#' + t); } catch (e) { } closeAllPages(); render(); window.scrollTo(0, 0); }

/* ---------------- Pages, sheets, toasts ---------------- */
const pageStack = [];
function openPage(renderFn, opts = {}) {
  const el = document.createElement('div');
  el.className = 'page'; if (opts.mod) el.dataset.mod = opts.mod;
  document.body.appendChild(el);
  const pg = { el, render: renderFn, opts };
  pageStack.push(pg);
  if (renderFn) { el.innerHTML = '<div class="in">' + renderFn(pg) + '</div>'; hydrate(el); }
  document.body.style.overflow = 'hidden';
  return pg;
}
function refreshPages() {
  pageStack.forEach((pg) => {
    if (!pg.render || pg.opts.static) return;
    const st = pg.el.scrollTop;
    const html = pg.render(pg);
    if (html == null) return;
    pg.el.innerHTML = '<div class="in">' + html + '</div>'; pg.el.scrollTop = st; hydrate(pg.el);
  });
}
function closePage() { const pg = pageStack.pop(); if (pg) pg.el.remove(); if (!pageStack.length) document.body.style.overflow = ''; render(); }
function closeAllPages() { while (pageStack.length) pageStack.pop().el.remove(); document.body.style.overflow = ''; }
function pageHead(backLabel, title, right = '') {
  return '<div class="head"><button class="back" data-act="closePage">' + svg(I.left, 2.2) + esc(backLabel) + '</button><div class="ttl">' + esc(title) + '</div><div class="right">' + right + '</div></div>';
}

const sheetStack = [];
function openSheet(opts) {
  const scrim = document.createElement('div'); scrim.className = 'scrim'; scrim.dataset.act = 'closeSheet';
  const el = document.createElement('div'); el.className = 'sheet' + (opts.tall ? ' tall' : ''); el.setAttribute('role', 'dialog'); el.setAttribute('aria-modal', 'true');
  if (opts.mod) el.dataset.mod = opts.mod;
  document.body.appendChild(scrim); document.body.appendChild(el);
  const sh = { el, scrim, st: opts.st || {}, render: opts.render, onClose: opts.onClose };
  sh.update = (keepScroll = true) => {
    const sb = $('.sb', el); const top = sb && keepScroll ? sb.scrollTop : 0;
    const r = sh.render(sh.st, sh);
    el.innerHTML = '<div class="sh"><div class="ttl"><b>' + esc(r.title) + '</b>' + (r.sub ? '<span>' + esc(r.sub) + '</span>' : '') + '</div><button class="xbtn" data-act="closeSheet" aria-label="Close">' + svg(I.x, 2.2) + '</button></div>' +
      '<div class="sb">' + r.body + '</div>' + (r.foot ? '<div class="sf">' + r.foot + '</div>' : '');
    const nsb = $('.sb', el); if (nsb) nsb.scrollTop = top;
    hydrate(el);
    if (r.after) r.after(el);
  };
  sheetStack.push(sh);
  sh.update(false);
  document.body.style.overflow = 'hidden';
  return sh;
}
const curSheet = () => sheetStack[sheetStack.length - 1];
function closeSheet() {
  const sh = sheetStack.pop(); if (!sh) return;
  sh.el.remove(); sh.scrim.remove();
  if (sh.onClose) sh.onClose();
  if (!sheetStack.length && !pageStack.length) document.body.style.overflow = '';
}
function confirmSheet({ title, text, ok = 'OK', danger = false }) {
  return new Promise((resolve) => {
    let done = false;
    openSheet({
      st: {}, onClose: () => { if (!done) resolve(false); },
      render: () => ({
        title, body: '<p style="margin:0 0 6px">' + esc(text) + '</p>',
        foot: '<div class="btnrow"><button class="btn ghost" data-act="closeSheet">Cancel</button><button class="btn ' + (danger ? 'danger' : '') + '" data-act="confirmOk">' + esc(ok) + '</button></div>'
      })
    });
    curSheet().ok = () => { done = true; closeSheet(); resolve(true); };
  });
}
let toastTimer = null;
function toast(msg, opts = {}) {
  $$('.toast').forEach((t) => t.remove());
  const el = document.createElement('div'); el.className = 'toast'; el.setAttribute('role', 'status');
  el.innerHTML = '<span>' + esc(msg) + '</span>' + (opts.action ? '<button>' + esc(opts.action) + '</button>' : '');
  if (opts.action) el.querySelector('button').onclick = () => { el.remove(); opts.fn && opts.fn(); };
  document.body.appendChild(el);
  clearTimeout(toastTimer); toastTimer = setTimeout(() => el.remove(), opts.ms || (opts.action ? 6000 : 3200));
}
function openViewer(url) {
  const el = document.createElement('div'); el.className = 'viewer';
  el.innerHTML = '<img alt="Patient label photo" src="' + esc(url) + '"><button class="xbtn" aria-label="Close">' + svg(I.x, 2.2) + '</button>';
  el.onclick = (e) => { if (e.target.tagName !== 'IMG') el.remove(); };
  document.body.appendChild(el);
}

/* ---------------- Small UI helpers ---------------- */
const chip = (label, on, act, attrs = '') => '<button class="chip' + (on ? ' on' : '') + '" data-act="' + act + '" ' + attrs + '>' + esc(label) + '</button>';
const seg = (opts, cur, act) => '<div class="seg">' + opts.map(([v, l]) => '<button class="' + (v === cur ? 'on' : '') + '" data-act="' + act + '" data-v="' + esc(v) + '">' + esc(l) + '</button>').join('') + '</div>';
const bar = (frac, pace) => '<div class="bar"><i style="width:' + (clamp(frac, 0, 1) * 100).toFixed(1) + '%"></i>' + (pace != null ? '<u style="left:' + (clamp(pace, 0, 1) * 100).toFixed(1) + '%"></u>' : '') + '</div>';
const searchBox = (val, inName, ph) => '<div class="search">' + svg(I.search) + '<input type="search" data-in="' + inName + '" value="' + esc(val) + '" placeholder="' + esc(ph) + '" autocomplete="off"></div>';
const thumb = (p) => '<img class="thumb" data-pid="' + p.id + '" alt="">';
const codesHTML = (codes) => '<div class="codes">' + codes.map((c) => '<span class="code">' + esc(c) + '</span>').join('') + '</div>';
const cmark = (ok) => '<span class="cmark' + (ok ? ' ok' : '') + '">' + (ok ? svg(I.check, 3) : '') + '</span>';
function spark(vals, w = 128, h = 40, cum = false) {
  if (!vals.length) return '';
  let v = vals.slice(); if (cum) { let a = 0; v = v.map((x) => (a += x)); }
  const mx = Math.max(1, ...v); const step = w / Math.max(1, v.length - 1);
  const pts = v.map((x, i) => [i * step, h - 4 - (x / mx) * (h - 10)]);
  const d = pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ');
  const last = pts[pts.length - 1];
  return '<svg class="spark" viewBox="0 0 ' + w + ' ' + h + '" preserveAspectRatio="none"><path d="' + d + '" fill="none" stroke="var(--c)" stroke-width="2" stroke-linejoin="round" vector-effect="non-scaling-stroke"/><circle cx="' + last[0].toFixed(1) + '" cy="' + last[1].toFixed(1) + '" r="3" fill="var(--c)"/></svg>';
}
function colChart(vals, labels, capFn) {
  const W = 340, H = 140, base = 118, n = vals.length, gap = 4;
  const bw = (W - gap * (n - 1)) / n, mx = Math.max(1, ...vals);
  const iMax = vals.indexOf(Math.max(...vals));
  let s = '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Column chart">';
  s += '<line x1="0" x2="' + W + '" y1="' + base + '" y2="' + base + '" stroke="var(--line)" stroke-width="1"/>';
  vals.forEach((v, i) => {
    const x = i * (bw + gap), hgt = (v / mx) * (base - 16), y = base - hgt;
    const r = Math.min(4, bw / 2, hgt);
    s += '<g data-act="colTap" data-cap="' + esc(capFn(i)) + '" style="cursor:pointer"><rect x="' + x.toFixed(1) + '" y="0" width="' + bw.toFixed(1) + '" height="' + base + '" fill="transparent"/>';
    if (hgt > 0) s += '<path d="M' + x.toFixed(1) + ' ' + base + 'V' + (y + r).toFixed(1) + 'q0 -' + r.toFixed(1) + ' ' + r.toFixed(1) + ' -' + r.toFixed(1) + 'H' + (x + bw - r).toFixed(1) + 'q' + r.toFixed(1) + ' 0 ' + r.toFixed(1) + ' ' + r.toFixed(1) + 'V' + base + 'z" fill="var(--acc)"/>';
    if (i === iMax || i === n - 1) s += '<text x="' + (x + bw / 2).toFixed(1) + '" y="' + (y - 4).toFixed(1) + '" text-anchor="middle" font-size="11" fill="var(--ink)" font-weight="600">' + v + '</text>';
    if (n <= 12 || i % 2 === 0) s += '<text x="' + (x + bw / 2).toFixed(1) + '" y="' + (H - 6) + '" text-anchor="middle" font-size="10.5" fill="var(--muted)">' + esc(labels[i]) + '</text>';
    s += '</g>';
  });
  return '<div class="colchart">' + s + '</svg><div class="cap">Tap a column to see its value.</div></div>';
}
function hbars(rows, max) {
  const mx = max || Math.max(1, ...rows.map((r) => r.v));
  return '<div class="hbars">' + rows.map((r) => '<div class="hb"><div class="l">' + (r.b ? '<b>' + esc(r.b) + '</b>' : '') + esc(r.l) + '</div><div class="v">' + esc(r.vt != null ? r.vt : r.v) + '</div>' + bar(r.v / mx) + '</div>').join('') + '</div>';
}

/* ---------------- Welcome ---------------- */
function viewWelcome() {
  const h = S.settings.hospitals[0] || {};
  return '<div class="welcome" data-mod="bill"><div class="mark">' + LOGO + '</div><h1>Caring Intensively</h1>' +
    '<p class="lead">ICU billing, an ECMO logbook and CICM CPD tracking for ' + esc(S.settings.name) + ', in your pocket.</p>' +
    '<div class="field"><label for="w-name">Your name as it appears on billing forms</label><input id="w-name" type="text" data-in="set" data-k="name" value="' + esc(S.settings.name) + '"></div>' +
    '<div class="two"><div class="field"><label for="w-h">Hospital</label><input id="w-h" type="text" data-in="hosp" data-i="0" data-k="name" value="' + esc(h.name || '') + '"></div>' +
    '<div class="field"><label for="w-p">Provider number</label><input id="w-p" type="text" data-in="hosp" data-i="0" data-k="provider" value="' + esc(h.provider || '') + '"></div></div>' +
    '<button class="btn block" data-act="startEmpty">Start with an empty logbook</button>' +
    '<button class="btn ghost block mt" data-act="startDemo">Explore with 12 months of sample data</button>' +
    '<p class="note mt">Everything stays on this phone. Nothing is uploaded and there is no account to create.</p></div>';
}

/* ---------------- Home ---------------- */
function viewHome() {
  const t = today(), now = new Date(), h = now.getHours();
  const greet = h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening';
  const first = (S.settings.name || '').replace(/^Dr\.?\s+/i, '').split(' ')[0] || 'there';
  const dateStr = DOW[now.getDay()] + 'day'.replace('day', '') ;
  const full = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][now.getDay()] + ' ' + now.getDate() + ' ' + MONTH_FULL[now.getMonth()];
  return '<div class="topbar"><div class="brand">' + LOGO + '<span class="wordmark">Caring Intensively</span></div><div class="sp"></div><button class="iconbtn" data-act="settings" aria-label="Settings">' + svg(I.gear) + '</button></div>' +
    '<div class="greet"><div class="d">' + full + '</div><div class="h">' + greet + ', ' + esc(first) + '</div></div>' +
    banners() + monitorPanel() + toBillToday() +
    '<div class="sec"><h2>Log something</h2></div><div class="actions">' +
    '<button class="qa" data-mod="bill" data-act="newPatient">' + svg(I.camera) + '<span>New patient</span></button>' +
    '<button class="qa" data-mod="ecmo" data-act="ecmoPicker">' + svg(I.ecmo) + '<span>Log ECMO</span></button>' +
    '<button class="qa" data-mod="cpd" data-act="cpdNew">' + svg(I.pen) + '<span>Log CPD</span></button></div>' +
    insightsBlock() +
    '<p class="note mt2">Your records are stored only on this phone. ' + (S.settings.lastBackup ? 'Last backup ' + relDayLc(S.settings.lastBackup.slice(0, 10)) + '.' : 'Back up regularly from Settings.') + '</p>';
}
function banners() {
  let s = '';
  if (S.settings.demo) s += '<div class="banner demo"><div class="main"><b>Sample data.</b> This is 12 months of made-up records to show what Caring Intensively looks like in use.</div><button class="btn sm ghost" data-act="clearDemo">Clear</button></div>';
  if (!STANDALONE && !SANDBOXED && !S.settings.installTipHidden) s += '<div class="banner"><div class="main">' + (IS_IOS ? 'Add Caring Intensively to your Home Screen: tap Share, then <b>Add to Home Screen</b>. It opens like an app and keeps your data safe from Safari clean-ups.' : 'Install Caring Intensively from your browser menu (Add to Home screen) so it opens like an app.') + '</div><button class="xbtn" data-act="hideInstall" aria-label="Dismiss">' + svg(I.x, 2.2) + '</button></div>';
  return s;
}
function monitorPanel() {
  const t = today();
  const wk = [weekStart(t), t];
  const wkDays = S.days.filter((d) => d.date >= wk[0] && d.date <= wk[1]).length;
  const daily = []; for (let i = 27; i >= 0; i--) { const d = addDays(t, -i); daily.push(S.days.filter((x) => x.date === d).length); }
  const act = activePatients().length, unb = unbilledToday().length;
  const prog = ecmoProgress(); const withT = prog.filter((p) => p.target); const met = withT.filter((p) => p.met).length;
  const cann = prog.find((p) => p.id === 'cannulation');
  const weekly = []; for (let i = 25; i >= 0; i--) { const s0 = addDays(weekStart(t), -7 * i), e0 = addDays(s0, 6); weekly.push(S.ecmo.filter((e) => e.date >= s0 && e.date <= e0).length); }
  const P = cpdProgress();
  const diff = P.total - P.expected;
  const pace = Math.abs(diff) < 0.5 ? 'On pace' : (diff > 0 ? fmtH(diff) + ' h ahead of pace' : fmtH(-diff) + ' h behind pace');
  return '<div class="monitor">' +
    '<button class="ch bill" data-act="tab" data-tab="billing"><div class="lab">Billing</div><div class="big">' + wkDays + '<small>this week</small></div><div class="unit">patient-days billed</div>' +
    '<div class="side">' + spark(daily) + '<div class="stat"><b>' + act + '</b> active, <b>' + unb + '</b> to bill today</div></div></button>' +
    '<button class="ch ecmo" data-act="tab" data-tab="ecmo"><div class="lab">ECMO</div><div class="big">' + (cann ? cann.n : 0) + '<small>cannulations</small></div><div class="unit">' + esc(ECMO_PERIOD_LABELS[S.settings.ecmoPeriod.mode] || 'Last 12 months').toLowerCase() + '</div>' +
    '<div class="side">' + spark(weekly) + '<div class="stat"><b>' + met + '</b> of ' + withT.length + ' targets met</div></div></button>' +
    '<button class="ch cpd" data-act="tab" data-tab="cpd"><div class="lab">CPD</div><div class="big">' + fmtH(P.total) + '<small>of ' + fmtH(P.T.total) + ' h</small></div><div class="unit">hours logged in ' + P.year + '</div>' +
    '<div class="side"><div></div><div class="stat"><b>' + esc(pace) + '</b><br>' + daysLeftInYear() + ' days left</div></div>' +
    '<div class="mbar"><i style="width:' + (clamp(P.total / P.T.total, 0, 1) * 100).toFixed(1) + '%"></i><u style="left:' + (clamp(P.expected / P.T.total, 0, 1) * 100).toFixed(1) + '%"></u></div></button>' +
    '</div>';
}
const relDayLc = (d) => { const r = relDay(d); return ['Today', 'Yesterday', 'Tomorrow'].includes(r) ? r.toLowerCase() : r; };
const patientSub = (p) => [S.settings.hospitals.length > 1 ? hospitalById(p.hospital).name : '', wardBedShort(patientLoc(p)), p.fund, p.status === 'active' && p.admitted ? 'day ' + (daysBetween(p.admitted, today()) + 1) : ''].filter(Boolean).join(', ');
const daysLeftInYear = () => daysBetween(today(), today().slice(0, 4) + '-12-31');
function toBillToday() {
  const act = activePatients(), unb = unbilledToday();
  let s = '<div class="sec"><h2>Today’s billing</h2><div class="sp"></div>' + (act.length ? '<button class="link" data-act="tab" data-tab="billing">All patients</button>' : '') + '</div>';
  if (!act.length) return s + '<div class="group"><div class="empty"><b>No active patients</b>Photograph a patient label to start billing.<div class="mt"><button class="btn" data-act="newPatient">' + svg(I.camera) + 'New patient</button></div></div></div>';
  if (!unb.length) return s + '<div class="group"><div class="row">' + cmark(true) + '<div class="main"><div class="t">All ' + plural(act.length, 'active patient') + ' billed for today</div><div class="s">Open Patients to add more items</div></div></div></div>';
  return s + '<div class="group">' + unb.map((p) => '<div class="row tap" data-act="patient" data-pid="' + p.id + '">' + thumb(p) + '<div class="main"><div class="t">' + esc(patientName(p)) + '</div><div class="s">' + esc(patientSub(p)) + '</div></div><button class="btn sm" data-act="bill" data-pid="' + p.id + '">Bill</button></div>').join('') + '</div>';
}
function insights() {
  const out = [];
  const unsent = S.days.filter((d) => !d.sent);
  if (unsent.length) out.push({ mod: 'bill', text: plural(unsent.length, 'patient-day') + ' ' + (unsent.length === 1 ? 'hasn’t' : 'haven’t') + ' been sent to your secretary yet.', act: 'repUnsent', label: 'Review and send' });
  const [ma, mb] = rangeFor('month');
  let st = billingStats(ma, mb), when = 'this month';
  if (!st.nDays) { const r = rangeFor('30d'); st = billingStats(r[0], r[1]); when = 'in the last 30 days'; }
  const top = Object.entries(st.itemCount).sort((a, b) => b[1] - a[1])[0];
  if (top) out.push({ mod: 'bill', text: top[0] + ' (' + itemLabel(top[0]).toLowerCase() + ') is your most-billed item ' + when + ', ' + plural(top[1], 'time') + '.' });
  if (st.nDays) out.push({ mod: 'bill', text: 'Estimated billing ' + when + ': ' + fmtMoney(st.est) + ' across ' + plural(st.nDays, 'patient-day') + ', at ' + (st.custom ? 'MBS rates with your own rates where set' : 'MBS schedule rates') + '.' });
  const y12 = rangeFor('12m'); const st12 = billingStats(y12[0], y12[1]);
  if (st12.avgLOS) out.push({ mod: 'bill', text: 'Patients stayed under your care for ' + st12.avgLOS.toFixed(1) + ' days on average over the last 12 months, across ' + plural(st12.nPatients, 'patient') + '.' });
  const P = cpdProgress();
  const diff = P.total - P.expected;
  if (P.total < P.T.total) out.push({ mod: 'cpd', text: diff < -1 ? 'You’re ' + fmtH(-diff) + ' CPD hours behind pace for ' + P.year + ', with ' + daysLeftInYear() + ' days to go.' : 'CPD is on track: ' + fmtH(P.total) + ' of ' + fmtH(P.T.total) + ' hours logged for ' + P.year + '.' });
  const gap = P.checks.slice(1).find((c) => c.have < c.need);
  if (gap) out.push({ mod: 'cpd', text: gap.label + ' needs ' + fmtH(gap.need - gap.have) + ' more hours this year.' + (/outcomes|performance/i.test(gap.label) ? ' M&M, audits, QA meetings and peer review all count.' : '') });
  const missing = CAPE.filter((c) => !P.cape[c.id]);
  if (missing.length) out.push({ mod: 'cpd', text: 'No CPD activity this year is tagged for ' + missing.map((c) => c.name.toLowerCase()).join(', ') + '. CICM expects at least one for each.' });
  if (!P.pdp) out.push({ mod: 'cpd', text: 'Your ' + P.year + ' professional development plan isn’t logged yet. It’s mandatory and counts for up to 3 hours.' });
  if (P.notLogged) out.push({ mod: 'cpd', text: plural(P.notLogged, 'CPD activity', 'CPD activities') + ' from ' + P.year + ' ' + (P.notLogged === 1 ? 'isn’t' : 'aren’t') + ' marked as entered in your CICM portal diary.' });
  if (!P.shlr) out.push({ mod: 'cpd', text: 'The airway management SHLR course is due by 31 December ' + P.triennium[1] + ' (in person, at least 3 hours).' });
  const prog = ecmoProgress();
  prog.filter((p) => p.target && !p.met).forEach((p) => out.push({ mod: 'ecmo', text: 'ECMO ' + lcName(p.name) + ': ' + p.n + ' of ' + p.target + ' for ' + (ECMO_PERIOD_LABELS[S.settings.ecmoPeriod.mode] || '').toLowerCase() + '.' }));
  const lastCann = S.ecmo.filter((e) => e.type === 'cannulation').sort((a, b) => a.date < b.date ? 1 : -1)[0];
  if (lastCann) out.push({ mod: 'ecmo', text: 'Your last ECMO cannulation was ' + plural(daysBetween(lastCann.date, today()), 'day') + ' ago (' + [lastCann.mode, lastCann.role].filter(Boolean).join(', ').toLowerCase() + ').' });
  const hasData = S.days.length + S.cpd.length + S.ecmo.length > 0;
  const lb = S.settings.lastBackup;
  if (hasData && !S.settings.demo && (!lb || daysBetween(lb.slice(0, 10), today()) > 30)) out.push({ mod: 'bill', text: lb ? 'Your last backup was ' + plural(daysBetween(lb.slice(0, 10), today()), 'day') + ' ago.' : 'You haven’t backed up yet. A backup file protects your records if this phone is lost.', act: 'backup', label: 'Back up now' });
  return out;
}
function insightsBlock() {
  const list = insights();
  if (!list.length) return '';
  return '<div class="sec"><h2>Insights</h2></div><div class="group">' + list.slice(0, 8).map((i) => '<div class="ins" data-mod="' + i.mod + '"><span class="bullet"></span><div class="main">' + esc(i.text) + (i.act ? '<div><button class="btn sm soft" data-act="' + i.act + '">' + esc(i.label) + '</button></div>' : '') + '</div></div>').join('') + '</div>';
}

/* ---------------- Billing tab ---------------- */
function viewBilling() {
  const n = activePatients().length;
  let s = '<div class="topbar"><h1>Patients</h1><div class="sp"></div><button class="iconbtn" data-act="settings" aria-label="Settings">' + svg(I.gear) + '</button></div>';
  s += seg([['active', 'Active (' + n + ')'], ['history', 'History'], ['stats', 'Insights']], UI.billSeg, 'billSeg');
  if (UI.billSeg === 'history') return s + viewHistory();
  if (UI.billSeg === 'stats') return s + viewBillStats();
  s += '<div class="btnrow"><button class="btn" data-act="newPatient">' + svg(I.camera) + 'New patient</button><button class="btn ghost" data-act="newPatientNoPhoto">Add without photo</button></div>';
  const act = activePatients().slice().sort((a, b) => {
    const ua = dayFor(a.id, today()) ? 1 : 0, ub = dayFor(b.id, today()) ? 1 : 0;
    if (ua !== ub) return ua - ub;
    return ((a.ward || '') + ' ' + (a.bed || '')).localeCompare((b.ward || '') + ' ' + (b.bed || ''), undefined, { numeric: true });
  });
  if (!act.length) return s + '<div class="group mt"><div class="empty"><b>No active patients</b>Take a photo of a patient label to add them. They stay on this list until you discharge them, so each new day is a couple of taps.</div></div>';
  s += '<div class="group mt">' + act.map((p) => {
    const billed = dayFor(p.id, today());
    return '<div class="row tap" data-act="patient" data-pid="' + p.id + '">' + thumb(p) + '<div class="main"><div class="t">' + esc(patientName(p)) + '</div><div class="s">' + esc(patientSub(p)) + '</div></div>' +
      (billed ? '<span class="pill ok">' + svg(I.check, 3).replace('<svg', '<svg width="13" height="13"') + 'Today</span>' : '<button class="btn sm" data-act="bill" data-pid="' + p.id + '">Bill</button>') + '</div>';
  }).join('') + '</div>';
  s += '<p class="note">Tap a patient to see their days of care, bill another day, or discharge them.</p>';
  return s;
}
function viewHistory() {
  const H = UI.hist;
  const funds = Array.from(new Set(S.patients.map((p) => p.fund).filter(Boolean))).sort();
  return searchBox(H.q, 'histQ', 'Search name, UR, item, fund, diagnosis') +
    '<div class="chips scroll">' + ['30d', 'week', 'month', 'lastmonth', '90d', '12m', 'all'].map((k) => chip(RANGE_LABELS[k], H.range === k, 'histRange', 'data-v="' + k + '"')).join('') + '</div>' +
    '<div class="two mt"><select data-ch="histFund" aria-label="Health fund"><option value="">All funds</option>' + funds.map((f) => '<option' + (H.fund === f ? ' selected' : '') + '>' + esc(f) + '</option>').join('') + '</select>' +
    '<select data-ch="histStatus" aria-label="Sent status"><option value="">Sent and unsent</option><option value="unsent"' + (H.status === 'unsent' ? ' selected' : '') + '>Not yet sent</option><option value="sent"' + (H.status === 'sent' ? ' selected' : '') + '>Sent</option></select></div>' +
    '<div class="mt">' + seg([['date', 'By date'], ['patient', 'By patient']], H.group, 'histGroup') + '</div>' +
    '<div id="histResults">' + histResults() + '</div>';
}
function histFiltered() {
  const H = UI.hist; const [a, b] = rangeFor(H.range);
  let days = S.days.filter((d) => d.date >= a && d.date <= b);
  if (H.fund) days = days.filter((d) => (patientById(d.pid) || {}).fund === H.fund);
  if (H.status === 'unsent') days = days.filter((d) => !d.sent); else if (H.status === 'sent') days = days.filter((d) => d.sent);
  const q = norm(H.q.trim());
  if (q) days = days.filter((d) => dayMatches(d, q));
  return days.sort((x, y) => x.date < y.date ? 1 : x.date > y.date ? -1 : patientName(patientById(x.pid)).localeCompare(patientName(patientById(y.pid))));
}
function histResults() {
  const H = UI.hist; const days = histFiltered();
  const pids = Array.from(new Set(days.map((d) => d.pid)));
  let s = '<div class="sec"><div class="small muted">' + plural(days.length, 'patient-day') + ', ' + plural(pids.length, 'patient') + '</div><div class="sp"></div>' + (days.length ? '<button class="link" data-act="repFromHistory">Report from these</button>' : '') + '</div>';
  if (!days.length) return s + '<div class="group"><div class="empty"><b>Nothing found</b>Try a wider date range or a different search.</div></div>';
  if (H.group === 'patient') {
    const rows = pids.map((id) => { const p = patientById(id); const pd = days.filter((d) => d.pid === id); return { p, pd }; }).filter((r) => r.p);
    return s + '<div class="group">' + rows.slice(0, H.limit).map(({ p, pd }) => '<div class="row tap" data-act="patient" data-pid="' + p.id + '">' + thumb(p) + '<div class="main"><div class="t">' + esc(patientName(p)) + '</div><div class="s">' + esc([p.fund, plural(pd.length, 'day'), fmtDate(pd[pd.length - 1].date, { dow: false }) + (pd.length > 1 ? ' to ' + fmtDate(pd[0].date, { dow: false }) : '')].filter(Boolean).join(', ')) + '</div></div>' + (p.status === 'active' ? '<span class="pill acc">Active</span>' : '') + '</div>').join('') + '</div>' + more(rows.length);
  }
  let out = '', lastDate = '', shown = 0;
  for (const d of days) {
    if (shown >= H.limit) break;
    if (d.date !== lastDate) { if (lastDate) out += '</div>'; out += '<div class="small muted" style="margin:14px 2px 6px;font-weight:650">' + esc(relDay(d.date)) + (relDay(d.date) !== fmtDate(d.date) ? ', ' + esc(fmtDate(d.date)) : '') + '</div><div class="group">'; lastDate = d.date; }
    const p = patientById(d.pid) || {};
    out += '<div class="row tap" data-act="openDay" data-id="' + d.id + '"><div class="main"><div class="t">' + esc(patientName(p)) + '</div>' + codesHTML(dayAllCodes(d)) + '</div><span class="dot ' + (d.sent ? 'ok' : 'warn') + '" title="' + (d.sent ? 'Sent' : 'Not sent') + '"></span></div>';
    shown++;
  }
  return s + out + '</div>' + more(days.length) + '<p class="note"><span class="dot ok"></span> sent to secretary &nbsp; <span class="dot warn"></span> not yet sent</p>';
}
const more = (n) => n > UI.hist.limit ? '<button class="btn ghost block mt" data-act="histMore">Show more (' + (n - UI.hist.limit) + ')</button>' : '';

function viewBillStats() {
  const k = UI.statsRange; const [a, b] = rangeFor(k);
  const st = billingStats(a, b);
  let s = '<div class="chips scroll">' + ['30d', '90d', '12m', 'year', 'fy', 'all'].map((r) => chip(RANGE_LABELS[r], k === r, 'statsRange', 'data-v="' + r + '"')).join('') + '</div>';
  s += '<div class="kpis mt"><div class="kpi"><div class="v">' + st.nDays + '</div><div class="k">patient-days billed</div></div><div class="kpi"><div class="v">' + st.nPatients + '</div><div class="k">patients</div></div>' +
    '<div class="kpi"><div class="v">' + st.nItems + '</div><div class="k">items billed</div></div><div class="kpi"><div class="v">' + (st.nDays ? (st.nItems / st.nDays).toFixed(1) : '–') + '</div><div class="k">items per patient-day</div></div>' +
    (st.avgLOS ? '<div class="kpi"><div class="v">' + st.avgLOS.toFixed(1) + '</div><div class="k">days under your care, average</div></div>' : '') +
    '<div class="kpi"><div class="v">' + st.unsent + '</div><div class="k">patient-days not yet sent</div></div>' +
    '<div class="kpi" style="grid-column:1 / -1"><div class="v">' + fmtMoney(st.est) + '</div><div class="k">estimated fees at ' + (st.custom ? 'MBS schedule rates, with your own rates where set' : 'MBS schedule rates') + (st.nDays ? ', about ' + fmtMoney(st.est / st.nDays) + ' per patient-day' : '') + '</div></div></div>';
  // monthly trend
  const months = []; const ref = fromISO(monthStart(today()));
  for (let i = 11; i >= 0; i--) { const d = new Date(ref.getFullYear(), ref.getMonth() - i, 1); months.push(toISO(d)); }
  const mv = months.map((m) => S.days.filter((d) => d.date >= m && d.date <= monthEnd(m)).length);
  s += '<div class="sec"><h2>Patient-days per month</h2></div><div class="card">' + colChart(mv, months.map((m) => MON[fromISO(m).getMonth()].slice(0, 1) === 'J' ? MON[fromISO(m).getMonth()].slice(0, 3) : MON[fromISO(m).getMonth()].slice(0, 3)), (i) => MONTH_FULL[fromISO(months[i]).getMonth()] + ' ' + fromISO(months[i]).getFullYear() + ': ' + plural(mv[i], 'patient-day')) + '</div>';
  const items = Object.entries(st.itemCount).sort((x, y) => y[1] - x[1]).slice(0, 12);
  s += '<div class="sec"><h2>Items you bill most</h2></div><div class="card">' + (items.length ? hbars(items.map(([c, v]) => ({ b: c, l: itemLabel(c) || modifierLabel(c), v }))) : '<div class="empty">No billing in this period.</div>') + '</div>';
  const funds = Object.entries(st.fundCount).sort((x, y) => y[1] - x[1]).slice(0, 10);
  s += '<div class="sec"><h2>Patients by health fund</h2></div><div class="card">' + (funds.length ? hbars(funds.map(([f, v]) => ({ l: f, v, vt: v + ' (' + Math.round(v / Math.max(1, st.nPatients) * 100) + '%)' }))) : '<div class="empty">No patients in this period.</div>') + '</div>';
  s += '<p class="note">Estimates use the MBS schedule fee from 1 July 2026 unless you set your own rate for an item in Settings. They don’t apply the multiple-operation rule or any gap charged.</p>';
  return s;
}

/* ---------------- Patient page ---------------- */
function openPatient(pid) {
  openPage((pg) => {
    const p = patientById(pid);
    if (!p) { setTimeout(closePage, 0); return ''; }
    const days = daysFor(pid); const td = dayFor(pid, today());
    const hosp = hospitalById(p.hospital);
    const facts = [['Health fund', p.fund], ['Ward and bed', wardBed(patientLoc(p))], ['UR', p.ur], ['Admitted', p.admitted ? fmtDate(p.admitted) + (p.status === 'active' ? ', day ' + (daysBetween(p.admitted, today()) + 1) : '') : ''], ['Referring doctor', p.refDoc], ['Hospital', hosp.name + (hosp.provider ? ' (' + hosp.provider + ')' : '')]];
    return pageHead('Back', patientName(p), '<button class="back" style="justify-content:flex-end" data-act="editPatient" data-pid="' + pid + '">Edit</button>') +
      (p.photoId || p.demoLabel ? '<img class="photo" data-pid="' + pid + '" data-act="viewPhoto" alt="Patient label">' : '<button class="photo none" data-act="addPhoto" data-pid="' + pid + '">No label photo. Tap to add one.</button>') +
      '<div class="facts">' + facts.map(([k, v]) => '<div><small>' + k + '</small><span>' + esc(v || '–') + '</span></div>').join('') + '<div class="wide"><small>Admission diagnosis</small><span>' + esc(p.dx || '–') + '</span></div></div>' +
      (p.status === 'active' ? '<div class="btnrow"><button class="btn" data-act="bill" data-pid="' + pid + '">' + (td ? 'Edit today’s items' : 'Bill today') + '</button><button class="btn ghost" data-act="billOther" data-pid="' + pid + '">Another day</button></div>' +
        '<button class="btn ghost block mt" data-act="discharge" data-pid="' + pid + '">Discharge from my list</button>'
        : '<div class="banner"><div class="main">Discharged ' + esc(fmtDate(p.dischargedAt || '')) + '.</div><button class="btn sm ghost" data-act="readmit" data-pid="' + pid + '">Return to active</button></div><button class="btn ghost block" data-act="billOther" data-pid="' + pid + '">Add a day of care</button>') +
      '<div class="sec"><h2>Days of care</h2><div class="sp"></div><span class="small muted">' + plural(days.length, 'day') + (days.length ? ', about ' + fmtMoney(sum(days, dayFee)) : '') + '</span></div>' +
      (days.length ? '<div class="group">' + days.map((d, i) => '<div class="row tap" data-act="openDay" data-id="' + d.id + '"><div class="main"><div class="t">' + esc(fmtDate(d.date)) + '</div><div class="s">' + esc(locText(dayLoc(d))) + (days[i + 1] && !sameLoc(dayLoc(days[i + 1]), dayLoc(d)) ? ' (moved)' : '') + '</div>' + codesHTML(dayAllCodes(d)) + (d.note ? '<div class="s wrap">' + esc(d.note) + '</div>' : '') + '</div>' + (d.sent ? '<span class="pill ok">Sent</span>' : '<span class="pill warn">Not sent</span>') + '</div>').join('') + '</div>'
        : '<div class="group"><div class="empty">No billing recorded yet.</div></div>') +
      '<button class="btn ghost block mt" data-act="patientReport" data-pid="' + pid + '">Billing sheet for a day or the whole stay</button>';
  }, { mod: 'bill' });
}

/* ---------------- Patient form ---------------- */
const fileHandlers = {};
function pickPhoto(kind, fn) { fileHandlers[kind] = fn; const inp = $(kind === 'cam' ? '#camIn' : '#libIn'); inp.value = ''; inp.click(); }
async function onFile(kind, file) {
  if (!file) return;
  try {
    const blob = await downscaleImage(file);
    const fn = fileHandlers[kind]; fileHandlers[kind] = null;
    if (fn) fn(blob); else openPatientForm({ photoBlob: blob });
  }
  catch (e) { toast(e.message || 'Could not read that photo'); }
}
function openPatientForm(opts = {}) {
  const ex = opts.pid ? patientById(opts.pid) : null;
  const st = ex ? { ...ex, photoBlob: null } : {
    name: '', ur: '', fund: '', hospital: S.settings.defaultHospital || (S.settings.hospitals[0] || {}).id,
    ward: 'ICU', bed: '', refDoc: '', dx: '', admitted: today(), photoBlob: opts.photoBlob || null
  };
  if (st.ward == null) st.ward = 'ICU';
  st.edit = !!ex; st.moreFunds = false; st.addFund = ''; st.addingHosp = !S.settings.hospitals.length; st.newHospName = ''; st.newHospProv = '';
  st.ocr = { status: 'idle', lines: [], filled: {} };
  if (st.photoBlob) st.photoURL = URL.createObjectURL(st.photoBlob);
  const sh = openSheet({ mod: 'bill', tall: true, st, render: patientFormSheet });
  if (st.photoBlob) runOcr(sh);
  return sh;
}
function fundChipsHTML(s) {
  const ranked = fundsRanked(); const top = ranked.slice(0, 9);
  if (s.fund && !top.includes(s.fund)) top.push(s.fund);
  const list = s.moreFunds ? ranked : top;
  return list.map((f) => chip(f, s.fund === f, 'pfFund', 'data-v="' + esc(f) + '"')).join('') + (s.moreFunds ? '' : '<button class="chip add" data-act="pfMoreFunds">More funds</button>');
}
function ocrBoxHTML(s) {
  const o = s.ocr || {};
  if (o.status === 'reading') return '<div class="ocrbox"><span class="spin"></span><div class="main"><b>Reading the label…</b> <span id="ocrPct">' + Math.round((o.progress || 0) * 100) + '%</span><div class="small muted">This happens on the phone; the photo isn’t sent anywhere.</div></div></div>';
  if (o.status === 'failed') return '<div class="ocrbox warn"><div class="main"><b>The label couldn’t be read here.</b><div class="small">' + esc(o.error || '') + ' Type the details instead.</div></div></div>';
  if (o.status !== 'done') return '';
  const got = Object.keys(o.filled || {}).map((k) => ({ name: 'name', ur: 'UR', fund: 'health fund', refDoc: 'referring doctor' }[k]));
  const lines = (o.lines || []).slice(0, 14).map((l, i) => '<div class="ocrline"><span>' + esc(l) + '</span><button class="chip" data-act="ocrUse" data-k="name" data-i="' + i + '">Name</button><button class="chip" data-act="ocrUse" data-k="ur" data-i="' + i + '">UR</button></div>').join('');
  if (got.length && s.ocrConfirmed) return '<div class="ocrbox ok"><div class="main"><b>Checked against the sticker.</b><div class="small">You can still type over any field before saving.</div></div></div>';
  return '<div class="ocrbox' + (got.length ? ' ok' : ' warn') + '"><div class="main"><b>' + (got.length ? 'Check these details match the sticker' : 'Couldn’t pick out a name or UR.') + '</b><div class="small">' + (got.length ? 'Read from the photo: ' + got.join(', ') + ' (highlighted below). If anything is wrong or hard to read, tap the field and type over it.' : 'Tap a line below to use it, retake the photo closer, or type the details.') + '</div>' +
    (got.length ? '<button class="btn sm block mt" data-act="ocrConfirm">The details match the sticker</button>' : '') +
    (lines ? '<details' + (got.length ? '' : ' open') + '><summary>Text read from the label</summary>' + lines + '</details>' : '') + '</div></div>';
}
function patientFormSheet(s) {
  const ex = s.edit ? patientById(s.id) : null;
  const refs = Array.from(new Set(S.patients.map((p) => p.refDoc).filter(Boolean))).sort();
  const dxs = Array.from(new Set(S.patients.map((p) => p.dx).filter(Boolean))).sort();
  const auto = (k) => s.ocr && s.ocr.filled && s.ocr.filled[k] ? ' auto' : '';
  const photo = s.photoURL ? '<img class="photo" src="' + esc(s.photoURL) + '" alt="Label photo">' : (ex && (ex.photoId || ex.demoLabel) ? '<img class="photo" data-pid="' + ex.id + '" alt="Label photo">' : '<div class="photo none">No label photo</div>');
  const wards = wardsRanked(); if (s.ward && !wards.includes(s.ward)) wards.push(s.ward);
  const body = photo +
    '<div class="btnrow mt"><button class="btn sm ghost" data-act="pfPhoto" data-v="cam">' + svg(I.camera) + (s.photoURL || (ex && ex.photoId) ? 'Retake' : 'Take photo') + '</button><button class="btn sm ghost" data-act="pfPhoto" data-v="lib">' + svg(I.image) + 'Choose photo</button>' +
    (s.photoBlob ? '<button class="btn sm ghost" data-act="pfRead">Read label</button>' : '') + '</div>' +
    '<div id="ocrBox" class="mt">' + ocrBoxHTML(s) + '</div>' +
    '<div class="field mt"><label for="pf-n">Patient name</label><input id="pf-n" class="' + auto('name') + '" type="text" data-in="f" data-k="name" value="' + esc(s.name) + '" placeholder="Surname, first name" autocapitalize="words"></div>' +
    '<div class="field"><label for="pf-u">UR / MRN</label><input id="pf-u" class="' + auto('ur') + '" type="text" data-in="f" data-k="ur" value="' + esc(s.ur) + '"></div>' +
    '<div class="field"><span class="flabel">Hospital</span><div class="chips">' + S.settings.hospitals.map((h) => chip(h.name, s.hospital === h.id, 'pfHosp', 'data-v="' + h.id + '"')).join('') +
    (s.addingHosp ? '' : '<button class="chip add" data-act="pfHospAdd">Add hospital</button>') + '</div>' +
    (s.addingHosp ? '<div class="panel"><div class="two"><input type="text" data-in="f" data-k="newHospName" placeholder="Hospital name" value="' + esc(s.newHospName) + '"><input type="text" data-in="f" data-k="newHospProv" placeholder="Provider number" autocapitalize="characters" value="' + esc(s.newHospProv) + '"></div><button class="btn sm block mt" data-act="pfHospSave">Add hospital</button></div>' : '') +
    (s.hospital ? '<div class="hint">Provider number ' + esc(hospitalById(s.hospital).provider || 'not set') + '</div>' : '') + '</div>' +
    '<div class="field"><span class="flabel">Ward</span><div class="chips">' + wards.map((w) => chip(w, s.ward === w, 'pfWard', 'data-v="' + esc(w) + '"')).join('') + '</div>' +
    '<div class="two mt"><input type="text" data-in="f" data-k="ward" value="' + esc(s.ward) + '" placeholder="Or type a ward" aria-label="Ward"><input id="pf-b" type="text" data-in="f" data-k="bed" value="' + esc(s.bed) + '" placeholder="Bed, e.g. 4" aria-label="Bed space"></div></div>' +
    '<div class="field"><span class="flabel">Health fund</span><div class="chips" id="pfFunds">' + fundChipsHTML(s) + '</div>' +
    (s.moreFunds ? '<div class="two mt"><input type="text" data-in="f" data-k="addFund" placeholder="Another fund" value="' + esc(s.addFund) + '"><button class="btn ghost" data-act="pfAddFund">Add fund</button></div>' : '') + '</div>' +
    '<div class="field"><label for="pf-r">Referring doctor</label><input id="pf-r" class="' + auto('refDoc') + '" type="text" list="dl-ref" data-in="f" data-k="refDoc" value="' + esc(s.refDoc) + '"><datalist id="dl-ref">' + refs.map((r) => '<option value="' + esc(r) + '">').join('') + '</datalist></div>' +
    '<div class="field"><label for="pf-d">Admission diagnosis</label><input id="pf-d" type="text" list="dl-dx" data-in="f" data-k="dx" value="' + esc(s.dx) + '"><datalist id="dl-dx">' + dxs.map((r) => '<option value="' + esc(r) + '">').join('') + '</datalist></div>' +
    '<div class="field"><label for="pf-a">Admitted to your care</label><input id="pf-a" type="date" data-in="f" data-k="admitted" value="' + esc(s.admitted) + '"></div>' +
    (s.edit ? '<p class="note">Changing the hospital, ward or bed here updates where the patient is now. Days already billed keep their own location.</p><button class="btn danger block mt" data-act="deletePatient" data-pid="' + ex.id + '">Delete patient and their billing</button>' : '');
  return {
    title: s.edit ? 'Edit patient' : 'New patient', sub: s.edit ? patientName(ex) : 'Details for billing and search', body,
    foot: s.edit ? '<button class="btn block" data-act="pfSave">Save changes</button>' : '<div class="btnrow"><button class="btn ghost" data-act="pfSave" data-v="list">Save</button><button class="btn" data-act="pfSave" data-v="bill">Save and bill today</button></div>'
  };
}
async function runOcr(sh) {
  const st = sh.st; const blob = st.photoBlob; if (!blob) return;
  st.ocr = { status: 'reading', lines: [], filled: {}, progress: 0 };
  const box = () => $('#ocrBox', sh.el);
  if (box()) box().innerHTML = ocrBoxHTML(st);
  OCR.onProgress = (p) => { if (st.ocr.status === 'reading') { st.ocr.progress = p; const el = $('#ocrPct', sh.el); if (el) el.textContent = Math.round(p * 100) + '%'; } };
  try {
    const r = await readLabel(blob);
    if (!sheetStack.includes(sh) || st.photoBlob !== blob) return;
    const f = r.fields; const filled = {};
    [['name', '#pf-n'], ['ur', '#pf-u'], ['refDoc', '#pf-r']].forEach(([k, sel]) => {
      if (f[k] && !String(st[k] || '').trim()) {
        st[k] = f[k]; filled[k] = true;
        const el = $(sel, sh.el); if (el) { el.value = f[k]; el.classList.add('auto'); }
      }
    });
    if (f.fund && !st.fund) { st.fund = f.fund; filled.fund = true; const fc = $('#pfFunds', sh.el); if (fc) fc.innerHTML = fundChipsHTML(st); }
    st.ocr = { status: 'done', lines: r.lines, filled };
  } catch (e) {
    console.warn('label reader', e);
    if (!sheetStack.includes(sh)) return;
    st.ocr = { status: 'failed', lines: [], filled: {}, error: (e && e.message) || '' };
  }
  if (box()) box().innerHTML = ocrBoxHTML(st);
}
async function savePatientForm(then) {
  const s = curSheet().st;
  if (!s.name.trim() && !s.ur.trim() && !s.photoBlob && !(s.edit && (s.photoId || s.demoLabel))) { toast('Add a name, UR or label photo so you can find this patient later.'); return; }
  if (!s.hospital || !S.settings.hospitals.find((h) => h.id === s.hospital)) { toast('Choose the hospital this patient is in.'); return; }
  if (s.ocr && Object.keys(s.ocr.filled || {}).length && !s.ocrConfirmed) { openOcrConfirm(curSheet(), then); return; }
  if (!String(s.ward || '').trim()) s.ward = 'ICU';
  let photoId = s.photoId || null;
  if (s.photoBlob) {
    photoId = await savePhoto(s.photoBlob);
    if (s.edit && s.photoId) Store.del('photos', s.photoId);
  }
  const fields = { name: s.name.trim(), ur: s.ur.trim(), fund: s.fund, hospital: s.hospital, ward: String(s.ward).trim(), bed: String(s.bed || '').trim(), refDoc: s.refDoc.trim(), dx: s.dx.trim(), admitted: s.admitted || today(), photoId };
  let pid;
  if (s.edit) { const p = patientById(s.id); Object.assign(p, fields); if (s.photoBlob) p.demoLabel = false; pid = p.id; toast('Saved changes'); }
  else { const p = { id: uid(), ...fields, status: 'active', created: new Date().toISOString() }; S.patients.push(p); pid = p.id; toast('Added ' + patientName(p) + ' to your active list'); requestPersistence(); }
  closeSheet(); changed();
  if (then === 'bill') openBill(pid, today());
}
/* Ask Denzil to confirm details read from the sticker before they are saved */
function openOcrConfirm(formSheet, then) {
  const st = formSheet.st;
  const rows = [['name', 'Patient name'], ['ur', 'UR / MRN'], ['fund', 'Health fund'], ['refDoc', 'Referring doctor']].filter(([k]) => st.ocr.filled[k]);
  openSheet({
    mod: 'bill', st: {},
    render: () => ({
      title: 'Check the sticker details', sub: 'Read automatically from your photo',
      body: (st.photoURL ? '<img class="photo" src="' + esc(st.photoURL) + '" alt="Label photo">' : '') +
        '<p class="mt" style="margin-bottom:10px">Compare these with the sticker. If anything is wrong or was hard to read, choose Edit and type over it.</p>' +
        '<div class="facts">' + rows.map(([k, l]) => '<div class="wide"><small>' + l + '</small><span>' + esc(st[k] || '\u2013') + '</span></div>').join('') + '</div>',
      foot: '<div class="btnrow"><button class="btn ghost" data-act="ocrEdit">Edit details</button><button class="btn" data-act="ocrConfirmSave" data-v="' + esc(then || '') + '">They match, save</button></div>'
    })
  });
}
function addHospital(name, provider) {
  name = String(name || '').trim(); provider = String(provider || '').trim().toUpperCase();
  if (!name || !provider) { toast('Add both the hospital name and your provider number there.'); return null; }
  if (S.settings.hospitals.some((h) => norm(h.name) === norm(name))) { toast(name + ' is already in your list.'); return null; }
  const h = { id: uid(), name, provider };
  S.settings.hospitals.push(h);
  if (!S.settings.defaultHospital) S.settings.defaultHospital = h.id;
  save();
  if (!/^\d{5,6}[0-9A-Z]{2}$/.test(provider)) toast('Added ' + name + '. Check the provider number: they’re usually 6 digits and 2 characters, like 242652BX.', { ms: 6000 });
  else toast('Added ' + name);
  return h;
}

/* ---------------- Bill a day ---------------- */
function nextDayItems(items) {
  const out = new Set();
  items.forEach((c) => { const it = ITEM_MAP[c]; if (!it) return; if (it.next) out.add(it.next); else if (it.daily) out.add(c); });
  return Array.from(out);
}
const orderCodes = (codes) => { const keys = ITEM_LIST.map((it) => it.code); return codes.slice().sort((a, b) => keys.indexOf(a) - keys.indexOf(b)); };
function openBill(pid, date) {
  const st = { pid, date: date || today(), q: '' };
  const load = () => {
    const d = dayFor(pid, st.date);
    st.existing = d || null; st.sel = new Set(d ? d.items : []);
    st.times = d && d.times ? { ...d.times } : { start: '', finish: '' }; st.asa = d ? d.asa || '' : ''; st.note = d ? d.note || '' : '';
    const p = patientById(pid);
    const prev = S.days.filter((x) => x.pid === pid && x.date < st.date).sort((a, b) => a.date < b.date ? 1 : -1)[0];
    const later = S.days.some((x) => x.pid === pid && x.date > st.date);
    st.loc = d ? { ...dayLoc(d) } : (prev && later ? { ...dayLoc(prev) } : { ...patientLoc(p) });
    st.locEdit = false;
    st.moveCurrent = !later;
  };
  load(); st.load = load;
  openSheet({ mod: 'bill', tall: true, st, render: billSheet });
}
function billItemsList(st) {
  const q = norm(st.q.trim());
  let list = ITEM_LIST.filter((it) => !it.hidden || st.sel.has(it.code));
  if (q) list = list.filter((it) => norm(it.code + ' ' + it.label + ' ' + it.mbsTitle + ' ' + it.criteria + ' ' + (it.hint || '')).includes(q));
  if (!list.length) return '<div class="empty">No items match “' + esc(st.q) + '”.</div>';
  return SECTIONS.map((sec) => {
    const its = list.filter((it) => it.section === sec.id);
    if (!its.length) return '';
    return '<div class="ih">' + esc(sec.name) + (sec.id === 'extra' ? ' (not on the Wesley form)' : '') + '</div><div class="group">' + its.map((it) =>
      '<div class="item' + (st.sel.has(it.code) ? ' on' : '') + '"><span class="ck">' + (st.sel.has(it.code) ? svg(I.check, 3) : '') + '</span><button class="tx" data-act="tog" data-code="' + it.code + '"><b>' + esc(it.code) + '</b><span>' + esc(it.label) + '</span>' + (it.hint ? '<em>' + esc(it.hint) + '</em>' : '') + '</button><button class="info" data-act="itemInfo" data-code="' + it.code + '" aria-label="Criteria for ' + it.code + '">' + svg(I.info) + '</button></div>').join('') + '</div>';
  }).join('');
}
function billSheet(st) {
  const p = patientById(st.pid) || {};
  const sel = Array.from(st.sel);
  const prev = S.days.filter((d) => d.pid === st.pid && d.date < st.date).sort((a, b) => a.date < b.date ? 1 : -1)[0];
  const sugg = prev && !sel.length ? nextDayItems(prev.items) : [];
  const freq = frequentItems(8);
  const clashes = clashesFor(sel, st.pid, st.date);
  const needTimes = sel.some((c) => ITEM_MAP[c] && (ITEM_MAP[c].timed || ITEM_MAP[c].anaes));
  const needAsa = sel.some((c) => ITEM_MAP[c] && ITEM_MAP[c].anaes);
  const dayN = p.admitted ? daysBetween(p.admitted, st.date) + 1 : null;
  const dv = { items: sel, times: st.times, asa: st.asa };
  const mins = minsBetween(st.times.start, st.times.finish);
  const derived = derivedCodes(dv);
  let body = '<div class="daynav"><button class="iconbtn" data-act="billDay" data-v="-1" aria-label="Previous day">' + svg(I.left, 2.2) + '</button><input type="date" data-ch="billDate" value="' + st.date + '" aria-label="Date of care"><button class="iconbtn" data-act="billDay" data-v="1" aria-label="Next day">' + svg(I.right, 2.2) + '</button></div>';
  body += '<p class="note" style="margin-top:-4px">' + esc(relDay(st.date)) + (dayN && dayN > 0 ? ', day ' + dayN + ' of admission' : '') + (st.existing ? '. Editing items saved for this day.' : '.') + (st.existing && st.existing.sent ? ' Sent to your secretary ' + fmtDate(st.existing.sent.slice(0, 10)) + '; saving changes marks it to send again.' : '') + '</p>';
  body += billLocHTML(st);
  if (sugg.length) body += '<div class="suggest"><div class="main">Continue from ' + esc(relDay(prev.date).toLowerCase() === 'yesterday' ? 'yesterday' : fmtDate(prev.date)) + ':' + codesHTML(sugg) + '</div><button class="btn sm" data-act="useSugg">Use these</button></div>';
  if (needTimes) body += '<div class="panel" id="timesPanel"><span class="flabel">Times' + (needAsa ? ' (anaesthesia)' : '') + '</span><div class="two"><div><label class="small muted" for="bt-s">Start</label><input id="bt-s" type="time" data-ch="billTime" data-k="start" value="' + esc(st.times.start) + '"></div><div><label class="small muted" for="bt-f">Finish</label><input id="bt-f" type="time" data-ch="billTime" data-k="finish" value="' + esc(st.times.finish) + '"></div></div>' +
    '<div class="btnrow mt"><button class="btn sm ghost" data-act="billNow" data-k="start">Start now</button><button class="btn sm ghost" data-act="billNow" data-k="finish">Finish now</button></div>' +
    (mins != null ? '<p class="note">' + mins + ' minutes' + (needAsa ? (derived.find((c) => c.startsWith('230')) ? '. Time item ' + derived.find((c) => c.startsWith('230')) + ' is added to the sheet automatically.' : '. Outside the form’s time bands, so the secretary will see the times only.') : '.') + '</p>' : '') +
    (needAsa ? '<span class="flabel mt" style="margin-top:12px">ASA physical status</span><div class="chips">' + [['', 'None'], ['3', 'ASA 3 (25000)'], ['4', 'ASA 4 (25005)'], ['5', 'ASA 5 (25010)']].map(([v, l]) => chip(l, st.asa === v, 'billAsa', 'data-v="' + v + '"')).join('') + '</div>' : '') + '</div>';
  if (!st.q) body += '<div class="ih" style="font-size:13.5px;font-weight:700;color:var(--muted);margin:4px 2px 8px">Most used</div><div class="freq">' + freq.map((c) => '<button class="fq' + (st.sel.has(c) ? ' on' : '') + '" data-act="tog" data-code="' + c + '"><b>' + esc(c) + '</b><span>' + esc(itemLabel(c)) + '</span></button>').join('') + '</div>';
  body += searchBox(st.q, 'billQ', 'Search items and criteria');
  body += '<div class="items" id="billList">' + billItemsList(st) + '</div>';
  if (st.existing) body += '<button class="btn ghost block mt2" data-act="billReport">' + svg(I.doc) + 'Preview the saved sheet for this day</button>';
  body += '<div class="field mt2"><label for="b-note">Note for your secretary (optional)</label><input id="b-note" type="text" data-in="billNote" value="' + esc(st.note) + '" placeholder="e.g. family meeting, transferred out 14:00"></div>';
  let foot = '';
  if (clashes.length) foot += '<div class="warnbox">' + clashes.map((c) => '<div>' + esc(c) + '</div>').join('') + '</div>';
  if (needTimes && (!st.times.start || !st.times.finish)) foot += '<div class="warnbox">Times are needed for ' + esc(sel.filter((c) => ITEM_MAP[c] && (ITEM_MAP[c].timed || ITEM_MAP[c].anaes)).join(', ')) + '. <button class="link" data-act="scrollTimes">Add times</button></div>';
  foot += '<div class="sum">' + (sel.length ? orderCodes(sel).map((c) => '<button class="code" data-act="tog" data-code="' + c + '" style="border:0">' + esc(c) + ' ×</button>').join('') + derived.map((c) => '<span class="code">' + esc(c) + '</span>').join('') : 'No items selected') + '</div>';
  foot += '<div class="btnrow">' + (st.existing ? '<button class="btn ghost" data-act="billRemove" style="flex:0 0 auto">Remove day</button>' : '') + '<button class="btn" data-act="billSave"' + (sel.length || st.existing ? '' : ' disabled') + '>' + (sel.length ? 'Save ' + plural(sel.length, 'item') : (st.existing ? 'Save (no items)' : 'Save')) + '</button></div>';
  return { title: patientName(p), sub: [wardBedShort(st.loc), p.fund].filter(Boolean).join(', ') || 'Bill a day of care', body, foot };
}
function billLocHTML(st) {
  const p = patientById(st.pid) || {};
  const prevDay = S.days.filter((x) => x.pid === st.pid && x.date < st.date).sort((a, b) => a.date < b.date ? 1 : -1)[0];
  const movedFromPrev = prevDay && !sameLoc(dayLoc(prevDay), st.loc);
  if (!st.locEdit) return '<div class="locline"><div class="main"><div class="small muted">Location ' + (movedFromPrev ? '(moved since ' + esc(fmtDate(prevDay.date, { dow: false })) + ')' : 'this day') + '</div><b>' + esc(hospitalById(st.loc.hospital).name) + '</b>, ' + esc(wardBed(st.loc) || 'no ward set') + '</div><button class="btn sm ghost" data-act="billLocEdit">Change</button></div>';
  const wards = wardsRanked(); if (st.loc.ward && !wards.includes(st.loc.ward)) wards.push(st.loc.ward);
  return '<div class="panel"><span class="flabel">Where was ' + esc(patientName(p).split(',')[0]) + ' on ' + esc(fmtDate(st.date, { dow: false })) + '?</span>' +
    '<div class="chips">' + S.settings.hospitals.map((h) => chip(h.name, st.loc.hospital === h.id, 'billLocSet', 'data-k="hospital" data-v="' + h.id + '"')).join('') + '</div>' +
    '<div class="chips mt">' + wards.map((w) => chip(w, st.loc.ward === w, 'billLocSet', 'data-k="ward" data-v="' + esc(w) + '"')).join('') + '</div>' +
    '<div class="two mt"><input type="text" data-in="billLoc" data-k="ward" value="' + esc(st.loc.ward || '') + '" placeholder="Ward" aria-label="Ward"><input type="text" data-in="billLoc" data-k="bed" value="' + esc(st.loc.bed || '') + '" placeholder="Bed" aria-label="Bed"></div>' +
    '<div class="toggle"><div class="main small">Also make this the patient\u2019s current location</div><button class="switch' + (st.moveCurrent ? ' on' : '') + '" data-act="billMoveFlip" aria-label="Update current location"></button></div>' +
    '<button class="btn sm block" data-act="billLocDone">Done</button></div>';
}
function saveBill(remove) {
  const st = curSheet().st; const p = patientById(st.pid);
  const prior = st.existing ? JSON.parse(JSON.stringify(st.existing)) : null;
  if (remove || !st.sel.size) {
    if (st.existing) S.days = S.days.filter((d) => d !== st.existing);
    closeSheet(); changed();
    toast('Removed ' + fmtDate(st.date) + ' for ' + patientName(p), { action: 'Undo', fn: () => { if (prior) { S.days.push(prior); changed(); } } });
    return;
  }
  const items = orderCodes(Array.from(st.sel));
  const nowISO = new Date().toISOString();
  const showTimes = items.some((c) => ITEM_MAP[c] && (ITEM_MAP[c].timed || ITEM_MAP[c].anaes));
  const rec = { items, times: showTimes ? { ...st.times } : { start: '', finish: '' }, asa: items.some((c) => ITEM_MAP[c] && ITEM_MAP[c].anaes) ? st.asa : '', note: st.note.trim(), loc: { hospital: st.loc.hospital, ward: String(st.loc.ward || '').trim(), bed: String(st.loc.bed || '').trim() }, updated: nowISO };
  const priorPatientLoc = patientLoc(p);
  if (st.moveCurrent && !sameLoc(rec.loc, priorPatientLoc)) Object.assign(p, rec.loc);
  let newId = null;
  if (st.existing) {
    const changedItems = JSON.stringify([st.existing.items, st.existing.times, st.existing.asa, st.existing.note]) !== JSON.stringify([rec.items, rec.times, rec.asa, rec.note]) || !sameLoc(dayLoc(st.existing), rec.loc);
    Object.assign(st.existing, rec);
    if (changedItems && st.existing.sent) st.existing.sent = null;
  } else {
    newId = uid();
    S.days.push({ id: newId, pid: st.pid, date: st.date, ...rec, sent: null, created: nowISO });
  }
  closeSheet(); changed();
  toast('Saved ' + plural(items.length, 'item') + ' for ' + patientName(p) + ', ' + relDayLc(st.date), {
    action: 'Undo', fn: () => {
      Object.assign(p, priorPatientLoc);
      if (newId) S.days = S.days.filter((d) => d.id !== newId);
      else if (prior) { const d = S.days.find((x) => x.id === prior.id); if (d) Object.assign(d, prior); }
      changed();
    }
  });
}
function openItemInfo(code) {
  const it = ITEM_MAP[code]; if (!it) return;
  const parent = sheetStack.length ? curSheet() : null;
  const inBill = parent && parent.st && parent.st.sel;
  openSheet({
    mod: 'bill', st: {},
    render: () => {
      const on = inBill && parent.st.sel.has(code);
      const own = userFee(code);
      let body = '';
      if (it.mbsTitle) body += '<p class="small muted" style="margin:0 0 6px">MBS item ' + esc(code.replace(/[A-Z]$/, '')) + ': ' + esc(it.mbsTitle) + '</p>';
      body += '<p style="margin:0 0 12px">' + esc(it.criteria || 'No criteria recorded for this item. Check MBS Online before billing.') + '</p>';
      if (it.formNotes.length) body += '<div class="warnbox">' + it.formNotes.map((n) => '<div><b>Paper form wording differs:</b> ' + esc(n) + '</div>').join('') + '</div>';
      if (it.rules.length) body += '<span class="flabel mt">Rules and restrictions</span><ul class="cap-list">' + it.rules.map((r) => '<li>' + esc(r) + '</li>').join('') + '</ul>';
      const sched = it.scheduleFee != null ? '$' + it.scheduleFee.toFixed(2) : (code === '25025' ? '50%' : '–');
      body += '<div class="kpis mt"><div class="kpi"><div class="v">' + sched + '</div><div class="k">' + (code === '25025' ? 'of the anaesthesia fee (MBS)' : 'MBS schedule fee') + '</div></div><div class="kpi"><div class="v">' + (own != null ? '$' + own.toFixed(2) : sched) + '</div><div class="k">' + (own != null ? 'your own rate, used in estimates' : 'used in estimates (change in Settings)') + '</div></div></div>';
      body += '<p class="note">' + (it.source ? 'Source: <a href="' + esc(it.source) + '" target="_blank" rel="noopener">MBS Online</a>, schedule from 1 July 2026. ' : '') + 'Criteria are a plain-English summary to help choose items; MBS Online is the authority.</p>';
      return { title: code + ' ' + it.label, sub: it.hint || (it.form ? 'On the Wesley billing form' : 'Not on the Wesley form'), body, foot: inBill ? '<button class="btn block" data-act="infoToggle" data-code="' + code + '">' + (on ? 'Remove from this day' : 'Add to this day') + '</button>' : '' };
    }
  });
  curSheet().parent = parent;
}

/* ---------------- ECMO ---------------- */
function viewEcmo() {
  const [a, b] = ecmoRange(); const prog = ecmoProgress();
  const withT = prog.filter((p) => p.target); const met = withT.filter((p) => p.met).length;
  let s = '<div class="topbar"><h1>ECMO</h1><div class="sp"></div><button class="iconbtn" data-act="settings" aria-label="Settings">' + svg(I.gear) + '</button></div>';
  s += '<p class="note" style="margin-top:-6px">' + esc(ECMO_PERIOD_LABELS[S.settings.ecmoPeriod.mode]) + ', ' + esc(fmtRange(a, b)) + '. ' + met + ' of ' + withT.length + ' targets met. <button class="link" data-act="settings" data-v="ecmo">Change targets</button></p>';
  s += '<div class="tiles">' + prog.map((p) => '<button class="tile" data-act="ecmoLog" data-type="' + p.id + '"><span class="plus">' + svg(I.plus, 2.6) + '</span><span class="nm">' + esc(p.name) + '</span><span class="n">' + p.n + (p.target ? '<small>of ' + p.target + '</small>' : '<small>logged</small>') + '</span>' + (p.target ? bar(p.n / p.target) : '<div class="bar" style="opacity:0"></div>') + '</button>').join('') + '</div>';
  s += '<p class="note">Tap a tile to log it. Your usual answers are filled in, so most entries are one more tap.</p>';
  s += '<button class="btn block soft mt" data-act="openReport" data-kind="ecmo">' + svg(I.doc) + 'Accreditation report</button>';
  s += '<div class="sec"><h2>Activity</h2></div>' + searchBox(UI.ecmoQ, 'ecmoQ', 'Search ECMO activity');
  s += '<div class="chips scroll">' + chip('All', !UI.ecmoFilter, 'ecmoFilter', 'data-v=""') + ECMO_TYPES.map((t) => chip(t.name, UI.ecmoFilter === t.id, 'ecmoFilter', 'data-v="' + t.id + '"')).join('') + '</div>';
  s += '<div id="ecmoResults" class="mt">' + ecmoResults() + '</div>';
  return s;
}
function ecmoResults() {
  let list = S.ecmo.slice().sort((a, b) => a.date < b.date ? 1 : a.date > b.date ? -1 : (a.created < b.created ? 1 : -1));
  if (UI.ecmoFilter) list = list.filter((e) => e.type === UI.ecmoFilter);
  const q = norm(UI.ecmoQ.trim());
  if (q) list = list.filter((e) => norm([(ECMO_TYPES.find((t) => t.id === e.type) || {}).name, ecmoDetail(e), e.location, e.ref, fmtDate(e.date, { year: true })].join(' ')).includes(q));
  if (!list.length) return '<div class="group"><div class="empty"><b>Nothing logged yet</b>Tap a tile above to log your first ECMO activity.</div></div>';
  const lim = UI.ecmoLimit || 25;
  return '<div class="group">' + list.slice(0, lim).map((e) => '<button class="row tap" data-act="ecmoEdit" data-id="' + e.id + '"><div class="main"><div class="t">' + esc((ECMO_TYPES.find((t) => t.id === e.type) || {}).name || e.type) + '</div><div class="s">' + esc(ecmoDetail(e) || e.location || '') + '</div></div><div class="end">' + esc(fmtDate(e.date, { dow: false })) + '</div></button>').join('') + '</div>';
}
function openEcmoPicker() {
  openSheet({
    mod: 'ecmo', st: {},
    render: () => ({ title: 'Log ECMO activity', body: '<div class="tiles">' + ECMO_TYPES.map((t) => '<button class="tile" style="min-height:76px" data-act="ecmoLog" data-type="' + t.id + '" data-replace="1"><span class="plus">' + svg(I.plus, 2.6) + '</span><span class="nm">' + esc(t.name) + '</span></button>').join('') + '</div>' })
  });
}
const lcName = (s) => String(s).replace(/\b([A-Z])([a-z])/g, (m, a, b) => a.toLowerCase() + b);
const nowHM = () => { const d = new Date(); return pad(d.getHours()) + ':' + pad(d.getMinutes()); };
function openEcmo(type, id) {
  const ex = id ? S.ecmo.find((e) => e.id === id) : null;
  let st;
  if (ex) st = JSON.parse(JSON.stringify(ex));
  else {
    const last = S.ecmo.filter((e) => e.type === type).sort((a, b) => a.created < b.created ? 1 : -1)[0] || {};
    st = { type, date: today(), time: nowHM(), location: last.location || locationsRanked()[0] || '', ref: '', note: '' };
    ['mode', 'role', 'config', 'imaging', 'setting', 'reason', 'urgency', 'transport', 'hours', 'kind', 'patients', 'to'].forEach((k) => { if (last[k] != null) st[k] = Array.isArray(last[k]) ? last[k].slice() : last[k]; });
    if (type === 'cannulation') { st.complication = 'None'; st.mode = st.mode || 'VV'; st.role = st.role || 'Primary operator'; st.imaging = st.imaging || ['Ultrasound']; st.setting = st.setting || 'ICU'; }
    if (type === 'qa') st.hours = st.hours || 1;
    if (type === 'round') { st.patients = st.patients || 1; st.hours = st.hours || 1; }
    if (type === 'other') st.kind = st.kind || 'Decannulation';
    st.alsoCpd = true;
  }
  st.edit = !!ex;
  openSheet({ mod: 'ecmo', tall: true, st, render: ecmoSheet });
}
function chipRow(st, key, opts, multi) {
  return '<div class="chips">' + opts.map((o) => chip(o, multi ? (st[key] || []).includes(o) : st[key] === o, 'ecSet', 'data-k="' + key + '" data-v="' + esc(o) + '"' + (multi ? ' data-multi="1"' : ''))).join('') + '</div>';
}
function hoursField(st, key = 'hours', label = 'Duration') {
  const opts = [0.5, 1, 1.5, 2, 3, 4, 6, 8];
  return '<div class="field"><span class="flabel">' + label + '</span><div class="chips">' + opts.map((h) => chip(fmtH(h) + ' h', Number(st[key]) === h, 'ecSet', 'data-k="' + key + '" data-v="' + h + '" data-num="1"')).join('') + '</div><input class="mt" type="number" step="0.25" min="0" inputmode="decimal" data-in="fnum" data-k="' + key + '" value="' + esc(st[key] || '') + '" placeholder="Other (hours)" style="margin-top:8px"></div>';
}
function locField(st) {
  const locs = locationsRanked(); if (st.location && !locs.includes(st.location)) locs.unshift(st.location);
  return '<div class="field"><span class="flabel">Location / unit</span><div class="chips">' + locs.map((l) => chip(l, st.location === l, 'ecSet', 'data-k="location" data-v="' + esc(l) + '"')).join('') + chip('Add location', false, 'locAdd', '') + '</div>' +
    (st.addingLoc ? '<div class="two mt"><input type="text" data-in="f" data-k="newLoc" placeholder="e.g. RBWH ICU" value="' + esc(st.newLoc || '') + '"><button class="btn ghost" data-act="locSave">Add</button></div>' : '') + '</div>';
}
function ecmoSheet(st) {
  const T = ECMO_TYPES.find((t) => t.id === st.type) || ECMO_TYPES[0];
  const O = ECMO_OPTS;
  let b = '<div class="two"><div class="field"><label for="ec-d">Date</label><input id="ec-d" type="date" data-in="f" data-k="date" value="' + esc(st.date) + '"></div><div class="field"><label for="ec-t">Time</label><input id="ec-t" type="time" data-in="f" data-k="time" value="' + esc(st.time || '') + '"></div></div>';
  const f = (label, inner) => '<div class="field"><span class="flabel">' + label + '</span>' + inner + '</div>';
  switch (st.type) {
    case 'cannulation':
      b += f('Mode', chipRow(st, 'mode', O.mode)) + f('Your role', chipRow(st, 'role', O.role)) + f('Configuration', chipRow(st, 'config', O.config)) + f('Imaging', chipRow(st, 'imaging', O.imaging, true)) + f('Setting', chipRow(st, 'setting', O.setting)) + f('Complications', chipRow(st, 'complication', O.complication)); break;
    case 'circuit':
      b += f('Reason', chipRow(st, 'reason', O.circuitReason)) + f('Urgency', chipRow(st, 'urgency', O.urgency)) + f('Your role', chipRow(st, 'role', O.role)) + f('Mode', chipRow(st, 'mode', O.mode)); break;
    case 'review':
      b += f('Mode', chipRow(st, 'mode', O.mode)); break;
    case 'qa':
      b += hoursField(st) + '<div class="field"><label for="ec-top">Topic</label><input id="ec-top" type="text" data-in="f" data-k="topic" value="' + esc(st.topic || '') + '" placeholder="e.g. case review, anticoagulation protocol"></div>'; break;
    case 'round':
      b += f('Patients on ECMO', '<div class="stepper"><button data-act="ecStep" data-k="patients" data-v="-1" aria-label="Fewer">−</button><span>' + (st.patients || 1) + '</span><button data-act="ecStep" data-k="patients" data-v="1" aria-label="More">+</button></div>') + hoursField(st); break;
    case 'retrieval':
      b += '<div class="two"><div class="field"><label for="ec-fr">From</label><input id="ec-fr" type="text" data-in="f" data-k="from" value="' + esc(st.from || '') + '" placeholder="Referring hospital"></div><div class="field"><label for="ec-to">To</label><input id="ec-to" type="text" data-in="f" data-k="to" value="' + esc(st.to || '') + '"></div></div>' +
        f('Mode', chipRow(st, 'mode', O.mode)) + f('Transport', chipRow(st, 'transport', O.transport)) + f('Your role', chipRow(st, 'role', ['Team leader', 'Cannulator', 'Assistant'])) +
        '<div class="toggle"><div class="main">Cannulated at the referring hospital</div><button class="switch' + (st.cannulatedOnSite ? ' on' : '') + '" data-act="ecFlip" data-k="cannulatedOnSite" aria-label="Cannulated on site"></button></div>' + hoursField(st); break;
    case 'consult':
      b += '<div class="field"><label for="ec-ref">Referred by</label><input id="ec-ref" type="text" data-in="f" data-k="referrer" value="' + esc(st.referrer || '') + '" placeholder="Hospital or team" list="dl-refh"><datalist id="dl-refh">' + Array.from(new Set(S.ecmo.map((e) => e.referrer || e.from).filter(Boolean))).map((r) => '<option value="' + esc(r) + '">').join('') + '</datalist></div>' +
        f('Outcome', chipRow(st, 'outcome', O.consultOutcome)) + f('Mode considered', chipRow(st, 'mode', O.mode)); break;
    case 'other':
      b += f('What happened', chipRow(st, 'kind', O.otherKind)) + hoursField(st) + '<div class="field"><label for="ec-top2">Description</label><input id="ec-top2" type="text" data-in="f" data-k="topic" value="' + esc(st.topic || '') + '"></div>'; break;
  }
  b += locField(st);
  b += '<div class="field"><label for="ec-pr">Patient reference (optional)</label><input id="ec-pr" type="text" data-in="f" data-k="ref" value="' + esc(st.ref || '') + '" placeholder="Initials or UR, avoid full names"></div>';
  b += '<div class="field"><label for="ec-n">Notes</label><input id="ec-n" type="text" data-in="f" data-k="note" value="' + esc(st.note || '') + '"></div>';
  const cpdKey = st.type === 'other' ? 'other:' + st.kind : st.type;
  if (!st.edit && ECMO_TO_CPD[cpdKey]) b += '<div class="toggle" data-mod="cpd"><div class="main"><b>Also log as CPD</b><div class="small muted">Adds ' + esc(cpdType(ECMO_TO_CPD[cpdKey].type).name.toLowerCase()) + ' to your CPD record</div></div><button class="switch' + (st.alsoCpd ? ' on' : '') + '" data-act="ecFlip" data-k="alsoCpd" aria-label="Also log as CPD"></button></div>';
  return {
    title: (st.edit ? 'Edit ' : 'Log ') + lcName(T.name), sub: st.edit ? fmtDate(st.date, { year: true }) : 'ECMO logbook', body: b,
    foot: '<div class="btnrow">' + (st.edit ? '<button class="btn danger" data-act="ecmoDelete" style="flex:0 0 auto">Delete</button>' : '') + '<button class="btn" data-act="ecmoSave">' + (st.edit ? 'Save changes' : 'Log ' + lcName(T.name)) + '</button></div>'
  };
}
function saveEcmo() {
  const st = curSheet().st;
  const rec = JSON.parse(JSON.stringify(st));
  ['edit', 'alsoCpd', 'addingLoc', 'newLoc'].forEach((k) => delete rec[k]);
  if (rec.hours) rec.hours = Number(rec.hours);
  const T = ECMO_TYPES.find((t) => t.id === st.type);
  if (st.edit) {
    const i = S.ecmo.findIndex((e) => e.id === st.id); S.ecmo[i] = rec;
    const linked = S.cpd.find((c) => c.ecmoId === st.id);
    if (linked) { linked.date = rec.date; linked.location = rec.location; if (rec.hours) linked.hours = rec.hours; if (rec.topic) linked.title = rec.topic; }
    closeSheet(); changed(); toast('Saved changes'); return;
  }
  rec.id = uid(); rec.created = new Date().toISOString();
  S.ecmo.push(rec);
  const cpdKey = st.type === 'other' ? 'other:' + st.kind : st.type;
  let cpdId = null;
  if (st.alsoCpd && ECMO_TO_CPD[cpdKey]) {
    const ty = ECMO_TO_CPD[cpdKey].type;
    cpdId = uid();
    S.cpd.push({ id: cpdId, date: rec.date, type: ty, cat: cpdType(ty).cat, hours: Number(rec.hours) || 1, location: rec.location, title: rec.topic || ('ECMO ' + (st.type === 'qa' ? 'quality assurance meeting' : st.kind.toLowerCase())), provider: '', cape: [], reflection: '', portal: false, ecmoId: rec.id, created: rec.created });
  }
  closeSheet(); changed();
  toast('Logged ' + lcName(T.name) + (cpdId ? ' and added to CPD' : ''), { action: 'Undo', fn: () => { S.ecmo = S.ecmo.filter((e) => e.id !== rec.id); if (cpdId) S.cpd = S.cpd.filter((c) => c.id !== cpdId); changed(); } });
}

/* ---------------- CPD ---------------- */
function viewCpd() {
  const y = UI.cpdYear; const P = cpdProgress(y); const isNow = String(y) === today().slice(0, 4);
  const diff = P.total - P.expected;
  let s = '<div class="topbar"><h1>CPD</h1><div class="sp"></div><button class="iconbtn" data-act="cpdYear" data-v="-1" aria-label="Previous year">' + svg(I.left, 2.2) + '</button><b style="min-width:46px;text-align:center">' + y + '</b><button class="iconbtn" data-act="cpdYear" data-v="1" aria-label="Next year"' + (isNow ? ' disabled' : '') + '>' + svg(I.right, 2.2) + '</button></div>';
  s += '<div class="card bigprog"><div class="num">' + fmtH(P.total) + '<small> of ' + fmtH(P.T.total) + ' hours</small></div>' + bar(P.total / P.T.total, isNow ? P.expected / P.T.total : null) +
    '<div class="small muted">' + (P.total >= P.T.total ? 'Annual hours complete.' : (isNow ? (Math.abs(diff) < 0.5 ? 'On pace' : diff > 0 ? fmtH(diff) + ' h ahead of pace' : fmtH(-diff) + ' h behind pace') + '. ' + fmtH(P.T.total - P.total) + ' h to go, ' + daysLeftInYear() + ' days left. The marker shows where an even pace would be today.' : fmtH(P.T.total - P.total) + ' h short of the annual minimum.')) + '</div></div>';
  s += '<div class="card"><h3>CICM categories</h3>' + P.checks.slice(1).map((c) => '<div class="prog"><div class="top"><b>' + esc(c.label) + '</b><span>' + fmtH(c.have) + ' of ' + fmtH(c.need) + ' h</span></div>' + bar(c.have / c.need) + '</div>').join('') + '</div>';
  s += '<div class="card"><h3>Every year</h3><div class="checks">' +
    '<div class="ck">' + cmark(P.pdp) + '<div class="main">Professional development plan<div class="sub">Mandatory each year, up to 3 h counts</div></div></div>' +
    CAPE.map((c) => '<div class="ck">' + cmark(P.cape[c.id]) + '<div class="main">' + esc(c.name) + '<div class="sub">At least one activity tagged</div></div></div>').join('') +
    '<div class="ck">' + cmark(!!P.shlr) + '<div class="main">Airway management (SHLR)<div class="sub">' + (P.shlr ? 'Done ' + esc(fmtDate(P.shlr.date, { year: true })) : 'Once per triennium, due 31 Dec ' + P.triennium[1]) + '</div></div></div></div></div>';
  s += '<button class="btn block mt" data-act="cpdNew">' + svg(I.plus, 2.4) + 'Log CPD</button>';
  const rec = recentCpdTemplates();
  if (rec.length) s += '<div class="flabel mt">Log again</div><div class="chips scroll">' + rec.map((r, i) => chip((r.title || cpdType(r.type).name) + ', ' + fmtH(r.hours) + ' h', false, 'cpdRepeat', 'data-i="' + i + '"')).join('') + '</div>';
  s += '<button class="btn block soft mt" data-act="openReport" data-kind="cpd" data-year="' + y + '">' + svg(I.doc) + 'CPD report for ' + y + '</button>';
  if (P.notLogged) s += '<p class="note">' + plural(P.notLogged, 'activity', 'activities') + ' not yet marked as entered in your CICM portal diary.</p>';
  s += '<div class="sec"><h2>Activities</h2><div class="sp"></div><span class="small muted">' + plural(P.list.length, 'activity', 'activities') + '</span></div>' + searchBox(UI.cpdQ, 'cpdQ', 'Search CPD');
  s += '<div id="cpdResults">' + cpdResults() + '</div>';
  return s;
}
function cpdResults() {
  let list = cpdForYear(UI.cpdYear).sort((a, b) => a.date < b.date ? 1 : -1);
  const q = norm(UI.cpdQ.trim());
  if (q) list = list.filter((e) => norm([e.title, cpdType(e.type).name, e.location, e.provider, e.reflection, CPD_CATS[e.cat].name].join(' ')).includes(q));
  if (!list.length) return '<div class="group"><div class="empty"><b>No CPD logged for ' + UI.cpdYear + '</b>Tap Log CPD after a meeting, course or teaching session.</div></div>';
  return '<div class="group" data-mod="cpd">' + list.map((e) => '<button class="row tap" data-act="cpdEdit" data-id="' + e.id + '"><div class="main"><div class="t">' + esc(e.title || cpdType(e.type).name) + '</div><div class="s">' + esc([fmtDate(e.date, { dow: false }), CPD_CATS[e.cat || cpdType(e.type).cat].short, e.location].filter(Boolean).join(', ')) + '</div></div><div class="end"><b style="color:var(--ink)">' + fmtH(e.hours) + ' h</b><br>' + (e.portal ? '<span class="small" style="color:var(--good)">In portal</span>' : '<span class="small">Not in portal</span>') + '</div></button>').join('') + '</div>';
}
function recentCpdTemplates() {
  const seen = new Set(); const out = [];
  S.cpd.slice().sort((a, b) => a.date < b.date ? 1 : -1).forEach((e) => {
    if (e.ecmoId) return;
    const k = e.type + '|' + (e.title || '') + '|' + (e.location || '') + '|' + e.hours;
    if (!seen.has(k) && out.length < 6) { seen.add(k); out.push(e); }
  });
  return out;
}
function openCpd(id, tpl) {
  const ex = id ? S.cpd.find((e) => e.id === id) : null;
  let st;
  if (ex) st = JSON.parse(JSON.stringify(ex));
  else if (tpl) st = { date: today(), type: tpl.type, cat: tpl.cat, title: tpl.title, hours: tpl.hours, location: tpl.location, provider: tpl.provider || '', cape: (tpl.cape || []).slice(), reflection: '', portal: false };
  else st = { date: today(), type: '', cat: '', title: '', hours: 1, location: locationsRanked()[0] || '', provider: '', cape: [], reflection: '', portal: false };
  st.edit = !!ex; st.allTypes = false;
  openSheet({ mod: 'cpd', tall: true, st, render: cpdSheet });
}
function cpdSheet(st) {
  const used = {}; S.cpd.forEach((e) => { used[e.type] = (used[e.type] || 0) + 1; });
  const topTypes = CPD_TYPES.slice().sort((a, b) => (used[b.id] || 0) - (used[a.id] || 0) || CPD_TYPES.indexOf(a) - CPD_TYPES.indexOf(b)).slice(0, 8);
  if (st.type && !topTypes.find((t) => t.id === st.type)) topTypes.push(cpdType(st.type));
  let b = '';
  if (!st.edit) { const rec = recentCpdTemplates(); if (rec.length) b += '<span class="flabel">Same as before</span><div class="chips scroll" style="margin-bottom:14px">' + rec.map((r, i) => chip((r.title || cpdType(r.type).name) + ', ' + fmtH(r.hours) + ' h', false, 'cpdFill', 'data-i="' + i + '"')).join('') + '</div>'; }
  b += '<div class="field"><label for="cp-d">Date</label><input id="cp-d" type="date" data-in="f" data-k="date" value="' + esc(st.date) + '"></div>';
  b += '<div class="field"><span class="flabel">What kind of activity</span>';
  if (st.allTypes) b += Object.keys(CPD_CATS).map((c) => '<div class="small muted" style="margin:10px 0 6px;font-weight:650">' + CPD_CATS[c].name + '</div><div class="chips">' + CPD_TYPES.filter((t) => t.cat === c).map((t) => chip(t.name, st.type === t.id, 'cpType', 'data-v="' + t.id + '"')).join('') + '</div>').join('');
  else b += '<div class="chips">' + topTypes.map((t) => chip(t.name, st.type === t.id, 'cpType', 'data-v="' + t.id + '"')).join('') + '<button class="chip add" data-act="cpAllTypes">All types</button></div>';
  b += '</div>';
  if (st.type) b += '<div class="field"><span class="flabel">CICM category</span><div class="chips">' + Object.keys(CPD_CATS).map((c) => chip(CPD_CATS[c].name, st.cat === c, 'cpCat', 'data-v="' + c + '"')).join('') + '</div>' + (st.type === 'pdp' ? '<div class="hint">CICM counts up to 3 hours for your PDP.</div>' : '') + (cpdType(st.type).shlr ? '<div class="hint">Must be in person, at least 3 hours, with preparatory reading and a written reflection.</div>' : '') + '</div>';
  b += '<div class="field"><label for="cp-t">Title or topic</label><input id="cp-t" type="text" data-in="f" data-k="title" value="' + esc(st.title || '') + '" placeholder="e.g. ICU M&M, CICM ASM"></div>';
  b += hoursField(st, 'hours', 'Hours attended').replace(/ecSet/g, 'cpSet');
  b += locField(st).replace(/ecSet/g, 'cpSet');
  b += '<div class="field"><label for="cp-p">Provider or organiser (optional)</label><input id="cp-p" type="text" data-in="f" data-k="provider" value="' + esc(st.provider || '') + '"></div>';
  b += '<div class="field"><span class="flabel">Covers these CICM program requirements</span><div class="chips">' + CAPE.map((c) => chip(c.name, (st.cape || []).includes(c.id), 'cpCape', 'data-v="' + c.id + '"')).join('') + '</div></div>';
  b += '<div class="field"><label for="cp-r">Reflection (optional)</label><textarea id="cp-r" data-in="f" data-k="reflection" placeholder="What did you learn, or what will you change?">' + esc(st.reflection || '') + '</textarea></div>';
  b += '<div class="field"><span class="flabel">Certificate or evidence (optional)</span>' + (st.evidenceId ? '<img class="photo" data-ev="' + st.evidenceId + '" alt="Evidence"><div class="btnrow mt"><button class="btn sm ghost" data-act="cpEvidence">Replace photo</button><button class="btn sm ghost" data-act="cpEvidenceRemove">Remove</button></div>' : '<button class="btn sm ghost" data-act="cpEvidence">' + svg(I.image) + 'Attach a photo</button>') + '</div>';
  b += '<div class="toggle"><div class="main"><b>Entered in my CICM portal diary</b><div class="small muted">Tick once you’ve logged it with the College</div></div><button class="switch' + (st.portal ? ' on' : '') + '" data-act="cpFlip" data-k="portal" aria-label="Entered in CICM portal"></button></div>';
  return {
    title: st.edit ? 'Edit CPD' : 'Log CPD', sub: st.edit ? fmtDate(st.date, { year: true }) : 'CICM CPD Program', body: b,
    foot: '<div class="btnrow">' + (st.edit ? '<button class="btn danger" data-act="cpdDelete" style="flex:0 0 auto">Delete</button>' : '') + '<button class="btn" data-act="cpdSave"' + (st.type && Number(st.hours) > 0 ? '' : ' disabled') + '>' + (st.edit ? 'Save changes' : 'Log ' + (Number(st.hours) > 0 ? fmtH(st.hours) + ' h' : 'CPD')) + '</button></div>',
    after: async (el) => { for (const im of $$('img[data-ev]', el)) { const u = await photoURL(im.dataset.ev); if (u) im.src = u; } }
  };
}
function saveCpd() {
  const st = curSheet().st;
  const rec = JSON.parse(JSON.stringify(st)); ['edit', 'allTypes', 'addingLoc', 'newLoc'].forEach((k) => delete rec[k]);
  rec.hours = Number(rec.hours) || 0; rec.cat = rec.cat || cpdType(rec.type).cat;
  if (!rec.title) rec.title = '';
  if (st.edit) { const i = S.cpd.findIndex((e) => e.id === st.id); S.cpd[i] = rec; closeSheet(); changed(); toast('Saved changes'); return; }
  rec.id = uid(); rec.created = new Date().toISOString(); S.cpd.push(rec);
  if (UI.cpdYear !== Number(rec.date.slice(0, 4))) UI.cpdYear = Number(rec.date.slice(0, 4));
  closeSheet(); changed(); requestPersistence();
  toast('Logged ' + fmtH(rec.hours) + ' h of CPD', { action: 'Undo', fn: () => { S.cpd = S.cpd.filter((e) => e.id !== rec.id); changed(); } });
}

/* ---------------- Reports ---------------- */
function viewReports() {
  const R = UI.rep;
  const unsent = S.days.filter((d) => !d.sent);
  const upids = new Set(unsent.map((d) => d.pid));
  const oldest = unsent.map((d) => d.date).sort()[0];
  const funds = Array.from(new Set(S.patients.map((p) => p.fund).filter(Boolean)));
  const fundsSorted = fundsRanked().filter((f) => funds.includes(f));
  if (!R.fund && fundsSorted.length) R.fund = fundsSorted[0];
  const years = Array.from(new Set(S.cpd.map((e) => Number(e.date.slice(0, 4))).concat([Number(today().slice(0, 4))]))).sort((a, b) => b - a);
  let s = '<div class="topbar"><h1>Reports</h1><div class="sp"></div><button class="iconbtn" data-act="settings" aria-label="Settings">' + svg(I.gear) + '</button></div>';
  s += '<p class="note" style="margin-top:-6px">Every report opens as a preview first. Email it from there once you’ve checked it.</p>';
  s += '<div class="sec"><h2>Billing</h2></div>';
  s += '<div class="card" data-mod="bill"><h3>Not yet sent to your secretary</h3><p>' + (unsent.length ? plural(unsent.length, 'patient-day') + ' for ' + plural(upids.size, 'patient') + ', since ' + esc(fmtDate(oldest)) + '.' : 'Everything has been sent.') + '</p><button class="btn block" data-act="repUnsent"' + (unsent.length ? '' : ' disabled') + '>Preview billing sheets</button></div>';
  const dayN = S.days.filter((d) => d.date === R.billDay);
  s += '<div class="card" data-mod="bill"><h3>One day</h3><p>Everyone you billed on one day: a summary page, then each patient\u2019s sheet.</p>' +
    '<div class="daynav"><button class="iconbtn" data-act="repDayStep" data-v="-1" aria-label="Previous day">' + svg(I.left, 2.2) + '</button><input type="date" data-ch="repDay" value="' + R.billDay + '" aria-label="Day"><button class="iconbtn" data-act="repDayStep" data-v="1" aria-label="Next day">' + svg(I.right, 2.2) + '</button></div>' +
    '<p class="small muted" style="margin:-4px 0 10px">' + esc(relDay(R.billDay)) + ': ' + (dayN.length ? plural(dayN.length, 'patient') + ' billed' : 'no billing recorded') + '.</p>' +
    '<button class="btn block" data-act="repDay"' + (dayN.length ? '' : ' disabled') + '>Preview</button></div>';
  s += repPatientCard(R);
  s += '<div class="card" data-mod="bill"><h3>Date range</h3><p>A summary page, then a sheet per patient laid out like your paper form.</p><div class="chips">' + ['week', 'lastweek', 'month', 'lastmonth', 'custom'].map((k) => chip(RANGE_LABELS[k], R.billRange === k, 'repSet', 'data-k="billRange" data-v="' + k + '"')).join('') + '</div>' +
    (R.billRange === 'custom' ? '<div class="two mt"><input type="date" data-in="rep" data-k="billA" value="' + R.billA + '" aria-label="From"><input type="date" data-in="rep" data-k="billB" value="' + R.billB + '" aria-label="To"></div>' : '') +
    '<button class="btn block mt" data-act="repBill">Preview</button></div>';
  s += '<div class="card" data-mod="bill"><h3>By health fund</h3><p>A list of services for one fund, for your secretary to lodge.</p>' +
    (fundsSorted.length ? '<select data-ch="repFund" aria-label="Health fund">' + fundsSorted.map((f) => '<option' + (R.fund === f ? ' selected' : '') + '>' + esc(f) + '</option>').join('') + '</select>' +
      '<div class="chips mt">' + ['month', 'lastmonth', '90d', 'fy', 'custom'].map((k) => chip(RANGE_LABELS[k], R.fundRange === k, 'repSet', 'data-k="fundRange" data-v="' + k + '"')).join('') + '</div>' +
      (R.fundRange === 'custom' ? '<div class="two mt"><input type="date" data-in="rep" data-k="billA" value="' + R.billA + '" aria-label="From"><input type="date" data-in="rep" data-k="billB" value="' + R.billB + '" aria-label="To"></div>' : '') +
      '<div class="toggle"><div class="main">Include a form sheet for each patient</div><button class="switch' + (R.fundSheets ? ' on' : '') + '" data-act="repFlip" data-k="fundSheets" aria-label="Include form sheets"></button></div><button class="btn block" data-act="repFund">Preview</button>'
      : '<p class="muted small">No patients recorded yet.</p>') + '</div>';
  s += '<div class="sec"><h2>ECMO</h2></div><div class="card" data-mod="ecmo"><h3>Accreditation record</h3><p>Counts against your targets, cannulation breakdown and a dated log with a verification block.</p><div class="chips">' +
    [['period', ECMO_PERIOD_LABELS[S.settings.ecmoPeriod.mode]], ['year', 'This calendar year'], ['all', 'All records'], ['custom', 'Custom dates']].filter((v, i, arr) => arr.findIndex((x) => x[1] === v[1]) === i).map(([k, l]) => chip(l, R.ecmoMode === k, 'repSet', 'data-k="ecmoMode" data-v="' + k + '"')).join('') + '</div>' +
    (R.ecmoMode === 'custom' ? '<div class="two mt"><input type="date" data-in="rep" data-k="ecmoA" value="' + R.ecmoA + '" aria-label="From"><input type="date" data-in="rep" data-k="ecmoB" value="' + R.ecmoB + '" aria-label="To"></div>' : '') +
    '<button class="btn block mt" data-act="openReport" data-kind="ecmo">Preview</button></div>';
  s += '<div class="sec"><h2>CPD</h2></div><div class="card" data-mod="cpd"><h3>Annual CPD report</h3><p>Hours against CICM requirements, program-level requirements, and every activity, ready to email to the College.</p><div class="chips">' + years.map((y) => chip(String(y), R.cpdYear === y, 'repSet', 'data-k="cpdYear" data-v="' + y + '" data-num="1"')).join('') + '</div><button class="btn block mt" data-act="openReport" data-kind="cpd">Preview</button></div>';
  s += '<div class="sec"><h2>Your data</h2></div><div class="card"><h3>Backup</h3><p>' + (S.settings.lastBackup ? 'Last backup ' + esc(fmtDate(S.settings.lastBackup.slice(0, 10), { year: true })) + '.' : 'No backup yet.') + ' A backup file holds everything, including label photos. Save it to Files or email it to yourself.</p><button class="btn ghost block" data-act="backup">Back up now</button></div>';
  return s;
}
function repPatientResults() {
  const q = norm(UI.rep.pq.trim());
  const last = (p) => { const ds = S.days.filter((d) => d.pid === p.id).map((d) => d.date).sort(); return ds[ds.length - 1] || ''; };
  let list = S.patients.filter((p) => S.days.some((d) => d.pid === p.id) && patientMatches(p, q));
  list = list.map((p) => ({ p, l: last(p) })).sort((x, y) => (x.p.status === 'active' ? 0 : 1) - (y.p.status === 'active' ? 0 : 1) || (x.l < y.l ? 1 : -1)).slice(0, q ? 8 : 5);
  if (!list.length) return '<div class="empty">' + (q ? 'No patients match \u201c' + esc(UI.rep.pq) + '\u201d.' : 'No billing recorded yet.') + '</div>';
  return '<div class="group">' + list.map(({ p, l }) => '<button class="row tap" data-act="repPick" data-pid="' + p.id + '">' + thumb(p) + '<div class="main"><div class="t">' + esc(patientName(p)) + '</div><div class="s">' + esc([p.status === 'active' ? 'Active' : 'Discharged', p.fund, l ? 'last billed ' + fmtDate(l, { dow: false }) : ''].filter(Boolean).join(', ')) + '</div></div></button>').join('') + '</div>';
}
function repPatientCard(R) {
  let c = '<div class="card" data-mod="bill"><h3>One patient</h3><p>Just one patient\u2019s sheet: their whole stay, a single day, or a date range.</p>';
  const P = R.pid ? patientById(R.pid) : null;
  if (!P) return c + searchBox(R.pq, 'repPQ', 'Search name, UR or fund') + '<div id="repPatients">' + repPatientResults() + '</div></div>';
  const pd = daysFor(P.id);
  const first = pd.length ? pd[pd.length - 1].date : '', last = pd.length ? pd[0].date : '';
  c += '<div class="row" style="padding:8px 0;min-height:0">' + thumb(P) + '<div class="main"><div class="t">' + esc(patientName(P)) + '</div><div class="s">' + esc(plural(pd.length, 'day') + ' billed' + (pd.length ? ', ' + fmtDate(first, { dow: false }) + (first !== last ? ' to ' + fmtDate(last, { dow: false }) : '') : '')) + '</div></div><button class="btn sm ghost" data-act="repPick" data-pid="">Change</button></div>';
  c += '<div class="chips mt">' + [['stay', 'Whole stay'], ['day', 'One day'], ['range', 'Date range']].map(([k, l]) => chip(l, R.pMode === k, 'repSet', 'data-k="pMode" data-v="' + k + '"')).join('') + '</div>';
  if (R.pMode === 'day') c += '<select class="mt" data-ch="repPDay" aria-label="Day of care">' + pd.map((d) => '<option value="' + d.date + '"' + ((R.pDay || last) === d.date ? ' selected' : '') + '>' + esc(fmtDate(d.date) + ', ' + plural(dayAllCodes(d).length, 'item')) + '</option>').join('') + '</select>';
  if (R.pMode === 'range') c += '<div class="two mt"><input type="date" data-in="rep" data-k="pA" value="' + esc(R.pA || first) + '" aria-label="From"><input type="date" data-in="rep" data-k="pB" value="' + esc(R.pB || last) + '" aria-label="To"></div>';
  return c + '<button class="btn block mt" data-act="repPatient"' + (pd.length ? '' : ' disabled') + '>Preview</button></div>';
}
function openPatientReportChooser(pid) {
  const p = patientById(pid); const days = daysFor(pid);
  openSheet({
    mod: 'bill', st: {},
    render: () => ({
      title: 'Billing sheet', sub: patientName(p) + ': choose the days to include',
      body: days.length ? '<div class="group"><button class="row tap" data-act="repPatientGo" data-pid="' + pid + '" data-a="" data-b=""><div class="main"><div class="t">Whole stay</div><div class="s">' + esc(plural(days.length, 'day') + ', ' + fmtDate(days[days.length - 1].date, { dow: false }) + (days.length > 1 ? ' to ' + fmtDate(days[0].date, { dow: false }) : '')) + '</div></div></button></div>' +
        '<div class="small muted" style="margin:16px 2px 8px;font-weight:650">Or a single day</div><div class="group">' + days.map((d) => '<button class="row tap" data-act="repPatientGo" data-pid="' + pid + '" data-a="' + d.date + '" data-b="' + d.date + '"><div class="main"><div class="t">' + esc(fmtDate(d.date)) + '</div>' + codesHTML(dayAllCodes(d)) + '</div>' + (d.sent ? '<span class="pill ok">Sent</span>' : '<span class="pill warn">Not sent</span>') + '</button>').join('') + '</div>'
        : '<div class="empty"><b>No billing yet</b>Bill a day of care first.</div>'
    })
  });
}
function emailKeyFor(kind) { return { secretary: 'billing', fund: 'fund', ecmo: 'ecmo', cpd: 'cpd', patient: 'billing' }[kind] || 'billing'; }
function composeEmail(kind, rep) {
  const nm = S.settings.name || '';
  const first = nm.replace(/^Dr\.?\s+/i, '').split(' ')[0];
  const hi = kind === 'secretary' || kind === 'patient' ? 'Hi' + (S.settings.secretaryName ? ' ' + S.settings.secretaryName : '') + ',\n\n' : 'Hello,\n\n';
  const body = {
    secretary: 'Please find attached billing for processing: ' + (rep.meta || '') + '.',
    patient: 'Please find attached the billing sheet for ' + (rep.patientName || '') + (rep.meta ? ', ' + rep.meta : '') + '.',
    fund: 'Please find attached ' + rep.title.toLowerCase() + ' for ' + (rep.meta || '') + '.',
    ecmo: 'Please find attached my ECMO practice record for ' + (rep.meta || '') + ', for credentialing and accreditation.',
    cpd: 'Please find attached my CPD record for ' + (rep.meta || '') + ' under the CICM CPD Program.'
  }[kind] || 'Please find the attached report.';
  return { subject: rep.title + (rep.meta ? ', ' + rep.meta : ''), body: hi + body + '\n\nThanks,\n' + (first || nm) };
}
async function openReport(kind, params = {}) {
  const pv = { kind, loading: true, rep: null, pdf: null, to: S.settings.emails[emailKeyFor(kind)] || '', shared: false, marked: false };
  const pg = openPage(null, { mod: kind === 'ecmo' ? 'ecmo' : kind === 'cpd' ? 'cpd' : 'bill', static: true });
  pg.pv = pv;
  pg.el.innerHTML = '<div class="in">' + pageHead('Close', 'Report preview') + '<div class="empty"><b>Preparing report…</b>This takes a moment for larger reports.</div></div>';
  await new Promise((r) => setTimeout(r, 30));
  try {
    let rep;
    if (kind === 'secretary') { rep = await buildSecretaryReport(params.days, { title: params.title }); rep.meta = fmtRange(...(params.range || [rep.days.length ? rep.days.map((d) => d.date).sort()[0] : today(), rep.days.length ? rep.days.map((d) => d.date).sort().pop() : today()])); }
    else if (kind === 'patient') {
      const p = patientById(params.pid);
      const pd = S.days.filter((d) => d.pid === params.pid && (!params.a || (d.date >= params.a && d.date <= params.b)));
      if (!pd.length) throw new Error('No billing recorded for ' + patientName(p) + (params.a ? ' on those dates.' : '.'));
      rep = await buildSecretaryReport(pd, { title: 'Billing for ' + patientName(p), summary: false, fileLabel: patientName(p) });
      rep.meta = fmtRange(rep.range[0], rep.range[1]); rep.patientName = patientName(p);
    }
    else if (kind === 'fund') { rep = await buildFundReport(params.fund, params.a, params.b, { sheets: params.sheets }); rep.meta = fmtRange(params.a, params.b); }
    else if (kind === 'ecmo') { rep = buildEcmoReport(params.a, params.b); rep.meta = fmtRange(params.a, params.b); }
    else if (kind === 'cpd') { rep = buildCpdReport(params.year); rep.meta = String(params.year); }
    pv.rep = rep; pv.loading = false;
  } catch (e) {
    console.error(e);
    pg.el.innerHTML = '<div class="in">' + pageHead('Close', 'Report preview') + '<div class="empty"><b>The report couldn’t be built</b>' + esc(e.message || '') + '</div></div>';
    return;
  }
  const rep = pv.rep;
  pg.el.innerHTML = '<div class="in">' + pageHead('Close', 'Report preview') + '<h1 style="font-size:24px;margin:4px 0 2px;letter-spacing:-.02em">' + esc(rep.title) + '</h1><p class="note" style="margin-top:0">' + esc(rep.meta || '') + ', ' + plural(rep.pages.length, 'page') + '</p><div id="pvSend"></div><div class="pv-pages" id="pvPages"></div></div>';
  const host = $('#pvPages', pg.el);
  rep.pages.forEach((c) => host.appendChild(c));
  renderSendBox(pg);
  try { pv.pdf = await pagesToPDF(rep.pages, rep.title); } catch (e) { console.error(e); }
  renderSendBox(pg);
}
function renderSendBox(pg) {
  const pv = pg.pv; const box = $('#pvSend', pg.el); if (!box) return;
  const ready = !!pv.pdf;
  const unsent = (pv.rep.days || []).filter((d) => !d.sent);
  const billing = ['secretary', 'patient', 'fund'].includes(pv.kind);
  const toLabel = { secretary: 'Secretary’s email', patient: 'Secretary’s email', fund: 'Send to', ecmo: 'Send to (e.g. ECMO director or credentialing committee)', cpd: 'Send to (CICM or yourself)' }[pv.kind];
  let est = '';
  if (billing && (pv.rep.days || []).length) {
    const days = pv.rep.days; const total = sum(days, dayFee); const items = sum(days, (d) => dayAllCodes(d).length);
    const custom = Object.keys(S.settings.itemFees || {}).some((c) => userFee(c) != null);
    est = '<div class="estbill"><div class="small muted">Estimated billing</div><div class="v">' + fmtMoney(total) + '</div><div class="small muted">' + plural(items, 'item') + ' across ' + plural(days.length, 'patient-day') + ', at ' + (custom ? 'MBS schedule rates with your own rates where set' : 'MBS schedule rates') + '. An estimate only: no multiple-operation rule or gap applied.</div></div>';
  }
  box.innerHTML = '<div class="sendbox">' + est + '<div class="field"><label for="pv-to">' + esc(toLabel) + '</label><input id="pv-to" type="email" data-in="pvTo" value="' + esc(pv.to) + '" placeholder="name@example.com" autocomplete="email" inputmode="email"><div class="hint">Saved for next time. Mail opens with the PDF attached; the address is copied so you can paste it into To.</div></div>' +
    '<div class="btnrow"><button class="btn" data-act="pvEmail"' + (ready ? '' : ' disabled') + '>' + svg(I.mail) + (ready ? 'Email PDF' : 'Preparing PDF…') + '</button><button class="btn ghost" data-act="pvShare"' + (ready ? '' : ' disabled') + '>' + svg(I.share) + 'Save or share</button></div>' +
    (pv.rep.csv ? '<button class="link mt" style="display:block;margin-top:12px" data-act="pvCsv">Share as a spreadsheet (CSV)</button>' : '') +
    (billing && unsent.length && !pv.marked ? '<div class="toggle mt" style="border-top:1px solid var(--line-2);margin-top:12px;padding-top:12px"><div class="main small">' + plural(unsent.length, 'patient-day') + ' in this report ' + (unsent.length === 1 ? 'is' : 'are') + ' not marked as sent.</div><button class="btn sm soft" data-act="pvMark">Mark as sent</button></div>' : '') +
    (billing && pv.marked ? '<p class="note">Marked as sent to your secretary.</p>' : '') +
    (SANDBOXED ? '<p class="note">This is the claude.ai preview, so Email PDF saves the file instead of opening Mail. On Denzil\u2019s phone it opens a Mail draft with the PDF attached.</p>' : '') + '</div>';
}
async function shareFile(file, emailInfo) {
  if (SANDBOXED) {
    try {
      const dl = window.claude && window.claude.use ? await window.claude.use('downloads') : null;
      if (dl) { await dl.save({ filename: file.name, data: file }); return 'preview-saved'; }
    } catch (e) { if (e && e.code === 'declined') return 'cancelled'; }
    toast('Saving files is switched off in this preview. It works in the installed app.'); return 'blocked';
  }
  try {
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({ files: [file], title: emailInfo ? emailInfo.subject : file.name, text: emailInfo ? emailInfo.body : undefined });
      return 'shared';
    }
  } catch (e) { if (e && e.name === 'AbortError') return 'cancelled'; }
  const url = URL.createObjectURL(file);
  const a = document.createElement('a'); a.href = url; a.download = file.name; document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 30000);
  return 'downloaded';
}

/* ---------------- Settings ---------------- */
function openSettings(section) {
  const pg = openPage(() => settingsHTML(), { mod: 'bill' });
  if (section) setTimeout(() => { const el = $('#set-' + section, pg.el); if (el) el.scrollIntoView({ block: 'start' }); }, 50);
}
function settingsHTML() {
  const st = S.settings;
  const sec = (id, t) => '<div class="sec" id="set-' + id + '"><h2>' + t + '</h2></div>';
  const inp = (label, k, val, type = 'text', ph = '') => '<div class="field"><label>' + label + '</label><input type="' + type + '" data-in="set" data-k="' + k + '" value="' + esc(val || '') + '" placeholder="' + esc(ph) + '"></div>';
  let s = pageHead('Done', 'Settings');
  s += sec('you', 'Your details') + '<div class="card">' + inp('Name on forms and reports', 'name', st.name) + '<div class="two">' + inp('CICM ID', 'cicmId', st.cicmId) + inp('AHPRA registration', 'ahpra', st.ahpra, 'text', 'MED000…') + '</div></div>';
  s += sec('hosp', 'Hospitals and provider numbers') + '<div class="card">' + st.hospitals.map((h, i) => {
    const inUse = S.patients.some((p) => p.hospital === h.id) || S.days.some((d) => d.loc && d.loc.hospital === h.id);
    const isDef = st.defaultHospital === h.id;
    return '<div class="two"><div class="field"><label>Hospital</label><input type="text" data-in="hosp" data-i="' + i + '" data-k="name" value="' + esc(h.name) + '"></div><div class="field"><label>Provider number</label><input type="text" autocapitalize="characters" data-in="hosp" data-i="' + i + '" data-k="provider" value="' + esc(h.provider) + '"></div></div>' +
      '<div class="btnrow" style="margin:-6px 0 16px;align-items:center">' + chip(isDef ? 'Default for new patients' : 'Make default', isDef, 'hospDefault', 'data-i="' + i + '"') + '<span style="flex:1"></span>' + (inUse ? '<span class="small muted">In use</span>' : '<button class="link" data-act="hospDel" data-i="' + i + '">Remove</button>') + '</div>';
  }).join('') +
    '<div class="panel"><span class="flabel">Add a hospital</span><div class="two"><input type="text" id="newHospName" placeholder="Hospital name"><input type="text" id="newHospProv" placeholder="Provider number" autocapitalize="characters"></div><button class="btn block mt" data-act="hospAdd">Add hospital</button></div>' +
    '<p class="note">Provider numbers are specific to each hospital, so each billing sheet prints the number for the hospital the patient was in that day. A hospital with patients can\u2019t be removed.</p></div>';
  s += sec('email', 'Report emails') + '<div class="card">' + inp('Secretary’s name', 'secretaryName', st.secretaryName, 'text', 'Used to greet them in emails') +
    [['billing', 'Billing sheets go to'], ['fund', 'Health fund reports go to'], ['ecmo', 'ECMO record goes to'], ['cpd', 'CPD report goes to']].map(([k, l]) => '<div class="field"><label>' + l + '</label><input type="email" inputmode="email" data-in="setEmail" data-k="' + k + '" value="' + esc(st.emails[k] || '') + '" placeholder="name@example.com"></div>').join('') + '</div>';
  s += sec('funds', 'Health funds') + '<div class="card"><div class="chips">' + st.funds.map((f, i) => '<button class="chip" data-act="fundDel" data-i="' + i + '" aria-label="Remove ' + esc(f) + '">' + esc(f) + ' ×</button>').join('') + '</div><div class="two mt"><input type="text" id="newFund" placeholder="Add a fund"><button class="btn ghost" data-act="fundAdd">Add</button></div><p class="note">The funds you use most move to the front automatically.</p></div>';
  s += sec('locs', 'CPD and ECMO locations') + '<div class="card"><div class="chips">' + st.locations.map((f, i) => '<button class="chip" data-act="locDel" data-i="' + i + '" aria-label="Remove ' + esc(f) + '">' + esc(f) + ' ×</button>').join('') + '</div><div class="two mt"><input type="text" id="newLocS" placeholder="Add a location"><button class="btn ghost" data-act="locAddS">Add</button></div></div>';
  s += sec('items', 'Billing items') + '<div class="card"><p>Fees default to the MBS schedule fee. Set your own rate for any item, hide items you never use, or add one that isn’t on the form.</p><button class="btn ghost block" data-act="itemsPage">Manage billing items</button></div>';
  s += sec('ecmo', 'ECMO targets') + '<div class="card" data-mod="ecmo"><div class="field"><label>Count activity over</label><select data-ch="ecmoPeriod">' + Object.entries(ECMO_PERIOD_LABELS).map(([k, l]) => '<option value="' + k + '"' + (st.ecmoPeriod.mode === k ? ' selected' : '') + '>' + l + '</option>').join('') + '</select></div>' +
    (st.ecmoPeriod.mode === 'since' ? '<div class="field"><label>Accreditation period started</label><input type="date" data-in="ecmoSince" value="' + esc(st.ecmoPeriod.since || '') + '"></div>' : '') +
    '<div class="two">' + ECMO_TYPES.map((t) => '<div class="field"><label>' + esc(t.name) + '</label><input type="number" min="0" inputmode="numeric" data-in="ecmoT" data-k="' + t.id + '" value="' + esc(st.ecmoTargets[t.id]) + '"></div>').join('') + '</div><p class="note">Starting targets only. Set them to your unit’s credentialing requirements; 0 means no target.</p></div>';
  s += sec('cpd', 'CPD requirements') + '<div class="card" data-mod="cpd"><div class="two">' + [['total', 'Total hours a year'], ['ea', 'Educational activities'], ['rp', 'Reviewing performance'], ['mo', 'Measuring outcomes'], ['rpmo', 'Reviewing + measuring combined']].map(([k, l]) => '<div class="field"><label>' + l + '</label><input type="number" step="0.5" min="0" inputmode="decimal" data-in="cpdT" data-k="' + k + '" value="' + esc(st.cpdTarget[k]) + '"></div>').join('') + '</div>' +
    '<div class="two"><div class="field"><label>SHLR triennium starts</label><input type="number" data-in="shlr" data-k="0" value="' + st.shlrTriennium[0] + '"></div><div class="field"><label>SHLR triennium ends</label><input type="number" data-in="shlr" data-k="1" value="' + st.shlrTriennium[1] + '"></div></div><p class="note">Defaults follow the CICM CPD Program for 2026: 50 hours, at least 12.5 educational, 25 across reviewing performance and measuring outcomes (at least 5 each), a PDP, and one activity for each program-level requirement.</p></div>';
  s += sec('ocr', 'Reading patient labels') + '<div class="card"><p>After you photograph a label, Caring Intensively reads the name, UR, health fund and referring doctor and fills them in for you to check. It runs on this phone and the photo never leaves it. Run the test once on Wi-Fi to download the reader (about 7 MB) so it also works offline.</p><div id="ocrTest"></div><button class="btn ghost block" data-act="ocrTest">Test the label reader</button></div>';
  s += sec('install', 'Install on your phone') + '<div class="card"><ul class="cap-list"><li>iPhone: open Caring Intensively in Safari, tap Share, then Add to Home Screen.</li><li>Android: open in Chrome, tap the menu, then Add to Home screen.</li><li>Once installed, Caring Intensively works offline and opens like any other app.</li></ul></div>';
  s += sec('data', 'Your data') + '<div class="card"><p>Records and photos are stored only on this phone, in this browser. ' + (Store.ok ? 'Storage is working.' : '<b>Storage is unavailable here, so changes won’t be kept after you close this page.</b>') + '</p>' +
    '<div class="btnrow"><button class="btn ghost" data-act="backup">Back up now</button><button class="btn ghost" data-act="restore">Restore a backup</button></div>' +
    (st.demo ? '<button class="btn ghost block mt" data-act="clearDemo">Clear sample data</button>' : '<button class="btn ghost block mt" data-act="loadDemo">Load 12 months of sample data</button>') +
    '<button class="btn danger block mt" data-act="wipe">Delete all data</button></div>';
  s += '<p class="note mt2">Caring Intensively ' + APP_VERSION + '. Billing criteria summarised from MBS Online (schedule from 1 July 2026); CPD rules from the CICM CPD Program 2026. Check MBS Online and the CICM portal for the authoritative versions.</p>';
  return s;
}
function openItemsPage() {
  openPage(() => {
    let s = pageHead('Settings', 'Billing items');
    s += SECTIONS.map((sec) => {
      const its = ITEM_LIST.filter((it) => it.section === sec.id);
      if (!its.length) return '';
      return '<div class="sec"><h2 style="font-size:16px">' + esc(sec.name) + '</h2></div><div class="group">' + its.map((it) => '<div class="row" style="flex-wrap:wrap"><div class="main"><div class="t">' + esc(it.code) + ' <span style="font-weight:400">' + esc(it.label) + '</span></div><div class="s">' + (it.scheduleFee != null ? 'MBS fee $' + it.scheduleFee.toFixed(2) : (it.code === '25025' ? 'MBS: 50% of the anaesthesia fee' : 'No MBS fee recorded')) + (userFee(it.code) != null ? ', using your rate' : '') + '</div></div>' +
        '<input type="number" step="0.05" min="0" inputmode="decimal" style="width:110px;min-height:40px" data-in="itemFee" data-k="' + it.code + '" value="' + esc(userFee(it.code) != null ? userFee(it.code) : '') + '" placeholder="' + (it.scheduleFee != null ? it.scheduleFee.toFixed(2) : 'Fee') + '" aria-label="Fee for ' + it.code + '">' +
        '<button class="switch' + (it.hidden ? '' : ' on') + '" data-act="itemHide" data-k="' + it.code + '" aria-label="Show ' + it.code + '"></button>' + (it.custom ? '<button class="link" data-act="itemDel" data-k="' + it.code + '" style="width:100%;text-align:left">Delete this custom item</button>' : '') + '</div>').join('') + '</div>';
    }).join('');
    s += '<div class="sec"><h2>Add an item</h2></div><div class="card"><div class="two"><div class="field"><label>Item number</label><input type="text" id="ci-code" inputmode="numeric"></div><div class="field"><label>Short label</label><input type="text" id="ci-label"></div></div><div class="field"><label>Criteria (optional)</label><textarea id="ci-crit"></textarea></div><div class="toggle"><div class="main">Needs start and finish times</div><button class="switch" id="ci-timed" data-act="flipSelf" aria-label="Needs times"></button></div><button class="btn block" data-act="itemAdd">Add item</button></div>';
    s += '<p class="note">Fees default to the MBS schedule fee shown in each box. Type your own rate to override it, or clear the box to go back to the MBS fee. Fees are only used for estimates; the switch shows or hides an item in the billing list.</p>';
    return s;
  }, { mod: 'bill' });
}

/* ---------------- Backup, restore, demo ---------------- */
async function doBackup() {
  const photos = {};
  for (const k of await Store.keys('photos')) { const b = await Store.get('photos', k); if (b) photos[k] = b instanceof Blob ? await blobToDataURL(b) : b; }
  S.settings.lastBackup = new Date().toISOString();
  const data = { app: 'gills', version: 1, exported: S.settings.lastBackup, state: S, photos };
  const file = new File([JSON.stringify(data)], 'Caring Intensively backup ' + fmtDMY(today()).replace(/\//g, '-') + '.json', { type: 'application/json' });
  const r = await shareFile(file);
  if (r === 'shared' || r === 'downloaded' || r === 'preview-saved') { changed(); toast('Backup saved'); }
  else if (r !== 'blocked') S.settings.lastBackup = null;
}
async function doRestore(file) {
  try {
    const data = JSON.parse(await file.text());
    if (data.app !== 'gills' || !data.state) throw new Error('That file isn’t a Caring Intensively backup.');
    const ok = await confirmSheet({ title: 'Restore this backup?', text: 'This replaces everything on this phone with the backup from ' + fmtDate(String(data.exported || '').slice(0, 10), { year: true }) + '.', ok: 'Replace and restore', danger: true });
    if (!ok) return;
    await Store.clear('photos');
    for (const [k, v] of Object.entries(data.photos || {})) await Store.put('photos', k, await dataURLToBlob(v));
    S = data.state; S.settings = Object.assign(defaultSettings(), S.settings);
    Object.keys(photoCache).forEach((k) => delete photoCache[k]);
    closeAllPages(); changed(); toast('Backup restored');
  } catch (e) { toast(e.message || 'Could not read that file'); }
}
function loadDemo() {
  const d = makeDemoData();
  S.patients = d.patients; S.days = d.days; S.ecmo = d.ecmo; S.cpd = d.cpd;
  S.settings.locations = Array.from(new Set(d.locations.concat(S.settings.locations)));
  S.settings.demo = true; S.settings.onboarded = true;
  S.settings.emails = Object.assign({}, S.settings.emails);
}
async function clearAll(keepSettings = true) {
  S.patients = []; S.days = []; S.ecmo = []; S.cpd = [];
  S.settings.demo = false;
  if (!keepSettings) S.settings = Object.assign(defaultSettings(), { onboarded: false });
  await Store.clear('photos');
  Object.keys(photoCache).forEach((k) => delete photoCache[k]);
}

/* ---------------- Event handling ---------------- */
const ACT = {
  tab: (el) => goTab(el.dataset.tab),
  settings: (el) => openSettings(el.dataset.v),
  closePage: () => closePage(),
  closeSheet: () => closeSheet(),
  confirmOk: () => curSheet().ok(),
  hideInstall: () => { S.settings.installTipHidden = true; changed(); },
  startEmpty: () => { S.settings.onboarded = true; changed(); requestPersistence(); },
  startDemo: () => { loadDemo(); changed(); toast('Loaded 12 months of sample data'); },
  loadDemo: async () => {
    if (S.days.length + S.cpd.length + S.ecmo.length && !S.settings.demo) { const ok = await confirmSheet({ title: 'Replace your records with sample data?', text: 'Your own records on this phone will be deleted. Back up first if you want to keep them.', ok: 'Replace with sample data', danger: true }); if (!ok) return; }
    await clearAll(); loadDemo(); closeAllPages(); changed(); toast('Loaded 12 months of sample data');
  },
  clearDemo: async () => { const ok = await confirmSheet({ title: 'Clear the sample data?', text: 'All sample patients, ECMO and CPD records will be removed so you can start your own.', ok: 'Clear sample data', danger: true }); if (!ok) return; await clearAll(); closeAllPages(); UI.tab = 'home'; changed(); toast('Sample data cleared'); },
  wipe: async () => { const ok = await confirmSheet({ title: 'Delete all data?', text: 'Every patient, label photo, ECMO and CPD record on this phone will be permanently deleted.', ok: 'Delete everything', danger: true }); if (!ok) return; await clearAll(false); closeAllPages(); changed(); },
  backup: () => doBackup(),
  restore: () => { const inp = $('#jsonIn'); inp.value = ''; inp.click(); },
  newPatient: () => { ocrWarmUp(); pickPhoto('cam', (blob) => openPatientForm({ photoBlob: blob })); },
  newPatientNoPhoto: () => openPatientForm({}),
  pfPhoto: (el) => { ocrWarmUp(); const sh = curSheet(); pickPhoto(el.dataset.v, (blob) => { const s = sh.st; s.photoBlob = blob; s.photoURL = URL.createObjectURL(blob); s.ocr = { status: 'idle', lines: [], filled: {} }; s.ocrConfirmed = false; sh.update(); if (!s.edit || !s.name) runOcr(sh); }); },
  pfRead: () => { const sh = curSheet(); sh.st.ocrConfirmed = false; ['name', 'ur', 'refDoc'].forEach((k) => { if (sh.st.ocr && sh.st.ocr.filled && sh.st.ocr.filled[k]) sh.st[k] = ''; }); sh.update(); runOcr(sh); },
  ocrUse: (el) => {
    const sh = curSheet(); const line = sh.st.ocr.lines[Number(el.dataset.i)] || ''; const k = el.dataset.k;
    let v = line;
    if (k === 'ur') { const m = line.match(/[A-Z]{0,2}\d[\d ]{3,11}\d/); v = m ? m[0].replace(/\s+/g, '') : line; }
    else { v = line.replace(/\b(DOB|UR|URN|MRN)\b.*$/i, '').replace(/\s+[MF]$/, '').trim(); }
    sh.st[k] = v; sh.st.ocr.filled[k] = true;
    const el2 = $(k === 'ur' ? '#pf-u' : '#pf-n', sh.el); if (el2) { el2.value = v; el2.classList.add('auto'); }
    toast((k === 'ur' ? 'UR' : 'Name') + ' set to ' + v);
  },
  ocrConfirm: () => { const sh = curSheet(); sh.st.ocrConfirmed = true; $$('input.auto', sh.el).forEach((i) => i.classList.remove('auto')); const b = $('#ocrBox', sh.el); if (b) b.innerHTML = ocrBoxHTML(sh.st); },
  ocrConfirmSave: (el) => { closeSheet(); const sh = curSheet(); sh.st.ocrConfirmed = true; savePatientForm(el.dataset.v || undefined); },
  ocrEdit: () => { closeSheet(); const sh = curSheet(); const first = $('input.auto', sh.el); if (first) { first.scrollIntoView({ block: 'center' }); first.focus(); if (first.select) first.select(); } },
  pfWard: (el) => { curSheet().st.ward = el.dataset.v; curSheet().update(); },
  pfHospAdd: () => { curSheet().st.addingHosp = true; curSheet().update(); },
  pfHospSave: () => { const s = curSheet().st; const h = addHospital(s.newHospName, s.newHospProv); if (h) { s.hospital = h.id; s.addingHosp = false; s.newHospName = ''; s.newHospProv = ''; curSheet().update(); } },
  billLocEdit: () => { curSheet().st.locEdit = true; curSheet().update(); },
  billLocSet: (el) => { const st = curSheet().st; st.loc[el.dataset.k] = el.dataset.v; curSheet().update(); },
  billMoveFlip: () => { const st = curSheet().st; st.moveCurrent = !st.moveCurrent; curSheet().update(); },
  billLocDone: () => { curSheet().st.locEdit = false; curSheet().update(); },
  pfFund: (el) => { const s = curSheet().st; s.fund = s.fund === el.dataset.v ? '' : el.dataset.v; curSheet().update(); },
  pfMoreFunds: () => { curSheet().st.moreFunds = true; curSheet().update(); },
  pfAddFund: () => { const s = curSheet().st; const f = (s.addFund || '').trim(); if (!f) return; if (!S.settings.funds.includes(f)) S.settings.funds.push(f); s.fund = f; s.addFund = ''; save(); curSheet().update(); },
  pfHosp: (el) => { curSheet().st.hospital = el.dataset.v; curSheet().update(); },
  pfSave: (el) => savePatientForm(el.dataset.v),
  patient: (el) => openPatient(el.dataset.pid),
  editPatient: (el) => openPatientForm({ pid: el.dataset.pid }),
  deletePatient: async (el) => {
    const p = patientById(el.dataset.pid);
    const ok = await confirmSheet({ title: 'Delete ' + patientName(p) + '?', text: 'This removes the patient, their label photo and all ' + plural(S.days.filter((d) => d.pid === p.id).length, 'day') + ' of billing. It can’t be undone.', ok: 'Delete patient', danger: true });
    if (!ok) return;
    S.days = S.days.filter((d) => d.pid !== p.id); S.patients = S.patients.filter((x) => x.id !== p.id);
    if (p.photoId) Store.del('photos', p.photoId);
    closeSheet(); closeAllPages(); changed(); toast('Patient deleted');
  },
  viewPhoto: async (el) => { const u = await photoForPatient(patientById(el.dataset.pid)); if (u) openViewer(u); },
  addPhoto: (el) => pickPhoto('cam', async (blob) => { const p = patientById(el.dataset.pid); p.photoId = await savePhoto(blob); p.demoLabel = false; changed(); }),
  bill: (el) => openBill(el.dataset.pid, today()),
  billOther: (el) => openBill(el.dataset.pid, today()),
  openDay: (el) => { const d = S.days.find((x) => x.id === el.dataset.id); if (d) openBill(d.pid, d.date); },
  discharge: async (el) => {
    const p = patientById(el.dataset.pid);
    const billed = dayFor(p.id, today());
    const ok = await confirmSheet({ title: 'Discharge ' + patientName(p) + '?', text: (billed ? '' : 'Nothing is billed for today yet. ') + 'They’ll move off your active list. Their billing stays in History.', ok: 'Discharge' });
    if (!ok) return;
    p.status = 'discharged'; p.dischargedAt = today();
    closeAllPages(); changed();
    toast('Discharged ' + patientName(p), { action: 'Undo', fn: () => { p.status = 'active'; p.dischargedAt = null; changed(); } });
  },
  readmit: (el) => { const p = patientById(el.dataset.pid); p.status = 'active'; p.dischargedAt = null; changed(); toast(patientName(p) + ' is back on your active list'); },
  patientReport: (el) => openPatientReportChooser(el.dataset.pid),
  repPatientGo: (el) => { closeSheet(); openReport('patient', { pid: el.dataset.pid, a: el.dataset.a || null, b: el.dataset.b || null }); },
  repPick: (el) => { UI.rep.pid = el.dataset.pid || ''; UI.rep.pDay = ''; UI.rep.pA = ''; UI.rep.pB = ''; render(); },
  repDayStep: (el) => { UI.rep.billDay = addDays(UI.rep.billDay, Number(el.dataset.v)); render(); },
  repDay: () => { const d = UI.rep.billDay; const days = S.days.filter((x) => x.date === d); if (!days.length) { toast('No billing recorded on ' + fmtDate(d)); return; } openReport('secretary', { days, range: [d, d], title: 'Billing for ' + fmtDate(d, { year: true }) }); },
  repPatient: () => {
    const R = UI.rep; const pd = daysFor(R.pid); if (!pd.length) return;
    let a = null, b = null;
    if (R.pMode === 'day') { a = b = R.pDay || pd[0].date; }
    if (R.pMode === 'range') { a = R.pA || pd[pd.length - 1].date; b = R.pB || pd[0].date; if (a > b) [a, b] = [b, a]; }
    openReport('patient', { pid: R.pid, a, b });
  },
  billReport: () => { const st = curSheet().st; closeSheet(); openReport('patient', { pid: st.pid, a: st.date, b: st.date }); },
  tog: (el) => { const st = curSheet().st; const c = el.dataset.code; st.sel.has(c) ? st.sel.delete(c) : st.sel.add(c); curSheet().update(); },
  useSugg: () => { const st = curSheet().st; const prev = S.days.filter((d) => d.pid === st.pid && d.date < st.date).sort((a, b) => a.date < b.date ? 1 : -1)[0]; if (prev) nextDayItems(prev.items).forEach((c) => st.sel.add(c)); curSheet().update(); },
  billDay: (el) => { const st = curSheet().st; st.date = addDays(st.date, Number(el.dataset.v)); st.load(); curSheet().update(false); },
  billNow: (el) => { const st = curSheet().st; st.times[el.dataset.k] = nowHM(); curSheet().update(); },
  billAsa: (el) => { curSheet().st.asa = el.dataset.v; curSheet().update(); },
  scrollTimes: () => { const p = $('#timesPanel', curSheet().el); if (p) p.scrollIntoView({ behavior: 'smooth', block: 'center' }); },
  billSave: () => saveBill(false),
  billRemove: () => saveBill(true),
  itemInfo: (el) => openItemInfo(el.dataset.code),
  infoToggle: (el) => { const sh = curSheet(); const par = sh.parent; const c = el.dataset.code; if (par) { par.st.sel.has(c) ? par.st.sel.delete(c) : par.st.sel.add(c); } closeSheet(); if (par) par.update(); },
  colTap: (el) => { const cap = el.closest('.colchart').querySelector('.cap'); cap.textContent = el.dataset.cap; },
  billSeg: (el) => { UI.billSeg = el.dataset.v; render(); },
  histRange: (el) => { UI.hist.range = el.dataset.v; UI.hist.limit = 120; render(); },
  histGroup: (el) => { UI.hist.group = el.dataset.v; render(); },
  histMore: () => { UI.hist.limit += 150; $('#histResults').innerHTML = histResults(); hydrate($('#histResults')); },
  repFromHistory: () => openReport('secretary', { days: histFiltered(), title: 'Billing for processing' }),
  statsRange: (el) => { UI.statsRange = el.dataset.v; render(); },
  ecmoPicker: () => openEcmoPicker(),
  ecmoMore: () => { UI.ecmoLimit = (UI.ecmoLimit || 25) + 50; $('#ecmoResults').innerHTML = ecmoResults(); },
  ecmoLog: (el) => { if (el.dataset.replace) closeSheet(); openEcmo(el.dataset.type); },
  ecmoEdit: (el) => { const e = S.ecmo.find((x) => x.id === el.dataset.id); if (e) openEcmo(e.type, e.id); },
  ecmoFilter: (el) => { UI.ecmoFilter = el.dataset.v; render(); },
  ecSet: (el) => {
    const st = curSheet().st; const k = el.dataset.k; let v = el.dataset.v; if (el.dataset.num) v = Number(v);
    if (el.dataset.multi) { st[k] = st[k] || []; st[k].includes(v) ? st[k].splice(st[k].indexOf(v), 1) : st[k].push(v); }
    else st[k] = st[k] === v && k !== 'location' ? '' : v;
    curSheet().update();
  },
  ecStep: (el) => { const st = curSheet().st; st[el.dataset.k] = Math.max(1, (Number(st[el.dataset.k]) || 1) + Number(el.dataset.v)); curSheet().update(); },
  ecFlip: (el) => { const st = curSheet().st; st[el.dataset.k] = !st[el.dataset.k]; curSheet().update(); },
  locAdd: () => { curSheet().st.addingLoc = true; curSheet().update(); setTimeout(() => { const i = $('input[data-k="newLoc"]', curSheet().el); if (i) i.focus(); }, 30); },
  locSave: () => { const st = curSheet().st; const l = (st.newLoc || '').trim(); if (!l) return; if (!S.settings.locations.includes(l)) S.settings.locations.push(l); st.location = l; st.addingLoc = false; st.newLoc = ''; save(); curSheet().update(); },
  ecmoSave: () => saveEcmo(),
  ecmoDelete: async () => {
    const st = curSheet().st; const sh = curSheet();
    const linked = S.cpd.find((c) => c.ecmoId === st.id);
    const ok = await confirmSheet({ title: 'Delete this entry?', text: linked ? 'The CPD entry created with it will be deleted too.' : 'This can’t be undone.', ok: 'Delete', danger: true });
    if (!ok) return;
    S.ecmo = S.ecmo.filter((e) => e.id !== st.id); if (linked) S.cpd = S.cpd.filter((c) => c !== linked);
    if (curSheet() === sh) closeSheet(); changed(); toast('Deleted');
  },
  cpdNew: () => openCpd(),
  cpdEdit: (el) => openCpd(el.dataset.id),
  cpdRepeat: (el) => openCpd(null, recentCpdTemplates()[Number(el.dataset.i)]),
  cpdFill: (el) => { const t = recentCpdTemplates()[Number(el.dataset.i)]; const st = curSheet().st; Object.assign(st, { type: t.type, cat: t.cat, title: t.title, hours: t.hours, location: t.location, provider: t.provider || '', cape: (t.cape || []).slice() }); curSheet().update(); },
  cpdYear: (el) => { UI.cpdYear += Number(el.dataset.v); render(); },
  cpType: (el) => { const st = curSheet().st; st.type = el.dataset.v; st.cat = cpdType(st.type).cat; if (st.type === 'pdp' && Number(st.hours) > 3) st.hours = 3; if (cpdType(st.type).shlr && Number(st.hours) < 3) st.hours = 3; st.allTypes = false; curSheet().update(); },
  cpAllTypes: () => { curSheet().st.allTypes = true; curSheet().update(); },
  cpCat: (el) => { curSheet().st.cat = el.dataset.v; curSheet().update(); },
  cpSet: (el) => { const st = curSheet().st; let v = el.dataset.v; if (el.dataset.num) v = Number(v); st[el.dataset.k] = v; curSheet().update(); },
  cpCape: (el) => { const st = curSheet().st; st.cape = st.cape || []; const v = el.dataset.v; st.cape.includes(v) ? st.cape.splice(st.cape.indexOf(v), 1) : st.cape.push(v); curSheet().update(); },
  cpFlip: (el) => { const st = curSheet().st; st[el.dataset.k] = !st[el.dataset.k]; curSheet().update(); },
  cpEvidence: () => { const sh = curSheet(); pickPhoto('lib', async (blob) => { sh.st.evidenceId = await savePhoto(blob); sh.update(); }); },
  cpEvidenceRemove: () => { curSheet().st.evidenceId = null; curSheet().update(); },
  cpdSave: () => saveCpd(),
  cpdDelete: async () => { const st = curSheet().st; const sh = curSheet(); const ok = await confirmSheet({ title: 'Delete this CPD activity?', text: 'This can’t be undone.', ok: 'Delete', danger: true }); if (!ok) return; S.cpd = S.cpd.filter((e) => e.id !== st.id); if (curSheet() === sh) closeSheet(); changed(); toast('Deleted'); },
  repSet: (el) => { let v = el.dataset.v; if (el.dataset.num) v = Number(v); UI.rep[el.dataset.k] = v; render(); },
  repFlip: (el) => { UI.rep[el.dataset.k] = !UI.rep[el.dataset.k]; render(); },
  repUnsent: () => { const days = S.days.filter((d) => !d.sent); if (!days.length) { toast('Everything has been sent'); return; } openReport('secretary', { days, title: 'Billing for processing' }); },
  repBill: () => { const R = UI.rep; const [a, b] = R.billRange === 'custom' ? [R.billA, R.billB] : rangeFor(R.billRange); const days = S.days.filter((d) => d.date >= a && d.date <= b); if (!days.length) { toast('No billing between those dates'); return; } openReport('secretary', { days, range: [a, b], title: 'Billing for processing' }); },
  repFund: () => { const R = UI.rep; const [a, b] = R.fundRange === 'custom' ? [R.billA, R.billB] : rangeFor(R.fundRange); openReport('fund', { fund: R.fund, a, b, sheets: R.fundSheets }); },
  openReport: (el) => {
    const kind = el.dataset.kind;
    if (kind === 'ecmo') { const m = UI.rep.ecmoMode; const [a, b] = m === 'custom' ? [UI.rep.ecmoA, UI.rep.ecmoB] : m === 'year' ? rangeFor('year') : m === 'all' ? [S.ecmo.map((e) => e.date).sort()[0] || today(), today()] : ecmoRange(); openReport('ecmo', { a, b }); }
    if (kind === 'cpd') openReport('cpd', { year: Number(el.dataset.year || UI.rep.cpdYear) });
  },
  pvEmail: async () => {
    const pg = pageStack[pageStack.length - 1]; const pv = pg.pv; if (!pv.pdf) return;
    const to = (pv.to || '').trim();
    if (to) { S.settings.emails[emailKeyFor(pv.kind)] = to; save(); }
    const em = composeEmail(pv.kind, pv.rep);
    if (to && navigator.clipboard && navigator.clipboard.writeText && !SANDBOXED) navigator.clipboard.writeText(to).catch(() => { });
    const file = new File([pv.pdf], pv.rep.filename + '.pdf', { type: 'application/pdf' });
    const r = await shareFile(file, em);
    if (r === 'shared') toast(to ? 'Pick Mail, then paste ' + to + ' into To' : 'Report shared', { ms: 5000 });
    if (r === 'preview-saved') toast('PDF saved. On the phone, this button opens Mail with the PDF attached.', { ms: 6000 });
    if (r === 'downloaded') { toast('PDF saved. Your mail app will open; attach the PDF from Downloads.', { ms: 6000 }); setTimeout(() => { location.href = 'mailto:' + encodeURIComponent(to) + '?subject=' + encodeURIComponent(em.subject) + '&body=' + encodeURIComponent(em.body); }, 600); }
    if ((r === 'shared' || r === 'downloaded') && ['secretary', 'patient', 'fund'].includes(pv.kind) && (pv.rep.days || []).some((d) => !d.sent)) {
      setTimeout(async () => { const ok = await confirmSheet({ title: 'Mark as sent?', text: 'Mark ' + plural(pv.rep.days.filter((d) => !d.sent).length, 'patient-day') + ' in this report as sent to your secretary?', ok: 'Mark as sent' }); if (ok) ACT.pvMark(); }, 800);
    }
  },
  pvShare: async () => { const pv = pageStack[pageStack.length - 1].pv; if (!pv.pdf) return; await shareFile(new File([pv.pdf], pv.rep.filename + '.pdf', { type: 'application/pdf' })); },
  pvCsv: async () => { const pv = pageStack[pageStack.length - 1].pv; await shareFile(new File([pv.rep.csv], pv.rep.filename + '.csv', { type: 'text/csv' })); },
  pvMark: () => { const pg = pageStack.find((p) => p.pv); if (!pg) return; const now = new Date().toISOString(); (pg.pv.rep.days || []).forEach((d) => { if (!d.sent) d.sent = now; }); pg.pv.marked = true; save(); renderSendBox(pg); render(); toast('Marked as sent'); },
  hospAdd: () => { const h = addHospital($('#newHospName').value, $('#newHospProv').value); if (h) changed(); },
  hospDel: (el) => { const h = S.settings.hospitals[Number(el.dataset.i)]; if (!h) return; if (S.patients.some((p) => p.hospital === h.id) || S.days.some((d) => d.loc && d.loc.hospital === h.id)) { toast(h.name + ' has patients, so it can\u2019t be removed.'); return; } S.settings.hospitals.splice(Number(el.dataset.i), 1); if (S.settings.defaultHospital === h.id) S.settings.defaultHospital = (S.settings.hospitals[0] || {}).id || ''; changed(); },
  ocrTest: async (el) => {
    const out = $('#ocrTest'); el.disabled = true; out.innerHTML = '<div class="ocrbox"><span class="spin"></span><div class="main"><b>Loading the label reader\u2026</b></div></div>';
    try {
      const t0 = performance.now();
      const sample = demoLabelImage({ name: 'CITIZEN, Jane', ur: '1234567', fund: 'Bupa', memb: '1234 56789', admitted: today(), ward: 'ICU', bed: '3', refDoc: 'Dr A Example', sex: 'F', dob: '01/01/1950', id: 'test' });
      const r = await readLabel(await dataURLToBlob(sample));
      const f = r.fields; const ok = f.name === 'CITIZEN, Jane' && f.ur === '1234567';
      out.innerHTML = '<div class="ocrbox ' + (ok ? 'ok' : 'warn') + '"><div class="main"><b>' + (ok ? 'Ready. ' : 'Loaded, but the test label wasn\u2019t read perfectly. ') + '</b>It read ' + esc([f.name, f.ur ? 'UR ' + f.ur : '', f.fund].filter(Boolean).join(', ') || 'nothing') + ' from a sample label in ' + ((performance.now() - t0) / 1000).toFixed(1) + ' seconds.</div></div>';
    } catch (e) {
      out.innerHTML = '<div class="ocrbox warn"><div class="main"><b>The label reader couldn\u2019t start here.</b><div class="small">' + esc((e && e.message) || String(e)) + '</div></div></div>';
    }
    el.disabled = false;
  },
  hospDefault: (el) => { S.settings.defaultHospital = S.settings.hospitals[Number(el.dataset.i)].id; changed(); },
  fundDel: (el) => { S.settings.funds.splice(Number(el.dataset.i), 1); changed(); },
  fundAdd: () => { const i = $('#newFund'); const v = i.value.trim(); if (v && !S.settings.funds.includes(v)) { S.settings.funds.push(v); changed(); } },
  locDel: (el) => { S.settings.locations.splice(Number(el.dataset.i), 1); changed(); },
  locAddS: () => { const i = $('#newLocS'); const v = i.value.trim(); if (v && !S.settings.locations.includes(v)) { S.settings.locations.push(v); changed(); } },
  itemsPage: () => openItemsPage(),
  itemHide: (el) => { const k = el.dataset.k; const h = S.settings.hiddenItems; h.includes(k) ? h.splice(h.indexOf(k), 1) : h.push(k); changed(); },
  itemDel: (el) => { S.settings.customItems = S.settings.customItems.filter((c) => c.code !== el.dataset.k); changed(); },
  flipSelf: (el) => el.classList.toggle('on'),
  itemAdd: () => {
    const code = $('#ci-code').value.trim(), label = $('#ci-label').value.trim();
    if (!code || !label) { toast('Add an item number and a label'); return; }
    if (ITEM_MAP[code]) { toast(code + ' is already in the list'); return; }
    S.settings.customItems.push({ code, label, criteria: $('#ci-crit').value.trim(), timed: $('#ci-timed').classList.contains('on') });
    changed(); toast('Added ' + code);
  }
};
const IN = {
  set: (el) => { S.settings[el.dataset.k] = el.value; save(); },
  setEmail: (el) => { S.settings.emails[el.dataset.k] = el.value.trim(); save(); },
  hosp: (el) => { S.settings.hospitals[Number(el.dataset.i)][el.dataset.k] = el.value; save(); },
  f: (el) => { const sh = curSheet(); if (!sh) return; sh.st[el.dataset.k] = el.value; if (sh.st.ocr && sh.st.ocr.filled && sh.st.ocr.filled[el.dataset.k]) { delete sh.st.ocr.filled[el.dataset.k]; el.classList.remove('auto'); } },
  billLoc: (el) => { curSheet().st.loc[el.dataset.k] = el.value; },
  fnum: (el) => { const sh = curSheet(); if (sh) { sh.st[el.dataset.k] = el.value === '' ? '' : Number(el.value); $$('.chip[data-k="' + el.dataset.k + '"]', sh.el).forEach((c) => c.classList.toggle('on', Number(c.dataset.v) === Number(el.value))); const btn = $('[data-act="cpdSave"]', sh.el); if (btn) { btn.disabled = !(sh.st.type && Number(el.value) > 0); } } },
  billNote: (el) => { curSheet().st.note = el.value; },
  billQ: (el) => { const sh = curSheet(); sh.st.q = el.value; $('#billList', sh.el).innerHTML = billItemsList(sh.st); const fr = $('.freq', sh.el); if (fr) fr.style.display = el.value ? 'none' : ''; },
  histQ: (el) => { UI.hist.q = el.value; UI.hist.limit = 120; $('#histResults').innerHTML = histResults(); hydrate($('#histResults')); },
  ecmoQ: (el) => { UI.ecmoQ = el.value; $('#ecmoResults').innerHTML = ecmoResults(); },
  cpdQ: (el) => { UI.cpdQ = el.value; $('#cpdResults').innerHTML = cpdResults(); },
  rep: (el) => { UI.rep[el.dataset.k] = el.value; },
  repPQ: (el) => { UI.rep.pq = el.value; const box = $('#repPatients'); if (box) { box.innerHTML = repPatientResults(); hydrate(box); } },
  pvTo: (el) => { const pg = pageStack.find((p) => p.pv); if (pg) pg.pv.to = el.value; },
  ecmoT: (el) => { S.settings.ecmoTargets[el.dataset.k] = Number(el.value) || 0; save(); },
  ecmoSince: (el) => { S.settings.ecmoPeriod.since = el.value; save(); },
  cpdT: (el) => { S.settings.cpdTarget[el.dataset.k] = Number(el.value) || 0; save(); },
  shlr: (el) => { S.settings.shlrTriennium[Number(el.dataset.k)] = Number(el.value) || 0; save(); },
  itemFee: (el) => { if (el.value === '') delete S.settings.itemFees[el.dataset.k]; else S.settings.itemFees[el.dataset.k] = Number(el.value); save(); }
};
const CH = {
  histFund: (el) => { UI.hist.fund = el.value; render(); },
  histStatus: (el) => { UI.hist.status = el.value; render(); },
  billDate: (el) => { if (!el.value) return; const st = curSheet().st; st.date = el.value; st.load(); curSheet().update(false); },
  billTime: (el) => { curSheet().st.times[el.dataset.k] = el.value; curSheet().update(); },
  repFund: (el) => { UI.rep.fund = el.value; },
  repDay: (el) => { if (el.value) { UI.rep.billDay = el.value; render(); } },
  repPDay: (el) => { UI.rep.pDay = el.value; },
  ecmoPeriod: (el) => { S.settings.ecmoPeriod.mode = el.value; if (el.value === 'since' && !S.settings.ecmoPeriod.since) S.settings.ecmoPeriod.since = addDays(today(), -364); changed(); }
};

document.addEventListener('click', (e) => {
  const el = e.target.closest('[data-act]');
  if (!el || el.disabled) return;
  const fn = ACT[el.dataset.act];
  if (fn) { e.preventDefault(); fn(el, e); }
});
document.addEventListener('input', (e) => { const el = e.target.closest('[data-in]'); if (el && IN[el.dataset.in]) IN[el.dataset.in](el); });
document.addEventListener('change', (e) => {
  const el = e.target;
  if (el.id === 'camIn') return onFile('cam', el.files[0]);
  if (el.id === 'libIn') return onFile('lib', el.files[0]);
  if (el.id === 'jsonIn') return el.files[0] && doRestore(el.files[0]);
  const c = el.closest('[data-ch]'); if (c && CH[c.dataset.ch]) CH[c.dataset.ch](c);
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') { if (sheetStack.length) closeSheet(); else if (pageStack.length) closePage(); }
  if (e.key === 'Enter' && e.target.id === 'newFund') ACT.fundAdd();
  if (e.key === 'Enter' && e.target.id === 'newLocS') ACT.locAddS();
  if (e.key === 'Enter' && e.target.id === 'newHospProv') ACT.hospAdd();
  if (e.key === 'Enter' && e.target.dataset && e.target.dataset.k === 'newLoc') ACT.locSave();
});
window.addEventListener('hashchange', () => { const h = location.hash.slice(1); if (TABS.find((t) => t[0] === h) && h !== UI.tab) goTab(h); });
window.addEventListener('pagehide', () => { clearTimeout(saveTimer); Store.put('kv', 'state', JSON.parse(JSON.stringify(S))); });
document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') { clearTimeout(saveTimer); Store.put('kv', 'state', JSON.parse(JSON.stringify(S))); } else render(); });

(async function init() {
  await load();
  const h = location.hash.slice(1);
  if (TABS.find((t) => t[0] === h)) UI.tab = h;
  if (!S.settings.onboarded && (SANDBOXED || h === 'demo')) { loadDemo(); save(); }
  render();
  if ('serviceWorker' in navigator && !SANDBOXED && location.protocol === 'https:') { try { navigator.serviceWorker.register('sw.js'); } catch (e) { } }
})();
