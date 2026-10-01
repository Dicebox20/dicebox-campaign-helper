import { describe, expect, it } from "vitest";
import { createAscendancySignalRuneParentSceneObservation } from "@dicebox/compiler";

const input = {
  target: { worldId: "dbx-test-world", foundryVersion: "14.367", systemId: "dnd5e", systemVersion: "5.3.3", activeGm: true, user: "Gamemaster" },
  supervisor: { pid: 25108, port: 30001, worldDocumentWrites: 0, balladTouched: false },
  scenes: {
    signal: { roomId: "dbx:room:signal-frequency-chamber", sceneIdRuntime: "AneddhKAAfk5HlsA", asset: { assetId: "dbx:asset:map-signal-frequency-chamber", byteLength: 2935616, sha256: "DB9307932865B0D3A23C5A8AA61082D520206443318658DE7E03C773A1A9972E" } },
    rune: { roomId: "dbx:room:rune-mechanism-chamber", sceneIdRuntime: "p9Mbi0CJWe9KvJhH", asset: { assetId: "dbx:asset:map-rune-mechanism-chamber", byteLength: 2748729, sha256: "F45922E219A12FBA6B79A26AD0D6B5EBBAF51ADD86C025E9B676DA24707D507B" } },
  },
  sourceStaged: {
    module: { sourceSha256: "3DCFA4D1435B7BFF13A7B2A82B042288565F060D95075BA686FF6C56C874DA55", stagedSha256: "3DCFA4D1435B7BFF13A7B2A82B042288565F060D95075BA686FF6C56C874DA55", equal: true },
    partialPreviewAdapter: { sourceSha256: "3C8E78E8845548F5835CBCCC786EF0D828711324767E1F3A557CC0FEA49D4851", stagedSha256: "3C8E78E8845548F5835CBCCC786EF0D828711324767E1F3A557CC0FEA49D4851", equal: true },
  },
} as const;

describe("M1125 fixed parent-Scene observation envelope", () => {
  it("records exactly two observed parent Scenes without promotion artifacts", () => {
    const result = createAscendancySignalRuneParentSceneObservation(input);
    expect(result).toMatchObject({ status: "OBSERVED", parentSceneIdsObserved: true, childUuidGenerationBindings: false, childBindings: "unresolved", noWrite: true, apply: false, payload: "not-materialized", promotion: "disabled", dispatch: "disabled", runtimeState: "observed-parent-only" });
    expect(result.scenes.map((scene) => [scene.roomId, scene.sceneIdRuntime, scene.documentType, scene.uuid, scene.generation])).toEqual([
      ["dbx:room:signal-frequency-chamber", "AneddhKAAfk5HlsA", "Scene", "unresolved", "unresolved"],
      ["dbx:room:rune-mechanism-chamber", "p9Mbi0CJWe9KvJhH", "Scene", "unresolved", "unresolved"],
    ]);
    expect(result.excluded).toEqual(["dbx:room:ascendancy-tram-depot", "dbx:room:central-core-control-chamber"]);
    expect(result).not.toHaveProperty("runtimeBinding");
    expect(result).not.toHaveProperty("payloadPlan");
    expect(result).not.toHaveProperty("executor");
  });

  it("fails closed for target, binding, hash, and execution-shaped drift", () => {
    expect(() => createAscendancySignalRuneParentSceneObservation({ ...input, target: { ...input.target, activeGm: false } } as never)).toThrow();
    expect(() => createAscendancySignalRuneParentSceneObservation({ ...input, scenes: { ...input.scenes, signal: { ...input.scenes.signal, sceneIdRuntime: "other" } } } as never)).toThrow();
    expect(() => createAscendancySignalRuneParentSceneObservation({ ...input, sourceStaged: { ...input.sourceStaged, module: { ...input.sourceStaged.module, stagedSha256: "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA" } } } as never)).toThrow();
    expect(() => createAscendancySignalRuneParentSceneObservation({ ...input, apply: false } as never)).toThrow();
  });
});
