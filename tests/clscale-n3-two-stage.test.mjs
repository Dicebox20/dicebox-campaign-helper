import test from "node:test";
import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import {AsyncLocalStorage} from "node:async_hooks";
import {buildN3TwoStagePatch} from "../tools/clscale-n3-two-stage-patch.mjs";

const catalog=JSON.parse(await readFile(new URL("../work/clscale-central-lodge-migration-v001/story-reconstruction-audit-20261010/full-evidence-catalog.json",import.meta.url),"utf8"));
const old=catalog.behaviors;
const plan=buildN3TwoStagePatch(catalog);
const compile=s=>new (Object.getPrototypeOf(async function(){}).constructor)("event","game","CONST",s);
const runFinal=compile(plan.patches.find(x=>x.role.includes("preliminary")).newSource);
const runBranch=compile(plan.patches.find(x=>x.role.includes("branch")).newSource);
const get=(s,path)=>path.split(".").reduce((v,k)=>v?.[k],s);
const set=(s,path,val)=>{const p=path.split(".");let n=s;for(const k of p.slice(0,-1))n=n[k]??={};n[p.at(-1)]=val;};
function scenario({oldEstateSurvey=false,cultPassageDiagram=false,recentRouteFragment=false,departureBoardResolved=false,switchWheelInstalled=false}={}){
 const state={puzzles:{n3:{routeOverlay:{oldEstateSurvey,cultPassageDiagram,recentRouteFragment,
 preliminaryResolved:false,resolved:false},departureBoardResolved,switchWheelInstalled,t3BranchUnlocked:false}}};
 const calls=[];
 const actor={id:"actor",testUserPermission:()=>true};
 const token={actor,parent:{id:"pHQvDUDlyWZFuNrX"}};
 const event=(regionId)=>({name:"tokenEnter",region:{id:regionId},data:{token}});
 const kernel={getFlag:()=>({stableId:"dbx:central-lodge:macro:runtime"}),execute:async ({speaker})=>{
  const req=speaker?.dicebox??{};
  assert.equal(req.action,"gate","only gate actions may be injected by this staged patch");
  calls.push({path:req.statePath,requirements:req.requirements.map(q=>q.path)});
  if(get(state,req.statePath)===true)return {status:"ALREADY_RESOLVED"};
  if(!req.requirements.every(q=>get(state,q.path)===(Object.hasOwn(q,"equals")?q.equals:q.value??true)))
   return {status:"INCOMPLETE"};
  set(state,req.statePath,true);
  return {status:"PASS"};
 }};
 const journal={getFlag:()=>({stableId:"dbx:central-lodge:state",state})};
 const game={macros:{find:fn=>fn(kernel)?kernel:null},journal:{find:fn=>fn(journal)?journal:null},
 scenes:{get:id=>id==="pHQvDUDlyWZFuNrX"?{regions:{get:x=>x==="RP1jYOH738xl9hks"?{}:null}}:null}};
 return {state,calls,game,event,runOverlay:()=>runFinal(event("VE8p4CvgzqvhihuF"),game,{}),
  runSpur:()=>runBranch(event("RP1jYOH738xl9hks"),game,{DOCUMENT_OWNERSHIP_LEVELS:{OWNER:3}})};
}
test("source stage targets exactly existing approved N3 behavior ids and retains original final requirements",()=>{
 assert.equal(plan.executionAuthorized,false);
 assert.deepEqual(plan.patches.map(x=>x.behaviorId),["yikneH7tFfD5zsr6","CAGlvXbm6uLupoRw"]);
 for(const p of plan.patches){
  const original=old.find(x=>x.id===p.behaviorId);
  assert.equal(p.expectedOldHash.length,64);
  assert.equal(original.sceneId,p.sceneId);
  assert.equal(p.newSource.includes("teleportToken"),false);
  compile(p.newSource);
 }
 assert.ok(plan.patches[1].newSource.includes("puzzles.n3.routeOverlay.recentRouteFragment"));
});
test("neither clue alone authorizes preliminary cartography",async()=>{
 for(const flags of [{},{oldEstateSurvey:true},{cultPassageDiagram:true},{recentRouteFragment:true}]){
  const v=scenario(flags);
  assert.equal((await v.runOverlay()).status,"INCOMPLETE");
  assert.equal(v.state.puzzles.n3.routeOverlay.preliminaryResolved,false);
  assert.equal(v.state.puzzles.n3.routeOverlay.resolved,false);
 }
});
test("first two clue layers grant preliminary overlay while completed overlay remains locked",async()=>{
 const v=scenario({oldEstateSurvey:true,cultPassageDiagram:true});
 assert.equal((await v.runOverlay()).status,"PASS");
 assert.equal(v.state.puzzles.n3.routeOverlay.preliminaryResolved,true);
 assert.equal(v.state.puzzles.n3.routeOverlay.resolved,false);
 assert.deepEqual(v.calls.map(x=>x.path),["puzzles.n3.routeOverlay.preliminaryResolved"]);
});
test("branch still requires departure board and railway switch even after preliminary survey",async()=>{
 const v=scenario({oldEstateSurvey:true,cultPassageDiagram:true});
 await v.runOverlay();
 assert.equal((await v.runSpur()).status,"INCOMPLETE");
 v.state.puzzles.n3.departureBoardResolved=true;
 assert.equal((await v.runSpur()).status,"INCOMPLETE");
 v.state.puzzles.n3.switchWheelInstalled=true;
 assert.equal((await v.runSpur()).status,"PASS");
 assert.equal(v.state.puzzles.n3.t3BranchUnlocked,true);
 assert.equal(v.state.puzzles.n3.routeOverlay.resolved,false);
});
test("return with T3 fragment completes the original three-part overlay",async()=>{
 const v=scenario({oldEstateSurvey:true,cultPassageDiagram:true,departureBoardResolved:true,switchWheelInstalled:true});
 await v.runOverlay();await v.runSpur();
 v.state.puzzles.n3.routeOverlay.recentRouteFragment=true;
 assert.equal((await v.runOverlay()).status,"PASS");
 assert.equal(v.state.puzzles.n3.routeOverlay.resolved,true);
 assert.deepEqual(v.calls.at(-1).requirements,[
  "puzzles.n3.routeOverlay.oldEstateSurvey",
  "puzzles.n3.routeOverlay.cultPassageDiagram",
  "puzzles.n3.routeOverlay.recentRouteFragment"
 ]);
});
test("repeat trigger is idempotent for both stages",async()=>{
 const v=scenario({oldEstateSurvey:true,cultPassageDiagram:true,recentRouteFragment:true});
 assert.equal((await v.runOverlay()).status,"PASS");
 assert.equal((await v.runOverlay()).status,"ALREADY_RESOLVED");
 assert.equal(v.state.puzzles.n3.routeOverlay.resolved,true);
});
test("source drift stops rather than patching the wrong behavior",()=>{
 const altered=structuredClone(catalog);
 altered.behaviors.find(x=>x.id==="yikneH7tFfD5zsr6").source+="\n// other writer change";
 assert.throws(()=>buildN3TwoStagePatch(altered),/N3_SOURCE_DRIFT_STOP:branch source hash mismatch/);
});
test("no physical transfer or live installation is authorized by source-only plan",()=>{
 assert.equal(plan.executionAuthorized,false);
 assert.equal(plan.gateSemantics.physicalTravel,"NOT_INSTALLED_IN_THIS_PATCH");
 assert.equal(plan.gateSemantics.fastTravelPreview,"DISABLED_UNCHANGED");
});
