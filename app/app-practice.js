/* Bassiet: Practice (Trace, Predict, Compare, Plates mode), Plates (own images) and Hull (miss log). */
(function(){
'use strict';
var CT=window.CT,B=CT.B,esc=CT.esc,D=CT.D,DN=CT.DN,SYS=CT.SYS,A=CT.actions;
var SESSION=8;CT.SESSION=SESSION;
CT.ui.file=null;CT.ui.imgAsset=null;CT.ui.cmpOrd=CT.ui.cmpOrd||{};CT.ui.hullN=60;CT.ui.hullQ='';
CT.KIND.image='Plate';
var ARROW={u:'↑',d:'↓',n:'→'},ARROWN={u:'increases',d:'decreases',n:'no change'},ARROWV={u:'rises',d:'falls',n:'does not change'};
var DSHORT={path:'Path',micro:'Micro',pharm:'Pharm',bio:'Bio',phys:'Phys'};
var VHS=' class="vh" style="position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap;border:0"';
function vh(t){return '<span'+VHS+'>'+esc(t)+'</span>'}
function cname(id){return CT.concepts[id]?CT.concepts[id].n:id}
function failed(ok){return ok===false}
function errToast(m){CT.toast(m,'err')}
function narrow(){return !!(window.matchMedia&&window.matchMedia('(max-width:599px)').matches)}
function cLinks(ids){
  ids=(ids||[]).filter(function(id){return CT.concepts[id]});
  if(!ids.length)return '';
  return '<p class="muted" style="margin:12px 0 0;font-size:14px">Related: '+ids.map(function(id){return '<button class="linkbtn" data-act="openConcept" data-id="'+esc(id)+'">'+esc(cname(id))+'</button>'}).join(', ')+'</p>';
}
/* focus that survives the re-render (keyboard and screen-reader users keep their place) */
function focusSoon(sel){
  function f(){var el=typeof sel==='function'?sel():document.querySelector(sel);if(el&&document.activeElement!==el){try{el.focus({preventScroll:true})}catch(e){try{el.focus()}catch(x){}}}}
  f();if(window.requestAnimationFrame)requestAnimationFrame(f);
}
function stageIntoView(){
  var st=document.querySelector('#main .stage');if(!st)return;
  var r=st.getBoundingClientRect();
  if(r.top<0||r.top>window.innerHeight*.6)window.scrollTo(0,Math.max(0,r.top+window.scrollY-88));
}

/* ---------- world dressing: slim pixel banner (the console strip above it comes from app-today.js) ---------- */
var MOT={
  bolt:['....###','...###.','..###..','.######','...###.','..###..','.##....','#......'],
  cell:['..####..','.#....#.','#..##..#','#.####.#','#..##..#','.#....#.','..####..'],
  shield:['#######','#.....#','#.#.#.#','#..#..#','.#...#.','..#.#..','...#...']};
function motif(b,x,y,s){var o='';b.forEach(function(r,i){for(var j=0;j<r.length;j++)if(r[j]==='#')o+='<rect x="'+(x+j*s)+'" y="'+(y+i*s)+'" width="'+s+'" height="'+s+'" class="mh"/>'});return o}
function banner(kind,hue,seed,label,title){
  var W=960,H=96,s=seed*9301+49297,o;
  function r(){s=(s*9301+49297)%233280;return s/233280}
  o='<div class="banner slim"><svg class="scene" viewBox="0 0 '+W+' '+H+'" preserveAspectRatio="xMaxYMid slice" aria-hidden="true" style="--h:'+hue+'">';
  o+='<defs><radialGradient id="pb-'+kind+'" cx="90%" cy="50%" r="45%"><stop offset="0" stop-color="var(--accent)" stop-opacity=".2"/><stop offset="1" stop-color="var(--accent)" stop-opacity="0"/></radialGradient></defs>';
  o+='<rect width="'+W+'" height="'+H+'" class="sbg"/><rect width="'+W+'" height="'+H+'" fill="url(#pb-'+kind+')"/>';
  [['s1',4],['s2',6]].forEach(function(L){var x=0;while(x<W){var w=8*(1+Math.floor(r()*3)),top=Math.floor(r()*L[1])*8,bot=Math.floor(r()*L[1])*8;o+='<rect x="'+x+'" y="0" width="'+w+'" height="'+top+'" class="'+L[0]+'"/><rect x="'+x+'" y="'+(H-bot)+'" width="'+w+'" height="'+bot+'" class="'+L[0]+'"/>';x+=w}});
  o+=motif(MOT[kind],W-120,H/2-36,9);
  for(var i=0;i<20;i++)o+='<rect x="'+Math.floor(r()*W)+'" y="'+Math.floor(r()*H)+'" width="'+(2+Math.floor(r()*3))+'" height="'+(2+Math.floor(r()*3))+'" class="pall"/>';
  return o+'</svg><div class="bt"><span class="mono">'+esc(label)+'</span><h1>'+esc(title)+'</h1></div></div>';
}

/* delete with a second tap; no full re-render, so a half-typed note keeps its focus and keyboard */
var confirmT=0;
function confirmBtn(key,label,act,id){
  var on=CT.ui.confirm===key;
  return '<button class="btn small danger" data-act="'+act+'" data-id="'+esc(id)+'" data-key="'+esc(key)+'" data-label="'+esc(label)+'">'+(on?'Tap again to delete':esc(label))+'</button>';
}
function keyBtn(k){
  var all=document.querySelectorAll('[data-key]');
  for(var i=0;i<all.length;i++)if(all[i].getAttribute('data-key')===k)return all[i];
  return null;
}
function setConfirm(k){
  var old=CT.ui.confirm;CT.ui.confirm=k;
  var ob=old&&keyBtn(old);if(ob)ob.textContent=ob.getAttribute('data-label')||'Delete';
  var nb=k&&keyBtn(k);if(nb)nb.textContent='Tap again to delete';
}
function confirmStep(el){
  var k=el.getAttribute('data-key');
  clearTimeout(confirmT);
  if(CT.ui.confirm!==k){setConfirm(k);confirmT=setTimeout(function(){if(CT.ui.confirm===k)setConfirm(null)},4000);return false}
  CT.ui.confirm=null;return true;
}

/* ---------- sessions: queue size, compare cells, session log ---------- */
function filtered(f){
  return CT.catalog().filter(function(x){
    if(f.t!=='all'&&f.t!==x.k)return false;
    if(f.d!=='all'&&(x.sub||[]).indexOf(f.d)<0)return false;
    if(f.s!=='all'&&x.sys!==f.s)return false;
    return true;
  });
}
/* Eight items at most: due ones first (oldest due first), topped up with new ones. With a backlog, 6 due + 2 new,
   so the backlog shrinks while new material still arrives (t06-31). Overrides the core version on purpose. */
CT.buildQueue=function(f,anyway){
  var cat=filtered(f);
  if(anyway)return CT.shuffle(cat).slice(0,SESSION).map(function(x){return {k:x.k,id:x.id}});
  var due=cat.filter(function(x){return CT.isDue(x.id)}).sort(function(a,b){return CT.pmap[a.id].due-CT.pmap[b.id].due});
  var fresh=CT.shuffle(cat.filter(function(x){return CT.isNew(x.id)}));
  var nNew=Math.min(fresh.length,due.length>=SESSION?2:SESSION-due.length);   /* a backlog still leaves room for 2 new */
  var list=due.slice(0,SESSION-nNew).concat(fresh.slice(0,nNew));
  return list.map(function(x){return {k:x.k,id:x.id}});
};
function uniqVals(row){var v=row.slice(1);return v.filter(function(x,j){return v.indexOf(x)===j&&x!=='—'&&x!=='-'&&x!==''})}
/* questions: one cell per row first (spread over the table), never a blank "—" cell */
function cmpCells(o){
  var byRow=[];
  o.rows.forEach(function(r,ri){
    if(uniqVals(r).length<2)return;
    var cs=[];r.slice(1).forEach(function(v,ci){if(v!=='—'&&v!=='-'&&v!=='')cs.push([ri,ci])});
    if(cs.length)byRow.push(CT.shuffle(cs));
  });
  byRow=CT.shuffle(byRow);
  var out=[],round=0,more=true;
  while(out.length<5&&more){more=false;byRow.forEach(function(cs){if(cs[round]&&out.length<5){out.push(cs[round]);more=true}});round++}
  return out;
}
var baseOpen=CT.openCurrent;
CT.openCurrent=function(){
  baseOpen.apply(this,arguments);
  var ps=CT.ps;if(!ps)return;
  if(!ps.sid)ps.sid=CT.newId();
  if(!ps.log)ps.log=[];
  var it=ps.cur&&CT.current();
  if(it&&it.k==='compare'){ps.cur.qs=cmpCells(it.o);ps.cur.missed=[];ps.cur.asked=[]}
};
/* a third option for two-value rows: the same row label in another table of the same system */
function distractors(o,label,have){
  var L=String(label).toLowerCase(),out=[];
  B.CP.forEach(function(t){
    if(t===o||t.sys!==o.sys)return;
    t.rows.forEach(function(r){if(String(r[0]).toLowerCase()!==L)return;uniqVals(r).forEach(function(v){if(have.indexOf(v)<0&&out.indexOf(v)<0)out.push(v)})});
  });
  return CT.shuffle(out);
}
/* shuffled option order, stable for this question in this session view (kept in CT.ui); scored by original index */
function cmpChoice(it,s){
  var ri=s.qs[s.i][0],ci=s.qs[s.i][1],row=it.o.rows[ri],ans=row[ci+1];
  var key=(CT.ps.sid||'')+'|'+it.id+'|'+ri+'|'+ci,c=CT.ui.cmpOrd[key];
  if(!c){
    var vals=uniqVals(row);
    if(vals.length<3)vals=vals.concat(distractors(it.o,row[0],vals).slice(0,3-vals.length));
    var ord=[];for(var k=0;k<vals.length;k++)ord.push(k);
    c=CT.ui.cmpOrd[key]={vals:vals,ord:CT.shuffle(ord),ans:vals.indexOf(ans)};
  }
  return c;
}
function logResult(it,ok,n,g,miss){
  var ps=CT.ps;if(!ps)return;if(!ps.log)ps.log=[];
  var nx=CT.schedule(CT.pmap[it.id],g);
  ps.log.push({k:it.k,id:it.id,t:it.k==='image'?it.o.answer:it.o.t,ok:ok,n:n,g:g,due:nx.due,c:(it.c||[]).filter(function(id){return CT.concepts[id]})[0]||(it.o&&it.o.concept)||'',miss:!!miss});
}
function grade(it,f,ok,n){var g=CT.gradeFromScore(f);logResult(it,ok,n,g,f<1);CT.record(it,g);return g}
function logMiss(it,source,reason,concept){
  var c=concept!=null?concept:((it.c||[])[0]||''),con=CT.concepts[c];
  return CT.setDoc('misses',CT.newId(),{concept:c,discipline:(it.sub||[])[0]||'',system:it.sys||(con?con.s:''),source:source,reason:reason,note:'',at:Date.now(),auto:true});
}

/* ---------- Practice ---------- */
function menu(){
  var f=CT.ui.pf,c=CT.counts(),ps=CT.ps;
  var h=banner('bolt','#C8783A',5,'TRAILS THROUGH THE HOST','Practice');
  h+='<p class="sub">Sessions of up to eight items. Anything due comes first, then new ones fill the set.</p>';
  h+='<div class="filters"><select class="sel" id="pf-d" aria-label="Subject">'+CT.discOpts(f.d,'All subjects')+'</select><select class="sel" id="pf-s" aria-label="System">'+CT.sysOpts(f.s,'All systems')+'</select></div>';
  var modes=[['all','Revisit mix','Up to eight due items, topped up with new ones.',c.due+' due'],
    ['chain','Trace','Put a mechanism in order from the first step.',B.CH.length+' chains'],
    ['predict','Predict','Say which values rise, fall or stay put.',B.PT.length+' scenarios'],
    ['compare','Compare','Pick the right value from side-by-side tables.',B.CP.length+' tables'],
    ['image','Plates','Test yourself on the slides and photos you mounted.',CT.data.images.length+' mounted']];
  h+='<div class="modes">'+modes.map(function(m){return '<button class="mode" data-act="startMode" data-t="'+m[0]+'"><span class="n">'+esc(m[3])+'</span><b>'+m[1]+'</b><span>'+m[2]+'</span></button>'}).join('')+'</div>';
  if(ps&&ps.queue&&!ps.queue.length){
    var t=ps.f&&ps.f.t,n=filtered(ps.f||f).length;
    if(t==='image'&&!CT.data.images.length)h+='<div class="empty" id="p-empty" tabindex="-1" style="margin-top:12px"><strong>No plates mounted yet.</strong> Add your own slides and photos in Plates, each with its answer. They appear here once saved.<div class="row" style="margin-top:10px"><button class="btn small" data-act="go" data-to="images">Open Plates</button></div></div>';
    else if(!n)h+='<div class="empty" id="p-empty" tabindex="-1" style="margin-top:12px"><strong>No items match these filters.</strong> Nothing in this mode is tagged with that subject and system yet. Widen a filter to see more.</div>';
    else h+='<div class="empty" id="p-empty" tabindex="-1" style="margin-top:12px"><strong>Nothing due here.</strong> All '+n+' item'+(n===1?'':'s')+' for these filters are scheduled for later. Practise anyway for a random set, or come back when they are due.</div>';
  }
  h+='<div class="row" style="margin-top:12px;align-items:center"><button class="btn small" data-act="startAnyway">Practise anyway</button><span class="muted" style="font-size:14px">A random set from the current filters, whether due or not.</span></div>';
  h+='<p class="keys">In a session: <span class="kbd">Enter</span> check or next · Trace <span class="kbd">1</span>–<span class="kbd">9</span> pick a step, <span class="kbd">Backspace</span> take back · Predict <span class="kbd">U</span> <span class="kbd">D</span> <span class="kbd">N</span> or <span class="kbd">↑</span> <span class="kbd">↓</span> for the focused row · Compare <span class="kbd">1</span>–<span class="kbd">4</span> choose · Plates <span class="kbd">1</span>–<span class="kbd">4</span> grade</p>';
  return h;
}
function when(t){
  var m=Math.round((t-Date.now())/60000);
  if(m<=1)return 'now';if(m<60)return 'in '+m+' minutes';
  var d=Math.round((t-Date.now())/CT.DAY);
  if(CT.ymd(t)===CT.ymd(Date.now()+CT.DAY))return 'tomorrow';
  if(d<1)return 'later today';
  return 'on '+CT.fmtDate(t);
}
function fromConcept(ps){
  var f=String(ps.from||'');if(f.indexOf('concept-')===0)f=f.slice(8);   /* app-today sets from: concept id */
  return f&&CT.concepts[f]?f:null;
}
/* "Practice this" on a concept page opens a one-item session: remember the page it came from */
window.addEventListener('hashchange',function(e){
  var ps=CT.ps,o=String(e.oldURL||''),i=o.indexOf('#');o=i>=0?o.slice(i+1):'';
  try{o=decodeURIComponent(o)}catch(x){}
  if(location.hash==='#practice'&&ps&&!ps.from&&ps.anyway&&ps.queue.length===1&&o.indexOf('concept-')===0)ps.from=o;
});
function finished(){
  var ps=CT.ps,log=ps.log||[],by={},order=['chain','predict','compare','image'],unit={chain:'links',predict:'rows',compare:'questions',image:'plates'};
  log.forEach(function(r){var b=by[r.k]=by[r.k]||{ok:0,n:0,items:0};b.ok+=r.ok;b.n+=r.n;b.items++});
  var h='<div class="stage"><div class="console" style="margin-bottom:10px"><span>TRAIL LOG</span><span>'+CT.fmtDate(Date.now())+'</span></div><h2 id="p-res" tabindex="-1" style="margin-top:0">Session complete</h2>';
  h+='<p>'+ps.done+' item'+(ps.done===1?'':'s')+' practised.'+(log.length?'':' Each one is scheduled to come back when it is due.')+'</p>';
  if(log.length){
    h+='<div class="ledger" style="margin:6px 0 4px">'+order.filter(function(k){return by[k]}).map(function(k){var b=by[k];return '<div><b>'+b.ok+'/'+b.n+'</b><span>'+esc(CT.KIND[k])+' · '+unit[k]+' right</span></div>'}).join('')+'</div>';
    var miss=log.filter(function(r){return r.miss});
    if(miss.length){
      h+='<h3 style="margin-bottom:6px">Come back to these</h3><ul class="rank">'+miss.map(function(r){
        return '<li><span><span class="chip">'+esc(CT.KIND[r.k])+'</span> '+(r.c?'<button class="linkbtn" data-act="openConcept" data-id="'+esc(r.c)+'">'+esc(r.t)+'</button>':esc(r.t))+'</span><span class="muted mono">'+r.ok+'/'+r.n+' · back '+esc(when(r.due))+'</span></li>';
      }).join('')+'</ul>';
    }else h+='<p class="muted">Nothing missed. The soonest of these comes back '+esc(when(Math.min.apply(null,log.map(function(r){return r.due}))))+'.</p>';
  }
  var fc=fromConcept(ps);
  h+='<div class="row" style="margin-top:14px">';
  if(fc)h+='<button class="btn primary" data-act="openConcept" data-id="'+esc(fc)+'">Back to '+esc(cname(fc))+'</button><button class="btn" data-act="endSession">Practice menu</button>';
  else h+='<button class="btn primary" data-act="startMode" data-t="'+esc(ps.f.t)+'">Another set</button><button class="btn" data-act="endSession">Practice menu</button>';
  return h+'<button class="btn" data-act="go" data-to="today">Dive</button></div></div>';
}
function head(it){
  var ps=CT.ps,n=ps.queue.length,pct=Math.round(ps.i/n*100);
  return '<div class="prog" role="progressbar" aria-label="Session progress" aria-valuenow="'+ps.i+'" aria-valuemin="0" aria-valuemax="'+n+'" style="max-width:none"><i style="width:'+pct+'%"></i></div>'+
    '<div class="row" style="margin-bottom:8px"><span class="chip acc">'+esc(CT.KIND[it.k])+'</span>'+(it.sys?'<span class="chip">'+esc(it.sys)+'</span>':'')+(it.sub||[]).filter(Boolean).map(function(s){return '<span class="chip d-'+esc(s)+'">'+esc(DN[s]||s)+'</span>'}).join('')+'<span class="muted mono" style="margin-left:auto">'+(ps.i+1)+' / '+n+'</span></div>';
}
function mark(ok,word){return '<span aria-hidden="true" style="margin-left:auto;padding-left:10px;font:700 12px var(--mono);letter-spacing:.08em;white-space:nowrap;color:var(--'+(ok?'good':'bad')+')">'+(ok?'✓':'✕')+(word?' '+esc(word):'')+'</span>'}
function chainView(it){
  var o=it.o,s=CT.ps.cur,wide=CT.wide();
  var h='<div class="stage"><div class="muted">Trace the mechanism</div><p class="q" tabindex="-1">'+esc(o.t)+'</p>';
  h+='<div class="step given"><span class="no">1</span><span>'+esc(o.steps[0])+'</span>'+vh('given first step')+'</div>';
  s.placed.forEach(function(idx,pos){
    if(!s.checked){
      h+='<button class="step" data-act="chainUnplace" data-pos="'+pos+'" aria-label="Step '+(pos+2)+': '+esc(o.steps[idx])+'. Take back this step'+(pos<s.placed.length-1?' and the ones after it':'')+'"><span class="no">'+(pos+2)+'</span><span>'+esc(o.steps[idx])+'</span><span aria-hidden="true" class="muted mono" style="margin-left:auto;padding-left:10px;font-size:11px;letter-spacing:.08em">↩</span></button>';
    }else{
      var ok=s.okPos?s.okPos[pos]:idx===pos+1;
      h+='<div class="step '+(ok?'ok':'no-ok')+'"'+(ok?'':' style="border-style:dashed"')+'><span class="no">'+(pos+2)+'</span><span>'+esc(o.steps[idx])+'</span>'+mark(ok,ok?'':'BELONGS AT '+(idx+1))+vh(ok?'in the right order':'out of place, belongs at step '+(idx+1))+'</div>';
    }
  });
  if(!s.checked){
    h+='<p class="muted" style="margin:14px 0 4px;font-size:14px">'+(s.pool.length?'Tap the step that comes next.'+(s.placed.length?' Tap a placed step to take it back.':''):'All placed. Check your order, or tap a step to take it back.')+'</p>';
    s.pool.forEach(function(idx,k){h+='<button class="step" data-act="chainPick" data-i="'+idx+'"><span class="no" aria-hidden="true">'+(wide&&k<9?'<span class="kbd">'+(k+1)+'</span>':'?')+'</span><span>'+esc(o.steps[idx])+'</span></button>'});
    h+='<div class="row" style="margin-top:12px">'+(s.pool.length?'':'<button class="btn primary" data-act="chainCheck">Check order</button>')+(s.placed.length?'<button class="btn" data-act="chainUndo">Undo last</button>':'')+'</div>';
  }else{
    var all=!s.wrong;
    h+='<p id="p-res" tabindex="-1" role="status" style="margin:14px 0 6px"><b>'+(all?'Correct order. Every link holds.':s.pairs+' of '+s.links+' links right · '+s.wrong+' step'+(s.wrong===1?'':'s')+' out of place.')+'</b></p>';
    if(!all){h+='<div class="muted" style="font-size:14px">Correct order:</div><ol style="margin:6px 0 0;padding-left:22px">'+o.steps.map(function(t){return '<li>'+esc(t)+'</li>'}).join('')+'</ol>'}
    if(o.pearl)h+='<div class="pearl"><b>Key point.</b> '+esc(o.pearl)+'</div>';
    h+=cLinks(o.c)+'<div class="row" style="margin-top:14px"><button class="btn primary" data-act="next">Next</button></div>';
  }
  return h+'</div>';
}
function predictView(it){
  var o=it.o,s=CT.ps.cur,h='<div class="stage"><div class="muted">Predict the change</div><p class="q" tabindex="-1">'+esc(o.t)+'</p><p>'+esc(o.d)+'</p><div style="margin-top:8px">';
  o.p.forEach(function(row,i){
    var sel=s.sel[i],right=row[1];
    h+='<div class="prow"><span>'+esc(row[0])+'</span><span class="arrows" role="group" aria-label="'+esc(row[0])+'">'+['u','d','n'].map(function(v){
      var cls='',lab=ARROWN[v];
      if(s.checked){if(v===right){cls='right';lab+=v===sel?', your answer, correct':', correct answer'}else if(v===sel){cls='wrong';lab+=', your answer, wrong'}}
      return '<button class="'+cls+'" data-act="predPick" data-i="'+i+'" data-v="'+v+'" aria-pressed="'+(sel===v)+'" aria-label="'+lab+'"'+(s.checked?' disabled':'')+'>'+ARROW[v]+'</button>';
    }).join('')+'</span>';
    if(s.checked){
      var ok=sel===right;
      h+='<span style="flex-basis:100%;font-size:14px;margin-top:-2px'+(ok?';color:var(--muted)':'')+'">'+mark(ok,'').replace('margin-left:auto;padding-left:10px;','margin-right:6px;')+(ok?esc(ARROWV[right].charAt(0).toUpperCase()+ARROWV[right].slice(1))+'.':'You said it '+esc(ARROWV[sel]||'—')+'; it '+esc(ARROWV[right])+'.'+(row[2]?' '+esc(row[2]):''))+'</span>';
    }
    h+='</div>';
  });
  h+='</div>';
  if(!s.checked){
    var ready=s.sel.every(function(v){return v});
    h+='<div class="row" style="margin-top:14px"><button class="btn primary" data-act="predCheck"'+(ready?'':' disabled')+'>Check</button>'+(ready?'':'<span class="muted" style="font-size:14px">Choose a direction for every row.</span>')+'</div>';
  }else{
    h+='<p id="p-res" tabindex="-1" role="status" style="margin:14px 0 6px"><b>'+s.right+' of '+o.p.length+' right.</b></p>';
    if(o.x)h+='<div class="pearl">'+esc(o.x)+'</div>';
    h+=cLinks(o.c)+'<div class="row" style="margin-top:14px"><button class="btn primary" data-act="next">Next</button></div>';
  }
  return h+'</div>';
}
function lowFirst(s){s=String(s);return /^[A-Z][a-z]/.test(s)?s.charAt(0).toLowerCase()+s.slice(1):s}
function askText(row,col){return '<span style="color:var(--accent-text)">'+esc(col)+'</span>: '+esc(lowFirst(row))+'?'}
function hasCell(list,ri,ci){return (list||[]).some(function(x){return x[0]===ri&&x[1]===ci})}
function cmpDone(it){
  var o=it.o,s=CT.ps.cur,h='<div class="stage"><div class="muted">'+esc(o.t)+'</div><p class="q" id="p-res" tabindex="-1" role="status">'+(s.qs.length?s.ok+' of '+s.qs.length+' right':'Study the table')+'</p>';
  function cell(v,ri,ci){
    var m=hasCell(s.missed,ri,ci),a=hasCell(s.asked,ri,ci);
    return {m:m,a:a,html:(a?'<span aria-hidden="true" style="font:700 12px var(--mono);color:var(--'+(m?'bad':'good')+')">'+(m?'✕ ':'✓ ')+'</span>'+vh(m?'you missed this: ':'you got this: '):'')+esc(v)};
  }
  if(narrow()){
    h+='<div style="display:grid;gap:10px;margin-top:12px">'+o.cols.map(function(c,ci){
      return '<div class="panel" style="padding:12px 14px"><h4 style="margin:0 0 6px">'+esc(c)+'</h4>'+o.rows.map(function(r,ri){var x=cell(r[ci+1],ri,ci);
        return '<div style="padding:6px 0;border-top:1px solid var(--line)'+(x.m?';box-shadow:inset 3px 0 0 var(--bad);padding-left:8px':'')+'"><div class="mono muted" style="font-size:11px;letter-spacing:.08em;text-transform:uppercase">'+esc(r[0])+'</div><div>'+x.html+'</div></div>'}).join('')+'</div>';
    }).join('')+'</div>';
  }else{
    h+='<div class="gridwrap" style="margin-top:12px"><table class="cov"><thead><tr><th class="rl"></th>'+o.cols.map(function(c){return '<th>'+esc(c)+'</th>'}).join('')+'</tr></thead><tbody>'+
      o.rows.map(function(r,ri){return '<tr><th class="rl" style="white-space:normal">'+esc(r[0])+'</th>'+r.slice(1).map(function(v,ci){var x=cell(v,ri,ci);return '<td style="padding:6px 8px;text-align:left'+(x.m?';outline:2px dashed var(--bad);outline-offset:-3px':'')+'">'+x.html+'</td>'}).join('')+'</tr>'}).join('')+'</tbody></table></div>';
  }
  return h+cLinks(o.c)+'<div class="row" style="margin-top:14px"><button class="btn primary" data-act="next">Next</button></div></div>';
}
function compareView(it){
  var o=it.o,s=CT.ps.cur;
  if(s.done||!s.qs.length)return cmpDone(it);
  var q=o.rows[s.qs[s.i][0]],ci=s.qs[s.i][1],c=cmpChoice(it,s);
  var h='<div class="stage"><div class="muted">'+esc(o.t)+' · question '+(s.i+1)+' of '+s.qs.length+'</div><p class="q" tabindex="-1">'+askText(q[0],o.cols[ci])+'</p><div class="opts" role="group" aria-label="Options">';
  c.ord.forEach(function(k,j){
    var cls='opt',tag='',lab='';
    if(s.picked!==null){if(k===c.ans){cls+=' ok';tag=mark(true,'ANSWER');lab=', correct answer'}else if(j===s.picked){cls+=' bad';tag=mark(false,'YOURS');lab=', your answer, wrong'}}
    h+='<button class="'+cls+'" style="display:flex;align-items:center;width:100%" data-act="cmpPick" data-j="'+j+'"'+(s.picked!==null?' disabled':'')+'>'+(CT.wide()&&j<9?'<span class="kbd" aria-hidden="true" style="margin-right:8px">'+(j+1)+'</span>':'')+'<span>'+esc(c.vals[k])+'</span>'+tag+(lab?vh(lab):'')+'</button>';
  });
  h+='</div>';
  if(s.picked!==null){
    var ok=c.ord[s.picked]===c.ans;
    h+='<p id="p-res" tabindex="-1" role="status" style="margin:12px 0 0"><b>'+(ok?'Right.':'Not quite.')+'</b> '+(ok?'':esc(o.cols[ci])+': '+esc(lowFirst(q[0]))+' is “'+esc(c.vals[c.ans])+'”.')+'</p>';
    h+='<div class="row" style="margin-top:14px"><button class="btn primary" data-act="cmpNext">'+(s.i+1<s.qs.length?'Next question':'See the table')+'</button></div>';
  }
  return h+'</div>';
}
function imageView(it){
  var o=it.o,s=CT.ps.cur;
  var h='<div class="stage"><div class="muted">What is this?</div><p class="q" tabindex="-1">Name the finding or structure.</p>';
  h+=o.assetId?'<img src="'+esc('/_blob/'+encodeURIComponent(o.assetId))+'" alt="Your mounted plate to identify">':'<div class="empty" style="margin-top:10px">This plate has no image file. Delete it in Plates and mount it again.</div>';
  if(!s.shown)return h+'<div class="row" style="margin-top:14px"><button class="btn primary" data-act="imgShow">Show answer</button></div></div>';
  h+='<p id="p-res" tabindex="-1" style="margin:14px 0 4px"><b>'+esc(o.answer)+'</b></p>';
  if(o.notes)h+='<p>'+esc(o.notes)+'</p>';
  if(o.ref)h+='<p class="muted mono" style="font-size:13px">'+esc(o.ref)+'</p>';
  if(o.concept&&CT.concepts[o.concept])h+=cLinks([o.concept]);
  h+='<p class="muted" style="margin:12px 0 6px;font-size:14px">How well did you know it?</p><div class="row">'+[['again','Missed'],['hard','Partly'],['good','Knew it'],['easy','Easy']].map(function(g,k){return '<button class="btn" data-act="imgGrade" data-g="'+g[0]+'">'+(CT.wide()?'<span class="kbd" aria-hidden="true" style="margin-right:6px">'+(k+1)+'</span>':'')+g[1]+'</button>'}).join('')+'</div>';
  return h+'</div>';
}
CT.views.practice=function(){
  var ps=CT.ps;
  if(!ps||!ps.queue.length)return menu();
  var it=CT.current();
  var h='<div class="session" style="max-width:860px;margin-inline:auto">';
  if(!it)return h+finished()+'</div>';
  if(!ps.cur)CT.openCurrent();
  h+='<div class="row" style="margin-bottom:10px"><button class="btn small" data-act="endSession">End session</button></div>'+head(it);
  h+=it.k==='chain'?chainView(it):it.k==='predict'?predictView(it):it.k==='compare'?compareView(it):imageView(it);
  return h+'</div>';
};
function afterNext(){stageIntoView();focusSoon(function(){return document.querySelector('#main .stage .q')||document.getElementById('p-res')})}
A.startMode=function(el){CT.startSession({d:CT.ui.pf.d,s:CT.ui.pf.s,t:el.dataset.t},false);CT.render();if(CT.ps&&!CT.ps.queue.length)focusSoon('#p-empty');else afterNext()};
A.startAnyway=function(){CT.startSession({d:CT.ui.pf.d,s:CT.ui.pf.s,t:'all'},true);CT.render();if(CT.ps&&!CT.ps.queue.length)focusSoon('#p-empty');else afterNext()};
A.endSession=function(){CT.ps=null;CT.render();window.scrollTo(0,0);focusSoon('#main h1')};
A.next=function(){CT.advance();afterNext()};
A.chainPick=function(el){
  var s=CT.ps&&CT.ps.cur,i=+el.dataset.i;if(!s||s.checked||s.pool.indexOf(i)<0)return;
  s.pool=s.pool.filter(function(x){return x!==i});s.placed.push(i);CT.render();
  focusSoon(s.pool.length?'.stage [data-act="chainPick"]':'.stage [data-act="chainCheck"]');
};
A.chainUndo=function(){var s=CT.ps&&CT.ps.cur;if(!s||s.checked)return;if(s.placed.length)s.pool.push(s.placed.pop());CT.render();focusSoon('.stage [data-act="chainPick"]')};
A.chainUnplace=function(el){
  var s=CT.ps&&CT.ps.cur,p=+el.dataset.pos;if(!s||s.checked||isNaN(p))return;
  var back=s.placed.splice(p);s.pool=s.pool.concat(back);CT.render();focusSoon('.stage [data-act="chainPick"]');
};
/* score by links between neighbours, and mark only the steps outside the longest run kept in order */
function inOrder(seq){
  var n=seq.length,len=[],prev=[],best=0;
  for(var i=0;i<n;i++){len[i]=i===0?1:0;prev[i]=-1;
    for(var j=0;j<i;j++)if(len[j]&&seq[j]<seq[i]&&len[j]+1>len[i]){len[i]=len[j]+1;prev[i]=j}
    if(len[i]>len[best])best=i}
  var keep=seq.map(function(){return false});for(var k=best;k>=0;k=prev[k])keep[k]=true;
  return keep;
}
A.chainCheck=function(){
  var s=CT.ps&&CT.ps.cur,it=CT.current();if(!s||s.checked||s.pool.length)return;
  var seq=[0].concat(s.placed),n=seq.length-1,pairs=0;
  for(var k=1;k<seq.length;k++)if(seq[k]===seq[k-1]+1)pairs++;
  var keep=inOrder(seq);
  s.okPos=s.placed.map(function(idx,pos){return keep[pos+1]});
  s.wrong=s.okPos.filter(function(x){return !x}).length;s.pairs=pairs;s.links=n;s.checked=true;
  var f=n?Math.max(pairs/n,(n-s.wrong)/n):1;if(s.wrong)f=Math.min(f,.99);
  grade(it,f,pairs,n);
  if(s.wrong)logMiss(it,'Trace: '+it.o.t,'Mechanism order');
  CT.render();focusSoon('#p-res');
};
A.predPick=function(el){
  var s=CT.ps&&CT.ps.cur;if(!s||s.checked)return;var i=+el.dataset.i,v=el.dataset.v;
  s.sel[i]=v;CT.render();
  focusSoon('.stage [data-act="predPick"][data-i="'+i+'"][data-v="'+v+'"]');
};
A.predCheck=function(){
  var s=CT.ps&&CT.ps.cur,it=CT.current();if(!s||s.checked)return;var o=it.o;
  if(!s.sel.every(function(v){return v}))return;
  s.checked=true;s.right=o.p.filter(function(r,i){return s.sel[i]===r[1]}).length;
  grade(it,s.right/o.p.length,s.right,o.p.length);
  if(s.right<o.p.length){
    var wrong=o.p.filter(function(r,i){return s.sel[i]!==r[1]}).map(function(r){return r[0]});
    logMiss(it,'Predict: '+o.t+' / '+wrong.join(', '),'Direction of change');
  }
  CT.render();focusSoon('#p-res');
};
A.cmpPick=function(el){
  var s=CT.ps&&CT.ps.cur,it=CT.current();if(!s||s.picked!==null||s.done)return;var o=it.o;
  var c=cmpChoice(it,s),j=+el.dataset.j;if(isNaN(j)||j<0||j>=c.ord.length)return;
  var ri=s.qs[s.i][0],ci=s.qs[s.i][1],q=o.rows[ri];
  s.picked=j;s.asked.push([ri,ci]);
  if(c.ord[j]===c.ans)s.ok++;
  else{s.missed.push([ri,ci]);logMiss(it,'Compare: '+o.t+' / '+o.cols[ci]+': '+q[0],'Mixed up two things')}
  CT.render();focusSoon('.stage [data-act="cmpNext"]');
};
A.cmpNext=function(){
  var s=CT.ps&&CT.ps.cur,it=CT.current();if(!s||s.picked===null||s.done)return;
  if(s.i+1<s.qs.length){s.i++;s.picked=null;CT.render();focusSoon('.stage .opt')}
  else{s.done=true;grade(it,s.ok/s.qs.length,s.ok,s.qs.length);CT.render();stageIntoView();focusSoon('#p-res')}
};
A.imgShow=function(){var s=CT.ps&&CT.ps.cur;if(!s)return;s.shown=true;CT.render();focusSoon('.stage [data-act="imgGrade"][data-g="good"]')};
A.imgGrade=function(el){
  var it=CT.current(),s=CT.ps&&CT.ps.cur,g=el.dataset.g;if(!it||!s||!s.shown||s.graded)return;s.graded=true;
  logResult(it,g==='again'?0:1,1,g,g==='again');CT.record(it,g);
  if(g==='again')CT.setDoc('misses',CT.newId(),{concept:it.o.concept||'',discipline:it.o.discipline||'',system:it.o.system||'',source:'Plate: '+it.o.answer,reason:'Did not recognise',note:'',at:Date.now(),auto:true});
  CT.advance();afterNext();
};

/* ---------- Plates (the user's own images) ---------- */
var OKT=['image/png','image/jpeg','image/webp','image/gif'],MAXB=20*1048576;
function decode(file){
  if(window.createImageBitmap)return createImageBitmap(file);
  return new Promise(function(res,rej){var u=URL.createObjectURL(file),im=new Image();im.onload=function(){res(im)};im.onerror=function(){URL.revokeObjectURL(u);rej({code:'decode'})};im.src=u});
}
/* re-encode big or unusual photos to JPEG, longest side 1600 px; small PNG/JPEG/WebP/GIF go up as they are */
function prep(file){
  var ok=OKT.indexOf(file.type)>=0;
  if(file.type==='image/gif'&&file.size<MAXB)return Promise.resolve(file);   /* keep animation */
  return decode(file).then(function(bmp){
    var w=bmp.width,h=bmp.height;
    if(ok&&file.size<1.5e6&&Math.max(w,h)<=1600){if(bmp.close)try{bmp.close()}catch(e){}return file}
    var sc=Math.min(1,1600/Math.max(w,h)),c=document.createElement('canvas');
    c.width=Math.max(1,Math.round(w*sc));c.height=Math.max(1,Math.round(h*sc));
    var x=c.getContext('2d');x.fillStyle='#fff';x.fillRect(0,0,c.width,c.height);x.drawImage(bmp,0,0,c.width,c.height);
    if(bmp.close)try{bmp.close()}catch(e){}
    return new Promise(function(res,rej){c.toBlob(function(b){if(!b)return rej({code:'decode'});var nm=String(file.name||'plate').replace(/\.[^.]*$/,'')+'.jpg';try{res(new File([b],nm,{type:'image/jpeg'}))}catch(e){b.name=nm;res(b)}},'image/jpeg',.85)});
  },function(){if(ok&&file.size<MAXB)return file;throw {code:'decode'}});   /* let the store judge a file the browser cannot draw */
}
function upMsg(e){
  var c=e&&e.code;
  return c==='decode'||c==='unsupported_type'?'This photo format cannot be read here. Save it as JPEG or PNG and try again.':
    c==='too_large'?'That image is too large (over 20 MB), even after shrinking.':
    c==='quota_exceeded'||c==='quota_or_state'?'Plate storage is full. Delete a few plates, then try again.':
    c==='not_granted'||c==='revoked'||c==='invalid_argument'?'This view cannot save plates.':'Upload failed. Check the connection and try again.';
}
CT.views.images=function(){
  var list=CT.data.images.slice().sort(function(a,b){return (b.at||0)-(a.at||0)});
  var h=banner('cell','#7A6BC4',11,'YOUR OWN SLIDES AND PHOTOS','Plates');
  h+='<p class="sub">Slides, photos and diagrams you took yourself, mounted with the answer so you can test yourself on them in Practice.</p>';
  if(CT.assets){
    var d=CT.dv;
    h+='<div class="panel"><h3 style="margin-top:0">Mount a plate</h3><div class="form">'+
      '<label class="f full">Image<input type="file" id="plate-file" accept="image/*"></label>'+(CT.ui.file?'<p class="muted full" style="margin:0;font-size:14px">Selected: '+esc(CT.ui.file.name)+'</p>':'')+
      '<label class="f">Subject<select id="i-disc">'+CT.discOpts(d('i-disc','path'))+'</select></label>'+
      '<label class="f">System<select id="i-sys">'+CT.sysOpts(d('i-sys','General'))+'</select></label>'+
      '<label class="f">Kind<select id="i-kind">'+CT.opts([['Histology','Histology'],['Gross pathology','Gross pathology'],['Microbiology','Microbiology'],['Diagram','Diagram'],['Other','Other']],d('i-kind','Histology'))+'</select></label>'+
      '<label class="f">Concept (optional)<select id="i-concept">'+CT.conceptOpts(d('i-concept',''))+'</select></label>'+
      '<label class="f">Reference (optional)<input id="i-ref" type="text" value="'+CT.dr('i-ref')+'" placeholder="Source or page"></label>'+
      '<label class="f full">Answer (what is it?)<input id="i-answer" type="text" value="'+CT.dr('i-answer')+'" placeholder="e.g. Reed-Sternberg cell"></label>'+
      '<label class="f full">Notes (optional)<textarea id="i-notes">'+CT.dr('i-notes')+'</textarea></label></div>'+
      (CT.ui.plateMsg?'<p role="alert" style="margin:0 0 10px;font-size:14px;color:var(--bad)"><b>✕</b> '+esc(CT.ui.plateMsg)+'</p>':'')+
      '<div class="row"><button class="btn primary" data-act="imgAdd"'+(CT.ui.busyImg?' disabled':'')+'>'+(CT.ui.busyImg?'Mounting…':'Save plate')+'</button><span class="muted" style="font-size:13px">Large photos are shrunk to 1600 px before upload. Only use images you took or that carry an open licence.</span></div></div>';
  }else{
    h+='<div class="empty"><strong>Mounting is not available in this view.</strong> '+(CT.ui.local?'Open the published page in Claude to add plates.':'Only people who can edit this page can add plates.')+(list.length?' Your mounted plates are below.':'')+'</div>';
  }
  h+='<h3>Mounted plates ('+list.length+')</h3>';
  if(!list.length)return h+'<div class="empty"><strong>No plates mounted.</strong> Bring back what you saw under the scope: a slide from the lab, a photo from a lecture. Each one joins the Plates practice mode.</div>';
  h+='<div class="gallery">'+list.map(function(x){
    var con=x.concept&&CT.concepts[x.concept];
    return '<div class="tile">'+(x.assetId?'<img src="/_blob/'+esc(encodeURIComponent(x.assetId))+'" alt="'+esc(x.answer)+'" loading="lazy">':'<div class="empty" style="aspect-ratio:4/3;border:0;display:flex;align-items:center;justify-content:center">No image file</div>')+'<div class="tb"><b>'+esc(x.answer)+'</b><div class="row">'+(x.discipline?'<span class="chip d-'+esc(x.discipline)+'">'+esc(DN[x.discipline]||x.discipline)+'</span>':'')+(x.system?'<span class="chip">'+esc(x.system)+'</span>':'')+(x.kind?'<span class="chip">'+esc(x.kind)+'</span>':'')+'</div>'+
      (con?'<button class="linkbtn" data-act="openConcept" data-id="'+esc(x.concept)+'">'+esc(con.n)+'</button>':'')+
      (x.notes||x.ref?'<details><summary>Notes</summary><p style="margin:6px 0 0">'+esc(x.notes||'')+'</p>'+(x.ref?'<p class="muted mono" style="margin:4px 0 0;font-size:12px">'+esc(x.ref)+'</p>':'')+'</details>':'')+
      '<div>'+confirmBtn('img-'+x.id,'Delete','imgDel',x.id)+'</div></div></div>';
  }).join('')+'</div>';
  return h;
};
A.imgAdd=async function(){
  if(CT.ui.busyImg)return;
  var ans=(CT.ui.draft['i-answer']||'').trim(),file=CT.ui.file,pre=CT.ui.imgAsset&&CT.ui.imgAsset.file===file?CT.ui.imgAsset.id:null;
  if(!file){CT.toast('Choose an image first.');return}
  if(!ans){CT.toast('Add the answer so you can test yourself.');focusSoon('#i-answer');return}
  if(!CT.assets){errToast('Mounting is not available in this view.');return}
  CT.ui.busyImg=true;CT.render();
  try{
    var aid=pre;
    if(!aid){
      var up=await prep(file);
      if(up.size>MAXB)throw {code:'too_large'};
      var r=await CT.assets.upload(up);aid=r&&r.id;
      if(!aid)throw {code:'error'};
      CT.ui.imgAsset={id:aid,file:file};            /* a retry after a failed save reuses this upload */
    }
    var ok=await CT.setDoc('images',CT.newId(),{assetId:aid,answer:ans,notes:(CT.ui.draft['i-notes']||'').trim(),ref:(CT.ui.draft['i-ref']||'').trim(),discipline:CT.dv('i-disc','path'),system:CT.dv('i-sys','General'),kind:CT.dv('i-kind','Histology'),concept:CT.dv('i-concept','')||'',at:Date.now()});
    if(failed(ok))CT.ui.plateMsg='Not saved yet. The image is uploaded and your answer and notes are kept: tap Save plate again.';   /* the core shows the reason as an error toast */
    else{['i-answer','i-notes','i-ref','i-concept'].forEach(function(k){delete CT.ui.draft[k]});CT.ui.file=null;CT.ui.imgAsset=null;CT.ui.plateMsg='';CT.toast('Plate mounted.')}
  }catch(e){CT.ui.plateMsg=upMsg(e);errToast(upMsg(e))}
  CT.ui.busyImg=false;CT.render();
};
A.imgDel=function(el){
  if(!confirmStep(el))return;
  var id=el.dataset.id,x=CT.data.images.find(function(i){return i.id===id});
  Promise.resolve(CT.delDoc('images',id)).then(function(ok){
    if(failed(ok))return;   /* row restored by the core, which shows the error; the image file is kept */
    var shared=x&&CT.data.images.some(function(i){return i.id!==id&&i.assetId===x.assetId});
    if(x&&x.assetId&&!shared&&CT.assets&&CT.assets.delete)return Promise.resolve(CT.assets.delete(x.assetId)).catch(function(){});
  });
};

/* ---------- Hull (miss log) ---------- */
var REASONS=['Did not know it','Mixed up two things','Misread the question','Knew it, rushed','Ran out of time','Mechanism order','Direction of change','Did not recognise','Other'];
function missDisc(x){
  if(x.discipline)return x.discipline;if(x.d)return x.d;
  var c=CT.concepts[x.concept];if(c&&c.L){var k=D.map(function(d){return d[0]}).filter(function(d){return c.L[d]});if(k.length)return k[0]}
  return '';
}
function missSys(x){return x.system||(CT.concepts[x.concept]?CT.concepts[x.concept].s:'')}
/* dive misses carry the question as text (qText, chosenText, rightText) because option indexes can move; older misses fall back to source */
function qa(x){
  if(!x.qText&&!x.chosenText&&!x.rightText)return '';
  var h='<div class="back" style="margin:2px 0 8px;font-size:14px">';
  if(x.qText)h+='<p style="margin:0 0 4px;color:var(--fg)">'+esc(x.qText)+'</p>';
  if(x.chosenText)h+='<p style="margin:0"><span aria-hidden="true" style="font:700 12px var(--mono);color:var(--bad)">✕ </span>'+'<span class="muted">You chose:</span> '+esc(x.chosenText)+'</p>';
  if(x.rightText)h+='<p style="margin:0"><span aria-hidden="true" style="font:700 12px var(--mono);color:var(--good)">✓ </span>'+'<span class="muted">Answer:</span> '+esc(x.rightText)+'</p>';
  return h+'</div>';
}
function missText(x){return [x.source,x.note,x.qText,x.chosenText,x.rightText,x.reason,x.system,DN[missDisc(x)]||'',x.concept&&CT.concepts[x.concept]?CT.concepts[x.concept].n:''].join(' ').toLowerCase()}
CT.views.mistakes=function(){
  var list=CT.data.misses.slice().sort(function(a,b){return (b.at||0)-(a.at||0)});
  var h=banner('shield','#B4442E',17,'EVERY CRACK, FROM ANY SOURCE','Hull');
  h+='<p class="sub">Every missed question in one place, from the dive, Practice or any question bank. Dive and Practice misses are logged automatically.</p>';
  var d=CT.dv;
  h+='<div class="panel"><h3 style="margin-top:0">Log a miss</h3><div class="form">'+
    '<label class="f">Concept<select id="m-concept">'+CT.conceptOpts(d('m-concept',''))+'</select></label>'+
    '<label class="f">Subject<select id="m-disc">'+CT.discOpts(d('m-disc','path'))+'</select></label>'+
    '<label class="f">System<select id="m-sys">'+CT.sysOpts(d('m-sys','General'))+'</select></label>'+
    '<label class="f">Source<input id="m-source" type="text" value="'+CT.dr('m-source')+'" placeholder="e.g. UWorld block 3"></label>'+
    '<label class="f">Reason<select id="m-reason">'+CT.opts(REASONS.map(function(r){return [r,r]}),d('m-reason',REASONS[0]))+'</select></label>'+
    '<label class="f full">What tripped you up<textarea id="m-note">'+CT.dr('m-note')+'</textarea></label></div>'+
    (CT.ui.missMsg?'<p role="alert" style="margin:0 0 10px;font-size:14px;color:var(--bad)"><b>✕</b> '+esc(CT.ui.missMsg)+'</p>':'')+
    '<div class="row"><button class="btn primary" data-act="missAdd"'+(CT.ui.busyMiss?' disabled':'')+'>Log it</button></div></div>';
  if(!list.length)return h+'<div class="empty" style="margin-top:14px"><strong>No cracks yet.</strong> When a question gets past you, in the dive, in Practice or in a question bank, it is logged here and grouped by subject, system and reason.</div>';
  var cut=Date.now()-30*CT.DAY,recent=list.filter(function(m){return m.at>=cut});
  h+='<h3>Weak map, last 30 days</h3>';
  if(recent.length){
    var m={},max=1,unplaced=0;
    recent.forEach(function(x){var dd=missDisc(x),ss=missSys(x);if(dd&&ss&&SYS.indexOf(ss)>=0){var k=dd+'|'+ss;m[k]=(m[k]||0)+1;if(m[k]>max)max=m[k]}else unplaced++});
    /* same look as the "Survey of the Host" grid in app-today.js: dim lit cells, solid text, short heads, fits 320 px */
    h+='<div class="gridwrap"><table class="cov" style="min-width:0"><caption'+VHS+'>Misses in the last 30 days by subject and system</caption><thead><tr><th class="rl" scope="col" style="width:32%;white-space:normal">System</th>'+D.map(function(x){return '<th scope="col" style="padding:8px 2px"><abbr title="'+esc(x[1])+'" style="text-decoration:none">'+esc(DSHORT[x[0]]||x[1])+'</abbr></th>'}).join('')+'</tr></thead><tbody>'+SYS.map(function(s){
      return '<tr><th class="rl" scope="row" style="white-space:normal">'+esc(s)+'</th>'+D.map(function(x){var n=m[x[0]+'|'+s]||0,pct=Math.round(16+26*n/max);
        return '<td><button class="'+(n?'has lit':'')+'" style="'+(n?'color:var(--fg);background:color-mix(in srgb,var(--'+x[0]+') '+pct+'%,var(--surface2));box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--'+x[0]+') 55%,transparent)':'')+'" data-act="goPractice" data-d="'+x[0]+'" data-s="'+esc(s)+'" aria-label="'+esc(x[1]+', '+s+': '+n+' miss'+(n===1?'':'es')+'. Practise this')+'">'+(n||'')+'</button></td>'}).join('')+'</tr>';
    }).join('')+'</tbody></table></div><p class="muted" style="font-size:14px;margin-top:8px">Tap a cell to practise that subject and system.'+(unplaced?' '+unplaced+' recent miss'+(unplaced===1?' has':'es have')+' no subject or system yet, so '+(unplaced===1?'it is':'they are')+' not on the map.':'')+'</p>';
    var cc={};recent.forEach(function(x){if(x.concept&&CT.concepts[x.concept])cc[x.concept]=(cc[x.concept]||0)+1});
    var top=Object.keys(cc).sort(function(a,b){return cc[b]-cc[a]}).slice(0,6);
    if(top.length)h+='<h3>Where the hull cracks most</h3><ul class="rank">'+top.map(function(id){return '<li><button class="linkbtn" data-act="openConcept" data-id="'+esc(id)+'">'+esc(cname(id))+'</button><span class="muted mono">'+cc[id]+' miss'+(cc[id]===1?'':'es')+'</span></li>'}).join('')+'</ul>';
    var rc={},rm=1;recent.forEach(function(x){var r=x.reason||'Other';rc[r]=(rc[r]||0)+1;if(rc[r]>rm)rm=rc[r]});
    h+='<h3>Why you miss</h3>'+Object.keys(rc).sort(function(a,b){return rc[b]-rc[a]}).map(function(r){return '<div class="hbar"><span>'+esc(r)+'</span><span class="t" aria-hidden="true"><i style="width:'+Math.round(rc[r]/rm*100)+'%"></i></span><b>'+rc[r]+'</b></div>'}).join('');
  }else h+='<div class="empty">Nothing in the last 30 days.</div>';
  var qq=(CT.ui.hullQ||'').trim().toLowerCase(),shown=qq?list.filter(function(x){return missText(x).indexOf(qq)>=0}):list,N=CT.ui.hullN||60;
  h+='<h3>Log ('+list.length+')</h3><div class="filters"><input class="search" id="h-q" type="search" placeholder="Filter the log" value="'+esc(CT.ui.hullQ||'')+'" aria-label="Filter the log"></div>';
  if(qq)h+='<p class="muted" style="font-size:14px">'+shown.length+' of '+list.length+' match.</p>';
  h+=shown.slice(0,N).map(function(x){
    var con=x.concept&&CT.concepts[x.concept],dd=x.discipline||x.d||'',chId=x.ch&&window.BOOK&&window.BOOK[x.ch]?x.ch:'';
    return '<div class="lc"><div class="top"><span class="mono muted">'+CT.fmtDate(x.at)+'</span>'+(dd?'<span class="chip d-'+esc(dd)+'">'+esc(DN[dd]||dd)+'</span>':'')+(x.system?'<span class="chip">'+esc(x.system)+'</span>':'')+'<span class="chip acc">'+esc(x.reason||'Other')+'</span>'+(x.auto?'<span class="chip">Auto</span>':'')+'</div>'+
      '<p class="front">'+(con?esc(con.n):esc(x.source||'Missed question'))+'</p>'+
      (con&&x.source?'<p class="back" style="margin-bottom:4px">'+esc(x.source)+'</p>':'')+qa(x)+(x.note?'<p class="back">'+esc(x.note)+'</p>':'')+
      '<div class="row">'+(con?'<button class="btn small" data-act="openConcept" data-id="'+esc(x.concept)+'">Make a note</button>':'')+(chId?'<button class="btn small" data-act="go" data-to="ch-'+esc(chId)+'">Re-read the stratum</button>':'')+confirmBtn('miss-'+x.id,'Delete','missDel',x.id)+'</div></div>';
  }).join('');
  if(shown.length>N)h+='<div class="row" style="margin-top:12px"><button class="btn" data-act="hullMore">Show '+Math.min(60,shown.length-N)+' more</button><span class="muted mono">'+N+' of '+shown.length+'</span></div>';
  return h;
};
A.missAdd=function(){
  if(CT.ui.busyMiss)return;
  var d=CT.dv,src=(CT.ui.draft['m-source']||'').trim(),note=(CT.ui.draft['m-note']||'').trim(),con=d('m-concept','');
  if(!con&&!src&&!note){CT.toast('Add a concept, a source or a note.');return}
  var c=CT.concepts[con];CT.ui.busyMiss=true;
  Promise.resolve(CT.setDoc('misses',CT.newId(),{concept:con,discipline:d('m-disc','path'),system:c?c.s:d('m-sys','General'),source:src,reason:d('m-reason',REASONS[0]),note:note,at:Date.now()})).then(function(ok){
    CT.ui.busyMiss=false;
    if(failed(ok)){CT.ui.missMsg='Not logged yet. Your entry is kept in the form: tap Log it again.';CT.render();return}   /* the core shows the reason as an error toast */
    ['m-source','m-note','m-concept'].forEach(function(k){delete CT.ui.draft[k]});CT.ui.missMsg='';
    CT.render();CT.toast('Logged.');
  });
};
A.missDel=function(el){
  if(!confirmStep(el))return;
  CT.delDoc('misses',el.dataset.id);   /* on failure the row comes back and the core explains why in an error toast */
};
A.hullMore=function(){CT.ui.hullN=(CT.ui.hullN||60)+60;CT.render()};
A.goPractice=function(el){CT.ui.pf={d:el.dataset.d,s:el.dataset.s,t:'all'};CT.ps=null;CT.go('practice');if(location.hash==='#practice')CT.render()};

/* filters, file input and the log filter */
document.addEventListener('change',function(e){
  var t=e.target;
  if(t.id==='pf-d'){CT.ui.pf.d=t.value;CT.ps=null;CT.render();focusSoon('#pf-d')}
  else if(t.id==='pf-s'){CT.ui.pf.s=t.value;CT.ps=null;CT.render();focusSoon('#pf-s')}
  else if(t.id==='plate-file'){CT.ui.file=t.files&&t.files[0]||null;CT.ui.imgAsset=null;CT.ui.plateMsg='';CT.render();focusSoon('#plate-file')}
});
document.addEventListener('input',function(e){
  var t=e.target;if(t.id!=='h-q')return;
  var pos=t.selectionStart;CT.ui.hullQ=t.value;CT.ui.hullN=60;CT.render();
  focusSoon(function(){var n=document.getElementById('h-q');if(n){try{n.setSelectionRange(pos,pos)}catch(x){}}return n});
});
/* keys: Trace 1-9 pick, Backspace take back; Predict U/D/N (or arrow up/down on a focused row) */
document.addEventListener('keydown',function(e){
  if(e.metaKey||e.ctrlKey||e.altKey||e.defaultPrevented)return;
  var t=e.target;if(t&&t.matches&&t.matches('input,textarea,select,[contenteditable]'))return;
  if(CT.view!=='practice'||!CT.ps||!CT.ps.cur)return;
  var it=CT.current(),s=CT.ps.cur,k=e.key;if(!it)return;
  if(it.k==='chain'&&!s.checked){
    if(/^[1-9]$/.test(k)){var b=document.querySelectorAll('.stage [data-act="chainPick"]')[+k-1];if(b){e.preventDefault();A.chainPick(b)}}
    else if(k==='Backspace'&&s.placed.length){e.preventDefault();A.chainUndo()}
  }else if(it.k==='predict'&&!s.checked){
    var map={u:'u',U:'u',d:'d',D:'d',n:'n',N:'n',ArrowUp:'u',ArrowDown:'d'},v=map[k];if(!v)return;
    var inRow=!!(t&&t.dataset&&t.dataset.act==='predPick'),row=inRow?+t.dataset.i:s.sel.indexOf(null);
    if((k==='ArrowUp'||k==='ArrowDown')&&!inRow)return;
    if(row<0)return;
    e.preventDefault();
    s.sel[row]=v;CT.render();
    if(inRow){focusSoon('.stage [data-act="predPick"][data-i="'+row+'"][data-v="'+v+'"]');return}
    var nxt=s.sel.indexOf(null);
    focusSoon(nxt>=0?'.stage [data-act="predPick"][data-i="'+nxt+'"][data-v="u"]':'.stage [data-act="predCheck"]');
  }
});
})();
