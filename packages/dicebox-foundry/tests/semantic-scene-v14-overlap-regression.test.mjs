import test from 'node:test';
import assert from 'node:assert/strict';
import {convertSemanticSceneV14,SEMANTIC_SLICE_VERSION} from '../src/semantic-scene-v14-slice.js';
const bp=()=>({schemaVersion:SEMANTIC_SLICE_VERSION,
  source:{kind:'approved-spatial-blueprint',blueprintId:'dbx:blueprint:fixture-one',sha256:'a'.repeat(64),revision:3,approvalId:'approval:fixture-v001'},
  scene:{name:'Fixture',width:1024,height:768,grid:{type:1,size:64,distance:5,units:'ft'}},
  features:[
    {kind:'region',stableId:'dbx:region:entrance',name:'Entrance',polygon:[{x:100,y:100},{x:380,y:100},{x:380,y:380},{x:100,y:380}]},
    {kind:'light',stableId:'dbx:light:sconce',at:{x:400,y:250},brightDistance:10,dimDistance:20,color:'#ffeedd'},
    {kind:'wall',stableId:'dbx:wall:north',a:{x:100,y:100},b:{x:900,y:100}},
    {kind:'door',stableId:'dbx:door:east',a:{x:900,y:300},b:{x:900,y:400},state:'closed'}
  ]});
const wall=(id,a,b)=>({kind:'wall',stableId:`dbx:wall:${id}`,a,b});
const door=(id,a,b)=>({kind:'door',stableId:`dbx:door:${id}`,a,b,state:'closed'});
const p=(x,y)=>({x,y});
const reject=(name,item,code)=>test(name,()=>{
  const fixture=bp();fixture.features.push(item);
  assert.throws(()=>convertSemanticSceneV14(fixture),new RegExp(`SEMANTIC_V14_${code}`));
});
reject('rejects partially overlapping solid walls',wall('north-two',p(200,100),p(600,100)),'OVERLAPPING_SEGMENT');
reject('rejects reverse-direction partially overlapping solid walls',wall('north-three',p(700,100),p(300,100)),'OVERLAPPING_SEGMENT');
reject('rejects partially overlapping door portals',door('east-two',p(900,350),p(900,450)),'DOOR_PORTAL_OVERLAP');
reject('rejects crossing door portals',door('cross',p(850,350),p(950,350)),'DOOR_PORTAL_OVERLAP');
reject('rejects door endpoint touching another portal interior',door('touch',p(900,350),p(950,350)),'DOOR_PORTAL_OVERLAP');
test('allows solid walls joining at a shared endpoint',()=>{
  const fixture=bp();fixture.features.push(wall('east-join',p(900,100),p(900,200)));
  assert.equal(convertSemanticSceneV14(fixture).documents.Wall.length,3);
});
test('allows distinct door portals joining exactly at one endpoint',()=>{
  const fixture=bp();fixture.features.push(door('east-extension',p(900,400),p(900,450)));
  assert.equal(convertSemanticSceneV14(fixture).documents.Wall.length,3);
});
