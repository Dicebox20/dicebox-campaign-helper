import { invoke } from "@tauri-apps/api/core";
import type { ApplyGeometryPatchesCommand, SceneCommandOrigin, SceneDocument } from "@dicebox/scene";

export const GEOMETRY_SCHEMA_VERSION = "0.1.0" as const;
export const GEOMETRY_COMMAND = "commit_geometry_batch" as const;

export type GeometryBounds = Readonly<{ x: number; y: number; width: number; height: number }>;

export type GeometryBatchRequest = Readonly<{
  schemaVersion: typeof GEOMETRY_SCHEMA_VERSION;
  documentId: string;
  baseRevision: number;
  sceneBounds: GeometryBounds;
  entities: readonly Readonly<{
    id: string;
    bounds: GeometryBounds;
    polygon?: readonly Readonly<{ x: number; y: number }>[];
    locked: boolean;
  }>[];
  relationships: readonly Readonly<{
    id: string;
    sourceId: string;
    targetId: string;
    offsetX: number;
    offsetY: number;
  }>[];
  operations: readonly Readonly<{
    kind: "translate-entity";
    operationId: string;
    entityId: string;
    deltaX: number;
    deltaY: number;
  }>[];
  queries: readonly (
    | Readonly<{ kind: "intersects-bounds"; queryId: string; bounds: GeometryBounds }>
    | Readonly<{ kind: "contains-point"; queryId: string; point: Readonly<{ x: number; y: number }> }>
  )[];
}>;

export type GeometryBatchReceipt = Readonly<{
  operation: "dicebox.geometry.batch.commit";
  status: "PASS";
  schemaVersion: typeof GEOMETRY_SCHEMA_VERSION;
  documentId: string;
  beforeRevision: number;
  afterRevision: number;
  patches: readonly Readonly<{ entityId: string; before: GeometryBounds; after: GeometryBounds }>[];
  queryResults: readonly Readonly<{ queryId: string; entityIds: readonly string[] }>[];
  stats: Readonly<{
    entityCount: number;
    relationshipCount: number;
    operationCount: number;
    queryCount: number;
    changedEntityCount: number;
  }>;
  noWrite: true;
}>;

type InvokeGeometry = (command: typeof GEOMETRY_COMMAND, args: { request: GeometryBatchRequest }) => Promise<GeometryBatchReceipt>;

export function isNativeGeometryAvailable(): boolean {
  return typeof window !== "undefined" && "__TAURI_INTERNALS__" in window;
}

export function createTranslateBatch(
  document: SceneDocument,
  entityId: string,
  deltaX: number,
  deltaY: number,
  sequence: number,
): GeometryBatchRequest {
  return {
    schemaVersion: GEOMETRY_SCHEMA_VERSION,
    documentId: document.id,
    baseRevision: document.revision,
    sceneBounds: { x: 0, y: 0, width: document.width, height: document.height },
    entities: document.entities.map((entity) => ({
      id: entity.id,
      bounds: { x: entity.x, y: entity.y, width: entity.width, height: entity.height },
      locked: entity.locked,
    })),
    relationships: [],
    operations: [{
      kind: "translate-entity",
      operationId: `desktop-native-geometry-${sequence}`,
      entityId,
      deltaX,
      deltaY,
    }],
    queries: [{
      kind: "contains-point",
      queryId: `desktop-native-selection-${sequence}`,
      point: {
        x: document.entities.find((entity) => entity.id === entityId)?.x ?? 0,
        y: document.entities.find((entity) => entity.id === entityId)?.y ?? 0,
      },
    }],
  };
}

export function createStressTranslateBatch(
  document: SceneDocument,
  entityId: string,
  deltaX: number,
  deltaY: number,
  sequence: number,
  entityCount = 10_000,
): GeometryBatchRequest {
  if (!Number.isSafeInteger(entityCount) || entityCount < document.entities.length) {
    throw new Error("Stress entity count must include every semantic Scene entity.");
  }
  const request = createTranslateBatch(document, entityId, deltaX, deltaY, sequence);
  const syntheticCount = entityCount - request.entities.length;
  const synthetic = Array.from({ length: syntheticCount }, (_, index) => ({
    id: `dbx:benchmark:entity-${index.toString().padStart(5, "0")}`,
    bounds: {
      x: (index % 128) * 10,
      y: Math.floor(index / 128) * 10,
      width: 2,
      height: 2,
    },
    locked: false,
  }));
  return { ...request, entities: [...request.entities, ...synthetic] };
}

export async function commitGeometryBatch(
  request: GeometryBatchRequest,
  invokeGeometry: InvokeGeometry = (command, args) => invoke<GeometryBatchReceipt>(command, args),
): Promise<GeometryBatchReceipt> {
  const receipt = await invokeGeometry(GEOMETRY_COMMAND, { request });
  if (receipt.operation !== "dicebox.geometry.batch.commit" || receipt.status !== "PASS" || receipt.noWrite !== true) {
    throw new Error("Native geometry returned an invalid or write-capable receipt.");
  }
  if (receipt.documentId !== request.documentId || receipt.beforeRevision !== request.baseRevision) {
    throw new Error("Native geometry receipt does not match the requested document revision.");
  }
  if (receipt.patches.length === 0 || receipt.afterRevision !== request.baseRevision + 1) {
    throw new Error("Native geometry did not return one committed semantic revision.");
  }
  return receipt;
}

export function geometryReceiptToCommand(
  receipt: GeometryBatchReceipt,
  commandId: string,
  origin: SceneCommandOrigin,
): ApplyGeometryPatchesCommand {
  return {
    schemaVersion: GEOMETRY_SCHEMA_VERSION,
    kind: "apply-geometry-patches",
    commandId,
    baseRevision: receipt.beforeRevision,
    patches: receipt.patches,
    origin,
  };
}
