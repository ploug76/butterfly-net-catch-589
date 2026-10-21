const fs=require('fs'),vm=require('vm');const ctx={document:{},console,Math};vm.createContext(ctx);
const code='const TAU=6.283,CL=(v,a,b)=>v<a?a:v>b?b:v;'+fs.readFileSync(__dirname+'/../src/species.js','utf8')+fs.readFileSync(__dirname+'/../src/levels.js','utf8')+`
let bad=0;LEVELS.forEach(L=>{L.cards.forEach(cd=>{const m=L.pool.filter(k=>cardMatch(cd,k));if(!m.length){bad++;console.log('NO MATCH L'+(L.i+1),JSON.stringify(cd))}});console.log('L'+(L.i+1),L.time+'s',L.pool.length,L.cards.map(c=>cardTitle(c,true)+'['+L.pool.filter(k=>cardMatch(c,k)).join(',')+']').join(' | '))});
for(const k of SPK)if(!SP[k].rare&&!LEVELS.some(L=>L.pool.includes(k)))console.log('unused',k);console.log('bad',bad)`;
vm.runInContext(code,ctx);
