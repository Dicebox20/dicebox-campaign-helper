import { SCENE_LAYERS, serializeSceneDocument, validateSceneDocument, validateSceneRelationship, type SceneBounds, type SceneDocument, type SceneEntity, type SceneLayer, type SceneRelationship } from "./model.js";

export type SceneCommandOrigin = Readonly<{
  kind: "human" | "ai-fixture";
  principalId: string;
  reason: string;
}>;

export type TranslateSceneEntityCommand = Readonly<{
  schemaVersion: "0.1.0";
  kind: "translate-entity";
  commandId: string;
  baseRevision: number;
  entityId: string;
  deltaX: number;
  deltaY: number;
  origin: SceneCommandOrigin;
}>;

export type GeometryPatch = Readonly<{
  entityId: string;
  before: SceneBounds;
  after: SceneBounds;
}>;

export type ApplyGeometryPatchesCommand = Readonly<{
  schemaVersion: "0.1.0";
  kind: "apply-geometry-patches";
  commandId: string;
  baseRevision: number;
  patches: readonly GeometryPatch[];
  origin: SceneCommandOrigin;
}>;

export type CreateSceneEntityCommand = Readonly<{
  schemaVersion: "0.1.0";
  kind: "create-entity";
  commandId: string;
  baseRevision: number;
  entity: SceneEntity;
  alignToGrid: true;
  origin: SceneCommandOrigin;
}>;

export type RenameSceneEntityCommand = Readonly<{
  schemaVersion: "0.1.0";
  kind: "rename-entity";
  commandId: string;
  baseRevision: number;
  entityId: string;
  name: string;
  origin: SceneCommandOrigin;
}>;

export type SetSceneEntityLayerCommand = Readonly<{
  schemaVersion: "0.1.0";
  kind: "set-layer";
  commandId: string;
  baseRevision: number;
  entityId: string;
  layer: SceneLayer;
  origin: SceneCommandOrigin;
}>;

export type SetSceneEntityDisplayColorCommand = Readonly<{
  schemaVersion: "0.1.0";
  kind: "set-display-color";
  commandId: string;
  baseRevision: number;
  entityId: string;
  color: number;
  origin: SceneCommandOrigin;
}>;

export type AddSceneRelationshipCommand = Readonly<{
  schemaVersion: "0.1.0";
  kind: "add-relationship";
  commandId: string;
  baseRevision: number;
  relationship: SceneRelationship;
  origin: SceneCommandOrigin;
}>;

export type RemoveSceneRelationshipCommand = Readonly<{
  schemaVersion: "0.1.0";
  kind: "remove-relationship";
  commandId: string;
  baseRevision: number;
  relationshipId: string;
  origin: SceneCommandOrigin;
}>;

export type SceneCommand = TranslateSceneEntityCommand | ApplyGeometryPatchesCommand | CreateSceneEntityCommand | RenameSceneEntityCommand | SetSceneEntityLayerCommand | SetSceneEntityDisplayColorCommand | AddSceneRelationshipCommand | RemoveSceneRelationshipCommand;

export type SceneCommandReceipt = Readonly<{
  operation: "dicebox.scene.command.apply";
  status: "PASS";
  commandId: string;
  commandKind: SceneCommand["kind"];
  origin: SceneCommandOrigin;
  documentId: string;
  beforeRevision: number;
  afterRevision: number;
  patch: Readonly<{
    entityId: string;
    before: SceneBounds;
    after: SceneBounds;
  }> | null;
  patches: readonly GeometryPatch[];
  createdEntityId?: string;
  renamedEntityId?: string;
  createdRelationshipId?: string;
  removedRelationshipId?: string;
  removedRelationship?: SceneRelationship;
  beforeName?: string;
  afterName?: string;
  layeredEntityId?: string;
  beforeLayer?: SceneLayer;
  afterLayer?: SceneLayer;
  coloredEntityId?: string;
  beforeColor?: number;
  afterColor?: number;
  beforeBytes: number;
  afterBytes: number;
}>;

export type SceneHistoryReceipt = Readonly<{
  operation: "dicebox.scene.history.undo" | "dicebox.scene.history.redo";
  status: "PASS";
  documentId: string;
  beforeRevision: number;
  afterRevision: number;
  restoredFromRevision: number;
}>;

export type SceneHistory = Readonly<{
  present: SceneDocument;
  past: readonly SceneDocument[];
  future: readonly SceneDocument[];
  receipts: readonly (SceneCommandReceipt | SceneHistoryReceipt)[];
}>;

export class SceneCommandError extends Error {
  constructor(readonly code: "INVALID_DOCUMENT" | "INVALID_COMMAND" | "STALE_REVISION" | "UNKNOWN_ENTITY" | "UNKNOWN_RELATIONSHIP" | "LOCKED_ENTITY" | "OUT_OF_BOUNDS", message: string) {
    super(message);
    this.name = "SceneCommandError";
  }
}

function boundsOf(entity: SceneDocument["entities"][number]): SceneBounds {
  return { x: entity.x, y: entity.y, width: entity.width, height: entity.height };
}

function sameBounds(left: SceneBounds, right: SceneBounds): boolean {
  return left.x === right.x && left.y === right.y && left.width === right.width && left.height === right.height;
}

function validateBounds(document: SceneDocument, bounds: SceneBounds, entityName: string): void {
  if (![bounds.x, bounds.y, bounds.width, bounds.height].every(Number.isFinite) || bounds.width <= 0 || bounds.height <= 0) {
    throw new SceneCommandError("INVALID_COMMAND", `${entityName} has invalid geometry bounds.`);
  }
  if (bounds.x < 0 || bounds.y < 0 || bounds.x + bounds.width > document.width || bounds.y + bounds.height > document.height) {
    throw new SceneCommandError("OUT_OF_BOUNDS", `${entityName} would leave the Scene bounds.`);
  }
}

function alignToGrid(value: number, gridSize: number): number {
  return Math.round(value / gridSize) * gridSize;
}

export function applySceneCommand(document: SceneDocument, command: SceneCommand): Readonly<{ document: SceneDocument; receipt: SceneCommandReceipt }> {
  const documentErrors = validateSceneDocument(document);
  if (documentErrors.length > 0) throw new SceneCommandError("INVALID_DOCUMENT", documentErrors.join(" "));
  if (command.schemaVersion !== "0.1.0" || command.commandId.trim() === "" || command.origin.principalId.trim() === "" || command.origin.reason.trim() === "") {
    throw new SceneCommandError("INVALID_COMMAND", "Scene command identity and provenance are required.");
  }
  if (command.baseRevision !== document.revision) {
    throw new SceneCommandError("STALE_REVISION", `Command ${command.commandId} targets revision ${command.baseRevision}; current revision is ${document.revision}.`);
  }
  const patches: GeometryPatch[] = [];
  let createdEntity: SceneEntity | null = null;
  let renamedEntity: Readonly<{ entityId: string; beforeName: string; afterName: string }> | null = null;
  let layeredEntity: Readonly<{ entityId: string; beforeLayer: SceneLayer; afterLayer: SceneLayer }> | null = null;
  let coloredEntity: Readonly<{ entityId: string; beforeColor: number; afterColor: number }> | null = null;
  let createdRelationship: SceneRelationship | null = null;
  let removedRelationship: SceneRelationship | null = null;
  if (command.kind === "translate-entity") {
    if (!Number.isFinite(command.deltaX) || !Number.isFinite(command.deltaY) || (command.deltaX === 0 && command.deltaY === 0)) {
      throw new SceneCommandError("INVALID_COMMAND", "Translation must be finite and non-zero.");
    }
    const entity = document.entities.find((candidate) => candidate.id === command.entityId);
    if (!entity) throw new SceneCommandError("UNKNOWN_ENTITY", `Unknown Scene entity: ${command.entityId}`);
    if (entity.locked) throw new SceneCommandError("LOCKED_ENTITY", `${entity.name} is locked by the Scene contract.`);
    const after = { ...boundsOf(entity), x: entity.x + command.deltaX, y: entity.y + command.deltaY };
    validateBounds(document, after, entity.name);
    patches.push({ entityId: entity.id, before: boundsOf(entity), after });
  } else if (command.kind === "apply-geometry-patches") {
    if (command.patches.length === 0) throw new SceneCommandError("INVALID_COMMAND", "A geometry commit must contain at least one patch.");
    const patchedIds = new Set<string>();
    for (const patch of command.patches) {
      if (patchedIds.has(patch.entityId)) throw new SceneCommandError("INVALID_COMMAND", `Duplicate geometry patch: ${patch.entityId}`);
      patchedIds.add(patch.entityId);
      const entity = document.entities.find((candidate) => candidate.id === patch.entityId);
      if (!entity) throw new SceneCommandError("UNKNOWN_ENTITY", `Unknown Scene entity: ${patch.entityId}`);
      if (entity.locked) throw new SceneCommandError("LOCKED_ENTITY", `${entity.name} is locked by the Scene contract.`);
      if (!sameBounds(boundsOf(entity), patch.before)) {
        throw new SceneCommandError("STALE_REVISION", `Geometry patch ${patch.entityId} no longer matches the current document.`);
      }
      validateBounds(document, patch.after, entity.name);
      if (sameBounds(patch.before, patch.after)) throw new SceneCommandError("INVALID_COMMAND", `Geometry patch ${patch.entityId} does not change geometry.`);
      patches.push(patch);
    }
  } else if (command.kind === "create-entity") {
    if (command.alignToGrid !== true) throw new SceneCommandError("INVALID_COMMAND", "Created Scene entities require explicit grid alignment.");
    if (document.entities.some((candidate) => candidate.id === command.entity.id)) {
      throw new SceneCommandError("INVALID_COMMAND", `Scene entity ID already exists: ${command.entity.id}`);
    }
    if (!command.entity.id.startsWith("dbx:")) throw new SceneCommandError("INVALID_COMMAND", "Created Scene entity must use a stable dbx: ID.");
    if (command.entity.name.trim() === "") throw new SceneCommandError("INVALID_COMMAND", "Created Scene entity requires a semantic name.");
    if (command.entity.layer !== undefined && !SCENE_LAYERS.includes(command.entity.layer)) throw new SceneCommandError("INVALID_COMMAND", "Created Scene entity must use a supported semantic layer.");
    if (!(["room", "door", "region", "apparatus"] as const).includes(command.entity.kind)) {
      throw new SceneCommandError("INVALID_COMMAND", `Unsupported Scene entity kind: ${String(command.entity.kind)}`);
    }
    if (!Number.isSafeInteger(command.entity.color) || command.entity.color < 0 || command.entity.color > 0xffffff || typeof command.entity.locked !== "boolean") {
      throw new SceneCommandError("INVALID_COMMAND", "Created Scene entity has invalid semantic display metadata.");
    }
    if (command.entity.locked) throw new SceneCommandError("LOCKED_ENTITY", "Created Scene entities must remain editable until an explicit later lock operation exists.");
    const aligned = {
      ...command.entity,
      x: alignToGrid(command.entity.x, document.background.gridSize),
      y: alignToGrid(command.entity.y, document.background.gridSize),
    };
    validateBounds(document, aligned, aligned.name);
    createdEntity = aligned;
  } else if (command.kind === "add-relationship") {
    const relationshipIds = new Set((document.relationships ?? []).map((relationship) => relationship.relationId));
    if (relationshipIds.has(command.relationship.relationId)) {
      throw new SceneCommandError("INVALID_COMMAND", `Scene relationship ID already exists: ${command.relationship.relationId}`);
    }
    const relationshipErrors = validateSceneRelationship(command.relationship, new Set(document.entities.map((entity) => entity.id)));
    if (relationshipErrors.length > 0) throw new SceneCommandError("INVALID_COMMAND", relationshipErrors.join(" "));
    createdRelationship = command.relationship;
  } else if (command.kind === "set-layer") {
    const entity = document.entities.find((candidate) => candidate.id === command.entityId);
    if (!entity) throw new SceneCommandError("UNKNOWN_ENTITY", `Unknown Scene entity: ${command.entityId}`);
    if (entity.locked) throw new SceneCommandError("LOCKED_ENTITY", `${entity.name} is locked by the Scene contract.`);
    if (!SCENE_LAYERS.includes(command.layer)) throw new SceneCommandError("INVALID_COMMAND", "Scene layer reassignment requires a supported semantic layer.");
    const beforeLayer = entity.layer ?? "semantic";
    if (beforeLayer === command.layer) throw new SceneCommandError("INVALID_COMMAND", "Scene layer reassignment must change the semantic layer.");
    layeredEntity = { entityId: entity.id, beforeLayer, afterLayer: command.layer };
  } else if (command.kind === "set-display-color") {
    const entity = document.entities.find((candidate) => candidate.id === command.entityId);
    if (!entity) throw new SceneCommandError("UNKNOWN_ENTITY", `Unknown Scene entity: ${command.entityId}`);
    if (entity.locked) throw new SceneCommandError("LOCKED_ENTITY", `${entity.name} is locked by the Scene contract.`);
    if (!Number.isSafeInteger(command.color) || command.color < 0 || command.color > 0xffffff) {
      throw new SceneCommandError("INVALID_COMMAND", "Scene display color must be a safe integer from 0 through 0xFFFFFF.");
    }
    if (entity.color === command.color) throw new SceneCommandError("INVALID_COMMAND", "Scene display color reassignment must change the display color.");
    coloredEntity = { entityId: entity.id, beforeColor: entity.color, afterColor: command.color };
  } else if (command.kind === "remove-relationship") {
    if (!/^dbx:relation:[a-z0-9][a-z0-9._-]*$/.test(command.relationshipId)) {
      throw new SceneCommandError("INVALID_COMMAND", "Scene relationship ID must use the stable dbx:relation namespace.");
    }
    const relationship = (document.relationships ?? []).find((candidate) => candidate.relationId === command.relationshipId);
    if (!relationship) throw new SceneCommandError("UNKNOWN_RELATIONSHIP", `Unknown Scene relationship: ${command.relationshipId}`);
    if (relationship.kind !== "align") throw new SceneCommandError("INVALID_COMMAND", "Only align relationships can be removed in this Scene slice.");
    removedRelationship = relationship;
  } else if (command.kind === "rename-entity") {
    const entity = document.entities.find((candidate) => candidate.id === command.entityId);
    if (!entity) throw new SceneCommandError("UNKNOWN_ENTITY", `Unknown Scene entity: ${command.entityId}`);
    if (entity.locked) throw new SceneCommandError("LOCKED_ENTITY", `${entity.name} is locked by the Scene contract.`);
    const afterName = command.name.trim();
    if (afterName === "") throw new SceneCommandError("INVALID_COMMAND", "Renamed Scene entity requires a semantic name.");
    if (afterName === entity.name) throw new SceneCommandError("INVALID_COMMAND", "Renamed Scene entity must have a changed semantic name.");
    renamedEntity = { entityId: entity.id, beforeName: entity.name, afterName };
  } else {
    throw new SceneCommandError("INVALID_COMMAND", `Unsupported Scene command kind: ${String((command as unknown as { kind?: unknown }).kind)}`);
  }

  const nextDocument: SceneDocument = {
    ...document,
    revision: document.revision + 1,
    entities: createdEntity ? [...document.entities, createdEntity] : document.entities.map((candidate) => {
      const patch = patches.find((entry) => entry.entityId === candidate.id);
      if (patch) return { ...candidate, ...patch.after };
      if (renamedEntity?.entityId === candidate.id) return { ...candidate, name: renamedEntity.afterName };
      if (layeredEntity?.entityId === candidate.id) return { ...candidate, layer: layeredEntity.afterLayer };
      return coloredEntity?.entityId === candidate.id ? { ...candidate, color: coloredEntity.afterColor } : candidate;
    }),
    ...(createdRelationship ? { relationships: [...(document.relationships ?? []), createdRelationship] } : {}),
    ...(removedRelationship ? { relationships: (document.relationships ?? []).filter((relationship) => relationship.relationId !== removedRelationship?.relationId) } : {}),
  };
  const before = serializeSceneDocument(document);
  const after = serializeSceneDocument(nextDocument);
  return {
    document: nextDocument,
    receipt: {
      operation: "dicebox.scene.command.apply",
      status: "PASS",
      commandId: command.commandId,
      commandKind: command.kind,
      origin: command.origin,
      documentId: document.id,
      beforeRevision: document.revision,
      afterRevision: nextDocument.revision,
      patch: patches[0] ?? null,
      patches,
      ...(createdEntity ? { createdEntityId: createdEntity.id } : {}),
      ...(renamedEntity ? { renamedEntityId: renamedEntity.entityId, beforeName: renamedEntity.beforeName, afterName: renamedEntity.afterName } : {}),
      ...(layeredEntity ? { layeredEntityId: layeredEntity.entityId, beforeLayer: layeredEntity.beforeLayer, afterLayer: layeredEntity.afterLayer } : {}),
      ...(coloredEntity ? { coloredEntityId: coloredEntity.entityId, beforeColor: coloredEntity.beforeColor, afterColor: coloredEntity.afterColor } : {}),
      ...(createdRelationship ? { createdRelationshipId: createdRelationship.relationId } : {}),
      ...(removedRelationship ? { removedRelationshipId: removedRelationship.relationId, removedRelationship } : {}),
      beforeBytes: new TextEncoder().encode(before).byteLength,
      afterBytes: new TextEncoder().encode(after).byteLength,
    },
  };
}

export function createSceneHistory(document: SceneDocument): SceneHistory {
  const errors = validateSceneDocument(document);
  if (errors.length > 0) throw new SceneCommandError("INVALID_DOCUMENT", errors.join(" "));
  return { present: document, past: [], future: [], receipts: [] };
}

export function executeSceneCommand(history: SceneHistory, command: SceneCommand): SceneHistory {
  const applied = applySceneCommand(history.present, command);
  return {
    present: applied.document,
    past: [...history.past, history.present],
    future: [],
    receipts: [...history.receipts, applied.receipt],
  };
}

function restoreDocument(current: SceneDocument, target: SceneDocument): SceneDocument {
  return { ...target, revision: current.revision + 1 };
}

export function undoSceneHistory(history: SceneHistory): SceneHistory {
  const target = history.past.at(-1);
  if (!target) return history;
  const present = restoreDocument(history.present, target);
  return {
    present,
    past: history.past.slice(0, -1),
    future: [history.present, ...history.future],
    receipts: [...history.receipts, {
      operation: "dicebox.scene.history.undo",
      status: "PASS",
      documentId: present.id,
      beforeRevision: history.present.revision,
      afterRevision: present.revision,
      restoredFromRevision: target.revision,
    }],
  };
}

export function redoSceneHistory(history: SceneHistory): SceneHistory {
  const [target, ...remaining] = history.future;
  if (!target) return history;
  const present = restoreDocument(history.present, target);
  return {
    present,
    past: [...history.past, history.present],
    future: remaining,
    receipts: [...history.receipts, {
      operation: "dicebox.scene.history.redo",
      status: "PASS",
      documentId: present.id,
      beforeRevision: history.present.revision,
      afterRevision: present.revision,
      restoredFromRevision: target.revision,
    }],
  };
}

export function replaySceneCommands(initial: SceneDocument, commands: readonly SceneCommand[]): Readonly<{ document: SceneDocument; receipts: readonly SceneCommandReceipt[] }> {
  let document = initial;
  const receipts: SceneCommandReceipt[] = [];
  for (const command of commands) {
    const applied = applySceneCommand(document, command);
    document = applied.document;
    receipts.push(applied.receipt);
  }
  return { document, receipts };
}
