/* Bassiet figures, part 2: leukocyte extravasation, pedigrees. Uses the shared kit from figs.js (CT.figKit). */
(function(){
'use strict';
var F=window.FIG,K=CT.figKit,tx=K.tx,arrow=K.arrow,btn=K.btn,r1=K.r1;

/* leukocyte extravasation */
var STEPS=[['Rolling','E-selectin and P-selectin on the endothelium catch sialyl-Lewis X on the neutrophil. Each bond forms and breaks, so the cell slows and rolls. P-selectin comes out of Weibel–Palade bodies within minutes (histamine, thrombin); E-selectin is made over hours after IL-1 and TNF.','E-/P-selectin  ⟷  sialyl-Lewis X'],
['Tight adhesion','Chemokines on the endothelium (IL-8) switch the neutrophil’s β2 integrins (LFA-1, Mac-1; both use CD18) into a high-affinity state. They grip ICAM-1, raised by IL-1 and TNF, and the cell stops and flattens.','LFA-1 (CD18)  ⟷  ICAM-1'],
['Transmigration','The neutrophil squeezes between two endothelial cells at the junction, using PECAM-1 (CD31) on both, and crosses the basement membrane. This happens mostly in post-capillary venules.','PECAM-1 (CD31) at the junction'],
['Chemotaxis','It crawls up the gradient of C5a, IL-8, LTB₄ and bacterial N-formyl peptides to the bacteria, then phagocytoses them.','C5a · IL-8 · LTB₄ · N-formyl peptides']];
F.leuko={title:'Leaving the blood',def:{s:0,lad:0},
ctrl:function(s){return '<div class="frow"><span>Step</span>'+STEPS.map(function(x,i){return btn('leuko','s',i,(i+1)+'. '+x[0],s.s==i)}).join('')+'</div><div class="frow"><span>Patient</span>'+btn('leuko','lad',0,'Normal',s.lad==0)+btn('leuko','lad',1,'LAD type 1 (no CD18)',s.lad==1)+'</div>'},
view:function(s){
  var n=K.narrow(),W=n?340:460,H=224,f=W/340,X=function(v){return r1(v*f)},lad=s.lad==1,st=+s.s||0,g='';
  var ey=96,eh=16,gx=X(206);
  g+='<rect x="0" y="0" width="'+W+'" height="'+ey+'" style="fill:color-mix(in srgb,var(--phys) 9%,var(--surface))"/>';
  g+=tx(8,18,'VESSEL LUMEN · flow →',{s:12,c:'sm',st:'fill:var(--muted);letter-spacing:.06em'});
  /* endothelial cells, with a junction at gx */
  for(var j=-6;j<8;j++){var a=gx+j*48*f,b=a+48*f;if(b<0||a>W)continue;g+='<rect x="'+r1(a+2)+'" y="'+ey+'" width="'+r1(48*f-4)+'" height="'+eh+'" rx="5" style="fill:var(--surface2);stroke:var(--bio);stroke-width:1.5"/>'}
  g+=tx(8,H-8,'TISSUE',{s:12,c:'sm',st:'fill:var(--muted);letter-spacing:.06em'});
  /* bacteria */
  var bx=W-46,by=186;for(var i=0;i<6;i++)g+='<rect x="'+(bx+(i%3)*12)+'" y="'+(by+Math.floor(i/3)*10)+'" width="9" height="5" rx="2.5" style="fill:var(--micro)"/>';
  g+=tx(W-8,by-10,'bacteria',{s:12.5,a:'end',c:'sm',st:'fill:var(--micro-t)'});
  function neut(x,y,rx,ry,ghost){var o='<ellipse cx="'+r1(x)+'" cy="'+r1(y)+'" rx="'+rx+'" ry="'+ry+'" style="fill:'+(ghost?'none':'var(--surface)')+';stroke:var(--path);stroke-width:'+(ghost?1.5:2.5)+(ghost?';stroke-dasharray:3 3;opacity:.5':'')+'"/>';
    if(!ghost){var q=Math.min(rx,ry)*.3;o+='<path d="M'+r1(x-rx*.42)+','+r1(y-ry*.08)+' Q'+r1(x-rx*.2)+','+r1(y+ry*.4)+' '+r1(x)+','+r1(y+ry*.22)+' Q'+r1(x+rx*.2)+','+r1(y+ry*.4)+' '+r1(x+rx*.42)+','+r1(y-ry*.08)+'" style="fill:none;stroke:var(--path);stroke-width:2"/>';
      [[-.42,-.08],[0,.22],[.42,-.08]].forEach(function(p){o+='<circle cx="'+r1(x+p[0]*rx)+'" cy="'+r1(y+p[1]*ry)+'" r="'+r1(q)+'" style="fill:var(--path)"/>'})}
    return o}
  var lab;
  if(lad){
    [40,95,150,205].forEach(function(x){g+=neut(X(x),ey-24,21,21,true)});g+=neut(X(258),ey-24,21,21);
    for(i=0;i<5;i++){var sx=X(258)-18+i*9;g+='<line x1="'+sx+'" y1="'+ey+'" x2="'+sx+'" y2="'+(ey-6)+'" style="stroke:var(--accent);stroke-width:2"/><circle cx="'+sx+'" cy="'+(ey-7)+'" r="3" style="fill:var(--accent)"/>'}
    g+=arrow(X(258)+26,ey-34,X(258)+56,ey-34,'var(--muted)',2);
    g+=tx(8,ey+eh+40,'No CD18: rolls on, never grips',{s:13,c:'bad'});
    lab='Selectins still work; ✕ LFA-1 ⟷ ICAM-1';
  }else{
    var P=[[X(70),ey-23,21,21],[X(146),ey-16,28,16],[gx,ey+eh/2,11,27],[X(238),164,21,19]];
    for(i=0;i<st;i++)g+=neut(P[i][0],P[i][1],P[i][2],P[i][3],true);
    if(st>0)for(i=0;i<st;i++)g+='<line x1="'+r1(P[i][0])+'" y1="'+r1(P[i][1])+'" x2="'+r1(P[i+1][0])+'" y2="'+r1(P[i+1][1])+'" style="stroke:var(--path);stroke-width:1.5;stroke-dasharray:2 4;opacity:.6"/>';
    var c=P[st];g+=neut(c[0],c[1],c[2],c[3]);
    if(st===0){g+=arrow(c[0]+28,c[1]-8,c[0]+58,c[1]-8,'var(--muted)',2);for(i=0;i<4;i++){var mx=c[0]-13+i*9;g+='<line x1="'+mx+'" y1="'+ey+'" x2="'+mx+'" y2="'+(ey-6)+'" style="stroke:var(--accent);stroke-width:2"/><circle cx="'+mx+'" cy="'+(ey-7)+'" r="3" style="fill:var(--accent)"/>'}}
    if(st===1)for(i=0;i<6;i++){var ix=c[0]-20+i*8;g+='<rect x="'+(ix-1.5)+'" y="'+(ey-4)+'" width="3" height="4" style="fill:var(--accent)"/><rect x="'+(ix-1.5)+'" y="'+(ey-8)+'" width="3" height="4" style="fill:var(--bio)"/>'}
    if(st===2)g+='<rect x="'+r1(gx-13)+'" y="'+(ey+2)+'" width="3" height="'+(eh-4)+'" style="fill:var(--accent)"/><rect x="'+r1(gx+10)+'" y="'+(ey+2)+'" width="3" height="'+(eh-4)+'" style="fill:var(--accent)"/>';
    if(st===3)for(i=0;i<3;i++)g+=arrow(c[0]+20+i*4,c[1]+4+i*6,bx-6,by+2+i*4,'color-mix(in srgb,var(--micro) 70%,transparent)',1.5,'3 3');
    lab=STEPS[st][2];
  }
  g+=tx(8,ey+eh+20,lab,{s:13,c:'sm',st:'fill:var(--accent-text)'});
  var cap=lad?'Leukocyte adhesion deficiency type 1 (autosomal recessive): no CD18, so no working β2 integrin. Neutrophils roll on selectins but never stop. They pile up in the blood (marked neutrophilia), infections come without pus, wounds heal poorly and the umbilical cord separates late (after 30 days).':STEPS[st][1];
  return K.svg(W,H,'Neutrophil leaving a vessel, '+(lad?'LAD type 1: keeps rolling':'step '+(st+1)+', '+STEPS[st][0]),g)+'<p class="fcap">'+cap+'</p>';
}};

/* pedigrees: I1×I2; their children II2–II5; II1 and II6 marry in; III1–III3 are children of II1×II2, III4–III6 of II5×II6 */
var PED={
ad:['Autosomal dominant',{I1:'a',II2:'a',II5:'a',III1:'a',III4:'a',III5:'a'},'Every generation is affected, males and females alike, about half of each sibship. II5 passes it to his son III5: father-to-son transmission rules out X-linked inheritance.'],
ar:['Autosomal recessive',{I1:'c',I2:'c',II2:'c',II3:'a',II5:'c',II6:'c',III2:'c',III5:'a',III6:'c'},'Unaffected carrier parents have affected children (about 1 in 4): II3 from I1×I2, III5 from II5×II6. Both sexes; it skips generations; consanguinity raises the risk.'],
xlr:['X-linked recessive',{I2:'c',II2:'c',II3:'a',II5:'a',III1:'a',III2:'c',III4:'c',III6:'c'},'Mostly males, through carrier mothers (I2, II2). Affected II5 passes his X to every daughter (III4, III6 are carriers) and his Y to his son (III5 unaffected): never father to son.'],
xld:['X-linked dominant',{I1:'a',II2:'a',II4:'a',III1:'a',III2:'a'},'Affected father I1 passes it to every daughter (II2, II4) and to no son (II3, II5). Affected mother II2 passes it to about half her children, of either sex.'],
mito:['Mitochondrial',{I2:'a',II2:'a',II3:'a',II4:'a',II5:'a',III1:'a',III2:'a',III3:'h'},'Only mothers pass it on: every child of I2 and of II2 is affected. Affected father II5 passes it to none of his children. Severity varies with heteroplasmy (III3 is mildly affected).']};
var PEOPLE={I1:[150,24,'m'],I2:[210,24,'f'],II1:[25,96,'m'],II2:[75,96,'f'],II3:[135,96,'m'],II4:[195,96,'f'],II5:[255,96,'m'],II6:[315,96,'f'],III1:[25,168,'m'],III2:[75,168,'f'],III3:[125,168,'m'],III4:[235,168,'f'],III5:[285,168,'m'],III6:[335,168,'f']};
F.pedigree={title:'Read the family',def:{p:'ad'},
ctrl:function(s){return '<div class="frow"><span>Pattern</span>'+Object.keys(PED).map(function(k){return btn('pedigree','p',k,PED[k][0],s.p===k)}).join('')+'</div>'},
view:function(s){
  var P=PED[s.p],st=P[1],n=K.narrow(),W=n?360:520,H=214,R=13,g='';
  function line(x1,y1,x2,y2){g+='<line x1="'+x1+'" y1="'+y1+'" x2="'+x2+'" y2="'+y2+'" style="stroke:var(--muted);stroke-width:2"/>'}
  /* couples, descent lines and sibships */
  line(150+R,24,210-R,24);line(180,24,180,62);line(75,62,255,62);[75,135,195,255].forEach(function(x){line(x,62,x,96-R)});
  line(25+R,96,75-R,96);line(50,96,50,136);line(25,136,125,136);[25,75,125].forEach(function(x){line(x,136,x,168-R)});
  line(255+R,96,315-R,96);line(285,96,285,136);line(235,136,335,136);[235,285,335].forEach(function(x){line(x,136,x,168-R)});
  Object.keys(PEOPLE).forEach(function(k){var p=PEOPLE[k],v=st[k]||'',fill=v==='a'?'var(--phys)':'var(--surface)',sh;
    var sty='style="fill:'+fill+';stroke:var(--fg);stroke-width:2"';
    sh=p[2]==='m'?'<rect x="'+(p[0]-R)+'" y="'+(p[1]-R)+'" width="'+2*R+'" height="'+2*R+'" '+sty+'/>':'<circle cx="'+p[0]+'" cy="'+p[1]+'" r="'+R+'" '+sty+'/>';
    if(v==='h')sh+=(p[2]==='m'?'<rect x="'+(p[0]-R)+'" y="'+(p[1]-R)+'" width="'+R+'" height="'+2*R+'" style="fill:var(--phys)"/>':'<path d="M'+p[0]+','+(p[1]-R)+' A'+R+','+R+' 0 0 0 '+p[0]+','+(p[1]+R)+' Z" style="fill:var(--phys)"/>')+(p[2]==='m'?'<rect x="'+(p[0]-R)+'" y="'+(p[1]-R)+'" width="'+2*R+'" height="'+2*R+'" style="fill:none;stroke:var(--fg);stroke-width:2"/>':'<circle cx="'+p[0]+'" cy="'+p[1]+'" r="'+R+'" style="fill:none;stroke:var(--fg);stroke-width:2"/>');
    if(v==='c')sh+='<circle cx="'+p[0]+'" cy="'+p[1]+'" r="4.5" style="fill:var(--phys)"/>';
    g+=sh+tx(p[0],p[1]+R+14,k,{s:12,a:'middle',c:'sm',st:'fill:var(--muted)'});
  });
  var aff=Object.keys(st).filter(function(k){return st[k]==='a'||st[k]==='h'}),car=Object.keys(st).filter(function(k){return st[k]==='c'});
  return K.svg(W,H,'Pedigree, '+P[0]+'. Affected: '+aff.join(', ')+(car.length?'. Carriers: '+car.join(', '):''),n?g:'<g transform="translate(80,0)">'+g+'</g>')+'<p class="fcap"><b>'+P[0]+'.</b> '+P[2]+' <span class="muted">Square male, circle female; filled affected'+(s.p==='mito'?', half-filled mildly affected':'')+(s.p==='ar'||s.p==='xlr'?'; dot carrier (shown for teaching)':'')+'. II1 and II6 married in.</span></p>';
}};
})();
