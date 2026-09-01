import { describe, expect, it } from "vitest";
import {
  createFoundryRegionReadAdapter,
  type FoundryRegionDocument,
} from "@dicebox/bridge";
import { createStableDiceBoxId, type RuntimeBinding } from "@dicebox/core";

const binding: RuntimeBinding = {
  semantic: { id: createStableDiceBoxId("region", "entry"), kind: "region" },
  runtime: "foundry",
  documentType: "Region",
  documentId: "region-1",
  uuid: "Scene.world.scene-1.Region.region-1",
  generation: 1,
};

const region: FoundryRegionDocument = {
  id: binding.documentId,
  uuid: binding.uuid,
  documentName: "Region",
  name: "Entry Region",
  parent: { uuid: "Scene.world.scene-1" },
  shapes: [
    { type: "rectangle", hole: false },
    { type: "polygon", hole: true },
  ],
  behaviors: { contents: [{ type: "pause-game" }, { type: "teleport-token" }] },
};

describe("read-only Foundry Region observation adapter", () => {
  it("reads exact identity, shape summaries, holes, behaviors, and parent Scene", async () => {
    let calls = 0;
    const adapter = createFoundryRegionReadAdapter({
      fromUuid: async (uuid) => {
        calls += 1;
        return uuid === binding.uuid ? region : null;
      },
    });

    const result = await adapter.read(binding);

    expect(adapter.adapterId).toBe("foundry.region.read@14.367");
    expect(adapter.foundryApi).toEqual({
      read: "fromUuid",
      document: "RegionDocument",
      shapes: "RegionDocument.shapes",
      behaviors: "RegionDocument.behaviors",
    });
    expect(calls).toBe(1);
    expect(result).toEqual({
      ok: true,
      value: {
        binding,
        documentId: binding.documentId,
        uuid: binding.uuid,
        displayName: "Entry Region",
        parentSceneUuid: "Scene.world.scene-1",
        shapeCount: 2,
        shapeKinds: ["polygon", "rectangle"],
        holeCount: 1,
        behaviorCount: 2,
        behaviorTypes: ["pause-game", "teleport-token"],
      },
    });
  });

  it("returns null for a missing Region and rejects non-Region bindings or missing API", async () => {
    const missing = createFoundryRegionReadAdapter({ fromUuid: async () => null });
    const unavailable = createFoundryRegionReadAdapter({});
    const nonRegion = createFoundryRegionReadAdapter({ fromUuid: async () => region });
    const sceneBinding: RuntimeBinding = { ...binding, documentType: "Scene" };

    expect(await missing.read(binding)).toEqual({ ok: true, value: null });
    const forbidden = await nonRegion.read(sceneBinding);
    expect(forbidden.ok).toBe(false);
    if (!forbidden.ok) expect(forbidden.error.code).toBe("FORBIDDEN");
    const unavailableResult = await unavailable.read(binding);
    expect(unavailableResult.ok).toBe(false);
    if (!unavailableResult.ok) expect(unavailableResult.error.code).toBe("UNAVAILABLE");
  });

  it("fails closed on foreign identity and unknown shape or behavior collections", async () => {
    const wrongIdentity = createFoundryRegionReadAdapter({
      fromUuid: async () => ({ ...region, uuid: "Scene.world.scene-1.Region-other" }),
    });
    const unknownShape = createFoundryRegionReadAdapter({
      fromUuid: async () => ({ ...region, shapes: [{ hole: false }] }),
    });
    const unknownBehavior = createFoundryRegionReadAdapter({
      fromUuid: async () => ({ ...region, behaviors: { contents: [{}] } }),
    });

    for (const result of [
      await wrongIdentity.read(binding),
      await unknownShape.read(binding),
      await unknownBehavior.read(binding),
    ]) {
      expect(result.ok).toBe(false);
      if (!result.ok) expect(result.error.code).toBe("UNKNOWN_OUTCOME");
    }
  });

  it("preserves resolution failures as outcome-unknown and exposes no write methods", async () => {
    const throwing = createFoundryRegionReadAdapter({ fromUuid: async () => { throw new Error("region timeout"); } });
    const result = await throwing.read(binding);

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe("UNKNOWN_OUTCOME");
      expect(result.error.retry).toBe("after-reread");
    }
    expect("create" in throwing).toBe(false);
    expect("update" in throwing).toBe(false);
    expect("delete" in throwing).toBe(false);
  });
});
