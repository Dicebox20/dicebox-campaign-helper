const s=game.scenes.get('HWitOe1wSid7MZ1y'),ledger=game.journal.get('xhlXv6CCH34HVga3')?.getFlag('world','dicebox')?.state;
const H=async v=>Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(JSON.stringify(v)))),b=>b.toString(16).padStart(2,'0')).join('');
const now=s.toObject(),normal=JSON.parse(JSON.stringify(now)),tok=s.tokens.get('0bla5bPSctNDRT6s');
normal.grid.size=120;normal._stats.modifiedTime=1791351732808;normal._stats.lastModifiedBy="JESWV6CcU7m07VW6";
const valid=now.grid.size===240&&await H(normal)==='f2b20ebe6b1ccd788fd77f16f8a6887459a978a968259d838c2902aa4fd04680'&&tok?.x===2101&&tok?.y===2267&&tok?.width===1&&tok?.height===1&&ledger?.revision===13&&await H(ledger)==='ec3f1a02887b80a342653681d217d357f7bb7f5b44fa436555d57bf12c44cfd4';
return{operation:'clscale-ref-f2-grid240-v001-final',noWrite:true,status:valid?'PASS_FULL_SOURCE_AND_TOKEN':'BLOCKED_DRIFT',grid:now.grid.size,sourceSHA:await H(now),normalSHA:await H(normal),token:tok?{id:tok.id,x:tok.x,y:tok.y}:null,tokenCount:s.tokens.size,regionCount:s.regions.size,walls:s.walls.size,lights:s.lights.size,ledgerSHA:await H(ledger),ledgerRev:ledger?.revision};
