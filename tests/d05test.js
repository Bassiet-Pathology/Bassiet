const __APP=process.env.APP_DIR||require('path').resolve(__dirname,'../app');
// D05 checks: shuffle, transmissions, depth intro, radio queue, duel fixes, restain guard, dive log, weak points, Yuzu, seal rule, ending, keyboard.
const {chromium}=require('playwright');
const ROOT=process.argv[2]||__APP;
const U='file://'+ROOT+'/index.html';
const SH=__dirname+'/out/beta/shots/';
let fails=0;function ok(c,m){console.log((c?'PASS ':'FAIL ')+m);if(!c)fails++}
async function open(b,opts={}){const ctx=await b.newContext({viewport:opts.vp||{width:390,height:844},timezoneId:opts.tz||'Asia/Riyadh'});const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
 if(opts.clock)await p.clock.install({time:opts.clock});
 await p.goto(U+(opts.hash||''));await p.waitForTimeout(400);return {p,errs,ctx}}
async function seedTo(p,n){await p.evaluate((n)=>{DEPTHS.forEach(d=>{if(d.n>n)return;d.strata.forEach(s=>{const id=s.ch||('c'+d.n+'-'+s.id);CT.setDoc('reads',id,{done:true,right:5,total:5,last:5,at:Date.now(),firstAt:Date.now()-30*864e5,lvl:3,due:Date.now()+60*864e5,tries:1})});if(d.n<n)CT.setDoc('reads','boss-'+d.n,{won:true,at:Date.now(),tries:1})})},n);await p.waitForTimeout(150)}
const go=async(p,h)=>{await p.evaluate(h=>{location.hash=h},h);await p.waitForTimeout(150)};
(async()=>{const b=await chromium.launch();
// 1. transmissions on first open stay and play in sequence
{const {p,errs}=await open(b);
 const n0=await p.locator('.txs .tx:not([hidden])').count();
 await p.waitForTimeout(5200);
 const n1=await p.locator('.txs .tx:not([hidden])').count(),tot=await p.locator('.txs .tx').count();
 ok(n0>=1&&n1===tot&&tot>=4,'prologue lines play in sequence and all stay ('+n0+'→'+n1+' of '+tot+')');
 await p.screenshot({path:SH+'d05-home-first.png'});
 const go1=await p.locator('.btn.primary').first().innerText();ok(/Begin the descent/.test(go1),'new-user button: '+go1);
 ok(await p.locator('.loop').count()===1,'core loop explained for a new user');
 ok(!/Grade F|\bF\b<\/b>/.test(await p.innerHTML('.dlog'))&&/first week/i.test(await p.innerText('.dlog')),'no F for a brand-new user');
 await p.click('.btn.primary');await p.waitForTimeout(200);
 ok(/depth-1/.test(await p.evaluate(()=>location.hash)),'Begin goes to the depth page first');
 ok(await p.locator('.txs.brief .tx').count()>=1,'depth briefing shown inline');
 ok(/Start here/.test(await p.innerText('.strata')),'first stratum marked Start here');
 await go(p,'today');const seen=await p.evaluate(()=>Object.keys((CT.data.reads.find(r=>r.id==='story')||{}).seenAt||{}));
 ok(['p1','p2','p3','p4'].every(x=>seen.includes(x)),'prologue marked seen');
 ok(errs.length===0,'no page errors (1) '+errs.join('|'));}
// 2. shuffle: stable within view, scoring by original index, answer position spread
{const {p,errs}=await open(b,{hash:'#ch-c1-membrane'});
 const before=await p.evaluate(()=>[...document.querySelectorAll('.quiz .q')].map(q=>[...q.querySelectorAll('[data-act=qa]')].map(x=>x.dataset.j).join('')));
 await p.evaluate(()=>CT.render());
 const after=await p.evaluate(()=>[...document.querySelectorAll('.quiz .q')].map(q=>[...q.querySelectorAll('[data-act=qa]')].map(x=>x.dataset.j).join('')));
 ok(JSON.stringify(before)===JSON.stringify(after),'order stable across re-render');
 // press "2" on every question by display position
 const pos=await p.evaluate(()=>{var out={};Object.keys(BOOK).forEach(id=>{var c=0,t=0;BOOK[id].Q.forEach((q,i)=>{var o=q.o.map((_,j)=>j);var pm=CT.shuffle(o);t++;if(pm[1]===q.a)c++});out[id]=c/t});var v=Object.values(out);return v.filter(x=>x>=.6).length+'/'+v.length});
 console.log('   simulated always-2 pass rate with shuffle: '+pos);
 await p.locator('.quiz .q').first().scrollIntoViewIfNeeded();
 await p.keyboard.press('2');await p.waitForTimeout(100);
 ok(await p.evaluate(()=>Object.keys(CT.ui.ans['c1-membrane']||{}).length)===1,'key 2 answers the first visible question');
 // answer the rest correctly by original index
 const Q=await p.evaluate(()=>BOOK['c1-membrane'].Q.map(q=>q.a));
 for(let i=0;i<Q.length;i++){const has=await p.evaluate(i=>CT.ui.ans['c1-membrane'][i]!=null,i);if(!has)await p.click(`[data-act="qa"][data-i="${i}"][data-j="${Q[i]}"]`)}
 await p.waitForTimeout(150);
 ok(await p.evaluate(()=>!!(CT.data.reads.find(r=>r.id==='c1-membrane')||{}).done),'finished test auto-saved before tapping the button');
 const radioDuring=await p.evaluate(()=>!document.getElementById('radio').hidden);
 await p.screenshot({path:SH+'d05-test-done.png'});
 await p.click('[data-act="qSave"]');await p.waitForTimeout(200);
 ok(/depth-1/.test(await p.evaluate(()=>location.hash)),'pass navigates to depth');
 const r=await p.evaluate(()=>CT.data.reads.find(r=>r.id==='c1-membrane'));ok(r.tries===1,'tries counted once ('+r.tries+')');
 ok(errs.length===0,'no page errors (2) '+errs.join('|'));}
// 3. radio queued during test, one line per test, dismiss
{const {p,errs}=await open(b,{hash:'#ch-c1-furnace'});
 await p.waitForTimeout(200);await p.evaluate(()=>document.querySelector('.quiz').scrollIntoView());
 const Q=await p.evaluate(()=>BOOK['c1-furnace'].Q.map(q=>q.a));
 await p.click(`[data-act="qa"][data-i="0"][data-j="${(Q[0]+1)%4}"]`);await p.click(`[data-act="qa"][data-i="1"][data-j="${(Q[1]+1)%4}"]`);await p.waitForTimeout(1500);
 ok(await p.evaluate(()=>document.getElementById('radio').hidden),'no radio while the test is on screen');
 for(let i=2;i<Q.length;i++)await p.click(`[data-act="qa"][data-i="${i}"][data-j="${Q[i]}"]`);
 await p.waitForTimeout(1800);
 ok(await p.evaluate(()=>!document.getElementById('radio').hidden),'queued radio plays after the test');
 await p.screenshot({path:SH+'d05-radio-after.png'});
 await p.click('#radio .rclose',{force:true});await p.waitForTimeout(100);
 ok(await p.evaluate(()=>document.getElementById('radio').hidden),'radio dismissed by close');
 ok(errs.length===0,'no page errors (3) '+errs.join('|'));}
// 4. duel: timeout reveal, cross-duel, rematch, balance, withdraw
{const {p,errs}=await open(b);await seedTo(p,2);
 await p.evaluate(()=>{CT.look.timer='40'});
 await go(p,'duel-2');await p.click('[data-act="duelGo"]');await p.waitForTimeout(100);
 const u=await p.evaluate(()=>({hp:CT.ui.duel.hp,hull:CT.ui.duel.hull,n:CT.ui.duel.qs.length}));
 ok(u.hp===10&&u.hull===4&&u.n===12,'balance hp 10 hull 4 pool 12 '+JSON.stringify(u));
 ok(!/·\s*The /.test(await p.innerText('.reader.duel p.mono')),'source stratum hidden before answering');
 // force timeout
 await p.evaluate(()=>{CT.ui.duel.qStart=Date.now()-41000});await p.waitForTimeout(500);
 ok(await p.evaluate(()=>CT.ui.duel.timeout&&CT.ui.duel.hull===3),'timeout cracks hull');
 ok(await p.locator('.reader.duel .opt.ok').count()===1&&await p.locator('.reader.duel .qx').count()===1,'timeout shows the answer and explanation');
 ok(await p.evaluate(()=>CT.data.misses.some(m=>m.reason==='Ran out of time')),'timeout logged as Ran out of time');
 await p.screenshot({path:SH+'d05-timeout.png'});
 await p.click('[data-act="dnext"]');await p.waitForTimeout(100);
 // leave to depth 1 duel intro: duel 2 must not tick
 await go(p,'duel-1');await p.evaluate(()=>{});await p.waitForTimeout(100);
 const qs=await p.evaluate(()=>CT.ui.duel.qStart);await p.waitForTimeout(1200);
 await go(p,'duel-2');await p.waitForTimeout(300);
 const st=await p.evaluate(()=>({h:CT.ui.duel.hull,left:40-(Date.now()-CT.ui.duel.qStart)/1000}));
 ok(st.h===3&&st.left>37,'duel paused while away / other duel page did not tick ('+JSON.stringify(st)+')');
 // win it
 for(let k=0;k<30;k++){const o=await p.evaluate(()=>CT.ui.duel.over);if(o)break;const a=await p.evaluate(()=>{var u=CT.ui.duel,c=u.qs[u.i];return BOOK[c.id].Q[c.i].a});
  if(await p.evaluate(()=>CT.ui.duel.picked==null&&!CT.ui.duel.timeout))await p.click(`[data-act="dpick"][data-j="${a}"]`);if(await p.evaluate(()=>CT.ui.duel.over))break;await p.click('[data-act="dnext"]')}
 const res=await p.evaluate(()=>({o:CT.ui.duel.over,asked:CT.ui.duel.asked}));ok(res.o==='win','won duel 2 after '+res.asked+' questions');
 ok(await p.locator('.dstats').count()===1&&/Descend to −03/.test(await p.innerText('.panel.result')),'win panel has stats and Descend');
 await p.screenshot({path:SH+'d05-win.png'});
 await go(p,'depth-2');await p.click('text=Duel again');await p.waitForTimeout(150);
 ok(await p.locator('[data-act="duelGo"]').count()===1,'Duel again opens the intro (rematch)');
 await p.click('[data-act="duelGo"]');await p.waitForTimeout(100);
 await p.click('[data-act="dquit"]');await p.click('[data-act="dquit"]');await p.waitForTimeout(100);
 ok(await p.evaluate(()=>CT.ui.duel.over==='withdrew'),'withdraw works');
 ok(await p.evaluate(()=>CT.dive.sealBroken(DEPTHS[1])),'withdraw after win keeps seal');
 ok(errs.length===0,'no page errors (4) '+errs.join('|'));}
// 5. restain guards, no farming, lapse
{const {p,errs}=await open(b,{hash:'#restain-c16-cells'});
 ok(await p.locator('[data-act="rsa"]').count()===0,'locked depth cannot be re-stained');
 await p.evaluate(()=>{CT.setDoc('reads','c1-membrane',{done:true,right:5,total:5,last:5,at:Date.now(),firstAt:Date.now(),lvl:0,due:Date.now()+5*864e5,tries:1})});
 await go(p,'restain-c1-membrane');
 ok(/practice only/i.test(await p.innerText('.sub')),'not-fading re-stain says practice only');
 const qs=await p.evaluate(()=>CT.ui.rs['c1-membrane'].qs.map(i=>BOOK['c1-membrane'].Q[i].a));
 for(let k=0;k<3;k++)await p.click(`[data-act="rsa"][data-i="${k}"][data-j="${qs[k]}"]`);
 await p.click('[data-act="rsSave"]');await p.waitForTimeout(200);
 const r=await p.evaluate(()=>CT.data.reads.find(r=>r.id==='c1-membrane'));ok(r.lvl===0,'schedule unchanged by early re-stain (lvl '+r.lvl+')');
 await p.evaluate(()=>{CT.setDoc('reads','c1-membrane',{done:true,right:5,total:5,last:5,at:Date.now(),firstAt:Date.now(),lvl:3,due:Date.now()-1000,tries:1})});
 await p.waitForTimeout(300);await go(p,'restain-c1-membrane');console.log('   rs:',await p.evaluate(()=>JSON.stringify(CT.ui.rs)+location.hash));
 const q2=await p.evaluate(()=>CT.ui.rs['c1-membrane'].qs.map(i=>BOOK['c1-membrane'].Q[i].a));
 for(let k=0;k<3;k++)await p.click(`[data-act="rsa"][data-i="${k}"][data-j="${(q2[k]+1)%4}"]`);
 await p.click('[data-act="rsSave"]');await p.waitForTimeout(200);
 const r2=await p.evaluate(()=>{var r=CT.data.reads.find(r=>r.id==='c1-membrane');return {lvl:r.lvl,days:(r.due-Date.now())/864e5}});ok(r2.lvl===1&&r2.days<1.1,'lapse: lvl-2 and back tomorrow '+JSON.stringify(r2));
 ok(errs.length===0,'no page errors (5) '+errs.join('|'));}
// 6. weak points, dive log (Sunday), Practice-only week
{const {p,errs}=await open(b,{clock:new Date('2026-11-17T10:00:00+03:00')});   // Tuesday
 await p.evaluate(()=>{const D=864e5,now=Date.now();
  CT.setDoc('reads','c1-membrane',{done:true,right:5,total:5,last:5,at:now-D,firstAt:now-20*D,lvl:1,due:now+9*D,tries:2});
  CT.setDoc('reads','c1-furnace',{done:true,right:5,total:5,last:5,at:now,firstAt:now-20*D,lvl:1,due:now+9*D,tries:1});
  CT.setDoc('reads','c1-unmaking',{done:true,right:4,total:5,last:4,at:now,firstAt:now-20*D,lvl:1,due:now+9*D,tries:1});
  CT.setDoc('reads','c1-nucleus',{done:true,right:2,total:5,last:2,at:now,tries:1});
  ['m1','m2','m3'].forEach(k=>CT.setDoc('misses',k,{chapter:'c1-membrane',q:0,at:now-5*D}));
  for(let i=3;i<=9;i++)CT.setDoc('days',CT.ymd(now-i*D),{n:6})});
 await go(p,'today');await p.waitForTimeout(200);
 const wp=await p.evaluate(()=>[...document.querySelectorAll('.wp li b')].map(x=>x.textContent));
 ok(wp[0]==='The Nucleus Vault'&&!wp.includes('The Membrane Walls'),'weak points: blocking stratum first, aced one dropped '+JSON.stringify(wp));
 const dl=await p.innerText('.dlog');console.log('   '+dl.replace(/\n/g,' | '));
 ok(/from 08\/11\/2026/.test(dl)&&/from 15\/11\/2026/.test(dl),'weeks start Sunday');
 ok(/\bB\b|\bA\b/.test(await p.innerText('.dlog tbody tr:first-child td:last-child')),'Practice-only week of 7 days is not graded D');
 ok(errs.length===0,'no page errors (6) '+errs.join('|'));}
// 7. Yuzu path resolution and no duplicates
{const {p,errs}=await open(b);
 await p.evaluate(()=>{window.__c=[];CT.mcp={callTool:async(S,tool,args)=>{__c.push([tool,args]);
  if(tool==='search_files'){if(/'My Apps'/.test(args.query))return {payload:{files:[{id:'MA',parentId:'root'}]}};
   if(/'Yuzu'/.test(args.query))return {payload:{files:[{id:'YZ0',parentId:'other'},{id:'YZ',parentId:'MA'}]}};
   if(/'collection'/.test(args.query))return {payload:{files:[{id:'COL_OTHER',parentId:'ZEST'},{id:'COL',parentId:'YZ'},{id:'COL0',parentId:'YZ0'}]}};
   if(/'inbox'/.test(args.query))return {payload:{files:[{id:'IN_OTHER',parentId:'COL_OTHER'},{id:'IN0',parentId:'COL0'},{id:'INBOX',parentId:'COL'}]}}}
  return {payload:{}}}};
  const now=Date.now();CT.setDoc('misses','a',{chapter:'c1-membrane',q:0,at:now-1000});CT.setDoc('misses','b',{chapter:'c1-furnace',q:1,at:now-2000})});
 await p.evaluate(()=>CT.render());
 await p.click('[data-act="toYuzu"]');await p.waitForTimeout(200);
 await p.click('[data-act="toYuzu"]');await p.waitForTimeout(200);
 const c=await p.evaluate(()=>__c.filter(x=>x[0]==='create_file').map(x=>({p:x[1].parentId,n:JSON.parse(x[1].textContent).cards.length,card:JSON.parse(x[1].textContent).cards[0]})));
 ok(c.length===1&&c[0].p==='INBOX'&&c[0].n===2,'one pack to My Apps/Yuzu/collection/inbox '+JSON.stringify(c.map(x=>[x.p,x.n])));
 ok(/^[A-D]\. /.test(c[0].card.back),'card back has the letter: '+c[0].card.back.slice(0,40));
 console.log('   msg: '+await p.evaluate(()=>CT.ui.yz.msg));
 ok(errs.length===0,'no page errors (7) '+errs.join('|'));}
// 8. seal rule with a new stratum, boss lines, ending
{const {p,errs}=await open(b);await seedTo(p,3);
 await p.evaluate(()=>{DEPTHS[0].strata.push({id:'xnew',name:'The Test Ledger',ch:'c1-xnew'});BOOK['c1-xnew']={depth:1,title:'The Test Ledger',epi:'x',c:[],S:[{h:'H',p:['p']}],Q:[{q:'q?',o:['a','b','c','d'],a:2,x:'x',d:'bio'}]};
  DEPTHS[2].boss.intro=[{from:'hale',t:'INTRO LINE'}];DEPTHS[2].boss.win=[{from:'probe',t:'WIN LINE'}];DEPTHS[2].boss.lose=[{from:'static',t:'LOSE LINE'}];CT.render()});
 ok(await p.evaluate(()=>CT.dive.sealBroken(DEPTHS[0])&&CT.dive.isOpen(DEPTHS[2])),'seal stays broken after a new stratum is added');
 await go(p,'today');ok(/The Test Ledger/.test(await p.innerText('#main')),'new stratum offered as optional');
 const nx=await p.evaluate(()=>{var n=CT.dive.next();return n&&n.k+':'+n.d.n});ok(nx==='boss:3','next step skips optional strata ('+nx+')');
 await go(p,'duel-3');ok(/INTRO LINE/.test(await p.innerText('#main')),'boss intro on start screen');
 await p.click('[data-act="duelGo"]');
 for(let k=0;k<30;k++){const o=await p.evaluate(()=>CT.ui.duel.over);if(o)break;const a=await p.evaluate(()=>{var u=CT.ui.duel,c=u.qs[u.i];return BOOK[c.id].Q[c.i].a});await p.click(`[data-act="dpick"][data-j="${(a+1)%4}"]`);if(await p.evaluate(()=>CT.ui.duel.over))break;await p.click('[data-act="dnext"]')}
 ok(/LOSE LINE/.test(await p.innerText('.panel.result')),'boss lose line in result');
 await seedTo(p,16);await p.evaluate(()=>{CT.setDoc('reads','boss-16',{won:true,at:Date.now(),tries:1});STORY.END=[{from:'probe',t:'END ONE'},{from:'static',t:'END TWO'},{from:'host',t:'END THREE'}]});
 await go(p,'today');ok(/Hear the ending/.test(await p.innerText('#main')),'home offers the ending');
 await go(p,'end');await p.waitForTimeout(200);
 const e1=await p.innerText('#main');ok(/END ONE/.test(e1)&&!/END TWO/.test(e1),'ending plays one line at a time');
 await p.click('[data-act="endNext"]');await p.click('[data-act="endNext"]');
 ok(/END THREE/.test(await p.innerText('#main'))&&await p.locator('text=Open the Host file').count()===1,'ending completes');
 await p.screenshot({path:SH+'d05-ending.png'});
 ok(errs.length===0,'no page errors (8) '+errs.join('|'));}
// 9. logMiss with q.d / q.c
{const {p,errs}=await open(b);
 await p.evaluate(()=>{var q=BOOK['c1-membrane'].Q[0];q.d='pharm';q.c=BANK.C[3].id});
 await go(p,'ch-c1-membrane');const a=await p.evaluate(()=>BOOK['c1-membrane'].Q[0].a);
 await p.click(`[data-act="qa"][data-i="0"][data-j="${(a+1)%4}"]`);
 const m=await p.evaluate(()=>CT.data.misses[CT.data.misses.length-1]);
 ok(m.ch==='c1-membrane'&&m.qText&&m.rightText&&m.chosenText&&m.chosenText!==m.rightText,'miss stores ch and texts');
 ok(await p.evaluate(()=>document.querySelector('.banner h1').textContent===DEPTHS[0].strata[0].name),'chapter H1 is the stratum name');
 await go(p,'today');ok(/shortcuts/i.test(await p.innerText('#look'))&&/…/.test(await p.innerText('.shaft li.locked .dst')),'shortcuts row and tease on shaft');
 ok(m.discipline==='pharm'&&m.concept===await p.evaluate(()=>BANK.C[3].id)&&m.qh,'miss carries d, c and qh '+JSON.stringify({d:m.discipline,c:m.concept}));
 ok(errs.length===0,'no page errors (9) '+errs.join('|'));}
// 10. backlog flood: only newest 6 on home, rest in the Radio log; story writes coalesced
{const {p,errs}=await open(b);await p.evaluate(()=>{window.__w=0;var o=CT.setDoc;CT.setDoc=function(c,i,x){if(c==='reads'&&i==='story')__w++;return o.apply(this,arguments)}});
 await seedTo(p,10);await go(p,'radio');await go(p,'today');await p.waitForTimeout(300);
 await p.evaluate(()=>{var s=CT.data.reads.find(r=>r.id==='story');var sa={};CT.setDoc('reads','story',Object.assign({},s,{seenAt:sa}))});
 await go(p,'depth-1');await go(p,'today');await p.waitForTimeout(400);
 const n=await p.locator('.txs .tx').count();ok(n<=6,'home shows at most 6 fresh lines ('+n+')');
 ok(/earlier transmission/.test(await p.innerText('#main')),'link to the rest in the Radio log');
 const w0=await p.evaluate(()=>__w);for(let k=0;k<10;k++)await p.evaluate(()=>CT.render());await p.waitForTimeout(1500);
 const w1=await p.evaluate(()=>__w);ok(w1-w0<=1,'10 renders cost at most one story write ('+(w1-w0)+')');
 ok(errs.length===0,'no page errors (10) '+errs.join('|'));}
console.log(fails?fails+' FAILED':'ALL PASS');await b.close()})();
