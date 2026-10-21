import asyncio,sys
from playwright.async_api import async_playwright
L=int(sys.argv[1]) if len(sys.argv)>1 else 12
async def m():
  async with async_playwright() as p:
    b=await p.chromium.launch();pg=await b.new_page(viewport={'width':390,'height':844},device_scale_factor=2,is_mobile=True,has_touch=True)
    pg.on('pageerror',lambda e:print('ERR',e))
    await pg.goto('http://localhost:8800/butterfly-net-catch/?nopause&all');await pg.wait_for_timeout(600)
    await pg.evaluate(f"__T.startLevel({L});__T.go()");await pg.wait_for_timeout(3500)
    for i in range(3):
      await pg.evaluate("(()=>{const c=BF.filter(b=>cardMatch(curCard(),b.k)&&['fly','land'].includes(b.st)&&b.y>HUD.playTop+30);if(c[0])netPress(c[0].x,c[0].y,3)})()");await pg.wait_for_timeout(700)
    await pg.evaluate("(()=>{const c=BF.filter(b=>cardMatch(curCard(),b.k)&&['fly','land'].includes(b.st)&&b.y>HUD.playTop+60);if(c[0])netPress(c[0].x-20,c[0].y,3)})()");await pg.wait_for_timeout(90)
    await pg.screenshot(path='/workspace/butterfly-net-catch/gameplay.png');await b.close()
asyncio.run(m())
