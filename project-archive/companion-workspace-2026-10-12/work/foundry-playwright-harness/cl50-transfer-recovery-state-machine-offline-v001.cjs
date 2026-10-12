'use strict';
// CL50 OFFLINE recovery-model acceptance tests; NEVER an installer/Foundry adapter.
// Not authoritative collision lock: Map locks below exist only within this test process.
// Neither a passing test nor a held model lock establishes real Foundry server CAS.
const {test}=require('node:test');
const assert=require('node:assert/strict');

function intent(id='movement-01',overrides={}){
 return {id,route:'R1-N1-to-T1',sourceScene:'N1',targetScene:'T1',actor:'actor-01',
 token:'token-01',destination:'T1-A:560,1380',event:'tokenMoveIn',
 approvedRoute:true,completedPlayerMovement:true,ownerAndConsent:true,
 serverLeaseProven:true,serverAtomicDestinationProven:true,pinnedArrivalProven:true,
 snapshotBound:true,fullBodySafe:true,...overrides};
}
const required=x=>Boolean(x.id&&x.actor&&x.token&&x.sourceScene&&x.targetScene&&x.destination
 &&x.event==='tokenMoveIn'&&x.approvedRoute&&x.completedPlayerMovement
 &&x.ownerAndConsent&&x.serverLeaseProven&&x.serverAtomicDestinationProven
 &&x.pinnedArrivalProven&&x.snapshotBound&&x.fullBodySafe);

function engine(snapshot){
 const s=snapshot?structuredClone(snapshot):{entries:{},slots:{},tokens:{}};
 const stable=(x)=>JSON.stringify(Object.keys(x).sort().map(k=>[k,x[k]]));
 const terminal=new Set(['VERIFIED','NOT_APPLIED','ABORTED','MANUAL_REVIEW']);
 return {
  state:()=>structuredClone(s),
  propose(x){
   if(!required(x))return {result:'REJECT_UNPROVEN'};
   const old=s.entries[x.id];
   if(old)return {result:old.signature===stable(x)?'DUPLICATE':'CONFLICTING_ID',status:old.status};
   if(s.slots[x.destination]||s.tokens[x.token])return {result:'RESOURCE_BUSY'};
   s.entries[x.id]={id:x.id,signature:stable(x),route:x.route,source:x.sourceScene,
    target:x.targetScene,actor:x.actor,token:x.token,destination:x.destination,
    status:'READY',attempts:0,issued:false,verified:false};
   s.slots[x.destination]=x.id;s.tokens[x.token]=x.id;
   return {result:'RESERVED_IN_MODEL',status:'READY'};
  },
  dispatch(id){
   const e=s.entries[id];if(!e)return {result:'UNKNOWN_ID'};
   if(e.status!=='READY')return {result:'NO_REISSUE',status:e.status};
   // Durable OUTCOME_UNKNOWN is stored BEFORE returning the one theoretical side-effect intent.
   // Caller would need an independently verified real server protocol; this model calls nothing.
   e.status='OUTCOME_UNKNOWN';e.issued=true;e.attempts++;
   return {result:'SIMULATED_DISPATCH_INTENT_ONLY',attempt:e.attempts,status:e.status};
  },
  reconcile(id,observed){
   const e=s.entries[id];if(!e)return {result:'UNKNOWN_ID'};
   if(e.status!=='OUTCOME_UNKNOWN')return {result:'NOT_PENDING',status:e.status};
   if(!observed||!observed.bothScenesRead||!observed.actorIdentityKnown){
    return {result:'STILL_UNKNOWN',status:e.status};
   }
   const source=observed.sourcePresent,target=observed.targetPresent;
   const onlyDestination=!source&&target;
   const onlySource=source&&!target;
   if(onlyDestination&&observed.targetMatchesActor&&observed.destinationMatches
      &&observed.actorDeltaMatches&&observed.noDuplicateToken){
    e.status='VERIFIED';e.verified=true;delete s.slots[e.destination];delete s.tokens[e.token];
    return {result:'TRANSFER_VERIFIED',status:e.status};
   }
   if(onlySource&&observed.sourceVersionIntact&&observed.noDuplicateToken){
    e.status='NOT_APPLIED';delete s.slots[e.destination];delete s.tokens[e.token];
    return {result:'NO_TRANSFER_VERIFIED',status:e.status};
   }
   // Both, neither, wrong Actor, wrong landing, or conflicting source data:
   // Hold reservations and require explicit manual intervention.
   e.status='MANUAL_REVIEW';
   return {result:'QUARANTINED_FOR_GM',status:e.status};
  },
  abort(id){
   const e=s.entries[id];if(!e)return {result:'UNKNOWN_ID'};
   if(e.status!=='READY')return {result:'CANNOT_ABORT_AFTER_DISPATCH',status:e.status};
   e.status='ABORTED';delete s.slots[e.destination];delete s.tokens[e.token];
   return {result:'ABORTED_BEFORE_SIDE_EFFECT',status:e.status};
  },
  terminal:(id)=>terminal.has(s.entries[id]?.status)
 };
}
const safeRead=()=>({bothScenesRead:true,actorIdentityKnown:true,sourcePresent:false,
 targetPresent:true,targetMatchesActor:true,destinationMatches:true,actorDeltaMatches:true,
 noDuplicateToken:true});
const noTransfer=()=>({bothScenesRead:true,actorIdentityKnown:true,sourcePresent:true,
 targetPresent:false,sourceVersionIntact:true,noDuplicateToken:true});
const start=(x=intent())=>{const m=engine();assert.equal(m.propose(x).result,'RESERVED_IN_MODEL');return m;};

test('hypothetical full proof can enter READY in model',()=>{const m=start();assert.equal(m.state().entries['movement-01'].status,'READY')});
for(const [name,patch] of [
 ['no server executor lease',{serverLeaseProven:false}],
 ['no server atomic occupancy',{serverAtomicDestinationProven:false}],
 ['no fixed landing',{pinnedArrivalProven:false}],
 ['no player consent',{ownerAndConsent:false}],
 ['stale source data',{snapshotBound:false}],
 ['blocked footprint',{fullBodySafe:false}],
 ['creation entry',{event:'tokenEnter'}]
])test('fail closed on '+name,()=>{
 const m=engine();assert.equal(m.propose(intent('no',patch)).result,'REJECT_UNPROVEN');
 assert.deepEqual(m.state().entries,{});
});
test('same event id yields no duplicate reservation',()=>{
 const m=start();assert.equal(m.propose(intent()).result,'DUPLICATE');
 assert.equal(Object.keys(m.state().entries).length,1);
});
test('same event id with conflicting actor is rejected',()=>{
 const m=start();assert.equal(m.propose(intent('movement-01',{actor:'actor-02'})).result,'CONFLICTING_ID');
});
test('two transfer intents cannot reserve same mock landing',()=>{
 const m=start();assert.equal(m.propose(intent('movement-02',{token:'token-02'})).result,'RESOURCE_BUSY');
});
test('one token cannot be reserved for two different destinations',()=>{
 const m=start();assert.equal(m.propose(intent('movement-02',{destination:'N3-West:740,1430'})).result,'RESOURCE_BUSY');
});
test('abort before theoretical dispatch frees resources',()=>{
 const m=start();assert.equal(m.abort('movement-01').status,'ABORTED');
 assert.equal(m.propose(intent('movement-02')).result,'RESERVED_IN_MODEL');
 assert.equal(m.propose(intent()).result,'DUPLICATE');
});
test('dispatch first writes UNKNOWN and never dispatches twice',()=>{
 const m=start();assert.equal(m.dispatch('movement-01').status,'OUTCOME_UNKNOWN');
 assert.equal(m.dispatch('movement-01').result,'NO_REISSUE');
 assert.equal(m.state().entries['movement-01'].attempts,1);
});
test('crash/reload keeps unknown state and prohibits replay',()=>{
 const m=start();m.dispatch('movement-01');
 const afterCrash=engine(m.state());
 assert.equal(afterCrash.dispatch('movement-01').result,'NO_REISSUE');
 assert.equal(afterCrash.propose(intent()).result,'DUPLICATE');
});
test('unknown readback keeps uncertainty, and slot stays held',()=>{
 const m=start();m.dispatch('movement-01');
 assert.equal(m.reconcile('movement-01',null).result,'STILL_UNKNOWN');
 assert.equal(m.propose(intent('movement-02',{token:'other'})).result,'RESOURCE_BUSY');
});
test('only target Token with exact preserved data verifies delivery',()=>{
 const m=start();m.dispatch('movement-01');
 assert.equal(m.reconcile('movement-01',safeRead()).result,'TRANSFER_VERIFIED');
 assert.equal(m.dispatch('movement-01').result,'NO_REISSUE');
 assert.equal(m.propose(intent('new',{token:'different'})).result,'RESERVED_IN_MODEL');
});
test('only intact source Token proves no transfer and never retries old id',()=>{
 const m=start();m.dispatch('movement-01');
 assert.equal(m.reconcile('movement-01',noTransfer()).result,'NO_TRANSFER_VERIFIED');
 assert.equal(m.propose(intent()).result,'DUPLICATE');
});
for(const [name,patch] of [
 ['both copies exist',{sourcePresent:true,targetPresent:true}],
 ['both copies missing',{sourcePresent:false,targetPresent:false}],
 ['wrong destination',{destinationMatches:false}],
 ['wrong Actor delta',{actorDeltaMatches:false}],
 ['duplicate token observed',{noDuplicateToken:false}],
 ['source identity changed',{sourcePresent:true,targetPresent:false,sourceVersionIntact:false}]
])test('ambiguous readback quarantines '+name,()=>{
 const m=start();m.dispatch('movement-01');
 assert.equal(m.reconcile('movement-01',{...safeRead(),...patch}).result,'QUARANTINED_FOR_GM');
 assert.equal(m.propose(intent('second',{token:'secondToken'})).result,'RESOURCE_BUSY');
});
test('out-of-order reconcile and release cannot authorize a new transfer',()=>{
 const m=start();assert.equal(m.reconcile('movement-01',safeRead()).result,'NOT_PENDING');
 assert.equal(m.dispatch('unknown').result,'UNKNOWN_ID');
 assert.equal(m.state().entries['movement-01'].status,'READY');
});
console.log('CL50 OFFLINE ONLY. No live lease, atomic occupancy, commit or player canary proven.');
