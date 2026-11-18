# D05 handoff: app-dive.js

Owned file: `/home/claude/citron/app-dive.js` (rewritten; original kept at `beta/work-D05/app-dive.orig.js`). No new files. `node --check` passes.

Tests:
- `s7.js 16` (full descent) on the live tree: all 16 depths sealed, `noUndef true`, `ERRS []`. **s7 needs no change**, because every option button keeps the ORIGINAL option index in `data-j`. Only the display order is shuffled.
- `s8.js` and `s9.js` run clean.
- My own checks are in `beta/work-D05/d05test.js` (about 70 assertions across 10 scenarios), all passing. Screenshots are `beta/shots/d05-*.png`.

## Contracts implemented
| Contract | What app-dive.js does |
|---|---|
| 2.1 honest saves | Stain tests, re-stains and duel results all await `CT.setDoc`. If it resolves `false`: answers are kept, `CT.toast(msg,'err')` is shown, and the button stays so the player can retry (duels get a "Save it again" link). A missing return value is treated as success. |
| 2.2 shuffle | Stain tests, re-stains, duels and Yuzu cards show options shuffled. The order is stable within the view: tests use `CT.ui.perm[id]`, re-stains `CT.ui.rs[id].perm`, duels `u.perm`. Scoring uses original indices. Stain tests also shuffle **question order** per attempt, and a retake gets a new order (t07-02). A question with an "of the above" option keeps its authored order. Yuzu cards use a seeded order per card, and the back carries the letter. Simulated "always press 2" now passes about 1–3 of 71 stain tests (was 67/71). |
| 2.3 misses | `logMiss` stores `concept: q.c` if it exists in BANK, otherwise the first valid `chapter.c`. Unknown ids are skipped. It also stores `discipline: q.d || stratum.d`, `ch`, `chapter`, `q`, `qh` (a hash of the stem, used to find the question again after reordering), `qText`, `chosenText`, `rightText`, the stem in `source`, and `reason` (`'Ran out of time'` for duel timeouts). |
| 2.4 seal rule | `sealBroken(d) = bossWon(d)`. Strata added later to a broken depth are labelled "New · optional". They are stainable and listed on home under "New strata charted above". They never block `nextStep()`, the shaft or deeper depths. |
| 2.5 boss lines and ending | The duel intro screen shows every `boss.intro` line in order. The result panel shows one random `win` or `lose` line (one is picked per duel, so it does not flicker on re-render). The final win offers **Hear the ending** → `#end`. It plays `STORY.END` one line per tap ("Listen" / "Show the rest"), then offers Host file / The shaft, and records `endSeen`. If `STORY.END` is missing it falls back to the `seal:16` lines. Home then shows "Hear the ending (again)". `#end` also works by hash fallback even if the route regex lacks it. |
| 2.6 radio | `CT.radio` queues lines (up to 3, no duplicates). Nothing pops up while a duel is live, while an unfinished re-stain is on screen, or while an unfinished stain test is visible. Queued lines play afterwards. The radio has a close button `.rclose` and sets `html[data-radio="1"]` and `body.radio-on` while shown. Its display time scales with line length (4.5–9 s). Text goes to a permanent polite live region `#sr-live`, which is created if absent. A stain test raises at most one miss line per attempt. |

## Findings fixed, by ID
**t07:** 01, 02, 03 (caller side), 04, 05, 06, 07 (see note 1), 08, 09 (caller side: `story()` returns copies; one merged story write), 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23 (exports `CT.dive.fading()`, `fadingCount()`, `next()`), 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 41, 42, 43, 44. Partly 45 (shaft rows show "· N fading" with class `fading`).

**t02:** 01, 02, 04, 05, 06, 07/08/09 (lines from `STORY.GRADE`), 10, 25 (kicker = `stratum.topic`, H1 = stratum name from depths.js), 26 (post-game titles, voices and pools), 27, 30, 31, 33 (`night317`; `return` lines may use `{fading}`), 36, 37 (`depth.tease` on the shaft and on sealed depth pages), S01, S08, S11. Also D06's requests 1–10.

**t01:** 02, 03 (JS side), 07 (JS scroll offset), 09 (the loop explained under Begin), 10, 11, 12, 14, 17 (auto-save when the last answer is given), 18, 21 (partly: Instruments collapsed in `<details>`, Samples hidden until there is a miss, Look moved into the side rail), 23, 24, 25, 26, 28 ("Host file · N new"), 29, 32, 34, 35 ("Withdraw", which asks for a second tap), 37 (lamp labels "Violet · Path" etc. with a tooltip), 40.

**t09:** 07 (Look → "Duel clock 40 s / 80 s / Off"; ARIA on the timer, HP and hull; spoken announcements per hit), 11, 16/17 (JS side), 19, 27, 29 (markup only: `.home > .hmain + aside.hrail`), 30 (Instruments collapsed), 32 (World: The dive / Lights on [forces `data-theme="light"`] / Follow device), 35 (control renamed "Motion"), 36/37 (screen-reader text for ✓/✕ and hull).

**t10:** 04, 09, 10 (30 fps cap, cached media query, freezes after 60 s without input), 11, 15, 26, 28, 29, 34, 35, 37, 38, 39.

**Also:** t03-01, t04-01, t05-01 (shuffle); t06-40 ("N trails due" panel → `A.startDue`); t03-08 (each `td` gets `data-label` for stacked phone tables); D01's request (each table is wrapped in `div.tw` with `tabindex="0" role="region" aria-label="Table: <section>"`); D03's request (Look → "Shortcuts On/Off" sets `CT.look.keys` 'on'/'off'; it also turns off the 1–4 answer keys); D02's request (story writes are coalesced, with at most one write per 1.2 s and only when something new was shown, so there is no write per render; flushed on pagehide/hidden).

**Other changes:**
- Duel balance: hp = 85% of the pool (10 of 12), hull 4. The final duel uses 70% of 24 = 17, hull 5. From the 5th right answer in a row, each strikes twice, and the bar shows "NEXT HIT STRIKES TWICE" one answer earlier.
- Up to 4 recently missed questions are put into the duel pool first.
- The win panel shows a stats strip (right/asked, time, best combo, hull, new best), "Descend to −0N", "Duel again" and "The shaft". `bestHull` and `bestTime` are stored.
- Dive log: the week starts **Sunday** by default (Look → "Week starts" Sun/Mon). Weeks use calendar arithmetic. Practice items count as answers. A brand-new player gets `GRADE.first`, not F. This week shows "C so far".
- First fade depends on the score (3/5/7 days). A failed re-stain drops 2 levels and comes back in 1 day. Early re-stains are practice only.
- Yuzu: the path My Apps/Yuzu/collection/inbox is resolved by parent chain, and the inbox id is cached in `reads/yuzu-sent`. Already-sent cards are recorded there and skipped. Each pack has a unique id. The window is "last 7 days". Tags include `system::`, `depth::` and `subject::`. Searches are retried once. A create that may have saved shows "may have saved it; check before sending again".
- Home: at most the newest 6 unseen lines play in sequence (1.5 s apart, with static; all at once when Motion is off). A "Show all" link skips the wait, and "N earlier transmissions in the Radio log" covers the rest. The Radio log reads oldest first, grouped under PROLOGUE / DEPTH −0N headers, with a "Latest ↓" link.
- The duel clock pauses when the page is hidden or the player leaves the duel route. A cross-duel page never ticks another duel.

## Notes
1. **t07-07 vs mission.** The mission says "pause when hidden/away", so leaving a duel pauses the clock rather than costing the question. That lets a player look up an answer mid-duel. If the owner prefers t07's stricter rule, change one line in the render hook (`pauseDuel()` → count the current question as a miss).
2. **Number keys in stain tests and re-stains.** 1–4 answer the first open question **visible on screen**. They do nothing while that question is off screen, and 1–5 never switch tabs on these routes. The duel works as before. **D01: please show the `.opt .key` hints in stain tests too** (on hover-capable devices).

## Not done
- t07 Idea 1 (a 10–12 question pool per stratum). This is a content change.
- t09-18: home section headings are still h3 under h1, with no h2.
- t02-34 "At the bedside" boxes. This is content.
- t09-49 desktop chapter rail.
- t01 Idea 1 full-screen first-dive sequence. The sequential home playback covers most of it.
- The loss cooldown from t07 A5.

## REQUESTS
**D01 (index.html), CSS hooks I now emit:**
- Home layout: `.home{display:grid;grid-template-columns:minmax(0,1fr) 360px;gap:32px;align-items:start}` at ≥1100, with `.hrail` sticky.
- Instruments disclosure: `details.inst > summary .h2like` (style it like the old `h2.inst`).
- Shaft and depth pages: `.tease` (dim mono static under "Sealed from above" and on sealed depth pages), `.shaft li.fading`, `.srow.next{border-color:var(--accent)}`, `.srow.optional{border-style:dotted}`.
- Panels: `.panel.optp`, `.panel.duep` (same as `.fadep`).
- Duels: `.bline` (boss line inside the result panel; `.bline .mono` is the speaker label), `.dstats`, `.reader.duel.final` / `.duel-intro.final` (optional final staging), `.bintro`.
- Radio: `#radio .rt`, `#radio .rclose` (the only element with pointer events), and toast stacking via `html[data-radio="1"]` or `body.radio-on`.
- Transmissions and logs: `.txs.brief`, `.endseq`, `.reader.ending`, `.rgroup`.
- Answers: `.opt .res` (✓/✕ mark).
- Tables: `.tw:focus-visible`, plus optional `td[data-label]` stacked cards on phone.
- Head inline script: when `L.world==="plain" && L.theme==="light"`, also set `data-theme="light"`. This avoids a flash on load for "Lights on".
- Show `.opt .key` in tests (note 2).

**D02 (app-core.js):** `statusJSON` can add fading stains and the next step from `CT.dive.fadingCount()` and `CT.dive.next()` (t07-23 / t10 F10).

**D04 (app-practice.js):** dive misses now carry `ch`, `qText`, `chosenText`, `rightText`, `concept`, `discipline`, `qh`, and `reason:'Ran out of time'` for timeouts. Please make sure 'Ran out of time' is in `REASONS`.

**D03 (app-today.js):** the keys hint can now say "tests and duels: 1–4 answer". `#end` route: thanks; the dive also falls back on `location.hash==='#end'`.

**D15/D16:** please give new strata a `topic` (D16 has done this); it is used as the chapter kicker.

---

## SPOILER-SENSITIVE (owner must not see)
- `who(from)` applies `STORY.unmask` (`{at:'seal:15', who:{hale:'— · Ward 9'}}`) once its trigger has fired. This applies on home, in the Radio log, in radio pop-ups, boss lines and the ending. It quietly retcons the whole log (t02-S08).
- Dive-log voice and sign label come from `STORY.GRADE`:
  - `hale` until the unmask;
  - then `pall`;
  - then `after` once seal 16 is broken.
- After seal 16:
  - miss lines use `missafter`;
  - a lost duel uses `missafter`/`duellose`;
  - the session-start ambient line uses `after` once the ending has been heard.
- No twist text is written in app-dive.js. Every revealing word comes from story.js.
- t02-S14 final-duel staging (name bar flicker, timer labelled 03:17) is not done. The class `final` is on the duel container if D01 wants to style it.
