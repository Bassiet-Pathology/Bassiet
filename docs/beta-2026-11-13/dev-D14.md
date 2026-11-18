# dev-D14: content, depths 15–16 (book15.js, book16a.js, book16b.js)

Files edited: `/home/claude/citron/book15.js`, `book16a.js`, `book16b.js` only. No new files and no new script tags. Chapter ids and BOOK format are unchanged.

## Verification
- `node --check` passes on all three files.
- `vbook.js /home/claude/citron` reports OK. Its only notes are story triggers to `c1-metab`, `c5-drugs` and `c6-sleepers` (D15's strata, not yet in the tree).
- `s7.js 16` on a private copy (beta/work-D14/tree) completes all 16 depths and seals with no undefined/NaN text and `ERRS []`.
- Phone screenshots of c16-stroke (390 px): beta/shots/D14-stroke-phone.png and beta/shots/D14-stroke-phone2.png.

## Numbers
| | Before | After |
|---|---|---|
| Questions | 45 (5 per chapter) | 63 (7 per chapter) |
| Answer keys, index 0/1/2/3 | 2 / 37 / 6 / 0 | 18 / 17 / 14 / 14 |
| Correct option is the unique longest | — | 10 of 63 (about chance; checked for a reverse tell too) |
| Questions with `d` | 0 | 63 |
| Questions with `c` | 0 | 59 (no matching concept exists for GBS, radial nerve, gluteal nerve or pilocytic astrocytoma) |
| Explanations of 2–3 sentences (why right, why the tempting option is wrong) | 0 | 63 |
| Prose words | 2451 | about 8300 |
| Tables | 9 | 30 |
| REMEMBER keys | 1 | 10 |

Chapter-level `c` now leads with the specific Atlas site: mood-disorders, psychosis, sleep, substance-use, meningitis/excitability, spinal-cord, stroke, dementia, eye-ear. This helps D05's `logMiss` fallback (`chapter.c[0]`) and t01-26's depth-site list.

## Fixed, by finding
**Accuracy (t05)**
- t05-04: The lacunar supply is corrected. Pure motor is from the lenticulostriate branches of the MCA; pure sensory is from the thalamoperforating/thalamogeniculate branches of the PCA. There is a new territory table and a new question.
- t05-05: Delusional disorder now follows DSM-5-TR wording (the "non-bizarre" requirement is removed).
- Smaller notes: the self-contradicting spinothalamic sentence is rewritten (crosses within 1–2 segments, then ascends). Horner now notes that third-order lesions usually spare sweating.

**DSM-5-TR updates (t05-39, -42, -43, -45; mission)**
- MDD: 5 of 9 symptoms with a mood or anhedonia "gate".
- Mania: 3 of 7 (4 if the mood is only irritable).
- Schizophrenia: 2 of 5, with 1 month of active symptoms inside 6 months of illness.
- Persistent depressive disorder is 1 year in children. PMDD is added.
- Acute stress vs PTSD vs adjustment disorder, plus a full "time rule" table.
- Renamed: functional neurological symptom disorder, and factitious disorder imposed on self / on another. There is a new "made on purpose?" table.
- Prolonged grief: full criteria (12 months; 6 months in children). The bereavement exclusion is gone.
- Substance use disorder: 2 of 11 criteria with severity grades.

**Newer drugs (t05-40, -46, -53; mission)**
- Psychiatry: esketamine; dextromethorphan-bupropion; zuranolone and brexanolone; xanomeline-trospium; long-acting injectables; brexpiprazole and cariprazine.
- Sleep: dual orexin antagonists; pitolisant and solriamfetol.
- Dementia: donanemab and lecanemab with ARIA-E/H and the APOE ε4 risk; pimavanserin.
- Motor neuron disease: tofersen, risdiplam, onasemnogene.
- Headache: gepants, lasmiditan and CGRP antibodies.
- Bleeding: idarucizumab and andexanet.
- Eye: netarsudil and faricimab.
- Antiepileptic: lacosamide.

**Gaps filled inside existing chapters**
- t05-40: The peripartum spectrum (blues, depression with peripartum onset, psychosis). An NMDA antagonist row is added.
- t05-41: MAOI washout (2 weeks; 5 after fluoxetine). Lithium: hyperparathyroidism and monitoring. The atypical-antidepressant row's columns are fixed.
- t05-44: Ego defences are now defined, not just listed.
- t05-29: Lower-limb nerves (superior and inferior gluteal, femoral, obturator, tibial) and the musculocutaneous nerve. A reflex-root REMEMBER key.
- t05-49 (mission):
  - New section "The broken languages": an aphasia table covering fluency, comprehension and repetition for Broca, Wernicke, conduction, global, the three transcortical types and anomic.
  - New section "Where the damage is": a localisation table covering Klüver-Bucy, Gerstmann, neglect, frontal lobe, frontal eye field, PPRF, MLF, Parinaud, cerebellar hemisphere vs vermis, mammillary bodies, subthalamic nucleus, hippocampus and Anton.
- t05-48 (partial): Brainstem vascular syndromes are in the territory table (Weber, medial pontine, AICA, PICA/Wallenberg, medial medulla). The full cranial-nerve table belongs to D16's c16-nerves.
- t05-50: New section "The keepers of the inner rooms": hypothalamic nuclei, thalamic relays and the limbic/Papez system, with a table and a leptin/ghrelin stain.
- t05-51 (brief): A MAC and blood:gas solubility stain under the blood-brain barrier, cross-referenced to the Sleeping Draughts (D15).
- t05-52: The antiepileptic table now has a mechanism column. Added gabapentin/pregabalin, phenobarbital, benzodiazepines, lacosamide and vigabatrin. Phenytoin now lists SJS/DRESS, megaloblastic anaemia, osteomalacia and neuropathy.
- t05-54: WHO CNS5 tumour terms (GBM IDH-wildtype; oligodendroglioma IDH-mutant 1p/19q-codeleted). Tumours now have their own section and table, including diffuse midline glioma, haemangioblastoma and CNS lymphoma.
- t05-55: Osmotic demyelination syndrome, with the correction limit.
- t05-56: Huntington: HTT on chromosome 4, paternal anticipation, VMAT2 inhibitors.
- t05-57: New neuroembryology section "Where the tube closed", with a neural tube defect / Chiari / Dandy-Walker table.
- t05-58: Herniation key: uncal, subfalcine, central (Duret) and tonsillar.
- Also added:
  - MS: a DMT table and NMOSD.
  - Dementias: a comparison table, including the PDD vs DLB one-year rule.
  - Parkinson-plus syndromes.
  - Stroke: a timeline histology table, TIA, BP thresholds for lysis and DAPT.
  - Cord: conus vs cauda, spinal shock, autonomic dysreflexia, Friedreich, vitamin E and copper.
  - GBS variants and CIDP.
  - Eye: red eye, a pupil-syndrome table, a glaucoma table with a notes column.
  - Ear: a vertigo table and HINTS, plus ototoxic drugs.
  - Sleep: a sleep-stage table, insomnia/CBT-I, circadian disorders, RLS (gabapentinoids before dopamine agonists).
  - Psychosis: dopamine pathway table, catatonia, NMS vs serotonin syndrome vs malignant hyperthermia.
  - A personality-disorder table covering all 10 disorders.
  - Bipolar treatment.
  - Substances: barbiturates, GHB, MDMA, ketamine, inhalants and caffeine, with a "withdrawal that can kill" key.

**Mnemonics (2.8e).** Removed SIG E CAPS, DIG FAST, "wet, wobbly, wacky" and the "two i's" amide rule. They are replaced by original devices: "two gates and seven rooms" for depression, the "lamp past its rating" for mania, and "feet, then bladder, then mind" for NPH. Esters and amides are now taught by how they are metabolised.

**Answer keys and option tells (t05-01 book side, t05-02).** Keys are rebalanced and option lengths audited (see Numbers).

**Story / lore (t02)**
- t02-17, -18, -20, -24 (c16-degen): Epigraphs now use D06's exact wording, as the coordinator asked. That includes "Some voices here…" for c15-psychosis.

**Figures (t08-46).** `fig:'cord'` moved from "Three tracts" to "Cord lesions".

## Not done / out of scope
- t05-37 / t05-38 (eating disorders, child psychiatry): this is D16's new stratum c15-young. I added only a pointer ("…are in the Small Rooms") in c15-mood. I did **not** duplicate the content.
- t05-48: the cranial nerve table, Bell palsy and CN IX–XII are D16's c16-nerves. c16-stroke points to "the Twelve Wires".
- t05-47 (depth 15 `sys:'Psych'`) is in depths.js (D06). See the caution below.

## Requests to other owners
1. **D16 (bookx2.js):** Personality disorders are now fully covered in c15-psychosis (a table of all 10, plus ego defences), so c15-young does not need them. Aphasias, lesion localisation and the vascular brainstem syndromes (Weber, medial pons, AICA, PICA, medial medulla) are in c16-stroke. Please keep c16-nerves on cranial-nerve function and nuclei, Bell palsy (UMN vs LMN), trigeminal neuralgia, CN IX–XII lesions, the midbrain/pons/medulla rule and cavernous sinus, to avoid duplication. My text names your strata "the Small Rooms" and "the Twelve Wires", so please keep those names.
2. **D15 (bookx1.js):** c16-cells and c16-tracts point to "the Sleeping Draughts" for anaesthetics and NMJ blockers. Please keep that stratum name.
3. **D06 (depths.js), t05-47:** If depth 15 `sys` becomes `'Psych'`, note that BANK concepts use `'Neuro'` and validate.js has no `'Psych'` system. The depth page's "Sites in this region" filters by `c.s===d.sys` and would go empty, unless D05 applies t01-26 (build the list from the union of `BOOK[cid].c`). Change it only together with D05.
4. **D20 (figs7.js), optional:** t08's proposed `F.stroke` territory figure can attach to c16-stroke section 0 ("Arterial territories", no fig) with `/territor/i`. A lesion-localiser figure (t05 idea 4) can attach to "Where the damage is" (no fig) with `/damage/i`.
5. **D18 (bank9.js):** If you add concepts for cranial nerves, aphasia/localisation or brain tumours, tell the coordinator the ids. Questions in my files could then carry them as `c`. Today they fall back to existing ids.

## SPOILER-SENSITIVE (owner must not see)
- t05-S2: c15-subst "Exposure at work" keeps its original paragraph and its circadian-trough stain word for word. I added two things:
  - A paragraph on the impaired colleague (report through proper channels; physician health programmes). This is a Step 1 ethics hook.
  - A micro stain on the generic sharps-injury order: wash, report, test; HIV PEP within hours and no later than 72 h; HBV by vaccine response; HCV no prophylaxis.
- The Step 1 withdrawal hooks (barbiturates, benzodiazepines, GHB, lofexidine) are in the substance table and its REMEMBER key, so the stratum's test can draw on them. None of this names anyone or any date, and none of it hints at who the Host is. It only stays consistent with the unreported-needlestick thread.
- c15-sleep (03:17 epigraph, the "walled off" memory line) and c16-senses "The last window" (voices, a clock, a light) are unchanged in their story lines. Only the medicine around them was expanded.
