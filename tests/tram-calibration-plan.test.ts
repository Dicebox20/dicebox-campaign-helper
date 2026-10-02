import { describe, expect, it } from "vitest";
import { createTramCalibrationPlan, validateTramCalibrationPlan } from "@dicebox/compiler";

describe("fixture-only Tram coordinate calibration plan", () => {
  it("projects one native Tile and one Region from the same frozen board rectangle", () => {
    const plan = createTramCalibrationPlan();
    expect(validateTramCalibrationPlan(plan)).toEqual(plan);
    expect(plan.target).toEqual({ worldId: "dbx-test-world", foundryVersion: "14.367", systemId: "dnd5e", systemVersion: "5.3.3" });
    expect(plan.scene).toMatchObject({ canvas: { width: 1536, height: 1024 }, rendererPath: "assets/maps/ascendancy-tram-calibration-graybox-v1.png", geometrySource: "ascendancy-tram-v4-spatial-blueprint" });
    expect(plan.walls.segments).toHaveLength(11);
    expect(plan.walls.doors).toEqual([
      { anchorId: "dbx:anchor:tram-door-east", position: { x: 1512, y: 447.5 }, clearance: 47.5 },
      { anchorId: "dbx:anchor:tram-yard-ingress", position: { x: 420, y: 447.5 }, clearance: 47.5 },
      { anchorId: "dbx:anchor:tram-yard-exit", position: { x: 1080, y: 447.5 }, clearance: 47.5 },
    ]);
    expect(plan.tile.bounds).toEqual({ x: 530, y: 400, width: 220, height: 95 });
    expect(plan.region.bounds).toEqual(plan.tile.bounds);
    expect(plan.tile.api).toBe('scene.createEmbeddedDocuments("Tile", ...)');
    expect(plan.region.api).toBe('scene.createEmbeddedDocuments("Region", ...)');
    expect(plan.reread.comparison).toBe("exact-x-y-width-height");
    expect(plan.mutation).toBe("disabled-until-exact-runtime-gate");
  });

  it("rejects a Region that drifts from the functional Tile rectangle", () => {
    const plan = createTramCalibrationPlan();
    expect(() => validateTramCalibrationPlan({ ...plan, region: { ...plan.region, bounds: { ...plan.region.bounds, x: plan.region.bounds.x + 1 } } })).toThrow(/must exactly equal/i);
  });
});
