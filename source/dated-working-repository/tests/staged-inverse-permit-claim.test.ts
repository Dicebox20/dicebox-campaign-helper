import { describe, expect, it } from "vitest";
import {
  createStagedInverseExecutionAuthorization,
  createStagedInverseExecutionManifest,
  createStagedInverseExecutionPermit,
  createStagedInversePermitClaimState,
  transitionStagedInversePermitClaim,
  verifyStagedInversePermitClaimState,
} from "@dicebox/compiler";

const plan = { schemaVersion:"0.1.0", inversePlanId:"dbx:inverse-plan:claim", originalPlanId:"dbx:plan:claim", originalPlanSha256:"a".repeat(64), approvedByUserId:"gm", requiredActiveGm:true, reverseDependencyOrder:["dbx:scene:claim"], operations:[{kind:"delete-owned-create",stableId:"dbx:scene:claim",binding:{semantic:{id:"dbx:scene:claim",kind:"scene"},runtime:"foundry",documentType:"Scene",documentId:"s",uuid:"Scene.s",generation:1},expectedOwnership:{moduleId:"dicebox-campaign-helper",stableId:"dbx:scene:claim",mode:"managed"}}],createdAt:"2026-08-30T23:00:00.000Z",execution:"not-implemented",readyClaim:false };

async function fixtures() {
  const authorization = await createStagedInverseExecutionAuthorization({authorizationId:"dbx:inverse-authorization:claim",inversePlan:plan,authorizedByActiveGmUserId:"gm",authorizedAt:"2026-08-30T23:01:00.000Z"});
  const request = {inversePlan:plan,authorization,approvedInversePlanId:plan.inversePlanId,approvedByUserId:"gm",activeGmUserId:"gm",idempotencyKey:"dbx:inverse-idempotency:claim"};
  const manifest = await createStagedInverseExecutionManifest(request,"dbx:inverse-manifest:claim","fixture-adapter","2026-08-30T23:02:00.000Z");
  const permit = await createStagedInverseExecutionPermit(request,manifest,"dbx:inverse-permit:claim","2026-08-30T23:03:00.000Z");
  return {request,manifest,permit};
}

function matchedResolution(state: Record<string, unknown>, observedAt = "2026-08-30T23:06:00.000Z") {
  const claimed = { ...state, state: "claimed", observedAt, authoritativeReread: true };
  return {
    schemaVersion: "0.1.0",
    status: "matched",
    writeOutcome: "committed",
    candidate: claimed,
    reread: claimed,
    observedAt,
    authoritativeReread: true,
    retryAfter: "never",
    foreignStatePreserved: true,
    execution: "not-implemented",
    readyClaim: false,
  };
}

describe("staged inverse permit claim", () => {
  it("requires an exact matched persistence-resolution witness after a committed claim", async () => {
    const {request,manifest,permit} = await fixtures();
    const initial = await createStagedInversePermitClaimState(request,manifest,permit,"dbx:inverse-claim:claim","dbx:inverse-claim-idempotency:claim","2026-08-30T23:04:00.000Z");
    const committed = transitionStagedInversePermitClaim(initial,{kind:"claim-committed",observedAt:"2026-08-30T23:05:00.000Z",authoritativeReread:false});
    expect(committed.state).toBe("unknown");
    expect(committed.authoritativeReread).toBe(false);
    const resolution = matchedResolution(committed);
    const reread = transitionStagedInversePermitClaim(committed,{kind:"reread-claimed",observedAt:resolution.observedAt,authoritativeReread:true,persistenceResolution:resolution});
    expect(reread).toEqual(resolution.reread);
    expect(reread.state).toBe("claimed");
    expect(reread.execution).toBe("not-implemented");
    expect(verifyStagedInversePermitClaimState(reread)).toBe(true);
  });

  it("preserves exact identity and available recovery semantics", async () => {
    const {request,manifest,permit} = await fixtures();
    const initial = await createStagedInversePermitClaimState(request,manifest,permit,"dbx:inverse-claim:claim","dbx:inverse-claim-idempotency:claim","2026-08-30T23:04:00.000Z");
    const unknown = transitionStagedInversePermitClaim(initial,{kind:"claim-persistence-unknown",observedAt:"2026-08-30T23:05:00.000Z",authoritativeReread:false});
    const available = transitionStagedInversePermitClaim(unknown,{kind:"reread-available",observedAt:"2026-08-30T23:06:00.000Z",authoritativeReread:true});
    expect(available.state).toBe("available");
    expect(available.authoritativeReread).toBe(true);
    expect(available.claimId).toBe(initial.claimId);
    expect(available.permitId).toBe(initial.permitId);
    expect(available.permitSha256).toBe(initial.permitSha256);
    expect(available.manifestId).toBe(initial.manifestId);
    expect(available.idempotencyKey).toBe(initial.idempotencyKey);
    expect(available.activeGmUserId).toBe(initial.activeGmUserId);
  });

  it("rejects missing, mismatched, and structurally forged persistence witnesses", async () => {
    const {request,manifest,permit} = await fixtures();
    const initial = await createStagedInversePermitClaimState(request,manifest,permit,"dbx:inverse-claim:claim","dbx:inverse-claim-idempotency:claim","2026-08-30T23:04:00.000Z");
    const unknown = transitionStagedInversePermitClaim(initial,{kind:"claim-committed",observedAt:"2026-08-30T23:05:00.000Z",authoritativeReread:false});
    const resolution = matchedResolution(unknown);
    expect(() => transitionStagedInversePermitClaim(unknown,{kind:"reread-claimed",observedAt:resolution.observedAt,authoritativeReread:true})).toThrow();
    expect(() => transitionStagedInversePermitClaim(unknown,{kind:"reread-claimed",observedAt:resolution.observedAt,authoritativeReread:true,persistenceResolution:{...resolution,reread:{...resolution.reread,claimId:"dbx:inverse-claim:forged"}}})).toThrow();
    expect(() => transitionStagedInversePermitClaim(unknown,{kind:"reread-claimed",observedAt:resolution.observedAt,authoritativeReread:true,persistenceResolution:{...resolution,status:"missing"}})).toThrow();
    expect(() => transitionStagedInversePermitClaim(unknown,{kind:"reread-claimed",observedAt:"2026-08-30T23:07:00.000Z",authoritativeReread:true,persistenceResolution:resolution})).toThrow("observation time");
    expect(() => transitionStagedInversePermitClaim({...unknown,claimId:"dbx:inverse-claim:other"},{kind:"reread-claimed",observedAt:resolution.observedAt,authoritativeReread:true,persistenceResolution:resolution})).toThrow("exact pending claim identity");
  });

  it("rejects forged event provenance and a forged claimed state", async () => {
    const {request,manifest,permit} = await fixtures();
    const initial = await createStagedInversePermitClaimState(request,manifest,permit,"dbx:inverse-claim:claim","dbx:inverse-claim-idempotency:claim","2026-08-30T23:04:00.000Z");
    expect(() => transitionStagedInversePermitClaim(initial,{kind:"claim-committed",observedAt:"2026-08-30T23:05:00.000Z",authoritativeReread:true})).toThrow();
    const unknown = transitionStagedInversePermitClaim(initial,{kind:"claim-committed",observedAt:"2026-08-30T23:05:00.000Z",authoritativeReread:false});
    const resolution = matchedResolution(unknown);
    expect(() => transitionStagedInversePermitClaim(unknown,{kind:"reread-claimed",observedAt:resolution.observedAt,authoritativeReread:false,persistenceResolution:resolution})).toThrow();
    const claimed = transitionStagedInversePermitClaim(unknown,{kind:"reread-claimed",observedAt:resolution.observedAt,authoritativeReread:true,persistenceResolution:resolution});
    const forged = {...claimed,authoritativeReread:false};
    expect(verifyStagedInversePermitClaimState(forged)).toBe(false);
    expect(() => transitionStagedInversePermitClaim(forged,{kind:"reread-claimed",observedAt:resolution.observedAt,authoritativeReread:true,persistenceResolution:resolution})).toThrow();
  });

  it("fails closed on reuse or invalid transition order", async () => {
    const {request,manifest,permit} = await fixtures();
    const initial = await createStagedInversePermitClaimState(request,manifest,permit,"dbx:inverse-claim:claim","dbx:inverse-claim-idempotency:claim","2026-08-30T23:04:00.000Z");
    const unknown = transitionStagedInversePermitClaim(initial,{kind:"claim-committed",observedAt:"2026-08-30T23:05:00.000Z",authoritativeReread:false});
    const resolution = matchedResolution(unknown);
    const claimed = transitionStagedInversePermitClaim(unknown,{kind:"reread-claimed",observedAt:resolution.observedAt,authoritativeReread:true,persistenceResolution:resolution});
    expect(() => transitionStagedInversePermitClaim(claimed,{kind:"claim-committed",observedAt:"2026-08-30T23:07:00.000Z",authoritativeReread:false})).toThrow("terminal");
    expect(() => transitionStagedInversePermitClaim(initial,{kind:"reread-claimed",observedAt:resolution.observedAt,authoritativeReread:true,persistenceResolution:resolution})).toThrow("requires a claim result");
  });
});
