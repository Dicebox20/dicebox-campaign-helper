"use strict";
const fs=require("node:fs"),crypto=require("node:crypto"),AsyncFunction=Object.getPrototypeOf(async function(){}).constructor;
const source=fs.readFileSync("cl52-m2-piano-macro-v001.txt","utf8");
const m2Hash="c27e902c6232b946ee36a61572ac17a88cd5fca54acbe391afd7fdbf483e0e3b",oldHash="4ff5a82aa5d57f8831f47063fab893eaea4d315942d59b9fbda99a0a1a9a42b6";
if(crypto.createHash("sha256").update(source).digest("hex")!==m2Hash)throw Error("M2 macro SHA drift");
const oldFiles=["cl52-m1-macro-model-preview-v001.page.js","cl52-m1-macro-guarded-apply-v001.page.js","cl52-m1-macro-final-verify-v001.page.js"];
const newFiles=["cl52-m2-macro-model-preview-v001.page.js","cl52-m2-macro-guarded-apply-v001.page.js","cl52-m2-macro-final-verify-v001.page.js"];
for(let i=0;i<oldFiles.length;i++){
 let txt=fs.readFileSync(oldFiles[i],"utf8");
 if(i<2){const t=txt.replace(/^const SRC=.*?,stable=/,()=>("const SRC="+JSON.stringify(source)+",stable="));if(t===txt)throw Error("M2 macro source literal patch failed");txt=t;}
 const repl=[
  ["m1-distant-footsteps","m2-haunted-piano"],
  ["m1DistantFootstepsPlayed","m2HauntedPianoPlayed"],
  ["Distant Footsteps","Haunted Piano"],
  ["distant-footsteps","haunted-piano"],
  ["Footsteps","Piano"],
  ["footsteps","piano"],
  ["U8S5ZrTjaPIkTUIL","JZkxX6lUQe8Nc8xJ"],
  ["M1","M2"],["m1","m2"],
  [oldHash,m2Hash],
  ["3e29666ae6a5a5819fcb7d2f58f5060c43cd18d23af0123918c758bb340ee3b5","d450137c82e8691ea31b48d6d7786421491e017651bca2d4ba916c7d7d147ba9"],
  ["1056044","1152044"]
 ];
 for(const [from,to] of repl)txt=txt.replaceAll(from,to);
 if(i===0)txt=txt.replace("game.macros.size!==132","game.macros.size!==133");
 if(i===1)txt=txt.replace("game.macros.size!==132","game.macros.size!==133").replace("game.macros.size!==133||scene.getFlag","game.macros.size!==134||scene.getFlag");
 if(i===2)txt=txt.replace("game.macros.size!==133","game.macros.size!==134");
 if(i===1)txt=txt.replace('if(totalR!==202||totalB!==116||sceneState!==null','if(ledgerBefore.indexOf("\\"revision\\":1")<0||totalR!==202||totalB!==116||sceneState!==null');
 if(i===2)txt=txt.replace('if(ledger.revision!==0||Object.keys(ledger.notices??{}).length)','if(ledger.revision!==1||ledger.puzzles?.e1?.recentUseObserved!==true||Object.keys(ledger.notices??{}).length!==2)');
 if(i===0)txt=txt.replace('return{operation:', 'if(game.journal.get("xhlXv6CCH34HVga3")?.getFlag("world","dicebox")?.state?.revision!==1)errors.push("Live ledger revision drift");\nreturn{operation:');
 if(i>0)txt=txt.replace('"DLcheEi6e5OHOYmU","JZkxX6lUQe8Nc8xJ","JZkxX6lUQe8Nc8xJ"','"DLcheEi6e5OHOYmU","U8S5ZrTjaPIkTUIL","JZkxX6lUQe8Nc8xJ"');
 if(!txt.includes("JZkxX6lUQe8Nc8xJ")||txt.includes("m1-distant-footsteps"))throw Error("Replacement incomplete "+i);
 new AsyncFunction("event",txt);
 fs.writeFileSync(newFiles[i],txt,{flag:"wx"});
 console.log("CL52_M2_SCRIPT_GENERATED",newFiles[i],"SYNTAX_PASS",Buffer.byteLength(txt));
}
