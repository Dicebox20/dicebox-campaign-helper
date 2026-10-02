import { describe, expect, it } from "vitest";
import { createAscendancySignalRuneShapeAwareIdentityReconciliation } from "@dicebox/compiler";

const emptyShape = {
  count: 0,
  fieldPresence: { documentName: false, id: false, uuid: false, generation: false },
  fieldCompleteness: { documentName: false, id: false, uuid: false, generation: false },
  ownershipPresence: { owned: false, foreign: false, unknown: false },
} as const;

const populatedShape = {
  Level: {
    count: 1,
    fieldPresence: { documentName: true, id: true, uuid: true, generation: false },
    fieldCompleteness: { documentName: true, id: true, uuid: true, generation: false },
    ownershipPresence: { owned: false, foreign: false, unknown: true },
  },
  Wall: {
    count: 8,
    fieldPresence: { documentName: true, id: true, uuid: true, generation: false },
    fieldCompleteness: { documentName: true, id: true, uuid: true, generation: false },
    ownershipPresence: { owned: false, foreign: true, unknown: false },
  },
  Region: {
    count: 6,
    fieldPresence: { documentName: true, id: true, uuid: true, generation: false },
    fieldCompleteness: { documentName: true, id: true, uuid: true, generation: false },
    ownershipPresence: { owned: false, foreign: true, unknown: false },
  },
  Tile: emptyShape,
  Token: emptyShape,
  AmbientLight: emptyShape,
  AmbientSound: emptyShape,
  Drawing: emptyShape,
  Note: emptyShape,
} as const;

const source = {
  milestone: "M1138",
  target: { worldId: "dbx-test-world", foundryVersion: "14.367", systemId: "dnd5e", systemVersion: "5.3.3", activeGmName: "Gamemaster" },
  supervisor: { status: "PASS", pid: 5664, port: 30001, worldId: "dbx-test-world", foundryVersion: "14.367", systemId: "dnd5e", systemVersion: "5.3.3", activeGmName: "Gamemaster", worldDocumentWrites: 0, balladTouched: false },
  scenes: [
    { roomId: "dbx:room:signal-frequency-chamber", sceneIdRuntime: "AneddhKAAfk5HlsA", parentUuid: "Scene.AneddhKAAfk5HlsA", parentGeneration: "unresolved", parentOwnership: "foreign", childrenStatus: "unresolved", childrenReason: "embedded Level identity incomplete", shapeSummary: populatedShape },
    { roomId: "dbx:room:rune-mechanism-chamber", sceneIdRuntime: "p9Mbi0CJWe9KvJhH", parentUuid: "Scene.p9Mbi0CJWe9KvJhH", parentGeneration: "unresolved", parentOwnership: "foreign", childrenStatus: "unresolved", childrenReason: "embedded Level identity incomplete", shapeSummary: populatedShape },
  ],
  foreignState: "preserve",
  retryAfterUnknown: false,
  noWrite: true,
  apply: false,
  runtimeBinding: "not-created",
  payload: "not-materialized",
  dispatch: "disabled",
  readyClaim: false,
} as const;

const currentSupervisor = source.supervisor;

describe("M1140 versioned shape-aware identity reconciliation", () => {
  it("returns a blocked preview-only decision with explicit per-type blockers", () => {
    const result = createAscendancySignalRuneShapeAwareIdentityReconciliation({ source, currentSupervisor });
    expect(result).toMatchObject({
      sourceMilestone: "M1138",
      status: "BLOCKED",
      currentSupervisorMatch: true,
      noWrite: true,
      apply: false,
      runtimeBinding: "not-created",
      payload: "not-materialized",
      foundryIr: "not-created",
      proposal: "not-created",
      dispatch: "disabled",
      foreignState: "preserve",
      readyClaim: false,
    });
    expect(result.blockers).toEqual([
      "runtime-parent-generation-unresolved",
      "runtime-parent-ownership-foreign",
      "runtime-child-identity-unresolved",
      "embedded-level-generation-unresolved",
      "embedded-level-ownership-unknown",
      "embedded-wall-ownership-foreign",
      "embedded-region-ownership-foreign",
    ]);
    expect(result.scenes.every((scene) => scene.ownershipDecision === "preserve-foreign-or-unknown" && scene.runtimeBinding === "not-created")).toBe(true);
  });

  it("fails closed for stale supervisor evidence and target drift", () => {
    expect(() => createAscendancySignalRuneShapeAwareIdentityReconciliation({
      source,
      currentSupervisor: { ...currentSupervisor, pid: 5665 },
    })).toThrow("stale supervisor");
    expect(() => createAscendancySignalRuneShapeAwareIdentityReconciliation({
      source: { ...source, target: { ...source.target, systemVersion: "5.3.2" } },
      currentSupervisor,
    } as never)).toThrow();
  });

  it("rejects execution-shaped source data", () => {
    expect(() => createAscendancySignalRuneShapeAwareIdentityReconciliation({
      source: { ...source, execute: true },
      currentSupervisor,
    } as never)).toThrow();
  });
});
