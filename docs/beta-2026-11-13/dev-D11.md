# dev-D11 — content, depths 9–10 (book9a.js, book9b.js, book10.js)

All three files were rewritten in place. Chapter ids are unchanged, and no `fig` was removed or added. `node --check` is clean, vbook.js is OK, and s7.js 16 completes with no errors on a private copy (baseline-v14 plus my files: all 16 seals broken, ERRS []).

## Totals (10 chapters)
- Questions: 50 → 68 (6–7 per chapter). New questions are appended at the end of each Q array, so the indices of existing misses still point at the same questions.
- Answer keys (2.2): positions 0/1/2/3 = 17/16/17/18 (was almost all 1). Every chapter mixes all four.
- Key is the longest option: 7/68 (10%; t04 counted 49% across depths 6–11).
- `d` is on all 68 questions. `c` is on 66/68; the 2 without one are a TOF question and an RCC question, which have no matching concept. Every `c` resolves in BANK.
- Explanations (t04-10): every `x` now runs 2–3 sentences, covering why the answer is right and why the most tempting distractor is wrong. None is under 150 characters.
- About 13 stems were turned from one-line recall into vignettes (t04-12).
- Prose: about 4,700 → 5,700 words. 10 new sections and 13 new tables.

## Findings fixed
| ID | Fix |
|---|---|
| t04-01 | Keys rebalanced in source for all 10 chapters (see totals). |
| t04-02 | c9-exchange Q1 rebuilt with PaCO₂ 70 (PAO₂ ≈ 62, gradient ≈ 7: normal). Stem says room air at sea level. |
| t04-08 | c10-tubule thiazide row: ↑serum Ca²⁺ with ↓urinary Ca²⁺, used to prevent stones and protective in osteoporosis. |
| t04-10/11/12 | Explanations, distractor lengths and vignettes, as above. |
| t04-16 | c10-glom new section "Arterioles, plasma flow and filtration fraction": RPF/GFR/FF table with 8 rows (afferent and efferent constriction and dilation, plasma protein up and down, ureteric obstruction, volume depletion), a REMEMBER line, and new Q6. |
| t04-18 | c9-exchange: CO lowers true SaO₂ (co-oximetry) while pulse oximetry reads falsely normal; MetHb reads about 85%. Added a table of PaO₂, SaO₂, oximeter and content for anaemia, polycythaemia, CO, MetHb, cyanide and hypoventilation. |
| t04-20 | Reid index above 0.5 (normal below about 0.4). |
| t04-21 | MUDPILES replaced by an original four-source grouping (ketones, lactate L/D, kidney failure, toxins incl. oxoproline). Toluene noted as usually normal-gap. |
| t04-22 | c10-acid Q1 pH 7.29. |
| t04-24 | PSGN latency: 1–3 weeks after pharyngitis, 3–6 after impetigo (table, and Q2 now says four weeks). |
| t04-32 | SABA row reflects current anti-SABA-only guidance (ICS–formoterol reliever). Tezepelumab, reslizumab, dupilumab (IL-4/IL-13) added. |
| t04-33 | COPD survival sentence replaced (oxygen for PaO₂ ≤ 55 or SaO₂ ≤ 88%, smoking cessation, NIV, LVR). |
| t04-37 | c10-salts starts with serum osmolality (hyperglycaemic correction, pseudohyponatraemia). New hypotonic-hyponatraemia table and new Q6. |
| t04-38 | Diuretics: urine Cl⁻ high while the drug acts, low after it wears off. |
| t04-39 | AIN: blood eosinophilia, sterile pyuria, WBC casts; urine eosinophils called a weak test (Q2 stem changed to match). |
| t04-47 | c10-salts: path stain (osmotic demyelination pathology) plus phys and bio stains. c10-acid: bio stain (ketogenesis, HMG-CoA) plus path stain (alcoholic ketoacidosis). |
| t04-49 | c9-restrict sarcoid stain pointing to Depth 2 (The Siege), plus a sarcoid hypercalcaemia question. |
| t02-19 | c9-flooded epigraph set to D06's wording. Coordinator's request confirmed against dev-D06.md. |
| t08-28 / t08 GFR idea | Left for D20. The headings "Carrying oxygen and carbon dioxide" (c9-exchange) and "Filtration" (c10-glom) are kept, with no fig, so figs7.js keyword attachment still finds them first. |
| 2.8(e) mnemonics | Removed "stones, bones, groans…", AEIOU, MUDPILES and COLA; replaced with plain original wording. No commercial mnemonics remain in my files. |
| Coordinator | c10-failure title changed to "The Silent Filters". |

## High-yield gaps filled (2.8 f)
- c9-airways: club cells, Poiseuille and M₃/β₂ tone, lung development stages table, CDH, pulmonary hypoplasia, TOF (stain and Q), dynamic compression and flow–volume loops, the CO₂-retainer oxygen mechanism, caffeine for apnoea of prematurity.
- c9-exchange: hypoxic vasoconstriction, West zones, a new section on diffusion and DLCO (table), A–a worked example, hypoxia types, O₂–Hb curve shifts with P50, HbF and myoglobin, 2,3-BPG biochemistry, PH groups and current PAH drugs (riociguat, macitentan, selexipag), Virchow's triad, VTE in cancer and pregnancy, and new questions on curve shift and methaemoglobin.
- c9-obstruct: severe-attack signs and pulsus paradoxus, α₁AT genetics and liver pathology, cor pulmonale, ABPA treatment, PCD/Kartagener (Q), CF microbiology by age, how CFTR modulators work, and a rising-PaCO₂ question.
- c9-restrict: ILD table (IPF, HP, sarcoid, drugs, CTD, COP, Langerhans), anti-fibrotic mechanisms, mesothelioma IHC, neuromuscular and chest-wall restriction.
- c9-flooded: organism clues (Legionella, Mycoplasma, Klebsiella, PCP, psittacosis, Q fever), lung abscess, TB immunology (Th1, IFN-γ, TNF), IGRA vs TST, TB drug mechanisms and acetylator stain, ARDS severity, expanded lung cancer prose (hamartoma, EGFR, ALK, KRAS G12C, PD-L1), carcinoid outside the portal system, and a new "The pleura" section (Light's criteria, empyema, chylothorax, pneumothorax types, a physical-signs table). New Legionella and transudate questions.
- c10-glom: autoregulation and TGF, clearance logic, lupus classes, ANCA (PR3/MPO), thin basement membrane disease, C3 glomerulopathy, "Where the deposits sit" table, diabetic hyperfiltration, a PSGN micro stain, and a renal vein thrombosis question.
- c10-tubule: transport maximum and splay, angiotensin II and contraction alkalosis, ammoniagenesis, SGLT2 inhibitors (pharm stain and Q), carbonic anhydrase bio stain, AVP-deficiency/resistance naming, free water clearance, hormone table, and a water-deprivation question.
- c10-salts: hypernatraemia, a hyperkalaemia emergency stain and Q, ECG physiology of K⁺, ANP mechanism, aldosterone escape, sacubitril, a RAAS bio stain, and a dual-control ADH stain.
- c10-acid: albumin-corrected gap, delta ratio, osmolar gap, urine anion gap, RTA treatment, toxic alcohol and salicylate section with table (incl. isopropanol), and new ethylene glycol and salicylate mixed-disorder questions.
- c10-failure: FEurea, hepatorenal, ATN phases and vulnerable segments, papillary necrosis, a nephrotoxin stain, CKD definition and staging, tertiary HPT, FGF23 bio stain, stones table with crystals, angiomyolipoma, oncocytoma, chronic pyelonephritis, sterile pyuria, and new rhabdomyolysis and RCC questions.

## Not done
- t02-34 ("AT THE BEDSIDE" Host vignettes): not done. It would put Host/ward details into chapter text, which risks the spoiler rule (2.11). That belongs to D06/story.js if wanted.

## Requests for other owners
- depths.js (D06 / coordinator): stratum `failure` in depth 10 → `name:'The Silent Filters'`, to match the new BOOK title (the coordinator said they will do this).
- D20 (figs7.js): attach the O₂–Hb figure to c9-exchange with `/carrying/i` (heading "Carrying oxygen and carbon dioxide"). Attach the GFR figure to c10-glom with `/^Filtration$/` or `/arterioles/i` ("Arterioles, plasma flow and filtration fraction"). Neither has a fig.
- D05 (app-dive.js): new questions are appended (indices 5–6), and the existing indices 0–4 keep their stems. Options within those questions moved, so a miss recorded earlier with an option index will now show a different option text. Logging the chosen option text in the miss doc would make the Hull robust.
- D18 (links.js): no change needed. links.js prepends concepts that are already in my chapter `c` arrays, and the merge de-duplicates them.

## New files
None.
