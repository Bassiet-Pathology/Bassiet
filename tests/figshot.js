const __APP=process.env.APP_DIR||require('path').resolve(__dirname,'../docs');
const {chromium}=require('playwright');const O=__dirname+'/out/';
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:900,height:900}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+__APP+'/index.html');await p.waitForTimeout(400);
const ids=process.argv.slice(2);
await p.evaluate(ids=>{document.getElementById('main').innerHTML='<div class="reader">'+ids.map(i=>CT.figHTML(i)).join('')+'</div>'},ids);
for(const id of ids){const v=await p.evaluate(id=>JSON.stringify(Object.keys(FIG[id].def)),id);}
await p.screenshot({path:O+'figs.png',fullPage:true});console.log('ERRS',errs);await b.close()})();
