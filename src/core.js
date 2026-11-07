/* ===== Gill-Able: utilities, storage, state, derived data ===== */

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
const esc = (v) => String(v == null ? '' : v).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const sum = (arr, f = (x) => x) => arr.reduce((a, x) => a + (Number(f(x)) || 0), 0);
const fmtH = (h) => { const r = Math.round(h * 10) / 10; return (r % 1 === 0 ? r.toFixed(0) : r.toFixed(1)); };
const plural = (n, one, many) => n + ' ' + (n === 1 ? one : (many || one + 's'));

/* ---- Dates (local, as YYYY-MM-DD strings) ---- */
const pad = (n) => String(n).padStart(2, '0');
const toISO = (d) => d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
const fromISO = (s) => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
const today = () => toISO(new Date());
const addDays = (s, n) => { const d = fromISO(s); d.setDate(d.getDate() + n); return toISO(d); };
const daysBetween = (a, b) => Math.round((fromISO(b) - fromISO(a)) / 86400000);
const DOW = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MONTH_FULL = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const fmtDate = (s, opt = {}) => {
  if (!s) return '';
  const d = fromISO(s);
  const yr = opt.year || d.getFullYear() !== new Date().getFullYear() ? ' ' + d.getFullYear() : '';
  return (opt.dow === false ? '' : DOW[d.getDay()] + ' ') + d.getDate() + ' ' + MON[d.getMonth()] + yr;
};
const fmtDMY = (s) => { if (!s) return ''; const d = fromISO(s); return pad(d.getDate()) + '/' + pad(d.getMonth() + 1) + '/' + d.getFullYear(); };
const fmtDM = (s) => { const d = fromISO(s); return pad(d.getDate()) + '/' + pad(d.getMonth() + 1); };
const relDay = (s) => {
  const n = daysBetween(s, today());
  if (n === 0) return 'Today';
  if (n === 1) return 'Yesterday';
  if (n === -1) return 'Tomorrow';
  return fmtDate(s);
};
const weekStart = (s) => { const d = fromISO(s); const k = (d.getDay() + 6) % 7; d.setDate(d.getDate() - k); return toISO(d); };
const monthStart = (s) => s.slice(0, 8) + '01';
const monthEnd = (s) => { const d = fromISO(monthStart(s)); d.setMonth(d.getMonth() + 1); d.setDate(0); return toISO(d); };
const minsBetween = (a, b) => {
  if (!a || !b) return null;
  const [h1, m1] = a.split(':').map(Number), [h2, m2] = b.split(':').map(Number);
  let m = (h2 * 60 + m2) - (h1 * 60 + m1);
  if (m < 0) m += 1440;
  return m;
};

/* Named ranges used across the app */
function rangeFor(key, ref = today()) {
  switch (key) {
    case 'today': return [ref, ref];
    case 'week': return [weekStart(ref), addDays(weekStart(ref), 6)];
    case 'lastweek': { const s = addDays(weekStart(ref), -7); return [s, addDays(s, 6)]; }
    case 'month': return [monthStart(ref), monthEnd(ref)];
    case 'lastmonth': { const d = fromISO(monthStart(ref)); d.setMonth(d.getMonth() - 1); const s = toISO(d); return [s, monthEnd(s)]; }
    case '30d': return [addDays(ref, -29), ref];
    case '90d': return [addDays(ref, -89), ref];
    case '12m': return [addDays(ref, -364), ref];
    case 'year': return [ref.slice(0, 4) + '-01-01', ref.slice(0, 4) + '-12-31'];
    case 'fy': { const y = Number(ref.slice(0, 4)), m = Number(ref.slice(5, 7)); const s = m >= 7 ? y : y - 1; return [s + '-07-01', (s + 1) + '-06-30']; }
    case 'all': return ['1900-01-01', '2999-12-31'];
    default: return [ref, ref];
  }
}
const RANGE_LABELS = { week: 'This week', lastweek: 'Last week', month: 'This month', lastmonth: 'Last month', '30d': 'Last 30 days', '90d': 'Last 90 days', '12m': 'Last 12 months', year: 'This year', fy: 'This financial year', all: 'All time', custom: 'Custom dates' };
const fmtRange = (a, b) => {
  if (a === '1900-01-01') return 'All records';
  if (a === b) return fmtDate(a, { year: true });
  return fmtDate(a, { dow: false, year: true }) + ' to ' + fmtDate(b, { dow: false, year: true });
};

/* ---- Storage: IndexedDB with an in-memory fallback ---- */
const Store = {
  db: null, ok: false, mem: { kv: {}, photos: {} },
  async open() {
    try {
      if (!('indexedDB' in window)) throw new Error('no idb');
      this.db = await new Promise((res, rej) => {
        const r = indexedDB.open('gills', 1);
        r.onupgradeneeded = () => { const d = r.result; d.createObjectStore('kv'); d.createObjectStore('photos'); };
        r.onsuccess = () => res(r.result);
        r.onerror = () => rej(r.error);
        setTimeout(() => rej(new Error('idb timeout')), 4000);
      });
      this.ok = true;
    } catch (e) { this.ok = false; }
  },
  _tx(store, mode, fn) {
    return new Promise((res, rej) => {
      try {
        const t = this.db.transaction(store, mode); const os = t.objectStore(store);
        const r = fn(os); t.oncomplete = () => res(r && r.result); t.onerror = () => rej(t.error);
      } catch (e) { rej(e); }
    });
  },
  async get(store, key) {
    if (!this.ok) return this.mem[store][key];
    try { return await this._tx(store, 'readonly', (os) => os.get(key)); } catch (e) { return this.mem[store][key]; }
  },
  async put(store, key, val) {
    this.mem[store][key] = val;
    if (!this.ok) return;
    try { await this._tx(store, 'readwrite', (os) => os.put(val, key)); } catch (e) { /* keep in memory */ }
  },
  async del(store, key) {
    delete this.mem[store][key];
    if (!this.ok) return;
    try { await this._tx(store, 'readwrite', (os) => os.delete(key)); } catch (e) { }
  },
  async keys(store) {
    if (!this.ok) return Object.keys(this.mem[store]);
    try { return await this._tx(store, 'readonly', (os) => os.getAllKeys()); } catch (e) { return Object.keys(this.mem[store]); }
  },
  async clear(store) {
    this.mem[store] = {};
    if (!this.ok) return;
    try { await this._tx(store, 'readwrite', (os) => os.clear()); } catch (e) { }
  }
};

/* ---- App state ---- */
function defaultSettings() {
  return {
    name: 'Dr Denzil Gill',
    hospitals: [{ id: 'wesley', name: 'The Wesley Hospital', provider: '242652BX' }],
    defaultHospital: 'wesley',
    cicmId: '', ahpra: '',
    emails: { billing: '', fund: '', ecmo: '', cpd: '' },
    secretaryName: '',
    funds: DEFAULT_FUNDS.slice(),
    locations: ['The Wesley Hospital ICU', 'Online'],
    itemFees: {}, hiddenItems: [], customItems: [], itemLabels: {},
    ecmoTargets: Object.fromEntries(ECMO_TYPES.map((t) => [t.id, t.target])),
    ecmoPeriod: { mode: '12m', since: '' },
    cpdTarget: { total: 50, ea: 12.5, rp: 5, mo: 5, rpmo: 25 },
    shlrTriennium: [2025, 2027],
    lastBackup: null, onboarded: false, demo: false, installTipHidden: false
  };
}
let S = { v: 1, settings: defaultSettings(), patients: [], days: [], ecmo: [], cpd: [] };

let saveTimer = null;
function save() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => Store.put('kv', 'state', JSON.parse(JSON.stringify(S))), 250);
}
async function load() {
  await Store.open();
  const st = await Store.get('kv', 'state');
  if (st && st.v) {
    S = st;
    S.settings = Object.assign(defaultSettings(), S.settings || {});
    S.settings.emails = Object.assign({ billing: '', fund: '', ecmo: '', cpd: '' }, S.settings.emails || {});
    S.settings.ecmoTargets = Object.assign(Object.fromEntries(ECMO_TYPES.map((t) => [t.id, t.target])), S.settings.ecmoTargets || {});
    S.settings.cpdTarget = Object.assign({ total: 50, ea: 12.5, rp: 5, mo: 5, rpmo: 25 }, S.settings.cpdTarget || {});
    ['patients', 'days', 'ecmo', 'cpd'].forEach((k) => { if (!Array.isArray(S[k])) S[k] = []; });
    migrate();
  }
}
/* Older records kept the ward inside the bed field ("ICU 4"); split it out */
function migrate() {
  S.patients.forEach((p) => {
    if (p.ward == null) {
      const m = String(p.bed || '').match(/^\s*(ICU|HDU|CCU|ICCU|CICU|Ward\s*\w+)\s*(.*)$/i);
      if (m) { p.ward = m[1].toUpperCase().startsWith('WARD') ? m[1].replace(/^ward\s*/i, '') : m[1].toUpperCase(); p.bed = m[2].trim(); }
      else p.ward = p.bed ? '' : 'ICU';
    }
    if (!p.hospital) p.hospital = S.settings.defaultHospital || (S.settings.hospitals[0] || {}).id;
  });
  if (!S.settings.hospitals.find((h) => h.id === S.settings.defaultHospital)) S.settings.defaultHospital = (S.settings.hospitals[0] || {}).id || '';
}
async function requestPersistence() {
  try { if (navigator.storage && navigator.storage.persist) return await navigator.storage.persist(); } catch (e) { }
  return false;
}

/* ---- Photos ---- */
const photoCache = {};
async function savePhoto(blob) {
  const id = 'ph_' + uid();
  await Store.put('photos', id, blob);
  return id;
}
async function photoURL(id) {
  if (!id) return '';
  if (photoCache[id]) return photoCache[id];
  const b = await Store.get('photos', id);
  if (!b) return '';
  const url = (b instanceof Blob) ? URL.createObjectURL(b) : b;
  photoCache[id] = url;
  return url;
}
async function photoForPatient(p) {
  if (p.photoId) return photoURL(p.photoId);
  if (p.demoLabel) {
    if (!photoCache['demo_' + p.id]) photoCache['demo_' + p.id] = demoLabelImage(p);
    return photoCache['demo_' + p.id];
  }
  return '';
}
/* Shrink a camera photo to a sensible size before storing it */
function downscaleImage(file, maxDim = 1400, quality = 0.82) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      let { width: w, height: h } = img;
      const k = Math.min(1, maxDim / Math.max(w, h));
      w = Math.round(w * k); h = Math.round(h * k);
      const c = document.createElement('canvas'); c.width = w; c.height = h;
      c.getContext('2d').drawImage(img, 0, 0, w, h);
      URL.revokeObjectURL(url);
      c.toBlob((b) => b ? resolve(b) : reject(new Error('Could not read that photo')), 'image/jpeg', quality);
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Could not read that photo. Try taking it again.')); };
    img.src = url;
  });
}
function blobToDataURL(b) {
  return new Promise((res) => { const r = new FileReader(); r.onload = () => res(r.result); r.readAsDataURL(b); });
}
async function dataURLToBlob(u) {
  const [head, b64] = String(u).split(',');
  const mime = (head.match(/data:([^;]+)/) || [])[1] || 'application/octet-stream';
  const bin = atob(b64); const arr = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
  return new Blob([arr], { type: mime });
}

/* ---- Billing items ---- */
let ITEM_MAP = {}, ITEM_LIST = [];
function buildItems() {
  const st = S.settings;
  const list = FORM_ITEMS.map(([code, section, label, f]) => ({ code, section, label, form: true, ...f }))
    .concat(EXTRA_ITEMS.map(([code, section, label, f]) => ({ code, section, label, form: false, ...f })));
  (st.customItems || []).forEach((c) => list.push({ code: c.code, section: 'extra', label: c.label, custom: true, timed: c.timed, customCriteria: c.criteria }));
  ITEM_MAP = {}; ITEM_LIST = list;
  list.forEach((it) => {
    const base = it.code.replace(/[A-Z]$/, '');
    const crit = MBS_CRITERIA[it.code] || MBS_CRITERIA[base] || null;
    it.criteria = (it.customCriteria || (crit && crit.criteria) || '').replace(/\s*NOT ON FORM[^.]*\.?/g, '').trim();
    const rules = (crit && crit.rules) || [];
    it.formNotes = rules.filter((r) => /^FORM LABEL NOTE:/.test(r)).map((r) => r.replace(/^FORM LABEL NOTE:\s*/, ''));
    it.rules = rules.filter((r) => !/^FORM LABEL NOTE:/.test(r));
    it.mbsTitle = (crit && crit.title) || '';
    it.source = (crit && crit.source) || '';
    it.verified = crit ? !!crit.verified : false;
    it.scheduleFee = crit && crit.fee != null ? crit.fee : null;
    if (st.itemLabels && st.itemLabels[it.code]) it.label = st.itemLabels[it.code];
    it.hidden = (st.hiddenItems || []).includes(it.code);
    ITEM_MAP[it.code] = it;
  });
  return list;
}
const itemLabel = (code) => (ITEM_MAP[code] ? ITEM_MAP[code].label : code);
/* Fees: Denzil's own rate if he has set one, otherwise the MBS schedule fee */
const userFee = (code) => {
  const f = S.settings.itemFees[code];
  return f != null && f !== '' && !isNaN(Number(f)) ? Number(f) : null;
};
const mbsFee = (code) => {
  const it = ITEM_MAP[code];
  if (it && it.scheduleFee != null) return it.scheduleFee;
  const c = MBS_CRITERIA[code] || MBS_CRITERIA[String(code).replace(/[A-Z]$/, '')];
  return c && c.fee != null ? c.fee : null;
};
const itemFee = (code) => { const u = userFee(code); return u != null ? u : mbsFee(code); };
const ANAES_MODS = ['25000', '25005', '25010', '25014'];
/* Estimated fee for one day of care. 25025 has no fixed fee: it adds 50% of the
   anaesthesia fee (initiation item + time item + ASA/age modifiers). */
function dayFee(d) {
  const codes = dayAllCodes(d);
  let total = 0;
  codes.forEach((c) => { if (c === '25025' && userFee(c) == null) return; const f = itemFee(c); if (f != null) total += f; });
  if (codes.includes('25025') && userFee('25025') == null) {
    const base = codes.filter((c) => (ITEM_MAP[c] && ITEM_MAP[c].anaes) || /^230/.test(c) || ANAES_MODS.includes(c));
    total += 0.5 * sum(base, (c) => itemFee(c) || 0);
  }
  return total;
}
const fmtMoney = (v) => '$' + Math.round(v).toLocaleString('en-AU');

/* Recency-weighted usage: recent use counts more, so the list adapts over time */
function itemScores() {
  const t = today();
  const sc = {};
  S.days.forEach((d) => {
    const age = Math.max(0, daysBetween(d.date, t));
    const w = Math.pow(0.5, age / 45);
    d.items.forEach((c) => { sc[c] = (sc[c] || 0) + w; });
  });
  return sc;
}
function frequentItems(n = 8) {
  const sc = itemScores();
  const ranked = Object.keys(sc).filter((c) => ITEM_MAP[c] && !ITEM_MAP[c].hidden).sort((a, b) => sc[b] - sc[a]);
  const starter = ['13870', '13873', '13881', '13882', '13876A', '13876C', '13815', '13842'];
  starter.forEach((c) => { if (ranked.length < n && !ranked.includes(c) && ITEM_MAP[c] && !ITEM_MAP[c].hidden) ranked.push(c); });
  return ranked.slice(0, n);
}

/* Derived modifiers (anaesthesia time band, ASA) for a day of care */
function derivedCodes(day) {
  const out = [];
  const hasAnaes = day.items.some((c) => ITEM_MAP[c] && ITEM_MAP[c].anaes);
  if (hasAnaes && day.times && day.times.start && day.times.finish) {
    const m = minsBetween(day.times.start, day.times.finish);
    const band = TIME_BANDS.find((b) => m >= b.min && m <= b.max);
    if (band) out.push(band.code);
  }
  if (hasAnaes && day.asa && ASA_CODES[day.asa]) out.push(ASA_CODES[day.asa]);
  return out;
}
const dayAllCodes = (d) => d.items.concat(derivedCodes(d));

function clashesFor(codes, pid, date) {
  const set = new Set(codes);
  const out = [];
  SAME_DAY_CLASHES.forEach(([a, b, msg]) => { if (set.has(a) && set.has(b)) out.push(msg); });
  // day-1 items already billed earlier in this admission
  const p = patientById(pid);
  if (p) {
    const prior = S.days.filter((d) => d.pid === pid && d.date < date && d.date >= (p.admitted || '0000'));
    ['13870', '13885', '13851', '13837', '13834', '104'].forEach((c) => {
      if (set.has(c) && prior.some((d) => d.items.includes(c))) out.push(c + ' was already billed on ' + fmtDate(prior.find((d) => d.items.includes(c)).date) + ' for this admission');
    });
  }
  return out;
}

/* ---- Lookups ---- */
const patientById = (id) => S.patients.find((p) => p.id === id);
const daysFor = (pid) => S.days.filter((d) => d.pid === pid).sort((a, b) => a.date < b.date ? 1 : -1);
const dayFor = (pid, date) => S.days.find((d) => d.pid === pid && d.date === date);
const hospitalById = (id) => S.settings.hospitals.find((h) => h.id === id) || S.settings.hospitals[0] || { name: 'Hospital', provider: '' };
/* Where the patient was on a given day of care (each day keeps its own copy, so moves are preserved) */
const patientLoc = (p) => ({ hospital: (p && p.hospital) || S.settings.defaultHospital, ward: (p && p.ward) || '', bed: (p && p.bed) || '' });
const dayLoc = (d) => (d && d.loc) ? d.loc : patientLoc(patientById(d && d.pid));
const sameLoc = (a, b) => a && b && a.hospital === b.hospital && norm(a.ward) === norm(b.ward) && norm(a.bed) === norm(b.bed);
const wardBed = (l) => [l.ward, l.bed ? (l.ward ? 'bed ' + l.bed : 'Bed ' + l.bed) : ''].filter(Boolean).join(', ');
const wardBedShort = (l) => [l.ward, l.bed].filter(Boolean).join(' ');
const locText = (l, withHosp) => [withHosp || S.settings.hospitals.length > 1 ? hospitalById(l.hospital).name : '', wardBed(l)].filter(Boolean).join(', ');
function wardsRanked() {
  const c = { ICU: 1000 };
  S.patients.forEach((p) => { if (p.ward) c[p.ward] = (c[p.ward] || 0) + 1; });
  S.days.forEach((d) => { if (d.loc && d.loc.ward) c[d.loc.ward] = (c[d.loc.ward] || 0) + 1; });
  return Object.keys(c).sort((a, b) => c[b] - c[a]).slice(0, 6);
}
const patientName = (p) => (p && (p.name || (p.ur ? 'UR ' + p.ur : 'Unnamed patient'))) || 'Unknown patient';
const activePatients = () => S.patients.filter((p) => p.status === 'active');
function unbilledToday() {
  const t = today();
  return activePatients().filter((p) => !dayFor(p.id, t));
}

/* Funds ordered by how often they're used */
function fundsRanked() {
  const c = {};
  S.patients.forEach((p) => { if (p.fund) c[p.fund] = (c[p.fund] || 0) + 1; });
  const list = S.settings.funds.slice();
  return list.sort((a, b) => (c[b] || 0) - (c[a] || 0) || list.indexOf(a) - list.indexOf(b));
}
function locationsRanked() {
  const c = {};
  S.cpd.forEach((e) => { if (e.location) c[e.location] = (c[e.location] || 0) + 1; });
  S.ecmo.forEach((e) => { if (e.location) c[e.location] = (c[e.location] || 0) + 1; });
  const list = S.settings.locations.slice();
  return list.sort((a, b) => (c[b] || 0) - (c[a] || 0) || list.indexOf(a) - list.indexOf(b));
}

/* ---- ECMO period and progress ---- */
function ecmoRange() {
  const p = S.settings.ecmoPeriod || { mode: '12m' };
  if (p.mode === 'year') return rangeFor('year');
  if (p.mode === 'since' && p.since) return [p.since, today()];
  if (p.mode === '24m') return [addDays(today(), -729), today()];
  if (p.mode === '36m') return [addDays(today(), -1094), today()];
  return rangeFor('12m');
}
const ECMO_PERIOD_LABELS = { '12m': 'Last 12 months', '24m': 'Last 24 months', '36m': 'Last 36 months', year: 'This calendar year', since: 'Since a set date' };
function ecmoProgress(range = ecmoRange()) {
  const [a, b] = range;
  const inR = S.ecmo.filter((e) => e.date >= a && e.date <= b);
  return ECMO_TYPES.map((t) => {
    const n = inR.filter((e) => e.type === t.id).length;
    const target = Number(S.settings.ecmoTargets[t.id]) || 0;
    return { ...t, n, target, met: target ? n >= target : null };
  });
}

/* ---- CPD progress ---- */
const cpdType = (id) => CPD_TYPES.find((t) => t.id === id) || { id, name: id, cat: 'ea' };
function cpdForYear(y) { return S.cpd.filter((e) => e.date.slice(0, 4) === String(y)); }
function cpdProgress(y = Number(today().slice(0, 4))) {
  const list = cpdForYear(y);
  const T = S.settings.cpdTarget;
  const by = { ea: 0, rp: 0, mo: 0 };
  let pdpHours = 0;
  list.forEach((e) => {
    let h = Number(e.hours) || 0;
    if (e.type === 'pdp') { const allow = Math.max(0, 3 - pdpHours); const used = Math.min(h, allow); pdpHours += used; h = used; }
    by[e.cat || cpdType(e.type).cat] += h;
  });
  const total = by.ea + by.rp + by.mo;
  const cape = Object.fromEntries(CAPE.map((c) => [c.id, list.some((e) => (e.cape || []).includes(c.id))]));
  const pdp = list.some((e) => e.type === 'pdp');
  const [t0, t1] = S.settings.shlrTriennium || [2025, 2027];
  const shlr = S.cpd.filter((e) => e.type === 'airway' && Number(e.date.slice(0, 4)) >= t0 && Number(e.date.slice(0, 4)) <= t1).sort((a, b) => a.date < b.date ? -1 : 1)[0] || null;
  // pace: where you'd expect to be by today if spread evenly
  const isThisYear = String(y) === today().slice(0, 4);
  const dayOfYear = isThisYear ? daysBetween(y + '-01-01', today()) + 1 : (y < Number(today().slice(0, 4)) ? 365 : 0);
  const expected = T.total * Math.min(1, dayOfYear / 365);
  const checks = [
    { label: 'Total hours', have: total, need: T.total },
    { label: CPD_CATS.ea.name, have: by.ea, need: T.ea },
    { label: CPD_CATS.rp.name, have: by.rp, need: T.rp },
    { label: CPD_CATS.mo.name, have: by.mo, need: T.mo },
    { label: 'Reviewing performance + measuring outcomes', have: by.rp + by.mo, need: T.rpmo }
  ];
  const notLogged = list.filter((e) => !e.portal).length;
  return { year: y, list, by, total, cape, pdp, shlr, expected, checks, T, notLogged, triennium: [t0, t1] };
}

/* ---- Billing stats ---- */
function billingStats(a, b) {
  const days = S.days.filter((d) => d.date >= a && d.date <= b);
  const itemCount = {};
  days.forEach((d) => dayAllCodes(d).forEach((c) => { itemCount[c] = (itemCount[c] || 0) + 1; }));
  const pids = new Set(days.map((d) => d.pid));
  const fundCount = {};
  pids.forEach((id) => { const p = patientById(id); const f = (p && p.fund) || 'Not recorded'; fundCount[f] = (fundCount[f] || 0) + 1; });
  const est = sum(days, dayFee);
  const custom = Object.keys(S.settings.itemFees || {}).some((c) => userFee(c) != null);
  const discharged = S.patients.filter((p) => p.status === 'discharged' && p.dischargedAt >= a && p.dischargedAt <= b);
  const los = discharged.map((p) => { const ds = S.days.filter((d) => d.pid === p.id).map((d) => d.date).sort(); return ds.length ? daysBetween(ds[0], ds[ds.length - 1]) + 1 : 0; }).filter((x) => x > 0);
  return {
    days, nDays: days.length, nPatients: pids.size, nItems: sum(Object.values(itemCount)),
    itemCount, fundCount, est, custom,
    avgLOS: los.length ? sum(los) / los.length : null,
    unsent: days.filter((d) => !d.sent).length
  };
}

/* ---- Search ---- */
function norm(s) { return String(s || '').toLowerCase(); }
function patientMatches(p, q) {
  if (!q) return true;
  const hay = norm([p.name, p.ur, p.fund, p.ward, p.bed, p.refDoc, p.dx, hospitalById(p.hospital).name].join(' '));
  return q.split(/\s+/).every((w) => hay.includes(w));
}
function dayMatches(d, q) {
  if (!q) return true;
  const p = patientById(d.pid) || {};
  const L = dayLoc(d);
  const hay = norm([p.name, p.ur, p.fund, L.ward, L.bed, p.refDoc, p.dx, hospitalById(L.hospital).name, d.note, dayAllCodes(d).join(' '), dayAllCodes(d).map(itemLabel).join(' '), fmtDate(d.date, { year: true }), fmtDMY(d.date)].join(' '));
  return q.split(/\s+/).every((w) => hay.includes(w));
}

/* ---- CSV ---- */
function csvCell(v) { const s = String(v == null ? '' : v); return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s; }
function toCSV(rows) { return rows.map((r) => r.map(csvCell).join(',')).join('\r\n'); }
