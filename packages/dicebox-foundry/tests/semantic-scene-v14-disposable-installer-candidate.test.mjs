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
const authorization=()=>({worldId:'dbx-test-world',currentSingleWriterId:'gm-fixture',activeGmId:'gm-fixture',approvedBlueprintSha256:BLUEPRINT_SHA,approvedBlueprintId:'dbx:blueprint:fixture-one'});
function harness({mutateReceipt=false,truncateLight=false,failCreate=false}={}){
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
        if(truncateLight&&type==='AmbientLight') return [];
        return docs;
      }
    };
    scenes.contents.push(scene);
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
  assert.match(result.reason,/CHILD_OWNERSHIP_REREAD/);assert.equal(result.recoveryRequired,true);
});
test('failed Scene.create has no partial recovery claim',async()=>{
  const h=harness({failCreate:true});const result=await installDisposableSceneV14({...goodOpts(h),...trusted});
  assert.equal(result.failedPhase,'Scene');assert.equal(result.recoveryRequired,false);
  assert.equal(result.sceneId,null);
});
