const fs=require("node:fs");
const source=fs.readFileSync("cl50-t3-n3-return-source-v001.txt","utf8");
const ids=["0CSBwzcszPKyaB8u","5K1uASAARnX8aZhP","EDdktL7VUihbpKe9","UNySMm7YkyYfh41x","Zq8iXByDVhHRbA7w","sI4YVZZChgey1qNi","iqfCcDpEer4pwrJj","DLcheEi6e5OHOYmU","U8S5ZrTjaPIkTUIL","JZkxX6lUQe8Nc8xJ","LXTA8mx1rJ2L6e2J","MAbLfBqG7qIVVuLN","4pc5akMBieHU7GvV","pHQvDUDlyWZFuNrX","if9iWDRjSwI87EeX","PVf6Gbrv9HbB88uZ","La9krMOMBhAhDLi6","ImeIdHbYb6kZKAdt","ez9MSQ8QIO4cW6zo","aIKQmFiuXWipEdyb","HWitOe1wSid7MZ1y"];
const head=`const ID="central-lodge.cl50.t3-n3.return.preview.v001",SCENES=${JSON.stringify(ids)},SCRIPT=${JSON.stringify(source)};
const SOURCE_ID="YElrtisbXN3DJ2Sw",DEST_ID="RP1jYOH738xl9hks",STABLE="dbx:central-lodge:t3:behavior:return-to-n3",HASH="051c669835aaed94f0497ebe6e54590d37df97eceb271b611b0263ca95b8f963";
const sha=async s=>Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256",new TextEncoder().encode(String(s??"")))),b=>b.toString(16).padStart(2,"0")).join("");
const norm=v=>Array.isArray(v)?v.map(norm):v&&typeof v==="object"?Object.fromEntries(Object.keys(v).sort().map(k=>[k,norm(v[k])])):v,canon=v=>JSON.stringify(norm(v));
const geom=s=>Array.from(s.regions).map(r=>{const o=r.toObject();return{id:r.id,shapes:o.shapes??null,elevation:o.elevation??null,visibility:o.visibility??null,locked:o.locked??null}}).sort((a,b)=>a.id.localeCompare(b.id));
const T3=game.scenes.get("aIKQmFiuXWipEdyb"),N3=game.scenes.get("pHQvDUDlyWZFuNrX"),src=T3?.regions.get(SOURCE_ID),dest=N3?.regions.get(DEST_ID),flags=src?.getFlag("world","dicebox")??{},ledger=game.journal.get("xhlXv6CCH34HVga3")?.getFlag("world","dicebox")?.state??{},fail=[];
let regions=0,behaviors=0;for(const id of SCENES){const s=game.scenes.get(id);if(!s){fail.push("scene missing:"+id);continue;}regions+=s.regions.size;behaviors+=Array.from(s.regions).reduce((n,r)=>n+r.behaviors.size,0);}
if(regions!==202||behaviors!==114)fail.push("baseline count drift");
if(!src||!dest||src.behaviors.size!==0||dest.behaviors.size!==0||flags.destinationStableSceneId!=="dbx:central-lodge:n3"||flags.bindingStatus!=="KNOWN_DESTINATION_RUNTIME_TRANSITION_PENDING"||dest.getFlag("world","dicebox")?.stableId!=="dbx:central-lodge:n3:region:n3-branch-railway")fail.push("source/dest authority drift");
if(await sha(SCRIPT)!==HASH)fail.push("source SHA drift");
if(await sha(canon(geom(T3)))!=="e372066d468469936ce90a6065a567c0dff0d8fff6d5a48fb07404e1e0ceeead"||await sha(canon(geom(N3)))!=="43bcb471640053e7000a8b37c6cd5243179295f5fe80f0537077646b62df1fd3")fail.push("geometry drift");
if(ledger.revision!==0||ledger.puzzles?.n3?.t3BranchUnlocked!==false||await sha(game.macros.get("FHQiFYx6OntZVo9d")?.command??"")!=="6264c467211d4f5c94cfaaa9437eae88582599061b9d8a4951391830a3e8f814")fail.push("ledger/kernel drift");
for(const id of SCENES)for(const r of game.scenes.get(id)?.regions??[])for(const b of r.behaviors)if(b.getFlag("world","dicebox")?.stableId===STABLE)fail.push("stableId collision");
try{new (Object.getPrototypeOf(async function(){}).constructor)("event",SCRIPT)}catch(err){fail.push("syntax "+String(err))}
`;
const endPreview=`return{operation:ID,status:fail.length?"BLOCKED":"PASS",noWrite:true,failures:fail,regions,behaviors,sourceRegionId:src?.id,destRegionId:dest?.id,sourceHash:await sha(SCRIPT),bindingStatus:flags.bindingStatus,plan:"one-way T3->N3 return with GM confirmation, does not set N3 t3BranchUnlocked or enter T3 from N3"};`;
const apply=head.replace("return.preview.v001","return.apply.v001")+`
if(fail.length)return{operation:ID,status:"BLOCKED",noWrite:true,failures:fail};
if(!game.user?.isGM||game.user.id!=="pnTxw7VYpYR4IKWE"||T3.tokens.size!==0)return{operation:ID,status:"BLOCKED",reason:"executor or active token"};
const beforeFlags=foundry.utils.deepClone(flags),beforeState=canon(ledger),created=[];
try{
 await src.update({"flags.world.dicebox.bindingStatus":"BOUND_CL50_T3_RETURN_N3"});
 const made=await src.createEmbeddedDocuments("RegionBehavior",[{name:"DiceBox CL-50 — Return from T3 to N3 (GM Confirmed)",type:"executeScript",disabled:false,system:{events:["tokenEnter"],source:SCRIPT},flags:{world:{dicebox:{schemaVersion:"1.0.0",campaignId:"central-lodge",managed:true,sceneKey:"T3",installer:"central-lodge-cl50-t3-n3-return-v001",stableId:STABLE,regionStableId:flags.stableId,sourceHash:HASH}}}}]);
 if(made?.length!==1)throw Error("create cardinality");
 created.push(made[0].id);
 const b=src.behaviors.get(made[0].id),f=src.getFlag("world","dicebox")??{};
 if(!b||await sha(b.system?.source??"")!==HASH||f.bindingStatus!=="BOUND_CL50_T3_RETURN_N3"||f.destinationStableSceneId!=="dbx:central-lodge:n3")throw Error("write reread drift");
 let n=0,bb=0;for(const id of SCENES){const s=game.scenes.get(id);n+=s.regions.size;bb+=Array.from(s.regions).reduce((a,r)=>a+r.behaviors.size,0);}
 if(n!==202||bb!==115||src.behaviors.size!==1)throw Error("post totals drift");
 if(await sha(canon(geom(T3)))!=="e372066d468469936ce90a6065a567c0dff0d8fff6d5a48fb07404e1e0ceeead"||await sha(canon(geom(N3)))!=="43bcb471640053e7000a8b37c6cd5243179295f5fe80f0537077646b62df1fd3")throw Error("post geometry drift");
 if(canon(game.journal.get("xhlXv6CCH34HVga3")?.getFlag("world","dicebox")?.state??{})!==beforeState)throw Error("ledger drift");
 return{operation:ID,status:"PASS",noGameplayCanary:true,createdBehaviorId:b.id,sourceHash:HASH,sourceRegionId:src.id,destinationRegionId:dest.id,globalRegions:n,globalBehaviors:bb,independentFinalVerifyRequired:true};
}catch(err){
 const rollbackErrors=[];
 for(const id of created.reverse())try{await src.deleteEmbeddedDocuments("RegionBehavior",[id])}catch(e){rollbackErrors.push("delete:"+String(e))}
 try{await src.update({"flags.world.dicebox.bindingStatus":beforeFlags.bindingStatus})}catch(e){rollbackErrors.push("restore binding:"+String(e))}
 return{operation:ID,status:rollbackErrors.length?"OUTCOME_UNKNOWN_ROLLBACK_INCOMPLETE":"FAIL_ROLLBACK_COMPLETE",error:String(err),rollbackErrors};
}
`;
fs.writeFileSync("cl50-t3-n3-return-preview-v001.page.js",head+endPreview);
fs.writeFileSync("cl50-t3-n3-return-apply-v001.page.js",apply);
const verify=`const ID="central-lodge.cl50.t3-n3.return.final-verify.v001",ids=${JSON.stringify(ids)},fail=[];
const sha=async s=>Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256",new TextEncoder().encode(String(s??"")))),b=>b.toString(16).padStart(2,"0")).join("");
const norm=v=>Array.isArray(v)?v.map(norm):v&&typeof v==="object"?Object.fromEntries(Object.keys(v).sort().map(k=>[k,norm(v[k])])):v,canon=v=>JSON.stringify(norm(v));
const geom=s=>Array.from(s.regions).map(r=>{const o=r.toObject();return{id:r.id,shapes:o.shapes??null,elevation:o.elevation??null,visibility:o.visibility??null,locked:o.locked??null}}).sort((a,b)=>a.id.localeCompare(b.id));
let regions=0,behaviors=0;for(const id of ids){const s=game.scenes.get(id);if(!s){fail.push("missing scene "+id);continue;}regions+=s.regions.size;behaviors+=Array.from(s.regions).reduce((n,r)=>n+r.behaviors.size,0);}
if(regions!==202||behaviors!==115)fail.push("totals drift");
const T3=game.scenes.get("aIKQmFiuXWipEdyb"),N3=game.scenes.get("pHQvDUDlyWZFuNrX"),r=T3.regions.get("YElrtisbXN3DJ2Sw"),d=N3.regions.get("RP1jYOH738xl9hks"),bb=Array.from(r.behaviors).filter(b=>b.getFlag("world","dicebox")?.stableId==="dbx:central-lodge:t3:behavior:return-to-n3"),b=bb[0];
if(bb.length!==1||r.behaviors.size!==1||b?.disabled!==false||await sha(b?.system?.source??"")!=="051c669835aaed94f0497ebe6e54590d37df97eceb271b611b0263ca95b8f963")fail.push("source roster/hash drift");
if(r.getFlag("world","dicebox")?.bindingStatus!=="BOUND_CL50_T3_RETURN_N3"||r.getFlag("world","dicebox")?.destinationStableSceneId!=="dbx:central-lodge:n3"||d.getFlag("world","dicebox")?.stableId!=="dbx:central-lodge:n3:region:n3-branch-railway")fail.push("route metadata drift");
if(await sha(canon(geom(T3)))!=="e372066d468469936ce90a6065a567c0dff0d8fff6d5a48fb07404e1e0ceeead"||await sha(canon(geom(N3)))!=="43bcb471640053e7000a8b37c6cd5243179295f5fe80f0537077646b62df1fd3")fail.push("geometry drift");
const l=game.journal.get("xhlXv6CCH34HVga3")?.getFlag("world","dicebox")?.state??{};
if(l.revision!==0||l.puzzles?.n3?.t3BranchUnlocked!==false||await sha(game.macros.get("FHQiFYx6OntZVo9d")?.command??"")!=="6264c467211d4f5c94cfaaa9437eae88582599061b9d8a4951391830a3e8f814")fail.push("ledger/kernel drift");
return{operation:ID,status:fail.length?"FAIL":"PASS",noWrite:true,failures:fail,regions,behaviors,sourceRegionId:r.id,destinationRegionId:d.id,behaviorId:b?.id,sourceHash:await sha(b?.system?.source??""),ledgerRevision:l.revision,noGameplayCanary:true};
`;
fs.writeFileSync("cl50-t3-n3-return-final-verify-v001.page.js",verify);
console.log("Generated CL50 T3-N3 guarded scripts");
