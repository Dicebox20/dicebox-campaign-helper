import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import {
  ascendancySignalRuneSourceStagedServedProfileGateSchema,
  createAscendancySignalRuneFreshSceneCandidatePreview,
  createAscendancySignalRuneSourceStagedServedProfileGate,
} from "@dicebox/compiler";

const root = resolve(import.meta.dirname, "..");
const m1144 = JSON.parse(readFileSync(resolve(root, "outputs/m1144-current-foundry-artifact-spec-receipt.json"), "utf8")) as {
  canonicalSpecification: unknown;
  verifierExpectation: unknown;
};

function input() {
  return {
    candidatePreview: createAscendancySignalRuneFreshSceneCandidatePreview(),
    sourceHashes: [
      { path: "packages/dicebox-compiler/src/ascendancy-signal-rune-fresh-scene-candidate-preview.ts", sha256: "1771CA3CF6ADA6009ABC8454772A505EDC8694D637DF7A27A9765E47B47AB5A9" },
      { path: "packages/dicebox-compiler/src/index.ts", sha256: "02BB5777EB27B9CBE5B8B1106471B7D38C00ACA8362D3CFFD3536AEF4DFF99AC" },
      { path: "tests/ascendancy-signal-rune-fresh-scene-candidate-preview.test.ts", sha256: "98DAAE4BD8CF9FFAE576A461B7DED47C3A3C2AD44573681FEF713EEA4DE17CA5" },
    ],
    artifactIdentity: { spec: m1144.canonicalSpecification, verifier: m1144.verifierExpectation },
    runtimeObservation: {
      worldId: "dbx-test-world",
      foundryVersion: "14.367",
      systemId: "dnd5e",
      systemVersion: "5.3.3",
      activeGmName: "Gamemaster",
      activeGmObserved: true,
      currentUserMatchesActiveGm: true,
      exactTargetMatch: true,
      moduleLoad: "dicebox-campaign-helper@dbx=0.1.18",
      runtimeFingerprint: "dbx:fingerprint:cbea3468",
      servedByteHash: "not-observed",
      runtimeProfile: "incomplete",
      profileDiff: "unavailable",
    },
  } as const;
}

describe("M1146 Signal/Rune source-staged-served-profile gate", () => {
  it("preserves current source and artifact identity while blocking missing promotion evidence", () => {
    const gate = createAscendancySignalRuneSourceStagedServedProfileGate(input());
    expect(gate).toMatchObject({
      status: "BLOCKED",
      evidenceClass: "local",
      gates: {
        source: "pass",
        staged: "blocked-unobserved",
        served: "blocked-unobserved",
        runtimeProfile: "blocked-incomplete",
        profileDiff: "blocked-unavailable",
        installerScope: "blocked-candidate-specific-boundary-unresolved",
        authority: "blocked-live-write-execution-unproven",
      },
      noWrite: true,
      apply: false,
      runtimeBinding: "not-created",
      payload: "not-materialized",
      proposal: "not-created",
      dispatch: "disabled",
      foreignState: "preserve",
      preserveUnknown: true,
      readyClaim: false,
    });
    expect(gate.blockers).toEqual([
      "staged-package-byte-parity-unobserved",
      "served-byte-hash-unobserved",
      "runtime-profile-incomplete",
      "runtime-profile-diff-unavailable",
      "candidate-specific-installer-boundary-unresolved",
      "live-write-and-execution-authority-unproven",
    ]);
    expect(gate.candidateScope.excludedRuntimeScenes).toEqual(["AneddhKAAfk5HlsA", "p9Mbi0CJWe9KvJhH"]);
    expect(ascendancySignalRuneSourceStagedServedProfileGateSchema.parse(gate)).toEqual(gate);
  });

  it("rejects verifier, target, candidate, and duplicate-source drift before producing a gate", () => {
    const base = input();
    expect(() => createAscendancySignalRuneSourceStagedServedProfileGate({
      ...base,
      artifactIdentity: { ...base.artifactIdentity, verifier: { ...(base.artifactIdentity.verifier as Record<string, unknown>), sourceSpecId: "dbx:foundry-spec:foreign" } },
    })).toThrow("verifier drift");
    expect(() => createAscendancySignalRuneSourceStagedServedProfileGate({
      ...base,
      runtimeObservation: { ...base.runtimeObservation, systemVersion: "5.3.2" } as never,
    })).toThrow();
    expect(() => createAscendancySignalRuneSourceStagedServedProfileGate({
      ...base,
      candidatePreview: { ...base.candidatePreview, excludedRuntimeScenes: [base.candidatePreview.excludedRuntimeScenes[0]!, { ...base.candidatePreview.excludedRuntimeScenes[1]!, sceneIdRuntime: "foreign" }] },
    })).toThrow();
    expect(() => createAscendancySignalRuneSourceStagedServedProfileGate({
      ...base,
      sourceHashes: [base.sourceHashes[0]!, base.sourceHashes[0]!, base.sourceHashes[2]!],
    })).toThrow("exactly once");
  });

  it("passes only served parity when one verified worker observation is supplied", () => {
    const base = input();
    const workerSha256 = "2B4F79997CAB9C963C7F3826BFD2BAF2B3DEC256F630970A8D7CDD983743AA87";
    const gate = createAscendancySignalRuneSourceStagedServedProfileGate({
      ...base,
      runtimeObservation: { ...base.runtimeObservation, servedByteHash: workerSha256 } as never,
      servedWorkerObservation: {
        status: "PASS",
        httpStatus: 200,
        requestCount: 1,
        byteLength: 12288,
        sourceSha256: workerSha256,
        servedSha256: workerSha256,
        canonicalSha256: workerSha256,
        sourceServedParity: true,
        canonicalParity: true,
      },
    });
    expect(gate.gates).toMatchObject({ served: "pass", staged: "blocked-unobserved", runtimeProfile: "blocked-incomplete", profileDiff: "blocked-unavailable" });
    expect(gate.blockers).not.toContain("served-byte-hash-unobserved");
    expect(gate.servedWorkerObservation).toMatchObject({ status: "PASS", requestCount: 1, canonicalParity: true });
  });
});
