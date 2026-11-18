// How Bassiet's progress is laid out on Drive (the family's cloud model, claude/cloud-model.md, after Sudachi's cloudparts.js):
// one small core file (state.json: app, version, device info) and the records split over 16 part files
// (recs-00.json … recs-15.json) by a hash of each record key ("<collection>/<doc id>"). Answering one stain test changes a
// few records, so one or two small files go up instead of everything. Each record is { d: <document> | null (deleted), at }.

export const PARTS = 16;                 // never change without a migration
export const LAYOUT = 2;
export const partName = (i) => `recs-${String(i).padStart(2, '0')}.json`;
export const isPart = (name) => /^recs-\d\d\.json$/.test(name || '');
const hash = (s) => { let h = 2166136261; for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619); return h >>> 0; };
export const partOf = (key) => hash(String(key)) % PARTS;

/** state { recs, ...core } → { core, parts } (all 16 parts, empty ones included). */
export function split(state) {
  const { recs = {}, ...rest } = state || {};
  const parts = {};
  for (let i = 0; i < PARTS; i++) parts[partName(i)] = { part: i, layout: LAYOUT, recs: {} };
  for (const [k, r] of Object.entries(recs)) parts[partName(partOf(k))].recs[k] = r;
  return { core: { ...rest, layout: LAYOUT, parts: PARTS }, parts };
}
/** core + parts read → one state (newest record wins when the same key appears twice). */
export function join(core, parts = {}) {
  const recs = { ...((core && core.recs) || {}) };
  for (const p of Object.values(parts)) if (p && typeof p === 'object' && p.recs && typeof p.recs === 'object')
    for (const [k, r] of Object.entries(p.recs)) if (!recs[k] || (+r?.at || 0) >= (+recs[k]?.at || 0)) recs[k] = r;
  const { layout, parts: _n, ...rest } = core || {};
  return { ...rest, recs };
}
/** Merge two states record by record: the newest edit wins; deletions are kept as tombstones for 400 days. */
export function merge(a, b) {
  const out = { ...(a?.recs || {}) };
  for (const [k, r] of Object.entries(b?.recs || {})) if (!out[k] || (+r?.at || 0) > (+out[k]?.at || 0)) out[k] = r;
  const cut = Date.now() - 400 * 864e5;
  for (const [k, r] of Object.entries(out)) if (r && r.d === null && (+r.at || 0) < cut) delete out[k];
  return { ...(a || {}), ...(b || {}), recs: out };
}
