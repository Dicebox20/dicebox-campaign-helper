const fs=require("node:fs"),crypto=require("node:crypto");
const path="cl50-e1-m1-front-door-source-v001.txt",raw=fs.readFileSync(path,"utf8"),s=raw.trimEnd();
const H=x=>crypto.createHash("sha256").update(x).digest("hex");
console.log(JSON.stringify({bytes:Buffer.byteLength(raw),rawChars:raw.length,trimChars:s.length,rawSha:H(raw),trimSha:H(s),changed:raw!==s}));
const IDS=["0CSBwzcszPKyaB8u","5K1uASAARnX8aZhP","EDdktL7VUihbpKe9","UNySMm7YkyYfh41x","Zq8iXByDVhHRbA7w","sI4YVZZChgey1qNi","iqfCcDpEer4pwrJj","DLcheEi6e5OHOYmU","U8S5ZrTjaPIkTUIL","JZkxX6lUQe8Nc8xJ","LXTA8mx1rJ2L6e2J","MAbLfBqG7qIVVuLN","4pc5akMBieHU7GvV","pHQvDUDlyWZFuNrX","if9iWDRjSwI87EeX","PVf6Gbrv9HbB88uZ","La9krMOMBhAhDLi6","ImeIdHbYb6kZKAdt","ez9MSQ8QIO4cW6zo","aIKQmFiuXWipEdyb","HWitOe1wSid7MZ1y"];
const S={sourceScene:"Zq8iXByDVhHRbA7w",targetScene:"U8S5ZrTjaPIkTUIL",sourceId:"QS7OpvIilyyDpmLc",targetId:"4b8vfvKAKXBS6kfW",sourceStable:"dbx:central-lodge:e1:region:e1-lodge-entrance",targetStable:"dbx:central-lodge:m1:region:m1-transition-main-door",behaviorStable:"dbx:central-lodge:e1:behavior:main-entrance-to-m1",targetSceneStable:"dbx:central-lodge:m1",e1Geo:"0b39046a2eb2bae365417a98b22f39611bcbfeb71c24f8a78864adf0dec9ed2e",m1Geo:"03418a0e99c659fc76d109e5c061ccaf5244448504d0f4d03238416032dcd158",sourceShape:"4c0232506db0a7f13a731d33f1ca1d8e9d764615435d4bb201dd78108695011c",targetShape:"125ace23b2783b276d38ebbcc936f5cb284e0c7497a736d88c55d33896a7ca39",sourceHash:H(s)};
const head=`const OP="central-lodge.cl50.e1-m1.guarded-preview.v001",IDS=${JSON.stringify(IDS)},S=${JSON.stringify(S)},SOURCE=${JSON.stringify(s)};
const sha=async t=>Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256",new TextEncoder().encode(String(t??"")))),b=>b.toString(16).padStart(2,"0")).join("");
const norm=v=>Array.isArray(v)?v.map(norm):v&&typeof v==="object"?Object.fromEntries(Object.keys(v).sort().map(k=>[k,norm(v[k])])):v;
const canon=v=>JSON.stringify(norm(v));
const geo=s=>Array.from(s.regions).map(r=>{const o=r.toObject();return{id:r.id,shapes:o.shapes??null,elevation:o.elevation??null,visibility:o.visibility??null,locked:o.locked??null}}).sort((a,b)=>a.id.localeCompare(b.id));
const scene=game.scenes.get(S.sourceScene),destScene=game.scenes.get(S.targetScene),src=scene?.regions.get(S.sourceId),dst=destScene?.regions.get(S.targetId),errors=[];
let regions=0,behaviors=0;for(const id of IDS){const s=game.scenes.get(id);if(!s){errors.push("Missing Scene "+id);continue;}regions+=s.regions.size;behaviors+=Array.from(s.regions).reduce((n,r)=>n+r.behaviors.size,0);}
if(IDS.length!==21||regions!==202||behaviors!==115)errors.push("World scene/region/behavior baseline drift");
const ledger=game.journal.get("xhlXv6CCH34HVga3")?.getFlag("world","dicebox")?.state??{};
if(ledger.revision!==0||Object.keys(ledger.notices??{}).length!==0)errors.push("Ledger drift");
if(await sha(game.macros.get("FHQiFYx6OntZVo9d")?.command??"")!=="6264c467211d4f5c94cfaaa9437eae88582599061b9d8a4951391830a3e8f814")errors.push("Kernel drift");
if(!src||!dst||src.behaviors.size!==0||dst.behaviors.size!==0||src.getFlag("world","dicebox")?.stableId!==S.sourceStable||dst.getFlag("world","dicebox")?.stableId!==S.targetStable)errors.push("Endpoint region/behavior/stableId drift");
const sf=src?.getFlag("world","dicebox")??{};
if(sf.regionClass!=="transition"||(sf.destinationStableSceneId??null)!==null||(sf.bindingStatus??null)!==null)errors.push("Source route not unbound");
if(await sha(canon(geo(scene)))!==S.e1Geo||await sha(canon(geo(destScene)))!==S.m1Geo)errors.push("Endpoint scene geometry drift");
if(await sha(canon(src?.toObject()?.shapes??[]))!==S.sourceShape||await sha(canon(dst?.toObject()?.shapes??[]))!==S.targetShape)errors.push("Endpoint region shape drift");
if(await sha(SOURCE)!==S.sourceHash)errors.push("Exact source hash drift");
try{new (Object.getPrototypeOf(async function(){}).constructor)("event",SOURCE)}catch(e){errors.push("Syntax: "+String(e))}
if(!SOURCE.includes("DialogV2.confirm")||!SOURCE.includes("__primary.id")||!SOURCE.includes("teleportToken(")||!SOURCE.includes("declinedUntil"))errors.push("Required consent and GM arbitration absent");
for(const id of IDS)for(const r of game.scenes.get(id)?.regions??[])for(const b of r.behaviors)if(b.getFlag("world","dicebox")?.stableId===S.behaviorStable)errors.push("StableId collision");
if(!game.user?.isGM||game.user.id!=="pnTxw7VYpYR4IKWE")errors.push("Authorized automation executor not active");
const tokenBefore=Array.from(scene?.tokens??[]).map(t=>({id:t.id,x:t.x,y:t.y})).sort((a,b)=>a.id.localeCompare(b.id));
if(tokenBefore.length!==6)errors.push("E1 active-token roster drift");
const door=src?.toObject()?.shapes?.[0],tokensInside=Array.from(scene?.tokens??[]).filter(t=>door&&t.x>=door.x&&t.x<=door.x+door.width&&t.y>=door.y&&t.y<=door.y+door.height).map(t=>t.id);
if(tokensInside.length!==1||tokensInside[0]!=="O8N0GTBMkIr63IL3")errors.push("Doorway token condition changed, review before install");
`;
const preview=head+`return{operation:OP,status:errors.length?"BLOCKED":"PASS",noWrite:true,errors,baseline:{regions,behaviors,sceneTokens:tokenBefore.length,tokensInside},endpoints:{src:src?.id,dst:dst?.id,sourceHash:await sha(SOURCE),geomE1:await sha(canon(geo(scene))),geomM1:await sha(canon(geo(destScene)))},planned:"Add one tokenEnter GM-confirmed one-way E1 to M1 travel RegionBehavior; no token teleport on install and no reciprocal automatic behavior."};`;
fs.writeFileSync("cl50-e1m1-guarded-preview-v001.page.js",preview);
const apply=head.replace("guarded-preview","guarded-apply")+`
if(errors.length)return{operation:OP,status:"BLOCKED",noWrite:true,errors};
const saved=foundry.utils.deepClone(sf),ledgerBefore=canon(ledger),created=[],tokenSnapshot=canon(tokenBefore);
try{
  if(src.behaviors.size!==0||await sha(canon(src.toObject().shapes))!==S.sourceShape)throw Error("Immediate prewrite Region drift");
  await src.update({"flags.world.dicebox.destinationStableSceneId":S.targetSceneStable,"flags.world.dicebox.bindingStatus":"BOUND_CL50_E1_TO_M1"});
  const made=await src.createEmbeddedDocuments("RegionBehavior",[{
     name:"DiceBox CL-50 — Enter Main Lodge from E1 (GM Confirmed)",type:"executeScript",disabled:false,
     system:{events:["tokenEnter"],source:SOURCE},
     flags:{world:{dicebox:{schemaVersion:"1.0.0",campaignId:"central-lodge",managed:true,sceneKey:"E1",installer:"central-lodge-cl50-e1-m1-guarded-apply-v001",stableId:S.behaviorStable,regionStableId:S.sourceStable,sourceHash:S.sourceHash,routeAuthority:"M1 main-door exact named Region"}}}}
  ]);
  if(made?.length!==1)throw Error("Unexpected created behavior count");
  created.push(made[0].id);
  const actual=src.behaviors.get(made[0].id),f=src.getFlag("world","dicebox")??{};
  if(await sha(actual?.system?.source??"")!==S.sourceHash||actual?.disabled!==false||f.destinationStableSceneId!==S.targetSceneStable||f.bindingStatus!=="BOUND_CL50_E1_TO_M1")throw Error("Installed source/flags mismatch");
  let n=0,b=0;for(const id of IDS){const sc=game.scenes.get(id);n+=sc.regions.size;b+=Array.from(sc.regions).reduce((a,r)=>a+r.behaviors.size,0);}
  if(n!==202||b!==116||src.behaviors.size!==1||dst.behaviors.size!==0)throw Error("Unexpected global counts");
  if(await sha(canon(geo(scene)))!==S.e1Geo||await sha(canon(geo(destScene)))!==S.m1Geo)throw Error("Geometry changed");
  if(canon(game.journal.get("xhlXv6CCH34HVga3")?.getFlag("world","dicebox")?.state??{})!==ledgerBefore)throw Error("Ledger changed");
  const nowTokens=Array.from(scene.tokens).map(t=>({id:t.id,x:t.x,y:t.y})).sort((a,b)=>a.id.localeCompare(b.id));
  if(canon(nowTokens)!==tokenSnapshot)throw Error("E1 token placement drift; cannot attribute to installer");
  return{operation:OP,status:"PASS",noGameplayCanary:true,sourceRegionId:src.id,behaviorId:actual.id,sourceHash:await sha(actual.system.source),destinationRegionId:dst.id,regions:n,behaviors:b,ledgerRevision:ledger.revision,tokenCount:nowTokens.length,independentFinalVerifyRequired:true};
}catch(e){
 const rollbackErrors=[];for(const id of created.reverse())try{await src.deleteEmbeddedDocuments("RegionBehavior",[id])}catch(x){rollbackErrors.push("delete "+id+":"+String(x))}
 try{await src.update({"flags.world.dicebox.-=destinationStableSceneId":null,"flags.world.dicebox.-=bindingStatus":null});}catch(x){rollbackErrors.push("unset flags:"+String(x))}
 const f=src.getFlag("world","dicebox")??{};if(f.destinationStableSceneId!==undefined||f.bindingStatus!==undefined)rollbackErrors.push("Rollback flags not unset");
 return{operation:OP,status:rollbackErrors.length?"OUTCOME_UNKNOWN_ROLLBACK_INCOMPLETE":"FAIL_ROLLBACK_COMPLETE",error:String(e),rollbackErrors,createdCount:created.length};
}
`;
fs.writeFileSync("cl50-e1m1-guarded-apply-v001.page.js",apply);
const verify=`const OP="central-lodge.cl50.e1-m1.final-verify.v001",IDS=${JSON.stringify(IDS)},S=${JSON.stringify(S)},errs=[],sha=async t=>Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256",new TextEncoder().encode(String(t??"")))),b=>b.toString(16).padStart(2,"0")).join("");
const norm=v=>Array.isArray(v)?v.map(norm):v&&typeof v==="object"?Object.fromEntries(Object.keys(v).sort().map(k=>[k,norm(v[k])])):v,canon=v=>JSON.stringify(norm(v));
const geo=s=>Array.from(s.regions).map(r=>{const o=r.toObject();return{id:r.id,shapes:o.shapes??null,elevation:o.elevation??null,visibility:o.visibility??null,locked:o.locked??null}}).sort((a,b)=>a.id.localeCompare(b.id));
const E1=game.scenes.get(S.sourceScene),M1=game.scenes.get(S.targetScene),src=E1?.regions.get(S.sourceId),dst=M1?.regions.get(S.targetId);
let regions=0,behaviors=0;for(const id of IDS){const s=game.scenes.get(id);if(!s){errs.push("Scene missing:"+id);continue;}regions+=s.regions.size;behaviors+=Array.from(s.regions).reduce((n,r)=>n+r.behaviors.size,0);}
if(regions!==202||behaviors!==116)errs.push("Global counts drift");
const candidates=Array.from(src?.behaviors??[]).filter(b=>b.getFlag("world","dicebox")?.stableId===S.behaviorStable),b=candidates[0];
if(candidates.length!==1||src.behaviors.size!==1||dst.behaviors.size!==0||b?.disabled!==false||b.type!=="executeScript")errs.push("Behavior roster drift");
if(await sha(b?.system?.source??"")!==S.sourceHash)errs.push("Source hash drift");
if(JSON.stringify(Array.from(b?.system?.events??[]))!=='["tokenEnter"]')errs.push("Trigger event drift");
const f=src?.getFlag("world","dicebox")??{};
if(f.stableId!==S.sourceStable||f.destinationStableSceneId!==S.targetSceneStable||f.bindingStatus!=="BOUND_CL50_E1_TO_M1"||dst?.getFlag("world","dicebox")?.stableId!==S.targetStable)errs.push("Route flags/target drift");
if(await sha(canon(geo(E1)))!==S.e1Geo||await sha(canon(geo(M1)))!==S.m1Geo)errs.push("Geometry drift");
const l=game.journal.get("xhlXv6CCH34HVga3")?.getFlag("world","dicebox")?.state??{},kernel=game.macros.get("FHQiFYx6OntZVo9d");
if(l.revision!==0||Object.keys(l.notices??{}).length||await sha(kernel?.command??"")!=="6264c467211d4f5c94cfaaa9437eae88582599061b9d8a4951391830a3e8f814")errs.push("Kernel/ledger drift");
const nearby=Array.from(E1?.tokens??[]).map(t=>({id:t.id,x:t.x,y:t.y})).sort((a,b)=>a.id.localeCompare(b.id));
if(nearby.length!==6||!nearby.some(t=>t.id==="O8N0GTBMkIr63IL3"&&t.x===2240&&t.y===1148))errs.push("E1 token position/roster drift");
return{operation:OP,status:errs.length?"FAIL":"PASS",noWrite:true,errs,regions,behaviors,behaviorId:b?.id,sourceHash:await sha(b?.system?.source??""),route:{sourceId:src?.id,targetId:dst?.id},ledgerRevision:l.revision,sceneTokens:nearby.length,noGameplayCanary:true};
`;
fs.writeFileSync("cl50-e1m1-final-verify-v001.page.js",verify);
console.log("CL50_E1M1_GUARDED_SCRIPTS_GENERATED",JSON.stringify(S));
