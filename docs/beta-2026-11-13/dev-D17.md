# D17 handoff: Atlas/Practice content (bank1–bank5)

Files edited: /home/claude/citron/bank1.js, bank2.js, bank3.js, bank4.js, bank5.js. No new files and no script tags needed.
Backups of the files before my changes: beta/work-D17/orig/. Spelling converter: beta/work-D17/brit.py. Smoke test: beta/work-D17/d17.js.

All concept and item ids are unchanged (concept `anemia` keeps its US-spelled id; only its display name changed). Edges have no ids. I deleted two edges and turned five round; the pair set has no duplicates.

## Checks
- `node --check` passes on all five files. validate.js: content OK, 155 concepts, 290 edges, no isolated concepts.
- Private Playwright run: all 59 of my concept pages and all 46 of my practice items render with no `undefined`/`NaN` and no page errors.
- s7.js 16: full descent completes, every depth sealed, `noUndef true`, `ERRS []`.

## t06 findings fixed in my files
| ID | Fix |
|---|---|
| t06-01 | `ch_cholera` pearl now says pertussis toxin ADP-ribosylates Gi and switches the brake off, so cAMP also rises. The `g-proteins-toxins` bio lens says the same. |
| t06-04 | Both backwards edges are turned round: `g6pd → free-radicals` "makes the NADPH that defends against", and `hypersensitivity → nephritic-nephrotic` "types II and III damage glomeruli in". |
| t06-06 | `copd` is renamed "COPD and emphysema". The asthma sentence is gone from its path lens, and the pharm lens is now COPD-specific (LAMA/LABA, ICS, roflumilast, LTOT). |
| t06-07 | `potassium` is renamed "Potassium". All my K⁺ edges are rewritten (diabetes "loses the insulin-driven cell uptake of", RAAS "uses aldosterone to waste", acid-base "swaps H⁺ across cell membranes for", digoxin "becomes more toxic when the blood is low in"). |
| t06-08 | `collagen` EDS text corrected: classic is type V, vascular is type III, hypermobile has no known collagen gene. A collagen-types line is added. |
| t06-09 | `vq` phys lens: shunt does not correct with O₂ but low-V/Q units do; dead space wastes ventilation; A-a gradient logic added. |
| t06-10 | `ch_warfarin` pearl: protein C falls faster than II, IX and X; factor VII has the shortest half-life. |
| t06-14 | Methotrexate edge now reads "Chemotherapy… includes methotrexate, which blocks DHFR and starves dividing cells of the reduced folate described in Vitamin B12 and folate". |
| t06-15 | Every "X causes Y in <topic>" edge in bank3 is rewritten (#22, 25, 26, 36, 37, 51, 60, 61, 62, 68, 71, 72, 81). |
| t06-16 (#3) | Digoxin "gives symptom relief (no mortality benefit) in" Heart failure. |
| t06-17 (#80, #88) | Both edges deleted. |
| t06-19 | Chains made linear: `ch_nephrotic`, `ch_ethanol` and `ch_pth` follow the tester's sequences, with the parallel effects moved to the pearls. `ch_pku` step 5 is now "A low-phenylalanine diet with added tyrosine prevents the damage". `ch_hemorrhage` step 6 is marked "Over minutes to hours". |
| t06-20 | `pt_stand` (in bank5, not bank8) now asks: "Compare lying with 30 seconds after standing, once the reflexes have acted". |
| t06-21 | `pt_afterload` (bank5) is now "Acute rise in afterload" from a vasoconstrictor. A reflex heart-rate row is added, and the explanation says why chronic AS differs. |
| t06-28 | British spelling throughout bank1–5 (anaemia, haem, oedema, oesophageal, -ise, colour, grey, paediatric). British drug names to match the books (paracetamol, adrenaline, noradrenaline, salbutamol; rifampin kept as the books use it). Unicode ions and Greek letters to match the books (Na⁺, Ca²⁺, HCO₃⁻, PaO₂, β₁, α₁). Display names changed: "Anaemia and haem synthesis", "Haemostasis and anticoagulants", "Haemoglobin and oxygen delivery", "G proteins and diarrhoeal toxins". |
| t06-37 | Lenses deepened. About 45 new lenses were added across bank1 and bank2, and most existing lenses were expanded. Most concepts in my files now have 4–5 lenses. Only meaningful content was added, no filler. |
| t06-39 | True no-change Predict rows added: `pt_bleed` haematocrit, `pt_siadh` clinical volume status. Other new rows: altitude HCO₃⁻, loop Mg²⁺, thiazide urate, DI thirst, SIADH urate, vomiting urine Cl⁻, DKA osmolality, fast ketones, Addison renin. Explanations are updated to match. |
| t06-45 (partly) | Compare tables deepened: `cp_hepatitis` gains an HAV column (now "Hepatitis A, B and C"), `cp_glycogen` gains Cori, and the other tables gain rows (complement, lipids, thrombosis, serology, gross look, treatment, RDW, red cell count, class, key use, plasma K⁺, main use). |
| t06-52 | `na-k-atpase` → General. `glycogen-storage` and `cp_glycogen` → GI & liver. |

Also done:
- Every one of my 96 edges was read aloud as "From label To" and rewritten where it read badly.
- `acid-base` high-gap list reordered by mechanism, so it no longer spells out a commercial mnemonic.
- "Stones, bones, groans" replaced with plain wording.
- "Central pontine myelinolysis" → osmotic demyelination syndrome, with a correction-rate limit.
- `cp_cocci` "Beta/Alpha" → "β (clear)/α (green)".

Total: 20 t06 findings fixed or partly fixed in my files.

## Not mine or not done
- t06-02/03/05/11/12/13, t06-16 (other than #3), t06-18, t06-22 to t06-27: these live in bank6a/b/c, bank7 and bank8 (D18). Note that the tester's file labels for pt_stand and pt_afterload were wrong; both are in bank5 and are fixed.
- t06-43 (coverage of uncovered concepts) is D18's bank9 job. I added no new items, so nothing duplicates their work.

## Requests
- D03 (app-today.js): normalise Atlas search with `normalize('NFKD')` plus ae/oe folding. My names and lenses now use Unicode ions (Na⁺, Ca²⁺) and British spelling, so typing "na+", "anemia" or "hemostasis" only matches after that normalisation.
- D18 (bank7.js): bank7 edge sentences now render with my new names "COPD and emphysema" and "Potassium". Check that any bank7 label pointing at `copd` takes a plural verb ("cause"/"are").
- D04 (app-practice.js), optional: per-row Predict reasons (t06-53). I can supply third elements for my 15 scenarios if you add support.
