// CL-50 read-only route topology inventory; no mutators.
const ID="central-lodge.cl50.transition-inventory.readonly.v001",SCENE_IDS=["0CSBwzcszPKyaB8u","5K1uASAARnX8aZhP","EDdktL7VUihbpKe9","UNySMm7YkyYfh41x","Zq8iXByDVhHRbA7w","sI4YVZZChgey1qNi","iqfCcDpEer4pwrJj","DLcheEi6e5OHOYmU","U8S5ZrTjaPIkTUIL","JZkxX6lUQe8Nc8xJ","LXTA8mx1rJ2L6e2J","MAbLfBqG7qIVVuLN","4pc5akMBieHU7GvV","pHQvDUDlyWZFuNrX","if9iWDRjSwI87EeX","PVf6Gbrv9HbB88uZ","La9krMOMBhAhDLi6","ImeIdHbYb6kZKAdt","ez9MSQ8QIO4cW6zo","aIKQmFiuXWipEdyb","HWitOe1wSid7MZ1y"];
const edges=[],unbound=[],regionSummary=[],fails=[];let regions=0,behaviors=0;
for(const id of SCENE_IDS){
const s=game.scenes.get(id);if(!s){fails.push("missing scene "+id);continue;}
const dbx=s.getFlag("world","dicebox")??{},key=dbx.sceneKey??dbx.sceneId??"?";
for(const r of s.regions){
regions++;const x=r.getFlag("world","dicebox")??{},rSid=x.stableId??null;
let count=0;for(const b of r.behaviors){
behaviors++;count++;const bs=b.getFlag("world","dicebox")??{},source=String(b.system?.source??""),destRefs=[...source.matchAll(/Scene\.[A-Za-z0-9]{16}\.Region\.[A-Za-z0-9]{16}/g)].map(m=>m[0]),isTransit=(/transition|route|mouth|portal|door|passage/i.test(r.name+" "+b.name+" "+(x.regionRole??""))||source.includes("teleportToken(")||!!bs.destination);
if(isTransit)edges.push({scene:key,sceneId:s.id,region:r.name,regionId:r.id,behavior:b.name,behaviorId:b.id,sourceType:b.type,trigger:b.system?.events??{},destinationStable:x.destinationStableSceneId??null,flagDestination:bs.destination??null,destRefs:[...new Set(destRefs)],teleport:source.includes("teleportToken("),disabled:b.disabled,sourceLength:source.length});
}
const important=/transition|route|mouth|portal|door|passage|underworks|rail|station|threshold|entrance|exit/i.test(r.name+" "+(x.regionRole??""))||x.destinationStableSceneId!==undefined||x.bindingStatus?.includes("UNBOUND");
if(important){const row={scene:key,sceneId:id,region:r.name,regionId:r.id,stableId:rSid,regionRole:x.regionRole??null,bindingStatus:x.bindingStatus??null,destinationStableSceneId:x.destinationStableSceneId??null,candidates:x.routeCandidates??dbx.route?.candidates??[],behaviors:count};regionSummary.push(row);if((x.bindingStatus??"").includes("UNBOUND")||(x.regionRole==="scene-transition-anchor"&&count===0))unbound.push(row);}
}
}
const kernel=game.macros.get("FHQiFYx6OntZVo9d")?.command??"",ledger=game.journal.get("xhlXv6CCH34HVga3")?.getFlag("world","dicebox")?.state??{};
if(regions!==202||behaviors!==113||ledger.revision!==0)fails.push("baseline drift");
return{operation:ID,status:fails.length?"FAIL":"PASS",noWrite:true,failures:fails,baseline:{scenes:SCENE_IDS.length,regions,behaviors,ledgerRevision:ledger.revision},edges,unbound,regionSummary,stats:{edgeBehaviors:edges.length,unboundCount:unbound.length,transitionCandidates:regionSummary.length}};