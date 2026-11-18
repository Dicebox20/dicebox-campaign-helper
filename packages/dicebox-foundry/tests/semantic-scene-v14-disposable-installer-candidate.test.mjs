import test from 'node:test';
import assert from 'node:assert/strict';
import {SEMANTIC_SLICE_VERSION} from '../src/semantic-scene-v14-slice.js';
import {previewDisposableSceneInstallV14,installDisposableSceneV14} from '../src/semantic-scene-v14-disposable-installer-candidate.js';

const BLUEPRINT_SHA='a'.repeat(64);
const blueprint=()=>({schemaVersion:SEMANTIC_SLICE_VERSION,
  source:{kind:'approved-spatial-blueprint',blueprintId:'dbx:blueprint:fixture-one',sha256:BLUEPRINT_SHA,revision:3,approvalId:'approval:fixture-v001'},
  scene:{name:'Fixture chamber',width:1024,height:768,grid:{type:1,size:64,distance:5,units:'ft'}},
  features:[
    {kind:'region',stableId:'dbx:region:entrance',name:'Entrance',polygon:[{x:100,y:100},{x:380,y:100},{x:380,y:380},{x:100,y:380}]},
    {kind:'light',stableId:'dbx:light:sconce',at:{x:400,y:250},brightDistance:10,dimDistance:20,color:'#ffeedd'},
    {kind:'wall',stableId:'dbx:wall:north',a:{x:100,y:100},b:{x:900,y:100}},
    {kind:'door',stableId:'dbx:door:east',a:{x:900,y:300},b:{x:900,y:400},state:'closed'}
  ]});
const authorization=()=>({worldId:'dbx-test-world',currentSingleWriterId:'gm-fixture',activeGmId:'gm-fixture',approvedBlueprintSha256:BLUEPRINT_SHA,approvedBlueprintId:'dbx:blueprint:fixture-one',approvedBlueprintRevision:3});
function harness({mutateReceipt=false,truncateLight=false,failCreate=false,throwAfterCreate=false,driftLight=false,driftWall=false,driftRegion=false,injectExtraOwned=false,returnWrongIds=false,afterChild=null}={}){
  const writes=[];let nextId=1;
  const scenes={contents:[], get(id){return this.contents.find(x=>x.id===id);}};
  const game={version:'14.367',world:{id:'dbx-test-world'},system:{id:'dnd5e',version:'5.3.3'},
    user:{id:'gm-fixture',isGM:true},users:{activeGM:{id:'gm-fixture'}},scenes};
  const Scene={create:async data=>{
    writes.push({type:'Scene',data:structuredClone(data)});
    if(failCreate) throw new Error('CREATE_FAILURE');
    const scene={id:`scene-${nextId++}`, ...structuredClone(data),
      walls:{contents:[]},lights:{contents:[]},regions:{contents:[]},
      createEmbeddedDocuments:async(type,payload)=>{
        writes.push({type,data:structuredClone(payload)});
        const col={Wall:'walls',AmbientLight:'lights',Region:'regions'}[type];
        const docs=payload.map(data=>({id:`child-${nextId++}`,...structuredClone(data)}));
        scenes.get(scene.id)[col].contents.push(...docs);
        if(mutateReceipt&&type==='Region') scenes.get(scene.id)[col].contents[0].flags['dicebox-campaign-helper'].stableId='tampered';
        if(driftLight&&type==='AmbientLight') scenes.get(scene.id)[col].contents[0].config.bright=999;
        if(driftWall&&type==='Wall') scenes.get(scene.id)[col].contents[0].c[2]=777;
        if(driftRegion&&type==='Region') scenes.get(scene.id)[col].contents[0].shapes[0].points[2]=777;
        if(injectExtraOwned&&type==='Wall') {
          const rogue=structuredClone(docs[0]);rogue.id='rogue-child';
          rogue.flags['dicebox-campaign-helper'].stableId='dbx:wall:rogue';
          scenes.get(scene.id)[col].contents.push(rogue);
        }
        if (typeof afterChild==='function') afterChild(type,game);
        if(truncateLight&&type==='AmbientLight') return [];
        if(returnWrongIds&&type==='Wall') return docs.map(d=>({...d,id:'wrong-'+d.id}));
        return docs;
      }
    };
    scenes.contents.push(scene);
    if (throwAfterCreate) throw new Error('POST_COMMIT_HOST_TIMEOUT');
    return scene;
  }};
  return {runtime:{game,Scene},writes,scenes};
}
const goodOpts=(h)=>({runtime:h.runtime,authorization:authorization(),blueprint:blueprint()});
const trusted={verifyApproval:async()=>true,validateModels:async()=>true};

test('read-only preview reports expected Wall/AmbientLight/Region counts and never writes',()=>{
  const h=harness();const p=previewDisposableSceneInstallV14(goodOpts(h));
  assert.deepEqual(p.phases,[{type:'Wall',count:2},{type:'AmbientLight',count:1},{type:'Region',count:1}]);
  assert.equal(p.writesAllowed,false);assert.deepEqual(h.writes,[]);
});
for(const [name,change] of [
  ['foreign world',h=>h.runtime.game.world.id='owner-world'],
  ['wrong Foundry minor',h=>h.runtime.game.version='14.370'],
  ['wrong system',h=>h.runtime.game.system.id='pf2e'],
  ['wrong game system version',h=>h.runtime.game.system.version='5.3.4'],
  ['non-GM',h=>h.runtime.game.user.isGM=false],
  ['non-elected GM',h=>h.runtime.game.users.activeGM.id='another'],
  ['preexisting owned blueprint',h=>h.scenes.contents.push({id:'old',flags:{'dicebox-campaign-helper':{blueprintId:'dbx:blueprint:fixture-one'}}})]
]) test(`preflight blocks ${name} without a write`,()=>{
  const h=harness();change(h);
  assert.throws(()=>previewDisposableSceneInstallV14(goodOpts(h)),/^Error: (DCH_DISPOSABLE_INSTALL_|SEMANTIC_V14_)/);
  assert.deepEqual(h.writes,[]);
});
test('no callback authority means no mutation',async()=>{
  const h=harness();await assert.rejects(installDisposableSceneV14(goodOpts(h)),/TRUSTED_GATE_MISSING/);
  assert.deepEqual(h.writes,[]);
});
test('unverified approval prevents scene creation',async()=>{
  const h=harness();const receipt=await assert.rejects(installDisposableSceneV14({...goodOpts(h),...trusted,verifyApproval:async()=>false}),/APPROVAL_UNVERIFIED/);
  assert.deepEqual(h.writes,[]);
});
test('failed model validation prevents scene creation',async()=>{
  const h=harness();await assert.rejects(installDisposableSceneV14({...goodOpts(h),...trusted,validateModels:async()=>false}),/MODEL_VALIDATION_UNVERIFIED/);
  assert.deepEqual(h.writes,[]);
});
test('missing exact revision/source approval blocks without writing',async()=>{
  const h=harness(),opts=goodOpts(h);opts.authorization.approvedBlueprintSha256='b'.repeat(64);
  await assert.rejects(installDisposableSceneV14({...opts,...trusted}),/APPROVAL_SCOPE/);
  assert.deepEqual(h.writes,[]);
});
test('disposable mock installation uses exact parent APIs and rereads each child class',async()=>{
  const h=harness();const result=await installDisposableSceneV14({...goodOpts(h),...trusted});
  assert.equal(result.status,'DISPOSABLE_APPLY_RECEIPT');
  assert.deepEqual(result.createdCounts,{Wall:2,AmbientLight:1,Region:1});
  assert.deepEqual(h.writes.map(x=>x.type),['Scene','Wall','AmbientLight','Region']);
  assert.equal(h.scenes.contents[0].lights.contents.length,1);
  assert.equal(result.actualPlayerViewVerified,false);assert.equal(result.acceptanceClaim,false);
});
test('failed light operation reports partial-write recovery and halts Region phase',async()=>{
  const h=harness({truncateLight:true});const result=await installDisposableSceneV14({...goodOpts(h),...trusted});
  assert.equal(result.status,'PARTIAL_OR_BLOCKED');assert.equal(result.failedPhase,'AmbientLight');
  assert.equal(result.recoveryRequired,true);assert.equal(result.acceptanceClaim,false);
  assert.deepEqual(h.writes.map(x=>x.type),['Scene','Wall','AmbientLight']);
});
test('tampered Region readback is blocked and preserves partial receipt',async()=>{
  const h=harness({mutateReceipt:true});const result=await installDisposableSceneV14({...goodOpts(h),...trusted});
  assert.equal(result.status,'PARTIAL_OR_BLOCKED');assert.equal(result.failedPhase,'Region');
  assert.match(result.reasonCode,/CHILD_OWNERSHIP_REREAD/);assert.equal(result.recoveryRequired,true);
});
test('Scene.create rejection remains an unknown side effect until authoritative reread',async()=>{
  const h=harness({failCreate:true});const result=await installDisposableSceneV14({...goodOpts(h),...trusted});
  assert.equal(result.failedPhase,'Scene');assert.equal(result.recoveryRequired,true);
  assert.equal(result.writeOutcomeUnknown,true);assert.equal(result.sceneId,null);
});
test('Scene.create may commit and then reject: retain conservative recovery flag',async()=>{
  const h=harness({throwAfterCreate:true});const result=await installDisposableSceneV14({...goodOpts(h),...trusted});
  assert.equal(result.status,'PARTIAL_OR_BLOCKED');assert.equal(result.failedPhase,'Scene');
  assert.equal(result.recoveryRequired,true);assert.equal(result.writeOutcomeUnknown,true);
  assert.equal(result.sceneId,null);assert.equal(h.scenes.contents.length,1);
  assert.equal(JSON.stringify(result).includes('POST_COMMIT_HOST_TIMEOUT'),false);
});

test('source revision mismatch blocks preflight even with matching id and digest',()=>{
  const h=harness(),opts=goodOpts(h);opts.authorization.approvedBlueprintRevision=4;
  assert.throws(()=>previewDisposableSceneInstallV14(opts),/APPROVAL_REVISION/);
  assert.deepEqual(h.writes,[]);
});
test('GM rotation during asynchronous approval aborts before Scene.create',async()=>{
  const h=harness();const approval=async()=>{h.runtime.game.users.activeGM.id='other-gm';return true;};
  await assert.rejects(installDisposableSceneV14({...goodOpts(h),...trusted,verifyApproval:approval}),/ELECTED_GM/);
  assert.deepEqual(h.writes,[]);
});
test('Foundry build drift during DataModel validation aborts before Scene.create',async()=>{
  const h=harness();const validate=async()=>{h.runtime.game.version='14.370';return true;};
  await assert.rejects(installDisposableSceneV14({...goodOpts(h),...trusted,validateModels:validate}),/EXACT_FIXTURE/);
  assert.deepEqual(h.writes,[]);
});
test('world drift during asynchronous model validation aborts before write',async()=>{
  const h=harness();const validate=async()=>{h.runtime.game.world.id='owner-world';return true;};
  await assert.rejects(installDisposableSceneV14({...goodOpts(h),...trusted,validateModels:validate}),/EXACT_FIXTURE/);
  assert.deepEqual(h.writes,[]);
});
test('competing scene inserted during approval blocks duplicate before write',async()=>{
  const h=harness();const approval=async()=>{h.scenes.contents.push({id:'other-scene',flags:{'dicebox-campaign-helper':{blueprintId:'dbx:blueprint:fixture-one'}}});return true;};
  await assert.rejects(installDisposableSceneV14({...goodOpts(h),...trusted,verifyApproval:approval}),/PREEXISTING_BLUEPRINT/);
  assert.deepEqual(h.writes,[]);
});
test('GM rotation after Wall write records partial receipt and stops light/Region',async()=>{
  const h=harness({afterChild:(type,game)=>{if(type==='Wall') game.users.activeGM.id='other-gm';}});
  const r=await installDisposableSceneV14({...goodOpts(h),...trusted});
  assert.equal(r.status,'PARTIAL_OR_BLOCKED');assert.equal(r.failedPhase,'Wall');
  assert.equal(r.reasonCode,'DCH_DISPOSABLE_INSTALL_ELECTED_GM');
  assert.equal(r.recoveryRequired,true);
  assert.deepEqual(h.writes.map(x=>x.type),['Scene','Wall']);
});
test('raw server error is sanitized in recovery receipt',async()=>{
  const h=harness({failCreate:true});const r=await installDisposableSceneV14({...goodOpts(h),...trusted});
  assert.equal(r.reasonCode,'DCH_DISPOSABLE_INSTALL_RUNTIME_FAILURE');
  assert.equal(JSON.stringify(r).includes('CREATE_FAILURE'),false);
});


test('blueprint edit during asynchronous approval blocks before first write',async()=>{
  const h=harness(),opts=goodOpts(h);
  const approval=async()=>{opts.blueprint.scene.name='Evil changed scene';return true;};
  await assert.rejects(installDisposableSceneV14({...opts,...trusted,verifyApproval:approval}),/BLUEPRINT_MUTATED/);
  assert.deepEqual(h.writes,[]);
});
test('blueprint edit during asynchronous model validation blocks before first write',async()=>{
  const h=harness(),opts=goodOpts(h);
  const validate=async()=>{opts.blueprint.features[1].at.x=1;return true;};
  await assert.rejects(installDisposableSceneV14({...opts,...trusted,validateModels:validate}),/BLUEPRINT_MUTATED/);
  assert.deepEqual(h.writes,[]);
});
test('host approval callback cannot mutate pinned source used for scene flags',async()=>{
  const h=harness(),opts=goodOpts(h);
  const approval=async({blueprint:received})=>{received.sha256='f'.repeat(64);return true;};
  const result=await installDisposableSceneV14({...opts,...trusted,verifyApproval:approval});
  assert.equal(result.status,'DISPOSABLE_APPLY_RECEIPT');
  assert.equal(h.scenes.contents[0].flags['dicebox-campaign-helper'].blueprintSha256,BLUEPRINT_SHA);
});

for(const [kind,option] of [['Wall','driftWall'],['AmbientLight','driftLight'],['Region','driftRegion']]) {
  test(`${kind} semantic readback mismatch blocks success even with intact ownership`,async()=>{
    const h=harness({[option]:true});const result=await installDisposableSceneV14({...goodOpts(h),...trusted});
    assert.equal(result.status,'PARTIAL_OR_BLOCKED');
    assert.equal(result.failedPhase,kind);
    assert.equal(result.reasonCode,'DCH_DISPOSABLE_INSTALL_CHILD_SEMANTIC_REREAD');
    assert.equal(result.recoveryRequired,true);
    assert.equal(result.acceptanceClaim,false);
  });
}

test('host verifier receives complete blueprint geometry rather than only its claimed digest',async()=>{
  const h=harness(),opts=goodOpts(h);let inspected=false;
  const verifyApproval=async({blueprint:src,fullBlueprint})=>{
    assert.equal(src.sha256,BLUEPRINT_SHA);
    assert.equal(fullBlueprint.source.sha256,BLUEPRINT_SHA);
    assert.equal(fullBlueprint.features.length,4);
    assert.deepEqual(fullBlueprint.features.find(f=>f.kind==='door').a,{x:900,y:300});
    inspected=true;return true;
  };
  const result=await installDisposableSceneV14({...opts,...trusted,verifyApproval});
  assert.equal(inspected,true);assert.equal(result.status,'DISPOSABLE_APPLY_RECEIPT');
});
test('trusted verifier can reject forged unchanged declared SHA with altered authored geometry',async()=>{
  const h=harness(),opts=goodOpts(h);opts.blueprint.features[2].b.x=800;
  const verifyApproval=async({fullBlueprint})=>fullBlueprint.features.find(f=>f.kind==='wall').b.x===900;
  await assert.rejects(installDisposableSceneV14({...opts,...trusted,verifyApproval}),/APPROVAL_UNVERIFIED/);
  assert.deepEqual(h.writes,[]);
});

test('unexpected extra helper-owned Wall is detected even when expected Walls reread',async()=>{
  const h=harness({injectExtraOwned:true});
  const r=await installDisposableSceneV14({...goodOpts(h),...trusted});
  assert.equal(r.status,'PARTIAL_OR_BLOCKED');
  assert.equal(r.failedPhase,'Wall');
  assert.equal(r.reasonCode,'DCH_DISPOSABLE_INSTALL_EXTRA_OWNED_CHILD');
  assert.equal(r.recoveryRequired,true);
});
test('returned child identities must agree with authoritative scene reread',async()=>{
  const h=harness({returnWrongIds:true});
  const r=await installDisposableSceneV14({...goodOpts(h),...trusted});
  assert.equal(r.status,'PARTIAL_OR_BLOCKED');
  assert.equal(r.failedPhase,'Wall');
  assert.equal(r.reasonCode,'DCH_DISPOSABLE_INSTALL_CHILD_RECEIPT_IDS');
  assert.equal(r.recoveryRequired,true);
});

test('throwing approval provider cannot leak its raw sensitive error to caller',async()=>{
  const h=harness();
  await assert.rejects(installDisposableSceneV14({...goodOpts(h),...trusted,verifyApproval:async()=>{throw Error('secret-auth-key-ABC');}}),error=>{
    assert.equal(error.message,'DCH_DISPOSABLE_INSTALL_APPROVAL_PROVIDER_ERROR');
    assert.equal(error.message.includes('secret-auth-key'),false);return true;
  });
  assert.deepEqual(h.writes,[]);
});
test('throwing DataModel validator cannot leak its raw error before write',async()=>{
  const h=harness();
  await assert.rejects(installDisposableSceneV14({...goodOpts(h),...trusted,validateModels:async()=>{throw Error('private-world-name');}}),error=>{
    assert.equal(error.message,'DCH_DISPOSABLE_INSTALL_MODEL_PROVIDER_ERROR');
    assert.equal(error.message.includes('private-world-name'),false);return true;
  });
  assert.deepEqual(h.writes,[]);
});
