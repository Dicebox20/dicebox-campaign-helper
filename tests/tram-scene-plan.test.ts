import { describe, expect, it } from "vitest";
import { createStableDiceBoxId, createCanonicalTramBoard } from "@dicebox/core";
import { applyTramSceneMove, createTramSceneProjectionPlan, projectTramPieceToScene, validateTramSceneProjectionPlan } from "@dicebox/compiler";

describe("Foundry Scene tram projection", () => {
  const scene = { id: createStableDiceBoxId("scene", "ascendancy-tram-depot"), kind: "scene" as const };
  const asset = { id: createStableDiceBoxId("asset", "map-ascendancy-tram-depot"), kind: "asset" as const };

  it("binds the logical 6x6 board to the generated 1536x1024 map", () => {
    const plan = createTramSceneProjectionPlan({ scene, backgroundAsset: asset });
    expect(validateTramSceneProjectionPlan(plan)).toEqual(plan);
    expect(plan.canvas).toEqual({ width: 1536, height: 1024 });
    expect(plan.logicalBoard).toMatchObject({ origin: { x: 420, y: 210 }, cellWidth: 110, cellHeight: 95, columns: 6, rows: 6 });
    expect(plan.rendererRequirements).toMatchObject({ projection: "orthographic-top-down", noPerspective: true, backgroundRole: "renderer-only", visibleWalls: true, visibleDoors: true });
    expect(plan.rendererRequirements.trackLayout).toMatchObject({
      kind: "enclosed-six-by-six-orthogonal-routing-yard", rows: 6, columns: 6,
      boardOrigin: { x: 420, y: 210 }, cellWidth: 110, cellHeight: 95,
      fixedTramCars: "tile-projection-only", noFootBypass: true,
      ingress: { position: { x: 420, y: 447.5 } },
      exit: { position: { x: 1080, y: 447.5 }, destination: "core-controls-rail" },
      coreRail: { from: { x: 1080, y: 447.5 }, to: { x: 1512, y: 447.5 } },
    });
    expect(plan.tileProjection).toMatchObject({ owner: "foundry-scene-tile-projection", source: "canonical-logical-board", fixedTramCars: "tile-projection-only", footprintOwner: "dicebox-scene-engine", tileMoveApi: 'scene.updateEmbeddedDocuments("Tile", ...)', regionMoveApi: 'scene.updateEmbeddedDocuments("Region", ...)' });
    expect(plan.tileProjection.pieces.map((piece) => piece.tramId)).toEqual([
      "dbx:tram:x", "dbx:tram:o", "dbx:tram:q", "dbx:tram:b", "dbx:tram:c", "dbx:tram:r",
    ]);
    expect(plan.tileProjection.pieces.map((piece) => piece.footprintRegionId)).toEqual([
      "dbx:region:tram-x-footprint", "dbx:region:tram-o-footprint", "dbx:region:tram-q-footprint", "dbx:region:tram-b-footprint", "dbx:region:tram-c-footprint", "dbx:region:tram-r-footprint",
    ]);
    expect(plan.anchors).toHaveLength(36);
    expect(plan.mutation).toBe("disabled-until-exact-runtime-gate");
    expect(plan.foundryApis.join(" | ")).toContain("scene.createEmbeddedDocuments(\"Tile\", ...)");
    expect(plan.foundryApis.join(" | ")).toContain("scene.createEmbeddedDocuments(\"Region\", ...)");
  });

  it("derives Tile projection geometry from logical state, never pixel drag state", () => {
    const plan = createTramSceneProjectionPlan({ scene, backgroundAsset: asset });
    const board = createCanonicalTramBoard();
    const projection = projectTramPieceToScene(plan, board, createStableDiceBoxId("tram", "x"));
    expect(projection).toMatchObject({ pieceId: "dbx:tram:x", tileId: "dbx:tile:tram-x", footprintRegionId: "dbx:region:tram-x-footprint", x: 530, y: 400, width: 220, height: 95, footprintRegion: { shape: "rectangle", x: 530, y: 400, width: 220, height: 95, rotation: 0 }, source: "logical-board" });
    expect(projection.foundryApis).toEqual(['scene.updateEmbeddedDocuments("Tile", ...)', 'scene.updateEmbeddedDocuments("Region", ...)']);
    expect(projection.occupiedRegionIds).toHaveLength(2);
  });

  it("returns a validated Scene move handoff without calling Foundry", () => {
    const plan = createTramSceneProjectionPlan({ scene, backgroundAsset: asset });
    const board = createCanonicalTramBoard();
    const operational = { ...board, pieces: board.pieces.map((piece) => ({ ...piece, repaired: true, operational: true })) };
    const handoff = applyTramSceneMove(plan, operational, { pieceId: createStableDiceBoxId("tram", "b"), delta: -1 });
    expect(handoff.board.moveCount).toBe(1);
    expect(handoff.projection.x).toBe(420);
    expect(handoff.projection.y).toBe(495);
    expect(handoff.projection.footprintRegion).toMatchObject({ x: handoff.projection.x, y: handoff.projection.y, width: handoff.projection.width, height: handoff.projection.height });
    expect(handoff.foundryApis).toEqual(['scene.updateEmbeddedDocuments("Tile", ...)', 'scene.updateEmbeddedDocuments("Region", ...)']);
  });
});
