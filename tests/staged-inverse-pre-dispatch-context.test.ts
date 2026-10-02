import { describe, expect, it } from "vitest";
import {
  createStagedInverseExecutionAuthorization,
  createStagedInverseExecutionManifest,
  createStagedInverseExecutionPermit,
  createStagedInversePermitClaimState,
  canonicalizeFoundryIr,
  classifyStagedInverseRetryState,
  deriveStagedInverseReceiptLedgerId,
  deriveStagedInverseReceiptQueryId,
  deriveStagedInverseTerminalReceiptId,
  prepareStagedInversePreDispatchContext,
  sha256FoundryIr,
  transitionStagedInversePermitClaim,
} from "@dicebox/compiler";
import { matchedStagedInversePermitClaimResolution } from "./staged-inverse-claim-fixture.js";

const plan = {
  schemaVersion: "0.1.0" as const,
  inversePlanId: "dbx:inverse-plan:pre-dispatch",
  originalPlanId: "dbx:plan:pre-dispatch",
  originalPlanSha256: "a".repeat(64),
  approvedByUserId: "gm",
  requiredActiveGm: true as const,
  reverseDependencyOrder: ["dbx:scene:pre-dispatch"],
  operations: [{
    kind: "delete-owned-create" as const,
    stableId: "dbx:scene:pre-dispatch",
    binding: { semantic: { id: "dbx:scene:pre-dispatch", kind: "scene" }, runtime: "foundry", documentType: "Scene", documentId: "scene", uuid: "Scene.scene", generation: 1 },
    expectedOwnership: { moduleId: "dicebox-campaign-helper", stableId: "dbx:scene:pre-dispatch", mode: "managed" as const },
  }],
  createdAt: "2026-08-31T02:00:00.000Z",
  execution: "not-implemented" as const,
  readyClaim: false as const,
};

async function fixtures() {
  const authorization = await createStagedInverseExecutionAuthorization({ authorizationId: "dbx:inverse-authorization:pre-dispatch", inversePlan: plan, authorizedByActiveGmUserId: "gm", authorizedAt: "2026-08-31T02:01:00.000Z" });
  const request = { inversePlan: plan, authorization, approvedInversePlanId: plan.inversePlanId, approvedByUserId: "gm", activeGmUserId: "gm", idempotencyKey: "dbx:inverse-idempotency:pre-dispatch" };
  const manifest = await createStagedInverseExecutionManifest(request, "dbx:inverse-manifest:pre-dispatch", "fixture-adapter", "2026-08-31T02:02:00.000Z");
  const permit = await createStagedInverseExecutionPermit(request, manifest, "dbx:inverse-permit:pre-dispatch", "2026-08-31T02:03:00.000Z");
  const available = await createStagedInversePermitClaimState(request, manifest, permit, "dbx:inverse-claim:pre-dispatch", request.idempotencyKey, "2026-08-31T02:04:00.000Z");
  const pendingClaim = transitionStagedInversePermitClaim(available, { kind: "claim-committed", observedAt: "2026-08-31T02:05:00.000Z", authoritativeReread: false });
  const persistenceResolution = matchedStagedInversePermitClaimResolution(pendingClaim, "2026-08-31T02:05:01.000Z");
  const claim = transitionStagedInversePermitClaim(pendingClaim, { kind: "reread-claimed", observedAt: persistenceResolution.observedAt, authoritativeReread: true, persistenceResolution });
  const operation = manifest.operations[0]!;
  return {
    request,
    manifest,
    permit,
    claim,
    base: {
      request,
      manifest,
      permit,
      claimReread: { schemaVersion: "0.1.0" as const, source: "claim-store-load" as const, status: "claimed" as const, claim, observedAt: "2026-08-31T02:06:00.000Z", authoritativeReread: true as const, foreignStatePreserved: true as const, execution: "not-implemented" as const, readyClaim: false as const },
      claimPersistenceResolution: persistenceResolution,
      currentGmReread: { schemaVersion: "0.1.0" as const, purpose: "execution-time-active-gm-recheck" as const, userId: "gm", observedAt: "2026-08-31T02:07:00.000Z", authoritativeReread: true as const, foreignStatePreserved: true as const, execution: "not-implemented" as const, readyClaim: false as const },
      receiptSnapshot: { schemaVersion: "0.1.0" as const, ledgerId: deriveStagedInverseReceiptLedgerId(manifest.manifestId, permit.permitId, claim.claimId), queryId: deriveStagedInverseReceiptQueryId(manifest.manifestId, permit.permitId, claim.claimId), manifestId: manifest.manifestId, inversePlanId: request.inversePlan.inversePlanId, inversePlanSha256: request.authorization.inversePlanSha256, permitId: permit.permitId, claimId: claim.claimId, source: "terminal-receipt-store-enumerate-manifest" as const, completeForManifest: true as const, operations: [{ schemaVersion: "0.1.0" as const, ledgerSequence: 0, stableId: operation.stableId, operationKind: operation.kind, idempotencyKey: operation.idempotencyKey, state: "absent" as const, receipts: [], headReceiptId: null, headReceiptSha256: null, observedAt: "2026-08-31T02:08:00.000Z", authoritativeReread: true as const, foreignStatePreserved: true as const, execution: "not-implemented" as const, readyClaim: false as const }], observedAt: "2026-08-31T02:08:00.000Z", authoritativeReread: true as const, foreignStatePreserved: true as const, execution: "not-implemented" as const, readyClaim: false as const },
      receiptPersistence: { schemaVersion: "0.1.0" as const, receiptId: deriveStagedInverseTerminalReceiptId(manifest.manifestId, operation.stableId, operation.idempotencyKey), manifestId: manifest.manifestId, stableId: operation.stableId, idempotencyKey: operation.idempotencyKey, permitId: permit.permitId, claimId: claim.claimId, candidateReceiptSha256: null, observedReceiptSha256: null, state: "pending" as const, authoritativeReread: true, retryAfter: "never" as const, foreignStatePreserved: true as const, execution: "not-implemented" as const, readyClaim: false as const },
    },
  };
}

describe("staged inverse pre-dispatch context", () => {
  it("composes exact selection with claimed, active-GM, and pending-receipt rereads without dispatch", async () => {
    const { base } = await fixtures();
    const result = await prepareStagedInversePreDispatchContext(base);
    expect(result).toMatchObject({ status: "selected", adapterDispatch: "not-authorized-by-this-contract", execution: "not-implemented", readyClaim: false, claimReread: "claimed", activeGmUserId: "gm" });
    if (result.status === "selected") expect(result.selection.stableId).toBe("dbx:scene:pre-dispatch");
  });

  it("blocks GM drift, claim uncertainty, and non-pending receipt state", async () => {
    const { base } = await fixtures();
    await expect(prepareStagedInversePreDispatchContext({ ...base, currentGmReread: { ...base.currentGmReread, userId: "other" } })).resolves.toMatchObject({ status: "blocked", authoritativeReread: true });
    await expect(prepareStagedInversePreDispatchContext({ ...base, claimReread: { ...base.claimReread, status: "unknown", claim: null } })).resolves.toMatchObject({ status: "blocked", authoritativeReread: true });
    await expect(prepareStagedInversePreDispatchContext({ ...base, receiptPersistence: { ...base.receiptPersistence!, candidateReceiptSha256: "a".repeat(64), observedReceiptSha256: "a".repeat(64), state: "persisted" } })).resolves.toMatchObject({ status: "blocked", authoritativeReread: true });
  });

  it("blocks malformed or tampered composition input before any future executor boundary", async () => {
    const { base } = await fixtures();
    await expect(prepareStagedInversePreDispatchContext({ ...base, manifest: { ...base.manifest, adapterId: "other" } })).resolves.toMatchObject({ status: "blocked", execution: "not-implemented", readyClaim: false });
    await expect(prepareStagedInversePreDispatchContext({ ...base, receiptSnapshot: { ...base.receiptSnapshot, manifestId: "dbx:inverse-manifest:other" } })).resolves.toMatchObject({ status: "blocked" });
    await expect(prepareStagedInversePreDispatchContext({ ...base, receiptPersistence: null })).resolves.toMatchObject({ status: "blocked" });
    const forgedClaim = { ...base.claimPersistenceResolution.reread!, claimId: "dbx:inverse-claim:other" };
    const forgedWitness = { ...base.claimPersistenceResolution, candidate: forgedClaim, reread: forgedClaim };
    await expect(prepareStagedInversePreDispatchContext({ ...base, claimPersistenceResolution: forgedWitness })).resolves.toMatchObject({ status: "blocked" });
  });

  it("accepts a complete hash-attested terminal snapshot without preparing another dispatch", async () => {
    const { base, request, manifest } = await fixtures();
    const operation = manifest.operations[0]!;
    const readback = { schemaVersion: "0.1.0" as const, inversePlanId: request.inversePlan.inversePlanId, inversePlanSha256: request.authorization.inversePlanSha256, manifestId: manifest.manifestId, sequence: operation.sequence, stableId: operation.stableId, operationKind: "delete-owned-create" as const, idempotencyKey: operation.idempotencyKey, operationSha256: operation.operationSha256, status: "owned-absent" as const, binding: null, observedAt: "2026-08-31T02:09:00.000Z", authoritativeReread: true as const, foreignStatePreserved: true as const };
    const retryState = classifyStagedInverseRetryState(readback);
    const receipt = { schemaVersion: "0.1.0" as const, receiptId: deriveStagedInverseTerminalReceiptId(manifest.manifestId, operation.stableId, operation.idempotencyKey), manifestId: manifest.manifestId, inversePlanId: request.inversePlan.inversePlanId, inversePlanSha256: request.authorization.inversePlanSha256, permitId: "dbx:inverse-permit:pre-dispatch", claimId: "dbx:inverse-claim:pre-dispatch", sequence: operation.sequence, stableId: operation.stableId, operationKind: operation.kind, idempotencyKey: operation.idempotencyKey, dispatchStatus: "accepted" as const, status: "committed" as const, recoveredFromUnknown: false, recoveredFromReceiptId: null, recoveredFromReceiptSha256: null, readback, retryState, blockers: [], receiptPersistence: "terminal" as const, authoritativeReread: true as const, foreignStatePreserved: true as const, execution: "not-implemented" as const, readyClaim: false as const, observedAt: "2026-08-31T02:10:00.000Z" };
    const receiptSha256 = await sha256FoundryIr(canonicalizeFoundryIr(receipt));
    const complete = await prepareStagedInversePreDispatchContext({ ...base, receiptSnapshot: { ...base.receiptSnapshot, operations: [{ ...base.receiptSnapshot.operations[0]!, state: "persisted" as const, receipts: [{ receipt, receiptSha256 }], headReceiptId: receipt.receiptId, headReceiptSha256: receiptSha256 }] }, receiptPersistence: null });
    expect(complete).toMatchObject({ status: "complete", adapterDispatch: "not-authorized-by-this-contract", execution: "not-implemented", readyClaim: false });
    await expect(prepareStagedInversePreDispatchContext({ ...base, receiptSnapshot: { ...base.receiptSnapshot, operations: [{ ...base.receiptSnapshot.operations[0]!, state: "persisted" as const, receipts: [{ receipt, receiptSha256: "f".repeat(64) }], headReceiptId: receipt.receiptId, headReceiptSha256: "f".repeat(64) }] }, receiptPersistence: null })).resolves.toMatchObject({ status: "blocked" });
  });
});
