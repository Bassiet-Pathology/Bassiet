# D13 handoff — book13.js, book14.js (Depths 13–14)

Files edited: /home/claude/citron/book13.js, /home/claude/citron/book14.js only. No new files, so no script tags are needed. Chapter ids, titles (= stratum names), `depth`, the figure refs (`cycle`, `sarc`) and the BOOK format are unchanged.

## Contract 2.8 work, all 8 chapters
- (b) **Answer keys rebalanced** (2.2): 56 questions, keys 0/1/2/3 = **14/14/14/14**. Before: 40 questions, 37 of them option 2. Every chapter uses at least 3 positions.
- **Option-length tell** (t05-02, t07-01): the correct option is uniquely the longest in 10/56 (18%, near the 25% chance rate). Before: about half. Distractors were lengthened or trimmed; no correct answer changed meaning.
- (c) **`d` on every question, `c` on 55/56**. All `c` ids exist in BANK; c13-gonad Q3 (sildenafil and nitrates) has no matching concept, so it has no `c`. Chapter `c` arrays now list the specific concepts first (e.g. c13-cycle `['menstrual-cycle','pcos','sex-hormones']`); links.js de-duplicates them.
- (d) **Every explanation is 2–3 sentences**: why the key is right, and why the most tempting distractor is wrong. Checked by script.
- (e) No commercial mnemonics were found or added. Only standard clinical terms are used: TORCH, CREST, ABCDE, and "tone, trauma, tissue and thrombin".
- (f) Depth: 5–7 questions per chapter (was 5). Prose went from about 3,300 to about 5,660 words. New sections:
  - c13-preg: "Early loss and the molar growths", "Late bleeding", "What crosses the placenta" (teratogen table)
  - c13-gonad: "The cervix, the uterus and the lower tract"
  - c13-breast: "Drugs against the ducts"
  - c14-muscle: "The dystrophies and myopathies"
  - c14-skin: "Inflammation of the wall", "Blisters and the cleavage plane"
- (g) `node --check` passes on both files. vbook.js reports OK (71 chapters). Its only warnings are "story trigger to unknown chapter" for the D15/D16 strata, which are not yet in the tree.

## Findings fixed (by ID)
- **t05-06** Accreta spectrum: accreta, increta and percreta defined correctly, with risk factors and outcome; a new Q7 tests it.
- **t05-20** First-trimester and quad screen, Edwards pattern, cell-free DNA; new Q6. Rh disease and anti-D also added.
- **t05-21** Vasa praevia. PPH drugs (carboprost, methylergonovine, misoprostol, tranexamic acid) with their contraindications. Sheehan syndrome. Uterine rupture.
- **t05-22** Folic acid: 0.4 mg, or 4–5 mg after a previous NTD or on valproate or carbamazepine.
- **t05-23**
  - Ovarian tumour table: serous cystadenoma (commonest benign), Brenner tumour and immature teratoma added.
  - CIN grading, lichen sclerosus vs lichen simplex chronicus, DES clear cell carcinoma, sarcoma botryoides, endometrial hyperplasia with atypia, leiomyosarcoma, endometritis.
  - Ovarian risk factors and protective factors, tubal origin of serous carcinoma, CA-125 for monitoring, infundibulopelvic ligament and torsion, ureter under the uterine artery.
- **t05-24** Leuprolide flare and cover, degarelix (no flare), abiraterone with prednisone; new Q6 on the flare.
- **t05-25** Drug table: tamoxifen (endometrium, VTE, CYP2D6), aromatase inhibitors (bone), trastuzumab (cardiotoxicity, echo monitoring), fulvestrant, CDK4/6 inhibitors, olaparib. New Q6 (tamoxifen) and Q7 (trastuzumab).
- **t05-26** Breast Q5 reworded to "without distant metastases". The REMEMBER key says the same.
- **t05-27** LCIS, medullary (BRCA1), mucinous and tubular types. Also lymph drainage, sentinel node, long thoracic and thoracodorsal nerve injury.
- **t05-30** Bisphosphonate mechanism and dosing advice; new Q6.
- **t05-31** Salmonella "characteristic, S. aureus still common", in both the stain and the Q4 explanation.
- **t05-32** Gout: "do not stop urate-lowering therapy during a flare; it can be started with cover for 3–6 months".
- **t05-33** Renal crisis: anti-RNA polymerase III, avoid high-dose steroids. Cross-link to the Overreaction (c4-hyper) for lupus and APS.
- **t05-34** Acne, rosacea, pityriasis rosea, verruca, actinic keratosis (now in the cancer text), erythema nodosum, contact dermatitis (type IV), urticaria, seborrhoeic dermatitis.
- **t05-35** Full blistering table: target, split level, immunofluorescence (fishnet vs linear vs granular IgA), Nikolsky. SSSS vs TEN cleavage. New Q6 (pemphigoid IF) and Q7 (SSSS split).
- **t05-36** Parkland formula plus the ATLS 2 mL/kg/%TBSA start, titrated to 0.5 mL/kg/h. Escharotomy, inhalation injury, Curling ulcer.
- **t05-S1** Needlestick: HBV 6–30% (HBeAg), HCV 0.2–2%, PEP timing, HBV action (HBIG plus vaccine; nothing for a vaccinated responder), HCV RNA at 3–6 weeks. The PEP question now uses t05-02's balanced options.
- **Small notes:** seminoma "hCG mildly raised in some; AFP never" (new germ cell tumour table). MG worsening drugs: aminoglycosides, fluoroquinolones, macrolides, magnesium, β-blockers. New MG Q6.
- **Epigraphs (t02-16, t02-22/S12, t02-24, plus the coordinator's message)**, using D06's exact wording:
  - c13-cycle: "In these cloisters…", with no "only wants up" and no "Pall has never troubled them".
  - c13-preg: "These cloisters were built to hold a second heartbeat…".
  - c14-joint: "Every hinge in the wall grinds: the old ones from wear…".
  - Also rewritten to drop the "Some X. Some Y." pattern: c13-gonad and c14-muscle.
  - No "vault" is left in book13.js. File header comments name the Sleeping Cloisters.
- **Other t05 "Top 5 #3" depth gains:**
  - c13-cycle: hormone and phase table, amenorrhoea FSH-pattern table, contraception detail, HRT risks and fezolinetant, PCOS mechanism and Rotterdam criteria, clomiphene vs letrozole, Asherman, hyperprolactinaemia.
  - c14-bone: osteocytes and sclerostin, growth plate, more rows in the lab matrix (renal osteodystrophy, hypoparathyroidism, vitamin D excess), osteomalacia and rickets detail, fibrous dysplasia / McCune-Albright, enchondroma, myeloma vs osteosarcoma, full osteoporosis drug stain (denosumab rebound, teriparatide cautions, romosozumab).
  - c14-joint: OA and RA mechanisms, synovial fluid table, CTD antibody table, enthesitis, more DMARD detail.
  - c14-muscle: skeletal / cardiac / smooth table, LEMS treatment (amifampridine), botulism vs tetanus, dystrophin mechanism, McArdle, mitochondrial myopathy, statin myopathy risks, CK-MB timing (consistent with t04-15).

## Spoiler handling (2.11)
The c14-skin epigraph and the section title "Wounds and the left hand" are unchanged. The needlestick paragraph is generic, correct medicine. It ends with an occupational-health line, "Report it, however small it seems: an exposure that is never reported can never be followed up." This fits the story without giving away any twist detail: no names, dates, ward or bed. No other lore was added.

## Not done in my files (owned elsewhere)
- t05-19 (reproductive embryology / gametogenesis / DSD) and t05-28 (MSK anatomy, paediatric orthopaedics) are the new strata c13-origins and c14-frame (D16). My text cross-refers to them by name: "read in the First Folds" (c13-gonad, Sertoli/AMH) and "read in the Frame" (c14-bone tumours pharm stain). If D16 renames those strata, the two phrases need updating.
- t08 honourable mention (hCG / hPL / oestriol / progesterone over gestation figure for c13-preg) is D20's call.

## Requests
- **D16 (bookx2.js):** keep the stratum names "The First Folds" and "The Frame", since book13/14 text cross-refers to them. Klinefelter is briefly mentioned in c13-gonad (testis) and c13-breast (gynaecomastia), so the DSD section can stay brief on it.
- **Coordinator / D06 (note only, no change requested from me):** t02-S12 asked that the Host's sex stay unstated. The c13-preg epigraph you specified ("These cloisters were built to hold a second heartbeat… the body that carries it") reads as if the Host has a uterus. I applied it as instructed. If that matters, my earlier neutral version was: "Plans for a second heartbeat, written in hormone and blood. The lamp reads what a pregnancy demands of a body, and the quiet ways it fails."

## Verification
On the live tree, s7.js 16 (copy at beta/work-D13/s7.js, screenshots kept there) completed: all 16 depths sealed, every duel won, `ERRS []`. vbook.js reports OK. The scripts beta/../d13stats.js, d13fix.js and d13fix2.js hold the key and length checks and the edits.

**Later check (after bookx1/bookx2 landed):** the stock vbook.js now crashes with `DEPTHS` undefined. It loads files alphabetically, so book*.js and then bookx*.js load before depths.js, and the `window.DEPTHS` setter hooks in bookx1.js and bookx2.js leave `DEPTHS` undefined after depths.js assigns it. Loading bookx1, bookx2 and then depths alone works, so it is an interaction with the full alphabetical set. A copy with browser order (depths, books, story) at beta/work-D13/vbook-order.js reports **78 chapters, OK**.
- **Request, D15 (bookx1.js) / D16 (bookx2.js):** make the two DEPTHS hooks chain correctly, so that a getter/setter installed by one file survives the other, and `window.DEPTHS` holds the array after depths.js assigns it, under alphabetical loading. Otherwise vbook.js and validate.js-style harnesses break. Index.html order is unaffected.
