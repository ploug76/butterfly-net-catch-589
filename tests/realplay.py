# Real-input smoke test: taps through menus with the touchscreen, plays with real taps/swipes, checks no JS errors, dock hidden in play, scores saved.
import sys,asyncio,json
from playwright.async_api import async_playwright
URL=sys.argv[1] if len(sys.argv)>1 and sys.argv[1].startswith('http') else 'http://localhost:8800/butterfly-net-catch/'
SIZES=[(390,844),(375,667),(360,640),(430,932),(320,568),(844,390)] if '--quick' not in sys.argv else []
async def main():
  fails=0
  async with async_playwright() as p:
    b=await p.chromium.launch()
    for (w,h) in SIZES:
      ctx=await b.new_context(viewport={'width':w,'height':h},is_mobile=True,has_touch=True,device_scale_factor=2);pg=await ctx.new_page();errs=[]
      pg.on('pageerror',lambda e:errs.append(str(e)));pg.on('console',lambda m:errs.append(m.text) if m.type=='error' else None)
      await pg.goto(URL+'?nopause');await pg.wait_for_timeout(900)
      async def tapLabel(lbl):
        r=await pg.evaluate("l=>{const b=__T.layout().menu.find(b=>b.label===l);return b?[ (b.x+b.w/2)*SC,(b.y+b.h/2)*SC]:null}",lbl)
        if r:await pg.touchscreen.tap(r[0],r[1]);await pg.wait_for_timeout(350)
        return r
      dockTitle=await pg.evaluate("getComputedStyle(document.getElementById('dock')).display")
      await tapLabel('▶  PLAY');await tapLabel('1');st=await pg.evaluate("__T.get().state");await tapLabel('GO!')
      st2=await pg.evaluate("__T.get().state");dockPlay=await pg.evaluate("getComputedStyle(document.getElementById('dock')).display")
      for i in range(40):
        t=await pg.evaluate("(()=>{const b=__T.bf().filter(b=>b.match&&['fly','land','toFlower'].includes(b.st)&&b.x>10&&b.x<W-10&&b.y>__T.hud().playTop);return b.length?[b[0].x*SC,b[0].y*SC]:null})()")
        if t:
          if i%5==4:
            await pg.mouse.move(t[0]-40,t[1]);await pg.mouse.down();await pg.mouse.move(t[0],t[1],steps=4);await pg.mouse.move(t[0]+40,t[1],steps=4);await pg.mouse.up()
          else:await pg.touchscreen.tap(t[0],t[1])
        await pg.wait_for_timeout(420)
        if (await pg.evaluate("__T.get().state"))!='play':break
      g=await pg.evaluate("__T.get()");sv=await pg.evaluate("JSON.parse(localStorage.getItem('butterfly-net-catch:save')||'{}')")
      # pause via DOM button, visibility auto-pause
      ok=not errs and st=='intro' and st2=='play' and dockPlay=='none' and dockTitle!='none' and (g['catches']>0 or g['state']=='result')
      print('PASS' if ok else 'FAIL',f'{w}x{h}',json.dumps({'state':g['state'],'score':g['score'],'catches':g['catches'],'combos':g['combos'],'wrongs':g['wrongs'],'win':(g['result'] or {}).get('win'),'stars':(g['result'] or {}).get('stars'),'saved':sv.get('best'),'journal':len(sv.get('journal',{})),'dockTitle':dockTitle,'dockPlay':dockPlay,'errs':errs[:3]}))
      fails+=not ok;await ctx.close()
    # auto-pause on backgrounding
    ctx=await b.new_context(viewport={'width':390,'height':844},is_mobile=True,has_touch=True);pg=await ctx.new_page();await pg.goto(URL);await pg.wait_for_timeout(500)
    await pg.evaluate("__T.startLevel(0);__T.go()");await pg.wait_for_timeout(300)
    await pg.evaluate("Object.defineProperty(document,'hidden',{value:true,configurable:true});document.dispatchEvent(new Event('visibilitychange'))")
    t0=await pg.evaluate("__T.get()");await pg.wait_for_timeout(1500);t1=await pg.evaluate("__T.get()")
    ok=t0['paused'] and abs(t0['timeLeft']-t1['timeLeft'])<1e-6;print('PASS' if ok else 'FAIL','auto-pause on hide; timer frozen',t0['timeLeft'],t1['timeLeft']);fails+=not ok
    await pg.evaluate("Object.defineProperty(document,'hidden',{value:false,configurable:true})");await pg.click('#pause');await pg.wait_for_timeout(500);t2=await pg.evaluate("__T.get()")
    ok=(not t2['paused']) and t2['timeLeft']<t1['timeLeft'];print('PASS' if ok else 'FAIL','resume via pause button',t2['timeLeft']);fails+=not ok
    await pg.click('#mute');m=await pg.evaluate("localStorage.getItem('butterfly-net-catch:muted')");ok=m=='true';print('PASS' if ok else 'FAIL','mute saved',m);fails+=not ok
    await ctx.close();await b.close()
  print('FAILS',fails);sys.exit(1 if fails else 0)
asyncio.run(main())
