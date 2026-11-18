/* Bassiet service worker.
   - Install: precache the shell (./ and index.html) and every app file in FILES. One missing file does not
     abort the install (new files may not be published yet); whatever loads is cached.
   - Pages and app files: network first, with a 3.5 s limit when a cached copy exists, then the cache.
     Network first keeps every file of a release together (no mix of old and new scripts).
   - Plates (/_blob/<id>, immutable): cache first, at most 150 kept.
   - Google Fonts: cache first in their own cache, so headings keep their face offline after one online visit.
   FILES and V are regenerated from the folder by beta/work-D02/gen-sw.js; V changes whenever any file does. */
const V='bassiet-01bb2ca916';
const FILES=["app-core.js","app-dive.js","app-practice.js","app-today.js","bank1.js","bank2.js","bank3.js","bank4.js","bank5.js","bank6a.js","bank6b.js","bank6c.js","bank7.js","bank8.js","bank9.js","book10.js","book11.js","book12.js","book13.js","book14.js","book15.js","book16a.js","book16b.js","book1a.js","book1b.js","book2.js","book3.js","book4.js","book5a.js","book5b.js","book6.js","book7.js","book8a.js","book8b.js","book9a.js","book9b.js","bookx1.js","bookx2.js","d02-maskable-512.png","depths.js","figs.js","figs2.js","figs3.js","figs4.js","figs5.js","figs6.js","figs7.js","icon-180.png","icon-192.png","icon-512.png","links.js","manifest.json","story.js"];
const SHELL=['./','index.html'];
const FONTS='bassiet-fonts',BLOBS='bassiet-blobs',KEEP=[V,FONTS,BLOBS],WAIT=3500;

self.addEventListener('install',e=>{
  self.skipWaiting();
  e.waitUntil(caches.open(V).then(c=>Promise.all(SHELL.concat(FILES).map(f=>
    fetch(new Request(f,{cache:'reload'})).then(r=>{if(r.ok&&!r.redirected)return c.put(f,r)}).catch(()=>{})))));
});
self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>KEEP.indexOf(x)<0).map(x=>caches.delete(x)))).then(()=>self.clients.claim()));
});

function netFirst(req,keys){
  return caches.open(V).then(c=>keys.reduce((p,k)=>p.then(h=>h||c.match(k,{ignoreSearch:true})),Promise.resolve(null)).then(hit=>new Promise(res=>{
    let done=false;const end=r=>{if(!done){done=true;clearTimeout(t);res(r)}};
    const t=hit?setTimeout(()=>end(hit),WAIT):0;
    fetch(req).then(r=>{if(r.ok&&!r.redirected)c.put(keys[0],r.clone()).catch(()=>{});end(r.ok||!hit?r:hit)}).catch(()=>end(hit||Response.error()));
  })));
}
function cacheFirst(name,req,limit){
  return caches.open(name).then(c=>c.match(req).then(hit=>hit||fetch(req).then(r=>{
    if(r.ok||r.type==='opaque'){c.put(req,r.clone()).then(()=>limit&&c.keys().then(k=>{if(k.length>limit)return Promise.all(k.slice(0,k.length-limit).map(x=>c.delete(x)))})).catch(()=>{})}
    return r;
  })));
}

self.addEventListener('fetch',e=>{
  const r=e.request;if(r.method!=='GET')return;
  const u=new URL(r.url);
  if(u.hostname==='fonts.googleapis.com'||u.hostname==='fonts.gstatic.com'){e.respondWith(cacheFirst(FONTS,r).catch(()=>fetch(r)));return}
  if(u.origin!==location.origin)return;
  if(r.mode==='navigate'){e.respondWith(netFirst(r,['./','index.html']));return}
  if(u.pathname.indexOf('/_blob/')>=0){e.respondWith(cacheFirst(BLOBS,r,150).catch(()=>fetch(r)));return}
  const name=u.pathname.split('/').pop();
  if(FILES.indexOf(name)>=0||name==='index.html'){e.respondWith(netFirst(r,[name]));return}
});
