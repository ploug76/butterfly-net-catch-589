import sys,asyncio
from playwright.async_api import async_playwright
async def main(url,out,w,h):
  async with async_playwright() as p:
    b=await p.chromium.launch();pg=await b.new_page(viewport={'width':w,'height':h},device_scale_factor=1)
    pg.on('pageerror',lambda e:print('ERR',e));pg.on('console',lambda m:print('LOG',m.text) if m.type=='error' else None)
    await pg.goto(url);await pg.wait_for_timeout(500);await pg.screenshot(path=out);await b.close()
asyncio.run(main(sys.argv[1],sys.argv[2],int(sys.argv[3]),int(sys.argv[4])))
