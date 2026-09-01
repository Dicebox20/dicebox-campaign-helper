import { invoke } from "@tauri-apps/api/core";
import { serializeSceneDocument, type SceneDocument } from "@dicebox/scene";

export const FOUNDATION_SELF_TEST_PROJECT_ID = "dbx:project:desktop-foundation-self-test";

export type ProjectAssetRole = "background" | "handout" | "audio" | "token";

export type StoredAsset = Readonly<{
  sha256: string;
  mediaType: string;
  byteLength: number;
  relativePath: string;
  registration?: Readonly<{
    assetId: string;
    role: ProjectAssetRole;
    label: string;
    provenance: string;
    approval: "approved";
  }>;
}>;

export type BackgroundAssetImport = Readonly<{
  mediaType: "image/png" | "image/webp";
  bytes: readonly number[];
  label: string;
  provenance: "user-import";
}>;

export type HandoutAssetImport = Readonly<{
  mediaType: "image/png" | "image/webp";
  bytes: readonly number[];
  label: string;
  provenance: "user-import";
}>;

export type AudioAssetImport = Readonly<{
  mediaType: "audio/wav";
  bytes: readonly number[];
  label: string;
  provenance: "user-import";
}>;

export type TokenAssetImport = Readonly<{
  mediaType: "image/png" | "image/webp";
  bytes: readonly number[];
  label: string;
  provenance: "user-import";
}>;

export type ProjectSceneReceipt = Readonly<{
  sceneId: string;
  sceneSha256: string;
}>;

export type ProjectSaveReceipt = Readonly<{
  operation: "dicebox.project.save" | "dicebox.project.create" | "dicebox.project.save-as";
  status: "PASS";
  projectId: string;
  generation: number;
  contentSha256: string;
  sceneSha256: string;
  sceneCount: number;
  activeSceneId: string;
  scenes: readonly ProjectSceneReceipt[];
  assetCount: number;
  projectRelativePath: string;
  atomicReplace: true;
  directoryEntrySync: true;
  backupPreserved: boolean;
  noFoundryWrite: true;
  workspaceMetadata?: WorkspaceMetadataReceipt;
  workspaceMetadataWarning?: string;
}>;

export type WorkspaceMetadataReceipt = Readonly<{
  operation: "dicebox.workspace-metadata.touch" | "dicebox.workspace-metadata.rename";
  status: "PASS";
  projectId: string;
  displayName: string;
  lastOpenedSequence: number;
  indexGeneration: number;
  contentSha256: string;
  recoveredFrom: string | null;
  atomicReplace: true;
  directoryEntrySync: true;
  backupPreserved: boolean;
  noFoundryWrite: true;
}>;

export type ProjectLoadResponse = Readonly<{
  scenesJson: readonly string[];
  activeSceneId: string;
  assets: readonly StoredAsset[];
  receipt: Readonly<{
    operation: "dicebox.project.load";
    status: "PASS";
    projectId: string;
    generation: number;
    contentSha256: string;
    sceneSha256: string;
    sceneCount: number;
    activeSceneId: string;
    scenes: readonly ProjectSceneReceipt[];
    assetCount: number;
    recoveredFrom: string | null;
    migrationStatus: "current" | "migrated-in-memory";
    persistedContentSha256: string;
    noFoundryWrite: true;
  }>;
  workspaceMetadata?: WorkspaceMetadataReceipt;
  workspaceMetadataWarning?: string;
}>;

export type ProjectCatalogEntry = Readonly<{
  projectId: string;
  status: "PASS" | "BLOCKED";
  sceneId: string | null;
  sceneName: string | null;
  sceneCount: number | null;
  activeSceneId: string | null;
  generation: number | null;
  contentSha256: string | null;
  assetCount: number | null;
  recoveredFrom: string | null;
  blockerCode: string | null;
  displayName: string;
  lastOpenedSequence: number;
  workspaceMetadataWarning: string | null;
}>;

export type ProjectCatalogResponse = Readonly<{
  operation: "dicebox.project.catalog";
  status: "PASS" | "PARTIAL";
  entries: readonly ProjectCatalogEntry[];
  workspaceIndexGeneration: number;
  workspaceMetadataWarning: string | null;
  noWrite: true;
  noFoundryWrite: true;
}>;

export type ProjectStoreFailure = Readonly<{
  code: string;
  message: string;
  retry: string;
  noFoundryWrite: true;
}>;

export type ProjectRecoveryFileDisposition = Readonly<{
  relativePath: string;
  status: string;
  sourceSchemaVersion?: string;
  migrationStatus?: string;
  byteSha256?: string;
  blockerCode?: string;
  blockerMessage?: string;
  retry?: string;
}>;

export type RegisteredAssetRecoveryInspection = Readonly<{
  assetId: string;
  role: ProjectAssetRole;
  sha256: string;
  mediaType: string;
  byteLength: number;
  relativePath: string;
  affectedSceneIds: readonly string[];
  disposition: string;
  blockerCode?: string;
  blockerMessage?: string;
  retry?: string;
  restoreEligible: boolean;
}>;

export type PendingArtifactRecoveryInspection = Readonly<{
  artifactKind: "project-pending" | "workspace-index-pending";
  relativePath: string;
  status: "PRESENT_VALID" | "BLOCKED";
  stagedContentSha256?: string;
  byteSha256?: string;
  blockerCode?: string;
  blockerMessage?: string;
  retry: string;
}>;

const stableProjectIdPattern = /^dbx:project:([a-z0-9][a-z0-9._-]*)$/;

export function hasTargetProjectPendingArtifact(
  inspection: Readonly<{ pendingArtifacts: readonly PendingArtifactRecoveryInspection[] }>,
  projectId: string,
): boolean {
  const slug = stableProjectIdPattern.exec(projectId)?.[1];
  if (!slug) return false;
  const projectPathPrefix = `projects/${slug}/`;
  return inspection.pendingArtifacts.some((artifact) =>
    artifact.artifactKind === "project-pending" && artifact.relativePath.startsWith(projectPathPrefix));
}

export function isBrokenReferenceUiTerminalInspection(
  inspection: ProjectRecoveryInspectionReceipt,
  projectId: string,
): boolean {
  const slug = stableProjectIdPattern.exec(projectId)?.[1];
  if (!slug || inspection.projectId !== projectId) return false;
  const primarySource = `projects/${slug}/project.json`;
  const backupSource = `projects/${slug}/project.backup.json`;
  const primaryReferences = inspection.brokenSceneReferences.filter((reference) => reference.source === primarySource);
  const backupReferences = inspection.brokenSceneReferences.filter((reference) => reference.source === backupSource);
  const onlyExpectedReferences = inspection.brokenSceneReferences.every((reference) =>
    reference.source === primarySource || reference.source === backupSource);
  const preservedBackupDiagnostics = backupReferences.length > 0
    && backupReferences.every((reference) => reference.blockerCode === "BACKGROUND_ASSET_ROLE_MISMATCH");
  const inspectionStatusIsCompatible = inspection.status === "PASS"
    ? inspection.brokenSceneReferences.length === 0
    : inspection.status === "BLOCKED" && preservedBackupDiagnostics;
  const hasBlockedPendingArtifact = inspection.pendingArtifacts.some((artifact) =>
    artifact.status !== "PRESENT_VALID" || artifact.blockerCode !== undefined);
  const hasAnyProjectPendingArtifact = inspection.pendingArtifacts.some((artifact) =>
    artifact.artifactKind === "project-pending");
  return inspectionStatusIsCompatible
    && primaryReferences.length === 0
    && onlyExpectedReferences
    && inspection.registeredAssets.every((asset) => asset.blockerCode === undefined)
    && !hasTargetProjectPendingArtifact(inspection, projectId)
    && !hasAnyProjectPendingArtifact
    && !hasBlockedPendingArtifact
    && inspection.noWrite === true
    && inspection.noFoundryWrite === true;
}

export type BrokenSceneAssetReferenceInspection = Readonly<{
  source: `projects/${string}/project.json` | `projects/${string}/project.backup.json`;
  sceneId: string;
  assetId: string;
  blockerCode: "BACKGROUND_ASSET_MISSING" | "BACKGROUND_ASSET_ROLE_MISMATCH";
  blockerMessage: string;
  retry: string;
}>;

export type PendingArtifactFixtureReceipt = Readonly<{
  operation: "dicebox.project.pending-artifact.fixture";
  status: "PASS";
  projectId: "dbx:project:desktop-pending-artifact-inspection-self-test";
  projectPendingRelativePath: string;
  workspacePendingRelativePath: string;
  malformedPendingRelativePath: string;
  noFoundryWrite: true;
}>;

export type SelectedMissingBackgroundFixtureReceipt = Readonly<{
  operation: "dicebox.project.selected-missing-background-recovery.fixture";
  status: "PASS";
  projectId: string;
  assetIds: readonly string[];
  sceneIds: readonly string[];
  generation: number;
  noFoundryWrite: true;
}>;

export type DanglingBackgroundReferenceFixtureReceipt = Readonly<{
  operation: "dicebox.project.dangling-background-reference.fixture";
  status: "PASS";
  projectId: "dbx:project:desktop-dangling-background-reference-self-test";
  sceneIds: readonly string[];
  assetIds: readonly string[];
  noFoundryWrite: true;
}>;

export type BrokenReferenceDetachFixtureReceipt = Readonly<{
  operation: "dicebox.project.broken-reference-detach.fixture";
  status: "PASS";
  projectId: "dbx:project:desktop-broken-reference-detach-self-test-v2";
  sceneIds: readonly string[];
  assetId: string;
  assetSha256: string;
  noFoundryWrite: true;
}>;

export type BrokenReferenceUiLifecycleFixtureReceipt = Readonly<{
  operation: "dicebox.project.broken-reference-ui-lifecycle.fixture";
  status: "PASS";
  projectId: string;
  sceneIds: readonly string[];
  assetId: string;
  assetSha256: string;
  noFoundryWrite: true;
}>;

export type LegacyMigrationPersistenceFixtureReceipt = Readonly<{
  operation: "dicebox.project.migration.persist.fixture";
  status: "PASS";
  projectId: "dbx:project:desktop-legacy-migration-persistence-self-test-v2";
  sourceSchemaVersion: "0.2.0";
  generation: number;
  persistedContentSha256: string;
  sceneIds: readonly string[];
  assetSha256: string;
  noFoundryWrite: true;
}>;

export type BackupAuthoritativeRecoveryPromotionFixtureReceipt = Readonly<{
  operation: "dicebox.project.recovery.backup-promotion.fixture";
  status: "PASS";
  projectId: string;
  generation: number;
  contentSha256: string;
  backupByteSha256: string;
  noFoundryWrite: true;
}>;

export type CrossProducerRecoveryTransitionReceipt = Readonly<{
  operation: "dicebox.project.recovery.cross-producer-transition";
  status: "PASS";
  projectId: string;
  beforeGeneration: number;
  committedGeneration: number;
  primaryContentSha256: string;
  backupGeneration: number;
  contentSha256: string;
  backupByteSha256: string;
  foreignStateSha256: string;
  primaryRemoved: true;
  noFoundryWrite: true;
}>;

export type ProjectRecoveryInspectionReceipt = Readonly<{
  operation: "dicebox.project.recovery.inspect";
  status: string;
  projectId: string;
  generation?: number;
  contentSha256?: string;
  activeSceneId?: string;
  scenes: readonly ProjectSceneReceipt[];
  primary: ProjectRecoveryFileDisposition;
  backup: ProjectRecoveryFileDisposition;
  recoveredFrom?: string;
  migrationStatus?: string;
  registeredAssets: readonly RegisteredAssetRecoveryInspection[];
  pendingArtifacts: readonly PendingArtifactRecoveryInspection[];
  brokenSceneReferences: readonly BrokenSceneAssetReferenceInspection[];
  blockerCode?: string;
  blockerMessage?: string;
  retry: string;
  restoreEligible: boolean;
  noWrite: true;
  noFoundryWrite: true;
}>;

export function isAssetRestoreUiTerminalInspection(
  inspection: ProjectRecoveryInspectionReceipt,
  projectId: string,
  selectedAssetId: string,
  expectedRemainingAssetIds: readonly string[],
): boolean {
  const expectedRemaining = new Set(expectedRemainingAssetIds);
  if (expectedRemaining.size !== expectedRemainingAssetIds.length || expectedRemaining.has(selectedAssetId)) return false;
  if (inspection.projectId !== projectId || inspection.noWrite !== true || inspection.noFoundryWrite !== true) return false;
  if (inspection.brokenSceneReferences.length !== 0) return false;
  if (inspection.pendingArtifacts.some((artifact) => artifact.status !== "PRESENT_VALID" || artifact.blockerCode !== undefined)) return false;
  const selected = inspection.registeredAssets.find((asset) => asset.assetId === selectedAssetId);
  if (!selected || selected.role !== "background" || selected.disposition !== "PRESENT_VALID" || selected.blockerCode !== undefined || selected.restoreEligible) return false;
  const remainingEligible = inspection.registeredAssets.filter((asset) => asset.restoreEligible);
  if (remainingEligible.length !== expectedRemaining.size || remainingEligible.some((asset) => !expectedRemaining.has(asset.assetId))) return false;
  for (const asset of inspection.registeredAssets) {
    if (asset.assetId === selectedAssetId) continue;
    if (expectedRemaining.has(asset.assetId)) {
      if (asset.role !== "background" || asset.disposition !== "MISSING" || asset.blockerCode !== "REGISTERED_ASSET_BLOB_MISSING" || !asset.restoreEligible) return false;
      continue;
    }
    if (asset.blockerCode !== undefined || asset.disposition !== "PRESENT_VALID" || asset.restoreEligible) return false;
  }
  const hasExpectedRemaining = expectedRemaining.size > 0;
  return inspection.restoreEligible === hasExpectedRemaining
    && inspection.status === (hasExpectedRemaining ? "BLOCKED" : "PASS")
    && inspection.blockerCode === (hasExpectedRemaining ? "REGISTERED_ASSET_BLOB_MISSING" : undefined);
}

export function selectEligibleMissingBackgroundAsset(
  inspection: ProjectRecoveryInspectionReceipt,
  selectedAssetId?: string | null,
): RegisteredAssetRecoveryInspection {
  const eligible = inspection.registeredAssets.filter((asset) => asset.role === "background" && asset.restoreEligible);
  if (eligible.length === 0) {
    throw new Error("No eligible missing registered background blob is available for recovery.");
  }
  if (!selectedAssetId) {
    if (eligible.length === 1) return eligible[0]!;
    throw new Error("Recovery requires selecting exactly one eligible missing registered background blob.");
  }
  const selected = eligible.find((asset) => asset.assetId === selectedAssetId);
  if (!selected) {
    throw new Error("Selected recovery asset is not currently eligible; inspect recovery again before retrying.");
  }
  return selected;
}

export type ProjectMigrationExplanationReceipt = Readonly<{
  operation: "dicebox.project.migration.explain";
  status: "preview-only" | "blocked";
  projectId: string;
  authoritativeSource?: "project.json" | "project.backup.json";
  primary: ProjectRecoveryFileDisposition;
  backup: ProjectRecoveryFileDisposition;
  sourceSchemaVersion?: string;
  targetSchemaVersion: "0.3.0";
  migrationStatus?: "current" | "migrated-in-memory";
  generation?: number;
  contentSha256?: string;
  actions: readonly string[];
  blockers: readonly string[];
  retry: string;
  noWrite: true;
  noFoundryWrite: true;
}>;

export type ProjectMigrationPersistPreviewReceipt = Readonly<{
  operation: "dicebox.project.migration.persist.preview";
  status: "PREVIEW";
  projectId: string;
  authoritativeSource: "project.json";
  sourceSchemaVersion: "0.1.0" | "0.2.0";
  targetSchemaVersion: "0.3.0";
  generation: number;
  nextGeneration: number;
  persistedContentSha256: string;
  resultingContentSha256: string;
  scenes: readonly ProjectSceneReceipt[];
  activeSceneId: string;
  assetCount: number;
  assetCollectionSha256: string;
  semanticStateSha256: string;
  actions: readonly string[];
  primaryByteSha256: string;
  protectedStateSha256: string;
  assetTreeSha256: string;
  previewSha256: string;
  requiresApproval: true;
  noWrite: true;
  noFoundryWrite: true;
}>;

export type ProjectMigrationPersistReceipt = Readonly<{
  operation: "dicebox.project.migration.persist";
  status: "PASS";
  projectId: string;
  sourceSchemaVersion: "0.1.0" | "0.2.0";
  targetSchemaVersion: "0.3.0";
  previousGeneration: number;
  generation: number;
  previousContentSha256: string;
  contentSha256: string;
  scenes: readonly ProjectSceneReceipt[];
  activeSceneId: string;
  assetCount: number;
  semanticStateUnchanged: boolean;
  assetTreeUnchanged: boolean;
  workspaceUnchanged: boolean;
  foreignStateUnchanged: boolean;
  backupPreservesLegacyPrimary: boolean;
  authoritativeCurrentReread: boolean;
  previewSha256: string;
  directoryEntrySync: boolean;
  noFoundryWrite: true;
}>;

export type BackupRecoveryPromotionPreviewReceipt = Readonly<{
  operation: "dicebox.project.recovery.backup-promotion.preview";
  status: "PREVIEW";
  projectId: string;
  primary: ProjectRecoveryFileDisposition;
  backup: ProjectRecoveryFileDisposition;
  generation: number;
  contentSha256: string;
  scenes: readonly ProjectSceneReceipt[];
  activeSceneId: string;
  assetCount: number;
  assetCollectionSha256: string;
  semanticStateSha256: string;
  backupByteSha256: string;
  protectedStateSha256: string;
  assetTreeSha256: string;
  previewSha256: string;
  requiresApproval: true;
  noWrite: true;
  noFoundryWrite: true;
}>;

export type BackupRecoveryPromotionReceipt = Readonly<{
  operation: "dicebox.project.recovery.backup-promotion";
  status: "PASS";
  projectId: string;
  generation: number;
  contentSha256: string;
  scenes: readonly ProjectSceneReceipt[];
  activeSceneId: string;
  assetCount: number;
  primaryRestored: true;
  backupUnchanged: true;
  semanticStateUnchanged: true;
  assetTreeUnchanged: true;
  workspaceUnchanged: true;
  foreignStateUnchanged: true;
  authoritativeCurrentReread: true;
  backupByteSha256: string;
  previewSha256: string;
  directoryEntrySync: true;
  noFoundryWrite: true;
}>;

export type MissingAssetRestorePreviewReceipt = Readonly<{
  operation: "dicebox.project.asset.restore.preview";
  status: string;
  projectId: string;
  generation: number;
  contentSha256: string;
  migrationStatus: string;
  recoveredFrom: string | null;
  assetId: string;
  assetSha256: string;
  mediaType: string;
  byteLength: number;
  targetRelativePath: string;
  affectedSceneIds: readonly string[];
  candidateSha256: string;
  candidateByteLength: number;
  protectedStateSha256: string;
  previewSha256: string;
  requiresApproval: true;
  noWrite: true;
  noFoundryWrite: true;
}>;

export type MissingAssetRestoreReceipt = Readonly<{
  operation: "dicebox.project.asset.restore";
  status: "PASS";
  projectId: string;
  generation: number;
  contentSha256: string;
  assetId: string;
  assetSha256: string;
  mediaType: string;
  byteLength: number;
  targetRelativePath: string;
  affectedSceneIds: readonly string[];
  previewSha256: string;
  authoritativeAssetSha256: string;
  authoritativeProjectContentSha256: string;
  envelopeUnchanged: true;
  projectStateUnchanged: true;
  scenesUnchanged: true;
  workspaceUnchanged: true;
  backupsUnchanged: true;
  foreignStateUnchanged: true;
  createNewOnly: true;
  directoryEntrySync: true;
  noProjectWrite: true;
  noFoundryWrite: true;
}>;

export type MissingAssetDetachPreviewReceipt = Readonly<{
  operation: "dicebox.project.asset.detach.preview";
  status: "PREVIEW";
  projectId: string;
  generation: number;
  contentSha256: string;
  migrationStatus: "current";
  assetId: string;
  assetSha256: string;
  mediaType: string;
  byteLength: number;
  registration: Readonly<{
    assetId: string;
    role: "background";
    label: string;
    provenance: string;
    approval: "approved";
  }>;
  targetRelativePath: string;
  affectedScenes: readonly ProjectSceneReceipt[];
  resultingScenes: readonly ProjectSceneReceipt[];
  resultingAssetCount: number;
  resultingAssetCollectionSha256: string;
  nextGeneration: number;
  resultingContentSha256: string;
  primaryByteSha256: string;
  protectedStateSha256: string;
  assetTreeSha256: string;
  previewSha256: string;
  requiresApproval: true;
  noWrite: true;
  noFoundryWrite: true;
}>;

export type MissingAssetDetachReceipt = Readonly<{
  operation: "dicebox.project.asset.detach";
  status: "PASS";
  projectId: string;
  previousGeneration: number;
  generation: number;
  previousContentSha256: string;
  contentSha256: string;
  assetId: string;
  assetSha256: string;
  targetRelativePath: string;
  affectedScenes: readonly ProjectSceneReceipt[];
  scenes: readonly ProjectSceneReceipt[];
  descriptorRemoved: true;
  assetTreeUnchanged: true;
  workspaceUnchanged: true;
  foreignStateUnchanged: true;
  backupPreservesPriorEnvelope: true;
  targetRemainsAbsent: true;
  authoritativeReload: true;
  previewSha256: string;
  directoryEntrySync: true;
  noFoundryWrite: true;
}>;

export type BrokenReferenceDetachPreviewReceipt = Readonly<{
  operation: "dicebox.project.broken-reference.detach.preview";
  status: "PREVIEW";
  projectId: string;
  generation: number;
  contentSha256: string;
  sceneId: string;
  assetId: string;
  blockerCode: "BACKGROUND_ASSET_MISSING" | "BACKGROUND_ASSET_ROLE_MISMATCH";
  assetDescriptorPreserved: boolean;
  assetSha256?: string;
  affectedScene: ProjectSceneReceipt;
  resultingScenes: readonly ProjectSceneReceipt[];
  resultingAssetCount: number;
  resultingAssetCollectionSha256: string;
  nextGeneration: number;
  resultingContentSha256: string;
  primaryByteSha256: string;
  backupByteSha256?: string;
  protectedStateSha256: string;
  assetTreeSha256: string;
  previewSha256: string;
  requiresApproval: true;
  noWrite: true;
  noFoundryWrite: true;
}>;

export type BrokenReferenceDetachReceipt = Readonly<{
  operation: "dicebox.project.broken-reference.detach";
  status: "PASS";
  projectId: string;
  previousGeneration: number;
  generation: number;
  previousContentSha256: string;
  contentSha256: string;
  sceneId: string;
  assetId: string;
  blockerCode: "BACKGROUND_ASSET_MISSING" | "BACKGROUND_ASSET_ROLE_MISMATCH";
  assetDescriptorPreserved: boolean;
  assetTreeUnchanged: true;
  workspaceUnchanged: true;
  foreignStateUnchanged: true;
  backupPreservesPriorEnvelope: true;
  targetBindingAbsent: true;
  unrelatedReferencesUnchanged: true;
  authoritativeInspection: true;
  residualBrokenReferenceCount: number;
  previewSha256: string;
  directoryEntrySync: true;
  noFoundryWrite: true;
}>;

export type ProjectStageReceipt = Readonly<{
  operation: "dicebox.project.stage-self-test";
  status: "PASS";
  phase: "save" | "load-and-compile";
  projectId: string;
  generation: number;
  sceneRevision: number;
  selectedX: number;
  contentSha256: string;
  planSha256?: string;
  candidateCount?: number;
  sceneCount?: number;
  assetId?: string;
  assetSha256?: string;
  bindingSceneId?: string;
  noWrite: true;
}>;

const reservedWindowsSlugs = new Set(["con", "prn", "aux", "nul", ...Array.from({ length: 9 }, (_, index) => `com${index + 1}`), ...Array.from({ length: 9 }, (_, index) => `lpt${index + 1}`)]);
const fixturePng = Uint8Array.from(atob("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII="), (character) => character.charCodeAt(0));
export const FOUNDATION_SELF_TEST_PNG_BYTES: readonly number[] = Object.freeze([...fixturePng]);
export const SELECTED_MISSING_BACKGROUND_PNG_BYTES: readonly number[] = Object.freeze([137, 80, 78, 71, 13, 10, 26, 10, 1]);
export const SELECTED_MISSING_BACKGROUND_PNG_ASSET_ID = "dbx:asset:sha256-275f1bcbbb585c71e3b2184304eccfa0e37de92022ca3b6f4e9c10df32318d85";
export const SELECTED_MISSING_BACKGROUND_WEBP_BYTES: readonly number[] = Object.freeze([82, 73, 70, 70, 5, 0, 0, 0, 87, 69, 66, 80, 33]);
export const SELECTED_MISSING_BACKGROUND_WEBP_ASSET_ID = "dbx:asset:sha256-e23764ba1c5f1c5a3b4dfff45a3224aadc43e75761f5b6368b0aa793a6371fef";
export const ASSET_RESTORE_TRACE_WEBP_BYTES: readonly number[] = Object.freeze([82, 73, 70, 70, 6, 0, 0, 0, 87, 69, 66, 80, 33, 33]);
export const ASSET_RESTORE_TRACE_WEBP_ASSET_ID = "dbx:asset:sha256-3505e78b9965cadb25ee3709e95a6f2ea361fccf8545637954254045ddd75aaf";
export const ASSET_RESTORE_TRACE_PNG_ASSET_ID = "dbx:asset:sha256-379aa60c5861ea4f15b6b8fd97ce05053fd6a7de6a4bd4338859fd72ebdbdf4d";
export const ASSET_DETACH_UI_LIFECYCLE_PNG_BYTES: readonly number[] = Object.freeze([137, 80, 78, 71, 13, 10, 26, 10, 3]);
export const ASSET_DETACH_UI_LIFECYCLE_PNG_ASSET_ID = "dbx:asset:sha256-a72382d260ebdf7948e618a3908a8e569f5cf9bbd3f1d804ee456a9fa1222568";
export const ASSET_DETACH_UI_LIFECYCLE_WEBP_BYTES: readonly number[] = Object.freeze([82, 73, 70, 70, 7, 0, 0, 0, 87, 69, 66, 80, 33, 33, 33]);
export const ASSET_DETACH_UI_LIFECYCLE_WEBP_ASSET_ID = "dbx:asset:sha256-c9778b200966a689a6fa2dfd5e4c6faabcb3b266b00d2fd74e89d60435b6f78c";
export const AUDIO_ASSET_ROLE_SELF_TEST_WAV_BYTES: readonly number[] = Object.freeze([82, 73, 70, 70, 36, 0, 0, 0, 87, 65, 86, 69, 102, 109, 116, 32]);

export function isNativeProjectStoreAvailable(): boolean {
  return "__TAURI_INTERNALS__" in globalThis;
}

export function projectIdFromInput(input: string): string {
  const raw = input.trim().toLowerCase().replace(/^dbx:project:/, "");
  const slug = raw.replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  if (!slug || slug.length > 80 || reservedWindowsSlugs.has(slug)) {
    throw new Error("Project name must produce a non-reserved slug of 1–80 lowercase letters, digits, or hyphens.");
  }
  return `dbx:project:${slug}`;
}

export function displayNameFromInput(input: string): string {
  if (input.length === 0 || input.trim() !== input || [...input].length > 100 || [...input].some((character) => /[\u0000-\u001f\u007f]/u.test(character))) {
    throw new Error("Project display name must be 1–100 non-control characters with no leading or trailing whitespace.");
  }
  return input;
}

export function formatProjectStoreFailure(error: unknown): string {
  if (typeof error === "object" && error !== null) {
    const candidate = error as Partial<ProjectStoreFailure>;
    if (typeof candidate.code === "string" && typeof candidate.message === "string" && typeof candidate.retry === "string") {
      return `${candidate.code}: ${candidate.message} · retry ${candidate.retry}`;
    }
  }
  return error instanceof Error ? error.message : typeof error === "string" ? error : JSON.stringify(error);
}

async function sha256(bytes: Uint8Array): Promise<string> {
  const owned = new Uint8Array(bytes);
  const digest = await globalThis.crypto.subtle.digest("SHA-256", owned.buffer);
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

export async function bindBackgroundAssetToScene(
  projectId: string,
  scenes: readonly SceneDocument[],
  activeSceneId: string,
  expectedGeneration: number,
  input: BackgroundAssetImport,
): Promise<Readonly<{ receipt: ProjectSaveReceipt; scenes: readonly SceneDocument[]; assetId: string; sha256: string }>> {
  if (!input.label || input.label.trim() !== input.label || [...input.label].length > 100) throw new Error("Asset label must be 1–100 trimmed characters.");
  const bytes = Uint8Array.from(input.bytes);
  if (bytes.length === 0 || bytes.length > 32 * 1024 * 1024) throw new Error("Background image must be 1 byte through 32 MiB.");
  const digest = await sha256(bytes);
  const assetId = `dbx:asset:sha256-${digest}`;
  let found = false;
  const boundScenes = scenes.map((scene) => {
    if (scene.id !== activeSceneId) return scene;
    found = true;
    return { ...scene, background: { ...scene.background, assetId } };
  });
  if (!found) throw new Error("The active Scene is not present in the project.");
  const receipt = await saveProjectBundle(projectId, boundScenes, activeSceneId, expectedGeneration, [{
    mediaType: input.mediaType,
    bytes: [...bytes],
    registration: { assetId, role: "background", label: input.label, provenance: input.provenance, approval: "approved" },
  }]);
  return { receipt, scenes: boundScenes, assetId, sha256: digest };
}

export async function registerHandoutAsset(
  projectId: string,
  scenes: readonly SceneDocument[],
  activeSceneId: string,
  expectedGeneration: number,
  input: HandoutAssetImport,
): Promise<Readonly<{ receipt: ProjectSaveReceipt; assetId: string; sha256: string }>> {
  if (!input.label || input.label.trim() !== input.label || [...input.label].length > 100) throw new Error("Asset label must be 1–100 trimmed characters.");
  const bytes = Uint8Array.from(input.bytes);
  if (bytes.length === 0 || bytes.length > 32 * 1024 * 1024) throw new Error("Handout image must be 1 byte through 32 MiB.");
  const digest = await sha256(bytes);
  const assetId = `dbx:asset:sha256-${digest}`;
  const receipt = await saveProjectBundle(projectId, scenes, activeSceneId, expectedGeneration, [{
    mediaType: input.mediaType,
    bytes: [...bytes],
    registration: { assetId, role: "handout", label: input.label, provenance: input.provenance, approval: "approved" },
  }]);
  return { receipt, assetId, sha256: digest };
}

export async function registerAudioAsset(
  projectId: string,
  scenes: readonly SceneDocument[],
  activeSceneId: string,
  expectedGeneration: number,
  input: AudioAssetImport,
): Promise<Readonly<{ receipt: ProjectSaveReceipt; assetId: string; sha256: string }>> {
  if (!input.label || input.label.trim() !== input.label || [...input.label].length > 100) throw new Error("Asset label must be 1–100 trimmed characters.");
  const bytes = Uint8Array.from(input.bytes);
  if (bytes.length === 0 || bytes.length > 32 * 1024 * 1024) throw new Error("Audio asset must be 1 byte through 32 MiB.");
  if (bytes.length < 12 || bytes[0] !== 82 || bytes[1] !== 73 || bytes[2] !== 70 || bytes[3] !== 70 || bytes[8] !== 87 || bytes[9] !== 65 || bytes[10] !== 86 || bytes[11] !== 69) {
    throw new Error("Audio asset must contain a RIFF/WAVE signature.");
  }
  const digest = await sha256(bytes);
  const assetId = `dbx:asset:sha256-${digest}`;
  const receipt = await saveProjectBundle(projectId, scenes, activeSceneId, expectedGeneration, [{
    mediaType: input.mediaType,
    bytes: [...bytes],
    registration: { assetId, role: "audio", label: input.label, provenance: input.provenance, approval: "approved" },
  }]);
  return { receipt, assetId, sha256: digest };
}

export async function registerTokenAsset(
  projectId: string,
  scenes: readonly SceneDocument[],
  activeSceneId: string,
  expectedGeneration: number,
  input: TokenAssetImport,
): Promise<Readonly<{ receipt: ProjectSaveReceipt; assetId: string; sha256: string }>> {
  if (!input.label || input.label.trim() !== input.label || [...input.label].length > 100) throw new Error("Asset label must be 1–100 trimmed characters.");
  const bytes = Uint8Array.from(input.bytes);
  if (bytes.length === 0 || bytes.length > 32 * 1024 * 1024) throw new Error("Token image must be 1 byte through 32 MiB.");
  const digest = await sha256(bytes);
  const assetId = `dbx:asset:sha256-${digest}`;
  const receipt = await saveProjectBundle(projectId, scenes, activeSceneId, expectedGeneration, [{
    mediaType: input.mediaType,
    bytes: [...bytes],
    registration: { assetId, role: "token", label: input.label, provenance: input.provenance, approval: "approved" },
  }]);
  return { receipt, assetId, sha256: digest };
}

export function createBlankProjectScene(projectId: string, ordinal = 1): SceneDocument {
  const normalized = projectIdFromInput(projectId);
  if (!Number.isSafeInteger(ordinal) || ordinal < 1 || ordinal > 256) {
    throw new Error("Scene ordinal must be an integer from 1 through 256.");
  }
  const slug = normalized.slice("dbx:project:".length);
  const name = slug.split("-").filter(Boolean).map((part) => `${part[0]?.toUpperCase() ?? ""}${part.slice(1)}`).join(" ");
  return {
    schemaVersion: "0.1.0",
    revision: 0,
    id: ordinal === 1 ? `dbx:scene:${slug}-main` : `dbx:scene:${slug}-scene-${ordinal}`,
    name: ordinal === 1 ? (name || "Untitled Campaign") : `Scene ${ordinal}`,
    width: 1536,
    height: 1024,
    background: { color: 0x172033, gridSize: 64 },
    entities: [],
  };
}

function serializeProjectScenes(scenes: readonly SceneDocument[], activeSceneId: string): string[] {
  if (scenes.length === 0 || scenes.length > 256) throw new Error("A project must contain 1–256 Scenes.");
  const sceneIds = scenes.map((scene) => scene.id);
  if (new Set(sceneIds).size !== sceneIds.length) throw new Error("Project Scene IDs must be unique.");
  if (!sceneIds.includes(activeSceneId)) throw new Error("The active Scene ID must identify a Scene in the project.");
  return scenes.map(serializeSceneDocument);
}

export function projectSessionIsDirty(scenes: readonly SceneDocument[], persistedSceneJson: readonly string[] | null): boolean {
  if (persistedSceneJson === null || scenes.length !== persistedSceneJson.length) return true;
  return scenes.some((scene, index) => serializeSceneDocument(scene) !== persistedSceneJson[index]);
}

export type ProjectSessionCloseDecision = Readonly<{
  status: "PASS" | "BLOCKED";
  projectId: string | null;
  reason: string;
  noWrite: true;
}>;

export function projectSessionCloseDecision(activeProjectId: string | null, scenes: readonly SceneDocument[], persistedSceneJson: readonly string[] | null): ProjectSessionCloseDecision {
  if (activeProjectId !== null && projectSessionIsDirty(scenes, persistedSceneJson)) {
    return {
      status: "BLOCKED",
      projectId: activeProjectId,
      reason: "Unsaved Scene changes must be saved before closing; no changes were discarded.",
      noWrite: true,
    };
  }
  return {
    status: "PASS",
    projectId: activeProjectId,
    reason: "Close clears only in-memory project/editor state; persisted state is unchanged.",
    noWrite: true,
  };
}

export async function listProjectBundles(): Promise<ProjectCatalogResponse> {
  return invoke<ProjectCatalogResponse>("list_project_bundles");
}

export async function inspectProjectRecovery(projectId: string): Promise<ProjectRecoveryInspectionReceipt> {
  return invoke<ProjectRecoveryInspectionReceipt>("inspect_project_recovery", {
    request: { schemaVersion: "0.3.0", projectId: projectIdFromInput(projectId) },
  });
}

export async function preparePendingArtifactInspectionFixture(): Promise<PendingArtifactFixtureReceipt> {
  return invoke<PendingArtifactFixtureReceipt>("prepare_pending_artifact_inspection_fixture");
}

export async function prepareSelectedMissingBackgroundRecoveryFixture(): Promise<SelectedMissingBackgroundFixtureReceipt> {
  return invoke<SelectedMissingBackgroundFixtureReceipt>("prepare_selected_missing_background_recovery_fixture");
}

export async function prepareAssetRestoreTraceFixture(): Promise<SelectedMissingBackgroundFixtureReceipt> {
  return invoke<SelectedMissingBackgroundFixtureReceipt>("prepare_asset_restore_trace_fixture");
}

  export async function prepareAssetRestoreTraceFixtureV2(): Promise<SelectedMissingBackgroundFixtureReceipt> {
    return invoke<SelectedMissingBackgroundFixtureReceipt>("prepare_asset_restore_trace_fixture_v2");
  }

  export async function prepareAssetRestoreTraceFixtureV3(): Promise<SelectedMissingBackgroundFixtureReceipt> {
    return invoke<SelectedMissingBackgroundFixtureReceipt>("prepare_asset_restore_trace_fixture_v3");
  }

export async function prepareAssetDetachUiLifecycleFixture(): Promise<SelectedMissingBackgroundFixtureReceipt> {
  return invoke<SelectedMissingBackgroundFixtureReceipt>("prepare_asset_detach_ui_lifecycle_fixture");
}

export async function prepareDanglingBackgroundReferenceFixture(): Promise<DanglingBackgroundReferenceFixtureReceipt> {
  return invoke<DanglingBackgroundReferenceFixtureReceipt>("prepare_dangling_background_reference_fixture");
}

export async function prepareBrokenReferenceDetachFixture(): Promise<BrokenReferenceDetachFixtureReceipt> {
  return invoke<BrokenReferenceDetachFixtureReceipt>("prepare_broken_reference_detach_fixture");
}

export async function prepareBrokenReferenceUiLifecycleFixture(): Promise<BrokenReferenceUiLifecycleFixtureReceipt> {
  return invoke<BrokenReferenceUiLifecycleFixtureReceipt>("prepare_broken_reference_ui_lifecycle_fixture");
}

export async function prepareBrokenReferenceUiLifecycleFixtureV3(): Promise<BrokenReferenceUiLifecycleFixtureReceipt> {
  return invoke<BrokenReferenceUiLifecycleFixtureReceipt>("prepare_broken_reference_ui_lifecycle_fixture_v3");
}

export async function prepareBrokenReferenceUiLifecycleFixtureV4(): Promise<BrokenReferenceUiLifecycleFixtureReceipt> {
  return invoke<BrokenReferenceUiLifecycleFixtureReceipt>("prepare_broken_reference_ui_lifecycle_fixture_v4");
}

export async function prepareLegacyMigrationPersistenceFixture(): Promise<LegacyMigrationPersistenceFixtureReceipt> {
  return invoke<LegacyMigrationPersistenceFixtureReceipt>("prepare_legacy_migration_persistence_fixture");
}

export async function prepareBackupAuthoritativeRecoveryPromotionFixture(): Promise<BackupAuthoritativeRecoveryPromotionFixtureReceipt> {
  return invoke<BackupAuthoritativeRecoveryPromotionFixtureReceipt>("prepare_backup_authoritative_recovery_promotion_fixture");
}

export async function prepareCrossProducerRecoveryTransition(
  projectId: string,
  expectedGeneration: number,
  expectedContentSha256: string,
): Promise<CrossProducerRecoveryTransitionReceipt> {
  return invoke<CrossProducerRecoveryTransitionReceipt>("prepare_cross_producer_recovery_transition", {
    projectId,
    expectedGeneration,
    expectedContentSha256,
  });
}

export async function finishProjectSelfTest(status: "PASS" | "BLOCKED"): Promise<void> {
  await invoke("finish_project_self_test", { status });
}

export async function recordProjectUiSelfTestProgress(stage: "idle" | "loaded" | "named" | "previewed" | "approved" | "applied" | "pass" | "blocked", detail?: string): Promise<void> {
  await invoke("record_project_ui_self_test_progress", { stage, detail: detail ?? null });
}

export async function explainProjectMigration(projectId: string): Promise<ProjectMigrationExplanationReceipt> {
  return invoke<ProjectMigrationExplanationReceipt>("explain_project_migration", {
    request: { schemaVersion: "0.3.0", projectId: projectIdFromInput(projectId) },
  });
}

export async function previewProjectMigrationPersist(projectId: string): Promise<ProjectMigrationPersistPreviewReceipt> {
  return invoke<ProjectMigrationPersistPreviewReceipt>("preview_project_migration_persist", {
    request: { schemaVersion: "0.3.0", projectId: projectIdFromInput(projectId) },
  });
}

export async function persistProjectMigration(
  preview: ProjectMigrationPersistPreviewReceipt,
): Promise<ProjectMigrationPersistReceipt> {
  return invoke<ProjectMigrationPersistReceipt>("persist_project_migration", {
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
}

export async function previewBackupAuthoritativeRecovery(projectId: string): Promise<BackupRecoveryPromotionPreviewReceipt> {
  return invoke<BackupRecoveryPromotionPreviewReceipt>("preview_backup_authoritative_recovery", {
    request: { schemaVersion: "0.3.0", projectId: projectIdFromInput(projectId) },
  });
}

export async function promoteBackupAuthoritativeRecovery(
  preview: BackupRecoveryPromotionPreviewReceipt,
): Promise<BackupRecoveryPromotionReceipt> {
  return invoke<BackupRecoveryPromotionReceipt>("promote_backup_authoritative_recovery", {
    request: {
      schemaVersion: "0.3.0",
      projectId: preview.projectId,
      generation: preview.generation,
      contentSha256: preview.contentSha256,
      backupByteSha256: preview.backupByteSha256,
      protectedStateSha256: preview.protectedStateSha256,
      assetTreeSha256: preview.assetTreeSha256,
      previewSha256: preview.previewSha256,
      approved: true,
    },
  });
}

export async function previewMissingAssetRestore(
  projectId: string,
  assetId: string,
  mediaType: string,
  bytes: readonly number[],
): Promise<MissingAssetRestorePreviewReceipt> {
  return invoke<MissingAssetRestorePreviewReceipt>("preview_missing_asset_restore", {
    request: { schemaVersion: "0.3.0", projectId: projectIdFromInput(projectId), assetId, mediaType, bytes: [...bytes] },
  });
}

export async function restoreMissingAsset(
  preview: MissingAssetRestorePreviewReceipt,
  bytes: readonly number[],
): Promise<MissingAssetRestoreReceipt> {
  return invoke<MissingAssetRestoreReceipt>("restore_missing_asset", {
    request: {
      schemaVersion: "0.3.0",
      projectId: preview.projectId,
      assetId: preview.assetId,
      mediaType: preview.mediaType,
      bytes: [...bytes],
      previewSha256: preview.previewSha256,
      approved: true,
    },
  });
}

export async function previewMissingAssetDetach(
  projectId: string,
  assetId: string,
): Promise<MissingAssetDetachPreviewReceipt> {
  return invoke<MissingAssetDetachPreviewReceipt>("preview_missing_asset_detach", {
    request: { schemaVersion: "0.3.0", projectId: projectIdFromInput(projectId), assetId },
  });
}

export async function detachMissingAsset(
  preview: MissingAssetDetachPreviewReceipt,
): Promise<MissingAssetDetachReceipt> {
  return invoke<MissingAssetDetachReceipt>("detach_missing_asset", {
    request: {
      schemaVersion: "0.3.0",
      projectId: preview.projectId,
      assetId: preview.assetId,
      previewSha256: preview.previewSha256,
      approved: true,
    },
  });
}

export function selectBrokenSceneReference(
  inspection: ProjectRecoveryInspectionReceipt,
  sceneId?: string | null,
  assetId?: string | null,
): BrokenSceneAssetReferenceInspection {
  const references = inspection.brokenSceneReferences;
  if (references.length === 0) throw new Error("No broken Scene/background reference is available for repair.");
  if (!sceneId || !assetId) {
    if (references.length === 1) return references[0]!;
    throw new Error("Broken-reference repair requires selecting exactly one Scene and asset reference.");
  }
  const selected = references.find((reference) => reference.sceneId === sceneId && reference.assetId === assetId);
  if (!selected) throw new Error("Selected broken reference is no longer current; inspect recovery again before retrying.");
  return selected;
}

export async function previewBrokenReferenceDetach(
  reference: BrokenSceneAssetReferenceInspection,
  projectId: string,
): Promise<BrokenReferenceDetachPreviewReceipt> {
  return invoke<BrokenReferenceDetachPreviewReceipt>("preview_broken_reference_detach", {
    request: {
      schemaVersion: "0.3.0",
      projectId: projectIdFromInput(projectId),
      sceneId: reference.sceneId,
      assetId: reference.assetId,
      blockerCode: reference.blockerCode,
    },
  });
}

export async function detachBrokenReference(
  preview: BrokenReferenceDetachPreviewReceipt,
): Promise<BrokenReferenceDetachReceipt> {
  return invoke<BrokenReferenceDetachReceipt>("detach_broken_reference", {
    request: {
      schemaVersion: "0.3.0",
      projectId: preview.projectId,
      sceneId: preview.sceneId,
      assetId: preview.assetId,
      blockerCode: preview.blockerCode,
      previewSha256: preview.previewSha256,
      approved: true,
    },
  });
}

export async function createProjectBundle(projectId: string, scenes: readonly SceneDocument[], activeSceneId: string, displayName: string, expectedWorkspaceGeneration: number): Promise<ProjectSaveReceipt> {
  return invoke<ProjectSaveReceipt>("create_project_bundle", {
    request: {
      schemaVersion: "0.3.0",
      projectId: projectIdFromInput(projectId),
      expectedGeneration: 0,
      scenesJson: serializeProjectScenes(scenes, activeSceneId),
      activeSceneId,
      assets: [],
      expectedWorkspaceGeneration,
      workspaceDisplayName: displayNameFromInput(displayName),
    },
  });
}

export async function saveProjectBundle(projectId: string, scenes: readonly SceneDocument[], activeSceneId: string, expectedGeneration: number, assets?: readonly Readonly<{
  mediaType: string;
  bytes: readonly number[];
  registration?: Readonly<{ assetId: string; role: ProjectAssetRole; label: string; provenance: string; approval: "approved" }>;
}>[]): Promise<ProjectSaveReceipt> {
  return invoke<ProjectSaveReceipt>("save_project_bundle", {
    request: {
      schemaVersion: "0.3.0",
      projectId: projectIdFromInput(projectId),
      expectedGeneration,
      scenesJson: serializeProjectScenes(scenes, activeSceneId),
      activeSceneId,
      ...(assets === undefined ? {} : { assets }),
    },
  });
}

export async function saveProjectAsBundle(sourceProjectId: string, targetProjectId: string, scenes: readonly SceneDocument[], activeSceneId: string, displayName: string, expectedWorkspaceGeneration: number): Promise<ProjectSaveReceipt> {
  return invoke<ProjectSaveReceipt>("save_project_as_bundle", {
    request: {
      schemaVersion: "0.3.0",
      sourceProjectId: projectIdFromInput(sourceProjectId),
      targetProjectId: projectIdFromInput(targetProjectId),
      scenesJson: serializeProjectScenes(scenes, activeSceneId),
      activeSceneId,
      expectedWorkspaceGeneration,
      workspaceDisplayName: displayNameFromInput(displayName),
    },
  });
}

export async function loadProjectBundle(projectId: string, expectedWorkspaceGeneration?: number): Promise<ProjectLoadResponse> {
  return invoke<ProjectLoadResponse>("load_project_bundle", {
    request: {
      schemaVersion: "0.3.0",
      projectId: projectIdFromInput(projectId),
      ...(expectedWorkspaceGeneration === undefined ? {} : { expectedWorkspaceGeneration }),
    },
  });
}

export async function renameProjectBundle(projectId: string, displayName: string, expectedWorkspaceGeneration: number): Promise<WorkspaceMetadataReceipt> {
  return invoke<WorkspaceMetadataReceipt>("rename_project_bundle", {
    request: {
      schemaVersion: "0.1.0",
      projectId: projectIdFromInput(projectId),
      displayName: displayNameFromInput(displayName),
      expectedWorkspaceGeneration,
    },
  });
}

export async function saveFoundationSelfTestBundle(scene: SceneDocument, expectedGeneration: number): Promise<ProjectSaveReceipt> {
  return invoke<ProjectSaveReceipt>("save_project_bundle", {
    request: {
      schemaVersion: "0.3.0",
      projectId: FOUNDATION_SELF_TEST_PROJECT_ID,
      expectedGeneration,
      scenesJson: [serializeSceneDocument(scene)],
      activeSceneId: scene.id,
      assets: [{ mediaType: "image/png", bytes: [...fixturePng] }],
    },
  });
}

export async function loadFoundationSelfTestBundle(): Promise<ProjectLoadResponse> {
  return loadProjectBundle(FOUNDATION_SELF_TEST_PROJECT_ID);
}

export async function recordProjectStageReceipt(receipt: ProjectStageReceipt): Promise<void> {
  await invoke("record_project_stage_receipt", { receipt });
}
