/* Bassiet: ties chapters to the newer Atlas sites. The first site listed becomes the chapter's main site.
   Chapters not yet defined when this runs (for example strata added by later files) are linked again once
   the page has parsed, so script order does not matter. Re-running is harmless. */
(function(){
var L={
'c1-membrane':['cell-adaptation','protein-trafficking'],
'c1-nucleus':['dna-repair','oncogenes'],
'c1-unmaking':['cell-adaptation','amyloidosis'],
'c1-metab':['fatty-acids','nucleotides','amino-acids','g6pd','ammonia','lysosomal','glycogen-storage'],
'c2-front':['acute-inflammation','leukocyte-migration'],
'c2-siege':['granuloma'],
'c2-scar':['wound-healing'],
'c2-mutiny':['oncogenes','dna-repair','paraneoplastic','ihc-markers'],
'c3-inherit':['genetic-disorders','lysosomal','glycogen-storage'],
'c3-repeat':['repeat-expansion','aneuploidy','muscle-disease'],
'c3-tools':['dna-repair'],
'c4-innate':['acute-inflammation','leukocyte-migration'],
'c4-adaptive':['mhc-tcells','antibodies'],
'c4-hyper':['autoimmunity'],
'c4-deficient':['immunodeficiency'],
'c4-graft':['transplant','transfusion'],
'c5-gneg':['gram-negatives'],
'c5-virus':['herpesviruses','antivirals'],
'c5-fungi':['fungi'],
'c5-para':['malaria','helminths'],
'c5-drugs':['cell-wall-drugs','ribosome-drugs','dna-folate-drugs','antimicrobial-resistance','antimycobacterials','antivirals','antibiotics'],
'c6-pk':['pharmacokinetics'],
'c6-ans':['autonomic-drugs'],
'c6-tox':['toxicology'],
'c6-sleepers':['general-anaesthetics','local-anaesthetics','nmj-blockers','opioids','analgesics'],
'c7-red':['microcytic','sickle-cell'],
'c7-clot':['platelets'],
'c7-white':['leukaemia','lymphoma','myeloma'],
'c8-valves':['valve-disease','endocarditis','congenital-heart'],
'c8-vessels':['lipids','vasculitis'],
'c8-failing':['cardiomyopathy','shock'],
'c9-obstruct':['asthma'],
'c9-restrict':['interstitial-lung','ards'],
'c9-flooded':['pleura','ards'],
'c10-glom':['gfr'],
'c10-acid':['rta'],
'c10-failure':['aki','ckd','stones','polycystic-kidney'],
'c11-gut':['gi-hormones','malabsorption'],
'c11-liver':['liver-metabolic','gallstones'],
'c11-pancreas':['pancreatitis','gallstones'],
'c11-gicancer':['colorectal-cancer'],
'c12-pit':['pituitary'],
'c12-thy':['thyroid-cancer'],
'c12-adr':['cushing','hyperaldosteronism','men'],
'c12-panc':['diabetes-drugs','hypoglycaemia'],
'c12-ca':['bone-disease','men'],
'c13-cycle':['menstrual-cycle','pcos'],
'c13-preg':['pregnancy','preeclampsia','trophoblastic'],
'c13-gonad':['testis','ovarian-tumours','prostate','cervix-uterus'],
'c13-breast':['breast'],
'c13-origins':['sex-development','gametogenesis'],
'c14-bone':['osteoporosis','bone-disease'],
'c14-joint':['rheumatoid-arthritis','osteoarthritis','spondyloarthritis','connective-tissue'],
'c14-muscle':['muscle-disease','rhabdomyolysis'],
'c14-skin':['blistering','skin-cancer'],
'c14-frame':['upper-limb','lower-limb','paediatric-ortho','bone-disease'],
'c15-mood':['mood-disorders'],
'c15-psychosis':['psychosis','personality-disorders'],
'c15-sleep':['sleep'],
'c15-subst':['substance-use'],
'c15-young':['adhd','autism','childhood-behaviour','eating-disorders','personality-disorders'],
'c16-cells':['epilepsy'],
'c16-tracts':['spinal-cord','multiple-sclerosis'],
'c16-stroke':['stroke','brainstem','herniation'],
'c16-degen':['dementia','multiple-sclerosis'],
'c16-senses':['eye-ear','cranial-nerves'],
'c16-nerves':['cranial-nerves','brainstem','cortical-syndromes','herniation']
};
function apply(){
  var B=window.BOOK||{};
  Object.keys(L).forEach(function(k){
    var b=B[k]; if(!b) return;
    var old=b.c||[], add=L[k];
    b.c=add.concat(old.filter(function(x){return add.indexOf(x)<0}));
  });
}
apply();
window.applyChapterLinks=apply;
if(typeof document!=='undefined'&&document.addEventListener){
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply);
  window.addEventListener('load',apply);
}
})();
