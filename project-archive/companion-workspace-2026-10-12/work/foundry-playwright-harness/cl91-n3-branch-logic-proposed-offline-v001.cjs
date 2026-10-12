'use strict';
// PROPOSED-only N3 logic. Pure function, no Foundry calls or authoritative writes.
const {test}=require('node:test'),assert=require('node:assert/strict');
const exactKeys=['departureBoardResolved','switchWheelInstalled'];
function eligible(ledger){
 const n3=ledger?.puzzles?.n3;
 return n3?.departureBoardResolved===true&&n3?.switchWheelInstalled===true
 &&n3?.routeOverlay?.resolved===true;
}
function fixture({board=false,wheel=false,overlay=false,branch=false,preexisting={}}={}){
 return {revision:2,puzzles:{n3:{
   departureBoardResolved:board,switchWheelInstalled:wheel,
   routeOverlay:{oldEstateSurvey:overlay,cultPassageDiagram:overlay,recentRouteFragment:overlay,resolved:overlay},
   t3BranchUnlocked:branch,other:'retain'},m1:{clockSettingResolved:false},m2:{founderPortraitObserved:false},
   u2:{servantHistoryInterpreted:false}},items:{'brass-baggage-token':{recovered:false}},
   ...preexisting};
}
for(let mask=0;mask<8;mask++){
 const board=!!(mask&1),wheel=!!(mask&2),overlay=!!(mask&4);
 test('all 3 prerequisite truth table bits '+[board,wheel,overlay].map(Number).join(''),()=>{
  const state=fixture({board,wheel,overlay});
  assert.equal(eligible(state),mask===7);
  assert.equal(state.puzzles.n3.t3BranchUnlocked,false);
 });
}
test('missing N3 state cannot pass',()=>assert.equal(eligible({puzzles:{}}),false));
test('no ledger cannot pass',()=>assert.equal(eligible(null),false));
test('no implicit truthy coercion',()=>{
 const s=fixture({board:true,wheel:true,overlay:true});
 s.puzzles.n3.switchWheelInstalled='true';assert.equal(eligible(s),false);
});
test('three cartography socket layers true but overlay gate unresolved: no unlock',()=>{
 const s=fixture({board:true,wheel:true,overlay:true});
 s.puzzles.n3.routeOverlay.resolved=false;
 assert.equal(eligible(s),false);
});
test('one cartography layer absent: overlay false and no unlock',()=>{
 const s=fixture({board:true,wheel:true,overlay:false});
 s.puzzles.n3.routeOverlay.oldEstateSurvey=true;
 s.puzzles.n3.routeOverlay.cultPassageDiagram=true;
 assert.equal(eligible(s),false);
});
test('unrelated observation flags and Item possession are not new proof gates',()=>{
 const s=fixture({board:true,wheel:true,overlay:true});
 s.puzzles.n3.baggageLockerObserved=false;s.puzzles.n3.recentUseObserved=false;
 s.items['old-estate-survey']={recovered:false};
 assert.equal(eligible(s),true);
});
test('a previous branch-unlocked flag is not a requirement to evaluate the proof',()=>{
 const s=fixture({board:true,wheel:true,overlay:true,branch:true});
 assert.equal(eligible(s),true);
});
test('pure test cannot mutate unrelated project state',()=>{
 const s=fixture({board:true,wheel:true,overlay:true});
 const before=structuredClone(s);assert.equal(eligible(s),true);assert.deepEqual(s,before);
});
test('gate state remains distinct from travel and destination authorization',()=>{
 const s=fixture({board:true,wheel:true,overlay:true});
 assert.equal(eligible(s),true);
 assert.equal(Object.hasOwn(s.puzzles.n3,'n3ToT3TeleportInstalled'),false);
 assert.equal(s.puzzles.n3.t3BranchUnlocked,false);
});
console.log('N3 PROPOSED CONTRACT ONLY — no GM, Foundry, or ledger mutations');
