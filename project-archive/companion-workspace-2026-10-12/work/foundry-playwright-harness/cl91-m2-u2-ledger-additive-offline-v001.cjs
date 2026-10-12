'use strict';
// CL91 offline-only additive ledger schema migration model; never calls Foundry.
const {test}=require('node:test'),assert=require('node:assert/strict');
const clone=o=>structuredClone(o);
const expectedBeforeHash='8ea18562658ee2a255f2f17401424af160ad62de5ec5ff44f997b570a8a2cec7';
function state(){return {schemaVersion:'1.0',revision:1,initializedAt:'2026-10-07T00:00Z',updatedAt:'old',
 items:{'old-estate-survey':{recovered:false,other:'retained'},'founders-signet':{recovered:false}},
 notices:{e1:{seen:true}},railway:{power:false},routes:{r1:null},compatibility:{other:42},
 puzzles:{m1:{clockSettingResolved:false},m2:{founderPortraitObserved:false,reliquaryUnlocked:false},
 u2:{servantHistoryInterpreted:false,nurseryContradictionNoticeResolved:false},n3:{t3BranchUnlocked:false}},
 foreignState:{important:true,deep:{keep:[1,2,3]}}};}
function migrate(input,{sha=expectedBeforeHash,rev=1,user='Assistant Gamemaster',primaryUserKnown=true,noPlayers=true,
 codeHashesKnown=true,targetLedgerKnown=true}={}){
 if(sha!==expectedBeforeHash||rev!==1||user!=='Assistant Gamemaster'||!primaryUserKnown||!noPlayers||!codeHashesKnown||!targetLedgerKnown)
  return {status:'BLOCK_PRECONDITION'};
 if(input?.revision!==1||!input.puzzles?.m2||!input.puzzles?.u2)return {status:'BLOCK_STATE'};
 if(Object.hasOwn(input.puzzles.m2,'founderPortraitOpened')||Object.hasOwn(input.puzzles.u2,'servantHistoryObserved'))
  return {status:'BLOCK_ALREADY_PRESENT'};
 if(input.puzzles.m2.founderPortraitObserved!==false||input.puzzles.u2.servantHistoryInterpreted!==false)return {status:'BLOCK_STAGE_DRIFT'};
 const next=clone(input);next.puzzles.m2.founderPortraitOpened=false;next.puzzles.u2.servantHistoryObserved=false;
 next.revision=2;next.updatedAt='2026-10-08T14:30Z';
 return {status:'STAGED_ONLY',next};
}
test('stages two additive, false narrative flags',()=>{
 const original=state(),before=clone(original),r=migrate(original);
 assert.equal(r.status,'STAGED_ONLY');assert.equal(r.next.puzzles.m2.founderPortraitOpened,false);
 assert.equal(r.next.puzzles.u2.servantHistoryObserved,false);assert.deepEqual(original,before);
});
test('preserves physical portrait stage separate from noticing it',()=>{
 const r=migrate(state());assert.equal(r.next.puzzles.m2.founderPortraitObserved,false);
 assert.equal(r.next.puzzles.m2.founderPortraitOpened,false);
});
test('preserves traces observed separate from history interpreted',()=>{
 const r=migrate(state());assert.equal(r.next.puzzles.u2.servantHistoryObserved,false);
 assert.equal(r.next.puzzles.u2.servantHistoryInterpreted,false);
});
test('retains every unrelated nested field and Item',()=>{
 const a=state(),b=migrate(a).next;
 delete b.puzzles.m2.founderPortraitOpened;delete b.puzzles.u2.servantHistoryObserved;
 b.revision=a.revision;b.updatedAt=a.updatedAt;assert.deepEqual(b,a);
});
test('no automatic source edits or Item grants',()=>{
 const r=migrate(state());assert.equal(r.next.items['old-estate-survey'].recovered,false);
 assert.equal(r.next.items['founders-signet'].recovered,false);
});
for(const [name,opt] of [
 ['unexpected source fingerprint',{sha:'stale'}],
 ['unexpected revision',{rev:0}],
 ['different GM',{user:'Player 1'}],
 ['unknown executor',{primaryUserKnown:false}],
 ['player connected',{noPlayers:false}],
 ['source hash changed',{codeHashesKnown:false}],
 ['wrong ledger',{targetLedgerKnown:false}]
])test('fail closed for '+name,()=>assert.equal(migrate(state(),opt).status,'BLOCK_PRECONDITION'));
test('already present M2 key fails without overwriting true values',()=>{
 const a=state();a.puzzles.m2.founderPortraitOpened=true;
 assert.equal(migrate(a).status,'BLOCK_ALREADY_PRESENT');
 assert.equal(a.puzzles.m2.founderPortraitOpened,true);
});
test('already present U2 key fails',()=>{
 const a=state();a.puzzles.u2.servantHistoryObserved=false;assert.equal(migrate(a).status,'BLOCK_ALREADY_PRESENT');
});
test('existing state change fails',()=>{
 const a=state();a.puzzles.m2.founderPortraitObserved=true;assert.equal(migrate(a).status,'BLOCK_STAGE_DRIFT');
});
test('missing canonical actor story state fails',()=>{
 const a=state();delete a.puzzles.m2;assert.equal(migrate(a).status,'BLOCK_STATE');
});
console.log('OFFLINE SCHEMA MODEL ONLY: no Foundry runtime state was touched');
