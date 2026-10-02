import { describe, expect, it } from "vitest";
import {
  applySceneCommand,
  createSceneHistory,
  executeSceneCommand,
  migrateSceneDocument,
  redoSceneHistory,
  replaySceneCommands,
  serializeSceneDocument,
  validateSceneDocument,
  undoSceneHistory,
  type LegacySceneDocumentV001,
  type SceneCommand,
  type CreateSceneEntityCommand,
  type AddSceneRelationshipCommand,
  type RemoveSceneRelationshipCommand,
  type RenameSceneEntityCommand,
  type SetSceneEntityLayerCommand,
  type SetSceneEntityDisplayColorCommand,
  type TranslateSceneEntityCommand,
} from "@dicebox/scene";
import { fixtureScene } from "../apps/campaign-helper-desktop/src/fixture-scene";

function command(overrides: Partial<TranslateSceneEntityCommand> = {}): TranslateSceneEntityCommand {
  return {
    schemaVersion: "0.1.0",
    kind: "translate-entity",
    commandId: "command-1",
    baseRevision: 0,
    entityId: "dbx:apparatus:core",
    deltaX: 8,
    deltaY: 0,
    origin: { kind: "human", principalId: "human-1", reason: "Test edit" },
    ...overrides,
  };
}

function createCommand(overrides: Partial<CreateSceneEntityCommand> = {}): CreateSceneEntityCommand {
  return {
    schemaVersion: "0.1.0",
    kind: "create-entity",
    commandId: "create-command-1",
    baseRevision: 0,
    entity: { id: "dbx:region:authoring-test", kind: "region", name: "Authoring test region", x: 70, y: 130, width: 128, height: 128, color: 0x22d3ee, locked: false },
    alignToGrid: true,
    origin: { kind: "human", principalId: "human-1", reason: "Create semantic region" },
    ...overrides,
  };
}

function renameCommand(overrides: Partial<RenameSceneEntityCommand> = {}): RenameSceneEntityCommand {
  return {
    schemaVersion: "0.1.0",
    kind: "rename-entity",
    commandId: "rename-command-1",
    baseRevision: 0,
    entityId: "dbx:apparatus:core",
    name: "Renamed puzzle apparatus",
    origin: { kind: "human", principalId: "human-1", reason: "Rename semantic entity" },
    ...overrides,
  };
}

function relationshipCommand(overrides: Partial<AddSceneRelationshipCommand> = {}): AddSceneRelationshipCommand {
  return {
    schemaVersion: "0.1.0",
    kind: "add-relationship",
    commandId: "relationship-command-1",
    baseRevision: 0,
    relationship: { relationId: "dbx:relation:core-puzzle-align", kind: "align", fromEntityId: "dbx:apparatus:core", toEntityId: "dbx:region:puzzle", axis: "center" },
    origin: { kind: "human", principalId: "human-1", reason: "Align semantic apparatus to puzzle region" },
    ...overrides,
  };
}

function removeRelationshipCommand(overrides: Partial<RemoveSceneRelationshipCommand> = {}): RemoveSceneRelationshipCommand {
  return {
    schemaVersion: "0.1.0",
    kind: "remove-relationship",
    commandId: "remove-relationship-command-1",
    baseRevision: 0,
    relationshipId: "dbx:relation:core-puzzle-align",
    origin: { kind: "human", principalId: "human-1", reason: "Remove semantic align relationship" },
    ...overrides,
  };
}

function layerCommand(overrides: Partial<SetSceneEntityLayerCommand> = {}): SetSceneEntityLayerCommand {
  return {
    schemaVersion: "0.1.0",
    kind: "set-layer",
    commandId: "layer-command-1",
    baseRevision: 0,
    entityId: "dbx:apparatus:core",
    layer: "foreground",
    origin: { kind: "human", principalId: "human-1", reason: "Set semantic layer" },
    ...overrides,
  };
}

function displayColorCommand(overrides: Partial<SetSceneEntityDisplayColorCommand> = {}): SetSceneEntityDisplayColorCommand {
  return {
    schemaVersion: "0.1.0",
    kind: "set-display-color",
    commandId: "display-color-command-1",
    baseRevision: 0,
    entityId: "dbx:apparatus:core",
    color: 0xf97316,
    origin: { kind: "human", principalId: "human-1", reason: "Set semantic display color" },
    ...overrides,
  };
}

describe("renderer-neutral Scene command spine", () => {
  it("rejects stale base revisions", () => {
    expect(() => applySceneCommand(fixtureScene, command({ baseRevision: 4 }))).toThrow("targets revision 4; current revision is 0");
  });

  it("rejects translations that leave Scene bounds", () => {
    expect(() => applySceneCommand(fixtureScene, command({ deltaX: 2000 }))).toThrow("would leave the Scene bounds");
  });

  it("records exact provenance and reversible patch bounds", () => {
    const applied = applySceneCommand(fixtureScene, command());
    expect(applied.receipt).toMatchObject({
      operation: "dicebox.scene.command.apply",
      commandId: "command-1",
      origin: { kind: "human", principalId: "human-1" },
      patch: {
        entityId: "dbx:apparatus:core",
        before: { x: 608, y: 376, width: 320, height: 272 },
        after: { x: 616, y: 376, width: 320, height: 272 },
      },
    });
  });

  it("supports undo and redo while revisions remain monotonic", () => {
    const executed = executeSceneCommand(createSceneHistory(fixtureScene), command());
    const undone = undoSceneHistory(executed);
    const redone = redoSceneHistory(undone);
    expect(executed.present.entities[2]).toMatchObject({ x: 616 });
    expect(undone.present.entities[2]).toMatchObject({ x: 608 });
    expect(redone.present.entities[2]).toMatchObject({ x: 616 });
    expect([executed.present.revision, undone.present.revision, redone.present.revision]).toEqual([1, 2, 3]);
    expect(redone.receipts.map((receipt) => receipt.operation)).toEqual([
      "dicebox.scene.command.apply",
      "dicebox.scene.history.undo",
      "dicebox.scene.history.redo",
    ]);
  });

  it("clears redo history after a new committed command", () => {
    const executed = executeSceneCommand(createSceneHistory(fixtureScene), command());
    const undone = undoSceneHistory(executed);
    const replacement = executeSceneCommand(undone, command({ commandId: "replacement", baseRevision: 2, deltaX: -8 }));
    expect(replacement.future).toEqual([]);
  });

  it("migrates legacy Scenes without inventing unlocked state for locked entities", () => {
    const legacy: LegacySceneDocumentV001 = {
      schemaVersion: "0.0.1",
      id: fixtureScene.id,
      name: fixtureScene.name,
      width: fixtureScene.width,
      height: fixtureScene.height,
      background: fixtureScene.background,
      entities: fixtureScene.entities.map(({ locked, ...entity }, index) => index === 0 ? { ...entity, locked } : entity),
    };
    const migrated = migrateSceneDocument(legacy);
    expect(migrated).toMatchObject({ schemaVersion: "0.1.0", revision: 0 });
    expect(migrated.entities[0]?.locked).toBe(true);
    expect(migrated.entities[1]?.locked).toBe(false);
  });

  it("replays human and AI-fixture commands to byte-equivalent Scene state", () => {
    const humanCommands: SceneCommand[] = [
      command({ commandId: "human-1", origin: { kind: "human", principalId: "human", reason: "Golden replay" } }),
      command({ commandId: "human-2", baseRevision: 1, deltaX: 0, deltaY: 8, origin: { kind: "human", principalId: "human", reason: "Golden replay" } }),
    ];
    const aiCommands: SceneCommand[] = humanCommands.map((item, index) => ({
      ...item,
      commandId: `ai-${index + 1}`,
      origin: { kind: "ai-fixture", principalId: "ai-fixture", reason: "Golden replay" },
    }));
    const human = replaySceneCommands(fixtureScene, humanCommands);
    const ai = replaySceneCommands(fixtureScene, aiCommands);
    expect(serializeSceneDocument(ai.document)).toBe(serializeSceneDocument(human.document));
    expect(human.receipts.every((receipt) => receipt.origin.kind === "human")).toBe(true);
    expect(ai.receipts.every((receipt) => receipt.origin.kind === "ai-fixture")).toBe(true);
  });

  it("creates one stable semantic entity aligned to the declared Scene grid", () => {
    const applied = applySceneCommand(fixtureScene, createCommand());
    expect(applied.document.entities).toHaveLength(fixtureScene.entities.length + 1);
    expect(applied.document.entities.at(-1)).toMatchObject({ id: "dbx:region:authoring-test", x: 64, y: 128, kind: "region" });
    expect(applied.receipt).toMatchObject({ commandKind: "create-entity", createdEntityId: "dbx:region:authoring-test", patch: null });
  });

  it("carries an optional semantic layer without changing legacy Scene bytes", () => {
    expect(serializeSceneDocument(fixtureScene)).not.toContain('"layer"');
    const applied = applySceneCommand(fixtureScene, createCommand({
      entity: { ...createCommand().entity, layer: "foreground" },
    }));
    expect(applied.document.entities.at(-1)).toMatchObject({ layer: "foreground" });
    expect(JSON.stringify(applied.document.entities.at(-1))).toContain('"layer":"foreground"');
    expect(() => applySceneCommand(fixtureScene, createCommand({
      entity: { ...createCommand().entity, layer: "invalid" as "background" },
    }))).toThrow("supported semantic layer");
  });

  it("rejects duplicate IDs and preserves reversible create history", () => {
    expect(() => applySceneCommand(fixtureScene, createCommand({ entity: fixtureScene.entities[0]! }))).toThrow("already exists");
    const executed = executeSceneCommand(createSceneHistory(fixtureScene), createCommand());
    const undone = undoSceneHistory(executed);
    const redone = redoSceneHistory(undone);
    expect(undone.present.entities).toHaveLength(fixtureScene.entities.length);
    expect(redone.present.entities.at(-1)?.id).toBe("dbx:region:authoring-test");
  });

  it("rejects implicit alignment and locked creation requests", () => {
    expect(() => applySceneCommand(fixtureScene, { ...createCommand(), alignToGrid: false } as unknown as CreateSceneEntityCommand)).toThrow("explicit grid alignment");
    expect(() => applySceneCommand(fixtureScene, createCommand({ entity: { ...createCommand().entity, locked: true } }))).toThrow("must remain editable");
  });

  it("renames an editable entity while preserving stable semantic geometry", () => {
    const applied = applySceneCommand(fixtureScene, renameCommand());
    const before = fixtureScene.entities.find((entity) => entity.id === "dbx:apparatus:core")!;
    const after = applied.document.entities.find((entity) => entity.id === before.id)!;
    expect(after).toMatchObject({ id: before.id, kind: before.kind, x: before.x, y: before.y, width: before.width, height: before.height, name: "Renamed puzzle apparatus" });
    expect(applied.receipt).toMatchObject({ commandKind: "rename-entity", renamedEntityId: before.id, beforeName: before.name, afterName: after.name });
  });

  it("rejects unchanged, unknown, and locked entity rename requests", () => {
    expect(() => applySceneCommand(fixtureScene, renameCommand({ name: "Puzzle apparatus" }))).toThrow("changed semantic name");
    expect(() => applySceneCommand(fixtureScene, renameCommand({ entityId: "dbx:region:absent" }))).toThrow("Unknown Scene entity");
    expect(() => applySceneCommand(fixtureScene, renameCommand({ entityId: "dbx:room:main" }))).toThrow("locked by the Scene contract");
  });

  it("undoes and redoes a semantic rename without changing stable identity", () => {
    const executed = executeSceneCommand(createSceneHistory(fixtureScene), renameCommand());
    const undone = undoSceneHistory(executed);
    const redone = redoSceneHistory(undone);
    expect(undone.present.entities.find((entity) => entity.id === "dbx:apparatus:core")?.name).toBe("Puzzle apparatus");
    expect(redone.present.entities.find((entity) => entity.id === "dbx:apparatus:core")).toMatchObject({ id: "dbx:apparatus:core", name: "Renamed puzzle apparatus" });
  });

  it("reassigns only the semantic layer while preserving identity and geometry", () => {
    const applied = applySceneCommand(fixtureScene, layerCommand());
    const before = fixtureScene.entities.find((entity) => entity.id === "dbx:apparatus:core")!;
    const after = applied.document.entities.find((entity) => entity.id === before.id)!;
    expect(after).toMatchObject({ id: before.id, kind: before.kind, name: before.name, x: before.x, y: before.y, width: before.width, height: before.height, color: before.color, locked: before.locked, layer: "foreground" });
    expect(applied.document.relationships).toBeUndefined();
    expect(applied.receipt).toMatchObject({ commandKind: "set-layer", layeredEntityId: before.id, beforeLayer: "semantic", afterLayer: "foreground" });
  });

  it("rejects stale, locked, unchanged, and unsupported layer reassignment", () => {
    expect(() => applySceneCommand(fixtureScene, layerCommand({ baseRevision: 1 }))).toThrow("targets revision 1");
    expect(() => applySceneCommand(fixtureScene, layerCommand({ entityId: "dbx:room:main" }))).toThrow("locked by the Scene contract");
    expect(() => applySceneCommand(fixtureScene, layerCommand({ layer: "semantic" }))).toThrow("must change the semantic layer");
    expect(() => applySceneCommand(fixtureScene, layerCommand({ layer: "diagonal" as "foreground" }))).toThrow("supported semantic layer");
  });

  it("undoes and redoes a semantic layer reassignment with monotonic revisions", () => {
    const executed = executeSceneCommand(createSceneHistory(fixtureScene), layerCommand());
    const undone = undoSceneHistory(executed);
    const redone = redoSceneHistory(undone);
    expect(undone.present.entities.find((entity) => entity.id === "dbx:apparatus:core")?.layer).toBeUndefined();
    expect(redone.present.entities.find((entity) => entity.id === "dbx:apparatus:core")?.layer).toBe("foreground");
    expect([executed.present.revision, undone.present.revision, redone.present.revision]).toEqual([1, 2, 3]);
  });

  it("reassigns only display color while preserving identity, geometry, layer, and relationships", () => {
    const source = { ...fixtureScene, entities: fixtureScene.entities.map((entity) => entity.id === "dbx:apparatus:core" ? { ...entity, layer: "semantic" as const } : entity), relationships: [{ relationId: "dbx:relation:color-preserve", kind: "align" as const, fromEntityId: "dbx:apparatus:core", toEntityId: "dbx:region:puzzle", axis: "center" as const }] };
    const before = source.entities.find((entity) => entity.id === "dbx:apparatus:core")!;
    const applied = applySceneCommand(source, displayColorCommand()).document;
    const after = applied.entities.find((entity) => entity.id === before.id)!;
    expect(after).toMatchObject({ id: before.id, kind: before.kind, name: before.name, x: before.x, y: before.y, width: before.width, height: before.height, layer: "semantic", locked: before.locked, color: 0xf97316 });
    expect(applied.relationships).toEqual(source.relationships);
    expect(applied.entities.filter((entity) => entity.id !== before.id)).toEqual(source.entities.filter((entity) => entity.id !== before.id));
    expect(applySceneCommand(source, displayColorCommand()).receipt).toMatchObject({ commandKind: "set-display-color", coloredEntityId: before.id, beforeColor: before.color, afterColor: 0xf97316 });
  });

  it("rejects stale, locked, unchanged, and invalid display-color reassignment", () => {
    expect(() => applySceneCommand(fixtureScene, displayColorCommand({ baseRevision: 1 }))).toThrow("targets revision 1");
    expect(() => applySceneCommand(fixtureScene, displayColorCommand({ entityId: "dbx:room:main" }))).toThrow("locked by the Scene contract");
    expect(() => applySceneCommand(fixtureScene, displayColorCommand({ color: fixtureScene.entities.find((entity) => entity.id === "dbx:apparatus:core")?.color ?? 0 }))).toThrow("must change the display color");
    expect(() => applySceneCommand(fixtureScene, displayColorCommand({ color: -1 }))).toThrow("safe integer from 0 through 0xFFFFFF");
    expect(() => applySceneCommand(fixtureScene, displayColorCommand({ color: 0x1000000 }))).toThrow("safe integer from 0 through 0xFFFFFF");
    expect(() => applySceneCommand(fixtureScene, displayColorCommand({ color: 1.5 }))).toThrow("safe integer from 0 through 0xFFFFFF");
  });

  it("undoes and redoes display-color reassignment with monotonic revisions", () => {
    const executed = executeSceneCommand(createSceneHistory(fixtureScene), displayColorCommand());
    const undone = undoSceneHistory(executed);
    const redone = redoSceneHistory(undone);
    expect(undone.present.revision).toBe(2);
    expect(undone.present.entities.find((entity) => entity.id === "dbx:apparatus:core")?.color).toBe(0x7c3aed);
    expect(redone.present.revision).toBe(3);
    expect(redone.present.entities.find((entity) => entity.id === "dbx:apparatus:core")?.color).toBe(0xf97316);
  });

  it("adds one typed align relationship without changing entity geometry", () => {
    const applied = applySceneCommand(fixtureScene, relationshipCommand());
    expect(applied.document.entities).toEqual(fixtureScene.entities);
    expect(applied.document.relationships).toEqual([relationshipCommand().relationship]);
    expect(serializeSceneDocument(applied.document)).toContain('"relationships":[{"relationId":"dbx:relation:core-puzzle-align","kind":"align","fromEntityId":"dbx:apparatus:core","toEntityId":"dbx:region:puzzle","axis":"center"}]');
    expect(applied.receipt).toMatchObject({ commandKind: "add-relationship", createdRelationshipId: "dbx:relation:core-puzzle-align", beforeRevision: 0, afterRevision: 1, patch: null });
  });

  it("removes only one existing align relationship while preserving entities and unrelated relationships", () => {
    const kept = { ...relationshipCommand().relationship, relationId: "dbx:relation:entry-puzzle-align", fromEntityId: "dbx:region:entry", axis: "x" as const };
    const source = { ...fixtureScene, relationships: [relationshipCommand().relationship, kept] };
    const applied = applySceneCommand(source, removeRelationshipCommand()).document;
    expect(applied.entities).toEqual(source.entities);
    expect(applied.relationships).toEqual([kept]);
    expect(applySceneCommand(source, removeRelationshipCommand()).receipt).toMatchObject({ commandKind: "remove-relationship", removedRelationshipId: "dbx:relation:core-puzzle-align", removedRelationship: relationshipCommand().relationship });
  });

  it("rejects stale, malformed, unknown, and unsupported relationship removal", () => {
    const source = { ...fixtureScene, relationships: [relationshipCommand().relationship] };
    expect(() => applySceneCommand(source, removeRelationshipCommand({ baseRevision: 1 }))).toThrow("targets revision 1");
    expect(() => applySceneCommand(source, removeRelationshipCommand({ relationshipId: "invalid-relationship" }))).toThrow("stable dbx:relation namespace");
    expect(() => applySceneCommand(source, removeRelationshipCommand({ relationshipId: "dbx:relation:missing" }))).toThrow("Unknown Scene relationship");
    expect(() => applySceneCommand({ ...source, relationships: [{ ...relationshipCommand().relationship, kind: "unsupported" as "align" }] }, removeRelationshipCommand())).toThrow("unsupported relationship kind");
  });

  it("undoes and redoes relationship removal with monotonic revisions", () => {
    const source = { ...fixtureScene, relationships: [relationshipCommand().relationship] };
    const executed = executeSceneCommand(createSceneHistory(source), removeRelationshipCommand());
    const undone = undoSceneHistory(executed);
    const redone = redoSceneHistory(undone);
    expect(undone.present.revision).toBe(2);
    expect(undone.present.relationships).toEqual(source.relationships);
    expect(redone.present.revision).toBe(3);
    expect(redone.present.relationships).toEqual([]);
  });

  it("rejects stale, duplicate, self, unknown, and unsupported align relationships", () => {
    expect(() => applySceneCommand(fixtureScene, relationshipCommand({ baseRevision: 1 }))).toThrow("targets revision 1; current revision is 0");
    expect(() => applySceneCommand({ ...fixtureScene, relationships: [relationshipCommand().relationship] }, relationshipCommand())).toThrow("already exists");
    expect(() => applySceneCommand(fixtureScene, relationshipCommand({ relationship: { ...relationshipCommand().relationship, fromEntityId: "dbx:apparatus:core", toEntityId: "dbx:apparatus:core" } }))).toThrow("same entity");
    expect(() => applySceneCommand(fixtureScene, relationshipCommand({ relationship: { ...relationshipCommand().relationship, toEntityId: "dbx:region:missing" } }))).toThrow("unknown");
    expect(() => applySceneCommand(fixtureScene, relationshipCommand({ relationship: { ...relationshipCommand().relationship, axis: "diagonal" } as unknown as AddSceneRelationshipCommand["relationship"] }))).toThrow("axis must be x, y, or center");
    expect(() => applySceneCommand(fixtureScene, { schemaVersion: "0.1.0", kind: "unsupported", commandId: "unsupported-command", baseRevision: 0, origin: { kind: "human", principalId: "human-1", reason: "Unsupported command" } } as unknown as SceneCommand)).toThrow("Unsupported Scene command kind");
  });

  it("undoes and redoes an align relationship with monotonic revisions", () => {
    const executed = executeSceneCommand(createSceneHistory(fixtureScene), relationshipCommand());
    const undone = undoSceneHistory(executed);
    const redone = redoSceneHistory(undone);
    expect(executed.present.relationships).toHaveLength(1);
    expect(undone.present.relationships).toBeUndefined();
    expect(redone.present.relationships).toEqual([relationshipCommand().relationship]);
    expect([executed.present.revision, undone.present.revision, redone.present.revision]).toEqual([1, 2, 3]);
    expect(redone.receipts.at(-1)).toMatchObject({ operation: "dicebox.scene.history.redo", beforeRevision: 2, afterRevision: 3 });
  });

  it("keeps two distinct align relationships in deterministic order across command and history paths", () => {
    const first = relationshipCommand();
    const second = relationshipCommand({
      commandId: "relationship-command-2",
      baseRevision: 1,
      relationship: {
        relationId: "dbx:relation:north-entry-align",
        kind: "align",
        fromEntityId: "dbx:door:north",
        toEntityId: "dbx:region:entry",
        axis: "y",
      },
    });
    const firstApplied = applySceneCommand(fixtureScene, first);
    const secondApplied = applySceneCommand(firstApplied.document, second);
    expect(validateSceneDocument(secondApplied.document)).toEqual([]);
    expect(secondApplied.document.entities).toEqual(fixtureScene.entities);
    expect(secondApplied.document.relationships).toEqual([first.relationship, second.relationship]);
    expect(serializeSceneDocument(secondApplied.document)).toContain('"relationships":[{"relationId":"dbx:relation:core-puzzle-align"');

    const executed = executeSceneCommand(executeSceneCommand(createSceneHistory(fixtureScene), first), second);
    const undone = undoSceneHistory(executed);
    const redone = redoSceneHistory(undone);
    expect(undone.present.relationships).toEqual([first.relationship]);
    expect(redone.present.relationships).toEqual([first.relationship, second.relationship]);
    expect([executed.present.revision, undone.present.revision, redone.present.revision]).toEqual([2, 3, 4]);
  });
});
