import sys,asyncio,json
from playwright.async_api import async_playwright
URL='http://localhost:8800/butterfly-net-catch/?nopause&all'
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch()
    async def page(w,h,safe=None):
      pg=await b.new_page(viewport={'width':w,'height':h},device_scale_factor=1,is_mobile=True,has_touch=True);pg.on('pageerror',lambda e:print('ERR',e))
      if safe:await pg.add_init_script('window.__SAFE='+json.dumps(safe))
      await pg.goto(URL);await pg.wait_for_timeout(600);return pg
    pg=await page(390,844,{'t':47,'b':34})
    await pg.evaluate("__T.setSave({journal:Object.fromEntries(Object.keys(SP).slice(0,20).map(k=>[k,{n:3,first:1}])),stars:{0:3,1:2,2:1}})")
    await pg.evaluate("state='journal';__T.setJPage(0)");await pg.wait_for_timeout(300);await pg.screenshot(path='/tmp/j.png')
    await pg.evaluate("__T.journalDetail('viceroy')");await pg.wait_for_timeout(300);await pg.screenshot(path='/tmp/jd.png');await pg.evaluate("__T.journalDetail(null)")
    await pg.evaluate("state='nets'");await pg.wait_for_timeout(300);await pg.screenshot(path='/tmp/nets.png')
    await pg.evaluate("__T.startLevel(15);__T.go()");await pg.wait_for_timeout(1500);await pg.evaluate("__T.win()");await pg.wait_for_timeout(2200);await pg.screenshot(path='/tmp/res.png')
    await pg.evaluate("__T.startLevel(24);__T.go()");await pg.wait_for_timeout(1500);await pg.evaluate("__T.pause(true)");await pg.wait_for_timeout(200);await pg.screenshot(path='/tmp/pause.png')
    pg2=await page(844,390,{'l':47,'r':47,'b':21});await pg2.evaluate("__T.startLevel(19);__T.go()");await pg2.wait_for_timeout(3000);await pg2.screenshot(path='/tmp/land.png')
    pg3=await page(320,568);await pg3.evaluate("__T.startLevel(27)");await pg3.wait_for_timeout(800);await pg3.screenshot(path='/tmp/small_intro.png')
    await pg3.evaluate("__T.go()");await pg3.wait_for_timeout(2500);await pg3.screenshot(path='/tmp/small_play.png')
    await b.close()
asyncio.run(main())
