import { describe, expect, it } from "vitest";
import { validateProposalBatch } from "../packages/dicebox-core/src/proposal-batch.js";
import { createProjectRenamePreview, createProjectRenameProposalBatch } from "../apps/campaign-helper-desktop/src/project-rename-proposal-adapter.js";

const contentSha256 = "a".repeat(64);
const projectId = "dbx:project:rename-proposal";

async function preview() {
  return createProjectRenamePreview({
    projectId,
    workspaceIndexGeneration: 8,
    currentDisplayName: "Before Rename",
    proposedDisplayName: "After Rename",
    contentSha256,
  });
}

describe("project rename proposal adapter", () => {
  it("creates a deterministic no-write generic local-project batch", async () => {
    const firstPreview = await preview();
    const secondPreview = await preview();
    expect(firstPreview).toEqual(secondPreview);
    const batch = await createProjectRenameProposalBatch({
      batchId: "dbx:proposal:project-rename",
      preview: firstPreview,
      createdAt: "2026-08-27T20:30:00.000Z",
    });
    await expect(validateProposalBatch(batch)).resolves.toEqual(batch);
    expect(batch).toMatchObject({
      producer: { kind: "human", sourceId: "desktop.project.rename", provider: null },
      reviewAuthority: { domain: "human-review", requiredRole: "reviewer" },
      targetAuthority: { domain: "local-project", requiredActiveGm: false },
      risk: "medium",
      base: { targetId: projectId, revision: 8 },
    });
    expect(batch.commands).toHaveLength(1);
    expect(batch.commands[0]).toMatchObject({ kind: "project.rename", dependsOn: [] });
    expect(Object.keys(batch.commands[0]?.payload ?? {}).sort()).toEqual([
      "contentSha256", "currentDisplayName", "operation", "previewSha256", "projectId", "proposedDisplayName", "workspaceIndexGeneration",
    ]);
    expect(JSON.stringify(batch)).not.toMatch(/bytes|rawBytes|path|credential|password|secret|approved|execute|execution/i);
  });

  it("rejects tampered, malformed, unsafe, and non-mutating preview claims", async () => {
    const valid = await preview();
    const attempts = [
      { ...valid, proposedDisplayName: "Tampered" },
      { ...valid, status: "PASS" },
      { ...valid, requiresApproval: false },
      { ...valid, noWrite: false },
      { ...valid, contentSha256: "not-a-hash" },
      { ...valid, workspaceIndexGeneration: -1 },
      { ...valid, currentDisplayName: valid.proposedDisplayName },
      { ...valid, extra: "reject" },
      { ...valid, path: "outside-preview" },
    ];
    for (const [index, candidate] of attempts.entries()) {
      await expect(createProjectRenameProposalBatch({
        batchId: `dbx:proposal:project-rename-reject-${index}`,
        preview: candidate,
        createdAt: "2026-08-27T20:31:00.000Z",
      })).rejects.toThrow();
    }
  });

  it("binds the base to current workspace identity and content, not the proposed name", async () => {
    const first = await preview();
    const second = await createProjectRenamePreview({
      projectId,
      workspaceIndexGeneration: 8,
      currentDisplayName: "Before Rename",
      proposedDisplayName: "A Different Name",
      contentSha256,
    });
    const firstBatch = await createProjectRenameProposalBatch({ batchId: "dbx:proposal:project-rename-a", preview: first, createdAt: "2026-08-27T20:32:00.000Z" });
    const secondBatch = await createProjectRenameProposalBatch({ batchId: "dbx:proposal:project-rename-b", preview: second, createdAt: "2026-08-27T20:32:00.000Z" });
    expect(firstBatch.base).toEqual(secondBatch.base);
    expect(firstBatch.commands[0]?.payload.previewSha256).not.toBe(secondBatch.commands[0]?.payload.previewSha256);
  });
});
