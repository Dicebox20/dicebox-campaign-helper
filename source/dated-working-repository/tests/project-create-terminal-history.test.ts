import { describe, expect, it } from "vitest";
import {
  bridgeProjectCreateExecutionToTerminalHistory,
  bridgeProjectCreateRedoToTerminalHistory,
  projectCreateTerminalHistoryReceiptSchema,
  projectCreateRedoTerminalHistoryReceiptSchema,
} from "../apps/campaign-helper-desktop/src/project-create-terminal-history.js";
import {
  approveProposalBatch,
  beginProposalApply,
  commitProposalAfterReread,
  createProposalBatch,
  previewProposalBatch,
  redoProposalBatch,
  undoProposalBatch,
} from "../packages/dicebox-core/src/index.js";

const targetProjectId = "dbx:project:m721-created";
const batchId = "dbx:proposal:m721-create";
const commandId = "dbx:proposal-command:m721-create";
const sceneId = "dbx:scene:m721-created";
const observed = (second: number) => `2026-08-30T22:00:${String(second).padStart(2, "0")}.000Z`;

function targetRead(generation: number, contentSha256: string, scenesSha256: string, primaryByteSha256: string, displayName: string) {
  return {
    projectId: targetProjectId,
    generation,
    contentSha256,
    sceneIds: [sceneId],
    scenesSha256,
    activeSceneId: sceneId,
    sceneCount: 1,
    assets: [],
    assetCollectionSha256: "9".repeat(64),
    catalogEntry: { projectId: targetProjectId, status: "PASS", generation, contentSha256, displayName },
    project: {
      scenesJson: [JSON.stringify({ sceneId })],
      activeSceneId: sceneId,
      assets: [],
      receipt: {
        operation: "dicebox.project.load",
        status: "PASS",
        projectId: targetProjectId,
        generation,
        contentSha256,
        activeSceneId: sceneId,
        sceneCount: 1,
        assetCount: 0,
        noFoundryWrite: true,
      },
    },
    recovery: {
      operation: "dicebox.project.recovery.inspect",
      status: "PASS",
      projectId: targetProjectId,
      generation,
      contentSha256,
      noWrite: true,
      noFoundryWrite: true,
      primary: { status: "VALID", byteSha256: primaryByteSha256 },
      backup: { status: "MISSING" },
    },
    catalog: {
      operation: "dicebox.project.catalog",
      status: "PASS",
      entries: [{ projectId: targetProjectId, status: "PASS", generation, contentSha256, displayName }],
      workspaceIndexGeneration: 7,
      noWrite: true,
      noFoundryWrite: true,
    },
    noWrite: true,
    noFoundryWrite: true,
  };
}

async function executionReceipt(overrides: Record<string, unknown> = {}) {
  const batch = await createProposalBatch({
    schemaVersion: "0.1.0",
    batchId,
    revision: 0,
    previousBatchSha256: null,
    producer: { kind: "project-store", sourceId: "desktop.project.create", provider: null },
    reviewAuthority: { domain: "human-review", requiredRole: "reviewer" },
    targetAuthority: { domain: "local-project", requiredActiveGm: false },
    risk: "medium",
    base: { targetId: targetProjectId, revision: 0, sha256: "a".repeat(64) },
    commands: [{
      commandId,
      kind: "project.create",
      dependsOn: [],
      payload: {
        operation: "project.create",
        targetProjectId,
        workspaceIndexGeneration: 7,
        sceneIds: [sceneId],
        scenesSha256: "b".repeat(64),
        activeSceneId: sceneId,
        sceneCount: 1,
        proposedDisplayName: "Created",
        targetAbsent: true,
        previewSha256: "c".repeat(64),
      },
    }],
    createdAt: observed(0),
  });
  let history = await previewProposalBatch(batch, { actorId: "requester", role: "requester" }, observed(1));
  history = await approveProposalBatch(history, batch, { actorId: "reviewer", role: "reviewer" }, batch.base, observed(2));
  history = await beginProposalApply(history, batch, { actorId: "reviewer", role: "reviewer" }, batch.base, observed(3));
  history = await commitProposalAfterReread(history, batch, { actorId: "reviewer", role: "reviewer" }, { status: "matched", targetId: targetProjectId, revision: 1, sha256: "d".repeat(64) }, observed(4));

  const before = { target: null, targetAbsent: true, workspaceIndexGeneration: 7, catalog: { operation: "dicebox.project.catalog", status: "PASS", entries: [], workspaceIndexGeneration: 7, noWrite: true, noFoundryWrite: true }, noWrite: true, noFoundryWrite: true };
  const afterTarget = targetRead(1, "d".repeat(64), "b".repeat(64), "2".repeat(64), "Created");
  return {
    operation: "dicebox.project.create.execute",
    status: "PASS",
    targetProjectId,
    batchId,
    before,
    afterApply: { target: afterTarget, targetAbsent: false, workspaceIndexGeneration: 8, catalog: { ...afterTarget.catalog, workspaceIndexGeneration: 8 }, noWrite: true, noFoundryWrite: true },
    create: {
      operation: "dicebox.project.create",
      status: "PASS",
      projectId: targetProjectId,
      generation: 1,
      contentSha256: "d".repeat(64),
      sceneSha256: "b".repeat(64),
      sceneCount: 1,
      activeSceneId: sceneId,
      scenes: [{ sceneId, sceneSha256: "b".repeat(64) }],
      assetCount: 0,
      projectRelativePath: "projects/m721-created/project.json",
      atomicReplace: true,
      directoryEntrySync: true,
      backupPreserved: false,
      noFoundryWrite: true,
      workspaceMetadata: {
        operation: "dicebox.workspace-metadata.touch",
        status: "PASS",
        projectId: targetProjectId,
        displayName: "Created",
        lastOpenedSequence: 3,
        indexGeneration: 8,
        contentSha256: "d".repeat(64),
        recoveredFrom: null,
        atomicReplace: true,
        directoryEntrySync: true,
        backupPreserved: false,
        noFoundryWrite: true,
      },
    },
    history,
    projectContentWrite: true,
    projectPersistenceWrite: true,
    targetCreated: true,
    firstGenerationBackupMissing: true,
    noFoundryWrite: true,
    batch,
    ...overrides,
  };
}

async function redoneExecutionReceipt() {
  const source = await executionReceipt();
  const originalTarget = source.afterApply.target;
  const afterRedoTarget = targetRead(3, originalTarget.contentSha256, originalTarget.scenesSha256, "3".repeat(64), "Created");
  const undoneHistory = await undoProposalBatch(source.history, source.batch, { actorId: "reviewer", role: "reviewer" }, { status: "matched", targetId: targetProjectId, revision: 2, sha256: "e".repeat(64) }, observed(5));
  const history = await redoProposalBatch(undoneHistory, source.batch, { actorId: "reviewer", role: "reviewer" }, { status: "matched", targetId: targetProjectId, revision: 3, sha256: originalTarget.contentSha256 }, observed(6));
  return {
    operation: "dicebox.project.create.redo",
    status: "PASS",
    targetProjectId,
    batchId,
    beforeRedo: { target: null, targetAbsent: true, noWrite: true, noFoundryWrite: true },
    afterRedo: { target: afterRedoTarget, targetAbsent: false, noWrite: true, noFoundryWrite: true },
    matchedReread: { status: "matched" as const, targetId: targetProjectId, revision: 3, sha256: originalTarget.contentSha256 },
    history,
    sourceReceipt: source,
    noProjectMutation: true,
    noFoundryWrite: true,
  };
}

describe("project.create terminal-history bridge", () => {
  it("projects one committed first-generation target creation without adding execution authority", async () => {
    const result = bridgeProjectCreateExecutionToTerminalHistory(await executionReceipt());

    expect(result).toMatchObject({
      status: "committed",
      disposition: "terminal-committed",
      operation: "dicebox.project.create.execute",
      commandKind: "project.create",
      targetProjectId,
      batchId,
      targetAuthority: "local-project",
      applyAuthority: "operation-specific",
      noGenericExecutor: true,
      bridgeOnly: true,
      noExecutionAuthority: true,
      authoritativeReread: true,
      foreignStatePreserved: true,
      execution: "not-implemented",
      readyClaim: false,
      historyStatus: "committed",
      historyTransitions: ["preview", "approve", "begin-apply", "commit-after-reread"],
    });
    expect(projectCreateTerminalHistoryReceiptSchema.parse(result)).toEqual(result);
  });

  it("fails closed for non-persistent, Foundry-writing, and non-terminal evidence", async () => {
    const nonPersistent = await executionReceipt({ projectPersistenceWrite: false });
    expect(() => bridgeProjectCreateExecutionToTerminalHistory(nonPersistent)).toThrow(/projectPersistenceWrite|true/i);
    const foundryWriting = await executionReceipt({ noFoundryWrite: false });
    expect(() => bridgeProjectCreateExecutionToTerminalHistory(foundryWriting)).toThrow(/Foundry|write/i);
    const nonTerminal = await executionReceipt();
    nonTerminal.history = { ...nonTerminal.history, status: "applying", receipts: nonTerminal.history.receipts.slice(0, -1) };
    expect(() => bridgeProjectCreateExecutionToTerminalHistory(nonTerminal)).toThrow(/terminal|committed|history/i);
  });
});

describe("M778 project.create redo terminal-history bridge", () => {
  it("projects one exact undone-to-redone create receipt with a matched authoritative reread", async () => {
    const result = bridgeProjectCreateRedoToTerminalHistory(await redoneExecutionReceipt());
    expect(result).toMatchObject({
      status: "redone",
      disposition: "terminal-redone",
      operation: "dicebox.project.create.redo",
      commandKind: "project.create",
      targetProjectId,
      batchId,
      targetAuthority: "local-project",
      applyAuthority: "operation-specific",
      noGenericExecutor: true,
      noExecutionAuthority: true,
      noTransitionAuthority: true,
      transitionInvocation: "not-invoked",
      rereadInvocation: "not-invoked",
      rereadClassifier: "projectCreateRedoTerminalHistoryReceiptSchema",
      noProjectMutation: true,
      noFoundryWrite: true,
      sourceProjectContentWrite: false,
      historyStatus: "redone",
      historyTransitions: ["preview", "approve", "begin-apply", "commit-after-reread", "undo", "redo"],
      matchedReread: { status: "matched", targetId: targetProjectId, revision: 3, sha256: "d".repeat(64) },
    });
    expect(projectCreateRedoTerminalHistoryReceiptSchema.parse(await redoneExecutionReceipt())).toEqual(result);
  });

  it("fails closed for foreign, non-redone, and mismatched-reread evidence", async () => {
    const source = await redoneExecutionReceipt();
    expect(() => bridgeProjectCreateRedoToTerminalHistory({ ...source, targetProjectId: "dbx:project:foreign" })).toThrow(/foreign|target/i);
    expect(() => bridgeProjectCreateRedoToTerminalHistory({ ...source, history: { ...source.history, status: "undone", receipts: source.history.receipts.slice(0, -1) } })).toThrow(/redone|history/i);
    expect(() => bridgeProjectCreateRedoToTerminalHistory({ ...source, matchedReread: { ...source.matchedReread, revision: 4 } })).toThrow(/reread|revision/i);
  });
});
