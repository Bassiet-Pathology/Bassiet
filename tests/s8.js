const __APP=process.env.APP_DIR||require('path').resolve(__dirname,'../app');
const {chromium}=require('playwright');const O=__dirname+'/out/';
const U='file://'+__APP+'/index.html';
(async()=>{const b=await chromium.launch();const errs=[];
const p=await b.newPage({viewport:{width:390,height:844}});p.on('pageerror',e=>errs.push(e.message));
await p.goto(U);await p.waitForTimeout(400);
// stain chapter 1 with fading due in past, a weak miss
await p.evaluate(()=>{CT.setDoc('reads','c1-membrane',{done:true,right:3,total:5,last:3,at:Date.now()-20*864e5,firstAt:Date.now()-20*864e5,lvl:0,due:Date.now()-864e5,tries:3});CT.setDoc('misses','m1',{chapter:'c1-membrane',q:0,at:Date.now(),source:'x'});CT.setDoc('days',CT.ymd(Date.now()-7*864e5),{n:2,q:10,r:8})});
await p.goto(U+'#today');await p.waitForTimeout(200);
console.log('fading panel',await p.locator('.fadep').count(),'weak',await p.locator('.wp li').count(),'dlog',await p.locator('.dlog').count());
await p.goto(U+'#restain-c1-membrane');await p.waitForTimeout(200);
const qs=await p.evaluate(()=>CT.ui.rs['c1-membrane'].qs.map(i=>BOOK['c1-membrane'].Q[i].a));
for(let k=0;k<3;k++)await p.click(`[data-act="rsa"][data-i="${k}"][data-j="${qs[k]}"]`);
await p.click('[data-act="rsSave"]');await p.waitForTimeout(200);
console.log('after restain',await p.evaluate(()=>JSON.stringify(CT.data.reads.find(r=>r.id==='c1-membrane'))));
// lose a duel
await p.evaluate(()=>{['c1-furnace','c1-nucleus','c1-unmaking'].forEach(id=>CT.setDoc('reads',id,{done:true,right:5,total:5}))});
await p.goto(U+'#duel-1');await p.waitForTimeout(150);await p.click('[data-act="duelGo"]');
for(let k=0;k<5;k++){const o=await p.evaluate(()=>CT.ui.duel.over);if(o)break;const a=await p.evaluate(()=>{var u=CT.ui.duel,c=u.qs[u.i];return BOOK[c.id].Q[c.i].a});await p.click(`[data-act="dpick"][data-j="${(a+1)%4}"]`);const o2=await p.evaluate(()=>CT.ui.duel.over);if(o2)break;await p.click('[data-act="dnext"]')}
console.log('duel',await p.evaluate(()=>CT.ui.duel.over),'wounds',await p.locator('.q.wound').count());
await p.screenshot({path:O+'lose.png'});
// lights on chapter
await p.evaluate(()=>{localStorage.setItem('bassiet-look',JSON.stringify({world:'plain'}))});
await p.goto(U+'#ch-c1-furnace');await p.reload();await p.waitForTimeout(300);await p.screenshot({path:O+'plain.png'});
console.log('ERRS',errs);await b.close()})();
