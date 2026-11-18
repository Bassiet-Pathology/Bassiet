// Website mode without Google: progress survives a reload (IndexedDB), the cloud button shows, no errors.
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:390,height:844}});const p=await ctx.newPage();const errs=[];
p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error')errs.push('console: '+m.text())});
const U=process.env.WEB_URL||'http://localhost:8765/';
await p.goto(U);await p.waitForTimeout(2500);
const r1=await p.evaluate(()=>({web:!!window.BASSIET_WEB,storage:CT.ui.storage,btn:document.getElementById('bassiet-cloud')?.textContent||'',banner:!!document.querySelector('.notice')&&document.querySelector('.notice').textContent}));
await p.evaluate(()=>CT.setDoc('reads','c1-membrane',{done:true,right:5,total:5,at:Date.now()}));
await p.evaluate(()=>CT.setDoc('notes','test-note',{text:'kept'}));
await p.waitForTimeout(800);
await p.reload();await p.waitForTimeout(2500);
const r2=await p.evaluate(()=>({read:(CT.data.reads.find(x=>x.id==='c1-membrane')||{}).right,note:(CT.data.notes.find(x=>x.id==='test-note')||{}).text}));
console.log('R1',JSON.stringify(r1),JSON.stringify(r2),errs);await p.click('#bassiet-cloud');await p.waitForTimeout(300);
const sheet=await p.evaluate(()=>document.getElementById('bassiet-cloud-sentence')?.textContent);
await p.screenshot({path:__dirname+'/out/webmode.png'});
// plate upload stays on device
const r3=await p.evaluate(async()=>{const a=await window.claude.use('assets');const blob=new Blob([new Uint8Array([137,80,78,71])],{type:'image/png'});const x=await a.upload(blob);return {id:!!x.id,url:CT.blobUrl(x.id).slice(0,5)}});
console.log(JSON.stringify({r1,r2,sheet,r3}));console.log('ERRS',errs);await b.close()})();
