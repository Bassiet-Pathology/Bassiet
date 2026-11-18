# dev-D04: Practice, Plates and Hull (app-practice.js)

Owner: D04. I edited one file only: /home/claude/citron/app-practice.js. I added no new files and need no script tags.
- The untouched copy is at beta/work-D04/app-practice.orig.js.
- Test scripts are beta/work-D04/d04test.js (phone 390 and desktop 1440), d04b.js (concept → practice → back, Plates mode) and d04c.js (Hull at 320 px).
- I ran them against a local http server on the live tree with the service worker blocked.
- Screenshots are in beta/shots/D04-*.png.
- Regression: `node --check` passes on all files. `s7.js 16` completes all 16 depths with `ERRS []`. `s9.js` shows `ERRS []`, and neither test script hit a page error.

## Contracts
- **2.1 (honest saves).** Every caller that shows success now waits for `CT.setDoc` / `CT.delDoc` and treats `false` as failure.
  - **Log a miss (Hull):** "Logged." appears only on success. On failure the form keeps its text and shows an inline `role="alert"` line.
  - **Save plate:** the same applies. A retry reuses the asset that already uploaded, so a second upload is never made (tested: retry made 0 new uploads).
  - **Deletes:** on failure the core restores the row and shows the error toast. I do not add a second toast, because it would hide the core's specific reason (for example "Storage is full").
  - Upload errors, which the core never sees, use `CT.toast(msg,'err')`.
- **2.2 (Compare shuffle).** Options are shuffled once per question per session and the order is stored in `CT.ui.cmpOrd[sessionId|item|row|col]`. Scoring compares the original value index.
  - Measured over 1,600 questions: the answer sat at the column's own position 31–32% of the time, with a mean of 3.0 options. That is chance level; before the change it was 94%.
  - The order is the same after every re-render.

## Findings fixed (36)
| ID | What changed |
|---|---|
| t06-29 (H) | Compare options are shuffled, the order is stable for the session, and scoring uses the original index (2.2). |
| t06-30 (H) | Trace scores links between neighbours (shown as "4 of 5 links right"). Only the steps outside the longest in-order run are marked wrong. The grade uses max(link score, in-order fraction), so one moved step now grades "hard" instead of "again". |
| t06-31 (M) | `CT.buildQueue` is overridden in app-practice.js. A session holds at most 8 items: due items first, topped up with new ones. With a backlog it is 6 due + 2 new. The copy now says "up to eight". |
| t06-32 (M) | The end screen is now a trail log: score per mode (links, rows, questions or plates right), a list of missed items linked to their concept, and when each comes back ("in 10 minutes", "tomorrow"). |
| t06-33 (M) | Before Check, tapping a placed step returns it and every later step to the pool. "Undo last" stays. Drag was not done. |
| t06-24 (L) | Compare never asks about a "—" cell, and "—" is never offered as an option. |
| t06-38 (M) | The Compare results show missed cells with a dashed red outline plus ✕ and hidden text, and right answers with ✓. Below 600 px the table becomes one card per column, so nothing is cut off. |
| t06-41 (M, my part) | Keys: Trace 1–9 picks a step and Backspace takes one back; Predict U/D/N sets the first open row, and ↑/↓ change the focused row. After every action, focus moves to the next sensible control (next step, Check, the result line, Next). A keys hint line appears on desktop. |
| t06-42 (M) | Plates mode with no plates says "No plates mounted yet" and has an Open Plates button. The other empty states now tell apart "no items match these filters" and "all N are scheduled for later". |
| t06-44 (L) | Questions read "HCV: genome?" (column: row) instead of "Genome in HCV?". |
| t06-45 (L, partial) | A two-value row gets a third option when another table in the same system has a row with the same label. Two-option questions fell from about 33% to 27–31%. More would need content. |
| t06-46 / t09-05 (H) | Trace: ✓ and "✕ BELONGS AT N", a dashed border on wrong steps, and visually hidden text ("out of place, belongs at step N"). |
| t09-06 (H) | Predict: each row gets a result line ("✓ Rises." or "✕ You said it rises; it falls."). The buttons' aria-labels say "your answer, wrong" or "correct answer". |
| t06-53 (Idea) | A predict row may carry an optional third element `['Plasma K+','u','reason']`. It is shown under the row when that row is wrong. |
| t06-47 (L) | The button says "Dive" instead of "Today". A session started from a concept's "Practice this" ends with "Back to <concept>"; it uses D03's `ps.from` and falls back to the concept the user came from. |
| t06-48 / t10-31 (L) | Dead `src` code removed. A plate without `assetId` shows a placeholder instead of `/_blob/undefined`. Plates can carry an optional concept (new select), so plate misses get a concept and the Hull's "Make a note" works for them. |
| t09-12 / t01-22 / t10-41 (H/L) | Page headings are "Plates" and "Hull", and the Practice mode is called "Plates". `CT.KIND.image` is set to 'Plate'. |
| t09-28 (M) | The whole session (End session, progress bar, chips, card) sits in one centred 860 px column. |
| t09-31 (M) | Practice, Plates and Hull each get a slim pixel banner (bolt, cell or shield motif, using the existing `.banner.slim` classes) and in-world empty states. D03's console strip sits above them; I removed mine to avoid showing two. |
| t09-08 / t09-42 (H/L) | The Hull weak map now looks like D03's "Survey of the Host": dim colour-mix cells with solid text, an inset hue border, short heads (Path/Micro/Pharm/Bio/Phys), no 520 px minimum width, and a caption. It fits 320 px with no horizontal scroll (D03 request 1). |
| t07-22 (M, Hull side) | The weak map falls back to the concept's system and its first lens when a miss has no `discipline` or `system`, and reads `d` as well. A count of recent misses that still cannot be placed is shown under the map. There is also a new list, "Where the hull cracks most", ranking concepts by misses. |
| t07-29 (L) | "Ran out of time" added to `REASONS`. |
| t10-05 (H, my callers) | missAdd and imgAdd are honest (see 2.1). |
| t10-06 (H) | Plate delete removes the asset only when the row delete resolved true, and only when no other plate uses the same asset (tested: failed delete gives 0 asset deletes). |
| t10-08 (M, my part) | Tapping Delete and its 4 s reset no longer re-render the page. The button label changes in place, so a half-typed note keeps focus and the phone keyboard (tested: focus stayed in `#m-note`). |
| t10-16 (M) | Uploads go through `prep()`: anything over 1600 px or 1.5 MB is re-encoded to JPEG at a longest side of 1600 px (a 3200×2400 test image went up as JPEG). GIFs pass through untouched. Formats the browser cannot decode get a clear message, and there is a 20 MB check. |
| t10-32 (L) | The file input id is now `plate-file`, so app-today's draft listener no longer stores `C:\fakepath\…`. |
| t10-33 (L) | The Hull log has a filter box (`#h-q`, which keeps focus and caret) and a "Show 60 more" button. |
| t10-40 (L) | Plates without the assets capability still show the gallery. The message tells local mode ("Open the published page…") apart from non-editors ("Only people who can edit this page…"). |
| t01-15 (M, partial) | "practice anyway" is now a real button ("Practise anyway"). |
| Extra | Compare feedback line ("Not quite. HCV: genome is …"). Subject chips are coloured. Predict misses record which rows were wrong in `source`. Plate grading is guarded against a double tap. |

**Coordinator request (option indexes can move): done.**
- When a miss has `qText`, `chosenText` or `rightText`, the Hull shows the question stem, "✕ You chose: …" and "✓ Answer: …" under the source line. The log filter also searches these fields.
- Misses without them render exactly as before.
- Tested with a new-style miss and an old-style miss: shot D04-phone-hull-qtext.png, script work-D04/d04d.js.

D03's three requests: (1) the weak-map styling is done. (2) "Back to <concept>" reads `ps.from` and is tested ("Back to Shock"). (3) The action names `chainPick`, `chainUndo`, `predPick`, `imgGrade`, `cmpPick`, `cmpNext`, `next` and `imgShow`, and `.stage .opt`, are all unchanged.

## Not done or out of scope
- Drag-to-reorder in Trace (t06-33). Tap to take back covers the need.
- t06-39 (more "no change" predict rows), t06-43 (coverage) and real distractors for two-option rows (t06-45) are content work for D18. My code already supports a third element on predict rows.
- Order-flexible chain steps (t06 idea 5) were not built.

## Requests for other owners
- **D02 (app-core.js):** app-practice.js now overrides `CT.buildQueue`. It is loaded later, so it wins; the policy is 8 at most, 6 due + 2 new with a backlog. Your version gives 10 with a backlog, so please keep it as dead code or delete it. app-practice.js also wraps `CT.openCurrent` (Compare question cells and the session id) and sets `CT.KIND.image='Plate'`.
- **D05 (app-dive.js):**
  - The Hull already reads `qText`, `chosenText` and `rightText`.
  - In `logMiss`, add an optional `ch:<chapter id>` to each miss doc. The Hull then shows a "Re-read the stratum" button that goes to `#ch-<id>`; the code is already in place.
  - Log duel timeouts with reason `'Ran out of time'`, which now exists in `REASONS`.
- **D01 (index.html):**
  - Optional `.vh` utility class. I also inline the same styles, so nothing breaks without it.
  - The ✓/✕ marks in Trace and Compare are 12 px mono. Enlarge them if you like.
- **D18 (bank9.js / bank8.js):** predict rows can carry a third element, a one-line reason shown when that row is answered wrong. Add more true "no change" rows (t06-39).
