import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import {
  bridgeProjectSaveExecutionToTerminalHistory,
  bridgeProjectSaveRedoToTerminalHistory,
  projectSaveTerminalHistoryReceiptSchema,
  projectSaveRedoTerminalHistoryReceiptSchema,
} from "../apps/campaign-helper-desktop/src/project-save-terminal-history.js";
import {
  approveProposalBatch,
  beginProposalApply,
  commitProposalAfterReread,
  createProposalBatch,
  previewProposalBatch,
  undoProposalBatch,
} from "../packages/dicebox-core/src/index.js";

const projectId = "dbx:project:m713-save";
const batchId = "dbx:proposal:m713-save";
const commandId = "dbx:proposal-command:m713-save";
const root = resolve(import.meta.dirname, "..");
const observed = (second: number) => `2026-08-30T19:00:${String(second).padStart(2, "0")}.000Z`;

async function executionReceipt(overrides: Record<string, unknown> = {}) {
  const batch = await createProposalBatch({
    schemaVersion: "0.1.0",
    batchId,
    revision: 0,
    previousBatchSha256: null,
    producer: { kind: "project-store", sourceId: "desktop.project.save", provider: null },
    reviewAuthority: { domain: "human-review", requiredRole: "reviewer" },
    targetAuthority: { domain: "local-project", requiredActiveGm: false },
    risk: "medium",
    base: { targetId: projectId, revision: 2, sha256: "a".repeat(64) },
    commands: [{
      commandId,
      kind: "project.save",
      dependsOn: [],
      payload: {
        contentDescriptorSha256: "b".repeat(64),
        currentContentSha256: "c".repeat(64),
        expectedGeneration: 2,
        operation: "project.save",
        projectId,
        proposedActiveSceneId: "dbx:scene:m713-save",
        proposedAssetCount: 0,
        proposedSceneCount: 1,
      },
    }],
    createdAt: observed(0),
  });
  let history = await previewProposalBatch(batch, { actorId: "requester", role: "requester" }, observed(1));
  history = await approveProposalBatch(history, batch, { actorId: "reviewer", role: "reviewer" }, batch.base, observed(2));
  history = await beginProposalApply(history, batch, { actorId: "reviewer", role: "reviewer" }, batch.base, observed(3));
  history = await commitProposalAfterReread(history, batch, { actorId: "reviewer", role: "reviewer" }, { status: "matched", targetId: projectId, revision: 3, sha256: "d".repeat(64) }, observed(4));
  history = await undoProposalBatch(history, batch, { actorId: "reviewer", role: "reviewer" }, { status: "matched", targetId: projectId, revision: 4, sha256: "e".repeat(64) }, observed(5));

  const read = (
    generation: number,
    contentSha256: string,
    semanticContentSha256: string,
    primaryByteSha256: string,
    backupByteSha256: string,
  ) => ({
    projectId,
    generation,
    contentSha256,
    semanticContentSha256,
    activeSceneId: "dbx:scene:m713-save",
    sceneCount: 1,
    assetCount: 0,
    primaryByteSha256,
    backupByteSha256,
    catalog: {
      operation: "dicebox.project.catalog",
      status: "PASS",
      entries: [{ projectId, status: "PASS", generation, contentSha256 }],
      noWrite: true,
      noFoundryWrite: true,
    },
    catalogEntry: { projectId, status: "PASS", generation, contentSha256 },
    project: {
      activeSceneId: "dbx:scene:m713-save",
      scenesJson: [{}],
      assets: [],
      receipt: {
        operation: "dicebox.project.load",
        status: "PASS",
        projectId,
        generation,
        contentSha256,
        activeSceneId: "dbx:scene:m713-save",
        sceneCount: 1,
        assetCount: 0,
        noFoundryWrite: true,
      },
    },
    recovery: {
      operation: "dicebox.project.recovery.inspect",
      status: "PASS",
      projectId,
      generation,
      contentSha256,
      noWrite: true,
      noFoundryWrite: true,
      primary: { status: "VALID", byteSha256: primaryByteSha256 },
      backup: { status: "VALID", byteSha256: backupByteSha256 },
    },
    noWrite: true,
    noFoundryWrite: true,
  });

  return {
    operation: "dicebox.project.save.execute",
    status: "PASS",
    projectId,
    batchId,
    before: read(2, "c".repeat(64), "0".repeat(64), "f".repeat(64), "1".repeat(64)),
    afterApply: read(3, "d".repeat(64), "2".repeat(64), "2".repeat(64), "f".repeat(64)),
    afterUndo: read(4, "e".repeat(64), "0".repeat(64), "3".repeat(64), "2".repeat(64)),
    save: {
      operation: "dicebox.project.save",
      status: "PASS",
      projectId,
      generation: 3,
      contentSha256: "d".repeat(64),
      sceneSha256: "4".repeat(64),
      sceneCount: 1,
      activeSceneId: "dbx:scene:m713-save",
      assetCount: 0,
      scenes: [{}],
      projectRelativePath: "projects/m713/project.json",
      atomicReplace: true,
      directoryEntrySync: true,
      backupPreserved: true,
      noFoundryWrite: true,
    },
    inverseRestore: {
      operation: "dicebox.project.save",
      status: "PASS",
      projectId,
      generation: 4,
      contentSha256: "e".repeat(64),
      sceneSha256: "5".repeat(64),
      sceneCount: 1,
      activeSceneId: "dbx:scene:m713-save",
      assetCount: 0,
      scenes: [{}],
      projectRelativePath: "projects/m713/project.json",
      atomicReplace: true,
      directoryEntrySync: true,
      backupPreserved: true,
      noFoundryWrite: true,
    },
    history,
    projectContentWrite: true,
    noFoundryWrite: true,
    ...overrides,
  };
}

function advancedAuthoritativeRead(
  input: Awaited<ReturnType<typeof executionReceipt>>["afterUndo"],
  generation: number,
  contentSha256: string,
  semanticContentSha256: string,
  primaryByteSha256: string,
  backupByteSha256: string,
) {
  return {
    ...input,
    generation,
    contentSha256,
    semanticContentSha256,
    primaryByteSha256,
    backupByteSha256,
    catalog: {
      ...input.catalog,
      entries: input.catalog.entries.map((entry) => ({ ...entry, generation, contentSha256 })),
    },
    catalogEntry: { ...input.catalogEntry, generation, contentSha256 },
    project: {
      ...input.project,
      receipt: { ...input.project.receipt, generation, contentSha256 },
    },
    recovery: {
      ...input.recovery,
      generation,
      contentSha256,
      primary: { ...input.recovery.primary, byteSha256: primaryByteSha256 },
      backup: { ...input.recovery.backup, byteSha256: backupByteSha256 },
    },
  };
}

async function redoneExecutionReceipt() {
  const source = await executionReceipt();
  const beforeRedo = source.afterUndo;
  const afterRedo = advancedAuthoritativeRead(
    beforeRedo,
    5,
    "7".repeat(64),
    "2".repeat(64),
    "4".repeat(64),
    "3".repeat(64),
  );
  const last = source.history.receipts.at(-1)!;
  const redoHistory = {
    ...source.history,
    status: "redone" as const,
    receipts: [
      ...source.history.receipts,
      {
        ...last,
        sequence: 5,
        receiptId: "dbx:proposal-receipt:m713-save-5",
        transition: "redo" as const,
        fromStatus: "undone" as const,
        toStatus: "redone" as const,
        observedAt: observed(6),
        reread: { status: "matched" as const, targetId: projectId, revision: 5, sha256: "7".repeat(64) },
      },
    ],
  };
  return {
    operation: "dicebox.project.save.redo",
    status: "PASS",
    projectId,
    batchId,
    beforeRedo,
    afterRedo,
    redoReceipt: {
      ...source.save,
      generation: 5,
      contentSha256: "7".repeat(64),
      sceneSha256: "6".repeat(64),
    },
    history: redoHistory,
    matchedReread: { status: "matched" as const, targetId: projectId, revision: 5, sha256: "7".repeat(64) },
    noProjectMutation: true,
    noFoundryWrite: true,
  };
}

describe("project.save terminal-history bridge", () => {
  it("projects one completed operation-specific lifecycle without adding execution authority", async () => {
    const result = bridgeProjectSaveExecutionToTerminalHistory(await executionReceipt());

    expect(result).toMatchObject({
      status: "undone",
      operation: "dicebox.project.save.execute",
      commandKind: "project.save",
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
    expect(projectSaveTerminalHistoryReceiptSchema.parse(result)).toEqual(result);
  });

  it("fails closed for foreign, Foundry-writing, and non-terminal evidence", async () => {
    const foreign = await executionReceipt({ projectId: "dbx:project:foreign" });
    expect(() => bridgeProjectSaveExecutionToTerminalHistory(foreign)).toThrow(/project|foreign/i);
    const foundryWriting = await executionReceipt({ noFoundryWrite: false });
    expect(() => bridgeProjectSaveExecutionToTerminalHistory(foundryWriting)).toThrow(/Foundry|write/i);
    const committed = await executionReceipt();
    committed.history = { ...committed.history, status: "committed", receipts: committed.history.receipts.slice(0, -1) };
    expect(() => bridgeProjectSaveExecutionToTerminalHistory(committed)).toThrow(/terminal|undone|history/i);
  });
});

describe("M752 project.save redo terminal-history bridge", () => {
  it("projects one exact undone-to-redone receipt with a matched post-redo reread", async () => {
    const result = bridgeProjectSaveRedoToTerminalHistory(await redoneExecutionReceipt());

    expect(result).toMatchObject({
      status: "redone",
      disposition: "terminal-redone",
      operation: "dicebox.project.save.redo",
      commandKind: "project.save",
      projectId,
      batchId,
      targetAuthority: "local-project",
      applyAuthority: "operation-specific",
      noGenericExecutor: true,
      bridgeOnly: true,
      noExecutionAuthority: true,
      authoritativeReread: true,
      noProjectMutation: true,
      execution: "not-implemented",
      readyClaim: false,
      historyStatus: "redone",
      historyTransitions: ["preview", "approve", "begin-apply", "commit-after-reread", "undo", "redo"],
      matchedReread: { status: "matched", targetId: projectId, revision: 5, sha256: "7".repeat(64) },
      noTransitionAuthority: true,
      transitionInvocation: "not-invoked",
      rereadInvocation: "not-invoked",
      rereadClassifier: "projectSaveRedoTerminalHistoryReceiptSchema",
    });
    expect(result.authoritativeRereads.beforeRedo.generation).toBe(4);
    expect(result.authoritativeRereads.afterRedo.generation).toBe(5);
    expect(projectSaveRedoTerminalHistoryReceiptSchema.parse(result)).toEqual(result);
  });

  it("fails closed for foreign, non-redone, and mismatched-reread evidence", async () => {
    const source = await redoneExecutionReceipt();
    expect(() => bridgeProjectSaveRedoToTerminalHistory({ ...source, projectId: "dbx:project:foreign" })).toThrow(/project|foreign/i);
    expect(() => bridgeProjectSaveRedoToTerminalHistory({
      ...source,
      history: { ...source.history, status: "undone", receipts: source.history.receipts.slice(0, -1) },
    })).toThrow(/redone|history/i);
    expect(() => bridgeProjectSaveRedoToTerminalHistory({
      ...source,
      matchedReread: { ...source.matchedReread, revision: 6 },
    })).toThrow(/reread|revision/i);
  });

  it("fails closed when the semantic post-state does not change", async () => {
    const source = await redoneExecutionReceipt();
    const drifted = structuredClone(source) as typeof source;
    drifted.afterRedo.semanticContentSha256 = drifted.beforeRedo.semanticContentSha256;
    expect(() => bridgeProjectSaveRedoToTerminalHistory(drifted)).toThrow(/semantic|post-state/i);
  });

  it("keeps the bridge non-executing and transition-free", () => {
    const source = readFileSync(resolve(root, "apps", "campaign-helper-desktop", "src", "project-save-terminal-history.ts"), "utf8");
    expect(source).not.toContain("redoProposalBatch(");
    expect(source).not.toContain("executeApprovedProjectSave(");
  });
});
