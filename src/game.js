// ================= game state
let state='title',paused=false,menuBtns=[],modal=null,GT=0,RT=0;// GT = game time (advances only when running)
let LVi=0,LV=null,cards=[],ci=0,timeLeft=60,score=0,streak=0,bestStreak=0,combos=0,maxCombo=0,wrongs=0,catches=0,rareCaught=0,endless=false,endlessN=0;
let BF=[],BEES=[],PARTS=[],LBL=[],BANNERS=[],FLY=[],shake=0,cardPop=0,cardSlide=0,lastTick=0,spawnT=0,rareT=0,beeT=0,levelT=0,result=null,introT=0;
let mapSeason=0,jPage=0,jDetail=null,seasonView=0,titleBF=[];
const NETS=[{n:'Garden Net',d:'A trusty cotton net.',r:30,cool:.3,need:0,c:'#f0f0f0'},{n:'Wide Net',d:'25% bigger hoop.',r:37,cool:.3,need:15,c:'#bfe8ff'},{n:'Swift Net',d:'Recovers 40% faster.',r:31,cool:.18,need:35,c:'#ffe08a'},{n:'Golden Net',d:'Big hoop AND quick recovery!',r:38,cool:.18,need:60,c:'#ffd23a'}];
const totalStars=()=>Object.values(SAVE.stars).reduce((a,b)=>a+b,0);
const curSeason=()=>state==='play'||state==='intro'||state==='result'?(LV?LV.season:0):state==='map'?mapSeason:seasonView;
const netDef=()=>NETS[Math.min(SAVE.net||0,NETS.length-1)];
// ---------- HUD layout (logical units)
let HUD={};
function layoutHUD(){const top=(6+SAFE.t)/SC,bz=topBtnZone();const l=S.l+8;const avail=bz.x-6-l;const sw=Math.min(118,Math.max(96,avail*.56)),tw=Math.min(88,Math.max(70,avail-sw-6));
 HUD.score={k:'score',x:l,y:top,w:sw,h:36};HUD.timer={k:'timer',x:l+sw+6,y:top,w:tw,h:36};
 const cy=Math.max(top+36,(48+SAFE.t)/SC)+8;const cw=Math.min(W-S.l-S.r-16,460);HUD.card={k:'card',x:(W-cw)/2+(S.l-S.r)/2,y:cy,w:cw,h:68};
 HUD.banner={k:'banner',x:W/2-Math.min(150,cw/2),y:cy+76,w:Math.min(300,cw),h:40};HUD.playTop=cy+76;HUD.fieldBot=H-S.b-30}
// ---------- labels: placed so they never overlap each other, HUD, banner or buttons; static rects (pop+fade only)
function hudRects(){const r=[HUD.score,HUD.timer,HUD.card,topBtnZone()];for(const b of BANNERS)if(b.on)r.push(b.rect);return r}
function addLabel(txt,x,y,col='#fff',size=15,life=1.1){g.save();g.font='bold '+size+'px "Trebuchet MS",sans-serif';const w=g.measureText(txt).width+14,h=size+10;g.restore();
 const block=hudRects().concat(LBL);const minY=HUD.playTop+2,maxY=HUD.fieldBot-h,minX=S.l+4,maxX=W-S.r-4-w;
 const offs=[[0,-1],[0,0],[0,-2],[-.7,-1],[.7,-1],[0,1],[-1,0],[1,0],[0,-3],[-1,-2],[1,-2],[0,2],[-1.4,-1],[1.4,-1],[0,-4],[0,3]];
 for(const [ox,oy] of offs){const r={k:'lbl',x:CL(x-w/2+ox*w*.75,minX,maxX),y:CL(y-h/2+oy*(h+4)-10,minY,maxY),w,h};if(r.y>maxY+.1||r.x>maxX+.1)continue;if(block.some(b=>ov(r,b,2)))continue;
  LBL.push(Object.assign(r,{txt,col,size,t:0,life}));return r}return null}
function banner(txt,col='#fff',bg='rgba(46,125,50,.92)',life=1.5,sub){BANNERS.push({txt,col,bg,life,t:0,on:false,sub,rect:HUD.banner})}
function updLabels(dt){for(const l of LBL)l.t+=dt;LBL=LBL.filter(l=>l.t<l.life);
 if(BANNERS.length){const b=BANNERS[0];if(!b.on){b.on=true;b.rect=Object.assign({},HUD.banner);LBL=LBL.filter(l=>!ov(l,b.rect,2))}b.t+=dt;if(b.t>=b.life)BANNERS.shift()}}
// ---------- particles
function sparkle(x,y,n,cols,spd=60,life=.7){for(let i=0;i<n;i++){const a=R()*TAU,v=RR(.3,1)*spd;PARTS.push({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v-20,t:0,life:life*RR(.6,1.2),c:PICK(cols),r:RR(1.2,3),star:R()<.4})}}
function updParts(dt){for(const p of PARTS){p.t+=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=40*dt;p.vx*=1-dt*1.5}PARTS=PARTS.filter(p=>p.t<p.life)}
// ---------- butterflies
function newBF(k,opts={}){const sp=SP[k];const z=RR(.88,1.1);const side=opts.side!=null?opts.side:(R()<.5?-1:1);const yMin=HUD.playTop+20,yMax=HUD.fieldBot-40;
 const b={k,z,u:sp.span*.5*z,x:opts.x!=null?opts.x:(side<0?-30:W+30),y:opts.y!=null?opts.y:RR(yMin,yMax),hd:opts.x!=null?R()*TAU:(side<0?RR(-.5,.5):PI+RR(-.5,.5)),spd:0,ph:R()*TAU,open:1,tilt:0,st:'fly',t:0,n1:R()*9,n2:R()*9,n3:R()*9,
  vx:0,vy:0,glide:0,dart:0,landT:RR(4,11)/(LV?LV.land+.25:1),life:RR(22,40),fade:opts.x!=null?0:1,flower:null,landDur:0,react:0,id:Math.random()};
 b.spd=sp.sp*34*(LV?LV.spd:1);b.vx=Math.cos(b.hd)*b.spd;b.vy=Math.sin(b.hd)*b.spd;if(sp.rare){b.life=RR(7,10);b.landT=99}return b}
function liveBF(){return BF.filter(b=>b.st==='fly'||b.st==='toFlower'||b.st==='land'||b.st==='leave'&&b.x>-20&&b.x<W+20)}
function curCard(){return cards[ci]||null}
function pickSpecies(){const L=LV,cd=curCard();const pool=L.pool;const live=liveBF().filter(b=>!SP[b.k].rare);
 const matchK=cd?pool.filter(k=>cardMatch(cd,k)):[];const nMatch=live.filter(b=>cd&&cardMatch(cd,b.k)).length;
 if(cd&&(nMatch<2||R()<L.match))return PICK(matchK);
 // decoys: favour look-alikes of the target
 if(cd&&R()<.3){const lk=[];for(const k of matchK)for(const q of (SP[k].lk||[]))if(pool.includes(q))lk.push(q);if(cd.t==='C'||cd.t==='F'){for(const k of pool)if(!cardMatch(cd,k)&&(cd.t==='C'?false:cd.conds.some(([a,b])=>a==='col'&&SP[k].col===b)))lk.push(k)}if(lk.length)return PICK(lk)}
 return PICK(pool)}
function spawnLogic(dt){if(!LV)return;const live=liveBF().filter(b=>b.st!=='leave');spawnT-=dt;
 if(live.length<LV.n&&spawnT<=0){BF.push(newBF(pickSpecies()));spawnT=RR(.5,1.4)}
 rareT-=dt;if(rareT<=0){rareT=RR(18,32);if(R()<LV.rare*20&&state==='play'){const k=PICK(RARES);const b=newBF(k);BF.push(b);banner('✨ A rare '+SP[k].n+' appeared!','#3a2a00','rgba(255,214,64,.95)',1.6)}}
 beeT-=dt;if(LV.bees&&BEES.length<LV.bees&&beeT<=0){BEES.push(newBee());beeT=RR(4,9)}}
function updBF(b,dt){const sp=SP[b.k],L=LV||{spd:1,flap:1,dart:.02,wary:0};b.t+=dt;b.fade=Math.min(1,b.fade+dt*2.5);
 if(b.st==='caught'){b.ct+=dt;const bag=NET.bag;b.x=LERP(b.x,bag.x+b.ox,Math.min(1,dt*14));b.y=LERP(b.y,bag.y+b.oy,Math.min(1,dt*14));b.ph+=dt*TAU*sp.fl*1.6;b.open=.3+.4*Math.abs(Math.sin(b.ph));
  if(b.ct>.42){if(b.res==='wrong'){b.st='released';b.vx=RR(-60,60);b.vy=-110;b.t=0}else{b.st='deliver';b.t=0;b.sx=b.x;b.sy=b.y;const tg=b.res==='rare'?HUD.score:HUD.card;b.tx=tg.x+(b.res==='rare'?tg.w/2:38);b.ty=tg.y+tg.h/2}}return}
 if(b.st==='deliver'){const k=Math.min(1,b.t/.5),e=EASE.inOut(k);b.x=LERP(b.sx,b.tx,e);b.y=LERP(b.sy,b.ty,e)-Math.sin(k*PI)*60;b.ph+=dt*TAU*8;b.open=.5+.5*Math.sin(b.ph);if(k>=1){b.dead=true;cardPop=1;sparkle(b.tx,b.ty,8,['#fff','#ffe060','#a0ffa0'],50,.5)}return}
 if(b.st==='released'){b.vy-=60*dt;b.x+=b.vx*dt;b.y+=b.vy*dt;b.ph+=dt*TAU*sp.fl*1.5;b.open=.5+.5*Math.cos(b.ph);if(b.y<-60)b.dead=true;return}
 // flight
 b.life-=dt;if(b.life<=0&&b.st!=='leave'&&b.st!=='land'){b.st='leave';b.hd=b.x<W/2?PI+RR(-.4,.4):RR(-.4,.4)}
 if(b.st==='land'){const f=b.flower;const [hx,hy]=flowerHead(f,GT);b.x=hx;b.y=hy-b.u*.25;b.landDur-=dt;b.ph+=dt*2.2;b.open=b.flick>0?.5+.5*Math.cos(b.t*30):.25+.7*(.5+.5*Math.sin(b.ph));b.flick=(b.flick||0)-dt;if(R()<dt*.3)b.flick=.25;b.tilt*=.9;
  const near=NET.active&&HYP(NET.hx-b.x,NET.hy-b.y)<70+L.wary*50;if(near&&L.wary>.25){b.react+=dt;if(b.react>.22-L.wary*.1)b.landDur=0}
  if(b.landDur<=0){b.st='fly';f.occ=null;b.flower=null;b.hd=-PI/2+RR(-.8,.8);b.vx=Math.cos(b.hd)*b.spd;b.vy=-b.spd*1.5;b.landT=RR(6,14);b.react=0}return}
 // wander heading via layered noise
 const T=b.t;let turn=(Math.sin(T*.73+b.n1)*1.1+Math.sin(T*1.91+b.n2)*.65+Math.sin(T*3.7+b.n3)*.35)*(b.glide>0?.4:1.25);
 let ax=0,ay=0;const mx=40,yMin=HUD.playTop+16,yMax=HUD.fieldBot-20;
 if(b.st==='leave'){ax+=Math.cos(b.hd)*40}else{if(b.x<mx)ax+=(mx-b.x)*2.2;if(b.x>W-mx)ax-=(b.x-(W-mx))*2.2;if(b.y<yMin+20)ay+=(yMin+20-b.y)*2.6;if(b.y>yMax-20)ay-=(b.y-(yMax-20))*2.6;
  if(b.x<-10||b.x>W+10||b.y<yMin-10||b.y>yMax+20){const a=Math.atan2(H*.55-b.y,W/2-b.x);ax+=Math.cos(a)*60;ay+=Math.sin(a)*60}}
 // separation (boids-lite)
 for(const o of BF){if(o===b||o.st==='caught'||o.st==='deliver')continue;const dx=b.x-o.x,dy=b.y-o.y,d2=dx*dx+dy*dy,rr=(b.u+o.u)*1.1;if(d2<rr*rr&&d2>.01){const d=Math.sqrt(d2),f=(rr-d)/rr*70;ax+=dx/d*f;ay+=dy/d*f}}
 // wary: evade the swinging net
 if(NET.active&&L.wary>0&&!sp.rare||(sp.rare&&NET.active)){const dx=b.x-NET.hx,dy=b.y-NET.hy,d=HYP(dx,dy);const rad=70+L.wary*60;if(d<rad&&d>.1){b.react+=dt;if(b.react>.2-L.wary*.12){const f=(1-d/rad)*(sp.rare?260:180*L.wary);ax+=dx/d*f;ay+=dy/d*f;if(b.dart<=0&&R()<dt*4*L.wary){b.dart=.3;b.hd=Math.atan2(dy,dx)+RR(-.6,.6)}}}}else b.react=Math.max(0,b.react-dt);
 // glide / dart behaviours
 if(b.glide>0)b.glide-=dt;else if(R()<dt*sp.gl*.28&&b.dart<=0)b.glide=RR(.6,1.5);
 if(b.dart>0)b.dart-=dt;else if(R()<dt*L.dart*(sp.rare?3:1)&&b.st==='fly'){b.dart=RR(.22,.42);b.hd+=(R()<.5?-1:1)*RR(.9,2.1);b.glide=0}
 // flower landing
 if(b.st==='fly'&&!sp.rare&&LV){b.landT-=dt;if(b.landT<=0){const free=FLW.filter(f=>!f.occ);if(free.length&&R()<(LV.land)){let best=null,bd=1e9;for(const f of free){const d=HYP(f.x-b.x,f.y-b.y)+R()*80;if(d<bd){bd=d;best=f}}best.occ=b;b.flower=best;b.st='toFlower'}else b.landT=RR(4,9)}}
 let spd=b.spd*(b.dart>0?2.9:b.glide>0?1.12:1);
 if(b.st==='toFlower'){const [hx,hy]=flowerHead(b.flower,GT);const dx=hx-b.x,dy=hy-b.u*.25-b.y,d=HYP(dx,dy);const want=Math.atan2(dy,dx);let da=((want-b.hd+PI*3)%TAU)-PI;b.hd+=CL(da,-3*dt,3*dt);spd*=CL(d/60,.35,1);turn*=CL(d/120,0,1);
  if(d<5){b.st='land';b.landDur=RR(2.2,5)*(1.2-L.wary*.4);b.t=0;b.ph=0;SFX.land();return}}
 b.hd+=turn*dt;
 const tvx=Math.cos(b.hd)*spd+ax*.6,tvy=Math.sin(b.hd)*spd+ay*.6;const k=Math.min(1,dt*(b.dart>0?7:3));b.vx+=(tvx-b.vx)*k;b.vy+=(tvy-b.vy)*k;
 if(ax||ay){const ta=Math.atan2(b.vy,b.vx);let da=((ta-b.hd+PI*3)%TAU)-PI;b.hd+=da*Math.min(1,dt*2)}
 const fl=sp.fl*.82*L.flap*(b.dart>0?1.9:1);if(b.glide>0){b.ph+=dt*TAU*1.2;b.open=.86+.1*Math.sin(b.ph);}else{b.ph+=dt*TAU*fl;const s=.5+.5*Math.cos(b.ph);b.open=.1+.9*Math.pow(s,.75)}
 const bob=b.glide>0?7:-Math.sin(b.ph)*22*(b.u/22);b.x+=b.vx*dt;b.y+=(b.vy+bob)*dt;
 b.tilt=LERP(b.tilt,CL(b.vx/(b.spd*2.2),-.55,.55)+Math.sin(b.t*2.3+b.n1)*.06,Math.min(1,dt*5));
 if(b.st==='leave'&&(b.x<-60||b.x>W+60||b.y<-60))b.dead=true;
 if(sp.rare&&R()<dt*14)PARTS.push({x:b.x+RR(-8,8),y:b.y+RR(-8,8),vx:0,vy:10,t:0,life:.6,c:PICK(['#fff6a0','#ffd23a','#ffffff']),r:RR(1,2.2),star:true})}
// ---------- bees
function newBee(){const s=R()<.5?-1:1;return{x:s<0?-20:W+20,y:RR(HUD.playTop+40,HUD.fieldBot-40),vx:-s*RR(-40,-60)*-1,vy:0,ph:R()*9,t:0,life:RR(9,15),dir:-s,st:'fly'}}
function updBee(e,dt){e.t+=dt;e.ph+=dt;e.life-=dt;const sp=LV?44*LV.spd:44;if(e.st==='angry'){e.x+=e.vx*dt;e.y+=e.vy*dt;e.vy-=30*dt;if(e.y<-30||e.x<-40||e.x>W+40)e.dead=true;return}
 const tx=e.life<0?(e.dir>0?W+60:-60):e.x+e.dir*30;if(e.life>0&&(e.x<30&&e.dir<0||e.x>W-30&&e.dir>0))e.dir*=-1;e.vx=LERP(e.vx,e.dir*sp,dt*2);e.vy=Math.sin(e.t*2.1)*30+Math.sin(e.t*7.3)*14;const yMin=HUD.playTop+30,yMax=HUD.fieldBot-30;if(e.y<yMin)e.vy+=40;if(e.y>yMax)e.vy-=40;e.x+=e.vx*dt;e.y+=e.vy*dt;if(e.life<0&&(e.x<-50||e.x>W+50))e.dead=true}
function drawBee(x,e){x.save();x.translate(e.x,e.y);x.scale(e.vx<0?-1:1,1);x.fillStyle='rgba(255,255,255,.6)';const w=Math.sin(GT*90)*.5+.5;x.beginPath();x.ellipse(-2,-8,5,7*w+2,-.3,0,TAU);x.ellipse(3,-8,5,7*w+2,.3,0,TAU);x.fill();
 x.fillStyle='#ffc81a';x.beginPath();x.ellipse(0,0,10,7,0,0,TAU);x.fill();x.fillStyle='#1a1408';x.fillRect(-4,-6.5,3,13);x.fillRect(2,-6.5,3,13);x.beginPath();x.moveTo(-10,0);x.lineTo(-15,1);x.lineTo(-10,2);x.fill();x.beginPath();x.arc(9,-1,4,0,TAU);x.fill();x.fillStyle='#fff';x.beginPath();x.arc(10,-2,1.3,0,TAU);x.fill();
 if(e.st==='angry'){x.fillStyle='#e02a2a';x.font='bold 12px sans-serif';x.fillText('!',4,-12)}x.restore()}
