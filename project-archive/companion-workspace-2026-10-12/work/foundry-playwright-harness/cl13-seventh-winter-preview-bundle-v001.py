import json,hashlib
from pathlib import Path
root=Path(r'C:\Users\rujie\Documents\Codex\DiceBox Campaign Helper\work\foundry-playwright-harness')
entries=[
 ('u1','if9iWDRjSwI87EeX','V1JRfiR56dgVGRa3','875pl2PyFUnEYO75',
  '6ed84ac9a24b5fe4db0c513b819e3409fbaf0dff637c4502d878cdd7da51fae3',
  'It gives context for interpreting the grandfather clock and family memorials, but it does not by itself reveal the clock\'s exact setting.',
  'An interleaved family entry names the fourth-born child, the youngest, as the final heir to the estate. The family chronology helps interpret the clock\'s shorter hand, but the other hand still requires evidence from the memorial stones.'),
 ('e4','DLcheEi6e5OHOYmU','eRjDUWAIS206MyZV','AjFHwHDxH7Pg9Vel',
  'c410b2cfac3e8d272de32f4d52b01aebce17886c575ba226050afadff31dc905',
  'at least one supposed interment is false or incomplete.</p>',
  'at least one supposed interment is false or incomplete. Two undisturbed family memorial stones nearby establish the patriarch\'s death as 1431 DR and the matriarch\'s as 1438 DR. Those two stones agree with the household chronology; the false burial is a separate mystery.</p>'),
 ('m1','U8S5ZrTjaPIkTUIL','5H97UQm6VF3vw5Ru','1SyWN6w9CrUxgVhb',
  'fa47aeb7a166b0e3dd84ffb6c6f30445f0c4fb4677eb71f1b58d9fcdee3c578a',
  'leaving a shaped recess connected to the mechanism inside.</p>',
  'leaving a shaped recess connected to the mechanism inside. Beneath the clock face an inscription reads: <em>The last heir shall guide the little hand. The winters between our graves shall guide the great.</em></p>')
]
clockSrc=(root/'cl13-seventh-winter-clock-region-source-v001.js').read_text(encoding='utf-8')
clockSha=hashlib.sha256(clockSrc.encode('utf-8')).hexdigest()
shared="""
const md=async (s)=>Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(String(s)))),x=>x.toString(16).padStart(2,'0')).join('');
const ledger=game.journal.get('xhlXv6CCH34HVga3')?.getFlag('world','dicebox')?.state;
const sceneList=game.scenes.filter(s=>s.getFlag('world','dicebox')?.campaignId==='central-lodge');
const primary=game.users.filter(u=>u.active&&u.isGM).sort((a,b)=>a.id.localeCompare(b.id))[0];
const canonicalIds=["0CSBwzcszPKyaB8u", "5K1uASAARnX8aZhP", "EDdktL7VUihbpKe9", "UNySMm7YkyYfh41x", "Zq8iXByDVhHRbA7w", "sI4YVZZChgey1qNi", "iqfCcDpEer4pwrJj", "DLcheEi6e5OHOYmU", "U8S5ZrTjaPIkTUIL", "JZkxX6lUQe8Nc8xJ", "LXTA8mx1rJ2L6e2J", "MAbLfBqG7qIVVuLN", "4pc5akMBieHU7GvV", "pHQvDUDlyWZFuNrX", "if9iWDRjSwI87EeX", "PVf6Gbrv9HbB88uZ", "La9krMOMBhAhDLi6", "ImeIdHbYb6kZKAdt", "ez9MSQ8QIO4cW6zo", "aIKQmFiuXWipEdyb", "HWitOe1wSid7MZ1y"];const scopedScenes=canonicalIds.map(id=>game.scenes.get(id));if(scopedScenes.some(s=>!s))throw Error('CANONICAL_SCENE_MISSING');const baseline={countAllRegions:scopedScenes.reduce((n,s)=>n+s.regions.size,0),countAllBehaviors:scopedScenes.reduce((n,s)=>n+Array.from(s.regions).reduce((m,r)=>m+r.behaviors.size,0),0)};
const kernelHash=await md(game.macros.get('FHQiFYx6OntZVo9d')?.command??'');
if(game.version!=='14.367'||game.world.id!=='the-lost-mine-of-phandalin'||game.system.id!=='dnd5e'||game.system.version!=='5.3.3'||game.user?.name!=='Assistant Gamemaster'||!game.user.isGM)throw Error('EXACT_STACK_OR_EXECUTOR_DRIFT');
if(baseline.countAllRegions!==202||!([116,117].includes(baseline.countAllBehaviors))||ledger?.revision!==1||kernelHash!=='6264c467211d4f5c94cfaaa9437eae88582599061b9d8a4951391830a3e8f814')throw Error('CANONICAL_BASELINE_DRIFT');
if(ledger?.puzzles?.m1?.clockSettingResolved!==false || ledger?.puzzles?.m1?.silverFamilyEmblemInstalled!==false)throw Error('PLAYSTATE_CHANGED');
"""
for n,sid,rid,bid,oldsha,old,new in entries:
 body=shared+f'''
const scene=game.scenes.get({json.dumps(sid)}),region=scene?.regions.get({json.dumps(rid)}),b=region?.behaviors.get({json.dumps(bid)});
if(!b||b.disabled||region.behaviors.size!==1||!b.getFlag('world','dicebox')?.stableId?.startsWith('dbx:central-lodge:'))throw Error('TARGET_UNEXPECTED');
const old=b.system.source;
if(await md(old)!=={json.dumps(oldsha)})throw Error('OLD_SOURCE_SHA_MISMATCH');
const oldFrag={json.dumps(old,ensure_ascii=False)},newFrag={json.dumps(new,ensure_ascii=False)};
if(old.split(oldFrag).length!==2)throw Error('TARGET_LITERAL_NOT_UNIQUE');
const next=old.replace(oldFrag,newFrag),nextSha=await md(next);
if(!next.includes(newFrag)||next.includes(oldFrag))throw Error('PATCH_INVALID');
'''
 for mode in ['preview','apply']:
  code=body
  if mode=='preview':
   code+="return {noWrite:true,operation:'cl13-"+n+"-hint-preview',beforeSha:await md(old),afterSha:nextSha,changedChars:next.length-old.length,baseline,ledgerRevision:ledger.revision,behaviorId:b.id};\n"
  else:
   code+="""await b.update({'system.source':next});
const reread=game.scenes.get(scene.id)?.regions.get(region.id)?.behaviors.get(b.id);
if(!reread || await md(reread.system.source)!==nextSha)throw Error('POST_APPLY_REREAD_MISMATCH');
return {noWrite:false,operation:'cl13-"""+n+"""-hint-apply',status:'PASS',oldSha:await md(old),newSha:nextSha,behaviorId:b.id,ledgerRevision:game.journal.get('xhlXv6CCH34HVga3')?.getFlag('world','dicebox')?.state?.revision};
"""
  out=root/f'cl13-{n}-hint-{mode}-v001.page.js';out.write_text(code,encoding='utf-8')
  print('CREATED',out.name)
clockBody=shared+f'''
const scene=game.scenes.get('U8S5ZrTjaPIkTUIL'),region=scene?.regions.get('3tIrR12uv8ppFkOb');
if(!region || region.behaviors.size!==0||region.getFlag('world','dicebox')?.stableId!=='dbx:central-lodge:m1:region:m1-clock-setting')throw Error('CLOCK_TARGET_NOT_EMPTY');
if(baseline.countAllBehaviors!==116)throw Error('CLOCK_BEHAVIOR_COUNT_DRIFT');
const source={json.dumps(clockSrc,ensure_ascii=False)};
const expectedSha={json.dumps(clockSha)};
if(await md(source)!==expectedSha)throw Error('STAGED_SOURCE_HASH_DRIFT');
const sid='dbx:central-lodge:m1:behavior:clock-setting-seventh-winter-v001';
if(game.scenes.some(s=>s.regions.some(r=>r.behaviors.some(b=>b.getFlag('world','dicebox')?.stableId===sid))))throw Error('DUPLICATE_CLOCK_STABLE_ID');
const payload={{name:'DiceBox M1 — The Seventh Winter Clock Setting',type:'executeScript',disabled:false,
 system:{{events:['tokenMoveIn'],source}},flags:{{world:{{dicebox:{{stableId:sid,owner:'central-lodge',version:'cl13-0435-v001'}}}}}}}};
'''
for mode in ['preview','apply']:
 if mode=='preview':
  code=clockBody+"return {noWrite:true,operation:'cl13-clock-preview',status:'PASS',sourceSha:expectedSha,regionId:region.id,newBehaviorStableId:sid,sourceLength:source.length,expectedBehaviorsAfter:117,ledgerRevision:ledger.revision,primaryGM:primary?.id};\n"
 else:
  code=clockBody+"""const created=await region.createEmbeddedDocuments('RegionBehavior',[payload]);
if(created?.length!==1)throw Error('CREATION_OUTCOME_UNKNOWN');
const reread=game.scenes.get(scene.id)?.regions.get(region.id);
const matches=reread?.behaviors.filter(b=>b.getFlag('world','dicebox')?.stableId===sid)??[];
if(matches.length!==1 || matches[0].disabled || !(matches[0].system.events.has('tokenMoveIn')) || await md(matches[0].system.source)!==expectedSha)throw Error('CLOCK_FINAL_REREAD_MISMATCH');
const current=game.journal.get('xhlXv6CCH34HVga3')?.getFlag('world','dicebox')?.state;
return {noWrite:false,operation:'cl13-clock-apply',status:'PASS',regionId:region.id,behaviorId:matches[0].id,sourceSha:expectedSha,createdCount:created.length,ledgerRevision:current?.revision,clockSolved:current?.puzzles?.m1?.clockSettingResolved};
"""
 out=root/f'cl13-clock-{mode}-v001.page.js';out.write_text(code,encoding='utf-8')
 print('CREATED',out.name)
print('STAGED_CLOCK_SHA',clockSha)
