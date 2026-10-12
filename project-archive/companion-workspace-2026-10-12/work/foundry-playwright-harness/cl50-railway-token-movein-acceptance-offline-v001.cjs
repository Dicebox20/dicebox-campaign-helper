'use strict';
// CL-50: Synthetic railway movement intent and event eligibility contract.
// Offline Node assertions ONLY. No Foundry APIs, live mutations, or install logic.
const {test}=require('node:test');
const assert=require('node:assert/strict');
const base={
  eventName:'tokenMoveIn', movement:{id:'move-001',origin:{x:440,y:1380,elevation:0},destination:{x:560,y:1380,elevation:0}},
  movementCompleted:true,actualPlayerRequested:true,requestingUserOwnsActor:true,
  sourceRegionMatches:true,sceneMatches:true,tokenSize:{width:1,height:1},
  positionAfter:{x:560,y:1380},freshSourceToken:true,returnMouthClear:true,storyRegionsClear:true,
  destinationOccupancyClear:true,wallClear:true,consentRecorded:true,leaseProven:true,
  pendingUnresolved:false,duplicateMovementId:false
};
function evaluate(a){
  const issues=[];
  if(a.eventName!=='tokenMoveIn')issues.push('NOT_MOVEMENT_ENTRY');
  const m=a.movement;
  if(!m||typeof m.id!=='string'||!m.id||!m.origin||!m.destination)issues.push('MISSING_MOVEMENT');
  else if(!(Number.isFinite(m.origin.x)&&Number.isFinite(m.origin.y)&&Number.isFinite(m.destination.x)&&Number.isFinite(m.destination.y)) ||
       (m.origin.x===m.destination.x&&m.origin.y===m.destination.y))issues.push('NO_PLANAR_TRAVEL');
  if(!a.movementCompleted||!a.actualPlayerRequested||!a.requestingUserOwnsActor)issues.push('UNVERIFIED_PLAYER_MOVEMENT');
  if(!a.sourceRegionMatches||!a.sceneMatches||!a.freshSourceToken)issues.push('STALE_SOURCE');
  if(a.tokenSize.width!==1||a.tokenSize.height!==1)issues.push('UNSUPPORTED_TOKEN_SIZE');
  if(m&&m.destination&&(a.positionAfter.x!==m.destination.x||a.positionAfter.y!==m.destination.y))issues.push('MOVEMENT_POSITION_DRIFT');
  if(!a.returnMouthClear||!a.storyRegionsClear||!a.destinationOccupancyClear||!a.wallClear)issues.push('DESTINATION_NOT_PROVEN');
  if(!a.consentRecorded||!a.leaseProven||a.pendingUnresolved||a.duplicateMovementId)issues.push('TRANSFER_AUTHORITY_OR_REPLAY');
  return {eligible:issues.length===0,issues};
}
test('synthetic 1x1 player planar Region-move-in with independent permissions passes',()=>{
  assert.deepEqual(evaluate(base),{eligible:true,issues:[]});
});
const negative=[
  ['token creation enter',{eventName:'tokenEnter'},'NOT_MOVEMENT_ENTRY'],
  ['boundary expansion enter',{eventName:'tokenEnter',movement:null},'NOT_MOVEMENT_ENTRY'],
  ['token exit',{eventName:'tokenExit'},'NOT_MOVEMENT_ENTRY'],
  ['dimension-only move',{movement:{id:'resize',origin:{x:440,y:1380},destination:{x:440,y:1380}}},'NO_PLANAR_TRAVEL'],
  ['elevation-only move',{movement:{id:'rise',origin:{x:440,y:1380,elevation:0},destination:{x:440,y:1380,elevation:10}}},'NO_PLANAR_TRAVEL'],
  ['no movement metadata',{movement:null},'MISSING_MOVEMENT'],
  ['bad coordinates',{movement:{id:'bad',origin:{x:NaN,y:1380},destination:{x:560,y:1380}}},'NO_PLANAR_TRAVEL'],
  ['incomplete movement',{movementCompleted:false},'UNVERIFIED_PLAYER_MOVEMENT'],
  ['GM/script moved token',{actualPlayerRequested:false},'UNVERIFIED_PLAYER_MOVEMENT'],
  ['actor ownership missing',{requestingUserOwnsActor:false},'UNVERIFIED_PLAYER_MOVEMENT'],
  ['wrong Region',{sourceRegionMatches:false},'STALE_SOURCE'],
  ['wrong Scene',{sceneMatches:false},'STALE_SOURCE'],
  ['source Token changed',{freshSourceToken:false},'STALE_SOURCE'],
  ['oversized Token',{tokenSize:{width:2,height:2}},'UNSUPPORTED_TOKEN_SIZE'],
  ['position drift after movement',{positionAfter:{x:600,y:1380}},'MOVEMENT_POSITION_DRIFT'],
  ['reverse mouth overlap',{returnMouthClear:false},'DESTINATION_NOT_PROVEN'],
  ['story Region effect overlap',{storyRegionsClear:false},'DESTINATION_NOT_PROVEN'],
  ['current occupancy changed',{destinationOccupancyClear:false},'DESTINATION_NOT_PROVEN'],
  ['Wall clearance unknown',{wallClear:false},'DESTINATION_NOT_PROVEN'],
  ['consent not recorded',{consentRecorded:false},'TRANSFER_AUTHORITY_OR_REPLAY'],
  ['cross-GM lease missing',{leaseProven:false},'TRANSFER_AUTHORITY_OR_REPLAY'],
  ['previous outcome unknown',{pendingUnresolved:true},'TRANSFER_AUTHORITY_OR_REPLAY'],
  ['replayed movement id',{duplicateMovementId:true},'TRANSFER_AUTHORITY_OR_REPLAY']
];
for(const [name,patch,expected]of negative)test('reject '+name,()=>{
 const observed=evaluate({...base,...patch});
 assert.equal(observed.eligible,false);
 assert(observed.issues.includes(expected),JSON.stringify(observed));
});
console.log('CL50 synthetic Region movement eligibility only. No Foundry runtime calls.');
