/* Bassiet content, part 2: concepts (GI, Blood, Endocrine, Repro, Neuro, MSK, Immune, biochemistry). Original wording, British spelling. */
window.BANK = window.BANK || {C:[],E:[],CH:[],PT:[],CP:[]};
BANK.C.push(
{id:'ethanol',n:'Ethanol metabolism',s:'GI & liver',L:{
 bio:'Alcohol dehydrogenase then aldehyde dehydrogenase, both using NAD⁺; in heavy drinkers the microsomal system (CYP2E1) takes a larger share. The high NADH/NAD⁺ ratio diverts pyruvate to lactate and oxaloacetate to malate, blocks gluconeogenesis, and favours fat synthesis.',
 path:'Steatosis, then alcoholic hepatitis (Mallory-Denk bodies, neutrophils, AST:ALT above 2), then cirrhosis. Thiamine deficiency brings Wernicke encephalopathy and Korsakoff amnesia.',
 phys:'Fasting hypoglycaemia occurs because the liver cannot make glucose when NADH is high and glycogen is used up.',
 pharm:'Disulfiram blocks aldehyde dehydrogenase, so acetaldehyde builds up. Metronidazole can give a similar reaction. Fomepizole blocks alcohol dehydrogenase in methanol and ethylene glycol poisoning. Chronic drinking induces CYP2E1 (more paracetamol toxicity); an acute binge slows warfarin metabolism and raises the INR. Withdrawal: benzodiazepines.',
 micro:'Heavy drinkers aspirate mouth anaerobes and get Klebsiella pneumonia; once cirrhosis brings ascites, spontaneous bacterial peritonitis follows.'}},
{id:'cirrhosis',n:'Cirrhosis and portal hypertension',s:'GI & liver',L:{
 path:'Fibrosis with regenerative nodules; stellate (Ito) cells lay down the collagen. Portal hypertension: ascites, oesophageal varices, caput medusae, splenomegaly. Hepatorenal syndrome, hepatic encephalopathy and hepatocellular carcinoma follow.',
 phys:'Low albumin lowers oncotic pressure. Portal pressure drives ascites; a serum-ascites albumin gradient of 1.1 g/dL or more points to portal hypertension. Shunting sends gut ammonia past the liver.',
 bio:'The failing liver cannot run the urea cycle, so ammonia rises. Clotting factors fall (prolonged PT), and so do proteins C and S, so clotting is rebalanced rather than simply impaired.',
 pharm:'Lactulose traps NH₃ as NH₄⁺ in the colon. Rifaximin reduces gut bacteria. Non-selective β-blockers (propranolol, carvedilol) for varices. Spironolactone with furosemide for ascites. Avoid NSAIDs and sedatives.',
 micro:'HBV, HCV and HDV are the main infectious causes. Spontaneous bacterial peritonitis is usually E. coli or Klebsiella and is diagnosed by ascitic neutrophils above 250 per mm³.'}},
{id:'viral-hepatitis',n:'Viral hepatitis',s:'GI & liver',L:{
 micro:'HAV and HEV: faecal-oral, no chronic state (HEV is dangerous in pregnancy). HBV: DNA virus with reverse transcriptase. HCV: RNA flavivirus, chronic in most. HDV is a defective RNA virus that borrows HBsAg for its coat; superinfection of an HBV carrier is the worst combination.',
 path:'Ground-glass hepatocytes in chronic HBV. Councilman (acidophil) bodies are apoptotic hepatocytes in acute hepatitis. Both HBV and HCV lead to cirrhosis and hepatocellular carcinoma; HBV can do so without cirrhosis because it integrates into the genome.',
 pharm:'HBV: tenofovir or entecavir. HCV: direct-acting antivirals such as sofosbuvir (NS5B polymerase), ledipasvir or velpatasvir (NS5A) and glecaprevir (NS3/4A protease) cure most patients.',
 bio:'HBV serology: HBsAg is infection, anti-HBs is immunity, IgM anti-HBc covers the window period, HBeAg marks high replication. Vaccinated people have anti-HBs alone.'}},
{id:'bilirubin',n:'Bilirubin and jaundice',s:'GI & liver',L:{
 bio:'Haem becomes biliverdin and then unconjugated bilirubin, carried on albumin. The liver conjugates it with UDP-glucuronyltransferase. Gut bacteria convert it to urobilinogen.',
 path:'Haemolysis: unconjugated rise. Gilbert and Crigler-Najjar: UGT1A1 defects. Dubin-Johnson (black liver) and Rotor: conjugated rise. Obstruction: pale stools, dark urine, high ALP and GGT.',
 phys:'Neonates have immature conjugation, so physiological jaundice peaks around day 3 to 5. Very high unconjugated levels cross into the brain (kernicterus). Jaundice in the first 24 hours is never physiological.',
 pharm:'Phototherapy isomerises bilirubin so it can be excreted without conjugation. Ceftriaxone and sulfonamides can displace bilirubin from albumin in newborns. Phenobarbital induces UGT and lowers bilirubin in Crigler-Najjar type II.',
 micro:'Neonatal sepsis, congenital infections and urinary infection can all present as jaundice in the newborn. Ascending cholangitis (gram-negatives such as E. coli) brings fever, jaundice and right upper quadrant pain together.'}},
{id:'peptic-ulcer',n:'Gastric acid and peptic ulcer',s:'GI & liver',L:{
 phys:'Parietal cells are stimulated by ACh (M3), gastrin (CCK-B) and histamine (H2). Prostaglandin E2 protects the mucosa with mucus, bicarbonate and blood flow. NSAIDs reduce prostaglandins. Somatostatin brakes acid.',
 micro:'H. pylori: curved gram-negative rod, urease positive (urea breath test, stool antigen). Linked to duodenal ulcer, gastric adenocarcinoma and MALT lymphoma.',
 pharm:'PPIs irreversibly block H⁺/K⁺-ATPase (long-term: low Mg²⁺, B12 deficiency, C. difficile, fractures). H2 blockers (cimetidine inhibits CYP450 and is anti-androgenic). Misoprostol replaces prostaglandin. Sucralfate coats the ulcer base. H. pylori: PPI with clarithromycin and amoxicillin, or bismuth quadruple therapy where clarithromycin resistance is common.',
 path:'Duodenal ulcers hurt less after meals and are rarely malignant. Gastric ulcers can be malignant, so biopsy them. Complications: bleeding (a posterior duodenal ulcer erodes the gastroduodenal artery), perforation, outlet obstruction. Zollinger-Ellison: gastrin-secreting tumour.',
 bio:'The H⁺/K⁺-ATPase swaps luminal K⁺ for H⁺. Carbonic anhydrase supplies the H⁺ and sends HCO₃⁻ into the blood, the alkaline tide after a meal.'}},
{id:'ibd',n:'Inflammatory bowel disease',s:'GI & liver',L:{
 path:'Crohn: skip lesions, transmural, granulomas, cobblestoning, fistulas and strictures. Ulcerative colitis: continuous from rectum, mucosal, crypt abscesses, pseudopolyps, toxic megacolon, higher cancer risk, primary sclerosing cholangitis.',
 bio:'The terminal ileum absorbs B12 and recycles bile salts. Crohn there causes B12 deficiency, steatorrhoea, gallstones and oxalate kidney stones (free fatty acids bind calcium, so oxalate is absorbed).',
 pharm:'Mesalamine, steroids, azathioprine, anti-TNF antibodies (infliximab, adalimumab), gut-selective vedolizumab (anti-α4β7 integrin). Colectomy cures ulcerative colitis but not Crohn.',
 micro:'C. difficile infection can mimic or worsen a flare; CMV colitis complicates steroid-refractory colitis. Screen for TB and hepatitis B before anti-TNF therapy.',
 phys:'Bile salts that escape a diseased or resected ileum reach the colon and cause a secretory (bile acid) diarrhoea that responds to cholestyramine.'}},
{id:'g-proteins-toxins',n:'G proteins and diarrhoeal toxins',s:'GI & liver',L:{
 bio:'Gs raises cAMP through adenylyl cyclase and activates PKA. Gi lowers cAMP. Gq raises IP3 and Ca²⁺ through phospholipase C. Cholera toxin locks Gs on. Pertussis toxin locks Gi off, so cAMP rises in that case too.',
 micro:'V. cholerae: comma-shaped, oxidase positive, rice-water stool. ETEC heat-labile toxin acts like cholera toxin; its heat-stable toxin raises cGMP instead. C. difficile toxins A and B glucosylate Rho and cause pseudomembranous colitis after antibiotics.',
 phys:'PKA opens CFTR, so Cl⁻ and water flood the lumen. Oral rehydration works because SGLT1 still couples Na⁺ to glucose uptake.',
 pharm:'Cholera: fluids first, then doxycycline or azithromycin. C. difficile: oral vancomycin or fidaxomicin; stop the culprit antibiotic. Faecal transplant for recurrences.',
 path:'Pseudomembranous colitis shows yellow-white plaques of fibrin, mucus and neutrophils erupting from crypts like small volcanoes; severe disease causes toxic megacolon.'}},
{id:'cystic-fibrosis',n:'Cystic fibrosis',s:'Resp',L:{
 bio:'Autosomal recessive. CFTR chloride channel on chromosome 7. The commonest allele (ΔF508) is a misfolded protein that is destroyed before reaching the membrane.',
 path:'Thick secretions: bronchiectasis, pancreatic insufficiency, meconium ileus, absent vas deferens. Sweat chloride is high (60 mmol/L or more). Fat-soluble vitamins (A, D, E, K) are poorly absorbed.',
 micro:'Airway pathogens: S. aureus early, Pseudomonas (mucoid) later, Burkholderia cepacia complex.',
 phys:'Without CFTR, Cl⁻ and water stay in the airway cell and mucus dehydrates. Sweat ducts cannot reabsorb Cl⁻, so sweat is salty.',
 pharm:'CFTR modulators: ivacaftor (potentiator), plus correctors such as elexacaftor and tezacaftor. Dornase alfa thins sputum DNA. Inhaled tobramycin for Pseudomonas. Pancreatic enzyme replacement.'}},
{id:'ammonia',n:'Ammonia and the urea cycle',s:'GI & liver',L:{
 bio:'Ammonia is carried as glutamine and alanine, then converted to urea in the liver. OTC deficiency (X-linked) gives high orotic acid and low BUN. Ammonia depletes α-ketoglutarate and swells astrocytes.',
 path:'Hyperammonaemia: vomiting, lethargy, cerebral oedema. Hepatic encephalopathy in cirrhosis has the same chemistry and a flapping tremor (asterixis).',
 pharm:'Lactulose and rifaximin lower gut ammonia. Sodium benzoate and phenylbutyrate give nitrogen an alternative exit. Limit, but do not stop, protein.',
 phys:'Gut and muscle make ammonia. The liver clears it twice: the periportal urea cycle takes most and perivenous glutamine synthetase mops up the rest, so liver failure or portosystemic shunting lets it reach the brain.',
 micro:'Urease-producing gut bacteria split urea into ammonia, which is why rifaximin and lactulose help. In the urinary tract, urease-positive Proteus raises urine pH and forms struvite stones.'}},
{id:'insulin-glucagon',n:'Fed and fasting states',s:'Endocrine',L:{
 bio:'Fed: insulin drives glycogen and fat synthesis. Fasting: glucagon drives glycogenolysis, then gluconeogenesis, then ketogenesis. Brain switches to ketones in prolonged fasting. Insulin raises fructose-2,6-bisphosphate and dephosphorylates enzymes; glucagon acts through cAMP and PKA and does the opposite.',
 phys:'Insulin acts through GLUT4 in muscle and fat. The liver and brain use insulin-independent GLUT2 and GLUT1/3.',
 pharm:'Metformin reduces hepatic gluconeogenesis (lactic acidosis risk). Sulfonylureas close K-ATP channels. GLP-1 agonists raise insulin and slow gastric emptying. SGLT2 inhibitors cause glucosuria.',
 path:'Insulinoma: low glucose with high insulin and C-peptide. Factitious insulin: high insulin with low C-peptide.'}},
{id:'diabetes',n:'Diabetes mellitus',s:'Endocrine',L:{
 path:'Type 1: autoimmune β-cell destruction (anti-GAD, HLA-DR3 and DR4). Type 2: insulin resistance and islet amyloid. Complications: hyaline arteriolosclerosis, Kimmelstiel-Wilson nodules, retinopathy, neuropathy, accelerated atherosclerosis.',
 bio:'High glucose enters the sorbitol pathway (aldose reductase) in lens, nerve and retina. Nonenzymatic glycation forms HbA1c. DKA makes ketone bodies from fatty acid oxidation.',
 phys:'DKA: absent insulin plus excess glucagon. Osmotic diuresis causes volume loss. Total body K⁺ falls even if serum K⁺ is high at first.',
 micro:'DKA and diabetes predispose to mucormycosis (rhinocerebral), malignant otitis externa (Pseudomonas) and foot infections.',
 pharm:'Insulin for type 1 and DKA. Replace potassium before giving insulin if K⁺ is low. SGLT2 inhibitors can cause euglycaemic DKA.'}},
{id:'thyroid',n:'Thyroid disease',s:'Endocrine',L:{
 phys:'TSH drives iodide uptake (NIS), peroxidase oxidation and coupling. T4 is converted to active T3 peripherally. T3 raises metabolic rate and sensitises β receptors.',
 path:'Graves: stimulating antibodies, diffuse hyperplasia, exophthalmos. Hashimoto: anti-TPO, Hürthle cells, lymphoid follicles. Subacute thyroiditis: painful, post-viral. Papillary carcinoma: clear Orphan Annie nuclei, psammoma bodies. Medullary: calcitonin, amyloid.',
 pharm:'Methimazole and PTU block peroxidase (PTU also blocks T4 to T3 and is preferred in the first trimester). Both can cause agranulocytosis; PTU can cause liver failure. β-blockers for symptoms. Radioiodine ablates. Levothyroxine for hypothyroidism. Amiodarone and lithium disturb thyroid function.',
 bio:'Thyroid peroxidase iodinates tyrosine residues on thyroglobulin. Deiodinases convert T4 to T3, or to inactive reverse T3 in severe illness.',
 micro:'Subacute granulomatous (de Quervain) thyroiditis often follows a viral upper respiratory infection: a tender gland, high ESR, and low radioiodine uptake despite thyrotoxicosis.'}},
{id:'adrenal',n:'Adrenal steroids and disease',s:'Endocrine',L:{
 bio:'Cholesterol to pregnenolone is the rate-limiting step. 21-hydroxylase deficiency: low cortisol and aldosterone, high androgens and 17-hydroxyprogesterone. 11β-hydroxylase deficiency: hypertension from deoxycorticosterone.',
 phys:'CRH, ACTH, then cortisol with negative feedback. Cortisol raises glucose, is permissive for catecholamines and suppresses immunity.',
 path:'Cushing: exogenous steroids most common; ACTH sources are pituitary or ectopic (small cell). Addison: autoimmune, hyperpigmentation, hypotension, low Na⁺, high K⁺. Conn: hypertension, low K⁺, low renin. Phaeochromocytoma: episodic hypertension, headache, sweating.',
 pharm:'Phaeochromocytoma: α-blockade (phenoxybenzamine) first, then β-blockade. Ketoconazole and metyrapone block steroid synthesis. Stopping long-term steroids suddenly causes adrenal crisis; treat with IV hydrocortisone.',
 micro:'Meningococcal sepsis can destroy the adrenals by haemorrhage (Waterhouse-Friderichsen). TB is a classic cause of Addison disease worldwide, and CMV attacks the adrenals in advanced HIV.'}},
{id:'calcium-pth',n:'Calcium, PTH and vitamin D',s:'Endocrine',L:{
 phys:'PTH raises Ca²⁺ (bone resorption, kidney reabsorption) and lowers phosphate reabsorption. It activates 1α-hydroxylase in the kidney. Calcitriol raises gut absorption of both Ca²⁺ and phosphate.',
 bio:'Skin makes vitamin D3, the liver adds 25-OH, the kidney adds 1-OH to make active calcitriol; 24-hydroxylase inactivates it.',
 path:'Primary hyperparathyroidism: kidney stones, bone pain (osteitis fibrosa cystica), abdominal complaints (constipation, pancreatitis, ulcers) and low mood. CKD lowers calcitriol, causing secondary hyperparathyroidism and renal osteodystrophy. Familial hypocalciuric hypercalcaemia (CaSR loss) mimics primary disease but urine calcium is low. Hypocalcaemia: Chvostek and Trousseau signs, long QT.',
 pharm:'Bisphosphonates reduce osteoclast activity. Cinacalcet activates the calcium-sensing receptor. Loops waste Ca²⁺, thiazides save it. Denosumab blocks RANKL.',
 micro:'Granulomas (TB, sarcoid) make calcitriol and can cause hypercalcaemia.'}},
{id:'catecholamines',n:'Catecholamine synthesis and metabolism',s:'Neuro',L:{
 bio:'Phenylalanine to tyrosine to L-DOPA (tyrosine hydroxylase, rate-limiting) to dopamine to noradrenaline (dopamine β-hydroxylase needs vitamin C) to adrenaline (cortisol induces PNMT). MAO and COMT break them down. Phenylketonuria: PAH or BH4 deficiency, so tyrosine becomes essential.',
 phys:'α₁ constricts vessels, α₂ reduces sympathetic outflow, β₁ raises heart rate and contractility, β₂ relaxes bronchi and vessels.',
 path:'Phaeochromocytoma raises VMA and metanephrines. PKU: musty odour, fair skin, intellectual disability if untreated.',
 pharm:'MAO inhibitors can cause a tyramine hypertensive crisis. Adrenaline is first-line in anaphylaxis. Carbidopa blocks peripheral DOPA decarboxylase; entacapone blocks COMT.'}},
{id:'parkinson',n:'Parkinson disease and basal ganglia',s:'Neuro',L:{
 path:'Loss of dopamine neurons in the substantia nigra pars compacta. Lewy bodies (α-synuclein). Resting tremor, rigidity, bradykinesia, postural instability. MPTP and antipsychotics cause parkinsonism.',
 phys:'Dopamine excites the direct pathway through D1 and inhibits the indirect pathway through D2. Loss of dopamine reduces cortical drive.',
 bio:'Levodopa crosses the blood-brain barrier on the large neutral amino acid carrier. Carbidopa blocks DOPA decarboxylase outside the brain.',
 pharm:'Levodopa with carbidopa, dopamine agonists (pramipexole, ropinirole: impulse control problems), MAO-B inhibitors (selegiline, rasagiline), COMT inhibitors, amantadine. Antipsychotics block D2 and cause parkinsonism.'}},
{id:'nmj',n:'Neuromuscular junction',s:'Neuro',L:{
 phys:'Action potential, Ca²⁺ entry, SNARE-mediated ACh release, nicotinic receptors, end-plate potential, muscle action potential, ryanodine receptor releases Ca²⁺.',
 path:'Myasthenia gravis: anti-AChR (or anti-MuSK), thymoma, worse with use. Lambert-Eaton: anti-calcium channel, small cell lung cancer, improves with use. Malignant hyperthermia: ryanodine receptor defect.',
 micro:'Botulinum toxin cleaves SNAREs: descending flaccid paralysis. Tetanus toxin blocks inhibitory glycine and GABA release: spastic paralysis.',
 pharm:'Pyridostigmine for myasthenia. Succinylcholine depolarises (hyperkalaemia risk). Rocuronium blocks; sugammadex reverses it. Dantrolene treats malignant hyperthermia. Aminoglycosides and magnesium can unmask myasthenia.'}},
{id:'excitability',n:'Excitable membranes and seizure drugs',s:'Neuro',L:{
 phys:'Na⁺ channels open and inactivate; K⁺ channels repolarise. Myelin speeds conduction by saltatory conduction. Use-dependent blockers act on rapidly firing cells.',
 pharm:'Local anaesthetics block Na⁺ channels. Phenytoin and carbamazepine block Na⁺ channels. Valproate: hepatotoxic, neural tube defects. Ethosuximide blocks T-type Ca²⁺ (absence seizures; carbamazepine can worsen them). Lamotrigine: rash. Status epilepticus: a benzodiazepine first, then levetiracetam, valproate or fosphenytoin.',
 path:'MS: CNS demyelination with periventricular plaques and oligoclonal bands. Guillain-Barré: peripheral demyelination with high CSF protein and normal cells.',
 micro:'Campylobacter jejuni infection often precedes Guillain-Barré.',
 bio:'The resting potential sits near the K⁺ equilibrium potential because leak K⁺ channels dominate; the Nernst equation sets each ion\'s equilibrium. Loss of SCN1A in inhibitory interneurons causes Dravet syndrome.'}},
{id:'meningitis',n:'Meningitis',s:'Neuro',L:{
 micro:'Neonates: group B strep, E. coli, Listeria. Children and adults: S. pneumoniae, N. meningitidis (gram-negative diplococci). Older or immunocompromised: Listeria. HIV: Cryptococcus (India ink, antigen test).',
 path:'Bacterial CSF: neutrophils, high protein, low glucose. Viral: lymphocytes, normal glucose. TB and fungal: lymphocytes, high protein, low glucose.',
 pharm:'Ceftriaxone plus vancomycin, add ampicillin for Listeria, plus dexamethasone before or with the first dose. Rifampin, ciprofloxacin or ceftriaxone as meningococcal prophylaxis for close contacts.',
 phys:'The choroid plexus makes CSF. Blocked reabsorption at the arachnoid granulations after meningitis causes communicating hydrocephalus.'}},
{id:'anemia',n:'Anaemia and haem synthesis',s:'Blood & cancer',L:{
 path:'Microcytic: iron deficiency, thalassaemia, chronic disease, sideroblastic, lead. Macrocytic: B12 or folate, liver disease, alcohol. Normocytic: haemolysis, kidney disease, acute blood loss. The reticulocyte count separates underproduction (low) from haemolysis or bleeding (high).',
 bio:'ALA synthase (vitamin B6) starts haem synthesis. Lead inhibits ALA dehydratase and ferrochelatase. Chronic disease: hepcidin traps iron in macrophages. Porphyrias are later blocks in the same pathway.',
 phys:'Kidney peritubular cells sense hypoxia and release erythropoietin.',
 pharm:'Lead: succimer, EDTA, dimercaprol. Isoniazid causes B6-deficient sideroblastic anaemia. Oral iron first; IV iron when absorption fails. Erythropoietin for CKD.',
 micro:'Hookworm causes iron-deficiency anaemia. Malaria causes haemolysis. Parvovirus B19 halts red cell production and causes aplastic crises in sickle cell disease.'}},
{id:'b12-folate',n:'Vitamin B12 and folate',s:'Blood & cancer',L:{
 bio:'B12 is a cofactor for methionine synthase and methylmalonyl-CoA mutase. Both deficiencies raise homocysteine. Only B12 deficiency raises methylmalonic acid.',
 path:'Megaloblastic anaemia with hypersegmented neutrophils. B12 deficiency also damages the dorsal columns and lateral corticospinal tracts. Pernicious anaemia: autoimmune gastritis with anti-intrinsic factor antibodies.',
 phys:'Parietal cells secrete intrinsic factor. The complex is absorbed in the terminal ileum. Liver stores of B12 last years; folate stores last months.',
 pharm:'Methotrexate blocks DHFR (leucovorin rescue). Trimethoprim blocks bacterial DHFR. 5-FU blocks thymidylate synthase. Phenytoin lowers folate. Metformin and PPIs lower B12 over years.',
 micro:'Diphyllobothrium latum (fish tapeworm) competes for B12. Bacterial overgrowth in a blind loop also consumes it.'}},
{id:'g6pd',n:'G6PD and red cell metabolism',s:'Blood & cancer',L:{
 bio:'The pentose phosphate pathway makes NADPH, which keeps glutathione reduced. Red cells have no mitochondria and depend on glycolysis for ATP. Pyruvate kinase deficiency causes rigid, ATP-starved cells.',
 path:'G6PD deficiency (X-linked): Heinz bodies, bite cells, episodic haemolysis after oxidant stress. Measure the enzyme after recovery, because young red cells have more of it.',
 pharm:'Triggers: primaquine, dapsone, sulfonamides, nitrofurantoin, rasburicase, fava beans, infection. Avoid methylene blue.',
 micro:'Carriers have some protection against malaria.',
 phys:'Red cells live about 120 days; the spleen removes damaged ones. Bite cells form when splenic macrophages pluck Heinz bodies out.'}},
{id:'coagulation',n:'Haemostasis and anticoagulants',s:'Blood & cancer',L:{
 phys:'Platelet plug: vWF binds GPIb, fibrinogen links GPIIb/IIIa. Intrinsic pathway (VIII, IX, XI, XII) shows in aPTT. Extrinsic (VII) shows in PT/INR.',
 bio:'Factors II, VII, IX, X, protein C and S need vitamin K for γ-carboxylation. Warfarin blocks vitamin K epoxide reductase (VKORC1).',
 path:'Haemophilia A (factor VIII), von Willebrand disease, ITP, TTP (low ADAMTS13), HUS (Shiga toxin), DIC, HIT (antibodies to PF4-heparin).',
 pharm:'Heparin activates antithrombin (aPTT, reverse with protamine). Warfarin: PT/INR, early protein C drop can cause skin necrosis; reverse with vitamin K plus prothrombin complex concentrate. DOACs block Xa or thrombin. Aspirin irreversibly blocks COX-1.',
 micro:'E. coli O157:H7 Shiga toxin causes HUS. Meningococcal and gram-negative sepsis trigger DIC.'}},
{id:'p53-rb',n:'Cell cycle checkpoints and oncogenesis',s:'Blood & cancer',L:{
 bio:'Cyclin-CDK complexes drive the cycle. p53 raises p21, which blocks CDKs, so Rb stays bound to E2F. DNA repair defects: mismatch repair (Lynch), nucleotide excision (xeroderma pigmentosum), homologous recombination (BRCA1/2).',
 path:'Oncogenes: RAS, MYC, BCR-ABL, HER2. Suppressors: p53 (Li-Fraumeni), Rb (retinoblastoma, osteosarcoma), APC. Carcinomas spread by lymphatics, sarcomas by blood.',
 micro:'HPV E6 degrades p53 and E7 inhibits Rb. EBV: Burkitt t(8;14), nasopharyngeal carcinoma. HBV and HCV: hepatocellular carcinoma. HHV-8: Kaposi. H. pylori: gastric cancer and MALT lymphoma.',
 pharm:'Imatinib blocks BCR-ABL. Trastuzumab targets HER2 (cardiotoxic). Rituximab targets CD20. PARP inhibitors (olaparib) kill BRCA-deficient cells. CDK4/6 inhibitors (palbociclib) hold Rb active in breast cancer.'}},
{id:'chemo',n:'Chemotherapy and the cell cycle',s:'Blood & cancer',L:{
 pharm:'Antimetabolites act in S phase (methotrexate, 5-FU, 6-MP, hydroxyurea). Vinca alkaloids block microtubule assembly and taxanes freeze microtubules (M phase). Alkylators and cisplatin damage DNA. Toxicities: bleomycin pulmonary fibrosis; doxorubicin cardiomyopathy (dexrazoxane); cyclophosphamide haemorrhagic cystitis (mesna); cisplatin kidney and ear damage; vincristine neuropathy.',
 bio:'Thymidylate synthase and DHFR supply nucleotides for DNA replication. Hydroxyurea inhibits ribonucleotide reductase.',
 path:'Rapidly dividing normal tissues (marrow, gut, hair) bear the toxicity. Tumour lysis brings high K⁺, phosphate and urate with low Ca²⁺; prevent it with fluids and allopurinol or rasburicase.',
 micro:'Neutropenia after chemotherapy invites gram-negative sepsis (including Pseudomonas) and invasive Aspergillus. Neutropenic fever needs an immediate antipseudomonal β-lactam such as piperacillin-tazobactam or cefepime.'}},
{id:'sex-hormones',n:'Sex hormones and reproductive pharmacology',s:'Repro',L:{
 phys:'Follicular phase: FSH and oestrogen rise. LH surge triggers ovulation. Corpus luteum makes progesterone. hCG sustains the corpus luteum in early pregnancy. GnRH is pulsatile.',
 bio:'Aromatase makes oestrogen from androgens. 5α-reductase makes DHT from testosterone.',
 path:'Pre-eclampsia: hypertension with proteinuria or organ damage after 20 weeks. Complete mole: empty egg with paternal DNA, snowstorm ultrasound, very high hCG. PCOS: high LH:FSH, insulin resistance, anovulation.',
 pharm:'Tamoxifen blocks the breast receptor but stimulates the endometrium. Anastrozole inhibits aromatase. Finasteride inhibits 5α-reductase. Continuous leuprolide suppresses the axis. Clomiphene and letrozole induce ovulation. Combined pills raise clot risk, especially with smoking over 35.'}},
{id:'sti',n:'Sexually transmitted infections',s:'Repro',L:{
 micro:'Syphilis (Treponema pallidum): painless chancre, rash, then gummas. Gonorrhoea: gram-negative diplococci in neutrophils. Chlamydia: obligate intracellular, with an infectious elementary body and a replicating reticulate body; serovars L1 to L3 cause lymphogranuloma venereum. HSV: painful vesicles.',
 path:'Syphilis tertiary: aortitis, tabes dorsalis, Argyll Robertson pupils. Gonorrhoea and chlamydia cause PID, infertility, ectopic pregnancy and Fitz-Hugh-Curtis perihepatitis.',
 pharm:'Penicillin G for syphilis (Jarisch-Herxheimer reaction). Ceftriaxone for gonorrhoea. Doxycycline (or azithromycin in pregnancy) for chlamydia. Treat partners.'}},
{id:'hypersensitivity',n:'Hypersensitivity reactions',s:'Immune',L:{
 path:'I: IgE and mast cells (anaphylaxis). II: antibody to cell or matrix antigens (haemolytic anaemia, Goodpasture, rheumatic fever, myasthenia, Graves). III: immune complexes (SLE, serum sickness, PSGN, Arthus reaction). IV: T cells (contact dermatitis, TB skin test, type 1 diabetes).',
 pharm:'Adrenaline IM for anaphylaxis. Antihistamines, steroids, omalizumab. Cromolyn stabilises mast cells.',
 micro:'Group A strep: rheumatic fever from molecular mimicry with M protein.',
 bio:'Complement is consumed in types II and III. Mast cell tryptase rises for a few hours after anaphylaxis and confirms it.'}},
{id:'complement',n:'Complement',s:'Immune',L:{
 bio:'Classical (C1q binds IgG or IgM), alternative and lectin pathways converge on C3. C3b opsonises. C3a and C5a are anaphylatoxins; C5a draws neutrophils. C5b-9 forms the membrane attack complex.',
 path:'C1 inhibitor deficiency: hereditary angioedema with low C4. CD55 and CD59 loss (PIGA mutation): PNH. C5 to C9 deficiency: recurrent Neisseria infection. C3 deficiency: severe pyogenic infections. Early classical deficiency (C1q, C2, C4): lupus-like disease.',
 pharm:'Eculizumab blocks C5 (PNH, atypical HUS) and raises meningococcal risk, so vaccinate first. ACE inhibitors worsen bradykinin angioedema.',
 micro:'Neisseria infections are the classic sign of terminal complement defects.'}},
{id:'hiv',n:'HIV',s:'Immune',L:{
 micro:'gp120 binds CD4 and CCR5 or CXCR4. gp41 fuses. Reverse transcriptase, integrase and protease are needed. Diagnosis: antigen/antibody test, then a confirmatory test; viral load for infants and very early infection.',
 path:'CD4 below 200: Pneumocystis. Below 100: Toxoplasma, Cryptococcus. Below 50: MAC, CMV retinitis. Kaposi sarcoma and primary CNS lymphoma.',
 pharm:'NRTIs (zidovudine anaemia, abacavir HLA-B*57:01, tenofovir kidney and bone). NNRTIs. Protease inhibitors (ritonavir boosts). Integrase inhibitors (dolutegravir, bictegravir). Maraviroc blocks CCR5. Co-trimoxazole prophylaxis below CD4 200.',
 bio:'Error-prone reverse transcriptase generates mutants quickly. CCR5 Δ32 homozygotes resist R5 strains.'}},
{id:'antibiotics',n:'Antibiotic targets and resistance',s:'Immune',L:{
 pharm:'Cell wall: β-lactams, vancomycin. 30S: aminoglycosides (oto- and nephrotoxic, need oxygen to enter), tetracyclines (chelate cations). 50S: macrolides (QT), clindamycin (C. difficile), linezolid (marrow, serotonin syndrome). Folate: sulfonamides plus trimethoprim. DNA: fluoroquinolones (tendon rupture, QT), metronidazole.',
 micro:'Gram-positive cells have thick peptidoglycan. Gram-negative cells have an outer membrane with LPS. MRSA carries mecA (PBP2a). VRE swaps D-Ala-D-Ala for D-Ala-D-Lac. β-lactamases, including extended-spectrum and carbapenemases, cleave β-lactams.',
 bio:'Penicillins inhibit transpeptidase. Vancomycin binds D-Ala-D-Ala. Rifampin inhibits RNA polymerase. Fluoroquinolones inhibit DNA gyrase and topoisomerase IV.',
 path:'Antibiotic-associated colitis from C. difficile. Chloramphenicol: grey baby syndrome and aplastic anaemia. Vancomycin infusion reaction (flushing) is histamine release, not allergy.'}},
{id:'gram-positive-cocci',n:'Staphylococci and streptococci',s:'Immune',L:{
 micro:'S. aureus: catalase and coagulase positive, protein A, TSST-1. S. pyogenes: catalase negative, β-haemolytic, bacitracin sensitive, M protein. S. pneumoniae: α-haemolytic, optochin sensitive, bile soluble. S. agalactiae (group B): CAMP positive, hippurate positive.',
 path:'S. aureus: abscess, impetigo, TSS, endocarditis, osteomyelitis. S. pyogenes: pharyngitis, cellulitis, necrotising fasciitis, rheumatic fever, PSGN. S. pneumoniae: lobar pneumonia, otitis, meningitis.',
 pharm:'Penicillins for strep. MSSA: flucloxacillin or cefazolin. MRSA: vancomycin, linezolid, daptomycin (not for pneumonia), or doxycycline for mild skin disease.',
 bio:'Coagulase turns fibrinogen into fibrin. Protein A binds the Fc of IgG and blocks opsonisation. Streptolysin O is oxygen-labile and is what ASO titres measure.'}},
{id:'glycogen-storage',n:'Glycogen storage diseases',s:'GI & liver',L:{
 bio:'Von Gierke: glucose-6-phosphatase. Pompe: lysosomal acid α-glucosidase. Cori: debranching enzyme. McArdle: muscle glycogen phosphorylase. All are autosomal recessive.',
 path:'Von Gierke: fasting hypoglycaemia, hepatomegaly, lactic acidosis, hyperuricaemia, hyperlipidaemia. Pompe: cardiomegaly and hypotonia. Cori: milder hypoglycaemia with normal lactate. McArdle: cramps and myoglobinuria with exercise, second-wind phenomenon.',
 phys:'Liver glycogen maintains blood glucose. Muscle glycogen serves only the muscle, because muscle lacks glucose-6-phosphatase.',
 pharm:'Enzyme replacement therapy (alglucosidase alfa) for Pompe. Frequent feeds and uncooked cornstarch for von Gierke; avoid fructose and galactose.'}},
{id:'lysosomal',n:'Lysosomal storage diseases',s:'General',L:{
 bio:'Gaucher: glucocerebrosidase. Fabry: α-galactosidase A. Niemann-Pick: sphingomyelinase. Tay-Sachs: hexosaminidase A. Hurler: α-L-iduronidase; Hunter: iduronate sulfatase. All are autosomal recessive except Fabry and Hunter, which are X-linked.',
 path:'Gaucher: crumpled-tissue-paper macrophages, hepatosplenomegaly, bone crises. Fabry: angiokeratomas, kidney failure, neuropathic pain. Tay-Sachs: cherry-red spot and no hepatosplenomegaly. Niemann-Pick: cherry-red spot with hepatosplenomegaly. Hurler: corneal clouding; Hunter: clear corneas and aggression.',
 pharm:'Enzyme replacement (imiglucerase) for Gaucher and agalsidase for Fabry. Substrate reduction (eliglustat) for Gaucher.'}},
{id:'vitamins',n:'Vitamin deficiencies',s:'General',L:{
 bio:'Thiamine (B1): cofactor for pyruvate dehydrogenase, α-ketoglutarate dehydrogenase and transketolase. Niacin (B3): NAD⁺. B6: transamination and haem synthesis. Vitamin C: hydroxylation. Vitamin A: vision and epithelium. Vitamin K: carboxylation.',
 path:'B1: beriberi, Wernicke-Korsakoff. B3: pellagra (dermatitis, diarrhoea, dementia). C: scurvy. A: night blindness, xerophthalmia. D: rickets and osteomalacia. E: haemolysis and posterior column loss.',
 pharm:'Give thiamine before glucose in at-risk patients. Isotretinoin is teratogenic. Isoniazid causes B6 deficiency. Vitamin A excess raises intracranial pressure.',
 micro:'The fish tapeworm steals B12. Broad-spectrum antibiotics deplete the gut flora that make vitamin K, which adds to bleeding risk in ill patients.'}},
{id:'gout-purines',n:'Purines, gout and arthritis',s:'MSK & skin',L:{
 bio:'Purines break down to uric acid via xanthine oxidase. Lesch-Nyhan: HGPRT deficiency, so salvage fails and PRPP rises.',
 path:'Gout: needle-shaped, negatively birefringent urate crystals. Pseudogout: rhomboid, positively birefringent CPPD. RA: pannus, anti-CCP, spares the DIP. OA: Heberden nodes.',
 pharm:'Allopurinol and febuxostat block xanthine oxidase (allopurinol raises azathioprine and 6-MP toxicity). Colchicine blocks microtubules. Probenecid blocks urate reabsorption. Rasburicase breaks urate down in tumour lysis. Methotrexate and anti-TNF for RA.',
 micro:'Septic arthritis: S. aureus, or N. gonorrhoeae in young sexually active adults. Always tap a hot single joint.',
 phys:'Urate is filtered, then mostly reabsorbed by URAT1 in the proximal tubule. Most gout comes from underexcretion; thiazides, loops, low-dose aspirin and alcohol all reduce excretion.'}}
);
