const __APP=process.env.APP_DIR||require('path').resolve(__dirname,'../app');
// D02 storage tests against t10's async mock db. Usage: NODE_PATH=$(npm root -g) node d02test.js [tree] [scenario]
const {chromium}=require('playwright');
const baseMock=require('../work-t10/mock.js');
const TREE=process.argv[2]||__APP;
const U='file://'+TREE+'/index.html';
const which=process.argv[3]||'all';
function mock(cfg){
  let s=baseMock(cfg);
  if(cfg.freeze)s=s.replace('return JSON.parse(JSON.stringify(d))','function fz(o){if(o&&typeof o==="object"){Object.freeze(o);Object.keys(o).forEach(function(k){fz(o[k])})}return o}return fz(JSON.parse(JSON.stringify(d)))');
  if(cfg.fromCacheFirst)s=s.replace("else if(!(CFG.never","else if(CFG.fromCacheFirst){var s0=snap(coll);s0.metadata={fromCache:true,hasPendingWrites:false};setTimeout(function(){next(s0)},20);setTimeout(function(){next(snap(coll))},CFG.firstSnap||600)}\n      else if(!(CFG.never");
  if('user' in cfg)s=s.replace("var v=n==='db'?db:","var v=n==='user'?{can:function(){return Promise.resolve("+JSON.stringify(cfg.user)+")}}:n==='db'?db:");
  return s;
}
const res=[];function ok(name,cond,info){res.push([cond?'PASS':'FAIL',name,info===undefined?'':JSON.stringify(info)]);console.log(cond?'PASS':'FAIL',name,info===undefined?'':JSON.stringify(info).slice(0,400))}
(async()=>{
const b=await chromium.launch();
async function page(cfg,hash){
  const ctx=await b.newContext({viewport:{width:390,height:844}});
  const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
  if(cfg)await p.addInitScript(mock(cfg));
  await p.addInitScript(()=>{window.__toasts=[];new MutationObserver(function(rs){rs.forEach(function(r){var t=r.target.id==='toast'?r.target:r.target.parentNode&&r.target.parentNode.id==='toast'?r.target.parentNode:null;if(t&&t.textContent)window.__toasts.push(t.className+'|'+t.textContent)})}).observe(document,{childList:true,subtree:true,characterData:true})});
  await p.goto(U+(hash||''));
  return {p,ctx,errs};
}
const W=ms=>new Promise(r=>setTimeout(r,ms));
const today=await (async()=>{const d=new Date();const z=n=>(n<10?'0':'')+n;return d.getFullYear()+'-'+z(d.getMonth()+1)+'-'+z(d.getDate())})();
const run=s=>which==='all'||which===s;

if(run('A')){ // db resolves late: gate, nothing interactive, then the real data
  const seed={days:{}};seed.days[today]={n:4,q:20,r:15};
  const {p,ctx,errs}=await page({useDelay:{db:2500},seed},'');
  await p.waitForTimeout(500);
  const g=await p.evaluate(()=>({gate:!!document.querySelector('#main [data-gate]'),btns:document.querySelectorAll('#main button').length,busy:document.getElementById('main').getAttribute('aria-busy')}));
  ok('A gate while db pending',g.gate&&g.btns===0,g);
  await p.waitForTimeout(2600);
  const a=await p.evaluate(t=>({gate:!!document.querySelector('#main [data-gate]'),loading:CT.ui.loading,days:CT.data.days.find(d=>d.id===t)}),today);
  ok('A data after db',!a.gate&&!a.loading&&a.days&&a.days.q===20,a);ok('A no errors',!errs.length,errs);
  await ctx.close();
}
if(run('A2')){ // assets/mcp never answer: progress must not wait for them
  const {p,ctx,errs}=await page({useDelay:{db:30,assets:9000,mcp:9000}},'');
  await p.waitForTimeout(900);
  const r=await p.evaluate(()=>({loading:CT.ui.loading,subs:window.__subs||0}));
  ok('A2 loaded within 1 s while assets/mcp pending',!r.loading&&r.subs===6,r);await ctx.close();
}
if(run('B')){ // lost increments
  for(const gap of [30,300]){
    const {p,ctx,errs}=await page({writeDelay:400,snapDelay:50},'#today');
    await p.waitForTimeout(500);
    await p.evaluate(g=>{window.__gap=g},gap);
    await p.evaluate(async()=>{for(let i=0;i<5;i++){CT.bumpDay(true);await new Promise(r=>setTimeout(r,window.__gap))}});
    await p.waitForTimeout(2500);
    const r=await p.evaluate(t=>({store:window.__store.days[t],local:CT.data.days.find(d=>d.id===t),writes:window.__writes.filter(w=>w[0]==='days').length}),today);
    ok('B gap '+gap+' all 5 increments kept',r.store&&r.store.q===5&&r.local.q===5,r);
    await ctx.close();
  }
}
if(run('B2')){ // stain-test clicks through the UI
  const {p,ctx,errs}=await page({writeDelay:400,snapDelay:50},'');
  await p.waitForTimeout(500);
  const ch=await p.evaluate(()=>{var d=DEPTHS[0],s=d.strata[0];return s.ch||('c1-'+s.id)});
  await p.evaluate(c=>{location.hash='ch-'+c},ch);await p.waitForTimeout(200);
  const n=await p.evaluate(c=>BOOK[c].Q.length,ch);
  for(let i=0;i<n;i++){await p.click(`[data-act="qa"][data-i="${i}"]`);await p.waitForTimeout(40)}
  await p.waitForTimeout(3000);
  const r=await p.evaluate(t=>window.__store.days[t],today);
  ok('B2 UI answers counted',r&&r.q===n,{r,n,errs});await ctx.close();
}
if(run('C')){ // story doc must keep the new lastVisit
  const now=Date.now(),D=864e5;
  const seed={reads:{story:{seenAt:{},entered:[1],lastVisit:now-3*D}}};
  const {p,ctx,errs}=await page({writeDelay:120,snapDelay:30,seed},'#today');
  await p.waitForTimeout(3000);
  const r=await p.evaluate(()=>({story:window.__store.reads.story,w:window.__writes.filter(w=>w[1]==='story').length}));
  ok('C lastVisit updated',r.story.lastVisit>Date.now()-60000,{lv:r.story.lastVisit,seen:Object.keys(r.story.seenAt||{}).length,w:r.w,errs});
  await ctx.close();
}
if(run('D')){ // failed write: resolves false, rolls back, error toast
  const seed={reads:{x1:{done:true,right:3,total:5}}};
  const {p,ctx,errs}=await page({failSet:'quota_exceeded',seed},'#today');
  await p.waitForTimeout(500);
  const r=await p.evaluate(async()=>{var pr=CT.setDoc('reads','x1',{done:true,right:5,total:5});var mid=CT.data.reads.find(r=>r.id==='x1').right;var v=await pr;var pr2=CT.setDoc('reads','newdoc',{a:1});var mid2=!!CT.data.reads.find(r=>r.id==='newdoc');var v2=await pr2;
    return {v,v2,mid,mid2,after:CT.data.reads.find(r=>r.id==='x1').right,newGone:!CT.data.reads.find(r=>r.id==='newdoc'),toast:document.getElementById('toast').className+'|'+document.getElementById('toast').textContent}});
  ok('D setDoc false + optimistic + rollback',r.v===false&&r.v2===false&&r.mid===5&&r.mid2&&r.after===3&&r.newGone&&/err/.test(r.toast),r);
  await ctx.close();
}
if(run('D2')){ // unavailable is retried once
  const {p,ctx,errs}=await page({},'#today');
  await p.waitForTimeout(400);
  const r=await p.evaluate(async()=>{var n=0;var real=CT.db;CT.db={collection:function(c){var col=real.collection(c);return {doc:function(id){var d=col.doc(id);return {set:function(o){n++;if(n===1)return Promise.reject({code:'unavailable'});return d.set(o)},delete:function(){return d.delete()}}}}}};
    var v=await CT.setDoc('notes','zz',{note:'x'});CT.db=real;return {v,n}});
  ok('D2 retry once on unavailable',r.v===true&&r.n===2,r);await ctx.close();
}
if(run('E')){ // subscription dies with unavailable: resubscribe up to 3 times
  const {p,ctx,errs}=await page({snapErr:{misses:'unavailable'}},'');
  await p.waitForTimeout(12000);
  const r=await p.evaluate(()=>({subs:window.__subs,stale:CT.ui.stale,loading:CT.ui.loading}));
  ok('E resubscribed (6 + 3)',r.subs===9&&r.stale&&!r.loading,r);await ctx.close();
}
if(run('E2')){ // revoked: read-only
  const {p,ctx,errs}=await page({snapErr:{misses:'revoked'}},'');
  await p.waitForTimeout(800);
  const r=await p.evaluate(async()=>({ro:CT.ui.readonly,v:await CT.setDoc('notes','a',{x:1}),w:window.__writes.length,notice:!!document.querySelector('[data-ro]')}));
  ok('E2 revoked -> read-only, writes refused',r.ro&&r.v===false&&r.w===0&&r.notice,r);await ctx.close();
}
if(run('F')){ // one collection never answers: gate then stale after 10 s
  const {p,ctx,errs}=await page({never:['images']},'');
  await p.waitForTimeout(1500);
  const r1=await p.evaluate(()=>({gate:!!document.querySelector('[data-gate]'),loading:CT.ui.loading}));
  await p.waitForTimeout(9500);
  const r2=await p.evaluate(()=>({gate:!!document.querySelector('[data-gate]'),stale:CT.ui.stale,notice:(document.querySelector('.notice')||{}).textContent}));
  ok('F gate then stale',r1.gate&&!r2.gate&&r2.stale,{r1,r2});await ctx.close();
}
if(run('G')){ // failed delete resolves false (asset must not be deleted by caller)
  const seed={images:{img1:{assetId:'b'.repeat(32),answer:'Reed-Sternberg cell',discipline:'path',system:'Blood & cancer',at:1}}};
  const {p,ctx,errs}=await page({assets:true,failDel:'quota_exceeded',seed},'#images');
  await p.waitForTimeout(600);
  const r=await p.evaluate(async()=>({v:await CT.delDoc('images','img1'),back:!!CT.data.images.find(i=>i.id==='img1')}));
  ok('G delDoc false and row restored',r.v===false&&r.back,r);
  await p.click('[data-act="imgDel"]').catch(()=>{});await p.waitForTimeout(50);await p.click('[data-act="imgDel"]').catch(()=>{});await p.waitForTimeout(800);
  const r2=await p.evaluate(()=>({assetDeleted:window.__assetDeleted||null,row:!!window.__store.images.img1}));
  ok('G UI: asset kept when row delete fails (needs D04)',!r2.assetDeleted&&r2.row,r2);
  await ctx.close();
}
if(run('L')){ // late, stale snapshots must not undo newer local writes; acked writes held until confirmed
  const {p,ctx,errs}=await page({writeDelay:40,snapDelay:900},'#today');
  await p.waitForTimeout(500);
  const r=await p.evaluate(async()=>{var seen=[];for(let i=0;i<6;i++){await CT.bumpDay(true);seen.push(CT.data.days[0]&&CT.data.days[0].q);await new Promise(r=>setTimeout(r,150))}
    await new Promise(r=>setTimeout(r,2500));return {seen,final:CT.data.days[0].q,store:Object.values(window.__store.days)[0].q}});
  ok('L monotonic with late snapshots',r.final===6&&r.store===6&&r.seen.join()==='1,2,3,4,5,6',r);await ctx.close();
}
if(run('M')){ // frozen snapshot bodies (real db) must be mutable copies in CT.data
  const now=Date.now();
  const {p,ctx,errs}=await page({freeze:true,seed:{reads:{story:{seenAt:{a:1},entered:[1],lastVisit:now-1000}}}},'#today');
  await p.waitForTimeout(1500);
  const r=await p.evaluate(()=>{var s=CT.data.reads.find(r=>r.id==='story');try{s.seenAt.zz=1;return {ok:true,frozen:Object.isFrozen(s.seenAt)}}catch(e){return {ok:false,e:e.message}}});
  ok('M snapshot rows are mutable',r.ok&&!r.frozen&&!errs.length,{r,errs});await ctx.close();
}
if(run('N')){ // fromCache first snapshot keeps the gate until the store answers
  const {p,ctx,errs}=await page({fromCacheFirst:true,firstSnap:700},'');
  await p.waitForTimeout(300);
  const r1=await p.evaluate(()=>({loading:CT.ui.loading,gate:!!document.querySelector('[data-gate]')}));
  await p.waitForTimeout(800);
  const r2=await p.evaluate(()=>({loading:CT.ui.loading}));
  ok('N fromCache does not end loading',r1.loading&&r1.gate&&!r2.loading,{r1,r2});await ctx.close();
}
if(run('O')){ // view-only: invalid_argument -> read-only, one toast
  const {p,ctx,errs}=await page({failSet:'invalid_argument'},'#today');
  await p.waitForTimeout(500);
  const r=await p.evaluate(async()=>{var a=await CT.setDoc('notes','a',{x:1});var w1=window.__writes.length;var b=await CT.setDoc('notes','b',{x:1});return {a,b,ro:CT.ui.readonly,w1,w2:window.__writes.length,toasts:window.__toasts.filter(t=>/err/.test(t)).length}});
  ok('O invalid_argument -> read-only',r.a===false&&r.b===false&&r.ro&&r.w2===r.w1,r);
  const {p:p2,ctx:c2}=await page({user:false},'#today');await p2.waitForTimeout(500);
  const r2=await p2.evaluate(()=>({ro:CT.ui.readonly}));ok('O2 user.can(data.write)=false -> read-only',r2.ro,r2);await c2.close();
  await ctx.close();
}
if(run('P')){ // writes made while db opens (after the 10 s stale timer) reach the store
  const {p,ctx,errs}=await page({useDelay:{db:11000}},'');
  await p.waitForTimeout(10400);
  const st=await p.evaluate(()=>({stale:CT.ui.stale,db:!!CT.db}));
  await p.evaluate(()=>{window.__pv=CT.setDoc('notes','early',{note:'before db',conf:2,seen:1})});
  await p.waitForTimeout(2000);
  const r=await p.evaluate(async()=>({v:await window.__pv,store:window.__store.notes&&window.__store.notes.early,local:!!CT.nmap.early}));
  ok('P pre-db write flushed to store',st.stale&&!st.db&&r.v===true&&r.store&&r.local,{st,r});await ctx.close();
}
if(run('Q')){ // coalescing: a burst to one doc ends in the last value with few writes
  const {p,ctx,errs}=await page({writeDelay:300},'#today');
  await p.waitForTimeout(500);
  const r=await p.evaluate(async()=>{var ps=[];for(let i=1;i<=8;i++)ps.push(CT.setDoc('notes','burst',{note:'v'+i}));var v=await Promise.all(ps);await new Promise(r=>setTimeout(r,500));
    return {v,writes:window.__writes.filter(w=>w[1]==='burst').length,store:window.__store.notes.burst.note,local:CT.nmap.burst.note}});
  ok('Q burst coalesced',r.v.every(x=>x===true)&&r.writes<=2&&r.store==='v8'&&r.local==='v8',r);await ctx.close();
}
if(run('R')){ // focus kept on a textarea across background renders; snapshot render deferred while typing
  const {p,ctx,errs}=await page({snapDelay:20},'#atlas');
  await p.waitForTimeout(600);
  const cid=await p.evaluate(()=>BANK.C[0].id);
  await p.evaluate(c=>{location.hash='concept-'+c},cid);await p.waitForTimeout(300);
  const t1=await p.evaluate(()=>({title:document.title,focus:document.activeElement&&document.activeElement.tagName}));
  ok('R title + heading focus on route change',/Atlas · Bassiet$/.test(t1.title)&&t1.focus==='H1',t1);
  await p.click('#n-note');await p.keyboard.type('Hello world');
  await p.evaluate(()=>{var n=document.getElementById('n-note');n.setSelectionRange(3,3)});
  await p.evaluate(()=>{window.__store.notes=window.__store.notes||{};window.__store.notes.other={note:'x',conf:1,seen:1};CT.db.collection('notes').doc('other2').set({note:'y',conf:1,seen:1})});
  await p.waitForTimeout(400);
  const r1=await p.evaluate(()=>({id:document.activeElement.id,sel:document.activeElement.selectionStart,hasOther:!!CT.nmap.other2}));
  await p.evaluate(()=>CT.render());   // direct render (e.g. the 4 s confirm timer)
  const r2=await p.evaluate(()=>({id:document.activeElement.id,sel:document.activeElement.selectionStart,val:document.activeElement.value}));
  ok('R focus + caret kept',r1.id==='n-note'&&r1.sel===3&&r2.id==='n-note'&&r2.sel===3&&r2.val==='Hello world',{r1,r2});
  await ctx.close();
}
if(run('S')){ // button focus kept after a stain-test answer (keyboard user)
  const {p,ctx,errs}=await page(null,'');
  await p.waitForTimeout(400);
  const ch=await p.evaluate(()=>{var d=DEPTHS[0],s=d.strata[0];return s.ch||('c1-'+s.id)});
  await p.evaluate(c=>{location.hash='ch-'+c},ch);await p.waitForTimeout(200);
  await p.focus('[data-act="qa"][data-i="0"][data-j="0"]');await p.keyboard.press('Enter');await p.waitForTimeout(200);
  const r=await p.evaluate(()=>({tag:document.activeElement.tagName,cls:document.activeElement.className,title:document.title}));
  ok('S focus not dropped to body after answering',r.tag!=='BODY',r);await ctx.close();
}
if(run('T')){ // status JSON
  const {p,ctx,errs}=await page(null,'');await p.waitForTimeout(300);
  const r=await p.evaluate(()=>CT.statusJSON());ok('T statusJSON',r&&typeof r.due==='number'&&r.summary,{due:r.due,summary:r.summary,next:r.next});
  const q=await p.evaluate(()=>{var now=Date.now();BANK.CH.slice(0,25).forEach(function(x){CT.pmap[x.id]={due:now-1000}});return CT.buildQueue({d:'all',s:'all',t:'all'},false).length});
  ok('T queue capped at ~10 with backlog',q<=10,q);await ctx.close();
}
if(run('U')){ // failure after a confirmed write rolls back to the confirmed value, not to a stale snapshot
  const {p,ctx,errs}=await page({writeDelay:40,snapDelay:2500,seed:{notes:{u1:{note:'v0'}}}},'#today');
  await p.waitForTimeout(500);
  const r=await p.evaluate(async()=>{var a=await CT.setDoc('notes','u1',{note:'v1'});var real=CT.db;
    CT.db={collection:function(c){var col=real.collection(c);return {doc:function(id){var d=col.doc(id);return {set:function(o){return o.note==='v2'?Promise.reject({code:'quota_exceeded'}):d.set(o)},delete:function(){return d.delete()}}}}}};
    var b=await CT.setDoc('notes','u1',{note:'v2'});CT.db=real;var mid=CT.nmap.u1.note;await new Promise(r=>setTimeout(r,3000));return {a,b,mid,end:CT.nmap.u1.note}});
  ok('U rollback to confirmed value',r.a===true&&r.b===false&&r.mid==='v1'&&r.end==='v1',r);await ctx.close();
}
await b.close();
console.log('\n'+res.filter(r=>r[0]==='PASS').length+' pass, '+res.filter(r=>r[0]==='FAIL').length+' fail');
})();
