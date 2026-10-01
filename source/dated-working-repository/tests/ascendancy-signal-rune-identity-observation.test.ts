import { describe, expect, it } from "vitest";
import { createAscendancySignalRuneIdentityObservation } from "@dicebox/compiler";

const input = {
  target: { worldId: "dbx-test-world", foundryVersion: "14.367", systemId: "dnd5e", systemVersion: "5.3.3", activeGm: true, user: "Gamemaster" },
  supervisor: { pid: 25108, port: 30001, worldDocumentWrites: 0, balladTouched: false },
  scenes: {
    signal: {
      roomId: "dbx:room:signal-frequency-chamber", sceneIdRuntime: "AneddhKAAfk5HlsA",
      asset: { assetId: "dbx:asset:map-signal-frequency-chamber", byteLength: 2935616, sha256: "DB9307932865B0D3A23C5A8AA61082D520206443318658DE7E03C773A1A9972E" },
      parent: { documentType: "Scene", documentId: "AneddhKAAfk5HlsA", uuid: "unresolved", generation: "unresolved", status: "partial", ownership: "unknown" },
      children: { status: "unresolved", entries: "unresolved", reason: "exact read-only UI surface does not expose child identity" },
    },
    rune: {
      roomId: "dbx:room:rune-mechanism-chamber", sceneIdRuntime: "p9Mbi0CJWe9KvJhH",
      asset: { assetId: "dbx:asset:map-rune-mechanism-chamber", byteLength: 2748729, sha256: "F45922E219A12FBA6B79A26AD0D6B5EBBAF51ADD86C025E9B676DA24707D507B" },
      parent: { documentType: "Scene", documentId: "p9Mbi0CJWe9KvJhH", uuid: "unresolved", generation: "unresolved", status: "partial", ownership: "unknown" },
      children: { status: "unresolved", entries: "unresolved", reason: "exact read-only UI surface does not expose child identity" },
    },
  },
} as const;

describe("M1129 fixed identity-inspection observation contract", () => {
  it("preserves exact parent observations and unresolved child identity without promotion", () => {
    const result = createAscendancySignalRuneIdentityObservation(input);
    expect(result).toMatchObject({ status: "OBSERVATION_ONLY", foreignState: "preserve", retryAfterUnknown: false, runtimeBinding: "not-created", noWrite: true, apply: false, payload: "not-materialized", promotion: "disabled", dispatch: "disabled", readyClaim: false });
    expect(result.scenes.map((scene) => ({ roomId: scene.roomId, sceneIdRuntime: scene.sceneIdRuntime, parent: scene.parent, children: scene.children }))).toEqual([
      { roomId: "dbx:room:signal-frequency-chamber", sceneIdRuntime: "AneddhKAAfk5HlsA", parent: { documentType: "Scene", documentId: "AneddhKAAfk5HlsA", uuid: "unresolved", generation: "unresolved", status: "partial", ownership: "unknown" }, children: { status: "unresolved", entries: "unresolved", reason: "exact read-only UI surface does not expose child identity" } },
      { roomId: "dbx:room:rune-mechanism-chamber", sceneIdRuntime: "p9Mbi0CJWe9KvJhH", parent: { documentType: "Scene", documentId: "p9Mbi0CJWe9KvJhH", uuid: "unresolved", generation: "unresolved", status: "partial", ownership: "unknown" }, children: { status: "unresolved", entries: "unresolved", reason: "exact read-only UI surface does not expose child identity" } },
    ]);
  });

  it("fails closed for target drift, fabricated partial identity, foreign extra scope, and execution-shaped input", () => {
    expect(() => createAscendancySignalRuneIdentityObservation({ ...input, target: { ...input.target, activeGm: false } } as never)).toThrow();
    expect(() => createAscendancySignalRuneIdentityObservation({ ...input, scenes: { ...input.scenes, signal: { ...input.scenes.signal, parent: { ...input.scenes.signal.parent, status: "observed" } } } } as never)).toThrow();
    expect(() => createAscendancySignalRuneIdentityObservation({ ...input, scenes: { ...input.scenes, signal: { ...input.scenes.signal, children: { status: "unresolved", entries: [], reason: "fabricated empty collection" } } } } as never)).toThrow();
    expect(() => createAscendancySignalRuneIdentityObservation({ ...input, execute: true } as never)).toThrow();
  });
});
