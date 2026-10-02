use fs2::FileExt;
use serde::{Deserialize, Serialize};
use serde_json::Value;
use sha2::{Digest, Sha256};
use std::collections::{BTreeMap, BTreeSet};
use std::fs::{self, File, OpenOptions};
use std::io::{Read, Write};
#[cfg(windows)]
use std::os::windows::fs::{MetadataExt, OpenOptionsExt};
use std::path::{Path, PathBuf};

const PROJECT_SCHEMA_VERSION: &str = "0.3.0";
const MULTI_SCENE_PROJECT_SCHEMA_VERSION: &str = "0.2.0";
const LEGACY_PROJECT_SCHEMA_VERSION: &str = "0.1.0";
const WORKSPACE_INDEX_SCHEMA_VERSION: &str = "0.1.0";
pub const PENDING_ARTIFACT_INSPECTION_SELF_TEST_PROJECT_ID: &str =
    "dbx:project:desktop-pending-artifact-inspection-self-test";
pub const SELECTED_MISSING_BACKGROUND_RECOVERY_SELF_TEST_PROJECT_ID: &str =
    "dbx:project:desktop-selected-missing-background-recovery-self-test";
pub const ASSET_RESTORE_TRACE_SELF_TEST_PROJECT_ID: &str =
    "dbx:project:desktop-asset-restore-trace-self-test";
pub const ASSET_RESTORE_TRACE_SELF_TEST_V2_PROJECT_ID: &str =
    "dbx:project:desktop-asset-restore-trace-self-test-v2";
pub const ASSET_RESTORE_TRACE_SELF_TEST_V3_PROJECT_ID: &str =
    "dbx:project:desktop-asset-restore-trace-self-test-v3";
pub const ASSET_DETACH_UI_LIFECYCLE_SELF_TEST_PROJECT_ID: &str =
    "dbx:project:desktop-asset-detach-ui-lifecycle-self-test-v1";
pub const DANGLING_BACKGROUND_REFERENCE_SELF_TEST_PROJECT_ID: &str =
    "dbx:project:desktop-dangling-background-reference-self-test";
pub const BROKEN_REFERENCE_DETACH_SELF_TEST_PROJECT_ID: &str =
    "dbx:project:desktop-broken-reference-detach-self-test-v2";
pub const BROKEN_REFERENCE_UI_LIFECYCLE_SELF_TEST_PROJECT_ID: &str =
    "dbx:project:desktop-broken-reference-ui-lifecycle-self-test-v2";
pub const BROKEN_REFERENCE_UI_LIFECYCLE_SELF_TEST_V3_PROJECT_ID: &str =
    "dbx:project:desktop-broken-reference-ui-lifecycle-self-test-v3";
pub const BROKEN_REFERENCE_UI_LIFECYCLE_SELF_TEST_V4_PROJECT_ID: &str =
    "dbx:project:desktop-broken-reference-ui-lifecycle-self-test-v4";
pub const LEGACY_MIGRATION_PERSISTENCE_SELF_TEST_PROJECT_ID: &str =
    "dbx:project:desktop-legacy-migration-persistence-self-test-v2";
pub const BACKUP_AUTHORITATIVE_RECOVERY_PROMOTION_SELF_TEST_PROJECT_ID: &str =
    "dbx:project:desktop-backup-authoritative-recovery-promotion-self-test";
pub const CROSS_PRODUCER_COMMIT_RECOVERY_SELF_TEST_PROJECT_ID: &str =
    "dbx:project:desktop-cross-producer-commit-recovery-self-test-v3";
pub const CROSS_PRODUCER_COMMIT_RECOVERY_SELF_TEST_V4_PROJECT_ID: &str =
    "dbx:project:desktop-cross-producer-commit-recovery-self-test-v4";
pub const CROSS_PRODUCER_COMMIT_RECOVERY_SELF_TEST_V5_PROJECT_ID: &str =
    "dbx:project:desktop-cross-producer-commit-recovery-self-test-v5";
const MAX_ASSET_BYTES: usize = 32 * 1024 * 1024;
const MAX_DISPLAY_NAME_CHARS: usize = 100;
const MAX_PROJECT_SCENES: usize = 256;
const PROJECT_MUTATION_LEASE_FILE: &str = "dicebox-project-store.mutation.lock";
const BACKUP_RECOVERY_FOREIGN_NOTE_FILE: &str = "foreign-note.txt";
const BACKUP_RECOVERY_FOREIGN_NOTE_BYTES: &[u8] = b"preserve-m244-foreign-state";

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct ProjectAssetInput {
    pub media_type: String,
    pub bytes: Vec<u8>,
    #[serde(default)]
    pub registration: Option<ProjectAssetRegistration>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct ProjectAssetRegistration {
    pub asset_id: String,
    pub role: String,
    pub label: String,
    pub provenance: String,
    pub approval: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct SaveProjectRequest {
    pub schema_version: String,
    pub project_id: String,
    pub expected_generation: u64,
    pub scenes_json: Vec<String>,
    pub active_scene_id: String,
    #[serde(default)]
    pub assets: Option<Vec<ProjectAssetInput>>,
    #[serde(default)]
    pub expected_workspace_generation: Option<u64>,
    #[serde(default)]
    pub workspace_display_name: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct LoadProjectRequest {
    pub schema_version: String,
    pub project_id: String,
    #[serde(default)]
    pub expected_workspace_generation: Option<u64>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct StoredAsset {
    pub sha256: String,
    pub media_type: String,
    pub byte_length: usize,
    pub relative_path: String,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub registration: Option<ProjectAssetRegistration>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
struct ProjectEnvelope {
    schema_version: String,
    project_id: String,
    generation: u64,
    scenes: Vec<ProjectSceneEnvelope>,
    active_scene_id: String,
    assets: Vec<StoredAsset>,
    content_sha256: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
struct ProjectSceneEnvelope {
    scene_id: String,
    scene_json: String,
    scene_sha256: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
struct LegacyProjectEnvelope {
    schema_version: String,
    project_id: String,
    generation: u64,
    scene_json: String,
    scene_sha256: String,
    assets: Vec<StoredAsset>,
    content_sha256: String,
}

#[derive(Debug, Clone)]
struct ReadProjectEnvelope {
    envelope: ProjectEnvelope,
    persisted_content_sha256: String,
    source_schema_version: String,
    migration_status: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct ProjectSceneReceipt {
    pub scene_id: String,
    pub scene_sha256: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct ProjectSaveReceipt {
    pub operation: String,
    pub status: String,
    pub project_id: String,
    pub generation: u64,
    pub content_sha256: String,
    pub scene_sha256: String,
    pub scene_count: usize,
    pub active_scene_id: String,
    pub scenes: Vec<ProjectSceneReceipt>,
    pub asset_count: usize,
    pub project_relative_path: String,
    pub atomic_replace: bool,
    pub directory_entry_sync: bool,
    pub backup_preserved: bool,
    pub no_foundry_write: bool,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub workspace_metadata: Option<WorkspaceMetadataReceipt>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub workspace_metadata_warning: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct ProjectLoadReceipt {
    pub operation: String,
    pub status: String,
    pub project_id: String,
    pub generation: u64,
    pub content_sha256: String,
    pub scene_sha256: String,
    pub scene_count: usize,
    pub active_scene_id: String,
    pub scenes: Vec<ProjectSceneReceipt>,
    pub asset_count: usize,
    pub recovered_from: Option<String>,
    pub migration_status: String,
    pub persisted_content_sha256: String,
    pub no_foundry_write: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct ProjectLoadResponse {
    pub scenes_json: Vec<String>,
    pub active_scene_id: String,
    pub assets: Vec<StoredAsset>,
    pub receipt: ProjectLoadReceipt,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub workspace_metadata: Option<WorkspaceMetadataReceipt>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub workspace_metadata_warning: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct SaveProjectAsRequest {
    pub schema_version: String,
    pub source_project_id: String,
    pub target_project_id: String,
    pub scenes_json: Vec<String>,
    pub active_scene_id: String,
    #[serde(default)]
    pub expected_workspace_generation: Option<u64>,
    #[serde(default)]
    pub workspace_display_name: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
struct WorkspaceIndexEntry {
    display_name: String,
    last_opened_sequence: u64,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
struct WorkspaceIndexEnvelope {
    schema_version: String,
    generation: u64,
    next_sequence: u64,
    entries: BTreeMap<String, WorkspaceIndexEntry>,
    content_sha256: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct RenameProjectRequest {
    pub schema_version: String,
    pub project_id: String,
    pub display_name: String,
    pub expected_workspace_generation: u64,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct WorkspaceMetadataReceipt {
    pub operation: String,
    pub status: String,
    pub project_id: String,
    pub display_name: String,
    pub last_opened_sequence: u64,
    pub index_generation: u64,
    pub content_sha256: String,
    pub recovered_from: Option<String>,
    pub atomic_replace: bool,
    pub directory_entry_sync: bool,
    pub backup_preserved: bool,
    pub no_foundry_write: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct ProjectCatalogEntry {
    pub project_id: String,
    pub status: String,
    pub scene_id: Option<String>,
    pub scene_name: Option<String>,
    pub scene_count: Option<usize>,
    pub active_scene_id: Option<String>,
    pub generation: Option<u64>,
    pub content_sha256: Option<String>,
    pub asset_count: Option<usize>,
    pub recovered_from: Option<String>,
    pub blocker_code: Option<String>,
    pub display_name: String,
    pub last_opened_sequence: u64,
    pub workspace_metadata_warning: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct ProjectCatalogResponse {
    pub operation: String,
    pub status: String,
    pub entries: Vec<ProjectCatalogEntry>,
    pub workspace_index_generation: u64,
    pub workspace_metadata_warning: Option<String>,
    pub no_write: bool,
    pub no_foundry_write: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct ProjectMigrationPreview {
    pub operation: String,
    pub status: String,
    pub source_version: String,
    pub target_version: String,
    pub actions: Vec<String>,
    pub blockers: Vec<String>,
    pub no_write: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct ProjectMigrationExplanationRequest {
    pub schema_version: String,
    pub project_id: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct ProjectMigrationExplanationReceipt {
    pub operation: String,
    pub status: String,
    pub project_id: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub authoritative_source: Option<String>,
    pub primary: ProjectRecoveryFileDisposition,
    pub backup: ProjectRecoveryFileDisposition,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub source_schema_version: Option<String>,
    pub target_schema_version: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub migration_status: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub generation: Option<u64>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub content_sha256: Option<String>,
    pub actions: Vec<String>,
    pub blockers: Vec<String>,
    pub retry: String,
    pub no_write: bool,
    pub no_foundry_write: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct ProjectMigrationPersistPreviewRequest {
    pub schema_version: String,
    pub project_id: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct ProjectMigrationPersistPreviewReceipt {
    pub operation: String,
    pub status: String,
    pub project_id: String,
    pub authoritative_source: String,
    pub source_schema_version: String,
    pub target_schema_version: String,
    pub generation: u64,
    pub next_generation: u64,
    pub persisted_content_sha256: String,
    pub resulting_content_sha256: String,
    pub scenes: Vec<ProjectSceneReceipt>,
    pub active_scene_id: String,
    pub asset_count: usize,
    pub asset_collection_sha256: String,
    pub semantic_state_sha256: String,
    pub actions: Vec<String>,
    pub primary_byte_sha256: String,
    pub protected_state_sha256: String,
    pub asset_tree_sha256: String,
    pub preview_sha256: String,
    pub requires_approval: bool,
    pub no_write: bool,
    pub no_foundry_write: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct ProjectMigrationPersistRequest {
    pub schema_version: String,
    pub project_id: String,
    pub source_schema_version: String,
    pub generation: u64,
    pub persisted_content_sha256: String,
    pub resulting_content_sha256: String,
    pub preview_sha256: String,
    pub approved: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct ProjectMigrationPersistReceipt {
    pub operation: String,
    pub status: String,
    pub project_id: String,
    pub source_schema_version: String,
    pub target_schema_version: String,
    pub previous_generation: u64,
    pub generation: u64,
    pub previous_content_sha256: String,
    pub content_sha256: String,
    pub scenes: Vec<ProjectSceneReceipt>,
    pub active_scene_id: String,
    pub asset_count: usize,
    pub semantic_state_unchanged: bool,
    pub asset_tree_unchanged: bool,
    pub workspace_unchanged: bool,
    pub foreign_state_unchanged: bool,
    pub backup_preserves_legacy_primary: bool,
    pub authoritative_current_reread: bool,
    pub preview_sha256: String,
    pub directory_entry_sync: bool,
    pub no_foundry_write: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct BackupRecoveryPromotionPreviewRequest {
    pub schema_version: String,
    pub project_id: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct BackupRecoveryPromotionPreviewReceipt {
    pub operation: String,
    pub status: String,
    pub project_id: String,
    pub primary: ProjectRecoveryFileDisposition,
    pub backup: ProjectRecoveryFileDisposition,
    pub generation: u64,
    pub content_sha256: String,
    pub scenes: Vec<ProjectSceneReceipt>,
    pub active_scene_id: String,
    pub asset_count: usize,
    pub asset_collection_sha256: String,
    pub semantic_state_sha256: String,
    pub backup_byte_sha256: String,
    pub protected_state_sha256: String,
    pub asset_tree_sha256: String,
    pub preview_sha256: String,
    pub requires_approval: bool,
    pub no_write: bool,
    pub no_foundry_write: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct BackupRecoveryPromotionRequest {
    pub schema_version: String,
    pub project_id: String,
    pub generation: u64,
    pub content_sha256: String,
    pub backup_byte_sha256: String,
    pub protected_state_sha256: String,
    pub asset_tree_sha256: String,
    pub preview_sha256: String,
    pub approved: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct BackupRecoveryPromotionReceipt {
    pub operation: String,
    pub status: String,
    pub project_id: String,
    pub generation: u64,
    pub content_sha256: String,
    pub scenes: Vec<ProjectSceneReceipt>,
    pub active_scene_id: String,
    pub asset_count: usize,
    pub primary_restored: bool,
    pub backup_unchanged: bool,
    pub semantic_state_unchanged: bool,
    pub asset_tree_unchanged: bool,
    pub workspace_unchanged: bool,
    pub foreign_state_unchanged: bool,
    pub authoritative_current_reread: bool,
    pub backup_byte_sha256: String,
    pub preview_sha256: String,
    pub directory_entry_sync: bool,
    pub no_foundry_write: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct BackupAuthoritativeRecoveryPromotionFixtureReceipt {
    pub operation: String,
    pub status: String,
    pub project_id: String,
    pub generation: u64,
    pub content_sha256: String,
    pub backup_byte_sha256: String,
    pub no_foundry_write: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct CrossProducerRecoveryTransitionReceipt {
    pub operation: String,
    pub status: String,
    pub project_id: String,
    pub before_generation: u64,
    pub committed_generation: u64,
    pub primary_content_sha256: String,
    pub backup_generation: u64,
    pub content_sha256: String,
    pub backup_byte_sha256: String,
    pub foreign_state_sha256: String,
    pub primary_removed: bool,
    pub no_foundry_write: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct ProjectRecoveryInspectionRequest {
    pub schema_version: String,
    pub project_id: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct ProjectRecoveryFileDisposition {
    pub relative_path: String,
    pub status: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub source_schema_version: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub migration_status: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub byte_sha256: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub blocker_code: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub blocker_message: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub retry: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct RegisteredAssetRecoveryInspection {
    pub asset_id: String,
    pub role: String,
    pub sha256: String,
    pub media_type: String,
    pub byte_length: usize,
    pub relative_path: String,
    pub affected_scene_ids: Vec<String>,
    pub disposition: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub blocker_code: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub blocker_message: Option<String>,
    pub retry: String,
    pub restore_eligible: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct PendingArtifactRecoveryInspection {
    pub artifact_kind: String,
    pub relative_path: String,
    pub status: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub staged_content_sha256: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub byte_sha256: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub blocker_code: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub blocker_message: Option<String>,
    pub retry: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct BrokenSceneAssetReferenceInspection {
    pub source: String,
    pub scene_id: String,
    pub asset_id: String,
    pub blocker_code: String,
    pub blocker_message: String,
    pub retry: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct PendingArtifactFixtureReceipt {
    pub operation: String,
    pub status: String,
    pub project_id: String,
    pub project_pending_relative_path: String,
    pub workspace_pending_relative_path: String,
    pub malformed_pending_relative_path: String,
    pub no_foundry_write: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct SelectedMissingBackgroundFixtureReceipt {
    pub operation: String,
    pub status: String,
    pub project_id: String,
    pub asset_ids: Vec<String>,
    pub scene_ids: Vec<String>,
    pub generation: u64,
    pub no_foundry_write: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct DanglingBackgroundReferenceFixtureReceipt {
    pub operation: String,
    pub status: String,
    pub project_id: String,
    pub scene_ids: Vec<String>,
    pub asset_ids: Vec<String>,
    pub no_foundry_write: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct BrokenReferenceDetachFixtureReceipt {
    pub operation: String,
    pub status: String,
    pub project_id: String,
    pub scene_ids: Vec<String>,
    pub asset_id: String,
    pub asset_sha256: String,
    pub no_foundry_write: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct BrokenReferenceUiLifecycleFixtureReceipt {
    pub operation: String,
    pub status: String,
    pub project_id: String,
    pub scene_ids: Vec<String>,
    pub asset_id: String,
    pub asset_sha256: String,
    pub no_foundry_write: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct LegacyMigrationPersistenceFixtureReceipt {
    pub operation: String,
    pub status: String,
    pub project_id: String,
    pub source_schema_version: String,
    pub generation: u64,
    pub persisted_content_sha256: String,
    pub scene_ids: Vec<String>,
    pub asset_sha256: String,
    pub no_foundry_write: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct ProjectRecoveryInspectionReceipt {
    pub operation: String,
    pub status: String,
    pub project_id: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub generation: Option<u64>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub content_sha256: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub active_scene_id: Option<String>,
    pub scenes: Vec<ProjectSceneReceipt>,
    pub primary: ProjectRecoveryFileDisposition,
    pub backup: ProjectRecoveryFileDisposition,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub recovered_from: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub migration_status: Option<String>,
    pub registered_assets: Vec<RegisteredAssetRecoveryInspection>,
    pub pending_artifacts: Vec<PendingArtifactRecoveryInspection>,
    pub broken_scene_references: Vec<BrokenSceneAssetReferenceInspection>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub blocker_code: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub blocker_message: Option<String>,
    pub retry: String,
    pub restore_eligible: bool,
    pub no_write: bool,
    pub no_foundry_write: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct MissingAssetRestorePreviewRequest {
    pub schema_version: String,
    pub project_id: String,
    pub asset_id: String,
    pub media_type: String,
    pub bytes: Vec<u8>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct MissingAssetRestorePreviewReceipt {
    pub operation: String,
    pub status: String,
    pub project_id: String,
    pub generation: u64,
    pub content_sha256: String,
    pub migration_status: String,
    pub recovered_from: Option<String>,
    pub asset_id: String,
    pub asset_sha256: String,
    pub media_type: String,
    pub byte_length: usize,
    pub registration: ProjectAssetRegistration,
    pub target_relative_path: String,
    pub affected_scene_ids: Vec<String>,
    pub candidate_sha256: String,
    pub candidate_byte_length: usize,
    pub protected_state_sha256: String,
    pub preview_sha256: String,
    pub requires_approval: bool,
    pub no_write: bool,
    pub no_foundry_write: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct MissingAssetRestoreRequest {
    pub schema_version: String,
    pub project_id: String,
    pub asset_id: String,
    pub media_type: String,
    pub bytes: Vec<u8>,
    pub preview_sha256: String,
    pub approved: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct MissingAssetRestoreReceipt {
    pub operation: String,
    pub status: String,
    pub project_id: String,
    pub generation: u64,
    pub content_sha256: String,
    pub asset_id: String,
    pub asset_sha256: String,
    pub media_type: String,
    pub byte_length: usize,
    pub target_relative_path: String,
    pub affected_scene_ids: Vec<String>,
    pub preview_sha256: String,
    pub authoritative_asset_sha256: String,
    pub authoritative_project_content_sha256: String,
    pub envelope_unchanged: bool,
    pub project_state_unchanged: bool,
    pub scenes_unchanged: bool,
    pub workspace_unchanged: bool,
    pub backups_unchanged: bool,
    pub foreign_state_unchanged: bool,
    pub create_new_only: bool,
    pub directory_entry_sync: bool,
    pub no_project_write: bool,
    pub no_foundry_write: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct MissingAssetDetachPreviewRequest {
    pub schema_version: String,
    pub project_id: String,
    pub asset_id: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct MissingAssetDetachPreviewReceipt {
    pub operation: String,
    pub status: String,
    pub project_id: String,
    pub generation: u64,
    pub content_sha256: String,
    pub migration_status: String,
    pub asset_id: String,
    pub asset_sha256: String,
    pub media_type: String,
    pub byte_length: usize,
    pub registration: ProjectAssetRegistration,
    pub target_relative_path: String,
    pub affected_scenes: Vec<ProjectSceneReceipt>,
    pub resulting_scenes: Vec<ProjectSceneReceipt>,
    pub resulting_asset_count: usize,
    pub resulting_asset_collection_sha256: String,
    pub next_generation: u64,
    pub resulting_content_sha256: String,
    pub primary_byte_sha256: String,
    pub protected_state_sha256: String,
    pub asset_tree_sha256: String,
    pub preview_sha256: String,
    pub requires_approval: bool,
    pub no_write: bool,
    pub no_foundry_write: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct MissingAssetDetachRequest {
    pub schema_version: String,
    pub project_id: String,
    pub asset_id: String,
    pub preview_sha256: String,
    pub approved: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct MissingAssetDetachReceipt {
    pub operation: String,
    pub status: String,
    pub project_id: String,
    pub previous_generation: u64,
    pub generation: u64,
    pub previous_content_sha256: String,
    pub content_sha256: String,
    pub asset_id: String,
    pub asset_sha256: String,
    pub target_relative_path: String,
    pub affected_scenes: Vec<ProjectSceneReceipt>,
    pub scenes: Vec<ProjectSceneReceipt>,
    pub descriptor_removed: bool,
    pub asset_tree_unchanged: bool,
    pub workspace_unchanged: bool,
    pub foreign_state_unchanged: bool,
    pub backup_preserves_prior_envelope: bool,
    pub target_remains_absent: bool,
    pub authoritative_reload: bool,
    pub preview_sha256: String,
    pub directory_entry_sync: bool,
    pub no_foundry_write: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct BrokenReferenceDetachPreviewRequest {
    pub schema_version: String,
    pub project_id: String,
    pub scene_id: String,
    pub asset_id: String,
    pub blocker_code: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct BrokenReferenceDetachPreviewReceipt {
    pub operation: String,
    pub status: String,
    pub project_id: String,
    pub generation: u64,
    pub content_sha256: String,
    pub scene_id: String,
    pub asset_id: String,
    pub blocker_code: String,
    pub asset_descriptor_preserved: bool,
    pub asset_sha256: Option<String>,
    pub affected_scene: ProjectSceneReceipt,
    pub resulting_scenes: Vec<ProjectSceneReceipt>,
    pub resulting_asset_count: usize,
    pub resulting_asset_collection_sha256: String,
    pub next_generation: u64,
    pub resulting_content_sha256: String,
    pub primary_byte_sha256: String,
    pub backup_byte_sha256: Option<String>,
    pub protected_state_sha256: String,
    pub asset_tree_sha256: String,
    pub preview_sha256: String,
    pub requires_approval: bool,
    pub no_write: bool,
    pub no_foundry_write: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct BrokenReferenceDetachRequest {
    pub schema_version: String,
    pub project_id: String,
    pub scene_id: String,
    pub asset_id: String,
    pub blocker_code: String,
    pub preview_sha256: String,
    pub approved: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct BrokenReferenceDetachReceipt {
    pub operation: String,
    pub status: String,
    pub project_id: String,
    pub previous_generation: u64,
    pub generation: u64,
    pub previous_content_sha256: String,
    pub content_sha256: String,
    pub scene_id: String,
    pub asset_id: String,
    pub blocker_code: String,
    pub asset_descriptor_preserved: bool,
    pub asset_tree_unchanged: bool,
    pub workspace_unchanged: bool,
    pub foreign_state_unchanged: bool,
    pub backup_preserves_prior_envelope: bool,
    pub target_binding_absent: bool,
    pub unrelated_references_unchanged: bool,
    pub authoritative_inspection: bool,
    pub residual_broken_reference_count: usize,
    pub preview_sha256: String,
    pub directory_entry_sync: bool,
    pub no_foundry_write: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct ProjectStoreFailure {
    pub code: String,
    pub message: String,
    pub retry: String,
    pub no_foundry_write: bool,
}

fn failure(code: &str, message: impl Into<String>, retry: &str) -> ProjectStoreFailure {
    ProjectStoreFailure {
        code: code.to_string(),
        message: message.into(),
        retry: retry.to_string(),
        no_foundry_write: true,
    }
}

/// Owns the fixed-root operating-system lease for one store mutation.  The lock
/// is advisory, process-scoped, and deliberately has no timeout or stale-lock
/// cleanup path: the operating system releases it when its owner exits.
struct ProjectMutationLease {
    file: File,
}

impl Drop for ProjectMutationLease {
    fn drop(&mut self) {
        let _ = FileExt::unlock(&self.file);
    }
}

fn acquire_project_mutation_lease(
    root: &Path,
) -> Result<ProjectMutationLease, ProjectStoreFailure> {
    ensure_not_reparse(root, "Project-store root")?;
    fs::create_dir_all(root).map_err(|error| {
        failure(
            "PROJECT_STORE_UNAVAILABLE",
            format!("Project-store root could not be created for its mutation lease: {error}"),
            "after-reread",
        )
    })?;
    ensure_not_reparse(root, "Project-store root")?;
    let lease_path = root.join(PROJECT_MUTATION_LEASE_FILE);
    ensure_not_reparse(&lease_path, "Project-store mutation lease")?;
    let file = OpenOptions::new()
        .read(true)
        .write(true)
        .create(true)
        .open(&lease_path)
        .map_err(|error| {
            failure(
                "PROJECT_STORE_LEASE_UNAVAILABLE",
                format!("Fixed-root project-store mutation lease could not be opened: {error}"),
                "after-reread",
            )
        })?;
    match file.try_lock_exclusive() {
        Ok(()) => Ok(ProjectMutationLease { file }),
        // Windows maps a conflicting LockFile request to PermissionDenied,
        // while Unix platforms normally report WouldBlock.
        Err(error)
            if matches!(
                error.kind(),
                std::io::ErrorKind::WouldBlock | std::io::ErrorKind::PermissionDenied
            ) || matches!(error.raw_os_error(), Some(32 | 33)) =>
        {
            Err(failure(
            "PROJECT_STORE_BUSY",
            "Another local DiceBox process currently owns the fixed-root project-store mutation lease.",
            "after-holder-exit-and-reread",
        ))
        }
        Err(error) => Err(failure(
            "PROJECT_STORE_LEASE_UNAVAILABLE",
            format!("Fixed-root project-store mutation lease could not be acquired: {error}"),
            "after-reread",
        )),
    }
}

fn sha256(bytes: &[u8]) -> String {
    format!("{:x}", Sha256::digest(bytes))
}

fn validate_project_id(project_id: &str) -> Result<&str, ProjectStoreFailure> {
    let slug = project_id.strip_prefix("dbx:project:").ok_or_else(|| {
        failure(
            "INVALID_PROJECT_ID",
            "Project ID must use the dbx:project namespace.",
            "never",
        )
    })?;
    if slug.is_empty()
        || slug.len() > 80
        || !slug.chars().all(|character| {
            character.is_ascii_lowercase() || character.is_ascii_digit() || character == '-'
        })
    {
        return Err(failure(
            "INVALID_PROJECT_ID",
            "Project slug must contain only lowercase ASCII letters, digits, and hyphens.",
            "never",
        ));
    }
    let reserved = matches!(slug, "con" | "prn" | "aux" | "nul")
        || (slug.len() == 4
            && matches!(&slug[..3], "com" | "lpt")
            && matches!(slug.as_bytes()[3], b'1'..=b'9'));
    if reserved {
        return Err(failure(
            "RESERVED_PROJECT_ID",
            "Project slug is reserved by Windows device naming.",
            "never",
        ));
    }
    Ok(slug)
}

fn ensure_not_reparse(path: &Path, label: &str) -> Result<(), ProjectStoreFailure> {
    let metadata = match fs::symlink_metadata(path) {
        Ok(metadata) => metadata,
        Err(error) if error.kind() == std::io::ErrorKind::NotFound => return Ok(()),
        Err(error) => {
            return Err(failure(
                "PROJECT_PATH_UNAVAILABLE",
                format!("{label} metadata is unavailable: {error}"),
                "after-reread",
            ))
        }
    };
    #[cfg(windows)]
    if metadata.file_attributes() & 0x400 != 0 {
        return Err(failure(
            "PROJECT_PATH_REPARSE_POINT",
            format!("{label} must not be a Windows reparse point."),
            "never",
        ));
    }
    #[cfg(not(windows))]
    if metadata.file_type().is_symlink() {
        return Err(failure(
            "PROJECT_PATH_REPARSE_POINT",
            format!("{label} must not be a symbolic link."),
            "never",
        ));
    }
    Ok(())
}

fn validate_sha256(value: &str) -> Result<&str, ProjectStoreFailure> {
    if value.len() != 64
        || !value
            .bytes()
            .all(|byte| byte.is_ascii_hexdigit() && !byte.is_ascii_uppercase())
    {
        return Err(failure(
            "INVALID_ASSET_ID",
            "Stored asset identity must be a lowercase SHA-256 digest.",
            "never",
        ));
    }
    Ok(value)
}

fn canonical_asset_relative_path(sha256: &str) -> Result<String, ProjectStoreFailure> {
    Ok(format!("assets/sha256/{}", validate_sha256(sha256)?))
}

fn validate_asset_registration(
    registration: &ProjectAssetRegistration,
    digest: &str,
) -> Result<(), ProjectStoreFailure> {
    let expected_id = format!("dbx:asset:sha256-{digest}");
    if registration.asset_id != expected_id
        || !matches!(registration.role.as_str(), "background" | "handout" | "audio" | "token")
        || registration.approval != "approved"
        || registration.label.is_empty()
        || registration.label.trim() != registration.label
        || registration.label.chars().count() > 100
        || registration.label.chars().any(char::is_control)
        || registration.provenance.is_empty()
        || registration.provenance.trim() != registration.provenance
        || registration.provenance.chars().count() > 200
        || registration.provenance.chars().any(char::is_control)
    {
        return Err(failure("INVALID_ASSET_REGISTRATION", "Asset registration identity, role, approval, label, or provenance is invalid.", "never"));
    }
    Ok(())
}

fn validate_registered_media(media_type: &str, bytes: &[u8]) -> Result<(), ProjectStoreFailure> {
    let valid = match media_type {
        "image/png" => bytes.starts_with(&[137, 80, 78, 71, 13, 10, 26, 10]),
        "image/webp" => bytes.len() >= 12 && &bytes[..4] == b"RIFF" && &bytes[8..12] == b"WEBP",
        "audio/wav" => bytes.len() >= 12 && &bytes[..4] == b"RIFF" && &bytes[8..12] == b"WAVE",
        _ => false,
    };
    if !valid {
        return Err(failure("ASSET_MEDIA_MISMATCH", "Registered asset bytes must match an allowed PNG, WebP, or WAV signature and MIME type.", "never"));
    }
    Ok(())
}

fn validate_registered_role_media(
    role: &str,
    media_type: &str,
) -> Result<(), ProjectStoreFailure> {
    let valid = match role {
        "background" | "handout" | "token" => matches!(media_type, "image/png" | "image/webp"),
        "audio" => media_type == "audio/wav",
        _ => false,
    };
    if !valid {
        return Err(failure(
            "INVALID_ASSET_REGISTRATION",
            "Asset registration role does not permit the supplied MIME type.",
            "never",
        ));
    }
    Ok(())
}

fn scene_background_asset_id(scene_json: &str) -> Result<Option<String>, ProjectStoreFailure> {
    let scene: Value = serde_json::from_str(scene_json).map_err(|_| {
        failure(
            "INVALID_SCENE",
            "Canonical Scene JSON could not be reread.",
            "never",
        )
    })?;
    let background = scene
        .get("background")
        .and_then(Value::as_object)
        .ok_or_else(|| {
            failure(
                "INVALID_SCENE",
                "Scene background must be an object.",
                "never",
            )
        })?;
    match background.get("assetId") {
        None => Ok(None),
        Some(Value::String(asset_id))
            if asset_id.starts_with("dbx:asset:")
                && asset_id.len() > "dbx:asset:".len()
                && asset_id["dbx:asset:".len()..].bytes().all(|byte| {
                    byte.is_ascii_lowercase()
                        || byte.is_ascii_digit()
                        || matches!(byte, b'.' | b'_' | b'-')
                }) =>
        {
            Ok(Some(asset_id.clone()))
        }
        Some(_) => Err(failure(
            "INVALID_SCENE_ASSET_REFERENCE",
            "Scene background assetId must be a stable dbx:asset:* identity.",
            "never",
        )),
    }
}

fn detach_scene_background_asset(
    scene_json: &str,
    asset_id: &str,
) -> Result<String, ProjectStoreFailure> {
    let mut scene: Value = serde_json::from_str(scene_json).map_err(|_| {
        failure(
            "INVALID_SCENE",
            "Canonical Scene JSON could not be reread for detach preview.",
            "never",
        )
    })?;
    let background = scene
        .get_mut("background")
        .and_then(Value::as_object_mut)
        .ok_or_else(|| {
            failure(
                "INVALID_SCENE",
                "Scene background must be an object.",
                "never",
            )
        })?;
    if background.get("assetId").and_then(Value::as_str) == Some(asset_id) {
        background.remove("assetId");
    }
    validate_scene_json(&serde_json::to_string(&scene).map_err(|_| {
        failure(
            "INVALID_SCENE",
            "Detached Scene JSON could not be serialized.",
            "never",
        )
    })?)
}

fn validate_scene_json(scene_json: &str) -> Result<String, ProjectStoreFailure> {
    let scene: Value = serde_json::from_str(scene_json)
        .map_err(|_| failure("INVALID_SCENE", "Scene JSON could not be parsed.", "never"))?;
    let object = scene
        .as_object()
        .ok_or_else(|| failure("INVALID_SCENE", "Scene must be a JSON object.", "never"))?;
    if object.get("schemaVersion").and_then(Value::as_str) != Some("0.1.0") {
        return Err(failure(
            "UNSUPPORTED_SCENE_SCHEMA",
            "Only Scene schema 0.1.0 can be persisted.",
            "never",
        ));
    }
    if !object
        .get("id")
        .and_then(Value::as_str)
        .is_some_and(|id| id.starts_with("dbx:scene:"))
    {
        return Err(failure(
            "INVALID_SCENE",
            "Scene ID must use the dbx:scene namespace.",
            "never",
        ));
    }
    let entities = object
        .get("entities")
        .and_then(Value::as_array)
        .ok_or_else(|| failure("INVALID_SCENE", "Scene entities must be an array.", "never"))?;
    let mut ids = BTreeSet::new();
    for entity in entities {
        let id = entity
            .as_object()
            .and_then(|value| value.get("id"))
            .and_then(Value::as_str)
            .ok_or_else(|| {
                failure(
                    "INVALID_SCENE",
                    "Every Scene entity needs a stable ID.",
                    "never",
                )
            })?;
        if !id.starts_with("dbx:") || !ids.insert(id.to_string()) {
            return Err(failure(
                "INVALID_SCENE",
                "Scene entity IDs must be stable and unique.",
                "never",
            ));
        }
    }
    scene_background_asset_id(scene_json)?;
    serde_json::to_string(&scene).map_err(|_| {
        failure(
            "INVALID_SCENE",
            "Scene JSON could not be canonicalized.",
            "never",
        )
    })
}

fn scene_id(scene_json: &str) -> Result<String, ProjectStoreFailure> {
    let scene: Value = serde_json::from_str(scene_json).map_err(|_| {
        failure(
            "INVALID_SCENE",
            "Canonical Scene JSON could not be reread.",
            "never",
        )
    })?;
    scene
        .get("id")
        .and_then(Value::as_str)
        .map(ToString::to_string)
        .ok_or_else(|| {
            failure(
                "INVALID_SCENE",
                "Scene ID must use the dbx:scene namespace.",
                "never",
            )
        })
}

fn validate_scene_collection(
    scenes_json: Vec<String>,
    active_scene_id: &str,
) -> Result<Vec<ProjectSceneEnvelope>, ProjectStoreFailure> {
    if scenes_json.is_empty() || scenes_json.len() > MAX_PROJECT_SCENES {
        return Err(failure(
            "INVALID_SCENE_COLLECTION",
            "A project must contain 1–256 Scenes.",
            "never",
        ));
    }
    let mut ids = BTreeSet::new();
    let mut scenes = Vec::with_capacity(scenes_json.len());
    for scene_json in scenes_json {
        let canonical = validate_scene_json(&scene_json)?;
        let id = scene_id(&canonical)?;
        if !ids.insert(id.clone()) {
            return Err(failure(
                "DUPLICATE_SCENE_ID",
                "Project Scene IDs must be unique.",
                "never",
            ));
        }
        scenes.push(ProjectSceneEnvelope {
            scene_id: id,
            scene_sha256: sha256(canonical.as_bytes()),
            scene_json: canonical,
        });
    }
    if !ids.contains(active_scene_id) {
        return Err(failure(
            "INVALID_ACTIVE_SCENE",
            "activeSceneId must identify exactly one stored Scene.",
            "never",
        ));
    }
    Ok(scenes)
}

fn project_paths(
    root: &Path,
    project_id: &str,
) -> Result<(PathBuf, PathBuf, PathBuf), ProjectStoreFailure> {
    let slug = validate_project_id(project_id)?;
    let project_dir = root.join("projects").join(slug);
    Ok((
        project_dir.join("project.json"),
        project_dir.join("project.backup.json"),
        project_dir,
    ))
}

fn workspace_index_paths(root: &Path) -> (PathBuf, PathBuf, PathBuf) {
    (
        root.join("workspace-index.json"),
        root.join("workspace-index.backup.json"),
        root.join("workspace-index.corrupt.pending"),
    )
}

fn default_display_name(project_id: &str) -> Result<String, ProjectStoreFailure> {
    let slug = validate_project_id(project_id)?;
    let display_name = slug
        .split('-')
        .filter(|part| !part.is_empty())
        .map(|part| {
            let mut characters = part.chars();
            match characters.next() {
                Some(first) => format!("{}{}", first.to_ascii_uppercase(), characters.as_str()),
                None => String::new(),
            }
        })
        .collect::<Vec<_>>()
        .join(" ");
    validate_display_name(&display_name)?;
    Ok(display_name)
}

fn validate_display_name(display_name: &str) -> Result<&str, ProjectStoreFailure> {
    if display_name.is_empty()
        || display_name.trim() != display_name
        || display_name.chars().count() > MAX_DISPLAY_NAME_CHARS
        || display_name.chars().any(char::is_control)
    {
        return Err(failure(
            "INVALID_PROJECT_DISPLAY_NAME",
            "Project display name must be 1–100 non-control characters with no leading or trailing whitespace.",
            "never",
        ));
    }
    Ok(display_name)
}

fn workspace_index_content_hash(envelope: &WorkspaceIndexEnvelope) -> String {
    let mut canonical = format!(
        "{}\n{}\n{}\n",
        envelope.schema_version, envelope.generation, envelope.next_sequence,
    );
    for (project_id, entry) in &envelope.entries {
        canonical.push_str(&format!(
            "{}\n{}\n{}\n",
            project_id, entry.display_name, entry.last_opened_sequence,
        ));
    }
    sha256(canonical.as_bytes())
}

fn default_workspace_index() -> WorkspaceIndexEnvelope {
    let mut envelope = WorkspaceIndexEnvelope {
        schema_version: WORKSPACE_INDEX_SCHEMA_VERSION.to_string(),
        generation: 0,
        next_sequence: 1,
        entries: BTreeMap::new(),
        content_sha256: String::new(),
    };
    envelope.content_sha256 = workspace_index_content_hash(&envelope);
    envelope
}

fn validate_workspace_index(
    envelope: WorkspaceIndexEnvelope,
) -> Result<WorkspaceIndexEnvelope, ProjectStoreFailure> {
    if envelope.schema_version != WORKSPACE_INDEX_SCHEMA_VERSION {
        return Err(failure(
            "UNSUPPORTED_WORKSPACE_INDEX_SCHEMA",
            "Workspace metadata schema is unsupported and cannot be mutated.",
            "never",
        ));
    }
    if envelope.next_sequence == 0 {
        return Err(failure(
            "WORKSPACE_INDEX_CORRUPT",
            "Workspace metadata next sequence must be positive.",
            "after-reread",
        ));
    }
    let mut sequences = BTreeSet::new();
    for (project_id, entry) in &envelope.entries {
        validate_project_id(project_id)?;
        validate_display_name(&entry.display_name)?;
        if entry.last_opened_sequence >= envelope.next_sequence
            || (entry.last_opened_sequence > 0 && !sequences.insert(entry.last_opened_sequence))
        {
            return Err(failure(
                "WORKSPACE_INDEX_CORRUPT",
                "Workspace metadata sequences must be unique, monotonic, and below nextSequence.",
                "after-reread",
            ));
        }
    }
    if workspace_index_content_hash(&envelope) != envelope.content_sha256 {
        return Err(failure(
            "WORKSPACE_INDEX_HASH_MISMATCH",
            "Workspace metadata hash does not match its canonical content.",
            "after-reread",
        ));
    }
    Ok(envelope)
}

fn read_workspace_index_file(path: &Path) -> Result<WorkspaceIndexEnvelope, ProjectStoreFailure> {
    ensure_not_reparse(path, "Workspace metadata index")?;
    let bytes = fs::read(path).map_err(|error| {
        failure(
            "WORKSPACE_INDEX_UNAVAILABLE",
            format!("Workspace metadata could not be read: {error}"),
            "after-reread",
        )
    })?;
    let envelope: WorkspaceIndexEnvelope = serde_json::from_slice(&bytes).map_err(|_| {
        failure(
            "WORKSPACE_INDEX_CORRUPT",
            "Workspace metadata is not valid JSON.",
            "after-reread",
        )
    })?;
    validate_workspace_index(envelope)
}

struct WorkspaceIndexState {
    envelope: WorkspaceIndexEnvelope,
    recovered_from: Option<String>,
    warning: Option<String>,
    writable: bool,
}

fn read_workspace_index_state(root: &Path) -> Result<WorkspaceIndexState, ProjectStoreFailure> {
    ensure_not_reparse(root, "Project-store root")?;
    let (primary, backup, _) = workspace_index_paths(root);
    let primary_exists = primary.exists();
    let backup_exists = backup.exists();
    if primary_exists {
        match read_workspace_index_file(&primary) {
            Ok(envelope) => {
                return Ok(WorkspaceIndexState {
                    envelope,
                    recovered_from: None,
                    warning: None,
                    writable: true,
                })
            }
            Err(primary_error) => {
                if backup_exists {
                    if let Ok(envelope) = read_workspace_index_file(&backup) {
                        return Ok(WorkspaceIndexState {
                            envelope,
                            recovered_from: Some("workspace-index.backup.json".to_string()),
                            warning: Some(primary_error.code),
                            writable: true,
                        });
                    }
                }
                return Ok(WorkspaceIndexState {
                    envelope: default_workspace_index(),
                    recovered_from: None,
                    warning: Some(primary_error.code),
                    writable: false,
                });
            }
        }
    }
    if backup_exists {
        return match read_workspace_index_file(&backup) {
            Ok(envelope) => Ok(WorkspaceIndexState {
                envelope,
                recovered_from: Some("workspace-index.backup.json".to_string()),
                warning: Some("WORKSPACE_INDEX_PRIMARY_MISSING".to_string()),
                writable: true,
            }),
            Err(backup_error) => Ok(WorkspaceIndexState {
                envelope: default_workspace_index(),
                recovered_from: None,
                warning: Some(backup_error.code),
                writable: false,
            }),
        };
    }
    Ok(WorkspaceIndexState {
        envelope: default_workspace_index(),
        recovered_from: None,
        warning: None,
        writable: true,
    })
}

fn content_hash(envelope: &ProjectEnvelope) -> String {
    let mut canonical = format!(
        "{}\n{}\n{}\n{}\n",
        envelope.schema_version, envelope.project_id, envelope.generation, envelope.active_scene_id,
    );
    for scene in &envelope.scenes {
        canonical.push_str(&format!("{}\n{}\n", scene.scene_id, scene.scene_sha256));
    }
    for asset in &envelope.assets {
        canonical.push_str(&format!(
            "{}\n{}\n{}\n{}\n",
            asset.sha256, asset.media_type, asset.byte_length, asset.relative_path
        ));
        match &asset.registration {
            Some(registration) => canonical.push_str(&format!(
                "registered\n{}\n{}\n{}\n{}\n{}\n",
                registration.asset_id,
                registration.role,
                registration.label,
                registration.provenance,
                registration.approval
            )),
            None => canonical.push_str("unregistered\n"),
        }
    }
    sha256(canonical.as_bytes())
}

fn asset_collection_sha256(assets: &[StoredAsset]) -> String {
    let mut canonical = String::new();
    for asset in assets {
        canonical.push_str(&format!(
            "{}\n{}\n{}\n{}\n",
            asset.sha256, asset.media_type, asset.byte_length, asset.relative_path
        ));
        match &asset.registration {
            Some(registration) => canonical.push_str(&format!(
                "registered\n{}\n{}\n{}\n{}\n{}\n",
                registration.asset_id,
                registration.role,
                registration.label,
                registration.provenance,
                registration.approval
            )),
            None => canonical.push_str("unregistered\n"),
        }
    }
    sha256(canonical.as_bytes())
}

fn legacy_content_hash(envelope: &LegacyProjectEnvelope) -> String {
    let mut canonical = format!(
        "{}\n{}\n{}\n{}\n",
        envelope.schema_version, envelope.project_id, envelope.generation, envelope.scene_sha256,
    );
    for asset in &envelope.assets {
        canonical.push_str(&format!(
            "{}\n{}\n{}\n{}\n",
            asset.sha256, asset.media_type, asset.byte_length, asset.relative_path
        ));
    }
    sha256(canonical.as_bytes())
}

fn multi_scene_legacy_content_hash(envelope: &ProjectEnvelope) -> String {
    let mut canonical = format!(
        "{}\n{}\n{}\n{}\n",
        envelope.schema_version, envelope.project_id, envelope.generation, envelope.active_scene_id,
    );
    for scene in &envelope.scenes {
        canonical.push_str(&format!("{}\n{}\n", scene.scene_id, scene.scene_sha256));
    }
    for asset in &envelope.assets {
        canonical.push_str(&format!(
            "{}\n{}\n{}\n{}\n",
            asset.sha256, asset.media_type, asset.byte_length, asset.relative_path
        ));
    }
    sha256(canonical.as_bytes())
}

fn validate_assets(assets: &[StoredAsset]) -> Result<(), ProjectStoreFailure> {
    let mut asset_ids = BTreeSet::new();
    let mut registrations = BTreeSet::new();
    for asset in assets {
        let expected_path = canonical_asset_relative_path(&asset.sha256)?;
        if asset.relative_path != expected_path {
            return Err(failure(
                "INVALID_ASSET_PATH",
                "Stored asset path does not match its content identity.",
                "never",
            ));
        }
        if asset.media_type.is_empty()
            || asset.media_type.len() > 100
            || asset.byte_length == 0
            || asset.byte_length > MAX_ASSET_BYTES
        {
            return Err(failure(
                "INVALID_ASSET",
                "Stored asset metadata is outside the project-store contract.",
                "never",
            ));
        }
        if !asset_ids.insert(asset.sha256.clone()) {
            return Err(failure(
                "INVALID_ASSET",
                "Stored asset identities must be unique.",
                "never",
            ));
        }
        if let Some(registration) = &asset.registration {
            validate_asset_registration(registration, &asset.sha256)?;
            validate_registered_role_media(&registration.role, &asset.media_type)?;
            if !matches!(asset.media_type.as_str(), "image/png" | "image/webp" | "audio/wav")
                || !registrations.insert(registration.asset_id.clone())
            {
                return Err(failure(
                    "INVALID_ASSET_REGISTRATION",
                    "Registered asset IDs must be unique PNG, WebP, or WAV assets.",
                    "never",
                ));
            }
        }
    }
    Ok(())
}

fn validate_scene_asset_bindings(
    scenes: &[ProjectSceneEnvelope],
    assets: &[StoredAsset],
) -> Result<(), ProjectStoreFailure> {
    let registered = assets
        .iter()
        .filter_map(|asset| {
            asset
                .registration
                .as_ref()
                .map(|registration| (registration.asset_id.as_str(), registration.role.as_str()))
        })
        .collect::<BTreeMap<_, _>>();
    for scene in scenes {
        if let Some(asset_id) = scene_background_asset_id(&scene.scene_json)? {
            if !registered.contains_key(asset_id.as_str()) {
                return Err(failure(
                    "BACKGROUND_ASSET_MISSING",
                    format!(
                        "Scene {} references an unregistered background asset.",
                        scene.scene_id
                    ),
                    "after-reread",
                ));
            }
            if registered.get(asset_id.as_str()) != Some(&"background") {
                return Err(failure(
                    "BACKGROUND_ASSET_ROLE_MISMATCH",
                    format!("Scene {} references a non-background registered asset.", scene.scene_id),
                    "never",
                ));
            }
        }
    }
    Ok(())
}

fn validate_envelope(envelope: ProjectEnvelope) -> Result<ProjectEnvelope, ProjectStoreFailure> {
    if envelope.schema_version != PROJECT_SCHEMA_VERSION {
        return Err(failure(
            "UNSUPPORTED_PROJECT_SCHEMA",
            "Project schema requires a migration preview before loading.",
            "never",
        ));
    }
    validate_project_id(&envelope.project_id)?;
    let scenes_json = envelope
        .scenes
        .iter()
        .map(|scene| scene.scene_json.clone())
        .collect();
    let canonical_scenes = validate_scene_collection(scenes_json, &envelope.active_scene_id)?;
    if canonical_scenes
        .iter()
        .zip(&envelope.scenes)
        .any(|(canonical, stored)| {
            canonical.scene_id != stored.scene_id || canonical.scene_sha256 != stored.scene_sha256
        })
    {
        return Err(failure(
            "PROJECT_HASH_MISMATCH",
            "Stored Scene identity or hash does not match canonical Scene content.",
            "after-reread",
        ));
    }
    validate_assets(&envelope.assets)?;
    validate_scene_asset_bindings(&canonical_scenes, &envelope.assets)?;
    if content_hash(&envelope) != envelope.content_sha256 {
        return Err(failure(
            "PROJECT_HASH_MISMATCH",
            "Project envelope hash does not match its content.",
            "after-reread",
        ));
    }
    Ok(ProjectEnvelope {
        scenes: canonical_scenes,
        ..envelope
    })
}

fn validate_multi_scene_legacy_envelope(
    envelope: ProjectEnvelope,
) -> Result<ProjectEnvelope, ProjectStoreFailure> {
    if envelope.schema_version != MULTI_SCENE_PROJECT_SCHEMA_VERSION
        || envelope
            .assets
            .iter()
            .any(|asset| asset.registration.is_some())
    {
        return Err(failure(
            "UNSUPPORTED_PROJECT_SCHEMA",
            "Project schema requires an explicit migration adapter.",
            "never",
        ));
    }
    validate_project_id(&envelope.project_id)?;
    let canonical_scenes = validate_scene_collection(
        envelope
            .scenes
            .iter()
            .map(|scene| scene.scene_json.clone())
            .collect(),
        &envelope.active_scene_id,
    )?;
    if canonical_scenes
        .iter()
        .zip(&envelope.scenes)
        .any(|(canonical, stored)| {
            canonical.scene_id != stored.scene_id || canonical.scene_sha256 != stored.scene_sha256
        })
        || multi_scene_legacy_content_hash(&envelope) != envelope.content_sha256
    {
        return Err(failure(
            "PROJECT_HASH_MISMATCH",
            "Legacy multi-Scene envelope hash does not match canonical content.",
            "after-reread",
        ));
    }
    validate_assets(&envelope.assets)?;
    Ok(ProjectEnvelope {
        scenes: canonical_scenes,
        ..envelope
    })
}

fn migrate_multi_scene_envelope(mut envelope: ProjectEnvelope) -> ProjectEnvelope {
    envelope.schema_version = PROJECT_SCHEMA_VERSION.to_string();
    envelope.content_sha256 = content_hash(&envelope);
    envelope
}

fn validate_legacy_envelope(
    envelope: LegacyProjectEnvelope,
) -> Result<LegacyProjectEnvelope, ProjectStoreFailure> {
    if envelope.schema_version != LEGACY_PROJECT_SCHEMA_VERSION {
        return Err(failure(
            "UNSUPPORTED_PROJECT_SCHEMA",
            "Project schema requires an explicit migration adapter.",
            "never",
        ));
    }
    validate_project_id(&envelope.project_id)?;
    let canonical_scene = validate_scene_json(&envelope.scene_json)?;
    if sha256(canonical_scene.as_bytes()) != envelope.scene_sha256
        || legacy_content_hash(&envelope) != envelope.content_sha256
    {
        return Err(failure(
            "PROJECT_HASH_MISMATCH",
            "Legacy project envelope hash does not match canonical content.",
            "after-reread",
        ));
    }
    validate_assets(&envelope.assets)?;
    Ok(LegacyProjectEnvelope {
        scene_json: canonical_scene,
        ..envelope
    })
}

fn migrate_legacy_envelope(
    envelope: LegacyProjectEnvelope,
) -> Result<ProjectEnvelope, ProjectStoreFailure> {
    let active_scene_id = scene_id(&envelope.scene_json)?;
    let scenes = validate_scene_collection(vec![envelope.scene_json], &active_scene_id)?;
    let mut migrated = ProjectEnvelope {
        schema_version: PROJECT_SCHEMA_VERSION.to_string(),
        project_id: envelope.project_id,
        generation: envelope.generation,
        scenes,
        active_scene_id,
        assets: envelope.assets,
        content_sha256: String::new(),
    };
    migrated.content_sha256 = content_hash(&migrated);
    Ok(migrated)
}

fn read_envelope(path: &Path) -> Result<ReadProjectEnvelope, ProjectStoreFailure> {
    ensure_not_reparse(path, "Project envelope")?;
    let bytes = fs::read(path).map_err(|error| {
        failure(
            "PROJECT_UNAVAILABLE",
            format!("Project could not be read: {error}"),
            "after-reread",
        )
    })?;
    let value: Value = serde_json::from_slice(&bytes).map_err(|_| {
        failure(
            "PROJECT_CORRUPT",
            "Project envelope is not valid JSON.",
            "after-reread",
        )
    })?;
    match value.get("schemaVersion").and_then(Value::as_str) {
        Some(PROJECT_SCHEMA_VERSION) => {
            let envelope: ProjectEnvelope = serde_json::from_value(value).map_err(|_| {
                failure(
                    "PROJECT_CORRUPT",
                    "Project envelope 0.3.0 is malformed.",
                    "after-reread",
                )
            })?;
            let envelope = validate_envelope(envelope)?;
            Ok(ReadProjectEnvelope {
                persisted_content_sha256: envelope.content_sha256.clone(),
                envelope,
                source_schema_version: PROJECT_SCHEMA_VERSION.to_string(),
                migration_status: "current".to_string(),
            })
        }
        Some(MULTI_SCENE_PROJECT_SCHEMA_VERSION) => {
            let envelope: ProjectEnvelope = serde_json::from_value(value).map_err(|_| {
                failure(
                    "PROJECT_CORRUPT",
                    "Legacy multi-Scene project envelope 0.2.0 is malformed.",
                    "after-reread",
                )
            })?;
            let envelope = validate_multi_scene_legacy_envelope(envelope)?;
            let persisted_content_sha256 = envelope.content_sha256.clone();
            Ok(ReadProjectEnvelope {
                envelope: migrate_multi_scene_envelope(envelope),
                persisted_content_sha256,
                source_schema_version: MULTI_SCENE_PROJECT_SCHEMA_VERSION.to_string(),
                migration_status: "migrated-in-memory".to_string(),
            })
        }
        Some(LEGACY_PROJECT_SCHEMA_VERSION) => {
            let legacy: LegacyProjectEnvelope = serde_json::from_value(value).map_err(|_| {
                failure(
                    "PROJECT_CORRUPT",
                    "Legacy project envelope 0.1.0 is malformed.",
                    "after-reread",
                )
            })?;
            let legacy = validate_legacy_envelope(legacy)?;
            let persisted_content_sha256 = legacy.content_sha256.clone();
            Ok(ReadProjectEnvelope {
                envelope: migrate_legacy_envelope(legacy)?,
                persisted_content_sha256,
                source_schema_version: LEGACY_PROJECT_SCHEMA_VERSION.to_string(),
                migration_status: "migrated-in-memory".to_string(),
            })
        }
        _ => Err(failure(
            "UNSUPPORTED_PROJECT_SCHEMA",
            "Project schema requires an explicit migration adapter.",
            "never",
        )),
    }
}

fn read_primary_or_backup(
    root: &Path,
    project_id: &str,
) -> Result<(ReadProjectEnvelope, Option<String>), ProjectStoreFailure> {
    ensure_not_reparse(root, "Project-store root")?;
    let projects = root.join("projects");
    ensure_not_reparse(&projects, "Projects directory")?;
    let (primary, backup, project_dir) = project_paths(root, project_id)?;
    ensure_not_reparse(&project_dir, "Project directory")?;
    match read_envelope(&primary) {
        Ok(envelope) => Ok((envelope, None)),
        Err(primary_error) => match read_envelope(&backup) {
            Ok(envelope) => Ok((envelope, Some("project.backup.json".to_string()))),
            Err(_) => Err(primary_error),
        },
    }
}

fn write_synced(path: &Path, bytes: &[u8]) -> Result<(), ProjectStoreFailure> {
    let mut file = OpenOptions::new()
        .write(true)
        .create_new(true)
        .open(path)
        .map_err(|error| {
            failure(
                "PROJECT_WRITE_BLOCKED",
                format!("Staged project file could not be created: {error}"),
                "after-reread",
            )
        })?;
    file.write_all(bytes)
        .and_then(|_| file.sync_all())
        .map_err(|error| {
            failure(
                "PROJECT_WRITE_UNKNOWN",
                format!("Staged project write may be incomplete: {error}"),
                "after-reread",
            )
        })
}

fn write_workspace_synced(path: &Path, bytes: &[u8]) -> Result<(), ProjectStoreFailure> {
    let mut file = OpenOptions::new()
        .write(true)
        .create_new(true)
        .open(path)
        .map_err(|error| {
            failure(
                "WORKSPACE_INDEX_WRITE_BLOCKED",
                format!("Staged workspace metadata could not be created: {error}"),
                "after-reread",
            )
        })?;
    file.write_all(bytes)
        .and_then(|_| file.sync_all())
        .map_err(|error| {
            failure(
                "WORKSPACE_INDEX_WRITE_UNKNOWN",
                format!("Staged workspace metadata write may be incomplete: {error}"),
                "after-reread",
            )
        })
}

fn sync_directory_entries(
    directory: &Path,
    code: &str,
    label: &str,
) -> Result<(), ProjectStoreFailure> {
    ensure_not_reparse(directory, label)?;
    let mut options = OpenOptions::new();
    #[cfg(windows)]
    {
        options
            .read(true)
            .write(true)
            .custom_flags(0x0200_0000);
    }
    #[cfg(not(windows))]
    options.read(true);
    let handle = options.open(directory).map_err(|error| {
        failure(
            code,
            format!("{label} could not be opened for directory-entry synchronization: {error}"),
            "after-reread",
        )
    })?;
    handle.sync_all().map_err(|error| {
        failure(
            code,
            format!("{label} directory-entry synchronization is unknown: {error}"),
            "after-reread",
        )
    })
}

fn commit_workspace_index(
    root: &Path,
    envelope: WorkspaceIndexEnvelope,
    recovered_from: Option<&str>,
    operation: &str,
    project_id: &str,
    force_promotion_failure: bool,
) -> Result<WorkspaceMetadataReceipt, ProjectStoreFailure> {
    ensure_not_reparse(root, "Project-store root")?;
    fs::create_dir_all(root).map_err(|error| {
        failure(
            "PROJECT_STORE_UNAVAILABLE",
            format!("Project-store root could not be created: {error}"),
            "after-reread",
        )
    })?;
    ensure_not_reparse(root, "Project-store root")?;
    let (primary, backup, corrupt_quarantine) = workspace_index_paths(root);
    let staged = root.join(format!(
        "workspace-index.{}.pending",
        envelope.content_sha256
    ));
    if staged.exists() {
        ensure_not_reparse(&staged, "Pending workspace metadata")?;
        fs::remove_file(&staged).map_err(|error| {
            failure(
                "WORKSPACE_INDEX_RECOVERY_BLOCKED",
                format!("Owned pending workspace metadata could not be cleared: {error}"),
                "after-reread",
            )
        })?;
    }
    let serialized = serde_json::to_vec(&envelope).map_err(|_| {
        failure(
            "WORKSPACE_INDEX_SERIALIZATION_FAILED",
            "Workspace metadata could not be serialized.",
            "never",
        )
    })?;
    write_workspace_synced(&staged, &serialized)?;
    let had_primary = primary.exists();
    let recovered_from_backup = recovered_from == Some("workspace-index.backup.json");
    if had_primary {
        ensure_not_reparse(&primary, "Primary workspace metadata")?;
        if recovered_from_backup {
            read_workspace_index_file(&backup)?;
            if corrupt_quarantine.exists() {
                return Err(failure(
                    "WORKSPACE_INDEX_RECOVERY_BLOCKED",
                    "Workspace corrupt-primary quarantine already exists; reread is required.",
                    "after-reread",
                ));
            }
            fs::rename(&primary, &corrupt_quarantine).map_err(|error| {
                failure(
                    "WORKSPACE_INDEX_BACKUP_UNKNOWN",
                    format!("Workspace corrupt-primary quarantine outcome is unknown: {error}"),
                    "after-reread",
                )
            })?;
        } else {
            read_workspace_index_file(&primary)?;
            if backup.exists() {
                ensure_not_reparse(&backup, "Backup workspace metadata")?;
                fs::remove_file(&backup).map_err(|error| {
                    failure(
                        "WORKSPACE_INDEX_BACKUP_BLOCKED",
                        format!("Owned workspace metadata backup could not be replaced: {error}"),
                        "after-reread",
                    )
                })?;
            }
            fs::rename(&primary, &backup).map_err(|error| {
                failure(
                    "WORKSPACE_INDEX_BACKUP_UNKNOWN",
                    format!("Workspace metadata backup outcome is unknown: {error}"),
                    "after-reread",
                )
            })?;
        }
    }
    let promotion = if force_promotion_failure {
        Err(std::io::Error::new(
            std::io::ErrorKind::Other,
            "forced workspace promotion failure",
        ))
    } else {
        fs::rename(&staged, &primary)
    };
    if let Err(error) = promotion {
        if recovered_from_backup && corrupt_quarantine.exists() && !primary.exists() {
            let _ = fs::rename(&corrupt_quarantine, &primary);
        } else if had_primary && backup.exists() && !primary.exists() {
            let _ = fs::rename(&backup, &primary);
        }
        return Err(failure(
            "WORKSPACE_INDEX_COMMIT_UNKNOWN",
            format!("Workspace metadata promotion outcome is unknown: {error}"),
            "after-reread",
        ));
    }
    let reread = read_workspace_index_file(&primary)?;
    if reread.content_sha256 != envelope.content_sha256 {
        return Err(failure(
            "WORKSPACE_INDEX_REREAD_FAILED",
            "Committed workspace metadata did not match the staged content hash.",
            "after-reread",
        ));
    }
    if recovered_from_backup && corrupt_quarantine.exists() {
        fs::remove_file(&corrupt_quarantine).map_err(|error| {
            failure(
                "WORKSPACE_INDEX_RECOVERY_BLOCKED",
                format!("Owned workspace corrupt-primary quarantine could not be cleared: {error}"),
                "after-reread",
            )
        })?;
    }
    sync_directory_entries(
        root,
        "WORKSPACE_INDEX_DIRECTORY_SYNC_UNKNOWN",
        "Project-store root",
    )?;
    let entry = reread.entries.get(project_id).ok_or_else(|| {
        failure(
            "WORKSPACE_INDEX_REREAD_FAILED",
            "Committed workspace metadata omitted the exact target project.",
            "after-reread",
        )
    })?;
    Ok(WorkspaceMetadataReceipt {
        operation: operation.to_string(),
        status: "PASS".to_string(),
        project_id: project_id.to_string(),
        display_name: entry.display_name.clone(),
        last_opened_sequence: entry.last_opened_sequence,
        index_generation: reread.generation,
        content_sha256: reread.content_sha256,
        recovered_from: recovered_from.map(ToString::to_string),
        atomic_replace: true,
        directory_entry_sync: true,
        backup_preserved: backup.exists(),
        no_foundry_write: true,
    })
}

fn current_workspace_index_for_write(
    root: &Path,
    expected_generation: u64,
) -> Result<WorkspaceIndexState, ProjectStoreFailure> {
    let state = read_workspace_index_state(root)?;
    if !state.writable {
        let code = state
            .warning
            .as_deref()
            .unwrap_or("WORKSPACE_INDEX_CORRUPT");
        return Err(failure(
            code,
            "Workspace metadata is not safely writable; valid project content remains readable.",
            "after-reread",
        ));
    }
    if state.envelope.generation != expected_generation {
        return Err(failure(
            "STALE_WORKSPACE_INDEX_GENERATION",
            format!(
                "Expected workspace metadata generation {expected_generation}, found {}.",
                state.envelope.generation,
            ),
            "after-reread",
        ));
    }
    Ok(state)
}

pub fn touch_workspace_project_at(
    root: &Path,
    project_id: &str,
    display_name: Option<&str>,
    expected_generation: u64,
) -> Result<WorkspaceMetadataReceipt, ProjectStoreFailure> {
    let _lease = acquire_project_mutation_lease(root)?;
    touch_workspace_project_unlocked(root, project_id, display_name, expected_generation)
}

fn touch_workspace_project_unlocked(
    root: &Path,
    project_id: &str,
    display_name: Option<&str>,
    expected_generation: u64,
) -> Result<WorkspaceMetadataReceipt, ProjectStoreFailure> {
    validate_project_id(project_id)?;
    let (project, _) = read_primary_or_backup(root, project_id)?;
    if project.envelope.project_id != project_id {
        return Err(failure(
            "PROJECT_ID_MISMATCH",
            "Stored project identity does not match the workspace metadata target.",
            "never",
        ));
    }
    let state = current_workspace_index_for_write(root, expected_generation)?;
    let recovered_from = state.recovered_from.clone();
    let mut envelope = state.envelope;
    let current_display_name = envelope
        .entries
        .get(project_id)
        .map(|entry| entry.display_name.clone())
        .unwrap_or(default_display_name(project_id)?);
    let display_name = display_name.unwrap_or(&current_display_name);
    validate_display_name(display_name)?;
    let sequence = envelope.next_sequence;
    envelope.next_sequence = envelope.next_sequence.checked_add(1).ok_or_else(|| {
        failure(
            "WORKSPACE_INDEX_SEQUENCE_EXHAUSTED",
            "Workspace metadata sequence is exhausted.",
            "never",
        )
    })?;
    envelope.generation = envelope.generation.checked_add(1).ok_or_else(|| {
        failure(
            "WORKSPACE_INDEX_GENERATION_EXHAUSTED",
            "Workspace metadata generation is exhausted.",
            "never",
        )
    })?;
    envelope.entries.insert(
        project_id.to_string(),
        WorkspaceIndexEntry {
            display_name: display_name.to_string(),
            last_opened_sequence: sequence,
        },
    );
    envelope.content_sha256 = workspace_index_content_hash(&envelope);
    commit_workspace_index(
        root,
        envelope,
        recovered_from.as_deref(),
        "dicebox.workspace-metadata.touch",
        project_id,
        false,
    )
}

pub fn rename_workspace_project_at(
    root: &Path,
    request: RenameProjectRequest,
) -> Result<WorkspaceMetadataReceipt, ProjectStoreFailure> {
    let _lease = acquire_project_mutation_lease(root)?;
    rename_workspace_project_unlocked(root, request)
}

fn rename_workspace_project_unlocked(
    root: &Path,
    request: RenameProjectRequest,
) -> Result<WorkspaceMetadataReceipt, ProjectStoreFailure> {
    if request.schema_version != WORKSPACE_INDEX_SCHEMA_VERSION {
        return Err(failure(
            "UNSUPPORTED_REQUEST_SCHEMA",
            "Rename request schema is not supported.",
            "never",
        ));
    }
    validate_project_id(&request.project_id)?;
    validate_display_name(&request.display_name)?;
    let (project, _) = read_primary_or_backup(root, &request.project_id)?;
    if project.envelope.project_id != request.project_id {
        return Err(failure(
            "PROJECT_ID_MISMATCH",
            "Stored project identity does not match the rename target.",
            "never",
        ));
    }
    let state = current_workspace_index_for_write(root, request.expected_workspace_generation)?;
    let recovered_from = state.recovered_from.clone();
    let mut envelope = state.envelope;
    let last_opened_sequence = envelope
        .entries
        .get(&request.project_id)
        .map(|entry| entry.last_opened_sequence)
        .unwrap_or(0);
    envelope.generation = envelope.generation.checked_add(1).ok_or_else(|| {
        failure(
            "WORKSPACE_INDEX_GENERATION_EXHAUSTED",
            "Workspace metadata generation is exhausted.",
            "never",
        )
    })?;
    envelope.entries.insert(
        request.project_id.clone(),
        WorkspaceIndexEntry {
            display_name: request.display_name,
            last_opened_sequence,
        },
    );
    envelope.content_sha256 = workspace_index_content_hash(&envelope);
    commit_workspace_index(
        root,
        envelope,
        recovered_from.as_deref(),
        "dicebox.workspace-metadata.rename",
        &request.project_id,
        false,
    )
}

fn persist_assets(
    root: &Path,
    inputs: Vec<ProjectAssetInput>,
) -> Result<Vec<StoredAsset>, ProjectStoreFailure> {
    if inputs.len() > 32 {
        return Err(failure(
            "TOO_MANY_ASSETS",
            "A project save may contain at most 32 assets.",
            "never",
        ));
    }
    ensure_not_reparse(root, "Project-store root")?;
    let assets_root = root.join("assets");
    ensure_not_reparse(&assets_root, "Assets directory")?;
    let asset_dir = root.join("assets").join("sha256");
    ensure_not_reparse(&asset_dir, "Content-addressed asset directory")?;
    fs::create_dir_all(&asset_dir).map_err(|error| {
        failure(
            "ASSET_STORE_UNAVAILABLE",
            format!("Asset directory could not be created: {error}"),
            "after-reread",
        )
    })?;
    ensure_not_reparse(&assets_root, "Assets directory")?;
    ensure_not_reparse(&asset_dir, "Content-addressed asset directory")?;
    let mut stored = Vec::with_capacity(inputs.len());
    for input in inputs {
        if input.media_type.is_empty()
            || input.media_type.len() > 100
            || input.bytes.is_empty()
            || input.bytes.len() > MAX_ASSET_BYTES
        {
            return Err(failure(
                "INVALID_ASSET",
                "Asset type and byte length are outside the project-store contract.",
                "never",
            ));
        }
        let digest = sha256(&input.bytes);
        if let Some(registration) = &input.registration {
            validate_registered_media(&input.media_type, &input.bytes)?;
            validate_asset_registration(registration, &digest)?;
            validate_registered_role_media(&registration.role, &input.media_type)?;
        }
        let path = asset_dir.join(&digest);
        ensure_not_reparse(&path, "Content-addressed asset")?;
        if path.exists() {
            let mut existing = Vec::new();
            File::open(&path)
                .and_then(|mut file| file.read_to_end(&mut existing))
                .map_err(|error| {
                    failure(
                        "ASSET_STORE_UNAVAILABLE",
                        format!("Existing asset could not be reread: {error}"),
                        "after-reread",
                    )
                })?;
            if sha256(&existing) != digest {
                return Err(failure(
                    "ASSET_HASH_COLLISION",
                    "Existing content-addressed asset does not match its filename.",
                    "never",
                ));
            }
        } else {
            let temp = asset_dir.join(format!("{digest}.pending"));
            if temp.exists() {
                fs::remove_file(&temp).map_err(|error| {
                    failure(
                        "ASSET_RECOVERY_BLOCKED",
                        format!("Owned pending asset could not be cleared: {error}"),
                        "after-reread",
                    )
                })?;
            }
            write_synced(&temp, &input.bytes)?;
            fs::rename(&temp, &path).map_err(|error| {
                failure(
                    "ASSET_WRITE_UNKNOWN",
                    format!("Asset promotion outcome is unknown: {error}"),
                    "after-reread",
                )
            })?;
            sync_directory_entries(
                &asset_dir,
                "ASSET_DIRECTORY_SYNC_UNKNOWN",
                "Content-addressed asset directory",
            )?;
        }
        stored.push(StoredAsset {
            sha256: digest.clone(),
            media_type: input.media_type,
            byte_length: input.bytes.len(),
            relative_path: format!("assets/sha256/{digest}"),
            registration: input.registration,
        });
    }
    stored.sort_by(|left, right| {
        left.sha256
            .cmp(&right.sha256)
            .then(left.media_type.cmp(&right.media_type))
    });
    stored.dedup();
    Ok(stored)
}

fn merge_assets(
    mut current: Vec<StoredAsset>,
    incoming: Vec<StoredAsset>,
) -> Result<Vec<StoredAsset>, ProjectStoreFailure> {
    for asset in incoming {
        match current
            .iter_mut()
            .find(|candidate| candidate.sha256 == asset.sha256)
        {
            Some(existing) => {
                if existing.media_type != asset.media_type
                    || existing.byte_length != asset.byte_length
                    || existing.relative_path != asset.relative_path
                {
                    return Err(failure(
                        "ASSET_REGISTRATION_CONFLICT",
                        "Identical content cannot carry conflicting storage metadata.",
                        "never",
                    ));
                }
                match (&existing.registration, &asset.registration) {
                    (Some(left), Some(right)) if left != right => {
                        return Err(failure(
                            "ASSET_REGISTRATION_CONFLICT",
                            "Stable asset identity already has different registration metadata.",
                            "never",
                        ))
                    }
                    (None, Some(_)) => existing.registration = asset.registration,
                    _ => {}
                }
            }
            None => current.push(asset),
        }
    }
    if current.len() > 32 {
        return Err(failure(
            "TOO_MANY_ASSETS",
            "A project may register at most 32 assets in this workspace slice.",
            "never",
        ));
    }
    current.sort_by(|left, right| left.sha256.cmp(&right.sha256));
    validate_assets(&current)?;
    Ok(current)
}

fn commit_project_envelope(
    root: &Path,
    envelope: ProjectEnvelope,
    recovered_from: Option<&str>,
    force_promotion_failure: bool,
    allow_blocked_primary: bool,
) -> Result<ProjectSaveReceipt, ProjectStoreFailure> {
    ensure_not_reparse(root, "Project-store root")?;
    let projects = root.join("projects");
    ensure_not_reparse(&projects, "Projects directory")?;
    fs::create_dir_all(&projects).map_err(|error| {
        failure(
            "PROJECT_STORE_UNAVAILABLE",
            format!("Projects directory could not be created: {error}"),
            "after-reread",
        )
    })?;
    ensure_not_reparse(&projects, "Projects directory")?;
    let (primary, backup, project_dir) = project_paths(root, &envelope.project_id)?;
    ensure_not_reparse(&project_dir, "Project directory")?;
    fs::create_dir_all(&project_dir).map_err(|error| {
        failure(
            "PROJECT_STORE_UNAVAILABLE",
            format!("Project directory could not be created: {error}"),
            "after-reread",
        )
    })?;
    ensure_not_reparse(&project_dir, "Project directory")?;
    let staged = project_dir.join(format!("project.{}.pending", envelope.content_sha256));
    if staged.exists() {
        ensure_not_reparse(&staged, "Pending project envelope")?;
        fs::remove_file(&staged).map_err(|error| {
            failure(
                "PROJECT_RECOVERY_BLOCKED",
                format!("Owned pending project could not be cleared: {error}"),
                "after-reread",
            )
        })?;
    }
    let serialized = serde_json::to_vec(&envelope).map_err(|_| {
        failure(
            "PROJECT_SERIALIZATION_FAILED",
            "Project envelope could not be serialized.",
            "never",
        )
    })?;
    write_synced(&staged, &serialized)?;
    let had_primary = primary.exists();
    let recovered_from_backup = recovered_from == Some("project.backup.json");
    let corrupt_quarantine = project_dir.join("project.corrupt.pending");
    if had_primary {
        ensure_not_reparse(&primary, "Primary project envelope")?;
        if recovered_from_backup {
            let valid_backup = read_envelope(&backup)?;
            if valid_backup.envelope.project_id != envelope.project_id {
                return Err(failure(
                    "PROJECT_ID_MISMATCH",
                    "Recovered backup identity does not match the project being saved.",
                    "never",
                ));
            }
            if corrupt_quarantine.exists() {
                return Err(failure(
                    "PROJECT_RECOVERY_BLOCKED",
                    "Corrupt-primary quarantine already exists; reread is required before saving.",
                    "after-reread",
                ));
            }
            fs::rename(&primary, &corrupt_quarantine).map_err(|error| {
                failure(
                    "PROJECT_BACKUP_UNKNOWN",
                    format!("Corrupt primary quarantine outcome is unknown: {error}"),
                    "after-reread",
                )
            })?;
        } else {
            if !allow_blocked_primary {
                read_envelope(&primary)?;
            }
            if backup.exists() {
                ensure_not_reparse(&backup, "Backup project envelope")?;
                fs::remove_file(&backup).map_err(|error| {
                    failure(
                        "PROJECT_BACKUP_BLOCKED",
                        format!("Owned project backup could not be replaced: {error}"),
                        "after-reread",
                    )
                })?;
            }
            fs::rename(&primary, &backup).map_err(|error| {
                failure(
                    "PROJECT_BACKUP_UNKNOWN",
                    format!("Project backup outcome is unknown: {error}"),
                    "after-reread",
                )
            })?;
        }
    }
    let promotion = if force_promotion_failure {
        Err(std::io::Error::new(
            std::io::ErrorKind::Other,
            "forced promotion failure",
        ))
    } else {
        fs::rename(&staged, &primary)
    };
    if let Err(error) = promotion {
        if recovered_from_backup && corrupt_quarantine.exists() && !primary.exists() {
            let _ = fs::rename(&corrupt_quarantine, &primary);
        } else if had_primary && backup.exists() && !primary.exists() {
            let _ = fs::rename(&backup, &primary);
        }
        return Err(failure(
            "PROJECT_COMMIT_UNKNOWN",
            format!("Project promotion outcome is unknown: {error}"),
            "after-reread",
        ));
    }
    let reread_bytes = fs::read(&primary).map_err(|error| {
        failure(
            "PROJECT_REREAD_FAILED",
            format!("Committed project could not be reread: {error}"),
            "after-reread",
        )
    })?;
    let reread_value: Value = serde_json::from_slice(&reread_bytes).map_err(|_| {
        failure(
            "PROJECT_REREAD_FAILED",
            "Committed project is not valid JSON.",
            "after-reread",
        )
    })?;
    let reread_envelope: ProjectEnvelope = serde_json::from_value(reread_value).map_err(|_| {
        failure(
            "PROJECT_REREAD_FAILED",
            "Committed project envelope could not be structurally reread.",
            "after-reread",
        )
    })?;
    if reread_envelope.project_id != envelope.project_id
        || reread_envelope.content_sha256 != envelope.content_sha256
        || (!allow_blocked_primary && read_envelope(&primary).is_err())
    {
        return Err(failure(
            "PROJECT_REREAD_FAILED",
            "Committed project did not match the staged content hash.",
            "after-reread",
        ));
    }
    if recovered_from_backup && corrupt_quarantine.exists() {
        fs::remove_file(&corrupt_quarantine).map_err(|error| {
            failure(
                "PROJECT_RECOVERY_BLOCKED",
                format!("Owned corrupt-primary quarantine could not be cleared: {error}"),
                "after-reread",
            )
        })?;
    }
    sync_directory_entries(
        &project_dir,
        "PROJECT_DIRECTORY_SYNC_UNKNOWN",
        "Project directory",
    )?;
    let slug = validate_project_id(&envelope.project_id)?;
    let scenes = envelope
        .scenes
        .iter()
        .map(|scene| ProjectSceneReceipt {
            scene_id: scene.scene_id.clone(),
            scene_sha256: scene.scene_sha256.clone(),
        })
        .collect::<Vec<_>>();
    let active_scene_sha256 = envelope
        .scenes
        .iter()
        .find(|scene| scene.scene_id == envelope.active_scene_id)
        .map(|scene| scene.scene_sha256.clone())
        .ok_or_else(|| {
            failure(
                "PROJECT_REREAD_FAILED",
                "Committed project omitted its active Scene.",
                "after-reread",
            )
        })?;
    Ok(ProjectSaveReceipt {
        operation: "dicebox.project.save".to_string(),
        status: "PASS".to_string(),
        project_id: envelope.project_id.clone(),
        generation: envelope.generation,
        content_sha256: envelope.content_sha256.clone(),
        scene_sha256: active_scene_sha256,
        scene_count: scenes.len(),
        active_scene_id: envelope.active_scene_id.clone(),
        scenes,
        asset_count: envelope.assets.len(),
        project_relative_path: format!("projects/{slug}/project.json"),
        atomic_replace: true,
        directory_entry_sync: true,
        backup_preserved: backup.exists(),
        no_foundry_write: true,
        workspace_metadata: None,
        workspace_metadata_warning: None,
    })
}

pub fn save_project_at(
    root: &Path,
    request: SaveProjectRequest,
) -> Result<ProjectSaveReceipt, ProjectStoreFailure> {
    let _lease = acquire_project_mutation_lease(root)?;
    save_project_unlocked(root, request)
}

fn save_project_unlocked(
    root: &Path,
    request: SaveProjectRequest,
) -> Result<ProjectSaveReceipt, ProjectStoreFailure> {
    if request.schema_version != PROJECT_SCHEMA_VERSION {
        return Err(failure(
            "UNSUPPORTED_REQUEST_SCHEMA",
            "Save request schema is not supported.",
            "never",
        ));
    }
    let scenes = validate_scene_collection(request.scenes_json, &request.active_scene_id)?;
    let (primary, backup, _) = project_paths(root, &request.project_id)?;
    let (current, recovered_from) = if primary.exists() || backup.exists() {
        let (envelope, recovered_from) = read_primary_or_backup(root, &request.project_id)?;
        (Some(envelope), recovered_from)
    } else {
        (None, None)
    };
    let current_generation = current
        .as_ref()
        .map(|value| value.envelope.generation)
        .unwrap_or(0);
    if request.expected_generation != current_generation {
        return Err(failure(
            "STALE_PROJECT_GENERATION",
            format!(
                "Expected generation {}, found {current_generation}.",
                request.expected_generation
            ),
            "after-reread",
        ));
    }
    let current_assets = current
        .as_ref()
        .map(|value| value.envelope.assets.clone())
        .unwrap_or_default();
    let assets = match request.assets {
        Some(inputs) => merge_assets(current_assets, persist_assets(root, inputs)?)?,
        None => current_assets,
    };
    validate_scene_asset_bindings(&scenes, &assets)?;
    let mut envelope = ProjectEnvelope {
        schema_version: PROJECT_SCHEMA_VERSION.to_string(),
        project_id: request.project_id,
        generation: current_generation + 1,
        scenes,
        active_scene_id: request.active_scene_id,
        assets,
        content_sha256: String::new(),
    };
    envelope.content_sha256 = content_hash(&envelope);
    commit_project_envelope(root, envelope, recovered_from.as_deref(), false, false)
}

fn require_absent_project_target(root: &Path, project_id: &str) -> Result<(), ProjectStoreFailure> {
    ensure_not_reparse(root, "Project-store root")?;
    let projects = root.join("projects");
    ensure_not_reparse(&projects, "Projects directory")?;
    let (_, _, project_dir) = project_paths(root, project_id)?;
    if project_dir.exists() {
        return Err(failure(
            "PROJECT_ALREADY_EXISTS",
            "Create and save-as require a wholly absent target project directory.",
            "never",
        ));
    }
    Ok(())
}

pub fn create_project_at(
    root: &Path,
    request: SaveProjectRequest,
) -> Result<ProjectSaveReceipt, ProjectStoreFailure> {
    let _lease = acquire_project_mutation_lease(root)?;
    create_project_unlocked(root, request)
}

fn create_project_unlocked(
    root: &Path,
    request: SaveProjectRequest,
) -> Result<ProjectSaveReceipt, ProjectStoreFailure> {
    if request.schema_version != PROJECT_SCHEMA_VERSION {
        return Err(failure(
            "UNSUPPORTED_REQUEST_SCHEMA",
            "Create request schema is not supported.",
            "never",
        ));
    }
    if request.expected_generation != 0 {
        return Err(failure(
            "INVALID_CREATE_GENERATION",
            "Create requires expected generation zero.",
            "never",
        ));
    }
    require_absent_project_target(root, &request.project_id)?;
    let mut receipt = save_project_unlocked(root, request)?;
    receipt.operation = "dicebox.project.create".to_string();
    Ok(receipt)
}

pub fn save_project_as_at(
    root: &Path,
    request: SaveProjectAsRequest,
) -> Result<ProjectSaveReceipt, ProjectStoreFailure> {
    let _lease = acquire_project_mutation_lease(root)?;
    save_project_as_unlocked(root, request)
}

fn save_project_as_unlocked(
    root: &Path,
    request: SaveProjectAsRequest,
) -> Result<ProjectSaveReceipt, ProjectStoreFailure> {
    if request.schema_version != PROJECT_SCHEMA_VERSION {
        return Err(failure(
            "UNSUPPORTED_REQUEST_SCHEMA",
            "Save-as request schema is not supported.",
            "never",
        ));
    }
    validate_project_id(&request.source_project_id)?;
    validate_project_id(&request.target_project_id)?;
    if request.source_project_id == request.target_project_id {
        return Err(failure(
            "SAVE_AS_TARGET_EQUALS_SOURCE",
            "Save-as requires a distinct target project ID.",
            "never",
        ));
    }
    require_absent_project_target(root, &request.target_project_id)?;
    let scenes = validate_scene_collection(request.scenes_json, &request.active_scene_id)?;
    let source = load_project_at(
        root,
        LoadProjectRequest {
            schema_version: PROJECT_SCHEMA_VERSION.to_string(),
            project_id: request.source_project_id,
            expected_workspace_generation: None,
        },
    )?;
    validate_scene_asset_bindings(&scenes, &source.assets)?;
    let mut envelope = ProjectEnvelope {
        schema_version: PROJECT_SCHEMA_VERSION.to_string(),
        project_id: request.target_project_id,
        generation: 1,
        scenes,
        active_scene_id: request.active_scene_id,
        assets: source.assets,
        content_sha256: String::new(),
    };
    envelope.content_sha256 = content_hash(&envelope);
    let mut receipt = commit_project_envelope(root, envelope, None, false, false)?;
    receipt.operation = "dicebox.project.save-as".to_string();
    Ok(receipt)
}

#[derive(Debug, Clone)]
struct ProjectFileProbe {
    disposition: ProjectRecoveryFileDisposition,
    read: Option<ReadProjectEnvelope>,
    failure: Option<ProjectStoreFailure>,
}

#[derive(Debug, Clone)]
struct ProjectRecoveryContext {
    receipt: ProjectRecoveryInspectionReceipt,
    read: Option<ReadProjectEnvelope>,
}

#[derive(Debug, Clone, PartialEq, Eq)]
struct RecoveryStateSnapshot {
    project_primary_sha256: Option<String>,
    project_backup_sha256: Option<String>,
    workspace_primary_sha256: Option<String>,
    workspace_backup_sha256: Option<String>,
    project_generation: u64,
    project_content_sha256: String,
    active_scene_id: String,
    scenes: Vec<ProjectSceneReceipt>,
    protected_state_sha256: String,
}

fn file_disposition_failure(
    relative_path: &str,
    status: &str,
    failure: ProjectStoreFailure,
) -> ProjectFileProbe {
    ProjectFileProbe {
        disposition: ProjectRecoveryFileDisposition {
            relative_path: relative_path.to_string(),
            status: status.to_string(),
            source_schema_version: None,
            migration_status: None,
            byte_sha256: None,
            blocker_code: Some(failure.code.clone()),
            blocker_message: Some(failure.message.clone()),
            retry: Some(failure.retry.clone()),
        },
        read: None,
        failure: Some(failure),
    }
}

fn probe_project_file(path: &Path, relative_path: &str) -> ProjectFileProbe {
    let metadata = match fs::symlink_metadata(path) {
        Ok(metadata) => metadata,
        Err(error) if error.kind() == std::io::ErrorKind::NotFound => {
            return file_disposition_failure(
                relative_path,
                "MISSING",
                failure(
                    "PROJECT_UNAVAILABLE",
                    format!("{relative_path} is absent."),
                    "after-reread",
                ),
            )
        }
        Err(error) => {
            return file_disposition_failure(
                relative_path,
                "BLOCKED",
                failure(
                    "PROJECT_PATH_UNAVAILABLE",
                    format!("{relative_path} metadata is unavailable: {error}"),
                    "after-reread",
                ),
            )
        }
    };
    if let Err(blocker) = ensure_not_reparse(path, relative_path) {
        return file_disposition_failure(relative_path, "BLOCKED", blocker);
    }
    if !metadata.is_file() {
        return file_disposition_failure(
            relative_path,
            "BLOCKED",
            failure(
                "PROJECT_PATH_UNAVAILABLE",
                format!("{relative_path} is not a regular file."),
                "never",
            ),
        );
    }
    let bytes = match fs::read(path) {
        Ok(bytes) => bytes,
        Err(error) => {
            return file_disposition_failure(
                relative_path,
                "BLOCKED",
                failure(
                    "PROJECT_UNAVAILABLE",
                    format!("{relative_path} could not be read: {error}"),
                    "after-reread",
                ),
            )
        }
    };
    let persisted_schema_version = serde_json::from_slice::<Value>(&bytes)
        .ok()
        .and_then(|value| {
            value
                .get("schemaVersion")
                .and_then(Value::as_str)
                .map(ToString::to_string)
        });
    match read_envelope(path) {
        Ok(read) => ProjectFileProbe {
            disposition: ProjectRecoveryFileDisposition {
                relative_path: relative_path.to_string(),
                status: "VALID".to_string(),
                source_schema_version: Some(read.source_schema_version.clone()),
                migration_status: Some(read.migration_status.clone()),
                byte_sha256: Some(sha256(&bytes)),
                blocker_code: None,
                blocker_message: None,
                retry: None,
            },
            read: Some(read),
            failure: None,
        },
        Err(blocker) => {
            let mut probe = file_disposition_failure(relative_path, "BLOCKED", blocker);
            probe.disposition.source_schema_version = persisted_schema_version;
            if probe.disposition.source_schema_version.is_some() {
                probe.disposition.migration_status = Some("blocked".to_string());
            }
            probe.disposition.byte_sha256 = Some(sha256(&bytes));
            probe
        }
    }
}

fn inspect_broken_scene_asset_references(
    path: &Path,
    source: &str,
    project_id: &str,
) -> Vec<BrokenSceneAssetReferenceInspection> {
    let Ok(bytes) = fs::read(path) else {
        return vec![];
    };
    let Ok(value) = serde_json::from_slice::<Value>(&bytes) else {
        return vec![];
    };
    let Ok(envelope) = serde_json::from_value::<ProjectEnvelope>(value) else {
        return vec![];
    };
    if envelope.schema_version != PROJECT_SCHEMA_VERSION || envelope.project_id != project_id {
        return vec![];
    }
    let registered = envelope
        .assets
        .iter()
        .filter_map(|asset| {
            asset
                .registration
                .as_ref()
                .map(|registration| (registration.asset_id.as_str(), registration.role.as_str()))
        })
        .collect::<BTreeMap<_, _>>();
    let mut references = envelope
        .scenes
        .iter()
        .filter_map(|scene| {
            let asset_id = scene_background_asset_id(&scene.scene_json).ok().flatten()?;
            let (blocker_code, blocker_message, retry) = match registered.get(asset_id.as_str()) {
                None => (
                    "BACKGROUND_ASSET_MISSING",
                    format!(
                        "Scene {} references an unregistered background asset {}.",
                        scene.scene_id, asset_id
                    ),
                    "after-reread",
                ),
                Some(&"background") => return None,
                Some(_) => (
                    "BACKGROUND_ASSET_ROLE_MISMATCH",
                    format!(
                        "Scene {} references a non-background registered asset {}.",
                        scene.scene_id, asset_id
                    ),
                    "never",
                ),
            };
            Some(BrokenSceneAssetReferenceInspection {
                source: source.to_string(),
                scene_id: scene.scene_id.clone(),
                asset_id,
                blocker_code: blocker_code.to_string(),
                blocker_message,
                retry: retry.to_string(),
            })
        })
        .collect::<Vec<_>>();
    references.sort_by(|left, right| {
        left.source
            .cmp(&right.source)
            .then_with(|| left.scene_id.cmp(&right.scene_id))
            .then_with(|| left.asset_id.cmp(&right.asset_id))
    });
    references
}

fn registered_asset_target(
    root: &Path,
    asset: &StoredAsset,
) -> Result<PathBuf, ProjectStoreFailure> {
    ensure_not_reparse(root, "Project-store root")?;
    if asset.relative_path != canonical_asset_relative_path(&asset.sha256)? {
        return Err(failure(
            "INVALID_ASSET_PATH",
            "Stored asset path does not match its content identity.",
            "never",
        ));
    }
    let assets_root = root.join("assets");
    ensure_not_reparse(&assets_root, "Assets directory")?;
    let asset_dir = assets_root.join("sha256");
    ensure_not_reparse(&asset_dir, "Content-addressed asset directory")?;
    for (path, label) in [
        (&assets_root, "Assets directory"),
        (&asset_dir, "Content-addressed asset directory"),
    ] {
        let metadata = fs::symlink_metadata(path).map_err(|error| {
            failure(
                "ASSET_STORE_UNAVAILABLE",
                format!("{label} is unavailable: {error}"),
                "after-reread",
            )
        })?;
        if !metadata.is_dir() {
            return Err(failure(
                "ASSET_STORE_UNAVAILABLE",
                format!("{label} is not a directory."),
                "never",
            ));
        }
    }
    let target = asset_dir.join(validate_sha256(&asset.sha256)?);
    ensure_not_reparse(&target, "Content-addressed asset")?;
    Ok(target)
}

fn inspect_registered_assets(
    root: &Path,
    read: &ReadProjectEnvelope,
) -> Vec<RegisteredAssetRecoveryInspection> {
    let mut inspections = Vec::new();
    for asset in &read.envelope.assets {
        let Some(registration) = &asset.registration else {
            continue;
        };
        let affected_scene_ids = read
            .envelope
            .scenes
            .iter()
            .filter_map(|scene| {
                scene_background_asset_id(&scene.scene_json)
                    .ok()
                    .flatten()
                    .filter(|asset_id| asset_id == &registration.asset_id)
                    .map(|_| scene.scene_id.clone())
            })
            .collect::<Vec<_>>();
        let current_schema = read.source_schema_version == PROJECT_SCHEMA_VERSION
            && read.migration_status == "current";
        let mut inspection = RegisteredAssetRecoveryInspection {
            asset_id: registration.asset_id.clone(),
            role: registration.role.clone(),
            sha256: asset.sha256.clone(),
            media_type: asset.media_type.clone(),
            byte_length: asset.byte_length,
            relative_path: asset.relative_path.clone(),
            affected_scene_ids,
            disposition: "BLOCKED".to_string(),
            blocker_code: None,
            blocker_message: None,
            retry: "never".to_string(),
            restore_eligible: false,
        };
        match registered_asset_target(root, asset) {
            Err(blocker) => {
                inspection.blocker_code = Some(blocker.code);
                inspection.blocker_message = Some(blocker.message);
                inspection.retry = blocker.retry;
            }
            Ok(path) => match fs::symlink_metadata(&path) {
                Err(error) if error.kind() == std::io::ErrorKind::NotFound => {
                    inspection.disposition = "MISSING".to_string();
                    inspection.blocker_code = Some("REGISTERED_ASSET_BLOB_MISSING".to_string());
                    inspection.blocker_message = Some(format!(
                        "Registered {} asset {} is missing its canonical content-addressed blob.",
                        registration.role, registration.asset_id
                    ));
                    inspection.restore_eligible =
                        registration.role == "background"
                            && current_schema
                            && !inspection.affected_scene_ids.is_empty();
                    inspection.retry = if inspection.restore_eligible {
                        "after-exact-byte-preview".to_string()
                    } else {
                        "never-with-this-operation".to_string()
                    };
                }
                Err(error) => {
                    inspection.blocker_code = Some("ASSET_STORE_UNAVAILABLE".to_string());
                    inspection.blocker_message = Some(format!(
                        "Registered {} asset metadata is unavailable: {error}",
                        registration.role
                    ));
                    inspection.retry = "after-reread".to_string();
                }
                Ok(metadata) if !metadata.is_file() => {
                    inspection.disposition = "EXISTING_BLOCKED".to_string();
                    inspection.blocker_code = Some("ASSET_RESTORE_TARGET_EXISTS".to_string());
                    inspection.blocker_message = Some(
                        "Canonical registered-asset target exists but is not a regular file."
                            .to_string(),
                    );
                }
                Ok(_) => match fs::read(&path) {
                    Err(error) => {
                        inspection.disposition = "EXISTING_BLOCKED".to_string();
                        inspection.blocker_code = Some("ASSET_STORE_UNAVAILABLE".to_string());
                        inspection.blocker_message = Some(format!(
                            "Registered {} asset could not be read: {error}",
                            registration.role
                        ));
                        inspection.retry = "after-reread".to_string();
                    }
                    Ok(bytes)
                        if bytes.len() != asset.byte_length || sha256(&bytes) != asset.sha256 =>
                    {
                        inspection.disposition = "TAMPERED".to_string();
                        inspection.blocker_code = Some("ASSET_HASH_MISMATCH".to_string());
                        inspection.blocker_message = Some(
                            "Existing registered asset bytes do not match persisted length and digest; this operation will not overwrite them."
                                .to_string(),
                        );
                    }
                    Ok(bytes) => match validate_registered_media(&asset.media_type, &bytes) {
                        Ok(()) => {
                            inspection.disposition = "PRESENT_VALID".to_string();
                        }
                        Err(blocker) => {
                            inspection.disposition = "TAMPERED".to_string();
                            inspection.blocker_code = Some(blocker.code);
                            inspection.blocker_message = Some(blocker.message);
                            inspection.retry = blocker.retry;
                        }
                    },
                },
            },
        }
        inspections.push(inspection);
    }
    inspections.sort_by(|left, right| left.asset_id.cmp(&right.asset_id));
    inspections
}

fn pending_artifact_failure(
    artifact_kind: &str,
    relative_path: String,
    code: &str,
    message: String,
    retry: &str,
) -> PendingArtifactRecoveryInspection {
    PendingArtifactRecoveryInspection {
        artifact_kind: artifact_kind.to_string(),
        relative_path,
        status: "BLOCKED".to_string(),
        staged_content_sha256: None,
        byte_sha256: None,
        blocker_code: Some(code.to_string()),
        blocker_message: Some(message),
        retry: retry.to_string(),
    }
}

fn owned_pending_digest(name: &str, prefix: &str) -> Option<String> {
    let digest = name.strip_prefix(prefix)?.strip_suffix(".pending")?;
    validate_sha256(digest).ok().map(ToString::to_string)
}

fn inspect_owned_pending_directory(
    directory: &Path,
    relative_directory: &str,
    prefix: &str,
    artifact_kind: &str,
    project_id: Option<&str>,
) -> Vec<PendingArtifactRecoveryInspection> {
    let entries = match fs::read_dir(directory) {
        Ok(entries) => entries,
        Err(error) if error.kind() == std::io::ErrorKind::NotFound => return vec![],
        Err(error) => {
            return vec![pending_artifact_failure(
                artifact_kind,
                relative_directory.to_string(),
                "PENDING_ARTIFACT_DIRECTORY_UNAVAILABLE",
                format!("Owned pending-artifact directory could not be listed: {error}"),
                "after-reread",
            )]
        }
    };
    let mut inspections = Vec::new();
    for entry in entries {
        let entry = match entry {
            Ok(entry) => entry,
            Err(error) => {
                inspections.push(pending_artifact_failure(
                    artifact_kind,
                    relative_directory.to_string(),
                    "PENDING_ARTIFACT_DIRECTORY_UNAVAILABLE",
                    format!("Owned pending-artifact directory entry could not be read: {error}"),
                    "after-reread",
                ));
                continue;
            }
        };
        let Some(name) = entry.file_name().to_str().map(ToString::to_string) else {
            continue;
        };
        let Some(expected_digest) = owned_pending_digest(&name, prefix) else {
            continue;
        };
        let relative_path = format!("{relative_directory}/{name}");
        let path = entry.path();
        let metadata = match fs::symlink_metadata(&path) {
            Ok(metadata) => metadata,
            Err(error) => {
                inspections.push(pending_artifact_failure(
                    artifact_kind,
                    relative_path,
                    "PENDING_ARTIFACT_PATH_UNAVAILABLE",
                    format!("Owned pending artifact metadata is unavailable: {error}"),
                    "after-reread",
                ));
                continue;
            }
        };
        if let Err(blocker) = ensure_not_reparse(&path, "Owned pending artifact") {
            inspections.push(pending_artifact_failure(
                artifact_kind,
                relative_path,
                &blocker.code,
                blocker.message,
                &blocker.retry,
            ));
            continue;
        }
        if !metadata.is_file() {
            inspections.push(pending_artifact_failure(
                artifact_kind,
                relative_path,
                "PENDING_ARTIFACT_NOT_REGULAR_FILE",
                "Owned pending artifact is not a regular file.".to_string(),
                "never",
            ));
            continue;
        }
        let bytes = match fs::read(&path) {
            Ok(bytes) => bytes,
            Err(error) => {
                inspections.push(pending_artifact_failure(
                    artifact_kind,
                    relative_path,
                    "PENDING_ARTIFACT_UNAVAILABLE",
                    format!("Owned pending artifact could not be read: {error}"),
                    "after-reread",
                ));
                continue;
            }
        };
        let byte_sha256 = sha256(&bytes);
        let staged_content_sha256 = if artifact_kind == "project-pending" {
            match read_envelope(&path) {
                Ok(read) if project_id == Some(read.envelope.project_id.as_str()) => {
                    Some(read.persisted_content_sha256)
                }
                Ok(_) => {
                    inspections.push(PendingArtifactRecoveryInspection {
                        artifact_kind: artifact_kind.to_string(),
                        relative_path,
                        status: "BLOCKED".to_string(),
                        staged_content_sha256: None,
                        byte_sha256: Some(byte_sha256),
                        blocker_code: Some("PENDING_ARTIFACT_PROJECT_ID_MISMATCH".to_string()),
                        blocker_message: Some("Owned pending project does not match the selected project ID.".to_string()),
                        retry: "never-with-this-operation".to_string(),
                    });
                    continue;
                }
                Err(blocker) => {
                    inspections.push(PendingArtifactRecoveryInspection {
                        artifact_kind: artifact_kind.to_string(),
                        relative_path,
                        status: "BLOCKED".to_string(),
                        staged_content_sha256: None,
                        byte_sha256: Some(byte_sha256),
                        blocker_code: Some("PENDING_ARTIFACT_INVALID".to_string()),
                        blocker_message: Some(blocker.message),
                        retry: blocker.retry,
                    });
                    continue;
                }
            }
        } else {
            match read_workspace_index_file(&path) {
                Ok(envelope) => Some(envelope.content_sha256),
                Err(blocker) => {
                    inspections.push(PendingArtifactRecoveryInspection {
                        artifact_kind: artifact_kind.to_string(),
                        relative_path,
                        status: "BLOCKED".to_string(),
                        staged_content_sha256: None,
                        byte_sha256: Some(byte_sha256),
                        blocker_code: Some("PENDING_ARTIFACT_INVALID".to_string()),
                        blocker_message: Some(blocker.message),
                        retry: blocker.retry,
                    });
                    continue;
                }
            }
        };
        if staged_content_sha256.as_deref() != Some(expected_digest.as_str()) {
            inspections.push(PendingArtifactRecoveryInspection {
                artifact_kind: artifact_kind.to_string(),
                relative_path,
                status: "BLOCKED".to_string(),
                staged_content_sha256,
                byte_sha256: Some(byte_sha256),
                blocker_code: Some("PENDING_ARTIFACT_DIGEST_MISMATCH".to_string()),
                blocker_message: Some("Owned pending artifact filename digest does not match validated staged content.".to_string()),
                retry: "after-reread".to_string(),
            });
            continue;
        }
        inspections.push(PendingArtifactRecoveryInspection {
            artifact_kind: artifact_kind.to_string(),
            relative_path,
            status: "PRESENT_VALID".to_string(),
            staged_content_sha256,
            byte_sha256: Some(byte_sha256),
            blocker_code: None,
            blocker_message: None,
            retry: "recovery-required-after-reread".to_string(),
        });
    }
    inspections.sort_by(|left, right| {
        left.artifact_kind
            .cmp(&right.artifact_kind)
            .then_with(|| left.relative_path.cmp(&right.relative_path))
    });
    inspections
}

fn inspect_owned_pending_artifacts(
    root: &Path,
    project_dir: &Path,
    project_id: &str,
) -> Vec<PendingArtifactRecoveryInspection> {
    let slug = match validate_project_id(project_id) {
        Ok(slug) => slug,
        Err(_) => return vec![],
    };
    let mut inspections = inspect_owned_pending_directory(
        project_dir,
        &format!("projects/{slug}"),
        "project.",
        "project-pending",
        Some(project_id),
    );
    inspections.extend(inspect_owned_pending_directory(
        root,
        ".",
        "workspace-index.",
        "workspace-index-pending",
        None,
    ));
    inspections.sort_by(|left, right| {
        left.artifact_kind
            .cmp(&right.artifact_kind)
            .then_with(|| left.relative_path.cmp(&right.relative_path))
    });
    inspections
}

pub fn prepare_pending_artifact_inspection_fixture_at(
    root: &Path,
) -> Result<PendingArtifactFixtureReceipt, ProjectStoreFailure> {
    let _lease = acquire_project_mutation_lease(root)?;
    ensure_not_reparse(root, "Project-store root")?;
    let (primary, _, project_dir) = project_paths(root, PENDING_ARTIFACT_INSPECTION_SELF_TEST_PROJECT_ID)?;
    ensure_not_reparse(&project_dir, "Pending-artifact self-test project directory")?;
    let primary_read = read_envelope(&primary)?;
    if primary_read.envelope.project_id != PENDING_ARTIFACT_INSPECTION_SELF_TEST_PROJECT_ID {
        return Err(failure(
            "PENDING_ARTIFACT_FIXTURE_PROJECT_MISMATCH",
            "Pending-artifact fixture project identity did not match its fixed test-owned ID.",
            "never",
        ));
    }
    let project_bytes = fs::read(&primary).map_err(|error| {
        failure(
            "PENDING_ARTIFACT_FIXTURE_UNAVAILABLE",
            format!("Pending-artifact fixture could not read its fixed test project: {error}"),
            "after-reread",
        )
    })?;
    let workspace_primary = root.join("workspace-index.json");
    let workspace = read_workspace_index_file(&workspace_primary)?;
    let workspace_bytes = fs::read(&workspace_primary).map_err(|error| {
        failure(
            "PENDING_ARTIFACT_FIXTURE_UNAVAILABLE",
            format!("Pending-artifact fixture could not read workspace metadata: {error}"),
            "after-reread",
        )
    })?;
    let project_name = format!("project.{}.pending", primary_read.persisted_content_sha256);
    let workspace_name = format!("workspace-index.{}.pending", workspace.content_sha256);
    let malformed_name = format!("project.{}.pending", "f".repeat(64));
    let project_pending = project_dir.join(&project_name);
    let workspace_pending = root.join(&workspace_name);
    let malformed_pending = project_dir.join(&malformed_name);
    for (path, label) in [
        (&project_pending, "validated project pending artifact"),
        (&workspace_pending, "validated workspace pending artifact"),
        (&malformed_pending, "malformed project pending artifact"),
    ] {
        if path.exists() {
            return Err(failure(
                "PENDING_ARTIFACT_FIXTURE_EXISTS",
                format!("The fixed pending-artifact fixture will not overwrite an existing {label}."),
                "never",
            ));
        }
    }
    write_synced(&project_pending, &project_bytes)?;
    if let Err(error) = write_synced(&workspace_pending, &workspace_bytes) {
        return Err(error);
    }
    if let Err(error) = write_synced(&malformed_pending, b"m234-malformed-pending-artifact") {
        return Err(error);
    }
    Ok(PendingArtifactFixtureReceipt {
        operation: "dicebox.project.pending-artifact.fixture".to_string(),
        status: "PASS".to_string(),
        project_id: PENDING_ARTIFACT_INSPECTION_SELF_TEST_PROJECT_ID.to_string(),
        project_pending_relative_path: format!(
            "projects/{}/{}",
            validate_project_id(PENDING_ARTIFACT_INSPECTION_SELF_TEST_PROJECT_ID)?,
            project_name
        ),
        workspace_pending_relative_path: format!("./{workspace_name}"),
        malformed_pending_relative_path: format!(
            "projects/{}/{}",
            validate_project_id(PENDING_ARTIFACT_INSPECTION_SELF_TEST_PROJECT_ID)?,
            malformed_name
        ),
        no_foundry_write: true,
    })
}

fn selected_missing_background_fixture_scene(
    scene_id: &str,
    name: &str,
    asset_id: &str,
    color: u64,
) -> String {
    serde_json::json!({
        "schemaVersion": "0.1.0",
        "revision": 0,
        "id": scene_id,
        "name": name,
        "width": 1536,
        "height": 1024,
        "background": { "color": color, "gridSize": 64, "assetId": asset_id },
        "entities": []
    })
    .to_string()
}

pub fn prepare_dangling_background_reference_fixture_at(
    root: &Path,
) -> Result<DanglingBackgroundReferenceFixtureReceipt, ProjectStoreFailure> {
    let project_id = DANGLING_BACKGROUND_REFERENCE_SELF_TEST_PROJECT_ID;
    let (primary, _, project_dir) = project_paths(root, project_id)?;
    if project_dir.exists() {
        return Err(failure(
            "PROJECT_FIXTURE_EXISTS",
            "The dangling-reference fixture will not overwrite an existing test-owned project.",
            "remove-test-owned-project-and-reread",
        ));
    }
    let png_bytes = vec![137, 80, 78, 71, 13, 10, 26, 10, 1];
    let webp_bytes = b"RIFF\x05\x00\x00\x00WEBP!".to_vec();
    let png_digest = sha256(&png_bytes);
    let webp_digest = sha256(&webp_bytes);
    let png_asset_id = format!("dbx:asset:sha256-{png_digest}");
    let webp_asset_id = format!("dbx:asset:sha256-{webp_digest}");
    let first_scene_id = "dbx:scene:desktop-dangling-background-reference-self-test-missing";
    let second_scene_id = "dbx:scene:desktop-dangling-background-reference-self-test-role";
    create_project_at(
        root,
        SaveProjectRequest {
            schema_version: PROJECT_SCHEMA_VERSION.to_string(),
            project_id: project_id.to_string(),
            expected_generation: 0,
            scenes_json: vec![
                selected_missing_background_fixture_scene(
                    first_scene_id,
                    "Dangling Background Missing",
                    &png_asset_id,
                    1,
                ),
                selected_missing_background_fixture_scene(
                    second_scene_id,
                    "Dangling Background Role",
                    &webp_asset_id,
                    2,
                ),
            ],
            active_scene_id: second_scene_id.to_string(),
            assets: Some(vec![
                ProjectAssetInput {
                    media_type: "image/png".to_string(),
                    bytes: png_bytes,
                    registration: Some(ProjectAssetRegistration {
                        asset_id: png_asset_id.clone(),
                        role: "background".to_string(),
                        label: "Dangling reference PNG".to_string(),
                        provenance: "debug-dangling-reference-fixture".to_string(),
                        approval: "approved".to_string(),
                    }),
                },
                ProjectAssetInput {
                    media_type: "image/webp".to_string(),
                    bytes: webp_bytes,
                    registration: Some(ProjectAssetRegistration {
                        asset_id: webp_asset_id.clone(),
                        role: "background".to_string(),
                        label: "Role mismatch WebP".to_string(),
                        provenance: "debug-dangling-reference-fixture".to_string(),
                        approval: "approved".to_string(),
                    }),
                },
            ]),
            expected_workspace_generation: None,
            workspace_display_name: None,
        },
    )?;
    let mut envelope = read_envelope(&primary)?.envelope;
    let mut changed_png = false;
    let mut changed_webp = false;
    for asset in &mut envelope.assets {
        if asset.sha256 == png_digest {
            asset.registration = None;
            changed_png = true;
        } else if asset.sha256 == webp_digest {
            asset.registration.as_mut().expect("fixture registration").role = "handout".to_string();
            changed_webp = true;
        }
    }
    if !changed_png || !changed_webp {
        return Err(failure(
            "PROJECT_FIXTURE_SETUP_FAILED",
            "Dangling-reference fixture did not locate both registered asset descriptors.",
            "never",
        ));
    }
    envelope.content_sha256 = content_hash(&envelope);
    let bytes = serde_json::to_vec(&envelope).map_err(|error| {
        failure(
            "PROJECT_FIXTURE_SETUP_FAILED",
            format!("Dangling-reference fixture could not serialize its envelope: {error}"),
            "never",
        )
    })?;
    let mut project_file = OpenOptions::new()
        .write(true)
        .truncate(true)
        .open(&primary)
        .map_err(|error| {
            failure(
                "PROJECT_FIXTURE_SETUP_FAILED",
                format!("Dangling-reference fixture could not reopen its project: {error}"),
                "after-reread",
            )
        })?;
    project_file.write_all(&bytes).map_err(|error| {
        failure(
            "PROJECT_FIXTURE_SETUP_FAILED",
            format!("Dangling-reference fixture could not write its project: {error}"),
            "after-reread",
        )
    })?;
    project_file.sync_all().map_err(|error| {
        failure(
            "PROJECT_FIXTURE_SETUP_FAILED",
            format!("Dangling-reference fixture could not sync its project: {error}"),
            "after-reread",
        )
    })?;
    Ok(DanglingBackgroundReferenceFixtureReceipt {
        operation: "dicebox.project.dangling-background-reference.fixture".to_string(),
        status: "PASS".to_string(),
        project_id: project_id.to_string(),
        scene_ids: vec![first_scene_id.to_string(), second_scene_id.to_string()],
        asset_ids: vec![png_asset_id, webp_asset_id],
        no_foundry_write: true,
    })
}

pub fn prepare_broken_reference_detach_fixture_at(
    root: &Path,
) -> Result<BrokenReferenceDetachFixtureReceipt, ProjectStoreFailure> {
    let project_id = BROKEN_REFERENCE_DETACH_SELF_TEST_PROJECT_ID;
    let (primary, _, project_dir) = project_paths(root, project_id)?;
    if project_dir.exists() {
        return Err(failure("PROJECT_FIXTURE_EXISTS", "The broken-reference detach fixture will not overwrite an existing test-owned project.", "remove-test-owned-project-and-reread"));
    }
    let bytes = b"RIFF\x05\x00\x00\x00WEBP!".to_vec();
    let digest = sha256(&bytes);
    let asset_id = format!("dbx:asset:sha256-{digest}");
    let first_scene_id = "dbx:scene:desktop-broken-reference-detach-self-test-target";
    let second_scene_id = "dbx:scene:desktop-broken-reference-detach-self-test-unrelated";
    create_project_at(root, SaveProjectRequest {
        schema_version: PROJECT_SCHEMA_VERSION.to_string(),
        project_id: project_id.to_string(),
        expected_generation: 0,
        scenes_json: vec![
            serde_json::json!({
                "schemaVersion": "0.1.0", "revision": 0, "id": first_scene_id,
                "name": "Broken Reference Target", "width": 1536, "height": 1024,
                "background": { "color": 3, "gridSize": 64 }, "entities": []
            }).to_string(),
            serde_json::json!({
                "schemaVersion": "0.1.0", "revision": 0, "id": second_scene_id,
                "name": "Unrelated Scene", "width": 1536, "height": 1024,
                "background": { "color": 4, "gridSize": 64 }, "entities": []
            }).to_string(),
        ],
        active_scene_id: first_scene_id.to_string(),
        assets: Some(vec![ProjectAssetInput {
            media_type: "image/webp".to_string(),
            bytes,
            registration: Some(ProjectAssetRegistration {
                asset_id: asset_id.clone(),
                role: "handout".to_string(),
                label: "M241 handout preservation fixture".to_string(),
                provenance: "debug-broken-reference-detach-fixture".to_string(),
                approval: "approved".to_string(),
            }),
        }]),
        expected_workspace_generation: None,
        workspace_display_name: None,
    })?;
    let workspace_generation = read_workspace_index_state(root)?.envelope.generation;
    touch_workspace_project_at(root, project_id, Some("M241 fixture"), workspace_generation)?;
    let mut envelope = serde_json::from_slice::<ProjectEnvelope>(&fs::read(&primary).map_err(|error| failure("PROJECT_FIXTURE_SETUP_FAILED", format!("Broken-reference fixture could not read its project: {error}"), "after-reread"))?).map_err(|_| failure("PROJECT_FIXTURE_SETUP_FAILED", "Broken-reference fixture envelope could not be parsed.", "after-reread"))?;
    let target = envelope.scenes.iter_mut().find(|scene| scene.scene_id == first_scene_id).ok_or_else(|| failure("PROJECT_FIXTURE_SETUP_FAILED", "Broken-reference fixture target Scene is missing.", "never"))?;
    let mut scene_value: Value = serde_json::from_str(&target.scene_json).map_err(|_| failure("PROJECT_FIXTURE_SETUP_FAILED", "Broken-reference fixture target Scene is invalid.", "never"))?;
    scene_value.get_mut("background").and_then(Value::as_object_mut).ok_or_else(|| failure("PROJECT_FIXTURE_SETUP_FAILED", "Broken-reference fixture target background is invalid.", "never"))?.insert("assetId".to_string(), Value::String(asset_id.clone()));
    target.scene_json = serde_json::to_string(&scene_value).map_err(|_| failure("PROJECT_FIXTURE_SETUP_FAILED", "Broken-reference fixture target Scene could not be serialized.", "never"))?;
    target.scene_sha256 = sha256(target.scene_json.as_bytes());
    envelope.content_sha256 = content_hash(&envelope);
    let serialized = serde_json::to_vec(&envelope).map_err(|_| failure("PROJECT_FIXTURE_SETUP_FAILED", "Broken-reference fixture envelope could not be serialized.", "never"))?;
    let mut file = OpenOptions::new().write(true).truncate(true).open(&primary).map_err(|error| failure("PROJECT_FIXTURE_SETUP_FAILED", format!("Broken-reference fixture could not reopen its project: {error}"), "after-reread"))?;
    file.write_all(&serialized).map_err(|error| failure("PROJECT_FIXTURE_SETUP_FAILED", format!("Broken-reference fixture could not write its project: {error}"), "after-reread"))?;
    file.sync_all().map_err(|error| failure("PROJECT_FIXTURE_SETUP_FAILED", format!("Broken-reference fixture could not sync its project: {error}"), "after-reread"))?;
    Ok(BrokenReferenceDetachFixtureReceipt {
        operation: "dicebox.project.broken-reference-detach.fixture".to_string(),
        status: "PASS".to_string(),
        project_id: project_id.to_string(),
        scene_ids: vec![first_scene_id.to_string(), second_scene_id.to_string()],
        asset_id,
        asset_sha256: digest,
        no_foundry_write: true,
    })
}

fn reuse_broken_reference_ui_lifecycle_fixture_at(
    root: &Path,
    primary: &Path,
    backup: &Path,
    project_dir: &Path,
    project_id: &str,
) -> Result<BrokenReferenceUiLifecycleFixtureReceipt, ProjectStoreFailure> {
    let mismatch = || {
        failure(
            "PROJECT_FIXTURE_EXISTS",
            "The broken-reference UI lifecycle fixture will not overwrite an existing project unless it matches the exact reusable test topology.",
            "after-reread",
        )
    };
    ensure_not_reparse(project_dir, "Broken-reference UI lifecycle project directory")
        .map_err(|_| mismatch())?;
    ensure_not_reparse(primary, "Broken-reference UI lifecycle fixture primary")
        .map_err(|_| mismatch())?;
    let entries = fs::read_dir(project_dir)
        .map_err(|_| mismatch())?
        .map(|entry| entry.map(|value| value.file_name().to_string_lossy().into_owned()))
        .collect::<Result<BTreeSet<_>, _>>()
        .map_err(|_| mismatch())?;
    let expected_entries = ["project.json".to_string()]
        .into_iter()
        .collect::<BTreeSet<_>>();
    if entries != expected_entries || backup.exists() {
        return Err(mismatch());
    }
    let bytes = b"RIFF\x08\x00\x00\x00WEBP!!".to_vec();
    let digest = sha256(&bytes);
    let target_scene_id = format!("dbx:scene:{}-target", &project_id[12..]);
    let unrelated_scene_id = format!("dbx:scene:{}-unrelated", &project_id[12..]);
    let asset_id = format!("dbx:asset:sha256-{digest}");
    let value = serde_json::from_slice::<Value>(&fs::read(primary).map_err(|_| mismatch())?)
        .map_err(|_| mismatch())?;
    let envelope = serde_json::from_value::<ProjectEnvelope>(value).map_err(|_| mismatch())?;
    let expected_asset = StoredAsset {
        sha256: digest.clone(),
        media_type: "image/webp".to_string(),
        byte_length: bytes.len(),
        relative_path: canonical_asset_relative_path(&digest).map_err(|_| mismatch())?,
        registration: Some(ProjectAssetRegistration {
            asset_id: asset_id.clone(),
            role: "handout".to_string(),
            label: "M500 handout preservation fixture".to_string(),
            provenance: "debug-broken-reference-ui-lifecycle-fixture".to_string(),
            approval: "approved".to_string(),
        }),
    };
    let expected_target_scene = serde_json::json!({
        "schemaVersion": "0.1.0",
        "revision": 0,
        "id": target_scene_id.clone(),
        "name": "Broken Reference UI Target",
        "width": 1536,
        "height": 1024,
        "background": { "color": 3, "gridSize": 64, "assetId": asset_id.clone() },
        "entities": []
    });
    let expected_unrelated_scene = serde_json::json!({
        "schemaVersion": "0.1.0",
        "revision": 0,
        "id": unrelated_scene_id.clone(),
        "name": "Broken Reference UI Unrelated",
        "width": 1536,
        "height": 1024,
        "background": { "color": 4, "gridSize": 64 },
        "entities": []
    });
    if envelope.schema_version.as_str() != PROJECT_SCHEMA_VERSION
        || envelope.project_id.as_str() != project_id
        || envelope.generation != 1
        || envelope.active_scene_id.as_str() != target_scene_id
        || envelope.assets != vec![expected_asset.clone()]
        || envelope.scenes.len() != 2
        || envelope.scenes[0].scene_id.as_str() != target_scene_id
        || envelope.scenes[1].scene_id.as_str() != unrelated_scene_id
        || serde_json::from_str::<Value>(&envelope.scenes[0].scene_json).map_err(|_| mismatch())?
            != expected_target_scene
        || serde_json::from_str::<Value>(&envelope.scenes[1].scene_json).map_err(|_| mismatch())?
            != expected_unrelated_scene
        || envelope
            .scenes
            .iter()
            .any(|scene| sha256(scene.scene_json.as_bytes()) != scene.scene_sha256)
        || content_hash(&envelope) != envelope.content_sha256
    {
        return Err(mismatch());
    }
    let asset_path = registered_asset_target(root, &expected_asset).map_err(|_| mismatch())?;
    ensure_not_reparse(&asset_path, "Broken-reference UI lifecycle fixture asset")
        .map_err(|_| mismatch())?;
    let asset_metadata = fs::symlink_metadata(&asset_path).map_err(|_| mismatch())?;
    let asset_bytes = fs::read(&asset_path).map_err(|_| mismatch())?;
    if !asset_metadata.is_file() || asset_bytes != bytes {
        return Err(mismatch());
    }
    let workspace = read_workspace_index_file(&root.join("workspace-index.json"))
        .map_err(|_| mismatch())?;
    if workspace
        .entries
        .get(project_id)
        .map(|entry| entry.display_name.as_str())
        != Some("M500 broken-reference UI lifecycle fixture")
    {
        return Err(mismatch());
    }
    Ok(BrokenReferenceUiLifecycleFixtureReceipt {
        operation: "dicebox.project.broken-reference-ui-lifecycle.fixture".to_string(),
        status: "PASS".to_string(),
        project_id: project_id.to_string(),
        scene_ids: vec![target_scene_id, unrelated_scene_id],
        asset_id,
        asset_sha256: digest,
        no_foundry_write: true,
    })
}

pub fn prepare_broken_reference_ui_lifecycle_fixture_at(
    root: &Path,
) -> Result<BrokenReferenceUiLifecycleFixtureReceipt, ProjectStoreFailure> {
    prepare_broken_reference_ui_lifecycle_fixture_for_project_at(root, BROKEN_REFERENCE_UI_LIFECYCLE_SELF_TEST_PROJECT_ID)
}

pub fn prepare_broken_reference_ui_lifecycle_fixture_v3_at(
    root: &Path,
) -> Result<BrokenReferenceUiLifecycleFixtureReceipt, ProjectStoreFailure> {
    prepare_broken_reference_ui_lifecycle_fixture_for_project_at(root, BROKEN_REFERENCE_UI_LIFECYCLE_SELF_TEST_V3_PROJECT_ID)
}

pub fn prepare_broken_reference_ui_lifecycle_fixture_v4_at(
    root: &Path,
) -> Result<BrokenReferenceUiLifecycleFixtureReceipt, ProjectStoreFailure> {
    prepare_broken_reference_ui_lifecycle_fixture_for_project_at(root, BROKEN_REFERENCE_UI_LIFECYCLE_SELF_TEST_V4_PROJECT_ID)
}

fn prepare_broken_reference_ui_lifecycle_fixture_for_project_at(
    root: &Path,
    project_id: &str,
) -> Result<BrokenReferenceUiLifecycleFixtureReceipt, ProjectStoreFailure> {
    let (primary, backup, project_dir) = project_paths(root, project_id)?;
    if project_dir.exists() {
        return reuse_broken_reference_ui_lifecycle_fixture_at(root, &primary, &backup, &project_dir, project_id);
    }
    let bytes = b"RIFF\x08\x00\x00\x00WEBP!!".to_vec();
    let digest = sha256(&bytes);
    let asset_id = format!("dbx:asset:sha256-{digest}");
    let target_scene_id = format!("dbx:scene:{}-target", &project_id[12..]);
    let unrelated_scene_id = format!("dbx:scene:{}-unrelated", &project_id[12..]);
    create_project_at(root, SaveProjectRequest {
        schema_version: PROJECT_SCHEMA_VERSION.to_string(),
        project_id: project_id.to_string(),
        expected_generation: 0,
        scenes_json: vec![
            serde_json::json!({ "schemaVersion": "0.1.0", "revision": 0, "id": target_scene_id, "name": "Broken Reference UI Target", "width": 1536, "height": 1024, "background": { "color": 3, "gridSize": 64 }, "entities": [] }).to_string(),
            serde_json::json!({ "schemaVersion": "0.1.0", "revision": 0, "id": unrelated_scene_id, "name": "Broken Reference UI Unrelated", "width": 1536, "height": 1024, "background": { "color": 4, "gridSize": 64 }, "entities": [] }).to_string(),
        ],
        active_scene_id: target_scene_id.clone(),
        assets: Some(vec![ProjectAssetInput {
            media_type: "image/webp".to_string(),
            bytes,
            registration: Some(ProjectAssetRegistration {
                asset_id: asset_id.clone(),
                role: "handout".to_string(),
                label: "M500 handout preservation fixture".to_string(),
                provenance: "debug-broken-reference-ui-lifecycle-fixture".to_string(),
                approval: "approved".to_string(),
            }),
        }]),
        expected_workspace_generation: None,
        workspace_display_name: None,
    })?;
    let workspace_generation = read_workspace_index_state(root)?.envelope.generation;
    touch_workspace_project_at(root, project_id, Some("M500 broken-reference UI lifecycle fixture"), workspace_generation)?;
    let mut envelope = serde_json::from_slice::<ProjectEnvelope>(&fs::read(&primary).map_err(|error| failure("PROJECT_FIXTURE_SETUP_FAILED", format!("Broken-reference UI lifecycle fixture could not read its project: {error}"), "after-reread"))?)
        .map_err(|_| failure("PROJECT_FIXTURE_SETUP_FAILED", "Broken-reference UI lifecycle fixture envelope could not be parsed.", "after-reread"))?;
    let target = envelope.scenes.iter_mut().find(|scene| scene.scene_id == target_scene_id).ok_or_else(|| failure("PROJECT_FIXTURE_SETUP_FAILED", "Broken-reference UI lifecycle target Scene is missing.", "never"))?;
    let mut scene_value: Value = serde_json::from_str(&target.scene_json).map_err(|_| failure("PROJECT_FIXTURE_SETUP_FAILED", "Broken-reference UI lifecycle target Scene is invalid.", "never"))?;
    scene_value.get_mut("background").and_then(Value::as_object_mut).ok_or_else(|| failure("PROJECT_FIXTURE_SETUP_FAILED", "Broken-reference UI lifecycle target background is invalid.", "never"))?.insert("assetId".to_string(), Value::String(asset_id.clone()));
    target.scene_json = serde_json::to_string(&scene_value).map_err(|_| failure("PROJECT_FIXTURE_SETUP_FAILED", "Broken-reference UI lifecycle target Scene could not be serialized.", "never"))?;
    target.scene_sha256 = sha256(target.scene_json.as_bytes());
    envelope.content_sha256 = content_hash(&envelope);
    let serialized = serde_json::to_vec(&envelope).map_err(|_| failure("PROJECT_FIXTURE_SETUP_FAILED", "Broken-reference UI lifecycle fixture envelope could not be serialized.", "never"))?;
    let mut file = OpenOptions::new().write(true).truncate(true).open(&primary).map_err(|error| failure("PROJECT_FIXTURE_SETUP_FAILED", format!("Broken-reference UI lifecycle fixture could not reopen its project: {error}"), "after-reread"))?;
    file.write_all(&serialized).and_then(|_| file.sync_all()).map_err(|error| failure("PROJECT_FIXTURE_SETUP_FAILED", format!("Broken-reference UI lifecycle fixture write is unknown: {error}"), "after-reread"))?;
    if backup.exists() {
        return Err(failure("PROJECT_FIXTURE_SETUP_FAILED", "Broken-reference UI lifecycle fixture unexpectedly created a backup.", "after-reread"));
    }
    let inspection = inspect_project_recovery_at(root, ProjectRecoveryInspectionRequest { schema_version: PROJECT_SCHEMA_VERSION.to_string(), project_id: project_id.to_string() })?;
    let exact = inspection.status == "BLOCKED"
        && inspection.project_id == project_id
        && inspection.generation.is_none()
        && inspection.primary.status == "BLOCKED"
        && inspection.backup.status == "MISSING"
        && inspection.scenes.is_empty()
        && inspection.registered_assets.is_empty()
        && inspection.broken_scene_references.len() == 1
        && inspection.broken_scene_references[0].scene_id == target_scene_id
        && inspection.broken_scene_references[0].asset_id == asset_id
        && inspection.broken_scene_references[0].blocker_code == "BACKGROUND_ASSET_ROLE_MISMATCH"
        && inspection.no_write
        && inspection.no_foundry_write;
    if !exact {
        return Err(failure("PROJECT_FIXTURE_SETUP_FAILED", "Broken-reference UI lifecycle fixture did not establish the exact role-mismatch topology.", "after-reread"));
    }
    Ok(BrokenReferenceUiLifecycleFixtureReceipt {
        operation: "dicebox.project.broken-reference-ui-lifecycle.fixture".to_string(),
        status: "PASS".to_string(),
        project_id: project_id.to_string(),
        scene_ids: vec![target_scene_id, unrelated_scene_id],
        asset_id,
        asset_sha256: digest,
        no_foundry_write: true,
    })
}

pub fn prepare_legacy_migration_persistence_fixture_at(
    root: &Path,
) -> Result<LegacyMigrationPersistenceFixtureReceipt, ProjectStoreFailure> {
    let project_id = LEGACY_MIGRATION_PERSISTENCE_SELF_TEST_PROJECT_ID;
    let (primary, backup, project_dir) = project_paths(root, project_id)?;
    if project_dir.exists() {
        return Err(failure(
            "PROJECT_FIXTURE_EXISTS",
            "The legacy-migration fixture will not overwrite an existing test-owned project.",
            "remove-test-owned-project-and-reread",
        ));
    }
    let first_scene_id = "dbx:scene:desktop-legacy-migration-persistence-self-test-v2-main";
    let second_scene_id = "dbx:scene:desktop-legacy-migration-persistence-self-test-v2-scene-2";
    let asset_bytes = vec![137, 80, 78, 71, 13, 10, 26, 10, 42];
    let asset_sha256 = sha256(&asset_bytes);
    create_project_at(
        root,
        SaveProjectRequest {
            schema_version: PROJECT_SCHEMA_VERSION.to_string(),
            project_id: project_id.to_string(),
            expected_generation: 0,
            scenes_json: vec![
                serde_json::json!({
                    "schemaVersion": "0.1.0", "revision": 0, "id": first_scene_id,
                    "name": "Legacy Migration Main", "width": 1536, "height": 1024,
                    "background": { "color": 5, "gridSize": 64 }, "entities": []
                })
                .to_string(),
                serde_json::json!({
                    "schemaVersion": "0.1.0", "revision": 0, "id": second_scene_id,
                    "name": "Legacy Migration Second", "width": 1536, "height": 1024,
                    "background": { "color": 6, "gridSize": 64 }, "entities": []
                })
                .to_string(),
            ],
            active_scene_id: second_scene_id.to_string(),
            assets: Some(vec![ProjectAssetInput {
                media_type: "image/png".to_string(),
                bytes: asset_bytes,
                registration: None,
            }]),
            expected_workspace_generation: None,
            workspace_display_name: None,
        },
    )?;
    let workspace_generation = read_workspace_index_state(root)?.envelope.generation;
    touch_workspace_project_at(
        root,
        project_id,
        Some("M242 legacy migration fixture"),
        workspace_generation,
    )?;
    let mut envelope: ProjectEnvelope = serde_json::from_slice(
        &fs::read(&primary).map_err(|error| {
            failure(
                "PROJECT_FIXTURE_SETUP_FAILED",
                format!("Legacy-migration fixture could not read its project: {error}"),
                "after-reread",
            )
        })?,
    )
    .map_err(|_| {
        failure(
            "PROJECT_FIXTURE_SETUP_FAILED",
            "Legacy-migration fixture envelope could not be parsed.",
            "after-reread",
        )
    })?;
    envelope.schema_version = MULTI_SCENE_PROJECT_SCHEMA_VERSION.to_string();
    envelope.content_sha256 = multi_scene_legacy_content_hash(&envelope);
    let serialized = serde_json::to_vec(&envelope).map_err(|_| {
        failure(
            "PROJECT_FIXTURE_SETUP_FAILED",
            "Legacy-migration fixture envelope could not be serialized.",
            "never",
        )
    })?;
    let mut file = OpenOptions::new()
        .write(true)
        .truncate(true)
        .open(&primary)
        .map_err(|error| {
            failure(
                "PROJECT_FIXTURE_SETUP_FAILED",
                format!("Legacy-migration fixture could not reopen its project: {error}"),
                "after-reread",
            )
        })?;
    file.write_all(&serialized).map_err(|error| {
        failure(
            "PROJECT_FIXTURE_SETUP_FAILED",
            format!("Legacy-migration fixture could not write its project: {error}"),
            "after-reread",
        )
    })?;
    file.sync_all().map_err(|error| {
        failure(
            "PROJECT_FIXTURE_SETUP_FAILED",
            format!("Legacy-migration fixture could not sync its project: {error}"),
            "after-reread",
        )
    })?;
    fs::write(
        project_dir.join("foreign-note.txt"),
        b"preserve-m242-foreign-state",
    )
    .map_err(|error| {
        failure(
            "PROJECT_FIXTURE_SETUP_FAILED",
            format!("Legacy-migration fixture could not write its foreign marker: {error}"),
            "after-reread",
        )
    })?;
    if backup.exists() {
        return Err(failure(
            "PROJECT_FIXTURE_SETUP_FAILED",
            "Legacy-migration fixture unexpectedly created a backup.",
            "after-reread",
        ));
    }
    let reread = read_envelope(&primary)?;
    Ok(LegacyMigrationPersistenceFixtureReceipt {
        operation: "dicebox.project.migration.persist.fixture".to_string(),
        status: "PASS".to_string(),
        project_id: project_id.to_string(),
        source_schema_version: reread.source_schema_version,
        generation: reread.envelope.generation,
        persisted_content_sha256: reread.persisted_content_sha256,
        scene_ids: vec![first_scene_id.to_string(), second_scene_id.to_string()],
        asset_sha256,
        no_foundry_write: true,
    })
}

fn read_existing_backup_authoritative_recovery_promotion_fixture_at(
    project_id: &str,
    primary: &Path,
    backup: &Path,
    project_dir: &Path,
) -> Result<Option<BackupAuthoritativeRecoveryPromotionFixtureReceipt>, ProjectStoreFailure> {
    if !project_dir.exists() {
        return Ok(None);
    }
    ensure_not_reparse(project_dir, "Backup-authoritative recovery fixture directory")?;
    ensure_not_reparse(primary, "Backup-authoritative recovery fixture primary")?;
    ensure_not_reparse(backup, "Backup-authoritative recovery fixture backup")?;
    let foreign_note = project_dir.join(BACKUP_RECOVERY_FOREIGN_NOTE_FILE);
    ensure_not_reparse(&foreign_note, "Backup-authoritative recovery fixture foreign marker")?;

    let mut entries = fs::read_dir(project_dir)
        .map_err(|error| {
            failure(
                "PROJECT_FIXTURE_EXISTS",
                format!(
                    "Backup-authoritative recovery fixture directory could not be reread: {error}"
                ),
                "after-reread",
            )
        })?
        .map(|entry| {
            entry
                .map(|entry| entry.file_name().to_string_lossy().into_owned())
                .map_err(|error| {
                    failure(
                        "PROJECT_FIXTURE_EXISTS",
                        format!(
                            "Backup-authoritative recovery fixture directory entry could not be reread: {error}"
                        ),
                        "after-reread",
                    )
                })
        })
        .collect::<Result<Vec<_>, _>>()?;
    entries.sort_unstable();
    let expected_entries = vec![
        BACKUP_RECOVERY_FOREIGN_NOTE_FILE.to_string(),
        "project.backup.json".to_string(),
    ];
    if primary.exists()
        || !backup.is_file()
        || !foreign_note.is_file()
        || entries != expected_entries
    {
        return Err(failure(
            "PROJECT_FIXTURE_EXISTS",
            "Existing backup-authoritative fixture is not the exact protected backup-only topology.",
            "after-reread",
        ));
    }

    let backup_bytes = fs::read(backup).map_err(|error| {
        failure(
            "PROJECT_FIXTURE_EXISTS",
            format!("Existing backup-authoritative fixture backup could not be reread: {error}"),
            "after-reread",
        )
    })?;
    let backup_read = read_envelope(backup).map_err(|_| {
        failure(
            "PROJECT_FIXTURE_EXISTS",
            "Existing backup-authoritative fixture backup is not a valid current project envelope.",
            "after-reread",
        )
    })?;
    let foreign_bytes = fs::read(&foreign_note).map_err(|error| {
        failure(
            "PROJECT_FIXTURE_EXISTS",
            format!("Existing backup-authoritative fixture foreign marker could not be reread: {error}"),
            "after-reread",
        )
    })?;
    if backup_read.source_schema_version != PROJECT_SCHEMA_VERSION
        || backup_read.envelope.project_id != project_id
        || foreign_bytes.as_slice() != BACKUP_RECOVERY_FOREIGN_NOTE_BYTES
    {
        return Err(failure(
            "PROJECT_FIXTURE_EXISTS",
            "Existing backup-authoritative fixture content is not the exact protected test-owned state.",
            "after-reread",
        ));
    }

    Ok(Some(BackupAuthoritativeRecoveryPromotionFixtureReceipt {
        operation: "dicebox.project.recovery.backup-promotion.fixture".to_string(),
        status: "PASS".to_string(),
        project_id: project_id.to_string(),
        generation: backup_read.envelope.generation,
        content_sha256: backup_read.persisted_content_sha256,
        backup_byte_sha256: sha256(&backup_bytes),
        no_foundry_write: true,
    }))
}

pub fn prepare_backup_authoritative_recovery_promotion_fixture_at(
    root: &Path,
) -> Result<BackupAuthoritativeRecoveryPromotionFixtureReceipt, ProjectStoreFailure> {
    let project_id = BACKUP_AUTHORITATIVE_RECOVERY_PROMOTION_SELF_TEST_PROJECT_ID;
    let (primary, backup, project_dir) = project_paths(root, project_id)?;
    if let Some(existing) = read_existing_backup_authoritative_recovery_promotion_fixture_at(
        project_id,
        &primary,
        &backup,
        &project_dir,
    )? {
        return Ok(existing);
    }
    if project_dir.exists() {
        return Err(failure(
            "PROJECT_FIXTURE_EXISTS",
            "The backup-authoritative recovery fixture will not overwrite an existing test-owned project.",
            "remove-test-owned-project-and-reread",
        ));
    }
    let scene_id = "dbx:scene:desktop-backup-authoritative-recovery-promotion-self-test-main";
    let scene_json = serde_json::json!({
        "schemaVersion": "0.1.0", "revision": 0, "id": scene_id,
        "name": "Backup Recovery Main", "width": 1536, "height": 1024,
        "background": { "color": 7, "gridSize": 64 }, "entities": []
    })
    .to_string();
    create_project_at(
        root,
        SaveProjectRequest {
            schema_version: PROJECT_SCHEMA_VERSION.to_string(),
            project_id: project_id.to_string(),
            expected_generation: 0,
            scenes_json: vec![scene_json.clone()],
            active_scene_id: scene_id.to_string(),
            assets: None,
            expected_workspace_generation: None,
            workspace_display_name: None,
        },
    )?;
    let workspace_generation = read_workspace_index_state(root)?.envelope.generation;
    touch_workspace_project_at(
        root,
        project_id,
        Some("M244 backup recovery fixture"),
        workspace_generation,
    )?;
    save_project_at(
        root,
        SaveProjectRequest {
            schema_version: PROJECT_SCHEMA_VERSION.to_string(),
            project_id: project_id.to_string(),
            expected_generation: 1,
            scenes_json: vec![scene_json],
            active_scene_id: scene_id.to_string(),
            assets: None,
            expected_workspace_generation: None,
            workspace_display_name: None,
        },
    )?;
    if !backup.exists() {
        return Err(failure(
            "PROJECT_FIXTURE_SETUP_FAILED",
            "Backup-authoritative recovery fixture did not create a valid backup.",
            "after-reread",
        ));
    }
    fs::write(
        project_dir.join(BACKUP_RECOVERY_FOREIGN_NOTE_FILE),
        BACKUP_RECOVERY_FOREIGN_NOTE_BYTES,
    )
    .map_err(|error| {
        failure(
            "PROJECT_FIXTURE_SETUP_FAILED",
            format!(
                "Backup-authoritative recovery fixture could not write its foreign marker: {error}"
            ),
            "after-reread",
        )
    })?;
    let backup_bytes = fs::read(&backup).map_err(|error| {
        failure(
            "PROJECT_FIXTURE_SETUP_FAILED",
            format!("Backup-authoritative recovery fixture could not read its backup: {error}"),
            "after-reread",
        )
    })?;
    let backup_read = read_envelope(&backup)?;
    fs::remove_file(&primary).map_err(|error| {
        failure(
            "PROJECT_FIXTURE_SETUP_FAILED",
            format!("Backup-authoritative recovery fixture could not remove its primary: {error}"),
            "after-reread",
        )
    })?;
    sync_directory_entries(&project_dir, "PROJECT_DIRECTORY_SYNC_UNKNOWN", "Project directory")?;
    Ok(BackupAuthoritativeRecoveryPromotionFixtureReceipt {
        operation: "dicebox.project.recovery.backup-promotion.fixture".to_string(),
        status: "PASS".to_string(),
        project_id: project_id.to_string(),
        generation: backup_read.envelope.generation,
        content_sha256: backup_read.persisted_content_sha256,
        backup_byte_sha256: sha256(&backup_bytes),
        no_foundry_write: true,
    })
}

pub fn prepare_cross_producer_recovery_transition_at(
    root: &Path,
    project_id: &str,
    expected_generation: u64,
    expected_content_sha256: &str,
) -> Result<CrossProducerRecoveryTransitionReceipt, ProjectStoreFailure> {
    if project_id != CROSS_PRODUCER_COMMIT_RECOVERY_SELF_TEST_PROJECT_ID
        && project_id != CROSS_PRODUCER_COMMIT_RECOVERY_SELF_TEST_V4_PROJECT_ID
        && project_id != CROSS_PRODUCER_COMMIT_RECOVERY_SELF_TEST_V5_PROJECT_ID
    {
        return Err(failure(
            "PROJECT_TARGET_NOT_ALLOWED",
            "Cross-producer recovery transition accepts only its exact test-owned project.",
            "never",
        ));
    }
    let _lease = acquire_project_mutation_lease(root)?;
    let (primary, backup, project_dir) = project_paths(root, project_id)?;
    if !primary.exists() || (backup.exists() && !backup.is_file()) {
        return Err(failure(
            "PROJECT_FIXTURE_NOT_READY",
            "Cross-producer recovery transition requires one valid primary and a usable backup path.",
            "after-reread",
        ));
    }
    let before = read_envelope(&primary)?;
    if before.envelope.project_id != project_id
        || before.envelope.generation != expected_generation
        || before.envelope.content_sha256 != expected_content_sha256
        || before.envelope.assets.len() != 1
    {
        return Err(failure(
            "PROJECT_FIXTURE_DRIFT",
            "Cross-producer recovery transition target or committed asset-binding state did not match the reviewed expectation.",
            "after-reread",
        ));
    }
    let foreign_path = project_dir.join(BACKUP_RECOVERY_FOREIGN_NOTE_FILE);
    if !foreign_path.exists() {
        write_synced(&foreign_path, BACKUP_RECOVERY_FOREIGN_NOTE_BYTES)?;
    }
    let foreign_bytes = fs::read(&foreign_path).map_err(|error| {
        failure(
            "PROJECT_FOREIGN_STATE_MISSING",
            format!("Cross-producer recovery transition could not reread its foreign marker: {error}"),
            "after-reread",
        )
    })?;
    let committed = save_project_unlocked(
        root,
        SaveProjectRequest {
            schema_version: PROJECT_SCHEMA_VERSION.to_string(),
            project_id: project_id.to_string(),
            expected_generation,
            scenes_json: before.envelope.scenes.iter().map(|scene| scene.scene_json.clone()).collect(),
            active_scene_id: before.envelope.active_scene_id.clone(),
            assets: None,
            expected_workspace_generation: None,
            workspace_display_name: None,
        },
    )?;
    if committed.generation != expected_generation + 1 || !backup.exists() {
        return Err(failure(
            "PROJECT_RECOVERY_TRANSITION_FAILED",
            "Cross-producer recovery transition could not establish a backup at the committed asset-binding state.",
            "after-reread",
        ));
    }
    let backup_bytes = fs::read(&backup).map_err(|error| {
        failure(
            "PROJECT_RECOVERY_TRANSITION_FAILED",
            format!("Cross-producer recovery transition could not read its committed backup: {error}"),
            "after-reread",
        )
    })?;
    let backup_read = read_envelope(&backup)?;
    if backup_read.envelope.project_id != project_id
        || backup_read.envelope.generation != expected_generation
        || backup_read.envelope.content_sha256 != expected_content_sha256
    {
        return Err(failure(
            "PROJECT_RECOVERY_TRANSITION_FAILED",
            "Cross-producer recovery transition backup did not preserve the reviewed committed asset-binding state.",
            "after-reread",
        ));
    }
    fs::remove_file(&primary).map_err(|error| {
        failure(
            "PROJECT_RECOVERY_TRANSITION_FAILED",
            format!("Cross-producer recovery transition could not remove only the test-owned primary: {error}"),
            "after-reread",
        )
    })?;
    sync_directory_entries(&project_dir, "PROJECT_DIRECTORY_SYNC_UNKNOWN", "Project directory")?;
    Ok(CrossProducerRecoveryTransitionReceipt {
        operation: "dicebox.project.recovery.cross-producer-transition".to_string(),
        status: "PASS".to_string(),
        project_id: project_id.to_string(),
        before_generation: expected_generation,
        committed_generation: committed.generation,
        primary_content_sha256: committed.content_sha256,
        backup_generation: backup_read.envelope.generation,
        content_sha256: backup_read.envelope.content_sha256,
        backup_byte_sha256: sha256(&backup_bytes),
        foreign_state_sha256: sha256(&foreign_bytes),
        primary_removed: true,
        no_foundry_write: true,
    })
}

pub fn prepare_selected_missing_background_recovery_fixture_at(
    root: &Path,
) -> Result<SelectedMissingBackgroundFixtureReceipt, ProjectStoreFailure> {
    prepare_missing_background_recovery_fixture_at(
        root,
        SELECTED_MISSING_BACKGROUND_RECOVERY_SELF_TEST_PROJECT_ID,
        vec![137, 80, 78, 71, 13, 10, 26, 10, 1],
        b"RIFF\x05\x00\x00\x00WEBP!".to_vec(),
        "Selected recovery",
    )
}

pub fn prepare_asset_restore_trace_fixture_at(
    root: &Path,
) -> Result<SelectedMissingBackgroundFixtureReceipt, ProjectStoreFailure> {
    prepare_asset_restore_trace_fixture_at_for_project(root, ASSET_RESTORE_TRACE_SELF_TEST_PROJECT_ID)
}

pub fn prepare_asset_restore_trace_fixture_v2_at(
    root: &Path,
) -> Result<SelectedMissingBackgroundFixtureReceipt, ProjectStoreFailure> {
    prepare_asset_restore_trace_fixture_at_for_project(root, ASSET_RESTORE_TRACE_SELF_TEST_V2_PROJECT_ID)
}

pub fn prepare_asset_restore_trace_fixture_v3_at(
    root: &Path,
) -> Result<SelectedMissingBackgroundFixtureReceipt, ProjectStoreFailure> {
    prepare_asset_restore_trace_fixture_at_for_project(root, ASSET_RESTORE_TRACE_SELF_TEST_V3_PROJECT_ID)
}

fn prepare_asset_restore_trace_fixture_at_for_project(
    root: &Path,
    project_id: &str,
) -> Result<SelectedMissingBackgroundFixtureReceipt, ProjectStoreFailure> {
    let png_bytes = vec![137, 80, 78, 71, 13, 10, 26, 10, 2];
    let webp_bytes = b"RIFF\x06\x00\x00\x00WEBP!!".to_vec();
    if let Some(existing) = read_existing_asset_restore_trace_fixture_at(
        root,
        project_id,
        &png_bytes,
        &webp_bytes,
    )? {
        return Ok(existing);
    }
    prepare_missing_background_recovery_fixture_at(
        root,
        project_id,
        png_bytes,
        webp_bytes,
        "Asset restore trace",
    )
}

pub fn prepare_asset_detach_ui_lifecycle_fixture_at(
    root: &Path,
) -> Result<SelectedMissingBackgroundFixtureReceipt, ProjectStoreFailure> {
    let project_id = ASSET_DETACH_UI_LIFECYCLE_SELF_TEST_PROJECT_ID;
    let png_bytes = vec![137, 80, 78, 71, 13, 10, 26, 10, 3];
    let webp_bytes = b"RIFF\x07\x00\x00\x00WEBP!!!".to_vec();
    let (primary, backup, project_dir) = project_paths(root, project_id)?;
    if project_dir.exists() {
        return reuse_asset_detach_ui_lifecycle_fixture_at(
            root,
            &primary,
            &backup,
            &project_dir,
            project_id,
        );
    }
    let receipt = prepare_missing_background_recovery_fixture_at(
        root,
        project_id,
        png_bytes,
        webp_bytes.clone(),
        "Asset detach UI lifecycle",
    )?;
    let webp_target = root.join("assets/sha256").join(sha256(&webp_bytes));
    ensure_not_reparse(&webp_target, "Asset-detach UI lifecycle WebP")?;
    let mut file = OpenOptions::new()
        .write(true)
        .create_new(true)
        .open(&webp_target)
        .map_err(|error| failure(
            "PROJECT_FIXTURE_SETUP_FAILED",
            format!("Asset-detach UI lifecycle fixture could not restore its preserved WebP: {error}"),
            "after-reread",
        ))?;
    file.write_all(&webp_bytes).and_then(|_| file.sync_all()).map_err(|error| failure(
        "PROJECT_FIXTURE_SETUP_FAILED",
        format!("Asset-detach UI lifecycle fixture WebP write is unknown: {error}"),
        "after-reread",
    ))?;
    sync_directory_entries(&root.join("assets/sha256"), "PROJECT_ASSET_DIRECTORY_SYNC_UNKNOWN", "Asset directory")?;
    let inspection = inspect_project_recovery_at(root, ProjectRecoveryInspectionRequest {
        schema_version: PROJECT_SCHEMA_VERSION.to_string(),
        project_id: project_id.to_string(),
    })?;
    let png_id = format!("dbx:asset:sha256-{}", sha256(&[137, 80, 78, 71, 13, 10, 26, 10, 3]));
    let webp_id = format!("dbx:asset:sha256-{}", sha256(&webp_bytes));
    let selected = inspection.registered_assets.iter().find(|asset| asset.asset_id == png_id);
    let preserved = inspection.registered_assets.iter().find(|asset| asset.asset_id == webp_id);
    let exact = inspection.status == "BLOCKED"
        && inspection.project_id == project_id
        && inspection.generation == Some(1)
        && inspection.primary.status == "VALID"
        && inspection.backup.status == "MISSING"
        && inspection.registered_assets.len() == 2
        && inspection.scenes.len() == 2
        && selected.is_some_and(|asset| asset.disposition == "MISSING" && asset.restore_eligible && asset.affected_scene_ids.len() == 1)
        && preserved.is_some_and(|asset| asset.disposition == "PRESENT_VALID" && !asset.restore_eligible && asset.affected_scene_ids.len() == 1)
        && inspection.broken_scene_references.is_empty()
        && !inspection.pending_artifacts.iter().any(|artifact| artifact.artifact_kind == "project-pending")
        && inspection.no_write
        && inspection.no_foundry_write;
    if !exact {
        return Err(failure(
            "PROJECT_FIXTURE_SETUP_FAILED",
            "Asset-detach UI lifecycle fixture did not establish its exact selected-missing/preserved-valid topology.",
            "after-reread",
        ));
    }
    Ok(SelectedMissingBackgroundFixtureReceipt {
        operation: "dicebox.project.asset-detach-ui-lifecycle.fixture".to_string(),
        status: "PASS".to_string(),
        project_id: receipt.project_id,
        asset_ids: vec![png_id, webp_id],
        scene_ids: receipt.scene_ids,
        generation: 1,
        no_foundry_write: true,
    })
}

fn reuse_asset_detach_ui_lifecycle_fixture_at(
    root: &Path,
    primary: &Path,
    backup: &Path,
    project_dir: &Path,
    project_id: &str,
) -> Result<SelectedMissingBackgroundFixtureReceipt, ProjectStoreFailure> {
    let mismatch = || {
        failure(
            "PROJECT_FIXTURE_EXISTS",
            "The asset-detach UI lifecycle fixture will not overwrite an existing project unless it matches the exact reusable test topology.",
            "after-reread",
        )
    };
    ensure_not_reparse(project_dir, "Asset-detach UI lifecycle project directory")
        .map_err(|_| mismatch())?;
    ensure_not_reparse(primary, "Asset-detach UI lifecycle fixture primary")
        .map_err(|_| mismatch())?;
    ensure_not_reparse(backup, "Asset-detach UI lifecycle fixture backup")
        .map_err(|_| mismatch())?;
    let entries = fs::read_dir(project_dir)
        .map_err(|_| mismatch())?
        .map(|entry| entry.map(|value| value.file_name().to_string_lossy().into_owned()))
        .collect::<Result<BTreeSet<_>, _>>()
        .map_err(|_| mismatch())?;
    let expected_entries = ["project.json".to_string()]
        .into_iter()
        .collect::<BTreeSet<_>>();
    if entries != expected_entries || backup.exists() {
        return Err(mismatch());
    }

    let png_bytes = vec![137, 80, 78, 71, 13, 10, 26, 10, 3];
    let webp_bytes = b"RIFF\x07\x00\x00\x00WEBP!!!".to_vec();
    let png_digest = sha256(&png_bytes);
    let webp_digest = sha256(&webp_bytes);
    let png_asset_id = format!("dbx:asset:sha256-{png_digest}");
    let webp_asset_id = format!("dbx:asset:sha256-{webp_digest}");
    let first_scene_id = format!("dbx:scene:{}-1", &project_id[12..]);
    let second_scene_id = format!("dbx:scene:{}-2", &project_id[12..]);
    let expected_assets = vec![
        StoredAsset {
            sha256: png_digest.clone(),
            media_type: "image/png".to_string(),
            byte_length: png_bytes.len(),
            relative_path: canonical_asset_relative_path(&png_digest).map_err(|_| mismatch())?,
            registration: Some(ProjectAssetRegistration {
                asset_id: png_asset_id.clone(),
                role: "background".to_string(),
                label: "Asset detach UI lifecycle PNG".to_string(),
                provenance: "debug-selected-recovery-fixture".to_string(),
                approval: "approved".to_string(),
            }),
        },
        StoredAsset {
            sha256: webp_digest.clone(),
            media_type: "image/webp".to_string(),
            byte_length: webp_bytes.len(),
            relative_path: canonical_asset_relative_path(&webp_digest).map_err(|_| mismatch())?,
            registration: Some(ProjectAssetRegistration {
                asset_id: webp_asset_id.clone(),
                role: "background".to_string(),
                label: "Asset detach UI lifecycle WebP".to_string(),
                provenance: "debug-selected-recovery-fixture".to_string(),
                approval: "approved".to_string(),
            }),
        },
    ];
    let expected_scenes = vec![
        selected_missing_background_fixture_scene(
            &first_scene_id,
            "Asset detach UI lifecycle 1",
            &png_asset_id,
            1,
        ),
        selected_missing_background_fixture_scene(
            &second_scene_id,
            "Asset detach UI lifecycle 2",
            &webp_asset_id,
            2,
        ),
    ];
    let envelope = serde_json::from_slice::<ProjectEnvelope>(
        &fs::read(primary).map_err(|_| mismatch())?,
    )
    .map_err(|_| mismatch())?;
    if envelope.schema_version != PROJECT_SCHEMA_VERSION
        || envelope.project_id != project_id
        || envelope.generation != 1
        || envelope.active_scene_id != second_scene_id
        || envelope.assets != expected_assets
        || envelope.scenes.len() != expected_scenes.len()
        || envelope
            .scenes
            .iter()
            .zip(expected_scenes.iter())
            .any(|(scene, expected)| {
                scene.scene_json != *expected
                    || sha256(scene.scene_json.as_bytes()) != scene.scene_sha256
            })
        || content_hash(&envelope) != envelope.content_sha256
    {
        return Err(mismatch());
    }

    let expected_preserved_asset = &envelope.assets[1];
    let webp_target = registered_asset_target(root, expected_preserved_asset)
        .map_err(|_| mismatch())?;
    ensure_not_reparse(&webp_target, "Asset-detach UI lifecycle WebP")
        .map_err(|_| mismatch())?;
    let webp_metadata = fs::symlink_metadata(&webp_target).map_err(|_| mismatch())?;
    if !webp_metadata.is_file()
        || fs::read(&webp_target).map_err(|_| mismatch())? != webp_bytes
    {
        return Err(mismatch());
    }
    let expected_missing_asset = &envelope.assets[0];
    let png_target = registered_asset_target(root, expected_missing_asset)
        .map_err(|_| mismatch())?;
    ensure_not_reparse(&png_target, "Asset-detach UI lifecycle PNG")
        .map_err(|_| mismatch())?;
    if png_target.exists() {
        return Err(mismatch());
    }

    let inspection = inspect_project_recovery_at(
        root,
        ProjectRecoveryInspectionRequest {
            schema_version: PROJECT_SCHEMA_VERSION.to_string(),
            project_id: project_id.to_string(),
        },
    )
    .map_err(|_| mismatch())?;
    let selected = inspection
        .registered_assets
        .iter()
        .find(|asset| asset.asset_id == png_asset_id);
    let preserved = inspection
        .registered_assets
        .iter()
        .find(|asset| asset.asset_id == webp_asset_id);
    let exact = inspection.status == "BLOCKED"
        && inspection.project_id == project_id
        && inspection.generation == Some(1)
        && inspection.primary.status == "VALID"
        && inspection.backup.status == "MISSING"
        && inspection.registered_assets.len() == 2
        && inspection.scenes.len() == 2
        && selected.is_some_and(|asset| {
            asset.disposition == "MISSING"
                && asset.restore_eligible
                && asset.affected_scene_ids == vec![first_scene_id.clone()]
        })
        && preserved.is_some_and(|asset| {
            asset.disposition == "PRESENT_VALID"
                && !asset.restore_eligible
                && asset.affected_scene_ids == vec![second_scene_id.clone()]
        })
        && inspection.broken_scene_references.is_empty()
        && !inspection
            .pending_artifacts
            .iter()
            .any(|artifact| artifact.artifact_kind == "project-pending")
        && inspection.no_write
        && inspection.no_foundry_write;
    if !exact {
        return Err(mismatch());
    }
    Ok(SelectedMissingBackgroundFixtureReceipt {
        operation: "dicebox.project.asset-detach-ui-lifecycle.fixture".to_string(),
        status: "PASS".to_string(),
        project_id: project_id.to_string(),
        asset_ids: vec![png_asset_id, webp_asset_id],
        scene_ids: vec![first_scene_id, second_scene_id],
        generation: 1,
        no_foundry_write: true,
    })
}

fn read_existing_asset_restore_trace_fixture_at(
    root: &Path,
    project_id: &str,
    png_bytes: &[u8],
    webp_bytes: &[u8],
) -> Result<Option<SelectedMissingBackgroundFixtureReceipt>, ProjectStoreFailure> {
    let (_, _, project_dir) = project_paths(root, project_id)?;
    if !project_dir.exists() {
        return Ok(None);
    }
    let inspection = inspect_project_recovery_at(root, ProjectRecoveryInspectionRequest {
        schema_version: PROJECT_SCHEMA_VERSION.to_string(),
        project_id: project_id.to_string(),
    }).map_err(|_| failure("PROJECT_FIXTURE_EXISTS", "Existing asset-restore trace fixture could not be reread.", "after-reread"))?;
    let png_id = format!("dbx:asset:sha256-{}", sha256(png_bytes));
    let webp_id = format!("dbx:asset:sha256-{}", sha256(webp_bytes));
    let expected = [
        (&png_id, "image/png", png_bytes.len(), format!("dbx:scene:{}-1", &project_id[12..])),
        (&webp_id, "image/webp", webp_bytes.len(), format!("dbx:scene:{}-2", &project_id[12..])),
    ];
    let exact = inspection.status == "BLOCKED"
        && inspection.project_id == project_id
        && inspection.generation == Some(1)
        && inspection.primary.status == "VALID"
        && inspection.backup.status == "MISSING"
        && inspection.registered_assets.len() == 2
        && inspection.no_write
        && inspection.no_foundry_write
        && expected.iter().all(|(id, media_type, byte_length, scene_id)| inspection.registered_assets.iter().any(|asset|
            asset.asset_id == **id
                && asset.role == "background"
                && asset.media_type == *media_type
                && asset.byte_length == *byte_length
                && asset.disposition == "MISSING"
                && asset.restore_eligible
                && asset.affected_scene_ids == vec![scene_id.clone()]
                && !root.join(&asset.relative_path).exists()));
    if !exact {
        return Err(failure("PROJECT_FIXTURE_EXISTS", "Existing asset-restore trace fixture is not the exact protected missing-asset topology.", "after-reread"));
    }
    Ok(Some(SelectedMissingBackgroundFixtureReceipt {
        operation: "dicebox.project.selected-missing-background-recovery.fixture".to_string(),
        status: "PASS".to_string(),
        project_id: project_id.to_string(),
        asset_ids: vec![png_id.clone(), webp_id.clone()],
        scene_ids: expected.iter().map(|(_, _, _, scene_id)| scene_id.clone()).collect(),
        generation: 1,
        no_foundry_write: true,
    }))
}

fn prepare_missing_background_recovery_fixture_at(
    root: &Path,
    project_id: &str,
    png_bytes: Vec<u8>,
    webp_bytes: Vec<u8>,
    label_prefix: &str,
) -> Result<SelectedMissingBackgroundFixtureReceipt, ProjectStoreFailure> {
    let (_, _, project_dir) = project_paths(root, project_id)?;
    if project_dir.exists() {
        return Err(failure(
            "PROJECT_FIXTURE_EXISTS",
            "The selected-recovery fixture will not overwrite an existing test-owned project.",
            "remove-test-owned-project-and-reread",
        ));
    }

    let png_digest = sha256(&png_bytes);
    let webp_digest = sha256(&webp_bytes);
    let png_asset_id = format!("dbx:asset:sha256-{png_digest}");
    let webp_asset_id = format!("dbx:asset:sha256-{webp_digest}");
    let png_input = ProjectAssetInput {
        media_type: "image/png".to_string(),
        bytes: png_bytes.clone(),
        registration: Some(ProjectAssetRegistration {
            asset_id: png_asset_id.clone(),
            role: "background".to_string(),
            label: format!("{label_prefix} PNG"),
            provenance: "debug-selected-recovery-fixture".to_string(),
            approval: "approved".to_string(),
        }),
    };
    let webp_input = ProjectAssetInput {
        media_type: "image/webp".to_string(),
        bytes: webp_bytes.clone(),
        registration: Some(ProjectAssetRegistration {
            asset_id: webp_asset_id.clone(),
            role: "background".to_string(),
            label: format!("{label_prefix} WebP"),
            provenance: "debug-selected-recovery-fixture".to_string(),
            approval: "approved".to_string(),
        }),
    };
    let first_scene_id = format!("dbx:scene:{}-1", &project_id[12..]);
    let second_scene_id = format!("dbx:scene:{}-2", &project_id[12..]);
    create_project_at(
        root,
        SaveProjectRequest {
            schema_version: PROJECT_SCHEMA_VERSION.to_string(),
            project_id: project_id.to_string(),
            expected_generation: 0,
            scenes_json: vec![
                selected_missing_background_fixture_scene(
                    &first_scene_id,
                    &format!("{label_prefix} 1"),
                    &png_asset_id,
                    1,
                ),
                selected_missing_background_fixture_scene(
                    &second_scene_id,
                    &format!("{label_prefix} 2"),
                    &webp_asset_id,
                    2,
                ),
            ],
            active_scene_id: second_scene_id.clone(),
            assets: Some(vec![png_input, webp_input]),
            expected_workspace_generation: None,
            workspace_display_name: None,
        },
    )?;

    for digest in [&png_digest, &webp_digest] {
        let target = root.join("assets/sha256").join(digest);
        ensure_not_reparse(&target, "Selected-recovery fixture asset")?;
        fs::remove_file(&target).map_err(|error| {
            failure(
                "PROJECT_FIXTURE_SETUP_FAILED",
                format!("Missing-background recovery fixture asset could not be made missing: {error}"),
                "after-reread",
            )
        })?;
    }
    Ok(SelectedMissingBackgroundFixtureReceipt {
        operation: "dicebox.project.selected-missing-background-recovery.fixture".to_string(),
        status: "PASS".to_string(),
        project_id: project_id.to_string(),
        asset_ids: vec![png_asset_id, webp_asset_id],
        scene_ids: vec![first_scene_id, second_scene_id],
        generation: 1,
        no_foundry_write: true,
    })
}

fn inspect_project_recovery_context(
    root: &Path,
    request: ProjectRecoveryInspectionRequest,
) -> Result<ProjectRecoveryContext, ProjectStoreFailure> {
    if request.schema_version != PROJECT_SCHEMA_VERSION {
        return Err(failure(
            "UNSUPPORTED_REQUEST_SCHEMA",
            "Recovery inspection request schema is not supported.",
            "never",
        ));
    }
    validate_project_id(&request.project_id)?;
    ensure_not_reparse(root, "Project-store root")?;
    let projects = root.join("projects");
    ensure_not_reparse(&projects, "Projects directory")?;
    let (primary_path, backup_path, project_dir) = project_paths(root, &request.project_id)?;
    ensure_not_reparse(&project_dir, "Project directory")?;
    if let Ok(metadata) = fs::symlink_metadata(&project_dir) {
        if !metadata.is_dir() {
            return Err(failure(
                "PROJECT_ENTRY_NOT_DIRECTORY",
                "Exact project path is not a directory.",
                "never",
            ));
        }
    }
    let primary_relative_path = format!(
        "projects/{}/project.json",
        validate_project_id(&request.project_id)?
    );
    let backup_relative_path = format!(
        "projects/{}/project.backup.json",
        validate_project_id(&request.project_id)?
    );
    let primary = probe_project_file(&primary_path, &primary_relative_path);
    let backup = probe_project_file(&backup_path, &backup_relative_path);
    let pending_artifacts = inspect_owned_pending_artifacts(root, &project_dir, &request.project_id);
    let mut broken_scene_references = inspect_broken_scene_asset_references(
        &primary_path,
        &primary_relative_path,
        &request.project_id,
    );
    broken_scene_references.extend(inspect_broken_scene_asset_references(
        &backup_path,
        &backup_relative_path,
        &request.project_id,
    ));
    broken_scene_references.sort_by(|left, right| {
        left.source
            .cmp(&right.source)
            .then_with(|| left.scene_id.cmp(&right.scene_id))
            .then_with(|| left.asset_id.cmp(&right.asset_id))
    });
    let (read, recovered_from, selection_failure) = if let Some(read) = primary.read.clone() {
        (Some(read), None, None)
    } else if let Some(read) = backup.read.clone() {
        (Some(read), Some("project.backup.json".to_string()), None)
    } else {
        let primary_missing = primary.disposition.status == "MISSING";
        let selected_failure = if primary_missing {
            backup.failure.clone().or(primary.failure.clone())
        } else {
            primary.failure.clone().or(backup.failure.clone())
        };
        (None, None, selected_failure)
    };

    if let Some(read) = &read {
        if read.envelope.project_id != request.project_id {
            let blocker = failure(
                "PROJECT_ID_MISMATCH",
                "Stored project identity does not match the requested project.",
                "never",
            );
            return Ok(ProjectRecoveryContext {
                receipt: ProjectRecoveryInspectionReceipt {
                    operation: "dicebox.project.recovery.inspect".to_string(),
                    status: "BLOCKED".to_string(),
                    project_id: request.project_id,
                    generation: Some(read.envelope.generation),
                    content_sha256: Some(read.persisted_content_sha256.clone()),
                    active_scene_id: Some(read.envelope.active_scene_id.clone()),
                    scenes: read
                        .envelope
                        .scenes
                        .iter()
                        .map(|scene| ProjectSceneReceipt {
                            scene_id: scene.scene_id.clone(),
                            scene_sha256: scene.scene_sha256.clone(),
                        })
                        .collect(),
                    primary: primary.disposition,
                    backup: backup.disposition,
                    recovered_from,
                    migration_status: Some(read.migration_status.clone()),
                    registered_assets: vec![],
                    pending_artifacts,
                    broken_scene_references,
                    blocker_code: Some(blocker.code),
                    blocker_message: Some(blocker.message),
                    retry: blocker.retry,
                    restore_eligible: false,
                    no_write: true,
                    no_foundry_write: true,
                },
                read: None,
            });
        }
        let assets = inspect_registered_assets(root, read);
        let first_blocker = assets.iter().find(|asset| asset.blocker_code.is_some());
        let first_pending_blocker = pending_artifacts
            .iter()
            .find(|artifact| artifact.blocker_code.is_some());
        let first_broken_reference = broken_scene_references.first();
        let status = if first_blocker.is_some()
            || first_pending_blocker.is_some()
            || first_broken_reference.is_some()
        {
            "BLOCKED"
        } else {
            "PASS"
        };
        let blocker_code = first_broken_reference
            .map(|reference| reference.blocker_code.clone())
            .or_else(|| first_blocker.and_then(|asset| asset.blocker_code.clone()))
            .or_else(|| first_pending_blocker.and_then(|artifact| artifact.blocker_code.clone()));
        let blocker_message = first_broken_reference
            .map(|reference| reference.blocker_message.clone())
            .or_else(|| first_blocker.and_then(|asset| asset.blocker_message.clone()))
            .or_else(|| first_pending_blocker.and_then(|artifact| artifact.blocker_message.clone()));
        let retry = first_broken_reference
            .map(|reference| reference.retry.clone())
            .or_else(|| first_blocker.map(|asset| asset.retry.clone()))
            .or_else(|| first_pending_blocker.map(|artifact| artifact.retry.clone()))
            .unwrap_or_else(|| "never".to_string());
        let receipt = ProjectRecoveryInspectionReceipt {
            operation: "dicebox.project.recovery.inspect".to_string(),
            status: status.to_string(),
            project_id: request.project_id,
            generation: Some(read.envelope.generation),
            content_sha256: Some(read.persisted_content_sha256.clone()),
            active_scene_id: Some(read.envelope.active_scene_id.clone()),
            scenes: read
                .envelope
                .scenes
                .iter()
                .map(|scene| ProjectSceneReceipt {
                    scene_id: scene.scene_id.clone(),
                    scene_sha256: scene.scene_sha256.clone(),
                })
                .collect(),
            primary: primary.disposition,
            backup: backup.disposition,
            recovered_from,
            migration_status: Some(read.migration_status.clone()),
            blocker_code,
            blocker_message,
            retry,
            restore_eligible: assets.iter().any(|asset| asset.restore_eligible),
            registered_assets: assets,
            pending_artifacts,
            broken_scene_references,
            no_write: true,
            no_foundry_write: true,
        };
        return Ok(ProjectRecoveryContext {
            receipt,
            read: Some(read.clone()),
        });
    }

    let blocker = selection_failure.unwrap_or_else(|| {
        failure(
            "PROJECT_UNAVAILABLE",
            "Neither primary nor backup project envelope is available.",
            "after-reread",
        )
    });
    Ok(ProjectRecoveryContext {
        receipt: ProjectRecoveryInspectionReceipt {
            operation: "dicebox.project.recovery.inspect".to_string(),
            status: "BLOCKED".to_string(),
            project_id: request.project_id,
            generation: None,
            content_sha256: None,
            active_scene_id: None,
            scenes: vec![],
            primary: primary.disposition,
            backup: backup.disposition,
            recovered_from: None,
            migration_status: None,
            registered_assets: vec![],
            pending_artifacts,
            broken_scene_references: broken_scene_references.clone(),
            blocker_code: broken_scene_references
                .first()
                .map(|reference| reference.blocker_code.clone())
                .or_else(|| Some(blocker.code)),
            blocker_message: broken_scene_references
                .first()
                .map(|reference| reference.blocker_message.clone())
                .or_else(|| Some(blocker.message)),
            retry: broken_scene_references
                .first()
                .map(|reference| reference.retry.clone())
                .unwrap_or(blocker.retry),
            restore_eligible: false,
            no_write: true,
            no_foundry_write: true,
        },
        read: None,
    })
}

pub fn inspect_project_recovery_at(
    root: &Path,
    request: ProjectRecoveryInspectionRequest,
) -> Result<ProjectRecoveryInspectionReceipt, ProjectStoreFailure> {
    Ok(inspect_project_recovery_context(root, request)?.receipt)
}

pub fn explain_project_migration_at(
    root: &Path,
    request: ProjectMigrationExplanationRequest,
) -> Result<ProjectMigrationExplanationReceipt, ProjectStoreFailure> {
    if request.schema_version != PROJECT_SCHEMA_VERSION {
        return Err(failure(
            "UNSUPPORTED_REQUEST_SCHEMA",
            "Migration explanation request schema is not supported.",
            "never",
        ));
    }
    let project_slug = validate_project_id(&request.project_id)?;
    let primary_relative_path = format!("projects/{project_slug}/project.json");
    let backup_relative_path = format!("projects/{project_slug}/project.backup.json");
    let context = match inspect_project_recovery_context(
        root,
        ProjectRecoveryInspectionRequest {
            schema_version: request.schema_version,
            project_id: request.project_id.clone(),
        },
    ) {
        Ok(context) => context,
        Err(blocker) => {
            let primary =
                file_disposition_failure(&primary_relative_path, "BLOCKED", blocker.clone())
                    .disposition;
            let backup =
                file_disposition_failure(&backup_relative_path, "BLOCKED", blocker.clone())
                    .disposition;
            return Ok(ProjectMigrationExplanationReceipt {
                operation: "dicebox.project.migration.explain".to_string(),
                status: "blocked".to_string(),
                project_id: request.project_id,
                authoritative_source: None,
                primary,
                backup,
                source_schema_version: None,
                target_schema_version: PROJECT_SCHEMA_VERSION.to_string(),
                migration_status: None,
                generation: None,
                content_sha256: None,
                actions: vec![],
                blockers: vec![blocker.message],
                retry: blocker.retry,
                no_write: true,
                no_foundry_write: true,
            });
        }
    };
    let primary = context.receipt.primary.clone();
    let backup = context.receipt.backup.clone();
    if let Some(read) = context.read {
        let preview = preview_project_migration(&read.source_schema_version);
        let authoritative_source = context
            .receipt
            .recovered_from
            .clone()
            .unwrap_or_else(|| "project.json".to_string());
        return Ok(ProjectMigrationExplanationReceipt {
            operation: "dicebox.project.migration.explain".to_string(),
            status: preview.status,
            project_id: request.project_id,
            authoritative_source: Some(authoritative_source),
            primary,
            backup,
            source_schema_version: Some(read.source_schema_version),
            target_schema_version: preview.target_version,
            migration_status: Some(read.migration_status),
            generation: Some(read.envelope.generation),
            content_sha256: Some(read.persisted_content_sha256),
            actions: preview.actions,
            blockers: preview.blockers,
            retry: "not-applicable-read-only".to_string(),
            no_write: true,
            no_foundry_write: true,
        });
    }

    let source_schema_version = primary
        .source_schema_version
        .clone()
        .or_else(|| backup.source_schema_version.clone());
    let preview = source_schema_version
        .as_deref()
        .map(preview_project_migration);
    let mut blockers = preview
        .as_ref()
        .map(|value| value.blockers.clone())
        .unwrap_or_default();
    if let Some(message) = context.receipt.blocker_message.clone() {
        if !blockers.contains(&message) {
            blockers.push(message);
        }
    }
    if blockers.is_empty() {
        blockers.push("No validated primary or backup project envelope is available.".to_string());
    }
    Ok(ProjectMigrationExplanationReceipt {
        operation: "dicebox.project.migration.explain".to_string(),
        status: "blocked".to_string(),
        project_id: request.project_id,
        authoritative_source: None,
        primary,
        backup,
        source_schema_version,
        target_schema_version: PROJECT_SCHEMA_VERSION.to_string(),
        migration_status: None,
        generation: None,
        content_sha256: None,
        actions: preview.map(|value| value.actions).unwrap_or_default(),
        blockers,
        retry: context.receipt.retry,
        no_write: true,
        no_foundry_write: true,
    })
}

fn read_backup_authoritative_recovery_candidate(
    root: &Path,
    project_id: &str,
) -> Result<(
    ReadProjectEnvelope,
    ProjectRecoveryFileDisposition,
    ProjectRecoveryFileDisposition,
    PathBuf,
    PathBuf,
    Vec<u8>,
), ProjectStoreFailure> {
    validate_project_id(project_id)?;
    let (primary, backup, project_dir) = project_paths(root, project_id)?;
    ensure_not_reparse(root, "Project-store root")?;
    ensure_not_reparse(&project_dir, "Project directory")?;
    let primary_relative_path = format!("projects/{project_id}/project.json");
    let backup_relative_path = format!("projects/{project_id}/project.backup.json");
    let primary_probe = probe_project_file(&primary, &primary_relative_path);
    if primary_probe.disposition.status != "MISSING" {
        return Err(failure(
            "BACKUP_PROMOTION_PRIMARY_PRESENT",
            "Backup-authoritative promotion requires the selected project primary to be missing; a present or corrupt primary is never replaced by this operation.",
            "after-reread",
        ));
    }
    let backup_probe = probe_project_file(&backup, &backup_relative_path);
    if backup_probe.disposition.status != "VALID" {
        return Err(backup_probe.failure.unwrap_or_else(|| {
            failure(
                "BACKUP_PROMOTION_BACKUP_REQUIRED",
                "A valid current project backup is required for backup-authoritative promotion.",
                "after-reread",
            )
        }));
    }
    let read = backup_probe.read.ok_or_else(|| {
        failure(
            "BACKUP_PROMOTION_BACKUP_REQUIRED",
            "A valid backup disposition did not include a readable project envelope.",
            "after-reread",
        )
    })?;
    if read.envelope.project_id != project_id {
        return Err(failure(
            "PROJECT_ID_MISMATCH",
            "Backup project identity does not match the selected recovery target.",
            "never",
        ));
    }
    if read.source_schema_version != PROJECT_SCHEMA_VERSION
        || read.migration_status != "current"
    {
        return Err(failure(
            "BACKUP_PROMOTION_SCHEMA_UNSUPPORTED",
            "Backup-authoritative promotion accepts only a valid current-schema 0.3.0 backup; legacy and unsupported backups require a separate migration path.",
            "never",
        ));
    }
    let loaded = load_project_at(
        root,
        LoadProjectRequest {
            schema_version: PROJECT_SCHEMA_VERSION.to_string(),
            project_id: project_id.to_string(),
            expected_workspace_generation: None,
        },
    )?;
    if loaded.receipt.recovered_from.as_deref() != Some("project.backup.json")
        || loaded.receipt.generation != read.envelope.generation
        || loaded.receipt.persisted_content_sha256 != read.persisted_content_sha256
    {
        return Err(failure(
            "BACKUP_PROMOTION_REREAD_FAILED",
            "The selected current backup could not be authoritatively reread as the recovery source.",
            "after-reread",
        ));
    }
    let backup_bytes = fs::read(&backup).map_err(|error| {
        failure(
            "BACKUP_PROMOTION_BACKUP_REQUIRED",
            format!("Current project backup could not be reread: {error}"),
            "after-reread",
        )
    })?;
    if sha256(&backup_bytes) != backup_probe.disposition.byte_sha256.clone().unwrap_or_default() {
        return Err(failure(
            "BACKUP_PROMOTION_REREAD_FAILED",
            "The backup byte digest changed during candidate inspection.",
            "after-reread",
        ));
    }
    Ok((
        read,
        primary_probe.disposition,
        backup_probe.disposition,
        primary,
        backup,
        backup_bytes,
    ))
}

fn backup_authoritative_recovery_preview_sha256(
    receipt: &BackupRecoveryPromotionPreviewReceipt,
) -> String {
    let mut canonical = format!(
        "{}\n{}\n{}\n{}\n{}\n{}\n{}\n{}\n{}\n{}\n{}\n{}\n{}\n{}\n{}\n{}\n{}\n{}\n{}\n",
        receipt.operation,
        receipt.project_id,
        receipt.primary.status,
        receipt.backup.status,
        receipt.generation,
        receipt.content_sha256,
        receipt.active_scene_id,
        receipt.asset_count,
        receipt.asset_collection_sha256,
        receipt.semantic_state_sha256,
        receipt.backup_byte_sha256,
        receipt.protected_state_sha256,
        receipt.asset_tree_sha256,
        receipt.requires_approval,
        receipt.no_write,
        receipt.no_foundry_write,
        receipt.scenes.len(),
        receipt.primary.relative_path,
        receipt.backup.relative_path,
    );
    for scene in &receipt.scenes {
        canonical.push_str(&format!("{}\n{}\n", scene.scene_id, scene.scene_sha256));
    }
    sha256(canonical.as_bytes())
}

pub fn preview_backup_authoritative_recovery_at(
    root: &Path,
    request: BackupRecoveryPromotionPreviewRequest,
) -> Result<BackupRecoveryPromotionPreviewReceipt, ProjectStoreFailure> {
    if request.schema_version != PROJECT_SCHEMA_VERSION {
        return Err(failure(
            "UNSUPPORTED_REQUEST_SCHEMA",
            "Backup recovery promotion preview schema is not supported.",
            "never",
        ));
    }
    let (read, primary, backup, primary_path, backup_path, _) =
        read_backup_authoritative_recovery_candidate(root, &request.project_id)?;
    let scenes = read
        .envelope
        .scenes
        .iter()
        .map(|scene| ProjectSceneReceipt {
            scene_id: scene.scene_id.clone(),
            scene_sha256: scene.scene_sha256.clone(),
        })
        .collect::<Vec<_>>();
    let mut receipt = BackupRecoveryPromotionPreviewReceipt {
        operation: "dicebox.project.recovery.backup-promotion.preview".to_string(),
        status: "PREVIEW".to_string(),
        project_id: request.project_id,
        primary,
        backup,
        generation: read.envelope.generation,
        content_sha256: read.persisted_content_sha256,
        scenes,
        active_scene_id: read.envelope.active_scene_id.clone(),
        asset_count: read.envelope.assets.len(),
        asset_collection_sha256: asset_collection_sha256(&read.envelope.assets),
        semantic_state_sha256: migration_semantic_state_sha256(&read.envelope),
        backup_byte_sha256: optional_regular_file_sha256(&backup_path, "Backup project envelope")?
            .ok_or_else(|| {
                failure(
                    "BACKUP_PROMOTION_BACKUP_REQUIRED",
                    "A readable backup byte digest is required for promotion preview.",
                    "after-reread",
                )
            })?,
        protected_state_sha256: protected_state_sha256_excluding(
            root,
            &[primary_path.clone(), backup_path.clone()],
        )?,
        asset_tree_sha256: owned_tree_sha256(root, &root.join("assets"))?,
        preview_sha256: String::new(),
        requires_approval: true,
        no_write: true,
        no_foundry_write: true,
    };
    receipt.preview_sha256 = backup_authoritative_recovery_preview_sha256(&receipt);
    Ok(receipt)
}

pub fn promote_backup_authoritative_recovery_at(
    root: &Path,
    request: BackupRecoveryPromotionRequest,
) -> Result<BackupRecoveryPromotionReceipt, ProjectStoreFailure> {
    if request.schema_version != PROJECT_SCHEMA_VERSION {
        return Err(failure(
            "UNSUPPORTED_REQUEST_SCHEMA",
            "Backup recovery promotion schema is not supported.",
            "never",
        ));
    }
    if !request.approved {
        return Err(failure(
            "BACKUP_PROMOTION_NOT_APPROVED",
            "Backup-authoritative promotion requires explicit approval.",
            "never",
        ));
    }
    for digest in [
        request.content_sha256.as_str(),
        request.backup_byte_sha256.as_str(),
        request.protected_state_sha256.as_str(),
        request.asset_tree_sha256.as_str(),
        request.preview_sha256.as_str(),
    ] {
        validate_sha256(digest).map_err(|_| {
            failure(
                "INVALID_BACKUP_PROMOTION_PREVIEW",
                "Backup promotion hashes must be lowercase SHA-256 digests.",
                "never",
            )
        })?;
    }
    let _lease = acquire_project_mutation_lease(root)?;
    let preview = preview_backup_authoritative_recovery_at(
        root,
        BackupRecoveryPromotionPreviewRequest {
            schema_version: request.schema_version.clone(),
            project_id: request.project_id.clone(),
        },
    )?;
    if preview.preview_sha256 != request.preview_sha256
        || preview.generation != request.generation
        || preview.content_sha256 != request.content_sha256
        || preview.backup_byte_sha256 != request.backup_byte_sha256
        || preview.protected_state_sha256 != request.protected_state_sha256
        || preview.asset_tree_sha256 != request.asset_tree_sha256
    {
        return Err(failure(
            "STALE_BACKUP_PROMOTION_PREVIEW",
            "Project recovery state no longer matches the approved backup promotion preview.",
            "after-reread",
        ));
    }
    let (before_read, _, _, primary, backup, backup_bytes) =
        read_backup_authoritative_recovery_candidate(root, &request.project_id)?;
    let project_dir = primary.parent().ok_or_else(|| {
        failure(
            "PROJECT_PATH_UNAVAILABLE",
            "Backup promotion target has no project directory.",
            "never",
        )
    })?;
    ensure_not_reparse(project_dir, "Project directory")?;
    let staged = project_dir.join(format!("project.{}.pending", request.backup_byte_sha256));
    if staged.exists() {
        return Err(failure(
            "PROJECT_RECOVERY_BLOCKED",
            "An owned backup-promotion pending artifact already exists; reread is required before retrying.",
            "after-reread",
        ));
    }
    let workspace_before = (
        optional_regular_file_sha256(&root.join("workspace-index.json"), "Primary workspace metadata")?,
        optional_regular_file_sha256(
            &root.join("workspace-index.backup.json"),
            "Backup workspace metadata",
        )?,
    );
    let semantic_before = migration_semantic_state_sha256(&before_read.envelope);
    write_synced(&staged, &backup_bytes)?;
    fs::rename(&staged, &primary).map_err(|error| {
        failure(
            "PROJECT_COMMIT_UNKNOWN",
            format!("Backup promotion outcome is unknown: {error}"),
            "after-reread",
        )
    })?;
    let reread_bytes = fs::read(&primary).map_err(|error| {
        failure(
            "PROJECT_REREAD_FAILED",
            format!("Promoted project primary could not be reread: {error}"),
            "after-reread",
        )
    })?;
    if reread_bytes != backup_bytes {
        return Err(failure(
            "PROJECT_REREAD_FAILED",
            "Promoted primary bytes do not exactly match the approved backup bytes.",
            "after-reread",
        ));
    }
    sync_directory_entries(project_dir, "PROJECT_DIRECTORY_SYNC_UNKNOWN", "Project directory")?;
    let reread = load_project_at(
        root,
        LoadProjectRequest {
            schema_version: PROJECT_SCHEMA_VERSION.to_string(),
            project_id: request.project_id.clone(),
            expected_workspace_generation: None,
        },
    )?;
    let backup_unchanged = optional_regular_file_sha256(&backup, "Backup project envelope")?
        .as_deref()
        == Some(request.backup_byte_sha256.as_str());
    let primary_restored = optional_regular_file_sha256(&primary, "Primary project envelope")?
        .as_deref()
        == Some(request.backup_byte_sha256.as_str());
    let semantic_state_unchanged = migration_semantic_state_sha256(&before_read.envelope)
        == semantic_before
        && migration_semantic_state_sha256(
            &read_envelope(&primary)?.envelope,
        ) == preview.semantic_state_sha256;
    let asset_tree_unchanged =
        owned_tree_sha256(root, &root.join("assets"))? == preview.asset_tree_sha256;
    let workspace_after = (
        optional_regular_file_sha256(&root.join("workspace-index.json"), "Primary workspace metadata")?,
        optional_regular_file_sha256(
            &root.join("workspace-index.backup.json"),
            "Backup workspace metadata",
        )?,
    );
    let workspace_unchanged = workspace_before == workspace_after;
    let foreign_state_unchanged = protected_state_sha256_excluding(
        root,
        &[primary.clone(), backup.clone()],
    )? == preview.protected_state_sha256;
    let authoritative_current_reread = reread.receipt.recovered_from.is_none()
        && reread.receipt.migration_status == "current"
        && reread.receipt.generation == preview.generation
        && reread.receipt.persisted_content_sha256 == preview.content_sha256;
    if !primary_restored
        || !backup_unchanged
        || !semantic_state_unchanged
        || !asset_tree_unchanged
        || !workspace_unchanged
        || !foreign_state_unchanged
        || !authoritative_current_reread
    {
        return Err(failure(
            "BACKUP_PROMOTION_REREAD_FAILED",
            "Backup promotion reread did not preserve the approved current envelope, backup, semantic, asset, workspace, or foreign-state boundary.",
            "after-reread",
        ));
    }
    Ok(BackupRecoveryPromotionReceipt {
        operation: "dicebox.project.recovery.backup-promotion".to_string(),
        status: "PASS".to_string(),
        project_id: request.project_id,
        generation: reread.receipt.generation,
        content_sha256: reread.receipt.persisted_content_sha256,
        scenes: reread.receipt.scenes,
        active_scene_id: reread.receipt.active_scene_id,
        asset_count: reread.receipt.asset_count,
        primary_restored,
        backup_unchanged,
        semantic_state_unchanged,
        asset_tree_unchanged,
        workspace_unchanged,
        foreign_state_unchanged,
        authoritative_current_reread,
        backup_byte_sha256: request.backup_byte_sha256,
        preview_sha256: request.preview_sha256,
        directory_entry_sync: true,
        no_foundry_write: true,
    })
}

fn migration_semantic_state_sha256(envelope: &ProjectEnvelope) -> String {
    let mut canonical = format!("{}\n{}\n", envelope.project_id, envelope.active_scene_id);
    for scene in &envelope.scenes {
        canonical.push_str(&format!("{}\n{}\n", scene.scene_id, scene.scene_sha256));
    }
    canonical.push_str(&asset_collection_sha256(&envelope.assets));
    canonical.push('\n');
    sha256(canonical.as_bytes())
}

fn read_primary_migration_candidate(
    root: &Path,
    project_id: &str,
) -> Result<(ReadProjectEnvelope, PathBuf, PathBuf, String), ProjectStoreFailure> {
    validate_project_id(project_id)?;
    let (primary, backup, _) = project_paths(root, project_id)?;
    ensure_not_reparse(&primary, "Primary project envelope")?;
    if backup.exists() {
        ensure_not_reparse(&backup, "Backup project envelope")?;
        return Err(failure(
            "MIGRATION_BACKUP_PRESENT",
            "Dedicated migration persistence requires an absent backup so the exact legacy primary can become the reversible backup without replacing prior recovery state.",
            "after-backup-reconciliation-and-reread",
        ));
    }
    let primary_bytes = fs::read(&primary).map_err(|error| {
        failure(
            "MIGRATION_PRIMARY_REQUIRED",
            format!("Migration persistence requires a readable primary project envelope: {error}"),
            "after-reread",
        )
    })?;
    let read = read_envelope(&primary).map_err(|blocker| {
        if blocker.code == "UNSUPPORTED_PROJECT_SCHEMA" {
            blocker
        } else {
            failure(
                "MIGRATION_PRIMARY_REQUIRED",
                format!("Migration persistence requires a valid supported primary project: {}", blocker.message),
                "after-reread",
            )
        }
    })?;
    if read.envelope.project_id != project_id {
        return Err(failure(
            "PROJECT_ID_MISMATCH",
            "Stored project identity does not match the migration target.",
            "never",
        ));
    }
    if read.source_schema_version == PROJECT_SCHEMA_VERSION {
        return Err(failure(
            "MIGRATION_NOT_REQUIRED",
            "The selected project is already on the current schema.",
            "never",
        ));
    }
    if !matches!(
        read.source_schema_version.as_str(),
        LEGACY_PROJECT_SCHEMA_VERSION | MULTI_SCENE_PROJECT_SCHEMA_VERSION
    ) {
        return Err(failure(
            "UNSUPPORTED_PROJECT_SCHEMA",
            "The selected project does not use an existing supported legacy adapter.",
            "never",
        ));
    }
    let loaded = load_project_at(
        root,
        LoadProjectRequest {
            schema_version: PROJECT_SCHEMA_VERSION.to_string(),
            project_id: project_id.to_string(),
            expected_workspace_generation: None,
        },
    )?;
    if loaded.receipt.recovered_from.is_some()
        || loaded.receipt.persisted_content_sha256 != read.persisted_content_sha256
        || loaded.receipt.migration_status != "migrated-in-memory"
    {
        return Err(failure(
            "MIGRATION_PRIMARY_REQUIRED",
            "Migration persistence could not establish the selected primary as the exact authoritative source.",
            "after-reread",
        ));
    }
    Ok((read, primary, backup, sha256(&primary_bytes)))
}

fn migration_persist_preview_sha256(receipt: &ProjectMigrationPersistPreviewReceipt) -> String {
    let mut canonical = format!(
        "{}\n{}\n{}\n{}\n{}\n{}\n{}\n{}\n{}\n{}\n{}\n{}\n{}\n{}\n{}\n{}\n{}\n{}\n{}\n{}\n",
        receipt.operation,
        receipt.project_id,
        receipt.authoritative_source,
        receipt.source_schema_version,
        receipt.target_schema_version,
        receipt.generation,
        receipt.next_generation,
        receipt.persisted_content_sha256,
        receipt.resulting_content_sha256,
        receipt.active_scene_id,
        receipt.asset_count,
        receipt.asset_collection_sha256,
        receipt.semantic_state_sha256,
        receipt.primary_byte_sha256,
        receipt.protected_state_sha256,
        receipt.asset_tree_sha256,
        receipt.requires_approval,
        receipt.no_write,
        receipt.no_foundry_write,
        receipt.scenes.len(),
    );
    for scene in &receipt.scenes {
        canonical.push_str(&format!("{}\n{}\n", scene.scene_id, scene.scene_sha256));
    }
    for action in &receipt.actions {
        canonical.push_str(action);
        canonical.push('\n');
    }
    sha256(canonical.as_bytes())
}

pub fn preview_project_migration_persist_at(
    root: &Path,
    request: ProjectMigrationPersistPreviewRequest,
) -> Result<ProjectMigrationPersistPreviewReceipt, ProjectStoreFailure> {
    if request.schema_version != PROJECT_SCHEMA_VERSION {
        return Err(failure(
            "UNSUPPORTED_REQUEST_SCHEMA",
            "Migration persistence preview request schema is not supported.",
            "never",
        ));
    }
    let (read, primary, backup, primary_byte_sha256) =
        read_primary_migration_candidate(root, &request.project_id)?;
    let preview = preview_project_migration(&read.source_schema_version);
    if preview.status != "preview-only" || !preview.blockers.is_empty() {
        return Err(failure(
            "UNSUPPORTED_PROJECT_SCHEMA",
            "The selected project does not have a blocker-free supported migration adapter.",
            "never",
        ));
    }
    let mut resulting = read.envelope.clone();
    resulting.generation = resulting.generation.checked_add(1).ok_or_else(|| {
        failure(
            "PROJECT_GENERATION_EXHAUSTED",
            "Project generation cannot advance for migration persistence.",
            "never",
        )
    })?;
    resulting.content_sha256 = content_hash(&resulting);
    let scenes = read
        .envelope
        .scenes
        .iter()
        .map(|scene| ProjectSceneReceipt {
            scene_id: scene.scene_id.clone(),
            scene_sha256: scene.scene_sha256.clone(),
        })
        .collect::<Vec<_>>();
    let mut receipt = ProjectMigrationPersistPreviewReceipt {
        operation: "dicebox.project.migration.persist.preview".to_string(),
        status: "PREVIEW".to_string(),
        project_id: request.project_id,
        authoritative_source: "project.json".to_string(),
        source_schema_version: read.source_schema_version,
        target_schema_version: PROJECT_SCHEMA_VERSION.to_string(),
        generation: read.envelope.generation,
        next_generation: resulting.generation,
        persisted_content_sha256: read.persisted_content_sha256,
        resulting_content_sha256: resulting.content_sha256,
        scenes,
        active_scene_id: read.envelope.active_scene_id.clone(),
        asset_count: read.envelope.assets.len(),
        asset_collection_sha256: asset_collection_sha256(&read.envelope.assets),
        semantic_state_sha256: migration_semantic_state_sha256(&read.envelope),
        actions: preview.actions,
        primary_byte_sha256,
        protected_state_sha256: protected_state_sha256_excluding(
            root,
            &[primary, backup],
        )?,
        asset_tree_sha256: owned_tree_sha256(root, &root.join("assets"))?,
        preview_sha256: String::new(),
        requires_approval: true,
        no_write: true,
        no_foundry_write: true,
    };
    receipt.preview_sha256 = migration_persist_preview_sha256(&receipt);
    Ok(receipt)
}

pub fn persist_project_migration_at(
    root: &Path,
    request: ProjectMigrationPersistRequest,
) -> Result<ProjectMigrationPersistReceipt, ProjectStoreFailure> {
    if request.schema_version != PROJECT_SCHEMA_VERSION {
        return Err(failure(
            "UNSUPPORTED_REQUEST_SCHEMA",
            "Migration persistence request schema is not supported.",
            "never",
        ));
    }
    if !request.approved {
        return Err(failure(
            "MIGRATION_NOT_APPROVED",
            "Migration persistence requires explicit approval.",
            "never",
        ));
    }
    validate_sha256(&request.preview_sha256).map_err(|_| {
        failure(
            "INVALID_MIGRATION_PREVIEW",
            "Migration preview hash must be a lowercase SHA-256 digest.",
            "never",
        )
    })?;
    let _lease = acquire_project_mutation_lease(root)?;
    let preview = preview_project_migration_persist_at(
        root,
        ProjectMigrationPersistPreviewRequest {
            schema_version: request.schema_version.clone(),
            project_id: request.project_id.clone(),
        },
    )?;
    if preview.preview_sha256 != request.preview_sha256
        || preview.source_schema_version != request.source_schema_version
        || preview.generation != request.generation
        || preview.persisted_content_sha256 != request.persisted_content_sha256
        || preview.resulting_content_sha256 != request.resulting_content_sha256
    {
        return Err(failure(
            "STALE_MIGRATION_PREVIEW",
            "Persisted project state no longer matches the approved migration preview.",
            "after-reread",
        ));
    }
    let (read, primary, backup, _) =
        read_primary_migration_candidate(root, &request.project_id)?;
    let legacy_primary_bytes = fs::read(&primary).map_err(|error| {
        failure(
            "MIGRATION_PRIMARY_REQUIRED",
            format!("Legacy primary could not be reread before commit: {error}"),
            "after-reread",
        )
    })?;
    let (workspace_primary, workspace_backup, _) = workspace_index_paths(root);
    let workspace_before = (
        optional_regular_file_sha256(&workspace_primary, "Primary workspace metadata")?,
        optional_regular_file_sha256(&workspace_backup, "Backup workspace metadata")?,
    );
    let mut resulting = read.envelope.clone();
    resulting.generation = preview.next_generation;
    resulting.content_sha256 = preview.resulting_content_sha256.clone();
    let semantic_before = migration_semantic_state_sha256(&read.envelope);
    let mut save = commit_project_envelope(root, resulting, None, false, false)?;
    save.operation = "dicebox.project.migration.persist".to_string();
    let reread = read_envelope(&primary)?;
    let backup_preserves_legacy_primary = fs::read(&backup)
        .map(|bytes| bytes == legacy_primary_bytes)
        .unwrap_or(false);
    let semantic_state_unchanged =
        migration_semantic_state_sha256(&reread.envelope) == semantic_before
            && semantic_before == preview.semantic_state_sha256;
    let asset_tree_unchanged =
        owned_tree_sha256(root, &root.join("assets"))? == preview.asset_tree_sha256;
    let workspace_after = (
        optional_regular_file_sha256(&workspace_primary, "Primary workspace metadata")?,
        optional_regular_file_sha256(&workspace_backup, "Backup workspace metadata")?,
    );
    let workspace_unchanged = workspace_before == workspace_after;
    let foreign_state_unchanged = protected_state_sha256_excluding(
        root,
        &[primary.clone(), backup.clone()],
    )? == preview.protected_state_sha256;
    let authoritative_current_reread = reread.source_schema_version == PROJECT_SCHEMA_VERSION
        && reread.migration_status == "current"
        && reread.envelope.generation == preview.next_generation
        && reread.persisted_content_sha256 == preview.resulting_content_sha256;
    if !backup_preserves_legacy_primary
        || !semantic_state_unchanged
        || !asset_tree_unchanged
        || !workspace_unchanged
        || !foreign_state_unchanged
        || !authoritative_current_reread
    {
        return Err(failure(
            "MIGRATION_REREAD_FAILED",
            "Migration persistence reread did not preserve every approved semantic, backup, workspace, asset, and foreign-state boundary.",
            "after-reread",
        ));
    }
    Ok(ProjectMigrationPersistReceipt {
        operation: save.operation,
        status: "PASS".to_string(),
        project_id: request.project_id,
        source_schema_version: preview.source_schema_version,
        target_schema_version: PROJECT_SCHEMA_VERSION.to_string(),
        previous_generation: preview.generation,
        generation: save.generation,
        previous_content_sha256: preview.persisted_content_sha256,
        content_sha256: save.content_sha256,
        scenes: save.scenes,
        active_scene_id: save.active_scene_id,
        asset_count: save.asset_count,
        semantic_state_unchanged,
        asset_tree_unchanged,
        workspace_unchanged,
        foreign_state_unchanged,
        backup_preserves_legacy_primary,
        authoritative_current_reread,
        preview_sha256: preview.preview_sha256,
        directory_entry_sync: save.directory_entry_sync,
        no_foundry_write: true,
    })
}

fn optional_regular_file_sha256(
    path: &Path,
    label: &str,
) -> Result<Option<String>, ProjectStoreFailure> {
    let metadata = match fs::symlink_metadata(path) {
        Ok(metadata) => metadata,
        Err(error) if error.kind() == std::io::ErrorKind::NotFound => return Ok(None),
        Err(error) => {
            return Err(failure(
                "RECOVERY_STATE_UNAVAILABLE",
                format!("{label} metadata could not be read: {error}"),
                "after-reread",
            ))
        }
    };
    ensure_not_reparse(path, label)?;
    if !metadata.is_file() {
        return Err(failure(
            "RECOVERY_STATE_UNAVAILABLE",
            format!("{label} is not a regular file."),
            "never",
        ));
    }
    let bytes = fs::read(path).map_err(|error| {
        failure(
            "RECOVERY_STATE_UNAVAILABLE",
            format!("{label} could not be read: {error}"),
            "after-reread",
        )
    })?;
    Ok(Some(sha256(&bytes)))
}

fn collect_preserved_tree_entries(
    root: &Path,
    directory: &Path,
    excluded: &[PathBuf],
    entries: &mut Vec<String>,
) -> Result<(), ProjectStoreFailure> {
    ensure_not_reparse(directory, "Recovery proof directory")?;
    let mut children = fs::read_dir(directory)
        .map_err(|error| {
            failure(
                "RECOVERY_STATE_UNAVAILABLE",
                format!("Recovery proof directory could not be listed: {error}"),
                "after-reread",
            )
        })?
        .collect::<Result<Vec<_>, _>>()
        .map_err(|error| {
            failure(
                "RECOVERY_STATE_UNAVAILABLE",
                format!("Recovery proof entry could not be listed: {error}"),
                "after-reread",
            )
        })?;
    children.sort_by_key(|entry| entry.file_name());
    for entry in children {
        let path = entry.path();
        if excluded.iter().any(|candidate| path == *candidate) {
            continue;
        }
        ensure_not_reparse(&path, "Recovery proof entry")?;
        let metadata = fs::symlink_metadata(&path).map_err(|error| {
            failure(
                "RECOVERY_STATE_UNAVAILABLE",
                format!("Recovery proof metadata could not be read: {error}"),
                "after-reread",
            )
        })?;
        let relative = path
            .strip_prefix(root)
            .map_err(|_| {
                failure(
                    "RECOVERY_PATH_ESCAPE",
                    "Recovery proof entry escaped the fixed project-store root.",
                    "never",
                )
            })?
            .to_str()
            .ok_or_else(|| {
                failure(
                    "RECOVERY_STATE_UNAVAILABLE",
                    "Recovery proof paths must be valid UTF-8.",
                    "never",
                )
            })?
            .replace('\\', "/");
        if metadata.is_dir() {
            entries.push(format!("directory\n{relative}\n"));
            collect_preserved_tree_entries(root, &path, excluded, entries)?;
        } else if metadata.is_file() {
            let bytes = fs::read(&path).map_err(|error| {
                failure(
                    "RECOVERY_STATE_UNAVAILABLE",
                    format!("Recovery proof file {relative} could not be read: {error}"),
                    "after-reread",
                )
            })?;
            entries.push(format!(
                "file\n{relative}\n{}\n{}\n",
                bytes.len(),
                sha256(&bytes)
            ));
        } else {
            return Err(failure(
                "RECOVERY_STATE_UNAVAILABLE",
                format!("Recovery proof entry {relative} is neither a file nor directory."),
                "never",
            ));
        }
    }
    Ok(())
}

fn protected_state_sha256(root: &Path, excluded: &Path) -> Result<String, ProjectStoreFailure> {
    protected_state_sha256_excluding(root, &[excluded.to_path_buf()])
}

fn protected_state_sha256_excluding(
    root: &Path,
    excluded: &[PathBuf],
) -> Result<String, ProjectStoreFailure> {
    ensure_not_reparse(root, "Project-store root")?;
    let metadata = fs::symlink_metadata(root).map_err(|error| {
        failure(
            "PROJECT_STORE_UNAVAILABLE",
            format!("Project-store root is unavailable: {error}"),
            "after-reread",
        )
    })?;
    if !metadata.is_dir() {
        return Err(failure(
            "PROJECT_STORE_UNAVAILABLE",
            "Project-store root is not a directory.",
            "never",
        ));
    }
    let mut entries = Vec::new();
    for owned_directory in [root.join("projects"), root.join("assets")] {
        match fs::symlink_metadata(&owned_directory) {
            Ok(metadata) if metadata.is_dir() => {
                collect_preserved_tree_entries(root, &owned_directory, excluded, &mut entries)?;
            }
            Ok(_) => {
                return Err(failure(
                    "RECOVERY_STATE_UNAVAILABLE",
                    "An owned project-store path is not a directory.",
                    "never",
                ));
            }
            Err(error) if error.kind() == std::io::ErrorKind::NotFound => {}
            Err(error) => {
                return Err(failure(
                    "RECOVERY_STATE_UNAVAILABLE",
                    format!("Owned project-store metadata could not be read: {error}"),
                    "after-reread",
                ));
            }
        }
    }
    entries.sort();
    Ok(sha256(entries.concat().as_bytes()))
}

fn owned_tree_sha256(root: &Path, directory: &Path) -> Result<String, ProjectStoreFailure> {
    let mut entries = Vec::new();
    match fs::symlink_metadata(directory) {
        Ok(metadata) if metadata.is_dir() => {
            collect_preserved_tree_entries(root, directory, &[], &mut entries)?;
        }
        Ok(_) => {
            return Err(failure(
                "RECOVERY_STATE_UNAVAILABLE",
                "Owned recovery proof path is not a directory.",
                "never",
            ))
        }
        Err(error) if error.kind() == std::io::ErrorKind::NotFound => {}
        Err(error) => {
            return Err(failure(
                "RECOVERY_STATE_UNAVAILABLE",
                format!("Owned recovery proof metadata could not be read: {error}"),
                "after-reread",
            ))
        }
    }
    entries.sort();
    Ok(sha256(entries.concat().as_bytes()))
}

fn recovery_state_snapshot(
    root: &Path,
    read: &ReadProjectEnvelope,
    excluded_target: &Path,
) -> Result<RecoveryStateSnapshot, ProjectStoreFailure> {
    let (primary, backup, _) = project_paths(root, &read.envelope.project_id)?;
    let (workspace_primary, workspace_backup, _) = workspace_index_paths(root);
    Ok(RecoveryStateSnapshot {
        project_primary_sha256: optional_regular_file_sha256(&primary, "Primary project envelope")?,
        project_backup_sha256: optional_regular_file_sha256(&backup, "Backup project envelope")?,
        workspace_primary_sha256: optional_regular_file_sha256(
            &workspace_primary,
            "Primary workspace metadata",
        )?,
        workspace_backup_sha256: optional_regular_file_sha256(
            &workspace_backup,
            "Backup workspace metadata",
        )?,
        project_generation: read.envelope.generation,
        project_content_sha256: read.persisted_content_sha256.clone(),
        active_scene_id: read.envelope.active_scene_id.clone(),
        scenes: read
            .envelope
            .scenes
            .iter()
            .map(|scene| ProjectSceneReceipt {
                scene_id: scene.scene_id.clone(),
                scene_sha256: scene.scene_sha256.clone(),
            })
            .collect(),
        protected_state_sha256: protected_state_sha256(root, excluded_target)?,
    })
}

fn blocked_inspection_failure(receipt: &ProjectRecoveryInspectionReceipt) -> ProjectStoreFailure {
    failure(
        receipt
            .blocker_code
            .as_deref()
            .unwrap_or("PROJECT_RECOVERY_BLOCKED"),
        receipt
            .blocker_message
            .clone()
            .unwrap_or_else(|| "Project recovery inspection is blocked.".to_string()),
        &receipt.retry,
    )
}

fn restore_preview_sha256(receipt: &MissingAssetRestorePreviewReceipt) -> String {
    let mut canonical = format!(
        "{}\n{}\n{}\n{}\n{}\n{}\n{}\n{}\n{}\n{}\n{}\n{}\n{}\n{}\n{}\n{}\n{}\n{}\n{}\n",
        receipt.operation,
        receipt.project_id,
        receipt.generation,
        receipt.content_sha256,
        receipt.migration_status,
        receipt.recovered_from.as_deref().unwrap_or("none"),
        receipt.asset_id,
        receipt.asset_sha256,
        receipt.media_type,
        receipt.byte_length,
        receipt.registration.asset_id,
        receipt.registration.role,
        receipt.registration.label,
        receipt.registration.provenance,
        receipt.registration.approval,
        receipt.target_relative_path,
        receipt.candidate_sha256,
        receipt.candidate_byte_length,
        receipt.protected_state_sha256,
    );
    for scene_id in &receipt.affected_scene_ids {
        canonical.push_str(scene_id);
        canonical.push('\n');
    }
    sha256(canonical.as_bytes())
}

pub fn preview_missing_asset_restore_at(
    root: &Path,
    request: MissingAssetRestorePreviewRequest,
) -> Result<MissingAssetRestorePreviewReceipt, ProjectStoreFailure> {
    if request.schema_version != PROJECT_SCHEMA_VERSION {
        return Err(failure(
            "UNSUPPORTED_REQUEST_SCHEMA",
            "Missing-asset restore preview request schema is not supported.",
            "never",
        ));
    }
    let context = inspect_project_recovery_context(
        root,
        ProjectRecoveryInspectionRequest {
            schema_version: request.schema_version.clone(),
            project_id: request.project_id.clone(),
        },
    )?;
    let read = context
        .read
        .as_ref()
        .ok_or_else(|| blocked_inspection_failure(&context.receipt))?;
    if read.source_schema_version != PROJECT_SCHEMA_VERSION || read.migration_status != "current" {
        return Err(failure(
            "ASSET_RESTORE_MIGRATION_BLOCKED",
            "Missing-asset restoration does not promote or write migrated project schemas.",
            "never",
        ));
    }
    let inspected = context
        .receipt
        .registered_assets
        .iter()
        .find(|asset| asset.asset_id == request.asset_id)
        .ok_or_else(|| {
            failure(
                "REGISTERED_ASSET_NOT_FOUND",
                "Requested registered background asset does not exist in this project.",
                "never",
            )
        })?;
    if inspected.disposition != "MISSING" || !inspected.restore_eligible {
        return Err(failure(
            if inspected.disposition == "PRESENT_VALID"
                || inspected.disposition == "TAMPERED"
                || inspected.disposition == "EXISTING_BLOCKED"
            {
                "ASSET_RESTORE_TARGET_EXISTS"
            } else {
                "ASSET_RESTORE_NOT_ELIGIBLE"
            },
            "Only an absent, referenced, already-registered current-schema background blob is eligible for this operation.",
            "never",
        ));
    }
    let blockers = context
        .receipt
        .registered_assets
        .iter()
        .filter(|asset| asset.blocker_code.is_some())
        .collect::<Vec<_>>();
    if blockers
        .iter()
        .any(|blocker| blocker.disposition != "MISSING" || !blocker.restore_eligible)
    {
        return Err(failure(
            "ASSET_RESTORE_NOT_ELIGIBLE",
            "The bounded restore requires every current project blocker to be an independently eligible missing registered background blob.",
            "never",
        ));
    }
    let stored = read
        .envelope
        .assets
        .iter()
        .find(|asset| {
            asset
                .registration
                .as_ref()
                .is_some_and(|registration| registration.asset_id == request.asset_id)
        })
        .ok_or_else(|| {
            failure(
                "REGISTERED_ASSET_NOT_FOUND",
                "Requested registered background asset could not be reread.",
                "after-reread",
            )
        })?;
    let registration = stored.registration.clone().ok_or_else(|| {
        failure(
            "REGISTERED_ASSET_NOT_FOUND",
            "Requested background asset is not registered.",
            "never",
        )
    })?;
    if request.media_type != stored.media_type {
        return Err(failure(
            "ASSET_RESTORE_MIME_MISMATCH",
            "Candidate MIME type does not match the persisted registration.",
            "never",
        ));
    }
    if request.bytes.len() != stored.byte_length {
        return Err(failure(
            "ASSET_RESTORE_LENGTH_MISMATCH",
            "Candidate byte length does not match the persisted registration.",
            "never",
        ));
    }
    validate_registered_media(&request.media_type, &request.bytes)?;
    let candidate_sha256 = sha256(&request.bytes);
    if candidate_sha256 != stored.sha256 {
        return Err(failure(
            "ASSET_RESTORE_HASH_MISMATCH",
            "Candidate bytes do not match the persisted content-addressed digest.",
            "never",
        ));
    }
    let target = registered_asset_target(root, stored)?;
    if fs::symlink_metadata(&target).is_ok() {
        return Err(failure(
            "ASSET_RESTORE_TARGET_EXISTS",
            "Canonical content-addressed target already exists and will not be overwritten.",
            "never",
        ));
    }
    let snapshot = recovery_state_snapshot(root, read, &target)?;
    let mut receipt = MissingAssetRestorePreviewReceipt {
        operation: "dicebox.project.asset.restore.preview".to_string(),
        status: "PREVIEW".to_string(),
        project_id: request.project_id,
        generation: read.envelope.generation,
        content_sha256: read.persisted_content_sha256.clone(),
        migration_status: read.migration_status.clone(),
        recovered_from: context.receipt.recovered_from,
        asset_id: registration.asset_id.clone(),
        asset_sha256: stored.sha256.clone(),
        media_type: stored.media_type.clone(),
        byte_length: stored.byte_length,
        registration,
        target_relative_path: stored.relative_path.clone(),
        affected_scene_ids: inspected.affected_scene_ids.clone(),
        candidate_sha256,
        candidate_byte_length: request.bytes.len(),
        protected_state_sha256: snapshot.protected_state_sha256,
        preview_sha256: String::new(),
        requires_approval: true,
        no_write: true,
        no_foundry_write: true,
    };
    receipt.preview_sha256 = restore_preview_sha256(&receipt);
    Ok(receipt)
}

pub fn restore_missing_asset_at(
    root: &Path,
    request: MissingAssetRestoreRequest,
) -> Result<MissingAssetRestoreReceipt, ProjectStoreFailure> {
    if request.schema_version != PROJECT_SCHEMA_VERSION {
        return Err(failure(
            "UNSUPPORTED_REQUEST_SCHEMA",
            "Missing-asset restore request schema is not supported.",
            "never",
        ));
    }
    validate_sha256(&request.preview_sha256).map_err(|_| {
        failure(
            "INVALID_RESTORE_PREVIEW",
            "Restore preview hash must be a lowercase SHA-256 digest.",
            "never",
        )
    })?;
    if !request.approved {
        return Err(failure(
            "ASSET_RESTORE_NOT_APPROVED",
            "Missing-asset restoration requires explicit approval of the exact preview.",
            "never",
        ));
    }
    let _lease = acquire_project_mutation_lease(root)?;
    let preview = preview_missing_asset_restore_at(
        root,
        MissingAssetRestorePreviewRequest {
            schema_version: request.schema_version.clone(),
            project_id: request.project_id.clone(),
            asset_id: request.asset_id.clone(),
            media_type: request.media_type.clone(),
            bytes: request.bytes.clone(),
        },
    )?;
    if preview.preview_sha256 != request.preview_sha256 {
        return Err(failure(
            "STALE_ASSET_RESTORE_PREVIEW",
            "Project, registration, Scene references, candidate bytes, or protected state changed after preview.",
            "after-reread",
        ));
    }
    let before_context = inspect_project_recovery_context(
        root,
        ProjectRecoveryInspectionRequest {
            schema_version: request.schema_version.clone(),
            project_id: request.project_id.clone(),
        },
    )?;
    let before_read = before_context
        .read
        .as_ref()
        .ok_or_else(|| blocked_inspection_failure(&before_context.receipt))?;
    let before_asset = before_read
        .envelope
        .assets
        .iter()
        .find(|asset| {
            asset
                .registration
                .as_ref()
                .is_some_and(|registration| registration.asset_id == request.asset_id)
        })
        .cloned()
        .ok_or_else(|| {
            failure(
                "REGISTERED_ASSET_NOT_FOUND",
                "Approved registered background asset could not be reread.",
                "after-reread",
            )
    })?;
    let target = registered_asset_target(root, &before_asset)?;
    let asset_dir = root.join("assets").join("sha256");
    ensure_not_reparse(&asset_dir, "Content-addressed asset directory")?;
    let before = recovery_state_snapshot(root, before_read, &target)?;
    if before.protected_state_sha256 != preview.protected_state_sha256
        || before.project_generation != preview.generation
        || before.project_content_sha256 != preview.content_sha256
    {
        return Err(failure(
            "STALE_ASSET_RESTORE_PREVIEW",
            "Protected project-store state changed after preview.",
            "after-reread",
        ));
    }
    match fs::symlink_metadata(&target) {
        Err(error) if error.kind() == std::io::ErrorKind::NotFound => {}
        Ok(_) => {
            return Err(failure(
                "ASSET_RESTORE_TARGET_EXISTS",
                "Canonical content-addressed target exists and will not be overwritten.",
                "never",
            ))
        }
        Err(error) => {
            return Err(failure(
                "ASSET_STORE_UNAVAILABLE",
                format!("Canonical restore target metadata is unavailable: {error}"),
                "after-reread",
            ))
        }
    }
    let mut target_file = OpenOptions::new()
        .write(true)
        .create_new(true)
        .open(&target)
        .map_err(|error| {
            if error.kind() == std::io::ErrorKind::AlreadyExists {
                failure(
                    "ASSET_RESTORE_TARGET_EXISTS",
                    "Canonical content-addressed target appeared before execution and will not be overwritten.",
                    "never",
                )
            } else {
                failure(
                    "ASSET_RESTORE_WRITE_BLOCKED",
                    format!("Canonical missing-asset target could not be created: {error}"),
                    "after-reread",
                )
            }
        })?;
    target_file
        .write_all(&request.bytes)
        .and_then(|_| target_file.sync_all())
        .map_err(|error| {
            failure(
                "ASSET_RESTORE_WRITE_UNKNOWN",
                format!("Missing-asset restore write outcome is unknown: {error}"),
                "after-reread",
            )
        })?;
    drop(target_file);
    sync_directory_entries(
        &asset_dir,
        "ASSET_DIRECTORY_SYNC_UNKNOWN",
        "Content-addressed asset directory",
    )?;

    let authoritative_bytes = fs::read(&target).map_err(|error| {
        failure(
            "ASSET_RESTORE_REREAD_UNKNOWN",
            format!("Restored asset could not be authoritatively reread: {error}"),
            "after-reread",
        )
    })?;
    if authoritative_bytes.len() != before_asset.byte_length
        || sha256(&authoritative_bytes) != before_asset.sha256
    {
        return Err(failure(
            "ASSET_RESTORE_REREAD_UNKNOWN",
            "Restored asset failed authoritative length or digest reread.",
            "after-reread",
        ));
    }
    validate_registered_media(&before_asset.media_type, &authoritative_bytes).map_err(
        |blocker| {
            failure(
                "ASSET_RESTORE_REREAD_UNKNOWN",
                blocker.message,
                "after-reread",
            )
        },
    )?;
    let after_context = inspect_project_recovery_context(
        root,
        ProjectRecoveryInspectionRequest {
            schema_version: PROJECT_SCHEMA_VERSION.to_string(),
            project_id: request.project_id.clone(),
        },
    )
    .map_err(|blocker| {
        failure(
            "ASSET_RESTORE_REREAD_UNKNOWN",
            format!(
                "Recovery inspection reread failed with {}: {}",
                blocker.code, blocker.message
            ),
            "after-reread",
        )
    })?;
    let after_read = after_context.read.as_ref().ok_or_else(|| {
        let blocker = blocked_inspection_failure(&after_context.receipt);
        failure(
            "ASSET_RESTORE_REREAD_UNKNOWN",
            format!(
                "Recovery inspection reread remained blocked with {}: {}",
                blocker.code, blocker.message
            ),
            "after-reread",
        )
    })?;
    let selected_present = after_context
        .receipt
        .registered_assets
        .iter()
        .any(|asset| {
            asset.asset_id == request.asset_id
                && asset.disposition == "PRESENT_VALID"
                && asset.sha256 == before_asset.sha256
        });
    let unresolved_blocker = after_context
        .receipt
        .registered_assets
        .iter()
        .any(|asset| {
            asset.blocker_code.is_some()
                && (asset.disposition != "MISSING" || !asset.restore_eligible)
        })
        || after_context
            .receipt
            .pending_artifacts
            .iter()
            .any(|artifact| artifact.blocker_code.is_some());
    if (!selected_present || unresolved_blocker)
        || (after_context.receipt.status != "PASS"
            && after_context.receipt.status != "BLOCKED")
    {
        return Err(failure(
            "ASSET_RESTORE_REREAD_UNKNOWN",
            "Selected asset restoration did not produce an authoritative selected-only reread.",
            "after-reread",
        ));
    }
    let after = recovery_state_snapshot(root, after_read, &target).map_err(|blocker| {
        failure(
            "ASSET_RESTORE_REREAD_UNKNOWN",
            format!(
                "Protected-state reread failed with {}: {}",
                blocker.code, blocker.message
            ),
            "after-reread",
        )
    })?;
    let envelope_unchanged = before.project_primary_sha256 == after.project_primary_sha256;
    let project_state_unchanged = before.project_generation == after.project_generation
        && before.project_content_sha256 == after.project_content_sha256
        && before.active_scene_id == after.active_scene_id
        && after_read.envelope.assets == before_read.envelope.assets;
    let scenes_unchanged = before.scenes == after.scenes;
    let workspace_unchanged = before.workspace_primary_sha256 == after.workspace_primary_sha256;
    let backups_unchanged = before.project_backup_sha256 == after.project_backup_sha256
        && before.workspace_backup_sha256 == after.workspace_backup_sha256;
    let foreign_state_unchanged = before.protected_state_sha256 == after.protected_state_sha256;
    if !envelope_unchanged
        || !project_state_unchanged
        || !scenes_unchanged
        || !workspace_unchanged
        || !backups_unchanged
        || !foreign_state_unchanged
    {
        return Err(failure(
            "ASSET_RESTORE_OUTCOME_UNKNOWN",
            "A protected project-store state proof changed during restoration; authoritative reread is required.",
            "after-reread",
        ));
    }
    Ok(MissingAssetRestoreReceipt {
        operation: "dicebox.project.asset.restore".to_string(),
        status: "PASS".to_string(),
        project_id: request.project_id,
        generation: before.project_generation,
        content_sha256: before.project_content_sha256,
        asset_id: before_asset
            .registration
            .as_ref()
            .map(|registration| registration.asset_id.clone())
            .ok_or_else(|| {
                failure(
                    "REGISTERED_ASSET_NOT_FOUND",
                    "Restored asset registration disappeared during reread.",
                    "after-reread",
                )
            })?,
        asset_sha256: before_asset.sha256.clone(),
        media_type: before_asset.media_type.clone(),
        byte_length: before_asset.byte_length,
        target_relative_path: before_asset.relative_path,
        affected_scene_ids: preview.affected_scene_ids,
        preview_sha256: preview.preview_sha256,
        authoritative_asset_sha256: sha256(&authoritative_bytes),
        authoritative_project_content_sha256: after_read.persisted_content_sha256.clone(),
        envelope_unchanged,
        project_state_unchanged,
        scenes_unchanged,
        workspace_unchanged,
        backups_unchanged,
        foreign_state_unchanged,
        create_new_only: true,
        directory_entry_sync: true,
        no_project_write: true,
        no_foundry_write: true,
    })
}

fn catalog_blocked(project_id: String, blocker_code: String) -> ProjectCatalogEntry {
    let display_name = default_display_name(&project_id).unwrap_or_else(|_| project_id.clone());
    ProjectCatalogEntry {
        project_id,
        status: "BLOCKED".to_string(),
        scene_id: None,
        scene_name: None,
        scene_count: None,
        active_scene_id: None,
        generation: None,
        content_sha256: None,
        asset_count: None,
        recovered_from: None,
        blocker_code: Some(blocker_code),
        display_name,
        last_opened_sequence: 0,
        workspace_metadata_warning: None,
    }
}

fn detach_preview_sha256(receipt: &MissingAssetDetachPreviewReceipt) -> String {
    let mut canonical = format!(
        "{}\n{}\n{}\n{}\n{}\n{}\n{}\n{}\n{}\n{}\n{}\n{}\n{}\n{}\n{}\n{}\n{}\n{}\n{}\n{}\n{}\n{}\n{}\n",
        receipt.operation,
        receipt.project_id,
        receipt.generation,
        receipt.content_sha256,
        receipt.migration_status,
        receipt.asset_id,
        receipt.asset_sha256,
        receipt.media_type,
        receipt.byte_length,
        receipt.registration.asset_id,
        receipt.registration.role,
        receipt.registration.label,
        receipt.registration.provenance,
        receipt.registration.approval,
        receipt.target_relative_path,
        receipt.resulting_asset_count,
        receipt.resulting_asset_collection_sha256,
        receipt.next_generation,
        receipt.resulting_content_sha256,
        receipt.primary_byte_sha256,
        receipt.protected_state_sha256,
        receipt.asset_tree_sha256,
        receipt.requires_approval,
    );
    for scene in &receipt.affected_scenes {
        canonical.push_str(&format!(
            "affected\n{}\n{}\n",
            scene.scene_id, scene.scene_sha256
        ));
    }
    for scene in &receipt.resulting_scenes {
        canonical.push_str(&format!(
            "result\n{}\n{}\n",
            scene.scene_id, scene.scene_sha256
        ));
    }
    sha256(canonical.as_bytes())
}

fn detached_project_envelope(
    read: &ReadProjectEnvelope,
    asset_id: &str,
) -> Result<(ProjectEnvelope, Vec<ProjectSceneReceipt>), ProjectStoreFailure> {
    let mut affected = Vec::new();
    let mut scenes = Vec::with_capacity(read.envelope.scenes.len());
    for scene in &read.envelope.scenes {
        let bound = scene_background_asset_id(&scene.scene_json)?.as_deref() == Some(asset_id);
        if bound {
            affected.push(ProjectSceneReceipt {
                scene_id: scene.scene_id.clone(),
                scene_sha256: scene.scene_sha256.clone(),
            });
        }
        let scene_json = if bound {
            detach_scene_background_asset(&scene.scene_json, asset_id)?
        } else {
            scene.scene_json.clone()
        };
        scenes.push(ProjectSceneEnvelope {
            scene_id: scene_id(&scene_json)?,
            scene_sha256: sha256(scene_json.as_bytes()),
            scene_json,
        });
    }
    if affected.is_empty() {
        return Err(failure(
            "ASSET_DETACH_NOT_ELIGIBLE",
            "The selected missing registered background is not bound to any Scene.",
            "never",
        ));
    }
    let still_referenced = scenes.iter().any(|scene| {
        scene_background_asset_id(&scene.scene_json)
            .ok()
            .flatten()
            .as_deref()
            == Some(asset_id)
    });
    let assets = read
        .envelope
        .assets
        .iter()
        .filter(|asset| {
            still_referenced
                || !asset
                    .registration
                    .as_ref()
                    .is_some_and(|registration| registration.asset_id == asset_id)
        })
        .cloned()
        .collect::<Vec<_>>();
    let generation = read.envelope.generation.checked_add(1).ok_or_else(|| {
        failure(
            "PROJECT_GENERATION_EXHAUSTED",
            "Project generation cannot advance for detach recovery.",
            "never",
        )
    })?;
    let mut envelope = ProjectEnvelope {
        schema_version: PROJECT_SCHEMA_VERSION.to_string(),
        project_id: read.envelope.project_id.clone(),
        generation,
        scenes,
        active_scene_id: read.envelope.active_scene_id.clone(),
        assets,
        content_sha256: String::new(),
    };
    envelope.content_sha256 = content_hash(&envelope);
    Ok((validate_envelope(envelope)?, affected))
}

fn preview_missing_asset_detach_from_context(
    root: &Path,
    request: MissingAssetDetachPreviewRequest,
) -> Result<MissingAssetDetachPreviewReceipt, ProjectStoreFailure> {
    if request.schema_version != PROJECT_SCHEMA_VERSION {
        return Err(failure(
            "UNSUPPORTED_REQUEST_SCHEMA",
            "Missing-asset detach preview request schema is not supported.",
            "never",
        ));
    }
    let context = inspect_project_recovery_context(
        root,
        ProjectRecoveryInspectionRequest {
            schema_version: request.schema_version,
            project_id: request.project_id.clone(),
        },
    )?;
    if context.receipt.primary.status != "VALID" || context.receipt.recovered_from.is_some() {
        return Err(failure(
            "ASSET_DETACH_PRIMARY_REQUIRED",
            "Detach recovery requires the current authoritative project.json; backup-authoritative state is blocked.",
            "after-reread",
        ));
    }
    if !matches!(context.receipt.backup.status.as_str(), "VALID" | "MISSING") {
        return Err(failure(
            "ASSET_DETACH_ADDITIONAL_BLOCKER",
            "Detach recovery will not replace an additionally blocked project backup.",
            "after-reread",
        ));
    }
    let read = context
        .read
        .as_ref()
        .ok_or_else(|| blocked_inspection_failure(&context.receipt))?;
    if read.source_schema_version != PROJECT_SCHEMA_VERSION || read.migration_status != "current" {
        return Err(failure(
            "ASSET_DETACH_MIGRATION_BLOCKED",
            "Detach recovery does not write migrated project schemas.",
            "never",
        ));
    }
    let inspected = context
        .receipt
        .registered_assets
        .iter()
        .find(|asset| asset.asset_id == request.asset_id)
        .ok_or_else(|| {
            failure(
                "REGISTERED_ASSET_NOT_FOUND",
                "Requested registered background asset does not exist in this project.",
                "never",
            )
        })?;
    let blockers = context
        .receipt
        .registered_assets
        .iter()
        .filter(|asset| asset.blocker_code.is_some())
        .collect::<Vec<_>>();
    if inspected.disposition != "MISSING"
        || !inspected.restore_eligible
        || blockers.len() != 1
        || blockers[0].asset_id != request.asset_id
    {
        return Err(failure(
            if inspected.disposition == "PRESENT_VALID"
                || inspected.disposition == "TAMPERED"
                || inspected.disposition == "EXISTING_BLOCKED"
            {
                "ASSET_DETACH_TARGET_PRESENT"
            } else {
                "ASSET_DETACH_NOT_ELIGIBLE"
            },
            "Detach recovery requires exactly one project blocker: the selected absent, referenced, registered background blob.",
            "after-reread",
        ));
    }
    let stored = read
        .envelope
        .assets
        .iter()
        .find(|asset| {
            asset
                .registration
                .as_ref()
                .is_some_and(|registration| registration.asset_id == request.asset_id)
        })
        .cloned()
        .ok_or_else(|| {
            failure(
                "REGISTERED_ASSET_NOT_FOUND",
                "Requested registered background asset could not be reread.",
                "after-reread",
            )
        })?;
    let registration = stored.registration.clone().ok_or_else(|| {
        failure(
            "REGISTERED_ASSET_NOT_FOUND",
            "Requested background asset is not registered.",
            "never",
        )
    })?;
    let target = registered_asset_target(root, &stored)?;
    match fs::symlink_metadata(&target) {
        Err(error) if error.kind() == std::io::ErrorKind::NotFound => {}
        Ok(_) => {
            return Err(failure(
                "ASSET_DETACH_TARGET_PRESENT",
                "Canonical registered-asset target exists; detach recovery is blocked.",
                "never",
            ))
        }
        Err(error) => {
            return Err(failure(
                "ASSET_STORE_UNAVAILABLE",
                format!("Canonical detach target metadata is unavailable: {error}"),
                "after-reread",
            ))
        }
    }
    let (resulting, affected_scenes) = detached_project_envelope(read, &request.asset_id)?;
    let resulting_scenes = resulting
        .scenes
        .iter()
        .map(|scene| ProjectSceneReceipt {
            scene_id: scene.scene_id.clone(),
            scene_sha256: scene.scene_sha256.clone(),
        })
        .collect::<Vec<_>>();
    let (primary, backup, _) = project_paths(root, &request.project_id)?;
    let primary_byte_sha256 = optional_regular_file_sha256(&primary, "Primary project envelope")?
        .ok_or_else(|| {
        failure(
            "ASSET_DETACH_PRIMARY_REQUIRED",
            "Authoritative project.json disappeared during detach preview.",
            "after-reread",
        )
    })?;
    let protected_state_sha256 = protected_state_sha256_excluding(root, &[primary, backup])?;
    let asset_tree_sha256 = owned_tree_sha256(root, &root.join("assets"))?;
    let mut receipt = MissingAssetDetachPreviewReceipt {
        operation: "dicebox.project.asset.detach.preview".to_string(),
        status: "PREVIEW".to_string(),
        project_id: request.project_id,
        generation: read.envelope.generation,
        content_sha256: read.persisted_content_sha256.clone(),
        migration_status: read.migration_status.clone(),
        asset_id: registration.asset_id.clone(),
        asset_sha256: stored.sha256,
        media_type: stored.media_type,
        byte_length: stored.byte_length,
        registration,
        target_relative_path: stored.relative_path,
        affected_scenes,
        resulting_scenes,
        resulting_asset_count: resulting.assets.len(),
        resulting_asset_collection_sha256: asset_collection_sha256(&resulting.assets),
        next_generation: resulting.generation,
        resulting_content_sha256: resulting.content_sha256,
        primary_byte_sha256,
        protected_state_sha256,
        asset_tree_sha256,
        preview_sha256: String::new(),
        requires_approval: true,
        no_write: true,
        no_foundry_write: true,
    };
    receipt.preview_sha256 = detach_preview_sha256(&receipt);
    Ok(receipt)
}

pub fn preview_missing_asset_detach_at(
    root: &Path,
    request: MissingAssetDetachPreviewRequest,
) -> Result<MissingAssetDetachPreviewReceipt, ProjectStoreFailure> {
    preview_missing_asset_detach_from_context(root, request)
}

pub fn detach_missing_asset_at(
    root: &Path,
    request: MissingAssetDetachRequest,
) -> Result<MissingAssetDetachReceipt, ProjectStoreFailure> {
    if request.schema_version != PROJECT_SCHEMA_VERSION {
        return Err(failure(
            "UNSUPPORTED_REQUEST_SCHEMA",
            "Missing-asset detach request schema is not supported.",
            "never",
        ));
    }
    validate_sha256(&request.preview_sha256).map_err(|_| {
        failure(
            "INVALID_DETACH_PREVIEW",
            "Detach preview hash must be a lowercase SHA-256 digest.",
            "never",
        )
    })?;
    if !request.approved {
        return Err(failure(
            "ASSET_DETACH_NOT_APPROVED",
            "Missing-asset detach requires explicit approval of the exact preview.",
            "never",
        ));
    }
    let _lease = acquire_project_mutation_lease(root)?;
    let preview = preview_missing_asset_detach_from_context(
        root,
        MissingAssetDetachPreviewRequest {
            schema_version: request.schema_version.clone(),
            project_id: request.project_id.clone(),
            asset_id: request.asset_id.clone(),
        },
    )?;
    if preview.preview_sha256 != request.preview_sha256 {
        return Err(failure(
            "STALE_ASSET_DETACH_PREVIEW",
            "Project generation, descriptor, Scene bindings, target state, or preserved state changed after preview.",
            "after-reread",
        ));
    }
    let context = inspect_project_recovery_context(
        root,
        ProjectRecoveryInspectionRequest {
            schema_version: request.schema_version,
            project_id: request.project_id.clone(),
        },
    )?;
    let read = context
        .read
        .as_ref()
        .ok_or_else(|| blocked_inspection_failure(&context.receipt))?;
    let (resulting, affected_scenes) = detached_project_envelope(read, &request.asset_id)?;
    if resulting.generation != preview.next_generation
        || resulting.content_sha256 != preview.resulting_content_sha256
        || asset_collection_sha256(&resulting.assets) != preview.resulting_asset_collection_sha256
    {
        return Err(failure(
            "STALE_ASSET_DETACH_PREVIEW",
            "The deterministic detach result changed after preview.",
            "after-reread",
        ));
    }
    let (primary, backup, _) = project_paths(root, &request.project_id)?;
    let (workspace_primary, workspace_backup, _) = workspace_index_paths(root);
    let workspace_primary_before =
        optional_regular_file_sha256(&workspace_primary, "Primary workspace metadata")?;
    let workspace_backup_before =
        optional_regular_file_sha256(&workspace_backup, "Backup workspace metadata")?;
    let save = commit_project_envelope(root, resulting.clone(), None, false, false)?;
    let loaded = load_project_at(
        root,
        LoadProjectRequest {
            schema_version: PROJECT_SCHEMA_VERSION.to_string(),
            project_id: request.project_id.clone(),
            expected_workspace_generation: None,
        },
    )
    .map_err(|blocker| {
        failure(
            "ASSET_DETACH_REREAD_UNKNOWN",
            format!(
                "Detached project authoritative reload failed with {}: {}",
                blocker.code, blocker.message
            ),
            "after-reread",
        )
    })?;
    let target = root.join(&preview.target_relative_path);
    let target_remains_absent = match fs::symlink_metadata(&target) {
        Err(error) if error.kind() == std::io::ErrorKind::NotFound => true,
        _ => false,
    };
    let asset_tree_unchanged =
        owned_tree_sha256(root, &root.join("assets"))? == preview.asset_tree_sha256;
    let workspace_unchanged =
        optional_regular_file_sha256(&workspace_primary, "Primary workspace metadata")?
            == workspace_primary_before
            && optional_regular_file_sha256(&workspace_backup, "Backup workspace metadata")?
                == workspace_backup_before;
    let foreign_state_unchanged =
        protected_state_sha256_excluding(root, &[primary.clone(), backup.clone()])?
            == preview.protected_state_sha256;
    let backup_preserves_prior_envelope =
        optional_regular_file_sha256(&backup, "Backup project envelope")?.as_deref()
            == Some(preview.primary_byte_sha256.as_str());
    let descriptor_removed = !loaded.assets.iter().any(|asset| {
        asset
            .registration
            .as_ref()
            .is_some_and(|registration| registration.asset_id == request.asset_id)
    });
    let authoritative_reload = loaded.receipt.generation == resulting.generation
        && loaded.receipt.content_sha256 == resulting.content_sha256
        && loaded.receipt.scenes == save.scenes
        && loaded.assets == resulting.assets
        && loaded.scenes_json.iter().all(|scene| {
            scene_background_asset_id(scene).ok().flatten().as_deref()
                != Some(request.asset_id.as_str())
        });
    if !target_remains_absent
        || !asset_tree_unchanged
        || !workspace_unchanged
        || !foreign_state_unchanged
        || !backup_preserves_prior_envelope
        || !descriptor_removed
        || !authoritative_reload
    {
        return Err(failure(
            "ASSET_DETACH_OUTCOME_UNKNOWN",
            "Detached project or a protected state proof failed authoritative reread.",
            "after-reread",
        ));
    }
    Ok(MissingAssetDetachReceipt {
        operation: "dicebox.project.asset.detach".to_string(),
        status: "PASS".to_string(),
        project_id: request.project_id,
        previous_generation: preview.generation,
        generation: save.generation,
        previous_content_sha256: preview.content_sha256,
        content_sha256: save.content_sha256,
        asset_id: preview.asset_id,
        asset_sha256: preview.asset_sha256,
        target_relative_path: preview.target_relative_path,
        affected_scenes,
        scenes: save.scenes,
        descriptor_removed,
        asset_tree_unchanged,
        workspace_unchanged,
        foreign_state_unchanged,
        backup_preserves_prior_envelope,
        target_remains_absent,
        authoritative_reload,
        preview_sha256: preview.preview_sha256,
        directory_entry_sync: save.directory_entry_sync,
        no_foundry_write: true,
    })
}

fn read_broken_reference_primary(
    root: &Path,
    request: &BrokenReferenceDetachPreviewRequest,
) -> Result<(ProjectEnvelope, String, PathBuf, PathBuf), ProjectStoreFailure> {
    validate_project_id(&request.project_id)?;
    let (primary, backup, _) = project_paths(root, &request.project_id)?;
    let primary_relative = format!("projects/{}/project.json", validate_project_id(&request.project_id)?);
    let backup_probe = probe_project_file(&backup, &format!("projects/{}/project.backup.json", validate_project_id(&request.project_id)?));
    if !matches!(backup_probe.disposition.status.as_str(), "VALID" | "MISSING") {
        return Err(failure(
            "BROKEN_REFERENCE_ADDITIONAL_BLOCKER",
            "Broken-reference repair will not replace an additionally blocked project backup.",
            "after-reread",
        ));
    }
    let primary_probe = probe_project_file(&primary, &primary_relative);
    if primary_probe.disposition.status != "BLOCKED" {
        return Err(failure(
            "BROKEN_REFERENCE_PRIMARY_REQUIRED",
            "Broken-reference repair requires the current primary project envelope to be the diagnosed source.",
            "after-reread",
        ));
    }
    let broken = inspect_broken_scene_asset_references(&primary, &primary_relative, &request.project_id);
    let diagnosis = broken.iter().find(|reference| {
        reference.scene_id == request.scene_id
            && reference.asset_id == request.asset_id
            && reference.blocker_code == request.blocker_code
    });
    if diagnosis.is_none() {
        return Err(failure(
            "STALE_BROKEN_REFERENCE_DIAGNOSIS",
            "The selected broken-reference diagnosis is no longer current; inspect again before previewing repair.",
            "after-reread",
        ));
    }
    let bytes = fs::read(&primary).map_err(|error| {
        failure(
            "BROKEN_REFERENCE_PRIMARY_REQUIRED",
            format!("Diagnosed primary project could not be read: {error}"),
            "after-reread",
        )
    })?;
    let value: Value = serde_json::from_slice(&bytes).map_err(|_| {
        failure(
            "BROKEN_REFERENCE_PRIMARY_REQUIRED",
            "Diagnosed primary project is not valid JSON.",
            "after-reread",
        )
    })?;
    let envelope: ProjectEnvelope = serde_json::from_value(value).map_err(|_| {
        failure(
            "BROKEN_REFERENCE_PRIMARY_REQUIRED",
            "Diagnosed primary project envelope is not structurally readable.",
            "after-reread",
        )
    })?;
    if envelope.schema_version != PROJECT_SCHEMA_VERSION || envelope.project_id != request.project_id {
        return Err(failure(
            "BROKEN_REFERENCE_PRIMARY_REQUIRED",
            "Broken-reference repair requires a current project envelope with matching identity.",
            "never",
        ));
    }
    validate_project_id(&envelope.project_id)?;
    for scene in &envelope.scenes {
        let canonical = validate_scene_json(&scene.scene_json)?;
        if canonical != scene.scene_json || sha256(canonical.as_bytes()) != scene.scene_sha256 {
            return Err(failure(
                "BROKEN_REFERENCE_PRIMARY_REQUIRED",
                "Broken-reference repair requires canonical Scene hashes even when a binding is broken.",
                "after-reread",
            ));
        }
    }
    validate_assets(&envelope.assets)?;
    if content_hash(&envelope) != envelope.content_sha256 {
        return Err(failure(
            "BROKEN_REFERENCE_PRIMARY_REQUIRED",
            "Broken-reference repair requires a content-hash-consistent primary envelope.",
            "after-reread",
        ));
    }
    Ok((envelope, sha256(&bytes), primary, backup))
}

fn detach_broken_reference_envelope(
    source: &ProjectEnvelope,
    scene_id_value: &str,
    asset_id: &str,
) -> Result<(ProjectEnvelope, ProjectSceneReceipt), ProjectStoreFailure> {
    let mut resulting = source.clone();
    let mut changed: Option<ProjectSceneReceipt> = None;
    for scene in &mut resulting.scenes {
        if scene.scene_id != scene_id_value {
            continue;
        }
        if scene_background_asset_id(&scene.scene_json)?.as_deref() != Some(asset_id) {
            return Err(failure(
                "STALE_BROKEN_REFERENCE_DIAGNOSIS",
                "The selected Scene no longer carries the diagnosed asset reference.",
                "after-reread",
            ));
        }
        let previous = ProjectSceneReceipt {
            scene_id: scene.scene_id.clone(),
            scene_sha256: scene.scene_sha256.clone(),
        };
        scene.scene_json = detach_scene_background_asset(&scene.scene_json, asset_id)?;
        scene.scene_sha256 = sha256(scene.scene_json.as_bytes());
        changed = Some(previous);
    }
    let affected = changed.ok_or_else(|| {
        failure(
            "BROKEN_REFERENCE_SCENE_NOT_FOUND",
            "The selected Scene was not found in the current project.",
            "after-reread",
        )
    })?;
    resulting.generation = source.generation.checked_add(1).ok_or_else(|| {
        failure(
            "PROJECT_GENERATION_EXHAUSTED",
            "Project generation cannot advance for broken-reference repair.",
            "never",
        )
    })?;
    resulting.content_sha256 = content_hash(&resulting);
    Ok((resulting, affected))
}

fn broken_reference_detach_preview_sha256(receipt: &BrokenReferenceDetachPreviewReceipt) -> String {
    let canonical = format!(
        "{}\n{}\n{}\n{}\n{}\n{}\n{}\n{}\n{}\n{}\n{}\n{}\n{}\n{}\n{}\n{}\n{}\n{}\n{}\n{}\n{}\n",
        receipt.operation,
        receipt.project_id,
        receipt.generation,
        receipt.content_sha256,
        receipt.scene_id,
        receipt.asset_id,
        receipt.blocker_code,
        receipt.asset_descriptor_preserved,
        receipt.asset_sha256.as_deref().unwrap_or("none"),
        receipt.affected_scene.scene_id,
        receipt.affected_scene.scene_sha256,
        receipt.next_generation,
        receipt.resulting_content_sha256,
        receipt.primary_byte_sha256,
        receipt.backup_byte_sha256.as_deref().unwrap_or("none"),
        receipt.protected_state_sha256,
        receipt.asset_tree_sha256,
        receipt.resulting_asset_count,
        receipt.resulting_asset_collection_sha256,
        receipt.requires_approval,
        receipt.no_write,
    );
    sha256(canonical.as_bytes())
}

pub fn preview_broken_reference_detach_at(
    root: &Path,
    request: BrokenReferenceDetachPreviewRequest,
) -> Result<BrokenReferenceDetachPreviewReceipt, ProjectStoreFailure> {
    if request.schema_version != PROJECT_SCHEMA_VERSION {
        return Err(failure("UNSUPPORTED_REQUEST_SCHEMA", "Broken-reference detach preview request schema is not supported.", "never"));
    }
    let (source, primary_byte_sha256, primary, backup) = read_broken_reference_primary(root, &request)?;
    let stored = source.assets.iter().find(|asset| {
        asset.registration.as_ref().is_some_and(|registration| registration.asset_id == request.asset_id)
    });
    let asset_descriptor_preserved = request.blocker_code == "BACKGROUND_ASSET_ROLE_MISMATCH";
    if asset_descriptor_preserved && stored.is_none() {
        return Err(failure("STALE_BROKEN_REFERENCE_DIAGNOSIS", "The role-mismatch diagnosis no longer has its registered descriptor.", "after-reread"));
    }
    if request.blocker_code == "BACKGROUND_ASSET_MISSING" && stored.is_some() {
        return Err(failure("STALE_BROKEN_REFERENCE_DIAGNOSIS", "The missing-asset diagnosis now has a registered descriptor; inspect again.", "after-reread"));
    }
    if !matches!(request.blocker_code.as_str(), "BACKGROUND_ASSET_MISSING" | "BACKGROUND_ASSET_ROLE_MISMATCH") {
        return Err(failure("BROKEN_REFERENCE_NOT_ELIGIBLE", "Only M239 missing or role-mismatch diagnostics can be repaired.", "never"));
    }
    let (resulting, affected_scene) = detach_broken_reference_envelope(&source, &request.scene_id, &request.asset_id)?;
    let resulting_scenes = resulting.scenes.iter().map(|scene| ProjectSceneReceipt { scene_id: scene.scene_id.clone(), scene_sha256: scene.scene_sha256.clone() }).collect();
    let protected_state_sha256 = protected_state_sha256_excluding(root, &[primary.clone(), backup.clone()])?;
    let asset_tree_sha256 = owned_tree_sha256(root, &root.join("assets"))?;
    let mut receipt = BrokenReferenceDetachPreviewReceipt {
        operation: "dicebox.project.broken-reference.detach.preview".to_string(),
        status: "PREVIEW".to_string(),
        project_id: request.project_id,
        generation: source.generation,
        content_sha256: source.content_sha256.clone(),
        scene_id: request.scene_id,
        asset_id: request.asset_id,
        blocker_code: request.blocker_code,
        asset_descriptor_preserved,
        asset_sha256: stored.map(|asset| asset.sha256.clone()),
        affected_scene: affected_scene.clone(),
        resulting_scenes,
        resulting_asset_count: resulting.assets.len(),
        resulting_asset_collection_sha256: asset_collection_sha256(&resulting.assets),
        next_generation: resulting.generation,
        resulting_content_sha256: resulting.content_sha256,
        primary_byte_sha256,
        backup_byte_sha256: optional_regular_file_sha256(&backup, "Backup project envelope")?,
        protected_state_sha256,
        asset_tree_sha256,
        preview_sha256: String::new(),
        requires_approval: true,
        no_write: true,
        no_foundry_write: true,
    };
    receipt.preview_sha256 = broken_reference_detach_preview_sha256(&receipt);
    Ok(receipt)
}

pub fn detach_broken_reference_at(
    root: &Path,
    request: BrokenReferenceDetachRequest,
) -> Result<BrokenReferenceDetachReceipt, ProjectStoreFailure> {
    if request.schema_version != PROJECT_SCHEMA_VERSION {
        return Err(failure("UNSUPPORTED_REQUEST_SCHEMA", "Broken-reference detach request schema is not supported.", "never"));
    }
    validate_sha256(&request.preview_sha256).map_err(|_| failure("INVALID_BROKEN_REFERENCE_PREVIEW", "Broken-reference preview hash must be a lowercase SHA-256 digest.", "never"))?;
    if !request.approved {
        return Err(failure("BROKEN_REFERENCE_NOT_APPROVED", "Broken-reference detach requires explicit approval of the exact preview.", "never"));
    }
    let _lease = acquire_project_mutation_lease(root)?;
    let preview = preview_broken_reference_detach_at(root, BrokenReferenceDetachPreviewRequest {
        schema_version: request.schema_version.clone(),
        project_id: request.project_id.clone(),
        scene_id: request.scene_id.clone(),
        asset_id: request.asset_id.clone(),
        blocker_code: request.blocker_code.clone(),
    })?;
    if preview.preview_sha256 != request.preview_sha256 {
        return Err(failure("STALE_BROKEN_REFERENCE_PREVIEW", "Project generation, diagnosis, target Scene, asset descriptor, or protected state changed after preview.", "after-reread"));
    }
    let (source, _, primary, backup) = read_broken_reference_primary(root, &BrokenReferenceDetachPreviewRequest {
        schema_version: request.schema_version.clone(), project_id: request.project_id.clone(), scene_id: request.scene_id.clone(), asset_id: request.asset_id.clone(), blocker_code: request.blocker_code.clone(),
    })?;
    let (resulting, affected_scene) = detach_broken_reference_envelope(&source, &request.scene_id, &request.asset_id)?;
    if resulting.generation != preview.next_generation || resulting.content_sha256 != preview.resulting_content_sha256 || asset_collection_sha256(&resulting.assets) != preview.resulting_asset_collection_sha256 {
        return Err(failure("STALE_BROKEN_REFERENCE_PREVIEW", "The deterministic broken-reference repair result changed after preview.", "after-reread"));
    }
    let primary_relative = format!("projects/{}/project.json", validate_project_id(&request.project_id)?);
    let before_refs = inspect_broken_scene_asset_references(&primary, &primary_relative, &request.project_id);
    let (workspace_primary, workspace_backup, _) = workspace_index_paths(root);
    let workspace_before = (optional_regular_file_sha256(&workspace_primary, "Primary workspace metadata")?, optional_regular_file_sha256(&workspace_backup, "Backup workspace metadata")?);
    let save = commit_project_envelope(root, resulting.clone(), None, false, true)?;
    let after_inspection = inspect_project_recovery_at(root, ProjectRecoveryInspectionRequest { schema_version: PROJECT_SCHEMA_VERSION.to_string(), project_id: request.project_id.clone() })?;
    let after_bytes = fs::read(&primary).map_err(|error| failure("BROKEN_REFERENCE_REREAD_UNKNOWN", format!("Repaired primary could not be reread: {error}"), "after-reread"))?;
    let after_envelope: ProjectEnvelope = serde_json::from_slice(&after_bytes).map_err(|_| failure("BROKEN_REFERENCE_REREAD_UNKNOWN", "Repaired primary envelope could not be structurally reread.", "after-reread"))?;
    let target_binding_absent = after_envelope.scenes.iter().find(|scene| scene.scene_id == request.scene_id).and_then(|scene| scene_background_asset_id(&scene.scene_json).ok().flatten()).as_deref() != Some(request.asset_id.as_str());
    let after_refs = inspect_broken_scene_asset_references(&primary, &primary_relative, &request.project_id);
    let unrelated_references_unchanged = before_refs.iter().filter(|reference| !(reference.scene_id == request.scene_id && reference.asset_id == request.asset_id)).eq(after_refs.iter().filter(|reference| !(reference.scene_id == request.scene_id && reference.asset_id == request.asset_id)));
    let asset_descriptor_preserved = if preview.asset_descriptor_preserved { after_envelope.assets.iter().any(|asset| asset.registration.as_ref().is_some_and(|registration| registration.asset_id == request.asset_id)) } else { true };
    let asset_tree_unchanged = owned_tree_sha256(root, &root.join("assets"))? == preview.asset_tree_sha256;
    let workspace_unchanged = (optional_regular_file_sha256(&workspace_primary, "Primary workspace metadata")?, optional_regular_file_sha256(&workspace_backup, "Backup workspace metadata")?) == workspace_before;
    let foreign_state_unchanged = protected_state_sha256_excluding(root, &[primary.clone(), backup.clone()])? == preview.protected_state_sha256;
    let backup_preserves_prior_envelope = optional_regular_file_sha256(&backup, "Backup project envelope")?.as_deref() == Some(preview.primary_byte_sha256.as_str());
    let authoritative_inspection = after_envelope.project_id == request.project_id && after_envelope.content_sha256 == resulting.content_sha256 && after_inspection.no_write && after_inspection.no_foundry_write && target_binding_absent;
    if !target_binding_absent || !asset_descriptor_preserved || !asset_tree_unchanged || !workspace_unchanged || !foreign_state_unchanged || !backup_preserves_prior_envelope || !unrelated_references_unchanged || !authoritative_inspection {
        return Err(failure("BROKEN_REFERENCE_OUTCOME_UNKNOWN", "Broken-reference repair or a protected-state proof failed authoritative reread.", "after-reread"));
    }
    Ok(BrokenReferenceDetachReceipt {
        operation: "dicebox.project.broken-reference.detach".to_string(), status: "PASS".to_string(), project_id: request.project_id, previous_generation: preview.generation, generation: save.generation, previous_content_sha256: preview.content_sha256, content_sha256: save.content_sha256, scene_id: affected_scene.scene_id, asset_id: preview.asset_id, blocker_code: preview.blocker_code, asset_descriptor_preserved, asset_tree_unchanged, workspace_unchanged, foreign_state_unchanged, backup_preserves_prior_envelope, target_binding_absent, unrelated_references_unchanged, authoritative_inspection, residual_broken_reference_count: after_refs.len(), preview_sha256: preview.preview_sha256, directory_entry_sync: save.directory_entry_sync, no_foundry_write: true,
    })
}

pub fn list_projects_at(root: &Path) -> Result<ProjectCatalogResponse, ProjectStoreFailure> {
    ensure_not_reparse(root, "Project-store root")?;
    let workspace_state = read_workspace_index_state(root)?;
    let projects = root.join("projects");
    ensure_not_reparse(&projects, "Projects directory")?;
    if !projects.exists() {
        return Ok(ProjectCatalogResponse {
            operation: "dicebox.project.catalog".to_string(),
            status: if workspace_state.warning.is_some() {
                "PARTIAL"
            } else {
                "PASS"
            }
            .to_string(),
            entries: vec![],
            workspace_index_generation: workspace_state.envelope.generation,
            workspace_metadata_warning: workspace_state.warning,
            no_write: true,
            no_foundry_write: true,
        });
    }
    let mut candidates = Vec::new();
    for result in fs::read_dir(&projects).map_err(|error| {
        failure(
            "PROJECT_STORE_UNAVAILABLE",
            format!("Projects directory could not be listed: {error}"),
            "after-reread",
        )
    })? {
        let entry = result.map_err(|error| {
            failure(
                "PROJECT_STORE_UNAVAILABLE",
                format!("Project entry could not be listed: {error}"),
                "after-reread",
            )
        })?;
        let Some(slug) = entry.file_name().to_str().map(ToString::to_string) else {
            continue;
        };
        let project_id = format!("dbx:project:{slug}");
        if validate_project_id(&project_id).is_err() {
            continue;
        }
        candidates.push((project_id, entry.path()));
    }
    candidates.sort_by(|left, right| left.0.cmp(&right.0));
    let mut entries = Vec::with_capacity(candidates.len());
    for (project_id, path) in candidates {
        if let Err(blocker) = ensure_not_reparse(&path, "Project directory") {
            entries.push(catalog_blocked(project_id, blocker.code));
            continue;
        }
        match fs::metadata(&path) {
            Ok(metadata) if metadata.is_dir() => {}
            Ok(_) => {
                entries.push(catalog_blocked(
                    project_id,
                    "PROJECT_ENTRY_NOT_DIRECTORY".to_string(),
                ));
                continue;
            }
            Err(_) => {
                entries.push(catalog_blocked(
                    project_id,
                    "PROJECT_PATH_UNAVAILABLE".to_string(),
                ));
                continue;
            }
        }
        match read_primary_or_backup(root, &project_id) {
            Ok((read, recovered_from)) if read.envelope.project_id == project_id => {
                let active = read
                    .envelope
                    .scenes
                    .iter()
                    .find(|scene| scene.scene_id == read.envelope.active_scene_id)
                    .ok_or_else(|| {
                        failure(
                            "INVALID_ACTIVE_SCENE",
                            "Catalog project active Scene is missing.",
                            "after-reread",
                        )
                    })?;
                let scene: Value = serde_json::from_str(&active.scene_json).map_err(|_| {
                    failure(
                        "INVALID_SCENE",
                        "Catalog Scene JSON could not be reread.",
                        "after-reread",
                    )
                })?;
                let display_name = default_display_name(&project_id)?;
                let registered_assets = inspect_registered_assets(root, &read);
                let asset_blocker = registered_assets
                    .iter()
                    .find_map(|asset| asset.blocker_code.clone());
                entries.push(ProjectCatalogEntry {
                    project_id,
                    status: if asset_blocker.is_some() {
                        "BLOCKED"
                    } else {
                        "PASS"
                    }
                    .to_string(),
                    scene_id: scene
                        .get("id")
                        .and_then(Value::as_str)
                        .map(ToString::to_string),
                    scene_name: scene
                        .get("name")
                        .and_then(Value::as_str)
                        .map(ToString::to_string),
                    scene_count: Some(read.envelope.scenes.len()),
                    active_scene_id: Some(read.envelope.active_scene_id.clone()),
                    generation: Some(read.envelope.generation),
                    content_sha256: Some(read.persisted_content_sha256),
                    asset_count: Some(read.envelope.assets.len()),
                    recovered_from,
                    blocker_code: asset_blocker,
                    display_name,
                    last_opened_sequence: 0,
                    workspace_metadata_warning: None,
                });
            }
            Ok(_) => entries.push(catalog_blocked(
                project_id,
                "PROJECT_ID_MISMATCH".to_string(),
            )),
            Err(blocker) => entries.push(catalog_blocked(project_id, blocker.code)),
        }
    }
    for entry in &mut entries {
        if let Some(metadata) = workspace_state.envelope.entries.get(&entry.project_id) {
            entry.display_name = metadata.display_name.clone();
            entry.last_opened_sequence = metadata.last_opened_sequence;
        }
        entry.workspace_metadata_warning = workspace_state.warning.clone();
    }
    entries.sort_by(|left, right| {
        right
            .last_opened_sequence
            .cmp(&left.last_opened_sequence)
            .then(left.project_id.cmp(&right.project_id))
    });
    Ok(ProjectCatalogResponse {
        operation: "dicebox.project.catalog".to_string(),
        status: if entries.iter().any(|entry| entry.status == "BLOCKED")
            || workspace_state.warning.is_some()
        {
            "PARTIAL"
        } else {
            "PASS"
        }
        .to_string(),
        entries,
        workspace_index_generation: workspace_state.envelope.generation,
        workspace_metadata_warning: workspace_state.warning,
        no_write: true,
        no_foundry_write: true,
    })
}

pub fn load_project_at(
    root: &Path,
    request: LoadProjectRequest,
) -> Result<ProjectLoadResponse, ProjectStoreFailure> {
    if request.schema_version != PROJECT_SCHEMA_VERSION {
        return Err(failure(
            "UNSUPPORTED_REQUEST_SCHEMA",
            "Load request schema is not supported.",
            "never",
        ));
    }
    let (read, recovered_from) = read_primary_or_backup(root, &request.project_id)?;
    if read.envelope.project_id != request.project_id {
        return Err(failure(
            "PROJECT_ID_MISMATCH",
            "Stored project identity does not match the requested project.",
            "never",
        ));
    }
    ensure_not_reparse(root, "Project-store root")?;
    let assets_root = root.join("assets");
    ensure_not_reparse(&assets_root, "Assets directory")?;
    let asset_dir = assets_root.join("sha256");
    ensure_not_reparse(&asset_dir, "Content-addressed asset directory")?;
    for asset in &read.envelope.assets {
        let digest = validate_sha256(&asset.sha256)?;
        let path = asset_dir.join(digest);
        ensure_not_reparse(&path, "Content-addressed asset")?;
        let bytes = fs::read(&path).map_err(|error| {
            failure(
                "ASSET_STORE_UNAVAILABLE",
                format!("Referenced asset could not be read: {error}"),
                "after-reread",
            )
        })?;
        if bytes.len() != asset.byte_length || sha256(&bytes) != asset.sha256 {
            return Err(failure(
                "ASSET_HASH_MISMATCH",
                "Referenced asset failed content-addressed reread.",
                "after-reread",
            ));
        }
        if asset.registration.is_some() {
            validate_registered_media(&asset.media_type, &bytes)?;
        }
    }
    let scenes = read
        .envelope
        .scenes
        .iter()
        .map(|scene| ProjectSceneReceipt {
            scene_id: scene.scene_id.clone(),
            scene_sha256: scene.scene_sha256.clone(),
        })
        .collect::<Vec<_>>();
    let active_scene_sha256 = read
        .envelope
        .scenes
        .iter()
        .find(|scene| scene.scene_id == read.envelope.active_scene_id)
        .map(|scene| scene.scene_sha256.clone())
        .ok_or_else(|| {
            failure(
                "INVALID_ACTIVE_SCENE",
                "Loaded project active Scene is missing.",
                "after-reread",
            )
        })?;
    Ok(ProjectLoadResponse {
        scenes_json: read
            .envelope
            .scenes
            .iter()
            .map(|scene| scene.scene_json.clone())
            .collect(),
        active_scene_id: read.envelope.active_scene_id.clone(),
        assets: read.envelope.assets.clone(),
        receipt: ProjectLoadReceipt {
            operation: "dicebox.project.load".to_string(),
            status: "PASS".to_string(),
            project_id: read.envelope.project_id,
            generation: read.envelope.generation,
            content_sha256: read.persisted_content_sha256.clone(),
            scene_sha256: active_scene_sha256,
            scene_count: scenes.len(),
            active_scene_id: read.envelope.active_scene_id,
            scenes,
            asset_count: read.envelope.assets.len(),
            recovered_from,
            migration_status: read.migration_status,
            persisted_content_sha256: read.persisted_content_sha256,
            no_foundry_write: true,
        },
        workspace_metadata: None,
        workspace_metadata_warning: None,
    })
}

pub fn preview_project_migration(source_version: &str) -> ProjectMigrationPreview {
    let supported = source_version == PROJECT_SCHEMA_VERSION;
    let older_multi = source_version == MULTI_SCENE_PROJECT_SCHEMA_VERSION;
    let older_single = source_version == LEGACY_PROJECT_SCHEMA_VERSION;
    ProjectMigrationPreview {
        operation: "dicebox.project.migration.preview".to_string(),
        status: if supported || older_multi || older_single {
            "preview-only"
        } else {
            "blocked"
        }
        .to_string(),
        source_version: source_version.to_string(),
        target_version: PROJECT_SCHEMA_VERSION.to_string(),
        actions: if supported {
            vec!["retain-current-envelope".to_string()]
        } else if older_multi {
            vec![
                "add-asset-registration-boundary-in-memory".to_string(),
                "preserve-scenes-and-assets".to_string(),
                "write-only-on-explicit-save".to_string(),
            ]
        } else if older_single {
            vec![
                "wrap-single-scene-in-memory".to_string(),
                "preserve-semantic-scene".to_string(),
                "write-only-on-explicit-save".to_string(),
            ]
        } else {
            vec!["preserve-unknown-project".to_string()]
        },
        blockers: if supported || older_multi || older_single {
            vec![]
        } else {
            vec![
                "Unsupported or newer project schema requires an explicit migration adapter."
                    .to_string(),
            ]
        },
        no_write: true,
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use tempfile::tempdir;

    fn scene(revision: u64, x: u64) -> String {
        format!(
            r#"{{"schemaVersion":"0.1.0","revision":{revision},"id":"dbx:scene:fixture","name":"Fixture","width":1536,"height":1024,"background":{{"color":1,"gridSize":64}},"entities":[{{"id":"dbx:apparatus:core","kind":"apparatus","name":"Core","color":2,"locked":false,"x":{x},"y":376,"width":320,"height":272}}]}}"#
        )
    }

    fn second_scene(revision: u64) -> String {
        format!(
            r#"{{"schemaVersion":"0.1.0","revision":{revision},"id":"dbx:scene:second","name":"Second","width":1536,"height":1024,"background":{{"color":3,"gridSize":64}},"entities":[]}}"#
        )
    }

    fn registered_png() -> (Vec<u8>, String, ProjectAssetInput) {
        let bytes = vec![137, 80, 78, 71, 13, 10, 26, 10];
        let digest = sha256(&bytes);
        let asset_id = format!("dbx:asset:sha256-{digest}");
        let input = ProjectAssetInput {
            media_type: "image/png".to_string(),
            bytes: bytes.clone(),
            registration: Some(ProjectAssetRegistration {
                asset_id: asset_id.clone(),
                role: "background".to_string(),
                label: "Registered background.png".to_string(),
                provenance: "user-import".to_string(),
                approval: "approved".to_string(),
            }),
        };
        (bytes, asset_id, input)
    }

    fn registered_webp() -> (Vec<u8>, String, ProjectAssetInput) {
        let bytes = b"RIFF\x04\x00\x00\x00WEBP".to_vec();
        let digest = sha256(&bytes);
        let asset_id = format!("dbx:asset:sha256-{digest}");
        let input = ProjectAssetInput {
            media_type: "image/webp".to_string(),
            bytes: bytes.clone(),
            registration: Some(ProjectAssetRegistration {
                asset_id: asset_id.clone(),
                role: "background".to_string(),
                label: "Registered background.webp".to_string(),
                provenance: "user-import".to_string(),
                approval: "approved".to_string(),
            }),
        };
        (bytes, asset_id, input)
    }

    fn registered_audio_wav() -> (Vec<u8>, String, ProjectAssetInput) {
        let bytes = vec![82, 73, 70, 70, 36, 0, 0, 0, 87, 65, 86, 69, 102, 109, 116, 32];
        let digest = sha256(&bytes);
        let asset_id = format!("dbx:asset:sha256-{digest}");
        let input = ProjectAssetInput {
            media_type: "audio/wav".to_string(),
            bytes: bytes.clone(),
            registration: Some(ProjectAssetRegistration {
                asset_id: asset_id.clone(),
                role: "audio".to_string(),
                label: "Registered ambient.wav".to_string(),
                provenance: "user-import".to_string(),
                approval: "approved".to_string(),
            }),
        };
        (bytes, asset_id, input)
    }

    fn bind_scene(scene_json: &str, asset_id: &str) -> String {
        let mut value: Value = serde_json::from_str(scene_json).unwrap();
        value["background"]["assetId"] = Value::String(asset_id.to_string());
        serde_json::to_string(&value).unwrap()
    }

    fn request(generation: u64, revision: u64, x: u64) -> SaveProjectRequest {
        SaveProjectRequest {
            schema_version: PROJECT_SCHEMA_VERSION.to_string(),
            project_id: "dbx:project:desktop-fixture".to_string(),
            expected_generation: generation,
            scenes_json: vec![scene(revision, x)],
            active_scene_id: "dbx:scene:fixture".to_string(),
            assets: Some(vec![ProjectAssetInput {
                media_type: "image/png".to_string(),
                bytes: vec![137, 80, 78, 71, 13, 10, 26, 10],
                registration: None,
            }]),
            expected_workspace_generation: None,
            workspace_display_name: None,
        }
    }

    #[test]
    fn fixed_root_mutation_lease_blocks_project_and_workspace_writes_without_blocking_reads() {
        let root = tempdir().unwrap();
        let initial = save_project_at(root.path(), request(0, 0, 608)).unwrap();
        let (primary, backup, _) = project_paths(root.path(), &initial.project_id).unwrap();
        let primary_before = fs::read(&primary).unwrap();
        let backup_before =
            optional_regular_file_sha256(&backup, "Backup project envelope").unwrap();
        let asset_before = owned_tree_sha256(root.path(), &root.path().join("assets")).unwrap();
        let lease = acquire_project_mutation_lease(root.path()).unwrap();

        let blocked_save = save_project_at(root.path(), request(1, 1, 616)).unwrap_err();
        assert_eq!(blocked_save.code, "PROJECT_STORE_BUSY");
        assert_eq!(blocked_save.retry, "after-holder-exit-and-reread");
        let blocked_workspace = touch_workspace_project_at(
            root.path(),
            &initial.project_id,
            Some("Blocked while leased"),
            0,
        )
        .unwrap_err();
        assert_eq!(blocked_workspace.code, "PROJECT_STORE_BUSY");
        assert_eq!(fs::read(&primary).unwrap(), primary_before);
        assert_eq!(
            optional_regular_file_sha256(&backup, "Backup project envelope").unwrap(),
            backup_before
        );
        assert_eq!(
            owned_tree_sha256(root.path(), &root.path().join("assets")).unwrap(),
            asset_before
        );
        assert!(!root.path().join("workspace-index.json").exists());
        assert_eq!(list_projects_at(root.path()).unwrap().entries.len(), 1);

        drop(lease);
        let workspace = touch_workspace_project_at(
            root.path(),
            &initial.project_id,
            Some("Released after lease"),
            0,
        )
        .unwrap();
        assert_eq!(workspace.index_generation, 1);
        assert!(workspace.directory_entry_sync);
        let saved = save_project_at(root.path(), request(1, 1, 616)).unwrap();
        assert_eq!(saved.generation, 2);
        assert!(saved.directory_entry_sync);
    }

    fn request_for(project_id: &str, generation: u64, revision: u64, x: u64) -> SaveProjectRequest {
        SaveProjectRequest {
            project_id: project_id.to_string(),
            ..request(generation, revision, x)
        }
    }

    fn load_request(project_id: &str) -> LoadProjectRequest {
        LoadProjectRequest {
            schema_version: PROJECT_SCHEMA_VERSION.to_string(),
            project_id: project_id.to_string(),
            expected_workspace_generation: None,
        }
    }

    #[test]
    fn atomically_saves_loads_and_deduplicates_content_addressed_assets() {
        let root = tempdir().unwrap();
        let first = save_project_at(root.path(), request(0, 0, 608)).unwrap();
        assert_eq!(first.generation, 1);
        assert_eq!(first.asset_count, 1);
        assert!(first.directory_entry_sync);
        assert!(!first.backup_preserved);
        let loaded =
            load_project_at(root.path(), load_request("dbx:project:desktop-fixture")).unwrap();
        assert_eq!(loaded.receipt.content_sha256, first.content_sha256);
        assert_eq!(loaded.receipt.recovered_from, None);
        let second = save_project_at(root.path(), request(1, 1, 616)).unwrap();
        assert_eq!(second.generation, 2);
        assert!(second.backup_preserved);
        assert_eq!(
            fs::read_dir(root.path().join("assets/sha256"))
                .unwrap()
                .count(),
            1
        );
    }

    #[test]
    fn registers_merges_deduplicates_and_binds_one_exact_scene_background() {
        let root = tempdir().unwrap();
        let (_, asset_id, input) = registered_png();
        let mut first = request(0, 0, 608);
        first.scenes_json = vec![scene(0, 608), bind_scene(&second_scene(0), &asset_id)];
        first.active_scene_id = "dbx:scene:second".to_string();
        first.assets = Some(vec![input.clone()]);
        let saved = save_project_at(root.path(), first).unwrap();
        assert_eq!(saved.asset_count, 1);
        let loaded =
            load_project_at(root.path(), load_request("dbx:project:desktop-fixture")).unwrap();
        assert_eq!(
            loaded.assets[0].registration.as_ref().unwrap().asset_id,
            asset_id
        );
        assert_eq!(
            scene_background_asset_id(&loaded.scenes_json[0]).unwrap(),
            None
        );
        assert_eq!(
            scene_background_asset_id(&loaded.scenes_json[1])
                .unwrap()
                .as_deref(),
            Some(asset_id.as_str())
        );

        let mut duplicate = request(1, 1, 616);
        duplicate.scenes_json = loaded.scenes_json;
        duplicate.active_scene_id = "dbx:scene:second".to_string();
        duplicate.assets = Some(vec![input]);
        let resaved = save_project_at(root.path(), duplicate).unwrap();
        assert_eq!(resaved.asset_count, 1);
        assert_eq!(
            fs::read_dir(root.path().join("assets/sha256"))
                .unwrap()
                .count(),
            1
        );
    }

    #[test]
    fn accepts_non_scene_handout_and_excludes_it_from_background_recovery() {
        let root = tempdir().unwrap();
        let (bytes, asset_id, mut input) = registered_png();
        input.registration.as_mut().unwrap().role = "handout".to_string();
        let project_id = "dbx:project:handout-role";
        let mut initial = request_for(project_id, 0, 0, 608);
        initial.assets = Some(vec![input]);
        let saved = save_project_at(root.path(), initial).unwrap();
        assert_eq!(saved.asset_count, 1);

        let loaded = load_project_at(root.path(), load_request(project_id)).unwrap();
        assert_eq!(
            loaded.assets[0].registration.as_ref().unwrap().role,
            "handout"
        );
        assert!(scene_background_asset_id(&loaded.scenes_json[0])
            .unwrap()
            .is_none());

        let bound_scenes = validate_scene_collection(
            vec![bind_scene(&scene(0, 608), &asset_id)],
            "dbx:scene:fixture",
        )
        .unwrap();
        assert_eq!(
            validate_scene_asset_bindings(&bound_scenes, &loaded.assets)
                .unwrap_err()
                .code,
            "BACKGROUND_ASSET_ROLE_MISMATCH"
        );

        let target = root.path().join("assets/sha256").join(sha256(&bytes));
        fs::remove_file(target).unwrap();
        let inspection = inspect_project_recovery_at(
            root.path(),
            ProjectRecoveryInspectionRequest {
                schema_version: PROJECT_SCHEMA_VERSION.to_string(),
                project_id: project_id.to_string(),
            },
        )
        .unwrap();
        assert_eq!(inspection.registered_assets.len(), 1);
        assert_eq!(inspection.registered_assets[0].role, "handout");
        assert_eq!(inspection.registered_assets[0].disposition, "MISSING");
        assert!(inspection.registered_assets[0].affected_scene_ids.is_empty());
        assert!(!inspection.registered_assets[0].restore_eligible);
        assert_eq!(inspection.registered_assets[0].retry, "never-with-this-operation");
        assert!(inspection.no_write);
        assert!(inspection.no_foundry_write);
    }

    #[test]
    fn accepts_non_scene_audio_and_excludes_it_from_scene_background_recovery() {
        let root = tempdir().unwrap();
        let (bytes, asset_id, input) = registered_audio_wav();
        let project_id = "dbx:project:audio-role";
        let mut initial = request_for(project_id, 0, 0, 608);
        initial.assets = Some(vec![input.clone()]);
        let saved = save_project_at(root.path(), initial).unwrap();
        assert_eq!(saved.asset_count, 1);

        let loaded = load_project_at(root.path(), load_request(project_id)).unwrap();
        assert_eq!(loaded.assets[0].media_type, "audio/wav");
        assert_eq!(loaded.assets[0].registration.as_ref().unwrap().role, "audio");
        assert!(scene_background_asset_id(&loaded.scenes_json[0])
            .unwrap()
            .is_none());

        let bound_scenes = validate_scene_collection(
            vec![bind_scene(&scene(0, 608), &asset_id)],
            "dbx:scene:fixture",
        )
        .unwrap();
        assert_eq!(
            validate_scene_asset_bindings(&bound_scenes, &loaded.assets)
                .unwrap_err()
                .code,
            "BACKGROUND_ASSET_ROLE_MISMATCH"
        );

        let target = root.path().join("assets/sha256").join(sha256(&bytes));
        fs::remove_file(target).unwrap();
        let inspection = inspect_project_recovery_at(
            root.path(),
            ProjectRecoveryInspectionRequest {
                schema_version: PROJECT_SCHEMA_VERSION.to_string(),
                project_id: project_id.to_string(),
            },
        )
        .unwrap();
        assert_eq!(inspection.registered_assets.len(), 1);
        assert_eq!(inspection.registered_assets[0].role, "audio");
        assert_eq!(inspection.registered_assets[0].media_type, "audio/wav");
        assert_eq!(inspection.registered_assets[0].disposition, "MISSING");
        assert!(inspection.registered_assets[0].affected_scene_ids.is_empty());
        assert!(!inspection.registered_assets[0].restore_eligible);
        assert_eq!(inspection.registered_assets[0].retry, "never-with-this-operation");
        assert!(inspection.no_write);
        assert!(inspection.no_foundry_write);

        let mut invalid = input;
        invalid.bytes = b"not-a-wav".to_vec();
        let mut invalid_request = request_for("dbx:project:audio-invalid", 0, 0, 608);
        invalid_request.assets = Some(vec![invalid]);
        assert_eq!(save_project_at(root.path(), invalid_request).unwrap_err().code, "ASSET_MEDIA_MISMATCH");
    }

    #[test]
    fn accepts_non_scene_token_and_excludes_it_from_scene_background_recovery() {
        let root = tempdir().unwrap();
        let (bytes, asset_id, mut input) = registered_png();
        input.registration.as_mut().unwrap().role = "token".to_string();
        let project_id = "dbx:project:token-role";
        let mut initial = request_for(project_id, 0, 0, 608);
        initial.assets = Some(vec![input.clone()]);
        let saved = save_project_at(root.path(), initial).unwrap();
        assert_eq!(saved.asset_count, 1);

        let loaded = load_project_at(root.path(), load_request(project_id)).unwrap();
        assert_eq!(loaded.assets[0].media_type, "image/png");
        assert_eq!(loaded.assets[0].registration.as_ref().unwrap().role, "token");
        assert!(scene_background_asset_id(&loaded.scenes_json[0])
            .unwrap()
            .is_none());

        let bound_scenes = validate_scene_collection(
            vec![bind_scene(&scene(0, 608), &asset_id)],
            "dbx:scene:fixture",
        )
        .unwrap();
        assert_eq!(
            validate_scene_asset_bindings(&bound_scenes, &loaded.assets)
                .unwrap_err()
                .code,
            "BACKGROUND_ASSET_ROLE_MISMATCH"
        );

        let target = root.path().join("assets/sha256").join(sha256(&bytes));
        fs::remove_file(target).unwrap();
        let inspection = inspect_project_recovery_at(
            root.path(),
            ProjectRecoveryInspectionRequest {
                schema_version: PROJECT_SCHEMA_VERSION.to_string(),
                project_id: project_id.to_string(),
            },
        )
        .unwrap();
        assert_eq!(inspection.registered_assets.len(), 1);
        assert_eq!(inspection.registered_assets[0].role, "token");
        assert_eq!(inspection.registered_assets[0].media_type, "image/png");
        assert_eq!(inspection.registered_assets[0].disposition, "MISSING");
        assert!(inspection.registered_assets[0].affected_scene_ids.is_empty());
        assert!(!inspection.registered_assets[0].restore_eligible);
        assert_eq!(inspection.registered_assets[0].retry, "never-with-this-operation");
        assert!(inspection.no_write);
        assert!(inspection.no_foundry_write);
    }

    #[test]
    fn rejects_mismatched_registration_and_dangling_or_tampered_background_assets() {
        let root = tempdir().unwrap();
        let (bytes, asset_id, input) = registered_png();
        let mut mismatched = request(0, 0, 608);
        let mut bad_input = input.clone();
        bad_input.media_type = "image/webp".to_string();
        mismatched.assets = Some(vec![bad_input]);
        assert_eq!(
            save_project_at(root.path(), mismatched).unwrap_err().code,
            "ASSET_MEDIA_MISMATCH"
        );

        let mut dangling = request_for("dbx:project:dangling", 0, 0, 608);
        dangling.scenes_json = vec![bind_scene(&scene(0, 608), &asset_id)];
        dangling.assets = Some(vec![]);
        assert_eq!(
            save_project_at(root.path(), dangling).unwrap_err().code,
            "BACKGROUND_ASSET_MISSING"
        );

        let mut valid = request_for("dbx:project:tampered", 0, 0, 608);
        valid.scenes_json = vec![bind_scene(&scene(0, 608), &asset_id)];
        valid.assets = Some(vec![input]);
        save_project_at(root.path(), valid).unwrap();
        fs::write(
            root.path().join("assets/sha256").join(sha256(&bytes)),
            b"tampered",
        )
        .unwrap();
        assert_eq!(
            load_project_at(root.path(), load_request("dbx:project:tampered"))
                .unwrap_err()
                .code,
            "ASSET_HASH_MISMATCH"
        );
    }

    #[test]
    fn previews_approves_and_rereads_exact_one_missing_background_detach() {
        let root = tempdir().unwrap();
        let (bytes, asset_id, input) = registered_png();
        let project_id = "dbx:project:detach-missing-background";
        let mut request = request_for(project_id, 0, 0, 608);
        request.scenes_json = vec![
            bind_scene(&scene(0, 608), &asset_id),
            bind_scene(&second_scene(0), &asset_id),
        ];
        request.active_scene_id = "dbx:scene:fixture".to_string();
        request.assets = Some(vec![input]);
        let saved = create_project_at(root.path(), request).unwrap();
        assert!(saved.directory_entry_sync);
        touch_workspace_project_at(root.path(), project_id, Some("Detach fixture"), 0).unwrap();
        let (primary, backup, project_dir) = project_paths(root.path(), project_id).unwrap();
        let primary_before = fs::read(&primary).unwrap();
        let workspace_before = fs::read(root.path().join("workspace-index.json")).unwrap();
        let foreign = project_dir.join("foreign-note.txt");
        fs::write(&foreign, b"preserve-current-project-foreign-state").unwrap();
        let target = root.path().join("assets/sha256").join(sha256(&bytes));
        fs::remove_file(&target).unwrap();

        let preview = preview_missing_asset_detach_at(
            root.path(),
            MissingAssetDetachPreviewRequest {
                schema_version: PROJECT_SCHEMA_VERSION.to_string(),
                project_id: project_id.to_string(),
                asset_id: asset_id.clone(),
            },
        )
        .unwrap();
        assert_eq!(preview.status, "PREVIEW");
        assert_eq!(preview.generation, saved.generation);
        assert_eq!(preview.next_generation, saved.generation + 1);
        assert_eq!(preview.affected_scenes.len(), 2);
        assert_eq!(preview.resulting_scenes.len(), 2);
        assert_eq!(preview.resulting_asset_count, 0);
        assert!(preview.no_write);
        assert!(preview.no_foundry_write);
        assert_eq!(fs::read(&primary).unwrap(), primary_before);
        assert!(!backup.exists());
        assert!(!target.exists());

        assert_eq!(
            detach_missing_asset_at(
                root.path(),
                MissingAssetDetachRequest {
                    schema_version: PROJECT_SCHEMA_VERSION.to_string(),
                    project_id: project_id.to_string(),
                    asset_id: asset_id.clone(),
                    preview_sha256: preview.preview_sha256.clone(),
                    approved: false,
                },
            )
            .unwrap_err()
            .code,
            "ASSET_DETACH_NOT_APPROVED"
        );
        assert_eq!(fs::read(&primary).unwrap(), primary_before);

        let receipt = detach_missing_asset_at(
            root.path(),
            MissingAssetDetachRequest {
                schema_version: PROJECT_SCHEMA_VERSION.to_string(),
                project_id: project_id.to_string(),
                asset_id: asset_id.clone(),
                preview_sha256: preview.preview_sha256.clone(),
                approved: true,
            },
        )
        .unwrap();
        assert_eq!(receipt.previous_generation, saved.generation);
        assert_eq!(receipt.generation, saved.generation + 1);
        assert_eq!(receipt.previous_content_sha256, saved.content_sha256);
        assert_eq!(receipt.content_sha256, preview.resulting_content_sha256);
        assert_eq!(receipt.affected_scenes.len(), 2);
        assert!(receipt.descriptor_removed);
        assert!(receipt.asset_tree_unchanged);
        assert!(receipt.workspace_unchanged);
        assert!(receipt.foreign_state_unchanged);
        assert!(receipt.backup_preserves_prior_envelope);
        assert!(receipt.target_remains_absent);
        assert!(receipt.authoritative_reload);
        assert!(receipt.directory_entry_sync);
        assert!(receipt.no_foundry_write);
        assert_eq!(fs::read(&backup).unwrap(), primary_before);
        assert_eq!(
            fs::read(root.path().join("workspace-index.json")).unwrap(),
            workspace_before
        );
        assert_eq!(
            fs::read(&foreign).unwrap(),
            b"preserve-current-project-foreign-state"
        );
        assert!(!target.exists());
        let loaded = load_project_at(root.path(), load_request(project_id)).unwrap();
        assert_eq!(loaded.receipt.generation, saved.generation + 1);
        assert_eq!(
            loaded.receipt.content_sha256,
            preview.resulting_content_sha256
        );
        assert_eq!(loaded.assets.len(), 0);
        assert_eq!(loaded.scenes_json.len(), 2);
        assert!(loaded
            .scenes_json
            .iter()
            .all(|scene| scene_background_asset_id(scene).unwrap().is_none()));
        let inspection = inspect_project_recovery_at(
            root.path(),
            ProjectRecoveryInspectionRequest {
                schema_version: PROJECT_SCHEMA_VERSION.to_string(),
                project_id: project_id.to_string(),
            },
        )
        .unwrap();
        assert_eq!(inspection.status, "PASS");
        assert!(inspection.registered_assets.is_empty());
    }

    #[test]
    fn missing_background_detach_fails_closed_for_stale_present_multiple_and_backup_state() {
        let stale_root = tempdir().unwrap();
        let (bytes, asset_id, input) = registered_png();
        let project_id = "dbx:project:stale-detach";
        let mut request = request_for(project_id, 0, 0, 608);
        request.scenes_json = vec![bind_scene(&scene(0, 608), &asset_id)];
        request.assets = Some(vec![input]);
        create_project_at(stale_root.path(), request).unwrap();
        let target = stale_root.path().join("assets/sha256").join(sha256(&bytes));
        fs::remove_file(&target).unwrap();
        let preview = preview_missing_asset_detach_at(
            stale_root.path(),
            MissingAssetDetachPreviewRequest {
                schema_version: PROJECT_SCHEMA_VERSION.to_string(),
                project_id: project_id.to_string(),
                asset_id: asset_id.clone(),
            },
        )
        .unwrap();
        let mut changed = request_for(project_id, 1, 1, 616);
        changed.scenes_json = vec![bind_scene(&scene(1, 616), &asset_id)];
        changed.assets = None;
        save_project_at(stale_root.path(), changed).unwrap();
        assert_eq!(
            detach_missing_asset_at(
                stale_root.path(),
                MissingAssetDetachRequest {
                    schema_version: PROJECT_SCHEMA_VERSION.to_string(),
                    project_id: project_id.to_string(),
                    asset_id: asset_id.clone(),
                    preview_sha256: preview.preview_sha256,
                    approved: true,
                },
            )
            .unwrap_err()
            .code,
            "STALE_ASSET_DETACH_PREVIEW"
        );
        let current_preview = preview_missing_asset_detach_at(
            stale_root.path(),
            MissingAssetDetachPreviewRequest {
                schema_version: PROJECT_SCHEMA_VERSION.to_string(),
                project_id: project_id.to_string(),
                asset_id: asset_id.clone(),
            },
        )
        .unwrap();
        fs::write(&target, &bytes).unwrap();
        assert_eq!(
            detach_missing_asset_at(
                stale_root.path(),
                MissingAssetDetachRequest {
                    schema_version: PROJECT_SCHEMA_VERSION.to_string(),
                    project_id: project_id.to_string(),
                    asset_id: asset_id.clone(),
                    preview_sha256: current_preview.preview_sha256,
                    approved: true,
                },
            )
            .unwrap_err()
            .code,
            "ASSET_DETACH_TARGET_PRESENT"
        );
        assert_eq!(fs::read(&target).unwrap(), bytes);

        let multiple_root = tempdir().unwrap();
        let (png_bytes, png_id, png_input) = registered_png();
        let (webp_bytes, webp_id, webp_input) = registered_webp();
        let mut multiple = request_for("dbx:project:multiple-detach", 0, 0, 608);
        multiple.scenes_json = vec![
            bind_scene(&scene(0, 608), &png_id),
            bind_scene(&second_scene(0), &webp_id),
        ];
        multiple.assets = Some(vec![png_input, webp_input]);
        create_project_at(multiple_root.path(), multiple).unwrap();
        fs::remove_file(
            multiple_root
                .path()
                .join("assets/sha256")
                .join(sha256(&png_bytes)),
        )
        .unwrap();
        fs::remove_file(
            multiple_root
                .path()
                .join("assets/sha256")
                .join(sha256(&webp_bytes)),
        )
        .unwrap();
        assert_eq!(
            preview_missing_asset_detach_at(
                multiple_root.path(),
                MissingAssetDetachPreviewRequest {
                    schema_version: PROJECT_SCHEMA_VERSION.to_string(),
                    project_id: "dbx:project:multiple-detach".to_string(),
                    asset_id: png_id,
                },
            )
            .unwrap_err()
            .code,
            "ASSET_DETACH_NOT_ELIGIBLE"
        );

        let backup_root = tempdir().unwrap();
        let (backup_bytes, backup_id, backup_input) = registered_png();
        let backup_project = "dbx:project:backup-authoritative-detach";
        let mut first = request_for(backup_project, 0, 0, 608);
        first.scenes_json = vec![bind_scene(&scene(0, 608), &backup_id)];
        first.assets = Some(vec![backup_input]);
        create_project_at(backup_root.path(), first).unwrap();
        let mut second = request_for(backup_project, 1, 1, 616);
        second.scenes_json = vec![bind_scene(&scene(1, 616), &backup_id)];
        second.assets = None;
        save_project_at(backup_root.path(), second).unwrap();
        let (backup_primary, _, _) = project_paths(backup_root.path(), backup_project).unwrap();
        fs::write(&backup_primary, b"corrupt-primary").unwrap();
        fs::remove_file(
            backup_root
                .path()
                .join("assets/sha256")
                .join(sha256(&backup_bytes)),
        )
        .unwrap();
        assert_eq!(
            preview_missing_asset_detach_at(
                backup_root.path(),
                MissingAssetDetachPreviewRequest {
                    schema_version: PROJECT_SCHEMA_VERSION.to_string(),
                    project_id: backup_project.to_string(),
                    asset_id: backup_id,
                },
            )
            .unwrap_err()
            .code,
            "ASSET_DETACH_PRIMARY_REQUIRED"
        );
        assert_eq!(fs::read(&backup_primary).unwrap(), b"corrupt-primary");
    }

    #[test]
    fn inspects_preclassifies_and_restores_one_exact_missing_background_without_semantic_change() {
        let root = tempdir().unwrap();
        let (bytes, asset_id, input) = registered_png();
        let project_id = "dbx:project:recovery-success";
        let mut first = request_for(project_id, 0, 0, 608);
        first.scenes_json = vec![bind_scene(&scene(0, 608), &asset_id), second_scene(0)];
        first.active_scene_id = "dbx:scene:fixture".to_string();
        first.assets = Some(vec![input]);
        create_project_at(root.path(), first).unwrap();

        let mut second = request_for(project_id, 1, 1, 616);
        second.scenes_json = vec![bind_scene(&scene(1, 616), &asset_id), second_scene(0)];
        second.active_scene_id = "dbx:scene:fixture".to_string();
        second.assets = None;
        let saved = save_project_at(root.path(), second).unwrap();
        touch_workspace_project_at(root.path(), project_id, Some("Recovery Success"), 0).unwrap();
        touch_workspace_project_at(root.path(), project_id, None, 1).unwrap();
        fs::write(
            root.path().join("foreign-note.txt"),
            b"preserve foreign state",
        )
        .unwrap();

        let (primary, backup, _) = project_paths(root.path(), project_id).unwrap();
        let (workspace_primary, workspace_backup, _) = workspace_index_paths(root.path());
        let target = root
            .path()
            .join("assets")
            .join("sha256")
            .join(sha256(&bytes));
        fs::remove_file(&target).unwrap();
        let primary_before = fs::read(&primary).unwrap();
        let backup_before = fs::read(&backup).unwrap();
        let workspace_primary_before = fs::read(&workspace_primary).unwrap();
        let workspace_backup_before = fs::read(&workspace_backup).unwrap();
        let foreign_before = fs::read(root.path().join("foreign-note.txt")).unwrap();

        let inspection_request = ProjectRecoveryInspectionRequest {
            schema_version: PROJECT_SCHEMA_VERSION.to_string(),
            project_id: project_id.to_string(),
        };
        let inspection = inspect_project_recovery_at(root.path(), inspection_request).unwrap();
        assert_eq!(inspection.status, "BLOCKED");
        assert_eq!(inspection.primary.status, "VALID");
        assert_eq!(inspection.backup.status, "VALID");
        assert_eq!(inspection.migration_status.as_deref(), Some("current"));
        assert_eq!(inspection.generation, Some(saved.generation));
        assert_eq!(
            inspection.content_sha256.as_deref(),
            Some(saved.content_sha256.as_str())
        );
        assert_eq!(
            inspection.blocker_code.as_deref(),
            Some("REGISTERED_ASSET_BLOB_MISSING")
        );
        assert!(inspection.restore_eligible);
        assert!(inspection.no_write);
        assert_eq!(inspection.registered_assets.len(), 1);
        assert_eq!(inspection.registered_assets[0].asset_id, asset_id);
        assert_eq!(inspection.registered_assets[0].sha256, sha256(&bytes));
        assert_eq!(inspection.registered_assets[0].media_type, "image/png");
        assert_eq!(inspection.registered_assets[0].byte_length, bytes.len());
        assert_eq!(
            inspection.registered_assets[0].affected_scene_ids,
            vec!["dbx:scene:fixture"]
        );

        let catalog = list_projects_at(root.path()).unwrap();
        let catalog_entry = catalog
            .entries
            .iter()
            .find(|entry| entry.project_id == project_id)
            .unwrap();
        assert_eq!(catalog_entry.status, "BLOCKED");
        assert_eq!(
            catalog_entry.blocker_code.as_deref(),
            Some("REGISTERED_ASSET_BLOB_MISSING")
        );
        assert!(!target.exists());

        let preview_request = MissingAssetRestorePreviewRequest {
            schema_version: PROJECT_SCHEMA_VERSION.to_string(),
            project_id: project_id.to_string(),
            asset_id: asset_id.clone(),
            media_type: "image/png".to_string(),
            bytes: bytes.clone(),
        };
        let preview =
            preview_missing_asset_restore_at(root.path(), preview_request.clone()).unwrap();
        let repeated = preview_missing_asset_restore_at(root.path(), preview_request).unwrap();
        assert_eq!(preview, repeated);
        assert_eq!(preview.status, "PREVIEW");
        assert!(preview.requires_approval);
        assert!(preview.no_write);
        assert!(!target.exists());
        assert_eq!(
            restore_missing_asset_at(
                root.path(),
                MissingAssetRestoreRequest {
                    schema_version: PROJECT_SCHEMA_VERSION.to_string(),
                    project_id: project_id.to_string(),
                    asset_id: asset_id.clone(),
                    media_type: "image/png".to_string(),
                    bytes: bytes.clone(),
                    preview_sha256: preview.preview_sha256.clone(),
                    approved: false,
                },
            )
            .unwrap_err()
            .code,
            "ASSET_RESTORE_NOT_APPROVED"
        );
        assert!(!target.exists());

        let receipt = restore_missing_asset_at(
            root.path(),
            MissingAssetRestoreRequest {
                schema_version: PROJECT_SCHEMA_VERSION.to_string(),
                project_id: project_id.to_string(),
                asset_id: asset_id.clone(),
                media_type: "image/png".to_string(),
                bytes: bytes.clone(),
                preview_sha256: preview.preview_sha256,
                approved: true,
            },
        )
        .unwrap();
        assert_eq!(receipt.status, "PASS");
        assert_eq!(receipt.asset_id, asset_id);
        assert_eq!(receipt.authoritative_asset_sha256, sha256(&bytes));
        assert_eq!(
            receipt.authoritative_project_content_sha256,
            saved.content_sha256
        );
        assert!(receipt.envelope_unchanged);
        assert!(receipt.project_state_unchanged);
        assert!(receipt.scenes_unchanged);
        assert!(receipt.workspace_unchanged);
        assert!(receipt.backups_unchanged);
        assert!(receipt.foreign_state_unchanged);
        assert!(receipt.create_new_only);
        assert!(receipt.directory_entry_sync);
        assert!(receipt.no_project_write);
        assert!(receipt.no_foundry_write);
        assert_eq!(fs::read(&target).unwrap(), bytes);
        assert_eq!(fs::read(&primary).unwrap(), primary_before);
        assert_eq!(fs::read(&backup).unwrap(), backup_before);
        assert_eq!(
            fs::read(&workspace_primary).unwrap(),
            workspace_primary_before
        );
        assert_eq!(
            fs::read(&workspace_backup).unwrap(),
            workspace_backup_before
        );
        assert_eq!(
            fs::read(root.path().join("foreign-note.txt")).unwrap(),
            foreign_before
        );
        let loaded = load_project_at(root.path(), load_request(project_id)).unwrap();
        assert_eq!(loaded.receipt.generation, saved.generation);
        assert_eq!(loaded.receipt.content_sha256, saved.content_sha256);
    }

    #[test]
    fn selected_missing_background_fixture_creates_two_missing_registered_assets() {
        let root = tempdir().unwrap();
        let receipt = prepare_selected_missing_background_recovery_fixture_at(root.path()).unwrap();
        assert_eq!(receipt.status, "PASS");
        assert_eq!(receipt.asset_ids.len(), 2);
        assert_eq!(receipt.scene_ids.len(), 2);
        assert_eq!(receipt.generation, 1);
        assert!(receipt.no_foundry_write);
        let inspection = inspect_project_recovery_at(
            root.path(),
            ProjectRecoveryInspectionRequest {
                schema_version: PROJECT_SCHEMA_VERSION.to_string(),
                project_id: receipt.project_id.clone(),
            },
        )
        .unwrap();
        assert_eq!(inspection.status, "BLOCKED");
        assert_eq!(inspection.registered_assets.len(), 2);
        assert_eq!(
            inspection
                .registered_assets
                .iter()
                .filter(|asset| asset.restore_eligible)
                .count(),
            2
        );
        assert!(inspection
            .registered_assets
            .iter()
            .all(|asset| asset.disposition == "MISSING"));
        assert!(inspection.no_write);
        assert!(inspection.no_foundry_write);
        for asset in inspection.registered_assets {
            assert!(!root.path().join(&asset.relative_path).exists());
        }

        let selected = &receipt.asset_ids[0];
        let selected_bytes = vec![137, 80, 78, 71, 13, 10, 26, 10, 1];
        let preview = preview_missing_asset_restore_at(
            root.path(),
            MissingAssetRestorePreviewRequest {
                schema_version: PROJECT_SCHEMA_VERSION.to_string(),
                project_id: receipt.project_id.clone(),
                asset_id: selected.clone(),
                media_type: "image/png".to_string(),
                bytes: selected_bytes.clone(),
            },
        )
        .unwrap();
        assert!(preview.requires_approval);
        assert!(preview.no_write);
        let restored = restore_missing_asset_at(
            root.path(),
            MissingAssetRestoreRequest {
                schema_version: PROJECT_SCHEMA_VERSION.to_string(),
                project_id: receipt.project_id.clone(),
                asset_id: selected.clone(),
                media_type: "image/png".to_string(),
                bytes: selected_bytes,
                preview_sha256: preview.preview_sha256,
                approved: true,
            },
        )
        .unwrap();
        assert_eq!(restored.asset_id, *selected);
        let reread = inspect_project_recovery_at(
            root.path(),
            ProjectRecoveryInspectionRequest {
                schema_version: PROJECT_SCHEMA_VERSION.to_string(),
                project_id: receipt.project_id.clone(),
            },
        )
        .unwrap();
        assert_eq!(reread.registered_assets.len(), 2);
        assert_eq!(
            reread
                .registered_assets
                .iter()
                .find(|asset| asset.asset_id == *selected)
                .unwrap()
                .disposition,
            "PRESENT_VALID"
        );
        assert!(reread
            .registered_assets
            .iter()
            .any(|asset| asset.asset_id != *selected && asset.disposition == "MISSING" && asset.restore_eligible));
    }

    #[test]
    fn asset_restore_trace_fixture_is_distinct_and_creates_two_missing_registered_assets() {
        let root = tempdir().unwrap();
        let receipt = prepare_asset_restore_trace_fixture_at(root.path()).unwrap();
        assert_eq!(receipt.project_id, ASSET_RESTORE_TRACE_SELF_TEST_PROJECT_ID);
        assert_ne!(
            receipt.project_id,
            SELECTED_MISSING_BACKGROUND_RECOVERY_SELF_TEST_PROJECT_ID
        );
        assert_eq!(receipt.asset_ids.len(), 2);
        let inspection = inspect_project_recovery_at(
            root.path(),
            ProjectRecoveryInspectionRequest {
                schema_version: PROJECT_SCHEMA_VERSION.to_string(),
                project_id: receipt.project_id.clone(),
            },
        )
        .unwrap();
        assert_eq!(inspection.status, "BLOCKED");
        assert_eq!(
            inspection
                .registered_assets
                .iter()
                .filter(|asset| asset.restore_eligible)
                .count(),
            2
        );
        assert!(inspection
            .registered_assets
            .iter()
            .all(|asset| asset.disposition == "MISSING"));
        let project_path = root.path().join("projects").join("desktop-asset-restore-trace-self-test").join("project.json");
        let before = fs::read(&project_path).unwrap();
        let reread = prepare_asset_restore_trace_fixture_at(root.path()).unwrap();
        assert_eq!(reread, receipt);
        assert_eq!(fs::read(project_path).unwrap(), before);
    }

    #[test]
    fn asset_restore_trace_v2_fixture_uses_distinct_project_identity_and_is_idempotent() {
        let root = tempdir().unwrap();
        let receipt = prepare_asset_restore_trace_fixture_v2_at(root.path()).unwrap();
        assert_eq!(receipt.project_id, ASSET_RESTORE_TRACE_SELF_TEST_V2_PROJECT_ID);
        assert_ne!(receipt.project_id, ASSET_RESTORE_TRACE_SELF_TEST_PROJECT_ID);
        assert_eq!(receipt.asset_ids.len(), 2);
        let inspection = inspect_project_recovery_at(
            root.path(),
            ProjectRecoveryInspectionRequest {
                schema_version: PROJECT_SCHEMA_VERSION.to_string(),
                project_id: ASSET_RESTORE_TRACE_SELF_TEST_V2_PROJECT_ID.to_string(),
            },
        )
        .unwrap();
        assert_eq!(inspection.status, "BLOCKED");
        assert_eq!(inspection.project_id, ASSET_RESTORE_TRACE_SELF_TEST_V2_PROJECT_ID);
        assert_eq!(inspection.generation, Some(1));
        assert_eq!(inspection.registered_assets.len(), 2);
        assert!(inspection.registered_assets.iter().all(|asset| asset.disposition == "MISSING"));
        let project_path = root.path().join("projects").join("desktop-asset-restore-trace-self-test-v2").join("project.json");
        let before = fs::read(&project_path).unwrap();
        let reread = prepare_asset_restore_trace_fixture_v2_at(root.path()).unwrap();
        assert_eq!(reread, receipt);
        assert_eq!(fs::read(project_path).unwrap(), before);
    }

    #[test]
    fn asset_restore_trace_v3_fixture_uses_distinct_project_identity_and_is_idempotent() {
        let root = tempdir().unwrap();
        let receipt = prepare_asset_restore_trace_fixture_v3_at(root.path()).unwrap();
        assert_eq!(receipt.project_id, ASSET_RESTORE_TRACE_SELF_TEST_V3_PROJECT_ID);
        assert_ne!(receipt.project_id, ASSET_RESTORE_TRACE_SELF_TEST_PROJECT_ID);
        assert_ne!(receipt.project_id, ASSET_RESTORE_TRACE_SELF_TEST_V2_PROJECT_ID);
        assert_eq!(receipt.asset_ids.len(), 2);
        let inspection = inspect_project_recovery_at(
            root.path(),
            ProjectRecoveryInspectionRequest {
                schema_version: PROJECT_SCHEMA_VERSION.to_string(),
                project_id: ASSET_RESTORE_TRACE_SELF_TEST_V3_PROJECT_ID.to_string(),
            },
        )
        .unwrap();
        assert_eq!(inspection.status, "BLOCKED");
        assert_eq!(inspection.project_id, ASSET_RESTORE_TRACE_SELF_TEST_V3_PROJECT_ID);
        assert_eq!(inspection.generation, Some(1));
        assert_eq!(inspection.registered_assets.len(), 2);
        assert!(inspection.registered_assets.iter().all(|asset| asset.disposition == "MISSING"));
        let project_path = root.path().join("projects").join("desktop-asset-restore-trace-self-test-v3").join("project.json");
        let before = fs::read(&project_path).unwrap();
        let reread = prepare_asset_restore_trace_fixture_v3_at(root.path()).unwrap();
        assert_eq!(reread, receipt);
        assert_eq!(fs::read(project_path).unwrap(), before);
    }

    #[test]
    fn asset_detach_ui_lifecycle_fixture_creates_one_missing_and_one_preserved_asset() {
        let root = tempdir().unwrap();
        let unrelated_project_id = "dbx:project:unrelated-workspace-pending";
        let unrelated = create_project_at(
            root.path(),
            request_for(unrelated_project_id, 0, 0, 608),
        )
        .unwrap();
        touch_workspace_project_at(root.path(), unrelated_project_id, None, 0).unwrap();
        let workspace_path = root.path().join("workspace-index.json");
        let workspace = read_workspace_index_file(&workspace_path).unwrap();
        let workspace_bytes = fs::read(&workspace_path).unwrap();
        let workspace_pending = root
            .path()
            .join(format!("workspace-index.{}.pending", workspace.content_sha256));
        write_synced(&workspace_pending, &workspace_bytes).unwrap();
        assert_eq!(unrelated.generation, 1);
        let receipt = prepare_asset_detach_ui_lifecycle_fixture_at(root.path()).unwrap();
        assert_eq!(receipt.project_id, ASSET_DETACH_UI_LIFECYCLE_SELF_TEST_PROJECT_ID);
        assert_eq!(receipt.asset_ids.len(), 2);
        let inspection = inspect_project_recovery_at(
            root.path(),
            ProjectRecoveryInspectionRequest {
                schema_version: PROJECT_SCHEMA_VERSION.to_string(),
                project_id: receipt.project_id.clone(),
            },
        )
        .unwrap();
        assert_eq!(inspection.status, "BLOCKED");
        assert_eq!(inspection.primary.status, "VALID");
        assert_eq!(inspection.backup.status, "MISSING");
        assert_eq!(inspection.scenes.len(), 2);
        assert_eq!(inspection.registered_assets.len(), 2);
        assert!(inspection
            .pending_artifacts
            .iter()
            .any(|artifact| artifact.artifact_kind == "workspace-index-pending"));
        assert!(!inspection
            .pending_artifacts
            .iter()
            .any(|artifact| artifact.artifact_kind == "project-pending"));
        assert_eq!(
            inspection.registered_assets.iter().filter(|asset| asset.disposition == "MISSING" && asset.restore_eligible).count(),
            1
        );
        assert_eq!(
            inspection.registered_assets.iter().filter(|asset| asset.disposition == "PRESENT_VALID" && !asset.restore_eligible).count(),
            1
        );
        assert!(inspection.no_write);
        assert!(inspection.no_foundry_write);
        let (primary, backup, project_dir) = project_paths(root.path(), &receipt.project_id).unwrap();
        let primary_before = fs::read(&primary).unwrap();
        let webp_target = root
            .path()
            .join("assets/sha256")
            .join(sha256(b"RIFF\x07\x00\x00\x00WEBP!!!"));
        let webp_before = fs::read(&webp_target).unwrap();
        let workspace_pending = root
            .path()
            .join(format!("workspace-index.{}.pending", workspace.content_sha256));
        let workspace_pending_before = fs::read(&workspace_pending).unwrap();
        let second = prepare_asset_detach_ui_lifecycle_fixture_at(root.path()).unwrap();
        assert_eq!(second, receipt);
        assert_eq!(fs::read(&primary).unwrap(), primary_before);
        assert_eq!(fs::read(&webp_target).unwrap(), webp_before);
        assert_eq!(fs::read(&workspace_pending).unwrap(), workspace_pending_before);
        assert!(!backup.exists());
        assert_eq!(fs::read_dir(&project_dir).unwrap().count(), 1);
        fs::write(&primary, b"m560-drift").unwrap();
        let drift = prepare_asset_detach_ui_lifecycle_fixture_at(root.path()).unwrap_err();
        assert_eq!(drift.code, "PROJECT_FIXTURE_EXISTS");
    }

    #[test]
    fn inspects_owned_pending_artifacts_without_cleaning_or_traversing_them() {
        let root = tempdir().unwrap();
        let project_id = "dbx:project:pending-inspection";
        let saved = create_project_at(root.path(), request_for(project_id, 0, 0, 608)).unwrap();
        touch_workspace_project_at(root.path(), project_id, Some("Pending inspection"), 0).unwrap();
        let (primary, backup, project_dir) = project_paths(root.path(), project_id).unwrap();
        let workspace = root.path().join("workspace-index.json");
        let project_stage = project_dir.join(format!("project.{}.pending", saved.content_sha256));
        let workspace_content = read_workspace_index_file(&workspace).unwrap().content_sha256;
        let workspace_stage = root.path().join(format!("workspace-index.{workspace_content}.pending"));
        let malformed_stage = project_dir.join(format!("project.{}.pending", "f".repeat(64)));
        let foreign = project_dir.join("foreign.pending.note");
        fs::write(&project_stage, fs::read(&primary).unwrap()).unwrap();
        fs::write(&workspace_stage, fs::read(&workspace).unwrap()).unwrap();
        fs::write(&malformed_stage, b"not-a-project-envelope").unwrap();
        fs::write(&foreign, b"preserve foreign pending-looking note").unwrap();
        let primary_before = fs::read(&primary).unwrap();
        let workspace_before = fs::read(&workspace).unwrap();
        let project_stage_before = fs::read(&project_stage).unwrap();
        let workspace_stage_before = fs::read(&workspace_stage).unwrap();
        let malformed_before = fs::read(&malformed_stage).unwrap();
        let foreign_before = fs::read(&foreign).unwrap();

        let inspection = inspect_project_recovery_at(
            root.path(),
            ProjectRecoveryInspectionRequest {
                schema_version: PROJECT_SCHEMA_VERSION.to_string(),
                project_id: project_id.to_string(),
            },
        )
        .unwrap();
        assert_eq!(inspection.status, "BLOCKED");
        assert!(inspection.no_write);
        assert!(inspection.no_foundry_write);
        assert!(inspection.pending_artifacts.iter().any(|artifact| {
            artifact.artifact_kind == "project-pending"
                && artifact.relative_path == format!("projects/pending-inspection/project.{}.pending", saved.content_sha256)
                && artifact.status == "PRESENT_VALID"
                && artifact.staged_content_sha256.as_deref() == Some(saved.content_sha256.as_str())
                && artifact.retry == "recovery-required-after-reread"
        }));
        assert!(inspection.pending_artifacts.iter().any(|artifact| {
            artifact.artifact_kind == "workspace-index-pending"
                && artifact.relative_path == format!("./workspace-index.{workspace_content}.pending")
                && artifact.status == "PRESENT_VALID"
                && artifact.staged_content_sha256.as_deref() == Some(workspace_content.as_str())
        }));
        assert!(inspection.pending_artifacts.iter().any(|artifact| {
            artifact.artifact_kind == "project-pending"
                && artifact.relative_path == format!("projects/pending-inspection/project.{}.pending", "f".repeat(64))
                && artifact.status == "BLOCKED"
                && artifact.blocker_code.as_deref() == Some("PENDING_ARTIFACT_INVALID")
        }));
        assert!(inspection.pending_artifacts.iter().all(|artifact| !artifact.relative_path.contains("..")));
        assert_eq!(fs::read(&primary).unwrap(), primary_before);
        assert_eq!(fs::read(&workspace).unwrap(), workspace_before);
        assert_eq!(fs::read(&project_stage).unwrap(), project_stage_before);
        assert_eq!(fs::read(&workspace_stage).unwrap(), workspace_stage_before);
        assert_eq!(fs::read(&malformed_stage).unwrap(), malformed_before);
        assert_eq!(fs::read(&foreign).unwrap(), foreign_before);
        assert!(!backup.exists());
    }

    #[test]
    fn ignores_unrelated_runtime_state_while_preserving_the_exact_restore_scope() {
        let root = tempdir().unwrap();
        let (bytes, asset_id, input) = registered_png();
        let project_id = "dbx:project:runtime-state-recovery";
        let mut request = request_for(project_id, 0, 0, 608);
        request.scenes_json = vec![bind_scene(&scene(0, 608), &asset_id)];
        request.assets = Some(vec![input]);
        let saved = create_project_at(root.path(), request).unwrap();
        let target = root.path().join("assets/sha256").join(sha256(&bytes));
        fs::remove_file(&target).unwrap();
        let runtime_cache = root.path().join("EBWebView").join("Cache");
        fs::create_dir_all(&runtime_cache).unwrap();
        let runtime_file = runtime_cache.join("runtime-owned.bin");
        fs::write(&runtime_file, b"runtime-before-preview").unwrap();

        let preview = preview_missing_asset_restore_at(
            root.path(),
            MissingAssetRestorePreviewRequest {
                schema_version: PROJECT_SCHEMA_VERSION.to_string(),
                project_id: project_id.to_string(),
                asset_id: asset_id.clone(),
                media_type: "image/png".to_string(),
                bytes: bytes.clone(),
            },
        )
        .unwrap();
        fs::write(&runtime_file, b"runtime-after-preview").unwrap();
        let receipt = restore_missing_asset_at(
            root.path(),
            MissingAssetRestoreRequest {
                schema_version: PROJECT_SCHEMA_VERSION.to_string(),
                project_id: project_id.to_string(),
                asset_id,
                media_type: "image/png".to_string(),
                bytes: bytes.clone(),
                preview_sha256: preview.preview_sha256,
                approved: true,
            },
        )
        .unwrap();

        assert_eq!(
            receipt.authoritative_project_content_sha256,
            saved.content_sha256
        );
        assert!(receipt.project_state_unchanged);
        assert!(receipt.foreign_state_unchanged);
        assert_eq!(fs::read(&target).unwrap(), bytes);
        assert_eq!(fs::read(&runtime_file).unwrap(), b"runtime-after-preview");
    }

    #[test]
    fn restore_preview_rejects_wrong_candidate_stale_state_and_existing_targets() {
        let root = tempdir().unwrap();
        let (bytes, asset_id, input) = registered_png();
        let project_id = "dbx:project:recovery-blockers";
        let mut first = request_for(project_id, 0, 0, 608);
        first.scenes_json = vec![bind_scene(&scene(0, 608), &asset_id)];
        first.assets = Some(vec![input]);
        create_project_at(root.path(), first).unwrap();
        let target = root.path().join("assets/sha256").join(sha256(&bytes));
        fs::remove_file(&target).unwrap();

        let preview_for =
            |media_type: &str, candidate: Vec<u8>| MissingAssetRestorePreviewRequest {
                schema_version: PROJECT_SCHEMA_VERSION.to_string(),
                project_id: project_id.to_string(),
                asset_id: asset_id.clone(),
                media_type: media_type.to_string(),
                bytes: candidate,
            };
        assert_eq!(
            preview_missing_asset_restore_at(root.path(), preview_for("image/webp", bytes.clone()))
                .unwrap_err()
                .code,
            "ASSET_RESTORE_MIME_MISMATCH"
        );
        let mut wrong_length = bytes.clone();
        wrong_length.push(0);
        assert_eq!(
            preview_missing_asset_restore_at(root.path(), preview_for("image/png", wrong_length))
                .unwrap_err()
                .code,
            "ASSET_RESTORE_LENGTH_MISMATCH"
        );
        assert_eq!(
            preview_missing_asset_restore_at(root.path(), preview_for("image/png", vec![0; 8]))
                .unwrap_err()
                .code,
            "ASSET_MEDIA_MISMATCH"
        );

        let preview =
            preview_missing_asset_restore_at(root.path(), preview_for("image/png", bytes.clone()))
                .unwrap();
        let mut changed = request_for(project_id, 1, 1, 616);
        changed.scenes_json = vec![bind_scene(&scene(1, 616), &asset_id)];
        changed.assets = None;
        save_project_at(root.path(), changed).unwrap();
        assert_eq!(
            restore_missing_asset_at(
                root.path(),
                MissingAssetRestoreRequest {
                    schema_version: PROJECT_SCHEMA_VERSION.to_string(),
                    project_id: project_id.to_string(),
                    asset_id: asset_id.clone(),
                    media_type: "image/png".to_string(),
                    bytes: bytes.clone(),
                    preview_sha256: preview.preview_sha256,
                    approved: true,
                },
            )
            .unwrap_err()
            .code,
            "STALE_ASSET_RESTORE_PREVIEW"
        );
        assert!(!target.exists());

        let current_preview =
            preview_missing_asset_restore_at(root.path(), preview_for("image/png", bytes.clone()))
                .unwrap();
        fs::write(&target, &bytes).unwrap();
        assert_eq!(
            restore_missing_asset_at(
                root.path(),
                MissingAssetRestoreRequest {
                    schema_version: PROJECT_SCHEMA_VERSION.to_string(),
                    project_id: project_id.to_string(),
                    asset_id: asset_id.clone(),
                    media_type: "image/png".to_string(),
                    bytes: bytes.clone(),
                    preview_sha256: current_preview.preview_sha256.clone(),
                    approved: true,
                },
            )
            .unwrap_err()
            .code,
            "ASSET_RESTORE_TARGET_EXISTS"
        );
        fs::write(&target, b"tampered").unwrap();
        let inspection = inspect_project_recovery_at(
            root.path(),
            ProjectRecoveryInspectionRequest {
                schema_version: PROJECT_SCHEMA_VERSION.to_string(),
                project_id: project_id.to_string(),
            },
        )
        .unwrap();
        assert_eq!(inspection.registered_assets[0].disposition, "TAMPERED");
        assert_eq!(
            inspection.blocker_code.as_deref(),
            Some("ASSET_HASH_MISMATCH")
        );
        assert!(!inspection.restore_eligible);
        assert_eq!(
            restore_missing_asset_at(
                root.path(),
                MissingAssetRestoreRequest {
                    schema_version: PROJECT_SCHEMA_VERSION.to_string(),
                    project_id: project_id.to_string(),
                    asset_id: asset_id.clone(),
                    media_type: "image/png".to_string(),
                    bytes: bytes.clone(),
                    preview_sha256: current_preview.preview_sha256,
                    approved: true,
                },
            )
            .unwrap_err()
            .code,
            "ASSET_RESTORE_TARGET_EXISTS"
        );
        assert_eq!(fs::read(&target).unwrap(), b"tampered");

        let webp_root = tempdir().unwrap();
        let (webp_bytes, webp_asset_id, webp_input) = registered_webp();
        let mut webp_project = request_for("dbx:project:webp-hash", 0, 0, 608);
        webp_project.scenes_json = vec![bind_scene(&scene(0, 608), &webp_asset_id)];
        webp_project.assets = Some(vec![webp_input]);
        create_project_at(webp_root.path(), webp_project).unwrap();
        fs::remove_file(
            webp_root
                .path()
                .join("assets/sha256")
                .join(sha256(&webp_bytes)),
        )
        .unwrap();
        let mut wrong_hash = webp_bytes;
        wrong_hash[4] ^= 1;
        assert_eq!(
            preview_missing_asset_restore_at(
                webp_root.path(),
                MissingAssetRestorePreviewRequest {
                    schema_version: PROJECT_SCHEMA_VERSION.to_string(),
                    project_id: "dbx:project:webp-hash".to_string(),
                    asset_id: webp_asset_id,
                    media_type: "image/webp".to_string(),
                    bytes: wrong_hash,
                },
            )
            .unwrap_err()
            .code,
            "ASSET_RESTORE_HASH_MISMATCH"
        );
    }

    #[test]
    fn recovery_uses_but_never_promotes_a_valid_backup() {
        let root = tempdir().unwrap();
        let (bytes, asset_id, input) = registered_png();
        let project_id = "dbx:project:backup-recovery";
        let mut first = request_for(project_id, 0, 0, 608);
        first.scenes_json = vec![bind_scene(&scene(0, 608), &asset_id)];
        first.assets = Some(vec![input]);
        create_project_at(root.path(), first).unwrap();
        let mut second = request_for(project_id, 1, 1, 616);
        second.scenes_json = vec![bind_scene(&scene(1, 616), &asset_id)];
        second.assets = None;
        save_project_at(root.path(), second).unwrap();
        let (primary, backup, _) = project_paths(root.path(), project_id).unwrap();
        let backup_before = fs::read(&backup).unwrap();
        fs::write(&primary, b"corrupt-primary-preserved").unwrap();
        let primary_before = fs::read(&primary).unwrap();
        let target = root
            .path()
            .join("assets")
            .join("sha256")
            .join(sha256(&bytes));
        fs::remove_file(&target).unwrap();

        let inspection = inspect_project_recovery_at(
            root.path(),
            ProjectRecoveryInspectionRequest {
                schema_version: PROJECT_SCHEMA_VERSION.to_string(),
                project_id: project_id.to_string(),
            },
        )
        .unwrap();
        assert_eq!(inspection.primary.status, "BLOCKED");
        assert_eq!(inspection.backup.status, "VALID");
        assert_eq!(
            inspection.recovered_from.as_deref(),
            Some("project.backup.json")
        );
        assert!(inspection.restore_eligible);
        let preview = preview_missing_asset_restore_at(
            root.path(),
            MissingAssetRestorePreviewRequest {
                schema_version: PROJECT_SCHEMA_VERSION.to_string(),
                project_id: project_id.to_string(),
                asset_id: asset_id.clone(),
                media_type: "image/png".to_string(),
                bytes: bytes.clone(),
            },
        )
        .unwrap();
        let receipt = restore_missing_asset_at(
            root.path(),
            MissingAssetRestoreRequest {
                schema_version: PROJECT_SCHEMA_VERSION.to_string(),
                project_id: project_id.to_string(),
                asset_id,
                media_type: "image/png".to_string(),
                bytes,
                preview_sha256: preview.preview_sha256,
                approved: true,
            },
        )
        .unwrap();
        assert!(receipt.envelope_unchanged);
        assert!(receipt.backups_unchanged);
        assert!(receipt.foreign_state_unchanged);
        assert_eq!(fs::read(&primary).unwrap(), primary_before);
        assert_eq!(fs::read(&backup).unwrap(), backup_before);
        assert_eq!(
            load_project_at(root.path(), load_request(project_id))
                .unwrap()
                .receipt
                .recovered_from
                .as_deref(),
            Some("project.backup.json")
        );
    }

    #[test]
    fn previews_and_promotes_one_exact_current_backup_without_changing_semantic_state() {
        let root = tempdir().unwrap();
        let fixture = prepare_backup_authoritative_recovery_promotion_fixture_at(root.path()).unwrap();
        let (primary, backup, project_dir) = project_paths(root.path(), &fixture.project_id).unwrap();
        let backup_before = fs::read(&backup).unwrap();
        let foreign_before = fs::read(project_dir.join("foreign-note.txt")).unwrap();
        assert!(!primary.exists());

        let inspection = inspect_project_recovery_at(
            root.path(),
            ProjectRecoveryInspectionRequest {
                schema_version: PROJECT_SCHEMA_VERSION.to_string(),
                project_id: fixture.project_id.clone(),
            },
        )
        .unwrap();
        assert_eq!(inspection.status, "PASS");
        assert_eq!(inspection.primary.status, "MISSING");
        assert_eq!(inspection.backup.status, "VALID");
        assert_eq!(inspection.recovered_from.as_deref(), Some("project.backup.json"));
        assert!(inspection.no_write);
        assert!(inspection.no_foundry_write);

        let preview = preview_backup_authoritative_recovery_at(
            root.path(),
            BackupRecoveryPromotionPreviewRequest {
                schema_version: PROJECT_SCHEMA_VERSION.to_string(),
                project_id: fixture.project_id.clone(),
            },
        )
        .unwrap();
        assert_eq!(preview.status, "PREVIEW");
        assert_eq!(preview.primary.status, "MISSING");
        assert_eq!(preview.backup.status, "VALID");
        assert_eq!(preview.generation, fixture.generation);
        assert_eq!(preview.content_sha256, fixture.content_sha256);
        assert_eq!(preview.backup_byte_sha256, fixture.backup_byte_sha256);
        assert!(preview.requires_approval);
        assert!(preview.no_write);
        assert!(preview.no_foundry_write);
        assert!(!primary.exists());
        assert_eq!(fs::read(&backup).unwrap(), backup_before);

        let receipt = promote_backup_authoritative_recovery_at(
            root.path(),
            BackupRecoveryPromotionRequest {
                schema_version: PROJECT_SCHEMA_VERSION.to_string(),
                project_id: fixture.project_id.clone(),
                generation: preview.generation,
                content_sha256: preview.content_sha256.clone(),
                backup_byte_sha256: preview.backup_byte_sha256.clone(),
                protected_state_sha256: preview.protected_state_sha256.clone(),
                asset_tree_sha256: preview.asset_tree_sha256.clone(),
                preview_sha256: preview.preview_sha256.clone(),
                approved: true,
            },
        )
        .unwrap();
        assert_eq!(receipt.status, "PASS");
        assert!(receipt.primary_restored);
        assert!(receipt.backup_unchanged);
        assert!(receipt.semantic_state_unchanged);
        assert!(receipt.asset_tree_unchanged);
        assert!(receipt.workspace_unchanged);
        assert!(receipt.foreign_state_unchanged);
        assert!(receipt.authoritative_current_reread);
        assert!(receipt.directory_entry_sync);
        assert!(receipt.no_foundry_write);
        assert_eq!(fs::read(&primary).unwrap(), backup_before);
        assert_eq!(fs::read(&backup).unwrap(), backup_before);
        assert_eq!(fs::read(project_dir.join("foreign-note.txt")).unwrap(), foreign_before);

        let reread = inspect_project_recovery_at(
            root.path(),
            ProjectRecoveryInspectionRequest {
                schema_version: PROJECT_SCHEMA_VERSION.to_string(),
                project_id: fixture.project_id.clone(),
            },
        )
        .unwrap();
        assert_eq!(reread.primary.status, "VALID");
        assert_eq!(reread.backup.status, "VALID");
        assert_eq!(reread.primary.byte_sha256, reread.backup.byte_sha256);
        assert_eq!(reread.recovered_from, None);
        assert_eq!(reread.generation, Some(fixture.generation));
        assert_eq!(reread.content_sha256.as_deref(), Some(fixture.content_sha256.as_str()));
        let loaded = load_project_at(root.path(), load_request(&fixture.project_id)).unwrap();
        assert_eq!(loaded.receipt.recovered_from, None);
        assert_eq!(loaded.receipt.generation, fixture.generation);
        assert_eq!(loaded.receipt.persisted_content_sha256, fixture.content_sha256);
    }

    #[test]
    fn reuses_exact_existing_backup_only_fixture_without_writing() {
        let root = tempdir().unwrap();
        let first = prepare_backup_authoritative_recovery_promotion_fixture_at(root.path()).unwrap();
        let (primary, backup, project_dir) = project_paths(root.path(), &first.project_id).unwrap();
        let backup_before = fs::read(&backup).unwrap();
        let foreign_before =
            fs::read(project_dir.join(BACKUP_RECOVERY_FOREIGN_NOTE_FILE)).unwrap();
        let reused = prepare_backup_authoritative_recovery_promotion_fixture_at(root.path()).unwrap();

        assert_eq!(reused, first);
        assert!(!primary.exists());
        assert_eq!(fs::read(&backup).unwrap(), backup_before);
        assert_eq!(
            fs::read(project_dir.join(BACKUP_RECOVERY_FOREIGN_NOTE_FILE)).unwrap(),
            foreign_before
        );
        let entries = fs::read_dir(project_dir)
            .unwrap()
            .map(|entry| entry.unwrap().file_name().to_string_lossy().into_owned())
            .collect::<Vec<_>>();
        assert_eq!(entries.len(), 2);
        assert!(entries.contains(&"project.backup.json".to_string()));
        assert!(entries.contains(&BACKUP_RECOVERY_FOREIGN_NOTE_FILE.to_string()));
    }

    #[test]
    fn rejects_existing_backup_fixture_when_topology_or_foreign_state_mismatches() {
        let root = tempdir().unwrap();
        let project_id = BACKUP_AUTHORITATIVE_RECOVERY_PROMOTION_SELF_TEST_PROJECT_ID;
        let (_, _, project_dir) = project_paths(root.path(), project_id).unwrap();
        fs::create_dir_all(&project_dir).unwrap();
        fs::write(
            project_dir.join(BACKUP_RECOVERY_FOREIGN_NOTE_FILE),
            BACKUP_RECOVERY_FOREIGN_NOTE_BYTES,
        )
        .unwrap();
        fs::write(project_dir.join("unexpected.txt"), b"preserve unknown state").unwrap();

        let error =
            prepare_backup_authoritative_recovery_promotion_fixture_at(root.path()).unwrap_err();
        assert_eq!(error.code, "PROJECT_FIXTURE_EXISTS");
        assert_eq!(
            fs::read(project_dir.join(BACKUP_RECOVERY_FOREIGN_NOTE_FILE)).unwrap(),
            BACKUP_RECOVERY_FOREIGN_NOTE_BYTES
        );
        assert!(project_dir.join("unexpected.txt").exists());
    }

    #[test]
    fn rejects_existing_backup_fixture_with_foreign_marker_mismatch() {
        let root = tempdir().unwrap();
        let project_id = BACKUP_AUTHORITATIVE_RECOVERY_PROMOTION_SELF_TEST_PROJECT_ID;
        let (_, _, project_dir) = project_paths(root.path(), project_id).unwrap();
        fs::create_dir_all(&project_dir).unwrap();
        fs::write(project_dir.join("project.backup.json"), b"not-a-project").unwrap();
        fs::write(
            project_dir.join(BACKUP_RECOVERY_FOREIGN_NOTE_FILE),
            b"changed foreign state",
        )
        .unwrap();

        let error =
            prepare_backup_authoritative_recovery_promotion_fixture_at(root.path()).unwrap_err();
        assert_eq!(error.code, "PROJECT_FIXTURE_EXISTS");
        assert_eq!(
            fs::read(project_dir.join(BACKUP_RECOVERY_FOREIGN_NOTE_FILE)).unwrap(),
            b"changed foreign state"
        );
    }

    #[test]
    fn backup_promotion_requires_an_absent_primary_and_current_backup() {
        let root = tempdir().unwrap();
        let project_id = "dbx:project:backup-promotion-guards";
        create_project_at(root.path(), request_for(project_id, 0, 0, 608)).unwrap();
        assert_eq!(
            preview_backup_authoritative_recovery_at(
                root.path(),
                BackupRecoveryPromotionPreviewRequest {
                    schema_version: PROJECT_SCHEMA_VERSION.to_string(),
                    project_id: project_id.to_string(),
                },
            )
            .unwrap_err()
            .code,
            "BACKUP_PROMOTION_PRIMARY_PRESENT"
        );

        let (primary, backup, _) = project_paths(root.path(), project_id).unwrap();
        let mut second = request_for(project_id, 1, 1, 616);
        second.scenes_json = vec![scene(1, 616)];
        save_project_at(root.path(), second).unwrap();
        let mut legacy: Value = serde_json::from_slice(&fs::read(&backup).unwrap()).unwrap();
        legacy["schemaVersion"] = Value::String(MULTI_SCENE_PROJECT_SCHEMA_VERSION.to_string());
        fs::write(&backup, serde_json::to_vec(&legacy).unwrap()).unwrap();
        fs::remove_file(&primary).unwrap();
        assert_eq!(
            preview_backup_authoritative_recovery_at(
                root.path(),
                BackupRecoveryPromotionPreviewRequest {
                    schema_version: PROJECT_SCHEMA_VERSION.to_string(),
                    project_id: project_id.to_string(),
                },
            )
            .unwrap_err()
            .code,
            "PROJECT_HASH_MISMATCH"
        );
    }

    #[test]
    fn recovery_inspection_blocks_dangling_unsupported_and_escaped_asset_state() {
        let dangling_root = tempdir().unwrap();
        let (_, asset_id, input) = registered_png();
        let project_id = "dbx:project:dangling-inspection";
        let mut request = request_for(project_id, 0, 0, 608);
        request.scenes_json = vec![bind_scene(&scene(0, 608), &asset_id)];
        request.assets = Some(vec![input]);
        create_project_at(dangling_root.path(), request).unwrap();
        let (primary, _, _) = project_paths(dangling_root.path(), project_id).unwrap();
        let mut envelope = read_envelope(&primary).unwrap().envelope;
        envelope.assets[0].registration = None;
        envelope.content_sha256 = content_hash(&envelope);
        fs::write(&primary, serde_json::to_vec(&envelope).unwrap()).unwrap();
        let dangling = inspect_project_recovery_at(
            dangling_root.path(),
            ProjectRecoveryInspectionRequest {
                schema_version: PROJECT_SCHEMA_VERSION.to_string(),
                project_id: project_id.to_string(),
            },
        )
        .unwrap();
        assert_eq!(dangling.status, "BLOCKED");
        assert_eq!(
            dangling.blocker_code.as_deref(),
            Some("BACKGROUND_ASSET_MISSING")
        );

        let unsupported_root = tempdir().unwrap();
        create_project_at(
            unsupported_root.path(),
            request_for("dbx:project:unsupported-inspection", 0, 0, 608),
        )
        .unwrap();
        let (unsupported_primary, _, _) = project_paths(
            unsupported_root.path(),
            "dbx:project:unsupported-inspection",
        )
        .unwrap();
        let mut unsupported = read_envelope(&unsupported_primary).unwrap().envelope;
        unsupported.schema_version = "9.0.0".to_string();
        unsupported.content_sha256 = content_hash(&unsupported);
        fs::write(
            &unsupported_primary,
            serde_json::to_vec(&unsupported).unwrap(),
        )
        .unwrap();
        let unsupported_inspection = inspect_project_recovery_at(
            unsupported_root.path(),
            ProjectRecoveryInspectionRequest {
                schema_version: PROJECT_SCHEMA_VERSION.to_string(),
                project_id: "dbx:project:unsupported-inspection".to_string(),
            },
        )
        .unwrap();
        assert_eq!(unsupported_inspection.status, "BLOCKED");
        assert_eq!(
            unsupported_inspection.blocker_code.as_deref(),
            Some("UNSUPPORTED_PROJECT_SCHEMA")
        );

        let escaped_root = tempdir().unwrap();
        let (escaped_bytes, escaped_asset_id, escaped_input) = registered_png();
        let mut escaped_request = request_for("dbx:project:escaped-inspection", 0, 0, 608);
        escaped_request.scenes_json = vec![bind_scene(&scene(0, 608), &escaped_asset_id)];
        escaped_request.assets = Some(vec![escaped_input]);
        create_project_at(escaped_root.path(), escaped_request).unwrap();
        let (escaped_primary, _, _) =
            project_paths(escaped_root.path(), "dbx:project:escaped-inspection").unwrap();
        let mut escaped = read_envelope(&escaped_primary).unwrap().envelope;
        escaped.assets[0].relative_path = "../../foreign.bin".to_string();
        escaped.content_sha256 = content_hash(&escaped);
        fs::write(&escaped_primary, serde_json::to_vec(&escaped).unwrap()).unwrap();
        fs::remove_file(
            escaped_root
                .path()
                .join("assets/sha256")
                .join(sha256(&escaped_bytes)),
        )
        .unwrap();
        let escaped_inspection = inspect_project_recovery_at(
            escaped_root.path(),
            ProjectRecoveryInspectionRequest {
                schema_version: PROJECT_SCHEMA_VERSION.to_string(),
                project_id: "dbx:project:escaped-inspection".to_string(),
            },
        )
        .unwrap();
        assert_eq!(escaped_inspection.status, "BLOCKED");
        assert_eq!(
            escaped_inspection.blocker_code.as_deref(),
            Some("INVALID_ASSET_PATH")
        );
    }

    #[test]
    fn recovery_inspection_reports_exact_dangling_scene_references_without_writing() {
        let root = tempdir().unwrap();
        let fixture = prepare_dangling_background_reference_fixture_at(root.path()).unwrap();
        let (primary, _, _) = project_paths(root.path(), &fixture.project_id).unwrap();
        let before = fs::read(&primary).unwrap();
        let inspection = inspect_project_recovery_at(
            root.path(),
            ProjectRecoveryInspectionRequest {
                schema_version: PROJECT_SCHEMA_VERSION.to_string(),
                project_id: fixture.project_id.clone(),
            },
        )
        .unwrap();
        assert_eq!(inspection.status, "BLOCKED");
        assert_eq!(inspection.primary.status, "BLOCKED");
        assert_eq!(inspection.broken_scene_references.len(), 2);
        let missing = inspection
            .broken_scene_references
            .iter()
            .find(|reference| reference.blocker_code == "BACKGROUND_ASSET_MISSING")
            .unwrap();
        assert_eq!(missing.source, format!("projects/{}/project.json", validate_project_id(&fixture.project_id).unwrap()));
        assert_eq!(missing.scene_id, fixture.scene_ids[0]);
        assert_eq!(missing.asset_id, fixture.asset_ids[0]);
        assert_eq!(missing.retry, "after-reread");
        let mismatch = inspection
            .broken_scene_references
            .iter()
            .find(|reference| reference.blocker_code == "BACKGROUND_ASSET_ROLE_MISMATCH")
            .unwrap();
        assert_eq!(mismatch.scene_id, fixture.scene_ids[1]);
        assert_eq!(mismatch.asset_id, fixture.asset_ids[1]);
        assert_eq!(mismatch.retry, "never");
        assert!(inspection.no_write);
        assert!(inspection.no_foundry_write);
        assert_eq!(fs::read(&primary).unwrap(), before);
    }

    #[cfg(windows)]
    #[test]
    fn recovery_inspection_blocks_a_reparse_asset_target_without_traversal() {
        let root = tempdir().unwrap();
        let (bytes, asset_id, input) = registered_png();
        let project_id = "dbx:project:reparse-asset";
        let mut request = request_for(project_id, 0, 0, 608);
        request.scenes_json = vec![bind_scene(&scene(0, 608), &asset_id)];
        request.assets = Some(vec![input]);
        create_project_at(root.path(), request).unwrap();
        let target = root
            .path()
            .join("assets")
            .join("sha256")
            .join(sha256(&bytes));
        fs::remove_file(&target).unwrap();
        let foreign = root.path().join("foreign-asset-directory");
        fs::create_dir_all(&foreign).unwrap();
        fs::write(foreign.join("foreign-note.txt"), b"preserve me").unwrap();
        let status = std::process::Command::new("cmd.exe")
            .args(["/D", "/C", "mklink", "/J"])
            .arg(&target)
            .arg(&foreign)
            .status()
            .unwrap();
        assert!(status.success());
        let inspection = inspect_project_recovery_at(
            root.path(),
            ProjectRecoveryInspectionRequest {
                schema_version: PROJECT_SCHEMA_VERSION.to_string(),
                project_id: project_id.to_string(),
            },
        )
        .unwrap();
        assert_eq!(inspection.status, "BLOCKED");
        assert_eq!(
            inspection.blocker_code.as_deref(),
            Some("PROJECT_PATH_REPARSE_POINT")
        );
        assert!(!inspection.restore_eligible);
        assert_eq!(
            fs::read(foreign.join("foreign-note.txt")).unwrap(),
            b"preserve me"
        );
    }

    #[cfg(windows)]
    #[test]
    fn recovery_inspection_reports_a_reparse_pending_artifact_without_traversal() {
        let root = tempdir().unwrap();
        let project_id = "dbx:project:reparse-pending";
        let saved = create_project_at(root.path(), request_for(project_id, 0, 0, 608)).unwrap();
        let (_, _, project_dir) = project_paths(root.path(), project_id).unwrap();
        let pending = project_dir.join(format!("project.{}.pending", saved.content_sha256));
        let foreign = root.path().join("foreign-pending-directory");
        fs::create_dir_all(&foreign).unwrap();
        fs::write(foreign.join("foreign-note.txt"), b"preserve pending foreign state").unwrap();
        let status = std::process::Command::new("cmd.exe")
            .args(["/D", "/C", "mklink", "/J"])
            .arg(&pending)
            .arg(&foreign)
            .status()
            .unwrap();
        assert!(status.success());
        let inspection = inspect_project_recovery_at(
            root.path(),
            ProjectRecoveryInspectionRequest {
                schema_version: PROJECT_SCHEMA_VERSION.to_string(),
                project_id: project_id.to_string(),
            },
        )
        .unwrap();
        let pending = inspection
            .pending_artifacts
            .iter()
            .find(|artifact| artifact.artifact_kind == "project-pending")
            .unwrap();
        assert_eq!(pending.status, "BLOCKED");
        assert_eq!(pending.blocker_code.as_deref(), Some("PROJECT_PATH_REPARSE_POINT"));
        assert_eq!(
            fs::read(foreign.join("foreign-note.txt")).unwrap(),
            b"preserve pending foreign state"
        );
    }

    #[test]
    fn migrates_multi_scene_020_in_memory_without_writing_and_promotes_only_on_save() {
        let root = tempdir().unwrap();
        save_project_at(root.path(), request(0, 0, 608)).unwrap();
        let (primary, _, _) = project_paths(root.path(), "dbx:project:desktop-fixture").unwrap();
        let mut legacy = read_envelope(&primary).unwrap().envelope;
        legacy.schema_version = MULTI_SCENE_PROJECT_SCHEMA_VERSION.to_string();
        legacy.content_sha256 = multi_scene_legacy_content_hash(&legacy);
        let legacy_bytes = serde_json::to_vec(&legacy).unwrap();
        fs::write(&primary, &legacy_bytes).unwrap();

        let loaded =
            load_project_at(root.path(), load_request("dbx:project:desktop-fixture")).unwrap();
        assert_eq!(loaded.receipt.migration_status, "migrated-in-memory");
        assert_eq!(
            loaded.receipt.persisted_content_sha256,
            legacy.content_sha256
        );
        assert_eq!(fs::read(&primary).unwrap(), legacy_bytes);

        let mut promoted = request(1, 1, 616);
        promoted.assets = None;
        save_project_at(root.path(), promoted).unwrap();
        assert_eq!(
            read_envelope(&primary).unwrap().envelope.schema_version,
            PROJECT_SCHEMA_VERSION
        );
    }

    #[test]
    fn rejects_stale_generation_without_replacing_the_project() {
        let root = tempdir().unwrap();
        let first = save_project_at(root.path(), request(0, 0, 608)).unwrap();
        let failure = save_project_at(root.path(), request(0, 1, 616)).unwrap_err();
        assert_eq!(failure.code, "STALE_PROJECT_GENERATION");
        let loaded =
            load_project_at(root.path(), load_request("dbx:project:desktop-fixture")).unwrap();
        assert_eq!(loaded.receipt.content_sha256, first.content_sha256);
    }

    #[test]
    fn recovers_the_last_valid_backup_after_primary_corruption() {
        let root = tempdir().unwrap();
        let first = save_project_at(root.path(), request(0, 0, 608)).unwrap();
        save_project_at(root.path(), request(1, 1, 616)).unwrap();
        let (primary, _, _) = project_paths(root.path(), "dbx:project:desktop-fixture").unwrap();
        fs::write(primary, b"corrupt").unwrap();
        let loaded =
            load_project_at(root.path(), load_request("dbx:project:desktop-fixture")).unwrap();
        assert_eq!(loaded.receipt.content_sha256, first.content_sha256);
        assert_eq!(
            loaded.receipt.recovered_from.as_deref(),
            Some("project.backup.json")
        );
    }

    #[test]
    fn preserves_assets_when_an_ordinary_save_omits_replacement_bytes() {
        let root = tempdir().unwrap();
        save_project_at(root.path(), request(0, 0, 608)).unwrap();
        let mut next = request(1, 1, 616);
        next.assets = None;
        let receipt = save_project_at(root.path(), next).unwrap();
        assert_eq!(receipt.asset_count, 1);
        assert_eq!(
            load_project_at(root.path(), load_request("dbx:project:desktop-fixture"))
                .unwrap()
                .assets
                .len(),
            1
        );
    }

    #[test]
    fn persists_ordered_multi_scene_state_and_active_scene_hashes() {
        let root = tempdir().unwrap();
        let mut first = request(0, 0, 608);
        first.scenes_json.push(second_scene(0));
        first.active_scene_id = "dbx:scene:second".to_string();
        let saved = save_project_at(root.path(), first).unwrap();
        assert_eq!(saved.scene_count, 2);
        assert_eq!(saved.active_scene_id, "dbx:scene:second");
        assert_eq!(
            saved
                .scenes
                .iter()
                .map(|scene| scene.scene_id.as_str())
                .collect::<Vec<_>>(),
            vec!["dbx:scene:fixture", "dbx:scene:second",]
        );

        let loaded =
            load_project_at(root.path(), load_request("dbx:project:desktop-fixture")).unwrap();
        assert_eq!(loaded.receipt.migration_status, "current");
        assert_eq!(loaded.receipt.content_sha256, saved.content_sha256);
        assert_eq!(loaded.active_scene_id, "dbx:scene:second");
        assert_eq!(
            loaded
                .scenes_json
                .iter()
                .map(|json| serde_json::from_str::<Value>(json).unwrap())
                .collect::<Vec<_>>(),
            vec![scene(0, 608), second_scene(0)]
                .iter()
                .map(|json| serde_json::from_str::<Value>(json).unwrap())
                .collect::<Vec<_>>(),
        );
        assert_eq!(loaded.receipt.scenes, saved.scenes);
    }

    #[test]
    fn migrates_legacy_single_scene_in_memory_without_writing_and_promotes_only_on_save() {
        let root = tempdir().unwrap();
        save_project_at(root.path(), request(0, 0, 608)).unwrap();
        let (primary, _, _) = project_paths(root.path(), "dbx:project:desktop-fixture").unwrap();
        let current = read_envelope(&primary).unwrap().envelope;
        let mut legacy = LegacyProjectEnvelope {
            schema_version: LEGACY_PROJECT_SCHEMA_VERSION.to_string(),
            project_id: current.project_id.clone(),
            generation: current.generation,
            scene_json: current.scenes[0].scene_json.clone(),
            scene_sha256: current.scenes[0].scene_sha256.clone(),
            assets: current.assets.clone(),
            content_sha256: String::new(),
        };
        legacy.content_sha256 = legacy_content_hash(&legacy);
        let legacy_bytes = serde_json::to_vec(&legacy).unwrap();
        fs::write(&primary, &legacy_bytes).unwrap();

        let loaded =
            load_project_at(root.path(), load_request("dbx:project:desktop-fixture")).unwrap();
        assert_eq!(loaded.receipt.migration_status, "migrated-in-memory");
        assert_eq!(
            loaded.receipt.persisted_content_sha256,
            legacy.content_sha256
        );
        assert_eq!(
            loaded
                .scenes_json
                .iter()
                .map(|json| serde_json::from_str::<Value>(json).unwrap())
                .collect::<Vec<_>>(),
            vec![serde_json::from_str::<Value>(&scene(0, 608)).unwrap()],
        );
        assert_eq!(fs::read(&primary).unwrap(), legacy_bytes);

        let mut promoted = request(1, 0, 608);
        promoted.scenes_json.push(second_scene(0));
        promoted.active_scene_id = "dbx:scene:second".to_string();
        promoted.assets = None;
        let receipt = save_project_at(root.path(), promoted).unwrap();
        assert_eq!(receipt.generation, 2);
        assert_eq!(receipt.scene_count, 2);
        let reread = read_envelope(&primary).unwrap();
        assert_eq!(reread.migration_status, "current");
        assert_eq!(reread.envelope.schema_version, PROJECT_SCHEMA_VERSION);
        assert_eq!(reread.envelope.scenes.len(), 2);
        assert_eq!(reread.envelope.assets, legacy.assets);
    }

    #[test]
    fn create_requires_an_absent_target_and_rejects_reserved_windows_slugs() {
        let root = tempdir().unwrap();
        let receipt = create_project_at(
            root.path(),
            request_for("dbx:project:new-campaign", 0, 0, 608),
        )
        .unwrap();
        assert_eq!(receipt.operation, "dicebox.project.create");
        assert_eq!(
            create_project_at(
                root.path(),
                request_for("dbx:project:new-campaign", 0, 0, 608)
            )
            .unwrap_err()
            .code,
            "PROJECT_ALREADY_EXISTS"
        );
        assert_eq!(
            create_project_at(root.path(), request_for("dbx:project:con", 0, 0, 608))
                .unwrap_err()
                .code,
            "RESERVED_PROJECT_ID"
        );
        assert_eq!(
            create_project_at(root.path(), request_for("dbx:project:com9", 0, 0, 608))
                .unwrap_err()
                .code,
            "RESERVED_PROJECT_ID"
        );
    }

    #[test]
    fn catalogs_owned_projects_deterministically_without_repairing_blocked_entries() {
        let root = tempdir().unwrap();
        create_project_at(root.path(), request_for("dbx:project:a-good", 0, 0, 608)).unwrap();
        let blocked = root.path().join("projects").join("z-broken");
        fs::create_dir_all(&blocked).unwrap();
        fs::write(blocked.join("foreign-note.txt"), b"preserve me").unwrap();
        let catalog = list_projects_at(root.path()).unwrap();
        assert_eq!(catalog.status, "PARTIAL");
        assert_eq!(
            catalog
                .entries
                .iter()
                .map(|entry| entry.project_id.as_str())
                .collect::<Vec<_>>(),
            vec!["dbx:project:a-good", "dbx:project:z-broken",]
        );
        assert_eq!(catalog.entries[0].status, "PASS");
        assert_eq!(catalog.entries[1].status, "BLOCKED");
        assert!(blocked.join("foreign-note.txt").is_file());
        assert!(catalog.no_write);
    }

    #[test]
    fn save_as_preserves_the_source_and_assets_and_requires_an_absent_target() {
        let root = tempdir().unwrap();
        let source =
            create_project_at(root.path(), request_for("dbx:project:source", 0, 0, 608)).unwrap();
        let target = save_project_as_at(
            root.path(),
            SaveProjectAsRequest {
                schema_version: PROJECT_SCHEMA_VERSION.to_string(),
                source_project_id: "dbx:project:source".to_string(),
                target_project_id: "dbx:project:target".to_string(),
                scenes_json: vec![scene(1, 616)],
                active_scene_id: "dbx:scene:fixture".to_string(),
                expected_workspace_generation: None,
                workspace_display_name: None,
            },
        )
        .unwrap();
        assert_eq!(target.operation, "dicebox.project.save-as");
        assert_eq!(target.generation, 1);
        assert_eq!(target.asset_count, 1);
        let source_after =
            load_project_at(root.path(), load_request("dbx:project:source")).unwrap();
        assert_eq!(source_after.receipt.content_sha256, source.content_sha256);
        assert_eq!(
            save_project_as_at(
                root.path(),
                SaveProjectAsRequest {
                    schema_version: PROJECT_SCHEMA_VERSION.to_string(),
                    source_project_id: "dbx:project:source".to_string(),
                    target_project_id: "dbx:project:target".to_string(),
                    scenes_json: vec![scene(2, 624)],
                    active_scene_id: "dbx:scene:fixture".to_string(),
                    expected_workspace_generation: None,
                    workspace_display_name: None,
                }
            )
            .unwrap_err()
            .code,
            "PROJECT_ALREADY_EXISTS"
        );
    }

    #[test]
    fn failed_promotion_after_backup_recovery_preserves_the_last_valid_backup() {
        let root = tempdir().unwrap();
        save_project_at(root.path(), request(0, 0, 608)).unwrap();
        save_project_at(root.path(), request(1, 1, 616)).unwrap();
        let (primary, backup, _) =
            project_paths(root.path(), "dbx:project:desktop-fixture").unwrap();
        fs::write(&primary, b"corrupt").unwrap();
        let (recovered, recovered_from) =
            read_primary_or_backup(root.path(), "dbx:project:desktop-fixture").unwrap();
        let canonical_scene = validate_scene_json(&scene(2, 624)).unwrap();
        let active_scene_id = scene_id(&canonical_scene).unwrap();
        let mut next = ProjectEnvelope {
            generation: recovered.envelope.generation + 1,
            scenes: validate_scene_collection(vec![canonical_scene], &active_scene_id).unwrap(),
            active_scene_id,
            content_sha256: String::new(),
            ..recovered.envelope
        };
        next.content_sha256 = content_hash(&next);
        assert_eq!(
            commit_project_envelope(root.path(), next, recovered_from.as_deref(), true, false)
                .unwrap_err()
                .code,
            "PROJECT_COMMIT_UNKNOWN"
        );
        assert!(read_envelope(&backup).is_ok());
        let loaded =
            load_project_at(root.path(), load_request("dbx:project:desktop-fixture")).unwrap();
        assert_eq!(
            loaded.receipt.recovered_from.as_deref(),
            Some("project.backup.json")
        );
    }

    #[test]
    fn rejects_manipulated_serialized_asset_paths_before_filesystem_resolution() {
        let root = tempdir().unwrap();
        create_project_at(root.path(), request_for("dbx:project:path-test", 0, 0, 608)).unwrap();
        let (primary, _, _) = project_paths(root.path(), "dbx:project:path-test").unwrap();
        let mut envelope = read_envelope(&primary).unwrap().envelope;
        envelope.assets[0].relative_path = "../../foreign.bin".to_string();
        envelope.content_sha256 = content_hash(&envelope);
        fs::write(&primary, serde_json::to_vec(&envelope).unwrap()).unwrap();
        assert_eq!(
            load_project_at(root.path(), load_request("dbx:project:path-test"))
                .unwrap_err()
                .code,
            "INVALID_ASSET_PATH"
        );
    }

    #[cfg(windows)]
    #[test]
    fn catalogs_a_windows_junction_project_directory_as_blocked_without_traversal() {
        let root = tempdir().unwrap();
        let projects = root.path().join("projects");
        let foreign = root.path().join("foreign-project-content");
        fs::create_dir_all(&projects).unwrap();
        fs::create_dir_all(&foreign).unwrap();
        fs::write(foreign.join("foreign-note.txt"), b"preserve me").unwrap();
        let junction = projects.join("junction-project");
        let status = std::process::Command::new("cmd.exe")
            .args(["/D", "/C", "mklink", "/J"])
            .arg(&junction)
            .arg(&foreign)
            .status()
            .unwrap();
        assert!(status.success());
        let catalog = list_projects_at(root.path()).unwrap();
        assert_eq!(catalog.entries.len(), 1);
        assert_eq!(
            catalog.entries[0].project_id,
            "dbx:project:junction-project"
        );
        assert_eq!(catalog.entries[0].status, "BLOCKED");
        assert_eq!(
            catalog.entries[0].blocker_code.as_deref(),
            Some("PROJECT_PATH_REPARSE_POINT")
        );
        assert_eq!(
            fs::read(foreign.join("foreign-note.txt")).unwrap(),
            b"preserve me"
        );
    }

    #[test]
    fn workspace_metadata_renames_and_orders_without_changing_project_content() {
        let root = tempdir().unwrap();
        let alpha = create_project_at(
            root.path(),
            request_for("dbx:project:alpha-campaign", 0, 0, 608),
        )
        .unwrap();
        let beta = create_project_at(
            root.path(),
            request_for("dbx:project:beta-campaign", 0, 0, 608),
        )
        .unwrap();
        let alpha_touch = touch_workspace_project_at(
            root.path(),
            "dbx:project:alpha-campaign",
            Some("Alpha Campaign"),
            0,
        )
        .unwrap();
        let beta_touch = touch_workspace_project_at(
            root.path(),
            "dbx:project:beta-campaign",
            Some("Beta Campaign"),
            1,
        )
        .unwrap();
        let renamed = rename_workspace_project_at(
            root.path(),
            RenameProjectRequest {
                schema_version: WORKSPACE_INDEX_SCHEMA_VERSION.to_string(),
                project_id: "dbx:project:alpha-campaign".to_string(),
                display_name: "Alpha Renamed".to_string(),
                expected_workspace_generation: 2,
            },
        )
        .unwrap();
        assert_eq!(alpha_touch.last_opened_sequence, 1);
        assert_eq!(beta_touch.last_opened_sequence, 2);
        assert_eq!(renamed.last_opened_sequence, 1);
        assert_eq!(renamed.index_generation, 3);

        let catalog = list_projects_at(root.path()).unwrap();
        assert_eq!(catalog.workspace_index_generation, 3);
        assert_eq!(
            catalog
                .entries
                .iter()
                .map(|entry| (
                    entry.project_id.as_str(),
                    entry.display_name.as_str(),
                    entry.last_opened_sequence
                ))
                .collect::<Vec<_>>(),
            vec![
                ("dbx:project:beta-campaign", "Beta Campaign", 2),
                ("dbx:project:alpha-campaign", "Alpha Renamed", 1),
            ]
        );
        let alpha_after =
            load_project_at(root.path(), load_request("dbx:project:alpha-campaign")).unwrap();
        let beta_after =
            load_project_at(root.path(), load_request("dbx:project:beta-campaign")).unwrap();
        assert_eq!(
            (
                alpha_after.receipt.generation,
                alpha_after.receipt.content_sha256
            ),
            (alpha.generation, alpha.content_sha256)
        );
        assert_eq!(
            (
                beta_after.receipt.generation,
                beta_after.receipt.content_sha256
            ),
            (beta.generation, beta.content_sha256)
        );
    }

    #[test]
    fn missing_workspace_metadata_uses_no_write_slug_defaults() {
        let root = tempdir().unwrap();
        create_project_at(
            root.path(),
            request_for("dbx:project:no-metadata-yet", 0, 0, 608),
        )
        .unwrap();
        let catalog = list_projects_at(root.path()).unwrap();
        assert_eq!(catalog.workspace_index_generation, 0);
        assert_eq!(catalog.entries[0].display_name, "No Metadata Yet");
        assert_eq!(catalog.entries[0].last_opened_sequence, 0);
        assert!(!root.path().join("workspace-index.json").exists());
    }

    #[test]
    fn workspace_metadata_recovers_a_valid_backup_and_preserves_unknown_entries() {
        let root = tempdir().unwrap();
        create_project_at(root.path(), request_for("dbx:project:known", 0, 0, 608)).unwrap();
        let mut seeded = default_workspace_index();
        seeded.generation = 1;
        seeded.next_sequence = 2;
        seeded.entries.insert(
            "dbx:project:unknown-preserved".to_string(),
            WorkspaceIndexEntry {
                display_name: "Unknown Preserved".to_string(),
                last_opened_sequence: 1,
            },
        );
        seeded.content_sha256 = workspace_index_content_hash(&seeded);
        commit_workspace_index(
            root.path(),
            seeded,
            None,
            "fixture",
            "dbx:project:unknown-preserved",
            false,
        )
        .unwrap();
        touch_workspace_project_at(root.path(), "dbx:project:known", Some("Known"), 1).unwrap();
        let (primary, backup, _) = workspace_index_paths(root.path());
        fs::write(&primary, b"corrupt").unwrap();
        let recovered = rename_workspace_project_at(
            root.path(),
            RenameProjectRequest {
                schema_version: WORKSPACE_INDEX_SCHEMA_VERSION.to_string(),
                project_id: "dbx:project:unknown-preserved".replace("unknown-preserved", "known"),
                display_name: "Known Renamed".to_string(),
                expected_workspace_generation: 1,
            },
        )
        .unwrap();
        assert_eq!(
            recovered.recovered_from.as_deref(),
            Some("workspace-index.backup.json")
        );
        assert!(read_workspace_index_file(&backup).is_ok());
        let reread = read_workspace_index_file(&primary).unwrap();
        assert!(reread.entries.contains_key("dbx:project:unknown-preserved"));
        assert_eq!(
            reread.entries["dbx:project:known"].display_name,
            "Known Renamed"
        );
    }

    #[test]
    fn workspace_metadata_failed_promotion_keeps_the_last_valid_backup() {
        let root = tempdir().unwrap();
        create_project_at(root.path(), request_for("dbx:project:recovery", 0, 0, 608)).unwrap();
        touch_workspace_project_at(root.path(), "dbx:project:recovery", Some("Recovery One"), 0)
            .unwrap();
        touch_workspace_project_at(root.path(), "dbx:project:recovery", Some("Recovery Two"), 1)
            .unwrap();
        let (primary, backup, _) = workspace_index_paths(root.path());
        fs::write(&primary, b"corrupt").unwrap();
        let state = read_workspace_index_state(root.path()).unwrap();
        assert_eq!(
            state.recovered_from.as_deref(),
            Some("workspace-index.backup.json")
        );
        let mut next = state.envelope;
        next.generation += 1;
        next.entries
            .get_mut("dbx:project:recovery")
            .unwrap()
            .display_name = "Recovery Three".to_string();
        next.content_sha256 = workspace_index_content_hash(&next);
        assert_eq!(
            commit_workspace_index(
                root.path(),
                next,
                state.recovered_from.as_deref(),
                "fixture",
                "dbx:project:recovery",
                true,
            )
            .unwrap_err()
            .code,
            "WORKSPACE_INDEX_COMMIT_UNKNOWN"
        );
        assert!(read_workspace_index_file(&backup).is_ok());
        assert_eq!(
            read_workspace_index_state(root.path())
                .unwrap()
                .recovered_from
                .as_deref(),
            Some("workspace-index.backup.json")
        );
    }

    #[test]
    fn workspace_metadata_failures_never_hide_valid_project_content() {
        let root = tempdir().unwrap();
        let project = create_project_at(
            root.path(),
            request_for("dbx:project:still-readable", 0, 0, 608),
        )
        .unwrap();
        fs::write(root.path().join("workspace-index.json"), b"corrupt").unwrap();
        let catalog = list_projects_at(root.path()).unwrap();
        assert_eq!(catalog.status, "PARTIAL");
        assert_eq!(
            catalog.workspace_metadata_warning.as_deref(),
            Some("WORKSPACE_INDEX_CORRUPT")
        );
        assert_eq!(catalog.entries[0].status, "PASS");
        assert_eq!(
            load_project_at(root.path(), load_request("dbx:project:still-readable"))
                .unwrap()
                .receipt
                .content_sha256,
            project.content_sha256
        );
        assert_eq!(
            rename_workspace_project_at(
                root.path(),
                RenameProjectRequest {
                    schema_version: WORKSPACE_INDEX_SCHEMA_VERSION.to_string(),
                    project_id: "dbx:project:still-readable".to_string(),
                    display_name: "Still Readable".to_string(),
                    expected_workspace_generation: 0,
                }
            )
            .unwrap_err()
            .code,
            "WORKSPACE_INDEX_CORRUPT"
        );

        fs::remove_file(root.path().join("workspace-index.json")).unwrap();
        let mut unsupported = default_workspace_index();
        unsupported.schema_version = "9.0.0".to_string();
        unsupported.content_sha256 = workspace_index_content_hash(&unsupported);
        fs::write(
            root.path().join("workspace-index.json"),
            serde_json::to_vec(&unsupported).unwrap(),
        )
        .unwrap();
        let catalog = list_projects_at(root.path()).unwrap();
        assert_eq!(
            catalog.workspace_metadata_warning.as_deref(),
            Some("UNSUPPORTED_WORKSPACE_INDEX_SCHEMA")
        );
        assert_eq!(catalog.entries[0].status, "PASS");
    }

    #[test]
    fn workspace_metadata_rejects_stale_generations_and_malformed_names() {
        let root = tempdir().unwrap();
        create_project_at(root.path(), request_for("dbx:project:names", 0, 0, 608)).unwrap();
        touch_workspace_project_at(root.path(), "dbx:project:names", Some("Names"), 0).unwrap();
        assert_eq!(
            touch_workspace_project_at(root.path(), "dbx:project:names", None, 0)
                .unwrap_err()
                .code,
            "STALE_WORKSPACE_INDEX_GENERATION"
        );
        assert_eq!(
            rename_workspace_project_at(
                root.path(),
                RenameProjectRequest {
                    schema_version: WORKSPACE_INDEX_SCHEMA_VERSION.to_string(),
                    project_id: "dbx:project:names".to_string(),
                    display_name: " bad\nname ".to_string(),
                    expected_workspace_generation: 1,
                }
            )
            .unwrap_err()
            .code,
            "INVALID_PROJECT_DISPLAY_NAME"
        );
        assert_eq!(
            read_workspace_index_file(&root.path().join("workspace-index.json"))
                .unwrap()
                .generation,
            1
        );
    }

    #[cfg(windows)]
    #[test]
    fn workspace_index_junction_warns_without_hiding_or_traversing_projects() {
        let root = tempdir().unwrap();
        create_project_at(
            root.path(),
            request_for("dbx:project:junction-safe", 0, 0, 608),
        )
        .unwrap();
        let foreign = root.path().join("foreign-workspace-index");
        fs::create_dir_all(&foreign).unwrap();
        fs::write(foreign.join("foreign-note.txt"), b"preserve me").unwrap();
        let junction = root.path().join("workspace-index.json");
        let status = std::process::Command::new("cmd.exe")
            .args(["/D", "/C", "mklink", "/J"])
            .arg(&junction)
            .arg(&foreign)
            .status()
            .unwrap();
        assert!(status.success());
        let catalog = list_projects_at(root.path()).unwrap();
        assert_eq!(catalog.entries[0].status, "PASS");
        assert_eq!(
            catalog.workspace_metadata_warning.as_deref(),
            Some("PROJECT_PATH_REPARSE_POINT")
        );
        assert_eq!(
            fs::read(foreign.join("foreign-note.txt")).unwrap(),
            b"preserve me"
        );
    }

    #[test]
    fn rejects_unsupported_or_tampered_scene_content() {
        let root = tempdir().unwrap();
        let mut invalid = request(0, 0, 608);
        invalid.scenes_json[0] = invalid.scenes_json[0].replace("0.1.0", "9.0.0");
        assert_eq!(
            save_project_at(root.path(), invalid).unwrap_err().code,
            "UNSUPPORTED_SCENE_SCHEMA"
        );
        let mut duplicate = request(0, 0, 608);
        duplicate.scenes_json[0] =
            duplicate.scenes_json[0].replace("]}", ",{\"id\":\"dbx:apparatus:core\"}]}");
        assert!(save_project_at(root.path(), duplicate).is_err());

        let mut duplicate_scenes = request(0, 0, 608);
        duplicate_scenes.scenes_json.push(scene(0, 608));
        assert_eq!(
            save_project_at(root.path(), duplicate_scenes)
                .unwrap_err()
                .code,
            "DUPLICATE_SCENE_ID"
        );

        let mut invalid_active = request(0, 0, 608);
        invalid_active.active_scene_id = "dbx:scene:missing".to_string();
        assert_eq!(
            save_project_at(root.path(), invalid_active)
                .unwrap_err()
                .code,
            "INVALID_ACTIVE_SCENE"
        );
    }

    #[test]
    fn previews_current_older_and_unknown_migrations_without_writing() {
        assert_eq!(preview_project_migration("0.2.0").status, "preview-only");
        assert!(preview_project_migration("0.1.0")
            .actions
            .contains(&"preserve-semantic-scene".to_string()));
        let newer = preview_project_migration("2.0.0");
        assert_eq!(newer.status, "blocked");
        assert!(newer.no_write);
    }

    #[test]
    fn explains_current_and_supported_project_migrations_without_writing() {
        let root = tempdir().unwrap();
        save_project_at(root.path(), request(0, 0, 608)).unwrap();
        let project_id = "dbx:project:desktop-fixture";
        let (primary, _, _) = project_paths(root.path(), project_id).unwrap();
        let current_bytes = fs::read(&primary).unwrap();
        let current = explain_project_migration_at(
            root.path(),
            ProjectMigrationExplanationRequest {
                schema_version: PROJECT_SCHEMA_VERSION.to_string(),
                project_id: project_id.to_string(),
            },
        )
        .unwrap();
        assert_eq!(current.status, "preview-only");
        assert_eq!(
            current.authoritative_source.as_deref(),
            Some("project.json")
        );
        assert_eq!(current.source_schema_version.as_deref(), Some("0.3.0"));
        assert_eq!(current.actions, vec!["retain-current-envelope"]);
        assert!(current.no_write && current.no_foundry_write);
        assert_eq!(fs::read(&primary).unwrap(), current_bytes);

        let mut multi = read_envelope(&primary).unwrap().envelope;
        multi.schema_version = MULTI_SCENE_PROJECT_SCHEMA_VERSION.to_string();
        multi.content_sha256 = multi_scene_legacy_content_hash(&multi);
        let multi_bytes = serde_json::to_vec(&multi).unwrap();
        fs::write(&primary, &multi_bytes).unwrap();
        let multi_explanation = explain_project_migration_at(
            root.path(),
            ProjectMigrationExplanationRequest {
                schema_version: PROJECT_SCHEMA_VERSION.to_string(),
                project_id: project_id.to_string(),
            },
        )
        .unwrap();
        assert_eq!(
            multi_explanation.source_schema_version.as_deref(),
            Some("0.2.0")
        );
        assert_eq!(
            multi_explanation.actions,
            vec![
                "add-asset-registration-boundary-in-memory",
                "preserve-scenes-and-assets",
                "write-only-on-explicit-save",
            ]
        );
        assert_eq!(fs::read(&primary).unwrap(), multi_bytes);

        let mut single = LegacyProjectEnvelope {
            schema_version: LEGACY_PROJECT_SCHEMA_VERSION.to_string(),
            project_id: multi.project_id,
            generation: multi.generation,
            scene_json: multi.scenes[0].scene_json.clone(),
            scene_sha256: multi.scenes[0].scene_sha256.clone(),
            assets: multi.assets,
            content_sha256: String::new(),
        };
        single.content_sha256 = legacy_content_hash(&single);
        let single_bytes = serde_json::to_vec(&single).unwrap();
        fs::write(&primary, &single_bytes).unwrap();
        let single_explanation = explain_project_migration_at(
            root.path(),
            ProjectMigrationExplanationRequest {
                schema_version: PROJECT_SCHEMA_VERSION.to_string(),
                project_id: project_id.to_string(),
            },
        )
        .unwrap();
        assert_eq!(
            single_explanation.source_schema_version.as_deref(),
            Some("0.1.0")
        );
        assert_eq!(
            single_explanation.actions,
            vec![
                "wrap-single-scene-in-memory",
                "preserve-semantic-scene",
                "write-only-on-explicit-save",
            ]
        );
        assert_eq!(fs::read(&primary).unwrap(), single_bytes);
    }

    #[test]
    fn explains_backup_authority_and_blocks_unvalidated_project_state() {
        let root = tempdir().unwrap();
        let project_id = "dbx:project:desktop-fixture";
        let first = save_project_at(root.path(), request(0, 0, 608)).unwrap();
        save_project_at(root.path(), request(1, 1, 616)).unwrap();
        let (primary, backup, _) = project_paths(root.path(), project_id).unwrap();
        let backup_bytes = fs::read(&backup).unwrap();
        fs::write(&primary, b"corrupt primary").unwrap();
        let primary_bytes = fs::read(&primary).unwrap();
        let recovered = explain_project_migration_at(
            root.path(),
            ProjectMigrationExplanationRequest {
                schema_version: PROJECT_SCHEMA_VERSION.to_string(),
                project_id: project_id.to_string(),
            },
        )
        .unwrap();
        assert_eq!(
            recovered.authoritative_source.as_deref(),
            Some("project.backup.json")
        );
        assert_eq!(
            recovered.content_sha256.as_deref(),
            Some(first.content_sha256.as_str())
        );
        assert_eq!(recovered.primary.status, "BLOCKED");
        assert_eq!(recovered.backup.status, "VALID");
        assert_eq!(fs::read(&primary).unwrap(), primary_bytes);
        assert_eq!(fs::read(&backup).unwrap(), backup_bytes);

        let mut unsupported: Value = serde_json::from_slice(&backup_bytes).unwrap();
        unsupported["schemaVersion"] = Value::String("9.0.0".to_string());
        let unsupported_bytes = serde_json::to_vec(&unsupported).unwrap();
        fs::write(&primary, &unsupported_bytes).unwrap();
        fs::remove_file(&backup).unwrap();
        let blocked = explain_project_migration_at(
            root.path(),
            ProjectMigrationExplanationRequest {
                schema_version: PROJECT_SCHEMA_VERSION.to_string(),
                project_id: project_id.to_string(),
            },
        )
        .unwrap();
        assert_eq!(blocked.status, "blocked");
        assert_eq!(blocked.authoritative_source, None);
        assert_eq!(blocked.source_schema_version.as_deref(), Some("9.0.0"));
        assert_eq!(blocked.primary.migration_status.as_deref(), Some("blocked"));
        assert!(blocked
            .actions
            .contains(&"preserve-unknown-project".to_string()));
        assert!(blocked
            .blockers
            .iter()
            .any(|value| value.contains("Unsupported or newer")));
        assert_eq!(fs::read(&primary).unwrap(), unsupported_bytes);
        assert!(!backup.exists());
    }

    #[test]
    fn migration_explanation_rejects_identity_mismatch_without_caller_authority() {
        let root = tempdir().unwrap();
        let project_id = "dbx:project:desktop-fixture";
        save_project_at(root.path(), request(0, 0, 608)).unwrap();
        let (primary, _, _) = project_paths(root.path(), project_id).unwrap();
        let mut envelope = read_envelope(&primary).unwrap().envelope;
        envelope.project_id = "dbx:project:different-project".to_string();
        envelope.content_sha256 = content_hash(&envelope);
        let mismatched_bytes = serde_json::to_vec(&envelope).unwrap();
        fs::write(&primary, &mismatched_bytes).unwrap();
        let blocked = explain_project_migration_at(
            root.path(),
            ProjectMigrationExplanationRequest {
                schema_version: PROJECT_SCHEMA_VERSION.to_string(),
                project_id: project_id.to_string(),
            },
        )
        .unwrap();
        assert_eq!(blocked.status, "blocked");
        assert_eq!(blocked.authoritative_source, None);
        assert!(blocked
            .blockers
            .iter()
            .any(|value| value.contains("identity")));
        assert_eq!(fs::read(&primary).unwrap(), mismatched_bytes);
    }

    #[test]
    fn migration_explanation_blocks_both_invalid_files_and_invalid_project_ids() {
        let root = tempdir().unwrap();
        let project_id = "dbx:project:both-invalid";
        let (primary, backup, project_dir) = project_paths(root.path(), project_id).unwrap();
        fs::create_dir_all(&project_dir).unwrap();
        fs::write(&primary, b"invalid primary").unwrap();
        fs::write(&backup, b"invalid backup").unwrap();
        let primary_bytes = fs::read(&primary).unwrap();
        let backup_bytes = fs::read(&backup).unwrap();

        let blocked = explain_project_migration_at(
            root.path(),
            ProjectMigrationExplanationRequest {
                schema_version: PROJECT_SCHEMA_VERSION.to_string(),
                project_id: project_id.to_string(),
            },
        )
        .unwrap();
        assert_eq!(blocked.status, "blocked");
        assert_eq!(blocked.authoritative_source, None);
        assert_eq!(blocked.primary.status, "BLOCKED");
        assert_eq!(blocked.backup.status, "BLOCKED");
        assert_eq!(blocked.retry, "after-reread");
        assert!(blocked.no_write && blocked.no_foundry_write);
        assert_eq!(fs::read(&primary).unwrap(), primary_bytes);
        assert_eq!(fs::read(&backup).unwrap(), backup_bytes);

        let invalid = explain_project_migration_at(
            root.path(),
            ProjectMigrationExplanationRequest {
                schema_version: PROJECT_SCHEMA_VERSION.to_string(),
                project_id: "dbx:project:../escape".to_string(),
            },
        )
        .unwrap_err();
        assert_eq!(invalid.code, "INVALID_PROJECT_ID");
        assert_eq!(invalid.retry, "never");
        assert!(invalid.no_foundry_write);
    }

    #[test]
    fn previews_and_commits_exact_one_broken_reference_preserving_handout_state() {
        let root = tempdir().unwrap();
        let fixture = prepare_broken_reference_detach_fixture_at(root.path()).unwrap();
        let (primary, backup, project_dir) = project_paths(root.path(), &fixture.project_id).unwrap();
        let primary_before = fs::read(&primary).unwrap();
        let foreign = project_dir.join("foreign-note.txt");
        fs::write(&foreign, b"preserve M241 foreign state").unwrap();
        let workspace_before = fs::read(root.path().join("workspace-index.json")).unwrap();
        let inspection = inspect_project_recovery_at(root.path(), ProjectRecoveryInspectionRequest { schema_version: PROJECT_SCHEMA_VERSION.to_string(), project_id: fixture.project_id.clone() }).unwrap();
        let reference = inspection.broken_scene_references.iter().find(|value| value.source.ends_with("/project.json")).unwrap();
        let preview = preview_broken_reference_detach_at(root.path(), BrokenReferenceDetachPreviewRequest { schema_version: PROJECT_SCHEMA_VERSION.to_string(), project_id: fixture.project_id.clone(), scene_id: reference.scene_id.clone(), asset_id: reference.asset_id.clone(), blocker_code: reference.blocker_code.clone() }).unwrap();
        assert!(preview.no_write && preview.no_foundry_write && preview.asset_descriptor_preserved);
        assert_eq!(fs::read(&primary).unwrap(), primary_before);
        let not_approved = detach_broken_reference_at(root.path(), BrokenReferenceDetachRequest { schema_version: PROJECT_SCHEMA_VERSION.to_string(), project_id: fixture.project_id.clone(), scene_id: reference.scene_id.clone(), asset_id: reference.asset_id.clone(), blocker_code: reference.blocker_code.clone(), preview_sha256: preview.preview_sha256.clone(), approved: false }).unwrap_err();
        assert_eq!(not_approved.code, "BROKEN_REFERENCE_NOT_APPROVED");
        let receipt = detach_broken_reference_at(root.path(), BrokenReferenceDetachRequest { schema_version: PROJECT_SCHEMA_VERSION.to_string(), project_id: fixture.project_id.clone(), scene_id: reference.scene_id.clone(), asset_id: reference.asset_id.clone(), blocker_code: reference.blocker_code.clone(), preview_sha256: preview.preview_sha256, approved: true }).unwrap();
        assert!(receipt.asset_descriptor_preserved && receipt.target_binding_absent && receipt.unrelated_references_unchanged && receipt.authoritative_inspection && receipt.no_foundry_write);
        assert_eq!(receipt.generation, 2);
        assert_eq!(fs::read(&backup).unwrap(), primary_before);
        assert_eq!(fs::read(root.path().join("workspace-index.json")).unwrap(), workspace_before);
        assert_eq!(fs::read(&foreign).unwrap(), b"preserve M241 foreign state");
        let loaded = load_project_at(root.path(), load_request(&fixture.project_id)).unwrap();
        assert_eq!(loaded.assets.len(), 1);
        assert_eq!(loaded.assets[0].registration.as_ref().unwrap().role, "handout");
        assert!(loaded.scenes_json.iter().all(|scene| scene_background_asset_id(scene).unwrap().is_none()));
        assert!(!backup.as_os_str().is_empty());
    }

    #[test]
    fn broken_reference_ui_lifecycle_fixture_is_distinct_and_refuses_overwrite() {
        let root = tempdir().unwrap();
        let fixture = prepare_broken_reference_ui_lifecycle_fixture_at(root.path()).unwrap();
        assert_eq!(fixture.project_id, BROKEN_REFERENCE_UI_LIFECYCLE_SELF_TEST_PROJECT_ID);
        assert_eq!(fixture.scene_ids.len(), 2);
        let (primary, backup, project_dir) = project_paths(root.path(), &fixture.project_id).unwrap();
        let primary_before = fs::read(&primary).unwrap();
        let blob = root.path().join("assets").join("sha256").join(&fixture.asset_sha256);
        let blob_before = fs::read(&blob).unwrap();
        let workspace_before = fs::read(root.path().join("workspace-index.json")).unwrap();
        let inspection = inspect_project_recovery_at(root.path(), ProjectRecoveryInspectionRequest {
            schema_version: PROJECT_SCHEMA_VERSION.to_string(),
            project_id: fixture.project_id.clone(),
        }).unwrap();
        assert_eq!(inspection.status, "BLOCKED");
        assert!(inspection.generation.is_none());
        assert_eq!(inspection.backup.status, "MISSING");
        assert_eq!(inspection.broken_scene_references.len(), 1);
        assert_eq!(inspection.broken_scene_references[0].blocker_code, "BACKGROUND_ASSET_ROLE_MISMATCH");
        assert_eq!(inspection.broken_scene_references[0].scene_id, fixture.scene_ids[0]);
        assert_eq!(inspection.broken_scene_references[0].asset_id, fixture.asset_id);
        assert!(inspection.no_write && inspection.no_foundry_write);
        let second = prepare_broken_reference_ui_lifecycle_fixture_at(root.path()).unwrap();
        assert_eq!(second, fixture);
        assert_eq!(fs::read(&primary).unwrap(), primary_before);
        assert_eq!(fs::read(&blob).unwrap(), blob_before);
        assert_eq!(fs::read(root.path().join("workspace-index.json")).unwrap(), workspace_before);
        assert!(!backup.exists());
        assert_eq!(fs::read_dir(&project_dir).unwrap().count(), 1);
        fs::write(&primary, b"m510-drift").unwrap();
        let drift = prepare_broken_reference_ui_lifecycle_fixture_at(root.path()).unwrap_err();
        assert_eq!(drift.code, "PROJECT_FIXTURE_EXISTS");
    }

    #[cfg(windows)]
    #[test]
    fn broken_reference_ui_lifecycle_fixture_rejects_reparse_primary() {
        let root = tempdir().unwrap();
        let fixture = prepare_broken_reference_ui_lifecycle_fixture_at(root.path()).unwrap();
        let (primary, backup, _) = project_paths(root.path(), &fixture.project_id).unwrap();
        let foreign = root.path().join("foreign-primary");
        fs::create_dir_all(&foreign).unwrap();
        fs::remove_file(&primary).unwrap();
        let status = std::process::Command::new("cmd.exe")
            .args(["/D", "/C", "mklink", "/J"])
            .arg(&primary)
            .arg(&foreign)
            .status()
            .unwrap();
        assert!(status.success());

        let blocked = prepare_broken_reference_ui_lifecycle_fixture_at(root.path()).unwrap_err();
        assert_eq!(blocked.code, "PROJECT_FIXTURE_EXISTS");
        assert!(!backup.exists());
        assert_eq!(fs::read_dir(&foreign).unwrap().count(), 0);
        fs::remove_dir(&primary).unwrap();
    }

    #[test]
    fn previews_approves_and_rereads_supported_legacy_migration_persistence() {
        let root = tempdir().unwrap();
        let fixture = prepare_legacy_migration_persistence_fixture_at(root.path()).unwrap();
        let (primary, backup, project_dir) = project_paths(root.path(), &fixture.project_id).unwrap();
        let legacy_primary = fs::read(&primary).unwrap();
        let workspace_before = fs::read(root.path().join("workspace-index.json")).unwrap();
        let foreign = project_dir.join("foreign-note.txt");
        let foreign_before = fs::read(&foreign).unwrap();
        let preview = preview_project_migration_persist_at(
            root.path(),
            ProjectMigrationPersistPreviewRequest {
                schema_version: PROJECT_SCHEMA_VERSION.to_string(),
                project_id: fixture.project_id.clone(),
            },
        )
        .unwrap();
        assert_eq!(preview.source_schema_version, "0.2.0");
        assert_eq!(preview.target_schema_version, "0.3.0");
        assert_eq!(preview.generation, 1);
        assert_eq!(preview.next_generation, 2);
        assert_eq!(preview.scenes.len(), 2);
        assert!(preview.requires_approval && preview.no_write && preview.no_foundry_write);
        assert_eq!(fs::read(&primary).unwrap(), legacy_primary);
        assert!(!backup.exists());

        let denied = persist_project_migration_at(
            root.path(),
            ProjectMigrationPersistRequest {
                schema_version: PROJECT_SCHEMA_VERSION.to_string(),
                project_id: fixture.project_id.clone(),
                source_schema_version: preview.source_schema_version.clone(),
                generation: preview.generation,
                persisted_content_sha256: preview.persisted_content_sha256.clone(),
                resulting_content_sha256: preview.resulting_content_sha256.clone(),
                preview_sha256: preview.preview_sha256.clone(),
                approved: false,
            },
        )
        .unwrap_err();
        assert_eq!(denied.code, "MIGRATION_NOT_APPROVED");
        assert_eq!(fs::read(&primary).unwrap(), legacy_primary);

        let receipt = persist_project_migration_at(
            root.path(),
            ProjectMigrationPersistRequest {
                schema_version: PROJECT_SCHEMA_VERSION.to_string(),
                project_id: fixture.project_id.clone(),
                source_schema_version: preview.source_schema_version.clone(),
                generation: preview.generation,
                persisted_content_sha256: preview.persisted_content_sha256.clone(),
                resulting_content_sha256: preview.resulting_content_sha256.clone(),
                preview_sha256: preview.preview_sha256.clone(),
                approved: true,
            },
        )
        .unwrap();
        assert_eq!(receipt.previous_generation, 1);
        assert_eq!(receipt.generation, 2);
        assert_eq!(receipt.previous_content_sha256, fixture.persisted_content_sha256);
        assert_eq!(receipt.content_sha256, preview.resulting_content_sha256);
        assert!(receipt.semantic_state_unchanged);
        assert!(receipt.asset_tree_unchanged);
        assert!(receipt.workspace_unchanged);
        assert!(receipt.foreign_state_unchanged);
        assert!(receipt.backup_preserves_legacy_primary);
        assert!(receipt.authoritative_current_reread);
        assert!(receipt.directory_entry_sync);
        assert!(receipt.no_foundry_write);
        assert_eq!(fs::read(&backup).unwrap(), legacy_primary);
        assert_eq!(fs::read(root.path().join("workspace-index.json")).unwrap(), workspace_before);
        assert_eq!(fs::read(&foreign).unwrap(), foreign_before);
        let loaded = load_project_at(root.path(), load_request(&fixture.project_id)).unwrap();
        assert_eq!(loaded.receipt.migration_status, "current");
        assert_eq!(loaded.receipt.generation, 2);
        assert_eq!(loaded.receipt.scene_count, 2);
        assert_eq!(loaded.receipt.active_scene_id, fixture.scene_ids[1]);
        let backup_read = read_envelope(&backup).unwrap();
        assert_eq!(backup_read.source_schema_version, "0.2.0");
        assert_eq!(backup_read.persisted_content_sha256, fixture.persisted_content_sha256);

        let single_root = tempdir().unwrap();
        let single_project = "dbx:project:legacy-single-migration";
        create_project_at(single_root.path(), request_for(single_project, 0, 0, 608)).unwrap();
        let (single_primary, single_backup, single_dir) = project_paths(single_root.path(), single_project).unwrap();
        let current = read_envelope(&single_primary).unwrap().envelope;
        let mut single = LegacyProjectEnvelope {
            schema_version: LEGACY_PROJECT_SCHEMA_VERSION.to_string(),
            project_id: current.project_id,
            generation: current.generation,
            scene_json: current.scenes[0].scene_json.clone(),
            scene_sha256: current.scenes[0].scene_sha256.clone(),
            assets: current.assets,
            content_sha256: String::new(),
        };
        single.content_sha256 = legacy_content_hash(&single);
        let single_legacy_bytes = serde_json::to_vec(&single).unwrap();
        fs::write(&single_primary, &single_legacy_bytes).unwrap();
        fs::write(single_dir.join("foreign-single.txt"), b"preserve single foreign").unwrap();
        let single_preview = preview_project_migration_persist_at(
            single_root.path(),
            ProjectMigrationPersistPreviewRequest {
                schema_version: PROJECT_SCHEMA_VERSION.to_string(),
                project_id: single_project.to_string(),
            },
        )
        .unwrap();
        assert_eq!(single_preview.source_schema_version, "0.1.0");
        assert_eq!(single_preview.scenes.len(), 1);
        assert!(single_preview.actions.contains(&"wrap-single-scene-in-memory".to_string()));
        let single_receipt = persist_project_migration_at(
            single_root.path(),
            ProjectMigrationPersistRequest {
                schema_version: PROJECT_SCHEMA_VERSION.to_string(),
                project_id: single_project.to_string(),
                source_schema_version: single_preview.source_schema_version.clone(),
                generation: single_preview.generation,
                persisted_content_sha256: single_preview.persisted_content_sha256.clone(),
                resulting_content_sha256: single_preview.resulting_content_sha256.clone(),
                preview_sha256: single_preview.preview_sha256,
                approved: true,
            },
        )
        .unwrap();
        assert!(single_receipt.semantic_state_unchanged && single_receipt.backup_preserves_legacy_primary);
        assert_eq!(fs::read(&single_backup).unwrap(), single_legacy_bytes);
        assert_eq!(fs::read(single_dir.join("foreign-single.txt")).unwrap(), b"preserve single foreign");
        assert_eq!(load_project_at(single_root.path(), load_request(single_project)).unwrap().receipt.migration_status, "current");
    }

    #[test]
    fn migration_persistence_blocks_stale_current_unsupported_and_backup_authority() {
        let current_root = tempdir().unwrap();
        save_project_at(current_root.path(), request(0, 0, 608)).unwrap();
        assert_eq!(
            preview_project_migration_persist_at(
                current_root.path(),
                ProjectMigrationPersistPreviewRequest {
                    schema_version: PROJECT_SCHEMA_VERSION.to_string(),
                    project_id: "dbx:project:desktop-fixture".to_string(),
                },
            )
            .unwrap_err()
            .code,
            "MIGRATION_NOT_REQUIRED"
        );

        let unsupported_root = tempdir().unwrap();
        save_project_at(unsupported_root.path(), request(0, 0, 608)).unwrap();
        let (unsupported_primary, _, _) = project_paths(unsupported_root.path(), "dbx:project:desktop-fixture").unwrap();
        let mut unsupported: Value = serde_json::from_slice(&fs::read(&unsupported_primary).unwrap()).unwrap();
        unsupported["schemaVersion"] = Value::String("9.0.0".to_string());
        fs::write(&unsupported_primary, serde_json::to_vec(&unsupported).unwrap()).unwrap();
        assert_eq!(
            preview_project_migration_persist_at(
                unsupported_root.path(),
                ProjectMigrationPersistPreviewRequest {
                    schema_version: PROJECT_SCHEMA_VERSION.to_string(),
                    project_id: "dbx:project:desktop-fixture".to_string(),
                },
            )
            .unwrap_err()
            .code,
            "UNSUPPORTED_PROJECT_SCHEMA"
        );

        let backup_root = tempdir().unwrap();
        let fixture = prepare_legacy_migration_persistence_fixture_at(backup_root.path()).unwrap();
        let (backup_primary, backup_path, _) = project_paths(backup_root.path(), &fixture.project_id).unwrap();
        fs::write(&backup_path, fs::read(&backup_primary).unwrap()).unwrap();
        assert_eq!(
            preview_project_migration_persist_at(
                backup_root.path(),
                ProjectMigrationPersistPreviewRequest {
                    schema_version: PROJECT_SCHEMA_VERSION.to_string(),
                    project_id: fixture.project_id,
                },
            )
            .unwrap_err()
            .code,
            "MIGRATION_BACKUP_PRESENT"
        );

        let stale_root = tempdir().unwrap();
        let stale_fixture = prepare_legacy_migration_persistence_fixture_at(stale_root.path()).unwrap();
        let stale_preview = preview_project_migration_persist_at(
            stale_root.path(),
            ProjectMigrationPersistPreviewRequest {
                schema_version: PROJECT_SCHEMA_VERSION.to_string(),
                project_id: stale_fixture.project_id.clone(),
            },
        )
        .unwrap();
        let (stale_primary, _, _) = project_paths(stale_root.path(), &stale_fixture.project_id).unwrap();
        let mut stale_envelope: ProjectEnvelope = serde_json::from_slice(&fs::read(&stale_primary).unwrap()).unwrap();
        stale_envelope.generation += 1;
        stale_envelope.content_sha256 = multi_scene_legacy_content_hash(&stale_envelope);
        fs::write(&stale_primary, serde_json::to_vec(&stale_envelope).unwrap()).unwrap();
        assert_eq!(
            persist_project_migration_at(
                stale_root.path(),
                ProjectMigrationPersistRequest {
                    schema_version: PROJECT_SCHEMA_VERSION.to_string(),
                    project_id: stale_fixture.project_id,
                    source_schema_version: stale_preview.source_schema_version,
                    generation: stale_preview.generation,
                    persisted_content_sha256: stale_preview.persisted_content_sha256,
                    resulting_content_sha256: stale_preview.resulting_content_sha256,
                    preview_sha256: stale_preview.preview_sha256,
                    approved: true,
                },
            )
            .unwrap_err()
            .code,
            "STALE_MIGRATION_PREVIEW"
        );
    }

    #[cfg(windows)]
    #[test]
    fn migration_explanation_returns_a_blocked_receipt_for_a_project_junction() {
        let root = tempdir().unwrap();
        let projects = root.path().join("projects");
        let foreign = root.path().join("foreign-project-content");
        fs::create_dir_all(&projects).unwrap();
        fs::create_dir_all(&foreign).unwrap();
        fs::write(foreign.join("foreign-note.txt"), b"preserve me").unwrap();
        let project_id = "dbx:project:junction-explanation";
        let junction = projects.join("junction-explanation");
        let status = std::process::Command::new("cmd.exe")
            .args(["/D", "/C", "mklink", "/J"])
            .arg(&junction)
            .arg(&foreign)
            .status()
            .unwrap();
        assert!(status.success());

        let blocked = explain_project_migration_at(
            root.path(),
            ProjectMigrationExplanationRequest {
                schema_version: PROJECT_SCHEMA_VERSION.to_string(),
                project_id: project_id.to_string(),
            },
        )
        .unwrap();
        assert_eq!(blocked.status, "blocked");
        assert_eq!(blocked.authoritative_source, None);
        assert_eq!(
            blocked.primary.blocker_code.as_deref(),
            Some("PROJECT_PATH_REPARSE_POINT")
        );
        assert_eq!(
            blocked.backup.blocker_code.as_deref(),
            Some("PROJECT_PATH_REPARSE_POINT")
        );
        assert_eq!(blocked.retry, "never");
        assert!(blocked.no_write && blocked.no_foundry_write);
        assert_eq!(
            fs::read(foreign.join("foreign-note.txt")).unwrap(),
            b"preserve me"
        );
    }

    #[test]
    fn cross_producer_transition_keeps_the_committed_binding_in_the_backup() {
        let root = tempdir().unwrap();
        let project_id = CROSS_PRODUCER_COMMIT_RECOVERY_SELF_TEST_PROJECT_ID;
        let scene_id = "dbx:scene:cross-producer-recovery-main";
        let initial_scene = format!(
            r#"{{"schemaVersion":"0.1.0","revision":0,"id":"{scene_id}","name":"Cross Producer Recovery","width":1536,"height":1024,"background":{{"color":1,"gridSize":64}},"entities":[]}}"#
        );
        let created = create_project_at(
            root.path(),
            SaveProjectRequest {
                schema_version: PROJECT_SCHEMA_VERSION.to_string(),
                project_id: project_id.to_string(),
                expected_generation: 0,
                scenes_json: vec![initial_scene.clone()],
                active_scene_id: scene_id.to_string(),
                assets: None,
                expected_workspace_generation: None,
                workspace_display_name: Some("M870 cross-producer recovery".to_string()),
            },
        )
        .unwrap();
        assert_eq!(created.generation, 1);
        let (_bytes, asset_id, asset) = registered_png();
        let bound_scene = bind_scene(&initial_scene, &asset_id);
        let bound = save_project_at(
            root.path(),
            SaveProjectRequest {
                schema_version: PROJECT_SCHEMA_VERSION.to_string(),
                project_id: project_id.to_string(),
                expected_generation: 1,
                scenes_json: vec![bound_scene],
                active_scene_id: scene_id.to_string(),
                assets: Some(vec![asset]),
                expected_workspace_generation: None,
                workspace_display_name: None,
            },
        )
        .unwrap();
        assert_eq!(bound.generation, 2);
        let transition = prepare_cross_producer_recovery_transition_at(
            root.path(),
            project_id,
            bound.generation,
            &bound.content_sha256,
        )
        .unwrap();
        assert_eq!(transition.before_generation, 2);
        assert_eq!(transition.committed_generation, 3);
        assert_eq!(transition.backup_generation, 2);
        assert_eq!(transition.content_sha256, bound.content_sha256);
        assert_ne!(transition.primary_content_sha256, bound.content_sha256);
        assert!(transition.primary_removed && transition.no_foundry_write);
        let (primary, backup, project_dir) = project_paths(root.path(), project_id).unwrap();
        assert!(!primary.exists());
        assert!(backup.is_file());
        assert_eq!(read_envelope(&backup).unwrap().envelope.generation, 2);
        assert_eq!(fs::read(project_dir.join(BACKUP_RECOVERY_FOREIGN_NOTE_FILE)).unwrap(), BACKUP_RECOVERY_FOREIGN_NOTE_BYTES);
    }

    #[test]
    fn native_cross_producer_commit_and_recovery_conformance_restores_the_bound_project() {
        let root = tempdir().unwrap();
        let project_id = CROSS_PRODUCER_COMMIT_RECOVERY_SELF_TEST_PROJECT_ID;
        let scene_id = "dbx:scene:cross-producer-conformance-main";
        let initial_scene = format!(
            r#"{{"schemaVersion":"0.1.0","revision":0,"id":"{scene_id}","name":"Cross Producer Conformance","width":1536,"height":1024,"background":{{"color":1,"gridSize":64}},"entities":[]}}"#
        );
        let created = create_project_at(
            root.path(),
            SaveProjectRequest {
                schema_version: PROJECT_SCHEMA_VERSION.to_string(),
                project_id: project_id.to_string(),
                expected_generation: 0,
                scenes_json: vec![initial_scene.clone()],
                active_scene_id: scene_id.to_string(),
                assets: None,
                expected_workspace_generation: None,
                workspace_display_name: Some("M874 native cross-producer conformance".to_string()),
            },
        )
        .unwrap();
        assert_eq!(created.generation, 1);

        let (_bytes, asset_id, asset) = registered_png();
        let bound = save_project_at(
            root.path(),
            SaveProjectRequest {
                schema_version: PROJECT_SCHEMA_VERSION.to_string(),
                project_id: project_id.to_string(),
                expected_generation: created.generation,
                scenes_json: vec![bind_scene(&initial_scene, &asset_id)],
                active_scene_id: scene_id.to_string(),
                assets: Some(vec![asset]),
                expected_workspace_generation: None,
                workspace_display_name: None,
            },
        )
        .unwrap();
        assert_eq!(bound.generation, 2);
        assert_eq!(bound.asset_count, 1);

        let transition = prepare_cross_producer_recovery_transition_at(
            root.path(),
            project_id,
            bound.generation,
            &bound.content_sha256,
        )
        .unwrap();
        assert_eq!(transition.before_generation, 2);
        assert_eq!(transition.committed_generation, 3);
        assert_eq!(transition.backup_generation, 2);
        assert_eq!(transition.content_sha256, bound.content_sha256);
        assert_ne!(transition.primary_content_sha256, bound.content_sha256);
        assert!(transition.primary_removed);
        assert!(transition.no_foundry_write);

        let inspected = inspect_project_recovery_at(
            root.path(),
            ProjectRecoveryInspectionRequest {
                schema_version: PROJECT_SCHEMA_VERSION.to_string(),
                project_id: project_id.to_string(),
            },
        )
        .unwrap();
        assert_eq!(inspected.status, "PASS");
        assert_eq!(inspected.primary.status, "MISSING");
        assert_eq!(inspected.backup.status, "VALID");
        assert_eq!(inspected.generation, Some(2));
        assert_eq!(inspected.content_sha256, Some(bound.content_sha256.clone()));
        assert!(inspected.no_write && inspected.no_foundry_write);

        let preview = preview_backup_authoritative_recovery_at(
            root.path(),
            BackupRecoveryPromotionPreviewRequest {
                schema_version: PROJECT_SCHEMA_VERSION.to_string(),
                project_id: project_id.to_string(),
            },
        )
        .unwrap();
        assert_eq!(preview.status, "PREVIEW");
        assert_eq!(preview.primary.status, "MISSING");
        assert_eq!(preview.backup.status, "VALID");
        assert_eq!(preview.generation, 2);
        assert_eq!(preview.content_sha256, bound.content_sha256);
        assert_eq!(preview.asset_count, 1);
        assert!(preview.requires_approval && preview.no_write && preview.no_foundry_write);

        let recovered = promote_backup_authoritative_recovery_at(
            root.path(),
            BackupRecoveryPromotionRequest {
                schema_version: PROJECT_SCHEMA_VERSION.to_string(),
                project_id: project_id.to_string(),
                generation: preview.generation,
                content_sha256: preview.content_sha256.clone(),
                backup_byte_sha256: preview.backup_byte_sha256.clone(),
                protected_state_sha256: preview.protected_state_sha256.clone(),
                asset_tree_sha256: preview.asset_tree_sha256.clone(),
                preview_sha256: preview.preview_sha256.clone(),
                approved: true,
            },
        )
        .unwrap();
        assert_eq!(recovered.status, "PASS");
        assert_eq!(recovered.project_id, project_id);
        assert_eq!(recovered.generation, 2);
        assert_eq!(recovered.content_sha256, bound.content_sha256);
        assert_eq!(recovered.asset_count, 1);
        assert!(recovered.primary_restored);
        assert!(recovered.backup_unchanged);
        assert!(recovered.semantic_state_unchanged);
        assert!(recovered.asset_tree_unchanged);
        assert!(recovered.workspace_unchanged);
        assert!(recovered.foreign_state_unchanged);
        assert!(recovered.authoritative_current_reread);
        assert!(recovered.no_foundry_write);

        let final_load = load_project_at(
            root.path(),
            LoadProjectRequest {
                schema_version: PROJECT_SCHEMA_VERSION.to_string(),
                project_id: project_id.to_string(),
                expected_workspace_generation: None,
            },
        )
        .unwrap();
        assert_eq!(final_load.receipt.generation, 2);
        assert_eq!(final_load.receipt.content_sha256, bound.content_sha256);
        assert_eq!(final_load.assets.len(), 1);
        assert_eq!(final_load.assets[0].sha256, asset_id.strip_prefix("dbx:asset:sha256-").unwrap());
        assert!(final_load.receipt.recovered_from.is_none());
        assert!(final_load.receipt.no_foundry_write);

        let (primary, backup, project_dir) = project_paths(root.path(), project_id).unwrap();
        assert!(primary.is_file());
        assert!(backup.is_file());
        assert_eq!(read_envelope(&primary).unwrap().envelope.generation, 2);
        assert_eq!(read_envelope(&backup).unwrap().envelope.generation, 2);
        assert_eq!(read_envelope(&primary).unwrap().persisted_content_sha256, bound.content_sha256);
        assert_eq!(read_envelope(&backup).unwrap().persisted_content_sha256, bound.content_sha256);
        assert_eq!(fs::read(project_dir.join(BACKUP_RECOVERY_FOREIGN_NOTE_FILE)).unwrap(), BACKUP_RECOVERY_FOREIGN_NOTE_BYTES);
    }
}
