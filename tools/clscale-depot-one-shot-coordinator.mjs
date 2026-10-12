/**
 * The Mysterious Lodge: N3 shared single-call transfer coordinator (source only).
 * NOT installed into Foundry. All live adapters must be separately bound,
 * verified and player-consented. Mock pass != Foundry certification.
 * A failed or ambiguous write/teleport must NEVER be replayed automatically.
 */
import {HUB_WORLD,HUB_SCENE,HUB_REGION} from "./clscale-depot-fast-travel-catalog.mjs";
import {assessDepotTransferPlan} from "./clscale-depot-transfer-plan.mjs";
import {DEPOT_INTENT_FLAG_KEY,DEPOT_INTENT_FLAG_SCOPE,
 prepareAndVerifyDurableIntent,transitionDepotIntent} from "./clscale-depot-persistent-intents.mjs";

const refuse=(status,reasons=[])=>Object.freeze({
 status,reasons:Object.freeze(reasons),teleportCertified:false,neverRetry:true
});
const safeId=s=>typeof s==="string"&&/^[A-Za-z0-9]{16}$/.test(s);
const exact=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const identity=(snap)=>[snap?.token?.id,snap?.token?.actorId,snap?.actingGM?.id,
 snap?.requester?.id,snap?.requester?.consentId,snap?.ledger?.state?.revision];
const proof=(selected,snapshot)=>({
 status:"PREPARED_DURABLY_RECORDED",readbackVerified:true,
 worldId:HUB_WORLD,destinationId:selected,sourceTokenId:snapshot.token.id,
 intentId:snapshot.intentId,priorIntentFound:false
});
const planFor=(snapshot,destinationId,prepareProof)=>assessDepotTransferPlan({
 ...snapshot,destinationId,durableIntent:prepareProof
});

async function transitionAndReread(store,intentId,status,arrivalProof){
 try{
  const before=await store.read();
  const proposed=transitionDepotIntent(before,{intentId,status,proof:arrivalProof});
  if(proposed.status!=="INTENT_TRANSITION_STAGED")return null;
  await store.write(proposed.next);
  const actual=await store.read();
  if(!actual||actual.revision!==proposed.next.revision||
     !exact(actual.records,proposed.next.records))return null;
  return proposed.record;
 }catch{return null;}
}

/**
 * Runtime adapter contract (not constructed here):
 *  - identity: exact attested world, N3 Region, native API and exclusive GM;
 *  - snapshot(): fresh world/ledger/player consent/GM/Token/arrival snapshot;
 *  - intentStore: real independent Journal world-flag read/write adapter;
 *  - teleport(): ONE authoritative RegionDocument.teleportToken invocation;
 *  - inspect(): independent exact source/arrival/actor/intent-marker reread.
 * An integrated Foundry wrapper, owner consent dialog and activation remain
 * separate work with independent current-GM and live safety gates.
 */
export async function executeDepotTransferOnce(runtime={},request={}){
 const adapter=runtime.identity;
 const store=runtime.intentStore;
 if(adapter?.worldId!==HUB_WORLD || adapter?.sceneId!==HUB_SCENE||
    adapter?.regionId!==HUB_REGION ||
    adapter?.api!=="RegionDocument.teleportToken"||
    adapter?.exactAuthorizedGM!==true||
    adapter?.singleWriter!==true||
    store?.scope!==DEPOT_INTENT_FLAG_SCOPE||
    store?.key!==DEPOT_INTENT_FLAG_KEY||
    store?.worldId!==HUB_WORLD||
    typeof store?.read!=="function"||typeof store?.write!=="function"||
    typeof runtime?.snapshot!=="function"||
    typeof runtime?.teleport!=="function"||
    typeof runtime?.inspect!=="function")
   return refuse("NOT_BOUND_TO_VERIFIED_FIXTURE_ADAPTER");
 if(!safeId(request.intentId) || !["N1","N2","T3"].includes(request.destinationId))
   return refuse("INTENT_OR_DESTINATION_INVALID");
 let first;
 try{first=await runtime.snapshot();}catch{return refuse("INITIAL_READ_UNKNOWN");}
 if(first?.worldId!==HUB_WORLD||first?.actingGM?.id!==adapter.gmId)
   return refuse("ACTING_GM_OR_WORLD_DRIFT");
 const initial=planFor(first,request.destinationId,undefined);
 if(initial.status!=="TRANSFER_PLANNING_BLOCKED"||
    initial.reasons.length!==1||initial.reasons[0]!=="DURABLE_INTENT_NOT_PROVEN")
   return refuse("SAFETY_PRECHECK_BLOCKED",initial.reasons??[]);

 const intentRequest={
  intentId:request.intentId,sourceTokenId:first.token.id,
  actorId:first.token.actorId,worldId:HUB_WORLD,sourceSceneId:HUB_SCENE,
  destinationId:request.destinationId,targetSceneId:first.target.sceneId,
  targetRegionId:first.target.regionId,
  gmId:first.actingGM.id,consentId:first.requester.consentId,
  precommitValidated:true
 };
 const prepared=await prepareAndVerifyDurableIntent(store,intentRequest);
 if(prepared.status!=="PREPARED_DURABLY_RECORDED")
   return refuse("PREPARED_INTENT_UNVERIFIED",[prepared.status]);
 const readyProof={...proof(request.destinationId,first),intentId:request.intentId};
 let fresh;
 try{fresh=await runtime.snapshot();}catch{
  return refuse("PREPARED_INTENT_REQUIRES_REVIEW");
 }
 if(!exact(identity(first),identity(fresh)) ||
    fresh.actingGM?.id!==adapter.gmId ||
    planFor(fresh,request.destinationId,readyProof).status!==
     "STATIC_PRECOMMIT_CHECKS_PASS_RUNTIME_COMMIT_SEPARATE")
   return refuse("PREPARED_INTENT_CONDITIONS_CHANGED_MANUAL_REVIEW");

 // Only the single writer may persist an attempt. The readback is required
 // BEFORE a native Token delete/create, so a lost reply cannot cause a retry.
 const attempting=await transitionAndReread(store,request.intentId,"attempting");
 if(!attempting||attempting.attemptCount!==1)
   return refuse("ATTEMPT_PERSISTENCE_UNCERTAIN_NO_TELEPORT");
 try{fresh=await runtime.snapshot();}catch{
  await transitionAndReread(store,request.intentId,"uncertain");
  return refuse("FRESH_PRECOMMIT_READ_UNAVAILABLE_MANUAL_REVIEW");
 }
 if(!exact(identity(first),identity(fresh)) ||
    planFor(fresh,request.destinationId,readyProof).status!==
      "STATIC_PRECOMMIT_CHECKS_PASS_RUNTIME_COMMIT_SEPARATE"){
  await transitionAndReread(store,request.intentId,"uncertain");
  return refuse("PRECOMMIT_CONDITIONS_CHANGED_NO_TELEPORT");
 }

 const marker=Object.freeze({schema:1,intentId:request.intentId,
  sourceTokenId:first.token.id,actorId:first.token.actorId,
  sourceSceneId:HUB_SCENE,targetSceneId:first.target.sceneId,
  destinationId:request.destinationId});
 // Exactly one invocation; callback must be a real attested RegionDocument
 // adapter in fixture. No catch branch ever invokes it again.
 try{
  await runtime.teleport({
   method:"RegionDocument.teleportToken",worldId:HUB_WORLD,
   sourceSceneId:HUB_SCENE,sourceTokenId:first.token.id,
   targetSceneId:first.target.sceneId,targetRegionId:first.target.regionId,
   options:{placement:"center",snap:false,avoidOccupied:true,pan:false,
    updateData:{flags:{"dicebox-campaign-helper":{transferIntent:marker}}}}
  });
 }catch{
  await transitionAndReread(store,request.intentId,"uncertain");
  return refuse("NATIVE_CALL_OUTCOME_UNKNOWN_NO_RETRY");
 }
 let observed;
 try{observed=await runtime.inspect({intentId:request.intentId,
  actorId:first.token.actorId,sourceTokenId:first.token.id,
  targetSceneId:first.target.sceneId});}catch{
  await transitionAndReread(store,request.intentId,"uncertain");
  return refuse("ARRIVAL_REREAD_FAILED_NO_RETRY");
 }
 const observedProof={
  verifiedArrival:observed?.verifiedArrival===true &&
   observed?.matchingArrivalCount===1 &&
   observed?.actorId===first.token.actorId,
  sourceAbsent:observed?.sourceAbsent===true,
  originalActorStillPresent:observed?.originalActorStillPresent===true,
  markerIntentId:observed?.markerIntentId,
  destinationSceneId:observed?.destinationSceneId
 };
 if(!observedProof.verifiedArrival || !observedProof.sourceAbsent||
    !observedProof.originalActorStillPresent ||
    observedProof.markerIntentId!==request.intentId ||
    observedProof.destinationSceneId!==first.target.sceneId){
  await transitionAndReread(store,request.intentId,"uncertain");
  return refuse("ARRIVAL_NOT_CORRELATED_NO_RETRY");
 }
 const terminal=await transitionAndReread(store,request.intentId,"observed",observedProof);
 if(!terminal||terminal.terminal!==true)
  return refuse("ARRIVAL_OBSERVED_RECEIPT_UNCERTAIN_NO_RETRY");
 return Object.freeze({status:"ARRIVAL_CORRELATED_AND_RECORDED",
  destinationId:request.destinationId,intentId:request.intentId,
  sourceTokenId:first.token.id,tokenTransferCalls:1,
  teleportCertified:false,needsPlayerAcceptance:true,neverRetry:true});
}
