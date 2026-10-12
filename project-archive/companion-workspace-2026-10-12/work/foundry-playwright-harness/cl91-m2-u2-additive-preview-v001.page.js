// CL91 M2/U2 additive ledger schema migration PREVIEW, NO MUTATION
const SHA=async s=>Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(s))),b=>b.toString(16).padStart(2,'0')).join('');
const id="xhlXv6CCH34HVga3",ledger=game.journal.get(id),state=ledger?.getFlag("world","dicebox")?.state;
const m2=game.scenes.get("JZkxX6lUQe8Nc8xJ")?.regions.get("FRY091GwobgD2M5i")?.behaviors.get("IdriZEGhxUY9whcV");
const u2scene=game.scenes.get("PVf6Gbrv9HbB88uZ");
const u2=u2scene?.regions.find(r=>r.behaviors.has("J11ZvQh4lqzEsvRi"))?.behaviors.get("J11ZvQh4lqzEsvRi");
const expectedKeys={m2:"founderPortraitOpened",u2:"servantHistoryObserved"};
const absentM2=state?.puzzles?.m2&&!Object.hasOwn(state.puzzles.m2,expectedKeys.m2);
const absentU2=state?.puzzles?.u2&&!Object.hasOwn(state.puzzles.u2,expectedKeys.u2);
const owned=ledger?.getFlag("world","dicebox")?.stableId;
const activePlayers=game.users.filter(x=>x.active&&!x.isGM).map(x=>x.name);
const scenes=["0CSBwzcszPKyaB8u","5K1uASAARnX8aZhP","EDdktL7VUihbpKe9","UNySMm7YkyYfh41x","Zq8iXByDVhHRbA7w","sI4YVZZChgey1qNi","iqfCcDpEer4pwrJj","DLcheEi6e5OHOYmU","U8S5ZrTjaPIkTUIL","JZkxX6lUQe8Nc8xJ","LXTA8mx1rJ2L6e2J","MAbLfBqG7qIVVuLN","4pc5akMBieHU7GvV","pHQvDUDlyWZFuNrX","if9iWDRjSwI87EeX","PVf6Gbrv9HbB88uZ","La9krMOMBhAhDLi6","ImeIdHbYb6kZKAdt","ez9MSQ8QIO4cW6zo","aIKQmFiuXWipEdyb","HWitOe1wSid7MZ1y"].map(x=>game.scenes.get(x));
const count={scenes:scenes.length,missingScenes:scenes.filter(s=>!s).length,regions:scenes.reduce((n,s)=>n+(s?.regions.size??0),0),behaviors:scenes.reduce((n,s)=>n+(s?[...s.regions].reduce((m,r)=>m+r.behaviors.size,0):0),0)};
const m2sha=await SHA(String(m2?.system?.source??'')),u2sha=await SHA(String(u2?.system?.source??''));
const passes=game.version==="14.367"&&game.world.id==="the-lost-mine-of-phandalin"&&game.user?.name==="Assistant Gamemaster"&&game.user?.isGM&&game.system?.version==="5.3.3"
 &&ledger&&owned==="dbx:central-lodge:ledger"&&state?.revision===1
 &&state?.puzzles?.m2?.founderPortraitObserved===false&&state?.puzzles?.u2?.servantHistoryInterpreted===false
 &&absentM2&&absentU2&&activePlayers.length===0&&count.missingScenes===0&&count.regions===202&&count.behaviors===117
 &&String(m2?.system?.source??'').includes('"statePath":"puzzles.m2.founderPortraitOpened"')
 &&String(u2?.system?.source??'').includes('"statePath":"puzzles.u2.servantHistoryObserved"');
return {operation:"cl91.m2-u2-additive-preview-v001",noWrite:true,status:passes?"PASS_STAGED":"BLOCKED",
 stack:{world:game.world.id,foundry:game.version,system:game.system.version,user:game.user.name},count,
 ledger:{id:ledger?.id,stableId:owned,revision:state?.revision,sha:state?await SHA(JSON.stringify(state)):null,keys:{m2:Object.keys(state?.puzzles?.m2??{}),u2:Object.keys(state?.puzzles?.u2??{})},
 absentM2:Boolean(absentM2),absentU2:Boolean(absentU2),originalM2Observed:state?.puzzles?.m2?.founderPortraitObserved,originalU2Interpreted:state?.puzzles?.u2?.servantHistoryInterpreted},
 source:{m2BehaviorId:m2?.id,m2Sha:m2sha,u2BehaviorId:u2?.id,u2Sha:u2sha},
 activeNonGMs:activePlayers,sourceCodeChangesRequired:false};
