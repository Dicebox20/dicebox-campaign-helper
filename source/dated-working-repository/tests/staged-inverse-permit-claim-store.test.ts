import { describe, expect, it } from "vitest";
import {
  createStagedInversePermitClaimStore,
  resolveStagedInversePermitClaimPersistenceObservation,
} from "@dicebox/compiler";

const claim = {
  schemaVersion: "0.1.0",
  claimId: "dbx:inverse-claim:store",
  permitId: "dbx:inverse-permit:store",
  permitSha256: "a".repeat(64),
  manifestId: "dbx:inverse-manifest:store",
  idempotencyKey: "dbx:inverse-claim-idempotency:store",
  activeGmUserId: "gm",
  state: "claimed",
  observedAt: "2026-08-30T23:30:00.000Z",
  authoritativeReread: true,
  singleUse: true,
  foreignStatePreserved: true,
  execution: "not-implemented",
  readyClaim: false,
} as const;

function envelope(value: unknown): string {
  return JSON.stringify({ schemaVersion: "0.1.0", claim: value });
}

function persistenceFactory() {
  let raw = "";
  let writes = 0;
  let reads = 0;
  let failWrite = false;
  let commitOnFailedWrite = false;
  let suppressWrite = false;
  let afterWriteRaw: string | null = null;
  let failReadAfterFirst = false;
  return {
    get raw() { return raw; },
    get writes() { return writes; },
    get reads() { return reads; },
    setFail(value: boolean, commit = false) { failWrite = value; commitOnFailedWrite = commit; },
    setSuppressWrite(value: boolean) { suppressWrite = value; },
    setAfterWrite(value: string) { afterWriteRaw = value; },
    setFailReadAfterFirst(value: boolean) { failReadAfterFirst = value; },
    read: async () => {
      reads += 1;
      if (failReadAfterFirst && reads > 1) throw new Error("post-write reread unavailable");
      return raw;
    },
    write: async (value: string) => {
      writes += 1;
      if (!suppressWrite) raw = afterWriteRaw ?? value;
      if (failWrite) {
        if (!commitOnFailedWrite) raw = "";
        throw new Error("write uncertainty");
      }
    },
  };
}

describe("staged inverse permit claim store", () => {
  it("serializes the first claim, rereads it, and makes an exact repeat idempotent", async () => {
    const persistence = persistenceFactory();
    const store = createStagedInversePermitClaimStore(persistence);
    const first = await store.claim(claim);
    expect(first).toMatchObject({ ok: true, value: { status: "matched", writeOutcome: "committed", retryAfter: "never", authoritativeReread: true } });
    const repeat = await store.claim(claim);
    expect(repeat).toMatchObject({ ok: true, value: { status: "matched", writeOutcome: "not-attempted", retryAfter: "never" } });
    expect(persistence.writes).toBe(1);
    expect(persistence.reads).toBe(3);
  });

  it("resolves an uncertain write from an exact post-write reread without retrying", async () => {
    const persistence = persistenceFactory();
    persistence.setFail(true, true);
    const result = await createStagedInversePermitClaimStore(persistence).claim(claim);
    expect(result).toMatchObject({ ok: true, value: { status: "matched", writeOutcome: "unknown", retryAfter: "never" } });
    expect(persistence.writes).toBe(1);
    expect(persistence.reads).toBe(2);
  });

  it("distinguishes missing and unreadable post-write outcomes", async () => {
    const missingPersistence = persistenceFactory();
    missingPersistence.setSuppressWrite(true);
    const missing = await createStagedInversePermitClaimStore(missingPersistence).claim(claim);
    expect(missing).toMatchObject({ ok: true, value: { status: "missing", retryAfter: "safe-to-retry" } });
    expect(missingPersistence.writes).toBe(1);
    expect(missingPersistence.reads).toBe(2);

    const unknownPersistence = persistenceFactory();
    unknownPersistence.setFailReadAfterFirst(true);
    const unknown = await createStagedInversePermitClaimStore(unknownPersistence).claim(claim);
    expect(unknown).toMatchObject({ ok: true, value: { status: "unknown", retryAfter: "authoritative-reread" } });
    expect(unknownPersistence.writes).toBe(1);
    expect(unknownPersistence.reads).toBe(2);
  });

  it("preserves conflicting state and refuses conflicting pre-existing claims", async () => {
    const conflicting = { ...claim, claimId: "dbx:inverse-claim:other" };
    const persistence = persistenceFactory();
    persistence.setAfterWrite(envelope(conflicting));
    const result = await createStagedInversePermitClaimStore(persistence).claim(claim);
    expect(result).toMatchObject({ ok: true, value: { status: "conflicting", retryAfter: "never" } });
    expect(persistence.raw).toContain("dbx:inverse-claim:other");

    const preExisting = persistenceFactory();
    preExisting.setAfterWrite(envelope(conflicting));
    const store = createStagedInversePermitClaimStore(preExisting);
    await store.claim(conflicting);
    const refused = await store.claim(claim);
    expect(refused).toMatchObject({ ok: false, error: { code: "FORBIDDEN" } });
  });

  it("purely resolves matched, missing, unknown, and conflicting observations", () => {
    const base = {
      schemaVersion: "0.1.0" as const,
      candidate: claim,
      writeOutcome: "committed" as const,
      reread: null,
      observedAt: "2026-08-30T23:31:00.000Z",
      authoritativeReread: true as const,
      foreignStatePreserved: true as const,
      execution: "not-implemented" as const,
      readyClaim: false as const,
    };
    expect(resolveStagedInversePermitClaimPersistenceObservation({ ...base, rereadState: "matched", reread: claim })).toMatchObject({ status: "matched", retryAfter: "never" });
    expect(resolveStagedInversePermitClaimPersistenceObservation({ ...base, rereadState: "missing" })).toMatchObject({ status: "missing", retryAfter: "safe-to-retry" });
    expect(resolveStagedInversePermitClaimPersistenceObservation({ ...base, rereadState: "unknown", reread: { ...claim, state: "unknown" } })).toMatchObject({ status: "unknown", retryAfter: "authoritative-reread" });
    expect(resolveStagedInversePermitClaimPersistenceObservation({ ...base, rereadState: "conflicting", reread: { ...claim, claimId: "dbx:inverse-claim:other" } })).toMatchObject({ status: "conflicting", retryAfter: "never" });
  });
});
