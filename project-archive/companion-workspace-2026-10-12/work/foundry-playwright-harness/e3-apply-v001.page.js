const APPLY_ID="central-lodge-cl15-e3-behavior-apply-v001";
const SCENE_ID="iqfCcDpEer4pwrJj";
const LEDGER_ID="xhlXv6CCH34HVga3";
const KERNEL_ID="FHQiFYx6OntZVo9d";
const EXPECTED_KERNEL_HASH="6264c467211d4f5c94cfaaa9437eae88582599061b9d8a4951391830a3e8f814";
const EXPECTED_GEOMETRY_HASH="d409885c23e5777808c5bb0964ccb3b855b2957a5e750f2b18d2a593d4c13a5d";
const LODGE_SCENES=["0CSBwzcszPKyaB8u","5K1uASAARnX8aZhP","EDdktL7VUihbpKe9","UNySMm7YkyYfh41x","Zq8iXByDVhHRbA7w","sI4YVZZChgey1qNi","iqfCcDpEer4pwrJj","DLcheEi6e5OHOYmU","U8S5ZrTjaPIkTUIL","JZkxX6lUQe8Nc8xJ","LXTA8mx1rJ2L6e2J","MAbLfBqG7qIVVuLN","4pc5akMBieHU7GvV","pHQvDUDlyWZFuNrX","if9iWDRjSwI87EeX","PVf6Gbrv9HbB88uZ","La9krMOMBhAhDLi6","ImeIdHbYb6kZKAdt","ez9MSQ8QIO4cW6zo","aIKQmFiuXWipEdyb","HWitOe1wSid7MZ1y"];
const specs=[{"key":"sundial-notice","regionId":"KXDqeyk8aXKyvqiD","name":"DiceBox E3 Sundial Notice","stableId":"dbx:central-lodge:e3:behavior:sundial-notice","expectedHash":"679062540f00c7a0e29e1b8efd0d414d5dc124f1530ceef5b16011013f1c59f4","request":{"contract":"dicebox-discovery/v1","action":"notice","trigger":"TOKEN_ENTER","noticeKey":"e3.sundial","dc":6,"stage2Skill":"Investigation","successMessage":"<p>The sundial is incomplete. Its center has a fitted socket where a removable metal gnomon should stand.</p>","followUp":"Suggested follow-up: Investigation.","failure":"silent","oncePerCharacter":true,"autoAwardItem":false,"criticalClueFallback":"Deliberate inspection reveals that the sundial is missing a fitted metal gnomon."}},{"key":"sundial-gnomon","regionId":"W1Ev9M2xDxY5Idvf","name":"DiceBox E3 Brass Gnomon","stableId":"dbx:central-lodge:e3:behavior:sundial-gnomon","expectedHash":"7e396521e0b5b50b21c3af288d17010ca75b7eaec545c2ef4e73e877d49c0ec6","request":{"contract":"dicebox-region-behavior/v1","action":"socket","trigger":"TOKEN_ENTER","itemKey":"brass-gnomon","statePath":"puzzles.e3.sundialResolved","consume":false,"missingMessage":"<p>The sundial's empty center is shaped for a narrow fitted metal piece.</p>","successMessage":"<p>The <strong>Brass Gnomon</strong> seats cleanly into the sundial. The mechanism settles into place and a concealed catch beneath the dial releases.</p>"}},{"key":"fountain-notice","regionId":"cDHDjjUPZqJi1MEf","name":"DiceBox E3 Fountain Notice","stableId":"dbx:central-lodge:e3:behavior:fountain-notice","expectedHash":"7c28cf9cd0eb7f1320ec41eff2bc7b3d4ef5a5eb7f8a8b87320257199c8182c5","request":{"contract":"dicebox-discovery/v1","action":"notice","trigger":"TOKEN_ENTER","noticeKey":"e3.fountain","dc":6,"stage2Skill":"Investigation","successMessage":"<p>The fountain is more mechanism than ornament. Its fittings and channels suggest an ordered control sequence rather than a simple valve.</p>","followUp":"Suggested follow-up: Investigation.","failure":"silent","oncePerCharacter":true,"autoAwardItem":false,"criticalClueFallback":"Deliberate inspection reveals that the fountain's controls must be operated in a deliberate sequence."}},{"key":"garden-proof-recovery","regionId":"YNFHW4XmJk0zmM31","name":"DiceBox E3 Garden Proof Recovery","stableId":"dbx:central-lodge:e3:behavior:garden-proof-recovery","expectedHash":"7edad00a3c17aa2364b34aee5f09587713e07d1cbfc77ef70a58b35f54e01982","request":{"contract":"dicebox-region-behavior/v1","action":"pickup","trigger":"TOKEN_ENTER","itemKey":"garden-proof","statePath":"items.garden-proof.recovered","value":true,"message":"<p>You recover the <strong>Garden Proof</strong> from the neglected garden marker.</p>","persistentPickup":true}},{"key":"water-control-wheel-install","regionId":"r4OCHwd6BjmUPcSU","name":"DiceBox E3 Water Control Wheel Installation","stableId":"dbx:central-lodge:e3:behavior:water-control-wheel-install","expectedHash":"e674307737b04ee6c79c49264223dd961b9aa6f80ca4113fb4990dfc2c785ca7","request":{"contract":"dicebox-region-behavior/v1","action":"socket","trigger":"TOKEN_ENTER","itemKey":"water-control-wheel","statePath":"puzzles.e3.waterControlWheelInstalled","consume":false,"missingMessage":"<p>The fountain assembly has an exposed control spindle, but its wheel is missing.</p>","successMessage":"<p>The <strong>Water Control Wheel</strong> from the basement fits the garden mechanism. The control spindle can now be operated.</p>"}},{"key":"fountain-valve-cap-recovery","regionId":"S05hcoVOMueJCqFr","name":"DiceBox E3 Fountain Valve Cap Recovery","stableId":"dbx:central-lodge:e3:behavior:fountain-valve-cap-recovery","expectedHash":"52f1042eb39240180cd7ce2bff84b77ba7f1179d7661adc1634606a5d86c80e7","request":{"contract":"dicebox-region-behavior/v1","action":"pickup","trigger":"TOKEN_ENTER","itemKey":"fountain-valve-cap","statePath":"items.fountain-valve-cap.recovered","value":true,"message":"<p>Among the greenhouse fittings you recover the <strong>Fountain Valve Cap</strong>.</p>","persistentPickup":true}},{"key":"rose-crest-recovery","regionId":"DZZzWnpZnyR6ICMP","name":"DiceBox E3 Rose Crest Recovery","stableId":"dbx:central-lodge:e3:behavior:rose-crest-recovery","expectedHash":"4ac647ec4e653f5e2ca06c42f68fe9e5f2a67b01186464849964c61485b3e24f","request":{"contract":"dicebox-region-behavior/v1","action":"pickup","trigger":"TOKEN_ENTER","itemKey":"rose-crest","statePath":"items.rose-crest.recovered","value":true,"message":"<p>You recover the weathered <strong>Rose Crest</strong> from the garden memorial.</p>","persistentPickup":true}},{"key":"fountain-sequence","regionId":"oZjzgI1wG3pfqDp9","name":"DiceBox E3 Fountain Sequence","stableId":"dbx:central-lodge:e3:behavior:fountain-sequence","expectedHash":"16e580bc9d2aea880745a62d31242085187d23ae520d82e1264b3bcd9dc2e8ef","request":{"contract":"dicebox-region-behavior/v1","action":"gate","trigger":"TOKEN_ENTER","statePath":"puzzles.e3.fountainResolved","requirements":[{"type":"state","path":"puzzles.e3.waterControlWheelInstalled","value":true},{"type":"actorHasItem","itemKey":"fountain-valve-cap"},{"type":"actorHasItem","itemKey":"well-carving-pattern"}],"set":[{"path":"puzzles.e3.fountainValveInstalled","value":true},{"path":"puzzles.e3.wellPatternApplied","value":true}],"incompleteMessage":"<p>The fountain mechanism is still incomplete. Its spindle needs its control wheel, one fitting is uncapped, and the correct operating order is not obvious from the mechanism alone.</p>","successMessage":"<p>Using the <strong>Well Carving Pattern</strong> as the operating sequence, you seat the <strong>Fountain Valve Cap</strong> and work the restored control wheel. Water shifts through hidden channels beneath the garden as the fountain mechanism settles into its resolved state.</p>"}}];
const clone=v=>foundry.utils.deepClone(v);
const dbx=doc=>{try{return clone(doc?.getFlag?.("world","dicebox")??{});}catch{return{};}};
const stableIdOf=doc=>dbx(doc)?.stableId??null;
const normalize=v=>Array.isArray(v)?v.map(normalize):v&&typeof v==="object"?Object.fromEntries(Object.keys(v).sort().map(k=>[k,normalize(v[k])])):v;
const canonical=v=>JSON.stringify(normalize(v));
const sha256=async v=>Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256",new TextEncoder().encode(String(v??"")))),b=>b.toString(16).padStart(2,"0")).join("");
const geometrySnapshot=scene=>Array.from(scene.regions??[]).map(r=>{const s=r.toObject();return{id:r.id,shapes:s.shapes??null,elevation:s.elevation??null,visibility:s.visibility??null,locked:s.locked??null};}).sort((a,b)=>a.id.localeCompare(b.id));
const dispatcher=request=>[
'const k = game.macros.find(m => m.getFlag?.("world","dicebox")?.stableId === "dbx:central-lodge:macro:runtime");',
'if (!k) { console.error("[Central Lodge E3] Runtime Kernel missing."); return; }',
'const t = event?.data?.token ?? event?.token ?? null;',
'const a = t?.actor ?? null;',
'return await k.execute({actor:a,token:t,event,speaker:{dicebox:'+JSON.stringify(request)+'}});'
].join("\n");

const blockers=[];
if(!game.user?.isGM) blockers.push("Current user is not GM.");
if(!["Gamemaster","Assistant Gamemaster"].includes(game.user?.name)) blockers.push(`Current GM ${game.user?.name} is not an explicitly authorized DiceBox project executor.`);
const scene=game.scenes.get(SCENE_ID), ledger=game.journal.get(LEDGER_ID), kernel=game.macros.get(KERNEL_ID);
if(!scene) blockers.push("E3 Scene missing.");
if(!ledger) blockers.push("Ledger missing.");
if(!kernel) blockers.push("Kernel missing.");
const kernelHash=kernel?await sha256(kernel.command??""):null;
if(kernelHash!==EXPECTED_KERNEL_HASH) blockers.push("Kernel hash drift.");
let regions=0,behaviors=0;
for(const id of LODGE_SCENES){const s=game.scenes.get(id);if(!s){blockers.push("Missing scene "+id);continue;}const rs=Array.from(s.regions??[]);regions+=rs.length;behaviors+=rs.reduce((n,r)=>n+Array.from(r.behaviors??[]).length,0);}
if(regions!==202) blockers.push(`Region count ${regions}; expected 202.`);
if(behaviors!==43) blockers.push(`Behavior count ${behaviors}; expected 43.`);
if(scene?.regions?.size!==12) blockers.push("E3 Region count drift.");
const e3Count=scene?Array.from(scene.regions??[]).reduce((n,r)=>n+Array.from(r.behaviors??[]).length,0):null;
if(e3Count!==0) blockers.push(`E3 has ${e3Count} behaviors; expected 0.`);
const geometryHash=scene?await sha256(canonical(geometrySnapshot(scene))):null;
if(geometryHash!==EXPECTED_GEOMETRY_HASH) blockers.push("E3 geometry hash drift.");
const stateBefore=clone(ledger?.getFlag("world","dicebox")?.state??{});
if(Number(stateBefore?.revision)!==0) blockers.push("Ledger revision drift.");
if(Object.keys(stateBefore?.notices??{}).length!==0) blockers.push("Ledger notices not empty.");

const payloads=[];
for(const spec of specs){
  const region=scene?.regions.get(spec.regionId);
  if(!region){blockers.push(spec.key+": Region missing.");continue;}
  if(region.behaviors.size!==0) blockers.push(spec.key+": Region already has behavior(s).");
  const source=dispatcher(spec.request);
  const hash=await sha256(source);
  if(hash!==spec.expectedHash) blockers.push(spec.key+": source hash mismatch.");
  const regionStableId=stableIdOf(region);
  if(!regionStableId) blockers.push(spec.key+": Region stable ID missing.");
  payloads.push({spec,region,source,regionStableId,hash});
}
const existing=LODGE_SCENES.map(id=>game.scenes.get(id)).filter(Boolean).flatMap(s=>Array.from(s.regions??[])).flatMap(r=>Array.from(r.behaviors??[]));
for(const spec of specs) if(existing.some(b=>stableIdOf(b)===spec.stableId)) blockers.push(spec.key+": stable-ID collision.");

if(blockers.length) return {operation:"central-lodge.cl15.e3.apply",applyId:APPLY_ID,status:"BLOCKED",noWrite:true,blockers};

const created=[];
try{
  for(const p of payloads){
    const behaviorSpec={...clone(p.spec.request),sourceType:"kernel"};
    if(p.spec.request.action==="pickup") behaviorSpec.rewardItemKey=p.spec.request.itemKey;
    const doc={
      name:p.spec.name,
      type:"executeScript",
      disabled:false,
      system:{events:["tokenEnter"],source:p.source},
      flags:{world:{dicebox:{
        schemaVersion:"1.0.0",campaignId:"central-lodge",managed:true,installer:APPLY_ID,
        stableId:p.spec.stableId,sceneKey:"E3",regionStableId:p.regionStableId,sourceHash:p.hash,behaviorSpec
      }}}
    };
    const made=await p.region.createEmbeddedDocuments("RegionBehavior",[doc]);
    if(!made?.length||made.length!==1) throw new Error(p.spec.key+": expected one created behavior.");
    created.push({regionId:p.region.id,behaviorId:made[0].id,key:p.spec.key});
  }

  const reread=game.scenes.get(SCENE_ID);
  let postRegions=0,postBehaviors=0;
  for(const id of LODGE_SCENES){const s=game.scenes.get(id),rs=Array.from(s.regions??[]);postRegions+=rs.length;postBehaviors+=rs.reduce((n,r)=>n+Array.from(r.behaviors??[]).length,0);}
  const postE3=Array.from(reread.regions??[]).reduce((n,r)=>n+Array.from(r.behaviors??[]).length,0);
  if(postRegions!==202||postBehaviors!==51||postE3!==8) throw new Error(`Post counts ${postRegions}/${postBehaviors}, E3 ${postE3}`);
  const postGeom=await sha256(canonical(geometrySnapshot(reread)));
  if(postGeom!==EXPECTED_GEOMETRY_HASH) throw new Error("Geometry changed.");
  const postKernel=await sha256(game.macros.get(KERNEL_ID)?.command??"");
  if(postKernel!==EXPECTED_KERNEL_HASH) throw new Error("Kernel changed.");
  const stateAfter=clone(game.journal.get(LEDGER_ID)?.getFlag("world","dicebox")?.state??{});
  if(canonical(stateAfter)!==canonical(stateBefore)) throw new Error("Ledger changed during install.");
  const rows=[];
  for(const spec of specs){
    const r=reread.regions.get(spec.regionId);
    const matches=Array.from(r.behaviors??[]).filter(b=>stableIdOf(b)===spec.stableId);
    if(matches.length!==1) throw new Error(spec.key+": installed count "+matches.length);
    const b=matches[0], hash=await sha256(b.system?.source??"");
    if(hash!==spec.expectedHash) throw new Error(spec.key+": post hash mismatch.");
    if(dbx(b)?.regionStableId!==stableIdOf(r)) throw new Error(spec.key+": regionStableId mismatch.");
    rows.push({key:spec.key,id:b.id,stableId:spec.stableId,sourceHash:hash,regionId:r.id,regionStableId:stableIdOf(r)});
  }
  return {operation:"central-lodge.cl15.e3.apply",applyId:APPLY_ID,status:"PASS",createdBehaviorCount:created.length,baseline:{regions:postRegions,behaviors:postBehaviors,e3Regions:reread.regions.size,e3Behaviors:postE3},behaviors:rows,preservation:{geometryHash:postGeom,kernelHash:postKernel,ledgerRevision:stateAfter?.revision??null,notices:stateAfter?.notices??null},nextGate:"CL-15 E3 FINAL VERIFY"};
}catch(error){
  const rollbackErrors=[];
  for(const c of [...created].reverse()){
    try{
      const r=game.scenes.get(SCENE_ID)?.regions.get(c.regionId);
      if(r?.behaviors.has(c.behaviorId)) await r.deleteEmbeddedDocuments("RegionBehavior",[c.behaviorId]);
    }catch(e){rollbackErrors.push(c.key+":"+e.message);}
  }
  return {operation:"central-lodge.cl15.e3.apply",applyId:APPLY_ID,status:rollbackErrors.length?"OUTCOME_UNKNOWN_ROLLBACK_INCOMPLETE":"FAIL_ROLLBACK_COMPLETE",error:error?.message??String(error),rollbackErrors};
}