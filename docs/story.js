/* Bassiet story. SPOILERS. Transmissions, Host file fragments and the ending.
   Triggers (STORY.T[].at):
     start, enter:<depth>, ch:<chapterId>, seal:<depth>   story beats (shown on Dive home and in the Radio log)
     miss          a wrong stain-test answer
     duellose      a lost duel (alias 'duel-lose' is generated below)
     restain       a successful re-stain of a fading stratum
     fading        stains are fading on the home screen
     return        back after more than two days away
     night         a visit between 00:00 and 05:00
     night317      a visit between 03:10 and 03:25 (use instead of night)
     first         first-week line for the dive log
     after         ambient lines once the descent is complete (seal 16)
     missafter     miss lines once the descent is complete (seal 16)
   Lines in T are in story order; the Radio log can show them top to bottom as they are.
   from: 'hale' (the ward doctor on the radio), 'probe' (the Bassiet's own log), 'host' (a memory or Host file voice),
         'static', 'pall' (the unnamed voice, shown as '—').
   STORY.H: the Host file, revealed by the same start/ch/enter/seal triggers.
   STORY.END: the ending sequence, played line by line after the final seal.
   STORY.unmask: after its trigger, label every 'hale' line with who.hale instead.
   STORY.GRADE: dive-log grade lines by voice (hale, then pall after seal 15, then after for the post-game). */
window.STORY={
doctor:'Dr. Emil Hale',ward:'Ward 9',bed:'Bed 4',
T:[
/* ---------- prologue ---------- */
{id:'p1',at:'start',from:'static',t:'…carrier found. Channel 3. Hold the lamp steady.'},
{id:'p2',at:'start',from:'hale',t:'Can you hear me? Good. This is Dr. Hale, Ward 9. You are inside the patient now. The Bassiet went in through the cannula on the left hand.'},
{id:'p3',at:'start',from:'hale',t:'We call the patient the Host. No name on the chart yet. Every system is failing, and something grey is moving through the tissue. We call it the Pall.'},
{id:'p4',at:'start',from:'hale',t:'Your lamp carries five stains: violet for disease, green for microbes, blue for drugs, teal for chemistry, rose for function. Read each stratum, then hold the lamp to it in its stain test. Six right in every ten and the stain takes. Stain every stratum in a depth, break the thing that guards its seal, and you go deeper. I will talk you through it.'},

/* ---------- depth 1: the Cell Foundry ---------- */
{id:'d1a',at:'enter:1',from:'hale',t:'The Cell Foundry. Walls, furnaces, a nucleus like a vault. Start at the membrane. Everything else depends on what crosses it.'},
{id:'d1b',at:'ch:c1-membrane',from:'hale',t:'Good. The pumps are slowing in the grey patches. When the ATP fails, the walls swell. Remember that. You will see it everywhere down there.'},
{id:'d1c',at:'ch:c1-furnace',from:'hale',t:'The furnaces are still burning in most cells. The Host is young. Strong. Odd that the cortisol rhythm is flattened, like someone who never sleeps at night.'},
{id:'d1d',at:'ch:c1-nucleus',from:'hale',t:'Read the strands carefully. If the Pall gets into the vault, it writes itself into the copies.'},
{id:'d1e',at:'ch:c1-unmaking',from:'hale',t:'You have seen a cell die both ways now. Swelling and rupture, or the quiet, tidy kind. The Pall makes the ugly kind. Seal this depth and go on.'},
{id:'x1a',at:'ch:c1-metab',from:'probe',t:'Furnace ledgers recovered: every sugar, fat and amino acid the Host ever burned, in columns. The last pages are written in a different hand.'},
{id:'d1f',at:'seal:1',from:'probe',t:'Membrane breached. Pressure equalised. Descending.'},
{id:'d1g',at:'seal:1',from:'hale',t:'Well done. I heard the seal go from up here. Keep opening them for me.'},

/* ---------- depth 2: the Inflamed Marches ---------- */
{id:'d2a',at:'enter:2',from:'hale',t:'The Inflamed Marches. The Host is fighting on every front. Do not get in the way of the neutrophils. They will not ask whose side you are on.'},
{id:'x2a',at:'ch:c2-front',from:'hale',t:'Neutrophils in the first day, macrophages by the second. That is how a fire should burn. The Host has had both for weeks, and still something keeps calling them back.'},
{id:'x2b',at:'ch:c2-siege',from:'hale',t:'A granuloma is a prison the body builds around a guest it cannot kill. Count them. The Host has been keeping prisoners for a while.'},
{id:'x2c',at:'ch:c2-scar',from:'hale',t:'Scars hold. That is all they do. I have one on my finger from the night I— Never mind. Keep moving.'},
{id:'x2d',at:'ch:c2-mutiny',from:'probe',t:'Mitotic figures in a district that should be resting. Logged as dysplasia, not yet a mutiny. Something here is teaching cells to forget their orders.'},
{id:'d2b',at:'seal:2',from:'hale',t:'A small scar on the left index finger. Clean. A needle went in there. Not years ago. Months, at most. Keep going.'},

/* ---------- depth 3: the Gene Vaults ---------- */
{id:'d3a',at:'enter:3',from:'hale',t:'The Gene Vaults. Do not touch anything you do not understand. Some doors only open once.'},
{id:'x3a',at:'ch:c3-inherit',from:'hale',t:'Everything the Host is, written down. Read all of it. I want to know what is written in there.'},
{id:'x3b',at:'ch:c3-repeat',from:'hale',t:'Count the repeats before you touch a door. Under forty-five, it holds. Past two hundred, it is bricked shut and silenced for good. In between, it waits for the next generation.'},
{id:'x3c',at:'ch:c3-mito',from:'probe',t:'Mitochondrial genome read. Maternal line only. Every furnace in the Host was lit by a mother. Elsewhere in the vault, one page is in the wrong handwriting.'},
{id:'x3d',at:'ch:c3-tools',from:'static',t:'…PCR… thirty-five cycles… no product… run it again… …still nothing… …it has no sequence of its own… only borrowed ones…'},
{id:'d3b',at:'seal:3',from:'hale',t:'Your lamp flickered at the same moment as my monitor. 03:17. Coincidence. The power here is old.'},

/* ---------- depth 4: the Lymph Garrison ---------- */
{id:'d4a',at:'enter:4',from:'hale',t:'The Lymph Garrison. They will test you at the gates. Show them the right markers.'},
{id:'x4a',at:'ch:c4-innate',from:'probe',t:'Complement on the grey: none. Natural killers pass it like a wall. The outer watch does not see an enemy. It sees self.'},
{id:'x4b',at:'ch:c4-adaptive',from:'probe',t:'Memory T cells active against an antigen with no match in any library. Exposure estimated: a single night.'},
{id:'x4c',at:'ch:c4-hyper',from:'hale',t:'Guards that cannot tell friend from stranger are worse than none. The dangerous ones carry the right papers. Mind who you trust down there.'},
{id:'x4d',at:'ch:c4-deficient',from:'probe',t:'Barracks count: B cells present, T cells present, CD4 610, complement present. The garrison is full. It is simply not looking at the grey.'},
{id:'x4e',at:'ch:c4-graft',from:'hale',t:'The guards here are tolerating a stranger. They never tolerate strangers. I have never seen them so polite.'},
{id:'d4b',at:'seal:4',from:'hale',t:'Antibodies to hepatitis B surface antigen, high titre, no core antibody. Vaccinated. The Host worked somewhere they make you get that.'},

/* ---------- depth 5: the Microbe Wastes ---------- */
{id:'d5a',at:'enter:5',from:'hale',t:'The Microbe Wastes. Most of what lives here has a name and a Gram stain. Learn them all. Then you will know what does not fit.'},
{id:'x5a',at:'ch:c5-gpos',from:'static',t:'…clusters… chains… the violet holds in the thick walls… …the grey does not hold anything…'},
{id:'x5b',at:'ch:c5-gneg',from:'hale',t:'Lipid A in the outer wall, and the whole body catches fire. The Host\'s fever looks exactly like that. The blood cultures say it is not.'},
{id:'x5c',at:'ch:c5-virus',from:'hale',t:'These hide inside the cells you came to save. Remember that trick. Something else down there learned it too.'},
{id:'x5d',at:'ch:c5-fungi',from:'static',t:'…spores on the air… …do not breathe them… …lamp low…'},
{id:'x5e',at:'ch:c5-para',from:'hale',t:'I used to tell students the worst parasites are the ones that make you protect them. I do not remember which students.'},
{id:'x5f',at:'ch:c5-drugs',from:'hale',t:'Every antibiotic in the cupboard has gone through that cannula. Nothing touches the grey. You cannot kill a thing with a drug when it is made of people.'},
{id:'d5b',at:'seal:5',from:'hale',t:'I had a fever like this. Night sweats, the grey taste. Not long ago. It felt like a long time. Do not stop for me.'},

/* ---------- depth 6: the Apothecary Drifts ---------- */
{id:'d6a',at:'enter:6',from:'hale',t:'The Apothecary Drifts. Every drug I give the Host passes through here. Watch what they do.'},
{id:'x6a',at:'ch:c6-pk',from:'probe',t:'Clearance falling, half-lives lengthening. Whatever is given topside stays longer down here. Midazolam level: higher than anything on the chart explains.'},
{id:'x6b',at:'ch:c6-pd',from:'hale',t:'Every key fits a lock. Funny. I can feel them turning. From up here.'},
{id:'x6c',at:'ch:c6-ans',from:'static',t:'…pupils pinpoint… …pulse forty… …then a hundred and forty… …someone is playing both wires…'},
{id:'x6d',at:'ch:c6-tox',from:'hale',t:'Learn the antidotes by heart. Down here there is no time to look anything up. Flumazenil reverses the sleep. Do not ask for it. You will not need it.'},
{id:'x6e',at:'ch:c6-sleepers',from:'hale',t:'Sedation is a kindness. A sleeping Host does not fight, does not feel, does not wake at the wrong moment. If they offer more, take it.'},
{id:'d6b',at:'seal:6',from:'hale',t:'Double the midazolam. No, listen. Double it. The Host can take it. The Host has to stay asleep.'},
{id:'d6c',at:'seal:6',from:'probe',t:'Dose advice outside every reference range. Logged. Not applied.'},

/* ---------- depth 7: the Marrow Forges ---------- */
{id:'d7a',at:'enter:7',from:'hale',t:'The Marrow Forges. The Host is making blood too slowly. You will see why.'},
{id:'x7a',at:'ch:c7-red',from:'probe',t:'Haemoglobin 82 g/L. Reticulocytes low. Ferritin high, transferrin saturation low. The forges are sitting on iron and will not use it.'},
{id:'x7b',at:'ch:c7-clot',from:'probe',t:'Platelets 31 ×10⁹/L. Fibrinogen low. D-dimer off the scale. The gates are closing everywhere, then nowhere.'},
{id:'x7c',at:'ch:c7-white',from:'hale',t:'I have seen a film like this before. Grey bodies in the lymphocytes. Same ward. Same bed.'},
{id:'x7d',at:'ch:c7-onc',from:'probe',t:'Latency check: topside transmissions arrive 0 ms after the lamp moves. Expected from the surface: 40 ms. Logged.'},
{id:'d7b',at:'seal:7',from:'probe',t:'Foreign record found in a lymphocyte\'s memory: "HALE, E. Ward 9. Admitted febrile." Source unknown.'},
{id:'d7c',at:'seal:7',from:'hale',t:'That is not a record. That is noise. Keep going down.'},

/* ---------- depth 8: the Cathedral of the Beat ---------- */
{id:'d8a',at:'enter:8',from:'hale',t:'The Cathedral of the Beat. Listen to it. Strong. It should not be failing.'},
{id:'x8a',at:'ch:c8-nave',from:'static',t:'…lub… dub… …lub… dub… …and a third sound, just after the second… like someone stepping in close behind you…'},
{id:'x8b',at:'ch:c8-bell',from:'probe',t:'Rhythm strip: sinus, 112 a minute. A pause of 2.8 seconds at 03:17. Then the bell rang again.'},
{id:'x8c',at:'ch:c8-valves',from:'hale',t:'Listen at the apex. Listen at the base. You learn a leaking valve the way you learn a voice. After a while you would know it anywhere.'},
{id:'x8d',at:'ch:c8-vessels',from:'hale',t:'Plaques this thick at the Host\'s age. Coffee, no sleep, nights on call. I used to warn them about that on the ward.'},
{id:'x8e',at:'ch:c8-failing',from:'hale',t:'Heart failure is drowning in a dry bed. I watched it happen once. Very close. Closer than I wanted.'},
{id:'d8b',at:'seal:8',from:'hale',t:'You are close to the lungs now. I can almost hear you breathe. Strange thing to say about a probe.'},

/* ---------- depth 9: the Alveolar Caves ---------- */
{id:'d9a',at:'enter:9',from:'hale',t:'The Alveolar Caves. The Pall is thick here. It came in on a breath, or a needle. One of the two.'},
{id:'x9a',at:'ch:c9-airways',from:'probe',t:'Respiratory rate 28. Tidal volume falling. The Host is breathing in time with the radio static. Checked three times.'},
{id:'x9b',at:'ch:c9-exchange',from:'probe',t:'Saturation 88% on room air. A–a gradient widening. The walls are thickening while the lamp is on them.'},
{id:'x9c',at:'ch:c9-obstruct',from:'static',t:'…breathe in… …hold… …it will not come out…'},
{id:'x9d',at:'ch:c9-restrict',from:'static',t:'…cannot… breathe… Bed 4… why is no one coming… …ssshh…'},
{id:'x9e',at:'ch:c9-flooded',from:'hale',t:'At three in the morning every film looks like this. White where it should be black. I looked at one like it for a long time, once. Then they turned the lights off.'},
{id:'d9b',at:'seal:9',from:'probe',t:'Radio carrier traced. Topside receiver: no power draw recorded since 03/03.'},

/* ---------- depth 10: the Nephron Catacombs ---------- */
{id:'d10a',at:'enter:10',from:'hale',t:'The Nephron Catacombs. Do not trust the numbers on my side. Trust what you see.'},
{id:'x10a',at:'ch:c10-glom',from:'probe',t:'Urine: protein 2+, blood 3+, red cell casts. The sieve is tearing from the inside.'},
{id:'x10b',at:'ch:c10-tubule',from:'hale',t:'Down the loop and up again. The water leaves, the salt stays, and what is left gets stronger. Grief works the same way.'},
{id:'x10c',at:'ch:c10-salts',from:'probe',t:'Signal triangulated. Origin: not topside. Origin: inside the Host, moving with the grey.'},
{id:'x10d',at:'ch:c10-acid',from:'probe',t:'Gas: pH 7.31, bicarbonate 14, pCO₂ 29. Sodium 138, chloride 102: anion gap 22. Lactate 6.1. The lungs are blowing off acid exactly as fast as Winter says they should. Nothing else wrong. Yet.'},
{id:'x10e',at:'ch:c10-failure',from:'hale',t:'Eleven millilitres of urine in the last hour. The tunnels are going quiet. Keep your lamp low.'},
{id:'d10b',at:'seal:10',from:'hale',t:'Why do you keep checking the receiver? I am right here. I am always right here.'},

/* ---------- depth 11: the Villous Forest ---------- */
{id:'d11a',at:'enter:11',from:'hale',t:'The Villous Forest. Everything the Host ate passes here. Nothing has passed for weeks.'},
{id:'x11a',at:'ch:c11-gut',from:'probe',t:'Villi flattened. Crypts deep and empty. Nothing has been eaten here for weeks. The forest is starving with its mouth open.'},
{id:'x11b',at:'ch:c11-liver',from:'probe',t:'Bilirubin rising. Albumin falling. INR 1.9. The labyrinth is losing rooms.'},
{id:'x11c',at:'ch:c11-pancreas',from:'hale',t:'I am not hungry. I have not been hungry since March. Is that strange?'},
{id:'x11d',at:'ch:c11-gicancer',from:'static',t:'…something growing under the floor… …slowly… …it has all the time in the world…'},
{id:'d11b',at:'seal:11',from:'probe',t:'Hepatic memory: meals between 22:00 and 04:00 for years, eaten standing up. Caffeine at every hour. The Host kept the hours of someone who gets paged.'},

/* ---------- depth 12: the Gland Spires ---------- */
{id:'d12a',at:'enter:12',from:'hale',t:'The Gland Spires. The signals are wrong. Like someone else is giving the orders.'},
{id:'x12a',at:'ch:c12-pit',from:'probe',t:'Prolactin raised. Cortisol with no morning peak. The high spire is taking orders on a frequency the hypothalamus does not use.'},
{id:'x12b',at:'ch:c12-thy',from:'hale',t:'Too bright and the furnaces race. Too dim and the Host goes cold. Someone keeps touching the switch.'},
{id:'x12c',at:'ch:c12-adr',from:'hale',t:'Do not listen to the glands. Listen to me. I am the only voice down there that wants you to reach the bottom.'},
{id:'x12d',at:'ch:c12-panc',from:'probe',t:'Glucose 2.1 mmol/L at 03:20. Insulin high. C-peptide undetectable. Sulfonylurea screen negative. The insulin came from outside the Host. None is on the chart.'},
{id:'x12e',at:'ch:c12-ca',from:'hale',t:'Calcium is a ledger. Everything taken is written down somewhere. Everything. Remember that when you reach the bottom.'},
{id:'d12c',at:'seal:12',from:'probe',t:'Optical, external, through the left pupil: a figure at the bedside. Grey to the lips. No heat signature.'},
{id:'d12b',at:'seal:12',from:'hale',t:'You should not be able to see me from there.'},

/* ---------- depth 13: the Sleeping Cloisters ---------- */
{id:'d13a',at:'enter:13',from:'hale',t:'The Sleeping Cloisters. Quiet. Nothing in here is mine to want. Walk through. What I want is further down.'},
{id:'x13a',at:'ch:c13-cycle',from:'hale',t:'Stop looking up for me. I am not up there.'},
{id:'x13b',at:'ch:c13-preg',from:'hale',t:'A body that carries another changes everything to fit it. I have been carried for months. Ask the Cloisters what that does to a body.'},
{id:'x13c',at:'ch:c13-gonad',from:'static',t:'…sleeping cells… …do not wake them… …ssss… …someone is walking the halls in soft shoes…'},
{id:'x13d',at:'ch:c13-breast',from:'probe',t:'Ducts sealed. No lesion. The lamp passes through without catching on anything. The only clean rooms in the Host.'},
{id:'x13e',at:'ch:c13-origins',from:'probe',t:'Records from before the Host had a name: one cell, then two, then a body folding itself into shape. The grey is in none of them. Once, the Host belonged entirely to themself.'},
{id:'d13b',at:'seal:13',from:'probe',t:'Wristband scan, external, Bed 4. Name field partly legible: B A S S . . T.'},

/* ---------- depth 14: the Ossuary Wall ---------- */
{id:'d14a',at:'enter:14',from:'hale',t:'The Ossuary Wall. The bone remembers every fall. Read it.'},
{id:'x14a',at:'ch:c14-bone',from:'hale',t:'Bone keeps the slowest records. Read it like tree rings. Every bad winter is in there. This one is in there too. I put it there.'},
{id:'x14b',at:'ch:c14-joint',from:'static',t:'…the hinges grind… …someone is trying the doors one by one…'},
{id:'x14c',at:'ch:c14-muscle',from:'hale',t:'Pull, release. I do not have to ask the left hand to move any more. It moves when I want it to.'},
{id:'x14d',at:'ch:c14-skin',from:'probe',t:'Back at the outer wall. The entry point at the left hand has closed over. There is no way out the way the Bassiet came in.'},
{id:'x14e',at:'ch:c14-frame',from:'probe',t:'Nerve map complete. On the left arm, the median nerve shows old traffic: a fine tremor at 03:17, night after night, in a hand that was asleep.'},
{id:'d14b',at:'seal:14',from:'hale',t:'Do not read the wristband again. It is a smudge. Go down.'},

/* ---------- depth 15: the Drowned Mind ---------- */
{id:'d15a',at:'enter:15',from:'hale',t:'The Drowned Mind. You will hear voices here. Most of them are memories. Do not answer them.'},
{id:'x15a',at:'ch:c15-mood',from:'host',t:'A memory, half surfaced: a ward at night, a list of jobs, a coffee gone cold beside a sharps bin. You do not know whose.'},
{id:'x15b',at:'ch:c15-psychosis',from:'hale',t:'Some of the voices here will sound like me. They are not. Only one voice down here is really mine.'},
{id:'x15c',at:'ch:c15-sleep',from:'static',t:'…beep… beep… beep… …beeeeeeeeeeeeeeeee… …03:17…'},
{id:'d15b',at:'ch:c15-subst',from:'host',t:'A memory surfaces whole. Ward 9, night. You are drawing blood from Dr. Hale. He is grey to the lips. He says, "Do not stop for me." The needle slips. You feel it go into your own finger.'},
{id:'x15d',at:'ch:c15-young',from:'host',t:'A memory from long before the ward: a child holding a toy stethoscope to a sleeping parent\'s chest, waiting for the beat. You always wanted to be the one who listens.'},
{id:'d15c',at:'seal:15',from:'host',t:'A second memory. A form in your own handwriting: "HALE, Emil. Time of death 03:17, 03/03." Every transmission came after that.'},
{id:'d15d',at:'seal:15',from:'pall',t:'Yes. He has been dead since 03:17. I wore his voice because you trusted it. I learned it the way I learned yours: from the inside.'},

/* ---------- depth 16: the Synaptic Abyss ---------- */
{id:'d16a',at:'enter:16',from:'pall',t:'The Synaptic Abyss. I could never cross the barrier alone. I followed your lamp through every seal you broke. Now there is only you, and me, and the last dark room. Light it, little lamp, if you can, before I reach it.'},
{id:'x16a',at:'ch:c16-cells',from:'pall',t:'Lightning everywhere. That is thought, little lamp. Yours. I have wanted to taste it since the first cell.'},
{id:'x16b',at:'ch:c16-tracts',from:'pall',t:'You came in through the left hand. So did I. Every road since, I walked a step behind your lamp.'},
{id:'x16c',at:'ch:c16-stroke',from:'probe',t:'Dark territories mapped. Not infarcts. The grey has been switching rooms off one by one, the way a ward is closed down at night.'},
{id:'x16d',at:'ch:c16-degen',from:'pall',t:'You are fading too, little lamp. Cell by cell. Let go, and it stops hurting.'},
{id:'x16e',at:'ch:c16-senses',from:'host',t:'Through the windows: a ward at night. A bed. A name on a wristband you almost know. Someone grey is standing over you.'},
{id:'x16f',at:'ch:c16-nerves',from:'probe',t:'Twelve wires counted and traced, nucleus to muscle. All twelve answer the lamp. Whatever else is taken, these are the Host\'s own.'},
{id:'d16b',at:'seal:16',from:'probe',t:'Pall signal lost. Lamp at full stain. Host consciousness rising.'},
{id:'d16c',at:'seal:16',from:'static',t:'…Ward 9… …Bed 4… …eyes moving under the lids… …someone is waking…'},

/* ---------- ambient: wrong stain-test answer ---------- */
{id:'m1',at:'miss',from:'hale',t:'Wrong. The Pall felt that. Again.'},
{id:'m2',at:'miss',from:'hale',t:'That stain did not take. Look closer.'},
{id:'m3',at:'miss',from:'static',t:'…ssshhh… the grey moved a little nearer.'},
{id:'m4',at:'miss',from:'hale',t:'You will not get many chances down there. Learn it now.'},
{id:'m5',at:'miss',from:'hale',t:'No. Read the walls again.'},
{id:'m6',at:'miss',from:'hale',t:'Close. Close is how the Pall wins.'},
{id:'m7',at:'miss',from:'probe',t:'Miss logged. The site stays dark.'},
{id:'m8',at:'miss',from:'static',t:'…sss… a grey edge creeps over the page…'},
{id:'m9',at:'miss',from:'hale',t:'That was the answer the Pall wanted.'},
{id:'m10',at:'miss',from:'hale',t:'Again. Slower this time.'},
{id:'m11',at:'miss',from:'hale',t:'You will meet that one again. Know it by then.'},
{id:'m12',at:'miss',from:'probe',t:'Lamp flicker. Stain rejected.'},
{id:'m13',at:'miss',from:'hale',t:'On the ward, that answer hurts someone. Down there, it only costs you light.'},
{id:'m14',at:'miss',from:'static',t:'…something laughed… …or the line crackled…'},

/* ---------- ambient: lost duel ---------- */
{id:'dl1',at:'duellose',from:'hale',t:'It pushed you back up the shaft. It did not follow. It is waiting.'},
{id:'dl2',at:'duellose',from:'hale',t:'Read the wounds. Every one is a door it came through.'},
{id:'dl3',at:'duellose',from:'probe',t:'Hull resealed. Every wound from the duel is logged in the Hull. Read them before going back.'},
{id:'dl4',at:'duellose',from:'static',t:'…sss… it is still down there… …it knows your shape now…'},
{id:'dl5',at:'duellose',from:'hale',t:'The hull held long enough for you to see its face. Next time you will know it.'},
{id:'dl6',at:'duellose',from:'hale',t:'Rest if you need to. It will not.'},

/* ---------- ambient: re-stain and fading ---------- */
{id:'rs1',at:'restain',from:'probe',t:'Site re-lit. The grey withdrew.'},
{id:'rs2',at:'restain',from:'hale',t:'Good. It was creeping back. Keep the old rooms lit, or it moves into them.'},
{id:'rs3',at:'restain',from:'probe',t:'Stain refreshed. The fade clock starts again, slower this time.'},
{id:'fd1',at:'fading',from:'hale',t:'The grey is coming back into rooms you lit. Go back before it settles.'},
{id:'fd2',at:'fading',from:'static',t:'…old rooms… going dark… one by one…'},
{id:'fd3',at:'fading',from:'probe',t:'Stain density falling in charted strata. Re-stain advised.'},

/* ---------- ambient: return, night ---------- */
{id:'r1',at:'return',from:'hale',t:'You were gone. The Host was not. The Pall does not sleep.'},
{id:'r2',at:'return',from:'hale',t:'There you are. I kept the channel open. I always keep it open.'},
{id:'r3',at:'return',from:'hale',t:'You were away a long time. Some of your stains faded while you were gone. I watched them go.'},
{id:'r4',at:'return',from:'static',t:'…channel open… …channel open… …channel open…'},
{id:'r5',at:'return',from:'probe',t:'Resuming descent. The grey moved while the lamp was off.'},
{id:'n1',at:'night',from:'hale',t:'Late. This is when the ward is quietest. This is when it happened.'},
{id:'n2',at:'night',from:'static',t:'03:17 … 03:17 … 03:17'},
{id:'n3',at:'night',from:'hale',t:'Nobody on the ward is awake but us.'},
{id:'n4',at:'night',from:'static',t:'…a trolley wheel squeaks somewhere above… …then nothing…'},
{id:'n5',at:'night',from:'hale',t:'Do not look at the clock. At night it only ever says one time.'},
{id:'q1',at:'night317',from:'static',t:'03:17. The ward clock and yours agree. They should not.'},
{id:'q2',at:'night317',from:'hale',t:'Listen. Do you hear it? That is when the bell stopped.'},

/* ---------- dive log, first week ---------- */
{id:'f1',at:'first',from:'hale',t:'Your first week. No record yet, only the dark ahead. Start the descent.'},

/* ---------- after the descent ---------- */
{id:'a1',at:'after',from:'static',t:'…click…'},
{id:'a2',at:'after',from:'host',t:'The ward is quiet. The lamp still works. The grey could come back into anything you let fade.'},
{id:'a3',at:'after',from:'static',t:'Channel 3. Nothing on it. Nothing at all.'},
{id:'a4',at:'after',from:'host',t:'You kept the radio. You have never plugged it in.'},
{id:'ma1',at:'missafter',from:'host',t:'Wrong. You know better than to guess now.'},
{id:'ma2',at:'missafter',from:'static',t:'…a grey edge… only for a moment…'},
{id:'ma3',at:'missafter',from:'host',t:'Again. Nobody is talking you through it any more. That is fine. You can do this alone.'}
],

/* ---------- Host file: objective evidence, one piece per depth, never a repeat of a radio line ---------- */
H:[
{id:'h1',at:'start',t:'Patient: unknown. Ward 9, Bed 4. Unresponsive. Febrile. Grey discolouration spreading from the left hand.'},
{id:'h2',at:'ch:c1-membrane',t:'Left index finger: a healed puncture wound, about 1 mm across. Typical of a needlestick.'},
{id:'h3',at:'seal:1',t:'Cannula site, back of the left hand: necrosis, coagulative at the centre, liquefying at the edges. The grey margin advances about a millimetre a day.'},
{id:'h4',at:'seal:2',t:'Liver and lung biopsies: granulomas with no organisms in them. At the centre of each, a grey core the pathologist declined to describe.'},
{id:'h5',at:'seal:3',t:'Genome screen: no inherited disease. Short runs of foreign human sequence in three cell lines. Not the Host\'s.'},
{id:'h6',at:'seal:4',t:'Found in a coat pocket: a shift rota. Nights, nights, a day, nights, nights. The name has been torn off.'},
{id:'h7',at:'seal:5',t:'Every culture negative. Every PCR negative. Gram, Ziehl–Neelsen, silver, PAS, Giemsa: the grey takes none of them.'},
{id:'h8',at:'seal:6',t:'Drug chart: extra midazolam given at 03:17 on three different nights. No prescriber, no signature. Each time the cannula bung was found open.'},
{id:'h9',at:'seal:7',t:'HLA typing returns two sets of results. One is the Host\'s. The other belongs to someone who is not in the building.'},
{id:'h10',at:'seal:8',t:'Telemetry archive, Bed 4: the same 2.8-second pause at 03:17 appears on recordings made before this patient was admitted.'},
{id:'h11',at:'seal:9',t:'Bedside inventory: one radio, tuned to Channel 3, unplugged. The ward clerk says it was there before the patient came.'},
{id:'h12',at:'seal:10',t:'Foreign sequence identified: HALE, Emil. Ward 9 doctor. Matched against a blood sample drawn from him on 03/03.'},
{id:'h13',at:'seal:11',t:'Belongings: knuckles cracked from forty hand-washes a shift. A pen with the cap chewed flat. A pager clip on the belt, with no pager.'},
{id:'h14',at:'seal:12',t:'Bed 4, previous occupant: HALE, E., Ward 9 doctor. Discharged: deceased, 03/03, 03:17. Personal effects not collected: one radio.'},
{id:'h15',at:'seal:13',t:'Night nurse\'s note: "03:17. Someone standing at the bedside again. Did not see them come in. Did not see them leave. The chair was cold."'},
{id:'h16',at:'seal:14',t:'Occupational health: no needlestick reported from Ward 9 on 03/03. None on 11/01 either, the night Dr. Hale took blood from the patient in Bed 4 before him.'},
{id:'h17',at:'ch:c15-sleep',t:'Second foreign sequence found, older and fainter than Hale\'s. It matches no one on record.'},
{id:'h18',at:'seal:15',t:'Incident book, Ward 9, 03/03: blank. The sharps bin from Bed 4 that night held one needle with two people\'s blood on it.'},
{id:'h19',at:'seal:16',t:'Wristband, now legible: BASSIET. Ward 9 doctor.'},
{id:'h20',at:'seal:16',t:'The Host is you.'}
],

/* ---------- the ending, played once after the final seal ---------- */
END:[
{from:'probe',t:'Pall signal lost. Every room in the Host is lit. Nothing grey answers the lamp.'},
{from:'probe',t:'Probe designation BASSIET matches the patient wristband, Bed 4. Correction to every log since the first: there was no probe. There was only the Host, going down.'},
{from:'host',t:'The Host is you.'},
{from:'static',t:'Ward 9. 03:17. On the monitor the peaks come one after another, with no pause.'},
{from:'host',t:'You open your eyes. Your left hand is your own again. You can feel the cannula, and under it the small scar from the night you did not report.'},
{from:'host',t:'The night nurse says your name. Bassiet. It sounds like something called down a long, dark shaft.'},
{from:'host',t:'On the bedside table, a radio you never brought. His. Tuned to Channel 3. The plug lies coiled on the floor, where someone left it in March.'},
{from:'host',t:'In the morning you will report it: the needle, the night, the signature. You say it out loud now, to the empty ward, so you cannot take it back.'},
{from:'static',t:'Down the corridor, someone is labelling your blood tubes in a hurry. No gloves.'},
{from:'static',t:'…'},
{from:'static',t:'It clicks once.'}
],

/* after this trigger, 'hale' lines are labelled who.hale (a quiet retcon of the whole Radio log) */
unmask:{at:'seal:15',who:{hale:'— · Ward 9'}},

/* dive-log grade lines; sign is the label shown before the line */
GRADE:{
 hale:{sign:'HALE',
  A:'Five days down and the lamp burned clean. The grey pulled back wherever you lit it.',
  B:'The lamp held. A few stains are thin; go back to them before they fade.',
  C:'Enough to keep the grey where it was. Not enough to push it back.',
  D:'You came down, but not often. The grey moves on the days you do not.',
  F:'No dives last week. The Host lay still and the grey spread. Come back down.',
  first:'Your first week. No record yet, only the dark ahead. Start the descent.'},
 pall:{sign:'—',
  A:'You came down every day last week. So did I. I was right behind you.',
  B:'Thin stains here and there. I like thin stains.',
  C:'You held still. So did I. I am better at it.',
  D:'You came down so rarely. I kept the Host company.',
  F:'You left me alone with the Host all week. I was not bored.',
  first:'Your first week. I have been here much longer.'},
 after:{sign:'NIGHT NURSE',
  A:'Up every night again, I see. At least now it is for the books.',
  B:'A good week. A few old rooms going dim; check on them.',
  C:'You look tired. Look after yourself first this time.',
  D:'Not much this week. That is allowed. Do not let it slide.',
  F:'Nothing this week. The lamp still works. The grey does not wait.',
  first:'Your first week. Take it slowly.'}
}
};
/* alias for callers that use 'duel-lose' */
(function(){var T=window.STORY.T;T.filter(function(t){return t.at==='duellose'}).forEach(function(t){T.push({id:t.id+'b',at:'duel-lose',from:t.from,t:t.t})})})();
