const PREVIEW_ID="central-lodge-cl17-u1-preview-v001";
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
 {key:"family-records-notice",regionId:REGIONS.recordsNotice,name:"DiceBox U1 — Family Records Notice",stableId:"dbx:central-lodge:u1:behavior:family-records-notice",request:{contract:"dicebox-discovery/v1",action:"notice",trigger:"TOKEN_ENTER",noticeKey:"u1.family-records",dc:6,stage2Skill:"Investigation",successMessage:"<p>The family records are not simply disordered by age. A gap in the sequence and an unusual grouping of names stand out from the surrounding entries, suggesting that part of the household history was organized or omitted deliberately.</p>",followUp:"Suggested follow-up: Investigation.",failure:"silent",oncePerCharacter:true,autoAwardItem:false,criticalClueFallback:"Deliberate examination of the family records remains possible."}},
 {key:"guest-room-absence-notice",regionId:REGIONS.guestNotice,name:"DiceBox U1 — Guest Room Absence Notice",stableId:"dbx:central-lodge:u1:behavior:guest-room-absence-notice",request:{contract:"dicebox-discovery/v1",action:"notice",trigger:"TOKEN_ENTER",noticeKey:"u1.guest-room-absence",dc:6,stage2Skill:"Investigation",successMessage:"<p>One guest room contradicts itself. It is furnished for regular occupation, but the wear, dust, and personal traces expected from a long-term occupant are missing. The absence feels deliberate rather than merely abandoned.</p>",followUp:"Suggested follow-up: Investigation or Perception.",failure:"silent",oncePerCharacter:true,autoAwardItem:false,criticalClueFallback:"Deliberate examination of the room's physical contradictions remains possible."}},
 {key:"house-proof-recovery",regionId:REGIONS.house,name:"DiceBox U1 — House Proof Recovery",stableId:"dbx:central-lodge:u1:behavior:house-proof-recovery",request:{contract:"dicebox-region-behavior/v1",action:"pickup",trigger:"TOKEN_ENTER",itemKey:"house-proof",statePath:"items.house-proof.recovered",value:true,message:"<p>You recover the <strong>House Proof</strong> from the family wing.</p>",persistentPickup:true}},
 {key:"crown-crest-recovery",regionId:REGIONS.crown,name:"DiceBox U1 — Crown Crest Recovery",stableId:"dbx:central-lodge:u1:behavior:crown-crest-recovery",request:{contract:"dicebox-region-behavior/v1",action:"pickup",trigger:"TOKEN_ENTER",itemKey:"crown-crest",statePath:"items.crown-crest.recovered",value:true,message:"<p>You recover the <strong>Crown Crest</strong> from the family room.</p>",persistentPickup:true}},
 {key:"family-records-observation",regionId:REGIONS.records,name:"DiceBox U1 — Family Records Interpretation",stableId:"dbx:central-lodge:u1:behavior:family-records-interpretation",request:{contract:"dicebox-region-behavior/v1",action:"observe",trigger:"TOKEN_ENTER",observationKey:"u1.family-records-interpretation",oncePerActor:true,statePath:"puzzles.u1.familyRecordsInterpreted",value:true,message:"<p>Cross-referencing the surviving records establishes a family chronology that connects household generations, the Lodge's genealogy, and the graves outside. It gives context for interpreting the grandfather clock and family memorials, but it does not by itself reveal the clock's exact setting.</p>"}}
];
const failures=[],warnings=[];
const scene=game.scenes.get(SCENE_ID),ledger=game.journal.get(LEDGER_ID),kernel=game.macros.get(KERNEL_ID);
if(!scene)failures.push("U1 Scene missing.");if(!ledger)failures.push("Ledger missing.");if(!kernel)failures.push("Kernel missing.");
const kernelHash=kernel?await sha256(kernel.command??""):null;if(kernelHash!==EXPECTED_KERNEL_HASH)failures.push("Kernel hash drift.");
let regions=0,behaviors=0;
for(const id of LODGE_SCENES){const s=game.scenes.get(id);if(!s){failures.push("Missing Scene "+id);continue;}const rs=Array.from(s.regions??[]);regions+=rs.length;behaviors+=rs.reduce((n,r)=>n+Array.from(r.behaviors??[]).length,0);}
if(regions!==202)failures.push(`Regions ${regions}; expected 202.`);if(behaviors!==55)failures.push(`Behaviors ${behaviors}; expected 55.`);
const u1Count=scene?Array.from(scene.regions??[]).reduce((n,r)=>n+Array.from(r.behaviors??[]).length,0):null;if(scene?.regions?.size!==10||u1Count!==0)failures.push(`U1 baseline ${scene?.regions?.size}/${u1Count}; expected 10/0.`);
const geometryHash=scene?await sha256(canonical(geom(scene))):null;if(geometryHash!==EXPECTED_GEOMETRY_HASH)failures.push("U1 geometry hash drift.");
for(const spec of specs){const r=scene?.regions.get(spec.regionId);if(!r)failures.push(spec.key+": Region missing.");else if(r.behaviors.size!==0)failures.push(spec.key+": target Region already has behaviors.");}
for(const id of [REGIONS.lightCorridor,REGIONS.lightFamily,REGIONS.stair,REGIONS.west,REGIONS.east]){const r=scene?.regions.get(id);if(!r)failures.push("Deferred Region missing "+id);else if(r.behaviors.size!==0)failures.push(r.name+" unexpectedly has behaviors.");}
const all=LODGE_SCENES.map(id=>game.scenes.get(id)).filter(Boolean).flatMap(s=>Array.from(s.regions??[])).flatMap(r=>Array.from(r.behaviors??[]));
for(const spec of specs)if(all.some(b=>stableIdOf(b)===spec.stableId))failures.push(spec.key+": stable-ID collision.");
for(const itemKey of ["house-proof","crown-crest"]){const m=game.items.filter(i=>stableIdOf(i)===`dbx:central-lodge:item:${itemKey}`);if(m.length!==1)failures.push(itemKey+": canonical Item count "+m.length);}
const state=clone(ledger?.getFlag("world","dicebox")?.state??{});
if(Number(state?.revision)!==0)failures.push("Ledger revision drift.");if(Object.keys(state?.notices??{}).length!==0)failures.push("Ledger notices not empty.");
for(const key of ["familyRecordsNoticeResolved","guestRoomAbsenceNoticeResolved","familyRecordsInterpreted"]){const v=foundry.utils.getProperty(state,`puzzles.u1.${key}`);if(v!==false)failures.push(`puzzles.u1.${key} is ${v}; expected false.`);}
const AsyncFunction=Object.getPrototypeOf(async function(){}).constructor;const rows=[];
for(const spec of specs){const source=dispatcher(spec.request);let syntax="PASS";try{new AsyncFunction("event",source);}catch(e){syntax="FAIL";failures.push(spec.key+": syntax "+e.message);}rows.push({key:spec.key,regionId:spec.regionId,region:scene?.regions.get(spec.regionId)?.name??null,regionStableId:stableIdOf(scene?.regions.get(spec.regionId)),stableId:spec.stableId,action:spec.request.action,noticeKey:spec.request.noticeKey??null,observationKey:spec.request.observationKey??null,itemKey:spec.request.itemKey??null,statePath:spec.request.statePath??null,dc:spec.request.dc??null,stage2Skill:spec.request.stage2Skill??null,sourceHash:await sha256(source),syntax});}
return{operation:"central-lodge.cl17.u1.preview",previewId:PREVIEW_ID,status:failures.length?"BLOCKED":"PASS",noWrite:true,failures,warnings,
 baseline:{scenes:LODGE_SCENES.length,regions,behaviors,u1Regions:scene?.regions?.size??null,u1Behaviors:u1Count,kernelHash,geometryHash,ledgerRevision:state?.revision??null},
 plannedBehaviors:rows,
 authoringNotes:[
  "Family Records Notice DC 6 Investigation is NEW authoring; PREPARE preserves anomaly semantics but no exact DC or literal record text.",
  "Guest Room Absence Notice DC 6 Investigation is NEW authoring; PREPARE preserves absence-contradiction semantics but no exact DC.",
  "House Proof and Crown Crest are direct recoveries from their dedicated U1 Regions.",
  "Family Records interpretation sets only the supported chronology/context state and explicitly does not invent M1's exact clock setting.",
  "U1 lights remain deferred to CL-51 and transitions to CL-50."
 ],
 expectedAfterApply:{regions:202,behaviors:60,u1Regions:10,u1Behaviors:5,lightBehaviors:0,transitionBehaviors:0,phaseDisposition:"CL-17 U1 GAMEPLAY INSTALLED / LIGHTING & TRANSITIONS DEFERRED"},
 nextGate:failures.length?"STOP":"CL-17 U1 APPLY v001"};