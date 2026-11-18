# D08 handoff: book3.js, book4.js (Depths 3–4 content)

Files edited: /home/claude/citron/book3.js, /home/claude/citron/book4.js. No new files. No script tags needed.
Checks: `node --check` clean on both; vbook.js OK (71 chapters; the only warnings are story triggers for the new D15/D16 chapters, which are not loaded yet); `s7.js 16` completes, all 16 depths sealed, `ERRS []`, `noUndef true`. Every question `c` and chapter `c` id resolves in BANK.

## Totals
- Questions 45 → 59 (5–7 per chapter). Every question has `d` and `c`; every `x` is now 2–3 sentences (why the answer is right, and why the most tempting distractor is wrong).
- Answer keys across both files: index 0 = 14, 1 = 14, 2 = 16, 3 = 15 (was 76% index 1). Long-answer giveaways evened out (c3-repeat Q1, c4-adaptive Q2, c3-mito Q1/Q4).
- Prose words: c4-hyper 156 → 1473; c4-deficient 143 → 1297; c4-graft 185 → 656 (+ 4 new tables); c4-innate 295 → 536; c4-adaptive 285 → 577; c3-inherit 369 → 897; c3-repeat 219 → 641; c3-mito 245 → 435; c3-tools 276 → 458.

## Fixed, by finding ID
| ID | What changed |
|---|---|
| t03-01(b) | Source keys rebalanced in all 9 chapters (see totals). Explanations do not refer to option letters. |
| t03-07 | c3-repeat REMEMBER replaced with an original "read the repeat by where it sits" line; c3-tools "SNoW DRoP" removed from text and Q2 (Southern = Edwin Southern, others are puns); c4-innate "GM makes classic cars" → "only IgM and IgG can bind C1q". ACID and CATCH-22 kept (tester: acceptable). |
| t03-10 (part) | c3-inherit: new sections "The locked rooms: lysosomal storage" (9-row table incl. Fabry, Gaucher, Niemann-Pick, Tay-Sachs, Krabbe, MLD, Hurler, Hunter, I-cell; cherry-red spot and ERT stains) and "Sealed stores: glycogen storage" (types I–VI). Inborn errors table: OTC deficiency, orotic aciduria, Lesch-Nyhan, MCAD rows, plus a prose "three blood tests sort a sick newborn" (urea cycle vs organic acidaemia vs FAO; orotic acid OTC vs CPS I). HMP shunt and fatty-acid oxidation pathways are left to D15's c1-metab. |
| t03-15 | c4-adaptive: new "Messengers of the garrison" cytokine table (15 rows, source/action) and "Where the garrison lives" (node zones, spleen, asplenia, CD marker table). |
| t03-16 | c4-deficient CD4 table: PML, HIV dementia, Cryptosporidium (<200), bacillary angiomatosis (<100), oral hairy leukoplakia (<500); Toxoplasma prophylaxis "if IgG positive"; CrAg screening. |
| t03-17 | c4-hyper: new sections Type I (sensitisation, early/late phase, non-IgE mast cell activation, tryptase), Type II (four mechanisms, Coombs, linear vs granular IF, pemphigus vs pemphigoid), Type III (why complement falls, serum sickness timing, Arthus), Type IV (two arms, haptens, SJS/TEN/DRESS, anergy, IGRA), How tolerance breaks; lupus expanded (pathogenesis, nephritis classes, drug-induced lupus, newer drugs, APS anticoagulation). c4-deficient restructured: pattern table + tests (TRECs), B-cell, T-cell/SCID (IL2RG vs ADA vs RAG), phagocyte (LAD1, CGD, Chédiak-Higashi, MPO), HIV virology/natural history, new "Holding the virus back" (ART/PEP/PrEP, class table). c4-graft: direct vs indirect allorecognition, crossmatch, three-signal model, belatacept/ATG, new biologics table, blood products, HDN detail, 2 more transfusion reactions, pregnancy vaccines. |
| t03-18 | All 59 explanations rewritten (incl. the c4-deficient Q1 and c4-graft Q4 examples). |
| t03-23 | c3-repeat trisomy sentence corrected (only 21, 18, 13 reach live birth; sex aneuploidies milder). |
| t03-24 | Edwards quad screen: AFP, β-hCG, oestriol low; inhibin A low or normal. |
| t03-25 | α₁-antitrypsin moved to a new "Codominant" pedigree row (PiZZ/PiMZ). |
| t03-26 | c3-inherit pharm stain rewritten (diet principles; ammonia scavengers). |
| t03-27 | TSC row: TSC1 9q34, TSC2 16p13 (chromosomes added to all rows). |
| t03-37 | Helper-subset column renamed "Induced by". |
| t03-38 | AT: oculocutaneous telangiectasias (conjunctivae first), radiation sensitivity. |
| t03-39 | IgA deficiency row: falsely negative IgA anti-tTG. |
| t03-44 | Down row: "acute megakaryoblastic leukaemia (AML M7)", transient abnormal myelopoiesis. |
| t03-47 | c3-tools Q1 reworded ("Which targeted test…"), x mentions microarray as first-line. New c3-tools table "which test answers which question". |
| t02-22 / t02-S12 | c4-graft epigraph replaced with D06's wording (coordinator request): "…remember its face for as long as it lives." |
| t02-24 | "Some X" epigraphs rewritten: c4-hyper, c4-deficient (and c3-inherit). |

Own accuracy checks while reading: OI type I described as a null allele (quantitative), not dominant negative; Turner/Klinefelter screen cells filled (cystic hygroma; usually normal); achondroplasia de novo "about 80%"; F508del naming; obsolete didanosine/stavudine removed; dolutegravir creatinine effect, lenacapavir PrEP added; phaeochromocytoma spelling.

## Not done
- t03-22 (mutation types, protein trafficking) is c1-nucleus (D07).
- Pathway prose for HMP shunt and fatty-acid oxidation (t03-10) is D15's c1-metab; I added only the clinical rows to c3-inherit.

## REQUESTS
- **D18 (links.js):** `'c3-inherit':['aneuploidy']` makes aneuploidy the main site of the inheritance chapter, but aneuploidy is taught in c3-repeat. Change to `'c3-inherit':['genetic-disorders','lysosomal','glycogen-storage']` and `'c3-repeat':['repeat-expansion','aneuploidy','muscle-disease']`.
- **D01 (index.html):** new 4-column tables at phone width need the t03-08 table fix: c3-inherit lysosomal table, c4-deficient "Missing arm" table, c4-graft "Antibodies made into drugs" table (plus the existing c3-repeat and c4-graft rejection tables).
- **D15 (bookx1.js):** for consistency with c3-inherit, keep Fabry and Hunter as the only X-linked lysosomal diseases and Pompe as acid α-glucosidase; c4-deficient now has an ART class table (NRTI/NNRTI/INSTI/PI/boosters/lenacapavir), so c5-drugs can cross-refer rather than repeat it.
- **D19/D20 (optional):** t08 idea of a hypersensitivity types I–IV timeline figure would fit c4-hyper section "Four types" (no fig there yet).
