// Regenerates the FILES list and version in sw.js from the app folder.
// Usage: node tools/gen-sw.js [docs]
// Run it after the last file change of a release: V becomes a hash of every shipped file,
// so any content change installs a fresh cache on the next visit.
const fs=require('fs'),path=require('path'),crypto=require('crypto');
const dir=process.argv[2]||path.resolve(__dirname,'../docs');
const EXPECT=['bookx1.js','bookx2.js','bank9.js','figs7.js'];   // new files of this round (added even before they exist)
const skip=new Set(['sw.js']);
let files=fs.readdirSync(dir).filter(f=>/\.(js|png|json|webp|svg|woff2|css)$/.test(f)&&!skip.has(f)&&!/^d\d\d-.*\.js$/i.test(f)).sort();
EXPECT.forEach(f=>{if(!files.includes(f))files.push(f)});
if(fs.existsSync(path.join(dir,'web')))fs.readdirSync(path.join(dir,'web')).filter(f=>/\.js$/.test(f)).sort().forEach(f=>files.push('web/'+f));   // website mode
const h=crypto.createHash('sha256');
files.concat(['index.html']).forEach(f=>{const p=path.join(dir,f);if(fs.existsSync(p))h.update(f+'\0').update(fs.readFileSync(p))});
const V='bassiet-'+h.digest('hex').slice(0,10);
const swp=path.join(dir,'sw.js');let sw=fs.readFileSync(swp,'utf8');
sw=sw.replace(/^const V='[^']*';/m,`const V='${V}';`).replace(/^const FILES=\[[^\]]*\];/m,'const FILES='+JSON.stringify(files)+';');
fs.writeFileSync(swp,sw);
console.log(V,files.length+' files');
