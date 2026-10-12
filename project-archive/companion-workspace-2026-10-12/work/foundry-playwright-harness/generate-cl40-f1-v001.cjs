const fs=require("node:fs");
const prev=fs.readFileSync("cl40-f1-canonical-assembly-preview-v001.page.js","utf8");
const idx=prev.lastIndexOf("\nreturn{operation:OP");if(idx<0)throw Error("Preview structure drift");
const pre=prev.slice(0,idx).replace('const OP="central-lodge.cl40.f1.canonical-assembly.preview.v001";','const OP="central-lodge.cl40.f1.canonical-assembly.apply.v001";');
const apply=`
if(fail.length)return{operation:OP,status:"BLOCKED",noWrite:true,fail};
if(candidate===null||await sha(candidate)!=="830030f02434d2654346d0cfde4a2e73bdb600a3b98412ca1e433b46fc99f2b7")return{operation:OP,status:"BLOCKED",reason:"Candidate source drift"};
const allIds=["0CSBwzcszPKyaB8u","5K1uASAARnX8aZhP","EDdktL7VUihbpKe9","UNySMm7YkyYfh41x","Zq8iXByDVhB7w","sI4YVZZChgey1qNi","iqfCcDpEer4pwrJj","DLcheEi6e5OHOYmU","U8S5ZrTjaPIkTUIL","JZkxX6lUQe8Nc8xJ","LXTA8mx1rJ2L6e2J","MAbLfBqG7qIVVuLN","4pc5akMBieHU7GvV","pHQvDUDlyWZFuNrX","if9iWDRjSwI87EeX","PVf6Gbrv9HbB88uZ","La9krMOMBhAhDLi6","ImeIdHbYb6kZKAdt","ez9MSQ8QIO4cW6zo","aIKQmFiuXWipEdyb","HWitOe1wSid7MZ1y"];
const stableWorldIds=allIds.map(id=>id==="Zq8iXByDVhB7w"?"Zq8iXByDVhHRbA7w":id);
let br=0,rn=0;for(const id of stableWorldIds){const sc=game.scenes.get(id);if(!sc)return{operation:OP,status:"BLOCKED",reason:"Missing scene "+id};rn+=sc.regions.size;br+=Array.from(sc.regions).reduce((a,r)=>a+r.behaviors.size,0);}
if(rn!==202||br!==113||!game.user?.isGM||game.user.id!=="pnTxw7VYpYR4IKWE")return{operation:OP,status:"BLOCKED",reason:"Baseline / executor drift"};
const kernel=game.macros.get("FHQiFYx6OntZVo9d"),kHash=await sha(kernel?.command??"");
if(kHash!=="6264c467211d4f5c94cfaaa9437eae88582599061b9d8a4951391830a3e8f814")return{operation:OP,status:"BLOCKED",reason:"Kernel drift"};
if(s.tokens.size!==0)return{operation:OP,status:"BLOCKED",reason:"F1 has active tokens"};
const before=src,sceneBefore=canon(s.getFlag("world","dicebox")??{}),ledgerBefore=canon(ledger);
try{
  if(await sha(b.system?.source??"")!==PRE_HASH)throw Error("Immediate prewrite source drift");
  await b.update({"system.source":candidate});
  if(await sha(b.system?.source??"")!=="830030f02434d2654346d0cfde4a2e73bdb600a3b98412ca1e433b46fc99f2b7")throw Error("After source hash drift");
  if(await sha(canon(Array.from(s.regions).map(r=>{const o=r.toObject();return{id:r.id,shapes:o.shapes??null,elevation:o.elevation??null,visibility:o.visibility??null,locked:o.locked??null}}).sort((a,b)=>a.id.localeCompare(b.id))))!==GEOM)throw Error("After geometry drift");
  if(canon(s.getFlag("world","dicebox")??{})!==sceneBefore||canon(game.journal.get("xhlXv6CCH34HVga3")?.getFlag("world","dicebox")?.state??{})!==ledgerBefore)throw Error("State changed");
  return{operation:OP,status:"PASS",changedBehaviorId:BID,oldHash,newHash:await sha(b.system.source),globalRegions:rn,globalBehaviors:br,noGameplayCanary:true,finalVerifyRequired:true};
}catch(e){let error=null;try{await b.update({"system.source":before});if(await sha(b.system?.source??"")!==PRE_HASH)throw Error("Rollback source mismatch");}catch(rb){error=String(rb)}return{operation:OP,status:error?"OUTCOME_UNKNOWN_ROLLBACK_INCOMPLETE":"FAIL_ROLLBACK_COMPLETE",reason:String(e),rollbackError:error};}
`;
fs.writeFileSync("cl40-f1-canonical-assembly-apply-v001.page.js",pre+"\n"+apply+"\n");
const verify=`const OP="central-lodge.cl40.f1.canonical-assembly.final-verify.v001";
const s=game.scenes.get("La9krMOMBhAhDLi6"),r=s?.regions.get("cAPhThdExniaYnbx"),b=r?.behaviors.get("VPsFO5t8IhCzf5wn"),errors=[];
const sha=async t=>Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256",new TextEncoder().encode(String(t??"")))),x=>x.toString(16).padStart(2,"0")).join("");
const norm=v=>Array.isArray(v)?v.map(norm):v&&typeof v==="object"?Object.fromEntries(Object.keys(v).sort().map(k=>[k,norm(v[k])])):v,canon=v=>JSON.stringify(norm(v));
const geo=await sha(canon(Array.from(s?.regions??[]).map(r=>{const o=r.toObject();return{id:r.id,shapes:o.shapes??null,elevation:o.elevation??null,visibility:o.visibility??null,locked:o.locked??null}}).sort((a,b)=>a.id.localeCompare(b.id))));
const st=game.journal.get("xhlXv6CCH34HVga3")?.getFlag("world","dicebox")?.state??{},ss=s.getFlag("world","dicebox")?.f1??{},src=b?.system?.source??"";
if(await sha(src)!=="830030f02434d2654346d0cfde4a2e73bdb600a3b98412ca1e433b46fc99f2b7")errors.push("Assembly source hash drift");
for(const [rid,bid,hash] of [["bpjGc2NlZB8zCxmX","jmTli5qX0dmPexKp","978e0a0b7821e349e112f9587249b3c35a0735aa5ff6564be2bd01444c58271d"],["rJk5e9pqhY0KbsYV","J532Dz50Qua3tLky","058fe8a634791b2dcf0f016c6318c18bcea955f2471b5605da6eb674ac6ff184"],["iuoEHBXWtXgzYmMh","FElgIMZFVX5GleSy","da494b469d921661803360ca1d0f1699ad5f8950b3ae084d58efd124d01bac25"]])if(await sha(s.regions.get(rid)?.behaviors.get(bid)?.system?.source??"")!==hash)errors.push("Foreign F1 behavior drift "+bid);
if(geo!=="6aa46295e7c4ba743246763116772ab67051de2ad7e9444012413922ffe714b5"||s.regions.size!==6||Array.from(s.regions).reduce((n,r)=>n+r.behaviors.size,0)!==4)errors.push("F1 geometry/roster drift");
if(!src.includes('flags.canonicalStableId ?? flags.stableId')||src.includes("const findPart = test => inventory.find(x => test(x.name))"))errors.push("Canonical selector missing");
const expected=["infernal-cicada-body","cicada-wing-i","cicada-wing-ii","cicada-wing-iii","cicada-wing-iv"];for(const key of expected){if(!src.includes('findPart("'+key+'")'))errors.push("Missing key "+key);}
if(st.revision!==0||ss.cicadaInstalled!==false||ss.innerWardResolved!==false)errors.push("Gameplay state changed");
return{operation:OP,status:errors.length?"FAIL":"PASS",noWrite:true,errors,assemblyBehaviorId:b?.id,sourceHash:await sha(src),f1GeometryHash:geo,f1RegionCount:s.regions.size,f1BehaviorCount:4,ledgerRevision:st.revision,transitionUnchanged:true,noGameplayCanary:true};
`;
fs.writeFileSync("cl40-f1-canonical-assembly-final-verify-v001.page.js",verify);
console.log("Generated CL40 APPLY + independent verifier");
