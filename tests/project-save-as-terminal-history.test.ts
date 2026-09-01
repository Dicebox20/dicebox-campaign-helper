import { describe, expect, it } from "vitest";
import {
  bridgeProjectSaveAsExecutionToTerminalHistory,
  bridgeProjectSaveAsRedoToTerminalHistory,
  projectSaveAsTerminalHistoryReceiptSchema,
} from "../apps/campaign-helper-desktop/src/project-save-as-terminal-history.js";
import {
  approveProposalBatch,
  beginProposalApply,
  commitProposalAfterReread,
  createProposalBatch,
  previewProposalBatch,
  redoProposalBatch,
  undoProposalBatch,
} from "../packages/dicebox-core/src/index.js";

const sourceProjectId = "dbx:project:m719-source";
const targetProjectId = "dbx:project:m719-target";
const batchId = "dbx:proposal:m719-save-as";
const commandId = "dbx:proposal-command:m719-save-as";
const sceneId = "dbx:scene:m719-source";
const observed = (second: number) => `2026-08-30T21:00:${String(second).padStart(2, "0")}.000Z`;

function projectRead(projectId: string, generation: number, contentSha256: string, scenesSha256: string, primaryByteSha256: string, backupByteSha256: string, displayName: string) {
  return {
    projectId,
    generation,
    contentSha256,
    sceneIds: [sceneId],
    scenesSha256,
    activeSceneId: sceneId,
    sceneCount: 1,
    assets: [],
    assetCollectionSha256: "9".repeat(64),
    catalogEntry: { projectId, status: "PASS", generation, contentSha256, displayName },
    project: {
      scenesJson: [JSON.stringify({ sceneId })],
      activeSceneId: sceneId,
      assets: [],
      receipt: {
        operation: "dicebox.project.load",
        status: "PASS",
        projectId,
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
      projectId,
      generation,
      contentSha256,
      noWrite: true,
      noFoundryWrite: true,
      primary: { status: "VALID", byteSha256: primaryByteSha256 },
      backup: { status: "VALID", byteSha256: backupByteSha256 },
    },
    catalog: {
      operation: "dicebox.project.catalog",
      status: "PASS",
      entries: [{ projectId, status: "PASS", generation, contentSha256, displayName }],
      workspaceIndexGeneration: 4,
      noWrite: true,
      noFoundryWrite: true,
    },
    noWrite: true,
    noFoundryWrite: true,
  };
}

async function redoneExecutionReceipt() { const source = await executionReceipt(); const undone = await undoProposalBatch(source.history, source.batch, { actorId:"reviewer", role:"reviewer" }, { status:"matched", targetId:sourceProjectId, revision:2, sha256:"c".repeat(64) }, observed(5)); const history = await redoProposalBatch(undone, source.batch, { actorId:"reviewer", role:"reviewer" }, { status:"matched", targetId:sourceProjectId, revision:2, sha256:"c".repeat(64) }, observed(6)); const beforeSource = source.before.source; const afterSource = source.before.source; const afterTarget = projectRead(targetProjectId,3,"d".repeat(64),"b".repeat(64),"4".repeat(64),"5".repeat(64),"Copy"); return { operation:"dicebox.project.save-as.redo",status:"PASS",sourceProjectId,targetProjectId,batchId,beforeRedo:{source:beforeSource,target:null,targetAbsent:true,noWrite:true,noFoundryWrite:true},afterRedo:{source:afterSource,target:afterTarget,targetAbsent:false,noWrite:true,noFoundryWrite:true},matchedReread:{status:"matched" as const,targetId:targetProjectId,revision:3,sha256:"d".repeat(64)},history,sourceReceipt:source,noProjectMutation:true,noFoundryWrite:true }; }

async function executionReceipt(overrides: Record<string, unknown> = {}) {
  const batch = await createProposalBatch({
    schemaVersion: "0.1.0",
    batchId,
    revision: 0,
    previousBatchSha256: null,
    producer: { kind: "project-store", sourceId: "desktop.project.save-as", provider: null },
    reviewAuthority: { domain: "human-review", requiredRole: "reviewer" },
    targetAuthority: { domain: "local-project", requiredActiveGm: false },
    risk: "medium",
    base: { targetId: sourceProjectId, revision: 2, sha256: "a".repeat(64) },
    commands: [{
      commandId,
      kind: "project.save-as",
      dependsOn: [],
      payload: {
        operation: "project.save-as",
        sourceProjectId,
        targetProjectId,
        sourceGeneration: 2,
        sourceContentSha256: "c".repeat(64),
        sourceAssetCount: 0,
        sourceAssetCollectionSha256: "9".repeat(64),
        workspaceIndexGeneration: 4,
        sourceSceneIds: [sceneId],
        sourceScenesSha256: "a".repeat(64),
        sourceActiveSceneId: sceneId,
        sourceSceneCount: 1,
        proposedDisplayName: "Copy",
        targetAbsent: true,
        previewSha256: "b".repeat(64),
      },
    }],
    createdAt: observed(0),
  });
  let history = await previewProposalBatch(batch, { actorId: "requester", role: "requester" }, observed(1));
  history = await approveProposalBatch(history, batch, { actorId: "reviewer", role: "reviewer" }, batch.base, observed(2));
  history = await beginProposalApply(history, batch, { actorId: "reviewer", role: "reviewer" }, batch.base, observed(3));
  history = await commitProposalAfterReread(history, batch, { actorId: "reviewer", role: "reviewer" }, { status: "matched", targetId: sourceProjectId, revision: 2, sha256: "c".repeat(64) }, observed(4));

  const beforeSource = projectRead(sourceProjectId, 2, "c".repeat(64), "a".repeat(64), "f".repeat(64), "1".repeat(64), "Source");
  const afterSource = projectRead(sourceProjectId, 2, "c".repeat(64), "a".repeat(64), "f".repeat(64), "1".repeat(64), "Source");
  const afterTarget = projectRead(targetProjectId, 1, "d".repeat(64), "b".repeat(64), "2".repeat(64), "3".repeat(64), "Copy");
  afterSource.catalog.workspaceIndexGeneration = 5;
  afterTarget.catalog.workspaceIndexGeneration = 5;
  return {
    operation: "dicebox.project.save-as.execute",
    status: "PASS",
    sourceProjectId,
    targetProjectId,
    batchId,
    before: { source: beforeSource, target: null, targetAbsent: true, workspaceIndexGeneration: 4, catalog: beforeSource.catalog, noWrite: true, noFoundryWrite: true },
    afterApply: { source: afterSource, target: afterTarget, targetAbsent: false, workspaceIndexGeneration: 5, catalog: { ...afterTarget.catalog, entries: [beforeSource.catalogEntry, afterTarget.catalogEntry] }, noWrite: true, noFoundryWrite: true },
    saveAs: {
      operation: "dicebox.project.save-as",
      status: "PASS",
      projectId: targetProjectId,
      generation: 1,
      contentSha256: "d".repeat(64),
      sceneSha256: "b".repeat(64),
      sceneCount: 1,
      activeSceneId: sceneId,
      scenes: [{ sceneId, sceneSha256: "b".repeat(64) }],
      assetCount: 0,
      projectRelativePath: "projects/m719-target/project.json",
      atomicReplace: true,
      directoryEntrySync: true,
      backupPreserved: false,
      noFoundryWrite: true,
      workspaceMetadata: {
        operation: "dicebox.workspace-metadata.touch",
        status: "PASS",
        projectId: targetProjectId,
        displayName: "Copy",
        lastOpenedSequence: 2,
        indexGeneration: 5,
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
    sourcePreserved: true,
    targetCreated: true,
    noFoundryWrite: true,
    batch,
    ...overrides,
  };
}

describe("project.save-as terminal-history bridge", () => {
  it("projects one committed source-preserving target-creation lifecycle without adding execution authority", async () => {
    const result = bridgeProjectSaveAsExecutionToTerminalHistory(await executionReceipt());

    expect(result).toMatchObject({
      status: "committed",
      disposition: "terminal-committed",
      operation: "dicebox.project.save-as.execute",
      commandKind: "project.save-as",
      sourceProjectId,
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
    expect(projectSaveAsTerminalHistoryReceiptSchema.parse(result)).toEqual(result);
  });

  it("fails closed for non-persistent, Foundry-writing, and non-terminal evidence", async () => {
    const nonPersistent = await executionReceipt({ projectPersistenceWrite: false });
    expect(() => bridgeProjectSaveAsExecutionToTerminalHistory(nonPersistent)).toThrow(/projectPersistenceWrite|true/i);
    const foundryWriting = await executionReceipt({ noFoundryWrite: false });
    expect(() => bridgeProjectSaveAsExecutionToTerminalHistory(foundryWriting)).toThrow(/Foundry|write/i);
    const nonTerminal = await executionReceipt();
    nonTerminal.history = { ...nonTerminal.history, status: "applying", receipts: nonTerminal.history.receipts.slice(0, -1) };
    expect(() => bridgeProjectSaveAsExecutionToTerminalHistory(nonTerminal)).toThrow(/terminal|committed|history/i);
  });
});

describe("M782 project.save-as redo terminal-history bridge", () => { it("projects canonical redo without execution authority", async () => { const result=bridgeProjectSaveAsRedoToTerminalHistory(await redoneExecutionReceipt()); expect(result).toMatchObject({status:"redone",commandKind:"project.save-as",targetAuthority:"local-project",noExecutionAuthority:true,noTransitionAuthority:true,matchedReread:{revision:3},historyStatus:"redone"}); }); });
