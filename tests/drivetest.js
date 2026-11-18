const __APP=process.env.APP_DIR||require('path').resolve(__dirname,'../docs');
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+__APP+'/index.html');await p.waitForTimeout(3000);
const r=await p.evaluate(async()=>{
 function mk(files,goneSeed){const log=[];return {log,callTool:async(S,tool,a)=>{log.push(tool+' '+JSON.stringify(a).slice(0,120));
  if(tool==='search_files'){let m=/title = '([^']+)'/.exec(a.query),pm=/parentId = '([^']+)'/.exec(a.query);let f=files.filter(x=>(!m||x.title===m[1])&&(!pm||x.parentId===pm[1]));return {payload:{files:f}}}
  if(tool==='create_file'){if(!files.some(x=>x.id===a.parentId)||(goneSeed&&a.parentId===goneSeed))throw {code:'not_found'};files.push({id:'n'+files.length,title:a.title,parentId:a.parentId});return {payload:{}}}
  if(tool==='trash_file')return {payload:{}};}}}
 const out={};
 // 1: seed id works
 let F=[{id:CT.HUB_FOLDER,title:'bassiet',parentId:'hub'}];CT.mcp=mk(F);await CT.tellCitrus();out.c1=[CT.ui.hub.msg,F.filter(x=>x.title==='status.json').map(x=>x.parentId)];
 // 2: moved+renamed, seed id gone
 CT.driveForget('bassiet');F=[{id:'L',title:'Medicine',parentId:'X'},{id:'NEW',title:'Step 1 - Bassiet',parentId:'L',createdTime:'2026-11-17'}];CT.mcp=mk(F,CT.HUB_FOLDER);CT.ui.hub.busy=false;await CT.tellCitrus();
 out.c2=[CT.ui.hub.msg,F.filter(x=>x.title==='status.json').map(x=>x.parentId),JSON.stringify((CT.data.reads.find(x=>x.id==='drive')||{}).ids)];
 // 3: yuzu inbox in new layout
 F=[{id:'FY',title:'Flashcards - Yuzu',parentId:'L'},{id:'CM',title:'collection & media',parentId:'FY'},{id:'CO',title:'collection',parentId:'CM'},{id:'IB',title:'inbox',parentId:'CO'},{id:'IB2',title:'inbox',parentId:'other'}];
 CT.mcp=mk(F);out.y=await CT.driveFolder('yuzu-inbox',true);
 out.status=CT.statusJSON().drive;return out});
console.log(JSON.stringify(r,null,1));console.log('ERRS',errs);await b.close()})();
