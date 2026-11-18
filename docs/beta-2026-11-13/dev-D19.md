# D19 handoff: interactive figures (figs.js, figs2.js, figs3.js)

Files edited: `/home/claude/citron/figs.js`, `figs2.js`, `figs3.js` (all three rewritten). No new files, so no script tags and no sw.js changes are needed.
Checks: `node --check` passes on all three. `s7.js 16` (full descent) completed with all 16 depths sealed, `noUndef true` and no page errors. No console errors in any figure state.
Renders: before and after contact sheets are in `beta/work-D19/shots/`. `before375-*.png` is the baseline. `a375-*`, `a320-*`, `a600-*`, `a640-*`, `a820-*` and `a1440-*` are the new renders. Metrics are in `beta/work-D19/metrics-*.json`, and the scripts are `fshot.js` (a figshot copy with metrics) and `chap.js` (keyboard tests inside real chapters).

## Results
- **Smallest SVG label** at 375 px: **12.7 px** (was 6.4 px). At 320 px it is 10.6 px, at 1440 px 14–16 px, and at 820 px 15.7 px.
- No text is clipped by its viewBox. The only text overlaps left are the line boxes of two-line labels in `gram`. The glyphs themselves do not touch.
- There is no horizontal page overflow at 320, 375, 600, 640, 820 or 1440 px.

## What changed, by finding

### Shared figure kit and handlers (figs.js; used by all 26 figures)
- **New `CT.figKit`** = `{narrow, tx, tx2, arrow, svg, btn, rng, meter, sw, esc, r1}`, plus `CT.figNarrow()`.
  - `narrow()` is true when `innerWidth <= 620`, which matches D01's phone media query. On a phone, figures draw on a ~340-unit viewBox (scale ≈ 0.97 at 375 px). Wider screens use a 440–520-unit viewBox.
- **Label sizes come from D01's classes**, as the coordinator asked. `tx()` turns a size hint into `.ft`, `.ft.sm` or `.ft.big`. There are no hard-coded font sizes in the SVGs, and every colour is a theme token (`var(--…)`/`color-mix` of tokens; no hex values).
- **t08-11 / t09-03 (figure part): focus is kept.**
  - `CT.actions.fig` no longer rebuilds `.fc` when only the pressed state changes; it updates `aria-pressed` in place.
  - When the control set does change, it rebuilds `.fc` and puts focus back on the matching control.
  - Verified: after Enter on a figure button, focus stays on that button, not BODY. Space also works.
- **New: arrow keys move within a row.** Left/Right/Up/Down and Home/End move focus between the buttons of one control row.
- **t08-38 / t09-25: screen readers hear the state.**
  - Each SVG's `aria-label` is built from the state, e.g. "Coagulation cascade, Warfarin: affected II, VII, IX, X, proteins C and S", plus the pressed controls.
  - Each figure has a visually hidden `aria-live="polite"` region (`.fsr`) that reads the caption after a change. Slider changes are announced after a 500 ms pause.
- **t08-37 / t09-25: sliders are properly labelled.**
  - `rng()` takes a human label and renders `<label for>`, `aria-label` and `aria-valuetext` (with units).
  - It also accepts `vals` (stops that map to a list of values) and an optional `FIG[id].fmt(k,v)` for display text.
- **t08-45 (generic part):** the input handler formats slider values by the step's decimals, so "7.30" no longer shows as "7.3". This applies to D20's figures as well.
- **Layout follows rotation:** on resize, figures redraw when the width crosses the phone breakpoint.

### Fixes by figure
| Fig | Findings | Change |
|---|---|---|
| coag | **t08-01 (Critical)**, t08-25, t08-50 | Every problem now lists node keys that are matched exactly; the old prefix match is gone. Verified: warfarin and vitamin K deficiency hit II, VII, IX and X plus proteins C and S, and not V. Haemophilia A hits only VIII. New nodes: TF, fibrinogen → fibrin clot, antithrombin (shown "boosted", with flat-headed inhibitor lines to X and IIa for heparin), protein C/S, vWF and platelets. Hit nodes have a red fill, a ✕ and strike-through text, so colour is not the only cue. Problems are split into Drug (warfarin, heparin, Xa inhibitors, dabigatran/argatroban) and Disease (vitamin K deficiency, liver failure, haemophilia A and B, vWD, DIC, ITP, Bernard–Soulier). A lab grid shows PT/INR, PTT, platelets and bleeding time, plus a teaching caption (warfarin necrosis, VIII normal in liver disease, LMWH, reversal agents). |
| ischemia | t08-04, t08-12, t08-42, t03-45 | Stop slider from 0 min to 2 days (16 stops). Reversible steps run on the tissue's tolerance clock. Signs after death run on an absolute clock: enzymes at L + 2 h; light-microscope necrosis at ≥ 4 h; pyknosis ≥ 6 h; karyorrhexis ≥ 12 h; karyolysis and neutrophils ≥ 24 h. Neurons get their own timing: red neurons at 12–24 h, then liquefactive necrosis. A drawn timeline shades reversible against irreversible, marks "no return ≈ X" and shows the current time. Caption grammar is fixed. |
| repair | t08-09, t08-10, t08-47 | Double-strand break: both strands are now cut. Thymine dimer: two red rungs joined by a bar. Mismatch: two half-rungs that do not meet. Oxidised base: one red half-rung labelled 8-oxoG. New 3-step mechanism control (Damage → Recognise, cut → Fill, seal): it shows the sensor proteins, the cut points, the lifted-out oligo, the AP site, Ku70/80 on the ends, the unhooked cross-link, and new DNA in accent. The diseases are expanded (Lynch, XP, MUTYH, BRCA/ATM/Artemis-SCID, Fanconi). |
| apoptosis | t08-14, t08-15 | Snake layout of 2 rows × 3 nodes with two-line labels, so nothing clips. DNA damage goes p53 → PUMA/NOXA. Growth-factor withdrawal goes BIM (BH3-only). Cytotoxic T cell: perforin → granzyme B → BID and direct caspase-3. The BCL-2 block sits at BAX/BAK, and the figure notes that BCL-2 does not stop the Fas or granzyme doors. Venetoclax is mentioned. |
| pump | t08-29, t08-30, t08-39, t01-36 | Meters show explicit words (volume reads "normal" when it is normal). The caption is no longer clipped. The grey cell uses tokens, which fixes Lights-on. The Na⁺/Ca²⁺ exchanger is drawn (and slows with digoxin), Ca²⁺ ions are shown, water enters on ATP loss, and there is a key. |
| etc | t08-21 | Intermembrane space and matrix are labelled. NADH enters at I and FADH₂ at II. Q and cyt c are drawn. H⁺ arrows go out through I (4), III (4) and IV (2), with "no H⁺" at II, and back through V. The uncoupler leak is drawn. The electron path is segmented, so with rotenone flow starts at II. Blocked complexes are marked with ✕. There is a key (e⁻ line, H⁺ square). |
| leuko | t08-26 | Neutrophil with a three-lobed nucleus. Molecule pairs are drawn at the contact for each step (selectin–sLeX, LFA-1–ICAM-1, PECAM-1 at the junction, chemotactic gradient), with a ghost trail of earlier positions. LAD1 keeps rolling, and its caption is accurate. |
| pedigree | t08-19, t08-43 | Spouses II1 and II6 now sit outside the sibship. Every individual is labelled. Second-generation families exist for both II2 and II5, so "never father to son" (XLR) and "affected fathers pass nothing" (mitochondrial) are visible, and AD shows father-to-son transmission. Heteroplasmy is shown as half-filled. |
| gram | t08-33 | Labels sit outside the bars, with leader lines. The periplasm is drawn. Teichoic acids and the crystal violet–iodine complex are drawn. The outer membrane dissolves after alcohol. A "microscope" result row says the colour in words. |
| pk | t08-31 | Dose × 1 / × 2 toggle, with a ghost × 1 curve for comparison. Y-axis label. Swing wording: < 25 narrow, < 60 moderate, otherwise wide. A note appears when steady state falls beyond 96 h. Sliders use clean stops (half-life 2–24 h, interval 4–24 h). |
| drc | t08-32 | EC₅₀ drop lines and markers, and a legend. Antagonist dose (Low/Medium/High) shifts the EC₅₀ (competitive ×3/×10/×30) or lowers the Emax (non-competitive). New "Full + partial" mode uses the two-agonist occupancy model, with a buprenorphine example. |
| ans | t08-05, t08-47 | The table is gone. A receptor bar panel (α₁ α₂ β₁ β₂ M N, stimulated up and solid, blocked down and dashed) sits above a label : value grid for heart rate, BP, airways and pupils that fits a phone. Content is checked (isoprenaline mean BP falls; organophosphate N column; antidotes). |
| anemia | t08-20 | The reticulocyte toggle now changes every band: micro + high (thalassaemia, treated iron deficiency, HbE/HbC), macro + high (reticulocytosis, cold agglutinins). A red cell drawing scales with MCV. Content is refined (ACD usually normocytic, Mentzer, MMA in B12 only). |

Not fixed by me (outside my files): t08-02/13/36/39 CSS, already handled by D01; t08-46, where book owners already moved `pk`, `ans` and `cord` into the right sections; and figures in figs4–7, which belong to D20.

## Requests to other owners
- **D20 (figs4–7):** optional, but recommended. Use `CT.figKit` (`tx`, `rng` with a human label, `btn`, `svg`, `arrow`) and `CT.figNarrow()` (true when width ≤ 620, the same as D01's phone CSS), so your labels get the class sizes, a narrow layout, `aria-valuetext` and the focus handling. Old-style `rng` helpers still work with the shared handler.
- **D01 (index.html):** nothing required. If you want shared classes for what I currently style inline, I would use: `.fsr` (visually hidden live region) and `.fgrid` (label : value grid used in `ans`/`coag`, i.e. `dl{display:grid;grid-template-columns:max-content 1fr}` with mono uppercase `dt`).
- **D02 (sw.js):** no new files from D19.
