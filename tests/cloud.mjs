// Website mode against an in-memory Google (fake-google.mjs, from Sudachi): two devices share one Drive.
// Run: serve docs/ on :8765 (python3 -m http.server 8765 --directory docs), then NODE_PATH=$(npm root -g) node tests/cloud.mjs
import { createRequire } from 'node:module';
import { createFakeGoogle } from './fake-google.mjs';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const U = process.env.WEB_URL || 'http://localhost:8765/';
const G = createFakeGoogle();
const b = await chromium.launch();
let fails = 0; const ok = (c, m, x = '') => { console.log((c ? 'PASS ' : 'FAIL ') + m, x); if (!c) fails++; };

async function device() {
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 } });
  await G.attach(ctx);
  await ctx.route(/accounts\.google\.com\/gsi\/client/, r => r.fulfill({ status: 200, contentType: 'text/javascript', body: 'window.google={accounts:{oauth2:{initTokenClient(c){return{requestAccessToken(){setTimeout(()=>c.callback({access_token:"tok",expires_in:3600}),10)}}},revoke(t,cb){cb&&cb()}}}}' }));
  await ctx.addInitScript(() => { if (!localStorage.getItem('bassiet.google')) localStorage.setItem('bassiet.google', JSON.stringify({ access_token: 'tok', exp: Date.now() + 3600e3, email: 'tester@example.com' })); });
  const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto(U); await p.waitForFunction(() => window.CT && !CT.ui.loading && CT.web, null, { timeout: 15000 });
  return { p, errs, sync: () => p.evaluate(() => CT.web.sync()) };
}
const A = await device(), B = await device();

// 1. A saves, syncs: Drive has core + 16 parts in a folder tagged bassiet
await A.p.evaluate(() => CT.setDoc('reads', 'c1-membrane', { done: true, right: 5, total: 5 }));
ok(await A.sync(), 'A syncs');
const mine = [...G.files.values()].filter(f => !f.trashed && /^(state\.json|recs-\d\d\.json)$/.test(f.name));
ok(mine.length === 17, 'core + 16 parts on Drive', mine.length);
const folder = [...G.files.values()].find(f => f.appProperties?.citrusApp === 'bassiet');
ok(!!folder, 'own folder tagged citrusApp=bassiet');

// 2. B pulls it
await B.sync(); await B.p.waitForTimeout(300);
ok(await B.p.evaluate(() => (CT.data.reads.find(r => r.id === 'c1-membrane') || {}).right) === 5, 'B sees A\'s stained stratum');

// 3. one edit → only one part goes up
const before = G.counts.upNames.length;
await A.p.evaluate(() => CT.setDoc('notes', 'n1', { text: 'from A' }));
await A.sync();
const ups = G.counts.upNames.slice(before).filter(n => /^recs-\d\d\.json$/.test(n));
ok(ups.length >= 1 && ups.length <= 2, 'one edit uploads only the changed parts (not all 16)', JSON.stringify(G.counts.upNames.slice(before)));

// 4. both edit at once → both kept
await A.p.evaluate(() => CT.setDoc('notes', 'na', { text: 'A' }));
await B.p.evaluate(() => CT.setDoc('notes', 'nb', { text: 'B' }));
await A.sync(); await B.sync(); await A.sync(); await A.p.waitForTimeout(300); await B.p.waitForTimeout(300);
const both = async (d) => d.p.evaluate(() => ['na', 'nb', 'n1'].every(id => CT.data.notes.some(n => n.id === id)));
ok(await both(A) && await both(B), 'simultaneous edits on two devices are both kept');

// 5. a deletion travels
await B.p.evaluate(() => CT.delDoc('notes', 'na')); await B.sync(); await A.sync(); await A.p.waitForTimeout(300);
ok(await A.p.evaluate(() => !CT.data.notes.some(n => n.id === 'na')), 'a delete on B removes it on A');

// 6. Send to Citrus writes status.json with drive.byTag into the tagged folder
await A.p.evaluate(() => CT.tellCitrus()); await A.p.waitForTimeout(500);
const st = [...G.files.values()].find(f => f.name === 'status.json' && !f.trashed && f.parents.includes(folder.id));
let sj = null; try { sj = JSON.parse(st.content.toString()); } catch {}
ok(sj && sj.drive && sj.drive.byTag === true && sj.drive.method === 'tag', 'status.json in the tagged folder with drive.byTag', sj && JSON.stringify(sj.drive));
ok(await A.p.evaluate(() => CT.ui.hub.msg), 'Citrus message', await A.p.evaluate(() => CT.ui.hub.msg));

// 7. a request that never answers → times out and recovers
G.faults.status500 = 3;
await A.p.evaluate(() => CT.setDoc('notes', 'n5', { text: 'after errors' }));
const r7 = await A.sync();
ok(r7 === true || (await A.p.evaluate(() => CT.web.cloud.phase)) === 'error', 'server errors: retried or scheduled', String(r7));

ok(!A.errs.length && !B.errs.length, 'no page errors', JSON.stringify([...A.errs, ...B.errs]));
console.log(G.tree ? G.tree().join?.('\n') || '' : '');
await b.close();
console.log(fails ? `${fails} FAILED` : 'ALL PASS'); process.exit(fails ? 1 : 0);
