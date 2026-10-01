import { describe, expect, it } from "vitest";
import { createAscendancySignalRuneSmallestMissingEvidenceBoundary } from "@dicebox/compiler";

const context = {
  receiptId: "dbx:receipt:m1149-runtime-profile-availability-gate",
  status: "BLOCKED_RUNTIME_PROFILE_UNOBSERVED",
  sourceSurface: "pass",
  runtimeProfile: "blocked-source-surface-present-runtime-observation-unavailable",
  noWrite: true,
  readyClaim: false,
} as const;

const sourceInventory = {
  runtimeProfileQuerySurface: "present",
  runtimeEvidenceDiagnosticSurface: "redacted-only",
  runtimeProfileDiffSurface: "not-present",
  authoritativeRereadObservation: "not-observed",
  sourceProfileIsRuntimeEvidence: false,
} as const;

describe("ascendancy Signal/Rune smallest missing evidence boundary", () => {
  it("selects runtime observation as the next boundary without promoting source/API presence", () => {
    const gate = createAscendancySignalRuneSmallestMissingEvidenceBoundary({ m1149Context: context, sourceInventory });
    expect(gate.disposition).toBe("runtime-observation-required");
    expect(gate.gates).toEqual({
      sourceInventory: "pass",
      completeRuntimeProfile: "blocked-runtime-observation-required",
      profileDiff: "blocked-runtime-profile-diff-surface-not-present",
      authoritativeReread: "blocked-runtime-reread-unobserved",
    });
    expect(gate.blockers).toHaveLength(3);
    expect(gate.noWrite).toBe(true);
    expect(gate.apply).toBe(false);
    expect(gate.dispatch).toBe("disabled");
  });

  it("rejects any attempt to turn source inventory into observed evidence", () => {
    expect(() => createAscendancySignalRuneSmallestMissingEvidenceBoundary({
      m1149Context: context,
      sourceInventory: { ...sourceInventory, sourceProfileIsRuntimeEvidence: true },
    })).toThrow();
  });
});
