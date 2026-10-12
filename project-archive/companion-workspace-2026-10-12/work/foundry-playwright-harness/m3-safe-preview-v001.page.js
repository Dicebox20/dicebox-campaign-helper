const PREVIEW_ID="central-lodge-cl16-m3-safe-preview-v001";
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
 {key:"bell-board-notice",regionId:REGIONS.notice,name:"DiceBox M3 — Bell Board Notice",stableId:"dbx:central-lodge:m3:behavior:bell-board-notice",sourceType:"kernel",request:{
  contract:"dicebox-discovery/v1",action:"notice",trigger:"TOKEN_ENTER",noticeKey:"m3.bell-board",dc:6,stage2Skill:"Investigation",
  successMessage:"<p>The servant bell board is incomplete. One line ends at an empty fitting where a pull should attach, and the surrounding mechanism appears designed to respond when that line is restored.</p>",
  followUp:"Suggested follow-up: Investigation.",failure:"silent",oncePerCharacter:true,autoAwardItem:false,
  criticalClueFallback:"Deliberate inspection of the bell board reveals the missing pull-and-fixture relationship."
 }},
 {key:"servant-bell-pull-install",regionId:REGIONS.pull,name:"DiceBox M3 — Servant Bell Pull Installation",stableId:"dbx:central-lodge:m3:behavior:servant-bell-pull-install",sourceType:"kernel",request:{
  contract:"dicebox-region-behavior/v1",action:"socket",trigger:"TOKEN_ENTER",itemKey:"servant-bell-pull",statePath:"puzzles.m3.servantBellPullInstalled",consume:false,
  missingMessage:"<p>The empty fitting beside the servant bell board is missing its pull.</p>",
  successMessage:"<p>The <strong>Servant Bell Pull</strong> fits the weathered bracket. The restored line takes tension, and the bell board mechanism can now respond.</p>"
 }},
 {key:"recent-use-notice",regionId:REGIONS.recent,name:"DiceBox M3 — Recent Use Notice",stableId:"dbx:central-lodge:m3:behavior:recent-use-notice",sourceType:"kernel",request:{
  contract:"dicebox-discovery/v1",action:"notice",trigger:"TOKEN_ENTER",noticeKey:"m3.recent-use",dc:6,stage2Skill:"Perception",
  successMessage:"<p>The kitchen's neglect is uneven. Dust has been disturbed around a service surface, and a few practical objects were moved recently enough to stand out from the surrounding decay. Someone has used this wing more recently than the rest of the Lodge suggests.</p>",
  followUp:"Suggested follow-up: Perception or Investigation.",failure:"silent",oncePerCharacter:true,autoAwardItem:false,
  criticalClueFallback:"Deliberate inspection of the recently disturbed service area remains possible."
 }},
 {key:"bell-crest-recovery",regionId:REGIONS.crest,name:"DiceBox M3 — Bell Crest Recovery",stableId:"dbx:central-lodge:m3:behavior:bell-crest-recovery",sourceType:"state-gate",requiredStatePath:"puzzles.m3.bellBoardResolved",request:{
  contract:"dicebox-region-behavior/v1",action:"pickup",trigger:"TOKEN_ENTER",itemKey:"bell-crest",statePath:"items.bell-crest.recovered",value:true,
  message:"<p>The resolved bell-board mechanism has exposed a hidden recess containing the <strong>Bell Crest</strong>.</p>",persistentPickup:true
 }}
];
const failures=[],warnings=[];
const scene=game.scenes.get(SCENE_ID),ledger=game.journal.get(LEDGER_ID),kernel=game.macros.get(KERNEL_ID);
if(!scene) failures.push("M3 Scene missing.");
if(!ledger) failures.push("Ledger missing.");
if(!kernel) failures.push("Kernel missing.");
const kernelHash=kernel?await sha256(kernel.command??""):null;
if(kernelHash!==EXPECTED_KERNEL_HASH) failures.push("Kernel hash drift.");
let regions=0,behaviors=0;
for(const id of LODGE_SCENES){const s=game.scenes.get(id);if(!s){failures.push("Missing canonical Scene "+id);continue;}const rs=Array.from(s.regions??[]);regions+=rs.length;behaviors+=rs.reduce((n,r)=>n+Array.from(r.behaviors??[]).length,0);}
if(regions!==202) failures.push(`Lodge Regions ${regions}; expected 202.`);
if(behaviors!==51) failures.push(`Lodge behaviors ${behaviors}; expected 51.`);
if(scene?.regions?.size!==10) failures.push(`M3 Regions ${scene?.regions?.size}; expected 10.`);
const m3Behaviors=scene?Array.from(scene.regions??[]).reduce((n,r)=>n+Array.from(r.behaviors??[]).length,0):null;
if(m3Behaviors!==0) failures.push(`M3 behaviors ${m3Behaviors}; expected 0.`);
const geometryHash=scene?await sha256(canonical(geom(scene))):null;
if(geometryHash!==EXPECTED_GEOMETRY_HASH) failures.push(`M3 geometry hash ${geometryHash}; expected ${EXPECTED_GEOMETRY_HASH}.`);
for(const spec of specs){const r=scene?.regions.get(spec.regionId);if(!r) failures.push(spec.key+": target Region missing."); else if(r.behaviors.size!==0) failures.push(spec.key+": target Region already has behavior(s).");}
for(const id of [REGIONS.board,REGIONS.route,REGIONS.lightCorridor,REGIONS.lightKitchen,REGIONS.transitionService,REGIONS.transitionMain]){const r=scene?.regions.get(id);if(!r) failures.push("Deferred Region missing "+id); else if(r.behaviors.size!==0) failures.push(r.name+" unexpectedly has behavior(s).");}
const all=LODGE_SCENES.map(id=>game.scenes.get(id)).filter(Boolean).flatMap(s=>Array.from(s.regions??[])).flatMap(r=>Array.from(r.behaviors??[]));
for(const spec of specs){const c=all.filter(b=>stableIdOf(b)===spec.stableId);if(c.length) failures.push(spec.key+": stable-ID collision x"+c.length);}
for(const itemKey of ["servant-bell-pull","bell-crest"]){const m=game.items.filter(i=>stableIdOf(i)===`dbx:central-lodge:item:${itemKey}`);if(m.length!==1) failures.push(itemKey+": canonical Item count "+m.length);}
const state=clone(ledger?.getFlag("world","dicebox")?.state??{});
if(Number(state?.revision)!==0) failures.push("Ledger revision drift.");
if(Object.keys(state?.notices??{}).length!==0) failures.push("Ledger notices not empty.");
for(const key of ["bellBoardNoticeResolved","servantBellPullInstalled","bellBoardResolved","serviceRouteUnlocked","recentUseObserved"]){const v=foundry.utils.getProperty(state,`puzzles.m3.${key}`);if(v!==false) failures.push(`puzzles.m3.${key} is ${v}; expected false.`);}
const AsyncFunction=Object.getPrototypeOf(async function(){}).constructor;
const rows=[];
for(const spec of specs){
 const source=spec.sourceType==="state-gate"?gatedPickup(spec.request,spec.requiredStatePath):dispatcher(spec.request);
 let syntax="PASS";try{new AsyncFunction("event",source);}catch(e){syntax="FAIL";failures.push(spec.key+": syntax "+e.message);}
 rows.push({key:spec.key,regionId:spec.regionId,region:scene?.regions.get(spec.regionId)?.name??null,regionStableId:stableIdOf(scene?.regions.get(spec.regionId)),stableId:spec.stableId,action:spec.request.action,sourceType:spec.sourceType,requiredStatePath:spec.requiredStatePath??null,dc:spec.request.dc??null,stage2Skill:spec.request.stage2Skill??null,itemKey:spec.request.itemKey??null,statePath:spec.request.statePath??null,sourceHash:await sha256(source),syntax});
}
return {operation:"central-lodge.cl16.m3.safe-preview",previewId:PREVIEW_ID,status:failures.length?"BLOCKED":"PASS",noWrite:true,failures,warnings,
 baseline:{scenes:LODGE_SCENES.length,regions,behaviors,m3Regions:scene?.regions?.size??null,m3Behaviors,kernelHash,geometryHash,ledgerRevision:state?.revision??null},
 plannedBehaviors:rows,
 authoringNotes:[
  "Bell Board Notice DC 6 Investigation is NEW authoring; PREPARE preserves clue semantics but no exact DC.",
  "Recent Use Notice DC 6 Perception is NEW authoring; PREPARE preserves clue semantics but no exact DC.",
  "Servant Bell Pull installation is non-consuming because recovered authority does not require destructive consumption.",
  "Bell Crest recovery is pre-bound behind puzzles.m3.bellBoardResolved and cannot fire until the deferred literal Bell Board solve is authored.",
  "Bell Board Mechanism and Service Route State remain behavior-free because no recovered source defines the literal correct-operation sequence.",
  "M3 lights remain deferred to CL-51 and transitions to CL-50."
 ],
 expectedAfterApply:{regions:202,behaviors:55,m3Regions:10,m3Behaviors:4,bellBoardMechanismBehaviors:0,serviceRouteBehaviors:0,lightBehaviors:0,transitionBehaviors:0,phaseDisposition:"CL-16 PARTIAL / BELL BOARD OPERATION & SERVICE ROUTE DEFERRED"},
 nextGate:failures.length?"STOP":"CL-16 M3 Safe APPLY v001"};