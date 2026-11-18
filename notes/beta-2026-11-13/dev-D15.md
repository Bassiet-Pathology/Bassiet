# D15 handoff: new strata for Depths 1, 5 and 6 (bookx1.js)

## New file
`/home/claude/citron/bookx1.js` (the only file I touched). It defines three chapters and pushes three strata into `window.DEPTHS` at load. There is a double-push guard (matched on stratum id or chapter id). Following the coordinator's instruction, there are no getters, setters or hooks: it expects `DEPTHS` to exist when it runs.

| Depth | Stratum pushed | Chapter | Sections | Tables | REMEMBER keys | Stains | Questions (keys 0/1/2/3) | Prose words |
|---|---|---|---|---|---|---|---|---|
| 1 | `{id:'metab',name:'The Furnace Ledgers',ch:'c1-metab',topic:'Metabolism'}` | c1-metab | 7 | 7 | 7 | 25 | 7 (2/2/1/2) | ~1205 |
| 5 | `{id:'drugs',name:'The Apothecary of Knives',ch:'c5-drugs',topic:'Antimicrobial pharmacology'}` | c5-drugs | 7 | 7 | 7 | 26 | 7 (2/2/1/2) | ~1100 |
| 6 | `{id:'sleepers',name:'The Sleeping Draughts',ch:'c6-sleepers',topic:'Anaesthesia and analgesia'}` | c6-sleepers | 6 | 6 | 6 | 26 | 7 (2/1/2/2) | ~1110 |

Every question has `d` and `c`. Every `c` and every chapter `c` id resolves in BANK, including D18's new bank9 ids (fatty-acids, nucleotides, cell-wall-drugs, ribosome-drugs, dna-folate-drugs, antimicrobial-resistance, antimycobacterials, antivirals, general-anaesthetics, local-anaesthetics, nmj-blockers, opioids, analgesics). Explanations are 2–3 sentences: why the answer is right, then why the most tempting distractor is wrong. I evened out option lengths so the answer is never clearly the longest option. Wording is original, spelling British, and there is no emoji. Figures reused: `gram` (c5 wall drugs), `drc` (c6 MAC as ED50), `neuroap` (c6 local anaesthetics; the prose tells the reader to press its Lidocaine button).

### Content
- **c1-metab**: pentose phosphate pathway and G6PD (NADPH uses table); fatty acid synthesis and β-oxidation (MCAD, carnitine, CPT II, LCHAD table); ketogenesis with a ketosis-states table (starvation, DKA, euglycaemic DKA, alcoholic, hypoketotic); urea cycle with a 7-row defect table (NAGS, CPS I, OTC, ASS, ASL, arginase, UMP synthase); purine and pyrimidine synthesis and salvage with a nucleotide-drug table; glycogen metabolism with a hormonal-regulation table; lysosomal storage as a bedside "if you see, think of" table.
- **c5-drugs**: cell-wall agents (10-row class table); ribosome agents (30S/50S toxicity table, D-test); folate and DNA agents; resistance mechanisms and gene transfer; anti-TB, MAC and leprosy (target, toxicity and resistance-gene table, MDR-TB, latent TB); antifungals (10-row table); antivirals (10-row table: herpes, CMV, influenza, HBV, HCV, ribavirin) plus HIV principles.
- **c6-sleepers**: inhaled anaesthetics (blood:gas and MAC table, malignant hyperthermia, N₂O and B12); IV agents (propofol, thiopental, ketamine, etomidate, midazolam, dexmedetomidine); local anaesthetics (ester and amide, pH, fibre order, local anaesthetic systemic toxicity, methaemoglobinaemia); neuromuscular blockers (succinylcholine vs rocuronium table, sugammadex, Hofmann elimination, contraindications to succinylcholine); opioids (drug table, tolerance, naloxone and buprenorphine); non-opioid and multimodal analgesia (COX, NSAID kidney injury, neuropathic pain).

### Coordinator instructions applied during the round
- Added a `topic` field to each pushed stratum. It renders in the chapter header (e.g. "DEPTH −05 · Antimicrobial pharmacology").
- D07 overlap: c1-furnace now has fed and fasting, von Gierke and ethanol, and c1-nucleus has I-cell, Zellweger, X-ALD and Refsum. I cut my fasting-phase table, my peroxisomal rows and my I-cell text, and replaced them with cross-references ("see the Furnaces", "see the Nucleus Vault"). I kept only the mechanism notes that are new (why von Gierke raises lactate and urate).
- D08 overlap: c3-inherit now has full lysosomal and glycogen storage tables, and c4-deficient has a full antiretroviral table. I removed my duplicate tables and replaced them with non-duplicating ones: glycogen regulation, a bedside storage-disease discriminator, and a non-HIV antiviral table. The text points to the Halls of Inheritance and to the Empty Barracks ("Holding the virus back"). Facts are consistent: only Fabry and Hunter are X-linked; Pompe is acid α-glucosidase.
- Removed the DEPTHS defineProperty/setter hook; strata are now pushed directly.

## Findings addressed
- **t03-09** (High, no antimicrobial pharmacology): done in full as c5-drugs. It covers every class the tester listed, with per-drug toxicities and resistance mechanisms (PBP2a, β-lactamases, ESBL, carbapenemases, D-Ala-D-Lac, erm methylation, efflux, porins), plus RIPE, MDR-TB, antifungals and antivirals.
- **t03-10** (High, core metabolism missing): HMP shunt, urea cycle (OTC vs CPS I vs UMP synthase and orotic acid), fatty acid oxidation (MCAD, carnitine), purine and pyrimidine synthesis and salvage with methotrexate, 5-FU, mycophenolate, hydroxyurea and leflunomide, and Lesch-Nyhan and ADA. Lysosomal storage is a discriminator table that defers to D08's c3-inherit table.
- **t03-13** (Medium, bacterial genetics): transformation, conjugation, transposons and transduction are covered as the route by which resistance spreads (c5-drugs, "How the enemy turns the blade"). Phage-encoded toxins stay with D09's c5-gpos.
- **t05-51** (Medium, general anaesthetics absent): done in full as c6-sleepers (MAC, blood:gas, propofol, ketamine, etomidate, malignant hyperthermia).
- **t04-29** (partial): local anaesthetic toxicity and lipid emulsion are taught in c6-sleepers (its antidote-table row belongs to D09).
- t04-02 context: the c6 opioid phys stain teaches hypoventilation with a normal A–a gradient, consistent with D11's corrected question.

## Tests (private copy at beta/work-D15/tree, with bookx1.js after book16b.js and before links.js, and bank9.js after bank8.js)
- `node --check bookx1.js`: OK. Loading the file twice still gives one stratum each (guard works).
- vbook in index.html order (`beta/work-D15/vbook-order.js`): 74 chapters, 494 questions, **OK**. The only warnings are D16's four ch: triggers, because bookx2.js was not in my private index.
- s7.js 16 (full descent through all strata, including the new ones): all 16 depths sealed, `noUndef true`, `ERRS []`.
- Render at 390×844 and 1440×900 with all five stains on: no page errors or console errors, no horizontal overflow, no "undefined" or "NaN". Tables stack as cards on phone. Atlas chips resolve to the bank9 concepts. On sealed depths the depth pages show the new strata as "New · optional" (2.4). Shots: `beta/shots/D15-phone-*.png`, `beta/shots/D15-desk-*.png`.

## Could not do or left out
- c1-metab has no figure; no existing figure fits it. See the request to D20.
- I left the scattered antibiotic stains in other chapters alone (not my files); they stay consistent with c5-drugs.

## Requests for other owners
1. **Coordinator / D01 (index.html)**: add `<script src="bookx1.js"></script>` immediately after `<script src="book16b.js"></script>` and **before** `links.js`. links.js only rewrites chapter concept lists for BOOK entries that already exist, so D18's entries for c1-metab, c5-drugs and c6-sleepers apply only if bookx1.js loads first. Also add `<script src="bank9.js"></script>` after bank8.js. Without bank9.js the question concept ids fall back to the chapter's first concept (app-dive.js line 164), so nothing breaks, but the Atlas chips are fewer.
2. **Coordinator (checkers)**: the original scratchpad vbook.js loads files alphabetically, so bookx1.js runs before depths.js and gets reported as "orphan". Load in index.html order, as you planned; `beta/work-D15/vbook-order.js` is a drop-in that does this.
3. **D02 (sw.js)**: make sure bookx1.js is in the precache list (and bank9.js, bookx2.js, figs7.js).
4. **D09 (book6.js, c6-tox)**: if not already done for t04-29, add the antidote row `['Local anaesthetic systemic toxicity','20% IV lipid emulsion; benzodiazepines for seizures']`. Optionally add to the c6-pk or c5 text one line pointing to the new strata: "Antimicrobial classes: the Apothecary of Knives; anaesthetics and analgesics: the Sleeping Draughts."
5. **D08 (book3.js, c3-inherit)**: optional. In the OTC and orotic aciduria rows, a pointer "(the full urea cycle is in the Furnace Ledgers)" would close the loop.
6. **D20 (figs7.js)**: optional new figure for c1-metab. A clickable urea cycle (toggle NAGS, CPS I, OTC, ASS, ASL or arginase and watch ammonia, citrulline and orotic acid change), attached to the section whose heading contains "urea cycle". A pentose-shunt/NADPH figure would attach to the section whose heading contains "pentose phosphate".
7. **D06**: none. The transmissions x1a, x5f and x6e already resolve to my chapter ids.
