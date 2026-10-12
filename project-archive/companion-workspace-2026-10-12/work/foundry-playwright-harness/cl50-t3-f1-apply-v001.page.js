const ID="central-lodge.cl50.t3-f1.apply.v001";
const SCENES=["0CSBwzcszPKyaB8u","5K1uASAARnX8aZhP","EDdktL7VUihbpKe9","UNySMm7YkyYfh41x","Zq8iXByDVhHRbA7w","sI4YVZZChgey1qNi","iqfCcDpEer4pwrJj","DLcheEi6e5OHOYmU","U8S5ZrTjaPIkTUIL","JZkxX6lUQe8Nc8xJ","LXTA8mx1rJ2L6e2J","MAbLfBqG7qIVVuLN","4pc5akMBieHU7GvV","pHQvDUDlyWZFuNrX","if9iWDRjSwI87EeX","PVf6Gbrv9HbB88uZ","La9krMOMBhAhDLi6","ImeIdHbYb6kZKAdt","ez9MSQ8QIO4cW6zo","aIKQmFiuXWipEdyb","HWitOe1wSid7MZ1y"];
const spec={"source":"// CL-50 approved T3 ancient passage → F1 arrival; single GM-authoritative confirmation, no auto-teleport.\nconst __primary = game.users.filter(u => u.active && u.isGM).sort((a,b) => a.id.localeCompare(b.id))[0];\nif (!__primary || !game.user?.isGM || game.user.id !== __primary.id) return;\nconst __token = event?.data?.token ?? event?.token ?? null;\nconst __actor = __token?.actor ?? null;\nconst __source = event?.region?.parent ?? game.scenes.get(\"aIKQmFiuXWipEdyb\");\nif (!__token || !__actor || __source?.id !== \"aIKQmFiuXWipEdyb\") return;\nconst __sourceRegion = __source.regions.get(\"Tkg7XpsF7X1P3ZVJ\");\nconst __destination = game.scenes.get(\"La9krMOMBhAhDLi6\")?.regions.get(\"zKNU1R3JGIMMt017\");\nif (__sourceRegion?.getFlag(\"world\",\"dicebox\")?.destinationStableSceneId !== \"dbx:central-lodge:f1\") return;\nif (!__destination || __destination.getFlag(\"world\",\"dicebox\")?.stableId !== \"dbx:central-lodge:f1:region:transition:t3-arrival\") return;\nconst __key = String(__actor.uuid ?? __token.id);\nconst __slots = globalThis.__diceboxCl50T3F1Transition ??= { pending:new Set(), declinedUntil:new Map() };\nif (__slots.pending.has(__key) || Date.now() < (__slots.declinedUntil.get(__key) ?? 0)) return;\n__slots.pending.add(__key);\ntry {\n  const __go = await foundry.applications.api.DialogV2.confirm({\n    window:{ title:\"Ancient Passage — GM Travel Confirmation\" },\n    content:\"<p>The abandoned railway has ended; the older passage continues beyond it.</p><p>Confirm the character intends to proceed into the <strong>Ancient Infernal Threshold (F1)</strong>. This is not an automatic forced move.</p>\",\n    yes:{label:\"Proceed to F1\"},no:{label:\"Remain in T3\"},modal:true,rejectClose:false\n  });\n  if (!__go) {\n    __slots.declinedUntil.set(__key,Date.now()+15000);\n    return;\n  }\n  const __updated = __source.regions.get(\"Tkg7XpsF7X1P3ZVJ\");\n  if (__updated?.getFlag(\"world\",\"dicebox\")?.destinationStableSceneId !== \"dbx:central-lodge:f1\") return;\n  const __nowTarget = game.scenes.get(\"La9krMOMBhAhDLi6\")?.regions.get(\"zKNU1R3JGIMMt017\");\n  if (!__nowTarget || __nowTarget.getFlag(\"world\",\"dicebox\")?.stableId !== \"dbx:central-lodge:f1:region:transition:t3-arrival\") return;\n  let __user = game.users.get(event?.user?.id) ?? null;\n  if (!__user || __user.isGM) {\n    __user = game.users.find(u => u.active && !u.isGM && u.character?.id === __actor.id) ?? null;\n  }\n  if (!__user) {\n    const __owners = game.users.filter(u => u.active && !u.isGM && __actor.testUserPermission(u,CONST.DOCUMENT_OWNERSHIP_LEVELS.OWNER));\n    if (__owners.length === 1) __user=__owners[0];\n  }\n  await __nowTarget.teleportToken(__token,{placement:\"random\",snap:false,pan:true});\n  if (__user) await __nowTarget.parent.pullUsers([__user.id]);\n} catch(__error) {\n  console.error(\"[DiceBox CL-50 T3→F1] Travel failed; GM can use normal Scene navigation.\",__error);\n  ui.notifications?.warn(\"Travel was not confirmed. Ask the GM to navigate manually if needed.\");\n} finally {\n  __slots.pending.delete(__key);\n}","stableId":"dbx:central-lodge:t3:behavior:ancient-passage-to-f1","regionId":"Tkg7XpsF7X1P3ZVJ","destinationId":"zKNU1R3JGIMMt017"};
const sha=async t=>Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256",new TextEncoder().encode(String(t??"")))),b=>b.toString(16).padStart(2,"0")).join("");
const failures=[],T3=game.scenes.get("aIKQmFiuXWipEdyb"),F1=game.scenes.get("La9krMOMBhAhDLi6"),src=T3?.regions.get(spec.regionId),dest=F1?.regions.get(spec.destinationId);
let regions=0,behaviors=0;for(const id of SCENES){const scene=game.scenes.get(id);if(!scene){failures.push("Missing "+id);continue;}regions+=scene.regions.size;behaviors+=Array.from(scene.regions).reduce((n,r)=>n+r.behaviors.size,0);}
if(regions!==202||behaviors!==113||SCENES.length!==21)failures.push("Baseline drift");
const ledger=game.journal.get("xhlXv6CCH34HVga3")?.getFlag("world","dicebox")?.state??{};
const kernel=game.macros.get("FHQiFYx6OntZVo9d");
if(ledger.revision!==0||Object.keys(ledger.notices??{}).length||await sha(kernel?.command??"")!=="6264c467211d4f5c94cfaaa9437eae88582599061b9d8a4951391830a3e8f814")failures.push("Ledger/kernel drift");
const flags=src?.getFlag("world","dicebox")??{},f1flags=F1?.getFlag("world","dicebox")??{};
if(!src||!dest||src.behaviors.size!==0||dest.behaviors.size!==0||flags.bindingStatus!=="UNBOUND_PENDING_FUTURE_SCENE"||flags.destinationStableSceneId!==null||dest.getFlag("world","dicebox")?.stableId!=="dbx:central-lodge:f1:region:transition:t3-arrival"||f1flags.transitions?.t3Arrival!=="ENTRY_ANCHOR_CREATED_T3_BINDING_NOT_MUTATED_BY_THIS_BUILD")failures.push("Exact destination authority or region roster mismatch");
const existing=SCENES.flatMap(id=>Array.from(game.scenes.get(id)?.regions??[])).flatMap(r=>Array.from(r.behaviors??[]));
if(existing.some(b=>b.getFlag("world","dicebox")?.stableId===spec.stableId))failures.push("Behavior stableId collision");
let syntax="PASS";try{new (Object.getPrototypeOf(async function(){}).constructor)("event",spec.source)}catch(e){syntax=String(e);failures.push(syntax)}
if(!spec.source.includes("__destination")||!spec.source.includes("DialogV2.confirm")||!spec.source.includes("teleportToken")||!spec.source.includes("declinedUntil")||!spec.source.includes("__primary.id"))failures.push("Unsafe source invariant");

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

