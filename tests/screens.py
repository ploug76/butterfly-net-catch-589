import sys,asyncio,json
from playwright.async_api import async_playwright
URL=sys.argv[1] if len(sys.argv)>1 else 'http://localhost:8800/butterfly-net-catch/'
W,H=(int(sys.argv[2]),int(sys.argv[3])) if len(sys.argv)>3 else (390,844)
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch();pg=await b.new_page(viewport={'width':W,'height':H},device_scale_factor=2,is_mobile=True,has_touch=True)
    errs=[];pg.on('pageerror',lambda e:errs.append(str(e)));pg.on('console',lambda m:errs.append(m.text) if m.type=='error' else None)
    await pg.goto(URL+'?nopause&all');await pg.wait_for_timeout(1200);await pg.screenshot(path='/tmp/s_title.png')
    await pg.evaluate("__T.toMap()");await pg.wait_for_timeout(300);await pg.screenshot(path='/tmp/s_map.png')
    await pg.evaluate("__T.startLevel(8)");await pg.wait_for_timeout(600);await pg.screenshot(path='/tmp/s_intro.png')
    await pg.evaluate("__T.go()");await pg.wait_for_timeout(2500)
    await pg.evaluate("(()=>{const b=__T.bf().find(b=>b.match&&b.st!='caught');if(b)__T.press(b.x,b.y)})()");await pg.wait_for_timeout(120);await pg.screenshot(path='/tmp/s_play.png')
    await pg.wait_for_timeout(600);await pg.screenshot(path='/tmp/s_play2.png')
    print(json.dumps(await pg.evaluate("__T.get()"))[:400])
    print('ERRS',errs);await b.close()
asyncio.run(main())
