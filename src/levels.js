// ================= levels: 5 seasons x 6 levels. cards: S=species, M=match the pattern (no name), C=colour, F=features
const LV_SRC=[
 // Spring Meadow
 {p:'cabbagewhite cloudedsulphur springazure',n:6,c:'S:cabbagewhite:3|S:springazure:3'},
 {p:'+tigerswallow',n:7,c:'S:tigerswallow:3|S:cloudedsulphur:4'},
 {p:'+paintedlady',n:8,c:'S:paintedlady:3|S:cabbagewhite:4|S:springazure:3'},
 {p:'+zebraswallow',n:9,c:'C:yellow:5|S:zebraswallow:3|C:white:5'},
 {p:'+lunamoth peacock',n:10,c:'S:lunamoth:2|C:blue:4|S:peacock:3'},
 {p:'+',n:12,c:'F:col=white,f=stripes:3|F:col=yellow,f=tails:3|C:red:3|M:paintedlady:4'},
 // Summer Garden
 {p:'monarch paintedlady cabbagewhite springazure tigerswallow redadmiral',n:11,bees:1,c:'S:monarch:4|S:redadmiral:3|C:orange:6'},
 {p:'+americanlady',n:12,bees:1,c:'S:americanlady:3|S:paintedlady:3|M:americanlady:3'},
 {p:'+pipevine redspottedpurple',n:12,bees:1,c:'S:pipevine:3|S:redspottedpurple:3|F:col=black,f=tails:3'},
 {p:'+tigerdark karnerblue',n:13,bees:1,c:'S:tigerdark:3|F:col=blue,spot=orange:3|C:yellow:5'},
 {p:'+buckeye',n:14,bees:2,c:'S:buckeye:3|F:col=black,spot=orange:5|M:tigerdark:3'},
 {p:'+',n:15,bees:2,c:'M:pipevine:3|F:col=orange,f=eyespots:3|C:blue:5|S:monarch:5'},
 // Prairie Migration
 {p:'monarch viceroy cloudedsulphur buckeye karnerblue paintedlady',n:13,bees:1,c:'S:viceroy:3|S:monarch:4|F:col=blue,spot=orange:3'},
 {p:'+queen',n:14,bees:1,c:'S:queen:3|M:viceroy:3|C:brown:4'},
 {p:'+americanlady redadmiral',n:15,bees:1,c:'M:monarch:4|F:col=brown,f=eyespots:3|S:americanlady:3'},
 {p:'+pipevine',n:16,bees:2,c:'F:col=orange,f=hindline:3|M:queen:3|F:col=orange,spot=white:6'},
 {p:'+',n:17,bees:2,c:'M:viceroy:4|M:americanlady:3|F:col=black,spot=white:4'},
 {p:'+',n:18,bees:2,c:'M:monarch:5|M:viceroy:5|S:queen:3|F:col=yellow,spot=black:4'},
 // Autumn Orchard
 {p:'redadmiral peacock buckeye monarch cabbagewhite cloudedsulphur paintedlady',n:15,bees:1,c:'S:peacock:3|S:redadmiral:4|F:col=brown,f=eyespots:3'},
 {p:'+viceroy americanlady',n:16,bees:1,c:'M:viceroy:4|C:white:4|M:paintedlady:4'},
 {p:'+queen tigerdark',n:17,bees:2,c:'F:col=black,band=red:4|M:queen:4|S:tigerdark:3'},
 {p:'+zebraswallow springazure',n:18,bees:2,c:'F:col=white,f=tails:3|F:col=white,spot=black:4|M:americanlady:4'},
 {p:'+',n:19,bees:2,c:'M:monarch:5|F:col=orange,f=eyespots:4|F:col=black,spot=orange:4'},
 {p:'+',n:20,bees:3,c:'M:viceroy:5|M:queen:4|M:americanlady:4|C:red:4'},
 // Winter Conservatory
 {p:'bluemorpho glasswing owl julia malachite postman redadmiral',n:15,c:'S:bluemorpho:3|S:glasswing:3|S:owl:2|C:green:3'},
 {p:'+bluepansy springazure',n:16,c:'C:blue:6|F:col=blue,spot=orange:3|S:julia:4'},
 {p:'+lunamoth zebraswallow',n:17,bees:1,c:'F:col=green,f=tails:3|F:col=black,band=red:4|M:postman:3'},
 {p:'+pipevine redspottedpurple peacock',n:18,bees:1,c:'M:pipevine:4|F:col=brown,f=eyespots:3|M:bluepansy:4'},
 {p:'+karnerblue monarch viceroy',n:19,bees:2,c:'M:karnerblue:3|M:viceroy:4|F:f=clear:3|F:col=orange,f=long:4'},
 {p:'+',n:21,bees:2,c:'M:monarch:5|M:redspottedpurple:4|F:col=blue,spot=orange:5|M:glasswing:3|S:bluemorpho:4'}];
const RARES=['goldbirdwing','sunsetmoth','albinomonarch','rajahbrooke'];
const LEVELS=[];(function(){let pool=[];LV_SRC.forEach((L,i)=>{if(i%6===0)pool=[];const p=L.p.trim();if(p.startsWith('+'))pool=pool.concat(p.slice(1).trim().split(/\s+/).filter(Boolean));else pool=p.split(/\s+/);
 const cards=L.c.split('|').map(parseCard);const tot=cards.reduce((a,b)=>a+b.n,0),d=i/29;
 LEVELS.push({i,season:Math.floor(i/6),pool:[...pool],n:L.n,bees:L.bees||0,cards,
  time:Math.round(CL(24+tot*(4.4-.8*d)+(cards.length-1)*3,45,120)),spd:.78+d*.72,flap:.92+d*.4,dart:.015+d*.2,wary:CL((i-6)/23,0,1)*.9,land:.75-d*.35,match:.4-d*.12,rare:i>=2?(i<12?.035:.05):0,tot})})})();
function parseCard(s){const [t,a,n]=s.split(':');const c={t,n:+n,got:0};if(t==='S'||t==='M')c.k=a;else if(t==='C')c.col=a;else c.conds=a.split(',').map(z=>z.split('='));return c}
function cardMatch(cd,k){const sp=SP[k];if(!sp||sp.rare)return false;if(cd.t==='S'||cd.t==='M')return k===cd.k;if(cd.t==='C')return sp.col===cd.col;
 return cd.conds.every(([a,b])=>a==='col'?sp.col===b:a==='spot'?sp.spots.includes(b):a==='f'?sp.f.includes(b):a==='band'?sp.band2===b:false)}
function plural(n){if(/Lady$/.test(n))return n.replace(/Lady$/,'Ladies');if(/Butterfly$/.test(n))return n.replace(/Butterfly$/,'Butterflies');return n+'s'}
const FEAT={tails:'tails',eyespots:'eyespots',stripes:'stripes',clear:'see-through wings',long:'long wings',hindline:'a hind-wing line',veins:'black veins',iridescent:'a shimmer'};
function condText(c){const [a,b]=c;return a==='spot'?b+' spots':a==='band'?'a '+b+' band':a==='f'?FEAT[b]||b:b}
function cardTitle(cd,short){const N=cd.n;if(cd.t==='S'){const nm=SP[cd.k].n;return (short?'':'Catch ')+N+' '+(N>1?plural(nm):nm)}
 if(cd.t==='M')return (short?'Match ':'Find ')+N+(short?'':' that match this pattern');
 if(cd.t==='C')return (short?'':'Catch ')+N+' '+cd.col+(cd.col==='clear'?'-wing':'')+(short?'':' butterflies');
 const col=cd.conds.find(z=>z[0]==='col'),rest=cd.conds.filter(z=>z[0]!=='col').map(condText);
 let tx=col?col[1][0].toUpperCase()+col[1].slice(1)+(rest.length?' with '+rest.join(' & '):''):'With '+rest.join(' & ');return (short?N+' · ':'Catch '+N+': ')+tx}
const COLSW={orange:'#f28a1e',blue:'#3a7aff',yellow:'#ffd21c',white:'#f6f6f0',black:'#1a1a22',green:'#7ad890',brown:'#8a5a32',red:'#d8362a',clear:'rgba(220,240,250,.5)'};
// season tips shown on intro
const TIPS=['Tap to swing your net — or swipe to sweep it along a path!','Landed butterflies are easy pickings. Sneak up on the flowers!','Catch two or more matching butterflies in ONE swing for a combo.','Wrong catches cost 3 seconds. Look closely before you swing!','Bees sting! Swing around them.','Golden sparkles mean a RARE butterfly — catch it for a big bonus.','Keep a streak of good swings going to multiply your points.'];
