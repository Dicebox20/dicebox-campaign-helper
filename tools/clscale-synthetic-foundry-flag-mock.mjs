/**
 * Narrow mock of the proposed Token updateData.flags merge behavior.
 * Not a Foundry implementation or proof of Foundry v14 behavior.
 * There is no dispatcher, IO, or game integration.
 */
import {receiptMarkerProposal,validateSyntheticIntent}
  from "./clscale-synthetic-transfer-journal.mjs";
import {parseCanonicalSyntheticToken} from "./clscale-synthetic-marker-validator.mjs";

const NS="dicebox-campaign-helper";
const bad=v=>{throw Error("SYNTHETIC_FLAG_MOCK_REFUSED_"+v);};
const ident=v=>typeof v==="string"&&v.length>0&&v.length<=128&&/^[A-Za-z0-9_.:-]+$/.test(v);
export function mockMergeDestinationFlags({intent,sourceTokenJSON,destinationTokenId}={}) {
  const i=validateSyntheticIntent(intent);
  if(!ident(destinationTokenId)||typeof sourceTokenJSON!=="string")bad("IDENTITY");
  let doc;
  try{doc=JSON.parse(sourceTokenJSON);}catch{bad("SOURCE_TOKEN_JSON");}
  if(sourceTokenJSON!==JSON.stringify(doc)||!doc||Array.isArray(doc)||
      Object.keys(doc).sort().join(",")!=="_id,actorId,flags"||
      doc._id!==i.sourceTokenId||doc.actorId!==i.actorId||
      !doc.flags||Array.isArray(doc.flags)||typeof doc.flags!=="object"||
      Object.keys(doc.flags).some(k=>!(/^[A-Za-z][A-Za-z0-9_-]{0,127}$/.test(k))||
       k==="constructor"||k==="prototype"))bad("SOURCE_TOKEN_MISMATCH");
  const flags=JSON.parse(JSON.stringify(doc.flags));
  if(flags[NS]!==undefined&&(typeof flags[NS]!=="object"||
     Array.isArray(flags[NS])||flags[NS]===null||
     Object.prototype.hasOwnProperty.call(flags[NS],"transferIntent")))bad("PREEXISTING_OR_INVALID_MARKER");
  const existing=flags[NS]??{};
  const marker=receiptMarkerProposal(i).updateData.flags[NS].transferIntent;
  flags[NS]={...existing,transferIntent:marker};
  const serializedDestination=JSON.stringify({_id:destinationTokenId,actorId:i.actorId,flags});
  const check=parseCanonicalSyntheticToken(serializedDestination);
  if(check.marker.intentId!==i.intentId||check.tokenId!==destinationTokenId)bad("ROUNDTRIP_MISMATCH");
  return Object.freeze({
   status:"MOCK_ONLY_SERIALIZATION_PROPOSED",
   serializedDestination,
   unrelatedFlagsPreserved:true,
   verifiedWithFoundry:false,
   neverDispatch:true,
   committedTeleportAuthorized:false
  });
}
