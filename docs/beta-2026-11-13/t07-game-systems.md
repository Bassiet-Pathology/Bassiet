# t07 — Game systems (app-dive.js + app-core.js storage)

Tester: t07 · Date: 13/11/2026 · Build: /home/claude/citron (read-only) · Scripts: `beta/work-t07/` · Shots: `beta/shots/t07-*.png`

## 1. Verdict — 5/10

The loop is well designed. You read, take the stain test, the seal breaks, you duel the boss, and stains fade and come back for re-stains. Most single-click guards work. But right now the gates do not test knowledge. Answer options are never shuffled, and **78% of all 355 answer keys are option 2**. A player who presses "2" every time **passes 67 of 71 stain tests and wins 111 of 160 duels (69%)**, and a lost duel costs nothing. Several state bugs also hurt trust:
- "Duel again" after a win opens a dead screen.
- When the timer runs out, the answer is never shown.
- A duel's timer keeps running while you look at another duel's page.
- A save that fails still shows "Stratum stained." and throws the answers away.
- On the db path, read-modify-write races wipe story state and drop answer counts.

## 2. What works well

- One answer per question holds. `A.qa` checks `a[i]!=null`, `A.dpick` checks `picked/timeout/over`, and `A.rsSave` checks `st.saved`. Two picks inside one tick, a double-click on Next and holding Enter all advance only once (t07-timer.js tests 4–5).
- The timer uses `Date.now()-qStart` rather than counting ticks, so throttling a background tab cannot buy extra time.
- The best score is kept (`A.qSave` keeps the higher of old and new). Losing a duel never clears `won`.
- The wounds debrief is good. It shows your pick, the answer and the explanation, with a link back to the stratum.
- Keyboard 1–4 and Enter work in duels, and "Too slow. Next" also accepts Enter.
- The day tally is anchored at `T12:00` local time, so the weekly table counts the right days across DST. Dates are dd/mm/yyyy everywhere in the game systems.
- The Yuzu export removes duplicates by question (`chapter-qN`). Card ids are stable (`bassiet-c1-membrane-q0`), and the busy guard blocks double sends while a send is running.
- The data is clean: 71 chapters, 5 questions each, 4 options each, every key index valid, every depth fully charted, every `sys` value in `CT.SYS`.

## 3. Findings

| ID | Sev | File | Where | Problem | Fix |
|---|---|---|---|---|---|
| t07-01 | Critical | book*.js + app-dive.js | all `Q[].a`; `qblock()` | Answer keys are 26 A / **276 B** / 51 C / 2 D, and options always render in authored order. Pressing "2" every time passes **67/71 stain tests** and wins **111/160 duels** (t07-always2.js). The correct option is also the longest one in 179/355 questions (50%; chance is 25%). Stains, seals and duels can all be passed without knowing anything. | Shuffle options once per load. One line after `var FADE` (code A1). No option refers to a position ("Both", "All of them", "Neither" read fine in any order). Also hand content owners a list to rebalance keys and lengthen distractors. |
| t07-02 | High | app-dive.js | `quiz()`, `A.qSave`, `poolFor()` | Each answer reveals the key and explanation straight away. A retake shows the **same 5 questions in the same order with the same options**, so after one failed try the 60% gate is decorative. The duel pool is the same 5 questions per stratum that were already seen. | Shuffle question order per attempt (`CT.ui.ord[id]`) and reshuffle options on retake (code A2). For the long term see Idea 1 (pool of 10–12 questions, draw 5). Store the picked option *text* in wounds so a reshuffle cannot break the debrief. |
| t07-03 | High | app-core.js | `CT.setDoc` → `.catch(fail)` | A failed write resolves the promise anyway. `A.qSave`'s `.then` then toasts **"Stratum stained."**, clears `CT.ui.ans[id]` and navigates away, and nothing is saved (t07-savefail.js: doc `null`, answers wiped). `A.rsSave` ("The stain holds.") and `endDuel` ("The seal … breaks.") behave the same way. This is data loss behind a success message. | Make `setDoc` and `delDoc` resolve to `true` or `false`, and have callers bail out on `false` (code A3). |
| t07-04 | High | app-dive.js | `duelView()`, `CT.render` hook | After a win, `CT.ui.duel` stays `{over:'win'}`. "Duel again" on the depth page then opens the old win screen, which only has "Return to the shaft". You cannot rematch until you reload (t07-duelagain.js, shot `t07-duel-again-stale.png`). | In the render hook, clear a finished duel once you leave its route: `var u=CT.ui.duel;if(u&&u.over&&s!=='duel-'+u.n)CT.ui.duel=null;`. Also add a "Duel again" `duelGo` button to the win panel. |
| t07-05 | High | app-dive.js | `duelView()` | When the timer runs out, the hull cracks, but `qblock` is called with `chosen=null`. The correct answer is never marked, no explanation appears, the options still look tappable, and the timer bar shows 100% (shot `t07-timeout-no-reveal.png`). The player loses a hull and learns nothing until the end. | `h+=qblock(q,u.i,u.timeout?-1:u.picked,'dpick','data-n="'+n+'"');`. A value of -1 disables the options, marks the answer ✓ and shows `q.x`. |
| t07-06 | Medium | app-dive.js | `CT.render` hook → `tickDuel()` | `tickDuel` runs on **any** `#duel-N` route against `CT.ui.duel`, whichever depth that duel belongs to. With depth 2's duel live, opening the depth 1 "Duel again" intro let depth 2's timer run out in the background. Hull went 1→0, a miss was logged, a loss was saved to `boss-2` and the radio fired (t07-timer.js test 3). | `if(/^duel-/.test(s)&&CT.ui.duel&&CT.ui.duel.n===+s.slice(5))tickDuel();else clearInterval(duelT);`. Also guard inside `tickDuel`. |
| t07-07 | Medium | app-dive.js | `CT.render` hook, `tickDuel` | Leaving mid-question (back button, Radio log, Host file, Dive tab) keeps the clock running. Coming back after more than 40 s cracks the hull at once, before the question is even seen (test 2: hull 2→1 on return). | Count it as a miss when you leave, so the answer is waiting on return. Add a line under the timer: "Leaving counts this question as missed." (code A4). Do not pause the timer: pausing lets you step out to read the chapter. |
| t07-08 | Medium | app-dive.js | `startDuel()`, `hit()` | Balance is too short and too lenient. Perfect play ends after **5 of 12** questions (about 6 on average), so a boss checks under a third of a depth's 20–25 questions. A 60%-accurate player wins 36% of tries, 70% wins 59%, and retries are free and instant. Monte Carlo is in t07-balance.js. | Tune to hp = round(0.85×12) = 10, hull 4, crit at 5 in a row; final duel hp = round(0.7×24) = 17, hull 5. Win rates then become 60%→20%, 70%→43%, 80%→72%, 90%→95%, with about 9 questions per duel (t07-balance2.js, code A5). Update the intro text to "five in a row strike twice". |
| t07-09 | Medium | app-core.js | `CT.setDoc` (db branch), `saveStory`, `CT.bumpDay` | On the db path, `CT.data` changes only when a snapshot arrives. Every read-modify-write in between works on stale data. With a fake db at realistic latency (t07-dbrace.js), the story doc took 4 writes on first load: write 2 **wiped `seenAt` to {}** and write 3 **reset `lastVisit` to 0**. Five quick answers raised `days.q` by 1 instead of 5. `story()` also hands back the cached `seenAt` object, which `flush` then mutates in place. | Update `CT.data` optimistically before queuing the write, in both setDoc and delDoc (code A6). In `story()` return copies: `seenAt:Object.assign({},s.seenAt)`, `entered:(s.entered||[]).slice()`. |
| t07-10 | Medium | app-dive.js | `A.qSave` | Tapping "Stain this stratum" 3 times produced 3 writes, 3 toasts and 3 `CT.go` calls (db mode), and `tries` was undercounted (all three wrote `tries:1`). | `if(CT.ui.saving===id)return;CT.ui.saving=id;` at the top, `CT.ui.saving=null` in both outcomes, and render the button `disabled` while saving. |
| t07-11 | Medium | index.html + app-dive.js | `#radio` CSS, `A.qa` | Every wrong stain-test answer pops a fixed radio line (z-index 45, 6.5 s) right where the next question's options sit on a 390-px phone. It covered "3. SGLT2" in shot `t07-radio-covers-options.png`. It has no tap-to-dismiss and also stacks on top of the toast (shot `t07-duel-lose.png`). Five misses means five scolds. | `#radio{pointer-events:none}`, and on reading routes move it to the top: `:root[data-reading="1"] #radio{bottom:auto;top:calc(env(safe-area-inset-top,0px) + 64px)}`. Radio only on the first miss per test (code A7). Hide the toast while the radio is visible. |
| t07-12 | Medium | app-dive.js | `restain()`, `A.rsSave` | `#restain-<id>` has no guard. (a) On day 1 it shows 3 questions from sealed depth 16 (shot `t07-restain-sealed-depth.png`). (b) A stratum that is not fading can be farmed: 6 re-stains in one minute took it from lvl 0 to **lvl 5, due in 180 days** (t07-restain.js A). | `restain()`: `if(!isOpen(d))return depthPage(d.n);if(!chStained(id))return chapter(id);`. `rsSave`: only move `lvl` and `due` when `fading(id)` is true. Otherwise toast "Practice only, the schedule is unchanged." (code A8). |
| t07-13 | Medium | app-dive.js | `A.rsSave` fail branch | A failed re-stain resets to lvl 0 and comes back in **7 days**, which is too long for a lapse (spaced repetition wants about 1 day). The text says "The stain faded", yet the stratum stays fully stained. | `else{doc.lvl=Math.max(0,(doc.lvl\|\|0)-2);doc.due=now+DAY}`. Change the text to "The stain is thinning. Back tomorrow; reading the chapter helps." |
| t07-14 | Medium | app-dive.js | `A.qSave` | Re-reading a fading stratum and passing the full 5-question test does not refresh it: `due` stays in the past and it still says "Fading" (t07-restain.js D). The home weak-point button even suggests "Re-read and retest". | After the `!was` branch add: `else if(right/n>=.6&&fading(id)){doc.due=Date.now()+FADE[Math.min(doc.lvl\|\|0,FADE.length-1)]*DAY;doc.rechecked=Date.now()}`. |
| t07-15 | Medium | app-dive.js | `fired()`, `A.qSave` | A failed test (0/5) is saved as `done:true`, so `fired('ch:<id>')` is true. Transmissions and Host-file lines keyed to that chapter unlock without staining it (2 beats for c1-unmaking, test F). | In `fired()`: `if((m=/^ch:(.+)$/.exec(at)))return chStained(m[1]);` |
| t07-16 | Medium | app-dive.js | `weakPoints()` | Misses from 30 days count even after the stratum has since been aced, and an unstained stratum that blocks the seal gets no extra weight. Test: Membrane at 5/5 with 3 old misses ranks **#1**, while Nucleus, which "did not take" at 40% and blocks the seal, ranks **#3** (t07-divelog.js test 5). | Skip misses older than a later perfect attempt, and add +4 for "did not take — blocks the seal" (code A9). Count `tries>2` only when the stratum is not stained (t07-38). |
| t07-17 | Medium | app-dive.js | `weekStats()` | Accuracy uses only test and duel answers (`q`). A week of Practice only (Trace, Predict, Compare) has `acc=0`, so even **7/7 days grades D**: "You came down, but not often." (test 2). | `var acc=q?r/q:null;` and test accuracy only when `acc!=null` (code A10). Show Practice items in the Answers column (`n+q`). |
| t07-18 | Medium | app-dive.js | `diveLog()` | A brand-new user sees last week graded **F** with "Nothing this week. The Host lay still and the Pall spread. Come back." on their first day, scolded for a week before they installed (shot `t07-divelog-newuser.png`). | If there is no `days` or `reads` activity before `weekStart(now)`, show "—" for last week and a first-week note, e.g. "First week on the line. Come down on five days and I will mark it on Monday." (code A10). |
| t07-19 | Medium | app-dive.js | `A.toYuzu` folder lookup | It searches for **any** folder named `collection` anywhere in Drive, then takes the first `inbox` whose parent is any of them. With another app's `collection/inbox` listed first, the pack went to `INBOX_OTHER` (t07-yuzu.js). `pageSize:20` can also miss the right one. | Resolve the full path: `Yuzu` folder → `collection` with that parentId → `inbox` with that parentId (code A11). Show the resolved path in the success message. |
| t07-20 | Medium | app-dive.js | `A.toYuzu` | Sending twice in one week creates 2 files with the **same pack id** and every card again. Nothing records what was already sent. | Store `reads/yuzu-sent` `{sent:{cardId:at}}` after a successful create, and send only misses newer than `sent[id]`. Say "3 new, 5 already in Yuzu" (code A11). |
| t07-21 | Medium | app-dive.js | `logMiss()` | Every miss gets the chapter's **first** concept. A digoxin question, a pemphigus question and a fat-necrosis duel question were all logged as "Cell adaptations" (t07-hull.js). Hull then shows the wrong title, "Make a note" opens the wrong concept, and Today's `suggest()` boosts the wrong concept. | Log `concept:q.c\|\|''`, never the chapter's `c[0]`. Put the question stem in `source` (code A12). Content: add `c:'<concept id>'` per question. |
| t07-22 | Medium | app-dive.js / app-practice.js / app-today.js | `logMiss()` → Hull weak map, Today `slipping()` | Dive misses have `discipline:''`, and both views skip rows without a discipline. After 3 dive misses the Hull weak map had **0 filled cells** and "Where you are slipping" stayed empty (t07-hull.js, shot `t07-hull-auto-misses.png`). Most of the user's misses will come from the dive, so these two views stay blank. | Add `d:'path'\|'micro'\|…` per question (or per stratum in depths.js) and log `discipline:q.d\|\|st.d\|\|''` (code A12). |
| t07-23 | Medium | app-core.js | `CT.statusJSON()` | The status sent to Citrus counts only Practice items. Fading stains waiting for a re-stain and a boss that is ready are invisible to Citrus planning. | `var fd=CT.dive&&CT.dive.fadingCount?CT.dive.fadingCount():0;`. Add it to `due`, `summary` ("4 stains fading") and `asks`. In app-dive: `CT.dive.fadingCount=function(){return allFading().length}`. |
| t07-24 | Low | app-dive.js | `A.toYuzu`, home copy | The copy says "this week's missed …" and the pack is named "week of 16/11/2026", but it uses a rolling 7 days, so a Monday send includes Friday 13/11's misses. | Either `cut=weekStart(Date.now())` or say "last 7 days" in both the copy and `pack.name`. |
| t07-25 | Low | app-dive.js | `A.toYuzu` card `back` | The back reads "Hypokalaemia …" without the letter, while the front lists A–D. | `back:String.fromCharCode(65+q.a)+'. '+q.o[q.a]+'\n\n'+q.x`. Add tags `system::<sys>` and `depth::<n>`. |
| t07-26 | Low | app-dive.js | `weekStart()`, `weekStats()`, `diveLog()` | Weeks are built by subtracting fixed 24-h days. In a DST zone (New York, 11/03/2026) last week's label reads **"from 01/03/2026"** instead of 02/03/2026, and `firstAt` near midnight can land in the wrong week. No effect in Asia/Riyadh. | Use calendar arithmetic (code A13). |
| t07-27 | Low | app-dive.js | `weekStart()` | Weeks are fixed to start Monday. A Saudi work week runs Sunday–Thursday, so one rota week is split across two dive-log rows. | Add a "Week starts" Sun/Mon toggle in the Look panel (localStorage) and make `weekStart` honour it. |
| t07-28 | Low | app-dive.js | `GRADE.A`, `diveLog()` | Grade A text hardcodes "pulled back from three sites" whatever was stained. Only last week is graded; this week shows "…". | Use `w.st`: "The Pall pulled back from "+w.st+" sites". See Idea 5 for a projected grade. |
| t07-29 | Low | app-dive.js | `hit()` → `logMiss` | A timeout is logged with reason "Did not know it", which skews Hull's "Why you miss". | `logMiss(cur.id,cur.i,'Duel',j==null?'Ran out of time':null)` (code A12). Add "Ran out of time" to `REASONS` in app-practice.js. |
| t07-30 | Low | app-dive.js | `duelView()` timer markup | The bar is rendered at 100% on every re-render (after an answer, after a timeout, on each db snapshot) until the next 200 ms tick. After answering it stays at 100%. There are no seconds and no `role="timer"`. | Render the width from `qStart` in the markup and add seconds plus an aria label (code A14). |
| t07-31 | Low | app-dive.js | `duelView()` combo cue | "CRITICAL" appears only after the first double strike. At combo 2 the next right answer already strikes twice, with no cue. | Show "NEXT HIT STRIKES TWICE" when `u.combo>=CRIT-1`. Keep "CRITICAL" on the strike itself (flash the HP bar). |
| t07-32 | Low | app-dive.js | `A.dnext` → `endDuel` | Running out of questions with hull left ends as `'lose'` with "The hull gives way", which is false. It cannot happen with today's pools (20–25 questions) but can with tuning or a short depth. | `endDuel(u.hp<=0?'win':'out')`. In `duelView`: `u.over==='out'` → "It outlasted you. The hull holds, but the avatar still stands." |
| t07-33 | Low | app-dive.js | keydown handler (line 384) | On `#ch-` and `#restain-`, keys 1–5 are swallowed (`stopImmediatePropagation`) but do nothing. No keyboard answering, and tab switching is blocked as well (t07-timer.js test 6). | Add keyboard answering for tests (code A15) and update the Today keys hint. |
| t07-34 | Low | app-dive.js / story.js | `endDuel` → `pick('miss')` | A lost duel plays a stain-test line ("That stain did not take. Look closer.") over the wounds. | Add `at:'duel-lose'` lines in story.js and use `pick('duel-lose')\|\|pick('miss')`. |
| t07-35 | Low | app-dive.js | `startDuel`, reload | Reloading mid-duel erases the attempt (no `tries`, no loss) but keeps the misses (t07-reload.js). Harmless today because `boss.tries` is never read, but it will matter if stats or cooldowns are added. | Write `{tries+1,lastAt}` in `startDuel`. Keep `endDuel` for the result. |
| t07-36 | Low | app-dive.js | `fading()` | A stained doc without `due` (made before fading existed, or by a failed write) never fades. Test E: stained 400 days ago, still "Stained · 80%". | `var due=r.due\|\|((r.firstAt\|\|r.at\|\|0)+FADE[0]*DAY);return !!(r&&chStained(id)&&due<=Date.now())`. |
| t07-37 | Low | app-dive.js | `logMiss`, wounds, `A.toYuzu` | Misses store only the question index `q`. Reordering a chapter's questions later silently re-points old misses, Hull entries and future Yuzu cards to the wrong question. | Also store `qh` (a short hash of `q.q`), and look up by `qh` first. |
| t07-38 | Low | app-dive.js | `weakPoints()` | `tries>2` adds weight even when the extra tries were voluntary retakes after mastery. | `if(r&&r.tries>2&&!chStained(id))`. |
| t07-39 | Low | app-dive.js | `duelView()` header | Each duel question names its source stratum ("1 / 12 · The Stuttering Doors"), which hints at the topic before reading. | Show the stratum only after answering, next to the explanation. |
| t07-40 | Low | index.html | head | **Local file only:** there is no `<meta charset>`, so `file://` shows mojibake (■ □ ✓ · − K⁺ show as `â–`, `Â·`, `Kâº`). Check that the published wrapper adds `charset=utf-8`. | Add `<meta charset="utf-8">` as the first head element. It costs nothing. |
| t07-41 | Low | app-dive.js | `duelView()` over branch | On a win, the deciding question's explanation is never shown, because the result panel replaces it. | When `u.over` and `u.picked!=null`, render the last `qblock` above the result panel. |
| t07-42 | Low | app-dive.js | `home()` fading panel | Fading buttons show the stratum name only (no depth), and only the first 6 of N. | Label as "−08 The Nave". Add an "All N" button that opens the Re-stain run (Idea 3). |
| t07-43 | Idea | app-dive.js | `endDuel`, win panel | The win screen is bare: "Return to the shaft" plus a toast that repeats the panel text. There is no accuracy, time (`t0` is stored but never used), best combo, hull left or "new best", and no "Descend to −04" button. | Add a stats strip (right/asked, time, best combo, hull) and `bestHull`/`bestTime` badges. Make the primary button go to `depth-(n+1)`. Drop the duplicate toast. |
| t07-44 | Idea | app-dive.js | `A.qSave` first interval | The first fade is always 7 days, whether the score was 60% or 100%. | First due = 3 days at 60%, 5 days at 80%, 7 days at 100%. |
| t07-45 | Idea | app-dive.js | fading | Fading has no stakes. The seal never re-forms and the shaft looks the same, so ignoring re-stains costs nothing. | See Idea 3. |

**Counts:** Critical 1 · High 4 · Medium 18 · Low 19 · Idea 3 (45 total).

### Code appendix (exact changes)

**A1 (t07-01)** — app-dive.js, after `var FADE=[7,14,30,60,120];`:
```js
/* shuffle options once per load so the key is not always "2"; q.a follows the option */
Object.keys(BK).forEach(function(id){BK[id].Q.forEach(function(q){
  var p=CT.shuffle(q.o.map(function(_,i){return i}));q.o=p.map(function(i){return q.o[i]});q.a=p.indexOf(q.a)})});
```

**A2 (t07-02)** — app-dive.js:
```js
CT.ui.ord={};
function reshuffle(id){BK[id].Q.forEach(function(q){var p=CT.shuffle(q.o.map(function(_,i){return i}));q.o=p.map(function(i){return q.o[i]});q.a=p.indexOf(q.a)});delete CT.ui.ord[id]}
// quiz(): iterate in per-attempt order
var ord=CT.ui.ord[id]||(CT.ui.ord[id]=CT.shuffle(c.Q.map(function(q,i){return i})));
ord.forEach(function(qi,k){h+=qblock(c.Q[qi],qi,a[qi],'qa','data-ch="'+id+'"').replace('<span class="mono">'+(qi+1)+'.</span>','<span class="mono">'+(k+1)+'.</span>')});
// A.qSave .then: after CT.ui.ans[id]={}; add
reshuffle(id);
// hit(): keep the picked text so later reshuffles cannot break the debrief
u.wounds.push({id:cur.id,i:cur.i,j:j,pick:j==null?null:BK[cur.id].Q[cur.i].o[j]});
// duelView wounds: (w.pick==null?'(no answer)':esc(w.pick))
```

**A3 (t07-03)** — app-core.js:
```js
CT.setDoc=function(coll,id,obj){
  /* optimistic local row (A6) */
  var a=CT.data[coll],i=a.findIndex(function(x){return x.id===id}),row=Object.assign({id:id},obj);if(i>=0)a[i]=row;else a.push(row);rebuild();
  if(!CT.db){CT.render();return Promise.resolve(true)}
  return enqueue(coll+'/'+id,function(){return CT.db.collection(coll).doc(id).set(obj)}).then(function(){return true},function(e){fail(e);return false});
};
// same pattern for CT.delDoc (filter locally first, resolve true/false)
```
app-dive.js `A.qSave`: `CT.setDoc('reads',id,doc).then(function(ok){CT.ui.saving=null;if(ok===false){CT.render();return}CT.ui.ans[id]={}; …existing…})`.
`A.rsSave`: `.then(function(ok){if(ok===false){st.saved=false;st.done=false;CT.render();return} …})`.
`endDuel`: `.then(function(ok){if(ok===false){u.saved=false;return}if(res==='win'&&!was)CT.toast(…)})`.
Once local rows are updated optimistically, a snapshot that arrives later still replaces them with server truth, so nothing else changes.

**A4 (t07-07)** — app-dive.js render hook, before `baseRender()`:
```js
var s0=CT.view==='today'&&CT.dsub||'',u0=CT.ui.duel;
if(u0&&!u0.over&&u0.qStart&&u0.picked==null&&!u0.timeout&&s0!=='duel-'+u0.n){u0.timeout=true;clearInterval(duelT);hit(false,null);return}
```
(`hit` calls `CT.render()` again with `timeout` set, so this cannot loop.)

**A5 (t07-08)** — app-dive.js:
```js
var CRIT=5;
function startDuel(n){var qs=poolFor(n),fin=n===DP.length,hp=Math.max(4,Math.round(qs.length*(fin?.7:.85)));
  CT.ui.duel={n:n,qs:qs,i:0,hull:fin?5:4,hp:hp,max:hp,combo:0,picked:null,wounds:[],t0:Date.now(),over:null,saved:false,crit:false}}
// hit(): u.crit=u.combo>=CRIT;   duelView hull: (n===DP.length?5:4)
// intro: 'five in a row strike twice'
```
Optional loss cooldown: in `endDuel` lose, set `doc.lostAt=Date.now()`. In `duelView` intro, if `Date.now()-lostAt<15*60000` and no wound stratum was re-stained since, show "Recharge the hull: re-stain a wounded stratum first" with the wound strata as buttons.

**A6 (t07-09)** — the optimistic update in A3, plus app-dive.js `story()`:
```js
function story(){var s=rd('story')||{};return {seenAt:Object.assign({},s.seenAt),entered:(s.entered||[]).slice(),lastVisit:s.lastVisit||0}}
```

**A7 (t07-11)** — app-dive.js `A.qa`: `CT.ui.rmiss=CT.ui.rmiss||{};if(!ok){if(!CT.ui.rmiss[id]){CT.ui.rmiss[id]=1;CT.radio(pick('miss'))}logMiss(id,i,'Stain test');SND.bad()}`. Clear `CT.ui.rmiss[id]` in `A.qSave`. In `CT.radio`: `var t=document.getElementById('toast');if(t)t.hidden=true;`. CSS as in the table.

**A8 (t07-12)** — app-dive.js:
```js
function restain(id){var c=BK[id];if(!c)return '<div class="empty">Unknown stratum.</div>';
  var d=depthOf(id);if(!isOpen(d))return depthPage(d.n);if(!chStained(id))return chapter(id); …
// A.rsSave:
var due=fading(id);
if(!due){doc.rechecked=now}                          // early practice: schedule untouched
else if(right>=2){doc.lvl=Math.min(FADE.length,(doc.lvl||0)+1);doc.due=now+(doc.lvl>=FADE.length?180:FADE[doc.lvl])*DAY}
else{doc.lvl=Math.max(0,(doc.lvl||0)-2);doc.due=now+DAY}   // t07-13
```

**A9 (t07-16)** — `weakPoints()`:
```js
CT.data.misses.forEach(function(m){if(m.at<cut||!m.chapter)return;var r=rd(m.chapter);
  if(r&&r.total&&r.last===r.total&&r.at>m.at)return;   // aced since
  miss[m.chapter]=(miss[m.chapter]||0)+1});
// inside the per-stratum loop, first:
if(r&&r.done&&!chStained(id)){sc+=4;why.push('did not take · blocks the seal')}
```

**A10 (t07-17/18)** — `weekStats()` and `diveLog()`:
```js
var acc=q?r/q:null,ok=function(x){return acc==null||acc>=x};
var g=days>=5&&ok(.8)?'A':days>=4&&ok(.7)?'B':days>=3&&ok(.6)?'C':days>=1?'D':'F';
return {from:from,days:days,n:n,q:q,acc:acc||0,st:st,g:g};
// diveLog():
var ws=weekStart(Date.now()),firstDay=CT.data.days.map(function(x){return new Date(x.id+'T12:00:00').getTime()}).sort()[0];
var fresh=!firstDay||firstDay>=ws;   // nothing before this week
// prev row grade: fresh?'—':w.g ; note: fresh?'First week on the line. Come down on five days and I will mark it on Monday.':GRADE[prev.g]
```

**A11 (t07-19/20)** — `A.toYuzu`:
```js
async function folders(q){var r=await CT.mcp.callTool(S,'search_files',{query:q+" and mimeType = 'application/vnd.google-apps.folder' and trashed = false",excludeContentSnippets:true,pageSize:50},{cache:false});return (r.payload&&r.payload.files)||[]}
var yz=(await folders("title = 'Yuzu'")).map(function(f){return f.id});
var col=(await folders("title = 'collection'")).filter(function(f){return yz.indexOf(f.parentId)>=0}).map(function(f){return f.id});
var box=(await folders("title = 'inbox'")).filter(function(f){return col.indexOf(f.parentId)>=0})[0];
// before building cards:
var sent=(rd('yuzu-sent')||{}).sent||{};   // skip a miss when sent[cardId]>=m.at
// after create_file:
cards.forEach(function(c){sent[c.id]=Date.now()});CT.setDoc('reads','yuzu-sent',{sent:sent});
```
(Exclude `yuzu-sent` from `weekStats`'s `reads` loop the same way `story` is excluded.)

**A12 (t07-21/22/29)** — `logMiss()` and `hit()`:
```js
function logMiss(id,qi,src,why){var c=BK[id],q=c.Q[qi]||{},d=DP[c.depth-1],st=d.strata.find(function(s){return cid(d,s)===id})||{};
  CT.setDoc('misses',CT.newId(),{concept:q.c||'',discipline:q.d||st.d||'',system:d.sys,
    source:src+': '+c.title+' / Q'+(qi+1)+' · '+String(q.q||'').slice(0,90),chapter:id,q:qi,
    reason:why||'Did not know it',note:'',at:Date.now(),auto:true})}
// hit(): logMiss(cur.id,cur.i,'Duel',j==null?'Ran out of time':null)
```
Content: add `d:'path'` (etc.) to each depths.js stratum, or `d`/`c` to each `Q`.

**A13 (t07-26)**:
```js
function weekStart(t){var d=new Date(t);d.setHours(0,0,0,0);d.setDate(d.getDate()-(d.getDay()+6)%7);return d.getTime()}
function addDays(t,n){var d=new Date(t);d.setDate(d.getDate()+n);return d.getTime()}
// weekStats: var to=addDays(from,7)   diveLog: prev=weekStats(addDays(weekStart(Date.now()),-7))
```

**A14 (t07-30)** — `duelView()`:
```js
var left=u.qStart?Math.max(0,QT-(Date.now()-u.qStart)/1000):QT,w=(u.picked!=null||u.timeout)?0:left/QT*100;
h+='<div class="timer'+(left<10?' low':'')+'" id="duel-timer" role="timer" aria-label="'+Math.ceil(left)+' seconds left"><i style="width:'+w+'%"></i></div>';
// tickDuel: el.parentNode.setAttribute('aria-label',Math.ceil(Math.max(0,left))+' seconds left') every 1 s
```

**A15 (t07-33)** — keydown handler, after the duel branch:
```js
if(/^(ch-|restain-)/.test(s)&&'1234'.indexOf(e.key)>=0&&e.key.length===1){
  var act=s.indexOf('ch-')===0?'qa':'rsa',blk=[].find.call(document.querySelectorAll('.q'),function(q){return q.querySelector('[data-act="'+act+'"]:not([disabled])')});
  if(blk){var b=blk.querySelectorAll('[data-act="'+act+'"]')[+e.key-1];if(b){e.preventDefault();b.click();blk.scrollIntoView({block:'center'})}}}
```

## 4. Top 5 improvement ideas

1. **A question engine instead of a fixed five.** Give each stratum 10–12 original questions. Draw 5 per attempt with options shuffled. Duels prefer questions the player has not answered yet, then ones missed before. This is the only lasting fix for t07-01/02, and it makes "stained" mean "knows it" rather than "saw these five".
2. **Duels as real fights.** Use the A5 tuning (about 9 questions, hp 10, hull 4, crit at 5). After a loss the hull recharges only after re-staining one wounded stratum, which ties losing to learning instead of to instant retries. Add a phase change at half HP: the boss draws from the player's weakest stratum (weak-point score). The win screen shows stats, new-best badges and a "Descend to −0N" button (t07-43).
3. **Fading with stakes, plus a Re-stain Run.** A fading stratum dims its row and depth icon in the shaft, and Pall pixels creep over it. When half a depth fades, the depth shows a cosmetic "the seal is cracking" and Hale calls. Fold all due strata into one "Re-stain run" of 1 question each, in a single session. First intervals depend on the score (t07-44), and a failed re-stain comes back after 1 day (t07-13).
4. **Per-question metadata (concept, subject).** One content pass of `c` and `d` on each question lights up the Hull weak map, Today's "Where you are slipping", "Make a note" links and Yuzu tags (`subject::Pharm`, `system::Renal`) from dive misses. Today those are almost empty for a dive-first user (t07-21/22).
5. **Dive log 2.0.** Add a live "on track for B — 2 more days at ≥70%" for the current week, a Sun/Mon week-start setting, Practice counted towards days and accuracy (t07-17), and a descent meter (strata stained 23/71 · seals 4/16 · stains held). Add a streak of weeks at B or better, and give Hale's grade line real numbers ("The Pall pulled back from 6 sites").

## 5. SPOILER-SENSITIVE

None. My findings touch story beats only in t07-15 (a failed test unlocks `ch:` transmissions and Host-file lines). That is about gating, not about the twist, and I did not read the transmission text beyond the generic "miss" lines.

---
**Reproduction scripts** (`/tmp/claude-0/-home-claude/c80d3a2e-1d1d-5dac-83ee-172c002ca966/scratchpad/beta/work-t07/`): `audit.js` (data and answer-key distribution), `t07-always2.js` (press-2 exploit), `t07-balance.js`/`t07-balance2.js` (Monte Carlo), `t07-timer.js` (timeout, back button, cross-duel leak, double taps, keys), `t07-duelagain.js`, `t07-radio-cover.js`, `t07-dbrace.js` + `fakedb.js` (latency-faithful db fake), `t07-savefail.js`, `t07-restain.js`, `t07-divelog.js`, `t07-dst.js`, `t07-yuzu.js` (mock Drive), `t07-hull.js`, `t07-reload.js`, `t07-visual.js`, `t07-optscan.js`.
