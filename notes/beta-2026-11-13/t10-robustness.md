# t10 — Engineering robustness (storage, assets, Drive, service worker, leaks, performance, XSS, routing, dates)

Tester t10 · 13/11/2026 · source read-only · scripts in `beta/work-t10/` · shots `beta/shots/t10-*.png`

## 1. Verdict — 6/10

The rendering layer is clean. Every piece of user text is escaped (no XSS got through in any test), listeners are added once, no intervals leak, odd hash routes never crash, and localStorage failures are handled everywhere. The weak part is the **storage layer once real Claude storage is attached**. I ran the app against a mock `window.claude` db that delivers snapshots asynchronously, as the real one does. It showed four confirmed data-integrity bugs:
- Actions made before the db resolves are silently thrown away.
- Read-modify-write counters lose increments.
- The story document overwrites its own `lastVisit`.
- Failed saves are reported to the user as successes, and in Plates a failed row delete still deletes the image asset permanently.

None of these show up in the local in-memory mode that the beta scripts use, so the other testers will not have seen them. Offline/PWA support is also only partly there: the shell is not precached, fonts load from the network, and there is no charset meta.

## 2. What works well
- **Escaping is consistent.** I seeded hostile `<img onerror>`/`<svg onload>`/quote payloads into notes, misses (every field), plate fields including `assetId`, day ids, story fields and the Atlas query, then rendered every view. Nothing executed (`window.__x` stayed 0).
- **No listener or timer leaks.** I counted `addEventListener` calls before and after 120 route changes and they were identical. Duel `setInterval` is cleared on leaving the route. The Pall rAF drops to about 1/s on reading pages. Heap stays flat at about 10 MB.
- **Routing never crashes.** `#ch-nonexistent`, `#duel-99`, `#duel-0`, `#depth-abc`, `#restain-nope`, `#concept-nope`, 5000-char hashes and encoded `<img>` hashes all render a safe fallback with no page errors.
- **localStorage failures are handled.** The look settings work when the `localStorage` getter throws, when `setItem` throws, with corrupt JSON and with `null`.
- **Data integrity is good.** All 71 chapters map to a depth, every answer index is valid, every concept reference and edge resolves, and all 135 item ids, 155 concept ids and chapter ids fit the db path grammar.
- **Per-document write serialization** (`enqueue`) matches the db contract ("one write at a time per document").
- **Drive calls match the connector.** A read-only `search_files` with the app's exact query returned `files[].title/parentId/id` as the code expects. The hub folder is the bassiet-specific one, so trashing old `status.json` there is safe. The Yuzu inbox lookup finds exactly one inbox today.
- **Render cost is low** on phone: Dive home 4–5 ms, Atlas 2 ms, Hull 1–3 ms (no throttle). Even with 1000 misses, 500 days, all reads and all prog docs, no view goes above about 21 ms at 4× CPU throttle.

## 3. Findings

How I verified each finding: **[M]** = confirmed with the mock-db Playwright script (`dbtest.js`, `dbtest2.js`); **[P]** = confirmed with another Playwright script; **[C]** = code review only.

| ID | Sev | File | Where | Problem | Fix |
|---|---|---|---|---|---|
| t10-01 | Critical | app-core.js, app-today.js | `CT.init`; `CT.render` gate `CT.ui.loading&&CT.db&&!CT.ui.stale` | **[M] Actions made before db resolves are lost; a stale screen can overwrite real data.** While `claude.use('db')` is pending, `CT.db` is null, so the gate is false. The full UI renders with empty progress and no banner: the user sees "Depth −01, 0 of 4 strata", as if progress were wiped. Anything they do goes to the memory arrays. When db resolves, `subscribe()` replaces those arrays and the action is gone. Test A: one stain-test answer, then db arrived; the miss and the `days` bump disappeared and the store had 0 writes. Test A2: if db resolves but the screen has not re-rendered, the first click writes values computed from empty data straight to the store. For example `bumpDay` overwrites today's `days` doc with `{n:0,q:1}`. | Gate on loading alone, start the 10 s timer in `init`, and resolve the capabilities in parallel (code F1). Until storage is decided, nothing interactive renders. |
| t10-02 | High | app-core.js | `CT.init` sequential `await c.use('db')`, then `assets`, then `mcp`; `subscribe()` only after all three | **[M] Data loading waits on assets and mcp.** Progress loading is held up until Plates and Drive capabilities resolve. Each `use()` can take up to 10 s when the host does not answer. Test A2: db resolved at 0.3 s, but subscription only started at about 20 s. "Loading your progress…" stayed for 20 s. The 10 s stale timer does not cover this, because it starts inside `subscribe()`. | Start `subscribe()` the moment db resolves. Let `assets`/`mcp` arrive later and re-render (code F1). |
| t10-03 | High | app-core.js, app-dive.js | `CT.record`, `CT.bumpDay` (`days/<today>`) | **[M] Lost increments.** The counters are read-modify-write from `CT.data.days`, which in db mode only updates when the snapshot comes back. Test B: 5 correct stain-test answers stored `q:2` (50 ms between clicks) or `q:3` (300 ms between clicks with a 400 ms store round trip). This undercounts the dive-log "Answers/Right", the grade and `CT.counts().today`. The db docs warn: "Do NOT build monotonic counters from read-modify-update". | Optimistic local overlay: `setDoc` updates `CT.data` immediately and keeps a pending map that snapshots are merged under (code F2). Counters then read the latest local value. |
| t10-04 | High | app-dive.js | `sessionStart` + `flush` + `saveStory` (`reads/story`) | **[M] The story doc overwrites itself.** `sessionStart` writes `{lastVisit:now}`. One tick later `flush` writes `seenAt` from the copy taken before that write, so `lastVisit` goes back to the old value. Test C: two writes with `lastVisit` new then old, so the final `lastVisit` was not updated. Effects: the "return after 2 days" radio fires on every visit that has new transmissions. `flush` also writes the story doc twice in one tick (seenAt, then entered), and the second write can drop the first's `seenAt`. Every render before the snapshot returns re-queues `pendingSeen`, causing extra writes. | F2 fixes the stale read. Also merge into one write and hold the flush until loading is done (code F3). |
| t10-05 | High | app-core.js + callers | `CT.setDoc`/`CT.delDoc` return `enqueue(...).catch(fail)`, so they resolve on failure | **[M] Failed saves look successful.** Callers' `.then()` success branches run even after a failed write. Test D (`quota_exceeded`): the toast went "Could not save" then "**Stratum stained.**" and the app moved to `#depth-1`, but nothing was saved. Same for "Note saved." (`A.saveNote`), "Logged." (`A.missAdd`), "The stain holds." (`A.rsSave`) and Test H "**Image saved.**" (the asset is orphaned and the draft answer is cleared). | Resolve `true`/`false` and check it in every caller (code F2 and F4). On failure, stay on the page and keep the answers and drafts. |
| t10-06 | High | app-practice.js | `A.imgDel` | **[M] An image is deleted even when its row delete fails.** `delDoc(...).then(assets.delete)` runs after a failed delete. Test G: the row was still in the store but the asset was deleted, so the plate is now a broken image forever. Asset deletes cannot be undone. | `CT.delDoc(...).then(function(ok){if(ok&&x&&CT.assets)return CT.assets.delete(x.assetId).catch(function(){})})` (code F4). |
| t10-07 | Medium | app-core.js | `subscribe()` error callback | **[M] No recovery when a subscription dies.** A terminal `unavailable` on one collection (the host stopped answering) shows the stale banner and never resubscribes. The docs say "a fresh onSnapshot is the only recovery". Test E: the subscription count stayed at 6 and the banner stayed for the rest of the visit. `revoked` is not treated as read-only either. | Resubscribe on `unavailable` with backoff, up to 3 times; on `revoked`, switch to read-only (code F5). |
| t10-08 | Medium | app-today.js | `CT.render` (line 152 computes `fq` and never uses it) | **[P] Background re-renders steal focus.** Every snapshot, the 4 s confirm-reset timer and any toast-driven render replace `#main.innerHTML`. Focus drops to `<body>` while typing a miss note, a plate answer or a concept note. The text survives in the draft, but on a phone the keyboard closes mid-sentence. Confirmed on `#m-note`, `#m-source` (after the 4 s confirm timer) and `#n-note`. The owner's own master log rule is "Tab/Enter survive re-renders". | Restore focus and selection after `innerHTML`, and coalesce renders (code F6). |
| t10-09 | Medium | app-dive.js | `tickDuel` uses wall-clock `u.qStart` | **[P] The duel clock keeps running when the user leaves.** It runs while the app is hidden (phone locked, call answered) or while the user is on another route. Returning after 41 s gave an instant timeout and a lost hull. | Pause on `visibilitychange` and on leaving the route (code F7). |
| t10-10 | Medium | app-dive.js | Pall `tick()` at 60 fps on home | **[P] The Pall drift costs about 17% CPU at idle** (4× throttle, 5 s idle on home) against 1% with drift off. That is 46 particles, but a full-screen `clearRect`, a `fillStyle` string per particle and `matchMedia(...)` are rebuilt every frame. Real battery drain on a phone left on the shaft. | Cap at 30 fps, cache the media query, and stop after 60 s without input (code F8). |
| t10-11 | Medium | app-dive.js | `SND.beat()` while hidden | **[C] Queued heartbeats can play all at once on return.** When the page is hidden, `ac.suspend()` freezes `currentTime`, but `beat()` keeps creating oscillators with `start(ac.currentTime)` every 1.15 s (throttled to about 1/s). On return they all start at the same instant: a loud stacked thump. | In `beat()`: `if(document.hidden||ac.state!=='running'){beatT=setTimeout(beat,1150);return}`. |
| t10-12 | Medium | sw.js | `FILES`, fetch handler | **[P] Offline/PWA shell is incomplete.** `index.html`/`./` and `icon-180.png` are not precached, so the shell is only cached after a second controlled visit, and `/index.html` offline gives `ERR_FAILED`. The fetch is network-first with no timeout: a stalled network delayed every load by the full stall (4.25 s for a 4 s stall). All other same-origin GETs are cached forever under one cache, including `/_blob/` plates that were since deleted. `c.add(...).catch(()=>{})` hides a failed precache. | Rewrite (code F9): precache the shell, network-first with a 3.5 s timeout for navigations, stale-while-revalidate for app files, cache-first for `/_blob/`, ignore everything else, and bump `V` on every release. |
| t10-13 | Medium | index.html | top of file | **[P] No `<meta charset>` and no viewport meta.** Served as a local file (or by any host that does not add a charset) the page renders as windows-1252: "BASSIET Â· DIVE CONSOLE", "Depth âˆ’01" (see `t02-home-start.png`). All book text with —, →, ↑, × and ≥ is garbled the same way. Without a viewport meta a phone lays out at 980 px. The published wrapper probably adds both, so this mainly affects local, exported and self-hosted copies. | First two lines: `<!doctype html><meta charset="utf-8">` and `<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">`. |
| t10-14 | Medium | index.html | Google Fonts `<link>` | **[P] Fonts need the network.** Offline (and in the sandbox) no font loads and the pixel display face falls back to system fonts. That breaks the dive look when installed as a PWA. The owner's master log says: inline subset WOFF so the artifact and PWA work offline. | Subset Pixelify Sans, Source Sans 3 and JetBrains Mono to the glyphs used and inline them as base64 `@font-face` (the Galen `tools/fonts.py` approach). |
| t10-15 | Medium | app-dive.js | `restain(id)` | **[P] Locked depths can be re-stained by URL.** There is no `isOpen`/`chStained` check, so `#restain-c16-cells` shows depth-16 questions while depth 16 is sealed. The user can answer and save, which writes `lvl/due` for an unstained chapter. This bypasses the lock and spoils later content. | Start of `restain`: `var d=depthOf(id);if(!isOpen(d)||!chStained(id))return chapter(id);` |
| t10-16 | Medium | app-practice.js | `A.imgAdd` | **[C] Uploads are not checked or resized.** `accept="image/*"` lets in HEIC/HEIF (default on many phone cameras), TIFF and BMP, which `assets.upload` rejects with `unsupported_type`. The user only sees "Upload failed (unsupported_type)". There is no size check (20 MiB limit) and no downscale: 12 MP photos of 3–6 MB are stored and loaded full-size in the gallery and in practice. | Re-encode to JPEG, max 1600 px, before upload, and pass `{type}`; give a clear message for formats that cannot be decoded (code F4). |
| t10-17 | Medium | app-core.js | collections `prog, notes, images, misses, days, reads` at the root | **[C] Data is shared across viewers by default.** Under the default db rules everyone admitted reads, and Contributors write. If the owner ever shares the link (a study partner, Team plan), that person's answers write into the owner's progress, misses and story. I cannot see the published capabilities from the source, so this needs checking. | Declare `capabilities:{db:{rules:[{path:"",read:"owner",write:"owner"}]}}` for a personal app. Alternatively, key the data under `data/users/<await claude.use('user').id()>/...`. |
| t10-18 | Medium | app-core.js, app-dive.js, app-practice.js | one `misses` doc per wrong answer (`logMiss`, practice checks) | **[C] Doc count grows without limit.** About 20–40 auto-misses a day comes to 7k–15k docs a year, against a 25,000-doc artifact cap and full-collection snapshots. Every load streams the whole history, and past the cap `quota_exceeded` blocks all new misses. | Subscribe to recent misses only (`where('at','>=',now-120*DAY)`) and prune auto-misses older than 180 days in small batches after load. Alternatively, aggregate into monthly docs `misses/2026-11 {items:[...]}` (each under 256 KiB). |
| t10-19 | Medium | app-core.js | `CT.tellCitrus` | **[C] Citrus status does not follow the hub rules and misses the dive.** It creates a new `status.json` and trashes the old one instead of updating in place (owner's hub rule: "update in place (PATCH)"). The file id changes on every send, and for a moment two files exist. `statusJSON` reports only Practice items, so a user with 6 fading stains and a next stratum shows "0 items, done" in Citrus. | `update_file` on the found id (create only if none; trash extra copies). Expose `CT.dive.fadingCount()`/`nextStep()` and add them to `due`, `summary` and `asks` (code F10). |
| t10-20 | Medium | index.html | 50 parser-blocking `<script>` tags, about 758 KB of JS | **[P] Load time.** Load took 0.38–0.57 s on fast desktop and 1.08 s at 4× CPU throttle, with long tasks of 132 and 157 ms (4×). On a mid phone over mobile data inside the claude.ai frame this is several seconds of blank page, because every book is parsed before first paint. | Add `defer` to everything except the boot script (or move the scripts to the end and call `CT.init` on `DOMContentLoaded`). See Idea 4 for loading books lazily. |
| t10-21 | Low | app-today.js | Atlas search `input` handler | **[P] Search re-renders the whole page on every keystroke.** 12 characters took 451 ms on desktop wide mode (about 38 ms per key, list plus detail) and 685 ms on phone at 4×. | Debounce by 120 ms and re-render only `#alist` in wide mode. |
| t10-22 | Low | app-core.js | `subscribe` → `CT.render()` per snapshot; `setDoc` memory path renders synchronously | **[P] Too many renders.** The page renders 8 times during load (one per collection). A stain answer causes 3 renders (bumpDay, logMiss, keepY). | `CT.requestRender` coalesced with rAF (code F6). |
| t10-23 | Low | app-core.js | `fail()` | Toasts show raw codes ("Could not save (quota_exceeded)") with no next step. A view-only viewer gets one toast per answer (`invalid_argument`). | Map the codes to plain messages (code F2). After `invalid_argument`, set `CT.ui.readonly=true` and stop writing. |
| t10-24 | Low | app-core.js | `enqueue` | A `set()` that never settles (offline) blocks every later write to that doc for the rest of the visit, with no feedback. | Wrap each write with a 15 s timeout that rejects `{code:'unavailable'}`. |
| t10-25 | Low | app-core.js | `CT.streak` (`t-=CT.DAY`) | **[P] Streak breaks across DST.** America/New_York, 15/03/2027 00:30 with 4 consecutive days gave a streak of 3. Not a problem in Asia/Riyadh (no DST), but wrong if the owner travels. | Step by calendar date: `var d=new Date();d.setHours(12,0,0,0);if(!set[CT.ymd(d)])d.setDate(d.getDate()-1);while(set[CT.ymd(d)]){n++;d.setDate(d.getDate()-1)}`. |
| t10-26 | Low | app-dive.js | `weekStart` (Monday) | Weeks start Monday. In Saudi Arabia the working week starts Sunday, so the dive-log grade window may not match the owner's rota. Dates themselves are right: dd/mm/yyyy, local midnight, Riyadh tested at 23:30 Sunday and 00:05 Monday. | Add a "Week starts" setting (Sun/Mon) in Look; `wd=(d.getDay()-start+7)%7`. |
| t10-27 | Low | app-dive.js | home/console date | The date in the console header and "practiced today" only change on the next render. An app left open across midnight shows yesterday's date (owner's rule: "the study day turns over on an open app"). | `setTimeout` to the next local midnight plus `visibilitychange`, then call `CT.render()`. |
| t10-28 | Low | app-dive.js | keydown capture handler | On `#ch-`/`#restain-` pages, keys 1–5 are swallowed by `stopImmediatePropagation`, but nothing answers questions with them. The comment says "1–4 answers… (duels, tests)". | Map 1–4 to the first unanswered `.q` on the page: `document.querySelector('.q .opt:not([disabled])')` within that block. |
| t10-29 | Low | app-dive.js | `duelView` | After a duel ends, revisiting `#duel-N` shows the old result screen instead of the intro. | In `A.go` to `duel-N`, or in `duelView` when `u.over&&u.saved`, reset `CT.ui.duel=null`. |
| t10-30 | Low | app-today.js | `parseHash` | Unknown hashes (`#concept-nope`, `#practice?x=1`, `#atlas/`) render Dive home silently, and the bad hash stays in the URL and history. | `if(!known)history.replaceState(null,'','#today')`. |
| t10-31 | Low | app-practice.js | `imageView` line 104 | Dead, wrongly grouped expression: `src=CT.assets||o.assetId?…:''` is computed and never used. A plate without `assetId` renders `/_blob/undefined`. | Delete `src`; `if(!o.assetId)` render a placeholder. |
| t10-32 | Low | app-today.js | `input` listener `/^(f\|i\|m\|n)-/` | The file input `i-file` is saved into drafts as `C:\fakepath\x.png`. Harmless but leaky. | Exclude `type=file`: `if(t.type!=='file'&&…)`. |
| t10-33 | Low | app-practice.js | Hull log | Only the newest 60 misses are listed, with no paging or search. With 1000 misses, 940 cannot be reached or deleted. | "Show 60 more" button (`CT.ui.hullN+=60`) plus a text filter. |
| t10-34 | Low | app-dive.js | `A.toYuzu` | Sending twice in a week creates two files with the same cards (the file name has `Date.now()`). The inbox is found by folder name anywhere in Drive (works today; would break if another "collection/inbox" ever exists). | Keep `reads/yuzu {sent:{'chapter-q':ts}}` and skip cards already sent. Resolve the path from `My Apps/Yuzu/collection/inbox` by `parentId` chain once and cache the id in that doc. |
| t10-35 | Low | app-core.js, app-dive.js | mcp error handling | `retryable` is never honoured for the read-only `search_files` calls. `selection_required` and `server_unavailable` fall into the generic message. After an ambiguous create failure the text "Tap to try again" invites a duplicate. | For searches: one retry after `retryAfterMs` or 600–1200 ms if `e.retryable`. For creates with `server_unavailable`/`upstream_error`: "Drive may have saved it. Check before sending again." |
| t10-36 | Low | manifest.json | colours, icons, text | `theme_color` #F28A1B vs page meta #0A0B0F (orange title bar when installed); the same image is used for `any` and `maskable` (no safe zone, so Android crops the motif); no `id`; description "Step 1 basics atlas and practice" no longer describes the dive. | `"theme_color":"#0A0B0F"`, a padded `icon-maskable-512.png`, `"id":"bassiet"`, `"description":"A microscopic descent through Step 1 basic sciences"`. |
| t10-37 | Low | app-dive.js | `qSave` toast | **[C] Wrong toast for the last stratum.** "Every stratum is stained… stirs" is decided in `.then` from `CT.data`, which in db mode may not include the write yet, so it says "Stratum stained." instead. | Fixed by F2 (local overlay). |
| t10-38 | Low | app-dive.js | `loadLook` | Look values are not validated: `{"size":"zzz","world":"x\" onload=1"}` is written to `data-*` (harmless, but the page shows neither world style). | `if(['dive','plain'].indexOf(l.world)<0)l.world='dive'`, and the same for size, motion and sound. |
| t10-39 | Low | app-dive.js | Pall `resize` → `seed()` | On phones the URL bar hiding fires `resize` while scrolling, and every particle jumps to a new random place. | Re-seed only when the width changes: `if(innerWidth!==lastW){lastW=innerWidth;seed()}`. |
| t10-40 | Low | app-practice.js | Plates when `use('assets')` is null | Non-editors (and everyone in local mode) see "Open the published page in Claude to add images", even when they are already in Claude. They also cannot see their existing plates, because the gallery returns early. | Render the gallery whenever `CT.data.images.length`, and hide only the add form when `!CT.assets`. Message: "Only people who can edit this page can add images." |
| t10-41 | Low | index.html / app-today.js | nav badge | At 390 px the Practice due badge ("135") sits over the top edge of the nav bar (`t10-bigdata-hull-390.png`). Also the tabs say "Hull/Plates" while the page headings say "Mistakes/Images". | `.badge{top:2px}` inside the link box; make the headings match the tab names. |
| t10-42 | Low | app-core.js | multi-tab | Two open tabs both write the same `days`/`story` docs; last writer wins. | One writing tab with a Web Lock and a "Use here" button (Yuzu `src/lib/tabs.ts` pattern), or BroadcastChannel to share pending writes. |

**Counts:** Critical 1 · High 5 · Medium 14 · Low 22 (42 findings).

### Fix code

**F1 — init and loading gate (app-core.js, app-today.js) — t10-01, t10-02**
```js
CT.init=async function(){
  CT.render();                                   // shows "Opening the dive…" (see gate below)
  var c=window.claude;
  CT._lt=setTimeout(function(){if(CT.ui.loading){CT.ui.loading=false;CT.ui.stale=true;CT.render()}},10000);
  if(c&&c.use){
    var pdb=c.use('db').catch(function(){return null});
    c.use('assets').then(function(a){CT.assets=a;CT.requestRender()},function(){});
    c.use('mcp').then(function(m){CT.mcp=m;CT.requestRender()},function(){});
    CT.db=await pdb;
  }
  if(CT.db)subscribe();else{clearTimeout(CT._lt);CT.ui.loading=false;CT.ui.local=true}
  CT.render();
};
// in subscribe(): drop its own timer; on all loaded → clearTimeout(CT._lt)
// app-today.js CT.render gate:
if(CT.ui.loading&&!CT.ui.stale)h+='<p class="muted">Opening the dive…</p>';
else h+=CT.views[CT.view]();
```

**F2 — optimistic writes, pending overlay, honest results (app-core.js) — t10-03/04/05/23/37**
```js
var pend={};                                         // 'coll/id' -> body, or null for delete
function put(coll,id,obj){var a=CT.data[coll],i=a.findIndex(function(x){return x.id===id});
  if(obj===null){if(i>=0)a.splice(i,1)}else{var row=Object.assign({id:id},obj);if(i>=0)a[i]=row;else a.push(row)}}
function msg(e){var c=e&&e.code;return c==='quota_exceeded'?'Storage is full. Delete old entries in the Hull, then try again.':
  c==='invalid_argument'||c==='revoked'||c==='not_granted'?'This view cannot save changes.':'Could not save. Check the connection and try again.'}
function retry(fn){return fn().catch(function(e){if(e&&e.code==='unavailable')return new Promise(function(r){setTimeout(r,400+Math.random()*800)}).then(fn);throw e})}
function write(coll,id,obj,op){
  put(coll,id,obj);rebuild();CT.requestRender();
  if(!CT.db)return Promise.resolve(true);
  var k=coll+'/'+id;pend[k]=obj;
  return enqueue(k,function(){return retry(op)}).then(function(){if(pend[k]===obj)delete pend[k];return true},
    function(e){if(pend[k]===obj)delete pend[k];CT.toast(msg(e));if(e&&e.code==='invalid_argument')CT.ui.readonly=true;return false});
}
CT.setDoc=function(coll,id,obj){return write(coll,id,obj,function(){return CT.db.collection(coll).doc(id).set(obj)})};
CT.delDoc=function(coll,id){return write(coll,id,null,function(){return CT.db.collection(coll).doc(id).delete()})};
// in the onSnapshot handler, after CT.data[name]=snap.docs.map(...):
Object.keys(pend).forEach(function(k){var s=k.indexOf('/');if(k.slice(0,s)===name)put(name,k.slice(s+1),pend[k])});
rebuild();CT.requestRender();
```
Callers then branch on the boolean, for example `qSave`: `CT.setDoc('reads',id,doc).then(function(ok){if(!ok)return;CT.ui.ans[id]={};…})`. Do the same in `saveNote`, `missAdd`, `rsSave` and `endDuel`.

**F3 — single story write after load (app-dive.js) — t10-04**
```js
function flush(){
  if(CT.ui.loading||(!pendingSeen&&!pendingEnter))return;
  var s=story(),p={};
  if(pendingSeen){var now=Date.now();pendingSeen.forEach(function(id){if(!s.seenAt[id])s.seenAt[id]=now});p.seenAt=s.seenAt;SND.static()}
  if(pendingEnter&&s.entered.indexOf(pendingEnter)<0)p.entered=s.entered.concat([pendingEnter]);
  pendingSeen=pendingEnter=null;
  if(Object.keys(p).length)saveStory(p);
}
```

**F4 — plates (app-practice.js) — t10-05/06/16**
```js
var OKT=['image/png','image/jpeg','image/webp','image/gif'];
async function prep(f){
  if(OKT.indexOf(f.type)>=0&&f.size<1.5e6)return f;
  var bmp;try{bmp=await createImageBitmap(f)}catch(e){throw {code:'decode'}}
  var s=Math.min(1,1600/Math.max(bmp.width,bmp.height)),c=document.createElement('canvas');
  c.width=Math.round(bmp.width*s);c.height=Math.round(bmp.height*s);c.getContext('2d').drawImage(bmp,0,0,c.width,c.height);
  return await new Promise(function(r){c.toBlob(r,'image/jpeg',.85)});
}
// in A.imgAdd:
var blob=await prep(file);var r=await CT.assets.upload(blob,{type:blob.type});
var ok=await CT.setDoc('images',CT.newId(),{assetId:r.id,…});
if(!ok){CT.ui.busyImg=false;CT.render();return}        // keep drafts; the asset id can be reused on retry
// catch: e.code==='decode'?'This photo format cannot be read here. Save it as JPEG or PNG and try again.':
//        e.code==='too_large'?'That image is too large.':e.code==='quota_or_state'?'Image storage is full.':'Upload failed. Try again.'
A.imgDel=function(el){if(!confirmStep(el))return;
  var x=CT.data.images.find(function(i){return i.id===el.dataset.id});
  CT.delDoc('images',el.dataset.id).then(function(ok){if(ok&&x&&CT.assets)return CT.assets.delete(x.assetId).catch(function(){})})};
```

**F5 — resubscribe (app-core.js) — t10-07**
```js
function sub(name,tries){
  CT.unsub=CT.unsub||{};
  CT.unsub[name]=CT.db.collection(name).onSnapshot(function(snap){/* existing body */},function(err){
    var c=err&&err.code;CT.ui.loading=false;CT.ui.stale=true;
    if(c==='unavailable'&&tries<3)setTimeout(function(){sub(name,tries+1)},1500*(tries+1)+Math.random()*1000);
    else if(c==='revoked')CT.ui.readonly=true;
    CT.requestRender();
  });
}
function subscribe(){Object.keys(CT.data).forEach(function(n){sub(n,0)})}
```

**F6 — coalesced render that keeps focus (app-today.js) — t10-08/22**
```js
var rq=0;CT.requestRender=function(){if(!rq)rq=requestAnimationFrame(function(){rq=0;CT.render()})};
// inside CT.render, around main.innerHTML=h:
var ae=document.activeElement,fid=ae&&ae.id,s0=null,s1=null;try{s0=ae.selectionStart;s1=ae.selectionEnd}catch(e){}
main.innerHTML=h;
if(fid&&fid!=='af-q'){var n=document.getElementById(fid);if(n){n.focus({preventScroll:true});try{if(s0!=null)n.setSelectionRange(s0,s1)}catch(e){}}}
```
Use `CT.requestRender()` in snapshot callbacks, `setDoc`, toasts and the confirm timer. Keep direct `CT.render()` only for click handlers.

**F7 — duel pause (app-dive.js) — t10-09**
```js
function pauseDuel(){var u=CT.ui.duel;if(u&&u.qStart&&!u.over&&!u.pausedAt)u.pausedAt=Date.now()}
function resumeDuel(){var u=CT.ui.duel;if(u&&u.pausedAt){u.qStart+=Date.now()-u.pausedAt;u.pausedAt=0}}
document.addEventListener('visibilitychange',function(){if(document.hidden)pauseDuel();else if(/^duel-/.test(CT.view==='today'&&CT.dsub||''))resumeDuel()});
// in tickDuel(), before reading qStart: resumeDuel();
// in the render hook: if(/^duel-/.test(s))tickDuel();else{clearInterval(duelT);pauseDuel()}
```

**F8 — Pall frame cap (app-dive.js) — t10-10**
```js
var RM=window.matchMedia?matchMedia('(prefers-reduced-motion: reduce)'):{matches:false},lastF=0,lastInput=Date.now();
['pointerdown','keydown','scroll'].forEach(function(t){addEventListener(t,function(){lastInput=Date.now();if(!raf)raf=requestAnimationFrame(tick)},{passive:true})});
function tick(ts){
  raf=0;if(!cx)return;
  var on=CT.look.world==='dive'&&CT.look.motion==='on'&&!document.hidden&&document.documentElement.dataset.reading!=='1'&&!RM.matches&&Date.now()-lastInput<60000;
  if(!on){cx.clearRect(0,0,cv.width,cv.height);setTimeout(function(){if(!raf)raf=requestAnimationFrame(tick)},800);return}
  if(ts-lastF<33){raf=requestAnimationFrame(tick);return}lastF=ts;
  /* existing draw */ raf=requestAnimationFrame(tick);
}
```

**F9 — service worker (sw.js) — t10-12**
```js
const V='bassiet-v5',FILES=[/* existing list */,'icon-180.png'],SHELL=['./','index.html',...FILES];
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(V).then(c=>c.addAll(SHELL)))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
const put=(r,x)=>{if(x.ok){const c=x.clone();caches.open(V).then(k=>k.put(r,c))}return x};
self.addEventListener('fetch',e=>{
  const r=e.request,u=new URL(r.url);
  if(r.method!=='GET'||u.origin!==location.origin)return;
  if(r.mode==='navigate'){
    e.respondWith(Promise.race([fetch(r).then(x=>put('./',x)),new Promise((_,j)=>setTimeout(j,3500))])
      .catch(()=>caches.match('./').then(h=>h||caches.match('index.html'))));return}
  const name=u.pathname.split('/').pop(),blob=u.pathname.includes('/_blob/');
  if(!blob&&!FILES.includes(name))return;
  e.respondWith(caches.match(r).then(hit=>{const net=fetch(r).then(x=>put(r,x)).catch(()=>hit);return hit||net}));   // cache-first, refresh in background
});
```
Inside the claude.ai frame, registration may be refused by the sandbox (it is caught). Test the installed PWA from the top-level artifact URL.

**F10 — Citrus status (app-core.js, app-dive.js) — t10-19**
```js
// app-dive.js: CT.dive.fading=allFading; CT.dive.next=nextStep;
// statusJSON: var fd=CT.dive&&CT.dive.fading?CT.dive.fading().length:0,nx=CT.dive&&CT.dive.next&&CT.dive.next();
//   due:c.due+fd, summary:…+(fd?'; '+fd+' stain'+(fd===1?'':'s')+' fading':'')+(nx?'; next: '+(nx.k==='ch'?nx.name:nx.d.boss.name):'')
// tellCitrus: if(old.length){await CT.mcp.callTool(S,'update_file',{fileId:old[0],textContent:body,contentMimeType:'application/json'},{cache:false});
//   for(i=1;i<old.length;i++) trash_file(old[i])} else create_file(...)   (add update_file to the manifest)
```

## 4. Top 5 improvement ideas (bigger changes)
1. **One storage module with a contract test.** Wrap db access as `store.js` (F1, F2, F5): optimistic overlay, boolean results, retry-once, coalesced render, a loading gate and read-only mode. Ship my `work-t10/mock.js` (an async fake `window.claude` with knobs for latency, failures and slow `use()`) as `dev/mock-claude.js`, and run `dbtest.js` scenarios A–H before every release. Every bug in section 3 marked [M] would have been caught there; the in-memory local mode can never show them.
2. **Personal data rules plus a doc budget.** Declare owner-only rules (t10-17). Aggregate auto-misses into monthly docs and prune them (t10-18). Add a small "Storage" line in Look showing doc count and asset bytes (`assets.list().usage`), and a "Download a backup" JSON export of all six collections. The owner's own data-safety standard asks for backups and a storage-full banner.
3. **Offline-first shell.** Charset and viewport meta, inlined subset fonts, the F9 service worker, and an "Offline: changes will save when you're back" banner driven by `navigator.onLine` plus write timeouts. With that the Steam Deck or tablet PWA works on a ward with no signal.
4. **Lazy-load the book.** Keep `depths.js` plus a small `chapters.json` index (`{id:{depth,title,nQ}}`) so `charted()`, the shaft, weak points and duels can work without the text. Load `bookN.js` (and its figures) when a depth page opens, and prefetch the next depth at idle. First load drops from about 758 KB to about 150 KB parsed, and the 130–160 ms long tasks go away.
5. **Hub integration v2.** Status that includes the dive (fading stains, next stratum, boss ready), updated in place, sent automatically after a session if the last send was more than 6 h ago (after the one-time Drive approval). Add a `?from=citrus&do=restain` deep link per the owner's hub contract, and a Yuzu sent-ledger so samples are never duplicated.

## 5. SPOILER-SENSITIVE
None. t10-15 (locked re-stain) exposes depth-16 questions, but nothing in my findings touches the story twist.
