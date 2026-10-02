import { describe, expect, it } from "vitest";
import { beginProposalApply, createStableDiceBoxId, previewProposalBatch } from "../packages/dicebox-core/src/index.js";
import {
  approveDesktopProjectProposalSession,
  cancelDesktopProjectProposalSession,
  clearTerminalDesktopProjectProposalSession,
  createDesktopProjectRenameProposalSession,
  desktopProjectProposalRecoveryView,
  invalidateStaleDesktopProjectProposalSession,
  loadDesktopProjectProposalSession,
  markDesktopProjectProposalOutcomeUnknown,
  recoverDesktopProjectProposalSession,
  saveDesktopProjectProposalSession,
  type DesktopProjectProposalSessionStorage,
} from "../apps/campaign-helper-desktop/src/project-proposal-session.js";
import { createProjectRenamePreview, createProjectRenameProposalBatch } from "../apps/campaign-helper-desktop/src/project-rename-proposal-adapter.js";

const projectId = "dbx:project:rename-session";

class MemoryStorage implements DesktopProjectProposalSessionStorage {
  private readonly values = new Map<string, string>();
  getItem(key: string): string | null { return this.values.get(key) ?? null; }
  setItem(key: string, value: string): void { this.values.set(key, value); }
  removeItem(key: string): void { this.values.delete(key); }
}

async function sessionFixture() {
  const preview = await createProjectRenamePreview({
    projectId,
    workspaceIndexGeneration: 4,
    currentDisplayName: "Before",
    proposedDisplayName: "After",
    contentSha256: "b".repeat(64),
  });
  const batch = await createProjectRenameProposalBatch({
    batchId: "dbx:proposal:rename-session",
    preview,
    createdAt: "2026-08-27T20:40:00.000Z",
  });
  const history = await previewProposalBatch(batch, { actorId: "requester", role: "requester" }, "2026-08-27T20:40:01.000Z");
  return createDesktopProjectRenameProposalSession({ projectId, batch, history });
}

describe("project rename proposal session integration", () => {
  it("accepts the exact M320 batch and preserves project-session no-write semantics", async () => {
    const session = await sessionFixture();
    expect(session.projectId).toBe(projectId);
    expect(session.batch.commands[0]?.kind).toBe("project.rename");
    const storage = new MemoryStorage();
    expect(await saveDesktopProjectProposalSession(storage, projectId, session)).toMatchObject({ projectContentWrite: false, historyLength: 1 });
    const loaded = await loadDesktopProjectProposalSession(storage, projectId);
    expect(loaded.status).toBe("PASS");
    if (loaded.status !== "PASS") throw new Error("Expected exact rename session.");
    const approved = await approveDesktopProjectProposalSession(loaded.session, { actorId: "reviewer", role: "reviewer" }, loaded.session.batch.base, "2026-08-27T20:40:02.000Z");
    expect(approved.history.status).toBe("approved");
    expect(await saveDesktopProjectProposalSession(storage, projectId, approved)).toMatchObject({ projectContentWrite: false, historyLength: 2 });
    const cancelled = await cancelDesktopProjectProposalSession(approved, { actorId: "reviewer", role: "reviewer" }, "2026-08-27T20:40:03.000Z");
    expect(cancelled.history.status).toBe("cancelled");
    await saveDesktopProjectProposalSession(storage, projectId, cancelled);
    expect(await clearTerminalDesktopProjectProposalSession(storage, projectId)).toMatchObject({ cleared: true, projectContentWrite: false });
  });

  it("keeps stale and unknown/recovery lifecycle paths session-only", async () => {
    const session = await sessionFixture();
    const stale = await invalidateStaleDesktopProjectProposalSession(session, { actorId: "reviewer", role: "reviewer" }, "2026-08-27T20:41:00.000Z");
    expect(stale.history.status).toBe("stale");
    const approved = await approveDesktopProjectProposalSession(session, { actorId: "reviewer", role: "reviewer" }, session.batch.base, "2026-08-27T20:41:01.000Z");
    const applying = await createDesktopProjectRenameProposalSession({
      projectId,
      batch: approved.batch,
      history: await beginProposalApply(approved.history, approved.batch, { actorId: "reviewer", role: "reviewer" }, approved.batch.base, "2026-08-27T20:41:01.500Z"),
    });
    const unknown = await markDesktopProjectProposalOutcomeUnknown(applying, { actorId: "reviewer", role: "reviewer" }, "2026-08-27T20:41:02.000Z");
    expect(desktopProjectProposalRecoveryView(unknown)).toMatchObject({ outcomeUnknown: true, authoritativeRereadRequired: true, retryAllowed: false });
    const recovered = await recoverDesktopProjectProposalSession(unknown, { actorId: "reviewer", role: "reviewer" }, { status: "not-committed", targetId: createStableDiceBoxId("project", "rename-session"), revision: 4, sha256: "c".repeat(64) }, "2026-08-27T20:41:03.000Z");
    expect(recovered.history.status).toBe("recovered");
    expect(recovered.projectId).toBe(projectId);
  });

  it("rejects a cross-key or non-rename generic batch at the typed seam", async () => {
    const session = await sessionFixture();
    await expect(createDesktopProjectRenameProposalSession({ projectId: "dbx:project:other", batch: session.batch, history: session.history })).rejects.toThrow(/exact human|project key/);
    await expect(createDesktopProjectRenameProposalSession({
      projectId,
      batch: { ...session.batch, commands: [{ ...session.batch.commands[0]!, kind: "project.save" }] },
      history: session.history,
    })).rejects.toThrow(/rename|hash/);
  });
});
