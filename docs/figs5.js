/* Bassiet figures, part 5: liver, cycle. Kit as in figs4.js (inline text sizes, data-act="fig7"). */
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
function grid(rows){return '<dl class="fgrid" style="display:grid;grid-template-columns:auto 1fr;gap:4px 14px;margin:8px 0 0;font-size:15px">'+rows.map(function(r){return '<dt style="color:var(--muted);font:500 12px var(--mono);letter-spacing:.06em;text-transform:uppercase;align-self:center">'+r[0]+'</dt><dd style="margin:0;color:'+(r[2]?'var(--accent-text)':'var(--fg)')+';font-weight:'+(r[2]?700:400)+'">'+r[1]+'</dd>'}).join('')+'</dl>'}
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
var C={fg:'var(--fg)',mu:'var(--muted)',at:'var(--accent-text)',bad:'var(--bad)'};

/* ---------- bilirubin: follow the pigment, see where it piles up ---------- */
/* nodes: rbc, unc, liv, bile, gut, stool, conj (blood), urine. up: nodes raised; blk: blocked steps; v: values */
var BL={
n:['Normal',{},[],['normal','normal','none','normal','brown'],'Haem → biliverdin → unconjugated bilirubin, carried on albumin; the liver conjugates it (UGT1A1) and pumps it into bile (MRP2); gut bacteria make urobilinogen, most leaves as brown stercobilin, a little is reabsorbed and passes in the urine.'],
h:['Haemolysis',{rbc:2,unc:2,gut:1,urine:1},[],['↑↑','normal','none','↑','brown or dark'],'Too much haem: the liver conjugates as fast as it can, but unconjugated bilirubin still rises. More pigment reaches the gut, so urine urobilinogen rises. No bilirubin in the urine (unconjugated is bound to albumin): acholuric jaundice. Pigment gallstones.'],
neo:['Newborn',{rbc:1,unc:2},['ugt'],['↑↑','normal','none','normal','brown'],'Physiological jaundice: fetal red cells break down fast while UGT is still immature. Peaks at days 3–5. Very high unconjugated bilirubin crosses the immature blood–brain barrier (kernicterus); blue-light phototherapy makes it water-soluble.'],
g:['Gilbert syndrome',{unc:1},['ugt'],['↑ (fasting, illness)','normal','none','normal','brown'],'UGT1A1 activity reduced (about 30%): mild unconjugated rise with fasting, stress or illness. Harmless and common.'],
c:['Crigler-Najjar type I',{unc:3},['ugtx'],['↑↑↑','low','none','low','pale'],'UGT1A1 absent: very high unconjugated bilirubin from birth, kernicterus. Type II is milder and responds to phenobarbital (enzyme induction).'],
hep:['Hepatitis',{unc:1,liv:1,conj:1,urine:1},['ugt','mrp'],['↑','↑','present','normal or ↑','brown or pale'],'Sick hepatocytes take up, conjugate and excrete less: both fractions rise, with conjugated spilling into blood and urine. ALT and AST far higher than ALP.'],
o:['Bile duct obstruction',{liv:1,conj:2,urine:1},['ductx'],['normal or ↑','↑↑','present (dark urine)','↓ or absent','pale (clay)'],'Stone, stricture or pancreatic head cancer: conjugated bilirubin backs up into the blood and urine (dark urine), none reaches the gut, so stool turns pale and urobilinogen disappears. Itch, high ALP and GGT.'],
d:['Dubin-Johnson syndrome',{liv:1,conj:1,urine:1},['mrp'],['normal','↑','present','normal','brown'],'MRP2 cannot pump conjugated bilirubin into bile: conjugated rises; the liver turns black (pigment). Benign. Rotor syndrome is similar but the liver is not black.']};
F.bili={title:'Follow the bilirubin',def:{c:'n'},
ctrl:function(s){return '<div class="frow"><span>Case</span>'+Object.keys(BL).map(function(k){return btn('bili','c',k,BL[k][0],s.c===k)}).join('')+'</div>'},
view:function(s){
  var b=BL[s.c]||BL.n,up=b[1],blk=b[2],g=svg(340,256,'Bilirubin pathway, '+b[0]+': unconjugated '+b[3][0]+', conjugated '+b[3][1]+', stool '+b[3][4]);
  var N={rbc:[0,16,'Red cells','haem → bilirubin'],unc:[120,16,'Unconjugated','on albumin'],liv:[240,16,'Liver','UGT conjugates'],
    bile:[240,100,'Bile','MRP2 pumps out'],gut:[120,184,'Gut','urobilinogen'],stool:[0,184,'Stool','stercobilin'],conj:[120,100,'Conjugated','in blood'],urine:[0,100,'Urine','kidney filters']};
  var W=100,H=46;
  function box(k){var n=N[k],u=up[k]||0,show=k!=='conj'||u>0;
    var st=u?'fill:color-mix(in srgb,var(--accent) '+(14+u*12)+'%,var(--surface));stroke:var(--accent);stroke-width:'+(1+u)+'':'fill:var(--surface2);stroke:var(--line);stroke-width:1.5';
    if(!show)st='fill:none;stroke:var(--line);stroke-width:1;stroke-dasharray:3 4';
    var o='<rect x="'+n[0]+'" y="'+n[1]+'" width="'+W+'" height="'+H+'" rx="8" style="'+st+'"/>';
    o+=T(n[0]+W/2,n[1]+23,n[2],{a:'middle',s:13,w:700,f:show?C.fg:C.mu});
    if(u)o+='<rect x="'+(n[0]+W/2-17)+'" y="'+(n[1]-8)+'" width="34" height="15" rx="7" style="fill:var(--accent)"/>'+T(n[0]+W/2,n[1]+4,['','↑','↑↑','↑↑↑'][u],{a:'middle',s:12,w:700,f:'var(--accent-ink)'});
    o+=T(n[0]+W/2,n[1]+41,n[3],{a:'middle',s:12,f:C.mu});return o}
  function arr(x1,y1,x2,y2,id,dash){var bk=blk.indexOf(id)>=0||blk.indexOf(id+'x')>=0,full=blk.indexOf(id+'x')>=0;
    var ang=Math.atan2(y2-y1,x2-x1),hx=x2-9*Math.cos(ang),hy=y2-9*Math.sin(ang);
    var col=bk?'var(--bad)':'var(--muted)',o=LN(x1,y1,hx,hy,'stroke:'+col+';stroke-width:'+(bk?2.5:2)+(dash?';stroke-dasharray:4 3':''))+'<path d="M'+r1(x2)+','+r1(y2)+' L'+r1(hx-5*Math.sin(ang))+','+r1(hy+5*Math.cos(ang))+' L'+r1(hx+5*Math.sin(ang))+','+r1(hy-5*Math.cos(ang))+' Z" style="fill:'+col+'"/>';
    if(bk){var mx=(x1+x2)/2,my=(y1+y2)/2;o+='<circle cx="'+r1(mx)+'" cy="'+r1(my)+'" r="8" style="fill:var(--bad)"/>'+T(mx,my+4.5,full?'✕':'½',{a:'middle',s:12,w:700,f:'var(--surface)'})}
    return o}
  g+=arr(100,39,120,39,'rbcunc')+arr(220,39,240,39,'ugt')+arr(290,62,290,92,'mrp')+arr(290,146,220,204,'duct');
  g+=arr(120,207,100,207,'gs')+arr(150,184,60,146,'reab',true);
  if(up.conj)g+=arr(240,123,220,123,'reflux')+arr(120,123,100,123,'tourine');
  ['rbc','unc','liv','bile','gut','stool','conj','urine'].forEach(function(k){g+=box(k)});
  g+=T(170,250,'red ½ = step slowed · red ✕ = step stopped',{a:'middle',s:12,f:C.mu});
  g+='</svg>';
  var v=b[3];
  return g+grid([['Unconjugated',v[0],/↑/.test(v[0])],['Conjugated',v[1],/↑/.test(v[1])],['Urine bilirubin',v[2],v[2]!=='none'],['Urine urobilinogen',v[3],v[3]!=='normal'],['Stool',v[4],v[4]!=='brown']])+cap('<b>'+b[0]+'.</b> '+b[4]+' <span class="muted">Only conjugated bilirubin is water-soluble enough to reach the urine.</span>');
}};

/* ---------- menstrual cycle: hormones, ovary, endometrium ---------- */
function fsh(d){return 24+18*Math.exp(-Math.pow((d-2)/4,2))+20*Math.exp(-Math.pow((d-14)/1.2,2))-9*Math.exp(-Math.pow((d-21)/4,2))+12*Math.exp(-Math.pow((d-28.5)/2,2))}
function lh(d){return 20+110*Math.exp(-Math.pow((d-14)/1.1,2))-6*Math.exp(-Math.pow((d-21)/4,2))}
function e2(d){return 15+75*Math.exp(-Math.pow((d-12.5)/2.6,2))+35*Math.exp(-Math.pow((d-21)/3.5,2))}
function p4(d){return 5+100*Math.exp(-Math.pow((d-21)/4,2))}
function endo(d){return d<=5?3+(5-d)*0.6:d<=14?3+(d-5)*1.1:d<=26?13+Math.min(3,(d-14)*0.5):16-(d-26)*4}
function lvl(v,lo,hi){return v>hi?'high':v>lo?'mid':'low'}
FMT['cycle.d']=function(v){return 'day '+v};
F.cycle={title:'Twenty-eight days',def:{d:14},
ctrl:function(s){return '<div class="frow">'+rng('cycle','d',1,28,1,s.d,'Day','day '+s.d)+'</div>'},
view:function(s){
  var d=s.d;function X(t){return 30+(t-1)/27*300}function Y(v){return 136-v*0.9}
  var g=svg(340,268,'Menstrual cycle, day '+d);
  g+=LN(30,136,330,136,'stroke:var(--muted);stroke-width:1.5');
  if(d>=12&&d<=14)g+='<rect x="'+r1(X(11.5))+'" y="8" width="'+r1(X(14.3)-X(11.5))+'" height="128" style="fill:var(--accent);fill-opacity:.08"/>';
  var H=[['LH',lh,'var(--phys)','var(--phys-t)'],['FSH',fsh,'var(--bio)','var(--bio-t)'],['Oestradiol',e2,'var(--accent)','var(--accent-text)'],['Progesterone',p4,'var(--path)','var(--path-t)']];
  H.forEach(function(h){var p=[];for(var t=1;t<=28;t+=.25)p.push([X(t),Y(h[1](t))]);g+=PL(p,'stroke:'+h[2]+';stroke-width:2.6')});
  g+=T(36,20,'LH',{s:12.5,w:700,f:'var(--phys-t)'})+T(64,20,'FSH',{s:12.5,w:700,f:'var(--bio-t)'})+T(36,38,'oestradiol',{s:12.5,w:700,f:'var(--accent-text)'})+T(36,56,'progesterone',{s:12.5,w:700,f:'var(--path-t)'});
  g+=LN(X(d),8,X(d),232,'stroke:var(--fg);stroke-width:1.5;opacity:.55');
  H.forEach(function(h){g+='<circle cx="'+r1(X(d))+'" cy="'+r1(Y(h[1](d)))+'" r="3.5" style="fill:'+h[2]+'"/>'});
  /* ovary strip */
  g+=T(4,156,'OVARY',{s:11.5,w:700,f:C.mu});
  [2,6,10,13,15,19,23,27].forEach(function(t){var x=X(t),y=172,o;
    if(t<14)o='<circle cx="'+r1(x)+'" cy="'+y+'" r="'+(3+t*0.55)+'" style="fill:var(--surface2);stroke:var(--bio);stroke-width:1.5"/><circle cx="'+r1(x+1)+'" cy="'+(y-1)+'" r="2" style="fill:var(--bio)"/>';
    else if(t===15)o='<path d="M'+r1(x-9)+','+y+' a9,9 0 1,1 18,0 l-4,-2 l-3,4 l-2,-5 l-3,4 z" style="fill:var(--surface2);stroke:var(--bio);stroke-width:1.5"/><circle cx="'+r1(x+12)+'" cy="'+(y-8)+'" r="2.4" style="fill:var(--bio)"/>';
    else o='<circle cx="'+r1(x)+'" cy="'+y+'" r="'+(t<26?9:6)+'" style="fill:color-mix(in srgb,var(--accent) '+(t<26?55:20)+'%,var(--surface));stroke:var(--accent);stroke-width:1.5"/>';
    g+=o});
  g+=T(X(7),194,'follicles grow',{a:'middle',s:12,f:C.mu})+T(X(14.5),194,'ovulation',{a:'middle',s:12,f:C.mu})+T(X(22),194,'corpus luteum',{a:'middle',s:12,f:C.mu});
  /* endometrium strip */
  g+=T(4,210,'LINING',{s:11.5,w:700,f:C.mu});
  var top=[],bot=[];for(var t=1;t<=28;t+=.5){top.push([X(t),226-endo(t)]);bot.push([X(t),226])}
  g+='<polygon points="'+top.concat(bot.reverse()).map(function(p){return r1(p[0])+','+r1(p[1])}).join(' ')+'" style="fill:var(--phys-s);stroke:var(--phys);stroke-width:1.2"/>';
  g+='<rect x="'+r1(X(1))+'" y="222" width="'+r1(X(5)-X(1))+'" height="4" style="fill:var(--phys)"/>';
  [1,7,14,21,28].forEach(function(t){g+=T(X(t),262,t,{a:'middle',s:12.5,f:t===d?C.at:C.mu,w:t===d?700:null})});
  g+=T(X(3),240,'menses',{a:'middle',s:12,f:C.mu})+T(X(10),240,'proliferative',{a:'middle',s:12,f:C.mu})+T(X(21.5),240,'secretory',{a:'middle',s:12,f:C.mu});
  g+='</svg>';
  var ph=d<=5?'Menstruation: the lining sheds as progesterone falls; rising FSH from the end of the last cycle recruits a new group of follicles.':d<12?'Follicular phase: the dominant follicle makes rising oestradiol, which feeds back negatively on FSH; the endometrium proliferates.':d<=13?'Oestradiol has stayed high (above about 200 pg/mL for about 2 days): feedback on the pituitary <b>flips from negative to positive</b>, and the LH surge begins.':d<=15?'LH surge; ovulation follows about 36 hours after the surge begins (mittelschmerz; basal temperature rises after it).':d<=25?'Luteal phase: the corpus luteum makes progesterone (and oestradiol) under LH; the endometrium turns secretory; FSH and LH are held down. This phase is fixed at about 14 days.':'Without hCG the corpus luteum fails: progesterone and oestradiol fall, the lining is shed, and FSH starts to rise again for the next cycle.';
  var L=function(f,lo,hi){return lvl(f(d),lo,hi)};
  return g+grid([['LH',d>=13&&d<=15?'surge':L(lh,40,90),d>=13&&d<=15],['FSH',L(fsh,40,55),false],['Oestradiol',L(e2,40,70),false],['Progesterone',L(p4,30,70),d>=18&&d<=24]])+cap('<b>Day '+d+'.</b> '+ph);
}};
fmtFor(['cycle']);
})();
