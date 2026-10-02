import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = resolve(import.meta.dirname, "..", "apps", "campaign-helper-desktop");

function readJson(path: string) {
  return JSON.parse(readFileSync(resolve(root, path), "utf8")) as Record<string, unknown>;
}

describe("Campaign Helper desktop shell configuration", () => {
  it("pins the desktop framework and renderer versions", () => {
    const manifest = readJson("package.json") as { dependencies: Record<string, string>; devDependencies: Record<string, string> };
    expect(manifest.dependencies).toMatchObject({
      "@tauri-apps/api": "2.11.1",
      "pixi.js": "8.20.0",
      "react": "19.2.8",
      "react-dom": "19.2.8",
    });
    expect(manifest.devDependencies).toMatchObject({ "@tauri-apps/cli": "2.11.4", "vite": "8.2.2" });
  });

  it("grants only the narrow core window capability and fixed geometry/project/AI IPC commands", () => {
    const capability = readJson("src-tauri/capabilities/main.json") as { windows: string[]; permissions: string[] };
    expect(capability.windows).toEqual(["main"]);
    expect(capability.permissions).toEqual(["core:default"]);

    const rustSource = readFileSync(resolve(root, "src-tauri", "src", "lib.rs"), "utf8");
    expect(rustSource.match(/#\[tauri::command\]/g)).toHaveLength(43);
    expect(rustSource).toContain("fn commit_geometry_batch(");
    expect(rustSource).toContain("fn create_project_bundle(");
    expect(rustSource).toContain("fn save_project_bundle(");
    expect(rustSource).toContain("fn save_project_as_bundle(");
    expect(rustSource).toContain("fn list_project_bundles(");
    expect(rustSource).toContain("fn load_project_bundle(");
    expect(rustSource).toContain("fn inspect_project_recovery(");
    expect(rustSource).toContain("fn preview_backup_authoritative_recovery(");
    expect(rustSource).toContain("fn promote_backup_authoritative_recovery(");
    expect(rustSource).toContain("fn prepare_pending_artifact_inspection_fixture(");
    expect(rustSource).toContain("fn prepare_dangling_background_reference_fixture(");
    expect(rustSource).toContain("fn prepare_selected_missing_background_recovery_fixture(");
    expect(rustSource).toContain("fn prepare_asset_restore_trace_fixture(");
    expect(rustSource).toContain("fn prepare_asset_restore_trace_fixture_v2(");
    expect(rustSource).toContain("fn prepare_asset_restore_trace_fixture_v3(");
    expect(rustSource).toContain("fn finish_project_self_test(");
    expect(rustSource).toContain("fn record_project_ui_self_test_progress(");
    expect(rustSource).toContain("fn explain_project_migration(");
    expect(rustSource).toContain("fn preview_project_migration_persist(");
    expect(rustSource).toContain("fn persist_project_migration(");
    expect(rustSource).toContain("fn prepare_legacy_migration_persistence_fixture(");
    expect(rustSource).toContain("fn prepare_backup_authoritative_recovery_promotion_fixture(");
    expect(rustSource).toContain("fn preview_missing_asset_restore(");
    expect(rustSource).toContain("fn restore_missing_asset(");
    expect(rustSource).toContain("fn preview_missing_asset_detach(");
    expect(rustSource).toContain("fn detach_missing_asset(");
    expect(rustSource).toContain("fn rename_project_bundle(");
    expect(rustSource).toContain("fn record_project_stage_receipt(");
    expect(rustSource).toContain("fn probe_codex_app_server(");
    expect(rustSource).toContain("fn campaign_director_credential_status(");
    expect(rustSource).toContain("fn set_campaign_director_api_key(");
    expect(rustSource).toContain("fn clear_campaign_director_api_key(");
    expect(rustSource).toContain("async fn request_campaign_director(");
    expect(rustSource).toContain("async fn request_campaign_director_managed(");
    expect(rustSource).toContain("async fn run_codex_technical_job(");
    expect(rustSource).toContain("commit_geometry_batch,");
    expect(rustSource).toContain("create_project_bundle,");
    expect(rustSource).toContain("save_project_bundle,");
    expect(rustSource).toContain("save_project_as_bundle,");
    expect(rustSource).toContain("list_project_bundles,");
    expect(rustSource).toContain("load_project_bundle,");
    expect(rustSource).toContain("inspect_project_recovery,");
    expect(rustSource).toContain("preview_backup_authoritative_recovery,");
    expect(rustSource).toContain("promote_backup_authoritative_recovery,");
    expect(rustSource).toContain("prepare_pending_artifact_inspection_fixture,");
    expect(rustSource).toContain("prepare_dangling_background_reference_fixture,");
    expect(rustSource).toContain("prepare_selected_missing_background_recovery_fixture,");
    expect(rustSource).toContain("prepare_asset_restore_trace_fixture,");
    expect(rustSource).toContain("prepare_asset_restore_trace_fixture_v2,");
    expect(rustSource).toContain("prepare_asset_restore_trace_fixture_v3,");
    expect(rustSource).toContain("finish_project_self_test,");
    expect(rustSource).toContain("record_project_ui_self_test_progress,");
    expect(rustSource).toContain("explain_project_migration,");
    expect(rustSource).toContain("preview_project_migration_persist,");
    expect(rustSource).toContain("persist_project_migration,");
    expect(rustSource).toContain("prepare_legacy_migration_persistence_fixture,");
    expect(rustSource).toContain("prepare_backup_authoritative_recovery_promotion_fixture,");
    expect(rustSource).toContain("preview_missing_asset_restore,");
    expect(rustSource).toContain("restore_missing_asset,");
    expect(rustSource).toContain("preview_missing_asset_detach,");
    expect(rustSource).toContain("detach_missing_asset,");
    expect(rustSource).toContain("rename_project_bundle,");
    expect(rustSource).toContain("record_project_stage_receipt,");
    expect(rustSource).toContain("probe_codex_app_server,");
    expect(rustSource).toContain("campaign_director_credential_status,");
    expect(rustSource).toContain("set_campaign_director_api_key,");
    expect(rustSource).toContain("clear_campaign_director_api_key,");
    expect(rustSource).toContain("request_campaign_director,");
    expect(rustSource).toContain("request_campaign_director_managed,");
    expect(rustSource).toContain("run_codex_technical_job,");
    expect(rustSource).toContain('join("node_modules/@openai/codex/bin/codex.js")');
    expect(rustSource).toContain('args(["app-server", "--stdio"])');
    expect(rustSource).not.toContain("plugin(");
  });

  it("exposes only one fixed Codex technical-job runner and keeps integration review-only", () => {
    const adapterSource = readFileSync(resolve(root, "src", "codex-account.ts"), "utf8");
    const appSource = readFileSync(resolve(root, "src", "App.tsx"), "utf8");
    const rustSource = readFileSync(resolve(root, "src-tauri", "src", "lib.rs"), "utf8");
    expect(adapterSource).toContain('invoke<CodexTechnicalJobReceipt>("run_codex_technical_job")');
    expect(appSource).toContain("Run isolated technical acceptance job");
    expect(appSource).toContain("integration still requires review");
    expect(rustSource).toContain('join("tools/run-codex-app-server-slice.mjs")');
    expect(rustSource).toContain('.arg("job")');
    expect(rustSource).not.toContain("technical_job(command");
  });

  it("keeps Campaign Director API transport in the native core and proposal application explicit", () => {
    const adapterSource = readFileSync(resolve(root, "src", "campaign-director.ts"), "utf8");
    const appSource = readFileSync(resolve(root, "src", "App.tsx"), "utf8");
    const rustSource = readFileSync(resolve(root, "src-tauri", "src", "lib.rs"), "utf8");
    expect(adapterSource).toContain('CAMPAIGN_DIRECTOR_COMMAND = "request_campaign_director"');
    expect(adapterSource).not.toContain("OPENAI_API_KEY");
    expect(appSource).toContain("reviewCampaignDirectorResponse");
    expect(appSource).toContain("Approve exact proposal");
    expect(appSource).toContain("Apply approved proposal");
    expect(appSource).toContain("prepareDesktopProposalApplication");
    expect(appSource).toContain("commitDesktopProposalSession");
    expect(appSource).toContain("authoritative Scene revision and serialized hash reread");
    expect(appSource).toContain("ChatGPT subscription (managed App Server)");
    expect(appSource).toContain('value="offline"');
    expect(rustSource).toContain('std::env::var("OPENAI_API_KEY")');
    expect(rustSource).toContain('post("https://api.openai.com/v1/responses")');
    expect(rustSource).toContain('Some("propose_scene_command")');
    expect(rustSource).not.toContain("println!(api_key");
    expect(rustSource).toContain('arg("--desktop")');
    expect(rustSource).toContain("no-write authority contract");
  });

  it("integrates project-bound Campaign Director history without placing secrets or project content in the conversation adapter", () => {
    const appSource = readFileSync(resolve(root, "src", "App.tsx"), "utf8");
    const conversationSource = readFileSync(resolve(root, "src", "campaign-director-conversation.ts"), "utf8");
    expect(appSource).toContain("Campaign Director conversation history");
    expect(appSource).toContain("Ask, inspect, preview, or request recovery");
    expect(appSource).toContain("Preview locally (no provider)");
    expect(appSource).toContain("cancelCampaignDirectorTurn");
    expect(appSource).toContain("Retry last blocked turn");
    expect(appSource).toContain("contextBudget.usedChars");
    expect(appSource).toContain("completeCampaignDirectorAnswer");
    expect(appSource).toContain("completeCampaignDirectorProposal");
    expect(conversationSource).toContain("parseCampaignDirectorConversation");
    expect(conversationSource).toContain("Refusing to persist a foreign Campaign Director conversation.");
    expect(conversationSource).toContain("projectContentWrite: false");
    expect(conversationSource).not.toContain("apiKey");
    expect(conversationSource).not.toContain("credential");
  });

  it("reads managed account, rate-limit, and usage metadata through an allowlisted no-write boundary", () => {
    const accountSource = readFileSync(resolve(root, "src", "codex-account.ts"), "utf8");
    const appSource = readFileSync(resolve(root, "src", "App.tsx"), "utf8");
    const rustSource = readFileSync(resolve(root, "src-tauri", "src", "lib.rs"), "utf8");
    expect(rustSource).toContain('"method":"account/read","id":1');
    expect(rustSource).toContain('"method":"account/rateLimits/read","id":2');
    expect(rustSource).toContain('"method":"account/usage/read","id":3');
    expect(rustSource).toContain("struct CodexRateLimitMetadata");
    expect(rustSource).toContain("struct CodexUsageMetadata");
    expect(rustSource).not.toContain("rateLimitResetCredits");
    expect(rustSource).not.toContain('["credits"]');
    expect(rustSource).not.toContain('["balance"]');
    expect(accountSource).toContain("rateLimitMetadata: CodexRateLimitMetadata | null");
    expect(accountSource).toContain("usageMetadata: CodexUsageMetadata | null");
    expect(appSource).toContain("managed ChatGPT uses subscription access; API key backup is separately billed and never selected automatically");
    expect(appSource).toContain("secrets not returned · no write");
  });

  it("stores the Campaign Director API key only through a fixed OS credential entry", () => {
    const adapterSource = readFileSync(resolve(root, "src", "campaign-director.ts"), "utf8");
    const appSource = readFileSync(resolve(root, "src", "App.tsx"), "utf8");
    const rustSource = readFileSync(resolve(root, "src-tauri", "src", "lib.rs"), "utf8");
    const cargo = readFileSync(resolve(root, "src-tauri", "Cargo.toml"), "utf8");
    expect(cargo).toContain('keyring = { version = "=4.1.5", default-features = false, features = ["v1", "windows-native-keyring-store"] }');
    expect(rustSource).toContain('CAMPAIGN_DIRECTOR_CREDENTIAL_SERVICE: &str = "com.dicebox.campaign-helper"');
    expect(rustSource).toContain('CAMPAIGN_DIRECTOR_CREDENTIAL_ACCOUNT: &str = "openai-api-key"');
    expect(rustSource).toContain(".set_password(trimmed)");
    expect(rustSource).toContain(".delete_credential()");
    expect(adapterSource).toContain('invoke<CampaignDirectorCredentialStatus>("set_campaign_director_api_key", { apiKey })');
    expect(appSource).toContain('type="password"');
    expect(appSource).toContain('autoComplete="new-password"');
    expect(appSource).toContain("secret not returned · no project write");
    expect(appSource).not.toContain("localStorage");
    expect(appSource).not.toContain("sessionStorage");
  });

  it("pins the Windows MSVC Rust toolchain", () => {
    const toolchain = readFileSync(resolve(root, "rust-toolchain.toml"), "utf8");
    expect(toolchain).toContain('channel = "1.98.0"');
    expect(toolchain).toContain('targets = ["x86_64-pc-windows-msvc"]');
  });

  it("resolves the pinned Cargo executable before Tauri build or dev", () => {
    const runner = readFileSync(resolve(root, "..", "..", "tools", "run-tauri-desktop.mjs"), "utf8");
    const packageManifest = JSON.parse(readFileSync(resolve(root, "..", "..", "package.json"), "utf8")) as { scripts: Record<string, string> };
    expect(runner).toContain('resolve(process.env.USERPROFILE, ".cargo")');
    expect(runner).toContain('process.platform === "win32" ? "cargo.exe" : "cargo"');
    expect(runner).toContain("PATH:");
    expect(runner).toContain('"--debug", "--no-bundle"');
    expect(packageManifest.scripts["desktop:tauri:build"]).toBe("node tools/run-tauri-desktop.mjs build");
    expect(packageManifest.scripts["desktop:tauri:dev"]).toBe("node tools/run-tauri-desktop.mjs dev");
  });

  it("keeps the desktop utility harness read-only and receipt-driven", () => {
    const appSource = readFileSync(resolve(root, "src", "App.tsx"), "utf8");
    expect(appSource).toContain("dicebox.desktop.utility-harness.inspect");
    expect(appSource).toContain("noWrite: true");
    expect(appSource).toContain("Run local checks");
    expect(appSource).not.toContain("invoke(");
  });

  it("keeps native geometry behind one fixed batched adapter", () => {
    const adapterSource = readFileSync(resolve(root, "src", "geometry-kernel.ts"), "utf8");
    const cargo = readFileSync(resolve(root, "src-tauri", "Cargo.toml"), "utf8");
    expect(adapterSource).toContain('GEOMETRY_COMMAND = "commit_geometry_batch"');
    expect(adapterSource.match(/invoke<GeometryBatchReceipt>/g)).toHaveLength(1);
    expect(adapterSource).toContain('kind: "apply-geometry-patches"');
    expect(cargo).toContain('dicebox-geometry = { path = "crates/dicebox-geometry" }');
  });

  it("keeps project content and subordinate workspace metadata in app-local storage behind fixed adapters", () => {
    const adapterSource = readFileSync(resolve(root, "src", "project-store.ts"), "utf8");
    const appSource = readFileSync(resolve(root, "src", "App.tsx"), "utf8");
    const rustSource = readFileSync(resolve(root, "src-tauri", "src", "lib.rs"), "utf8");
    const projectStoreSource = readFileSync(resolve(root, "src-tauri", "crates", "dicebox-project-store", "src", "lib.rs"), "utf8");
    const cargo = readFileSync(resolve(root, "src-tauri", "Cargo.toml"), "utf8");
    expect(adapterSource).toContain('invoke<ProjectSaveReceipt>("save_project_bundle"');
    expect(adapterSource).toContain('invoke<ProjectLoadResponse>("load_project_bundle"');
    expect(adapterSource).toContain('invoke<ProjectCatalogResponse>("list_project_bundles"');
    expect(adapterSource).toContain('invoke<ProjectSaveReceipt>("create_project_bundle"');
    expect(adapterSource).toContain('invoke<ProjectSaveReceipt>("save_project_as_bundle"');
    expect(adapterSource).toContain('invoke<WorkspaceMetadataReceipt>("rename_project_bundle"');
    expect(adapterSource).toContain('invoke<ProjectRecoveryInspectionReceipt>("inspect_project_recovery"');
    expect(adapterSource).toContain('artifactKind: "project-pending" | "workspace-index-pending"');
    expect(adapterSource).toContain('invoke<PendingArtifactFixtureReceipt>("prepare_pending_artifact_inspection_fixture")');
    expect(adapterSource).toContain('invoke<ProjectMigrationExplanationReceipt>("explain_project_migration"');
    expect(adapterSource).toContain('invoke<ProjectMigrationPersistPreviewReceipt>("preview_project_migration_persist"');
    expect(adapterSource).toContain('invoke<ProjectMigrationPersistReceipt>("persist_project_migration"');
    expect(adapterSource).toContain('invoke<LegacyMigrationPersistenceFixtureReceipt>("prepare_legacy_migration_persistence_fixture"');
    expect(appSource).toContain('VITE_DBX_PROJECT_SELF_TEST');
    expect(appSource).toContain('"workspace-acceptance", "workspace-acceptance-reread", "close-reopen", "close-reopen-reread", "handout-asset", "handout-asset-reread", "audio-asset", "audio-asset-reread", "token-asset", "token-asset-reread", "backup-promotion-setup", "backup-promotion-preview", "backup-promotion", "backup-promotion-reread", "pending-inspection-setup", "pending-inspection-reread"');
    expect(appSource).toContain('DiceBox Workspace Acceptance Restart PASS');
    expect(appSource).toContain('Close active project');
    expect(appSource).toContain('PROJECT_CLOSE_DIRTY');
    expect(appSource).toContain('memory-only close');
    expect(appSource).toContain('mode === "migration"');
    expect(appSource).toContain('DiceBox Migration Explanation PASS');
    expect(appSource).toContain('mode === "migration-persist-setup"');
    expect(appSource).toContain('mode === "migration-persist-reread"');
    expect(appSource).toContain('Approve migration proposal');
    expect(appSource).toContain('DiceBox Migration Persistence Restart PASS');
    expect(adapterSource).toContain('invoke<MissingAssetRestorePreviewReceipt>("preview_missing_asset_restore"');
    expect(adapterSource).toContain('invoke<MissingAssetRestoreReceipt>("restore_missing_asset"');
    expect(adapterSource).toContain('invoke<MissingAssetDetachPreviewReceipt>("preview_missing_asset_detach"');
    expect(adapterSource).toContain('invoke<MissingAssetDetachReceipt>("detach_missing_asset"');
    expect(adapterSource).toContain('invoke<BrokenReferenceDetachPreviewReceipt>("preview_broken_reference_detach"');
    expect(adapterSource).toContain('invoke<BrokenReferenceDetachReceipt>("detach_broken_reference"');
    expect(appSource).toContain('mode === "broken-reference-detach-setup"');
    expect(appSource).toContain('mode === "broken-reference-detach-reread"');
    expect(appSource).toContain("Apply approved exact-one binding detach");
    expect(appSource).toContain("Preview detach selected background");
    expect(appSource).toContain("Apply approved missing-background detach");
    expect(appSource).toContain("Owned staged pending artifacts are read-only recovery evidence");
    expect(appSource).toContain("DiceBox Pending Artifact Inspection Restart PASS");
    expect(appSource).toContain("registerAudioAsset");
    expect(appSource).toContain("project-audio-import");
    expect(appSource).toContain("DiceBox Audio Asset Restart PASS");
    expect(appSource).toContain("audio/wav");
    expect(appSource).toContain("registerTokenAsset");
    expect(appSource).toContain("project-token-import");
    expect(appSource).toContain("DiceBox Token Asset Restart PASS");
    expect(appSource).toContain('"token-asset", "token-asset-reread"');
    expect(adapterSource).toContain('invoke<BackupRecoveryPromotionPreviewReceipt>("preview_backup_authoritative_recovery"');
    expect(adapterSource).toContain('invoke<BackupRecoveryPromotionReceipt>("promote_backup_authoritative_recovery"');
    expect(appSource).toContain("Preview missing-primary backup promotion");
    expect(appSource).toContain("Apply approved backup promotion");
    expect(appSource).toContain("DiceBox Backup Promotion Restart PASS");
    expect(projectStoreSource).toContain("BACKUP_PROMOTION_PRIMARY_PRESENT");
    expect(projectStoreSource).toContain("BACKUP_PROMOTION_SCHEMA_UNSUPPORTED");
    expect(projectStoreSource).toContain("backup_authoritative_recovery_preview_sha256");
    expect(adapterSource).toContain('FOUNDATION_SELF_TEST_PROJECT_ID = "dbx:project:desktop-foundation-self-test"');
    expect(adapterSource).toContain("projectId: projectIdFromInput(projectId)");
    expect(adapterSource).not.toContain("filePath");
    expect(adapterSource).not.toContain("sourceSchemaVersion: sourceSchemaVersion");
    expect(rustSource).toContain("app.path()");
    expect(rustSource).toContain(".app_local_data_dir()");
    expect(rustSource).toContain("create_project_at(&root, request)");
    expect(rustSource).toContain("list_projects_at(&project_root(&app)?");
    expect(rustSource).toContain("save_project_as_at(&root, request)");
    expect(rustSource).toContain("touch_workspace_project_at(&root");
    expect(rustSource).toContain("rename_workspace_project_at(&project_root(&app)?");
    expect(projectStoreSource).toContain("fn inspect_owned_pending_artifacts(");
    expect(projectStoreSource).toContain('"audio/wav"');
    expect(projectStoreSource).toContain('"background" | "handout" | "audio" | "token"');
    expect(readFileSync(resolve(root, "..", "..", "packages", "dicebox-compiler", "src", "scene-foundry-preview.ts"), "utf8")).toContain('["background", "handout", "audio", "token"]');
    expect(projectStoreSource).toContain("recovery-required-after-reread");
    expect(cargo).toContain('dicebox-project-store = { path = "crates/dicebox-project-store" }');
  });

  it("uses a fixed-root advisory lease for every local project-store mutation without blocking reads", () => {
    const storeSource = readFileSync(resolve(root, "src-tauri", "crates", "dicebox-project-store", "src", "lib.rs"), "utf8");
    const storeCargo = readFileSync(resolve(root, "src-tauri", "crates", "dicebox-project-store", "Cargo.toml"), "utf8");
    const appSource = readFileSync(resolve(root, "src", "App.tsx"), "utf8");
    expect(storeCargo).toContain('fs2 = "0.4.3"');
    expect(storeSource).toContain('PROJECT_MUTATION_LEASE_FILE: &str = "dicebox-project-store.mutation.lock"');
    expect(storeSource).toContain("fn acquire_project_mutation_lease(");
    expect(storeSource).toContain("file.try_lock_exclusive()");
    expect(storeSource).toContain('"PROJECT_STORE_BUSY"');
    expect(storeSource).toContain('"after-holder-exit-and-reread"');
    expect(storeSource).toContain("let _lease = acquire_project_mutation_lease(root)?;");
    expect(storeSource).toContain("pub fn list_projects_at(root: &Path)");
    expect(storeSource).not.toContain("lock stealing");
    expect(appSource).toContain('"lease-attempt", "lease-retry"');
    expect(appSource).toContain("DiceBox Mutation Lease Held PASS");
    expect(appSource).toContain("DiceBox Mutation Lease Released Retry PASS");
  });

  it("keeps multi-Scene navigation collection-bound and background assets explicitly bound to the selected Scene", () => {
    const adapterSource = readFileSync(resolve(root, "src", "project-store.ts"), "utf8");
    const appSource = readFileSync(resolve(root, "src", "App.tsx"), "utf8");
    expect(adapterSource).toContain('schemaVersion: "0.3.0"');
    expect(adapterSource).toContain("scenesJson: serializeProjectScenes(scenes, activeSceneId)");
    expect(adapterSource).toContain("Project Scene IDs must be unique");
    expect(appSource).toContain('id="project-scenes"');
    expect(appSource).toContain("Preview blank Scene addition");
    expect(appSource).toContain("scene: document");
    expect(adapterSource).toContain("bindBackgroundAssetToScene");
    expect(adapterSource).toContain("dbx:asset:sha256-");
    expect(appSource).toContain('id="project-background-import"');
    expect(appSource).toContain('id="project-background-restore"');
    expect(appSource).toContain('id="project-recovery-asset"');
    expect(appSource).toContain("Choose exactly one eligible missing background");
    expect(appSource).toContain("Broken Scene background references are diagnostic-only evidence");
    expect(appSource).toContain('mode === "dangling-reference-setup"');
    expect(appSource).toContain('mode === "dangling-reference-reread"');
    expect(adapterSource).toContain("prepareDanglingBackgroundReferenceFixture");
    expect(appSource).toContain("Inspect recovery");
    expect(appSource).toContain("Apply approved exact-byte restore");
    expect(appSource).toContain("existing or tampered blobs are never overwritten");
    expect(appSource).toContain('"asset-reread", "recovery"');
    expect(appSource).toContain('if (mode === "recovery")');
    expect(appSource).toContain("await inspectProjectRecovery(projectId)");
    expect(appSource).toContain("await previewMissingAssetRestore(projectId");
    expect(appSource).toContain("await restoreMissingAsset(preview");
    expect(appSource).toContain("create-new-only · no project or Foundry write");
    expect(appSource).toContain('accept="image/png,image/webp"');
    expect(appSource).not.toContain("backgroundAssetSha256");
    expect(appSource).not.toContain('find((asset) => asset.mediaType === "image/png")');
    expect(appSource).not.toContain("Delete Scene");
    expect(appSource).not.toContain("Reorder Scene");
  });

  it("routes form, keyboard, and pointer edits through the shared command path", () => {
    const appSource = readFileSync(resolve(root, "src", "App.tsx"), "utf8");
    expect(appSource).toContain('kind: "translate-entity"');
    expect(appSource).toContain('onSubmit={applyPosition}');
    expect(appSource).toContain('event.key === "ArrowRight"');
    expect(appSource).toContain('aria-label="Preview moving selected object right"');
    expect(appSource).toContain("createHumanDesktopProposalSession");
    expect(appSource).toContain("Human movement preview persisted");
    expect(appSource).toContain("Scene content unchanged until explicit approval and Apply");
    expect(appSource).not.toContain("selected.x =");
    expect(appSource).not.toContain("document.entities =");
  });

  it("keeps the paired Pixi viewports from releasing shared renderer resources during teardown", () => {
    const viewportSource = readFileSync(resolve(root, "src", "SceneViewport.tsx"), "utf8");
    expect(viewportSource).toContain("nextApp.destroy(false, { children: true })");
    expect(viewportSource).toContain("app?.destroy(false, { children: true })");
    expect(viewportSource).not.toContain("destroy(true, { children: true })");
  });
});
