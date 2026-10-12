/**
 * Central Lodge N3 depot: pure, non-dispatching destination catalog.
 * May be imported by off-game tests and batch compiler. No Foundry calls.
 */
export const HUB_WORLD="dbx-test-world";
export const HUB_SCENE="pHQvDUDlyWZFuNrX";
export const HUB_REGION="tsRjZiiXw0qmktQS";
export const HUB_STABLE="dbx:central-lodge:n3:region:n3-estate-rail-car-state";
export const LEDGER_STABLE="dbx:central-lodge:state";

// Each destination exists in the preserved Scene/Region inventory. These
// are ARRIVAL REGION REFERENCES, not yet certified collision-free positions.
export const STATIONS=Object.freeze([
 Object.freeze({id:"N1",label:"Lodge Railway Station",
  sceneId:"MAbLfBqG7qIVVuLN",regionId:"8TWHLmhVBx24YcZh",
  stableId:"dbx:central-lodge:n1:region:n1-estate-rail-car",
  requirements:Object.freeze(["puzzles.n1.railwayPowered"])}),
 Object.freeze({id:"N2",label:"Grotto Station",
  sceneId:"4pc5akMBieHU7GvV",regionId:"IMvvpg6jzHKNMJHv",
  stableId:"dbx:central-lodge:n2:region:n2-station-platform-fast-travel",
  requirements:Object.freeze(["puzzles.n1.railwayPowered",
    "puzzles.n2.fastTravelEnabled"])}),
 Object.freeze({id:"T3",label:"Abandoned Spur",
  sceneId:"aIKQmFiuXWipEdyb",regionId:"YElrtisbXN3DJ2Sw",
  stableId:"dbx:central-lodge:t3:region:n3-mouth",
  requirements:Object.freeze(["puzzles.n1.railwayPowered",
   "puzzles.n3.departureBoardResolved",
   "puzzles.n3.switchWheelInstalled",
   "puzzles.n3.routeOverlay.resolved",
   "puzzles.n3.t3BranchUnlocked"])})
]);
const ID=/^[a-zA-Z0-9]{16}$/;
export function verifyCatalogAgainstInventory(inventory){
 const errors=[];
 if(inventory?.status!=="INVENTORY_COMPLETE_NO_ROUTES_INVENTED"||
  inventory?.sceneCount!==21||inventory?.regionCount!==202||
  inventory?.behaviorCount!==119) errors.push("BASELINE_DRIFT");
 const all=inventory?.allSceneRegions??[];
 const seen=new Set();
 const hub=all.find(x=>x.sceneId===HUB_SCENE)?.regions?.find(x=>x.regionId===HUB_REGION);
 if(!hub||hub.flags?.stableId!==HUB_STABLE||
   hub.name!=="N3 Estate Rail Car State")errors.push("HUB_REGION_MISMATCH");
 for(const row of STATIONS){
  if(seen.has(row.id)||!ID.test(row.sceneId)||!ID.test(row.regionId))errors.push("BAD_UNIQUE_ID_"+row.id);
  seen.add(row.id);
  const scene=all.find(x=>x.sceneId===row.sceneId);
  const region=scene?.regions?.find(x=>x.regionId===row.regionId);
  if(!region||region.flags?.stableId!==row.stableId||region.shapes?.[0]?.type!=="rectangle")
    errors.push("DESTINATION_REF_DRIFT_"+row.id);
 }
 return Object.freeze({status:errors.length?"CATALOG_DRIFT":"CATALOG_SOURCE_VALIDATED",
  errors:Object.freeze(errors),destinations:STATIONS.length,
  hubExists:!!hub,canDispatch:false,arrivalLocationsCertified:false});
}
const lookup=(root,path)=>{
 let cur=root;
 for(const key of path.split(".")){
  if(cur===null||typeof cur!=="object"||Array.isArray(cur)||
     !Object.prototype.hasOwnProperty.call(cur,key))return undefined;
  cur=cur[key];
 }
 return cur;
};
const failStatus=()=>Object.freeze({status:"LEDGER_INVALID_NO_DESTINATIONS",
 destinations:Object.freeze([]),canDispatch:false});
export function listDepotDestinations(input={}){
 if(input.worldId!==HUB_WORLD ||input.ledgerStableId!==LEDGER_STABLE ||
   input.ledgerState===null||typeof input.ledgerState!=="object"||
   Array.isArray(input.ledgerState)||!Number.isSafeInteger(input.ledgerState.revision)||
   input.ledgerState.revision<0||typeof input.ledgerState.puzzles!=="object"||
   input.ledgerState.puzzles===null||Array.isArray(input.ledgerState.puzzles))
     return failStatus();
 // Fail closed: ONLY explicitly true values satisfy gates; false, missing,
 // malformed and truthy strings do not. Locked locations never appear.
 const unlocked=STATIONS.filter(row=>row.requirements.every(path=>
   lookup(input.ledgerState,path)===true));
 return Object.freeze({status:"MENU_READ_ONLY",worldId:HUB_WORLD,
  ledgerRevision:input.ledgerState.revision,
  destinations:Object.freeze(unlocked.map(x=>Object.freeze({
    id:x.id,label:x.label,sceneId:x.sceneId,regionId:x.regionId,
    stableId:x.stableId,arrivalCertified:false
  }))),canDispatch:false});
}
export function recheckDepotChoice({previousMenu,destinationId,current}={}){
 const now=listDepotDestinations(current);
 if(now.status!=="MENU_READ_ONLY" ||previousMenu?.status!=="MENU_READ_ONLY")
  return Object.freeze({status:"DENIED_LEDGER_INVALID",canDispatch:false});
 if(previousMenu.worldId!==HUB_WORLD||
    previousMenu.ledgerRevision!==now.ledgerRevision)
  return Object.freeze({status:"DENIED_LEDGER_CHANGED_REFRESH_MENU",canDispatch:false});
 if(!previousMenu.destinations?.some(x=>x.id===destinationId))
  return Object.freeze({status:"DENIED_NOT_OFFERED",canDispatch:false});
 const row=now.destinations.find(x=>x.id===destinationId);
 if(!row)return Object.freeze({status:"DENIED_LOCKED",canDispatch:false});
 return Object.freeze({status:"SELECTION_CONFIRMED_TRANSFER_NOT_CERTIFIED",
   destination:row,canDispatch:false,requiresSafetyGate:true});
}
