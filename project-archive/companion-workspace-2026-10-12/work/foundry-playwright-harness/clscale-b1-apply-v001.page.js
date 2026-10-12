const canonical=["0CSBwzcszPKyaB8u", "5K1uASAARnX8aZhP", "EDdktL7VUihbpKe9", "UNySMm7YkyYfh41x", "Zq8iXByDVhHRbA7w", "sI4YVZZChgey1qNi", "iqfCcDpEer4pwrJj", "DLcheEi6e5OHOYmU", "U8S5ZrTjaPIkTUIL", "JZkxX6lUQe8Nc8xJ", "LXTA8mx1rJ2L6e2J", "MAbLfBqG7qIVVuLN", "4pc5akMBieHU7GvV", "pHQvDUDlyWZFuNrX", "if9iWDRjSwI87EeX", "PVf6Gbrv9HbB88uZ", "La9krMOMBhAhDLi6", "ImeIdHbYb6kZKAdt", "ez9MSQ8QIO4cW6zo", "aIKQmFiuXWipEdyb", "HWitOe1wSid7MZ1y"] .map(id=>game.scenes.get(id));
// B1 exact snapshot guarded grid-only resize.
const s=game.scenes.get('0CSBwzcszPKyaB8u'),ledger=game.journal.get('xhlXv6CCH34HVga3')?.getFlag('world','dicebox')?.state;
const H=async v=>Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(String(v)))),b=>b.toString(16).padStart(2,'0')).join('');
if(game.version!=='14.367'||game.system.version!=='5.3.3'||game.world.id!=='the-lost-mine-of-phandalin'||game.user.name!=='Assistant Gamemaster'||!game.user.isGM||game.users.some(u=>u.active&&!u.isGM))throw Error('STACK_OR_PLAYER_DRIFT');
if(!s||s.active||s.grid.size!==120||s.grid.type!==0||s.grid.distance!==5||s.grid.units!=='ft'||s.width!==4320||s.height!==2880||s.tokens.size!==0||s.padding!==0)throw Error('B1_SCENE_DRIFT');
if(await H(JSON.stringify(s.toObject()))!=='c23fd9e2736cd7dbde05ade5480d078f4b760756b6988dd1fd4d048bb9fb232c'||ledger?.revision!==3||await H(JSON.stringify(ledger))!=='e8485e53ea171208894098b263b0223940140e1d52284e26e0546043543977d9')throw Error('SOURCE_OR_LEDGER_DRIFT');
if(canonical.length!==21||canonical.reduce((n,s)=>n+s.regions.size,0)!==202||canonical.reduce((n,s)=>n+[...s.regions].reduce((m,r)=>m+r.behaviors.size,0),0)!==119)throw Error('ROSTER_DRIFT');
const before=s.toObject();
await s.update({'grid.size':150},{autoReposition:false});
const now=game.scenes.get(s.id).toObject(),check=JSON.parse(JSON.stringify(now));
check.grid.size=120;check._stats.modifiedTime=1791351673904;check._stats.lastModifiedBy="JESWV6CcU7m07VW6";
if(now.grid.size!==150||await H(JSON.stringify(check))!=='c23fd9e2736cd7dbde05ade5480d078f4b760756b6988dd1fd4d048bb9fb232c'||
await H(JSON.stringify(game.journal.get('xhlXv6CCH34HVga3')?.getFlag('world','dicebox')?.state))!=='e8485e53ea171208894098b263b0223940140e1d52284e26e0546043543977d9')
 throw Error('OUTCOME_UNKNOWN_B1_NO_RETRY');
return{operation:'clscale-b1-apply-v001',status:'PASS_SOURCE_UPDATED',noWrite:false,originalSHA:'c23fd9e2736cd7dbde05ade5480d078f4b760756b6988dd1fd4d048bb9fb232c',afterSHA:await H(JSON.stringify(now)),normalizedSHA:await H(JSON.stringify(check))};
