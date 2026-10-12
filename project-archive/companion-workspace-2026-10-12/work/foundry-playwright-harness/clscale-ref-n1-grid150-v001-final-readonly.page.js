const s=game.scenes.get('MAbLfBqG7qIVVuLN'),ledger=game.journal.get('xhlXv6CCH34HVga3')?.getFlag('world','dicebox')?.state;
const H=async v=>Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(JSON.stringify(v)))),b=>b.toString(16).padStart(2,'0')).join('');
const now=s.toObject(),normal=JSON.parse(JSON.stringify(now)),tok=s.tokens.get('DOCKvaCKDr8MUP8S');
normal.grid.size=120;normal._stats.modifiedTime=1791351693469;normal._stats.lastModifiedBy="JESWV6CcU7m07VW6";
const valid=now.grid.size===150&&await H(normal)==='1ccb5122328a6032a9a3164943c3c599d7bca0d674a9bfd206f9a99f8ef59413'&&tok?.x===3207&&tok?.y===1079&&tok?.width===1&&tok?.height===1&&ledger?.revision===13&&await H(ledger)==='ec3f1a02887b80a342653681d217d357f7bb7f5b44fa436555d57bf12c44cfd4';
return{operation:'clscale-ref-n1-grid150-v001-final',noWrite:true,status:valid?'PASS_FULL_SOURCE_AND_TOKEN':'BLOCKED_DRIFT',grid:now.grid.size,sourceSHA:await H(now),normalSHA:await H(normal),token:tok?{id:tok.id,x:tok.x,y:tok.y}:null,tokenCount:s.tokens.size,regionCount:s.regions.size,walls:s.walls.size,lights:s.lights.size,ledgerSHA:await H(ledger),ledgerRev:ledger?.revision};
