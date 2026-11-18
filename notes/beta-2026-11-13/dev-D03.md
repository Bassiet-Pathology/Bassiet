# dev-D03: app-today.js (nav, routes, Atlas, concept pages, Instruments)

File edited: `/home/claude/citron/app-today.js` (only). Baseline backup: `beta/work-D03/app-today.orig.js`.
New files: none. No script tags needed.
Tests: `beta/work-D03/t.js` (phone 390 + desktop 1440, private copy at `beta/work-D03/tree`), `inst.js` (Instruments in dive and Lights on). `s7.js 16` full descent: all 16 seals, `noUndef true`, `ERRS []`. `s8.js` and `s9.js`: `ERRS []`. Screenshots: `beta/shots/D03-*.png`.

## What changed, by finding

**Routes and shell**
- **Contract 2.5:** added `end` to the dive route regex: `/^(depth-\d+|ch-.+|restain-.+|duel-\d+|host|radio|end)$/`. `#end` now sets `CT.view='today'`, `CT.dsub='end'` (verified).
- **t10-30, t01-34:** bad hashes are cleaned with `history.replaceState`:
  - unknown hashes go to `#today`;
  - `#practice?x=1` and `#atlas/` are normalised;
  - `#concept-<bad>` goes to `#atlas` with the toast "That site is not in the Atlas."
- **t01-08, t06-35:** scroll memory for each history entry.
  - Browser back now returns to where you were: Atlas list 3000→3000, home 900→900.
  - Phone "All concepts" restores the list position.
  - New forward navigations still start at the top. `history.scrollRestoration='manual'`.
- **t09-04:** after a route change, focus goes to `.ctitle` on the Atlas, otherwise to D02's `CT.focusHeading()`.
- **t01-22, t09-12, t06-47, t10-41:** the Plates and Hull h1s follow the tab names (`retitle()` in render; D04 has since renamed them in source too).
- **t09-31:** in-world console strip on the Atlas, Practice, Plates and Hull. Examples: "BASSIET · ATLAS · 155 SITES CHARTED · n RATED", "… HULL · n CRACKS IN 30 DAYS".
- **t10-01:** my render gate is now `loading && !stale` and shows an in-world loading line. D02's wrapper also gates.
- **Contract 2.1:**
  - `A.conf` and `A.saveNote` await `setDoc`. On `false` they show an `'err'` toast.
  - A failed note save keeps the typed text as a draft.
- **t10-32:** file inputs are no longer copied into drafts.
- The nav badge has screen-reader text (", 12 due").
- New exports:
  - `CT.route`, `CT.parseHash`, `CT.NAV`, `CT.vh(text)`, `CT.atlasSearch(q)`.
  - `CT.go(v)` now re-routes when the hash is already `v`.
  - `CT.requestRender` is a fallback only; D02's is used.
- **Removed:** my own focus restore and `document.title` code. D02's `wrapRender` in app-core.js does both, so there is no duplicate (t09-03, t10-08).

**Atlas list and search**
- **t06-34, t06-28: UK/US-proof search.** One normaliser runs on both the query and the text:
  - ae/oe → e, -our → -or, -ise → -ize, -yse → -yze, -tre/-bre → -er, sulph → sulf;
  - accents are stripped (Sjögren); Greek letters become words;
  - hyphens and punctuation count as spaces, and words also match across spaces ("preeclampsia").
  - Results: "leukemia" = "leukaemia" (2), "edema" = "oedema" (7), "hypokalemia" (1).
- **Synonyms:**
  - common abbreviations: MI, HF, SLE, PE, TB, CKD, AKI, DKA, SIADH, CML/AML/CLL…;
  - UK/US drug names: paracetamol/acetaminophen, adrenaline/epinephrine, frusemide, salbutamol, GTN, lignocaine, ciclosporin, rifampicin…;
  - lay terms: heart attack, fits, clot…
  - Link labels are searched too. Results are ranked: name > lens > link.
  - A row matched only in a lens shows "Found in the Pharm lens".
- **t10-21:** search is debounced (110 ms) and re-renders only `#arows`. The input keeps focus and the phone keyboard stays open. Enter opens the first result.
- **t01-30, t06-49:** sorting uses `localeCompare` (also in `CT.conceptOpts`).
- **t09-43:** the lens squares have hidden text ("Lenses: Pathology, …"). The count line now has a colour legend.
- Empty state: "Nothing under the lamp matches…", with a "Show every site" button and a "Clear" link.

**Concept pages**
- **t06-37:** missing lenses become one line ("No microbiology or biochemistry lens yet.") instead of dashed boxes.
- **t06-36, t09-45: concept map rebuilt.**
  - Phone (<700px): a 360-unit "spine" with two columns, 13px labels wrapped onto two lines (also at hyphens), up to 12 neighbours.
  - Wide: an ellipse layout that does not overlap, 168×44 nodes, two-line labels and arrows clipped to the node edges.
  - Direction is encoded: orange solid = this site leads out; grey dashed = leads in; double arrow = both. A legend line sits under the map.
  - Each node has an aria-label and a `<title>` with the full link sentences.
- **t09-18:**
  - The wide Atlas has a single h1. The concept title there is `h2.ctitle`.
  - Lens titles are h3 (styled inline to look as before).
  - The note has a real `<label>`.
- New section "Where it lies in the Host":
  - lists the strata (BOOK `c`) that cover the concept, as buttons to `#ch-…`, with a ✓ when stained;
  - shows only depths that are open (via `CT.dive.isOpen`);
  - sealed depths show only a count, so it is spoiler-safe.
- The misses line links to the Hull.
- `A.openItem` now stores `CT.ps.from = concept id`, for a "Back to …" button (D04).

**Today, the Instruments block (still starts with `<h1>Today</h1><p class="sub">…</p>`, so D05's strip regex keeps working)**
- **t09-08, t09-30: coverage grid mood.**
  - Cells are dim "lit" cells: subject hue mixed into the surface (16–42%) with an inset hue border and solid `--fg` text.
  - No more element opacity or white text. Measured about 6:1 in the dive world; dark text in Lights on.
  - Renamed "Survey of the Host", with a one-line explanation.
  - `scope`, a caption and `abbr` titles added.
- **t09-42:** short column heads (Path, Micro, Pharm, Bio, Phys). The table now fits at 320–390 px with no sideways scroll (inline `min-width:0`, wrapping row labels).
- "Open practice" is no longer a bright primary button. It is primary only when items are due ("Revisit n due"), otherwise "Start a practice set".
- **t09-44:** ledger cells are focusable. Their explanations show on keyboard focus, as a hover `title`, and as hidden text, not only on long-press.
- **t07-22:** "Where you are slipping" now counts dive misses that carry `d` (or `discipline`), and falls back to the concept's system when `system` is empty.
- Empty state: "No cracks yet…". Keys hint updated.

**Keyboard**
- **t06-41:**
  - Trace: 1–9 pick the n-th remaining step; Backspace/Delete undo.
  - Predict: U/D/N answer the focused row if it is open, otherwise the first open row.
  - Compare: 1–9.
  - Enter/→ keep their old behaviour.
- `/` from any screen opens the Atlas with the search box focused.
- **t09-20:** the single-key shortcuts honour `CT.look.keys==='off'` (the setting needs D05, below).

## Not done (outside my file)
- t01-15 tap targets: CSS (D01).
- t06-40 due entry point near the top of the Dive home: D05. The Instruments block still has "Revisit n due", but it is now collapsed.
- t10-22 coalesced renders: D02's `requestRender` exists. My click handlers still call `CT.render()` directly, as D02's notes ask.

## REQUESTS
- **D02, app-core.js:** in `heading()` and `CT.pageTitle()`, prefer `#main .ctitle` before the last h1. On the wide Atlas the concept title is `h2.ctitle` under h1 "Atlas", so today the title is "Atlas · Bassiet" and `focusHeading` focuses "Atlas" (I correct both after a route, but your wrapper resets the title on the next render). Change: `var c=m.querySelector('.ctitle');if(c)return c;` at the top of `heading()`.
- **D04, app-practice.js:**
  - (Already done by you: the mode card says "Plates" and the banners carry "Plates" and "Hull" h1s. My `retitle()` is now a harmless fallback.)
  - Hull weak map: use the same cell style as `covCell()` in app-today.js (inline `color:var(--fg);background:color-mix(in srgb,var(--<d>) <16–42>%,var(--surface2))`; no `d-*-bg` class, no opacity) and the short heads Path, Micro, Pharm, Bio, Phys (t09-08, t09-42).
  - When `CT.ps.from` is set (session started from a concept page), show "Back to <concept>" on the end screen (t06-47).
  - Keep the data-act names `chainPick`, `chainUndo`, `predPick` (`data-i`, `data-v`) and `imgGrade` (`data-g`), and keep `.opt` inside `.stage`. The keyboard shortcuts in app-today.js rely on them.
- **D05, app-dive.js:**
  - Add a Look row "Shortcuts: On / Off" that sets `CT.look.keys` ('on'|'off'); app-today.js already honours it (t09-20).
  - If you add 1–4 answering in stain tests or re-stains (t09-19, t07-33), tell me (or the coordinator) so the keys hint in `CT.views.today` can add "tests".
  - Optional: a small "n due" button near the top of home calling `CT.actions.startDue` (t06-40).
- **D01, index.html:**
  - Add `.lens h3{margin:0 0 3px;font:600 12px var(--body);letter-spacing:.08em;text-transform:uppercase}` with the colours from `.lens.d-* h4` copied to h3 (I style them inline for now).
  - Add the `.vh` utility (I also inline it).
  - Add `[tabindex="-1"]:focus{outline:none}`.
  - Add `.ledger>div[tabindex]:focus-visible{outline:2px solid var(--focus,var(--accent));outline-offset:2px}`.
  - Phone: `table.cov{min-width:0}` (I set it inline), `table.cov button{height:40px}`, and `.linkbtn{min-height:44px}` (t01-15).
  - `table.cov button.lit:hover{outline:2px solid var(--accent)}` already applies through `button:hover`; no change needed.
  - `.empty strong` reads very large on phone in the Instruments "No cracks yet" box; check its size.
- **Coordinator:** no new files and no script-tag changes from D03.
