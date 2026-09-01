import { describe, expect, it } from "vitest";
import { defineFoundryInversePlan } from "@dicebox/compiler";

const stableId = "dbx:scene:inverse-plan";
const binding = { semantic: { id: stableId, kind: "scene" }, runtime: "foundry", documentType: "Scene", documentId: "scene-1", uuid: "Scene.world.scene-1", generation: 1 };
const base = { schemaVersion: "0.1.0", inversePlanId: "dbx:inverse-plan:inverse-plan", originalPlanId: "dbx:plan:inverse-plan", originalPlanSha256: "a".repeat(64), approvedByUserId: "gm", requiredActiveGm: true, createdAt: "2026-08-30T19:00:00.000Z", execution: "not-implemented", readyClaim: false } as const;

describe("Foundry inverse-plan contract", () => {
  it("accepts exact owned create deletion and immutable update preimages as a non-executing contract", () => {
    const plan = defineFoundryInversePlan({ ...base, operations: [
      { kind: "delete-owned-create", stableId, binding, expectedOwnership: { moduleId: "dicebox-campaign-helper", stableId, mode: "managed" } },
      { kind: "restore-update-preimage", stableId: "dbx:tile:inverse-plan", binding: { ...binding, semantic: { id: "dbx:tile:inverse-plan", kind: "asset" }, documentType: "Tile" }, expectedOwnership: { moduleId: "dicebox-campaign-helper", stableId: "dbx:tile:inverse-plan", mode: "managed" }, preimage: { documentType: "Tile", fields: { x: 0, y: 0, width: 100, height: 100, textureSrc: null } }, preimageSha256: "b".repeat(64) },
    ], reverseDependencyOrder: ["dbx:tile:inverse-plan", stableId] });
    expect(plan.execution).toBe("not-implemented");
  });
  it("rejects foreign ownership, mismatched bindings, and duplicate inverse targets", () => {
    const operation = { kind: "delete-owned-create", stableId, binding, expectedOwnership: { moduleId: "dicebox-campaign-helper", stableId, mode: "managed" } };
    expect(() => defineFoundryInversePlan({ ...base, operations: [operation, operation], reverseDependencyOrder: [stableId, stableId] })).toThrow("unique");
    expect(() => defineFoundryInversePlan({ ...base, operations: [{ ...operation, expectedOwnership: { ...operation.expectedOwnership, stableId: "dbx:scene:foreign" } }], reverseDependencyOrder: [stableId] })).toThrow("match");
    expect(() => defineFoundryInversePlan({ ...base, operations: [operation], reverseDependencyOrder: ["dbx:scene:missing"] })).toThrow("cover");
  });
});
