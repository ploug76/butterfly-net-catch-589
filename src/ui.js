// ================= rendering + screens
let UIR=[];const reg=(k,grp,r)=>{UIR.push({k,grp,x:r.x,y:r.y,w:r.w,h:r.h});return r};
const FONT='"Trebuchet MS","Segoe UI",system-ui,sans-serif';
function rrect(x,X,Y,w,h,r){x.beginPath();x.moveTo(X+r,Y);x.arcTo(X+w,Y,X+w,Y+h,r);x.arcTo(X+w,Y+h,X,Y+h,r);x.arcTo(X,Y+h,X,Y,r);x.arcTo(X,Y,X+w,Y,r);x.closePath()}
function txt(s,x,y,size,col='#fff',al='center',wt='bold',outline=null,ow=3){g.font=wt+' '+size+'px '+FONT;g.textAlign=al;g.textBaseline='middle';if(outline){g.lineJoin='round';g.strokeStyle=outline;g.lineWidth=ow;g.strokeText(s,x,y)}g.fillStyle=col;g.fillText(s,x,y)}
function fitSize(s,maxW,size,wt='bold'){g.font=wt+' '+size+'px '+FONT;let w=g.measureText(s).width;while(w>maxW&&size>9){size-=1;g.font=wt+' '+size+'px '+FONT;w=g.measureText(s).width}return size}
function wrap(s,maxW,size,wt='bold'){g.font=wt+' '+size+'px '+FONT;const out=[];let cur='';for(const w of s.split(' ')){const t=cur?cur+' '+w:w;if(g.measureText(t).width>maxW&&cur){out.push(cur);cur=w}else cur=t}if(cur)out.push(cur);return out}
function panel(x,y,w,h,border='#4caf50',fill='#fffdf3'){g.save();g.shadowColor='rgba(0,0,0,.35)';g.shadowBlur=14;g.shadowOffsetY=4;rrect(g,x,y,w,h,16);g.fillStyle=fill;g.fill();g.restore();rrect(g,x,y,w,h,16);g.lineWidth=4;g.strokeStyle=border;g.stroke()}
function btn(x,y,w,h,label,fn,o={}){const dis=!!o.dis;const col=dis?'#9aa49a':o.col||'#43a047';g.save();g.shadowColor='rgba(0,0,0,.3)';g.shadowBlur=6;g.shadowOffsetY=3;rrect(g,x,y,w,h,Math.min(h/2,18));g.fillStyle=col;g.fill();g.restore();
 const gr=g.createLinearGradient(0,y,0,y+h);gr.addColorStop(0,'rgba(255,255,255,.35)');gr.addColorStop(.5,'rgba(255,255,255,0)');rrect(g,x,y,w,h,Math.min(h/2,18));g.fillStyle=gr;g.fill();g.lineWidth=3;g.strokeStyle='#fff';g.stroke();
 const fs=fitSize(label,w-16,o.size||(h>50?22:17));txt(label,x+w/2,y+h/2+(o.sub?-7:1),fs,'#fff','center','bold','rgba(0,0,0,.3)',3);if(o.sub)txt(o.sub,x+w/2,y+h/2+12,fitSize(o.sub,w-12,11),'rgba(255,255,255,.92)','center','bold');
 const b={x,y,w,h,fn,dis,label};menuBtns.push(b);reg('btn:'+label,'btn',b);return b}
// ---------- pictograms for colour / feature cards
function drawSil(x,cx,cy,u,cd){const conds=cd.t==='C'?[['col',cd.col]]:cd.conds;const col=(conds.find(z=>z[0]==='col')||[0,null])[1];const f=conds.filter(z=>z[0]!=='col');
 const shape=f.some(z=>z[1]==='tails')?'swallow':f.some(z=>z[1]==='long')?'long':'std';const sh=SHAPES[shape];const fill=col?COLSW[col]:'#d8d0c0';
 x.save();x.translate(cx,cy+u*.05);for(const sd of [1,-1]){x.save();x.scale(sd*u,u);for(const d of [sh.hw,sh.fw]){pathOf(x,d);x.fillStyle=fill;x.fill();x.lineWidth=.05;x.strokeStyle=col==='black'?'#555':'#2a2a2a';x.stroke()}
  x.save();pathOf(x,sh.hw);pathOf(x,sh.fw);x.clip();
  for(const [a,b] of f){if(a==='spot'){x.fillStyle=COLSW[b]||b;for(const p of [[.6,-.5],[.75,-.36],[.48,.4],[.36,.56]]){x.beginPath();x.arc(p[0],p[1],.08,0,TAU);x.fill()}}
   if(b==='eyespots'){for(const p of [[.62,-.45,.14],[.46,.4,.16]]){x.fillStyle='#ffe080';x.beginPath();x.arc(p[0],p[1],p[2],0,TAU);x.fill();x.fillStyle='#111';x.beginPath();x.arc(p[0],p[1],p[2]*.65,0,TAU);x.fill();x.fillStyle='#6a8aff';x.beginPath();x.arc(p[0],p[1],p[2]*.3,0,TAU);x.fill()}}
   if(b==='stripes'){x.strokeStyle='#111';x.lineWidth=.08;for(const s of [[.25,-.55,.15,0],[.5,-.72,.35,0],[.75,-.8,.55,-.05]]){x.beginPath();x.moveTo(s[0],s[1]);x.lineTo(s[2],s[3]);x.stroke()}}
   if(a==='band'){x.strokeStyle=COLSW[b]||b;x.lineWidth=.14;x.beginPath();x.moveTo(.26,-.62);x.quadraticCurveTo(.5,-.36,.72,-.06);x.stroke()}
   if(b==='hindline'){x.strokeStyle='#111';x.lineWidth=.08;x.beginPath();x.moveTo(.1,.06);x.bezierCurveTo(.5,.08,.66,.36,.4,.62);x.stroke()}
   if(b==='clear'){x.fillStyle='rgba(255,255,255,.55)';x.fillRect(-.1,-1,1.4,2.4);x.strokeStyle='#3a2216';x.lineWidth=.12;pathOf(x,sh.fw);x.stroke();pathOf(x,sh.hw);x.stroke()}}
  x.restore();x.restore()}
 x.fillStyle='#1c1712';x.beginPath();x.ellipse(0,u*.36,u*.05,u*.3,0,0,TAU);x.fill();x.beginPath();x.arc(0,-u*.15,u*.07,0,TAU);x.fill();x.restore()}
function drawCardIcon(cd,cx,cy,u){if(cd.t==='S'||cd.t==='M'){drawBfly(g,cd.k,cx,cy+2,u,.88+.12*Math.sin(RT*3),0)}else drawSil(g,cx,cy,u*.95,cd)}
// ---------- HUD
function drawHUD(){const sc=HUD.score,tm=HUD.timer,cd=HUD.card;reg('score','hud',sc);reg('timer','hud',tm);reg('card','hud',cd);
 rrect(g,sc.x,sc.y,sc.w,sc.h,18);g.fillStyle='rgba(20,50,20,.62)';g.fill();g.lineWidth=2;g.strokeStyle='#fff';g.stroke();
 txt(endless?'Marathon':'Level '+(LVi+1),sc.x+12,sc.y+10,10,'#cfe8c0','left');txt('★ '+score.toLocaleString(),sc.x+12,sc.y+24,fitSize('★ '+score.toLocaleString(),sc.w-20,17),'#ffe680','left');
 const low=timeLeft<=10;const pul=low?.5+.5*Math.sin(RT*10):0;rrect(g,tm.x,tm.y,tm.w,tm.h,18);g.fillStyle=low?'rgba('+(160+pul*60|0)+',30,30,.85)':'rgba(20,50,20,.62)';g.fill();g.strokeStyle='#fff';g.lineWidth=2;g.stroke();
 const tt=Math.ceil(timeLeft);const ts=(tt>=60?Math.floor(tt/60)+':'+String(tt%60).padStart(2,'0'):tt+'s');txt('⏱ '+ts,tm.x+tm.w/2,tm.y+tm.h/2+1,fitSize('⏱ '+ts,tm.w-12,17),'#fff');
 // target card
 const c0=curCard();if(!c0)return;panel(cd.x,cd.y,cd.w,cd.h,c0.t==='M'?'#8e24aa':'#43a047');
 g.save();rrect(g,cd.x+3,cd.y+3,cd.w-6,cd.h-6,13);g.clip();const sl=cardSlide>0?EASE.out(1-cardSlide):1;const off=(1-sl)*cd.w;g.translate(off,0);
 const pop=1+cardPop*.25;g.save();g.translate(cd.x+38,cd.y+cd.h/2);g.scale(pop,pop);g.fillStyle=c0.t==='M'?'#f3e5f5':'#e8f5e9';g.beginPath();g.arc(0,0,27,0,TAU);g.fill();drawCardIcon(c0,0,0,22);
 if(c0.t==='M'){g.fillStyle='#8e24aa';g.beginPath();g.arc(19,-19,9,0,TAU);g.fill();txt('?',19,-18,13,'#fff')}g.restore();
 const tx=cd.x+74,tw=cd.w-74-58;const title=cardTitle(c0);let fs=15;let lines=wrap(title,tw,fs);while(lines.length>2&&fs>10){fs--;lines=wrap(title,tw,fs)}
 lines.slice(0,2).forEach((l,i)=>txt(l,tx,cd.y+(lines.length>1?15:20)+i*(fs+2),fs,'#203020','left'));
 // progress pips
 const n=c0.n,cnt=Math.min(c0.got,n)+'/'+n+' caught';g.font='bold 12px '+FONT;const cw2=g.measureText(cnt).width+8;const pr=Math.min(7,Math.max(4,((tw-cw2)/n-4)/2));for(let i=0;i<n;i++){const px=tx+pr+i*(pr*2+4),py=cd.y+cd.h-15;g.beginPath();g.arc(px,py,pr,0,TAU);if(i<c0.got){g.fillStyle='#43a047';g.fill();txt('✓',px,py+1,pr*1.5,'#fff')}else{g.fillStyle='#e0e0d8';g.fill();g.strokeStyle='#9a9a90';g.lineWidth=1;g.stroke()}}
 txt(cnt,tx+n*(pr*2+4)+4,cd.y+cd.h-14,fitSize(cnt,Math.max(30,tw-n*(pr*2+4)-4),12),'#2e7d32','left');
 const rx=cd.x+cd.w-30;const ct=endless?'Card #'+(ci+1):'Card '+(ci+1)+'/'+cards.length;txt(ct,rx,cd.y+18,fitSize(ct,54,12),'#557055');if(streak>0){const m=1+Math.min(streak,8)*.25;txt('🔥×'+m.toFixed(m%1?2:0).replace(/0$/,''),rx,cd.y+cd.h-17,fitSize('🔥×'+m,52,13),'#e65100')}
 g.restore()}
function drawLabels(){for(const l of LBL){reg('lbl','lbl',l);const k=l.t/l.life;const a=k<.75?1:1-(k-.75)/.25;const s=k<.12?.6+.4*EASE.back(k/.12):1;g.save();g.globalAlpha=a;g.translate(l.x+l.w/2,l.y+l.h/2);g.scale(s,s);rrect(g,-l.w/2,-l.h/2,l.w,l.h,l.h/2);g.fillStyle='rgba(0,0,0,.5)';g.fill();txt(l.txt,0,1,l.size,l.col);g.restore()}
 if(BANNERS.length&&BANNERS[0].on){const b=BANNERS[0],r=b.rect;reg('banner','hud',r);const k=b.t/b.life;const a=k<.85?1:1-(k-.85)/.15;const s=k<.15?EASE.back(k/.15):1;g.save();g.globalAlpha=a;g.translate(r.x+r.w/2,r.y+r.h/2);g.scale(s,s);rrect(g,-r.w/2,-r.h/2,r.w,r.h,14);g.fillStyle=b.bg;g.fill();g.strokeStyle='#fff';g.lineWidth=2.5;g.stroke();
  if(b.sub){txt(b.txt,0,-7,fitSize(b.txt,r.w-16,16),b.col);txt(b.sub,0,11,fitSize(b.sub,r.w-16,11),b.col,'center','bold')}else txt(b.txt,0,1,fitSize(b.txt,r.w-16,18),b.col);g.restore()}}
// ---------- world render
function drawWorld(){drawSky(g,GT);drawAmb(g,false);for(const f of FLW)drawFlower(g,f,GT);
 const fly=BF.filter(b=>b.st!=='caught'&&b.st!=='deliver').sort((a,b)=>a.z-b.z);for(const b of fly){if(b.st==='land'){g.fillStyle='rgba(0,0,0,.12)';g.beginPath();g.ellipse(b.x,b.y+b.u*.5,b.u*.6,b.u*.15,0,0,TAU);g.fill()}drawBfly(g,b.k,b.x,b.y,b.u,b.open,b.tilt,b.fade*(b.st==='released'?.85:1))}
 for(const e of BEES)drawBee(g,e);drawGrass(g,GT);
 if(state==='play'||state==='intro'||state==='result')drawNet(g);
 for(const b of BF)if(b.st==='caught'||b.st==='deliver')drawBfly(g,b.k,b.x,b.y,b.u*(b.st==='deliver'?LERP(.75,.35,Math.min(1,b.t/.5)):.75),b.open,0,1);
 drawAmb(g,true);
 for(const p of PARTS){const a=1-p.t/p.life;g.globalAlpha=a;g.fillStyle=p.c;if(p.star){g.save();g.translate(p.x,p.y);g.rotate(p.t*4);g.fillRect(-p.r,-p.r*.3,p.r*2,p.r*.6);g.fillRect(-p.r*.3,-p.r,p.r*.6,p.r*2);g.restore()}else{g.beginPath();g.arc(p.x,p.y,p.r,0,TAU);g.fill()}}g.globalAlpha=1;
 if(state==='play'&&timeLeft<=10){const a=.18+.12*Math.sin(RT*10);const gr=g.createRadialGradient(W/2,H/2,Math.min(W,H)*.35,W/2,H/2,Math.max(W,H)*.75);gr.addColorStop(0,'rgba(255,0,0,0)');gr.addColorStop(1,'rgba(220,30,30,'+a+')');g.fillStyle=gr;g.fillRect(0,0,W,H)}}
// ---------- modal helper: centre a panel in the safe area below the top buttons
function modalRect(w,h){const tz=topBtnZone();const top=Math.max(S.t+8,tz.h+6),bot=H-S.b-8;w=Math.min(w,W-S.l-S.r-20);const y=Math.max(top,(top+bot)/2-h/2);const x=(W-w)/2+(S.l-S.r)/2;return{x,y,w,h:Math.min(h,bot-y)}}
function modalText(s,x,y,size,col,al='center',wt='bold'){g.font=wt+' '+size+'px '+FONT;const w=g.measureText(s).width;txt(s,x,y,size,col,al,wt);reg('t:'+s.slice(0,12),'text',{x:al==='center'?x-w/2:al==='left'?x:x-w,y:y-size/2-1,w,h:size+2})}
function drawIntro(){const cs=cards,n=cs.length;const rowH=36;const h=132+(endless?1:n)*rowH+44;const m=modalRect(380,h);modal=m;reg('modal','modal',m);panel(m.x,m.y,m.w,m.h,'#43a047');const se=SEASONS[LV.season];
 let y=m.y+24;modalText(endless?'Meadow Marathon':'Level '+(LVi+1),m.x+m.w/2,y,22,'#2e7d32');y+=24;modalText(endless?'Fill as many cards as you can!':se.n+' · '+LV.time+' seconds',m.x+m.w/2,y,13,'#6a6a5a');y+=24;
 for(let i=0;i<(endless?1:n);i++){const cd=cs[i];g.fillStyle=cd.t==='M'?'#f3e5f5':'#e8f5e9';g.beginPath();g.arc(m.x+34,y+rowH/2-2,15,0,TAU);g.fill();drawCardIcon(cd,m.x+34,y+rowH/2-2,12);const t=cardTitle(cd);const fs=fitSize(t,m.w-80,14);modalText(t,m.x+58,y+rowH/2-2,fs,'#203020','left');y+=rowH}
  const tip=endless?'Every card adds 12 seconds. It gets faster as you go!':(LVi%6===0?se.desc:TIPS[(LVi+3)%TIPS.length]);const tl=wrap('💡 '+tip,m.w-30,12,'normal');tl.slice(0,3).forEach((l,i)=>modalText(l,m.x+m.w/2,y+8+i*15,12,'#555','center','normal'));
 btn(m.x+m.w/2-80,m.y+m.h-60,160,48,'GO!',goPlay,{col:'#43a047'})}
function drawPause(){const m=modalRect(300,250);modal=m;reg('modal','modal',m);panel(m.x,m.y,m.w,m.h,'#1e88e5');modalText('Paused',m.x+m.w/2,m.y+30,24,'#1565c0');modalText(endless?'Meadow Marathon':'Level '+(LVi+1)+' · '+SEASONS[LV.season].sh,m.x+m.w/2,m.y+56,13,'#666');
 const bw=Math.min(200,m.w-40),bx=m.x+(m.w-bw)/2;btn(bx,m.y+78,bw,46,'▶ Resume',()=>togglePause(false),{col:'#43a047'});btn(bx,m.y+132,bw,44,'↻ Restart',()=>{paused=false;endless?startEndless():startLevel(LVi)},{col:'#fb8c00'});btn(bx,m.y+184,bw,44,'✖ Quit',()=>{paused=false;toMap()},{col:'#e53935'})}
function drawResult(){const r=result;const win=r.win;const h=win?(r.netUnlock!=null?350:330):290;const m=modalRect(340,h);modal=m;reg('modal','modal',m);panel(m.x,m.y,m.w,m.h,win?'#f9a825':'#e53935');let y=m.y+28;
 modalText(win?(LVi===29?'You caught them all!':'Level Complete!'):r.endless?'Marathon Over!':"Time's Up!",m.x+m.w/2,y,22,win?'#e65100':'#c62828');y+=26;
 if(win){for(let i=1;i<=3;i++){const sx=m.x+m.w/2+(i-2)*58,sy=y+26;const on=i<=r.stars&&r.t>.35+i*.35;const k=on?Math.min(1,(r.t-.35-i*.35)*4):0;g.save();g.translate(sx,sy);g.scale(on?.7+.3*EASE.back(k):.8,on?.7+.3*EASE.back(k):.8);starShape(0,0,22,on?'#ffd23a':'#ddd',on?'#e65100':'#aaa');g.restore()}reg('stars','text',{x:m.x+m.w/2-85,y:y+2,w:170,h:48});y+=62}
 else{modalText(r.endless?'Cards filled: '+endlessN:'So close! Try again — watch the timer.',m.x+m.w/2,y+6,13,'#555','center','normal');y+=30}
 const lines=win?[['Catches',catches+(rareCaught?' + '+rareCaught+' rare':'')],['Best combo',maxCombo>1?'×'+maxCombo:'—'],['Best streak',bestStreak],['Time bonus','+'+r.tb]]:[['Catches',catches],['Wrong catches',wrongs]];
 for(const [a,b] of lines){modalText(a,m.x+28,y,14,'#555','left','normal');modalText(String(b),m.x+m.w-28,y,14,'#203020','right');y+=21}
 y+=6;modalText('Score '+r.score.toLocaleString(),m.x+m.w/2,y+4,20,'#2e7d32');y+=24;const best=r.endless?SAVE.endless:SAVE.best[LVi]||0;modalText(r.newBest?'★ NEW BEST! ★':'Best '+best.toLocaleString(),m.x+m.w/2,y+2,13,r.newBest?'#e65100':'#777');y+=18;
 if(r.netUnlock!=null){modalText('🥅 New net unlocked: '+NETS[r.netUnlock].n+'!',m.x+m.w/2,y+4,13,'#6a1b9a');y+=20}
 const by=m.y+m.h-58,n=win&&LVi<29?3:2,gap=8,bw=(m.w-32-gap*(n-1))/n;let bx=m.x+16;
 btn(bx,by,bw,46,'☰ Map',toMap,{col:'#757575'});bx+=bw+gap;btn(bx,by,bw,46,'↻ Retry',()=>endless?startEndless():startLevel(LVi),{col:'#fb8c00'});bx+=bw+gap;if(n===3)btn(bx,by,bw,46,'Next ▶',()=>startLevel(LVi+1),{col:'#43a047'})}
function starShape(x,y,r,fill,stroke){g.beginPath();for(let i=0;i<10;i++){const a=-PI/2+i*PI/5,rr=i%2?r*.45:r;g.lineTo(x+Math.cos(a)*rr,y+Math.sin(a)*rr)}g.closePath();g.fillStyle=fill;g.fill();g.lineWidth=2.5;g.strokeStyle=stroke;g.stroke()}
// ---------- menus
function toTitle(){state='title';seasonView=Math.min(4,Math.floor(maxUnlocked()/6));buildWorld(seasonView);MUS.season=seasonView;clearField();layoutHUD();syncButtons()}
function toMap(){state='map';mapSeason=Math.min(4,Math.floor(Math.max(0,LVi<0?maxUnlocked():LVi)/6));if(!seasonUnlocked(mapSeason))mapSeason=0;buildWorld(mapSeason);MUS.season=mapSeason;clearField();layoutHUD();syncButtons()}
function veil(a=.28){g.fillStyle='rgba(0,0,0,'+a+')';g.fillRect(0,0,W,H)}
function colW(){return Math.min(W-S.l-S.r-20,460)}
function drawTitle(){const tz=topBtnZone();const cw=colW(),cx=W/2+(S.l-S.r)/2;const bot=H-S.b-10;
 const top=Math.max(tz.h,(58+SAFE.t)/SC)+6;const avail=bot-top;const logoH=Math.min(170,avail*.36);const ly=top+logoH*.5;
 // logo
 const bs=Math.min(54,cw/6.4,logoH*.34);g.save();g.translate(cx,ly);g.rotate(-.03);const gr=g.createLinearGradient(0,-bs,0,bs*.3);gr.addColorStop(0,'#ffcf40');gr.addColorStop(1,'#ff6a3a');
 g.font='bold '+bs+'px '+FONT;g.textAlign='center';g.textBaseline='middle';g.lineJoin='round';g.strokeStyle='#5a2a0a';g.lineWidth=8;g.strokeText('Butterfly',0,-bs*.42);g.fillStyle=gr;g.fillText('Butterfly',0,-bs*.42);
 const s2=bs*.72;g.font='bold '+s2+'px '+FONT;g.strokeStyle='#1b5e20';g.lineWidth=7;g.strokeText('NET CATCH',0,bs*.5);g.fillStyle='#fff';g.fillText('NET CATCH',0,bs*.5);g.restore();
 const lw=Math.min(cw,bs*5.2);reg('logo','text',{x:cx-lw/2,y:ly-bs*1.0,w:lw,h:bs*1.95});
 drawBfly(g,'monarch',cx+lw*.5-8,ly-bs*.95,bs*.38,.5+.5*Math.cos(RT*7),.2);drawBfly(g,'bluemorpho',cx-lw*.5+6,ly+bs*.7,bs*.34,.5+.5*Math.cos(RT*5+1),-.25);
 // buttons
 const bw=Math.min(260,cw),bh=Math.min(58,Math.max(44,avail*.1));let y=Math.max(ly+bs*1.1+14,top+logoH+8);const gap=Math.min(12,Math.max(6,avail*.02));
 btn(cx-bw/2,y,bw,bh,'▶  PLAY',toMap,{col:'#43a047',size:24});y+=bh+gap;
 btn(cx-bw/2,y,bw,bh*.86,'♾  Meadow Marathon',startEndless,{col:'#8e24aa',sub:SAVE.endless?'Best '+SAVE.endless.toLocaleString():'Endless mode'});y+=bh*.86+gap;
 const hw=(bw-gap)/2;btn(cx-bw/2,y,hw,bh*.86,'📖 Journal',()=>{state='journal';jPage=0;jDetail=null;syncButtons()},{col:'#1e88e5'});btn(cx-bw/2+hw+gap,y,hw,bh*.86,'🥅 Nets',()=>{state='nets';syncButtons()},{col:'#fb8c00'});y+=bh*.86+gap+4;
 const found=SPK.filter(k=>SAVE.journal[k]).length;const ft='⭐ '+totalStars()+'/90   ·   🦋 '+found+'/'+SPK.length+' found';if(y+16<bot)modalText(ft,cx,y+10,fitSize(ft,cw,14),'#fff','center','bold');
 if(y+40<bot)modalText("A Peter's Arcade game",cx,Math.min(bot-8,y+34),11,'rgba(255,255,255,.85)','center','bold')}
const SEMOJI=['🌷','☀️','🌾','🍂','❄️'];
function drawMap(){veil(.18);const tz=topBtnZone(),cw=colW(),x0=W/2-cw/2+(S.l-S.r)/2;let y=Math.max(tz.h+4,S.t+8);
 // header lives left of the top buttons
 const hw=tz.x-8-(S.l+8);txt('Choose a Level',S.l+12,(6+SAFE.t)/SC+20,fitSize('Choose a Level',hw,22),'#fff','left','bold','rgba(0,0,0,.45)',4);reg('hdr','text',{x:S.l+12,y:(6+SAFE.t)/SC+6,w:Math.min(hw,190),h:28});
 const tg=6,tw=(cw-tg*4)/5,th=56;for(let s=0;s<5;s++){const un=seasonUnlocked(s);const bx=x0+s*(tw+tg);const st=[0,1,2,3,4,5].reduce((a,i)=>a+(SAVE.stars[s*6+i]||0),0);
  btn(bx,y,tw,th,(un?SEMOJI[s]:'🔒'),()=>{if(mapSeason!==s){mapSeason=s;buildWorld(s);MUS.season=s;clearField()}},{col:s===mapSeason?'#2e7d32':un?'#66bb6a':'#9aa49a',dis:!un,sub:SEASONS[s].sh,size:20})}
 y+=th+12;const se=SEASONS[mapSeason];const hh=82;panel(x0,y,cw,hh,'#43a047');reg('sinfo','text',{x:x0,y,w:cw,h:hh});txt(se.n,x0+cw/2,y+18,fitSize(se.n,cw-20,18),'#2e7d32');const dl=wrap(se.desc,cw-24,12,'normal');dl.slice(0,2).forEach((l,i)=>txt(l,x0+cw/2,y+38+i*15,12,'#555','center','normal'));
 const sst=[0,1,2,3,4,5].reduce((a,i)=>a+(SAVE.stars[mapSeason*6+i]||0),0);txt('⭐ '+sst+' / 18',x0+cw/2,y+hh-12,12,'#e65100');y+=hh+12;
 const bot=H-S.b-66;const g2=10,bw=(cw-g2*2)/3,bh=Math.min(96,(bot-y-g2)/2);
 for(let i=0;i<6;i++){const L=mapSeason*6+i,un=isUnlocked(L),st=SAVE.stars[L]||0,best=SAVE.best[L]||0;const bx=x0+(i%3)*(bw+g2),by=y+Math.floor(i/3)*(bh+g2);
  btn(bx,by,bw,bh,un?String(L+1):'🔒',()=>startLevel(L),{col:un?(st?'#43a047':'#ffb300'):'#9aa49a',dis:!un,size:26,sub:un?('★'.repeat(st)+'☆'.repeat(3-st))+(best?'  '+best:''):''})}
 const by=H-S.b-56;btn(S.l+12,by,124,46,'◀ Back',toTitle,{col:'#757575'});btn(W-S.r-12-150,by,150,46,'♾ Marathon',startEndless,{col:'#8e24aa'})}
function drawJournal(){veil(.35);const tz=topBtnZone(),cw=colW(),x0=W/2-cw/2+(S.l-S.r)/2;const found=SPK.filter(k=>SAVE.journal[k]).length;const hw=tz.x-8-(S.l+8);
 txt('Butterfly Journal',S.l+12,(6+SAFE.t)/SC+12,fitSize('Butterfly Journal',hw,20),'#fff','left','bold','rgba(0,0,0,.45)',4);txt(found+' of '+SPK.length+' species found',S.l+12,(6+SAFE.t)/SC+33,fitSize('99 of 30 species found',hw,12),'#ffe680','left');reg('hdr','text',{x:S.l+12,y:(6+SAFE.t)/SC,w:Math.min(hw,200),h:42});
 let y=Math.max(tz.h+6,S.t+8);const bot=H-S.b-66;const cols=W>620?6:4,g2=6,cwid=(cw-g2*(cols-1))/cols,ch=Math.min(104,Math.max(84,cwid*1.15));const rows=Math.max(1,Math.floor((bot-y+g2)/(ch+g2)));const per=rows*cols,pages=Math.ceil(SPK.length/per);jPage=Math.min(jPage,pages-1);
 for(let i=0;i<per;i++){const idx=jPage*per+i;if(idx>=SPK.length)break;const k=SPK[idx],sp=SP[k],j=SAVE.journal[k];const bx=x0+(i%cols)*(cwid+g2),by=y+Math.floor(i/cols)*(ch+g2);
  rrect(g,bx,by,cwid,ch,12);g.fillStyle=j?(sp.rare?'#fff6d0':'#fffdf3'):'rgba(255,255,255,.35)';g.fill();g.lineWidth=2.5;g.strokeStyle=sp.rare?'#f9a825':'#43a047';g.stroke();
  if(j){drawBfly(g,k,bx+cwid/2,by+ch*.4,Math.min(cwid*.3,ch*.27),.92+.08*Math.sin(RT*2+i),0);const nm=fitSize(sp.n,cwid-6,11);txt(sp.n,bx+cwid/2,by+ch-24,nm,'#203020');txt('×'+j.n+(sp.rare?' ✨':''),bx+cwid/2,by+ch-10,10,'#777','center','normal')}
  else{g.save();g.globalAlpha=.35;g.filter='brightness(0)';drawBfly(g,k,bx+cwid/2,by+ch*.4,Math.min(cwid*.3,ch*.27),.9,0);g.restore();txt(sp.rare?'✨ rare ???':'???',bx+cwid/2,by+ch-17,11,'#fff')}
  const b={x:bx,y:by,w:cwid,h:ch,fn:()=>{if(j){jDetail=k}else tone(220,.06,'square',.04)},label:'cell'};menuBtns.push(b);reg('cell'+i,'btn',b)}
 const by=H-S.b-56;btn(S.l+12,by,110,46,'◀ Back',toTitle,{col:'#757575'});
 if(pages>1){btn(W/2-56+(S.l-S.r)/2,by,52,46,'‹',()=>{jPage=(jPage+pages-1)%pages},{col:'#1e88e5'});btn(W/2+4+(S.l-S.r)/2,by,52,46,'›',()=>{jPage=(jPage+1)%pages},{col:'#1e88e5'});const pt=(jPage+1)+'/'+pages;txt(pt,W-S.r-40,by+23,13,'#fff')}
 if(jDetail)drawDetail()}
function drawDetail(){const sp=SP[jDetail],j=SAVE.journal[jDetail];veil(.4);menuBtns=[];UIR=UIR.filter(r=>r.grp!=='btn'&&r.grp!=='text');
 const fl=wrap(sp.fact,Math.min(340,W-40)-30,13,'normal'),tl=wrap('👀 '+sp.tip,Math.min(340,W-40)-30,12,'normal');const h=190+fl.length*17+tl.length*15+60;const m=modalRect(340,h);modal=m;reg('modal','modal',m);panel(m.x,m.y,m.w,m.h,sp.rare?'#f9a825':'#43a047');
 const cx=m.x+m.w/2;drawBfly(g,jDetail,cx,m.y+70,46,.6+.4*Math.cos(RT*4),0);let y=m.y+128;modalText(sp.n,cx,y,20,'#2e7d32');y+=20;modalText(sp.lat,cx,y,12,'#777','center','italic');y+=20;
 modalText('Caught ×'+j.n+'  ·  first in '+(j.first>0?'level '+j.first:'Marathon'),cx,y,12,'#e65100');y+=22;fl.forEach(l=>{modalText(l,cx,y,13,'#333','center','normal');y+=17});y+=4;tl.forEach(l=>{modalText(l,cx,y,12,'#6a1b9a','center','normal');y+=15});
 btn(cx-60,m.y+m.h-56,120,44,'Close',()=>{jDetail=null},{col:'#43a047'})}
function drawNets(){veil(.35);const tz=topBtnZone(),cw=colW(),x0=W/2-cw/2+(S.l-S.r)/2;const hw=tz.x-8-(S.l+8);txt('Choose Your Net',S.l+12,(6+SAFE.t)/SC+20,fitSize('Choose Your Net',hw,20),'#fff','left','bold','rgba(0,0,0,.45)',4);reg('hdr','text',{x:S.l+12,y:(6+SAFE.t)/SC+6,w:Math.min(hw,200),h:28});
 let y=Math.max(tz.h+6,S.t+8);const ts=totalStars();modalText('You have ⭐ '+ts,x0+cw/2,y+10,15,'#ffe680');y+=28;const bot=H-S.b-66;const ch=Math.min(92,(bot-y-24)/4);
 NETS.forEach((n,i)=>{const un=ts>=n.need,sel=(SAVE.net||0)===i;const by=y+i*(ch+8);panel(x0,by,cw,ch,sel?'#f9a825':'#43a047',un?'#fffdf3':'#e8e8e0');reg('net'+i,'text',{x:x0,y:by,w:cw-120,h:ch});
  g.save();g.translate(x0+40,by+ch/2);g.strokeStyle='#b07a3a';g.lineWidth=5;g.beginPath();g.moveTo(8,8);g.lineTo(24,ch/2-6);g.stroke();g.strokeStyle=i==3?'#ffd23a':'#ccc';g.lineWidth=3;g.beginPath();g.arc(0,-2,n.r*.5,0,TAU);g.stroke();g.fillStyle=n.c+'66';g.fill();g.restore();
  txt(n.n,x0+78,by+ch/2-11,fitSize(n.n,cw-210,16),'#203020','left');txt(un?n.d:'Needs ⭐ '+n.need,x0+78,by+ch/2+10,fitSize(un?n.d:'Needs ⭐ 60',cw-210,12),un?'#555':'#a33','left','normal');
  btn(x0+cw-108,by+ch/2-21,96,42,sel?'✔ Using':un?'Use':'🔒',()=>{SAVE.net=i;save()},{col:sel?'#f9a825':'#43a047',dis:!un})});
 btn(S.l+12,H-S.b-56,124,46,'◀ Back',toTitle,{col:'#757575'})}
// ---------- main render
function render(){menuBtns=[];UIR=[];modal=null;g.setTransform(DPR*SC,0,0,DPR*SC,0,0);
 g.save();if(shake>0&&state==='play'){g.translate(RR(-1,1)*shake*12,RR(-1,1)*shake*12)}drawWorld();g.restore();
 if(state==='title')drawTitle();else if(state==='map')drawMap();else if(state==='journal')drawJournal();else if(state==='nets')drawNets();
 else{drawHUD();if(!paused&&state!=='result')drawLabels();if(state==='intro'&&!paused){veil(.25);drawIntro()}else if(state==='result'){veil(.3);drawResult()}if(paused){veil(.35);menuBtns=[];UIR=UIR.filter(r=>r.grp!=='btn');drawPause()}}
 for(const r of domBtnRects())UIR.push(Object.assign({grp:'dom'},r))}
