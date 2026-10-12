const KERNEL_ID="FHQiFYx6OntZVo9d";
const scene=game.scenes.get("U8S5ZrTjaPIkTUIL");
const kernel=game.macros.get(KERNEL_ID);
const dbx=d=>foundry.utils.deepClone(d?.getFlag?.("world","dicebox")??{});
const rows=[];
for(const r of Array.from(scene?.regions??[])){
 for(const b of Array.from(r.behaviors??[])){
  const f=dbx(b);
  if(["pickup","observe","notice","socket","gate"].includes(f?.behaviorSpec?.action)){
   rows.push({region:r.name,regionId:r.id,behavior:b.name,behaviorId:b.id,stableId:f.stableId??null,spec:f.behaviorSpec??null});
  }
 }
}
const src=String(kernel?.command??"");
const block=(a,b)=>{const i=src.indexOf(a),j=src.indexOf(b,i+1); return i>=0&&j>i?src.slice(i,j):null;};
return {operation:"central-lodge.cl16.contract-pattern-inspect",status:"PASS",noWrite:true,m1Rows:rows,
noticeSource:block("const runNotice","const runObserve"),
observeSource:block("const runObserve","const runPickup"),
pickupSource:block("const runPickup","const runSocket"),
socketSource:block("const runSocket","const runGate"),
gateSource:block("const runGate","const runTransition")};