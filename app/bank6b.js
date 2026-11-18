/* Bassiet content, part 6b: new sites for MSK & skin, Repro, Cardio, Resp, Blood & cancer. Original wording. */
window.BANK = window.BANK || {C:[],E:[],CH:[],PT:[],CP:[]};
BANK.C.push(
{id:'osteoporosis',n:'Osteoporosis and bone turnover',s:'MSK & skin',L:{
 path:'Low bone mass with normal mineral; vertebral crush, hip and wrist fractures. DEXA T-score ≤ −2.5. Labs normal.',
 phys:'Osteoblasts express RANKL, which drives osteoclasts; osteoprotegerin blocks it. Oestrogen loss tips the balance to resorption.',
 pharm:'Bisphosphonates (oesophagitis, jaw osteonecrosis), denosumab (anti-RANKL), teriparatide (intermittent PTH), raloxifene, romosozumab.'}},
{id:'bone-disease',n:'Paget disease, osteomalacia and bone tumours',s:'MSK & skin',L:{
 path:'Paget: very high ALP, mosaic bone, hat size, osteosarcoma risk. Osteomalacia and rickets: low or low-normal Ca²⁺, low PO₄³⁻, high PTH and ALP. Osteosarcoma (metaphysis, Codman triangle), Ewing (diaphysis, onion skin, t(11;22)), giant cell tumour (epiphysis, soap bubble).',
 bio:'Vitamin D: skin D₃ → liver 25-OH → kidney 1,25-(OH)₂ (active).'}},
{id:'rheumatoid-arthritis',n:'Rheumatoid arthritis',s:'MSK & skin',L:{
 path:'Symmetric synovitis of MCP, PIP and wrists (DIP spared), morning stiffness over an hour, erosions, nodules, Felty syndrome, interstitial lung disease. Anti-CCP, RF, HLA-DR4.',
 pharm:'Methotrexate first-line; sulfasalazine, hydroxychloroquine, leflunomide; anti-TNF, tocilizumab, abatacept, rituximab, JAK inhibitors.',
 phys:'Pannus (inflamed synovium) erodes cartilage and bone through TNF and IL-6-driven osteoclasts.'}},
{id:'osteoarthritis',n:'Osteoarthritis',s:'MSK & skin',L:{
 path:'Wear of cartilage: pain worse with use, stiffness under 30 minutes, Heberden (DIP) and Bouchard (PIP) nodes, osteophytes, joint-space narrowing, subchondral sclerosis and cysts.',
 pharm:'Exercise and weight loss first; paracetamol, topical then oral NSAIDs, intra-articular steroids; joint replacement.'}},
{id:'spondyloarthritis',n:'Seronegative spondyloarthritis',s:'MSK & skin',L:{
 path:'HLA-B27: ankylosing spondylitis (sacroiliitis, bamboo spine, uveitis, aortic regurgitation), psoriatic arthritis (DIP, dactylitis, pencil-in-cup), reactive arthritis (after Chlamydia or enteric infection), IBD arthritis.',
 micro:'Reactive arthritis follows Chlamydia, Campylobacter, Shigella, Salmonella, Yersinia.',
 pharm:'NSAIDs, then anti-TNF or anti-IL-17.'}},
{id:'connective-tissue',n:'Scleroderma, Sjögren and myositis',s:'MSK & skin',L:{
 path:'Limited scleroderma (CREST, anti-centromere, pulmonary hypertension), diffuse (anti-Scl-70, lung fibrosis, renal crisis). Sjögren (anti-Ro/La, dry eyes and mouth, lymphoma). Dermatomyositis (anti-Mi-2, heliotrope rash, Gottron papules, hidden cancer) and polymyositis (endomysial CD8 cells); both carry anti-Jo-1 and a high CK.',
 pharm:'Scleroderma renal crisis: ACE inhibitor. Myositis: steroids.'}},
{id:'muscle-disease',n:'Muscle contraction and dystrophies',s:'MSK & skin',L:{
 phys:'DHP receptor opens ryanodine receptor; Ca²⁺ binds troponin C; ATP releases myosin. A band constant, I and H shrink.',
 path:'Duchenne (frameshift dystrophin, Gowers sign, calf pseudohypertrophy, cardiomyopathy), Becker (in-frame, milder), myotonic dystrophy (CTG).',
 pharm:'Malignant hyperthermia (RYR1): dantrolene. Succinylcholine: hyperkalaemia in burns and crush injury.'}},
{id:'rhabdomyolysis',n:'Rhabdomyolysis',s:'MSK & skin',L:{
 path:'Muscle breakdown: very high CK, myoglobinuria (blood on dipstick without red cells), hyperkalaemia, acute tubular necrosis.',
 pharm:'Statins (worse with fibrates and CYP3A4 inhibitors), cocaine, malignant hyperthermia; treat with large IV fluid volumes.'}},
{id:'blistering',n:'Blistering and inflammatory skin disease',s:'MSK & skin',L:{
 path:'Pemphigus vulgaris (desmoglein, flaccid, mouth, Nikolsky +), bullous pemphigoid (hemidesmosome, tense, older), dermatitis herpetiformis (IgA, coeliac), psoriasis (Th17, plaques, nail pitting), lichen planus (hepatitis C), SJS/TEN (drugs).',
 pharm:'SJS triggers: sulfonamides, lamotrigine, carbamazepine, phenytoin, allopurinol, nevirapine.'}},
{id:'skin-cancer',n:'Skin cancers',s:'MSK & skin',L:{
 path:'Basal cell (pearly, rolled edges, rarely spreads), squamous cell (actinic keratosis precursor, immunosuppression, Marjolin ulcer), melanoma (ABCDE, depth predicts prognosis, S-100, BRAF V600E), Kaposi (HHV-8).',
 bio:'UV makes pyrimidine dimers repaired by nucleotide excision; xeroderma pigmentosum fails this.',
 pharm:'Vemurafenib for BRAF melanoma, checkpoint inhibitors, vismodegib for advanced basal cell carcinoma.'}},
{id:'menstrual-cycle',n:'Menstrual cycle',s:'Repro',L:{
 phys:'FSH grows follicles; theca cells make androgens (LH), granulosa cells aromatise them (FSH). Sustained oestradiol triggers the LH surge; the corpus luteum makes progesterone for 14 days.',
 pharm:'Combined pill suppresses the surge; contraindicated in smokers over 35 and migraine with aura. Clomiphene and letrozole induce ovulation.',
 path:'Menopause: FSH rises as follicles run out; osteoporosis and cardiovascular risk follow.'}},
{id:'pcos',n:'Polycystic ovary syndrome',s:'Repro',L:{
 path:'Androgen excess, oligo-ovulation, polycystic ovaries; insulin resistance and obesity; raised endometrial cancer risk from unopposed oestrogen.',
 phys:'High LH:FSH ratio; theca cells overproduce androgens.',
 pharm:'Weight loss, combined pill, metformin, letrozole for fertility, spironolactone for hirsutism.'}},
{id:'pregnancy',n:'Pregnancy physiology',s:'Repro',L:{
 phys:'hCG keeps the corpus luteum alive until the placenta makes progesterone (8–10 weeks). Cardiac output, plasma volume, GFR and ventilation rise; clotting factors rise; hPL causes insulin resistance.',
 micro:'TORCH: Toxoplasma, other (syphilis, parvovirus, VZV, Zika), rubella, CMV, HSV.',
 pharm:'Avoid ACE inhibitors, warfarin, valproate, isotretinoin, tetracyclines; folic acid before conception.'}},
{id:'preeclampsia',n:'Pre-eclampsia and eclampsia',s:'Repro',L:{
 path:'New hypertension after 20 weeks with proteinuria or organ damage; abnormal spiral artery remodelling. HELLP: haemolysis, raised liver enzymes, low platelets.',
 pharm:'Magnesium sulfate prevents seizures (calcium gluconate reverses toxicity); labetalol, nifedipine, hydralazine; aspirin prevention; delivery cures.'}},
{id:'trophoblastic',n:'Molar pregnancy and choriocarcinoma',s:'Repro',L:{
 path:'Complete mole: 46,XX paternal, no fetus, very high hCG, snowstorm ultrasound. Partial: 69,XXY with fetal parts. Choriocarcinoma: hCG, blood spread to lungs.',
 phys:'Very high hCG shares the α subunit with TSH: hyperthyroidism and hyperemesis.',
 pharm:'Methotrexate for persistent trophoblastic disease and stable ectopic pregnancy.'}},
{id:'testis',n:'Testis and testicular tumours',s:'Repro',L:{
 phys:'Leydig cells make testosterone (LH); Sertoli cells nurse sperm and make inhibin B and anti-Müllerian hormone (FSH). 5α-reductase makes DHT.',
 path:'Seminoma (fried egg, radiosensitive), yolk sac (AFP, Schiller-Duval), choriocarcinoma (hCG), teratoma, embryonal; lymphoma in older men. Torsion: absent cremasteric reflex.',
 pharm:'Finasteride (5α-reductase), sildenafil (PDE-5; never with nitrates), leuprolide, flutamide.'}},
{id:'ovarian-tumours',n:'Ovarian tumours',s:'Repro',L:{
 path:'Serous carcinoma (psammoma, BRCA, CA-125), mucinous, endometrioid, dermoid teratoma (commonest in young women), dysgerminoma, granulosa cell (oestrogen, Call-Exner), Sertoli-Leydig (androgens), fibroma (Meigs), Krukenberg (signet ring metastasis).',
 phys:'Combined pill lowers ovarian cancer risk by suppressing ovulation.'}},
{id:'breast',n:'Breast disease',s:'Repro',L:{
 path:'Fibroadenoma (young, mobile), intraductal papilloma (bloody discharge), phyllodes, DCIS (microcalcification), invasive ductal (commonest), lobular (E-cadherin loss), inflammatory (peau d\'orange), Paget of the nipple.',
 pharm:'Tamoxifen (premenopausal; endometrial cancer, clots), aromatase inhibitors (postmenopausal; bone loss), trastuzumab for HER2 (cardiotoxic).',
 bio:'BRCA1/2, TP53 (Li-Fraumeni), PTEN (Cowden) raise risk.'}},
{id:'prostate',n:'Prostate',s:'Repro',L:{
 path:'BPH in the transition zone (DHT-driven, obstruction); adenocarcinoma in the peripheral zone (palpable, osteoblastic spine metastases, PSA, Gleason).',
 pharm:'Tamsulosin (α₁A), finasteride; for cancer leuprolide or degarelix, bicalutamide or enzalutamide, abiraterone (CYP17).'}},
{id:'cervix-uterus',n:'Cervical and endometrial cancer',s:'Repro',L:{
 path:'Cervical squamous carcinoma at the transformation zone from high-risk HPV; endometrial carcinoma type I (unopposed oestrogen: obesity, PCOS, tamoxifen, Lynch) and type II serous (TP53).',
 micro:'HPV 16 and 18: E6 degrades p53, E7 inactivates Rb. Vaccine prevents most.'}},
{id:'valve-disease',n:'Valve disease and murmurs',s:'Cardio',L:{
 phys:'Aortic stenosis: crescendo-decrescendo to the carotids; mitral regurgitation: holosystolic to the axilla; aortic regurgitation: early diastolic, wide pulse pressure; mitral stenosis: opening snap and rumble. Valsalva softens most murmurs except HOCM and MVP.',
 path:'Calcific aortic stenosis in the elderly or bicuspid valves; rheumatic heart disease (mitral) after strep pharyngitis; myxomatous prolapse.'}},
{id:'endocarditis',n:'Infective endocarditis',s:'Cardio',L:{
 micro:'S. aureus (acute, tricuspid in people who inject drugs), viridans strep (subacute, damaged valves, dental work), enterococci, S. epidermidis (prosthetic), S. gallolyticus (colon cancer), HACEK and Coxiella (culture-negative).',
 path:'Splinter haemorrhages, Janeway lesions, Osler nodes, Roth spots, glomerulonephritis, septic emboli. Libman-Sacks (lupus) and marantic (cancer) are sterile.',
 pharm:'Prophylaxis before dental work only for prosthetic valves, previous endocarditis and some congenital disease.'}},
{id:'congenital-heart',n:'Congenital heart disease',s:'Cardio',L:{
 path:'Left-to-right: VSD, ASD (fixed split S2), PDA (machine murmur); Eisenmenger reverses them. Right-to-left: truncus, transposition, tricuspid atresia, tetralogy (squatting), TAPVR. Coarctation: arm-leg gradient, rib notching (Turner).',
 pharm:'Indomethacin closes a PDA; alprostadil (PGE₁) keeps it open.'}},
{id:'cardiomyopathy',n:'Cardiomyopathies and pericardium',s:'Cardio',L:{
 path:'Dilated (alcohol, doxorubicin, myocarditis, peripartum), hypertrophic (sarcomere genes, sudden death in athletes), restrictive (amyloid, sarcoid, haemochromatosis). Pericarditis: pain relieved by sitting forward, diffuse ST elevation. Tamponade: Beck triad, pulsus paradoxus.',
 pharm:'HOCM: β-blockers, avoid vasodilators and dehydration. Pericarditis: NSAID plus colchicine.'}},
{id:'shock',n:'Shock',s:'Cardio',L:{
 phys:'Hypovolaemic and cardiogenic: high resistance, low output (wedge low vs high). Obstructive: tamponade, tension pneumothorax, PE. Distributive (septic): low resistance, high output early. Neurogenic: hypotension with bradycardia.',
 pharm:'Fluids, then noradrenaline in septic shock; dobutamine for low output.'}},
{id:'vasculitis',n:'Vasculitis',s:'Cardio',L:{
 path:'Large: giant cell arteritis (jaw claudication, blindness, steroids now), Takayasu. Medium: polyarteritis nodosa (hepatitis B), Kawasaki (coronary aneurysms). Small: GPA (c-ANCA), MPA and EGPA (p-ANCA), IgA vasculitis (palpable purpura), Buerger, Behçet.',
 pharm:'Kawasaki: IVIG and aspirin. GPA: steroids with rituximab or cyclophosphamide.'}},
{id:'lipids',n:'Lipoproteins and lipid drugs',s:'Cardio',L:{
 bio:'Chylomicrons carry dietary fat (ApoB-48), VLDL liver fat, LDL cholesterol to tissues (ApoB-100 binding the LDL receptor), HDL back to the liver. Familial hypercholesterolaemia: LDL receptor defect.',
 pharm:'Statins (HMG-CoA reductase), ezetimibe, PCSK9 inhibitors, fibrates (PPAR-α), niacin (flushing), bile acid sequestrants. Statin plus fibrate raises myopathy risk.'}},
{id:'asthma',n:'Asthma',s:'Resp',L:{
 path:'Reversible obstruction, Th2 inflammation, eosinophils, Curschmann spirals and Charcot-Leyden crystals.',
 pharm:'SABA for relief, inhaled steroid as controller, LABA only with a steroid, montelukast (aspirin-sensitive), anti-IgE, anti-IL-5, anti-IL-4R.',
 phys:'A normal or rising PaCO₂ in a severe attack means the patient is tiring.'}},
{id:'interstitial-lung',n:'Interstitial lung disease and pneumoconioses',s:'Resp',L:{
 path:'Idiopathic pulmonary fibrosis (honeycombing, bases), hypersensitivity pneumonitis, drugs (bleomycin, amiodarone, methotrexate, nitrofurantoin), coal and silica (upper lobes; silica raises TB risk), asbestos (lower lobes, plaques, mesothelioma), berylliosis (granulomas).',
 phys:'Restrictive pattern with low DLCO; hypoxaemia worsens on exercise.',
 pharm:'Pirfenidone, nintedanib for IPF.'}},
{id:'ards',n:'ARDS and pulmonary oedema',s:'Resp',L:{
 path:'Diffuse alveolar damage with hyaline membranes after sepsis, aspiration, trauma, pancreatitis, transfusion.',
 phys:'Bilateral infiltrates, PaO₂/FiO₂ ≤ 300, normal wedge pressure (unlike cardiogenic oedema). Shunt physiology.',
 pharm:'Low tidal volume ventilation, PEEP, prone positioning; treat the cause.'}},
{id:'pleura',n:'Pleural effusion and pneumothorax',s:'Resp',L:{
 phys:'Light criteria: exudate if protein ratio > 0.5 or LDH ratio > 0.6. Tension pneumothorax: tracheal shift away, hypotension.',
 path:'Transudates: heart failure, cirrhosis, nephrotic. Exudates: infection, cancer, PE. Primary spontaneous pneumothorax: tall thin young smokers.'}},
{id:'sickle-cell',n:'Sickle cell disease',s:'Blood & cancer',L:{
 bio:'Glutamate → valine at β6; HbS polymerises when deoxygenated.',
 path:'Vaso-occlusion (dactylitis, acute chest, stroke, priapism, avascular necrosis), autosplenectomy (encapsulated bacteria, Salmonella osteomyelitis), renal papillary necrosis, parvovirus aplastic crisis.',
 pharm:'Hydroxyurea raises HbF; vaccines, penicillin prophylaxis in children, transfusion, crizanlizumab.'}},
{id:'microcytic',n:'Iron deficiency and thalassaemia',s:'Blood & cancer',L:{
 path:'Iron deficiency: low ferritin, high TIBC, pencil cells; GI blood loss in older adults. Thalassaemia: normal iron, target cells, MCV very low for the haemoglobin. Lead: basophilic stippling. Sideroblastic: ring sideroblasts.',
 bio:'Haem synthesis: ALA synthase (B6) in mitochondria; lead blocks ALA dehydratase and ferrochelatase.',
 phys:'Hepcidin blocks ferroportin; it rises with inflammation (anaemia of chronic disease).'}},
{id:'platelets',n:'Platelet disorders and TTP',s:'Blood & cancer',L:{
 path:'ITP (anti-GpIIb/IIIa), TTP (ADAMTS13: fever, neuro signs, kidney, schistocytes), HUS (EHEC), Bernard-Soulier (GpIb), Glanzmann (GpIIb/IIIa), von Willebrand disease, HIT.',
 pharm:'Aspirin (COX-1), clopidogrel (P2Y12), abciximab (GpIIb/IIIa). TTP: plasma exchange, caplacizumab. HIT: stop heparin, argatroban.'}},
{id:'leukaemia',n:'Leukaemias',s:'Blood & cancer',L:{
 path:'ALL (children, TdT+), AML (Auer rods; APL t(15;17) with DIC), CLL (smudge cells, CD5+), CML (t(9;22), basophils), hairy cell (TRAP, BRAF).',
 pharm:'Imatinib (CML), all-trans retinoic acid and arsenic (APL), cladribine (hairy cell), venetoclax and ibrutinib (CLL). Tumour lysis: allopurinol or rasburicase.'}},
{id:'lymphoma',n:'Lymphomas',s:'Blood & cancer',L:{
 path:'Hodgkin (Reed-Sternberg CD15+ CD30+, contiguous spread, EBV). Non-Hodgkin: diffuse large B-cell, follicular t(14;18), Burkitt t(8;14) starry sky, mantle cell t(11;14), MALT (H. pylori), adult T-cell (HTLV-1), mycosis fungoides.',
 pharm:'R-CHOP for diffuse large B-cell; ABVD for Hodgkin (bleomycin lung, doxorubicin heart). H. pylori eradication can cure gastric MALT lymphoma.'}},
{id:'myeloma',n:'Plasma cell and myeloproliferative disorders',s:'Blood & cancer',L:{
 path:'Myeloma: CRAB (calcium, renal, anaemia, bone lytic lesions), M spike, rouleaux, Bence Jones, AL amyloid. MGUS. Waldenström (IgM, hyperviscosity). JAK2: polycythaemia vera (low EPO), essential thrombocythaemia, myelofibrosis (teardrop cells).',
 pharm:'Bortezomib (proteasome), lenalidomide, daratumumab (CD38) for myeloma; phlebotomy and hydroxyurea for polycythaemia vera.'}}
);
