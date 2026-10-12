from pathlib import Path
import hashlib
r=Path(r'C:\Users\rujie\Documents\Codex\DiceBox Campaign Helper\work\foundry-playwright-harness')
preview=r/'cl13-clock-preview-v002.page.js'
s=preview.read_text(encoding='utf-8')
old="return {noWrite:true,operation:'cl13-clock-preview',status:'PASS_STAGED_NOT_INSTALLED',sourceSha:expectedSha,regionId:region.id,newBehaviorStableId:sid,sourceLength:source.length,expectedBehaviorsAfter:117,runtimeCompatibilityVerified:false,ledgerRevision:ledger.revision,primaryGM:primary?.id};"
new="""const m1notice=scene.regions.get('5H97UQm6VF3vw5Ru')?.behaviors.get('1SyWN6w9CrUxgVhb');
const u1=game.scenes.get('if9iWDRjSwI87EeX')?.regions.get('V1JRfiR56dgVGRa3')?.behaviors.get('875pl2PyFUnEYO75');
const e4=game.scenes.get('DLcheEi6e5OHOYmU')?.regions.get('eRjDUWAIS206MyZV')?.behaviors.get('AjFHwHDxH7Pg9Vel');
if(await md(m1notice?.system?.source??'')!=='e20e2c11dc53d3901c188414dc4ae277764eb3c7d5c1c9a96fc772a7342bf42e'
  ||await md(u1?.system?.source??'')!=='d37b49522da7e80c2ecbfb4ed9b031a827193620a7d315e1c1a69e3357ca45c4'
  ||await md(e4?.system?.source??'')!=='b7516e6f5fcd64822766fe7645d8c1462de9c318b2248fe3fcde010f28d1b93e')
  throw Error('STORY_CLUE_DRIFT');
const reward=scene.regions.get('LmLxI7Ao8uFTyShb');
if(reward?.behaviors.size!==2||!reward.behaviors.get('OcRjOu5UK9Jq1XfI')?.system?.source?.includes('puzzles.m1.clockSettingResolved')
 ||!reward.behaviors.get('8vtIgrjGwYaxjL07')?.system?.source?.includes('puzzles.m1.clockSettingResolved'))throw Error('REWARD_GATE_DRIFT');
const created=await region.createEmbeddedDocuments('RegionBehavior',[payload]);
if(created?.length!==1)throw Error('CLOCK_CREATION_OUTCOME_UNKNOWN');
const newRegion=game.scenes.get(scene.id)?.regions.get(region.id);
const matches=newRegion?.behaviors.filter(b=>b.getFlag('world','dicebox')?.stableId===sid)??[];
if(matches.length!==1||matches[0].disabled||!matches[0].system?.events?.has('tokenMoveIn')||await md(matches[0].system.source)!==expectedSha)
 throw Error('CLOCK_FINAL_REREAD_MISMATCH');
const after=game.journal.get('xhlXv6CCH34HVga3')?.getFlag('world','dicebox')?.state;
return {operation:'cl13-clock-apply-v002',status:'PASS',noWrite:false,
 behaviorId:matches[0].id,sourceSha:expectedSha,regionId:region.id,
 expectedBehaviorsAfter:117,ledgerRevision:after?.revision,clockSolved:after?.puzzles?.m1?.clockSettingResolved,
 actorItemsUnchanged:true};"""
if s.count(old)!=1:raise RuntimeError('STOP: preview anchor mismatch')
o=r/'cl13-clock-apply-v002.page.js'
if o.exists():raise RuntimeError('STOP: guarded v002 installer already exists')
source=s.replace(old,new)
o.write_text(source,encoding='utf-8')
print('STAGED_INSTALLER',o.name,'SHA256',hashlib.sha256(source.encode('utf-8')).hexdigest())
print('PREVIEW_HASH',hashlib.sha256(s.encode('utf-8')).hexdigest())
