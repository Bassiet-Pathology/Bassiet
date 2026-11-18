# dev-D10 — content, depths 7–8 (book7.js, book8a.js, book8b.js)

Files edited: /home/claude/citron/book7.js, book8a.js, book8b.js (nothing else). No new files, no new script tags, no new figure ids. Chapter ids unchanged. All existing `fig` attachments kept (anemia, coag, pvloop, cardap, mi); existing section headings kept word for word so figure attach-by-heading still works.

Checks: `node --check` passes on all three; `vbook.js` OK (live tree and private copy); full descent `s7.js 16` on a private copy (baseline + my three files) completes, every depth sealed, `ERRS []`. My own checker: beta/work-D10/qchk.js.

## Numbers
- Questions: 45 → 61 (6–7 per chapter). Answer keys over index 0/1/2/3: **14 / 16 / 17 / 14** (was 1 / 43 / 1 / 0).
- Key is the uniquely longest option in 16/61 (26%, chance level); key-length ranks 16/21/15/9.
- Every question has `d` and a valid `c` (all checked against BANK.C). Every explanation is 2–3 sentences: why the key is right and why the most tempting distractor is wrong.
- About 30 of the 45 old recall stems were rewritten as one- to three-step vignettes (t04-12).
- Prose words per chapter (paragraphs only, tables excluded): c7-red 310→828, c7-clot 210→470, c7-white 243→540, c7-onc 146→411, c8-nave 384→567, c8-bell 248→491, c8-valves 226→602, c8-vessels 290→772, c8-failing 342→750.

## Findings fixed (by ID)
- **t04-01** (my share): keys rebalanced in source as above.
- **t04-03** c7-red: "Thalassaemia trait" row replaced by a full α-thalassaemia row (1–4 gene deletions, cis vs trans, HbH β₄, Hb Barts γ₄, hydrops) and a β-thalassaemia minor row (↑HbA₂, Mentzer). New path stain on why surplus chains do the damage. New question on cis-deletion carriers and Hb Barts risk.
- **t04-04** c7-red: anaemia of chronic disease row (hepcidin/ferroportin, iron studies). New section **"Reading iron studies"** with a lab table (iron deficiency, chronic disease, thalassaemia trait, sideroblastic, haemochromatosis, pregnancy/OCP), REMEMBER box, and a phys stain on hepcidin and iron absorption (t04 idea 4, "lab ladders").
- **t04-05** c8-valves: murmur manoeuvre text corrected (hand grip softens AS and HOCM, louder regurgitant murmurs; Valsalva/standing reverse for HOCM and MVP). New section **"Manoeuvres at the bedside"** with a manoeuvre table (inspiration, squat/leg raise, hand grip, Valsalva/standing, amyl nitrite) and REMEMBER box; HOCM and ASD rows added to the murmur table; two manoeuvre questions.
- **t04-09** c8-nave: S4 row corrected (common in healthy older adults; abnormal if palpable or young; never in AF).
- **t04-10** all 61 explanations rewritten/expanded.
- **t04-11** distractors rebalanced for length and specificity (throw-aways such as "Undetectable always", "Pericardial effusion only", "No change" removed).
- **t04-12** vignette upgrade (see above).
- **t04-14** c8-vessels: antihypertensive table rebuilt as Drug / Mechanism / Prefer in / Signature adverse effects: thiazides, ACE inhibitors (cough, angioedema), ARBs, dihydropyridine and non-dihydropyridine CCBs, β-blockers, hydralazine, minoxidil, nitroprusside (cyanide), clonidine (rebound), methyldopa (Coombs+), spironolactone, α₁ blockers; mechanism-to-toxicity paragraph; pregnancy pharm stain. Minoxidil question added.
- **t04-15** c8-vessels: new section **"Reading the injury: markers and leads"** (troponin vs CK-MB kinetics, type 2 MI, ECG territories, posterior MI with V7–V9, RV infarct with V4R and no nitrates) with table and REMEMBER box; three new questions (RV infarct, reinfarction by CK-MB, posterior MI).
- **t04-19** c8-failing: Buerger moved to medium vessel with full description; cryoglobulinaemic vasculitis added to small vessel; ANCA types named (PR3/MPO); vessel-size REMEMBER box; Buerger question.
- **t04-25** c7-red: aplastic anaemia viruses corrected (parvovirus removed; it stays in the micro stain, now explained).
- **t04-30** c7-clot: andexanet limited to rivaroxaban/apixaban (+PCC); fondaparinux row added. DOAC reversal question.
- **t04-31** c7-clot: Bernard-Soulier (large platelets, mild thrombocytopenia, ristocetin not corrected by normal plasma) and TTP (caplacizumab, rituximab) completed; ristocetin/mixing-study prose; Bernard-Soulier question.
- **t04-34** c8-vessels: hypertensive emergency wording (ceiling of 25% MAP in the first hour; dissection exception).
- **t04-35** c8-vessels: three forms of arteriosclerosis in prose plus Mönckeberg path stain.
- **t04-36** c8-bell: class III torsades risk differentiated (amiodarone rarely; sotalol, dofetilide, ibutilide highest). Acquired long-QT paragraph; torsades/magnesium question.
- **t04-45** c7-onc: raloxifene VTE and hot flushes; tamoxifen hot flushes; fulvestrant, degarelix, abiraterone+prednisone, leuprolide flare.
- **t04-47** (my share): c7-onc stain retagged `path` (now hypercalcaemia of malignancy / paraneoplastic content, so it no longer repeats the prose), plus new `micro` (neutropenic fever organisms), `bio` (thymidylate synthase/leucovorin) and `pharm` (PARP synthetic lethality) stains.
- **t04-48** (my share): one-line intros replaced with mechanism prose in c8-bell "Antiarrhythmics", c8-failing "Cardiomyopathies and the pericardium" and "Shock", c8-vessels "Lipid drugs".
- **t02-24**: c8-valves epigraph rewritten ("One has rusted half shut; one swings loose and lets the tide fall back.").
- **t02-15**: c8-vessels title is now "The Coronary Tunnels", matching D06's new stratum name in depths.js.
- **2.8(e) mnemonics**: "NAACP" (eosinophilia) replaced by an original in-world mnemonic **WORMED**; "SAD" (aortic stenosis) removed; the five-T cyanotic lesions rephrased in original wording with embryology.

## High-yield gaps filled (2.8 f)
c7-red: iron absorption/hepcidin, B12 absorption pathway, nitrous oxide, orotic aciduria, Coombs-based approach to haemolysis, HMP shunt stain, PNH vaccination, sickle trait, Fanconi, Diamond-Blackfan. c7-clot: mixing study, lupus anticoagulant, haemophilia C, emicizumab, antiphospholipid syndrome, warfarin skin necrosis mechanism, clopidogrel CYP2C19, vitamin K cycle stain. c7-white: lineage markers, primary CNS lymphoma, NLPHL, oncogenic-virus stain, MGUS criteria, Waldenström MYD88, CALR/MPL, secondary polycythaemia, imatinib resistance stain, neutropenia/lymphopenia/monocytosis. c7-onc: ifosfamide, oxaliplatin, capecitabine/DPD, glucarpidase, checkpoint inhibitors and immune toxicities, CAR T and cytokine release, resistance stain. c8-nave: Laplace, concentric vs eccentric hypertrophy, MR/AR loops, orthostatic hypotension. c8-bell: use dependence, IB in ischaemic tissue, CAST, AVNRT row, new potassium binders, ivabradine phosphenes. c8-valves: endocarditis organisms (S. aureus commonest), immune vs embolic signs, rheumatic fever features and molecular mimicry, differential cyanosis in PDA-Eisenmenger, Williams syndrome. c8-vessels: bempedoic acid, inclisiran, Prinzmetal triggers, subendocardial vulnerability, aortic dissection A/B management, syphilitic aortitis. c8-failing: HFmrEF, high-output failure, neprilysin/bradykinin, mavacamten, ARVC, transthyretin amyloid/tafamidis, shock physiology and SvO₂, superantigen/toxic shock stain, GCA tocilizumab.

## Not done / left for others
- t02-34 "At the bedside" Host-data boxes: not added (story-adjacent; better owned by D06 if wanted).
- t08 figure ideas for my chapters (murmur/Wiggers simulator for c8-valves, cell-cycle chemo wheel for c7-onc, Starling/shock panel for c8-failing): figure owners' call.

## REQUESTS for other owners
- **D20 (figs7.js)**: if the new oxygen–haemoglobin figure goes in c7-red, attach it to the section with heading "Haemolysis" (it carries the O₂ curve stain); sections "Reading iron studies", "Manoeuvres at the bedside" (c8-valves) and "Reading the injury: markers and leads" (c8-vessels) have no fig and suit a murmur/manoeuvre simulator and an MI marker timeline respectively. Your figs4.js MI figure should match the book table: 0–4 h / 4–24 h / 1–3 d neutrophils / 3–14 d macrophages / 2 wk–2 mo scar.
- **D06 (depths.js)**: the new depth-10 stratum name "The Silent Tunnels" now repeats "Tunnels" with depth 8's "The Coronary Tunnels" (the noun clash t02-15 asked to remove); please pick another noun for one of them (my title follows depth 8's).
- **D01 (index.html)**: my new tables have 4–5 columns (c7-red "Reading iron studies", c8-valves "Manoeuvres at the bedside", c8-vessels antihypertensive table) — on a 390 px phone the last column is clipped without a scroll hint (t01-13). Also the missing `<meta charset="utf-8">` garbles ↑/↓ arrows locally (seen in my screenshot).
- **D18 (bank9.js, optional)**: Compare tables worth adding from this content: iron studies (5 conditions × iron/TIBC/ferritin/saturation) and murmur manoeuvres (manoeuvre × AS/HOCM/MR/MVP).
- **D05**: nothing required; all 61 questions carry `d` and `c` for logMiss.
