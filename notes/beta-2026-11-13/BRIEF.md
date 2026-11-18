# Bassiet beta test — brief for every tester

## What Bassiet is
A phone-first (also desktop) web app for USMLE Step 1 basic sciences: pathology, microbiology, pharmacology, biochemistry, physiology. It is a dark "microscopic descent" story game: a probe called Bassiet dives through 16 depths of a human Host. Each depth has strata (textbook chapters with five colour "stains" = subject callouts, REMEMBER boxes, tables, interactive figures, a 5-question stain test). A depth's seal breaks when all its strata are stained (≥60%) and its boss duel is won. A ward doctor (Dr. Hale) talks over the radio. There is also an Atlas (concept sites with five lenses + links), Practice (Trace = order mechanism chains, Predict = up/down/no change, Compare = tables, Images), Plates (user's own images) and Hull (miss log). Weekly dive log, weak-point finder, fading stains with spaced re-stains, export of misses to the user's flashcard app Yuzu via Google Drive.

The owner is a GP preparing for Step 1. Signature colour is orange; dates dd/mm/yyyy. Wants: extremely dark and mysterious mood, textbook-depth content, beautiful interactive illustrations, deep lore.

## Files (READ ONLY — never edit anything in /home/claude/citron)
Source: /home/claude/citron
- index.html — all CSS (tokens, dive world `:root[data-world="dive"]`, figures, duels) and script order.
- app-core.js (CT core, storage via db or in-memory fallback, render), app-today.js (nav, hash routes, Atlas views, concept pages), app-practice.js (Practice, Plates, Hull), app-dive.js (Dive home, depth pages, chapter reader, stain tests, re-stain, duels, weak points, dive log, Yuzu export, radio, Host file, look panel, sound, Pall canvas).
- depths.js (16 depths), story.js (transmissions STORY.T and Host file STORY.H), book1a … book16b.js (BOOK chapters: {depth,title,epi,c,S:[{h,p,fig,table,key,s:[[stain,text]]}],Q:[{q,o,a,x}]}), links.js.
- bank1–8.js (BANK.C concepts, E links, CH chains, PT predict, CP compare).
- figs.js … figs6.js (26 interactive SVG figures, FIG[id]={title,def,ctrl,view}).
- sw.js, manifest.json (installable PWA).
Hash routes: #today #depth-N #ch-<id> #restain-<id> #duel-N #radio #host #atlas #concept-<id> #practice #images #mistakes.

## How to run it
Playwright + Chromium are installed: `NODE_PATH=$(npm root -g) node yourscript.js`. Open `file:///home/claude/citron/index.html`. Locally there is no Claude storage, so data lives in memory (a banner says so) — use `CT.setDoc(collection,id,obj)` in page.evaluate to seed progress. Note: the local file has no doctype, so it renders in quirks mode (class names case-insensitive); the published artifact adds a doctype — mention quirks-only issues as such.
Example scripts to copy (do not edit them): /tmp/claude-0/-home-claude/c80d3a2e-1d1d-5dac-83ee-172c002ca966/scratchpad/s7.js (full descent: reads every chapter, answers, wins duels), s8.js (re-stain, lose a duel, Lights-on), s9.js (Atlas/Practice), figshot.js, vbook.js, validate.js.
Phone viewport 390×844; desktop 1440×900; tablet 820×1180. Take screenshots and LOOK at them with the Read tool — visual judgment matters.
Put your own scripts and screenshots in /tmp/claude-0/-home-claude/c80d3a2e-1d1d-5dac-83ee-172c002ca966/scratchpad/beta/work-tNN/ (make it) and shots in .../beta/shots/ named tNN-*.png.

## Rules
- Never edit the source. You are a tester.
- Content must stay original wording (never suggest pasting text from Pathoma, First Aid or other books).
- The story has a secret twist. If your findings touch it, put them in a final section titled "SPOILER-SENSITIVE (owner must not see)". Everything else in your report must be safe for the owner to read.
- Be heavy and specific: exact file, chapter id / concept id / function, what is wrong, why it matters, and a concrete fix (exact corrected wording for content errors). Medical accuracy errors are the most important content finding — check against your knowledge carefully; flag only real errors or real Step 1-relevant gaps, not style quibbles.
- Rank by severity: Critical (wrong medicine, crash, data loss, blocks progress), High, Medium, Low, Idea (new improvement).

## Report
Write to /tmp/claude-0/-home-claude/c80d3a2e-1d1d-5dac-83ee-172c002ca966/scratchpad/beta/tNN-<area>.md:
1. Verdict (3–5 lines) and a 1–10 score for your area.
2. What works well (short).
3. Findings table: `| ID | Sev | File | Where | Problem | Fix |` with IDs tNN-01, tNN-02… Aim for 25–60 real findings.
4. Top 5 improvement ideas for your area (bigger changes).
5. SPOILER-SENSITIVE section if needed.
Your final reply to the coordinator: the report path, finding counts by severity, and the 5 most important findings in one line each.
