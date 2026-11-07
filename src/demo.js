/* ===== Caring Intensively: 12 months of realistic demo data ===== */

const DEMO_VERSION = 2; // bump when the sample data changes so open copies refresh

function seeded(seed) { let s = seed >>> 0; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }

function demoLabelImage(p) {
  const c = document.createElement('canvas'); c.width = 960; c.height = 430;
  const x = c.getContext('2d');
  x.fillStyle = '#dcdcd6'; x.fillRect(0, 0, 960, 430);
  const g = x.createLinearGradient(0, 0, 960, 430); g.addColorStop(0, 'rgba(255,255,255,.35)'); g.addColorStop(1, 'rgba(0,0,0,.08)');
  x.save(); x.translate(480, 215); x.rotate(-0.018);
  x.shadowColor = 'rgba(0,0,0,.25)'; x.shadowBlur = 14; x.shadowOffsetY = 4;
  x.fillStyle = '#fdfdfb'; x.fillRect(-440, -185, 880, 370);
  x.shadowColor = 'transparent';
  x.fillStyle = '#1b1b1b'; x.textBaseline = 'alphabetic';
  const f = (s, w) => { x.font = (w || 400) + ' ' + s + 'px "Helvetica Neue", Helvetica, Arial, sans-serif'; };
  f(22, 700); x.fillText(p.labelHosp || 'THE WESLEY HOSPITAL', -410, -140);
  x.fillStyle = '#c21d2f'; f(20, 800); x.fillText('SAMPLE', 300, -140); x.fillStyle = '#1b1b1b';
  f(40, 700); x.fillText(p.name || '', -410, -84);
  f(26, 500);
  x.fillText((p.sex || 'F') + '   DOB ' + (p.dob || '01/01/1950') + '   UR ' + (p.ur || ''), -410, -38);
  x.fillText((p.fund || 'Self funded') + '   Memb ' + (p.memb || '0000 0000'), -410, 4);
  x.fillText('Adm ' + fmtDMY(p.admitted) + '   ' + (p.labelWard || p.ward || '') + ' Bed ' + (p.labelBed || p.bed || ''), -410, 46);
  x.fillText((p.refDoc || '') + ' (Adm)', -410, 88);
  // barcode
  const r = seeded(String(p.ur || '1').split('').reduce((a, ch) => a * 31 + ch.charCodeAt(0), 7));
  let bx = -410;
  while (bx < 380) { const w = 2 + Math.floor(r() * 5); if (r() > 0.42) x.fillRect(bx, 112, w, 52); bx += w + 1 + Math.floor(r() * 3); }
  x.restore();
  x.fillStyle = g; x.fillRect(0, 0, 960, 430);
  return c.toDataURL('image/jpeg', 0.85);
}

function makeDemoData(seed = 20514515) {
  const R = seeded(seed);
  const pick = (a) => a[Math.floor(R() * a.length)];
  const chance = (p) => R() < p;
  const wpick = (pairs) => { const t = sum(pairs, (q) => q[1]); let v = R() * t; for (const [k, w] of pairs) { if ((v -= w) <= 0) return k; } return pairs[0][0]; };
  const T = today();
  const surn = ['HARRIS', 'NGUYEN', 'O’BRIEN', 'PATEL', 'SMITH', 'WILLIAMS', 'BROWN', 'TAYLOR', 'WILSON', 'CAMPBELL', 'ANDERSON', 'THOMPSON', 'MARTIN', 'WHITE', 'KELLY', 'RYAN', 'MURPHY', 'CHEN', 'WALKER', 'YOUNG', 'KING', 'WRIGHT', 'SCOTT', 'GREEN', 'BAKER', 'ADAMS', 'MITCHELL', 'ROBERTS', 'COOPER', 'MORRIS', 'LEE', 'WARD', 'HUGHES', 'PRICE', 'BELL', 'FRASER', 'DUNN', 'LAWSON', 'PEARCE', 'GRAHAM'];
  const firstF = ['Margaret', 'Patricia', 'Susan', 'Helen', 'Linda', 'Karen', 'Judith', 'Anne', 'Christine', 'Julie', 'Wendy', 'Lorraine', 'Mei', 'Priya', 'Kathleen', 'Denise', 'Sharon', 'Robyn'];
  const firstM = ['John', 'Peter', 'Robert', 'David', 'Michael', 'Graham', 'Brian', 'Kevin', 'Stephen', 'Ian', 'Gary', 'Paul', 'Trevor', 'Raj', 'Thanh', 'Geoffrey', 'Barry', 'Colin'];
  const refDocs = ['Dr A Chen', 'Dr R Patel', 'Dr S McKenzie', 'Dr L Fraser', 'Dr J O’Connor', 'Dr M Hassan', 'Dr K Liu', 'Dr P Walsh', 'Dr T Nakamura', 'Dr E Rossi', 'Dr B Singh', 'Dr H Moreau'];
  const dxs = [['CABG, post-op', 'card'], ['AVR, post-op', 'card'], ['Mitral valve repair, post-op', 'card'], ['Urosepsis', 'sep'], ['Community-acquired pneumonia', 'resp'], ['Septic shock, abdominal source', 'sep'], ['DKA', 'med'], ['Whipple procedure, post-op', 'surg'], ['Upper GI bleed', 'med'], ['Acute pulmonary oedema', 'resp'], ['AF with rapid ventricular rate', 'card2'], ['COPD exacerbation', 'resp'], ['Fractured NOF, post-op', 'surg'], ['Oesophagectomy, post-op', 'surg'], ['Out-of-hospital cardiac arrest, ROSC', 'arrest'], ['Acute pancreatitis', 'med'], ['Anterior resection, post-op', 'surg'], ['Hip arthroplasty, post-op monitoring', 'surg'], ['Hyponatraemia', 'med'], ['Subarachnoid haemorrhage', 'neuro'], ['Pulmonary embolism', 'resp'], ['Cardiogenic shock', 'shock'], ['Laparotomy for bowel obstruction', 'surg'], ['Complete heart block', 'chb']];
  const funds = [['Medibank', 24], ['Bupa', 21], ['HCF', 11], ['nib', 8], ['HBF', 4], ['ahm', 5], ['Australian Unity', 4], ['GMHBA', 3], ['Teachers Health', 3], ['Defence Health', 3], ['CBHS', 2], ['Queensland Country Health Fund', 3], ['DVA', 5], ['Uninsured / self-funded', 2], ['WorkCover Qld', 1], ['Overseas visitor cover', 1]];

  const patients = [], days = [];
  const add = (pid, date, items, extra = {}) => { days.push({ id: uid(), pid, date, items: Array.from(new Set(items)), times: extra.times || { start: '', finish: '' }, asa: extra.asa || '', note: extra.note || '', sent: null, created: date + 'T09:00:00', updated: date + 'T09:00:00' }); };

  // On-call weeks: the current week, then every third week back across 12 months
  const thisWeek = weekStart(T);
  const weeks = []; for (let k = 0; k < 18; k++) { const w = addDays(thisWeek, -21 * k); if (daysBetween(w, T) <= 365) weeks.push(w); }
  weeks.reverse();

  weeks.forEach((w) => {
    const isCurrent = w === thisWeek;
    const weekEnd = isCurrent ? T : addDays(w, 6);
    for (let d = 0; d < 7; d++) {
      const adm = addDays(w, d);
      if (adm > weekEnd) break;
      let n = wpick([[0, 1], [1, 4], [2, 4], [3, 2]]);
      if (isCurrent && adm === T) n = 1;
      for (let i = 0; i < n; i++) {
        const female = chance(0.45);
        const [dx, kind] = pick(dxs);
        const age = 45 + Math.floor(R() * 45);
        const p = {
          id: uid(), name: pick(surn) + ', ' + (female ? pick(firstF) : pick(firstM)),
          ur: String(4000000 + Math.floor(R() * 900000)), fund: wpick(funds), hospital: 'wesley',
          ward: 'ICU', bed: String(1 + Math.floor(R() * 16)), refDoc: pick(refDocs), dx, admitted: adm,
          status: 'discharged', dischargedAt: null, created: adm + 'T08:00:00', demoLabel: true,
          sex: female ? 'F' : 'M', dob: pad(1 + Math.floor(R() * 28)) + '/' + pad(1 + Math.floor(R() * 12)) + '/' + (Number(adm.slice(0, 4)) - age),
          memb: String(1000 + Math.floor(R() * 8999)) + ' ' + String(10000 + Math.floor(R() * 89999)), age
        };
        // About a third of admissions are at Greenslopes, so multi-site billing has something to show
        if (chance(0.35)) { p.hospital = 'greenslopes'; p.bed = String(1 + Math.floor(R() * 12)); p.labelHosp = 'GREENSLOPES PRIVATE HOSPITAL'; }
        p.labelWard = p.ward; p.labelBed = p.bed;
        // Ward consults that don't come to ICU
        if (chance(0.1)) {
          const code = chance(0.5) ? '13899' : '160';
          const st = pad(8 + Math.floor(R() * 12)) + ':' + pad(Math.floor(R() * 4) * 15);
          add(p.id, adm, [code], { times: { start: st, finish: addMins(st, 60 + Math.floor(R() * 30)) } });
          p.dischargedAt = adm; p.ward = p.hospital === 'greenslopes' ? (chance(0.5) ? 'Ward 2' : 'Ward 5') : (chance(0.5) ? '4B' : '6A'); p.bed = String(1 + Math.floor(R() * 30));
          p.labelWard = p.ward; p.labelBed = p.bed;
          days[days.length - 1].loc = patientLoc(p);
          patients.push(p); continue;
        }
        let los = wpick([[1, 24], [2, 24], [3, 17], [4, 12], [5, 8], [6, 5], [7, 4], [9, 3], [12, 3]]);
        if (isCurrent && daysBetween(adm, T) <= 4 && chance(0.75)) los = Math.max(los, daysBetween(adm, T) + 2 + Math.floor(R() * 3));
        const vent = ['arrest', 'shock', 'neuro'].includes(kind) || (kind === 'card' ? chance(0.9) : chance(0.25));
        const ventDays = vent ? (kind === 'card' ? 1 : Math.max(1, Math.round(los * (0.4 + R() * 0.5)))) : 0;
        const art = vent || chance(0.55), cvc = vent || kind === 'sep' || chance(0.35);
        const pac = kind === 'card' && chance(0.25) || kind === 'shock';
        const crrt = kind === 'shock' || (kind === 'sep' && chance(0.3));
        const iabp = kind === 'shock' && chance(0.6);
        const niv = !vent && kind === 'resp' && chance(0.5);
        const stepDown = los >= 3 && chance(0.18);
        // Some Wesley patients transfer to Greenslopes part-way through their stay
        const transferAt = p.hospital === 'wesley' && los >= 3 && chance(0.15) ? 1 + Math.floor(R() * (los - 2)) : -1;
        for (let k = 0; k < los; k++) {
          const date = addDays(adm, k);
          if (date > weekEnd) break;
          if (k === transferAt) { p.hospital = 'greenslopes'; p.ward = 'ICU'; p.bed = String(1 + Math.floor(R() * 12)); }
          if (isCurrent && date === T && chance(0.5)) break; // some patients not yet billed today
          const it = [];
          if (k === 0) {
            it.push('13870');
            if (vent && kind !== 'card') { it.push('13881'); if (chance(0.15)) it.push('13857'); }
            else if (vent) it.push('13881');
            if (art && !['card'].includes(kind)) it.push('13842');
            if (cvc && kind !== 'card') it.push('13815');
            if (pac && kind !== 'card') it.push('13818');
            if (crrt) it.push('13885');
            if (kind === 'chb') it.push('38256');
            if (kind === 'card2' && chance(0.6)) { it.push('13400', '20410'); }
          } else {
            it.push('13873');
            if (vent && k < ventDays) it.push('13882');
            if (niv && k < 3) it.push('13882');
            if (crrt) it.push('13888');
            if (k === 1 && kind === 'resp' && chance(0.25)) it.push('38419');
            if (vent && k === 6) it.push('41880');
          }
          if (niv && k === 0) it.push('13882');
          if (art && (k < los - 1 || k === 0)) it.push('13876A');
          if (cvc && (k < los - 1 || k === 0) && chance(0.85)) it.push('13876C');
          if (pac && k < 3) it.push('13876P');
          if (iabp && k < 3) it.push('13848');
          if (chance(0.1)) it.push('13706');
          if (kind === 'resp' && k === 0 && chance(0.12)) it.push('38828');
          const extra = {};
          if (it.includes('20410')) { const st = pad(9 + Math.floor(R() * 8)) + ':' + pad(Math.floor(R() * 4) * 15); extra.times = { start: st, finish: addMins(st, 20 + Math.floor(R() * 20)) }; extra.asa = chance(0.6) ? '3' : '4'; }
          if (it.includes('38419') || it.includes('41880')) { const st = pad(10 + Math.floor(R() * 5)) + ':' + pad(Math.floor(R() * 4) * 15); extra.times = { start: st, finish: addMins(st, 25 + Math.floor(R() * 30)) }; }
          if (it.includes('38256')) { const st = pad(13 + Math.floor(R() * 6)) + ':00'; extra.times = { start: st, finish: addMins(st, 50) }; }
          if (k === 0 && chance(0.06)) extra.note = 'Admitted overnight, family meeting held';
          add(p.id, date, it, extra);
          const moved = stepDown && k === los - 1;
          days[days.length - 1].loc = moved ? { hospital: p.hospital, ward: 'HDU', bed: String(1 + Math.floor(R() * 6)) } : patientLoc(p);
          if (moved) { p.ward = 'HDU'; p.bed = days[days.length - 1].loc.bed; }
        }
        const lastDay = addDays(adm, los - 1);
        if (isCurrent && lastDay >= T) { p.status = 'active'; }
        else { p.dischargedAt = lastDay > weekEnd ? weekEnd : lastDay; }
        if (patients.filter((q) => q.status === 'active').length > 6 && p.status === 'active') { p.status = 'discharged'; p.dischargedAt = T; }
        patients.push(p);
      }
    }
    // Everything from past weeks has gone to the secretary the Monday after
    if (!isCurrent) days.filter((d) => d.date >= w && d.date <= addDays(w, 6)).forEach((d) => { d.sent = addDays(w, 7) + 'T08:30:00'; });
  });
  // Today's unbilled patients need to exist: make sure at least two active patients have no entry today
  const act = patients.filter((p) => p.status === 'active');
  let unb = act.filter((p) => !days.some((d) => d.pid === p.id && d.date === T)).length;
  act.forEach((p) => { if (unb < 2) { const i = days.findIndex((d) => d.pid === p.id && d.date === T); if (i >= 0 && p.admitted < T) { days.splice(i, 1); unb++; } } });

  /* ---- ECMO ---- */
  const ecmo = [];
  const E = (type, date, f = {}) => ecmo.push({ id: uid(), type, date, time: f.time || '', location: f.location || 'The Wesley Hospital ICU', ref: f.ref || '', created: date + 'T12:00:00', ...f });
  const day12 = (k) => addDays(T, -k);
  const initials = () => pick('ABCDEGHJKLMNPRSTW'.split('')) + '.' + pick('ABCDEGHJKLMNPRSTW'.split('')) + '.';
  [[340, 'VV', 'Primary operator', 'Femoral–jugular'], [301, 'VA', 'Supervisor', 'Femoral–femoral'], [255, 'VV', 'Primary operator', 'Single-site dual-lumen'], [198, 'VA', 'Primary operator', 'Femoral–femoral'], [150, 'VV', 'Assistant', 'Femoral–jugular'], [96, 'ECPR', 'Primary operator', 'Femoral–femoral'], [61, 'VV', 'Primary operator', 'Femoral–jugular'], [19, 'VA', 'Supervisor', 'Femoral–femoral']].forEach(([k, mode, role, config], i) => {
    E('cannulation', day12(k), { mode, role, config, imaging: mode === 'VV' ? ['Ultrasound', 'TOE'] : ['Ultrasound'], setting: mode === 'ECPR' ? 'ED' : (i === 3 ? 'Cath lab' : 'ICU'), complication: i === 4 ? 'Bleeding' : 'None', ref: initials(), time: pad(8 + (i * 3) % 14) + ':' + pad((i * 17) % 60) });
    // reviews and rounds around each run
    const run = 4 + Math.floor(R() * 9);
    for (let j = 1; j < run; j++) { if (chance(0.55)) E('review', addDays(day12(k), j), { mode: mode === 'ECPR' ? 'VA' : mode, ref: '' }); }
    if (chance(0.8)) E('other', addDays(day12(k), run), { kind: 'Decannulation', role: 'Primary operator' });
  });
  [[322, 'Oxygenator failure', 'Urgent'], [190, 'Circuit clot', 'Elective'], [58, 'Haemolysis', 'Emergency']].forEach(([k, reason, urgency]) => E('circuit', day12(k), { reason, urgency, role: 'Supervisor' }));
  for (let m = 0; m < 12; m++) if (m !== 4 && m !== 8) E('qa', addDays(day12(m * 30 + 8), 0), { hours: 1.5, topic: pick(['ECMO case review and complications', 'Anticoagulation protocol review', 'ELSO registry data review', 'ECPR activations review', 'Cannulation outcomes audit']) });
  for (let k = 360; k > 0; k -= 7 + Math.floor(R() * 4)) if (chance(0.7)) E('round', day12(k), { patients: 1 + Math.floor(R() * 3), hours: 1 });
  for (let k = 355; k > 2; k -= 18 + Math.floor(R() * 15)) E('consult', day12(k), { referrer: pick(['Gold Coast University Hospital', 'Sunshine Coast University Hospital', 'Toowoomba Hospital', 'Ipswich Hospital', 'Wesley Emergency Centre']), outcome: wpick([['Advice only', 5], ['Accepted for transfer', 3], ['Declined', 2], ['ECMO started', 2], ['Monitor / revisit', 2]]), mode: chance(0.6) ? 'VV' : 'VA' });
  E('retrieval', day12(255), { from: 'Toowoomba Hospital', to: 'The Wesley Hospital', mode: 'VV', transport: 'Rotary wing', cannulatedOnSite: true, hours: 6, role: 'Team leader' });
  E('other', day12(210), { kind: 'Simulation / emergency drill', hours: 3, topic: 'Circuit emergency drill' });
  E('other', day12(120), { kind: 'Education delivered', hours: 1.5, topic: 'ECMO for ICU nursing staff' });
  E('other', day12(44), { kind: 'Simulation / emergency drill', hours: 2, topic: 'ECPR scenario' });

  /* ---- CPD ---- */
  const cpd = [];
  const C = (date, type, hours, f = {}) => cpd.push({ id: uid(), date, type, cat: cpdType(type).cat, hours, location: f.location || 'The Wesley Hospital ICU', title: f.title || '', provider: f.provider || '', cape: f.cape || [], reflection: f.reflection || '', portal: f.portal != null ? f.portal : date < addDays(T, -30), created: date + 'T17:00:00' });
  const y = T.slice(0, 4), py = String(Number(y) - 1);
  // last year (partial view)
  C(py + '-11-14', 'mm', 1, { title: 'ICU M&M' }); C(py + '-11-21', 'journal', 1, { title: 'Journal club' }); C(py + '-12-05', 'mm', 1, { title: 'ICU M&M' });
  // this year
  C(y + '-01-20', 'pdp', 2, { title: 'Professional development plan ' + y, location: 'Online', cape: ['prof'], reflection: 'Goals: refresh ultrasound-guided cannulation, complete airway SHLR course, lead one audit.' });
  const monthly = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11'];
  monthly.forEach((m, i) => {
    if (y + '-' + m + '-12' <= T) C(y + '-' + m + '-12', 'mm', 1, { title: 'ICU M&M', cape: i === 3 ? ['ethics'] : [] });
    if (i % 2 === 0 && y + '-' + m + '-19' <= T) C(y + '-' + m + '-19', 'journal', 1, { title: 'ICU journal club' });
    if ([1, 4, 7, 9].includes(i) && y + '-' + m + '-26' <= T) C(y + '-' + m + '-26', 'qa', 1.5, { title: 'ICU quality and safety committee' });
  });
  C(y + '-03-06', 'grand', 1, { title: 'Grand rounds: delirium in the elderly', location: 'Wesley Education Centre' });
  C(y + '-04-15', 'incident', 2, { title: 'RCA: unplanned extubation', cape: ['prof'] });
  C(y + '-05-08', 'conf', 10.5, { title: 'CICM Annual Scientific Meeting', provider: 'CICM', location: 'Brisbane Convention & Exhibition Centre', cape: ['inequity', 'ethics'], reflection: 'Rural retrieval session prompted review of our ECMO referral pathway from regional centres.' });
  C(y + '-06-23', 'online', 1.5, { title: 'Webinar: ARDS ventilation update', location: 'Online' });
  C(y + '-07-30', 'audit', 1.5, { title: 'Audit: CLABSI rates 2025', cape: [] });
  C(y + '-08-14', 'teach', 1, { title: 'Registrar teaching: ECMO basics' });
  C(y + '-09-04', 'sim', 3, { title: 'ECMO circuit emergency simulation', provider: 'Wesley ICU', reflection: 'Practised pump failure and air entrainment responses.' });
  C(y + '-10-09', 'peer', 1.5, { title: 'Peer case review', cape: ['prof'] });
  C(y + '-10-21', 'mdt', 1, { title: 'Cardiac surgery MDT' });

  const locations = ['The Wesley Hospital ICU', 'Online', 'Wesley Education Centre', 'Brisbane Convention & Exhibition Centre'];
  // Make sure the current week always has multi-site cases to test with
  const GS = (p) => { p.hospital = 'greenslopes'; p.labelHosp = 'GREENSLOPES PRIVATE HOSPITAL'; p.ward = 'ICU'; p.labelWard = 'ICU'; p.bed = p.labelBed = String(1 + Math.floor(R() * 12)); };
  const stay = (p) => days.filter((d) => d.pid === p.id).sort((a, b) => a.date < b.date ? -1 : 1);
  const wesleyOnly = (p) => stay(p).every((d) => d.loc.hospital === 'wesley');
  const cur = patients.filter((p) => days.some((d) => d.pid === p.id && d.date >= thisWeek));
  // 1. A patient who moves from the Wesley to Greenslopes part-way through this week
  const mover = cur.filter((p) => wesleyOnly(p) && stay(p).length >= 3 && stay(p)[0].date >= thisWeek).sort((a, b) => stay(b).length - stay(a).length)[0];
  if (mover) { const st = stay(mover); const from = Math.ceil(st.length / 2); const lb = mover.labelBed; GS(mover); mover.labelBed = lb; st.slice(from).forEach((d) => { d.loc = { hospital: 'greenslopes', ward: 'ICU', bed: mover.bed }; }); mover.labelHosp = undefined; mover.labelWard = 'ICU'; }
  // 2. The two biggest funds have patients at both hospitals this week
  ['Medibank', 'Bupa'].forEach((f) => {
    const fp = cur.filter((p) => p.fund === f && p !== mover);
    if (fp.some((p) => stay(p).some((d) => d.loc.hospital === 'greenslopes')) && fp.some((p) => stay(p).some((d) => d.loc.hospital === 'wesley'))) return;
    const wes = fp.filter(wesleyOnly);
    if (wes.length >= 2) { const q = wes[0]; GS(q); stay(q).forEach((d) => { d.loc = { hospital: 'greenslopes', ward: d.loc.ward === 'HDU' ? 'HDU' : 'ICU', bed: q.bed }; }); }
    else if (!fp.some(wesleyOnly)) { const q = fp.find((p) => p.hospital === 'greenslopes'); if (q) { q.hospital = 'wesley'; q.labelHosp = undefined; stay(q).forEach((d) => { d.loc = { hospital: 'wesley', ward: 'ICU', bed: q.bed }; }); } }
  });
  // Provider numbers here are made up for the sample data
  const hospitals = [{ id: 'wesley', name: 'The Wesley Hospital', provider: '242652BX' }, { id: 'greenslopes', name: 'Greenslopes Private Hospital', provider: '242652DH', demo: true }];
  return { patients, days, ecmo, cpd, locations, hospitals };
}
function addMins(t, m) { const [h, mm] = t.split(':').map(Number); const v = (h * 60 + mm + m) % 1440; return pad(Math.floor(v / 60)) + ':' + pad(v % 60); }
