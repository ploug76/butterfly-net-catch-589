# Overlap test: HUD pills, target card, banner, every floating label, canvas buttons, modal text, DOM buttons.
# Checks every screen + many frames of real (bot-driven) play at 8 phone sizes incl. iPhone safe areas and landscape.
import sys,asyncio,json
from playwright.async_api import async_playwright
URL=sys.argv[1] if len(sys.argv)>1 else 'http://localhost:8800/butterfly-net-catch/'
VIEWS=[(390,844,None),(375,667,None),(360,640,None),(430,932,None),(320,568,None),(390,844,{'t':47,'b':34}),(844,390,{'l':47,'r':47,'b':21}),(667,375,None)]
CHECK=r'''window.__chk=function(tag){const L=__T.layout(),U=L.UIR,S=L.S,bad=[];const ov=(a,b)=>a.x<b.x+b.w-.5&&b.x<a.x+a.w-.5&&a.y<b.y+b.h-.5&&b.y<a.y+a.h-.5;
 const A=U.filter(r=>['hud','lbl','btn','dom'].includes(r.grp)),T=U.filter(r=>r.grp==='text'),M=U.filter(r=>r.grp==='modal'),D=U.filter(r=>r.grp==='dom');
 for(let i=0;i<A.length;i++)for(let j=i+1;j<A.length;j++)if(ov(A[i],A[j]))bad.push([tag,A[i].k,A[j].k]);
 for(const t of T){for(const a of A)if(ov(t,a))bad.push([tag,'text:'+t.k,a.k]);for(const t2 of T)if(t2!==t&&t.k<t2.k&&ov(t,t2))bad.push([tag,'text-text',t.k,t2.k])}
 for(const m of M){for(const d of D)if(ov(m,d))bad.push([tag,'modal-dom',d.k]);}
 for(const r of U){if(r.grp==='dom')continue;if(r.x<S.l-.5||r.y<S.t-.5||r.x+r.w>L.W-S.r+.5||r.y+r.h>L.H-S.b+.5)bad.push([tag,'offscreen',r.k,Math.round(r.x),Math.round(r.y),Math.round(r.w),Math.round(r.h)])}
 if(M.length){for(const r of U)if((r.grp==='btn'||r.grp==='text')&&!(r.x>=M[0].x-.5&&r.y>=M[0].y-.5&&r.x+r.w<=M[0].x+M[0].w+.5&&r.y+r.h<=M[0].y+M[0].h+.5))bad.push([tag,'outside-modal',r.k])}
 return bad};'''
PLAY=r'''([Lv,secs])=>{window.__noLoop=true;if(Lv<0)__T.endless();else __T.startLevel(Lv);__T.render();let bad=__chk('intro'+Lv);__T.go();const dt=1/30;let t=0,think=0,frames=0;
 while(state==='play'&&t<secs){t+=dt;update(dt);think-=dt;if(think<=0&&NET.mode==='idle'){think=.35+Math.random()*.5;const cd=curCard();const c=BF.filter(b=>['fly','land','toFlower'].includes(b.st)&&b.x>5&&b.x<W-5);if(c.length){const b=Math.random()<.75?(c.find(b=>cd&&cardMatch(cd,b.k))||c[0]):c[Math.floor(Math.random()*c.length)];netPress(b.x,b.y,5)}}
  if(Math.random()<.02)addLabel('+250 test',Math.random()*W,HUD.playTop+Math.random()*(HUD.fieldBot-HUD.playTop));if(Math.random()<.004)banner('Banner test','#fff','rgba(0,0,0,.8)',1,'sub');
  if(++frames%3===0){render();bad=bad.concat(__chk('play'+Lv))}}
 // stress: many labels at one spot
 if(state==='play'){for(let i=0;i<30;i++)addLabel('+100 stress',W/2,HUD.playTop+60);render();bad=bad.concat(__chk('stress'+Lv));__T.pause(true);render();bad=bad.concat(__chk('pause'+Lv));__T.pause(false);
  __T.win();render();bad=bad.concat(__chk('result-win'+Lv));for(let i=0;i<40;i++)update(1/20);render();bad=bad.concat(__chk('result-win-end'+Lv))}
 else{render();bad=bad.concat(__chk('result'+Lv))}
 return{frames,bad:bad.length,sample:bad.slice(0,5)}}'''
MENUS=r'''()=>{window.__noLoop=true;let bad=[];__T.setSave({journal:Object.fromEntries(Object.keys(SP).map(k=>[k,{n:3,first:1}])),stars:Object.fromEntries([...Array(30).keys()].map(i=>[i,2]))});
 __T.toTitle();__T.render();bad=bad.concat(__chk('title'));__T.toMap();for(let s=0;s<5;s++){mapSeason=s;__T.render();bad=bad.concat(__chk('map'+s))}
 state='journal';for(let p=0;p<4;p++){__T.setJPage(p);__T.render();bad=bad.concat(__chk('journal'+p))}for(const k of ['monarch','rajahbrooke','redspottedpurple']){__T.journalDetail(k);__T.render();bad=bad.concat(__chk('detail-'+k))}__T.journalDetail(null);
 state='nets';__T.render();bad=bad.concat(__chk('nets'));
 // lose result
 __T.startLevel(29);__T.go();__T.setTime(.01);update(.05);__T.render();bad=bad.concat(__chk('lose'));
 __T.setSave({journal:{},stars:{}});__T.toTitle();return{bad:bad.length,sample:bad.slice(0,6)}}'''
async def main():
  tot=0;fr=0
  async with async_playwright() as p:
    b=await p.chromium.launch()
    for (w,h,safe) in VIEWS:
      pg=await b.new_page(viewport={'width':w,'height':h},is_mobile=True,has_touch=True);errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
      if safe:await pg.add_init_script('window.__SAFE='+json.dumps(safe))
      await pg.goto(URL+'?nopause&all');await pg.wait_for_timeout(500);await pg.evaluate(CHECK)
      r=await pg.evaluate(MENUS);tot+=r['bad']
      if r['bad']:print(w,h,safe,'MENUS',r)
      for Lv in [0,5,8,13,17,22,26,29,-1]:
        r=await pg.evaluate(PLAY,[Lv,40]);tot+=r['bad'];fr+=r['frames']
        if r['bad']:print(w,h,safe,'L',Lv,r)
      if errs:print('PAGE ERRORS',errs);tot+=len(errs)
      print(f"{w}x{h}{' safe' if safe else ''} done");await pg.close()
    await b.close()
  print(f'TOTAL frames {fr} overlaps {tot}');sys.exit(1 if tot else 0)
asyncio.run(main())
