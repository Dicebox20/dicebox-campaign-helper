from pathlib import Path
p=Path(r"C:\Users\rujie\Documents\Codex\DiceBox Campaign Helper\work\foundry-playwright-harness\n3-preview-v001.page.js")
o=p.with_name("n3-apply-v001.page.js")
src=p.read_text(encoding="utf-8")
prefix=src.split("const failures=[],scene=game.scenes.get(SCENE_ID)",1)[0]
assert "const specs=[" in prefix
tail=r'''
const APPLY_ID="central-lodge-cl32-n3-apply-v001";
const checks={
"baggage-locker-observation":"1a51cf2128f536f6daad8606594c0ff9eec16dbfa211bd6a730e26d998346187",
"baggage-token-route-plate":"7ad9e19ea12bff9d47e8ad94ce06ed0a1b905f2c3566e73daf68843d13d25602",
"departure-board-route-plate":"063b00971b8576c5c4d6dda2ae56171e2126b2ae527c0637cae0f1bcd466234c",
"railway-switch-wheel-install":"5210cb20045f8d93724dc14eebeb006f41a533298661d158cccabbff173d1c3b",
"cicada-wing-iv-recovery":"4abf9900e4446282a106237df8cae52b64b5794abda63c81cc59bbc771b98aff",
"recent-use-observation":"1b5586bd4a00e840373208abe21cddf2d107272410ff61fd0ae50cf1c2973669",
"walkable-railway-notice":"76cb323b5eab8336ff6cd433a07303c072f5394c82430ad991a570bbf67add99",
"cartography-old-estate-survey":"0451d6433608f009f771b3ca3bb4994947da1a221deb991a1a3dce87889a71a0",
"cartography-cult-passage-diagram":"79cd7480d47cc143338ab251a5dbb59e05aa207b4e9dc7f51f04fb9930205db2",
"cartography-recent-route-fragment":"f10e97b02fbe387ed95de2e230c5190e7a8c1af5d396aff024980218fd66b44f",
"cartography-route-overlay":"e55af15f2d7ac960e283519f4fae3ed97748d7fcd3f7e0f598843b7be05753c0"
};
const scene=game.scenes.get(SCENE_ID),ledger=game.journal.get(LEDGER_ID),kernel=game.macros.get(KERNEL_ID);
const blockers=[];
if (!game.user?.isGM||!["Gamemaster","Assistant Gamemaster"].includes(game.user.name))blockers.push("Unauthorized executor");
if(!scene||!ledger||!kernel)blockers.push("Missing scene/ledger/kernel");
let regCount=0,behaviorCount=0;
for(const id of LODGE_SCENES){const s=game.scenes.get(id);if(!s){blockers.push("Scene missing "+id);continue;}const rs=Array.from(s.regions??[]);regCount+=rs.length;behaviorCount+=rs.reduce((n,r)=>n+r.behaviors.size,0);}
const n3Count=Array.from(scene?.regions??[]).reduce((n,r)=>n+r.behaviors.size,0);
const geometryHash=scene?await sha(canon(geom(scene))):null,kernelHash=await sha(kernel?.command??"");
if(regCount!==202||behaviorCount!==101||scene?.regions.size!==12||n3Count!==0)blockers.push("Baseline counts drift");
if(geometryHash!==EXPECTED_GEOMETRY_HASH||kernelHash!==EXPECTED_KERNEL_HASH)blockers.push("Geometry/kernel hash drift");
const stateBefore=clone(ledger?.getFlag("world","dicebox")?.state??{});
if(Number(stateBefore.revision)!==0||Object.keys(stateBefore.notices??{}).length!==0)blockers.push("Ledger drift");
const n3=foundry.utils.getProperty(stateBefore,"puzzles.n3")??{};
for(const k of ["baggageLockerObserved","baggageTokenAccepted","stationRoutePlateResolved","departureBoardResolved","switchWheelInstalled","recentUseObserved","walkableRailwayNoticeResolved","t3BranchUnlocked"])if(n3[k]!==false)blockers.push("State drift "+k);
for(const k of ["oldEstateSurvey","cultPassageDiagram","recentRouteFragment","resolved"])if(n3.routeOverlay?.[k]!==false)blockers.push("Overlay drift "+k);
if("railCarAvailable" in n3)blockers.push("Unexpected legacy state");
if(specs.length!==11||Object.keys(checks).length!==11)blockers.push("Spec count mismatch");
const seen=new Set(),existing=LODGE_SCENES.flatMap(id=>Array.from(game.scenes.get(id)?.regions??[])).flatMap(r=>Array.from(r.behaviors??[]));
for(const spec of specs){
 const r=scene?.regions.get(spec.regionId),h=await sha(spec.source);
 if(!r||r.behaviors.size!==0)blockers.push("Region mismatch "+spec.key);
 if(seen.has(spec.stableId)||existing.some(x=>sid(x)===spec.stableId))blockers.push("Collision "+spec.key);
 seen.add(spec.stableId);
 if(checks[spec.key]!==h)blockers.push("Source hash mismatch "+spec.key);
}
for(const id of [R.light,R.railCar,R.west,R.branch,R.east])if(!scene?.regions.get(id)||scene.regions.get(id).behaviors.size!==0)blockers.push("Deferred region mismatch "+id);
for(const key of ["brass-baggage-token","station-route-plate","railway-switch-wheel","cicada-wing-iv","old-estate-survey","cult-passage-diagram","recent-route-fragment"])if(game.items.filter(i=>sid(i)==="dbx:central-lodge:item:"+key).length!==1)blockers.push("Canonical item mismatch "+key);
if(blockers.length)return{operation:"central-lodge.cl32.n3.apply",status:"BLOCKED",noWrite:true,blockers,regCount,behaviorCount,n3Count,geometryHash,kernelHash};
const created=[];
try{
 for(const spec of specs){
  const r=scene.regions.get(spec.regionId),made=await r.createEmbeddedDocuments("RegionBehavior",[{
   name:"DiceBox N3 — "+spec.key,type:"executeScript",disabled:false,
   system:{events:["tokenEnter"],source:spec.source},
   flags:{world:{dicebox:{schemaVersion:"1.0.0",campaignId:"central-lodge",managed:true,installer:APPLY_ID,stableId:spec.stableId,sceneKey:"N3",regionStableId:sid(r),sourceHash:checks[spec.key],behaviorSpec:{action:spec.action,sourceType:"kernel",noticeDcSource:spec.action==="notice"?"NEW":undefined}}}}
  }]);
  if(made?.length!==1)throw new Error(spec.key+": create failed");
  created.push({regionId:spec.regionId,behaviorId:made[0].id,key:spec.key,stableId:spec.stableId});
 }
 let afterRegions=0,afterBehaviors=0;
 for(const id of LODGE_SCENES){const s=game.scenes.get(id),rs=Array.from(s.regions??[]);afterRegions+=rs.length;afterBehaviors+=rs.reduce((n,r)=>n+r.behaviors.size,0);}
 const afterScene=game.scenes.get(SCENE_ID),afterN3=Array.from(afterScene.regions??[]).reduce((n,r)=>n+r.behaviors.size,0);
 if(afterRegions!==202||afterBehaviors!==112||afterN3!==11)throw new Error("Post counts mismatch");
 if(await sha(canon(geom(afterScene)))!==EXPECTED_GEOMETRY_HASH||await sha(game.macros.get(KERNEL_ID).command??"")!==EXPECTED_KERNEL_HASH)throw new Error("Post hash drift");
 if(canon(clone(game.journal.get(LEDGER_ID)?.getFlag("world","dicebox")?.state??{}))!==canon(stateBefore))throw new Error("Ledger changed");
 for(const id of [R.light,R.railCar,R.west,R.branch,R.east])if(afterScene.regions.get(id).behaviors.size)throw new Error("Deferred behavior changed "+id);
 return{operation:"central-lodge.cl32.n3.apply",status:"PASS",createdBehaviorCount:created.length,regions:afterRegions,behaviors:afterBehaviors,n3Regions:afterScene.regions.size,n3Behaviors:afterN3,created,geometryHash,kernelHash,nextGate:"CL-32 N3 FINAL VERIFY"};
}catch(err){
 const rollbackErrors=[];
 for(const c of created.reverse())try{await scene.regions.get(c.regionId).deleteEmbeddedDocuments("RegionBehavior",[c.behaviorId]);}catch(e){rollbackErrors.push({id:c.behaviorId,error:String(e)});}
 return{operation:"central-lodge.cl32.n3.apply",status:rollbackErrors.length?"OUTCOME_UNKNOWN_ROLLBACK_INCOMPLETE":"FAIL_ROLLBACK_COMPLETE",error:String(err),rollbackErrors};
}
'''
o.write_text(prefix+tail,encoding="utf-8")
print(f"Generated {o.name}: {o.stat().st_size} bytes; 11 expected behavior hashes")
