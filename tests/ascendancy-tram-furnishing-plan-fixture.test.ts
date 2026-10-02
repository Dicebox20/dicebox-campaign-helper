import { describe, expect, it } from "vitest";
import {
  createAscendancyMapBlueprints,
  createAscendancyTramFurnishingPlanFixture,
  validateAscendancyTramFurnishingPlanFixture,
} from "@dicebox/compiler";

describe("M1078 Tram M7 furnishing-plan fixture", () => {
  it("binds all six placeable kinds to the existing Tram Blueprint", () => {
    const plan = createAscendancyTramFurnishingPlanFixture();
    expect(plan.sceneBinding.semantic.id).toBe("dbx:scene:ascendancy-tram-depot");
    expect(plan.sceneBinding.documentId).toBe("m1078-ascendancy-tram-depot");
    expect(plan.blueprint.blueprintId).toBe("dbx:blueprint:ascendancy-tram-depot");
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
      anchorId: "dbx:anchor:tram-dalton-repair",
    })]);
    expect(plan.mutation).toBe("disabled-until-exact-runtime-gate");
  });

  it("preserves the Tram Blueprint and keeps fixture asset identities non-locating", () => {
    const source = createAscendancyMapBlueprints().find(
      (candidate) => candidate.blueprintId === "dbx:blueprint:ascendancy-tram-depot",
    );
    expect(source).toBeDefined();
    const before = JSON.stringify(source);
    const plan = createAscendancyTramFurnishingPlanFixture();
    expect(JSON.stringify(source)).toBe(before);
    expect(plan.items.filter((item) => item.asset).map((item) => item.asset)).toEqual([
      expect.objectContaining({ assetId: "dbx:asset:m1078-tram-furnishing-texture", role: "texture" }),
      expect.objectContaining({ assetId: "dbx:asset:m1078-tram-furnishing-token", role: "token" }),
      expect.objectContaining({ assetId: "dbx:asset:m1078-tram-furnishing-audio", role: "audio" }),
    ]);
    for (const item of plan.items) {
      if (item.asset) expect(item.asset).not.toHaveProperty("locator");
    }
    expect(plan).not.toHaveProperty("execute");
    expect(plan).not.toHaveProperty("foundryPayload");
    expect(validateAscendancyTramFurnishingPlanFixture(plan)).toEqual(plan);
  });

  it("fails closed if Tram identity or raw document shape drifts", () => {
    const plan = createAscendancyTramFurnishingPlanFixture();
    expect(() => validateAscendancyTramFurnishingPlanFixture({
      ...plan,
      sceneBinding: { ...plan.sceneBinding, semantic: { id: "dbx:scene:rune-mechanism-chamber", kind: "scene" } },
    })).toThrow();
    expect(() => validateAscendancyTramFurnishingPlanFixture({
      ...plan,
      items: plan.items.map((item, index) => index === 1
        ? { ...item, foundryDocument: { _id: "foreign" } }
        : item),
    })).toThrow();
  });
});
