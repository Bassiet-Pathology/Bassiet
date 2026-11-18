const __APP=process.env.APP_DIR||require('path').resolve(__dirname,'../app');
const {chromium}=require('playwright');const O=__dirname+'/out/';
const U='file://'+__APP+'/index.html';
(async()=>{const b=await chromium.launch();const errs=[];
const p=await b.newPage({viewport:{width:390,height:844}});p.on('pageerror',e=>errs.push(e.message));
await p.goto(U);await p.waitForTimeout(500);
const depths=+process.argv[2]||1;
for(let n=1;n<=depths;n++){
 const chs=await p.evaluate(n=>{var d=DEPTHS[n-1];return d.strata.map(s=>s.ch||('c'+d.n+'-'+s.id)).filter(id=>BOOK[id])},n);
 for(const ch of chs){
  await p.goto(U+'#ch-'+ch);await p.waitForTimeout(120);
  const Q=await p.evaluate(c=>BOOK[c].Q.map(q=>q.a),ch);
  for(let i=0;i<Q.length;i++)await p.click(`[data-act="qa"][data-ch="${ch}"][data-i="${i}"][data-j="${Q[i]}"]`);
  await p.click(`[data-act="qSave"][data-ch="${ch}"]`);await p.waitForTimeout(150);
 }
 await p.goto(U+'#duel-'+n);await p.waitForTimeout(150);
 if(n===1)await p.screenshot({path:O+'duel0.png'});
 await p.click('[data-act="duelGo"]');
 for(let k=0;k<30;k++){
   const over=await p.evaluate(()=>CT.ui.duel.over);if(over)break;
   const a=await p.evaluate(()=>{var u=CT.ui.duel,c=u.qs[u.i];return BOOK[c.id].Q[c.i].a});
   const wrong=(n===1&&k===1);
   await p.click(`[data-act="dpick"][data-j="${wrong?(a+1)%4:a}"]`);
   if(n===1&&k===2)await p.screenshot({path:O+'duel1.png'});
   const o2=await p.evaluate(()=>CT.ui.duel.over);if(o2)break;
   await p.click('[data-act="dnext"]');
 }
 console.log('depth',n,'chapters',chs.length,'duel',await p.evaluate(()=>CT.ui.duel.over),'sealed',await p.evaluate(n=>CT.dive.sealBroken(DEPTHS[n-1]),n));
}
await p.screenshot({path:O+'duel2.png'});
await p.goto(U+'#today');await p.waitForTimeout(300);await p.screenshot({path:O+'home3.png',fullPage:true});
console.log('noUndef',!(await p.innerText('body')).match(/undefined|NaN/));
console.log('ERRS',errs);await b.close()})();
