import { describe, expect, it } from "vitest";
import {
  bridgeProjectRenameRedoToTerminalHistory,
  bridgeProjectRenameExecutionToTerminalHistory,
  projectRenameRedoTerminalHistoryReceiptSchema,
  projectRenameTerminalHistoryReceiptSchema,
} from "../apps/campaign-helper-desktop/src/project-rename-terminal-history.js";
import {
  approveProposalBatch,
  beginProposalApply,
  commitProposalAfterReread,
  createProposalBatch,
  previewProposalBatch,
  redoProposalBatch,
  undoProposalBatch,
} from "../packages/dicebox-core/src/index.js";

const projectId = "dbx:project:m715-rename";
const batchId = "dbx:proposal:m715-rename";
const commandId = "dbx:proposal-command:m715-rename";
const contentSha256 = "c".repeat(64);
const sceneId = "dbx:scene:m715-rename";
const observed = (second: number) => `2026-08-30T20:00:${String(second).padStart(2, "0")}.000Z`;

async function executionReceipt(overrides: Record<string, unknown> = {}) {
  const batch = await createProposalBatch({
    schemaVersion: "0.1.0",
    batchId,
    revision: 0,
    previousBatchSha256: null,
    producer: { kind: "human", sourceId: "desktop.project.rename", provider: null },
    reviewAuthority: { domain: "human-review", requiredRole: "reviewer" },
    targetAuthority: { domain: "local-project", requiredActiveGm: false },
    risk: "low",
    base: { targetId: projectId, revision: 9, sha256: "a".repeat(64) },
    commands: [{
      commandId,
      kind: "project.rename",
      dependsOn: [],
      payload: {
        contentSha256,
        currentDisplayName: "Before",
        operation: "project.rename",
        previewSha256: "b".repeat(64),
        projectId,
        proposedDisplayName: "After",
        workspaceIndexGeneration: 9,
      },
    }],
    createdAt: observed(0),
  });
  let history = await previewProposalBatch(batch, { actorId: "requester", role: "requester" }, observed(1));
  history = await approveProposalBatch(history, batch, { actorId: "reviewer", role: "reviewer" }, batch.base, observed(2));
  history = await beginProposalApply(history, batch, { actorId: "reviewer", role: "reviewer" }, batch.base, observed(3));
  history = await commitProposalAfterReread(history, batch, { actorId: "reviewer", role: "reviewer" }, { status: "matched", targetId: projectId, revision: 10, sha256: "d".repeat(64) }, observed(4));
  history = await undoProposalBatch(history, batch, { actorId: "reviewer", role: "reviewer" }, { status: "matched", targetId: projectId, revision: 11, sha256: "e".repeat(64) }, observed(5));

  const read = (displayName: string, workspaceIndexGeneration: number, authoritativeStateSha256: string) => ({
    projectId,
    displayName,
    workspaceIndexGeneration,
    generation: 1,
    contentSha256,
    authoritativeStateSha256,
    catalog: {
      operation: "dicebox.project.catalog",
      status: "PASS",
      entries: [{
        projectId,
        status: "PASS",
        sceneId,
        sceneName: "M715",
        sceneCount: 1,
        activeSceneId: sceneId,
        generation: 1,
        contentSha256,
        assetCount: 0,
        recoveredFrom: null,
        blockerCode: null,
        displayName,
        lastOpenedSequence: 1,
        workspaceMetadataWarning: null,
      }],
      workspaceIndexGeneration,
      workspaceMetadataWarning: null,
      noWrite: true,
      noFoundryWrite: true,
    },
    catalogEntry: {
      projectId,
      status: "PASS",
      sceneId,
      sceneName: "M715",
      sceneCount: 1,
      activeSceneId: sceneId,
      generation: 1,
      contentSha256,
      assetCount: 0,
      recoveredFrom: null,
      blockerCode: null,
      displayName,
      lastOpenedSequence: 1,
      workspaceMetadataWarning: null,
    },
    project: {
      scenesJson: [JSON.stringify({ sceneId })],
      activeSceneId: sceneId,
      assets: [],
      receipt: {
        operation: "dicebox.project.load",
        status: "PASS",
        projectId,
        generation: 1,
        contentSha256,
        sceneSha256: "f".repeat(64),
        sceneCount: 1,
        activeSceneId: sceneId,
        scenes: [{ sceneId, sceneSha256: "f".repeat(64) }],
        assetCount: 0,
        recoveredFrom: null,
        migrationStatus: "current",
        persistedContentSha256: contentSha256,
        noFoundryWrite: true,
      },
    },
    noWrite: true,
    noFoundryWrite: true,
  });

  const metadata = (displayName: string, indexGeneration: number) => ({
    operation: "dicebox.workspace-metadata.rename",
    status: "PASS",
    projectId,
    displayName,
    lastOpenedSequence: 1,
    indexGeneration,
    contentSha256,
    recoveredFrom: null,
    atomicReplace: true,
    directoryEntrySync: true,
    backupPreserved: true,
    noFoundryWrite: true,
  });

  return {
    operation: "dicebox.project.rename.execute",
    status: "PASS",
    projectId,
    batchId,
    currentDisplayName: "Before",
    proposedDisplayName: "After",
    before: read("Before", 9, "a".repeat(64)),
    afterApply: read("After", 10, "d".repeat(64)),
    afterUndo: read("Before", 11, "e".repeat(64)),
    apply: metadata("After", 10),
    undo: metadata("Before", 11),
    history,
    batch,
    projectContentWrite: false,
    noFoundryWrite: true,
    ...overrides,
  };
}

async function redoExecutionReceipt(overrides: Record<string, unknown> = {}) {
  const undone = await executionReceipt();
  const history = await redoProposalBatch(
    undone.history,
    undone.batch,
    { actorId: "reviewer", role: "reviewer" },
    { status: "matched", targetId: projectId, revision: 12, sha256: "f".repeat(64) },
    observed(6),
  );
  const read = (displayName: string, workspaceIndexGeneration: number, authoritativeStateSha256: string) => ({
    ...undone.before,
    displayName,
    workspaceIndexGeneration,
    authoritativeStateSha256,
    catalog: {
      ...undone.before.catalog,
      workspaceIndexGeneration,
      entries: undone.before.catalog.entries.map((entry) => ({ ...entry, displayName })),
    },
    catalogEntry: { ...undone.before.catalogEntry, displayName },
  });
  const redoReceipt = {
    operation: "dicebox.workspace-metadata.rename",
    status: "PASS",
    projectId,
    displayName: "After",
    lastOpenedSequence: 1,
    indexGeneration: 12,
    contentSha256,
    recoveredFrom: null,
    atomicReplace: true,
    directoryEntrySync: true,
    backupPreserved: true,
    noFoundryWrite: true,
  };
  return {
    operation: "dicebox.project.rename.redo",
    status: "PASS",
    projectId,
    batchId,
    currentDisplayName: "Before",
    proposedDisplayName: "After",
    beforeRedo: read("Before", 11, "e".repeat(64)),
    afterRedo: read("After", 12, "f".repeat(64)),
    redoReceipt,
    history,
    matchedReread: { status: "matched", targetId: projectId, revision: 12, sha256: "f".repeat(64) },
    projectContentWrite: false,
    noProjectMutation: true,
    noFoundryWrite: true,
    ...overrides,
  };
}

describe("project.rename terminal-history bridge", () => {
  it("projects one completed metadata lifecycle without adding execution authority", async () => {
    const result = bridgeProjectRenameExecutionToTerminalHistory(await executionReceipt());

    expect(result).toMatchObject({
      status: "undone",
      operation: "dicebox.project.rename.execute",
      commandKind: "project.rename",
      projectId,
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
      historyStatus: "undone",
      historyTransitions: ["preview", "approve", "begin-apply", "commit-after-reread", "undo"],
    });
    expect(projectRenameTerminalHistoryReceiptSchema.parse(result)).toEqual(result);
  });

  it("fails closed for foreign, content-writing, and non-terminal evidence", async () => {
    const foreign = await executionReceipt({ projectId: "dbx:project:foreign" });
    expect(() => bridgeProjectRenameExecutionToTerminalHistory(foreign)).toThrow(/project|foreign/i);
    const contentWriting = await executionReceipt({ projectContentWrite: true });
    expect(() => bridgeProjectRenameExecutionToTerminalHistory(contentWriting)).toThrow(/content|write/i);
    const committed = await executionReceipt();
    committed.history = { ...committed.history, status: "committed", receipts: committed.history.receipts.slice(0, -1) };
    expect(() => bridgeProjectRenameExecutionToTerminalHistory(committed)).toThrow(/terminal|undone|history/i);
  });

  it("projects one exact redo lifecycle with matched metadata reread and no execution authority", async () => {
    const result = bridgeProjectRenameRedoToTerminalHistory(await redoExecutionReceipt());

    expect(result).toMatchObject({
      status: "redone",
      operation: "dicebox.project.rename.redo",
      commandKind: "project.rename",
      projectId,
      batchId,
      currentDisplayName: "Before",
      proposedDisplayName: "After",
      targetAuthority: "local-project",
      applyAuthority: "operation-specific",
      noGenericExecutor: true,
      bridgeOnly: true,
      noExecutionAuthority: true,
      noProjectMutation: true,
      authoritativeReread: true,
      foreignStatePreserved: true,
      execution: "not-implemented",
      readyClaim: false,
      historyStatus: "redone",
      historyTransitions: ["preview", "approve", "begin-apply", "commit-after-reread", "undo", "redo"],
      noTransitionAuthority: true,
      transitionInvocation: "not-invoked",
      rereadInvocation: "not-invoked",
      rereadClassifier: "projectRenameRedoTerminalHistoryReceiptSchema",
      matchedReread: { status: "matched", targetId: projectId, revision: 12, sha256: "f".repeat(64) },
    });
    expect(result.authoritativeRereads.beforeRedo.displayName).toBe("Before");
    expect(result.authoritativeRereads.afterRedo.displayName).toBe("After");
    expect(projectRenameRedoTerminalHistoryReceiptSchema.parse(result)).toEqual(result);
  });

  it("fails closed for foreign, non-terminal, and mismatched redo evidence", async () => {
    const foreign = await redoExecutionReceipt({ projectId: "dbx:project:foreign" });
    expect(() => bridgeProjectRenameRedoToTerminalHistory(foreign)).toThrow(/project|foreign/i);

    const nonTerminal = await redoExecutionReceipt();
    nonTerminal.history = { ...nonTerminal.history, status: "undone", receipts: nonTerminal.history.receipts.slice(0, -1) };
    expect(() => bridgeProjectRenameRedoToTerminalHistory(nonTerminal)).toThrow(/terminal|redone|history/i);

    const mismatched = await redoExecutionReceipt({
      matchedReread: { status: "matched", targetId: projectId, revision: 99, sha256: "f".repeat(64) },
    });
    expect(() => bridgeProjectRenameRedoToTerminalHistory(mismatched)).toThrow(/revision|reread|afterRedo/i);
  });
});
