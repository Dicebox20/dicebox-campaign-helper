import { describe, expect, it } from "vitest";
import {
  createStagedInverseExecutionAuthorization,
  createStagedInverseExecutionManifest,
  createStagedInverseExecutionPermit,
  createStagedInversePermitClaimState,
  deriveStagedInverseReceiptLedgerId,
  deriveStagedInverseReceiptQueryId,
  deriveStagedInverseTerminalReceiptId,
  prepareStagedInversePreflight,
  transitionStagedInversePermitClaim,
} from "@dicebox/compiler";
import { matchedStagedInversePermitClaimResolution } from "./staged-inverse-claim-fixture.js";

const plan = {
  schemaVersion: "0.1.0" as const,
  inversePlanId: "dbx:inverse-plan:preflight",
  originalPlanId: "dbx:plan:preflight",
  originalPlanSha256: "a".repeat(64),
  approvedByUserId: "gm",
  requiredActiveGm: true as const,
  reverseDependencyOrder: ["dbx:scene:preflight"],
  operations: [{
    kind: "delete-owned-create" as const,
    stableId: "dbx:scene:preflight",
    binding: { semantic: { id: "dbx:scene:preflight", kind: "scene" }, runtime: "foundry", documentType: "Scene", documentId: "scene", uuid: "Scene.scene", generation: 1 },
    expectedOwnership: { moduleId: "dicebox-campaign-helper", stableId: "dbx:scene:preflight", mode: "managed" as const },
  }],
  createdAt: "2026-08-31T03:00:00.000Z",
  execution: "not-implemented" as const,
  readyClaim: false as const,
};

async function fixture() {
  const authorization = await createStagedInverseExecutionAuthorization({ authorizationId: "dbx:inverse-authorization:preflight", inversePlan: plan, authorizedByActiveGmUserId: "gm", authorizedAt: "2026-08-31T03:01:00.000Z" });
  const request = { inversePlan: plan, authorization, approvedInversePlanId: plan.inversePlanId, approvedByUserId: "gm", activeGmUserId: "gm", idempotencyKey: "dbx:inverse-idempotency:preflight" };
  const manifest = await createStagedInverseExecutionManifest(request, "dbx:inverse-manifest:preflight", "fixture-adapter", "2026-08-31T03:02:00.000Z");
  const permit = await createStagedInverseExecutionPermit(request, manifest, "dbx:inverse-permit:preflight", "2026-08-31T03:03:00.000Z");
  const available = await createStagedInversePermitClaimState(request, manifest, permit, "dbx:inverse-claim:preflight", request.idempotencyKey, "2026-08-31T03:04:00.000Z");
  const pendingClaim = transitionStagedInversePermitClaim(available, { kind: "claim-committed", observedAt: "2026-08-31T03:05:00.000Z", authoritativeReread: false });
  const persistenceResolution = matchedStagedInversePermitClaimResolution(pendingClaim, "2026-08-31T03:05:01.000Z");
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
      observedAt: "2026-08-31T03:06:00.000Z",
      authoritativeReread: true as const,
      foreignStatePreserved: true as const,
      execution: "not-implemented" as const,
      readyClaim: false as const,
    }],
    observedAt: "2026-08-31T03:06:00.000Z",
    authoritativeReread: true as const,
    foreignStatePreserved: true as const,
    execution: "not-implemented" as const,
    readyClaim: false as const,
  };
  return { request, manifest, permit, claim, persistenceResolution, ledger };
}

describe("staged inverse preflight orchestration", () => {
  it("uses only load/read/enumerate in order and derives the exact pending receipt identity", async () => {
    const { request, manifest, permit, claim, persistenceResolution, ledger } = await fixture();
    const calls: string[] = [];
    const result = await prepareStagedInversePreflight(
      { request, manifest, permit, claimPersistenceResolution: persistenceResolution, observedAt: "2026-08-31T03:07:00.000Z" },
      {
        claims: { load: async () => { calls.push("claim-load"); return { ok: true as const, value: claim }; } },
        currentGm: { read: async () => { calls.push("gm-read"); return { ok: true as const, value: { userId: "gm", observedAt: "2026-08-31T03:08:00.000Z" } }; } },
        receipts: { enumerate: async (identity) => { calls.push("receipt-enumerate"); expect(identity.ledgerId).toBe(ledger.ledgerId); expect(identity.queryId).toBe(ledger.queryId); return { ok: true as const, value: ledger }; } },
      },
    );
    expect(calls).toEqual(["claim-load", "gm-read", "receipt-enumerate"]);
    expect(result).toMatchObject({ status: "selected", authoritativeReread: true, adapterDispatch: "not-authorized-by-this-contract", execution: "not-implemented", readyClaim: false, preDispatch: { status: "selected" } });
    if (result.preDispatch.status === "selected") {
      expect(result.preDispatch.receiptPersistence.receiptId).toBe(deriveStagedInverseTerminalReceiptId(manifest.manifestId, manifest.operations[0]!.stableId, manifest.operations[0]!.idempotencyKey));
    }
  });

  it("blocks a missing claim before reading GM or enumerating receipts", async () => {
    const { request, manifest, permit, persistenceResolution } = await fixture();
    const calls: string[] = [];
    const result = await prepareStagedInversePreflight(
      { request, manifest, permit, claimPersistenceResolution: persistenceResolution, observedAt: "2026-08-31T03:07:00.000Z" },
      {
        claims: { load: async () => { calls.push("claim-load"); return { ok: true as const, value: null }; } },
        currentGm: { read: async () => { calls.push("gm-read"); return { ok: true as const, value: { userId: "gm", observedAt: "2026-08-31T03:08:00.000Z" } }; } },
        receipts: { enumerate: async () => { calls.push("receipt-enumerate"); return { ok: true as const, value: {} }; } },
      },
    );
    expect(result).toMatchObject({ status: "blocked", authoritativeReread: true, preDispatch: { status: "blocked" } });
    expect(result.preDispatch.status === "blocked" && result.preDispatch.blockers[0]).toContain("missing");
    expect(calls).toEqual(["claim-load"]);
  });

  it("normalizes reader failures and never accepts caller-injected persistence", async () => {
    const { request, manifest, permit, claim, persistenceResolution } = await fixture();
    const result = await prepareStagedInversePreflight(
      { request, manifest, permit, claimPersistenceResolution: persistenceResolution, observedAt: "2026-08-31T03:07:00.000Z", receiptPersistence: null },
      {
        claims: { load: async () => ({ ok: true as const, value: claim }) },
        currentGm: { read: async () => ({ ok: false as const, error: { code: "UNAVAILABLE" as const, message: "GM reader unavailable", retry: "after-reread" as const } }) },
        receipts: { enumerate: async () => ({ ok: true as const, value: {} }) },
      },
    );
    expect(result).toMatchObject({ status: "blocked", preDispatch: { status: "blocked" }, adapterDispatch: "not-authorized-by-this-contract", execution: "not-implemented", readyClaim: false });
    expect(result.currentGmObservation).toBeNull();
  });

  it("blocks malformed ledger observations after authoritative claim and GM rereads", async () => {
    const { request, manifest, permit, claim, persistenceResolution } = await fixture();
    const result = await prepareStagedInversePreflight(
      { request, manifest, permit, claimPersistenceResolution: persistenceResolution, observedAt: "2026-08-31T03:07:00.000Z" },
      {
        claims: { load: async () => ({ ok: true as const, value: claim }) },
        currentGm: { read: async () => ({ ok: true as const, value: { userId: "gm", observedAt: "2026-08-31T03:08:00.000Z" } }) },
        receipts: { enumerate: async () => ({ ok: true as const, value: { malformed: true } }) },
      },
    );
    expect(result).toMatchObject({ status: "blocked", authoritativeReread: true, claimObservation: { status: "claimed" }, currentGmObservation: { userId: "gm" }, receiptLedgerObservation: null });
  });

  it("blocks a forged matched witness before reading GM or enumerating receipts", async () => {
    const { request, manifest, permit, claim, persistenceResolution } = await fixture();
    const forgedClaim = { ...persistenceResolution.reread!, claimId: "dbx:inverse-claim:other" };
    const forgedWitness = { ...persistenceResolution, candidate: forgedClaim, reread: forgedClaim };
    const calls: string[] = [];
    const result = await prepareStagedInversePreflight(
      { request, manifest, permit, claimPersistenceResolution: forgedWitness, observedAt: "2026-08-31T03:07:00.000Z" },
      {
        claims: { load: async () => { calls.push("claim-load"); return { ok: true as const, value: claim }; } },
        currentGm: { read: async () => { calls.push("gm-read"); return { ok: true as const, value: { userId: "gm", observedAt: "2026-08-31T03:08:00.000Z" } }; } },
        receipts: { enumerate: async () => { calls.push("receipt-enumerate"); return { ok: true as const, value: {} }; } },
      },
    );
    expect(result).toMatchObject({ status: "blocked", claimObservation: { status: "claimed" }, adapterDispatch: "not-authorized-by-this-contract" });
    expect(calls).toEqual(["claim-load"]);
  });
});
