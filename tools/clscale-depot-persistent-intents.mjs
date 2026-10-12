/**
 * Shared Central Lodge depot transport-intent ledger.
 * Uses an independent world flag, not the puzzle ledger.
 * No automatic retries, Token mutations, network calls, or Foundry globals.
 * The caller must separately prove a single primary-GM writer.
 */
import {HUB_WORLD,HUB_SCENE,STATIONS}from "./clscale-depot-fast-travel-catalog.mjs";
export const DEPOT_INTENT_FLAG_SCOPE="world";
export const DEPOT_INTENT_FLAG_KEY="diceboxDepotTransferIntents";
const validId=s=>typeof s==="string"&&/^[A-Za-z0-9]{16}$/.test(s);
const stations=new Map(STATIONS.map(s=>[s.id,s]));
const fail=(why)=>Object.freeze({status:"REFUSED_"+why,canDispatch:false,neverRetry:true});
export const emptyIntentLedger=()=>({schema:"dicebox-depot-intents/v1",worldId:HUB_WORLD,revision:0,records:[]});
const checkSchema=x=>x&&typeof x==="object"&&!Array.isArray(x)&&
 x.schema==="dicebox-depot-intents/v1"&&x.worldId===HUB_WORLD&&
 Number.isSafeInteger(x.revision)&&x.revision>=0&&
 Array.isArray(x.records)&&x.records.length<=10000&&
 x.records.every(r=>r&&typeof r==="object"&&validId(r.intentId)&&
   validId(r.sourceTokenId)&&validId(r.actorId)&&validId(r.targetSceneId)&&
   validId(r.targetRegionId)&&["prepared","attempting","observed","uncertain","reconciled"].includes(r.status));
const clone=x=>structuredClone(x);
export function stageNewDepotIntent(current,request){
 const ledger=current===null||current===undefined?emptyIntentLedger():current;
 if(!checkSchema(ledger))return fail("LEDGER_SCHEMA_INVALID");
 const station=stations.get(request?.destinationId);
 if(!station)return fail("UNKNOWN_DESTINATION");
 if(request?.worldId!==HUB_WORLD||
   request?.sourceSceneId!==HUB_SCENE||
   !validId(request?.sourceTokenId)||!validId(request?.actorId)||
   !validId(request?.intentId)||!validId(request?.gmId)||
   !validId(request?.consentId)||
   request?.targetSceneId!==station.sceneId||
   request?.targetRegionId!==station.regionId||
   request?.precommitValidated!==true)return fail("INTENT_IDENTITY_OR_AUTHORITY_UNKNOWN");
 if(ledger.records.some(r=>r.intentId===request.intentId||
    r.sourceTokenId===request.sourceTokenId))return fail("DUPLICATE_INTENT_OR_TOKEN");
 const last=ledger.records.at(-1);
 const record={intentId:request.intentId,sourceTokenId:request.sourceTokenId,
  actorId:request.actorId,sourceSceneId:HUB_SCENE,
  targetSceneId:station.sceneId,targetRegionId:station.regionId,
  destinationId:station.id,gmId:request.gmId,consentId:request.consentId,
  createdRevision:ledger.revision+1,status:"prepared",attemptCount:0,
  markerExpected:true,terminal:false,notes:"Fixture/GMs only: never automatically retry or infer arrival"};
 const next=clone(ledger);next.revision++;next.records.push(record);
 return Object.freeze({status:"PREPARED_PENDING_DURABILITY",record,next,
  canDispatch:false,neverRetry:true});
}
const statuses={
 attempting:["prepared"],observed:["attempting"],uncertain:["prepared","attempting"],
 reconciled:["observed","uncertain"]
};
export function transitionDepotIntent(current,{intentId,status,proof}={}){
 if(!checkSchema(current))return fail("LEDGER_SCHEMA_INVALID");
 if(!validId(intentId)||!Object.prototype.hasOwnProperty.call(statuses,status))
  return fail("UNKNOWN_TRANSITION");
 const next=clone(current),matching=next.records.filter(r=>r.intentId===intentId);
 if(matching.length!==1)return fail("INTENT_MISSING_OR_DUPLICATE");
 const record=matching[0];
 if(!statuses[status].includes(record.status))return fail("UNSAFE_STATUS_TRANSITION");
 if(status==="observed"&&(proof?.verifiedArrival!==true||
   proof?.sourceAbsent!==true||proof?.originalActorStillPresent!==true ||
   proof?.markerIntentId!==record.intentId||
   proof?.destinationSceneId!==record.targetSceneId))
  return fail("ARRIVAL_NOT_CORRELATED");
 if(status==="reconciled"&&proof?.humanReviewed!==true)return fail("MANUAL_REVIEW_REQUIRED");
 if(status==="attempting"&&record.attemptCount!==0)return fail("NO_REPLAY");
 record.status=status;
 if(status==="attempting")record.attemptCount=1;
 if(status==="observed"||status==="reconciled")record.terminal=true;
 if(status==="uncertain")record.terminal=false;
 next.revision++;
 record.lastUpdatedRevision=next.revision;
 return Object.freeze({status:"INTENT_TRANSITION_STAGED",record:clone(record),next,canDispatch:false,neverRetry:true});
}
/**
 * Makes one persistent save of a prepared intent, rereads and verifies it.
 * Store adapter supports async read() / write(value) for the exact world flag.
 * Even a verified prepare is not authority to call teleportToken.
 */
export async function prepareAndVerifyDurableIntent(store,request){
 if(typeof store?.read!=="function"||typeof store?.write!=="function")
  return fail("STORE_NOT_BOUND");
 let previous,staged;
 try{
  previous=await store.read();
  staged=stageNewDepotIntent(previous,request);
  if(staged.status!=="PREPARED_PENDING_DURABILITY")return staged;
  await store.write(staged.next);
  const confirmed=await store.read();
  if(!checkSchema(confirmed)||confirmed.revision!==staged.next.revision ||
     JSON.stringify(confirmed.records)!==JSON.stringify(staged.next.records))
   return fail("PREPARED_READBACK_MISMATCH_NEEDS_REVIEW");
 }catch{return fail("PERSISTENCE_UNCERTAIN_NEEDS_REVIEW");}
 return Object.freeze({status:"PREPARED_DURABLY_RECORDED",
  intentId:request.intentId,revision:staged.next.revision,
  canDispatch:false,neverRetry:true});
}
