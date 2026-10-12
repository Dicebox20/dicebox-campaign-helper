'use strict';
// No live Foundry connection; tests the new v002 source in a deterministic mock.
const fs=require('node:fs'),path=require('node:path');
const {test}=require('node:test'),assert=require('node:assert/strict');
const source=fs.readFileSync(path.join(__dirname,'cl13-seventh-winter-clock-region-source-v002.js'),'utf8');
const AsyncFunction=Object.getPrototypeOf(async function(){}).constructor;
const run=new AsyncFunction('event','game','foundry','CONST',source);
const SCENE='U8S5ZrTjaPIkTUIL',REGION='3tIrR12uv8ppFkOb',LEDGER='xhlXv6CCH34HVga3';
function fixture(overrides={}){
 const o={hour:4,minute:35,emblem:true,solved:false,owner:true,active:true,player:true,
   movementFinished:Promise.resolve(true),eventName:'tokenMoveIn',movementId:'move-A',
   movementXY:true,sourceMatches:true,correctPlacement:true,gmPrimary:true,actorPresent:true,
   kernelPresent:true,answerCancelled:false,queryThrows:false,requesterIsOtherGM:false,
   globalWriteFailure:false,...overrides};
 const state={revision:1,puzzles:{m1:{silverFamilyEmblemInstalled:o.emblem,clockSettingResolved:o.solved}}};
 const calls={queries:0,dialogInput:0,prompts:0,execute:0,committed:0};
 const actor={id:'actor-A',testUserPermission:()=>o.owner};
 const token={id:'token-A',x:o.correctPlacement?120:10,y:240,
   parent:{id:o.sourceMatches?SCENE:'another-scene'},actor:o.actorPresent?actor:null};
 const scene={id:SCENE,regions:new Map([[REGION,{id:REGION}]]),
   tokens:new Map([[token.id,token]])};
 const primary={id:o.gmPrimary?'gm-A':'gm-0',active:true,isGM:true};
 const nonPrimary={id:'gm-Z',active:true,isGM:true};
 const user={id:o.requesterIsOtherGM?'gm-Z':o.player?'player-A':'gm-A',
  active:o.active,isGM:o.requesterIsOtherGM||!o.player,
  query:async()=>{calls.queries++;if(o.queryThrows)throw Error('timed-out');return o.answerCancelled?null:{hour:o.hour,minute:o.minute};}};
 const game={user:{id:'gm-A',isGM:true},users:[primary,nonPrimary],
  scenes:{get:id=>id===SCENE?scene:null},
  journal:{get:id=>id===LEDGER?{getFlag:()=>({state})}:null},
  macros:{find:()=>o.kernelPresent?{execute:async({speaker})=>{
   calls.execute++;
   assert.equal(speaker.dicebox.action,'observe');
   assert.equal(speaker.dicebox.statePath,'puzzles.m1.clockSettingResolved');
   if(o.globalWriteFailure)return {status:'IGNORED_NON_PRIMARY_GM'};
   state.puzzles.m1.clockSettingResolved=true;calls.committed++;return {status:'PASS'};}}:null}};
 const foundry={utils:{getProperty:(x,p)=>p.split('.').reduce((v,k)=>v?.[k],x)},
  applications:{api:{DialogV2:{
   input:async()=>{calls.dialogInput++;return o.answerCancelled?null:{hour:o.hour,minute:o.minute};},
   prompt:async()=>{calls.prompts++;return null;}
  }}}};
 const movement={id:o.movementId,finished:o.movementFinished,
  origin:{x:o.movementXY?15:120,y:o.movementXY?20:240},destination:{x:120,y:240}};
 const event={name:o.eventName,region:{id:REGION},user,
  data:{token,movement}};
 const constants={DOCUMENT_OWNERSHIP_LEVELS:{OWNER:3}};
 return {o,state,calls,actor,token,scene,movement,game,foundry,event,constants};
}
async function invoke(o){delete globalThis.__diceboxM1SeventhWinterLock;const x=fixture(o);await run(x.event,x.game,x.foundry,x.constants);return x;}
test('v002 source compiles without Foundry or browser',()=>assert.equal(typeof run,'function'));
test('correct 4:35 grants canonical state but no Items',async()=>{
 const x=await invoke();assert.equal(x.calls.committed,1);
 assert.equal(x.state.puzzles.m1.clockSettingResolved,true);
 assert.deepEqual(Object.keys(x.state.puzzles.m1).sort(),['clockSettingResolved','silverFamilyEmblemInstalled']);
 assert.equal(x.calls.queries,1);
});
test('wrong minute cannot open clock',async()=>{const x=await invoke({minute:30});assert.equal(x.calls.committed,0);});
test('wrong hour cannot open clock',async()=>{const x=await invoke({hour:5});assert.equal(x.calls.committed,0);});
test('invalid input is rejected',async()=>{const x=await invoke({minute:'invalid'});assert.equal(x.calls.committed,0);});
test('cancel leaves state unchanged',async()=>{const x=await invoke({answerCancelled:true});assert.equal(x.calls.committed,0);});
test('emblem not inserted refuses prompt',async()=>{const x=await invoke({emblem:false});assert.equal(x.calls.queries,0);});
test('already solved is idempotent',async()=>{const x=await invoke({solved:true});assert.equal(x.calls.execute,0);});
test('tokenEnter does not prompt',async()=>{const x=await invoke({eventName:'tokenEnter'});assert.equal(x.calls.queries,0);});
test('resize/elevation-only movement refuses prompt',async()=>{const x=await invoke({movementXY:false});assert.equal(x.calls.queries,0);});
test('canceled movement does not prompt',async()=>{const x=await invoke({movementFinished:Promise.resolve(false)});assert.equal(x.calls.queries,0);});
test('rejected movement operation does not prompt',async()=>{const x=await invoke({movementFinished:Promise.reject(Error('canceled'))});assert.equal(x.calls.queries,0);});
test('stale position after movement fails closed',async()=>{const x=await invoke({correctPlacement:false});assert.equal(x.calls.queries,0);});
test('wrong scene fails closed',async()=>{const x=await invoke({sourceMatches:false});assert.equal(x.calls.queries,0);});
test('inactive player fails closed',async()=>{const x=await invoke({active:false});assert.equal(x.calls.queries,0);});
test('non-owner player fails closed',async()=>{const x=await invoke({owner:false});assert.equal(x.calls.queries,0);});
test('secondary GM cannot run canonical writer',async()=>{const x=await invoke({gmPrimary:false});assert.equal(x.calls.queries,0);});
test('other GM event does not silently trigger',async()=>{const x=await invoke({requesterIsOtherGM:true});assert.equal(x.calls.queries,0);});
test('missing Actor blocks attempt',async()=>{const x=await invoke({actorPresent:false});assert.equal(x.calls.queries,0);});
test('missing kernel blocks attempt',async()=>{const x=await invoke({kernelPresent:false});assert.equal(x.calls.queries,0);});
test('query timeout fails closed',async()=>{const x=await invoke({queryThrows:true});assert.equal(x.calls.execute,0);});
test('kernel refused write is not falsely certified',async()=>{const x=await invoke({globalWriteFailure:true});assert.equal(x.calls.committed,0);});
test('GM can directly enter hour/minute in local DialogV2',async()=>{const x=await invoke({player:false});assert.equal(x.calls.dialogInput,1);assert.equal(x.calls.committed,1);});
test('global lock released even after canceled answer',async()=>{
 const x=await invoke({answerCancelled:true});assert.equal(globalThis.__diceboxM1SeventhWinterLock.inFlight,false);
});
test('clock serializes concurrent Tokens on one GM client',async()=>{
 delete globalThis.__diceboxM1SeventhWinterLock;
 let release;const blocker=new Promise(resolve=>{release=resolve;});
 const a=fixture({movementFinished:blocker});
 const b=fixture();
 const first=run(a.event,a.game,a.foundry,a.constants);
 await Promise.resolve(); // first holds clock lock awaiting its movement
 await run(b.event,b.game,b.foundry,b.constants);
 assert.equal(b.calls.queries,0);
 release(true);await first;
 assert.equal(a.calls.committed,1);
 assert.equal(globalThis.__diceboxM1SeventhWinterLock.inFlight,false);
});
console.log('OFFLINE ONLY: Foundry runtime event delivery and actual player acceptance untested.');
