# D18 handoff: Atlas content (bank6a, bank6b, bank6c, bank7, bank8, links.js, NEW bank9.js)

## New file and where it loads
- **bank9.js**: add `<script src="bank9.js"></script>` directly after `bank8.js` (before story.js). It only pushes into `window.BANK`.
- **links.js** now links chapters again on DOMContentLoaded and on `load` (exported as `window.applyChapterLinks`). bookx1/bookx2 may load before or after it. Putting them before links.js is still the cleanest order.
- sw.js (D02): add `bank9.js` to the precache list if FILES is not generated from the folder.

## t06 findings fixed in my files
| ID | Fix |
|---|---|
| t06-02 | `pt_lithium`: the wrong "urine concentrating ability: down" row is replaced by "Urine volume: down". New no-change row "Collecting duct response to ADH". New explanation says thiazides reduce polyuria in nephrogenic DI. |
| t06-03 | ckd → calcium-pth: "raises PTH and phosphate and lowers calcitriol and calcium, see" |
| t06-05 | `autoimmunity` renamed "Autoimmunity and lupus"; blistering link now reads "is often antibody-driven, a kind of" |
| t06-11 | testis → prostate: "sends testosterone, made into DHT by 5α-reductase, to" |
| t06-12 | hyperaldosteronism → raas: "escapes control of (renin low in Conn, high in secondary forms)" |
| t06-13 | transfusion → hypersensitivity: "include type II (haemolytic) and type I (allergic) forms of" |
| t06-16 (bank7 part) | #128 "is driven by"; #213 "disturb the first step of"; #282 "disturbs"; #294 deleted |
| t06-17 (bank7 part) | #178 deleted; #162 "raises the risk of endometrial carcinoma, see" |
| t06-18 | Duplicate links #216, #218 and #294 deleted |
| t06-15 pattern (bank7) | Full read-aloud pass on all 198 bank7 labels; about 70 relabelled for grammar and sense (plural agreement, "X causes Y in <topic>" wording, etc.) |
| t06-19 (bank8 part) | `ch_vdiary` made linear (PTH and feedback moved to the pearl). `ch_cushing` made linear (the dexamethasone test moved to the pearl; the steps now run through 11β-HSD2 overflow). |
| t06-22 | `cp_murmurs` "Main danger": each lesion now has its own answer |
| t06-23 | `cp_herpes` latency: HSV "Trigeminal (HSV-1) or sacral (HSV-2) ganglia", VZV "Any dorsal root or cranial nerve ganglion" |
| t06-24 | "—" cells removed: cardiomyopathy (dilated: avoid verapamil, diltiazem, NSAIDs), dementia (Alzheimer: anticholinergics; FTD: cholinesterase inhibitors give no benefit), lamotrigine liver enzymes "Little effect (oestrogen lowers its level)" |
| t06-25 | `cp_testis` spread fixed; `cp_leukaemia` CLL genetic clue is now del(13q)/TP53, with CD5/CD20 moved to the Cell row |
| t06-26 | connective-tissue: anti-Mi-2 for dermatomyositis, anti-Jo-1 for both; granuloma: cat scratch disease moved to necrotising, stellate |
| t06-27 | osteomalacia "Serum calcium (low or low-normal)"; cholestasis "Stool pigment (stercobilin)"; bone-disease lens corrected the same way |
| t06-39 | No-change predict rows went from 8 to 27 (new ones in pt_conn, pt_prolactin, pt_pregnancy, pt_asthma, pt_ironde, pt_myasthenia, pt_lithium, pt_zes, pt_cholestasis and most bank9 items) |
| t06-43 | 36 of 36 uncovered concepts now have practice items (validator: "uncovered: none"). Microbiology and pharmacology coverage are much higher. |
| D04 request | Every predict row in bank8 and bank9 (33 scenarios) has a third element with a one-line reason |

## bank9.js contents
- **31 new concepts.** All have 2–4 lenses and links; none is isolated:
  - Metabolism: fatty-acids, nucleotides, amino-acids
  - Antimicrobials: cell-wall-drugs, ribosome-drugs, dna-folate-drugs, antimicrobial-resistance, antivirals, antimycobacterials
  - Anaesthesia and analgesia: general-anaesthetics, local-anaesthetics, nmj-blockers, opioids, analgesics
  - Reproductive embryology: gametogenesis, sex-development
  - MSK: upper-limb, lower-limb, paediatric-ortho
  - Child psychiatry: adhd, autism, childhood-behaviour, eating-disorders, personality-disorders
  - Neuro: cranial-nerves, brainstem, cortical-syndromes, herniation
  - D07 request: paraneoplastic, ihc-markers, protein-trafficking
- **128 links.**
- **44 chains, 9 predict scenarios, 41 compare tables.** All chains are strictly linear, and compare tables have no "—" cells.
- **D10 request:** `cp_ironstudies` (iron deficiency, chronic disease, thalassaemia minor, sideroblastic) uses rows that cp_iron (bank5) does not, so it complements it rather than duplicating it. `cp_murmurmoves` covers Valsalva/standing, squatting, handgrip and amyl nitrite against HCM, MVP, AS and MR.

## links.js
- New chapters: c1-metab, c5-drugs, c6-sleepers, c13-origins, c14-frame, c15-young, c16-nerves.
- D08 request applied: c3-inherit = [genetic-disorders, lysosomal, glycogen-storage]; c3-repeat = [repeat-expansion, aneuploidy, muscle-disease].
- Extra sites appended at the end of existing chapters, so their main site does not change: c1-membrane +protein-trafficking, c2-mutiny +paraneoplastic +ihc-markers, c5-virus +antivirals, c15-psychosis +personality-disorders, c16-stroke +brainstem +herniation, c16-senses +cranial-nerves.

## Validation
- validate.js (with bank9 added) reports "content OK" and no isolated concepts: 186 concepts, 424 links, 101 chains, 49 predict, 79 compare.
- Every links.js concept id resolves, and every BOOK `c` id resolves, including bookx1 and bookx2.
- Private tree with bank9, bookx1 and bookx2 tags added: `s7.js 16` completes all 16 depths sealed, ERRS []. s9 (Atlas/Practice) shows 186 concepts, ERRS [].
- I re-read every link touching the renamed concepts copd, potassium and autoimmunity; all read correctly.

## Could not do / notes
- 192 of 1263 compare questions still have fewer than 3 distinct options. This is inherent to two-value rows (for example fluency or karyotype). The fix belongs to D04's distractor idea (t06-45).
- The validator's `US:` hits are only the concept id `anemia` (owned by D17), not text.

## Requests for other owners
- **Coordinator / D01 (index.html):** add `<script src="bank9.js"></script>` after bank8.js. Preferably put bookx1.js and bookx2.js before links.js.
- **D02 (sw.js):** precache bank9.js.
- **D02 / validate.js owner:** add "bank9" to the file list in scratchpad/validate.js. My copy is at beta/work-D18/validate9.js.
