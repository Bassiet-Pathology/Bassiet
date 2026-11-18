// Bassiet on its own website (GitHub Pages): stands in for the claude.ai runtime (window.claude.use) so the app code is the
// same in both places. Inside claude.ai the artifact keeps Claude's own storage; this file only loads on the website
// (web/boot.js decides).
//
//  db      → this device first (IndexedDB, two slots, devstore.js), then Google Drive: the family's cloud model
//            (claude/cloud-model.md): state.json + recs-00…15.json in Bassiet's tagged folder, newest edit wins per record,
//            deletions kept as tombstones, only changed parts travel, daily backups, a big deletion from another device asks.
//  assets  → plates: the image on this device (IndexedDB) and in <Bassiet folder>/plates on Drive.
//  mcp     → "Google Drive" connector stand-in (search_files, create_file, trash_file) for Send to Citrus / Send to Yuzu.
import * as G from './google.js';
import { createDevStore, createTabChannel } from './devstore.js';
import { join, merge } from './cloudparts.js';

const ROOT = 'My Apps';
const CLIENT_ID = '753489712404-ra7ahu34gjl305b4ss1765idmqg7am5s.apps.googleusercontent.com';   // the family's shared web client
const dev = createDevStore('bassiet');
const tabs = createTabChannel('bassiet.state');
const clone = (o) => JSON.parse(JSON.stringify(o));
const ymd = (t = Date.now()) => { const d = new Date(t); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };

// ─────────────── state on this device
let state = { app: 'bassiet', recs: {} };
let last = 0;
const clock = () => (last = Math.max(Date.now(), last + 1));
const hiOf = (s) => Object.values(s.recs).reduce((m, r) => Math.max(m, +r?.at || 0), 0);
export const cloud = { phase: 'idle', msg: '', lastSync: 0, lastError: '', retryAt: 0, pending: false, deviceSaved: 0 };

async function loadDevice() {
  if (dev.ok) {
    try { for (const s of await dev.slots()) { try { const j = JSON.parse(s.raw); if (j && j.recs) { state = j; last = hiOf(j); return; } } catch {} } }
    catch (e) { cloud.lastError = 'This device would not open its storage: ' + (e?.message || e); }
  }
  try { const j = JSON.parse(localStorage.getItem('bassiet.state') || 'null'); if (j && j.recs) { state = j; last = hiOf(j); } } catch {}
}
let saveTimer = null;
function persist(fromTab) {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(flushDevice, 200);
  if (!fromTab) { cloud.pending = true; scheduleSync(8000); }
}
async function flushDevice() {
  clearTimeout(saveTimer); saveTimer = null;
  const raw = JSON.stringify(state);
  try { if (dev.ok) await dev.write(raw, hiOf(state)); cloud.deviceSaved = Date.now(); }
  catch (e) { cloud.lastError = 'Could not save on this device: ' + (e?.message || e); }
  try { if (raw.length < 2.4e6) localStorage.setItem('bassiet.state', raw); else localStorage.removeItem('bassiet.state'); } catch {}
  tabs.post({ t: 'saved' });
  paint();
}
addEventListener('pagehide', () => { if (saveTimer) flushDevice(); });
document.addEventListener('visibilitychange', () => { if (document.hidden && saveTimer) flushDevice(); else if (!document.hidden) scheduleSync(1000); });
tabs.on(async (m) => { if (m?.t !== 'saved' || !dev.ok) return; try { const s = (await dev.slots())[0]; if (s) { const j = JSON.parse(s.raw); state = merge(state, j); last = Math.max(last, hiOf(state)); notifyAll(); } } catch {} });

// ─────────────── the db the app talks to (same shape as claude.ai's: collection(n).onSnapshot / doc(id).set|delete)
const subs = {};
function snapshot(coll) {
  const docs = [];
  for (const [k, r] of Object.entries(state.recs)) {
    const s = k.indexOf('/'); if (k.slice(0, s) !== coll || !r || r.d == null) continue;
    const id = k.slice(s + 1), d = r.d; docs.push({ id, data: () => clone(d) });
  }
  return { docs, metadata: { fromCache: false } };
}
function notify(coll) { for (const fn of subs[coll] || []) try { fn(snapshot(coll)); } catch (e) { console.warn(e); } }
function notifyAll() { for (const c of Object.keys(subs)) notify(c); }
function write(coll, id, obj) {
  if (!coll || !id || /\//.test(id)) return Promise.reject({ code: 'invalid_argument' });
  state.recs[`${coll}/${id}`] = { d: obj === null ? null : clone(obj), at: clock() };
  persist(); queueMicrotask(() => notify(coll));
  return Promise.resolve();
}
const db = {
  collection(coll) {
    return {
      onSnapshot(cb) { (subs[coll] = subs[coll] || new Set()).add(cb); queueMicrotask(() => cb(snapshot(coll))); return () => subs[coll].delete(cb); },
      doc(id) { return { set: (o) => write(coll, id, o || {}), update: (o) => { const r = state.recs[`${coll}/${id}`]; return write(coll, id, { ...(r?.d || {}), ...o }); }, delete: () => write(coll, id, null) }; },
    };
  },
};

// ─────────────── Drive sync (one tab at a time, retries 30 s / 2 / 5 / 15 min)
let syncTimer = null, retryStep = 0, syncing = null;
const RETRY = [30e3, 120e3, 300e3, 900e3];
function scheduleSync(ms) { clearTimeout(syncTimer); syncTimer = setTimeout(() => sync().catch(() => {}), ms); }
setInterval(() => { if (!document.hidden) scheduleSync(10); }, 5 * 60e3);
addEventListener('online', () => scheduleSync(500));
const withLock = (fn) => navigator.locks?.request ? navigator.locks.request('bassiet-drive', fn) : fn();

let again = null;
export function sync({ all = false } = {}) {
  // asked while a sync is running: run once more right after it, so nothing saved meanwhile waits for the next timer
  if (syncing) { if (!again) again = syncing.catch(() => {}).then(() => { again = null; return sync({ all }); }); return again; }
  if (!G.isSignedIn()) { cloud.phase = G.wasSignedIn() ? 'tap' : 'off'; paint(); return Promise.resolve(false); }
  syncing = withLock(async () => {
    cloud.phase = 'sync'; paint();
    try {
      await pull(all);
      try { await G.saveRemoteState(ROOT, state); }
      catch (e) { if (!e.conflict) throw e; await pull(false); await G.saveRemoteState(ROOT, state, { force: true }); }
      G.backupDaily(ROOT, state, ymd()).catch(() => {});
      cloud.phase = 'ok'; cloud.lastSync = Date.now(); cloud.pending = false; cloud.lastError = ''; retryStep = 0; cloud.retryAt = 0;
      return true;
    } catch (e) {
      cloud.lastError = e?.message || String(e);
      cloud.phase = e?.auth ? 'tap' : navigator.onLine === false ? 'offline' : 'error';
      if (!e?.auth) { const ms = RETRY[Math.min(retryStep++, RETRY.length - 1)]; cloud.retryAt = Date.now() + ms; scheduleSync(ms); }
      return false;
    } finally { syncing = null; paint(); }
  });
  return syncing;
}
async function pull(all) {
  const remote = await G.loadRemoteState(ROOT, { all });
  if (!remote) return;
  const theirs = join(remote.core, remote.parts);
  // a big deletion from another device asks first (≥25 records and ≥20 % of what this device holds)
  const live = Object.entries(state.recs).filter(([, r]) => r && r.d != null);
  const gone = live.filter(([k, r]) => { const t = theirs.recs[k]; return t && t.d === null && (+t.at || 0) > (+r.at || 0); });
  if (gone.length >= 25 && gone.length >= live.length * 0.2) {
    await G.backupBefore(ROOT, state, 'mass-delete').catch(() => {});
    if (confirm(`Another device removed ${gone.length} saved items (progress, notes or misses). Bring them back?\n\nOK = bring them back · Cancel = keep them removed. A copy was saved in Drive › Bassiet › backups either way.`)) {
      for (const [k, r] of gone) state.recs[k] = { d: r.d, at: clock() };
      for (const [k] of gone) delete theirs.recs[k];
    }
  }
  const before = JSON.stringify(state.recs);
  state = merge(state, theirs); last = Math.max(last, hiOf(state));
  if (JSON.stringify(state.recs) !== before) { await flushDevice(); notifyAll(); }
}

// ─────────────── plates (assets): the image on this device and on Drive
let blobDb = null;
const blobs = () => blobDb || (blobDb = new Promise((res, rej) => { const r = indexedDB.open('bassiet-blobs', 1); r.onupgradeneeded = () => r.result.createObjectStore('b'); r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error); }));
const bx = (mode, fn) => blobs().then(d => new Promise((res, rej) => { const t = d.transaction('b', mode), s = t.objectStore('b'); const q = fn(s); t.oncomplete = () => res(q?.result); t.onerror = () => rej(t.error); }));
const urls = {}, loading = {};
const ext = (type) => (/png/.test(type) ? '.png' : /webp/.test(type) ? '.webp' : /gif/.test(type) ? '.gif' : '.jpg');
const assets = {
  async upload(blob) {
    const id = 'p' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
    await bx('readwrite', (s) => s.put(blob, id));
    urls[id] = URL.createObjectURL(blob);
    const name = id + ext(blob.type);
    write('webassets', id, { name, type: blob.type || '', size: blob.size || 0, onDrive: false });
    if (G.isSignedIn()) G.uploadBlob(ROOT, name, blob).then(() => write('webassets', id, { name, type: blob.type || '', size: blob.size || 0, onDrive: true })).catch(() => {});
    return { id, url: urls[id], sizeBytes: blob.size || 0, contentType: blob.type || '' };
  },
  async delete(id) {
    const r = state.recs[`webassets/${id}`]?.d;
    await bx('readwrite', (s) => s.delete(id)).catch(() => {});
    if (urls[id]) { URL.revokeObjectURL(urls[id]); delete urls[id]; }
    if (r?.name && G.isSignedIn()) await G.deleteBlob(ROOT, r.name).catch(() => {});
    write('webassets', id, null);
  },
  async list() { return { assets: Object.keys(state.recs).filter(k => k.startsWith('webassets/') && state.recs[k].d).map(k => ({ id: k.slice(10), url: urls[k.slice(10)] || '' })), usage: {} }; },
};
/** The picture for a plate: from memory, else this device, else Drive (then the screen redraws). */
export function blobUrl(id) {
  if (urls[id]) return urls[id];
  if (!loading[id]) loading[id] = (async () => {
    let b = await bx('readonly', (s) => s.get(id)).catch(() => null);
    if (!b && G.isSignedIn()) { const r = state.recs[`webassets/${id}`]?.d; if (r?.name) { b = await G.downloadBlob(ROOT, r.name).catch(() => null); if (b) await bx('readwrite', (s) => s.put(b, id)).catch(() => {}); } }
    if (b) { urls[id] = URL.createObjectURL(b); window.CT?.requestRender?.(); }
  })().finally(() => setTimeout(() => delete loading[id], 30000));
  return 'data:image/gif;base64,R0lGODlhAQABAAAAACw=';
}
// plates added before Google was connected go up at the next sync
async function uploadMissingPlates() {
  for (const [k, r] of Object.entries(state.recs)) {
    if (!k.startsWith('webassets/') || !r?.d || r.d.onDrive) continue;
    const id = k.slice(10), b = await bx('readonly', (s) => s.get(id)).catch(() => null);
    if (b) { try { await G.uploadBlob(ROOT, r.d.name, b); write('webassets', id, { ...r.d, onDrive: true }); } catch { return; } }
  }
}

// ─────────────── the "Google Drive" connector stand-in
const mcp = {
  async callTool(server, tool, args) {
    if (!G.isSignedIn()) throw { code: 'approval_required', message: 'Connect Google first (the cloud button at the top).' };
    try { return await G.connectorTool(tool, args); }
    catch (e) { throw { code: e?.auth ? 'approval_required' : e?.network ? 'server_unavailable' : e?.status === 404 ? 'not_found' : e?.retryable ? 'server_unavailable' : 'tool_error', message: e?.message, retryable: !!e?.retryable }; }
  },
  async listTools() { return [{ name: 'search_files' }, { name: 'create_file' }, { name: 'trash_file' }]; },
};

// ─────────────── the cloud button and its sheet (plain words, cloud-model.md › "Your data")
function sentence() {
  const p = cloud.phase, when = (t) => t ? new Date(t).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
  if (!G.wasSignedIn() && !G.isSignedIn() && cloud.lastError) return 'Not connected: ' + cloud.lastError + ' Progress is saved on this device.';
  if (!G.wasSignedIn() && !G.isSignedIn()) return 'Saved on this device only. Connect Google to keep a copy on your Drive and use Bassiet on your other devices.';
  if (p === 'sync') return 'Saving to your Drive…';
  if (p === 'tap' || (!G.isSignedIn() && G.wasSignedIn())) return 'Saved on this device. Google needs a tap to reconnect before Drive gets the latest.';
  if (p === 'offline') return 'You are offline. Everything is saved on this device and goes to Drive when you are back.';
  if (p === 'error') return `Saved on this device. Drive did not take the last save (${cloud.lastError}); trying again at ${when(cloud.retryAt)}.`;
  if (cloud.pending) return 'Saved on this device; Drive gets it in a few seconds.';
  return cloud.lastSync ? `Everything is saved on this device and on your Drive (last at ${when(cloud.lastSync)}).` : 'Connected to Google. Checking your Drive…';
}
let btn = null;
function paint() {
  if (!btn) return;
  const p = cloud.phase, signed = G.isSignedIn();
  const label = !signed && !G.wasSignedIn() ? 'Connect Drive' : p === 'sync' ? 'Saving…' : !signed || p === 'tap' ? 'Reconnect' : p === 'offline' ? 'Offline' : p === 'error' ? 'Not synced' : cloud.pending ? 'Saving…' : 'Saved';
  btn.textContent = '☁ ' + label; btn.title = sentence(); btn.dataset.state = p;
  const s = document.getElementById('bassiet-cloud-sentence'); if (s) s.textContent = sentence();
}
function mountButton() {
  const head = document.querySelector('header .head') || document.querySelector('header') || document.body;
  btn = document.createElement('button'); btn.type = 'button'; btn.id = 'bassiet-cloud'; btn.className = 'cloudbtn';
  btn.setAttribute('aria-haspopup', 'dialog');
  btn.addEventListener('click', openSheet); head.appendChild(btn); paint();
}
function openSheet() {
  let d = document.getElementById('bassiet-cloud-sheet');
  if (!d) {
    d = document.createElement('dialog'); d.id = 'bassiet-cloud-sheet'; d.className = 'cloudsheet';
    d.innerHTML = '<h2>Your data</h2><p id="bassiet-cloud-sentence"></p><div class="cloudrow"><button type="button" data-c="connect">Connect Google</button><button type="button" data-c="sync">Sync now</button><button type="button" data-c="out">Sign out</button><button type="button" data-c="close">Close</button></div><p class="muted small">Progress is kept on this device and in your Google Drive (the Bassiet folder: state.json, recs-00…15.json, backups/ with one copy a day for 14 days, plates/). Nothing is shared.</p>';
    d.addEventListener('click', async (e) => {
      const c = e.target?.dataset?.c; if (!c) { if (e.target === d) d.close(); return; }
      if (c === 'close') return d.close();
      if (c === 'out') { G.signOut(); cloud.phase = 'off'; paint(); return; }
      if (c === 'connect') { try { await G.signIn({ renew: G.wasSignedIn() }); } catch (x) { cloud.lastError = x?.message || String(x); paint(); return; } }
      await sync({ all: c === 'connect' }); uploadMissingPlates();
    });
    document.body.appendChild(d);
  }
  paint(); try { d.showModal(); } catch { d.setAttribute('open', ''); }
}

// ─────────────── start
let started = null;
function start() {
  if (started) return started;
  started = (async () => {
    await loadDevice();
    G.loadSeen(Object.keys(state.recs).length > 0);
    try { const r = await G.takeRedirect(window.__bassietGoogleHash); window.__bassietGoogleHash = ''; if (r && !r.ok) cloud.lastError = r.message; if (r && r.ok) cloud.phase = 'idle'; } catch {}
    G.init(CLIENT_ID).catch(() => {});
    G.renewOnTap(() => sync());
    G.onAuthChange(() => paint());
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mountButton); else mountButton();
    patchApp();
    if (G.isSignedIn()) scheduleSync(300);
  })();
  return started;
}
/** Website-only touches on the app: its own address, plate pictures, and folders found by tag (the REST API can read tags). */
function patchApp() {
  const CT = window.CT; if (!CT) return;
  CT.APP_URL = location.origin + location.pathname.replace(/index\.html$/, '');
  CT.blobUrl = blobUrl;
  CT.web = { cloud, sync, openSheet };
  const orig = CT.driveFolder;
  CT.driveFolder = async (key, fresh) => {
    if (!G.isSignedIn()) throw { code: 'approval_required' };
    const id = key === 'bassiet' ? await G.ownFolder(ROOT) : key === 'yuzu-inbox' ? await G.yuzuInbox(ROOT) : null;
    if (id) return id;
    if (key === 'yuzu-inbox') throw { code: 'no_folder', key };
    return orig ? orig(key, fresh) : Promise.reject({ code: 'no_folder', key });
  };
  const st = CT.statusJSON;
  if (st) CT.statusJSON = function () { const o = st.apply(this, arguments); o.drive = { byTag: true, method: 'tag', note: 'Website: folders found by appProperties.citrusApp tag (own folder tagged bassiet; Yuzu inbox via yuzu-data).' }; o.url = CT.APP_URL; return o; };
}

export async function use(name) {
  await start();
  if (name === 'db') return db;
  if (name === 'assets') return assets;
  if (name === 'mcp') return mcp;
  return null;
}
