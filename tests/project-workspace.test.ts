import { beforeEach, describe, expect, it, vi } from "vitest";
import { serializeSceneDocument } from "@dicebox/scene";

const invoke = vi.hoisted(() => vi.fn());
vi.mock("@tauri-apps/api/core", () => ({ invoke }));

import {
  FOUNDATION_SELF_TEST_PROJECT_ID,
  bindBackgroundAssetToScene,
  previewBackupAuthoritativeRecovery,
  promoteBackupAuthoritativeRecovery,
  detachBrokenReference,
  createBlankProjectScene,
  createProjectBundle,
  detachMissingAsset,
  displayNameFromInput,
  explainProjectMigration,
  previewProjectMigrationPersist,
  persistProjectMigration,
  prepareLegacyMigrationPersistenceFixture,
  formatProjectStoreFailure,
  inspectProjectRecovery,
  listProjectBundles,
  loadProjectBundle,
  projectIdFromInput,
  registerAudioAsset,
  registerHandoutAsset,
  registerTokenAsset,
  previewMissingAssetRestore,
  previewMissingAssetDetach,
  previewBrokenReferenceDetach,
  selectBrokenSceneReference,
  prepareDanglingBackgroundReferenceFixture,
  projectSessionCloseDecision,
  renameProjectBundle,
  restoreMissingAsset,
  selectEligibleMissingBackgroundAsset,
  type ProjectRecoveryInspectionReceipt,
  type BackupRecoveryPromotionPreviewReceipt,
  saveFoundationSelfTestBundle,
  saveProjectAsBundle,
  saveProjectBundle,
} from "../apps/campaign-helper-desktop/src/project-store";

async function sha256Text(value: string): Promise<string> {
  const digest = await globalThis.crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

describe("real project workspace boundary", () => {
  beforeEach(() => invoke.mockReset().mockResolvedValue({}));

  it("normalizes dynamic project IDs and rejects Windows device slugs", () => {
    expect(projectIdFromInput("My First Campaign")).toBe("dbx:project:my-first-campaign");
    expect(projectIdFromInput("dbx:project:already-valid")).toBe("dbx:project:already-valid");
    expect(() => projectIdFromInput("CON")).toThrow(/non-reserved slug/);
    expect(() => projectIdFromInput("lpt9")).toThrow(/non-reserved slug/);
    expect(displayNameFromInput("My Campaign")).toBe("My Campaign");
    expect(() => displayNameFromInput(" bad\nname ")).toThrow(/display name/);
  });

  it("creates a blank non-fixture Scene with stable project-derived identity", () => {
    const scene = createBlankProjectScene("New Campaign");
    const second = createBlankProjectScene("New Campaign", 2);
    expect(scene).toMatchObject({
      schemaVersion: "0.1.0",
      revision: 0,
      id: "dbx:scene:new-campaign-main",
      name: "New Campaign",
      entities: [],
    });
    expect(JSON.stringify(scene)).not.toContain("dbx:apparatus:core");
    expect(second).toMatchObject({ id: "dbx:scene:new-campaign-scene-2", name: "Scene 2", entities: [] });
    expect(() => createBlankProjectScene("New Campaign", 257)).toThrow(/ordinal/);
  });

  it("closes a clean saved session without write and refuses to discard dirty Scene state", () => {
    const scene = createBlankProjectScene("Close Campaign");
    const persisted = [serializeSceneDocument(scene)];
    expect(projectSessionCloseDecision("dbx:project:close-campaign", [scene], persisted)).toEqual({
      status: "PASS",
      projectId: "dbx:project:close-campaign",
      reason: "Close clears only in-memory project/editor state; persisted state is unchanged.",
      noWrite: true,
    });
    const dirty = { ...scene, name: "Edited Scene" };
    const blocked = projectSessionCloseDecision("dbx:project:close-campaign", [dirty], persisted);
    expect(blocked.status).toBe("BLOCKED");
    expect(blocked.reason).toMatch(/must be saved before closing/);
    expect(blocked.noWrite).toBe(true);
  });

  it("uses fixed IPC operations with dynamic IDs and no ordinary fixture asset injection", async () => {
    const scene = createBlankProjectScene("Real Campaign");
    const second = createBlankProjectScene("Real Campaign", 2);
    await createProjectBundle("Real Campaign", [scene, second], second.id, "Real Campaign", 4);
    expect(invoke).toHaveBeenLastCalledWith("create_project_bundle", {
      request: expect.objectContaining({
        projectId: "dbx:project:real-campaign",
        expectedGeneration: 0,
        schemaVersion: "0.3.0",
        scenesJson: [expect.any(String), expect.any(String)],
        activeSceneId: second.id,
        assets: [],
        expectedWorkspaceGeneration: 4,
        workspaceDisplayName: "Real Campaign",
      }),
    });

    await saveProjectBundle("Real Campaign", [scene, second], second.id, 3);
    const saveRequest = invoke.mock.calls.at(-1)?.[1].request as Record<string, unknown>;
    expect(invoke.mock.calls.at(-1)?.[0]).toBe("save_project_bundle");
    expect(saveRequest).toMatchObject({ schemaVersion: "0.3.0", projectId: "dbx:project:real-campaign", expectedGeneration: 3, activeSceneId: second.id });
    expect(saveRequest).not.toHaveProperty("assets");

    await saveProjectAsBundle("Real Campaign", "Copy Campaign", [scene, second], second.id, "Copy Campaign", 5);
    expect(invoke).toHaveBeenLastCalledWith("save_project_as_bundle", {
      request: expect.objectContaining({
        sourceProjectId: "dbx:project:real-campaign",
        targetProjectId: "dbx:project:copy-campaign",
        schemaVersion: "0.3.0",
        activeSceneId: second.id,
        expectedWorkspaceGeneration: 5,
        workspaceDisplayName: "Copy Campaign",
      }),
    });

    await loadProjectBundle("Copy Campaign", 6);
    expect(invoke).toHaveBeenLastCalledWith("load_project_bundle", {
      request: { schemaVersion: "0.3.0", projectId: "dbx:project:copy-campaign", expectedWorkspaceGeneration: 6 },
    });
    await renameProjectBundle("Copy Campaign", "Copy Renamed", 7);
    expect(invoke).toHaveBeenLastCalledWith("rename_project_bundle", {
      request: {
        schemaVersion: "0.1.0",
        projectId: "dbx:project:copy-campaign",
        displayName: "Copy Renamed",
        expectedWorkspaceGeneration: 7,
      },
    });
    await listProjectBundles();
    expect(invoke).toHaveBeenLastCalledWith("list_project_bundles");
  });

  it("preserves a relationship-bearing Scene across canonical project save and reload bytes", async () => {
    const relationshipScene = {
      ...createBlankProjectScene("Relationship Persistence Campaign"),
      entities: [
        {
          id: "dbx:apparatus:core",
          kind: "apparatus" as const,
          name: "Core apparatus",
          x: 64,
          y: 64,
          width: 64,
          height: 64,
          color: 0x7c3aed,
          locked: false,
        },
        {
          id: "dbx:region:puzzle",
          kind: "region" as const,
          name: "Puzzle region",
          x: 192,
          y: 64,
          width: 128,
          height: 128,
          color: 0x22d3ee,
          locked: true,
        },
      ],
      relationships: [{
        relationId: "dbx:relation:core-puzzle-align",
        kind: "align" as const,
        fromEntityId: "dbx:apparatus:core",
        toEntityId: "dbx:region:puzzle",
        axis: "center" as const,
      }],
    };
    const foreignScene = createBlankProjectScene("Relationship Persistence Campaign", 2);
    const persisted = [serializeSceneDocument(relationshipScene), serializeSceneDocument(foreignScene)];
    const relationshipSceneHash = await sha256Text(persisted[0]!);
    const contentHash = await sha256Text(persisted.join("\n"));
    const foreignAsset = { sha256: "f".repeat(64), mediaType: "application/octet-stream", bytes: [1, 2, 3, 4], byteLength: 4, relativePath: "foreign/asset.bin" };
    const saveReceipt = {
      operation: "dicebox.project.save" as const,
      status: "PASS" as const,
      projectId: "dbx:project:relationship-persistence-campaign",
      generation: 4,
      contentSha256: contentHash,
      sceneSha256: relationshipSceneHash,
      sceneCount: 2,
      activeSceneId: foreignScene.id,
      scenes: [{ sceneId: relationshipScene.id, sceneSha256: relationshipSceneHash }, { sceneId: foreignScene.id, sceneSha256: await sha256Text(persisted[1]!) }],
      assetCount: 1,
      projectRelativePath: "projects/relationship-persistence-campaign/project.json",
      atomicReplace: true as const,
      directoryEntrySync: true as const,
      backupPreserved: true,
      noFoundryWrite: true as const,
    };
    invoke.mockResolvedValueOnce(saveReceipt);
    const saved = await saveProjectBundle("Relationship Persistence Campaign", [relationshipScene, foreignScene], foreignScene.id, 3, [foreignAsset]);
    expect(saved.contentSha256).toBe(contentHash);
    const saveRequest = invoke.mock.calls.at(-1)?.[1].request as { scenesJson: readonly string[]; assets: readonly unknown[] };
    expect(saveRequest.scenesJson).toEqual(persisted);
    expect(saveRequest.assets).toEqual([foreignAsset]);
    expect(saveRequest.scenesJson[0]).toContain('"relationships":[{"relationId":"dbx:relation:core-puzzle-align"');

    const loadResponse = {
      scenesJson: persisted,
      activeSceneId: foreignScene.id,
      assets: [foreignAsset],
      receipt: {
        operation: "dicebox.project.load" as const,
        status: "PASS" as const,
        projectId: saveReceipt.projectId,
        generation: saveReceipt.generation,
        contentSha256: contentHash,
        sceneSha256: relationshipSceneHash,
        sceneCount: 2,
        activeSceneId: foreignScene.id,
        scenes: saveReceipt.scenes,
        assetCount: 1,
        recoveredFrom: null,
        migrationStatus: "current" as const,
        persistedContentSha256: contentHash,
        noFoundryWrite: true as const,
      },
    };
    invoke.mockResolvedValueOnce(loadResponse);
    const loaded = await loadProjectBundle("Relationship Persistence Campaign", 5);
    expect(loaded.scenesJson).toEqual(persisted);
    expect(JSON.parse(loaded.scenesJson[0]!)).toEqual(relationshipScene);
    expect(JSON.parse(loaded.scenesJson[1]!)).toEqual(foreignScene);
    expect(loaded.assets).toEqual([foreignAsset]);
    expect(loaded.receipt.contentSha256).toBe(contentHash);
    expect(loaded.receipt.persistedContentSha256).toBe(contentHash);
  });

  it("rejects duplicate Scene IDs and an active ID outside the ordered collection before IPC", async () => {
    const first = createBlankProjectScene("Guarded Campaign");
    const second = createBlankProjectScene("Guarded Campaign", 2);
    await expect(saveProjectBundle("Guarded Campaign", [first, first], first.id, 1)).rejects.toThrow(/unique/);
    await expect(saveProjectBundle("Guarded Campaign", [first, second], "dbx:scene:absent", 1)).rejects.toThrow(/active Scene/);
    expect(invoke).not.toHaveBeenCalled();
  });

  it("binds explicit background bytes to only the selected Scene with a hash-derived stable identity", async () => {
    invoke.mockResolvedValue({ operation: "dicebox.project.save", status: "PASS", generation: 2 });
    const first = createBlankProjectScene("Asset Campaign");
    const second = createBlankProjectScene("Asset Campaign", 2);
    const png = [137, 80, 78, 71, 13, 10, 26, 10];
    const result = await bindBackgroundAssetToScene("Asset Campaign", [first, second], second.id, 1, {
      mediaType: "image/png",
      bytes: png,
      label: "Background.png",
      provenance: "user-import",
    });
    expect(result.scenes[0]?.background.assetId).toBeUndefined();
    expect(result.scenes[1]?.background.assetId).toBe(result.assetId);
    expect(result.assetId).toBe(`dbx:asset:sha256-${result.sha256}`);
    const request = invoke.mock.calls.at(-1)?.[1].request;
    expect(request.schemaVersion).toBe("0.3.0");
    expect(request.assets).toEqual([expect.objectContaining({
      mediaType: "image/png",
      bytes: png,
      registration: expect.objectContaining({ assetId: result.assetId, role: "background", approval: "approved" }),
    })]);
    expect(request.scenesJson[0]).not.toContain(result.assetId);
    expect(request.scenesJson[1]).toContain(result.assetId);
  });

  it("registers a non-scene handout without adding a Scene background binding", async () => {
    invoke.mockResolvedValue({ operation: "dicebox.project.save", status: "PASS", generation: 2, assetCount: 1 });
    const scene = createBlankProjectScene("Handout Campaign");
    const png = [137, 80, 78, 71, 13, 10, 26, 10];
    const result = await registerHandoutAsset("Handout Campaign", [scene], scene.id, 1, {
      mediaType: "image/png",
      bytes: png,
      label: "Handout.png",
      provenance: "user-import",
    });
    expect(result.assetId).toBe(`dbx:asset:sha256-${result.sha256}`);
    expect(invoke).toHaveBeenLastCalledWith("save_project_bundle", {
      request: expect.objectContaining({
        projectId: "dbx:project:handout-campaign",
        expectedGeneration: 1,
        scenesJson: [expect.not.stringContaining(result.assetId)],
        assets: [expect.objectContaining({
          mediaType: "image/png",
          bytes: png,
          registration: expect.objectContaining({ assetId: result.assetId, role: "handout", approval: "approved" }),
        })],
      }),
    });
  });

  it("registers a non-scene audio asset with a typed audio role without adding a Scene background binding", async () => {
    invoke.mockResolvedValue({ operation: "dicebox.project.save", status: "PASS", generation: 2, assetCount: 1 });
    const scene = createBlankProjectScene("Audio Campaign");
    const wav = [82, 73, 70, 70, 36, 0, 0, 0, 87, 65, 86, 69, 102, 109, 116, 32];
    const result = await registerAudioAsset("Audio Campaign", [scene], scene.id, 1, {
      mediaType: "audio/wav",
      bytes: wav,
      label: "Ambient.wav",
      provenance: "user-import",
    });
    expect(result.assetId).toBe(`dbx:asset:sha256-${result.sha256}`);
    expect(invoke).toHaveBeenLastCalledWith("save_project_bundle", {
      request: expect.objectContaining({
        projectId: "dbx:project:audio-campaign",
        expectedGeneration: 1,
        scenesJson: [expect.not.stringContaining(result.assetId)],
        assets: [expect.objectContaining({
          mediaType: "audio/wav",
          bytes: wav,
          registration: expect.objectContaining({ assetId: result.assetId, role: "audio", approval: "approved" }),
        })],
      }),
    });
  });

  it("registers a non-scene token asset with a typed token role without adding a Scene background binding", async () => {
    invoke.mockResolvedValue({ operation: "dicebox.project.save", status: "PASS", generation: 2, assetCount: 1 });
    const scene = createBlankProjectScene("Token Campaign");
    const png = [137, 80, 78, 71, 13, 10, 26, 10];
    const result = await registerTokenAsset("Token Campaign", [scene], scene.id, 1, {
      mediaType: "image/png",
      bytes: png,
      label: "Token.png",
      provenance: "user-import",
    });
    expect(result.assetId).toBe(`dbx:asset:sha256-${result.sha256}`);
    expect(invoke).toHaveBeenLastCalledWith("save_project_bundle", {
      request: expect.objectContaining({
        projectId: "dbx:project:token-campaign",
        expectedGeneration: 1,
        scenesJson: [expect.not.stringContaining(result.assetId)],
        assets: [expect.objectContaining({
          mediaType: "image/png",
          bytes: png,
          registration: expect.objectContaining({ assetId: result.assetId, role: "token", approval: "approved" }),
        })],
      }),
    });
  });

  it("keeps backup-authoritative recovery behind an exact missing-primary preview and approval", async () => {
    const preview = {
      operation: "dicebox.project.recovery.backup-promotion.preview",
      status: "PREVIEW",
      projectId: "dbx:project:backup-campaign",
      primary: { relativePath: "projects/backup-campaign/project.json", status: "MISSING" },
      backup: { relativePath: "projects/backup-campaign/project.backup.json", status: "VALID", sourceSchemaVersion: "0.3.0", byteSha256: "b".repeat(64) },
      generation: 1,
      contentSha256: "c".repeat(64),
      scenes: [{ sceneId: "dbx:scene:backup-campaign-main", sceneSha256: "d".repeat(64) }],
      activeSceneId: "dbx:scene:backup-campaign-main",
      assetCount: 0,
      assetCollectionSha256: "e".repeat(64),
      semanticStateSha256: "f".repeat(64),
      backupByteSha256: "b".repeat(64),
      protectedStateSha256: "1".repeat(64),
      assetTreeSha256: "2".repeat(64),
      previewSha256: "3".repeat(64),
      requiresApproval: true,
      noWrite: true,
      noFoundryWrite: true,
    } satisfies BackupRecoveryPromotionPreviewReceipt;
    invoke.mockResolvedValueOnce(preview);
    await expect(previewBackupAuthoritativeRecovery("Backup Campaign")).resolves.toEqual(preview);
    expect(invoke).toHaveBeenLastCalledWith("preview_backup_authoritative_recovery", {
      request: { schemaVersion: "0.3.0", projectId: "dbx:project:backup-campaign" },
    });

    invoke.mockResolvedValueOnce({
      operation: "dicebox.project.recovery.backup-promotion",
      status: "PASS",
      projectId: preview.projectId,
      generation: preview.generation,
      contentSha256: preview.contentSha256,
      scenes: preview.scenes,
      activeSceneId: preview.activeSceneId,
      assetCount: 0,
      primaryRestored: true,
      backupUnchanged: true,
      semanticStateUnchanged: true,
      assetTreeUnchanged: true,
      workspaceUnchanged: true,
      foreignStateUnchanged: true,
      authoritativeCurrentReread: true,
      backupByteSha256: preview.backupByteSha256,
      previewSha256: preview.previewSha256,
      directoryEntrySync: true,
      noFoundryWrite: true,
    });
    await promoteBackupAuthoritativeRecovery(preview);
    expect(invoke).toHaveBeenLastCalledWith("promote_backup_authoritative_recovery", {
      request: {
        schemaVersion: "0.3.0",
        projectId: preview.projectId,
        generation: 1,
        contentSha256: preview.contentSha256,
        backupByteSha256: preview.backupByteSha256,
        protectedStateSha256: preview.protectedStateSha256,
        assetTreeSha256: preview.assetTreeSha256,
        previewSha256: preview.previewSha256,
        approved: true,
      },
    });
  });

  it("keeps the fixture PNG inside the explicit self-test path only", async () => {
    const scene = createBlankProjectScene("Self Test Scene");
    await saveFoundationSelfTestBundle(scene, 0);
    const request = invoke.mock.calls.at(-1)?.[1].request as { projectId: string; assets: unknown[] };
    expect(request.projectId).toBe(FOUNDATION_SELF_TEST_PROJECT_ID);
    expect(request.assets).toHaveLength(1);
  });

  it("keeps the Stage 8 ordinary-user acceptance project on a distinct fixed test-owned identity", () => {
    const projectId = "dbx:project:desktop-workspace-acceptance-self-test";
    const first = createBlankProjectScene(projectId);
    const second = createBlankProjectScene(projectId, 2);
    expect(first.id).toBe("dbx:scene:desktop-workspace-acceptance-self-test-main");
    expect(second.id).toBe("dbx:scene:desktop-workspace-acceptance-self-test-scene-2");
    expect(first.background.assetId).toBeUndefined();
    expect(second.background.assetId).toBeUndefined();
    expect(first.id).not.toContain("fixture");
  });

  it("keeps missing-blob recovery behind inspect, preview, and explicit approved restore IPC", async () => {
    await inspectProjectRecovery("Broken Campaign");
    expect(invoke).toHaveBeenLastCalledWith("inspect_project_recovery", {
      request: { schemaVersion: "0.3.0", projectId: "dbx:project:broken-campaign" },
    });

    const preview = {
      operation: "dicebox.project.asset.restore.preview",
      status: "PREVIEW",
      projectId: "dbx:project:broken-campaign",
      generation: 2,
      contentSha256: "a".repeat(64),
      migrationStatus: "current",
      recoveredFrom: null,
      assetId: `dbx:asset:sha256-${"b".repeat(64)}`,
      assetSha256: "b".repeat(64),
      mediaType: "image/png",
      byteLength: 8,
      targetRelativePath: `assets/sha256/${"b".repeat(64)}`,
      affectedSceneIds: ["dbx:scene:broken-campaign-main"],
      candidateSha256: "b".repeat(64),
      candidateByteLength: 8,
      protectedStateSha256: "c".repeat(64),
      previewSha256: "d".repeat(64),
      requiresApproval: true,
      noWrite: true,
      noFoundryWrite: true,
    } as const;
    invoke.mockResolvedValueOnce(preview);
    const returned = await previewMissingAssetRestore(preview.projectId, preview.assetId, preview.mediaType, [137, 80, 78, 71, 13, 10, 26, 10]);
    expect(invoke).toHaveBeenLastCalledWith("preview_missing_asset_restore", {
      request: expect.objectContaining({ schemaVersion: "0.3.0", projectId: preview.projectId, assetId: preview.assetId, mediaType: "image/png" }),
    });
    await restoreMissingAsset(returned, [137, 80, 78, 71, 13, 10, 26, 10]);
    expect(invoke).toHaveBeenLastCalledWith("restore_missing_asset", {
      request: expect.objectContaining({
        schemaVersion: "0.3.0",
        projectId: preview.projectId,
        assetId: preview.assetId,
        previewSha256: preview.previewSha256,
        approved: true,
      }),
    });

    const detachPreview = {
      operation: "dicebox.project.asset.detach.preview",
      status: "PREVIEW",
      projectId: preview.projectId,
      generation: 2,
      contentSha256: "a".repeat(64),
      migrationStatus: "current",
      assetId: preview.assetId,
      assetSha256: "b".repeat(64),
      mediaType: "image/png",
      byteLength: 8,
      targetRelativePath: `assets/sha256/${"b".repeat(64)}`,
      affectedScenes: [{ sceneId: "dbx:scene:broken-campaign-main", sceneSha256: "e".repeat(64) }],
      resultingScenes: [{ sceneId: "dbx:scene:broken-campaign-main", sceneSha256: "f".repeat(64) }],
      resultingAssetCount: 0,
      resultingAssetCollectionSha256: "1".repeat(64),
      nextGeneration: 3,
      resultingContentSha256: "2".repeat(64),
      primaryByteSha256: "3".repeat(64),
      protectedStateSha256: "4".repeat(64),
      assetTreeSha256: "5".repeat(64),
      previewSha256: "6".repeat(64),
      requiresApproval: true,
      noWrite: true,
      noFoundryWrite: true,
    } as const;
    invoke.mockResolvedValueOnce(detachPreview);
    const returnedDetach = await previewMissingAssetDetach(detachPreview.projectId, detachPreview.assetId);
    expect(invoke).toHaveBeenLastCalledWith("preview_missing_asset_detach", {
      request: {
        schemaVersion: "0.3.0",
        projectId: detachPreview.projectId,
        assetId: detachPreview.assetId,
      },
    });
    await detachMissingAsset(returnedDetach);
    expect(invoke).toHaveBeenLastCalledWith("detach_missing_asset", {
      request: {
        schemaVersion: "0.3.0",
        projectId: detachPreview.projectId,
        assetId: detachPreview.assetId,
        previewSha256: detachPreview.previewSha256,
        approved: true,
      },
    });
    expect(formatProjectStoreFailure({ code: "ASSET_HASH_MISMATCH", message: "Wrong bytes.", retry: "never", noFoundryWrite: true }))
      .toBe("ASSET_HASH_MISMATCH: Wrong bytes. · retry never");
  });

  it("keeps dangling Scene background diagnosis read-only and fixed-ID bound", async () => {
    await prepareDanglingBackgroundReferenceFixture();
    expect(invoke).toHaveBeenLastCalledWith("prepare_dangling_background_reference_fixture");
    expect(invoke).not.toHaveBeenCalledWith("detach_missing_asset", expect.anything());
    expect(invoke).not.toHaveBeenCalledWith("restore_missing_asset", expect.anything());
  });

  it("binds broken-reference repair to one selected Scene and asset identity", async () => {
    const reference = {
      source: "projects/dbx/project.json",
      sceneId: "dbx:scene:target",
      assetId: "dbx:asset:sha256-" + "a".repeat(64),
      blockerCode: "BACKGROUND_ASSET_ROLE_MISMATCH",
      blockerMessage: "Role mismatch",
      retry: "never",
    } as const;
    const inspection = { brokenSceneReferences: [reference] } as unknown as ProjectRecoveryInspectionReceipt;
    expect(selectBrokenSceneReference(inspection).sceneId).toBe(reference.sceneId);
    expect(selectBrokenSceneReference(inspection, reference.sceneId, reference.assetId).assetId).toBe(reference.assetId);
    const preview = {
      operation: "dicebox.project.broken-reference.detach.preview",
      status: "PREVIEW",
      projectId: "dbx:project:broken",
      generation: 1,
      contentSha256: "b".repeat(64),
      sceneId: reference.sceneId,
      assetId: reference.assetId,
      blockerCode: reference.blockerCode,
      assetDescriptorPreserved: true,
      affectedScene: { sceneId: reference.sceneId, sceneSha256: "c".repeat(64) },
      resultingScenes: [],
      resultingAssetCount: 1,
      resultingAssetCollectionSha256: "d".repeat(64),
      nextGeneration: 2,
      resultingContentSha256: "e".repeat(64),
      primaryByteSha256: "f".repeat(64),
      protectedStateSha256: "1".repeat(64),
      assetTreeSha256: "2".repeat(64),
      previewSha256: "3".repeat(64),
      requiresApproval: true,
      noWrite: true,
      noFoundryWrite: true,
    } as const;
    invoke.mockResolvedValueOnce(preview);
    await previewBrokenReferenceDetach(reference, "dbx:project:broken");
    expect(invoke).toHaveBeenLastCalledWith("preview_broken_reference_detach", {
      request: { schemaVersion: "0.3.0", projectId: "dbx:project:broken", sceneId: reference.sceneId, assetId: reference.assetId, blockerCode: reference.blockerCode },
    });
    invoke.mockResolvedValueOnce({ status: "PASS" });
    await detachBrokenReference(preview);
    expect(invoke).toHaveBeenLastCalledWith("detach_broken_reference", {
      request: { schemaVersion: "0.3.0", projectId: preview.projectId, sceneId: preview.sceneId, assetId: preview.assetId, blockerCode: preview.blockerCode, previewSha256: preview.previewSha256, approved: true },
    });
    expect(() => selectBrokenSceneReference({ brokenSceneReferences: [reference, { ...reference, sceneId: "dbx:scene:other" }] } as unknown as ProjectRecoveryInspectionReceipt)).toThrow(/exactly one/);
  });

  it("requires an explicit stable selection when multiple missing backgrounds are eligible", () => {
    const first = {
      assetId: "dbx:asset:sha256-" + "a".repeat(64),
      role: "background",
      sha256: "a".repeat(64),
      mediaType: "image/png",
      byteLength: 8,
      relativePath: "assets/sha256/" + "a".repeat(64),
      affectedSceneIds: ["dbx:scene:one"],
      disposition: "MISSING",
      blockerCode: "REGISTERED_ASSET_BLOB_MISSING",
      retry: "after-exact-byte-preview",
      restoreEligible: true,
    } as const;
    const second = {
      ...first,
      assetId: "dbx:asset:sha256-" + "b".repeat(64),
      sha256: "b".repeat(64),
      mediaType: "image/webp",
      relativePath: "assets/sha256/" + "b".repeat(64),
      affectedSceneIds: ["dbx:scene:two"],
    } as const;
    const inspection = {
      registeredAssets: [first, second],
    } as unknown as ProjectRecoveryInspectionReceipt;
    expect(() => selectEligibleMissingBackgroundAsset(inspection)).toThrow(/selecting exactly one/);
    expect(selectEligibleMissingBackgroundAsset(inspection, second.assetId)).toBe(second);
    expect(() => selectEligibleMissingBackgroundAsset(inspection, "dbx:asset:sha256-" + "c".repeat(64))).toThrow(/not currently eligible/);
  });

  it("never selects a handout as a missing background recovery target", () => {
    const inspection = {
      registeredAssets: [{
        assetId: "dbx:asset:sha256-" + "a".repeat(64),
        role: "handout",
        sha256: "a".repeat(64),
        mediaType: "image/png",
        byteLength: 8,
        relativePath: "assets/sha256/" + "a".repeat(64),
        affectedSceneIds: [],
        disposition: "MISSING",
        blockerCode: "REGISTERED_ASSET_BLOB_MISSING",
        retry: "never-with-this-operation",
        restoreEligible: true,
      }],
    } as unknown as ProjectRecoveryInspectionReceipt;
    expect(() => selectEligibleMissingBackgroundAsset(inspection)).toThrow(/No eligible missing registered background/);
  });

  it("requests a project-ID-bound no-write migration explanation without caller path or schema authority", async () => {
    const receipt = {
      operation: "dicebox.project.migration.explain",
      status: "preview-only",
      projectId: "dbx:project:legacy-campaign",
      authoritativeSource: "project.backup.json",
      primary: { relativePath: "projects/legacy-campaign/project.json", status: "BLOCKED", blockerCode: "PROJECT_UNAVAILABLE" },
      backup: { relativePath: "projects/legacy-campaign/project.backup.json", status: "VALID", sourceSchemaVersion: "0.2.0", migrationStatus: "migrated-in-memory" },
      sourceSchemaVersion: "0.2.0",
      targetSchemaVersion: "0.3.0",
      migrationStatus: "migrated-in-memory",
      generation: 2,
      contentSha256: "a".repeat(64),
      actions: ["add-asset-registration-boundary-in-memory", "preserve-scenes-and-assets", "write-only-on-explicit-save"],
      blockers: [],
      retry: "not-applicable-read-only",
      noWrite: true,
      noFoundryWrite: true,
    } as const;
    invoke.mockResolvedValueOnce(receipt);
    await expect(explainProjectMigration("Legacy Campaign")).resolves.toEqual(receipt);
    expect(invoke).toHaveBeenLastCalledWith("explain_project_migration", {
      request: { schemaVersion: "0.3.0", projectId: "dbx:project:legacy-campaign" },
    });
    const request = invoke.mock.calls.at(-1)?.[1].request;
    expect(request).not.toHaveProperty("path");
    expect(request).not.toHaveProperty("sourceSchemaVersion");
  });

  it("keeps supported legacy migration persistence behind exact preview and approval IPC", async () => {
    const preview = {
      operation: "dicebox.project.migration.persist.preview",
      status: "PREVIEW",
      projectId: "dbx:project:legacy-campaign",
      authoritativeSource: "project.json",
      sourceSchemaVersion: "0.2.0",
      targetSchemaVersion: "0.3.0",
      generation: 1,
      nextGeneration: 2,
      persistedContentSha256: "a".repeat(64),
      resultingContentSha256: "b".repeat(64),
      scenes: [{ sceneId: "dbx:scene:legacy-main", sceneSha256: "c".repeat(64) }],
      activeSceneId: "dbx:scene:legacy-main",
      assetCount: 0,
      assetCollectionSha256: "d".repeat(64),
      semanticStateSha256: "e".repeat(64),
      actions: ["add-asset-registration-boundary-in-memory", "preserve-scenes-and-assets", "write-only-on-explicit-save"],
      primaryByteSha256: "f".repeat(64),
      protectedStateSha256: "1".repeat(64),
      assetTreeSha256: "2".repeat(64),
      previewSha256: "3".repeat(64),
      requiresApproval: true,
      noWrite: true,
      noFoundryWrite: true,
    } as const;
    invoke.mockResolvedValueOnce(preview);
    await expect(previewProjectMigrationPersist("Legacy Campaign")).resolves.toEqual(preview);
    expect(invoke).toHaveBeenLastCalledWith("preview_project_migration_persist", {
      request: { schemaVersion: "0.3.0", projectId: "dbx:project:legacy-campaign" },
    });

    invoke.mockResolvedValueOnce({ operation: "dicebox.project.migration.persist", status: "PASS" });
    await persistProjectMigration(preview);
    expect(invoke).toHaveBeenLastCalledWith("persist_project_migration", {
      request: {
        schemaVersion: "0.3.0",
        projectId: preview.projectId,
        sourceSchemaVersion: preview.sourceSchemaVersion,
        generation: preview.generation,
        persistedContentSha256: preview.persistedContentSha256,
        resultingContentSha256: preview.resultingContentSha256,
        previewSha256: preview.previewSha256,
        approved: true,
      },
    });

    await prepareLegacyMigrationPersistenceFixture();
    expect(invoke).toHaveBeenLastCalledWith("prepare_legacy_migration_persistence_fixture");
  });
});
