/* Bassiet: the dive. Console, shaft, depths, chapter reader, stain tests, boss duels, fading stains,
   weak points, weekly dive log, samples to Yuzu, radio, Host file, ending, look and sound.
   Options in stain tests, re-stains, duels and Yuzu cards are shown shuffled; every button keeps the
   ORIGINAL option index in data-j, and scoring, misses and wounds always use original indices. */
(function(){
'use strict';
var CT=window.CT,esc=CT.esc,ST=window.STORY||{T:[],H:[]},DP=window.DEPTHS||[],BK=window.BOOK||{},A=CT.actions,DAY=CT.DAY||864e5;
var STAIN={path:['Violet','Pathology','Path'],micro:['Green','Microbiology','Micro'],pharm:['Blue','Pharmacology','Pharm'],bio:['Teal','Biochemistry','Bio'],phys:['Rose','Physiology','Phys']};
var WHO0={hale:'Dr. Hale · Ward 9',probe:'Bassiet log',static:'Static',host:'Host',pall:'—'};
var FADE=[7,14,30,60,120];
var CRIT=5;                                   /* answers in a row before each right answer strikes twice */
var VH='position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap;margin:-1px;padding:0;border:0';
CT.ui.stains={path:1,micro:1,pharm:1,bio:1,phys:1};
CT.ui.ans={};CT.ui.rs={};CT.ui.perm={};CT.ui.tsave={};CT.ui.rmiss={};CT.dsub=CT.dsub||null;CT.ui.yz={busy:false,msg:''};
CT.ui.tx=null;CT.ui.endI=1;
function T(){return (ST&&ST.T)||[]}
function H(){return (ST&&ST.H)||[]}
function Q(c){return (c&&c.Q)||[]}
function the(n){return String(n||'').replace(/^The /,'the ')}      /* "defeat the Unmaker" mid-sentence */
function dn(n){return '−'+String(n).padStart(2,'0')}
function line(t){return typeof t==='string'?{from:'static',t:t}:(t&&t.t?t:null)}
function lines(a){return (Array.isArray(a)?a:a?[a]:[]).map(line).filter(Boolean)}
function qhash(s){s=String(s||'');var h=5381;for(var i=0;i<s.length;i++)h=((h<<5)+h+s.charCodeAt(i))|0;return (h>>>0).toString(36)}
function sub(){if(CT.view!=='today')return '';return CT.dsub||((location.hash||'')==='#end'?'end':'')}

/* ---------- motifs and scenes ---------- */
var M={
cell:['..#####..','.#.....#.','#..###..#','#.#####.#','#.#####.#','#..###..#','.#.....#.','..#####..'],
flame:['....#....','...##....','...###...','..####.#.','.#######.','.###.###.','###...###','.##...##.','..#####..'],
helix:['#......#.','.#....#..','..####...','..#..#...','...##....','..#..#...','..####...','.#....#..','#......#.'],
shield:['#########','#.......#','#..###..#','#..###..#','.#.....#.','..#...#..','...#.#...','....#....'],
spore:['#...#...#','.#.###.#.','..#####..','#########','..#####..','.#.###.#.','#...#...#'],
drop:['....#....','...###...','..#####..','.#######.','####.####','###...###','.#######.','..#####..'],
heart:['.##...##.','####.####','#########','#########','.#######.','..#####..','...###...','....#....'],
lung:['....#....','....#....','.##.#.##.','####.####','####.####','####.####','###...###','.##...##.'],
loop:['#.......#','#.......#','#.#####.#','#.#...#.#','#.#...#.#','#.#.#.#.#','#...#...#','#####.###'],
villi:['#.#.#.#.#','#.#.#.#.#','#.#.#.#.#','#########','#.......#','#########'],
tower:['....#....','..#.#.#..','....#....','...###...','...#.#...','...###...','..#####..','..#.#.#..','.#######.'],
flower:['...#.#...','..#####..','...###...','..#.#.#..','....#....','..#.#....','...##....','....#....'],
bone:['##.....##','###...###','.#######.','###...###','##.....##'],
eye:['..#####..','.#.....#.','#..###..#','#.#####.#','#..###..#','.#.....#.','..#####..'],
bolt:['....###','...###.','..###..','.######','...###.','..###..','.##....','#......']};
function motif(name,x,y,s,cls){var b=M[name]||M.cell,o='';b.forEach(function(r,i){for(var j=0;j<r.length;j++)if(r[j]==='#')o+='<rect x="'+(x+j*s)+'" y="'+(y+i*s)+'" width="'+s+'" height="'+s+'" class="'+cls+'"/>'});return o}
function icon(d,locked){return '<svg viewBox="0 0 90 90" class="dicon" aria-hidden="true" style="--h:'+d.hue+'">'+motif(d.motif,9,9,8,locked?'mq':'mh')+'</svg>'}
function rng(seed){var s=Math.abs(seed|0)%233280;s=(s*9301+49297)%233280;return function(){s=(s*9301+49297)%233280;return s/233280}}
function seeded(a,seed){var r=rng(seed);a=a.slice();for(var i=a.length-1;i>0;i--){var j=Math.floor(r()*(i+1)),t=a[i];a[i]=a[j];a[j]=t}return a}
/* xMaxYMid: on a narrow phone banner the visible window is the right-hand part, which holds the motif (t01-14, t09-27) */
function scene(d,h){
  h=h||150;var r=rng(d.n*7+3),W=960,o='<svg class="scene" viewBox="0 0 '+W+' '+h+'" preserveAspectRatio="xMaxYMid slice" aria-hidden="true" style="--h:'+d.hue+'">';
  o+='<defs><radialGradient id="lamp'+d.n+'-'+h+'" cx="72%" cy="50%" r="45%"><stop offset="0" stop-color="var(--accent)" stop-opacity=".22"/><stop offset="1" stop-color="var(--accent)" stop-opacity="0"/></radialGradient></defs>';
  o+='<rect width="'+W+'" height="'+h+'" class="sbg"/><rect width="'+W+'" height="'+h+'" fill="url(#lamp'+d.n+'-'+h+')"/>';
  [['s1',6],['s2',10]].forEach(function(L){var x=0;while(x<W){var w=8*(1+Math.floor(r()*3)),top=Math.floor(r()*L[1])*8,bot=Math.floor(r()*L[1])*8;o+='<rect x="'+x+'" y="0" width="'+w+'" height="'+top+'" class="'+L[0]+'"/><rect x="'+x+'" y="'+(h-bot)+'" width="'+w+'" height="'+bot+'" class="'+L[0]+'"/>';x+=w}});
  o+=motif(d.motif,W*.72-40,h/2-40,10,'mh');
  for(var i=0;i<26;i++)o+='<rect x="'+Math.floor(r()*W)+'" y="'+Math.floor(r()*h)+'" width="'+(2+Math.floor(r()*3))+'" height="'+(2+Math.floor(r()*3))+'" class="pall"/>';
  return o+'</svg>';
}

/* ---------- progress model ---------- */
function rd(id){var a=CT.data.reads||[];for(var i=0;i<a.length;i++)if(a[i].id===id)return a[i];return null}
function clean(o){var n=Object.assign({},o||{});delete n.id;return n}
/* copies, so nothing mutates the cached row in place (t07-09) */
function story(){var s=rd('story')||{};return {seenAt:Object.assign({},s.seenAt||{}),entered:(s.entered||[]).slice(),lastVisit:s.lastVisit||0,hostSeen:s.hostSeen||0,endSeen:s.endSeen||0}}
function saveStory(p){var s=story();return CT.setDoc('reads','story',Object.assign(s,p))}
function cid(d,s){return s.ch||('c'+d.n+'-'+s.id)}
function isCh(id){return !!BK[id]}
function chDone(id){var r=rd(id);return !!(r&&r.done)}
function chScore(id){var r=rd(id);return r&&r.total?r.right/r.total:0}
function chStained(id){return chDone(id)&&chScore(id)>=.6}
function charted(d){return (d.strata||[]).filter(function(s){return BK[cid(d,s)]})}
function stained(d){return charted(d).filter(function(s){return chStained(cid(d,s))})}
function allStained(d){return charted(d).length===(d.strata||[]).length&&stained(d).length===(d.strata||[]).length}
function bossWon(d){var r=d&&rd('boss-'+d.n);return !!(r&&r.won)}
/* Seal rule (contract 2.4): once the boss is won the seal stays broken, even if strata are added later.
   The boss can only be fought with every stratum stained, so a win already implies a full stain. */
function sealBroken(d){return !!d&&bossWon(d)}
function optional(d,s){return sealBroken(d)&&!chStained(cid(d,s))}   /* new strata in a broken depth: extra reading */
function isOpen(d){return !!d&&(d.n===1||sealBroken(DP[d.n-2]))}
function lastSealed(){var d=DP[DP.length-1];return !!d&&sealBroken(d)}
/* a stained stratum made before fading existed (no due) fades from its first stain (t07-36) */
function fading(id){var r=rd(id);if(!r||!chStained(id))return false;var due=r.due||((r.firstAt||r.at||0)+FADE[0]*DAY);return due<=Date.now()}
function depthOf(id){return BK[id]?DP[BK[id].depth-1]:null}
function stratumOf(id){var d=depthOf(id);return d?(d.strata||[]).find(function(s){return cid(d,s)===id})||null:null}
function fired(at){
  var m;if(at==='start')return true;
  if((m=/^enter:(\d+)$/.exec(at)))return story().entered.indexOf(+m[1])>=0;
  if((m=/^seal:(\d+)$/.exec(at)))return !!DP[+m[1]-1]&&sealBroken(DP[+m[1]-1]);
  if((m=/^ch:(.+)$/.exec(at)))return chStained(m[1]);           /* a failed test unlocks nothing (t07-15) */
  return false;
}
function received(){return T().filter(function(t){return /^(start|enter|seal|ch)/.test(t.at)&&fired(t.at)})}
/* after the reveal point the old ward-doctor label is quietly retired (story-driven; see dev note) */
function unmask(){return ST.unmask||ST.RELABEL||null}
function relabelOn(){var r=unmask();return !!(r&&r.at&&fired(r.at))}
function who(from){var r=unmask();if(relabelOn()){var w=(r.who&&r.who[from])||(from==='hale'&&r.hale);if(w)return w}return WHO0[from]||''}
function sname(id){var s=stratumOf(id);return (s&&s.name)||(BK[id]&&BK[id].title)||''}
/* ambient voice: Hale, then the unmasked voice after the reveal, then the after-voice once the descent is over */
function voice(){var G=ST.GRADE||{};if(lastSealed()&&G.after)return 'after';if(relabelOn()&&G.pall)return 'pall';return 'hale'}
function missLine(){return lastSealed()?pick(['missafter','miss']):pick('miss')}
function nextStep(){
  for(var i=0;i<DP.length;i++){var d=DP[i];if(!isOpen(d))return null;
    if(sealBroken(d))continue;
    var c=charted(d);for(var j=0;j<c.length;j++){var id=cid(d,c[j]);if(!chStained(id))return {k:'ch',d:d,id:id,name:c[j].name}}
    if(c.length<(d.strata||[]).length)return null;
    return {k:'boss',d:d};
  }
  return null;
}
function deepest(){var n=1;DP.forEach(function(d){if(isOpen(d))n=d.n});return n}
function allFading(){var out=[];DP.forEach(function(d){charted(d).forEach(function(s){var id=cid(d,s);if(fading(id))out.push({d:d,s:s,id:id})})});return out}
function allOptional(){var out=[];DP.forEach(function(d){if(!sealBroken(d))return;charted(d).forEach(function(s){if(!chStained(cid(d,s)))out.push({d:d,s:s,id:cid(d,s)})})});return out}
CT.dive={sealBroken:sealBroken,isOpen:isOpen,chDone:chDone,chScore:chScore,chStained:chStained,bossWon:bossWon,
  fading:allFading,fadingCount:function(){return allFading().length},next:nextStep};

/* story writes: one merged write, only after loading (t10-04) */
var pendingSeen=null,pendingEnter=null,pendingStory=null;
function seeLater(ids){if(!ids||!ids.length)return;var s=story().seenAt;ids=ids.filter(function(id){return !s[id]});if(!ids.length)return;pendingSeen=(pendingSeen||[]).concat(ids.filter(function(id){return (pendingSeen||[]).indexOf(id)<0}))}
function storyLater(p){pendingStory=Object.assign(pendingStory||{},p)}
/* story writes are coalesced: at most one write per 1.2 s, and only when something new was shown (no write per render) */
var flushT=0;
function flushSoon(){if(!flushT)flushT=setTimeout(function(){flushT=0;flush()},1200)}
addEventListener('pagehide',function(){clearTimeout(flushT);flushT=0;flush()});
document.addEventListener('visibilitychange',function(){if(document.hidden&&flushT){clearTimeout(flushT);flushT=0;flush()}});
function flush(){
  if(CT.ui.loading||(!pendingSeen&&!pendingEnter&&!pendingStory))return;
  var s=story(),p={},noise=false;
  if(pendingSeen){var now=Date.now();pendingSeen.forEach(function(id){if(!s.seenAt[id]){s.seenAt[id]=now;noise=true}});p.seenAt=s.seenAt}
  if(pendingEnter&&s.entered.indexOf(pendingEnter)<0)p.entered=s.entered.concat([pendingEnter]);
  if(pendingStory)Object.assign(p,pendingStory);
  pendingSeen=pendingEnter=pendingStory=null;
  if(Object.keys(p).length){saveStory(p);if(noise)SND.static()}
}

/* ---------- radio: queued, non-blocking (contract 2.6) ---------- */
var rq=[],rCur=null,rT=0,rPoll=0;
function liveSay(msg){
  if(!document.body)return;
  var el=document.getElementById('sr-live');
  if(!el){el=document.createElement('div');el.id='sr-live';el.className='vh';el.setAttribute('aria-live','polite');el.style.cssText=VH;document.body.appendChild(el)}
  el.textContent='';setTimeout(function(){el.textContent=msg},40);
}
function radioBlocked(){
  var s=sub();
  if(/^duel-/.test(s)){var u=CT.ui.duel;return !!(u&&!u.over&&u.n===+s.slice(5))}
  if(/^restain-/.test(s)){var st=CT.ui.rs[s.slice(8)];return !!(st&&Object.keys(st.a).length<st.qs.length)}
  if(/^ch-/.test(s)){var id=s.slice(3),c=BK[id];if(!c)return false;var a=CT.ui.ans[id]||{};if(Object.keys(a).length>=Q(c).length)return false;
    var qz=document.querySelector('.quiz');if(!qz)return false;var r=qz.getBoundingClientRect();return r.top<innerHeight&&r.bottom>0}
  return s==='end';
}
function hideRadio(){
  var el=document.getElementById('radio');clearTimeout(rT);rCur=null;
  if(el)el.hidden=true;
  delete document.documentElement.dataset.radio;if(document.body)document.body.classList.remove('radio-on');
  if(rq.length){clearTimeout(rPoll);rPoll=setTimeout(pumpRadio,700)}
}
function pumpRadio(){
  clearTimeout(rPoll);if(!rq.length||rCur)return;
  var el=document.getElementById('radio');if(!el){rq=[];return}
  if(radioBlocked()){rPoll=setTimeout(pumpRadio,1200);return}
  var t=rCur=rq.shift(),w=who(t.from);
  el.innerHTML='<span class="who">'+esc(w)+'</span><span class="rt">'+esc(t.t)+'</span><button type="button" class="rclose" data-act="rclose" aria-label="Dismiss this transmission">×</button>';
  el.className='rline from-'+t.from;el.removeAttribute('role');el.hidden=false;
  document.documentElement.dataset.radio='1';if(document.body)document.body.classList.add('radio-on');
  SND.static();liveSay((w?w+': ':'')+t.t);
  clearTimeout(rT);rT=setTimeout(hideRadio,Math.min(9000,Math.max(4500,String(t.t).length*55)));
}
CT.radio=function(t){t=line(t);if(!t)return;if((rCur&&rCur.t===t.t)||rq.some(function(x){return x.t===t.t}))return;rq.push(t);if(rq.length>3)rq.shift();pumpRadio()};
A.rclose=function(){hideRadio()};
function pick(kind){var ks=Array.isArray(kind)?kind:[kind];for(var k=0;k<ks.length;k++){var l=T().filter(function(t){return t.at===ks[k]});if(l.length)return l[Math.floor(Math.random()*l.length)]}return null}
function pickOne(a){a=lines(a);return a.length?a[Math.floor(Math.random()*a.length)]:null}

/* misses carry subject and concept (contract 2.3) and a short hash of the stem (t07-37) */
function logMiss(id,qi,src,why,j){
  var c=BK[id];if(!c)return;var q=Q(c)[qi]||{},d=DP[c.depth-1]||{},st=stratumOf(id)||{};
  var K=CT.concepts||{},con=(q.c&&K[q.c])?q.c:((c.c||[]).filter(function(x){return K[x]})[0]||'');   /* unknown concept ids are skipped */
  CT.setDoc('misses',CT.newId(),{concept:con,discipline:q.d||st.d||'',system:d.sys||'',
    source:src+': '+c.title+' / Q'+(qi+1)+(q.q?' · '+String(q.q).slice(0,90):''),chapter:id,q:qi,qh:qhash(q.q),
    ch:id,qText:String(q.q||''),chosenText:j==null||j<0?'':String((q.o||[])[j]||''),rightText:String((q.o||[])[q.a]||''),   /* texts survive later option moves; field names as read by the Hull (D04) */
    reason:why||'Did not know it',note:'',at:Date.now(),auto:true});
}
function qOf(m){var c=BK[m.chapter];if(!c)return null;var qs=Q(c);if(m.qh){for(var i=0;i<qs.length;i++)if(qhash(qs[i].q)===m.qh)return {q:qs[i],i:i}}return qs[m.q]?{q:qs[m.q],i:m.q}:null}

/* ---------- option order (contract 2.2) ---------- */
function idx(n){var a=[];for(var i=0;i<n;i++)a.push(i);return a}
function fixedOrder(q){return (q.o||[]).some(function(o){return /\b(of the above|above options|options above)\b/i.test(o)})}
function permFor(store,key,q){var n=(q.o||[]).length,p=store[key];if(!p||p.length!==n)p=store[key]=fixedOrder(q)?idx(n):CT.shuffle(idx(n));return p}

/* ---------- weak points ---------- */
function weakPoints(){
  var cut=Date.now()-30*DAY,miss={};
  (CT.data.misses||[]).forEach(function(m){if(!m.chapter||(m.at||0)<cut)return;var r=rd(m.chapter);
    if(r&&r.total&&r.last===r.total&&(r.at||0)>m.at)return;                    /* aced since (t07-16) */
    miss[m.chapter]=(miss[m.chapter]||0)+1});
  var out=[],nSt=0,dnt=false;
  DP.forEach(function(d){charted(d).forEach(function(s){
    var id=cid(d,s),r=rd(id);if(chStained(id))nSt++;if(!r&&!miss[id])return;
    var why=[],sc=0,best=chScore(id),ok=chStained(id),fd=fading(id);
    if(r&&r.done&&!ok){dnt=true;sc+=4;why.push(sealBroken(d)?'did not take':'did not take · blocks the seal')}
    else if(r&&r.done&&best<1){sc+=(1-best)*3;why.push('best test '+Math.round(best*100)+'%')}
    if(miss[id]){sc+=Math.min(3,miss[id]);why.push(miss[id]+' miss'+(miss[id]===1?'':'es')+' this month')}
    if(fd){sc+=1.5;why.push('stain fading')}
    if(r&&r.tries>2&&!ok){sc+=1;why.push(r.tries+' attempts')}                  /* t07-38 */
    if(sc>0&&(!ok||best<.8||(miss[id]||0)>=2||fd))out.push({id:id,d:d,s:s,sc:sc,why:why,ok:ok,fd:fd});   /* t01-12 */
  })});
  if(nSt<3&&!dnt)return [];
  return out.sort(function(a,b){return b.sc-a.sc}).slice(0,3);
}

/* ---------- weekly dive log ---------- */
function wkStart(){return CT.look&&CT.look.week==='mon'?1:0}           /* Sunday by default (Saudi work week) */
function weekStart(t){var d=new Date(t);d.setHours(0,0,0,0);d.setDate(d.getDate()-((d.getDay()-wkStart()+7)%7));return d.getTime()}
function addDays(t,n){var d=new Date(t);d.setDate(d.getDate()+n);return d.getTime()}   /* calendar arithmetic, DST-safe (t07-26) */
function weekStats(from){
  var to=addDays(from,7),days=0,n=0,q=0,r=0,st=0;
  (CT.data.days||[]).forEach(function(x){var t=new Date(x.id+'T12:00:00').getTime();if(t>=from&&t<to&&((x.n||0)+(x.q||0))>0){days++;n+=x.n||0;q+=x.q||0;r+=x.r||0}});
  (CT.data.reads||[]).forEach(function(x){if(isCh(x.id)&&x.firstAt&&x.firstAt>=from&&x.firstAt<to)st++});
  var acc=q?r/q:null,ok=function(v){return acc==null||acc>=v};                 /* a Practice-only week is not graded on tests (t07-17) */
  var g=days>=5&&ok(.8)?'A':days>=4&&ok(.7)?'B':days>=3&&ok(.6)?'C':days>=1?'D':'F';
  return {from:from,days:days,n:n,q:q,acc:acc,st:st,g:g};
}
function firstActivity(){
  var t=Infinity;
  (CT.data.days||[]).forEach(function(x){if(((x.n||0)+(x.q||0))>0){var v=new Date(x.id+'T12:00:00').getTime();if(v<t)t=v}});
  (CT.data.reads||[]).forEach(function(x){if(isCh(x.id)){var v=x.firstAt||x.at;if(v&&v<t)t=v}});
  return t;
}
function gradeText(w){
  var n=w.st;
  return {A:'Five days down and the lamp burned clean. '+(n?'The grey pulled back from '+n+' site'+(n===1?'':'s')+' you lit.':'The grey pulled back wherever you lit it.'),
    B:'The lamp held. A few stains are thin; go back to them before they fade.',
    C:'Enough to keep the grey where it was. Not enough to push it back.',
    D:'You came down, but not often. The grey moves on the days you do not.',
    F:'No dives last week. The Host lay still and the grey spread. Come back down.'}[w.g];
}
function diveLog(){
  var ws=weekStart(Date.now()),prev=weekStats(addDays(ws,-7)),cur=weekStats(ws),fresh=firstActivity()>=ws;
  function row(w,label,g){return '<tr><td>'+label+'<br><span class="mono muted">from '+CT.fmtDate(w.from)+(w.st?' · '+w.st+' stained':'')+'</span></td><td>'+w.days+'/7</td><td>'+(w.n+w.q)+'</td><td>'+(w.q?Math.round(w.acc*100)+'%':'—')+'</td><td>'+g+'</td></tr>'}
  var G=(ST.GRADE&&ST.GRADE[voice()])||{},sig=G.sign||(relabelOn()?'—':'HALE');
  var note=fresh?(G.first||(pick('first')||{}).t||'First week on the line. Come down on five days and I will mark it when the week turns.'):(G[prev.g]||gradeText(prev));
  var so=cur.days?'<span class="mono muted" title="Grade if the week ended today">'+cur.g+' so far</span>':'…';
  return '<h3>Dive log</h3><div class="panel dlog"><div class="tw" style="border:0;margin:0"><table class="btab"><thead><tr><th>Week</th><th>Days</th><th>Answers</th><th>Right</th><th>Grade</th></tr></thead><tbody>'+
    row(prev,'Last week',fresh?'—':'<b class="grade g-'+prev.g+'">'+prev.g+'</b>')+row(cur,'This week',so)+'</tbody></table></div><p class="hale-note"><span class="mono">'+sig+'</span> '+esc(note)+'</p></div>';
}

/* ---------- transmissions on home: kept on screen and played in sequence (t02-01, t01-02) ---------- */
function motionOff(){return CT.look.motion==='off'||(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches)}
function tx(t,cls,noTime){
  var at=story().seenAt[t.id];
  return '<div class="tx from-'+t.from+(cls?' '+cls:'')+'" data-tx="'+esc(t.id||'')+'"><div class="txh"><span>'+esc(who(t.from))+'</span>'+(noTime?'':'<span class="mono">'+(at?CT.fmtTime(at):'now')+'</span>')+'</div><p>'+esc(t.t)+'</p></div>';
}
function txState(rec){
  var seen=story().seenAt,X=CT.ui.tx;
  if(!X){X=CT.ui.tx={keep:[],shown:0,at:{}}}
  rec.forEach(function(t){if(!seen[t.id]&&X.keep.indexOf(t.id)<0&&(X.old||[]).indexOf(t.id)<0)X.keep.push(t.id)});
  /* a backlog shows only the newest 6 here; the rest are marked seen and wait in the Radio log (D06 request 9) */
  if(X.keep.length>6){var cut=X.keep.length-6,drop=X.keep.slice(0,cut);X.shown=Math.max(0,X.shown-cut);X.keep=X.keep.slice(cut);X.old=(X.old||[]).concat(drop);seeLater(drop)}
  if(motionOff())X.shown=X.keep.length;
  else if(!X.shown&&X.keep.length){X.shown=1;X.at[X.keep[0]]=Date.now()}
  return X;
}
function txReveal(){
  var X=CT.ui.tx;clearTimeout(CT._txT);CT._txT=0;if(!X||sub()!==''||CT.view!=='today')return;
  if(X.shown>=X.keep.length)return;
  var id=X.keep[X.shown++];X.at[id]=Date.now();seeLater([id]);
  var el=document.querySelector('[data-tx="'+(window.CSS&&CSS.escape?CSS.escape(id):id)+'"]');
  if(el){el.hidden=false;el.classList.add('new')}
  var sk=document.querySelector('[data-act="txAll"]');if(sk&&X.shown>=X.keep.length)sk.parentNode.removeChild(sk);
  SND.static();flushSoon();
  if(X.shown<X.keep.length)CT._txT=setTimeout(txReveal,1500);
}
A.txAll=function(){var X=CT.ui.tx;if(!X)return;clearTimeout(CT._txT);X.shown=X.keep.length;seeLater(X.keep.slice());CT.render()};

/* ---------- views ---------- */
function goButton(nx){
  if(!nx)return lastSealed()?'<button class="btn primary" data-act="go" data-to="end">'+(story().endSeen?'Hear the ending again':'Hear the ending')+'</button>':'<span class="muted">Every charted stratum is stained.</span>';
  if(nx.k==='boss')return '<button class="btn primary danger-b" data-act="go" data-to="duel-'+nx.d.n+'">Face '+esc(nx.d.boss.name)+'</button>';
  var begun=(CT.data.reads||[]).some(function(r){return isCh(r.id)});
  if(story().entered.indexOf(nx.d.n)<0)return '<button class="btn primary" data-act="go" data-to="depth-'+nx.d.n+'">'+(begun?'Descend: ':'Begin the descent: ')+esc(nx.d.name)+'</button>';
  return '<button class="btn primary" data-act="go" data-to="ch-'+nx.id+'">'+(begun?'Continue: ':'Begin: ')+esc(nx.name)+'</button>';
}
function home(){
  var rec=received(),nx=nextStep(),deep=deepest(),fd=allFading(),wp=weakPoints(),op=allOptional(),post=lastSealed();
  var h='<div class="home"><div class="hmain"><div class="console"><span>BASSIET · DIVE CONSOLE</span><span>'+CT.fmtDate(Date.now())+'</span><span>Depth '+dn(deep)+'</span></div>';
  h+='<h1 class="dtitle">The descent</h1>';
  var X=txState(rec);
  if(X.keep.length){
    var byId={};rec.forEach(function(t){byId[t.id]=t});var now=Date.now();
    h+='<div class="txs" aria-live="off">'+X.keep.map(function(id,k){var t=byId[id];if(!t)return '';var show=k<X.shown,nw=show&&now-(X.at[id]||0)<1700;
      return tx(t,nw?'new':'',false).replace('<div class="tx','<div'+(show?'':' hidden')+' class="tx')}).join('')+'</div>';
    if(X.shown<X.keep.length)h+='<p style="margin:6px 0 0"><button class="linkbtn" data-act="txAll">Show all '+X.keep.length+' transmissions</button></p>';
    if(X.old&&X.old.length)h+='<p style="margin:6px 0 0"><button class="linkbtn" data-act="go" data-to="radio">'+X.old.length+' earlier transmission'+(X.old.length===1?'':'s')+' in the Radio log</button></p>';
    seeLater(X.keep.slice(0,X.shown));
    if(X.shown<X.keep.length&&!CT._txT)CT._txT=setTimeout(txReveal,1500);
  }else if(rec.length)h+='<div class="txs">'+tx(rec[rec.length-1],'',false)+'</div>';
  var hn=H().filter(function(x){return fired(x.at)}).length-story().hostSeen;
  h+='<div class="row" style="margin:14px 0 6px">'+goButton(nx)+'<button class="btn" data-act="go" data-to="radio">Radio log</button><button class="btn" data-act="go" data-to="host">Host file'+(hn>0?' · '+hn+' new':'')+'</button></div>';
  if(!(CT.data.reads||[]).some(function(r){return isCh(r.id)}))
    h+='<p class="muted loop" style="max-width:62ch">Each stratum is a chapter. Read it, then pass its 5-question stain test (60% or better) to stain it. Stain every stratum of a depth, then win the timed duel against its avatar to break the seal and go deeper. The five lamp colours (Path, Micro, Pharm, Bio, Phys) only show or hide each subject\'s callouts.</p>';
  if(fd.length&&!CT.ui.fadeSaid){CT.ui.fadeSaid=1;var fl=pick('fading');if(fl)setTimeout(function(){CT.radio(fl)},1200)}
  if(fd.length){var more=fd.length>8;
    h+='<div class="panel fadep"><b>'+(post?'The grey is coming back to '+fd.length+' strat'+(fd.length===1?'um.':'a.'):fd.length+' stain'+(fd.length===1?' is':'s are')+' fading.')+'</b> A short re-stain (3 questions) keeps '+(fd.length===1?'it':'them')+' lit.<div class="row" style="margin-top:8px">'+fd.slice(0,8).map(function(x){return '<button class="btn small" data-act="go" data-to="restain-'+x.id+'"><span class="mono">'+dn(x.d.n)+'</span> '+esc(x.s.name)+'</button>'}).join('')+'</div>'+(more?'<p class="muted" style="margin:6px 0 0;font-size:14px">and '+(fd.length-8)+' more, oldest first.</p>':'')+'</div>'}
  if(wp.length)h+='<h3>'+(post?'Where the grey could return':'Where the Pall is thickest')+'</h3><ul class="rank wp">'+wp.map(function(x){var to=x.fd?'restain-':'ch-',lab=x.fd?'Re-stain':!x.ok?'Retest':'Re-read';
    return '<li><span><b>'+esc(x.s.name)+'</b> <span class="muted">· '+esc(x.d.name)+'</span><br><span class="mono muted">'+esc(x.why.join(' · '))+'</span></span><button class="btn small" data-act="go" data-to="'+to+x.id+'">'+lab+'</button></li>'}).join('')+'</ul>';
  if(op.length)h+='<div class="panel optp"><b>New strata charted above.</b> '+(op.length===1?'It sits':'They sit')+' in depths whose seals you already broke: optional reading, nothing blocks the way down.<div class="row" style="margin-top:8px">'+op.slice(0,8).map(function(x){return '<button class="btn small" data-act="go" data-to="ch-'+x.id+'"><span class="mono">'+dn(x.d.n)+'</span> '+esc(x.s.name)+'</button>'}).join('')+'</div></div>';
  h+='<h3>The shaft</h3><ol class="shaft">'+DP.map(function(d){
    var open=isOpen(d),ch=charted(d),st=stained(d).length,broken=sealBroken(d),nst=(d.strata||[]).length,fdn=0,opn=0;
    ch.forEach(function(s){var id=cid(d,s);if(fading(id))fdn++;if(broken&&!chStained(id))opn++});
    var status=!open?'Sealed from above':!ch.length?'Uncharted':broken?'Seal broken'+(opn?' · '+opn+' new stratum'+(opn===1?'':'a'):''):allStained(d)?'The avatar waits':st+' of '+nst+' strata stained'+(ch.length<nst?' · '+(nst-ch.length)+' uncharted':'');
    if(open&&fdn)status+=' · '+fdn+' fading';
    return '<li class="'+(open?'open':'locked')+(broken?' broken':'')+(fdn?' fading':'')+'"><button class="dep" data-act="go" data-to="depth-'+d.n+'" style="--h:'+d.hue+'">'+icon(d,!open)+'<span class="dn mono">'+dn(d.n)+'</span><span class="dnm">'+esc(d.name)+'</span><span class="dst">'+status+(!open&&d.tease&&isOpen(DP[d.n-2])?'<br><span class="tease mono">'+esc(d.tease)+'</span>':'')+'</span></button></li>';
  }).join('')+'</ol></div><aside class="hrail">';
  var due=0;try{due=CT.counts().due}catch(e){}
  if(due)h+='<div class="panel duep"><b>'+due+' trail'+(due===1?'':'s')+' due</b> in Practice: Trace, Predict and Compare items whose review day has come.<div class="row" style="margin-top:8px"><button class="btn small" data-act="'+(A.startDue?'startDue':'go')+'" data-to="practice">Revisit them</button></div></div>';
  h+=diveLog();
  var yz=CT.ui.yz,anyMiss=(CT.data.misses||[]).some(function(m){return m.chapter&&BK[m.chapter]});
  if(anyMiss||yz.msg)h+='<h3>Samples topside</h3><div class="panel"><p style="margin:0 0 8px">Send missed stain-test and duel questions from the last 7 days to your Yuzu inbox as flashcards. Cards already sent are skipped. Yuzu asks before adding them.</p><div class="row"><button class="btn" data-act="toYuzu"'+(yz.busy?' disabled':'')+'>Send to Yuzu</button></div>'+(yz.msg?'<p class="muted" style="margin:8px 0 0;font-size:14px">'+esc(yz.msg)+'</p>':'')+'</div>';
  h+=lookPanel();
  h+='</aside></div>';
  var orig='';try{orig=String(CT._today()||'').replace(/^\s*<h1[^>]*>[\s\S]*?<\/h1>\s*(<p class="sub">[\s\S]*?<\/p>)?/,'')}catch(e){orig=''}
  if(orig)h+='<details class="inst"'+(CT.ui.instOpen?' open':'')+'><summary data-act="instT"><span class="h2like">Instruments</span> <span class="muted mono">ledger · coverage · Citrus</span></summary>'+orig+'</details>';
  return h;
}
A.instT=function(el,e){if(e)e.preventDefault();CT.ui.instOpen=!CT.ui.instOpen;var d=el.closest('details');if(d)d.open=CT.ui.instOpen};
function depthPage(n,notice){
  var d=DP[n-1];if(!d)return '<div class="empty">No such depth.</div>';
  var open=isOpen(d),h='<button class="btn small" data-act="go" data-to="today">The shaft</button>';
  if(notice)h+='<div class="notice" style="margin-top:12px">'+esc(notice)+'</div>';
  h+='<div class="banner">'+scene(d)+'<div class="bt"><span class="mono">DEPTH '+dn(d.n)+'</span><h1>'+esc(d.name)+'</h1></div></div>';
  if(!open){var up=DP[n-2];return h+'<div class="sealed">'+(d.tease?'<p class="mono tease">'+esc(d.tease)+'</p>':'')+'<p>The membrane above this depth is still sealed. Stain every stratum of '+esc(the(up.name))+' and defeat '+esc(the(up.boss.name))+' to break it.</p></div>'}
  if(story().entered.indexOf(n)<0)pendingEnter=n;
  h+='<p class="lore">'+esc(d.blurb)+'</p>';
  /* the depth's briefing stays here as a standing order (t02-02) */
  var br=T().filter(function(t){return t.at==='enter:'+n});
  if(br.length){h+='<div class="txs brief">'+br.map(function(t){return tx(t,'',true)}).join('')+'</div>';seeLater(br.map(function(t){return t.id}))}
  var nx=nextStep(),nextId=nx&&nx.k==='ch'&&nx.d.n===n?nx.id:null,broken=sealBroken(d);
  h+='<h3>Strata</h3><p class="muted" style="margin:-4px 0 10px;font-size:15px">Read a stratum, then pass its stain test (60%) to light it.'+(broken?' The seal is broken; strata added since are optional reading.':'')+'</p><ul class="strata">'+(d.strata||[]).map(function(s){
    var id=cid(d,s),c=BK[id];
    if(!c)return '<li class="unch"><span class="snm">'+esc(s.name)+'</span><span class="mono">Uncharted</span></li>';
    var done=chDone(id),sc=Math.round(chScore(id)*100),fd=fading(id),r=rd(id),opt=optional(d,s);
    var lab=!done?(id===nextId?'Start here · unlit':opt?'New · optional':'Unlit'):sc<60?'Stain did not take · '+sc+'%':fd?'The grey is returning · re-stain':'Stained · '+sc+'%'+(r&&r.lvl?' · held '+r.lvl+'×':'');
    return '<li><button class="srow'+(fd?' fading':'')+(id===nextId?' next':'')+(opt?' optional':'')+'" data-act="go" data-to="'+(fd?'restain-':'ch-')+id+'"><span class="snm">'+esc(s.name)+'</span><span class="mono">'+lab+'</span></button></li>';
  }).join('')+'</ul>';
  var ready=allStained(d),won=bossWon(d),bd=rd('boss-'+n);
  h+='<div class="panel boss'+(ready&&!won?' ready':'')+'"><span class="mono">AVATAR OF THE PALL</span><b>'+esc(d.boss.name)+'</b><p>'+esc(d.boss.blurb)+'</p>'+
    (won?'<p style="margin:0">Defeated'+(bd&&bd.at?' on '+CT.fmtDate(bd.at):'')+(bd&&bd.bestHull?' · best hull '+bd.bestHull:'')+'. <button class="linkbtn" data-act="go" data-to="duel-'+n+'">Duel again</button></p>':ready?'<button class="btn primary danger-b" data-act="go" data-to="duel-'+n+'">Face it</button>':'<p class="muted" style="margin:0">It waits below the last stratum. Stain every stratum to face it.</p>')+'</div>';
  h+='<div class="panel seal"><b>The seal.</b> '+(broken?'Broken. The way down is open.':charted(d).length<(d.strata||[]).length?'Some strata here are still uncharted.':ready?'Every stratum is stained. Only '+esc(the(d.boss.name))+' holds the seal now.':'Stain every stratum, then defeat '+esc(the(d.boss.name))+'.')+'</div>';
  /* sites come from this depth's own chapters, not the whole system (t01-26) */
  var ids=[];(d.strata||[]).forEach(function(s){var c=BK[cid(d,s)];(c&&c.c||[]).forEach(function(x){if(CT.concepts[x]&&ids.indexOf(x)<0)ids.push(x)})});
  var sites=ids.length?ids.map(function(x){return CT.concepts[x]}):CT.B.C.filter(function(c){return c.s===d.sys}).slice(0,16);
  if(sites.length)h+='<h3>Sites in this region</h3><div class="row">'+sites.slice(0,24).map(function(c){return '<button class="btn small" data-act="openConcept" data-id="'+c.id+'">'+esc(c.n)+'</button>'}).join('')+'</div>';
  return h;
}
function fmt(s){return esc(s).replace(/\*\*(.+?)\*\*/g,'<b>$1</b>')}
function chapter(id){
  var c=BK[id];if(!c)return '<div class="empty">This stratum is uncharted.</div>';
  var d=DP[c.depth-1];if(!d)return '<div class="empty">This stratum is uncharted.</div>';
  if(!isOpen(d)){try{history.replaceState(null,'','#depth-'+d.n)}catch(e){}CT.dsub='depth-'+d.n;return depthPage(d.n)}   /* t01-34 */
  if(story().entered.indexOf(d.n)<0)pendingEnter=d.n;                                                                  /* t02-02 safety net */
  var sts=(d.strata||[]),k=sts.findIndex(function(s){return cid(d,s)===id});
  var h='<div class="reader"><button class="btn small" data-act="go" data-to="depth-'+d.n+'">'+esc(d.name)+'</button>';
  var stt=k>=0?sts[k]:null,topic=(stt&&stt.topic)||c.topic||d.name;
  h+='<div class="banner slim">'+scene(d,90)+'<div class="bt"><span class="mono">DEPTH '+dn(d.n)+' · '+esc(topic)+'</span><h1>'+esc((stt&&stt.name)||c.title)+'</h1></div></div>';
  if(c.epi)h+='<p class="epi">'+esc(c.epi)+'</p>';
  h+='<div class="lamp" role="group" aria-label="Subject callouts shown"><span class="mono">LAMP</span>'+Object.keys(STAIN).map(function(k){return '<button class="stb st-'+k+'" data-act="stain" data-k="'+k+'" aria-pressed="'+(!!CT.ui.stains[k])+'" title="Show or hide the '+STAIN[k][1]+' callouts">'+STAIN[k][0]+' · '+STAIN[k][2]+'</button>'}).join('')+'</div>';
  (c.S||[]).forEach(function(s){
    h+='<section class="sec"><h2>'+esc(s.h)+'</h2>';
    (s.p||[]).forEach(function(p){h+='<p>'+fmt(p)+'</p>'});
    if(s.fig&&window.FIG&&FIG[s.fig]&&CT.figHTML)h+=CT.figHTML(s.fig);
    if(s.table&&s.table.cols)h+='<div class="tw" tabindex="0" role="region" aria-label="Table: '+esc(s.h)+'"><table class="btab"><thead><tr>'+s.table.cols.map(function(x){return '<th>'+esc(x)+'</th>'}).join('')+'</tr></thead><tbody>'+(s.table.rows||[]).map(function(r){return '<tr>'+r.map(function(x,ci){return '<td data-label="'+esc(s.table.cols[ci]||'')+'">'+fmt(x)+'</td>'}).join('')+'</tr>'}).join('')+'</tbody></table></div>';
    if(s.key)h+='<div class="keyp"><span class="mono">REMEMBER</span>'+fmt(s.key)+'</div>';
    (s.s||[]).forEach(function(x){if(STAIN[x[0]]&&CT.ui.stains[x[0]])h+='<div class="stain st-'+x[0]+'"><span class="mono">'+STAIN[x[0]][0].toUpperCase()+' STAIN · '+STAIN[x[0]][1]+'</span><p>'+fmt(x[1])+'</p></div>'});
    h+='</section>';
  });
  h+=quiz(id,c);
  if(c.c&&c.c.length){var cs=c.c.filter(function(x){return CT.concepts[x]});if(cs.length)h+='<h3>Sites to open in the Atlas</h3><div class="row">'+cs.map(function(x){return '<button class="btn small" data-act="openConcept" data-id="'+x+'">'+esc(CT.concepts[x].n)+'</button>'}).join('')+'</div>'}
  return h+'</div>';
}
/* chosen: null = open, -1 = timed out (answer shown), else the ORIGINAL index picked.
   order: display order of original indices. di: value for data-i. */
function qblock(q,num,chosen,act,attrs,order,di){
  var done=chosen!=null,o=q.o||[];order=order||idx(o.length);
  var h='<div class="q'+(done?' done':'')+'"><p class="qq"><span class="mono">'+num+'.</span> '+esc(q.q)+'</p><div class="opts" role="group" aria-label="Options for question '+num+'">'+order.map(function(j,pos){
    var cls='opt';if(done){if(j===q.a)cls+=' ok';else if(j===chosen)cls+=' bad'}
    var mk=done&&j===q.a?' <span class="mono res" aria-hidden="true">✓</span><span style="'+VH+'">, the answer</span>':done&&j===chosen?' <span class="mono res" aria-hidden="true">✕</span><span style="'+VH+'">, your pick</span>':'';
    return '<button class="'+cls+'" data-act="'+act+'" '+attrs+' data-i="'+di+'" data-j="'+j+'"'+(done?' disabled':'')+'><span class="mono key" aria-hidden="true">'+(pos+1)+'</span> '+esc(o[j])+mk+'</button>'}).join('')+'</div>';
  if(done)h+='<p class="qx">'+(chosen===-1?'<span class="mono" style="color:var(--bad)">TIME</span> ':'')+esc(q.x)+'</p>';
  return h+'</div>';
}
function quizState(id,c){
  var n=Q(c).length,P=CT.ui.perm[id];
  if(!P||!P.ord||P.ord.length!==n)P=CT.ui.perm[id]={ord:CT.shuffle(idx(n)),o:{}};       /* question order per attempt (t07-02) */
  return P;
}
function quiz(id,c){
  var a=CT.ui.ans[id]||(CT.ui.ans[id]={}),qs=Q(c),n=qs.length,answered=Object.keys(a).length,right=qs.filter(function(q,i){return a[i]===q.a}).length,P=quizState(id,c),sv=CT.ui.tsave[id]||{};
  var h='<section class="sec quiz" id="quiz"><h2>Stain test</h2><p class="muted">Answer all '+n+'. 60% or better stains this stratum.'+(chDone(id)?' Best so far: '+Math.round(chScore(id)*100)+'%.':'')+'</p>';
  P.ord.forEach(function(qi,k){h+=qblock(qs[qi],k+1,a[qi],'qa','data-ch="'+id+'"',permFor(P.o,qi,qs[qi]),qi)});
  if(n&&answered===n){
    var pct=Math.round(right/n*100),pass=pct>=60;
    var lab=sv.saving?'Saving…':sv.saved?(pass?'Back to the depth':'Retake the test'):(pass?'Stain this stratum':'Record and retry');
    h+='<div class="panel result '+(pass?'good':'bad')+'"><b>'+right+' of '+n+' ('+pct+'%).</b> '+(pass?'The stain takes.':'The stain did not take. Read it again and retest.')+(sv.saved?' <span class="mono muted">Recorded.</span>':sv.err?' <span class="mono" style="color:var(--bad)">Not saved yet.</span>':'')+
      '<div class="row" style="margin-top:10px"><button class="btn'+(pass?' primary':'')+'" data-act="qSave" data-ch="'+id+'"'+(sv.saving?' disabled':'')+'>'+lab+'</button></div></div>';
  }
  return h+'</section>';
}
function restain(id){
  var c=BK[id];if(!c)return '<div class="empty">Unknown stratum.</div>';
  var d=depthOf(id);if(!d||!isOpen(d))return depthPage(d?d.n:1);                    /* t07-12, t10-15 */
  if(!chStained(id))return chapter(id);
  var r=rd(id),st=CT.ui.rs[id],qs=Q(c);
  if(!st||st.done&&st.saved){st=CT.ui.rs[id]={qs:CT.shuffle(idx(qs.length)).slice(0,Math.min(3,qs.length)),a:{},perm:{},saved:false,practice:!fading(id)}}
  var n3=st.qs.length;
  var h='<div class="reader"><button class="btn small" data-act="go" data-to="depth-'+d.n+'">'+esc(d.name)+'</button><h1 class="dtitle" style="margin-top:14px">Re-stain: '+esc(sname(id))+'</h1><p class="sub">'+n3+' questions, no notes. '+(st.practice?'This stain is not fading yet, so this run is practice only: the schedule stays as it is.':'Two right keeps the stain; the next re-stain moves further out ('+FADE.join(', ')+' days).')+(r&&r.lvl?' Held '+r.lvl+' time'+(r.lvl===1?'':'s')+' so far.':'')+'</p>';
  st.qs.forEach(function(qi,k){var q=qs[qi];if(q)h+=qblock(q,k+1,st.a[k],'rsa','data-ch="'+id+'"',permFor(st.perm,k,q),k)});
  var n=Object.keys(st.a).length;
  if(n3&&n===n3){var right=st.qs.filter(function(qi,k){return qs[qi]&&st.a[k]===qs[qi].a}).length,keep=right>=Math.min(2,n3);
    h+='<div class="panel result '+(keep?'good':'bad')+'"><b>'+right+' of '+n3+'.</b> '+(st.practice?'Practice only; the schedule is unchanged.':keep?'The stain holds.':'The stain is thinning. Back tomorrow; reading the chapter helps.')+'<div class="row" style="margin-top:10px"><button class="btn primary" data-act="rsSave" data-ch="'+id+'"'+(st.saving?' disabled':'')+'>'+(st.saving?'Saving…':'Done')+'</button><button class="btn" data-act="go" data-to="ch-'+id+'">Read the chapter</button></div></div>'}
  return h+'</div>';
}

/* ---------- boss duels ---------- */
var duelT=0;
function clock(){var v=CT.look.timer;return v==='off'?0:v==='80'?80:40}
function poolFor(n){
  var d=DP[n-1],qs=[];
  if(n===DP.length){DP.forEach(function(x){var p=[];charted(x).forEach(function(s){var id=cid(x,s);Q(BK[id]).forEach(function(q,i){p.push({id:id,i:i})})});qs=qs.concat(CT.shuffle(p).slice(0,2))});return CT.shuffle(qs).slice(0,24)}
  charted(d).forEach(function(s){var id=cid(d,s);Q(BK[id]).forEach(function(q,i){qs.push({id:id,i:i})})});
  /* the avatar knows your recent misses: up to 4 of them come first (Idea 2) */
  var cut=Date.now()-30*DAY,mk={};(CT.data.misses||[]).forEach(function(m){if(m.chapter&&(m.at||0)>=cut){var x=qOf(m);if(x)mk[m.chapter+'/'+x.i]=1}});
  var sh=CT.shuffle(qs),hot=sh.filter(function(x){return mk[x.id+'/'+x.i]}).slice(0,4),rest=sh.filter(function(x){return hot.indexOf(x)<0});
  return CT.shuffle(hot.concat(rest).slice(0,12));
}
/* balance (t07-08): hp ≈ 85% of the pool (70% in the final), hull 4 (5 in the final), double strike from 5 in a row */
function startDuel(n){
  var qs=poolFor(n),fin=n===DP.length,hp=Math.max(4,Math.round(qs.length*(fin?.7:.85))),old=rd('boss-'+n)||{},tries=(old.tries||0)+1;
  CT.ui.duel={n:n,qs:qs,i:0,hull:fin?5:4,hull0:fin?5:4,hp:hp,max:hp,combo:0,best:0,right:0,asked:0,picked:null,timeout:false,wounds:[],perm:{},t0:Date.now(),over:null,saved:false,crit:false,tries:tries};
  var doc=clean(old);doc.tries=tries;doc.lastAt=Date.now();CT.setDoc('reads','boss-'+n,doc);       /* a reload mid-duel still counts the try (t07-35) */
}
function pauseDuel(){var u=CT.ui.duel;if(u&&u.qStart&&!u.over&&u.picked==null&&!u.timeout&&!u.pausedAt)u.pausedAt=Date.now()}
function resumeDuel(){var u=CT.ui.duel;if(u&&u.pausedAt){u.qStart+=Date.now()-u.pausedAt;u.pausedAt=0}}
function leftOf(u){var q=clock();if(!q)return Infinity;if(!u.qStart)return q;return Math.max(0,q-((u.pausedAt||Date.now())-u.qStart)/1000)}
function lineHTML(t){t=line(t);return t?'<p class="bline from-'+t.from+'"><span class="mono">'+esc(who(t.from))+'</span> '+esc(t.t)+'</p>':''}
function bars(u,d,n){
  var nm=d.boss.name,hp=Math.max(0,u.hp);
  return '<div class="bars"><div><span class="mono" id="hp-l">'+esc(nm.toUpperCase())+'</span><span class="hp" role="progressbar" aria-labelledby="hp-l" aria-valuemin="0" aria-valuemax="'+u.max+'" aria-valuenow="'+hp+'" aria-valuetext="'+hp+' of '+u.max+'"><i style="width:'+Math.max(0,hp/u.max*100)+'%"></i></span></div>'+
    '<div><span class="mono">HULL</span><span class="hull" role="img" aria-label="Hull '+u.hull+' of '+u.hull0+'">'+new Array(u.hull+1).join('■ ')+'<span class="lost">'+new Array(Math.max(0,u.hull0-u.hull)+1).join('□ ')+'</span></span>'+
    (u.combo>=CRIT-1&&!u.over?'<span class="mono combo">NEXT HIT STRIKES TWICE</span>':u.combo>=2?'<span class="mono combo">COMBO ×'+u.combo+'</span>':'')+'</div></div>';
}
function mmss(ms){var s=Math.max(0,Math.round(ms/1000));return Math.floor(s/60)+':'+String(s%60).padStart(2,'0')}
function duelView(n){
  var d=DP[n-1];if(!d)return depthPage(n);
  if(!isOpen(d))return depthPage(n);
  if(!allStained(d)&&!bossWon(d))return depthPage(n,'The avatar is not ready. Stain every stratum of this depth first.');
  var B=d.boss||{},fin=n===DP.length,u=CT.ui.duel,q0=clock();
  if(!u||u.n!==n){
    var bd=rd('boss-'+n),intro=lines(B.intro);
    return '<div class="reader duel-intro'+(fin?' final':'')+'"><button class="btn small" data-act="go" data-to="depth-'+n+'">'+esc(d.name)+'</button><div class="banner">'+scene(d)+'<div class="bt"><span class="mono">AVATAR OF THE PALL · DEPTH '+dn(n)+'</span><h1>'+esc(B.name)+'</h1></div></div><p class="lore">'+esc(B.blurb)+'</p>'+
      (intro.length?'<div class="txs bintro">'+intro.map(function(t){return tx(t,'',true)}).join('')+'</div>':'')+
      '<div class="panel"><p style="margin-top:0">A '+(q0?'timed ':'')+'duel drawn from every stratum of this depth'+(fin?' and every depth above it':'')+'. '+(q0?q0+' seconds a question; the clock pauses if you leave the duel or lock the phone. ':'No clock (Look and sound). ')+'A right answer wounds it; from the fifth right answer in a row, each one strikes twice. A wrong or slow answer cracks your hull; '+(fin?5:4)+' cracks and you are pushed back.</p>'+
      (bd&&bd.won?'<p class="muted" style="margin-top:0">Defeated'+(bd.at?' on '+CT.fmtDate(bd.at):'')+(bd.bestHull?' · best hull '+bd.bestHull:'')+'.</p>':'')+
      '<button class="btn primary danger-b" data-act="duelGo" data-n="'+n+'">Begin the duel</button></div></div>';
  }
  var h='<div class="reader duel'+(fin?' final':'')+'"><div class="banner slim">'+scene(d,90)+'<div class="bt"><span class="mono">DUEL · '+esc(d.name)+'</span><h1>'+esc(B.name)+'</h1></div></div>';
  h+=bars(u,d,n);
  if(u.over){
    if(u.last){var lq=Q(BK[u.last.id])[u.last.i];if(lq)h+=qblock(lq,u.i+1,u.last.j==null?-1:u.last.j,'dpick','data-n="'+n+'"',u.perm[u.i],u.i)}   /* t07-41 */
    var win=u.over==='win',bl=u.line?lineHTML(u.line):'';
    var head=win?esc(B.name)+' falls apart in the dark.':u.over==='out'?'It outlasted you.':u.over==='withdrew'?'You pull back up the shaft.':'The hull gives way. The Bassiet is pushed back.';
    var sub2=win?'The seal of '+esc(the(d.name))+' breaks.':u.over==='out'?'The hull holds, but the avatar still stands. Study the wounds below and face it again.':u.over==='withdrew'?'The avatar keeps its ground. Nothing is lost.':'Nothing is lost. Study the wounds below and face it again.';
    var stats='<p class="mono muted dstats" style="margin:8px 0 0">'+u.right+'/'+u.asked+' right · '+mmss((u.t1||Date.now())-u.t0)+' · best combo '+u.best+' · hull '+u.hull+'/'+u.hull0+(win&&u.newBest?' · new best hull':'')+'</p>';
    var btns=win?(fin?'<button class="btn primary" data-act="go" data-to="end">Hear the ending</button>':'<button class="btn primary" data-act="go" data-to="depth-'+(n+1)+'">Descend to '+dn(n+1)+'</button>')+'<button class="btn" data-act="duelGo" data-n="'+n+'">Duel again</button><button class="btn" data-act="go" data-to="today">The shaft</button>'
      :'<button class="btn primary danger-b" data-act="duelGo" data-n="'+n+'">Face it again</button><button class="btn" data-act="go" data-to="depth-'+n+'">Back to the depth</button>';
    var err=u.saveErr?'<p style="margin:8px 0 0;color:var(--bad)">The result was not saved. <button class="linkbtn" data-act="dsave" data-n="'+n+'">Save it again</button></p>':'';
    h+='<div class="panel result '+(win?'good':'bad')+'"><h2 style="margin:0 0 6px">'+head+'</h2>'+bl+'<p style="margin:0">'+sub2+'</p>'+stats+err+'<div class="row" style="margin-top:10px">'+btns+'</div></div>';
    if(u.wounds.length){h+='<h3>Wounds</h3>'+u.wounds.map(function(w){var c=BK[w.id],q=c&&Q(c)[w.i];if(!q)return '';var pk=w.j==null?'(no answer)':esc(w.pick!=null?w.pick:(q.o||[])[w.j]);
      return '<div class="q wound"><p class="qq">'+esc(q.q)+'</p><p style="margin:2px 0"><span class="mono" style="color:var(--bad)">YOU</span> '+pk+'<br><span class="mono" style="color:var(--good)">ANSWER</span> '+esc((q.o||[])[q.a])+'</p><p class="qx">'+esc(q.x)+' <button class="linkbtn" data-act="go" data-to="ch-'+w.id+'">'+esc(sname(w.id))+'</button></p></div>'}).join('')}
    return h+'</div>';
  }
  var cur=u.qs[u.i],q=Q(BK[cur.id])[cur.i],ans=u.picked!=null||u.timeout,left=leftOf(u);
  if(q0){var w=ans?0:left/q0*100,sec=Math.ceil(left);
    h+='<div class="timer'+(left<10&&!ans?' low':'')+'" id="duel-timer" role="progressbar" aria-label="Time left" aria-valuemin="0" aria-valuemax="'+q0+'" aria-valuenow="'+(ans?0:sec)+'" aria-valuetext="'+(ans?'stopped':sec+' seconds left')+'"><i style="width:'+w+'%;transition:none"></i></div>'}
  /* the source stratum is named only after answering (t07-39) */
  h+='<p class="mono muted" style="margin:6px 0 0">'+(u.i+1)+' / '+u.qs.length+(ans?' · '+esc(sname(cur.id)):'')+(u.crit&&ans&&u.picked!=null?' · <span style="color:var(--accent-text)">CRITICAL</span>':'')+'</p>';
  h+=qblock(q,u.i+1,u.timeout?-1:u.picked,'dpick','data-n="'+n+'"',permFor(u.perm,u.i,q),u.i);
  h+='<div class="row">'+(ans?'<button class="btn primary" data-act="dnext" data-n="'+n+'">'+(u.timeout?'Too slow. Next':'Next')+'</button>':'')+'<button class="linkbtn" data-act="dquit" data-n="'+n+'" style="margin-left:auto">Withdraw</button></div>';
  return h+'</div>';
}
function tickDuel(){
  clearInterval(duelT);var u=CT.ui.duel;if(!u||u.over||u.picked!=null||u.timeout)return;
  if(document.hidden){pauseDuel();return}
  var q0=clock();if(!q0)return;
  resumeDuel();u.qStart=u.qStart||Date.now();var lastS=-1;
  duelT=setInterval(function(){
    if(CT.ui.duel!==u||u.over||u.picked!=null||u.timeout){clearInterval(duelT);return}
    if(sub()!=='duel-'+u.n){clearInterval(duelT);pauseDuel();return}                  /* t07-06 */
    if(document.hidden||u.pausedAt)return;
    var el=document.querySelector('#duel-timer i'),left=leftOf(u),s=Math.ceil(left);
    if(el){el.style.width=Math.max(0,left/q0*100)+'%';if(left<10)el.parentNode.classList.add('low');
      if(s!==lastS){lastS=s;el.parentNode.setAttribute('aria-valuenow',s);el.parentNode.setAttribute('aria-valuetext',s+' seconds left')}}
    if(left<=0){clearInterval(duelT);if(u.picked==null){u.timeout=true;hit(false,null)}}
  },200);
}
function hit(ok,j){
  var u=CT.ui.duel,cur=u.qs[u.i],d=DP[u.n-1],q=Q(BK[cur.id])[cur.i]||{};CT.bumpDay(ok);u.asked++;
  u.last={id:cur.id,i:cur.i,j:j};
  if(ok){u.combo++;u.best=Math.max(u.best,u.combo);u.right++;u.crit=u.combo>=CRIT;u.hp-=u.crit?2:1;SND.good();
    liveSay('Hit'+(u.crit?', double strike':'')+'. '+d.boss.name+' '+Math.max(0,u.hp)+' of '+u.max+'.')}
  else{u.combo=0;u.crit=false;u.hull--;u.wounds.push({id:cur.id,i:cur.i,j:j,pick:j==null?null:(q.o||[])[j]});
    logMiss(cur.id,cur.i,'Duel',j==null?'Ran out of time':null,j);SND.bad();shake();
    liveSay((j==null?'Out of time. ':'Wrong. ')+'Hull '+Math.max(0,u.hull)+' of '+u.hull0+'.')}
  if(u.hp<=0)endDuel('win');else if(u.hull<=0)endDuel('lose');
  CT.render();
}
function endDuel(res){
  var u=CT.ui.duel;u.over=res;u.t1=Date.now();clearInterval(duelT);
  if(res==='win')u.hp=0;
  var d=DP[u.n-1],B=d.boss||{};
  if(!u.line)u.line=res==='win'?pickOne(B.win):(res==='lose'||res==='out')?pickOne(B.lose):null;
  if(!u.saved)saveDuel(u);
  if(res==='lose'){var t=lastSealed()?pick(['missafter','duellose','duel-lose']):pick(['duellose','duel-lose','duel_lose']);if(!t&&!u.line)t=missLine();if(t)CT.radio(t)}   /* t07-34, t02-10 */
}
function saveDuel(u){
  u.saved=true;u.saveErr=false;var old=rd('boss-'+u.n)||{},d=DP[u.n-1],was=bossWon(d),res=u.over;
  var doc=clean(old);doc.tries=Math.max(doc.tries||0,u.tries||1);doc.lastAt=Date.now();
  if(res==='win'){doc.won=true;doc.at=doc.at||Date.now();u.newBest=was&&u.hull>(doc.bestHull||0);doc.bestHull=Math.max(doc.bestHull||0,u.hull);
    var tm=(u.t1||Date.now())-u.t0;doc.bestTime=doc.bestTime?Math.min(doc.bestTime,tm):tm}
  else{doc.lostAt=Date.now()}
  return CT.setDoc('reads','boss-'+u.n,doc).then(function(ok){
    if(ok===false){u.saved=false;u.saveErr=true;CT.toast('The duel result was not saved. Tap "Save it again".','err');CT.render();return}
    if(res==='win'&&!was&&sub()!=='duel-'+u.n)CT.toast('The seal of '+the(d.name)+' breaks.');
  });
}
function shake(){var m=document.getElementById('main');if(!m||CT.look.motion==='off')return;m.classList.remove('shake');void m.offsetWidth;m.classList.add('shake')}
A.duelGo=function(el){var n=+el.dataset.n,d=DP[n-1];if(!d||!isOpen(d)||(!allStained(d)&&!bossWon(d)))return;startDuel(n);CT.render();window.scrollTo(0,0)};
A.dpick=function(el){var u=CT.ui.duel;if(!u||u.picked!=null||u.timeout||u.over)return;var cur=u.qs[u.i],j=+el.dataset.j;u.picked=j;clearInterval(duelT);hit(j===Q(BK[cur.id])[cur.i].a,j);
  var nb=document.querySelector('[data-act="dnext"]');if(nb)try{nb.focus({preventScroll:true})}catch(e){}};
A.dnext=function(){var u=CT.ui.duel;if(!u||u.over)return;if(u.picked==null&&!u.timeout)return;u.i++;u.picked=null;u.timeout=false;u.qStart=0;u.pausedAt=0;
  if(u.i>=u.qs.length){u.i--;endDuel(u.hp<=0?'win':'out')}CT.render();window.scrollTo(0,0);
  var fb=document.querySelector('[data-act="dpick"]');if(fb)try{fb.focus({preventScroll:true})}catch(e){}};
A.dquit=function(el){var u=CT.ui.duel;if(!u||u.over)return;if(!el.dataset.sure){el.dataset.sure='1';el.textContent='Withdraw? Tap again';setTimeout(function(){if(el.isConnected){delete el.dataset.sure;el.textContent='Withdraw'}},3000);return}
  clearInterval(duelT);u.last=null;endDuel('withdrew');CT.render()};
A.dsave=function(){var u=CT.ui.duel;if(u&&u.over&&!u.saved)saveDuel(u);CT.render()};

/* ---------- ending (contract 2.5) ---------- */
function ending(){
  var last=DP[DP.length-1];
  if(!last||!sealBroken(last))return '<button class="btn small" data-act="go" data-to="today">The shaft</button><div class="sealed" style="margin-top:14px"><p>Not yet. The deepest seal still holds.</p></div>';
  var L=lines(ST.END);if(!L.length)L=T().filter(function(t){return t.at==='seal:'+DP.length});
  if(!L.length)return '<button class="btn small" data-act="go" data-to="today">The shaft</button><h1 class="dtitle" style="margin-top:14px">The surface</h1><p class="lore">The lamp burns at full stain. Nothing grey is left to light.</p>';
  var i=Math.max(1,Math.min(CT.ui.endI||1,L.length));if(i>=L.length)endDone();
  var h='<div class="reader ending"><button class="btn small" data-act="go" data-to="today">The shaft</button><h1 class="dtitle" style="margin-top:14px">The surface</h1><div class="txs endseq">';
  L.slice(0,i).forEach(function(t,k){h+=tx(t,k===i-1?'new':'',true)});
  h+='</div><div class="row" style="margin-top:16px">';
  if(i<L.length)h+='<button class="btn primary" data-act="endNext">Listen</button><button class="linkbtn" data-act="endAll">Show the rest</button>';
  else h+='<button class="btn primary" data-act="go" data-to="host">Open the Host file</button><button class="btn" data-act="go" data-to="today">The shaft</button>';
  return h+'</div></div>';
}
function endLen(){var L=lines(ST.END);return L.length||T().filter(function(t){return t.at==='seal:'+DP.length}).length}
function endDone(){if(!story().endSeen){storyLater({endSeen:Date.now()});flushSoon()}}
A.endNext=function(){CT.ui.endI=(CT.ui.endI||1)+1;SND.static();if(CT.ui.endI>=endLen())endDone();CT.render()};
A.endAll=function(){CT.ui.endI=endLen();endDone();CT.render()};

/* ---------- samples to Yuzu ---------- */
function yzDoc(){var r=rd('yuzu-sent')||{};return {inbox:r.inbox||'',sent:Object.assign({},r.sent||{})}}
A.toYuzu=async function(){
  var y=CT.ui.yz;if(y.busy)return;
  var now=Date.now(),cut=now-7*DAY,latest={},cards=[],Y=yzDoc(),already=0;
  (CT.data.misses||[]).forEach(function(m){if((m.at||0)>=cut&&m.chapter&&BK[m.chapter]&&m.q!=null){var x=qOf(m);if(!x)return;var k=m.chapter+'-q'+x.i;latest[k]=Math.max(latest[k]||0,m.at||0)}});
  Object.keys(latest).forEach(function(k){
    var cardId='bassiet-'+k;if((Y.sent[cardId]||0)>=latest[k]){already++;return}
    var ch=k.replace(/-q\d+$/,''),qi=+k.slice(ch.length+2),c=BK[ch],q=Q(c)[qi];if(!q)return;var d=DP[c.depth-1]||{};
    var ord=fixedOrder(q)?idx((q.o||[]).length):seeded(idx((q.o||[]).length),parseInt(qhash(cardId),36));
    var tags=['source::Bassiet','system::'+String(d.sys||'').replace(/\s+/g,'_'),'depth::'+c.depth];if(q.d&&CT.DN&&CT.DN[q.d])tags.push('subject::'+CT.DN[q.d]);
    cards.push({id:cardId,type:'basic',front:q.q+'\n\n'+ord.map(function(j,p){return String.fromCharCode(65+p)+'. '+q.o[j]}).join('\n'),
      back:String.fromCharCode(65+ord.indexOf(q.a))+'. '+q.o[q.a]+'\n\n'+q.x,tags:tags,source:'Bassiet · '+(d.name||'')+' · '+sname(ch)});
  });
  if(!cards.length){y.msg=already?'All '+already+' missed question'+(already===1?' from the last 7 days is':'s from the last 7 days are')+' already in Yuzu.':'No missed questions with a stratum attached in the last 7 days.';CT.render();return}
  if(!CT.mcp){y.msg='Google Drive is not available in this view. Open the page in Claude with the Drive connector turned on.';CT.render();return}
  y.busy=true;y.msg='Sending '+cards.length+' card'+(cards.length===1?'':'s')+'…';CT.render();
  var S='Google Drive',stage='find';
  async function call(tool,args,retry){try{return await CT.mcp.callTool(S,tool,args,{cache:false})}catch(e){if(retry&&e&&e.retryable){await new Promise(function(r){setTimeout(r,Math.min(3000,e.retryAfterMs||900))});return await CT.mcp.callTool(S,tool,args,{cache:false})}throw e}}
  async function folders(name,parents){
    var r=await call('search_files',{query:"title = '"+name+"' and mimeType = 'application/vnd.google-apps.folder' and trashed = false",excludeContentSnippets:true,pageSize:50},true);
    var f=((r&&r.payload&&r.payload.files)||[]).filter(function(x){return x&&x.id});
    return parents?f.filter(function(x){return parents.indexOf(x.parentId)>=0}):f;
  }
  try{
    /* yuzu-data inbox by Drive id, then the new layout (Flashcards - Yuzu/collection & media/collection/inbox), then the old My Apps/Yuzu path; never created (drive-layout.md) */
    var boxId=Y.inbox,path='your Yuzu inbox';
    if(!boxId){try{boxId=await CT.driveFolder('yuzu-inbox')}catch(e){throw e&&e.code==='no_folder'?{code:'no_inbox'}:e}}
    var wk=CT.ymd(now),pid='bassiet-samples-'+wk+'-'+now.toString(36);
    var pack={yuzu_pack:1,id:pid,name:'Bassiet samples, '+CT.fmtDate(cut)+' to '+CT.fmtDate(now),category:'Medicine::Step 1::Bassiet',tags:['source::Bassiet'],source:'Bassiet (original questions)',cards:cards};
    stage='create';
    try{await call('create_file',{title:pid+'.json',parentId:boxId,textContent:JSON.stringify(pack,null,1),contentMimeType:'application/json',disableConversionToGoogleType:true},false)}
    catch(e){if(e&&(e.code==='not_found'||e.code==='invalid_argument'||e.code==='permission_denied')){Y.inbox='';CT.driveForget('yuzu-inbox');CT.setDoc('reads','yuzu-sent',{inbox:'',sent:Y.sent})}throw e}
    cards.forEach(function(c){Y.sent[c.id]=now});
    var ok=await CT.setDoc('reads','yuzu-sent',{inbox:boxId,sent:Y.sent});
    y.msg=cards.length+' new card'+(cards.length===1?'':'s')+' sent to '+path+(already?'; '+already+' already in Yuzu':'')+'. Open Yuzu to review them.'+(ok===false?' (This page could not note what was sent, so they may be offered again.)':'');
  }catch(e){var c=e&&e.code;
    y.msg=c==='no_inbox'?'Could not find the Yuzu inbox folder (Citrus/Learning/Flashcards - Yuzu/collection & media/collection/inbox, or the old My Apps/Yuzu/collection/inbox). Open Yuzu or Citrus once, then try again.':c==='approval_required'||c==='not_in_manifest'?'Allow Google Drive for this page first.':c==='server_not_connected'||c==='needs_reauth'?'Connect Google Drive in Claude settings, then try again.':
      stage==='create'&&(c==='server_unavailable'||c==='upstream_error'||c==='timeout'||!c)?'Drive did not confirm the upload; it may have saved it. Check your Yuzu inbox before sending again.':'Not sent ('+(c||'error')+'). Tap to try again.'}
  y.busy=false;CT.render();
};

/* ---------- radio log, Host file, look ---------- */
function groupOf(t){var m;if(t.at==='start')return 0;if((m=/^(enter|seal):(\d+)$/.exec(t.at)))return +m[2];if((m=/^ch:(.+)$/.exec(t.at))&&BK[m[1]])return BK[m[1]].depth;return 99}
function radioLog(){
  var rec=received(),h='<button class="btn small" data-act="go" data-to="today">The shaft</button><h1 class="dtitle" style="margin-top:14px">Radio log</h1><p class="sub">Channel 3. Every transmission the Bassiet has picked up, oldest first.'+(rec.length>4?' <button class="linkbtn" data-act="txLatest">Latest ↓</button>':'')+'</p>';
  /* oldest first, grouped by depth (t02-06, t01-29); STORY.T is written in story order */
  var g=-1,open=false;
  rec.forEach(function(t,k){var n=groupOf(t);
    if(n!==g){if(open)h+='</div>';g=n;var d=DP[n-1];h+='<h2 class="rgroup mono" style="font-size:13px;letter-spacing:.12em;margin:22px 0 8px">'+(n===0?'PROLOGUE':d?'DEPTH '+dn(n)+' · '+esc(d.name.toUpperCase()):'ELSEWHERE')+'</h2><div class="txs">';open=true}
    h+=tx(t,'',false).replace('<div class="tx','<div'+(k===rec.length-1?' id="tx-latest"':'')+' class="tx')});
  if(open)h+='</div>';
  seeLater(rec.map(function(t){return t.id}));                                      /* lines read here are seen (t02-31) */
  return h;
}
A.txLatest=function(){var el=document.getElementById('tx-latest');if(el)el.scrollIntoView({block:'center'})};
function hostFile(){
  var hs=H(),k=hs.filter(function(x){return fired(x.at)}).length;
  if(k!==story().hostSeen)storyLater({hostSeen:k});
  return '<button class="btn small" data-act="go" data-to="today">The shaft</button><h1 class="dtitle" style="margin-top:14px">Host file</h1><p class="sub">'+esc(ST.ward||'')+(ST.bed?', '+esc(ST.bed):'')+'. What the Bassiet has learned about the patient.</p><ol class="hostf">'+hs.map(function(x){var f=fired(x.at);
    return '<li class="'+(f?'':'red')+'">'+(f?esc(x.t):'<span aria-hidden="true">'+'█'.repeat(Math.max(8,Math.min(40,Math.round(String(x.t||'').length*.35))))+'</span><span style="'+VH+'">Not yet known</span>')+'</li>'}).join('')+'</ol>';
}
function lookPanel(){
  var L=CT.look;
  function seg(k,opts,cur){return '<span class="seg" role="group">'+opts.map(function(o){return '<button data-act="look" data-k="'+k+'" data-v="'+o[0]+'" aria-pressed="'+((cur!=null?cur:L[k])===o[0])+'">'+o[1]+'</button>'}).join('')+'</span>'}
  var wv=L.world==='dive'?'dive':L.theme==='light'?'light':'auto';
  return '<h3 id="look-h">Look and sound</h3><div class="panel look" id="look"><div class="frow"><span>World</span>'+seg('world',[['dive','The dive'],['light','Lights on'],['auto','Follow device']],wv)+'</div><div class="frow"><span>Text</span>'+seg('size',[['s','Small'],['n','Normal'],['l','Large']])+'</div><div class="frow"><span>Motion</span>'+seg('motion',[['on','On'],['off','Off']])+'</div><div class="frow"><span>Sound</span>'+seg('sound',[['off','Off'],['on','On']])+'</div><div class="frow"><span>Duel clock</span>'+seg('timer',[['40','40 s'],['80','80 s'],['off','Off']])+'</div><div class="frow"><span>Week starts</span>'+seg('week',[['sun','Sunday'],['mon','Monday']])+'</div><div class="frow"><span>Shortcuts</span>'+seg('keys',[['on','On'],['off','Off']])+'</div></div>';
}

/* ---------- hooks ---------- */
CT._today=CT.views.today;
CT.views.today=function(){
  BK=window.BOOK||BK;DP=window.DEPTHS||DP;ST=window.STORY||ST;
  var s=sub();
  if(s){if(s.indexOf('depth-')===0)return depthPage(+s.slice(6));if(s.indexOf('ch-')===0)return chapter(s.slice(3));if(s.indexOf('restain-')===0)return restain(s.slice(8));if(s.indexOf('duel-')===0)return duelView(+s.slice(5));if(s==='radio')return radioLog();if(s==='host')return hostFile();if(s==='end')return ending()}
  return home();
};
var baseRender=CT.render,started=false,rk=null;
CT.render=function(){
  var s=sub(),key=CT.view+'|'+s;
  if(key!==rk){                                                                       /* route changed */
    var u=CT.ui.duel;
    if(u&&u.over&&s!=='duel-'+u.n)CT.ui.duel=null;                                    /* rematch opens the intro (t07-04, t10-29) */
    else if(u&&!u.over&&s!=='duel-'+u.n)pauseDuel();
    if(rk==='today|'){CT.ui.tx=null;clearTimeout(CT._txT);CT._txT=0}                  /* left home: this visit's fresh lines settle */
    if(s!=='end')CT.ui.endI=1;
    if(/^restain-/.test(s)){var rs0=CT.ui.rs[s.slice(8)];if(rs0&&(rs0.saved||!Object.keys(rs0.a).length))delete CT.ui.rs[s.slice(8)]}   /* fresh run, schedule state read now */
    rk=key;
  }
  baseRender.apply(this,arguments);
  document.documentElement.dataset.reading=/^(ch-|restain-|duel-|end)/.test(s)?'1':'';
  if(/^duel-/.test(s)&&CT.ui.duel&&CT.ui.duel.n===+s.slice(5))tickDuel();else clearInterval(duelT);
  SND.mood(s);
  if(!CT.ui.loading&&!started){started=true;sessionStart()}
  if(rCur&&radioBlocked()){rq.unshift(rCur);var el=document.getElementById('radio');clearTimeout(rT);rCur=null;if(el)el.hidden=true;delete document.documentElement.dataset.radio;if(document.body)document.body.classList.remove('radio-on')}
  if(rq.length&&!rCur){clearTimeout(rPoll);rPoll=setTimeout(pumpRadio,400)}
  if(pendingSeen||pendingEnter||pendingStory)flushSoon();
};
function sessionStart(){
  var s=story(),now=Date.now(),d=new Date(),hr=d.getHours(),mn=d.getMinutes();
  if(s.lastVisit&&now-s.lastVisit>2*DAY)setTimeout(function(){
    var nf=allFading().length,l=T().filter(function(t){return t.at==='return'&&(nf||!/\{fading\}/.test(t.t))});
    var t=l[Math.floor(Math.random()*l.length)];if(t)CT.radio({from:t.from,t:String(t.t).replace(/\{fading\}/g,String(nf))})},1500);
  else if(hr===3&&mn>=10&&mn<=25&&pick('night317'))setTimeout(function(){CT.radio(pick('night317'))},2500);
  else if(s.endSeen&&pick('after'))setTimeout(function(){CT.radio(pick('after'))},3000);
  else if(hr<5)setTimeout(function(){CT.radio(pick('night'))},2500);
  storyLater({lastVisit:now});flushSoon();
}
/* toggling a stain keeps the section under your eye where it was (t01-40) */
A.stain=function(el){
  var k=el.dataset.k,secs=[].slice.call(document.querySelectorAll('#main .sec')),lamp=document.querySelector('.lamp'),lb=lamp?lamp.getBoundingClientRect().bottom:0,ix=-1,off=0;
  for(var i=0;i<secs.length;i++){var r=secs[i].getBoundingClientRect();if(r.bottom>lb+8){ix=i;off=r.top;break}}
  CT.ui.stains[k]=CT.ui.stains[k]?0:1;var y=window.scrollY;CT.render();window.scrollTo(0,y);
  if(ix>=0){var s2=document.querySelectorAll('#main .sec')[ix];if(s2)window.scrollBy(0,s2.getBoundingClientRect().top-off)}
  var b=document.querySelector('.stb[data-k="'+k+'"]');if(b)try{b.focus({preventScroll:true})}catch(e){}
};
function keepY(){var y=window.scrollY;CT.render();window.scrollTo(0,y)}
A.qa=function(el){
  var id=el.dataset.ch,i=+el.dataset.i,j=+el.dataset.j,c=BK[id];if(!c||!Q(c)[i])return;var a=CT.ui.ans[id]||(CT.ui.ans[id]={});
  var sv=CT.ui.tsave[id];if(sv&&(sv.saving||sv.saved))return;
  if(a[i]!=null)return;a[i]=j;var ok=j===Q(c)[i].a;CT.bumpDay(ok);
  if(!ok){if(!CT.ui.rmiss[id]){CT.ui.rmiss[id]=1;CT.radio(missLine())}logMiss(id,i,'Stain test',null,j);SND.bad()}else SND.good();   /* one radio line per test (t07-11, t01-41) */
  keepY();
  if(Object.keys(a).length===Q(c).length)saveTest(id,false);                         /* auto-save the finished test (t01-17) */
};
/* save a finished stain test; nav=true also leaves (pass) or resets for a retake (fail) */
function saveTest(id,nav){
  var c=BK[id],a=CT.ui.ans[id]||{},qs=Q(c),n=qs.length;if(!n||Object.keys(a).length<n)return;
  var sv=CT.ui.tsave[id]||(CT.ui.tsave[id]={});
  if(sv.saving){if(nav)sv.nav=true;return}
  if(sv.saved){if(nav)finishTest(id);return}
  var right=qs.filter(function(q,i){return a[i]===q.a}).length,old=rd(id),now=Date.now(),pass=right/n>=.6;
  var oldBest=old&&old.total?old.right/old.total:0,best=oldBest>right/n?{right:old.right,total:old.total}:{right:right,total:n};
  var d=DP[c.depth-1],was=chStained(id);
  var doc=Object.assign(clean(old),{done:true,right:best.right,total:best.total,last:right,at:now,tries:((old&&old.tries)||0)+1});
  if(pass&&!was){doc.firstAt=now;doc.lvl=0;doc.due=now+(right===n?7:right/n>=.8?5:3)*DAY}             /* first fade by score (t07-44) */
  else if(pass&&fading(id)){doc.due=now+FADE[Math.min(doc.lvl||0,FADE.length-1)]*DAY;doc.rechecked=now}   /* a full retest refreshes a fading stain (t07-14) */
  /* decided from local state, so the last stratum gets the right message even before the db answers (t10-37) */
  var others=charted(d).every(function(s){var x=cid(d,s);return x===id||chStained(x)}),allNow=pass&&others&&charted(d).length===(d.strata||[]).length;
  sv.saving=true;sv.err=false;sv.nav=sv.nav||nav;sv.pass=pass;sv.msg=pass?(allNow&&!bossWon(d)?'Every stratum is stained. '+d.boss.name+' stirs.':'Stratum stained.'):'Recorded. Try the test again.';
  keepY();
  CT.setDoc('reads',id,doc).then(function(ok){
    sv.saving=false;
    if(ok===false){sv.err=true;sv.nav=false;CT.toast('The test was not saved. Your answers are kept; tap the button to try again.','err');keepY();return}
    sv.saved=true;if(sv.nav)finishTest(id);else keepY();
  });
}
function finishTest(id){
  var sv=CT.ui.tsave[id]||{},c=BK[id],d=c&&DP[c.depth-1];
  delete CT.ui.ans[id];delete CT.ui.perm[id];delete CT.ui.tsave[id];delete CT.ui.rmiss[id];   /* a retake gets a new order (t07-02) */
  CT.toast(sv.msg||'Recorded.');
  if(sv.pass&&d){CT.go('depth-'+d.n)}
  else{CT.render();var qz=document.querySelector('.quiz');if(qz){var top=qz.getBoundingClientRect().top+window.scrollY-130;window.scrollTo(0,Math.max(0,top))}}   /* t01-07 */
}
A.qSave=function(el){saveTest(el.dataset.ch,true)};
A.rsa=function(el){var id=el.dataset.ch,st=CT.ui.rs[id],k=+el.dataset.i,j=+el.dataset.j;if(!st||st.saved||st.saving||st.a[k]!=null)return;var q=Q(BK[id])[st.qs[k]];if(!q)return;st.a[k]=j;var ok=j===q.a;CT.bumpDay(ok);if(!ok){logMiss(id,st.qs[k],'Re-stain',null,j);SND.bad()}else SND.good();keepY()};
A.rsSave=function(el){
  var id=el.dataset.ch,st=CT.ui.rs[id],c=BK[id],r=rd(id);if(!st||st.saved||st.saving||!c)return;
  var qs=Q(c),right=st.qs.filter(function(qi,k){return qs[qi]&&st.a[k]===qs[qi].a}).length,keep=right>=Math.min(2,st.qs.length),doc=clean(r),now=Date.now(),msg;
  if(st.practice||!fading(id)){msg='Practice only; the schedule is unchanged.'}                                        /* no farming (t07-12) */
  else if(keep){doc.lvl=Math.min(FADE.length,(doc.lvl||0)+1);doc.due=now+(doc.lvl>=FADE.length?180:FADE[doc.lvl])*DAY;msg=pick('restain')?null:'The stain holds.'}
  else{doc.lvl=Math.max(0,(doc.lvl||0)-2);doc.due=now+DAY;msg='The stain is thinning. Back tomorrow.'}                 /* t07-13 */
  doc.rechecked=now;st.saving=true;keepY();
  CT.setDoc('reads',id,doc).then(function(ok){
    st.saving=false;
    if(ok===false){CT.toast('The re-stain was not saved. Tap Done to try again.','err');keepY();return}
    st.saved=true;st.done=true;
    if(msg)CT.toast(msg);else{CT.toast('The stain holds.');CT.radio(pick('restain'))}
    CT.go('today');
  });
};

/* keyboard: 1-4 answer the duel or the first open test question on screen, Enter goes on */
document.addEventListener('keydown',function(e){
  if(e.metaKey||e.ctrlKey||e.altKey)return;var t=e.target;if(t&&t.matches&&t.matches('input,textarea,select'))return;
  if(CT.look&&CT.look.keys==='off'&&e.key!=='Enter')return;                       /* single-key shortcuts can be turned off (WCAG 2.1.4) */
  var s=sub(),dig=e.key.length===1&&'12345'.indexOf(e.key)>=0;
  if(/^(duel-|restain-|ch-)/.test(s)&&dig)e.stopImmediatePropagation();
  if(/^duel-/.test(s)){var u=CT.ui.duel;if(!u)return;
    if(dig&&e.key!=='5'&&u.picked==null&&!u.timeout&&!u.over){var b=document.querySelectorAll('[data-act="dpick"]')[+e.key-1];if(b){e.preventDefault();b.click()}}
    else if(e.key==='Enter'&&!(t&&t.matches&&t.matches('button,a'))){var nb=document.querySelector('[data-act="dnext"]');if(nb){e.preventDefault();nb.click()}}
    return;
  }
  if(/^(ch-|restain-)/.test(s)&&dig){
    var act=s.indexOf('ch-')===0?'qa':'rsa';
    var blk=[].find.call(document.querySelectorAll('.q'),function(q){if(!q.querySelector('[data-act="'+act+'"]:not([disabled])'))return false;var r=q.getBoundingClientRect();return r.bottom>0&&r.top<innerHeight});
    if(blk){var ob=blk.querySelectorAll('[data-act="'+act+'"]')[+e.key-1];if(ob){e.preventDefault();ob.click()}}
  }
},true);

/* ---------- look ---------- */
var LOOKV={world:['dive','plain'],theme:['auto','light'],size:['s','n','l'],motion:['on','off'],sound:['off','on'],timer:['40','80','off'],week:['sun','mon'],keys:['on','off']};
function loadLook(){var l={world:'dive',theme:'auto',size:'n',motion:'on',sound:'off',timer:'40',week:'sun',keys:'on'};
  try{var s=JSON.parse(localStorage.getItem('bassiet-look')||'{}');if(s&&typeof s==='object')Object.keys(LOOKV).forEach(function(k){if(LOOKV[k].indexOf(String(s[k]))>=0)l[k]=String(s[k])})}catch(e){}   /* t10-38 */
  return l}
CT.look=loadLook();
function applyLook(){var r=document.documentElement;r.dataset.world=CT.look.world;r.dataset.size=CT.look.size;r.dataset.motion=CT.look.motion;
  if(CT.look.world==='plain'&&CT.look.theme==='light')r.dataset.theme='light';else if(r.dataset.theme==='light'&&CT._lookTheme)delete r.dataset.theme;
  CT._lookTheme=r.dataset.theme==='light'}
applyLook();
A.look=function(el){var k=el.dataset.k,v=el.dataset.v;
  if(k==='world'){if(v==='dive')CT.look.world='dive';else{CT.look.world='plain';CT.look.theme=v==='light'?'light':'auto'}}
  else if(LOOKV[k]&&LOOKV[k].indexOf(v)>=0)CT.look[k]=v;
  try{localStorage.setItem('bassiet-look',JSON.stringify(CT.look))}catch(e){}applyLook();if(k==='sound')SND.toggle();if(k==='motion'){kick()}
  var y=window.scrollY;CT.render();window.scrollTo(0,y)};

/* ---------- sound: WebAudio only, no files ---------- */
var SND=(function(){
  var ac=null,master=null,amb=null,beatT=0,mood='';
  function on(){return CT.look.sound==='on'}
  function ensure(){if(ac)return true;try{ac=new (window.AudioContext||window.webkitAudioContext)();master=ac.createGain();master.gain.value=.5;master.connect(ac.destination);return true}catch(e){return false}}
  function live(){return ac&&ac.state==='running'&&!document.hidden}
  function tone(f,d,type,g,slide){if(!on()||!ensure()||document.hidden)return;var o=ac.createOscillator(),v=ac.createGain(),t=ac.currentTime;o.type=type||'sine';o.frequency.setValueAtTime(f,t);if(slide)o.frequency.exponentialRampToValueAtTime(slide,t+d);v.gain.setValueAtTime(g||.2,t);v.gain.exponentialRampToValueAtTime(.0001,t+d);o.connect(v);v.connect(master);o.start(t);o.stop(t+d+.02)}
  function noise(d,g,lo,hi){if(!on()||!ensure()||document.hidden)return;var n=ac.sampleRate*d,b=ac.createBuffer(1,n,ac.sampleRate),x=b.getChannelData(0);for(var i=0;i<n;i++)x[i]=(Math.random()*2-1)*(1-i/n);var s=ac.createBufferSource(),f=ac.createBiquadFilter(),v=ac.createGain();s.buffer=b;f.type='bandpass';f.frequency.value=(lo+hi)/2;f.Q.value=.8;v.gain.value=g;s.connect(f);f.connect(v);v.connect(master);s.start()}
  function startAmb(){
    if(amb||!on()||!ensure())return;
    var g=ac.createGain();g.gain.value=0;g.gain.linearRampToValueAtTime(.12,ac.currentTime+3);
    var lp=ac.createBiquadFilter();lp.type='lowpass';lp.frequency.value=260;
    var o1=ac.createOscillator(),o2=ac.createOscillator(),lfo=ac.createOscillator(),lg=ac.createGain();
    o1.type='sawtooth';o1.frequency.value=41;o2.type='sawtooth';o2.frequency.value=41.6;lfo.frequency.value=.07;lg.gain.value=120;
    lfo.connect(lg);lg.connect(lp.frequency);o1.connect(lp);o2.connect(lp);lp.connect(g);g.connect(master);o1.start();o2.start();lfo.start();
    amb={g:g,o:[o1,o2,lfo]};
    beat();
  }
  /* no beats are queued while hidden or suspended, so nothing stacks up on return (t10-11) */
  function beat(){clearTimeout(beatT);if(!amb)return;var fast=mood==='duel';if(!live()){beatT=setTimeout(beat,1150);return}tone(52,.18,'sine',.5,38);setTimeout(function(){if(live())tone(46,.16,'sine',.35,34)},fast?180:240);beatT=setTimeout(beat,fast?620:1150)}
  function stopAmb(){if(!amb)return;var a=amb;amb=null;clearTimeout(beatT);try{a.g.gain.linearRampToValueAtTime(0,ac.currentTime+.6);setTimeout(function(){a.o.forEach(function(o){try{o.stop()}catch(e){}})},700)}catch(e){}}
  document.addEventListener('visibilitychange',function(){if(!ac)return;if(document.hidden)ac.suspend();else if(on())ac.resume()});
  document.addEventListener('pointerdown',function(){if(on()){ensure();if(ac.state==='suspended')ac.resume();startAmb()}},true);
  return {
    toggle:function(){if(on()){ensure();if(ac.state==='suspended')ac.resume();startAmb()}else stopAmb()},
    good:function(){tone(660,.12,'square',.06);setTimeout(function(){tone(990,.14,'square',.05)},90)},
    bad:function(){tone(110,.35,'sawtooth',.12,70)},
    static:function(){noise(.45,.18,800,3200)},
    mood:function(s){mood=/^duel-/.test(s)?'duel':''}
  };
})();

/* duel clock pauses while the page is hidden (t10-09) */
document.addEventListener('visibilitychange',function(){
  if(document.hidden){pauseDuel();clearInterval(duelT)}
  else{var s=sub(),u=CT.ui.duel;if(u&&/^duel-/.test(s)&&u.n===+s.slice(5))tickDuel()}
});

/* ---------- Pall drift: 30 fps cap, stops after a minute without input (t10-10, t10-39) ---------- */
var cv=document.getElementById('pall'),cx=cv&&cv.getContext&&cv.getContext('2d'),parts=[],raf=0,idleT=0,lastF=0,lastInput=Date.now(),lastW=0;
var RM=window.matchMedia?matchMedia('(prefers-reduced-motion: reduce)'):{matches:false};
function sizeCv(){if(!cv)return;cv.width=innerWidth;cv.height=innerHeight}
function seed(){parts=[];for(var i=0;i<46;i++)parts.push({x:Math.random()*innerWidth,y:Math.random()*innerHeight,s:2+Math.floor(Math.random()*3),vx:(Math.random()-.5)*.24,vy:-.1-Math.random()*.3,c:'rgba(150,150,140,'+(.15+Math.random()*.35).toFixed(2)+')'})}
function want(){return CT.look.world==='dive'&&CT.look.motion==='on'&&!document.hidden&&document.documentElement.dataset.reading!=='1'&&!RM.matches}
function kick(){if(cx&&!raf){clearTimeout(idleT);idleT=0;raf=requestAnimationFrame(tick)}}
function tick(ts){
  raf=0;if(!cx)return;
  if(!want()){cx.clearRect(0,0,cv.width,cv.height);if(!document.hidden){clearTimeout(idleT);idleT=setTimeout(kick,1000)}return}
  if(Date.now()-lastInput>60000)return;                        /* idle: freeze the last frame until the next input */
  if(ts-lastF<33){raf=requestAnimationFrame(tick);return}
  lastF=ts;cx.clearRect(0,0,cv.width,cv.height);
  var W=innerWidth,Hh=innerHeight;
  for(var i=0;i<parts.length;i++){var p=parts[i];p.x+=p.vx;p.y+=p.vy;if(p.y<-5){p.y=Hh+5;p.x=Math.random()*W}if(p.x<-5)p.x=W+5;if(p.x>W+5)p.x=-5;cx.fillStyle=p.c;cx.fillRect(Math.round(p.x),Math.round(p.y),p.s,p.s)}
  raf=requestAnimationFrame(tick);
}
if(cv&&cx){
  sizeCv();seed();lastW=innerWidth;
  addEventListener('resize',function(){sizeCv();if(innerWidth!==lastW){lastW=innerWidth;seed()}kick()});
  ['pointerdown','keydown','scroll','touchstart'].forEach(function(t){addEventListener(t,function(){lastInput=Date.now();kick()},{passive:true,capture:true})});
  document.addEventListener('visibilitychange',function(){if(!document.hidden)kick()});
  if(RM.addEventListener)RM.addEventListener('change',kick);
  raf=requestAnimationFrame(tick);
}
})();
