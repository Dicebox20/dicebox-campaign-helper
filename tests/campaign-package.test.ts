import { describe, expect, it } from "vitest";
import { createCurrentCampaignPackage, validateCampaignPackage } from "@dicebox/compiler";

describe("compiled Ballad of Chauser Bill campaign package", () => {
  it("compiles the campaign fixture, Regionwright handoff, and tram Scene plan together", () => {
    const compiled = createCurrentCampaignPackage();
    expect(validateCampaignPackage(compiled)).toEqual(compiled);
    expect(compiled.packageId).toBe("dbx:package:chauser-bill-prime-arachnid-aftermath");
    expect(compiled.campaign.scenarioId).toBe(compiled.regionwrightHandoff.scenarioId);
    expect(compiled.regionwrightHandoff.personalPuzzles).toHaveLength(6);
    expect(compiled.regionwrightHandoff.cooperativeStages).toHaveLength(3);
    expect(compiled.regionwrightHandoff.finalActivation.stationCharacterIds).toHaveLength(6);
    expect(compiled.regionPlans).toHaveLength(4);
    expect(compiled.spatialBlueprints).toHaveLength(4);
    expect(compiled.spatialBlueprints.map((blueprint) => ({ id: blueprint.blueprintId, walls: blueprint.walls.length, doors: blueprint.anchors.filter((anchor) => anchor.kind === "door").length }))).toEqual([
      { id: "dbx:blueprint:signal-frequency-chamber", walls: 6, doors: 2 },
      { id: "dbx:blueprint:ascendancy-tram-depot", walls: 11, doors: 3 },
      { id: "dbx:blueprint:rune-mechanism-chamber", walls: 6, doors: 2 },
      { id: "dbx:blueprint:central-core-control-chamber", walls: 7, doors: 3 },
    ]);
    expect(compiled.regionPlans.every((plan) => plan.coordinateSource === "campaign-helper-orthogonal-coordinate-plan")).toBe(true);
    expect(compiled.staticVisualTileProjection).toMatchObject({ rendererPolicy: "geometry-neutral-backgrounds-only" });
    expect(compiled.staticVisualTileProjection.tiles).toHaveLength(29);
    expect(compiled.staticVisualTileProjection.tiles.filter((tile) => tile.sceneId === "dbx:scene:signal-frequency-chamber").map((tile) => ({ id: tile.tileId, bounds: tile.bounds }))).toEqual([
      { id: "dbx:tile:signal-door-north", bounds: { x: 680, y: 24, width: 176, height: 72 } },
      { id: "dbx:tile:signal-door-south", bounds: { x: 680, y: 928, width: 176, height: 72 } },
      { id: "dbx:tile:signal-central-resonator", bounds: { x: 568, y: 330, width: 400, height: 300 } },
      { id: "dbx:tile:signal-aleister-console", bounds: { x: 180, y: 175, width: 180, height: 120 } },
      { id: "dbx:tile:signal-sprocket-console", bounds: { x: 1176, y: 175, width: 180, height: 120 } },
      { id: "dbx:tile:signal-cooperative-left-console", bounds: { x: 270, y: 560, width: 180, height: 100 } },
      { id: "dbx:tile:signal-cooperative-right-console", bounds: { x: 1086, y: 560, width: 180, height: 100 } },
    ]);
    expect(compiled.staticVisualTileProjection.tiles.filter((tile) => tile.sceneId === "dbx:scene:rune-mechanism-chamber").map((tile) => ({ id: tile.tileId, bounds: tile.bounds }))).toEqual([
      { id: "dbx:tile:rune-door-north", bounds: { x: 680, y: 24, width: 176, height: 72 } },
      { id: "dbx:tile:rune-door-south", bounds: { x: 680, y: 928, width: 176, height: 72 } },
      { id: "dbx:tile:rune-central-engine", bounds: { x: 568, y: 330, width: 400, height: 300 } },
      { id: "dbx:tile:rune-lawson-archive", bounds: { x: 210, y: 180, width: 180, height: 120 } },
      { id: "dbx:tile:rune-tactal-forge", bounds: { x: 1146, y: 180, width: 180, height: 120 } },
      { id: "dbx:tile:rune-order-left-plinth", bounds: { x: 270, y: 560, width: 180, height: 100 } },
      { id: "dbx:tile:rune-order-right-plinth", bounds: { x: 1086, y: 560, width: 180, height: 100 } },
    ]);
    expect(compiled.staticVisualTileProjection.tiles.filter((tile) => tile.sceneId === "dbx:scene:ascendancy-tram-depot").map((tile) => ({ id: tile.tileId, bounds: tile.bounds }))).toEqual([
      { id: "dbx:tile:tram-rail-grid", bounds: { x: 420, y: 210, width: 660, height: 570 } },
      { id: "dbx:tile:tram-core-rail", bounds: { x: 1080, y: 400, width: 432, height: 95 } },
      { id: "dbx:tile:tram-gate-ingress", bounds: { x: 408, y: 400, width: 24, height: 95 } },
      { id: "dbx:tile:tram-gate-yard-exit", bounds: { x: 1068, y: 400, width: 24, height: 95 } },
      { id: "dbx:tile:tram-gate-core-door", bounds: { x: 1500, y: 400, width: 24, height: 95 } },
    ]);
    expect(compiled.staticVisualTileProjection.tiles.filter((tile) => tile.sceneId === "dbx:scene:central-core-control-chamber").map((tile) => tile.tileId)).toEqual([
      "dbx:tile:core-west-rail-gate", "dbx:tile:core-door-north", "dbx:tile:core-door-south", "dbx:tile:core-central-surface",
      "dbx:tile:core-station-aleister", "dbx:tile:core-station-sprocket", "dbx:tile:core-station-dalton",
      "dbx:tile:core-station-andrew", "dbx:tile:core-station-lawson", "dbx:tile:core-station-tactal",
    ]);
  });

  it("withdraws the invalid tram renderer while keeping exact-runtime mutation blocked", () => {
    const compiled = createCurrentCampaignPackage();
    expect(compiled.assets.bound).toHaveLength(4);
    expect(compiled.assets.bound.map((asset) => asset.path)).toEqual([
      null,
      "assets/maps/ascendancy-signal-frequency-chamber-v2.png",
      "assets/maps/ascendancy-rune-mechanism-chamber-v2.png",
      null,
    ]);
    expect(compiled.assets.bound[0]).toMatchObject({ assetId: "dbx:asset:map-ascendancy-tram-depot", status: "final-map-required", path: null });
    expect(compiled.assets.unbound).toHaveLength(0);
    expect(compiled.blockers.map((blocker) => blocker.blockerId)).toContain("dbx:blocker:exact-foundry-runtime");
    expect(compiled.mutation).toBe("disabled-until-exact-runtime-gate");
    expect(compiled.regionPlans.find((plan) => plan.roomId === "dbx:room:ascendancy-tram-depot")?.regions).toHaveLength(39);
    expect(compiled.regionPlans.find((plan) => plan.roomId === "dbx:room:central-core-control-chamber")?.regions).toHaveLength(10);
    expect(compiled.assets.bound.filter((asset) => asset.status === "final-map-required").map((asset) => asset.roomId).sort()).toEqual([
      "dbx:room:ascendancy-tram-depot", "dbx:room:central-core-control-chamber",
    ]);
    const tramBlueprint = compiled.spatialBlueprints.find((blueprint) => blueprint.blueprintId === "dbx:blueprint:ascendancy-tram-depot");
    expect(tramBlueprint?.walls).toHaveLength(11);
    expect(tramBlueprint?.anchors.filter((anchor) => anchor.kind === "door")).toEqual([
      expect.objectContaining({ anchorId: "dbx:anchor:tram-door-east", position: { x: 1512, y: 447.5 } }),
      expect.objectContaining({ anchorId: "dbx:anchor:tram-yard-ingress", position: { x: 420, y: 447.5 } }),
      expect.objectContaining({ anchorId: "dbx:anchor:tram-yard-exit", position: { x: 1080, y: 447.5 } }),
    ]);
    expect(tramBlueprint?.anchors.filter((anchor) => anchor.kind === "interaction")).toHaveLength(38);
  });
});
