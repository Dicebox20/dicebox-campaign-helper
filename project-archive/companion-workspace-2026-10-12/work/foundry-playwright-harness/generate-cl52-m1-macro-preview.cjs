const fs=require("node:fs");const src=fs.readFileSync("cl52-m1-footsteps-macro-v001.txt","utf8");
const p=`const SRC=${JSON.stringify(src)},stable="dbx:central-lodge:cl52:macro:m1-distant-footsteps-one-shot";
const sha=async s=>Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256",new TextEncoder().encode(String(s??"")))),b=>b.toString(16).padStart(2,"0")).join("");
const same=game.macros.filter(m=>m.getFlag("world","dicebox")?.stableId===stable),byName=game.macros.filter(m=>m.name==="DiceBox CL-52 — M1 Distant Footsteps (GM One-Shot)");
const model=new Macro({name:"DiceBox CL-52 — M1 Distant Footsteps (GM One-Shot)",type:"script",command:SRC,ownership:{default:0,JESWV6CcU7m07VW6:3,pnTxw7VYpYR4IKWE:3}});
const scene=game.scenes.get("U8S5ZrTjaPIkTUIL"),cues=scene?.getFlag("world","dicebox")?.cl52??null;
const errors=[];
try{new(Object.getPrototypeOf(async function(){}).constructor)("event",SRC)}catch(e){errors.push(String(e))}
if(same.length||byName.length)errors.push("Macro collision");
if(cues!==null)errors.push("M1 cue state already exists, inspect");
if(game.macros.size!==132)errors.push("Global Macro roster drift");
if(await sha(SRC)!=="4ff5a82aa5d57f8831f47063fab893eaea4d315942d59b9fbda99a0a1a9a42b6")errors.push("Macro source hash drift");
return{operation:"cl52.m1.audio-macro.model-preview.v001",status:errors.length?"BLOCKED":"PASS",noWrite:true,errors,sourceHash:await sha(SRC),modelHash:await sha(model.command),modelSourceMatches:SRC===model.command,macroCount:game.macros.size,sceneCl52:cues,permissionModel:model.ownership,hasAudioAPI:typeof foundry.audio.AudioHelper.play==="function"};`;
fs.writeFileSync("cl52-m1-macro-model-preview-v001.page.js",p);console.log("CL52 MACRO SYNTHETIC PREVIEW GENERATED")