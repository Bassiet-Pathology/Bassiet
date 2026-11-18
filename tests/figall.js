const __APP=process.env.APP_DIR||require('path').resolve(__dirname,'../app');
const {chromium}=require('playwright');const O=__dirname+'/out/';
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:844}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+__APP+'/index.html');await p.waitForTimeout(800);
const ids=await p.evaluate(()=>Object.keys(FIG));console.log(ids.length,ids.join(','));
for(const id of ids){const r=await p.evaluate(id=>{try{document.getElementById('main').innerHTML='<div class="reader">'+CT.figHTML(id)+'</div>';const t=document.getElementById('main').innerText;return /undefined|NaN/.test(t)?'BAD TEXT':'ok'}catch(e){return 'ERR '+e.message}},id);if(r!=='ok')console.log(id,r);
 // click every button once
 const n=await p.locator('#main .fbtn').count();for(let i=0;i<Math.min(n,14);i++){try{await p.locator('#main .fbtn').nth(i).click({timeout:1000})}catch(e){}}
 const t=await p.evaluate(()=>document.getElementById('main').innerText);if(/undefined|NaN/.test(t))console.log(id,'BAD after clicks');}
console.log('ERRS',errs);await b.close()})();
