'use strict';
// Central Lodge CL91 source-only research: four unresolved progression semantics.
// NO Foundry imports, live mutations, installer code, or canonical story answer invention.
// Treat approved:true scenarios as hypothetical author decisions, NOT live authorization.
const {test}=require('node:test');
const assert=require('node:assert/strict');
const locked={
 m1:{clockRegion:'3tIrR12uv8ppFkOb',emblem:'puzzles.m1.silverFamilyEmblemInstalled',
  solved:'puzzles.m1.clockSettingResolved',reward:['Family Reliquary Key','Brass Baggage Token'],
  authoredNumericSolution:null,approvedAdjudication:null},
 m2:{regionBehavior:'IdriZEGhxUY9whcV',
  observed:'puzzles.m2.founderPortraitObserved',opened:'puzzles.m2.founderPortraitOpened',
  requiredActorItem:'Founders Signet',reveals:'Old Estate Survey'},
 u2:{regionBehavior:'J11ZvQh4lqzEsvRi',
  observed:'puzzles.u2.servantHistoryObserved',
  interpreted:'puzzles.u2.servantHistoryInterpreted'},
 n3:{branchRegion:'RP1jYOH738xl9hks',
  departure:'puzzles.n3.departureBoardResolved',switch:'puzzles.n3.switchWheelInstalled',
  overlay:'puzzles.n3.routeOverlay.resolved',branch:'puzzles.n3.t3BranchUnlocked',
  policy:null,branchEntryInstalled:false,returnToN3AlreadyInstalled:true}
};
function clockGate(x,proposal={}){
 if(!x.emblemInstalled)return 'BLOCK_EMBLEM';
 if(proposal.kind==='literal'){
  if(!proposal.authorApproved||!Number.isInteger(proposal.solution)||proposal.solution<0||
     proposal.solution>2359)return 'BLOCK_NO_APPROVED_SOLUTION';
  return x.enteredSetting===proposal.solution?'ALLOW_CLOCK_RESOLUTION':'WRONG_CLOCK_SETTING';
 }
 if(proposal.kind==='gm-adjudication'){
  return proposal.authorApproved&&x.gmConfirmsClueDeduction&&x.hasGenealogyAndGraveEvidence?
    'ALLOW_CLOCK_RESOLUTION':'BLOCK_NO_APPROVED_ADJUDICATION';
 }
 return 'BLOCK_UNAUTHORED_CLOCK';
}
function m1Rewards(state){return state.emblemInstalled&&state.clockSettingResolved?
  'COMPARTMENT_UNLOCKED':'COMPARTMENT_LOCKED';}
function m2Stage(event,actor){
 if(event==='notice')return {observed:true,opened:false,surveyGranted:false};
 if(event==='signet-interaction'&&actor.foundersSignet&&actor.hasAuthority&&actor.interactionConfirmed){
  return {observed:false,opened:true,surveyGranted:true};
 }
 return {observed:false,opened:false,surveyGranted:false};
}
function u2Stage(event,approval={}){
 if(event==='inspect-servant-traces')return {observed:true,interpreted:false};
 if(event==='interpret-servant-history'){
  return {observed:false,interpreted:Boolean(approval.authorApproved&&approval.relevantCluesVerified)};
 }
 return {observed:false,interpreted:false};
}
function n3Unlock(state,auth={}){
 if(!auth.authorApproved||auth.policy!=='all-three')return 'BLOCK_UNAUTHORED_POLICY';
 if(!state.departureBoardResolved)return 'BLOCK_DEPARTURE_BOARD';
 if(!state.switchWheelInstalled)return 'BLOCK_SWITCH';
 if(!state.routeOverlayResolved)return 'BLOCK_OVERLAY';
 if(!auth.branchWriterReviewed||!auth.destinationPinned||!auth.returnBehaviorPreserved)
  return 'BLOCK_UNINSTALLED_BRANCH';
 return 'AUTHORING_PREVIEW_ELIGIBLE_NOT_LIVE';
}
// Guard authored source invariants in an offline snapshot (not runtime introspection).
test('locked blocker IDs and independent states are retained',()=>{
 assert.equal(locked.m1.authoredNumericSolution,null);
 assert.equal(locked.m1.approvedAdjudication,null);
 assert.equal(locked.n3.policy,null);
 assert.equal(locked.n3.branchEntryInstalled,false);
 assert.equal(locked.n3.returnToN3AlreadyInstalled,true);
 assert.notEqual(locked.m2.observed,locked.m2.opened);
 assert.notEqual(locked.u2.observed,locked.u2.interpreted);
});
test('M1 cannot solve clock without emblem',()=>assert.equal(
 clockGate({emblemInstalled:false,enteredSetting:1200},{kind:'literal',authorApproved:true,solution:1200}),'BLOCK_EMBLEM'));
test('M1 rejects numeric answer invented by fixture',()=>assert.equal(
 clockGate({emblemInstalled:true,enteredSetting:1200}),'BLOCK_UNAUTHORED_CLOCK'));
test('M1 rejects literal that lacks author approval',()=>assert.equal(
 clockGate({emblemInstalled:true,enteredSetting:1200},{kind:'literal',solution:1200}),'BLOCK_NO_APPROVED_SOLUTION'));
for(const invalid of [null,NaN,-10,2400,'noon'])test('M1 rejects invalid answer '+String(invalid),()=>assert.equal(
 clockGate({emblemInstalled:true,enteredSetting:0},{kind:'literal',solution:invalid,authorApproved:true}),'BLOCK_NO_APPROVED_SOLUTION'));
test('M1 hypothetical authored numeric answer still requires matching player solution',()=>{
 assert.equal(clockGate({emblemInstalled:true,enteredSetting:1030},
 {kind:'literal',solution:1045,authorApproved:true}),'WRONG_CLOCK_SETTING');
});
test('M1 hypothetical authored GM clue mode does not silently bypass clues',()=>{
 assert.equal(clockGate({emblemInstalled:true,gmConfirmsClueDeduction:false,hasGenealogyAndGraveEvidence:true},
 {kind:'gm-adjudication',authorApproved:true}),'BLOCK_NO_APPROVED_ADJUDICATION');
});
test('M1 no-softlock: neither key nor baggage token granted before solved',()=>{
 assert.equal(m1Rewards({emblemInstalled:true,clockSettingResolved:false}),'COMPARTMENT_LOCKED');
 assert.deepEqual(locked.m1.reward,['Family Reliquary Key','Brass Baggage Token']);
});
test('M1 hypothetical confirmed puzzle reveals compartment but does not auto-claim Items',()=>{
 assert.equal(m1Rewards({emblemInstalled:true,clockSettingResolved:true}),'COMPARTMENT_UNLOCKED');
});
test('M2 observing portrait never counts as physically opening it',()=>{
 assert.deepEqual(m2Stage('notice',{}),{observed:true,opened:false,surveyGranted:false});
});
test('M2 signet possession alone does not trigger survey reveal',()=>{
 assert.equal(m2Stage('notice',{foundersSignet:true}).surveyGranted,false);
});
for(const [name,actor] of [
 ['missing signet',{hasAuthority:true,interactionConfirmed:true}],
 ['unauthorized actor',{foundersSignet:true,interactionConfirmed:true}],
 ['interaction not confirmed',{foundersSignet:true,hasAuthority:true}]
])test('M2 signet stage denies '+name,()=>assert.equal(m2Stage('signet-interaction',actor).opened,false));
test('M2 hypothetical signet interaction is physical open, not passive observation',()=>{
 assert.deepEqual(m2Stage('signet-interaction',{foundersSignet:true,hasAuthority:true,interactionConfirmed:true}),
 {observed:false,opened:true,surveyGranted:true});
});
test('M2 old state and new state must not be renamed into each other',()=>{
 assert.equal(locked.m2.observed,'puzzles.m2.founderPortraitObserved');
 assert.equal(locked.m2.opened,'puzzles.m2.founderPortraitOpened');
});
test('U2 physical evidence observation does not automatically interpret history',()=>{
 assert.deepEqual(u2Stage('inspect-servant-traces'),{observed:true,interpreted:false});
});
test('U2 interpretation action alone cannot advance without authored criteria',()=>{
 assert.equal(u2Stage('interpret-servant-history').interpreted,false);
});
test('U2 hypothetical authored interpretation needs checked supporting clues',()=>{
 assert.equal(u2Stage('interpret-servant-history',{authorApproved:true,relevantCluesVerified:false}).interpreted,false);
 assert.equal(u2Stage('interpret-servant-history',{authorApproved:true,relevantCluesVerified:true}).interpreted,true);
});
test('N3 cannot unlock T3 merely because every existing socket is solved',()=>{
 assert.equal(n3Unlock({departureBoardResolved:true,switchWheelInstalled:true,routeOverlayResolved:true}),'BLOCK_UNAUTHORED_POLICY');
});
for(const [name,state,expected] of [
 ['departure unresolved',{departureBoardResolved:false,switchWheelInstalled:true,routeOverlayResolved:true},'BLOCK_DEPARTURE_BOARD'],
 ['switch absent',{departureBoardResolved:true,switchWheelInstalled:false,routeOverlayResolved:true},'BLOCK_SWITCH'],
 ['overlay not solved',{departureBoardResolved:true,switchWheelInstalled:true,routeOverlayResolved:false},'BLOCK_OVERLAY']
])test('N3 hypothetical all-three policy rejects '+name,()=>assert.equal(n3Unlock(state,{authorApproved:true,policy:'all-three'}),expected));
test('N3 full hypothetical prerequisites cannot authorize absent branch writer',()=>{
 assert.equal(n3Unlock({departureBoardResolved:true,switchWheelInstalled:true,routeOverlayResolved:true},
 {authorApproved:true,policy:'all-three'}),'BLOCK_UNINSTALLED_BRANCH');
});
test('N3 even reviewed future policy is only preview-eligible, not installed',()=>{
 assert.equal(n3Unlock({departureBoardResolved:true,switchWheelInstalled:true,routeOverlayResolved:true},
 {authorApproved:true,policy:'all-three',branchWriterReviewed:true,destinationPinned:true,returnBehaviorPreserved:true}),
 'AUTHORING_PREVIEW_ELIGIBLE_NOT_LIVE');
});
test('N3 wrong or unapproved policy never auto-opens the railway',()=>{
 const state={departureBoardResolved:true,switchWheelInstalled:true,routeOverlayResolved:true};
 assert.equal(n3Unlock(state,{authorApproved:true,policy:'any-one'}),'BLOCK_UNAUTHORED_POLICY');
 assert.equal(n3Unlock(state,{policy:'all-three'}),'BLOCK_UNAUTHORED_POLICY');
});
console.log('CL91 OFFLINE ONLY: numeric clock / N3 branch policy UNAUTHORED; M2,U2 distinct narrative stages.');
