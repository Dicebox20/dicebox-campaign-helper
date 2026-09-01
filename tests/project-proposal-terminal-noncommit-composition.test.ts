import { describe, expect, it } from "vitest";
import {
  approveDesktopProjectProposalSession,
  beginDesktopProjectProposalSessionApply,
  cancelDesktopProjectProposalSession,
  commitDesktopProjectProposalSessionAfterReread,
  createDesktopProjectProposalSession,
  inspectDesktopProjectProposalSession,
  invalidateStaleDesktopProjectProposalSession,
  rejectDesktopProjectProposalSession,
} from "../apps/campaign-helper-desktop/src/project-proposal-session.js";
import { createStableDiceBoxId } from "../packages/dicebox-core/src/identity.js";
import { previewProposalBatch, type ProposalBatch, type ProposalBatchActor } from "../packages/dicebox-core/src/proposal-batch.js";
import {
  createProjectAssetBindingPreview,
  createProjectAssetBindingProposalBatch,
} from "../apps/campaign-helper-desktop/src/project-asset-binding-proposal-adapter.js";
import { createProjectRecoveryProposalBatch } from "../apps/campaign-helper-desktop/src/project-recovery-proposal-adapter.js";
import { createBlankProjectScene } from "../apps/campaign-helper-desktop/src/project-store.js";

const projectId = "dbx:project:m878-proposal-terminal-noncommit-composition";
const stableProjectId = createStableDiceBoxId("project", "m878-proposal-terminal-noncommit-composition");
const sceneId = "dbx:scene:m878-proposal-terminal-noncommit-composition-main";
const observedAt = (second: number) => `2026-09-01T05:00:${String(second).padStart(2, "0")}.000Z`;
const requester: ProposalBatchActor = { actorId: "human:m878-requester", role: "requester" };
const reviewer: ProposalBatchActor = { actorId: "human:m878-reviewer", role: "reviewer" };
const matchedReread = { status: "matched" as const, targetId: stableProjectId, revision: 2, sha256: "b".repeat(64) };

type TerminalDisposition = "reject" | "cancel" | "stale";

async function makeOperationBatches(): Promise<readonly [ProposalBatch, ProposalBatch]> {
  const scene = createBlankProjectScene(projectId);
  const candidate = {
    mediaType: "image/png" as const,
    bytes: [137, 80, 78, 71, 13, 10, 26, 10, 0],
    label: "M878 proposal terminal.png",
    provenance: "user-import" as const,
  };
  const bindingPreview = await createProjectAssetBindingPreview({
    projectId,
    currentGeneration: 1,
    currentContentSha256: "0".repeat(64),
    candidate,
    sceneId: scene.id,
    proposedSceneCount: 1,
    proposedActiveSceneId: scene.id,
    proposedAssetCount: 1,
  });
  const bindingBatch = await createProjectAssetBindingProposalBatch({
    batchId: "dbx:proposal:m878-asset-bind",
    preview: bindingPreview,
    createdAt: observedAt(0),
  });
  const recoveryBatch = await createProjectRecoveryProposalBatch({
    batchId: "dbx:proposal:m878-backup-promote",
    preview: {
      operation: "dicebox.project.recovery.backup-promotion.preview",
      status: "PREVIEW",
      projectId,
      primary: { relativePath: "projects/m878-proposal-terminal-noncommit-composition/project.json", status: "MISSING" },
      backup: { relativePath: "projects/m878-proposal-terminal-noncommit-composition/project.backup.json", status: "VALID", sourceSchemaVersion: "0.3.0", byteSha256: "d".repeat(64) },
      generation: 2,
      contentSha256: "b".repeat(64),
      scenes: [{ sceneId, sceneSha256: "e".repeat(64) }],
      activeSceneId: sceneId,
      assetCount: 1,
      assetCollectionSha256: "f".repeat(64),
      semanticStateSha256: "1".repeat(64),
      backupByteSha256: "d".repeat(64),
      protectedStateSha256: "2".repeat(64),
      assetTreeSha256: "3".repeat(64),
      previewSha256: "c".repeat(64),
      requiresApproval: true,
      noWrite: true,
      noFoundryWrite: true,
    },
    createdAt: observedAt(1),
  });
  return [bindingBatch, recoveryBatch];
}

async function terminalSession(batch: ProposalBatch, disposition: TerminalDisposition, second: number) {
  let session = await createDesktopProjectProposalSession({
    projectId,
    batch,
    history: await previewProposalBatch(batch, requester, observedAt(second)),
  });
  if (disposition === "reject") return rejectDesktopProjectProposalSession(session, reviewer, observedAt(second + 1));
  if (disposition === "cancel") return cancelDesktopProjectProposalSession(session, requester, observedAt(second + 1));
  session = await approveDesktopProjectProposalSession(session, reviewer, batch.base, observedAt(second + 1));
  return invalidateStaleDesktopProjectProposalSession(session, reviewer, observedAt(second + 2));
}

describe("M878 operation-specific proposal terminal non-commit composition", () => {
  it("keeps reject, cancel, and stale histories terminal for both producers", async () => {
    const [bindingBatch, recoveryBatch] = await makeOperationBatches();
    const bindingPreviewHistory = await previewProposalBatch(bindingBatch, requester, observedAt(2));
    const recoveryPreviewHistory = await previewProposalBatch(recoveryBatch, requester, observedAt(3));
    await expect(createDesktopProjectProposalSession({ projectId, batch: recoveryBatch, history: bindingPreviewHistory })).rejects.toThrow(/batch|history|hash|identity/i);
    await expect(createDesktopProjectProposalSession({ projectId, batch: bindingBatch, history: recoveryPreviewHistory })).rejects.toThrow(/batch|history|hash|identity/i);
    const scenarios: readonly [ProposalBatch, TerminalDisposition, string, string[], number][] = [
      [bindingBatch, "reject", "project.asset.bind", ["preview", "reject"], 2],
      [bindingBatch, "cancel", "project.asset.bind", ["preview", "cancel"], 2],
      [bindingBatch, "stale", "project.asset.bind", ["preview", "approve", "invalidate-stale"], 3],
      [recoveryBatch, "reject", "project.recovery.backup-promote", ["preview", "reject"], 2],
      [recoveryBatch, "cancel", "project.recovery.backup-promote", ["preview", "cancel"], 2],
      [recoveryBatch, "stale", "project.recovery.backup-promote", ["preview", "approve", "invalidate-stale"], 3],
    ];

    for (const [index, [batch, disposition, commandKind, transitions, historyLength]] of scenarios.entries()) {
      const session = await terminalSession(batch, disposition, index * 4);
      const inspection = inspectDesktopProjectProposalSession(session);
      expect(inspection).toMatchObject({
        projectId,
        batchId: batch.batchId,
        status: disposition === "reject" ? "rejected" : disposition === "cancel" ? "cancelled" : "stale",
        commandCount: 1,
        historyLength,
        noWrite: true,
      });
      expect(batch.commands[0]).toMatchObject({ kind: commandKind, payload: { projectId } });
      expect(session.history.receipts.map((receipt) => receipt.transition)).toEqual(transitions);
      expect(session.history.receipts.every((receipt) => receipt.reread === null)).toBe(true);
      expect(session.history.receipts.some((receipt) => receipt.transition === "begin-apply" || receipt.transition === "commit-after-reread")).toBe(false);
      await expect(beginDesktopProjectProposalSessionApply(session, reviewer, batch.base, observedAt(50))).rejects.toThrow(/not allowed|terminal/i);
      await expect(commitDesktopProjectProposalSessionAfterReread(session, reviewer, matchedReread, observedAt(51))).rejects.toThrow(/not allowed|terminal/i);
    }

    expect(bindingBatch.batchId).not.toBe(recoveryBatch.batchId);
    expect(bindingBatch.batchSha256).not.toBe(recoveryBatch.batchSha256);
    expect(bindingBatch.reviewAuthority).toEqual({ domain: "human-review", requiredRole: "reviewer" });
    expect(recoveryBatch.reviewAuthority).toEqual({ domain: "human-review", requiredRole: "reviewer" });
    expect(bindingBatch.targetAuthority).toEqual({ domain: "local-project", requiredActiveGm: false });
    expect(recoveryBatch.targetAuthority).toEqual({ domain: "local-project", requiredActiveGm: false });
    expect(bindingBatch.producer.provider).toBeNull();
    expect(recoveryBatch.producer.provider).toBeNull();
  });
});
