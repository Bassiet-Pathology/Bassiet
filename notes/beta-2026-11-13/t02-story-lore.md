# t02: Story, lore, writing and mood

Tester t02. Read-only on source. I read story.js (all 41 transmissions and 10 Host file entries), depths.js (16 depth names, blurbs, strata and bosses), the title and epigraph of all 71 chapters (book1a–book16b), and the radio log, Host file, duel, grade and miss text in app-dive.js. I then played the whole descent the way a player would: Dive home, the **Continue** button, every stain test (one deliberate miss), every duel, back to home each time. A MutationObserver logged every transmission the home screen drew, even ones that were drawn and then removed straight away.
Scripts: `/tmp/claude-0/-home-claude/c80d3a2e-1d1d-5dac-83ee-172c002ca966/scratchpad/beta/work-t02/` (play2.js is the natural play-through, flash.js reproduces the vanishing-transmission bug, shots.js and host0.js take the screenshots). Logs: play.log and play2.log in that folder. Screenshots: `/tmp/claude-0/-home-claude/c80d3a2e-1d1d-5dac-83ee-172c002ca966/scratchpad/beta/shots/t02-*.png`.

## 1. Verdict

**Score: 5.5 / 10** (the writing alone would get about 7.5).

The prose is controlled, spare and good at unease. The cell-as-architecture world (Foundry, Marches, Cathedral, Catacombs, Ossuary, Abyss) is consistent and memorable, and the 03:17 motif works. But the story cannot do its job yet, for three reasons:
- **A rendering bug wipes new transmissions off the Dive home within milliseconds.** The player never sees three of the four prologue lines, and at most seals sees only the last line of the beat.
- **It is far too sparse for "deep lore".** 41 lines across 71 chapters and 16 duels. Depths 2–14 each go 4–5 chapters with no transmission at all.
- **Duels and the ending have no voice of their own.** Every boss gets the same intro, win and lose text, including the final one. Completing the game shows "The descent is complete." with no ending scene.

The mood is dark and mysterious, but it is muted rather than *extremely* dark. Body horror and a sense of threat are rare, and the voice hardly changes from depth 1 to depth 14.

## 2. What works well

- **The world grammar.** Each depth is a building or landscape (Foundry, Garrison, Cathedral with nave, bell, valves and choir, Catacombs, Ossuary). Strata names map cleanly to Step 1 topics (Bell Wire = conduction, Salt Ledgers = electrolytes, Bone Clerks = parathyroid, Sugar Islands = islets). This is excellent memory scaffolding.
- **Epigraphs that teach.** c3-mito ("passed only from mothers"), c3-repeat (anticipation), c10-glom (the sieve), c8-bell ("Cut the wire and the pillars beat alone" = escape rhythm) and c12-ca are mnemonic and atmospheric at once.
- **Clinically real clues.** d4b (high anti-HBs with negative anti-HBc = vaccinated) and h3 (flattened cortisol rhythm, melatonin peak shifted) are accurate, and reward the doctor who reads them.
- **03:17 as a recurring sign** (d3b, n2, c15-sleep, the ending), and the Host file shown as redacted bars from the first day, which creates anticipation.
- **Speaker styling.** Each source (ward doctor, Bassiet log, static, Host, and the unnamed "—" speaker) has its own colour and texture.
- **Ambient lines.** r2 ("I always keep it open") and n1 ("This is when it happened") are excellent.

## 3. Findings

Rewritten text is given in quotes and can be pasted as-is. Everything that touches the twist is kept for section 5.

| ID | Sev | File | Where | Problem | Fix |
|---|---|---|---|---|---|
| t02-01 | Critical | app-dive.js | `home()` + `flush()` + app-core.js `CT.setDoc` | **New transmissions vanish within milliseconds.** `home()` draws the fresh lines with `.new`. Then `setTimeout(flush,0)` calls `saveStory`, which calls `CT.setDoc`, which calls `CT.render()` (straight away in local mode; through `onSnapshot` with the db). The re-render finds nothing fresh and shows only the last line received. Verified with a MutationObserver (flash.js): on first open, prologue p1–p3 are drawn and replaced before any human can read them, and only p4 ("Your lamp takes five stains…") stays (shots/t02-home-start.png). Every beat with 2–3 lines loses all but the last. The story effectively plays only in the Radio log, which most players will not open. | Keep this visit's fresh lines on screen until the player leaves home. In `home()`: `var keep=CT.ui.txKeep||(CT.ui.txKeep={});var fresh=rec.filter(function(t){return !seen[t.id]\|\|keep[t.id]});fresh.forEach(function(t){keep[t.id]=1});`. In the `CT.render` wrapper, before `baseRender()`: `var rk=CT.view+'\|'+(CT.dsub\|\|'');if(rk!==CT._rk){if(CT._rk==='today\|')CT.ui.txKeep={};CT._rk=rk}`. Better still, play several fresh lines one after another (typewriter, about 1.2 s apart) so a beat lands as a scene. |
| t02-02 | High | app-dive.js | `home()` Continue button, `chapter()`, `depthPage()` | **Depth intros arrive one chapter late.** `enter:N` is recorded only when the depth *page* renders. The Continue button goes straight to `#ch-…`, so the player first sees the depth page after saving the first chapter's test. Play log: d1a ("Start at the membrane…") arrives together with d1b, *after* the membrane is done. d2a–d16a likewise arrive after the first chapter of each depth. | When the next step's depth has not been entered, make Continue read "Descend: The Inflamed Marches" and go to `depth-N`. Also render that depth's `enter:N` transmission inline on the depth page under the blurb, every visit, as its standing briefing. As a safety net, set `pendingEnter=d.n` in `chapter()` too. |
| t02-03 | High | story.js | depths 2–14 | **Long silences.** Only depths 1 and 15 have chapter (`ch:`) triggers. Each depth from 2 to 14 has one line on entering and one or two at the seal, so the player reads 4–5 chapters (about 2–4 hours) with no story. The whole story is 41 lines for 71 chapters. | Add at least one `ch:` line per depth (ideally one per chapter). 26 ready-to-paste lines are below this table (ids x2a–x14b). More lines, which carry clues, are in section 5. |
| t02-04 | High | app-dive.js / depths.js | `duelView()` intro, win, lose | **Every boss sounds the same.** All 16 duels use the same rules paragraph, the same win text ("<boss> falls apart in the dark.") and the same loss text. The bosses have one-line blurbs and never speak or act. | Add `intro`, `win` and `lose` fields to each `boss` in depths.js and show them in `duelView()`. 14 sets are written below (bosses 15–16 are in section 5). |
| t02-05 | High | app-dive.js | `home()` once seal 16 is broken; `duelView()` win for n=16 | **No ending.** Beating the final boss shows the generic win panel and "Return to the shaft". Home then says "The descent is complete." next to the usual widgets. There is no ending screen, no credits and no change of mood. | Add an `#ending` view, shown once after the seal:16 win: full-screen, with the seal:16 lines played in sequence and the Host file opening by itself (content in section 5). After that, home shows a quieter "after" state (see t02-26). |
| t02-06 | Medium | app-dive.js | `radioLog()` | **The Radio log reads backwards.** `received().slice().reverse()` puts the newest line first, so the prologue reads upside down ("Your lamp takes five stains" comes before "Can you hear me?"; shots/t02-radio-start.png). A story log should read top to bottom. | Use oldest first, grouped under depth headers (`DEPTH −07 · THE MARROW FORGES`), and scroll to the newest on open. Remove `.reverse()`. |
| t02-07 | Medium | app-dive.js | `diveLog()` / `GRADE.F` | **A brand-new player is scolded on day one.** "Last week" is empty, so it grades F and Hale says "Nothing this week. The Host lay still and the Pall spread. Come back." (verified on first open). The F line also says "this week" while it is grading last week. | If no reads existed before `prev.from`, show a first-week line instead: "Your first week. No record yet, only the dark ahead. Start the descent." Change F to: "No dives last week. The Host lay still and the grey spread. Come back down." |
| t02-08 | Medium | app-dive.js | `GRADE.A` | Hard-coded "The Pall pulled back from three sites this week": the number is invented and the tense is wrong (it grades last week). | "Five days down and the lamp burned clean. The grey pulled back wherever you lit it." |
| t02-09 | Low | app-dive.js | `GRADE.B`, `GRADE.C` | C uses the cliché "hold the line". B is fine but flat. | B: "The lamp held. A few stains are thin; go back to them before they fade." C: "Enough to keep the grey where it was. Not enough to push it back." |
| t02-10 | Medium | app-dive.js | `endDuel()` → `CT.radio(pick('miss'))` | Losing a duel pops a stain-test line such as "That stain did not take. Look closer." (seen in play: m1 after a duel loss; shots/t02-duel1-lose.png). It does not fit the moment. The popup also covers the wounds list on phone. | Add `at:'duellose'` lines and call `pick('duellose')`. "It pushed you back up the shaft. It did not follow. It is waiting." / "Read the wounds. Every one is a door it came through." / "The hull held long enough for you to see its face. Next time you will know it." Place the popup at the top while in a duel. |
| t02-11 | Medium | story.js | `miss` pool (m1–m4) | Only four miss lines for hundreds of misses (every wrong stain-test answer pops one), so they repeat constantly and lose their bite. | Add: `{from:'hale',t:'No. Read the walls again.'}`, `{from:'hale',t:'Close. Close is how the Pall wins.'}`, `{from:'probe',t:'Miss logged. The site stays dark.'}`, `{from:'static',t:'…sss… a grey edge creeps over the page…'}`, `{from:'hale',t:'That was the answer the Pall wanted.'}`, `{from:'hale',t:'Again. Slower this time.'}`, `{from:'hale',t:'You will meet that one again. Know it by then.'}`, `{from:'probe',t:'Lamp flicker. Stain rejected.'}` |
| t02-12 | Medium | depths.js, book11.js | depth 11 stratum `pancreas` "The Acid Glands"; chapter title | **Medically misleading name.** Pancreatic secretion is *alkaline* (bicarbonate plus enzymes). For a Step 1 learner "Acid Glands" points the wrong way, and it clashes with depth 10's "Acid Wells". | Rename to "The Self-Eating Gland". It fits the epigraph "When it bursts, it digests itself." |
| t02-13 | Medium | depths.js | depth 2 boss "The Ember Host" | The boss name reuses "Host", the story's word for the patient, so the player reads "the Host" as an enemy. "Ember" is also the name of another of the owner's apps (the arrest simulator). | "The Unquenched". Blurb: "An inflammation that has forgotten what it was lit for." |
| t02-14 | Medium | depths.js, book12.js | depth 12 stratum `adr` "The Twin Towers" | A tonal slip: an unavoidable real-world (9/11) association in a horror setting. | "The Twin Crowns" (the adrenals sit on the kidneys like crowns). Epigraph: "Two crowns on the kidneys. Their rims make the slow hormones of salt, sugar and sex. Their cores scream adrenaline." This also adds the androgen arm the current line leaves out. |
| t02-15 | Medium | depths.js | Name collisions | Too many repeated nouns: "The Gene Vaults" (3), "The Germinal Vaults" (13) and "The Nucleus Vault" (1); "The Coronary Catacombs" (8, stratum) and "The Nephron Catacombs" (10, depth); "Acid Wells" (10) and "Acid Glands" (11). The shaft list blurs. | Depth 13: "The Sleeping Cloisters" (epigraphs: "In these cloisters…"). Depth 8 stratum: "The Coronary Tunnels". Pancreas: see t02-12. |
| t02-16 | Medium | depths.js / story.js / book13.js | d13a, c13-cycle, depth 13 blurb | **Wrong direction.** "It only wants **up**" contradicts the game's own geography, where the mind is the *deepest* place (depth 16, "the deepest place"). The phrase also appears twice and "The Pall has no interest here" appears three times. | d13a: "The Sleeping Cloisters. Sealed and quiet. The Pall walks past these doors. It only wants the mind." c13-cycle: "In these cloisters the hormones rise and fall like seasons, on a calendar nothing else in the body keeps." |
| t02-17 | Medium | book15.js | c15-mood epigraph | It repeats the depth 15 blurb word for word ("The upper waters of the mind."). | "Moods drift in here like weather off a cold sea. This front came in and never moved on." |
| t02-18 | Medium | book15.js | c15-psychosis epigraph | It repeats d15a nearly word for word ("You will hear voices here. Most of them are memories."). | "Some voices here speak in the first person. Count them. There should be only one." |
| t02-19 | Medium | book9b.js | c9-flooded epigraph | It repeats d9a ("came in on a breath, or a needle"). | "Fluid, pus, blood, growth: each cave has drowned in something different. The lamp tells them apart." |
| t02-20 | Medium | book16a.js | c16-cells epigraph | It repeats the depth 16 blurb ("Below the barrier."), and "where the Host keeps themself" reads awkwardly. | "Lightning jumps the black gaps faster than anything else in the body, because it is thought. Somewhere in the storm is the thing the Pall came for." |
| t02-21 | Medium | depths.js / story.js | depth 5 | "Not on any list" appears twice (d5a and the boss blurb), plus "One does not" in the depth blurb. The same idea three times on one page. | d5a: "The Microbe Wastes. Most of what lives here has a name and a Gram stain. Learn them all. Then you will know what does not fit." Boss blurb: "It changes shape while you look at it." |
| t02-22 | Medium | book4.js, book13.js | c4-graft and c13-preg epigraphs | **History claims that go nowhere.** "They sewed something foreign into the Host once" (a past transplant) and "A second heartbeat once sounded in some of these vaults" (a past pregnancy) give the Host a history the story never follows up. The pregnancy line also gives the Host a sex, while elsewhere the text keeps the Host neutral ("themself"). See also S-12. | c4-graft: "Sew a stranger's tissue into a body and the guards will remember its face for the rest of their lives." c13-preg: "These cloisters were built to hold a second heartbeat. Learn what one changes in the body that carries it." |
| t02-23 | Low | book5a.js | c5-gpos epigraph | "They have been here longer than the Host" does not make sense (inside the Host for longer than the Host has existed). | "They settled on the Host in the first hour of life and never left." This is also accurate: colonisation starts at birth. |
| t02-24 | Medium | book*.js | epigraph sentence patterns | The "Some X. Some Y." pattern is overused: c4-hyper, c4-deficient, c8-valves, c13-gonad, c14-joint, c14-muscle, c16-degen and the blurbs of depths 3, 4 and 9 (28 "Some " across the lore). Across 71 epigraphs it becomes a tic. | Rewrite at least half. c8-valves: "Four gates keep the flood moving one way. One has rusted half shut; one swings loose and lets the tide fall back." c14-joint: "Every hinge in the wall grinds: the old ones from wear, the young ones because the guards have turned on them." c16-degen: "Not dead. Fading, cell by cell, plaque by tangle, like a photograph left in the light." |
| t02-25 | Medium | app-dive.js | `chapter()` header | On all 71 chapters the title repeats the stratum name, which the kicker already shows ("DEPTH −01 · The Membrane Walls" above "The Membrane Walls"; shots/t02-chapter-head.png). One line is wasted, and the plain-English topic is never named. | Use the kicker for the real topic and keep the lore name as the H1: give each BOOK chapter a `topic` ("Membranes, transport and the resting potential") and show `DEPTH −01 · <topic>`. This also helps scanning and search. |
| t02-26 | Medium | app-dive.js | home after seal 16; `GRADE`; "Where the Pall is thickest" | After the descent ends, nothing changes: Hale still signs the weekly grades, the miss lines still come from him, and the weak-points panel still says "Where the Pall is thickest". It contradicts the ending. | Add a post-game state when `sealBroken(DP[15])`: grades signed "NIGHT NURSE" or unsigned static, "Where the Pall is thickest" becomes "Where the grey could return", and fading stains read "The grey is coming back to <stratum>". |
| t02-27 | Low | app-dive.js | `endDuel()` toast, `duelView()` win text, `depthPage()` seal panel | Capital "The" mid-sentence: "The seal of The Cell Foundry breaks.", "then defeat The Unmaker." | Add a helper `the(n){return n.replace(/^The /,'the ')}` and use it when a name is in the middle of a sentence. |
| t02-28 | Low | depths.js | boss blurbs | Several are flat next to the strong ones ("A voice you know."): "The Overdose: A dose too many.", "The Crumbling: The lattice thins until it falls.", "The Clonal Tide: One cell, copied forever." | Overdose → rename to "The Double Dose", blurb "It speaks in milligrams. Whatever you give it, it wants twice." Crumbling: "It walks on lace that used to be bone." Clonal Tide: "One face, copied until it is an ocean." |
| t02-29 | Low | story.js | header comment, `STORY.doctor` | The comment lists `from:` values but leaves out `'pall'`, which d16a uses. `STORY.doctor` is never read. | Add `'pall'` to the comment, and either use `doctor` in `WHO.hale` or delete it. |
| t02-30 | Low | app-dive.js | `hostFile()` redaction length | The bar length is `18+(id.length*7)%20`, so h1–h9 all get the same 32-block bar. It looks mechanical and gives nothing away. | Base the bar on the text: `'█'.repeat(Math.max(8,Math.round(x.t.length*.55)))`, so each redaction looks real. |
| t02-31 | Low | app-dive.js | `tx()` / `radioLog()` | A transmission first seen in the Radio log (never on home) shows "NOW" as its time, and the Radio log never marks lines as seen, so they show again as new on home. | Mark everything shown in `radioLog()` as seen (set `pendingSeen` there too). |
| t02-32 | Low (local only) | index.html | no `<meta charset>` | Locally, "·", "…", "—", "−" and "█" show as mojibake ("Â·", "â€¦", "âˆ'"). Seen on the console line, the speaker labels, the Host file bars and the hull squares. The published artifact adds a charset, so this is local only, but local beta screenshots look broken. | Add `<meta charset="utf-8">` at the top of index.html (harmless when the wrapper adds one). |
| t02-33 | Medium | story.js / app-dive.js | `night`, `return` | Only two lines each. `night` fires at any hour below 05:00 and ignores the 03:17 motif. | Add a special case: if the local time is 03:10–03:25, play `{from:'static',t:'03:17. The ward clock and yours agree. They should not.'}`. Add night lines `{from:'hale',t:'Nobody on the ward is awake but us.'}` and `{from:'static',t:'…a trolley wheel squeaks somewhere above… …then nothing…'}`. Add return line `{from:'hale',t:'Four stains faded while you were away. I watched them go.'}` (use the real count). |
| t02-34 | Medium | book*.js | body text of chapters | The lore never reaches the textbook body. The Host is never used as a clinical vignette, so story and study run side by side without touching. | Give each chapter one "AT THE BEDSIDE" box: the Host's own data for that topic. Example for c10-acid: "Bed 4 gas: pH 7.29, HCO₃⁻ 14, pCO₂ 29. Winter's formula predicts 29 ± 2: compensated, no second disorder." It teaches and builds the case together. |
| t02-35 | Low | depths.js | depth 14 / c14-skin, depth 1 / p2 | Fine as it stands, but a callback is missed: the Bassiet's entry at the back of the left hand is mentioned twice and never felt. | Add the ch:c14-skin line x14b (below). |
| t02-36 | Idea | app-dive.js | fading stains | Spaced repetition has no place in the story: a fading stain is just a label. | Make fading part of the lore. "Fading · re-stain" becomes "The grey is returning"; that stratum's row shows Pall drift; re-staining plays a probe line: "Site re-lit. The grey withdrew 3 mm." |
| t02-37 | Idea | app-dive.js | shaft | A sealed depth shows only "Sealed from above". | Show the next depth's name with a short line of static, e.g. "−09 · …ssh… caves… filling…", to pull the player down. |

### Ready-to-paste chapter transmissions (no spoilers) for t02-03

These are atmospheric or clinical and give nothing away. The clue-bearing set is in section 5.

```js
{id:'x2a',at:'ch:c2-siege',from:'hale',t:'A granuloma is a prison the body builds around a guest it cannot kill. Count them. The Host has been keeping prisoners for a while.'},
{id:'x2b',at:'ch:c2-mutiny',from:'probe',t:'Mitotic figures in a district that should be resting. Logged as dysplasia. Not yet a mutiny.'},
{id:'x3a',at:'ch:c3-repeat',from:'hale',t:'Count the repeats before you touch a door. Under fifty, it holds. Over two hundred, it is bricked shut for good.'},
{id:'x3b',at:'ch:c3-mito',from:'probe',t:'Mitochondrial genome read. Maternal line only. Every furnace in the Host was lit by a mother.'},
{id:'x4a',at:'ch:c4-deficient',from:'probe',t:'Barracks count: B cells present, T cells present, complement present. The garrison is full. It is simply not looking at the grey.'},
{id:'x4b',at:'ch:c4-hyper',from:'hale',t:'Guards that cannot tell friend from stranger are worse than no guards. Mind the ones that have already chosen.'},
{id:'x5a',at:'ch:c5-virus',from:'hale',t:'These hide inside the cells you came to save. Remember that trick. Something else down there learned it too.'},
{id:'x5b',at:'ch:c5-fungi',from:'static',t:'…spores on the air… …do not breathe them… …lamp low…'},
{id:'x6a',at:'ch:c6-pk',from:'probe',t:'Clearance falling, half-lives lengthening. Whatever is given topside now stays longer down here.'},
{id:'x6b',at:'ch:c6-tox',from:'hale',t:'Learn the antidotes by heart. Down here there is no time to look anything up.'},
{id:'x7a',at:'ch:c7-clot',from:'probe',t:'Platelets 31 ×10⁹/L. Fibrinogen low. D-dimer off the scale. The gates are closing everywhere, then nowhere.'},
{id:'x7b',at:'ch:c7-white',from:'hale',t:'The marrow is tired, not mad. Not yet. Learn what madness looks like so you know it when it comes.'},
{id:'x8a',at:'ch:c8-bell',from:'probe',t:'Rhythm strip: sinus, 112 a minute. A pause of 2.8 seconds at 03:17. Then the bell rang again.'},
{id:'x8b',at:'ch:c8-valves',from:'static',t:'…lub… …dub… …lub… …a murmur under it, like someone whispering through a door…'},
{id:'x9a',at:'ch:c9-exchange',from:'probe',t:'Saturation 88% on room air. A–a gradient widening. The walls thicken while I watch.'},
{id:'x9b',at:'ch:c9-obstruct',from:'static',t:'…breathe in… …hold… …it will not come out…'},
{id:'x10a',at:'ch:c10-acid',from:'probe',t:'Gas: pH 7.29, bicarbonate 14, pCO₂ 29. The lungs are blowing off acid as fast as they can. Compensation complete. Nothing else wrong. Yet.'},
{id:'x10b',at:'ch:c10-failure',from:'hale',t:'Eleven millilitres of urine in the last hour. The tunnels are going quiet. Keep your lamp low.'},
{id:'x11a',at:'ch:c11-liver',from:'probe',t:'Bilirubin rising. Albumin falling. INR 1.9. The labyrinth is losing rooms.'},
{id:'x11b',at:'ch:c11-gicancer',from:'static',t:'…something growing under the floor… …slowly… …it has all the time in the world…'},
{id:'x12a',at:'ch:c12-thy',from:'hale',t:'Too bright and the furnaces race. Too dim and the Host goes cold. Someone keeps touching the switch.'},
{id:'x12b',at:'ch:c12-panc',from:'probe',t:'Glucose 3.1 mmol/L at 03:00. 14.8 at 07:00. No insulin on the chart. Nobody gave anything in between.'},
{id:'x13a',at:'ch:c13-gonad',from:'hale',t:'Quiet down here. The only part of the Host that is not fighting. I almost envy it.'},
{id:'x13b',at:'ch:c13-breast',from:'probe',t:'Ducts sealed. No lesion. The lamp passes through without catching on anything. The only clean rooms in the Host.'},
{id:'x14a',at:'ch:c14-bone',from:'hale',t:'Bone keeps the slowest records. Read it like tree rings. Every bad winter is in there.'},
{id:'x14b',at:'ch:c14-skin',from:'probe',t:'Back at the outer wall. The entry point at the left hand has closed over. There is no way out the way the Bassiet came in.'},
```

(x3a checks out: below about 50 CGG repeats is normal; above 200 is a full mutation, methylated and silenced. x10a: Winter's formula 1.5×14+8 = 29. x12b describes a Somogyi-type swing with no insulin given, which is a deliberate mystery.)

### Boss lines for t02-04 (bosses 1–14; add `intro`, `win`, `lose` to each `boss`)

| # | Boss | intro | win | lose |
|---|---|---|---|---|
| 1 | The Unmaker | It is the size of a cell and still swelling. Its walls are already torn. It wants yours torn too. | The swollen thing bursts, and the Foundry goes still. | It splits your hull the way it splits membranes: slowly, then all at once. |
| 2 | The Unquenched | A fire that has forgotten what it was lit for. It burns friend and stranger alike. | The fire gutters. Scar closes over the place it burned. | You are caught in the burning. The neutrophils do not stop to ask whose side you are on. |
| 3 | The Copyist | It sits at the plans with a needle-thin pen, changing one letter at a time. It has already changed some of yours. | The pen drops. The copies read true again, for now. | One letter wrong, and your hull reads differently. It smiles at the error. |
| 4 | The Turncoat | It wears the garrison's colours and carries the right papers. Its spear is pointed at the wall. | Unmasked, it falls under its own garrison. | The guards believe it, not you. You are thrown out of the keep. |
| 5 | The Nameless Spore | Every other thing in the Wastes has a name, a stain, a shape. This one changes shape while you look at it. | It breaks open, and nothing comes out. Not even spores. | It touches the hull and leaves a grey print that will not wash off. |
| 6 | The Double Dose | It speaks in milligrams. Whatever you give it, it asks for twice. | The level falls back into range. The Drifts run clear. | Toxic level reached. The hull floods with it. |
| 7 | The Clonal Tide | One cell, copied until it is an ocean. Every face in the tide is the same face. | The tide breaks. Slowly, the marrow begins to make other faces. | The same face, a million times, pressed against the hull. |
| 8 | The Clot King | He sits on a cracked plaque like a throne, and the muscle below him is already dying. | The clot dissolves. Blood rushes into the dark muscle like breath. | He does not move. He does not have to. The pillars below you go still. |
| 9 | The Drowning Fog | Fluid rises in the caves. The fog waits for the last pocket of air. | The fog lifts. The caves fill with air again, shallow but alive. | The fog closes over the lamp. You surface choking. |
| 10 | The Salt Witch | She counts potassium like coins and spends it where it will stop a heart. | Her ledgers burn. The salts fall back into balance. | She tips one more grain into the scale, and your hull's rhythm falters. |
| 11 | The Bile Wyrm | Yellow coils in the ducts, thick and patient. Where it lies, nothing drains. | The wyrm uncoils and slides away. Bile runs green and clear. | It tightens. The yellow seeps into everything, even the lamp. |
| 12 | The False Herald | It speaks with a gland's voice and gives a gland's orders. The towers obey it. | The voice stops mid-order. The spires answer their own glands again. | It gives an order in your voice, and the hull obeys. |
| 13 | The Barren Frost | A cold that settles in sealed rooms and stops every season from turning. | The frost cracks. Somewhere, very faintly, a season turns. | The cold gets into the hull's joints. You are pushed back up into warmer dark. |
| 14 | The Crumbling | The lattice under it is already lace. Each blow it lands takes bone with it. | It falls through its own floor. The crews begin to lay new bone. | Your hull fractures along an old line, as if it remembered. |

## 4. Top 5 improvement ideas

1. **Fix delivery, then stage it** (t02-01, t02-02, t02-06). Fresh lines must stay on screen and play in sequence, one after another, with the static sound between them. Show the depth briefing on the depth page and make the Radio log read top to bottom by depth. Until this is done, most of the writing is invisible.
2. **One beat per chapter.** Raise the story from 41 lines to about 120. Give every chapter a `ch:` line, add a mid-depth Host file entry for every depth, and widen the ambient pools (miss, duel loss, night, return, fading). The lines above and in section 5 cover most of this.
3. **Bosses with a voice and an ending with weight.** Use the intro, win and lose lines; give the final duel its own staging (a darker palette, the voice changing mid-fight, no "Return to the shaft"); add a one-time `#ending` view and a changed post-game home.
4. **An "At the bedside" box in every chapter** (t02-34). Use the Host's own labs, gases, ECGs and films as the worked example. The case builds in step with the textbook, so a fact learned is also a clue found.
5. **Make spaced repetition part of the lore** (t02-36, t02-26). Fading stains become the grey coming back, re-stains push it out with a probe readout, and after the ending the grey can still return. That gives the fade schedule a reason to exist in the story.

---

## 5. SPOILER-SENSITIVE (owner must not see)

### How I read the twist

The twist has two layers:
- **Hale is dead.** He died at 03:17 on 03/03 in Ward 9. The voice on the radio is the Pall, which learned his voice from inside his blood.
- **The Host is the player.** The Host is a Ward 9 doctor named BASSIET, who caught the Pall from a needlestick while drawing Hale's blood that night, and signed his death certificate. The probe "Bassiet" is the Host's own mind going down through their own body.

The ending: the Pall used the player's seals to get down to the mind, the full stain drives it out, and the Host wakes at 03:17 while the unplugged radio clicks.

### What fires when (natural play, Continue-button path; from play2.log)

| Moment | Lines received | What the home screen actually leaves visible (t02-01) |
|---|---|---|
| First open | p1 p2 p3 p4, Host file h1 | p4 only |
| c1-membrane saved | d1a (late, t02-02) + d1b, h2 | d1b only |
| c1-furnace, c1-nucleus, c1-unmaking | d1c, d1d, d1e, h3, h4 | each one |
| Seal 1 | d1f, d1g | d1g only |
| Depth 2 | d2a after the first chapter; d2b at seal | — |
| Depth 3 | d3a; d3b at seal | — |
| Depth 4 | d4a; d4b + h5 at seal | — |
| Depth 5 | d5a; d5b at seal | — |
| **Seal 6** | d6b "Double the dose" + d6c (probe refuses) | **d6c only: the probe's refusal shows without the order it refuses** |
| **Seal 7** | d7b (HALE record) + d7c, h6 | **d7c only: "That is not a record. That is noise." with no record on screen** |
| Depth 8 | d8a; d8b at seal | — |
| Seal 9 | d9b (receiver unplugged) | yes |
| Seal 10 to seal 14 | d10b, d11b, d12b, d13b, d14b | yes (one line each) |
| c15-subst saved | d15b (memory of the needle) | yes |
| **Seal 15** | d15c (death form, 03:17, 03/03) + d15d, h9 | **d15d only: "Yes. I know." replies to a revelation the player never saw** |
| Depth 16 | d16a after the first chapter | yes, but late |
| Seal 16 | d16b + d16c, h10 | d16c only |

**S-01 Critical.** Because of t02-01, the three most important reveal beats (seals 6, 7 and 15) show only their *reply* lines on home. A player who never opens the Radio log will see "Yes. I know. I learned his voice…" with no idea what the Host just remembered. Fixing t02-01 is the single biggest story fix.

### Spoiler findings

| ID | Sev | File | Where | Problem | Fix |
|---|---|---|---|---|---|
| t02-S01 | Critical | app-dive.js | seals 6, 7, 15 | See S-01 above. | t02-01, plus sequenced playback. Consider a full-screen "memory" overlay for d15b and d15c instead of home cards. |
| t02-S02 | High | story.js | d9b, d16c, d15c, h2, d2b, d11a | **The timeline breaks.** The radio is "unplugged since 03/03", the night Hale died. But the Host was infected that same night and would only have been admitted after incubation, so why is the radio on *the Host's* bedside table, unplugged on a date before the Host arrived? h2 calls the needlestick "healed"; d2b says "scars… years ago or weeks ago"; d11a says "nothing has passed for weeks". The game's own date (13/11) puts 03/03 eight months back. | Make the horror explicit and close the hole: **the Host lies in the bed Hale died in, and the radio was his.** New Host file entry at seal:10: "Bed 4, previous occupant: HALE, E., Ward 9 doctor. Discharged: deceased, 03/03, 03:17. Personal effects not collected: one radio." Fix d2b to match h2: "One small scar on the left index finger. A needle. Weeks ago, not years. Keep going." |
| t02-S03 | High | story.js | d16a vs d16b; p4 | **The Pall's motive contradicts itself.** "Every seal you broke, you broke for me. Now light it all… Show me where you keep yourself." So the Pall *wants* the player to finish lighting the deepest place, yet the full stain is exactly what kills it (p4: "Light a site with all five and the Pall cannot hold it"). The final duel needs to be a race, not a request. | d16a: "The Synaptic Abyss. I could never cross the barrier alone. I followed your lamp through every seal you broke. Now there is only you, and me, and the last dark room. Light it, little lamp, if you can, before I reach it." |
| t02-S04 | High | story.js | depths 1–8 | **Too few clues early, then one strong clue does everything.** Before depth 9 the only odd notes from Hale are d1g ("for me"), d3b, d5b and d6b. Then d9b (receiver unplugged) all but announces the twist at 9 of 16, and depths 10–14 repeat it instead of escalating. The voice never visibly cracks. | Space the clues evenly and escalate: subtle in 1–4, contradictions in 5–8, impossibilities in 9–12, open menace in 13–14. Ready lines below (y-ids). Soften d9b to a technical oddity: "Radio carrier traced. Topside receiver: no power draw recorded since 03/03." Then the plain statement can come at depth 10 (y10a). |
| t02-S05 | Medium | story.js | d5b | "I had a fever like this once… **A long time ago.**" Hale died of it on 03/03, so this is wrong. If it is meant as the Pall misremembering, it reads as a mistake rather than a slip. | "I had a fever like this. Night sweats, the grey taste. Not long ago. It felt like a long time. Do not stop for me." |
| t02-S06 | Medium | story.js | d11b, d4b + h5 | **Too on-the-nose.** "The Host kept a doctor's hours" says the answer outright. d4b and h5 say the same thing ("healthcare worker") at the same trigger, and d1c and h3 duplicate each other at depth 1. | d11b: "Hepatic memory: meals between 22:00 and 04:00 for years, eaten standing up. The Host kept the hours of someone who gets paged." Rewrite the Host file so it never repeats a radio line (new Host file below). |
| t02-S07 | Medium | story.js | d12b | "You should not be able to see me from there." is never set up or paid off. What did the probe see? | Insert before d12b: `{id:'d12c',at:'seal:12',from:'probe',t:'Optical, external, through the left pupil: a figure at the bedside. Grey to the lips. No heat signature.'}` |
| t02-S08 | Medium | story.js | d15d | "Yes. I know." is good, but the line comes from the "Dr. Hale" speaker and never says plainly that Hale is dead. The player has to piece it together from d15c. | "Yes. He has been dead since 03:17. I wore his voice because you trusted it. I learned it the way I learned yours: from the inside." Also, from seal 15 onward, relabel *all* earlier "Dr. Hale · Ward 9" lines in the Radio log as "— · Ward 9" (a quiet retcon the player discovers). |
| t02-S09 | Medium | story.js | h10, d16b | "The Host is you." is flat, and "you" is never explained (why is the probe the Host?). | h10: "Wristband, now legible: BASSIET. Ward 9 doctor. Patient, Bed 4. Admitting doctor: HALE, E. (The ward clerk says the signature was already on the form when she came in.)" d16b: "Pall signal lost. Lamp at full stain. Probe designation BASSIET matches patient wristband. Host consciousness rising." Then show the Host file's last line, "The Host is you.", on its own screen. |
| t02-S10 | Medium | story.js | H list | **The Host file is front-loaded and repeats the radio.** Four of its ten entries come in depth 1; then depths 2, 3, 5, 6, 8, 9, 10, 12 and 14 add nothing. Most entries repeat a radio line from the same trigger. | Replace with the 18-entry Host file below: one new piece of objective evidence per depth. |
| t02-S11 | Medium | app-dive.js | `WHO.hale`, `GRADE`, miss lines after seal 15/16 | Hale keeps signing grades and miss lines after the player knows he is dead. | After seal 15, miss and grade lines come from the Pall ("—") in its own voice (for example, F: "You left me alone with the Host all week. I was not bored."). After seal 16, they come from the static or night-nurse voice. |
| t02-S12 | Low | book4.js, book13.js | c4-graft, c13-preg | Because the Host *is the player*, these lines claim that the owner had a transplant or a pregnancy. That is a reason to make them neutral beyond t02-22. Keep the Host's sex unstated everywhere. | As in t02-22. |
| t02-S13 | Low | story.js | p2 vs h2 | A callback is missing: the Bassiet came in at the left hand, the same way the Pall did (needlestick on the left index finger, grey spreading from the left hand). | Pall line at ch:c16-tracts (y16a below). |
| t02-S14 | Idea | app-dive.js | final duel | Stage it: the boss name bar flickers from "The Pall" to "Dr. Hale" and back, Hale's orange speaker colour turns grey mid-duel, and the timer bar is labelled 03:17. | — |

### Escalating, clue-bearing transmissions (paste into STORY.T)

```js
/* depth 1–4: subtle */
{id:'y2a',at:'ch:c2-scar',from:'hale',t:'Scars hold. That is all they do. I have one on my finger from the night I— Never mind. Keep moving.'},
{id:'y3a',at:'ch:c3-inherit',from:'hale',t:'Everything the Host is, written down. Read all of it. I want to know what is written in there.'},
{id:'y4a',at:'ch:c4-adaptive',from:'probe',t:'Memory T cells active against an antigen with no match in any library. Exposure estimated: a single night.'},
/* depth 5–8: contradictions */
{id:'y5a',at:'ch:c5-para',from:'hale',t:'I used to tell students the worst parasites are the ones that make you protect them. I do not remember which students.'},
{id:'y6a',at:'ch:c6-pd',from:'hale',t:'Every key fits a lock. Funny. I can feel them turning. From up here.'},
{id:'y7a',at:'ch:c7-onc',from:'probe',t:'Latency check: topside transmissions arrive 0 ms after the lamp moves. Expected: 40 ms. Logged.'},
{id:'y8a',at:'ch:c8-vessels',from:'hale',t:'Plaques this thick at the Host\'s age. Coffee, no sleep, nights on call. I used to warn them about that on the ward.'},
{id:'y8b',at:'ch:c8-failing',from:'hale',t:'Do you know what a slow heart failure is like? You drown in a dry bed. I watched it once. Very close. Too close.'},
/* depth 9–12: impossibilities */
{id:'y9a',at:'ch:c9-restrict',from:'static',t:'…cannot… breathe… Bed 4… why is no one… …ssshh…'},
{id:'y10a',at:'ch:c10-salts',from:'probe',t:'Signal triangulated. Origin: not topside. Origin: inside the Host, moving with the grey.'},
{id:'y11a',at:'ch:c11-pancreas',from:'hale',t:'I am not hungry. I have not been hungry since March. Is that strange?'},
{id:'y12a',at:'ch:c12-adr',from:'hale',t:'Do not listen to the glands. Listen to me. I am the only voice down there that wants you to reach the bottom.'},
/* depth 13–14: open menace */
{id:'y13a',at:'ch:c13-cycle',from:'hale',t:'Stop looking up for me. I am not up there.'},
{id:'y14a',at:'ch:c14-muscle',from:'hale',t:'Pull, release. I do not have to ask the left hand to move any more. It moves when I want it to.'},
/* depth 16 */
{id:'y16a',at:'ch:c16-tracts',from:'pall',t:'You came in through the left hand. So did I. Every road since, I walked behind your lamp.'},
{id:'y16b',at:'ch:c16-degen',from:'pall',t:'You are fading too, little lamp. Cell by cell. Let go, and it stops hurting.'},
{id:'y16c',at:'ch:c16-senses',from:'host',t:'Through the windows: a ward at night. A bed. A name on a wristband you almost know. Someone grey is standing over you.'},
```

### Bosses 15–16 lines

| Boss | intro | win | lose |
|---|---|---|---|
| The Echo | It speaks in Dr. Hale's voice, word for word. Then in yours. | The voice breaks into static. Under it, for a moment, your own breathing. | It finishes your sentence for you. You let it. |
| The Pall | No more voices. No more doctor. Just the grey, and you, and the last dark room. Light it before I reach it. | The grey tears like wet paper. Somewhere far above, a left hand twitches. | It reaches the edge of the lamp's circle and waits. It has all night. |

### Proposed Host file (one new piece of evidence per depth; no repeats of radio lines)

```js
H:[
{id:'h1',at:'start',t:'Patient: unknown. Ward 9, Bed 4. Unresponsive. Febrile. Grey discolouration spreading from the left hand.'},
{id:'h2',at:'ch:c1-membrane',t:'Left index finger: a healed puncture wound, about 1 mm. Typical of a needlestick.'},
{id:'h3',at:'seal:1',t:'Necrosis around the cannula site: coagulative, liquefying at the edges, like wet gangrene. Cultures: no growth.'},
{id:'h4',at:'seal:2',t:'Granulomas in liver and lung. No organisms in any of them. A grey core at the centre of each.'},
{id:'h5',at:'seal:3',t:'Genome screen: no inherited disease. A short run of foreign human sequence in three cell lines. Not the Host\'s.'},
{id:'h6',at:'seal:4',t:'Anti-HBs high titre, anti-HBc negative. Vaccinated, not infected.'},
{id:'h7',at:'seal:5',t:'Every culture negative. Every PCR negative. The grey takes none of the five stains.'},
{id:'h8',at:'seal:6',t:'Drug chart: three extra doses given at 03:17 on three different nights. No prescriber signature.'},
{id:'h9',at:'seal:7',t:'A lymphocyte carries a record of another patient: HALE, E. Ward 9. Admitted febrile.'},
{id:'h10',at:'seal:8',t:'Telemetry: a 2.8-second pause at 03:17 every night since admission.'},
{id:'h11',at:'seal:9',t:'Bedside inventory: one radio, tuned to Channel 3, unplugged. The ward clerk says it was there before the patient came.'},
{id:'h12',at:'seal:10',t:'Bed 4, previous occupant: HALE, E., Ward 9 doctor. Discharged: deceased, 03/03, 03:17. Personal effects not collected.'},
{id:'h13',at:'seal:11',t:'Years of meals between 22:00 and 04:00. Coffee. Hands that still smell faintly of alcohol gel.'},
{id:'h14',at:'seal:12',t:'Night nurse\'s note: "Someone at the bedside at 03:17 again. Did not see them come in."'},
{id:'h15',at:'seal:13',t:'Wristband partly legible: B A S S . . T.'},
{id:'h16',at:'seal:14',t:'Occupational health: no needlestick reported from Ward 9 on 03/03.'},
{id:'h17',at:'seal:15',t:'The Host drew blood from Dr. Hale on the night he died, and signed the certificate. The needlestick was never reported.'},
{id:'h18',at:'seal:16',t:'Wristband, now legible: BASSIET. Ward 9 doctor. The Host is you.'}
]
```

### Ending sequence (the `#ending` view, played once, line by line)

1. probe: "Pall signal lost. Lamp at full stain. Probe designation BASSIET matches patient wristband."
2. static: "Ward 9, Bed 4. Eyes open. The monitor clock reads 03:17."
3. host: "Your left hand is your own again. You can feel the cannula. You can feel the old scar under it."
4. host: "On the bedside table, a radio you never brought. Unplugged."
5. static: "It clicks once."
6. The Host file opens, with every line unredacted and the last one alone: "The Host is you."

### Note for the coordinator

The twist addresses the player as a Ward 9 doctor. The owner is a GP, so it lands personally, which is effective, but it means any line that gives the Host a sex, a pregnancy or a transplant (t02-22, t02-S12) should be neutral.
