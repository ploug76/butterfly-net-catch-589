// ================= species data + wing art (all drawn in code)
const SHAPES={
 std:{fw:[[.02,-.06],[.22,-.55,.62,-.86,.98,-.80],[1.03,-.56,.88,-.22,.74,-.03],[.5,0,.22,.02,.02,.02]],fm:[2],hw:[[.03,0],[.36,-.07,.68,0,.76,.2],[.82,.46,.62,.72,.38,.75],[.18,.77,.05,.5,.03,0]],hm:[2],apex:[.98,-.8]},
 swallow:{fw:[[.02,-.06],[.25,-.5,.65,-.85,1.02,-.86],[1,-.6,.86,-.25,.72,-.06],[.48,-.02,.22,.02,.02,.02]],fm:[2],hw:[[.03,0],[.38,-.08,.66,-.02,.7,.16],[.74,.36,.64,.56,.52,.64],[.49,.78,.46,.92,.43,1.04],[.4,1.08,.35,1.05,.35,.99],[.36,.86,.36,.76,.3,.7],[.16,.66,.05,.45,.03,0]],hm:[2],apex:[1.02,-.86]},
 long:{fw:[[.02,-.05],[.3,-.4,.75,-.6,1.12,-.6],[1.14,-.45,.9,-.2,.66,-.04],[.45,0,.2,.02,.02,.02]],fm:[2],hw:[[.03,0],[.3,-.04,.58,0,.62,.15],[.66,.36,.5,.55,.3,.56],[.14,.56,.04,.4,.03,0]],hm:[2],apex:[1.12,-.6]},
 moth:{fw:[[.02,-.04],[.25,-.5,.6,-.8,.9,-.78],[1,-.7,.95,-.3,.74,-.06],[.5,0,.22,.03,.02,.02]],fm:[2],hw:[[.03,0],[.35,-.05,.64,.02,.68,.22],[.72,.42,.6,.58,.48,.66],[.52,.85,.62,1.05,.56,1.22],[.52,1.28,.46,1.2,.44,1.1],[.4,.95,.36,.8,.28,.72],[.14,.68,.04,.45,.03,0]],hm:[2],apex:[.9,-.78]},
 round:{fw:[[.02,-.05],[.2,-.55,.55,-.85,.9,-.82],[1.02,-.7,.95,-.3,.76,-.04],[.5,0,.22,.02,.02,.02]],fm:[2],hw:[[.03,0],[.38,-.06,.72,.02,.8,.24],[.86,.5,.64,.8,.38,.8],[.16,.8,.04,.5,.03,0]],hm:[2],apex:[.9,-.82]}};
function pathOf(x,d){x.beginPath();x.moveTo(d[0][0],d[0][1]);for(let i=1;i<d.length;i++){const s=d[i];x.bezierCurveTo(s[0],s[1],s[2],s[3],s[4],s[5])}x.closePath()}
function segPt(d,i,t){const p0=i==1?d[0]:[d[i-1][4],d[i-1][5]],s=d[i],u=1-t;return[u*u*u*p0[0]+3*u*u*t*s[0]+3*u*t*t*s[2]+t*t*t*s[4],u*u*u*p0[1]+3*u*u*t*s[1]+3*u*t*t*s[3]+t*t*t*s[5]]}
// tag vocabulary: col = dominant colour; spots = spot colours; f = features
const SP={
 monarch:{n:'Monarch',lat:'Danaus plexippus',col:'orange',spots:['white'],f:['veins'],span:50,sp:1,gl:.6,fl:7.5,lk:['viceroy','queen'],shape:'std',
  a:{bF:['#f8a83a','#e86a0c'],bH:['#f6a53a','#e46a10'],veins:{c:'#1b0f06',w:.034},tip:{x:1,y:-.82,r:.3,c:'#15100a'},tipDots:[[.82,-.66,.025,'#fff'],[.9,-.58,.025,'#fff'],[.76,-.72,.02,'#fff'],[.86,-.72,.03,'#f6a03a'],[.94,-.66,.025,'#f6a03a']],border:{c:'#120c06',w:.1},bDots:{c:'#fff',r:.022,ins:[.94,.86]}},
  fact:'Monarchs fly up to 3,000 miles to Mexico every fall. Their milkweed diet makes them taste bad to birds!',tip:'No black line across the hind wing — that\'s how you tell it from a Viceroy.'},
 viceroy:{n:'Viceroy',lat:'Limenitis archippus',col:'orange',spots:['white'],f:['veins','hindline'],span:42,sp:1.1,gl:.5,fl:8.5,lk:['monarch','queen'],shape:'std',
  a:{bF:['#f6a038','#e2680e'],bH:['#f4a03a','#e0660e'],veins:{c:'#1b0f06',w:.03},tip:{x:1,y:-.82,r:.3,c:'#15100a'},tipDots:[[.82,-.66,.025,'#fff'],[.9,-.58,.025,'#fff'],[.76,-.72,.02,'#fff']],border:{c:'#120c06',w:.13},bDots:{c:'#fff',r:.022,ins:[.94]},hindline:{c:'#140c06',w:.08}},
  fact:'The Viceroy is smaller than a Monarch and has a black line curving across its hind wings. Birds avoid both!',tip:'Look for the black line curving across the hind wing.'},
 queen:{n:'Queen',lat:'Danaus gilippus',col:'brown',spots:['white'],f:[],span:46,sp:1,gl:.6,fl:7.5,lk:['monarch','viceroy'],shape:'std',
  a:{bF:['#c8661e','#8c3a10'],bH:['#c4621c','#88380e'],veins:{c:'#4a1e08',w:.016},border:{c:'#1e0f06',w:.12},bDots:{c:'#fff',r:.02,ins:[.93]},spots:[['f',.55,-.42,.035,'#fff'],['f',.63,-.36,.03,'#fff'],['f',.5,-.32,.028,'#fff'],['f',.7,-.5,.028,'#fff'],['f',.6,-.52,.022,'#fff']]},
  fact:'The Queen is the Monarch\'s darker cousin from the warm South. It has white spots in the middle of its fore wings.',tip:'Darker, chocolate-orange, with few black veins.'},
 paintedlady:{n:'Painted Lady',lat:'Vanessa cardui',col:'orange',spots:['white','black'],f:[],span:42,sp:1.15,gl:.35,fl:9,lk:['americanlady'],shape:'std',
  a:{bF:['#f8b070','#ea7a48'],bH:['#f6ae6c','#e87848'],tip:{x:.98,y:-.8,r:.4,c:'#1a120e'},tipDots:[[.8,-.64,.035,'#fff'],[.88,-.54,.03,'#fff'],[.7,-.68,.03,'#fff'],[.93,-.7,.025,'#fff']],spots:[['f',.45,-.36,.07,'#1a120e'],['f',.38,-.22,.05,'#1a120e'],['f',.55,-.2,.045,'#1a120e'],['h',.56,.42,.035,'#1a120e'],['h',.48,.55,.035,'#1a120e'],['h',.36,.62,.03,'#1a120e'],['h',.64,.28,.03,'#1a120e']],border:{c:'#2a1a12',w:.07},bDots:{c:'#1a120e',r:.022,ins:[.9]}},
  fact:'Painted Ladies live on every continent except Antarctica and Australia. A swarm can number in the millions!',tip:'A row of small black dots on the hind wing, no big eyespots.'},
 americanlady:{n:'American Lady',lat:'Vanessa virginiensis',col:'orange',spots:['white','black'],f:['eyespots'],span:40,sp:1.15,gl:.35,fl:9,lk:['paintedlady'],shape:'std',
  a:{bF:['#f8b070','#ea7a48'],bH:['#f6ae6c','#e87848'],tip:{x:.98,y:-.8,r:.4,c:'#1a120e'},tipDots:[[.8,-.64,.035,'#fff'],[.88,-.54,.03,'#fff'],[.7,-.68,.03,'#fff']],spots:[['f',.56,-.44,.04,'#fff'],['f',.42,-.32,.06,'#1a120e'],['f',.38,-.18,.045,'#1a120e']],eyes:[['h',.5,.5,.085,['#1a120e','#2f6ae0','#dfe8ff']],['h',.3,.6,.07,['#1a120e','#2f6ae0','#dfe8ff']]],border:{c:'#2a1a12',w:.07},bDots:{c:'#1a120e',r:.02,ins:[.9]}},
  fact:'The American Lady has two big blue-centred eyespots on its hind wings, and a tiny white dot in the orange of each fore wing.',tip:'Two big blue eyespots on the hind wing, plus a white dot in the orange.'},
 julia:{n:'Julia',lat:'Dryas iulia',col:'orange',spots:[],f:['long'],span:46,sp:1.25,gl:.3,fl:10,lk:[],shape:'long',
  a:{bF:['#ffa020','#ff6a00'],bH:['#ffa020','#ff7000'],border:{c:'#3a1400',w:.05},spots:[['f',.7,-.36,.05,'#3a1400'],['f',.62,-.3,.03,'#3a1400']],tip:{x:1.12,y:-.6,r:.14,c:'#3a1400'}},
  fact:'Julias are fast, bright orange fliers from the tropics. They sip tears from the eyes of turtles and caimans for salt!',tip:'Long narrow fore wings, bright orange, hardly any spots.'},
 bluemorpho:{n:'Blue Morpho',lat:'Morpho peleides',col:'blue',spots:['white'],f:['large','iridescent'],span:62,sp:1,gl:.8,fl:5.5,lk:[],shape:'round',
  a:{bF:['#7ff6ff','#2a9cff','#0b3ea8'],bH:['#7ff6ff','#2a9cff','#0b3ea8'],border:{c:'#0a0c18',w:.15},bDots:{c:'#fff',r:.025,ins:[.86]},sheen:1},
  fact:'A Blue Morpho\'s wings aren\'t blue at all — tiny scales bend the light so they shimmer bright blue!',tip:'Huge, shimmering blue with wide black edges.'},
 springazure:{n:'Spring Azure',lat:'Celastrina ladon',col:'blue',spots:[],f:['small'],span:28,sp:1.25,gl:.2,fl:12,lk:['karnerblue'],shape:'round',
  a:{bF:['#d8e8ff','#86aef2'],bH:['#d8e8ff','#86aef2'],border:{c:'#3c4c70',w:.05},fringe:'#fff'},
  fact:'Spring Azures are one of the first butterflies to fly each spring. They are smaller than a quarter!',tip:'Tiny and plain sky-blue with no orange.'},
 karnerblue:{n:'Karner Blue',lat:'Plebejus samuelis',col:'blue',spots:['orange','black'],f:['small'],span:28,sp:1.25,gl:.2,fl:12,lk:['springazure','bluepansy'],shape:'round',
  a:{bF:['#a8c8ff','#4a7ae2'],bH:['#a8c8ff','#4a7ae2'],border:{c:'#18223e',w:.08},fringe:'#fff',bDots:{c:'#ff8a1e',r:.05,ins:[.82],hw:1,dot:'#111'}},
  fact:'Karner Blues are endangered. Their caterpillars eat only one plant: wild blue lupine.',tip:'Small blue with a row of orange crescents on the hind wing.'},
 bluepansy:{n:'Blue Pansy',lat:'Junonia orithya',col:'blue',spots:['orange'],f:['eyespots'],span:40,sp:1.15,gl:.4,fl:9,lk:['karnerblue'],shape:'std',
  a:{bF:['#4f8cff','#1b2a70'],bH:['#4f9cff','#1a3aa8'],tip:{x:.98,y:-.8,r:.45,c:'#15151f'},tipDots:[[.74,-.6,.03,'#fff'],[.84,-.52,.03,'#fff'],[.8,-.7,.025,'#fff']],eyes:[['f',.62,-.42,.06,['#ff7a1a','#111','#4a8aff']],['h',.48,.32,.075,['#ff5a1a','#111','#4a8aff']],['h',.4,.56,.06,['#ff5a1a','#111','#4a8aff']]],border:{c:'#101018',w:.08},sheen:1},
  fact:'The Blue Pansy lives in Africa, Asia and Australia. Males shine electric blue in the sun.',tip:'Blue with big orange-ringed eyespots.'},
 tigerswallow:{n:'Tiger Swallowtail',lat:'Papilio glaucus',col:'yellow',spots:['blue','orange'],f:['tails','stripes'],span:58,sp:1,gl:.75,fl:6,lk:['tigerdark'],shape:'swallow',
  a:{bF:['#ffe55a','#ffd21c'],bH:['#ffe55a','#ffd21c'],stripes:[['f',.2,-.5,.12,-.02,.07],['f',.42,-.66,.3,-.02,.06],['f',.64,-.78,.5,-.04,.055],['f',.84,-.82,.66,-.12,.04],['h',.06,.04,.1,.6,.06]],border:{c:'#14110a',w:.13,mOnly:1},bDots:{c:'#ffe55a',r:.03,ins:[.9]},spots:[['h',.42,.62,.045,'#3a7aff'],['h',.52,.55,.04,'#3a7aff'],['h',.3,.64,.05,'#ff8a1a']]},
  fact:'Tiger Swallowtails are one of the biggest butterflies in North America. Their tails look like a fake head to fool birds!',tip:'Yellow with black tiger stripes and long tails.'},
 tigerdark:{n:'Dark Tiger Swallowtail',lat:'Papilio glaucus (dark form)',col:'black',spots:['blue','orange'],f:['tails','stripes'],span:58,sp:1,gl:.75,fl:6,lk:['tigerswallow','pipevine'],shape:'swallow',
  a:{bF:['#3a332a','#221e18'],bH:['#3a3328','#201c16'],stripes:[['f',.2,-.5,.12,-.02,.07,'#141210'],['f',.42,-.66,.3,-.02,.06,'#141210'],['f',.64,-.78,.5,-.04,.055,'#141210']],border:{c:'#0c0b08',w:.13,mOnly:1},bDots:{c:'#d8c050',r:.026,ins:[.9]},spots:[['h',.42,.6,.05,'#4a8aff'],['h',.52,.52,.045,'#4a8aff'],['h',.6,.42,.04,'#4a8aff'],['h',.3,.64,.05,'#ff8a1a']]},
  fact:'Some female Tiger Swallowtails are almost black! They copy the bad-tasting Pipevine Swallowtail to stay safe.',tip:'Dark colour form of the Tiger — you can still see faint stripes.'},
 zebraswallow:{n:'Zebra Swallowtail',lat:'Eurytides marcellus',col:'white',spots:['red'],f:['tails','stripes'],span:50,sp:1.15,gl:.6,fl:7,lk:[],shape:'swallow',
  a:{bF:['#f6fbef','#dfeedd'],bH:['#f6fbef','#dfeedd'],stripes:[['f',.14,-.42,.08,-.02,.05],['f',.3,-.6,.2,-.02,.05],['f',.48,-.72,.36,-.03,.04],['f',.66,-.8,.52,-.06,.04],['f',.86,-.84,.68,-.1,.03],['h',.06,.04,.08,.55,.05],['h',.2,0,.24,.55,.03]],band:[['h',[[.12,.12],[.18,.4],[.2,.6]],.035,'#e02a2a']],border:{c:'#121212',w:.1},spots:[['h',.36,.66,.04,'#e02a2a'],['h',.44,.6,.035,'#3a7aff']]},
  fact:'Zebra Swallowtails have extra-long tails and only eat pawpaw leaves as caterpillars.',tip:'White with black zebra stripes and very long tails.'},
 pipevine:{n:'Pipevine Swallowtail',lat:'Battus philenor',col:'black',spots:['orange','white'],f:['tails','iridescent'],span:52,sp:1.05,gl:.6,fl:7,lk:['redspottedpurple','tigerdark'],shape:'swallow',
  a:{bF:['#24242c','#121218'],bH:['#3a64c8','#0f1a3a'],border:{c:'#0a0a10',w:.09},bDots:{c:'#fff',r:.024,ins:[.92]},spots:[['h',.46,.5,.04,'#ff9a2a'],['h',.56,.36,.035,'#ff9a2a'],['h',.36,.58,.04,'#ff9a2a'],['h',.24,.6,.035,'#ff9a2a']],sheen:1},
  fact:'Pipevine Swallowtails eat poisonous pipevine plants, so birds learn to leave them — and their look-alikes — alone.',tip:'Has TAILS, and a row of orange spots on the shiny blue hind wing.'},
 redspottedpurple:{n:'Red-spotted Purple',lat:'Limenitis arthemis',col:'black',spots:['orange'],f:['iridescent'],span:48,sp:1.1,gl:.55,fl:7.5,lk:['pipevine'],shape:'std',
  a:{bF:['#2c3c88','#121838'],bH:['#3a5ad0','#101a44'],border:{c:'#0a0c1a',w:.12},bDots:{c:'#9ab8ff',r:.02,ins:[.9]},spots:[['f',.86,-.72,.035,'#ff6a2a'],['f',.92,-.62,.03,'#ff6a2a'],['h',.62,.4,.025,'#ff6a2a'],['h',.48,.6,.025,'#ff6a2a']],sheen:1},
  fact:'The Red-spotted Purple is a close cousin of the Viceroy, but it copies the Pipevine Swallowtail instead.',tip:'NO tails. Orange spots near the fore wing tips.'},
 cabbagewhite:{n:'Cabbage White',lat:'Pieris rapae',col:'white',spots:['black'],f:[],span:36,sp:1.2,gl:.25,fl:10,lk:[],shape:'round',
  a:{bF:['#ffffff','#ece9da'],bH:['#ffffff','#eeeadc'],tip:{x:.94,y:-.84,r:.22,c:'#3a3a3a'},spots:[['f',.55,-.4,.055,'#262626'],['f',.5,-.18,.05,'#262626'],['h',.3,.04,.04,'#7a7a7a']],fringe:'#bbb'},
  fact:'Cabbage Whites are some of the most common butterflies in the world. Their caterpillars love cabbage and broccoli.',tip:'White with grey-black tips and one or two black spots.'},
 cloudedsulphur:{n:'Clouded Sulphur',lat:'Colias philodice',col:'yellow',spots:['black'],f:[],span:38,sp:1.25,gl:.2,fl:11,lk:[],shape:'round',
  a:{bF:['#fff590','#f6d600'],bH:['#fff590','#f2d000'],border:{c:'#1e1a0a',w:.1,mOnly:1},spots:[['f',.45,-.44,.05,'#1e1a0a'],['h',.4,.32,.05,'#ff9a2a']],fringe:'#ffb0c8'},
  fact:'Clouded Sulphurs zig-zag low over clover fields. Their wing edges have a pretty pink fringe.',tip:'Lemon yellow with black edges, no tails.'},
 lunamoth:{n:'Luna Moth',lat:'Actias luna',col:'green',spots:[],f:['tails','eyespots','moth'],span:56,sp:.85,gl:.7,fl:5,lk:[],shape:'moth',body:'#f4f0e0',
  a:{bF:['#e0f8cc','#9ad888'],bH:['#e0f8cc','#9ad888'],band:[['f',[[.04,-.08],[.3,-.5],[.86,-.78]],.06,'#8a4a6a']],eyes:[['f',.48,-.4,.075,['#8a6a3a','#f2e6a8','#5a3a7a']],['h',.4,.32,.085,['#8a6a3a','#f2e6a8','#5a3a7a']]],fringe:'#c8a060'},
  fact:'Luna Moths have no mouths as adults — they live only about a week, just to find a mate. They fly mostly at night.',tip:'Pale green with long swooping tails.'},
 malachite:{n:'Malachite',lat:'Siproeta stelenes',col:'green',spots:[],f:[],span:50,sp:1.05,gl:.6,fl:7,lk:[],shape:'std',
  a:{bF:['#b8f6b8','#5ccc8c'],bH:['#b8f6b8','#5ccc8c'],border:{c:'#2a2016',w:.12,mOnly:1},tip:{x:1,y:-.82,r:.36,c:'#2a2016'},tipDots:[[.82,-.6,.045,'#b8f6b8'],[.9,-.66,.035,'#b8f6b8']],band:[['f',[[.3,-.6],[.4,-.35],[.5,-.08]],.06,'#2a2016']]},
  fact:'Malachites are named after a green gemstone. They love rotting fruit more than flowers!',tip:'Jade green with dark brown edges, no tails.'},
 buckeye:{n:'Common Buckeye',lat:'Junonia coenia',col:'brown',spots:['orange'],f:['eyespots'],span:42,sp:1.15,gl:.4,fl:9,lk:['owl'],shape:'std',
  a:{bF:['#9a7652','#5a3e28'],bH:['#94704e','#584026'],band:[['f',[[.6,-.74],[.66,-.5],[.82,-.42]],.07,'#f2e8d0']],spots:[['f',.32,-.4,.045,'#ff8a2a'],['f',.4,-.46,.04,'#ff8a2a']],eyes:[['f',.66,-.26,.09,['#f0d080','#111','#7a6aff']],['h',.48,.38,.13,['#f0c870','#111','#8a5aff']],['h',.3,.6,.08,['#f0c870','#111','#8a5aff']]],border:{c:'#3a2a1a',w:.08}},
  fact:'Buckeyes flash their big eyespots to startle birds. They look like the eyes of a much bigger animal!',tip:'Brown with big target-like eyespots.'},
 peacock:{n:'Peacock',lat:'Aglais io',col:'red',spots:[],f:['eyespots'],span:46,sp:1.1,gl:.45,fl:8.5,lk:[],shape:'std',
  a:{bF:['#d8462e','#a01c16'],bH:['#c83a28','#7a1a12'],eyes:[['f',.72,-.6,.16,['#f2e6b0','#3a3ab0','#8aa8ff']],['h',.48,.42,.16,['#5a3a2a','#141428','#5a7ae8']]],border:{c:'#3a2018',w:.12}},
  fact:'The Peacock butterfly can hiss by rubbing its wings together to scare away mice and birds!',tip:'Red with four big peacock-feather eyespots.'},
 redadmiral:{n:'Red Admiral',lat:'Vanessa atalanta',col:'black',spots:['white'],f:['band'],band2:'red',span:44,sp:1.15,gl:.4,fl:9,lk:['postman'],shape:'std',
  a:{bF:['#2a2420','#141210'],bH:['#2a2420','#141210'],band:[['f',[[.26,-.62],[.5,-.36],[.72,-.06]],.12,'#e8401a']],tipDots:[[.8,-.66,.035,'#fff'],[.88,-.56,.03,'#fff'],[.74,-.72,.025,'#fff'],[.66,-.56,.03,'#fff']],mband:{c:'#e8401a',w:.1}},
  fact:'Red Admirals are friendly butterflies that sometimes land right on people. They drink tree sap and fruit juice.',tip:'Black with a bright red-orange band and white spots at the tips.'},
 postman:{n:'Postman',lat:'Heliconius melpomene',col:'black',spots:['yellow'],f:['band','long'],band2:'red',span:44,sp:1,gl:.5,fl:7.5,lk:['redadmiral'],shape:'long',
  a:{bF:['#1a1a22','#0e0e14'],bH:['#1a1a22','#0e0e14'],blob:[['f',.6,-.34,.24,.1,-.42,'#e0181a']],band:[['h',[[.05,.08],[.3,.06],[.56,.14]],.04,'#f8e040']]},
  fact:'Postman butterflies follow the same route every day, like a mail carrier — that\'s how they got their name!',tip:'Long black wings with a red patch and a thin yellow line.'},
 glasswing:{n:'Glasswing',lat:'Greta oto',col:'clear',spots:['white'],f:['clear'],span:42,sp:1,gl:.5,fl:8,lk:[],shape:'long',clear:1,
  a:{bF:['rgba(225,240,245,.22)','rgba(200,225,235,.15)'],bH:['rgba(225,240,245,.22)','rgba(200,225,235,.15)'],veins:{c:'rgba(60,40,30,.6)',w:.014},border:{c:'#3a2216',w:.1},spots:[['f',.92,-.56,.035,'#fff'],['f',.98,-.5,.03,'#fff']]},
  fact:'Glasswings have see-through wings, like tiny windows. Predators look right through them!',tip:'See-through wings with dark edges.'},
 owl:{n:'Owl Butterfly',lat:'Caligo memnon',col:'brown',spots:[],f:['eyespots','large'],span:62,sp:.9,gl:.7,fl:5,lk:['buckeye'],shape:'round',
  a:{bF:['#7a8ad0','#7a5a3a','#4a3624'],bH:['#8a6a48','#4a3624'],band:[['f',[[.4,-.74],[.6,-.5],[.86,-.42]],.09,'#efe2b8']],eyes:[['h',.5,.42,.2,['#efe0a8','#1a1410','#d8c8a0']]],border:{c:'#2a1e14',w:.1}},
  fact:'Owl Butterflies have giant eyespots that look like an owl\'s eyes. They fly at dusk in rainforests.',tip:'Huge and brown with one giant owl eye on each hind wing.'},
 // rares (bonus, never wrong)
 goldbirdwing:{n:'Golden Birdwing',lat:'Troides aeacus',col:'yellow',spots:['black'],f:['large','rare'],rare:1,span:66,sp:1.5,gl:.7,fl:6,lk:[],shape:'long',
  a:{bF:['#1c1c1c','#0c0c0c'],bH:['#ffe24a','#f2a800'],veins:{c:'#5a5a5a',w:.02},border:{c:'#0c0c0c',w:.12},bDots:{c:'#111',r:.05,ins:[.8],hw:1},sheen:1},
  fact:'Birdwings are some of the largest butterflies on Earth — they soar like birds. Very rare to catch!',tip:'Rare bonus!'},
 sunsetmoth:{n:'Sunset Moth',lat:'Chrysiridia rhipheus',col:'rainbow',spots:[],f:['tails','rare'],rare:1,span:56,sp:1.6,gl:.5,fl:7,lk:[],shape:'swallow',
  a:{bF:['#121812','#0a0c0a'],bH:['#ff6a2a','#e0204a'],stripes:[['f',.18,-.46,.12,-.02,.05,'#30e080'],['f',.36,-.62,.28,-.02,.05,'#30e080'],['f',.56,-.76,.44,-.04,.04,'#40c0ff'],['f',.76,-.82,.6,-.08,.035,'#f0e040'],['h',.12,.06,.2,.5,.08,'#30e080'],['h',.3,.06,.36,.5,.05,'#40c0ff']],border:{c:'#0a0a0a',w:.12},bDots:{c:'#fff',r:.025,ins:[.9]},sheen:1},
  fact:'The Sunset Moth from Madagascar is so colourful it was once thought to be a butterfly. Its rainbow comes from light, not paint!',tip:'Rare bonus!'},
 albinomonarch:{n:'White Monarch',lat:'Danaus plexippus (white form)',col:'white',spots:['white'],f:['veins','rare'],rare:1,span:50,sp:1.45,gl:.6,fl:7.5,lk:[],shape:'std',
  a:{bF:['#ffffff','#e6e6e0'],bH:['#ffffff','#e6e6e0'],veins:{c:'#2a2a2a',w:.032},tip:{x:1,y:-.82,r:.3,c:'#262626'},tipDots:[[.82,-.66,.025,'#fff'],[.9,-.58,.025,'#fff']],border:{c:'#222',w:.13},bDots:{c:'#fff',r:.022,ins:[.94,.86]},sheen:1},
  fact:'White Monarchs are extremely rare — a natural colour form found mostly in Hawaii. Lucky catch!',tip:'Rare bonus!'},
 rajahbrooke:{n:'Rajah Brooke\'s Birdwing',lat:'Trogonoptera brookiana',col:'black',spots:[],f:['rare'],rare:1,span:60,sp:1.55,gl:.7,fl:6,lk:[],shape:'long',
  a:{bF:['#121612','#060806'],bH:['#121612','#060806'],stripes:[['f',.3,-.52,.36,-.18,.09,'#22e07a'],['f',.46,-.58,.52,-.22,.09,'#22e07a'],['f',.62,-.6,.68,-.26,.09,'#22e07a'],['f',.78,-.6,.84,-.3,.08,'#22e07a'],['f',.94,-.58,.98,-.36,.07,'#22e07a'],['h',.14,.1,.5,.24,.1,'#22e07a']],sheen:1},
  fact:'Rajah Brooke\'s Birdwing is the national butterfly of Malaysia, with wings like emerald feathers.',tip:'Rare bonus!'}
};
const SPK=Object.keys(SP);for(const k of SPK){SP[k].k=k;SP[k].f=SP[k].f||[];SP[k].band2=SP[k].band2||null}
// ----- wing painter (unit coords; right wing; root at 0,0)
function paintWing(x,sp,which){const A=sp.a,sh=SHAPES[sp.shape],d=which==='f'?sh.fw:sh.hw,mi=which==='f'?sh.fm:sh.hm;
 x.save();pathOf(x,d);x.save();x.clip();
 const base=which==='f'?A.bF:A.bH;if(Array.isArray(base)){const gr=x.createRadialGradient(0,0,.02,0,0,1.15);base.forEach((c,i)=>gr.addColorStop(i/(base.length-1),c));x.fillStyle=gr}else x.fillStyle=base;x.fillRect(-.2,-1.2,1.6,2.6);
 if(A.blob)for(const b of A.blob)if(b[0]===which){x.save();x.translate(b[1],b[2]);x.rotate(b[5]);x.fillStyle=b[6];x.beginPath();x.ellipse(0,0,b[3],b[4],0,0,TAU);x.fill();x.restore()}
 if(A.veins){x.strokeStyle=A.veins.c;x.lineWidth=A.veins.w;x.lineCap='round';const n=which==='f'?7:6;
  for(let i=0;i<n;i++){const t=(i+.5)/n;let p;const segs=d.length-1;// points along costa+outer
   const s=which==='f'?(t<.25?segPt(d,1,.55+t*1.8):segPt(d,2,(t-.25)/.75)):segPt(d,Math.min(segs-1,t<.3?1:2),t<.3?.6+t:(t-.3)/.7);
   x.beginPath();x.moveTo(.05,which==='f'?-.04:.04);const mx=s[0]*.45,my=s[1]*.45;x.quadraticCurveTo(mx+.04,my,s[0],s[1]);x.stroke()}
  x.lineWidth=A.veins.w*.8;x.beginPath();if(which==='f'){x.moveTo(.08,-.12);x.quadraticCurveTo(.4,-.45,.56,-.4);x.quadraticCurveTo(.5,-.18,.36,-.06)}else{x.moveTo(.12,.06);x.quadraticCurveTo(.42,.12,.44,.3);x.quadraticCurveTo(.3,.4,.14,.28)}x.stroke()}
 if(A.stripes)for(const s of A.stripes)if(s[0]===which){x.strokeStyle=s[6]||'#14110a';x.lineWidth=s[5];x.lineCap='round';x.beginPath();x.moveTo(s[1],s[2]);x.lineTo(s[3],s[4]);x.stroke()}
 if(A.band)for(const b of A.band)if(b[0]===which){const p=b[1];x.strokeStyle=b[3];x.lineWidth=b[2];x.lineCap='round';x.beginPath();x.moveTo(p[0][0],p[0][1]);x.quadraticCurveTo(p[1][0],p[1][1],p[2][0],p[2][1]);x.stroke()}
 if(A.hindline&&which==='h'){x.strokeStyle=A.hindline.c;x.lineWidth=A.hindline.w;x.beginPath();x.moveTo(.1,.06);x.bezierCurveTo(.5,.08,.66,.36,.4,.62);x.stroke()}
 if(A.tip&&which==='f'){x.fillStyle=A.tip.c;x.beginPath();x.arc(A.tip.x,A.tip.y,A.tip.r,0,TAU);x.fill()}
 if(A.border){x.strokeStyle=A.border.c;x.lineWidth=A.border.w*2;x.lineJoin='round';if(A.border.mOnly){x.beginPath();for(const i of mi){const p0=segPt(d,i,0);x.moveTo(p0[0],p0[1]);const s=d[i];x.bezierCurveTo(s[0],s[1],s[2],s[3],s[4],s[5])}x.stroke()}else{pathOf(x,d);x.stroke()}}
 if(A.mband&&which==='h'){x.strokeStyle=A.mband.c;x.lineWidth=A.mband.w;for(const i of mi){x.beginPath();for(let k=0;k<=20;k++){const p=segPt(d,i,k/20);const q=[p[0]*.86,p[1]*.86];k?x.lineTo(q[0],q[1]):x.moveTo(q[0],q[1])}x.stroke()}}
 if(A.bDots&&(!A.bDots.hw||which==='h')){for(const ins of A.bDots.ins)for(const i of mi){const n=which==='f'?7:6;for(let k=0;k<n;k++){const p=segPt(d,i,(k+.5)/n);const q=[p[0]*ins,p[1]*ins+(which==='h'?0:.01)];x.fillStyle=A.bDots.c;x.beginPath();x.arc(q[0],q[1],A.bDots.r*(ins<.9?1.15:1),0,TAU);x.fill();if(A.bDots.dot){x.fillStyle=A.bDots.dot;x.beginPath();x.arc(q[0]*1.04,q[1]*1.04,A.bDots.r*.45,0,TAU);x.fill()}}}}
 if(A.tipDots&&which==='f')for(const t of A.tipDots){x.fillStyle=t[3];x.beginPath();x.arc(t[0],t[1],t[2],0,TAU);x.fill()}
 if(A.spots)for(const s of A.spots)if(s[0]===which){x.fillStyle=s[4];x.beginPath();x.arc(s[1],s[2],s[3],0,TAU);x.fill()}
 if(A.eyes)for(const e of A.eyes)if(e[0]===which){const [c0,c1,c2]=e[4];x.fillStyle=c0;x.beginPath();x.arc(e[1],e[2],e[3],0,TAU);x.fill();x.fillStyle=c1;x.beginPath();x.arc(e[1],e[2],e[3]*.72,0,TAU);x.fill();x.fillStyle=c2;x.beginPath();x.arc(e[1]+e[3]*.12,e[2]-e[3]*.1,e[3]*.36,0,TAU);x.fill();x.fillStyle='rgba(255,255,255,.8)';x.beginPath();x.arc(e[1]+e[3]*.2,e[2]-e[3]*.25,e[3]*.12,0,TAU);x.fill()}
 if(A.sheen){const gr=x.createLinearGradient(0,-.8,.9,.4);gr.addColorStop(0,'rgba(255,255,255,0)');gr.addColorStop(.45,'rgba(255,255,255,.28)');gr.addColorStop(.6,'rgba(255,255,255,0)');x.fillStyle=gr;x.fillRect(-.2,-1.2,1.6,2.6)}
 // body-hair shading at root + soft vignette
 const hr=x.createRadialGradient(0,0,0,0,0,.32);hr.addColorStop(0,sp.clear?'rgba(40,30,20,.35)':'rgba(30,20,10,.45)');hr.addColorStop(1,'rgba(30,20,10,0)');x.fillStyle=hr;x.fillRect(-.2,-.5,.6,1);
 x.restore();
 x.lineJoin='round';if(A.fringe){x.strokeStyle=A.fringe;x.lineWidth=.03;pathOf(x,d);x.stroke()}
 x.strokeStyle=sp.clear?'rgba(40,24,16,.85)':'rgba(10,8,6,.65)';x.lineWidth=.022;pathOf(x,d);x.stroke();x.restore()}
const SPR={};// sprite cache: half-wing images per species at a pixel size
function wingSprite(k,px){px=Math.max(8,Math.round(px));const key=k+'@'+px;if(SPR[key])return SPR[key];const sp=SP[k];
 const cv=document.createElement('canvas');cv.width=Math.ceil(1.28*px);cv.height=Math.ceil(2.4*px);const x=cv.getContext('2d');x.translate(.04*px,1.0*px);x.scale(px,px);
 paintWing(x,sp,'h');paintWing(x,sp,'f');const o={cv,ox:.04*px,oy:1.0*px,px};SPR[key]=o;return o}
function clearSprites(){for(const k in SPR)delete SPR[k]}
// draw a butterfly at (bx,by) logical; u=unit size logical; open 0..1 wing openness; tilt radians
function drawBfly(x,k,bx,by,u,open,tilt,alpha=1){const sp=SP[k];const pxU=u*SC*DPR;const s=wingSprite(k,pxU>40?Math.ceil(pxU/8)*8:pxU);const sc=u/s.px;
 x.save();x.translate(bx,by);x.rotate(tilt||0);if(alpha<1)x.globalAlpha=alpha;const o=Math.max(.06,open);
 for(const side of [1,-1]){x.save();x.scale(side*o*sc,sc*(.94+.06*o));x.drawImage(s.cv,-s.ox,-s.oy);x.restore()}
 // body
 const bc=sp.body||'#1c1712';x.fillStyle=bc;x.beginPath();x.ellipse(0,u*.38,u*.05,u*.32,0,0,TAU);x.fill();x.beginPath();x.ellipse(0,u*.02,u*.075,u*.15,0,0,TAU);x.fill();
 x.beginPath();x.arc(0,-u*.17,u*.065,0,TAU);x.fill();
 if(!sp.body){x.fillStyle='rgba(255,255,255,.35)';for(let i=0;i<3;i++){x.beginPath();x.arc(0,u*(.2+i*.12),u*.018,0,TAU);x.fill()}}
 x.strokeStyle=bc;x.lineWidth=Math.max(.6,u*.022);x.lineCap='round';
 for(const sd of [1,-1]){x.beginPath();x.moveTo(sd*u*.02,-u*.22);x.quadraticCurveTo(sd*u*.06,-u*.5,sd*u*.2,-u*.66);x.stroke();x.beginPath();x.arc(sd*u*.2,-u*.66,u*.03,0,TAU);x.fill()}
 x.restore()}
