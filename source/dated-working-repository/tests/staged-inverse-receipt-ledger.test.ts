import { describe, expect, it } from "vitest";
import {
  canonicalizeFoundryIr,
  classifyStagedInverseRetryState,
  createStagedInverseExecutionAuthorization,
  createStagedInverseExecutionManifest,
  createStagedInverseExecutionPermit,
  createStagedInversePermitClaimState,
  createStagedInverseReceiptStore,
  deriveStagedInverseReceiptLedgerId,
  deriveStagedInverseReceiptQueryId,
  deriveStagedInverseTerminalReceiptId,
  resolveStagedInverseReceiptAppendObservation,
  sha256FoundryIr,
  stagedInverseReceiptPersistenceResolutionSchema,
  stagedInverseTerminalReceiptSchema,
  transitionStagedInversePermitClaim,
  validateStagedInverseReceiptLedgerSnapshot,
  validateStagedInverseRecoveryLineage,
} from "@dicebox/compiler";
import { matchedStagedInversePermitClaimResolution } from "./staged-inverse-claim-fixture.js";

const plan = {
  schemaVersion: "0.1.0" as const,
  inversePlanId: "dbx:inverse-plan:receipt-ledger",
  originalPlanId: "dbx:plan:receipt-ledger",
  originalPlanSha256: "a".repeat(64),
  approvedByUserId: "gm",
  requiredActiveGm: true as const,
  reverseDependencyOrder: ["dbx:scene:receipt-ledger"],
  operations: [{
    kind: "delete-owned-create" as const,
    stableId: "dbx:scene:receipt-ledger",
    binding: { semantic: { id: "dbx:scene:receipt-ledger", kind: "scene" }, runtime: "foundry", documentType: "Scene", documentId: "scene", uuid: "Scene.scene", generation: 1 },
    expectedOwnership: { moduleId: "dicebox-campaign-helper", stableId: "dbx:scene:receipt-ledger", mode: "managed" as const },
  }],
  createdAt: "2026-08-31T03:00:00.000Z",
  execution: "not-implemented" as const,
  readyClaim: false as const,
};

async function makeFixtures() {
  const authorization = await createStagedInverseExecutionAuthorization({ authorizationId: "dbx:inverse-authorization:receipt-ledger", inversePlan: plan, authorizedByActiveGmUserId: "gm", authorizedAt: "2026-08-31T03:01:00.000Z" });
  const request = { inversePlan: plan, authorization, approvedInversePlanId: plan.inversePlanId, approvedByUserId: "gm", activeGmUserId: "gm", idempotencyKey: "dbx:inverse-idempotency:receipt-ledger" };
  const manifest = await createStagedInverseExecutionManifest(request, "dbx:inverse-manifest:receipt-ledger", "fixture-adapter", "2026-08-31T03:02:00.000Z");
  const permit = await createStagedInverseExecutionPermit(request, manifest, "dbx:inverse-permit:receipt-ledger", "2026-08-31T03:03:00.000Z");
  const available = await createStagedInversePermitClaimState(request, manifest, permit, "dbx:inverse-claim:receipt-ledger", request.idempotencyKey, "2026-08-31T03:04:00.000Z");
  const pendingClaim = transitionStagedInversePermitClaim(available, { kind: "claim-committed", observedAt: "2026-08-31T03:05:00.000Z", authoritativeReread: false });
  const persistenceResolution = matchedStagedInversePermitClaimResolution(pendingClaim, "2026-08-31T03:05:01.000Z");
  const claim = transitionStagedInversePermitClaim(pendingClaim, { kind: "reread-claimed", observedAt: persistenceResolution.observedAt, authoritativeReread: true, persistenceResolution });
  return { request, manifest, permit, claim, operation: manifest.operations[0]! };
}

function readback(fixtures: Awaited<ReturnType<typeof makeFixtures>>, status: "owned-absent" | "unknown") {
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
    status,
    binding: null,
    observedAt: "2026-08-31T03:06:00.000Z",
    authoritativeReread: true as const,
    foreignStatePreserved: true as const,
  };
}

function receipt(fixtures: Awaited<ReturnType<typeof makeFixtures>>, status: "committed" | "unknown" | "recovered") {
  const unknown = status === "unknown";
  const recovered = status === "recovered";
  const operationReadback = readback(fixtures, unknown ? "unknown" : "owned-absent");
  const retryState = classifyStagedInverseRetryState(operationReadback);
  return {
    schemaVersion: "0.1.0" as const,
    receiptId: deriveStagedInverseTerminalReceiptId(fixtures.manifest.manifestId, fixtures.operation.stableId, fixtures.operation.idempotencyKey, recovered ? "recovery" : "outcome"),
    manifestId: fixtures.manifest.manifestId,
    inversePlanId: fixtures.request.inversePlan.inversePlanId,
    inversePlanSha256: fixtures.request.authorization.inversePlanSha256,
    permitId: fixtures.permit.permitId,
    claimId: fixtures.claim.claimId,
    sequence: fixtures.operation.sequence,
    stableId: fixtures.operation.stableId,
    operationKind: fixtures.operation.kind,
    idempotencyKey: fixtures.operation.idempotencyKey,
    dispatchStatus: unknown || recovered ? "unknown" as const : "accepted" as const,
    status,
    recoveredFromUnknown: recovered,
    recoveredFromReceiptId: recovered ? deriveStagedInverseTerminalReceiptId(fixtures.manifest.manifestId, fixtures.operation.stableId, fixtures.operation.idempotencyKey) : null,
    recoveredFromReceiptSha256: null as string | null,
    readback: operationReadback,
    retryState,
    blockers: [],
    receiptPersistence: "terminal" as const,
    authoritativeReread: true as const,
    foreignStatePreserved: true as const,
    execution: "not-implemented" as const,
    readyClaim: false as const,
    observedAt: "2026-08-31T03:07:00.000Z",
  };
}

async function entry(receiptValue: ReturnType<typeof receipt>) {
  return { receipt: receiptValue, receiptSha256: await sha256FoundryIr(canonicalizeFoundryIr(receiptValue)) };
}

function operationLedger(fixtures: Awaited<ReturnType<typeof makeFixtures>>, state: "absent" | "persisted" | "unknown" | "conflict", receipts: Awaited<ReturnType<typeof entry>>[]) {
  const head = receipts.at(-1);
  return {
    schemaVersion: "0.1.0" as const,
    ledgerSequence: 0,
    stableId: fixtures.operation.stableId,
    operationKind: fixtures.operation.kind,
    idempotencyKey: fixtures.operation.idempotencyKey,
    state,
    receipts,
    headReceiptId: head?.receipt.receiptId ?? null,
    headReceiptSha256: head?.receiptSha256 ?? null,
    observedAt: "2026-08-31T03:08:00.000Z",
    authoritativeReread: true as const,
    foreignStatePreserved: true as const,
    execution: "not-implemented" as const,
    readyClaim: false as const,
  };
}

async function snapshot(fixtures: Awaited<ReturnType<typeof makeFixtures>>, operations: ReturnType<typeof operationLedger>[]) {
  return {
    schemaVersion: "0.1.0" as const,
    ledgerId: deriveStagedInverseReceiptLedgerId(fixtures.manifest.manifestId, fixtures.permit.permitId, fixtures.claim.claimId),
    queryId: deriveStagedInverseReceiptQueryId(fixtures.manifest.manifestId, fixtures.permit.permitId, fixtures.claim.claimId),
    manifestId: fixtures.manifest.manifestId,
    inversePlanId: fixtures.request.inversePlan.inversePlanId,
    inversePlanSha256: fixtures.request.authorization.inversePlanSha256,
    permitId: fixtures.permit.permitId,
    claimId: fixtures.claim.claimId,
    source: "terminal-receipt-store-enumerate-manifest" as const,
    completeForManifest: true as const,
    operations,
    observedAt: "2026-08-31T03:09:00.000Z",
    authoritativeReread: true as const,
    foreignStatePreserved: true as const,
    execution: "not-implemented" as const,
    readyClaim: false as const,
  };
}

function receiptPersistenceFactory() {
  let stored: unknown = null;
  let writes = 0;
  let reads = 0;
  let failAppend = false;
  let commitOnFailedAppend = false;
  let suppressAppend = false;
  let failReadAfterFirst = false;
  return {
    get writes() { return writes; },
    get reads() { return reads; },
    setFailAppend(value: boolean, commit = false) { failAppend = value; commitOnFailedAppend = commit; },
    setSuppressAppend(value: boolean) { suppressAppend = value; },
    setFailReadAfterFirst(value: boolean) { failReadAfterFirst = value; },
    setStored(value: unknown) { stored = value; },
    read: async () => {
      reads += 1;
      if (failReadAfterFirst && reads > 1) throw new Error("post-append reread unavailable");
      return { ok: true as const, value: stored };
    },
    append: async (value: unknown) => {
      writes += 1;
      if (!suppressAppend) stored = value;
      if (failAppend) {
        if (!commitOnFailedAppend) stored = null;
        return { ok: false as const, error: { code: "UNKNOWN_OUTCOME" as const, message: "append uncertainty", retry: "after-reread" as const } };
      }
      return { ok: true as const, value: undefined };
    },
  };
}

describe("staged inverse receipt ledger", () => {
  it("requires exact manifest coverage and validates an explicit absent or persisted operation head", async () => {
    const fixturesValue = await makeFixtures();
    const absent = await snapshot(fixturesValue, [operationLedger(fixturesValue, "absent", [])]);
    await expect(validateStagedInverseReceiptLedgerSnapshot(fixturesValue.request, fixturesValue.manifest, fixturesValue.permit, fixturesValue.claim, absent)).resolves.toMatchObject({ snapshot: { operations: [{ state: "absent" }] } });
    const committed = await entry(receipt(fixturesValue, "committed"));
    const persisted = await snapshot(fixturesValue, [operationLedger(fixturesValue, "persisted", [committed])]);
    await expect(validateStagedInverseReceiptLedgerSnapshot(fixturesValue.request, fixturesValue.manifest, fixturesValue.permit, fixturesValue.claim, persisted)).resolves.toMatchObject({ snapshot: { operations: [{ headReceiptId: committed.receipt.receiptId }] } });
    await expect(validateStagedInverseReceiptLedgerSnapshot(fixturesValue.request, fixturesValue.manifest, fixturesValue.permit, fixturesValue.claim, await snapshot(fixturesValue, []))).rejects.toThrow("every manifest operation");
  });

  it("binds receipt hashes, operation identities, permit/claim lineage, and rejects tampering", async () => {
    const fixturesValue = await makeFixtures();
    const committed = await entry(receipt(fixturesValue, "committed"));
    const valid = await snapshot(fixturesValue, [operationLedger(fixturesValue, "persisted", [committed])]);
    const foreignClaim = { ...committed.receipt, claimId: "dbx:inverse-claim:foreign" as typeof committed.receipt.claimId };
    const foreignEntry = await entry(foreignClaim);
    await expect(validateStagedInverseReceiptLedgerSnapshot(fixturesValue.request, fixturesValue.manifest, fixturesValue.permit, fixturesValue.claim, await snapshot(fixturesValue, [operationLedger(fixturesValue, "persisted", [foreignEntry])]))).rejects.toThrow("current permit and claim");
    await expect(validateStagedInverseReceiptLedgerSnapshot(fixturesValue.request, fixturesValue.manifest, fixturesValue.permit, fixturesValue.claim, { ...valid, operations: [{ ...valid.operations[0]!, receipts: [{ ...committed, receiptSha256: "f".repeat(64) }], headReceiptSha256: "f".repeat(64) }] })).rejects.toThrow("digest");
  });

  it("resolves append rereads into persisted, missing, unknown, or conflict states without retry", async () => {
    const fixturesValue = await makeFixtures();
    const candidate = await entry(receipt(fixturesValue, "committed"));
    const matched = resolveStagedInverseReceiptAppendObservation({ schemaVersion: "0.1.0", candidate, writeOutcome: "committed", rereadState: "matched", reread: candidate, observedAt: "2026-08-31T03:10:00.000Z", authoritativeReread: true, foreignStatePreserved: true, execution: "not-implemented", readyClaim: false });
    expect(matched).toMatchObject({ status: "persisted", persistence: { state: "persisted", retryAfter: "never" } });
    const missing = resolveStagedInverseReceiptAppendObservation({ schemaVersion: "0.1.0", candidate, writeOutcome: "unknown", rereadState: "missing", reread: null, observedAt: "2026-08-31T03:11:00.000Z", authoritativeReread: true, foreignStatePreserved: true, execution: "not-implemented", readyClaim: false });
    expect(missing).toMatchObject({ status: "missing", persistence: { state: "missing", candidateReceiptSha256: candidate.receiptSha256, observedReceiptSha256: null, retryAfter: "never" } });
    const conflict = resolveStagedInverseReceiptAppendObservation({ schemaVersion: "0.1.0", candidate, writeOutcome: "committed", rereadState: "conflict", reread: { ...candidate, receipt: { ...candidate.receipt, receiptId: "dbx:inverse-receipt:foreign" } }, observedAt: "2026-08-31T03:12:00.000Z", authoritativeReread: true, foreignStatePreserved: true, execution: "not-implemented", readyClaim: false });
    expect(conflict).toMatchObject({ status: "conflict", persistence: { state: "conflict" } });
  });

  it("rejects forged persistence status/state mismatches and invalid reread semantics", async () => {
    const fixturesValue = await makeFixtures();
    const candidate = await entry(receipt(fixturesValue, "committed"));
    const persisted = resolveStagedInverseReceiptAppendObservation({ schemaVersion: "0.1.0", candidate, writeOutcome: "committed", rereadState: "matched", reread: candidate, observedAt: "2026-08-31T03:13:00.000Z", authoritativeReread: true, foreignStatePreserved: true, execution: "not-implemented", readyClaim: false });
    const missing = resolveStagedInverseReceiptAppendObservation({ schemaVersion: "0.1.0", candidate, writeOutcome: "committed", rereadState: "missing", reread: null, observedAt: "2026-08-31T03:14:00.000Z", authoritativeReread: true, foreignStatePreserved: true, execution: "not-implemented", readyClaim: false });
    const unknown = resolveStagedInverseReceiptAppendObservation({ schemaVersion: "0.1.0", candidate, writeOutcome: "unknown", rereadState: "unknown", reread: null, observedAt: "2026-08-31T03:15:00.000Z", authoritativeReread: true, foreignStatePreserved: true, execution: "not-implemented", readyClaim: false });
    const foreignReread = { ...candidate, receipt: { ...candidate.receipt, receiptId: "dbx:inverse-receipt:foreign" } };

    expect(stagedInverseReceiptPersistenceResolutionSchema.safeParse({ ...persisted, status: "missing" }).success).toBe(false);
    expect(stagedInverseReceiptPersistenceResolutionSchema.safeParse({ ...persisted, reread: null }).success).toBe(false);
    expect(stagedInverseReceiptPersistenceResolutionSchema.safeParse({ ...persisted, reread: foreignReread }).success).toBe(false);
    expect(stagedInverseReceiptPersistenceResolutionSchema.safeParse({ ...missing, reread: candidate }).success).toBe(false);
    expect(stagedInverseReceiptPersistenceResolutionSchema.safeParse({ ...unknown, reread: candidate }).success).toBe(false);
    expect(stagedInverseReceiptPersistenceResolutionSchema.safeParse({ ...persisted, status: "conflict", persistence: { ...persisted.persistence, state: "conflict" } }).success).toBe(false);
  });

  it("serializes append-at-most-once persistence and rereads after successful or uncertain append", async () => {
    const fixturesValue = await makeFixtures();
    const candidate = await entry(receipt(fixturesValue, "committed"));
    const persistence = receiptPersistenceFactory();
    const store = createStagedInverseReceiptStore(persistence);

    const first = await store.persistTerminalReceipt(fixturesValue.request, fixturesValue.manifest, fixturesValue.permit, fixturesValue.claim, candidate);
    expect(first).toMatchObject({ ok: true, value: { status: "persisted", writeOutcome: "committed", persistence: { state: "persisted", candidateReceiptSha256: candidate.receiptSha256, observedReceiptSha256: candidate.receiptSha256 } } });
    const repeat = await store.persistTerminalReceipt(fixturesValue.request, fixturesValue.manifest, fixturesValue.permit, fixturesValue.claim, candidate);
    expect(repeat).toMatchObject({ ok: true, value: { status: "persisted", writeOutcome: "not-attempted" } });
    expect(persistence.writes).toBe(1);
    expect(persistence.reads).toBe(3);

    const uncertainPersistence = receiptPersistenceFactory();
    uncertainPersistence.setFailAppend(true, true);
    const uncertain = await createStagedInverseReceiptStore(uncertainPersistence).persistTerminalReceipt(fixturesValue.request, fixturesValue.manifest, fixturesValue.permit, fixturesValue.claim, candidate);
    expect(uncertain).toMatchObject({ ok: true, value: { status: "persisted", writeOutcome: "unknown" } });
    expect(uncertainPersistence.writes).toBe(1);
    expect(uncertainPersistence.reads).toBe(2);
  });

  it("classifies missing, unreadable, and foreign post-append state without retry or overwrite", async () => {
    const fixturesValue = await makeFixtures();
    const candidate = await entry(receipt(fixturesValue, "committed"));

    const missingPersistence = receiptPersistenceFactory();
    missingPersistence.setSuppressAppend(true);
    const missing = await createStagedInverseReceiptStore(missingPersistence).persistTerminalReceipt(fixturesValue.request, fixturesValue.manifest, fixturesValue.permit, fixturesValue.claim, candidate);
    expect(missing).toMatchObject({ ok: true, value: { status: "missing", writeOutcome: "committed", persistence: { observedReceiptSha256: null } } });
    expect(missingPersistence.writes).toBe(1);
    expect(missingPersistence.reads).toBe(2);

    const unreadablePersistence = receiptPersistenceFactory();
    unreadablePersistence.setFailReadAfterFirst(true);
    const unreadable = await createStagedInverseReceiptStore(unreadablePersistence).persistTerminalReceipt(fixturesValue.request, fixturesValue.manifest, fixturesValue.permit, fixturesValue.claim, candidate);
    expect(unreadable).toMatchObject({ ok: true, value: { status: "unknown", persistence: { observedReceiptSha256: null, retryAfter: "authoritative-reread" } } });
    expect(unreadablePersistence.writes).toBe(1);
    expect(unreadablePersistence.reads).toBe(2);

    const foreignPersistence = receiptPersistenceFactory();
    foreignPersistence.setStored(await entry({ ...candidate.receipt, receiptId: "dbx:inverse-receipt:foreign" }));
    const foreign = await createStagedInverseReceiptStore(foreignPersistence).persistTerminalReceipt(fixturesValue.request, fixturesValue.manifest, fixturesValue.permit, fixturesValue.claim, candidate);
    expect(foreign).toMatchObject({ ok: true, value: { status: "conflict", writeOutcome: "not-attempted" } });
    expect(foreignPersistence.writes).toBe(0);
  });

  it("requires an exact unknown-to-recovered lineage and rejects the accepted-unknown status hole", async () => {
    const fixturesValue = await makeFixtures();
    const unknown = await entry(receipt(fixturesValue, "unknown"));
    const recoveredValue = receipt(fixturesValue, "recovered");
    recoveredValue.recoveredFromReceiptSha256 = unknown.receiptSha256;
    const recovered = await entry(recoveredValue);
    await expect(validateStagedInverseRecoveryLineage(fixturesValue.request, fixturesValue.manifest, fixturesValue.permit, fixturesValue.claim, unknown, recovered)).resolves.toMatchObject({ unknownReceiptId: unknown.receipt.receiptId, recoveredReceiptId: recovered.receipt.receiptId, unknownReceiptSha256: unknown.receiptSha256 });
    await expect(validateStagedInverseRecoveryLineage(fixturesValue.request, fixturesValue.manifest, fixturesValue.permit, fixturesValue.claim, unknown, await entry({ ...recoveredValue, recoveredFromReceiptSha256: "a".repeat(64) }))).rejects.toThrow("lineage");
    expect(stagedInverseTerminalReceiptSchema.safeParse({ ...unknown.receipt, dispatchStatus: "accepted" }).success).toBe(false);
  });
});
