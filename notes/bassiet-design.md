# Bassiet design (7 Nov 2026)

The look of Bassiet (the Step 1 basics app) is saved as a Design System artifact called "Bassiet Design System": https://claude.ai/artifact/6Pm9rGdjcUbsmxPWLaWbEY

## Brief
- Signature orange accent stays: light `#F28A1B`, dark `#FFA040`. Orange text uses `#A24B00` (light) and `#FFB566` (dark).
- Neutrals: bg `#F3F4F9` / `#12141F`, surface `#FFFFFF` / `#1B1E2D`, line `#C6CCDC` / `#383E57`, text `#15182A` / `#ECEEF7`, muted `#566079` / `#9CA3BE`.
- Fonts: Pixelify Sans for titles, big numbers and the question; Source Sans 3 for body; JetBrains Mono for small uppercase labels, counts and dates (inlined as subset WOFF in index.html since v15).
- Shape: 4px radius everywhere, 2px borders, a hard `0 2px 0` shadow in the line colour, no blur, no gradients. Never pills.
- Five subject hues: path violet `#6A45D1`, micro green `#1F8A4C`, pharm blue `#1F6FD6`, bio teal `#0E8C93`, phys rose `#D43F63` (dark: `#9C84FF`, `#4FCB86`, `#5FA1FF`, `#3BC9D0`, `#FF6F91`).
- Phone: bottom tab bar, 44px targets, 16px side gutters with safe-area insets. Desktop: wider page, top bar, master-detail panes, keyboard shortcuts.
- Dates dd/mm/yyyy. Colour is never the only signal for right or wrong. Hold-to-explain is a shortcut only.
- The dive world (default) overrides these tokens with a near-black, amber-lamp palette: `:root[data-world="dive"]` in index.html.
