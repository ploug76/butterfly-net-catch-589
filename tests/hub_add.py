import re,os,shutil,subprocess,sys,html
H='/workspace/peters-arcade';REPO='butterfly-net-catch';TITLE='Butterfly Net Catch';BLURB='Swing your net at the matching butterflies: Monarch or Viceroy?'
run=lambda c,cwd=H:subprocess.run(c,shell=True,cwd=cwd,check=True,capture_output=True,text=True).stdout
print(run('git pull --rebase'))
p=H+'/index.html';s=open(p,encoding='utf-8').read()
shutil.copy(f'/workspace/covers/{REPO}/cover-anim.gif',f'{H}/covers/{REPO}.gif')
if f'ploug76.github.io/{REPO}/' not in s:
  e=lambda t:html.escape(t,quote=True)
  card=(f'<div class="card"><a class="tile" href="https://ploug76.github.io/{REPO}/"><img src="covers/{REPO}.gif" width="720" height="378" alt="{e(TITLE)} 8-bit box cover" loading="lazy"><b>{e(TITLE)}</b><span>{e(BLURB)}</span></a>'
        f'<button class="tshare" type="button" data-url="https://ploug76.github.io/{REPO}/" data-title="{e(TITLE)}" data-text="Play {e(TITLE)} — a free family-friendly 8-bit game from Peter&#x27;s Arcade!" aria-label="Share {e(TITLE)}">🔗 Share</button></div>')
  i=s.rindex('<div class="card">');j=s.index('</button></div>',i)+len('</button></div>');s=s[:j]+card+s[j:]
N=s.count('class="tile"');print('tiles',N)
s=re.sub(r'\d+( free)? family-friendly',lambda m:f'{N}{m.group(1) or ""} family-friendly',s);open(p,'w',encoding='utf-8').write(s)
def sub(path,pat,rep):
  t=open(path,encoding='utf-8').read();t2=re.sub(pat,rep,t);open(path,'w',encoding='utf-8').write(t2);return t!=t2
sub('/workspace/covers/meta.py',r"(\"Peter's Arcade: )\d+( family-friendly)",lambda m:m.group(1)+str(N)+m.group(2))
sub('/workspace/launch/share.py',r"(Peter's Arcade: )\d+( free family-friendly)",lambda m:m.group(1)+str(N)+m.group(2))
sub('/workspace/covers/gen.py',r"('peters-arcade','arcade',\"PETER'S ARCADE\",'#f83838','#7c0800',')\d+ GAMES'",lambda m:m.group(1)+f"{N} GAMES'")
print(run('python3 gen.py peters-arcade','/workspace/covers'),run('python3 meta.py peters-arcade','/workspace/covers'),run('python3 share.py peters-arcade','/workspace/launch'))
sw=open(H+'/sw.js').read()
if f'covers/{REPO}.gif' not in sw:sw=re.sub(r"(FILES=\[[^\]]*)\]",lambda m:m.group(1)+f", 'covers/{REPO}.gif']",sw,count=1);open(H+'/sw.js','w').write(sw)
sys.path.insert(0,'/workspace/launch');import fixsw;print('sw',fixsw.make('peters-arcade','peters-arcade'))
print(run('git status --short'))
