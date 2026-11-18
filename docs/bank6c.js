/* Bassiet content, part 6c: new sites for Renal, GI & liver, Endocrine, Neuro. Original wording. */
window.BANK = window.BANK || {C:[],E:[],CH:[],PT:[],CP:[]};
BANK.C.push(
{id:'gfr',n:'Glomerular filtration and clearance',s:'Renal',L:{
 phys:'GFR set by Starling forces across the glomerulus; inulin measures it, creatinine approximates it, PAH measures plasma flow. Afferent constriction (NSAIDs) lowers GFR; efferent constriction (angiotensin II) raises it.',
 pharm:'NSAIDs, ACE inhibitors and diuretics together can precipitate AKI.'}},
{id:'aki',n:'Acute kidney injury',s:'Renal',L:{
 path:'Prerenal (FENa < 1%, BUN/Cr > 20), acute tubular necrosis (muddy brown casts, FENa > 2%), interstitial nephritis (drugs, eosinophils, white cell casts), postrenal obstruction.',
 pharm:'Nephrotoxins: aminoglycosides, contrast, cisplatin, amphotericin, NSAIDs, vancomycin.',
 phys:'The thick ascending limb and proximal tubule in the outer medulla are most vulnerable to ischaemia.'}},
{id:'ckd',n:'Chronic kidney disease',s:'Renal',L:{
 path:'Diabetes and hypertension lead; anaemia (low EPO), renal osteodystrophy, acidosis, hyperkalaemia, uraemia (pericarditis, encephalopathy, bleeding).',
 phys:'Phosphate retention and low calcitriol drive secondary hyperparathyroidism.',
 pharm:'ACE inhibitors or ARBs and SGLT2 inhibitors slow progression; phosphate binders, calcitriol, cinacalcet, erythropoietin. Dialysis for AEIOU.'}},
{id:'stones',n:'Kidney stones',s:'Renal',L:{
 path:'Calcium oxalate (commonest; Crohn, ethylene glycol), calcium phosphate (distal RTA, hyperparathyroidism), struvite (Proteus urease, staghorn), uric acid (radiolucent, acidic urine), cystine (hexagonal).',
 pharm:'Fluids; thiazides for hypercalciuria; citrate; alkalinise urine for uric acid; allopurinol.'}},
{id:'rta',n:'Renal tubular acidosis',s:'Renal',L:{
 phys:'Type 1 distal (cannot acidify urine, pH > 5.5, low K⁺, stones), type 2 proximal (bicarbonate wasting, Fanconi), type 4 (low aldosterone or resistance, high K⁺).',
 pharm:'Acetazolamide mimics type 2; amphotericin causes type 1; ACE inhibitors, spironolactone and trimethoprim cause type 4 physiology.'}},
{id:'polycystic-kidney',n:'Polycystic kidney disease and renal tumours',s:'Renal',L:{
 path:'ADPKD (PKD1/2): large cystic kidneys, hypertension, berry aneurysms, liver cysts. ARPKD: infants, Potter sequence. Renal cell carcinoma (VHL, smoking; polycythaemia, left varicocele), Wilms tumour (children, WT1), urothelial carcinoma (smoking, painless haematuria).',
 pharm:'Tolvaptan slows ADPKD.'}},
{id:'liver-metabolic',n:'Haemochromatosis and Wilson disease',s:'GI & liver',L:{
 path:'Haemochromatosis (HFE, recessive): high saturation and ferritin, cirrhosis, diabetes, bronze skin, arthropathy, cardiomyopathy, HCC. Wilson (ATP7B): low caeruloplasmin, Kayser-Fleischer rings, basal ganglia and psychiatric signs.',
 phys:'Low hepcidin in haemochromatosis lets ferroportin export too much iron from the gut.',
 pharm:'Phlebotomy (deferoxamine if anaemic); penicillamine, trientine, zinc for Wilson.'}},
{id:'pancreatitis',n:'Pancreatitis',s:'GI & liver',L:{
 path:'Acute: gallstones and alcohol, also triglycerides, calcium, ERCP, drugs; lipase above 3×; fat necrosis with hypocalcaemia, pseudocyst, ARDS. Chronic: calcification, steatorrhoea, diabetes.',
 phys:'Trypsin activated too early digests the gland.',
 pharm:'Drug causes: azathioprine, valproate, thiazides, GLP-1 agonists, didanosine.'}},
{id:'gallstones',n:'Gallstones and biliary disease',s:'GI & liver',L:{
 path:'Cholesterol stones (female, obese, pregnancy, rapid weight loss), pigment stones (haemolysis, infection). Colic, cholecystitis (Murphy sign), choledocholithiasis, cholangitis (Charcot triad), gallstone ileus. PBC (anti-mitochondrial), PSC (UC, p-ANCA).',
 phys:'CCK contracts the gallbladder; bile salts are recycled from the terminal ileum.'}},
{id:'colorectal-cancer',n:'Colorectal polyps and cancer',s:'GI & liver',L:{
 path:'Adenoma-carcinoma sequence (APC → KRAS → TP53); microsatellite instability (Lynch, right-sided). FAP, Lynch, Peutz-Jeghers. Left tumours obstruct; right tumours bleed into anaemia.',
 micro:'S. gallolyticus bacteraemia calls for colonoscopy.',
 pharm:'FOLFOX; cetuximab only if RAS wild-type; checkpoint inhibitors for MSI-high.'}},
{id:'malabsorption',n:'Malabsorption and coeliac disease',s:'GI & liver',L:{
 path:'Coeliac (HLA-DQ2/DQ8, anti-tTG, villous atrophy, dermatitis herpetiformis, T-cell lymphoma), lactase deficiency, Whipple (PAS+ macrophages), pancreatic insufficiency, tropical sprue.',
 phys:'Iron in the duodenum, folate in the jejunum, B12 and bile salts in the terminal ileum.'}},
{id:'gi-hormones',n:'Gut hormones and acid',s:'GI & liver',L:{
 phys:'Gastrin (acid), CCK (gallbladder, enzymes), secretin (bicarbonate), GIP and GLP-1 (incretins), somatostatin (inhibits), motilin (migrating motor complex). Parietal cells: gastrin, histamine, ACh drive H⁺/K⁺-ATPase.',
 pharm:'PPIs, H₂ blockers, octreotide, erythromycin as a prokinetic, GLP-1 agonists.',
 path:'Zollinger-Ellison: gastrinoma, multiple ulcers, MEN1.'}},
{id:'pituitary',n:'Pituitary disorders',s:'Endocrine',L:{
 path:'Prolactinoma (galactorrhoea, amenorrhoea, bitemporal hemianopia), acromegaly (IGF-1, no GH suppression by glucose), Sheehan syndrome, apoplexy, craniopharyngioma. Central DI vs nephrogenic DI.',
 pharm:'Cabergoline, octreotide, pegvisomant, desmopressin; continuous GnRH agonists suppress the axis.',
 phys:'Dopamine tonically inhibits prolactin, so stalk damage raises prolactin.'}},
{id:'cushing',n:'Cushing syndrome',s:'Endocrine',L:{
 path:'Central obesity, striae, myopathy, hypertension, diabetes, osteoporosis. Causes: steroids, pituitary adenoma, ectopic ACTH (small cell), adrenal tumour.',
 phys:'Low ACTH: adrenal. High ACTH suppressing on high-dose dexamethasone: pituitary; not suppressing: ectopic.',
 pharm:'Ketoconazole, metyrapone, osilodrostat block synthesis; surgery is definitive.'}},
{id:'hyperaldosteronism',n:'Aldosterone excess and CAH',s:'Endocrine',L:{
 path:'Conn syndrome: hypertension, low K⁺, alkalosis, high aldosterone with low renin. Secondary: high renin too. CAH: 21-hydroxylase (salt wasting, virilisation, high 17-OH progesterone), 11β (hypertension), 17α (hypertension, no sex steroids).',
 pharm:'Spironolactone or eplerenone; hydrocortisone and fludrocortisone in CAH.'}},
{id:'diabetes-drugs',n:'Diabetes drugs',s:'Endocrine',L:{
 pharm:'Metformin (lactic acidosis, B12), sulfonylureas (hypoglycaemia), pioglitazone (fluid, fractures), GLP-1 agonists (weight loss, pancreatitis), DPP-4 inhibitors, SGLT2 inhibitors (genital infection, euglycaemic DKA, heart and kidney benefit), insulins.',
 phys:'β-cell: glucose → ATP → K-ATP closes → depolarisation → Ca²⁺ → insulin.'}},
{id:'hypoglycaemia',n:'Hypoglycaemia',s:'Endocrine',L:{
 path:'Insulinoma (high insulin and C-peptide), sulfonylurea (same, drug screen positive), injected insulin (low C-peptide), alcohol, adrenal insufficiency, liver failure, Von Gierke.',
 bio:'Alcohol\'s NADH blocks gluconeogenesis.'}},
{id:'men',n:'MEN syndromes',s:'Endocrine',L:{
 path:'MEN1: parathyroid, pituitary, pancreatic tumours. MEN2A: medullary thyroid, pheochromocytoma, parathyroid. MEN2B: medullary thyroid, pheochromocytoma, mucosal neuromas, marfanoid.',
 bio:'MEN1 gene (menin) is a tumour suppressor; RET is an activated receptor tyrosine kinase.',
 pharm:'Prophylactic thyroidectomy in RET carriers.'}},
{id:'thyroid-cancer',n:'Thyroid nodules and cancer',s:'Endocrine',L:{
 path:'Papillary (psammoma, Orphan Annie nuclei, radiation, lymph), follicular (capsular invasion, blood), medullary (calcitonin, amyloid, RET), anaplastic (TP53), lymphoma (Hashimoto).',
 phys:'A low TSH means a hot nodule, rarely malignant.'}},
{id:'stroke',n:'Stroke and intracranial bleeding',s:'Neuro',L:{
 path:'MCA (face and arm, aphasia or neglect), ACA (leg), PCA (hemianopia with macular sparing), lacunar, lateral medullary. Epidural (lucid interval), subdural (bridging veins), subarachnoid (berry aneurysm, vasospasm), intraparenchymal (hypertension, amyloid).',
 pharm:'Thrombolysis within 4.5 h, thrombectomy, nimodipine for vasospasm, antiplatelets, statins, anticoagulation for AF.',
 phys:'Neurons die within minutes; the penumbra can be saved.'}},
{id:'dementia',n:'Dementia',s:'Neuro',L:{
 path:'Alzheimer (β-amyloid plaques, tau tangles, APOE4, Down syndrome), vascular, Lewy body (hallucinations, parkinsonism, antipsychotic sensitivity), frontotemporal (personality), CJD (rapid with myoclonus), NPH.',
 pharm:'Donepezil, rivastigmine, galantamine; memantine; anti-amyloid antibodies.',
 bio:'APP on chromosome 21; presenilin mutations cause early onset.'}},
{id:'multiple-sclerosis',n:'Multiple sclerosis and demyelination',s:'Neuro',L:{
 path:'Young women; optic neuritis, internuclear ophthalmoplegia, Lhermitte, Uhthoff; periventricular plaques; oligoclonal bands. PML (JC virus), central pontine myelinolysis, leukodystrophies, Guillain-Barré (peripheral).',
 pharm:'Steroids for relapses; interferon-β, glatiramer, natalizumab (PML), ocrelizumab, fingolimod.'}},
{id:'spinal-cord',n:'Spinal tracts and cord lesions',s:'Neuro',L:{
 phys:'Dorsal columns cross in the medulla; spinothalamic crosses at once; corticospinal crosses at the pyramids. UMN: spastic, hyperreflexic, Babinski; LMN: flaccid, wasting, fasciculations.',
 path:'Brown-Séquard, syringomyelia, subacute combined degeneration (B12), tabes dorsalis, anterior spinal artery, ALS, SMA, cauda equina.'}},
{id:'epilepsy',n:'Seizures and headache',s:'Neuro',L:{
 path:'Focal and generalised seizures; absence (3-Hz spike-wave); status epilepticus. Migraine, cluster (with Horner), tension headache.',
 pharm:'Ethosuximide (absence), valproate (broad; teratogen), lamotrigine (SJS), carbamazepine (agranulocytosis, SIADH), phenytoin (gingival hyperplasia), levetiracetam; triptans; oxygen for cluster.'}},
{id:'mood-disorders',n:'Depression and bipolar disorder',s:'Neuro',L:{
 path:'Major depression (2 weeks, anhedonia), dysthymia, bipolar I (mania) and II (hypomania with depression).',
 pharm:'SSRIs, SNRIs, TCAs (overdose: wide QRS, bicarbonate), MAOIs (tyramine), bupropion, mirtazapine; lithium (thiazides raise levels), valproate, lamotrigine. Serotonin syndrome vs neuroleptic malignant syndrome.',
 phys:'Shorter REM latency and less slow-wave sleep in depression.'}},
{id:'psychosis',n:'Psychosis and antipsychotics',s:'Neuro',L:{
 path:'Schizophrenia over 6 months; schizophreniform 1–6 months; brief under 1 month. Exclude delirium, drugs, encephalitis (anti-NMDA receptor).',
 pharm:'Typicals (D₂: dystonia, akathisia, parkinsonism, tardive dyskinesia, NMS), atypicals (metabolic), clozapine (agranulocytosis; treatment-resistant).',
 phys:'Mesolimbic dopamine excess (positive symptoms); tuberoinfundibular block raises prolactin.'}},
{id:'sleep',n:'Sleep',s:'Neuro',L:{
 phys:'N2 spindles and K-complexes; N3 delta (sleepwalking, night terrors); REM (atonia, dreams). Suprachiasmatic nucleus and melatonin set the rhythm; night shifts misalign it.',
 path:'Narcolepsy (orexin loss, cataplexy), obstructive sleep apnoea, REM behaviour disorder (early synucleinopathy).',
 pharm:'Benzodiazepines and alcohol cut REM and N3; modafinil and sodium oxybate for narcolepsy.'}},
{id:'substance-use',n:'Substance use and withdrawal',s:'Neuro',L:{
 path:'Alcohol withdrawal: tremor 6–24 h, seizures 12–48 h, delirium tremens 48–96 h. Opioid withdrawal: dilated pupils, yawning, diarrhoea. Cocaine: MI, stroke.',
 pharm:'Benzodiazepines (alcohol), methadone and buprenorphine, naloxone, naltrexone, acamprosate, disulfiram, varenicline.',
 phys:'Drugs of abuse raise dopamine in the mesolimbic pathway.'}},
{id:'eye-ear',n:'Eye and ear',s:'Neuro',L:{
 phys:'Light reflex through CN II and III; bitemporal hemianopia at the chiasm; Meyer loop superior quadrantanopia. Cochlear base hears high pitches. Weber and Rinne separate conductive from sensorineural loss.',
 path:'Open- and angle-closure glaucoma, diabetic and hypertensive retinopathy, CRAO, macular degeneration, Horner syndrome, CN III palsy, BPPV, Ménière, vestibular schwannoma.',
 pharm:'Timolol, latanoprost, brimonidine, acetazolamide, pilocarpine; ototoxic drugs: aminoglycosides, loops, cisplatin.'}}
);
