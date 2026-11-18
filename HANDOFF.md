# Bassiet: hand-off to the Citrus Maxima project (18/11/2026)

## Where things live
- **Live app:** https://claude.ai/artifact/DDmJuv6a2agDv383HcCPvH. This is a multi-file Claude artifact and the owner's private copy. It installs as a PWA from the artifact page.
- **Repo:** Bassiet-Pathology/Bassiet. `app/` is the exact published source, `tests/` holds the test scripts, `tools/gen-sw.js` generates the service worker, and `docs/` holds the project docs and the beta round.
- **No build step.** Plain files: `app/index.html` plus about 50 JS files. Script order is in index.html. A new JS file needs a script tag there, then a regenerated sw.js (`node tools/gen-sw.js app`).
- **Release:**
  1. Run the gate in tests/README.md.
  2. Run `node tools/gen-sw.js app`.
  3. Publish from a Claude session with the Artifact tool: `file_path` = app/index.html, `url` = the live URL, and a `files` map naming every changed file. The capabilities (db, assets, Google Drive with search_files, create_file and trash_file) carry forward.
  4. Commit and push here.
- **GitHub Pages:** not set up. The app uses Claude artifact storage (`claude.use("db")`), so it only runs inside claude.ai. Pages would be a read-only demo.

## What the app is
- **Purpose:** USMLE Step 1 basic sciences (pathology, microbiology, pharmacology, biochemistry, physiology) for a GP preparing for Step 1.
- **Form:** a "microscopic dark adventure". A probe, the Bassiet, descends 16 depths of a mysterious Host.
  - Each depth has strata: textbook chapters with five subject "stains" as lenses, tables, interactive figures, and a stain test.
  - A depth's seal breaks when its boss duel is won.
  - A ward doctor talks over the radio. The story has a secret twist (docs/bassiet-story-bible-SPOILERS.md), and **the owner must never be told it**.
- **Also in the app:**
  - Atlas: concept sites with lenses and links.
  - Practice: Trace (order a chain), Predict (up/down/no change), Compare, Images.
  - Plates: the owner's images.
  - Hull: the miss log.
  - Weekly dive log, weak-point finder, fading stains with re-stains, and export of misses to Yuzu.
- **Devices:** phone first (Samsung), plus tablet and the Steam Deck at a 27" monitor. Two worlds: The dive (dark, default) and Lights on.
- **Look:** Bassiet design system (docs/bassiet-design.md), orange accent, dates as dd/mm/yyyy.
- **Data it owns** (artifact db collections):
  - `prog`: Practice item scheduling
  - `notes`: concept notes and ratings
  - `images`: plates
  - `misses`
  - `days`: daily counts
  - `reads`, which holds:
    - `reads/<chapterId>`: done, right, total, lvl, due…
    - `reads/story`: seen transmissions
    - `reads/boss-<n>`
    - `reads/yuzu-sent`
    - `reads/drive`: cached Drive folder ids

## Versions
- **v16 (17/11/2026):** Drive folders are found by id, then by the new-layout name, then the old path. status.json gets `drive.byTag` (docs/bassiet-drive-note.md).
- **v15 (13/11/2026), beta round:** 10 testers, then 20 developers (docs/beta-2026-11-13/).
  - Content: 78 chapters (7 new), 522 questions with balanced answer keys and 2–3 sentence explanations, 29 figures.
  - Mechanics: options shuffled everywhere; duels rebalanced; seal rule.
  - Story: 172 transmissions, Host file, per-boss lines, ending.
  - Storage: safe setDoc contract (true/false with rollback); offline PWA; accessibility and design fixes.
- **v14:** Atlas expanded to 155 sites. **v13:** all 16 depths written.

## In progress / next
- Not verified on the live page: real Claude storage, the Drive calls (Send to Citrus, Send misses to Yuzu), and real phones. Ask the owner to try one stain test, one save and one Send to Citrus.
- The owner should tap "Send to Citrus" once, so Citrus sees `drive.byTag`.
- Figures not yet built: c1-metab (urea cycle or pentose shunt), c10-glom (GFR/arterioles), hepatitis B markers (c5-virus), adrenal axis (c12-adr), shock (c8-failing), cell cycle (c2-mutiny), brainstem (c16-nerves), brachial plexus (c14-frame), stroke territories (c16-stroke). Designs are in docs/beta-2026-11-13/t08-figures.md. Use the API in app/figs7.js (attach to sections at load; never remove an existing figure).
- Ideas: drag-to-reorder in Trace; 10–12 question pools per stratum; a desktop side rail for chapters; owner-only db rules (the artifact is private, so this is optional).
- Old test s8.js: its duel step predates the new Depth 1 metabolism stratum. Update its setup if it's used.

## Integrations
- **Citrus hub:** `status.json` in Bassiet's Drive folder (new layout: Citrus/Learning/Medicine/Step 1 - Bassiet; formerly My Apps/hub/bassiet). Fields: v1 fields plus due, estimatedMinutes, streak, nextDue, asks, extra and `drive:{byTag:true,method:'folder-id'}`. It is written only when the owner taps "Send to Citrus": create new, then trash the old copies, because the connector cannot update file content.
- **Yuzu:** weekly `yuzu_pack` JSON (basic cards from missed stain-test and duel questions, stable ids, tags source::Bassiet) goes into the yuzu-data `collection/inbox`. Cards already sent are skipped.
- **Drive connector limitation:** it cannot read or write `appProperties`, so tags are unavailable to artifact apps (docs/bassiet-drive-note.md).
- **No deep links in yet.** CT.APP_URL is the artifact URL.

## Owner facts
- A GP preparing for USMLE Step 1. Works shifts at a clinic in Saudi Arabia, so the week starts on Sunday and the time zone is Asia/Riyadh.
- Never copy text or images from Pathoma, First Aid or other review books, including their mnemonics. Original wording only; British spelling for new text.
- Never reveal the story twist to the owner. Keep the Host's sex neutral.
- Signature orange, dd/mm/yyyy.

## Docs copied
- docs/bassiet-blueprint.md
- docs/bassiet-design.md
- docs/bassiet-drive-note.md
- docs/bassiet-story-bible-SPOILERS.md
- docs/memory-step1-pathology-app.md (the old project's memory, [stated] lines)
- docs/beta-2026-11-13/: tester reports t01–t10, CONTRACT.md, BRIEF.md, dev-D01…D20 handoff notes. t02 and dev-D06 contain spoiler sections.
