
const md=async (s)=>Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(String(s)))),x=>x.toString(16).padStart(2,'0')).join('');
const ledger=game.journal.get('xhlXv6CCH34HVga3')?.getFlag('world','dicebox')?.state;
const sceneList=game.scenes.filter(s=>s.getFlag('world','dicebox')?.campaignId==='central-lodge');
const primary=game.users.filter(u=>u.active&&u.isGM).sort((a,b)=>a.id.localeCompare(b.id))[0];
const canonicalIds=["0CSBwzcszPKyaB8u", "5K1uASAARnX8aZhP", "EDdktL7VUihbpKe9", "UNySMm7YkyYfh41x", "Zq8iXByDVhHRbA7w", "sI4YVZZChgey1qNi", "iqfCcDpEer4pwrJj", "DLcheEi6e5OHOYmU", "U8S5ZrTjaPIkTUIL", "JZkxX6lUQe8Nc8xJ", "LXTA8mx1rJ2L6e2J", "MAbLfBqG7qIVVuLN", "4pc5akMBieHU7GvV", "pHQvDUDlyWZFuNrX", "if9iWDRjSwI87EeX", "PVf6Gbrv9HbB88uZ", "La9krMOMBhAhDLi6", "ImeIdHbYb6kZKAdt", "ez9MSQ8QIO4cW6zo", "aIKQmFiuXWipEdyb", "HWitOe1wSid7MZ1y"];const scopedScenes=canonicalIds.map(id=>game.scenes.get(id));if(scopedScenes.some(s=>!s))throw Error('CANONICAL_SCENE_MISSING');const baseline={countAllRegions:scopedScenes.reduce((n,s)=>n+s.regions.size,0),countAllBehaviors:scopedScenes.reduce((n,s)=>n+Array.from(s.regions).reduce((m,r)=>m+r.behaviors.size,0),0)};
const kernelHash=await md(game.macros.get('FHQiFYx6OntZVo9d')?.command??'');
if(game.version!=='14.367'||game.world.id!=='the-lost-mine-of-phandalin'||game.system.id!=='dnd5e'||game.system.version!=='5.3.3'||game.user?.name!=='Assistant Gamemaster'||!game.user.isGM)throw Error('EXACT_STACK_OR_EXECUTOR_DRIFT');
if(baseline.countAllRegions!==202||!([116,117].includes(baseline.countAllBehaviors))||ledger?.revision!==1||kernelHash!=='6264c467211d4f5c94cfaaa9437eae88582599061b9d8a4951391830a3e8f814')throw Error('CANONICAL_BASELINE_DRIFT');
if(ledger?.puzzles?.m1?.clockSettingResolved!==false || ledger?.puzzles?.m1?.silverFamilyEmblemInstalled!==false)throw Error('PLAYSTATE_CHANGED');

const scene=game.scenes.get("if9iWDRjSwI87EeX"),region=scene?.regions.get("V1JRfiR56dgVGRa3"),b=region?.behaviors.get("875pl2PyFUnEYO75");
if(!b||b.disabled||region.behaviors.size!==1||!b.getFlag('world','dicebox')?.stableId?.startsWith('dbx:central-lodge:'))throw Error('TARGET_UNEXPECTED');
const old=b.system.source;
if(await md(old)!=="6ed84ac9a24b5fe4db0c513b819e3409fbaf0dff637c4502d878cdd7da51fae3")throw Error('OLD_SOURCE_SHA_MISMATCH');
const oldFrag="It gives context for interpreting the grandfather clock and family memorials, but it does not by itself reveal the clock's exact setting.",newFrag="An interleaved family entry names the fourth-born child, the youngest, as the final heir to the estate. The family chronology helps interpret the clock's shorter hand, but the other hand still requires evidence from the memorial stones.";
if(old.split(oldFrag).length!==2)throw Error('TARGET_LITERAL_NOT_UNIQUE');
const next=old.replace(oldFrag,newFrag),nextSha=await md(next);
if(!next.includes(newFrag)||next.includes(oldFrag))throw Error('PATCH_INVALID');
await b.update({'system.source':next});
const reread=game.scenes.get(scene.id)?.regions.get(region.id)?.behaviors.get(b.id);
if(!reread || await md(reread.system.source)!==nextSha)throw Error('POST_APPLY_REREAD_MISMATCH');
return {noWrite:false,operation:'cl13-u1-hint-apply',status:'PASS',oldSha:await md(old),newSha:nextSha,behaviorId:b.id,ledgerRevision:game.journal.get('xhlXv6CCH34HVga3')?.getFlag('world','dicebox')?.state?.revision};
