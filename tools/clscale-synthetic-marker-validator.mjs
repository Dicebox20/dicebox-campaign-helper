/**
 * DiceBox CL-50: synthetic destination Token marker validator.
 * PURE, OFFLINE, non-executable. It never reads/writes files or calls Foundry.
 * Matching marker bytes are UNAUTHENTICATED: never sufficient for a transfer commit.
 */
import {validateSyntheticIntent,receiptMarkerProposal,verifyJournalText}
  from "./clscale-synthetic-transfer-journal.mjs";

const own=(o,k)=>Object.prototype.hasOwnProperty.call(o,k);
const keys=(o,k)=>o&&typeof o==="object"&&!Array.isArray(o) &&
  Object.keys(o).sort().join("\0")===k.slice().sort().join("\0");
const isId=v=>typeof v==="string"&&v.length>0&&v.length<=128&&/^[A-Za-z0-9_.:-]+$/.test(v);
const NS="dicebox-campaign-helper";
const fieldNames=["schema","synthetic","worldId","intentId","routeId",
  "actorId","sourceTokenId","sourceSceneId","targetSceneId"];
const proposalMarker=intent=>{
  const p=receiptMarkerProposal(intent);
  return p.updateData.flags[NS].transferIntent;
};

export function serializeSyntheticDestinationToken(intent,destinationTokenId) {
  const approved=validateSyntheticIntent(intent);
  if(!isId(destinationTokenId))throw Error("SYNTHETIC_DESTINATION_TOKEN_ID_INVALID");
  const marker=proposalMarker(approved);
  // A one-way stand-in for Foundry toObject serialization, not Token construction.
  return JSON.stringify({_id:destinationTokenId,actorId:approved.actorId,
    flags:{[NS]:{transferIntent:marker}}});
}
export function parseCanonicalSyntheticToken(raw) {
  if(typeof raw!=="string"||raw.length>16384)throw Error("SYNTHETIC_TOKEN_JSON_INVALID");
  let doc;
  try{doc=JSON.parse(raw);}catch{throw Error("SYNTHETIC_TOKEN_JSON_UNPARSABLE");}
  // Canonical representation rejects duplicate keys, whitespace variations,
  // and unreviewed transport fields. Only a TEST ENVELOPE can pass this gate.
  if(JSON.stringify(doc)!==raw||!keys(doc,["_id","actorId","flags"])||
    !isId(doc._id)||!isId(doc.actorId)||
    !doc.flags||typeof doc.flags!=="object"||Array.isArray(doc.flags)||
    !Object.keys(doc.flags).every(k=>/^[A-Za-z][A-Za-z0-9_-]{0,127}$/.test(k)&&
      !["constructor","prototype"].includes(k))||
    !own(doc.flags,NS)||!doc.flags[NS]||
    typeof doc.flags[NS]!=="object"||Array.isArray(doc.flags[NS])||
    !own(doc.flags[NS],"transferIntent"))
    throw Error("SYNTHETIC_TOKEN_ENVELOPE_NONCANONICAL");
  const marker=doc.flags[NS].transferIntent;
  if(!keys(marker,fieldNames)||marker.schema!==1||marker.synthetic!==true||
     ![marker.worldId,marker.intentId,marker.routeId,marker.actorId,
       marker.sourceTokenId,marker.sourceSceneId,marker.targetSceneId].every(isId))
    throw Error("SYNTHETIC_TOKEN_MARKER_SCHEMA_INVALID");
  return Object.freeze({tokenId:doc._id,actorId:doc.actorId,
    marker:Object.freeze({...marker})});
}

const result=(classification,details={})=>Object.freeze({
  status:"RECEIPT_REVIEW_REQUIRED",classification,...details,
  authenticated:false,receiptValidatedByFoundry:false,
  mayRetry:false,mayAutoRepair:false,neverDispatch:true,
  committedTeleportAuthorized:false
});
export function assessSyntheticReceiptCorrelation(input={}) {
  let intent;
  try{intent=validateSyntheticIntent(input.intent);}catch{
    return result("INTENT_SCOPE_INVALID");
  }
  const e=input.evidence;
  if(!e||e.readProven!==true||e.worldId!==intent.worldId||
      e.sceneId!==intent.targetSceneId||!Array.isArray(e.serializedTokens)||
      !e.source||e.source.readProven!==true||
      e.source.worldId!==intent.worldId||e.source.sceneId!==intent.sourceSceneId||
      e.source.tokenId!==intent.sourceTokenId||
      typeof e.source.tokenPresent!=="boolean")
    return result("EVIDENCE_IDENTITY_OR_COMPLETENESS_INVALID");
  const found=[];
  const ids=new Set();
  try{
    if(e.serializedTokens.length>10000)throw Error("EXCESSIVE_SCAN");
    for(const raw of e.serializedTokens){
      const token=parseCanonicalSyntheticToken(raw);
      if(ids.has(token.tokenId))throw Error("DUPLICATE_TOKEN_ID");
      ids.add(token.tokenId);
      found.push(token);
    }
  }catch{return result("DESTINATION_TOKEN_SCAN_INVALID");}

  const desired=proposalMarker(intent);
  const matches=[],suspicious=[],uncorrelated=[];
  for(const token of found){
    const marker=token.marker;
    if(marker.intentId===intent.intentId){
      const exactMarker=fieldNames.every(k=>marker[k]===desired[k]);
      if(exactMarker&&token.actorId===intent.actorId)matches.push(token);
      else suspicious.push(token.tokenId);
    }else if(token.actorId===intent.actorId){
      uncorrelated.push(token.tokenId);
    }
  }
  if(suspicious.length)return result("CORRELATION_IDENTITY_CONFLICT",
    {suspiciousTokenCount:suspicious.length});
  if(matches.length>1)return result("DUPLICATE_CORRELATED_ARRIVALS",
    {correlatedCount:matches.length});
  if(matches.length===1&&e.source.tokenPresent)
    return result("SOURCE_AND_TARGET_OVERLAP",
      {correlatedTokenId:matches[0].tokenId});
  if(matches.length===1)return result("UNAUTHENTICATED_CORRELATED_ARRIVAL",
    {correlatedTokenId:matches[0].tokenId});
  if(uncorrelated.length)return result("SAME_ACTOR_WITHOUT_CORRELATED_INTENT",
    {uncorrelatedTokenCount:uncorrelated.length});
  return result(e.source.tokenPresent?"SOURCE_STILL_PRESENT":"ABSENT_ON_BOTH_SIDES");
}

/**
 * Validate that a proposed matching destination marker refers to a durable,
 * synthetically recorded intent. The journal does NOT authenticate a Token or
 * prove that a transfer happened. A valid hash chain can be rewritten.
 */
export function assessJournalBoundSyntheticReceipt(input={}) {
  const deny=(classification,details={})=>result(classification,details);
  let journal;
  try{journal=verifyJournalText(input.journalText);}
  catch{return deny("SYNTHETIC_JOURNAL_INVALID");}
  if(!isId(input.intentId))return deny("JOURNAL_INTENT_SELECTOR_INVALID");
  const rows=journal.records.filter(x=>
    x.kind==="synthetic.intent"&&x.body.intentId===input.intentId);
  if(rows.length!==1)return deny("JOURNAL_INTENT_NOT_FOUND_OR_AMBIGUOUS");
  const saved=rows[0].body;
  const state=journal.states[input.intentId];
  // This operation only reviews the aftermath of an interrupted synthetic
  // transfer. It does not dispatch or retry the event recorded in the journal.
  if(!["uncertain","observed","reviewed"].includes(state))
    return deny("JOURNAL_HAS_NO_INTERRUPTED_TRANSFER",{journalState:state});
  const observed=assessSyntheticReceiptCorrelation({
    intent:saved,evidence:input.evidence
  });
  if(observed.classification==="INTENT_SCOPE_INVALID")
    return deny("JOURNAL_INTENT_SCOPE_INVALID");
  return deny("JOURNAL_BOUND_"+observed.classification,{
    journalState:state,journalLastHash:journal.lastHash,
    intentSequence:rows[0].seq,
    ...(own(observed,"correlatedTokenId")?
      {correlatedTokenId:observed.correlatedTokenId}:{})
  });
}
