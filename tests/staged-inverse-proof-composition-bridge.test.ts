import { describe, expect, it } from "vitest";
import {
  bridgeStagedInverseProofToComposition,
  canonicalizeFoundryIr,
  createStagedInverseExecutionAuthorization,
  createStagedInverseExecutionManifest,
  createStagedInverseExecutionPermit,
  createStagedInversePermitClaimState,
  createStagedInverseReceiptStore,
  deriveStagedInverseReceiptLedgerId,
  deriveStagedInverseReceiptQueryId,
  executeStagedInverseExecutorLifecycle,
  prepareStagedInversePreflight,
  prepareStagedInverseExecutorOrchestration,
  proveStagedInversePrePersistence,
  resolveStagedInverseReceiptAppendObservation,
  sha256FoundryIr,
  stagedInverseDeleteReadbackSchema,
  transitionStagedInversePermitClaim,
} from "@dicebox/compiler";
import { matchedStagedInversePermitClaimResolution } from "./staged-inverse-claim-fixture.js";

type OperationKind = "delete-owned-create" | "restore-update-preimage";

async function fixture(kind: OperationKind = "delete-owned-create") {
  const preimage = {
    documentType: "Scene" as const,
    fields: { name: "Before", width: 100, height: 100, gridSize: 50 },
  };
  const binding = {
    semantic: { id: "dbx:scene:bridge", kind: "scene" },
    runtime: "foundry",
    documentType: "Scene",
    documentId: "scene",
    uuid: "Scene.scene",
    generation: 1,
  };
  const expectedOwnership = { moduleId: "dicebox-campaign-helper", stableId: "dbx:scene:bridge", mode: "managed" as const };
  const operation = kind === "delete-owned-create"
    ? { kind, stableId: "dbx:scene:bridge", binding, expectedOwnership }
    : {
      kind,
      stableId: "dbx:scene:bridge",
      binding,
      expectedOwnership,
      preimage,
      preimageSha256: await sha256FoundryIr(canonicalizeFoundryIr(preimage)),
    };
  const inversePlan = {
    schemaVersion: "0.1.0" as const,
    inversePlanId: "dbx:inverse-plan:bridge",
    originalPlanId: "dbx:plan:bridge",
    originalPlanSha256: "a".repeat(64),
    approvedByUserId: "gm",
    requiredActiveGm: true as const,
    operations: [operation],
    reverseDependencyOrder: [operation.stableId],
    createdAt: "2026-08-31T06:00:00.000Z",
    execution: "not-implemented" as const,
    readyClaim: false as const,
  };
  const authorization = await createStagedInverseExecutionAuthorization({
    authorizationId: "dbx:inverse-authorization:bridge",
    inversePlan,
    authorizedByActiveGmUserId: "gm",
    authorizedAt: "2026-08-31T06:01:00.000Z",
  });
  const request = {
    inversePlan,
    authorization,
    approvedInversePlanId: inversePlan.inversePlanId,
    approvedByUserId: "gm",
    activeGmUserId: "gm",
    idempotencyKey: "dbx:inverse-idempotency:bridge",
  };
  const manifest = await createStagedInverseExecutionManifest(request, "dbx:inverse-manifest:bridge", "bridge-adapter", "2026-08-31T06:02:00.000Z");
  const permit = await createStagedInverseExecutionPermit(request, manifest, "dbx:inverse-permit:bridge", "2026-08-31T06:03:00.000Z");
  const available = await createStagedInversePermitClaimState(request, manifest, permit, "dbx:inverse-claim:bridge", request.idempotencyKey, "2026-08-31T06:04:00.000Z");
  const pendingClaim = transitionStagedInversePermitClaim(available, { kind: "claim-committed", observedAt: "2026-08-31T06:05:00.000Z", authoritativeReread: false });
  const persistenceResolution = matchedStagedInversePermitClaimResolution(pendingClaim, "2026-08-31T06:05:01.000Z");
  const claim = transitionStagedInversePermitClaim(pendingClaim, { kind: "reread-claimed", observedAt: persistenceResolution.observedAt, authoritativeReread: true, persistenceResolution });
  const manifestOperation = manifest.operations[0]!;
  const ledger = {
    schemaVersion: "0.1.0" as const,
    ledgerId: deriveStagedInverseReceiptLedgerId(manifest.manifestId, permit.permitId, claim.claimId),
    queryId: deriveStagedInverseReceiptQueryId(manifest.manifestId, permit.permitId, claim.claimId),
    manifestId: manifest.manifestId,
    inversePlanId: inversePlan.inversePlanId,
    inversePlanSha256: authorization.inversePlanSha256,
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
      observedAt: "2026-08-31T06:06:00.000Z",
      authoritativeReread: true as const,
      foreignStatePreserved: true as const,
      execution: "not-implemented" as const,
      readyClaim: false as const,
    }],
    observedAt: "2026-08-31T06:06:00.000Z",
    authoritativeReread: true as const,
    foreignStatePreserved: true as const,
    execution: "not-implemented" as const,
    readyClaim: false as const,
  };
  const preflight = await prepareStagedInversePreflight(
    { request, manifest, permit, claimPersistenceResolution: persistenceResolution, observedAt: "2026-08-31T06:07:00.000Z" },
    {
      claims: { load: async () => ({ ok: true as const, value: claim }) },
      currentGm: { read: async () => ({ ok: true as const, value: { userId: "gm", observedAt: "2026-08-31T06:08:00.000Z" } }) },
      receipts: { enumerate: async () => ({ ok: true as const, value: ledger }) },
    },
  );
  if (preflight.status !== "selected" || preflight.preDispatch.status !== "selected") throw new Error("fixture did not select one inverse operation");
  const adapterOperation = { selection: preflight.preDispatch.selection, operation };
  const readback = kind === "delete-owned-create"
    ? {
      schemaVersion: "0.1.0" as const,
      inversePlanId: inversePlan.inversePlanId,
      inversePlanSha256: authorization.inversePlanSha256,
      manifestId: manifest.manifestId,
      sequence: manifestOperation.sequence,
      stableId: manifestOperation.stableId,
      idempotencyKey: manifestOperation.idempotencyKey,
      operationSha256: manifestOperation.operationSha256,
      operationKind: kind,
      status: "owned-absent" as const,
      binding: null,
      observedAt: "2026-08-31T06:09:00.000Z",
      authoritativeReread: true as const,
      foreignStatePreserved: true as const,
    }
    : {
      schemaVersion: "0.1.0" as const,
      inversePlanId: inversePlan.inversePlanId,
      inversePlanSha256: authorization.inversePlanSha256,
      manifestId: manifest.manifestId,
      sequence: manifestOperation.sequence,
      stableId: manifestOperation.stableId,
      idempotencyKey: manifestOperation.idempotencyKey,
      operationSha256: manifestOperation.operationSha256,
      operationKind: kind,
      status: "preimage-matched" as const,
      binding,
      expectedPreimageSha256: operation.preimageSha256,
      observedPayloadSha256: operation.preimageSha256,
      observedAt: "2026-08-31T06:09:00.000Z",
      authoritativeReread: true as const,
      foreignStatePreserved: true as const,
    };
  const proof = await proveStagedInversePrePersistence({
    request,
    manifest,
    permit,
    claim,
    claimPersistenceResolution: persistenceResolution,
    preflight,
    adapterOperation,
    readback,
    outcome: {
      dispatchStatus: "accepted" as const,
      status: "committed" as const,
      recoveredFromUnknown: false as const,
      recoveredFromReceiptId: null,
      recoveredFromReceiptSha256: null,
      blockers: [],
      observedAt: "2026-08-31T06:10:00.000Z",
    },
  });
  if (proof.status !== "proved" || proof.candidate === null) throw new Error("fixture did not produce a proved M688 tuple");
  return { request, manifest, permit, claim, operation, preflight, proof };
}

async function persistence(
  candidate: NonNullable<Awaited<ReturnType<typeof fixture>>["proof"]["candidate"]>,
  status: "persisted" | "missing" | "unknown" | "conflict",
) {
  const foreignReceipt = { ...candidate.receipt, receiptId: "dbx:inverse-receipt:foreign" };
  const foreign = { receipt: foreignReceipt, receiptSha256: await sha256FoundryIr(canonicalizeFoundryIr(foreignReceipt)) };
  return resolveStagedInverseReceiptAppendObservation({
    schemaVersion: "0.1.0",
    candidate,
    writeOutcome: status === "unknown" ? "unknown" : "committed",
    rereadState: status === "persisted" ? "matched" : status,
    reread: status === "persisted" ? candidate : status === "conflict" ? foreign : null,
    observedAt: "2026-08-31T06:11:00.000Z",
    authoritativeReread: true,
    foreignStatePreserved: true,
    execution: "not-implemented",
    readyClaim: false,
  });
}

describe("staged inverse proof-to-composition bridge", () => {
  it("maps persisted, missing, unknown, and conflict through M686 without invoking dependencies", async () => {
    const value = await fixture();
    for (const status of ["persisted", "missing", "unknown", "conflict"] as const) {
      const result = await bridgeStagedInverseProofToComposition({
        proof: value.proof,
        preflight: value.preflight,
        persistence: await persistence(value.proof.candidate!, status),
      });
      expect(result).toMatchObject({
        status,
        persistenceStatus: status,
        adapterDispatch: "not-authorized-by-this-contract",
        authoritativeReread: true,
        foreignStatePreserved: true,
        execution: "not-implemented",
        readyClaim: false,
      });
    }
  });

  it("preserves proved restore-preimage evidence through the pure M686 mapper", async () => {
    const value = await fixture("restore-update-preimage");
    const result = await bridgeStagedInverseProofToComposition({
      proof: value.proof,
      preflight: value.preflight,
      persistence: await persistence(value.proof.candidate!, "persisted"),
    });
    expect(result).toMatchObject({ status: "persisted", terminalReceipt: { operationKind: "restore-update-preimage", readback: { status: "preimage-matched" } } });
  });

  it("fails closed when the M684 resolution is not the exact proved M688 candidate", async () => {
    const value = await fixture();
    const exact = await persistence(value.proof.candidate!, "persisted");
    const changed = {
      ...exact,
      persistence: { ...exact.persistence, candidateReceiptSha256: "f".repeat(64) },
    };
    await expect(bridgeStagedInverseProofToComposition({ proof: value.proof, preflight: value.preflight, persistence: changed }))
      .resolves.toMatchObject({ status: "blocked", adapterDispatch: "not-authorized-by-this-contract", execution: "not-implemented", readyClaim: false });
  });

  it("rejects a mismatched M688 claim witness before M686 composition", async () => {
    const value = await fixture();
    const persistenceRequest = value.proof.persistenceRequest!;
    const forgedClaim = { ...persistenceRequest.claim, claimId: "dbx:inverse-claim:mismatched" };
    const mismatchedWitness = {
      ...persistenceRequest.claimPersistenceResolution,
      candidate: forgedClaim,
      reread: forgedClaim,
    };
    const proof = {
      ...value.proof,
      persistenceRequest: { ...persistenceRequest, claimPersistenceResolution: mismatchedWitness },
    };
    await expect(bridgeStagedInverseProofToComposition({
      proof,
      preflight: value.preflight,
      persistence: await persistence(value.proof.candidate!, "persisted"),
    })).resolves.toMatchObject({
      status: "blocked",
      blockers: ["M688 proof does not preserve the exact matched claim persistence-resolution witness selected by M681 preflight."],
      adapterDispatch: "not-authorized-by-this-contract",
      execution: "not-implemented",
      readyClaim: false,
    });
  });

  it("prepares the exact legacy executor boundary without invoking any dependency", async () => {
    const value = await fixture();
    const request = value.proof.persistenceRequest!;
    const result = await prepareStagedInverseExecutorOrchestration({
      boundary: {
        request: request.request,
        manifest: request.manifest,
        permit: request.permit,
        claimState: request.claim,
        claimPersistenceResolution: request.claimPersistenceResolution,
        observedAt: "2026-08-31T06:12:00.000Z",
      },
      preflight: value.preflight,
      proof: value.proof,
      persistence: await persistence(value.proof.candidate!, "persisted"),
    });
    expect(result).toMatchObject({
      status: "prepared",
      boundaryStatus: "verified",
      composition: { status: "persisted" },
      adapterDispatch: "not-authorized-by-this-contract",
      dependencyInvocation: "not-invoked",
      executorContinuation: "not-authorized-by-this-contract",
      execution: "not-implemented",
      readyClaim: false,
    });
  });

  it("blocks when the legacy boundary witness differs from the exact M688 witness", async () => {
    const value = await fixture();
    const request = value.proof.persistenceRequest!;
    const result = await prepareStagedInverseExecutorOrchestration({
      boundary: {
        request: request.request,
        manifest: request.manifest,
        permit: request.permit,
        claimState: request.claim,
        claimPersistenceResolution: { ...request.claimPersistenceResolution, observedAt: "2026-08-31T06:00:00.000Z" },
        observedAt: "2026-08-31T06:12:00.000Z",
      },
      preflight: value.preflight,
      proof: value.proof,
      persistence: await persistence(value.proof.candidate!, "persisted"),
    });
    expect(result).toMatchObject({
      status: "blocked",
      boundaryStatus: "verified",
      blockers: ["Legacy executor boundary does not bind the exact M688 request, manifest, permit, claim, and persistence witness."],
      dependencyInvocation: "not-invoked",
      executorContinuation: "not-authorized-by-this-contract",
    });
  });

  it("executes one exact fixture operation through active-GM, claim, adapter, and terminal receipt rereads", async () => {
    const value = await fixture();
    const request = value.proof.persistenceRequest!;
    const receiptPersistence = { stored: null as unknown, writes: 0, reads: 0 };
    const terminalReceipts = createStagedInverseReceiptStore({
      append: async (entry) => { receiptPersistence.stored = entry; receiptPersistence.writes += 1; return { ok: true as const, value: undefined }; },
      read: async () => { receiptPersistence.reads += 1; return { ok: true as const, value: receiptPersistence.stored }; },
    });
    const claimResolution = matchedStagedInversePermitClaimResolution(value.claim, value.claim.observedAt);
    const deleteReadback = stagedInverseDeleteReadbackSchema.parse(value.proof.readback);
    const result = await executeStagedInverseExecutorLifecycle({
      orchestration: {
        boundary: {
          request: request.request,
          manifest: request.manifest,
          permit: request.permit,
          claimState: request.claim,
          claimPersistenceResolution: request.claimPersistenceResolution,
          observedAt: "2026-08-31T06:12:00.000Z",
        },
        preflight: value.preflight,
        proof: value.proof,
        persistence: await persistence(value.proof.candidate!, "persisted"),
      },
      observedAt: "2026-08-31T06:13:00.000Z",
    }, {
      currentGm: { read: async () => ({ ok: true as const, value: { userId: "gm", observedAt: "2026-08-31T06:13:01.000Z" } }) },
      claims: { claim: async () => ({ ok: true as const, value: claimResolution }) },
      adapter: {
        adapterId: request.manifest.adapterId,
        deleteOwnedCreate: async () => ({ ok: true as const, value: deleteReadback }),
        restoreUpdatePreimage: async () => { throw new Error("unreachable restore fixture"); },
      },
      terminalReceipts,
    });
    expect(result).toMatchObject({
      status: "committed",
      operationStatus: "committed",
      persistence: { status: "persisted" },
      adapterDispatch: "invoked",
      receiptPersistence: "invoked",
      dependencyInvocation: ["current-gm-read", "claim-store-claim", "adapter", "terminal-receipt-store"],
      terminalReceipt: { status: "committed", readback: { status: "owned-absent" } },
      execution: "not-implemented",
      readyClaim: false,
    });
    expect(receiptPersistence.writes).toBe(1);
    expect(receiptPersistence.reads).toBe(2);
  });

  it("persists an explicit unknown adapter reread without retrying or claiming commitment", async () => {
    const value = await fixture();
    const request = value.proof.persistenceRequest!;
    const terminalReceipts = createStagedInverseReceiptStore({
      append: async () => ({ ok: true as const, value: undefined }),
      read: async () => ({ ok: true as const, value: null }),
    });
    const claimResolution = matchedStagedInversePermitClaimResolution(value.claim, value.claim.observedAt);
    const deleteReadback = stagedInverseDeleteReadbackSchema.parse(value.proof.readback);
    const unknownReadback = stagedInverseDeleteReadbackSchema.parse({ ...deleteReadback, status: "unknown", binding: null });
    const result = await executeStagedInverseExecutorLifecycle({
      orchestration: {
        boundary: {
          request: request.request,
          manifest: request.manifest,
          permit: request.permit,
          claimState: request.claim,
          claimPersistenceResolution: request.claimPersistenceResolution,
          observedAt: "2026-08-31T06:14:00.000Z",
        },
        preflight: value.preflight,
        proof: value.proof,
        persistence: await persistence(value.proof.candidate!, "persisted"),
      },
      observedAt: "2026-08-31T06:15:00.000Z",
    }, {
      currentGm: { read: async () => ({ ok: true as const, value: { userId: "gm", observedAt: "2026-08-31T06:15:01.000Z" } }) },
      claims: { claim: async () => ({ ok: true as const, value: claimResolution }) },
      adapter: {
        adapterId: request.manifest.adapterId,
        deleteOwnedCreate: async () => ({ ok: true as const, value: unknownReadback }),
        restoreUpdatePreimage: async () => { throw new Error("unreachable restore fixture"); },
      },
      terminalReceipts,
    });
    expect(result).toMatchObject({
      status: "unknown",
      operationStatus: "unknown",
      persistence: { status: "missing" },
      terminalReceipt: { status: "unknown", dispatchStatus: "unknown", retryState: { state: "reread-required" } },
      adapterDispatch: "invoked",
      receiptPersistence: "invoked",
    });
    expect(result.blockers.join(" ")).toContain("authoritative reread");
  });
});
