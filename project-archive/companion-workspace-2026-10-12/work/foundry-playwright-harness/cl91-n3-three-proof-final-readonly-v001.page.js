// CL91 N3 three-proof post-install independent read-only validator.
const SHA=async x=>Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(String(x??'')))),b=>b.toString(16).padStart(2,'0')).join('');
const IDs=["0CSBwzcszPKyaB8u","5K1uASAARnX8aZhP","EDdktL7VUihbpKe9","UNySMm7YkyYfh41x","Zq8iXByDVhHRbA7w","sI4YVZZChgey1qNi","iqfCcDpEer4pwrJj","DLcheEi6e5OHOYmU","U8S5ZrTjaPIkTUIL","JZkxX6lUQe8Nc8xJ","LXTA8mx1rJ2L6e2J","MAbLfBqG7qIVVuLN","4pc5akMBieHU7GvV","pHQvDUDlyWZFuNrX","if9iWDRjSwI87EeX","PVf6Gbrv9HbB88uZ","La9krMOMBhAhDLi6","ImeIdHbYb6kZKAdt","ez9MSQ8QIO4cW6zo","aIKQmFiuXWipEdyb","HWitOe1wSid7MZ1y"].map(i=>game.scenes.get(i));
const all=IDs.filter(Boolean).flatMap(s=>[...s.regions].flatMap(r=>r.behaviors.contents));
const stable=new Set(all.map(b=>b.getFlag('world','dicebox')?.stableId));
const scene=game.scenes.get('pHQvDUDlyWZFuNrX'),region=scene?.regions.get('RP1jYOH738xl9hks');
const gate=region?.behaviors.contents[0];
const s=String(gate?.system?.source??'');
const sh=region?.shapes?.[0];
const ledger=game.journal.get('xhlXv6CCH34HVga3')?.getFlag('world','dicebox')?.state;
const t3=game.scenes.get('aIKQmFiuXWipEdyb')?.regions.get('YElrtisbXN3DJ2Sw');
const named=(rid,bid)=>scene?.regions.get(rid)?.behaviors.get(bid);
const facts={
 behaviors:all.length,disabled:all.filter(b=>b.disabled).length,stableIds:stable.size,
 sceneCount:IDs.length,missingScenes:IDs.filter(s=>!s).length,regionCount:IDs.reduce((n,s)=>n+(s?.regions.size??0),0),
 items:game.items.filter(i=>i.getFlag('world','dicebox')?.stableId?.startsWith('dbx:central-lodge:item:')).length,
 gateId:gate?.id,gateEnabled:gate?!gate.disabled:false,gateStableId:gate?.getFlag('world','dicebox')?.stableId,
 gateSha:await SHA(s),flagSha:gate?.getFlag('world','dicebox')?.sourceHash,
 gateEvents:gate?.system?.events?Array.from(gate.system.events):[],gateCount:region?.behaviors?.size,
 branchStableId:region?.getFlag('world','dicebox')?.stableId,
 geometry:{type:sh?.type,x:sh?.x,y:sh?.y,width:sh?.width,height:sh?.height,rotation:sh?.rotation,hole:sh?.hole},
 ledgerRevision:ledger?.revision,ledgerSha:await SHA(JSON.stringify(ledger)),ledgerFlags:{board:ledger?.puzzles?.n3?.departureBoardResolved,wheel:ledger?.puzzles?.n3?.switchWheelInstalled,overlay:ledger?.puzzles?.n3?.routeOverlay?.resolved,unlocked:ledger?.puzzles?.n3?.t3BranchUnlocked},
 kernelSha:await SHA(game.macros.get('FHQiFYx6OntZVo9d')?.command??''),
 boardSha:await SHA(named('eNrbnN68TYvMaBcT','XItPpdHkojcs2C3v')?.system?.source),
 wheelSha:await SHA(named('7el4eN3Uwzxy7Wmi','6C5fkKasc9DWK1Sa')?.system?.source),
 overlaySha:await SHA(named('VE8p4CvgzqvhihuF','CAGlvXbm6uLupoRw')?.system?.source),
 m1ClockSha:await SHA(game.scenes.get('U8S5ZrTjaPIkTUIL')?.regions.get('3tIrR12uv8ppFkOb')?.behaviors.contents[0]?.system?.source),
 m2PortraitSha:await SHA(game.scenes.get('JZkxX6lUQe8Nc8xJ')?.regions.get('FRY091GwobgD2M5i')?.behaviors.get('IdriZEGhxUY9whcV')?.system?.source),
 u2HistorySha:await SHA(game.scenes.get('PVf6Gbrv9HbB88uZ')?.regions.get('qa4n4o834OZTKPoV')?.behaviors.get('WOiGF1WlGZM3fO8I')?.system?.source),
 t3ReturnBehaviors:t3?.behaviors.size,
 containsTeleport:/teleportToken|pullUsers|spawnTokens|\.update\(|createEmbeddedDocuments|Scene\.create/i.test(s)
};
const g=facts.geometry;
const ok=facts.behaviors===119&&facts.disabled===1&&facts.stableIds===119
 &&facts.sceneCount===21&&facts.missingScenes===0&&facts.regionCount===202&&facts.items===33
 &&facts.gateEnabled&&facts.gateCount===1
 &&facts.gateStableId==='dbx:central-lodge:n3:behavior:t3-branch-three-proof-unlock-v001'
 &&facts.gateSha==='3ae5572a2e6df1e2a2611630163b90e73450ba400acd0a9d38ab4d4a2e6d4cbd'
 &&facts.flagSha===facts.gateSha&&facts.gateEvents.length===1&&facts.gateEvents[0]==='tokenEnter'
 &&facts.branchStableId==='dbx:central-lodge:n3:region:n3-branch-railway'
 &&g?.type==='rectangle'&&g.x===2310&&g.y===2380&&g.width===620&&g.height===500&&g.rotation===0&&g.hole===false
 &&facts.ledgerRevision===2&&facts.ledgerSha==='7feef0b3823ed64e52eaecd2fbe886d020a0a8b92dda2c54a334bbc8017d38f7'
 &&Object.values(facts.ledgerFlags).every(x=>x===false)
 &&facts.kernelSha==='6264c467211d4f5c94cfaaa9437eae88582599061b9d8a4951391830a3e8f814'
 &&facts.boardSha==='063b00971b8576c5c4d6dda2ae56171e2126b2ae527c0637cae0f1bcd466234c'
 &&facts.wheelSha==='5210cb20045f8d93724dc14eebeb006f41a533298661d158cccabbff173d1c3b'
 &&facts.overlaySha==='e55af15f2d7ac960e283519f4fae3ed97748d7fcd3f7e0f598843b7be05753c0'
 &&facts.m1ClockSha==='5ee8f97403d5144cbacf64e57ea58862bf4daf4ec4643088531e7f27e12ac997'
 &&facts.m2PortraitSha==='4b341ee93374af01b64b07061b4f509ea701d5cd2b1d02f8ee98562a17f98cf6'
 &&facts.u2HistorySha==='11bbc0837bf1a4ccc20c62b523f8b9acc1061078a585a1f7e36de5cc303c4b32'
 &&facts.t3ReturnBehaviors===1&&!facts.containsTeleport;
return {operation:'cl91-n3-three-proof-final-readonly-v001',noWrite:true,status:ok?'PASS_SOURCE_INSTALLED_NO_PLAYER_TEST':'BLOCKED_FINAL_REREAD',facts};
