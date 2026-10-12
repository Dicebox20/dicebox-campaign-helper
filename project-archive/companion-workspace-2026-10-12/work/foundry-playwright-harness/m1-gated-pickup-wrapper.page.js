const s=game.scenes.get("U8S5ZrTjaPIkTUIL");
const ids=["OcRjOu5UK9Jq1XfI","8vtIgrjGwYaxjL07"];
const out=[];
for(const id of ids){
 let found=null,region=null;
 for(const r of Array.from(s.regions??[])){if(r.behaviors.has(id)){found=r.behaviors.get(id);region=r;break;}}
 out.push({id,region:region?.name??null,source:found?.system?.source??null,flags:found?.getFlag?.("world","dicebox")??null});
}
return {operation:"central-lodge.cl16.m1-gated-pickup-wrapper",status:"PASS",noWrite:true,out};