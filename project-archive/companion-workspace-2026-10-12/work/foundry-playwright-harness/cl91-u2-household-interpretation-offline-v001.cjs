'use strict';
// Offline only. Tests the actual staged RegionBehavior source in mocked Foundry environment.
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const src=fs.readFileSync(path.join(__dirname,'cl91-u2-household-interpretation-source-v001.js'),'utf8');
const AsyncFunction=Object.getPrototypeOf(async function(){}).constructor;
const run=new AsyncFunction('event','game','CONST',src);
const sid="PVf6Gbrv9HbB88uZ",rid="qa4n4o834OZTKPoV";
function fixture(o={}){
 delete globalThis.__diceboxU2HistoryInterpretationLock;
 const calls={writes:0,events:[],failures:0};
 const state={revision:2,items:{'old-estate-survey':{recovered:false}},puzzles:{u2:{
  servantHistoryObserved:o.observed??true,
  servantHistoryInterpreted:o.interpreted??false}},
  notices:{
   'u2.servant-room-absence':o.servantRoom??{'actor-A':{attempted:true,success:false}},
   'u2.nursery-contradiction':o.nursery??{'actor-B':{attempted:true,success:false}}
  }};
 const actor={id:'actor-1',testUserPermission:()=>o.owner??true};
 const token={id:'token',parent:{id:sid},actor,x:o.drift?101:100,y:50};
 const scene={id:sid,regions:new Map([[rid,{id:rid}]]),tokens:new Map([['token',token]])};
 const gm={id:o.gmId??'A',isGM:true,active:true};
 const requester={id:'P',isGM:false,active:o.active??true};
 const game={user:{id:'A',isGM:true},users:[gm,requester],journal:{get:()=>({getFlag:()=>({state})})},
  scenes:{get:id=>id===sid?scene:null},
  macros:{find:()=>o.noKernel?null:{getFlag:()=>'',execute:async({speaker})=>{
   calls.writes++;calls.events.push(speaker.dicebox);
   if(o.kernelReject)return {status:'IGNORED_NON_PRIMARY_GM'};
   state.puzzles.u2.servantHistoryInterpreted=true;state.revision++;
   return {status:'PASS'};}}}};
 const movement={id:'m1',origin:{x:1,y:2},destination:{x:100,y:50},
  finished:o.finished??Promise.resolve(true)};
 const event={name:o.eventName??'tokenMoveIn',region:{id:rid},user:requester,
  data:{token:o.noToken?null:token,movement:o.noMovement?null:movement}};
 const CONST={DOCUMENT_OWNERSHIP_LEVELS:{OWNER:3}};
 return {calls,state,game,event,CONST};
}
async function check(o={}){const x=fixture(o);await run(x.event,x.game,x.CONST);return x}
test('staged RegionBehavior compiles and refers only to canonical stages',()=>{
 assert.equal(typeof run,'function');assert(src.includes('puzzles.u2.servantHistoryInterpreted'));
 assert(!src.includes('action:"pickup"'));assert(!src.includes('deleteEmbeddedDocuments'));
});
test('three independent physical visits allow interpretation even if Notice rolls failed',async()=>{
 const x=await check();assert.equal(x.calls.writes,1);
 assert.equal(x.state.puzzles.u2.servantHistoryInterpreted,true);
 assert.equal(x.state.items['old-estate-survey'].recovered,false);
 assert.equal(x.calls.events[0].action,'observe');
 assert.equal(x.calls.events[0].statePath,'puzzles.u2.servantHistoryInterpreted');
});
test('visits made by different Actors are party shareable',async()=>{
 const x=await check({servantRoom:{A:{attempted:true,success:false}},nursery:{B:{attempted:true,success:true}}});
 assert.equal(x.calls.writes,1);
});
for(const [name,overrides] of [
 ['servant room not visited',{servantRoom:{}}],
 ['nursery not visited',{nursery:{}}],
 ['servant traces not observed',{observed:false}],
 ['already interpreted',{interpreted:true}],
 ['irrelevant tokenEnter',{eventName:'tokenEnter'}],
 ['token missing',{noToken:true}],
 ['movement missing',{noMovement:true}],
 ['movement failed',{finished:Promise.resolve(false)}],
 ['movement promise rejected',{finished:Promise.reject(new Error('canceled'))}],
 ['token position changed',{drift:true}],
 ['requester inactive',{active:false}],
 ['not Actor owner',{owner:false}],
 ['nonprimary GM',{gmId:'Z'}],
 ['missing kernel',{noKernel:true}]
])test(name+' cannot commit',async()=>{
 const x=await check(overrides);assert.equal(x.calls.writes,0);
 assert.equal(x.state.puzzles.u2.servantHistoryInterpreted,overrides.interpreted??false);
});
test('kernel refusal does not falsely certify success',async()=>{
 const x=await check({kernelReject:true});assert.equal(x.calls.writes,1);
 assert.equal(x.state.puzzles.u2.servantHistoryInterpreted,false);
});
test('repeated movement after interpretation is idempotent',async()=>{
 const x=fixture();await run(x.event,x.game,x.CONST);await run(x.event,x.game,x.CONST);
 assert.equal(x.calls.writes,1);
});
console.log('OFFLINE SOURCE ONLY, no Foundry mutation or player gameplay test');
