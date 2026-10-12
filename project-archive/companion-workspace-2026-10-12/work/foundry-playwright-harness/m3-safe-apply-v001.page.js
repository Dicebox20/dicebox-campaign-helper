const APPLY_ID="central-lodge-cl16-m3-safe-apply-v001";
const SCENE_ID="LXTA8mx1rJ2L6e2J";
const LEDGER_ID="xhlXv6CCH34HVga3";
const KERNEL_ID="FHQiFYx6OntZVo9d";
const EXPECTED_KERNEL_HASH="6264c467211d4f5c94cfaaa9437eae88582599061b9d8a4951391830a3e8f814";
const EXPECTED_GEOMETRY_HASH="8473a9fe2a2298839cd87f4e1ea5ba7a6f260562fe76421c711772901febf77a";
const LODGE_SCENES=["0CSBwzcszPKyaB8u","5K1uASAARnX8aZhP","EDdktL7VUihbpKe9","UNySMm7YkyYfh41x","Zq8iXByDVhHRbA7w","sI4YVZZChgey1qNi","iqfCcDpEer4pwrJj","DLcheEi6e5OHOYmU","U8S5ZrTjaPIkTUIL","JZkxX6lUQe8Nc8xJ","LXTA8mx1rJ2L6e2J","MAbLfBqG7qIVVuLN","4pc5akMBieHU7GvV","pHQvDUDlyWZFuNrX","if9iWDRjSwI87EeX","PVf6Gbrv9HbB88uZ","La9krMOMBhAhDLi6","ImeIdHbYb6kZKAdt","ez9MSQ8QIO4cW6zo","aIKQmFiuXWipEdyb","HWitOe1wSid7MZ1y"];
const REGIONS={board:"T1KuiXb5o8mjTS2w",pull:"E7xtQDQRNA4AtY1i",crest:"IkmwmsbHadINctLc",notice:"we3V3jbMDvVDaO4U",recent:"bgvESHTFewT9ZV8x",route:"wd7S4Exyz2WQYLUY",lightCorridor:"BsM7Jxecq3ayjYKn",lightKitchen:"OQupzv9slrPmj1GM",transitionService:"THTJHTfaBGTGqaiZ",transitionMain:"1uOskLbiMaYJkFmZ"};
const clone=v=>foundry.utils.deepClone(v);
const dbx=d=>{try{return clone(d?.getFlag?.("world","dicebox")??{});}catch{return{};}};
const stableIdOf=d=>dbx(d)?.stableId??null;
const normalize=v=>Array.isArray(v)?v.map(normalize):v&&typeof v==="object"?Object.fromEntries(Object.keys(v).sort().map(k=>[k,normalize(v[k])])):v;
const canonical=v=>JSON.stringify(normalize(v));
const sha256=async v=>Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256",new TextEncoder().encode(String(v??"")))),b=>b.toString(16).padStart(2,"0")).join("");
const geom=scene=>Array.from(scene.regions??[]).map(r=>{const s=r.toObject();return{id:r.id,shapes:s.shapes??null,elevation:s.elevation??null,visibility:s.visibility??null,locked:s.locked??null};}).sort((a,b)=>a.id.localeCompare(b.id));
const dispatcher=req=>[
'const k = game.macros.find(m => m.getFlag?.("world","dicebox")?.stableId === "dbx:central-lodge:macro:runtime");',
'if (!k) { console.error("[Central Lodge M3] Runtime Kernel missing."); return; }',
'const t = event?.data?.token ?? event?.token ?? null;',
'const a = t?.actor ?? null;',
'return await k.execute({actor:a,token:t,event,speaker:{dicebox:'+JSON.stringify(req)+'}});'
].join("\n");
const gatedPickup=(req,path)=>[
'const l = game.journal.get("xhlXv6CCH34HVga3");',
'const s = l?.getFlag?.("world","dicebox")?.state ?? {};',
'if (foundry.utils.getProperty(s,'+JSON.stringify(path)+') !== true) return;',
...dispatcher(req).split("\n")
].join("\n");
const specs=[
 {key:"bell-board-notice",regionId:REGIONS.notice,name:"DiceBox M3 — Bell Board Notice",stableId:"dbx:central-lodge:m3:behavior:bell-board-notice",sourceType:"kernel",expectedHash:"3391a7e83728bc0c71dbca6ab6b2aeffa721895f978f5d11123dd077bf29e909",request:{contract:"dicebox-discovery/v1",action:"notice",trigger:"TOKEN_ENTER",noticeKey:"m3.bell-board",dc:6,stage2Skill:"Investigation",successMessage:"<p>The servant bell board is incomplete. One line ends at an empty fitting where a pull should attach, and the surrounding mechanism appears designed to respond when that line is restored.</p>",followUp:"Suggested follow-up: Investigation.",failure:"silent",oncePerCharacter:true,autoAwardItem:false,criticalClueFallback:"Deliberate inspection of the bell board reveals the missing pull-and-fixture relationship."}},
 {key:"servant-bell-pull-install",regionId:REGIONS.pull,name:"DiceBox M3 — Servant Bell Pull Installation",stableId:"dbx:central-lodge:m3:behavior:servant-bell-pull-install",sourceType:"kernel",expectedHash:"c380953514c5b018c8dc7b14ff6f347c273c6d800b5c47e5e29bc57c0df1bdf4",request:{contract:"dicebox-region-behavior/v1",action:"socket",trigger:"TOKEN_ENTER",itemKey:"servant-bell-pull",statePath:"puzzles.m3.servantBellPullInstalled",consume:false,missingMessage:"<p>The empty fitting beside the servant bell board is missing its pull.</p>",successMessage:"<p>The <strong>Servant Bell Pull</strong> fits the weathered bracket. The restored line takes tension, and the bell board mechanism can now respond.</p>"}},
 {key:"recent-use-notice",regionId:REGIONS.recent,name:"DiceBox M3 — Recent Use Notice",stableId:"dbx:central-lodge:m3:behavior:recent-use-notice",sourceType:"kernel",expectedHash:"fab86fa328f38f63327609ffb5b47fe1d844870dbb3c4ca62d984f26b6bee435",request:{contract:"dicebox-discovery/v1",action:"notice",trigger:"TOKEN_ENTER",noticeKey:"m3.recent-use",dc:6,stage2Skill:"Perception",successMessage:"<p>The kitchen's neglect is uneven. Dust has been disturbed around a service surface, and a few practical objects were moved recently enough to stand out from the surrounding decay. Someone has used this wing more recently than the rest of the Lodge suggests.</p>",followUp:"Suggested follow-up: Perception or Investigation.",failure:"silent",oncePerCharacter:true,autoAwardItem:false,criticalClueFallback:"Deliberate inspection of the recently disturbed service area remains possible."}},
 {key:"bell-crest-recovery",regionId:REGIONS.crest,name:"DiceBox M3 — Bell Crest Recovery",stableId:"dbx:central-lodge:m3:behavior:bell-crest-recovery",sourceType:"state-gate",requiredStatePath:"puzzles.m3.bellBoardResolved",expectedHash:"8e037130223044b6f418b3134283545b37bfdf69c526313b25a846758bf1dd45",request:{contract:"dicebox-region-behavior/v1",action:"pickup",trigger:"TOKEN_ENTER",itemKey:"bell-crest",statePath:"items.bell-crest.recovered",value:true,message:"<p>The resolved bell-board mechanism has exposed a hidden recess containing the <strong>Bell Crest</strong>.</p>",persistentPickup:true}}
];
const blockers=[];
if(!game.user?.isGM) blockers.push("Current user is not GM.");
if(!["Gamemaster","Assistant Gamemaster"].includes(game.user?.name)) blockers.push("Current GM is not an authorized DiceBox project executor.");
const scene=game.scenes.get(SCENE_ID),ledger=game.journal.get(LEDGER_ID),kernel=game.macros.get(KERNEL_ID);
if(!scene) blockers.push("M3 Scene missing.");if(!ledger) blockers.push("Ledger missing.");if(!kernel) blockers.push("Kernel missing.");
const kernelHash=kernel?await sha256(kernel.command??""):null;if(kernelHash!==EXPECTED_KERNEL_HASH) blockers.push("Kernel hash drift.");
let regions=0,behaviors=0;
for(const id of LODGE_SCENES){const s=game.scenes.get(id);if(!s){blockers.push("Missing Scene "+id);continue;}const rs=Array.from(s.regions??[]);regions+=rs.length;behaviors+=rs.reduce((n,r)=>n+Array.from(r.behaviors??[]).length,0);}
if(regions!==202) blockers.push(`Regions ${regions}; expected 202.`);if(behaviors!==51) blockers.push(`Behaviors ${behaviors}; expected 51.`);
const m3Before=scene?Array.from(scene.regions??[]).reduce((n,r)=>n+Array.from(r.behaviors??[]).length,0):null;if(scene?.regions?.size!==10||m3Before!==0) blockers.push(`M3 baseline ${scene?.regions?.size}/${m3Before}; expected 10/0.`);
const geometryBefore=scene?await sha256(canonical(geom(scene))):null;if(geometryBefore!==EXPECTED_GEOMETRY_HASH) blockers.push("M3 geometry drift.");
const stateBefore=clone(ledger?.getFlag("world","dicebox")?.state??{});if(Number(stateBefore?.revision)!==0||Object.keys(stateBefore?.notices??{}).length!==0) blockers.push("Ledger baseline drift.");
const existing=LODGE_SCENES.map(id=>game.scenes.get(id)).filter(Boolean).flatMap(s=>Array.from(s.regions??[])).flatMap(r=>Array.from(r.behaviors??[]));
const payloads=[];
for(const spec of specs){
 const region=scene?.regions.get(spec.regionId);if(!region){blockers.push(spec.key+": Region missing.");continue;}if(region.behaviors.size!==0) blockers.push(spec.key+": Region already has behavior(s).");
 if(existing.some(b=>stableIdOf(b)===spec.stableId)) blockers.push(spec.key+": stable-ID collision.");
 const source=spec.sourceType==="state-gate"?gatedPickup(spec.request,spec.requiredStatePath):dispatcher(spec.request);
 const hash=await sha256(source);if(hash!==spec.expectedHash) blockers.push(spec.key+": source hash mismatch.");
 payloads.push({spec,region,source,hash,regionStableId:stableIdOf(region)});
}
for(const id of [REGIONS.board,REGIONS.route,REGIONS.lightCorridor,REGIONS.lightKitchen,REGIONS.transitionService,REGIONS.transitionMain]){const r=scene?.regions.get(id);if(!r) blockers.push("Deferred Region missing "+id);else if(r.behaviors.size!==0) blockers.push(r.name+" unexpectedly has behaviors.");}
if(blockers.length)return{operation:"central-lodge.cl16.m3.safe-apply",applyId:APPLY_ID,status:"BLOCKED",noWrite:true,blockers};
const created=[];
try{
 for(const p of payloads){
  const behaviorSpec={...clone(p.spec.request),sourceType:p.spec.sourceType};
  if(p.spec.requiredStatePath)behaviorSpec.requiredStatePath=p.spec.requiredStatePath;
  if(p.spec.request.action==="pickup")behaviorSpec.rewardItemKey=p.spec.request.itemKey;
  const doc={name:p.spec.name,type:"executeScript",disabled:false,system:{events:["tokenEnter"],source:p.source},flags:{world:{dicebox:{schemaVersion:"1.0.0",campaignId:"central-lodge",managed:true,installer:APPLY_ID,stableId:p.spec.stableId,sceneKey:"M3",regionStableId:p.regionStableId,sourceHash:p.hash,behaviorSpec}}}};
  const made=await p.region.createEmbeddedDocuments("RegionBehavior",[doc]);if(!made?.length||made.length!==1)throw new Error(p.spec.key+": expected one behavior.");
  created.push({regionId:p.region.id,behaviorId:made[0].id,key:p.spec.key});
 }
 const reread=game.scenes.get(SCENE_ID);let postRegions=0,postBehaviors=0;
 for(const id of LODGE_SCENES){const s=game.scenes.get(id),rs=Array.from(s.regions??[]);postRegions+=rs.length;postBehaviors+=rs.reduce((n,r)=>n+Array.from(r.behaviors??[]).length,0);}
 const postM3=Array.from(reread.regions??[]).reduce((n,r)=>n+Array.from(r.behaviors??[]).length,0);
 if(postRegions!==202||postBehaviors!==55||postM3!==4)throw new Error(`Post counts ${postRegions}/${postBehaviors}; M3 ${postM3}.`);
 const geomAfter=await sha256(canonical(geom(reread)));if(geomAfter!==EXPECTED_GEOMETRY_HASH)throw new Error("Geometry changed.");
 const kernelAfter=await sha256(game.macros.get(KERNEL_ID)?.command??"");if(kernelAfter!==EXPECTED_KERNEL_HASH)throw new Error("Kernel changed.");
 const stateAfter=clone(game.journal.get(LEDGER_ID)?.getFlag("world","dicebox")?.state??{});if(canonical(stateAfter)!==canonical(stateBefore))throw new Error("Ledger changed during install.");
 const rows=[];
 for(const spec of specs){const r=reread.regions.get(spec.regionId),m=Array.from(r.behaviors??[]).filter(b=>stableIdOf(b)===spec.stableId);if(m.length!==1)throw new Error(spec.key+": installed count "+m.length);const b=m[0],h=await sha256(b.system?.source??"");if(h!==spec.expectedHash)throw new Error(spec.key+": hash mismatch.");if(dbx(b)?.regionStableId!==stableIdOf(r))throw new Error(spec.key+": regionStableId mismatch.");rows.push({key:spec.key,id:b.id,stableId:spec.stableId,sourceHash:h,regionId:r.id,regionStableId:stableIdOf(r)});}
 const deferred=[REGIONS.board,REGIONS.route,REGIONS.lightCorridor,REGIONS.lightKitchen,REGIONS.transitionService,REGIONS.transitionMain].map(id=>{const r=reread.regions.get(id);return{id,name:r?.name??null,behaviors:r?.behaviors?.size??null};});if(deferred.some(x=>x.behaviors!==0))throw new Error("Deferred M3 Region gained behavior.");
 return{operation:"central-lodge.cl16.m3.safe-apply",applyId:APPLY_ID,status:"PASS",createdBehaviorCount:created.length,baseline:{regions:postRegions,behaviors:postBehaviors,m3Regions:reread.regions.size,m3Behaviors:postM3},behaviors:rows,deferred,preservation:{geometryHash:geomAfter,kernelHash:kernelAfter,ledgerRevision:stateAfter?.revision??null,notices:stateAfter?.notices??null},phaseDisposition:"CL-16 PARTIAL / BELL BOARD OPERATION & SERVICE ROUTE DEFERRED",nextGate:"CL-16 M3 Safe FINAL VERIFY"};
}catch(error){
 const rollbackErrors=[];
 for(const c of [...created].reverse()){try{const r=game.scenes.get(SCENE_ID)?.regions.get(c.regionId);if(r?.behaviors.has(c.behaviorId))await r.deleteEmbeddedDocuments("RegionBehavior",[c.behaviorId]);}catch(e){rollbackErrors.push(c.key+":"+e.message);}}
 return{operation:"central-lodge.cl16.m3.safe-apply",applyId:APPLY_ID,status:rollbackErrors.length?"OUTCOME_UNKNOWN_ROLLBACK_INCOMPLETE":"FAIL_ROLLBACK_COMPLETE",error:error?.message??String(error),rollbackErrors};
}