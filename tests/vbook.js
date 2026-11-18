global.window=global;global.CT={};
const fs=require('fs');const dir=require('path').resolve(process.argv[2]||require('path').resolve(__dirname,'../app'));
const order=[...fs.readFileSync(dir+'/index.html','utf8').matchAll(/<script src="([^"]+)"/g)].map(m=>m[1]);
for(const f of order.filter(f=>/^(bank.*|book.*|depths|story|links)\.js$/.test(f)))if(fs.existsSync(dir+'/'+f))eval(fs.readFileSync(dir+'/'+f,'utf8'));
let ok=true,ch=0,qs=0,figs=new Set(),words=0;
const known=new Set(fs.readdirSync(dir).filter(f=>/^figs/.test(f)).flatMap(f=>[...fs.readFileSync(dir+'/'+f,'utf8').matchAll(/F\.(\w+)=\{/g)].map(m=>m[1])));
DEPTHS.forEach(d=>d.strata.forEach(s=>{const id=s.ch||('c'+d.n+'-'+s.id);const b=BOOK[id];if(!b){return}
 ch++;if(b.depth!==d.n){console.log('depth mismatch',id);ok=false}
 b.S.forEach(x=>{(x.p||[]).forEach(p=>words+=p.split(/\s+/).length);(x.s||[]).forEach(y=>{if(!['path','micro','pharm','bio','phys'].includes(y[0])){console.log('bad stain',id,y[0]);ok=false}});if(x.fig){figs.add(x.fig);if(!known.has(x.fig)){console.log('missing fig',id,x.fig);ok=false}}if(x.table)x.table.rows.forEach(r=>{if(r.length!==x.table.cols.length){console.log('table cols',id,x.h);ok=false}})});
 b.Q.forEach((q,i)=>{qs++;if(!(q.a>=0&&q.a<q.o.length)){console.log('bad answer',id,i);ok=false}});
}));
Object.keys(BOOK).forEach(id=>{const m=/^c(\d+)-(.+)$/.exec(id);const d=DEPTHS[+m[1]-1];if(!d.strata.some(s=>(s.ch||('c'+d.n+'-'+s.id))===id)){console.log('orphan',id);ok=false}});
STORY.T.forEach(t=>{const m=/^ch:(.+)$/.exec(t.at);if(m&&!DEPTHS.some(d=>d.strata.some(s=>(s.ch||('c'+d.n+'-'+s.id))===m[1])))console.log('story trigger to unknown chapter',m[1])});
console.log('chapters',ch,'questions',qs,'figs',[...figs].join(','),'words',words,ok?'OK':'PROBLEMS');
