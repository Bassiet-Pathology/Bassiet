/* Bassiet website mode (GitHub Pages or localhost): stand in for the claude.ai runtime before the app starts.
   Inside claude.ai (the artifact) nothing here runs and Claude's own storage is used. */
(function(){
  var h=location.hostname,web=/\.github\.io$/.test(h)||h==='localhost'||h==='127.0.0.1'||/[?&]web=1\b/.test(location.search);
  if(!web||(window.claude&&typeof window.claude.use==='function'))return;
  window.BASSIET_WEB=true;
  var mod=null;
  function load(){return mod||(mod=import(new URL('web/shim.js',document.baseURI).href))}
  window.claude={use:function(n){return load().then(function(m){return m.use(n)})}};
})();
