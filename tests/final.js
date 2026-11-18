const __APP=process.env.APP_DIR||require('path').resolve(__dirname,'../docs');
const {chromium}=require('playwright');const O=__dirname+'/out/fin-';
const U='file://'+__APP+'/index.html';
(async()=>{const b=await chromium.launch();const errs=[];
for(const [vw,vh,tag] of [[390,844,'p'],[1440,900,'d']]){
const p=await b.newPage({viewport:{width:vw,height:vh}});p.on('pageerror',e=>errs.push(tag+': '+e.message));
await p.goto(U);await p.waitForTimeout(5000);
for(const r of ['today','depth-1','ch-c1-metab','duel-1','atlas','practice']){await p.goto(U+'#'+r);await p.waitForTimeout(700);await p.screenshot({path:O+tag+'-'+r+'.png'});
 const t=await p.evaluate(()=>document.getElementById('main').innerText);if(/undefined|NaN/.test(t))console.log('BAD',tag,r);}
await p.close()}
console.log('ERRS',errs);await b.close()})();
