import { describe, expect, it } from "vitest";
import { bridgeProjectPersistentAddSceneRedoToTerminalHistory, projectPersistentAddSceneRedoTerminalHistoryReceiptSchema } from "../apps/campaign-helper-desktop/src/project-add-scene-terminal-history.js";
import { bridgeProjectSaveRedoToTerminalHistory, projectSaveRedoTerminalHistoryReceiptSchema } from "../apps/campaign-helper-desktop/src/project-save-terminal-history.js";
import { createPersistentAddSceneRedoExecutionReceipt, createSaveRedoExecutionReceipt } from "./project-proposal-save-add-scene-semantic-redo-fixtures.js";

describe("M890 project.save and persistent add-Scene semantic redo composition", () => {
  it("pairs both existing strict redo bridges with operation-specific semantic rereads", async () => {
    const save = projectSaveRedoTerminalHistoryReceiptSchema.parse(
      bridgeProjectSaveRedoToTerminalHistory(await createSaveRedoExecutionReceipt()),
    );
    const addScene = projectPersistentAddSceneRedoTerminalHistoryReceiptSchema.parse(
      bridgeProjectPersistentAddSceneRedoToTerminalHistory(await createPersistentAddSceneRedoExecutionReceipt()),
    );

    const composed = {
      operations: [save.commandKind, addScene.commandKind],
      statuses: [save.status, addScene.status],
      matchedRereads: [save.matchedReread, addScene.matchedReread],
      semanticPostStates: {
        projectSave: {
          beforeGeneration: save.authoritativeRereads.beforeRedo.generation,
          afterGeneration: save.authoritativeRereads.afterRedo.generation,
          beforeSemanticHash: save.authoritativeRereads.beforeRedo.semanticContentSha256,
          afterSemanticHash: save.authoritativeRereads.afterRedo.semanticContentSha256,
          semanticHashChanged: save.authoritativeRereads.beforeRedo.semanticContentSha256 !== save.authoritativeRereads.afterRedo.semanticContentSha256,
          envelopeRotated: save.authoritativeRereads.afterRedo.backupByteSha256 === save.authoritativeRereads.beforeRedo.primaryByteSha256,
        },
        persistentAddScene: {
          beforeSceneIds: addScene.authoritativeRereads.beforeRedo.sceneIds,
          afterSceneIds: addScene.authoritativeRereads.afterRedo.sceneIds,
          sceneAppended: addScene.authoritativeRereads.afterRedo.sceneIds.length === addScene.authoritativeRereads.beforeRedo.sceneIds.length + 1,
          assetsPreserved: addScene.assetsPreserved,
        },
      },
      safety: {
        noExecutionAuthority: save.noExecutionAuthority && addScene.noExecutionAuthority,
        noTransitionAuthority: save.noTransitionAuthority && addScene.noTransitionAuthority,
        noProjectMutation: save.noProjectMutation && addScene.noProjectMutation,
        noFoundryWrite: save.noFoundryWrite && addScene.noFoundryWrite,
        foreignStatePreserved: save.foreignStatePreserved && addScene.foreignStatePreserved,
        readyClaim: save.readyClaim || addScene.readyClaim,
      },
    };

    expect(composed).toMatchObject({
      operations: ["project.save", "project.add-scene.persist"],
      statuses: ["redone", "redone"],
      semanticPostStates: {
        projectSave: { beforeGeneration: 4, afterGeneration: 5, semanticHashChanged: true, envelopeRotated: true },
        persistentAddScene: { sceneAppended: true, assetsPreserved: true },
      },
      safety: {
        noExecutionAuthority: true,
        noTransitionAuthority: true,
        noProjectMutation: true,
        noFoundryWrite: true,
        foreignStatePreserved: true,
        readyClaim: false,
      },
    });
  });

  it("fails closed when either producer's semantic post-state drifts", async () => {
    const save = await createSaveRedoExecutionReceipt();
    const saveDrift = structuredClone(save) as typeof save;
    saveDrift.redoReceipt.contentSha256 = "9".repeat(64);
    expect(() => bridgeProjectSaveRedoToTerminalHistory(saveDrift)).toThrow(/semantic|hash|redo/i);

    const addScene = await createPersistentAddSceneRedoExecutionReceipt();
    const addSceneDrift = structuredClone(addScene) as typeof addScene;
    addSceneDrift.afterRedo.sceneIds = [addScene.addedSceneId];
    expect(() => bridgeProjectPersistentAddSceneRedoToTerminalHistory(addSceneDrift)).toThrow(/scene|redo|reread/i);
  });
});
