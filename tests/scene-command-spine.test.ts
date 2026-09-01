import { describe, expect, it } from "vitest";
import {
  applySceneCommand,
  createSceneHistory,
  executeSceneCommand,
  migrateSceneDocument,
  redoSceneHistory,
  replaySceneCommands,
  serializeSceneDocument,
  undoSceneHistory,
  type LegacySceneDocumentV001,
  type SceneCommand,
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
});
