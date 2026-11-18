/* Bassiet figures, part 6: muscle and nerve. Kit as in figs4.js (inline text sizes, data-act="fig7"). */
(function(){
'use strict';
var F=window.FIG,CT=window.CT;
var FMT=window.FIGFMT=window.FIGFMT||{};
function r1(n){return Math.round(n*10)/10}
/* text uses the shared classes (D01 sizes them per device): size hint <=13 -> .ft.sm, 13-16 -> .ft, >=16 -> .ft.big */
function T(x,y,t,o){o=o||{};var z=o.s||13,cl=z>=16?'ft big':z>13?'ft':'ft sm';return '<text x="'+r1(x)+'" y="'+r1(y)+'"'+(o.a?' text-anchor="'+o.a+'"':'')+' class="'+cl+(o.c?' '+o.c:'')+'"'+(o.w||o.f?' style="'+(o.w?'font-weight:'+o.w:'')+(o.w&&o.f?';':'')+(o.f?'fill:'+o.f:'')+'"':'')+'>'+t+'</text>'}
function LN(x1,y1,x2,y2,st){return '<line x1="'+r1(x1)+'" y1="'+r1(y1)+'" x2="'+r1(x2)+'" y2="'+r1(y2)+'" style="'+st+'"/>'}
function PL(pts,st){return '<polyline points="'+pts.map(function(p){return r1(p[0])+','+r1(p[1])}).join(' ')+'" style="fill:none;'+(st||'')+'"/>'}
function svg(w,h,label){return '<svg viewBox="0 0 '+w+' '+h+'" class="figsvg" role="img" aria-label="'+String(label).replace(/["<>]/g,'')+'">'}
function btn(id,k,v,label,on,set){return '<button type="button" class="fbtn" data-act="fig7" data-fig="'+id+'" data-k="'+k+'" data-v="'+v+'"'+(set?" data-set='"+JSON.stringify(set)+"'":'')+' aria-pressed="'+(!!on)+'">'+label+'</button>'}
function rng(id,k,min,max,step,val,label,txt){var rid='fr-'+id+'-'+k;return '<label for="'+rid+'">'+label+'</label><input type="range" class="figrange" id="'+rid+'" data-fig="'+id+'" data-k="'+k+'" min="'+min+'" max="'+max+'" step="'+step+'" value="'+val+'" aria-label="'+label+'" aria-valuetext="'+txt+'"><b class="mono" aria-hidden="true">'+txt+'</b>'}
function cap(h){return '<p class="fcap" aria-live="polite">'+h+'</p>'}
function key(a){return '<div class="fkey" style="display:flex;flex-wrap:wrap;gap:4px 14px;margin:4px 0 0;font-size:13px;color:var(--muted)">'+a.map(function(x){return '<span><i style="display:inline-block;width:16px;height:0;border-top:3px '+(x[2]||'solid')+' '+x[0]+';vertical-align:middle;margin-right:6px"></i>'+x[1]+'</span>'}).join('')+'</div>'}
function stats(a){return '<div class="fstat" style="display:flex;flex-wrap:wrap;gap:4px 16px;margin:6px 0 0;font:500 13px var(--mono);color:var(--muted)">'+a.map(function(x){return '<span>'+x[0]+' <b style="color:var(--fg);font-weight:700">'+x[1]+'</b></span>'}).join('')+'</div>'}
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
var C={fg:'var(--fg)',mu:'var(--muted)',at:'var(--accent-text)',bad:'var(--bad)'};

/* ---------- sarcomere in µm, with the length-tension curve ---------- */
function tension(L){if(L>=3.6)return 0;if(L>=2.25)return (3.6-L)/1.35;if(L>=2.0)return 1;if(L>=1.67)return 1-0.6*(2.0-L);return Math.max(0,0.8-4.5*(1.67-L))}
FMT['sarc.L']=function(v){return v.toFixed(1)+' µm'};
F.sarc={title:'A sarcomere contracting',def:{L:2.2},
ctrl:function(s){var L=s.L||2.2;return '<div class="frow">'+rng('sarc','L',1.6,3.8,0.1,L,'Sarcomere length',L.toFixed(1)+' µm')+'</div>'},
view:function(s){
  var L=Math.max(1.6,Math.min(3.8,s.L||2.2)),k=78,cx=170,zl=cx-L/2*k,zr=cx+L/2*k,thin=1.0*k,th=0.8*k,ten=tension(L);
  var Ib=Math.max(0,L-1.6),Hz=Math.max(0,L-2.0),g=svg(340,262,'Sarcomere '+L.toFixed(1)+' micrometres, tension '+Math.round(ten*100)+'% of maximum');
  [40,64,88].forEach(function(y){g+='<rect x="'+r1(zl)+'" y="'+(y-3)+'" width="'+r1(thin)+'" height="5" rx="2" style="fill:var(--bio)"/><rect x="'+r1(zr-thin)+'" y="'+(y-1)+'" width="'+r1(thin)+'" height="5" rx="2" style="fill:var(--bio)"/>'});
  [52,76].forEach(function(y){g+='<rect x="'+r1(cx-th)+'" y="'+(y-5)+'" width="'+r1(2*th)+'" height="10" rx="4" style="fill:var(--phys)"/>';
    for(var x=cx-th+6;x<cx+th-4;x+=8){if(Math.abs(x-cx)<8)continue;var d=x<cx?-1:1;g+=LN(x,y-5,x+d*3,y-9,'stroke:var(--phys);stroke-width:1.5')+LN(x,y+5,x+d*3,y+9,'stroke:var(--phys);stroke-width:1.5')}});
  g+='<rect x="'+r1(zl-3)+'" y="26" width="6" height="76" style="fill:var(--fg)"/><rect x="'+r1(zr-3)+'" y="26" width="6" height="76" style="fill:var(--fg)"/>'+LN(cx,30,cx,98,'stroke:var(--accent);stroke-width:2;stroke-dasharray:3 3');
  g+=T(zl,20,'Z',{a:'middle',s:13,w:700})+T(zr,20,'Z',{a:'middle',s:13,w:700})+T(cx,20,'M',{a:'middle',s:13,w:700,f:C.at});
  function br(x1,x2,y,lab,col){if(x2-x1<1)return '';return LN(x1,y,x2,y,'stroke:'+col+';stroke-width:1.5')+LN(x1,y-4,x1,y+4,'stroke:'+col)+LN(x2,y-4,x2,y+4,'stroke:'+col)}
  g+=br(cx-th,cx+th,110,'','var(--phys)')+T(cx,126,'A band 1.6 µm (myosin; never changes)',{a:'middle',s:12.5,f:'var(--phys-t)'});
  if(Ib>0.05)g+=br(zl,cx-th,110,'','var(--bio)')+br(cx+th,zr,110,'','var(--bio)');
  if(Hz>0.05)g+=br(cx-Hz/2*k,cx+Hz/2*k,104,'','var(--accent)');
  /* length-tension */
  function X(l){return 44+(l-1.6)/2.2*286}function Y(t){return 236-t*80}
  g+=LN(44,236,332,236,'stroke:var(--muted);stroke-width:1.5')+LN(44,150,44,236,'stroke:var(--muted);stroke-width:1.5');
  var p=[];for(var l=1.6;l<=3.8001;l+=0.02)p.push([X(l),Y(tension(l))]);g+=PL(p,'stroke:var(--muted);stroke-width:2');
  g+='<rect x="'+r1(X(2.0))+'" y="150" width="'+r1(X(2.25)-X(2.0))+'" height="86" style="fill:var(--good);fill-opacity:.12"/>';
  g+=LN(X(L),150,X(L),236,'stroke:var(--accent);stroke-dasharray:3 3')+'<circle cx="'+r1(X(L))+'" cy="'+r1(Y(ten))+'" r="6" style="fill:var(--accent)"/>';
  [2,2.5,3,3.5].forEach(function(l){g+=T(X(l),252,l.toFixed(1),{a:'middle',s:12,f:C.mu})});
  g+=T(50,148,'active tension',{s:12,f:C.mu})+T(332,252,'µm',{a:'end',s:12,f:C.mu})+T(X(2.125),246,'',{});
  g+='</svg>';
  var why=L<1.67?'Thick filaments are jammed against the Z lines and thin filaments collide: tension collapses.':L<2.0?'Thin filaments from the two sides overlap each other past the M line and get in each other’s way: tension falls a little.':L<=2.25?'Optimal overlap (about 2.0–2.2 µm): every myosin head can reach actin. This is near resting length.':L<3.6?'Stretched: fewer myosin heads reach actin, so tension falls in a straight line.':'No overlap at all: no cross-bridges, no active tension.';
  return g+key([['var(--bio)','I band (actin only)'],['var(--accent)','H zone (myosin only)'],['var(--phys)','A band']])+stats([['sarcomere',L.toFixed(1)+' µm'],['I band',Ib.toFixed(1)+' µm'],['H zone',Hz.toFixed(1)+' µm'],['tension',Math.round(ten*100)+'%']])+cap(why+' <span class="muted">As it shortens, the I band and H zone narrow and the Z lines close in; the A band stays the same. In the heart, the Frank–Starling law rides the rising limb: more stretch (preload), more force.</span>');
}};

/* ---------- neuron action potential ---------- */
var NA={n:['Normal',{rest:-70,thr:-55,up:0.5,pk:35,ahp:-80},'Rest −70 mV; the stimulus reaches threshold (about −55 mV), voltage-gated Na⁺ channels open together and the membrane overshoots; K⁺ efflux repolarises it, with a brief after-hyperpolarisation.'],
lid:['Lidocaine',{rest:-70,thr:-45,fail:1},'Lidocaine enters open Na⁺ channels from inside and holds them inactivated (use-dependent). Fewer channels are available, so the same stimulus no longer reaches the threshold for a spike: conduction fails. Small, fast-firing pain fibres are blocked first.'],
hk:['High extracellular K⁺',{rest:-60,thr:-55,up:1.4,pk:-5,ahp:-64},'Hyperkalaemia shrinks the K⁺ gradient, so the resting potential rises toward threshold. The depolarised membrane keeps many Na⁺ channels inactivated: a smaller, slower spike that may fail. Severe hyperkalaemia blocks conduction (weakness, heart block, arrest).'],
lk:['Low extracellular K⁺',{rest:-82,thr:-55,fail:1},'Hypokalaemia steepens the K⁺ gradient and hyperpolarises the resting membrane: the same stimulus falls short of threshold (muscle weakness, ileus). In the heart it slows repolarisation (U waves) and favours arrhythmias.'],
ca:['Low extracellular Ca²⁺',{rest:-70,thr:-62,up:0.5,pk:35,ahp:-80,rep:1},'Hypocalcaemia lowers the threshold (less Ca²⁺ screening the outside of Na⁺ channels): the nerve fires on a smaller push and even fires on its own. Tingling, cramps, tetany; Chvostek and Trousseau signs.'],
ttx:['Tetrodotoxin',{rest:-70,thr:-55,none:1},'Tetrodotoxin (puffer fish) and saxitoxin plug the Na⁺ channel from outside: no spike at all, only the passive shift caused by the stimulus, which fades.']};
function trace(c){var p=[],t,v;
  for(t=0;t<=10.001;t+=0.05){
    if(t<1)v=c.rest;
    else if(t<1.3)v=c.rest+18*(t-1)/0.3;
    else if(c.none||c.fail||c.rest+18<c.thr){v=c.rest+18*Math.exp(-(t-1.3)/0.8)}
    else{var a=t-1.3,up=c.up;
      if(a<up){var u=a/up;v=c.rest+18+(c.pk-c.rest-18)*(u*u*(3-2*u))}
      else if(a<up+1.2){u=(a-up)/1.2;v=c.pk-(c.pk-c.ahp)*(u*u*(3-2*u))}
      else v=c.rest+(c.ahp-c.rest)*Math.exp(-(a-up-1.2)/1.2);
      if(c.rep&&t>=6){var b=t-6;if(b<0.6)v=v+(c.thr-v)*(b/0.6);else{b-=0.6;if(b<up){u=b/up;v=c.thr+(c.pk-c.thr)*(u*u*(3-2*u))}else if(b<up+1.2){u=(b-up)/1.2;v=c.pk-(c.pk-c.ahp)*(u*u*(3-2*u))}else v=c.rest+(c.ahp-c.rest)*Math.exp(-(b-up-1.2)/1.2)}}
    }
    p.push([t,v])}
  return p}
F.neuroap={title:'A neuron fires',def:{k:'n'},
ctrl:function(s){return '<div class="frow"><span>Condition</span>'+Object.keys(NA).map(function(k){return btn('neuroap','k',k,NA[k][0],s.k===k)}).join('')+'</div>'},
view:function(s){
  var c=NA[s.k]||NA.n,m=c[1];function X(t){return 44+t*28.6}function Y(v){return 14+(45-v)*1.3}
  var fired=!(m.none||m.fail||m.rest+18<m.thr),g=svg(340,224,'Neuron action potential, '+c[0]+(fired?': fires':': no spike'));
  g+=LN(44,Y(0),334,Y(0),'stroke:var(--line);stroke-dasharray:3 3')+T(40,Y(0)+4,'0',{a:'end',s:12,f:C.mu});
  g+=LN(44,Y(-70),334,Y(-70),'stroke:var(--line);stroke-dasharray:3 3')+T(40,Y(-70)+4,'−70',{a:'end',s:12,f:C.mu});
  g+=LN(44,Y(m.thr),334,Y(m.thr),'stroke:var(--bad);stroke-dasharray:5 4;opacity:.85')+T(334,Y(m.thr)-5,'threshold '+m.thr+' mV',{a:'end',s:12,f:C.bad});
  if(s.k!=='n')g+=PL(trace(NA.n[1]).map(function(q){return [X(q[0]),Y(q[1])]}),'stroke:var(--muted);stroke-width:2;stroke-dasharray:5 4;opacity:.8');
  g+=PL(trace(m).map(function(q){return [X(q[0]),Y(q[1])]}),'stroke:'+(s.k==='n'?'var(--bio)':'var(--accent)')+';stroke-width:2.6;stroke-linejoin:round');
  g+='<path d="M'+r1(X(1))+','+r1(Y(-96)+10)+' l-5,8 h10 z" style="fill:var(--fg)"/>'+T(X(1)+8,Y(-96)+18,'stimulus',{s:12,f:C.mu});
  g+=T(X(m.rest>-75?3.6:3.6),Y(m.rest)+16,'rest '+m.rest,{s:12,f:C.mu});
  g+=LN(X(8),214,X(9),214,'stroke:var(--fg);stroke-width:2')+T(X(9),208,'1 ms',{a:'end',s:12,f:C.mu})+T(4,16,'mV',{s:12,f:C.mu});
  g+='</svg>';
  return g+(s.k!=='n'?key([['var(--accent)',c[0]],['var(--muted)','normal','dashed']]):'')+cap('<b>'+c[0]+'.</b> '+c[2]);
}};

/* ---------- spinal cord lesions ---------- */
var CL={bs:['Brown-Séquard (right hemisection)',['dcR','ctR','stR','ahR'],[['','right, below'],['','right, at the level'],['','right, below'],['left, from 1–2 levels below','right, at the level']],'Same side: spastic weakness and loss of vibration and position below the lesion (these tracts cross high up), flaccid weakness at the level. Opposite side: loss of pain and temperature (spinothalamic fibres have already crossed), starting 1–2 segments below.'],
syr:['Syringomyelia',['com','ahL','ahR'],[['later, below','later, below'],['hands (wasting)','hands (wasting)'],['',''],['cape, at the levels','cape, at the levels']],'The cavity widens in the centre of the cord and first cuts the spinothalamic fibres crossing in the anterior white commissure: a cape of pain and temperature loss over the shoulders and arms, with touch spared. Growing, it reaches the anterior horns (hand wasting). Chiari I malformation; trauma.'],
scd:['Subacute combined degeneration',['dcL','dcR','ctL','ctR'],[['below','below'],['',''],['below','below'],['','']],'Vitamin B12 (or copper) deficiency: dorsal columns and lateral corticospinal tracts on both sides (plus spinocerebellar): sensory ataxia, positive Romberg, spastic weakness with up-going plantars; often a peripheral neuropathy too.'],
tab:['Tabes dorsalis',['dcL','dcR','drL','drR'],[['',''],['',''],['below','below'],['','']],'Tertiary syphilis destroys the dorsal roots and dorsal columns: sensory ataxia, positive Romberg, lightning pains, lost reflexes (the afferent limb is gone), Argyll Robertson pupils, Charcot joints.'],
asa:['Anterior spinal artery',['ctL','ctR','stL','stR','ahL','ahR'],[['below','below'],['at the level','at the level'],['',''],['below','below']],'The artery feeds the front two-thirds of the cord: bilateral weakness and pain/temperature loss below, flaccid at the level, while vibration and position are spared (dorsal columns run on the posterior spinal arteries). Aortic surgery or dissection (artery of Adamkiewicz).'],
als:['ALS',['ctL','ctR','ahL','ahR'],[['yes','yes'],['yes','yes'],['',''],['','']],'Upper and lower motor neurons both degenerate: spasticity and brisk reflexes alongside wasting and fasciculations; sensation, bladder and eye movements spared. SOD1 in some familial cases; riluzole, edaravone.'],
polio:['Polio',['ahL'],[['',''],['patchy, asymmetric',''],['',''],['','']],'Poliovirus destroys anterior horn cells: asymmetric flaccid paralysis, wasting, lost reflexes; sensation intact. Spinal muscular atrophy (SMN1) hits the same cells in infants.']};
F.cord={title:'Cross-section of the cord',def:{l:'bs'},
ctrl:function(s){return '<div class="frow"><span>Lesion</span>'+Object.keys(CL).map(function(k){return btn('cord','l',k,CL[k][0],s.l===k)}).join('')+'</div>'},
view:function(s){
  var c=CL[s.l]||CL.bs,hit=c[1],cx=216,cy=110,g=svg(340,228,'Spinal cord cross-section, '+c[0]);
  function on(k){return hit.indexOf(k)>=0}
  function sty(k){return on(k)?'fill:var(--bad);fill-opacity:.85;stroke:var(--bad);stroke-width:2':'fill:var(--surface);stroke:var(--line);stroke-width:1.5'}
  g+='<ellipse cx="'+cx+'" cy="'+cy+'" rx="104" ry="86" style="fill:var(--surface2);stroke:var(--muted);stroke-width:2"/>';
  var gp=[[-6,-10],'C',[-12,-30],[-22,-50],[-30,-66],'L',[-42,-60],'C',[-36,-44],[-30,-26],[-28,-12],'C',[-50,-6],[-66,10],[-62,34],'C',[-60,52],[-44,62],[-30,60],'C',[-20,58],[-14,42],[-8,20],'L',[8,20],'C',[14,42],[20,58],[30,60],'C',[44,62],[60,52],[62,34],'C',[66,10],[50,-6],[28,-12],'C',[30,-26],[36,-44],[42,-60],'L',[30,-66],'C',[22,-50],[12,-30],[6,-10],'Z'];
  var d='M';gp.forEach(function(q){d+=typeof q==='string'?' '+q+' ':r1(cx+q[0]*1.05)+','+r1(cy+q[1]*1.12)+' '});
  g+='<path d="'+d+'" style="fill:color-mix(in srgb,var(--muted) 30%,var(--surface));stroke:var(--muted);stroke-width:1.5"/>';
  /* tracts (left, then mirrored right) */
  function side(sx,L){var o='';
    o+='<path d="M'+r1(cx+sx*3)+','+r1(cy-16)+' L'+r1(cx+sx*3)+','+r1(cy-84)+' C'+r1(cx+sx*14)+','+r1(cy-85)+' '+r1(cx+sx*24)+','+r1(cy-82)+' '+r1(cx+sx*30)+','+r1(cy-78)+' L'+r1(cx+sx*8)+','+r1(cy-16)+' Z" style="'+sty('dc'+L)+'"/>';
    o+='<ellipse cx="'+r1(cx+sx*76)+'" cy="'+r1(cy-18)+'" rx="15" ry="19" style="'+sty('ct'+L)+'"/>';
    o+='<ellipse cx="'+r1(cx+sx*80)+'" cy="'+r1(cy+36)+'" rx="12" ry="18" style="'+sty('st'+L)+'"/>';
    o+='<circle cx="'+r1(cx+sx*40)+'" cy="'+r1(cy+44)+'" r="12" style="'+sty('ah'+L)+'"/>';
    o+='<path d="M'+r1(cx+sx*40)+','+r1(cy-76)+' l'+(sx*18)+',-14" style="stroke:'+(on('dr'+L)?'var(--bad)':'var(--muted)')+';stroke-width:'+(on('dr'+L)?5:3)+';stroke-linecap:round"/>';
    return o}
  g+=side(-1,'L')+side(1,'R');
  g+='<rect x="'+(cx-14)+'" y="'+(cy+6)+'" width="28" height="8" rx="3" style="'+sty('com')+'"/><circle cx="'+cx+'" cy="'+(cy-2)+'" r="3" style="fill:var(--bg)"/>';
  /* labels with leaders to the left tracts */
  [['dorsal column',cx-16,cy-60,34],['corticospinal',cx-76,cy-18,78],['spinothalamic',cx-80,cy+36,116],['anterior horn',cx-40,cy+44,150],['commissure',cx-14,cy+10,184],['dorsal root',cx-52,cy-84,15]].forEach(function(q){
    g+=LN(102,q[3]-4,q[1],q[2],'stroke:var(--muted);stroke-width:1;opacity:.7')+T(100,q[3],q[0],{a:'end',s:12.5})});
  g+=T(cx-60,222,'LEFT',{a:'middle',s:12,w:700,f:C.mu})+T(cx+60,222,'RIGHT',{a:'middle',s:12,w:700,f:C.mu})+T(334,16,'dorsal ↑',{a:'end',s:12,f:C.mu});
  g+='</svg>';
  var rows=['Spastic weakness (UMN)','Flaccid weakness (LMN)','Vibration, position','Pain, temperature'];
  var tb='<div class="fgrid" style="display:grid;grid-template-columns:auto 1fr 1fr;gap:4px 10px;margin:8px 0 0;font-size:14px"><span></span><b class="mono" style="font-size:12px;color:var(--muted)">LEFT</b><b class="mono" style="font-size:12px;color:var(--muted)">RIGHT</b>'+rows.map(function(r,i){var v=c[2][i];return '<span style="color:var(--muted);font-size:13px">'+r+'</span>'+[0,1].map(function(j){return '<span style="color:'+(v[j]?'var(--bad)':'var(--muted)')+';font-weight:'+(v[j]?700:400)+'">'+(v[j]?'✕ '+v[j]:'spared')+'</span>'}).join('')}).join('')+'</div>';
  return g+tb+cap('<b>'+c[0]+'.</b> '+c[3]);
}};

/* ---------- visual pathway with the lesion, and the fields ---------- */
var VL={on:['Left optic nerve',[1,1,1,1],[0,0,0,0],'Monocular blindness of the left eye (and a lost direct light reflex on that side).'],
ch:['Optic chiasm',[1,1,0,0],[0,0,1,1],'Bitemporal hemianopia: the crossing nasal fibres carry both temporal fields. Pituitary adenoma or craniopharyngioma pressing from below.'],
ot:['Right optic tract',[1,1,0,0],[1,1,0,0],'Left homonymous hemianopia: the right tract carries the left half of the world from both eyes.'],
ml:['Right Meyer loop',[1,0,0,0],[1,0,0,0],'Left superior quadrantanopia ("pie in the sky"): the lower fibres loop forward through the temporal lobe (MCA inferior division, temporal surgery).'],
pr:['Right parietal radiation',[0,1,0,0],[0,1,0,0],'Left inferior quadrantanopia: the upper fibres run straight back through the parietal lobe (MCA superior division).'],
oc:['Right occipital cortex (PCA)',[1,1,0,0],[1,1,0,0],'Left homonymous hemianopia with macular sparing: the occipital pole, where the macula is mapped, has a dual supply from the MCA.']};
F.visual={title:'Where the light is cut',def:{l:'ch'},
ctrl:function(s){return '<div class="frow"><span>Lesion</span>'+Object.keys(VL).map(function(k){return btn('visual','l',k,VL[k][0],s.l===k)}).join('')+'</div>'},
view:function(s){
  var v=VL[s.l]||VL.ch,g=svg(340,338,'Visual pathway, lesion at '+v[0]+': '+v[3]);
  var nerve='stroke:var(--muted);stroke-width:3;fill:none;stroke-linecap:round';
  g+='<defs><pattern id="vhatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="6" height="6" style="fill:var(--bg)"/><line x1="0" y1="0" x2="0" y2="6" style="stroke:var(--muted);stroke-width:1.5;opacity:.5"/></pattern></defs>';
  /* eyes */
  [[120,'L'],[220,'R']].forEach(function(e){g+='<circle cx="'+e[0]+'" cy="22" r="14" style="fill:var(--surface2);stroke:var(--muted);stroke-width:2"/><circle cx="'+e[0]+'" cy="12" r="5" style="fill:var(--fg)"/>'});
  g+='<path d="M120,36 L170,74 L220,36" style="'+nerve+'"/><path d="M170,74 L124,116 M170,74 L216,116" style="'+nerve+'"/>';
  g+='<ellipse cx="124" cy="120" rx="9" ry="6" style="fill:var(--surface2);stroke:var(--muted);stroke-width:2"/><ellipse cx="216" cy="120" rx="9" ry="6" style="fill:var(--surface2);stroke:var(--muted);stroke-width:2"/>';
  g+='<path d="M124,126 C120,150 150,184 156,206 M124,126 C70,150 74,190 150,210 M216,126 C220,150 190,184 184,206 M216,126 C270,150 266,190 190,210" style="'+nerve+';stroke-width:2.4"/>';
  g+='<path d="M140,214 Q170,226 200,214" style="fill:none;stroke:var(--accent);stroke-width:5;stroke-linecap:round"/>';
  g+=T(76,62,'optic nerve',{a:'middle',s:12,f:C.mu})+T(184,80,'chiasm',{s:12,f:C.mu})+T(206,98,'tract',{s:12,f:C.mu})+T(230,124,'LGN',{s:12,f:C.mu})+T(298,192,'Meyer loop',{a:'middle',s:12,f:C.mu})+T(226,156,'parietal',{s:12,f:C.mu})+T(206,232,'V1',{s:12,w:700,f:C.at})+T(120,8,'',{});
  var M={on:[145,55],ch:[170,74],ot:[193,95],ml:[262,168],pr:[203,170],oc:[188,215]}[s.l];
  g+='<circle cx="'+M[0]+'" cy="'+M[1]+'" r="10" style="fill:var(--bad);fill-opacity:.25;stroke:var(--bad);stroke-width:2.5"/>'+LN(M[0]-7,M[1]-7,M[0]+7,M[1]+7,'stroke:var(--bad);stroke-width:3')+LN(M[0]-7,M[1]+7,M[0]+7,M[1]-7,'stroke:var(--bad);stroke-width:3');
  /* fields, as the patient sees them: q = [left-upper, left-lower, right-upper, right-lower] */
  function field(cx,q,label,k){var cy=272,r=38,id='vc'+k+cx,o='<defs><clipPath id="'+id+'"><circle cx="'+cx+'" cy="'+cy+'" r="'+r+'"/></clipPath></defs><circle cx="'+cx+'" cy="'+cy+'" r="'+r+'" style="fill:var(--accent-soft);stroke:var(--accent);stroke-width:2"/>';
    [[cx-r,cy-r],[cx-r,cy],[cx,cy-r],[cx,cy]].forEach(function(Q,i){if(q[i])o+='<rect x="'+Q[0]+'" y="'+Q[1]+'" width="'+r+'" height="'+r+'" clip-path="url(#'+id+')" style="fill:url(#vhatch)"/>'});
    if(s.l==='oc')o+='<path d="M'+cx+','+(cy-10)+' A10,10 0 0 0 '+cx+','+(cy+10)+' Z" style="fill:var(--accent-soft)"/>';
    o+=LN(cx-r,cy,cx+r,cy,'stroke:var(--muted);stroke-width:1;opacity:.6')+LN(cx,cy-r,cx,cy+r,'stroke:var(--muted);stroke-width:1;opacity:.6');
    return o+T(cx,330,label,{a:'middle',s:12.5,f:C.mu})}
  g+=field(120,v[1],'left eye field',s.l)+field(220,v[2],'right eye field',s.l);
  g+='</svg>';
  return g+'<p class="fcap muted" style="font-size:13px;margin-top:2px">Pathway seen from above (patient’s left on the left). Fields drawn as the patient sees them: hatched = blind.</p>'+cap('<b>'+v[0]+'.</b> '+v[3]);
}};
fmtFor(['sarc']);
})();
