import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import {
  ascendancySignalRuneRuntimeProfileArtifactReconciliationSchema,
  createAscendancySignalRuneRuntimeProfileArtifactReconciliation,
} from "@dicebox/compiler";

const root = resolve(import.meta.dirname, "..");
const receipt = JSON.parse(readFileSync(resolve(root, "outputs/m1178-current-foundry-artifact-spec-receipt.json"), "utf8")) as {
  canonicalSpecification: any;
  verifierExpectation: any;
};

const descriptor = {
  schemaVersion: "0.1.0",
  source: "package-owned-static-descriptor",
  packageId: "dicebox-campaign-helper",
  packageVersion: "0.1.15",
  specId: receipt.canonicalSpecification.specId,
  verifierId: receipt.verifierExpectation.verifierId,
  specSha256: receipt.canonicalSpecification.specSha256,
  artifacts: receipt.canonicalSpecification.artifacts.map((artifact: any) => ({
    artifactId: artifact.artifactId,
    kind: artifact.kind,
    version: artifact.version,
    sha256: artifact.sha256,
  })),
  loadedByteHash: "not-claimed-by-runtime-profile",
};

const profile = {
  phase: "runtime-probe",
  foundryVersion: "14.367",
  systemId: "dnd5e",
  systemVersion: "5.3.3",
  observedAt: "2026-09-06T15:10:00.000Z",
  activeModuleIds: ["dicebox-campaign-helper", "regionwright"],
  documentTypes: ["Actor", "Item", "Scene"],
  capabilities: [
    { id: "bridge.query", state: "available", reason: "Read-only query surface." },
    { id: "foundry.document.write", state: "unavailable", reason: "Mutation remains gated." },
  ],
};

function input(overrides: Record<string, unknown> = {}) {
  return {
    artifactSpec: receipt.canonicalSpecification,
    artifactVerifier: receipt.verifierExpectation,
    artifactDescriptor: descriptor,
    runtimeProfile: profile,
    runtimeFingerprint: "dbx:fingerprint:cbea3468",
    activeGmObserved: true,
    currentUserMatchesActiveGm: true,
    ...overrides,
  } as const;
}

describe("M1182 RuntimeProfile artifact-bound reconciliation", () => {
  it("binds the current descriptor to the canonical five-artifact verifier without changing the core profile", () => {
    const receipt = createAscendancySignalRuneRuntimeProfileArtifactReconciliation(input());
    expect(receipt).toMatchObject({
      status: "PASS",
      evidenceClass: "local",
      artifactIdentity: {
        descriptorStatus: "PASS_CURRENT_ARTIFACT_DESCRIPTOR",
        artifactCount: 5,
        artifactMatches: 5,
        loadedByteHashClaimed: false,
      },
      profileDiff: {
        status: "PASS_EXACT_TARGET_AND_ARTIFACT_DESCRIPTOR",
        targetMatch: true,
        artifactIdentityMatch: true,
        identityInferred: false,
        unknownAndUnavailablePreserved: true,
      },
      noWrite: true,
      apply: false,
      runtimeBinding: "not-created",
      payload: "not-materialized",
      proposal: "not-created",
      dispatch: "disabled",
      readyClaim: false,
    });
    expect(ascendancySignalRuneRuntimeProfileArtifactReconciliationSchema.parse(receipt)).toEqual(receipt);
  });

  it("blocks descriptor drift, target drift, and missing current-GM evidence without inference", () => {
    const descriptorDrift = createAscendancySignalRuneRuntimeProfileArtifactReconciliation(input({
      artifactDescriptor: { ...descriptor, specSha256: "0".repeat(64) },
    }));
    expect(descriptorDrift.status).toBe("BLOCKED");
    expect(descriptorDrift.profileDiff).toMatchObject({ targetMatch: true, artifactIdentityMatch: false, identityInferred: false });
    const targetDrift = createAscendancySignalRuneRuntimeProfileArtifactReconciliation(input({
      runtimeProfile: { ...profile, systemVersion: "5.3.2" },
    }));
    expect(targetDrift.status).toBe("BLOCKED");
    expect(targetDrift.profileDiff.targetMatch).toBe(false);
    const missingGm = createAscendancySignalRuneRuntimeProfileArtifactReconciliation(input({ activeGmObserved: false }));
    expect(missingGm.status).toBe("BLOCKED");
    expect(missingGm.readyClaim).toBe(false);
  });
});
