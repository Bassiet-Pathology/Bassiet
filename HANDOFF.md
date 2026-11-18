# Bassiet: hand-off (moved to the Citrus Maxima project 18/11/2026; website mode added the same day)

## Where things live
- **Website (main home from 18/11/2026):** https://bassiet-pathology.github.io/Bassiet/ — GitHub Pages from `main` › `/docs`. Progress is saved on the device (IndexedDB, two slots) and synced to Google Drive with the family's cloud model (claude/cloud-model.md, Sudachi's code): `state.json` + `recs-00…15.json` in Bassiet's folder (tag `citrusApp=bassiet`; fallback `My Apps/hub/bassiet`), daily backups (14), plates in `plates/`. Sign-in: the shared web client (`753489712404-ra7ahu…`); the origin `https://bassiet-pathology.github.io` and the redirect URI `https://bassiet-pathology.github.io/Bassiet/` must be on it.
- **Claude artifact (still works):** https://claude.ai/artifact/DDmJuv6a2agDv383HcCPvH, private, Claude's own storage (`claude.use("db")`). The two keep separate progress.
- **How one source serves both:** `docs/web/boot.js` runs first; on github.io / localhost (or `?web=1`) it installs a stand-in for `window.claude.use` from `docs/web/shim.js` (db → device + Drive, assets → device + Drive `plates/`, mcp → Drive REST for Send to Citrus / Yuzu). Inside claude.ai it does nothing. `docs/web/google.js` and `devstore.js` are Sudachi's, `cloudparts.js` is Bassiet's record layout.
- **Repo:** Bassiet-Pathology/Bassiet. `docs/` is the app (Pages root), `tests/`, `tools/gen-sw.js`, `notes/` (project docs, beta round).
- **No build step.** A new JS file needs a script tag in docs/index.html, then `node tools/gen-sw.js`.
- **Release:** run the gate in tests/README.md (including `tests/cloud.mjs` and `tests/webmode.js` against `python3 -m http.server 8765 --directory docs`), `node tools/gen-sw.js`, commit and push (Pages deploys). To update the artifact too, publish docs/index.html with the Artifact tool (`url` = the artifact, `files` = changed files).

## What the app is
- **Purpose:** USMLE Step 1 basic sciences (pathology, microbiology, pharmacology, biochemistry, physiology) for a GP preparing for Step 1.
- **Form:** a "microscopic dark adventure". A probe, the Bassiet, descends 16 depths of a mysterious Host.
  - Each depth has strata: textbook chapters with five subject "stains" as lenses, tables, interactive figures, and a stain test.
  - A depth's seal breaks when its boss duel is won.
  - A ward doctor talks over the radio. The story has a secret twist (notes/bassiet-story-bible-SPOILERS.md), and **the owner must never be told it**.
- **Also in the app:**
  - Atlas: concept sites with lenses and links.
  - Practice: Trace (order a chain), Predict (up/down/no change), Compare, Images.
  - Plates: the owner's images.
  - Hull: the miss log.
  - Weekly dive log, weak-point finder, fading stains with re-stains, and export of misses to Yuzu.
- **Devices:** phone first (Samsung), plus tablet and the Steam Deck at a 27" monitor. Two worlds: The dive (dark, default) and Lights on.
- **Look:** Bassiet design system (notes/bassiet-design.md), orange accent, dates as dd/mm/yyyy.
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
- **v17 (18/11/2026):** own website on GitHub Pages with device + Drive storage (cloud model), Drive folders by tag on the website, cloud button and "Your data" sheet. The artifact is unchanged.
- **v16 (17/11/2026):** Drive folders are found by id, then by the new-layout name, then the old path. status.json gets `drive.byTag` (notes/bassiet-drive-note.md).
- **v15 (13/11/2026), beta round:** 10 testers, then 20 developers (notes/beta-2026-11-13/).
  - Content: 78 chapters (7 new), 522 questions with balanced answer keys and 2–3 sentence explanations, 29 figures.
  - Mechanics: options shuffled everywhere; duels rebalanced; seal rule.
  - Story: 172 transmissions, Host file, per-boss lines, ending.
  - Storage: safe setDoc contract (true/false with rollback); offline PWA; accessibility and design fixes.
- **v14:** Atlas expanded to 155 sites. **v13:** all 16 depths written.

## In progress / next
- Not verified on the live page: real Claude storage, the Drive calls (Send to Citrus, Send misses to Yuzu), and real phones. Ask the owner to try one stain test, one save and one Send to Citrus.
- The owner should tap "Send to Citrus" once, so Citrus sees `drive.byTag`.
- Figures not yet built: c1-metab (urea cycle or pentose shunt), c10-glom (GFR/arterioles), hepatitis B markers (c5-virus), adrenal axis (c12-adr), shock (c8-failing), cell cycle (c2-mutiny), brainstem (c16-nerves), brachial plexus (c14-frame), stroke territories (c16-stroke). Designs are in notes/beta-2026-11-13/t08-figures.md. Use the API in app/figs7.js (attach to sections at load; never remove an existing figure).
- Ideas: drag-to-reorder in Trace; 10–12 question pools per stratum; a desktop side rail for chapters; owner-only db rules (the artifact is private, so this is optional).
- Old test s8.js: its duel step predates the new Depth 1 metabolism stratum. Update its setup if it's used.

## Integrations
- **Citrus hub:** `status.json` in Bassiet's Drive folder (new layout: Citrus/Learning/Medicine/Step 1 - Bassiet; formerly My Apps/hub/bassiet). Fields: v1 fields plus due, estimatedMinutes, streak, nextDue, asks, extra and `drive:{byTag:true,method:'folder-id'}`. It is written only when the owner taps "Send to Citrus": create new, then trash the old copies, because the connector cannot update file content.
- **Yuzu:** weekly `yuzu_pack` JSON (basic cards from missed stain-test and duel questions, stable ids, tags source::Bassiet) goes into the yuzu-data `collection/inbox`. Cards already sent are skipped.
- **Drive connector limitation:** it cannot read or write `appProperties`, so tags are unavailable to artifact apps (notes/bassiet-drive-note.md).
- **No deep links in yet.** CT.APP_URL is the artifact URL.

## Owner facts
- A GP preparing for USMLE Step 1. Works shifts at a clinic in Saudi Arabia, so the week starts on Sunday and the time zone is Asia/Riyadh.
- Never copy text or images from Pathoma, First Aid or other review books, including their mnemonics. Original wording only; British spelling for new text.
- Never reveal the story twist to the owner. Keep the Host's sex neutral.
- Signature orange, dd/mm/yyyy.

## Docs copied (in notes/)
- notes/bassiet-blueprint.md
- notes/bassiet-design.md
- notes/bassiet-drive-note.md
- notes/bassiet-story-bible-SPOILERS.md
- notes/memory-step1-pathology-app.md (the old project's memory, [stated] lines)
- notes/beta-2026-11-13/: tester reports t01–t10, CONTRACT.md, BRIEF.md, dev-D01…D20 handoff notes. t02 and dev-D06 contain spoiler sections.
