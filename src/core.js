// ================= core: utils, layout, storage, audio
const GAME_ID='butterfly-net-catch';
const c=document.getElementById('c'),g=c.getContext('2d'),$=id=>document.getElementById(id);
const TAU=Math.PI*2,PI=Math.PI,CL=(v,a,b)=>v<a?a:v>b?b:v,LERP=(a,b,k)=>a+(b-a)*k,HYP=Math.hypot;
let RS=1234567;const R=()=>Math.random();const RR=(a,b)=>a+(b-a)*R();const PICK=a=>a[Math.floor(R()*a.length)];
const EASE={out:t=>1-Math.pow(1-t,3),inOut:t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2,back:t=>{const c1=1.70158,c3=c1+1;return 1+c3*Math.pow(t-1,3)+c1*Math.pow(t-1,2)}};
const QS=new URLSearchParams(location.search);
// layout: logical units; SC = css px per logical unit; logical width ~400 in portrait
let SAFE={t:0,r:0,b:0,l:0},S={t:0,r:0,b:0,l:0},DPR=1,VW=0,VH=0,SC=1,W=400,H=720,OXs=0,OYs=0;
function readSafe(){try{if(window.__SAFE){SAFE=Object.assign({t:0,r:0,b:0,l:0},window.__SAFE);return}const d=document.createElement('div');d.style.cssText='position:fixed;top:0;left:0;width:0;height:0;visibility:hidden;pointer-events:none;padding:env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left)';document.body.appendChild(d);const cs=getComputedStyle(d);SAFE={t:parseFloat(cs.paddingTop)||0,r:parseFloat(cs.paddingRight)||0,b:parseFloat(cs.paddingBottom)||0,l:parseFloat(cs.paddingLeft)||0};d.remove()}catch(e){}}
function resizeCanvas(){DPR=Math.min(devicePixelRatio||1,2.5);readSafe();VW=innerWidth;VH=innerHeight;SC=Math.min(VW/400,VH/680);if(VW>VH)SC=Math.min(VW/560,VH/600);SC=Math.max(.5,SC);
 W=VW/SC;H=VH/SC;S={t:SAFE.t/SC,r:SAFE.r/SC,b:SAFE.b/SC,l:SAFE.l/SC};c.width=Math.round(VW*DPR);c.height=Math.round(VH*DPR);if(window.__onResize)__onResize()}
addEventListener('resize',resizeCanvas);
// DOM top-right buttons in logical rects
function domBtnRects(){const o=[];document.querySelectorAll('.tb').forEach(e=>{if(getComputedStyle(e).display==='none')return;const b=e.getBoundingClientRect();o.push({k:'dom-'+e.id,x:b.left/SC,y:b.top/SC,w:b.width/SC,h:b.height/SC})});return o}
function topBtnZone(){return{x:W-(150+SAFE.r)/SC,y:0,w:(150+SAFE.r)/SC,h:(52+SAFE.t)/SC}}
const ov=(a,b,p=0)=>a.x<b.x+b.w+p&&b.x<a.x+a.w+p&&a.y<b.y+b.h+p&&b.y<a.y+a.h+p;
// ---------- storage
const ST={get(k,d){try{const v=localStorage.getItem(GAME_ID+':'+k);return v==null?d:JSON.parse(v)}catch(e){return d}},set(k,v){try{localStorage.setItem(GAME_ID+':'+k,JSON.stringify(v))}catch(e){}}};
let SAVE=Object.assign({best:{},stars:{},journal:{},net:0,endless:0,total:0,seen:{}},ST.get('save',{}));
function save(){ST.set('save',SAVE)}
// ---------- audio
let ac=null,master=null,musicGain=null,sfxGain=null,muted=ST.get('muted',false),noiseBuf=null;
function A(){try{if(!ac){ac=new(window.AudioContext||webkitAudioContext)();master=ac.createGain();master.gain.value=muted?0:1;master.connect(ac.destination);
 const comp=ac.createDynamicsCompressor();comp.connect(master);sfxGain=ac.createGain();sfxGain.gain.value=.55;sfxGain.connect(comp);musicGain=ac.createGain();musicGain.gain.value=.2;musicGain.connect(comp);
 noiseBuf=ac.createBuffer(1,ac.sampleRate*1,ac.sampleRate);const d=noiseBuf.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1}
 if(ac.state==='suspended')ac.resume()}catch(e){}return ac}
function setMute(m){muted=m;ST.set('muted',m);$('mute').textContent=m?'🔇':'🔊';if(master)master.gain.setTargetAtTime(m?0:1,ac.currentTime,.02)}
function tone(f,d,type='sine',v=.15,when=0,dest,slide){if(!ac||muted)return;const t=ac.currentTime+when;const o=ac.createOscillator(),gn=ac.createGain();o.type=type;o.frequency.setValueAtTime(f,t);if(slide)o.frequency.exponentialRampToValueAtTime(slide,t+d);
 gn.gain.setValueAtTime(0,t);gn.gain.linearRampToValueAtTime(v,t+.008);gn.gain.exponentialRampToValueAtTime(.0008,t+d);o.connect(gn);gn.connect(dest||sfxGain);o.start(t);o.stop(t+d+.05)}
function noise(d,f0,f1,v=.2,when=0,q=1.2){if(!ac||muted)return;const t=ac.currentTime+when;const s=ac.createBufferSource();s.buffer=noiseBuf;const bp=ac.createBiquadFilter();bp.type='bandpass';bp.Q.value=q;bp.frequency.setValueAtTime(f0,t);bp.frequency.exponentialRampToValueAtTime(f1,t+d);
 const gn=ac.createGain();gn.gain.setValueAtTime(0,t);gn.gain.linearRampToValueAtTime(v,t+d*.3);gn.gain.exponentialRampToValueAtTime(.001,t+d);s.connect(bp);bp.connect(gn);gn.connect(sfxGain);s.start(t,R()*.5);s.stop(t+d+.05)}
const NOTE=n=>440*Math.pow(2,(n-69)/12);
const SFX={
 swoosh(p=1){noise(.22,500*p,2600*p,.28,0,.9);noise(.16,1200,5000,.06,.03,.6)},
 catch(n=0){const b=[76,79,81,84,86,88,91][Math.min(n,6)];tone(NOTE(b),.25,'triangle',.14);tone(NOTE(b+7),.3,'sine',.09,.06);tone(NOTE(b+12),.35,'sine',.05,.12);noise(.08,300,180,.12)},
 combo(n){for(let i=0;i<n+2;i++)tone(NOTE(72+[0,4,7,12,16,19,24][i%7]),.22,'triangle',.11,i*.055)},
 wrong(){tone(220,.18,'square',.07,0,null,150);tone(165,.28,'square',.06,.12,null,110)},
 bee(){if(!ac||muted)return;const t=ac.currentTime;const o=ac.createOscillator(),l=ac.createOscillator(),lg=ac.createGain(),gn=ac.createGain();o.type='sawtooth';o.frequency.value=180;l.frequency.value=28;lg.gain.value=40;l.connect(lg);lg.connect(o.frequency);gn.gain.setValueAtTime(.09,t);gn.gain.exponentialRampToValueAtTime(.001,t+.5);const f=ac.createBiquadFilter();f.type='lowpass';f.frequency.value=1400;o.connect(f);f.connect(gn);gn.connect(sfxGain);o.start(t);l.start(t);o.stop(t+.55);l.stop(t+.55);tone(330,.12,'square',.05,.05,null,200)},
 rare(){for(let i=0;i<10;i++)tone(NOTE(84+[0,2,4,7,9,12,14,16,19,24][i]),.4,'sine',.07,i*.04);noise(.6,4000,9000,.05,0,2)},
 card(){[0,4,7,12].forEach((s,i)=>tone(NOTE(72+s),.5,'triangle',.1,i*.07));tone(NOTE(60),.7,'sine',.08,0)},
 clear(){const m=[72,76,79,84,79,84,88];m.forEach((n,i)=>{tone(NOTE(n),.32,'triangle',.12,i*.12);tone(NOTE(n-12),.32,'sine',.07,i*.12)})},
 fail(){[67,66,65,63].forEach((n,i)=>tone(NOTE(n),i==3?.7:.28,'triangle',.11,i*.25))},
 tick(){tone(1200,.05,'square',.04);tone(600,.06,'sine',.05,.0)},
 click(){tone(880,.05,'triangle',.08);tone(1320,.04,'sine',.04,.02)},
 star(i){tone(NOTE(79+i*5),.4,'triangle',.12);tone(NOTE(91+i*5),.3,'sine',.05,.05)},
 whoosh(){noise(.35,300,1200,.12,0,.7)},
 land(){tone(NOTE(96),.08,'sine',.03)}
};
// ---------- music: gentle generative pastoral; sequenced on game time (stops when paused)
const MUS={on:true,t:0,step:0,season:0,bpm:84};
const KEYS=[{root:60,scale:[0,2,4,7,9],prog:[0,9,5,7],bpm:86},{root:62,scale:[0,2,4,7,9],prog:[0,7,9,5],bpm:96},{root:57,scale:[0,2,4,7,9],prog:[0,5,0,7],bpm:80},{root:55,scale:[0,3,5,7,10],prog:[0,8,3,10],bpm:76},{root:64,scale:[0,2,4,6,7,11],prog:[0,2,9,7],bpm:72},{root:60,scale:[0,2,4,7,9],prog:[0,5,7,5],bpm:90}];
function musicUpdate(dt){if(!ac||muted||!MUS.on)return;const K=KEYS[MUS.season]||KEYS[0];const sl=60/K.bpm/2;MUS.t+=dt;if(MUS.t<sl)return;MUS.t-=sl;if(MUS.t>sl)MUS.t=0;const s=MUS.step++;const bar=Math.floor(s/16)%4,pos=s%16;
 const ch=K.root+K.prog[bar];const md=musicGain;
 if(pos===0){[0,4,7].forEach(iv=>{const n=ch+(iv==4&&K.scale[1]==2&&K.scale.length==5?4:iv);tone(NOTE(n-12),sl*15,'sine',.05,0,md)});tone(NOTE(ch-24),sl*7,'triangle',.09,0,md)}
 if(pos===8)tone(NOTE(ch-24+7),sl*6,'triangle',.07,0,md);
 if(pos%2===0&&R()<.62){const sc=K.scale;const deg=Math.floor(RR(0,sc.length*2));const n=K.root+12+sc[deg%sc.length]+12*Math.floor(deg/sc.length);tone(NOTE(n),sl*2.6,'triangle',.06,0,md);if(R()<.3)tone(NOTE(n+12),sl*1.5,'sine',.025,sl,md)}
 if(pos%4===2&&R()<.4)tone(NOTE(K.root+24+K.scale[Math.floor(R()*K.scale.length)]),sl*1.2,'sine',.025,0,md)}
