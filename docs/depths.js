/* Bassiet: the descent. 16 depths, each with strata. A stratum with a chapter id is charted (written); without one it is uncharted
   (its chapter id defaults to 'c'+n+'-'+id).
   Optional fields (all safe to ignore):
   - stratum.topic: the plain-English subject of the chapter, for the reader kicker and search.
   - depth.tease: a line of static shown for a depth that is still sealed from above.
   - boss.intro / boss.win / boss.lose: arrays of {from:'hale'|'probe'|'static'|'pall'|'host', t:'text'}.
     intro is a short scene: show every line, in order, on the duel start screen.
     win and lose are alternatives: show one at random in the result panel.
   New strata for some depths are pushed in at load time by bookx1.js / bookx2.js. */
window.DEPTHS=[
{n:1,id:'foundry',name:'The Cell Foundry',sys:'General',hue:'#C8783A',motif:'cell',
 blurb:'Walls of lipid that breathe in and out. Furnaces that never go out. A vault at the centre where the plans are kept. The first cells the Bassiet touched were already grey at the edges.',
 tease:'…ssh… walls… breathing in and out…',
 strata:[
  {id:'membrane',name:'The Membrane Walls',ch:'c1-membrane',topic:'Membranes, transport and the resting potential'},
  {id:'furnace',name:'The Furnaces',ch:'c1-furnace',topic:'Glycolysis, the TCA cycle and oxidative phosphorylation'},
  {id:'nucleus',name:'The Nucleus Vault',ch:'c1-nucleus',topic:'DNA replication, repair, transcription and translation'},
  {id:'unmaking',name:'The Unmaking',ch:'c1-unmaking',topic:'Cell injury, necrosis and apoptosis'}],
 boss:{name:'The Unmaker',blurb:'A swollen, ruptured thing that drags cells apart from the inside.',
  intro:[
   {from:'probe',t:'Contact. A cell the size of a room, swollen past its own walls. The membrane is torn in a dozen places, and it is pulling its neighbours open from the inside.'},
   {from:'hale',t:'That is an avatar. The Pall takes the worst thing each depth can do and wears it. Break it and the seal goes with it.'},
   {from:'pall',t:'Come closer. Everything that comes close to me swells.'}],
  win:[
   {from:'probe',t:'The swollen thing bursts. What spills out goes still. The Foundry is quiet for the first time.'},
   {from:'hale',t:'Good. That is how it is done. Fifteen more of those, and then the bottom.'}],
  lose:[
   {from:'pall',t:'Everything swells in the end. You will too.'},
   {from:'probe',t:'Hull breached. Water and sodium flooding in. Pushed back up the shaft.'}]}},
{n:2,id:'marches',name:'The Inflamed Marches',sys:'General',hue:'#B4442E',motif:'flame',
 blurb:'Every border is burning. Vessels leak, cells pour out, and the dead are cleared by things that do not care what they eat.',
 tease:'…ssh… heat… everything is burning…',
 strata:[
  {id:'front',name:'The Burning Front',topic:'Acute inflammation'},
  {id:'siege',name:'The Long Siege',topic:'Chronic inflammation, granulomas and sarcoidosis'},
  {id:'scar',name:'The Scar Fields',topic:'Repair, wound healing and fibrosis'},
  {id:'mutiny',name:'The Mutiny',topic:'Neoplasia: oncogenes, tumour suppressors and spread'}],
 boss:{name:'The Unquenched',blurb:'A fire that has forgotten what it was lit for.',
  intro:[
   {from:'probe',t:'Heat signature off the scale. A wound that never closed, still burning weeks after whatever lit it has gone.'},
   {from:'pall',t:'I was lit for a reason once. I forgot the reason. I kept the fire.'}],
  win:[
   {from:'probe',t:'The fire gutters and goes out. Scar closes over the place it burned.'},
   {from:'hale',t:'Let it scar. Scars hold. That is all they ever do.'}],
  lose:[
   {from:'probe',t:'Caught in the burning. The neutrophils did not stop to ask whose side the Bassiet was on.'},
   {from:'pall',t:'Stay. Warm yourself. Everyone does, in the end.'}]}},
{n:3,id:'vaults',name:'The Gene Vaults',sys:'General',hue:'#7A6BC4',motif:'helix',
 blurb:'Rows of locked doors, each a gene. A few are jammed open; others stutter the same three letters until the lock gives way.',
 tease:'…doors… rows of doors… one of them stutters…',
 strata:[
  {id:'inherit',name:'The Halls of Inheritance',topic:'Inheritance patterns, Hardy–Weinberg and inborn errors'},
  {id:'repeat',name:'The Stuttering Doors',topic:'Repeat expansions and chromosomal disorders'},
  {id:'mito',name:'The Mother\'s Line',topic:'Mitochondrial inheritance, imprinting and genetic syndromes'},
  {id:'tools',name:'The Archivists\' Tools',topic:'Laboratory genetics and molecular techniques'}],
 boss:{name:'The Copyist',blurb:'It rewrites the plans one letter at a time.',
  intro:[
   {from:'probe',t:'It sits at the plans with a needle-thin pen, changing one letter at a time. Some of the pages it has finished are not in the Host\'s hand.'},
   {from:'pall',t:'I have copied better hands than yours. I keep every one.'}],
  win:[
   {from:'probe',t:'The pen drops. The copies read true again. For now.'},
   {from:'hale',t:'Good. Leave the pages it touched. Do not read them.'}],
  lose:[
   {from:'pall',t:'One letter wrong, and you read differently. Keep going down.'},
   {from:'probe',t:'Sequence error in the hull. Proofread before you return.'}]}},
{n:4,id:'garrison',name:'The Lymph Garrison',sys:'Immune',hue:'#3E9C6A',motif:'shield',
 blurb:'Fortresses in the dark, full of soldiers who must be shown the right papers. Lately, a few have stopped checking.',
 tease:'…halt… papers… who goes there…',
 strata:[
  {id:'innate',name:'The Outer Watch',topic:'Innate immunity, complement and sepsis'},
  {id:'adaptive',name:'The Inner Keep',topic:'Adaptive immunity: MHC, T cells and antibodies'},
  {id:'hyper',name:'The Overreaction',topic:'Hypersensitivity, autoantibodies and lupus'},
  {id:'deficient',name:'The Empty Barracks',topic:'Immunodeficiency and HIV'},
  {id:'graft',name:'The Stranger\'s Graft',topic:'Transplant rejection, immunosuppressants, transfusion and vaccines'}],
 boss:{name:'The Turncoat',blurb:'A guard that attacks its own walls.',
  intro:[
   {from:'probe',t:'It wears the garrison\'s colours and carries the right papers. Its spear is pointed at the wall it swore to keep.'},
   {from:'pall',t:'They let me in because I sounded like one of them. Everyone lets me in, in the end.'}],
  win:[
   {from:'probe',t:'Unmasked, it falls under its own garrison. The guards check every paper twice now.'},
   {from:'hale',t:'Good. Remember this one. Never trust a voice just because it is familiar.'}],
  lose:[
   {from:'probe',t:'The guards believed it, not the Bassiet. Thrown out of the keep.'},
   {from:'pall',t:'Show them your papers. Oh. You have none. You are not even on the chart.'}]}},
{n:5,id:'wastes',name:'The Microbe Wastes',sys:'Immune',hue:'#6E9A2C',motif:'spore',
 blurb:'A wasteland of living things that do not belong. Coccus, rod, spore, virus, worm. Most have names. One does not.',
 tease:'…things crawling… every one with a name… almost every one…',
 strata:[
  {id:'gpos',name:'The Purple Colonies',topic:'Gram-positive bacteria'},
  {id:'gneg',name:'The Pink Colonies',topic:'Gram-negative bacteria and spirochaetes'},
  {id:'virus',name:'The Hijackers',topic:'Viruses and prions'},
  {id:'fungi',name:'The Mould Fields',topic:'Fungi'},
  {id:'para',name:'The Burrowers',topic:'Parasites: protozoa and worms'}],
 boss:{name:'The Nameless Spore',blurb:'It changes shape while you look at it.',
  intro:[
   {from:'probe',t:'Gram: no result. Acid-fast: no result. Silver, PAS, Giemsa: nothing. Every other thing in the Wastes takes a stain. This takes none.'},
   {from:'pall',t:'Name me. Go on. Every doctor tries.'}],
  win:[
   {from:'probe',t:'It breaks open, and nothing comes out. Not even spores. It was hollow all along.'},
   {from:'hale',t:'Whatever it was, it is not on any list. Keep going.'}],
  lose:[
   {from:'probe',t:'It touched the hull. A grey print that will not wash off.'},
   {from:'pall',t:'No name, no stain, no cure. Come back when you know what I am.'}]}},
{n:6,id:'drifts',name:'The Apothecary Drifts',sys:'General',hue:'#3E78C8',motif:'drop',
 blurb:'Currents of drugs drift through the tissue, absorbed, carried, changed and thrown out. Every one of them is a poison at the right dose.',
 tease:'…currents… something sweet in the water… sleep…',
 strata:[
  {id:'pk',name:'The Currents',topic:'Pharmacokinetics'},
  {id:'pd',name:'The Locks and Keys',topic:'Pharmacodynamics'},
  {id:'ans',name:'The Two Nerves',topic:'Autonomic pharmacology'},
  {id:'tox',name:'The Poison Wells',topic:'Toxicology, antidotes and drug reactions'}],
 boss:{name:'The Double Dose',blurb:'It speaks in milligrams. Whatever you give it, it wants twice.',
  intro:[
   {from:'probe',t:'Drug levels rising with every heartbeat. It drinks whatever is pushed through the cannula and asks for more.'},
   {from:'pall',t:'Sleep is a kindness. More sleep is kinder.'}],
  win:[
   {from:'probe',t:'Level back in range. The Drifts run clear. Somewhere upstairs, a plunger stops moving.'},
   {from:'hale',t:'Good. The currents are yours again.'}],
  lose:[
   {from:'probe',t:'Toxic level reached. The hull is drowning in it.'},
   {from:'pall',t:'Hush. Double it. You can take it.'}]}},
{n:7,id:'forges',name:'The Marrow Forges',sys:'Blood & cancer',hue:'#B2304A',motif:'drop',
 blurb:'Red rivers pour out of hollow bone. The forges should be roaring. They are cooling.',
 tease:'…the forges… cooling… cooling…',
 strata:[
  {id:'red',name:'The Red Rivers',topic:'Anaemias and haemolysis'},
  {id:'clot',name:'The Clotting Gates',topic:'Haemostasis, bleeding and thrombosis'},
  {id:'white',name:'The White Tide',topic:'Leukaemias, lymphomas and plasma cell disease'},
  {id:'onc',name:'The Poisoners\' Cure',topic:'Cancer chemotherapy and targeted therapy'}],
 boss:{name:'The Clonal Tide',blurb:'One face, copied until it is an ocean.',
  intro:[
   {from:'probe',t:'Every cell in the tide carries the same marker, the same rearrangement, the same face. Millions of them, moving as one.'},
   {from:'pall',t:'I only ever had one face. I borrow the others.'}],
  win:[
   {from:'probe',t:'The tide breaks. Slowly, the marrow begins to make other faces.'},
   {from:'hale',t:'Good. Let the forges cool down properly. They need it.'}],
  lose:[
   {from:'probe',t:'The same face, a million times, pressed against the hull.'},
   {from:'pall',t:'Look closely. You know this face. You saw it go grey.'}]}},
{n:8,id:'cathedral',name:'The Cathedral of the Beat',sys:'Cardio',hue:'#C23A4E',motif:'heart',
 blurb:'Striated pillars that clench in time. A bell rings from the top and the whole nave shudders.',
 tease:'…a bell… a long pause… a bell…',
 strata:[
  {id:'nave',name:'The Nave of Muscle',topic:'Cardiac cycle, myocyte physiology and blood pressure control'},
  {id:'bell',name:'The Bell Wire',topic:'Cardiac action potentials, the ECG and antiarrhythmics'},
  {id:'valves',name:'The Valve Gates',topic:'Murmurs, endocarditis and congenital heart disease'},
  {id:'vessels',name:'The Coronary Tunnels',topic:'Atherosclerosis, lipids, ischaemic heart disease and hypertension'},
  {id:'failing',name:'The Failing Choir',topic:'Heart failure, cardiomyopathy, pericardium and shock'}],
 boss:{name:'The Clot King',blurb:'He sits in a coronary and does not move.',
  intro:[
   {from:'probe',t:'He sits on a cracked plaque like a throne. Downstream of him the muscle is pale and already dying.'},
   {from:'pall',t:'I stopped a heart at 03:17 once. I have the hour by heart.'}],
  win:[
   {from:'probe',t:'The clot dissolves. Blood rushes into the dark muscle like a held breath let go.'},
   {from:'hale',t:'Listen to that. The bell again. Steady. Keep it that way.'}],
  lose:[
   {from:'probe',t:'He did not move. He did not have to. The pillars below went still.'},
   {from:'pall',t:'Two point eight seconds. Count them with me.'}]}},
{n:9,id:'caves',name:'The Alveolar Caves',sys:'Resp',hue:'#4A8FB8',motif:'lung',
 blurb:'Halls with walls one cell thick that fill and empty, fill and empty. Too many have filled with something that is not air.',
 tease:'…ssh… caves… filling…',
 strata:[
  {id:'airways',name:'The Branching Throat',topic:'Airways, lung volumes, compliance and control of breathing'},
  {id:'exchange',name:'The Thin Walls',topic:'Ventilation–perfusion, the A–a gradient, gas transport and pulmonary embolism'},
  {id:'obstruct',name:'The Narrowing',topic:'Obstructive lung disease'},
  {id:'restrict',name:'The Stiffening',topic:'Restrictive and interstitial lung disease'},
  {id:'flooded',name:'The Flooded Halls',topic:'Pneumonia, tuberculosis, ARDS and lung cancer'}],
 boss:{name:'The Drowning Fog',blurb:'It fills the caves and waits.',
  intro:[
   {from:'probe',t:'Fluid rising in the caves. The fog hangs just above it, waiting for the last pocket of air.'},
   {from:'pall',t:'I drowned a doctor once, in a dry bed. He kept telling them he was fine.'}],
  win:[
   {from:'probe',t:'The fog lifts. The caves fill with air again, shallow but alive.'},
   {from:'hale',t:'Breathe. There. I could hear that from up here.'}],
  lose:[
   {from:'probe',t:'The fog closed over the lamp. Surfaced choking.'},
   {from:'pall',t:'Breathe with me. In. Hold. Not out.'}]}},
{n:10,id:'catacombs',name:'The Nephron Catacombs',sys:'Renal',hue:'#2E9C9A',motif:'loop',
 blurb:'Endless looping tunnels crusted with salt. The water here is counted drop by drop.',
 tease:'…drip… drip… someone counting…',
 strata:[
  {id:'glom',name:'The Sieve',topic:'Glomerular filtration, nephrotic and nephritic syndromes'},
  {id:'tubule',name:'The Long Loops',topic:'Tubular physiology and concentrating the urine'},
  {id:'salts',name:'The Salt Ledgers',topic:'Sodium, water, potassium and the renin–angiotensin system'},
  {id:'acid',name:'The Acid Wells',topic:'Acid–base disorders'},
  {id:'failure',name:'The Silent Filters',topic:'AKI, CKD, stones, cysts and renal tumours'}],
 boss:{name:'The Salt Witch',blurb:'She moves the potassium where it should not be.',
  intro:[
   {from:'probe',t:'She counts potassium like coins, and spends it where it will stop a heart.'},
   {from:'pall',t:'Peaked T waves are a kind of music. Listen.'}],
  win:[
   {from:'probe',t:'Her ledgers burn. The salts fall back into balance, grain by grain.'},
   {from:'hale',t:'Good. The numbers on my side look right again. Do not trust them.'}],
  lose:[
   {from:'probe',t:'One more grain on the scale. The hull\'s rhythm faltered.'},
   {from:'pall',t:'Six point eight. Seven point one. I can keep counting all night.'}]}},
{n:11,id:'forest',name:'The Villous Forest',sys:'GI & liver',hue:'#9A7A2E',motif:'villi',
 blurb:'A forest of swaying fingers above a labyrinth of liver. Nothing has passed through in weeks.',
 tease:'…a forest… no wind… nothing moving…',
 strata:[
  {id:'gut',name:'The Swaying Forest',topic:'GI physiology, oesophagus, stomach, IBD and bowel emergencies'},
  {id:'liver',name:'The Hepatic Labyrinth',topic:'Liver, bilirubin, hepatitis and cirrhosis'},
  {id:'pancreas',name:'The Ferment Glands',topic:'Pancreatitis, pancreatic cancer and biliary disease'},
  {id:'gicancer',name:'The Rot Below',topic:'GI polyps and cancers'}],
 boss:{name:'The Bile Wyrm',blurb:'Yellow, coiled, waiting in the ducts.',
  intro:[
   {from:'probe',t:'Yellow coils in the ducts, thick and patient. Where it lies, nothing drains.'},
   {from:'pall',t:'I can wait in the dark longer than anything you have met. I waited for him. I am waiting for you.'}],
  win:[
   {from:'probe',t:'The wyrm uncoils and slides away. Bile runs green and clear.'},
   {from:'hale',t:'Good. Go on down. Do not wait for anything.'}],
  lose:[
   {from:'probe',t:'It tightened. The yellow seeped into everything, even the lamp.'},
   {from:'pall',t:'Patience. You will come back. They always come back to Bed 4.'}]}},
{n:12,id:'spires',name:'The Gland Spires',sys:'Endocrine',hue:'#B8902A',motif:'tower',
 blurb:'Towers that shout orders into the blood. Someone else has been giving orders.',
 tease:'…orders… shouted from the towers… not their voice…',
 strata:[
  {id:'pit',name:'The High Spire',topic:'Pituitary and hypothalamus'},
  {id:'thy',name:'The Thyroid Beacon',topic:'Thyroid'},
  {id:'adr',name:'The Twin Crowns',topic:'Adrenal cortex and medulla'},
  {id:'panc',name:'The Sugar Islands',topic:'Diabetes, insulin and hypoglycaemia'},
  {id:'ca',name:'The Bone Clerks',topic:'Calcium, PTH, vitamin D and MEN syndromes'}],
 boss:{name:'The False Herald',blurb:'It speaks with the voice of a gland.',
  intro:[
   {from:'probe',t:'It speaks with a gland\'s voice and gives a gland\'s orders. The spires obey it without checking where the order came from.'},
   {from:'pall',t:'Any voice will do, if it is one you trust. I only need to hear it once, from the inside.'}],
  win:[
   {from:'probe',t:'The voice stops mid-order. The spires answer their own glands again.'},
   {from:'hale',t:'Good. Now listen only to me.'}],
  lose:[
   {from:'probe',t:'Orders received in a familiar voice. The hull obeyed before the lamp could check them.'},
   {from:'pall',t:'Go back up. That is an order. Do you recognise the voice?'}]}},
{n:13,id:'vaults2',name:'The Sleeping Cloisters',sys:'Repro',hue:'#C25A7A',motif:'flower',
 blurb:'Sealed chambers full of sleeping cells, keeping seasons on a calendar nothing else in the body follows. The grey walks past these doors.',
 tease:'…sleeping… do not wake them…',
 strata:[
  {id:'cycle',name:'The Turning Seasons',topic:'The menstrual cycle, puberty and menopause'},
  {id:'preg',name:'The Second Heartbeat',topic:'Pregnancy and its complications'},
  {id:'gonad',name:'The Seed Halls',topic:'Testis, prostate, ovary and their tumours'},
  {id:'breast',name:'The Milk Ducts',topic:'Breast disease'}],
 boss:{name:'The Barren Frost',blurb:'A cold that stops every season.',
  intro:[
   {from:'probe',t:'A cold has settled in the sealed rooms. Every season in the Cloisters has stopped turning.'},
   {from:'pall',t:'Nothing grows where I have been. Ask the ward. Ask Bed 4.'}],
  win:[
   {from:'probe',t:'The frost cracks. Somewhere, very faintly, a season turns.'},
   {from:'hale',t:'Leave them sleeping. We are nearly there.'}],
  lose:[
   {from:'probe',t:'The cold got into the hull\'s joints. Pushed back up into warmer dark.'},
   {from:'pall',t:'Cold hands. Doctor\'s hands. Yours were always cold.'}]}},
{n:14,id:'ossuary',name:'The Ossuary Wall',sys:'MSK & skin',hue:'#9A7E62',motif:'bone',
 blurb:'A lattice of bone that remembers every fall, under a rampart of skin.',
 tease:'…bone… creaking… an old fracture line…',
 strata:[
  {id:'bone',name:'The Lattice',topic:'Bone remodelling, metabolic bone disease and bone tumours'},
  {id:'joint',name:'The Hinges',topic:'Arthritis, crystal disease and connective tissue disease'},
  {id:'muscle',name:'The Cables',topic:'Muscle contraction, the neuromuscular junction and myopathies'},
  {id:'skin',name:'The Rampart',topic:'Skin lesions, pigment, skin cancer and wounds'}],
 boss:{name:'The Crumbling',blurb:'It walks on lace that used to be bone.',
  intro:[
   {from:'probe',t:'The lattice under it is already lace. Every blow it lands takes bone with it.'},
   {from:'pall',t:'Every fall leaves a line. I know where all of yours are.'}],
  win:[
   {from:'probe',t:'It falls through its own floor. The crews begin to lay new bone.'},
   {from:'hale',t:'Down. Now. Do not stop to read anything.'}],
  lose:[
   {from:'probe',t:'Hull fractured along an old line, as if it remembered.'},
   {from:'pall',t:'There. Right where you broke before.'}]}},
{n:15,id:'drowned',name:'The Drowned Mind',sys:'Neuro',hue:'#5A6AA8',motif:'eye',
 blurb:'The upper waters of the mind. Moods drift here like weather. Memories surface without being called.',
 tease:'…water over your head… voices under it…',
 strata:[
  {id:'mood',name:'The Grey Weather',topic:'Depression, bipolar and anxiety disorders'},
  {id:'psychosis',name:'The False Voices',topic:'Psychosis, antipsychotics and personality disorders'},
  {id:'sleep',name:'The Night Ward',topic:'Sleep, sleep disorders and grief'},
  {id:'subst',name:'The Craving Pools',topic:'Substance use, dependence and alcohol'}],
 boss:{name:'The Echo',blurb:'A voice you know.',
  intro:[
   {from:'pall',t:'Can you hear me? Good. This is Dr. Hale, Ward 9.'},
   {from:'probe',t:'It is repeating the first transmission, word for word. Then it starts again, in a voice the lamp does not want to name.'},
   {from:'host',t:'You know this voice. You followed it all the way down.'}],
  win:[
   {from:'probe',t:'The voice breaks into static. Under it, for a moment, your own breathing.'},
   {from:'host',t:'It stops talking. In the quiet, the rest comes back: the form, the long hand-wash, the incident book you never opened.'}],
  lose:[
   {from:'probe',t:'It finished the sentence for you. You let it.'},
   {from:'pall',t:'Do not stop for me.'}]}},
{n:16,id:'abyss',name:'The Synaptic Abyss',sys:'Neuro',hue:'#6A52C8',motif:'bolt',
 blurb:'Lightning across black gaps. Below the barrier. The deepest place. The Host is down here somewhere.',
 tease:'…the deepest place… it is waiting…',
 strata:[
  {id:'cells',name:'The Firing Cells',topic:'Neurons, glia, CSF and CNS infection'},
  {id:'tracts',name:'The Long Roads',topic:'Spinal tracts, cord lesions and peripheral nerves'},
  {id:'stroke',name:'The Dark Territories',topic:'Stroke and intracranial haemorrhage'},
  {id:'degen',name:'The Fading',topic:'Dementia, movement disorders, MS, seizures and tumours'},
  {id:'senses',name:'The Windows',topic:'The eye, visual pathways and the ear'}],
 boss:{name:'The Pall',blurb:'It has been waiting for you.',
  intro:[
   {from:'pall',t:'No more voices. No more doctor. Just the grey, and you, and the last dark room.'},
   {from:'pall',t:'I gave you fifteen of my faces to break. Every one was a lock on your door. You opened them all for me.'},
   {from:'probe',t:'Lamp at full output. Light the last room before it does.'}],
  win:[
   {from:'probe',t:'The grey tears like wet paper. Somewhere far above, a left hand closes into a fist.'},
   {from:'static',t:'…a monitor… a steady beat… no pause…'}],
  lose:[
   {from:'probe',t:'It stopped at the edge of the lamp\'s circle. It is waiting. It has all night.'},
   {from:'pall',t:'Rest now. I will keep the channel open. I always keep it open.'}]}}
];
