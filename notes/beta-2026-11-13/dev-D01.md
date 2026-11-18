# D01 handoff: index.html (all CSS and the head)

Owner file: /home/claude/citron/index.html (only file edited). No new files, so no script tags to add. Script order is unchanged.

Checks run:
- Full descent `s7.js 16` on a private copy of the tree: all 16 depths sealed, `noUndef true`, `ERRS []`.
- Before and after screenshots, both worlds (dive, and Lights on with OS light), at phone 390, tablet 820 and desktop 1440. Every route was covered: home, radio plus toast, shaft, depth, chapter table, figure, quiz, duel intro, live duel, Host file, Atlas, concept, Practice, session, Plates, Hull.
- The raw file opened directly is now UTF-8 at 390 px. It is still quirks mode, because no doctype was added (see below).
- Scripts and shots: `beta/work-D01/` (`shoot.js`, `tables.js`, `raw.js`, `shots/B-*` before, `shots/A-*` after, `shots/M-*` montages).
- A table probe rendered all 211 book tables at 390 px. 4–5 column tables now fit. Only three 3-column tables still overflow, by 6–33 px, and they show scroll shadows.

## Head (t01-38, t09-02, t10-13, t02-32, t03-46, t06-51, t07-40, t08 note)
- Added `<meta charset="utf-8">` (first line), the viewport meta (`width=device-width,initial-scale=1,viewport-fit=cover`), a description, and `color-scheme`. Each light/dark token block now sets `color-scheme`.
- `lang="en"` is set from the first inline script (`document.documentElement.lang`). The page is a fragment, so there is no `<html>` tag to put it on.
- I did NOT add `<!doctype html>`. The publish skeleton adds one, and a doctype might make the publisher skip its wrapper.
- **t09-33 / t10-14 fonts:** the Google Fonts links are gone. Pixelify Sans 700, Source Sans 3 400/600 and JetBrains Mono 400/500 are inlined as base64 WOFF in `<style id="fonts">`. They are OFL fonts from github google/fonts, subset with fontTools to every character in the tree, following the master-log practice. They add about 168 KB, so index.html is now about 230 KB. The pixel headings now render offline, in the PWA and in the sandbox: the testers never saw them before.
- The first inline script also applies the saved `motion` setting early.
- Markup additions:
  - a skip link (it focuses `#main` without changing the hash);
  - a header-height script (ResizeObserver sets `--hdr`);
  - a boot placeholder in `#main` ("Bassiet · descending", t01-16);
  - a permanent `<div id="sr-live" aria-live="polite">` (t09-17), which D02's toast and D05's `liveSay` already use.

## Layout bugs
- **t01-01 / t09-01 (High):** the dive header blur moved to `header.band::before`, so the header is no longer the containing block for fixed children. The phone nav is at 788–844 in the dive world again, and the brand shows.
- **t01-05 / t09-34:** the `--hdr` token replaces the hard-coded 58 px. It is 44 px by default on phone and measured live by the script, which also covers Large text. Used by `.lamp`, `.pane.list`, scroll margins and `#radio`.
- **t01-06:** on phone the lamp is a single scrollable row, the "LAMP" label is hidden below 420 px, and the lamp is not sticky on screens under 700 px tall. In the dive its background is opaque.
- **t01-07:** `scroll-margin-top` on headings, `.sec`, `.quiz`, `.q`, `.fig` and `.panel`.
- **Contract 2.6 (t01-03 / t01-04 / t07-11 / t09-16):**
  - `#radio` sits at the top under the header, `min(560px, 100vw−24px)` wide. At 1100 px and up it moves to the top-right at 380 px.
  - The box has `pointer-events:none`. Only `.rclose` is clickable, with a 44×44 hit area.
  - Each speaker has a colour, the box slides in, and reduced motion is respected.
  - The toast stays at the bottom (above the nav on phone), so the two can never overlap.
- **Contract 2.1:** `#toast.err` and `.toast.err` are styled: AA-safe `--bad` fill and ink plus a ✕ marker in Lights on, and a dark red slip in the dive. The dive's normal toast is now a lit console slip with an orange edge instead of a beige bar.
- **t01-13 / t03-08 / t09-26 / t08-05:**
  - `table.btab` has no forced min-width.
  - `.tw` has scroll shadows (local/scroll gradients) and is capped at the measure.
  - Phone padding and font are tighter, and hyphenation is limited.
  - On phone, tables with 4+ columns become one card per row using D05's `td[data-label]`. Labels keep their original case, because uppercasing turned "HBsAg" into "HBSAG". Header text is no longer uppercased for the same reason.
- **D10 request:** 4–5 column tables lost their last column at 390 px. Now they are cards, or tighter cells where there is no `data-label`.
- **t01-14 / t09-27:** on screens below 760 px, banner scenes are drawn at their natural width and right-aligned, so the depth, boss and tab emblems show. This is CSS only, so no change is needed in `scene()`.
- **t09-28 / t06-50:** at 960 px and up, the Practice end row, `.prog`, chip row and `.stage` share an 860 px centred column.
- **t09-29:** desktop home grid for D05's `.home` > `.hmain` + `.hrail`: 360 px rail, dashed divider, look panel stacked, compact dive log.
- **t09-24:** figures now have `max-height` 340 px, or 380 px at 960 px and up. They were letterboxed at 260.
- **t09-41:** one measure, `--measure:720px`, for paragraphs, stains, REMEMBER, tables, figures and questions.
- **t09-40:** look rows are a grid: stacked on phone and in the rail, 130 px label column elsewhere, and segments do not wrap.

## Figure CSS (t01-36, t08-02, t09-23, t08-13, t08-36, t08-39, t08-16, t08-25)
- At 620 px and below: `.figsvg .ft` is 15, `.ft.sm` 13 and `.ft.big` 19 user units. That renders at about 10.5 / 9 / 13 px on a 390 phone, up from 8 / 6.5 / 11. The figure box is slightly wider on phone.
- `.fbtn` is 38 px tall, and 44 px on phone. `.figrange` is 36 px tall (44 px on coarse pointers) with a 24 px thumb.
- `.frow b.mono` has a fixed-width value, so slider rows no longer jump.
- Theme tokens replace hard-coded colours: `.cellm.grey`, `.mi1`, `.mi2`.
- `.ssv` guide lines are muted and visible; the PV-loop ESPVR line was invisible.
- `.pnode.blocked` is now a tinted, dashed fill, so coag blocks are not shown by colour alone.
- Labels `.fig figcaption` and `.frow` labels are 12 px.

## Contrast, focus and accessibility
- New tokens in every theme: `--ctl` (control border ≥3:1), `--focus` (light `#A24B00`, 5.4:1), `--good-ink`, `--bad-ink`, `--dim` (locked text ≥5:1).
- t09-10: the focus ring uses `--focus`, with a glow in the dive.
- t09-14: `--ctl` on search, select, inputs, textareas, `.seg`, `.stb`, `.fbtn` and `.arrows`.
- t09-15: `.seg` no longer clips the focus ring; a pressed and focused button gets an fg ring.
- t09-09: `.btn.danger-b` uses `--bad-ink`, so it is white on dark red in light mode.
- t09-06: Predict fills use ink tokens, and a wrong pick is dashed and struck through. `.pres.ok` and `.pres.bad` are ready.
- t09-05: `.step.no-ok` is dashed and tinted, `.step.ok` is tinted, and `.step .mark` is ready.
- t09-36: `.opt.ok` and `.opt.bad` are tinted, bad is dashed, and the `.res` ✓/✕ sits at the right edge at 17 px.
- t09-08 / t09-30: the legacy `has d-*-bg` coverage cells get a solid-text tint and inline opacity is neutralised. D03's new inline colour-mix cells are left alone. Coverage cells get a focus ring and fixed layout; on phone they are 44 px tall with `min-width:0` (D03 request).
- t09-13 / t01-33: locked depths are dashed, with a greyscale icon and `--dim` text at 5.1:1. They are no longer at opacity .55.
- t09-22: micro-labels have a 12 px floor (console, transmission headers, depth status, stain/REMEMBER/table/figure labels, radio speaker, banner mono, boss label).
- t09-11: added `.vh` / `.sr-only`. `[tabindex="-1"]:focus` shows no outline (D03 request). Script-focused headings in `#main` show no ring.
- t09-35: `data-motion="off"` stops all animation and transitions.
- t09-21 (partial): Small .94, Large 1.16 (was 1.12), and XL 1.3 is ready for `data-size="xl"`.
- t01-15 / t09-38: 44 px touch targets on phone for `.fbtn`, `.seg`, cov cells and `.linkbtn`, 40 px for `.stb` and `.btn.small`. Lamp buttons in the off state are dashed and struck through.
- t01-31 / t09-19: option key hints show only in duels and never on touch screens.
- t01-27: `.srow` is centred and wraps. t01-28 / t09-47: `.hostf` has 36 px padding, readable markers and darker redaction.
- t09-39, t09-43 (outlined empty lens squares), t10-41 (badge inside the tab).
- t06-38: `.gridwrap` has scroll shadows, and `td.miss` is styled.
- D03 request: `.lens h3` matches `h4`. `.empty strong` no longer inherits a heading size; the cause was the old `.inst` font rule applying to D05's `<details class="inst">`, now fixed.

## World theming (t09-31, t09-48, t09-37, t09-30)
- In the dive:
  - Atlas, Practice, Plates and Hull get an h1 glow with a pixel square.
  - Every view gets a calm storage notice and gradient panels.
  - Atlas rows (`.crow`) glow on hover, lenses glow in their subject hue, and mode cards get a pixel corner and glow.
  - Practice gets a lit stage card and progress bar; Plates tiles glow on hover.
  - The ledger, hbars, pearl, concept web and empty states are all re-dressed.
- Duel: red-glow banner, gradient HP bar, the timer pulses when low, the banner hides on short phones (t01-35), and hull pips are glowing blocks with hollow lost pips.
- Styles for D05's new markup: `.rt`, `.loop`, `.duep`, `details.inst` and `.h2like`, `.brief`, `.bintro`, `.bline.from-*`, `.dstats`, `.duel-intro`, `.final`, `.rgroup`, `.srow.next`, `.srow.optional`, the ending (`.reader.ending` / `.endseq`, slow fade-in), `.gate` (D02) and `.fsr` (figs).

## Not done
- t09-21: rem-based type scale. Too wide a refactor for this round; I enlarged the zoom steps instead.
- t09-24: controls beside the SVG on desktop. The layout varies per figure, so it needs D19 and D20.
- t09-49 and t09-50 (ideas).
- t10-20 / t01-16 `defer` on scripts. It needs `CT.init()` moved to `DOMContentLoaded`; I left script loading alone.
- t09-32: making "Lights on" force light mode is JS (D05 has already added "Follow device").

## Requests
- **D05 app-dive.js:** render chapter tables as `<div class="tw" tabindex="0" role="region" aria-label="Table: …">`. The scroll region is not keyboard-reachable today (t09-26).
- **D05 app-dive.js:** if number keys 1–4 are added to stain tests, tell the coordinator. index.html hides `.opt .key` outside `.reader.duel` (rule `.reader:not(.duel) .opt .key{display:none}`).
- **D04 app-practice.js (Hull weak map):** the inline `color-mix(var(--x) pct%, surface2)` reaches 90%. With `color:var(--fg)` in the dive, bio and micro cells fall to about 2.5:1. Cap pct at 45 in dark themes (dive: `Math.round(18+27*n/max)`), as D03 does for the coverage grid. Or emit `class="has d-<x>-bg" style="--lv:<0..1>"` and index.html will tint it.
- **D19 / D20 figs:** on phones, `.ft`, `.ft.sm` and `.ft.big` render at 15, 13 and 19 user units (CSS beats `font-size` attributes). Use those classes for all SVG text, and check your new labels for overlap at 375 px. Use `.ssv` for guide lines; it is now visible.
- **D02 sw.js:** fonts are now inline in index.html, so no font origin needs caching. Precache `index.html` / `./` as planned. `#sr-live` is present in the markup.
