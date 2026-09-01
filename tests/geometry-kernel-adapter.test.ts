import { describe, expect, it, vi } from "vitest";
import { applySceneCommand } from "@dicebox/scene";
import { fixtureScene } from "../apps/campaign-helper-desktop/src/fixture-scene";
import {
  GEOMETRY_COMMAND,
  commitGeometryBatch,
  createStressTranslateBatch,
  createTranslateBatch,
  geometryReceiptToCommand,
  type GeometryBatchReceipt,
} from "../apps/campaign-helper-desktop/src/geometry-kernel";

function receipt(): GeometryBatchReceipt {
  return {
    operation: "dicebox.geometry.batch.commit",
    status: "PASS",
    schemaVersion: "0.1.0",
    documentId: fixtureScene.id,
    beforeRevision: fixtureScene.revision,
    afterRevision: fixtureScene.revision + 1,
    patches: [{
      entityId: "dbx:apparatus:core",
      before: { x: 608, y: 376, width: 320, height: 272 },
      after: { x: 616, y: 376, width: 320, height: 272 },
    }],
    queryResults: [{ queryId: "desktop-native-selection-1", entityIds: ["dbx:apparatus:core"] }],
    stats: {
      entityCount: fixtureScene.entities.length,
      relationshipCount: 0,
      operationCount: 1,
      queryCount: 1,
      changedEntityCount: 1,
    },
    noWrite: true,
  };
}

describe("desktop native geometry adapter", () => {
  it("uses one fixed Tauri command with a complete batched request", async () => {
    const request = createTranslateBatch(fixtureScene, "dbx:apparatus:core", 8, 0, 1);
    const invokeGeometry = vi.fn(async () => receipt());
    const result = await commitGeometryBatch(request, invokeGeometry);

    expect(invokeGeometry).toHaveBeenCalledOnce();
    expect(invokeGeometry).toHaveBeenCalledWith(GEOMETRY_COMMAND, { request });
    expect(request).toMatchObject({
      documentId: fixtureScene.id,
      baseRevision: 0,
      sceneBounds: { width: 1536, height: 1024 },
      entities: { length: 5 },
      operations: [{ kind: "translate-entity", entityId: "dbx:apparatus:core", deltaX: 8 }],
    });
    expect(result.noWrite).toBe(true);
  });

  it("applies the reviewed native patch atomically through SceneCommand", () => {
    const command = geometryReceiptToCommand(receipt(), "native-1", {
      kind: "human",
      principalId: "desktop-user",
      reason: "Native geometry test",
    });
    const applied = applySceneCommand(fixtureScene, command);
    expect(applied.document.revision).toBe(1);
    expect(applied.document.entities[2]).toMatchObject({ id: "dbx:apparatus:core", x: 616, y: 376 });
    expect(applied.receipt).toMatchObject({ commandKind: "apply-geometry-patches", patches: { length: 1 } });
  });

  it("builds the exact 10,000-entity desktop robustness fixture without changing the semantic document", () => {
    const request = createStressTranslateBatch(fixtureScene, "dbx:apparatus:core", 8, 0, 9);
    expect(request.entities).toHaveLength(10_000);
    expect(request.entities[0]?.id).toBe("dbx:room:main");
    expect(request.entities.at(-1)?.id).toBe("dbx:benchmark:entity-09994");
    expect(fixtureScene.entities).toHaveLength(5);
  });

  it("rejects mismatched or write-capable native receipts", async () => {
    const request = createTranslateBatch(fixtureScene, "dbx:apparatus:core", 8, 0, 1);
    await expect(commitGeometryBatch(request, async () => ({ ...receipt(), noWrite: false } as unknown as GeometryBatchReceipt)))
      .rejects.toThrow("invalid or write-capable");
    await expect(commitGeometryBatch(request, async () => ({ ...receipt(), documentId: "dbx:scene:wrong" })))
      .rejects.toThrow("does not match");
  });
});
