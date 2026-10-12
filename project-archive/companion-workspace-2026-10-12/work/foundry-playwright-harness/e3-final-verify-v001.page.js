const VERIFY_ID="central-lodge-cl15-e3-final-verify-v001";
const SCENE_ID="iqfCcDpEer4pwrJj";
const LEDGER_ID="xhlXv6CCH34HVga3";
const KERNEL_ID="FHQiFYx6OntZVo9d";
const EXPECTED_KERNEL_HASH="6264c467211d4f5c94cfaaa9437eae88582599061b9d8a4951391830a3e8f814";
const EXPECTED_GEOMETRY_HASH="d409885c23e5777808c5bb0964ccb3b855b2957a5e750f2b18d2a593d4c13a5d";
const LODGE_SCENES=["0CSBwzcszPKyaB8u","5K1uASAARnX8aZhP","EDdktL7VUihbpKe9","UNySMm7YkyYfh41x","Zq8iXByDVhHRbA7w","sI4YVZZChgey1qNi","iqfCcDpEer4pwrJj","DLcheEi6e5OHOYmU","U8S5ZrTjaPIkTUIL","JZkxX6lUQe8Nc8xJ","LXTA8mx1rJ2L6e2J","MAbLfBqG7qIVVuLN","4pc5akMBieHU7GvV","pHQvDUDlyWZFuNrX","if9iWDRjSwI87EeX","PVf6Gbrv9HbB88uZ","La9krMOMBhAhDLi6","ImeIdHbYb6kZKAdt","ez9MSQ8QIO4cW6zo","aIKQmFiuXWipEdyb","HWitOe1wSid7MZ1y"];
const expected=[["sundial-notice","KXDqeyk8aXKyvqiD","dbx:central-lodge:e3:behavior:sundial-notice","679062540f00c7a0e29e1b8efd0d414d5dc124f1530ceef5b16011013f1c59f4","notice"],["sundial-gnomon","W1Ev9M2xDxY5Idvf","dbx:central-lodge:e3:behavior:sundial-gnomon","7e396521e0b5b50b21c3af288d17010ca75b7eaec545c2ef4e73e877d49c0ec6","socket"],["fountain-notice","cDHDjjUPZqJi1MEf","dbx:central-lodge:e3:behavior:fountain-notice","7c28cf9cd0eb7f1320ec41eff2bc7b3d4ef5a5eb7f8a8b87320257199c8182c5","notice"],["garden-proof-recovery","YNFHW4XmJk0zmM31","dbx:central-lodge:e3:behavior:garden-proof-recovery","7edad00a3c17aa2364b34aee5f09587713e07d1cbfc77ef70a58b35f54e01982","pickup"],["water-control-wheel-install","r4OCHwd6BjmUPcSU","dbx:central-lodge:e3:behavior:water-control-wheel-install","e674307737b04ee6c79c49264223dd961b9aa6f80ca4113fb4990dfc2c785ca7","socket"],["fountain-valve-cap-recovery","S05hcoVOMueJCqFr","dbx:central-lodge:e3:behavior:fountain-valve-cap-recovery","52f1042eb39240180cd7ce2bff84b77ba7f1179d7661adc1634606a5d86c80e7","pickup"],["rose-crest-recovery","DZZzWnpZnyR6ICMP","dbx:central-lodge:e3:behavior:rose-crest-recovery","4ac647ec4e653f5e2ca06c42f68fe9e5f2a67b01186464849964c61485b3e24f","pickup"],["fountain-sequence","oZjzgI1wG3pfqDp9","dbx:central-lodge:e3:behavior:fountain-sequence","16e580bc9d2aea880745a62d31242085187d23ae520d82e1264b3bcd9dc2e8ef","gate"]];
const clone=v=>foundry.utils.deepClone(v);
const dbx=doc=>{try{return clone(doc?.getFlag?.("world","dicebox")??{});}catch{return{};}};
const stableIdOf=doc=>dbx(doc)?.stableId??null;
const normalize=v=>Array.isArray(v)?v.map(normalize):v&&typeof v==="object"?Object.fromEntries(Object.keys(v).sort().map(k=>[k,normalize(v[k])])):v;
const canonical=v=>JSON.stringify(normalize(v));
const sha256=async v=>Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256",new TextEncoder().encode(String(v??"")))),b=>b.toString(16).padStart(2,"0")).join("");
const geometrySnapshot=scene=>Array.from(scene.regions??[]).map(r=>{const s=r.toObject();return{id:r.id,shapes:s.shapes??null,elevation:s.elevation??null,visibility:s.visibility??null,locked:s.locked??null};}).sort((a,b)=>a.id.localeCompare(b.id));
const failures=[],warnings=[];
const scene=game.scenes.get(SCENE_ID), ledger=game.journal.get(LEDGER_ID), kernel=game.macros.get(KERNEL_ID);
if(!scene) failures.push("E3 Scene missing.");
if(!ledger) failures.push("Ledger missing.");
if(!kernel) failures.push("Kernel missing.");
let regions=0,behaviors=0;
for(const id of LODGE_SCENES){const s=game.scenes.get(id);if(!s){failures.push("Missing scene "+id);continue;}const rs=Array.from(s.regions??[]);regions+=rs.length;behaviors+=rs.reduce((n,r)=>n+Array.from(r.behaviors??[]).length,0);}
if(regions!==202) failures.push(`Regions ${regions}; expected 202.`);
if(behaviors!==51) failures.push(`Behaviors ${behaviors}; expected 51.`);
const e3Count=scene?Array.from(scene.regions??[]).reduce((n,r)=>n+Array.from(r.behaviors??[]).length,0):null;
if(scene?.regions?.size!==12) failures.push("E3 Region count drift.");
if(e3Count!==8) failures.push(`E3 behaviors ${e3Count}; expected 8.`);
const kernelHash=kernel?await sha256(kernel.command??""):null;
if(kernelHash!==EXPECTED_KERNEL_HASH) failures.push("Kernel hash drift.");
const geometryHash=scene?await sha256(canonical(geometrySnapshot(scene))):null;
if(geometryHash!==EXPECTED_GEOMETRY_HASH) failures.push("E3 geometry hash drift.");
const rows=[];
for(const [key,regionId,stableId,hash,action] of expected){
  const region=scene?.regions.get(regionId);
  const matches=Array.from(region?.behaviors??[]).filter(b=>stableIdOf(b)===stableId);
  if(matches.length!==1){failures.push(`${key}: installed count ${matches.length}; expected 1.`);continue;}
  const b=matches[0], actualHash=await sha256(b.system?.source??""), flags=dbx(b);
  if(actualHash!==hash) failures.push(key+": source hash drift.");
  if(flags.regionStableId!==stableIdOf(region)) failures.push(key+": regionStableId mismatch.");
  if(flags.behaviorSpec?.action!==action) failures.push(key+": action mismatch.");
  rows.push({key,id:b.id,stableId,action,sourceHash:actualHash,regionId,regionStableId:flags.regionStableId,status:(actualHash===hash&&flags.regionStableId===stableIdOf(region)&&flags.behaviorSpec?.action===action)?"PASS":"FAIL"});
}
for(const id of ["3ZtYYE3yUtM7cxQy","ndaaChpgZ1eWiskE","4RdJf3gS51WKvmsE","xe0ivUALRC8NjPOQ"]){
 const r=scene?.regions.get(id); if(!r) failures.push("Deferred Region missing "+id); else if(r.behaviors.size!==0) failures.push(r.name+" unexpectedly has behaviors.");
}
const state=clone(ledger?.getFlag("world","dicebox")?.state??{});
if(Number(state?.revision)!==0) failures.push("Ledger revision drift.");
if(Object.keys(state?.notices??{}).length!==0) failures.push("Ledger notices not empty.");
for(const key of ["sundialNoticeResolved","sundialResolved","fountainNoticeResolved","fountainValveInstalled","waterControlWheelInstalled","wellPatternApplied","fountainResolved"]){
 const v=foundry.utils.getProperty(state,`puzzles.e3.${key}`); if(v!==false) failures.push(`puzzles.e3.${key} is ${v}; expected false before gameplay.`);
}
return {operation:"central-lodge.cl15.e3.final-verify",verifyId:VERIFY_ID,status:failures.length?"FAIL":"PASS",noWrite:true,failures,warnings,baseline:{scenes:LODGE_SCENES.length,regions,behaviors,e3Regions:scene?.regions?.size??null,e3Behaviors:e3Count},kernelHash,geometryHash,behaviors:rows,ledger:{revision:state?.revision??null,notices:state?.notices??null,e3:clone(foundry.utils.getProperty(state,"puzzles.e3")??{})},phaseDisposition:failures.length?"CL-15 VERIFY FAILED":"CL-15 E3 GAMEPLAY INSTALLED / LIGHTING & TRANSITIONS DEFERRED",nextPhase:failures.length?"STOP":"CL-16 — M3 Kitchen & Service Wing"};