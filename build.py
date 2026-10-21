import sys,os,json
D='/workspace/butterfly-net-catch/';S=D+'src/'
parts=['core.js','species.js','world.js','levels.js','game.js','net.js','flow.js','ui.js','main.js']
game='\n'.join(open(S+p).read() for p in parts)
out=open(S+'shell.html').read().replace('%GAME%',game)
p=D+'index.html'
# keep existing og/share blocks if present
import re
if os.path.exists(p):
  old=open(p).read()
  og=re.search(r'<!--og-->.*?<!--/og-->',old,re.S);sh=re.search(r'<!--share-->.*?<!--/share-->',old,re.S)
  if og:out=out.replace('</title>','</title>'+og.group(0),1)
  if sh:i=out.rindex('</body>');out=out[:i]+sh.group(0)+out[i:]
open(p,'w').write(out);print('built',len(out))
