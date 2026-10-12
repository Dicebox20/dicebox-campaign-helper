const fs=require("node:fs"),preview=fs.readFileSync("cl52-m1-macro-model-preview-v001.page.js","utf8");const idx=preview.lastIndexOf("\nreturn{operation:");if(idx<0)throw Error("Preview structure drift");
const head=preview.slice(0,idx).replace('cl52.m1.audio-macro.model-preview.v001','cl52.m1.audio-macro.guarded-apply.v001');
const apply=`
if(errors.length)return{operation:"cl52.m1.audio-macro.guarded-apply.v001",status:"BLOCKED",noWrite:true,errors};
const sceneState=scene.getFlag("world","dicebox")?.cl52??null,ledgerBefore=JSON.stringify(game.journal.get("xhlXv6CCH34HVga3")?.getFlag("world","dicebox")?.state??{});
const asset="worlds/the-lost-mine-of-phandalin/assets/dicebox-cl52/m1-distant-footsteps-v001.wav";
const files=await FilePicker.browse("data","worlds/the-lost-mine-of-phandalin/assets/dicebox-cl52");
if((files?.files??[]).filter(f=>f===asset).length!==1)return{operation:"cl52.m1.audio-macro.guarded-apply.v001",status:"BLOCKED_ASSET_MISSING"};
const hdr=await fetch(asset,{method:"HEAD"});
if(!hdr.ok||Number(hdr.headers.get("content-length"))!==1056044)return{operation:"cl52.m1.audio-macro.guarded-apply.v001",status:"BLOCKED_ASSET_HTTP"};
let totalR=0,totalB=0;for(const id of ["0CSBwzcszPKyaB8u","5K1uASAARnX8aZhP","EDdktL7VUihbpKe9","UNySMm7YkyYfh41x","Zq8iXByDVhHRbA7w","sI4YVZZChgey1qNi","iqfCcDpEer4pwrJj","DLcheEi6e5OHOYmU","U8S5ZrTjaPIkTUIL","JZkxX6lUQe8Nc8xJ","LXTA8mx1rJ2L6e2J","MAbLfBqG7qIVVuLN","4pc5akMBieHU7GvV","pHQvDUDlyWZFuNrX","if9iWDRjSwI87EeX","PVf6Gbrv9HbB88uZ","La9krMOMBhAhDLi6","ImeIdHbYb6kZKAdt","ez9MSQ8QIO4cW6zo","aIKQmFiuXWipEdyb","HWitOe1wSid7MZ1y"]){const sc=game.scenes.get(id);totalR+=sc.regions.size;totalB+=Array.from(sc.regions).reduce((n,r)=>n+r.behaviors.size,0);}
if(totalR!==202||totalB!==116||sceneState!==null||!game.user?.isGM||game.user.id!=="pnTxw7VYpYR4IKWE")return{operation:"cl52.m1.audio-macro.guarded-apply.v001",status:"BLOCKED_RUNTIME_BASELINE"};
let made;
try{
 made=await Macro.create({
  name:"DiceBox CL-52 — M1 Distant Footsteps (GM One-Shot)",
  type:"script",command:SRC,img:"icons/svg/sound.svg",
  ownership:{default:0,JESWV6CcU7m07VW6:3,pnTxw7VYpYR4IKWE:3},
  flags:{world:{dicebox:{schemaVersion:"1.0.0",campaignId:"central-lodge",managed:true,stableId:stable,sceneKey:"M1",documentRole:"gm-manual-horror-audio",installer:"cl52-m1-audio-macro-apply-v001",sourceHash:"4ff5a82aa5d57f8831f47063fab893eaea4d315942d59b9fbda99a0a1a9a42b6",assetPath:asset,assetHash:"3e29666ae6a5a5819fcb7d2f58f5060c43cd18d23af0123918c758bb340ee3b5",oneShotFlagPath:"flags.world.dicebox.cl52.m1DistantFootstepsPlayed"}}}
 });
 const installed=game.macros.get(made?.id),f=installed?.getFlag("world","dicebox")??{};
 if(!installed||await sha(installed.command)!=="4ff5a82aa5d57f8831f47063fab893eaea4d315942d59b9fbda99a0a1a9a42b6"||f.stableId!==stable||f.assetPath!==asset||installed.ownership?.default!==0||installed.ownership?.JESWV6CcU7m07VW6!==3||installed.ownership?.pnTxw7VYpYR4IKWE!==3)throw Error("Post macro contract drift");
 if(game.macros.size!==133||scene.getFlag("world","dicebox")?.cl52!==undefined||JSON.stringify(game.journal.get("xhlXv6CCH34HVga3")?.getFlag("world","dicebox")?.state??{})!==ledgerBefore)throw Error("Macro count or gameplay state drift");
 return{operation:"cl52.m1.audio-macro.guarded-apply.v001",status:"PASS",noPlayback:true,macroId:installed.id,sourceHash:await sha(installed.command),assetPath:asset,macroCount:game.macros.size,sceneCueAlreadyConsumed:false,finalVerifyRequired:true};
}catch(e){
 let restore="NOT_CREATED";
 if(made?.id){try{await Macro.deleteDocuments([made.id]);restore="DELETED_MACRO"}catch(err){restore="ROLLBACK_FAILED:"+String(err)}}
 return{operation:"cl52.m1.audio-macro.guarded-apply.v001",status:restore==="ROLLBACK_FAILED"?"OUTCOME_UNKNOWN_ROLLBACK_INCOMPLETE":"FAIL_ROLLBACK_COMPLETE",error:String(e),rollback:restore};
}
`;
fs.writeFileSync("cl52-m1-macro-guarded-apply-v001.page.js",head+"\n"+apply);
const verify=`const OP="cl52.m1.audio-macro.independent-final-verify.v001",fail=[],stable="dbx:central-lodge:cl52:macro:m1-distant-footsteps-one-shot",asset="worlds/the-lost-mine-of-phandalin/assets/dicebox-cl52/m1-distant-footsteps-v001.wav";
const sha=async t=>Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256",new TextEncoder().encode(String(t??"")))),b=>b.toString(16).padStart(2,"0")).join("");
const results=game.macros.filter(m=>m.getFlag("world","dicebox")?.stableId===stable),m=results[0],fl=m?.getFlag("world","dicebox")??{};
if(results.length!==1||game.macros.size!==133||m?.type!=="script"||m?.name!=="DiceBox CL-52 — M1 Distant Footsteps (GM One-Shot)")fail.push("Macro ID/name/count drift");
if(await sha(m?.command??"")!=="4ff5a82aa5d57f8831f47063fab893eaea4d315942d59b9fbda99a0a1a9a42b6"||fl.assetPath!==asset||fl.assetHash!=="3e29666ae6a5a5819fcb7d2f58f5060c43cd18d23af0123918c758bb340ee3b5")fail.push("Macro source or asset metadata drift");
if(m?.ownership?.default!==0||m?.ownership?.JESWV6CcU7m07VW6!==3||m?.ownership?.pnTxw7VYpYR4IKWE!==3)fail.push("Macro ownership drift");
const files=await FilePicker.browse("data","worlds/the-lost-mine-of-phandalin/assets/dicebox-cl52"),matched=(files?.files??[]).filter(p=>p===asset),head=await fetch(asset,{method:"HEAD"});
if(matched.length!==1||!head.ok||Number(head.headers.get("content-length"))!==1056044)fail.push("Served audio mismatch");
const scene=game.scenes.get("U8S5ZrTjaPIkTUIL"),cues=scene?.getFlag("world","dicebox")?.cl52;
if(cues!==undefined)fail.push("Audio flag consumed by installer");
const ledger=game.journal.get("xhlXv6CCH34HVga3")?.getFlag("world","dicebox")?.state??{};
if(ledger.revision!==0||Object.keys(ledger.notices??{}).length)fail.push("Ledger drift");
let totalR=0,totalB=0;for(const id of ["0CSBwzcszPKyaB8u","5K1uASAARnX8aZhP","EDdktL7VUihbpKe9","UNySMm7YkyYfh41x","Zq8iXByDVhHRbA7w","sI4YVZZChgey1qNi","iqfCcDpEer4pwrJj","DLcheEi6e5OHOYmU","U8S5ZrTjaPIkTUIL","JZkxX6lUQe8Nc8xJ","LXTA8mx1rJ2L6e2J","MAbLfBqG7qIVVuLN","4pc5akMBieHU7GvV","pHQvDUDlyWZFuNrX","if9iWDRjSwI87EeX","PVf6Gbrv9HbB88uZ","La9krMOMBhAhDLi6","ImeIdHbYb6kZKAdt","ez9MSQ8QIO4cW6zo","aIKQmFiuXWipEdyb","HWitOe1wSid7MZ1y"]){const s=game.scenes.get(id);totalR+=s.regions.size;totalB+=Array.from(s.regions).reduce((n,r)=>n+r.behaviors.size,0);}
if(totalR!==202||totalB!==116)fail.push("Scene baseline drift");
return{operation:OP,status:fail.length?"FAIL":"PASS",noWrite:true,noPlayback:true,fail,macroId:m?.id,sourceHash:await sha(m?.command??""),permissions:m?.ownership,assetStatus:matched.length===1&&head.ok?"SERVABLE":"MISSING",macroCount:game.macros.size,regions:totalR,behaviors:totalB,ledgerRevision:ledger.revision,oneShotFlagExisting:cues!==undefined,noGameplayCanary:true};
`;
fs.writeFileSync("cl52-m1-macro-final-verify-v001.page.js",verify);
console.log("CL52_MACRO_GUARDED_APPLY_AND_FINAL_VERIFY_GENERATED");
