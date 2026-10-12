const OP="cl52.m2.audio-macro.independent-final-verify.v001",fail=[],stable="dbx:central-lodge:cl52:macro:m2-haunted-piano-one-shot",asset="worlds/the-lost-mine-of-phandalin/assets/dicebox-cl52/m2-haunted-piano-v001.wav";
const sha=async t=>Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256",new TextEncoder().encode(String(t??"")))),b=>b.toString(16).padStart(2,"0")).join("");
const results=game.macros.filter(m=>m.getFlag("world","dicebox")?.stableId===stable),m=results[0],fl=m?.getFlag("world","dicebox")??{};
if(results.length!==1||game.macros.size!==134||m?.type!=="script"||m?.name!=="DiceBox CL-52 — M2 Haunted Piano (GM One-Shot)")fail.push("Macro ID/name/count drift");
if(await sha(m?.command??"")!=="c27e902c6232b946ee36a61572ac17a88cd5fca54acbe391afd7fdbf483e0e3b"||fl.assetPath!==asset||fl.assetHash!=="d450137c82e8691ea31b48d6d7786421491e017651bca2d4ba916c7d7d147ba9")fail.push("Macro source or asset metadata drift");
if(m?.ownership?.default!==0||m?.ownership?.JESWV6CcU7m07VW6!==3||m?.ownership?.pnTxw7VYpYR4IKWE!==3)fail.push("Macro ownership drift");
const files=await FilePicker.browse("data","worlds/the-lost-mine-of-phandalin/assets/dicebox-cl52"),matched=(files?.files??[]).filter(p=>p===asset),head=await fetch(asset,{method:"HEAD"});
if(matched.length!==1||!head.ok||Number(head.headers.get("content-length"))!==1152044)fail.push("Served audio mismatch");
const scene=game.scenes.get("JZkxX6lUQe8Nc8xJ"),cues=scene?.getFlag("world","dicebox")?.cl52;
if(cues!==undefined)fail.push("Audio flag consumed by installer");
const ledger=game.journal.get("xhlXv6CCH34HVga3")?.getFlag("world","dicebox")?.state??{};
if(ledger.revision!==1||ledger.puzzles?.e1?.recentUseObserved!==true||Object.keys(ledger.notices??{}).length!==2)fail.push("Ledger drift");
let totalR=0,totalB=0;for(const id of ["0CSBwzcszPKyaB8u","5K1uASAARnX8aZhP","EDdktL7VUihbpKe9","UNySMm7YkyYfh41x","Zq8iXByDVhHRbA7w","sI4YVZZChgey1qNi","iqfCcDpEer4pwrJj","DLcheEi6e5OHOYmU","U8S5ZrTjaPIkTUIL","JZkxX6lUQe8Nc8xJ","LXTA8mx1rJ2L6e2J","MAbLfBqG7qIVVuLN","4pc5akMBieHU7GvV","pHQvDUDlyWZFuNrX","if9iWDRjSwI87EeX","PVf6Gbrv9HbB88uZ","La9krMOMBhAhDLi6","ImeIdHbYb6kZKAdt","ez9MSQ8QIO4cW6zo","aIKQmFiuXWipEdyb","HWitOe1wSid7MZ1y"]){const s=game.scenes.get(id);totalR+=s.regions.size;totalB+=Array.from(s.regions).reduce((n,r)=>n+r.behaviors.size,0);}
if(totalR!==202||totalB!==116)fail.push("Scene baseline drift");
return{operation:OP,status:fail.length?"FAIL":"PASS",noWrite:true,noPlayback:true,fail,macroId:m?.id,sourceHash:await sha(m?.command??""),permissions:m?.ownership,assetStatus:matched.length===1&&head.ok?"SERVABLE":"MISSING",macroCount:game.macros.size,regions:totalR,behaviors:totalB,ledgerRevision:ledger.revision,oneShotFlagExisting:cues!==undefined,noGameplayCanary:true};
