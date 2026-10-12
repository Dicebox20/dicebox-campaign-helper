const scene=game.scenes.get('JZkxX6lUQe8Nc8xJ');
const js=scene?.toObject();
const sha=async t=>Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(String(t)))),b=>b.toString(16).padStart(2,'0')).join('');
const ledger=game.journal.get('xhlXv6CCH34HVga3')?.getFlag('world','dicebox')?.state;
return{operation:'clscale-m2-full-scene-backup-readonly-v001',noWrite:true,identity:{version:game.version,world:game.world.id,user:game.user?.name,nonGMs:game.users.filter(x=>x.active&&!x.isGM).map(x=>x.name)},
 scene:js,originalSha:await sha(JSON.stringify(js)),ledgerRevision:ledger?.revision,ledgerSHA:await sha(JSON.stringify(ledger))};
