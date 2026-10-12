/**
 * OFFLINE ONLY. Pure CL-50/F1 transfer-policy draft with no Foundry API, file I/O,
 * network activity, token update, or executable teleport operation.
 *
 * Passing static checks never authorizes a committed teleport.
 */
export const ROUTES = Object.freeze({
  "f1-f2": Object.freeze({sourceScene:"La9krMOMBhAhDLi6",sourceRegion:"iuoEHBXWtXgzYmMh",
    targetScene:"HWitOe1wSid7MZ1y",targetRegion:"pplHOCmUZOqFymOy",proof:"f1InnerWardResolved"}),
  "e1-m1": Object.freeze({sourceScene:"Zq8iXByDVhHRbA7w",sourceRegion:"QS7OpvIilyyDpmLc",
    targetScene:"U8S5ZrTjaPIkTUIL",targetRegion:"4b8vfvKAKXBS6kfW"}),
  "t3-f1": Object.freeze({sourceScene:"aIKQmFiuXWipEdyb",sourceRegion:"Tkg7XpsF7X1P3ZVJ",
    targetScene:"La9krMOMBhAhDLi6",targetRegion:"zKNU1R3JGIMMt017"}),
  "t3-n3": Object.freeze({sourceScene:"aIKQmFiuXWipEdyb",sourceRegion:"YElrtisbXN3DJ2Sw",
    targetScene:"pHQvDUDlyWZFuNrX",targetRegion:"RP1jYOH738xl9hks"}),
});

const recordStates=new Set(["prepared","dispatching","uncertain","completed","aborted"]);
export function assessExistingTransfer(record) {
  if (record === undefined || record === null) return Object.freeze({status:"NO_PRIOR_TRANSFER",mayRetry:false});
  if (!record || typeof record !== "object" || !recordStates.has(record.state)) {
    return Object.freeze({status:"RECONCILIATION_REQUIRED",reason:"Unrecognized journal state",mayRetry:false});
  }
  if (record.state==="completed") return Object.freeze({status:"ALREADY_COMPLETED",mayRetry:false});
  // Even an aborted or prepared record must have a separately proved final state;
  // never automatically replay a cross-Scene deletion-and-create operation.
  return Object.freeze({status:"RECONCILIATION_REQUIRED",reason:"Existing "+record.state+" record",mayRetry:false});
}

export function rectangleCenterCandidate(shape) {
  if (!shape || shape.type!=="rectangle" || shape.hole===true ||
      !Number.isFinite(shape.x)||!Number.isFinite(shape.y) ||
      !Number.isFinite(shape.width)||!Number.isFinite(shape.height) ||
      shape.width<=0||shape.height<=0||shape.rotation!==0) {
    return Object.freeze({status:"INVALID_REGION_GEOMETRY",certified:false});
  }
  return Object.freeze({
    status:"UNVERIFIED_CENTER_CANDIDATE",
    center:Object.freeze({x:shape.x+shape.width/2,y:shape.y+shape.height/2}),
    placement:"center",snap:false,
    certified:false,footprintChecked:false,collisionChecked:false,levelChecked:false
  });
}

/**
 * All inputs are synthetic snapshots. Never accepts a callback, document,
 * access token, or live game handle. No side-effect-capable result is returned.
 */
export function assessTransferDraft(input={}) {
  const reasons=[];
  const route=ROUTES[input.routeId];
  if (!route) reasons.push("UNRECOGNIZED_ROUTE");
  if (input.worldId!=="dbx-test-world") reasons.push("WRONG_WORLD");
  const existing=assessExistingTransfer(input.transferJournal);
  if (existing.status!=="NO_PRIOR_TRANSFER") {
    return Object.freeze({status:"RECONCILIATION_REQUIRED",reasons:Object.freeze([existing.reason??existing.status]),
      neverDispatch:true,committedTeleportAuthorized:false});
  }
  if (!input.primaryGm || !input.primaryGm.active || !input.primaryGm.isGM ||
      input.primaryGm.userId!==input.executingUserId) reasons.push("NOT_EXACT_PRIMARY_GM");
  if (!input.token?.id || !input.token?.actorId || !input.token?.ownedByExecutingUser) reasons.push("TOKEN_OWNERSHIP_NOT_PROVEN");
  if (input.token?.sourceSceneId !== route?.sourceScene ||
      input.token?.enteredRegionId !== route?.sourceRegion) reasons.push("SOURCE_IDENTITY_UNPROVEN");
  if (input.target?.sceneId!==route?.targetScene ||
      input.target?.regionId!==route?.targetRegion ||
      input.target?.flagsMatched!==true) reasons.push("DESTINATION_IDENTITY_UNPROVEN");
  if (input.permissions?.tokenCreate!==true || input.permissions?.tokenDelete!==true) reasons.push("CROSS_SCENE_PERMISSIONS_NOT_PROVEN");
  if (route?.proof && input.proofs?.[route.proof]!==true) reasons.push("F1_THREE_PROOF_GATE_NOT_SATISFIED");
  if (input.dialog?.confirmed!==true || !input.dialog?.receiptId ||
      input.dialog?.routeId!==input.routeId || input.dialog?.actorId!==input.token?.actorId) {
    reasons.push("EXACT_GM_CONFIRMATION_NOT_PROVEN");
  }
  if (input.arrival?.status!=="RUNTIME_VERIFIED" ||
      input.arrival?.sceneId!==route?.targetScene ||
      input.arrival?.regionId!==route?.targetRegion ||
      input.arrival?.footprintClear!==true || input.arrival?.collisionClear!==true ||
      input.arrival?.levelVerified!==true || input.arrival?.placement!=="center") {
    reasons.push("FIXED_ARRIVAL_RUNTIME_SAFETY_UNPROVEN");
  }
  if (input.independentGate?.status!=="PASS" || input.independentGate?.scope!=="dbx-test-world") {
    reasons.push("INDEPENDENT_SAFETY_GATE_NOT_PASSED");
  }
  if (!input.singleUseApproval || input.singleUseApproval.kind!=="committed_teleport" ||
      input.singleUseApproval.worldId!=="dbx-test-world" ||
      input.singleUseApproval.routeId!==input.routeId ||
      input.singleUseApproval.actorId!==input.token?.actorId ||
      !input.singleUseApproval.approvalId || input.singleUseApproval.consumed!==false) {
    reasons.push("SEPARATE_UNUSED_SINGLE_USE_USER_APPROVAL_MISSING");
  }
  return Object.freeze({
    status:reasons.length?"BLOCKED":"STATIC_CHECKS_PASSED_REQUIRES_SEPARATE_COMMIT_PROCESS",
    reasons:Object.freeze(reasons),
    neverDispatch:true,committedTeleportAuthorized:false
  });
}

/**
 * Read-only reconciliation for a cross-Scene teleport. Foundry v14 deletes the
 * original Token and creates a new Token on the target Scene.
 * Never match an arrival by Actor ID alone, because Actors can have many Tokens.
 */
export function classifyTransferRecovery(evidence={}) {
  const stop=(classification)=>Object.freeze({
    status:"RECOVERY_REVIEW_REQUIRED",classification,
    mayRetry:false,mayAutoRepair:false,committedTeleportAuthorized:false
  });
  if (!evidence.intentId || !evidence.sourceTokenId || !evidence.actorId ||
      !evidence.targetSceneId) return stop("INTENT_IDENTITY_MISSING");
  if (evidence.source?.readProven!==true || evidence.target?.readProven!==true ||
      typeof evidence.source.tokenPresent!=="boolean" ||
      !Array.isArray(evidence.target.tokens)) return stop("EVIDENCE_INCOMPLETE");
  const matches=evidence.target.tokens.filter(t=>t &&
    t.actorId===evidence.actorId && t.sourceIntentId===evidence.intentId &&
    t.sceneId===evidence.targetSceneId && typeof t.id==="string" && t.id.length>0);
  const uncorrelated=evidence.target.tokens.filter(t=>t && t.actorId===evidence.actorId &&
    t.sceneId===evidence.targetSceneId && t.sourceIntentId!==evidence.intentId).length;
  if(matches.length>1 || (evidence.source.tokenPresent && matches.length>0))
    return stop("DUPLICATE_OR_OVERLAPPING_TOKENS");
  if(!evidence.source.tokenPresent && matches.length===1)
    return stop("ARRIVAL_OBSERVED_REQUIRES_RECEIPT_AND_HUMAN");
  if(evidence.source.tokenPresent && matches.length===0)
    return stop("SOURCE_PRESENT_NO_AUTOMATIC_RETRY");
  if(!evidence.source.tokenPresent && matches.length===0)
    return stop(uncorrelated?"UNCORRELATED_DESTINATION_ACTOR_NOT_PROOF":"TOKEN_ABSENT_BOTH_SIDES");
  return stop("UNKNOWN_RECONCILIATION_STATE");
}
