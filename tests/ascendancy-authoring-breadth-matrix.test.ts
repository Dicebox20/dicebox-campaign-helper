import { describe, expect, it } from "vitest";
import {
  createAscendancyAuthoringBreadthMatrix,
  validateAscendancyAuthoringBreadthMatrix,
} from "@dicebox/compiler";

describe("M1076 four-Scene authoring-breadth matrix", () => {
  it("reports all four source families with composed six-kind M7 coverage", () => {
    const matrix = createAscendancyAuthoringBreadthMatrix();
    expect(matrix.scenes).toHaveLength(4);
    expect(matrix.scenes.map((scene) => scene.sceneId)).toEqual([
      "dbx:scene:signal-frequency-chamber",
      "dbx:scene:ascendancy-tram-depot",
      "dbx:scene:rune-mechanism-chamber",
      "dbx:scene:central-core-control-chamber",
    ]);
    expect(matrix.scenes.map((scene) => scene.backgroundObjectCount)).toEqual([7, 5, 7, 10]);
    expect(matrix.scenes.map((scene) => scene.status)).toEqual(["COMPOSED", "COMPOSED", "COMPOSED", "COMPOSED"]);
    expect(matrix.scenes.every((scene) => scene.blockers.length === 0)).toBe(true);
    expect(matrix.scenes[0]).toMatchObject({
      furnishingPlanId: "dbx:plan:m1070-signal-furnishing-fixture",
      m7ItemCount: 6,
      m7StepCount: 6,
      blockers: [],
    });
    expect(matrix.scenes[3]).toMatchObject({
      furnishingPlanId: "dbx:plan:m1064-ascendancy-furnishing-fixture",
      m7ItemCount: 6,
      m7StepCount: 6,
      blockers: [],
    });
    expect(matrix.scenes[2]).toMatchObject({
      furnishingPlanId: "dbx:plan:m1074-rune-furnishing-fixture",
      m7ItemCount: 6,
      m7StepCount: 6,
      blockers: [],
    });
    expect(matrix.scenes[1]).toMatchObject({
      furnishingPlanId: "dbx:plan:m1078-tram-furnishing-fixture",
      m7ItemCount: 6,
      m7StepCount: 6,
      blockers: [],
    });
    expect(matrix.scenes.reduce((sum, scene) => sum + scene.backgroundObjectCount, 0)).toBe(29);
  });

  it("keeps authority and runtime boundaries explicit", () => {
    const matrix = createAscendancyAuthoringBreadthMatrix();
    expect(validateAscendancyAuthoringBreadthMatrix(matrix)).toEqual(matrix);
    expect(matrix.authority).toEqual({
      semanticScene: "renderer-neutral-scene-semantics",
      spatial: "spatial-blueprint-owns-geometry",
      regions: "region-plan-owns-region-and-teleport-intent",
      backgroundObjects: "visual-workflow-projection",
      furnishing: "m7-native-placeable-plan",
      runtime: "not-modeled",
    });
    expect(matrix.mutation).toBe("disabled-until-exact-runtime-gate");
    expect(matrix.runtimeState).toBe("not-modeled");
    expect(matrix).not.toHaveProperty("execute");
    expect(matrix).not.toHaveProperty("foundryDocuments");
    expect(matrix).not.toHaveProperty("rawFoundry");
  });

  it("rejects duplicate, cross-Scene, and raw-document drift", () => {
    const matrix = createAscendancyAuthoringBreadthMatrix();
    expect(() => validateAscendancyAuthoringBreadthMatrix({
      ...matrix,
      scenes: [matrix.scenes[0], matrix.scenes[0], matrix.scenes[2], matrix.scenes[3]],
    })).toThrow(/unique/);
    expect(() => validateAscendancyAuthoringBreadthMatrix({
      ...matrix,
      scenes: matrix.scenes.map((scene, index) => index === 0
        ? { ...scene, sceneId: "dbx:scene:rune-mechanism-chamber" }
        : scene),
    })).toThrow(/local key|drifted/);
    expect(() => validateAscendancyAuthoringBreadthMatrix({
      ...matrix,
      rawFoundry: { Scene: {} },
    })).toThrow();
  });
});
