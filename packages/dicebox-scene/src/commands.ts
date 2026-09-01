import { serializeSceneDocument, validateSceneDocument, type SceneBounds, type SceneDocument } from "./model.js";

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

export type SceneCommand = TranslateSceneEntityCommand | ApplyGeometryPatchesCommand;

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
  }>;
  patches: readonly GeometryPatch[];
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
  constructor(readonly code: "INVALID_DOCUMENT" | "INVALID_COMMAND" | "STALE_REVISION" | "UNKNOWN_ENTITY" | "LOCKED_ENTITY" | "OUT_OF_BOUNDS", message: string) {
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
  } else {
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
  }

  const nextDocument: SceneDocument = {
    ...document,
    revision: document.revision + 1,
    entities: document.entities.map((candidate) => {
      const patch = patches.find((entry) => entry.entityId === candidate.id);
      return patch ? { ...candidate, ...patch.after } : candidate;
    }),
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
      patch: patches[0]!,
      patches,
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
