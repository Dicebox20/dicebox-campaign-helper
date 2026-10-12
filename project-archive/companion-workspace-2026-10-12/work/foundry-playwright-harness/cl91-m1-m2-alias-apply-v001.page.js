const ID="central-lodge.cl91.m1-m2.alias-repair.apply.v001",FIXES=[["M1","U8S5ZrTjaPIkTUIL","5vB7Rsqi5XxfjKjQ","puzzles.m1.clockEmblemInserted","puzzles.m1.silverFamilyEmblemInstalled","17b73f386d42926f55defe9dc1454f358f88ec16c76865db757b447ab9f1fdb1","6014b5834f570097861100b0da77d890cabd607a56b2f3b2c29698bf1a14d061"],["M1","U8S5ZrTjaPIkTUIL","OcRjOu5UK9Jq1XfI","puzzles.m1.clockSettingSolved","puzzles.m1.clockSettingResolved","488ac6af52a2132b6dea85f764e9cda40a4e1889d578bed7a47c332b770618ff","8ec74132ea0d2b35602a4669e8af976292e41cbc03c65c20d9ad976504e5245b"],["M1","U8S5ZrTjaPIkTUIL","8vtIgrjGwYaxjL07","puzzles.m1.clockSettingSolved","puzzles.m1.clockSettingResolved","df96036b8bed013844c7dd0df3db325adc03114416ef782cf4566a7aaef13aab","383fb67c7f6290aba726b5c13c31ab8eb3b8989c0a4711c656234663cb3b70e6"],["M2","JZkxX6lUQe8Nc8xJ","re48ahV2D14sF4Ln","puzzles.m2.portraitEyeRestored","puzzles.m2.glassEyeInstalled","cfc37e19a544ab8ee6a46ceec7218da95caacfcce31caeb110b8e1620ceae781","03455702faa52107db28b32541014c3efd8c21009f14f6c189b9ece6e2804cb9"],["M2","JZkxX6lUQe8Nc8xJ","aGn2ZJSSH0WNzxzz","puzzles.m2.playerPianoSolved","puzzles.m2.pianoRollInstalled","5e3557cb43fb44a43fe4709584cf66863e95919802f167459d591a6616076164","2b1ae6d94ae3e542a2ed43fbbfc75ca3e596f7d91e1e0713f24d8985f32a0b0e"],["M2","JZkxX6lUQe8Nc8xJ","dgr5x5y5Df8GuX1d","puzzles.m2.familyReliquaryOpened","puzzles.m2.reliquaryUnlocked","0cc27bc8c304a435b13a7f1ce645388e17539c6f6407339577e1ea9d39ea3d9a","c9d55669ad919e13bbb0d307f03a57d2448ef58cec5cf51e8c7cbf8d0fa1dac7"]];
const IDS=["0CSBwzcszPKyaB8u","5K1uASAARnX8aZhP","EDdktL7VUihbpKe9","UNySMm7YkyYfh41x","Zq8iXByDVhHRbA7w","sI4YVZZChgey1qNi","iqfCcDpEer4pwrJj","DLcheEi6e5OHOYmU","U8S5ZrTjaPIkTUIL","JZkxX6lUQe8Nc8xJ","LXTA8mx1rJ2L6e2J","MAbLfBqG7qIVVuLN","4pc5akMBieHU7GvV","pHQvDUDlyWZFuNrX","if9iWDRjSwI87EeX","PVf6Gbrv9HbB88uZ","La9krMOMBhAhDLi6","ImeIdHbYb6kZKAdt","ez9MSQ8QIO4cW6zo","aIKQmFiuXWipEdyb","HWitOe1wSid7MZ1y"];
const sha=async x=>Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256",new TextEncoder().encode(String(x??"")))),b=>b.toString(16).padStart(2,"0")).join("");
const fails=[],rows=[],initialSource=new Map();let rn=0,bn=0;
for(const id of IDS){const s=game.scenes.get(id);if(!s){fails.push("missing:"+id);continue;}rn+=s.regions.size;bn+=Array.from(s.regions).reduce((n,r)=>n+r.behaviors.size,0);}
if(rn!==202||bn!==115||IDS.length!==21)fails.push("baseline drift");
const ledger=game.journal.get("xhlXv6CCH34HVga3"),state=ledger?.getFlag("world","dicebox")?.state??{};
if(state.revision!==0||Object.keys(state.notices??{}).length||await sha(game.macros.get("FHQiFYx6OntZVo9d")?.command??"")!=="6264c467211d4f5c94cfaaa9437eae88582599061b9d8a4951391830a3e8f814")fails.push("kernel or ledger drift");
for(const id of ["U8S5ZrTjaPIkTUIL","JZkxX6lUQe8Nc8xJ"])if(game.scenes.get(id)?.tokens.size!==0)fails.push("scene has token:"+id);
if(!game.user?.isGM||game.user.id!=="pnTxw7VYpYR4IKWE")fails.push("executor drift");
for(const [key,id,bid,oldPath,newPath,oldHash,newHash] of FIXES){
 const scene=game.scenes.get(id),behavior=Array.from(scene?.regions??[]).flatMap(r=>Array.from(r.behaviors)).find(b=>b.id===bid),source=behavior?.system?.source??"",newSource=source.replaceAll(oldPath,newPath);
 if(!behavior||source.split(oldPath).length!==2||await sha(source)!==oldHash||await sha(newSource)!==newHash||foundry.utils.getProperty(state,newPath)===undefined||foundry.utils.getProperty(state,oldPath)!==undefined)fails.push("source/schema drift:"+bid);
 try{new (Object.getPrototypeOf(async function(){}).constructor)("event",newSource)}catch(e){fails.push("syntax:"+bid)}
 initialSource.set(bid,source);rows.push({key,bid,oldHash,newHash,oldPath,newPath});
}
if(fails.length)return{operation:ID,status:"BLOCKED",noWrite:true,failures:fails,rows};
const installed=[],rollbackErrors=[],beforeLedger=JSON.stringify(state);
try {
 for(const [key,id,bid,oldPath,newPath,oldHash,newHash] of FIXES){
  const b=Array.from(game.scenes.get(id).regions).flatMap(r=>Array.from(r.behaviors)).find(x=>x.id===bid);
  if(await sha(b.system.source)!==oldHash)throw Error("prewrite drift:"+bid);
  await b.update({"system.source":initialSource.get(bid).replaceAll(oldPath,newPath)});
  installed.push({bid,id,oldHash,newHash});
  if(await sha(b.system?.source??"")!==newHash)throw Error("postwrite drift:"+bid);
 }
 let r=0,n=0;for(const id of IDS){const scene=game.scenes.get(id);r+=scene.regions.size;n+=Array.from(scene.regions).reduce((sum,re)=>sum+re.behaviors.size,0);}
 if(r!==202||n!==115||JSON.stringify(ledger.getFlag("world","dicebox")?.state??{})!==beforeLedger)throw Error("postwrite global state drift");
 return{operation:ID,status:"PASS",noGameplayCanary:true,applied:installed,regions:r,behaviors:n,independentFinalVerifyRequired:true};
}catch(error){
 for(const [key,id,bid,oldPath,newPath,oldHash] of FIXES.slice().reverse()){
  if(!installed.some(x=>x.bid===bid))continue;
  const b=Array.from(game.scenes.get(id).regions).flatMap(r=>Array.from(r.behaviors)).find(x=>x.id===bid);
  try{await b.update({"system.source":initialSource.get(bid)});if(await sha(b.system?.source??"")!==oldHash)throw Error("restore hash drift")}catch(e){rollbackErrors.push({bid,error:String(e)})}
 }
 return{operation:ID,status:rollbackErrors.length?"OUTCOME_UNKNOWN_ROLLBACK_INCOMPLETE":"FAIL_ROLLBACK_COMPLETE",error:String(error),rollbackErrors,appliedCount:installed.length};
}