/* Bassiet figures, part 7 (D20): new interactive figures, attached to chapters at load (contract 2.9).
   o2hb (c9-exchange, c7-red), markers (c8-vessels), murmur (c8-valves), gfr (c10-glom), hbv (c5-virus),
   hpa (c12-adr), shock (c8-failing), cellcycle (c7-onc).
   Kit as in figs4.js: text uses the shared .ft classes; buttons use data-act="fig7" (preset, then the shared
   CT.actions.fig from figs.js); sliders use the shared input handler with F[id].fmt. */
(function(){
'use strict';
var F=window.FIG,CT=window.CT;if(!F||!CT)return;
var FMT=window.FIGFMT=window.FIGFMT||{};
function r1(n){return Math.round(n*10)/10}
function T(x,y,t,o){o=o||{};var z=o.s||13,cl=z>=16?'ft big':z>13?'ft':'ft sm';return '<text x="'+r1(x)+'" y="'+r1(y)+'"'+(o.a?' text-anchor="'+o.a+'"':'')+' class="'+cl+(o.c?' '+o.c:'')+'"'+(o.w||o.f?' style="'+(o.w?'font-weight:'+o.w:'')+(o.w&&o.f?';':'')+(o.f?'fill:'+o.f:'')+'"':'')+'>'+t+'</text>'}
function LN(x1,y1,x2,y2,st){return '<line x1="'+r1(x1)+'" y1="'+r1(y1)+'" x2="'+r1(x2)+'" y2="'+r1(y2)+'" style="'+st+'"/>'}
function PL(pts,st){return '<polyline points="'+pts.map(function(p){return r1(p[0])+','+r1(p[1])}).join(' ')+'" style="fill:none;'+(st||'')+'"/>'}
function PG(pts,st){return '<polygon points="'+pts.map(function(p){return r1(p[0])+','+r1(p[1])}).join(' ')+'" style="'+st+'"/>'}
function AR(x1,y1,x2,y2,col,w,dash){var a=Math.atan2(y2-y1,x2-x1),h=7;return '<line x1="'+r1(x1)+'" y1="'+r1(y1)+'" x2="'+r1(x2-Math.cos(a)*h*.8)+'" y2="'+r1(y2-Math.sin(a)*h*.8)+'" style="stroke:'+col+';stroke-width:'+(w||2)+(dash?';stroke-dasharray:'+dash:'')+'"/><polygon points="'+r1(x2)+','+r1(y2)+' '+r1(x2-h*Math.cos(a-.45))+','+r1(y2-h*Math.sin(a-.45))+' '+r1(x2-h*Math.cos(a+.45))+','+r1(y2-h*Math.sin(a+.45))+'" style="fill:'+col+'"/>'}
function svg(w,h,label){return '<svg viewBox="0 0 '+w+' '+h+'" class="figsvg" role="img" aria-label="'+String(label).replace(/["<>]/g,'')+'">'}
function btn(id,k,v,label,on,set){return '<button type="button" class="fbtn" data-act="fig7" data-fig="'+id+'" data-k="'+k+'" data-v="'+v+'"'+(set?" data-set='"+JSON.stringify(set)+"'":'')+' aria-pressed="'+(!!on)+'">'+label+'</button>'}
function rng(id,k,min,max,step,val,label,txt){var rid='fr-'+id+'-'+k;return '<label for="'+rid+'">'+label+'</label><input type="range" class="figrange" id="'+rid+'" data-fig="'+id+'" data-k="'+k+'" min="'+min+'" max="'+max+'" step="'+step+'" value="'+val+'" aria-label="'+label+'" aria-valuetext="'+txt+'"><b class="mono" aria-hidden="true">'+txt+'</b>'}
function cap(h){return '<p class="fcap" aria-live="polite">'+h+'</p>'}
function stats(a){return '<div class="fstat" style="display:flex;flex-wrap:wrap;gap:4px 16px;margin:6px 0 0;font:500 13px var(--mono);color:var(--muted)">'+a.map(function(x){return '<span>'+x[0]+' <b style="color:'+(x[2]?'var(--accent-text)':'var(--fg)')+';font-weight:700">'+x[1]+'</b></span>'}).join('')+'</div>'}
function key(a){return '<div class="fkey" style="display:flex;flex-wrap:wrap;gap:4px 14px;margin:4px 0 0;font-size:13px;color:var(--muted)">'+a.map(function(x){return '<span><i style="display:inline-block;width:16px;height:0;border-top:3px '+(x[2]||'solid')+' '+x[0]+';vertical-align:middle;margin-right:6px"></i>'+x[1]+'</span>'}).join('')+'</div>'}
function grid(rows,cols){return '<dl class="fgrid" style="display:grid;grid-template-columns:auto 1fr;gap:4px 14px;margin:8px 0 0;font-size:15px">'+rows.map(function(r){return '<dt style="color:var(--muted);font:500 12px var(--mono);letter-spacing:.06em;text-transform:uppercase;align-self:center">'+r[0]+'</dt><dd style="margin:0;color:'+(r[2]?'var(--accent-text)':'var(--fg)')+';font-weight:'+(r[2]?700:400)+'">'+r[1]+'</dd>'}).join('')+'</dl>'}
if(!CT.actions.fig7){
  CT.actions.fig7=function(el,e){
    var id=el.dataset.fig,f=F[id];if(!f)return;var s=CT.figState(id);
    if(el.dataset.set){try{Object.assign(s,JSON.parse(el.dataset.set))}catch(x){}}
    if(CT.actions.fig)return CT.actions.fig(el,e);
    var v=el.dataset.v;s[el.dataset.k]=(v===''||isNaN(+v))?v:+v;
    var box=document.getElementById('fig-'+id);if(!box)return;
    var fc=box.querySelector('.fc'),i=[].indexOf.call(fc.querySelectorAll('button,input'),el);
    fc.innerHTML=f.ctrl(s);box.querySelector('.fv').innerHTML=f.view(s);
    if(i>=0){var n=fc.querySelectorAll('button,input')[i];if(n)try{n.focus({preventScroll:true})}catch(x){n.focus()}}
  };
}
function fmtFor(ids){ids.forEach(function(id){if(F[id])F[id].fmt=function(k,v){var f=FMT[id+'.'+k];return f?f(v,CT.figState(id)):null}})}
var C={fg:'var(--fg)',mu:'var(--muted)',at:'var(--accent-text)',bad:'var(--bad)',good:'var(--good)'};
function seed(i){var x=Math.sin(i*12.9898)*43758.5453;return x-Math.floor(x)}

/* =========================================================================
   1. Oxygen-haemoglobin dissociation curve
   Hill: SO2 = P^n/(P^n+P50^n), n 2.7, P50 26.7 mmHg. Content = 1.34 x Hb x SO2 + 0.003 x PO2.
   ========================================================================= */
function hill(p,p50){var n=2.7,q=Math.pow(Math.max(p,0),n);return q/(q+Math.pow(p50,n))}
function o2m(s){
  var F_=s.h==='F',p50=(F_?19:26.7)+(s.a?4:0)+(s.t?3.5:0)+(s.b?(F_?1.5:4):0),hb=s.x==='anae'?7:15,capf=1;
  if(s.x==='co'){capf=0.7;p50*=0.72}else if(s.x==='met'){capf=0.7;p50*=0.8}
  var so=function(p){return capf*hill(p,p50)},ct=function(p){return 1.34*hb*so(p)+0.003*p};
  var v=s.v||40,spo=s.x==='co'?Math.min(100,(so(100)+0.3)*100):s.x==='met'?85:so(100)*100;
  return {p50:p50,hb:hb,cap:capf,so:so,ct:ct,v:v,sa:so(100),sv:so(v),ca:ct(100),cv:ct(v),spo:spo};
}
FMT['o2hb.v']=function(v){return v+' mmHg'};
F.o2hb={title:'Oxygen and haemoglobin',def:{a:0,t:0,b:0,h:'A',x:'none',v:40},
ctrl:function(s){return '<div class="frow"><span>Shift</span>'+btn('o2hb','a',s.a?0:1,'↑ CO₂, ↓ pH',!!s.a)+btn('o2hb','t',s.t?0:1,'↑ Temperature',!!s.t)+btn('o2hb','b',s.b?0:1,'↑ 2,3-BPG',!!s.b)+btn('o2hb','pre','ex','Exercising muscle',s.a&&s.t&&s.b&&s.v<=22,{a:1,t:1,b:1,v:20})+btn('o2hb','pre','rs','Reset',!s.a&&!s.t&&!s.b&&s.h==='A'&&s.x==='none'&&s.v===40,{a:0,t:0,b:0,h:'A',x:'none',v:40})+'</div>'+
  '<div class="frow"><span>Haemoglobin</span>'+btn('o2hb','h','A','Adult (HbA)',s.h!=='F')+btn('o2hb','h','F','Fetal (HbF)',s.h==='F')+'</div>'+
  '<div class="frow"><span>Blood</span>'+[['none','Normal'],['anae','Anaemia (Hb 7)'],['co','Carbon monoxide 30%'],['met','Methaemoglobin 30%']].map(function(q){return btn('o2hb','x',q[0],q[1],s.x===q[0])}).join('')+'</div>'+
  '<div class="frow">'+rng('o2hb','v',15,45,1,s.v||40,'Tissue PO₂',(s.v||40)+' mmHg')+'</div>'},
view:function(s){
  var m=o2m(s),nm=o2m({h:'A',x:'none',v:m.v}),changed=s.a||s.t||s.b||s.h==='F'||s.x!=='none';
  function X(p){return 44+p/110*250}function Y(f){return 196-f*176}function Yc(c){return 196-c/21*176}
  var g=svg(340,232,'Oxygen dissociation curve: P50 '+m.p50.toFixed(0)+' mmHg, arterial saturation '+Math.round(m.sa*100)+'%, venous '+Math.round(m.sv*100)+'%');
  g+=LN(44,196,296,196,'stroke:var(--muted);stroke-width:1.5')+LN(44,20,44,196,'stroke:var(--muted);stroke-width:1.5');
  [0,25,50,75,100].forEach(function(f){g+=LN(40,Y(f/100),44,Y(f/100),'stroke:var(--muted)')+T(38,Y(f/100)+4,f,{a:'end',s:12,f:C.mu});if(f)g+=LN(44,Y(f/100),296,Y(f/100),'stroke:var(--line);stroke-dasharray:2 4')});
  [20,40,60,80,100].forEach(function(p){g+=T(X(p),212,p,{a:'middle',s:12,f:C.mu})});
  g+=T(48,14,'SO₂ (%)',{s:12,f:C.mu})+T(296,228,'PO₂ (mmHg)',{a:'end',s:12,f:C.mu});
  var showC=s.x==='anae'||s.x==='co'||s.x==='met';
  if(showC){g+=LN(296,20,296,196,'stroke:var(--muted);stroke-width:1.5');[0,5,10,15,20].forEach(function(c){g+=LN(296,Yc(c),300,Yc(c),'stroke:var(--muted)')+T(304,Yc(c)+4,c,{s:12,f:'var(--pharm-t)'})});g+=T(336,14,'mL/dL',{a:'end',s:12,f:'var(--pharm-t)'})}
  /* unloading band */
  g+='<rect x="44" y="'+r1(Y(m.sa))+'" width="252" height="'+r1(Math.max(0,Y(m.sv)-Y(m.sa)))+'" style="fill:var(--accent);fill-opacity:.1"/>';
  function curve(f,st){var p=[];for(var x=0;x<=110;x+=2)p.push([X(x),Y(f(x))]);return PL(p,st)}
  if(changed)g+=curve(nm.so,'stroke:var(--muted);stroke-width:2;stroke-dasharray:5 4');
  if(showC){var pc=[];for(var x=0;x<=110;x+=2)pc.push([X(x),Yc(m.ct(x))]);g+=PL(pc,'stroke:var(--pharm);stroke-width:2.4;stroke-dasharray:8 3')}
  g+=curve(m.so,'stroke:var(--accent);stroke-width:3');
  /* P50 */
  var py=Y(m.cap*0.5);g+=LN(X(m.p50),py,X(m.p50),196,'stroke:var(--accent);stroke-dasharray:3 3')+LN(44,py,X(m.p50),py,'stroke:var(--accent);stroke-dasharray:3 3')+'<circle cx="'+r1(X(m.p50))+'" cy="'+r1(py)+'" r="4" style="fill:var(--accent)"/>'+T(X(m.p50)+6,py+14,'P50 '+m.p50.toFixed(0),{s:12.5,w:700,f:C.at});
  /* artery and tissue points */
  g+='<circle cx="'+r1(X(100))+'" cy="'+r1(Y(m.sa))+'" r="6" style="fill:var(--phys);stroke:var(--surface);stroke-width:2"/>'+T(X(100),Y(m.sa)-10,'artery',{a:'middle',s:12,f:'var(--phys-t)'});
  g+='<circle cx="'+r1(X(m.v))+'" cy="'+r1(Y(m.sv))+'" r="6" style="fill:var(--pharm);stroke:var(--surface);stroke-width:2"/>'+T(X(m.v)+9,Y(m.sv)+4,'tissue',{s:12,f:'var(--pharm-t)'});
  g+=AR(58,Y(m.sa)+2,58,Y(m.sv)-2,'var(--accent)',2)+T(64,(Y(m.sa)+Y(m.sv))/2+4,'unloaded',{s:12,f:C.at});
  g+='</svg>';
  var t=[];
  if(s.a||s.t||s.b)t.push('Right shift: '+[s.a?'CO₂ and H⁺ (Bohr effect)':'',s.t?'heat':'',s.b?'2,3-BPG':''].filter(Boolean).join(', ')+' stabilise the low-affinity T form, so the P50 rises and the same tissue PO₂ releases more oxygen.');
  if(s.h==='F')t.push('Fetal haemoglobin (α₂γ₂) binds 2,3-BPG poorly, so its curve sits to the left: it takes oxygen from maternal blood across the placenta.');
  if(s.x==='anae')t.push('Anaemia: PaO₂ and saturation are normal, but with half the haemoglobin the oxygen content (dashed blue, right axis) is roughly halved.');
  if(s.x==='co')t.push('Carbon monoxide occupies 30% of the haem sites (ceiling 70%) and makes the rest hold oxygen tighter (left shift): content falls twice over. PaO₂ is normal and the pulse oximeter reads falsely normal; co-oximetry shows the truth. Treat with 100% or hyperbaric oxygen.');
  if(s.x==='met')t.push('Methaemoglobin (Fe³⁺) cannot carry oxygen and shifts the remaining sites left; the pulse oximeter drifts towards about 85% whatever the true value. Chocolate-brown blood; methylene blue (not in G6PD deficiency).');
  if(!t.length)t.push('Sigmoid because binding is cooperative. On the flat top, a fall in PaO₂ from 100 to 70 barely changes saturation; on the steep middle, small PO₂ falls in the tissues release a lot of oxygen.');
  var nUn=nm.ca-nm.cv,un=m.ca-m.cv;
  return g+key([['var(--accent)','this blood'],['var(--muted)','normal adult','dashed']].concat(showC?[['var(--pharm)','O₂ content (right axis)','dashed']]:[]))+
    stats([['P50',m.p50.toFixed(0)+' mmHg',m.p50!==26.7],['SaO₂',Math.round(m.sa*100)+'%'],['pulse ox',Math.round(m.spo)+'%',s.x==='co'||s.x==='met'],['CaO₂',m.ca.toFixed(1)+' mL/dL'],['CvO₂',m.cv.toFixed(1)],['unloaded',un.toFixed(1)+' mL/dL',Math.abs(un-nUn)>0.4]])+
    cap(t.join(' ')+' <span class="muted">Myoglobin, with one haem and no cooperativity, would be a hyperbola far to the left (P50 about 1–3 mmHg).</span>');
}};

/* =========================================================================
   2. Cardiac markers after an MI: troponin and CK-MB, with a reinfarction
   ========================================================================= */
var MKH=[0,2,4,6,12,24,48,72,96,120,168,240,336],MKL=['0 h','2 h','4 h','6 h','12 h','1 day','2 days','3 days','4 days','5 days','7 days','10 days','14 days'];
function trop(t,re){var v=t<3?0:t<24?Math.pow((t-3)/21,1.3):t<96?1-0.15*(t-24)/72:Math.max(0,0.85*(1-(t-96)/144));if(re&&t>96)v+=0.3*Math.exp(-Math.pow((t-124)/26,2));return v}
function ckmb(t,re){function one(u){return u<4?0:u<24?Math.pow((u-4)/20,1.5):u<72?Math.max(0,1-(u-24)/48):0}return one(t)+(re?one(t-96):0)}
FMT['markers.i']=function(v){return MKL[v]};
F.markers={title:'Troponin and CK-MB',def:{i:5,re:0},
ctrl:function(s){var i=Math.max(0,Math.min(12,s.i|0));return '<div class="frow">'+rng('markers','i',0,12,1,i,'Time since pain',MKL[i])+'</div><div class="frow"><span>Course</span>'+btn('markers','re',0,'One infarct',!s.re)+btn('markers','re',1,'Reinfarction on day 4',!!s.re)+'</div>'},
view:function(s){
  var i=Math.max(0,Math.min(12,s.i|0)),t=MKH[i],re=!!s.re;
  function X(h){return 44+Math.log(1+h)/Math.log(337)*286}function Y(v){return 176-v*140}
  var tv=trop(t,re),cv=ckmb(t,re),ul=0.06,g=svg(340,214,'Cardiac markers at '+MKL[i]+': troponin '+(tv>ul?'raised':'normal')+', CK-MB '+(cv>ul?'raised':'normal'));
  g+=LN(44,176,330,176,'stroke:var(--muted);stroke-width:1.5')+LN(44,24,44,176,'stroke:var(--muted);stroke-width:1.5');
  g+=LN(44,Y(ul),330,Y(ul),'stroke:var(--good);stroke-dasharray:4 3')+T(330,Y(ul)-4,'upper limit of normal',{a:'end',s:12,f:C.good});
  if(re)g+=LN(X(96),24,X(96),176,'stroke:var(--bad);stroke-dasharray:3 3')+T(X(96)-4,36,'new infarct',{a:'end',s:12,f:C.bad});
  var pt=[],pc=[];for(var h=0;h<=336;h+=h<24?0.5:2){pt.push([X(h),Y(trop(h,re))]);pc.push([X(h),Y(ckmb(h,re))])}
  g+=PL(pt,'stroke:var(--accent);stroke-width:3')+PL(pc,'stroke:var(--bio);stroke-width:2.6;stroke-dasharray:7 3');
  g+=LN(X(t),20,X(t),176,'stroke:var(--fg);stroke-width:1.5;opacity:.6')+'<circle cx="'+r1(X(t))+'" cy="'+r1(Y(tv))+'" r="5" style="fill:var(--accent)"/><circle cx="'+r1(X(t))+'" cy="'+r1(Y(cv))+'" r="5" style="fill:var(--bio)"/>';
  [[0,'0'],[4,'4 h'],[24,'1 d'],[72,'3 d'],[168,'7 d'],[336,'14 d']].forEach(function(q){g+=LN(X(q[0]),176,X(q[0]),180,'stroke:var(--muted)')+T(X(q[0]),194,q[1],{a:'middle',s:12,f:C.mu})});
  g+=T(48,18,'level (share of peak)',{s:12,f:C.mu})+T(330,210,'time (log scale)',{a:'end',s:12,f:C.mu});
  g+='</svg>';
  var msg=t<3?'Too early: both markers can still be normal. A normal troponin in the first hours does not exclude an MI; repeat it (high-sensitivity assays at 0 and 1–3 h) and read the ECG.':t<=6?'Troponin is starting to rise (from about 2–4 h); CK-MB follows a little later.':t<=24?'Both near their peak at about a day.':t<=72?'CK-MB is falling fast and is back to normal by 2–3 days; troponin stays high.':re&&t<=168?'CK-MB has risen again: the new peak marks a reinfarction. Troponin, still raised from the first event, barely shows it.':t<=240?'Only troponin is still raised: it lingers 7–10 days, so it dates an infarct but cannot show an early second one.':'Both back to normal.';
  return g+key([['var(--accent)','troponin I or T'],['var(--bio)','CK-MB','dashed'],['var(--good)','upper limit','dashed']])+stats([['troponin',tv>ul?'raised':'normal',tv>ul],['CK-MB',cv>ul?'raised':'normal',cv>ul]])+cap('<b>'+MKL[i]+'.</b> '+msg);
}};

/* =========================================================================
   3. Murmurs: Wiggers pressures + phonocardiogram + bedside manoeuvres
   ========================================================================= */
var MU={n:['Normal'],as:['Aortic stenosis','Crescendo-decrescendo systolic, after an ejection click; right 2nd intercostal space → carotids. Soft, late-peaking in severe disease (pulsus parvus et tardus).'],
mr:['Mitral regurgitation','Holosystolic, blowing; apex → axilla.'],tr:['Tricuspid regurgitation','Holosystolic; left lower sternal border; louder on inspiration (Carvallo sign).'],
mvp:['Mitral valve prolapse','Mid-systolic click, then a late systolic murmur; apex.'],hocm:['HOCM','Crescendo-decrescendo systolic; left sternal border; no carotid radiation. Septal hypertrophy plus systolic anterior motion of the mitral leaflet obstruct outflow.'],
vsd:['VSD','Harsh holosystolic; left lower sternal border. Small defects are the loudest.'],ar:['Aortic regurgitation','Early diastolic decrescendo, blowing; left sternal border. Wide pulse pressure.'],
ms:['Mitral stenosis','Opening snap after S2, then a low mid-diastolic rumble with presystolic accentuation; apex, best in left lateral decubitus. Loud S1.'],pda:['PDA','Continuous machine-like murmur, loudest around S2; left infraclavicular.']};
var MV={none:['None',''],insp:['Inspiration','More blood returns to the right heart.'],squat:['Squat / leg raise','Preload rises (squatting also raises afterload).'],grip:['Hand grip','Afterload rises.'],vals:['Valsalva / standing','Preload falls.'],amyl:['Amyl nitrite','Afterload falls (arteriolar dilation).']};
var MF={insp:{tr:1.6,n:1,mvp:1},squat:{as:1.4,mr:1.3,ar:1.3,vsd:1.3,ms:1.2,pda:1.2,tr:1.1,hocm:0.5,mvp:0.8},grip:{mr:1.5,ar:1.5,vsd:1.5,pda:1.3,ms:1.1,tr:1,as:0.6,hocm:0.5,mvp:0.8},vals:{hocm:1.7,mvp:1.3,tr:0.7},amyl:{as:1.5,hocm:1.6,ms:1.3,mvp:1.2,tr:1,mr:0.6,ar:0.6,vsd:0.6,pda:0.6}};
function mfac(l,m){if(m==='none'||l==='n')return 1;var t=MF[m];if(t[l]!=null)return t[l];return m==='insp'?0.85:m==='vals'?0.6:1}
function clickT(m){return m==='vals'?205:m==='amyl'?215:m==='squat'||m==='grip'?320:265}
function env(l,t,m){
  var S1=100,S2=420;
  if(l==='as'){if(t<150||t>405)return 0;return Math.sin(Math.PI*(t-150)/255)*(t<280?1:1)}
  if(l==='mr'||l==='tr'||l==='vsd')return t>104&&t<416?(l==='vsd'?1:0.8):0;
  if(l==='mvp'){var c=clickT(m);return t>c+8&&t<416?0.45+0.55*(t-c)/(416-c):0}
  if(l==='hocm'){if(t<165||t>410)return 0;var u=(t-165)/245;return Math.sin(Math.PI*Math.pow(u,1.3))}
  if(l==='ar')return t>424&&t<760?Math.max(0,1-(t-424)/336):0;
  if(l==='ms')return (t>500&&t<700?0.45*(1-(t-500)/260):0)+(t>720?0.25+0.6*(t-720)/80:0)+(t<92?0.85*(t/92):0);
  if(l==='pda')return t<S1?0.35:t<S2?0.35+0.65*(t-S1)/(S2-S1):Math.max(0.35,1-(t-S2)/500);
  return 0}
function pressures(l){
  /* [t,P] control points over one 800 ms cycle: Ao, LV, LA */
  var Ao=[[0,86],[100,82],[150,80],[220,116],[300,120],[400,102],[420,98],[432,94],[445,100],[600,92],[800,86]],
      LV=[[0,6],[100,9],[150,80],[220,118],[300,121],[400,100],[420,92],[470,8],[520,4],[800,7]],
      LA=[[0,6],[60,10],[100,7],[130,9],[200,5],[400,14],[470,9],[520,6],[700,7],[800,6]];
  if(l==='as'){LV=[[0,10],[100,14],[150,90],[230,170],[290,182],[380,140],[420,96],[470,10],[520,6],[800,10]];Ao=[[0,84],[100,80],[160,80],[240,100],[310,112],[400,104],[420,98],[432,94],[445,98],[600,90],[800,84]]}
  if(l==='ar'){Ao=[[0,58],[100,52],[130,50],[210,140],[290,150],[400,112],[420,104],[432,96],[445,100],[600,74],[800,58]];LV=[[0,22],[100,30],[130,50],[210,138],[290,148],[400,110],[420,100],[470,14],[520,18],[800,26]]}
  if(l==='mr'){LA=[[0,8],[60,12],[100,10],[160,24],[300,40],[400,46],[460,22],[520,10],[800,8]]}
  if(l==='ms'){LA=[[0,26],[60,30],[100,24],[200,18],[400,28],[480,26],[520,24],[700,22],[760,28],[800,26]];LV=[[0,6],[100,8],[150,80],[220,112],[300,116],[400,98],[420,90],[470,6],[520,4],[800,7]]}
  if(l==='hocm'){LV=[[0,10],[100,14],[150,90],[220,125],[330,175],[390,150],[420,96],[470,10],[520,6],[800,10]];Ao=[[0,84],[100,80],[150,80],[200,118],[240,112],[300,110],[400,104],[420,98],[432,94],[445,98],[600,90],[800,84]]}
  if(l==='pda'){Ao=[[0,64],[100,58],[150,58],[220,116],[300,122],[400,100],[420,94],[432,90],[445,94],[600,76],[800,64]]}
  return {Ao:Ao,LV:LV,LA:LA}}
function lerp(a,t){for(var i=1;i<a.length;i++)if(t<=a[i][0]){var p=a[i-1],q=a[i],u=(t-p[0])/(q[0]-p[0]);u=u*u*(3-2*u);return p[1]+(q[1]-p[1])*u}return a[a.length-1][1]}
F.murmur={title:'Listen to the valves',def:{l:'as',m:'none'},
ctrl:function(s){return '<div class="frow"><span>Lesion</span>'+Object.keys(MU).map(function(k){return btn('murmur','l',k,MU[k][0],s.l===k)}).join('')+'</div><div class="frow"><span>Manoeuvre</span>'+Object.keys(MV).map(function(k){return btn('murmur','m',k,MV[k][0],s.m===k)}).join('')+'</div>'},
view:function(s){
  var l=s.l||'n',m=s.m||'none',P=pressures(l),f=mfac(l,m),g=svg(340,300,'Wiggers diagram and phonocardiogram, '+MU[l][0]+(m!=='none'?', '+MV[m][0]:''));
  function X(t){return 40+t*0.37}function Y(p){return 168-p*0.78}
  g+=T(4,12,'PRESSURE (mmHg)',{s:12,w:700,f:C.at});
  g+=LN(40,168,336,168,'stroke:var(--muted);stroke-width:1.5')+[0,100].map(function(p){return T(36,Y(p)+4,p,{a:'end',s:12,f:C.mu})}).join('');
  g+='<rect x="'+X(100)+'" y="20" width="'+r1(X(420)-X(100))+'" height="148" style="fill:var(--surface2);opacity:.45"/>'+T(X(260),32,'systole',{a:'middle',s:12,f:C.mu})+T(X(610),32,'diastole',{a:'middle',s:12,f:C.mu});
  function line(a,st){var p=[];for(var t=0;t<=800;t+=5)p.push([X(t),Y(lerp(a,t))]);return PL(p,st)}
  function shade(a,b,t0,t1){var top=[],bot=[];for(var t=t0;t<=t1;t+=5){top.push([X(t),Y(lerp(a,t))]);bot.push([X(t),Y(lerp(b,t))])}return PG(top.concat(bot.reverse()),'fill:var(--bad);fill-opacity:.3')}
  if(l==='as')g+=shade(P.LV,P.Ao,160,410);if(l==='hocm')g+=shade(P.LV,P.Ao,230,410);if(l==='ar')g+=shade(P.Ao,P.LV,440,800);
  if(l==='mr')g+=shade(P.LV,P.LA,110,440);if(l==='ms')g+=shade(P.LA,P.LV,470,800);
  g+=line(P.Ao,'stroke:var(--phys);stroke-width:2.4')+line(P.LV,'stroke:var(--accent);stroke-width:2.6')+line(P.LA,'stroke:var(--bio);stroke-width:2.2');
  g+=T(X(300)+4,Y(lerp(P.LV,300))-6,'LV',{s:12.5,w:700,f:C.at})+T(X(640),Y(lerp(P.Ao,640))-6,'aorta',{s:12.5,w:700,f:'var(--phys-t)'})+T(X(640),Y(lerp(P.LA,640))-6,'LA',{s:12.5,w:700,f:'var(--bio-t)'});
  /* phonocardiogram */
  var y0=236,A=40*f;g+=T(4,190,'SOUND',{s:12,w:700,f:C.at})+LN(40,y0,336,y0,'stroke:var(--line)');
  var d='';for(var t=0;t<=800;t+=4){var e=env(l,t,m);if(e>0.02){var a=Math.min(48,A*e*(0.55+0.45*seed(t)));d+='M'+r1(X(t))+','+r1(y0-a)+'V'+r1(y0+a)}}
  if(d)g+='<path d="'+d+'" style="stroke:var(--accent);stroke-width:1.6"/>';
  function snd(t,h,lab){return LN(X(t),y0-h,X(t),y0+h,'stroke:var(--fg);stroke-width:3.2')+(lab?T(X(t),y0+h+14,lab,{a:'middle',s:12,w:700}):'')}
  var s1=l==='ms'?30:22,s2=l==='as'?12:l==='ar'?16:22;
  g+=snd(100,s1,'S1');
  if(m==='insp'&&(l==='n'||l==='tr'||l==='vsd'||l==='mr'))g+=snd(414,s2,'A2')+snd(452,s2*0.8,'P2');else g+=snd(420,s2,'S2');
  if(l==='as')g+=snd(152,16,'')+T(X(152),y0-24,'click',{a:'middle',s:12,f:C.mu});
  if(l==='mvp'){var c=clickT(m);g+=snd(c,20,'')+T(X(c),y0-26,'click',{a:'middle',s:12,f:C.mu})}
  if(l==='ms')g+=snd(492,18,'')+T(X(492),y0-24,'OS',{a:'middle',s:12,f:C.mu});
  g+=LN(X(600),292,X(800),292,'stroke:var(--fg);stroke-width:2')+T(X(800),286,'200 ms',{a:'end',s:12,f:C.mu});
  g+='</svg>';
  var eff=l==='n'?'':f>1.15?'<b>Louder</b> with this manoeuvre.':f<0.9?'<b>Softer</b> with this manoeuvre.':'Little change with this manoeuvre.';
  if(l==='mvp'&&m!=='none'&&m!=='insp')eff=clickT(m)<265?'<b>Click earlier, murmur longer</b>: a smaller ventricle lets the leaflet prolapse sooner.':'<b>Click later, murmur shorter</b>: a fuller ventricle keeps the leaflet taut longer.';
  if(l==='hocm'&&(m==='vals'||m==='amyl'))eff='<b>Louder</b>: a smaller or less loaded ventricle narrows the outflow tract further.';
  if(l==='hocm'&&(m==='squat'||m==='grip'))eff='<b>Softer</b>: a fuller ventricle (or higher afterload) holds the outflow tract open.';
  if(l==='n'&&m==='insp')eff='Physiological splitting: inspiration delays pulmonary valve closure, so S2 splits into A2 and P2.';
  var sh=l==='as'?' Shaded: the systolic gradient between LV and aorta.':l==='hocm'?' Shaded: the late-systolic outflow gradient.':l==='ar'?' Shaded: aortic blood falling back into the ventricle in diastole.':l==='mr'?' Shaded: LV pressure driving blood back into the atrium (giant v wave).':l==='ms'?' Shaded: the diastolic gradient from atrium to ventricle.':'';
  return g+key([['var(--phys)','aorta'],['var(--accent)','left ventricle'],['var(--bio)','left atrium']])+cap((l==='n'?'<b>Normal.</b> S1 is mitral and tricuspid closure; S2 is aortic then pulmonary closure.':'<b>'+MU[l][0]+'.</b> '+MU[l][1])+sh+(m!=='none'?'<br><b>'+MV[m][0]+':</b> '+MV[m][1]+' '+eff:'')+(l==='tr'||l==='vsd'?' <span class="muted">Right-heart pressures are not drawn.</span>':''));
}};
fmtFor(['o2hb','markers','murmur']);

/* Attach the new figures to chapter sections at load (contract 2.9): never replace an existing figure. */
function attach(chId,re,figId,fallbackH){
  var B=window.BOOK&&window.BOOK[chId];if(!B||!F[figId])return;
  if(B.S.some(function(s){return s.fig===figId}))return;
  var sec=B.S.find(function(s){return !s.fig&&re.test(s.h)});
  if(sec)sec.fig=figId;
  else if(fallbackH)B.S.push({h:fallbackH,p:[],fig:figId});
}
attach('c9-exchange',/carrying oxygen|oxygen/i,'o2hb');
attach('c8-vessels',/reading the injury|marker/i,'markers');
attach('c8-valves',/manoeuvre|maneuver/i,'murmur');
})();
