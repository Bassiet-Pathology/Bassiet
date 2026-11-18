const __APP=process.env.APP_DIR||require('path').resolve(__dirname,'../app');
const {chromium}=require('playwright');const O=__dirname+'/out/';
const U='file://'+__APP+'/index.html';
(async()=>{const b=await chromium.launch();const errs=[];
const p=await b.newPage({viewport:{width:390,height:844}});p.on('pageerror',e=>errs.push(e.message));
await p.goto(U+'#atlas');await p.waitForTimeout(500);
console.log('atlas body len',(await p.textContent('body')).length, 'concepts',await p.evaluate(()=>Object.keys(CT.concepts).length));
await p.screenshot({path:O+'atlas.png'});
for(const id of ['sickle-cell','preeclampsia','eye-ear','osteoporosis']){await p.goto(U+'#concept-'+id);await p.waitForTimeout(250);const t=await p.textContent('body');console.log(id,t.length,/undefined|NaN/.test(t));}
await p.screenshot({path:O+'concept.png'});
await p.goto(U+'#ch-c13-cycle');await p.waitForTimeout(300);
console.log('sites btns',await p.locator('[data-act="openConcept"]').allTextContents());
await p.goto(U+'#practice');await p.waitForTimeout(300);
const t=await p.textContent('body');console.log('practice undefined?',/undefined|NaN/.test(t));
await p.screenshot({path:O+'practice.png',fullPage:false});
console.log('ERRS',errs);await b.close()})();
