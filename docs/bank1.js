/* Bassiet content, part 1: concepts (General, Cardio, Resp, Renal). Original wording.
   Lens keys: path, micro, pharm, bio, phys. British spelling. */
window.BANK = window.BANK || {C:[],E:[],CH:[],PT:[],CP:[]};
BANK.C.push(
{id:'cell-injury',n:'Cell injury and necrosis',s:'General',L:{
 path:'Reversible injury shows swelling, fatty change and membrane blebs; irreversible injury adds membrane and mitochondrial failure and nuclear death (pyknosis, karyorrhexis, karyolysis). Patterns: coagulative (ischaemia, solid organs), liquefactive (brain, abscess), caseous (TB), fat (pancreatitis), fibrinoid (vasculitis). Leaking enzymes (troponin, CK, transaminases) mark membrane rupture.',
 bio:'ATP falls, so anaerobic glycolysis raises lactate and lowers pH, and chromatin clumps. Calcium floods in and activates phospholipases, proteases and endonucleases.',
 phys:'Pumps spend most of the cell\'s ATP holding ion gradients. When ATP fails the gradients collapse, Na⁺ and water enter and the cell swells.',
 pharm:'Drugs injure cells by predictable routes: paracetamol through NAPQI (centrilobular necrosis), carbon tetrachloride through free radicals, doxorubicin through radical damage to myocytes. Reperfusion by PCI or thrombolysis rescues reversibly injured tissue but adds a burst of oxidative injury.',
 micro:'Clostridium perfringens α-toxin is a lecithinase that dissolves cell membranes and drives myonecrosis. Caseous necrosis marks TB and some fungi; liquefactive necrosis marks pyogenic bacterial abscesses.'}},
{id:'apoptosis',n:'Apoptosis',s:'General',L:{
 path:'Shrunken, hypereosinophilic cell with fragmented nuclei and an intact membrane. No inflammation. Examples: embryological remodelling, thymic selection, cytotoxic T cell killing, atrophy after hormone withdrawal.',
 bio:'Intrinsic route: BAX/BAK up, BCL-2 down, cytochrome c leaks, caspase-9, then executioner caspases. Extrinsic route: FAS or TNF receptor, caspase-8. Caspases activate endonucleases (a DNA ladder) and phosphatidylserine flips outward as an eat-me signal.',
 pharm:'Venetoclax inhibits BCL-2 and pushes CLL cells into apoptosis. Many cytotoxic drugs kill through p53-dependent apoptosis, which is why TP53-mutant tumours often resist them.',
 micro:'Cytotoxic T cells and NK cells kill infected cells with perforin and granzyme B (which activates caspases) or with FAS ligand. Some viruses carry their own anti-apoptotic proteins, such as the BCL-2-like BHRF1 of EBV, to keep the host cell alive.',
 phys:'Programmed death shapes normal tissue: interdigital webs regress, the endometrium sheds after progesterone withdrawal, and the breast involutes after weaning.'}},
{id:'free-radicals',n:'Free radicals and oxidative injury',s:'General',L:{
 path:'Drives reperfusion injury, radiation damage and CCl₄ liver injury. Lipid peroxidation of membranes is the main damage. Iron (haemochromatosis) and copper (Wilson disease) catalyse radical formation through the Fenton reaction.',
 bio:'Defences: superoxide dismutase, catalase, glutathione peroxidase, plus vitamins A, C and E. NADPH from the pentose phosphate pathway keeps glutathione reduced.',
 micro:'Phagocytes use NADPH oxidase for the respiratory burst. Chronic granulomatous disease lacks it, so catalase-positive organisms (S. aureus, Aspergillus, Serratia) survive.',
 pharm:'Paracetamol overdose depletes glutathione. N-acetylcysteine restores it and works best when given early. Deferoxamine chelates iron in overload and poisoning.',
 phys:'Oxygen itself is the main source. In reperfusion, hyperoxia and high-flow oxygen to premature infants (retinopathy, bronchopulmonary dysplasia), more superoxide forms than the enzymes can clear.'}},
{id:'oxphos',n:'Oxidative phosphorylation',s:'General',L:{
 bio:'The electron transport chain pumps protons to build a gradient that ATP synthase uses; each NADH yields about 2.5 ATP and each FADH₂ about 1.5. Blockers: rotenone (complex I), antimycin A (III), cyanide and CO (IV), oligomycin (ATP synthase). Uncouplers such as 2,4-dinitrophenol dissipate the gradient and make heat.',
 path:'Mitochondrial disease follows maternal inheritance and varies by heteroplasmy. Muscle biopsy shows ragged red fibres. Examples: MELAS, Leber hereditary optic neuropathy.',
 phys:'Brown fat uses thermogenin (UCP1) to uncouple on purpose and generate heat, which matters most in newborns.',
 pharm:'Cyanide poisoning: hydroxocobalamin first, or nitrite plus thiosulfate. Aspirin overdose partly uncouples oxidative phosphorylation, causing fever. Metformin mildly inhibits complex I, which is one route to lactic acidosis.'}},
{id:'genetic-disorders',n:'Inheritance and chromosomal disorders',s:'General',L:{
 path:'Trisomy 21: AV septal defect, duodenal atresia, early Alzheimer disease, ALL and AML. Turner 45,X: coarctation, bicuspid aortic valve, streak ovaries, short stature. Klinefelter 47,XXY: tall, small firm testes, gynaecomastia. Marfan: fibrillin-1, lens dislocation upward, aortic root dilation and dissection.',
 bio:'Patterns: autosomal dominant disorders often hit structural proteins and show variable expressivity; autosomal recessive disorders are usually enzyme defects; X-linked recessive disease affects sons of carrier mothers with no male-to-male transmission. Trinucleotide repeats expand across generations (anticipation): Huntington CAG, fragile X CGG, Friedreich GAA, myotonic dystrophy CTG. Imprinting: Prader-Willi loses the paternal 15q11-13, Angelman the maternal.',
 pharm:'Pharmacogenetics: slow NAT2 acetylators get isoniazid and hydralazine toxicity; HLA-B*57:01 predicts abacavir hypersensitivity; HLA-B*15:02 predicts carbamazepine Stevens-Johnson syndrome in South-East Asian patients; TPMT deficiency makes azathioprine and 6-MP toxic to marrow.'}},
{id:'collagen',n:'Collagen and wound healing',s:'MSK & skin',L:{
 bio:'Types: I in bone, skin and tendon; II in cartilage and vitreous; III in vessels, granulation tissue and fetal skin; IV in basement membrane (Alport, Goodpasture). Proline and lysine hydroxylation needs vitamin C. Lysyl oxidase cross-links and needs copper. Defects: scurvy, osteogenesis imperfecta (type I), Ehlers-Danlos (classic: type V collagen; vascular: type III; the common hypermobile type has no known collagen gene), Menkes (copper, ATP7A).',
 path:'Granulation tissue lays down type III collagen that is later replaced by type I in the scar. Keloids overgrow the wound edge and are commoner in darker skin. Scurvy gives perifollicular haemorrhage, corkscrew hairs and bleeding gums.',
 micro:'Clostridium perfringens makes collagenase and lecithinase, which drive gas gangrene. Wound infection is the commonest reason a wound heals late.',
 pharm:'Glucocorticoids slow healing by suppressing fibroblasts and collagen synthesis. Fluoroquinolones weaken tendons. Penicillamine interferes with cross-linking. Vitamin C cures scurvy within weeks.',
 phys:'Healing runs in overlapping phases: haemostasis and inflammation (days 0 to 3), proliferation with granulation tissue and myofibroblast contraction (to about week 3), then remodelling for months. A mature scar regains only about 70 to 80% of the original tensile strength.'}},
{id:'na-k-atpase',n:'Na⁺/K⁺-ATPase',s:'General',L:{
 bio:'Primary active transport: 3 Na⁺ out and 2 K⁺ in per ATP, so it is electrogenic. It builds the gradient that secondary transporters use.',
 phys:'Sets the resting membrane potential and cell volume. Its gradient drives Na⁺/Ca²⁺ exchange, Na⁺-glucose uptake (SGLT) and NKCC2. Insulin, β₂ agonists and aldosterone switch more pumps on.',
 pharm:'Digoxin and other cardiac glycosides inhibit it at the K⁺-binding site, so hypokalaemia strengthens their effect. Ouabain is the classic laboratory blocker.',
 path:'ATP loss in ischaemia stalls it, so the cell swells. In acute digoxin overdose the blocked pumps leave K⁺ outside cells and cause hyperkalaemia.'}},
{id:'digoxin',n:'Digoxin',s:'Cardio',L:{
 pharm:'Inhibits Na⁺/K⁺-ATPase, so more Ca²⁺ is available per beat and contractility rises. Also raises vagal tone and slows AV conduction (rate control in AF). Cleared by the kidney; levels rise in renal failure and with amiodarone, verapamil or quinidine. Toxicity: nausea, yellow-green vision, confusion, arrhythmias. Antidote: digoxin-specific Fab fragments.',
 phys:'Raising intracellular Na⁺ blunts Na⁺/Ca²⁺ exchange, so Ca²⁺ stays in the cell and the sarcoplasmic reticulum.',
 bio:'It competes with K⁺ for the same binding site on the pump, so hypokalaemia increases its effect. Hypercalcaemia and hypomagnesaemia also raise the risk of toxicity.',
 path:'Therapeutic levels scoop the ST segment (a reverse tick). Toxicity can cause almost any arrhythmia; atrial tachycardia with block and bidirectional VT are suggestive. Acute overdose causes hyperkalaemia, and the K⁺ level tracks mortality.'}},
{id:'cardiac-mechanics',n:'Cardiac output and valves',s:'Cardio',L:{
 phys:'CO = HR × SV. SV depends on preload, contractility and afterload (Frank-Starling). Ejection fraction = SV / EDV, normally above about 55%. S1 is AV valve closure, S2 is semilunar valve closure.',
 path:'Aortic stenosis: crescendo-decrescendo murmur, syncope, angina, dyspnoea. Mitral regurgitation: holosystolic, radiates to axilla. Mitral stenosis: opening snap, diastolic rumble (rheumatic). Aortic regurgitation: early diastolic murmur, wide pulse pressure.',
 micro:'Endocarditis: viridans streptococci on damaged valves (subacute), S. aureus in people who inject drugs (acute, tricuspid), S. epidermidis on prosthetic valves, S. gallolyticus with colorectal cancer.',
 pharm:'Nitrates lower preload (venodilation). Arterial vasodilators lower afterload. Dobutamine (β₁) and milrinone (PDE3) are inotropes.',
 bio:'Cross-bridge cycling spends ATP, and so does relaxation: SERCA pumps Ca²⁺ back into the sarcoplasmic reticulum. Phospholamban brakes SERCA until PKA phosphorylates it, which is how β₁ stimulation speeds relaxation.'}},
{id:'heart-failure',n:'Heart failure',s:'Cardio',L:{
 path:'Left failure: pulmonary oedema with haemosiderin-laden macrophages. Right failure: nutmeg liver, jugular venous distension, peripheral oedema. Dilated cardiomyopathy follows alcohol, doxorubicin and viral myocarditis.',
 phys:'The Starling curve flattens and shifts down. Neurohormonal activation (sympathetic, RAAS, ADH) helps short-term but retains fluid and remodels the ventricle.',
 pharm:'Mortality benefit in reduced ejection fraction: ACE inhibitor, ARB or ARNI (sacubitril-valsartan), β-blockers (bisoprolol, carvedilol, metoprolol succinate), mineralocorticoid antagonists, SGLT2 inhibitors. Loop diuretics and digoxin relieve symptoms only.',
 micro:'Coxsackie B myocarditis and Chagas disease (T. cruzi) cause dilated cardiomyopathy.',
 bio:'Stretched ventricular myocytes release BNP (and its fragment NT-proBNP); high levels support the diagnosis and track prognosis. Neprilysin degrades natriuretic peptides, so sacubitril raises BNP; follow NT-proBNP, which neprilysin does not break down, once it is started.'}},
{id:'mi',n:'Myocardial infarction',s:'Cardio',L:{
 path:'Coagulative necrosis. Neutrophils at 1 to 3 days, macrophages at 3 to 7 days (weakest wall, rupture risk), granulation tissue at 1 to 3 weeks, scar by about 2 months. Complications: arrhythmia (first day), papillary muscle or free wall rupture (days 3 to 7), aneurysm and mural thrombus (weeks), Dressler syndrome (weeks).',
 bio:'Troponin I or T rises about 3 to 4 hours after onset, peaks near 24 hours and stays raised for 7 to 10 days. CK-MB returns to normal within 2 to 3 days, so it can show reinfarction.',
 phys:'The left ventricle is perfused mostly in diastole, so tachycardia shortens perfusion time. The LAD supplies the anterior wall and septum; the right coronary usually supplies the inferior wall and the AV node, so inferior MI brings bradycardia and heart block.',
 pharm:'Aspirin, P2Y12 inhibitor, heparin, β-blocker, ACE inhibitor, high-intensity statin. Nitrates for pain (avoid in right ventricular infarction and after PDE5 inhibitors). Reperfusion by PCI or thrombolysis.'}},
{id:'atherosclerosis',n:'Atherosclerosis and lipids',s:'Cardio',L:{
 path:'Endothelial injury, fatty streak (foam cells), fibrous plaque, complicated plaque. Risks: hypertension, smoking, diabetes, LDL. Rupture of a thin fibrous cap triggers thrombosis.',
 bio:'Oxidised LDL is taken up by macrophage scavenger receptors. Familial hypercholesterolaemia is an LDL receptor (or APOB, PCSK9 gain) defect. HMG-CoA reductase is the rate-limiting step of cholesterol synthesis.',
 pharm:'Statins block HMG-CoA reductase (myopathy, raised transaminases). Ezetimibe blocks NPC1L1. PCSK9 inhibitors keep LDL receptors alive. Fibrates act on PPAR-α and lower triglycerides (myopathy with statins). Niacin raises HDL but causes flushing.',
 phys:'Low, oscillating shear stress at branch points (carotid bulb, coronary origins) favours plaques; steady laminar shear protects through nitric oxide.',
 micro:'Chronic inflammation raises risk (HIV, rheumatoid arthritis, psoriasis). Bacteria such as Chlamydophila pneumoniae have been found in plaques, but antibiotics do not prevent events.'}},
{id:'hypertension',n:'Hypertension',s:'Cardio',L:{
 phys:'MAP = CO × SVR. Secondary causes: renal artery stenosis, primary aldosteronism (low K⁺), phaeochromocytoma, Cushing syndrome, coarctation, sleep apnoea.',
 path:'Hyaline arteriolosclerosis in chronic disease. Hyperplastic arteriolosclerosis (onion-skin) and fibrinoid necrosis in malignant hypertension. Long-term damage: LVH, aortic dissection, lacunar infarcts, Charcot-Bouchard microaneurysms with intracerebral haemorrhage, nephrosclerosis, retinopathy.',
 pharm:'First line: thiazides, ACE inhibitors or ARBs, dihydropyridine calcium channel blockers. β-blockers are not first line unless another indication exists. Pregnancy: labetalol, nifedipine or methyldopa; avoid ACE inhibitors and ARBs. Emergency: IV labetalol, nicardipine or clevidipine.',
 bio:'Rare single-gene forms teach the physiology: Liddle syndrome (ENaC gain), glucocorticoid-remediable aldosteronism (aldosterone synthase under ACTH control) and apparent mineralocorticoid excess (11β-HSD2 loss, also caused by liquorice).'}},
{id:'antiarrhythmics',n:'Cardiac action potential and antiarrhythmics',s:'Cardio',L:{
 phys:'Ventricle: phase 0 Na⁺ in, 1 K⁺ out, 2 plateau (Ca²⁺ in), 3 K⁺ out, 4 rest. Nodal cells have no fast Na⁺ channels: phase 4 uses the funny current and phase 0 uses Ca²⁺.',
 pharm:'IA quinidine and procainamide (QT prolongation; procainamide causes drug-induced lupus). IB lidocaine (VT after MI). IC flecainide (avoid after MI or in structural heart disease). II β-blockers. III amiodarone and sotalol (prolong QT). IV verapamil and diltiazem. Adenosine for SVT. Magnesium for torsades.',
 path:'Long QT leads to torsades de pointes. Wolff-Parkinson-White has a short PR and a delta wave from an accessory pathway; avoid AV nodal blockers if AF conducts down it.',
 bio:'Inherited long QT: loss of K⁺ channel genes (KCNQ1, KCNH2) or gain of the Na⁺ channel SCN5A. Brugada syndrome is loss of SCN5A function, with ST elevation in V1 to V2.'}},
{id:'sepsis',n:'Sepsis and septic shock',s:'Immune',L:{
 micro:'Gram-negative sepsis: lipid A of LPS acts on TLR4 with CD14 and triggers TNF and IL-1. Gram-positive: lipoteichoic acid signals through TLR2, and superantigens (TSST-1) activate T cells nonspecifically.',
 path:'Vasodilation, leaky capillaries and DIC. Meningococcaemia can cause adrenal haemorrhage (Waterhouse-Friderichsen).',
 phys:'Early warm shock: SVR falls, CO rises. Late shock: CO falls.',
 pharm:'Fluids, then noradrenaline as first-line vasopressor, plus early antibiotics after blood cultures. Add hydrocortisone if shock persists.',
 bio:'Lactate rises from hypoperfusion and from adrenergic stimulation of glycolysis. Septic shock means vasopressors are needed to hold MAP at 65 mmHg and lactate stays above 2 mmol/L despite fluids.'}},
{id:'copd',n:'COPD and emphysema',s:'Resp',L:{
 path:'Emphysema: centriacinar (smoking, upper lobes) or panacinar (α₁-antitrypsin deficiency, lower lobes). Chronic bronchitis: productive cough for at least 3 months in each of 2 consecutive years, with mucous gland hyperplasia (Reid index above 0.5). Late disease brings cor pulmonale.',
 phys:'FEV1/FVC falls below 0.7 and does not fully reverse. TLC and residual volume rise from air trapping. Emphysema loses elastic recoil, so compliance rises and DLCO falls.',
 pharm:'Long-acting antimuscarinics (tiotropium) and long-acting β₂ agonists are the backbone; inhaled steroids are added for frequent exacerbations or high blood eosinophils. Roflumilast inhibits PDE4. Long-term oxygen in chronic hypoxaemia and stopping smoking are the measures that improve survival.',
 bio:'α₁-antitrypsin deficiency (SERPINA1): unchecked neutrophil elastase destroys alveoli. The misfolded Z protein piles up in hepatocytes and causes cirrhosis (PAS-positive globules).',
 micro:'COPD exacerbations: H. influenzae, S. pneumoniae, M. catarrhalis, and respiratory viruses.'}},
{id:'surfactant',n:'Surfactant and lung compliance',s:'Resp',L:{
 phys:'Type II pneumocytes make surfactant, which lowers surface tension and prevents collapse at low volumes. Laplace: P = 2T / r, so small alveoli would collapse first without it. Lecithin:sphingomyelin ratio above 2 suggests fetal lung maturity.',
 path:'Neonatal respiratory distress: ground-glass lungs, hyaline membranes. Adult ARDS: diffuse alveolar damage after sepsis, trauma or aspiration. Complications of prematurity: PDA, bronchopulmonary dysplasia, NEC, retinopathy.',
 bio:'The main component is dipalmitoylphosphatidylcholine, a saturated lipid. Maternal diabetes delays surfactant because fetal insulin opposes cortisol.',
 pharm:'Antenatal betamethasone speeds lung maturation. Give exogenous surfactant and CPAP after birth.',
 micro:'Group B streptococcal pneumonia in the newborn inactivates surfactant and can look exactly like respiratory distress syndrome on X-ray, so sick preterm babies get antibiotics too.'}},
{id:'vq',n:'Ventilation-perfusion mismatch',s:'Resp',L:{
 phys:'Normal V/Q is about 0.8 overall; the apex has the highest V/Q and the base the lowest. Shunt (V/Q 0) does not correct with 100% O₂, while low-V/Q units do. Dead space (V/Q ∞) wastes ventilation and raises the work needed to clear CO₂. Hypoventilation raises PaCO₂ with a normal A-a gradient; V/Q mismatch, shunt and diffusion limits widen it.',
 path:'Pulmonary embolism creates dead space. Pneumonia, atelectasis and pulmonary oedema create shunt. Asthma and COPD create many low-V/Q units, which is why their hypoxaemia corrects easily with oxygen.',
 pharm:'Hypoxic pulmonary vasoconstriction diverts blood away from poorly ventilated units; systemic vasodilators can blunt it and worsen hypoxaemia. Inhaled nitric oxide dilates only ventilated units, so it improves matching.'}},
{id:'pe',n:'Pulmonary embolism',s:'Resp',L:{
 path:'Emboli usually come from deep leg veins (Virchow: stasis, endothelial injury, hypercoagulability). Saddle embolus at the bifurcation. Infarcts are wedge-shaped and haemorrhagic. Lines of Zahn mark an antemortem thrombus.',
 phys:'Dead space rises, PaO₂ falls, PaCO₂ is low from hyperventilation, and the right ventricle faces higher afterload.',
 pharm:'Heparin or a DOAC (apixaban, rivaroxaban); warfarin, not a DOAC, in antiphospholipid syndrome. Thrombolysis for massive embolus with shock. Idarucizumab reverses dabigatran; andexanet alfa reverses Xa inhibitors.',
 bio:'Factor V Leiden resists inactivation by activated protein C and is the commonest inherited thrombophilia; the prothrombin G20210A variant raises prothrombin levels.'}},
{id:'pneumonia',n:'Pneumonia',s:'Resp',L:{
 micro:'S. pneumoniae: lancet-shaped diplococci, optochin sensitive. Klebsiella: currant-jelly sputum, alcohol use. S. aureus after influenza. Mycoplasma: cold agglutinins, no cell wall. Legionella: water aerosol, hyponatraemia, charcoal yeast agar. Pseudomonas: CF and ventilators.',
 path:'Lobar pneumonia stages: congestion, red hepatisation, grey hepatisation, resolution. Bronchopneumonia is patchy. Aspiration favours the right lower lobe.',
 pharm:'Macrolides block the 50S subunit. Doxycycline blocks 30S. β-lactams for typical organisms. Respiratory fluoroquinolones. Atypical organisms ignore β-lactams.',
 phys:'Consolidation causes shunt and hypoxaemia.',
 bio:'Legionella needs cysteine and iron, so it grows only on buffered charcoal yeast extract. Mycoplasma has sterols in its membrane instead of a wall, so β-lactams fail. The pneumococcal polysaccharide capsule is the vaccine target.'}},
{id:'tuberculosis',n:'Tuberculosis',s:'Resp',L:{
 micro:'Acid-fast bacillus because of mycolic acids. Slow growth, cord factor, Lowenstein-Jensen medium. Granuloma needs IL-12 and IFN-γ. Defects in that axis allow atypical mycobacteria.',
 path:'Primary: Ghon focus plus hilar nodes. Caseating granulomas with Langhans cells. Reactivation is apical. Miliary spread. Pott disease. TNF inhibitors reactivate it.',
 pharm:'Four drugs for two months, then two for four: rifampin (RNA polymerase, orange body fluids, CYP inducer), isoniazid (hepatitis, B6 neuropathy), pyrazinamide (hyperuricaemia, hepatitis), ethambutol (optic neuritis, red-green colour loss).',
 bio:'Isoniazid is a prodrug activated by KatG and blocks mycolic acid synthesis. Slow acetylators (NAT2) have more toxicity.'}},
{id:'lung-cancer',n:'Lung cancer',s:'Resp',L:{
 path:'Small cell: central, neuroendocrine, ACTH or ADH secretion, Lambert-Eaton. Squamous: central, PTHrP hypercalcaemia, keratin pearls. Adenocarcinoma: peripheral, the commonest type in never-smokers, EGFR or ALK. Pancoast tumour causes Horner syndrome.',
 pharm:'EGFR inhibitors (osimertinib), ALK inhibitors (alectinib), PD-1 inhibitors (pembrolizumab). Small cell responds to platinum chemotherapy at first but relapses early.',
 phys:'Horner syndrome: sympathetic chain damage causes ptosis, miosis and anhidrosis.',
 bio:'Smoking carcinogens form DNA adducts (TP53 and KRAS mutations). MYC amplification is common in small cell.'}},
{id:'o2-hb',n:'Haemoglobin and oxygen delivery',s:'Blood & cancer',L:{
 bio:'HbA is α₂β₂. HbF binds 2,3-BPG poorly, so it holds O₂ tighter. Cooperativity gives the sigmoid curve. Bohr effect: acid and CO₂ lower affinity.',
 phys:'Right shift (more unloading): high CO₂, H⁺, 2,3-BPG, temperature. CO poisoning shifts the curve left and cuts capacity. Methaemoglobin has Fe³⁺ and cannot carry O₂. O₂ content = 1.34 × Hb × SaO₂ + 0.003 × PaO₂, so anaemia lowers content with a normal PaO₂ and saturation.',
 path:'Sickle cell: Glu to Val in the β chain, polymerises when deoxygenated. HbF protects. Thalassaemias reduce chain output.',
 pharm:'Methylene blue for methaemoglobinaemia (not in G6PD deficiency). Hydroxyurea raises HbF. Nitrites, dapsone and local anaesthetics such as benzocaine can cause methaemoglobinaemia.',
 micro:'Sickle trait, G6PD deficiency and thalassaemia protect against malaria.'}},
{id:'raas',n:'Renin-angiotensin-aldosterone system',s:'Renal',L:{
 phys:'Renin from juxtaglomerular cells is triggered by low perfusion, low NaCl at the macula densa and β₁ input. Angiotensin II constricts the efferent arteriole (holding GFR up when perfusion falls) and raises aldosterone, ADH and thirst. This is why ACE inhibitors drop GFR in bilateral renal artery stenosis.',
 pharm:'ACE inhibitors: cough and angioedema from bradykinin, hyperkalaemia, teratogenic, creatinine rise. ARBs spare bradykinin. Aliskiren blocks renin itself. Spironolactone and eplerenone block the aldosterone receptor.',
 path:'Renal artery stenosis (atherosclerosis in older adults, fibromuscular dysplasia in young women) and primary aldosteronism are secondary causes of hypertension.',
 bio:'ACE also degrades bradykinin. Angiotensin II acts on AT1 receptors. Aldosterone is made in the zona glomerulosa by aldosterone synthase (CYP11B2) and acts on a nuclear receptor to add ENaC channels and Na⁺/K⁺ pumps.'}},
{id:'nephron-diuretics',n:'Nephron transport and diuretics',s:'Renal',L:{
 phys:'PCT: 65% of Na⁺, all glucose and amino acids. Thick ascending limb: NKCC2, lumen-positive voltage drives Ca²⁺ and Mg²⁺. Distal tubule: NCC. Collecting duct: ENaC under aldosterone, aquaporin-2 under ADH.',
 pharm:'Loop: raises urinary Ca²⁺, ototoxic, low K⁺, alkalosis. Thiazide: lowers urinary Ca²⁺, hypercalcaemia, hyponatraemia, hyperglycaemia, hyperuricaemia. Spironolactone and amiloride: hyperkalaemia. Acetazolamide: non-gap acidosis. Mannitol: osmotic diuresis for raised intracranial pressure.',
 path:'Bartter syndrome (NKCC2) looks like chronic loop use. Gitelman (NCC) looks like thiazide use. Liddle (ENaC gain) causes hypertension, low K⁺, low aldosterone.',
 bio:'Carbonic anhydrase in the proximal tubule turns filtered HCO₃⁻ into CO₂ that can be reabsorbed; blocking it loses HCO₃⁻ in the urine. SGLT2 in the early proximal tubule reclaims most filtered glucose.'}},
{id:'acid-base',n:'Acid-base balance',s:'Renal',L:{
 phys:'Anion gap = Na⁺ − (Cl⁻ + HCO₃⁻), normal about 8 to 12 mmol/L. Expected PaCO₂ in metabolic acidosis = 1.5 × HCO₃⁻ + 8 (± 2); outside that range a second disorder is present. Renal compensation for respiratory disorders takes days. Vomiting gives alkalosis with low K⁺ and Cl⁻.',
 path:'High anion gap: ketoacids (diabetic, alcoholic or starvation ketosis), lactate, toxic alcohols (methanol, ethylene glycol, propylene glycol), salicylates, uraemia, and iron or isoniazid overdose. Normal gap (hyperchloraemic): diarrhoea, renal tubular acidosis, acetazolamide, large saline loads.',
 bio:'Lactate and ketoacids are the usual unmeasured anions. Bicarbonate buffering depends on carbonic anhydrase. Alcohol dehydrogenase turns ethylene glycol into oxalate (crystals, kidney injury) and methanol into formic acid (blindness), which is why fomepizole works.',
 pharm:'Acetazolamide causes non-gap acidosis. Salicylate toxicity mixes respiratory alkalosis with gap acidosis.',
 micro:'Cholera and other secretory diarrhoeas lose bicarbonate-rich stool and cause a normal-gap acidosis; septic shock causes a high-gap lactic acidosis.'}},
{id:'potassium',n:'Potassium',s:'Renal',L:{
 phys:'High K⁺ depolarises the resting potential: peaked T waves, then wide QRS. Low K⁺: flat T waves, U waves. Insulin and β₂ agonists push K⁺ into cells; acidosis pushes it out. Aldosterone and high distal flow push K⁺ into the urine.',
 pharm:'Hyperkalaemia: IV calcium stabilises membranes; insulin plus glucose and salbutamol shift K⁺; loop diuretics, binders and dialysis remove it. ACE inhibitors, spironolactone and trimethoprim raise K⁺.',
 path:'High K⁺: kidney failure, rhabdomyolysis, haemolysis (including a haemolysed sample), adrenal insufficiency, tumour lysis. Low K⁺: vomiting, diuretics, diarrhoea, hyperaldosteronism, and low Mg²⁺, which keeps renal K⁺ channels open, so replace Mg²⁺ first.',
 bio:'About 98% of body K⁺ is inside cells. Insulin and β₂ stimulation activate the Na⁺/K⁺-ATPase, moving K⁺ in; cell lysis releases the store.'}},
{id:'water-balance',n:'Water balance and ADH',s:'Renal',L:{
 phys:'ADH acts on V2 receptors to insert aquaporin-2. SIADH: euvolaemic hyponatraemia with inappropriately concentrated urine. Diabetes insipidus: dilute urine and high plasma osmolality. Osmoreceptors respond to a 1 to 2% rise in osmolality; a large volume loss overrides them.',
 path:'SIADH from small cell lung cancer, CNS disease, lung disease or drugs (SSRIs, carbamazepine, cyclophosphamide). Raising sodium too fast in chronic hyponatraemia (more than about 8 to 10 mmol/L in a day) risks osmotic demyelination syndrome (central pontine myelinolysis).',
 pharm:'Desmopressin treats central DI. Lithium causes nephrogenic DI; thiazides, amiloride and NSAIDs paradoxically reduce its urine volume. Tolvaptan and demeclocycline antagonise ADH.',
 bio:'V2 receptors signal through Gs, cAMP and PKA to move aquaporin-2 vesicles into the apical membrane. X-linked nephrogenic DI is a V2 receptor (AVPR2) defect; the autosomal forms are AQP2 defects.'}},
{id:'nephritic-nephrotic',n:'Glomerular syndromes',s:'Renal',L:{
 path:'Nephritic: haematuria, RBC casts, hypertension, azotaemia (PSGN, IgA, RPGN). Nephrotic: proteinuria above 3.5 g/day, oedema, lipiduria (minimal change, FSGS, membranous, diabetic).',
 phys:'Loss of oncotic pressure drives oedema, helped by primary Na⁺ retention in the nephron. Loss of the charge barrier in minimal change disease lets albumin through selectively.',
 micro:'PSGN follows group A strep after 1 to 3 weeks (throat) or 3 to 6 weeks (skin). Hepatitis B can cause membranous disease and HIV causes collapsing FSGS.',
 bio:'Antithrombin III leaks into urine, so thrombosis risk rises. The liver makes more lipoproteins, so lipids rise.',
 pharm:'Steroids for minimal change. ACE inhibitors and ARBs reduce proteinuria. Consider preventive anticoagulation when albumin is very low, especially in membranous disease.'}}
);
