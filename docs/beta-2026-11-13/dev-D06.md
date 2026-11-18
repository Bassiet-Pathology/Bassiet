# D06 handoff: story.js, depths.js

Both files pass `node --check`. A private run of `s7.js 16` (copy of the tree at beta/work-D06/tree) finishes all 16 depths with `noUndef true` and `ERRS []`. After the full descent the Host file shows 20 entries and the Radio log shows 113 lines (that tree did not have the new strata yet). Every existing trigger format still works (`start`, `enter:N`, `ch:<id>`, `seal:N`, `miss`, `return`, `night`). No new files.

## What changed

### story.js
| Finding | Change |
|---|---|
| t02-03 (High) | **Every chapter now has a transmission.** There are 78 `ch:` lines: all 71 existing chapters plus the 7 new strata from 2.7 (`c1-metab`, `c5-drugs`, `c6-sleepers`, `c13-origins`, `c14-frame`, `c15-young`, `c16-nerves`). Story lines went from 41 to 172 (120 are story beats, the rest ambient). The new-strata lines are written to make sense whether they are read before or after their depth's seal (contract 2.4). |
| t02-04 / 2.5 | Boss lines are in depths.js (below). |
| t02-05 / 2.5 | `STORY.END` is the ending sequence: 11 lines of `{from,t}`, played in order. |
| t02-10, t07-34 | New pool `at:'duellose'` (6 lines). An alias copy with `at:'duel-lose'` is generated at the bottom of the file, so either name works with `pick()`. |
| t02-11, t01-41 | The miss pool grew from 4 to 14 lines. |
| t02-33 | Night pool 2 → 5. New pool `night317` (2 lines) for 03:10–03:25. Return pool 2 → 5. |
| t02-36 | New pools `restain` (3 lines, for a successful re-stain) and `fading` (3 lines). |
| t02-07/08/09 | `STORY.GRADE.hale` has rewritten A–F lines (no invented "three sites", no "hold the line"), plus `first` for a brand-new player. A pool `at:'first'` holds the same line. |
| t02-26 | Post-game pools `after` (4) and `missafter` (3), plus `STORY.GRADE.after` signed "NIGHT NURSE". |
| t01-09 | p4 now explains the core loop: the five stains and their colours, reading a stratum, the stain test (six right in every ten), the seal, and going deeper. The misleading "light a site with all five" is gone. |
| t02-16 | d13a no longer says "It only wants up". |
| t02-21 | d5a rewritten, so "not on any list" no longer appears three times on one page. |
| t02-29 | The header comment now lists every `from` value (including `pall`) and every trigger. `STORY.doctor` is kept, since it is harmless. |
| t02-35 | Added the c14-skin callback to the entry wound. |
| Host file (t02 Idea 2) | Grew from 10 to 20 entries, roughly one piece of evidence per depth, and none repeats a radio line (t02-S06/S10, details in the spoiler section). |
| Pacing | Clues now escalate in four stages: subtle in depths 1–4, contradictions in 5–8, impossibilities in 9–12, open menace in 13–14. Then come the revelations. Details are in the spoiler section. |

### depths.js
| Finding | Change |
|---|---|
| t02-04 / 2.5 | Every boss has `intro` (2–3 lines, a short scene; **show all of them, in order**), `win` (2 alternatives) and `lose` (2 alternatives; **pick one at random**). Each line stands on its own, so a random pick from `intro` also reads fine. |
| t02-13 | Boss 2 "The Ember Host" → **"The Unquenched"**, blurb "A fire that has forgotten what it was lit for." |
| t02-14 | Stratum `adr` → **"The Twin Crowns"**. |
| t02-12 | Stratum `pancreas` → **"The Ferment Glands"**. |
| t02-15 | Depth 13 "The Germinal Vaults" → **"The Sleeping Cloisters"** (it clashed with the Gene Vaults and the Nucleus Vault; the id `vaults2` is unchanged). Stratum `vessels` "The Coronary Catacombs" → **"The Coronary Tunnels"** (it clashed with the Nephron Catacombs). |
| t02-16 | The depth 13 blurb no longer repeats "The Pall has no interest here". |
| t02-21 | Boss 5 blurb: "It changes shape while you look at it." |
| t02-28 | "The Overdose" → **"The Double Dose"** ("It speaks in milligrams. Whatever you give it, it wants twice."). New blurbs for the Clonal Tide ("One face, copied until it is an ocean.") and the Crumbling ("It walks on lace that used to be bone."). |
| t02-24 | Rewrote the "Some X. Some Y." blurbs of depths 3, 4, 6 and 9. Depth 6 now reads "Every one of them is a poison at the right dose." |
| t02-25 | Every stratum has an optional `topic` (plain English, e.g. "Membranes, transport and the resting potential") for the reader kicker and search. |
| t02-37 | Every depth has an optional `tease`, a line of static to show on a shaft row that is still sealed from above. |
| Comment | The file header documents `topic`, `tease`, `intro`/`win`/`lose` and how to show each. |

### Not done
- **t05-47 (depth 15 `sys:'Psych'`).** `CT.SYS` has no 'Psych', and every psychiatry concept in the banks uses `s:'Neuro'`. Changing it would empty "Sites in this region" for depth 15 and file dive misses under a system that Hull and Today do not know. It would need D02 to add 'Psych' to `CT.SYS` and D17/D18 to re-tag the concepts. Left as 'Neuro'.
- **Chapter epigraphs** (t02-17/18/19/20/22/23/24). These live in book files I do not own, so they are listed under Requests.

## REQUESTS

**D05 (app-dive.js)**
1. Duel start screen: show `d.boss.intro` as a sequence, every line in order, styled with `tx`/`.from-<from>` and the speaker labels from `WHO`. In the result panel, show one random line of `d.boss.win` or `d.boss.lose`. Fall back to the current text if a field is missing.
2. `endDuel` on a loss: `CT.radio(pick('duellose')||pick('miss'))`.
3. `#end`: play `STORY.END` line by line (about 1.5–2 s apart, or tap to advance). Once a player has heard it, use `pick('after')` for ambient lines and `pick('missafter')` for miss lines.
4. Night: if the local time is 03:10–03:25, use `pick('night317')`; otherwise use `night` as now.
5. After a successful re-stain, use `CT.radio(pick('restain'))`. Optionally use `pick('fading')` when the fading panel first shows in a session.
6. Dive log: `var G=STORY.GRADE[voice]` with voice = `'hale'` by default. Use `G.first` when there were no reads before last week. Show `G.sign` in place of the hard-coded "HALE". (The spoiler section says when to switch voices.)
7. Shaft rows sealed from above: show `d.tease` under "Sealed from above".
8. Chapter header: kicker `DEPTH −0N · <stratum.topic>` (fall back to the depth name), and H1 = **stratum `name` from depths.js**, not `BOOK.title`. That way the renamed strata (Coronary Tunnels, Twin Crowns, Ferment Glands) match even if a book title lags behind.
9. **Backlog flood.** A returning player who is already deep will now receive up to about 70 new `ch:` lines on the next open, because those chapters are already done. On home, show only the newest 5–6 fresh lines, add a link "N earlier transmissions in the Radio log", and mark the rest seen. Lines in `STORY.T` are in story order, so the Radio log can show them top to bottom without `.reverse()` (t02-06).
10. Optional: in `hostFile()`, base the redaction bar on the text length (t02-30). The Host file now has 20 entries.

**D10 (book8b.js):** `BOOK['c8-vessels'].title` "The Coronary Catacombs" → "The Coronary Tunnels". Optional t02-24 epigraph for c8-valves: "Four gates keep the flood moving one way. One has rusted half shut; one swings loose and lets the tide fall back."

**D13 (book13.js):** the depth is now "The Sleeping Cloisters". c13-cycle epigraph → "In these cloisters the hormones rise and fall like seasons, on a calendar nothing else in the body keeps." (This removes "It only wants up".) c13-preg epigraph → "These cloisters were built to hold a second heartbeat. Learn what one changes in the body that carries it." Change any other "vaults" in depth 13 epigraphs to "cloisters". c14-joint (book14.js) epigraph → "Every hinge in the wall grinds: the old ones from wear, the young ones because the guards have turned on them."

**D08 (book4.js):** c4-graft epigraph → "Sew a stranger's tissue into a body and the guards will remember its face for as long as it lives."

**D09 (book5a.js):** c5-gpos epigraph → "They settled on the Host in the first hour of life and never left."

**D11 (book9b.js):** c9-flooded epigraph → "Fluid, pus, blood, growth: each cave has drowned in something different. The lamp tells them apart."

**D14 (book15.js, book16a.js, book16b.js):** c15-mood epigraph → "Moods drift in here like weather off a cold sea. This front came in and never moved on." c15-psychosis → "Some voices here speak in the first person. Count them. There should be only one." c16-cells → "Lightning jumps the black gaps faster than anything else in the body, because it is thought. Somewhere in the storm is the thing the Pall came for." c16-degen → "Not dead. Fading, cell by cell, plaque by tangle, like a photograph left in the light."

**D15 / D16:** transmissions already exist for `c1-metab`, `c5-drugs`, `c6-sleepers`, `c13-origins`, `c14-frame`, `c15-young` and `c16-nerves`. Please add a `topic` field to each stratum you push (for example `{id:'metab',name:'The Furnace Ledgers',topic:'Metabolic pathways and storage diseases'}`).

**D01 (index.html):** nothing required. Boss intro lines can reuse the `.tx.from-*` styles.

---

## SPOILER-SENSITIVE (owner must not see)

**The truth, kept intact and deepened.** Hale died in Ward 9, Bed 4, at 03:17 on 03/03. The radio voice is the Pall wearing his voice. The Host is a Ward 9 doctor named BASSIET, who took Hale's bloods that night, had a needlestick to the left index finger, signed his death certificate, and never reported the injury. The "probe" is the Host's own mind going down through their own body.

**New depth, all supported by evidence in the story:**
- The Host now lies in the bed Hale died in, and the unplugged radio is his uncollected effect (h11, h14). This closes the timeline hole in t02-S02.
- **The chain.** Hale caught it the same way: a needlestick on 11/01 from Bed 4's previous patient, also never reported (h16). Supporting clues: Hale's slip about his own finger scar (x2c), his "same ward, same bed" film (x7c), the 03:17 pause on telemetry recorded before this admission (h10), and a second, older foreign sequence (h17).
- **The Pall has no genome of its own; it is made of borrowed people.** Clues: x3d ("only borrowed ones"), h5, h9 (two HLA sets), h12 (matched to Hale), x5f ("made of people"), x4a (the immune system reads it as self).
- **Sedation motive.** The Pall keeps the Host asleep: extra midazolam at 03:17 with the bung open (x6a, x6d, x6e, d6b, h8), and exogenous insulin with high insulin and undetectable C-peptide (x12d). The figure at the bedside (d12c, h15) is the implied hand.
- **Why the Pall let the seals break (t02-S03).** Each avatar was a lock on the Host's door: "I gave you fifteen of my faces to break… You opened them all for me" (boss 16 intro). d16a now makes the last depth a race.
- **Theme.** The Pall lives in what is not looked at: the unreported needle, the blank incident book (h18). The Echo's win line and the ending make the Host face and report it.

**Fair foreshadowing through the boss voice.** The unnamed "—" voice speaks in every duel from depth 1 and reuses Hale's words before Hale says them, or right after. Examples: "Keep going down." (boss 3 lose); "Double it. You can take it." (boss 6 lose, then d6b at the seal); "drowned a doctor… in a dry bed" (boss 9, after x8e); "I always keep it open" (boss 16 lose = r2); "Do not stop for me" (d5b → d15b → boss 15 lose). The Echo's intro replays p2.

**Escalation (t02-S04).**
- Depths 1–4, subtle: d1c, x2c, x3a, d3b, x4c "Mind who you trust".
- Depths 5–8, contradictions: d5b fixed (t02-S05), x5e, x6b, d6b, x7c, x7d (0 ms latency), d7b, x8c, x8e.
- Depths 9–12, impossibilities: x9a (breathing in time with the static), x9d, x9e, d9b softened to a power-draw reading, x10c (signal from inside), x11c ("since March"), x12d, d12c and d12b (t02-S07).
- Depths 13–14, open menace: d13a ("What I want is further down"), x13a, x13b, x14a ("I put it there"), x14c (the left hand), x14e.
- Depth 15, reveals: d15b now includes Hale's "Do not stop for me"; d15d moved to the `pall` speaker and states plainly that Hale is dead (t02-S08).
- Depth 16: the Pall speaks openly (x16a/b/d). t02-S13 is the left-hand callback in x16b.

**Fixed for consistency.**
- d2b now says months at most, not years, and matches h2.
- d11b is less on-the-nose (t02-S06).
- d1c no longer duplicates the Host file, and neither does d4b.
- d13b (radio, partial wristband) and h19 (full name) no longer duplicate each other.
- h20 "The Host is you." stands alone (t02-S09).
- t02-S12: the new lines never give the Host a sex, a pregnancy or a transplant. x13b describes the Pall being carried, not a pregnancy. x15d says "parent".

**Ending (`STORY.END`).**
1. Signal lost.
2. Designation BASSIET matches the wristband: "there was no probe".
3. "The Host is you."
4. 03:17, with no pause on the monitor.
5. Eyes open; the scar under the cannula.
6. The nurse says the name.
7. His radio, unplugged since March.
8. The Host resolves to report it.
9. Someone gloveless labels the Host's blood tubes down the corridor.
10. "…"
11. "It clicks once."

It is a victory with lasting dread, and it leaves room for the chain to continue.

**Spoiler-related requests to D05:**
- (a) `STORY.unmask = {at:'seal:15', who:{hale:'— · Ward 9'}}`. Once `fired(unmask.at)`, label 'hale' lines with `unmask.who.hale` in `tx()`, the radio pop-up and the Radio log. This quietly retcons the whole log (t02-S08).
- (b) Dive-log voice: use `GRADE.pall` when seal 15 is broken and seal 16 is not; use `GRADE.after` when seal 16 is broken (t02-S11). Miss lines: after seal 16 use `missafter`.
- (c) Final duel staging (t02-S14, optional): the boss bar flickers between "The Pall" and "Dr. Hale", and the timer is labelled 03:17.
- (d) The c15-subst memory (d15b) and the seal 15 pair (d15c, d15d) must reach the player in sequence, not just in the log (t02-S01). This is covered by D05's t02-01 fix.
