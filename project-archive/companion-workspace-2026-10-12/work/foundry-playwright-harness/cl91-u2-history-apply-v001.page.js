// U2 CL91 guarded source install, exact Foundry 14.367 target, one RegionBehavior only.
const SHA=async x=>Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(String(x)))),b=>b.toString(16).padStart(2,'0')).join('');
if(game.version!=='14.367'||game.world.id!=='the-lost-mine-of-phandalin'||game.system.id!=='dnd5e'||game.system.version!=='5.3.3'
 ||!game.user.isGM||game.user.name!=='Assistant Gamemaster'||game.users.some(u=>u.active&&!u.isGM))
 throw Error('CL91_WRONG_STACK_OR_ACTIVE_PLAYERS');
const ledger=game.journal.get('xhlXv6CCH34HVga3')?.getFlag('world','dicebox')?.state;
if(ledger?.revision!==2||await SHA(JSON.stringify(ledger))!=='7feef0b3823ed64e52eaecd2fbe886d020a0a8b92dda2c54a334bbc8017d38f7'
||ledger?.puzzles?.u2?.servantHistoryObserved!==false||ledger?.puzzles?.u2?.servantHistoryInterpreted!==false)
throw Error('CL91_LEDGER_DRIFT');
const canonical=["0CSBwzcszPKyaB8u","5K1uASAARnX8aZhP","EDdktL7VUihbpKe9","UNySMm7YkyYfh41x","Zq8iXByDVhHRbA7w","sI4YVZZChgey1qNi","iqfCcDpEer4pwrJj","DLcheEi6e5OHOYmU","U8S5ZrTjaPIkTUIL","JZkxX6lUQe8Nc8xJ","LXTA8mx1rJ2L6e2J","MAbLfBqG7qIVVuLN","4pc5akMBieHU7GvV","pHQvDUDlyWZFuNrX","if9iWDRjSwI87EeX","PVf6Gbrv9HbB88uZ","La9krMOMBhAhDLi6","ImeIdHbYb6kZKAdt","ez9MSQ8QIO4cW6zo","aIKQmFiuXWipEdyb","HWitOe1wSid7MZ1y"].map(id=>game.scenes.get(id));
if(canonical.some(s=>!s)||canonical.reduce((n,s)=>n+s.regions.size,0)!==202||
canonical.reduce((n,s)=>n+[...s.regions].reduce((j,r)=>j+r.behaviors.size,0),0)!==117)
throw Error('CL91_ROSTER_DRIFT');
const scene=game.scenes.get('PVf6Gbrv9HbB88uZ'),region=scene?.regions.get('qa4n4o834OZTKPoV');
const original=region?.behaviors.get('J11ZvQh4lqzEsvRi');
if(!region||region.behaviors.size!==1||region.getFlag('world','dicebox')?.stableId!=='dbx:central-lodge:u2:region:u2-servant-history'
 ||original?.disabled||await SHA(original?.system?.source??'')!=='f815c0920579b163800a7bf5548d252dad398aeb245e90c48ce5363b0defd372')
throw Error('CL91_U2_ORIGINAL_DRIFT');
const kernel=game.macros.get('FHQiFYx6OntZVo9d');
if(await SHA(kernel?.command??'')!=='6264c467211d4f5c94cfaaa9437eae88582599061b9d8a4951391830a3e8f814')
throw Error('CL91_KERNEL_DRIFT');
for(const [regionId,behaviorId,key] of [
 ['UsCSlj3KWoPGpT5L','5kg4pLVIvyQJRQIK','u2.servant-room-absence'],
 ['UXQMAhtVpmZVrwsR','Vmdk1xKIRFD3ppU2','u2.nursery-contradiction']
]){
 const b=scene.regions.get(regionId)?.behaviors.get(behaviorId);
 if(!b||b.disabled||!String(b.system?.source??'').includes('"noticeKey":"'+key+'"'))throw Error('CL91_NOTICE_DRIFT:'+key);
}
const stableId='dbx:central-lodge:u2:behavior:servant-history-interpretation-v001';
if(game.scenes.some(s=>s.regions.some(r=>r.behaviors.some(b=>b.getFlag('world','dicebox')?.stableId===stableId))))
throw Error('CL91_DUPLICATE_BEHAVIOR');
const source="// CL91 authored U2 household-history interpretation, Foundry 14.367 RegionBehavior.\n// Source-only until exact preview and guarded installation. No items, walls, travel, or scene edits.\n// Deliberate full party evidence visited, not succeeded Notice rolls.\nconst SCENE_ID=\"PVf6Gbrv9HbB88uZ\",REGION_ID=\"qa4n4o834OZTKPoV\",LEDGER_ID=\"xhlXv6CCH34HVga3\";\nif(event?.name!==\"tokenMoveIn\"||event?.region?.id!==REGION_ID)return;\nconst primary=game.users.filter(u=>u.active&&u.isGM).sort((a,b)=>a.id.localeCompare(b.id))[0];\nif(!game.user?.isGM||primary?.id!==game.user.id)return;\nconst scene=game.scenes.get(SCENE_ID),region=scene?.regions.get(REGION_ID);\nconst token=event?.data?.token??null,movement=event?.data?.movement??null,actor=token?.actor??null,requester=event?.user??null;\nif(!scene||!region||!token||token.parent?.id!==SCENE_ID||!actor||!requester?.active)return;\nif(!movement?.id||!movement.origin||!movement.destination||typeof movement.finished?.then!==\"function\")return;\nconst from=movement.origin,to=movement.destination;\nif(![from.x,from.y,to.x,to.y].every(Number.isFinite)||(from.x===to.x&&from.y===to.y))return;\nif(!requester.isGM&&!actor.testUserPermission(requester,CONST.DOCUMENT_OWNERSHIP_LEVELS.OWNER))return;\nconst ledger=game.journal.get(LEDGER_ID);\nconst state=()=>ledger?.getFlag(\"world\",\"dicebox\")?.state??null;\nconst noticesAttempted=(key,s)=>Object.values(s?.notices?.[key]??{}).some(x=>x?.attempted===true);\nconst eligible=()=>{\n const s=state();\n return s?.puzzles?.u2?.servantHistoryObserved===true &&\n  s?.puzzles?.u2?.servantHistoryInterpreted===false &&\n  noticesAttempted(\"u2.servant-room-absence\",s) &&\n  noticesAttempted(\"u2.nursery-contradiction\",s);\n};\nif(!ledger||!eligible())return;\nconst kernel=game.macros.find(m=>m.getFlag?.(\"world\",\"dicebox\")?.stableId===\"dbx:central-lodge:macro:runtime\");\nif(!kernel||typeof kernel.execute!==\"function\")return;\nconst lock=globalThis.__diceboxU2HistoryInterpretationLock??={inFlight:false};\nif(lock.inFlight)return;\nlock.inFlight=true;\ntry{\n let finished=false;\n try{finished=await movement.finished}catch(e){return}\n if(finished!==true)return;\n const current=game.scenes.get(SCENE_ID)?.tokens.get(token.id);\n if(!current||current.actor?.id!==actor.id||current.x!==to.x||current.y!==to.y)return;\n if(!requester.active||(!requester.isGM&&!actor.testUserPermission(requester,CONST.DOCUMENT_OWNERSHIP_LEVELS.OWNER)))return;\n if(!eligible())return; // Re-evaluate live state after movement completes.\n const result=await kernel.execute({actor,token,event,speaker:{dicebox:{\n  contract:\"dicebox-region-behavior/v1\",action:\"observe\",trigger:\"TOKEN_MOVE_IN\",\n  observationKey:\"u2.household-history-interpreted\",oncePerActor:false,\n  statePath:\"puzzles.u2.servantHistoryInterpreted\",value:true,\n  message:\"<p>The cleared servants’ rooms, traces of work, and nursery objects that seem recently arranged cannot all be explained by simple abandonment. Someone handled these rooms after the household’s usual routine ended. Who did so, and why, remain unknown.</p>\"\n }}});\n if(result?.status!==\"PASS\"||state()?.puzzles?.u2?.servantHistoryInterpreted!==true)\n  console.error(\"[CL91 U2] Authoritative interpretation result unverified; do not replay blindly.\",result?.status);\n}finally{lock.inFlight=false}\n";
const expectedSourceHash="19be76e4ebdcde423e6b4dd009723876544e5c4d696a8f050a05bbeaf3778758",expectedStoredHash="11bbc0837bf1a4ccc20c62b523f8b9acc1061078a585a1f7e36de5cc303c4b32";
if(await SHA(source)!==expectedSourceHash||!source.endsWith("\n"))throw Error('CL91_STAGED_SOURCE_HASH_DRIFT');
const payload={name:"DiceBox U2 — Household History Interpretation",type:"executeScript",disabled:false,
 system:{events:["tokenMoveIn"],source},
 flags:{world:{dicebox:{stableId,owner:"central-lodge",version:"cl91-u2-history-v001"}}}};
const created=await region.createEmbeddedDocuments('RegionBehavior',[payload]);
if(created?.length!==1)throw Error('CL91_CREATE_OUTCOME_UNKNOWN');
const installed=scene.regions.get(region.id).behaviors.filter(b=>b.getFlag('world','dicebox')?.stableId===stableId);
if(installed.length!==1||installed[0].disabled||!installed[0].system?.events?.has('tokenMoveIn')||
 installed[0].system.source!==source.slice(0,-1)||await SHA(installed[0].system.source)!==expectedStoredHash)
throw Error('CL91_POST_CREATE_OUTCOME_UNKNOWN_DO_NOT_REPLAY');
return {operation:'cl91-u2-history-apply-v001',noWrite:false,status:'PASS',behaviorId:installed[0].id,
 sourceSha:expectedStoredHash,ledgerRevision:game.journal.get('xhlXv6CCH34HVga3')?.getFlag('world','dicebox')?.state?.revision};
