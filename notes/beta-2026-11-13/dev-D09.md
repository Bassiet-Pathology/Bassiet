# D09 handoff: book5a.js, book5b.js, book6.js (Depths 5–6 content)

Files edited: /home/claude/citron/book5a.js, book5b.js, book6.js only. No new files, so the coordinator needs to add no script tags. Chapter ids are unchanged, and chapter titles still match the strata names in depths.js.

## Verification
- `node --check` passes on all three files.
- My checker (beta/work-D09/chk.js) over my 9 chapters: 60 questions; answer keys spread 15/15/16/14 over indices 0–3; every question has `d` and a `c` that exists in BANK; every explanation is 2–4 sentences; every table row matches its column count. The key is the single longest option in 8 of 60 (it was most of them before); the rest are short species names.
- vbook.js reports OK on a private copy (beta/work-D09/tree). On the live tree it now crashes before checking anything — see Requests.
- s7.js 16 on the live tree: all 16 depths stained and sealed, every duel won, `ERRS []`.
- Screenshots at 390 px and 1440 px in beta/work-D09/: the new tables fit on a phone.

## What changed, by finding
| Finding | Change |
|---|---|
| t03-01, t04-01, t05-01, t07-01 (my share) | Answer keys rebalanced across all 9 chapters to 15/15/16/14 over the four positions. No explanation refers to an option letter. |
| t04-11, t07-01 (length cue) | Distractors rewritten to match the key in length and specificity. |
| t03-18, t04-10 | Every one of the 60 explanations rewritten to 2–3 sentences: why the key is right, then why the most tempting distractor is wrong. |
| t04-12 | Most stems are now two- or three-step clinical vignettes instead of one-line recall. |
| Contract 2.3 | `d` (subject) added to all 60 questions and `c` (concept id) to all 60. Chapter `c:` lists extended with the concepts the chapters actually teach, each new id placed first so links.js ordering still holds. |
| t03-06 | The copied poorly-staining-organisms mnemonic in c5-gpos replaced with an accurate, original list of which organisms need which stain. |
| t03-07, t04-46, contract 2.8(e) | All four commercial-review mnemonics in my files replaced with original lines: the Nocardia/Actinomyces pair, the two G-protein receptor mnemonics in c6-pd, the zero-order drug mnemonic, and the two poisoning mnemonics in c6-ans. The new G-protein line uses the odd/even muscarinic pattern instead. |
| t02-23, coordinator request | c5-gpos epigraph replaced with D06's exact wording. "The Overdose" → "The Double Dose" is a boss name in depths.js and does not appear in my files; my chapter titles already match D06's strata names, so nothing else needed renaming. |
| t03-11 | New section in c5-gpos on acid-fast organisms (previously absent from the whole app): wall chemistry, why treatment is long and combined, the immune axis that controls them, the two poles of leprosy, plus a species table and two stains. |
| t03-13 | New section in c5-gpos on horizontal gene transfer and why resistance spreads, with a table and stains on encapsulated organisms (and why conjugate vaccines work) and on spores. |
| t03-12 | New "Atypicals" section in c5-gneg covering the organisms the chapter previously lacked, including the one that had been used only as a distractor. |
| t03-14 | Culture media table added to c5-gneg (11 rows). |
| t03-32 | The exotoxin/endotoxin paragraph no longer contradicts its own table about heat stability; A-B subunit structure added. |
| t03-31 | Group B streptococcus screening updated to the current 36 0/7–37 6/7 week window with rectovaginal culture. |
| t03-28, t03-29, t03-30, t03-42 | c5-virus: circular-genome list corrected; two family names updated to current taxonomy with the old names kept in brackets; prion diagnostics updated so the modern CSF assay is first and the older marker is called supportive; four missing virus families added to the RNA table. |
| t03-33 | c5-fungi: the "they are inhaled" sentence now names the exception that is inoculated through skin. |
| t03-41 | c5-para: the missing high-yield parasites added (one free-living amoeba pair in the prose, three worms in the table), plus the current drug for one protozoan. |
| t04-06 | c6-tox drug-induced lupus row rewritten so the tested antibody is correct and the usual organ sparing is stated. |
| t04-13 | c6-ans: nerve-terminal pharmacology map added as a pharm stain (every synthesis, storage, release and reuptake step with its blocking drug). |
| t04-26 | c6-ans catecholamine pathway corrected: the decarboxylase step restored, cofactors named, and breakdown products split by parent amine so the neuroblastoma and pheochromocytoma markers are distinguishable. |
| t04-27 | c6-ans adrenergic table extended: partial-agonist beta blockers, the nitric-oxide-releasing one, a beta-3 row, an indirect sympathomimetic row, and an alpha-2 antagonist. |
| t04-28 | c6-pk teratogen table extended by four drugs; the alcohol row rewritten with the correct facial features. |
| t04-29 | c6-tox antidote table extended by six entries; the antidote mechanism and timing for the commonest overdose now stated in the prose. |
| t04-48 | The one-line section openers in c6-ans and c6-tox replaced with mechanism paragraphs. |
| t08-46 | Figure placement: the pharmacokinetics figure moved to the section that teaches steady state, and the autonomic figure moved to the drug section rather than the wiring section, as the figure tester asked. |
| t03-09 (partly) | Antimicrobial and antifungal pharmacology is D15's new stratum, so I did not duplicate it. I did add the per-class antifungal table and the resistance mechanisms that belong with the organisms. |
| Contract 2.8(f), general depth | New sections added where chapters were thin: a how-to-read-the-markers section for one virus (with a six-row interpretation table and a REMEMBER box), a stain-and-microscopy section in c5-fungi, a receptor-families-that-are-enzymes section in c6-pd, a protein-binding and volume-of-distribution table in c6-pk, a pharmacogenomics stain, and a bedside poisoning-pattern section in c6-tox with a REMEMBER box. |
| Contract 2.10 | British spelling and original wording throughout. The only US spellings left in my files are inside concept ids I must not rename. |

Chapter prose now runs 528–1303 words per chapter (was roughly 250–600), with 3–6 sections each and 6–7 questions each.

## Could not do
- t03-09 in full (a whole antimicrobial pharmacology chapter): that is D15's `c5-drugs`, and contract 2.7 gives it to them.
- t03-08 (table min-width on phones) is index.html CSS, D01's file. I reduced my widest new table from five columns to three so it reads at 390 px without that fix.
- Option shuffling at render time is D04/D05's work; I only rebalanced the source keys.

## Requests to other owners
- **D01 (index.html)**: the phone table fix from t03-08 (`@media (max-width:600px){table.btab{min-width:0;font-size:14px}}`) would help my four- and five-column tables; several of mine now have three or four columns.
- **D18 (bank files) or whoever owns the Atlas copy**: concept ids `anemia` and `fetal`-prefixed text keep US spellings; my questions reference `anemia` by id only, so no change is needed in my files, but the Atlas display name may want the British spelling.
- **Coordinator / tooling owner**: `scratchpad/vbook.js` now fails on the live tree because it evals `book*.js` in alphabetical order, so `bookx1.js` and `bookx2.js` run before `depths.js` defines `DEPTHS`. Loading `depths.js` and `story.js` first (or sorting so `bookx*` come last) fixes it. Nothing is wrong with the source: the same checker passes on a copy without the two new files, and s7.js 16 passes on the live tree.
- **D20 (figs7.js)**: c5-virus now has a section built around the serological marker sequence with an interpretation table; the figure the figure tester proposed for that chapter would attach naturally to that section (`h` contains the word "ledger"). c6-tox's new bedside-pattern section would also suit a figure.
