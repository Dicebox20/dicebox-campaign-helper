'use strict';
// Tests actual staged RegionBehavior source under mocked Foundry kernel. No live Foundry call.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),{test}=require('node:test');
const code=fs.readFileSync(path.join(__dirname,'cl91-n3-three-proof-gate-source-v001.js'),'utf8');
const AsyncFunction=Object.getPrototypeOf(async function(){}).constructor;
const execute=new AsyncFunction('event','game','CONST',code);
const TARGET="pHQvDUDlyWZFuNrX",REGION="RP1jYOH738xl9hks";
function fixture(options={}){
 const calls=[],ledger={
  revision:2,items:{'station-route-plate':{recovered:false}},
  puzzles:{n3:{departureBoardResolved:options.board??false,switchWheelInstalled:options.wheel??false,
   routeOverlay:{resolved:options.overlay??false},t3BranchUnlocked:options.unlocked??false},m1:{clockSettingResolved:false}}};
 const kernel={getFlag:()=>({stableId:'dbx:central-lodge:macro:runtime'}),execute:async ({speaker})=>{
  calls.push(speaker.dicebox);
  if(options.kernelRejected)return {status:'IGNORED_NON_PRIMARY_GM'};
  const request=speaker.dicebox;
  if(ledger.puzzles.n3.t3BranchUnlocked)return {status:'ALREADY_RESOLVED',noWrite:true};
  if(request.requirements.some(r=>{
   const value=r.path.split('.').reduce((v,k)=>v?.[k],ledger);
   return value!==r.equals;
  }))return {status:'REQUIREMENTS_NOT_MET',noWrite:true};
  ledger.puzzles.n3.t3BranchUnlocked=true;ledger.revision++;
  return{status:'PASS'};
 }};
 const actor={id:'actor1',testUserPermission:()=>options.owner??true};
 const token={id:'token1',actor,parent:{id:options.wrongScene?'WRONG':TARGET}};
 const game={scenes:{get:id=>id===TARGET?{regions:new Map([[REGION,{id:REGION}]])}:null},
  macros:{find:()=>options.noKernel?null:kernel}};
 const event={name:options.eventName??'tokenEnter',region:{id:options.wrongRegion?'OTHER':REGION},
  user:{id:'p',active:options.active??true,isGM:false},data:{token:options.noToken?null:token}};
 return {game,event,ledger,calls,CONST:{DOCUMENT_OWNERSHIP_LEVELS:{OWNER:3}}};
}
async function run(options={}){const f=fixture(options);await execute(f.event,f.game,f.CONST);return f}
test('actual source compiles; only gate, no teleport and no item pickup',()=>{
 assert.equal(typeof execute,'function');
 assert.equal(code.includes('teleportToken'),false);
 assert.equal(code.includes('createEmbeddedDocuments'),false);
 assert.equal(code.includes('action:"pickup"'),false);
 assert.equal(code.includes('tokenMoveIn'),false);
});
for(let bits=0;bits<8;bits++){
 const flags={board:!!(bits&1),wheel:!!(bits&2),overlay:!!(bits&4)};
 test('exact three-proof truth table '+bits,async()=>{
  const f=await run(flags);
  assert.equal(f.calls.length,1);
  assert.equal(f.calls[0].action,'gate');
  assert.equal(f.calls[0].trigger,'TOKEN_ENTER');
  assert.equal(f.calls[0].statePath,'puzzles.n3.t3BranchUnlocked');
  assert.deepEqual(f.calls[0].requirements,[
   {type:'state',path:'puzzles.n3.departureBoardResolved',equals:true},
   {type:'state',path:'puzzles.n3.switchWheelInstalled',equals:true},
   {type:'state',path:'puzzles.n3.routeOverlay.resolved',equals:true}
  ]);
  assert.equal(f.ledger.puzzles.n3.t3BranchUnlocked,bits===7);
  assert.equal(f.ledger.revision,bits===7?3:2);
  assert.equal(f.ledger.items['station-route-plate'].recovered,false);
 });
}
for(const [name,flags] of [
 ['no token',{noToken:true}],['wrong scene',{wrongScene:true}],
 ['wrong Region',{wrongRegion:true}],['wrong event',{eventName:'tokenExit'}],
 ['inactive requester',{active:false}],['not Actor owner',{owner:false}],
 ['kernel missing',{noKernel:true}]
]){
 test('fail closed: '+name,async()=>{
  const f=await run({board:true,wheel:true,overlay:true,...flags});
  assert.equal(f.calls.length,0);
  assert.equal(f.ledger.puzzles.n3.t3BranchUnlocked,false);
 });
}
test('kernel refused: does not falsely unlock',async()=>{
 const f=await run({board:true,wheel:true,overlay:true,kernelRejected:true});
 assert.equal(f.calls.length,1);assert.equal(f.ledger.revision,2);
 assert.equal(f.ledger.puzzles.n3.t3BranchUnlocked,false);
});
test('unlocked already: repeat enter leaves state and revision unchanged',async()=>{
 const f=await run({board:true,wheel:true,overlay:true,unlocked:true});
 assert.equal(f.calls.length,1);assert.equal(f.ledger.revision,2);
 assert.equal(f.ledger.puzzles.n3.t3BranchUnlocked,true);
});
test('no kernel-side side effect on failed prerequisites and no extra state setters',async()=>{
 const f=await run({board:true,wheel:false,overlay:true});
 assert.equal(f.ledger.puzzles.n3.t3BranchUnlocked,false);
 assert.equal(f.ledger.puzzles.m1.clockSettingResolved,false);
 assert.equal(f.ledger.items['station-route-plate'].recovered,false);
 assert.equal(f.ledger.revision,2);
});
console.log('N3 gate offline-only; player trigger, kernel runtime and teleport not tested.');
