/* ===== Gill-Able: reference data ===== */

const SECTIONS = [
  { id: 'icu', name: 'ICU management' },
  { id: 'proc', name: 'Lines, support and infusions' },
  { id: 'cons', name: 'Consults and procedures' },
  { id: 'anaes', name: 'Anaesthesia and modifiers' },
  { id: 'extra', name: 'Other items' }
];

/* [code, section, label as printed on the Wesley form, flags]
   flags: next = the subsequent-day item for a day-1 item
          daily = usually continues day to day
          timed = note start/finish times
          anaes = anaesthesia initiation item (time + ASA modifiers apply)
          hint  = small print on the paper form */
const FORM_ITEMS = [
  ['13870', 'icu', 'Day 1 management, in ICU by ICU specialist', { next: '13873' }],
  ['13873', 'icu', 'Subsequent management in ICU by ICU specialist', { daily: 1 }],
  ['13881', 'icu', 'Day 1 intubation & management of ventilation in ICU', { next: '13882' }],
  ['13882', 'icu', 'Subsequent management of ventilation in ICU (incl NIV)', { daily: 1 }],
  ['13876A', 'icu', 'Haemodynamic monitoring (arterial)', { daily: 1, hint: 'once per calendar day' }],
  ['13876C', 'icu', 'Haemodynamic monitoring (CVP)', { daily: 1, hint: 'once per calendar day' }],
  ['13876P', 'icu', 'Haemodynamic monitoring (PAP, PAWP)', { daily: 1, hint: 'once per calendar day' }],
  ['13876R', 'icu', 'Haemodynamic monitoring (right atrium/ventricle)', { daily: 1, hint: 'once per calendar day' }],
  ['13857', 'icu', 'Intubation and ventilation outside an ICU by ICU staff', {}],
  ['13706', 'proc', 'Blood/bone marrow transfusion', {}],
  ['13815', 'proc', 'Insertion of central venous catheter', { hint: 'percutaneous or open exposure' }],
  ['13842', 'proc', 'Insertion of an arterial line', {}],
  ['13818', 'proc', 'Insertion of pulmonary artery catheter (right heart BC)', {}],
  ['13848', 'proc', 'Management of IABP', { daily: 1 }],
  ['13885', 'proc', 'Day 1 management and insertion of CVVHD', { next: '13888' }],
  ['13888', 'proc', 'Subsequent management of CVVHD', { daily: 1 }],
  ['18216', 'proc', 'Commencement/initial injection of epidural', { hint: 'incl up to 1hr cont. attendance', next: '18225' }],
  ['18225', 'proc', 'Subsequent daily maintenance/revision of epidural etc infusion', { hint: '> 15 min cont. attendance', daily: 1 }],
  ['104', 'cons', 'Professional initial attendance by specialist', { next: '105' }],
  ['105', 'cons', 'Professional subsequent attendance by specialist', {}],
  ['160', 'cons', 'Initial consult by a specialist – outside ICU/MET (60 min)', { timed: 1, hint: 'note times' }],
  ['13899', 'cons', 'Ward consult for critically ill patient not for ICU admission (60 min)', { timed: 1 }],
  ['13400', 'cons', 'Cardioversion', { hint: 'restoration of cardiac rhythm' }],
  ['38828', 'cons', 'Insertion of intercostal drain/pleurocentesis', {}],
  ['39000', 'cons', 'Lumbar puncture', { timed: 1, hint: 'note times' }],
  ['41880', 'cons', 'Tracheostomy', { timed: 1, hint: 'percutaneous technique (note times)' }],
  ['38419', 'cons', 'Bronchoscopy', { timed: 1, hint: 'as an independent procedure (note times)' }],
  ['13830', 'cons', 'Management of ICP monitor', { daily: 1 }],
  ['13839', 'cons', 'Arterial puncture for diagnostic purposes', {}],
  ['13851', 'cons', 'Ventricular assist device – first day management', { next: '13854' }],
  ['13854', 'cons', 'Ventricular assist device – subsequent daily management', { daily: 1 }],
  ['38256', 'cons', 'Insertion of transvenous pacemaker', { timed: 1, hint: 'note times' }],
  ['17610', 'anaes', 'Pre-operative pre-anaesthesia assessment', {}],
  ['20745', 'anaes', 'Initiation of anaesthesia for upper GI endoscopy', { anaes: 1 }],
  ['20320', 'anaes', 'Initiation of anaesthesia for tracheostomy', { anaes: 1 }],
  ['20520', 'anaes', 'Initiation of anaesthesia for bronchoscopy', { anaes: 1 }],
  ['21936', 'anaes', 'Initiation of anaesthesia for TOE', { anaes: 1 }],
  ['20410', 'anaes', 'Initiation of anaesthesia for cardioversion', { anaes: 1 }],
  ['21922', 'anaes', 'Initiation of anaesthesia for CT/MRI/angiography', { anaes: 1 }],
  ['25014', 'anaes', 'Age modifier: > 75 years of age', {}],
  ['25020', 'anaes', 'Immediate treatment – significant threat to life/body part', { hint: 'clash 25025' }],
  ['25025', 'anaes', 'Time modifier: weekend/public holiday/after hours (20h00 – 08h00)', {}]
];

/* Anaesthesia time bands and ASA modifiers, as printed at the foot of the form */
const TIME_BANDS = [
  { min: 16, max: 30, code: '23025' },
  { min: 31, max: 45, code: '23035' },
  { min: 46, max: 60, code: '23045' },
  { min: 61, max: 75, code: '23055' },
  { min: 76, max: 90, code: '23065' }
];
const ASA_CODES = { '3': '25000', '4': '25005', '5': '25010' };

/* Items not printed on the Wesley form but useful to have (shown under "Other items") */
const EXTRA_ITEMS = [
  ['13840', 'extra', 'ECMO: peripheral cannulation for VV ECMO', {}],
  ['13837', 'extra', 'ECMO: VV ECMO management, first day', { next: '13838' }],
  ['13838', 'extra', 'ECMO: VV ECMO management, each later day', { daily: 1 }],
  ['13832', 'extra', 'ECMO: peripheral cannulation for VA ECMO', {}],
  ['13834', 'extra', 'ECMO: VA ECMO management, first day', { next: '13835' }],
  ['13835', 'extra', 'ECMO: VA ECMO management, each later day', { daily: 1 }],
  ['38800', 'extra', 'Pleural aspiration, diagnostic', {}],
  ['38803', 'extra', 'Pleural aspiration with therapeutic drainage', {}],
  ['18222', 'extra', 'Regional catheter subsequent injection/revision (15 min or less)', {}],
  ['20740', 'extra', 'Anaesthesia for upper GI endoscopic procedures (routine)', { anaes: 1 }]
];

/* Same-day combinations to flag (from MBS explanatory notes TN.1.9 to TN.1.11, TN.10.3) */
const SAME_DAY_CLASHES = [
  ['13870', '13873', 'Day 1 and subsequent ICU management on the same day'],
  ['13885', '13888', 'First-day and later-day haemofiltration on the same day'],
  ['13851', '13854', 'First-day and later-day VAD management on the same day'],
  ['13837', '13838', 'First-day and later-day VV ECMO management on the same day'],
  ['13834', '13835', 'First-day and later-day VA ECMO management on the same day'],
  ['13899', '13870', '13899 (goals of care) can\u2019t be claimed with 13870 on the same day'],
  ['13899', '13873', '13899 (goals of care) can\u2019t be claimed with 13873 on the same day'],
  ['13839', '13870', '13839 isn\u2019t payable on the same day as 13870 (arterial sampling is included)'],
  ['13839', '13873', '13839 isn\u2019t payable on the same day as 13873 (arterial sampling is included)'],
  ['104', '13870', '104 alongside your own 13870: the ICU fee covers your ICU attendances'],
  ['104', '13873', '104 alongside your own 13873: the ICU fee covers your ICU attendances'],
  ['105', '13870', '105 alongside your own 13870: the ICU fee covers your ICU attendances'],
  ['105', '13873', '105 alongside your own 13873: the ICU fee covers your ICU attendances'],
  ['104', '105', 'Initial and subsequent attendance on the same day'],
  ['25020', '25025', '25020 and 25025 can\u2019t be claimed together'],
  ['38800', '38803', '38800 and 38803 can\u2019t be claimed together']
];

/* Criteria text is merged in at build time from mbs_criteria.json */
const MBS_CRITERIA = /*MBS_CRITERIA*/{}/*END*/;

const DEFAULT_FUNDS = [
  'Medibank', 'Bupa', 'HCF', 'nib', 'HBF', 'ahm', 'Australian Unity', 'GMHBA',
  'Teachers Health', 'Defence Health', 'CBHS', 'Health Partners', 'Westfund',
  'Peoplecare', 'Police Health', 'Emergency Services Health', 'Queensland Country Health Fund',
  'TUH Health Fund', 'Doctors’ Health Fund', 'Navy Health', 'Nurses & Midwives Health',
  'Latrobe Health', 'HIF', 'RT Health', 'St.LukesHealth', 'Phoenix Health', 'Frank Health',
  'DVA', 'WorkCover Qld', 'Overseas visitor cover', 'Uninsured / self-funded', 'Third party (CTP)'
];

/* ===== CPD (CICM CPD Program, 2026 cycle) ===== */
const CPD_CATS = {
  ea: { name: 'Educational activities', short: 'Educational', min: 12.5 },
  rp: { name: 'Reviewing performance', short: 'Reviewing performance', min: 5 },
  mo: { name: 'Measuring outcomes', short: 'Measuring outcomes', min: 5 }
};
const CPD_TYPES = [
  { id: 'mm', name: 'Morbidity & mortality meeting', cat: 'mo' },
  { id: 'qa', name: 'Quality assurance / governance meeting', cat: 'rp' },
  { id: 'journal', name: 'Journal club', cat: 'ea' },
  { id: 'grand', name: 'Lecture / grand rounds', cat: 'ea' },
  { id: 'conf', name: 'Conference / ASM', cat: 'ea' },
  { id: 'course', name: 'Course / workshop', cat: 'ea' },
  { id: 'sim', name: 'Simulation training', cat: 'ea' },
  { id: 'online', name: 'Online learning / webinar', cat: 'ea' },
  { id: 'reading', name: 'Reading / self-directed learning', cat: 'ea' },
  { id: 'teach', name: 'Teaching / presenting / supervision', cat: 'ea' },
  { id: 'research', name: 'Research / publication', cat: 'ea' },
  { id: 'airway', name: 'Airway management course (CICM SHLR)', cat: 'ea', shlr: true },
  { id: 'pdp', name: 'Professional development plan', cat: 'rp', maxHours: 3 },
  { id: 'peer', name: 'Peer review of practice / case review', cat: 'rp' },
  { id: 'msf', name: 'Multi-source feedback', cat: 'rp' },
  { id: 'observe', name: 'Direct observation of practice', cat: 'rp' },
  { id: 'audit_self', name: 'Personal practice review / audit', cat: 'rp' },
  { id: 'medlegal', name: 'Medico-legal report / expert opinion', cat: 'rp' },
  { id: 'accred', name: 'Accreditation / hospital inspection', cat: 'rp' },
  { id: 'incident', name: 'Critical incident review / RCA', cat: 'mo' },
  { id: 'audit', name: 'Clinical audit (outcome data)', cat: 'mo' },
  { id: 'mdt', name: 'Multidisciplinary team meeting', cat: 'mo' },
  { id: 'registry', name: 'Registry data review (e.g. ANZICS CORE)', cat: 'mo' },
  { id: 'qi', name: 'Quality improvement project', cat: 'mo' }
];
const CAPE = [
  { id: 'cultural', name: 'Culturally safe practice' },
  { id: 'inequity', name: 'Addressing health inequities' },
  { id: 'prof', name: 'Professionalism' },
  { id: 'ethics', name: 'Ethical practice' }
];

/* ===== ECMO ===== */
const ECMO_TYPES = [
  { id: 'cannulation', name: 'Cannulation', target: 6 },
  { id: 'circuit', name: 'Circuit change', target: 2 },
  { id: 'review', name: 'Patient review', target: 24 },
  { id: 'qa', name: 'QA meeting', target: 4 },
  { id: 'round', name: 'ECMO round', target: 24 },
  { id: 'retrieval', name: 'Retrieval completed', target: 2 },
  { id: 'consult', name: 'ECMO consult', target: 6 },
  { id: 'other', name: 'Other ECMO event', target: 0 }
];
const ECMO_OPTS = {
  mode: ['VV', 'VA', 'VAV', 'ECPR'],
  role: ['Primary operator', 'Supervisor', 'Assistant'],
  config: ['Femoral–jugular', 'Femoral–femoral', 'Single-site dual-lumen', 'Central', 'Other'],
  imaging: ['Ultrasound', 'TOE', 'Fluoroscopy'],
  setting: ['ICU', 'Cath lab', 'Theatre', 'ED', 'Referring hospital'],
  complication: ['None', 'Bleeding', 'Vessel injury', 'Malposition', 'Limb ischaemia', 'Other'],
  circuitReason: ['Oxygenator failure', 'Pump head thrombus', 'Haemolysis', 'Circuit clot', 'Air entrainment', 'Elective / time-based', 'Other'],
  urgency: ['Elective', 'Urgent', 'Emergency'],
  transport: ['Road', 'Rotary wing', 'Fixed wing', 'Intra-hospital'],
  consultOutcome: ['ECMO started', 'Accepted for transfer', 'Advice only', 'Declined', 'Monitor / revisit'],
  otherKind: ['Decannulation', 'Simulation / emergency drill', 'Education delivered', 'ECMO course attended', 'ECPR activation', 'Wet lab / training', 'Transport on ECMO', 'Other']
};
/* ECMO events that naturally count as CPD, and how */
const ECMO_TO_CPD = {
  qa: { type: 'qa' },
  'other:Simulation / emergency drill': { type: 'sim' },
  'other:Education delivered': { type: 'teach' },
  'other:ECMO course attended': { type: 'course' },
  'other:Wet lab / training': { type: 'sim' }
};
