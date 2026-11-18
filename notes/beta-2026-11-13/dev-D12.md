# dev-D12 — content, depths 11–12 (book11.js, book12.js)

Files edited: `/home/claude/citron/book11.js`, `/home/claude/citron/book12.js` only. No new files, no script tags needed. Chapter ids unchanged.

## Verification
- `node --check` passes for both files.
- `vbook.js /home/claude/citron` reports OK. Its only warnings are story triggers for the new D15/D16 chapters, which do not exist yet.
- `s7.js 16` (full descent) run on a private copy at beta/work-D12/tree finished all 16 depths with no page errors (`ERRS []`, `noUndef true`).
- Phone renders checked: beta/shots/d12-c12-adr.png and beta/shots/d12-c11-gut.png.
- My audit script is scratchpad/d12chk.js:
  - 56 questions (was 45): 6–7 per chapter.
  - Answer keys spread 13/15/14/14 over indices 0–3 (was 41 of 45 on index 1).
  - In 0 of 56 questions is the correct option uniquely the longest.
  - Every question has `d`. Every `c` and every chapter `c` id exists in BANK.
  - Every explanation has 2–3 sentences: why the answer is right and why the most tempting distractor is wrong. No letters or positions are mentioned, so the shuffle is safe.
- Prose plus stain words: 1,505 → about 4,250 in book11, and 1,450 → about 4,280 in book12.

## Changes by finding
**Titles and names (mission, t02-12, t02-14)**
- c11-pancreas title is now "The Ferment Glands".
- c12-adr title is now "The Twin Crowns". Its epigraph is rewritten in t02-14's spirit, now with the androgen arm: "Two crowns on the kidneys. Their rims brew the slow hormones of salt, fuel and sex. Their cores scream adrenaline."
- The new c11-pancreas section "The gland and its juice" explains the new name: old anatomists called enzymes "ferments", and the juice is alkaline. This fixes the misleading "acid" idea.

**t04 (book11)**
- t04-01: keys rebalanced in source.
- t04-07: Trousseau sign → Trousseau syndrome (with its mechanism).
- t04-10: all explanations are now 2–3 sentences.
- t04-11: distractors are now length-matched.
- t04-12: most stems are now vignettes. About a third stay recall on purpose (enterokinase, the vitamin D form).
- t04-17: new section "Drugs of the forest floor" with a 12-row GI drug table. It covers antacids, bismuth, sucralfate, misoprostol, metoclopramide, ondansetron, aprepitant, loperamide, three laxative classes and orlistat, plus a REMEMBER box. There is also a misoprostol question.
- t04-23: MTTP abetalipoproteinaemia row.
- t04-40:
  - Hepatitis E can become chronic in the immunosuppressed.
  - NAFLD is renamed MASLD/MASH.
- t04-41: liver tumours (haemangioma, hepatic adenoma, angiosarcoma, metastases). These went into the new tumour table in c11-gicancer, next to HCC and cholangiocarcinoma, not into c11-liver. It is the same depth, and the table is more coherent there.
- t04-42: carcinoid wording fixed (bronchial and ovarian primaries can cause the syndrome without liver spread). The Q4 stem now says "ileal".
- t04-43: Zenker diverticulum, sliding and paraoesophageal hiatal hernia, Ménétrier disease, and left gastric artery bleeding are added, plus a Zenker question.
- t04-44: the terminal ileum sentence now separates calcium oxalate kidney stones from cholesterol gallstones.
- t04-47: the pyloric stenosis stain is retagged `path`. The old `micro` slot now holds a real H. pylori microbiology stain.
- t04-48: the IBD section's one-line intro is now two mechanism paragraphs.
- t04 idea 4:
  - hepatitis B serology table and REMEMBER box in c11-liver
  - jaundice pattern table (urine and stool) in the bilirubin section

**t05 (book12)**
- t05-01 and t05-02: keys rebalanced; correct options trimmed (for example "Ectopic ACTH").
- t05-03: the CRH test is corrected, with a REMEMBER box that walks through the ACTH/dexamethasone/CRH logic.
- t05-07: amiodarone can cause either hypothyroidism or thyrotoxicosis (types 1 and 2); lithium causes hypothyroidism.
- t05-08: the DI question is rewritten with water deprivation.
- t05-09: water deprivation table, a REMEMBER box, and an SIADH cross-reference to the Salt Ledgers. There is also a new SIADH question.
- t05-10:
  - new section "Reading the beacon" with the TSH/free T4 table (8 states)
  - Wolff-Chaikoff and Jod-Basedow
  - a euthyroid sick question
- t05-11: PTU causes ANCA vasculitis, propranolol blocks deiodinase, and radioiodine can worsen eye disease.
- t05-12: CAH table:
  - new "Cortisol / renin" column
  - for 11β and 17α, "aldosterone ↓ but DOC ↑"
  - a lead sentence: low cortisol, high ACTH and enlarged glands in every form
- t05-13: medical treatment of Cushing.
- t05-14: ACTH separates primary from secondary insufficiency.
- t05-15: drug table additions:
  - tirzepatide
  - meglitinides
  - pramlintide
  - GLP-1 contraindication with medullary thyroid cancer or MEN2 (plus a new question)
- t05-16: retinopathy is the leading cause of blindness "in working-age adults".
- t05-17: DKA mechanism and potassium paragraph, plus HHS.
- t05-18: maternal and paternal GNAS pair.
- t05 idea 3: the c12-ca vitamin D section is deepened (regulation, VDR, causes, osteomalacia mechanism) and has a new rickets-type table (nutritional, VDDR1, VDDR2, XLH with burosumab).

**2.8(e): copied mnemonics removed and replaced with original wording**
- "Salt, sugar, sex — the deeper you go, the sweeter it gets" is replaced by the crown bands: rim keeps the salt, middle keeps the fuel, inner band keeps the androgens.
- "stones, bones, groans, thrones, psychiatric overtones" is replaced by the clerks overspending in four places: kidneys, bones, gut, mind.
- "female, fertile, forty, fat" is replaced by a gallstone-type table.
- The "3 Ps" label is removed from the MEN1 row.
- "rule of 2s" is replaced by the plain Meckel facts.

**2.8(f): other high-yield gaps filled, in the chapter voice**
- **c11-gut**:
  - three-layer gut control prose and the incretin effect
  - ghrelin row
  - secretin stimulation note
  - D-xylose logic
  - bacterial overgrowth row
  - fat-soluble vitamin and B12 stain
  - achalasia vs scleroderma
  - Plummer-Vinson syndrome
  - Curling and Cushing ulcers
  - IBD serology and sulfasalazine/TPMT notes
  - microscopic colitis
  - hernia table (indirect, direct, femoral, Bochdalek)
  - necrotising enterocolitis
  - Heyde syndrome mechanism
- **c11-liver**:
  - zone 2 yellow fever
  - stellate cells and clotting factors
  - Budd-Chiari and Reye syndromes
  - UGT1A1/MRP2 detail
  - hepatitis D coinfection vs superinfection
  - virus families (micro stain)
  - HCV drug classes
  - portosystemic anastomoses
  - SAAG
  - hepatorenal and hepatopulmonary syndromes
  - SBP
  - α₁-antitrypsin PiZZ
  - Wilson question
- **c11-pancreas**:
  - embryology (annular pancreas, pancreas divisum)
  - CFTR and bicarbonate juice
  - revised Atlanta criteria (2 of 3)
  - fat necrosis histology
  - PanIN/IPMN, KRAS → CDKN2A/TP53/SMAD4
  - islet tumour details and pancreatic enzyme replacement
  - bile acid synthesis
  - biliary atresia (plus a question) and choledochal cyst
- **c11-gicancer**:
  - three carcinogenesis pathways explained
  - Peutz-Jeghers (STK11) and juvenile polyposis rows
  - mismatch repair stain
  - spread routes
  - chemotherapy mechanisms (5-FU, irinotecan/UGT1A1, oxaliplatin, anti-EGFR in RAS wild type, bevacizumab)
  - S. gallolyticus and C. septicum
  - Leser-Trélat sign
  - pellagra in carcinoid
  - tumour table: HCC, liver tumours, cholangiocarcinoma, MALT lymphoma, GIST
  - MSI/pembrolizumab question
- **c12-pit**:
  - acidophils and basophils
  - GH physiology
  - prolactin regulation
  - posterior pituitary row
  - Nelson syndrome and TSH-oma
  - apoplexy management
  - Kallmann syndrome
  - DI drugs and vaptans
- **c12-thy**:
  - embryology (thyroglossal duct cyst, lingual thyroid, C-cell origin)
  - teprotumumab
  - de Quervain vs painless thyroiditis by thyroglobulin
  - storm iodine timing
  - nodule work-up
  - radioiodine-avid vs medullary cancers
  - RET inhibitor
- **c12-adr**:
  - steroid synthesis logic (StAR, desmolase, three enzymes)
  - abiraterone
  - Addison eosinophilia and tertiary causes
  - new section "Too much salt hormone": aldosterone escape and a renin/aldosterone table (Conn, secondary, Liddle, AME/liquorice, CAH, ectopic ACTH)
  - paragangliomas and SDH
  - neuroblastoma detail
  - catecholamine metabolism stain
  - α-before-β question
- **c12-panc**:
  - proinsulin, PI3K/MAPK
  - glucagon mechanism and counter-regulation
  - MODY
  - gestational diabetes
  - hypoglycaemia unawareness and β-blocker masking
  - glucagon rescue
  - sulfonylurea overdose and octreotide
  - type 2 islet amyloid stain
- **c12-ca**:
  - calcium fractions and alkalosis
  - PTH mechanism (RANKL/OPG, intermittent vs continuous)
  - magnesium
  - vitamin D excess/granuloma row
  - hypercalcaemia treatment order (plus a question)
  - MEN genetics (menin as tumour suppressor vs RET gain of function)
  - MEN2A extras
  - exclude phaeochromocytoma before thyroidectomy

British spelling is used throughout my files (phaeochromocytoma, oesophagus, tumour). No emoji. Nothing in my files touches the story twist.

## Not done / limits
- Figures (t08: HPA axis tester for c12-adr, calcium ledger for c12-ca, fed/fasting switch for c12-panc, GI hormone map for c11-gut) belong to D20. My section headings that fit them: c12-adr "Cushing syndrome", c12-ca "Three hormones", c12-panc "Insulin and glucagon", c11-gut "Signals that run the gut".
- t05 idea 5 (10 questions per stratum) is capped by contract 2.8 at 5–7. I used 6–7.

## Requests for other owners
1. **D06, depths.js**: set the depth 11 stratum `pancreas` name to `'The Ferment Glands'` and the depth 12 stratum `adr` name to `'The Twin Crowns'` (already in your mission), so they match the BOOK titles.
2. **D06, story.js / D05**: my text names other strata by title: "the Twin Crowns" (in c12-pit), "the Salt Ledgers" (c12-pit), "the Acid Wells" (c12-panc), "the Labyrinth" (c11-gut). If any of these strata are renamed, tell me or the coordinator so the cross-references can be updated.
3. **D03, app-today.js**: please make Atlas search map phaeo/pheo and oesophag/esophag spellings to each other (book12 now uses "phaeochromocytoma").
4. **D18, bank9.js / links.js (optional)**: there are no BANK concepts for GI pharmacology, pancreatic cancer, liver tumours or Cushing work-up. If you add concepts such as `gi-drugs` or `pancreatic-cancer`, tell me and I will add them to the `c` fields of c11-gut Q6, c11-pancreas Q2 and c11-gicancer.
5. **D01, index.html**: the new 5-column CAH table (c12-adr) and the 5-column jaundice table (c11-liver) are the widest tables in my chapters. Please include them when you check the phone table layout.
