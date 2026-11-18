# dev-D07: content, Depths 1–2 (book1a.js, book1b.js, book2.js)

Files edited: /home/claude/citron/book1a.js, book1b.js, book2.js. No new files. No chapter ids renamed, BOOK format kept (one table per section, stains `[key,text]`, `fig` ids unchanged).
Verified: `node --check` on all three files; `vbook.js /home/claude/citron` gives OK (the only warnings are story triggers for c13-origins…c16-nerves, which belong to D16's bookx2.js that is not written yet); Playwright run (beta/work-D07/r.js) opened all 8 chapters at 390×844 with every stain on, answered every question by its key and saved, with no page errors.

## Summary by chapter
| Chapter | Qs | Keys (a) | Prose words before → after |
|---|---|---|---|
| c1-membrane | 6 | 3,1,0,2,0,1 | ~420 → 694 |
| c1-furnace | 6 | 3,1,0,2,1,3 | ~470 → 723 |
| c1-nucleus | 7 | 3,0,2,1,3,0,2 | ~470 → 862 |
| c1-unmaking | 6 | 3,1,0,2,2,3 | ~570 → 775 |
| c2-front | 6 | 2,0,2,3,1,3 | ~390 → 539 |
| c2-siege | 6 | 2,0,1,3,2,0 | ~350 → 422 |
| c2-scar | 6 | 1,3,2,0,3,1 | ~330 → 501 |
| c2-mutiny | 7 | 3,0,2,1,1,2,0 | ~330 → 547 |

The answer keys across all 50 questions are now spread 12/12/13/13 over indices 0–3. Before the change, 34 of the 40 keys were index 1. Every question has `d`. All but two have a `c` that exists in BANK: c1-membrane Q5 (desmin) and c2-mutiny Q5 (stage vs grade) have no matching concept. Every `x` is now 2–3 sentences saying why the answer is right and why the most tempting distractor is wrong. No explanation mentions option letters. I added 8 questions on the new content, one per chapter plus one extra in c1-nucleus and c2-mutiny.

## Fixed findings
- **t03-01 (my part, 2.2):** rebalanced the keys as above, and evened out the option lengths in c1-furnace Q2 (the uncoupler options are now parallel triplets).
- **t03-02 (High):** c1-nucleus "How the plans are packed" pharm stain now uses the corrected wording. Azacitidine and decitabine are DNA methyltransferase inhibitors used in MDS; vorinostat and romidepsin are HDAC inhibitors used in CTCL; hydroxyurea inhibits ribonucleotide reductase and raises HbF.
- **t03-03:** c1-furnace anaerobe micro stain. It now says metronidazole or clindamycin for Bacteroides and Clostridium, penicillin for Actinomyces, and that aminoglycosides need oxygen for uptake.
- **t03-04:** c2-siege granulomas are reclassified as caseating, non-caseating, necrotising (suppurative: cat-scratch, GPA, tularaemia, LGV) and foreign-body. Q5 now says "Necrotising granulomas… axillary node three weeks after a kitten scratch". I also added a granuloma pattern table and the Langhans vs foreign-body giant cell distinction.
- **t03-05:** c1-membrane micro stain now names C. perfringens enterotoxin and claudins, and C. difficile toxins A and B glucosylating Rho GTPases.
- **t03-07 (my part):** the "clean up on aisle 8" mnemonic (c2-front key) and "buy AT 30, CCEL at 50" (c1-nucleus micro) are replaced with plain original statements. No other commercial mnemonics remain in my files.
- **t03-10 (my part, coordinated with D15):** c1-furnace has a new section, "Running the fire backwards". It covers gluconeogenesis (the four bypass enzymes, substrates, why even-chain fatty acids cannot make glucose), fed/early-fast/prolonged-fast control with a table, and why muscle glycogen cannot release glucose. Stains cover ethanol metabolism (NADH excess), fomepizole/disulfiram/ALDH2 and von Gierke. I did NOT add the HMP shunt, urea cycle, fatty-acid oxidation, purines or lysosomal tables, because D15's c1-metab owns them.
- **t03-19:** c2-mutiny has 2 new sections. "Signals far from the tumour" has a 12-row paraneoplastic table (PTHrP, ACTH, ADH, EPO, IGF-2, LEMS, MG/thymoma, anti-Yo/Hu, anti-NMDA/teratoma, Trousseau, Leser-Trélat/acanthosis, dermatomyositis) plus a PTHrP physiology stain. "Reading the uniform: immunohistochemistry" has a 14-row marker table, including CK7/CK20, TTF-1, CD117/DOG1, calretinin/WT1 and CD1a/langerin. I also added the missing carcinogens (benzene, cyclophosphamide, aromatic amines, radon, DES, Clonorchis, S. haematobium, Merkel cell polyomavirus), a cachexia paragraph and a psammoma body stain. The oncogene table gained RET, KIT, JAK2, EGFR/ALK, WT1, PTEN, CDKN2A, SMAD4 and MEN1. New stains: checkpoint inhibitors, lytic vs blastic bone metastases, and Birbeck granules.
- **t03-20:** c1-unmaking has 2 new sections. "What gathers in tired cells" covers intracellular accumulations, with a table of fat, cholesterol, lipofuscin, haemosiderin, glycogen, Mallory-Denk and Russell bodies, plus a hyaline stain. "Proteins folded wrong: amyloid" covers β-pleated sheets, Congo red, organ effects and fat-pad biopsy, with a table of AL, AA, ATTR wild-type and hereditary, Aβ2M, Aβ and endocrine types, and a tafamidis/AL/AA treatment stain.
- **t03-21:** c2-scar has 2 new sections. "The rope itself: collagen" has a 6-step synthesis table, inside vs outside the cell, with OI, scurvy, EDS and Menkes at their steps. "Four ropes and their diseases" has a table of types I–V with OI, Stickler, vascular and classic EDS, Alport and Goodpasture, plus an Alport/Goodpasture stain.
- **t03-22:** c1-nucleus has a new "When the letters change" section, with a mutation table (silent, missense/sickle, nonsense, frameshift/DMD and Tay-Sachs, in-frame/Becker and ΔF508, splice-site/β⁺-thal) and a Becker vs Duchenne key. It also has a new "Shipping and sorting" section covering signal peptide, RER/Golgi, COPI/COPII, M6P, proteasome and peroxisome. Its table covers I-cell, Zellweger, X-ALD, Refsum, bortezomib/parkin, α₁AT Z and ΔF508, and LDL receptor/clathrin, with an α₁AT two-organ stain. The translation section now covers its three stages (peptidyl transferase is an RNA, fMet) and the features of the genetic code (wobble).
- **t03-34:** c1-membrane kidney phys stain rewritten (basolateral pump drives Na⁺ reabsorption; S3 and the TAL die first).
- **t03-35:** calciphylaxis stain: "about 60 to 70 mg²/dL²", calcific uraemic arteriolopathy with necrotic skin ulcers.
- **t03-36:** post-MI timeline in c2-scar: macrophages day 3–7 (rupture window), granulation tissue day 7–14, scar by about 2 months.
- **t03-40:** the β-hCG row now includes hydatidiform mole and non-seminomatous germ cell tumours. The AFP row now mentions non-seminomatous GCT. I added a calcitonin row and cholangiocarcinoma to CA 19-9.
- **t03-43:** the ethanol and insulin-glucagon concepts in c1-furnace now have content behind them (see t03-10 above).
- **t03-18 (my part):** all explanations rewritten (see above).
- **t01-18 / 2.3 (my part):** every question carries `d`, and `c` where a concept exists.

## Other accuracy and gap improvements (not tester-listed)
- c1-membrane: endocytosis/exocytosis (LDL receptor); ABC transporters (P-glycoprotein) in the transport table; CFTR stain; digoxin overdose with hyperkalaemia and Fab antidote; Goldman equation note; calcium gluconate, insulin and salbutamol in hyperkalaemia; lobular breast carcinoma and E-cadherin; a red-cell spectrin skeleton paragraph and hereditary spherocytosis stain; lamins/progeria row; situs inversus in about half of primary ciliary dyskinesia. New Q6 on hereditary spherocytosis.
- c1-furnace: TCA cycle as a biosynthetic hub (B12 at methylmalonyl-CoA mutase); glucokinase MODY stain; dimercaprol for arsenic; MERRF. New Q6 on alcohol-induced hypoglycaemia.
- c1-nucleus: proofreading exonuclease note; ATM wording corrected; Fanconi row widened; p16/CDKN2A stain. New Q6 (Duchenne vs Becker frame) and Q7 (I-cell).
- c1-unmaking: why brain liquefies (old wording on "glia" corrected); Councilman bodies credited to yellow fever; pyroptosis, necroptosis and ferroptosis stain; oxygen toxicity in neonates stain. New Q6 on AL amyloid.
- c2-front: NLRP3 inflammasome stain; mediator timing (why there is a late phase); hereditary angioedema stain; CGD prophylaxis stain; new section "What the blood count says" (left shift, demargination, leukaemoid reaction vs CML, a table of which white cell rises in what, steroid and eosinophil stain, pertussis/EBV lymphocytes stain); a link to Depth 4 sepsis. New Q6 on leukaemoid reaction vs CML.
- c2-siege: IL-12/IFN-γ receptor defect stain; sarcoidosis BAL CD4:CD8, Heerfordt syndrome, methotrexate, diagnosis of exclusion; hepatitis B screen before anti-TNF; AA stain cross-references the amyloid section in c1-unmaking. New Q6 on talc foreign-body granuloma.
- c2-scar: hypertrophic scar vs keloid wording made defensible; becaplermin and anti-VEGF healing stain; Marjolin ulcer; pirfenidone/nintedanib stain. New Q6 on Menkes disease.

## Not done
- t03-08 (table CSS on phones): index.html, D01.
- t03-45 (ischaemia caption grammar): figs.js, D19.
- The HMP shunt, urea cycle, fatty-acid oxidation, nucleotides and lysosomal storage parts of t03-10 belong to D15's c1-metab.

## Requests to other owners
- **D15 (bookx1.js, c1-metab):** c1-furnace now covers gluconeogenesis, fed/fasting control, ethanol NADH and a one-line von Gierke stain. c1-nucleus already covers I-cell disease, Zellweger, X-ALD and Refsum (trafficking angle). Please don't repeat these at length; cross-refer to "Depth 1, The Furnaces" and "The Nucleus Vault" if useful.
- **D18 (bank9.js), optional:** concepts for `paraneoplastic` (Paraneoplastic syndromes), `ihc-markers` (Tumour markers and immunohistochemistry) and `protein-trafficking` (Protein sorting, I-cell and peroxisomal disease) would give c2-mutiny Q5/Q6 and the c1-nucleus trafficking items a better Hull concept. If you create them, tell me or the coordinator; I have not referenced them, so nothing breaks either way.
- **D05:** nothing new. The questions follow 2.3 (`q.d`, `q.c`), and keys are no longer biased toward index 1.
- **Coordinator:** no new files and no script tags needed.
