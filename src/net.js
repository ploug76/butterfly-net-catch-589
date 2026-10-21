// ================= the net: tap = arc swing through the point; swipe = sweep along your finger. Swept hitbox, cooldown, input buffer.
const NET={mode:'idle',t:0,dur:.24,hx:0,hy:0,px:0,py:0,R:0,a0:0,a1:0,cool:0,stun:0,active:false,prev:null,trail:[],caught:[],buf:null,press:null,rest:{x:0,y:0},bag:{x:0,y:0,vx:0,vy:0},vx:0,vy:0,tx:0,ty:0,swings:0};
function netReset(){NET.mode='idle';NET.cool=0;NET.stun=0;NET.active=false;NET.caught=[];NET.buf=null;NET.press=null;NET.trail=[];NET.rest={x:W*.8,y:H-S.b-70};NET.hx=NET.rest.x;NET.hy=NET.rest.y;NET.bag.x=NET.hx;NET.bag.y=NET.hy+40;NET.bag.vx=NET.bag.vy=0}
function netPress(x,y,id){if(NET.stun>0){SFX.bee&&tone(140,.08,'square',.04);return}
 NET.press={x0:x,y0:y,x,y,id,t:0};
 if(NET.mode!=='idle'||NET.cool>0){NET.buf={x,y,t:.2};return}
 startArc(x,y)}
function startArc(x,y){const dir=x<W/2?1:-1;NET.px=CL(LERP(x,W/2,.3),20,W-20);NET.py=H+110;NET.R=HYP(x-NET.px,y-NET.py);const c=Math.atan2(y-NET.py,x-NET.px),s=Math.min(.4,48/NET.R);
 NET.a0=c-dir*s*.55;NET.a1=c+dir*s;NET.mode='arc';NET.t=0;NET.dur=.24;NET.active=true;NET.caught=[];NET.prev=null;NET.swings++;SFX.swoosh(1+R()*.1);NET.hx=NET.px+Math.cos(NET.a0)*NET.R;NET.hy=NET.py+Math.sin(NET.a0)*NET.R;NET.prev=[NET.hx,NET.hy]}
function netMove(x,y,id){const p=NET.press;if(!p||p.id!==id)return;p.x=x;p.y=y;
 if(NET.mode==='arc'&&HYP(x-p.x0,y-p.y0)>16&&NET.t<.14){NET.mode='swipe';NET.t=0;NET.dur=.7;NET.tx=x;NET.ty=y;SFX.whoosh()}
 if(NET.mode==='swipe'){NET.tx=x;NET.ty=y}}
function netRelease(id){const p=NET.press;if(!p||p.id!==id)return;NET.press=null;if(NET.mode==='swipe')endSwing()}
function endSwing(){if(NET.mode==='idle')return;NET.mode='idle';NET.active=false;NET.cool=netDef().cool;resolveSwing();NET.rest={x:CL(NET.hx,30,W-30),y:Math.max(NET.hy+40,H-S.b-90)}}
function updNet(dt){NET.stun=Math.max(0,NET.stun-dt);const ox=NET.hx,oy=NET.hy;
 if(NET.mode==='arc'){NET.t+=dt;const k=Math.min(1,NET.t/NET.dur),e=EASE.out(k);const a=LERP(NET.a0,NET.a1,e);NET.hx=NET.px+Math.cos(a)*NET.R;NET.hy=NET.py+Math.sin(a)*NET.R;if(k>=1)endSwing()}
 else if(NET.mode==='swipe'){NET.t+=dt;const k=Math.min(1,dt*28);NET.hx+=(NET.tx-NET.hx)*k;NET.hy+=(NET.ty-NET.hy)*k;NET.px=LERP(NET.px,CL(LERP(NET.hx,W/2,.3),20,W-20),dt*6);NET.py=H+110;if(NET.t>=NET.dur)endSwing()}
 else{NET.cool=Math.max(0,NET.cool-dt);const k=Math.min(1,dt*6);NET.hx+=(NET.rest.x-NET.hx)*k;NET.hy+=(NET.rest.y-NET.hy)*k;NET.px=LERP(NET.px,CL(LERP(NET.hx,W/2,.3)+30,20,W-20),dt*4);NET.py=H+110;
  if(NET.buf){NET.buf.t-=dt;if(NET.buf.t<=0)NET.buf=null;else if(NET.cool<=0&&NET.stun<=0){const b=NET.buf;NET.buf=null;startArc(b.x,b.y)}}}
 NET.vx=(NET.hx-ox)/Math.max(dt,1e-3);NET.vy=(NET.hy-oy)/Math.max(dt,1e-3);
 // bag spring trails opposite the motion
 const sp=HYP(NET.vx,NET.vy),r=netDef().r;const dx=sp>30?-NET.vx/sp:0,dy=sp>30?-NET.vy/sp:1;const tx=NET.hx+dx*r*1.5,ty=NET.hy+dy*r*1.5+6;const bg=NET.bag;bg.vx+=((tx-bg.x)*180-bg.vx*14)*dt;bg.vy+=((ty-bg.y)*180-bg.vy*14)*dt;bg.x+=bg.vx*dt;bg.y+=bg.vy*dt;
 const dd=HYP(bg.x-NET.hx,bg.y-NET.hy),mx=r*1.9;if(dd>mx){bg.x=NET.hx+(bg.x-NET.hx)/dd*mx;bg.y=NET.hy+(bg.y-NET.hy)/dd*mx}
 if(NET.active){NET.trail.push({x:NET.hx,y:NET.hy,t:0});sweepHit(ox,oy,NET.hx,NET.hy)}for(const p of NET.trail)p.t+=dt;NET.trail=NET.trail.filter(p=>p.t<.18)}
function segDist(px,py,x0,y0,x1,y1){const dx=x1-x0,dy=y1-y0,l2=dx*dx+dy*dy;let t=l2?((px-x0)*dx+(py-y0)*dy)/l2:0;t=CL(t,0,1);return HYP(px-(x0+dx*t),py-(y0+dy*t))}
function sweepHit(x0,y0,x1,y1){if(state!=='play')return;const r=netDef().r;
 for(const b of BF){if(b.st!=='fly'&&b.st!=='toFlower'&&b.st!=='land'&&b.st!=='leave')continue;if(b.fade<.5||b.x<-10||b.x>W+10)continue;if(segDist(b.x,b.y,x0,y0,x1,y1)<r+b.u*.42)catchBF(b)}
 for(const e of BEES){if(e.st!=='fly')continue;if(segDist(e.x,e.y,x0,y0,x1,y1)<r*.85+6)stung(e)}}
function catchBF(b){if(b.flower){b.flower.occ=null;b.flower=null}const sp=SP[b.k];const cd=curCard();b.st='caught';b.ct=0;b.ox=RR(-8,8);b.oy=RR(-6,6);NET.caught.push(b);
 if(!SAVE.journal[b.k]){SAVE.journal[b.k]={n:0,first:LVi+1};if(!sp.rare)banner('📖 New journal entry!','#fff','rgba(30,136,229,.94)',1.3,sp.n)}SAVE.journal[b.k].n++;
 if(sp.rare){b.res='rare';rareCaught++;const pts=500;score+=pts;timeLeft+=5;SFX.rare();sparkle(b.x,b.y,26,['#fff6a0','#ffd23a','#fff'],110,1);banner('✨ RARE! '+sp.n,'#3a2a00','rgba(255,214,64,.96)',1.8,'+500 points · +5 seconds');return}
 if(cd&&cardMatch(cd,b.k)){b.res='ok';catches++;cd.got++;const mult=1+Math.min(streak,8)*.25;let pts=Math.round(100*mult);const air=b.dart>0?50:0;pts+=air;score+=pts;SFX.catch(NET.caught.filter(q=>q.res==='ok').length-1);
  sparkle(b.x,b.y,12,['#fff','#ffe060','#a0ffa0'],70,.6);addLabel('+'+pts+(cd.t==='M'?' '+sp.n+' ✓':air?' darter!':''),b.x,b.y,'#fffbe0',cd.t==='M'?13:15);
  if(cd.got>=cd.n)cardDone();return}
 // a match for the NEXT card counts if this card just finished during the swing
 b.res='wrong';wrongs++;streak=0;timeLeft=Math.max(0,timeLeft-3);score=Math.max(0,score-50);SFX.wrong();shake=.15;
 addLabel('✗ '+sp.n+'  −3s',b.x,b.y,'#ffd0d0',14,1.4)}
function stung(e){e.st='angry';e.vx=RR(-80,80);e.vy=-60;NET.stun=1.1;if(NET.mode!=='idle'){NET.mode='idle';NET.active=false;NET.cool=0;resolveSwing()}streak=0;timeLeft=Math.max(0,timeLeft-4);SFX.bee();shake=.3;addLabel('🐝 Ouch!  −4s',e.x,e.y,'#ffe0a0',15,1.4)}
function resolveSwing(){const ok=NET.caught.filter(b=>b.res==='ok').length,bad=NET.caught.filter(b=>b.res==='wrong').length;
 if(ok>=2){const bonus=100*ok*(ok-1);score+=bonus;combos++;maxCombo=Math.max(maxCombo,ok);SFX.combo(ok);shake=.12+ok*.04;const nm=['','','DOUBLE','TRIPLE','QUADRUPLE','MEGA'][Math.min(ok,5)];banner(nm+' CATCH!','#fff','rgba(142,36,170,.94)',1.3,'+'+bonus+' combo bonus');sparkle(NET.hx,NET.hy,24,['#ff80ff','#ffe060','#80e0ff'],120,.9)}
 if(ok>0&&bad===0){streak++;bestStreak=Math.max(bestStreak,streak)}
 save()}
function cardDone(){SFX.card();const cd=curCard();cd.done=true;if(endless){timeLeft+=12;endlessN++}
 if(ci<cards.length-1||endless){ci++;if(endless&&ci>=cards.length)cards.push(randomCard());cardSlide=1;banner('Card complete! ✔','#fff','rgba(46,125,50,.94)',1.2,endless?'+12 seconds':'Next: '+cardTitle(curCard(),true));
  // butterflies already in the net that match the new card count for it
  }else{winLevel()}}
// ---------- drawing the net
function drawNet(x){const nd=netDef(),r=nd.r;const hx=NET.hx,hy=NET.hy,bag=NET.bag;const a=Math.atan2(hy-NET.py,hx-NET.px);
 // swing trail
 if(NET.trail.length>1){x.lineCap='round';for(let i=1;i<NET.trail.length;i++){const p=NET.trail[i-1],q=NET.trail[i];x.strokeStyle='rgba(255,255,255,'+(.35*(1-q.t/.18))+')';x.lineWidth=r*1.6*(1-q.t/.18);x.beginPath();x.moveTo(p.x,p.y);x.lineTo(q.x,q.y);x.stroke()}}
 // handle
 const ex=hx-Math.cos(a)*r,ey=hy-Math.sin(a)*r;x.lineCap='round';x.strokeStyle='#5a3a1a';x.lineWidth=9;x.beginPath();x.moveTo(ex,ey);x.lineTo(NET.px,NET.py);x.stroke();x.strokeStyle=SAVE.net==3?'#e8b830':'#b07a3a';x.lineWidth=6;x.beginPath();x.moveTo(ex,ey);x.lineTo(NET.px,NET.py);x.stroke();
 x.strokeStyle='rgba(255,255,255,.35)';x.lineWidth=1.5;x.beginPath();x.moveTo(ex-1,ey);x.lineTo(NET.px-1,NET.py);x.stroke();
 // bag (mesh) from rim to tip
 const sp=HYP(NET.vx,NET.vy);const sq=CL(sp/900,0,.55);const perp=a+PI/2;const rx=r,ry=r*(1-sq);
 const bdx=bag.x-hx,bdy=bag.y-hy,bl=Math.max(1,HYP(bdx,bdy));const nx=-bdy/bl,ny=bdx/bl;
 const p1x=hx+nx*r*.95,p1y=hy+ny*r*.95,p2x=hx-nx*r*.95,p2y=hy-ny*r*.95;
 x.fillStyle=nd.c==='#f0f0f0'?'rgba(255,255,255,.32)':nd.c+'55';x.strokeStyle='rgba(255,255,255,.7)';x.lineWidth=1.2;x.beginPath();x.moveTo(p1x,p1y);x.quadraticCurveTo(bag.x+nx*r*.7,bag.y+ny*r*.7,bag.x,bag.y);x.quadraticCurveTo(bag.x-nx*r*.7,bag.y-ny*r*.7,p2x,p2y);x.closePath();x.fill();x.stroke();
 x.strokeStyle='rgba(255,255,255,.35)';x.lineWidth=.8;for(let k=-2;k<=2;k++){const f=k/3;x.beginPath();x.moveTo(hx+nx*r*f,hy+ny*r*f);x.quadraticCurveTo(LERP(hx,bag.x,.6)+nx*r*f*.8,LERP(hy,bag.y,.6)+ny*r*f*.8,bag.x,bag.y);x.stroke()}
 for(let k=1;k<=2;k++){const f=k/3;const cx=LERP(hx,bag.x,f),cy=LERP(hy,bag.y,f),w=r*(1-f*.6);x.beginPath();x.moveTo(cx+nx*w,cy+ny*w);x.quadraticCurveTo(cx+bdx/bl*4,cy+bdy/bl*4,cx-nx*w,cy-ny*w);x.stroke()}
 // hoop rim
 x.save();x.translate(hx,hy);x.rotate(perp);x.strokeStyle='#4a3a2a';x.lineWidth=5;x.beginPath();x.ellipse(0,0,rx,ry*.55+2,0,0,TAU);x.stroke();x.strokeStyle=SAVE.net==3?'#ffd23a':'#d8d8e0';x.lineWidth=3;x.beginPath();x.ellipse(0,0,rx,ry*.55+2,0,0,TAU);x.stroke();
 if(NET.cool>0||NET.stun>0){const k=NET.stun>0?NET.stun/1.1:NET.cool/nd.cool;x.strokeStyle=NET.stun>0?'rgba(255,80,60,.8)':'rgba(255,255,255,.7)';x.lineWidth=2;x.beginPath();x.ellipse(0,0,rx+5,ry*.55+7,0,-PI/2,-PI/2+TAU*k);x.stroke()}
 x.restore()}
