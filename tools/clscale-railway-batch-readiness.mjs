/**
 * Central Lodge bulk-railway planning gate.
 * Pure, non-mutating: never accepts Foundry handles, never runs teleports.
 */
const verifiedStages=new Set(["DIRECTION_INSTALLED","EXACT_ENDPOINTS_FORWARD_ROUTE_NOT_INSTALLED","UNBOUND_DO_NOT_GUESS"]);
const check=(v,label)=>{if(!v)throw Error("RAILWAY_BATCH_REFUSED_"+label)};
const id=v=>typeof v==="string"&&/^[a-zA-Z0-9]{16}$/.test(v);
export function assessRailwayBatchPlan(m) {
 check(m?.schema==="clscale-railway-master-plan/v2" && m?.status==="PLANNING_MANIFEST_VALIDATED" &&
   m?.fixture==="dbx-test-world","UNVERIFIED_INPUT");
 check(m.sourceEvidence?.sceneCount===21&&m.sourceEvidence?.regions===202&&
   m.sourceEvidence?.behaviors===119&&m.sourceEvidence?.detectedInstalledTeleports===4,"BASELINE_DRIFT");
 check(m.constraints?.productionWritesAllowed===false&&
   m.constraints?.mouthBindingsMustBeValidatedBeforeBatch===true&&
   m.constraints?.allowAutomatedDirectionInference===false&&
   m.constraints?.newCommittedTransfersAllowed===false,"UNSAFE_POLICY");
 check(Array.isArray(m.installedDirectRoutes)&&m.installedDirectRoutes.length===4&&
   Array.isArray(m.physicalAdjacencyPlans)&&m.physicalAdjacencyPlans.length===7,"ROUTE_SET_CHANGED");
 const active=new Set();
 for(const r of m.installedDirectRoutes){
   check(r.status==="INSTALLED_UNCERTIFIED_RANDOM_ARRIVAL" &&
     id(r.from?.sceneId)&&id(r.from?.regionId)&&id(r.to?.sceneId)&&id(r.to?.regionId)&&
     id(r.behaviorId),"ACTIVE_ROUTE_UNKNOWN");
   const key=r.from.sceneId+"."+r.from.regionId+"."+r.behaviorId;
   check(!active.has(key),"DUPLICATE_ACTIVE_BEHAVIOR");
   active.add(key);
 }
 const blocked=[],exactPending=[],alreadyPresent=[];
 const keys=new Set();
 for(const a of m.physicalAdjacencyPlans){
   check(!keys.has(a.key)&&verifiedStages.has(a.binding),"DUPLICATE_OR_BAD_ADJACENCY");
   keys.add(a.key);
   check(Array.isArray(a.fromChoices)&&a.fromChoices.length>=1&&
     Array.isArray(a.toChoices)&&a.toChoices.length>=1 &&
     a.fromChoices.every(x=>id(x?.sceneId)&&id(x?.regionId)&&x?.stableId)&&
     a.toChoices.every(x=>id(x?.sceneId)&&id(x?.regionId)&&x?.stableId),"ENDPOINT_MISSING");
   if(a.binding==="UNBOUND_DO_NOT_GUESS"){
     check(["N1-T1","T1-N2","N2-T2","T2-N3"].includes(a.key) &&
       a.fromChoices.length===2&&a.toChoices.length===2,"ORIENTATION_NOT_PROVEN");
     blocked.push({key:a.key,reason:"ORIENTATION_UNBOUND_IN_SOURCE",potentialDirectedBehaviors:2});
   }else if(a.binding==="EXACT_ENDPOINTS_FORWARD_ROUTE_NOT_INSTALLED"){
     check(a.key==="N3-T3"&&a.fromChoices.length===1&&a.toChoices.length===1 &&
       a.requiredState?.path==="puzzles.n3.t3BranchUnlocked"&&
       a.requiredState?.equals===true,"FORWARD_SPOOF_OR_GATE_MISSING");
     exactPending.push({key:a.key,from:a.fromChoices[0],to:a.toChoices[0],
       requiredState:a.requiredState,plannedNewBehaviorCount:1,status:"SOURCE_READY_NO_COMMIT"});
   }else {
     check(["T3-F1","F1-F2"].includes(a.key)&&a.fromChoices.length===1&&a.toChoices.length===1,
       "INSTALLED_TOPOLOGY_UNEXPECTED");
     const record=m.installedDirectRoutes.find(r=>r.key===a.key);
     check(record&&record.from.regionId===a.fromChoices[0].regionId&&
       record.to.regionId===a.toChoices[0].regionId,"INSTALLED_TOPOLOGY_NOT_MATCHED");
     alreadyPresent.push(a.key);
   }
 }
 check(blocked.length===4&&exactPending.length===1&&alreadyPresent.length===2,
   "PENDING_SET_CHANGED");
 check(Array.isArray(m.stationControls)&&m.stationControls.length===3&&
   m.stationControls.every(x=>x.controls.every(y=>id(y?.regionId))) &&
   m.stationControls.map(s=>s.sceneKey).sort().join(",")==="N1,N2,N3",
   "STATION_CONTROLS_DRIFT");
 const warnings=[
  "Four unresolved mouth pairings from T1 and T2: never synthesize a destination from layout alone",
  "N3->T3 requires branch unlock plus runtime landing and transfer recovery tests",
  "Four existing directed routes currently use random placement and lack persistent recovery",
  "Station-to-station fast travel selection and destinations remain undefined",
  "Blank-password fixture GM remains an unresolved runtime access gate"
 ];
 return Object.freeze({
  status:"BATCH_PREVIEW_PASS_INSTALL_BLOCKED",scope:"dbx-test-world",
  existingTeleportBehaviorsPreserved:m.installedDirectRoutes.length,
  orientationBlockedLinks:blocked,orientationDependentDirectedRoutes:8,
  exactNewForwardRoutes:exactPending,
  existingTopologyRoutes:alreadyPresent,
  stationControls:m.stationControls.map(s=>({scene:s.sceneKey,count:s.controls.length,state:s.powerState})),
  warnings,hasExecutableBatch:false,foundryWritesAuthorized:false,productionWritesAuthorized:false
 });
}
