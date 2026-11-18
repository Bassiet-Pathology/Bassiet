# Tests
Needs Node 18+ and Playwright with Chromium (`npm i -g playwright && npx playwright install chromium`), run with `NODE_PATH=$(npm root -g)`.
Each script loads `../app/index.html` (override with `APP_DIR`). Screenshots go to tests/out/.

Release gate (all must pass):
- `node tests/validate.js` — Atlas content (ids, links, no isolated concepts)
- `node tests/vbook.js` — chapters, questions, figures, tables
- `node tests/s7.js 16` — full descent: every chapter, test and duel to the final boss, no errors, no undefined/NaN
- `node tests/d02test.js` — storage contract against a slow/failing mock db (mock.js)
- `node tests/d05test.js` — dive systems (shuffle, duels, seals, story, ending, misses)
- `node tests/figall.js` — every figure renders and every button works
- `node tests/drivetest.js` — Drive folder resolution against a fake Drive
Extra: s8.js (re-stain, losing duel; its duel step predates the new Depth 1 metabolism stratum), s9.js (Atlas/Practice), figshot.js <ids> (renders figures to figs.png), final.js (phone/desktop screenshots).
