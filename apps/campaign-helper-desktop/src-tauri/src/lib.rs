use dicebox_geometry::{GeometryBatchReceipt, GeometryBatchRequest, GeometryFailure};
use dicebox_project_store::{
    create_project_at, detach_missing_asset_at, explain_project_migration_at,
    inspect_project_recovery_at, list_projects_at, load_project_at,
    promote_backup_authoritative_recovery_at,
    persist_project_migration_at, preview_project_migration_persist_at,
    preview_broken_reference_detach_at, preview_missing_asset_detach_at, preview_missing_asset_restore_at, rename_workspace_project_at,
    prepare_broken_reference_detach_fixture_at, prepare_broken_reference_ui_lifecycle_fixture_at,
    prepare_broken_reference_ui_lifecycle_fixture_v3_at,
    prepare_broken_reference_ui_lifecycle_fixture_v4_at,
    prepare_dangling_background_reference_fixture_at,
    prepare_pending_artifact_inspection_fixture_at,
    prepare_backup_authoritative_recovery_promotion_fixture_at,
    prepare_cross_producer_recovery_transition_at,
    prepare_legacy_migration_persistence_fixture_at,
    prepare_asset_detach_ui_lifecycle_fixture_at, prepare_asset_restore_trace_fixture_at,
    prepare_asset_restore_trace_fixture_v2_at,
    prepare_asset_restore_trace_fixture_v3_at,
    prepare_selected_missing_background_recovery_fixture_at,
    restore_missing_asset_at, save_project_as_at, save_project_at, touch_workspace_project_at,
    LoadProjectRequest, MissingAssetDetachPreviewReceipt, MissingAssetDetachPreviewRequest,
    MissingAssetDetachReceipt, MissingAssetDetachRequest, MissingAssetRestorePreviewReceipt,
    MissingAssetRestorePreviewRequest, MissingAssetRestoreReceipt, MissingAssetRestoreRequest,
    BrokenReferenceDetachPreviewReceipt, BrokenReferenceDetachPreviewRequest, BrokenReferenceDetachReceipt, BrokenReferenceDetachRequest,
    BrokenReferenceUiLifecycleFixtureReceipt,
    ProjectCatalogResponse, ProjectLoadResponse, ProjectMigrationExplanationReceipt,
    ProjectMigrationExplanationRequest, ProjectRecoveryInspectionReceipt,
    ProjectMigrationPersistPreviewReceipt, ProjectMigrationPersistPreviewRequest,
    ProjectMigrationPersistReceipt, ProjectMigrationPersistRequest,
    BackupRecoveryPromotionPreviewReceipt, BackupRecoveryPromotionPreviewRequest,
    BackupRecoveryPromotionReceipt, BackupRecoveryPromotionRequest,
    ProjectRecoveryInspectionRequest, ProjectSaveReceipt, ProjectStoreFailure,
    DanglingBackgroundReferenceFixtureReceipt, PendingArtifactFixtureReceipt,
    BrokenReferenceDetachFixtureReceipt,
    LegacyMigrationPersistenceFixtureReceipt,
    BackupAuthoritativeRecoveryPromotionFixtureReceipt,
    CrossProducerRecoveryTransitionReceipt,
    SelectedMissingBackgroundFixtureReceipt,
    RenameProjectRequest, SaveProjectAsRequest, SaveProjectRequest, WorkspaceMetadataReceipt,
};
use serde::{Deserialize, Serialize};
use serde_json::Value;
use std::io::Write;
#[cfg(windows)]
use std::os::windows::process::CommandExt;
use std::process::{Command, Stdio};
use std::time::Duration;
use tauri::Manager;

const CAMPAIGN_DIRECTOR_CREDENTIAL_SERVICE: &str = "com.dicebox.campaign-helper";
const CAMPAIGN_DIRECTOR_CREDENTIAL_ACCOUNT: &str = "openai-api-key";

#[tauri::command]
fn commit_geometry_batch(
    request: GeometryBatchRequest,
) -> Result<GeometryBatchReceipt, GeometryFailure> {
    let result = dicebox_geometry::commit_geometry_batch(request);
    match &result {
        Ok(receipt) => {
            let first_patch = receipt.patches.first();
            println!(
                "DBX_GEOMETRY_RECEIPT status=PASS document={} beforeRevision={} afterRevision={} entities={} patches={} firstEntity={} beforeX={} afterX={} noWrite={}",
                receipt.document_id,
                receipt.before_revision,
                receipt.after_revision,
                receipt.stats.entity_count,
                receipt.patches.len(),
                first_patch.map(|patch| patch.entity_id.as_str()).unwrap_or("none"),
                first_patch.map(|patch| patch.before.x).unwrap_or_default(),
                first_patch.map(|patch| patch.after.x).unwrap_or_default(),
                receipt.no_write,
            );
        }
        Err(failure) => println!(
            "DBX_GEOMETRY_RECEIPT status=BLOCKED code={} noWrite={}",
            failure.code, failure.no_write
        ),
    }
    result
}

fn project_root(app: &tauri::AppHandle) -> Result<std::path::PathBuf, ProjectStoreFailure> {
    app.path()
        .app_local_data_dir()
        .map_err(|error| ProjectStoreFailure {
            code: "PROJECT_ROOT_UNAVAILABLE".to_string(),
            message: format!("Application data directory is unavailable: {error}"),
            retry: "after-reread".to_string(),
            no_foundry_write: true,
        })
}

#[tauri::command]
fn save_project_bundle(
    app: tauri::AppHandle,
    request: SaveProjectRequest,
) -> Result<ProjectSaveReceipt, ProjectStoreFailure> {
    let result = save_project_at(&project_root(&app)?, request);
    if let Err(error) = &result {
        println!(
            "DBX_PROJECT_RECEIPT operation=save status=BLOCKED code={} retry={} noFoundryWrite={}",
            error.code, error.retry, error.no_foundry_write,
        );
    }
    let receipt = result?;
    println!(
        "DBX_PROJECT_RECEIPT operation=save status={} project={} generation={} contentSha256={} assets={} atomic={} backup={} noFoundryWrite={}",
        receipt.status,
        receipt.project_id,
        receipt.generation,
        receipt.content_sha256,
        receipt.asset_count,
        receipt.atomic_replace,
        receipt.backup_preserved,
        receipt.no_foundry_write,
    );
    Ok(receipt)
}

#[tauri::command]
fn create_project_bundle(
    app: tauri::AppHandle,
    request: SaveProjectRequest,
) -> Result<ProjectSaveReceipt, ProjectStoreFailure> {
    let root = project_root(&app)?;
    let project_id = request.project_id.clone();
    let expected_workspace_generation = request.expected_workspace_generation;
    let display_name = request.workspace_display_name.clone();
    let result = create_project_at(&root, request);
    if let Err(error) = &result {
        println!(
            "DBX_PROJECT_RECEIPT operation=create status=BLOCKED code={} retry={} noFoundryWrite={}",
            error.code, error.retry, error.no_foundry_write,
        );
    }
    let mut receipt = result?;
    if let Some(expected_generation) = expected_workspace_generation {
        match touch_workspace_project_at(
            &root,
            &project_id,
            display_name.as_deref(),
            expected_generation,
        ) {
            Ok(metadata) => receipt.workspace_metadata = Some(metadata),
            Err(error) => receipt.workspace_metadata_warning = Some(error.code),
        }
    }
    println!(
        "DBX_PROJECT_RECEIPT operation=create status={} project={} generation={} contentSha256={} assets={} noFoundryWrite={}",
        receipt.status,
        receipt.project_id,
        receipt.generation,
        receipt.content_sha256,
        receipt.asset_count,
        receipt.no_foundry_write,
    );
    Ok(receipt)
}

#[tauri::command]
fn save_project_as_bundle(
    app: tauri::AppHandle,
    request: SaveProjectAsRequest,
) -> Result<ProjectSaveReceipt, ProjectStoreFailure> {
    let root = project_root(&app)?;
    let target_project_id = request.target_project_id.clone();
    let expected_workspace_generation = request.expected_workspace_generation;
    let display_name = request.workspace_display_name.clone();
    let result = save_project_as_at(&root, request);
    if let Err(error) = &result {
        println!(
            "DBX_PROJECT_RECEIPT operation=save-as status=BLOCKED code={} retry={} noFoundryWrite={}",
            error.code, error.retry, error.no_foundry_write,
        );
    }
    let mut receipt = result?;
    if let Some(expected_generation) = expected_workspace_generation {
        match touch_workspace_project_at(
            &root,
            &target_project_id,
            display_name.as_deref(),
            expected_generation,
        ) {
            Ok(metadata) => receipt.workspace_metadata = Some(metadata),
            Err(error) => receipt.workspace_metadata_warning = Some(error.code),
        }
    }
    println!(
        "DBX_PROJECT_RECEIPT operation=save-as status={} project={} generation={} contentSha256={} assets={} sourcePreserved=true noFoundryWrite={}",
        receipt.status,
        receipt.project_id,
        receipt.generation,
        receipt.content_sha256,
        receipt.asset_count,
        receipt.no_foundry_write,
    );
    Ok(receipt)
}

#[tauri::command]
fn list_project_bundles(
    app: tauri::AppHandle,
) -> Result<ProjectCatalogResponse, ProjectStoreFailure> {
    let response = list_projects_at(&project_root(&app)?)?;
    println!(
        "DBX_PROJECT_RECEIPT operation=catalog status={} entries={} blocked={} noWrite={} noFoundryWrite={}",
        response.status,
        response.entries.len(),
        response.entries.iter().filter(|entry| entry.status == "BLOCKED").count(),
        response.no_write,
        response.no_foundry_write,
    );
    Ok(response)
}

#[tauri::command]
fn inspect_project_recovery(
    app: tauri::AppHandle,
    request: ProjectRecoveryInspectionRequest,
) -> Result<ProjectRecoveryInspectionReceipt, ProjectStoreFailure> {
    let receipt = inspect_project_recovery_at(&project_root(&app)?, request)?;
    println!(
        "DBX_PROJECT_RECOVERY operation=inspect status={} project={} blocker={} eligible={} assets={} pendingArtifacts={} noWrite={} noFoundryWrite={}",
        receipt.status,
        receipt.project_id,
        receipt.blocker_code.as_deref().unwrap_or("none"),
        receipt.restore_eligible,
        receipt.registered_assets.len(),
        receipt.pending_artifacts.len(),
        receipt.no_write,
        receipt.no_foundry_write,
    );
    Ok(receipt)
}

#[cfg(debug_assertions)]
#[tauri::command]
fn prepare_pending_artifact_inspection_fixture(
    app: tauri::AppHandle,
) -> Result<PendingArtifactFixtureReceipt, ProjectStoreFailure> {
    let receipt = prepare_pending_artifact_inspection_fixture_at(&project_root(&app)?);
    if let Err(error) = &receipt {
        println!(
            "DBX_PROJECT_PENDING_FIXTURE status=BLOCKED code={} retry={} noFoundryWrite={}",
            error.code, error.retry, error.no_foundry_write,
        );
    }
    let receipt = receipt?;
    println!(
        "DBX_PROJECT_PENDING_FIXTURE status={} project={} projectPending={} workspacePending={} malformedPending={} noFoundryWrite={}",
        receipt.status,
        receipt.project_id,
        receipt.project_pending_relative_path,
        receipt.workspace_pending_relative_path,
        receipt.malformed_pending_relative_path,
        receipt.no_foundry_write,
    );
    Ok(receipt)
}

#[cfg(debug_assertions)]
#[tauri::command]
fn prepare_dangling_background_reference_fixture(
    app: tauri::AppHandle,
) -> Result<DanglingBackgroundReferenceFixtureReceipt, ProjectStoreFailure> {
    let receipt = prepare_dangling_background_reference_fixture_at(&project_root(&app)?);
    if let Err(error) = &receipt {
        println!(
            "DBX_PROJECT_DANGLING_REFERENCE_FIXTURE status=BLOCKED code={} retry={} noFoundryWrite={}",
            error.code, error.retry, error.no_foundry_write,
        );
    }
    let receipt = receipt?;
    println!(
        "DBX_PROJECT_DANGLING_REFERENCE_FIXTURE status={} project={} scenes={} assets={} noFoundryWrite={}",
        receipt.status,
        receipt.project_id,
        receipt.scene_ids.len(),
        receipt.asset_ids.len(),
        receipt.no_foundry_write,
    );
    Ok(receipt)
}

#[cfg(debug_assertions)]
#[tauri::command]
fn prepare_broken_reference_detach_fixture(
    app: tauri::AppHandle,
) -> Result<BrokenReferenceDetachFixtureReceipt, ProjectStoreFailure> {
    let receipt = prepare_broken_reference_detach_fixture_at(&project_root(&app)?);
    if let Err(error) = &receipt {
        println!(
            "DBX_PROJECT_BROKEN_REFERENCE_FIXTURE status=BLOCKED code={} retry={} noFoundryWrite={}",
            error.code, error.retry, error.no_foundry_write,
        );
    }
    let receipt = receipt?;
    println!(
        "DBX_PROJECT_BROKEN_REFERENCE_FIXTURE status={} project={} targetAsset={} scenes={} noFoundryWrite={}",
        receipt.status, receipt.project_id, receipt.asset_id, receipt.scene_ids.len(), receipt.no_foundry_write,
    );
    Ok(receipt)
}

#[cfg(debug_assertions)]
#[tauri::command]
fn prepare_broken_reference_ui_lifecycle_fixture(
    app: tauri::AppHandle,
) -> Result<BrokenReferenceUiLifecycleFixtureReceipt, ProjectStoreFailure> {
    let receipt = prepare_broken_reference_ui_lifecycle_fixture_at(&project_root(&app)?);
    if let Err(error) = &receipt {
        println!(
            "DBX_PROJECT_BROKEN_REFERENCE_UI_LIFECYCLE_FIXTURE status=BLOCKED code={} retry={} noFoundryWrite={}",
            error.code, error.retry, error.no_foundry_write,
        );
    }
    let receipt = receipt?;
    println!(
        "DBX_PROJECT_BROKEN_REFERENCE_UI_LIFECYCLE_FIXTURE status={} project={} targetAsset={} scenes={} noFoundryWrite={}",
        receipt.status, receipt.project_id, receipt.asset_id, receipt.scene_ids.len(), receipt.no_foundry_write,
    );
    Ok(receipt)
}

#[cfg(debug_assertions)]
#[tauri::command]
fn prepare_broken_reference_ui_lifecycle_fixture_v3(
    app: tauri::AppHandle,
) -> Result<BrokenReferenceUiLifecycleFixtureReceipt, ProjectStoreFailure> {
    let receipt = prepare_broken_reference_ui_lifecycle_fixture_v3_at(&project_root(&app)?);
    if let Err(error) = &receipt {
        println!(
            "DBX_PROJECT_BROKEN_REFERENCE_UI_LIFECYCLE_FIXTURE_V3 status=BLOCKED code={} retry={} noFoundryWrite={}",
            error.code, error.retry, error.no_foundry_write,
        );
    }
    let receipt = receipt?;
    println!(
        "DBX_PROJECT_BROKEN_REFERENCE_UI_LIFECYCLE_FIXTURE_V3 status={} project={} targetAsset={} scenes={} noFoundryWrite={}",
        receipt.status, receipt.project_id, receipt.asset_id, receipt.scene_ids.len(), receipt.no_foundry_write,
    );
    Ok(receipt)
}

#[cfg(debug_assertions)]
#[tauri::command]
fn prepare_broken_reference_ui_lifecycle_fixture_v4(
    app: tauri::AppHandle,
) -> Result<BrokenReferenceUiLifecycleFixtureReceipt, ProjectStoreFailure> {
    let receipt = prepare_broken_reference_ui_lifecycle_fixture_v4_at(&project_root(&app)?);
    if let Err(error) = &receipt {
        println!(
            "DBX_PROJECT_BROKEN_REFERENCE_UI_LIFECYCLE_FIXTURE_V4 status=BLOCKED code={} retry={} noFoundryWrite={}",
            error.code, error.retry, error.no_foundry_write,
        );
    }
    let receipt = receipt?;
    println!(
        "DBX_PROJECT_BROKEN_REFERENCE_UI_LIFECYCLE_FIXTURE_V4 status={} project={} targetAsset={} scenes={} noFoundryWrite={}",
        receipt.status, receipt.project_id, receipt.asset_id, receipt.scene_ids.len(), receipt.no_foundry_write,
    );
    Ok(receipt)
}

#[cfg(debug_assertions)]
#[tauri::command]
fn prepare_selected_missing_background_recovery_fixture(
    app: tauri::AppHandle,
) -> Result<SelectedMissingBackgroundFixtureReceipt, ProjectStoreFailure> {
    let receipt = prepare_selected_missing_background_recovery_fixture_at(&project_root(&app)?);
    if let Err(error) = &receipt {
        println!(
            "DBX_PROJECT_SELECTED_RECOVERY_FIXTURE status=BLOCKED code={} retry={} noFoundryWrite={}",
            error.code, error.retry, error.no_foundry_write,
        );
    }
    let receipt = receipt?;
    println!(
        "DBX_PROJECT_SELECTED_RECOVERY_FIXTURE status={} project={} assets={} scenes={} generation={} noFoundryWrite={}",
        receipt.status,
        receipt.project_id,
        receipt.asset_ids.len(),
        receipt.scene_ids.len(),
        receipt.generation,
        receipt.no_foundry_write,
    );
    Ok(receipt)
}

#[cfg(debug_assertions)]
#[tauri::command]
fn prepare_asset_restore_trace_fixture(
    app: tauri::AppHandle,
) -> Result<SelectedMissingBackgroundFixtureReceipt, ProjectStoreFailure> {
    let receipt = prepare_asset_restore_trace_fixture_at(&project_root(&app)?);
    if let Err(error) = &receipt {
        println!(
            "DBX_PROJECT_ASSET_RESTORE_TRACE_FIXTURE status=BLOCKED code={} retry={} noFoundryWrite={}",
            error.code, error.retry, error.no_foundry_write,
        );
    }
    let receipt = receipt?;
    println!(
        "DBX_PROJECT_ASSET_RESTORE_TRACE_FIXTURE status={} project={} assets={} scenes={} generation={} noFoundryWrite={}",
        receipt.status,
        receipt.project_id,
        receipt.asset_ids.len(),
        receipt.scene_ids.len(),
        receipt.generation,
        receipt.no_foundry_write,
    );
    Ok(receipt)
}

#[cfg(debug_assertions)]
#[tauri::command]
fn prepare_asset_restore_trace_fixture_v2(
    app: tauri::AppHandle,
) -> Result<SelectedMissingBackgroundFixtureReceipt, ProjectStoreFailure> {
    let receipt = prepare_asset_restore_trace_fixture_v2_at(&project_root(&app)?);
    if let Err(error) = &receipt {
        println!(
            "DBX_PROJECT_ASSET_RESTORE_TRACE_FIXTURE_V2 status=BLOCKED code={} retry={} noFoundryWrite={}",
            error.code, error.retry, error.no_foundry_write,
        );
    }
    let receipt = receipt?;
    println!(
        "DBX_PROJECT_ASSET_RESTORE_TRACE_FIXTURE_V2 status={} project={} assets={} scenes={} generation={} noFoundryWrite={}",
        receipt.status,
        receipt.project_id,
        receipt.asset_ids.len(),
        receipt.scene_ids.len(),
        receipt.generation,
        receipt.no_foundry_write,
    );
    Ok(receipt)
}

#[cfg(debug_assertions)]
#[tauri::command]
fn prepare_asset_restore_trace_fixture_v3(
    app: tauri::AppHandle,
) -> Result<SelectedMissingBackgroundFixtureReceipt, ProjectStoreFailure> {
    let receipt = prepare_asset_restore_trace_fixture_v3_at(&project_root(&app)?);
    if let Err(error) = &receipt {
        println!(
            "DBX_PROJECT_ASSET_RESTORE_TRACE_FIXTURE_V3 status=BLOCKED code={} retry={} noFoundryWrite={}",
            error.code, error.retry, error.no_foundry_write,
        );
    }
    let receipt = receipt?;
    println!(
        "DBX_PROJECT_ASSET_RESTORE_TRACE_FIXTURE_V3 status={} project={} assets={} scenes={} generation={} noFoundryWrite={}",
        receipt.status,
        receipt.project_id,
        receipt.asset_ids.len(),
        receipt.scene_ids.len(),
        receipt.generation,
        receipt.no_foundry_write,
    );
    Ok(receipt)
}

#[cfg(debug_assertions)]
#[tauri::command]
fn prepare_asset_detach_ui_lifecycle_fixture(
    app: tauri::AppHandle,
) -> Result<SelectedMissingBackgroundFixtureReceipt, ProjectStoreFailure> {
    let receipt = prepare_asset_detach_ui_lifecycle_fixture_at(&project_root(&app)?);
    if let Err(error) = &receipt {
        println!(
            "DBX_PROJECT_ASSET_DETACH_UI_LIFECYCLE_FIXTURE status=BLOCKED code={} retry={} noFoundryWrite={}",
            error.code, error.retry, error.no_foundry_write,
        );
    }
    let receipt = receipt?;
    println!(
        "DBX_PROJECT_ASSET_DETACH_UI_LIFECYCLE_FIXTURE status={} project={} assets={} scenes={} generation={} noFoundryWrite={}",
        receipt.status, receipt.project_id, receipt.asset_ids.len(), receipt.scene_ids.len(), receipt.generation, receipt.no_foundry_write,
    );
    Ok(receipt)
}

#[tauri::command]
fn explain_project_migration(
    app: tauri::AppHandle,
    request: ProjectMigrationExplanationRequest,
) -> Result<ProjectMigrationExplanationReceipt, ProjectStoreFailure> {
    let receipt = explain_project_migration_at(&project_root(&app)?, request)?;
    println!(
        "DBX_PROJECT_MIGRATION operation=explain status={} project={} source={} sourceSchema={} targetSchema={} migration={} actions={} blockers={} retry={} noWrite={} noFoundryWrite={}",
        receipt.status,
        receipt.project_id,
        receipt.authoritative_source.as_deref().unwrap_or("none"),
        receipt.source_schema_version.as_deref().unwrap_or("unknown"),
        receipt.target_schema_version,
        receipt.migration_status.as_deref().unwrap_or("blocked"),
        receipt.actions.len(),
        receipt.blockers.len(),
        receipt.retry,
        receipt.no_write,
        receipt.no_foundry_write,
    );
    Ok(receipt)
}

#[tauri::command]
fn preview_backup_authoritative_recovery(
    app: tauri::AppHandle,
    request: BackupRecoveryPromotionPreviewRequest,
) -> Result<BackupRecoveryPromotionPreviewReceipt, ProjectStoreFailure> {
    let result = dicebox_project_store::preview_backup_authoritative_recovery_at(
        &project_root(&app)?,
        request,
    );
    if let Err(error) = &result {
        println!(
            "DBX_PROJECT_RECOVERY operation=backup-promotion-preview status=BLOCKED code={} retry={} noFoundryWrite={}",
            error.code, error.retry, error.no_foundry_write,
        );
    }
    let receipt = result?;
    println!(
        "DBX_PROJECT_RECOVERY operation=backup-promotion-preview status={} project={} generation={} content={} backupSha256={} previewSha256={} noWrite={} noFoundryWrite={}",
        receipt.status,
        receipt.project_id,
        receipt.generation,
        receipt.content_sha256,
        receipt.backup_byte_sha256,
        receipt.preview_sha256,
        receipt.no_write,
        receipt.no_foundry_write,
    );
    Ok(receipt)
}

#[tauri::command]
fn promote_backup_authoritative_recovery(
    app: tauri::AppHandle,
    request: BackupRecoveryPromotionRequest,
) -> Result<BackupRecoveryPromotionReceipt, ProjectStoreFailure> {
    let result = promote_backup_authoritative_recovery_at(&project_root(&app)?, request);
    if let Err(error) = &result {
        println!(
            "DBX_PROJECT_RECOVERY operation=backup-promotion status=BLOCKED code={} retry={} noFoundryWrite={}",
            error.code, error.retry, error.no_foundry_write,
        );
    }
    let receipt = result?;
    println!(
        "DBX_PROJECT_RECOVERY operation=backup-promotion status={} project={} generation={} content={} primaryRestored={} backupUnchanged={} authoritativeReread={} noFoundryWrite={}",
        receipt.status,
        receipt.project_id,
        receipt.generation,
        receipt.content_sha256,
        receipt.primary_restored,
        receipt.backup_unchanged,
        receipt.authoritative_current_reread,
        receipt.no_foundry_write,
    );
    Ok(receipt)
}

#[tauri::command]
fn preview_project_migration_persist(
    app: tauri::AppHandle,
    request: ProjectMigrationPersistPreviewRequest,
) -> Result<ProjectMigrationPersistPreviewReceipt, ProjectStoreFailure> {
    let result = preview_project_migration_persist_at(&project_root(&app)?, request);
    if let Err(error) = &result {
        println!(
            "DBX_PROJECT_MIGRATION operation=persist-preview status=BLOCKED code={} retry={} noFoundryWrite={}",
            error.code, error.retry, error.no_foundry_write,
        );
    }
    let receipt = result?;
    println!(
        "DBX_PROJECT_MIGRATION operation=persist-preview status={} project={} sourceSchema={} targetSchema={} generation={} nextGeneration={} persistedContent={} resultingContent={} previewSha256={} noWrite={} noFoundryWrite={}",
        receipt.status,
        receipt.project_id,
        receipt.source_schema_version,
        receipt.target_schema_version,
        receipt.generation,
        receipt.next_generation,
        receipt.persisted_content_sha256,
        receipt.resulting_content_sha256,
        receipt.preview_sha256,
        receipt.no_write,
        receipt.no_foundry_write,
    );
    Ok(receipt)
}

#[tauri::command]
fn persist_project_migration(
    app: tauri::AppHandle,
    request: ProjectMigrationPersistRequest,
) -> Result<ProjectMigrationPersistReceipt, ProjectStoreFailure> {
    let result = persist_project_migration_at(&project_root(&app)?, request);
    if let Err(error) = &result {
        println!(
            "DBX_PROJECT_MIGRATION operation=persist status=BLOCKED code={} retry={} noFoundryWrite={}",
            error.code, error.retry, error.no_foundry_write,
        );
    }
    let receipt = result?;
    println!(
        "DBX_PROJECT_MIGRATION operation=persist status={} project={} sourceSchema={} targetSchema={} generation={} previousGeneration={} content={} backupPreserved={} semanticUnchanged={} authoritativeReread={} noFoundryWrite={}",
        receipt.status,
        receipt.project_id,
        receipt.source_schema_version,
        receipt.target_schema_version,
        receipt.generation,
        receipt.previous_generation,
        receipt.content_sha256,
        receipt.backup_preserves_legacy_primary,
        receipt.semantic_state_unchanged,
        receipt.authoritative_current_reread,
        receipt.no_foundry_write,
    );
    Ok(receipt)
}

#[cfg(debug_assertions)]
#[tauri::command]
fn prepare_legacy_migration_persistence_fixture(
    app: tauri::AppHandle,
) -> Result<LegacyMigrationPersistenceFixtureReceipt, ProjectStoreFailure> {
    let receipt = prepare_legacy_migration_persistence_fixture_at(&project_root(&app)?)?;
    println!(
        "DBX_PROJECT_MIGRATION operation=fixture status={} project={} sourceSchema={} generation={} persistedContent={} scenes={} noFoundryWrite={}",
        receipt.status,
        receipt.project_id,
        receipt.source_schema_version,
        receipt.generation,
        receipt.persisted_content_sha256,
        receipt.scene_ids.len(),
        receipt.no_foundry_write,
    );
    Ok(receipt)
}

#[cfg(debug_assertions)]
#[tauri::command]
fn prepare_backup_authoritative_recovery_promotion_fixture(
    app: tauri::AppHandle,
) -> Result<BackupAuthoritativeRecoveryPromotionFixtureReceipt, ProjectStoreFailure> {
    let receipt = prepare_backup_authoritative_recovery_promotion_fixture_at(&project_root(&app)?)?;
    println!(
        "DBX_PROJECT_RECOVERY operation=backup-promotion-fixture status={} project={} generation={} content={} backupSha256={} noFoundryWrite={}",
        receipt.status,
        receipt.project_id,
        receipt.generation,
        receipt.content_sha256,
        receipt.backup_byte_sha256,
        receipt.no_foundry_write,
    );
    Ok(receipt)
}

#[cfg(debug_assertions)]
#[tauri::command]
fn prepare_cross_producer_recovery_transition(
    app: tauri::AppHandle,
    project_id: String,
    expected_generation: u64,
    expected_content_sha256: String,
) -> Result<CrossProducerRecoveryTransitionReceipt, ProjectStoreFailure> {
    let receipt = prepare_cross_producer_recovery_transition_at(
        &project_root(&app)?,
        &project_id,
        expected_generation,
        &expected_content_sha256,
    )?;
    println!(
        "DBX_PROJECT_RECOVERY operation=cross-producer-transition status={} project={} beforeGeneration={} committedGeneration={} backupGeneration={} content={} backupSha256={} foreignSha256={} primaryRemoved={} noFoundryWrite={}",
        receipt.status,
        receipt.project_id,
        receipt.before_generation,
        receipt.committed_generation,
        receipt.backup_generation,
        receipt.content_sha256,
        receipt.backup_byte_sha256,
        receipt.foreign_state_sha256,
        receipt.primary_removed,
        receipt.no_foundry_write,
    );
    Ok(receipt)
}

#[tauri::command]
fn preview_missing_asset_restore(
    app: tauri::AppHandle,
    request: MissingAssetRestorePreviewRequest,
) -> Result<MissingAssetRestorePreviewReceipt, ProjectStoreFailure> {
    let result = preview_missing_asset_restore_at(&project_root(&app)?, request);
    if let Err(error) = &result {
        println!(
            "DBX_PROJECT_RECOVERY operation=preview status=BLOCKED code={} retry={}",
            error.code, error.retry,
        );
    }
    let receipt = result?;
    println!(
        "DBX_PROJECT_RECOVERY operation=preview status={} project={} generation={} asset={} candidateSha256={} previewSha256={} noWrite={} noFoundryWrite={}",
        receipt.status,
        receipt.project_id,
        receipt.generation,
        receipt.asset_id,
        receipt.candidate_sha256,
        receipt.preview_sha256,
        receipt.no_write,
        receipt.no_foundry_write,
    );
    Ok(receipt)
}

#[tauri::command]
fn restore_missing_asset(
    app: tauri::AppHandle,
    request: MissingAssetRestoreRequest,
) -> Result<MissingAssetRestoreReceipt, ProjectStoreFailure> {
    let result = restore_missing_asset_at(&project_root(&app)?, request);
    if let Err(error) = &result {
        println!(
            "DBX_PROJECT_RECOVERY operation=restore status=BLOCKED code={} retry={}",
            error.code, error.retry,
        );
    }
    let receipt = result?;
    println!(
        "DBX_PROJECT_RECOVERY operation=restore status={} project={} generation={} asset={} authoritativeSha256={} previewSha256={} envelopeUnchanged={} projectStateUnchanged={} scenesUnchanged={} workspaceUnchanged={} backupsUnchanged={} foreignUnchanged={} createNewOnly={} noProjectWrite={} noFoundryWrite={}",
        receipt.status,
        receipt.project_id,
        receipt.generation,
        receipt.asset_id,
        receipt.authoritative_asset_sha256,
        receipt.preview_sha256,
        receipt.envelope_unchanged,
        receipt.project_state_unchanged,
        receipt.scenes_unchanged,
        receipt.workspace_unchanged,
        receipt.backups_unchanged,
        receipt.foreign_state_unchanged,
        receipt.create_new_only,
        receipt.no_project_write,
        receipt.no_foundry_write,
    );
    Ok(receipt)
}

#[tauri::command]
fn preview_missing_asset_detach(
    app: tauri::AppHandle,
    request: MissingAssetDetachPreviewRequest,
) -> Result<MissingAssetDetachPreviewReceipt, ProjectStoreFailure> {
    let result = preview_missing_asset_detach_at(&project_root(&app)?, request);
    if let Err(error) = &result {
        println!(
            "DBX_PROJECT_RECOVERY operation=detach-preview status=BLOCKED code={} retry={}",
            error.code, error.retry,
        );
    }
    let receipt = result?;
    println!(
        "DBX_PROJECT_RECOVERY operation=detach-preview status={} project={} generation={} nextGeneration={} asset={} affectedScenes={} resultingContentSha256={} previewSha256={} noWrite={} noFoundryWrite={}",
        receipt.status,
        receipt.project_id,
        receipt.generation,
        receipt.next_generation,
        receipt.asset_id,
        receipt.affected_scenes.len(),
        receipt.resulting_content_sha256,
        receipt.preview_sha256,
        receipt.no_write,
        receipt.no_foundry_write,
    );
    Ok(receipt)
}

#[tauri::command]
fn detach_missing_asset(
    app: tauri::AppHandle,
    request: MissingAssetDetachRequest,
) -> Result<MissingAssetDetachReceipt, ProjectStoreFailure> {
    let result = detach_missing_asset_at(&project_root(&app)?, request);
    if let Err(error) = &result {
        println!(
            "DBX_PROJECT_RECOVERY operation=detach status=BLOCKED code={} retry={}",
            error.code, error.retry,
        );
    }
    let receipt = result?;
    println!(
        "DBX_PROJECT_RECOVERY operation=detach status={} project={} previousGeneration={} generation={} asset={} affectedScenes={} descriptorRemoved={} assetTreeUnchanged={} workspaceUnchanged={} foreignUnchanged={} backupPreserved={} targetAbsent={} authoritativeReload={} previewSha256={} noFoundryWrite={}",
        receipt.status,
        receipt.project_id,
        receipt.previous_generation,
        receipt.generation,
        receipt.asset_id,
        receipt.affected_scenes.len(),
        receipt.descriptor_removed,
        receipt.asset_tree_unchanged,
        receipt.workspace_unchanged,
        receipt.foreign_state_unchanged,
        receipt.backup_preserves_prior_envelope,
        receipt.target_remains_absent,
        receipt.authoritative_reload,
        receipt.preview_sha256,
        receipt.no_foundry_write,
    );
    Ok(receipt)
}

#[tauri::command]
fn preview_broken_reference_detach(
    app: tauri::AppHandle,
    request: BrokenReferenceDetachPreviewRequest,
) -> Result<BrokenReferenceDetachPreviewReceipt, ProjectStoreFailure> {
    let result = preview_broken_reference_detach_at(&project_root(&app)?, request);
    if let Err(error) = &result {
        println!(
            "DBX_PROJECT_RECOVERY operation=broken-reference-detach-preview status=BLOCKED code={} retry={}",
            error.code, error.retry,
        );
    }
    let receipt = result?;
    println!(
        "DBX_PROJECT_RECOVERY operation=broken-reference-detach-preview status={} project={} scene={} asset={} blocker={} generation={} nextGeneration={} previewSha256={} descriptorPreserved={} noWrite={} noFoundryWrite={}",
        receipt.status, receipt.project_id, receipt.scene_id, receipt.asset_id, receipt.blocker_code,
        receipt.generation, receipt.next_generation, receipt.preview_sha256,
        receipt.asset_descriptor_preserved, receipt.no_write, receipt.no_foundry_write,
    );
    Ok(receipt)
}

#[tauri::command]
fn detach_broken_reference(
    app: tauri::AppHandle,
    request: BrokenReferenceDetachRequest,
) -> Result<BrokenReferenceDetachReceipt, ProjectStoreFailure> {
    let result = dicebox_project_store::detach_broken_reference_at(&project_root(&app)?, request);
    if let Err(error) = &result {
        println!(
            "DBX_PROJECT_RECOVERY operation=broken-reference-detach status=BLOCKED code={} retry={}",
            error.code, error.retry,
        );
    }
    let receipt = result?;
    println!(
        "DBX_PROJECT_RECOVERY operation=broken-reference-detach status={} project={} scene={} asset={} generation={} targetBindingAbsent={} descriptorPreserved={} unrelatedReferencesUnchanged={} authoritativeInspection={} noFoundryWrite={}",
        receipt.status, receipt.project_id, receipt.scene_id, receipt.asset_id, receipt.generation,
        receipt.target_binding_absent, receipt.asset_descriptor_preserved,
        receipt.unrelated_references_unchanged, receipt.authoritative_inspection, receipt.no_foundry_write,
    );
    Ok(receipt)
}

#[tauri::command]
fn load_project_bundle(
    app: tauri::AppHandle,
    request: LoadProjectRequest,
) -> Result<ProjectLoadResponse, ProjectStoreFailure> {
    let root = project_root(&app)?;
    let project_id = request.project_id.clone();
    let expected_workspace_generation = request.expected_workspace_generation;
    let mut response = load_project_at(&root, request)?;
    if let Some(expected_generation) = expected_workspace_generation {
        match touch_workspace_project_at(&root, &project_id, None, expected_generation) {
            Ok(metadata) => response.workspace_metadata = Some(metadata),
            Err(error) => response.workspace_metadata_warning = Some(error.code),
        }
    }
    println!(
        "DBX_PROJECT_RECEIPT operation=load status={} project={} generation={} contentSha256={} assets={} recoveredFrom={} noFoundryWrite={}",
        response.receipt.status,
        response.receipt.project_id,
        response.receipt.generation,
        response.receipt.content_sha256,
        response.receipt.asset_count,
        response.receipt.recovered_from.as_deref().unwrap_or("none"),
        response.receipt.no_foundry_write,
    );
    Ok(response)
}

#[tauri::command]
fn rename_project_bundle(
    app: tauri::AppHandle,
    request: RenameProjectRequest,
) -> Result<WorkspaceMetadataReceipt, ProjectStoreFailure> {
    let result = rename_workspace_project_at(&project_root(&app)?, request);
    if let Err(error) = &result {
        println!(
            "DBX_PROJECT_RECEIPT operation=rename status=BLOCKED code={} retry={} noFoundryWrite={}",
            error.code, error.retry, error.no_foundry_write,
        );
    }
    let receipt = result?;
    println!(
        "DBX_PROJECT_RECEIPT operation=rename status={} project={} displayName={} lastOpenedSequence={} workspaceGeneration={} contentWrite=false noFoundryWrite={}",
        receipt.status,
        receipt.project_id,
        receipt.display_name,
        receipt.last_opened_sequence,
        receipt.index_generation,
        receipt.no_foundry_write,
    );
    Ok(receipt)
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
struct ProjectStageReceipt {
    operation: String,
    status: String,
    phase: String,
    project_id: String,
    generation: u64,
    scene_revision: u64,
    selected_x: f64,
    content_sha256: String,
    plan_sha256: Option<String>,
    candidate_count: Option<usize>,
    scene_count: Option<usize>,
    asset_id: Option<String>,
    asset_sha256: Option<String>,
    binding_scene_id: Option<String>,
    no_write: bool,
}

#[tauri::command]
fn record_project_stage_receipt(receipt: ProjectStageReceipt) -> Result<(), String> {
    if receipt.operation != "dicebox.project.stage-self-test"
        || receipt.status != "PASS"
        || !matches!(receipt.phase.as_str(), "save" | "load-and-compile")
        || !receipt.project_id.starts_with("dbx:project:")
        || receipt.content_sha256.len() != 64
        || receipt
            .plan_sha256
            .as_ref()
            .is_some_and(|hash| hash.len() != 64)
        || receipt
            .asset_id
            .as_ref()
            .is_some_and(|id| !id.starts_with("dbx:asset:"))
        || receipt.asset_sha256.as_ref().is_some_and(|hash| {
            hash.len() != 64
                || !hash
                    .bytes()
                    .all(|byte| byte.is_ascii_hexdigit() && !byte.is_ascii_uppercase())
        })
        || receipt
            .binding_scene_id
            .as_ref()
            .is_some_and(|id| !id.starts_with("dbx:scene:"))
        || !receipt.no_write
    {
        return Err("Project stage receipt failed its strict local-only contract.".to_string());
    }
    println!(
        "DBX_PROJECT_STAGE status={} phase={} project={} generation={} sceneRevision={} selectedX={} contentSha256={} planSha256={} candidates={} scenes={} assetId={} assetSha256={} bindingScene={} noWrite={}",
        receipt.status,
        receipt.phase,
        receipt.project_id,
        receipt.generation,
        receipt.scene_revision,
        receipt.selected_x,
        receipt.content_sha256,
        receipt.plan_sha256.as_deref().unwrap_or("none"),
        receipt.candidate_count.map(|value| value.to_string()).unwrap_or_else(|| "none".to_string()),
        receipt.scene_count.map(|value| value.to_string()).unwrap_or_else(|| "none".to_string()),
        receipt.asset_id.as_deref().unwrap_or("none"),
        receipt.asset_sha256.as_deref().unwrap_or("none"),
        receipt.binding_scene_id.as_deref().unwrap_or("none"),
        receipt.no_write,
    );
    Ok(())
}

#[cfg(debug_assertions)]
#[tauri::command]
fn finish_project_self_test(app: tauri::AppHandle, status: String) -> Result<(), String> {
    let exit_code = match status.as_str() {
        "PASS" => 0,
        "BLOCKED" => 1,
        _ => return Err("Project self-test exit status must be PASS or BLOCKED.".to_string()),
    };
    app.exit(exit_code);
    Ok(())
}

#[cfg(debug_assertions)]
#[tauri::command]
fn record_project_ui_self_test_progress(stage: String, detail: Option<String>) -> Result<(), String> {
    if !matches!(stage.as_str(), "idle" | "loaded" | "named" | "previewed" | "approved" | "applied" | "pass" | "blocked") {
        return Err("Project UI self-test stage is invalid.".to_string());
    }
    if detail.as_ref().is_some_and(|value| value.len() > 512 || value.contains(['\r', '\n'])) {
        return Err("Project UI self-test detail is invalid.".to_string());
    }
    println!("DBX_PROJECT_UI_SELF_TEST stage={stage} detail={}", detail.as_deref().unwrap_or("none"));
    Ok(())
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct CodexAccountProbe {
    operation: &'static str,
    status: &'static str,
    initialized: bool,
    user_agent: Option<String>,
    platform_family: Option<String>,
    platform_os: Option<String>,
    auth_mode: Option<String>,
    plan_type: Option<String>,
    rate_limit_metadata: Option<CodexRateLimitMetadata>,
    usage_metadata: Option<CodexUsageMetadata>,
    email_present: bool,
    campaign_director_api_key_configured: bool,
    campaign_director_credential_source: &'static str,
    secrets_returned: bool,
    no_write: bool,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct CodexRateLimitWindowMetadata {
    used_percent: f64,
    window_duration_mins: Option<u64>,
    resets_at: Option<u64>,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct CodexRateLimitMetadata {
    limit_id: Option<String>,
    limit_name: Option<String>,
    plan_type: Option<String>,
    primary: Option<CodexRateLimitWindowMetadata>,
    secondary: Option<CodexRateLimitWindowMetadata>,
    rate_limit_reached_type: Option<String>,
    spend_control_reached: Option<bool>,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct CodexUsageMetadata {
    lifetime_tokens: Option<u64>,
    peak_daily_tokens: Option<u64>,
    longest_running_turn_sec: Option<u64>,
    current_streak_days: Option<u64>,
    longest_streak_days: Option<u64>,
    daily_bucket_count: usize,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct CampaignDirectorCredentialStatus {
    operation: &'static str,
    status: &'static str,
    configured: bool,
    source: &'static str,
    secrets_returned: bool,
    project_artifact_write: bool,
}

fn campaign_director_keyring_entry() -> Result<keyring::v1::Entry, String> {
    keyring::v1::Entry::new(
        CAMPAIGN_DIRECTOR_CREDENTIAL_SERVICE,
        CAMPAIGN_DIRECTOR_CREDENTIAL_ACCOUNT,
    )
    .map_err(|_| "The operating-system credential entry is unavailable.".to_string())
}

fn environment_campaign_director_api_key() -> Option<String> {
    std::env::var("OPENAI_API_KEY")
        .ok()
        .map(|value| value.trim().to_string())
        .filter(|value| !value.is_empty())
}

fn stored_campaign_director_api_key() -> Option<String> {
    campaign_director_keyring_entry()
        .ok()?
        .get_password()
        .ok()
        .map(|value| value.trim().to_string())
        .filter(|value| !value.is_empty())
}

fn campaign_director_credential_status_value() -> CampaignDirectorCredentialStatus {
    let keyring_configured = stored_campaign_director_api_key().is_some();
    let environment_configured =
        !keyring_configured && environment_campaign_director_api_key().is_some();
    CampaignDirectorCredentialStatus {
        operation: "dicebox.campaign-director.credential-status",
        status: "PASS",
        configured: keyring_configured || environment_configured,
        source: if keyring_configured {
            "os-keyring"
        } else if environment_configured {
            "environment"
        } else {
            "none"
        },
        secrets_returned: false,
        project_artifact_write: false,
    }
}

fn campaign_director_api_key() -> Result<String, String> {
    stored_campaign_director_api_key()
        .or_else(environment_campaign_director_api_key)
        .ok_or("Campaign Director API key is not configured. Store it locally in AI account boundaries.".to_string())
}

#[tauri::command]
fn campaign_director_credential_status() -> CampaignDirectorCredentialStatus {
    campaign_director_credential_status_value()
}

#[tauri::command]
fn set_campaign_director_api_key(
    mut api_key: String,
) -> Result<CampaignDirectorCredentialStatus, String> {
    let trimmed = api_key.trim();
    if !trimmed.starts_with("sk-") || trimmed.len() < 20 || trimmed.len() > 512 {
        api_key.clear();
        return Err("The Campaign Director API key format is invalid.".to_string());
    }
    campaign_director_keyring_entry()?
        .set_password(trimmed)
        .map_err(|_| "The Campaign Director API key could not be stored in the operating-system credential store.".to_string())?;
    api_key.clear();
    Ok(campaign_director_credential_status_value())
}

#[tauri::command]
fn clear_campaign_director_api_key() -> Result<CampaignDirectorCredentialStatus, String> {
    if stored_campaign_director_api_key().is_some() {
        campaign_director_keyring_entry()?
            .delete_credential()
            .map_err(|_| "The Campaign Director API key could not be removed from the operating-system credential store.".to_string())?;
    }
    Ok(campaign_director_credential_status_value())
}

fn value_at<'a>(value: &'a Value, path: &[&str]) -> Option<&'a Value> {
    let mut current = value;
    for key in path {
        current = current.get(*key)?;
    }
    Some(current)
}

fn string_at(value: &Value, path: &[&str]) -> Option<String> {
    value_at(value, path)?.as_str().map(ToString::to_string)
}

fn u64_at(value: &Value, path: &[&str]) -> Option<u64> {
    value_at(value, path)?.as_u64()
}

fn bool_at(value: &Value, path: &[&str]) -> Option<bool> {
    value_at(value, path)?.as_bool()
}

fn rate_limit_window(value: &Value) -> Option<CodexRateLimitWindowMetadata> {
    Some(CodexRateLimitWindowMetadata {
        used_percent: value.get("usedPercent")?.as_f64()?,
        window_duration_mins: u64_at(value, &["windowDurationMins"]),
        resets_at: u64_at(value, &["resetsAt"]),
    })
}

#[tauri::command]
fn probe_codex_app_server() -> Result<CodexAccountProbe, String> {
    let project_root = std::path::PathBuf::from(env!("CARGO_MANIFEST_DIR"))
        .join("../../..")
        .canonicalize()
        .map_err(|error| format!("Codex project root is unavailable: {error}"))?;
    let codex_entry = project_root.join("node_modules/@openai/codex/bin/codex.js");
    if !codex_entry.is_file() {
        return Err("Project-local Codex App Server entry is missing.".to_string());
    }
    let mut child = Command::new("node")
        .arg(codex_entry)
        .args(["app-server", "--stdio"])
        .current_dir(&project_root)
        .stdin(Stdio::piped())
        .stdout(Stdio::piped())
        .stderr(Stdio::null())
        .creation_flags(0x08000000)
        .spawn()
        .map_err(|error| format!("Codex App Server could not start: {error}"))?;
    let mut stdin = child
        .stdin
        .take()
        .ok_or("Codex App Server stdin is unavailable.")?;
    for message in [
        serde_json::json!({"method":"initialize","id":0,"params":{"clientInfo":{"name":"dicebox_campaign_helper","title":"DiceBox Campaign Helper","version":"0.1.0"}}}),
        serde_json::json!({"method":"initialized","params":{}}),
        serde_json::json!({"method":"account/read","id":1,"params":{"refreshToken":false}}),
        serde_json::json!({"method":"account/rateLimits/read","id":2,"params":{}}),
        serde_json::json!({"method":"account/usage/read","id":3,"params":{}}),
    ] {
        writeln!(stdin, "{message}")
            .map_err(|error| format!("Codex handshake write failed: {error}"))?;
    }
    drop(stdin);
    let output = child
        .wait_with_output()
        .map_err(|error| format!("Codex App Server probe failed: {error}"))?;
    let mut initialized: Option<Value> = None;
    let mut account: Option<Value> = None;
    let mut rate_limits: Option<Value> = None;
    let mut usage: Option<Value> = None;
    for line in String::from_utf8_lossy(&output.stdout).lines() {
        let Ok(value) = serde_json::from_str::<Value>(line) else {
            continue;
        };
        match value.get("id").and_then(Value::as_i64) {
            Some(0) => initialized = value.get("result").cloned(),
            Some(1) => account = value.get("result").cloned(),
            Some(2) => rate_limits = value.get("result").cloned(),
            Some(3) => usage = value.get("result").cloned(),
            _ => {}
        }
    }
    let initialized = initialized.ok_or("Codex App Server did not complete initialization.")?;
    let account = account.ok_or("Codex App Server did not return account state.")?;
    let auth_mode = string_at(&account, &["account", "authMode"])
        .or_else(|| string_at(&account, &["account", "type"]))
        .or_else(|| string_at(&account, &["authMode"]));
    let plan_type = string_at(&account, &["account", "planType"])
        .or_else(|| string_at(&account, &["planType"]));
    let rate_limit_metadata = rate_limits
        .as_ref()
        .and_then(|response| value_at(response, &["rateLimits"]))
        .filter(|snapshot| snapshot.is_object())
        .map(|snapshot| CodexRateLimitMetadata {
            limit_id: string_at(snapshot, &["limitId"]),
            limit_name: string_at(snapshot, &["limitName"]),
            plan_type: string_at(snapshot, &["planType"]),
            primary: value_at(snapshot, &["primary"]).and_then(rate_limit_window),
            secondary: value_at(snapshot, &["secondary"]).and_then(rate_limit_window),
            rate_limit_reached_type: string_at(snapshot, &["rateLimitReachedType"]),
            spend_control_reached: bool_at(snapshot, &["spendControlReached"]),
        });
    let usage_metadata = usage
        .as_ref()
        .and_then(|response| value_at(response, &["summary"]))
        .filter(|summary| summary.is_object())
        .map(|summary| CodexUsageMetadata {
            lifetime_tokens: u64_at(summary, &["lifetimeTokens"]),
            peak_daily_tokens: u64_at(summary, &["peakDailyTokens"]),
            longest_running_turn_sec: u64_at(summary, &["longestRunningTurnSec"]),
            current_streak_days: u64_at(summary, &["currentStreakDays"]),
            longest_streak_days: u64_at(summary, &["longestStreakDays"]),
            daily_bucket_count: usage
                .as_ref()
                .and_then(|response| value_at(response, &["dailyUsageBuckets"]))
                .and_then(Value::as_array)
                .map_or(0, Vec::len),
        });
    let email_present = string_at(&account, &["account", "email"]).is_some();
    let credential_status = campaign_director_credential_status_value();
    let probe = CodexAccountProbe {
        operation: "dicebox.codex.app-server.account-probe",
        status: if auth_mode.is_some() {
            "PASS"
        } else {
            "BLOCKED"
        },
        initialized: true,
        user_agent: string_at(&initialized, &["userAgent"]),
        platform_family: string_at(&initialized, &["platformFamily"]),
        platform_os: string_at(&initialized, &["platformOs"]),
        auth_mode,
        plan_type,
        rate_limit_metadata,
        usage_metadata,
        email_present,
        campaign_director_api_key_configured: credential_status.configured,
        campaign_director_credential_source: credential_status.source,
        secrets_returned: false,
        no_write: true,
    };
    println!(
        "DBX_CODEX_ACCOUNT status={} authMode={} planType={} rateLimit={} usage={} campaignDirectorApiKey={} secretsReturned={} noWrite={}",
        probe.status,
        probe.auth_mode.as_deref().unwrap_or("none"),
        probe.plan_type.as_deref().unwrap_or("none"),
        probe.rate_limit_metadata.is_some(),
        probe.usage_metadata.is_some(),
        probe.campaign_director_api_key_configured,
        probe.secrets_returned,
        probe.no_write,
    );
    Ok(probe)
}

#[tauri::command]
async fn request_campaign_director_managed(request: Value) -> Result<Value, String> {
    let request_object = request
        .as_object()
        .ok_or("Managed Campaign Director request must be an object.")?;
    let allowed = ["document", "knowledge", "userIntent"];
    if request_object
        .keys()
        .any(|key| !allowed.contains(&key.as_str()))
        || request_object
            .get("userIntent")
            .and_then(Value::as_str)
            .is_none_or(|value| value.trim().is_empty())
        || request_object
            .get("document")
            .and_then(Value::as_object)
            .is_none()
        || request_object
            .get("knowledge")
            .and_then(Value::as_array)
            .is_none()
    {
        return Err(
            "Managed Campaign Director request violates the fixed read-only contract.".to_string(),
        );
    }
    let project_root = std::path::PathBuf::from(env!("CARGO_MANIFEST_DIR"))
        .join("../../..")
        .canonicalize()
        .map_err(|error| format!("Codex project root is unavailable: {error}"))?;
    let script = project_root.join("tools/run-campaign-director-app-server-slice.mjs");
    if !script.is_file() {
        return Err("Fixed managed Campaign Director runner is missing.".to_string());
    }
    let request_json = serde_json::to_string(&request)
        .map_err(|_| "Managed Campaign Director request could not be serialized.".to_string())?;
    let output = tauri::async_runtime::spawn_blocking(move || {
        Command::new("node")
            .arg(script)
            .arg("--desktop")
            .arg(request_json)
            .current_dir(project_root)
            .creation_flags(0x08000000)
            .output()
    })
    .await
    .map_err(|_| "Managed Campaign Director worker could not be joined.".to_string())?
    .map_err(|error| format!("Managed Campaign Director runner could not start: {error}"))?;
    if !output.status.success() {
        return Err(
            "Managed Campaign Director was blocked; no project write occurred.".to_string(),
        );
    }
    let receipt = String::from_utf8_lossy(&output.stdout)
        .lines()
        .rev()
        .find_map(|line| serde_json::from_str::<Value>(line).ok())
        .ok_or("Managed Campaign Director returned no receipt.".to_string())?;
    if receipt.get("noWrite") != Some(&Value::Bool(true))
        || receipt.get("implicitExecution") != Some(&Value::Bool(false))
        || receipt.get("runtimeAuthority") != Some(&Value::Bool(false))
    {
        return Err(
            "Managed Campaign Director receipt failed its no-write authority contract.".to_string(),
        );
    }
    receipt
        .get("response")
        .cloned()
        .ok_or("Managed Campaign Director receipt contained no response envelope.".to_string())
}

#[tauri::command]
async fn request_campaign_director(request: Value) -> Result<Value, String> {
    let request_object = request
        .as_object()
        .ok_or("Campaign Director request must be an object.")?;
    if request_object.get("store") != Some(&Value::Bool(false))
        || request_object.get("parallel_tool_calls") != Some(&Value::Bool(false))
        || request_object
            .get("max_output_tokens")
            .and_then(Value::as_u64)
            .is_none_or(|value| value > 1_000)
    {
        return Err(
            "Campaign Director request violates the bounded transport contract.".to_string(),
        );
    }
    let tool_choice = request_object
        .get("tool_choice")
        .and_then(Value::as_object)
        .ok_or("Campaign Director request must force one typed proposal tool.")?;
    if tool_choice.get("type").and_then(Value::as_str) != Some("function")
        || tool_choice.get("name").and_then(Value::as_str) != Some("propose_scene_command")
    {
        return Err("Campaign Director request must force propose_scene_command.".to_string());
    }
    let api_key = campaign_director_api_key()?;
    let response = reqwest::Client::builder()
        .timeout(Duration::from_secs(90))
        .build()
        .map_err(|_| "Campaign Director HTTP client could not initialize.".to_string())?
        .post("https://api.openai.com/v1/responses")
        .bearer_auth(api_key)
        .json(&request)
        .send()
        .await
        .map_err(|error| format!("Campaign Director request failed: {}", error.without_url()))?;
    let status = response.status();
    if !status.is_success() {
        return Err(format!(
            "Campaign Director API returned HTTP {}.",
            status.as_u16()
        ));
    }
    response
        .json::<Value>()
        .await
        .map_err(|_| "Campaign Director returned invalid JSON.".to_string())
}

#[tauri::command]
async fn run_codex_technical_job() -> Result<Value, String> {
    let project_root = std::path::PathBuf::from(env!("CARGO_MANIFEST_DIR"))
        .join("../../..")
        .canonicalize()
        .map_err(|error| format!("Codex project root is unavailable: {error}"))?;
    let script = project_root.join("tools/run-codex-app-server-slice.mjs");
    if !script.is_file() {
        return Err("Fixed Codex technical-job runner is missing.".to_string());
    }
    let output = tauri::async_runtime::spawn_blocking(move || {
        Command::new("node")
            .arg(script)
            .arg("job")
            .current_dir(project_root)
            .creation_flags(0x08000000)
            .output()
    })
    .await
    .map_err(|_| "Codex technical-job worker could not be joined.".to_string())?
    .map_err(|error| format!("Codex technical-job runner could not start: {error}"))?;
    if !output.status.success() {
        let message = String::from_utf8_lossy(&output.stderr);
        let safe = if message.to_ascii_lowercase().contains("token")
            || message.to_ascii_lowercase().contains("key")
        {
            "Codex technical job was blocked; diagnostics were redacted.".to_string()
        } else {
            message.trim().to_string()
        };
        return Err(if safe.is_empty() {
            "Codex technical job was blocked.".to_string()
        } else {
            safe
        });
    }
    serde_json::from_slice::<Value>(&output.stdout)
        .map_err(|_| "Codex technical-job receipt was invalid JSON.".to_string())
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
struct DchLocalBridgeTransportProbe {
    operation: &'static str,
    status: &'static str,
    endpoint: &'static str,
    transport: &'static str,
    authenticated_gm_verified: bool,
    world_verified: bool,
    module_runtime_verified: bool,
    no_foundry_write: bool,
}

fn classify_dch_local_bridge_transport(port_reachable: bool) -> DchLocalBridgeTransportProbe {
    DchLocalBridgeTransportProbe {
        operation: "dch.desktop.foundry.local-bridge-transport",
        status: "BLOCKED_AUTHENTICATED_RUNTIME_NOT_PROVEN",
        endpoint: "127.0.0.1:8797",
        transport: if port_reachable {
            "DEFAULT_PORT_REACHABLE_UNVERIFIED"
        } else {
            "DEFAULT_PORT_NOT_REACHABLE"
        },
        authenticated_gm_verified: false,
        world_verified: false,
        module_runtime_verified: false,
        no_foundry_write: true,
    }
}

#[tauri::command]
fn probe_dch_local_bridge_transport() -> DchLocalBridgeTransportProbe {
    // TCP is transport-only. A listening socket is not a trusted elected GM,
    // an authenticated ChatGPT caller, or an enabled DCH Foundry module.
    let address = std::net::SocketAddr::from(([127, 0, 0, 1], 8797));
    let reachable =
        std::net::TcpStream::connect_timeout(&address, std::time::Duration::from_millis(350))
            .is_ok();
    classify_dch_local_bridge_transport(reachable)
}

#[cfg(test)]
mod dch_local_bridge_transport_tests {
    use super::classify_dch_local_bridge_transport;

    #[test]
    fn listening_port_does_not_promote_foundry_authority() {
        let result = classify_dch_local_bridge_transport(true);
        assert_eq!(result.transport, "DEFAULT_PORT_REACHABLE_UNVERIFIED");
        assert_eq!(result.status, "BLOCKED_AUTHENTICATED_RUNTIME_NOT_PROVEN");
        assert!(!result.authenticated_gm_verified);
        assert!(!result.world_verified);
        assert!(!result.module_runtime_verified);
        assert!(result.no_foundry_write);
    }

    #[test]
    fn unreachable_port_cannot_claim_module_runtime() {
        let result = classify_dch_local_bridge_transport(false);
        assert_eq!(result.transport, "DEFAULT_PORT_NOT_REACHABLE");
        assert_eq!(result.status, "BLOCKED_AUTHENTICATED_RUNTIME_NOT_PROVEN");
        assert!(!result.authenticated_gm_verified);
        assert!(!result.module_runtime_verified);
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            commit_geometry_batch,
            create_project_bundle,
            save_project_bundle,
            save_project_as_bundle,
            list_project_bundles,
            load_project_bundle,
            explain_project_migration,
            preview_project_migration_persist,
            persist_project_migration,
            inspect_project_recovery,
            preview_backup_authoritative_recovery,
            promote_backup_authoritative_recovery,
            #[cfg(debug_assertions)]
            prepare_pending_artifact_inspection_fixture,
            #[cfg(debug_assertions)]
            prepare_dangling_background_reference_fixture,
            #[cfg(debug_assertions)]
            prepare_selected_missing_background_recovery_fixture,
            #[cfg(debug_assertions)]
            prepare_asset_restore_trace_fixture,
            #[cfg(debug_assertions)]
            prepare_asset_restore_trace_fixture_v2,
            #[cfg(debug_assertions)]
            prepare_asset_restore_trace_fixture_v3,
            #[cfg(debug_assertions)]
            prepare_asset_detach_ui_lifecycle_fixture,
            #[cfg(debug_assertions)]
            finish_project_self_test,
            #[cfg(debug_assertions)]
            record_project_ui_self_test_progress,
            preview_missing_asset_restore,
            restore_missing_asset,
            preview_missing_asset_detach,
            detach_missing_asset,
            preview_broken_reference_detach,
            detach_broken_reference,
            prepare_broken_reference_detach_fixture,
            #[cfg(debug_assertions)]
            prepare_broken_reference_ui_lifecycle_fixture,
            #[cfg(debug_assertions)]
            prepare_broken_reference_ui_lifecycle_fixture_v3,
            #[cfg(debug_assertions)]
            prepare_broken_reference_ui_lifecycle_fixture_v4,
            #[cfg(debug_assertions)]
            prepare_legacy_migration_persistence_fixture,
            #[cfg(debug_assertions)]
            prepare_backup_authoritative_recovery_promotion_fixture,
            #[cfg(debug_assertions)]
            prepare_cross_producer_recovery_transition,
            rename_project_bundle,
            record_project_stage_receipt,
            campaign_director_credential_status,
            set_campaign_director_api_key,
            clear_campaign_director_api_key,
            probe_dch_local_bridge_transport,
            probe_codex_app_server,
            request_campaign_director,
            request_campaign_director_managed,
            run_codex_technical_job,
        ])
        .run(tauri::generate_context!())
        .expect("error while running DiceBox Campaign Helper");
}
