import { describe, expect, it } from "vitest";
import {
  canonicalizeFoundryIr,
  foundryInverseOperationSchema,
  sha256FoundryIr,
  validateStagedInverseDeleteReadback,
  validateStagedInverseRestoreReadback,
  type FoundryInverseOperation,
} from "@dicebox/compiler";

const inversePlanId = "dbx:inverse-plan:adapter-readback";
const inversePlanSha256 = "a".repeat(64);
const deleteOperation = foundryInverseOperationSchema.parse({
  kind: "delete-owned-create",
  stableId: "dbx:scene:adapter-readback",
  binding: { semantic: { id: "dbx:scene:adapter-readback", kind: "scene" }, runtime: "foundry", documentType: "Scene", documentId: "scene", uuid: "Scene.scene", generation: 1 },
  expectedOwnership: { moduleId: "dicebox-campaign-helper", stableId: "dbx:scene:adapter-readback", mode: "managed" },
}) as Extract<FoundryInverseOperation, { readonly kind: "delete-owned-create" }>;
const restoreOperation = foundryInverseOperationSchema.parse({
  kind: "restore-update-preimage",
  stableId: "dbx:tile:adapter-readback",
  binding: { semantic: { id: "dbx:tile:adapter-readback", kind: "asset" }, runtime: "foundry", documentType: "Tile", documentId: "tile", uuid: "Scene.scene.Tile.tile", generation: 1 },
  expectedOwnership: { moduleId: "dicebox-campaign-helper", stableId: "dbx:tile:adapter-readback", mode: "managed" },
  preimage: { documentType: "Tile", fields: { x: 1, y: 2, width: 3, height: 4, textureSrc: null } },
  preimageSha256: "b".repeat(64),
}) as Extract<FoundryInverseOperation, { readonly kind: "restore-update-preimage" }>;

async function adapterOperation(operation: FoundryInverseOperation, sequence: number) {
  const operationSha256 = await sha256FoundryIr(canonicalizeFoundryIr(operation));
  return {
    selection: {
      schemaVersion: "0.1.0" as const,
      manifestId: "dbx:inverse-manifest:adapter-readback",
      inversePlanId,
      sequence,
      stableId: operation.stableId,
      kind: operation.kind,
      idempotencyKey: `dbx:inverse-idempotency:adapter-readback-${sequence}`,
      operationSha256,
      dispatchOrder: "reverse-dependency-order" as const,
      execution: "not-implemented" as const,
      readyClaim: false as const,
    },
    operation,
  };
}

describe("operation-specific staged inverse adapter readbacks", () => {
  it("accepts exact delete-owned absence and preserves foreign/unknown evidence", async () => {
    const adapterOperation = await adapterOperationFor(deleteOperation, 0);
    const base = {
      schemaVersion: "0.1.0" as const,
      inversePlanId,
      inversePlanSha256,
      manifestId: adapterOperation.selection.manifestId,
      sequence: adapterOperation.selection.sequence,
      stableId: adapterOperation.selection.stableId,
      operationKind: "delete-owned-create" as const,
      idempotencyKey: adapterOperation.selection.idempotencyKey,
      operationSha256: adapterOperation.selection.operationSha256,
      observedAt: "2026-08-31T04:00:00.000Z",
      authoritativeReread: true as const,
      foreignStatePreserved: true as const,
    };
    const readback = await validateStagedInverseDeleteReadback({ ...base, status: "owned-absent" as const, binding: null }, adapterOperation, inversePlanId, inversePlanSha256);
    expect(readback.status).toBe("owned-absent");
    expect((await validateStagedInverseDeleteReadback({ ...base, status: "foreign-conflict" as const, binding: deleteOperation.binding }, adapterOperation, inversePlanId, inversePlanSha256)).binding).toEqual(deleteOperation.binding);
    expect((await validateStagedInverseDeleteReadback({ ...base, status: "unknown" as const, binding: null }, adapterOperation, inversePlanId, inversePlanSha256)).status).toBe("unknown");
  });

  it("accepts exact restore preimage evidence and rejects transplanted or weak matches", async () => {
    const adapterOperation = await adapterOperationFor(restoreOperation, 1);
    const input = {
      schemaVersion: "0.1.0" as const,
      inversePlanId,
      inversePlanSha256,
      manifestId: adapterOperation.selection.manifestId,
      sequence: adapterOperation.selection.sequence,
      stableId: adapterOperation.selection.stableId,
      operationKind: "restore-update-preimage" as const,
      idempotencyKey: adapterOperation.selection.idempotencyKey,
      operationSha256: adapterOperation.selection.operationSha256,
      status: "preimage-matched" as const,
      binding: restoreOperation.binding,
      expectedPreimageSha256: restoreOperation.preimageSha256,
      observedPayloadSha256: restoreOperation.preimageSha256,
      observedAt: "2026-08-31T04:01:00.000Z",
      authoritativeReread: true as const,
      foreignStatePreserved: true as const,
    };
    expect((await validateStagedInverseRestoreReadback(input, adapterOperation, inversePlanId, inversePlanSha256)).status).toBe("preimage-matched");
    await expect(validateStagedInverseRestoreReadback({ ...input, observedPayloadSha256: "c".repeat(64) }, adapterOperation, inversePlanId, inversePlanSha256)).rejects.toThrow("payload digest");
    const deleteEnvelope = await adapterOperationFor(deleteOperation, 0);
    await expect(validateStagedInverseRestoreReadback(input, deleteEnvelope, inversePlanId, inversePlanSha256)).rejects.toThrow("restore-update-preimage");
    await expect(validateStagedInverseDeleteReadback({ ...input, operationKind: "delete-owned-create", binding: null, status: "owned-absent", expectedPreimageSha256: undefined, observedPayloadSha256: undefined }, deleteEnvelope, inversePlanId, inversePlanSha256)).rejects.toThrow();
  });
});

async function adapterOperationFor(operation: FoundryInverseOperation, sequence: number) {
  return adapterOperation(operation, sequence);
}
