import { describe, expect, it } from "vitest";
import { createAscendancySignalRuneRuntimeProfileAvailabilityGate } from "@dicebox/compiler";

const context = {
  receiptId: "dbx:receipt:m1148-served-parity-gate-refresh",
  status: "BLOCKED_SERVED_PARITY_REFRESH",
  servedGate: "pass",
  noWrite: true,
  readyClaim: false,
} as const;

const sourceSurface = {
  status: "present",
  sourcePath: "packages/dicebox-foundry/src/module.js",
  queryKind: "runtime-profile",
  apiPath: "game.diceboxCampaignHelper.query",
  schemaContract: "packages/dicebox-core/src/capability.ts:RuntimeProfileSchema",
  readOnly: true,
  sourceOnly: true,
} as const;

const observation = {
  status: "unobserved",
  sourceReceiptScope: "M1145-redacted-diagnostic-only",
  fullRuntimeProfileObserved: false,
  runtimeFingerprintObserved: false,
  profileDiffObserved: false,
  authoritativeRereadObserved: false,
} as const;

describe("ascendancy Signal/Rune RuntimeProfile availability gate", () => {
  it("keeps source-declared profile query availability separate from runtime evidence", () => {
    const gate = createAscendancySignalRuneRuntimeProfileAvailabilityGate({ m1148Context: context, sourceSurface, observation });
    expect(gate.gates).toEqual({
      sourceSurface: "pass",
      runtimeProfile: "blocked-source-surface-present-runtime-observation-unavailable",
      profileDiff: "blocked-no-runtime-profile",
      authoritativeReread: "blocked-unobserved",
    });
    expect(gate.blockers).toEqual([
      "runtime-profile-observation-unavailable",
      "runtime-profile-diff-unavailable",
      "authoritative-reread-unobserved",
    ]);
    expect(gate.noWrite).toBe(true);
    expect(gate.apply).toBe(false);
    expect(gate.dispatch).toBe("disabled");
  });

  it("rejects source or observation drift instead of inferring a live profile", () => {
    expect(() => createAscendancySignalRuneRuntimeProfileAvailabilityGate({
      m1148Context: context,
      sourceSurface: { ...sourceSurface, queryKind: "runtime-evidence" },
      observation,
    })).toThrow();
    expect(() => createAscendancySignalRuneRuntimeProfileAvailabilityGate({
      m1148Context: context,
      sourceSurface,
      observation: { ...observation, fullRuntimeProfileObserved: true },
    })).toThrow();
  });
});
