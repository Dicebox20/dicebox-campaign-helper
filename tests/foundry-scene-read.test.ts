import { describe, expect, it } from "vitest";
import {
  createFoundrySceneReadAdapter,
  type FoundrySceneDocument,
} from "@dicebox/bridge";
import { createStableDiceBoxId, type RuntimeBinding } from "@dicebox/core";

const binding: RuntimeBinding = {
  semantic: { id: createStableDiceBoxId("scene", "entry-room"), kind: "scene" },
  runtime: "foundry",
  documentType: "Scene",
  documentId: "scene-1",
  uuid: "Scene.world.scene-1",
  generation: 1,
};

const scene: FoundrySceneDocument = {
  id: binding.documentId,
  uuid: binding.uuid,
  documentName: "Scene",
  name: "Entry Room",
  dimensions: { width: 2000, height: 1200 },
  grid: { size: 100, type: 1 },
  walls: { contents: [{ id: "wall-1" }, { id: "wall-2" }] },
  regions: { contents: [{ id: "region-1" }] },
};

describe("read-only Foundry Scene observation adapter", () => {
  it("reads exact Scene identity, dimensions, grid, and embedded counts through fromUuid", async () => {
    let calls = 0;
    const adapter = createFoundrySceneReadAdapter({
      fromUuid: async (uuid) => {
        calls += 1;
        return uuid === binding.uuid ? scene : null;
      },
    });

    const result = await adapter.read(binding);

    expect(adapter.adapterId).toBe("foundry.scene.read@14.367");
    expect(adapter.foundryApi.read).toBe("fromUuid");
    expect(calls).toBe(1);
    expect(result).toEqual({
      ok: true,
      value: {
        binding,
        documentId: binding.documentId,
        uuid: binding.uuid,
        displayName: "Entry Room",
        width: 2000,
        height: 1200,
        gridSize: 100,
        gridType: 1,
        wallCount: 2,
        regionCount: 1,
      },
    });
  });

  it("uses game.scenes.get as the exact world-collection fallback", async () => {
    let calls = 0;
    const adapter = createFoundrySceneReadAdapter({
      game: { scenes: { get: (id) => { calls += 1; return id === binding.documentId ? scene : null; } } },
    });

    const result = await adapter.read(binding);

    expect(adapter.foundryApi.read).toBe("game.scenes.get");
    expect(calls).toBe(1);
    expect(result.ok).toBe(true);
  });

  it("returns null for a missing Scene and rejects non-Scene bindings", async () => {
    const missing = createFoundrySceneReadAdapter({ fromUuid: async () => null });
    const nonScene = createFoundrySceneReadAdapter({ fromUuid: async () => scene });
    const journalBinding: RuntimeBinding = {
      ...binding,
      documentType: "JournalEntry",
    };

    expect(await missing.read(binding)).toEqual({ ok: true, value: null });
    const result = await nonScene.read(journalBinding);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe("FORBIDDEN");
  });

  it("fails closed on wrong identity, malformed geometry, and unknown collections", async () => {
    const wrongIdentity = createFoundrySceneReadAdapter({
      fromUuid: async () => ({ ...scene, uuid: "Scene.world.other" }),
    });
    const malformed = createFoundrySceneReadAdapter({
      fromUuid: async () => ({ ...scene, dimensions: { width: 0, height: 1200 } }),
    });
    const { regions: _regions, ...sceneWithoutRegions } = scene;
    const unknownCollections = createFoundrySceneReadAdapter({
      fromUuid: async () => sceneWithoutRegions,
    });

    for (const result of [
      await wrongIdentity.read(binding),
      await malformed.read(binding),
      await unknownCollections.read(binding),
    ]) {
      expect(result.ok).toBe(false);
      if (!result.ok) expect(result.error.code).toBe("UNKNOWN_OUTCOME");
    }
  });

  it("preserves unknown resolution failures and unavailable surfaces", async () => {
    const throwing = createFoundrySceneReadAdapter({ fromUuid: async () => { throw new Error("scene timeout"); } });
    const unavailable = createFoundrySceneReadAdapter({});

    const unknown = await throwing.read(binding);
    const missing = await unavailable.read(binding);

    expect(unknown.ok).toBe(false);
    if (!unknown.ok) {
      expect(unknown.error.code).toBe("UNKNOWN_OUTCOME");
      expect(unknown.error.retry).toBe("after-reread");
    }
    expect(missing.ok).toBe(false);
    if (!missing.ok) expect(missing.error.code).toBe("UNAVAILABLE");
    expect("create" in unavailable).toBe(false);
    expect("update" in unavailable).toBe(false);
  });
});
