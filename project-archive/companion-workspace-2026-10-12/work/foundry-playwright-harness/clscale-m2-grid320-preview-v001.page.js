// CL-SCALE M2 120 to 320 px grid-only. Exact source/ledger/actor checks. One live Scene update.
const SHA=async x=>Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(String(x)))),b=>b.toString(16).padStart(2,'0')).join('');
const scene=game.scenes.get('JZkxX6lUQe8Nc8xJ'),ledger=game.journal.get('xhlXv6CCH34HVga3')?.getFlag('world','dicebox')?.state;
if(game.version!=='14.367'||game.world.id!=='the-lost-mine-of-phandalin'||game.system.id!=='dnd5e'||game.system.version!=='5.3.3'
 ||game.user?.name!=='Assistant Gamemaster'||!game.user?.isGM||game.users.some(u=>u.active&&!u.isGM))throw Error('STOP_STACK_OR_PLAYER_DRIFT');
if(!scene||scene.active||scene.grid?.size!==120||scene.grid.type!==0||scene.grid.distance!==5||scene.grid.units!=='ft'
 ||scene.width!==4320||scene.height!==2880||scene.padding!==0||scene.tokens.size!==0)
throw Error('STOP_SCENE_DIMENSION_OR_TOKEN_DRIFT');
const original=scene.toObject();
const originalSHA=await SHA(JSON.stringify(original));
if(originalSHA!=='c96c3026a7b5ae152871ceb5191770f3474fd9410958a1701bcff4c3c34d72d5')
 throw Error('STOP_M2_SCENE_FULL_SOURCE_DRIFT');
if(ledger?.revision!==3||await SHA(JSON.stringify(ledger))!=='e8485e53ea171208894098b263b0223940140e1d52284e26e0546043543977d9')
 throw Error('STOP_LIVE_LEDGER_SHA_DRIFT');
if(scene.regions.size!==15||scene.walls.size!==12||scene.lights.size!==6
||scene.regions.reduce((n,r)=>n+r.behaviors.size,0)!==7)
throw Error('STOP_M2_SOURCE_COUNTS_DRIFT');
const scenes=['0CSBwzcszPKyaB8u','5K1uASAARnX8aZhP','EDdktL7VUihbpKe9','UNySMm7YkyYfh41x','Zq8iXByDVhHRbA7w','sI4YVZZChgey1qNi','iqfCcDpEer4pwrJj','DLcheEi6e5OHOYmU','U8S5ZrTjaPIkTUIL','JZkxX6lUQe8Nc8xJ','LXTA8mx1rJ2L6e2J','MAbLfBqG7qIVVuLN','4pc5akMBieHU7GvV','pHQvDUDlyWZFuNrX','if9iWDRjSwI87EeX','PVf6Gbrv9HbB88uZ','La9krMOMBhAhDLi6','ImeIdHbYb6kZKAdt','ez9MSQ8QIO4cW6zo','aIKQmFiuXWipEdyb','HWitOe1wSid7MZ1y'].map(id=>game.scenes.get(id));
const counts={scenes:scenes.length,missing:scenes.filter(s=>!s).length,regions:scenes.reduce((n,s)=>n+(s?.regions.size??0),0),behaviors:scenes.reduce((n,s)=>n+(s?[...s.regions].reduce((v,r)=>v+r.behaviors.size,0):0),0),items:game.items.filter(i=>i.getFlag('world','dicebox')?.stableId?.startsWith('dbx:central-lodge:item:')).length};
if(counts.missing||counts.regions!==202||counts.behaviors!==119||counts.items!==33)
throw Error('STOP_ROSTER_DRIFT');
const geometry={walls:scene.walls.map(w=>({id:w.id,c:w.c,door:w.door,ds:w.ds})),regions:scene.regions.map(r=>({id:r.id,shapes:r.shapes.map(sh=>sh.toObject?.()??sh)})),tiles:scene.tiles.map(t=>({id:t.id,x:t.x,y:t.y,width:t.width,height:t.height})),lights:scene.lights.map(x=>({id:x.id,x:x.x,y:x.y})),tokens:scene.tokens.map(t=>({id:t.id,x:t.x,y:t.y,width:t.width,height:t.height})),sounds:scene.sounds.map(x=>({id:x.id,x:x.x,y:x.y})),notes:scene.notes.map(x=>({id:x.id,x:x.x,y:x.y})),drawings:scene.drawings.map(x=>({id:x.id,x:x.x,y:x.y,shape:x.shape?.toObject?.()??x.shape}))};
if(await SHA(JSON.stringify(geometry))!=='e6790e102c446d20f277723855465145d588190efb16f8f5bd56bb3ca9f302e0')
throw Error('STOP_GEOMETRY_DRIFT');
return {operation:'clscale-m2-grid320-preview-v001',noWrite:true,status:'PASS_STAGED_NOT_APPLIED',
 sceneId:scene.id,originalSHA,geometrySha:await SHA(JSON.stringify(geometry)),ledgerRevision:ledger.revision,
 grid:{type:scene.grid.type,before:scene.grid.size,after:320,distance:scene.grid.distance,units:scene.grid.units},
 counts,autoReposition:false,sceneActive:scene.active,sceneTokens:scene.tokens.size};
