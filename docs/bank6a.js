/* Bassiet content, part 6a: new sites for General, Immune. Original wording. */
window.BANK = window.BANK || {C:[],E:[],CH:[],PT:[],CP:[]};
BANK.C.push(
{id:'acute-inflammation',n:'Acute inflammation',s:'General',L:{
 path:'Fluid and neutrophils within hours: redness and heat from arteriolar dilation, swelling from leaky venules, pain from bradykinin and PGE₂. Ends in resolution, abscess, scar or chronic inflammation.',
 phys:'Exudate is protein-rich because the endothelium is damaged; transudate is protein-poor and comes from pressure changes.',
 pharm:'NSAIDs remove prostaglandins; corticosteroids block phospholipase A₂ and NF-κB.',
 micro:'Toll-like receptors read microbial patterns (TLR4 for LPS) and switch on NF-κB.'}},
{id:'leukocyte-migration',n:'Neutrophil migration and killing',s:'General',L:{
 path:'Rolling (selectins), tight adhesion (integrins on ICAM-1), transmigration (PECAM-1), chemotaxis (C5a, IL-8, LTB₄). LAD type 1 lacks CD18.',
 bio:'NADPH oxidase makes superoxide; myeloperoxidase turns H₂O₂ into hypochlorite. Chronic granulomatous disease lacks NADPH oxidase.',
 micro:'In CGD, catalase-positive organisms (S. aureus, Aspergillus, Serratia, Nocardia) cause recurrent abscesses.'}},
{id:'granuloma',n:'Granulomas',s:'General',L:{
 path:'Epithelioid macrophages and giant cells ringed by lymphocytes. Caseating: TB, fungi. Non-caseating: sarcoidosis, Crohn, berylliosis, foreign body. Necrotising and stellate: cat scratch disease (Bartonella).',
 phys:'Macrophage IL-12 makes Th1 cells; their IFN-γ activates macrophages; TNF holds the granuloma together.',
 pharm:'Anti-TNF drugs can reactivate latent TB: screen first.'}},
{id:'wound-healing',n:'Repair and scarring',s:'General',L:{
 path:'Granulation tissue from day 3 (new vessels, fibroblasts, type III collagen), replaced by type I collagen. Keloids grow beyond the wound; hypertrophic scars stay within it.',
 bio:'Collagen needs vitamin C (hydroxylation), copper (lysyl oxidase cross-linking) and zinc (remodelling).',
 phys:'Labile cells regenerate, stable cells can re-enter the cycle, permanent cells (neurons, cardiac muscle) scar.'}},
{id:'cell-adaptation',n:'Cell adaptations',s:'General',L:{
 path:'Hypertrophy (size), hyperplasia (number), atrophy, metaplasia (Barrett, smoker\'s bronchi, schistosomal bladder). Dysplasia is disordered growth and can precede cancer.',
 bio:'Atrophy uses the ubiquitin-proteasome system and autophagy.'}},
{id:'amyloidosis',n:'Amyloidosis',s:'General',L:{
 path:'Misfolded β-pleated sheet proteins deposit outside cells: Congo red with apple-green birefringence. AL (light chains, myeloma), AA (chronic inflammation), transthyretin (heart), β₂-microglobulin (dialysis), Aβ (Alzheimer), amylin (type 2 diabetes).',
 phys:'Restrictive cardiomyopathy with low ECG voltage, nephrotic syndrome, macroglossia, neuropathy, hepatosplenomegaly.',
 pharm:'Tafamidis stabilises transthyretin; patisiran silences it.'}},
{id:'oncogenes',n:'Oncogenes and tumour suppressors',s:'General',L:{
 path:'Oncogenes need one hit (RAS, MYC, HER2, BCR-ABL, BCL2, BRAF); suppressors need two (RB1, TP53, APC, VHL, NF1, BRCA). Carcinomas spread by lymph, sarcomas by blood.',
 pharm:'Targeted drugs: imatinib, trastuzumab, vemurafenib, cetuximab (RAS wild-type only), bevacizumab.',
 micro:'Oncogenic microbes: HPV, EBV, HBV, HCV, HHV-8, HTLV-1, H. pylori.'}},
{id:'dna-repair',n:'DNA repair defects',s:'General',L:{
 bio:'Mismatch repair (Lynch), nucleotide excision (xeroderma pigmentosum), base excision (MUTYH), homologous recombination (BRCA), end joining and break sensing (ataxia telangiectasia), cross-link repair (Fanconi).',
 pharm:'PARP inhibitors (olaparib) kill BRCA-deficient cells by synthetic lethality.',
 path:'Defective repair raises cancer risk in the tissues each pathway protects.'}},
{id:'repeat-expansion',n:'Trinucleotide repeat diseases',s:'General',L:{
 bio:'Huntington (CAG, paternal expansion), fragile X (CGG, maternal), myotonic dystrophy (CTG), Friedreich ataxia (GAA, recessive). Longer repeats appear earlier: anticipation.',
 path:'Huntington: caudate atrophy, chorea, dementia. Fragile X: intellectual disability, large ears and testes. Friedreich: ataxia with hypertrophic cardiomyopathy and diabetes.'}},
{id:'aneuploidy',n:'Chromosome number disorders',s:'General',L:{
 path:'Down (trisomy 21: AV canal defects, duodenal atresia, leukaemia, early Alzheimer), Edwards (18), Patau (13), Turner (45,X), Klinefelter (47,XXY). 22q11.2 deletion: thymic and parathyroid aplasia, conotruncal defects.',
 phys:'First-trimester screen in Down syndrome: high nuchal translucency, low PAPP-A, high hCG.',
 bio:'Most aneuploidy comes from meiotic non-disjunction, rising with maternal age.'}},
{id:'pharmacokinetics',n:'Pharmacokinetics',s:'General',L:{
 pharm:'Vd = amount/concentration; clearance = 0.7 × Vd/t½; loading dose depends on Vd, maintenance on clearance; steady state after 4–5 half-lives. Zero-order: phenytoin, ethanol, high-dose aspirin.',
 bio:'Phase I (CYP450) then phase II (conjugation). Inducers lower and inhibitors raise levels of drugs such as warfarin, ciclosporin and statins.'}},
{id:'autonomic-drugs',n:'Autonomic drugs',s:'General',L:{
 pharm:'Cholinergic agonists, cholinesterase inhibitors, antimuscarinics; α and β agonists and blockers. Organophosphates: atropine and pralidoxime. Pheochromocytoma: α-block before β-block.',
 phys:'Gq (α₁, M₁, M₃, H₁, V₁), Gi (α₂, M₂, D₂), Gs (β, D₁, H₂, V₂). A pure α₁ agonist slows the heart by reflex.'}},
{id:'toxicology',n:'Poisons and antidotes',s:'General',L:{
 pharm:'Paracetamol: N-acetylcysteine. Methanol and ethylene glycol: fomepizole. Cyanide: hydroxocobalamin. Methaemoglobin: methylene blue. TCA: bicarbonate. Digoxin: Fab fragments. Iron: deferoxamine. Lead: succimer or EDTA.',
 bio:'Paracetamol overdose exhausts glutathione so NAPQI destroys zone 3 hepatocytes.',
 phys:'Salicylates cause respiratory alkalosis first, then an anion gap metabolic acidosis.'}},
{id:'mhc-tcells',n:'MHC and T cells',s:'Immune',L:{
 phys:'MHC I (all nucleated cells) shows cytosolic peptides to CD8 cells; MHC II (antigen-presenting cells) shows endosomal peptides to CD4 cells. Activation needs a second signal (B7–CD28).',
 path:'Thymic positive selection (cortex) and negative selection (medulla, AIRE). Th1 (IFN-γ), Th2 (IL-4, IL-5, IL-13), Th17 (IL-17), Treg (FOXP3).',
 pharm:'Checkpoint inhibitors (anti-PD-1, anti-CTLA-4) release T-cell brakes and cause autoimmune side effects.'}},
{id:'antibodies',n:'Antibodies and B cells',s:'Immune',L:{
 phys:'IgM first and best at complement; IgG crosses the placenta and opsonises; IgA in secretions; IgE on mast cells. Class switching needs CD40–CD40L.',
 bio:'V(D)J recombination by RAG1/2 creates diversity; somatic hypermutation in germinal centres improves affinity.',
 micro:'Conjugate vaccines link polysaccharide to protein so infants under 2 make T-dependent responses.'}},
{id:'immunodeficiency',n:'Primary immunodeficiencies',s:'Immune',L:{
 path:'Bruton (BTK, no B cells), selective IgA (transfusion anaphylaxis), CVID, hyper-IgM (CD40L), DiGeorge (no thymus), SCID (no T or B function), Wiskott-Aldrich (eczema, small platelets), ataxia telangiectasia, LAD, CGD, Chédiak-Higashi.',
 micro:'B-cell defects: encapsulated bacteria after 6 months. T-cell defects: viruses, fungi, Pneumocystis from infancy. Complement C5–C9: Neisseria.',
 pharm:'No live vaccines in T-cell or combined defects; immunoglobulin replacement for antibody defects.'}},
{id:'transplant',n:'Transplant rejection',s:'Immune',L:{
 path:'Hyperacute (minutes, pre-formed antibodies), acute (weeks, T cells or new antibodies), chronic (months, fibrosis and vascular narrowing), graft-versus-host (donor T cells).',
 pharm:'Ciclosporin and tacrolimus (calcineurin: nephrotoxic), sirolimus (mTOR), mycophenolate (IMP dehydrogenase), azathioprine (purine), steroids. CYP3A4 interactions matter.'}},
{id:'transfusion',n:'Blood groups and transfusion reactions',s:'Immune',L:{
 path:'Acute haemolytic (ABO, intravascular), febrile non-haemolytic (white cell cytokines), allergic, TRALI (donor antibodies, non-cardiogenic oedema), TACO (overload), delayed haemolytic.',
 phys:'O has anti-A and anti-B (universal red cell donor); AB plasma is the universal plasma donor. Anti-D prevents Rh sensitisation.'}},
{id:'autoimmunity',n:'Autoimmunity and lupus',s:'Immune',L:{
 path:'SLE: immune complex (type III) disease; ANA, anti-dsDNA (nephritis), anti-Smith; low C3 and C4 in flares; Libman-Sacks endocarditis; antiphospholipid syndrome.',
 pharm:'Hydroxychloroquine for nearly all; steroids, mycophenolate or cyclophosphamide for nephritis; belimumab. Drug-induced lupus (hydralazine, procainamide, isoniazid): anti-histone.',
 bio:'Defective clearance of apoptotic debris and early complement deficiency (C1q, C2, C4) predispose.'}},
{id:'herpesviruses',n:'Herpesviruses',s:'Immune',L:{
 micro:'All establish latency. HSV-1 (encephalitis, keratitis), HSV-2, VZV (shingles), EBV (mononucleosis, CD21, Burkitt, Hodgkin, nasopharyngeal), CMV (congenital, retinitis), HHV-6 (roseola), HHV-8 (Kaposi).',
 pharm:'Aciclovir needs viral thymidine kinase; ganciclovir needs CMV UL97; foscarnet needs no activation (nephrotoxic).',
 path:'Owl-eye inclusions (CMV), Cowdry A inclusions (HSV, VZV), multinucleated giant cells on Tzanck smear.'}},
{id:'gram-negatives',n:'Gram-negative rods and endotoxin',s:'Immune',L:{
 micro:'E. coli (urinary infection, EHEC O157:H7 and HUS), Klebsiella (aspiration, capsule), Salmonella (typhoid, sickle cell osteomyelitis), Shigella, Pseudomonas (burns, CF, ventilators), Proteus (struvite stones), Campylobacter (Guillain-Barré), H. pylori.',
 path:'Lipid A binds TLR4: fever, hypotension, DIC.',
 pharm:'Pseudomonas cover: piperacillin-tazobactam, ceftazidime, cefepime, carbapenems, aminoglycosides, ciprofloxacin, aztreonam.'}},
{id:'fungi',n:'Fungal infections',s:'Immune',L:{
 micro:'Dimorphic: Histoplasma (bats, caves), Blastomyces (broad-based buds), Coccidioides (spherules, desert). Opportunists: Candida, Aspergillus (45° septate), Cryptococcus (capsule, AIDS meningitis), Mucor (right-angle non-septate, DKA), Pneumocystis.',
 pharm:'Amphotericin (ergosterol pores; nephrotoxic, low K⁺ and Mg²⁺), azoles (14α-demethylase), echinocandins (β-glucan), flucytosine, terbinafine.',
 bio:'Fungal membranes use ergosterol instead of cholesterol, the basis of selectivity.'}},
{id:'malaria',n:'Malaria and protozoa',s:'Immune',L:{
 micro:'Plasmodium falciparum (cerebral malaria, banana gametocytes), vivax and ovale (hypnozoites, relapse). Giardia, Entamoeba, Cryptosporidium, Toxoplasma, Trypanosoma, Leishmania, Babesia.',
 pharm:'Chloroquine, artemisinin combinations, IV artesunate for severe disease, primaquine for hypnozoites (check G6PD). Metronidazole for Giardia, Entamoeba, Trichomonas.',
 bio:'Sickle trait and G6PD deficiency protect against falciparum malaria.'}},
{id:'helminths',n:'Worms',s:'Immune',L:{
 micro:'Enterobius (pinworm), Ascaris, Strongyloides (hyperinfection with steroids), hookworm (iron deficiency), Trichinella, Taenia solium (neurocysticercosis), Echinococcus, Schistosoma (bladder cancer, portal fibrosis), Clonorchis.',
 phys:'Th2 response: IgE, eosinophils, mast cells.',
 pharm:'Albendazole and mebendazole (microtubules), ivermectin (Strongyloides, Onchocerca), praziquantel (flukes and tapeworms).'}}
);
