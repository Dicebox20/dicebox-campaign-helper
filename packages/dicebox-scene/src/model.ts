export const SCENE_SCHEMA_VERSION = "0.1.0" as const;

export type SceneEntityKind = "room" | "door" | "region" | "apparatus";
export const SCENE_LAYERS = ["background", "semantic", "foreground"] as const;
export type SceneLayer = typeof SCENE_LAYERS[number];
export const SCENE_RELATIONSHIP_AXES = ["x", "y", "center"] as const;
export type SceneRelationshipAxis = typeof SCENE_RELATIONSHIP_AXES[number];
export type SceneRelationship = Readonly<{
  relationId: string;
  kind: "align";
  fromEntityId: string;
  toEntityId: string;
  axis: SceneRelationshipAxis;
}>;

export type SceneBounds = Readonly<{
  x: number;
  y: number;
  width: number;
  height: number;
}>;

export type SceneEntity = Readonly<SceneBounds & {
  id: string;
  kind: SceneEntityKind;
  /** Optional so pre-layer Scenes retain their canonical serialized bytes. */
  layer?: SceneLayer;
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
  relationships?: readonly SceneRelationship[];
}>;

export type SceneProjection = Readonly<{
  id: string;
  kind: SceneEntityKind;
  layer: SceneLayer;
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
    if (entity.layer !== undefined && !SCENE_LAYERS.includes(entity.layer)) errors.push(`${entity.id} has an unsupported semantic layer.`);
    if (!entity.id.startsWith("dbx:")) errors.push(`Entity ID is not a stable DiceBox ID: ${entity.id}`);
    if (!(["room", "door", "region", "apparatus"] as const).includes(entity.kind)) errors.push(`${entity.id} has an unsupported semantic kind.`);
    if (entity.name.trim() === "") errors.push(`${entity.id} must have a semantic name.`);
    if (!Number.isSafeInteger(entity.color) || entity.color < 0 || entity.color > 0xffffff) errors.push(`${entity.id} has an invalid display color.`);
    if (typeof entity.locked !== "boolean") errors.push(`${entity.id} must declare whether it is locked.`);
    if (![entity.x, entity.y, entity.width, entity.height].every(Number.isFinite)) errors.push(`${entity.id} has non-finite bounds.`);
    if (entity.width <= 0 || entity.height <= 0) errors.push(`${entity.id} has invalid dimensions.`);
    if (entity.x < 0 || entity.y < 0 || entity.x + entity.width > document.width || entity.y + entity.height > document.height) {
      errors.push(`${entity.id} is outside the Scene bounds.`);
    }
  }
  if (document.relationships !== undefined && !Array.isArray(document.relationships)) {
    errors.push("Scene relationships must be an array when declared.");
  }
  const relationships = Array.isArray(document.relationships) ? document.relationships : [];
  const relationshipIds = new Set<string>();
  for (const relationship of relationships) {
    if (typeof relationship.relationId !== "string" || !/^dbx:relation:[a-z0-9][a-z0-9._-]*$/.test(relationship.relationId)) {
      errors.push("Scene relationship ID must use the stable dbx:relation namespace.");
    } else if (relationshipIds.has(relationship.relationId)) {
      errors.push(`Duplicate relationship ID: ${relationship.relationId}`);
    } else {
      relationshipIds.add(relationship.relationId);
    }
    if (relationship.kind !== "align") errors.push(`${relationship.relationId ?? "Scene relationship"} has an unsupported relationship kind.`);
    if (typeof relationship.fromEntityId !== "string" || !ids.has(relationship.fromEntityId)) {
      errors.push(`${relationship.relationId ?? "Scene relationship"} references an unknown source entity.`);
    }
    if (typeof relationship.toEntityId !== "string" || !ids.has(relationship.toEntityId)) {
      errors.push(`${relationship.relationId ?? "Scene relationship"} references an unknown target entity.`);
    }
    if (typeof relationship.fromEntityId === "string" && relationship.fromEntityId === relationship.toEntityId) {
      errors.push(`${relationship.relationId ?? "Scene relationship"} cannot align an entity to itself.`);
    }
    if (!SCENE_RELATIONSHIP_AXES.includes(relationship.axis)) {
      errors.push(`${relationship.relationId ?? "Scene relationship"} must declare x, y, or center alignment.`);
    }
  }
  return errors;
}

export function validateSceneRelationship(
  relationship: SceneRelationship,
  entityIds: ReadonlySet<string>,
): readonly string[] {
  const errors: string[] = [];
  if (!/^dbx:relation:[a-z0-9][a-z0-9._-]*$/.test(relationship.relationId)) {
    errors.push("Scene relationship ID must use the stable dbx:relation namespace.");
  }
  if (relationship.kind !== "align") errors.push("Only align relationships are supported in this Scene slice.");
  if (!entityIds.has(relationship.fromEntityId)) errors.push("Scene relationship source entity is unknown.");
  if (!entityIds.has(relationship.toEntityId)) errors.push("Scene relationship target entity is unknown.");
  if (relationship.fromEntityId === relationship.toEntityId) errors.push("Scene relationships cannot target the same entity.");
  if (!SCENE_RELATIONSHIP_AXES.includes(relationship.axis)) {
    errors.push("Scene alignment axis must be x, y, or center.");
  }
  return errors;
}

export function projectScene(document: SceneDocument): readonly SceneProjection[] {
  return document.entities.map(({ id, kind, layer, name, x, y, width, height, color, locked }) => ({
    id, kind, layer: layer ?? "semantic", name, x, y, width, height, color, locked,
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
    entities: document.entities.map(({ id, kind, layer, name, x, y, width, height, color, locked }) => ({
      id, kind, name, x, y, width, height, color, locked,
      ...(layer === undefined ? {} : { layer }),
    })),
    ...(document.relationships === undefined ? {} : {
      relationships: document.relationships.map(({ relationId, kind, fromEntityId, toEntityId, axis }) => ({
        relationId, kind, fromEntityId, toEntityId, axis,
      })),
    }),
  });
}
