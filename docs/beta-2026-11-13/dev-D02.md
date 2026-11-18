# D02: storage integrity and core (app-core.js, sw.js, manifest.json)

Files changed: `app-core.js`, `sw.js`, `manifest.json`. New file: `d02-maskable-512.png` (padded maskable icon, referenced from manifest.json; it is an image, so no script tag is needed). Test and tool scripts are in `beta/work-D02/`: `d02test.js` (28 mock-db checks, built on t10's `mock.js`), `swtest.js` (offline PWA over HTTP) and `gen-sw.js` (regenerates sw.js FILES and version).

## Contract 2.1: done exactly
- `CT.setDoc(col,id,obj)` and `CT.delDoc(col,id)` return a Promise that resolves `true` on success and `false` on failure. It never rejects.
- `CT.data[col]` (plus `CT.pmap` and `CT.nmap`) updates at once (optimistic). On failure it rolls back to the last confirmed value. That is the newest value this page wrote successfully, or else the server value, or else the value before the write.
- Core already shows the error toast, in plain words, with kind `'err'`. Callers only need to skip their success path, keep answers and drafts, and stay on the page. They may show their own more specific `'err'` toast too.
- `CT.toast(msg, kind)`: `kind==='err'` sets `class="toast err"` and `role=alert`. The toast stays 6.5 s (normal toasts 3.6 s), and a tap dismisses it. The same error is not repeated within 4 s. If an element `#sr-live` exists (t09-17), the text is also written there and the toast becomes `aria-hidden`.
- Error messages:

  | Code | Message |
  |---|---|
  | `quota_exceeded` | "Storage is full… Delete old entries in the Hull" |
  | read-only, `revoked`, `not_granted` | "Changes cannot be saved in this view." |
  | `resource_exhausted` | "Too many saves at once…" |
  | timeout (20 s) | "Saving is taking too long…" |
  | over 200 KB | "too large" |
  | anything else | "Could not save. Check the connection and try again." |

## Findings fixed
| ID | What was done |
|---|---|
| t10-01 (Crit) | **Loading gate.** `CT.init` wraps the final `CT.render`. While storage is undecided (`CT.ui.loading&&!CT.ui.stale`), `#main` shows only "Opening the dive…" (`[data-gate]`, `aria-busy`), so nothing can be clicked. The 10 s stale timer starts in `init`, not in `subscribe`. Writes made while `use('db')` is still pending (possible only after the 10 s timer) are queued and written to the db when it arrives. If no db arrives, they stay in memory. |
| t10-02 | `use('db')`, `use('assets')`, `use('mcp')` and `use('user')` resolve in parallel. Subscribing starts as soon as db resolves; assets and mcp arrive later and trigger a re-render. Each `use()` has a 12 s guard. Test A2: loaded in under 1 s while assets and mcp hang for 9 s. |
| t10-03, t07-09 (counters) | **Pending overlay.** Every queued write is laid over each incoming snapshot. A just-confirmed write is also kept until a snapshot shows it, or for 5 s. So `bumpDay`/`record`/story read the latest local value. Tests B, B2 and L: 5 of 5 increments kept with a 400 ms round trip, and the count stays monotonic when snapshots arrive 0.9–2.5 s late. |
| t10-04, t07-09 (story clobber) | The core part is fixed: reads now see the previous write. Test C: `lastVisit` is updated. Snapshot bodies are now cloned into mutable objects. The real db freezes them, so `flush` doing `s.seenAt[id]=now` would have thrown in strict mode (test M). |
| t10-05, t07-03 | setDoc/delDoc resolve false on failure, roll back, and show an error toast. t10's D now stays on `#ch-…`, and the answers are kept (D05's caller side is in place). |
| t10-06 | delDoc resolves false. With D04's caller change, t10's G no longer deletes the asset (verified: the row stays, no asset is deleted). |
| t10-07 | Resubscribe on `unavailable` (and unknown codes) with backoff, up to 3 times, using a generation guard so old listeners are ignored. `revoked`/`not_granted`/`capability_*` switch to read-only. A terminal error ends loading and marks the data stale. |
| t10-08, t09-03 (focus) | The render wrapper saves the focused control inside `#main`: by id, else by tag plus all `data-*` attributes, else by its index among focusables. It restores focus after re-render, with the caret position for text fields. An answered (disabled) option sends focus to that question's `.qx` explanation. `CT.requestRender()` waits while a text field in `#main` is focused and renders on `focusout`, so snapshots no longer close the phone keyboard. Test R: the caret is kept through a snapshot and through a direct `CT.render()`. |
| t09-04 (title, focus on route) | On every render, `document.title` = page heading (+ " · Atlas"/" · Hull"…) + " · Bassiet". On a route change, focus moves to the heading with `preventScroll` (not on first load). Exported helpers: `CT.focusHeading()`, `CT.pageTitle()`, `CT.routeKey()`. Per D03's request, `.ctitle` is preferred, so the wide Atlas concept title wins. |
| t10-22 | `CT.requestRender()` is coalesced (rAF, with an 80 ms timeout because rAF does not fire in hidden tabs). A direct `CT.render()` cancels a pending request. Snapshots and setDoc use it. |
| t10-23 | Plain-language messages (table above). After an `invalid_argument` on a well-formed body, `CT.ui.readonly=true`, and later writes return false without trying (one toast). `use('user').can('data.write')===false` also sets read-only. The wrapper adds a notice "Changes cannot be saved in this view." (`[data-ro]`). |
| t10-24 | Each write attempt times out after 20 s, which releases the per-document queue. |
| (new) write storms | Writes to one document run one at a time. A write still waiting is replaced by the newest one (set is a full replace), and every caller gets the final result (test Q: 8 quick sets become 2 store writes). There is one delayed retry on `unavailable`/`resource_exhausted`/unknown codes. After a failure, the same document is held for 30 s (resolve false, toast), and the hold lifts on any successful write. Without this hold, t10's quota scenario looped forever: a failed story write rolled back, the render re-queued it, and it failed again. |
| t10-18 | After load, if `misses` has 6000 or more docs, up to 150 *automatic* misses older than 180 days are pruned per visit. Hand-logged misses are never touched. |
| t10-25 | `CT.streak` steps by calendar date (safe across DST). |
| t10-27 | The study day turns over on an open app: a timer at the next local midnight plus `visibilitychange` trigger a re-render. |
| t10-19, t07-23 | `statusJSON` counts fading stains as due (`CT.dive.fadingCount()`) and names the next step from `CT.dive.next()` (already exposed by D05). `extra` gets `practiceDue`, `fadingStains` and `nextDive`. Version is 1.1.0. Because of what the connector can do, **update in place is impossible**: Drive `update_file` changes metadata only and has no content field. So the flow stays create-new, then trash every old copy, which never leaves zero files. |
| t10-35 | `search_files` is retried once when `retryable` (honouring `retryAfterMs`). Errors get their own messages: `selection_required`, `blocked_by_policy`, `needs_reauth` vs `server_not_connected`, `consent_required`. An ambiguous create failure says "Drive may have saved the status. Check My Apps/hub/bassiet before sending again." |
| t06-31 | `buildQueue` in core: up to 8 due items, then new ones; a backlog still leaves room for 2 new, giving a maximum of 10. app-practice.js (D04) now overrides `CT.buildQueue` at load and its version wins. Core never reassigns it, and `CT.startSession` looks it up at call time. |
| t06-32 (helper) | `CT.record` keeps `CT.ps.tally[kind]={n,good,hard,again}` for the end screen (D04 can show it). `CT.record`/`CT.bumpDay` now return the setDoc booleans. |
| t10-12, t01-20 | **sw.js rewritten.** It precaches `./`, `index.html`, `icon-180.png` and all app files, **including the new bookx1/bookx2/bank9/figs7**. A missing file no longer aborts the install. Navigations and app files are network-first with a 3.5 s limit when a cached copy exists; network-first keeps a release's scripts together. `/_blob/` plates are cache-first (capped at 150). Google Fonts are cache-first in their own cache, so the pixel face survives offline after one online visit (helps t10-14/t09-33). Verified over HTTP: 54 entries precached, offline reload renders "The descent", offline `index.html` works. |
| t10-36, t01-19, t09-46, t01-39 | manifest: `theme_color` and `background_color` are `#0A0B0F`. Also added `id:"bassiet"`, a new description, `lang en-GB`, and categories. The maskable icon is a separate padded image (`d02-maskable-512.png`, motif inside the 80% safe zone). |

## Tests
- `beta/work-D02/d02test.js`: **28/28 pass** (late db, slow assets/mcp, lost increments, UI answers, story, failure plus rollback, retry, resubscribe, revoked, never-answering collection, failed delete, late stale snapshots, frozen bodies, fromCache, view-only, pre-db writes, burst coalescing, focus and caret, keyboard focus after answering, statusJSON, queue cap, rollback to confirmed value).
- `s7.js 16`: full descent completes with no errors.
- t10 `dbtest.js` A/C/D/G now behave correctly. Its H script dies on a selector in D04's Plates form, which is not a core issue.

## Not done / limits
- **Multi-tab (t10-42):** two tabs still write last-writer-wins. Each tab keeps its own increments.
- **A write made in the 10 s window after the stale timer, before a very late db:** the db then receives values computed from empty data. For a counter such as `days`, that can overwrite the stored value. This is rare: `use()` itself gives up at 10 s.
- **Releases:** `V` in sw.js must change for every release. **Coordinator: run `node beta/work-D02/gen-sw.js /home/claude/citron` after the last edit.** It rebuilds FILES from the folder and sets V to a hash of every file. Today's value is `bassiet-bfe017625f`.
- **Icon artwork:** the icon is unchanged, still the orange square with a "B" (t01-39 asks for a darker motif, which is a design job).
- **Hub icon:** `statusJSON.icon` is still the 🧬 emoji, because the hub contract expects an icon field. Change it only if Citrus accepts text.

## Requests to other owners
- **Coordinator (publish):** declare `capabilities:{db:{rules:[{path:"",read:"owner",write:"owner"}]}}` so a shared link cannot write the owner's progress (t10-17). Optionally declare `user:{}`; core already uses `use('user').can('data.write')` when served. Run `gen-sw.js` before publishing.
- **D01 index.html:**
  - Style `.toast.err` (danger tone) and the gate `#main .gate` (centred, dive mood).
  - Add `[tabindex="-1"]:focus{outline:none}` for programmatically focused headings and `.qx`.
  - Add a permanent visually hidden `<div id="sr-live" class="vh" aria-live="polite"></div>`; `CT.toast` uses it automatically.
  - Optionally add `defer` to scripts (t10-20).
- **D03 app-today.js:** already integrated (gate text, `.ctitle`, `focusHeading`). The `CT.requestRender` fallback there is fine; core defines it first, so core's typing-aware version wins.
- **D04 app-practice.js:**
  - Show `CT.ps.tally` on the session end screen.
  - Change the menu copy to "Up to eight due items, then new ones" (t06-31).
- **D05 app-dive.js:** `CT.dive.fadingCount` and `CT.dive.next` are present, and status uses them. Avoid writes from render (`flush`). Core now holds a failing document for 30 s, but a write per render still costs a write per render.
