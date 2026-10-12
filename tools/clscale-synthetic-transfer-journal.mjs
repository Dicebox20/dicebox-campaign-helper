/**
 * Synthetic transfer-intent journal, v1.
 * OFFLINE ONLY. Cannot execute a Foundry operation or grant approval.
 * Journal paths are limited to migration/work/synthetic-ledger-* directories.
 * This implementation is a draft for validating on-disk recovery semantics.
 */
import {createHash} from "node:crypto";
import {open,readFile,mkdir,lstat,unlink} from "node:fs/promises";
import {resolve,relative,join,dirname} from "node:path";
import {fileURLToPath} from "node:url";
import {ROUTES,classifyTransferRecovery} from "./clscale-transfer-safety-policy.mjs";

const repo=resolve(dirname(fileURLToPath(import.meta.url)),"..");
const stage=join(repo,"work","clscale-central-lodge-migration-v001");
export const OFFLINE_ROOT=stage;
const JOURNAL="synthetic-transfer-intents-v001.jsonl";
const LOCK="synthetic-transfer-intents-v001.lock";
const EVENTS=new Set(["synthetic.intent","synthetic.interruption","synthetic.observation","synthetic.humanReview"]);
const sha=data=>createHash("sha256").update(data).digest("hex");
const text=x=>typeof x==="string" && x.length>0 && x.length<=128 && /^[A-Za-z0-9_:.-]+$/.test(x);
const fail=(reason)=>{throw new Error("SYNTHETIC_JOURNAL_REFUSED_"+reason);};
const bodyFields=Object.freeze({
  "synthetic.intent":["synthetic","worldId","routeId","intentId","actorId",
    "sourceTokenId","sourceSceneId","targetSceneId"],
  "synthetic.interruption":["intentId","reason"],
  "synthetic.observation":["intentId","classification"],
  "synthetic.humanReview":["intentId","outcome","consumedApproval"]
});
const reviewCodes=new Set([
  "INTENT_IDENTITY_MISSING","EVIDENCE_INCOMPLETE",
  "DUPLICATE_OR_OVERLAPPING_TOKENS","ARRIVAL_OBSERVED_REQUIRES_RECEIPT_AND_HUMAN",
  "SOURCE_PRESENT_NO_AUTOMATIC_RETRY","UNCORRELATED_DESTINATION_ACTOR_NOT_PROOF",
  "TOKEN_ABSENT_BOTH_SIDES","UNKNOWN_RECONCILIATION_STATE"
]);
function validateEventBody(kind,body){
  if(!EVENTS.has(kind)||!body||typeof body!=="object"||Array.isArray(body))
    fail("INVALID_EVENT_OR_BODY");
  const keys=Object.keys(body).sort(),allow=[...bodyFields[kind]].sort();
  if(JSON.stringify(keys)!==JSON.stringify(allow))
    fail("EXTRANEOUS_OR_MISSING_EVENT_FIELDS");
  if(kind==="synthetic.intent")return validateSyntheticIntent(body);
  if(!text(body.intentId))fail("EVENT_INTENT_ID_INVALID");
  if(kind==="synthetic.interruption"&&body.reason!=="SIMULATED_INTERRUPTION")
    fail("INTERRUPTION_REASON_INVALID");
  if(kind==="synthetic.observation"&&!reviewCodes.has(body.classification))
    fail("OBSERVATION_CLASSIFICATION_INVALID");
  if(kind==="synthetic.humanReview"&&
    (body.outcome!=="NEEDS_FURTHER_REVIEW"||body.consumedApproval!==false))
    fail("REVIEW_OUTCOME_INVALID");
  return Object.freeze({...body});
}

export function receiptMarkerProposal(intent) {
  const safe=validateSyntheticIntent(intent);
  return Object.freeze({status:"NON_EXECUTABLE_UPDATE_DATA_PROPOSAL",
    updateData:Object.freeze({flags:Object.freeze({"dicebox-campaign-helper":
      Object.freeze({transferIntent:Object.freeze({schema:1,synthetic:true,
        worldId:safe.worldId,intentId:safe.intentId,routeId:safe.routeId,
        actorId:safe.actorId,sourceTokenId:safe.sourceTokenId,
        sourceSceneId:safe.sourceSceneId,targetSceneId:safe.targetSceneId})})})}),
    verifiedWithFoundry:false, neverDispatch:true, committedTeleportAuthorized:false});
}
export function validateSyntheticIntent(input) {
  if(!input || typeof input!=="object" || Array.isArray(input))fail("INTENT_NOT_OBJECT");
  const {worldId,routeId,intentId,actorId,sourceTokenId,sourceSceneId,targetSceneId}=input;
  const route=ROUTES[routeId];
  if(worldId!=="dbx-test-world" || !route || ![intentId,actorId,sourceTokenId].every(text) ||
      sourceSceneId!==route.sourceScene || targetSceneId!==route.targetScene)fail("INTENT_IDENTITY_SCOPE");
  if(input.synthetic!==true || "authorization" in input || "approval" in input || "token" in input)
    fail("NON_SYNTHETIC_OR_AUTHORITY_DATA");
  if(JSON.stringify(Object.keys(input).sort())!==JSON.stringify([...bodyFields["synthetic.intent"]].sort()))
    fail("EXTRANEOUS_OR_MISSING_INTENT_FIELDS");
  return Object.freeze({synthetic:true,worldId,routeId,intentId,actorId,
    sourceTokenId,sourceSceneId,targetSceneId});
}
const ensurePath=async dir=>{
  const dest=resolve(dir),parent=dirname(dest);
  const rel=relative(stage,dest);
  if(!rel || rel===".." || rel.startsWith("..\\") || rel.startsWith("../") ||
      rel.includes(":") || !/^synthetic-ledger-[a-zA-Z0-9_-]+$/.test(rel))fail("PATH_OUT_OF_SCOPE");
  await mkdir(dest,{recursive:true});
  for(const candidate of [stage,dest]){
    const stat=await lstat(candidate);
    if(!stat.isDirectory()||stat.isSymbolicLink())fail("SYMLINK_OR_NON_DIRECTORY");
  }
  return dest;
};
export function verifyJournalText(raw) {
  if(typeof raw!=="string")fail("UNEXPECTED_LOG_CONTENT");
  if(raw==="")return Object.freeze({status:"EMPTY",records:Object.freeze([]),lastHash:"GENESIS",states:Object.freeze({})});
  if(!raw.endsWith("\n"))fail("TRUNCATED_OR_PARTIAL_LINE");
  const lines=raw.slice(0,-1).split("\n");
  const records=[],state=new Map();
  let lastHash="GENESIS";
  for(let i=0;i<lines.length;i++){
    let entry;try{entry=JSON.parse(lines[i]);}catch{fail("UNREADABLE_JSON_LINE_"+(i+1));}
    if(!entry || entry.seq!==i+1 || entry.prevHash!==lastHash ||
      !EVENTS.has(entry.kind) || !entry.body || typeof entry.body!=="object" ||
      typeof entry.hash!=="string")fail("INVALID_ENTRY_"+(i+1));
    const {hash,...unsigned}=entry;
    if(hash!==sha(JSON.stringify(unsigned)))fail("HASH_CHAIN_DRIFT_"+(i+1));
    validateEventBody(entry.kind,entry.body);
    const {intentId}=entry.body;
    if(!text(intentId))fail("INVALID_INTENT_ID");
    const prior=state.get(intentId);
    if(entry.kind==="synthetic.intent"){
      if(prior)fail("REPEATED_INTENT");
      const intent=validateSyntheticIntent(entry.body);
      state.set(intentId,{kind:"prepared",intent});
    }else{
      if(!prior)fail("MISSING_PREPARED_INTENT");
      if(prior.kind==="reviewed")fail("EVENT_AFTER_REVIEW");
      if(entry.kind==="synthetic.interruption"){
        if(prior.kind!=="prepared" || entry.body.reason!=="SIMULATED_INTERRUPTION")
          fail("INVALID_SIMULATED_INTERRUPTION");
        prior.kind="uncertain";
      }
      if(entry.kind==="synthetic.observation"){
        if(prior.kind!=="uncertain" || !text(entry.body.classification) ||
          entry.body.classification==="NO_PRIOR_TRANSFER")fail("INVALID_RECONCILIATION_OBSERVATION");
        prior.kind="observed";
      }
      if(entry.kind==="synthetic.humanReview"){
        if(prior.kind!=="observed" || entry.body.outcome!=="NEEDS_FURTHER_REVIEW" ||
          entry.body.consumedApproval!==false)fail("INVALID_REVIEW_ATTESTATION");
        prior.kind="reviewed";
      }
    }
    records.push(Object.freeze(entry));lastHash=hash;
  }
  return Object.freeze({status:"HASH_CHAIN_VALID",records:Object.freeze(records),
    lastHash,states:Object.freeze(Object.fromEntries([...state].map(([id,v])=>[id,v.kind])))});
}
export function draftReconciliationClassification(input) {
  const result=classifyTransferRecovery(input);
  if(!result || result.mayRetry!==false || result.committedTeleportAuthorized!==false)
    fail("UNSAFE_CLASSIFIER");
  return Object.freeze({intentId:input.intentId,classification:result.classification,
    mayRetry:false,mayAutoRepair:false,committedTeleportAuthorized:false});
}
export async function inspectSyntheticJournal(dir) {
  const dest=await ensurePath(dir);
  const name=join(dest,JOURNAL);
  try{
    const stat=await lstat(name);
    if(!stat.isFile()||stat.isSymbolicLink())fail("JOURNAL_NONREGULAR_OR_SYMLINK");
    return verifyJournalText(await readFile(name,"utf8"));
  }catch(e){if(e.code==="ENOENT")return verifyJournalText("");throw e;}
}
export async function appendSyntheticEvent(dir,kind,body) {
  if(!EVENTS.has(kind))fail("UNKNOWN_EVENT");
  validateEventBody(kind,body);
  const dest=await ensurePath(dir);
  // Exclusive sentinel prevents simultaneous writers. A crash leaves the lock in
  // place intentionally: NO stale-lock removal or blind resume.
  const lockPath=join(dest,LOCK);
  let lock;
  try{lock=await open(lockPath,"wx",0o600);}
  catch(e){if(e.code==="EEXIST")fail("LOCK_PRESENT_NEEDS_HUMAN");throw e;}
  let safeToUnlock=false, attemptedWrite=false;
  try{
    await lock.writeFile("offline simulated journal writer, not a teleport lock\n");
    await lock.sync();
    const prior=await inspectSyntheticJournal(dest);
    if(kind==="synthetic.intent")validateSyntheticIntent(body);
    // The scanner is the final authority for valid state transitions, not
    // caller-supplied action labels. It also rejects duplicate intent IDs.
    const unsigned={seq:prior.records.length+1,prevHash:prior.lastHash,kind,body};
    const entry={...unsigned,hash:sha(JSON.stringify(unsigned))};
    const line=JSON.stringify(entry)+"\n";
    verifyJournalText(prior.records.map(x=>JSON.stringify(x)+"\n").join("")+line);
    const handle=await open(join(dest,JOURNAL),"a",0o600);
    attemptedWrite=true;
    try{await handle.writeFile(line);await handle.sync();}
    finally{await handle.close();}
    // Do not remove an unknown/partial entry. The readback fails closed.
    const checked=await inspectSyntheticJournal(dest);
    if(checked.lastHash!==entry.hash)fail("READBACK_DURABILITY_MISMATCH");
    safeToUnlock=true;
    return Object.freeze({status:"SYNTHETIC_ENTRY_DURABLE",seq:entry.seq,hash:entry.hash,
      neverDispatch:true,committedTeleportAuthorized:false});
  }finally{
    await lock.close();
    // Any unexpected error may leave partially persisted bytes. Keep lock as
    // a quarantine marker until the human has independently inspected the log.
    if(safeToUnlock || !attemptedWrite)await unlink(lockPath);
  }
}
