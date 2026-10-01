import { describe, expect, it } from "vitest";
import {
  createAscendancyCentralCoreSceneAuthoringFixture,
  validateAscendancySceneAuthoringFixture,
} from "@dicebox/compiler";

describe("M1066 composed Central Core Scene authoring fixture", () => {
  it("composes the four existing compiler planes with explicit source counts", () => {
    const fixture = createAscendancyCentralCoreSceneAuthoringFixture();
    expect(fixture.scene).toEqual({
      sceneId: "dbx:scene:central-core-control-chamber",
      blueprintId: "dbx:blueprint:central-core-control-chamber",
      spatialPlanId: "dbx:plan:m1066-central-core-spatial",
      regionPlanId: "dbx:plan:central-core-control-chamber-regions",
      furnishingPlanId: "dbx:plan:m1064-ascendancy-furnishing-fixture",
    });
    expect(fixture.spatialProjection.steps.map((step) => [step.kind, step.sourceCount])).toEqual([
      ["scene", 1],
      ["walls", fixture.spatialProjection.blueprint.walls.length],
      ["regions", fixture.spatialProjection.blueprint.regions.length],
    ]);
    expect(fixture.regionPlan.regions).toHaveLength(10);
    expect(fixture.regionPlan.teleports).toHaveLength(2);
    expect(fixture.backgroundObjectSceneIds).toHaveLength(10);
    expect(fixture.furnishingPlan.items).toHaveLength(6);
    expect(fixture.furnishingPlan.steps).toHaveLength(6);
    expect(fixture.authority).toEqual({
      semanticScene: "renderer-neutral-scene-semantics",
      spatial: "spatial-blueprint-owns-geometry",
      regions: "region-plan-owns-region-and-teleport-intent",
      backgroundObjects: "visual-workflow-projection",
      furnishing: "m7-native-placeable-plan",
      runtime: "not-modeled",
    });
    expect(fixture.mutation).toBe("disabled-until-exact-runtime-gate");
  });

  it("preserves the four source plans and exposes no raw execute surface", () => {
    const fixture = createAscendancyCentralCoreSceneAuthoringFixture();
    expect(validateAscendancySceneAuthoringFixture(fixture)).toEqual(fixture);
    expect(fixture.spatialProjection.blueprint.blueprintId).toBe(fixture.furnishingPlan.blueprint.blueprintId);
    expect(fixture.regionPlan.sceneId).toBe(fixture.scene.sceneId);
    expect(fixture.backgroundObjectPreview.objects.every((object) => object.mutation === "disabled-until-exact-runtime-gate")).toBe(true);
    expect(fixture).not.toHaveProperty("execute");
    expect(fixture).not.toHaveProperty("foundryDocuments");
    expect(fixture).not.toHaveProperty("rawFoundry");
  });

  it("rejects cross-scene and raw-document drift", () => {
    const fixture = createAscendancyCentralCoreSceneAuthoringFixture();
    expect(() => validateAscendancySceneAuthoringFixture({
      ...fixture,
      regionPlan: { ...fixture.regionPlan, sceneId: "dbx:scene:signal-frequency-chamber" },
    })).toThrow(/Region plan identity/);
    expect(() => validateAscendancySceneAuthoringFixture({
      ...fixture,
      rawFoundry: { Scene: {} },
    })).toThrow();
  });
});
