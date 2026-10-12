const SCENE_ID="if9iWDRjSwI87EeX";
const LEDGER_ID="xhlXv6CCH34HVga3";
const KERNEL_ID="FHQiFYx6OntZVo9d";
const clone=v=>foundry.utils.deepClone(v);
const dbx=d=>{try{return clone(d?.getFlag?.("world","dicebox")??{});}catch{return{};}};
const normalize=v=>Array.isArray(v)?v.map(normalize):v&&typeof v==="object"?Object.fromEntries(Object.keys(v).sort().map(k=>[k,normalize(v[k])])):v;
const canonical=v=>JSON.stringify(normalize(v));
const sha256=async v=>Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256",new TextEncoder().encode(String(v??"")))),b=>b.toString(16).padStart(2,"0")).join("");
const scene=game.scenes.get(SCENE_ID),ledger=game.journal.get(LEDGER_ID),kernel=game.macros.get(KERNEL_ID);
if(!scene)return{status:"BLOCKED",reason:"U1 missing"};
const rows=[];
for(const r of Array.from(scene.regions??[])){
 const s=r.toObject();
 rows.push({id:r.id,name:r.name,stableId:dbx(r)?.stableId??null,class:dbx(r)?.regionClass??null,behaviors:r.behaviors.size,shapes:s.shapes??null,elevation:s.elevation??null,visibility:s.visibility??null,locked:s.locked??null});
}
const geom=rows.map(r=>({id:r.id,shapes:r.shapes,elevation:r.elevation,visibility:r.visibility,locked:r.locked})).sort((a,b)=>a.id.localeCompare(b.id));
const itemKeys=["house-proof","crown-crest"];
const items=itemKeys.map(key=>{const m=game.items.filter(i=>dbx(i)?.stableId===`dbx:central-lodge:item:${key}`);return{key,count:m.length,items:m.map(i=>({id:i.id,name:i.name,stableId:dbx(i)?.stableId??null,sourceScene:dbx(i)?.sourceScene??null,usedAt:dbx(i)?.usedAt??null,category:dbx(i)?.category??null}))};});
const state=clone(ledger?.getFlag("world","dicebox")?.state??{});
return{operation:"central-lodge.cl17.u1.readonly-preflight",status:"PASS",noWrite:true,
 runtime:{foundry:game.version,system:game.system?.version,world:game.world?.id,user:{id:game.user?.id,name:game.user?.name,isGM:game.user?.isGM}},
 scene:{id:scene.id,name:scene.name,regions:scene.regions.size,behaviors:rows.reduce((n,r)=>n+r.behaviors,0),flags:clone(scene.flags??{})},
 regionRows:rows,geometryHash:await sha256(canonical(geom)),kernelHash:await sha256(kernel?.command??""),
 items,ledger:{revision:state?.revision??null,notices:state?.notices??null,u1:clone(foundry.utils.getProperty(state,"puzzles.u1")??null),fullPuzzleKeys:Object.keys(state?.puzzles??{}).sort()}};