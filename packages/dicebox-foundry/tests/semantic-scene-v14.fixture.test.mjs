import test from 'node:test';
import assert from 'node:assert/strict';
import {convertSemanticSceneV14,previewSemanticSceneForActiveGm,
  SEMANTIC_SLICE_VERSION} from '../src/semantic-scene-v14-slice.js';
const good=()=>({
 schemaVersion:SEMANTIC_SLICE_VERSION,
 source:{kind:'approved-spatial-blueprint',blueprintId:'dbx:blueprint:fixture-one',
   sha256:'a'.repeat(64),revision:3,approvalId:'approval:fixture-v001'},
 scene:{name:'Fixture chamber',width:1024,height:768,
   grid:{type:1,size:64,distance:5,units:'ft'}},
 features:[
   {kind:'region',stableId:'dbx:region:entrance',name:'Entrance area',
     polygon:[{x:100,y:100},{x:380,y:100},{x:380,y:380},{x:100,y:380}]},
   {kind:'light',stableId:'dbx:light:sconce',at:{x:400,y:250},
     brightDistance:10,dimDistance:20,color:'#ffeedd'},
   {kind:'wall',stableId:'dbx:wall:north',a:{x:100,y:100},b:{x:900,y:100}},
   {kind:'door',stableId:'dbx:door:east',a:{x:900,y:300},b:{x:900,y:400},state:'closed'}
 ]
});
const fixtureRuntime=()=>({game:{version:'14.369',world:{id:'dbx-disposable-fixture'},
  user:{id:'gm-fixture',isGM:true},users:{activeGM:{id:'gm-fixture'}},
  scenes:{create(){throw new Error('MUTATION_FORBIDDEN');}}}});
const fixtureAuthorization=()=>({worldId:'dbx-disposable-fixture',currentSingleWriterId:'gm-fixture',
 activeGmId:'gm-fixture',approvedBlueprintSha256:'a'.repeat(64),approvedBlueprintId:'dbx:blueprint:fixture-one'});
function bad(name,modify){test(`rejects ${name}`,()=>{
  const x=good();modify(x);assert.throws(()=>convertSemanticSceneV14(x),/^Error: SEMANTIC_V14_/);
});}
function gate(name,mutate){test(`preflight rejects ${name}`,()=>{
 const b=good(),r=fixtureRuntime(),a=fixtureAuthorization();mutate(b,r,a);
 assert.throws(()=>previewSemanticSceneForActiveGm(b,r,a),/^Error: SEMANTIC_V14_/);
});}

test('dry-run converts one wall, one door, one light and one Region into v14-shaped data',()=>{
 const x=good(),original=structuredClone(x);
 const out=convertSemanticSceneV14(x);
 assert.equal(out.writesAllowed,false);assert.equal(out.approvedForInstallation,false);
 assert.equal(out.evidenceClass,'fixture');assert.equal(out.foundryScene.width,1024);
 assert.deepEqual(out.foundryScene.walls[0].c,[900,300,900,400]);
 assert.deepEqual(out.foundryScene.walls[1].c,[100,100,900,100]);
 assert.equal(out.foundryScene.walls[0].door,1);
 assert.equal(out.foundryScene.walls[0].ds,0);
 assert.equal(out.foundryScene.walls[1].door,0);
 assert.equal(out.foundryScene.lights[0].config.bright,10);
 assert.equal(out.foundryScene.lights[0].config.dim,20);
 assert.equal(out.foundryScene.lights[0].walls,true);
 assert.deepEqual(out.foundryScene.regions[0].shapes[0].points,
  [100,100,380,100,380,380,100,380,100,100]);
 assert.deepEqual(out.foundryScene.regions[0].behaviors,[]);
 assert.equal(out.foundryScene.regions[0].flags['dicebox-campaign-helper'].source,'approved-spatial-blueprint');
 assert.deepEqual(x,original,'pure conversion must not mutate input');
});
test('deterministic feature order and stable source flags',()=>{
 const x=good(),a=convertSemanticSceneV14(x);
 x.features.reverse();const b=convertSemanticSceneV14(x);
 assert.deepEqual(b,a);
});
test('active GM preview is no-write and does not call scene creation',()=>{
 const out=previewSemanticSceneForActiveGm(good(),fixtureRuntime(),fixtureAuthorization());
 assert.equal(out.writesAllowed,false);assert.equal(out.approvedForInstallation,false);
});
test('illustration does not supply geometry: only explicit Spatial Blueprint points are used',()=>{
 const x=good();const out=convertSemanticSceneV14(x);
 assert.equal(out.foundryScene.background,undefined);
 assert.equal(out.foundryScene.tiles,undefined);
 assert.deepEqual(out.foundryScene.walls[0].c,[900,300,900,400]);
});

const rootCases=[
 ['unknown version',x=>x.schemaVersion='v13'],
 ['missing version',x=>delete x.schemaVersion],
 ['extra root key',x=>x.imageGeometry={walls:[]}],
 ['null source',x=>x.source=null],
 ['wrong source kind',x=>x.source.kind='illustration'],
 ['missing approval',x=>delete x.source.approvalId],
 ['improper approval id',x=>x.source.approvalId='test'],
 ['missing blueprint sha',x=>x.source.sha256=''],
 ['uppercase blueprint sha',x=>x.source.sha256='A'.repeat(64)],
 ['invalid blueprint id',x=>x.source.blueprintId='fixture'],
 ['missing source revision',x=>delete x.source.revision],
 ['revision zero',x=>x.source.revision=0],
 ['revision fraction',x=>x.source.revision=1.5],
 ['extra source key',x=>x.source.rendererGeometry='from-image'],
 ['scene width zero',x=>x.scene.width=0],
 ['scene width fraction',x=>x.scene.width=512.5],
 ['scene width Infinity',x=>x.scene.width=Infinity],
 ['scene height negative',x=>x.scene.height=-1],
 ['scene height NaN',x=>x.scene.height=NaN],
 ['scene name missing',x=>x.scene.name=''],
 ['unknown scene field',x=>x.scene.background='map.png'],
 ['grid type unsupported',x=>x.scene.grid.type=0],
 ['grid size below minimum',x=>x.scene.grid.size=1],
 ['grid size fraction',x=>x.scene.grid.size=49.5],
 ['grid distance zero',x=>x.scene.grid.distance=0],
 ['grid units invalid',x=>x.scene.grid.units='pixels'],
 ['unknown grid field',x=>x.scene.grid.foo=true],
 ['missing region feature',x=>x.features=x.features.filter(f=>f.kind!=='region')],
 ['missing wall feature',x=>x.features=x.features.filter(f=>f.kind!=='wall')],
 ['feature count cap',x=>x.features=Array.from({length:65},(_,i)=>({...x.features[2],stableId:`dbx:wall:test-${i}`}))],
 ['duplicate stable id',x=>x.features[1].stableId=x.features[2].stableId],
 ['unsafe feature kind',x=>x.features[2].kind='macro'],
 ['feature type mismatch',x=>x.features[2].stableId='dbx:door:foreign'],
 ['unknown feature field',x=>x.features[2].sourceFromPixels='yes'],
 ['zero-length wall',x=>x.features[2].b={...x.features[2].a}],
 ['wall beyond bounds',x=>x.features[2].a.x=99999],
 ['wall negative Y',x=>x.features[2].a.y=-1],
 ['wall NaN coordinate',x=>x.features[2].a.y=NaN],
 ['extra point field',x=>x.features[2].a.source='pixel-sample'],
 ['duplicated reversed wall segment',x=>x.features[3]={kind:'door',stableId:'dbx:door:east',a:{x:900,y:100},b:{x:100,y:100},state:'closed'}],
 ['door partly overlapping a solid wall',x=>{x.features[3].a={x:500,y:100};x.features[3].b={x:600,y:100};}],
 ['door crossing a solid wall',x=>{x.features[3].a={x:500,y:50};x.features[3].b={x:500,y:150};}],
 ['open door state not in conservative slice',x=>x.features[3].state='open'],
 ['door untrusted lock field',x=>x.features[3].locked=true],
 ['door missing state',x=>delete x.features[3].state],
 ['light outside canvas',x=>x.features[1].at.y=769],
 ['light color named unsupported',x=>x.features[1].color='gold'],
 ['light color malformed hex',x=>x.features[1].color='#ffff'],
 ['light bright distance negative',x=>x.features[1].brightDistance=-2],
 ['light dim distance zero',x=>x.features[1].dimDistance=0],
 ['light bright exceeds dim',x=>x.features[1].brightDistance=25],
 ['light radius Infinity',x=>x.features[1].dimDistance=Infinity],
 ['light injected wall field',x=>x.features[1].walls=false],
 ['region name empty',x=>x.features[0].name='  '],
 ['region polygon missing',x=>delete x.features[0].polygon],
 ['region polygon too few vertices',x=>x.features[0].polygon=x.features[0].polygon.slice(0,2)],
 ['region polygon repeated point',x=>x.features[0].polygon[3]={...x.features[0].polygon[0]}],
 ['region polygon zero area',x=>x.features[0].polygon=[{x:100,y:100},{x:200,y:200},{x:300,y:300}]],
 ['region polygon self intersection',x=>x.features[0].polygon=[{x:100,y:100},{x:380,y:380},{x:100,y:380},{x:380,y:100}]],
 ['region polygon outside scene',x=>x.features[0].polygon[2].x=1800],
 ['region polygon hole injection',x=>x.features[0].hole=true],
 ['region arbitrary behavior execution',x=>x.features[0].behaviors=[{type:'executeScript'}]],
 ['region polygon point extra field',x=>x.features[0].polygon[1].z=5],
 ['region giant polygon',x=>x.features[0].polygon=Array.from({length:33},(_,i)=>({x:100+i*2,y:100+i*2}))],
 ['null feature',x=>x.features[1]=null],
 ['non-plain root object',x=>Object.setPrototypeOf(x, {bad:true})],
];
for(const [name,fn] of rootCases) bad(name,fn);

const gateCases=[
 ['non GM',(_b,r)=>r.game.user.isGM=false],
 ['missing selected id',(_b,r)=>r.game.user.id=''],
 ['other active GM',(_b,r)=>r.game.users.activeGM.id='gm-other'],
 ['missing active GM',(_b,r)=>delete r.game.users.activeGM],
 ['v13 Foundry runtime',(_b,r)=>r.game.version='13.351'],
 ['v15 runtime',(_b,r)=>r.game.version='15.0'],
 ['missing version',(_b,r)=>delete r.game.version],
 ['world mismatch',(_b,r)=>r.game.world.id='owner-ballad-world'],
 ['world approval mismatch',(_b,_r,a)=>a.worldId='different-world'],
 ['other writer',(_b,_r,a)=>a.currentSingleWriterId='gm-foreign'],
 ['other approved GM',(_b,_r,a)=>a.activeGmId='gm-foreign'],
 ['other approved blueprint sha',(_b,_r,a)=>a.approvedBlueprintSha256='b'.repeat(64)],
 ['other blueprint id',(_b,_r,a)=>a.approvedBlueprintId='dbx:blueprint:wrong'],
];
for(const [name,fn] of gateCases) gate(name,fn);
