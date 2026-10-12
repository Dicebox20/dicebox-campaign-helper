const PREVIEW_ID="central-lodge-cl32-n3-preview-v001";
const SCENE_ID="pHQvDUDlyWZFuNrX",LEDGER_ID="xhlXv6CCH34HVga3",KERNEL_ID="FHQiFYx6OntZVo9d";
const EXPECTED_KERNEL_HASH="6264c467211d4f5c94cfaaa9437eae88582599061b9d8a4951391830a3e8f814",EXPECTED_GEOMETRY_HASH="43bcb471640053e7000a8b37c6cd5243179295f5fe80f0537077646b62df1fd3";
const LODGE_SCENES=["0CSBwzcszPKyaB8u","5K1uASAARnX8aZhP","EDdktL7VUihbpKe9","UNySMm7YkyYfh41x","Zq8iXByDVhHRbA7w","sI4YVZZChgey1qNi","iqfCcDpEer4pwrJj","DLcheEi6e5OHOYmU","U8S5ZrTjaPIkTUIL","JZkxX6lUQe8Nc8xJ","LXTA8mx1rJ2L6e2J","MAbLfBqG7qIVVuLN","4pc5akMBieHU7GvV","pHQvDUDlyWZFuNrX","if9iWDRjSwI87EeX","PVf6Gbrv9HbB88uZ","La9krMOMBhAhDLi6","ImeIdHbYb6kZKAdt","ez9MSQ8QIO4cW6zo","aIKQmFiuXWipEdyb","HWitOe1wSid7MZ1y"];
const R={baggage:"8rdHFpvwspQ2gSCy",sw:"7el4eN3Uwzxy7Wmi",wing:"NnF6XmWlZDayKfeJ",recent:"U5Fs1VhLjW5EXWYv",walk:"kuJ5pPqDjTJur5l4",light:"pqLFzMbGtFhKbCNK",railCar:"tsRjZiiXw0qmktQS",west:"foYsFHsLXtCbfiyR",branch:"RP1jYOH738xl9hks",board:"eNrbnN68TYvMaBcT",cart:"VE8p4CvgzqvhihuF",east:"DfZRIL6d6onjWFAc"};
const clone=v=>foundry.utils.deepClone(v),dbx=d=>{try{return clone(d?.getFlag?.("world","dicebox")??{});}catch{return{};}},sid=d=>dbx(d)?.stableId??null;
const norm=v=>Array.isArray(v)?v.map(norm):v&&typeof v==="object"?Object.fromEntries(Object.keys(v).sort().map(k=>[k,norm(v[k])])):v,canon=v=>JSON.stringify(norm(v));
const sha=async v=>Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256",new TextEncoder().encode(String(v??"")))),b=>b.toString(16).padStart(2,"0")).join("");
const geom=s=>Array.from(s.regions??[]).map(r=>{const o=r.toObject();return{id:r.id,shapes:o.shapes??null,elevation:o.elevation??null,visibility:o.visibility??null,locked:o.locked??null};}).sort((a,b)=>a.id.localeCompare(b.id));
const dispatch=req=>['const k = game.macros.find(m => m.getFlag?.("world","dicebox")?.stableId === "dbx:central-lodge:macro:runtime");','if (!k) return;','const t = event?.data?.token ?? event?.token ?? null;','const a = t?.actor ?? null;','return await k.execute({actor:a,token:t,event,speaker:{dicebox:'+JSON.stringify(req)+'}});'].join("\n");
const baggageSocket={contract:"dicebox-region-behavior/v1",action:"socket",trigger:"TOKEN_ENTER",itemKey:"brass-baggage-token",statePath:"puzzles.n3.baggageTokenAccepted",consume:false,missingMessage:"<p>The depot locker has a brass-token receiver, but no matching token is present.</p>",successMessage:"<p>The <strong>Brass Baggage Token</strong> trips the locker mechanism.</p>"};
const baggagePickup={contract:"dicebox-region-behavior/v1",action:"pickup",trigger:"TOKEN_ENTER",itemKey:"station-route-plate",statePath:"puzzles.n3.stationRoutePlateResolved",value:true,message:"<p>Inside the locker, you recover the <strong>Station Route Plate</strong>.</p>",persistentPickup:true};
const baggageSource=['const k = game.macros.find(m => m.getFlag?.("world","dicebox")?.stableId === "dbx:central-lodge:macro:runtime");','if (!k) return;','const t = event?.data?.token ?? event?.token ?? null;','const a = t?.actor ?? null;','const socketResult = await k.execute({actor:a,token:t,event,speaker:{dicebox:'+JSON.stringify(baggageSocket)+'}});','if (!["PASS","ALREADY_INSTALLED"].includes(socketResult?.status)) return socketResult;','const pickupResult = await k.execute({actor:a,token:t,event,speaker:{dicebox:'+JSON.stringify(baggagePickup)+'}});','return {socketResult,pickupResult};'].join("\n");
const specs=[
 {key:"baggage-locker-observation",regionId:R.baggage,stableId:"dbx:central-lodge:n3:behavior:baggage-locker-observation",action:"observe",source:dispatch({contract:"dicebox-region-behavior/v1",action:"observe",trigger:"TOKEN_ENTER",observationKey:"n3.baggage-locker",oncePerActor:true,statePath:"puzzles.n3.baggageLockerObserved",value:true,message:"<p>The locker is not keyed like an ordinary cabinet. Its release is built around a small brass-token receiver.</p>"})},
 {key:"baggage-token-route-plate",regionId:R.baggage,stableId:"dbx:central-lodge:n3:behavior:baggage-token-route-plate",action:"socket",source:baggageSource},
 {key:"departure-board-route-plate",regionId:R.board,stableId:"dbx:central-lodge:n3:behavior:departure-board-route-plate",action:"socket",source:dispatch({contract:"dicebox-region-behavior/v1",action:"socket",trigger:"TOKEN_ENTER",itemKey:"station-route-plate",statePath:"puzzles.n3.departureBoardResolved",consume:false,missingMessage:"<p>The departure board is missing its removable route plate.</p>",successMessage:"<p>The <strong>Station Route Plate</strong> locks into the departure board and restores its route markings.</p>"})},
 {key:"railway-switch-wheel-install",regionId:R.sw,stableId:"dbx:central-lodge:n3:behavior:railway-switch-wheel-install",action:"socket",source:dispatch({contract:"dicebox-region-behavior/v1",action:"socket",trigger:"TOKEN_ENTER",itemKey:"railway-switch-wheel",statePath:"puzzles.n3.switchWheelInstalled",consume:false,missingMessage:"<p>The switch mechanism is missing its operating wheel.</p>",successMessage:"<p>The <strong>Railway Switch Wheel</strong> fits the depot switch mechanism.</p>"})},
 {key:"cicada-wing-iv-recovery",regionId:R.wing,stableId:"dbx:central-lodge:n3:behavior:cicada-wing-iv-recovery",action:"pickup",source:dispatch({contract:"dicebox-region-behavior/v1",action:"pickup",trigger:"TOKEN_ENTER",itemKey:"cicada-wing-iv",statePath:"items.cicada-wing-iv.recovered",value:true,message:"<p>You recover <strong>Infernal Cicada Wing IV</strong> from the depot collection.</p>",persistentPickup:true})},
 {key:"recent-use-observation",regionId:R.recent,stableId:"dbx:central-lodge:n3:behavior:recent-use-observation",action:"observe",source:dispatch({contract:"dicebox-region-behavior/v1",action:"observe",trigger:"TOKEN_ENTER",observationKey:"n3.recent-use",oncePerActor:true,statePath:"puzzles.n3.recentUseObserved",value:true,message:"<p>Fresh handling marks and disturbed depot dust contradict the site's apparent abandonment. Someone has used this collection area recently.</p>"})},
 {key:"walkable-railway-notice",regionId:R.walk,stableId:"dbx:central-lodge:n3:behavior:walkable-railway-notice",action:"notice",source:dispatch({contract:"dicebox-discovery/v1",action:"notice",trigger:"TOKEN_ENTER",noticeKey:"n3.walkable-railway",dc:6,stage2Skill:"Investigation",successMessage:"<p>The depot track geometry again preserves clear pedestrian movement beside the rails, confirming the hidden line was meant to be walked as well as ridden.</p>",followUp:"Suggested follow-up: Investigation.",failure:"silent",oncePerCharacter:true,autoAwardItem:false,criticalClueFallback:"Deliberate inspection still reveals the walkable-railway design."})},
 {key:"cartography-old-estate-survey",regionId:R.cart,stableId:"dbx:central-lodge:n3:behavior:cartography-old-estate-survey",action:"socket",source:dispatch({contract:"dicebox-region-behavior/v1",action:"socket",trigger:"TOKEN_ENTER",itemKey:"old-estate-survey",statePath:"puzzles.n3.routeOverlay.oldEstateSurvey",consume:false,missingMessage:"<p>One layer of the cartography table is still missing the estate survey.</p>",successMessage:"<p>The <strong>Old Estate Survey</strong> aligns with the first cartographic layer.</p>"})},
 {key:"cartography-cult-passage-diagram",regionId:R.cart,stableId:"dbx:central-lodge:n3:behavior:cartography-cult-passage-diagram",action:"socket",source:dispatch({contract:"dicebox-region-behavior/v1",action:"socket",trigger:"TOKEN_ENTER",itemKey:"cult-passage-diagram",statePath:"puzzles.n3.routeOverlay.cultPassageDiagram",consume:false,missingMessage:"<p>One layer of the cartography table is still missing the cult passage diagram.</p>",successMessage:"<p>The <strong>Cult Passage Diagram</strong> aligns with the second cartographic layer.</p>"})},
 {key:"cartography-recent-route-fragment",regionId:R.cart,stableId:"dbx:central-lodge:n3:behavior:cartography-recent-route-fragment",action:"socket",source:dispatch({contract:"dicebox-region-behavior/v1",action:"socket",trigger:"TOKEN_ENTER",itemKey:"recent-route-fragment",statePath:"puzzles.n3.routeOverlay.recentRouteFragment",consume:false,missingMessage:"<p>One layer of the cartography table is still missing the recent route fragment.</p>",successMessage:"<p>The <strong>Recent Route Fragment</strong> aligns with the final cartographic layer.</p>"})},
 {key:"cartography-route-overlay",regionId:R.cart,stableId:"dbx:central-lodge:n3:behavior:cartography-route-overlay",action:"gate",source:dispatch({contract:"dicebox-region-behavior/v1",action:"gate",trigger:"TOKEN_ENTER",statePath:"puzzles.n3.routeOverlay.resolved",requirements:[{type:"state",path:"puzzles.n3.routeOverlay.oldEstateSurvey",equals:true},{type:"state",path:"puzzles.n3.routeOverlay.cultPassageDiagram",equals:true},{type:"state",path:"puzzles.n3.routeOverlay.recentRouteFragment",equals:true}],incompleteMessage:"<p>The cartography table still lacks one or more route layers.</p>",successMessage:"<p>The three route sources align into a coherent hidden-route overlay.</p>"})}
];

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
