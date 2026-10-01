import { describe, expect, it } from "vitest";
import {
  createAscendancyRendererAttestationReadinessEnvelope,
  validateAscendancyRendererAttestationReadinessEnvelope,
} from "@dicebox/compiler";

describe("M1084 renderer attestation-readiness envelope", () => {
  it("separates documented-only evidence, the byte-attestation gate, and final-map blockers", () => {
    const envelope = createAscendancyRendererAttestationReadinessEnvelope();
    expect(envelope.scenes.map((scene) => scene.evidenceClass)).toEqual([
      "documented-only",
      "documented-only",
      "documented-only",
      "documented-only",
    ]);
    expect(envelope.scenes.map((scene) => scene.nextGate)).toEqual([
      "manifest-and-byte-attestation-required",
      "manifest-and-byte-attestation-required",
      "manifest-and-byte-attestation-required",
      "manifest-and-byte-attestation-required",
    ]);
    expect(envelope.scenes.every((scene) => scene.dependentDocumentEligibility === "blocked")).toBe(true);
    expect(envelope.scenes.every((scene) => scene.observedSha256 === null)).toBe(true);
    expect(envelope.authority).toEqual({
      renderer: "scene-background",
      geometry: "spatial-blueprint",
      assetAttestation: "not-observed",
      dependentDocuments: "blocked",
      nativeMapping: "not-proven",
      runtime: "not-modeled",
    });
  });

  it("preserves exact renderer identities and rejects unsupported authority fields", () => {
    const envelope = createAscendancyRendererAttestationReadinessEnvelope();
    expect(envelope.scenes.map((scene) => scene.sceneId)).toEqual([
      "dbx:scene:signal-frequency-chamber",
      "dbx:scene:ascendancy-tram-depot",
      "dbx:scene:rune-mechanism-chamber",
      "dbx:scene:central-core-control-chamber",
    ]);
    expect(validateAscendancyRendererAttestationReadinessEnvelope(envelope)).toEqual(envelope);
    expect(envelope).not.toHaveProperty("execute");
    expect(envelope).not.toHaveProperty("foundryDocuments");
    expect(envelope).not.toHaveProperty("observedBytes");
    expect(() => validateAscendancyRendererAttestationReadinessEnvelope({
      ...envelope,
      scenes: envelope.scenes.map((scene, index) => index === 0
        ? { ...scene, evidenceClass: "final-map-required", nextGate: "blocked-by-final-map", approvedManifest: "not-eligible-until-final-map", expectedByteLength: "unavailable-until-final-map" }
        : scene),
    })).toThrow(/drifted|Scene-bound/);
    expect(() => validateAscendancyRendererAttestationReadinessEnvelope({
      ...envelope,
      scenes: envelope.scenes.map((scene, index) => index === 1
        ? { ...scene, sceneId: "dbx:scene:rune-mechanism-chamber" }
        : scene),
    })).toThrow();
  });
});
