const all=Array.from(game.scenes);
const counts={gameScenes:all.length,regionCount:all.reduce((n,s)=>n+s.regions.size,0),behaviorCount:all.reduce((n,s)=>n+Array.from(s.regions).reduce((j,r)=>j+r.behaviors.size,0),0),
 previousCL90Names:all.filter(s=>s.getFlag('world','dicebox')?.campaignId==='central-lodge').length};
const ledger=game.journal.get('xhlXv6CCH34HVga3')?.getFlag('world','dicebox')?.state;
const kernel=game.macros.get('FHQiFYx6OntZVo9d');
const ksha=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(String(kernel?.command??'')))),x=>x.toString(16).padStart(2,'0')).join('');
return {noWrite:true,counts,ledgerRevision:ledger?.revision,clockSolved:ledger?.puzzles?.m1?.clockSettingResolved,
 emblemInstalled:ledger?.puzzles?.m1?.silverFamilyEmblemInstalled,ksha,
 foundry:game.version,world:game.world.id,system:game.system.id,systemVersion:game.system.version,executor:game.user.name};
