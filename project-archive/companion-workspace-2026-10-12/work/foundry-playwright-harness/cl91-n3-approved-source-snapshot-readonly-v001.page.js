const SHA=async x=>Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(String(x??'')))),b=>b.toString(16).padStart(2,'0')).join('');
const s=game.scenes.get('pHQvDUDlyWZFuNrX'),r=s?.regions.get('RP1jYOH738xl9hks');
const ledger=game.journal.get('xhlXv6CCH34HVga3')?.getFlag('world','dicebox')?.state;
const specs=[['board','eNrbnN68TYvMaBcT','XItPpdHkojcs2C3v'],['wheel','7el4eN3Uwzxy7Wmi','6C5fkKasc9DWK1Sa'],['overlay','VE8p4CvgzqvhihuF','CAGlvXbm6uLupoRw']];
const proof=[];
for(const [kind,regionId,behaviorId] of specs){
 const b=s?.regions.get(regionId)?.behaviors.get(behaviorId);
 proof.push({kind,regionId,behaviorId,enabled:b?!b.disabled:false,stableId:b?.getFlag('world','dicebox')?.stableId,sourceSHA:await SHA(b?.system?.source??'')});
}
const tokens=game.users.filter(u=>u.active&&!u.isGM).map(u=>u.id);
return{operation:'cl91-n3-approved-source-snapshot-readonly-v001',noWrite:true,stack:{foundry:game.version,dnd:game.system.version,world:game.world.id,GM:game.user.id},
branch:{id:r?.id,stableId:r?.getFlag('world','dicebox')?.stableId,behaviors:r?.behaviors.size,shapes:r?.shapes.map(x=>x.toObject?.()??x)},
ledger:{revision:ledger?.revision,sha:await SHA(JSON.stringify(ledger)),three:{board:ledger?.puzzles?.n3?.departureBoardResolved,wheel:ledger?.puzzles?.n3?.switchWheelInstalled,overlay:ledger?.puzzles?.n3?.routeOverlay?.resolved,unlocked:ledger?.puzzles?.n3?.t3BranchUnlocked}},
proof,kernelSHA:await SHA(game.macros.get('FHQiFYx6OntZVo9d')?.command??''),activeNonGMs:tokens};
