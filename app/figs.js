/* Bassiet interactive figures. Each FIG has title, def, ctrl(st) and view(st); st is kept in CT.ui.fig[id].
   figs.js also holds the shared figure kit (CT.figKit) and the handlers every figure file relies on. */
(function(){
'use strict';
var F=window.FIG={};

/* ---------- shared kit ---------- */
/* Phone layout below 560 px: figures draw on a ~340-unit viewBox so in-SVG text renders at 11 px or more on a 375 px phone. */
function narrow(){return (window.innerWidth||1024)<=620}
function r1(v){return Math.round(v*10)/10}
function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')}
/* Label sizes come from the shared text classes in index.html (.ft, .ft.sm, .ft.big), which are larger on phones.
   o.s is a size hint only: 16+ -> .ft.big, 13.5-15 -> .ft, below -> .ft.sm. o: a=anchor, c=extra classes, st=extra style, h=halo */
function cls(o){var c=(o.c||'').replace(/\b(sm|big)\b/g,'').trim(),z=o.s||14;return 'ft'+(z>=16?' big':z>=13.5?'':' sm')+(c?' '+c:'')}
var HALO=';paint-order:stroke;stroke:var(--surface);stroke-width:4px;stroke-linejoin:round';
function tx(x,y,str,o){o=o||{};var st=(o.st||'')+(o.h?HALO:'');return '<text x="'+r1(x)+'" y="'+r1(y)+'"'+(o.a?' text-anchor="'+o.a+'"':'')+' class="'+cls(o)+'"'+(st?' style="'+st.replace(/^;/,'')+'"':'')+'>'+str+'</text>'}
/* multi-line label centred on x,y (line spacing in em, so it follows the class size) */
function tx2(x,y,lines,o){o=o||{};var k=lines.length;return '<text x="'+r1(x)+'" y="'+r1(y)+'" text-anchor="middle" class="'+cls(o)+'"'+(o.st?' style="'+o.st+'"':'')+'>'+lines.map(function(l,i){return '<tspan x="'+r1(x)+'" dy="'+(i?'1.15em':r1(-(k-1)*0.575)+'em')+'">'+l+'</tspan>'}).join('')+'</text>'}
/* arrow line with a drawn head; st = stroke colour token */
function arrow(x1,y1,x2,y2,st,w,dash){var a=Math.atan2(y2-y1,x2-x1),h=7,c=st||'var(--muted)';
  return '<line x1="'+r1(x1)+'" y1="'+r1(y1)+'" x2="'+r1(x2-Math.cos(a)*h*.8)+'" y2="'+r1(y2-Math.sin(a)*h*.8)+'" style="stroke:'+c+';stroke-width:'+(w||2)+(dash?';stroke-dasharray:'+dash:'')+'"/>'+
  '<polygon points="'+r1(x2)+','+r1(y2)+' '+r1(x2-h*Math.cos(a-.45))+','+r1(y2-h*Math.sin(a-.45))+' '+r1(x2-h*Math.cos(a+.45))+','+r1(y2-h*Math.sin(a+.45))+'" style="fill:'+c+'"/>'}
function svg(W,H,label,inner){return '<svg viewBox="0 0 '+W+' '+H+'" class="figsvg" role="img" aria-label="'+esc(label)+'">'+inner+'</svg>'}
function btn(id,k,v,label,on){return '<button type="button" class="fbtn" data-act="fig" data-fig="'+id+'" data-k="'+k+'" data-v="'+v+'" aria-pressed="'+(!!on)+'">'+label+'</button>'}
/* range: label is the human name (visible <label for> and aria-label); vals = optional list of values the stops map to; fmt = optional display text */
function rng(id,k,min,max,step,val,unit,label,vals,shown){
  var fid='fr-'+id+'-'+k,txt=shown!=null?shown:val+(unit?' '+unit:'');
  return '<label for="'+fid+'">'+(label||k)+'</label><input type="range" class="figrange" id="'+fid+'" data-fig="'+id+'" data-k="'+k+'"'+(vals?' data-vals="'+vals.join(',')+'"':'')+(unit?' data-unit="'+unit+'"':'')+' min="'+min+'" max="'+max+'" step="'+step+'" value="'+(vals?Math.max(0,vals.indexOf(val)):val)+'" aria-label="'+esc(label||k)+'" aria-valuetext="'+esc(txt)+'"><b class="mono" aria-hidden="true">'+txt+'</b>'}
function meter(label,v,cls,word){v=Math.max(0,Math.min(100,v));return '<div class="meter"><span>'+label+'</span><span class="mt" aria-hidden="true"><i class="'+(cls||'')+'" style="width:'+v+'%"></i></span><b>'+(word||(v>66?'high':v>33?'mid':v>3?'low':'none'))+'</b></div>'}
/* key swatch for in-SVG legends */
function sw(x,y,fill,label,o){o=o||{};return '<rect x="'+r1(x)+'" y="'+r1(y-9)+'" width="10" height="10" style="fill:'+fill+'"/>'+tx(x+14,y,label,{s:o.s||12.5,c:'sm'})}
var K=CT.figKit={narrow:narrow,r1:r1,esc:esc,tx:tx,tx2:tx2,arrow:arrow,svg:svg,btn:btn,rng:rng,meter:meter,sw:sw};

/* 1. Na/K pump */
F.pump={title:'The pump',def:{atp:1,dig:0},
ctrl:function(s){return '<div class="frow"><span>Energy</span>'+btn('pump','atp',1,'ATP present',s.atp==1)+btn('pump','atp',0,'ATP gone',s.atp==0)+'</div><div class="frow"><span>Drug</span>'+btn('pump','dig',0,'None',s.dig==0)+btn('pump','dig',1,'Digoxin',s.dig==1)+'</div>'},
view:function(s){
  var n=narrow(),st=s.atp==0?2:s.dig?1:0;
  var naIn=[12,22,70][st],kIn=[140,128,90][st],ca=[1,2.4,3][st],sw0=[1,1.04,1.3][st];
  var W=n?340:440,H=262,cx=n?118:150,cy=140,rx=(n?74:84)*sw0,ry=(n?62:66)*sw0;
  var g='';
  g+=tx(10,22,'OUTSIDE',{s:12,c:'sm',st:'fill:var(--muted);letter-spacing:.08em'});
  g+='<ellipse cx="'+cx+'" cy="'+cy+'" rx="'+r1(rx)+'" ry="'+r1(ry)+'" style="fill:var(--surface2);stroke:'+(st==2?'var(--muted)':'var(--phys)')+';stroke-width:3'+(st==2?';stroke-dasharray:10 6':'')+'"/>';
  g+=tx(cx-rx*.55,cy-ry*.62,'INSIDE',{s:12,c:'sm',st:'fill:var(--muted);letter-spacing:.08em'});
  /* Na/K-ATPase on the right of the membrane */
  var pxv=cx+rx-4;
  g+='<rect x="'+r1(pxv-9)+'" y="'+(cy-20)+'" width="18" height="40" rx="3" style="fill:'+(st==0?'var(--good)':st==1?'var(--accent)':'var(--bad)')+'"/>';
  if(st<2){g+=arrow(pxv+12,cy-10,pxv+34,cy-10,'var(--accent)',2)+tx(pxv+38,cy-5,'3 Na⁺ out',{s:13.5,c:'na'})+arrow(pxv+34,cy+14,pxv+12,cy+14,'var(--pharm)',2)+tx(pxv+38,cy+19,'2 K⁺ in',{s:13.5,c:'k'});
    if(st==1)g+=tx(pxv+14,cy+44,'digoxin slows it',{s:12.5,c:'sm',st:'fill:var(--accent-text)'})}
  else g+=tx(pxv+14,cy+5,'✕ pump stopped',{s:13.5,c:'bad'});
  /* Na/Ca exchanger at the top of the membrane */
  var ex=cx+rx*.15,ey=cy-ry*.99;
  g+='<rect x="'+r1(ex-14)+'" y="'+r1(ey-8)+'" width="28" height="16" rx="3" style="fill:var(--surface);stroke:var(--phys);stroke-width:2"/>';
  g+=tx(ex+20,ey-10,'Na⁺/Ca²⁺ exchanger',{s:12.5,c:'sm'});if(st==1)g+=tx(ex+20,ey-28,'Ca²⁺ exit slows',{s:12.5,c:'sm',st:'fill:var(--phys-t)'});
  /* ions inside */
  for(var i=0;i<Math.round(naIn/6);i++){var a=i*2.4,r=0.5+((i*37)%30)/100;g+='<rect x="'+r1(cx+Math.cos(a)*rx*r-3)+'" y="'+r1(cy+Math.sin(a)*ry*r-3)+'" width="6" height="6" style="fill:var(--accent)"/>'}
  for(i=0;i<Math.round(kIn/14);i++){a=i*2.1+1;r=0.3+((i*53)%40)/100;g+='<circle cx="'+r1(cx+Math.cos(a)*rx*r)+'" cy="'+r1(cy+Math.sin(a)*ry*r)+'" r="3.5" style="fill:var(--pharm)"/>'}
  for(i=0;i<Math.round(ca*2);i++){a=i*1.7+.4;r=0.25+((i*29)%30)/100;g+='<polygon points="'+r1(cx+Math.cos(a)*rx*r)+','+r1(cy+Math.sin(a)*ry*r-4)+' '+r1(cx+Math.cos(a)*rx*r+4)+','+r1(cy+Math.sin(a)*ry*r+3)+' '+r1(cx+Math.cos(a)*rx*r-4)+','+r1(cy+Math.sin(a)*ry*r+3)+'" style="fill:var(--phys)"/>'}
  if(st==2){var wx=cx-rx*.72,wy=cy+ry*.72;g+=arrow(wx-18,wy+18,wx+2,wy-2,'var(--bio)',2.5)+tx(wx-22,wy+32,'water in',{s:12.5,a:'start',c:'sm',st:'fill:var(--bio-t)'})}
  /* key */
  var ky=H-10;g+=sw(10,ky,'var(--accent)','Na⁺')+'<circle cx="'+(n?75:80)+'" cy="'+(ky-4)+'" r="4" style="fill:var(--pharm)"/>'+tx(n?84:89,ky,'K⁺',{s:12.5,c:'sm'})+'<polygon points="'+(n?130:140)+','+(ky-9)+' '+(n?135:145)+','+(ky)+' '+(n?125:135)+','+ky+'" style="fill:var(--phys)"/>'+tx(n?141:151,ky,'Ca²⁺',{s:12.5,c:'sm'})+tx(W-8,ky,st==2?'cell swollen':'volume steady',{s:12.5,a:'end',c:st==2?'bad':'sm'});
  var cap=st==0?'The Na⁺/K⁺-ATPase moves 3 Na⁺ out and 2 K⁺ in for each ATP. Na⁺ stays low and K⁺ high inside, and the cell volume stays steady.':st==1?'Digoxin blocks the pump. Na⁺ inside rises, so the Na⁺/Ca²⁺ exchanger pushes less Ca²⁺ out. More Ca²⁺ is stored and released, and the heart muscle cell contracts harder (positive inotropy).':'With no ATP the pump stops. Na⁺ floods in, K⁺ leaks out and water follows Na⁺, so the cell swells (hydropic change). This is still reversible if energy returns soon.';
  return svg(W,H,'Cell with sodium–potassium pump: '+['working','slowed by digoxin','stopped, cell swollen'][st],g)+'<div class="meters">'+meter('Na⁺ inside',naIn,'na',['low','raised','high'][st])+meter('K⁺ inside',kIn/1.5,'k',['high','slightly low','low'][st])+meter('Ca²⁺ inside',ca*30,'ca',['low','raised','high'][st])+meter('Cell volume',[50,54,95][st],'',['normal','normal','swollen'][st])+'</div><p class="fcap">'+cap+'</p>';
}};

/* 2. Electron transport chain */
/* [label, meters (flow, O2 use, gradient, ATP, heat), caption, blocked complex index, segment states] */
var P={none:['Running',[70,70,70,80,20],'Electrons pass from NADH (Complex I) and FADH₂ (Complex II) through Q, Complex III, cytochrome c and Complex IV to O₂. I, III and IV pump H⁺ out; Complex II pumps none, so FADH₂ yields less ATP (about 1.5 per FADH₂ against 2.5 per NADH). H⁺ flowing back through ATP synthase (V) makes ATP.',-1],
rot:['Rotenone',[30,30,30,30,8],'Complex I is blocked, so NADH cannot feed the chain. Electrons from FADH₂ still enter at Complex II, so a little flow, O₂ use and ATP remain.',0],
ant:['Antimycin A',[0,0,4,4,4],'Complex III is blocked. Electrons from both I and II pile up behind it: flow stops, O₂ use stops and ATP falls.',2],
cn:['Cyanide or CO',[0,0,4,4,4],'Complex IV (cytochrome c oxidase) is blocked, so O₂ cannot take the electrons. Tissues starve of ATP while venous blood stays oxygenated and bright red; lactic acidosis follows.',3],
oli:['Oligomycin',[10,10,100,4,4],'ATP synthase is blocked. H⁺ cannot flow back, the gradient builds until the pumps cannot push against it, and electron flow and O₂ use fall.',4],
unc:['Uncoupler',[100,100,10,15,96],'H⁺ leaks back across the membrane without passing ATP synthase (2,4-dinitrophenol, high-dose aspirin, thermogenin in brown fat). The chain races to keep up, O₂ use rises, ATP falls and the energy leaves as heat.',5]};
F.etc={title:'The chain and the turbine',def:{p:'none'},
ctrl:function(s){return '<div class="frow"><span>Poison</span>'+Object.keys(P).map(function(k){return btn('etc','p',k,P[k][0],s.p===k)}).join('')+'</div>'},
view:function(s){
  var d=P[s.p],m=d[1],blk=d[3],n=narrow(),W=n?340:460,H=206,f=W/340;
  var X=function(v){return v*f};
  var xs=[30,92,164,240,306].map(X),mt=92,mb=132,g='';
  g+=tx(8,18,'INTERMEMBRANE SPACE',{s:12,c:'sm',st:'fill:var(--muted);letter-spacing:.06em'});
  g+=tx(8,H-8,'MATRIX',{s:12,c:'sm',st:'fill:var(--muted);letter-spacing:.06em'});
  g+='<rect x="0" y="'+mt+'" width="'+W+'" height="'+(mb-mt)+'" style="fill:var(--surface2)"/>';
  /* electron path segments: [x1,y1,x2,y2,on] */
  var off={none:[],rot:[0],ant:[0,1,2,3,4,5],cn:[0,1,2,3,4,5],oli:[],unc:[]}[s.p],slow=s.p==='oli';
  var qx=X(128),qy=112,cx=X(203),cy=84;
  var seg=[[xs[0],112,qx,qy],[xs[1],112,qx,qy],[qx,qy,xs[2],112],[xs[2],100,cx,cy],[cx,cy,xs[3],100],[xs[3],128,xs[3],156]];
  seg.forEach(function(q,i){var on=off.indexOf(i)<0;g+='<line x1="'+r1(q[0])+'" y1="'+q[1]+'" x2="'+r1(q[2])+'" y2="'+q[3]+'" style="stroke:var(--bio);stroke-width:'+(on?3:2)+';opacity:'+(on?(slow?.45:1):.25)+(on&&!slow?'':';stroke-dasharray:4 4')+'"/>'});
  /* complexes */
  ['I','II','III','IV','V'].forEach(function(nm,i){
    var bad=i===blk,unc=s.p==='unc'&&i===4,w=i===4?40:36;
    g+='<rect x="'+r1(xs[i]-w/2)+'" y="'+(mt-14)+'" width="'+w+'" height="'+(mb-mt+28)+'" rx="5" style="fill:'+(bad?'color-mix(in srgb,var(--bad) 30%,var(--surface))':'var(--surface)')+';stroke:'+(bad?'var(--bad)':i===4?'var(--accent)':'var(--bio)')+';stroke-width:'+(bad?3:2)+(unc?';stroke-dasharray:5 4':'')+'"/>';
    g+=tx(xs[i],mt+26,nm,{s:16,a:'middle',c:'big'});
    if(bad)g+=tx(xs[i],mb+8,'✕',{s:15,a:'middle',c:'bad'});
  });
  /* carriers */
  g+='<circle cx="'+r1(qx)+'" cy="'+qy+'" r="9" style="fill:var(--bio-s);stroke:var(--bio);stroke-width:2"/>'+tx(qx,qy+4.5,'Q',{s:12.5,a:'middle',c:'sm'});
  g+='<circle cx="'+r1(cx)+'" cy="'+cy+'" r="10" style="fill:var(--bio-s);stroke:var(--bio);stroke-width:2"/>'+tx(cx,cy+4,'c',{s:13,a:'middle',c:'sm'});
  if(!n)g+=tx(qx,qy+26,'CoQ',{s:12,a:'middle',c:'sm',st:'fill:var(--muted)'})+tx(cx,cy-14,'cyt c',{s:12,a:'middle',c:'sm',st:'fill:var(--muted)'});
  /* H+ pumping up through I, III, IV; none through II */
  var pumpOn=s.p==='none'||s.p==='unc'||s.p==='rot';
  [[0,'4H⁺'],[2,'4H⁺'],[3,'2H⁺']].forEach(function(p){var i=p[0],on=pumpOn&&!(s.p==='rot'&&i===0),lf=i===3;g+=arrow(xs[i],mt-16,xs[i],mt-46,on?'var(--phys)':'var(--line)',2.5)+tx(xs[i]+(lf?-6:6),mt-26,p[1],{s:12.5,a:lf?'end':'start',c:'sm',st:on?'fill:var(--phys-t)':'fill:var(--muted)'})});
  g+=tx(xs[1],mt-24,'no H⁺',{s:12,a:'middle',c:'sm',st:'fill:var(--muted)'});
  /* H+ back through V, or leak */
  var vOn=s.p!=='oli'&&m[2]>5;
  g+=arrow(xs[4],mt-46,xs[4],mt-16,vOn?'var(--phys)':'var(--line)',2.5)+tx(xs[4]+6,mt-26,'H⁺',{s:12.5,c:'sm',st:vOn?'fill:var(--phys-t)':'fill:var(--muted)'});
  if(s.p==='unc'){var lx=(xs[3]+18+xs[4]-20)/2;g+=arrow(lx,mt-28,lx,mb+18,'var(--bad)',2.5,'4 3')+tx(lx,mt-34,'leak',{s:12.5,a:'middle',c:'bad'})}
  /* substrates in the matrix */
  var on0=s.p!=='rot'&&s.p!=='ant'&&s.p!=='cn';
  g+=tx(xs[0],mb+30,'NADH',{s:12.5,a:'middle',c:'sm',st:on0?'':'fill:var(--muted)'})+tx(xs[1],mb+30,'FADH₂',{s:12.5,a:'middle',c:'sm'});
  g+=tx(xs[3],mb+44,'O₂ → H₂O',{s:12.5,a:'middle',c:'sm',st:off.indexOf(5)<0&&!slow?'':'fill:var(--muted)'});
  g+=tx(xs[4],mb+30,s.p==='oli'||m[3]<10?'ATP ✕':'ADP → ATP',{s:12.5,a:'middle',c:s.p==='oli'||m[3]<10?'bad':'sm'});
  /* H+ cloud in the intermembrane space, density = gradient */
  var hp=Math.round(m[2]/9);for(var i=0;i<hp;i++)g+='<rect x="'+r1(X(20+((i*67)%300)))+'" y="'+(24+((i*29)%14))+'" width="5" height="5" style="fill:var(--phys);opacity:.75"/>';
  /* key */
  g+='<line x1="'+(W-112)+'" y1="'+(H-12)+'" x2="'+(W-92)+'" y2="'+(H-12)+'" style="stroke:var(--bio);stroke-width:3"/>'+tx(W-88,H-8,'e⁻',{s:12.5,c:'sm'})+sw(W-58,H-7,'var(--phys)','H⁺');
  var lbl='Electron transport chain, '+d[0]+(blk>=0?': complex '+['I','II','III','IV','V'][blk]+' blocked':'');
  return svg(W,H,lbl,g)+'<div class="meters">'+meter('Electron flow',m[0],'elecm')+meter('O₂ use',m[1],'k')+meter('H⁺ gradient',m[2],'ca')+meter('ATP made',m[3],'acc')+meter('Heat',m[4],'na')+'</div><p class="fcap">'+d[2]+'</p>';
}};

/* 3. DNA repair: damage, then recognise and cut, then fill and seal */
var R={
mm:['Mismatch','Mismatch repair','Lynch syndrome (hereditary non-polyposis colorectal cancer): microsatellite instability; colon (often right-sided), endometrial and ovarian cancers.',
 ['After replication a G sits opposite a T on the new strand. The pair does not fit, so the helix bulges a little.','MSH2–MSH6 clamps the mismatch. MLH1–PMS2 nicks the newly made strand, and an exonuclease strips away a stretch of it.','DNA polymerase δ refills the stretch, copying the old template strand, and ligase seals the nick.'],['MSH2–MSH6','MLH1–PMS2 + exonuclease','Pol δ + ligase']],
uv:['UV dimer','Nucleotide excision repair','Xeroderma pigmentosum (autosomal recessive): extreme sun sensitivity, freckling and skin cancers (basal cell, squamous cell, melanoma) in childhood.',
 ['UV light fuses two neighbouring thymines on one strand into a dimer that kinks the helix.','XP proteins sense the kink. Endonucleases cut on both sides and lift out a short oligonucleotide (about 24–32 bases) that carries the dimer.','Polymerase δ or ε fills the gap from the intact strand, and ligase seals it.'],['XP proteins','Endonucleases cut both sides','Pol δ/ε + ligase']],
base:['Oxidised base','Base excision repair','MUTYH-associated polyposis (autosomal recessive): dozens to hundreds of colon adenomas and colorectal cancer. Base excision repair also removes uracil left by deaminated cytosine.',
 ['Oxygen radicals turn one guanine into 8-oxoguanine, which pairs with A instead of C. The helix barely changes shape.','A glycosylase (OGG1; MUTYH removes the A wrongly placed opposite it) plucks out the base and leaves an empty AP site. AP endonuclease nicks the backbone.','Polymerase β inserts one new base, and ligase seals it.'],['Glycosylase','AP endonuclease','Pol β + ligase']],
dsb:['Double-strand break','End joining or homologous recombination','BRCA1/BRCA2: breast, ovarian, prostate and pancreatic cancers (PARP inhibitors exploit the defect). Ataxia-telangiectasia (ATM, the break sensor): ataxia, telangiectasias, IgA deficiency, radiosensitivity. Defects in end joining (Artemis, DNA-PKcs) cause SCID, because V(D)J recombination needs it.',
 ['Ionising radiation or some chemotherapy snaps both strands at once.','ATM senses the break. Ku70/80 grips both ends for end joining; or, in S and G2, the ends are trimmed so BRCA1/2 and RAD51 can find the sister chromatid.','End joining glues the ends but often loses bases (error-prone). Homologous recombination copies the sister chromatid and restores the sequence.'],['ATM senses','Ku70/80 or BRCA1/2–RAD51','Ligase IV, or copy the sister']],
xl:['Cross-link','Fanconi anaemia pathway','Fanconi anaemia (mostly autosomal recessive): marrow failure, absent or abnormal thumbs and radii, short stature, café-au-lait spots, AML and squamous cancers. Cells break when exposed to cross-linkers.',
 ['Cross-linking drugs (cisplatin, mitomycin C, nitrogen mustards) staple the two strands together, so they cannot be unzipped for copying.','The Fanconi core complex tags the stalled fork; nucleases cut one strand on both sides to unhook the link.','Translesion polymerases copy across the unhooked base, and homologous recombination (BRCA2 is FANCD1) mends the break left behind.'],['FANC core complex','Nucleases unhook','TLS + recombination']]};
F.repair={title:'Repair crews',def:{d:'uv',p:0},
ctrl:function(s){return '<div class="frow"><span>Damage</span>'+Object.keys(R).map(function(k){return btn('repair','d',k,R[k][0],s.d===k)}).join('')+'</div><div class="frow"><span>Repair</span>'+['1. Damage','2. Recognise, cut','3. Fill, seal'].map(function(x,i){return btn('repair','p',i,x,s.p==i)}).join('')+'</div>'},
view:function(s){
  var r=R[s.d],p=+s.p||0,n=narrow(),N=n?10:14,sp=30,x0=n?35:35,W=x0*2+(N-1)*sp,H=186,L=Math.floor(N/2)-1;
  var Ty=64,By=124,My=(Ty+By)/2,X=function(i){return x0+i*sp},g='';
  var C={old:'var(--bio)',rung:'var(--muted)',les:'var(--bad)',neu:'var(--accent)'};
  /* strand pieces: arrays of [fromIndex-0.5, toIndex+0.5, colour] */
  var top=[[-.5,N-.5,C.old]],bot=[[-.5,N-.5,C.old]],gapT=null,gapB=null,newT=null,newB=null;
  var half={};/* key 'i:t' or 'i:b' -> colour or 'x' (absent) or 'off' (offset) */
  function cutTop(a,b){gapT=[a,b]} function cutBot(a,b){gapB=[a,b]}
  var lbl=[],extra='',prot=null;
  if(s.d==='mm'){
    if(p<2){half[L+':t']='mis'}
    if(p===1){cutTop(L-2.5,L+2.5);for(var i=L-2;i<=L+2;i++)half[i+':t']='x';prot=r[4][0]+' · '+r[4][1]}
    if(p===2){newT=[L-2.5,L+2.5];for(i=L-2;i<=L+2;i++)half[i+':t']=C.neu;prot=r[4][2]}
    if(p===0)lbl.push([X(L),By+30,'G·T mismatch','bad']);
    extra+=tx(8,Ty-10,'new strand',{s:12,c:'sm',st:'fill:var(--muted)'})+tx(8,By+20,'template',{s:12,c:'sm',st:'fill:var(--muted)'});
  }else if(s.d==='uv'){
    if(p===0){half[L+':t']=C.les;half[(L+1)+':t']=C.les;extra+='<rect x="'+(X(L)-3)+'" y="'+(Ty+12)+'" width="'+(sp+6)+'" height="6" style="fill:var(--bad)"/>';lbl.push([X(L)+sp/2,By+30,'thymine dimer','bad'])}
    if(p===1){cutTop(L-2.5,L+3.5);for(i=L-2;i<=L+3;i++)half[i+':t']='x';prot=r[4][0]+' · '+r[4][1];
      /* lifted-out oligo */
      extra+='<rect x="'+(X(L-2)-6)+'" y="'+(Ty-26)+'" width="'+(5*sp+12)+'" height="5" style="fill:var(--bad);opacity:.8"/>';lbl.push([X(L)+sp/2,By+30,'oligo with the dimer lifted out','bad'])}
    if(p===2){newT=[L-2.5,L+3.5];for(i=L-2;i<=L+3;i++)half[i+':t']=C.neu;prot=r[4][2]}
  }else if(s.d==='base'){
    if(p===0){half[L+':t']=C.les;lbl.push([X(L),By+30,'8-oxoG','bad'])}
    if(p===1){half[L+':t']='x';cutTop(L-.5,L+.5);prot=r[4][0]+' · '+r[4][1];lbl.push([X(L),By+30,'AP site (no base)','bad'])}
    if(p===2){half[L+':t']=C.neu;newT=[L-.5,L+.5];prot=r[4][2]}
  }else if(s.d==='dsb'){
    if(p<2){cutTop(L+.12,L+.88);cutBot(L+.12,L+.88)}
    if(p===0)lbl.push([X(L)+sp/2,By+30,'both strands broken','bad']);
    if(p===1){prot=r[4][0]+' · '+r[4][1];extra+='<circle cx="'+(X(L)+6)+'" cy="'+My+'" r="18" style="fill:none;stroke:var(--accent);stroke-width:3"/><circle cx="'+(X(L+1)-6)+'" cy="'+My+'" r="18" style="fill:none;stroke:var(--accent);stroke-width:3"/>';lbl.push([X(L)+sp/2,By+30,'Ku70/80 on both ends','na'])}
    if(p===2){newT=[L+.25,L+.75];newB=[L+.25,L+.75];prot=r[4][2];lbl.push([X(L)+sp/2,By+30,'joined (end joining may lose bases)','na'])}
  }else if(s.d==='xl'){
    if(p===0){half[L+':t']=C.les;half[L+':b']=C.les;extra+='<rect x="'+(X(L)-8)+'" y="'+(Ty-6)+'" width="16" height="'+(By-Ty+18)+'" rx="3" style="fill:none;stroke:var(--bad);stroke-width:2.5"/>';lbl.push([X(L),By+30,'strands stapled together','bad'])}
    if(p===1){cutTop(L-1.5,L+1.5);for(i=L-1;i<=L+1;i++)half[i+':t']='x';half[L+':b']=C.les;prot=r[4][0]+' · '+r[4][1];extra+='<rect x="'+(X(L)-5)+'" y="'+(My-4)+'" width="10" height="10" style="fill:var(--bad)"/>';lbl.push([X(L),By+30,'link unhooked','bad'])}
    if(p===2){newT=[L-1.5,L+1.5];for(i=L-1;i<=L+1;i++)half[i+':t']=C.neu;half[L+':b']=C.neu;prot=r[4][2]}
  }
  function strand(y,gap,nw){var a=-.5,b=N-.5,o='';function seg(u,v,c){if(v>u)o+='<rect x="'+r1(X(u))+'" y="'+(y-3)+'" width="'+r1(X(v)-X(u))+'" height="6" style="fill:'+c+'"/>'}
    if(gap){seg(a,gap[0],C.old);seg(gap[1],b,C.old)}else seg(a,b,C.old);
    if(nw)seg(nw[0],nw[1],C.neu);return o}
  g+=strand(Ty,gapT,newT)+strand(By,gapB,newB);
  for(i=0;i<N;i++){
    var t=half[i+':t'],b=half[i+':b'];
    if(t==='mis'){g+='<rect x="'+(X(i)-3+6)+'" y="'+(Ty+3)+'" width="6" height="'+(My-Ty-6)+'" style="fill:var(--bad)"/><rect x="'+(X(i)-3-6)+'" y="'+(My+3)+'" width="6" height="'+(By-My-6)+'" style="fill:var(--bad)"/>';continue}
    if(t!=='x')g+='<rect x="'+(X(i)-3)+'" y="'+(Ty+3)+'" width="6" height="'+(My-Ty-4)+'" style="fill:'+(t||C.rung)+'"/>';
    if(b!=='x')g+='<rect x="'+(X(i)-3)+'" y="'+(My+1)+'" width="6" height="'+(By-My-4)+'" style="fill:'+(b||C.rung)+'"/>';
  }
  if(gapT&&p===1&&s.d!=='dsb'){[gapT[0],gapT[1]].forEach(function(e){g+='<line x1="'+r1(X(e))+'" y1="'+(Ty-12)+'" x2="'+r1(X(e))+'" y2="'+(Ty+10)+'" style="stroke:var(--bad);stroke-width:2.5"/>'})}
  g+=extra;
  if(prot)g+='<rect x="8" y="6" width="'+(W-16)+'" height="24" rx="12" style="fill:var(--accent-soft);stroke:var(--accent);stroke-width:1.5"/>'+tx(W/2,23,prot,{s:13,a:'middle',c:'sm'});
  else g+=tx(W/2,23,'Damage: '+r[0],{s:13,a:'middle',c:'bad'});
  lbl.forEach(function(l){var a=l[0]<70?'start':l[0]>W-70?'end':'middle';g+=tx(a==='start'?8:a==='end'?W-8:l[0],l[1],l[2],{s:12.5,a:a,c:l[3]})});
  g+=sw(8,H-6,'var(--accent)','new DNA')+sw(100,H-6,'var(--bad)','damage');
  return svg(W,H,'DNA repair, '+r[0]+', step '+(p+1)+' of 3',g)+'<p class="fcap"><b>'+r[1]+'. Step '+(p+1)+':</b> '+r[3][p]+'<br><b>When this crew is missing:</b> '+r[2]+'</p>';
}};

/* 4. Ischaemia timeline: reversible steps run on the tissue's tolerance clock; the visible signs of death run on an absolute clock */
var TIS={neuron:['Neurons',4],myo:['Heart muscle',30],kid:['Kidney tubule',45],liver:['Liver',90],skm:['Skeletal muscle',240]};
var STOPS=[0,1,2,4,10,20,30,45,60,90,120,240,360,720,1440,2880];
function tlab(m){return m<60?m+' min':m<1440?(m/60)+' h':(m/1440)+(m===1440?' day':' days')}
F.ischemia={title:'Minutes without blood',def:{t:'myo',i:4},
fmt:function(k,v){return tlab(STOPS[v])},
ctrl:function(s){var i=+s.i||0;return '<div class="frow"><span>Tissue</span>'+Object.keys(TIS).map(function(k){return btn('ischemia','t',k,TIS[k][0],s.t===k)}).join('')+'</div><div class="frow">'+rng('ischemia','i',0,STOPS.length-1,1,i,'','Time without blood',null,tlab(STOPS[i]))+'</div>'},
view:function(s){
  var i=Math.max(0,Math.min(STOPS.length-1,+s.i||0)),m=STOPS[i],L=TIS[s.t][1],r=m/L,n=narrow(),W=n?340:460,H=236,cx=n?104:140,cy=94;
  var nr=s.t==='neuron',dead=r>=1,visible=dead&&m>=(nr?720:Math.max(L+120,240)),pyk=dead&&m>=(nr?720:Math.max(L,360)),rhex=dead&&m>=Math.max(L,720),lysis=dead&&m>=Math.max(L,1440),enz=dead&&m>=L+120,neut=dead&&m>=Math.max(L,1440);
  var swl=1+Math.min(.3,r*.3),rx=62*swl,ry=50*swl,g='';
  var cyto=visible?'color-mix(in srgb,var(--phys) 32%,var(--surface2))':'var(--surface2)';
  g+='<ellipse cx="'+cx+'" cy="'+cy+'" rx="'+r1(rx)+'" ry="'+r1(ry)+'" style="fill:'+cyto+';stroke:'+(dead?'var(--muted)':'var(--phys)')+';stroke-width:3'+(dead?';stroke-dasharray:10 6':'')+'"/>';
  if(r>=.6&&!lysis)for(var k=0;k<5;k++){var a=k*1.3-.6;g+='<circle cx="'+r1(cx+Math.cos(a)*rx)+'" cy="'+r1(cy+Math.sin(a)*ry)+'" r="'+(6+k%2*3)+'" style="fill:var(--surface2);stroke:var(--muted);stroke-width:2"/>'}
  if(r>=.6&&(s.t==='liver'||s.t==='myo')&&!lysis)for(k=0;k<4;k++)g+='<circle cx="'+(cx-36+k*22)+'" cy="'+(cy+28)+'" r="5" style="fill:none;stroke:var(--accent);stroke-width:2"/>';
  /* nucleus */
  if(lysis)g+='<circle cx="'+cx+'" cy="'+cy+'" r="20" style="fill:none;stroke:var(--path);stroke-width:1.5;stroke-dasharray:3 4;opacity:.6"/>';
  else if(rhex)for(k=0;k<7;k++)g+='<circle cx="'+(cx-16+(k*13)%34)+'" cy="'+(cy-12+(k*7)%24)+'" r="3.5" style="fill:var(--path)"/>';
  else if(pyk)g+='<circle cx="'+cx+'" cy="'+cy+'" r="10" style="fill:var(--path-t);stroke:var(--fg);stroke-width:2"/>';
  else g+='<circle cx="'+cx+'" cy="'+cy+'" r="'+(r>.3?19:22)+'" style="fill:var(--path)'+(r>.3?';stroke:var(--fg);stroke-width:2;stroke-dasharray:3 3':'')+'"/>';
  if(dead&&!visible)for(k=0;k<6;k++)g+='<circle cx="'+r1(cx-30+k*12)+'" cy="'+(cy-24)+'" r="2.5" style="fill:var(--phys)"/>';
  var lx=cx+rx+18;
  if(enz)for(k=0;k<9;k++)g+='<rect x="'+r1(lx+(k%3)*14+((k*7)%5))+'" y="'+(cy-30+Math.floor(k/3)*20)+'" width="5" height="5" style="fill:var(--bad)"/>';
  if(neut)for(k=0;k<3;k++)g+='<circle cx="'+r1(lx+10+k*20)+'" cy="'+(cy+44)+'" r="8" style="fill:none;stroke:var(--path);stroke-width:2"/><circle cx="'+r1(lx+7+k*20)+'" cy="'+(cy+43)+'" r="2.5" style="fill:var(--path)"/><circle cx="'+r1(lx+13+k*20)+'" cy="'+(cy+46)+'" r="2.5" style="fill:var(--path)"/>';
  var st=lysis?'karyolysis':rhex?'karyorrhexis':pyk?(nr?'red neuron':'pyknosis'):visible?'early coagulative necrosis':dead?'irreversible, looks normal':r>=.6?'blebs, fatty change':r>=.1?'swelling':m>0?'ATP falling':'normal';
  g+=tx(W-8,22,st,{s:13,a:'end',c:dead?'bad':'sm'});
  if(enz)g+=tx(W-8,40,s.t==='neuron'?'proteins leak':'enzymes in blood',{s:12.5,a:'end',c:'sm',st:'fill:var(--bad)'});
  if(neut)g+=tx(W-8,58,'neutrophils arrive',{s:12.5,a:'end',c:'sm',st:'fill:var(--path-t)'});
  /* time track: one slot per stop, shaded reversible / irreversible, marker at the point of no return */
  var x0=14,x1=W-14,ty=186,pos=function(mm){for(var j=0;j<STOPS.length-1;j++)if(mm<=STOPS[j+1])return x0+(j+(mm-STOPS[j])/(STOPS[j+1]-STOPS[j]))*(x1-x0)/(STOPS.length-1);return x1};
  var lp=pos(L);
  g+='<rect x="'+x0+'" y="'+ty+'" width="'+r1(lp-x0)+'" height="10" style="fill:color-mix(in srgb,var(--good) 45%,var(--surface))"/><rect x="'+r1(lp)+'" y="'+ty+'" width="'+r1(x1-lp)+'" height="10" style="fill:color-mix(in srgb,var(--bad) 40%,var(--surface))"/>';
  g+='<line x1="'+r1(lp)+'" y1="'+(ty-6)+'" x2="'+r1(lp)+'" y2="'+(ty+16)+'" style="stroke:var(--bad);stroke-width:2.5"/>';
  var la=lp<90?'start':lp>W-90?'end':'middle';g+=tx(la==='start'?Math.max(x0,lp-6):la==='end'?Math.min(x1,lp+6):lp,ty-10,'no return ≈ '+tlab(L),{s:12.5,a:la,c:'bad'});
  var cp=pos(m);g+='<polygon points="'+r1(cp)+','+(ty+12)+' '+r1(cp-7)+','+(ty+24)+' '+r1(cp+7)+','+(ty+24)+'" style="fill:var(--fg)"/>';
  [[1,'1 min'],[10,'10 min'],[60,'1 h'],[360,'6 h']].forEach(function(q){var x=pos(q[0]);g+=tx(x,ty+40,q[1],{s:12,a:x<30?'start':'middle',c:'sm',st:'fill:var(--muted)'})});
  g+=tx(x1,ty+40,'2 days',{s:12,a:'end',c:'sm',st:'fill:var(--muted)'});
  var steps=[[function(){return m>0},'ATP falls; anaerobic glycolysis speeds up'],[function(){return r>=.1},'Na⁺/K⁺ pump slows; the cell and its organelles swell'],[function(){return r>=.3},'Lactate lowers pH; chromatin clumps; glycogen runs out'],[function(){return r>=.6},'Blebs, ribosomes detach, fatty change (liver, heart)'],[function(){return dead},'Point of no return: membranes fail and Ca²⁺ floods in. Nothing is visible yet under the light microscope.',1],[function(){return enz},s.t==='neuron'?'Hours: proteins leak from the dead cells':'Hours: enzymes leak into the blood (troponin from about 2–4 h after an infarct; also CK, ALT)'],[function(){return visible},s.t==='neuron'?'About 12–24 h: red neurons (shrunken, eosinophilic, pyknotic)':'About 4–12 h: early coagulative necrosis, the first clear light-microscope sign (eosinophilic cytoplasm; heart fibres may look wavy even earlier)'],[function(){return pyk},nr?'The red neuron’s nucleus is pyknotic (shrunken, dark)':'From about 6 h: pyknosis (the nucleus shrinks and darkens)'],[function(){return rhex},'About 12–24 h: karyorrhexis (the nucleus fragments)'],[function(){return lysis},'1–2 days: karyolysis (the nucleus fades); neutrophils arrive'+(s.t==='neuron'?'; brain softens by liquefactive necrosis':'')]];
  var h='<ol class="tl">'+steps.map(function(x){return '<li class="'+(x[0]()?'on':'')+(x[2]?' line':'')+'">'+x[1]+'</li>'}).join('')+'</ol>';
  var cap='<b>'+TIS[s.t][0]+':</b> damage becomes irreversible after about '+tlab(L)+' without blood. '+(m===0?'Move the slider.':!dead?'Still reversible if blood returns now (though reperfusion can add injury).':!visible?'Past the point of no return, yet the cell still looks almost normal: a microscope cannot see this death for hours.':'Dead, and now visibly so.');
  return svg(W,H,'Cell after '+tlab(m)+' without blood: '+st,g)+h+'<p class="fcap">'+cap+'</p>';
}};

/* 5. Apoptosis pathways */
var AP={
dna:['Severe DNA damage',[['p53 →','PUMA, NOXA'],['BAX, BAK','pores'],['Cytochrome c','released'],['Apoptosome:','caspase-9'],['Caspase-3,','6, 7'],['Apoptotic','bodies']],'Intrinsic (mitochondrial) door: p53 switches on BH3-only proteins (PUMA, NOXA), which free BAX and BAK to punch pores in the outer mitochondrial membrane. Cytochrome c escapes, binds APAF-1 in the apoptosome and activates caspase-9, then the executioner caspases.'],
gf:['Survival signal withdrawn',[['BIM','(BH3-only)'],['BAX, BAK','pores'],['Cytochrome c','released'],['Apoptosome:','caspase-9'],['Caspase-3,','6, 7'],['Apoptotic','bodies']],'Intrinsic door without p53: loss of growth factors or hormones (for example lymphocytes deprived of IL-2, endometrium after progesterone falls) lets the BH3-only sensor BIM rise. BIM frees BAX and BAK, and the mitochondrial pathway follows.'],
fas:['Fas ligand',[['Fas ligand','binds'],['Fas (CD95)','trimer'],['FADD','adaptor'],['Caspase-8','active'],['Caspase-3,','6, 7'],['Apoptotic','bodies']],'Extrinsic (death-receptor) door: Fas ligand on a T cell binds Fas, the adaptor FADD gathers pro-caspase-8 and caspase-8 activates the executioners. It removes self-reactive lymphocytes; a Fas defect causes autoimmune lymphoproliferative syndrome. TNF receptor 1 works the same way.'],
ctl:['Cytotoxic T cell',[['Perforin','pore'],['Granzyme B','enters'],['Cleaves','BID too'],['Caspase-3','cleaved'],['DNA','fragmented'],['Apoptotic','bodies']],'Cytotoxic T cells and NK cells punch pores with perforin and push granzyme B in. Granzyme B cleaves and activates caspase-3 directly and also cuts BID, which opens the mitochondrial door as an amplifier.']};
F.apoptosis={title:'Two doors to the quiet death',def:{tr:'dna',bcl:0},
ctrl:function(s){return '<div class="frow"><span>Trigger</span>'+Object.keys(AP).map(function(k){return btn('apoptosis','tr',k,AP[k][0],s.tr===k)}).join('')+'</div><div class="frow"><span>BCL-2</span>'+btn('apoptosis','bcl',0,'Normal',s.bcl==0)+btn('apoptosis','bcl',1,'Overexpressed',s.bcl==1)+'</div>'},
view:function(s){
  var a=AP[s.tr],intr=s.tr==='dna'||s.tr==='gf',blocked=intr&&s.bcl==1,n=narrow();
  var W=n?340:460,H=200,nw=n?96:124,nh=44,cols=[10,(W-nw)/2,W-10-nw],pos=[[cols[0],34],[cols[1],34],[cols[2],34],[cols[2],126],[cols[1],126],[cols[0],126]];
  var g='';
  a[1].forEach(function(lbl,i){var p=pos[i],on=!blocked||i<2,bk=blocked&&i===1;
    g+='<rect x="'+r1(p[0])+'" y="'+p[1]+'" width="'+nw+'" height="'+nh+'" rx="4" style="fill:'+(bk?'color-mix(in srgb,var(--bad) 28%,var(--surface))':on?'var(--accent-soft)':'var(--surface2)')+';stroke:'+(bk?'var(--bad)':on?'var(--accent)':'var(--line)')+';stroke-width:'+(bk?3:2)+(on?'':';stroke-dasharray:4 3')+'"/>';
    g+=tx2(p[0]+nw/2,p[1]+nh/2+4.5,lbl,{s:13,c:'sm',st:on?'':'fill:var(--muted)'});
    if(i<5){var q=pos[i+1],lit=on&&!(blocked&&i>=1),c=lit?'var(--accent)':'var(--line)';
      if(q[1]===p[1])g+=q[0]>p[0]?arrow(p[0]+nw+1,p[1]+nh/2,q[0]-1,q[1]+nh/2,c,2.5):arrow(p[0]-1,p[1]+nh/2,q[0]+nw+1,q[1]+nh/2,c,2.5);
      else g+=arrow(p[0]+nw/2,p[1]+nh+1,q[0]+nw/2,q[1]-1,c,2.5);}
  });
  if(blocked){var bx=(pos[1][0]+nw+pos[2][0])/2,ay=pos[1][1]+nh/2,by=pos[1][1]+nh+24;g+='<line x1="'+r1(bx)+'" y1="'+(ay+4)+'" x2="'+r1(bx)+'" y2="'+(by-11)+'" style="stroke:var(--bad);stroke-width:2.5"/><rect x="'+r1(bx-24)+'" y="'+(by-11)+'" width="48" height="22" rx="4" style="fill:var(--bad)"/>'+tx(bx,by+4.5,'BCL-2',{s:12.5,a:'middle',c:'sm',st:'fill:var(--bad-ink)'})}
  g+=tx(10,20,intr?'INTRINSIC · MITOCHONDRIAL':s.tr==='fas'?'EXTRINSIC · DEATH RECEPTOR':'PERFORIN · GRANZYME',{s:12,c:'sm',st:'fill:var(--muted);letter-spacing:.06em'});
  if(blocked)g+=tx(W-10,H-6,'door held shut: the cell lives',{s:12.5,a:'end',c:'bad'});
  else if(s.bcl==1)g+=tx(W-10,H-6,'BCL-2 cannot stop this door',{s:12.5,a:'end',c:'sm',st:'fill:var(--accent-text)'});
  var cap=blocked?'BCL-2 binds BAX and BAK and stops the pores, so cytochrome c stays inside and the cell refuses to die. This is follicular lymphoma: t(14;18) puts BCL-2 under the immunoglobulin heavy-chain promoter. Venetoclax blocks BCL-2.':a[2]+(s.bcl==1?' BCL-2 guards only the mitochondrial door, so this pathway still kills the cell.':'');
  return svg(W,H,'Apoptosis, '+a[0]+(blocked?': blocked by BCL-2':': cell dies'),g)+'<p class="fcap">'+cap+'</p>';
}};

/* ---------- shared handlers (all figure files) ---------- */
CT.ui.fig=CT.ui.fig||{};
var ctrlKey={};
function strip(h){return h.replace(/ aria-pressed="(true|false)"/g,'')}
var SRS='position:absolute;width:1px;height:1px;margin:-1px;padding:0;border:0;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap';
CT.figState=function(id){if(!CT.ui.fig[id])CT.ui.fig[id]=Object.assign({},F[id].def);return CT.ui.fig[id]};
CT.figNarrow=narrow;
/* Accessible name of the drawing = its own label + the pressed controls, so screen readers hear the state */
function stateText(box){var p=[].map.call(box.querySelectorAll('.fc [aria-pressed="true"]'),function(b){return b.textContent});
  [].forEach.call(box.querySelectorAll('.fc input[type=range]'),function(r){p.push((r.getAttribute('aria-label')||r.dataset.k)+' '+(r.getAttribute('aria-valuetext')||r.value))});return p.join(', ')}
function label(box){var sv=box.querySelector('.fv svg[role="img"]');if(!sv)return;var base=sv.getAttribute('aria-label')||'';var st=stateText(box);if(st&&base.indexOf(st)<0)sv.setAttribute('aria-label',base+' ('+st+')')}
CT.figHTML=function(id){var f=F[id];if(!f)return '';var s=CT.figState(id),c=f.ctrl(s);ctrlKey[id]=strip(c);
  var h='<figure class="fig" id="fig-'+id+'" data-n="'+(narrow()?1:0)+'"><figcaption>'+f.title+'</figcaption><div class="fc">'+c+'</div><div class="fv">'+f.view(s)+'</div><p class="fsr" aria-live="polite" style="'+SRS+'"></p></figure>';
  try{var t=document.createElement('template');t.innerHTML=h;var box=t.content.firstChild;label(box);return box.outerHTML}catch(e){return h}
};
var sayT={};
function announce(box,id,delay){clearTimeout(sayT[id]);sayT[id]=setTimeout(function(){var l=box.querySelector('.fsr'),c=box.querySelector('.fv .fcap');if(l&&c)l.textContent=c.textContent},delay||0)}
function redraw(id,box,s){box.querySelector('.fv').innerHTML=F[id].view(s);box.setAttribute('data-n',narrow()?1:0);label(box)}
CT.actions.fig=function(el){
  var id=el.dataset.fig;if(!F[id])return;var s=CT.figState(id),v=el.dataset.v;s[el.dataset.k]=isNaN(+v)?v:+v;
  var box=document.getElementById('fig-'+id);if(!box)return;
  var fc=box.querySelector('.fc'),nh=F[id].ctrl(s),key=strip(nh);
  if(key===ctrlKey[id]){
    /* same controls: only the pressed states change, so the focused button stays in place */
    var t=document.createElement('template');t.innerHTML=nh;var nb=t.content.querySelectorAll('[aria-pressed]'),ob=fc.querySelectorAll('[aria-pressed]');
    if(nb.length===ob.length)for(var i=0;i<ob.length;i++)ob[i].setAttribute('aria-pressed',nb[i].getAttribute('aria-pressed'));else fc.innerHTML=nh;
  }else{
    var a=document.activeElement,had=a&&fc.contains(a),k=had&&a.dataset.k,vv=had&&a.dataset.v;
    fc.innerHTML=nh;ctrlKey[id]=key;
    if(had){var nf=fc.querySelector('[data-k="'+k+'"]'+(vv!=null?'[data-v="'+vv+'"]':''))||fc.querySelector('[data-k="'+k+'"]');if(nf)try{nf.focus({preventScroll:true})}catch(x){nf.focus()}}
  }
  redraw(id,box,s);announce(box,id,60);
};
function shown(t,id,k,raw){var f=F[id];if(f&&f.fmt){var o=f.fmt(k,raw);if(o!=null)return o}
  var u=t.dataset.unit;if(u==null){var b=t.parentNode.querySelector('b');u=b?b.textContent.replace(/^[-−\d.,\s]+/,'').trim():''}
  var dec=((t.step||'1').split('.')[1]||'').length,v=t.dataset.vals?t.dataset.vals.split(',')[+t.value]:(+t.value).toFixed(dec);return v+(u?' '+u:'')}
document.addEventListener('input',function(e){
  var t=e.target;if(!t.classList||!t.classList.contains('figrange'))return;
  var id=t.dataset.fig;if(!F[id])return;var s=CT.figState(id),k=t.dataset.k;
  var val=t.dataset.vals?+t.dataset.vals.split(',')[+t.value]:+t.value;s[k]=val;
  var box=document.getElementById('fig-'+id);if(!box)return;
  var txt=shown(t,id,k,+t.value);t.setAttribute('aria-valuetext',txt);
  var b=t.nextElementSibling&&t.nextElementSibling.tagName==='B'?t.nextElementSibling:t.parentNode.querySelector('b');if(b)b.textContent=txt;
  redraw(id,box,s);announce(box,id,500);
});
/* arrow keys move between the buttons of one control row */
document.addEventListener('keydown',function(e){
  var t=e.target;if(!t||!t.classList||!t.classList.contains('fbtn')||e.altKey||e.ctrlKey||e.metaKey)return;
  var k=e.key;if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','End'].indexOf(k)<0)return;
  var row=[].slice.call(t.parentNode.querySelectorAll('.fbtn')),i=row.indexOf(t);if(i<0)return;
  var j=k==='Home'?0:k==='End'?row.length-1:(k==='ArrowLeft'||k==='ArrowUp')?Math.max(0,i-1):Math.min(row.length-1,i+1);
  if(j!==i){e.preventDefault();row[j].focus()}
});
/* re-draw when the layout crosses the phone breakpoint (rotation, window resize) */
var lastN=narrow(),rzT=0;
window.addEventListener('resize',function(){clearTimeout(rzT);rzT=setTimeout(function(){var nn=narrow();if(nn===lastN)return;lastN=nn;
  [].forEach.call(document.querySelectorAll('figure.fig[id^="fig-"]'),function(box){var id=box.id.slice(4);if(F[id])redraw(id,box,CT.figState(id))})},150)});
})();
