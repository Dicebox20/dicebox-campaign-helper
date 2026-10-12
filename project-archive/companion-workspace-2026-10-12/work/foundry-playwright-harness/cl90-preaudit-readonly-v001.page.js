// CL-90 preparatory audit; no Foundry writes or gameplay interactions.
const ID="central-lodge.cl90.pre-audit-2026-10-07.v001",SCENES=["0CSBwzcszPKyaB8u","5K1uASAARnX8aZhP","EDdktL7VUihbpKe9","UNySMm7YkyYfh41x","Zq8iXByDVhHRbA7w","sI4YVZZChgey1qNi","iqfCcDpEer4pwrJj","DLcheEi6e5OHOYmU","U8S5ZrTjaPIkTUIL","JZkxX6lUQe8Nc8xJ","LXTA8mx1rJ2L6e2J","MAbLfBqG7qIVVuLN","4pc5akMBieHU7GvV","pHQvDUDlyWZFuNrX","if9iWDRjSwI87EeX","PVf6Gbrv9HbB88uZ","La9krMOMBhAhDLi6","ImeIdHbYb6kZKAdt","ez9MSQ8QIO4cW6zo","aIKQmFiuXWipEdyb","HWitOe1wSid7MZ1y"];
const findings=[],behaviors=[],stats={kernelDelegated:0,primaryGMCode:0,playerLocalCode:0,other:0,teleportSources:0,disabled:0,noSource:0,duplicateBehaviorStableIds:[],regions:0,behaviors:0,lights:0,tokens:0,canonicalItems:0};
const seen=new Set(),sha=async t=>Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256",new TextEncoder().encode(String(t??"")))),b=>b.toString(16).padStart(2,"0")).join("");
for(const id of SCENES){
 const s=game.scenes.get(id);if(!s){findings.push("MISSING_SCENE:"+id);continue;}
 stats.regions+=s.regions.size;stats.lights+=s.lights.size;stats.tokens+=s.tokens.size;
 for(const r of s.regions){
  for(const b of r.behaviors){
   stats.behaviors++;
   const src=String(b.system?.source??""),sid=b.getFlag("world","dicebox")?.stableId??null;
   if(sid){if(seen.has(sid))stats.duplicateBehaviorStableIds.push(sid);seen.add(sid);}
   if(b.disabled)stats.disabled++;
   if(!src.trim())stats.noSource++;
   let executionMode="other";
   if(src.includes('__kernel.execute(')||src.includes('kernel.execute(')){executionMode="kernel-delegated";stats.kernelDelegated++;}
   else if(src.includes("activeGMs[0].id")||src.includes("__primary.id")||src.includes("isPrimaryGM")){executionMode="primary-gm";stats.primaryGMCode++;}
   else if(src.includes("game.user?.id !== event?.user?.id")||src.includes("game.user.id !== event.user.id")){executionMode="player-local";stats.playerLocalCode++;}
   else stats.other++;
   if(src.includes("teleportToken("))stats.teleportSources++;
   if(executionMode==="player-local"||executionMode==="other"){
    behaviors.push({scene:s.name,region:r.name,name:b.name,id:b.id,executionMode,stableId:sid,hash:await sha(src),disabled:b.disabled});
   }
  }
 }
}
const itemPrefix="dbx:central-lodge:item:",items=game.items.filter(i=>String(i.getFlag("world","dicebox")?.stableId??"").startsWith(itemPrefix));
stats.canonicalItems=items.length;
const itemKeys=new Set(items.map(i=>i.getFlag("world","dicebox")?.stableId));
if(itemKeys.size!==33||items.length!==33)findings.push("CANONICAL_ITEM_DRIFT");
const ledger=game.journal.get("xhlXv6CCH34HVga3")?.getFlag("world","dicebox")?.state??{};
if(stats.regions!==202||stats.behaviors!==115||SCENES.length!==21||stats.duplicateBehaviorStableIds.length) findings.push("REGION_BEHAVIOR_BASELINE_OR_COLLISION");
if(ledger.revision!==0||Object.keys(ledger.notices??{}).length)findings.push("LEDGER_DRIFT");
if(await sha(game.macros.get("FHQiFYx6OntZVo9d")?.command??"")!=="6264c467211d4f5c94cfaaa9437eae88582599061b9d8a4951391830a3e8f814")findings.push("KERNEL_DRIFT");
const expected=[
 ["aIKQmFiuXWipEdyb","Tkg7XpsF7X1P3ZVJ","dbx:central-lodge:t3:behavior:ancient-passage-to-f1"],
 ["aIKQmFiuXWipEdyb","YElrtisbXN3DJ2Sw","dbx:central-lodge:t3:behavior:return-to-n3"],
 ["La9krMOMBhAhDLi6","iuoEHBXWtXgzYmMh","dbx:central-lodge:f1:behavior:transition-f2"]];
const routes=[];
for(const [sid,rid,stable] of expected){const r=game.scenes.get(sid)?.regions.get(rid),bs=Array.from(r?.behaviors??[]).filter(b=>b.getFlag("world","dicebox")?.stableId===stable);
routes.push({sceneId:sid,regionId:rid,behaviorId:bs[0]?.id??null,stableId:stable,count:bs.length});
if(bs.length!==1)findings.push("KNOWN_ROUTE_MISSING:"+stable);
}
return{operation:ID,status:findings.length?"FAIL":"PASS_WITH_DEFERRED_QA",noWrite:true,findings,stats,routes,legacyOrOtherBehaviors:behaviors,limitations:["Classification is static source-heuristic only.","No gameplay canary, token events, or cross-client event authority test performed.","CL-50 remaining destinations, CL-51 global night trigger, and CL-52 pacing still unresolved."]};