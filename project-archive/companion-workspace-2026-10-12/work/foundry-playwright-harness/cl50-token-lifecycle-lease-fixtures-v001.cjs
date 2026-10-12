'use strict';
// Synthetic invariant tests ONLY. No Foundry imports, mutation, or installer operations.
const assert=require('node:assert/strict');
const {test}=require('node:test');
const base={actorLink:false,actorId:'actor-ref',delta:{name:'Alias',system:{attributes:{hp:{value:7}}}},flags:{otherModule:{state:'preserve'}},name:'Alias',x:560,y:1380,width:1,height:1,_regions:['source-scene-region']};
const safe={...structuredClone(base),_regions:[],x:560,y:1380};
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
function inspect(original,proposed,arrived){
 const problems=[];
 for(const name of ['actorLink','actorId','delta','flags','name'])if(!same(original[name],proposed[name]))problems.push('SOURCE_OR_ACTOR_DRIFT');
 if(proposed._regions.some(id=>id==='source-scene-region'))problems.push('STALE_REGION_IDENTITY');
 if(!Number.isFinite(proposed.x)||!Number.isFinite(proposed.y)||proposed.width!==1||proposed.height!==1)problems.push('FOOTPRINT_INVALID');
 if(proposed.x!==arrived.expectedX||proposed.y!==arrived.expectedY)problems.push('PLACEMENT_CHANGED_BY_HOOK');
 if(arrived.enteredReverseMouth||arrived.enteredPuzzleWriter)problems.push('UNEXPECTED_REGION_ENTER');
 if(!arrived.targetDocumentPresent||!arrived.sourceDocumentAbsent||!arrived.receiptAndActorMatch)problems.push('COMMIT_UNPROVEN');
 return problems;
}
const arrival={expectedX:560,expectedY:1380,enteredReverseMouth:false,enteredPuzzleWriter:false,targetDocumentPresent:true,sourceDocumentAbsent:true,receiptAndActorMatch:true};
test('reference synthetic lifecycle contract passes',()=>assert.deepEqual(inspect(base,safe,arrival),[]));
for(const [label,changed,want] of [
 ['synthetic Actor delta changed',{delta:{name:'Alias',system:{attributes:{hp:{value:99}}}}},'SOURCE_OR_ACTOR_DRIFT'],
 ['unrelated flags lost',{flags:{}},'SOURCE_OR_ACTOR_DRIFT'],
 ['Token name altered',{name:'Other'},'SOURCE_OR_ACTOR_DRIFT'],
 ['old Scene region membership copied',{_regions:['source-scene-region']},'STALE_REGION_IDENTITY'],
 ['position modified before commit',{x:620},'PLACEMENT_CHANGED_BY_HOOK'],
 ['oversized footprint',{height:2},'FOOTPRINT_INVALID']
])test('reject '+label,()=>assert(inspect(base,{...safe,...changed},arrival).includes(want)));
for(const [label,changed]of[
 ['reverse Region entered',{enteredReverseMouth:true}],
 ['puzzle Region entered',{enteredPuzzleWriter:true}]
])test('reject '+label,()=>assert(inspect(base,safe,{...arrival,...changed}).includes('UNEXPECTED_REGION_ENTER')));
test('token presence cannot substitute for matching receipt',()=>assert(inspect(base,safe,{...arrival,receiptAndActorMatch:false}).includes('COMMIT_UNPROVEN')));
test('token source remains: commit is not proven',()=>assert(inspect(base,safe,{...arrival,sourceDocumentAbsent:false}).includes('COMMIT_UNPROVEN')));
function executorGate({executorId,allowedId,leaseOwnerId,leaseUnique,leaseFresh,pendingUnknown}){
 return executorId===allowedId&&leaseOwnerId===allowedId&&leaseUnique&&leaseFresh&&!pendingUnknown;
}
const allow='pnTxw7VYpYR4IKWE',lease={executorId:allow,allowedId:allow,leaseOwnerId:allow,leaseUnique:true,leaseFresh:true,pendingUnknown:false};
test('one synthetically leased designated executor passes',()=>assert(executorGate(lease)));
test('other GM ID is not enough even if isGM',()=>assert.equal(executorGate({...lease,executorId:'JESWV6CcU7m07VW6'}),false));
test('duplicate active clients sharing executor account fail without a unique lease',()=>assert.equal(executorGate({...lease,leaseUnique:false}),false));
test('stale lease fails',()=>assert.equal(executorGate({...lease,leaseFresh:false}),false));
test('unknown transfer outcome fails closed',()=>assert.equal(executorGate({...lease,pendingUnknown:true}),false));
console.log('CL50 offline Token lifecycle and lease invariants only. No runtime APIs or live writes.');
