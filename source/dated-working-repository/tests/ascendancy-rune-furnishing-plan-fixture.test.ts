import { describe, expect, it } from "vitest";
import {
  createAscendancyMapBlueprints,
  createAscendancyRuneFurnishingPlanFixture,
  validateAscendancyRuneFurnishingPlanFixture,
} from "@dicebox/compiler";

describe("M1074 Rune M7 furnishing-plan fixture", () => {
  it("binds all six placeable kinds to the existing Rune Blueprint", () => {
    const plan = createAscendancyRuneFurnishingPlanFixture();
    expect(plan.sceneBinding.semantic.id).toBe("dbx:scene:rune-mechanism-chamber");
    expect(plan.sceneBinding.documentId).toBe("m1074-rune-mechanism-chamber");
    expect(plan.blueprint.blueprintId).toBe("dbx:blueprint:rune-mechanism-chamber");
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
      anchorId: "dbx:anchor:rune-lawson-memory",
    })]);
    expect(plan.mutation).toBe("disabled-until-exact-runtime-gate");
  });

  it("preserves the Rune Blueprint and keeps fixture asset identities non-locating", () => {
    const source = createAscendancyMapBlueprints().find(
      (candidate) => candidate.blueprintId === "dbx:blueprint:rune-mechanism-chamber",
    );
    expect(source).toBeDefined();
    const before = JSON.stringify(source);
    const plan = createAscendancyRuneFurnishingPlanFixture();
    expect(JSON.stringify(source)).toBe(before);
    expect(plan.items.filter((item) => item.asset).map((item) => item.asset)).toEqual([
      expect.objectContaining({ assetId: "dbx:asset:m1074-rune-furnishing-texture", role: "texture" }),
      expect.objectContaining({ assetId: "dbx:asset:m1074-rune-furnishing-token", role: "token" }),
      expect.objectContaining({ assetId: "dbx:asset:m1074-rune-furnishing-audio", role: "audio" }),
    ]);
    for (const item of plan.items) {
      if (item.asset) expect(item.asset).not.toHaveProperty("locator");
    }
    expect(plan).not.toHaveProperty("execute");
    expect(plan).not.toHaveProperty("foundryPayload");
    expect(validateAscendancyRuneFurnishingPlanFixture(plan)).toEqual(plan);
  });

  it("fails closed if Rune identity or raw document shape drifts", () => {
    const plan = createAscendancyRuneFurnishingPlanFixture();
    expect(() => validateAscendancyRuneFurnishingPlanFixture({
      ...plan,
      sceneBinding: { ...plan.sceneBinding, semantic: { id: "dbx:scene:signal-frequency-chamber", kind: "scene" } },
    })).toThrow();
    expect(() => validateAscendancyRuneFurnishingPlanFixture({
      ...plan,
      items: plan.items.map((item, index) => index === 1
        ? { ...item, foundryDocument: { _id: "foreign" } }
        : item),
    })).toThrow();
  });
});
