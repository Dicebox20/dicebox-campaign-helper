const APPLY_ID="central-lodge-cl17-u1-apply-v001";
const SCENE_ID="if9iWDRjSwI87EeX";
const LEDGER_ID="xhlXv6CCH34HVga3";
const KERNEL_ID="FHQiFYx6OntZVo9d";
const EXPECTED_KERNEL_HASH="6264c467211d4f5c94cfaaa9437eae88582599061b9d8a4951391830a3e8f814";
const EXPECTED_GEOMETRY_HASH="51c37b027918cb3623f5dc89966cd92e41efce44b28a2893e9a32ad8d04c2815";
const LODGE_SCENES=["0CSBwzcszPKyaB8u","5K1uASAARnX8aZhP","EDdktL7VUihbpKe9","UNySMm7YkyYfh41x","Zq8iXByDVhHRbA7w","sI4YVZZChgey1qNi","iqfCcDpEer4pwrJj","DLcheEi6e5OHOYmU","U8S5ZrTjaPIkTUIL","JZkxX6lUQe8Nc8xJ","LXTA8mx1rJ2L6e2J","MAbLfBqG7qIVVuLN","4pc5akMBieHU7GvV","pHQvDUDlyWZFuNrX","if9iWDRjSwI87EeX","PVf6Gbrv9HbB88uZ","La9krMOMBhAhDLi6","ImeIdHbYb6kZKAdt","ez9MSQ8QIO4cW6zo","aIKQmFiuXWipEdyb","HWitOe1wSid7MZ1y"];
const REGIONS={house:"VxHb5vakdakd4s8t",crown:"W5HLOhbQGxd0QykN",recordsNotice:"fgo4icYioZu3ekbr",guestNotice:"KEFEScgW7Yrureyv",records:"V1JRfiR56dgVGRa3",lightCorridor:"6yT5660qN4dVJ4Fa",lightFamily:"8Og9F4LZoOXXewI5",stair:"CN7RgLIuaVpgHFUI",west:"LvQ6X54sZgtIvpQW",east:"PsFcL2Leau8GV8zb"};
const clone=v=>foundry.utils.deepClone(v);
const dbx=d=>{try{return clone(d?.getFlag?.("world","dicebox")??{});}catch{return{};}};
const stableIdOf=d=>dbx(d)?.stableId??null;
const normalize=v=>Array.isArray(v)?v.map(normalize):v&&typeof v==="object"?Object.fromEntries(Object.keys(v).sort().map(k=>[k,normalize(v[k])])):v;
const canonical=v=>JSON.stringify(normalize(v));
const sha256=async v=>Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256",new TextEncoder().encode(String(v??"")))),b=>b.toString(16).padStart(2,"0")).join("");
const geom=scene=>Array.from(scene.regions??[]).map(r=>{const s=r.toObject();return{id:r.id,shapes:s.shapes??null,elevation:s.elevation??null,visibility:s.visibility??null,locked:s.locked??null};}).sort((a,b)=>a.id.localeCompare(b.id));
const dispatcher=req=>[
'const k = game.macros.find(m => m.getFlag?.("world","dicebox")?.stableId === "dbx:central-lodge:macro:runtime");',
'if (!k) { console.error("[Central Lodge U1] Runtime Kernel missing."); return; }',
'const t = event?.data?.token ?? event?.token ?? null;',
'const a = t?.actor ?? null;',
'return await k.execute({actor:a,token:t,event,speaker:{dicebox:'+JSON.stringify(req)+'}});'
].join("\n");
const specs=[
 {key:"family-records-notice",regionId:REGIONS.recordsNotice,name:"DiceBox U1 — Family Records Notice",stableId:"dbx:central-lodge:u1:behavior:family-records-notice",expectedHash:"8d2bde8d3871c9689a19c80f948b8ea11b428609c7e984dc2664fa61c78f2553",request:{contract:"dicebox-discovery/v1",action:"notice",trigger:"TOKEN_ENTER",noticeKey:"u1.family-records",dc:6,stage2Skill:"Investigation",successMessage:"<p>The family records are not simply disordered by age. A gap in the sequence and an unusual grouping of names stand out from the surrounding entries, suggesting that part of the household history was organized or omitted deliberately.</p>",followUp:"Suggested follow-up: Investigation.",failure:"silent",oncePerCharacter:true,autoAwardItem:false,criticalClueFallback:"Deliberate examination of the family records remains possible."}},
 {key:"guest-room-absence-notice",regionId:REGIONS.guestNotice,name:"DiceBox U1 — Guest Room Absence Notice",stableId:"dbx:central-lodge:u1:behavior:guest-room-absence-notice",expectedHash:"6d435d45853afcaadd815da66732baaa62ffd6c96a3267b4776208e147697153",request:{contract:"dicebox-discovery/v1",action:"notice",trigger:"TOKEN_ENTER",noticeKey:"u1.guest-room-absence",dc:6,stage2Skill:"Investigation",successMessage:"<p>One guest room contradicts itself. It is furnished for regular occupation, but the wear, dust, and personal traces expected from a long-term occupant are missing. The absence feels deliberate rather than merely abandoned.</p>",followUp:"Suggested follow-up: Investigation or Perception.",failure:"silent",oncePerCharacter:true,autoAwardItem:false,criticalClueFallback:"Deliberate examination of the room's physical contradictions remains possible."}},
 {key:"house-proof-recovery",regionId:REGIONS.house,name:"DiceBox U1 — House Proof Recovery",stableId:"dbx:central-lodge:u1:behavior:house-proof-recovery",expectedHash:"23862e0410c80b69cf1b802dbbe5eef6b73ab62b912977c93e19ecbdabb935f0",request:{contract:"dicebox-region-behavior/v1",action:"pickup",trigger:"TOKEN_ENTER",itemKey:"house-proof",statePath:"items.house-proof.recovered",value:true,message:"<p>You recover the <strong>House Proof</strong> from the family wing.</p>",persistentPickup:true}},
 {key:"crown-crest-recovery",regionId:REGIONS.crown,name:"DiceBox U1 — Crown Crest Recovery",stableId:"dbx:central-lodge:u1:behavior:crown-crest-recovery",expectedHash:"426ef4663c90c03686f8b5b2b84398ba2e9e143974dbcd03b35aeb15e56cc3c0",request:{contract:"dicebox-region-behavior/v1",action:"pickup",trigger:"TOKEN_ENTER",itemKey:"crown-crest",statePath:"items.crown-crest.recovered",value:true,message:"<p>You recover the <strong>Crown Crest</strong> from the family room.</p>",persistentPickup:true}},
 {key:"family-records-observation",regionId:REGIONS.records,name:"DiceBox U1 — Family Records Interpretation",stableId:"dbx:central-lodge:u1:behavior:family-records-interpretation",expectedHash:"6ed84ac9a24b5fe4db0c513b819e3409fbaf0dff637c4502d878cdd7da51fae3",request:{contract:"dicebox-region-behavior/v1",action:"observe",trigger:"TOKEN_ENTER",observationKey:"u1.family-records-interpretation",oncePerActor:true,statePath:"puzzles.u1.familyRecordsInterpreted",value:true,message:"<p>Cross-referencing the surviving records establishes a family chronology that connects household generations, the Lodge's genealogy, and the graves outside. It gives context for interpreting the grandfather clock and family memorials, but it does not by itself reveal the clock's exact setting.</p>"}}
];
const blockers=[];
if(!game.user?.isGM)blockers.push("Current user not GM.");
if(!["Gamemaster","Assistant Gamemaster"].includes(game.user?.name))blockers.push("Unauthorized DiceBox project executor.");
const scene=game.scenes.get(SCENE_ID),ledger=game.journal.get(LEDGER_ID),kernel=game.macros.get(KERNEL_ID);
if(!scene)blockers.push("U1 missing.");if(!ledger)blockers.push("Ledger missing.");if(!kernel)blockers.push("Kernel missing.");
const kernelHash=kernel?await sha256(kernel.command??""):null;if(kernelHash!==EXPECTED_KERNEL_HASH)blockers.push("Kernel hash drift.");
let regions=0,behaviors=0;
for(const id of LODGE_SCENES){const s=game.scenes.get(id);if(!s){blockers.push("Missing Scene "+id);continue;}const rs=Array.from(s.regions??[]);regions+=rs.length;behaviors+=rs.reduce((n,r)=>n+Array.from(r.behaviors??[]).length,0);}
if(regions!==202)blockers.push(`Regions ${regions}; expected 202.`);if(behaviors!==55)blockers.push(`Behaviors ${behaviors}; expected 55.`);
const u1Before=scene?Array.from(scene.regions??[]).reduce((n,r)=>n+Array.from(r.behaviors??[]).length,0):null;if(scene?.regions?.size!==10||u1Before!==0)blockers.push(`U1 baseline ${scene?.regions?.size}/${u1Before}; expected 10/0.`);
const geometryBefore=scene?await sha256(canonical(geom(scene))):null;if(geometryBefore!==EXPECTED_GEOMETRY_HASH)blockers.push("U1 geometry drift.");
const stateBefore=clone(ledger?.getFlag("world","dicebox")?.state??{});if(Number(stateBefore?.revision)!==0||Object.keys(stateBefore?.notices??{}).length!==0)blockers.push("Ledger baseline drift.");
const all=LODGE_SCENES.map(id=>game.scenes.get(id)).filter(Boolean).flatMap(s=>Array.from(s.regions??[])).flatMap(r=>Array.from(r.behaviors??[]));
const payloads=[];
for(const spec of specs){const r=scene?.regions.get(spec.regionId);if(!r){blockers.push(spec.key+": Region missing.");continue;}if(r.behaviors.size!==0)blockers.push(spec.key+": Region already has behaviors.");if(all.some(b=>stableIdOf(b)===spec.stableId))blockers.push(spec.key+": stable-ID collision.");const source=dispatcher(spec.request),h=await sha256(source);if(h!==spec.expectedHash)blockers.push(spec.key+": hash mismatch.");payloads.push({spec,region:r,source,hash:h,regionStableId:stableIdOf(r)});}
for(const id of [REGIONS.lightCorridor,REGIONS.lightFamily,REGIONS.stair,REGIONS.west,REGIONS.east]){const r=scene?.regions.get(id);if(!r)blockers.push("Deferred Region missing "+id);else if(r.behaviors.size!==0)blockers.push(r.name+" unexpectedly has behavior(s).");}
if(blockers.length)return{operation:"central-lodge.cl17.u1.apply",applyId:APPLY_ID,status:"BLOCKED",noWrite:true,blockers};
const created=[];
try{
 for(const p of payloads){
  const behaviorSpec={...clone(p.spec.request),sourceType:"kernel"};if(p.spec.request.action==="pickup")behaviorSpec.rewardItemKey=p.spec.request.itemKey;
  const doc={name:p.spec.name,type:"executeScript",disabled:false,system:{events:["tokenEnter"],source:p.source},flags:{world:{dicebox:{schemaVersion:"1.0.0",campaignId:"central-lodge",managed:true,installer:APPLY_ID,stableId:p.spec.stableId,sceneKey:"U1",regionStableId:p.regionStableId,sourceHash:p.hash,behaviorSpec}}}};
  const made=await p.region.createEmbeddedDocuments("RegionBehavior",[doc]);if(!made?.length||made.length!==1)throw new Error(p.spec.key+": expected one behavior.");created.push({regionId:p.region.id,behaviorId:made[0].id,key:p.spec.key});
 }
 const reread=game.scenes.get(SCENE_ID);let postRegions=0,postBehaviors=0;for(const id of LODGE_SCENES){const s=game.scenes.get(id),rs=Array.from(s.regions??[]);postRegions+=rs.length;postBehaviors+=rs.reduce((n,r)=>n+Array.from(r.behaviors??[]).length,0);}
 const postU1=Array.from(reread.regions??[]).reduce((n,r)=>n+Array.from(r.behaviors??[]).length,0);if(postRegions!==202||postBehaviors!==60||postU1!==5)throw new Error(`Post counts ${postRegions}/${postBehaviors}; U1 ${postU1}.`);
 const geomAfter=await sha256(canonical(geom(reread)));if(geomAfter!==EXPECTED_GEOMETRY_HASH)throw new Error("Geometry changed.");
 const kernelAfter=await sha256(game.macros.get(KERNEL_ID)?.command??"");if(kernelAfter!==EXPECTED_KERNEL_HASH)throw new Error("Kernel changed.");
 const stateAfter=clone(game.journal.get(LEDGER_ID)?.getFlag("world","dicebox")?.state??{});if(canonical(stateAfter)!==canonical(stateBefore))throw new Error("Ledger changed during install.");
 const rows=[];for(const spec of specs){const r=reread.regions.get(spec.regionId),m=Array.from(r.behaviors??[]).filter(b=>stableIdOf(b)===spec.stableId);if(m.length!==1)throw new Error(spec.key+": installed count "+m.length);const b=m[0],h=await sha256(b.system?.source??"");if(h!==spec.expectedHash)throw new Error(spec.key+": source hash mismatch.");if(dbx(b)?.regionStableId!==stableIdOf(r))throw new Error(spec.key+": regionStableId mismatch.");rows.push({key:spec.key,id:b.id,stableId:spec.stableId,sourceHash:h,regionId:r.id,regionStableId:stableIdOf(r)});}
 const deferred=[REGIONS.lightCorridor,REGIONS.lightFamily,REGIONS.stair,REGIONS.west,REGIONS.east].map(id=>{const r=reread.regions.get(id);return{id,name:r?.name??null,behaviors:r?.behaviors?.size??null};});if(deferred.some(x=>x.behaviors!==0))throw new Error("Deferred U1 Region gained behavior.");
 return{operation:"central-lodge.cl17.u1.apply",applyId:APPLY_ID,status:"PASS",createdBehaviorCount:created.length,baseline:{regions:postRegions,behaviors:postBehaviors,u1Regions:reread.regions.size,u1Behaviors:postU1},behaviors:rows,deferred,preservation:{geometryHash:geomAfter,kernelHash:kernelAfter,ledgerRevision:stateAfter?.revision??null,notices:stateAfter?.notices??null},phaseDisposition:"CL-17 U1 GAMEPLAY INSTALLED / LIGHTING & TRANSITIONS DEFERRED",nextGate:"CL-17 U1 FINAL VERIFY"};
}catch(error){const rollbackErrors=[];for(const c of [...created].reverse()){try{const r=game.scenes.get(SCENE_ID)?.regions.get(c.regionId);if(r?.behaviors.has(c.behaviorId))await r.deleteEmbeddedDocuments("RegionBehavior",[c.behaviorId]);}catch(e){rollbackErrors.push(c.key+":"+e.message);}}return{operation:"central-lodge.cl17.u1.apply",applyId:APPLY_ID,status:rollbackErrors.length?"OUTCOME_UNKNOWN_ROLLBACK_INCOMPLETE":"FAIL_ROLLBACK_COMPLETE",error:error?.message??String(error),rollbackErrors};}