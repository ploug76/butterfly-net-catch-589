// ================= seasons, background art, flowers, ambient particles
const SEASONS=[
 {n:'Spring Meadow',sh:'Spring',sky:['#8fd0ff','#d8f1ff','#f3fbff'],sun:'#fff6c8',hills:['#b6e39a','#9bd47e','#7fc466'],grass:['#6cc052','#4fa83c','#86d064'],fl:[['tulip','#ff6f91'],['tulip','#ffd166'],['daisy','#ffffff'],['bell','#b79cff'],['daisy','#ffe680']],tree:'blossom',part:'petal',tint:'#ffe1ef',desc:'Cherry blossoms and tulips. Learn the meadow butterflies!'},
 {n:'Summer Garden',sh:'Summer',sky:['#3ea6ff','#9fd8ff','#e2f5ff'],sun:'#fffbe0',hills:['#6cc04a','#58b03c','#43a032'],grass:['#4cae3a','#3a9a2c','#62c04a'],fl:[['sunflower','#ffc81a'],['zinnia','#ff5a3a'],['daisy','#ffffff'],['zinnia','#ff7ac0'],['lavender','#9a6aff']],tree:'oak',part:'pollen',tint:'#fff8d0',desc:'Sunflowers, zinnias and look-alike ladies. Watch for bees!'},
 {n:'Prairie Migration',sh:'Prairie',sky:['#f39a5c','#fbc98a','#fdecc4'],sun:'#fff0b0',hills:['#c8b464','#b09e50','#9a8a40'],grass:['#b5a442','#9a8a34','#ccbc5a'],fl:[['cone','#d070c0'],['golden','#ffd23a'],['milkweed','#ff9ac0'],['cone','#e888d8'],['golden','#f2c020']],tree:'none',part:'seed',tint:'#ffe0b0',desc:'Golden hour on the prairie. Monarch, Viceroy or Queen?'},
 {n:'Autumn Orchard',sh:'Autumn',sky:['#ff9d6a','#ffc9a0','#fff0e0'],sun:'#ffe8c0',hills:['#d08a48','#b86c34','#9a5428'],grass:['#8a9a3a','#76862e','#a0aa48'],fl:[['aster','#a070ff'],['mum','#ffb020'],['aster','#ff70b0'],['mum','#e85a2a'],['aster','#ffffff']],tree:'maple',part:'leaf',tint:'#ffd6b0',desc:'Falling leaves can fool your eyes. Butterflies get faster!'},
 {n:'Winter Conservatory',sh:'Winter',sky:['#bfe2f2','#e4f5fb','#ffffff'],sun:'#ffffff',hills:['#2f7a4a','#246a3e','#1a5a32'],grass:['#2e8a48','#227a3c','#3a9a54'],fl:[['hibiscus','#ff3a4a'],['orchid','#ff8ad8'],['lantana','#ffb02a'],['hibiscus','#ff9a2a'],['orchid','#ffffff']],tree:'glass',part:'mist',tint:'#e8fbff',desc:'Snow outside, rainforest inside! Tropical giants and tricky twins.'}];
let BG=null,FLW=[],AMB=[],CLOUDS=[],GRASS=[];
function groundTop(){return H-S.b-150}
function buildWorld(si){const se=SEASONS[si];BG=document.createElement('canvas');BG.width=c.width;BG.height=c.height;const x=BG.getContext('2d');x.setTransform(DPR*SC,0,0,DPR*SC,0,0);
 let rs=si*977+13;const rr=()=>{rs=(rs*16807)%2147483647;return rs/2147483647};
 const sk=x.createLinearGradient(0,0,0,H);sk.addColorStop(0,se.sky[0]);sk.addColorStop(.55,se.sky[1]);sk.addColorStop(1,se.sky[2]);x.fillStyle=sk;x.fillRect(0,0,W,H);
 // sun with glow
 const sx=W*.78,sy=H*.2;const sg=x.createRadialGradient(sx,sy,4,sx,sy,120);sg.addColorStop(0,se.sun);sg.addColorStop(.25,se.sun+'aa');sg.addColorStop(1,se.sun+'00');x.fillStyle=sg;x.fillRect(sx-130,sy-130,260,260);x.fillStyle=se.sun;x.beginPath();x.arc(sx,sy,26,0,TAU);x.fill();
 const gt=groundTop();
 if(se.tree==='glass'){// snowy outside view through glass
  x.fillStyle='#f4fbff';x.beginPath();x.moveTo(0,gt-120);for(let i=0;i<=20;i++)x.lineTo(i*W/20,gt-130+Math.sin(i*1.3)*14);x.lineTo(W,H);x.lineTo(0,H);x.fill();
  for(let i=0;i<9;i++){const tx=rr()*W,ty=gt-120+rr()*30,h=40+rr()*40;x.fillStyle='#5a7a6a';x.beginPath();x.moveTo(tx,ty-h);x.lineTo(tx-h*.35,ty);x.lineTo(tx+h*.35,ty);x.fill();x.fillStyle='#fff';x.beginPath();x.moveTo(tx,ty-h);x.lineTo(tx-h*.14,ty-h*.6);x.lineTo(tx+h*.14,ty-h*.6);x.fill()}
 }
 // layered hills
 se.hills.forEach((hc,li)=>{const base=gt-90+li*38,amp=26-li*6,fr=.006+li*.003,ph=rr()*6;x.fillStyle=hc;x.beginPath();x.moveTo(0,H);for(let px=0;px<=W+10;px+=10)x.lineTo(px,base-Math.sin(px*fr+ph)*amp-Math.sin(px*fr*2.3+ph)*amp*.4);x.lineTo(W,H);x.fill()});
 // trees
 const tree=(tx,ty,s)=>{x.fillStyle='#6a4a2a';x.fillRect(tx-3*s,ty-30*s,6*s,30*s);
  if(se.tree==='blossom'){for(let k=0;k<7;k++){x.fillStyle=['#ffc8dc','#ffb0cc','#fff0f6'][k%3];x.beginPath();x.arc(tx+(rr()-.5)*36*s,ty-36*s-(rr())*22*s,(12+rr()*8)*s,0,TAU);x.fill()}}
  else if(se.tree==='oak'){for(let k=0;k<7;k++){x.fillStyle=['#3a8a2a','#2f7a22','#4a9a34'][k%3];x.beginPath();x.arc(tx+(rr()-.5)*36*s,ty-38*s-rr()*22*s,(13+rr()*8)*s,0,TAU);x.fill()}}
  else if(se.tree==='maple'){for(let k=0;k<8;k++){x.fillStyle=['#e8541a','#ff8a1a','#c83a1a','#ffb02a'][k%4];x.beginPath();x.arc(tx+(rr()-.5)*38*s,ty-38*s-rr()*24*s,(12+rr()*8)*s,0,TAU);x.fill()}}};
 if(se.tree==='blossom'||se.tree==='oak'||se.tree==='maple'){for(let i=0;i<Math.ceil(W/120);i++)tree(40+i*120+rr()*40,gt-40+rr()*14,.8+rr()*.4);}
 if(se.tree==='none'){// prairie: distant barn + fence
  x.fillStyle='#a8382a';x.fillRect(W*.15,gt-82,40,26);x.fillStyle='#7a2a1e';x.beginPath();x.moveTo(W*.15-4,gt-82);x.lineTo(W*.15+20,gt-98);x.lineTo(W*.15+44,gt-82);x.fill();
  x.strokeStyle='#8a6a3a';x.lineWidth=2;for(let px=0;px<W;px+=26){x.beginPath();x.moveTo(px,gt-30);x.lineTo(px,gt-12);x.stroke()}x.beginPath();x.moveTo(0,gt-26);x.lineTo(W,gt-26);x.moveTo(0,gt-18);x.lineTo(W,gt-18);x.stroke()}
 // meadow ground
 const gg=x.createLinearGradient(0,gt-20,0,H);gg.addColorStop(0,se.grass[2]);gg.addColorStop(.4,se.grass[0]);gg.addColorStop(1,se.grass[1]);x.fillStyle=gg;x.beginPath();x.moveTo(0,H);x.lineTo(0,gt-10);for(let px=0;px<=W+10;px+=12)x.lineTo(px,gt-10-Math.sin(px*.03)*6);x.lineTo(W,H);x.fill();
 // ground texture: tiny far flowers
 for(let i=0;i<W*.6;i++){const fx=rr()*W,fy=gt+rr()*(H-gt);const f=se.fl[Math.floor(rr()*se.fl.length)];x.fillStyle=f[1];x.globalAlpha=.55;x.beginPath();x.arc(fx,fy,1+rr()*1.4,0,TAU);x.fill()}x.globalAlpha=1;
 if(se.tree==='glass'){// conservatory glass frame + hanging plants
  x.strokeStyle='rgba(255,255,255,.75)';x.lineWidth=5;const pw=Math.max(80,W/5);for(let px=pw/2;px<W;px+=pw){x.beginPath();x.moveTo(px,0);x.lineTo(px,gt-20);x.stroke()}
  x.beginPath();x.moveTo(0,H*.12);x.quadraticCurveTo(W/2,-H*.05,W,H*.12);x.stroke();x.lineWidth=3;x.beginPath();x.moveTo(0,gt-110);x.lineTo(W,gt-110);x.stroke();
  for(let i=0;i<Math.ceil(W/70);i++){const lx=i*70+rr()*30;x.fillStyle=['#1f7a3a','#2a8a44','#16602e'][i%3];for(let k=0;k<4;k++){x.save();x.translate(lx,gt+10);x.rotate(-1.2+k*.7+rr()*.3);x.beginPath();x.ellipse(0,-46,14,48,0,0,TAU);x.fill();x.restore()}}
  x.fillStyle='rgba(255,255,255,.12)';x.fillRect(0,0,W,H)}
 // flowers (landing spots) + grass tufts drawn live
 FLW=[];const n=Math.max(6,Math.round(W/46));for(let i=0;i<n;i++){const f=se.fl[i%se.fl.length];const fx=(i+.5)*W/n+(rr()-.5)*18;const hy=H-S.b-58-rr()*92;FLW.push({x:fx,y:hy,base:H-S.b+6,kind:f[0],col:f[1],ph:rr()*6,occ:null,sz:.9+rr()*.35})}
 FLW.sort((a,b)=>a.y-b.y);
 GRASS=[];for(let px=-6;px<W+8;px+=5){GRASS.push({x:px+rr()*4,h:16+rr()*26,ph:rr()*6,c:se.grass[Math.floor(rr()*3)]})}
 CLOUDS=[];if(se.tree!=='glass')for(let i=0;i<4;i++)CLOUDS.push({x:rr()*W,y:30+rr()*H*.25,s:.6+rr()*.7,v:3+rr()*5});
 AMB=[];for(let i=0;i<Math.round(W/16);i++)AMB.push(newAmb(se,true))}
function newAmb(se,init){const k=se.part;return{k,x:R()*W,y:init?R()*H:-10,vx:RR(-6,6),vy:k==='leaf'?RR(14,26):k==='petal'?RR(10,18):k==='seed'?RR(-4,6):k==='mist'?RR(-3,3):RR(-3,3),r:k==='leaf'?RR(4,7):k==='petal'?RR(2,3.6):k==='seed'?RR(2,3):k==='mist'?RR(20,50):RR(.8,1.8),ph:R()*6,rot:R()*6,c:k==='leaf'?PICK(['#e8541a','#ff9a1a','#c83a1a','#ffc02a']):k==='petal'?PICK(['#ffc8dc','#fff0f6','#ffb0cc']):'#fff'}}
function updWorld(dt,t){for(const cl of CLOUDS){cl.x+=cl.v*dt;if(cl.x>W+80)cl.x=-80}
 const se=SEASONS[curSeason()];for(let i=0;i<AMB.length;i++){const a=AMB[i];a.ph+=dt;a.x+=(a.vx+Math.sin(a.ph*1.3)*(a.k==='leaf'?18:6))*dt;a.y+=a.vy*dt;a.rot+=dt*(a.k==='leaf'?2.4:1);
  if(a.k==='pollen'||a.k==='seed'||a.k==='mist'){a.y+=Math.sin(a.ph*.7)*4*dt;if(a.x<-60)a.x=W+50;if(a.x>W+60)a.x=-50;if(a.y<-60)a.y=H;if(a.y>H+60)a.y=-50}
  else if(a.y>H+10||a.x<-30||a.x>W+30)AMB[i]=newAmb(se,false)}}
function drawSky(x,t){if(BG)x.drawImage(BG,0,0,W,H);
 for(const cl of CLOUDS){x.fillStyle='rgba(255,255,255,.85)';const s=cl.s;x.beginPath();x.ellipse(cl.x,cl.y,34*s,13*s,0,0,TAU);x.ellipse(cl.x+20*s,cl.y-8*s,22*s,14*s,0,0,TAU);x.ellipse(cl.x-18*s,cl.y-5*s,18*s,11*s,0,0,TAU);x.fill()}}
function drawAmb(x,front){for(const a of AMB){if((a.k==='mist')===front)continue;x.save();x.translate(a.x,a.y);x.rotate(a.rot);
  if(a.k==='leaf'){x.fillStyle=a.c;x.scale(1,Math.abs(Math.sin(a.ph*2))*.8+.2);x.beginPath();x.moveTo(-a.r,0);x.quadraticCurveTo(0,-a.r,a.r,0);x.quadraticCurveTo(0,a.r,-a.r,0);x.fill();x.strokeStyle='rgba(90,40,10,.6)';x.lineWidth=.7;x.beginPath();x.moveTo(-a.r,0);x.lineTo(a.r,0);x.stroke()}
  else if(a.k==='petal'){x.fillStyle=a.c;x.scale(1,Math.abs(Math.sin(a.ph*1.6))*.7+.3);x.beginPath();x.ellipse(0,0,a.r,a.r*.6,0,0,TAU);x.fill()}
  else if(a.k==='seed'){x.strokeStyle='rgba(255,255,255,.8)';x.lineWidth=.6;for(let k=0;k<6;k++){x.beginPath();x.moveTo(0,0);x.lineTo(Math.cos(k)*a.r*2,Math.sin(k)*a.r*2-a.r);x.stroke()}x.fillStyle='#8a6a3a';x.beginPath();x.arc(0,0,.9,0,TAU);x.fill()}
  else if(a.k==='mist'){x.globalAlpha=.07;x.fillStyle='#fff';x.beginPath();x.arc(0,0,a.r,0,TAU);x.fill()}
  else{x.globalAlpha=.55+.4*Math.sin(a.ph*3);x.fillStyle='#fff8c0';x.beginPath();x.arc(0,0,a.r,0,TAU);x.fill()}
  x.restore()}}
function flowerHead(f,t){return[f.x+Math.sin(t*1.3+f.ph)*2.6*(1-(f.y-groundTop())/200),f.y]}
function drawFlower(x,f,t){const [hx,hy]=flowerHead(f,t);const s=f.sz;x.strokeStyle='#2f7a2a';x.lineWidth=2.4;x.beginPath();x.moveTo(f.x,f.base);x.quadraticCurveTo(f.x+(hx-f.x)*.2,(f.base+hy)/2,hx,hy);x.stroke();
 x.fillStyle='#3e9a34';x.beginPath();x.ellipse(f.x+(hx-f.x)*.4+6,(f.base+hy)/2+10,8,3,-.5,0,TAU);x.fill();
 x.save();x.translate(hx,hy);const c=f.col;
 switch(f.kind){
  case 'tulip':x.fillStyle=c;x.beginPath();x.moveTo(-8*s,-2*s);x.lineTo(-8*s,-12*s);x.lineTo(-4*s,-8*s);x.lineTo(0,-14*s);x.lineTo(4*s,-8*s);x.lineTo(8*s,-12*s);x.lineTo(8*s,-2*s);x.quadraticCurveTo(0,6*s,-8*s,-2*s);x.fill();break;
  case 'bell':x.fillStyle=c;for(let k=-1;k<=1;k++){x.beginPath();x.ellipse(k*6*s,k?4*s:-2*s,4*s,6*s,0,0,TAU);x.fill()}break;
  case 'sunflower':x.fillStyle=c;for(let k=0;k<14;k++){x.save();x.rotate(k*TAU/14);x.beginPath();x.ellipse(0,-10*s,3.2*s,7*s,0,0,TAU);x.fill();x.restore()}x.fillStyle='#6a3a12';x.beginPath();x.arc(0,0,7*s,0,TAU);x.fill();break;
  case 'zinnia':case 'mum':case 'aster':case 'daisy':{const n=f.kind==='mum'?18:f.kind==='aster'?16:12,l=f.kind==='daisy'?8:7;x.fillStyle=c;for(let k=0;k<n;k++){x.save();x.rotate(k*TAU/n);x.beginPath();x.ellipse(0,-l*.6*s,2.2*s,l*.62*s,0,0,TAU);x.fill();x.restore()}x.fillStyle=f.kind==='daisy'||f.kind==='aster'?'#ffc81a':'#c8501a';x.beginPath();x.arc(0,0,3.4*s,0,TAU);x.fill();break}
  case 'lavender':x.fillStyle=c;for(let k=0;k<6;k++){x.beginPath();x.ellipse(0,-k*4*s,3*s,2.6*s,0,0,TAU);x.fill()}break;
  case 'cone':x.fillStyle=c;for(let k=0;k<10;k++){x.save();x.rotate(PI/2+(k-4.5)*.3);x.beginPath();x.ellipse(0,9*s,2.2*s,7*s,0,0,TAU);x.fill();x.restore()}x.fillStyle='#8a4a1a';x.beginPath();x.ellipse(0,-2*s,5*s,6*s,0,0,TAU);x.fill();break;
  case 'golden':x.fillStyle=c;for(let k=0;k<9;k++){x.beginPath();x.arc(Math.sin(k*1.7)*5*s,-k*2.2*s,2.6*s,0,TAU);x.fill()}break;
  case 'milkweed':x.fillStyle=c;for(let k=0;k<9;k++){x.beginPath();x.arc(Math.cos(k*.7)*6*s,Math.sin(k*.7)*4*s-2*s,2.8*s,0,TAU);x.fill()}x.fillStyle='#fff';x.globalAlpha=.6;x.beginPath();x.arc(0,-3*s,2.4*s,0,TAU);x.fill();break;
  case 'hibiscus':x.fillStyle=c;for(let k=0;k<5;k++){x.save();x.rotate(k*TAU/5);x.beginPath();x.ellipse(0,-7*s,6*s,8*s,0,0,TAU);x.fill();x.restore()}x.strokeStyle='#ffe060';x.lineWidth=1.6;x.beginPath();x.moveTo(0,0);x.lineTo(5*s,-10*s);x.stroke();break;
  case 'orchid':x.fillStyle=c;for(let k=0;k<5;k++){x.save();x.rotate(k*TAU/5+.3);x.beginPath();x.ellipse(0,-6*s,4*s,7*s,0,0,TAU);x.fill();x.restore()}x.fillStyle='#d03a8a';x.beginPath();x.arc(0,1*s,3*s,0,TAU);x.fill();break;
  case 'lantana':for(let k=0;k<10;k++){x.fillStyle=k<4?'#ffe040':c;x.beginPath();x.arc(Math.cos(k*2.4)*(k<4?2:6)*s,Math.sin(k*2.4)*(k<4?2:5)*s,2.6*s,0,TAU);x.fill()}break;
 }
 x.restore()}
function drawGrass(x,t){const b=H-S.b+8;for(const gs of GRASS){const sw=Math.sin(t*1.6+gs.ph+gs.x*.02)*4;x.strokeStyle=gs.c;x.lineWidth=2.2;x.beginPath();x.moveTo(gs.x,b);x.quadraticCurveTo(gs.x+sw*.4,b-gs.h*.5,gs.x+sw,b-gs.h);x.stroke()}
 if(S.b>0){x.fillStyle=SEASONS[curSeason()].grass[1];x.fillRect(0,H-S.b+6,W,S.b)}}
