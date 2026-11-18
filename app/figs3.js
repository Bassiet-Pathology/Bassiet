/* Bassiet figures, part 3: microbes, pharmacology, blood. Uses the shared kit from figs.js (CT.figKit). */
(function(){
'use strict';
var F=window.FIG,K=CT.figKit,tx=K.tx,tx2=K.tx2,arrow=K.arrow,btn=K.btn,rng=K.rng,r1=K.r1;

/* Gram stain */
F.gram={title:'Two kinds of wall',def:{t:'pos',st:0},
ctrl:function(s){return '<div class="frow"><span>Wall</span>'+btn('gram','t','pos','Gram-positive',s.t==='pos')+btn('gram','t','neg','Gram-negative',s.t==='neg')+'</div><div class="frow"><span>Stain step</span>'+['Crystal violet','Iodine','Alcohol wash','Safranin'].map(function(x,i){return btn('gram','st',i,(i+1)+'. '+x,s.st==i)}).join('')+'</div>'},
view:function(s){
  var pos=s.t==='pos',st=+s.st||0,n=K.narrow(),W=n?340:460,bw=n?150:230,lx=bw+24,g='';
  var violet=st<2||pos,pink=!pos&&st===3,col=violet?'var(--path)':pink?'var(--phys)':'var(--surface2)';
  var word=violet?'purple':pink?'pink':'colourless';
  g+=tx(12,16,'OUTSIDE',{s:12,c:'sm',st:'fill:var(--muted);letter-spacing:.06em'});
  var y=26;
  function lab(yy,lines,c){g+='<line x1="'+(bw+14)+'" y1="'+r1(yy)+'" x2="'+(lx-2)+'" y2="'+r1(yy)+'" style="stroke:var(--muted);stroke-width:1"/>';lines.forEach(function(l,i){g+=tx(lx+2,yy+4.5+(i-(lines.length-1)/2)*16,l,{s:12.5,c:'sm',st:c||''})})}
  if(!pos){
    var gone=st>=2;
    g+='<rect x="12" y="'+(y+8)+'" width="'+bw+'" height="14" style="fill:var(--micro-s);stroke:var(--micro);stroke-width:2'+(gone?';opacity:.35;stroke-dasharray:4 3':'')+'"/>';
    for(var i=0;i<Math.floor(bw/14);i++)g+='<rect x="'+(16+i*14)+'" y="'+y+'" width="3" height="8" style="fill:var(--micro)'+(gone?';opacity:.35':'')+'"/>';
    lab(y+15,gone?['outer membrane','dissolved by alcohol']:['outer membrane','+ LPS (endotoxin)'],gone?'fill:var(--bad)':'');y+=36;
    g+='<rect x="12" y="'+y+'" width="'+bw+'" height="14" style="fill:none;stroke:var(--line);stroke-width:1.5;stroke-dasharray:3 3"/>';lab(y+7,['periplasm'],'fill:var(--muted)');y+=20;
  }
  var th=pos?72:10;
  g+='<rect x="12" y="'+y+'" width="'+bw+'" height="'+th+'" style="fill:'+col+';stroke:var(--line);stroke-width:2"/>';
  if(pos)for(i=0;i<6;i++){var tx0=24+i*(bw-24)/5;g+='<line x1="'+r1(tx0)+'" y1="'+(y-8)+'" x2="'+r1(tx0)+'" y2="'+(y+th+4)+'" style="stroke:var(--accent);stroke-width:2"/>'}
  /* crystal violet-iodine complex */
  if(violet&&st>=1)for(i=0;i<(pos?14:3);i++)g+='<rect x="'+r1(18+((i*41)%(bw-14)))+'" y="'+r1(y+2+((i*17)%Math.max(2,th-6)))+'" width="5" height="5" style="fill:var(--fg);opacity:.75"/>';
  lab(y+th/2,pos?['thick peptidoglycan','+ teichoic acids']:['thin peptidoglycan'],'');y+=th+6;
  g+='<rect x="12" y="'+y+'" width="'+bw+'" height="14" style="fill:var(--surface2);stroke:var(--muted);stroke-width:1.5"/>';lab(y+7,['cytoplasmic membrane']);y+=14;
  g+=tx(12,y+16,'CYTOPLASM',{s:12,c:'sm',st:'fill:var(--muted);letter-spacing:.06em'});
  /* what the microscope shows */
  var cy=y+44,H=cy+22;g+='<ellipse cx="30" cy="'+cy+'" rx="16" ry="11" style="fill:'+col+';stroke:var(--fg);stroke-width:2"/><ellipse cx="60" cy="'+(cy+2)+'" rx="16" ry="11" style="fill:'+col+';stroke:var(--fg);stroke-width:2"/>';
  g+=tx(86,cy+5,'Microscope: '+word+(st===3?(pos?' → Gram-positive':' → Gram-negative'):''),{s:13,c:'sm'});
  var cap=['Crystal violet floods every cell purple.','Iodine binds the violet into a large crystal violet–iodine complex.',pos?'Alcohol dehydrates the thick peptidoglycan and shrinks its pores, so the complex is trapped: the cell stays purple.':'Alcohol dissolves the outer membrane, and the thin peptidoglycan cannot hold the complex: the cell turns colourless.',pos?'Safranin changes nothing visible: still purple. Gram-positive.':'Safranin stains the colourless cell pink. Gram-negative. (Organisms with little or no wall, such as Mycoplasma, or with waxy walls, such as mycobacteria, do not Gram-stain well.)'][st];
  return K.svg(W,H,'Bacterial wall, '+(pos?'Gram-positive':'Gram-negative')+', after '+['crystal violet','iodine','alcohol','safranin'][st]+': '+word,g)+'<p class="fcap">'+cap+'</p>';
}};

/* pharmacokinetics */
var HL=[2,3,4,6,8,12,16,24],TAU=[4,6,8,12,24];
F.pk={title:'Dosing toward steady state',def:{t:8,tau:8,load:0,dose:1},
ctrl:function(s){return '<div class="frow">'+rng('pk','t',0,HL.length-1,1,s.t,'h','Half-life',HL)+'</div><div class="frow">'+rng('pk','tau',0,TAU.length-1,1,s.tau,'h','Dose every',TAU)+'</div><div class="frow"><span>Dose</span>'+btn('pk','dose',1,'× 1',s.dose!=2)+btn('pk','dose',2,'× 2',s.dose==2)+'</div><div class="frow"><span>Loading</span>'+btn('pk','load',0,'No loading dose',s.load==0)+btn('pk','load',1,'Loading dose',s.load==1)+'</div>'},
view:function(s){
  var n=K.narrow(),W=n?340:460,H=226,k=0.693/s.t,T=96,dt=0.25,dose=s.dose==2?2:1,ss=1/(1-Math.exp(-k*s.tau));
  function run(D){var pts=[],c=0,mx=0;for(var t=0;t<=T+1e-9;t+=dt){if(Math.abs(t/s.tau-Math.round(t/s.tau))<1e-6)c+=D*((t===0&&s.load==1)?ss:1);pts.push([t,c]);if(c>mx)mx=c;c*=Math.exp(-k*dt)}return {p:pts,mx:mx}}
  var cur=run(dose),ref=dose===2?run(1):null,maxC=Math.max(cur.mx,ss*dose)*1.08;
  var x0=34,x1=W-10,y0=184,yt=14;
  function X(t){return x0+t/T*(x1-x0)}function Y(v){return y0-v/maxC*(y0-yt)}
  var g='<line x1="'+x0+'" y1="'+y0+'" x2="'+x1+'" y2="'+y0+'" style="stroke:var(--muted);stroke-width:1.5"/><line x1="'+x0+'" y1="'+yt+'" x2="'+x0+'" y2="'+y0+'" style="stroke:var(--muted);stroke-width:1.5"/>';
  g+='<text transform="translate(16,'+((y0+yt)/2)+') rotate(-90)" text-anchor="middle" class="ft sm" style="fill:var(--muted)">concentration</text>';
  var avg=dose*ss*(1-Math.exp(-k*s.tau))/(k*s.tau);
  g+='<line x1="'+x0+'" y1="'+r1(Y(avg))+'" x2="'+x1+'" y2="'+r1(Y(avg))+'" style="stroke:var(--accent);stroke-width:1.5;stroke-dasharray:6 4"/>'+tx(x1,Y(avg)<yt+30?Y(avg)+16:Y(avg)-5,'steady-state average',{s:12.5,a:'end',c:'sm',h:1,st:'fill:var(--accent-text)'});
  var ssT=4.5*s.t;
  if(ssT<T){g+='<line x1="'+r1(X(ssT))+'" y1="'+yt+'" x2="'+r1(X(ssT))+'" y2="'+y0+'" style="stroke:var(--muted);stroke-width:1.5;stroke-dasharray:3 3"/>';var ra=X(ssT)>W-120;g+=tx(X(ssT)+(ra?-5:5),yt+12,'4–5 half-lives',{s:12.5,a:ra?'end':'start',c:'sm',h:1})}
  else g+=tx(x1,yt+12,'steady state: beyond 96 h →',{s:12.5,a:'end',c:'sm',h:1});
  function line(r,c,w,d){return '<polyline points="'+r.p.map(function(q){return r1(X(q[0]))+','+r1(Y(q[1]))}).join(' ')+'" style="fill:none;stroke:'+c+';stroke-width:'+w+(d?';stroke-dasharray:'+d:'')+'"/>'}
  if(ref)g+=line(ref,'var(--muted)',1.5,'4 3');
  g+=line(cur,'var(--bio)',2.5);
  [0,24,48,72,96].forEach(function(t){g+=tx(X(t),y0+16,t+(t===96?' h':''),{s:12.5,a:t===96?'end':'middle',c:'sm',st:'fill:var(--muted)'})});
  if(ref)g+='<line x1="'+(x0+8)+'" y1="'+(y0+32)+'" x2="'+(x0+26)+'" y2="'+(y0+32)+'" style="stroke:var(--muted);stroke-width:1.5;stroke-dasharray:4 3"/>'+tx(x0+30,y0+36,'dose × 1, for comparison',{s:12.5,c:'sm',st:'fill:var(--muted)'});
  var fl=Math.round((1-Math.exp(-k*s.tau))*100);
  var cap='Steady state comes after about 4–5 half-lives (≈ '+Math.round(ssT)+' h'+(ssT>T?', beyond this 96 h graph':'')+'). Only the half-life sets that time: the dose and the dosing interval do not. '+(dose===2?'Doubling the dose doubles every level, but the plateau arrives at the same time. ':'')+(s.load==1?'The loading dose fills the volume of distribution at once, so the first peak already matches the steady state. ':'')+'Between doses the level falls by '+(fl>=99?'almost 100':fl)+'%: '+(fl<25?'a narrow swing.':fl<60?'a moderate swing.':'a long gap for this half-life, so peaks and troughs swing widely.');
  return K.svg(W,H,'Concentration over time: half-life '+s.t+' h, dose every '+s.tau+' h'+(dose===2?', double dose':'')+(s.load==1?', with loading dose':''),g)+'<p class="fcap">'+cap+'</p>';
}};

/* dose-response */
var DRM=[['ag','Agonist alone','full agonist alone'],['comp','Competitive','competitive antagonist'],['nonc','Non-competitive','non-competitive antagonist'],['part','Partial agonist','partial agonist alone'],['mix','Full + partial','full agonist with a partial agonist present']];
F.drc={title:'Dose and response',def:{m:'ag',b:1},
ctrl:function(s){return '<div class="frow"><span>Show</span>'+DRM.map(function(x){return btn('drc','m',x[0],x[1],s.m===x[0])}).join('')+'</div>'+(s.m==='comp'||s.m==='nonc'?'<div class="frow"><span>Antagonist dose</span>'+[[1,'Low'],[2,'Medium'],[3,'High']].map(function(x){return btn('drc','b',x[0],x[1],s.b==x[0])}).join('')+'</div>':'')},
view:function(s){
  var n=K.narrow(),W=n?340:460,H=226,x0=40,x1=W-10,y0=182,yt=46,L0=-2,L1=4,g='',b=+s.b||1;
  function X(ld){return x0+(ld-L0)/(L1-L0)*(x1-x0)}function Y(e){return y0-e*(y0-yt)}
  function curve(fn,c,w,d){var p=[];for(var i=0;i<=120;i++){var ld=L0+i*(L1-L0)/120;p.push(r1(X(ld))+','+r1(Y(fn(Math.pow(10,ld)))))}return '<polyline points="'+p.join(' ')+'" style="fill:none;stroke:'+c+';stroke-width:'+(w||2.5)+(d?';stroke-dasharray:'+d:'')+'"/>'}
  function ec(ec50,emax,c,lab){var x=X(Math.log10(ec50)),y=Y(emax/2);return '<line x1="'+r1(x)+'" y1="'+r1(y)+'" x2="'+r1(x)+'" y2="'+y0+'" style="stroke:'+c+';stroke-width:1.5;stroke-dasharray:3 3"/><circle cx="'+r1(x)+'" cy="'+r1(y)+'" r="4" style="fill:'+c+'"/>'+(lab?tx(x+5,y0-6,lab,{s:12,c:'sm',st:'fill:'+c}):'')}
  g+='<line x1="'+x0+'" y1="'+y0+'" x2="'+x1+'" y2="'+y0+'" style="stroke:var(--muted);stroke-width:1.5"/><line x1="'+x0+'" y1="'+yt+'" x2="'+x0+'" y2="'+y0+'" style="stroke:var(--muted);stroke-width:1.5"/>';
  g+='<line x1="'+x0+'" y1="'+yt+'" x2="'+x1+'" y2="'+yt+'" style="stroke:var(--line);stroke-width:1;stroke-dasharray:2 4"/>'+tx(x0-4,yt+4,'max',{s:12,a:'end',c:'sm',st:'fill:var(--muted)'})+tx(x0-4,y0+4,'0',{s:12,a:'end',c:'sm',st:'fill:var(--muted)'});
  g+=tx((x0+x1)/2,y0+30,'agonist dose (log scale) →',{s:12.5,a:'middle',c:'sm',st:'fill:var(--muted)'});
  [-1,0,1,2,3].forEach(function(d){g+='<line x1="'+r1(X(d))+'" y1="'+y0+'" x2="'+r1(X(d))+'" y2="'+(y0+4)+'" style="stroke:var(--muted)"/>'});
  var full=function(d){return d/(d+1)},alt=null,alab='',ec2=null;
  if(s.m==='comp'){var dr=[3,10,30][b-1];alt=function(d){return d/(d+dr)};alab='with competitive antagonist';ec2=[dr,1]}
  else if(s.m==='nonc'){var em=[.7,.45,.2][b-1];alt=function(d){return em*d/(d+1)};alab='with non-competitive antagonist';ec2=[1,em]}
  else if(s.m==='part'){alt=function(d){return .5*d/(d+1)};alab='partial agonist alone';ec2=[1,.5]}
  else if(s.m==='mix'){alt=function(d){var p=4;return (d/1+.5*p)/(1+d/1+p)};alab='full agonist with partial agonist present'}
  g+=curve(full,'var(--muted)',2.5,alt?'6 4':null)+ec(1,1,'var(--muted)',alt?'':'EC₅₀');
  if(alt){g+=curve(alt,'var(--accent)',3);if(ec2)g+=ec(ec2[0],ec2[1],'var(--accent)','EC₅₀')}
  /* legend */
  g+='<line x1="'+x0+'" y1="12" x2="'+(x0+22)+'" y2="12" style="stroke:var(--muted);stroke-width:2.5'+(alt?';stroke-dasharray:6 4':'')+'"/>'+tx(x0+28,16,'full agonist alone',{s:12.5,c:'sm'});
  if(alt)g+='<line x1="'+x0+'" y1="31" x2="'+(x0+22)+'" y2="31" style="stroke:var(--accent);stroke-width:3"/>'+tx(x0+28,35,alab,{s:12.5,c:'sm',st:'fill:var(--accent-text)'});
  var cap={ag:'A full agonist reaches the maximum response (efficacy). The dose giving half the maximum, the EC₅₀, measures potency: the further left, the more potent.',
   comp:'A competitive antagonist sits on the same site and can be outcompeted. The curve shifts right in parallel (EC₅₀ rises, potency falls), and the maximum is unchanged: enough agonist still wins. More antagonist pushes it further right. Example: naloxone against morphine.',
   nonc:'A non-competitive (or irreversible) antagonist takes receptors out of play. The maximum falls and more agonist cannot restore it; the EC₅₀ barely moves. More antagonist lowers the ceiling further. Examples: phenoxybenzamine on α receptors; ketamine on NMDA channels.',
   part:'A partial agonist cannot reach the full maximum even when every receptor is occupied (lower efficacy). Its potency is a separate matter: here its EC₅₀ equals the full agonist’s.',
   mix:'With a partial agonist already on the receptors, low doses of the full agonist add little to the partial’s own effect, and where the full agonist alone would give a large response, the mix gives less: the partial agonist acts as an antagonist. Enough full agonist still reaches the maximum. Example: buprenorphine precipitates withdrawal in someone dependent on heroin or methadone.'}[s.m];
  return K.svg(W,H,'Dose–response curves: '+DRM.filter(function(x){return x[0]===s.m})[0][2],g)+'<p class="fcap">'+cap+'</p>';
}};

/* autonomic drug effects: receptor activity bars plus organ effects as label:value rows (fits a phone) */
var RC=['α₁','α₂','β₁','β₂','M','N'],RH=['vessels','nerve','heart','airway','glands','muscle'];
var AD={
adr:['Adrenaline',[2,2,2,2,0,0],'↑','Systolic ↑; diastolic ↓ at low dose (β₂), ↑ at high dose (α₁)','Dilate (β₂)','Dilate (α₁, radial muscle)','α₁, α₂, β₁ and β₂. At low doses β₂ vasodilation lowers diastolic pressure; at high doses α₁ vasoconstriction wins. Drug of choice in anaphylaxis.'],
nor:['Noradrenaline',[2,2,2,0,0,0],'↓ (reflex)','↑↑ systolic and diastolic','Little effect','Dilate (α₁)','α₁ > α₂ > β₁, with little β₂. Pressure rises everywhere, and the baroreceptor reflex slows the heart despite direct β₁ stimulation.'],
iso:['Isoprenaline',[0,0,2,2,0,0],'↑↑','Systolic ↑ or steady; diastolic ↓↓ (mean falls)','Dilate (β₂)','Little effect','Pure β (β₁ = β₂). The heart speeds up and β₂ dilates muscle arterioles, so diastolic and mean pressure fall.'],
phe:['Phenylephrine',[2,0,0,0,0,0],'↓ (reflex)','↑','Little effect','Dilate, accommodation spared','Selective α₁. Vasoconstriction raises pressure with reflex bradycardia; it dilates the pupil without paralysing accommodation (no cycloplegia). Also a nasal decongestant.'],
atr:['Atropine',[0,0,0,0,-2,0],'↑','Little effect','Dilate; secretions dry','Dilate, cannot accommodate','Muscarinic blocker: fast heart, dry mouth and skin, flushing, hyperthermia, dilated pupils with cycloplegia, urinary retention, constipation, delirium. Antidote for the muscarinic effects of organophosphates.'],
pro:['Propranolol',[0,0,-2,-2,0,0],'↓','↓','Constrict (danger in asthma)','Little effect','Non-selective β blocker: slower heart, less contractility and renin, lower pressure. The β₂ block can tighten the airways in asthma and hide the warning signs of hypoglycaemia.'],
org:['Organophosphate',[0,0,0,0,2,1],'↓ (usually)','↓','Constrict; bronchorrhoea','Constrict (miosis)','Acetylcholinesterase is blocked, so acetylcholine floods muscarinic and nicotinic receptors: salivation, lacrimation, urination, diarrhoea, bronchospasm, bradycardia and miosis, then muscle fasciculations and nicotinic paralysis. Treat with atropine and pralidoxime.']};
F.ans={title:'Drugs on the two nerves',def:{d:'adr'},
ctrl:function(s){return '<div class="frow"><span>Drug</span>'+Object.keys(AD).map(function(k){return btn('ans','d',k,AD[k][0],s.d===k)}).join('')+'</div>'},
view:function(s){
  var d=AD[s.d],n=K.narrow(),W=n?340:460,H=178,mid=74,cw=(W-20)/6,g='';
  g+='<line x1="10" y1="'+mid+'" x2="'+(W-10)+'" y2="'+mid+'" style="stroke:var(--muted);stroke-width:1.5"/>';
  g+=tx(10,14,'stimulated ↑',{s:12,c:'sm',st:'fill:var(--accent-text)'})+tx(W-10,14,'blocked ↓',{s:12,a:'end',c:'sm',st:'fill:var(--bad)'});
  d[1].forEach(function(v,i){var x=10+cw*i+cw/2,h=Math.abs(v)*24,bw=Math.min(30,cw-14);
    if(v>0)g+='<rect x="'+r1(x-bw/2)+'" y="'+(mid-h)+'" width="'+bw+'" height="'+h+'" style="fill:var(--accent)"/>';
    else if(v<0)g+='<rect x="'+r1(x-bw/2)+'" y="'+mid+'" width="'+bw+'" height="'+h+'" style="fill:color-mix(in srgb,var(--bad) 40%,var(--surface));stroke:var(--bad);stroke-width:2;stroke-dasharray:4 3"/>';
    else g+='<rect x="'+r1(x-bw/2)+'" y="'+(mid-1.5)+'" width="'+bw+'" height="3" style="fill:var(--line)"/>';
    g+=tx(x,H-30,RC[i],{s:15,a:'middle',c:'sm',st:v?'':'fill:var(--muted)'})+tx(x,H-7,RH[i],{s:12,a:'middle',c:'sm',st:'fill:var(--muted)'});
  });
  var rows=[['Heart rate',d[2]],['Blood pressure',d[3]],['Airways',d[4]],['Pupils',d[5]]];
  var dl='<dl style="display:grid;grid-template-columns:max-content 1fr;gap:6px 14px;margin:8px 0 0;font-size:15px">'+rows.map(function(r){return '<dt style="color:var(--muted);font-size:13px;font-family:var(--mono);letter-spacing:.06em;text-transform:uppercase;align-self:baseline">'+r[0]+'</dt><dd style="margin:0">'+r[1]+'</dd>'}).join('')+'</dl>';
  var act=d[1].map(function(v,i){return v>0?RC[i]+' stimulated':v<0?RC[i]+' blocked':''}).filter(Boolean).join(', ');
  return K.svg(W,H,d[0]+': '+act,g)+dl+'<p class="fcap">'+d[6]+'</p>';
}};

/* anaemia finder */
F.anemia={title:'Sort the anaemia',def:{mcv:72,ret:'low'},
ctrl:function(s){return '<div class="frow">'+rng('anemia','mcv',60,130,1,s.mcv,'fL','MCV')+'</div><div class="frow"><span>Reticulocytes</span>'+btn('anemia','ret','low','Low',s.ret==='low')+btn('anemia','ret','high','High',s.ret==='high')+'</div>'},
view:function(s){
  var band=s.mcv<80?'micro':s.mcv>100?'macro':'normo',hi=s.ret==='high',list,head;
  if(band==='micro'&&!hi){head='Microcytic: trouble making haemoglobin';list=['Iron deficiency (↓ ferritin, ↑ TIBC, ↓ transferrin saturation)','Anaemia of chronic disease (ferritin normal or ↑, ↓ TIBC); usually normocytic, microcytic when long-standing','Thalassaemia trait (normal iron studies, target cells; RBC count high for the Hb, Mentzer index MCV/RBC < 13)','Lead poisoning (basophilic stippling, ↑ zinc protoporphyrin)','Sideroblastic anaemia (ring sideroblasts, ↑ iron and ferritin)']}
  else if(band==='micro'){head='Microcytic with a reticulocyte response';list=['Thalassaemia (mild haemolysis raises retics; target cells; Mentzer index < 13)','Iron deficiency now being treated (retics peak about 7–10 days after iron starts)','HbC or HbE disease (target cells)']}
  else if(band==='macro'&&!hi){head='Macrocytic with low reticulocytes';list=s.mcv>115?['Megaloblastic: B12 or folate deficiency (hypersegmented neutrophils; ↑ methylmalonic acid only in B12)','Drugs that block DNA synthesis: methotrexate, hydroxyurea, zidovudine','Myelodysplasia']:['B12 or folate deficiency (megaloblastic; hypersegmented neutrophils)','Alcohol and liver disease (round macrocytes, target cells; not megaloblastic)','Hypothyroidism','Myelodysplasia','Drugs: methotrexate, hydroxyurea, zidovudine']}
  else if(band==='macro'){head='Macrocytic with high reticulocytes';list=['Reticulocytosis itself: brisk response to haemolysis or bleeding (young red cells are large)','Haemolysis that has used up folate (megaloblastic change on top)','Cold agglutinins clump cells and falsely raise the MCV']}
  else if(hi){head='Normocytic with high reticulocytes: cells lost or destroyed';list=['Acute blood loss (retics rise after 3–5 days)','Haemolysis inside the cell: hereditary spherocytosis, G6PD deficiency, sickle cell, pyruvate kinase deficiency, PNH','Haemolysis from outside: autoimmune (Coombs positive), microangiopathic (schistocytes: TTP, HUS, DIC), infections (malaria)']}
  else {head='Normocytic with low reticulocytes: marrow not producing';list=['Anaemia of chronic disease (hepcidin locks iron away)','Chronic kidney disease (too little EPO)','Early iron deficiency or mixed deficiencies','Aplastic anaemia, marrow infiltration (myelophthisis)']}
  var n=K.narrow(),W=n?340:460,H=96,x0=86,x1=W-12,X=function(v){return x0+(Math.max(60,Math.min(130,v))-60)/70*(x1-x0)},x=X(s.mcv),g='';
  /* red cell drawn at a size that follows the MCV */
  var rr=10+(s.mcv-60)/70*16;g+='<circle cx="40" cy="50" r="'+r1(rr)+'" style="fill:var(--phys)"/><circle cx="40" cy="50" r="'+r1(rr*(band==='micro'?.55:.38))+'" style="fill:color-mix(in srgb,var(--phys) 35%,var(--surface))"/>';
  g+='<rect x="'+r1(X(60))+'" y="40" width="'+r1(X(80)-X(60))+'" height="14" style="fill:var(--path)"/><rect x="'+r1(X(80))+'" y="40" width="'+r1(X(100)-X(80))+'" height="14" style="fill:var(--bio)"/><rect x="'+r1(X(100))+'" y="40" width="'+r1(X(130)-X(100))+'" height="14" style="fill:var(--phys)"/>';
  g+=tx((X(60)+X(80))/2,74,'micro',{s:12.5,a:'middle',c:'sm'})+tx((X(80)+X(100))/2,74,'normo',{s:12.5,a:'middle',c:'sm'})+tx((X(100)+X(130))/2,74,'macro',{s:12.5,a:'middle',c:'sm'});
  g+=tx(X(80),90,'80',{s:12,a:'middle',c:'sm',st:'fill:var(--muted)'})+tx(X(100),90,'100',{s:12,a:'middle',c:'sm',st:'fill:var(--muted)'});
  g+='<polygon points="'+r1(x)+',38 '+r1(x-7)+',26 '+r1(x+7)+',26" style="fill:var(--fg)"/>';
  var la=x<x0+30?'start':x>x1-30?'end':'middle';g+=tx(la==='start'?x-6:la==='end'?x+6:x,20,s.mcv+' fL',{s:13,a:la,c:'sm'});
  return K.svg(W,H,'MCV '+s.mcv+' fL, '+band+'cytic, reticulocytes '+s.ret,g)+'<p class="fcap"><b>'+head+'.</b> '+(hi?'A reticulocyte production index above about 2 means the marrow is answering.':'A low reticulocyte count means the marrow is not keeping up.')+'</p><ul class="flist">'+list.map(function(x){return '<li>'+x+'</li>'}).join('')+'</ul>';
}};

/* coagulation cascade. Each problem lists the node keys it hits, matched exactly (never by prefix). */
var CO={
none:['Normal',[],'normal','normal','normal','normal','Nothing is missing. PT tests the extrinsic and common pathways (VII, X, V, II, fibrinogen); PTT tests the intrinsic and common pathways (XII, XI, IX, VIII, X, V, II, fibrinogen).'],
war:['Warfarin',['II','VII','IX','X','PC'],'↑↑','normal or mildly ↑','normal','normal','Warfarin blocks vitamin K epoxide reductase, so II, VII, IX and X (and proteins C and S) are made without their working Gla residues. Factor VII has the shortest half-life, so the PT/INR rises first. Protein C also falls early, so the first days can be prothrombotic (warfarin skin necrosis): start under heparin cover. Reverse with vitamin K, plus prothrombin complex concentrate when bleeding.'],
hep:['Heparin',['II','X','AT'],'normal or mildly ↑','↑↑','normal (watch for HIT)','normal','Heparin boosts antithrombin, which inactivates thrombin (IIa) and Xa (and IXa, XIa, XIIa). Unfractionated heparin is followed with the PTT; low-molecular-weight heparin acts mostly on Xa and barely moves the PTT. Reverse with protamine.'],
xa:['Rivaroxaban, apixaban',['X'],'↑ (variable)','↑ (variable)','normal','normal','Direct Xa inhibitors need no antithrombin. Routine PT and PTT rise only loosely with the dose, so they are not used for monitoring (anti-Xa assays are). Andexanet alfa reverses them.'],
dab:['Dabigatran, argatroban',['II'],'mildly ↑','↑','normal','normal','Direct thrombin inhibitors. The thrombin time is very prolonged; the PTT rises more than the PT. Idarucizumab reverses dabigatran.'],
vitk:['Vitamin K deficiency',['II','VII','IX','X','PC'],'↑↑','↑','normal','normal','Same factors as warfarin. Seen in newborns (sterile gut, little transfer across the placenta: give vitamin K at birth), fat malabsorption and long courses of broad-spectrum antibiotics.'],
liver:['Liver failure',['II','V','VII','IX','X','XI','I','PC','AT','PLT'],'↑↑','↑','↓ (hypersplenism, low thrombopoietin)','↑ or normal','The liver makes almost every factor except VIII (made by endothelium), so VIII stays normal or high; that helps tell liver disease from DIC. Vitamin K does not correct it. Anticoagulant proteins C, S and antithrombin fall too, so clotting can tip either way.'],
hA:['Haemophilia A',['VIII'],'normal','↑','normal','normal','X-linked recessive deficiency of factor VIII: deep bleeding into joints (haemarthrosis) and muscles. The PTT corrects when mixed with normal plasma (unless an inhibitor is present). Treat with factor VIII or emicizumab; desmopressin helps mild cases.'],
hB:['Haemophilia B',['IX'],'normal','↑','normal','normal','X-linked recessive deficiency of factor IX (Christmas disease). Clinically identical to haemophilia A; treat with factor IX.'],
vwd:['von Willebrand disease',['VWF','VIII'],'normal','normal or ↑','normal','↑','The commonest inherited bleeding disorder (usually autosomal dominant). vWF glues platelets to collagen via GpIb and carries factor VIII, so VIII falls too. Mucosal bleeding: nosebleeds, heavy periods. Ristocetin test abnormal; desmopressin releases stored vWF.'],
dic:['DIC',['I','II','V','VIII','X','PLT'],'↑','↑','↓','↑','Widespread clotting uses up factors and platelets, then bleeding follows: low fibrinogen, high D-dimer, schistocytes. Causes: sepsis, trauma, obstetric emergencies, acute promyelocytic leukaemia, snake bites.'],
itp:['ITP',['PLT'],'normal','normal','↓','↑','IgG against platelet GpIIb/IIIa; the spleen removes the coated platelets. Petechiae and mucosal bleeding with an otherwise normal clotting screen. Marrow megakaryocytes are increased.'],
bss:['Bernard–Soulier',['PLT'],'normal','normal','↓ (giant platelets)','↑','Missing GpIb, so platelets cannot bind vWF. Ristocetin fails to agglutinate the platelets, and adding normal plasma does not fix it (unlike vWD). Compare Glanzmann thrombasthenia: missing GpIIb/IIIa, normal count, no aggregation.']};
var DRUGS=['none','war','hep','xa','dab'],DIS=['vitk','liver','hA','hB','vwd','dic','itp','bss'];
/* node layout in 340-wide units: [x, y, label, width] */
var CN={XII:[14,40,'XII'],XI:[14,84,'XI'],IX:[14,128,'IX'],VIII:[80,128,'VIII'],TF:[208,62,'TF'],VII:[262,62,'VII'],X:[128,168,'X'],V:[190,168,'V'],II:[128,210,'II → IIa',70],I:[230,210,'Fibrinogen',84],F:[230,250,'Fibrin clot',84],AT:[14,210,'Antithr.',64],PC:[14,250,'Prot. C, S',74],VWF:[100,250,'vWF',46],PLT:[152,250,'Platelets',66]};
F.coag={title:'The cascade',def:{d:'none'},
ctrl:function(s){return '<div class="frow"><span>Drug</span>'+DRUGS.map(function(k){return btn('coag','d',k,CO[k][0],s.d===k)}).join('')+'</div><div class="frow"><span>Disease</span>'+DIS.map(function(k){return btn('coag','d',k,CO[k][0],s.d===k)}).join('')+'</div>'},
view:function(s){
  var c=CO[s.d]||CO.none,hit=function(k){return c[1].indexOf(k)>=0},n=K.narrow(),W=n?340:460,H=290,f=(W-0)/340,g='';
  var NW=44,NH=24;
  function P(k){var q=CN[k];return {x:q[0]*f,y:q[1],w:q[3]||NW}}
  function edge(a,b,inhib){var A=P(a),B=P(b),ax=A.x+A.w/2,ay=A.y+NH/2,bx=B.x+B.w/2,by=B.y-NH/2;
    if(A.y===B.y){ax=A.x+A.w;ay=A.y;bx=B.x;by=B.y}
    var on=!hit(a)&&s.d!=='dic'||!c[1].length;var col=hit(a)?'var(--bad)':'var(--muted)';
    return arrow(ax,ay,bx,by,col,2,hit(a)?'4 3':null)}
  g+=tx(14,16,'INTRINSIC · PTT',{s:12,c:'sm',st:'fill:var(--muted);letter-spacing:.06em'})+tx(W-8,16,'EXTRINSIC · PT',{s:12,a:'end',c:'sm',st:'fill:var(--muted);letter-spacing:.06em'})+tx(P('V').x+NW+8,173,'COMMON',{s:12,a:'start',c:'sm',st:'fill:var(--muted);letter-spacing:.06em'});
  g+=tx(P('VWF').x,284,'PLATELET PLUG · BT',{s:12,a:'start',c:'sm',st:'fill:var(--muted);letter-spacing:.06em'});
  g+=edge('XII','XI')+edge('XI','IX')+edge('IX','X')+edge('TF','VII')+edge('II','I')+edge('I','F');
  /* cofactors and joins drawn as plain lines into the target */
  var Px=P('X'),Pv=P('VIII'),P7=P('VII'),P5=P('V'),P2=P('II');
  g+=arrow(Pv.x+NW/2,Pv.y+NH/2,Px.x+NW*.6,Px.y-NH/2,hit('VIII')?'var(--bad)':'var(--muted)',2,hit('VIII')?'4 3':null);
  g+=arrow(P7.x+NW/2,P7.y+NH/2,Px.x+NW,Px.y-NH/2+4,hit('VII')?'var(--bad)':'var(--muted)',2,hit('VII')?'4 3':null);
  g+=arrow(Px.x+NW/2,Px.y+NH/2,P2.x+NW/2,P2.y-NH/2,hit('X')?'var(--bad)':'var(--muted)',2,hit('X')?'4 3':null);
  g+=arrow(P5.x+NW/2,P5.y+NH/2,P2.x+P2.w,P2.y-NH/2+4,hit('V')?'var(--bad)':'var(--muted)',2,hit('V')?'4 3':null);
  g+='<line x1="'+r1(P('VWF').x+46)+'" y1="'+P('VWF').y+'" x2="'+r1(P('PLT').x)+'" y2="'+P('PLT').y+'" style="stroke:var(--muted);stroke-width:2"/>';
  /* inhibitors (flat-headed) */
  if(s.d==='hep'){[['X',0],['II',0]].forEach(function(t){var A=P('AT'),B=P(t[0]),ax=A.x+A.w,ay=A.y,bx=B.x,by=B.y;if(t[0]==='X'){ax=A.x+A.w/2;ay=A.y-NH/2;bx=B.x;by=B.y+4}var ex=bx-4,an=Math.atan2(by-ay,ex-ax),px=Math.sin(an)*7,py=-Math.cos(an)*7;g+='<line x1="'+r1(ax)+'" y1="'+r1(ay)+'" x2="'+r1(ex)+'" y2="'+r1(by)+'" style="stroke:var(--accent);stroke-width:2.5"/><line x1="'+r1(ex-px)+'" y1="'+r1(by-py)+'" x2="'+r1(ex+px)+'" y2="'+r1(by+py)+'" style="stroke:var(--accent);stroke-width:3"/>'})}
  Object.keys(CN).forEach(function(k){var p=P(k),h=hit(k),isAT=k==='AT'&&s.d==='hep',w=p.w;
    var fill=h&&!isAT?'color-mix(in srgb,var(--bad) 32%,var(--surface))':isAT?'var(--accent-soft)':k==='AT'||k==='PC'?'var(--surface)':'var(--accent-soft)';
    var stroke=h&&!isAT?'var(--bad)':isAT?'var(--accent)':k==='AT'||k==='PC'||k==='VWF'||k==='PLT'?'var(--line)':'var(--accent)';
    g+='<rect x="'+r1(p.x)+'" y="'+(p.y-NH/2)+'" width="'+w+'" height="'+NH+'" rx="4" style="fill:'+fill+';stroke:'+stroke+';stroke-width:'+(h?3:2)+'"/>';
    g+=tx(p.x+w/2,p.y+5,CN[k][2],{s:13,a:'middle',c:'sm',st:h&&!isAT?'text-decoration:line-through':''});
    if(h&&!isAT)g+=tx(p.x+w-3,p.y-NH/2-3,'✕',{s:12.5,a:'middle',c:'bad'});
    if(isAT)g+=tx(p.x+w/2,p.y-NH/2-4,'boosted',{s:12,a:'middle',c:'sm',st:'fill:var(--accent-text)'});
  });
  var hitList=c[1].filter(function(k){return !(s.d==='hep'&&k==='AT')}).map(function(k){return {I:'fibrinogen',PC:'proteins C and S',AT:'antithrombin',PLT:'platelets',VWF:'vWF',TF:'tissue factor'}[k]||k});
  var labs=[['PT/INR',c[2]],['PTT',c[3]],['Platelets',c[4]],['Bleeding time',c[5]]];
  var grid='<dl style="display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:6px 14px;margin:8px 0 0">'+labs.map(function(l){return '<div><dt style="color:var(--muted);font-size:13px;font-family:var(--mono);letter-spacing:.06em;text-transform:uppercase">'+l[0]+'</dt><dd style="margin:0;font-size:15px;font-weight:600">'+l[1]+'</dd></div>'}).join('')+'</dl>';
  return K.svg(W,H,'Coagulation cascade, '+c[0]+': '+(hitList.length?'affected '+hitList.join(', '):'nothing affected'),g)+grid+'<p class="fcap"><b>'+c[0]+'.</b> '+(hitList.length?'Hit: '+hitList.join(', ')+'. ':'')+c[6]+'</p>';
}};
})();
