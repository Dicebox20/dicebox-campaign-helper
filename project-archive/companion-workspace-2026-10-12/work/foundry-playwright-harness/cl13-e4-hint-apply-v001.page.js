
const md=async (s)=>Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(String(s)))),x=>x.toString(16).padStart(2,'0')).join('');
const ledger=game.journal.get('xhlXv6CCH34HVga3')?.getFlag('world','dicebox')?.state;
const sceneList=game.scenes.filter(s=>s.getFlag('world','dicebox')?.campaignId==='central-lodge');
const primary=game.users.filter(u=>u.active&&u.isGM).sort((a,b)=>a.id.localeCompare(b.id))[0];
const canonicalIds=["0CSBwzcszPKyaB8u", "5K1uASAARnX8aZhP", "EDdktL7VUihbpKe9", "UNySMm7YkyYfh41x", "Zq8iXByDVhHRbA7w", "sI4YVZZChgey1qNi", "iqfCcDpEer4pwrJj", "DLcheEi6e5OHOYmU", "U8S5ZrTjaPIkTUIL", "JZkxX6lUQe8Nc8xJ", "LXTA8mx1rJ2L6e2J", "MAbLfBqG7qIVVuLN", "4pc5akMBieHU7GvV", "pHQvDUDlyWZFuNrX", "if9iWDRjSwI87EeX", "PVf6Gbrv9HbB88uZ", "La9krMOMBhAhDLi6", "ImeIdHbYb6kZKAdt", "ez9MSQ8QIO4cW6zo", "aIKQmFiuXWipEdyb", "HWitOe1wSid7MZ1y"];const scopedScenes=canonicalIds.map(id=>game.scenes.get(id));if(scopedScenes.some(s=>!s))throw Error('CANONICAL_SCENE_MISSING');const baseline={countAllRegions:scopedScenes.reduce((n,s)=>n+s.regions.size,0),countAllBehaviors:scopedScenes.reduce((n,s)=>n+Array.from(s.regions).reduce((m,r)=>m+r.behaviors.size,0),0)};
const kernelHash=await md(game.macros.get('FHQiFYx6OntZVo9d')?.command??'');
if(game.version!=='14.367'||game.world.id!=='the-lost-mine-of-phandalin'||game.system.id!=='dnd5e'||game.system.version!=='5.3.3'||game.user?.name!=='Assistant Gamemaster'||!game.user.isGM)throw Error('EXACT_STACK_OR_EXECUTOR_DRIFT');
if(baseline.countAllRegions!==202||!([116,117].includes(baseline.countAllBehaviors))||ledger?.revision!==1||kernelHash!=='6264c467211d4f5c94cfaaa9437eae88582599061b9d8a4951391830a3e8f814')throw Error('CANONICAL_BASELINE_DRIFT');
if(ledger?.puzzles?.m1?.clockSettingResolved!==false || ledger?.puzzles?.m1?.silverFamilyEmblemInstalled!==false)throw Error('PLAYSTATE_CHANGED');

const scene=game.scenes.get("DLcheEi6e5OHOYmU"),region=scene?.regions.get("eRjDUWAIS206MyZV"),b=region?.behaviors.get("AjFHwHDxH7Pg9Vel");
if(!b||b.disabled||region.behaviors.size!==1||!b.getFlag('world','dicebox')?.stableId?.startsWith('dbx:central-lodge:'))throw Error('TARGET_UNEXPECTED');
const old=b.system.source;
if(await md(old)!=="c410b2cfac3e8d272de32f4d52b01aebce17886c575ba226050afadff31dc905")throw Error('OLD_SOURCE_SHA_MISMATCH');
const oldFrag="at least one supposed interment is false or incomplete.</p>",newFrag="at least one supposed interment is false or incomplete. Two undisturbed family memorial stones nearby establish the patriarch's death as 1431 DR and the matriarch's as 1438 DR. Those two stones agree with the household chronology; the false burial is a separate mystery.</p>";
if(old.split(oldFrag).length!==2)throw Error('TARGET_LITERAL_NOT_UNIQUE');
const next=old.replace(oldFrag,newFrag),nextSha=await md(next);
if(!next.includes(newFrag)||next.includes(oldFrag))throw Error('PATCH_INVALID');
await b.update({'system.source':next});
const reread=game.scenes.get(scene.id)?.regions.get(region.id)?.behaviors.get(b.id);
if(!reread || await md(reread.system.source)!==nextSha)throw Error('POST_APPLY_REREAD_MISMATCH');
return {noWrite:false,operation:'cl13-e4-hint-apply',status:'PASS',oldSha:await md(old),newSha:nextSha,behaviorId:b.id,ledgerRevision:game.journal.get('xhlXv6CCH34HVga3')?.getFlag('world','dicebox')?.state?.revision};
