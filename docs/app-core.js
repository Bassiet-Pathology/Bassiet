/* Bassiet core: data, storage, scheduling, practice sessions, Citrus hub status. */
(function(){
'use strict';
var B=window.BANK, CT=window.CT={B:B};
CT.D=[['path','Pathology'],['micro','Microbiology'],['pharm','Pharmacology'],['bio','Biochemistry'],['phys','Physiology']];
CT.DN={};CT.D.forEach(function(d){CT.DN[d[0]]=d[1]});
CT.SYS=['General','Cardio','Resp','Renal','GI & liver','Blood & cancer','Endocrine','Repro','Neuro','MSK & skin','Immune'];
CT.KIND={chain:'Trace',predict:'Predict',compare:'Compare',image:'Image'};
CT.DAY=864e5;
CT.HUB_FOLDER='1zue1rt1FB9F8ZFPj_xWDdH-GZ65Bh6nc';
CT.APP_URL='https://claude.ai/artifact/DDmJuv6a2agDv383HcCPvH';
CT.data={prog:[],notes:[],images:[],misses:[],days:[],reads:[]};
CT.loaded={prog:false,notes:false,images:false,misses:false,days:false,reads:false};
CT.ui={loading:true,stale:false,local:false,readonly:false,storage:'',confirm:null,draft:{},hub:{busy:false,last:0,msg:''}};
CT.db=null;CT.assets=null;CT.mcp=null;
CT.blobUrl=function(id){return '/_blob/'+encodeURIComponent(id)};   /* web/shim.js replaces this on the website */
CT.pmap={};CT.nmap={};
CT.render=function(){};

CT.concepts={};B.C.forEach(function(c){CT.concepts[c.id]=c});
CT.out={};CT.inn={};
B.E.forEach(function(e){(CT.out[e[0]]=CT.out[e[0]]||[]).push(e);(CT.inn[e[1]]=CT.inn[e[1]]||[]).push(e)});

/* helpers */
CT.esc=function(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})};
CT.newId=function(){return Math.random().toString(36).slice(2,9)+Date.now().toString(36)};
CT.strip=function(o){var r={};for(var k in o){if(k!=='id')r[k]=o[k]}return r};
function p2(n){return (n<10?'0':'')+n}
CT.fmtDate=function(t){var d=new Date(t);return p2(d.getDate())+'/'+p2(d.getMonth()+1)+'/'+d.getFullYear()};
CT.fmtTime=function(t){var d=new Date(t);return CT.fmtDate(t)+' '+p2(d.getHours())+':'+p2(d.getMinutes())};
CT.ymd=function(t){var d=new Date(t==null?Date.now():t);return d.getFullYear()+'-'+p2(d.getMonth()+1)+'-'+p2(d.getDate())};
CT.midnight=function(){var d=new Date();d.setHours(0,0,0,0);return d.getTime()};
CT.shuffle=function(a){a=a.slice();for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1)),t=a[i];a[i]=a[j];a[j]=t}return a};
CT.fmtIv=function(d){if(d<1)return '10m';if(d<30)return d+'d';if(d<365)return Math.round(d/30)+'mo';return (Math.round(d/36.5)/10)+'y'};

/* ---------- toast ----------
   CT.toast(msg, kind): kind 'err' for failures (class "toast err", role alert, stays longer, tap to dismiss).
   The same error message is not repeated within 4 s (a view-only viewer would otherwise get one per answer). */
var lastErr='',lastErrAt=0;
CT.toast=function(m,kind){
  var t=document.getElementById('toast');if(!t||!m)return;
  var now=Date.now();
  if(kind==='err'){if(m===lastErr&&now-lastErrAt<4000)return;lastErr=m;lastErrAt=now}
  var live=document.getElementById('sr-live');
  t.textContent=m;t.className='toast'+(kind?' '+kind:'');
  if(live){t.setAttribute('aria-hidden','true');t.removeAttribute('role');live.textContent='';setTimeout(function(){live.textContent=m},30)}
  else t.setAttribute('role',kind==='err'?'alert':'status');
  t.hidden=false;
  if(!t._d02){t._d02=1;t.addEventListener('click',function(){t.hidden=true;clearTimeout(CT._tt)})}
  clearTimeout(CT._tt);CT._tt=setTimeout(function(){t.hidden=true},kind==='err'?6500:3600);
};

/* ---------- render scheduling ----------
   CT.requestRender(): coalesced render for background changes (snapshots, saves). It waits while the
   person is typing in a text field inside #main (so a phone keyboard does not close mid-sentence) and
   renders when the field loses focus. Click handlers keep calling CT.render() directly. */
var rqA=0,rqT=0,rqWait=false;
function typing(){var a=document.activeElement,m=document.getElementById('main');
  return !!(a&&m&&m.contains(a)&&(a.tagName==='TEXTAREA'||(a.tagName==='INPUT'&&/^(text|search|email|url|number|tel|password|)$/i.test(a.type||''))))}
function rqCancel(){if(rqA&&window.cancelAnimationFrame)cancelAnimationFrame(rqA);clearTimeout(rqT);rqA=0;rqT=0}
function rqRun(){rqCancel();if(typing()){rqWait=true;return}rqWait=false;CT.render()}
CT.requestRender=function(){
  if(rqA||rqT)return;
  if(window.requestAnimationFrame)rqA=requestAnimationFrame(rqRun);
  rqT=setTimeout(rqRun,80);            /* rAF does not fire in hidden tabs */
};
document.addEventListener('focusout',function(){if(rqWait)setTimeout(function(){if(rqWait&&!typing())rqRun()},0)});

/* ---------- storage ----------
   db when available, memory otherwise. Contract 2.1:
   CT.setDoc(coll,id,obj) / CT.delDoc(coll,id) update CT.data at once (optimistic), write in the
   background and resolve true on success, false on failure (never reject). On failure the local row
   rolls back and an error toast explains what to do. Writes to one document run one at a time; a
   write that is still waiting is replaced by a newer one (set is a full replace). Pending and
   just-confirmed writes are laid over every incoming snapshot, so a late snapshot never undoes a
   newer local change and read-modify-write counters (days, story) see the latest value. */
var pend={},   /* 'coll/id' -> [{obj (null = delete), st:'q'|'ack', at}] */
    base={},   /* 'coll/id' -> row before the first pending write, used until the collection has loaded */
    srv={},    /* coll -> {id: row} from the last snapshot */
    wq={},     /* 'coll/id' -> {run, wait:{obj, es, cbs}} */
    pre=[],    /* writes made while the db is still being opened */
    brk={};    /* 'coll/id' -> {at, code}: a failed document is not retried for 30 s (stops write-on-render loops) */
function clone(o){return o==null?o:JSON.parse(JSON.stringify(o))}
function skey(o){if(o===null||typeof o!=='object')return JSON.stringify(o);if(Array.isArray(o))return '['+o.map(skey).join(',')+']';
  return '{'+Object.keys(o).filter(function(k){return k!=='id'&&o[k]!==undefined}).sort().map(function(k){return JSON.stringify(k)+':'+skey(o[k])}).join(',')+'}'}
function rebuild(){
  CT.pmap={};CT.data.prog.forEach(function(r){CT.pmap[r.id]=r});
  CT.nmap={};CT.data.notes.forEach(function(r){CT.nmap[r.id]=r});
}
function findRow(coll,id){var a=CT.data[coll]||[];for(var i=0;i<a.length;i++)if(a[i].id===id)return a[i];return undefined}
function apply(coll,id,obj){
  var a=CT.data[coll]||(CT.data[coll]=[]),i=a.findIndex(function(x){return x.id===id});
  if(obj===null||obj===undefined){if(i>=0)a.splice(i,1);return}
  var row=clone(obj);row.id=id;if(i>=0)a[i]=row;else a.push(row);
}
function settle(coll,id){   /* local value = newest pending write, else server value, else the pre-write base */
  var k=coll+'/'+id,l=pend[k];
  if(l&&l.length){apply(coll,id,l[l.length-1].obj);return}
  delete pend[k];
  if(CT.loaded[coll]&&srv[coll])apply(coll,id,srv[coll][id]?CT.strip(srv[coll][id]):null);
  else apply(coll,id,base[k]===undefined?null:base[k]);
  delete base[k];
}
function errCode(e){return (e&&typeof e==='object'&&e.code)||(e instanceof TypeError?'bad_path':'unavailable')}
function saveMsg(c){
  return c==='quota_exceeded'?'Storage is full, so this was not saved. Delete old entries in the Hull, then try again.':
    c==='readonly'||c==='revoked'||c==='not_granted'||c==='capability_disabled'||c==='capability_removed'?'Changes cannot be saved in this view.':
    c==='too_large'?'This entry is too large to save. Shorten it and try again.':
    c==='resource_exhausted'?'Too many saves at once. Wait a moment, then try again.':
    c==='timeout'?'Saving is taking too long. Check the connection: this change may not be kept.':
    c==='bad_path'?'This entry could not be saved (bad name).':
    'Could not save. Check the connection and try again.';
}
function wait(ms){return new Promise(function(r){setTimeout(r,ms)})}
function attempt(coll,id,obj,tries){
  var p;
  try{var ref=CT.db.collection(coll).doc(id);p=obj===null?ref.delete():ref.set(obj)}catch(e){return Promise.reject(e)}
  var to=new Promise(function(_,rej){setTimeout(function(){rej({code:'timeout'})},20000)});
  return Promise.race([Promise.resolve(p),to]).catch(function(e){
    var c=errCode(e);
    var again=tries<1&&(c==='unavailable'||c==='resource_exhausted'||['invalid_argument','quota_exceeded','revoked','not_granted','capability_disabled','capability_removed','transform_error','timeout','bad_path'].indexOf(c)<0);
    if(again)return wait(c==='resource_exhausted'?1500+Math.random()*1500:400+Math.random()*800).then(function(){return attempt(coll,id,obj,tries+1)});
    throw e;
  });
}
function pump(coll,id){
  var k=coll+'/'+id,S=wq[k];if(!S||S.run||!S.wait)return;
  var w=S.wait;S.wait=null;S.run=true;
  attempt(coll,id,w.obj,0).then(function(){
    var l=pend[k]||[],now=Date.now(),idx=-1;
    w.es.forEach(function(e){e.st='ack';e.at=now;idx=Math.max(idx,l.indexOf(e))});
    /* keep only the newest confirmed body (until a snapshot shows it) and the writes queued after it;
       older entries are superseded, and the confirmed body is what a later failure rolls back to */
    if(idx>=0)pend[k]=l.slice(idx);
    if(!pend[k].length)delete pend[k];
    brk={};                     /* something saved: storage works again, lift every hold */
    w.cbs.forEach(function(cb){cb(true)});
  },function(e){
    var c=errCode(e);
    if(c==='invalid_argument'){var big=false;try{big=JSON.stringify(w.obj||{}).length>200000}catch(x){big=true}
      if(big)c='too_large';else{c='readonly';CT.ui.readonly=true}}
    if(c==='revoked'){CT.ui.readonly=true}
    brk[k]={at:Date.now(),code:c};
    pend[k]=(pend[k]||[]).filter(function(x){return w.es.indexOf(x)<0});
    settle(coll,id);rebuild();CT.requestRender();
    CT.toast(saveMsg(c),'err');
    w.cbs.forEach(function(cb){cb(false)});
  }).then(function(){S.run=false;if(S.wait)pump(coll,id);else if(!pend[k]||!pend[k].some(function(e){return e.st==='q'}))delete wq[k]});
}
function schedule(coll,id,e,cb){
  var k=coll+'/'+id,S=wq[k]||(wq[k]={run:false,wait:null});
  if(S.wait){S.wait.obj=e.obj;S.wait.es.push(e);S.wait.cbs.push(cb)}else S.wait={obj:e.obj,es:[e],cbs:[cb]};
  pump(coll,id);
}
function write(coll,id,obj){
  if(!CT.data[coll])CT.data[coll]=[];
  id=String(id);
  if(CT.ui.readonly&&(CT.db||CT.ui.storage==='pending')){CT.toast(saveMsg('readonly'),'err');return Promise.resolve(false)}
  var body=obj===null?null:clone(CT.strip(obj||{}));
  if(!CT.db&&CT.ui.storage!=='pending'){apply(coll,id,body);rebuild();CT.requestRender();return Promise.resolve(true)}
  var k=coll+'/'+id;
  if(CT.db&&brk[k]&&Date.now()-brk[k].at<30000){CT.toast(saveMsg(brk[k].code),'err');return Promise.resolve(false)}
  if(!pend[k]||!pend[k].length){var cur=findRow(coll,id);base[k]=cur?CT.strip(clone(cur)):undefined}
  var e={obj:body,st:'q',at:0};(pend[k]=pend[k]||[]).push(e);
  apply(coll,id,body);rebuild();CT.requestRender();
  return new Promise(function(res){
    if(CT.db)schedule(coll,id,e,res);else pre.push({coll:coll,id:id,e:e,cb:res});
  });
}
CT.setDoc=function(coll,id,obj){return write(coll,id,obj||{})};
CT.delDoc=function(coll,id){return write(coll,id,null)};
CT.pendingWrites=function(){return Object.keys(pend).reduce(function(n,k){return n+pend[k].filter(function(e){return e.st==='q'}).length},0)};
function flushPre(ok){var l=pre;pre=[];l.forEach(function(p){
  if(ok&&CT.db)schedule(p.coll,p.id,p.e,p.cb);
  else{var k=p.coll+'/'+p.id;if(pend[k]){pend[k]=pend[k].filter(function(x){return x!==p.e});if(!pend[k].length){delete pend[k];delete base[k]}}p.cb(true)}
})}

/* subscriptions: one per collection, overlay pending writes, resubscribe after the host stops answering */
var subGen={};
CT.unsub={};
function onSnap(name,snap){
  var rows=[],map={};
  (snap&&snap.docs||[]).forEach(function(d){var o;try{o=clone(d.data()||{})}catch(x){o={}}o.id=d.id;rows.push(o);map[d.id]=o});
  srv[name]=map;
  var now=Date.now(),fromCache=!!(snap&&snap.metadata&&snap.metadata.fromCache);
  Object.keys(pend).forEach(function(k){
    var s=k.indexOf('/');if(k.slice(0,s)!==name)return;var id=k.slice(s+1);
    pend[k]=pend[k].filter(function(e){if(e.st!=='ack')return true;
      var cur=map[id];return !((e.obj===null?!cur:(cur&&skey(cur)===skey(e.obj)))||now-e.at>5000)});
    if(!pend[k].length){delete pend[k];delete base[k]}
  });
  /* rows are fresh plain objects (snapshot bodies are frozen); lay local writes over them */
  CT.data[name]=rows.map(function(r){return clone(r)});
  Object.keys(pend).forEach(function(k){var s=k.indexOf('/');if(k.slice(0,s)===name){var l=pend[k];apply(name,k.slice(s+1),l[l.length-1].obj)}});
  if(!fromCache)CT.loaded[name]=true;
  rebuild();
  if(Object.keys(CT.loaded).every(function(k){return CT.loaded[k]})){
    var first=CT.ui.loading;
    CT.ui.loading=false;CT.ui.stale=false;clearTimeout(CT._lt);
    if(first||!CT._afterLoad){CT._afterLoad=1;setTimeout(afterLoad,1500)}
    if(first){CT.render();return}
  }
  CT.requestRender();
}
function sub(name,tries){
  var g=subGen[name]=(subGen[name]||0)+1;
  try{if(CT.unsub[name])CT.unsub[name]()}catch(e){}
  try{
    CT.unsub[name]=CT.db.collection(name).onSnapshot(function(snap){if(subGen[name]===g){onSnap(name,snap);tries=0}},function(err){
      if(subGen[name]!==g)return;
      var c=errCode(err);CT.loaded[name]=false;CT.ui.stale=true;
      if(c==='revoked'||c==='not_granted'||c==='capability_disabled'||c==='capability_removed'){CT.ui.readonly=true;CT.ui.loading=false}
      else if(c!=='invalid_argument'&&tries<3){setTimeout(function(){if(subGen[name]===g)sub(name,tries+1)},1500*(tries+1)+Math.random()*1000)}
      else{CT.ui.loading=false;CT.toast('Saved data could not be reached. What you see may be out of date.','err')}
      CT.requestRender();
    });
  }catch(e){CT.ui.stale=true;CT.ui.loading=false;CT.requestRender()}
}
function subscribe(){Object.keys(CT.data).forEach(function(n){sub(n,0)})}

/* After loading: keep the misses collection under the 25,000-document cap (t10-18). Only automatic
   misses older than 180 days are removed, oldest first, at most 150 per visit, and only once the
   collection is large. Hand-logged misses are never pruned. */
function afterLoad(){
  if(!CT.db||CT.ui.readonly)return;
  var ms=CT.data.misses;if(ms.length<6000)return;
  var cut=Date.now()-180*CT.DAY,old=ms.filter(function(m){return m.auto&&(m.at||0)<cut}).sort(function(a,b){return (a.at||0)-(b.at||0)}).slice(0,150);
  (function next(i){if(i>=old.length||CT.ui.readonly)return;CT.delDoc('misses',old[i].id).then(function(ok){if(ok)setTimeout(function(){next(i+1)},250)})})(0);
}

/* ---------- loading gate, focus keeping, page title ----------
   Installed around the final CT.render (after every app file has wrapped it) when CT.init runs.
   - Until storage has answered (db snapshot of every collection, or 10 s), nothing interactive renders,
     so no action is taken on empty data and later thrown away (t10-01).
   - After a re-render on the same route, focus goes back to the same control (same id, or same
     data-act/data-* attributes), with the caret position for text fields (t10-08, t09-03).
   - On a route change, document.title follows the page heading and focus moves to it (t09-04).
     CT.focusHeading() is exported for views that want to do it themselves. */
var VIEWN={today:'Dive',atlas:'Atlas',practice:'Practice',images:'Plates',mistakes:'Hull'};
CT.routeKey=function(){return (CT.view||'')+'|'+(CT.cid||'')+'|'+(CT.dsub||'')};
function heading(){var m=document.getElementById('main');if(!m)return null;var c=m.querySelector('.ctitle');if(c)return c;var hs=m.querySelectorAll('h1');return hs.length?hs[hs.length-1]:m.querySelector('h2')}
CT.pageTitle=function(){
  var h=heading(),t=h?(h.textContent||'').replace(/\s+/g,' ').trim():'';
  if(t.length>60)t=t.slice(0,58)+'…';
  var v=VIEWN[CT.view]||'';
  return (t&&t!=='Bassiet'?t+(v&&t!==v&&CT.view!=='today'?' · '+v:''):(v||''))+(t||v?' · ':'')+'Bassiet';
};
CT.focusHeading=function(){var h=heading();if(!h)return false;if(!h.hasAttribute('tabindex'))h.setAttribute('tabindex','-1');try{h.focus({preventScroll:true})}catch(e){h.focus()}return document.activeElement===h};
var FOC='button,a[href],input,select,textarea,[tabindex]:not([tabindex="-1"])';
function sel(el){
  if(el.id)return '#'+(window.CSS&&CSS.escape?CSS.escape(el.id):el.id);
  var s=el.tagName.toLowerCase(),any=false;
  for(var i=0;i<el.attributes.length;i++){var a=el.attributes[i];if(a.name.indexOf('data-')===0&&a.name!=='data-hint'){any=true;s+='['+a.name+'="'+String(a.value).replace(/["\\]/g,'\\$&')+'"]'}}
  return any?s:null;
}
function grab(main){
  var ae=document.activeElement;if(!ae||ae===document.body||!main.contains(ae))return null;
  var f={sel:sel(ae),idx:[].indexOf.call(main.querySelectorAll(FOC),ae),s0:null,s1:null};
  try{if(typeof ae.selectionStart==='number'){f.s0=ae.selectionStart;f.s1=ae.selectionEnd}}catch(e){}
  return f;
}
function restore(main,f){
  var ae=document.activeElement;if(ae&&ae!==document.body&&ae.isConnected)return;
  var el=null;try{el=f.sel?main.querySelector(f.sel):null}catch(e){el=null}
  if(el&&el.disabled){
    var q=el.closest('.q'),x=q&&q.querySelector('.qx');
    if(x){x.setAttribute('tabindex','-1');el=x}
    else{var all=[].slice.call(main.querySelectorAll(FOC)).filter(function(n){return !n.disabled});
      el=all.filter(function(n){return el.compareDocumentPosition(n)&Node.DOCUMENT_POSITION_FOLLOWING})[0]||null}
  }
  if(!el&&f.idx>=0){var l=[].slice.call(main.querySelectorAll(FOC)).filter(function(n){return !n.disabled});el=l[Math.min(f.idx,l.length-1)]||null}
  if(!el)return;
  try{el.focus({preventScroll:true})}catch(e){el.focus()}
  if(f.s0!=null&&document.activeElement===el)try{var n=(el.value||'').length;el.setSelectionRange(Math.min(f.s0,n),Math.min(f.s1,n))}catch(e){}
}
function gate(main){
  if(!main.querySelector('[data-gate]'))main.innerHTML='<div class="gate" data-gate role="status"><p class="muted">Opening the dive…</p></div>';
  main.setAttribute('aria-busy','true');
}
var lastKey=null;
function wrapRender(){
  if(CT._d02wrap)return;CT._d02wrap=1;
  var inner=CT.render;
  CT.render=function(){
    rqCancel();rqWait=false;
    var main=document.getElementById('main');if(!main)return inner.apply(this,arguments);
    if(CT.ui.loading&&!CT.ui.stale){gate(main);return}
    main.removeAttribute('aria-busy');
    var f=grab(main),key=CT.routeKey();
    var r=inner.apply(this,arguments);
    if(CT.ui.readonly&&!main.querySelector('[data-ro]')){var d=document.createElement('div');d.className='notice';d.setAttribute('data-ro','');d.textContent='Changes cannot be saved in this view.';main.insertBefore(d,main.firstChild)}
    var t=CT.pageTitle();if(document.title!==t)document.title=t;
    if(lastKey!==null&&key!==lastKey)CT.focusHeading();
    else if(f)restore(main,f);
    lastKey=key;
    return r;
  };
}

/* the study day turns over on an open app (t10-27) */
var dayKey=null;
function dayTick(){
  var k=CT.ymd();if(dayKey&&k!==dayKey&&!CT.ui.loading)CT.requestRender();dayKey=k;
  var n=new Date();n.setHours(24,0,5,0);clearTimeout(CT._dt);CT._dt=setTimeout(dayTick,Math.min(n.getTime()-Date.now(),36e5));
}
document.addEventListener('visibilitychange',function(){if(!document.hidden)dayTick()});

function useCap(c,name){
  try{return Promise.race([Promise.resolve(c.use(name)),wait(12000).then(function(){return null})]).catch(function(){return null})}catch(e){return Promise.resolve(null)}
}
CT.init=async function(){
  wrapRender();dayTick();
  var c=window.claude;
  if(c&&typeof c.use==='function'){
    CT.ui.storage='pending';CT.ui.loading=true;
    CT._lt=setTimeout(function(){if(CT.ui.loading){CT.ui.loading=false;CT.ui.stale=true;CT.render()}},10000);
    CT.render();
    useCap(c,'assets').then(function(a){CT.assets=a||null;CT.requestRender()});
    useCap(c,'mcp').then(function(m){CT.mcp=m||null;CT.requestRender()});
    useCap(c,'user').then(function(u){return u&&typeof u.can==='function'?u.can('data.write'):null}).then(function(v){if(v===false){CT.ui.readonly=true;CT.requestRender()}},function(){});
    var db=await useCap(c,'db');
    if(db){CT.db=db;CT.ui.storage='db';flushPre(true);subscribe()}
    else{clearTimeout(CT._lt);CT.ui.storage='memory';CT.ui.loading=false;CT.ui.stale=false;CT.ui.local=true;flushPre(false)}
  }else{CT.ui.storage='memory';CT.ui.loading=false;CT.ui.local=true}
  CT.render();
};

/* catalog and progress */
CT.catalog=function(){
  var a=[];
  B.CH.forEach(function(x){a.push({k:'chain',id:x.id,t:x.t,sub:x.sub,sys:x.sys,c:x.c,o:x})});
  B.PT.forEach(function(x){a.push({k:'predict',id:x.id,t:x.t,sub:x.sub,sys:x.sys,c:x.c,o:x})});
  B.CP.forEach(function(x){a.push({k:'compare',id:x.id,t:x.t,sub:x.sub,sys:x.sys,c:x.c,o:x})});
  CT.data.images.forEach(function(x){a.push({k:'image',id:x.id,t:x.answer,sub:[x.discipline],sys:x.system,c:[],o:x})});
  return a;
};
CT.isNew=function(id){return !CT.pmap[id]};
CT.isDue=function(id){var p=CT.pmap[id];return !!p&&(p.due||0)<=Date.now()};
CT.schedule=function(p,g){
  p=p||{};
  var ease=p.ease||2.5,reps=p.reps||0,iv=p.interval||0,lapses=p.lapses||0,interval,nreps=reps;
  if(g==='again'){nreps=0;interval=0;ease=Math.max(1.3,ease-.2);lapses++}
  else if(g==='hard'){interval=Math.max(1,Math.round((iv||1)*1.2));ease=Math.max(1.3,ease-.15);nreps++}
  else if(g==='good'){interval=reps===0?1:reps===1?3:Math.max(iv+1,Math.round(iv*ease));nreps++}
  else{interval=reps===0?4:Math.max(iv+2,Math.round(iv*ease*1.3));ease+=.15;nreps++}
  var now=Date.now();
  return {ease:Math.round(ease*100)/100,interval:interval,reps:nreps,lapses:lapses,last:now,due:interval===0?now+600000:now+interval*CT.DAY};
};
/* Counters read CT.data, which setDoc updates at once (optimistic), so quick answers are never lost
   (t10-03). Both resolve true/false like setDoc. */
function dayDoc(){var key=CT.ymd(),cur=CT.data.days.find(function(d){return d.id===key});var nd=Object.assign({},cur||{});delete nd.id;return {key:key,nd:nd}}
CT.record=function(item,g){
  var patch=CT.schedule(CT.pmap[item.id],g);
  var p1=CT.setDoc('prog',item.id,Object.assign({k:item.k,sys:item.sys,sub:item.sub},patch));
  var x=dayDoc();x.nd.n=(x.nd.n||0)+1;
  if(CT.ps){var t=CT.ps.tally||(CT.ps.tally={}),r=t[item.k]||(t[item.k]={n:0,good:0,hard:0,again:0});r.n++;r[g==='easy'?'good':g]=(r[g==='easy'?'good':g]||0)+1}
  var p2=CT.setDoc('days',x.key,x.nd);
  return Promise.all([p1,p2]).then(function(r){return r[0]&&r[1]});
};
CT.bumpDay=function(right){var x=dayDoc();x.nd.n=x.nd.n||0;x.nd.q=(x.nd.q||0)+1;x.nd.r=(x.nd.r||0)+(right?1:0);return CT.setDoc('days',x.key,x.nd)};
CT.gradeFromScore=function(f){return f>=1?'good':f>=.7?'hard':'again'};
CT.streak=function(){
  var set={};CT.data.days.forEach(function(d){if(d.n>0||d.q>0)set[d.id]=1});
  var d=new Date(),n=0;d.setHours(12,0,0,0);          /* step by calendar date, safe across DST (t10-25) */
  if(!set[CT.ymd(d.getTime())])d.setDate(d.getDate()-1);
  while(set[CT.ymd(d.getTime())]){n++;d.setDate(d.getDate()-1)}
  return n;
};
CT.counts=function(){
  var cat=CT.catalog(),mid=CT.midnight(),now=Date.now();
  var due=0,fresh=0;
  cat.forEach(function(x){if(CT.isNew(x.id))fresh++;else if(CT.isDue(x.id))due++});
  var today=CT.data.prog.filter(function(p){return p.last>=mid}).length;
  var week=CT.data.misses.filter(function(m){return m.at>=now-7*CT.DAY}).length;
  var solid=0,shaky=0;CT.data.notes.forEach(function(n){if(n.conf===3)solid++;if(n.conf===1)shaky++});
  return {due:due,fresh:fresh,today:today,week:week,solid:solid,shaky:shaky,opened:CT.data.notes.length};
};

/* practice sessions */
CT.buildQueue=function(f,anyway){
  var cat=CT.catalog().filter(function(x){
    if(f.t!=='all'&&f.t!==x.k)return false;
    if(f.d!=='all'&&(x.sub||[]).indexOf(f.d)<0)return false;
    if(f.s!=='all'&&x.sys!==f.s)return false;
    return true;
  });
  var due=cat.filter(function(x){return CT.isDue(x.id)}).sort(function(a,b){return CT.pmap[a.id].due-CT.pmap[b.id].due});
  var fresh=CT.shuffle(cat.filter(function(x){return CT.isNew(x.id)})).slice(0,8);
  /* about eight per session: up to 8 due items first, then new ones; a backlog still leaves room for 2 new (t06-31) */
  var list=due.slice(0,8);list=list.concat(fresh.slice(0,Math.max(due.length?2:8,8-list.length)));
  if(anyway)list=CT.shuffle(cat).slice(0,8);
  return list.map(function(x){return {k:x.k,id:x.id}});
};
CT.startSession=function(f,anyway){
  CT.ps={f:f,queue:CT.buildQueue(f,anyway),i:0,done:0,cur:null,anyway:!!anyway};
  CT.openCurrent();
};
CT.itemOf=function(e){
  var x=null;
  if(e.k==='image'){x=CT.data.images.find(function(i){return i.id===e.id});return x?{k:'image',id:x.id,o:x,sys:x.system,sub:[x.discipline],c:[]}:null}
  var arr=e.k==='chain'?B.CH:e.k==='predict'?B.PT:B.CP;
  x=arr.find(function(i){return i.id===e.id});
  return x?{k:e.k,id:x.id,o:x,sys:x.sys,sub:x.sub,c:x.c}:null;
};
CT.current=function(){
  var ps=CT.ps;if(!ps)return null;
  while(ps.i<ps.queue.length){var it=CT.itemOf(ps.queue[ps.i]);if(it)return it;ps.i++}
  return null;
};
CT.openCurrent=function(){
  var ps=CT.ps,it=CT.current();ps.cur=null;if(!it)return;
  var o=it.o;
  if(it.k==='chain'){
    var idx=[];for(var i=1;i<o.steps.length;i++)idx.push(i);
    var sh=CT.shuffle(idx);if(sh.length>1&&sh.every(function(v,j){return v===idx[j]}))sh=sh.reverse();
    ps.cur={pool:sh,placed:[],checked:false,wrong:0};
  }else if(it.k==='predict'){ps.cur={sel:o.p.map(function(){return null}),checked:false,right:0}}
  else if(it.k==='compare'){
    var cells=[];o.rows.forEach(function(r,ri){var vals=r.slice(1);var uniq=vals.filter(function(v,j){return vals.indexOf(v)===j});if(uniq.length>1)vals.forEach(function(v,ci){cells.push([ri,ci])})});
    ps.cur={qs:CT.shuffle(cells).slice(0,5),i:0,picked:null,ok:0,done:false};
  }else{ps.cur={shown:false}}
};
CT.advance=function(){var ps=CT.ps;ps.i++;ps.done++;CT.openCurrent();CT.render()};

/* Citrus Maxima hub status: status.json in Bassiet's folder (Citrus/Learning/Medicine/Step 1 - Bassiet, formerly My Apps/hub/bassiet) */
/* Includes the dive (t07-23, t10-19): fading stains count as due, and the next stratum or boss is named.
   app-dive.js exposes CT.dive.fadingCount() and CT.dive.next() (D05); without them only Practice is counted. */
function diveInfo(){
  var dv=CT.dive||{},fd=0,nx=null,txt='';
  try{fd=typeof dv.fadingCount==='function'?+dv.fadingCount()||0:typeof dv.fading==='function'?(dv.fading()||[]).length:0}catch(e){fd=0}
  try{nx=typeof dv.next==='function'?dv.next():null}catch(e){nx=null}
  if(nx&&nx.k==='ch'&&nx.name)txt='stain '+nx.name;
  else if(nx&&nx.k==='boss'&&nx.d&&nx.d.boss)txt='duel '+nx.d.boss.name;
  return {fd:fd,next:txt};
}
CT.statusJSON=function(){
  var c=CT.counts(),dv=diveInfo(),due=c.due+dv.fd,mins=Math.min(45,Math.round(c.due*1.5+dv.fd*3)),today=CT.ymd();
  var title='Bassiet: '+due+' item'+(due===1?'':'s');
  var nextDue='done';
  if(due>0)nextDue='now';
  else{var fut=CT.data.prog.map(function(p){return p.due||0}).concat(CT.data.reads.map(function(r){return r.done&&r.due||0})).filter(function(d){return d>Date.now()}).sort(function(a,b){return a-b})[0];if(fut)nextDue=CT.ymd(fut)===CT.ymd(Date.now()+CT.DAY)?'tomorrow':CT.ymd(fut)}
  var sum=c.due+' item'+(c.due===1?'':'s')+' to revisit'+(dv.fd?', '+dv.fd+' stain'+(dv.fd===1?'':'s')+' fading':'')+' (about '+mins+' min); '+c.today+' done today'+(dv.next?'; next: '+dv.next:'')+'.';
  var asks=[];
  if(due>0)asks.push({date:today,title:title,minutes:mins,slot:'free'});
  else if(dv.next)asks.push({date:today,title:'Bassiet: '+dv.next,minutes:20,slot:'free'});
  return {
    app:'bassiet',title:'Bassiet',icon:'🧬',color:'#F28A1B',url:CT.APP_URL,version:'1.1.0',
    updatedAt:new Date().toISOString(),
    summary:sum,
    due:due,estimatedMinutes:mins,streak:CT.streak(),nextDue:nextDue,
    today:{date:today,done:c.today>0,items:[]},
    next:{title:dv.next?'Bassiet: '+dv.next:title,minutes:dv.next&&!due?20:mins},
    asks:asks,
    pending:c.shaky?[c.shaky+' concept'+(c.shaky===1?'':'s')+' marked shaky']:[],
    drive:{byTag:true,method:'folder-id',note:'The Drive connector cannot read appProperties; Bassiet finds its folders by Drive id (stable across moves), then by the new layout name, then the old path. It never creates, renames or moves folders.'},
    extra:{concepts:B.C.length,opened:c.opened,solid:c.solid,shaky:c.shaky,missesThisWeek:c.week,newItems:c.fresh,practiceDue:c.due,fadingStains:dv.fd,nextDive:dv.next}
  };
};
/* Drive folders (claude/drive-layout.md, 17/11/2026). The claude.ai Drive connector cannot read or query
   appProperties, so Bassiet cannot look up citrusApp tags itself. It follows the same rule another way:
   a folder is found by its Drive id, which survives Citrus's moves and renames; the id is cached in
   reads/drive. Only when the id is gone does it search by name: the new layout first, then the old path.
   Bassiet never creates, renames or moves a folder. */
CT.DRIVE={
  bassiet:{seed:CT.HUB_FOLDER,paths:[['Step 1 - Bassiet'],['My Apps','hub','bassiet']]},
  'yuzu-inbox':{seed:'',paths:[['Flashcards - Yuzu','collection & media','collection','inbox'],['collection & media','collection','inbox'],['My Apps','Yuzu','collection','inbox'],['Yuzu','collection','inbox']]}
};
function driveDoc(){var r=(CT.data.reads||[]).find(function(x){return x.id==='drive'})||{};return Object.assign({},r.ids||{})}
CT.driveCall=async function(tool,args,retry){
  try{return await CT.mcp.callTool('Google Drive',tool,args,{cache:false})}
  catch(e){if(retry!==false&&e&&e.retryable){await wait(Math.min(5000,e.retryAfterMs||(600+Math.random()*600)));return await CT.mcp.callTool('Google Drive',tool,args,{cache:false})}throw e}
};
async function driveFolders(name,parents){
  var r=await CT.driveCall('search_files',{query:"title = '"+name.replace(/'/g,"\\'")+"' and mimeType = 'application/vnd.google-apps.folder' and trashed = false",excludeContentSnippets:true,pageSize:50});
  var f=((r&&r.payload&&r.payload.files)||[]).filter(function(x){return x&&x.id&&!x.trashed});
  if(parents)f=f.filter(function(x){return parents.indexOf(x.parentId)>=0});
  return f.sort(function(a,b){return String(a.createdTime||'').localeCompare(String(b.createdTime||''))});
}
/* Resolve a folder id. A cached id is trusted until a write into it fails (then call with fresh=true). */
CT.driveFolder=async function(key,fresh){
  var spec=CT.DRIVE[key];if(!spec)throw {code:'unknown_folder'};
  var ids=driveDoc();
  if(!fresh&&ids[key])return ids[key];
  if(!fresh&&spec.seed)return spec.seed;
  for(var i=0;i<spec.paths.length;i++){
    var path=spec.paths[i],par=null,hit=null;
    for(var j=0;j<path.length;j++){
      var f=await driveFolders(path[j],par);
      if(!f.length){hit=null;break}
      if(j===path.length-1)hit=f[0];else par=f.map(function(x){return x.id});
    }
    if(hit){ids[key]=hit.id;CT.setDoc('reads','drive',{ids:ids,at:Date.now()});return hit.id}
  }
  throw {code:'no_folder',key:key};
};
CT.driveForget=function(key){var ids=driveDoc();if(!ids[key])return;delete ids[key];CT.setDoc('reads','drive',{ids:ids,at:Date.now()})};
function goneErr(e){var c=e&&e.code;return c==='not_found'||c==='invalid_argument'||c==='permission_denied'||c==='failed_precondition'}

/* The Drive connector's update_file changes metadata only, so the status is replaced: create the new
   file first, then trash every older copy (never leaves zero files). Read-only searches are retried
   once when the error says so; an ambiguous create failure says Drive may have saved it (t10-35). */
CT.tellCitrus=async function(){
  var h=CT.ui.hub;if(h.busy)return;
  if(!CT.mcp){h.msg='Google Drive is not available in this view. Open the page in Claude with the Drive connector turned on.';CT.render();return}
  h.busy=true;h.msg='Sending…';CT.render();
  var S='Google Drive',F=null,stage='find';
  function call(tool,args){return CT.mcp.callTool(S,tool,args,{cache:false})}
  async function search(){
    var args={query:"parentId = '"+F+"' and title = 'status.json' and trashed = false",excludeContentSnippets:true,pageSize:20};
    try{return await call('search_files',args)}catch(e){
      if(e&&e.retryable){await wait(Math.min(60000,e.retryAfterMs||(600+Math.random()*600)));return await call('search_files',args)}
      throw e;
    }
  }
  async function once(fresh){
    F=await CT.driveFolder('bassiet',fresh);stage='search';
    var s=await search();
    var old=((s&&s.payload&&s.payload.files)||[]).filter(function(f){return f&&f.title==='status.json'&&f.parentId===F&&f.id}).map(function(f){return f.id});
    stage='create';
    await call('create_file',{title:'status.json',parentId:F,textContent:JSON.stringify(CT.statusJSON(),null,2),contentMimeType:'application/json',disableConversionToGoogleType:true});
    stage='trash';
    for(var i=0;i<old.length;i++){try{await call('trash_file',{fileId:old[i]})}catch(e){}}
  }
  try{
    try{await once(false)}
    catch(e){if(goneErr(e)&&stage!=='trash'){CT.driveForget('bassiet');stage='find';await once(true)}else throw e}
    h.last=Date.now();h.msg='Citrus Maxima can now see your status.';
  }catch(e){
    var code=e&&e.code;
    h.msg=code==='no_folder'?'Could not find the Bassiet folder in Drive (Citrus/…/Step 1 - Bassiet or My Apps/hub/bassiet). Open Citrus once so it can set the folder up, then try again.':
      code==='approval_required'||code==='not_in_manifest'||code==='consent_required'?'Allow Google Drive for this page to update Citrus.':
      code==='server_not_connected'?'Add Google Drive in claude.ai Settings, Connectors, then try again.':
      code==='needs_reauth'?'Reconnect Google Drive in claude.ai Settings, Connectors, then try again.':
      code==='selection_required'?'Choose which Google Drive to use when Claude asks, then try again.':
      code==='blocked_by_policy'?'Your organisation does not allow Google Drive here.':
      stage==='create'&&(code==='server_unavailable'||code==='upstream_error'||code==='tool_error'||code==='cancelled'||!code)?'Drive did not answer clearly, so it may have saved the status. Check the Bassiet folder in Drive before sending again.':
      code==='server_unavailable'?'Google Drive is not answering right now. Try again in a minute.':
      'Citrus was not updated. Try again.';
  }
  h.busy=false;CT.render();
};
})();
