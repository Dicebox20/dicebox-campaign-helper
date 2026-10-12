'use strict';
// Offline test only; executes the staged clock source with fully mocked Foundry interfaces.
// Does not call Foundry, a network service, or touch live campaign state.
const fs=require('node:fs'),path=require('node:path');
const {test}=require('node:test'),assert=require('node:assert/strict');
const s=fs.readFileSync(path.join(__dirname,'cl13-seventh-winter-clock-region-source-v001.js'),'utf8');
const AsyncFunction=Object.getPrototypeOf(async function(){}).constructor;
const run=new AsyncFunction('event','game','foundry','CONST',s);
const actor={id:'actor',testUserPermission:()=>true};
const token={id:'tok',uuid:'Scene.m1.Token.tok',parent:{id:'U8S5ZrTjaPIkTUIL'},actor};
const region={id:'3tIrR12uv8ppFkOb'};
const journalId='xhlXv6CCH34HVga3';
function mocks({answer={hour:4,minute:35},emblem=true,solved=false,owner=true,actorPresent=true,
 move=true,primary=true,eventName='tokenMoveIn',requesterActive=true,player=true,decline=false}={}){
 const state={revision:1,puzzles:{m1:{silverFamilyEmblemInstalled:emblem,clockSettingResolved:solved}}};
 const calls={input:0,prompt:0,query:0,writes:0,observed:0};
 const gm={id:primary?'A':'Z',name:'GM',active:true,isGM:true};
 const remote={id:player?'P':'A',active:requesterActive,isGM:!player};
 remote.query=async(type,details)=>{calls.query++;return decline?null:answer};
 const tokens=new Map([['tok',token]]);
 const scene={id:'U8S5ZrTjaPIkTUIL',tokens,regions:new Map([[region.id,region]])};
 const game={user:{id:'A',isGM:true},users:[gm,{id:'Z',active:true,isGM:true}],scenes:{get:id=>id===scene.id?scene:null},
 journal:{get:id=>id===journalId?{getFlag:()=>({state})}:null},
 macros:{find:()=>({execute:async({speaker})=>{calls.writes++;const p=speaker.dicebox;
   assert.equal(p.action,'observe');assert.equal(p.statePath,'puzzles.m1.clockSettingResolved');
   state.puzzles.m1.clockSettingResolved=true;calls.observed++;return {status:'PASS'};}})}};
 const foundry={utils:{getProperty:(obj,p)=>p.split('.').reduce((v,k)=>v?.[k],obj)},applications:{api:{DialogV2:{
 input:async()=>{calls.input++;return decline?null:answer},
 query:async()=>{calls.query++;return decline?null:answer},
 prompt:async()=>{calls.prompt++;return null}
 }}}};
 const event={name:eventName,region,user:remote,data:{token:actorPresent?{...token,actor:{...actor,testUserPermission:()=>owner}}:null,
 movement:{id:'move',origin:{x:1,y:2},destination:{x:move?7:1,y:move?3:2},user:remote}}};
 return {event,game,foundry,state,calls};
}
async function invoke(opts){delete globalThis.__diceboxM1ClockPending;const o=mocks(opts);
 await run(o.event,o.game,o.foundry,{DOCUMENT_OWNERSHIP_LEVELS:{OWNER:3}});return o;}
test('staged source compiles as Foundry async RegionBehavior',()=>assert.equal(typeof run,'function'));
test('correct player answer commits only named ledger flag',async()=>{
 const x=await invoke();assert.equal(x.state.puzzles.m1.clockSettingResolved,true);
 assert.equal(x.calls.writes,1);assert.equal(x.calls.query,1);
 assert.deepEqual(Object.keys(x.state.puzzles.m1).sort(),['clockSettingResolved','silverFamilyEmblemInstalled']);
});
test('wrong answer does not write or unlock',async()=>{
 const x=await invoke({answer:{hour:4,minute:30}});assert.equal(x.calls.writes,0);assert.equal(x.state.puzzles.m1.clockSettingResolved,false);});
test('cancel does not write',async()=>{const x=await invoke({decline:true});assert.equal(x.calls.writes,0)});
test('emblem prerequisite prevents dialog and write',async()=>{const x=await invoke({emblem:false});assert.equal(x.calls.query,0);assert.equal(x.calls.writes,0)});
test('already solved cannot write again',async()=>{const x=await invoke({solved:true});assert.equal(x.calls.query,0);assert.equal(x.calls.writes,0)});
test('tokenEnter is never an eligible player clock movement',async()=>{const x=await invoke({eventName:'tokenEnter'});assert.equal(x.calls.query,0);assert.equal(x.calls.writes,0)});
test('dimension-only movement rejected',async()=>{const x=await invoke({move:false});assert.equal(x.calls.query,0);assert.equal(x.calls.writes,0)});
test('inactive requester rejected',async()=>{const x=await invoke({requesterActive:false});assert.equal(x.calls.query,0);assert.equal(x.calls.writes,0)});
test('non-owning player cannot set clock',async()=>{const x=await invoke({owner:false});assert.equal(x.calls.query,0);assert.equal(x.calls.writes,0)});
test('nonprimary GM cannot open or write',async()=>{const x=await invoke({primary:false});assert.equal(x.calls.query,0);assert.equal(x.calls.writes,0)});
test('GM can operate clock directly when acting as requester',async()=>{const x=await invoke({player:false});assert.equal(x.calls.input,1);assert.equal(x.calls.writes,1)});
