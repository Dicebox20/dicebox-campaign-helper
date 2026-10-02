import { describe, expect, it } from "vitest";
import {
  createDisposableHarnessPlan,
  createDisposableHarnessSession,
  createRuntimeFingerprint,
  createStableDiceBoxId,
  serializeDisposableHarnessSessionReceipt,
  verifyDisposableHarnessSessionReceipt,
  type DisposableHarnessPlan,
  type DisposableHarnessSessionAdapter,
  type RuntimeProfile,
} from "@dicebox/core";

const observedAt = "2026-08-27T20:00:00.000Z";

function runtime(overrides: Partial<RuntimeProfile> = {}): RuntimeProfile {
  return {
    phase: "ready",
    foundryVersion: "14.367",
    systemId: "dnd5e",
    systemVersion: "5.3.3",
    observedAt,
    activeModuleIds: ["dicebox-campaign-helper"],
    documentTypes: ["Scene", "Region", "Wall"],
    capabilities: [],
    ...overrides,
  };
}

function plan(profile = runtime()): DisposableHarnessPlan {
  return createDisposableHarnessPlan({
    sessionId: "dbx:harness-session:m253-fixture",
    planId: "dbx:harness-plan:m253-fixture",
    worldId: "dbx:campaign:m253-fixture-world",
    profile,
    documentStableIds: ["dbx:scene:m253-scene", "dbx:region:m253-region"],
  });
}

function adapter(currentPlan: DisposableHarnessPlan, overrides: Partial<DisposableHarnessSessionAdapter> = {}): DisposableHarnessSessionAdapter {
  const fingerprintId = currentPlan.target.profileFingerprintId;
  const fixtureId = "dbx:fixture:m253-owned" as const;
  const bindings = [...currentPlan.documentStableIds];
  return {
    resetOwnedFixture: async () => ({ status: "reset", fixtureId, ownedOnly: true, foreignStatePreserved: true, noWrite: true, source: "fixture-adapter" }),
    readProfile: async () => ({ status: "observed", fingerprintId, source: "fixture-adapter", noWrite: true, foreignStatePreserved: true }),
    observeContext: async (context) => ({ status: "observed", context, fingerprintId, authority: context === "GM" ? "observed" : "not-applicable", stableBindingIds: bindings, source: "fixture-adapter", noWrite: true, foreignStatePreserved: true }),
    applyRepresentativeSlice: async () => ({ status: "simulated-committed", appliedStableIds: bindings, source: "fixture-adapter", noWrite: true, foreignStatePreserved: true }),
    rereadBindings: async () => ({ status: "matched", bindingStableIds: bindings, bindingDigest: "a".repeat(64), source: "fixture-adapter", noWrite: true, foreignStatePreserved: true }),
    induceUnknownOutcome: async () => ({ status: "unknown", operationId: createStableDiceBoxId("operation", "m253-unknown"), source: "fixture-adapter", noWrite: true, foreignStatePreserved: true }),
    recoverUnknownOutcome: async () => ({ status: "recovered", noRetry: true, bindingDigest: "a".repeat(64), source: "fixture-adapter", noWrite: true, foreignStatePreserved: true }),
    captureArtifacts: async () => [
      { artifactId: createStableDiceBoxId("artifact", "m253-trace"), kind: "trace", sha256: "b".repeat(64), label: "trace" },
      { artifactId: createStableDiceBoxId("artifact", "m253-redacted"), kind: "redacted-json", sha256: "c".repeat(64), label: "redacted" },
    ],
    ...overrides,
  };
}

describe("M253 disposable exact-stack harness session contract", () => {
  it("creates a canonical ordered, redacted, no-write local foundation receipt", async () => {
    const currentPlan = plan();
    const receipt = await createDisposableHarnessSession({ profile: runtime(), plan: currentPlan, adapter: adapter(currentPlan) });

    expect(receipt.status).toBe("pass-local-foundation");
    expect(receipt.readyClaim).toBe(false);
    expect(receipt.noWrite).toBe(true);
    expect(receipt.foreignStatePreserved).toBe(true);
    expect(receipt.events.map((event) => event.kind)).toEqual([
      "reset-owned-fixture", "profile-read", "gm-observe", "player3-observe", "apply-simulated",
      "binding-reread", "induce-unknown", "recovery-reread", "artifact-capture", "support-bundle",
    ]);
    expect(receipt.contexts).toEqual(["GM", "Player3"]);
    expect(receipt.artifacts.every((artifact) => artifact.label.startsWith("artifact-"))).toBe(true);
    await expect(verifyDisposableHarnessSessionReceipt(receipt)).resolves.toBe(true);
  });

  it("blocks a failed unknown-outcome recovery without retrying or promoting the session", async () => {
    const currentPlan = plan();
    const receipt = await createDisposableHarnessSession({
      profile: runtime(),
      plan: currentPlan,
      adapter: adapter(currentPlan, { recoverUnknownOutcome: async () => ({ status: "unknown", noRetry: true, bindingDigest: null, source: "fixture-adapter", noWrite: true, foreignStatePreserved: true }) }),
    });

    expect(receipt.status).toBe("blocked");
    expect(receipt.readyClaim).toBe(false);
    expect(receipt.events[7]?.status).toBe("unknown");
    expect(receipt.blockers.some((reason) => reason.includes("recovery"))).toBe(true);
  });

  it("fails closed for target drift and malformed lifecycle evidence", async () => {
    const currentPlan = plan();
    const drifted = await createDisposableHarnessSession({
      profile: runtime({ systemVersion: "5.2.0" }),
      plan: currentPlan,
      adapter: adapter(currentPlan),
    });
    expect(drifted.status).toBe("blocked");
    expect(drifted.blockers.some((reason) => reason.includes("target"))).toBe(true);

    const malformed = { ...currentPlan, events: [...currentPlan.events].reverse() };
    await expect(createDisposableHarnessSession({ profile: runtime(), plan: malformed, adapter: adapter(currentPlan) })).rejects.toThrow();
  });

  it("binds the session to the canonical runtime fingerprint and canonical serialization", async () => {
    const profile = runtime({ activeModuleIds: ["regionwright", "dicebox-campaign-helper"] });
    const currentPlan = plan(profile);
    const receipt = await createDisposableHarnessSession({ profile, plan: currentPlan, adapter: adapter(currentPlan) });
    expect(receipt.target.profileFingerprintId).toBe(createRuntimeFingerprint(profile).fingerprintId);
    expect(serializeDisposableHarnessSessionReceipt(receipt)).toBe(serializeDisposableHarnessSessionReceipt({ ...receipt }));
    await expect(verifyDisposableHarnessSessionReceipt({ ...receipt, sessionSha256: "d".repeat(64) })).rejects.toThrow(/hash/);
  });
});
