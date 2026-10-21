// ================= level flow
function maxUnlocked(){let m=0;for(let i=0;i<LEVELS.length;i++)if(SAVE.stars[i]>0)m=i+1;return Math.min(m,LEVELS.length-1)}
const isUnlocked=i=>i<=maxUnlocked()||QS.has('all');
const seasonUnlocked=s=>isUnlocked(s*6);
function clearField(){BF=[];BEES=[];PARTS=[];LBL=[];BANNERS=[];for(const f of FLW)f.occ=null}
function startLevel(i){A();endless=false;LVi=i;LV=Object.assign({},LEVELS[i]);cards=LV.cards.map(c=>Object.assign({},c,{got:0,done:false}));ci=0;timeLeft=LV.time;score=0;streak=0;bestStreak=0;combos=0;maxCombo=0;wrongs=0;catches=0;rareCaught=0;
 layoutHUD();buildWorld(LV.season);MUS.season=LV.season;clearField();netReset();spawnT=0;rareT=RR(10,20);beeT=RR(6,10);levelT=0;
 const n0=Math.ceil(LV.n*.6);for(let k=0;k<n0;k++){const b=newBF(pickSpecies(),{x:RR(40,W-40),y:RR(HUD.playTop+30,HUD.fieldBot-60)});BF.push(b)}
 state='intro';paused=false;introT=0;result=null;syncButtons()}
function endlessPool(){const m=Math.max(5,maxUnlocked());return[...new Set(LEVELS.filter((L,i)=>i<=m).flatMap(L=>L.pool))]}
const FCOMBOS=['col=blue,spot=orange','col=black,f=tails','col=orange,f=eyespots','col=brown,f=eyespots','col=black,band=red','col=white,f=stripes','col=yellow,f=tails','col=orange,spot=white','col=black,spot=orange','col=white,spot=black','col=green,f=tails','col=yellow,spot=black','col=orange,f=hindline','f=clear'];
function randomCard(){const pool=LV.pool,d=Math.min(1,endlessN/12);const n=3+Math.floor(R()*(2+d*2));
 for(let tries=0;tries<40;tries++){const r=R();let cd;
  if(r<.3)cd=parseCard('S:'+PICK(pool)+':'+n);
  else if(r<.5+d*.2){const withLk=pool.filter(k=>(SP[k].lk||[]).some(q=>pool.includes(q)));cd=parseCard('M:'+PICK(withLk.length&&R()<.5+d*.4?withLk:pool)+':'+n)}
  else if(r<.75)cd=parseCard('C:'+PICK(['orange','blue','yellow','white','black','brown','green','red'])+':'+(n+1));
  else cd=parseCard('F:'+PICK(FCOMBOS)+':'+n);
  if(pool.some(k=>cardMatch(cd,k)))return cd}
 return parseCard('S:'+PICK(pool)+':3')}
function startEndless(){A();endless=true;endlessN=0;LVi=-1;const pool=endlessPool();const s=Math.min(4,Math.floor(maxUnlocked()/6));
 LV={i:-1,season:s,pool,n:10,bees:1,cards:[],time:60,spd:.9,flap:1,dart:.04,wary:.2,land:.6,match:.45,rare:.05,tot:0};cards=[];cards.push(randomCard());ci=0;timeLeft=60;score=0;streak=0;bestStreak=0;combos=0;maxCombo=0;wrongs=0;catches=0;rareCaught=0;
 layoutHUD();buildWorld(s);MUS.season=s;clearField();netReset();spawnT=0;rareT=RR(10,20);beeT=6;
 for(let k=0;k<6;k++)BF.push(newBF(pickSpecies(),{x:RR(40,W-40),y:RR(HUD.playTop+30,HUD.fieldBot-60)}));state='intro';paused=false;result=null;syncButtons()}
function endlessRamp(){if(!endless)return;const d=Math.min(1,endlessN/14);LV.n=10+Math.round(d*10);LV.spd=.9+d*.7;LV.flap=1+d*.35;LV.dart=.04+d*.18;LV.wary=.2+d*.6;LV.match=.45-d*.12;LV.bees=1+Math.round(d*2)}
function goPlay(){state='play';SFX.click();banner(endless?'Meadow Marathon — GO!':'Level '+(LVi+1)+' — GO!','#fff','rgba(46,125,50,.94)',1.1);syncButtons()}
function stars3(){const base=LV.tot*100;return score>=base*2.3?3:score>=base*1.6?2:1}
function winLevel(){if(state!=='play')return;if(NET.mode!=='idle'){NET.mode='idle';NET.active=false;resolveSwing();NET.caught=[];NET.cool=netDef().cool}const tb=Math.round(timeLeft)*10;score+=tb;const st=stars3();const prevBest=SAVE.best[LVi]||0,prevStars=SAVE.stars[LVi]||0,tsBefore=totalStars();
 SAVE.best[LVi]=Math.max(prevBest,score);SAVE.stars[LVi]=Math.max(prevStars,st);SAVE.total=(SAVE.total||0)+score;save();
 result={win:true,stars:st,tb,score,newBest:score>prevBest,unlockedNext:LVi<29&&prevStars===0,netUnlock:NETS.findIndex((n,i)=>i>0&&totalStars()>=n.need&&tsBefore<n.need),t:0};
 if(result.netUnlock<0)result.netUnlock=null;state='result';SFX.clear();sparkle(W/2,H*.4,60,['#ffe060','#ff80c0','#80e0ff','#fff'],200,1.4);LBL=[];syncButtons()}
function loseLevel(){const prev=endless?SAVE.endless||0:SAVE.best[LVi]||0;if(endless){SAVE.endless=Math.max(prev,score)}save();result={win:false,endless,score,newBest:endless&&score>prev,t:0};state='result';SFX[endless?'clear':'fail']();LBL=[];syncButtons()}
function togglePause(force){if(state!=='play'&&state!=='intro')return;paused=force!=null?force:!paused;$('pause').textContent=paused?'▶':'⏸';if(paused)NET.press=null;syncButtons()}
function syncButtons(){$('pause').style.display=(state==='play'||state==='intro')?'block':'none';$('mute').style.display='block';$('help').style.display='block';$('pause').textContent=paused?'▶':'⏸'}
function openHelp(){if(state==='play'||state==='intro')togglePause(true);const tips=SPK.filter(k=>!SP[k].rare&&SP[k].lk&&SP[k].lk.length).map(k=>'<li><b>'+SP[k].n+'</b>: '+SP[k].tip+'</li>').join('');
 $('ptext').innerHTML='<h2>🦋 How to Play</h2><ul><li><b>Tap</b> to swing your net through that spot. <b>Swipe</b> to sweep it along your finger.</li><li>The <b>card</b> at the top shows what to catch. Fill every card before the timer runs out.</li><li><b>Wrong butterfly?</b> It escapes and costs <b>3 seconds</b> and 50 points.</li><li>Catch 2+ matching butterflies in <b>one swing</b> for a <b>COMBO</b> bonus.</li><li>Good swings in a row build your <b>streak</b> (up to ×3 points).</li><li>Butterflies <b>land on flowers</b> — that’s your chance!</li><li>🐝 <b>Bees sting</b>: −4 seconds and your net is stunned.</li><li>✨ <b>Rare butterflies</b> sparkle gold: +500 points and +5 seconds.</li><li>Earn ⭐ to unlock new seasons and better nets.</li></ul><h3>Tricky look-alikes</h3><ul>'+tips+'</ul><p style="text-align:center;color:#888;font-size:12px">A Peter’s Arcade game</p>';$('panel').style.display='flex'}
$('pclose').onclick=()=>{$('panel').style.display='none';SFX.click()};$('help').onclick=()=>{A();SFX.click();openHelp()};$('pause').onclick=()=>{A();SFX.click();togglePause()};$('mute').onclick=()=>{A();setMute(!muted);SFX.click()};
['pointerdown','touchstart'].forEach(ev=>document.querySelectorAll('.tb,#panel').forEach(e=>e.addEventListener(ev,x=>x.stopPropagation(),{passive:true})));
document.addEventListener('visibilitychange',()=>{if(document.hidden){if(state==='play'||state==='intro')togglePause(true);if(ac&&ac.state==='running')ac.suspend()}else if(ac&&!muted)ac.resume()});
addEventListener('pagehide',()=>{if(state==='play')togglePause(true)});addEventListener('blur',()=>{if(state==='play'&&!QS.has('nopause'))togglePause(true)});
// ---------- update
let titleT=0;
function update(dt){GT+=dt;updWorld(dt,GT);musicUpdate(dt);updParts(dt);cardPop=Math.max(0,cardPop-dt*3);cardSlide=Math.max(0,cardSlide-dt*2.5);shake=Math.max(0,shake-dt);
 if(state==='title'||state==='map'||state==='journal'||state==='nets'){titleT+=dt;if(!HUD.playTop)layoutHUD();const live=BF.filter(b=>b.st==='fly'||b.st==='leave').length;if(live<7&&R()<dt*2){const pool=SPK.filter(k=>!SP[k].rare&&(SAVE.journal[k]||['monarch','bluemorpho','tigerswallow','paintedlady','lunamoth','peacock','cabbagewhite'].includes(k)));BF.push(newBF(PICK(pool)))}
  for(const b of BF)updBF(b,dt);BF=BF.filter(b=>!b.dead);updLabels(dt);return}
 if(state==='intro'){introT+=dt;spawnLogic(dt);for(const b of BF)updBF(b,dt);BF=BF.filter(b=>!b.dead);updNet(dt);return}
 if(state==='play'){levelT+=dt;const before=Math.ceil(timeLeft);timeLeft-=dt;if(timeLeft<=10&&Math.ceil(timeLeft)<before&&timeLeft>0)SFX.tick();
  if(endless)endlessRamp();spawnLogic(dt);updNet(dt);for(const b of BF)updBF(b,dt);for(const e of BEES)updBee(e,dt);BF=BF.filter(b=>!b.dead);BEES=BEES.filter(e=>!e.dead);updLabels(dt);
  if(timeLeft<=0&&state==='play'){timeLeft=0;loseLevel()}return}
 if(state==='result'){result.t+=dt;for(const b of BF)if(b.st!=='caught')updBF(b,dt);for(const e of BEES)updBee(e,dt);BF=BF.filter(b=>!b.dead&&b.st!=='caught');updNet(dt);
  if(result.win){for(let i=1;i<=result.stars;i++)if(result.t-dt<.35+i*.35&&result.t>=.35+i*.35){SFX.star(i);sparkle(W/2+(i-2)*60,modal?modal.y+90:H/2,16,['#ffe060','#fff'],90,.7)}}}}
// ---------- input
function toL(e){return[e.clientX/SC,e.clientY/SC]}
c.addEventListener('pointerdown',e=>{e.preventDefault();A();if($('panel').style.display==='flex')return;const [x,y]=toL(e);
 for(let i=menuBtns.length-1;i>=0;i--){const b=menuBtns[i];if(x>=b.x&&x<=b.x+b.w&&y>=b.y&&y<=b.y+b.h){if(b.dis){tone(200,.06,'square',.04);return}SFX.click();b.fn();return}}
 if(state==='play'&&!paused)netPress(x,y,e.pointerId);else if(state==='title'||state==='map'||state==='journal'||state==='nets'){/* little sparkle for fun */sparkle(x,y,6,['#fff','#ffe060'],40,.4)}},{passive:false});
c.addEventListener('pointermove',e=>{if(state!=='play'||paused)return;const [x,y]=toL(e);netMove(x,y,e.pointerId)});
['pointerup','pointercancel'].forEach(ev=>c.addEventListener(ev,e=>{netRelease(e.pointerId)}));
addEventListener('keydown',e=>{if(e.key==='p'||e.key==='Escape')togglePause();if(e.key==='m')setMute(!muted);if(e.key==='Enter'&&state==='intro'&&!paused)goPlay()});
