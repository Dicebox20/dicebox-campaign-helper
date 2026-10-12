const fs=require("node:fs");
const cfg=JSON.parse(fs.readFileSync("cl52-horror-pacing-contract-v001.json","utf8"));
const keyToId={"B1":"0CSBwzcszPKyaB8u","B2":"5K1uASAARnX8aZhP","C1":"EDdktL7VUihbpKe9","C2":"UNySMm7YkyYfh41x","E1":"Zq8iXByDVhHRbA7w","E2":"sI4YVZZChgey1qNi","E3":"iqfCcDpEer4pwrJj","E4":"DLcheEi6e5OHOYmU","M1":"U8S5ZrTjaPIkTUIL","M2":"JZkxX6lUQe8Nc8xJ","M3":"LXTA8mx1rJ2L6e2J","N1":"MAbLfBqG7qIVVuLN","N2":"4pc5akMBieHU7GvV","N3":"pHQvDUDlyWZFuNrX","U1":"if9iWDRjSwI87EeX","U2":"PVf6Gbrv9HbB88uZ","F1":"La9krMOMBhAhDLi6","F2":"HWitOe1wSid7MZ1y","T1":"ImeIdHbYb6kZKAdt","T2":"ez9MSQ8QIO4cW6zo","T3":"aIKQmFiuXWipEdyb"};
const path="cl52-horror-live-preview-v001.page.js";
const script=`const OP="central-lodge.cl52.horror-live-preview-v001",cfg=${JSON.stringify(cfg)},sceneIds=${JSON.stringify(keyToId)},fail=[],checks=[],sha=async s=>Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256",new TextEncoder().encode(String(s??"")))),b=>b.toString(16).padStart(2,"0")).join("");
let regions=0,behaviors=0,anchorsChecked=0;
for(const [key,id] of Object.entries(sceneIds)){const s=game.scenes.get(id);if(!s){fail.push("scene missing:"+key);continue;}regions+=s.regions.size;behaviors+=Array.from(s.regions).reduce((n,r)=>n+r.behaviors.size,0);}
for(const cue of cfg.candidateCues){if(!cue.sourceRegionId){checks.push({cue:cue.key,anchor:"PLAN_ONLY",state:"NOT_INSTALLED"});continue;}
 const scene=game.scenes.get(sceneIds[cue.scene]),r=scene?.regions.get(cue.sourceRegionId);if(!r){fail.push("anchor missing:"+cue.key);continue;}
 anchorsChecked++;const sid=r.getFlag("world","dicebox")?.stableId??"";
 if(!sid.startsWith("dbx:central-lodge:"+cue.scene.toLowerCase()+":"))fail.push("anchor namespace drift:"+cue.key);
 checks.push({cue:cue.key,anchor:r.id,stableId:sid,behaviors:r.behaviors.size,triggerSource:cue.trigger,state:"CANDIDATE_ONLY"});
}
const ledger=game.journal.get("xhlXv6CCH34HVga3")?.getFlag("world","dicebox")?.state??{},kernel=game.macros.get("FHQiFYx6OntZVo9d")?.command??"";
const itemCount=game.items.filter(i=>i.getFlag("world","dicebox")?.stableId?.startsWith("dbx:central-lodge:item:")).length;
if(Object.keys(sceneIds).length!==21||regions!==202||behaviors!==115||itemCount!==33||ledger.revision!==0||Object.keys(ledger.notices??{}).length)fail.push("live baseline drift");
if(await sha(kernel)!=="6264c467211d4f5c94cfaaa9437eae88582599061b9d8a4951391830a3e8f814")fail.push("kernel drift");
if(cfg.globalHardRules.globalDayNightTrigger!=="UNRESOLVED_GM_APPROVAL"||cfg.candidateCues.some(c=>c.trigger==="tokenEnter"))fail.push("unapproved automatic triggering");
return{operation:OP,status:fail.length?"BLOCKED":"PASS_SOURCE_PREVIEW",noWrite:true,failures:fail,summary:{scenes:Object.keys(sceneIds).length,regions,behaviors,canonicalItems:itemCount,ledgerRevision:ledger.revision,candidateCues:cfg.candidateCues.length,liveAnchorsChecked:anchorsChecked},checks,notes:["Preview and source contracts only; no cue, asset, light, player event or Foundry document installed.","GM story trigger approval and persistent one-shot flags remain required.","One-shot eligibility simulation does not establish runtime correctness."]};`;
fs.writeFileSync(path,script);
console.log("CL52_LIVE_PREVIEW_GENERATED");
