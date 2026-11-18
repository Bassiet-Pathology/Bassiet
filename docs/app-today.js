/* Bassiet shell, Today (Instruments) and Atlas: nav, hash routes, focus and scroll memory, Atlas list/search, concept pages. */
(function(){
'use strict';
var CT=window.CT,B=CT.B,esc=CT.esc,D=CT.D,DN=CT.DN,SYS=CT.SYS;
CT.views={};CT.actions={};
var NAV=[['today','Dive'],['atlas','Atlas'],['practice','Practice'],['images','Plates'],['mistakes','Hull']];
/* page titles follow the tab names (t01-22, t09-12, t06-47, t10-41) */
var TITLE={images:'Plates',mistakes:'Hull'};
CT.NAV=NAV;
CT.view='today';CT.cid=null;
CT.ui.af={q:'',d:'all',s:'all'};
CT.ui.pf={d:'all',s:'all',t:'all'};
var VH='position:absolute;width:1px;height:1px;margin:-1px;padding:0;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap;border:0';
function vh(t){return '<span class="vh" style="'+VH+'">'+esc(t)+'</span>'}
CT.vh=vh;
var SHORT={path:'Path',micro:'Micro',pharm:'Pharm',bio:'Biochem',phys:'Phys'};
var COVH={path:'Path',micro:'Micro',pharm:'Pharm',bio:'Bio',phys:'Phys'};
function byName(a,b){return a.n.localeCompare(b.n,'en',{sensitivity:'base'})}

CT.dr=function(id,def){return esc(CT.ui.draft[id]!=null?CT.ui.draft[id]:(def==null?'':def))};
CT.dv=function(id,def){return CT.ui.draft[id]!=null?CT.ui.draft[id]:def};
CT.opts=function(list,sel){return list.map(function(x){return '<option value="'+esc(x[0])+'"'+(String(x[0])===String(sel)?' selected':'')+'>'+esc(x[1])+'</option>'}).join('')};
CT.sysOpts=function(sel,allLabel){var l=SYS.map(function(s){return [s,s]});if(allLabel)l.unshift(['all',allLabel]);return CT.opts(l,sel)};
CT.discOpts=function(sel,allLabel){var l=D.slice();if(allLabel)l=[['all',allLabel]].concat(l);return CT.opts(l,sel)};
CT.conceptOpts=function(sel){
  var l=[['','Not sure']].concat(B.C.slice().sort(byName).map(function(c){return [c.id,c.n]}));
  return CT.opts(l,sel);
};
function hash(s){var h=0;for(var i=0;i<s.length;i++)h=(h*31+s.charCodeAt(i))|0;return Math.abs(h)}
function lensNames(c){return D.filter(function(d){return c.L[d[0]]}).map(function(d){return d[1]})}
function dotsFor(c){var ln=lensNames(c);return '<span class="dots" aria-hidden="true">'+D.map(function(d){return '<i class="'+(c.L[d[0]]?'d-'+d[0]:'')+'"></i>'}).join('')+'</span>'+vh('Lenses: '+(ln.length?ln.join(', '):'none yet'))}
function confLabel(id){var n=CT.nmap[id];return n&&n.conf?['','Shaky','Okay','Solid'][n.conf]:'New'}
function plural(n,w){return n+' '+w+(n===1?'':'s')}
/* one honest save: setDoc resolves true/false (contract 2.1); older cores resolve undefined on success */
function saved(p){return Promise.resolve(p).then(function(ok){return ok!==false},function(){return false})}
function errToast(m){CT.toast(m,'err')}

/* ---------- Today: the Instruments block on the Dive home ---------- */
function suggest(){
  var miss={};CT.data.misses.forEach(function(m){if(m.concept)miss[m.concept]=(miss[m.concept]||0)+1});
  var day=CT.ymd();
  return B.C.map(function(c){
    var n=CT.nmap[c.id];
    var s=(miss[c.id]||0)*3+(n?(n.conf===1?2:n.conf===2?.5:-1):1)+(hash(c.id+day)%100)/200;
    return {c:c,s:s};
  }).sort(function(a,b){return b.s-a.s}).slice(0,4).map(function(x){return x.c});
}
function slipping(){
  var since=Date.now()-30*CT.DAY,m={};
  function add(d,s,k,n){if(!d||!s||!DN[d])return;var key=d+'|'+s;(m[key]=m[key]||{d:d,s:s,miss:0,lap:0})[k]+=n}
  CT.data.misses.forEach(function(x){
    if(!(x.at>=since))return;
    var c=x.concept&&CT.concepts[x.concept];
    /* dive misses may carry only `d` or only a concept (t07-22): fall back sensibly */
    add(x.discipline||x.d||'',x.system||(c&&c.s)||'','miss',1);
  });
  CT.data.prog.forEach(function(p){if(p.lapses&&p.sys)(p.sub||[]).forEach(function(d){add(d,p.sys,'lap',p.lapses)})});
  return Object.keys(m).map(function(k){var r=m[k];r.score=r.miss*2+r.lap;return r}).sort(function(a,b){return b.score-a.score}).slice(0,5);
}
function covCell(d,s,n){
  var lab=d[1]+', '+s+': '+plural(n,'concept');
  if(!n)return '<td><button data-act="covgo" data-d="'+d[0]+'" data-s="'+esc(s)+'" aria-label="'+esc(lab+'. A gap')+'"></button></td>';
  /* dim "lit cells": a mix of the subject hue into the surface, solid text (t09-08, t09-30) */
  var pct=Math.min(42,16+n*5);
  var st='color:var(--fg);background:color-mix(in srgb,var(--'+d[0]+') '+pct+'%,var(--surface2));box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--'+d[0]+') 55%,transparent)';
  return '<td><button class="has lit" style="'+st+'" data-act="covgo" data-d="'+d[0]+'" data-s="'+esc(s)+'" aria-label="'+esc(lab)+'">'+n+'</button></td>';
}
function ledgerCell(val,lab,hint){
  var p=hint.split('|');
  return '<div tabindex="0" data-hint="'+esc(hint)+'" title="'+esc(p[1]||'')+'"><b>'+val+'</b><span>'+esc(lab)+'</span>'+vh('. '+(p[1]||''))+'</div>';
}
CT.views.today=function(){
  var c=CT.counts(),mins=Math.min(45,Math.round(c.due*1.5)),hub=CT.ui.hub;
  /* keep this first h1 + sub exactly: the Dive home strips them before showing the rest */
  var h='<h1>Today</h1><p class="sub">'+esc(new Date().toLocaleDateString('en-GB',{weekday:'long'}))+', '+CT.fmtDate(Date.now())+'</p>';
  h+='<div class="row">'+(c.due?'<button class="btn primary" data-act="startDue">Revisit '+c.due+' due</button>':'<button class="btn" data-act="startDue">Start a practice set</button>')+'<button class="btn" data-act="go" data-to="atlas">Browse the Atlas</button></div>';
  h+='<div class="ledger">'+
     ledgerCell(c.due,'due to revisit','Due now|Practice items you have done before whose revisit time has arrived.')+
     ledgerCell(c.fresh,'not yet tried','Not yet tried|Chains, predictions and tables you have not attempted. Each practice set adds a few.')+
     ledgerCell(c.today,'practiced today','Practiced today|Practice items you finished today.')+
     ledgerCell(CT.streak(),'day streak','Streak|Days in a row with at least one practice item or stain-test answer. Today counts once you start.')+
     ledgerCell(c.opened+'/'+B.C.length,'sites rated','Rated sites|Atlas concepts where you set Shaky, Okay or Solid, or wrote a note.')+'</div>';
  h+='<h3>Sites to open next</h3><ul class="rank">'+suggest().map(function(x){
    return '<li><button class="linkbtn" data-act="openConcept" data-id="'+x.id+'">'+esc(x.n)+'</button><span class="row"><span class="chip">'+esc(x.s)+'</span><span class="conf">'+confLabel(x.id)+'</span></span></li>';
  }).join('')+'</ul>';
  h+='<h3>Survey of the Host</h3><p class="muted" style="margin:0 0 8px;font-size:14px">Atlas sites with a lens, by subject and system. Brighter cells hold more sites; dark cells are gaps. Tap a cell to open its sites.</p>';
  h+='<div class="gridwrap"><table class="cov" style="min-width:0"><caption class="vh" style="'+VH+'">Atlas concepts with a lens, by subject and system</caption><thead><tr><th class="rl" scope="col" style="width:32%;white-space:normal">System</th>'+D.map(function(d){return '<th scope="col" style="padding:8px 2px"><abbr title="'+esc(d[1])+'" style="text-decoration:none">'+COVH[d[0]]+'</abbr></th>'}).join('')+'</tr></thead><tbody>';
  SYS.forEach(function(s){
    h+='<tr><th class="rl" scope="row" style="white-space:normal">'+esc(s)+'</th>'+D.map(function(d){
      return covCell(d,s,B.C.filter(function(x){return x.s===s&&x.L[d[0]]}).length);
    }).join('')+'</tr>';
  });
  h+='</tbody></table></div>';
  var sl=slipping();
  h+='<div class="two"><div><h3>Where you are slipping</h3>';
  if(sl.length)h+='<ul class="rank">'+sl.map(function(r){return '<li><button class="linkbtn" data-act="covgo" data-d="'+r.d+'" data-s="'+esc(r.s)+'">'+esc(DN[r.d])+' · '+esc(r.s)+'</button><span class="muted mono">'+r.miss+' missed · '+r.lap+' lapses</span></li>'}).join('')+'</ul>';
  else h+='<div class="empty"><strong>No cracks yet.</strong> Missed questions and failed practice gather here, grouped by subject and system, once you have a few.</div>';
  h+='</div><div><h3>Citrus Maxima</h3><div class="panel"><p>Send what is due to your hub so Citrus can plan study time around your shifts.</p><div class="row"><button class="btn" data-act="tellCitrus"'+(hub.busy?' disabled':'')+'>Update Citrus</button>'+(hub.last?'<span class="muted mono">Sent '+CT.fmtTime(hub.last)+'</span>':'')+'</div>'+(hub.msg?'<p class="muted" style="margin:10px 0 0;font-size:14px" role="status">'+esc(hub.msg)+'</p>':'')+'<p class="muted" style="margin:10px 0 0;font-size:13px">Writes My Apps/hub/bassiet/status.json in your Drive and replaces the previous one. About '+mins+' min due now.</p></div></div></div>';
  h+='<p class="keys"><span class="kbd">1</span>–<span class="kbd">5</span> switch screens · <span class="kbd">/</span> search the Atlas · duels: <span class="kbd">1</span>–<span class="kbd">4</span> answer, <span class="kbd">Enter</span> next · Practice: <span class="kbd">Enter</span> check or next, <span class="kbd">1</span>–<span class="kbd">9</span> pick a Trace step or a Compare option, <span class="kbd">Backspace</span> undo, <span class="kbd">U</span> <span class="kbd">D</span> <span class="kbd">N</span> Predict up, down, no change, <span class="kbd">1</span>–<span class="kbd">4</span> grade a plate</p>';
  return h;
};

/* ---------- Atlas search: UK/US spelling and common synonyms (t06-34, t06-28) ---------- */
var GREEK={'α':'alpha','β':'beta','γ':'gamma','δ':'delta','κ':'kappa','λ':'lambda','μ':'mu'};
function norm(s){
  s=String(s||'').toLowerCase().replace(/[αβγδκλμ]/g,function(c){return ' '+GREEK[c]+' '});
  try{s=s.normalize('NFKD').replace(/[\u0300-\u036f]/g,'')}catch(e){}
  return s.replace(/ae/g,'e').replace(/oe/g,'e')
    .replace(/our\b/g,'or').replace(/isation/g,'ization').replace(/(\w)is(e|ed|es|ing)\b/g,'$1iz$2').replace(/yse\b/g,'yze')
    .replace(/([bt])re\b/g,'$1er').replace(/vre\b/g,'ver').replace(/sulph/g,'sulf').replace(/grey/g,'gray').replace(/ageing/g,'aging')
    .replace(/[\u2010-\u2015'"`’‘“”()\[\]{},;:!?\/\\_.-]/g,' ').replace(/\s+/g,' ').trim();
}
/* query word -> other words that mean the same; matched as whole words when short */
var SYN={
  'mi':['myocardial infarction'],'stemi':['myocardial infarction'],'nstemi':['myocardial infarction'],'acs':['myocardial infarction'],
  'chf':['heart failure'],'hf':['heart failure'],'htn':['hypertension'],'af':['atrial fibrillation'],
  'dka':['diabetes','ketoacidosis'],'dm':['diabetes'],'t1dm':['diabetes'],'t2dm':['diabetes'],
  'sle':['lupus'],'ra':['rheumatoid'],'oa':['osteoarthritis'],'ms':['multiple sclerosis'],'als':['amyotrophic'],
  'pe':['pulmonary embolism'],'dvt':['thrombosis','embolism'],'vte':['thrombosis','embolism'],'tb':['tuberculosis'],
  'ckd':['chronic kidney'],'aki':['acute kidney'],'arf':['acute kidney'],'copd':['obstructive','emphysema'],
  'raas':['renin'],'siadh':['adh'],'ibd':['inflammatory bowel'],'uc':['ulcerative colitis'],'cf':['cystic fibrosis'],
  'aids':['hiv'],'sti':['sexually transmitted'],'std':['sexually transmitted'],'tia':['stroke'],'cva':['stroke'],
  'itp':['platelet'],'dic':['coagulation','hemostasis'],'aml':['leukemia'],'cml':['leukemia'],'cll':['leukemia'],'all':['leukemia'],
  'nhl':['lymphoma'],'mm':['myeloma'],'uti':['urinary'],'ards':['respiratory distress'],
  'nmj':['neuromuscular'],'ans':['autonomic'],'pk':['pharmacokinetics'],'g6pd':['glucose 6 phosphate'],
  'paracetamol':['acetaminophen'],'acetaminophen':['paracetamol'],'adrenaline':['epinephrine'],'epinephrine':['adrenaline'],
  'noradrenaline':['norepinephrine'],'norepinephrine':['noradrenaline'],'frusemide':['furosemide'],'salbutamol':['albuterol'],'albuterol':['salbutamol'],
  'gtn':['nitroglycerin','nitrate'],'nitroglycerin':['glyceryl trinitrate','nitrate'],'lignocaine':['lidocaine'],'pethidine':['meperidine'],
  'ciclosporin':['cyclosporine'],'cyclosporin':['cyclosporine'],'rifampicin':['rifampin'],'rifampin':['rifampicin'],
  'heart attack':['myocardial infarction'],'kidney':['renal'],'renal':['kidney'],'liver':['hepatic'],'hepatic':['liver'],
  'lung':['pulmonary'],'pulmonary':['lung'],'cancer':['tumor','carcinoma','malignan'],'tumor':['cancer','carcinoma','neoplasm'],
  'sugar':['glucose'],'blood sugar':['glucose'],'clot':['thrombosis','coagulation','hemostasis'],'bleeding':['hemorrhage','hemostasis'],
  'fit':['seizure'],'fits':['seizure'],'epilepsy':['seizure'],'water pill':['diuretic'],'water pills':['diuretic']
};
var IDX=null;
function index(){
  if(IDX&&IDX.n===B.C.length)return IDX;
  IDX={n:B.C.length,m:{}};
  B.C.forEach(function(c){
    function f(t){var n=' '+norm(t)+' ';return {s:n,c:n.replace(/ /g,'')}}
    var lens={};Object.keys(c.L).forEach(function(k){lens[k]=f(c.L[k])});
    var links=[].concat(CT.out[c.id]||[],CT.inn[c.id]||[]).map(function(e){return e[2]}).join(' ');
    IDX.m[c.id]={name:f(c.n),sys:f(c.s),lens:lens,link:f(links)};
  });
  return IDX;
}
function words(q){
  var n=norm(q);if(!n)return [];
  var groups=[];
  /* two-word synonyms first ("heart attack", "blood sugar") */
  Object.keys(SYN).forEach(function(k){if(k.indexOf(' ')>0&&(' '+n+' ').indexOf(' '+k+' ')>=0){groups.push([k].concat(SYN[k]));n=(' '+n+' ').replace(' '+k+' ',' ').trim()}});
  n.split(' ').forEach(function(w){if(w)groups.push([w].concat(SYN[w]||[]))});
  return groups;
}
function hit(f,alt,first){
  if(!f)return false;
  /* the typed word matches anywhere, also across spaces ("preeclampsia"); short synonyms match whole words */
  if(first)return f.s.indexOf(alt)>=0||f.c.indexOf(alt.replace(/ /g,''))>=0;
  return alt.length<=4?f.s.indexOf(' '+alt+' ')>=0:f.s.indexOf(alt)>=0;
}
/* score one concept against the query groups: 0 = no match */
function scoreOf(c,groups){
  var ix=index().m[c.id],total=0,where={};
  for(var g=0;g<groups.length;g++){
    var alts=groups[g],best=0;
    for(var a=0;a<alts.length;a++){
      var w=alts[a],first=a===0;
      if(hit(ix.name,w,first)){best=Math.max(best,ix.name.s.indexOf(' '+w)>=0?4:3);where.name=1;continue}
      if(hit(ix.sys,w,first)){best=Math.max(best,2)}
      for(var k in ix.lens)if(hit(ix.lens[k],w,first)){best=Math.max(best,2);where[k]=1}
      if(!best&&hit(ix.link,w,first)){best=1;where.link=1}
    }
    if(!best)return {s:0};
    total+=best;
  }
  return {s:total,where:where};
}
CT.atlasSearch=function(q){var g=words(q);return B.C.filter(function(c){return !g.length||scoreOf(c,g).s>0})};

/* ---------- concept map ---------- */
function wrap2(s,max){
  if(s.length<=max)return [s];
  /* break at spaces, or after a hyphen ("Renin-angiotensin-/aldosterone") */
  var tk=s.match(/[^\s-]+-*|-+/g)||[s],gap=[],i,l1='';
  for(i=0;i<tk.length;i++)gap.push(i>0&&!/-$/.test(tk[i-1])?' ':'');
  for(i=0;i<tk.length;i++){var nx=l1+(l1?gap[i]:'')+tk[i];if(nx.length>max)break;l1=nx}
  if(!l1){l1=tk[0].slice(0,max-1)+'-';tk[0]=tk[0].slice(max-1);i=0}
  var l2='';for(var j=i;j<tk.length;j++)l2+=(l2?gap[j]:'')+tk[j];
  if(l2.length>max)l2=l2.slice(0,max-1).replace(/[\s-]+$/,'')+'…';
  return l2?[l1,l2]:[l1];
}
function tspans(lines,x,y,lh){
  var y0=y-(lines.length-1)*lh/2;
  return lines.map(function(l,i){return '<tspan x="'+x+'" y="'+(y0+i*lh).toFixed(1)+'">'+esc(l)+'</tspan>'}).join('');
}
function neighbours(cid){
  var m={},list=[];
  function get(id){if(!m[id]){m[id]={id:id,out:[],inn:[]};list.push(m[id])}return m[id]}
  (CT.out[cid]||[]).forEach(function(e){if(CT.concepts[e[1]])get(e[1]).out.push(e[2])});
  (CT.inn[cid]||[]).forEach(function(e){if(CT.concepts[e[0]])get(e[0]).inn.push(e[2])});
  return list;
}
function edgeLine(x1,y1,x2,y2,dir){
  /* out: this site -> neighbour (orange, arrow at the neighbour); in: neighbour -> this site (grey dashed) */
  var acc=dir!=='in',st='stroke:'+(acc?'var(--accent)':'var(--muted)')+';stroke-width:2;opacity:'+(acc?'.8':'.7')+(acc?'':';stroke-dasharray:5 4');
  if(dir==='in')return '<line x1="'+x2.toFixed(1)+'" y1="'+y2.toFixed(1)+'" x2="'+x1.toFixed(1)+'" y2="'+y1.toFixed(1)+'" style="'+st+'" marker-end="url(#wa-i)"/>';
  return '<line x1="'+x1.toFixed(1)+'" y1="'+y1.toFixed(1)+'" x2="'+x2.toFixed(1)+'" y2="'+y2.toFixed(1)+'" style="'+st+'" marker-end="url(#wa-o)"'+(dir==='both'?' marker-start="url(#wa-o)"':'')+'/>';
}
function clip(px,py,qx,qy,hw,hh){
  var dx=qx-px,dy=qy-py,t=Math.min(dx?hw/Math.abs(dx):1e9,dy?hh/Math.abs(dy):1e9);
  return t<1?[px+dx*t,py+dy*t]:[px,py];
}
function webNode(c,p,x,y,w,h,fs,max){
  var t=CT.concepts[p.id],dir=p.out.length&&p.inn.length?'both':p.out.length?'out':'in';
  var say=[].concat(p.out.map(function(l){return c.n+' '+l+' '+t.n}),p.inn.map(function(l){return t.n+' '+l+' '+c.n})).join('. ');
  var stroke=dir==='in'?'var(--muted)':'var(--accent)';
  return '<g class="hit" role="button" tabindex="0" data-act="openConcept" data-id="'+p.id+'" aria-label="'+esc('Open '+t.n+'. '+say)+'"><title>'+esc(say)+'</title><rect class="nd" x="'+(x-w/2).toFixed(1)+'" y="'+(y-h/2).toFixed(1)+'" width="'+w+'" height="'+h+'" rx="3" style="stroke:'+stroke+(dir==='in'?';stroke-dasharray:5 3':'')+'"/><text x="'+x.toFixed(1)+'" y="'+y.toFixed(1)+'" text-anchor="middle" dominant-baseline="central" style="font-size:'+fs+'px">'+tspans(wrap2(t.n,max),x.toFixed(1),y,fs+2)+'</text></g>';
}
var DEFS='<defs><marker id="wa-o" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="9" markerHeight="9" markerUnits="userSpaceOnUse" orient="auto-start-reverse"><path d="M0,0L10,5L0,10z" style="fill:var(--accent)"/></marker><marker id="wa-i" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="9" markerHeight="9" markerUnits="userSpaceOnUse" orient="auto"><path d="M0,0L10,5L0,10z" style="fill:var(--muted)"/></marker></defs>';
var nq=window.matchMedia?window.matchMedia('(max-width:699px)'):{matches:false};
function webSvg(cid){
  var all=neighbours(cid);if(!all.length)return '';
  var c=CT.concepts[cid],s,narrow=nq.matches;
  if(narrow){
    /* phone: a spine with two columns of readable nodes (t06-36) */
    var nb=all.slice(0,12),rows=Math.ceil(nb.length/2),W=360,y0=86,RH=58,H=y0+rows*RH,NW=154,NH=46,tx=W/2;
    s='<svg class="web" viewBox="0 0 '+W+' '+H+'" role="group" aria-label="'+esc('Links of '+c.n)+'">'+DEFS;
    s+='<line x1="'+tx+'" y1="58" x2="'+tx+'" y2="'+(y0+(rows-1)*RH+NH/2)+'" style="stroke:var(--muted);stroke-width:2;opacity:.45"/>';
    var nodes='';
    nb.forEach(function(p,i){
      var col=i%2,row=Math.floor(i/2),cx=col?W-6-NW/2:6+NW/2,cy=y0+row*RH+NH/2,dir=p.out.length&&p.inn.length?'both':p.out.length?'out':'in';
      var ex=col?cx-NW/2:cx+NW/2;
      s+=edgeLine(tx,cy,ex+(col?-1:1),cy,dir);
      nodes+=webNode(c,p,cx,cy,NW,NH,13,20);
    });
    s+=nodes+'<rect class="ctr" x="'+(tx-130)+'" y="6" width="260" height="52" rx="3"/><text class="ctr-t" x="'+tx+'" y="32" text-anchor="middle" dominant-baseline="central" style="font-size:15px">'+tspans(wrap2(c.n,28),tx,32,17)+'</text></svg>';
  }else{
    var nb2=all.slice(0,10),n=nb2.length,W2=720,H2=430,cx0=W2/2,cy0=H2/2,rx=272,ry=164,NW2=168,NH2=44,CW=210,CH=54;
    var off=n%2?0:Math.PI/n,lines='',nds='';
    s='<svg class="web" viewBox="0 0 '+W2+' '+H2+'" role="group" aria-label="'+esc('Links of '+c.n)+'">'+DEFS;
    nb2.forEach(function(p,i){
      var a=2*Math.PI*i/n-Math.PI/2+off,x=cx0+rx*Math.cos(a),y=cy0+ry*Math.sin(a),dir=p.out.length&&p.inn.length?'both':p.out.length?'out':'in';
      var p1=clip(cx0,cy0,x,y,CW/2+2,CH/2+2),p2=clip(x,y,cx0,cy0,NW2/2+3,NH2/2+3);
      lines+=edgeLine(p1[0],p1[1],p2[0],p2[1],dir);
      nds+=webNode(c,p,x,y,NW2,NH2,13,24);
    });
    s+=lines+nds+'<rect class="ctr" x="'+(cx0-CW/2)+'" y="'+(cy0-CH/2)+'" width="'+CW+'" height="'+CH+'" rx="3"/><text class="ctr-t" x="'+cx0+'" y="'+cy0+'" text-anchor="middle" dominant-baseline="central" style="font-size:15px">'+tspans(wrap2(c.n,24),cx0,cy0,17)+'</text></svg>';
  }
  var more=all.length-(narrow?12:10);
  s+='<p class="muted" style="margin:6px 0 0;font-size:13px">Orange threads lead out from this site, grey dashed threads lead into it. Tap a site to open it.'+(more>0?' '+plural(more,'more link')+' in the list below.':'')+'</p>';
  return s;
}

/* ---------- concept page ---------- */
function strataFor(cid){
  var BK=window.BOOK||{},DP=window.DEPTHS||[],dv=CT.dive||{},open=[],sealed=0;
  DP.forEach(function(d){
    (d.strata||[]).forEach(function(s){
      var id=s.ch||('c'+d.n+'-'+s.id),ch=BK[id];
      if(!ch||(ch.c||[]).indexOf(cid)<0)return;
      var isOpen=dv.isOpen?dv.isOpen(d):d.n===1;
      if(!isOpen){sealed++;return}
      var done=dv.chDone&&dv.chDone(id),sc=dv.chScore?dv.chScore(id):0;
      open.push({id:id,d:d,name:ch.title||s.name,st:done&&sc>=.6});
    });
  });
  return {open:open,sealed:sealed};
}
function conceptPage(cid,wide){
  var c=CT.concepts[cid],n=CT.nmap[cid]||{},conf=n.conf||0,tag=wide?'h2':'h1';
  var h=wide?'':'<button class="btn small phoneonly" data-act="back">All concepts</button>';
  h+='<'+tag+' class="ctitle">'+esc(c.n)+'</'+tag+'><div class="row" style="margin-bottom:14px"><span class="chip acc">'+esc(c.s)+'</span><span class="seg" role="group" aria-label="How well do you know this?">'+
    [[1,'Shaky'],[2,'Okay'],[3,'Solid']].map(function(x){return '<button data-act="conf" data-v="'+x[0]+'" aria-pressed="'+(conf===x[0])+'">'+x[1]+'</button>'}).join('')+'</span></div>';
  var miss=[];
  D.forEach(function(d){
    var t=c.L[d[0]];
    if(!t){miss.push(d[1].toLowerCase());return}
    h+='<div class="lens d-'+d[0]+'"><h3 class="lh" style="margin:0 0 3px;font:600 12px var(--body);letter-spacing:.08em;text-transform:uppercase;color:var(--'+d[0]+'-t)">'+d[1]+'</h3><p>'+esc(t)+'</p></div>';
  });
  /* missing lenses: one quiet line instead of empty boxes (t06-37) */
  if(miss.length)h+='<p class="muted" style="margin:4px 0 0;font-size:14px">No '+(miss.length>1?miss.slice(0,-1).join(', ')+' or '+miss[miss.length-1]:miss[0])+' lens yet.</p>';
  var sf=strataFor(cid);
  if(sf.open.length||sf.sealed){
    h+='<h3>Where it lies in the Host</h3>';
    if(sf.open.length)h+='<div class="row">'+sf.open.map(function(x){return '<button class="btn small" data-act="go" data-to="ch-'+x.id+'"><span class="mono">−'+String(x.d.n).padStart(2,'0')+'</span> '+esc(x.name)+(x.st?' <span aria-hidden="true" style="color:var(--accent-text)">✓</span>'+vh(', stained'):'')+'</button>'}).join('')+'</div>';
    if(sf.sealed)h+='<p class="muted" style="margin:8px 0 0;font-size:14px">'+(sf.open.length?'And '+plural(sf.sealed,'more stratum').replace('stratums','strata')+' below a seal you have not broken.':plural(sf.sealed,'stratum').replace('stratums','strata')+' below a seal you have not broken yet.')+'</p>';
  }
  var nb=neighbours(cid);
  if(nb.length){
    h+='<h3>Connections</h3>'+webSvg(cid);
    var items=[];
    (CT.out[cid]||[]).forEach(function(e){if(CT.concepts[e[1]])items.push('<li>'+esc(c.n)+' <em>'+esc(e[2])+'</em> <button class="linkbtn" data-act="openConcept" data-id="'+e[1]+'">'+esc(CT.concepts[e[1]].n)+'</button></li>')});
    (CT.inn[cid]||[]).forEach(function(e){if(CT.concepts[e[0]])items.push('<li><button class="linkbtn" data-act="openConcept" data-id="'+e[0]+'">'+esc(CT.concepts[e[0]].n)+'</button> <em>'+esc(e[2])+'</em> '+esc(c.n)+'</li>')});
    h+='<ul class="conn">'+items.join('')+'</ul>';
  }
  var prac=CT.catalog().filter(function(x){return (x.c||[]).indexOf(cid)>=0});
  h+='<h3>Practice this</h3>';
  if(prac.length)h+='<div class="row">'+prac.map(function(x){return '<button class="btn small" data-act="openItem" data-k="'+x.k+'" data-id="'+x.id+'">'+CT.KIND[x.k]+': '+esc(x.t)+'</button>'}).join('')+'</div>';
  else h+='<div class="empty">No practice items trace this site yet. Read its stratum and pass the stain test instead.</div>';
  var ms=CT.data.misses.filter(function(m){return m.concept===cid});
  if(ms.length)h+='<p class="muted" style="margin-top:12px">You logged '+plural(ms.length,'missed question')+' on this site. <button class="linkbtn" data-act="go" data-to="mistakes">Open the Hull</button></p>';
  h+='<h3><label for="n-note">My note</label></h3><textarea class="note" id="n-note">'+esc(CT.ui.draft['n-note']!=null?CT.ui.draft['n-note']:(n.note||''))+'</textarea><div class="row" style="margin-top:8px"><button class="btn small" data-act="saveNote">Save note</button></div>';
  return h;
}

/* ---------- Atlas list ---------- */
var mq=window.matchMedia?window.matchMedia('(min-width:960px)'):{matches:false};
CT.wide=function(){return mq.matches};
function atlasFilters(){
  var f=CT.ui.af;
  return '<div class="filters" role="search"><input class="search" id="af-q" type="search" placeholder="Search sites  (press / )" value="'+esc(f.q)+'" aria-label="Search concepts" aria-controls="arows" autocomplete="off" spellcheck="false"><select class="sel" id="af-d" aria-label="Subject">'+CT.discOpts(f.d,'All subjects')+'</select><select class="sel" id="af-s" aria-label="System">'+CT.sysOpts(f.s,'All systems')+'</select></div>';
}
function atlasRows(){
  var f=CT.ui.af,groups=words(f.q),sc={};
  var list=B.C.filter(function(c){
    if(f.d!=='all'&&!c.L[f.d])return false;
    if(f.s!=='all'&&c.s!==f.s)return false;
    if(groups.length){var r=scoreOf(c,groups);if(!r.s)return false;sc[c.id]=r}
    return true;
  });
  list.sort(groups.length?function(a,b){return (sc[b.id].s-sc[a.id].s)||byName(a,b)}:byName);
  var any=f.q.trim()||f.d!=='all'||f.s!=='all';
  if(!list.length)return '<div class="empty" role="status"><strong>Nothing under the lamp matches.</strong> '+(f.q.trim()?'Try a shorter word or another name for it (UK and US spellings both work). ':'')+(f.d!=='all'||f.s!=='all'?'Clear a filter to see more. ':'')+'<div class="row" style="margin-top:10px"><button class="btn small" data-act="afClear">Show every site</button></div></div>';
  var h='<p class="muted" style="font-size:14px" role="status">'+plural(list.length,'site')+(any?' match'+(list.length===1?'es':''):' charted')+'. '+(any?'<button class="linkbtn" data-act="afClear">Clear</button> · ':'')+'Squares show which subjects have a lens: '+D.map(function(d){return '<span style="white-space:nowrap"><span class="dots" aria-hidden="true" style="display:inline-flex;vertical-align:-1px"><i class="d-'+d[0]+'"></i></span> '+SHORT[d[0]]+'</span>'}).join(' ')+'</p>';
  h+=list.map(function(c){
    var w=sc[c.id]&&sc[c.id].where,found='';
    if(w&&!w.name){
      var ks=D.filter(function(d){return w[d[0]]}).map(function(d){return SHORT[d[0]]});
      if(ks.length||w.link)found='<span class="muted" style="flex-basis:100%;font-size:13px">Found in the '+(ks.length?ks.join(', ')+' lens'+(ks.length>1?'es':''):'links')+'</span>';
    }
    return '<button class="crow'+(CT.cid===c.id?' cur':'')+'" data-act="openConcept" data-id="'+c.id+'"'+(CT.cid===c.id?' aria-current="true"':'')+'><span class="nm">'+esc(c.n)+'</span><span class="chip">'+esc(c.s)+'</span>'+dotsFor(c)+'<span class="conf">'+confLabel(c.id)+'</span>'+found+'</button>';
  }).join('');
  return h;
}
function atlasList(){return atlasFilters()+'<div id="arows">'+atlasRows()+'</div>'}
var ASUB='Every site in the Host seen through five subjects, with the threads between them.';
CT.views.atlas=function(){
  var has=CT.cid&&CT.concepts[CT.cid];
  if(CT.wide()){
    return '<h1>Atlas</h1><p class="sub">'+ASUB+'</p><div class="split"><div class="pane list" id="alist">'+atlasList()+'</div><div class="pane detail" id="adetail">'+(has?conceptPage(CT.cid,true):'<div class="empty"><strong>Choose a site.</strong> Its five subject lenses, its threads to other sites, the strata that cover it and its practice items open here.</div>')+'</div></div>';
  }
  if(has)return conceptPage(CT.cid,false);
  return '<h1>Atlas</h1><p class="sub">'+ASUB+'</p>'+atlasList();
};

/* ---------- shell: console strip for the other tabs ---------- */
function strip(v){
  var c=CT.counts(),d=CT.fmtDate(Date.now()),parts;
  if(v==='atlas')parts=['BASSIET · ATLAS',B.C.length+' SITES CHARTED',c.opened+' RATED'];
  else if(v==='practice')parts=['BASSIET · PRACTICE',c.due+' DUE',c.fresh+' UNTRIED'];
  else if(v==='images')parts=['BASSIET · PLATES',CT.data.images.length+' MOUNTED'];
  else if(v==='mistakes'){var m=CT.data.misses.filter(function(x){return x.at>=Date.now()-30*CT.DAY}).length;parts=['BASSIET · HULL',m+' CRACK'+(m===1?'':'S')+' IN 30 DAYS']}
  else return '';
  return '<div class="console" aria-hidden="true">'+parts.concat([d]).map(function(p){return '<span>'+esc(p)+'</span>'}).join('')+'</div>';
}
function retitle(v,h){
  if(!TITLE[v])return h;
  return h.replace(/<h1([^>]*)>[^<]*<\/h1>/,function(m,a){return '<h1'+a+'>'+TITLE[v]+'</h1>'});
}

/* ---------- hash routes ---------- */
var DIVE=/^(depth-\d+|ch-.+|restain-.+|duel-\d+|host|radio|end)$/;
function replaceHash(h){try{history.replaceState(history.state,'',h?'#'+h:location.pathname+location.search)}catch(e){}}
function parseHash(){
  var raw=(location.hash||'').slice(1),h=raw;
  try{h=decodeURIComponent(h)}catch(e){}
  h=h.replace(/[?&].*$/,'').replace(/\/+$/,'');
  CT.dsub=null;
  if(h.indexOf('concept-')===0){
    if(CT.concepts[h.slice(8)]){CT.view='atlas';CT.cid=h.slice(8);if(h!==raw)replaceHash(h);return}
    CT.cid=null;CT.view='atlas';replaceHash('atlas');
    setTimeout(function(){CT.toast('That site is not in the Atlas.')},0);return;
  }
  CT.cid=null;
  if(DIVE.test(h)){CT.view='today';CT.dsub=h;if(h!==raw)replaceHash(h);return}
  var known=NAV.some(function(n){return n[0]===h});
  CT.view=known?h:'today';
  /* unknown or junk hashes: show the Dive and clean the URL (t10-30, t01-34) */
  if(raw&&(!known||h!==raw))replaceHash(known?h:'today');
}
CT.parseHash=parseHash;

function focusQuiet(el){if(!el)return false;try{el.focus({preventScroll:true})}catch(e){try{el.focus()}catch(x){}}return document.activeElement===el}
CT.render=function(){
  var main=document.getElementById('main');if(!main)return;
  var due=CT.counts().due;
  var nav=document.getElementById('nav');
  if(nav)nav.innerHTML=NAV.map(function(n){
    var b=n[0]==='practice'&&due?'<span class="badge" aria-hidden="true">'+due+'</span>'+vh(', '+due+' due'):'';
    return '<a href="#'+n[0]+'"'+(CT.view===n[0]?' aria-current="page"':'')+'>'+n[1]+b+'</a>';
  }).join('');
  var al=document.getElementById('alist'),st=al?al.scrollTop:0;
  var h='';
  if(CT.ui.local)h+='<div class="notice">Storage is not connected in this view, so what you add disappears when you close the page.</div>';
  else if(CT.ui.readonly)h+='<div class="notice" data-ro>This view cannot save changes. You can read and practise, but nothing is kept.</div>';
  else if(CT.ui.stale)h+='<div class="notice">Your saved data could not be reached yet. What you see may be out of date.</div>';
  /* nothing interactive until storage is decided (t10-01) */
  if(CT.ui.loading&&!CT.ui.stale)h+='<p class="muted mono" style="margin-top:40px" role="status">…descending. Opening the dive and your progress.</p>';
  else{var v=CT.views[CT.view]?CT.view:'today';h+=strip(v)+retitle(v,CT.views[v]())}
  main.innerHTML=h;
  var al2=document.getElementById('alist');if(al2)al2.scrollTop=st;
  /* focus keeping, the loading gate and document.title live in D02's wrapper (app-core.js wrapRender) */
};
CT.requestRender=CT.requestRender||(function(){var rq=0;return function(){if(rq)return;rq=(window.requestAnimationFrame||setTimeout)(function(){rq=0;CT.render()})}})();
function onMQ(){if(CT.view==='atlas')CT.render()}
[mq,nq].forEach(function(m){if(m.addEventListener)m.addEventListener('change',onMQ);else if(m.addListener)m.addListener(onMQ)});

/* scroll memory per history entry: back returns to where you were (t01-08, t06-35) */
try{if('scrollRestoration' in history)history.scrollRestoration='manual'}catch(e){}
var SM={},curKey=null,seq=0,pendingY=null,pendingFocus=null,firstRoute=true;
function entryKey(){
  var s=null;try{s=history.state}catch(e){}
  if(s&&s.bk)return {k:s.bk,old:true};
  var k='b'+Date.now().toString(36)+(seq++);
  try{history.replaceState(Object.assign({},s||{},{bk:k}),'')}catch(e){}
  return {k:k,old:false};
}
/* after a route change move focus to the new heading (t09-04). D02's wrapper already focuses the last h1;
   on the wide Atlas the concept title is an h2.ctitle (one h1 per page, t09-18), so prefer it. */
function afterNav(){
  var main=document.getElementById('main');if(!main)return;
  var h=main.querySelector('.ctitle');
  if(!h&&typeof CT.focusHeading==='function'){try{CT.focusHeading()}catch(e){}return}
  h=h||main.querySelector('h1');
  if(h){if(!h.hasAttribute('tabindex'))h.setAttribute('tabindex','-1');h.style.outline='none';focusQuiet(h)}
  if(h&&h.classList.contains('ctitle')){var t=h.textContent.replace(/\s+/g,' ').trim();if(t)document.title=t.slice(0,60)+' · Atlas · Bassiet'}
}
function route(){
  if(curKey)SM[curKey]=window.scrollY;
  var was=CT.view+'|'+CT.cid+'|'+CT.dsub;
  parseHash();
  var e=entryKey();curKey=e.k;
  CT.render();
  if(was!==CT.view+'|'+CT.cid+'|'+CT.dsub){
    var y=e.old&&SM[e.k]!=null?SM[e.k]:pendingY!=null?pendingY:0;
    pendingY=null;
    window.scrollTo(0,y);
    if(pendingFocus){var pf=document.getElementById(pendingFocus);pendingFocus=null;if(pf){focusQuiet(pf);return}}
    afterNav();
  }
}
CT.route=route;
function go(v){if(location.hash==='#'+v)route();else location.hash=v}
CT.go=go;

var A=CT.actions;
A.go=function(el){go(el.dataset.to)};
A.back=function(){pendingY=CT.ui.alistY!=null?CT.ui.alistY:null;go('atlas')};
A.openConcept=function(el){if(CT.view==='atlas'&&!CT.cid&&!CT.wide())CT.ui.alistY=window.scrollY;go('concept-'+el.dataset.id)};
A.covgo=function(el){CT.ui.af={q:'',d:el.dataset.d,s:el.dataset.s};CT.ui.alistY=null;go('atlas')};
A.afClear=function(){CT.ui.af={q:'',d:'all',s:'all'};CT.render();focusQuiet(document.getElementById('af-q'))};
A.conf=function(el){
  var id=CT.cid,n=CT.nmap[id]||{},v=+el.dataset.v;
  saved(CT.setDoc('notes',id,{note:n.note||'',conf:n.conf===v?0:v,seen:Date.now()})).then(function(ok){if(!ok)errToast('Could not save your rating. Try again.')});
};
A.saveNote=function(el){
  var id=CT.cid,n=CT.nmap[id]||{},box=document.getElementById('n-note'),t=box?box.value:(CT.ui.draft['n-note']||'');
  if(el)el.disabled=true;
  saved(CT.setDoc('notes',id,{note:t.trim(),conf:n.conf||0,seen:Date.now()})).then(function(ok){
    if(ok){delete CT.ui.draft['n-note'];CT.toast('Note saved.')}
    else{CT.ui.draft['n-note']=t;errToast('Could not save the note. Your text is kept here; try again.')}
    CT.render();
  });
};
A.startDue=function(){CT.startSession({d:'all',s:'all',t:'all'},false);go('practice')};
A.openItem=function(el){
  CT.ps={f:{d:'all',s:'all',t:'all'},queue:[{k:el.dataset.k,id:el.dataset.id}],i:0,done:0,cur:null,anyway:true,from:CT.cid};
  CT.openCurrent();go('practice');
};
A.tellCitrus=function(){CT.tellCitrus()};

/* hold (or focus) to explain */
var holdT,held=false,sx=0,sy=0,hint=document.getElementById('hint');
function hideHint(){clearTimeout(holdT);if(hint)hint.hidden=true}
function showHint(el){
  if(!hint)return;
  var p=el.dataset.hint.split('|');
  hint.innerHTML='<b>'+esc(p[0])+'</b>'+esc(p[1]||'');hint.hidden=false;
  var r=el.getBoundingClientRect(),w=hint.offsetWidth,hh=hint.offsetHeight;
  hint.style.left=Math.max(8,Math.min(window.innerWidth-w-8,r.left))+'px';
  hint.style.top=(r.bottom+hh+12<window.innerHeight?r.bottom+8:Math.max(8,r.top-hh-8))+'px';
}
document.addEventListener('pointerdown',function(e){
  hideHint();held=false;
  var el=e.target.closest&&e.target.closest('[data-hint]');if(!el)return;
  sx=e.clientX;sy=e.clientY;
  holdT=setTimeout(function(){
    held=true;showHint(el);
    if(navigator.vibrate)try{navigator.vibrate(8)}catch(x){}
    setTimeout(hideHint,3500);
  },450);
});
document.addEventListener('pointermove',function(e){if(Math.abs(e.clientX-sx)>10||Math.abs(e.clientY-sy)>10)clearTimeout(holdT)});
['pointerup','pointercancel','scroll'].forEach(function(t){document.addEventListener(t,function(){clearTimeout(holdT)},true)});
document.addEventListener('focusin',function(e){var el=e.target;if(el&&el.matches&&el.matches('[data-hint]')&&el.matches(':focus-visible'))showHint(el)});
document.addEventListener('focusout',function(e){if(e.target&&e.target.matches&&e.target.matches('[data-hint]'))hideHint()});

document.addEventListener('click',function(e){
  if(held){held=false;e.preventDefault();e.stopPropagation();return}
  var el=e.target.closest('[data-act]');if(!el)return;
  var a=CT.actions[el.dataset.act];if(a)a(el,e);
},true);
document.addEventListener('keydown',function(e){
  if((e.key==='Enter'||e.key===' ')&&e.target.matches&&e.target.matches('g[data-act]')){e.preventDefault();var a=CT.actions[e.target.dataset.act];if(a)a(e.target,e)}
});
/* search: debounced, re-renders only the result rows so focus and the phone keyboard stay (t10-21) */
var sT=0;
function updateRows(){var r=document.getElementById('arows');if(r)r.innerHTML=atlasRows();else CT.render()}
document.addEventListener('input',function(e){
  var t=e.target;
  if(t.id==='af-q'){CT.ui.af.q=t.value;clearTimeout(sT);sT=setTimeout(updateRows,110);return}
  if(t.type==='file')return;
  if(t.id&&/^(f|i|m|n)-/.test(t.id))CT.ui.draft[t.id]=t.value;
});
document.addEventListener('change',function(e){
  var t=e.target;
  if(t.id==='af-d'){CT.ui.af.d=t.value;CT.render()}
  else if(t.id==='af-s'){CT.ui.af.s=t.value;CT.render()}
  else if(t.type!=='file'&&t.id&&/^(i|m)-/.test(t.id))CT.ui.draft[t.id]=t.value;
});
function clickIf(sel){var b=document.querySelector(sel);if(b&&!b.disabled){b.click();return true}return false}
document.addEventListener('keydown',function(e){
  if(e.metaKey||e.ctrlKey||e.altKey)return;
  var t=e.target,typing=t&&t.matches&&t.matches('input,textarea,select,[contenteditable="true"]');
  if(typing){
    if(t.id==='af-q'&&e.key==='Enter'){clearTimeout(sT);updateRows();var first=document.querySelector('#arows .crow');if(first){e.preventDefault();first.click()}return}
    if(e.key==='Escape')t.blur();
    return;
  }
  if(e.defaultPrevented)return;
  var keysOff=CT.look&&CT.look.keys==='off';
  var i='12345'.indexOf(e.key);
  var inSess=CT.view==='practice'&&CT.ps&&CT.ps.queue&&CT.ps.queue.length&&CT.current();
  if(!keysOff&&i>=0&&e.key.length===1&&!inSess){go(NAV[i][0]);return}
  if(!keysOff&&e.key==='/'){
    e.preventDefault();
    var q=document.getElementById('af-q');
    if(CT.view==='atlas'&&q){focusQuiet(q);q.select()}
    else{CT.cid=null;pendingFocus='af-q';go('atlas')}
    return;
  }
  if(CT.view!=='practice')return;
  if(e.key==='Enter'||e.key==='ArrowRight'){
    var b=document.querySelector('.stage [data-act="next"],.stage [data-act="cmpNext"],.stage [data-act="chainCheck"],.stage [data-act="predCheck"]:not([disabled]),.stage [data-act="imgShow"]');
    if(b&&document.activeElement!==b){e.preventDefault();b.click()}
    return;
  }
  if(!CT.ps||!CT.ps.cur||!CT.current())return;
  var it=CT.current(),k=e.key,cur=CT.ps.cur,dig=k.length===1&&k>='1'&&k<='9'?+k:0;
  if(it.k==='image'&&cur.shown&&dig>=1&&dig<=4){var g=['again','hard','good','easy'][dig-1];clickIf('[data-act="imgGrade"][data-g="'+g+'"]');return}
  if(it.k==='compare'&&cur.picked==null&&dig){var ob=document.querySelectorAll('.stage .opt:not([disabled])')[dig-1];if(ob){e.preventDefault();ob.click()}return}
  /* Trace: 1-9 pick the n-th remaining step, Backspace undo (t06-41) */
  if(it.k==='chain'&&!cur.checked){
    if(dig){var sb=document.querySelectorAll('.stage [data-act="chainPick"]')[dig-1];if(sb){e.preventDefault();sb.click()}return}
    if(k==='Backspace'||k==='Delete'){e.preventDefault();clickIf('.stage [data-act="chainUndo"]');return}
  }
  /* Predict: U / D / N answer the focused row if it is open, else the first open row */
  if(it.k==='predict'&&!cur.checked){
    var v=k.length===1?{u:'u',d:'d',n:'n'}[k.toLowerCase()]:null;if(!v)return;
    var row=-1,ae=document.activeElement,fr=ae&&ae.getAttribute&&ae.getAttribute('data-act')==='predPick'?+ae.getAttribute('data-i'):-1;
    if(fr>=0&&!cur.sel[fr])row=fr;else{row=cur.sel.indexOf(null);if(row<0)row=fr}
    if(row<0)return;
    e.preventDefault();
    var pb=document.querySelector('.stage [data-act="predPick"][data-i="'+row+'"][data-v="'+v+'"]');if(pb)pb.click();
  }
});
window.addEventListener('hashchange',route);
parseHash();
curKey=entryKey().k;
})();
