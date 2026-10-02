import { describe, expect, it } from "vitest";
import {
  createAscendancyRendererAssetBindingMatrix,
  validateAscendancyRendererAssetBindingMatrix,
} from "@dicebox/compiler";

describe("M1082 renderer/asset-binding status matrix", () => {
  it("reports exact four Scene binding statuses and documented hash evidence", () => {
    const matrix = createAscendancyRendererAssetBindingMatrix();
    expect(matrix.scenes.map((scene) => scene.sceneId)).toEqual([
      "dbx:scene:signal-frequency-chamber",
      "dbx:scene:ascendancy-tram-depot",
      "dbx:scene:rune-mechanism-chamber",
      "dbx:scene:central-core-control-chamber",
    ]);
    expect(matrix.scenes.map((scene) => scene.status)).toEqual([
      "scene-bound",
      "scene-bound",
      "scene-bound",
      "scene-bound",
    ]);
    expect(matrix.scenes.map((scene) => scene.path)).toEqual([
      "assets/maps/ascendancy-signal-frequency-chamber-v2.png",
      "assets/maps/ascendancy-tram-depot-routing-yard-v6-neutral.png",
      "assets/maps/ascendancy-rune-mechanism-chamber-v2.png",
      "assets/maps/manual-central-core-control-chamber-v5-neutral.png",
    ]);
    expect(matrix.scenes.map((scene) => scene.documentedSha256)).toEqual([
      "DB9307932865B0D3A23C5A8AA61082D520206443318658DE7E03C773A1A9972E",
      "591DB926FF0A733282CC047BCF5094B9057449D00D168EF751C0991107F1B988",
      "F45922E219A12FBA6B79A26AD0D6B5EBBAF51ADD86C025E9B676DA24707D507B",
      "8BA721E5B8499323BDCC868284DBF20C53A2BA07EC919F1BF9E923D89238EF11",
    ]);
  });

  it("keeps byte attestation, native mapping, runtime, and mutation boundaries explicit", () => {
    const matrix = createAscendancyRendererAssetBindingMatrix();
    expect(matrix.scenes.every((scene) => scene.observedSha256 === null)).toBe(true);
    expect(matrix.scenes.every((scene) => scene.attestationStatus === "not-observed")).toBe(true);
    expect(matrix.scenes.every((scene) => scene.nativeMapping === "not-proven")).toBe(true);
    expect(matrix.scenes.every((scene) => scene.runtimeState === "not-modeled")).toBe(true);
    expect(matrix.authority).toEqual({
      renderer: "scene-background",
      geometry: "spatial-blueprint",
      assetAttestation: "not-observed",
      nativeMapping: "not-proven",
      runtime: "not-modeled",
    });
    expect(matrix.mutation).toBe("disabled-until-exact-runtime-gate");
    expect(matrix).not.toHaveProperty("execute");
    expect(matrix).not.toHaveProperty("foundryDocuments");
    expect(matrix).not.toHaveProperty("observedBytes");
    expect(validateAscendancyRendererAssetBindingMatrix(matrix)).toEqual(matrix);
  });

  it("fails closed on status, path, hash, cross-Scene, and raw-field drift", () => {
    const matrix = createAscendancyRendererAssetBindingMatrix();
    expect(() => validateAscendancyRendererAssetBindingMatrix({
      ...matrix,
      scenes: matrix.scenes.map((scene, index) => index === 0
        ? { ...scene, status: "final-map-required", path: null, documentedSha256: null, hashEvidence: "not-available" }
        : scene),
    })).toThrow(/drifted/);
    expect(() => validateAscendancyRendererAssetBindingMatrix({
      ...matrix,
      scenes: matrix.scenes.map((scene, index) => index === 1
        ? { ...scene, path: "assets/maps/foreign.png" }
        : scene),
    })).toThrow();
    expect(() => validateAscendancyRendererAssetBindingMatrix({
      ...matrix,
      scenes: matrix.scenes.map((scene, index) => index === 0
        ? { ...scene, sceneId: "dbx:scene:rune-mechanism-chamber" }
        : scene),
    })).toThrow();
    expect(() => validateAscendancyRendererAssetBindingMatrix({
      ...matrix,
      rawFoundry: { Scene: {} },
    })).toThrow();
  });
});
