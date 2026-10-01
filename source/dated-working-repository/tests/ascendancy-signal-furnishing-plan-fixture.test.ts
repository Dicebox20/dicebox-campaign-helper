import { describe, expect, it } from "vitest";
import {
  createAscendancyMapBlueprints,
  createAscendancySignalFurnishingPlanFixture,
  validateAscendancySignalFurnishingPlanFixture,
} from "@dicebox/compiler";

describe("M1070 Signal M7 furnishing-plan fixture", () => {
  it("binds all six placeable kinds to the existing Signal Blueprint", () => {
    const plan = createAscendancySignalFurnishingPlanFixture();
    expect(plan.sceneBinding.semantic.id).toBe("dbx:scene:signal-frequency-chamber");
    expect(plan.blueprint.blueprintId).toBe("dbx:blueprint:signal-frequency-chamber");
    expect(plan.items.map((item) => item.kind)).toEqual([
      "tile",
      "token",
      "ambientLight",
      "ambientSound",
      "drawing",
      "note",
    ]);
    expect(plan.steps.map((step) => step.kind)).toEqual(plan.items.map((item) => item.kind));
    expect(plan.relations).toEqual([expect.objectContaining({
      kind: "near-anchor",
      anchorId: "dbx:anchor:signal-aleister-frequency",
    })]);
    expect(plan.mutation).toBe("disabled-until-exact-runtime-gate");
  });

  it("preserves the Signal Blueprint and keeps fixture asset identities non-locating", () => {
    const source = createAscendancyMapBlueprints().find(
      (candidate) => candidate.blueprintId === "dbx:blueprint:signal-frequency-chamber",
    );
    expect(source).toBeDefined();
    const before = JSON.stringify(source);
    const plan = createAscendancySignalFurnishingPlanFixture();
    expect(JSON.stringify(source)).toBe(before);
    expect(plan.items.filter((item) => item.asset).map((item) => item.asset)).toEqual([
      expect.objectContaining({ assetId: "dbx:asset:m1070-signal-furnishing-texture", role: "texture" }),
      expect.objectContaining({ assetId: "dbx:asset:m1070-signal-furnishing-token", role: "token" }),
      expect.objectContaining({ assetId: "dbx:asset:m1070-signal-furnishing-audio", role: "audio" }),
    ]);
    for (const item of plan.items) {
      if (item.asset) expect(item.asset).not.toHaveProperty("locator");
    }
    expect(plan).not.toHaveProperty("execute");
    expect(plan).not.toHaveProperty("foundryPayload");
    expect(validateAscendancySignalFurnishingPlanFixture(plan)).toEqual(plan);
  });

  it("fails closed if Signal identity or raw document shape drifts", () => {
    const plan = createAscendancySignalFurnishingPlanFixture();
    expect(() => validateAscendancySignalFurnishingPlanFixture({
      ...plan,
      sceneBinding: { ...plan.sceneBinding, semantic: { id: "dbx:scene:central-core-control-chamber", kind: "scene" } },
    })).toThrow();
    expect(() => validateAscendancySignalFurnishingPlanFixture({
      ...plan,
      items: plan.items.map((item, index) => index === 1
        ? { ...item, foundryDocument: { _id: "foreign" } }
        : item),
    })).toThrow();
  });
});
