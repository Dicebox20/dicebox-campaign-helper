import { describe, expect, it } from "vitest";
import {
  canonicalizeFoundryIr,
  createStagedInverseExecutionAuthorization,
  createStagedInverseExecutionManifest,
  createStagedInverseExecutionPermit,
  createStagedInversePermitClaimState,
  deriveStagedInverseReceiptLedgerId,
  deriveStagedInverseReceiptQueryId,
  prepareStagedInversePreflight,
  proveStagedInversePrePersistence,
  sha256FoundryIr,
  transitionStagedInversePermitClaim,
} from "@dicebox/compiler";
import { matchedStagedInversePermitClaimResolution } from "./staged-inverse-claim-fixture.js";

async function fixture(kind: "delete-owned-create" | "restore-update-preimage") {
  const preimage = {
    documentType: "Scene" as const,
    fields: { name: "Old Scene", width: 100, height: 100, gridSize: 50 },
  };
  const operation = kind === "delete-owned-create"
    ? {
      kind,
      stableId: "dbx:scene:proof",
      binding: { semantic: { id: "dbx:scene:proof", kind: "scene" }, runtime: "foundry", documentType: "Scene", documentId: "scene", uuid: "Scene.scene", generation: 1 },
      expectedOwnership: { moduleId: "dicebox-campaign-helper", stableId: "dbx:scene:proof", mode: "managed" as const },
    }
    : {
      kind,
      stableId: "dbx:scene:proof",
      binding: { semantic: { id: "dbx:scene:proof", kind: "scene" }, runtime: "foundry", documentType: "Scene", documentId: "scene", uuid: "Scene.scene", generation: 1 },
      expectedOwnership: { moduleId: "dicebox-campaign-helper", stableId: "dbx:scene:proof", mode: "managed" as const },
      preimage,
      preimageSha256: await sha256FoundryIr(canonicalizeFoundryIr(preimage)),
    };
  const plan = {
    schemaVersion: "0.1.0" as const,
    inversePlanId: "dbx:inverse-plan:proof",
    originalPlanId: "dbx:plan:proof",
    originalPlanSha256: "a".repeat(64),
    approvedByUserId: "gm",
    requiredActiveGm: true as const,
    operations: [operation],
    reverseDependencyOrder: ["dbx:scene:proof"],
    createdAt: "2026-08-31T05:00:00.000Z",
    execution: "not-implemented" as const,
    readyClaim: false as const,
  };
  const authorization = await createStagedInverseExecutionAuthorization({ authorizationId: "dbx:inverse-authorization:proof", inversePlan: plan, authorizedByActiveGmUserId: "gm", authorizedAt: "2026-08-31T05:01:00.000Z" });
  const request = { inversePlan: plan, authorization, approvedInversePlanId: plan.inversePlanId, approvedByUserId: "gm", activeGmUserId: "gm", idempotencyKey: "dbx:inverse-idempotency:proof" };
  const manifest = await createStagedInverseExecutionManifest(request, "dbx:inverse-manifest:proof", "proof-adapter", "2026-08-31T05:02:00.000Z");
  const permit = await createStagedInverseExecutionPermit(request, manifest, "dbx:inverse-permit:proof", "2026-08-31T05:03:00.000Z");
  const available = await createStagedInversePermitClaimState(request, manifest, permit, "dbx:inverse-claim:proof", request.idempotencyKey, "2026-08-31T05:04:00.000Z");
  const pendingClaim = transitionStagedInversePermitClaim(available, { kind: "claim-committed", observedAt: "2026-08-31T05:05:00.000Z", authoritativeReread: false });
  const persistenceResolution = matchedStagedInversePermitClaimResolution(pendingClaim, "2026-08-31T05:05:01.000Z");
  const claim = transitionStagedInversePermitClaim(pendingClaim, { kind: "reread-claimed", observedAt: persistenceResolution.observedAt, authoritativeReread: true, persistenceResolution });
  const manifestOperation = manifest.operations[0]!;
  const ledger = {
    schemaVersion: "0.1.0" as const,
    ledgerId: deriveStagedInverseReceiptLedgerId(manifest.manifestId, permit.permitId, claim.claimId),
    queryId: deriveStagedInverseReceiptQueryId(manifest.manifestId, permit.permitId, claim.claimId),
    manifestId: manifest.manifestId,
    inversePlanId: request.inversePlan.inversePlanId,
    inversePlanSha256: request.authorization.inversePlanSha256,
    permitId: permit.permitId,
    claimId: claim.claimId,
    source: "terminal-receipt-store-enumerate-manifest" as const,
    completeForManifest: true as const,
    operations: [{
      schemaVersion: "0.1.0" as const,
      ledgerSequence: 0,
      stableId: manifestOperation.stableId,
      operationKind: manifestOperation.kind,
      idempotencyKey: manifestOperation.idempotencyKey,
      state: "absent" as const,
      receipts: [],
      headReceiptId: null,
      headReceiptSha256: null,
      observedAt: "2026-08-31T05:06:00.000Z",
      authoritativeReread: true as const,
      foreignStatePreserved: true as const,
      execution: "not-implemented" as const,
      readyClaim: false as const,
    }],
    observedAt: "2026-08-31T05:06:00.000Z",
    authoritativeReread: true as const,
    foreignStatePreserved: true as const,
    execution: "not-implemented" as const,
    readyClaim: false as const,
  };
  const preflight = await prepareStagedInversePreflight(
    { request, manifest, permit, claimPersistenceResolution: persistenceResolution, observedAt: "2026-08-31T05:07:00.000Z" },
    {
      claims: { load: async () => ({ ok: true as const, value: claim }) },
      currentGm: { read: async () => ({ ok: true as const, value: { userId: "gm", observedAt: "2026-08-31T05:08:00.000Z" } }) },
      receipts: { enumerate: async () => ({ ok: true as const, value: ledger }) },
    },
  );
  if (preflight.status !== "selected" || preflight.preDispatch.status !== "selected") throw new Error("fixture did not produce selected preflight");
  const adapterOperation = { selection: preflight.preDispatch.selection, operation };
  const readback = kind === "delete-owned-create"
    ? {
      schemaVersion: "0.1.0" as const,
      inversePlanId: request.inversePlan.inversePlanId,
      inversePlanSha256: request.authorization.inversePlanSha256,
      manifestId: manifest.manifestId,
      sequence: manifestOperation.sequence,
      stableId: manifestOperation.stableId,
      idempotencyKey: manifestOperation.idempotencyKey,
      operationSha256: manifestOperation.operationSha256,
      operationKind: kind,
      status: "owned-absent" as const,
      binding: null,
      observedAt: "2026-08-31T05:09:00.000Z",
      authoritativeReread: true as const,
      foreignStatePreserved: true as const,
    }
    : {
      schemaVersion: "0.1.0" as const,
      inversePlanId: request.inversePlan.inversePlanId,
      inversePlanSha256: request.authorization.inversePlanSha256,
      manifestId: manifest.manifestId,
      sequence: manifestOperation.sequence,
      stableId: manifestOperation.stableId,
      idempotencyKey: manifestOperation.idempotencyKey,
      operationSha256: manifestOperation.operationSha256,
      operationKind: kind,
      status: "preimage-matched" as const,
      binding: operation.binding,
      expectedPreimageSha256: operation.preimageSha256,
      observedPayloadSha256: operation.preimageSha256,
      observedAt: "2026-08-31T05:09:00.000Z",
      authoritativeReread: true as const,
      foreignStatePreserved: true as const,
    };
  return {
    request,
    manifest,
    permit,
    claim,
    claimPersistenceResolution: persistenceResolution,
    preflight,
    adapterOperation,
    readback,
    outcome: { dispatchStatus: "accepted" as const, status: "committed" as const, recoveredFromUnknown: false as const, recoveredFromReceiptId: null, recoveredFromReceiptSha256: null, blockers: [], observedAt: "2026-08-31T05:10:00.000Z" },
  };
}

describe("staged inverse pre-persistence proof", () => {
  it("emits one exact M684 persistence request for a delete operation", async () => {
    const input = await fixture("delete-owned-create");
    const result = await proveStagedInversePrePersistence(input);
    expect(result).toMatchObject({ status: "proved", adapterDispatch: "not-authorized-by-this-contract", execution: "not-implemented", readyClaim: false });
    expect(result.candidate?.receipt.operationKind).toBe("delete-owned-create");
    expect(result.persistenceRequest?.candidate.receipt.receiptId).toBe(result.candidate?.receipt.receiptId);
  });

  it("revalidates the exact restore preimage before proving the tuple", async () => {
    const input = await fixture("restore-update-preimage");
    const result = await proveStagedInversePrePersistence(input);
    expect(result.status).toBe("proved");
    expect(result.readback?.status).toBe("preimage-matched");
    expect(result.candidate?.receipt.readback.status).toBe("preimage-matched");
  });

  it("fails closed on a tampered restore payload digest and a mismatched adapter selection", async () => {
    const input = await fixture("restore-update-preimage");
    await expect(proveStagedInversePrePersistence({ ...input, readback: { ...input.readback, observedPayloadSha256: "f".repeat(64) } })).resolves.toMatchObject({ status: "blocked", candidate: null, persistenceRequest: null });
    await expect(proveStagedInversePrePersistence({ ...input, adapterOperation: { ...input.adapterOperation, selection: { ...input.adapterOperation.selection, stableId: "dbx:scene:other" } } })).resolves.toMatchObject({ status: "blocked", candidate: null, persistenceRequest: null });
    const forgedClaim = { ...input.claimPersistenceResolution.reread!, claimId: "dbx:inverse-claim:other" };
    const forgedWitness = { ...input.claimPersistenceResolution, candidate: forgedClaim, reread: forgedClaim };
    await expect(proveStagedInversePrePersistence({ ...input, claimPersistenceResolution: forgedWitness })).resolves.toMatchObject({ status: "blocked", candidate: null, persistenceRequest: null });
  });
});
