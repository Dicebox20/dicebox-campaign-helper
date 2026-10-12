/**
 * Central Lodge N3 Depot shared transfer contract, v1.
 *
 * Pure planning policy. This module intentionally has no Foundry APIs,
 * filesystem writes, network calls, or teleport dispatch operation.
 * It does not convert simulated proofs into executable authority.
 */
import {
 HUB_WORLD,HUB_SCENE,HUB_REGION,HUB_STABLE,LEDGER_STABLE,
 STATIONS,recheckDepotChoice
} from "./clscale-depot-fast-travel-catalog.mjs";
import {assessExistingTransfer,rectangleCenterCandidate} from "./clscale-transfer-safety-policy.mjs";

const allowedDestinations=new Map(STATIONS.map(s=>[s.id,s]));
const validId=s=>typeof s==="string"&&/^[a-zA-Z0-9]{16}$/.test(s);
const negative=(code,reasons)=>Object.freeze({
 status:code,reasons:Object.freeze(reasons),neverDispatch:true,
 canDispatch:false,committedTeleportAuthorized:false
});
const sourceIdentity={
 sceneId:HUB_SCENE,regionId:HUB_REGION,stableId:HUB_STABLE
};

/**
 * Require a COMPLETE runtime snapshot, separate from any menu option.
 * The planned route is never inferred from arbitrary Scene IDs or labels.
 */
export function assessDepotTransferPlan(input={}){
 const reasons=[];
 const choice=input?.destinationId;
 const station=allowedDestinations.get(choice);
 if(!station)reasons.push("UNKNOWN_OR_BYPASS_DESTINATION");
 if(input.worldId!==HUB_WORLD)reasons.push("WRONG_WORLD");
 if(input.ledger?.stableId!==LEDGER_STABLE)reasons.push("LEDGER_IDENTITY_NOT_VERIFIED");
 const ledgerState=input.ledger?.state;
 const selected=recheckDepotChoice({
  previousMenu:input.openedMenu,destinationId:choice,
  current:{worldId:input.worldId,ledgerStableId:input.ledger?.stableId,ledgerState}
 });
 if(selected.status!=="SELECTION_CONFIRMED_TRANSFER_NOT_CERTIFIED")
   reasons.push("LEDGER_OR_MENU_RECHECK_"+selected.status);

 const acting=input.actingGM;
 if(!acting || acting.active!==true||acting.isGM!==true ||
   !validId(acting.id) || acting.id!==input.primaryGMId ||
   acting.id!==input.executingUserId)reasons.push("GM_IDENTITY_UNVERIFIED");
 const token=input.token;
 if(!validId(token?.id)||!validId(token?.actorId)||
   !Number.isFinite(token?.width)||!Number.isFinite(token?.height)||
   token?.width<=0||token?.height<=0||
   token?.insideDepotRegion!==true||
   token?.sourceSceneId!==sourceIdentity.sceneId||
   token?.enteredRegionId!==sourceIdentity.regionId||
   token?.sourceRegionStableId!==sourceIdentity.stableId ||
   token?.isSynthetic===true)reasons.push("SOURCE_TOKEN_REGION_NOT_VERIFIED");
 const requester=input.requester;
 if(!validId(requester?.id)||requester?.isAuthorizingOwner!==true||
   requester?.consentGranted!==true||!validId(requester?.consentId)||
   requester?.actorId!==token?.actorId ||
   requester?.tokenId!==token?.id)reasons.push("TOKEN_OWNER_CONSENT_NOT_VERIFIED");
 if(input.permissions?.createTargetToken!==true ||
   input.permissions?.deleteSourceToken!==true ||
   input.permissions?.actorOwnershipVerified!==true)
   reasons.push("CROSS_SCENE_PERMISSIONS_UNVERIFIED");
 if(input.target?.sceneId!==station?.sceneId||
   input.target?.regionId!==station?.regionId||
   input.target?.stableId!==station?.stableId||
   input.target?.identityVerified!==true)reasons.push("DESTINATION_REGION_NOT_VERIFIED");

 const previous=assessExistingTransfer(input.priorTransfer);
 if(previous.status!=="NO_PRIOR_TRANSFER")
   return negative("RECOVERY_REQUIRED_NO_RETRY",[
    ...reasons,"NONEMPTY_TRANSFER_RECEIPT_"+previous.status]);

 const arrival=input.arrival;
 if(arrival?.status!=="FOUNDRY_RUNTIME_CERTIFIED"||
   arrival?.worldId!==HUB_WORLD||
   arrival?.sceneId!==station?.sceneId||
   arrival?.regionId!==station?.regionId||
   arrival?.tokenId!==token?.id||
   arrival?.tokenWidth!==token?.width||
   arrival?.tokenHeight!==token?.height||
   arrival?.footprintClear!==true||
   arrival?.wallsClear!==true||
   arrival?.tokensClear!==true||
   arrival?.levelsClear!==true||
   arrival?.elevationChecked!==true||
   !Number.isFinite(arrival?.x)||!Number.isFinite(arrival?.y))
    reasons.push("FIXED_ARRIVAL_NOT_RUNTIME_CERTIFIED");
 if(input.confirmation?.confirmed!==true ||
   input.confirmation?.destinationId!==choice||
   input.confirmation?.tokenId!==token?.id||
   !validId(input.confirmation?.receiptId))
    reasons.push("CONFIRMATION_NOT_BOUND_TO_ROUTE_AND_TOKEN");
 if(input.independentGate?.status!=="PASS"||
   input.independentGate?.worldId!==HUB_WORLD||
   input.independentGate?.destinationId!==choice||
   input.independentGate?.sourceTokenId!==token?.id)
    reasons.push("INDEPENDENT_GATE_MISSING");
 if(input.durableIntent?.status!=="PREPARED_DURABLY_RECORDED"||
   input.durableIntent?.readbackVerified!==true||
   input.durableIntent?.worldId!==HUB_WORLD||
   input.durableIntent?.destinationId!==choice||
   input.durableIntent?.sourceTokenId!==token?.id||
   !validId(input.durableIntent?.intentId)||
   input.durableIntent?.priorIntentFound!==false)
    reasons.push("DURABLE_INTENT_NOT_PROVEN");
 if(input.singleUseApproval?.status!=="UNUSED"||
   input.singleUseApproval?.worldId!==HUB_WORLD||
   input.singleUseApproval?.destinationId!==choice||
   input.singleUseApproval?.tokenId!==token?.id||
   !validId(input.singleUseApproval?.approvalId))
    reasons.push("SINGLE_USE_APPROVAL_UNVERIFIED");

 if(reasons.length)return negative("TRANSFER_PLANNING_BLOCKED",reasons);
 return Object.freeze({
  status:"STATIC_PRECOMMIT_CHECKS_PASS_RUNTIME_COMMIT_SEPARATE",
  destination:Object.freeze({id:station.id,sceneId:station.sceneId,
   regionId:station.regionId,stableId:station.stableId}),
  ledgerRevision:ledgerState.revision,
  reasons:Object.freeze([]),
  neverDispatch:true,canDispatch:false,committedTeleportAuthorized:false
 });
}

/**
 * Single planned Foundry v14 native call, not an executable operation.
 * This descriptor is consumed by a future, separately permissioned
 * runtime executor. In particular, it contains NO TokenDocument references.
 */
export function proposeNativeDepotTeleport(input={}){
 const plan=assessDepotTransferPlan(input);
 if(plan.status!=="STATIC_PRECOMMIT_CHECKS_PASS_RUNTIME_COMMIT_SEPARATE")
  return Object.freeze({status:"NATIVE_TELEPORT_PROPOSAL_BLOCKED",
   reasons:plan.reasons??Object.freeze([]),neverDispatch:true,canDispatch:false});
 return Object.freeze({
  status:"NATIVE_TELEPORT_PROPOSAL_STAGED_NO_EXECUTION",
  targetSceneId:plan.destination.sceneId,targetRegionId:plan.destination.regionId,
  api:"RegionDocument.teleportToken",
  options:Object.freeze({placement:"center",snap:false,avoidOccupied:true,pan:true}),
  pendingDestinationReceiptMarker:true,
  actualTeleportInvoked:false,neverDispatch:true,canDispatch:false
 });
}

/** Document geometry gives a candidate only, never an arrival attestation. */
export function suggestDepotArrivalFromInventory(inventory,destinationId){
 const station=allowedDestinations.get(destinationId);
 if(!station)return Object.freeze({status:"DESTINATION_UNRECOGNIZED",certified:false});
 const scene=inventory?.allSceneRegions?.find(s=>s.sceneId===station.sceneId);
 const region=scene?.regions?.find(r=>r.regionId===station.regionId);
 if(region?.flags?.stableId!==station.stableId ||
   !Array.isArray(region.shapes)||region.shapes.length!==1)
   return Object.freeze({status:"DESTINATION_GEOMETRY_UNVERIFIED",certified:false});
 const candidate=rectangleCenterCandidate(region.shapes[0]);
 return Object.freeze({
  destinationId,sceneId:station.sceneId,regionId:station.regionId,
  regionStableId:station.stableId,
  status:candidate.status,candidate:candidate.center??null,
  certified:false,footprintChecked:false,wallChecked:false,
  tokenOccupancyChecked:false,elevationChecked:false
 });
}
