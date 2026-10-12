const fs=require("node:fs");
const prev=fs.readFileSync("cl50-t3-f1-preview-v001.page.js","utf8");const cut=prev.lastIndexOf("\nreturn{operation:ID");if(cut<0)throw Error("Unexpected preview structure");
const pre=prev.slice(0,cut).replace('const ID="central-lodge.cl50.t3-f1.preview.v001";','const ID="central-lodge.cl50.t3-f1.apply.v001";');
const apply=`
if(failures.length)return{operation:ID,status:"BLOCKED",noWrite:true,failures};
const sourceHash=await sha(spec.source);
if(sourceHash!=="c179ae83855e6eb136a1225bfbb882ab9c6b7bcd3f0773df3654f82b2b23d6cb")return{operation:ID,status:"BLOCKED",reason:"Frozen source hash mismatch"};
const initialFlags=foundry.utils.deepClone(flags),beforeLedger=JSON.stringify(ledger),madeIds=[];
const getGeometry=scene=>Array.from(scene.regions).map(r=>{const o=r.toObject();return{id:r.id,shapes:o.shapes??null,elevation:o.elevation??null,visibility:o.visibility??null,locked:o.locked??null}}).sort((a,b)=>a.id.localeCompare(b.id));
const canon=v=>JSON.stringify((function norm(value){return Array.isArray(value)?value.map(norm):value&&typeof value==="object"?Object.fromEntries(Object.keys(value).sort().map(k=>[k,norm(value[k])])):value})(v));
const t3Before=await sha(canon(getGeometry(T3))),f1Before=await sha(canon(getGeometry(F1)));
if(t3Before!=="e372066d468469936ce90a6065a567c0dff0d8fff6d5a48fb07404e1e0ceeead"||f1Before!=="6aa46295e7c4ba743246763116772ab67051de2ad7e9444012413922ffe714b5")
return{operation:ID,status:"BLOCKED",reason:"Scene geometry drift"};
if(!game.user?.isGM||game.user.id!=="pnTxw7VYpYR4IKWE"||T3.tokens.size!==0)return{operation:ID,status:"BLOCKED",reason:"Executor or live tokens"};
try{
 await src.update({"flags.world.dicebox.destinationStableSceneId":"dbx:central-lodge:f1","flags.world.dicebox.bindingStatus":"BOUND_CL50_T3_TO_F1"});
 const made=await src.createEmbeddedDocuments("RegionBehavior",[{
 name:"DiceBox CL-50 — Ancient Passage to F1 (GM Confirmed)",type:"executeScript",disabled:false,
 system:{events:["tokenEnter"],source:spec.source},
 flags:{world:{dicebox:{schemaVersion:"1.0.0",campaignId:"central-lodge",managed:true,installer:"central-lodge-cl50-t3-f1-apply-v001",sceneKey:"T3",stableId:spec.stableId,regionStableId:flags.stableId,sourceHash,routeAuthority:"F1 explicit t3-arrival region"}}}
 }]);
 if(made?.length!==1)throw new Error("Expected one RegionBehavior");
 madeIds.push(made[0].id);
 const verified=src.behaviors.get(made[0].id),flagAfter=src.getFlag("world","dicebox")??{};
 if(await sha(verified?.system?.source??"")!==sourceHash||flagAfter.destinationStableSceneId!=="dbx:central-lodge:f1"||flagAfter.bindingStatus!=="BOUND_CL50_T3_TO_F1")throw new Error("Post source/metadata mismatch");
 let n=0,b=0;for(const id of SCENES){const s=game.scenes.get(id);n+=s.regions.size;b+=Array.from(s.regions).reduce((sum,r)=>sum+r.behaviors.size,0);}
 if(n!==202||b!==114||src.behaviors.size!==1||dest.behaviors.size!==0)throw new Error("Post counts/target drift");
 if(await sha(canon(getGeometry(T3)))!==t3Before||await sha(canon(getGeometry(F1)))!==f1Before)throw new Error("Geometry changed");
 if(JSON.stringify(game.journal.get("xhlXv6CCH34HVga3")?.getFlag("world","dicebox")?.state??{})!==beforeLedger)throw new Error("Ledger changed");
 return{operation:ID,status:"PASS",noGameplayCanary:true,sourceRegionId:src.id,behaviorId:verified.id,sourceHash,metadataStatus:flagAfter.bindingStatus,destinationRegionId:dest.id,after:{regions:n,behaviors:b},independentFinalVerifyRequired:true};
}catch(e){
 const rollbackErrors=[];
 for(const id of madeIds.reverse())try{await src.deleteEmbeddedDocuments("RegionBehavior",[id])}catch(er){rollbackErrors.push("delete:"+id+":"+String(er))}
 try{await src.update({"flags.world.dicebox.destinationStableSceneId":initialFlags.destinationStableSceneId,"flags.world.dicebox.bindingStatus":initialFlags.bindingStatus})}catch(er){rollbackErrors.push("restore flags:"+String(er))}
 return{operation:ID,status:rollbackErrors.length?"OUTCOME_UNKNOWN_ROLLBACK_INCOMPLETE":"FAIL_ROLLBACK_COMPLETE",error:String(e),rollbackErrors};
}
`;
fs.writeFileSync("cl50-t3-f1-apply-v001.page.js",pre+"\n"+apply+"\n");
const verify=`const ID="central-lodge.cl50.t3-f1.final-verify.v001",ids=["0CSBwzcszPKyaB8u","5K1uASAARnX8aZhP","EDdktL7VUihbpKe9","UNySMm7YkyYfh41x","Zq8iXByDVhHRbA7w","sI4YVZZChgey1qNi","iqfCcDpEer4pwrJj","DLcheEi6e5OHOYmU","U8S5ZrTjaPIkTUIL","JZkxX6lUQe8Nc8xJ","LXTA8mx1rJ2L6e2J","MAbLfBqG7qIVVuLN","4pc5akMBieHU7GvV","pHQvDUDlyWZFuNrX","if9iWDRjSwI87EeX","PVf6Gbrv9HbB88uZ","La9krMOMBhAhDLi6","ImeIdHbYb6kZKAdt","ez9MSQ8QIO4cW6zo","aIKQmFiuXWipEdyb","HWitOe1wSid7MZ1y"];
const sha=async t=>Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256",new TextEncoder().encode(String(t??"")))),b=>b.toString(16).padStart(2,"0")).join("");
const canon=v=>JSON.stringify((function norm(x){return Array.isArray(x)?x.map(norm):x&&typeof x==="object"?Object.fromEntries(Object.keys(x).sort().map(k=>[k,norm(x[k])])):x})(v));
const geom=s=>Array.from(s.regions).map(r=>{const o=r.toObject();return{id:r.id,shapes:o.shapes??null,elevation:o.elevation??null,visibility:o.visibility??null,locked:o.locked??null}}).sort((a,b)=>a.id.localeCompare(b.id));
const T3=game.scenes.get("aIKQmFiuXWipEdyb"),F1=game.scenes.get("La9krMOMBhAhDLi6"),src=T3?.regions.get("Tkg7XpsF7X1P3ZVJ"),dest=F1?.regions.get("zKNU1R3JGIMMt017"),fail=[];
let regions=0,behaviors=0;for(const id of ids){const s=game.scenes.get(id);if(!s){fail.push("Scene missing "+id);continue;}regions+=s.regions.size;behaviors+=Array.from(s.regions).reduce((n,r)=>n+r.behaviors.size,0);}
if(regions!==202||behaviors!==114||ids.length!==21)fail.push("Baseline drift");
const matches=Array.from(src?.behaviors??[]).filter(b=>b.getFlag("world","dicebox")?.stableId==="dbx:central-lodge:t3:behavior:ancient-passage-to-f1"),b=matches[0];
if(matches.length!==1||src.behaviors.size!==1||dest?.behaviors.size!==0||b?.disabled!==false)fail.push("RegionBehavior roster drift");
if(await sha(b?.system?.source??"")!=="c179ae83855e6eb136a1225bfbb882ab9c6b7bcd3f0773df3654f82b2b23d6cb")fail.push("Source hash drift");
if(src.getFlag("world","dicebox")?.destinationStableSceneId!=="dbx:central-lodge:f1"||src.getFlag("world","dicebox")?.bindingStatus!=="BOUND_CL50_T3_TO_F1"||dest.getFlag("world","dicebox")?.stableId!=="dbx:central-lodge:f1:region:transition:t3-arrival")fail.push("Route metadata drift");
if(await sha(canon(geom(T3)))!=="e372066d468469936ce90a6065a567c0dff0d8fff6d5a48fb07404e1e0ceeead"||await sha(canon(geom(F1)))!=="6aa46295e7c4ba743246763116772ab67051de2ad7e9444012413922ffe714b5")fail.push("Geometry drift");
if((F1.getFlag("world","dicebox")?.transitions?.t3Arrival)!=="ENTRY_ANCHOR_CREATED_T3_BINDING_NOT_MUTATED_BY_THIS_BUILD")fail.push("F1 source authority changed");
const l=game.journal.get("xhlXv6CCH34HVga3")?.getFlag("world","dicebox")?.state??{},kernel=game.macros.get("FHQiFYx6OntZVo9d");
if(l.revision!==0||Object.keys(l.notices??{}).length||l.puzzles?.n3?.t3BranchUnlocked!==false||await sha(kernel?.command??"")!=="6264c467211d4f5c94cfaaa9437eae88582599061b9d8a4951391830a3e8f814")fail.push("Kernel/ledger drift");
return{operation:ID,status:fail.length?"FAIL":"PASS",noWrite:true,failures:fail,regions,behaviors,sourceRegionId:src.id,behaviorId:b?.id,sourceHash:await sha(b?.system?.source??""),destinationRegionId:dest.id,ledgerRevision:l.revision,noGameplayCanary:true};`;
fs.writeFileSync("cl50-t3-f1-final-verify-v001.page.js",verify);
console.log("GENERATED CL50 apply and separate verifier");
