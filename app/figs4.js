/* Bassiet figures, part 4: heart, lungs, kidney.
   Shared kit (repeated in figs5–7): text sizes are set inline in viewBox units so labels stay at
   least 11 px on a 375 px phone (viewBox 340 wide), whatever the global .ft size is.
   Buttons use data-act="fig7": the handler rebuilds controls and view, then puts focus back on
   the pressed button. data-set='{"k":v,...}' applies a preset. */
(function(){
'use strict';
var F=window.FIG,CT=window.CT;
var FMT=window.FIGFMT=window.FIGFMT||{};
function r1(n){return Math.round(n*10)/10}
/* text uses the shared classes (D01 sizes them per device): size hint <=13 -> .ft.sm, 13-16 -> .ft, >=16 -> .ft.big */
function T(x,y,t,o){o=o||{};var z=o.s||13,cl=z>=16?'ft big':z>13?'ft':'ft sm';return '<text x="'+r1(x)+'" y="'+r1(y)+'"'+(o.a?' text-anchor="'+o.a+'"':'')+' class="'+cl+(o.c?' '+o.c:'')+'"'+(o.w||o.f?' style="'+(o.w?'font-weight:'+o.w:'')+(o.w&&o.f?';':'')+(o.f?'fill:'+o.f:'')+'"':'')+'>'+t+'</text>'}
function LN(x1,y1,x2,y2,st){return '<line x1="'+r1(x1)+'" y1="'+r1(y1)+'" x2="'+r1(x2)+'" y2="'+r1(y2)+'" style="'+st+'"/>'}
function PL(pts,st,cls){return '<polyline'+(cls?' class="'+cls+'"':'')+' points="'+pts.map(function(p){return r1(p[0])+','+r1(p[1])}).join(' ')+'" style="fill:none;'+(st||'')+'"/>'}
function svg(w,h,label){return '<svg viewBox="0 0 '+w+' '+h+'" class="figsvg" role="img" aria-label="'+String(label).replace(/["<>]/g,'')+'">'}
function btn(id,k,v,label,on,set){return '<button type="button" class="fbtn" data-act="fig7" data-fig="'+id+'" data-k="'+k+'" data-v="'+v+'"'+(set?" data-set='"+JSON.stringify(set)+"'":'')+' aria-pressed="'+(!!on)+'">'+label+'</button>'}
function rng(id,k,min,max,step,val,label,txt){var rid='fr-'+id+'-'+k;return '<label for="'+rid+'">'+label+'</label><input type="range" class="figrange" id="'+rid+'" data-fig="'+id+'" data-k="'+k+'" min="'+min+'" max="'+max+'" step="'+step+'" value="'+val+'" aria-label="'+label+'" aria-valuetext="'+txt+'"><b class="mono" aria-hidden="true">'+txt+'</b>'}
function cap(h){return '<p class="fcap" aria-live="polite">'+h+'</p>'}
function stats(a){return '<div class="fstat" style="display:flex;flex-wrap:wrap;gap:4px 16px;margin:6px 0 0;font:500 13px var(--mono);color:var(--muted)">'+a.map(function(x){return '<span>'+x[0]+' <b style="color:var(--fg);font-weight:700">'+x[1]+'</b></span>'}).join('')+'</div>'}
function key(a){return '<div class="fkey" style="display:flex;flex-wrap:wrap;gap:4px 14px;margin:4px 0 0;font-size:13px;color:var(--muted)">'+a.map(function(x){return '<span><i style="display:inline-block;width:16px;height:0;border-top:3px '+(x[2]||'solid')+' '+x[0]+';vertical-align:middle;margin-right:6px"></i>'+x[1]+'</span>'}).join('')+'</div>'}
/* Buttons: data-act="fig7" applies an optional preset (data-set) and then hands over to the shared
   CT.actions.fig from figs.js (focus kept, live caption, state-aware label). Sliders use the shared input
   handler; their shown text comes from F[id].fmt -> FMT. */
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
var C={fg:'var(--fg)',mu:'var(--muted)',ln:'var(--line)',ac:'var(--accent)',at:'var(--accent-text)',bad:'var(--bad)',good:'var(--good)',s2:'var(--surface2)',sf:'var(--surface)'};

/* ---------- pressure-volume loop ---------- */
var PVL={none:'No lesion',as:'Aortic stenosis',ar:'Aortic regurgitation',mr:'Mitral regurgitation',ms:'Mitral stenosis'};
function pvm(edv,aft,con,les){
  var E=2*con/10,V0=10,stiff=les==='as'?1.8:1;
  var ped=function(v){return stiff*1.5*Math.exp(0.019*(v-40))};
  var EDV=edv,open=0.8*aft,peak=1.2*aft,esp=aft;
  if(les==='as'){peak=1.2*aft+60;esp=aft+25}
  else if(les==='ar'){EDV=Math.min(edv+70,250);open=0.5*aft;peak=1.4*aft}
  else if(les==='mr'){EDV=Math.min(edv+40,240);esp=0.85*aft}
  else if(les==='ms'){EDV=edv-40}
  var esv=V0+esp/E,weak=false;
  if(les==='ms'&&EDV<esv+20)EDV=esv+20;
  if(esv>EDV-12){esv=EDV-12;esp=(esv-V0)*E;weak=true;peak=Math.min(peak,esp*1.12);open=Math.min(open,esp*0.85)}
  var sv=EDV-esv,fwd=sv;
  if(les==='mr')fwd=sv*0.55;
  if(les==='ar')fwd=Math.max(sv-(EDV-edv)*0.9,sv*0.45);
  return {E:E,V0:V0,ped:ped,EDV:EDV,open:open,peak:peak,esp:esp,esv:esv,sv:sv,fwd:fwd,ef:sv/EDV,edp:ped(EDV),weak:weak,
    Bv:les==='mr'?EDV-0.22*sv:EDV,Dv:les==='ar'?esv+0.22*sv:les==='mr'?esv-0.08*sv:esv};
}
function pvPts(m){
  var A=[m.EDV,m.edp],B=[m.Bv,m.open],C=[m.esv,m.esp],D=[m.Dv,m.ped(m.Dv)],p=[A,B];
  var h=(m.peak-(m.open+m.esp)/8)/0.75,c1=[B[0]-0.1*m.sv,h],c2=[C[0]+0.32*m.sv,h];
  for(var i=1;i<=24;i++){var t=i/24,u=1-t;p.push([u*u*u*B[0]+3*u*u*t*c1[0]+3*u*t*t*c2[0]+t*t*t*C[0],u*u*u*B[1]+3*u*u*t*c1[1]+3*u*t*t*c2[1]+t*t*t*C[1]])}
  p.push(D);for(i=1;i<=12;i++){var v=D[0]+(A[0]-D[0])*i/12;p.push([v,m.ped(v)])}
  return {pts:p,A:A,B:B,C:C,D:D};
}
FMT['pvloop.edv']=function(v){return v+' mL'};FMT['pvloop.aft']=function(v){return v+' mmHg'};FMT['pvloop.con']=function(v){return (v/10).toFixed(1)+'× normal'};
F.pvloop={title:'The pressure-volume loop',def:{edv:130,aft:100,con:10,les:'none'},
ctrl:function(s){return '<div class="frow">'+rng('pvloop','edv',90,190,5,s.edv,'Preload (EDV)',s.edv+' mL')+'</div><div class="frow">'+rng('pvloop','aft',70,170,5,s.aft,'Afterload',s.aft+' mmHg')+'</div><div class="frow">'+rng('pvloop','con',5,16,1,s.con,'Contractility',(s.con/10).toFixed(1)+'× normal')+'</div><div class="frow"><span>Valve</span>'+Object.keys(PVL).map(function(k){return btn('pvloop','les',k,PVL[k],(s.les||'none')===k)}).join('')+'</div>'},
view:function(s){
  var les=s.les||'none',m=pvm(s.edv,s.aft,s.con,les),gh=null;
  if(les!=='none')gh=pvm(s.edv,s.aft,s.con,'none');else if(s.edv!==130||s.aft!==100||s.con!==10)gh=pvm(130,100,10,'none');
  function X(v){return 44+v/260*286}function Y(p){return 204-p/270*188}
  var g=svg(340,228,'Pressure-volume loop, '+PVL[les]+': stroke volume '+Math.round(m.sv)+' mL, ejection fraction '+Math.round(m.ef*100)+'%');
  g+=LN(44,204,332,204,'stroke:var(--muted);stroke-width:1.5')+LN(44,10,44,204,'stroke:var(--muted);stroke-width:1.5');
  [100,200].forEach(function(v){g+=LN(X(v),204,X(v),208,'stroke:var(--muted)')+T(X(v),222,v+' mL',{a:'middle',s:12,f:C.mu})});
  [100,200].forEach(function(p){g+=LN(40,Y(p),44,Y(p),'stroke:var(--muted)')+T(38,Y(p)+4,p,{a:'end',s:12,f:C.mu})});
  g+=T(50,16,'LV pressure (mmHg)',{s:12,f:C.mu})+T(332,222,'volume',{a:'end',s:12,f:C.mu});
  /* EDPVR */
  var ed=[];for(var v=20;v<=255;v+=5){var pp=m.ped(v);if(pp>262)break;ed.push([X(v),Y(pp)])}
  g+=PL(ed,'stroke:var(--muted);stroke-width:1.5;stroke-dasharray:2 4');
  var le=ed[ed.length-1];g+=T(le[0]-4,le[1]-6,'EDPVR',{a:'end',s:12,f:C.mu});
  /* ESPVR through the aortic-closure corner */
  var vTop=m.V0+262/m.E,ex=Math.min(vTop,255),ey=(ex-m.V0)*m.E;
  g+=LN(X(m.V0),Y(0),X(ex),Y(ey),'stroke:var(--muted);stroke-width:1.5;stroke-dasharray:6 4');
  g+=T(X(ex)+(vTop>255?-4:6),Y(ey)+(vTop>255?-6:12),'ESPVR',{a:vTop>255?'end':'start',s:12,f:C.mu});
  if(gh){var gp=pvPts(gh).pts;g+=PL(gp.map(function(p){return [X(p[0]),Y(p[1])]}),'stroke:var(--muted);stroke-width:2;stroke-dasharray:5 4;opacity:.8')}
  var P=pvPts(m);g+='<polygon points="'+P.pts.map(function(p){return r1(X(p[0]))+','+r1(Y(p[1]))}).join(' ')+'" style="fill:var(--accent);fill-opacity:.12;stroke:var(--accent);stroke-width:2.5;stroke-linejoin:round"/>';
  if(les==='as')g+=LN(X(m.Bv-0.35*m.sv),Y(m.peak),X(m.Bv-0.35*m.sv),Y(1.2*s.aft),'stroke:var(--bad);stroke-width:2')+T(X(m.Bv-0.35*m.sv)+5,Y(m.peak)-5,'gradient',{s:12,f:C.bad});
  [[P.A,'MC',7,(Y(P.A[1])-Y(P.B[1]))<26?13:-6,'start'],[P.B,'AO',7,4,'start'],[P.C,'AC',-7,-6,'end'],[P.D,'MO',-7,-4,'end']].forEach(function(q){
    g+='<circle cx="'+r1(X(q[0][0]))+'" cy="'+r1(Y(q[0][1]))+'" r="4" style="fill:var(--fg)"/>'+T(X(q[0][0])+q[2],Y(q[0][1])+q[3],q[1],{a:q[4],s:12.5,w:700})});
  g+='</svg>';
  var st=[['EDV',Math.round(m.EDV)+' mL'],['ESV',Math.round(m.esv)+' mL'],['SV',Math.round(m.sv)+' mL'],['EF',Math.round(m.ef*100)+'%']];
  if(les==='mr'||les==='ar')st.push(['forward SV',Math.round(m.fwd)+' mL']);
  st.push(['peak LV',Math.round(m.peak)+' mmHg'],['EDP',Math.round(m.edp)+' mmHg']);
  var d='';if(gh){var dsv=Math.round(m.sv-gh.sv),desv=Math.round(m.esv-gh.esv);d=' Against the dashed '+(les!=='none'?'loop without the lesion':'normal loop')+': SV '+(dsv>=0?'+':'−')+Math.abs(dsv)+' mL, ESV '+(desv>=0?'+':'−')+Math.abs(desv)+' mL.'}
  var L={none:'Preload widens the loop to the right along the EDPVR; afterload makes it taller and narrower (ESV rises along the ESPVR); contractility steepens the ESPVR, so the ventricle empties further.',
    as:'Aortic stenosis: the ventricle must build far more pressure than the aorta sees (the valve gradient), so the loop grows tall and SV falls. The thick, hypertrophied wall is stiff: EDPVR steepens and filling pressure rises.',
    ar:'Aortic regurgitation: blood pours back from the aorta while the ventricle relaxes, so there is no true isovolumic relaxation and EDV becomes huge. The aortic valve opens at a low diastolic pressure (wide pulse pressure); total SV is large but part of it leaks back.',
    mr:'Mitral regurgitation: the ventricle ejects backwards into the left atrium as soon as it contracts, so there is no true isovolumic contraction. EDV rises (volume overload), the low-pressure leak lowers ESV, but forward SV falls.',
    ms:'Mitral stenosis: the narrow valve limits filling, so EDV and SV fall while the left ventricle itself is spared. The pressure builds behind the valve, in the left atrium and lungs.'}[les];
  return g+(gh?key([['var(--accent)','this heart'],['var(--muted)',les!=='none'?'same settings, no lesion':'normal','dashed']]):'')+stats(st)+'<p class="fcap muted" style="font-size:13px;margin-top:4px">MC mitral closes · AO aortic opens · AC aortic closes · MO mitral opens</p>'+cap(L+d+(m.weak?' <b>The ventricle can barely open the aortic valve against this load.</b>':''));
}};

/* ---------- cardiac action potentials: myocyte and SA node, with the no-drug trace as a ghost ---------- */
var AA={none:['None','No drug.'],IA:['Class IA','Class IA (procainamide, quinidine, disopyramide): moderate Na⁺ block slows phase 0, and K⁺ block lengthens the action potential: QRS and QT both widen.'],IB:['Class IB','Class IB (lidocaine, mexiletine): weak Na⁺ block that binds most in depolarised, ischaemic tissue; it shortens the action potential and barely changes phase 0 in healthy cells.'],IC:['Class IC','Class IC (flecainide, propafenone): strong Na⁺ block with slow release: phase 0 flattens markedly (QRS widens), action potential length is unchanged.'],II:['Class II','Class II (β-blockers): less cAMP, so the funny current and Ca²⁺ current fall: phase 4 flattens in the SA node (slower rate) and AV conduction slows (PR lengthens). The ventricular myocyte trace hardly changes.'],III:['Class III','Class III (amiodarone, sotalol, dofetilide): K⁺ block delays phase 3, so the action potential and QT lengthen (risk of torsades).'],IV:['Class IV','Class IV (verapamil, diltiazem): L-type Ca²⁺ block slows nodal phase 0 and flattens phase 4: slower rate and AV conduction. The ventricular trace hardly changes.']};
function vAP(d){
  var up={IA:3,IC:7}[d]||1,pk={IA:16,IC:6,IB:24}[d]||25,ext={IA:55,IB:-45,III:95}[d]||0,p=[[0,-85],[40,-85],[40+up,pk],[47+up,4],[70,6]],e=180+ext;
  p.push([e,-4]);for(var i=1;i<=10;i++){var u=i/10;p.push([e+u*90,-4-81*(u*u*(3-2*u))])}p.push([600,-85]);return p;
}
function sAP(d){
  var s4={II:20/540,IV:20/420}[d]||20/300,up={IV:90}[d]||40,pk={IV:-2}[d]||10,p=[],t=0,v=-60;
  while(t<600){p.push([t,v]);var tt=t+20/s4;if(tt>600){p.push([600,v+(600-t)*s4]);break}t=tt;v=-40;p.push([t,v]);
    for(var i=1;i<=6;i++){var u=i/6;p.push([t+u*up,-40+(pk+40)*(1-Math.pow(1-u,2))])}t+=up;
    for(i=1;i<=8;i++){u=i/8;p.push([t+u*150,pk-(pk+60)*(u*u*(3-2*u))])}t+=150;v=-60}
  return p.filter(function(q){return q[0]<=600});
}
F.cardap={title:'Two action potentials',def:{c:'v',d:'none'},
ctrl:function(s){return '<div class="frow"><span>Drug</span>'+Object.keys(AA).map(function(k){return btn('cardap','d',k,AA[k][0],s.d===k)}).join('')+'</div>'},
view:function(s){
  var d=s.d||'none',g=svg(340,290,'Ventricular and SA node action potentials, '+AA[d][0]);
  function X(t){return 40+t*0.49}
  function Yv(v){return 22+(40-v)*0.82}function Ys(v){return 168+(25-v)*1.2}
  g+=T(4,13,'VENTRICULAR MYOCYTE',{s:12,w:700,f:C.at})+T(4,159,'SA NODE',{s:12,w:700,f:C.at});
  g+=LN(40,Yv(0),336,Yv(0),'stroke:var(--line);stroke-dasharray:3 3')+T(36,Yv(0)+4,'0',{a:'end',s:12,f:C.mu})+T(36,Yv(-85)+4,'−85',{a:'end',s:12,f:C.mu});
  g+=LN(40,Ys(0),336,Ys(0),'stroke:var(--line);stroke-dasharray:3 3')+T(36,Ys(0)+4,'0',{a:'end',s:12,f:C.mu})+T(36,Ys(-60)+4,'−60',{a:'end',s:12,f:C.mu});
  g+=LN(40,Ys(-40),336,Ys(-40),'stroke:var(--bad);stroke-dasharray:4 3;opacity:.8')+T(336,Ys(-40)-5,'threshold −40 mV',{a:'end',s:12,f:C.bad});
  var on=d!=='none',vs=on?'stroke:var(--accent)':'stroke:var(--bio)',gs='stroke:var(--muted);stroke-dasharray:5 4;opacity:.85';
  if(on){g+=PL(vAP('none').map(function(p){return [X(p[0]),Yv(p[1])]}),gs+';stroke-width:2');g+=PL(sAP('none').map(function(p){return [X(p[0]),Ys(p[1])]}),gs+';stroke-width:2')}
  g+=PL(vAP(d).map(function(p){return [X(p[0]),Yv(p[1])]}),vs+';stroke-width:2.6;stroke-linejoin:round');
  g+=PL(sAP(d).map(function(p){return [X(p[0]),Ys(p[1])]}),vs+';stroke-width:2.6;stroke-linejoin:round');
  g+=T(X(40)-5,Yv(24),'0',{a:'end',s:13,w:700})+T(X(50),Yv(30),'1',{s:13,w:700})+T(X(74),Yv(12),'2 plateau: Ca²⁺ in',{s:12.5})+T(X(262)+4,Yv(-40),'3 K⁺ out',{s:12.5})+T(X(330),Yv(-76),'4',{s:13,w:700});
  g+=T(X(150),Ys(-62),'4 funny current',{a:'middle',s:12.5})+T(X(300)+8,Ys(16),'0 Ca²⁺ in',{s:12.5})+T(X(420),Ys(-14),'3 K⁺',{s:12.5});
  /* phase 0 zoom inset */
  var ix=252,iy=60,iw=82,ih=62;g+='<rect x="'+ix+'" y="'+iy+'" width="'+iw+'" height="'+ih+'" rx="3" style="fill:var(--surface2);stroke:var(--line)"/>'+T(ix+iw,iy-4,'phase 0 zoom',{a:'end',s:12,f:C.mu});
  function zX(t){return ix+4+(t-38)*(iw-8)/12}function zY(v){return iy+ih-4-(v+90)*(ih-8)/120}
  function zp(a){return a.filter(function(p){return p[0]>=38&&p[0]<=50}).concat([[50,null]]).map(function(p,i,arr){if(p[1]==null){var q=a.filter(function(r){return r[0]>50})[0],pr=arr[i-1];p=[50,pr[1]+(q[1]-pr[1])*(50-pr[0])/(q[0]-pr[0])]}return [zX(p[0]),zY(p[1])]})}
  if(on)g+=PL(zp(vAP('none')),gs+';stroke-width:2');g+=PL(zp(vAP(d)),vs+';stroke-width:2.6');
  g+=LN(X(400),286,X(600),286,'stroke:var(--fg);stroke-width:2')+T(X(600),280,'200 ms',{a:'end',s:12,f:C.mu});
  g+='</svg>';
  var extra=(d==='IA'||d==='IB'||d==='IC')?' Na⁺-channel blockers act on fast-response cells; the nodal action potential runs on Ca²⁺, so the SA node trace does not change.':'';
  return g+(on?key([['var(--accent)',AA[d][0]],['var(--muted)','no drug','dashed']]):'')+cap(AA[d][1]+extra);
}};

/* ---------- infarct over time: discrete stages, morphology + biomarkers ---------- */
var MIS=[['0–4 hours','Nothing visible under the light microscope; wavy fibres at the edge at most. The cell is already doomed after about 20–40 minutes of complete ischaemia, long before it looks dead.','Arrhythmias: ventricular fibrillation is the commonest early cause of death.'],
['4–24 hours','Coagulative necrosis begins: deeply eosinophilic fibres, nuclei shrinking and fading; contraction bands if the artery reopens (reperfusion injury).','Arrhythmias; cardiogenic shock if the infarct is large.'],
['1–3 days','Necrosis complete: no nuclei, striations lost. Neutrophils pour in from the edge.','Fibrinous (post-infarction) pericarditis: pleuritic pain, friction rub.'],
['3–14 days','Macrophages digest the dead muscle, then granulation tissue (new capillaries, fibroblasts) grows in from the edges. The wall is weakest at about days 5–10.','Free wall rupture (tamponade), papillary muscle rupture (acute mitral regurgitation), septal rupture (new VSD); left ventricular pseudoaneurysm.'],
['2 weeks–2 months','Collagen replaces the granulation tissue: a pale, thin scar that cannot contract.','True ventricular aneurysm, mural thrombus (embolic stroke), Dressler syndrome (autoimmune pericarditis weeks later), heart failure, scar-related arrhythmia.']];
var MIL=['0–4 h','4–24 h','1–3 days','3–14 days','2 wk–2 mo'];FMT['mi.st']=function(v){return MIL[v]};
function seed(i){var x=Math.sin(i*12.9898)*43758.5453;return x-Math.floor(x)}
F.mi={title:'An infarct over time',def:{st:0},
ctrl:function(s){var i=Math.max(0,Math.min(4,s.st|0));return '<div class="frow">'+rng('mi','st',0,4,1,i,'Time after',MIL[i])+'</div>'},
view:function(s){
  var i=Math.max(0,Math.min(4,s.st|0)),st=MIS[i],g=svg(340,168,'Myocardial infarct at '+st[0]+': '+st[1]);
  var z0=104,z1=236,mus='fill:var(--phys-s);stroke:var(--phys);stroke-width:1';
  var dead=['fill:var(--phys-s);stroke:var(--phys);stroke-width:1','fill:color-mix(in srgb,var(--phys) 55%,var(--surface));stroke:var(--phys);stroke-width:1','fill:color-mix(in srgb,var(--phys) 42%,var(--surface));stroke:var(--phys);stroke-width:1','fill:color-mix(in srgb,var(--phys) 26%,var(--surface));stroke:var(--muted);stroke-width:1','fill:var(--surface2);stroke:var(--muted);stroke-width:1'][i];
  g+=T(170,13,'infarct zone',{a:'middle',s:12.5,w:700,f:C.at})+LN(z0,18,z0,108,'stroke:var(--accent);stroke-dasharray:3 3')+LN(z1,18,z1,108,'stroke:var(--accent);stroke-dasharray:3 3');
  for(var r=0;r<5;r++){var y=22+r*17;
    for(var x=8;x<332;x+=40){var inz=x+18>z0&&x+18<z1,w=36,h=12;
      if(inz&&i===4){g+='<path d="M'+x+','+(y+6)+' q9,-5 18,0 t18,0" style="fill:none;stroke:var(--muted);stroke-width:1.5"/>';continue}
      if(inz&&i===0){g+='<path d="M'+x+','+(y+1)+' q9,-4 18,0 t18,0 v'+h+' q-9,4 -18,0 t-18,0 z" style="'+mus+'"/>';}
      else if(inz&&i===3){g+='<rect x="'+x+'" y="'+y+'" width="'+(w*0.45)+'" height="'+h+'" rx="3" style="'+dead+'"/><rect x="'+(x+w*0.6)+'" y="'+(y+1)+'" width="'+(w*0.3)+'" height="'+(h-2)+'" rx="3" style="'+dead+'"/>'}
      else g+='<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="4" style="'+(inz?dead:mus)+'"/>';
      if(!inz||i===0)g+='<ellipse cx="'+(x+18)+'" cy="'+(y+6)+'" rx="4" ry="2.4" style="fill:var(--path)"/>';
      else if(i===1)g+='<circle cx="'+(x+18)+'" cy="'+(y+6)+'" r="1.6" style="fill:var(--path)"/>'+LN(x+10,y,x+10,y+h,'stroke:var(--phys);stroke-width:2')+LN(x+27,y,x+27,y+h,'stroke:var(--phys);stroke-width:2');
    }}
  var n,cx,cy;
  if(i===2)for(n=0;n<22;n++){cx=z0+6+seed(n)*(z1-z0-12);cy=24+seed(n+50)*80;g+='<g style="fill:var(--bio)"><circle cx="'+r1(cx)+'" cy="'+r1(cy)+'" r="2.1"/><circle cx="'+r1(cx+3.2)+'" cy="'+r1(cy+1)+'" r="2.1"/><circle cx="'+r1(cx+1.4)+'" cy="'+r1(cy+3.2)+'" r="2.1"/></g>'}
  if(i===3){for(n=0;n<9;n++){cx=z0+22+seed(n+7)*(z1-z0-44);cy=28+seed(n+90)*72;g+='<circle cx="'+r1(cx)+'" cy="'+r1(cy)+'" r="6" style="fill:var(--bio-s);stroke:var(--bio);stroke-width:1.5"/><circle cx="'+r1(cx+1)+'" cy="'+r1(cy)+'" r="2.3" style="fill:var(--bio)"/>'}
    for(n=0;n<8;n++){var side=n%2?z1-4:z0+4,dir=n%2?-1:1,yy=26+(n>>1)*22+(n%2)*8;g+='<path d="M'+side+','+yy+' q'+(dir*9)+',-6 '+(dir*18)+',0 t'+(dir*18)+',0" style="fill:none;stroke:var(--phys);stroke-width:2"/><path d="M'+(side+dir*4)+','+(yy+6)+' l'+(dir*12)+',0" style="stroke:var(--muted);stroke-width:2.5;stroke-linecap:round"/>'}}
  /* stage strip: matches the chapter table */
  var SX=[22,82,142,202,262,322],SL=['0','4 h','1 d','3 d','2 wk','2 mo'];
  g+=LN(SX[0],140,SX[5],140,'stroke:var(--muted);stroke-width:1.5')+'<rect x="'+SX[i]+'" y="136" width="'+(SX[i+1]-SX[i])+'" height="8" rx="2" style="fill:var(--accent)"/>';
  SX.forEach(function(x,k){var on=k===i||k===i+1;g+=LN(x,135,x,145,'stroke:var(--muted)')+T(x,160,SL[k],{a:'middle',s:12.5,f:on?C.at:C.mu,w:on?700:null})});
  if(i===2)g+=T(z1+6,126,'neutrophils',{s:12,f:'var(--bio-t)'});if(i===3)g+=T(336,126,'macrophages · new vessels',{a:'end',s:12,f:'var(--bio-t)'});
  g+='</svg>';
  return g+cap('<b>'+st[0]+'.</b> '+st[1]+'<br><b>Danger now:</b> '+st[2]);
}};

/* ---------- lung volumes + flow-volume loop ---------- */
var SP={n:['Normal',{rv:1.2,erv:1.2,tv:0.5,irv:3.1,fev:3.9,pef:8.5,pif:6},'FEV₁/FVC about 0.8.'],
o:['Obstructive',{rv:2.6,erv:1.0,tv:0.5,irv:2.4,fev:1.8,pef:4.2,pif:5},'Air is trapped behind narrowed airways: RV, FRC and TLC rise, FEV₁ falls more than FVC, so FEV₁/FVC drops below 0.7. The expiratory limb is scooped out and the loop moves to higher lung volumes.'],
r:['Restrictive',{rv:0.9,erv:0.7,tv:0.45,irv:1.95,fev:2.75,pef:6.8,pif:4.8},'Stiff lungs or a stiff chest wall: every volume shrinks, but FEV₁ and FVC fall together, so FEV₁/FVC is normal or high (strong recoil). The loop is narrow and sits at low lung volumes.']};
function fvl(v,X,Yf,obs){var tlc=v.rv+v.erv+v.tv+v.irv,vc=tlc-v.rv,ex=[],ins=[];
  for(var i=0;i<=40;i++){var u=i/40,f=u<0.1?v.pef*Math.sin(u/0.1*Math.PI/2):v.pef*Math.pow(1-(u-0.1)/0.9,obs?2.4:1.05);ex.push([X(tlc-u*vc),Yf(f)])}
  for(i=0;i<=30;i++){u=i/30;ins.push([X(v.rv+u*vc),Yf(-v.pif*Math.sin(Math.PI*u))])}
  return ex.concat(ins)}
F.spiro={title:'Lung volumes and the flow-volume loop',def:{p:'n'},
ctrl:function(s){return '<div class="frow"><span>Pattern</span>'+Object.keys(SP).map(function(k){return btn('spiro','p',k,SP[k][0],s.p===k)}).join('')+'</div>'},
view:function(s){
  var v=SP[s.p][1],tlc=v.rv+v.erv+v.tv+v.irv,frc=v.rv+v.erv,vc=tlc-v.rv,g=svg(340,272,SP[s.p][0]+' lung volumes: TLC '+tlc.toFixed(1)+' L, FEV1/FVC '+(v.fev/vc).toFixed(2));
  function X(L){return 322-L*42}
  var segs=[['RV',v.rv,'var(--phys)'],['ERV',v.erv,'var(--path)'],['TV',v.tv,'var(--accent)'],['IRV',v.irv,'var(--bio)']],acc=0;
  segs.forEach(function(q){var x1=X(acc+q[1]),x0=X(acc);g+='<rect x="'+r1(x1)+'" y="26" width="'+r1(x0-x1)+'" height="26" style="fill:'+q[2]+';fill-opacity:.85;stroke:var(--surface);stroke-width:1.5"/>';
    g+=T((x0+x1)/2,44,q[0],{a:'middle',s:12.5,w:700,f:'var(--accent-ink)'});acc+=q[1]});
  if(s.p!=='n'){var n=SP.n[1],nt=n.rv+n.erv+n.tv+n.irv;g+='<rect x="'+r1(X(nt))+'" y="23" width="'+r1(X(0)-X(nt))+'" height="32" style="fill:none;stroke:var(--fg);stroke-dasharray:4 3;opacity:.7"/>'}
  function br(a,b,y,lab){var xa=X(b),xb=X(a);return LN(xa,y,xb,y,'stroke:var(--fg);stroke-width:1.5')+LN(xa,y-4,xa,y+4,'stroke:var(--fg)')+LN(xb,y-4,xb,y+4,'stroke:var(--fg)')+T((xa+xb)/2,y+15,lab,{a:'middle',s:12.5})}
  g+=T(X(tlc),17,'TLC '+tlc.toFixed(1)+' L',{s:12.5,w:700});
  g+=br(0,frc,64,'FRC '+frc.toFixed(1))+br(v.rv,tlc,92,'VC '+vc.toFixed(1));
  /* flow-volume panel */
  function Yf(f){return 188-f*6.6}
  g+=T(4,124,'FLOW (L/s)',{s:12,w:700,f:C.at});
  g+=LN(30,Yf(0),330,Yf(0),'stroke:var(--muted);stroke-width:1.5')+T(334,Yf(8)+4,'exhale ↑',{a:'end',s:12,f:C.mu})+T(334,Yf(-5.2),'inhale ↓',{a:'end',s:12,f:C.mu});
  [6,4,2,0].forEach(function(L){g+=LN(X(L),Yf(0),X(L),Yf(0)+4,'stroke:var(--muted)')+T(X(L),252,L,{a:'middle',s:12,f:C.mu})});
  if(s.p!=='n')g+=PL(fvl(SP.n[1],X,Yf,false),'stroke:var(--muted);stroke-width:2;stroke-dasharray:5 4;opacity:.85');
  g+='<polygon points="'+fvl(v,X,Yf,s.p==='o').map(function(p){return r1(p[0])+','+r1(p[1])}).join(' ')+'" style="fill:var(--accent);fill-opacity:.12;stroke:var(--accent);stroke-width:2.5;stroke-linejoin:round"/>';
  g+=T(336,264,'lung volume (L)',{a:'end',s:12,f:C.mu});
  g+='</svg>';
  return g+(s.p!=='n'?key([['var(--accent)',SP[s.p][0]],['var(--muted)','normal','dashed']]):'')+stats([['FEV₁',v.fev.toFixed(1)+' L'],['FVC',vc.toFixed(1)+' L'],['FEV₁/FVC',(v.fev/vc).toFixed(2)],['TLC',tlc.toFixed(1)+' L']])+cap('<b>'+SP[s.p][0]+'.</b> '+SP[s.p][2]+' <span class="muted">Spirometry sees only air that moves: RV, and so FRC and TLC, need helium dilution, nitrogen washout or body plethysmography.</span>');
}};

/* ---------- V/Q: graded units from shunt to dead space ---------- */
var VQS=[['0','shunt',40,46],['0.3','low',70,44],['0.6','base',89,42],['1','matched',100,40],['3','apex',130,28],['10','high',145,10],['∞','dead space',150,0]];
function sat(p){var n=2.7,q=Math.pow(p,n);return q/(q+Math.pow(26.7,n))}
FMT['vq.i']=function(v){return 'V/Q '+VQS[v][0]+(VQS[v][1]!=='low'&&VQS[v][1]!=='high'?' ('+VQS[v][1]+')':'')};
F.vq={title:'Ventilation and perfusion',def:{i:3,o:0},
ctrl:function(s){var i=Math.max(0,Math.min(6,s.i|0));return '<div class="frow">'+rng('vq','i',0,6,1,i,'V/Q ratio',FMT['vq.i'](i))+'</div><div class="frow"><span>Jump to</span>'+[[0,'Shunt'],[2,'Lung base'],[3,'Matched'],[4,'Lung apex'],[6,'Dead space']].map(function(q){return btn('vq','i',q[0],q[1],i===q[0])}).join('')+'</div><div class="frow"><span>Breathing</span>'+btn('vq','o',0,'Room air',!s.o)+btn('vq','o',1,'100% O₂',!!s.o)+'</div>'},
view:function(s){
  var i=Math.max(0,Math.min(6,s.i|0)),u=VQS[i],r=[0,0.3,0.6,1,3,10,Infinity][i],V=r>=1?1:r,Q=r<=1?1:(r===Infinity?0:1/r);
  var po=u[2],pc=u[3];if(s.o&&i>0)po=i===1?560:i===2?620:660;
  var so=i===6?null:sat(po)*100,mix=so==null?0:Math.max(0,Math.min(100,(so-70)/30*100));
  var blood='color-mix(in srgb,var(--phys) '+Math.round(mix)+'%,var(--pharm))';
  var g=svg(340,234,'V/Q '+u[0]+': end-capillary PO2 '+(i===6?'none, no blood flow':po+' mmHg'));
  var aw=4+20*V,ax=118;
  g+='<rect x="'+(ax-aw/2)+'" y="6" width="'+aw+'" height="44" style="fill:var(--bio);fill-opacity:.35;stroke:var(--bio);stroke-width:1.5"/>';
  if(i===0)g+=LN(ax-14,36,ax+14,36,'stroke:var(--bad);stroke-width:4')+T(ax+18,30,'airway blocked',{s:12.5,f:C.bad});else g+=T(ax+aw/2+6,24,'air in ('+(V>=1?'full':'reduced')+')',{s:12.5,f:C.mu});
  g+='<circle cx="'+ax+'" cy="92" r="44" style="fill:'+(i===0?'var(--surface2)':'var(--bio-s)')+';stroke:var(--bio);stroke-width:2"/>';
  if(i===0){for(var k=0;k<5;k++)g+='<path d="M'+(ax-34+k*14)+',120 q4,-6 8,0" style="fill:none;stroke:var(--muted);stroke-width:1.5"/>';g+=T(ax,86,'fluid or',{a:'middle',s:12.5})+T(ax,104,'collapse',{a:'middle',s:12.5})}
  else g+=T(ax,80,'P<tspan style="font-size:10px">A</tspan>O₂',{a:'middle',s:13,f:C.mu})+T(ax,106,(s.o?663:Math.max(u[2],40)),{a:'middle',s:16,w:700});
  var th=Q>0?3+14*Q:0;
  if(Q>0){g+='<path d="M8,152 C60,152 64,142 '+(ax-40)+',140 S'+(ax+40)+',140 '+(ax+60)+',144 S300,152 332,152" style="fill:none;stroke:url(#vqb'+i+(s.o?'o':'')+');stroke-width:'+th+';stroke-linecap:round"/>';
    g+='<defs><linearGradient id="vqb'+i+(s.o?'o':'')+'" x1="0" x2="1" y1="0" y2="0"><stop offset="0" style="stop-color:color-mix(in srgb,var(--phys) 15%,var(--pharm))"/><stop offset=".34" style="stop-color:color-mix(in srgb,var(--phys) 15%,var(--pharm))"/><stop offset=".62" style="stop-color:'+blood+'"/><stop offset="1" style="stop-color:'+blood+'"/></linearGradient></defs>'}
  else g+='<path d="M8,152 C60,152 64,142 '+(ax-40)+',140 S'+(ax+40)+',140 '+(ax+60)+',144 S300,152 332,152" style="fill:none;stroke:var(--muted);stroke-width:8;stroke-dasharray:3 5;opacity:.6"/>'+T(170,176,'no blood flow (clot)',{a:'middle',s:12.5,f:C.bad});
  if(Q>0)g+=T(8,174,'in: PO₂ 40, PCO₂ 46',{s:12.5,f:C.mu})+T(332,174,'out: PO₂ '+po+', PCO₂ '+pc,{a:'end',s:12.5,w:700});
  /* side readout */
  g+=T(186,72,'V/Q '+u[0],{s:18,w:700,f:C.at})+T(186,92,u[1],{s:13,f:C.mu});
  g+=T(186,114,'ventilation',{s:12.5,f:C.mu})+'<rect x="262" y="105" width="'+r1(70*V)+'" height="9" style="fill:var(--bio)"/>';
  g+=T(186,136,'blood flow',{s:12.5,f:C.mu})+'<rect x="262" y="127" width="'+r1(70*Q)+'" height="9" style="fill:var(--phys)"/>';
  /* scale of stops */
  VQS.forEach(function(q,k){var x=24+k*48;g+='<circle cx="'+x+'" cy="204" r="'+(k===i?6:3.5)+'" style="fill:'+(k===i?'var(--accent)':'var(--muted)')+'"/>'+T(x,226,q[0],{a:'middle',s:12.5,w:k===i?700:null,f:k===i?C.at:C.mu})});
  g+=LN(24,204,312,204,'stroke:var(--line);stroke-width:1.5')+T(24+2*48,194,'base',{a:'middle',s:11.5,f:C.mu})+T(24+4*48,194,'apex',{a:'middle',s:11.5,f:C.mu});
  g+='</svg>';
  var c={0:'A shunt: blood passes an alveolus with no air and leaves as venous blood.',1:'Low V/Q: the alveolus is under-ventilated for its blood flow, so PO₂ falls and PCO₂ creeps up.',2:'The lung base: gravity sends it more blood than air (V/Q about 0.6).',3:'Matched: ventilation fits perfusion and blood leaves fully loaded.',4:'The lung apex: more air than blood (V/Q about 3), so PO₂ is high and PCO₂ low. Reactivation TB favours this oxygen-rich zone.',5:'High V/Q: much of the air is wasted; little blood to load.',6:'Dead space: air reaches an alveolus with no blood flow and leaves unchanged (pulmonary embolism).'}[i];
  var o=s.o?(i===0?' <b>On 100% O₂:</b> no change: the shunted blood never meets the oxygen, so a shunt barely responds.':i===6?' <b>On 100% O₂:</b> nothing to load here; the hypoxaemia of a PE comes from the overperfused units elsewhere, and those do respond.':' <b>On 100% O₂:</b> nitrogen washes out, so even a poorly ventilated unit reaches a high PO₂. Hypoxaemia from V/Q mismatch corrects; PaO₂ climbs past 500 mmHg, but Hb was already near full, so content rises only a little.'):'';
  return g+stats([['end-capillary PO₂',i===6?'—':po+' mmHg'],['PCO₂',i===6?'—':pc+' mmHg'],['SO₂',so==null?'—':Math.round(so)+'%']])+cap(c+o+(s.o?'':' <span class="muted">Mixing matters: high-V/Q units cannot make up for low ones, because Hb is already near full at a PO₂ of 100.</span>'));
}};

/* ---------- nephron: segments + a transport cell with the drug block ---------- */
var NS={
pct:['Proximal tubule','Reabsorbs about two thirds of filtered Na⁺ and water, all the glucose and amino acids and most HCO₃⁻; secretes organic acids and many drugs.',['Acetazolamide','SGLT2 inhibitor'],
  [['a',0,'SGLT2','Na⁺, glucose',1,2],['a',1,'NHE3','Na⁺ ⇄ H⁺',1,0],['a',2,'CA IV','HCO₃⁻ back',1,1],['b',0,'Na⁺/K⁺-ATPase','3Na⁺ ⇄ 2K⁺',1,0],['b',1,'GLUT2','glucose',1,2],['b',2,'NBC1','HCO₃⁻',1,1]],
  ['Acetazolamide blocks carbonic anhydrase: HCO₃⁻ is lost in the urine (alkaline urine, normal-gap metabolic acidosis). Used for glaucoma and altitude sickness.','SGLT2 inhibitors (empagliflozin, dapagliflozin) block glucose and Na⁺ entry: glycosuria, mild natriuresis; they protect the heart and kidneys. Risk: genital infections, euglycaemic ketoacidosis.'],'Fanconi syndrome (all PCT transport fails: glucose, amino acids, phosphate, HCO₃⁻); type 2 (proximal) RTA.'],
dl:['Thin descending limb','Permeable to water (aquaporin-1) but not to NaCl: water leaves into the hypertonic medulla and the filtrate concentrates.',['Mannitol'],
  [['a',0,'AQP1','H₂O',1,1],['b',0,'AQP1','H₂O',1,1],['p',2,'tight junction','NaCl stays in',0,0]],
  ['Mannitol is filtered but not reabsorbed: it holds water in the lumen of the PCT and descending limb (osmotic diuresis). Used for raised intracranial pressure; avoid in heart failure (expands plasma volume first).'],'—'],
tal:['Thick ascending limb','Impermeable to water. NKCC2 carries Na⁺, K⁺ and 2 Cl⁻ from the lumen into the cell, powered by the basolateral Na⁺/K⁺-ATPase; K⁺ leaks back through ROMK, making the lumen positive, which drives Ca²⁺ and Mg²⁺ between the cells. This dilutes the urine and builds the medullary gradient.',['Loop diuretic'],
  [['a',0,'NKCC2','Na⁺K⁺2Cl⁻',1,1],['a',1,'ROMK','K⁺ back',-1,0],['p',2,'paracellular','Ca²⁺ Mg²⁺',1,1],['b',0,'Na⁺/K⁺-ATPase','3Na⁺ ⇄ 2K⁺',1,0],['b',1,'ClC-Kb','Cl⁻',1,1]],
  ['Loop diuretics (furosemide, bumetanide, torsemide) block NKCC2: big natriuresis, loss of the lumen-positive drive (Ca²⁺ and Mg²⁺ lost: "loops lose calcium"), hypokalaemia, metabolic alkalosis, ototoxicity. The medullary gradient collapses, so urine cannot be concentrated.'],'Bartter syndrome (inherited loss of NKCC2 or its partners: looks like a loop diuretic, with hypercalciuria).'],
dct:['Distal convoluted tubule','The NaCl cotransporter (NCC) reabsorbs about 5% of Na⁺; Ca²⁺ is reabsorbed through TRPV5 under PTH and leaves by the Na⁺/Ca²⁺ exchanger. Starts at the macula densa, which senses NaCl for tubuloglomerular feedback and renin.',['Thiazide'],
  [['a',0,'NCC','Na⁺ Cl⁻',1,1],['a',1,'TRPV5 (PTH)','Ca²⁺',1,0],['b',0,'Na⁺/K⁺-ATPase','3Na⁺ ⇄ 2K⁺',1,0],['b',1,'NCX1','Ca²⁺',1,0]],
  ['Thiazides (hydrochlorothiazide, chlorthalidone, indapamide) block NCC. Less Na⁺ in the cell steepens the Na⁺ gradient, so NCX pushes more Ca²⁺ out to the blood: urinary Ca²⁺ falls (useful for calcium stones; can cause hypercalcaemia). Also hypokalaemia, hyponatraemia, hyperglycaemia, hyperuricaemia, hyperlipidaemia.'],'Gitelman syndrome (inherited loss of NCC: looks like a thiazide, with hypocalciuria and hypomagnesaemia).'],
cd:['Collecting duct','Principal cells: ENaC takes up Na⁺ (more under aldosterone) and ROMK secretes K⁺; aquaporin-2 inserts under ADH (V2 receptor). α-intercalated cells secrete H⁺ (H⁺-ATPase), β-intercalated cells secrete HCO₃⁻.',['Amiloride','Spironolactone'],
  [['a',0,'ENaC','Na⁺',1,1],['a',1,'ROMK','K⁺',-1,0],['a',2,'AQP2 (ADH)','H₂O',1,0],['b',0,'Na⁺/K⁺-ATPase','3Na⁺ ⇄ 2K⁺',1,0],['c',1,'MR','aldosterone',0,2]],
  ['Amiloride and triamterene block ENaC directly: mild natriuresis, K⁺ retained (hyperkalaemia). Amiloride treats lithium-induced nephrogenic DI and Liddle syndrome.','Spironolactone and eplerenone block the mineralocorticoid receptor, so aldosterone can no longer add ENaC and pumps: K⁺-sparing; used in heart failure, hyperaldosteronism, ascites. Spironolactone also blocks androgen receptors (gynaecomastia).'],'Liddle syndrome (ENaC stuck open: hypertension, hypokalaemia, low renin and aldosterone); nephrogenic DI; type 1 (distal) and type 4 (hypoaldosteronism, hyperkalaemic) RTA.']};
F.nephron={title:'Walk the nephron',def:{g:'pct',dr:0},
ctrl:function(s){var n=NS[s.g];return '<div class="frow"><span>Segment</span>'+Object.keys(NS).map(function(k){return btn('nephron','g',k,NS[k][0],s.g===k,{g:k,dr:0})}).join('')+'</div><div class="frow"><span>Drug</span>'+btn('nephron','dr',0,'No drug',!s.dr)+n[2].map(function(d,i){return btn('nephron','dr',i+1,d,s.dr===i+1)}).join('')+'</div>'},
view:function(s){
  var n=NS[s.g],dr=Math.min(s.dr|0,n[2].length),g=svg(340,348,'Nephron, '+n[0]+(dr?', '+n[2][dr-1]+' acting':''));
  g+='<defs><linearGradient id="nmed" x1="0" x2="0" y1="0" y2="1"><stop offset="0" style="stop-color:var(--surface)"/><stop offset="1" style="stop-color:var(--accent-soft)"/></linearGradient></defs>';
  g+='<rect x="0" y="86" width="340" height="98" style="fill:url(#nmed)"/>'+LN(0,86,340,86,'stroke:var(--muted);stroke-dasharray:5 4');
  g+=T(336,80,'cortex',{a:'end',s:12.5,f:C.mu})+T(336,102,'medulla',{a:'end',s:12.5,f:C.mu})+T(336,178,'1200 mOsm/kg',{a:'end',s:12,f:C.at})+T(336,122,'300',{a:'end',s:12,f:C.mu});
  var P={pct:'M60,46 C84,64 98,22 114,38 C130,54 104,70 122,84',dl:'M122,84 L128,166',tal:'M146,166 L152,60',dct:'M152,60 C152,42 108,30 84,30 C120,12 160,22 186,32 C206,40 214,26 226,22',cd:'M226,22 L238,22 L238,180'};
  g+='<circle cx="44" cy="40" r="20" style="fill:none;stroke:var(--muted);stroke-width:2"/><circle cx="44" cy="40" r="12" style="fill:var(--phys-s);stroke:var(--phys);stroke-width:1.5"/>'+T(44,74,'glomerulus',{a:'middle',s:12,f:C.mu});
  g+='<path d="M128,166 Q137,184 146,166" style="fill:none;stroke:var(--line);stroke-width:7;stroke-linecap:round"/>';
  Object.keys(P).forEach(function(k){g+='<path d="'+P[k]+'" style="fill:none;stroke:'+(k===s.g?'var(--accent)':'var(--line)')+';stroke-width:'+(k===s.g?9:7)+';stroke-linecap:round;stroke-linejoin:round"/>'});
  g+='<circle cx="84" cy="30" r="5" style="fill:var(--fg)"/>'+T(84,14,'macula densa',{a:'middle',s:12,f:C.mu});
  var LB={pct:[84,72,'PCT'],dl:[110,134,'thin desc.'],tal:[158,134,'TAL'],dct:[176,52,'DCT'],cd:[246,140,'CD']};
  Object.keys(LB).forEach(function(k){var q=LB[k];g+=T(q[0],q[1],q[2],{a:k==='dl'?'end':'start',s:13,w:k===s.g?700:500,f:k===s.g?C.at:C.fg})});
  /* transport cell: apical rows y0+24+28r, basolateral rows 14 lower */
  var y0=196;
  g+='<rect x="100" y="'+(y0+6)+'" width="140" height="120" rx="10" style="fill:var(--surface2);stroke:var(--muted);stroke-width:1.5"/>';
  var nm={pct:'PCT CELL',dl:'THIN DESC. LIMB',tal:'TAL CELL',dct:'DCT CELL',cd:'PRINCIPAL CELL'}[s.g];
  g+=T(48,y0+2,'LUMEN',{a:'middle',s:12,w:700,f:C.mu})+T(170,y0+1,nm,{a:'middle',s:12,w:700,f:C.at})+T(292,y0+2,'BLOOD',{a:'middle',s:12,w:700,f:C.mu});
  n[3].forEach(function(t){var blk=dr&&t[5]===dr,y=t[0]==='a'?y0+26+t[1]*34:t[0]==='p'?y0+118:y0+43+t[1]*34;
    var col=blk?'var(--bad)':'var(--accent)',arrow=t[4]===1?'→':t[4]===-1?'←':'';
    if(t[0]==='p'){g+=LN(4,y+12,336,y+12,'stroke:var(--bio);stroke-width:1.5;stroke-dasharray:2 3')+T(170,y+26,t[2]+(blk?': drive lost':''),{a:'middle',s:12,w:blk?700:null,f:blk?C.bad:C.mu})+T(4,y+26,t[3]+' →',{s:12.5,f:blk?C.mu:C.fg});return}
    if(t[0]==='c'){g+='<circle cx="196" cy="'+y+'" r="8" style="fill:'+col+';stroke:var(--surface);stroke-width:1.5"/>'+T(208,y+4,t[2],{s:12.5,w:600});if(blk)g+=T(196,y+5,'✕',{a:'middle',s:15,w:700,f:'var(--surface)'});return}
    var mx=t[0]==='a'?100:240;
    g+='<circle cx="'+mx+'" cy="'+y+'" r="8" style="fill:'+col+';stroke:var(--surface);stroke-width:1.5"/>';
    g+=T(t[0]==='a'?mx+12:mx-12,y+4,t[2],{a:t[0]==='a'?'start':'end',s:12.5,w:600});
    if(t[0]==='a')g+=T(88,y+4,t[3]+' '+arrow,{a:'end',s:12,f:blk?C.mu:C.fg});else g+=T(252,y+4,arrow+' '+t[3],{s:12,f:blk?C.mu:C.fg});
    if(blk)g+=T(mx,y+5,'✕',{a:'middle',s:15,w:700,f:'var(--surface)'});
  });
  g+='</svg>';
  return g+cap('<b>'+n[0]+'.</b> '+n[1]+(dr?'<br><b>'+n[2][dr-1]+':</b> '+n[4][dr-1]:'')+'<br><b>Disease:</b> '+n[5]);
}};

/* ---------- blood gas reader: pH computed, acid-base map, stepwise reading ---------- */
var AB={dka:['DKA',23,10,100],dia:['Diarrhoea',30,15,115],vom:['Vomiting',48,36,92],copd:['COPD (chronic)',60,31,98],opi:['Opioid overdose',70,27,102],pan:['Panic attack',25,21,107],asa:['Salicylate',22,14,100],nor:['Normal',40,24,104]};
FMT['abg.co2']=function(v){return v+' mmHg'};FMT['abg.hco3']=function(v){return v+' mmol/L'};FMT['abg.cl']=function(v){return v+' mmol/L'};
function abgRead(c,h,cl){
  var ph=6.1+Math.log10(h/(0.03*c)),ag=140-(cl+h),out=[],name='',mixed=false,f=function(x){return x.toFixed(0)};
  var m=Math.log10(h/24),r=-Math.log10(c/40),abn=h<22||h>26||c<35||c>45,nph=ph>=7.35&&ph<=7.45;
  out.push(['pH',ph<7.35?'Acidaemia (pH '+ph.toFixed(2)+').':ph>7.45?'Alkalaemia (pH '+ph.toFixed(2)+').':'pH in the normal range ('+ph.toFixed(2)+')'+(abn?', but the values are not: decide which side the pH leans to (below or above 7.40) and read on.':'.')]);
  function agLine(primary){
    var hi=ag>12;if(hi&&!primary&&ag<=16)return ['Anion gap',ag+': just above 12, borderline. Check albumin: each 1 g/dL fall lowers the gap by about 2.5, so a low albumin can hide a raised gap.'];
    if(!hi)return primary?['Anion gap',ag+': normal gap. Diarrhoea, renal tubular acidosis, saline, acetazolamide. The urine anion gap separates gut from kidney loss.']:null;
    var dr=(ag-12)/Math.max(0.5,24-h),t='Anion gap '+ag+': high'+(ag<=16?' (only just)':'')+'. Ketoacidosis, lactate, toxic alcohols, salicylate, uraemia.';
    if(primary&&h<24){t+=' Delta ratio ΔAG/ΔHCO₃⁻ = '+dr.toFixed(1)+(dr<1?': HCO₃⁻ fell more than the gap rose, so a normal-gap acidosis is there too.':dr>2?': HCO₃⁻ is higher than the gap predicts, so a metabolic alkalosis (or an older compensated respiratory acidosis) is there too.':': a pure high-gap acidosis.');if(dr<1||dr>2)mixed=true}
    else if(!primary){t+=' A high gap means a metabolic acidosis is present as well, whatever the pH says.';mixed=true}
    return ['Anion gap',t]}
  function push(x){if(x)out.push(x)}
  if(!abn){
    if(nph){name='Normal';out.push(['Primary','<b>Normal acid-base status</b> on these numbers.'])}
    else{name='Borderline';out.push(['Primary','PaCO₂ '+c+' and HCO₃⁻ '+h+' both sit at the edge of normal and push the pH the same way: a mild combined '+(ph<7.4?'acidosis':'alkalosis')+'. Re-check the sample and the patient.'])}
    push(agLine(false));if(name==='Normal'&&ag>12)out.push(['Verdict','A normal pH and normal values can still hide a high-gap acidosis balanced by a metabolic alkalosis (vomiting plus ketoacidosis, for example).']);
    return {ph:ph,ag:ag,out:out,name:name};
  }
  var acid=ph<7.40,prim=acid?(m<r?'ma':'ra'):(m>r?'mk':'rk');
  if(prim==='ma'){name='Metabolic acidosis';out.push(['Primary','<b>Metabolic acidosis</b>: HCO₃⁻ '+h+' is low.']);
    var e=1.5*h+8;out.push(['Compensation','Winter: expected PaCO₂ '+f(e-2)+'–'+f(e+2)+' mmHg. '+(c>e+2?'PaCO₂ '+c+' is higher: the lungs are not keeping up, so a respiratory acidosis is there too.':c<e-2?'PaCO₂ '+c+' is lower: a respiratory alkalosis is there too.':'PaCO₂ '+c+' fits: compensation appropriate.')]);
    if(c>e+2||c<e-2)mixed=true;push(agLine(true))}
  else if(prim==='ra'){name='Respiratory acidosis';var d=(c-40)/10,ac=24+d,ch=24+3.5*d;
    out.push(['Primary','<b>Respiratory acidosis</b>: PaCO₂ '+c+' is high.']);
    var t1=h<ac-2?'HCO₃⁻ '+h+' is below even acute compensation: a metabolic acidosis too.':h<=ac+2&&Math.abs(h-ac)<=Math.abs(h-ch)?'HCO₃⁻ '+h+' fits an <b>acute</b> rise (minutes to hours: opioids, airway obstruction, weak respiratory muscles).':h<ch-2?'HCO₃⁻ '+h+' sits between the two: acute-on-chronic.':h<=ch+2?'HCO₃⁻ '+h+' fits a <b>chronic</b> rise (days: the kidney has caught up, as in COPD).':'HCO₃⁻ '+h+' is above chronic compensation: a metabolic alkalosis too.';
    if(h<ac-2||h>ch+2)mixed=true;
    out.push(['Compensation','Expected HCO₃⁻ about '+ac.toFixed(0)+' if acute (+1 per 10 mmHg), '+ch.toFixed(0)+' if chronic (+3.5 per 10). '+t1]);push(agLine(false))}
  else if(prim==='mk'){name='Metabolic alkalosis';var e2=40+0.7*(h-24);
    out.push(['Primary','<b>Metabolic alkalosis</b>: HCO₃⁻ '+h+' is high.']);
    out.push(['Compensation','Expected PaCO₂ about '+f(e2)+' (±2) mmHg. '+(c>e2+2?'PaCO₂ '+c+' is higher: a respiratory acidosis too.':c<e2-2?'PaCO₂ '+c+' is lower: a respiratory alkalosis too.':'PaCO₂ '+c+' fits: compensation appropriate.')]);
    if(c>e2+2||c<e2-2)mixed=true;
    out.push(['Cause','Vomiting or NG suction, diuretics, hyperaldosteronism. Urine Cl⁻ low (under 20) = saline-responsive (vomiting, past diuretics); high = mineralocorticoid excess or current diuretic.']);push(agLine(false))}
  else{name='Respiratory alkalosis';var d2=(40-c)/10,ac2=24-2*d2,ch2=24-4.5*d2;
    out.push(['Primary','<b>Respiratory alkalosis</b>: PaCO₂ '+c+' is low.']);
    var t2=h>ac2+2?'HCO₃⁻ '+h+' is above acute compensation: a metabolic alkalosis too.':h>=ac2-2&&Math.abs(h-ac2)<=Math.abs(h-ch2)?'HCO₃⁻ '+h+' fits an <b>acute</b> fall (anxiety, pain, early salicylate, PE).':h>=ch2-2?'HCO₃⁻ '+h+' fits a <b>chronic</b> fall (altitude, pregnancy, liver disease).':'HCO₃⁻ '+h+' is below chronic compensation: a metabolic acidosis too.';
    if(h>ac2+2||h<ch2-2)mixed=true;
    out.push(['Compensation','Expected HCO₃⁻ about '+ac2.toFixed(0)+' if acute (−2 per 10 mmHg), '+ch2.toFixed(0)+' if chronic (−4 to −5 per 10). '+t2]);push(agLine(false))}
  if(mixed)name+=', mixed';
  if(nph)out.push(['Verdict',mixed?'The normal pH hides a <b>mixed disorder</b>: two processes pulling in opposite directions.':'Compensation has brought the pH back into range: a long-standing (chronic) process. Compensation alone rarely reaches a normal pH, except in chronic respiratory alkalosis.']);
  else if(mixed)out.push(['Verdict','<b>Mixed disorder</b>: more than one process is at work.']);
  return {ph:ph,ag:ag,out:out,name:name};
}
F.abg={title:'Read the gas',def:{co2:26,hco3:12,cl:104},
ctrl:function(s){return '<div class="frow"><span>Case</span>'+Object.keys(AB).map(function(k){var a=AB[k];return btn('abg','pre',k,a[0],s.co2===a[1]&&s.hco3===a[2]&&s.cl===a[3],{co2:a[1],hco3:a[2],cl:a[3]})}).join('')+'</div><div class="frow">'+rng('abg','co2',15,90,1,s.co2,'PaCO₂',s.co2+' mmHg')+'</div><div class="frow">'+rng('abg','hco3',4,45,1,s.hco3,'HCO₃⁻',s.hco3+' mmol/L')+'</div><div class="frow">'+rng('abg','cl',80,125,1,s.cl,'Cl⁻',s.cl+' mmol/L')+'</div>'},
view:function(s){
  var c=s.co2,h=s.hco3,R=abgRead(c,h,s.cl),ph=R.ph;
  function X(p){return 40+(p-10)/80*290}function Y(b){return 196-b/48*184}
  var g=svg(340,238,'Acid-base map: PaCO2 '+c+', HCO3 '+h+', pH '+ph.toFixed(2)+'. '+R.name);
  g+='<clipPath id="abgc"><rect x="40" y="12" width="290" height="184"/></clipPath>';
  [7.1,7.2,7.3,7.4,7.5,7.6,7.7].forEach(function(p){var k=0.03*Math.pow(10,p-6.1),x2=Math.min(90,48/k),b2=k*x2;
    g+=LN(X(10),Y(k*10),X(x2),Y(b2),'stroke:'+(p===7.4?'var(--muted)':'var(--line)')+';stroke-width:'+(p===7.4?1.5:1)+';clip-path:url(#abgc)');
    var lx=x2<90?X(x2):X(90),ly=x2<90?Y(48):Y(b2);g+=T(x2<90?lx:lx-2,x2<90?ly+12:ly-4,p.toFixed(1),{a:'end',s:11.5,f:C.mu})});
  g+='<rect x="'+X(35)+'" y="'+Y(26)+'" width="'+(X(45)-X(35))+'" height="'+(Y(22)-Y(26))+'" style="fill:var(--good);fill-opacity:.25;stroke:var(--good)"/>';
  function band(pts,col){return PL(pts.map(function(p){return [X(p[0]),Y(p[1])]}),'stroke:'+col+';stroke-width:7;stroke-opacity:.38;stroke-linecap:round;clip-path:url(#abgc)')}
  var mA=[],mK=[],ra=[],rc=[],la=[],lc=[],t;
  for(t=4;t<=24;t+=2)mA.push([1.5*t+8,t]);for(t=24;t<=44;t+=2)mK.push([40+0.7*(t-24),t]);
  for(t=40;t<=90;t+=5){ra.push([t,24+0.1*(t-40)]);rc.push([t,24+0.35*(t-40)])}for(t=40;t>=12;t-=4){la.push([t,24-0.2*(40-t)]);lc.push([t,24-0.45*(40-t)])}
  g+=band(mA,'var(--path)')+band(mK,'var(--path)')+band(ra,'var(--bio)')+band(la,'var(--bio)')+band(rc,'var(--pharm)')+band(lc,'var(--pharm)');
  g+=LN(40,196,330,196,'stroke:var(--muted);stroke-width:1.5')+LN(40,12,40,196,'stroke:var(--muted);stroke-width:1.5');
  [20,40,60,80].forEach(function(p){g+=T(X(p),212,p,{a:'middle',s:12,f:C.mu})});[12,24,36,48].forEach(function(b){g+=T(36,Y(b)+4,b,{a:'end',s:12,f:C.mu})});
  g+=T(330,232,'PaCO₂ (mmHg)',{a:'end',s:12,f:C.mu})+T(46,24,'HCO₃⁻',{s:12,f:C.mu});
  g+='<circle cx="'+r1(X(c))+'" cy="'+r1(Y(h))+'" r="9" style="fill:none;stroke:var(--accent);stroke-width:2"/><circle cx="'+r1(X(c))+'" cy="'+r1(Y(h))+'" r="4.5" style="fill:var(--accent)"/>';
  g+='</svg>';
  var pos=Math.max(0,Math.min(100,(ph-6.9)/0.8*100));
  var bar='<div style="display:flex;align-items:center;gap:12px;margin:6px 0"><b class="mono" style="font-size:28px;color:'+(ph<7.35||ph>7.45?'var(--accent-text)':'var(--fg)')+'">pH '+ph.toFixed(2)+'</b><div style="position:relative;flex:1;height:10px;background:linear-gradient(90deg,var(--phys) 0%,var(--surface2) 52%,var(--surface2) 70%,var(--pharm) 100%);border-radius:5px" aria-hidden="true"><i style="position:absolute;left:'+r1(56.25)+'%;width:'+r1(12.5)+'%;top:-3px;bottom:-3px;border:1px solid var(--good);border-radius:3px"></i><i style="position:absolute;left:calc('+r1(pos)+'% - 2px);top:-5px;width:4px;height:20px;background:var(--fg)"></i></div></div>';
  var steps='<div class="abgout">'+R.out.map(function(x){return '<p><span class="mono" style="font-size:12px;color:var(--muted);letter-spacing:.08em;text-transform:uppercase;margin-right:6px">'+x[0]+'</span>'+x[1]+'</p>'}).join('')+'</div>';
  return bar+g+key([['var(--path)','metabolic (Winter, 0.7 rule)'],['var(--bio)','acute respiratory'],['var(--pharm)','chronic respiratory'],['var(--good)','normal box']])+'<div aria-live="polite">'+steps+'</div><p class="fcap muted" style="font-size:13px">pH is calculated (Henderson-Hasselbalch), so the numbers always fit. Na⁺ fixed at 140 mmol/L for the anion gap.</p>';
}};
fmtFor(['pvloop','mi','vq','abg']);
})();
