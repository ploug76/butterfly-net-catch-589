// ================= boot + loop + test hooks
window.__onResize=()=>{clearSprites();layoutHUD();const se=curSeason();buildWorld(se);if(NET.mode==='idle'){NET.rest={x:CL(NET.rest.x,30,W-30),y:H-S.b-70}}};
resizeCanvas();setMute(muted);toTitle();
let last=performance.now();
function frame(now){const dt=Math.min(.05,Math.max(0,(now-last)/1000));last=now;RT+=dt;const panelOpen=$('panel').style.display==='flex';if(!paused&&!panelOpen&&!window.__noLoop)update(dt);render();requestAnimationFrame(frame)}
requestAnimationFrame(frame);
if('serviceWorker' in navigator&&location.protocol.startsWith('http'))navigator.serviceWorker.register('sw.js').catch(()=>{});
// test hooks
window.__T={startLevel:i=>{startLevel(i)},go:()=>goPlay(),endless:()=>startEndless(),toMap,toTitle,setState:s=>{state=s;syncButtons()},
 step:(dt=1/60,n=1)=>{for(let i=0;i<n;i++){update(dt)}render()},render,
 get:()=>({state,paused,score,timeLeft,ci,cards:cards.map(c=>({t:c.t,n:c.n,got:c.got})),streak,combos,wrongs,catches,net:{mode:NET.mode,cool:NET.cool,stun:NET.stun,hx:NET.hx,hy:NET.hy},nBF:BF.length,nBees:BEES.length,result,LVi,endlessN}),
 bf:()=>BF.map(b=>({k:b.k,x:b.x,y:b.y,st:b.st,u:b.u,match:!!(curCard()&&cardMatch(curCard(),b.k)),rare:!!SP[b.k].rare})),bees:()=>BEES.map(e=>({x:e.x,y:e.y,st:e.st})),
 press:(x,y)=>netPress(x,y,99),move:(x,y)=>netMove(x,y,99),release:()=>netRelease(99),
 layout:()=>({SC,W,H,S,UIR:UIR.slice(),menu:menuBtns.map(b=>({x:b.x,y:b.y,w:b.w,h:b.h,label:b.label,dis:b.dis})),modal}),
 tap:(label)=>{const b=menuBtns.find(b=>b.label===label);if(b&&!b.dis){b.fn();return true}return false},
 pause:v=>togglePause(v),win:()=>{for(const cd of cards){cd.got=cd.n}ci=cards.length-1;winLevel()},setTime:t=>{timeLeft=t},
 save:()=>SAVE,setSave:o=>{SAVE=Object.assign(SAVE,o);save()},levels:()=>LEVELS.map(L=>({time:L.time,tot:L.tot,n:L.n})),journalDetail:k=>{jDetail=k},setJPage:p=>{jPage=p},
 label:(t,x,y)=>addLabel(t,x,y),banner:t=>banner(t),hud:()=>HUD};
