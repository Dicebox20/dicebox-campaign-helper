import { describe, expect, it } from "vitest";
import { validateProposalBatch } from "../packages/dicebox-core/src/proposal-batch.js";
import { createProjectRecoveryProposalBatch } from "../apps/campaign-helper-desktop/src/project-recovery-proposal-adapter.js";

const h = (character: string) => character.repeat(64);
const projectId = "dbx:project:recovery-proposal";
const sceneId = "dbx:scene:recovery-proposal-main";
const assetId = `dbx:asset:sha256-${h("b")}`;
const registration = { assetId, role: "background", label: "Exact background", provenance: "fixture", approval: "approved" } as const;
const common = { status: "PREVIEW", projectId, generation: 2, previewSha256: h("9"), requiresApproval: true, noWrite: true, noFoundryWrite: true } as const;
const scene = { sceneId, sceneSha256: h("7") };

const previews = [
  {
    ...common,
    operation: "dicebox.project.migration.persist.preview",
    authoritativeSource: "project.json",
    sourceSchemaVersion: "0.2.0",
    targetSchemaVersion: "0.3.0",
    nextGeneration: 3,
    persistedContentSha256: h("a"),
    resultingContentSha256: h("b"),
    scenes: [scene], activeSceneId: sceneId, assetCount: 0, assetCollectionSha256: h("c"), semanticStateSha256: h("d"),
    actions: ["preserve-scenes-and-assets"], primaryByteSha256: h("e"), protectedStateSha256: h("f"), assetTreeSha256: h("1"),
  },
  {
    ...common,
    operation: "dicebox.project.recovery.backup-promotion.preview",
    primary: { relativePath: "projects/recovery-proposal/project.json", status: "MISSING" },
    backup: { relativePath: "projects/recovery-proposal/project.backup.json", status: "VALID", byteSha256: h("2") },
    contentSha256: h("a"), scenes: [scene], activeSceneId: sceneId, assetCount: 0, assetCollectionSha256: h("c"),
    semanticStateSha256: h("d"), backupByteSha256: h("2"), protectedStateSha256: h("f"), assetTreeSha256: h("1"),
  },
  {
    ...common,
    operation: "dicebox.project.asset.restore.preview",
    contentSha256: h("a"), migrationStatus: "current", recoveredFrom: null, assetId, assetSha256: h("b"), mediaType: "image/png",
    byteLength: 8, registration, targetRelativePath: `assets/sha256/${h("b")}`, affectedSceneIds: [sceneId], candidateSha256: h("b"),
    candidateByteLength: 8, protectedStateSha256: h("f"),
  },
  {
    ...common,
    operation: "dicebox.project.asset.detach.preview",
    contentSha256: h("a"), migrationStatus: "current", assetId, assetSha256: h("b"), mediaType: "image/png", byteLength: 8,
    registration, targetRelativePath: `assets/sha256/${h("b")}`, affectedScenes: [scene], resultingScenes: [{ ...scene, sceneSha256: h("8") }],
    resultingAssetCount: 0, resultingAssetCollectionSha256: h("3"), nextGeneration: 3, resultingContentSha256: h("4"),
    primaryByteSha256: h("5"), protectedStateSha256: h("f"), assetTreeSha256: h("1"),
  },
  {
    ...common,
    operation: "dicebox.project.broken-reference.detach.preview",
    contentSha256: h("a"), sceneId, assetId, blockerCode: "BACKGROUND_ASSET_MISSING", assetDescriptorPreserved: true,
    affectedScene: scene, resultingScenes: [{ ...scene, sceneSha256: h("8") }], resultingAssetCount: 1,
    resultingAssetCollectionSha256: h("3"), nextGeneration: 3, resultingContentSha256: h("4"), primaryByteSha256: h("5"),
    protectedStateSha256: h("f"), assetTreeSha256: h("1"),
  },
] as const;

describe("project recovery proposal adapter", () => {
  it("normalizes all five exact project previews into shared no-write generic batches", async () => {
    for (const [index, preview] of previews.entries()) {
      const batch = await createProjectRecoveryProposalBatch({
        batchId: `dbx:proposal:project-recovery-${index}`,
        preview,
        createdAt: `2026-08-27T20:00:0${index}.000Z`,
      });
      await expect(validateProposalBatch(batch)).resolves.toEqual(batch);
      expect(batch.producer).toMatchObject({ kind: "project-store", provider: null });
      expect(batch.reviewAuthority).toEqual({ domain: "human-review", requiredRole: "reviewer" });
      expect(batch.targetAuthority).toEqual({ domain: "local-project", requiredActiveGm: false });
      expect(batch.base).toMatchObject({ targetId: projectId, revision: 2 });
      expect(batch.commands).toHaveLength(1);
      expect(batch.commands[0]?.dependsOn).toEqual([]);
      if (preview.operation === "dicebox.project.recovery.backup-promotion.preview") {
        expect(batch.producer.sourceId).toBe("project.recovery.backup-promote");
        expect(batch.commands[0]).toMatchObject({
          kind: "project.recovery.backup-promote",
          payload: {
            operation: "project.recovery.backup-promote",
            projectId,
          },
        });
      }
      const serialized = JSON.stringify(batch);
      expect(serialized).not.toMatch(/targetRelativePath|relativePath|credential|password|secret/i);
      expect(Object.keys(batch.commands[0]?.payload ?? {})).not.toContain("bytes");
      expect(Object.keys(batch.commands[0]?.payload ?? {})).not.toContain("approved");
    }
  });

  it("uses deterministic exact project bases and operation-specific risk", async () => {
    const first = await createProjectRecoveryProposalBatch({ batchId: "dbx:proposal:project-recovery-base-a", preview: previews[0], createdAt: "2026-08-27T20:01:00.000Z" });
    const second = await createProjectRecoveryProposalBatch({ batchId: "dbx:proposal:project-recovery-base-b", preview: previews[0], createdAt: "2026-08-27T20:01:00.000Z" });
    expect(first.base).toEqual(second.base);
    expect(first.risk).toBe("medium");
    const high = await createProjectRecoveryProposalBatch({ batchId: "dbx:proposal:project-recovery-high", preview: previews[3], createdAt: "2026-08-27T20:01:00.000Z" });
    expect(high.risk).toBe("high");
  });

  it("rejects unsupported, non-preview, non-approval, tampered, and raw-byte-bearing inputs", async () => {
    const attempts = [
      { ...previews[0], operation: "dicebox.project.save.preview" },
      { ...previews[0], status: "PASS" },
      { ...previews[0], requiresApproval: false },
      { ...previews[0], previewSha256: "not-a-hash" },
      { ...previews[2], candidateSha256: h("c") },
      { ...previews[2], registration: { ...registration, role: "token" } },
      { ...previews[3], registration: { ...registration, role: "token" } },
      { ...previews[2], bytes: [1, 2, 3] },
    ];
    for (const [index, preview] of attempts.entries()) {
      await expect(createProjectRecoveryProposalBatch({ batchId: `dbx:proposal:project-recovery-reject-${index}`, preview, createdAt: "2026-08-27T20:02:00.000Z" })).rejects.toThrow();
    }
  });
});
