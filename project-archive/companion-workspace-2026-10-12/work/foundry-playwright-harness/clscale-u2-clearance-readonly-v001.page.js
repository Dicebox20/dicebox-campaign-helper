// U2 Servants/Nursery/Attic read-only clearance + story schema preflight.
const s=game.scenes.get('PVf6Gbrv9HbB88uZ');
if(!game.ready||!s)throw Error('U2_NOT_READY');
const doors=[...s.walls].filter(w=>Number(w.door)>0).map(w=>({id:w.id,pixels:Math.hypot(w.c[2]-w.c[0],w.c[3]-w.c[1]),door:w.door}));
const shapes=[...s.regions].flatMap(r=>[...r.shapes].map(q=>({region:r.id,type:q.type,width:q.width??null,height:q.height??null})));
const ledger=game.journal.get('xhlXv6CCH34HVga3')?.getFlag('world','dicebox')?.state;
const H=async v=>Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(String(v)))),b=>b.toString(16).padStart(2,'0')).join('');
const snippets=[...s.regions].flatMap(r=>[...r.behaviors].filter(b=>['WOiGF1WlGZM3fO8I','J11ZvQh4lqzEsvRi'].includes(b.id)).map(b=>({id:b.id,region:r.id,disabled:b.disabled,sourceLength:JSON.stringify(b.toObject()).length})));
return {operation:'clscale-u2-clearance-readonly-v001',noWrite:true,scene:{id:s.id,name:s.name,grid:{size:s.grid.size,type:s.grid.type,distance:s.grid.distance,units:s.grid.units},width:s.width,height:s.height,padding:s.padding,active:s.active,tokens:s.tokens.size,walls:s.walls.size,regions:s.regions.size,lights:s.lights.size},doors,regionShapes:shapes,storyBehaviors:snippets,storyLedger:ledger?.puzzles?.u2,sceneSHA:await H(JSON.stringify(s.toObject())),ledgerRevision:ledger?.revision,ledgerSHA:await H(JSON.stringify(ledger)),nonGM:game.users.filter(u=>u.active&&!u.isGM).map(u=>u.id)};
