// Injected before page scripts: a fake window.claude with an async db (snapshot after write latency).
module.exports=function(cfg){
  return `(function(){
  var CFG=${JSON.stringify(cfg)};
  var store=CFG.seed||{};// {coll:{id:obj}}
  var L={};// coll -> [fn]
  window.__store=store;window.__writes=[];window.__renders=0;
  function snap(coll){var o=store[coll]||{};var docs=Object.keys(o).sort().map(function(id){var d=o[id];return {id:id,exists:true,data:function(){return JSON.parse(JSON.stringify(d))},metadata:{fromCache:false,hasPendingWrites:false}}});return {docs:docs,size:docs.length,empty:!docs.length,docChanges:function(){return []},metadata:{fromCache:false,hasPendingWrites:false}}}
  function notify(coll){setTimeout(function(){(L[coll]||[]).forEach(function(f){f(snap(coll))})},CFG.snapDelay||0)}
  var db={collection:function(coll){return {
    onSnapshot:function(next,err){(L[coll]=L[coll]||[]).push(next);window.__subs=(window.__subs||0)+1;
      if(CFG.snapErr&&CFG.snapErr[coll]){setTimeout(function(){err&&err({code:CFG.snapErr[coll],message:'x'})},CFG.firstSnap||100)}
      else if(!(CFG.never&&CFG.never.indexOf(coll)>=0))setTimeout(function(){next(snap(coll))},CFG.firstSnap||100);return function(){}},
    doc:function(id){return {
      set:function(obj){return new Promise(function(res,rej){setTimeout(function(){
        window.__writes.push([coll,id,JSON.parse(JSON.stringify(obj))]);
        if(CFG.failSet){rej({code:CFG.failSet,message:'fail'});return}
        (store[coll]=store[coll]||{})[id]=JSON.parse(JSON.stringify(obj));notify(coll);res()},CFG.writeDelay||60)})},
      delete:function(){return new Promise(function(res,rej){setTimeout(function(){if(CFG.failDel){rej({code:CFG.failDel});return}if(store[coll])delete store[coll][id];notify(coll);res()},CFG.writeDelay||60)})}
    }}}}};
  var assets={upload:function(b,o){return new Promise(function(res,rej){setTimeout(function(){if(CFG.uploadFail)rej({code:CFG.uploadFail,message:'x'});else res({id:'a'.repeat(32),url:'/_blob/'+'a'.repeat(32),sizeBytes:b.size,contentType:b.type})},50)})},delete:function(id){window.__assetDeleted=(window.__assetDeleted||[]).concat([id]);return Promise.resolve({deleted:true})},list:function(){return Promise.resolve({assets:[],usage:{}})}};
  var D=CFG.useDelay||{};
  window.claude={use:function(n){var v=n==='db'?db:n==='assets'&&CFG.assets?assets:null;window.__useCalls=(window.__useCalls||[]).concat([[n,performance.now()]]);return new Promise(function(r){setTimeout(function(){r(v)},D[n]||20)})}};
})();`;
};
