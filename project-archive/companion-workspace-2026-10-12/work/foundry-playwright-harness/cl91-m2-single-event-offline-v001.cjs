'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const dir=__dirname,source=fs.readFileSync(path.join(dir,'cl91-m2-founder-portrait-serialized-source-v001.js'),'utf8');
const notice=fs.readFileSync(path.join(dir,'cl91-m2-notice-original-v001.js'),'utf8');
const signet=fs.readFileSync(path.join(dir,'cl91-m2-signet-original-v001.js'),'utf8');
const hash=s=>crypto.createHash('sha256').update(s,'utf8').digest('hex');
const AsyncFunction=Object.getPrototypeOf(async function(){}).constructor;
const run=new AsyncFunction('event','game','CONST',source);
function fixture(opts={}){
 delete globalThis.__diceboxM2FounderPortraitQueue;
 const calls={actions:[],active:0,maxActive:0,noticeAttempts:0};
 const ledgerState={revision:2,puzzles:{m2:{founderPortraitObserved:opts.observed??false,founderPortraitOpened:false}},
  items:{'old-estate-survey':{recovered:false}},notices:{}};
 const journal={getFlag:()=>({state:ledgerState})};
 const k={getFlag:()=> ({stableId:'dbx:central-lodge:macro:runtime'}),execute:async({speaker})=>{
  const req=speaker.dicebox;calls.actions.push(req);calls.active++;calls.maxActive=Math.max(calls.active,calls.maxActive);
  try {
   if(opts.delayNotice&&req.action==='notice')await opts.delayNotice();
   await Promise.resolve();
   if(req.action==='notice'){
    calls.noticeAttempts++;
    if(opts.noticeRefused)return {status:'IGNORED_NON_PRIMARY_GM'};
    if(calls.noticeAttempts===1&&!opts.alreadyAttempted){ledgerState.notices.portrait={attempted:true,success:!opts.noticeFailed};ledgerState.revision++;return {status:'PASS',success:!opts.noticeFailed}}
    return {status:'ALREADY_ATTEMPTED',success:false};
   }
   if(req.action==='observe'){
    if(opts.observeRefused)return {status:'IGNORED_NON_PRIMARY_GM'};
    ledgerState.puzzles.m2.founderPortraitObserved=true;ledgerState.revision++;return {status:'PASS'};
   }
   if(req.action==='pickup'){
    if(opts.pickupRefused)return {status:'IGNORED_NON_PRIMARY_GM'};
    ledgerState.puzzles.m2.founderPortraitOpened=true;ledgerState.items['old-estate-survey'].recovered=true;ledgerState.revision++;
    return {status:'PASS'};
   }
   throw Error('unexpected action '+req.action)
  }finally{calls.active--;}
 }};
 const users=[{id:opts.primaryOverride??'A',active:true,isGM:true},{id:'B',active:true,isGM:false}];
 const game={user:{id:'A',isGM:true},users,
 scenes:{get:()=>({id:'JZkxX6lUQe8Nc8xJ'})},
 journal:{get:()=>journal},macros:{find:f=>f(k)?k:null}};
 function event(id='t1',hasSignet=opts.signet??false) {
  const actor={id:'actor-'+id,items:hasSignet?[{getFlag:()=> ({stableId:'dbx:central-lodge:item:founders-signet'})}]:[],
    testUserPermission:()=>opts.owner??true};
  const token={id,parent:{id:opts.wrongScene?'OTHER':'JZkxX6lUQe8Nc8xJ'},actor};
  return {name:opts.eventName??'tokenEnter',region:{id:'FRY091GwobgD2M5i'},
   data:{token},user:{id:'B',active:true,isGM:false}};
 }
 return {game,state:ledgerState,calls,event,CONST:{DOCUMENT_OWNERSHIP_LEVELS:{OWNER:3}}};
}
async function invoke(opts={}){const a=fixture(opts);await run(a.event(),a.game,a.CONST);return a}
test('source compiles and nests both original bodies verbatim',()=>{
 assert.equal(typeof run,'function');assert.equal(source.includes(notice),true);assert.equal(source.includes(signet),true);
 assert.equal(hash(notice),'49c934bb7ef15bfeddfb6d0f76564fa7b69764a3b3b24ec043feafe1aa5a9a46');
 assert.equal(hash(signet),'bbf7de80e832e453ff9c284b36194a42a7190d18847e29be1d5b49b654a09ec2');
});
test('without Signet records portrait observation but cannot open or grant Item',async()=>{
 const x=await invoke();assert.deepEqual(x.calls.actions.map(a=>a.action),['notice','observe']);
 assert.equal(x.state.puzzles.m2.founderPortraitObserved,true);
 assert.equal(x.state.puzzles.m2.founderPortraitOpened,false);
 assert.equal(x.state.items['old-estate-survey'].recovered,false);
});
test('Signet path performs original Notice, observe, then original pickup',async()=>{
 const x=await invoke({signet:true});assert.deepEqual(x.calls.actions.map(a=>a.action),['notice','observe','pickup']);
 assert.equal(x.state.puzzles.m2.founderPortraitOpened,true);
 assert.equal(x.state.items['old-estate-survey'].recovered,true);
 assert.equal(x.calls.actions[2].itemKey,'old-estate-survey');
 assert.equal(x.calls.actions[2].statePath,'puzzles.m2.founderPortraitOpened');
 assert.equal(x.calls.actions[2].persistentPickup,true);
});
test('failed one-time Notice roll does not block observation or Signet',async()=>{
 const x=await invoke({signet:true,noticeFailed:true});
 assert.equal(x.calls.actions.length,3);assert.equal(x.state.puzzles.m2.founderPortraitObserved,true);
 assert.equal(x.state.puzzles.m2.founderPortraitOpened,true);
});
test('ALREADY_ATTEMPTED Notice can still observe and pick up',async()=>{
 const x=await invoke({signet:true,alreadyAttempted:true});
 assert.equal(x.state.puzzles.m2.founderPortraitObserved,true);
 assert.equal(x.state.puzzles.m2.founderPortraitOpened,true);
});
test('repeat entry only records observation first time',async()=>{
 const x=fixture();await run(x.event(),x.game,x.CONST);await run(x.event(),x.game,x.CONST);
 assert.deepEqual(x.calls.actions.map(a=>a.action),['notice','observe','notice']);
});
test('preexisting observed true allows direct Notice then Signet, never forces observe',async()=>{
 const x=await invoke({signet:true,observed:true});assert.deepEqual(x.calls.actions.map(a=>a.action),['notice','pickup']);
});
test('kernel notice refusal fail closed, not silently grant survey',async()=>{
 const x=await invoke({signet:true,noticeRefused:true});assert.equal(x.calls.actions.length,1);
 assert.equal(x.state.items['old-estate-survey'].recovered,false);
});
test('kernel observation refusal fail closed, Signet not auto-awarded',async()=>{
 const x=await invoke({signet:true,observeRefused:true});assert.equal(x.calls.actions.length,2);
 assert.equal(x.state.items['old-estate-survey'].recovered,false);
});
test('kernel pickup refusal does not claim reward/physical opening',async()=>{
 const x=await invoke({signet:true,pickupRefused:true});assert.equal(x.calls.actions.length,3);
 assert.equal(x.state.items['old-estate-survey'].recovered,false);
 assert.equal(x.state.puzzles.m2.founderPortraitOpened,false);
});
for(const [name,opts] of [['not primary GM',{primaryOverride:'Z'}],['not owner',{owner:false}],['wrong scene',{wrongScene:true}],['irrelevant event',{eventName:'tokenExit'}]]){
 test(name+' does not start writes',async()=>{const x=await invoke(opts);assert.equal(x.calls.actions.length,0);});
}
test('multiple simultaneous entries serialize their kernel calls on one GM',async()=>{
 let release;const hold=new Promise(ok=>release=ok);let first=true;
 const x=fixture({signet:true,delayNotice:()=>{if(first){first=false;return hold}}});
 const p1=run(x.event('one',true),x.game,x.CONST);
 const p2=run(x.event('two',true),x.game,x.CONST);
 await Promise.resolve();await Promise.resolve();
 assert.equal(x.calls.actions.length,1,'second Actor blocked behind first queued handler');
 release();await Promise.all([p1,p2]);
 assert.equal(x.calls.maxActive,1);
 assert.deepEqual(x.calls.actions.map(a=>a.action),['notice','observe','pickup','notice','pickup']);
});
console.log('OFFLINE ONLY: no live GM/token event or Item state was changed');
