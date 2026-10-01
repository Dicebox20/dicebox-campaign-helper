import { describe, expect, it } from "vitest";
import { createTramRoutingFixturePlan, validateTramRoutingFixturePlan } from "@dicebox/compiler";

describe("fixture Tram routing projection package", () => {
  it("freezes the map-first fixture rehearsal with six equal Tile/Region projections", () => {
    const plan = createTramRoutingFixturePlan();
    expect(validateTramRoutingFixturePlan(plan)).toEqual(plan);
    expect(plan.scene).toMatchObject({ sceneId: "dbx:scene:fixture-tram-routing-projection", canvas: { width: 1536, height: 1024 } });
    expect(plan.walls.segments).toHaveLength(11);
    expect(plan.walls.doors).toHaveLength(3);
    expect(plan.scene.rendererPath).toBe("assets/maps/ascendancy-tram-depot-routing-yard-v6-neutral.png");
    expect(plan.staticVisualTiles).toHaveLength(5);
    expect(plan.staticVisualTiles.find((tile) => tile.tileId === "dbx:tile:tram-rail-grid")).toMatchObject({ assetPath: "assets/tiles/ascendancy-tram-rail-grid-v3.svg", x: 420, y: 210, width: 660, height: 570 });
    expect(plan.staticRegions).toHaveLength(39);
    expect(plan.staticRegions.find((region) => region.regionId === "dbx:region:tram-exit")).toMatchObject({ x: 1080, y: 400, width: 390, height: 95 });
    expect(plan.initialProjections).toHaveLength(6);
    for (const projection of plan.initialProjections) {
      expect(projection.footprintRegion).toMatchObject({ x: projection.x, y: projection.y, width: projection.width, height: projection.height, rotation: 0 });
    }
    expect(plan.approvedFixtureMove).toEqual({ pieceId: "dbx:tram:b", delta: -1 });
    expect(plan.approvedMoveProjection).toMatchObject({
      tileId: "dbx:tile:tram-b", footprintRegionId: "dbx:region:tram-b-footprint",
      x: 420, y: 495, width: 110, height: 190,
      footprintRegion: { x: 420, y: 495, width: 110, height: 190, rotation: 0 },
    });
  });
});
