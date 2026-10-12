'use strict';
// CL-50 OFFLINE RESEARCH FIXTURE. No Foundry API calls, install or runtime writes.
// The positive proof fields are hypothetical capabilities; NOT proof that Foundry provides them.
const {test}=require('node:test');
const assert=require('node:assert/strict');
const baseline={
 routeApproved:true, landingRegionUserConfirmed:true,
 event:{type:'tokenMoveIn',id:'move-23',planar:true,completed:true,playerRequested:true,unique:true},
 source:{matchesSceneRegion:true,actorOwned:true,actorDeltaPreserved:true,versionBound:true,size:[1,1]},
 consent:{perMovement:true,unexpired:true},
 executor:{approved:true,serverExclusiveLease:true,fenceEpoch:7,serverEpoch:7,leaseUnexpired:true},
 landing:{exactPixels:[560,1380],commitUsesExactPixels:true,wholeFootprintClear:true,wallsClear:true,
   occupied:false,reverseMouthClear:true,storyWritersClear:true,serverAtomicReserve:true,
   allPotentialWritersParticipate:true},
 transaction:{sameIdAcrossCreateDelete:true,sourceVersionRechecked:true,outcomeKnown:true,
   noPriorPending:true,reloadSafeIdempotency:true,commitAcknowledged:true}
};
const copy=x=>JSON.parse(JSON.stringify(x));
function eligibility(x){
 const fail=[];
 if(!x.routeApproved||!x.landingRegionUserConfirmed)fail.push('ROUTE_LOCATION_UNCONFIRMED');
 if(x.event.type!=='tokenMoveIn'||!x.event.planar||!x.event.completed||!x.event.playerRequested||!x.event.unique||!x.event.id)fail.push('NO_VALID_MOVEMENT_INTENT');
 if(!x.source.matchesSceneRegion||!x.source.actorOwned||!x.source.actorDeltaPreserved||!x.source.versionBound||x.source.size[0]!==1||x.source.size[1]!==1)fail.push('SOURCE_UNPROVEN');
 if(!x.consent.perMovement||!x.consent.unexpired)fail.push('CONSENT_UNPROVEN');
 if(!x.executor.approved||!x.executor.serverExclusiveLease||!x.executor.leaseUnexpired||
    !Number.isInteger(x.executor.fenceEpoch)||x.executor.fenceEpoch!==x.executor.serverEpoch)fail.push('EXECUTOR_LEASE_UNPROVEN');
 if(!x.landing.commitUsesExactPixels||x.landing.exactPixels.length!==2||
    !x.landing.exactPixels.every(Number.isFinite))fail.push('ARRIVAL_NOT_PINNED');
 if(!x.landing.wholeFootprintClear||!x.landing.wallsClear||x.landing.occupied||
    !x.landing.reverseMouthClear||!x.landing.storyWritersClear)fail.push('UNSAFE_LANDING');
 if(!x.landing.serverAtomicReserve||!x.landing.allPotentialWritersParticipate)fail.push('OCCUPANCY_RACE_UNPROVEN');
 if(!x.transaction.sameIdAcrossCreateDelete||!x.transaction.sourceVersionRechecked||
    !x.transaction.outcomeKnown||!x.transaction.noPriorPending||
    !x.transaction.reloadSafeIdempotency||!x.transaction.commitAcknowledged)fail.push('TRANSACTION_RECOVERY_UNPROVEN');
 return {eligible:!fail.length,fail};
}
test('research-only hypothetical complete proof bundle is eligible',()=>assert.equal(eligibility(baseline).eligible,true));
const reject=[
 ['Region location unconfirmed','landingRegionUserConfirmed',false,'ROUTE_LOCATION_UNCONFIRMED'],
 ['incorrect route','routeApproved',false,'ROUTE_LOCATION_UNCONFIRMED'],
 ['created token entry','event.type','tokenEnter','NO_VALID_MOVEMENT_INTENT'],
 ['elevation or resize only','event.planar',false,'NO_VALID_MOVEMENT_INTENT'],
 ['script-driven movement','event.playerRequested',false,'NO_VALID_MOVEMENT_INTENT'],
 ['movement in progress','event.completed',false,'NO_VALID_MOVEMENT_INTENT'],
 ['replayed movement ID','event.unique',false,'NO_VALID_MOVEMENT_INTENT'],
 ['source version stale','source.versionBound',false,'SOURCE_UNPROVEN'],
 ['unlinked Actor data lost','source.actorDeltaPreserved',false,'SOURCE_UNPROVEN'],
 ['unsupported token footprint','source.size',[2,2],'SOURCE_UNPROVEN'],
 ['consent missing','consent.perMovement',false,'CONSENT_UNPROVEN'],
 ['expired consent','consent.unexpired',false,'CONSENT_UNPROVEN'],
 ['chosen GM unauthorized','executor.approved',false,'EXECUTOR_LEASE_UNPROVEN'],
 ['client-only mutex','executor.serverExclusiveLease',false,'EXECUTOR_LEASE_UNPROVEN'],
 ['stale fencing epoch','executor.fenceEpoch',6,'EXECUTOR_LEASE_UNPROVEN'],
 ['lease expired','executor.leaseUnexpired',false,'EXECUTOR_LEASE_UNPROVEN'],
 ['preflight is not commit position','landing.commitUsesExactPixels',false,'ARRIVAL_NOT_PINNED'],
 ['footprint overlap','landing.wholeFootprintClear',false,'UNSAFE_LANDING'],
 ['Wall collision','landing.wallsClear',false,'UNSAFE_LANDING'],
 ['Token already occupies landing','landing.occupied',true,'UNSAFE_LANDING'],
 ['reverse mouth overlap','landing.reverseMouthClear',false,'UNSAFE_LANDING'],
 ['story writer overlap','landing.storyWritersClear',false,'UNSAFE_LANDING'],
 ['no atomic reserve','landing.serverAtomicReserve',false,'OCCUPANCY_RACE_UNPROVEN'],
 ['non-participating alternate writer','landing.allPotentialWritersParticipate',false,'OCCUPANCY_RACE_UNPROVEN'],
 ['create/delete identity broken','transaction.sameIdAcrossCreateDelete',false,'TRANSACTION_RECOVERY_UNPROVEN'],
 ['source revision not reread','transaction.sourceVersionRechecked',false,'TRANSACTION_RECOVERY_UNPROVEN'],
 ['batch outcome unknown','transaction.outcomeKnown',false,'TRANSACTION_RECOVERY_UNPROVEN'],
 ['pending older transfer','transaction.noPriorPending',false,'TRANSACTION_RECOVERY_UNPROVEN'],
 ['client reload loses deduplication','transaction.reloadSafeIdempotency',false,'TRANSACTION_RECOVERY_UNPROVEN'],
 ['no commit receipt','transaction.commitAcknowledged',false,'TRANSACTION_RECOVERY_UNPROVEN']
];
for(const [name,path,value,expected]of reject)test('fail closed: '+name,()=>{
 const x=copy(baseline),pieces=path.split('.');let p=x;
 for(const k of pieces.slice(0,-1))p=p[k];
 p[pieces.at(-1)]=value;
 const result=eligibility(x);assert.equal(result.eligible,false);
 assert(result.fail.includes(expected),JSON.stringify(result));
});
// Abstract central coordinator simulation, not installed Foundry or an actual server lease.
function mockCoordinator(){
 const slotOwners=new Map();const committed=new Set();
 return {
  reserve(slot,move,epoch,currentEpoch){
   if(!Number.isInteger(epoch)||epoch!==currentEpoch)return 'REJECT_STALE_FENCE';
   if(committed.has(move))return 'REJECT_ALREADY_COMMITTED';
   if(slotOwners.has(slot))return 'REJECT_OCCUPIED';
   slotOwners.set(slot,move);return 'RESERVED';
  },
  commit(slot,move){if(slotOwners.get(slot)!==move)return 'REJECT_NO_RESERVATION';
   committed.add(move);return 'COMMITTED';},
  release(slot,move){if(slotOwners.get(slot)!==move)return 'REJECT_NOT_OWNER';
   slotOwners.delete(slot);return 'RELEASED';}
 };
}
test('hypothetical competing transfers cannot reserve same slot',()=>{
 const c=mockCoordinator();
 assert.equal(c.reserve('T1-A:560,1380','move-1',7,7),'RESERVED');
 assert.equal(c.reserve('T1-A:560,1380','move-2',7,7),'REJECT_OCCUPIED');
 assert.equal(c.commit('T1-A:560,1380','move-2'),'REJECT_NO_RESERVATION');
 assert.equal(c.commit('T1-A:560,1380','move-1'),'COMMITTED');
 assert.equal(c.release('T1-A:560,1380','move-1'),'RELEASED');
 assert.equal(c.reserve('T1-A:560,1380','move-1',7,7),'REJECT_ALREADY_COMMITTED');
});
test('hypothetical fencing rejects stale executor',()=>{
 const c=mockCoordinator();
 assert.equal(c.reserve('N1-East:3730,1410','move-stale',6,7),'REJECT_STALE_FENCE');
 assert.equal(c.reserve('N1-East:3730,1410','move-fresh',7,7),'RESERVED');
});
console.log('CL50 offline protocol simulation; Foundry server lease and CAS remain UNVERIFIED.');
