// C2 Cult Undercroft independent no-write scale gate, from canonical author-approved calibration.
const s=game.scenes.get('UNySMm7YkyYfh41x');
if(!game.ready||!s)throw Error('C2_NOT_READY');
const doors=s.walls.filter(w=>Number(w.door)>0).map(w=>({id:w.id,pixels:Math.hypot(w.c[2]-w.c[0],w.c[3]-w.c[1]),door:w.door}));
const shapes=[...s.regions].flatMap(r=>r.shapes.map(q=>({region:r.id,type:q.type,width:q.width??null,height:q.height??null,radius:q.radius??null})));
const ledger=game.journal.get('xhlXv6CCH34HVga3')?.getFlag('world','dicebox')?.state;
const H=async v=>Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(String(v)))),b=>b.toString(16).padStart(2,'0')).join('');
return {operation:'clscale-c2-clearance-readonly-v001',noWrite:true,scene:{id:s.id,name:s.name,grid:{size:s.grid.size,type:s.grid.type,distance:s.grid.distance,units:s.grid.units},width:s.width,height:s.height,padding:s.padding,active:s.active,tokenCount:s.tokens.size,wallCount:s.walls.size,regionCount:s.regions.size,lightCount:s.lights.size,tileCount:s.tiles.size},doors,regionShapes:shapes,sceneSHA:await H(JSON.stringify(s.toObject())),ledgerRevision:ledger?.revision,ledgerSHA:await H(JSON.stringify(ledger)),user:{id:game.user.id,name:game.user.name,isGM:game.user.isGM},activeNonGM:game.users.filter(u=>u.active&&!u.isGM).map(u=>u.id)};
