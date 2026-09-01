export const SCENE_SCHEMA_VERSION = "0.1.0" as const;

export type SceneEntityKind = "room" | "door" | "region" | "apparatus";

export type SceneBounds = Readonly<{
  x: number;
  y: number;
  width: number;
  height: number;
}>;

export type SceneEntity = Readonly<SceneBounds & {
  id: string;
  kind: SceneEntityKind;
  name: string;
  color: number;
  locked: boolean;
}>;

export type SceneDocument = Readonly<{
  schemaVersion: typeof SCENE_SCHEMA_VERSION;
  revision: number;
  id: string;
  name: string;
  width: number;
  height: number;
  background: Readonly<{ color: number; gridSize: number; assetId?: string }>;
  entities: readonly SceneEntity[];
}>;

export type SceneProjection = Readonly<{
  id: string;
  kind: SceneEntityKind;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: number;
  locked: boolean;
}>;

export function validateSceneDocument(document: SceneDocument): readonly string[] {
  const errors: string[] = [];
  const ids = new Set<string>();
  if (document.schemaVersion !== SCENE_SCHEMA_VERSION) errors.push(`Unsupported Scene schema: ${document.schemaVersion}`);
  if (!Number.isSafeInteger(document.revision) || document.revision < 0) errors.push("Scene revision must be a non-negative safe integer.");
  if (!document.id.startsWith("dbx:scene:")) errors.push("Scene ID must use the dbx:scene namespace.");
  if (document.width <= 0 || document.height <= 0) errors.push("Scene dimensions must be positive.");
  if (document.background.gridSize <= 0) errors.push("Scene grid size must be positive.");
  if (document.background.assetId !== undefined && !/^dbx:asset:[a-z0-9][a-z0-9._-]*$/.test(document.background.assetId)) {
    errors.push("Scene background asset ID must use the stable dbx:asset namespace.");
  }
  for (const entity of document.entities) {
    if (ids.has(entity.id)) errors.push(`Duplicate entity ID: ${entity.id}`);
    ids.add(entity.id);
    if (!entity.id.startsWith("dbx:")) errors.push(`Entity ID is not a stable DiceBox ID: ${entity.id}`);
    if (![entity.x, entity.y, entity.width, entity.height].every(Number.isFinite)) errors.push(`${entity.id} has non-finite bounds.`);
    if (entity.width <= 0 || entity.height <= 0) errors.push(`${entity.id} has invalid dimensions.`);
    if (entity.x < 0 || entity.y < 0 || entity.x + entity.width > document.width || entity.y + entity.height > document.height) {
      errors.push(`${entity.id} is outside the Scene bounds.`);
    }
  }
  return errors;
}

export function projectScene(document: SceneDocument): readonly SceneProjection[] {
  return document.entities.map(({ id, kind, name, x, y, width, height, color, locked }) => ({
    id, kind, name, x, y, width, height, color, locked,
  }));
}

export function serializeSceneDocument(document: SceneDocument): string {
  return JSON.stringify({
    schemaVersion: document.schemaVersion,
    revision: document.revision,
    id: document.id,
    name: document.name,
    width: document.width,
    height: document.height,
    background: {
      color: document.background.color,
      gridSize: document.background.gridSize,
      ...(document.background.assetId === undefined ? {} : { assetId: document.background.assetId }),
    },
    entities: document.entities.map(({ id, kind, name, x, y, width, height, color, locked }) => ({
      id, kind, name, x, y, width, height, color, locked,
    })),
  });
}
