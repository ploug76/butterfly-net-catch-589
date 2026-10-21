# Bot playthrough of every level: checks each is winnable and calibrates time/stars. skill: 'good' or 'casual'
import sys,asyncio,json
from playwright.async_api import async_playwright
URL='http://localhost:8800/butterfly-net-catch/?nopause&all'
SKILL=sys.argv[1] if len(sys.argv)>1 else 'casual'
LEVELS=[int(a)-1 for a in sys.argv[2:]] or list(range(30))
BOT=r'''([L,skill])=>{window.__noLoop=true;__T.startLevel(L);__T.go();const dt=1/30;let think=0,t=0;const react=skill=='good'?.9:1.5,err=skill=='good'?8:14,care=skill=='good'?.9:.65;
 const r=netDef().r;
 function arcPts(x,y){const dir=x<W/2?1:-1;const px=CL(LERP(x,W/2,.3),20,W-20),py=H+110,Rr=HYP(x-px,y-py),c=Math.atan2(y-py,x-px),s=Math.min(.4,48/Rr);const a0=c-dir*s*.55,a1=c+dir*s;const o=[];for(let i=0;i<=12;i++){const a=LERP(a0,a1,i/12);o.push([px+Math.cos(a)*Rr,py+Math.sin(a)*Rr])}return o}
 while(state==='play'&&t<400){t+=dt;update(dt);think-=dt;
  if(think<=0&&NET.mode==='idle'&&NET.cool<=0&&NET.stun<=0){const cd=curCard();think=(react+BF.length*(skill=='good'?.04:.07)*(cd.t=='M'||cd.t=='F'?1.5:1))*(0.7+Math.random()*.6);
   const cand=BF.filter(b=>['fly','land','toFlower'].includes(b.st)&&b.x>10&&b.x<W-10&&(SP[b.k].rare||cardMatch(cd,b.k)));
   let best=null,bs=-1e9;for(const b of cand){const tx=b.x+b.vx*.05+(Math.random()-.5)*err*2,ty=b.y+b.vy*.05+(Math.random()-.5)*err*2;const pts=arcPts(tx,ty);
     let bad=0,good=0;for(const o of BF){if(!['fly','land','toFlower','leave'].includes(o.st))continue;const hit=pts.some(p=>HYP(p[0]-o.x,p[1]-o.y)<r+o.u*.42+4);if(!hit)continue;if(SP[o.k].rare||cardMatch(cd,o.k))good++;else bad++}
     for(const e of BEES)if(pts.some(p=>HYP(p[0]-e.x,p[1]-e.y)<r+10))bad+=2;
     const sc=good*2-bad*(Math.random()<care?3:0)+(b.st==='land'?1:0);if(sc>bs){bs=sc;best=[tx,ty,good,bad]}}
   if(best&&bs>0)netPress(best[0],best[1],7)}}
 const g=__T.get();return{L:L+1,win:!!(g.result&&g.result.win),stars:g.result&&g.result.stars||0,score:g.score,timeUsed:+(t).toFixed(1),limit:LEVELS[L].time,left:+g.timeLeft.toFixed(1),wrongs:g.wrongs,combos:g.combos,swings:NET.swings}}'''
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch();pg=await b.new_page(viewport={'width':390,'height':844});errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
    await pg.goto(URL);await pg.wait_for_timeout(500);wins=0;tot=0
    for L in LEVELS:
      r=await pg.evaluate(BOT,[L,SKILL]);tot+=1;wins+=r['win'];print(json.dumps(r))
    print('WINS',wins,'/',tot,'ERRS',errs);await b.close()
asyncio.run(main())
