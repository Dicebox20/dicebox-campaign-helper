import { describe, expect, it } from "vitest";
import {
  canonicalizeFoundryIr,
  classifyStagedInverseRetryState,
  composeStagedInverseExecutorHandoff,
  createStagedInverseExecutionAuthorization,
  createStagedInverseExecutionManifest,
  createStagedInverseExecutionPermit,
  createStagedInversePermitClaimState,
  deriveStagedInverseReceiptLedgerId,
  deriveStagedInverseReceiptQueryId,
  deriveStagedInverseTerminalReceiptId,
  prepareStagedInversePreflight,
  sha256FoundryIr,
  transitionStagedInversePermitClaim,
} from "@dicebox/compiler";
import { matchedStagedInversePermitClaimResolution } from "./staged-inverse-claim-fixture.js";

const plan = {
  schemaVersion: "0.1.0" as const,
  inversePlanId: "dbx:inverse-plan:composition",
  originalPlanId: "dbx:plan:composition",
  originalPlanSha256: "a".repeat(64),
  approvedByUserId: "gm",
  requiredActiveGm: true as const,
  reverseDependencyOrder: ["dbx:scene:composition"],
  operations: [{
    kind: "delete-owned-create" as const,
    stableId: "dbx:scene:composition",
    binding: { semantic: { id: "dbx:scene:composition", kind: "scene" }, runtime: "foundry", documentType: "Scene", documentId: "scene", uuid: "Scene.scene", generation: 1 },
    expectedOwnership: { moduleId: "dicebox-campaign-helper", stableId: "dbx:scene:composition", mode: "managed" as const },
  }],
  createdAt: "2026-08-31T04:00:00.000Z",
  execution: "not-implemented" as const,
  readyClaim: false as const,
};

async function fixture() {
  const authorization = await createStagedInverseExecutionAuthorization({ authorizationId: "dbx:inverse-authorization:composition", inversePlan: plan, authorizedByActiveGmUserId: "gm", authorizedAt: "2026-08-31T04:01:00.000Z" });
  const request = { inversePlan: plan, authorization, approvedInversePlanId: plan.inversePlanId, approvedByUserId: "gm", activeGmUserId: "gm", idempotencyKey: "dbx:inverse-idempotency:composition" };
  const manifest = await createStagedInverseExecutionManifest(request, "dbx:inverse-manifest:composition", "fixture-adapter", "2026-08-31T04:02:00.000Z");
  const permit = await createStagedInverseExecutionPermit(request, manifest, "dbx:inverse-permit:composition", "2026-08-31T04:03:00.000Z");
  const available = await createStagedInversePermitClaimState(request, manifest, permit, "dbx:inverse-claim:composition", request.idempotencyKey, "2026-08-31T04:04:00.000Z");
  const pendingClaim = transitionStagedInversePermitClaim(available, { kind: "claim-committed", observedAt: "2026-08-31T04:05:00.000Z", authoritativeReread: false });
  const persistenceResolution = matchedStagedInversePermitClaimResolution(pendingClaim, "2026-08-31T04:05:01.000Z");
  const claim = transitionStagedInversePermitClaim(pendingClaim, { kind: "reread-claimed", observedAt: persistenceResolution.observedAt, authoritativeReread: true, persistenceResolution });
  const operation = manifest.operations[0]!;
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
      stableId: operation.stableId,
      operationKind: operation.kind,
      idempotencyKey: operation.idempotencyKey,
      state: "absent" as const,
      receipts: [],
      headReceiptId: null,
      headReceiptSha256: null,
      observedAt: "2026-08-31T04:06:00.000Z",
      authoritativeReread: true as const,
      foreignStatePreserved: true as const,
      execution: "not-implemented" as const,
      readyClaim: false as const,
    }],
    observedAt: "2026-08-31T04:06:00.000Z",
    authoritativeReread: true as const,
    foreignStatePreserved: true as const,
    execution: "not-implemented" as const,
    readyClaim: false as const,
  };
  const preflight = await prepareStagedInversePreflight(
    { request, manifest, permit, claimPersistenceResolution: persistenceResolution, observedAt: "2026-08-31T04:07:00.000Z" },
    {
      claims: { load: async () => ({ ok: true as const, value: claim }) },
      currentGm: { read: async () => ({ ok: true as const, value: { userId: "gm", observedAt: "2026-08-31T04:08:00.000Z" } }) },
      receipts: { enumerate: async () => ({ ok: true as const, value: ledger }) },
    },
  );
  return { request, manifest, permit, claim, claimPersistenceResolution: persistenceResolution, operation, preflight };
}

function readback(fixtures: Awaited<ReturnType<typeof fixture>>) {
  return {
    schemaVersion: "0.1.0" as const,
    inversePlanId: fixtures.request.inversePlan.inversePlanId,
    inversePlanSha256: fixtures.request.authorization.inversePlanSha256,
    manifestId: fixtures.manifest.manifestId,
    sequence: fixtures.operation.sequence,
    stableId: fixtures.operation.stableId,
    idempotencyKey: fixtures.operation.idempotencyKey,
    operationSha256: fixtures.operation.operationSha256,
    operationKind: "delete-owned-create" as const,
    status: "owned-absent" as const,
    binding: null,
    observedAt: "2026-08-31T04:09:00.000Z",
    authoritativeReread: true as const,
    foreignStatePreserved: true as const,
  };
}

async function preparedInput(fixtures: Awaited<ReturnType<typeof fixture>>, persistenceStatus: "persisted" | "missing" | "unknown" | "conflict" = "persisted") {
  if (fixtures.preflight.status !== "selected" || fixtures.preflight.preDispatch.status !== "selected") throw new Error("fixture did not produce selected preflight");
  const operationReadback = readback(fixtures);
  const outcome = {
    dispatchStatus: "accepted" as const,
    status: "committed" as const,
    recoveredFromUnknown: false as const,
    recoveredFromReceiptId: null,
    recoveredFromReceiptSha256: null,
    blockers: [],
    observedAt: "2026-08-31T04:10:00.000Z",
  };
  const receipt = {
    schemaVersion: "0.1.0" as const,
    receiptId: deriveStagedInverseTerminalReceiptId(fixtures.manifest.manifestId, fixtures.operation.stableId, fixtures.operation.idempotencyKey),
    manifestId: fixtures.manifest.manifestId,
    inversePlanId: fixtures.request.inversePlan.inversePlanId,
    inversePlanSha256: fixtures.request.authorization.inversePlanSha256,
    permitId: fixtures.permit.permitId,
    claimId: fixtures.claim.claimId,
    sequence: fixtures.operation.sequence,
    stableId: fixtures.operation.stableId,
    operationKind: fixtures.operation.kind,
    idempotencyKey: fixtures.operation.idempotencyKey,
    dispatchStatus: outcome.dispatchStatus,
    status: outcome.status,
    recoveredFromUnknown: false,
    recoveredFromReceiptId: null,
    recoveredFromReceiptSha256: null,
    readback: operationReadback,
    retryState: classifyStagedInverseRetryState(operationReadback),
    blockers: [],
    receiptPersistence: "terminal" as const,
    authoritativeReread: true as const,
    foreignStatePreserved: true as const,
    execution: "not-implemented" as const,
    readyClaim: false as const,
    observedAt: outcome.observedAt,
  };
  const receiptSha256 = await sha256FoundryIr(canonicalizeFoundryIr(receipt));
  const candidate = { receipt, receiptSha256 };
  const foreignReceipt = { ...candidate.receipt, receiptId: "dbx:inverse-receipt:foreign" };
  const foreignReceiptSha256 = await sha256FoundryIr(canonicalizeFoundryIr(foreignReceipt));
  const reread = persistenceStatus === "persisted" ? candidate : persistenceStatus === "conflict" ? { receipt: foreignReceipt, receiptSha256: foreignReceiptSha256 } : null;
  const observedReceiptSha256 = reread ? await sha256FoundryIr(canonicalizeFoundryIr(reread.receipt)) : null;
  return {
    preflight: fixtures.preflight,
    readback: operationReadback,
    outcome,
    persistence: {
      schemaVersion: "0.1.0" as const,
      status: persistenceStatus,
      writeOutcome: "committed" as const,
      persistence: {
        schemaVersion: "0.1.0" as const,
        receiptId: candidate.receipt.receiptId,
        manifestId: candidate.receipt.manifestId,
        stableId: candidate.receipt.stableId,
        idempotencyKey: candidate.receipt.idempotencyKey,
        permitId: candidate.receipt.permitId,
        claimId: candidate.receipt.claimId,
        candidateReceiptSha256: receiptSha256,
        observedReceiptSha256,
        state: persistenceStatus,
        authoritativeReread: true as const,
        retryAfter: persistenceStatus === "unknown" ? "authoritative-reread" as const : "never" as const,
        foreignStatePreserved: true as const,
        execution: "not-implemented" as const,
        readyClaim: false as const,
      },
      candidate,
      reread,
      observedAt: "2026-08-31T04:11:00.000Z",
      authoritativeReread: true as const,
      foreignStatePreserved: true as const,
      execution: "not-implemented" as const,
      readyClaim: false as const,
    },
  };
}

describe("staged inverse executor composition", () => {
  it("derives one exact terminal candidate and maps persisted M684 resolution without dispatch", async () => {
    const fixtures = await fixture();
    const result = await composeStagedInverseExecutorHandoff(await preparedInput(fixtures));
    expect(result).toMatchObject({ status: "persisted", preflightStatus: "selected", persistenceStatus: "persisted", adapterDispatch: "not-authorized-by-this-contract", authoritativeReread: true, execution: "not-implemented", readyClaim: false });
    expect(result.terminalReceipt?.receiptId).toBe(deriveStagedInverseTerminalReceiptId(fixtures.manifest.manifestId, fixtures.operation.stableId, fixtures.operation.idempotencyKey));
  });

  it("maps missing, unknown, and conflict persistence without continuation", async () => {
    const fixtures = await fixture();
    await expect(composeStagedInverseExecutorHandoff(await preparedInput(fixtures, "missing"))).resolves.toMatchObject({ status: "missing", persistenceStatus: "missing", blockers: ["Terminal receipt persistence is missing; no executor continuation is authorized."] });
    await expect(composeStagedInverseExecutorHandoff(await preparedInput(fixtures, "unknown"))).resolves.toMatchObject({ status: "unknown", persistenceStatus: "unknown", blockers: ["Terminal receipt persistence is unknown; no executor continuation is authorized."] });
    await expect(composeStagedInverseExecutorHandoff(await preparedInput(fixtures, "conflict"))).resolves.toMatchObject({ status: "conflict", persistenceStatus: "conflict", blockers: ["Terminal receipt persistence is conflict; no executor continuation is authorized."] });
  });

  it("blocks a changed operation identity, blocked preflight, and reread digest tampering", async () => {
    const fixtures = await fixture();
    const valid = await preparedInput(fixtures);
    await expect(composeStagedInverseExecutorHandoff({ ...valid, readback: { ...valid.readback, operationSha256: "f".repeat(64) } })).resolves.toMatchObject({ status: "blocked", persistenceStatus: "persisted" });

    const blockedPreflight = await prepareStagedInversePreflight(
      { request: fixtures.request, manifest: fixtures.manifest, permit: fixtures.permit, claimPersistenceResolution: fixtures.claimPersistenceResolution, observedAt: "2026-08-31T04:12:00.000Z" },
      { claims: { load: async () => ({ ok: true as const, value: null }) }, currentGm: { read: async () => ({ ok: true as const, value: { userId: "gm", observedAt: "2026-08-31T04:13:00.000Z" } }) }, receipts: { enumerate: async () => ({ ok: true as const, value: {} }) } },
    );
    await expect(composeStagedInverseExecutorHandoff({ ...valid, preflight: blockedPreflight })).resolves.toMatchObject({ status: "blocked", preflightStatus: "blocked", persistenceStatus: "persisted" });

    const tampered = { ...valid, persistence: { ...valid.persistence, persistence: { ...valid.persistence.persistence, observedReceiptSha256: "a".repeat(64) } } };
    await expect(composeStagedInverseExecutorHandoff(tampered)).resolves.toMatchObject({ status: "blocked" });
  });

  it("rejects forged and stale claim persistence witnesses at M686", async () => {
    const fixtures = await fixture();
    const valid = await preparedInput(fixtures);
    const claimObservation = valid.preflight.claimObservation;
    if (valid.preflight.status !== "selected" || valid.preflight.preDispatch.status !== "selected" || valid.preflight.claimPersistenceResolution === null || claimObservation?.claim == null) {
      throw new Error("fixture did not preserve selected claim evidence");
    }
    const claim = claimObservation.claim;
    const forgedClaim = { ...claim, claimId: "dbx:inverse-claim:forged" };
    const forgedWitness = { ...valid.preflight.claimPersistenceResolution, candidate: forgedClaim, reread: forgedClaim };
    const forgedPreflight = {
      ...valid.preflight,
      claimPersistenceResolution: forgedWitness,
      preDispatch: { ...valid.preflight.preDispatch, claimPersistenceResolution: forgedWitness },
    };
    await expect(composeStagedInverseExecutorHandoff({ ...valid, preflight: forgedPreflight })).resolves.toMatchObject({
      status: "blocked",
      blockers: ["M686 requires one exact matched claim persistence-resolution witness across the selected preflight and authoritative claimed reread."],
    });

    const staleWitness = { ...valid.preflight.claimPersistenceResolution, observedAt: "2026-08-31T04:05:00.000Z" };
    const stalePreflight = {
      ...valid.preflight,
      claimPersistenceResolution: staleWitness,
      preDispatch: { ...valid.preflight.preDispatch, claimPersistenceResolution: staleWitness },
    };
    await expect(composeStagedInverseExecutorHandoff({ ...valid, preflight: stalePreflight })).resolves.toMatchObject({
      status: "blocked",
      blockers: ["M686 requires one exact matched claim persistence-resolution witness across the selected preflight and authoritative claimed reread."],
    });
  });
});
