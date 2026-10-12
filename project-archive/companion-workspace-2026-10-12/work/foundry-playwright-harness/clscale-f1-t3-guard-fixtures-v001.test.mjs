import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const root=String.raw`C:\Users\rujie\Documents\Codex\DiceBox Campaign Helper`;
const w=path.join(root,'work','foundry-playwright-harness');
const snapshot=JSON.parse(fs.readFileSync(path.join(root,'outputs','foreman-checkpoints','clscale-f1-arrival-source-readonly-v001.json'),'utf8'));
const contract=JSON.parse(fs.readFileSync(path.join(w,'clscale-f1-arrival-contract-v001.json'),'utf8'));
const body=fs.readFileSync(path.join(w,'clscale-f1-t3-guard-proposed-v001.js'),'utf8');
const actualHash=crypto.createHash('sha256').update(body).digest('hex');
assert.equal(actualHash,contract.t3ProposedSourceSHA);
assert.equal(contract.installed,false);
const AsyncFunction=Object.getPrototypeOf(async function(){}).constructor;
const runScript=new AsyncFunction('event','game','foundry','ui','CONST','globalThis',body);
const f1Source=snapshot.scenes.find(x=>x.id==='La9krMOMBhAhDLi6').source;
const originalT3=snapshot.scenes.find(x=>x.id==='aIKQmFiuXWipEdyb').source;
const origBehavior=originalT3.regions.find(r=>r._id==='Tkg7XpsF7X1P3ZVJ').behaviors.find(b=>b._id==='tSqhDN5CtAHzccmf');
assert.equal(origBehavior.system.source.includes('placement:"random",snap:false,pan:true'),true);
assert.equal(body.includes('placement:"center",snap:false,pan:true'),true);

function fixtures(o={}){
  const calls={confirm:0,teleport:0,pull:0,warn:0,notes:[]};
  const id='La9krMOMBhAhDLi6';
  const gm={id:'gm',name:'GM',active:true,isGM:true};
  const users=[gm];users.get=id=>users.find(u=>u.id===id);
  const actor={id:'TestActor',uuid:'Actor.TestActor',testUserPermission:()=>false};
  const token={id:'TestT',actor,width:o.width??1,height:o.height??1};
  const srcReg={id:'Tkg7XpsF7X1P3ZVJ',getFlag:()=>({destinationStableSceneId:o.sourceStable??'dbx:central-lodge:f1'})};
  const srcScene={id:'aIKQmFiuXWipEdyb',regions:new Map([[srcReg.id,srcReg]])};
  const reg={id:'zKNU1R3JGIMMt017',parent:null,getFlag:()=>({stableId:o.destStable??'dbx:central-lodge:f1:region:transition:t3-arrival'}),behaviors:new Map(),shapes:[{type:'rectangle',x:2390,y:1860,width:280,height:280,rotation:0}]};
  if(o.changeShape)reg.shapes[0].y=2357;
  if(o.hasRegionBehavior)reg.behaviors.set('x',{disabled:false});
  const walls=f1Source.walls.map(w=>({c:w.c,move:w.move,door:w.door,ds:w.ds}));
  if(o.wallHit)walls[0]={c:[2410,1900,2650,1900],move:20,door:0,ds:0};
  const destTokens=[{id:'meow',x:2524,y:2151,width:1,height:1}];
  if(o.occupied)destTokens.push({id:'other',x:2410,y:1880,width:1,height:1});
  const target={id,grid:{size:o.grid??240,type:0,distance:5,units:'ft'},tokens:destTokens,walls:new Set(walls),regions:new Map(),pullUsers:async()=>{calls.pull++;}};
  reg.parent=target;
  target.regions.set(reg.id,reg);
  for(let i=0;i<(o.badCount?4:5);i++)target.regions.set('extra'+i,{id:'extra'+i});
  reg.teleportToken=async (tok,opts)=>{calls.teleport++;calls.options=opts;return tok;};
  const game={user:o.nonGM?{id:'fake',isGM:false}:gm,users,scenes:new Map([[srcScene.id,srcScene],[target.id,target]])};
  const foundry={applications:{api:{DialogV2:{confirm:async()=>{calls.confirm++;if(o.growDuringConfirm)token.width=2;if(o.gmGoesOffline)gm.active=false;if(o.actorSwap)token.actor={uuid:'Actor.Other',id:'Other'};return o.decline?false:true;}}}}};
  const ui={notifications:{warn:(t)=>{calls.warn++;calls.notes.push(t);}}};
  const event={region:{parent:srcScene},data:{token},user:{id:'gm'}};
  return{calls,run:async()=>runScript(event,game,foundry,ui,{DOCUMENT_OWNERSHIP_LEVELS:{OWNER:3}},{}),token,target,reg};
}

test('source is generated from exact installed T3 and F1 hashes',()=>{
  assert.equal(snapshot.ledger.revision,13);
  assert.equal(snapshot.scenes.find(x=>x.id==='La9krMOMBhAhDLi6').sha,contract.authoritativeF1SceneSha);
  assert.equal(snapshot.scenes.find(x=>x.id==='aIKQmFiuXWipEdyb').sha,contract.t3SceneSha);
});

test('one-square valid placement uses deterministic centered 240px token and GM confirm',async()=>{
 const f=fixtures();await f.run();
 assert.equal(f.calls.confirm,1);assert.equal(f.calls.teleport,1);
 assert.deepEqual(f.calls.options,{placement:'center',snap:false,pan:true});
 assert.equal(f.calls.pull,0);assert.equal(f.calls.warn,0);
});

for(const [name,config] of[
 ['2x2 refused before dialog',{width:2,height:2}],
 ['1x2 refused before dialog',{width:1,height:2}],
 ['0x1 refused before dialog',{width:0,height:1}],
 ['wrong destination grid fail-closed',{grid:120}],
 ['moved destination Region fail-closed',{changeShape:true}],
 ['unexpected arrival Region behavior fail-closed',{hasRegionBehavior:true}],
 ['Region roster drift fail-closed',{badCount:true}],
 ['wrong stable destination fail-closed',{destStable:'wrong'}],
 ['wrong stable source fail-closed',{sourceStable:'wrong'}],
]){
 test(name,async()=>{
  const f=fixtures(config);await f.run();
  assert.equal(f.calls.teleport,0);assert.equal(f.calls.pull,0);assert.equal(f.calls.confirm,0);
 });
}
test('occupied arrival refuses after GM confirmation and preserves token',async()=>{
 const f=fixtures({occupied:true});await f.run();
 assert.equal(f.calls.confirm,1);assert.equal(f.calls.teleport,0);assert.equal(f.calls.pull,0);assert.equal(f.calls.warn,1);
});
test('solid Wall crossing landing refuses after GM confirmation',async()=>{
 const f=fixtures({wallHit:true});await f.run();
 assert.equal(f.calls.confirm,1);assert.equal(f.calls.teleport,0);assert.equal(f.calls.pull,0);assert.equal(f.calls.warn,1);
});
test('GM refusal leaves travel off',async()=>{
 const f=fixtures({decline:true});await f.run();
 assert.equal(f.calls.confirm,1);assert.equal(f.calls.teleport,0);assert.equal(f.calls.pull,0);
});
test('non-primary/non-GM execution never proposes travel',async()=>{
 const f=fixtures({nonGM:true});await f.run();
 assert.equal(f.calls.confirm,0);assert.equal(f.calls.teleport,0);
});
for(const [name,config] of [
 ['1x1 grows to 2x1 while modal open',{growDuringConfirm:true}],
 ['GM changes while modal open',{gmGoesOffline:true}],
 ['token actor changes while modal open',{actorSwap:true}]
]){
 test(name,async()=>{
  const f=fixtures(config);await f.run();
  assert.equal(f.calls.confirm,1);
  assert.equal(f.calls.teleport,0);
  assert.equal(f.calls.pull,0);
  assert.equal(f.calls.warn,1);
 });
}
test('static expected landing is clear of actual Walls and Meow token',()=>{
 const footprint=[2410,1880,240,240],tok=[2524,2151,240,240];
 const overlap=(a,b)=>a[0]<b[0]+b[2]&&a[0]+a[2]>b[0]&&a[1]<b[1]+b[3]&&a[1]+a[3]>b[1];
 assert.equal(overlap(footprint,tok),false);
 assert.equal(footprint[1]>=1843,true);
 assert.equal(footprint[1]+footprint[3]<=2640,true);
 assert.equal(f1Source.regions.find(r=>r._id==='zKNU1R3JGIMMt017').behaviors.length,0);
 assert.equal(f1Source.walls.length,27);
});

