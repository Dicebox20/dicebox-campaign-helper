'use strict';
// CL50 offline STATE-MACHINE CONTRACT QA ONLY. No runtime, I/O, installer or batch requests.
const {test}=require('node:test'), assert=require('node:assert/strict');
const grid=120,box=(x,y,size=1)=>({x,y,w:grid*size,h:grid*size});
const intersects=(a,b)=>a.x<b.x+b.w && a.x+a.w>b.x && a.y<b.y+b.h && a.y+a.h>b.y;
function decide(c){
 const failures=[];
 if(!c.exactRoute||!c.stackFresh||!c.ledgerFresh)failures.push('STALE_TARGET');
 if(!c.currentExecutorIsAuthorized||!c.singleExecutorLease)failures.push('GM_EXECUTOR');
 if(!c.ownerVerified||!c.playerConsented)failures.push('PLAYER_CONSENT');
 if(c.phase!=='IDLE'||c.pendingPriorTransfer||!c.reentrySuppressionProof)failures.push('REENTRY_OR_UNKNOWN');
 if(c.size!==1)failures.push('TOKEN_FOOTPRINT');
 if(!c.location||!c.pinnedDestination||!c.sourceStillPresent||!c.idReserved)failures.push('PINNED_DESTINATION');
 if(c.location&&c.reverseMouth&&intersects(c.location,c.reverseMouth))failures.push('RETURN_MOUTH');
 if(c.location&&c.protectedRegions.some(b=>intersects(c.location,b)))failures.push('PROTECTED_REGION');
 if(c.location&&c.occupied.some(b=>intersects(c.location,b)))failures.push('OCCUPIED');
 if(!c.wallClear||!c.doorClear||!c.dynamicSnapshotFresh)failures.push('GEOMETRY_STALE');
 if(!c.samePositionCanCommit)failures.push('POSITION_COMMIT_UNPROVEN');
 return {pass:failures.length===0,failures};
}
const acceptable={
 exactRoute:true,stackFresh:true,ledgerFresh:true,currentExecutorIsAuthorized:true,
 singleExecutorLease:true,ownerVerified:true,playerConsented:true,phase:'IDLE',
 pendingPriorTransfer:false,reentrySuppressionProof:true,size:1,location:box(560,1380),
 reverseMouth:box(0,1180,2),protectedRegions:[],occupied:[],pinnedDestination:true,
 sourceStillPresent:true,idReserved:true,wallClear:true,doorClear:true,
 dynamicSnapshotFresh:true,samePositionCanCommit:true
};
// Read-only document-preservation model. It is NOT a Foundry Token create payload.
function preservationCheck(before,after){
 return before.actorLink===after.actorLink&&before.actorId===after.actorId
 &&JSON.stringify(before.delta)===JSON.stringify(after.delta)
 &&JSON.stringify(before.foreignFlags)===JSON.stringify(after.foreignFlags);
}
function reconcile(s){
 if(!s.readBothScenes||!s.readerAuthorized||!s.receiptLookupComplete)return 'OUTCOME_UNKNOWN';
 if(s.sourcePresent&&s.destinationPresent)return 'CONFLICT_BOTH_PRESENT';
 if(!s.sourcePresent&&!s.destinationPresent)return 'CONFLICT_NEITHER_PRESENT';
 if(s.destinationPresent&&!s.sourcePresent)return s.targetReceiptMatches&&s.tokenActorIdentityMatches?'COMMITTED':'OUTCOME_UNKNOWN';
 return s.sourceMatchesOriginal&&s.noForeignSideEffects?'NOT_COMMITTED':'OUTCOME_UNKNOWN';
}
test('reference one-square, synthetic exact-condition contract passes',()=>assert.deepEqual(decide(acceptable),{pass:true,failures:[]}));
const negative=[
 ['unknown route',{exactRoute:false},'STALE_TARGET'],
 ['stale ledger',{ledgerFresh:false},'STALE_TARGET'],
 ['wrong GM',{currentExecutorIsAuthorized:false},'GM_EXECUTOR'],
 ['two GMs no lease',{singleExecutorLease:false},'GM_EXECUTOR'],
 ['no player consent',{playerConsented:false},'PLAYER_CONSENT'],
 ['actor not owned',{ownerVerified:false},'PLAYER_CONSENT'],
 ['transfer already pending',{phase:'PREPARED'},'REENTRY_OR_UNKNOWN'],
 ['previous uncertain',{pendingPriorTransfer:true},'REENTRY_OR_UNKNOWN'],
 ['arrival not suppressed',{reentrySuppressionProof:false},'REENTRY_OR_UNKNOWN'],
 ['two-square token',{size:2},'TOKEN_FOOTPRINT'],
 ['unreserved target ID',{idReserved:false},'PINNED_DESTINATION'],
 ['not same pinned committed position',{samePositionCanCommit:false},'POSITION_COMMIT_UNPROVEN'],
 ['mouth collision',{location:box(200,1380)},'RETURN_MOUTH'],
 ['protected puzzle Region',{protectedRegions:[box(560,1380)]},'PROTECTED_REGION'],
 ['occupied after preflight',{occupied:[box(560,1380)]},'OCCUPIED'],
 ['closed door',{doorClear:false},'GEOMETRY_STALE'],
 ['stale snapshot',{dynamicSnapshotFresh:false},'GEOMETRY_STALE']
];
for(const [label,changes,error] of negative)test('reject '+label,()=>{
 const decision=decide({...acceptable,...changes});assert.equal(decision.pass,false);assert(decision.failures.includes(error),JSON.stringify(decision));
});
test('informational notice does not independently invalidate an otherwise clear landing',()=>{
 assert.equal(decide({...acceptable,protectedRegions:[]}).pass,true);
});
test('linked and synthetic unlinked Token records preserve Actor and foreign fields',()=>{
 for(const actorLink of [true,false]){const before={actorLink,actorId:'actor-example',delta:{system:{attributes:{hp:{value:7}}}},foreignFlags:{sampleMod:{owned:'untouched'}}};const after=structuredClone(before);assert(preservationCheck(before,after));after.delta.system.attributes.hp.value=99;assert.equal(preservationCheck(before,after),false);}
});
const raw={readBothScenes:true,readerAuthorized:true,receiptLookupComplete:true,sourcePresent:true,destinationPresent:false,sourceMatchesOriginal:true,noForeignSideEffects:true,targetReceiptMatches:false,tokenActorIdentityMatches:false};
test('source only can be assessed NOT_COMMITTED after full reread',()=>assert.equal(reconcile(raw),'NOT_COMMITTED'));
test('destination only with matching receipt and actor may be COMMITTED',()=>assert.equal(reconcile({...raw,sourcePresent:false,destinationPresent:true,targetReceiptMatches:true,tokenActorIdentityMatches:true}),'COMMITTED'));
test('destination only with receipt or Actor drift is OUTCOME_UNKNOWN',()=>assert.equal(reconcile({...raw,sourcePresent:false,destinationPresent:true,targetReceiptMatches:false}),'OUTCOME_UNKNOWN'));
test('both present is CONFLICT and must not autodelete',()=>assert.equal(reconcile({...raw,sourcePresent:true,destinationPresent:true}),'CONFLICT_BOTH_PRESENT'));
test('neither present is CONFLICT and must not autocreate',()=>assert.equal(reconcile({...raw,sourcePresent:false,destinationPresent:false}),'CONFLICT_NEITHER_PRESENT'));
test('missing side/receipt authorization or lookup is OUTCOME_UNKNOWN',()=>{
 for(const p of ['readBothScenes','readerAuthorized','receiptLookupComplete'])assert.equal(reconcile({...raw,[p]:false}),'OUTCOME_UNKNOWN');
});
console.log('CL50 fixed-coordinate offline safety state tests. No live Foundry API was called.');
