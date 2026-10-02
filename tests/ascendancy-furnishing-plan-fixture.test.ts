import { describe, expect, it } from "vitest";
import {
  createAscendancyFurnishingPlanFixture,
  createAscendancyMapBlueprints,
  validateFurnishingProjectionPlan,
} from "@dicebox/compiler";

describe("M1064 campaign-bound M7 furnishing fixture", () => {
  it("binds all six placeable kinds to the existing Core Spatial Blueprint", () => {
    const plan = createAscendancyFurnishingPlanFixture();
    expect(plan.sceneBinding.semantic.id).toBe("dbx:scene:central-core-control-chamber");
    expect(plan.blueprint.blueprintId).toBe("dbx:blueprint:central-core-control-chamber");
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
      anchorId: "dbx:anchor:core-aleister-station",
    })]);
    expect(plan.mutation).toBe("disabled-until-exact-runtime-gate");
  });

  it("preserves the source Blueprint and keeps fixture asset identities non-locating", () => {
    const source = createAscendancyMapBlueprints().find(
      (candidate) => candidate.blueprintId === "dbx:blueprint:central-core-control-chamber",
    );
    expect(source).toBeDefined();
    const before = JSON.stringify(source);
    const plan = createAscendancyFurnishingPlanFixture();
    expect(JSON.stringify(source)).toBe(before);
    expect(plan.items.filter((item) => item.asset).map((item) => item.asset)).toEqual([
      expect.objectContaining({ assetId: "dbx:asset:m1064-furnishing-texture", role: "texture" }),
      expect.objectContaining({ assetId: "dbx:asset:m1064-furnishing-token", role: "token" }),
      expect.objectContaining({ assetId: "dbx:asset:m1064-furnishing-audio", role: "audio" }),
    ]);
    for (const item of plan.items) {
      if (item.asset) expect(item.asset).not.toHaveProperty("locator");
    }
    expect(plan).not.toHaveProperty("execute");
    expect(plan).not.toHaveProperty("foundryPayload");
    expect(validateFurnishingProjectionPlan(plan)).toEqual(plan);
  });

  it("fails closed if the fixture is made out of bounds or raw-field shaped", () => {
    const plan = createAscendancyFurnishingPlanFixture();
    expect(() => validateFurnishingProjectionPlan({
      ...plan,
      items: plan.items.map((item, index) => index === 5
        ? { ...item, position: { x: 1500, y: 1000 } }
        : item),
    })).toThrow(/bounds/);
    expect(() => validateFurnishingProjectionPlan({
      ...plan,
      items: plan.items.map((item, index) => index === 1
        ? { ...item, foundryDocument: { _id: "foreign" } }
        : item),
    })).toThrow();
  });
});
