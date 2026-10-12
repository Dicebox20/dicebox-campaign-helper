const s=game.scenes.get("iqfCcDpEer4pwrJj");
const out=[];
for(const r of Array.from(s?.regions??[])){
 for(const b of Array.from(r.behaviors??[])){
  const f=b.getFlag?.("world","dicebox")??{};
  if(["socket","gate"].includes(f?.behaviorSpec?.action)){
    out.push({region:r.name,regionId:r.id,behavior:b.name,behaviorId:b.id,stableId:f.stableId??null,spec:f.behaviorSpec??null,source:b.system?.source??null});
  }
 }
}
return{operation:"central-lodge.cl20.e4.template-inspect",status:"PASS",noWrite:true,out};