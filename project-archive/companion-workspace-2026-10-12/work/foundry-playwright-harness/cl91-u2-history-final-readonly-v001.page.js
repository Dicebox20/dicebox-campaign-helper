// Independent no-write CL91 U2 interpretation behavior final verification.
const sha=async s=>Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(String(s)))),v=>v.toString(16).padStart(2,'0')).join('');
const ids=["0CSBwzcszPKyaB8u","5K1uASAARnX8aZhP","EDdktL7VUihbpKe9","UNySMm7YkyYfh41x","Zq8iXByDVhHRbA7w","sI4YVZZChgey1qNi","iqfCcDpEer4pwrJj","DLcheEi6e5OHOYmU","U8S5ZrTjaPIkTUIL","JZkxX6lUQe8Nc8xJ","LXTA8mx1rJ2L6e2J","MAbLfBqG7qIVVuLN","4pc5akMBieHU7GvV","pHQvDUDlyWZFuNrX","if9iWDRjSwI87EeX","PVf6Gbrv9HbB88uZ","La9krMOMBhAhDLi6","ImeIdHbYb6kZKAdt","ez9MSQ8QIO4cW6zo","aIKQmFiuXWipEdyb","HWitOe1wSid7MZ1y"].map(id=>game.scenes.get(id));
const scene=game.scenes.get('PVf6Gbrv9HbB88uZ'),region=scene?.regions.get('qa4n4o834OZTKPoV');
const original=region?.behaviors.get('J11ZvQh4lqzEsvRi');
const b=region?.behaviors.filter(x=>x.getFlag('world','dicebox')?.stableId==='dbx:central-lodge:u2:behavior:servant-history-interpretation-v001')??[];
const ledger=game.journal.get('xhlXv6CCH34HVga3')?.getFlag('world','dicebox')?.state;
const counts={scene:ids.length,missing:ids.filter(s=>!s).length,
 regions:ids.reduce((n,s)=>n+(s?.regions.size??0),0),
 behaviors:ids.reduce((n,s)=>n+(s?[...s.regions].reduce((m,r)=>m+r.behaviors.size,0):0),0),
 items:game.items.filter(i=>i.getFlag('world','dicebox')?.stableId?.startsWith('dbx:central-lodge:item:')).length};
const evidence={behaviorId:b[0]?.id,newBehaviorSha:await sha(b[0]?.system?.source??''),type:b[0]?.type,
 enabled:b[0]? !b[0].disabled:false,events:b[0]?.system?.events?Array.from(b[0].system.events):[],
 originalU2Sha:await sha(original?.system?.source??''),
 clockSha:await sha(game.scenes.get('U8S5ZrTjaPIkTUIL')?.regions.get('3tIrR12uv8ppFkOb')?.behaviors.contents[0]?.system?.source??''),
 m2PortraitSha:await sha(game.scenes.get('JZkxX6lUQe8Nc8xJ')?.regions.get('FRY091GwobgD2M5i')?.behaviors.get('IdriZEGhxUY9whcV')?.system?.source??''),
 ledgerRevision:ledger?.revision,ledgerSha:await sha(JSON.stringify(ledger)),
 originalObserved:ledger?.puzzles?.u2?.servantHistoryObserved, interpreted:ledger?.puzzles?.u2?.servantHistoryInterpreted,
 originalM2Opened:ledger?.puzzles?.m2?.founderPortraitOpened, oldEstateSurveyRecovered:ledger?.items?.['old-estate-survey']?.recovered,
 kernelSha:await sha(game.macros.get('FHQiFYx6OntZVo9d')?.command??'')};
const ok=counts.missing===0&&counts.regions===202&&counts.behaviors===118&&counts.items===33&&region?.behaviors.size===2&&b.length===1&&evidence.enabled&&evidence.type==='executeScript'
&&evidence.events.length===1&&evidence.events[0]==='tokenMoveIn'
&&evidence.newBehaviorSha==='11bbc0837bf1a4ccc20c62b523f8b9acc1061078a585a1f7e36de5cc303c4b32'
&&evidence.originalU2Sha==='f815c0920579b163800a7bf5548d252dad398aeb245e90c48ce5363b0defd372'
&&evidence.clockSha==='5ee8f97403d5144cbacf64e57ea58862bf4daf4ec4643088531e7f27e12ac997'
&&evidence.m2PortraitSha==='bbf7de80e832e453ff9c284b36194a42a7190d18847e29be1d5b49b654a09ec2'
&&evidence.ledgerRevision===2&&evidence.ledgerSha==='7feef0b3823ed64e52eaecd2fbe886d020a0a8b92dda2c54a334bbc8017d38f7'
&&evidence.originalObserved===false&&evidence.interpreted===false&&evidence.originalM2Opened===false&&evidence.oldEstateSurveyRecovered===false
&&evidence.kernelSha==='6264c467211d4f5c94cfaaa9437eae88582599061b9d8a4951391830a3e8f814';
return {operation:'cl91-u2-history-final-readonly-v001',noWrite:true,status:ok?'PASS_SOURCE_INSTALLED_NO_PLAYER_TEST':'BLOCKED_READBACK',counts,evidence};
