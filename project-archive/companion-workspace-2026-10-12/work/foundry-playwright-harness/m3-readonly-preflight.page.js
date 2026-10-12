const SCENE_ID="LXTA8mx1rJ2L6e2J";
const B2_ID="5K1uASAARnX8aZhP";
const LEDGER_ID="xhlXv6CCH34HVga3";
const KERNEL_ID="FHQiFYx6OntZVo9d";
const clone=v=>foundry.utils.deepClone(v);
const dbx=d=>{try{return clone(d?.getFlag?.("world","dicebox")??{});}catch{return{};}};
const normalize=v=>Array.isArray(v)?v.map(normalize):v&&typeof v==="object"?Object.fromEntries(Object.keys(v).sort().map(k=>[k,normalize(v[k])])):v;
const canonical=v=>JSON.stringify(normalize(v));
const sha256=async v=>Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256",new TextEncoder().encode(String(v??"")))),b=>b.toString(16).padStart(2,"0")).join("");
const scene=game.scenes.get(SCENE_ID);
const b2=game.scenes.get(B2_ID);
const ledger=game.journal.get(LEDGER_ID);
const kernel=game.macros.get(KERNEL_ID);
if(!scene) return {status:"BLOCKED",reason:"M3 missing"};
const regionRows=[];
for(const r of Array.from(scene.regions??[])){
  const s=r.toObject();
  const beh=Array.from(r.behaviors??[]);
  regionRows.push({
    id:r.id,name:r.name,stableId:dbx(r)?.stableId??null,class:dbx(r)?.regionClass??null,
    behaviors:beh.length,behaviorRows:beh.map(b=>({id:b.id,name:b.name,stableId:dbx(b)?.stableId??null,type:b.type,disabled:b.disabled,events:b.system?.events??null,sourceHash:null})),
    shapes:s.shapes??null,elevation:s.elevation??null,visibility:s.visibility??null,locked:s.locked??null
  });
}
for(const row of regionRows){
  for(const b of row.behaviorRows){
    const rb=scene.regions.get(row.id)?.behaviors.get(b.id);
    b.sourceHash=await sha256(rb?.system?.source??"");
  }
}
const geom=regionRows.map(r=>({id:r.id,shapes:r.shapes,elevation:r.elevation,visibility:r.visibility,locked:r.locked})).sort((a,b)=>a.id.localeCompare(b.id));
const itemKeys=["servant-bell-pull","bell-crest"];
const items=itemKeys.map(key=>{
 const matches=game.items.filter(i=>dbx(i)?.stableId===`dbx:central-lodge:item:${key}`);
 return {key,count:matches.length,items:matches.map(i=>({id:i.id,name:i.name,stableId:dbx(i)?.stableId??null,sourceScene:dbx(i)?.sourceScene??null,usedAt:dbx(i)?.usedAt??null,category:dbx(i)?.category??null}))};
});
const state=clone(ledger?.getFlag("world","dicebox")?.state??{});
const b2Regions=Array.from(b2?.regions??[]).map(r=>({id:r.id,name:r.name,stableId:dbx(r)?.stableId??null,class:dbx(r)?.regionClass??null,behaviors:r.behaviors.size}));
return {
 operation:"central-lodge.cl16.m3.readonly-preflight",
 status:"PASS",noWrite:true,
 runtime:{foundry:game.version,system:game.system?.version,world:game.world?.id,user:{id:game.user?.id,name:game.user?.name,isGM:game.user?.isGM}},
 scene:{id:scene.id,name:scene.name,regions:scene.regions.size,behaviors:regionRows.reduce((n,r)=>n+r.behaviors,0),flags:clone(scene.flags??{})},
 regionRows,
 geometryHash:await sha256(canonical(geom)),
 kernelHash:await sha256(kernel?.command??""),
 items,
 ledger:{revision:state?.revision??null,notices:state?.notices??null,m3:clone(foundry.utils.getProperty(state,"puzzles.m3")??null),b2:clone(foundry.utils.getProperty(state,"puzzles.b2")??null),fullPuzzleKeys:Object.keys(state?.puzzles??{}).sort()},
 b2:{id:b2?.id??null,name:b2?.name??null,regions:b2?.regions?.size??null,behaviors:b2Regions.reduce((n,r)=>n+r.behaviors,0),regionRows:b2Regions}
};