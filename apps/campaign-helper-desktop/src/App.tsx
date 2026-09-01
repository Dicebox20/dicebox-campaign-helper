import {
  applySceneCommand,
  createSceneHistory,
  executeSceneCommand,
  projectScene,
  redoSceneHistory,
  serializeSceneDocument,
  migrateSceneDocument,
  undoSceneHistory,
  validateSceneDocument,
  type SceneCommand,
  type SceneCommandReceipt,
  type SceneHistory,
  type SceneHistoryReceipt,
  type MigratableSceneDocument,
  type SceneDocument,
} from "@dicebox/scene";
import { compileSceneFoundryPreview, type SceneFoundryPreview } from "@dicebox/compiler";
import { previewProposalBatch, type ProposalBatch } from "@dicebox/core";
import {
  beginCampaignDirectorTurn,
  buildCampaignDirectorResponseRequest,
  cancelCampaignDirectorTurn,
  completeCampaignDirectorAnswer,
  completeCampaignDirectorProposal,
  createCampaignDirectorConversation,
  failCampaignDirectorTurn,
  reviewCampaignDirectorFunctionCall,
  reviewCampaignDirectorResponse,
  selectCampaignDirectorProvider,
  type CampaignDirectorConversation,
  type CampaignDirectorProviderMode,
  type DirectorReviewReceipt,
} from "@dicebox/director";
import { useCallback, useEffect, useMemo, useReducer, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { fixtureScene } from "./fixture-scene";
import {
  commitGeometryBatch,
  createStressTranslateBatch,
  geometryReceiptToCommand,
  isNativeGeometryAvailable,
  type GeometryBatchReceipt,
} from "./geometry-kernel";
import { SceneViewport } from "./SceneViewport";
import {
  AUDIO_ASSET_ROLE_SELF_TEST_WAV_BYTES,
  ASSET_DETACH_UI_LIFECYCLE_PNG_ASSET_ID,
  ASSET_DETACH_UI_LIFECYCLE_WEBP_ASSET_ID,
  FOUNDATION_SELF_TEST_PROJECT_ID,
  FOUNDATION_SELF_TEST_PNG_BYTES,
  prepareDanglingBackgroundReferenceFixture,
  prepareBrokenReferenceDetachFixture,
  prepareBrokenReferenceUiLifecycleFixture,
  prepareBrokenReferenceUiLifecycleFixtureV3,
  prepareBrokenReferenceUiLifecycleFixtureV4,
  prepareBackupAuthoritativeRecoveryPromotionFixture,
  prepareCrossProducerRecoveryTransition,
  prepareLegacyMigrationPersistenceFixture,
  SELECTED_MISSING_BACKGROUND_PNG_ASSET_ID,
  SELECTED_MISSING_BACKGROUND_PNG_BYTES,
  SELECTED_MISSING_BACKGROUND_WEBP_ASSET_ID,
  SELECTED_MISSING_BACKGROUND_WEBP_BYTES,
  ASSET_RESTORE_TRACE_PNG_ASSET_ID,
  ASSET_RESTORE_TRACE_WEBP_ASSET_ID,
  ASSET_RESTORE_TRACE_WEBP_BYTES,
  bindBackgroundAssetToScene,
  createBlankProjectScene,
  createProjectBundle,
  detachMissingAsset,
  detachBrokenReference,
  displayNameFromInput,
  explainProjectMigration,
  previewProjectMigrationPersist,
  previewBackupAuthoritativeRecovery,
  persistProjectMigration,
  promoteBackupAuthoritativeRecovery,
  finishProjectSelfTest,
  formatProjectStoreFailure,
  hasTargetProjectPendingArtifact,
  inspectProjectRecovery,
  isAssetRestoreUiTerminalInspection,
  isBrokenReferenceUiTerminalInspection,
  isNativeProjectStoreAvailable,
  listProjectBundles,
  loadFoundationSelfTestBundle,
  loadProjectBundle,
  projectIdFromInput,
  previewMissingAssetRestore,
  previewMissingAssetDetach,
  previewBrokenReferenceDetach,
  preparePendingArtifactInspectionFixture,
  prepareAssetRestoreTraceFixtureV3,
  prepareAssetDetachUiLifecycleFixture,
  prepareSelectedMissingBackgroundRecoveryFixture,
  projectSessionIsDirty,
  projectSessionCloseDecision,
  registerAudioAsset,
  registerHandoutAsset,
  registerTokenAsset,
  recordProjectStageReceipt,
  recordProjectUiSelfTestProgress,
  renameProjectBundle,
  restoreMissingAsset,
  selectEligibleMissingBackgroundAsset,
  selectBrokenSceneReference,
  saveFoundationSelfTestBundle,
  saveProjectAsBundle,
  saveProjectBundle,
  type ProjectCatalogEntry,
  type ProjectLoadResponse,
  type ProjectMigrationExplanationReceipt,
  type ProjectMigrationPersistPreviewReceipt,
  type ProjectMigrationPersistReceipt,
  type BackupRecoveryPromotionPreviewReceipt,
  type BackupRecoveryPromotionReceipt,
  type MissingAssetRestorePreviewReceipt,
  type MissingAssetRestoreReceipt,
  type MissingAssetDetachPreviewReceipt,
  type MissingAssetDetachReceipt,
  type BrokenReferenceDetachPreviewReceipt,
  type BrokenReferenceDetachReceipt,
  type ProjectRecoveryInspectionReceipt,
  type ProjectSaveReceipt,
} from "./project-store";
import {
  inspectTypedLocalProjectReviewApplyCoverage,
  TYPED_LOCAL_PROJECT_OPERATION_LIFECYCLE_EVIDENCE_ENVELOPE,
  TYPED_LOCAL_PROJECT_OPERATION_HISTORY_LIFECYCLE_COVERAGE,
  TYPED_LOCAL_PROJECT_OPERATION_HISTORY_TRANSITION_COVERAGE,
  TYPED_LOCAL_PROJECT_OPERATION_PROPOSAL_HISTORY_BINDING,
  TYPED_LOCAL_PROJECT_PROPOSAL_HISTORY_TRANSITION_PROJECTION,
  TYPED_LOCAL_PROJECT_REVIEW_APPLY_VISIBLE_METADATA,
} from "./project-review-apply-coverage";
import { TYPED_LOCAL_PROJECT_PRODUCER_EVIDENCE_SUMMARY } from "./project-review-producer-evidence";
import {
  TYPED_LOCAL_PROJECT_REVIEW_TERMINAL_STATE_EVIDENCE,
  TYPED_LOCAL_PROJECT_REVIEW_TERMINAL_STATE_EVIDENCE_SUMMARY,
} from "./project-review-terminal-state-evidence";
import {
  TYPED_LOCAL_PROJECT_APPLYING_UNKNOWN_EVIDENCE,
  TYPED_LOCAL_PROJECT_APPLYING_UNKNOWN_EVIDENCE_SUMMARY,
} from "./project-review-applying-unknown-evidence";
import {
  TYPED_LOCAL_PROJECT_RECOVERY_RESULT_EVIDENCE,
  TYPED_LOCAL_PROJECT_RECOVERY_RESULT_EVIDENCE_SUMMARY,
} from "./project-review-recovery-result-evidence";
import {
  TYPED_LOCAL_PROJECT_UNDO_REDO_EVIDENCE,
  TYPED_LOCAL_PROJECT_UNDO_REDO_EVIDENCE_SUMMARY,
} from "./project-review-undo-redo-evidence";
import {
  TYPED_PROJECT_SAVE_UNDO_REDO_CLASSIFIER_EVIDENCE,
  TYPED_PROJECT_SAVE_UNDO_REDO_CLASSIFIER_EVIDENCE_SUMMARY,
} from "./project-save-undo-redo-classifier-evidence";
import { inspectProjectTerminalHistoryEvidenceIndex } from "./project-terminal-history-evidence-index";
import {
  isNativeCodexProbeAvailable,
  probeCodexAccount,
  runCodexTechnicalJob,
  type CodexAccountProbe,
  type CodexRateLimitMetadata,
  type CodexTechnicalJobReceipt,
  type CodexUsageMetadata,
} from "./codex-account";
import {
  campaignDirectorCredentialStatus,
  isNativeCampaignDirectorAvailable,
  removeCampaignDirectorApiKey,
  requestCampaignDirector,
  requestManagedCampaignDirector,
  storeCampaignDirectorApiKey,
  type CampaignDirectorCredentialStatus,
} from "./campaign-director";
import {
  DESKTOP_CAMPAIGN_DIRECTOR_CONVERSATION_ID,
  DESKTOP_CAMPAIGN_DIRECTOR_FIXTURE_PROJECT_ID,
  browserCampaignDirectorConversationStorage,
  desktopSceneCitation,
  desktopSceneContextBudget,
  loadDesktopCampaignDirectorConversation,
  saveDesktopCampaignDirectorConversation,
} from "./campaign-director-conversation";
import {
  createCampaignDirectorDesktopProposalSession,
  createHumanDesktopProposalSession,
  prepareDesktopProposalApplication,
  proposalHistoryRereadTarget,
  sha256SceneDocument,
} from "./proposal-application";
import {
  approveDesktopProposalSession,
  browserDesktopProposalSessionStorage,
  cancelDesktopProposalSession,
  commitDesktopProposalSession,
  editDesktopProposalSession,
  inspectDesktopProposalSession,
  invalidateStaleDesktopProposalSession,
  loadDesktopProposalSession,
  markDesktopProposalOutcomeUnknown,
  redoDesktopProposalSession,
  rejectDesktopProposalSession,
  saveDesktopProposalSession,
  undoDesktopProposalSession,
  type DesktopProposalSession,
} from "./proposal-session";
import {
  browserDesktopProjectProposalSessionStorage,
  approveDesktopProjectProposalSession,
  beginDesktopProjectProposalSessionApply,
  cancelDesktopProjectProposalSession,
  clearTerminalDesktopProjectProposalSession,
  clearTerminalDesktopProjectSaveUiSelfTestProposalSession,
  createDesktopBrokenReferenceUiOwnedProposalBatch,
  createDesktopBrokenReferenceUiOwnershipToken,
  DESKTOP_BROKEN_REFERENCE_UI_SELF_TEST_PROJECT_ID,
  DESKTOP_BROKEN_REFERENCE_UI_SELF_TEST_V3_PROJECT_ID,
  DESKTOP_BROKEN_REFERENCE_UI_SELF_TEST_V3_SCOPE,
  DESKTOP_BROKEN_REFERENCE_UI_SELF_TEST_V4_PROJECT_ID,
  DESKTOP_BROKEN_REFERENCE_UI_SELF_TEST_V4_SCOPE,
  createDesktopProjectProposalSession,
  createDesktopProjectRenameProposalSession,
  DESKTOP_ASSET_DETACH_UI_SELF_TEST_PROJECT_ID,
  DESKTOP_ASSET_DETACH_UI_SELF_TEST_SCOPE,
  DESKTOP_ASSET_DETACH_UI_SELF_TEST_V2_SCOPE,
  DESKTOP_ASSET_RESTORE_UI_SELF_TEST_V3_PROJECT_ID,
  DESKTOP_ASSET_RESTORE_UI_SELF_TEST_V2_SCOPE,
  DESKTOP_ASSET_RESTORE_UI_SELF_TEST_V3_SCOPE,
  DESKTOP_PROJECT_SAVE_UI_SELF_TEST_PROJECT_ID,
  DESKTOP_PROJECT_SAVE_UI_SELF_TEST_SCOPE,
  clearTerminalDesktopAssetRestoreUiV3SelfTestProposalSession,
  commitDesktopProjectProposalSessionAfterReread,
  invalidateStaleDesktopProjectProposalSession,
  loadDesktopBrokenReferenceUiSelfTestProposalSession,
  loadDesktopBrokenReferenceUiV3SelfTestProposalSession,
  loadDesktopBrokenReferenceUiV4SelfTestProposalSession,
  loadDesktopAssetDetachUiSelfTestProposalSession,
  loadDesktopAssetDetachUiV2SelfTestProposalSession,
  loadDesktopAssetRestoreUiV3SelfTestProposalSession,
  loadDesktopProjectSaveUiSelfTestProposalSession,
  loadDesktopProjectProposalSession,
  rejectDesktopProjectProposalSession,
  saveDesktopBrokenReferenceUiSelfTestProposalSession,
  saveDesktopBrokenReferenceUiV3SelfTestProposalSession,
  saveDesktopBrokenReferenceUiV4SelfTestProposalSession,
  saveDesktopAssetDetachUiSelfTestProposalSession,
  saveDesktopAssetDetachUiV2SelfTestProposalSession,
  saveDesktopAssetRestoreUiV3SelfTestProposalSession,
  saveDesktopAssetRestoreUiV2SelfTestProposalSession,
  saveDesktopProjectProposalSession,
  saveDesktopProjectSaveUiSelfTestProposalSession,
  inspectDesktopProjectProposalSession,
  classifyDesktopBrokenReferenceUiSessionOwnership,
  summarizeDesktopProjectProposalSessionLoad,
  type DesktopProjectProposalSession,
  type DesktopProjectProposalSessionScope,
  type DesktopBrokenReferenceUiOwnershipExpectation,
} from "./project-proposal-session";
import { createDesktopProjectAddSceneProposalSession } from "./project-proposal-session";
import { createProjectRecoveryProposalBatch } from "./project-recovery-proposal-adapter";
import { createProjectRenamePreview, createProjectRenameProposalBatch, type ProjectRenamePreview } from "./project-rename-proposal-adapter";
import { executeApprovedProjectRename } from "./project-rename-executor";
import { createProjectSavePreview, createProjectSaveProposalBatch, hashProjectSaveContent, type ProjectSaveContent, type ProjectSavePreview } from "./project-save-proposal-adapter";
import { executeApprovedProjectSave, projectSaveContentFromProjectLoad } from "./project-save-executor";
import { createProjectAssetBindingPreview, createProjectAssetBindingProposalBatch, deriveProjectBackgroundAssetDescriptor, sceneWithBackgroundAsset, type ProjectAssetBindingContent, type ProjectAssetBindingPreview, type ProjectBackgroundAssetCandidate } from "./project-asset-binding-proposal-adapter";
import { executeApprovedProjectAssetBinding, executeApprovedProjectAssetBindingCommit } from "./project-asset-binding-executor";
import { createProjectAddScenePreview, createProjectAddSceneProposalBatch, type ProjectAddSceneState } from "./project-add-scene-proposal-adapter";
import { executeCommittedProjectAddScene, executeProjectAddScene, inMemoryProjectAddSceneStore, undoCommittedProjectAddScene, type ProjectAddSceneStore } from "./project-add-scene-executor";
  import { createProjectHandoutAssetRegistrationPreview, createProjectHandoutAssetRegistrationProposalBatch, type ProjectHandoutAssetCandidate, type ProjectHandoutAssetContent, type ProjectHandoutAssetRegistrationPreview } from "./project-handout-asset-proposal-adapter";
  import { executeApprovedProjectHandoutAssetRegistration } from "./project-handout-asset-executor";
  import { createProjectAudioAssetRegistrationPreview, createProjectAudioAssetRegistrationProposalBatch, type ProjectAudioAssetCandidate, type ProjectAudioAssetContent, type ProjectAudioAssetRegistrationPreview } from "./project-audio-asset-proposal-adapter";
  import { executeApprovedProjectAudioAssetRegistration } from "./project-audio-asset-executor";
  import { createProjectTokenAssetRegistrationPreview, createProjectTokenAssetRegistrationProposalBatch, type ProjectTokenAssetCandidate, type ProjectTokenAssetContent, type ProjectTokenAssetRegistrationPreview } from "./project-token-asset-proposal-adapter";
  import { executeApprovedProjectTokenAssetRegistration } from "./project-token-asset-executor";
  import { createProjectPersistentAddScenePreview, createProjectPersistentAddSceneProposalBatch, hashProjectPersistentAddSceneState } from "./project-persistent-add-scene-proposal-adapter";
  import { executeApprovedProjectPersistentAddScene } from "./project-persistent-add-scene-executor";
  import { createProjectSaveAsPreview, createProjectSaveAsProposalBatch, hashProjectSaveAsAssetCollection, type ProjectSaveAsPreview } from "./project-save-as-proposal-adapter";
  import { executeApprovedProjectSaveAs } from "./project-save-as-executor";
import { createProjectCreatePreview, createProjectCreateProposalBatch, type ProjectCreatePreview } from "./project-create-proposal-adapter";
  import { executeApprovedProjectCreate } from "./project-create-executor";

const DESKTOP_SELECTOR_RECOVERY_MODE = "ephemeral";
const DESKTOP_SELECTOR_RECOVERY_PROJECT_ID = "dbx:project:desktop-backup-authoritative-recovery-promotion-self-test";
const DESKTOP_PACKAGE_SOURCE_FIDELITY_MARKER = "dbx:desktop:source-fidelity:m334";

type DesktopState = Readonly<{
  history: SceneHistory;
  selectedEntityId: string;
  lastReceipt: SceneCommandReceipt | SceneHistoryReceipt | null;
  lastError: string | null;
}>;

type DesktopAction =
  | Readonly<{ kind: "select"; entityId: string }>
  | Readonly<{ kind: "execute"; command: SceneCommand }>
  | Readonly<{ kind: "replace"; document: SceneDocument }>
  | Readonly<{ kind: "undo" }>
  | Readonly<{ kind: "redo" }>;

const initialState: DesktopState = {
  history: createSceneHistory(fixtureScene),
  selectedEntityId: "dbx:apparatus:core",
  lastReceipt: null,
  lastError: null,
};

const desktopProposalRequester = { actorId: "desktop-user", role: "requester" as const };
const desktopProposalReviewer = { actorId: "desktop-user", role: "reviewer" as const };

function desktopReducer(state: DesktopState, action: DesktopAction): DesktopState {
  if (action.kind === "select") return { ...state, selectedEntityId: action.entityId };
  if (action.kind === "replace") return {
    history: createSceneHistory(action.document),
    selectedEntityId: action.document.entities.some((entity) => entity.id === state.selectedEntityId)
      ? state.selectedEntityId
      : action.document.entities[0]?.id ?? "",
    lastReceipt: null,
    lastError: null,
  };
  try {
    const history = action.kind === "execute"
      ? executeSceneCommand(state.history, action.command)
      : action.kind === "undo"
        ? undoSceneHistory(state.history)
        : redoSceneHistory(state.history);
    return {
      ...state,
      history,
      lastReceipt: history.receipts.at(-1) ?? state.lastReceipt,
      lastError: null,
    };
  } catch (error) {
    return { ...state, lastError: error instanceof Error ? error.message : String(error) };
  }
}

function parseStoredScene(sceneJson: string): SceneDocument {
  return migrateSceneDocument(JSON.parse(sceneJson) as MigratableSceneDocument);
}

function parseActiveStoredScene(response: ProjectLoadResponse): SceneDocument {
  const scenes = response.scenesJson.map(parseStoredScene);
  const active = scenes.find((scene) => scene.id === response.activeSceneId);
  if (!active) throw new Error("The persisted active Scene is absent from the project collection.");
  return active;
}

const integerFormatter = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });

function formatWindowDuration(minutes: number | null): string {
  if (minutes === null) return "window duration unavailable";
  if (minutes % 1440 === 0) return `${integerFormatter.format(minutes / 1440)}-day window`;
  if (minutes % 60 === 0) return `${integerFormatter.format(minutes / 60)}-hour window`;
  return `${integerFormatter.format(minutes)}-minute window`;
}

function formatRateLimit(metadata: CodexRateLimitMetadata | null): string {
  if (!metadata) return "rate limits unavailable";
  const label = metadata.limitName ?? metadata.limitId ?? "managed limit";
  const windows = [metadata.primary, metadata.secondary]
    .filter((window): window is NonNullable<typeof window> => window !== null)
    .map((window, index) => {
      const percent = Number.isInteger(window.usedPercent) ? window.usedPercent.toFixed(0) : window.usedPercent.toFixed(1);
      const reset = window.resetsAt === null
        ? "reset unavailable"
        : `resets ${new Date(window.resetsAt * 1000).toLocaleString()}`;
      return `${index === 0 ? "primary" : "secondary"} ${percent}% used · ${formatWindowDuration(window.windowDurationMins)} · ${reset}`;
    });
  const state = metadata.rateLimitReachedType
    ? ` · reached ${metadata.rateLimitReachedType}`
    : metadata.spendControlReached === true ? " · spend control reached" : "";
  return `rate limit ${label}${windows.length > 0 ? ` · ${windows.join(" · ")}` : " · windows unavailable"}${state}`;
}

function formatUsage(metadata: CodexUsageMetadata | null): string {
  if (!metadata) return "usage summary unavailable";
  const values = [
    metadata.lifetimeTokens === null ? null : `${integerFormatter.format(metadata.lifetimeTokens)} lifetime tokens`,
    metadata.peakDailyTokens === null ? null : `${integerFormatter.format(metadata.peakDailyTokens)} peak daily tokens`,
    metadata.currentStreakDays === null ? null : `${integerFormatter.format(metadata.currentStreakDays)}-day current streak`,
    `${integerFormatter.format(metadata.dailyBucketCount)} daily buckets`,
  ].filter((value): value is string => value !== null);
  return `usage ${values.join(" · ")}`;
}

export function App() {
  const [state, dispatch] = useReducer(desktopReducer, initialState);
  const commandSequence = useRef(0);
  const geometrySelfTestStarted = useRef(false);
  const geometrySelfTestUndoStarted = useRef(false);
  const geometrySelfTestRereadStarted = useRef(false);
  const projectSelfTestStarted = useRef(false);
  const projectCreateUiSelfTestStage = useRef<"idle" | "previewed" | "approved" | "applied">("idle");
  const projectCreateUiSelfTestFinished = useRef(false);
  const projectSaveUiSelfTestStage = useRef<"idle" | "loaded" | "edited" | "previewed" | "approved" | "applied">("idle");
  const projectSaveUiSelfTestFinished = useRef(false);
  const projectRenameUiSelfTestStage = useRef<"idle" | "loaded" | "named" | "previewed" | "approved" | "applied">("idle");
  const projectRenameUiSelfTestFinished = useRef(false);
  const projectRenameUiSelfTestOriginalName = useRef<string | null>(null);
  const projectRenameUiSelfTestProposedName = useRef<string | null>(null);
  const projectSaveAsUiSelfTestStage = useRef<"idle" | "loaded" | "named" | "previewed" | "approved" | "applied">("idle");
  const projectSaveAsUiSelfTestFinished = useRef(false);
  const projectSaveAsAssetUiSelfTestStage = useRef<"idle" | "loaded" | "named" | "previewed" | "approved" | "applied">("idle");
  const projectSaveAsAssetUiSelfTestFinished = useRef(false);
  const projectHandoutUiSelfTestStage = useRef<"idle" | "loaded" | "previewed" | "approved" | "applied">("idle");
  const projectHandoutUiSelfTestFinished = useRef(false);
  const projectBackgroundUiSelfTestStage = useRef<"idle" | "loaded" | "previewed" | "approved" | "applied">("idle");
  const projectBackgroundUiSelfTestFinished = useRef(false);
  const projectAudioUiSelfTestStage = useRef<"idle" | "loaded" | "previewed" | "approved" | "applied">("idle");
  const projectAudioUiSelfTestFinished = useRef(false);
  const projectTokenUiSelfTestStage = useRef<"idle" | "loaded" | "previewed" | "approved" | "applied">("idle");
  const projectTokenUiSelfTestFinished = useRef(false);
  const projectAssetRestoreUiSelfTestStage = useRef<"idle" | "loaded" | "previewed" | "approved" | "applied">("idle");
  const projectAssetRestoreUiSelfTestFinished = useRef(false);
  const projectAssetDetachUiSelfTestStage = useRef<"idle" | "loaded" | "previewing" | "previewed" | "approving" | "approved" | "applying">("idle");
  const projectAssetDetachUiSelfTestFinished = useRef(false);
  const projectAssetDetachUiSelfTestPreview = useRef<MissingAssetDetachPreviewReceipt | null>(null);
  const projectBrokenReferenceUiSelfTestStage = useRef<"idle" | "loaded" | "previewing" | "previewed" | "approving" | "approved" | "applying">("idle");
  const projectBrokenReferenceUiSelfTestFinished = useRef(false);
  const projectBrokenReferenceUiSelfTestPreview = useRef<BrokenReferenceDetachPreviewReceipt | null>(null);
  const projectBrokenReferenceUiSelfTestOwnershipToken = useRef<string | null>(null);
  const projectBrokenReferenceUiSelfTestExpectedBatch = useRef<ProposalBatch | null>(null);
  const projectBrokenReferenceUiSelfTestOwnership = useRef<DesktopBrokenReferenceUiOwnershipExpectation | null>(null);
  const projectProposalSessionPersistenceScope = useRef<DesktopProjectProposalSessionScope>("ordinary");
  const projectAddSceneUiSelfTestStage = useRef<"idle" | "loaded" | "previewed" | "approved" | "applied">("idle");
  const projectAddSceneUiSelfTestFinished = useRef(false);
  const backupPromotionUiSelfTestStage = useRef<"idle" | "fixture" | "previewed" | "approved" | "applied" | "executing">("idle");
  const backupPromotionUiSelfTestFinished = useRef(false);
  const crossProducerCommitRecoverySelfTestStarted = useRef(false);
  const backupPromotionUiSessionResetStage = useRef<"idle" | "loading" | "cancelling" | "clearing" | "cleared" | "verifying">("idle");
  const backupPromotionUiSessionResetFinished = useRef(false);
  const backupPromotionUiSessionInspectionFinished = useRef(false);
  const backupPromotionUiSessionStatusInspectionFinished = useRef(false);
  const nativeGeometryAvailable = isNativeGeometryAvailable();
  const [geometryBusy, setGeometryBusy] = useState(false);
  const [geometryReceipt, setGeometryReceipt] = useState<GeometryBatchReceipt | null>(null);
  const [geometrySelfTestReread, setGeometrySelfTestReread] = useState<GeometryBatchReceipt | null>(null);
  const [geometryError, setGeometryError] = useState<string | null>(null);
  const nativeProjectStoreAvailable = isNativeProjectStoreAvailable();
  const [projectBusy, setProjectBusy] = useState(false);
  const [projectCatalog, setProjectCatalog] = useState<readonly ProjectCatalogEntry[]>([]);
  const projectCatalogRef = useRef<HTMLSelectElement | null>(null);
  const projectCatalogFocusInitialized = useRef(false);
  const [projectCatalogFocusStatus, setProjectCatalogFocusStatus] = useState<"not-focused" | "focused">("not-focused");
  const [projectSelectorRecoveryStatus, setProjectSelectorRecoveryStatus] = useState("not invoked");
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [projectScenes, setProjectScenes] = useState<readonly SceneDocument[]>([fixtureScene]);
  const [projectPersistedSceneJson, setProjectPersistedSceneJson] = useState<readonly string[] | null>(null);
  const [activeSceneId, setActiveSceneId] = useState(fixtureScene.id);
  const [projectNameInput, setProjectNameInput] = useState("New Campaign");
  const [projectGeneration, setProjectGeneration] = useState(0);
  const [handoutAssetId, setHandoutAssetId] = useState<string | null>(null);
  const [audioAssetId, setAudioAssetId] = useState<string | null>(null);
  const [tokenAssetId, setTokenAssetId] = useState<string | null>(null);
  const [workspaceIndexGeneration, setWorkspaceIndexGeneration] = useState(0);
  const [workspaceMetadataWarning, setWorkspaceMetadataWarning] = useState<string | null>(null);
  const [projectSaveReceipt, setProjectSaveReceipt] = useState<ProjectSaveReceipt | null>(null);
  const [projectLoadResponse, setProjectLoadResponse] = useState<ProjectLoadResponse | null>(null);
  const [foundryPreview, setFoundryPreview] = useState<SceneFoundryPreview | null>(null);
  const [projectError, setProjectError] = useState<string | null>(null);
  const [projectCloseNotice, setProjectCloseNotice] = useState<string | null>(null);
  const [migrationExplanation, setMigrationExplanation] = useState<ProjectMigrationExplanationReceipt | null>(null);
  const [migrationPersistPreview, setMigrationPersistPreview] = useState<ProjectMigrationPersistPreviewReceipt | null>(null);
  const [migrationPersistReceipt, setMigrationPersistReceipt] = useState<ProjectMigrationPersistReceipt | null>(null);
  const [backupPromotionPreview, setBackupPromotionPreview] = useState<BackupRecoveryPromotionPreviewReceipt | null>(null);
  const [backupPromotionReceipt, setBackupPromotionReceipt] = useState<BackupRecoveryPromotionReceipt | null>(null);
  const [projectRenamePreview, setProjectRenamePreview] = useState<ProjectRenamePreview | null>(null);
  const [projectCreatePreview, setProjectCreatePreview] = useState<ProjectCreatePreview | null>(null);
  const [projectSavePreview, setProjectSavePreview] = useState<ProjectSavePreview | null>(null);
  const [projectSaveAsPreview, setProjectSaveAsPreview] = useState<ProjectSaveAsPreview | null>(null);
  const [projectSaveAsContent, setProjectSaveAsContent] = useState<Readonly<{ scenes: readonly SceneDocument[]; activeSceneId: string }> | null>(null);
  const [projectHandoutPreview, setProjectHandoutPreview] = useState<ProjectHandoutAssetRegistrationPreview | null>(null);
  const [projectHandoutContent, setProjectHandoutContent] = useState<ProjectHandoutAssetContent | null>(null);
  const [projectBackgroundPreview, setProjectBackgroundPreview] = useState<ProjectAssetBindingPreview | null>(null);
  const [projectBackgroundContent, setProjectBackgroundContent] = useState<ProjectAssetBindingContent | null>(null);
  const [projectAudioPreview, setProjectAudioPreview] = useState<ProjectAudioAssetRegistrationPreview | null>(null);
  const [projectAudioContent, setProjectAudioContent] = useState<ProjectAudioAssetContent | null>(null);
  const [projectTokenPreview, setProjectTokenPreview] = useState<ProjectTokenAssetRegistrationPreview | null>(null);
  const [projectTokenContent, setProjectTokenContent] = useState<ProjectTokenAssetContent | null>(null);
  const [projectSaveContent, setProjectSaveContent] = useState<ProjectSaveContent | null>(null);
  const [projectSaveInverseContent, setProjectSaveInverseContent] = useState<ProjectSaveContent | null>(null);
  const [projectProposalSession, setProjectProposalSession] = useState<DesktopProjectProposalSession | null>(null);
  const [projectProposalSessionStatus, setProjectProposalSessionStatus] = useState("Project recovery proposal session not loaded.");
  const [projectProposalSessionError, setProjectProposalSessionError] = useState<string | null>(null);
  const projectAddSceneUndoRef = useRef<null | Readonly<{
    batchId: string;
    store: ProjectAddSceneStore;
    inverseState: ProjectAddSceneState;
  }>>(null);
  const [recoveryInspection, setRecoveryInspection] = useState<ProjectRecoveryInspectionReceipt | null>(null);
  const [selectedRecoveryAssetId, setSelectedRecoveryAssetId] = useState<string | null>(null);
  const [recoveryPreview, setRecoveryPreview] = useState<MissingAssetRestorePreviewReceipt | null>(null);
  const [recoveryCandidateBytes, setRecoveryCandidateBytes] = useState<readonly number[] | null>(null);
  const [recoveryReceipt, setRecoveryReceipt] = useState<MissingAssetRestoreReceipt | null>(null);
  const [detachPreview, setDetachPreview] = useState<MissingAssetDetachPreviewReceipt | null>(null);
  const [detachReceipt, setDetachReceipt] = useState<MissingAssetDetachReceipt | null>(null);
  const [selectedBrokenReferenceKey, setSelectedBrokenReferenceKey] = useState<string | null>(null);
  const [brokenReferencePreview, setBrokenReferencePreview] = useState<BrokenReferenceDetachPreviewReceipt | null>(null);
  const [brokenReferenceReceipt, setBrokenReferenceReceipt] = useState<BrokenReferenceDetachReceipt | null>(null);
  const [directorProposal, setDirectorProposal] = useState<DirectorReviewReceipt | null>(null);
  const [directorProposalSession, setDirectorProposalSession] = useState<DesktopProposalSession | null>(null);
  const [directorProposalSessionStatus, setDirectorProposalSessionStatus] = useState("Proposal session not loaded.");
  const pendingDirectorProposalReread = useRef<null | Readonly<{
    kind: "commit" | "undo" | "redo";
    session: DesktopProposalSession;
    expectedRevision: number;
    expectedSha256: string;
  }>>(null);
  const [directorBusy, setDirectorBusy] = useState(false);
  const [directorError, setDirectorError] = useState<string | null>(null);
  const [directorApiKey, setDirectorApiKey] = useState("");
  const [directorCredentialBusy, setDirectorCredentialBusy] = useState(false);
  const [directorCredential, setDirectorCredential] = useState<CampaignDirectorCredentialStatus | null>(null);
  const [directorCredentialError, setDirectorCredentialError] = useState<string | null>(null);
  const [directorProviderMode, setDirectorProviderMode] = useState<CampaignDirectorProviderMode>("chatgpt-subscription");
  const [directorPrompt, setDirectorPrompt] = useState("");
  const [directorConversation, setDirectorConversation] = useState<CampaignDirectorConversation>(() => createCampaignDirectorConversation({
    conversationId: DESKTOP_CAMPAIGN_DIRECTOR_CONVERSATION_ID,
    projectId: DESKTOP_CAMPAIGN_DIRECTOR_FIXTURE_PROJECT_ID,
  }));
  const directorConversationRef = useRef(directorConversation);
  const directorTurnSequence = useRef(0);
  const directorPersistenceProjectRef = useRef<string | null>(null);
  const [directorPersistenceReady, setDirectorPersistenceReady] = useState(false);
  const [directorPersistenceStatus, setDirectorPersistenceStatus] = useState("Conversation persistence not loaded.");
  const nativeCampaignDirectorAvailable = isNativeCampaignDirectorAvailable();
  const nativeCodexProbeAvailable = isNativeCodexProbeAvailable();
  const [codexProbeBusy, setCodexProbeBusy] = useState(false);
  const [codexAccount, setCodexAccount] = useState<CodexAccountProbe | null>(null);
  const [codexProbeError, setCodexProbeError] = useState<string | null>(null);
  const [codexJobBusy, setCodexJobBusy] = useState(false);
  const [codexJobReceipt, setCodexJobReceipt] = useState<CodexTechnicalJobReceipt | null>(null);
  const [codexJobError, setCodexJobError] = useState<string | null>(null);
  const document = state.history.present;
  const directorProjectId = activeProjectId ?? DESKTOP_CAMPAIGN_DIRECTOR_FIXTURE_PROJECT_ID;
  const currentProjectScenes = useMemo(() => projectScenes.map((scene) => scene.id === activeSceneId ? document : scene), [activeSceneId, document, projectScenes]);
  const projectDirty = useMemo(
    () => activeProjectId !== null && projectSessionIsDirty(currentProjectScenes, projectPersistedSceneJson),
    [activeProjectId, currentProjectScenes, projectPersistedSceneJson],
  );
  const selectedCatalogEntry = useMemo(() => projectCatalog.find((entry) => entry.projectId === selectedProjectId) ?? null, [projectCatalog, selectedProjectId]);
  const projectProposalInspection = useMemo(
    () => projectProposalSession ? inspectDesktopProjectProposalSession(projectProposalSession) : null,
    [projectProposalSession],
  );
  const projectReviewApplyCoverage = useMemo(
    () => projectProposalSession ? inspectTypedLocalProjectReviewApplyCoverage(projectProposalSession) : null,
    [projectProposalSession],
  );
  const projectTerminalHistoryEvidenceIndex = useMemo(
    () => inspectProjectTerminalHistoryEvidenceIndex(),
    [],
  );
  const selectedRecoveryAsset = useMemo(
    () => recoveryInspection?.registeredAssets.find((asset) => asset.assetId === selectedRecoveryAssetId && asset.restoreEligible) ?? null,
    [recoveryInspection, selectedRecoveryAssetId],
  );
  const selectedBrokenReference = useMemo(
    () => recoveryInspection?.brokenSceneReferences.find((reference) => `${reference.sceneId}:${reference.assetId}` === selectedBrokenReferenceKey) ?? null,
    [recoveryInspection, selectedBrokenReferenceKey],
  );
  const [harnessReceipt, setHarnessReceipt] = useState<null | Readonly<{
    operation: "dicebox.desktop.utility-harness.inspect";
    status: "PASS" | "BLOCKED";
    documentId: string;
    revision: number;
    projectedEntities: number;
    synchronizedViews: 2;
    originParity: boolean;
    validationErrors: readonly string[];
    noWrite: true;
  }>>(null);
  const selected = document.entities.find((entity) => entity.id === state.selectedEntityId) ?? document.entities[0];
  const errors = useMemo(() => validateSceneDocument(document), [document]);
  const directorProposalInspection = useMemo(
    () => directorProposalSession ? inspectDesktopProposalSession(directorProposalSession) : null,
    [directorProposalSession],
  );
  const commitDirectorConversation = useCallback((conversation: CampaignDirectorConversation) => {
    directorConversationRef.current = conversation;
    setDirectorConversation(conversation);
  }, []);
  const select = useCallback((entityId: string) => dispatch({ kind: "select", entityId }), []);
  const nudge = useCallback(async (deltaX: number, deltaY: number) => {
    if (!selected || selected.locked) return;
    const activeStatus = directorProposalSession?.history.status;
    if (activeStatus && !["rejected", "cancelled", "stale", "committed", "recovered", "undone", "redone"].includes(activeStatus)) {
      setDirectorError(`Resolve the current ${activeStatus} proposal session before staging another proposal.`);
      return;
    }
    commandSequence.current += 1;
    const sequence = commandSequence.current;
    const command: SceneCommand = {
      schemaVersion: "0.1.0",
      kind: "translate-entity",
      commandId: `desktop-human-${sequence}`,
      baseRevision: document.revision,
      entityId: state.selectedEntityId,
      deltaX,
      deltaY,
      origin: { kind: "human", principalId: "desktop-user", reason: "Desktop inspector movement preview" },
    };
    try {
      const session = await createHumanDesktopProposalSession({
        projectId: directorProjectId,
        batchId: `dbx:proposal:desktop-human-${sequence}`,
        command,
        document,
        requester: desktopProposalRequester,
        observedAt: new Date().toISOString(),
      });
      await saveDesktopProposalSession(browserDesktopProposalSessionStorage(), directorProjectId, document.id, session);
      setDirectorProposal(null);
      setDirectorProposalSession(session);
      setDirectorProposalSessionStatus("Human movement preview persisted; Scene content unchanged until explicit approval and Apply.");
      setDirectorError(null);
    } catch (error) {
      setDirectorError(error instanceof Error ? error.message : String(error));
    }
  }, [directorProjectId, directorProposalSession?.history.status, document, selected, state.selectedEntityId]);

  const applyPosition = useCallback((event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selected || selected.locked) return;
    const form = new FormData(event.currentTarget);
    const nextX = Number(form.get("x"));
    const nextY = Number(form.get("y"));
    if (!Number.isFinite(nextX) || !Number.isFinite(nextY)) return;
    const deltaX = nextX - selected.x;
    const deltaY = nextY - selected.y;
    if (deltaX === 0 && deltaY === 0) return;
    void nudge(deltaX, deltaY);
  }, [nudge, selected]);

  const stageDirectorProposal = useCallback(async (review: DirectorReviewReceipt, provider: string, sequence: number) => {
    if (review.status !== "PASS") {
      setDirectorProposal(review);
      return;
    }
    const activeStatus = directorProposalSession?.history.status;
    if (activeStatus && !["rejected", "cancelled", "stale", "committed", "recovered", "undone", "redone"].includes(activeStatus)) {
      throw new Error(`Resolve the current ${activeStatus} proposal session before staging another proposal.`);
    }
    const observedAt = new Date().toISOString();
    const session = await createCampaignDirectorDesktopProposalSession({
      projectId: directorProjectId,
      batchId: `dbx:proposal:desktop-director-${sequence}`,
      receipt: review,
      provider,
      document,
      requester: desktopProposalRequester,
      observedAt,
    });
    await saveDesktopProposalSession(browserDesktopProposalSessionStorage(), directorProjectId, document.id, session);
    setDirectorProposal(review);
    setDirectorProposalSession(session);
    setDirectorProposalSessionStatus("Preview persisted; project content unchanged.");
  }, [directorProjectId, directorProposalSession?.history.status, document]);

  const runDirectorTurn = useCallback(async (rawPrompt: string, retryOfTurnId: string | null = null) => {
    const prompt = rawPrompt.trim();
    if (!prompt || !selected || selected.locked) return;
    const sequence = Math.max(directorTurnSequence.current + 1, directorConversationRef.current.revision + 1);
    directorTurnSequence.current = sequence;
    const turnId = `dbx:turn:desktop-${sequence}`;
    const userMessageId = `dbx:message:desktop-user-${sequence}`;
    const assistantMessageId = `dbx:message:desktop-assistant-${sequence}`;
    const contextSummary = {
      projectId: directorProjectId,
      sceneId: document.id,
      revision: document.revision,
      sceneCount: currentProjectScenes.length,
      activeSceneId,
      entityCount: document.entities.length,
      selectedEntityId: selected.id,
    };
    const citations = desktopSceneCitation(sequence, document.id);
    let nextConversation = beginCampaignDirectorTurn(directorConversationRef.current, {
      turnId,
      userMessageId,
      content: prompt,
      contextBudget: desktopSceneContextBudget(contextSummary),
      retryOfTurnId,
    });
    commitDirectorConversation(nextConversation);
    setDirectorPrompt("");
    setDirectorError(null);

    const activeTurn = nextConversation.turns.find((turn) => turn.turnId === turnId)!;
    if (directorProviderMode === "offline") {
      commitDirectorConversation(failCampaignDirectorTurn(nextConversation, turnId, true));
      setDirectorProposal(null);
      setDirectorError("AI offline mode is selected; the turn is preserved for retry and no provider request was sent.");
      return;
    }

    if (activeTurn.intent === "explain" || activeTurn.intent === "inspect") {
      const answer = `Project ${directorProjectId} has ${currentProjectScenes.length} Scene${currentProjectScenes.length === 1 ? "" : "s"}. Active Scene ${document.id} is revision ${document.revision} with ${document.entities.length} semantic entities; selected entity ${selected.id} is ${selected.locked ? "locked" : "editable"}.`;
      const completed = completeCampaignDirectorAnswer(nextConversation, { turnId, assistantMessageId, content: answer, citations });
      commitDirectorConversation(completed.conversation);
      setDirectorProposal(null);
      return;
    }

    commandSequence.current += 1;
    const localCall = {
      id: `desktop-director-call-${commandSequence.current}`,
      type: "function_call" as const,
      name: "propose_scene_command",
      arguments: JSON.stringify({
        commandId: `desktop-director-${commandSequence.current}`,
        baseRevision: document.revision,
        entityId: selected.id,
        deltaX: 8,
        deltaY: 0,
        reason: prompt,
      }),
    };
    if (!nativeCampaignDirectorAvailable) {
      const review = reviewCampaignDirectorFunctionCall(document, localCall);
      if (review.status === "PASS") {
        await stageDirectorProposal(review, "local-fixture", sequence);
        const completed = completeCampaignDirectorProposal(nextConversation, {
          turnId,
          assistantMessageId,
          content: `Typed proposal ${review.command.commandId} is ready for review and has not changed project state.`,
          citations,
          proposalReceiptId: `dbx:receipt:desktop-proposal-${sequence}`,
        });
        commitDirectorConversation(completed.conversation);
      } else {
        setDirectorProposal(review);
        commitDirectorConversation(failCampaignDirectorTurn(nextConversation, turnId));
        setDirectorError(review.reason);
      }
      return;
    }
    setDirectorBusy(true);
    try {
      const selection = selectCampaignDirectorProvider({
        requested: directorProviderMode,
        subscriptionAvailable: codexAccount?.status === "PASS" && codexAccount.authMode?.toLowerCase().includes("chatgpt") === true,
        apiKeyConfigured: directorCredential?.configured ?? codexAccount?.campaignDirectorApiKeyConfigured ?? false,
      });
      if (selection.status === "BLOCKED") {
        commitDirectorConversation(failCampaignDirectorTurn(nextConversation, turnId));
        setDirectorProposal(null);
        setDirectorError(selection.reason);
        return;
      }
      if (selection.selected === "offline") {
        commitDirectorConversation(failCampaignDirectorTurn(nextConversation, turnId, true));
        setDirectorProposal(null);
        setDirectorError("AI offline mode is selected; no provider request was sent.");
        return;
      }
      const response = selection.selected === "chatgpt-subscription"
        ? await requestManagedCampaignDirector({
          userIntent: prompt,
          document: {
            id: document.id,
            revision: document.revision,
            width: document.width,
            height: document.height,
            entities: document.entities.map(({ id, kind, name, x, y, width, height, locked }) => ({ id, kind, name, x, y, width, height, locked })),
          },
          knowledge: [{ id: document.id, kind: "fact", text: JSON.stringify(contextSummary), sourceId: "desktop-current-scene" }],
        })
        : await requestCampaignDirector(buildCampaignDirectorResponseRequest({
          model: "gpt-5.4-mini",
          userIntent: prompt,
          document,
          knowledge: [{ id: document.id, kind: "fact", text: JSON.stringify(contextSummary), sourceId: "desktop-current-scene" }],
        }));
      const currentTurn = directorConversationRef.current.turns.find((turn) => turn.turnId === turnId);
      if (!currentTurn || currentTurn.status !== "streaming") return;
      const review = reviewCampaignDirectorResponse(document, response);
      if (review.status === "PASS") {
        await stageDirectorProposal(review, selection.selected, sequence);
        const completed = completeCampaignDirectorProposal(directorConversationRef.current, {
          turnId,
          assistantMessageId,
          content: `Typed proposal ${review.command.commandId} is ready for review and has not changed project state.`,
          citations,
          proposalReceiptId: `dbx:receipt:desktop-proposal-${sequence}`,
        });
        commitDirectorConversation(completed.conversation);
      } else {
        setDirectorProposal(review);
        commitDirectorConversation(failCampaignDirectorTurn(directorConversationRef.current, turnId));
        setDirectorError(review.reason);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      const currentTurn = directorConversationRef.current.turns.find((turn) => turn.turnId === turnId);
      if (currentTurn?.status === "streaming") commitDirectorConversation(failCampaignDirectorTurn(directorConversationRef.current, turnId));
      setDirectorError(message);
    } finally {
      setDirectorBusy(false);
    }
  }, [activeSceneId, codexAccount, commitDirectorConversation, currentProjectScenes.length, directorCredential, directorProjectId, directorProviderMode, document, nativeCampaignDirectorAvailable, selected, stageDirectorProposal]);

  const submitDirectorPrompt = useCallback((event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void runDirectorTurn(directorPrompt);
  }, [directorPrompt, runDirectorTurn]);

  const cancelDirectorRequest = useCallback(() => {
    const streaming = [...directorConversationRef.current.turns].reverse().find((turn) => turn.status === "streaming");
    if (!streaming) return;
    commitDirectorConversation(cancelCampaignDirectorTurn(directorConversationRef.current, streaming.turnId));
    setDirectorBusy(false);
    setDirectorError("Campaign Director turn cancelled; late provider output will be ignored and history is preserved.");
  }, [commitDirectorConversation]);

  const retryDirectorRequest = useCallback(() => {
    const retryable = [...directorConversationRef.current.turns].reverse().find((turn) => ["cancelled", "blocked", "offline"].includes(turn.status));
    if (!retryable) return;
    const message = directorConversationRef.current.messages.find((item) => item.messageId === retryable.userMessageId);
    if (!message) return;
    void runDirectorTurn(message.content, retryable.turnId);
  }, [runDirectorTurn]);

  const persistDirectorProposalSession = useCallback(async (session: DesktopProposalSession, status: string) => {
    await saveDesktopProposalSession(browserDesktopProposalSessionStorage(), session.projectId, session.sceneId, session);
    setDirectorProposalSession(session);
    setDirectorProposalSessionStatus(status);
  }, []);

  const applyDirectorProposal = useCallback(async () => {
    if (!directorProposalSession || directorProposalSession.history.status !== "approved") return;
    try {
      const prepared = await prepareDesktopProposalApplication({
        session: directorProposalSession,
        projectId: directorProjectId,
        document,
        executor: desktopProposalReviewer,
        observedAt: new Date().toISOString(),
      });
      await persistDirectorProposalSession(prepared.applyingSession, "Applying exact approved Scene command; authoritative reread pending.");
      pendingDirectorProposalReread.current = {
        kind: "commit",
        session: prepared.applyingSession,
        expectedRevision: prepared.expectedDocument.revision,
        expectedSha256: prepared.expectedSha256,
      };
      dispatch({ kind: "execute", command: prepared.command });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      if (/stale/i.test(message)) {
        const stale = await invalidateStaleDesktopProposalSession(directorProposalSession, desktopProposalReviewer, new Date().toISOString());
        await persistDirectorProposalSession(stale, "Proposal invalidated because the exact Scene base drifted.");
      } else {
        setDirectorError(message);
      }
    }
  }, [directorProjectId, directorProposalSession, document, persistDirectorProposalSession]);

  const approveDirectorProposal = useCallback(async () => {
    if (!directorProposalSession || directorProposalSession.history.status !== "previewed") return;
    try {
      const approved = await approveDesktopProposalSession(directorProposalSession, desktopProposalReviewer, {
        targetId: document.id,
        revision: document.revision,
        sha256: await sha256SceneDocument(document),
      }, new Date().toISOString());
      await persistDirectorProposalSession(approved, "Approved for this exact Scene revision and hash; no write yet.");
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      if (/stale/i.test(message)) {
        const stale = await invalidateStaleDesktopProposalSession(directorProposalSession, desktopProposalReviewer, new Date().toISOString());
        await persistDirectorProposalSession(stale, "Proposal invalidated because the exact Scene base drifted.");
      } else setDirectorError(message);
    }
  }, [directorProposalSession, document, persistDirectorProposalSession]);

  const rejectDirectorProposal = useCallback(async () => {
    if (!directorProposalSession || directorProposalSession.history.status !== "previewed") return;
    try {
      await persistDirectorProposalSession(
        await rejectDesktopProposalSession(directorProposalSession, desktopProposalReviewer, new Date().toISOString()),
        "Proposal rejected; project content unchanged.",
      );
    } catch (error) {
      setDirectorError(error instanceof Error ? error.message : String(error));
    }
  }, [directorProposalSession, persistDirectorProposalSession]);

  const cancelDirectorProposal = useCallback(async () => {
    if (!directorProposalSession || !["previewed", "approved"].includes(directorProposalSession.history.status)) return;
    try {
      await persistDirectorProposalSession(
        await cancelDesktopProposalSession(directorProposalSession, desktopProposalRequester, new Date().toISOString()),
        "Proposal cancelled; project content unchanged.",
      );
    } catch (error) {
      setDirectorError(error instanceof Error ? error.message : String(error));
    }
  }, [directorProposalSession, persistDirectorProposalSession]);

  const editDirectorProposal = useCallback(async () => {
    if (!directorProposalSession || directorProposalSession.history.status !== "previewed") return;
    try {
      const commands = directorProposalSession.batch.commands.map((command) => {
        const deltaX = command.payload.deltaX;
        if (typeof deltaX !== "number" || !Number.isFinite(deltaX)) throw new Error("The reviewed proposal does not expose an editable X movement.");
        return { ...command, payload: { ...command.payload, deltaX: deltaX * 2 } };
      });
      await persistDirectorProposalSession(
        await editDesktopProposalSession(directorProposalSession, desktopProposalReviewer, commands, new Date().toISOString()),
        "Edited proposal persisted as a new hash-bound revision; approval reset.",
      );
    } catch (error) {
      setDirectorError(error instanceof Error ? error.message : String(error));
    }
  }, [directorProposalSession, persistDirectorProposalSession]);

  const undoDesktopHistory = useCallback(async () => {
    if (state.history.past.length === 0) return;
    const session = directorProposalSession;
    if (session && ["committed", "redone"].includes(session.history.status)) {
      const latestRereadHash = [...session.history.receipts].reverse().find((receipt) => receipt.reread?.status === "matched")?.reread?.sha256;
      if (latestRereadHash === await sha256SceneDocument(document)) {
        const expected = proposalHistoryRereadTarget(state.history, "undo");
        pendingDirectorProposalReread.current = {
          kind: "undo",
          session,
          expectedRevision: expected.revision,
          expectedSha256: await sha256SceneDocument(expected),
        };
      }
    }
    dispatch({ kind: "undo" });
  }, [directorProposalSession, document, state.history.past]);

  const redoDesktopHistory = useCallback(async () => {
    if (state.history.future.length === 0) return;
    const session = directorProposalSession;
    if (session?.history.status === "undone") {
      const latestRereadHash = [...session.history.receipts].reverse().find((receipt) => receipt.reread?.status === "matched")?.reread?.sha256;
      if (latestRereadHash === await sha256SceneDocument(document)) {
        const expected = proposalHistoryRereadTarget(state.history, "redo");
        pendingDirectorProposalReread.current = {
          kind: "redo",
          session,
          expectedRevision: expected.revision,
          expectedSha256: await sha256SceneDocument(expected),
        };
      }
    }
    dispatch({ kind: "redo" });
  }, [directorProposalSession, document, state.history]);

  useEffect(() => {
    let active = true;
    void (async () => {
      const loaded = await loadDesktopProposalSession(browserDesktopProposalSessionStorage(), directorProjectId, document.id);
      if (!active) return;
      if (loaded.status === "PASS") {
        setDirectorProposalSession(loaded.session);
        setDirectorProposalSessionStatus(`Restored exact proposal session · ${loaded.session.history.status}.`);
      } else if (loaded.status === "MISSING") {
        setDirectorProposalSession(null);
        setDirectorProposalSessionStatus("No proposal session is stored for this exact project and Scene.");
      } else {
        setDirectorProposalSession(null);
        setDirectorProposalSessionStatus(`${loaded.code}: ${loaded.reason}`);
      }
    })().catch((error: unknown) => {
      if (active) setDirectorProposalSessionStatus(error instanceof Error ? error.message : String(error));
    });
    return () => { active = false; };
  }, [directorProjectId, document.id]);

  useEffect(() => {
    const session = directorProposalSession;
    if (!session || !["previewed", "approved"].includes(session.history.status) || session.projectId !== directorProjectId || session.sceneId !== document.id) return;
    let active = true;
    void (async () => {
      const currentSha256 = await sha256SceneDocument(document);
      if (!active || currentSha256 === session.batch.base.sha256 && document.revision === session.batch.base.revision) return;
      const stale = await invalidateStaleDesktopProposalSession(session, desktopProposalReviewer, new Date().toISOString());
      await persistDirectorProposalSession(stale, "Proposal invalidated automatically because the exact Scene base drifted.");
    })().catch((error: unknown) => {
      if (active) setDirectorError(error instanceof Error ? error.message : String(error));
    });
    return () => { active = false; };
  }, [directorProjectId, directorProposalSession, document, persistDirectorProposalSession]);

  useEffect(() => {
    const pending = pendingDirectorProposalReread.current;
    if (!pending || document.revision !== pending.expectedRevision) return;
    let active = true;
    void (async () => {
      const observedSha256 = await sha256SceneDocument(document);
      if (!active || pendingDirectorProposalReread.current !== pending) return;
      if (observedSha256 !== pending.expectedSha256) {
        const unknown = pending.session.history.status === "applying"
          ? await markDesktopProposalOutcomeUnknown(pending.session, desktopProposalReviewer, new Date().toISOString())
          : pending.session;
        await persistDirectorProposalSession(unknown, "Authoritative reread did not match the expected Scene hash; retry is blocked.");
        pendingDirectorProposalReread.current = null;
        return;
      }
      const reread = { status: "matched" as const, targetId: pending.session.batch.base.targetId, revision: document.revision, sha256: observedSha256 };
      const completed = pending.kind === "commit"
        ? await commitDesktopProposalSession(pending.session, desktopProposalReviewer, reread, new Date().toISOString())
        : pending.kind === "undo"
          ? await undoDesktopProposalSession(pending.session, desktopProposalReviewer, reread, new Date().toISOString())
          : await redoDesktopProposalSession(pending.session, desktopProposalReviewer, reread, new Date().toISOString());
      await persistDirectorProposalSession(completed, `${pending.kind} confirmed by authoritative Scene revision and serialized hash reread.`);
      pendingDirectorProposalReread.current = null;
      if (pending.kind === "commit") setDirectorProposal(null);
    })().catch((error: unknown) => {
      if (active) setDirectorError(error instanceof Error ? error.message : String(error));
    });
    return () => { active = false; };
  }, [document, persistDirectorProposalSession]);

  const inspectCodexAccount = useCallback(async () => {
    if (!nativeCodexProbeAvailable) return;
    setCodexProbeBusy(true);
    setCodexProbeError(null);
    try {
      setCodexAccount(await probeCodexAccount());
    } catch (error) {
      setCodexProbeError(error instanceof Error ? error.message : String(error));
    } finally {
      setCodexProbeBusy(false);
    }
  }, [nativeCodexProbeAvailable]);

  const inspectDirectorCredential = useCallback(async () => {
    if (!nativeCampaignDirectorAvailable) return;
    setDirectorCredentialBusy(true);
    setDirectorCredentialError(null);
    try {
      setDirectorCredential(await campaignDirectorCredentialStatus());
    } catch (error) {
      setDirectorCredentialError(error instanceof Error ? error.message : String(error));
    } finally {
      setDirectorCredentialBusy(false);
    }
  }, [nativeCampaignDirectorAvailable]);

  const storeDirectorCredential = useCallback(async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!nativeCampaignDirectorAvailable || directorCredentialBusy || !directorApiKey) return;
    setDirectorCredentialBusy(true);
    setDirectorCredentialError(null);
    try {
      setDirectorCredential(await storeCampaignDirectorApiKey(directorApiKey));
      setDirectorApiKey("");
    } catch (error) {
      setDirectorApiKey("");
      setDirectorCredentialError(error instanceof Error ? error.message : String(error));
    } finally {
      setDirectorCredentialBusy(false);
    }
  }, [directorApiKey, directorCredentialBusy, nativeCampaignDirectorAvailable]);

  const clearDirectorCredential = useCallback(async () => {
    if (!nativeCampaignDirectorAvailable || directorCredentialBusy) return;
    setDirectorCredentialBusy(true);
    setDirectorCredentialError(null);
    setDirectorApiKey("");
    try {
      setDirectorCredential(await removeCampaignDirectorApiKey());
    } catch (error) {
      setDirectorCredentialError(error instanceof Error ? error.message : String(error));
    } finally {
      setDirectorCredentialBusy(false);
    }
  }, [directorCredentialBusy, nativeCampaignDirectorAvailable]);

  const runTechnicalBuilderAcceptance = useCallback(async () => {
    if (!nativeCodexProbeAvailable || codexJobBusy) return;
    setCodexJobBusy(true);
    setCodexJobError(null);
    try {
      setCodexJobReceipt(await runCodexTechnicalJob());
    } catch (error) {
      setCodexJobError(error instanceof Error ? error.message : String(error));
    } finally {
      setCodexJobBusy(false);
    }
  }, [codexJobBusy, nativeCodexProbeAvailable]);

  const runUtilityHarness = useCallback(() => {
    const parityCommand = {
      schemaVersion: "0.1.0",
      kind: "translate-entity",
      commandId: "utility-origin-parity",
      baseRevision: fixtureScene.revision,
      entityId: "dbx:apparatus:core",
      deltaX: 8,
      deltaY: 0,
    } as const;
    const human = applySceneCommand(fixtureScene, {
      ...parityCommand,
      origin: { kind: "human", principalId: "utility-human", reason: "Origin parity check" },
    });
    const ai = applySceneCommand(fixtureScene, {
      ...parityCommand,
      origin: { kind: "ai-fixture", principalId: "utility-ai", reason: "Origin parity check" },
    });
    const originParity = serializeSceneDocument(human.document) === serializeSceneDocument(ai.document);
    setHarnessReceipt({
      operation: "dicebox.desktop.utility-harness.inspect",
      status: errors.length === 0 && originParity ? "PASS" : "BLOCKED",
      documentId: document.id,
      revision: document.revision,
      projectedEntities: projectScene(document).length,
      synchronizedViews: 2,
      originParity,
      validationErrors: errors,
      noWrite: true,
    });
  }, [document, errors]);

  const commitNativeGeometry = useCallback(async () => {
    if (!selected || selected.locked || geometryBusy || !nativeGeometryAvailable) return;
    commandSequence.current += 1;
    const sequence = commandSequence.current;
    setGeometryBusy(true);
    setGeometryError(null);
    try {
      const receipt = await commitGeometryBatch(createStressTranslateBatch(document, selected.id, 8, 0, sequence));
      dispatch({
        kind: "execute",
        command: geometryReceiptToCommand(receipt, `desktop-native-commit-${sequence}`, {
          kind: "human",
          principalId: "desktop-user",
          reason: "Approved native geometry commit",
        }),
      });
      setGeometryReceipt(receipt);
    } catch (error) {
      setGeometryError(error instanceof Error ? error.message : String(error));
    } finally {
      setGeometryBusy(false);
    }
  }, [document, geometryBusy, nativeGeometryAvailable, selected]);

  const refreshProjectCatalog = useCallback(async () => {
    if (!nativeProjectStoreAvailable) return [] as readonly ProjectCatalogEntry[];
    const response = await listProjectBundles();
    setProjectCatalog(response.entries);
    setWorkspaceIndexGeneration(response.workspaceIndexGeneration);
    setWorkspaceMetadataWarning(response.workspaceMetadataWarning);
    setSelectedProjectId((current) => response.entries.some((entry) => entry.projectId === current && entry.status === "PASS")
      ? current
      : response.entries.find((entry) => entry.status === "PASS")?.projectId ?? "");
    return response.entries;
  }, [nativeProjectStoreAvailable]);

  const persistProjectProposalSession = useCallback(async (session: DesktopProjectProposalSession, scope: DesktopProjectProposalSessionScope = projectProposalSessionPersistenceScope.current) => {
    const storage = browserDesktopProjectProposalSessionStorage();
    const result = scope === "broken-reference-ui-self-test"
      ? await saveDesktopBrokenReferenceUiSelfTestProposalSession(storage, session)
      : scope === DESKTOP_PROJECT_SAVE_UI_SELF_TEST_SCOPE
        ? await saveDesktopProjectSaveUiSelfTestProposalSession(storage, session)
      : scope === DESKTOP_BROKEN_REFERENCE_UI_SELF_TEST_V3_SCOPE
        ? await saveDesktopBrokenReferenceUiV3SelfTestProposalSession(storage, session)
      : scope === DESKTOP_BROKEN_REFERENCE_UI_SELF_TEST_V4_SCOPE
          ? await saveDesktopBrokenReferenceUiV4SelfTestProposalSession(storage, session)
        : scope === DESKTOP_ASSET_DETACH_UI_SELF_TEST_SCOPE
          ? await saveDesktopAssetDetachUiSelfTestProposalSession(storage, session)
        : scope === DESKTOP_ASSET_DETACH_UI_SELF_TEST_V2_SCOPE
            ? await saveDesktopAssetDetachUiV2SelfTestProposalSession(storage, session)
            : scope === DESKTOP_ASSET_RESTORE_UI_SELF_TEST_V2_SCOPE
              ? await saveDesktopAssetRestoreUiV2SelfTestProposalSession(storage, session)
            : scope === DESKTOP_ASSET_RESTORE_UI_SELF_TEST_V3_SCOPE
              ? await saveDesktopAssetRestoreUiV3SelfTestProposalSession(storage, session)
            : await saveDesktopProjectProposalSession(storage, session.projectId, session);
    projectProposalSessionPersistenceScope.current = scope;
    setProjectProposalSession(session);
    setProjectProposalSessionStatus(`Project proposal ${session.history.status} · ${result.historyLength} history receipt${result.historyLength === 1 ? "" : "s"} · session-only · no project write`);
    setProjectProposalSessionError(null);
    return result;
  }, []);

  const loadSelectedProjectProposalSession = useCallback(async (projectId: string) => {
    projectProposalSessionPersistenceScope.current = "ordinary";
    if (!projectId) {
      setProjectProposalSession(null);
      setProjectProposalSessionStatus("Project recovery proposal session not loaded.");
      setProjectProposalSessionError(null);
      return;
    }
    try {
      const loaded = await loadDesktopProjectProposalSession(browserDesktopProjectProposalSessionStorage(), projectId);
      if (loaded.status === "PASS" && loaded.session) {
        setMigrationPersistPreview(null);
        const command = loaded.session.batch.commands[0];
        if (command?.kind === "project.migration.persist" && ["previewed", "approved"].includes(loaded.session.history.status)) {
          const payload = command.payload as Record<string, unknown>;
          const currentPreview = await previewProjectMigrationPersist(projectId);
          const migrationMatches = payload.projectId === currentPreview.projectId
            && payload.sourceSchemaVersion === currentPreview.sourceSchemaVersion
            && payload.targetSchemaVersion === currentPreview.targetSchemaVersion
            && payload.generation === currentPreview.generation
            && payload.nextGeneration === currentPreview.nextGeneration
            && payload.persistedContentSha256 === currentPreview.persistedContentSha256
            && payload.resultingContentSha256 === currentPreview.resultingContentSha256
            && payload.semanticStateSha256 === currentPreview.semanticStateSha256
            && payload.assetTreeSha256 === currentPreview.assetTreeSha256
            && payload.previewSha256 === currentPreview.previewSha256
            && loaded.session.batch.base.revision === currentPreview.generation;
          if (!migrationMatches) {
            setProjectProposalSession(loaded.session);
            setProjectProposalSessionStatus(`Stored migration proposal is stale for the exact project · ${loaded.session.history.status} · no project write`);
            setProjectProposalSessionError("Stored migration proposal no longer matches a fresh exact target-bound preview; no state was changed and no retry was attempted.");
            return;
          }
          setMigrationPersistPreview(currentPreview);
        }
        setProjectProposalSession(loaded.session);
        setProjectProposalSessionStatus(`Restored project proposal session · ${loaded.session.history.status} · ${loaded.session.history.receipts.length} receipt${loaded.session.history.receipts.length === 1 ? "" : "s"} · no project write`);
        setProjectProposalSessionError(null);
      } else if (loaded.status === "MISSING") {
        setProjectProposalSession(null);
        setProjectProposalSessionStatus("No project recovery proposal session is stored for this exact project.");
        setProjectProposalSessionError(null);
      } else {
        setProjectProposalSession(null);
        setProjectProposalSessionStatus(`Project proposal session blocked · ${loaded.code}`);
        setProjectProposalSessionError(loaded.reason);
      }
    } catch (error) {
      setProjectProposalSession(null);
      setProjectProposalSessionStatus("Project proposal session could not be loaded; no project state was changed.");
      setProjectProposalSessionError(error instanceof Error ? error.message : String(error));
    }
  }, []);

  useEffect(() => {
    if (import.meta.env.VITE_DBX_SELECTOR_RECOVERY === DESKTOP_SELECTOR_RECOVERY_MODE || import.meta.env.VITE_DBX_PROJECT_SELF_TEST) {
      setProjectProposalSession(null);
      setProjectProposalSessionStatus(import.meta.env.VITE_DBX_SELECTOR_RECOVERY === DESKTOP_SELECTOR_RECOVERY_MODE
        ? "Selector self-test mode keeps the project proposal session unloaded until explicit review."
        : "Project self-test mode keeps the project proposal session unloaded until explicit review.");
      setProjectProposalSessionError(null);
      return;
    }
    void loadSelectedProjectProposalSession(selectedProjectId);
  }, [loadSelectedProjectProposalSession, selectedProjectId]);

  const inspectSelectedProjectRecovery = useCallback(async () => {
    if (!nativeProjectStoreAvailable || projectBusy || !selectedProjectId) return;
    setProjectBusy(true);
    setProjectError(null);
    setRecoveryPreview(null);
    setRecoveryCandidateBytes(null);
    setRecoveryReceipt(null);
    setDetachPreview(null);
    setDetachReceipt(null);
    try {
      const inspection = await inspectProjectRecovery(selectedProjectId);
      setRecoveryInspection(inspection);
      const eligible = inspection.registeredAssets.filter((asset) => asset.restoreEligible);
      setSelectedRecoveryAssetId(eligible.length === 1 ? eligible[0].assetId : null);
    } catch (error) {
      setRecoveryInspection(null);
      setProjectError(formatProjectStoreFailure(error));
    } finally {
      setProjectBusy(false);
    }
  }, [nativeProjectStoreAvailable, projectBusy, selectedProjectId]);

  const previewSelectedBackupPromotion = useCallback(async (projectId = selectedProjectId): Promise<BackupRecoveryPromotionPreviewReceipt | null> => {
    if (!nativeProjectStoreAvailable || projectBusy || !projectId) return null;
    setProjectBusy(true);
    setProjectError(null);
    setBackupPromotionReceipt(null);
    try {
      const preview = await previewBackupAuthoritativeRecovery(projectId);
      setBackupPromotionPreview(preview);
      return preview;
    } catch (error) {
      setBackupPromotionPreview(null);
      setProjectError(formatProjectStoreFailure(error));
      return null;
    } finally {
      setProjectBusy(false);
    }
  }, [nativeProjectStoreAvailable, projectBusy, selectedProjectId]);

  const previewSelectedBackupPromotionProposal = useCallback(async (preview = backupPromotionPreview): Promise<DesktopProjectProposalSession | null> => {
    if (projectBusy || !preview) return null;
    setProjectBusy(true);
    setProjectProposalSessionError(null);
    try {
      const proposalStorage = browserDesktopProjectProposalSessionStorage();
      const existingProposal = await loadDesktopProjectProposalSession(proposalStorage, preview.projectId);
      if (existingProposal.status === "BLOCKED") throw new Error(existingProposal.reason);
      if (existingProposal.status === "PASS") {
        const terminalStatuses = ["rejected", "cancelled", "stale", "committed", "recovered", "undone", "redone"];
        if (!terminalStatuses.includes(existingProposal.session.history.status)) {
          throw new Error("An existing project proposal session must reach a terminal state and be cleared before replacement.");
        }
        await clearTerminalDesktopProjectProposalSession(proposalStorage, preview.projectId);
      }
      const projectSlug = preview.projectId.replace(/[^a-z0-9._-]/gi, "-").toLowerCase();
      const observedAt = new Date().toISOString();
      const batch = await createProjectRecoveryProposalBatch({
        batchId: `dbx:proposal:desktop-project-recovery-${projectSlug}-${Date.now()}`,
        preview,
        createdAt: observedAt,
      });
      const history = await previewProposalBatch(batch, desktopProposalRequester, observedAt);
      const session = await createDesktopProjectProposalSession({
        projectId: batch.base.targetId,
        batch,
        history,
      });
       await persistProjectProposalSession(session);
      return session;
    } catch (error) {
      setProjectProposalSessionError(error instanceof Error ? error.message : String(error));
      return null;
    } finally {
      setProjectBusy(false);
    }
  }, [backupPromotionPreview, persistProjectProposalSession, projectBusy]);

  const previewSelectedProjectRenameProposal = useCallback(async () => {
    if (projectBusy || !selectedProjectId || !selectedCatalogEntry || selectedCatalogEntry.status !== "PASS" || !selectedCatalogEntry.contentSha256 || projectRenamePreview) return;
    setProjectBusy(true);
    setProjectProposalSessionError(null);
    try {
      const catalog = await listProjectBundles();
      const exactEntry = catalog.entries.find((entry) => entry.projectId === selectedProjectId);
      if (
        (catalog.status !== "PASS" && catalog.status !== "PARTIAL")
        || catalog.noWrite !== true
        || catalog.noFoundryWrite !== true
        || !exactEntry
        || exactEntry.status !== "PASS"
        || exactEntry.contentSha256 === null
      ) throw new Error("Project rename requires an exact no-write catalog reread for the selected healthy project; no project state was changed.");
      const proposalStorage = browserDesktopProjectProposalSessionStorage();
      const existingProposal = await loadDesktopProjectProposalSession(proposalStorage, selectedProjectId);
      if (existingProposal.status === "BLOCKED") throw new Error(existingProposal.reason);
      if (existingProposal.status === "PASS") {
        const terminalStatuses = ["rejected", "cancelled", "stale", "committed", "recovered", "undone", "redone"];
        if (!terminalStatuses.includes(existingProposal.session.history.status)) {
          throw new Error("An existing project proposal session must reach a terminal state and be cleared before replacement.");
        }
        await clearTerminalDesktopProjectProposalSession(proposalStorage, selectedProjectId);
      }
      const observedAt = new Date().toISOString();
      const preview = await createProjectRenamePreview({
        projectId: selectedProjectId,
        workspaceIndexGeneration: catalog.workspaceIndexGeneration,
        currentDisplayName: exactEntry.displayName,
        proposedDisplayName: displayNameFromInput(projectNameInput),
        contentSha256: exactEntry.contentSha256,
      });
      const batch = await createProjectRenameProposalBatch({
        batchId: `dbx:proposal:desktop-project-rename-${selectedProjectId.replace(/[^a-z0-9._-]/gi, "-").toLowerCase()}-${Date.now()}`,
        preview,
        createdAt: observedAt,
      });
      const history = await previewProposalBatch(batch, desktopProposalRequester, observedAt);
      const session = await createDesktopProjectRenameProposalSession({ projectId: batch.base.targetId, batch, history });
      setProjectSavePreview(null);
      setProjectSaveAsPreview(null);
      setProjectSaveAsContent(null);
      setProjectSaveContent(null);
      setProjectSaveInverseContent(null);
      setProjectRenamePreview(preview);
       setWorkspaceIndexGeneration(catalog.workspaceIndexGeneration);
       await persistProjectProposalSession(session);
    } catch (error) {
      setProjectRenamePreview(null);
      setProjectProposalSessionError(error instanceof Error ? error.message : String(error));
    } finally {
      setProjectBusy(false);
    }
  }, [persistProjectProposalSession, projectBusy, projectNameInput, projectRenamePreview, selectedCatalogEntry, selectedProjectId]);

  const approveSelectedProjectProposal = useCallback(async (session = projectProposalSession): Promise<DesktopProjectProposalSession | null> => {
    if (projectBusy || !session || session.history.status !== "previewed") return null;
    setProjectBusy(true);
    setProjectProposalSessionError(null);
    try {
      const next = await approveDesktopProjectProposalSession(
        session,
        desktopProposalReviewer,
        session.batch.base,
        new Date().toISOString(),
      );
      await persistProjectProposalSession(next);
      return next;
    } catch (error) {
      setProjectProposalSessionError(error instanceof Error ? error.message : String(error));
      return null;
    } finally {
      setProjectBusy(false);
    }
  }, [persistProjectProposalSession, projectBusy, projectProposalSession]);

  const rejectSelectedProjectProposal = useCallback(async () => {
    if (projectBusy || !projectProposalSession || projectProposalSession.history.status !== "previewed") return;
    setProjectBusy(true);
    setProjectProposalSessionError(null);
    try {
      await persistProjectProposalSession(await rejectDesktopProjectProposalSession(projectProposalSession, desktopProposalReviewer, new Date().toISOString()));
    } catch (error) {
      setProjectProposalSessionError(error instanceof Error ? error.message : String(error));
    } finally {
      setProjectBusy(false);
    }
  }, [persistProjectProposalSession, projectBusy, projectProposalSession]);

  const cancelSelectedProjectProposal = useCallback(async () => {
    if (projectBusy || !projectProposalSession || !["previewed", "approved"].includes(projectProposalSession.history.status)) return;
    setProjectBusy(true);
    setProjectProposalSessionError(null);
    try {
      await persistProjectProposalSession(await cancelDesktopProjectProposalSession(projectProposalSession, desktopProposalReviewer, new Date().toISOString()));
    } catch (error) {
      setProjectProposalSessionError(error instanceof Error ? error.message : String(error));
    } finally {
      setProjectBusy(false);
    }
  }, [persistProjectProposalSession, projectBusy, projectProposalSession]);

  const markSelectedProjectProposalStale = useCallback(async () => {
    if (projectBusy || !projectProposalSession || !["previewed", "approved"].includes(projectProposalSession.history.status)) return;
    setProjectBusy(true);
    setProjectProposalSessionError(null);
    try {
      await persistProjectProposalSession(await invalidateStaleDesktopProjectProposalSession(projectProposalSession, desktopProposalReviewer, new Date().toISOString()));
    } catch (error) {
      setProjectProposalSessionError(error instanceof Error ? error.message : String(error));
    } finally {
      setProjectBusy(false);
    }
  }, [persistProjectProposalSession, projectBusy, projectProposalSession]);

  const clearSelectedTerminalProjectProposal = useCallback(async () => {
    if (projectBusy || !projectProposalSession || !["rejected", "cancelled", "stale", "committed", "recovered", "undone", "redone"].includes(projectProposalSession.history.status)) return;
    setProjectBusy(true);
    setProjectProposalSessionError(null);
    try {
      const result = await clearTerminalDesktopProjectProposalSession(browserDesktopProjectProposalSessionStorage(), projectProposalSession.projectId);
      setProjectProposalSession(null);
      setProjectRenamePreview(null);
      setProjectCreatePreview(null);
      setProjectSavePreview(null);
      setProjectSaveAsPreview(null);
      setProjectSaveAsContent(null);
      setProjectSaveContent(null);
      setProjectSaveInverseContent(null);
      setProjectProposalSessionStatus(`Cleared terminal project proposal session · ${result.key} · session-only · no project write`);
    } catch (error) {
      setProjectProposalSessionError(error instanceof Error ? error.message : String(error));
    } finally {
      setProjectBusy(false);
    }
  }, [projectBusy, projectProposalSession]);

  const focusProjectCatalog = useCallback(() => {
    if (projectBusy || !nativeProjectStoreAvailable) return;
    projectCatalogRef.current?.focus({ preventScroll: true });
  }, [nativeProjectStoreAvailable, projectBusy]);

  const selectEphemeralProjectForSelectorRecovery = useCallback(() => {
    const selectorRecoveryEnabled = import.meta.env.VITE_DBX_SELECTOR_RECOVERY === DESKTOP_SELECTOR_RECOVERY_MODE;
    const configuredProjectId = import.meta.env.VITE_DBX_SELECTOR_RECOVERY_PROJECT_ID ?? "";
    const exactEntry = projectCatalog.find((entry) => entry.projectId === DESKTOP_SELECTOR_RECOVERY_PROJECT_ID && entry.status === "PASS");
    if (!selectorRecoveryEnabled || configuredProjectId !== DESKTOP_SELECTOR_RECOVERY_PROJECT_ID || projectBusy || !nativeProjectStoreAvailable || !exactEntry) {
      setProjectSelectorRecoveryStatus("BLOCKED · explicit ephemeral mode and exact PASS test project required");
      return false;
    }
    setSelectedProjectId(exactEntry.projectId);
    setMigrationExplanation(null);
    setBackupPromotionPreview(null);
    setBackupPromotionReceipt(null);
    setProjectRenamePreview(null);
    setProjectProposalSession(null);
    setProjectProposalSessionStatus("Ephemeral selector recovery selected the exact test project; no project write.");
    setProjectProposalSessionError(null);
    setRecoveryInspection(null);
    setRecoveryPreview(null);
    setRecoveryCandidateBytes(null);
    setRecoveryReceipt(null);
    setDetachPreview(null);
    setDetachReceipt(null);
    setProjectError(null);
    setProjectSelectorRecoveryStatus(`PASS · ephemeral in-memory selection · ${exactEntry.projectId} · no persistence or project write`);
    return true;
  }, [nativeProjectStoreAvailable, projectBusy, projectCatalog]);

  useEffect(() => {
    function handleProjectProposalRecoveryShortcut(event: KeyboardEvent) {
      const key = event.key.toLowerCase();
      if (!event.ctrlKey || !event.altKey || !event.shiftKey || event.repeat || !["p", "a", "r", "k", "s", "c", "f", "e", "v"].includes(key)) return;
      if (key === "e" && import.meta.env.VITE_DBX_SELECTOR_RECOVERY === DESKTOP_SELECTOR_RECOVERY_MODE) {
        event.preventDefault();
        selectEphemeralProjectForSelectorRecovery();
        return;
      }
      if (key === "v" && import.meta.env.VITE_DBX_SELECTOR_RECOVERY === DESKTOP_SELECTOR_RECOVERY_MODE) {
        const configuredProjectId = import.meta.env.VITE_DBX_SELECTOR_RECOVERY_PROJECT_ID ?? "";
        const terminalProjectSession = projectProposalSession === null || ["rejected", "cancelled", "stale", "committed", "recovered", "undone", "redone"].includes(projectProposalSession.history.status);
        const exactEphemeralSelection = configuredProjectId === DESKTOP_SELECTOR_RECOVERY_PROJECT_ID
          && selectedProjectId === DESKTOP_SELECTOR_RECOVERY_PROJECT_ID
          && selectedCatalogEntry?.projectId === DESKTOP_SELECTOR_RECOVERY_PROJECT_ID
          && selectedCatalogEntry.status === "PASS"
          && Boolean(selectedCatalogEntry.contentSha256)
          && terminalProjectSession
          && !projectRenamePreview;
        if (!exactEphemeralSelection) return;
        event.preventDefault();
        void previewSelectedProjectRenameProposal();
        return;
      }
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLSelectElement || event.target instanceof HTMLTextAreaElement || (event.target instanceof HTMLElement && event.target.isContentEditable)) return;
      if (key === "f") {
        event.preventDefault();
        focusProjectCatalog();
        return;
      }
      const canPreview = key === "p" && backupPromotionPreview && !projectProposalSession;
      const canReview = projectProposalSession?.history.status === "previewed";
      const canCancel = projectProposalSession && ["previewed", "approved"].includes(projectProposalSession.history.status);
      const canMarkStale = projectProposalSession && ["previewed", "approved"].includes(projectProposalSession.history.status);
      const canClear = projectProposalSession && ["rejected", "cancelled", "stale", "committed", "recovered"].includes(projectProposalSession.history.status);
      if ((key === "p" && !canPreview) || (["a", "r"].includes(key) && !canReview) || (key === "k" && !canCancel) || (key === "s" && !canMarkStale) || (key === "c" && !canClear)) return;
      event.preventDefault();
      if (key === "p") void previewSelectedBackupPromotionProposal();
      else if (key === "a") void approveSelectedProjectProposal();
      else if (key === "r") void rejectSelectedProjectProposal();
      else if (key === "k") void cancelSelectedProjectProposal();
      else if (key === "s") void markSelectedProjectProposalStale();
      else void clearSelectedTerminalProjectProposal();
    }

    window.addEventListener("keydown", handleProjectProposalRecoveryShortcut);
    return () => window.removeEventListener("keydown", handleProjectProposalRecoveryShortcut);
  }, [approveSelectedProjectProposal, backupPromotionPreview, cancelSelectedProjectProposal, clearSelectedTerminalProjectProposal, focusProjectCatalog, markSelectedProjectProposalStale, previewSelectedBackupPromotionProposal, previewSelectedProjectRenameProposal, projectProposalSession, projectRenamePreview, rejectSelectedProjectProposal, selectEphemeralProjectForSelectorRecovery, selectedCatalogEntry, selectedProjectId]);

  const applySelectedBackupPromotionProposal = useCallback(async (preview = backupPromotionPreview, session = projectProposalSession): Promise<BackupRecoveryPromotionReceipt | null> => {
    if (!nativeProjectStoreAvailable || projectBusy || !preview || !session || session.history.status !== "approved") return null;
    const command = session.batch.commands[0];
    if (!command || command.kind !== "project.recovery.backup-promote" || session.projectId !== preview.projectId) { setProjectProposalSessionError("Apply requires the exact approved backup-promotion proposal; no project state was changed."); return null; }
    setProjectBusy(true); setProjectError(null); setProjectProposalSessionError(null);
    try {
      const applying = await beginDesktopProjectProposalSessionApply(session, desktopProposalReviewer, session.batch.base, new Date().toISOString());
      await persistProjectProposalSession(applying);
      const receipt = await promoteBackupAuthoritativeRecovery(preview);
      const inspection = await inspectProjectRecovery(receipt.projectId);
      if (receipt.status !== "PASS" || receipt.projectId !== session.projectId || receipt.generation !== session.batch.base.revision || receipt.contentSha256 !== preview.contentSha256 || receipt.primaryRestored !== true || receipt.backupUnchanged !== true || receipt.semanticStateUnchanged !== true || receipt.assetTreeUnchanged !== true || receipt.workspaceUnchanged !== true || receipt.foreignStateUnchanged !== true || receipt.authoritativeCurrentReread !== true || receipt.noFoundryWrite !== true || inspection.status !== "PASS" || inspection.projectId !== receipt.projectId || inspection.generation !== receipt.generation || inspection.contentSha256 !== receipt.contentSha256 || inspection.noWrite !== true || inspection.noFoundryWrite !== true) throw new Error("Backup promotion did not pass the exact authoritative reread; no retry was attempted.");
      const committed = await commitDesktopProjectProposalSessionAfterReread(applying, desktopProposalReviewer, { status: "matched", targetId: receipt.projectId as typeof session.batch.base.targetId, revision: receipt.generation, sha256: receipt.contentSha256 }, new Date().toISOString());
      await persistProjectProposalSession(committed);
      setBackupPromotionReceipt(receipt);
      setBackupPromotionPreview(null);
      setRecoveryInspection(inspection);
      await refreshProjectCatalog();
      return receipt;
    } catch (error) {
      setProjectProposalSessionError(formatProjectStoreFailure(error));
      return null;
    } finally {
      setProjectBusy(false);
    }
  }, [backupPromotionPreview, nativeProjectStoreAvailable, persistProjectProposalSession, projectBusy, projectProposalSession, refreshProjectCatalog]);

  const cancelSelectedBackupPromotion = useCallback(() => {
    setBackupPromotionPreview(null);
    setProjectError(null);
  }, []);

  const explainSelectedProjectMigration = useCallback(async () => {
    if (!nativeProjectStoreAvailable || projectBusy || !selectedProjectId) return;
    setProjectBusy(true);
    setProjectError(null);
    setMigrationPersistPreview(null);
    setMigrationPersistReceipt(null);
    try {
      setMigrationExplanation(await explainProjectMigration(selectedProjectId));
    } catch (error) {
      setMigrationExplanation(null);
      setProjectError(formatProjectStoreFailure(error));
    } finally {
      setProjectBusy(false);
    }
  }, [nativeProjectStoreAvailable, projectBusy, selectedProjectId]);

  const previewSelectedProjectMigrationPersist = useCallback(async () => {
    if (!nativeProjectStoreAvailable || projectBusy || !selectedProjectId || migrationPersistPreview) return;
    setProjectBusy(true);
    setProjectProposalSessionError(null);
    setMigrationPersistReceipt(null);
    try {
      const proposalStorage = browserDesktopProjectProposalSessionStorage();
      const existingProposal = await loadDesktopProjectProposalSession(proposalStorage, selectedProjectId);
      if (existingProposal.status === "BLOCKED") throw new Error(existingProposal.reason);
      if (existingProposal.status === "PASS") {
        const terminalStatuses = ["rejected", "cancelled", "stale", "committed", "recovered", "undone", "redone"];
        if (!terminalStatuses.includes(existingProposal.session.history.status)) {
          throw new Error("An existing project proposal session must reach a terminal state and be cleared before replacement.");
        }
        await clearTerminalDesktopProjectProposalSession(proposalStorage, selectedProjectId);
      }
      const preview = await previewProjectMigrationPersist(selectedProjectId);
      const observedAt = new Date().toISOString();
      const batch = await createProjectRecoveryProposalBatch({
        batchId: `dbx:proposal:desktop-project-migration-${selectedProjectId.replace(/[^a-z0-9._-]/gi, "-").toLowerCase()}-${Date.now()}`,
        preview,
        createdAt: observedAt,
      });
      const history = await previewProposalBatch(batch, desktopProposalRequester, observedAt);
      const session = await createDesktopProjectProposalSession({ projectId: batch.base.targetId, batch, history });
      setMigrationPersistPreview(preview);
      await persistProjectProposalSession(session);
    } catch (error) {
      setMigrationPersistPreview(null);
      setProjectProposalSessionError(formatProjectStoreFailure(error));
    } finally {
      setProjectBusy(false);
    }
  }, [clearTerminalDesktopProjectProposalSession, migrationPersistPreview, nativeProjectStoreAvailable, persistProjectProposalSession, projectBusy, selectedProjectId]);

  const applySelectedProjectMigrationPersistProposal = useCallback(async () => {
    if (!nativeProjectStoreAvailable || projectBusy || !migrationPersistPreview || !projectProposalSession || projectProposalSession.history.status !== "approved") return;
    const command = projectProposalSession.batch.commands[0];
    if (!command || command.kind !== "project.migration.persist" || projectProposalSession.projectId !== migrationPersistPreview.projectId) {
      setProjectProposalSessionError("Apply requires the exact approved legacy-migration proposal; no project state was changed.");
      return;
    }
    setProjectBusy(true); setProjectError(null); setProjectProposalSessionError(null);
    try {
      const applying = await beginDesktopProjectProposalSessionApply(projectProposalSession, desktopProposalReviewer, projectProposalSession.batch.base, new Date().toISOString());
      await persistProjectProposalSession(applying);
      const receipt = await persistProjectMigration(migrationPersistPreview);
      const response = await loadProjectBundle(receipt.projectId);
      const inspection = await inspectProjectRecovery(receipt.projectId);
      const explanation = await explainProjectMigration(receipt.projectId);
      const catalog = await listProjectBundles();
      const catalogEntry = catalog.entries.find((entry) => entry.projectId === receipt.projectId);
      if (
        receipt.status !== "PASS"
        || receipt.projectId !== projectProposalSession.projectId
        || receipt.sourceSchemaVersion !== migrationPersistPreview.sourceSchemaVersion
        || receipt.targetSchemaVersion !== migrationPersistPreview.targetSchemaVersion
        || receipt.previousGeneration !== migrationPersistPreview.generation
        || receipt.generation !== migrationPersistPreview.nextGeneration
        || receipt.previousContentSha256 !== migrationPersistPreview.persistedContentSha256
        || receipt.contentSha256 !== migrationPersistPreview.resultingContentSha256
        || receipt.previewSha256 !== migrationPersistPreview.previewSha256
        || receipt.semanticStateUnchanged !== true
        || receipt.assetTreeUnchanged !== true
        || receipt.workspaceUnchanged !== true
        || receipt.foreignStateUnchanged !== true
        || receipt.backupPreservesLegacyPrimary !== true
        || receipt.authoritativeCurrentReread !== true
        || receipt.directoryEntrySync !== true
        || receipt.noFoundryWrite !== true
        || response.receipt.projectId !== receipt.projectId
        || response.receipt.generation !== receipt.generation
        || response.receipt.contentSha256 !== receipt.contentSha256
        || response.receipt.migrationStatus !== "current"
        || response.receipt.sceneCount !== migrationPersistPreview.scenes.length
        || response.receipt.assetCount !== migrationPersistPreview.assetCount
        || !["PASS", "PARTIAL"].includes(catalog.status)
        || catalog.noWrite !== true
        || catalog.noFoundryWrite !== true
        || !catalogEntry
        || catalogEntry.status !== "PASS"
        || catalogEntry.generation !== receipt.generation
        || catalogEntry.contentSha256 !== receipt.contentSha256
        || inspection.status !== "PASS"
        || inspection.projectId !== receipt.projectId
        || inspection.generation !== receipt.generation
        || inspection.contentSha256 !== receipt.contentSha256
        || inspection.migrationStatus !== "current"
        || inspection.primary.sourceSchemaVersion !== receipt.targetSchemaVersion
        || inspection.backup.sourceSchemaVersion !== receipt.sourceSchemaVersion
        || inspection.noWrite !== true
        || inspection.noFoundryWrite !== true
        || explanation.status !== "preview-only"
        || explanation.projectId !== receipt.projectId
        || explanation.authoritativeSource !== "project.json"
        || explanation.sourceSchemaVersion !== receipt.targetSchemaVersion
        || explanation.targetSchemaVersion !== receipt.targetSchemaVersion
        || explanation.migrationStatus !== "current"
        || explanation.primary.sourceSchemaVersion !== receipt.targetSchemaVersion
        || explanation.backup.sourceSchemaVersion !== receipt.sourceSchemaVersion
        || explanation.noWrite !== true
        || explanation.noFoundryWrite !== true
      ) throw new Error("Migration persistence did not pass the exact authoritative project, recovery, and workspace reread; no retry was attempted.");
      const committed = await commitDesktopProjectProposalSessionAfterReread(applying, desktopProposalReviewer, { status: "matched", targetId: receipt.projectId as typeof projectProposalSession.batch.base.targetId, revision: receipt.generation, sha256: receipt.contentSha256 }, new Date().toISOString());
      await persistProjectProposalSession(committed);
      setMigrationPersistReceipt(receipt);
      setMigrationPersistPreview(null);
      setMigrationExplanation(explanation);
      setProjectLoadResponse(response);
      setProjectScenes(response.scenesJson.map(parseStoredScene));
      setProjectPersistedSceneJson(response.scenesJson);
      setActiveSceneId(response.activeSceneId);
      setProjectGeneration(response.receipt.generation);
      setWorkspaceIndexGeneration(catalog.workspaceIndexGeneration);
      setWorkspaceMetadataWarning(catalog.workspaceMetadataWarning ?? null);
      await refreshProjectCatalog();
    } catch (error) {
      setProjectProposalSessionError(formatProjectStoreFailure(error));
    } finally {
      setProjectBusy(false);
    }
  }, [explainProjectMigration, inspectProjectRecovery, listProjectBundles, loadProjectBundle, migrationPersistPreview, nativeProjectStoreAvailable, persistProjectProposalSession, projectBusy, projectProposalSession, refreshProjectCatalog]);

  const previewSelectedProjectAssetRestore = useCallback(async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file || !recoveryInspection || projectBusy || !nativeProjectStoreAvailable) return;
    let selected;
    try {
      selected = selectEligibleMissingBackgroundAsset(recoveryInspection, selectedRecoveryAssetId);
    } catch (error) {
      setProjectError(error instanceof Error ? error.message : String(error));
      return;
    }
    if (file.type !== selected.mediaType) {
      setProjectError(`RECOVERY_MEDIA_TYPE_MISMATCH: expected ${selected.mediaType}.`);
      return;
    }
    const bytes = [...new Uint8Array(await file.arrayBuffer())];
    setProjectBusy(true);
    setProjectError(null);
    setRecoveryReceipt(null);
    try {
      const preview = await previewMissingAssetRestore(recoveryInspection.projectId, selected.assetId, file.type, bytes);
      const observedAt = new Date().toISOString();
      const batch = await createProjectRecoveryProposalBatch({ batchId: `dbx:proposal:desktop-project-asset-restore-${recoveryInspection.projectId.replace(/[^a-z0-9._-]/gi, "-").toLowerCase()}-${Date.now()}`, preview, createdAt: observedAt });
      const history = await previewProposalBatch(batch, desktopProposalRequester, observedAt);
      const session = await createDesktopProjectProposalSession({ projectId: batch.base.targetId, batch, history });
      setRecoveryCandidateBytes(bytes);
      setRecoveryPreview(preview);
      await persistProjectProposalSession(session);
    } catch (error) {
      setRecoveryCandidateBytes(null);
      setRecoveryPreview(null);
      setProjectError(formatProjectStoreFailure(error));
    } finally {
      setProjectBusy(false);
    }
  }, [nativeProjectStoreAvailable, persistProjectProposalSession, projectBusy, recoveryInspection, selectedRecoveryAssetId]);

  const applySelectedProjectAssetRestoreProposal = useCallback(async () => {
    if (!nativeProjectStoreAvailable || projectBusy || !recoveryPreview || !recoveryCandidateBytes || !projectProposalSession || projectProposalSession.history.status !== "approved") return;
    const command = projectProposalSession.batch.commands[0];
    if (!command || command.kind !== "project.asset.restore" || projectProposalSession.projectId !== recoveryPreview.projectId) { setProjectProposalSessionError("Apply requires the exact approved asset-restore proposal; no project state was changed."); return; }
    setProjectBusy(true); setProjectError(null); setProjectProposalSessionError(null);
    try {
      const applying = await beginDesktopProjectProposalSessionApply(projectProposalSession, desktopProposalReviewer, projectProposalSession.batch.base, new Date().toISOString());
      await persistProjectProposalSession(applying);
      const receipt = await restoreMissingAsset(recoveryPreview, recoveryCandidateBytes);
      const inspection = await inspectProjectRecovery(receipt.projectId);
      const expectedRemainingAssetIds = recoveryInspection?.registeredAssets
        .filter((asset) => asset.assetId !== recoveryPreview.assetId && asset.restoreEligible)
        .map((asset) => asset.assetId) ?? [];
      if (receipt.status !== "PASS" || receipt.projectId !== projectProposalSession.projectId || receipt.generation !== projectProposalSession.batch.base.revision || receipt.contentSha256 !== recoveryPreview.contentSha256 || receipt.assetId !== recoveryPreview.assetId || receipt.assetSha256 !== recoveryPreview.assetSha256 || receipt.noFoundryWrite !== true || !isAssetRestoreUiTerminalInspection(inspection, receipt.projectId, recoveryPreview.assetId, expectedRemainingAssetIds) || inspection.generation !== receipt.generation || inspection.contentSha256 !== receipt.contentSha256) throw new Error("Asset restore did not pass the exact authoritative reread; no retry was attempted.");
      const committed = await commitDesktopProjectProposalSessionAfterReread(applying, desktopProposalReviewer, { status: "matched", targetId: receipt.projectId as typeof projectProposalSession.batch.base.targetId, revision: receipt.generation, sha256: receipt.contentSha256 }, new Date().toISOString());
      await persistProjectProposalSession(committed);
      setRecoveryReceipt(receipt);
      setRecoveryPreview(null);
      setRecoveryCandidateBytes(null);
      setRecoveryInspection(inspection);
      await refreshProjectCatalog();
    } catch (error) {
      setProjectProposalSessionError(formatProjectStoreFailure(error));
    } finally {
      setProjectBusy(false);
    }
  }, [nativeProjectStoreAvailable, persistProjectProposalSession, projectBusy, projectProposalSession, recoveryCandidateBytes, recoveryInspection, recoveryPreview, refreshProjectCatalog]);

  const cancelSelectedProjectAssetRestore = useCallback(() => {
    setRecoveryPreview(null);
    setRecoveryCandidateBytes(null);
    setProjectError(null);
  }, []);

  const previewSelectedProjectAssetDetach = useCallback(async () => {
    if (!nativeProjectStoreAvailable || projectBusy || !recoveryInspection) return;
    let selected;
    try {
      selected = selectEligibleMissingBackgroundAsset(recoveryInspection, selectedRecoveryAssetId);
    } catch (error) {
      setProjectError(error instanceof Error ? error.message : String(error));
      return;
    }
    setProjectBusy(true);
    setProjectError(null);
    setRecoveryPreview(null);
    setRecoveryCandidateBytes(null);
    setRecoveryReceipt(null);
    setDetachReceipt(null);
    try {
      const preview = await previewMissingAssetDetach(recoveryInspection.projectId, selected.assetId);
      const observedAt = new Date().toISOString();
      const batch = await createProjectRecoveryProposalBatch({ batchId: `dbx:proposal:desktop-project-asset-detach-${recoveryInspection.projectId.replace(/[^a-z0-9._-]/gi, "-").toLowerCase()}-${Date.now()}`, preview, createdAt: observedAt });
      const history = await previewProposalBatch(batch, desktopProposalRequester, observedAt);
      const session = await createDesktopProjectProposalSession({ projectId: batch.base.targetId, batch, history });
      setDetachPreview(preview);
      await persistProjectProposalSession(session);
    } catch (error) {
      setDetachPreview(null);
      setProjectError(formatProjectStoreFailure(error));
    } finally {
      setProjectBusy(false);
    }
  }, [nativeProjectStoreAvailable, persistProjectProposalSession, projectBusy, recoveryInspection, selectedRecoveryAssetId]);

  const applySelectedProjectAssetDetachProposal = useCallback(async () => {
    if (!nativeProjectStoreAvailable || projectBusy || !detachPreview || !projectProposalSession || projectProposalSession.history.status !== "approved") return;
    const command = projectProposalSession.batch.commands[0];
    if (!command || command.kind !== "project.asset.detach" || projectProposalSession.projectId !== detachPreview.projectId) { setProjectProposalSessionError("Apply requires the exact approved asset-detach proposal; no project state was changed."); return; }
    setProjectBusy(true); setProjectError(null); setProjectProposalSessionError(null);
    try {
      const applying = await beginDesktopProjectProposalSessionApply(projectProposalSession, desktopProposalReviewer, projectProposalSession.batch.base, new Date().toISOString());
      await persistProjectProposalSession(applying);
      const receipt = await detachMissingAsset(detachPreview);
      const inspection = await inspectProjectRecovery(receipt.projectId);
      if (receipt.status !== "PASS" || receipt.projectId !== projectProposalSession.projectId || receipt.generation !== detachPreview.nextGeneration || receipt.contentSha256 !== detachPreview.resultingContentSha256 || receipt.assetId !== detachPreview.assetId || receipt.noFoundryWrite !== true || inspection.status !== "PASS" || inspection.projectId !== receipt.projectId || inspection.generation !== receipt.generation || inspection.contentSha256 !== receipt.contentSha256 || inspection.noWrite !== true || inspection.noFoundryWrite !== true) throw new Error("Asset detach did not pass the exact authoritative reread; no retry was attempted.");
      const committed = await commitDesktopProjectProposalSessionAfterReread(applying, desktopProposalReviewer, { status: "matched", targetId: receipt.projectId as typeof projectProposalSession.batch.base.targetId, revision: receipt.generation, sha256: receipt.contentSha256 }, new Date().toISOString());
      await persistProjectProposalSession(committed);
      setDetachReceipt(receipt);
      setDetachPreview(null);
      setRecoveryInspection(inspection);
      await refreshProjectCatalog();
    } catch (error) {
      setProjectProposalSessionError(formatProjectStoreFailure(error));
    } finally {
      setProjectBusy(false);
    }
  }, [detachPreview, nativeProjectStoreAvailable, persistProjectProposalSession, projectBusy, projectProposalSession, refreshProjectCatalog]);

  const cancelSelectedProjectAssetDetach = useCallback(() => {
    setDetachPreview(null);
    setProjectError(null);
  }, []);

  const previewSelectedBrokenReferenceDetach = useCallback(async (selfTestOwnershipToken: string | null = null, selfTestScope: DesktopProjectProposalSessionScope = "broken-reference-ui-self-test") => {
    if (!nativeProjectStoreAvailable || projectBusy || !recoveryInspection) return;
    let selected;
    try {
      selected = selectBrokenSceneReference(recoveryInspection, selectedBrokenReference?.sceneId, selectedBrokenReference?.assetId);
    } catch (error) {
      setProjectError(error instanceof Error ? error.message : String(error));
      return;
    }
    setProjectBusy(true);
    setProjectError(null);
    setBrokenReferenceReceipt(null);
    try {
      const preview = await previewBrokenReferenceDetach(selected, recoveryInspection.projectId);
      const observedAt = new Date().toISOString();
      const genericBatch = await createProjectRecoveryProposalBatch({ batchId: `dbx:proposal:desktop-project-broken-reference-detach-${recoveryInspection.projectId.replace(/[^a-z0-9._-]/gi, "-").toLowerCase()}-${Date.now()}`, preview, createdAt: observedAt });
      const owned = selfTestOwnershipToken === null ? null : await createDesktopBrokenReferenceUiOwnedProposalBatch(genericBatch, selfTestOwnershipToken);
      const batch = owned?.batch ?? genericBatch;
      const history = await previewProposalBatch(batch, desktopProposalRequester, observedAt);
      const session = await createDesktopProjectProposalSession({ projectId: batch.base.targetId, batch, history });
      if (owned !== null) {
        projectBrokenReferenceUiSelfTestExpectedBatch.current = genericBatch;
        projectBrokenReferenceUiSelfTestOwnership.current = owned.ownership;
      }
       setBrokenReferencePreview(preview);
       await persistProjectProposalSession(session, selfTestOwnershipToken === null ? "ordinary" : selfTestScope);
    } catch (error) {
      setBrokenReferencePreview(null);
      setProjectError(formatProjectStoreFailure(error));
    } finally {
      setProjectBusy(false);
    }
  }, [nativeProjectStoreAvailable, persistProjectProposalSession, projectBusy, recoveryInspection, selectedBrokenReference]);

  const applySelectedBrokenReferenceDetachProposal = useCallback(async () => {
    if (!nativeProjectStoreAvailable || projectBusy || !brokenReferencePreview || !projectProposalSession || projectProposalSession.history.status !== "approved") return;
    const command = projectProposalSession.batch.commands[0];
    if (!command || command.kind !== "project.broken-reference.detach" || projectProposalSession.projectId !== brokenReferencePreview.projectId) { setProjectProposalSessionError("Apply requires the exact approved broken-reference detach proposal; no project state was changed."); return; }
    setProjectBusy(true); setProjectError(null); setProjectProposalSessionError(null);
    try {
      const applying = await beginDesktopProjectProposalSessionApply(projectProposalSession, desktopProposalReviewer, projectProposalSession.batch.base, new Date().toISOString());
      await persistProjectProposalSession(applying);
      const receipt = await detachBrokenReference(brokenReferencePreview);
      const inspection = await inspectProjectRecovery(receipt.projectId);
      if (receipt.status !== "PASS" || receipt.projectId !== projectProposalSession.projectId || receipt.previousGeneration !== projectProposalSession.batch.base.revision || receipt.generation !== brokenReferencePreview.nextGeneration || receipt.contentSha256 !== brokenReferencePreview.resultingContentSha256 || receipt.sceneId !== brokenReferencePreview.sceneId || receipt.assetId !== brokenReferencePreview.assetId || receipt.blockerCode !== brokenReferencePreview.blockerCode || receipt.assetDescriptorPreserved !== true || receipt.assetTreeUnchanged !== true || receipt.workspaceUnchanged !== true || receipt.foreignStateUnchanged !== true || receipt.backupPreservesPriorEnvelope !== true || receipt.targetBindingAbsent !== true || receipt.unrelatedReferencesUnchanged !== true || receipt.authoritativeInspection !== true || receipt.directoryEntrySync !== true || receipt.noFoundryWrite !== true || !["PASS", "BLOCKED"].includes(inspection.status) || inspection.projectId !== receipt.projectId || inspection.generation !== receipt.generation || inspection.contentSha256 !== receipt.contentSha256 || inspection.noWrite !== true || inspection.noFoundryWrite !== true) throw new Error("Broken-reference detach did not pass the exact authoritative reread; no retry was attempted.");
      const committed = await commitDesktopProjectProposalSessionAfterReread(applying, desktopProposalReviewer, { status: "matched", targetId: receipt.projectId as typeof projectProposalSession.batch.base.targetId, revision: receipt.generation, sha256: receipt.contentSha256 }, new Date().toISOString());
      await persistProjectProposalSession(committed);
      setBrokenReferenceReceipt(receipt);
      setBrokenReferencePreview(null);
      setRecoveryInspection(inspection);
      await refreshProjectCatalog();
    } catch (error) {
      setProjectError(formatProjectStoreFailure(error));
    } finally {
      setProjectBusy(false);
    }
  }, [brokenReferencePreview, nativeProjectStoreAvailable, persistProjectProposalSession, projectBusy, projectProposalSession, refreshProjectCatalog]);

  const cancelSelectedBrokenReferenceDetach = useCallback(() => {
    setBrokenReferencePreview(null);
    setProjectError(null);
  }, []);

  const loadSavedProject = useCallback(async (projectId: string, promoteToEditor = true, expectedWorkspaceGenerationOverride?: number) => {
    if (!nativeProjectStoreAvailable) throw new Error("Native project storage is available only in the packaged desktop app.");
    const response = await loadProjectBundle(projectId, promoteToEditor ? expectedWorkspaceGenerationOverride ?? workspaceIndexGeneration : undefined);
    const scenes = response.scenesJson.map(parseStoredScene);
    const loaded = scenes.find((scene) => scene.id === response.activeSceneId);
    if (!loaded) throw new Error("The persisted active Scene is absent from the project collection.");
    if (promoteToEditor) {
      dispatch({ kind: "replace", document: loaded });
      setProjectScenes(scenes);
      setProjectPersistedSceneJson(scenes.map(serializeSceneDocument));
      setActiveSceneId(response.activeSceneId);
      setActiveProjectId(response.receipt.projectId);
      setSelectedProjectId(response.receipt.projectId);
      setProjectGeneration(response.receipt.generation);
      setHandoutAssetId(response.assets.find((asset) => asset.registration?.role === "handout")?.registration?.assetId ?? null);
      setAudioAssetId(response.assets.find((asset) => asset.registration?.role === "audio")?.registration?.assetId ?? null);
      setTokenAssetId(response.assets.find((asset) => asset.registration?.role === "token")?.registration?.assetId ?? null);
      setProjectLoadResponse(response);
       setProjectSaveReceipt(null);
       setProjectRenamePreview(null);
       setProjectSavePreview(null);
       setProjectSaveAsPreview(null);
       setProjectSaveAsContent(null);
      setProjectHandoutPreview(null);
      setProjectHandoutContent(null);
      setProjectSaveContent(null);
      setProjectSaveInverseContent(null);
      setProjectCloseNotice(null);
      if (response.workspaceMetadata) setWorkspaceIndexGeneration(response.workspaceMetadata.indexGeneration);
      setWorkspaceMetadataWarning(response.workspaceMetadataWarning ?? null);
      setProjectError(response.workspaceMetadataWarning ? `Workspace metadata warning: ${response.workspaceMetadataWarning}; valid project content remains open.` : null);
    }
    return { response, loaded, scenes };
  }, [nativeProjectStoreAvailable, workspaceIndexGeneration]);

  const previewCreateNewProject = useCallback(async (requestedName = projectNameInput) => {
    if (!nativeProjectStoreAvailable || projectBusy) return;
      const terminalStatuses = ["rejected", "cancelled", "stale", "committed", "recovered", "undone", "redone"];
    if (projectProposalSession && !terminalStatuses.includes(projectProposalSession.history.status)) {
      setProjectProposalSessionError(`Resolve the current ${projectProposalSession.history.status} project proposal before previewing a new project create.`);
      return;
    }
    setProjectBusy(true);
    setProjectError(null);
    setProjectProposalSessionError(null);
    try {
      const projectId = projectIdFromInput(requestedName);
      const proposedDisplayName = displayNameFromInput(requestedName);
      const catalog = await listProjectBundles();
      if (!(catalog.status === "PASS" || catalog.status === "PARTIAL") || catalog.noWrite !== true || catalog.noFoundryWrite !== true) {
        throw new Error("Project create requires an exact no-write catalog reread before preview; no project state was changed.");
      }
      if (catalog.entries.some((entry) => entry.projectId === projectId)) {
        throw new Error(`Project create target ${projectId} already exists; no overwrite or cleanup is permitted.`);
      }
      const scene = createBlankProjectScene(projectId);
      const observedAt = new Date().toISOString();
      const preview = await createProjectCreatePreview({
        targetProjectId: projectId,
        workspaceIndexGeneration: catalog.workspaceIndexGeneration,
        scenes: [scene],
        activeSceneId: scene.id,
        proposedDisplayName,
      });
      const batch = await createProjectCreateProposalBatch({
        batchId: `dbx:proposal:desktop-project-create-${projectId.replace(/[^a-z0-9._-]/gi, "-").toLowerCase()}-${Date.now()}`,
        preview,
        createdAt: observedAt,
      });
      const history = await previewProposalBatch(batch, desktopProposalRequester, observedAt);
      const session = await createDesktopProjectProposalSession({ projectId: batch.base.targetId, batch, history });
      setProjectSavePreview(null);
      setProjectSaveAsPreview(null);
      setProjectSaveAsContent(null);
      setProjectSaveContent(null);
      setProjectSaveInverseContent(null);
      setProjectCreatePreview(preview);
      setProjectRenamePreview(null);
      await persistProjectProposalSession(session);
    } catch (error) {
      setProjectCreatePreview(null);
      setProjectProposalSessionError(error instanceof Error ? error.message : String(error));
    } finally {
      setProjectBusy(false);
    }
  }, [nativeProjectStoreAvailable, persistProjectProposalSession, projectBusy, projectNameInput, projectProposalSession]);

  const applySelectedProjectCreateProposal = useCallback(async () => {
    if (!nativeProjectStoreAvailable || projectBusy || !projectProposalSession || projectProposalSession.history.status !== "approved") return;
    const command = projectProposalSession.batch.commands[0];
    if (!command || command.kind !== "project.create") {
      setProjectProposalSessionError("Apply requires the exact approved project.create proposal; no project state was changed.");
      return;
    }
    setProjectBusy(true);
    setProjectError(null);
    setProjectProposalSessionError(null);
    try {
      const projectId = projectProposalSession.projectId;
      const scene = createBlankProjectScene(projectId);
      const receipt = await executeApprovedProjectCreate({
        session: projectProposalSession,
        content: { scenes: [scene], activeSceneId: scene.id },
        executor: desktopProposalReviewer,
      });
      const response = await loadProjectBundle(projectId);
      const scenes = response.scenesJson.map(parseStoredScene);
      const active = parseActiveStoredScene(response);
      if (
        receipt.status !== "PASS"
        || receipt.history.status !== "committed"
        || receipt.targetCreated !== true
        || receipt.noFoundryWrite !== true
        || response.receipt.projectId !== projectId
        || response.receipt.generation !== 1
        || response.receipt.contentSha256 !== receipt.create.contentSha256
        || response.receipt.sceneCount !== 1
        || response.receipt.assetCount !== 0
        || scenes.length !== 1
        || active.id !== scene.id
        || response.activeSceneId !== scene.id
      ) throw new Error("Project create committed, but the UI reread did not prove the exact new project, Scene, active Scene, and zero-asset state.");
      const committedSession = await createDesktopProjectProposalSession({
        projectId,
        batch: projectProposalSession.batch,
        history: receipt.history,
      });
      await persistProjectProposalSession(committedSession);
      dispatch({ kind: "replace", document: active });
      setProjectScenes(scenes);
      setProjectPersistedSceneJson(scenes.map(serializeSceneDocument));
      setActiveSceneId(response.activeSceneId);
      setActiveProjectId(projectId);
      setSelectedProjectId(projectId);
      setProjectGeneration(response.receipt.generation);
      setHandoutAssetId(null);
      setAudioAssetId(null);
      setTokenAssetId(null);
      setProjectSaveReceipt(receipt.create);
      setProjectSavePreview(null);
      setProjectSaveAsPreview(null);
      setProjectSaveAsContent(null);
      setProjectSaveContent(null);
      setProjectSaveInverseContent(null);
      setProjectCloseNotice(null);
      setProjectLoadResponse(response);
      setFoundryPreview(null);
      setProjectCreatePreview(null);
      if (receipt.create.workspaceMetadata) setWorkspaceIndexGeneration(receipt.create.workspaceMetadata.indexGeneration);
      setWorkspaceMetadataWarning(receipt.create.workspaceMetadataWarning ?? null);
      if (receipt.create.workspaceMetadataWarning) setProjectError(`Workspace metadata warning: ${receipt.create.workspaceMetadataWarning}; project content was created and remains readable.`);
      await refreshProjectCatalog();
    } catch (error) {
      const candidate = error as Partial<{ session: DesktopProjectProposalSession | null }>;
      if (candidate.session) {
        try {
          await persistProjectProposalSession(candidate.session);
        } catch (persistError) {
          setProjectProposalSessionError(`Project create outcome is unknown and its recovery session could not be persisted: ${persistError instanceof Error ? persistError.message : String(persistError)}`);
        }
      }
      setProjectProposalSessionError(formatProjectStoreFailure(error));
    } finally {
      setProjectBusy(false);
    }
  }, [nativeProjectStoreAvailable, persistProjectProposalSession, projectBusy, projectProposalSession, refreshProjectCatalog]);

  const previewSaveCurrentProject = useCallback(async () => {
    if (!nativeProjectStoreAvailable || projectBusy || !activeProjectId) return;
    const terminalStatuses = ["rejected", "cancelled", "stale", "committed", "recovered", "undone", "redone"];
    if (projectProposalSession && !terminalStatuses.includes(projectProposalSession.history.status)) {
      setProjectProposalSessionError("Resolve the current " + projectProposalSession.history.status + " project proposal before previewing a project save.");
      return;
    }
    setProjectBusy(true);
    setProjectError(null);
    setProjectProposalSessionError(null);
    try {
      const catalog = await listProjectBundles();
      if (!(catalog.status === "PASS" || catalog.status === "PARTIAL") || catalog.noWrite !== true || catalog.noFoundryWrite !== true) {
        throw new Error("Project save requires an exact no-write catalog reread before preview; no project state was changed.");
      }
      const catalogEntry = catalog.entries.find((entry) => entry.projectId === activeProjectId);
      if (!catalogEntry || catalogEntry.status !== "PASS" || catalogEntry.generation === null || catalogEntry.contentSha256 === null) {
        throw new Error("Project save requires one exact healthy active project catalog entry; no project state was changed.");
      }
      const current = await loadProjectBundle(activeProjectId);
      if (
        current.receipt.projectId !== activeProjectId
        || current.receipt.status !== "PASS"
        || current.receipt.noFoundryWrite !== true
        || current.receipt.generation !== catalogEntry.generation
        || current.receipt.contentSha256 !== catalogEntry.contentSha256
      ) throw new Error("Project save catalog and project rereads disagree on the active target; no project state was changed.");
      if (current.assets.length !== 0) {
        throw new Error("Project save UI integration is currently bounded to zero-asset projects; use the role-specific asset path so existing asset bytes are not dropped.");
      }
      const inverseContent = projectSaveContentFromProjectLoad(current);
      const proposedContent: ProjectSaveContent = {
        scenes: currentProjectScenes,
        activeSceneId,
        assets: [],
      };
      const contentDescriptorSha256 = await hashProjectSaveContent(proposedContent);
      const inverseDescriptorSha256 = await hashProjectSaveContent(inverseContent);
      if (contentDescriptorSha256 === inverseDescriptorSha256) {
        throw new Error("Project save requires a semantic Scene or active-Scene change; no project state was changed.");
      }
      const observedAt = new Date().toISOString();
      const preview = await createProjectSavePreview({
        projectId: activeProjectId,
        currentGeneration: current.receipt.generation,
        currentContentSha256: current.receipt.contentSha256,
        contentDescriptorSha256,
        proposedSceneCount: proposedContent.scenes.length,
        proposedActiveSceneId: proposedContent.activeSceneId,
        proposedAssetCount: proposedContent.assets.length,
      });
      const batch = await createProjectSaveProposalBatch({
        batchId: "dbx:proposal:desktop-project-save-" + activeProjectId.replace(/[^a-z0-9._-]/gi, "-").toLowerCase() + "-" + Date.now(),
        preview,
        createdAt: observedAt,
      });
      const history = await previewProposalBatch(batch, desktopProposalRequester, observedAt);
      const session = await createDesktopProjectProposalSession({ projectId: batch.base.targetId, batch, history });
      setProjectSavePreview(preview);
      setProjectSaveContent(proposedContent);
      setProjectSaveInverseContent(inverseContent);
      setProjectRenamePreview(null);
      setProjectCreatePreview(null);
      await persistProjectProposalSession(session);
    } catch (error) {
      setProjectSavePreview(null);
      setProjectSaveAsPreview(null);
      setProjectSaveAsContent(null);
      setProjectSaveContent(null);
      setProjectSaveInverseContent(null);
      setProjectProposalSessionError(error instanceof Error ? error.message : String(error));
    } finally {
      setProjectBusy(false);
    }
  }, [activeProjectId, activeSceneId, currentProjectScenes, nativeProjectStoreAvailable, persistProjectProposalSession, projectBusy, projectProposalSession]);

  const applySelectedProjectSaveProposal = useCallback(async () => {
    if (!nativeProjectStoreAvailable || projectBusy || !projectProposalSession || projectProposalSession.history.status !== "approved") return;
    const command = projectProposalSession.batch.commands[0];
    if (!command || command.kind !== "project.save") {
      setProjectProposalSessionError("Apply requires the exact approved project.save proposal; no project state was changed.");
      return;
    }
    if (!projectSavePreview || !projectSaveContent || !projectSaveInverseContent || projectSavePreview.projectId !== projectProposalSession.projectId) {
      setProjectProposalSessionError("Project save content is not bound to the approved preview; no project state was changed.");
      return;
    }
    setProjectBusy(true);
    setProjectError(null);
    setProjectProposalSessionError(null);
    try {
      const receipt = await executeApprovedProjectSave({
        session: projectProposalSession,
        content: projectSaveContent,
        inverseContent: projectSaveInverseContent,
        executor: desktopProposalReviewer,
      });
      const response = await loadProjectBundle(projectProposalSession.projectId);
      const scenes = response.scenesJson.map(parseStoredScene);
      const active = parseActiveStoredScene(response);
      if (
        receipt.status !== "PASS"
        || receipt.history.status !== "undone"
        || receipt.projectContentWrite !== true
        || receipt.noFoundryWrite !== true
        || receipt.afterUndo.projectId !== projectProposalSession.projectId
        || response.receipt.projectId !== projectProposalSession.projectId
        || response.receipt.generation !== receipt.afterUndo.generation
        || response.receipt.contentSha256 !== receipt.afterUndo.contentSha256
        || response.receipt.sceneCount !== receipt.afterUndo.sceneCount
        || response.receipt.assetCount !== receipt.afterUndo.assetCount
        || scenes.length !== receipt.afterUndo.sceneCount
        || active.id !== receipt.afterUndo.activeSceneId
        || response.activeSceneId !== receipt.afterUndo.activeSceneId
      ) throw new Error("Project save committed, but the UI reread did not prove the exact inverse-restored project and active Scene.");
      const committedSession = await createDesktopProjectProposalSession({
        projectId: projectProposalSession.projectId,
        batch: projectProposalSession.batch,
        history: receipt.history,
      });
      await persistProjectProposalSession(committedSession);
      dispatch({ kind: "replace", document: active });
      setProjectScenes(scenes);
      setProjectPersistedSceneJson(scenes.map(serializeSceneDocument));
      setActiveSceneId(response.activeSceneId);
      setActiveProjectId(response.receipt.projectId);
      setSelectedProjectId(response.receipt.projectId);
      setProjectGeneration(response.receipt.generation);
      setProjectSaveReceipt(receipt.inverseRestore);
      setProjectCloseNotice(null);
      setProjectLoadResponse(response);
      setFoundryPreview(null);
      setProjectSavePreview(null);
      setProjectSaveContent(null);
      setProjectSaveInverseContent(null);
      if (response.workspaceMetadata) setWorkspaceIndexGeneration(response.workspaceMetadata.indexGeneration);
      setWorkspaceMetadataWarning(response.workspaceMetadataWarning ?? null);
      if (response.workspaceMetadataWarning) setProjectError("Workspace metadata warning: " + response.workspaceMetadataWarning + "; project content remains readable.");
      await refreshProjectCatalog();
    } catch (error) {
      const candidate = error as Partial<{ session: DesktopProjectProposalSession | null }>;
      if (candidate.session) {
        try {
          await persistProjectProposalSession(candidate.session);
        } catch (persistError) {
          setProjectProposalSessionError("Project save outcome is unknown and its recovery session could not be persisted: " + (persistError instanceof Error ? persistError.message : String(persistError)));
        }
      }
      setProjectProposalSessionError(formatProjectStoreFailure(error));
    } finally {
      setProjectBusy(false);
    }
  }, [loadProjectBundle, nativeProjectStoreAvailable, persistProjectProposalSession, projectBusy, projectProposalSession, projectSaveContent, projectSaveInverseContent, projectSavePreview, refreshProjectCatalog]);

  const openSelectedProject = useCallback(async () => {
    if (!nativeProjectStoreAvailable || projectBusy || !selectedProjectId) return;
    setProjectBusy(true);
    setProjectError(null);
    try {
      await loadSavedProject(selectedProjectId, true);
      setFoundryPreview(null);
      await refreshProjectCatalog();
    } catch (error) {
      setProjectError(formatProjectStoreFailure(error));
    } finally {
      setProjectBusy(false);
    }
  }, [loadSavedProject, nativeProjectStoreAvailable, projectBusy, refreshProjectCatalog, selectedProjectId]);

  const previewSaveCurrentProjectAs = useCallback(async () => {
    if (!nativeProjectStoreAvailable || projectBusy || !activeProjectId) return;
    const terminalStatuses = ["rejected", "cancelled", "stale", "committed", "recovered", "undone", "redone"];
    if (projectProposalSession && !terminalStatuses.includes(projectProposalSession.history.status)) {
      setProjectProposalSessionError("Resolve the current " + projectProposalSession.history.status + " project proposal before previewing a project save-as.");
      return;
    }
    if (projectDirty) {
      setProjectProposalSessionError("Save as requires a clean active project so the exact persisted source remains preserved; save the active project first.");
      return;
    }
    setProjectBusy(true);
    setProjectError(null);
    setProjectProposalSessionError(null);
    try {
      const catalog = await listProjectBundles();
      if ((catalog.status !== "PASS" && catalog.status !== "PARTIAL") || catalog.noWrite !== true || catalog.noFoundryWrite !== true) {
        throw new Error("Project save-as requires an exact no-write catalog reread before preview; no project state was changed.");
      }
      const sourceEntry = catalog.entries.find((entry) => entry.projectId === activeProjectId);
      if (!sourceEntry || sourceEntry.status !== "PASS" || sourceEntry.generation === null || sourceEntry.contentSha256 === null) {
        throw new Error("Project save-as requires one exact healthy source project catalog entry; no project state was changed.");
      }
      const targetProjectId = projectIdFromInput(projectNameInput);
      const proposedDisplayName = displayNameFromInput(projectNameInput);
      if (targetProjectId === activeProjectId) throw new Error("Project save-as requires a target project ID distinct from the active source.");
      if (catalog.entries.some((entry) => entry.projectId === targetProjectId)) {
        throw new Error("Project save-as target " + targetProjectId + " already exists; no overwrite or cleanup is permitted.");
      }
      const source = await loadProjectBundle(activeProjectId);
      if (source.receipt.projectId !== activeProjectId || source.receipt.status !== "PASS" || source.receipt.noFoundryWrite !== true || source.receipt.generation !== sourceEntry.generation || source.receipt.contentSha256 !== sourceEntry.contentSha256) {
        throw new Error("Project save-as catalog and source rereads disagree on the exact source; no project state was changed.");
      }
      const sourceAssetCollectionSha256 = await hashProjectSaveAsAssetCollection(source.assets);
      const sourceScenes = source.scenesJson.map(parseStoredScene);
      const proposalStorage = browserDesktopProjectProposalSessionStorage();
      const existingProposal = await loadDesktopProjectProposalSession(proposalStorage, activeProjectId);
      if (existingProposal.status === "BLOCKED") throw new Error(existingProposal.reason);
      if (existingProposal.status === "PASS") {
        if (!terminalStatuses.includes(existingProposal.session.history.status)) throw new Error("An existing project proposal session must reach a terminal state and be cleared before replacement.");
        await clearTerminalDesktopProjectProposalSession(proposalStorage, activeProjectId);
      }
      const observedAt = new Date().toISOString();
      const preview = await createProjectSaveAsPreview({
        sourceProjectId: activeProjectId,
        targetProjectId,
        sourceGeneration: source.receipt.generation,
        sourceContentSha256: source.receipt.contentSha256,
        sourceAssetCount: source.assets.length,
        sourceAssetCollectionSha256,
        workspaceIndexGeneration: catalog.workspaceIndexGeneration,
        scenes: sourceScenes,
        activeSceneId: source.activeSceneId,
        proposedDisplayName,
      });
      const batch = await createProjectSaveAsProposalBatch({
        batchId: "dbx:proposal:desktop-project-save-as-" + targetProjectId.replace(/[^a-z0-9._-]/gi, "-").toLowerCase() + "-" + Date.now(),
        preview,
        createdAt: observedAt,
      });
      const history = await previewProposalBatch(batch, desktopProposalRequester, observedAt);
      const session = await createDesktopProjectProposalSession({ projectId: batch.base.targetId, batch, history });
      setProjectRenamePreview(null);
      setProjectCreatePreview(null);
      setProjectSavePreview(null);
      setProjectSaveContent(null);
      setProjectSaveInverseContent(null);
      setProjectSaveAsPreview(preview);
      setProjectSaveAsContent({ scenes: sourceScenes, activeSceneId: source.activeSceneId });
      setWorkspaceIndexGeneration(catalog.workspaceIndexGeneration);
      await persistProjectProposalSession(session);
    } catch (error) {
      setProjectSaveAsPreview(null);
      setProjectSaveAsContent(null);
      setProjectProposalSessionError(error instanceof Error ? error.message : String(error));
    } finally {
      setProjectBusy(false);
    }
  }, [activeProjectId, nativeProjectStoreAvailable, persistProjectProposalSession, projectBusy, projectDirty, projectNameInput, projectProposalSession]);

  const applySelectedProjectSaveAsProposal = useCallback(async () => {
    if (!nativeProjectStoreAvailable || projectBusy || !projectProposalSession || projectProposalSession.history.status !== "approved") return;
    const command = projectProposalSession.batch.commands[0];
    if (!command || command.kind !== "project.save-as") {
      setProjectProposalSessionError("Apply requires the exact approved project.save-as proposal; no project state was changed.");
      return;
    }
    if (!projectSaveAsPreview || !projectSaveAsContent || projectSaveAsPreview.sourceProjectId !== projectProposalSession.projectId || projectSaveAsPreview.targetProjectId !== command.payload.targetProjectId) {
      setProjectProposalSessionError("Project save-as content is not bound to the approved source/target preview; no project state was changed.");
      return;
    }
    setProjectBusy(true);
    setProjectError(null);
    setProjectProposalSessionError(null);
    try {
      const receipt = await executeApprovedProjectSaveAs({ session: projectProposalSession, content: projectSaveAsContent, executor: desktopProposalReviewer });
      const catalog = await listProjectBundles();
      const source = await loadProjectBundle(receipt.sourceProjectId);
      const target = await loadProjectBundle(receipt.targetProjectId);
      const sourceEntry = catalog.entries.find((entry) => entry.projectId === receipt.sourceProjectId);
      const targetEntry = catalog.entries.find((entry) => entry.projectId === receipt.targetProjectId);
      const sourceAssetCollectionSha256 = await hashProjectSaveAsAssetCollection(source.assets);
      const targetAssetCollectionSha256 = await hashProjectSaveAsAssetCollection(target.assets);
      const targetScenes = target.scenesJson.map(parseStoredScene);
      const targetActive = parseActiveStoredScene(target);
      const targetScenesSha256 = await hashProjectPersistentAddSceneState({ projectId: receipt.targetProjectId, scenes: targetScenes, activeSceneId: target.activeSceneId });
      if (
        receipt.status !== "PASS" || receipt.history.status !== "committed" || receipt.history.receipts.length !== 4
        || receipt.projectContentWrite !== true || receipt.projectPersistenceWrite !== true || receipt.sourcePreserved !== true || receipt.targetCreated !== true || receipt.noFoundryWrite !== true
        || receipt.before.source.projectId !== projectProposalSession.projectId || receipt.before.targetAbsent !== true
        || receipt.afterApply.source.generation !== receipt.before.source.generation || receipt.afterApply.source.contentSha256 !== receipt.before.source.contentSha256
        || receipt.afterApply.source.scenesSha256 !== receipt.before.source.scenesSha256 || receipt.afterApply.source.activeSceneId !== receipt.before.source.activeSceneId
        || receipt.afterApply.source.assetCollectionSha256 !== receipt.before.source.assetCollectionSha256 || sourceAssetCollectionSha256 !== receipt.before.source.assetCollectionSha256
        || !receipt.afterApply.target || receipt.afterApply.target.projectId !== receipt.targetProjectId || receipt.afterApply.target.assets.length !== receipt.before.source.assets.length
        || receipt.afterApply.target.assetCollectionSha256 !== receipt.before.source.assetCollectionSha256 || targetAssetCollectionSha256 !== receipt.before.source.assetCollectionSha256
        || receipt.afterApply.target.generation !== receipt.saveAs.generation || receipt.afterApply.target.sceneCount !== projectSaveAsContent.scenes.length
        || receipt.afterApply.target.scenesSha256 !== targetScenesSha256 || receipt.afterApply.target.activeSceneId !== projectSaveAsContent.activeSceneId || receipt.afterApply.target.catalogEntry.displayName !== command.payload.proposedDisplayName
        || receipt.saveAs.workspaceMetadata?.indexGeneration !== receipt.before.workspaceIndexGeneration + 1
        || receipt.afterApply.workspaceIndexGeneration !== receipt.saveAs.workspaceMetadata?.indexGeneration
        || (catalog.status !== "PASS" && catalog.status !== "PARTIAL") || catalog.noWrite !== true || catalog.noFoundryWrite !== true
        || catalog.workspaceIndexGeneration !== receipt.afterApply.workspaceIndexGeneration
        || !sourceEntry || sourceEntry.status !== "PASS" || sourceEntry.displayName !== receipt.before.source.catalogEntry.displayName
        || sourceEntry.generation !== receipt.before.source.generation || sourceEntry.contentSha256 !== receipt.before.source.contentSha256
        || !targetEntry || targetEntry.status !== "PASS" || targetEntry.projectId !== receipt.targetProjectId || targetEntry.displayName !== command.payload.proposedDisplayName
        || targetEntry.generation !== receipt.saveAs.generation || targetEntry.contentSha256 !== receipt.saveAs.contentSha256
        || target.receipt.projectId !== receipt.targetProjectId || target.receipt.status !== "PASS" || target.receipt.generation !== receipt.saveAs.generation
        || target.receipt.contentSha256 !== receipt.saveAs.contentSha256 || target.receipt.sceneCount !== projectSaveAsContent.scenes.length || target.receipt.assetCount !== receipt.before.source.assets.length
        || target.activeSceneId !== projectSaveAsContent.activeSceneId || targetScenes.length !== projectSaveAsContent.scenes.length || targetActive.id !== projectSaveAsContent.activeSceneId
      ) throw new Error("Project save-as committed, but the UI rereads did not prove exact source preservation, target creation, workspace metadata, and target content.");
      const committedSession = await createDesktopProjectProposalSession({ projectId: projectProposalSession.projectId, batch: projectProposalSession.batch, history: receipt.history });
      await persistProjectProposalSession(committedSession);
      dispatch({ kind: "replace", document: targetActive });
      setProjectScenes(targetScenes);
      setProjectPersistedSceneJson(targetScenes.map(serializeSceneDocument));
      setActiveSceneId(target.activeSceneId);
      setActiveProjectId(receipt.targetProjectId);
      setSelectedProjectId(receipt.targetProjectId);
      setProjectGeneration(target.receipt.generation);
      setHandoutAssetId(target.assets.find((asset) => asset.registration?.role === "handout")?.registration?.assetId ?? null);
      setAudioAssetId(target.assets.find((asset) => asset.registration?.role === "audio")?.registration?.assetId ?? null);
      setTokenAssetId(target.assets.find((asset) => asset.registration?.role === "token")?.registration?.assetId ?? null);
      setProjectSaveReceipt(receipt.saveAs);
      setProjectSavePreview(null);
      setProjectSaveAsPreview(null);
      setProjectSaveAsContent(null);
      setProjectSaveContent(null);
      setProjectSaveInverseContent(null);
      setProjectNameInput(command.payload.proposedDisplayName);
      setProjectCloseNotice(null);
      setProjectLoadResponse(target);
      setFoundryPreview(null);
      setWorkspaceIndexGeneration(catalog.workspaceIndexGeneration);
      setWorkspaceMetadataWarning(catalog.workspaceMetadataWarning ?? null);
      setProjectError(catalog.workspaceMetadataWarning ? "Workspace metadata warning: " + catalog.workspaceMetadataWarning + "; source and target content remain readable." : null);
      await refreshProjectCatalog();
    } catch (error) {
      const candidate = error as Partial<{ session: DesktopProjectProposalSession | null }>;
      if (candidate.session) {
        try {
          await persistProjectProposalSession(candidate.session);
        } catch (persistError) {
          setProjectProposalSessionError("Project save-as outcome is unknown and its recovery session could not be persisted: " + (persistError instanceof Error ? persistError.message : String(persistError)));
        }
      }
      setProjectProposalSessionError(formatProjectStoreFailure(error));
    } finally {
      setProjectBusy(false);
    }
  }, [loadProjectBundle, nativeProjectStoreAvailable, persistProjectProposalSession, projectBusy, projectProposalSession, projectSaveAsContent, projectSaveAsPreview, refreshProjectCatalog]);

  const previewProjectAddScene = useCallback(async () => {
    if (!activeProjectId || projectBusy) return;
    if (currentProjectScenes.length >= 256) {
      setProjectProposalSessionError("This project already contains the maximum 256 Scenes.");
      return;
    }
    if (projectProposalSession && !["rejected", "cancelled", "stale", "committed", "recovered", "undone", "redone"].includes(projectProposalSession.history.status)) {
      setProjectProposalSessionError("Finish, cancel, reject, or mark the current project proposal stale before reviewing a new Scene.");
      return;
    }
    setProjectBusy(true);
    setProjectProposalSessionError(null);
    try {
      const state: ProjectAddSceneState = { projectId: activeProjectId, scenes: currentProjectScenes, activeSceneId };
      const observedAt = new Date().toISOString();
      const preview = await createProjectAddScenePreview(state);
      const batch = await createProjectAddSceneProposalBatch({
        batchId: `dbx:proposal:desktop-project-add-scene-${activeProjectId.replace(/[^a-z0-9._-]/gi, "-").toLowerCase()}-${Date.now()}`,
        preview,
        createdAt: observedAt,
      });
      const history = await previewProposalBatch(batch, desktopProposalRequester, observedAt);
      await persistProjectProposalSession(await createDesktopProjectAddSceneProposalSession({ projectId: activeProjectId, batch, history }));
    } catch (error) {
      setProjectProposalSessionError(error instanceof Error ? error.message : String(error));
    } finally {
      setProjectBusy(false);
    }
  }, [activeProjectId, activeSceneId, currentProjectScenes, persistProjectProposalSession, projectBusy, projectProposalSession]);

  const applySelectedCommittedProjectAddScene = useCallback(async () => {
    if (projectBusy || !activeProjectId || !projectProposalSession || projectProposalSession.history.status !== "approved" || projectProposalSession.batch.commands[0]?.kind !== "project.add-scene") return;
    setProjectBusy(true);
    setProjectProposalSessionError(null);
    try {
      const inverseState: ProjectAddSceneState = { projectId: activeProjectId, scenes: currentProjectScenes, activeSceneId };
      const store = inMemoryProjectAddSceneStore(inverseState);
      const receipt = await executeCommittedProjectAddScene({ session: projectProposalSession, store, executor: desktopProposalReviewer, observedAt: new Date().toISOString() });
      const applied = await store.read(activeProjectId);
      const active = applied.scenes.find((scene) => scene.id === applied.activeSceneId);
      if (!active || receipt.afterApply.activeSceneId !== active.id || receipt.afterApply.sceneCount !== applied.scenes.length) throw new Error("Committed add-Scene authoritative reread did not match the editor state.");
      projectAddSceneUndoRef.current = { batchId: receipt.batchId, store, inverseState };
      await persistProjectProposalSession(receipt.session);
      setProjectScenes(applied.scenes);
      setActiveSceneId(applied.activeSceneId);
      dispatch({ kind: "replace", document: active });
      setProjectLoadResponse(null);
      setFoundryPreview(null);
    } catch (error) {
      const candidate = error as Partial<{ session: DesktopProjectProposalSession | null }>;
      if (candidate.session) await persistProjectProposalSession(candidate.session);
      setProjectProposalSessionError(error instanceof Error ? error.message : String(error));
    } finally {
      setProjectBusy(false);
    }
  }, [activeProjectId, activeSceneId, currentProjectScenes, persistProjectProposalSession, projectBusy, projectProposalSession]);

  const undoSelectedCommittedProjectAddScene = useCallback(async () => {
    if (projectBusy || !activeProjectId || !projectProposalSession || projectProposalSession.history.status !== "committed" || projectProposalSession.batch.commands[0]?.kind !== "project.add-scene") return;
    const undoState = projectAddSceneUndoRef.current;
    if (!undoState || undoState.batchId !== projectProposalSession.batch.batchId) {
      setProjectProposalSessionError("The in-memory add-Scene undo handle is unavailable after reload or replacement; no retry or project write was attempted.");
      return;
    }
    setProjectBusy(true);
    setProjectProposalSessionError(null);
    try {
      const receipt = await undoCommittedProjectAddScene({ session: projectProposalSession, store: undoState.store, inverseState: undoState.inverseState, executor: desktopProposalReviewer, observedAt: new Date().toISOString() });
      const restored = await undoState.store.read(activeProjectId);
      const active = restored.scenes.find((scene) => scene.id === restored.activeSceneId);
      if (!active || receipt.afterUndo.activeSceneId !== active.id || receipt.afterUndo.sceneCount !== restored.scenes.length) throw new Error("Committed add-Scene undo authoritative reread did not match the editor state.");
      await persistProjectProposalSession(receipt.session);
      projectAddSceneUndoRef.current = null;
      setProjectScenes(restored.scenes);
      setActiveSceneId(restored.activeSceneId);
      dispatch({ kind: "replace", document: active });
      setProjectLoadResponse(null);
      setFoundryPreview(null);
    } catch (error) {
      const candidate = error as Partial<{ session: DesktopProjectProposalSession | null }>;
      if (candidate.session) await persistProjectProposalSession(candidate.session);
      setProjectProposalSessionError(error instanceof Error ? error.message : String(error));
    } finally {
      setProjectBusy(false);
    }
  }, [activeProjectId, persistProjectProposalSession, projectBusy, projectProposalSession]);

  const switchProjectScene = useCallback((sceneId: string) => {
    if (projectBusy || sceneId === activeSceneId) return;
    const committed = currentProjectScenes;
    const next = committed.find((scene) => scene.id === sceneId);
    if (!next) {
      setProjectError("The selected Scene is not present in the active project.");
      return;
    }
    setProjectScenes(committed);
    setActiveSceneId(sceneId);
    dispatch({ kind: "replace", document: next });
    setProjectLoadResponse(null);
    setFoundryPreview(null);
    setProjectError(null);
  }, [activeSceneId, currentProjectScenes, projectBusy]);

  const applySelectedProjectRenameProposal = useCallback(async () => {
    if (!nativeProjectStoreAvailable || projectBusy || !projectProposalSession || projectProposalSession.history.status !== "approved") return;
    const command = projectProposalSession.batch.commands[0];
    if (!command || command.kind !== "project.rename") {
      setProjectProposalSessionError("Apply requires the exact approved project.rename proposal; no project state was changed.");
      return;
    }
    if (!projectRenamePreview || projectRenamePreview.projectId !== projectProposalSession.projectId) {
      setProjectProposalSessionError("Project rename preview is not bound to the approved target; no project state was changed.");
      return;
    }
    setProjectBusy(true);
    setProjectError(null);
    setProjectProposalSessionError(null);
    try {
      const receipt = await executeApprovedProjectRename({
        session: projectProposalSession,
        executor: desktopProposalReviewer,
      });
      const catalog = await listProjectBundles();
      const exactEntry = catalog.entries.find((entry) => entry.projectId === projectProposalSession.projectId);
      if (
        receipt.status !== "PASS"
        || receipt.history.status !== "undone"
        || receipt.projectContentWrite !== false
        || receipt.noFoundryWrite !== true
        || receipt.before.projectId !== projectProposalSession.projectId
        || receipt.afterApply.projectId !== projectProposalSession.projectId
        || receipt.afterUndo.projectId !== projectProposalSession.projectId
        || receipt.before.displayName !== projectRenamePreview.currentDisplayName
        || receipt.afterApply.displayName !== projectRenamePreview.proposedDisplayName
        || receipt.afterUndo.displayName !== projectRenamePreview.currentDisplayName
        || receipt.before.generation !== receipt.afterApply.generation
        || receipt.before.generation !== receipt.afterUndo.generation
        || receipt.before.contentSha256 !== receipt.afterApply.contentSha256
        || receipt.before.contentSha256 !== receipt.afterUndo.contentSha256
        || receipt.afterApply.workspaceIndexGeneration <= receipt.before.workspaceIndexGeneration
        || receipt.afterUndo.workspaceIndexGeneration <= receipt.afterApply.workspaceIndexGeneration
        || receipt.apply.status !== "PASS"
        || receipt.apply.atomicReplace !== true
        || receipt.apply.directoryEntrySync !== true
        || receipt.undo.status !== "PASS"
        || receipt.undo.atomicReplace !== true
        || receipt.undo.directoryEntrySync !== true
        || (catalog.status !== "PASS" && catalog.status !== "PARTIAL")
        || catalog.noWrite !== true
        || catalog.noFoundryWrite !== true
        || catalog.workspaceIndexGeneration !== receipt.afterUndo.workspaceIndexGeneration
        || !exactEntry
        || exactEntry.status !== "PASS"
        || exactEntry.displayName !== receipt.afterUndo.displayName
        || exactEntry.generation !== receipt.afterUndo.generation
        || exactEntry.contentSha256 !== receipt.afterUndo.contentSha256
      ) throw new Error("Project rename committed, but the UI reread did not prove the exact inverse-restored metadata and unchanged project content.");
      const committedSession = await createDesktopProjectProposalSession({
        projectId: projectProposalSession.projectId,
        batch: projectProposalSession.batch,
        history: receipt.history,
      });
      await persistProjectProposalSession(committedSession);
      setProjectCatalog(catalog.entries);
      setSelectedProjectId(projectProposalSession.projectId);
      setProjectNameInput(receipt.afterUndo.displayName);
      setWorkspaceIndexGeneration(receipt.afterUndo.workspaceIndexGeneration);
      setWorkspaceMetadataWarning(catalog.workspaceMetadataWarning ?? null);
      setProjectRenamePreview(null);
      setProjectCloseNotice(null);
      setProjectError(catalog.workspaceMetadataWarning ? "Workspace metadata warning: " + catalog.workspaceMetadataWarning + "; project content remains readable." : null);
      setProjectProposalSessionError(null);
    } catch (error) {
      setProjectProposalSessionError(formatProjectStoreFailure(error));
    } finally {
      setProjectBusy(false);
    }
  }, [nativeProjectStoreAvailable, persistProjectProposalSession, projectBusy, projectProposalSession, projectRenamePreview]);

  const reloadSavedProject = useCallback(async () => {
    if (!nativeProjectStoreAvailable || projectBusy || !activeProjectId) return;
    setProjectBusy(true);
    setProjectError(null);
    try {
      await loadSavedProject(activeProjectId, true);
      setFoundryPreview(null);
      await refreshProjectCatalog();
    } catch (error) {
      setProjectError(formatProjectStoreFailure(error));
    } finally {
      setProjectBusy(false);
    }
  }, [activeProjectId, loadSavedProject, nativeProjectStoreAvailable, projectBusy, refreshProjectCatalog]);

  const closeActiveProject = useCallback(() => {
    if (!activeProjectId || projectBusy) return;
    const decision = projectSessionCloseDecision(activeProjectId, currentProjectScenes, projectPersistedSceneJson);
    if (decision.status === "BLOCKED") {
      setProjectError(`PROJECT_CLOSE_DIRTY: ${decision.reason} Save the active project before closing, or cancel.`);
      setProjectCloseNotice(null);
      return;
    }
    const closedProjectId = decision.projectId;
    dispatch({ kind: "replace", document: fixtureScene });
    setProjectScenes([fixtureScene]);
    setProjectPersistedSceneJson(null);
    setActiveSceneId(fixtureScene.id);
    setActiveProjectId(null);
    setSelectedProjectId("");
    setProjectGeneration(0);
    setHandoutAssetId(null);
    setAudioAssetId(null);
    setTokenAssetId(null);
    setProjectSaveReceipt(null);
    setProjectLoadResponse(null);
    setFoundryPreview(null);
    setMigrationExplanation(null);
    setBackupPromotionPreview(null);
    setBackupPromotionReceipt(null);
    setRecoveryInspection(null);
    setSelectedRecoveryAssetId(null);
    setRecoveryPreview(null);
    setRecoveryCandidateBytes(null);
    setRecoveryReceipt(null);
    setDetachPreview(null);
    setDetachReceipt(null);
    setWorkspaceMetadataWarning(null);
    setProjectError(null);
    setProjectCloseNotice(`Closed ${closedProjectId ?? "project"} in memory; persisted project, workspace, assets, backups, and foreign state were not written. Select it from the catalog to reopen.`);
  }, [activeProjectId, currentProjectScenes, projectBusy, projectPersistedSceneJson]);

  const compileFoundryPreview = useCallback(async () => {
    if (projectBusy) return;
    setProjectBusy(true);
    setProjectError(null);
    try {
      if (!activeProjectId) throw new Error("Open or create a project before compiling a preview.");
      const loaded = projectLoadResponse?.receipt.projectId === activeProjectId
        ? projectLoadResponse
        : (await loadSavedProject(activeProjectId, false)).response;
      const preview = await compileSceneFoundryPreview({
        projectId: activeProjectId,
        scene: document,
        assets: loaded.assets,
      });
      setFoundryPreview(preview);
    } catch (error) {
      setProjectError(formatProjectStoreFailure(error));
    } finally {
      setProjectBusy(false);
    }
  }, [activeProjectId, document, loadSavedProject, projectBusy, projectLoadResponse]);

  const importSelectedSceneBackground = useCallback(async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file || !activeProjectId || projectBusy || !nativeProjectStoreAvailable) return;
    if (file.type !== "image/png") {
      setProjectError("Background import accepts PNG images only; the typed background binding engine rejects unreviewed media types.");
      return;
    }
    if (projectDirty) {
      setProjectError("Background import requires a clean active project so the exact persisted Scene state remains preserved; save the active project first.");
      return;
    }
    const terminalStatuses = ["rejected", "cancelled", "stale", "committed", "recovered", "undone", "redone"];
    if (projectProposalSession && !terminalStatuses.includes(projectProposalSession.history.status)) {
      setProjectProposalSessionError("Resolve the current " + projectProposalSession.history.status + " project proposal before previewing a background asset.");
      return;
    }
    setProjectBusy(true);
    setProjectError(null);
    setProjectProposalSessionError(null);
    try {
      const catalog = await listProjectBundles();
      if ((catalog.status !== "PASS" && catalog.status !== "PARTIAL") || catalog.noWrite !== true || catalog.noFoundryWrite !== true) {
        throw new Error("Background binding requires an exact no-write catalog reread before preview; no project state was changed.");
      }
      const catalogEntry = catalog.entries.find((entry) => entry.projectId === activeProjectId);
      if (!catalogEntry || catalogEntry.status !== "PASS" || catalogEntry.generation === null || catalogEntry.contentSha256 === null) {
        throw new Error("Background binding requires one exact healthy active project catalog entry; no project state was changed.");
      }
      const current = await loadProjectBundle(activeProjectId);
      const inspection = await inspectProjectRecovery(activeProjectId);
      if (
        current.receipt.projectId !== activeProjectId
        || current.receipt.status !== "PASS"
        || current.receipt.noFoundryWrite !== true
        || current.receipt.generation !== catalogEntry.generation
        || current.receipt.contentSha256 !== catalogEntry.contentSha256
        || current.receipt.assetCount !== current.assets.length
        || inspection.status !== "PASS"
        || inspection.noWrite !== true
        || inspection.noFoundryWrite !== true
        || inspection.generation !== current.receipt.generation
        || inspection.contentSha256 !== current.receipt.contentSha256
        || inspection.primary.status !== "VALID"
        || (inspection.backup.status !== "VALID" && inspection.backup.status !== "MISSING")
      ) throw new Error("Background binding catalog, project, and recovery rereads disagree on the active target; no project state was changed.");
      const sourceScenes = current.scenesJson.map(parseStoredScene);
      if (!sourceScenes.some((scene) => scene.id === activeSceneId)) throw new Error("Background binding requires the selected Scene to remain present in the authoritative project reread.");
      const candidate: ProjectBackgroundAssetCandidate = {
        mediaType: "image/png",
        bytes: [...new Uint8Array(await file.arrayBuffer())],
        label: file.name.trim().slice(0, 100) || "Imported background",
        provenance: "user-import",
      };
      const descriptor = await deriveProjectBackgroundAssetDescriptor(candidate, activeSceneId);
      const proposedScenes = sourceScenes.map((scene) => scene.id === activeSceneId ? sceneWithBackgroundAsset(scene, descriptor.assetId) : scene);
      const assetAlreadyRegistered = current.assets.some((asset) => asset.sha256 === descriptor.assetSha256);
      const observedAt = new Date().toISOString();
      const preview = await createProjectAssetBindingPreview({
        projectId: activeProjectId,
        currentGeneration: current.receipt.generation,
        currentContentSha256: current.receipt.contentSha256,
        candidate,
        sceneId: activeSceneId,
        proposedSceneCount: proposedScenes.length,
        proposedActiveSceneId: current.activeSceneId,
        proposedAssetCount: current.assets.length + (assetAlreadyRegistered ? 0 : 1),
      });
      const batch = await createProjectAssetBindingProposalBatch({
        batchId: "dbx:proposal:desktop-project-background-bind-" + activeProjectId.replace(/[^a-z0-9._-]/gi, "-").toLowerCase() + "-" + Date.now(),
        preview,
        createdAt: observedAt,
      });
      const history = await previewProposalBatch(batch, desktopProposalRequester, observedAt);
      const session = await createDesktopProjectProposalSession({ projectId: batch.base.targetId, batch, history });
      setProjectRenamePreview(null);
      setProjectCreatePreview(null);
      setProjectSavePreview(null);
      setProjectSaveAsPreview(null);
      setProjectSaveAsContent(null);
      setProjectSaveContent(null);
      setProjectSaveInverseContent(null);
      setProjectHandoutPreview(null);
      setProjectHandoutContent(null);
      setProjectBackgroundPreview(preview);
      setProjectBackgroundContent({ scenes: proposedScenes, activeSceneId: current.activeSceneId, sceneId: activeSceneId, candidate });
      setWorkspaceIndexGeneration(catalog.workspaceIndexGeneration);
      await persistProjectProposalSession(session);
    } catch (error) {
      setProjectBackgroundPreview(null);
      setProjectBackgroundContent(null);
      setProjectError(formatProjectStoreFailure(error));
    } finally {
      setProjectBusy(false);
    }
  }, [activeProjectId, activeSceneId, nativeProjectStoreAvailable, persistProjectProposalSession, projectBusy, projectDirty, projectProposalSession]);

  const applySelectedProjectBackgroundProposal = useCallback(async () => {
    if (!nativeProjectStoreAvailable || projectBusy || !projectProposalSession || projectProposalSession.history.status !== "approved") return;
    const command = projectProposalSession.batch.commands[0];
    if (!command || command.kind !== "project.asset.bind") {
      setProjectProposalSessionError("Apply requires the exact approved project.asset.bind proposal; no project state was changed.");
      return;
    }
    if (!projectBackgroundPreview || !projectBackgroundContent || projectBackgroundPreview.projectId !== projectProposalSession.projectId) {
      setProjectProposalSessionError("Background asset content is not bound to the approved preview; no project state was changed.");
      return;
    }
    setProjectBusy(true);
    setProjectError(null);
    setProjectProposalSessionError(null);
    try {
      const inverseContent: ProjectAssetBindingContent = {
        ...projectBackgroundContent,
        scenes: (await loadProjectBundle(projectProposalSession.projectId)).scenesJson.map(parseStoredScene),
      };
      const receipt = await executeApprovedProjectAssetBinding({
        session: projectProposalSession,
        content: projectBackgroundContent,
        inverseContent,
        executor: desktopProposalReviewer,
      });
      const response = await loadProjectBundle(projectProposalSession.projectId);
      const catalog = await listProjectBundles();
      const inspection = await inspectProjectRecovery(projectProposalSession.projectId);
      const scenes = response.scenesJson.map(parseStoredScene);
      const active = scenes.find((scene) => scene.id === response.activeSceneId);
      const backgroundAsset = response.assets.find((asset) => asset.registration?.assetId === receipt.asset.assetId);
      const inspectedBackground = inspection.registeredAssets.find((asset) => asset.assetId === receipt.asset.assetId);
      const restoredBinding = scenes.find((scene) => scene.id === receipt.asset.sceneId)?.background.assetId ?? null;
      const catalogEntry = catalog.entries.find((entry) => entry.projectId === projectProposalSession.projectId);
      if (
        receipt.status !== "PASS"
        || receipt.history.status !== "undone"
        || receipt.history.receipts.length !== 5
        || receipt.projectContentWrite !== true
        || receipt.assetBytesPersisted !== true
        || receipt.assetTreePreserved !== true
        || receipt.sceneContentRestored !== true
        || receipt.noFoundryWrite !== true
        || response.receipt.projectId !== projectProposalSession.projectId
        || response.receipt.generation !== receipt.afterUndo.generation
        || response.receipt.contentSha256 !== receipt.afterUndo.contentSha256
        || response.receipt.sceneCount !== receipt.afterUndo.sceneCount
        || response.receipt.assetCount !== receipt.afterUndo.assetCount
        || response.activeSceneId !== receipt.afterUndo.activeSceneId
        || !active
        || !backgroundAsset
        || backgroundAsset.registration?.role !== "background"
        || inspectedBackground?.role !== "background"
        || inspectedBackground?.disposition !== "PRESENT_VALID"
        || inspection.noWrite !== true
        || inspection.noFoundryWrite !== true
        || restoredBinding !== receipt.afterUndo.backgroundBindings.find((binding) => binding.sceneId === receipt.asset.sceneId)?.assetId
        || !catalogEntry
        || catalogEntry.status !== "PASS"
        || catalogEntry.generation !== response.receipt.generation
        || catalogEntry.contentSha256 !== response.receipt.contentSha256
      ) throw new Error("Background binding committed, but authoritative rereads did not prove exact Scene binding, additive asset preservation, and inverse Scene restoration.");
      const committedSession = await createDesktopProjectProposalSession({
        projectId: projectProposalSession.projectId,
        batch: projectProposalSession.batch,
        history: receipt.history,
      });
      await persistProjectProposalSession(committedSession);
      dispatch({ kind: "replace", document: active });
      setProjectScenes(scenes);
      setProjectPersistedSceneJson(scenes.map(serializeSceneDocument));
      setActiveSceneId(response.activeSceneId);
      setProjectGeneration(response.receipt.generation);
      setProjectSaveReceipt(receipt.inverseRestore);
      setProjectCloseNotice(null);
      setProjectLoadResponse(response);
      setFoundryPreview(null);
      setProjectBackgroundPreview(null);
      setProjectBackgroundContent(null);
      if (response.workspaceMetadata) setWorkspaceIndexGeneration(response.workspaceMetadata.indexGeneration);
      setWorkspaceMetadataWarning(response.workspaceMetadataWarning ?? null);
      if (response.workspaceMetadataWarning) setProjectError("Workspace metadata warning: " + response.workspaceMetadataWarning + "; project content remains readable.");
      await refreshProjectCatalog();
    } catch (error) {
      const candidate = error as Partial<{ session: DesktopProjectProposalSession | null }>;
      if (candidate.session) {
        try {
          await persistProjectProposalSession(candidate.session);
        } catch (persistError) {
          setProjectProposalSessionError("Background binding outcome is unknown and its recovery session could not be persisted: " + (persistError instanceof Error ? persistError.message : String(persistError)));
        }
      }
      setProjectProposalSessionError(formatProjectStoreFailure(error));
    } finally {
      setProjectBusy(false);
    }
  }, [nativeProjectStoreAvailable, persistProjectProposalSession, projectBackgroundContent, projectBackgroundPreview, projectBusy, projectProposalSession, refreshProjectCatalog]);

  const importProjectHandout = useCallback(async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file || !activeProjectId || projectBusy || !nativeProjectStoreAvailable) return;
    if (file.type !== "image/png" && file.type !== "image/webp") {
      setProjectError("Handout import accepts only PNG or WebP images.");
      return;
    }
    if (projectDirty) {
      setProjectError("Handout import requires a clean active project so the exact persisted Scene state remains preserved; save the active project first.");
      return;
    }
    const terminalStatuses = ["rejected", "cancelled", "stale", "committed", "recovered", "undone", "redone"];
    if (projectProposalSession && !terminalStatuses.includes(projectProposalSession.history.status)) {
      setProjectProposalSessionError("Resolve the current " + projectProposalSession.history.status + " project proposal before previewing a handout asset.");
      return;
    }
    setProjectBusy(true);
    setProjectError(null);
    setProjectProposalSessionError(null);
    try {
      const catalog = await listProjectBundles();
      if ((catalog.status !== "PASS" && catalog.status !== "PARTIAL") || catalog.noWrite !== true || catalog.noFoundryWrite !== true) {
        throw new Error("Handout registration requires an exact no-write catalog reread before preview; no project state was changed.");
      }
      const catalogEntry = catalog.entries.find((entry) => entry.projectId === activeProjectId);
      if (!catalogEntry || catalogEntry.status !== "PASS" || catalogEntry.generation === null || catalogEntry.contentSha256 === null) {
        throw new Error("Handout registration requires one exact healthy active project catalog entry; no project state was changed.");
      }
      const current = await loadProjectBundle(activeProjectId);
      if (
        current.receipt.projectId !== activeProjectId
        || current.receipt.status !== "PASS"
        || current.receipt.noFoundryWrite !== true
        || current.receipt.generation !== catalogEntry.generation
        || current.receipt.contentSha256 !== catalogEntry.contentSha256
        || current.receipt.assetCount !== current.assets.length
      ) throw new Error("Handout registration catalog and project rereads disagree on the active target; no project state was changed.");
      const sourceScenes = current.scenesJson.map(parseStoredScene);
      const candidate: ProjectHandoutAssetCandidate = {
        mediaType: file.type,
        bytes: [...new Uint8Array(await file.arrayBuffer())],
        label: file.name.trim().slice(0, 100) || "Imported handout",
        provenance: "user-import",
      };
      const observedAt = new Date().toISOString();
      const preview = await createProjectHandoutAssetRegistrationPreview({
        projectId: activeProjectId,
        currentGeneration: current.receipt.generation,
        currentContentSha256: current.receipt.contentSha256,
        candidate,
        proposedSceneCount: sourceScenes.length,
        proposedActiveSceneId: current.activeSceneId,
        proposedAssetCount: current.assets.length + 1,
      });
      const batch = await createProjectHandoutAssetRegistrationProposalBatch({
        batchId: "dbx:proposal:desktop-project-handout-register-" + activeProjectId.replace(/[^a-z0-9._-]/gi, "-").toLowerCase() + "-" + Date.now(),
        preview,
        createdAt: observedAt,
      });
      const history = await previewProposalBatch(batch, desktopProposalRequester, observedAt);
      const session = await createDesktopProjectProposalSession({ projectId: batch.base.targetId, batch, history });
      setProjectRenamePreview(null);
      setProjectCreatePreview(null);
      setProjectSavePreview(null);
      setProjectSaveAsPreview(null);
      setProjectSaveAsContent(null);
      setProjectSaveContent(null);
      setProjectSaveInverseContent(null);
      setProjectHandoutPreview(preview);
      setProjectHandoutContent({ scenes: sourceScenes, activeSceneId: current.activeSceneId, candidate });
      setWorkspaceIndexGeneration(catalog.workspaceIndexGeneration);
      await persistProjectProposalSession(session);
    } catch (error) {
      setProjectHandoutPreview(null);
      setProjectHandoutContent(null);
      setProjectError(formatProjectStoreFailure(error));
    } finally {
      setProjectBusy(false);
    }
  }, [activeProjectId, nativeProjectStoreAvailable, persistProjectProposalSession, projectBusy, projectDirty, projectProposalSession]);

  const applySelectedProjectHandoutProposal = useCallback(async () => {
    if (!nativeProjectStoreAvailable || projectBusy || !projectProposalSession || projectProposalSession.history.status !== "approved") return;
    const command = projectProposalSession.batch.commands[0];
    if (!command || command.kind !== "project.asset.register-handout") {
      setProjectProposalSessionError("Apply requires the exact approved project.asset.register-handout proposal; no project state was changed.");
      return;
    }
    if (!projectHandoutPreview || !projectHandoutContent || projectHandoutPreview.projectId !== projectProposalSession.projectId) {
      setProjectProposalSessionError("Handout asset content is not bound to the approved preview; no project state was changed.");
      return;
    }
    setProjectBusy(true);
    setProjectError(null);
    setProjectProposalSessionError(null);
    try {
      const receipt = await executeApprovedProjectHandoutAssetRegistration({
        session: projectProposalSession,
        content: projectHandoutContent,
        inverseContent: projectHandoutContent,
        executor: desktopProposalReviewer,
      });
      const response = await loadProjectBundle(projectProposalSession.projectId);
      const catalog = await listProjectBundles();
      const inspection = await inspectProjectRecovery(projectProposalSession.projectId);
      const scenes = response.scenesJson.map(parseStoredScene);
      const active = scenes.find((scene) => scene.id === response.activeSceneId);
      const handout = response.assets.find((asset) => asset.registration?.assetId === receipt.asset.assetId);
      const inspectedHandout = inspection.registeredAssets.find((asset) => asset.assetId === receipt.asset.assetId);
      const handoutBoundAsBackground = scenes.some((scene) => scene.background.assetId === receipt.asset.assetId);
      const catalogEntry = catalog.entries.find((entry) => entry.projectId === projectProposalSession.projectId);
      if (
        receipt.status !== "PASS"
        || receipt.history.status !== "undone"
        || receipt.history.receipts.length !== 5
        || receipt.projectContentWrite !== true
        || receipt.assetBytesPersisted !== true
        || receipt.assetTreePreserved !== true
        || receipt.sceneContentRestored !== true
        || receipt.noFoundryWrite !== true
        || response.receipt.projectId !== projectProposalSession.projectId
        || response.receipt.generation !== receipt.afterUndo.generation
        || response.receipt.contentSha256 !== receipt.afterUndo.contentSha256
        || response.receipt.sceneCount !== receipt.afterUndo.sceneCount
        || response.receipt.assetCount !== receipt.afterUndo.assetCount
        || response.activeSceneId !== receipt.afterUndo.activeSceneId
        || !active
        || !handout
        || handout.registration?.role !== "handout"
        || inspectedHandout?.role !== "handout"
        || inspectedHandout?.disposition !== "PRESENT_VALID"
        || inspection.noWrite !== true
        || inspection.noFoundryWrite !== true
        || handoutBoundAsBackground
        || !catalogEntry
        || catalogEntry.status !== "PASS"
        || catalogEntry.generation !== response.receipt.generation
        || catalogEntry.contentSha256 !== response.receipt.contentSha256
      ) throw new Error("Handout registration committed, but authoritative rereads did not prove additive asset preservation, restored Scene content, or non-scene role semantics.");
      const committedSession = await createDesktopProjectProposalSession({
        projectId: projectProposalSession.projectId,
        batch: projectProposalSession.batch,
        history: receipt.history,
      });
      await persistProjectProposalSession(committedSession);
      dispatch({ kind: "replace", document: active });
      setProjectScenes(scenes);
      setProjectPersistedSceneJson(scenes.map(serializeSceneDocument));
      setActiveSceneId(response.activeSceneId);
      setProjectGeneration(response.receipt.generation);
      setHandoutAssetId(receipt.asset.assetId);
      setProjectSaveReceipt(receipt.inverseRestore);
      setProjectCloseNotice(null);
      setProjectLoadResponse(response);
      setFoundryPreview(null);
      setProjectHandoutPreview(null);
      setProjectHandoutContent(null);
      if (response.workspaceMetadata) setWorkspaceIndexGeneration(response.workspaceMetadata.indexGeneration);
      setWorkspaceMetadataWarning(response.workspaceMetadataWarning ?? null);
      if (response.workspaceMetadataWarning) setProjectError("Workspace metadata warning: " + response.workspaceMetadataWarning + "; project content remains readable.");
      await refreshProjectCatalog();
    } catch (error) {
      const candidate = error as Partial<{ session: DesktopProjectProposalSession | null }>;
      if (candidate.session) {
        try {
          await persistProjectProposalSession(candidate.session);
        } catch (persistError) {
          setProjectProposalSessionError("Handout registration outcome is unknown and its recovery session could not be persisted: " + (persistError instanceof Error ? persistError.message : String(persistError)));
        }
      }
      setProjectProposalSessionError(formatProjectStoreFailure(error));
    } finally {
      setProjectBusy(false);
    }
  }, [loadProjectBundle, nativeProjectStoreAvailable, persistProjectProposalSession, projectBusy, projectHandoutContent, projectHandoutPreview, projectProposalSession, refreshProjectCatalog]);

  const importProjectAudio = useCallback(async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file || !activeProjectId || projectBusy || !nativeProjectStoreAvailable) return;
    if (file.type !== "audio/wav") {
      setProjectError("Audio import accepts only WAV files reported as audio/wav.");
      return;
    }
    if (projectDirty) {
      setProjectError("Audio import requires a clean active project so the exact persisted Scene state remains preserved; save the active project first.");
      return;
    }
    const terminalStatuses = ["rejected", "cancelled", "stale", "committed", "recovered", "undone", "redone"];
    if (projectProposalSession && !terminalStatuses.includes(projectProposalSession.history.status)) {
      setProjectProposalSessionError("Resolve the current " + projectProposalSession.history.status + " project proposal before previewing an audio asset.");
      return;
    }
    setProjectBusy(true);
    setProjectError(null);
    setProjectProposalSessionError(null);
    try {
      const catalog = await listProjectBundles();
      const catalogEntry = catalog.entries.find((entry) => entry.projectId === activeProjectId);
      if ((catalog.status !== "PASS" && catalog.status !== "PARTIAL") || catalog.noWrite !== true || catalog.noFoundryWrite !== true || !catalogEntry || catalogEntry.status !== "PASS" || catalogEntry.generation === null || catalogEntry.contentSha256 === null) throw new Error("Audio registration requires one exact no-write healthy active project catalog entry before preview; no project state was changed.");
      const current = await loadProjectBundle(activeProjectId);
      const inspection = await inspectProjectRecovery(activeProjectId);
      if (current.receipt.projectId !== activeProjectId || current.receipt.status !== "PASS" || current.receipt.noFoundryWrite !== true || current.receipt.generation !== catalogEntry.generation || current.receipt.contentSha256 !== catalogEntry.contentSha256 || current.receipt.assetCount !== current.assets.length || inspection.noWrite !== true || inspection.noFoundryWrite !== true) throw new Error("Audio registration catalog, project, and recovery rereads disagree on the active target; no project state was changed.");
      const sourceScenes = current.scenesJson.map(parseStoredScene);
      const candidate: ProjectAudioAssetCandidate = { mediaType: "audio/wav", bytes: [...new Uint8Array(await file.arrayBuffer())], label: file.name.trim().slice(0, 100) || "Imported audio", provenance: "user-import" };
      const observedAt = new Date().toISOString();
      const preview = await createProjectAudioAssetRegistrationPreview({ projectId: activeProjectId, currentGeneration: current.receipt.generation, currentContentSha256: current.receipt.contentSha256, candidate, proposedSceneCount: sourceScenes.length, proposedActiveSceneId: current.activeSceneId, proposedAssetCount: current.assets.length + 1 });
      const batch = await createProjectAudioAssetRegistrationProposalBatch({ batchId: "dbx:proposal:desktop-project-audio-register-" + activeProjectId.replace(/[^a-z0-9._-]/gi, "-").toLowerCase() + "-" + Date.now(), preview, createdAt: observedAt });
      const history = await previewProposalBatch(batch, desktopProposalRequester, observedAt);
      const session = await createDesktopProjectProposalSession({ projectId: batch.base.targetId, batch, history });
      setProjectRenamePreview(null); setProjectCreatePreview(null); setProjectSavePreview(null); setProjectSaveAsPreview(null); setProjectSaveAsContent(null); setProjectSaveContent(null); setProjectSaveInverseContent(null); setProjectHandoutPreview(null); setProjectHandoutContent(null); setProjectBackgroundPreview(null); setProjectBackgroundContent(null);
      setProjectAudioPreview(preview);
      setProjectAudioContent({ scenes: sourceScenes, activeSceneId: current.activeSceneId, candidate });
      setWorkspaceIndexGeneration(catalog.workspaceIndexGeneration);
      await persistProjectProposalSession(session);
    } catch (error) {
      setProjectAudioPreview(null);
      setProjectAudioContent(null);
      setProjectError(formatProjectStoreFailure(error));
    } finally {
      setProjectBusy(false);
    }
  }, [activeProjectId, nativeProjectStoreAvailable, persistProjectProposalSession, projectBusy, projectDirty, projectProposalSession]);

  const applySelectedProjectAudioProposal = useCallback(async () => {
    if (!nativeProjectStoreAvailable || projectBusy || !projectProposalSession || projectProposalSession.history.status !== "approved") return;
    const command = projectProposalSession.batch.commands[0];
    if (!command || command.kind !== "project.asset.register-audio") { setProjectProposalSessionError("Apply requires the exact approved project.asset.register-audio proposal; no project state was changed."); return; }
    if (!projectAudioPreview || !projectAudioContent || projectAudioPreview.projectId !== projectProposalSession.projectId) { setProjectProposalSessionError("Audio asset content is not bound to the approved preview; no project state was changed."); return; }
    setProjectBusy(true); setProjectError(null); setProjectProposalSessionError(null);
    try {
      const receipt = await executeApprovedProjectAudioAssetRegistration({ session: projectProposalSession, content: projectAudioContent, inverseContent: projectAudioContent, executor: desktopProposalReviewer });
      const response = await loadProjectBundle(projectProposalSession.projectId);
      const catalog = await listProjectBundles();
      const inspection = await inspectProjectRecovery(projectProposalSession.projectId);
      const scenes = response.scenesJson.map(parseStoredScene);
      const active = scenes.find((scene) => scene.id === response.activeSceneId);
      const audio = response.assets.find((asset) => asset.registration?.assetId === receipt.asset.assetId);
      const inspectedAudio = inspection.registeredAssets.find((asset) => asset.assetId === receipt.asset.assetId);
      const catalogEntry = catalog.entries.find((entry) => entry.projectId === projectProposalSession.projectId);
      if (receipt.status !== "PASS" || receipt.history.status !== "undone" || receipt.history.receipts.length !== 5 || receipt.projectContentWrite !== true || receipt.assetBytesPersisted !== true || receipt.assetTreePreserved !== true || receipt.sceneContentRestored !== true || receipt.noFoundryWrite !== true || response.receipt.projectId !== projectProposalSession.projectId || response.receipt.generation !== receipt.afterUndo.generation || response.receipt.contentSha256 !== receipt.afterUndo.contentSha256 || response.receipt.sceneCount !== receipt.afterUndo.sceneCount || response.receipt.assetCount !== receipt.afterUndo.assetCount || response.activeSceneId !== receipt.afterUndo.activeSceneId || !active || !audio || audio.registration?.role !== "audio" || inspectedAudio?.role !== "audio" || inspectedAudio?.disposition !== "PRESENT_VALID" || inspection.noWrite !== true || inspection.noFoundryWrite !== true || !catalogEntry || catalogEntry.status !== "PASS" || catalogEntry.generation !== response.receipt.generation || catalogEntry.contentSha256 !== response.receipt.contentSha256) throw new Error("Audio registration committed, but authoritative rereads did not prove additive asset preservation, restored Scene content, or non-scene role semantics.");
      const committedSession = await createDesktopProjectProposalSession({ projectId: projectProposalSession.projectId, batch: projectProposalSession.batch, history: receipt.history });
      await persistProjectProposalSession(committedSession);
      dispatch({ kind: "replace", document: active }); setProjectScenes(scenes); setProjectPersistedSceneJson(scenes.map(serializeSceneDocument)); setActiveSceneId(response.activeSceneId); setProjectGeneration(response.receipt.generation); setAudioAssetId(receipt.asset.assetId); setProjectSaveReceipt(receipt.inverseRestore); setProjectCloseNotice(null); setProjectLoadResponse(response); setFoundryPreview(null); setProjectAudioPreview(null); setProjectAudioContent(null);
      if (response.workspaceMetadata) setWorkspaceIndexGeneration(response.workspaceMetadata.indexGeneration);
      setWorkspaceMetadataWarning(response.workspaceMetadataWarning ?? null);
      if (response.workspaceMetadataWarning) setProjectError("Workspace metadata warning: " + response.workspaceMetadataWarning + "; project content remains readable.");
      await refreshProjectCatalog();
    } catch (error) {
      const candidate = error as Partial<{ session: DesktopProjectProposalSession | null }>;
      if (candidate.session) { try { await persistProjectProposalSession(candidate.session); } catch (persistError) { setProjectProposalSessionError("Audio registration outcome is unknown and its recovery session could not be persisted: " + (persistError instanceof Error ? persistError.message : String(persistError))); } }
      setProjectProposalSessionError(formatProjectStoreFailure(error));
    } finally { setProjectBusy(false); }
  }, [nativeProjectStoreAvailable, persistProjectProposalSession, projectAudioContent, projectAudioPreview, projectBusy, projectProposalSession, refreshProjectCatalog]);

  const importProjectToken = useCallback(async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file || !activeProjectId || projectBusy || !nativeProjectStoreAvailable) return;
    if (file.type !== "image/png" && file.type !== "image/webp") {
      setProjectError("Token import accepts only PNG or WebP images.");
      return;
    }
    if (projectDirty) {
      setProjectError("Token import requires a clean active project so the exact persisted Scene state remains preserved; save the active project first.");
      return;
    }
    const terminalStatuses = ["rejected", "cancelled", "stale", "committed", "recovered", "undone", "redone"];
    if (projectProposalSession && !terminalStatuses.includes(projectProposalSession.history.status)) {
      setProjectProposalSessionError("Resolve the current " + projectProposalSession.history.status + " project proposal before previewing a token asset.");
      return;
    }
    setProjectBusy(true); setProjectError(null); setProjectProposalSessionError(null);
    try {
      const catalog = await listProjectBundles();
      const catalogEntry = catalog.entries.find((entry) => entry.projectId === activeProjectId);
      if ((catalog.status !== "PASS" && catalog.status !== "PARTIAL") || catalog.noWrite !== true || catalog.noFoundryWrite !== true || !catalogEntry || catalogEntry.status !== "PASS" || catalogEntry.generation === null || catalogEntry.contentSha256 === null) throw new Error("Token registration requires one exact no-write healthy active project catalog entry before preview; no project state was changed.");
      const current = await loadProjectBundle(activeProjectId);
      const inspection = await inspectProjectRecovery(activeProjectId);
      if (current.receipt.projectId !== activeProjectId || current.receipt.status !== "PASS" || current.receipt.noFoundryWrite !== true || current.receipt.generation !== catalogEntry.generation || current.receipt.contentSha256 !== catalogEntry.contentSha256 || current.receipt.assetCount !== current.assets.length || inspection.noWrite !== true || inspection.noFoundryWrite !== true) throw new Error("Token registration catalog, project, and recovery rereads disagree on the active target; no project state was changed.");
      const sourceScenes = current.scenesJson.map(parseStoredScene);
      const candidate: ProjectTokenAssetCandidate = { mediaType: file.type as "image/png" | "image/webp", bytes: [...new Uint8Array(await file.arrayBuffer())], label: file.name.trim().slice(0, 100) || "Imported token", provenance: "user-import" };
      const observedAt = new Date().toISOString();
      const preview = await createProjectTokenAssetRegistrationPreview({ projectId: activeProjectId, currentGeneration: current.receipt.generation, currentContentSha256: current.receipt.contentSha256, candidate, proposedSceneCount: sourceScenes.length, proposedActiveSceneId: current.activeSceneId, proposedAssetCount: current.assets.length + 1 });
      const batch = await createProjectTokenAssetRegistrationProposalBatch({ batchId: "dbx:proposal:desktop-project-token-register-" + activeProjectId.replace(/[^a-z0-9._-]/gi, "-").toLowerCase() + "-" + Date.now(), preview, createdAt: observedAt });
      const history = await previewProposalBatch(batch, desktopProposalRequester, observedAt);
      const session = await createDesktopProjectProposalSession({ projectId: batch.base.targetId, batch, history });
      setProjectRenamePreview(null); setProjectCreatePreview(null); setProjectSavePreview(null); setProjectSaveAsPreview(null); setProjectSaveAsContent(null); setProjectSaveContent(null); setProjectSaveInverseContent(null); setProjectHandoutPreview(null); setProjectHandoutContent(null); setProjectBackgroundPreview(null); setProjectBackgroundContent(null); setProjectAudioPreview(null); setProjectAudioContent(null);
      setProjectTokenPreview(preview); setProjectTokenContent({ scenes: sourceScenes, activeSceneId: current.activeSceneId, candidate }); setWorkspaceIndexGeneration(catalog.workspaceIndexGeneration);
      await persistProjectProposalSession(session);
    } catch (error) {
      setProjectTokenPreview(null); setProjectTokenContent(null);
      setProjectError(formatProjectStoreFailure(error));
    } finally {
      setProjectBusy(false);
    }
  }, [activeProjectId, nativeProjectStoreAvailable, persistProjectProposalSession, projectBusy, projectDirty, projectProposalSession]);

  const applySelectedProjectTokenProposal = useCallback(async () => {
    if (!nativeProjectStoreAvailable || projectBusy || !projectProposalSession || projectProposalSession.history.status !== "approved") return;
    const command = projectProposalSession.batch.commands[0];
    if (!command || command.kind !== "project.asset.register-token") { setProjectProposalSessionError("Apply requires the exact approved project.asset.register-token proposal; no project state was changed."); return; }
    if (!projectTokenPreview || !projectTokenContent || projectTokenPreview.projectId !== projectProposalSession.projectId) { setProjectProposalSessionError("Token asset content is not bound to the approved preview; no project state was changed."); return; }
    setProjectBusy(true); setProjectError(null); setProjectProposalSessionError(null);
    try {
      const receipt = await executeApprovedProjectTokenAssetRegistration({ session: projectProposalSession, content: projectTokenContent, inverseContent: projectTokenContent, executor: desktopProposalReviewer });
      const response = await loadProjectBundle(projectProposalSession.projectId); const catalog = await listProjectBundles(); const inspection = await inspectProjectRecovery(projectProposalSession.projectId);
      const scenes = response.scenesJson.map(parseStoredScene); const active = scenes.find((scene) => scene.id === response.activeSceneId); const token = response.assets.find((asset) => asset.registration?.assetId === receipt.asset.assetId); const inspectedToken = inspection.registeredAssets.find((asset) => asset.assetId === receipt.asset.assetId); const catalogEntry = catalog.entries.find((entry) => entry.projectId === projectProposalSession.projectId);
      if (receipt.status !== "PASS" || receipt.history.status !== "undone" || receipt.history.receipts.length !== 5 || receipt.projectContentWrite !== true || receipt.assetBytesPersisted !== true || receipt.assetTreePreserved !== true || receipt.sceneContentRestored !== true || receipt.noFoundryWrite !== true || response.receipt.projectId !== projectProposalSession.projectId || response.receipt.generation !== receipt.afterUndo.generation || response.receipt.contentSha256 !== receipt.afterUndo.contentSha256 || response.receipt.sceneCount !== receipt.afterUndo.sceneCount || response.receipt.assetCount !== receipt.afterUndo.assetCount || response.activeSceneId !== receipt.afterUndo.activeSceneId || !active || !token || token.registration?.role !== "token" || inspectedToken?.role !== "token" || inspectedToken?.disposition !== "PRESENT_VALID" || inspection.noWrite !== true || inspection.noFoundryWrite !== true || !catalogEntry || catalogEntry.status !== "PASS" || catalogEntry.generation !== response.receipt.generation || catalogEntry.contentSha256 !== response.receipt.contentSha256) throw new Error("Token registration committed, but authoritative rereads did not prove additive asset preservation, restored Scene content, or non-scene role semantics.");
      const committedSession = await createDesktopProjectProposalSession({ projectId: projectProposalSession.projectId, batch: projectProposalSession.batch, history: receipt.history }); await persistProjectProposalSession(committedSession);
      dispatch({ kind: "replace", document: active }); setProjectScenes(scenes); setProjectPersistedSceneJson(scenes.map(serializeSceneDocument)); setActiveSceneId(response.activeSceneId); setProjectGeneration(response.receipt.generation); setTokenAssetId(receipt.asset.assetId); setProjectSaveReceipt(receipt.inverseRestore); setProjectCloseNotice(null); setProjectLoadResponse(response); setFoundryPreview(null); setProjectTokenPreview(null); setProjectTokenContent(null);
      if (response.workspaceMetadata) setWorkspaceIndexGeneration(response.workspaceMetadata.indexGeneration); setWorkspaceMetadataWarning(response.workspaceMetadataWarning ?? null); if (response.workspaceMetadataWarning) setProjectError("Workspace metadata warning: " + response.workspaceMetadataWarning + "; project content remains readable."); await refreshProjectCatalog();
    } catch (error) {
      const candidate = error as Partial<{ session: DesktopProjectProposalSession | null }>;
      if (candidate.session) { try { await persistProjectProposalSession(candidate.session); } catch (persistError) { setProjectProposalSessionError("Token registration outcome is unknown and its recovery session could not be persisted: " + (persistError instanceof Error ? persistError.message : String(persistError))); } }
      setProjectProposalSessionError(formatProjectStoreFailure(error));
    } finally { setProjectBusy(false); }
  }, [nativeProjectStoreAvailable, persistProjectProposalSession, projectBusy, projectProposalSession, projectTokenContent, projectTokenPreview, refreshProjectCatalog]);

  useEffect(() => {
    setDirectorPersistenceReady(false);
    directorPersistenceProjectRef.current = null;
    const loaded = loadDesktopCampaignDirectorConversation(browserCampaignDirectorConversationStorage(), directorProjectId);
    if (loaded.status === "BLOCKED") {
      commitDirectorConversation(createCampaignDirectorConversation({
        conversationId: DESKTOP_CAMPAIGN_DIRECTOR_CONVERSATION_ID,
        projectId: directorProjectId,
      }));
      setDirectorPersistenceStatus(`BLOCKED: ${loaded.reason}`);
      setDirectorError(loaded.reason);
      return;
    }
    commitDirectorConversation(loaded.conversation);
    directorTurnSequence.current = loaded.conversation.revision;
    directorPersistenceProjectRef.current = directorProjectId;
    setDirectorPersistenceReady(true);
    setDirectorPersistenceStatus(loaded.status === "PASS"
      ? `Persistent conversation loaded at revision ${loaded.conversation.revision}; no project-content write.`
      : "New project-bound conversation ready; no project-content write.");
  }, [commitDirectorConversation, directorProjectId]);

  useEffect(() => {
    if (!directorPersistenceReady || directorPersistenceProjectRef.current !== directorProjectId || directorConversation.projectId !== directorProjectId) return;
    try {
      const receipt = saveDesktopCampaignDirectorConversation(browserCampaignDirectorConversationStorage(), directorProjectId, directorConversation);
      setDirectorPersistenceStatus(`Persistent conversation revision ${receipt.revision}; no project-content write.`);
    } catch (error) {
      const reason = error instanceof Error ? error.message : String(error);
      directorPersistenceProjectRef.current = null;
      setDirectorPersistenceReady(false);
      setDirectorPersistenceStatus(`BLOCKED: ${reason}`);
      setDirectorError(reason);
    }
  }, [directorConversation, directorPersistenceReady, directorProjectId]);

  useEffect(() => {
    if (import.meta.env.VITE_DBX_GEOMETRY_SELF_TEST !== "1" || geometrySelfTestStarted.current) return;
    if (!nativeGeometryAvailable) {
      globalThis.document.title = "DiceBox Geometry Self-Test BLOCKED · native IPC unavailable";
      return;
    }
    globalThis.document.title = "DiceBox Geometry Self-Test RUNNING";
    geometrySelfTestStarted.current = true;
    void commitNativeGeometry();
  }, [commitNativeGeometry, nativeGeometryAvailable]);

  useEffect(() => {
    if (import.meta.env.VITE_DBX_GEOMETRY_SELF_TEST !== "1" || !geometryReceipt || geometrySelfTestUndoStarted.current) return;
    if (document.revision !== geometryReceipt.afterRevision) return;
    geometrySelfTestUndoStarted.current = true;
    dispatch({ kind: "undo" });
  }, [document.revision, geometryReceipt]);

  useEffect(() => {
    if (import.meta.env.VITE_DBX_GEOMETRY_SELF_TEST !== "1" || !geometryReceipt || !geometrySelfTestUndoStarted.current || geometrySelfTestRereadStarted.current) return;
    if (document.revision !== geometryReceipt.afterRevision + 1 || !selected || selected.x !== geometryReceipt.patches[0]?.before.x) return;
    geometrySelfTestRereadStarted.current = true;
    commandSequence.current += 1;
    void commitGeometryBatch(createStressTranslateBatch(document, selected.id, 8, 0, commandSequence.current))
      .then(setGeometrySelfTestReread)
      .catch((error: unknown) => setGeometryError(error instanceof Error ? error.message : String(error)));
  }, [document, geometryReceipt, selected]);

  useEffect(() => {
    if (import.meta.env.VITE_DBX_GEOMETRY_SELF_TEST !== "1") return;
    if (geometryError) globalThis.document.title = `DiceBox Geometry Self-Test BLOCKED · ${geometryError}`;
    else if (geometrySelfTestReread && document.revision === geometrySelfTestReread.beforeRevision) {
      globalThis.document.title = `DiceBox Geometry Self-Test PASS · ${geometrySelfTestReread.stats.entityCount} indexed · commit and undo reread · revision ${document.revision}`;
    }
  }, [document.revision, geometryError, geometrySelfTestReread]);

  useEffect(() => {
    const mode = import.meta.env.VITE_DBX_PROJECT_SELF_TEST;
    if (mode !== "backup-promotion-ui-session-status-inspect" || backupPromotionUiSessionStatusInspectionFinished.current) return;
    backupPromotionUiSessionStatusInspectionFinished.current = true;
    const projectId = "dbx:project:desktop-backup-authoritative-recovery-promotion-self-test";
    void loadDesktopProjectProposalSession(browserDesktopProjectProposalSessionStorage(), projectId).then((loaded) => {
      if (loaded.status === "MISSING") {
        void recordProjectUiSelfTestProgress("pass", "backup-promotion-session-status:MISSING");
        globalThis.document.title = `DiceBox Backup Promotion Session Status PASS · ${projectId} · MISSING · no state changed`;
        if (import.meta.env.VITE_DBX_PROJECT_SELF_TEST_EXIT === "1") void finishProjectSelfTest("PASS");
        return;
      }
      if (loaded.status === "BLOCKED") throw new Error(`Exact proposal-session status inspection blocked: ${loaded.code}`);
      const inspection = inspectDesktopProjectProposalSession(loaded.session);
      const commandKind = loaded.session.batch.commands[0]?.kind;
      const commandIdentity = commandKind === "project.recovery.backup-promote"
        ? "repaired"
        : commandKind === "project.recovery.backup-promotion"
          ? "legacy"
          : null;
      if (inspection.projectId !== projectId || inspection.commandCount !== 1 || commandIdentity === null) {
        throw new Error("Exact proposal-session status inspection did not retain the expected project and command identity.");
      }
      const detail = `backup-promotion-session-status:${commandIdentity}:${inspection.status}:${commandKind}:receipts=${inspection.historyLength}`;
      void recordProjectUiSelfTestProgress("pass", detail);
      globalThis.document.title = `DiceBox Backup Promotion Session Status PASS · ${projectId} · ${commandIdentity} · ${inspection.status} · ${commandKind} · receipts ${inspection.historyLength} · no state changed`;
      if (import.meta.env.VITE_DBX_PROJECT_SELF_TEST_EXIT === "1") void finishProjectSelfTest("PASS");
    }).catch((error: unknown) => {
      const detail = formatProjectStoreFailure(error).slice(0, 512);
      void recordProjectUiSelfTestProgress("blocked", detail);
      globalThis.document.title = `DiceBox Backup Promotion Session Status BLOCKED · ${detail}`;
      if (import.meta.env.VITE_DBX_PROJECT_SELF_TEST_EXIT === "1") void finishProjectSelfTest("BLOCKED");
    });
  }, [backupPromotionUiSessionStatusInspectionFinished, finishProjectSelfTest]);

  useEffect(() => {
    const mode = import.meta.env.VITE_DBX_PROJECT_SELF_TEST;
    if (mode !== "backup-promotion-ui-session-inspect" || backupPromotionUiSessionInspectionFinished.current) return;
    backupPromotionUiSessionInspectionFinished.current = true;
    const projectId = "dbx:project:desktop-backup-authoritative-recovery-promotion-self-test";
    void loadDesktopProjectProposalSession(browserDesktopProjectProposalSessionStorage(), projectId).then((loaded) => {
      if (loaded.status !== "MISSING") throw new Error("Exact proposal-session inspector requires MISSING current key state; no state was changed.");
      globalThis.document.title = `DiceBox Backup Promotion Session Inspect PASS · ${projectId} · exact key reread MISSING · no state changed`;
      if (import.meta.env.VITE_DBX_PROJECT_SELF_TEST_EXIT === "1") void finishProjectSelfTest("PASS");
    }).catch((error: unknown) => {
      const detail = error instanceof Error ? error.message : String(error);
      globalThis.document.title = `DiceBox Backup Promotion Session Inspect BLOCKED · ${detail}`;
      if (import.meta.env.VITE_DBX_PROJECT_SELF_TEST_EXIT === "1") void finishProjectSelfTest("BLOCKED");
    });
  }, [backupPromotionUiSessionInspectionFinished, finishProjectSelfTest]);

  useEffect(() => {
    const mode = import.meta.env.VITE_DBX_PROJECT_SELF_TEST;
    if (mode !== "backup-promotion-ui-session-reset" || backupPromotionUiSessionResetFinished.current) return;
    const projectId = "dbx:project:desktop-backup-authoritative-recovery-promotion-self-test";
    const finish = (status: "PASS" | "BLOCKED", detail: string) => {
      if (backupPromotionUiSessionResetFinished.current) return;
      backupPromotionUiSessionResetFinished.current = true;
      void recordProjectUiSelfTestProgress(status === "PASS" ? "pass" : "blocked", detail.slice(0, 512));
      globalThis.document.title = `DiceBox Backup Promotion Session Reset ${status} · ${detail}`;
      if (import.meta.env.VITE_DBX_PROJECT_SELF_TEST_EXIT === "1") void finishProjectSelfTest(status);
    };
    if (projectProposalSessionError) {
      finish("BLOCKED", projectProposalSessionError);
      return;
    }
    if (projectBusy) return;
    if (projectProposalSession === null) {
      if (backupPromotionUiSessionResetStage.current === "cleared") {
        backupPromotionUiSessionResetStage.current = "verifying";
        void recordProjectUiSelfTestProgress("applied", "backup-promotion-session-reset-reread");
        void loadDesktopProjectProposalSession(browserDesktopProjectProposalSessionStorage(), projectId).then((loaded) => {
          if (loaded.status !== "MISSING") throw new Error("Exact terminal-cleared session must reread as MISSING before PASS; no state was changed.");
          finish("PASS", "exact previewed session was cancelled then terminal-cleared and reread MISSING; no recovery apply");
        }).catch((error: unknown) => finish("BLOCKED", error instanceof Error ? error.message : String(error)));
        return;
      }
      if (backupPromotionUiSessionResetStage.current !== "idle") return;
      backupPromotionUiSessionResetStage.current = "loading";
      void recordProjectUiSelfTestProgress("loaded", "backup-promotion-session-reset-load");
      void loadDesktopProjectProposalSession(browserDesktopProjectProposalSessionStorage(), projectId).then((loaded) => {
        if (loaded.status !== "PASS" || !loaded.session || loaded.session.projectId !== projectId || loaded.session.history.status !== "previewed") throw new Error("Exact previewed test-owned recovery session is required; no state was changed.");
        backupPromotionUiSessionResetStage.current = "cancelling";
        setSelectedProjectId(projectId);
        setProjectProposalSession(loaded.session);
      }).catch((error: unknown) => finish("BLOCKED", error instanceof Error ? error.message : String(error)));
      return;
    }
    if (projectProposalSession.projectId !== projectId) {
      finish("BLOCKED", "project proposal session target does not match exact reset target");
      return;
    }
    if (backupPromotionUiSessionResetStage.current === "idle" && projectProposalSession.history.status === "previewed") {
      backupPromotionUiSessionResetStage.current = "cancelling";
    }
    if (backupPromotionUiSessionResetStage.current === "cancelling" && projectProposalSession.history.status === "previewed") {
      backupPromotionUiSessionResetStage.current = "clearing";
      void recordProjectUiSelfTestProgress("previewed", "backup-promotion-session-reset-cancel");
      void cancelSelectedProjectProposal();
      return;
    }
    if (backupPromotionUiSessionResetStage.current === "clearing" && projectProposalSession.history.status === "cancelled") {
      backupPromotionUiSessionResetStage.current = "cleared";
      void recordProjectUiSelfTestProgress("applied", "backup-promotion-session-reset-clear");
      void clearSelectedTerminalProjectProposal();
      return;
    }
    finish("BLOCKED", `unexpected session-reset stage/status ${backupPromotionUiSessionResetStage.current}/${projectProposalSession.history.status}`);
  }, [backupPromotionUiSessionResetFinished, backupPromotionUiSessionResetStage, cancelSelectedProjectProposal, clearSelectedTerminalProjectProposal, finishProjectSelfTest, projectBusy, projectProposalSession, projectProposalSessionError]);

  useEffect(() => {
    const mode = import.meta.env.VITE_DBX_PROJECT_SELF_TEST;
    if (mode !== "create-ui-execute" || projectCreateUiSelfTestFinished.current) return;
    const targetInput = import.meta.env.VITE_DBX_PROJECT_SELF_TEST_NAME ?? "Desktop UI Create M357 Self Test v2";
    const targetProjectId = projectIdFromInput(targetInput);
    if (!nativeProjectStoreAvailable) {
      globalThis.document.title = `DiceBox Project Create UI Self-Test BLOCKED · ${targetProjectId} requires native project-store IPC`;
      return;
    }
    if (projectProposalSessionError) {
      globalThis.document.title = `DiceBox Project Create UI Self-Test BLOCKED · ${projectProposalSessionError}`;
      return;
    }
    if (projectCreateUiSelfTestStage.current === "idle") {
      projectCreateUiSelfTestStage.current = "previewed";
      setProjectNameInput(targetInput);
      void previewCreateNewProject(targetInput);
      return;
    }
    if (projectCreateUiSelfTestStage.current === "previewed" && projectProposalSession?.history.status === "previewed" && projectProposalSession.batch.commands[0]?.kind === "project.create") {
      projectCreateUiSelfTestStage.current = "approved";
      void approveSelectedProjectProposal();
      return;
    }
    if (projectCreateUiSelfTestStage.current === "approved" && projectProposalSession?.history.status === "approved" && projectProposalSession.batch.commands[0]?.kind === "project.create") {
      projectCreateUiSelfTestStage.current = "applied";
      void applySelectedProjectCreateProposal();
      return;
    }
    if (projectCreateUiSelfTestStage.current === "applied" && projectProposalSession?.history.status === "committed" && activeProjectId === targetProjectId) {
      projectCreateUiSelfTestFinished.current = true;
      globalThis.document.title = `DiceBox Project Create UI Execute PASS · ${targetProjectId} · preview→approval→apply→reread · generation ${projectGeneration} · history ${projectProposalSession.history.receipts.length} · no Foundry write`;
      if (import.meta.env.VITE_DBX_PROJECT_SELF_TEST_EXIT === "1") void finishProjectSelfTest("PASS");
    }
  }, [activeProjectId, approveSelectedProjectProposal, applySelectedProjectCreateProposal, nativeProjectStoreAvailable, previewCreateNewProject, projectGeneration, projectProposalSession, projectProposalSessionError]);

  useEffect(() => {
    const mode = import.meta.env.VITE_DBX_PROJECT_SELF_TEST;
    if (mode !== "save-ui-execute" || projectSaveUiSelfTestFinished.current) return;
    const projectId = import.meta.env.VITE_DBX_PROJECT_SELF_TEST_ID ?? DESKTOP_PROJECT_SAVE_UI_SELF_TEST_PROJECT_ID;
    if (projectId !== DESKTOP_PROJECT_SAVE_UI_SELF_TEST_PROJECT_ID) {
      globalThis.document.title = "DiceBox Project Save UI Self-Test BLOCKED · save-ui-execute requires its exact fixed test-owned project identity";
      return;
    }
    projectProposalSessionPersistenceScope.current = DESKTOP_PROJECT_SAVE_UI_SELF_TEST_SCOPE;
    if (!nativeProjectStoreAvailable) {
      globalThis.document.title = "DiceBox Project Save UI Self-Test BLOCKED · " + projectId + " requires native project-store IPC";
      return;
    }
    if (projectProposalSessionError) {
      globalThis.document.title = "DiceBox Project Save UI Self-Test BLOCKED · " + projectProposalSessionError;
      return;
    }
    if (projectSaveUiSelfTestStage.current === "idle") {
      projectSaveUiSelfTestStage.current = "loaded";
      void (async () => {
        const existing = await loadDesktopProjectSaveUiSelfTestProposalSession(browserDesktopProjectProposalSessionStorage());
        if (existing.status === "BLOCKED") throw new Error(existing.reason);
        if (existing.status === "PASS") {
          if (!["rejected", "cancelled", "stale", "committed", "recovered", "undone", "redone"].includes(existing.session.history.status)) {
            throw new Error("Project save UI self-test found a nonterminal isolated session; it will not overwrite or clear it.");
          }
          await clearTerminalDesktopProjectSaveUiSelfTestProposalSession(browserDesktopProjectProposalSessionStorage());
        }
        await loadSavedProject(projectId);
      })().catch((error: unknown) => setProjectProposalSessionError(error instanceof Error ? error.message : String(error)));
      return;
    }
    if (projectSaveUiSelfTestStage.current === "loaded" && activeProjectId === projectId && projectGeneration > 0 && !projectDirty) {
      projectSaveUiSelfTestStage.current = "edited";
      dispatch({ kind: "replace", document: { ...document, name: document.name + " M359 UI Save Probe" } });
      return;
    }
    if (projectSaveUiSelfTestStage.current === "edited" && activeProjectId === projectId && projectDirty) {
      projectSaveUiSelfTestStage.current = "previewed";
      void previewSaveCurrentProject();
      return;
    }
    if (projectSaveUiSelfTestStage.current === "previewed" && projectProposalSession?.history.status === "previewed" && projectProposalSession.batch.commands[0]?.kind === "project.save") {
      projectSaveUiSelfTestStage.current = "approved";
      void approveSelectedProjectProposal();
      return;
    }
    if (projectSaveUiSelfTestStage.current === "approved" && projectProposalSession?.history.status === "approved" && projectProposalSession.batch.commands[0]?.kind === "project.save") {
      projectSaveUiSelfTestStage.current = "applied";
      void applySelectedProjectSaveProposal();
      return;
    }
    if (projectSaveUiSelfTestStage.current === "applied" && projectProposalSession?.history.status === "undone" && activeProjectId === projectId && !projectDirty) {
      projectSaveUiSelfTestFinished.current = true;
      globalThis.document.title = "DiceBox Project Save UI Execute PASS · " + projectId + " · preview→approval→save→reread→inverse-restore · generation " + projectGeneration + " · history " + projectProposalSession.history.receipts.length + " · no Foundry write";
      if (import.meta.env.VITE_DBX_PROJECT_SELF_TEST_EXIT === "1") void finishProjectSelfTest("PASS");
    }
  }, [activeProjectId, approveSelectedProjectProposal, applySelectedProjectSaveProposal, document, loadSavedProject, nativeProjectStoreAvailable, previewSaveCurrentProject, projectDirty, projectGeneration, projectProposalSession, projectProposalSessionError]);

  useEffect(() => {
    const mode = import.meta.env.VITE_DBX_PROJECT_SELF_TEST;
    if (mode !== "rename-ui-execute" || projectRenameUiSelfTestFinished.current) return;
    const projectId = import.meta.env.VITE_DBX_PROJECT_SELF_TEST_ID ?? "dbx:project:desktop-directory-entry-durability-self-test";
    if (!nativeProjectStoreAvailable) {
      globalThis.document.title = "DiceBox Project Rename UI Self-Test BLOCKED · " + projectId + " requires native project-store IPC";
      return;
    }
    if (projectProposalSessionError) {
      globalThis.document.title = "DiceBox Project Rename UI Self-Test BLOCKED · " + projectProposalSessionError;
      return;
    }
    if (projectRenameUiSelfTestStage.current === "idle") {
      projectRenameUiSelfTestStage.current = "loaded";
      setProjectProposalSessionError(null);
      setProjectRenamePreview(null);
      void (async () => {
        const catalog = await refreshProjectCatalog();
        const entry = catalog.find((candidate) => candidate.projectId === projectId);
        if (!entry || entry.status !== "PASS" || entry.contentSha256 === null) {
          throw new Error("Project rename UI self-test requires the exact test-owned project to be present and healthy.");
        }
        const storage = browserDesktopProjectProposalSessionStorage();
        const existing = await loadDesktopProjectProposalSession(storage, projectId);
        if (existing.status === "BLOCKED") throw new Error(existing.reason);
        if (existing.status === "PASS") {
          const existingCommand = existing.session.batch.commands[0];
          const existingPayload = existingCommand?.payload;
          const knownRenameSelfTestResidue = existingCommand?.kind === "project.rename"
            && existingPayload !== null
            && typeof existingPayload === "object"
            && String((existingPayload as Record<string, unknown>).proposedDisplayName ?? "").endsWith(" M361 UI Rename Probe");
          const terminalStatuses = ["rejected", "cancelled", "stale", "committed", "recovered", "undone", "redone"];
          if (!terminalStatuses.includes(existing.session.history.status) && !knownRenameSelfTestResidue) {
            throw new Error("Project rename UI self-test found a nonterminal proposal session for the exact target; no state was overwritten.");
          }
          if (knownRenameSelfTestResidue && !terminalStatuses.includes(existing.session.history.status)) {
            const stale = await invalidateStaleDesktopProjectProposalSession(existing.session, desktopProposalReviewer, new Date().toISOString());
            await saveDesktopProjectProposalSession(storage, projectId, stale);
          }
          await clearTerminalDesktopProjectProposalSession(storage, projectId);
        }
        projectRenameUiSelfTestOriginalName.current = entry.displayName;
        projectRenameUiSelfTestProposedName.current = entry.displayName + " M361 UI Rename Probe";
        setSelectedProjectId(projectId);
        await loadSavedProject(projectId);
      })().catch((error: unknown) => {
        setProjectProposalSessionError(error instanceof Error ? error.message : String(error));
      });
      return;
    }
    if (
      projectRenameUiSelfTestStage.current === "loaded"
      && activeProjectId === projectId
      && projectGeneration > 0
      && !projectDirty
      && projectRenameUiSelfTestOriginalName.current !== null
      && projectRenameUiSelfTestProposedName.current !== null
    ) {
      projectRenameUiSelfTestStage.current = "named";
      setProjectNameInput(projectRenameUiSelfTestProposedName.current);
      return;
    }
    if (
      projectRenameUiSelfTestStage.current === "named"
      && activeProjectId === projectId
      && selectedProjectId === projectId
      && projectNameInput === projectRenameUiSelfTestProposedName.current
      && selectedCatalogEntry?.projectId === projectId
    ) {
      projectRenameUiSelfTestStage.current = "previewed";
      void previewSelectedProjectRenameProposal();
      return;
    }
    if (
      projectRenameUiSelfTestStage.current === "previewed"
      && projectProposalSession?.history.status === "previewed"
      && projectProposalSession.batch.commands[0]?.kind === "project.rename"
    ) {
      projectRenameUiSelfTestStage.current = "approved";
      void approveSelectedProjectProposal();
      return;
    }
    if (
      projectRenameUiSelfTestStage.current === "approved"
      && projectProposalSession?.history.status === "approved"
      && projectProposalSession.batch.commands[0]?.kind === "project.rename"
    ) {
      projectRenameUiSelfTestStage.current = "applied";
      void applySelectedProjectRenameProposal();
      return;
    }
    if (
      projectRenameUiSelfTestStage.current === "applied"
      && projectProposalSession?.history.status === "undone"
      && activeProjectId === projectId
      && selectedProjectId === projectId
      && !projectDirty
      && selectedCatalogEntry?.displayName === projectRenameUiSelfTestOriginalName.current
      && projectNameInput === projectRenameUiSelfTestOriginalName.current
    ) {
      projectRenameUiSelfTestFinished.current = true;
      globalThis.document.title = "DiceBox Project Rename UI Execute PASS · " + projectId + " · " + projectRenameUiSelfTestOriginalName.current + " → " + projectRenameUiSelfTestProposedName.current + " → " + projectRenameUiSelfTestOriginalName.current + " · content unchanged · workspace " + workspaceIndexGeneration + " · history " + projectProposalSession.history.receipts.length + " · no Foundry write";
      if (import.meta.env.VITE_DBX_PROJECT_SELF_TEST_EXIT === "1") void finishProjectSelfTest("PASS");
    }
  }, [activeProjectId, approveSelectedProjectProposal, applySelectedProjectRenameProposal, loadSavedProject, nativeProjectStoreAvailable, previewSelectedProjectRenameProposal, projectDirty, projectGeneration, projectNameInput, projectProposalSession, projectProposalSessionError, refreshProjectCatalog, selectedCatalogEntry, selectedProjectId, workspaceIndexGeneration]);

  useEffect(() => {
    const mode = import.meta.env.VITE_DBX_PROJECT_SELF_TEST;
    if (mode !== "save-as-ui-execute" || projectSaveAsUiSelfTestFinished.current) return;
    const sourceProjectId = import.meta.env.VITE_DBX_PROJECT_SELF_TEST_SOURCE_ID ?? "dbx:project:desktop-ui-save-as-m363-source-self-test-v1";
    const targetInput = import.meta.env.VITE_DBX_PROJECT_SELF_TEST_NAME ?? "Desktop UI Save-As M363 Target Self Test v1";
    const targetProjectId = projectIdFromInput(targetInput);
    const configuredTargetProjectId = import.meta.env.VITE_DBX_PROJECT_SELF_TEST_ID ?? targetProjectId;
    if (configuredTargetProjectId !== targetProjectId) {
      globalThis.document.title = "DiceBox Project Save-As UI Self-Test BLOCKED · configured target ID does not match target display-name identity";
      return;
    }
    if (!nativeProjectStoreAvailable) {
      globalThis.document.title = "DiceBox Project Save-As UI Self-Test BLOCKED · " + targetProjectId + " requires native project-store IPC";
      return;
    }
    if (projectProposalSessionError) {
      globalThis.document.title = "DiceBox Project Save-As UI Self-Test BLOCKED · " + projectProposalSessionError;
      return;
    }
    if (projectSaveAsUiSelfTestStage.current === "idle") {
      projectSaveAsUiSelfTestStage.current = "loaded";
      void (async () => {
        const catalog = await listProjectBundles();
        if (catalog.entries.some((entry) => entry.projectId === targetProjectId)) {
          throw new Error("Project save-as UI self-test requires a fresh absent target; it will not overwrite or clean up an existing project.");
        }
        const sourceEntry = catalog.entries.find((entry) => entry.projectId === sourceProjectId);
        if (!sourceEntry) {
          const first = createBlankProjectScene(sourceProjectId);
          const second = createBlankProjectScene(sourceProjectId, 2);
          const created = await createProjectBundle(sourceProjectId, [first, second], second.id, "M363 Save-As Source", catalog.workspaceIndexGeneration);
          if (created.generation !== 1 || created.sceneCount !== 2 || created.assetCount !== 0) throw new Error("Project save-as UI self-test did not create the exact source fixture.");
          const saved = await saveProjectBundle(sourceProjectId, [first, second], second.id, created.generation);
          if (saved.generation !== 2 || saved.sceneCount !== 2 || saved.assetCount !== 0) throw new Error("Project save-as UI self-test did not establish the exact generation-2 source fixture.");
        } else if (sourceEntry.status !== "PASS" || sourceEntry.generation !== 2 || sourceEntry.assetCount !== 0 || sourceEntry.sceneCount !== 2) {
          throw new Error("Project save-as UI self-test found an existing source outside its exact healthy generation-2 zero-asset two-Scene fixture; it will not overwrite it.");
        }
        const source = await loadProjectBundle(sourceProjectId);
        if (source.receipt.status !== "PASS" || source.receipt.generation !== 2 || source.assets.length !== 0 || source.scenesJson.length !== 2) {
          throw new Error("Project save-as UI self-test source reread is not the exact healthy zero-asset fixture.");
        }
        await loadSavedProject(sourceProjectId);
      })().catch((error: unknown) => {
        setProjectProposalSessionError(error instanceof Error ? error.message : String(error));
      });
      return;
    }
    if (projectSaveAsUiSelfTestStage.current === "loaded" && activeProjectId === sourceProjectId && projectGeneration > 0 && !projectDirty) {
      projectSaveAsUiSelfTestStage.current = "named";
      setProjectNameInput(targetInput);
      return;
    }
    if (projectSaveAsUiSelfTestStage.current === "named" && activeProjectId === sourceProjectId && projectNameInput === targetInput && !projectSaveAsPreview) {
      projectSaveAsUiSelfTestStage.current = "previewed";
      void previewSaveCurrentProjectAs();
      return;
    }
    if (projectSaveAsUiSelfTestStage.current === "previewed" && projectProposalSession?.history.status === "previewed" && projectProposalSession.batch.commands[0]?.kind === "project.save-as") {
      projectSaveAsUiSelfTestStage.current = "approved";
      void approveSelectedProjectProposal();
      return;
    }
    if (projectSaveAsUiSelfTestStage.current === "approved" && projectProposalSession?.history.status === "approved" && projectProposalSession.batch.commands[0]?.kind === "project.save-as") {
      projectSaveAsUiSelfTestStage.current = "applied";
      void applySelectedProjectSaveAsProposal();
      return;
    }
    if (projectSaveAsUiSelfTestStage.current === "applied" && projectProposalSession?.history.status === "committed" && activeProjectId === targetProjectId && selectedProjectId === targetProjectId && !projectDirty) {
      projectSaveAsUiSelfTestFinished.current = true;
      globalThis.document.title = "DiceBox Project Save-As UI Execute PASS · " + sourceProjectId + " → " + targetProjectId + " · source preserved · target generation " + projectGeneration + " · history " + projectProposalSession.history.receipts.length + " · no Foundry write";
      if (import.meta.env.VITE_DBX_PROJECT_SELF_TEST_EXIT === "1") void finishProjectSelfTest("PASS");
    }
  }, [activeProjectId, approveSelectedProjectProposal, applySelectedProjectSaveAsProposal, loadSavedProject, nativeProjectStoreAvailable, previewSaveCurrentProjectAs, projectDirty, projectGeneration, projectNameInput, projectProposalSession, projectProposalSessionError, projectSaveAsPreview, selectedProjectId]);

  useEffect(() => {
    const mode = import.meta.env.VITE_DBX_PROJECT_SELF_TEST;
    if (mode !== "save-as-assets-ui-execute" || projectSaveAsAssetUiSelfTestFinished.current) return;
    const sourceProjectId = import.meta.env.VITE_DBX_PROJECT_SELF_TEST_SOURCE_ID ?? "dbx:project:desktop-asset-save-as-m367-source-self-test-v1";
    const targetInput = import.meta.env.VITE_DBX_PROJECT_SELF_TEST_NAME ?? "Desktop Asset Save-As M367 Target Self Test v1";
    const targetProjectId = projectIdFromInput(targetInput);
    const configuredTargetProjectId = import.meta.env.VITE_DBX_PROJECT_SELF_TEST_ID ?? targetProjectId;
    if (configuredTargetProjectId !== targetProjectId) {
      globalThis.document.title = "DiceBox Asset Save-As UI Self-Test BLOCKED · configured target ID does not match target display-name identity";
      void recordProjectUiSelfTestProgress("blocked", "configured target ID does not match target display-name identity");
      return;
    }
    if (!sourceProjectId.startsWith("dbx:project:desktop-")) {
      globalThis.document.title = "DiceBox Asset Save-As UI Self-Test BLOCKED · source project ID is not explicitly test-owned";
      void recordProjectUiSelfTestProgress("blocked", "source project ID is not explicitly test-owned");
      return;
    }
    if (!nativeProjectStoreAvailable) {
      globalThis.document.title = "DiceBox Asset Save-As UI Self-Test BLOCKED · " + targetProjectId + " requires native project-store IPC";
      void recordProjectUiSelfTestProgress("blocked", "native project-store IPC unavailable");
      return;
    }
    if (projectProposalSessionError || projectError) {
      const reason = projectProposalSessionError ?? projectError;
      globalThis.document.title = "DiceBox Asset Save-As UI Self-Test BLOCKED · " + reason;
      void recordProjectUiSelfTestProgress("blocked", reason ?? "unknown project self-test blocker");
      if (import.meta.env.VITE_DBX_PROJECT_SELF_TEST_EXIT === "1") void finishProjectSelfTest("BLOCKED");
      return;
    }
    if (projectSaveAsAssetUiSelfTestStage.current === "idle") {
      projectSaveAsAssetUiSelfTestStage.current = "loaded";
      void recordProjectUiSelfTestProgress("loaded");
      void (async () => {
        const catalog = await listProjectBundles();
        if (catalog.entries.some((entry) => entry.projectId === targetProjectId)) {
          throw new Error("Asset-bearing save-as UI self-test requires a fresh absent target; it will not overwrite or clean up an existing project.");
        }
        const sourceEntry = catalog.entries.find((entry) => entry.projectId === sourceProjectId);
        if (!sourceEntry) {
          const first = createBlankProjectScene(sourceProjectId);
          const second = createBlankProjectScene(sourceProjectId, 2);
          const created = await createProjectBundle(sourceProjectId, [first, second], second.id, "M367 Asset Save-As Source", catalog.workspaceIndexGeneration);
          if (created.generation !== 1 || created.sceneCount !== 2 || created.assetCount !== 0) throw new Error("Asset-bearing save-as UI self-test did not create the exact source fixture.");
          const bytes = Uint8Array.from(FOUNDATION_SELF_TEST_PNG_BYTES);
          const digestBytes = new Uint8Array(await globalThis.crypto.subtle.digest("SHA-256", bytes));
          const assetSha256 = [...digestBytes].map((byte) => byte.toString(16).padStart(2, "0")).join("");
          const saved = await saveProjectBundle(sourceProjectId, [first, second], second.id, created.generation, [{
            mediaType: "image/png",
            bytes: [...bytes],
            registration: { assetId: "dbx:asset:sha256-" + assetSha256, role: "handout", label: "M367 source handout", provenance: "user-import", approval: "approved" },
          }]);
          if (saved.generation !== 2 || saved.sceneCount !== 2 || saved.assetCount !== 1) throw new Error("Asset-bearing save-as UI self-test did not establish the exact generation-2 source fixture.");
        } else if (sourceEntry.status !== "PASS" || sourceEntry.generation !== 2 || sourceEntry.assetCount !== 1 || sourceEntry.sceneCount !== 2) {
          throw new Error("Asset-bearing save-as UI self-test found an existing source outside its exact healthy generation-2 one-asset two-Scene fixture; it will not overwrite it.");
        }
        const source = await loadProjectBundle(sourceProjectId);
        if (source.receipt.status !== "PASS" || source.receipt.generation !== 2 || source.assets.length !== 1 || source.assets[0]?.registration?.role !== "handout" || source.scenesJson.length !== 2) {
          throw new Error("Asset-bearing save-as UI self-test source reread is not the exact healthy one-asset fixture.");
        }
        await loadSavedProject(sourceProjectId, true, catalog.workspaceIndexGeneration);
      })().catch((error: unknown) => {
        setProjectProposalSessionError(error instanceof Error ? error.message : String(error));
      });
      return;
    }
    if (projectSaveAsAssetUiSelfTestStage.current === "loaded" && activeProjectId === sourceProjectId && projectGeneration === 2 && !projectDirty) {
      projectSaveAsAssetUiSelfTestStage.current = "named";
      void recordProjectUiSelfTestProgress("named");
      setProjectNameInput(targetInput);
      return;
    }
    if (projectSaveAsAssetUiSelfTestStage.current === "named" && activeProjectId === sourceProjectId && projectNameInput === targetInput && !projectSaveAsPreview) {
      projectSaveAsAssetUiSelfTestStage.current = "previewed";
      void recordProjectUiSelfTestProgress("previewed");
      void previewSaveCurrentProjectAs();
      return;
    }
    if (projectSaveAsAssetUiSelfTestStage.current === "previewed" && projectProposalSession?.history.status === "previewed" && projectProposalSession.batch.commands[0]?.kind === "project.save-as") {
      projectSaveAsAssetUiSelfTestStage.current = "approved";
      void recordProjectUiSelfTestProgress("approved");
      void approveSelectedProjectProposal();
      return;
    }
    if (projectSaveAsAssetUiSelfTestStage.current === "approved" && projectProposalSession?.history.status === "approved" && projectProposalSession.batch.commands[0]?.kind === "project.save-as") {
      projectSaveAsAssetUiSelfTestStage.current = "applied";
      void recordProjectUiSelfTestProgress("applied");
      void applySelectedProjectSaveAsProposal();
      return;
    }
    if (projectSaveAsAssetUiSelfTestStage.current === "applied" && projectProposalSession?.history.status === "committed" && activeProjectId === targetProjectId && selectedProjectId === targetProjectId && !projectDirty && projectLoadResponse?.receipt.assetCount === 1 && handoutAssetId !== null) {
      projectSaveAsAssetUiSelfTestFinished.current = true;
      void recordProjectUiSelfTestProgress("pass");
      globalThis.document.title = "DiceBox Asset Save-As UI Execute PASS · " + sourceProjectId + " → " + targetProjectId + " · source and one-asset tree preserved · target generation " + projectGeneration + " · handout " + handoutAssetId + " · history " + projectProposalSession.history.receipts.length + " · no Foundry write";
      if (import.meta.env.VITE_DBX_PROJECT_SELF_TEST_EXIT === "1") void finishProjectSelfTest("PASS");
    }
  }, [activeProjectId, approveSelectedProjectProposal, applySelectedProjectSaveAsProposal, finishProjectSelfTest, handoutAssetId, loadSavedProject, nativeProjectStoreAvailable, previewSaveCurrentProjectAs, projectDirty, projectError, projectGeneration, projectNameInput, projectProposalSession, projectProposalSessionError, projectSaveAsAssetUiSelfTestFinished, projectSaveAsPreview, projectLoadResponse, selectedProjectId]);

  useEffect(() => {
    const mode = import.meta.env.VITE_DBX_PROJECT_SELF_TEST;
    if (mode !== "handout-ui-execute" || projectHandoutUiSelfTestFinished.current) return;
    const projectId = import.meta.env.VITE_DBX_PROJECT_SELF_TEST_ID ?? "dbx:project:desktop-handout-ui-m365-self-test";
    if (!projectId.startsWith("dbx:project:desktop-")) {
      globalThis.document.title = "DiceBox Project Handout UI Self-Test BLOCKED · project ID is not explicitly test-owned";
      return;
    }
    if (!nativeProjectStoreAvailable) {
      globalThis.document.title = "DiceBox Project Handout UI Self-Test BLOCKED · " + projectId + " requires native project-store IPC";
      return;
    }
    if (projectProposalSessionError || projectError) {
      const reason = projectProposalSessionError ?? projectError;
      globalThis.document.title = "DiceBox Project Handout UI Self-Test BLOCKED · " + reason;
      if (import.meta.env.VITE_DBX_PROJECT_SELF_TEST_EXIT === "1") void finishProjectSelfTest("BLOCKED");
      return;
    }
    if (projectHandoutUiSelfTestStage.current === "idle") {
      projectHandoutUiSelfTestStage.current = "loaded";
      void (async () => {
        const catalog = await listProjectBundles();
        let expectedWorkspaceGeneration = catalog.workspaceIndexGeneration;
        const entry = catalog.entries.find((candidate) => candidate.projectId === projectId);
        if (!entry) {
          const scene = createBlankProjectScene(projectId);
          const created = await createProjectBundle(projectId, [scene], scene.id, "M365 Handout UI Self Test", catalog.workspaceIndexGeneration);
          if (created.generation !== 1 || created.sceneCount !== 1 || created.assetCount !== 0) throw new Error("Project handout UI self-test did not create the exact zero-asset source fixture.");
          expectedWorkspaceGeneration = created.workspaceMetadata?.indexGeneration ?? catalog.workspaceIndexGeneration + 1;
        } else if (entry.status !== "PASS" || entry.generation !== 1 || entry.assetCount !== 0 || entry.sceneCount !== 1) {
          throw new Error("Project handout UI self-test found an existing target outside its exact healthy generation-1 zero-asset one-Scene fixture; it will not overwrite or clean it up.");
        }
        const storage = browserDesktopProjectProposalSessionStorage();
        const existing = await loadDesktopProjectProposalSession(storage, projectId);
        if (existing.status === "BLOCKED") throw new Error(existing.reason);
        if (existing.status === "PASS") {
          const terminalStatuses = ["rejected", "cancelled", "stale", "committed", "recovered", "undone", "redone"];
          if (!terminalStatuses.includes(existing.session.history.status)) throw new Error("Project handout UI self-test found a nonterminal proposal session for the exact target; it will not overwrite or clear it.");
          await clearTerminalDesktopProjectProposalSession(storage, projectId);
        }
        setSelectedProjectId(projectId);
        await loadSavedProject(projectId, true, expectedWorkspaceGeneration);
      })().catch((error: unknown) => {
        setProjectProposalSessionError(error instanceof Error ? error.message : String(error));
      });
      return;
    }
    if (projectHandoutUiSelfTestStage.current === "loaded" && activeProjectId === projectId && projectGeneration > 0 && !projectDirty) {
      projectHandoutUiSelfTestStage.current = "previewed";
      const bytes = Uint8Array.from(FOUNDATION_SELF_TEST_PNG_BYTES).buffer as ArrayBuffer;
      const syntheticFile = { type: "image/png", name: "M365 handout.png", arrayBuffer: async () => bytes } as File;
      const syntheticEvent = { target: { files: [syntheticFile], value: "" } } as unknown as ChangeEvent<HTMLInputElement>;
      void importProjectHandout(syntheticEvent);
      return;
    }
    if (projectHandoutUiSelfTestStage.current === "previewed" && projectProposalSession?.history.status === "previewed" && projectProposalSession.batch.commands[0]?.kind === "project.asset.register-handout") {
      projectHandoutUiSelfTestStage.current = "approved";
      void approveSelectedProjectProposal();
      return;
    }
    if (projectHandoutUiSelfTestStage.current === "approved" && projectProposalSession?.history.status === "approved" && projectProposalSession.batch.commands[0]?.kind === "project.asset.register-handout") {
      projectHandoutUiSelfTestStage.current = "applied";
      void applySelectedProjectHandoutProposal();
      return;
    }
    if (projectHandoutUiSelfTestStage.current === "applied" && projectProposalSession?.history.status === "undone" && activeProjectId === projectId && !projectDirty && handoutAssetId !== null && projectLoadResponse?.receipt.assetCount === 1) {
      projectHandoutUiSelfTestFinished.current = true;
      globalThis.document.title = "DiceBox Project Handout UI Execute PASS · " + projectId + " · preview→approval→registration→reread→inverse-restore · generation " + projectGeneration + " · handout " + handoutAssetId + " · history " + projectProposalSession.history.receipts.length + " · no Scene background binding · no Foundry write";
      if (import.meta.env.VITE_DBX_PROJECT_SELF_TEST_EXIT === "1") void finishProjectSelfTest("PASS");
    }
  }, [activeProjectId, approveSelectedProjectProposal, applySelectedProjectHandoutProposal, handoutAssetId, importProjectHandout, loadSavedProject, nativeProjectStoreAvailable, projectDirty, projectError, projectGeneration, projectLoadResponse, projectProposalSession, projectProposalSessionError]);

  useEffect(() => {
    const mode = import.meta.env.VITE_DBX_PROJECT_SELF_TEST;
    if (mode !== "background-ui-execute" || projectBackgroundUiSelfTestFinished.current) return;
    const projectId = import.meta.env.VITE_DBX_PROJECT_SELF_TEST_ID ?? "dbx:project:desktop-background-ui-m369-self-test-v2";
    if (!projectId.startsWith("dbx:project:desktop-")) {
      globalThis.document.title = "DiceBox Project Background UI Self-Test BLOCKED · project ID is not explicitly test-owned";
      return;
    }
    if (!nativeProjectStoreAvailable) {
      globalThis.document.title = "DiceBox Project Background UI Self-Test BLOCKED · " + projectId + " requires native project-store IPC";
      return;
    }
    if (projectProposalSessionError || projectError) {
      const reason = projectProposalSessionError ?? projectError;
      void recordProjectUiSelfTestProgress("blocked", reason ?? undefined);
      globalThis.document.title = "DiceBox Project Background UI Self-Test BLOCKED · " + reason;
      if (import.meta.env.VITE_DBX_PROJECT_SELF_TEST_EXIT === "1") void finishProjectSelfTest("BLOCKED");
      return;
    }
    if (projectBackgroundUiSelfTestStage.current === "idle") {
      projectBackgroundUiSelfTestStage.current = "loaded";
      void recordProjectUiSelfTestProgress("loaded");
      void (async () => {
        const catalog = await listProjectBundles();
        let expectedWorkspaceGeneration = catalog.workspaceIndexGeneration;
        const entry = catalog.entries.find((candidate) => candidate.projectId === projectId);
        if (!entry) {
          const scene = createBlankProjectScene(projectId);
          const created = await createProjectBundle(projectId, [scene], scene.id, "M369 Background UI Self Test", catalog.workspaceIndexGeneration);
          if (created.generation !== 1 || created.sceneCount !== 1 || created.assetCount !== 0) throw new Error("Project background UI self-test did not create the exact zero-asset source fixture.");
          expectedWorkspaceGeneration = created.workspaceMetadata?.indexGeneration ?? catalog.workspaceIndexGeneration + 1;
        } else if (entry.status !== "PASS" || entry.generation !== 1 || entry.assetCount !== 0 || entry.sceneCount !== 1) {
          throw new Error("Project background UI self-test found an existing target outside its exact healthy generation-1 zero-asset one-Scene fixture; it will not overwrite or clean it up.");
        }
        const storage = browserDesktopProjectProposalSessionStorage();
        const existing = await loadDesktopProjectProposalSession(storage, projectId);
        if (existing.status === "BLOCKED") throw new Error(existing.reason);
        if (existing.status === "PASS") {
          const terminalStatuses = ["rejected", "cancelled", "stale", "committed", "recovered", "undone", "redone"];
          if (!terminalStatuses.includes(existing.session.history.status)) throw new Error("Project background UI self-test found a nonterminal proposal session for the exact target; it will not overwrite or clear it.");
          await clearTerminalDesktopProjectProposalSession(storage, projectId);
        }
        setSelectedProjectId(projectId);
        await loadSavedProject(projectId, true, expectedWorkspaceGeneration);
      })().catch((error: unknown) => {
        setProjectProposalSessionError(error instanceof Error ? error.message : String(error));
      });
      return;
    }
    if (projectBackgroundUiSelfTestStage.current === "loaded" && activeProjectId === projectId && projectGeneration > 0 && !projectDirty) {
      projectBackgroundUiSelfTestStage.current = "previewed";
      void recordProjectUiSelfTestProgress("previewed");
      const bytes = Uint8Array.from(FOUNDATION_SELF_TEST_PNG_BYTES).buffer as ArrayBuffer;
      const syntheticFile = { type: "image/png", name: "M369 background.png", arrayBuffer: async () => bytes } as File;
      const syntheticEvent = { target: { files: [syntheticFile], value: "" } } as unknown as ChangeEvent<HTMLInputElement>;
      void importSelectedSceneBackground(syntheticEvent);
      return;
    }
    if (projectBackgroundUiSelfTestStage.current === "previewed" && projectProposalSession?.history.status === "previewed" && projectProposalSession.batch.commands[0]?.kind === "project.asset.bind") {
      projectBackgroundUiSelfTestStage.current = "approved";
      void recordProjectUiSelfTestProgress("approved");
      void approveSelectedProjectProposal();
      return;
    }
    if (projectBackgroundUiSelfTestStage.current === "approved" && projectProposalSession?.history.status === "approved" && projectProposalSession.batch.commands[0]?.kind === "project.asset.bind") {
      projectBackgroundUiSelfTestStage.current = "applied";
      void recordProjectUiSelfTestProgress("applied");
      void applySelectedProjectBackgroundProposal();
      return;
    }
    const registeredBackground = projectLoadResponse?.assets.find((asset) => asset.registration?.role === "background");
    const activeScene = projectLoadResponse ? projectLoadResponse.scenesJson.map(parseStoredScene).find((scene) => scene.id === projectLoadResponse.activeSceneId) : null;
    if (projectBackgroundUiSelfTestStage.current === "applied" && projectProposalSession?.history.status === "undone" && activeProjectId === projectId && !projectDirty && projectLoadResponse?.receipt.assetCount === 1 && registeredBackground?.registration?.role === "background" && activeScene?.background.assetId === undefined) {
      projectBackgroundUiSelfTestFinished.current = true;
      void recordProjectUiSelfTestProgress("pass");
      globalThis.document.title = "DiceBox Project Background UI Execute PASS · " + projectId + " · preview→approval→binding→reread→inverse-restore · generation " + projectGeneration + " · background " + registeredBackground.registration.assetId + " · history " + projectProposalSession.history.receipts.length + " · Scene restored · no Foundry write";
      if (import.meta.env.VITE_DBX_PROJECT_SELF_TEST_EXIT === "1") void finishProjectSelfTest("PASS");
    }
  }, [activeProjectId, approveSelectedProjectProposal, applySelectedProjectBackgroundProposal, importSelectedSceneBackground, loadSavedProject, nativeProjectStoreAvailable, projectDirty, projectError, projectGeneration, projectLoadResponse, projectProposalSession, projectProposalSessionError]);

  useEffect(() => {
    const mode = import.meta.env.VITE_DBX_PROJECT_SELF_TEST;
    if (mode !== "audio-ui-execute" || projectAudioUiSelfTestFinished.current) return;
    const projectId = import.meta.env.VITE_DBX_PROJECT_SELF_TEST_ID ?? "dbx:project:desktop-audio-ui-m371-self-test-v1";
    if (!projectId.startsWith("dbx:project:desktop-") || !nativeProjectStoreAvailable) {
      globalThis.document.title = "DiceBox Project Audio UI Self-Test BLOCKED · explicit test-owned project and native project-store IPC are required";
      return;
    }
    if (projectProposalSessionError || projectError) {
      const reason = projectProposalSessionError ?? projectError;
      void recordProjectUiSelfTestProgress("blocked", reason ?? undefined);
      globalThis.document.title = "DiceBox Project Audio UI Self-Test BLOCKED · " + reason;
      if (import.meta.env.VITE_DBX_PROJECT_SELF_TEST_EXIT === "1") void finishProjectSelfTest("BLOCKED");
      return;
    }
    if (projectAudioUiSelfTestStage.current === "idle") {
      projectAudioUiSelfTestStage.current = "loaded";
      void recordProjectUiSelfTestProgress("loaded");
      void (async () => {
        const catalog = await listProjectBundles();
        let expectedWorkspaceGeneration = catalog.workspaceIndexGeneration;
        const entry = catalog.entries.find((candidate) => candidate.projectId === projectId);
        if (!entry) {
          const scene = createBlankProjectScene(projectId);
          const created = await createProjectBundle(projectId, [scene], scene.id, "M371 Audio UI Self Test", catalog.workspaceIndexGeneration);
          if (created.generation !== 1 || created.sceneCount !== 1 || created.assetCount !== 0) throw new Error("Project audio UI self-test did not create the exact zero-asset source fixture.");
          expectedWorkspaceGeneration = created.workspaceMetadata?.indexGeneration ?? catalog.workspaceIndexGeneration + 1;
        } else if (entry.status !== "PASS" || entry.generation !== 1 || entry.assetCount !== 0 || entry.sceneCount !== 1) throw new Error("Project audio UI self-test found an existing target outside its exact healthy generation-1 zero-asset one-Scene fixture; it will not overwrite or clean it up.");
        const storage = browserDesktopProjectProposalSessionStorage();
        const existing = await loadDesktopProjectProposalSession(storage, projectId);
        if (existing.status === "BLOCKED") throw new Error(existing.reason);
        if (existing.status === "PASS") {
          const terminalStatuses = ["rejected", "cancelled", "stale", "committed", "recovered", "undone", "redone"];
          if (!terminalStatuses.includes(existing.session.history.status)) throw new Error("Project audio UI self-test found a nonterminal proposal session for the exact target; it will not overwrite or clear it.");
          await clearTerminalDesktopProjectProposalSession(storage, projectId);
        }
        setSelectedProjectId(projectId);
        await loadSavedProject(projectId, true, expectedWorkspaceGeneration);
      })().catch((error: unknown) => setProjectProposalSessionError(error instanceof Error ? error.message : String(error)));
      return;
    }
    if (projectAudioUiSelfTestStage.current === "loaded" && activeProjectId === projectId && projectGeneration > 0 && !projectDirty) {
      projectAudioUiSelfTestStage.current = "previewed";
      void recordProjectUiSelfTestProgress("previewed");
      const bytes = Uint8Array.from(AUDIO_ASSET_ROLE_SELF_TEST_WAV_BYTES).buffer as ArrayBuffer;
      const syntheticFile = { type: "audio/wav", name: "M371 audio.wav", arrayBuffer: async () => bytes } as File;
      void importProjectAudio({ target: { files: [syntheticFile], value: "" } } as unknown as ChangeEvent<HTMLInputElement>);
      return;
    }
    if (projectAudioUiSelfTestStage.current === "previewed" && projectProposalSession?.history.status === "previewed" && projectProposalSession.batch.commands[0]?.kind === "project.asset.register-audio") {
      projectAudioUiSelfTestStage.current = "approved";
      void recordProjectUiSelfTestProgress("approved");
      void approveSelectedProjectProposal();
      return;
    }
    if (projectAudioUiSelfTestStage.current === "approved" && projectProposalSession?.history.status === "approved" && projectProposalSession.batch.commands[0]?.kind === "project.asset.register-audio") {
      projectAudioUiSelfTestStage.current = "applied";
      void recordProjectUiSelfTestProgress("applied");
      void applySelectedProjectAudioProposal();
      return;
    }
    const registeredAudio = projectLoadResponse?.assets.find((asset) => asset.registration?.role === "audio");
    const activeScene = projectLoadResponse ? projectLoadResponse.scenesJson.map(parseStoredScene).find((scene) => scene.id === projectLoadResponse.activeSceneId) : null;
    if (projectAudioUiSelfTestStage.current === "applied" && projectProposalSession?.history.status === "undone" && activeProjectId === projectId && !projectDirty && projectLoadResponse?.receipt.assetCount === 1 && registeredAudio?.registration?.role === "audio" && activeScene?.background.assetId === undefined) {
      projectAudioUiSelfTestFinished.current = true;
      void recordProjectUiSelfTestProgress("pass");
      globalThis.document.title = "DiceBox Project Audio UI Execute PASS · " + projectId + " · preview→approval→registration→reread→inverse-restore · generation " + projectGeneration + " · audio " + registeredAudio.registration.assetId + " · history " + projectProposalSession.history.receipts.length + " · Scene restored · no Foundry write";
      if (import.meta.env.VITE_DBX_PROJECT_SELF_TEST_EXIT === "1") void finishProjectSelfTest("PASS");
    }
  }, [activeProjectId, approveSelectedProjectProposal, applySelectedProjectAudioProposal, importProjectAudio, loadSavedProject, nativeProjectStoreAvailable, projectDirty, projectError, projectGeneration, projectLoadResponse, projectProposalSession, projectProposalSessionError]);

  useEffect(() => {
    const mode = import.meta.env.VITE_DBX_PROJECT_SELF_TEST;
    if (mode !== "token-ui-execute" || projectTokenUiSelfTestFinished.current) return;
    const projectId = import.meta.env.VITE_DBX_PROJECT_SELF_TEST_ID ?? "dbx:project:desktop-token-ui-m373-self-test-v1";
    if (!projectId.startsWith("dbx:project:desktop-") || !nativeProjectStoreAvailable) {
      globalThis.document.title = "DiceBox Project Token UI Self-Test BLOCKED · explicit test-owned project and native project-store IPC are required";
      return;
    }
    if (projectProposalSessionError || projectError) {
      const reason = projectProposalSessionError ?? projectError;
      void recordProjectUiSelfTestProgress("blocked", reason ?? undefined);
      globalThis.document.title = "DiceBox Project Token UI Self-Test BLOCKED · " + reason;
      if (import.meta.env.VITE_DBX_PROJECT_SELF_TEST_EXIT === "1") void finishProjectSelfTest("BLOCKED");
      return;
    }
    if (projectTokenUiSelfTestStage.current === "idle") {
      projectTokenUiSelfTestStage.current = "loaded";
      void recordProjectUiSelfTestProgress("loaded");
      void (async () => {
        const catalog = await listProjectBundles();
        let expectedWorkspaceGeneration = catalog.workspaceIndexGeneration;
        const entry = catalog.entries.find((candidate) => candidate.projectId === projectId);
        if (!entry) {
          const scene = createBlankProjectScene(projectId);
          const created = await createProjectBundle(projectId, [scene], scene.id, "M373 Token UI Self Test", catalog.workspaceIndexGeneration);
          if (created.generation !== 1 || created.sceneCount !== 1 || created.assetCount !== 0) throw new Error("Project token UI self-test did not create the exact zero-asset source fixture.");
          expectedWorkspaceGeneration = created.workspaceMetadata?.indexGeneration ?? catalog.workspaceIndexGeneration + 1;
        } else if (entry.status !== "PASS" || entry.generation !== 1 || entry.assetCount !== 0 || entry.sceneCount !== 1) throw new Error("Project token UI self-test found an existing target outside its exact healthy generation-1 zero-asset one-Scene fixture; it will not overwrite or clean it up.");
        const storage = browserDesktopProjectProposalSessionStorage(); const existing = await loadDesktopProjectProposalSession(storage, projectId);
        if (existing.status === "BLOCKED") throw new Error(existing.reason);
        if (existing.status === "PASS") {
          const terminalStatuses = ["rejected", "cancelled", "stale", "committed", "recovered", "undone", "redone"];
          if (!terminalStatuses.includes(existing.session.history.status)) throw new Error("Project token UI self-test found a nonterminal proposal session for the exact target; it will not overwrite or clear it.");
          await clearTerminalDesktopProjectProposalSession(storage, projectId);
        }
        setSelectedProjectId(projectId); await loadSavedProject(projectId, true, expectedWorkspaceGeneration);
      })().catch((error: unknown) => setProjectProposalSessionError(error instanceof Error ? error.message : String(error)));
      return;
    }
    if (projectTokenUiSelfTestStage.current === "loaded" && activeProjectId === projectId && projectGeneration > 0 && !projectDirty) {
      projectTokenUiSelfTestStage.current = "previewed"; void recordProjectUiSelfTestProgress("previewed");
      const bytes = Uint8Array.from(FOUNDATION_SELF_TEST_PNG_BYTES).buffer as ArrayBuffer;
      const syntheticFile = { type: "image/png", name: "M373 token.png", arrayBuffer: async () => bytes } as File;
      void importProjectToken({ target: { files: [syntheticFile], value: "" } } as unknown as ChangeEvent<HTMLInputElement>); return;
    }
    if (projectTokenUiSelfTestStage.current === "previewed" && projectProposalSession?.history.status === "previewed" && projectProposalSession.batch.commands[0]?.kind === "project.asset.register-token") {
      projectTokenUiSelfTestStage.current = "approved"; void recordProjectUiSelfTestProgress("approved"); void approveSelectedProjectProposal(); return;
    }
    if (projectTokenUiSelfTestStage.current === "approved" && projectProposalSession?.history.status === "approved" && projectProposalSession.batch.commands[0]?.kind === "project.asset.register-token") {
      projectTokenUiSelfTestStage.current = "applied"; void recordProjectUiSelfTestProgress("applied"); void applySelectedProjectTokenProposal(); return;
    }
    const registeredToken = projectLoadResponse?.assets.find((asset) => asset.registration?.role === "token");
    const activeScene = projectLoadResponse ? projectLoadResponse.scenesJson.map(parseStoredScene).find((scene) => scene.id === projectLoadResponse.activeSceneId) : null;
    if (projectTokenUiSelfTestStage.current === "applied" && projectProposalSession?.history.status === "undone" && activeProjectId === projectId && !projectDirty && projectLoadResponse?.receipt.assetCount === 1 && registeredToken?.registration?.role === "token" && activeScene?.background.assetId === undefined) {
      projectTokenUiSelfTestFinished.current = true; void recordProjectUiSelfTestProgress("pass");
      globalThis.document.title = "DiceBox Project Token UI Execute PASS · " + projectId + " · preview→approval→registration→reread→inverse-restore · generation " + projectGeneration + " · token " + registeredToken.registration.assetId + " · history " + projectProposalSession.history.receipts.length + " · Scene restored · no Foundry write";
      if (import.meta.env.VITE_DBX_PROJECT_SELF_TEST_EXIT === "1") void finishProjectSelfTest("PASS");
    }
  }, [activeProjectId, approveSelectedProjectProposal, applySelectedProjectTokenProposal, importProjectToken, loadSavedProject, nativeProjectStoreAvailable, projectDirty, projectError, projectGeneration, projectLoadResponse, projectProposalSession, projectProposalSessionError]);

  useEffect(() => {
    const mode = import.meta.env.VITE_DBX_PROJECT_SELF_TEST;
    if (mode !== "add-scene-ui-execute" || projectAddSceneUiSelfTestFinished.current) return;
    const projectId = import.meta.env.VITE_DBX_PROJECT_SELF_TEST_ID ?? "dbx:project:desktop-persistent-add-scene-execute-self-test-v2";
    if (!projectId.startsWith("dbx:project:desktop-") || !nativeProjectStoreAvailable) {
      globalThis.document.title = `DiceBox Add Scene UI Self-Test BLOCKED · exact test-owned project and native project storage are required`;
      return;
    }
    if (projectProposalSessionError || projectError) {
      globalThis.document.title = `DiceBox Add Scene UI Self-Test BLOCKED · ${projectProposalSessionError ?? projectError}`;
      return;
    }
    if (projectAddSceneUiSelfTestStage.current === "idle") {
      projectAddSceneUiSelfTestStage.current = "loaded";
      void (async () => {
        const catalog = await listProjectBundles();
        const entry = catalog.entries.find((candidate) => candidate.projectId === projectId);
        if (!entry || entry.status !== "PASS" || entry.sceneCount !== 2 || entry.assetCount !== 0 || entry.generation === null) throw new Error("Add-Scene UI self-test requires one pre-existing exact healthy two-Scene zero-asset fixture; it will not create, save, delete, or overwrite a project.");
        const storage = browserDesktopProjectProposalSessionStorage();
        const existing = await loadDesktopProjectProposalSession(storage, projectId);
        if (existing.status === "BLOCKED") throw new Error(existing.reason);
        if (existing.status === "PASS") {
          const terminalStatuses = ["rejected", "cancelled", "stale", "committed", "recovered", "undone", "redone"];
          if (!terminalStatuses.includes(existing.session.history.status)) throw new Error("Add-Scene UI self-test found a nonterminal exact proposal session; it will not replace it.");
          await clearTerminalDesktopProjectProposalSession(storage, projectId);
        }
        setSelectedProjectId(projectId);
        await loadSavedProject(projectId, true, catalog.workspaceIndexGeneration);
      })().catch((error: unknown) => {
        const message = error instanceof Error ? error.message : String(error);
        setProjectProposalSessionError(message);
        globalThis.document.title = `DiceBox Add Scene UI Self-Test BLOCKED · ${message}`;
      });
      return;
    }
    if (projectAddSceneUiSelfTestStage.current === "loaded" && activeProjectId === projectId && currentProjectScenes.length === 2 && !projectDirty) {
      projectAddSceneUiSelfTestStage.current = "previewed";
      void previewProjectAddScene();
      return;
    }
    if (projectAddSceneUiSelfTestStage.current === "previewed" && projectProposalSession?.history.status === "previewed" && projectProposalSession.batch.commands[0]?.kind === "project.add-scene") {
      projectAddSceneUiSelfTestStage.current = "approved";
      void approveSelectedProjectProposal();
      return;
    }
    if (projectAddSceneUiSelfTestStage.current === "approved" && projectProposalSession?.history.status === "approved" && projectProposalSession.batch.commands[0]?.kind === "project.add-scene") {
      projectAddSceneUiSelfTestStage.current = "applied";
      void applySelectedCommittedProjectAddScene();
      return;
    }
    if (projectAddSceneUiSelfTestStage.current === "applied" && projectProposalSession?.history.status === "committed" && activeProjectId === projectId && currentProjectScenes.length === 3 && projectDirty) {
      void undoSelectedCommittedProjectAddScene();
      return;
    }
    if (projectAddSceneUiSelfTestStage.current === "applied" && projectProposalSession?.history.status === "undone" && activeProjectId === projectId && currentProjectScenes.length === 2 && !projectDirty) {
      projectAddSceneUiSelfTestFinished.current = true;
      globalThis.document.title = `DiceBox Add Scene UI Execute PASS · ${projectId} · preview→approval→committed in-memory apply→explicit undo · Scenes 2 → 3 → 2 · history ${projectProposalSession.history.receipts.length} · no project/workspace/Foundry write`;
      if (import.meta.env.VITE_DBX_PROJECT_SELF_TEST_EXIT === "1") void finishProjectSelfTest("PASS");
    }
  }, [activeProjectId, applySelectedCommittedProjectAddScene, approveSelectedProjectProposal, currentProjectScenes.length, finishProjectSelfTest, loadSavedProject, nativeProjectStoreAvailable, previewProjectAddScene, projectDirty, projectError, projectProposalSession, projectProposalSessionError, undoSelectedCommittedProjectAddScene]);

  useEffect(() => {
    const mode = import.meta.env.VITE_DBX_PROJECT_SELF_TEST;
    if (mode !== "backup-promotion-ui-execute" || backupPromotionUiSelfTestFinished.current) return;
    const expectedProjectId = "dbx:project:desktop-backup-authoritative-recovery-promotion-self-test";
    const block = (reason: string) => {
      backupPromotionUiSelfTestFinished.current = true;
      void recordProjectUiSelfTestProgress("blocked", reason.slice(0, 512));
      globalThis.document.title = `DiceBox Backup Promotion UI Execute BLOCKED · ${reason}`;
      if (import.meta.env.VITE_DBX_PROJECT_SELF_TEST_EXIT === "1") void finishProjectSelfTest("BLOCKED");
    };
    if (!nativeProjectStoreAvailable) {
      block("exact test-owned native project storage is required");
      return;
    }
    if (projectError || projectProposalSessionError) {
      block(projectError ?? projectProposalSessionError ?? "project state is blocked");
      return;
    }
    if (backupPromotionUiSelfTestStage.current === "idle") {
      if (projectProposalSession !== null) {
        block("an existing project proposal session must be absent; no session was replaced");
        return;
      }
      backupPromotionUiSelfTestStage.current = "fixture";
      void (async () => {
        void recordProjectUiSelfTestProgress("loaded", "backup-promotion-fixture");
        const fixture = await prepareBackupAuthoritativeRecoveryPromotionFixture();
        if (fixture.status !== "PASS" || fixture.projectId !== expectedProjectId || fixture.generation !== 1 || fixture.noFoundryWrite !== true) throw new Error("exact disposable missing-primary/valid-backup fixture was not established");
        setSelectedProjectId(fixture.projectId);
      })().catch((error: unknown) => block(formatProjectStoreFailure(error)));
      return;
    }
    if (backupPromotionUiSelfTestStage.current === "fixture") {
      if (selectedProjectId !== expectedProjectId || backupPromotionPreview !== null || projectBusy) return;
      backupPromotionUiSelfTestStage.current = "previewed";
      void (async () => {
        void recordProjectUiSelfTestProgress("previewed", "backup-promotion-preview");
        const preview = await previewSelectedBackupPromotion(expectedProjectId);
        if (!preview || preview.projectId !== expectedProjectId || preview.primary.status !== "MISSING" || preview.backup.status !== "VALID" || preview.noWrite !== true || preview.noFoundryWrite !== true) throw new Error("visible preview did not retain the exact missing-primary/valid-backup no-write boundary");
      })().catch((error: unknown) => block(formatProjectStoreFailure(error)));
      return;
    }
    if (backupPromotionUiSelfTestStage.current === "previewed") {
      if (!backupPromotionPreview || projectProposalSession !== null || projectBusy) return;
      backupPromotionUiSelfTestStage.current = "approved";
      void (async () => {
        void recordProjectUiSelfTestProgress("previewed", "backup-promotion-proposal");
        const proposal = await previewSelectedBackupPromotionProposal(backupPromotionPreview);
        if (!proposal || proposal.projectId !== expectedProjectId || proposal.batch.commands[0]?.kind !== "project.recovery.backup-promote" || proposal.history.status !== "previewed") throw new Error("visible recovery proposal did not bind the exact command and target");
      })().catch((error: unknown) => block(formatProjectStoreFailure(error)));
      return;
    }
    if (backupPromotionUiSelfTestStage.current === "approved") {
      if (!backupPromotionPreview || projectProposalSession?.projectId !== expectedProjectId || projectProposalSession.history.status !== "previewed" || projectProposalSession.batch.commands[0]?.kind !== "project.recovery.backup-promote" || projectBusy) return;
      backupPromotionUiSelfTestStage.current = "applied";
      void (async () => {
        void recordProjectUiSelfTestProgress("approved", "backup-promotion-review");
        const approved = await approveSelectedProjectProposal(projectProposalSession);
        if (!approved || approved.history.status !== "approved") throw new Error("visible recovery proposal did not reach approval");
      })().catch((error: unknown) => block(formatProjectStoreFailure(error)));
      return;
    }
    if (backupPromotionUiSelfTestStage.current === "applied") {
      if (!backupPromotionPreview || projectProposalSession?.projectId !== expectedProjectId || projectProposalSession.history.status !== "approved" || projectProposalSession.batch.commands[0]?.kind !== "project.recovery.backup-promote" || projectBusy) return;
      backupPromotionUiSelfTestStage.current = "executing";
      void (async () => {
        void recordProjectUiSelfTestProgress("applied", "backup-promotion-apply");
        const receipt = await applySelectedBackupPromotionProposal(backupPromotionPreview, projectProposalSession);
        if (!receipt) throw new Error("approved backup-promotion apply did not return an authoritative receipt");
        backupPromotionUiSelfTestFinished.current = true;
        void recordProjectUiSelfTestProgress("pass", "backup-promotion-committed");
        globalThis.document.title = `DiceBox Backup Promotion UI Execute PASS · ${expectedProjectId} · state-driven preview→proposal→approval→apply→authoritative recovery reread · no Foundry write`;
        if (import.meta.env.VITE_DBX_PROJECT_SELF_TEST_EXIT === "1") await finishProjectSelfTest("PASS");
      })().catch((error: unknown) => block(formatProjectStoreFailure(error)));
    }
  }, [applySelectedBackupPromotionProposal, approveSelectedProjectProposal, backupPromotionPreview, finishProjectSelfTest, nativeProjectStoreAvailable, prepareBackupAuthoritativeRecoveryPromotionFixture, previewSelectedBackupPromotion, previewSelectedBackupPromotionProposal, projectBusy, projectError, projectProposalSession, projectProposalSessionError, selectedProjectId]);

  useEffect(() => {
    const mode = import.meta.env.VITE_DBX_PROJECT_SELF_TEST;
    if (mode !== "cross-producer-commit-recovery-ui-execute" || crossProducerCommitRecoverySelfTestStarted.current) return;
    crossProducerCommitRecoverySelfTestStarted.current = true;
    const projectId = "dbx:project:desktop-cross-producer-commit-recovery-self-test-v3";
    const block = (reason: string) => {
      const detail = reason.slice(0, 512);
      void recordProjectUiSelfTestProgress("blocked", detail);
      globalThis.document.title = `DiceBox Cross-Producer Commit Recovery BLOCKED · ${detail}`;
      if (import.meta.env.VITE_DBX_PROJECT_SELF_TEST_EXIT === "1") void finishProjectSelfTest("BLOCKED");
    };
    if (!nativeProjectStoreAvailable) {
      block("exact test-owned native project storage is required");
      return;
    }
    void (async () => {
      const catalog = await listProjectBundles();
      if (catalog.entries.some((entry) => entry.projectId === projectId)) throw new Error("M870 requires an absent exact test-owned target and will not overwrite or clean up an existing project.");
      const sourceScene = createBlankProjectScene(projectId);
      const created = await createProjectBundle(projectId, [sourceScene], sourceScene.id, "M870 Cross-Producer Recovery", catalog.workspaceIndexGeneration);
      if (created.status !== "PASS" || created.projectId !== projectId || created.generation !== 1 || created.sceneCount !== 1 || created.assetCount !== 0 || created.backupPreserved !== false || created.noFoundryWrite !== true) throw new Error("M870 could not establish the exact generation-1 zero-asset project fixture.");
      const current = await loadProjectBundle(projectId);
      const initialInspection = await inspectProjectRecovery(projectId);
      if (current.receipt.status !== "PASS" || current.receipt.generation !== 1 || current.receipt.assetCount !== 0 || initialInspection.status !== "PASS" || initialInspection.primary.status !== "VALID" || initialInspection.backup.status !== "MISSING" || initialInspection.noWrite !== true || initialInspection.noFoundryWrite !== true) throw new Error("M870 initial project/recovery reread did not match the exact healthy fixture.");
      const candidate: ProjectBackgroundAssetCandidate = { mediaType: "image/png", bytes: FOUNDATION_SELF_TEST_PNG_BYTES, label: "M870 cross-producer background.png", provenance: "user-import" };
      const descriptor = await deriveProjectBackgroundAssetDescriptor(candidate, sourceScene.id);
      const inverseContent: ProjectAssetBindingContent = { scenes: [sourceScene], activeSceneId: sourceScene.id, sceneId: sourceScene.id, candidate };
      const proposedContent: ProjectAssetBindingContent = { ...inverseContent, scenes: [sceneWithBackgroundAsset(sourceScene, descriptor.assetId)] };
      const observedAt = new Date().toISOString();
      const bindingPreview = await createProjectAssetBindingPreview({ projectId, currentGeneration: current.receipt.generation, currentContentSha256: current.receipt.contentSha256, candidate, sceneId: sourceScene.id, proposedSceneCount: 1, proposedActiveSceneId: sourceScene.id, proposedAssetCount: 1 });
      const bindingBatch = await createProjectAssetBindingProposalBatch({ batchId: `dbx:proposal:m870-asset-bind-${Date.now()}`, preview: bindingPreview, createdAt: observedAt });
      const bindingHistory = await previewProposalBatch(bindingBatch, desktopProposalRequester, observedAt);
      const bindingSession = await createDesktopProjectProposalSession({ projectId, batch: bindingBatch, history: bindingHistory });
      const approvedBinding = await approveDesktopProjectProposalSession(bindingSession, desktopProposalReviewer, bindingBatch.base, new Date().toISOString());
      const bindingReceipt = await executeApprovedProjectAssetBindingCommit({ session: approvedBinding, content: proposedContent, executor: desktopProposalReviewer });
      if (bindingReceipt.status !== "PASS" || bindingReceipt.history.status !== "committed" || bindingReceipt.history.receipts.length !== 4 || bindingReceipt.before.generation !== 1 || bindingReceipt.afterApply.generation !== 2 || bindingReceipt.afterApply.backgroundBindings.find((binding) => binding.sceneId === sourceScene.id)?.assetId !== descriptor.assetId || bindingReceipt.afterApply.assetCount !== 1 || bindingReceipt.assetBytesPersisted !== true || bindingReceipt.assetTreePreserved !== true || bindingReceipt.noFoundryWrite !== true) throw new Error("M870 asset binding did not produce one committed authoritative cross-producer base.");
      const transition = await prepareCrossProducerRecoveryTransition(projectId, bindingReceipt.afterApply.generation, bindingReceipt.afterApply.contentSha256);
      if (transition.status !== "PASS" || transition.projectId !== projectId || transition.beforeGeneration !== 2 || transition.committedGeneration !== 3 || transition.backupGeneration !== 2 || transition.contentSha256 !== bindingReceipt.afterApply.contentSha256 || transition.primaryContentSha256 === bindingReceipt.afterApply.contentSha256 || transition.primaryRemoved !== true || transition.noFoundryWrite !== true || !/^[0-9a-f]{64}$/.test(transition.primaryContentSha256) || !/^[0-9a-f]{64}$/.test(transition.backupByteSha256) || !/^[0-9a-f]{64}$/.test(transition.foreignStateSha256)) throw new Error("M870 test-owned recovery transition did not preserve the committed binding in the backup and remove only the exact primary.");
      const recoveryPreview = await previewBackupAuthoritativeRecovery(projectId);
      if (recoveryPreview.status !== "PREVIEW" || recoveryPreview.projectId !== projectId || recoveryPreview.primary.status !== "MISSING" || recoveryPreview.backup.status !== "VALID" || recoveryPreview.generation !== 2 || recoveryPreview.contentSha256 !== bindingReceipt.afterApply.contentSha256 || recoveryPreview.assetCount !== 1 || recoveryPreview.requiresApproval !== true || recoveryPreview.noWrite !== true || recoveryPreview.noFoundryWrite !== true) throw new Error("M870 recovery preview did not observe the exact test-owned missing-primary/valid-backup state.");
      const recoveryObservedAt = new Date().toISOString();
      const recoveryBatch = await createProjectRecoveryProposalBatch({ batchId: `dbx:proposal:m870-backup-promote-${Date.now()}`, preview: recoveryPreview, createdAt: recoveryObservedAt });
      const recoveryHistory = await previewProposalBatch(recoveryBatch, desktopProposalRequester, recoveryObservedAt);
      const recoverySession = await createDesktopProjectProposalSession({ projectId, batch: recoveryBatch, history: recoveryHistory });
      const approvedRecovery = await approveDesktopProjectProposalSession(recoverySession, desktopProposalReviewer, recoveryBatch.base, new Date().toISOString());
      const applyingRecovery = await beginDesktopProjectProposalSessionApply(approvedRecovery, desktopProposalReviewer, recoveryBatch.base, new Date().toISOString());
      const recoveryReceipt = await promoteBackupAuthoritativeRecovery(recoveryPreview);
      const finalProject = await loadProjectBundle(projectId);
      const finalCatalog = await listProjectBundles();
      const finalInspection = await inspectProjectRecovery(projectId);
      if (recoveryReceipt.status !== "PASS" || recoveryReceipt.projectId !== projectId || recoveryReceipt.generation !== 2 || recoveryReceipt.contentSha256 !== bindingReceipt.afterApply.contentSha256 || recoveryReceipt.primaryRestored !== true || recoveryReceipt.backupUnchanged !== true || recoveryReceipt.semanticStateUnchanged !== true || recoveryReceipt.assetTreeUnchanged !== true || recoveryReceipt.workspaceUnchanged !== true || recoveryReceipt.foreignStateUnchanged !== true || recoveryReceipt.authoritativeCurrentReread !== true || recoveryReceipt.directoryEntrySync !== true || recoveryReceipt.noFoundryWrite !== true || finalProject.receipt.status !== "PASS" || finalProject.receipt.generation !== 2 || finalProject.receipt.contentSha256 !== bindingReceipt.afterApply.contentSha256 || finalProject.assets.length !== 1 || finalProject.scenesJson[0] !== bindingReceipt.afterApply.project.scenesJson[0] || finalInspection.status !== "PASS" || finalInspection.primary.status !== "VALID" || finalInspection.backup.status !== "VALID" || finalInspection.generation !== 2 || finalInspection.contentSha256 !== bindingReceipt.afterApply.contentSha256 || finalInspection.noWrite !== true || finalInspection.noFoundryWrite !== true || finalCatalog.entries.find((entry) => entry.projectId === projectId)?.generation !== 2 || finalCatalog.entries.find((entry) => entry.projectId === projectId)?.contentSha256 !== bindingReceipt.afterApply.contentSha256) throw new Error("M870 recovery authoritative rereads did not prove committed binding restoration and preservation.");
      const committedRecovery = await commitDesktopProjectProposalSessionAfterReread(applyingRecovery, desktopProposalReviewer, { status: "matched", targetId: recoverySession.batch.base.targetId, revision: recoveryReceipt.generation, sha256: recoveryReceipt.contentSha256 }, new Date().toISOString());
      if (committedRecovery.history.status !== "committed" || committedRecovery.history.receipts.length !== 4) throw new Error("M870 recovery proposal history did not reach committed-after-reread.");
      void recordProjectUiSelfTestProgress("pass", `cross-producer-bind-recovery:${projectId}:generation:${recoveryReceipt.generation}`);
      globalThis.document.title = `DiceBox Cross-Producer Commit Recovery PASS · ${projectId} · asset.bind committed generation 2 · backup promotion restored generation 2 · foreign state preserved · proposal histories committed · no Foundry write`;
      if (import.meta.env.VITE_DBX_PROJECT_SELF_TEST_EXIT === "1") await finishProjectSelfTest("PASS");
    })().catch((error: unknown) => block(formatProjectStoreFailure(error)));
  }, [createProjectBundle, finishProjectSelfTest, listProjectBundles, loadProjectBundle, nativeProjectStoreAvailable, inspectProjectRecovery, previewBackupAuthoritativeRecovery, promoteBackupAuthoritativeRecovery]);

  useEffect(() => {
    const mode = import.meta.env.VITE_DBX_PROJECT_SELF_TEST;
    if (mode !== "asset-restore-ui-execute" || projectAssetRestoreUiSelfTestFinished.current) return;
    const projectId = DESKTOP_ASSET_RESTORE_UI_SELF_TEST_V3_PROJECT_ID;
    projectProposalSessionPersistenceScope.current = DESKTOP_ASSET_RESTORE_UI_SELF_TEST_V3_SCOPE;
    const progress = (stage: "loaded" | "previewed" | "approved" | "applied" | "pass" | "blocked", detail: string) => recordProjectUiSelfTestProgress(stage, `asset-restore-trace:${detail}`);
    const block = (reason: string) => { projectAssetRestoreUiSelfTestFinished.current = true; globalThis.document.title = `DiceBox Asset Restore UI Self-Test BLOCKED · ${reason}`; void (async () => { await progress("blocked", reason.slice(0, 256)).catch(() => undefined); if (import.meta.env.VITE_DBX_PROJECT_SELF_TEST_EXIT === "1") await finishProjectSelfTest("BLOCKED"); })(); };
    if (!nativeProjectStoreAvailable) { block("native project-store IPC is unavailable"); return; }
    if (projectProposalSessionError || projectError) { block(projectProposalSessionError ?? projectError ?? "unknown error"); return; }
    if (projectBusy) return;
    if (projectAssetRestoreUiSelfTestStage.current === "idle") {
      projectAssetRestoreUiSelfTestStage.current = "loaded";
      void (async () => {
        const fixture = await prepareAssetRestoreTraceFixtureV3();
        const inspection = await inspectProjectRecovery(projectId);
        const selected = selectEligibleMissingBackgroundAsset(inspection, ASSET_RESTORE_TRACE_WEBP_ASSET_ID);
        if (fixture.projectId !== projectId || fixture.assetIds.length !== 2 || inspection.status !== "BLOCKED" || selected.mediaType !== "image/webp" || inspection.registeredAssets.filter((asset) => asset.restoreEligible).length !== 2) throw new Error("exact isolated asset-restore trace fixture topology was not available");
        const storage = browserDesktopProjectProposalSessionStorage(); const existing = await loadDesktopAssetRestoreUiV3SelfTestProposalSession(storage);
        if (existing.status === "BLOCKED") throw new Error(existing.reason);
        if (existing.status === "PASS") { if (!["rejected", "cancelled", "stale", "committed", "recovered", "undone", "redone"].includes(existing.session.history.status)) throw new Error("exact test-owned asset-restore session is nonterminal"); await clearTerminalDesktopAssetRestoreUiV3SelfTestProposalSession(storage); }
        await progress("loaded", "isolated-fixture-reread");
        setRecoveryInspection(inspection); setSelectedRecoveryAssetId(selected.assetId);
      })().catch((error: unknown) => block(error instanceof Error ? error.message : String(error)));
      return;
    }
    if (projectAssetRestoreUiSelfTestStage.current === "loaded" && recoveryInspection?.projectId === projectId && selectedRecoveryAssetId === ASSET_RESTORE_TRACE_WEBP_ASSET_ID) {
      projectAssetRestoreUiSelfTestStage.current = "previewed";
      const bytes = Uint8Array.from(ASSET_RESTORE_TRACE_WEBP_BYTES).buffer as ArrayBuffer;
      const file = { type: "image/webp", name: "M472 exact restore.webp", arrayBuffer: async () => bytes } as File;
      void progress("previewed", "exact-webp-preview").then(() => previewSelectedProjectAssetRestore({ target: { files: [file], value: "" } } as unknown as ChangeEvent<HTMLInputElement>)); return;
    }
    if (projectAssetRestoreUiSelfTestStage.current === "previewed" && projectProposalSession?.history.status === "previewed" && projectProposalSession.batch.commands[0]?.kind === "project.asset.restore") { projectAssetRestoreUiSelfTestStage.current = "approved"; void progress("approved", "reviewer-approved").then(() => approveSelectedProjectProposal()); return; }
    if (projectAssetRestoreUiSelfTestStage.current === "approved" && projectProposalSession?.history.status === "approved" && projectProposalSession.batch.commands[0]?.kind === "project.asset.restore") { projectAssetRestoreUiSelfTestStage.current = "applied"; void progress("applied", "typed-apply").then(() => applySelectedProjectAssetRestoreProposal()); return; }
    if (projectAssetRestoreUiSelfTestStage.current === "applied" && projectProposalSession?.history.status === "committed") {
      const exactTerminalTopology = recoveryReceipt?.assetId === ASSET_RESTORE_TRACE_WEBP_ASSET_ID
        && recoveryInspection !== null
        && isAssetRestoreUiTerminalInspection(recoveryInspection, projectId, ASSET_RESTORE_TRACE_WEBP_ASSET_ID, [ASSET_RESTORE_TRACE_PNG_ASSET_ID]);
      if (!exactTerminalTopology) { block("Asset restore did not satisfy the exact selected-restored/unselected-preserved authoritative reread; no retry was attempted."); return; }
      projectAssetRestoreUiSelfTestFinished.current = true;
      globalThis.document.title = `DiceBox Asset Restore UI Execute PASS · ${projectId} · preview→approval→exact-byte restore→selected/restored and unselected/preserved reread · no Foundry write`;
      void (async () => { await progress("pass", "authoritative-reread"); if (import.meta.env.VITE_DBX_PROJECT_SELF_TEST_EXIT === "1") await finishProjectSelfTest("PASS"); })();
    }
  }, [applySelectedProjectAssetRestoreProposal, approveSelectedProjectProposal, finishProjectSelfTest, nativeProjectStoreAvailable, prepareAssetRestoreTraceFixtureV3, previewSelectedProjectAssetRestore, projectBusy, projectError, projectProposalSession, projectProposalSessionError, recoveryInspection, recoveryReceipt, selectedRecoveryAssetId]);

  useEffect(() => {
    const mode = import.meta.env.VITE_DBX_PROJECT_SELF_TEST;
    if (mode !== "asset-detach-ui-execute" || projectAssetDetachUiSelfTestFinished.current) return;
    const projectId = DESKTOP_ASSET_DETACH_UI_SELF_TEST_PROJECT_ID;
    const selectedAssetId = ASSET_DETACH_UI_LIFECYCLE_PNG_ASSET_ID;
    const preservedAssetId = ASSET_DETACH_UI_LIFECYCLE_WEBP_ASSET_ID;
    const progress = (stage: "loaded" | "previewed" | "approved" | "applied" | "pass" | "blocked", detail: string) => recordProjectUiSelfTestProgress(stage, `asset-detach-ui-lifecycle:${detail}`);
    const block = (reason: string) => {
      projectAssetDetachUiSelfTestFinished.current = true;
      globalThis.document.title = `DiceBox Asset Detach UI Lifecycle BLOCKED · ${reason}`;
      void (async () => {
        await progress("blocked", reason.slice(0, 256)).catch(() => undefined);
        if (import.meta.env.VITE_DBX_PROJECT_SELF_TEST_EXIT === "1") await finishProjectSelfTest("BLOCKED");
      })();
    };
    projectProposalSessionPersistenceScope.current = DESKTOP_ASSET_DETACH_UI_SELF_TEST_V2_SCOPE;
    if (!nativeProjectStoreAvailable) { block("native project-store IPC is unavailable"); return; }
    if (projectProposalSessionError || projectError) { block(projectProposalSessionError ?? projectError ?? "unknown error"); return; }
    if (projectBusy) return;
    const exactCommand = projectProposalSession?.batch.commands[0];
    const exactSession = projectProposalSession?.projectId === projectId && exactCommand?.kind === "project.asset.detach";
    if (projectAssetDetachUiSelfTestStage.current === "idle") {
      projectAssetDetachUiSelfTestStage.current = "loaded";
      void (async () => {
        const fixture = await prepareAssetDetachUiLifecycleFixture();
        const inspection = await inspectProjectRecovery(projectId);
        const selected = selectEligibleMissingBackgroundAsset(inspection, selectedAssetId);
        const preserved = inspection.registeredAssets.find((asset) => asset.assetId === preservedAssetId);
        const stored = await loadDesktopAssetDetachUiV2SelfTestProposalSession(browserDesktopProjectProposalSessionStorage());
        if (
          fixture.projectId !== projectId
          || fixture.assetIds.length !== 2
          || inspection.status !== "BLOCKED"
          || inspection.primary.status !== "VALID"
          || inspection.backup.status !== "MISSING"
          || inspection.scenes.length !== 2
          || selected.disposition !== "MISSING"
          || selected.restoreEligible !== true
          || selected.affectedSceneIds.length !== 1
          || preserved?.disposition !== "PRESENT_VALID"
          || preserved.restoreEligible !== false
          || preserved.affectedSceneIds.length !== 1
          || inspection.brokenSceneReferences.length !== 0
          || hasTargetProjectPendingArtifact(inspection, projectId)
          || inspection.noWrite !== true
          || inspection.noFoundryWrite !== true
          || stored.status !== "MISSING"
        ) throw new Error("Exact selected-detach lifecycle fixture or clean session boundary was not available; no session was replaced.");
        await progress("loaded", "fixture-reread");
        setRecoveryInspection(inspection);
        setSelectedRecoveryAssetId(selected.assetId);
      })().catch((error: unknown) => block(formatProjectStoreFailure(error)));
      return;
    }
    if (projectAssetDetachUiSelfTestStage.current === "loaded" && recoveryInspection?.projectId === projectId && selectedRecoveryAssetId === selectedAssetId) {
      projectAssetDetachUiSelfTestStage.current = "previewing";
      projectProposalSessionPersistenceScope.current = DESKTOP_ASSET_DETACH_UI_SELF_TEST_V2_SCOPE;
      void previewSelectedProjectAssetDetach();
      return;
    }
    if (projectAssetDetachUiSelfTestStage.current === "previewing" && exactSession && projectProposalSession?.history.status === "previewed" && detachPreview?.projectId === projectId && detachPreview.assetId === selectedAssetId && detachPreview.requiresApproval === true && detachPreview.noWrite === true && detachPreview.noFoundryWrite === true) {
      projectAssetDetachUiSelfTestPreview.current = detachPreview;
      projectAssetDetachUiSelfTestStage.current = "approving";
      void (async () => {
        try {
          await progress("previewed", "recovery-proposal-session");
          const approved = await approveSelectedProjectProposal(projectProposalSession);
          if (approved === null) throw new Error("Selected-detach UI self-test approval handoff did not produce an approved session; no retry was attempted.");
        } catch (error) {
          block(formatProjectStoreFailure(error));
        }
      })();
      return;
    }
    if (projectAssetDetachUiSelfTestStage.current === "approving" && exactSession && projectProposalSession?.history.status === "approved") {
      projectAssetDetachUiSelfTestStage.current = "approved";
      void (async () => {
        try {
          await progress("approved", "reviewer-approval");
          projectAssetDetachUiSelfTestStage.current = "applying";
          projectProposalSessionPersistenceScope.current = DESKTOP_ASSET_DETACH_UI_SELF_TEST_V2_SCOPE;
          await progress("applied", "typed-detach-apply");
          await applySelectedProjectAssetDetachProposal();
        } catch (error) {
          block(formatProjectStoreFailure(error));
        }
      })();
      return;
    }
    if (projectAssetDetachUiSelfTestStage.current === "applying" && exactSession && projectProposalSession?.history.status === "committed") {
      const preview = projectAssetDetachUiSelfTestPreview.current;
      const receipt = detachReceipt;
      const exactTerminal = preview !== null
        && receipt?.status === "PASS"
        && receipt.projectId === projectId
        && receipt.previousGeneration === preview.generation
        && receipt.generation === preview.nextGeneration
        && receipt.previousContentSha256 === preview.contentSha256
        && receipt.contentSha256 === preview.resultingContentSha256
        && receipt.assetId === selectedAssetId
        && receipt.assetSha256 === preview.assetSha256
        && receipt.targetRelativePath === preview.targetRelativePath
        && receipt.descriptorRemoved === true
        && receipt.assetTreeUnchanged === true
        && receipt.workspaceUnchanged === true
        && receipt.foreignStateUnchanged === true
        && receipt.backupPreservesPriorEnvelope === true
        && receipt.targetRemainsAbsent === true
        && receipt.authoritativeReload === true
        && receipt.previewSha256 === preview.previewSha256
        && receipt.directoryEntrySync === true
        && receipt.noFoundryWrite === true
        && recoveryInspection?.status === "PASS"
        && recoveryInspection.projectId === projectId
        && recoveryInspection.generation === receipt.generation
        && recoveryInspection.contentSha256 === receipt.contentSha256
        && recoveryInspection.primary.status === "VALID"
        && recoveryInspection.registeredAssets.length === 1
        && recoveryInspection.registeredAssets[0]?.assetId === preservedAssetId
        && recoveryInspection.registeredAssets[0]?.disposition === "PRESENT_VALID"
        && recoveryInspection.scenes.length === preview.resultingScenes.length
        && recoveryInspection.brokenSceneReferences.length === 0
        && !hasTargetProjectPendingArtifact(recoveryInspection, projectId)
        && recoveryInspection.noWrite === true
        && recoveryInspection.noFoundryWrite === true;
      if (!exactTerminal) { block("Asset detach did not satisfy the exact authoritative reread and committed session; no retry was attempted."); return; }
      projectAssetDetachUiSelfTestFinished.current = true;
      globalThis.document.title = `DiceBox Asset Detach UI Lifecycle PASS · ${projectId} · selected ${selectedAssetId} · preview→proposal→approval→applying→typed detach→authoritative reread→commit · preserved ${preservedAssetId} · no Foundry write`;
      void (async () => {
        await progress("pass", "authoritative-reread-commit");
        if (import.meta.env.VITE_DBX_PROJECT_SELF_TEST_EXIT === "1") await finishProjectSelfTest("PASS");
      })();
    }
  }, [applySelectedProjectAssetDetachProposal, approveSelectedProjectProposal, detachPreview, detachReceipt, finishProjectSelfTest, nativeProjectStoreAvailable, prepareAssetDetachUiLifecycleFixture, previewSelectedProjectAssetDetach, projectBusy, projectError, projectProposalSession, projectProposalSessionError, recoveryInspection, selectedRecoveryAssetId]);

  useEffect(() => {
    const mode = import.meta.env.VITE_DBX_PROJECT_SELF_TEST;
    if ((mode !== "broken-reference-detach-ui-execute" && mode !== "broken-reference-detach-ui-v3-execute" && mode !== "broken-reference-detach-ui-v4-execute") || projectBrokenReferenceUiSelfTestFinished.current) return;
    const useV4SelfTest = mode === "broken-reference-detach-ui-v4-execute";
    const useV3SelfTest = mode === "broken-reference-detach-ui-v3-execute";
    const projectId = useV4SelfTest
      ? DESKTOP_BROKEN_REFERENCE_UI_SELF_TEST_V4_PROJECT_ID
      : useV3SelfTest
        ? DESKTOP_BROKEN_REFERENCE_UI_SELF_TEST_V3_PROJECT_ID
        : DESKTOP_BROKEN_REFERENCE_UI_SELF_TEST_PROJECT_ID;
    const selfTestScope: DesktopProjectProposalSessionScope = useV4SelfTest
      ? DESKTOP_BROKEN_REFERENCE_UI_SELF_TEST_V4_SCOPE
      : useV3SelfTest
        ? DESKTOP_BROKEN_REFERENCE_UI_SELF_TEST_V3_SCOPE
        : "broken-reference-ui-self-test";
    const prepareSelfTestFixture = useV4SelfTest
      ? prepareBrokenReferenceUiLifecycleFixtureV4
      : useV3SelfTest
        ? prepareBrokenReferenceUiLifecycleFixtureV3
        : prepareBrokenReferenceUiLifecycleFixture;
    const loadSelfTestProposalSession = useV4SelfTest
      ? loadDesktopBrokenReferenceUiV4SelfTestProposalSession
      : useV3SelfTest
        ? loadDesktopBrokenReferenceUiV3SelfTestProposalSession
        : loadDesktopBrokenReferenceUiSelfTestProposalSession;
    const progress = (stage: "loaded" | "previewed" | "approved" | "applied" | "pass" | "blocked", detail: string) => recordProjectUiSelfTestProgress(stage, `broken-reference-ui-lifecycle:${detail}`);
    const block = (reason: string) => {
      projectBrokenReferenceUiSelfTestFinished.current = true;
      globalThis.document.title = `DiceBox Broken Reference UI Lifecycle BLOCKED · ${reason}`;
      void (async () => {
        await progress("blocked", reason.slice(0, 256)).catch(() => undefined);
        if (import.meta.env.VITE_DBX_PROJECT_SELF_TEST_EXIT === "1") await finishProjectSelfTest("BLOCKED");
      })();
    };
    if (!nativeProjectStoreAvailable) { block("native project-store IPC is unavailable"); return; }
    if (projectProposalSessionError || projectError) { block(projectProposalSessionError ?? projectError ?? "unknown error"); return; }
    if (projectBusy) return;
    const exactCommand = projectProposalSession?.batch.commands[0];
    const exactSession = projectProposalSession?.projectId === projectId && exactCommand?.kind === "project.broken-reference.detach";
    if (projectBrokenReferenceUiSelfTestStage.current === "idle") {
      projectBrokenReferenceUiSelfTestOwnership.current = null;
      projectBrokenReferenceUiSelfTestExpectedBatch.current = null;
      projectBrokenReferenceUiSelfTestOwnershipToken.current = null;
      projectBrokenReferenceUiSelfTestStage.current = "loaded";
      void (async () => {
        const fixture = await prepareSelfTestFixture();
        const inspection = await inspectProjectRecovery(projectId);
        const selected = inspection.brokenSceneReferences[0];
        const stored = await loadSelfTestProposalSession(browserDesktopProjectProposalSessionStorage());
        const sessionPreflight = summarizeDesktopProjectProposalSessionLoad(stored);
        if (!selected) throw new Error(`Exact broken-reference UI lifecycle fixture did not expose one selected reference; session-preflight=${sessionPreflight}; no session was replaced.`);
        const currentPreview = await previewBrokenReferenceDetach(selected, projectId);
        const expectedBatch = await createProjectRecoveryProposalBatch({
          batchId: "dbx:proposal:desktop-broken-reference-ui-ownership-preflight",
          preview: currentPreview,
          createdAt: "2026-08-29T00:00:00.000Z",
        });
        const ownership = classifyDesktopBrokenReferenceUiSessionOwnership(stored.status === "PASS" ? stored.session : null, expectedBatch, null);
        if (
          fixture.projectId !== projectId
          || fixture.sceneIds.length !== 2
          || inspection.status !== "BLOCKED"
          || inspection.generation !== undefined
          || inspection.primary.status !== "BLOCKED"
          || inspection.backup.status !== "MISSING"
          || inspection.scenes.length !== 0
          || inspection.registeredAssets.length !== 0
          || selected?.sceneId !== fixture.sceneIds[0]
          || selected?.assetId !== fixture.assetId
          || selected?.blockerCode !== "BACKGROUND_ASSET_ROLE_MISMATCH"
          || hasTargetProjectPendingArtifact(inspection, projectId)
          || inspection.noWrite !== true
          || inspection.noFoundryWrite !== true
         || sessionPreflight !== "MISSING"
         ) throw new Error(`Exact broken-reference UI lifecycle fixture, target-owned pending state, or clean session boundary was not available; session-preflight=${sessionPreflight}; ownership=${ownership.disposition}; exactProject=${ownership.exactProject}; exactProducer=${ownership.exactProducer}; exactCommand=${ownership.exactCommand}; exactBase=${ownership.exactBase}; exactFixture=${ownership.exactFixture}; exactAuthority=${ownership.exactAuthority}; exactBatchSemantics=${ownership.exactBatchSemantics}; exactIdentity=${ownership.exactIdentity}; ownershipToken=${ownership.ownershipToken}; previewed=${ownership.previewed}; no session was replaced.`);
        const ownershipToken = createDesktopBrokenReferenceUiOwnershipToken();
        projectBrokenReferenceUiSelfTestOwnershipToken.current = ownershipToken;
        await progress("loaded", `session-preflight:${sessionPreflight};fixture-reread`);
        setRecoveryInspection(inspection);
        setSelectedBrokenReferenceKey(`${selected.sceneId}:${selected.assetId}`);
      })().catch((error: unknown) => block(formatProjectStoreFailure(error)));
      return;
    }
    if (projectBrokenReferenceUiSelfTestStage.current === "loaded" && recoveryInspection?.projectId === projectId && selectedBrokenReference?.sceneId && selectedBrokenReference?.assetId) {
      projectBrokenReferenceUiSelfTestStage.current = "previewing";
      void previewSelectedBrokenReferenceDetach(projectBrokenReferenceUiSelfTestOwnershipToken.current, selfTestScope);
      return;
    }
    const ownership = projectBrokenReferenceUiSelfTestExpectedBatch.current !== null && projectBrokenReferenceUiSelfTestOwnership.current !== null
      ? classifyDesktopBrokenReferenceUiSessionOwnership(projectProposalSession, projectBrokenReferenceUiSelfTestExpectedBatch.current, projectBrokenReferenceUiSelfTestOwnership.current)
      : null;
    if (projectBrokenReferenceUiSelfTestStage.current === "previewing" && ownership?.disposition !== "TEST_OWNED_EXACT") {
      if (projectProposalSession?.history.status === "previewed") {
        block(`self-test proposal ownership was not exact; ownership=${ownership?.disposition ?? "UNPROVEN"}; exactProject=${ownership?.exactProject ?? false}; exactProducer=${ownership?.exactProducer ?? false}; exactCommand=${ownership?.exactCommand ?? false}; exactBase=${ownership?.exactBase ?? false}; exactFixture=${ownership?.exactFixture ?? false}; exactAuthority=${ownership?.exactAuthority ?? false}; exactBatchSemantics=${ownership?.exactBatchSemantics ?? false}; exactIdentity=${ownership?.exactIdentity ?? false}; ownershipToken=${ownership?.ownershipToken ?? false}; previewed=${ownership?.previewed ?? false}; no session was replaced.`);
      }
      return;
    }
    if (projectBrokenReferenceUiSelfTestStage.current === "previewing" && exactSession && ownership?.disposition === "TEST_OWNED_EXACT" && projectProposalSession?.history.status === "previewed" && brokenReferencePreview?.projectId === projectId && brokenReferencePreview.sceneId === selectedBrokenReference?.sceneId && brokenReferencePreview.assetId === selectedBrokenReference?.assetId && brokenReferencePreview.blockerCode === "BACKGROUND_ASSET_ROLE_MISMATCH" && brokenReferencePreview.requiresApproval === true && brokenReferencePreview.noWrite === true && brokenReferencePreview.noFoundryWrite === true) {
      projectBrokenReferenceUiSelfTestPreview.current = brokenReferencePreview;
      projectBrokenReferenceUiSelfTestStage.current = "approving";
      void (async () => {
        try {
          await progress("previewed", "recovery-proposal-session");
          const approved = await approveSelectedProjectProposal(projectProposalSession);
          if (approved === null) throw new Error("Broken-reference UI self-test approval handoff did not produce an approved session; no retry was attempted.");
        } catch (error) {
          block(formatProjectStoreFailure(error));
        }
      })();
      return;
    }
    if (projectBrokenReferenceUiSelfTestStage.current === "approving" && exactSession && projectProposalSession?.history.status === "approved") {
      projectBrokenReferenceUiSelfTestStage.current = "applying";
      void (async () => {
        try {
          await progress("approved", "reviewer-approval");
          await progress("applied", "typed-detach-apply");
          await applySelectedBrokenReferenceDetachProposal();
        } catch (error) {
          block(formatProjectStoreFailure(error));
        }
      })();
      return;
    }
    if (projectBrokenReferenceUiSelfTestStage.current === "applying" && exactSession && projectProposalSession?.history.status === "committed") {
      const preview = projectBrokenReferenceUiSelfTestPreview.current;
      const receipt = brokenReferenceReceipt;
      const exactTerminal = preview !== null
        && receipt?.status === "PASS"
        && receipt.projectId === projectId
        && receipt.previousGeneration === preview.generation
        && receipt.generation === preview.nextGeneration
        && receipt.previousContentSha256 === preview.contentSha256
        && receipt.contentSha256 === preview.resultingContentSha256
        && receipt.sceneId === preview.sceneId
        && receipt.assetId === preview.assetId
        && receipt.blockerCode === preview.blockerCode
        && receipt.assetDescriptorPreserved === true
        && receipt.assetTreeUnchanged === true
        && receipt.workspaceUnchanged === true
        && receipt.foreignStateUnchanged === true
        && receipt.backupPreservesPriorEnvelope === true
        && receipt.targetBindingAbsent === true
        && receipt.unrelatedReferencesUnchanged === true
        && receipt.authoritativeInspection === true
        && receipt.residualBrokenReferenceCount === 0
        && receipt.previewSha256 === preview.previewSha256
        && receipt.directoryEntrySync === true
        && receipt.noFoundryWrite === true
        && recoveryInspection !== null
        && recoveryInspection.projectId === projectId
        && recoveryInspection.generation === receipt.generation
        && recoveryInspection.contentSha256 === receipt.contentSha256
        && recoveryInspection.registeredAssets.length === 1
        && recoveryInspection.registeredAssets[0]?.assetId === preview.assetId
        && recoveryInspection.registeredAssets[0]?.disposition === "PRESENT_VALID"
        && recoveryInspection.registeredAssets[0]?.role === "handout"
        && isBrokenReferenceUiTerminalInspection(recoveryInspection, projectId)
        && recoveryInspection.noWrite === true
        && recoveryInspection.noFoundryWrite === true;
      if (!exactTerminal) { block("Broken-reference detach did not satisfy the exact authoritative reread and committed session; no retry was attempted."); return; }
      projectBrokenReferenceUiSelfTestFinished.current = true;
      globalThis.document.title = `DiceBox Broken Reference UI Lifecycle PASS · ${projectId} · preview→proposal→approval→applying→typed detach→authoritative reread→commit · handout preserved · no Foundry write`;
      void (async () => {
        await progress("pass", "authoritative-reread-commit");
        if (import.meta.env.VITE_DBX_PROJECT_SELF_TEST_EXIT === "1") await finishProjectSelfTest("PASS");
      })();
    }
  }, [applySelectedBrokenReferenceDetachProposal, approveSelectedProjectProposal, brokenReferencePreview, brokenReferenceReceipt, finishProjectSelfTest, formatProjectStoreFailure, loadDesktopBrokenReferenceUiSelfTestProposalSession, loadDesktopBrokenReferenceUiV3SelfTestProposalSession, loadDesktopBrokenReferenceUiV4SelfTestProposalSession, nativeProjectStoreAvailable, prepareBrokenReferenceUiLifecycleFixture, prepareBrokenReferenceUiLifecycleFixtureV3, prepareBrokenReferenceUiLifecycleFixtureV4, previewSelectedBrokenReferenceDetach, projectBusy, projectError, projectProposalSession, projectProposalSessionError, recoveryInspection, selectedBrokenReference]);

  useEffect(() => {
    const mode = import.meta.env.VITE_DBX_PROJECT_SELF_TEST;
    if (mode !== "asset-restore-ui-reread" || projectAssetRestoreUiSelfTestFinished.current) return;
    const projectId = "dbx:project:desktop-asset-restore-trace-self-test";
    const progress = (stage: "loaded" | "pass" | "blocked", detail: string) => recordProjectUiSelfTestProgress(stage, `asset-restore-post-reread:${detail}`);
    const block = (reason: string) => { projectAssetRestoreUiSelfTestFinished.current = true; globalThis.document.title = `DiceBox Asset Restore Post-Reread BLOCKED · ${reason}`; void (async () => { await progress("blocked", reason.slice(0, 256)).catch(() => undefined); if (import.meta.env.VITE_DBX_PROJECT_SELF_TEST_EXIT === "1") await finishProjectSelfTest("BLOCKED"); })(); };
    if (!nativeProjectStoreAvailable) { block("native project-store IPC is unavailable"); return; }
    void (async () => {
      const inspection = await inspectProjectRecovery(projectId);
      const selectedRestored = inspection.registeredAssets.find((asset) => asset.assetId === ASSET_RESTORE_TRACE_WEBP_ASSET_ID);
      const unselectedPreserved = inspection.registeredAssets.find((asset) => asset.assetId === ASSET_RESTORE_TRACE_PNG_ASSET_ID);
      const remainingEligible = inspection.registeredAssets.filter((asset) => asset.restoreEligible);
      const exactPostRestoreTopology = inspection.status === "BLOCKED"
        && inspection.blockerCode === "REGISTERED_ASSET_BLOB_MISSING"
        && inspection.noWrite === true
        && inspection.noFoundryWrite === true
        && selectedRestored?.disposition === "PRESENT_VALID"
        && selectedRestored.restoreEligible === false
        && unselectedPreserved?.disposition === "MISSING"
        && unselectedPreserved.restoreEligible === true
        && remainingEligible.length === 1
        && remainingEligible[0]?.assetId === ASSET_RESTORE_TRACE_PNG_ASSET_ID;
      if (!exactPostRestoreTopology) throw new Error("Asset restore post-reread did not satisfy the exact selected-restored/unselected-preserved topology.");
      await progress("loaded", "exact-post-restore-inspection");
      projectAssetRestoreUiSelfTestFinished.current = true;
      globalThis.document.title = `DiceBox Asset Restore Post-Reread PASS · ${projectId} · selected/restored and unselected/preserved · no Foundry write`;
      await progress("pass", "authoritative-post-restore-reread");
      if (import.meta.env.VITE_DBX_PROJECT_SELF_TEST_EXIT === "1") await finishProjectSelfTest("PASS");
      })().catch((error: unknown) => block(error instanceof Error ? error.message : String(error)));
  }, [finishProjectSelfTest, nativeProjectStoreAvailable]);

  useEffect(() => {
    const mode = import.meta.env.VITE_DBX_PROJECT_SELF_TEST;
    const recognizedMode = ["save", "load", "workspace", "workspace-reread", "workspace-acceptance", "workspace-acceptance-reread", "close-reopen", "close-reopen-reread", "handout-asset", "handout-asset-reread", "audio-asset", "audio-asset-reread", "token-asset", "token-asset-reread", "backup-promotion-setup", "backup-promotion-preview", "backup-promotion", "backup-promotion-reread", "pending-inspection-setup", "pending-inspection-reread", "selected-recovery-setup", "selected-recovery", "selected-recovery-reread", "dangling-reference-setup", "dangling-reference-reread", "broken-reference-detach-setup", "broken-reference-detach-reread", "migration-persist-setup", "migration-persist-reread", "multiscene", "multiscene-reread", "asset", "asset-reread", "recovery", "migration", "detach-setup", "detach", "detach-reread", "lease-attempt", "lease-retry", "rename-execute", "rename-ui-execute", "save-execute", "create-execute", "save-as-execute", "asset-bind-execute", "add-scene-execute", "persistent-add-scene-execute", "handout-register-execute", "audio-register-execute", "token-register-execute"].includes(mode);
    if (projectSelfTestStarted.current || !recognizedMode) return;
    if (!nativeProjectStoreAvailable) {
      globalThis.document.title = `DiceBox Project Self-Test BLOCKED · ${mode} requires native project-store IPC`;
      return;
    }
    projectSelfTestStarted.current = true;
    const run = async () => {
      if (mode === "add-scene-execute") {
        const projectId = import.meta.env.VITE_DBX_PROJECT_SELF_TEST_ID ?? "dbx:project:desktop-add-scene-self-test";
        if (!projectId.startsWith("dbx:project:desktop-")) throw new Error("Project add-Scene self-test requires an explicitly test-owned project ID.");
        const first = createBlankProjectScene(projectId);
        const second = createBlankProjectScene(projectId, 2);
        const state = { projectId, scenes: [first, second], activeSceneId: first.id } as const;
        const preview = await createProjectAddScenePreview(state);
        const batch = await createProjectAddSceneProposalBatch({
          batchId: `dbx:proposal:desktop-project-add-scene-${projectId.replace(/[^a-z0-9._-]/gi, "-").toLowerCase()}-${Date.now()}`,
          preview,
          createdAt: new Date().toISOString(),
        });
        const history = await previewProposalBatch(batch, desktopProposalRequester, new Date().toISOString());
        const session = await createDesktopProjectAddSceneProposalSession({ projectId, batch, history });
        const approved = await approveDesktopProjectProposalSession(session, desktopProposalReviewer, batch.base, new Date().toISOString());
        const receipt = await executeProjectAddScene({ session: approved, store: inMemoryProjectAddSceneStore(state), executor: { actorId: "desktop-user", role: "system" }, observedAt: new Date().toISOString() });
        if (receipt.before.sceneCount !== 2 || receipt.afterApply.sceneCount !== 3 || receipt.afterApply.activeSceneId !== receipt.addedSceneId || receipt.afterUndo.sceneCount !== 2 || receipt.afterUndo.activeSceneId !== first.id || receipt.afterUndo.scenesSha256 !== receipt.before.scenesSha256 || receipt.history.status !== "undone" || receipt.history.receipts.length !== 5 || receipt.projectContentWrite !== false || receipt.projectPersistenceWrite !== false || receipt.noFoundryWrite !== true) {
          throw new Error("In-memory add-Scene execution did not satisfy exact apply/reread/inverse-undo acceptance checks.");
        }
        globalThis.document.title = `DiceBox In-Memory Add Scene Execute PASS · ${projectId} · ${receipt.before.sceneCount} → ${receipt.afterApply.sceneCount} → ${receipt.afterUndo.sceneCount} Scenes · active ${receipt.addedSceneId} restored to ${receipt.afterUndo.activeSceneId} · history ${receipt.history.receipts.length} · no project persistence · no Foundry write`;
        if (import.meta.env.VITE_DBX_PROJECT_SELF_TEST_EXIT === "1") await finishProjectSelfTest("PASS");
        return;
      }
      if (mode === "persistent-add-scene-execute") {
        const projectId = import.meta.env.VITE_DBX_PROJECT_SELF_TEST_ID ?? "dbx:project:desktop-persistent-add-scene-execute-self-test-v2";
        if (!projectId.startsWith("dbx:project:desktop-")) throw new Error("Persistent add-Scene self-test requires an explicitly test-owned project ID.");
        const initialCatalog = await listProjectBundles();
        if (initialCatalog.entries.some((entry) => entry.projectId === projectId)) throw new Error("Persistent add-Scene self-test requires a fresh exact target; it will not overwrite an existing project.");
        const first = createBlankProjectScene(projectId);
        const second = createBlankProjectScene(projectId, 2);
        const third = createBlankProjectScene(projectId, 3);
        const created = await createProjectBundle(projectId, [first, second], first.id, "M351 Persistent Add Scene", initialCatalog.workspaceIndexGeneration);
        if (created.generation !== 1 || created.assetCount !== 0 || created.sceneCount !== 2 || created.activeSceneId !== first.id) throw new Error("Persistent add-Scene self-test did not create its exact two-Scene zero-asset fixture.");
        const baseline = await saveProjectBundle(projectId, [first, second], first.id, created.generation);
        const observedAt = new Date().toISOString();
        const preview = await createProjectPersistentAddScenePreview({ projectId, currentGeneration: baseline.generation, currentContentSha256: baseline.contentSha256, scenes: [first, second], activeSceneId: first.id });
        const batch = await createProjectPersistentAddSceneProposalBatch({ batchId: `dbx:proposal:desktop-project-persistent-add-scene-${projectId.replace(/[^a-z0-9._-]/gi, "-").toLowerCase()}-${Date.now()}`, preview, createdAt: observedAt });
        const history = await previewProposalBatch(batch, desktopProposalRequester, observedAt);
        const session = await createDesktopProjectProposalSession({ projectId, batch, history });
        const approved = await approveDesktopProjectProposalSession(session, desktopProposalReviewer, batch.base, new Date().toISOString());
        const receipt = await executeApprovedProjectPersistentAddScene({ session: approved, content: { scenes: [first, second, third], activeSceneId: third.id }, inverseContent: { scenes: [first, second], activeSceneId: first.id }, executor: desktopProposalReviewer });
        const response = await loadProjectBundle(projectId);
        const inspection = await inspectProjectRecovery(projectId);
        if (receipt.before.projectId !== projectId || receipt.before.generation !== baseline.generation || receipt.afterApply.generation !== baseline.generation + 1 || receipt.afterUndo.generation !== baseline.generation + 2 || receipt.before.sceneCount !== 2 || receipt.afterApply.sceneCount !== 3 || receipt.afterApply.activeSceneId !== third.id || receipt.afterUndo.sceneCount !== 2 || receipt.afterUndo.activeSceneId !== first.id || receipt.afterUndo.scenesSha256 !== receipt.before.scenesSha256 || receipt.afterApply.assetCollectionSha256 !== receipt.before.assetCollectionSha256 || receipt.afterUndo.assetCollectionSha256 !== receipt.before.assetCollectionSha256 || receipt.history.status !== "undone" || receipt.history.receipts.length !== 5 || receipt.projectContentWrite !== true || receipt.projectPersistenceWrite !== true || receipt.sceneContentRestored !== true || receipt.assetsPreserved !== true || response.receipt.generation !== baseline.generation + 2 || response.receipt.sceneCount !== 2 || response.receipt.assetCount !== 0 || inspection.status !== "PASS" || !inspection.noWrite || !inspection.noFoundryWrite) throw new Error("Persistent add-Scene execution did not satisfy exact apply/reread/inverse-restore or asset-preservation checks.");
        globalThis.document.title = `DiceBox Persistent Add Scene Execute PASS · ${projectId} · generations ${receipt.before.generation} → ${receipt.afterApply.generation} → ${receipt.afterUndo.generation} · Scenes ${receipt.before.sceneCount} → ${receipt.afterApply.sceneCount} → ${receipt.afterUndo.sceneCount} · active restored · assets preserved · history ${receipt.history.receipts.length} · no Foundry write`;
        if (import.meta.env.VITE_DBX_PROJECT_SELF_TEST_EXIT === "1") await finishProjectSelfTest("PASS");
        return;
      }
      if (mode === "save-as-execute") {
        const sourceProjectId = import.meta.env.VITE_DBX_PROJECT_SELF_TEST_SOURCE_ID ?? "dbx:project:desktop-save-as-source-self-test-v2";
        const targetProjectId = import.meta.env.VITE_DBX_PROJECT_SELF_TEST_ID ?? "dbx:project:desktop-save-as-target-self-test-v2";
        if (!sourceProjectId.startsWith("dbx:project:desktop-") || !targetProjectId.startsWith("dbx:project:desktop-") || sourceProjectId === targetProjectId) throw new Error("Project save-as self-test requires distinct explicitly test-owned source and target IDs.");
        const initialCatalog = await listProjectBundles();
        if (initialCatalog.entries.some((entry) => entry.projectId === targetProjectId)) throw new Error("Project save-as self-test requires a fresh absent target; it will not overwrite or clean up an existing project.");
        const sourceFirst = createBlankProjectScene(sourceProjectId);
        const sourceSecond = createBlankProjectScene(sourceProjectId, 2);
        const sourceEntry = initialCatalog.entries.find((entry) => entry.projectId === sourceProjectId);
        let sourceScenes: readonly SceneDocument[];
        let sourceActiveSceneId: string;
        let sourceGeneration: number;
        let sourceContentSha256: string;
        let workspaceIndexGeneration: number;
        if (sourceEntry) {
          if (sourceEntry.status !== "PASS" || sourceEntry.generation !== 2 || sourceEntry.assetCount !== 0 || sourceEntry.sceneCount !== 2) throw new Error("Project save-as self-test found an existing source outside its exact healthy generation-2 zero-asset two-Scene fixture; it will not overwrite it.");
          const source = await loadProjectBundle(sourceProjectId);
          sourceScenes = source.scenesJson.map(parseStoredScene);
          sourceActiveSceneId = source.activeSceneId;
          sourceGeneration = source.receipt.generation;
          sourceContentSha256 = source.receipt.contentSha256;
          workspaceIndexGeneration = initialCatalog.workspaceIndexGeneration;
        } else {
          const created = await createProjectBundle(sourceProjectId, [sourceFirst, sourceSecond], sourceSecond.id, "M353 Save-As Source", initialCatalog.workspaceIndexGeneration);
          if (created.generation !== 1 || created.sceneCount !== 2 || created.assetCount !== 0) throw new Error("Project save-as self-test did not create the exact source fixture.");
          const baseline = await saveProjectBundle(sourceProjectId, [sourceFirst, sourceSecond], sourceSecond.id, created.generation);
          sourceScenes = [sourceFirst, sourceSecond];
          sourceActiveSceneId = sourceSecond.id;
          sourceGeneration = baseline.generation;
          sourceContentSha256 = baseline.contentSha256;
          workspaceIndexGeneration = initialCatalog.workspaceIndexGeneration + 1;
        }
        const proposedDisplayName = "M353 Save-As Copy";
        const sourceAssetState = await loadProjectBundle(sourceProjectId);
        const sourceAssetCollectionSha256 = await hashProjectSaveAsAssetCollection(sourceAssetState.assets);
        const observedAt = new Date().toISOString();
        const preview = await createProjectSaveAsPreview({ sourceProjectId, targetProjectId, sourceGeneration, sourceContentSha256, sourceAssetCount: sourceAssetState.assets.length, sourceAssetCollectionSha256, workspaceIndexGeneration, scenes: sourceScenes, activeSceneId: sourceActiveSceneId, proposedDisplayName });
        const batch = await createProjectSaveAsProposalBatch({ batchId: `dbx:proposal:desktop-project-save-as-${targetProjectId.replace(/[^a-z0-9._-]/gi, "-").toLowerCase()}-${Date.now()}`, preview, createdAt: observedAt });
        const history = await previewProposalBatch(batch, desktopProposalRequester, observedAt);
        const session = await createDesktopProjectProposalSession({ projectId: sourceProjectId, batch, history });
        const approved = await approveDesktopProjectProposalSession(session, desktopProposalReviewer, batch.base, new Date().toISOString());
        const receipt = await executeApprovedProjectSaveAs({ session: approved, content: { scenes: sourceScenes, activeSceneId: sourceActiveSceneId }, executor: desktopProposalReviewer });
        const target = await loadProjectBundle(targetProjectId);
        if (receipt.before.source.projectId !== sourceProjectId || receipt.before.targetAbsent !== true || receipt.afterApply.target?.projectId !== targetProjectId || receipt.afterApply.target?.sceneCount !== 2 || receipt.afterApply.target?.activeSceneId !== sourceActiveSceneId || receipt.afterApply.target?.catalogEntry.displayName !== proposedDisplayName || receipt.afterApply.source.generation !== sourceGeneration || receipt.afterApply.source.contentSha256 !== sourceContentSha256 || receipt.afterApply.source.sceneIds.join("|") !== sourceScenes.map((scene) => scene.id).join("|") || receipt.saveAs.generation !== 1 || receipt.saveAs.workspaceMetadata?.displayName !== proposedDisplayName || receipt.history.status !== "committed" || receipt.history.receipts.length !== 4 || receipt.projectContentWrite !== true || receipt.projectPersistenceWrite !== true || receipt.sourcePreserved !== true || receipt.targetCreated !== true || target.receipt.projectId !== targetProjectId || target.receipt.sceneCount !== 2 || target.receipt.assetCount !== 0 || !receipt.noFoundryWrite) throw new Error("Project save-as execution did not satisfy exact source-preservation, absent-target, target-reread, workspace, and approval-history checks.");
        globalThis.document.title = `DiceBox Project Save-As Execute PASS · ${sourceProjectId} → ${targetProjectId} · source preserved · target generation ${receipt.saveAs.generation} · history ${receipt.history.receipts.length} · no Foundry write`;
        if (import.meta.env.VITE_DBX_PROJECT_SELF_TEST_EXIT === "1") await finishProjectSelfTest("PASS");
        return;
      }
      if (mode === "handout-register-execute") {
        const projectId = import.meta.env.VITE_DBX_PROJECT_SELF_TEST_ID ?? "dbx:project:desktop-handout-register-execute-self-test";
        if (!projectId.startsWith("dbx:project:desktop-")) throw new Error("Project handout registration self-test requires an explicitly test-owned project ID.");
        const initialCatalog = await listProjectBundles();
        const existing = initialCatalog.entries.find((entry) => entry.projectId === projectId);
        let scene: SceneDocument;
        let baseline: ProjectSaveReceipt;
        if (existing) {
          if (existing.status !== "PASS" || existing.generation !== 1 || existing.assetCount !== 0) throw new Error("Project handout registration self-test found an existing target outside its exact recoverable fixture state; it will not overwrite it.");
          const loaded = await loadProjectBundle(projectId);
          scene = parseStoredScene(loaded.scenesJson[0]!);
          baseline = await saveProjectBundle(projectId, [scene], scene.id, loaded.receipt.generation);
        } else {
          scene = createBlankProjectScene(projectId);
          const created = await createProjectBundle(projectId, [scene], scene.id, "M345 Handout Registration", initialCatalog.workspaceIndexGeneration);
          baseline = await saveProjectBundle(projectId, [scene], scene.id, created.generation);
        }
        const content = { scenes: [scene], activeSceneId: scene.id, candidate: { mediaType: "image/png" as const, bytes: FOUNDATION_SELF_TEST_PNG_BYTES, label: "M345 handout.png", provenance: "user-import" as const } };
        const preview = await createProjectHandoutAssetRegistrationPreview({ projectId, currentGeneration: baseline.generation, currentContentSha256: baseline.contentSha256, candidate: content.candidate, proposedSceneCount: 1, proposedActiveSceneId: scene.id, proposedAssetCount: 1 });
        const batch = await createProjectHandoutAssetRegistrationProposalBatch({ batchId: `dbx:proposal:desktop-project-handout-register-${projectId.replace(/[^a-z0-9._-]/gi, "-").toLowerCase()}-${Date.now()}`, preview, createdAt: new Date().toISOString() });
        const history = await previewProposalBatch(batch, desktopProposalRequester, new Date().toISOString());
        const session = await createDesktopProjectProposalSession({ projectId, batch, history });
        const approved = await approveDesktopProjectProposalSession(session, desktopProposalReviewer, batch.base, new Date().toISOString());
        const receipt = await executeApprovedProjectHandoutAssetRegistration({ session: approved, content, inverseContent: content, executor: desktopProposalReviewer });
        const response = await loadProjectBundle(projectId);
        const inspection = await inspectProjectRecovery(projectId);
        const handout = response.assets.find((asset) => asset.registration?.assetId === receipt.asset.assetId);
        if (receipt.before.generation !== baseline.generation || receipt.before.assetCount !== 0 || receipt.afterApply.generation !== baseline.generation + 1 || receipt.afterApply.assetCount !== 1 || receipt.afterApply.sceneContentSha256 !== receipt.before.sceneContentSha256 || receipt.afterUndo.generation !== baseline.generation + 2 || receipt.afterUndo.assetCount !== 1 || receipt.afterUndo.sceneContentSha256 !== receipt.before.sceneContentSha256 || receipt.afterUndo.assets.find((asset) => asset.registration?.assetId === receipt.asset.assetId)?.registration?.role !== "handout" || receipt.history.status !== "undone" || receipt.history.receipts.length !== 5 || receipt.projectContentWrite !== true || receipt.assetBytesPersisted !== true || receipt.assetTreePreserved !== true || receipt.sceneContentRestored !== true || response.receipt.generation !== baseline.generation + 2 || response.receipt.assetCount !== 1 || handout?.registration?.role !== "handout" || inspection.status !== "PASS" || inspection.registeredAssets.length !== 1 || inspection.registeredAssets[0]?.assetId !== receipt.asset.assetId || inspection.registeredAssets[0]?.role !== "handout" || inspection.registeredAssets[0]?.disposition !== "PRESENT_VALID" || !inspection.noWrite || !inspection.noFoundryWrite) throw new Error("PNG handout registration did not satisfy exact apply/reread/Scene-restore and additive asset-preservation checks.");
        globalThis.document.title = `DiceBox PNG Handout Registration Execute PASS · ${projectId} · generations ${receipt.before.generation} → ${receipt.afterApply.generation} → ${receipt.afterUndo.generation} · ${receipt.asset.assetId} · Scene content restored · asset preserved · history ${receipt.history.receipts.length} · no Foundry write`;
        if (import.meta.env.VITE_DBX_PROJECT_SELF_TEST_EXIT === "1") await finishProjectSelfTest("PASS");
        return;
      }
      if (mode === "audio-register-execute") {
        const projectId = import.meta.env.VITE_DBX_PROJECT_SELF_TEST_ID ?? "dbx:project:desktop-audio-register-execute-self-test";
        if (!projectId.startsWith("dbx:project:desktop-")) throw new Error("Project audio registration self-test requires an explicitly test-owned project ID.");
        const initialCatalog = await listProjectBundles();
        const existing = initialCatalog.entries.find((entry) => entry.projectId === projectId);
        let scene: SceneDocument;
        let baseline: ProjectSaveReceipt;
        if (existing) {
          if (existing.status !== "PASS" || existing.generation !== 1 || existing.assetCount !== 0) throw new Error("Project audio registration self-test found an existing target outside its exact recoverable fixture state; it will not overwrite it.");
          const loaded = await loadProjectBundle(projectId);
          scene = parseStoredScene(loaded.scenesJson[0]!);
          baseline = await saveProjectBundle(projectId, [scene], scene.id, loaded.receipt.generation);
        } else {
          scene = createBlankProjectScene(projectId);
          const created = await createProjectBundle(projectId, [scene], scene.id, "M347 Audio Registration", initialCatalog.workspaceIndexGeneration);
          baseline = await saveProjectBundle(projectId, [scene], scene.id, created.generation);
        }
        const content = { scenes: [scene], activeSceneId: scene.id, candidate: { mediaType: "audio/wav" as const, bytes: AUDIO_ASSET_ROLE_SELF_TEST_WAV_BYTES, label: "M347 audio.wav", provenance: "user-import" as const } };
        const preview = await createProjectAudioAssetRegistrationPreview({ projectId, currentGeneration: baseline.generation, currentContentSha256: baseline.contentSha256, candidate: content.candidate, proposedSceneCount: 1, proposedActiveSceneId: scene.id, proposedAssetCount: 1 });
        const batch = await createProjectAudioAssetRegistrationProposalBatch({ batchId: `dbx:proposal:desktop-project-audio-register-${projectId.replace(/[^a-z0-9._-]/gi, "-").toLowerCase()}-${Date.now()}`, preview, createdAt: new Date().toISOString() });
        const history = await previewProposalBatch(batch, desktopProposalRequester, new Date().toISOString());
        const session = await createDesktopProjectProposalSession({ projectId, batch, history });
        const approved = await approveDesktopProjectProposalSession(session, desktopProposalReviewer, batch.base, new Date().toISOString());
        const receipt = await executeApprovedProjectAudioAssetRegistration({ session: approved, content, inverseContent: content, executor: desktopProposalReviewer });
        const response = await loadProjectBundle(projectId);
        const inspection = await inspectProjectRecovery(projectId);
        const audio = response.assets.find((asset) => asset.registration?.assetId === receipt.asset.assetId);
        if (receipt.before.generation !== baseline.generation || receipt.before.assetCount !== 0 || receipt.afterApply.generation !== baseline.generation + 1 || receipt.afterApply.assetCount !== 1 || receipt.afterApply.sceneContentSha256 !== receipt.before.sceneContentSha256 || receipt.afterUndo.generation !== baseline.generation + 2 || receipt.afterUndo.assetCount !== 1 || receipt.afterUndo.sceneContentSha256 !== receipt.before.sceneContentSha256 || receipt.afterUndo.assets.find((asset) => asset.registration?.assetId === receipt.asset.assetId)?.registration?.role !== "audio" || receipt.afterUndo.assets.find((asset) => asset.registration?.assetId === receipt.asset.assetId)?.mediaType !== "audio/wav" || receipt.history.status !== "undone" || receipt.history.receipts.length !== 5 || receipt.projectContentWrite !== true || receipt.assetBytesPersisted !== true || receipt.assetTreePreserved !== true || receipt.sceneContentRestored !== true || response.receipt.generation !== baseline.generation + 2 || response.receipt.assetCount !== 1 || audio?.registration?.role !== "audio" || audio?.mediaType !== "audio/wav" || audio?.byteLength !== AUDIO_ASSET_ROLE_SELF_TEST_WAV_BYTES.length || inspection.status !== "PASS" || inspection.registeredAssets.length !== 1 || inspection.registeredAssets[0]?.assetId !== receipt.asset.assetId || inspection.registeredAssets[0]?.role !== "audio" || inspection.registeredAssets[0]?.mediaType !== "audio/wav" || inspection.registeredAssets[0]?.disposition !== "PRESENT_VALID" || !inspection.noWrite || !inspection.noFoundryWrite) throw new Error("WAV audio registration did not satisfy exact apply/reread/Scene-restore and additive asset-preservation checks.");
        globalThis.document.title = `DiceBox WAV Audio Registration Execute PASS · ${projectId} · generations ${receipt.before.generation} → ${receipt.afterApply.generation} → ${receipt.afterUndo.generation} · ${receipt.asset.assetId} · Scene content restored · audio asset preserved · history ${receipt.history.receipts.length} · no Foundry write`;
        if (import.meta.env.VITE_DBX_PROJECT_SELF_TEST_EXIT === "1") await finishProjectSelfTest("PASS");
        return;
      }
      if (mode === "token-register-execute") {
        const projectId = import.meta.env.VITE_DBX_PROJECT_SELF_TEST_ID ?? "dbx:project:desktop-token-register-execute-self-test";
        if (!projectId.startsWith("dbx:project:desktop-")) throw new Error("Project token registration self-test requires an explicitly test-owned project ID.");
        const initialCatalog = await listProjectBundles();
        const existing = initialCatalog.entries.find((entry) => entry.projectId === projectId);
        let scene: SceneDocument;
        let baseline: ProjectSaveReceipt;
        if (existing) {
          if (existing.status !== "PASS" || existing.generation !== 1 || existing.assetCount !== 0) throw new Error("Project token registration self-test found an existing target outside its exact recoverable fixture state; it will not overwrite it.");
          const loaded = await loadProjectBundle(projectId);
          scene = parseStoredScene(loaded.scenesJson[0]!);
          baseline = await saveProjectBundle(projectId, [scene], scene.id, loaded.receipt.generation);
        } else {
          scene = createBlankProjectScene(projectId);
          const created = await createProjectBundle(projectId, [scene], scene.id, "M349 Token Registration", initialCatalog.workspaceIndexGeneration);
          baseline = await saveProjectBundle(projectId, [scene], scene.id, created.generation);
        }
        const content = { scenes: [scene], activeSceneId: scene.id, candidate: { mediaType: "image/png" as const, bytes: FOUNDATION_SELF_TEST_PNG_BYTES, label: "M349 token.png", provenance: "user-import" as const } };
        const preview = await createProjectTokenAssetRegistrationPreview({ projectId, currentGeneration: baseline.generation, currentContentSha256: baseline.contentSha256, candidate: content.candidate, proposedSceneCount: 1, proposedActiveSceneId: scene.id, proposedAssetCount: 1 });
        const batch = await createProjectTokenAssetRegistrationProposalBatch({ batchId: `dbx:proposal:desktop-project-token-register-${projectId.replace(/[^a-z0-9._-]/gi, "-").toLowerCase()}-${Date.now()}`, preview, createdAt: new Date().toISOString() });
        const history = await previewProposalBatch(batch, desktopProposalRequester, new Date().toISOString());
        const session = await createDesktopProjectProposalSession({ projectId, batch, history });
        const approved = await approveDesktopProjectProposalSession(session, desktopProposalReviewer, batch.base, new Date().toISOString());
        const receipt = await executeApprovedProjectTokenAssetRegistration({ session: approved, content, inverseContent: content, executor: desktopProposalReviewer });
        const response = await loadProjectBundle(projectId);
        const inspection = await inspectProjectRecovery(projectId);
        const token = response.assets.find((asset) => asset.registration?.assetId === receipt.asset.assetId);
        if (receipt.before.generation !== baseline.generation || receipt.before.assetCount !== 0 || receipt.afterApply.generation !== baseline.generation + 1 || receipt.afterApply.assetCount !== 1 || receipt.afterApply.sceneContentSha256 !== receipt.before.sceneContentSha256 || receipt.afterUndo.generation !== baseline.generation + 2 || receipt.afterUndo.assetCount !== 1 || receipt.afterUndo.sceneContentSha256 !== receipt.before.sceneContentSha256 || receipt.afterUndo.assets.find((asset) => asset.registration?.assetId === receipt.asset.assetId)?.registration?.role !== "token" || receipt.history.status !== "undone" || receipt.history.receipts.length !== 5 || receipt.projectContentWrite !== true || receipt.assetBytesPersisted !== true || receipt.assetTreePreserved !== true || receipt.sceneContentRestored !== true || response.receipt.generation !== baseline.generation + 2 || response.receipt.assetCount !== 1 || token?.registration?.role !== "token" || token?.mediaType !== "image/png" || token?.byteLength !== FOUNDATION_SELF_TEST_PNG_BYTES.length || inspection.status !== "PASS" || inspection.registeredAssets.length !== 1 || inspection.registeredAssets[0]?.assetId !== receipt.asset.assetId || inspection.registeredAssets[0]?.role !== "token" || inspection.registeredAssets[0]?.mediaType !== "image/png" || inspection.registeredAssets[0]?.disposition !== "PRESENT_VALID" || inspection.registeredAssets[0]?.restoreEligible !== false || !inspection.noWrite || !inspection.noFoundryWrite) throw new Error("PNG token registration did not satisfy exact apply/reread/Scene-restore and additive asset-preservation checks.");
        globalThis.document.title = `DiceBox PNG Token Registration Execute PASS · ${projectId} · generations ${receipt.before.generation} → ${receipt.afterApply.generation} → ${receipt.afterUndo.generation} · ${receipt.asset.assetId} · Scene content restored · token asset preserved · history ${receipt.history.receipts.length} · no Foundry write`;
        if (import.meta.env.VITE_DBX_PROJECT_SELF_TEST_EXIT === "1") await finishProjectSelfTest("PASS");
        return;
      }
      if (mode === "lease-attempt" || mode === "lease-retry") {
        const projectId = import.meta.env.VITE_DBX_PROJECT_SELF_TEST_ID ?? "dbx:project:desktop-mutation-lease-self-test";
        const catalog = await listProjectBundles();
        if (catalog.entries.some((entry) => entry.projectId === projectId)) {
          throw new Error("Mutation-lease self-test requires its test-owned project ID to be absent.");
        }
        const testScene = createBlankProjectScene(projectId);
        if (mode === "lease-attempt") {
          const blocked = await createProjectBundle(
            projectId,
            [testScene],
            testScene.id,
            "Mutation Lease Self Test",
            catalog.workspaceIndexGeneration,
          ).then(() => null, (error: unknown) => error);
          if (blocked === null) {
            throw new Error("A held fixed-root mutation lease unexpectedly allowed project creation.");
          }
          const formatted = formatProjectStoreFailure(blocked);
          if (!formatted.startsWith("PROJECT_STORE_BUSY:") || !formatted.includes("after-holder-exit-and-reread")) {
            throw new Error(`Held fixed-root mutation lease returned the wrong blocker: ${formatted}`);
          }
          const rereadCatalog = await listProjectBundles();
          if (rereadCatalog.entries.some((entry) => entry.projectId === projectId) || rereadCatalog.workspaceIndexGeneration !== catalog.workspaceIndexGeneration) {
            throw new Error("A blocked mutation lease attempt changed catalog or workspace-index state.");
          }
          globalThis.document.title = `DiceBox Mutation Lease Held PASS · ${projectId} · PROJECT_STORE_BUSY · catalog no-write · no Foundry write`;
          return;
        }
        const created = await createProjectBundle(projectId, [testScene], testScene.id, "Mutation Lease Self Test", catalog.workspaceIndexGeneration);
        const reread = await loadProjectBundle(projectId);
        if (
          created.generation !== 1
          || reread.receipt.generation !== created.generation
          || reread.receipt.contentSha256 !== created.contentSha256
          || reread.receipt.sceneCount !== 1
          || reread.receipt.assetCount !== 0
          || reread.scenesJson[0] !== serializeSceneDocument(testScene)
        ) throw new Error("Released mutation lease retry did not create and authoritatively reread the exact blank project envelope.");
        globalThis.document.title = `DiceBox Mutation Lease Released Retry PASS · ${projectId} · generation ${created.generation} · ${created.contentSha256} · no Foundry write`;
        return;
      }
      if (mode === "rename-execute") {
        const projectId = import.meta.env.VITE_DBX_PROJECT_SELF_TEST_ID ?? "dbx:project:desktop-directory-entry-durability-self-test";
        if (!projectId.startsWith("dbx:project:desktop-") && !projectId.startsWith("dbx:project:workspace-self-test-")) {
          throw new Error("Project rename self-test requires an explicitly test-owned project ID.");
        }
        const catalog = await listProjectBundles();
        if (catalog.status !== "PASS" && catalog.status !== "PARTIAL") throw new Error("Project rename self-test requires a complete or exact-target PARTIAL catalog reread.");
        const entry = catalog.entries.find((candidate) => candidate.projectId === projectId);
        if (!entry || entry.status !== "PASS" || entry.generation === null || entry.contentSha256 === null) {
          throw new Error("Project rename self-test requires the exact test-owned project to be present and healthy.");
        }
        const currentDisplayName = entry.displayName;
        const proposedDisplayName = currentDisplayName === "M339 Native Rename Probe" ? "M339 Native Rename Probe Restored" : "M339 Native Rename Probe";
        const observedAt = new Date().toISOString();
        const preview = await createProjectRenamePreview({
          projectId,
          workspaceIndexGeneration: catalog.workspaceIndexGeneration,
          currentDisplayName,
          proposedDisplayName,
          contentSha256: entry.contentSha256,
        });
        const batch = await createProjectRenameProposalBatch({
          batchId: `dbx:proposal:desktop-project-rename-execute-${projectId.replace(/[^a-z0-9._-]/gi, "-").toLowerCase()}-${Date.now()}`,
          preview,
          createdAt: observedAt,
        });
        const history = await previewProposalBatch(batch, desktopProposalRequester, observedAt);
        const session = await createDesktopProjectRenameProposalSession({ projectId, batch, history });
        const approved = await approveDesktopProjectProposalSession(session, desktopProposalReviewer, batch.base, new Date().toISOString());
        const receipt = await executeApprovedProjectRename({ session: approved, executor: desktopProposalReviewer });
        if (
          receipt.before.displayName !== currentDisplayName
          || receipt.afterApply.displayName !== proposedDisplayName
          || receipt.afterUndo.displayName !== currentDisplayName
          || receipt.before.generation !== receipt.afterUndo.generation
          || receipt.before.contentSha256 !== receipt.afterUndo.contentSha256
          || receipt.history.status !== "undone"
          || receipt.history.receipts.length !== 5
          || receipt.apply.atomicReplace !== true
          || receipt.apply.directoryEntrySync !== true
          || receipt.undo.atomicReplace !== true
          || receipt.undo.directoryEntrySync !== true
          || receipt.noFoundryWrite !== true
        ) throw new Error("Native project.rename execution did not satisfy the exact apply/reread/inverse-undo acceptance checks.");
        globalThis.document.title = `DiceBox Project Rename Execute PASS · ${projectId} · ${currentDisplayName} → ${proposedDisplayName} → ${currentDisplayName} · content unchanged · history ${receipt.history.receipts.length} · no Foundry write`;
        if (import.meta.env.VITE_DBX_PROJECT_SELF_TEST_EXIT === "1") await finishProjectSelfTest("PASS");
        return;
      }
      if (mode === "save-execute") {
        const projectId = import.meta.env.VITE_DBX_PROJECT_SELF_TEST_ID ?? "dbx:project:desktop-multiscene-self-test";
        if (!projectId.startsWith("dbx:project:desktop-") && !projectId.startsWith("dbx:project:workspace-self-test-")) {
          throw new Error("Project save self-test requires an explicitly test-owned project ID.");
        }
        const catalog = await listProjectBundles();
        if (catalog.status !== "PASS" && catalog.status !== "PARTIAL") throw new Error("Project save self-test requires a complete or exact-target PARTIAL catalog reread.");
        const entry = catalog.entries.find((candidate) => candidate.projectId === projectId);
        if (!entry || entry.status !== "PASS" || entry.generation === null || entry.contentSha256 === null) {
          throw new Error("Project save self-test requires the exact test-owned project to be present and healthy.");
        }
        const current = await loadProjectBundle(projectId);
        if (current.receipt.generation !== entry.generation || current.receipt.contentSha256 !== entry.contentSha256 || current.assets.length !== 0) {
          throw new Error("Project save self-test requires an exact zero-asset project load matching the catalog.");
        }
        const inverseContent = projectSaveContentFromProjectLoad(current);
        const proposedContent = {
          ...inverseContent,
          scenes: inverseContent.scenes.map((scene) => ({ ...scene, name: `${scene.name} M340 Native Save Probe` })),
        };
        const contentDescriptorSha256 = await hashProjectSaveContent(proposedContent);
        const observedAt = new Date().toISOString();
        const preview = await createProjectSavePreview({
          projectId,
          currentGeneration: current.receipt.generation,
          currentContentSha256: current.receipt.contentSha256,
          contentDescriptorSha256,
          proposedSceneCount: proposedContent.scenes.length,
          proposedActiveSceneId: proposedContent.activeSceneId,
          proposedAssetCount: proposedContent.assets.length,
        });
        const batch = await createProjectSaveProposalBatch({
          batchId: `dbx:proposal:desktop-project-save-execute-${projectId.replace(/[^a-z0-9._-]/gi, "-").toLowerCase()}-${Date.now()}`,
          preview,
          createdAt: observedAt,
        });
        const history = await previewProposalBatch(batch, desktopProposalRequester, observedAt);
        const session = await createDesktopProjectProposalSession({ projectId, batch, history });
        const approved = await approveDesktopProjectProposalSession(session, desktopProposalReviewer, batch.base, new Date().toISOString());
        const receipt = await executeApprovedProjectSave({ session: approved, content: proposedContent, inverseContent, executor: desktopProposalReviewer });
        if (
          receipt.before.projectId !== projectId
          || receipt.before.generation !== current.receipt.generation
          || receipt.afterApply.generation !== receipt.before.generation + 1
          || receipt.afterUndo.generation !== receipt.afterApply.generation + 1
          || receipt.afterApply.activeSceneId !== proposedContent.activeSceneId
          || receipt.afterApply.sceneCount !== proposedContent.scenes.length
          || receipt.afterApply.assetCount !== 0
          || receipt.afterUndo.activeSceneId !== inverseContent.activeSceneId
          || receipt.afterUndo.sceneCount !== inverseContent.scenes.length
          || receipt.afterUndo.assetCount !== 0
          || receipt.afterUndo.semanticContentSha256 !== receipt.before.semanticContentSha256
          || receipt.history.status !== "undone"
          || receipt.history.receipts.length !== 5
          || receipt.save.atomicReplace !== true
          || receipt.save.directoryEntrySync !== true
          || receipt.inverseRestore.atomicReplace !== true
          || receipt.inverseRestore.directoryEntrySync !== true
          || receipt.noFoundryWrite !== true
        ) throw new Error("Native project.save execution did not satisfy the exact apply/reread/inverse-restore acceptance checks.");
        globalThis.document.title = `DiceBox Project Save Execute PASS · ${projectId} · generation ${receipt.before.generation} → ${receipt.afterApply.generation} → ${receipt.afterUndo.generation} · semantic content restored · history ${receipt.history.receipts.length} · no Foundry write`;
        if (import.meta.env.VITE_DBX_PROJECT_SELF_TEST_EXIT === "1") await finishProjectSelfTest("PASS");
        return;
      }
      if (mode === "create-execute") {
        const projectId = import.meta.env.VITE_DBX_PROJECT_SELF_TEST_ID ?? "dbx:project:desktop-create-self-test-v2";
        if (!projectId.startsWith("dbx:project:desktop-")) throw new Error("Project create self-test requires an explicitly test-owned project ID.");
        const initialCatalog = await listProjectBundles();
        if (initialCatalog.entries.some((entry) => entry.projectId === projectId)) throw new Error("Project create self-test requires a fresh absent target; it will not overwrite or clean up an existing project.");
        const first = createBlankProjectScene(projectId);
        const second = createBlankProjectScene(projectId, 2);
        const proposedDisplayName = "M355 Project Create";
        const observedAt = new Date().toISOString();
        const preview = await createProjectCreatePreview({ targetProjectId: projectId, workspaceIndexGeneration: initialCatalog.workspaceIndexGeneration, scenes: [first, second], activeSceneId: second.id, proposedDisplayName });
        const batch = await createProjectCreateProposalBatch({
          batchId: `dbx:proposal:desktop-project-create-${projectId.replace(/[^a-z0-9._-]/gi, "-").toLowerCase()}-${Date.now()}`,
          preview,
          createdAt: observedAt,
        });
        const history = await previewProposalBatch(batch, desktopProposalRequester, observedAt);
        const session = await createDesktopProjectProposalSession({ projectId, batch, history });
        const approved = await approveDesktopProjectProposalSession(session, desktopProposalReviewer, batch.base, new Date().toISOString());
        const receipt = await executeApprovedProjectCreate({ session: approved, content: { scenes: [first, second], activeSceneId: second.id }, executor: desktopProposalReviewer });
        const response = await loadProjectBundle(projectId);
        const inspection = await inspectProjectRecovery(projectId);
        if (receipt.before.targetAbsent !== true || receipt.afterApply.target?.projectId !== projectId || receipt.afterApply.target?.generation !== 1 || receipt.afterApply.target?.sceneCount !== 2 || receipt.afterApply.target?.activeSceneId !== second.id || receipt.afterApply.target?.sceneIds.join("|") !== [first.id, second.id].join("|") || receipt.afterApply.target?.catalogEntry.displayName !== proposedDisplayName || receipt.afterApply.target?.recovery.backup.status !== "MISSING" || receipt.create.generation !== 1 || receipt.create.workspaceMetadata?.displayName !== proposedDisplayName || receipt.history.status !== "committed" || receipt.history.receipts.length !== 4 || receipt.projectContentWrite !== true || receipt.projectPersistenceWrite !== true || receipt.targetCreated !== true || response.receipt.projectId !== projectId || response.receipt.generation !== 1 || response.receipt.sceneCount !== 2 || response.receipt.assetCount !== 0 || inspection.status !== "PASS" || inspection.backup.status !== "MISSING" || !receipt.noFoundryWrite || !inspection.noWrite || !inspection.noFoundryWrite) throw new Error("Project create execution did not satisfy exact target-absent, first-generation, missing-backup, workspace, reread, and approval-history checks.");
        globalThis.document.title = `DiceBox Project Create Execute PASS · ${projectId} · generation ${receipt.create.generation} · ${receipt.afterApply.target.sceneCount} Scenes · first-generation backup missing · history ${receipt.history.receipts.length} · no Foundry write`;
        if (import.meta.env.VITE_DBX_PROJECT_SELF_TEST_EXIT === "1") await finishProjectSelfTest("PASS");
        return;
      }
      if (mode === "asset-bind-execute") {
        const projectId = import.meta.env.VITE_DBX_PROJECT_SELF_TEST_ID ?? "dbx:project:desktop-workspace-acceptance-self-test";
        if (projectId !== "dbx:project:desktop-workspace-acceptance-self-test") throw new Error("Project asset binding self-test requires the exact test-owned workspace-acceptance project ID.");
        const catalog = await listProjectBundles();
        if (catalog.status !== "PASS" && catalog.status !== "PARTIAL") throw new Error("Project asset binding self-test requires a complete or exact-target PARTIAL catalog reread.");
        const entry = catalog.entries.find((candidate) => candidate.projectId === projectId);
        if (!entry || entry.status !== "PASS" || entry.generation === null || entry.contentSha256 === null || entry.assetCount !== 1) throw new Error("Project asset binding self-test requires the exact healthy one-asset project entry.");
        const current = await loadProjectBundle(projectId);
        if (current.receipt.generation !== entry.generation || current.receipt.contentSha256 !== entry.contentSha256 || current.assets.length !== 1) throw new Error("Project asset binding self-test requires a one-asset load matching the catalog.");
        const stored = current.assets[0];
        const registration = stored?.registration;
        if (!stored || !registration || registration.role !== "background" || registration.approval !== "approved" || stored.mediaType !== "image/png") throw new Error("Project asset binding self-test requires one exact registered PNG background asset.");
        const scenes = current.scenesJson.map((sceneJson) => migrateSceneDocument(JSON.parse(sceneJson) as SceneDocument));
        const targetSceneId = "dbx:scene:desktop-workspace-acceptance-self-test-main";
        const candidate = { mediaType: "image/png" as const, bytes: FOUNDATION_SELF_TEST_PNG_BYTES, label: registration.label, provenance: "user-import" as const };
        const descriptor = await deriveProjectBackgroundAssetDescriptor(candidate, targetSceneId);
        if (descriptor.assetId !== registration.assetId || descriptor.assetSha256 !== stored.sha256 || stored.byteLength !== candidate.bytes.length || stored.relativePath !== `assets/sha256/${stored.sha256}` || registration.provenance !== candidate.provenance) throw new Error("Project asset binding self-test candidate does not exactly match the persisted content-addressed registration.");
        const inverseContent = { scenes, activeSceneId: current.activeSceneId, sceneId: targetSceneId, candidate };
        const proposedContent = { ...inverseContent, scenes: scenes.map((scene) => scene.id === targetSceneId ? sceneWithBackgroundAsset(scene, descriptor.assetId) : scene) };
        if (proposedContent.scenes.find((scene) => scene.id === targetSceneId)?.background.assetId !== descriptor.assetId) throw new Error("Project asset binding self-test did not build the exact target Scene binding.");
        const observedAt = new Date().toISOString();
        const preview = await createProjectAssetBindingPreview({ projectId, currentGeneration: current.receipt.generation, currentContentSha256: current.receipt.contentSha256, candidate, sceneId: targetSceneId, proposedSceneCount: proposedContent.scenes.length, proposedActiveSceneId: proposedContent.activeSceneId, proposedAssetCount: current.assets.length });
        const batch = await createProjectAssetBindingProposalBatch({ batchId: `dbx:proposal:desktop-project-asset-bind-execute-${projectId.replace(/[^a-z0-9._-]/gi, "-").toLowerCase()}-${Date.now()}`, preview, createdAt: observedAt });
        const history = await previewProposalBatch(batch, desktopProposalRequester, observedAt);
        const session = await createDesktopProjectProposalSession({ projectId, batch, history });
        const approved = await approveDesktopProjectProposalSession(session, desktopProposalReviewer, batch.base, new Date().toISOString());
        const receipt = await executeApprovedProjectAssetBinding({ session: approved, content: proposedContent, inverseContent, executor: desktopProposalReviewer });
        if (
          receipt.before.projectId !== projectId
          || receipt.before.generation !== current.receipt.generation
          || receipt.afterApply.generation !== receipt.before.generation + 1
          || receipt.afterUndo.generation !== receipt.afterApply.generation + 1
          || receipt.asset.assetId !== descriptor.assetId
          || receipt.asset.role !== "background"
          || receipt.asset.sceneId !== targetSceneId
          || receipt.afterApply.backgroundBindings.find((binding) => binding.sceneId === targetSceneId)?.assetId !== descriptor.assetId
          || receipt.afterApply.assetCount !== 1
          || receipt.afterUndo.assetCount !== 1
          || receipt.afterUndo.semanticContentSha256 !== receipt.before.semanticContentSha256
          || JSON.stringify(receipt.afterUndo.backgroundBindings) !== JSON.stringify(receipt.before.backgroundBindings)
          || receipt.afterUndo.assetCollectionSha256 !== receipt.before.assetCollectionSha256
          || receipt.history.status !== "undone"
          || receipt.history.receipts.length !== 5
          || receipt.save.atomicReplace !== true
          || receipt.save.directoryEntrySync !== true
          || receipt.inverseRestore.atomicReplace !== true
          || receipt.inverseRestore.directoryEntrySync !== true
          || receipt.assetBytesPersisted !== true
          || receipt.assetTreePreserved !== true
          || receipt.noFoundryWrite !== true
        ) throw new Error("Native project.asset.bind execution did not satisfy the exact apply/reread/inverse-restore acceptance checks.");
        globalThis.document.title = `DiceBox PNG Background Binding Execute PASS · ${projectId} · generation ${receipt.before.generation} → ${receipt.afterApply.generation} → ${receipt.afterUndo.generation} · ${receipt.asset.assetId} bound then restored · asset tree preserved · history ${receipt.history.receipts.length} · no Foundry write`;
        if (import.meta.env.VITE_DBX_PROJECT_SELF_TEST_EXIT === "1") await finishProjectSelfTest("PASS");
        return;
      }
      if (mode === "pending-inspection-setup") {
        const projectId = "dbx:project:desktop-pending-artifact-inspection-self-test";
        const catalog = await listProjectBundles();
        if (catalog.entries.some((entry) => entry.projectId === projectId)) {
          throw new Error("Pending-artifact self-test requires its fixed test-owned project ID to be absent; it will never overwrite it.");
        }
        const scene = createBlankProjectScene(projectId);
        const created = await createProjectBundle(projectId, [scene], scene.id, "Pending Artifact Inspection Self Test", catalog.workspaceIndexGeneration);
        if (created.generation !== 1 || created.assetCount !== 0 || created.sceneCount !== 1 || !created.workspaceMetadata || !created.noFoundryWrite) {
          throw new Error("Pending-artifact self-test did not establish its exact fixed-ID workspace fixture.");
        }
        const fixture = await preparePendingArtifactInspectionFixture();
        const inspection = await inspectProjectRecovery(projectId);
        const projectPending = inspection.pendingArtifacts.find((artifact) => artifact.relativePath === fixture.projectPendingRelativePath);
        const workspacePending = inspection.pendingArtifacts.find((artifact) => artifact.relativePath === fixture.workspacePendingRelativePath);
        const malformedPending = inspection.pendingArtifacts.find((artifact) => artifact.relativePath === fixture.malformedPendingRelativePath);
        if (
          fixture.projectId !== projectId
          || !fixture.noFoundryWrite
          || inspection.status !== "BLOCKED"
          || inspection.primary.status !== "VALID"
          || inspection.backup.status !== "MISSING"
          || inspection.pendingArtifacts.length !== 3
          || projectPending?.artifactKind !== "project-pending"
          || projectPending.status !== "PRESENT_VALID"
          || !projectPending.stagedContentSha256
          || projectPending.retry !== "recovery-required-after-reread"
          || workspacePending?.artifactKind !== "workspace-index-pending"
          || workspacePending.status !== "PRESENT_VALID"
          || !workspacePending.stagedContentSha256
          || workspacePending.retry !== "recovery-required-after-reread"
          || malformedPending?.status !== "BLOCKED"
          || malformedPending.blockerCode !== "PENDING_ARTIFACT_INVALID"
          || !inspection.noWrite
          || !inspection.noFoundryWrite
        ) throw new Error("Pending-artifact setup did not report the exact valid and malformed fixed-root artifacts without a recovery write.");
        globalThis.document.title = `DiceBox Pending Artifact Inspection PASS · ${projectId} · ${projectPending.stagedContentSha256} · ${workspacePending.stagedContentSha256} · malformed blocked · no Foundry write`;
        return;
      }
      if (mode === "pending-inspection-reread") {
        const projectId = "dbx:project:desktop-pending-artifact-inspection-self-test";
        const inspection = await inspectProjectRecovery(projectId);
        const present = inspection.pendingArtifacts.filter((artifact) => artifact.status === "PRESENT_VALID");
        const malformed = inspection.pendingArtifacts.find((artifact) => artifact.blockerCode === "PENDING_ARTIFACT_INVALID");
        if (
          inspection.status !== "BLOCKED"
          || inspection.primary.status !== "VALID"
          || inspection.pendingArtifacts.length !== 3
          || present.length !== 2
          || !present.every((artifact) => artifact.stagedContentSha256 && artifact.retry === "recovery-required-after-reread")
          || malformed?.artifactKind !== "project-pending"
          || !inspection.noWrite
          || !inspection.noFoundryWrite
        ) throw new Error("Fresh-package pending-artifact reread did not preserve exact artifact visibility and no-write recovery boundaries.");
        globalThis.document.title = `DiceBox Pending Artifact Inspection Restart PASS · ${projectId} · ${present.map((artifact) => artifact.stagedContentSha256).join(" · ")} · malformed blocked · no Foundry write`;
        return;
      }
      if (mode === "selected-recovery-setup") {
        const fixture = await prepareSelectedMissingBackgroundRecoveryFixture();
        if (fixture.assetIds.length !== 2 || fixture.sceneIds.length !== 2 || !fixture.noFoundryWrite) {
          throw new Error("Selected-recovery fixture did not create two test-owned assets and Scenes without Foundry write.");
        }
        globalThis.document.title = `DiceBox Selected Missing Background Setup PASS · ${fixture.projectId} · ${fixture.assetIds.join(" · ")} · no Foundry write`;
        if (import.meta.env.VITE_DBX_PROJECT_SELF_TEST_EXIT === "1") await finishProjectSelfTest("PASS");
        return;
      }
      if (mode === "dangling-reference-setup") {
        const fixture = await prepareDanglingBackgroundReferenceFixture();
        const inspection = await inspectProjectRecovery(fixture.projectId);
        const missing = inspection.brokenSceneReferences.find((reference) => reference.blockerCode === "BACKGROUND_ASSET_MISSING");
        const mismatch = inspection.brokenSceneReferences.find((reference) => reference.blockerCode === "BACKGROUND_ASSET_ROLE_MISMATCH");
        if (
          fixture.sceneIds.length !== 2
          || fixture.assetIds.length !== 2
          || !fixture.noFoundryWrite
          || inspection.status !== "BLOCKED"
          || inspection.primary.status !== "BLOCKED"
          || inspection.brokenSceneReferences.length !== 2
          || missing?.sceneId !== fixture.sceneIds[0]
          || missing?.assetId !== fixture.assetIds[0]
          || missing?.retry !== "after-reread"
          || mismatch?.sceneId !== fixture.sceneIds[1]
          || mismatch?.assetId !== fixture.assetIds[1]
          || mismatch?.retry !== "never"
          || !inspection.noWrite
          || !inspection.noFoundryWrite
        ) throw new Error("Dangling-reference setup did not expose exact missing and role-mismatch Scene references without a write.");
        globalThis.document.title = `DiceBox Dangling Background Reference PASS · ${fixture.projectId} · ${missing.sceneId}/${missing.assetId} missing · ${mismatch.sceneId}/${mismatch.assetId} role mismatch · no Foundry write`;
        if (import.meta.env.VITE_DBX_PROJECT_SELF_TEST_EXIT === "1") await finishProjectSelfTest("PASS");
        return;
      }
      if (mode === "dangling-reference-reread") {
        const projectId = "dbx:project:desktop-dangling-background-reference-self-test";
        const inspection = await inspectProjectRecovery(projectId);
        const codes = inspection.brokenSceneReferences.map((reference) => reference.blockerCode);
        if (
          inspection.status !== "BLOCKED"
          || inspection.primary.status !== "BLOCKED"
          || inspection.brokenSceneReferences.length !== 2
          || codes[0] !== "BACKGROUND_ASSET_MISSING"
          || codes[1] !== "BACKGROUND_ASSET_ROLE_MISMATCH"
          || !inspection.noWrite
          || !inspection.noFoundryWrite
        ) throw new Error("Fresh-process dangling-reference reread did not preserve exact reference diagnostics and no-write boundaries.");
        globalThis.document.title = `DiceBox Dangling Background Reference Restart PASS · ${projectId} · missing and role mismatch preserved · no Foundry write`;
        if (import.meta.env.VITE_DBX_PROJECT_SELF_TEST_EXIT === "1") await finishProjectSelfTest("PASS");
        return;
      }
      if (mode === "broken-reference-detach-setup") {
        const fixture = await prepareBrokenReferenceDetachFixture();
        const inspection = await inspectProjectRecovery(fixture.projectId);
        const target = selectBrokenSceneReference(inspection, fixture.sceneIds[0], fixture.assetId);
        const preview = await previewBrokenReferenceDetach(target, fixture.projectId);
        if (
          inspection.status !== "BLOCKED"
          || inspection.primary.status !== "BLOCKED"
          || inspection.brokenSceneReferences.length !== 1
          || target.blockerCode !== "BACKGROUND_ASSET_ROLE_MISMATCH"
          || preview.sceneId !== target.sceneId
          || preview.assetId !== target.assetId
          || preview.blockerCode !== target.blockerCode
          || !preview.assetDescriptorPreserved
          || !preview.requiresApproval
          || !preview.noWrite
          || !preview.noFoundryWrite
        ) throw new Error("Broken-reference setup did not produce an exact role-mismatch preview without a write.");
        const receipt = await detachBrokenReference(preview);
        const reread = await inspectProjectRecovery(fixture.projectId);
        const loaded = await loadProjectBundle(fixture.projectId);
        const handout = loaded.assets.find((asset) => asset.registration?.assetId === fixture.assetId);
        const targetScene = loaded.scenesJson.find((scene) => JSON.parse(scene).id === fixture.sceneIds[0]);
        if (
          receipt.sceneId !== fixture.sceneIds[0]
          || receipt.assetId !== fixture.assetId
          || !receipt.assetDescriptorPreserved
          || !receipt.targetBindingAbsent
          || !receipt.unrelatedReferencesUnchanged
          || !receipt.authoritativeInspection
          || !receipt.noFoundryWrite
          || reread.primary.status !== "VALID"
          || reread.brokenSceneReferences.length !== 0
          || !handout
          || handout.registration?.role !== "handout"
          || !targetScene
          || JSON.parse(targetScene).background.assetId !== undefined
        ) throw new Error("Broken-reference repair did not remove only the selected binding or preserve the handout descriptor.");
        globalThis.document.title = `DiceBox Broken Reference Detach PASS · ${receipt.sceneId} → ${receipt.assetId} · handout preserved · generation ${receipt.generation} · no Foundry write`;
        if (import.meta.env.VITE_DBX_PROJECT_SELF_TEST_EXIT === "1") await finishProjectSelfTest("PASS");
        return;
      }
      if (mode === "broken-reference-detach-reread") {
        const projectId = "dbx:project:desktop-broken-reference-detach-self-test-v2";
        const inspection = await inspectProjectRecovery(projectId);
        const loaded = await loadProjectBundle(projectId);
        const handout = loaded.assets.find((asset) => asset.registration?.role === "handout");
        const target = loaded.scenesJson.find((scene) => JSON.parse(scene).id.endsWith("-target"));
        if (
          !["PASS", "BLOCKED"].includes(inspection.status)
          || inspection.primary.status !== "VALID"
          || inspection.brokenSceneReferences.length !== 0
          || !handout
          || handout.registration?.role !== "handout"
          || !target
          || JSON.parse(target).background.assetId !== undefined
          || !inspection.noWrite
          || !inspection.noFoundryWrite
        ) throw new Error("Fresh-process broken-reference reread did not preserve the repaired target and handout asset.");
        globalThis.document.title = `DiceBox Broken Reference Detach Restart PASS · ${projectId} · handout preserved · no Foundry write`;
        if (import.meta.env.VITE_DBX_PROJECT_SELF_TEST_EXIT === "1") await finishProjectSelfTest("PASS");
        return;
      }
      if (mode === "selected-recovery-reread") {
        const projectId = "dbx:project:desktop-selected-missing-background-recovery-self-test";
        const inspection = await inspectProjectRecovery(projectId);
        const eligible = inspection.registeredAssets.filter((asset) => asset.restoreEligible);
        const restored = inspection.registeredAssets.find((asset) => asset.assetId === SELECTED_MISSING_BACKGROUND_PNG_ASSET_ID);
        const remaining = inspection.registeredAssets.find((asset) => asset.assetId !== SELECTED_MISSING_BACKGROUND_PNG_ASSET_ID);
        if (
          inspection.status !== "BLOCKED"
          || inspection.primary.status !== "VALID"
          || inspection.registeredAssets.length !== 2
          || eligible.length !== 1
          || restored?.disposition !== "PRESENT_VALID"
          || remaining?.disposition !== "MISSING"
          || !remaining.restoreEligible
          || !inspection.noWrite
          || !inspection.noFoundryWrite
        ) throw new Error("Fresh-process selected-recovery reread did not preserve the unselected missing asset and no-write boundary.");
        globalThis.document.title = `DiceBox Selected Missing Background Restart PASS · ${projectId} · restored ${restored.assetId} · remaining ${eligible[0].assetId} missing · no Foundry write`;
        if (import.meta.env.VITE_DBX_PROJECT_SELF_TEST_EXIT === "1") await finishProjectSelfTest("PASS");
        return;
      }
      if (mode === "selected-recovery") {
        const projectId = "dbx:project:desktop-selected-missing-background-recovery-self-test";
        const inspection = await inspectProjectRecovery(projectId);
        const eligible = inspection.registeredAssets.filter((asset) => asset.restoreEligible);
        if (
          inspection.status !== "BLOCKED"
          || inspection.registeredAssets.length !== 2
          || eligible.length !== 2
          || new Set(eligible.map((asset) => asset.assetId)).size !== 2
          || new Set(eligible.map((asset) => asset.mediaType)).size !== 2
          || !inspection.noWrite
          || !inspection.noFoundryWrite
        ) throw new Error("Selected-recovery inspection did not expose two independently eligible missing backgrounds.");
        const selected = selectEligibleMissingBackgroundAsset(inspection, SELECTED_MISSING_BACKGROUND_PNG_ASSET_ID);
        const unselected = eligible.find((asset) => asset.assetId !== selected.assetId);
        if (!unselected || selected.assetId !== SELECTED_MISSING_BACKGROUND_PNG_ASSET_ID || selected.mediaType !== "image/png") {
          throw new Error("Selected-recovery fixture did not expose a deterministic PNG target and a distinct unselected asset.");
        }
        const preview = await previewMissingAssetRestore(
          projectId,
          selected.assetId,
          selected.mediaType,
          SELECTED_MISSING_BACKGROUND_PNG_BYTES,
        );
        if (
          preview.assetId !== selected.assetId
          || preview.affectedSceneIds.length !== selected.affectedSceneIds.length
          || preview.candidateSha256 !== selected.sha256
          || !preview.requiresApproval
          || !preview.noWrite
          || !preview.noFoundryWrite
        ) throw new Error("Selected-recovery preview was not bound to exactly the chosen stable asset identity.");
        const receipt = await restoreMissingAsset(preview, SELECTED_MISSING_BACKGROUND_PNG_BYTES);
        const reread = await inspectProjectRecovery(projectId);
        const remaining = reread.registeredAssets.find((asset) => asset.assetId === unselected.assetId);
        const restored = reread.registeredAssets.find((asset) => asset.assetId === selected.assetId);
        if (
          receipt.assetId !== selected.assetId
          || !receipt.directoryEntrySync
          || !receipt.noFoundryWrite
          || reread.registeredAssets.length !== 2
          || restored?.disposition !== "PRESENT_VALID"
          || remaining?.disposition !== "MISSING"
          || !remaining.restoreEligible
          || !reread.noWrite
          || !reread.noFoundryWrite
        ) throw new Error("Selected-recovery execution changed more than the explicitly selected asset disposition.");
        await recordProjectStageReceipt({
          operation: "dicebox.project.stage-self-test",
          status: "PASS",
          phase: "save",
          projectId,
          generation: receipt.generation,
          sceneRevision: 0,
          selectedX: 0,
          contentSha256: receipt.contentSha256,
          sceneCount: reread.scenes.length,
          assetId: selected.assetId,
          assetSha256: selected.sha256,
          bindingSceneId: selected.affectedSceneIds[0],
          noWrite: true,
        });
        setRecoveryInspection(reread);
        setSelectedRecoveryAssetId(unselected.assetId);
        setRecoveryReceipt(receipt);
        setActiveProjectId(projectId);
        setSelectedProjectId(projectId);
        setProjectGeneration(receipt.generation);
        globalThis.document.title = `DiceBox Selected Missing Background PASS · selected ${selected.assetId} · preserved ${unselected.assetId} · generation ${receipt.generation} · no Foundry write`;
        if (import.meta.env.VITE_DBX_PROJECT_SELF_TEST_EXIT === "1") await finishProjectSelfTest("PASS");
        return;
      }
      if (mode === "handout-asset-reread") {
        const projectId = import.meta.env.VITE_DBX_PROJECT_SELF_TEST_ID ?? "dbx:project:desktop-handout-asset-self-test";
        const response = await loadProjectBundle(projectId);
        const scenes = response.scenesJson.map(parseStoredScene);
        const asset = response.assets[0];
        const catalog = await listProjectBundles();
        const entry = catalog.entries.find((candidate) => candidate.projectId === projectId);
        const inspection = await inspectProjectRecovery(projectId);
        if (
          response.receipt.migrationStatus !== "current"
          || response.receipt.generation !== 2
          || response.receipt.assetCount !== 1
          || scenes.length !== 1
          || scenes[0]?.background.assetId !== undefined
          || asset?.registration?.role !== "handout"
          || asset?.registration?.assetId !== `dbx:asset:sha256-${asset.sha256}`
          || entry?.projectId !== projectId
          || entry?.assetCount !== 1
          || inspection.status !== "PASS"
          || inspection.registeredAssets.length !== 1
          || inspection.registeredAssets[0]?.role !== "handout"
          || inspection.registeredAssets[0]?.disposition !== "PRESENT_VALID"
          || inspection.registeredAssets[0]?.restoreEligible
          || !inspection.noWrite
          || !inspection.noFoundryWrite
        ) throw new Error("Fresh-package handout reread did not preserve the non-scene role, valid blob, catalog entry, and no-write recovery boundary.");
        globalThis.document.title = `DiceBox Handout Asset Restart PASS · ${projectId} · generation ${response.receipt.generation} · ${asset.registration.assetId} · no Foundry write`;
        if (import.meta.env.VITE_DBX_PROJECT_SELF_TEST_EXIT === "1") await finishProjectSelfTest("PASS");
        return;
      }
      if (mode === "handout-asset") {
        const projectId = import.meta.env.VITE_DBX_PROJECT_SELF_TEST_ID ?? "dbx:project:desktop-handout-asset-self-test";
        const initialCatalog = await listProjectBundles();
        if (initialCatalog.entries.some((entry) => entry.projectId === projectId)) {
          throw new Error("Handout asset self-test requires its fixed test-owned project ID to be absent; it will never overwrite an existing project.");
        }
        const scene = createBlankProjectScene(projectId);
        const created = await createProjectBundle(projectId, [scene], scene.id, "Stage 8 Handout Asset", initialCatalog.workspaceIndexGeneration);
        const result = await registerHandoutAsset(projectId, [scene], scene.id, created.generation, {
          mediaType: "image/png",
          bytes: FOUNDATION_SELF_TEST_PNG_BYTES,
          label: "Stage 8 handout.png",
          provenance: "user-import",
        });
        const response = await loadProjectBundle(projectId);
        const scenes = response.scenesJson.map(parseStoredScene);
        const asset = response.assets.find((candidate) => candidate.registration?.assetId === result.assetId);
        const inspection = await inspectProjectRecovery(projectId);
        if (
          created.generation !== 1
          || result.receipt.generation !== 2
          || result.receipt.assetCount !== 1
          || !result.receipt.directoryEntrySync
          || !result.receipt.backupPreserved
          || response.receipt.projectId !== projectId
          || response.receipt.generation !== 2
          || response.receipt.assetCount !== 1
          || response.receipt.sceneCount !== 1
          || scenes[0]?.background.assetId !== undefined
          || asset?.registration?.assetId !== result.assetId
          || asset?.registration?.role !== "handout"
          || asset?.sha256 !== result.sha256
          || inspection.status !== "PASS"
          || inspection.registeredAssets.length !== 1
          || inspection.registeredAssets[0]?.assetId !== result.assetId
          || inspection.registeredAssets[0]?.role !== "handout"
          || inspection.registeredAssets[0]?.disposition !== "PRESENT_VALID"
          || inspection.registeredAssets[0]?.restoreEligible
          || !inspection.noWrite
          || !inspection.noFoundryWrite
        ) throw new Error("Handout asset setup did not establish the exact non-scene role, content-addressed reread, and no-write recovery boundary.");
        await recordProjectStageReceipt({
          operation: "dicebox.project.stage-self-test",
          status: "PASS",
          phase: "save",
          projectId,
          generation: response.receipt.generation,
          sceneRevision: scene.revision,
          selectedX: 0,
          contentSha256: response.receipt.contentSha256,
          sceneCount: response.receipt.sceneCount,
          assetId: result.assetId,
          assetSha256: result.sha256,
          noWrite: true,
        });
        setActiveProjectId(projectId);
        setSelectedProjectId(projectId);
        setProjectScenes(scenes);
        setActiveSceneId(scene.id);
        setProjectGeneration(response.receipt.generation);
        setHandoutAssetId(result.assetId);
        setProjectLoadResponse(response);
        setProjectSaveReceipt(result.receipt);
        globalThis.document.title = `DiceBox Handout Asset PASS · ${projectId} · generation ${response.receipt.generation} · ${result.assetId} · no Foundry write`;
        if (import.meta.env.VITE_DBX_PROJECT_SELF_TEST_EXIT === "1") await finishProjectSelfTest("PASS");
        return;
      }
      if (mode === "audio-asset-reread") {
        const projectId = import.meta.env.VITE_DBX_PROJECT_SELF_TEST_ID ?? "dbx:project:desktop-audio-asset-role-self-test";
        const response = await loadProjectBundle(projectId);
        const scenes = response.scenesJson.map(parseStoredScene);
        const asset = response.assets[0];
        const catalog = await listProjectBundles();
        const entry = catalog.entries.find((candidate) => candidate.projectId === projectId);
        const inspection = await inspectProjectRecovery(projectId);
        if (
          response.receipt.migrationStatus !== "current"
          || response.receipt.generation !== 2
          || response.receipt.assetCount !== 1
          || response.receipt.sceneCount !== 1
          || scenes[0]?.background.assetId !== undefined
          || asset?.mediaType !== "audio/wav"
          || asset?.registration?.role !== "audio"
          || asset?.registration?.assetId !== `dbx:asset:sha256-${asset.sha256}`
          || entry?.projectId !== projectId
          || entry?.assetCount !== 1
          || inspection.status !== "PASS"
          || inspection.registeredAssets.length !== 1
          || inspection.registeredAssets[0]?.role !== "audio"
          || inspection.registeredAssets[0]?.mediaType !== "audio/wav"
          || inspection.registeredAssets[0]?.disposition !== "PRESENT_VALID"
          || inspection.registeredAssets[0]?.restoreEligible
          || !inspection.noWrite
          || !inspection.noFoundryWrite
        ) throw new Error("Fresh-package audio-role reread did not preserve the non-scene role, valid WAV blob, catalog entry, and background-recovery exclusion.");
        globalThis.document.title = `DiceBox Audio Asset Restart PASS · ${projectId} · generation ${response.receipt.generation} · ${asset.registration.assetId} · no Foundry write`;
        if (import.meta.env.VITE_DBX_PROJECT_SELF_TEST_EXIT === "1") await finishProjectSelfTest("PASS");
        return;
      }
      if (mode === "audio-asset") {
        const projectId = import.meta.env.VITE_DBX_PROJECT_SELF_TEST_ID ?? "dbx:project:desktop-audio-asset-role-self-test";
        const initialCatalog = await listProjectBundles();
        if (initialCatalog.entries.some((entry) => entry.projectId === projectId)) {
          throw new Error("Audio asset self-test requires its fixed test-owned project ID to be absent; it will never overwrite an existing project.");
        }
        const scene = createBlankProjectScene(projectId);
        const created = await createProjectBundle(projectId, [scene], scene.id, "Stage 8 Audio Asset", initialCatalog.workspaceIndexGeneration);
        const result = await registerAudioAsset(projectId, [scene], scene.id, created.generation, {
          mediaType: "audio/wav",
          bytes: AUDIO_ASSET_ROLE_SELF_TEST_WAV_BYTES,
          label: "Stage 8 ambient.wav",
          provenance: "user-import",
        });
        const response = await loadProjectBundle(projectId);
        const scenes = response.scenesJson.map(parseStoredScene);
        const asset = response.assets.find((candidate) => candidate.registration?.assetId === result.assetId);
        const inspection = await inspectProjectRecovery(projectId);
        if (
          created.generation !== 1
          || result.receipt.generation !== 2
          || result.receipt.assetCount !== 1
          || !result.receipt.directoryEntrySync
          || !result.receipt.backupPreserved
          || response.receipt.projectId !== projectId
          || response.receipt.generation !== 2
          || response.receipt.assetCount !== 1
          || response.receipt.sceneCount !== 1
          || scenes[0]?.background.assetId !== undefined
          || asset?.mediaType !== "audio/wav"
          || asset?.registration?.assetId !== result.assetId
          || asset?.registration?.role !== "audio"
          || asset?.sha256 !== result.sha256
          || inspection.status !== "PASS"
          || inspection.registeredAssets.length !== 1
          || inspection.registeredAssets[0]?.assetId !== result.assetId
          || inspection.registeredAssets[0]?.role !== "audio"
          || inspection.registeredAssets[0]?.mediaType !== "audio/wav"
          || inspection.registeredAssets[0]?.disposition !== "PRESENT_VALID"
          || inspection.registeredAssets[0]?.restoreEligible
          || !inspection.noWrite
          || !inspection.noFoundryWrite
        ) throw new Error("Audio asset setup did not establish the exact non-scene role, RIFF/WAVE validation, content-addressed reread, and no-write recovery boundary.");
        await recordProjectStageReceipt({
          operation: "dicebox.project.stage-self-test",
          status: "PASS",
          phase: "save",
          projectId,
          generation: response.receipt.generation,
          sceneRevision: scene.revision,
          selectedX: 0,
          contentSha256: response.receipt.contentSha256,
          sceneCount: response.receipt.sceneCount,
          assetId: result.assetId,
          assetSha256: result.sha256,
          noWrite: true,
        });
        setActiveProjectId(projectId);
        setSelectedProjectId(projectId);
        setProjectScenes(scenes);
        setActiveSceneId(scene.id);
        setProjectGeneration(response.receipt.generation);
        setAudioAssetId(result.assetId);
        setProjectLoadResponse(response);
        setProjectSaveReceipt(result.receipt);
        globalThis.document.title = `DiceBox Audio Asset PASS · ${projectId} · generation ${response.receipt.generation} · ${result.assetId} · no Foundry write`;
        if (import.meta.env.VITE_DBX_PROJECT_SELF_TEST_EXIT === "1") await finishProjectSelfTest("PASS");
        return;
      }
      if (mode === "token-asset-reread") {
        const projectId = import.meta.env.VITE_DBX_PROJECT_SELF_TEST_ID ?? "dbx:project:desktop-token-asset-role-self-test";
        const response = await loadProjectBundle(projectId);
        const scenes = response.scenesJson.map(parseStoredScene);
        const asset = response.assets[0];
        const catalog = await listProjectBundles();
        const entry = catalog.entries.find((candidate) => candidate.projectId === projectId);
        const inspection = await inspectProjectRecovery(projectId);
        if (
          response.receipt.migrationStatus !== "current"
          || response.receipt.generation !== 2
          || response.receipt.assetCount !== 1
          || response.receipt.sceneCount !== 1
          || scenes[0]?.background.assetId !== undefined
          || (asset?.mediaType !== "image/png" && asset?.mediaType !== "image/webp")
          || asset?.registration?.role !== "token"
          || asset?.registration?.assetId !== `dbx:asset:sha256-${asset.sha256}`
          || entry?.projectId !== projectId
          || entry?.assetCount !== 1
          || inspection.status !== "PASS"
          || inspection.registeredAssets.length !== 1
          || inspection.registeredAssets[0]?.role !== "token"
          || inspection.registeredAssets[0]?.mediaType !== asset.mediaType
          || inspection.registeredAssets[0]?.disposition !== "PRESENT_VALID"
          || inspection.registeredAssets[0]?.restoreEligible
          || !inspection.noWrite
          || !inspection.noFoundryWrite
        ) throw new Error("Fresh-package token-role reread did not preserve the non-scene role, valid image blob, catalog entry, and background-recovery exclusion.");
        globalThis.document.title = `DiceBox Token Asset Restart PASS · ${projectId} · generation ${response.receipt.generation} · ${asset.registration.assetId} · no Foundry write`;
        if (import.meta.env.VITE_DBX_PROJECT_SELF_TEST_EXIT === "1") await finishProjectSelfTest("PASS");
        return;
      }
      if (mode === "token-asset") {
        const projectId = import.meta.env.VITE_DBX_PROJECT_SELF_TEST_ID ?? "dbx:project:desktop-token-asset-role-self-test";
        const initialCatalog = await listProjectBundles();
        if (initialCatalog.entries.some((entry) => entry.projectId === projectId)) {
          throw new Error("Token asset self-test requires its fixed test-owned project ID to be absent; it will never overwrite an existing project.");
        }
        const scene = createBlankProjectScene(projectId);
        const created = await createProjectBundle(projectId, [scene], scene.id, "Stage 8 Token Asset", initialCatalog.workspaceIndexGeneration);
        const result = await registerTokenAsset(projectId, [scene], scene.id, created.generation, {
          mediaType: "image/png",
          bytes: FOUNDATION_SELF_TEST_PNG_BYTES,
          label: "Stage 8 token.png",
          provenance: "user-import",
        });
        const response = await loadProjectBundle(projectId);
        const scenes = response.scenesJson.map(parseStoredScene);
        const asset = response.assets.find((candidate) => candidate.registration?.assetId === result.assetId);
        const inspection = await inspectProjectRecovery(projectId);
        if (
          created.generation !== 1
          || result.receipt.generation !== 2
          || result.receipt.assetCount !== 1
          || !result.receipt.directoryEntrySync
          || !result.receipt.backupPreserved
          || response.receipt.projectId !== projectId
          || response.receipt.generation !== 2
          || response.receipt.assetCount !== 1
          || response.receipt.sceneCount !== 1
          || scenes[0]?.background.assetId !== undefined
          || asset?.mediaType !== "image/png"
          || asset?.registration?.assetId !== result.assetId
          || asset?.registration?.role !== "token"
          || asset?.sha256 !== result.sha256
          || inspection.status !== "PASS"
          || inspection.registeredAssets.length !== 1
          || inspection.registeredAssets[0]?.assetId !== result.assetId
          || inspection.registeredAssets[0]?.role !== "token"
          || inspection.registeredAssets[0]?.mediaType !== "image/png"
          || inspection.registeredAssets[0]?.disposition !== "PRESENT_VALID"
          || inspection.registeredAssets[0]?.restoreEligible
          || !inspection.noWrite
          || !inspection.noFoundryWrite
        ) throw new Error("Token asset setup did not establish the exact non-scene role, image validation, content-addressed reread, and no-write recovery boundary.");
        await recordProjectStageReceipt({
          operation: "dicebox.project.stage-self-test",
          status: "PASS",
          phase: "save",
          projectId,
          generation: response.receipt.generation,
          sceneRevision: scene.revision,
          selectedX: 0,
          contentSha256: response.receipt.contentSha256,
          sceneCount: response.receipt.sceneCount,
          assetId: result.assetId,
          assetSha256: result.sha256,
          noWrite: true,
        });
        setActiveProjectId(projectId);
        setSelectedProjectId(projectId);
        setProjectScenes(scenes);
        setActiveSceneId(scene.id);
        setProjectGeneration(response.receipt.generation);
        setTokenAssetId(result.assetId);
        setProjectLoadResponse(response);
        setProjectSaveReceipt(result.receipt);
        globalThis.document.title = `DiceBox Token Asset PASS · ${projectId} · generation ${response.receipt.generation} · ${result.assetId} · no Foundry write`;
        if (import.meta.env.VITE_DBX_PROJECT_SELF_TEST_EXIT === "1") await finishProjectSelfTest("PASS");
        return;
      }
      if (mode === "backup-promotion-preview") {
        const projectId = import.meta.env.VITE_DBX_PROJECT_SELF_TEST_ID ?? "dbx:project:desktop-backup-authoritative-recovery-promotion-self-test";
        const response = await loadProjectBundle(projectId);
        const scenes = response.scenesJson.map(parseStoredScene);
        const active = parseActiveStoredScene(response);
        const inspection = await inspectProjectRecovery(projectId);
        const preview = await previewBackupAuthoritativeRecovery(projectId);
        const catalog = await listProjectBundles();
        const entry = catalog.entries.find((candidate) => candidate.projectId === projectId);
        if (
          response.receipt.projectId !== projectId
          || response.receipt.migrationStatus !== "current"
          || response.receipt.recoveredFrom !== "project.backup.json"
          || inspection.status !== "PASS"
          || inspection.primary.status !== "MISSING"
          || inspection.backup.status !== "VALID"
          || inspection.recoveredFrom !== "project.backup.json"
          || preview.status !== "PREVIEW"
          || preview.projectId !== projectId
          || preview.primary.status !== "MISSING"
          || preview.backup.status !== "VALID"
          || preview.backup.sourceSchemaVersion !== "0.3.0"
          || preview.generation !== response.receipt.generation
          || preview.contentSha256 !== response.receipt.contentSha256
          || !preview.requiresApproval
          || !preview.noWrite
          || !preview.noFoundryWrite
          || entry?.projectId !== projectId
        ) throw new Error("Existing backup-recovery preview did not establish the exact missing-primary/current-backup project boundary.");
        setProjectCatalog(catalog.entries);
        setWorkspaceIndexGeneration(catalog.workspaceIndexGeneration);
        setWorkspaceMetadataWarning(catalog.workspaceMetadataWarning);
        setSelectedProjectId(projectId);
        setActiveProjectId(projectId);
        setProjectScenes(scenes);
        setProjectPersistedSceneJson(response.scenesJson);
        setActiveSceneId(active.id);
        setProjectGeneration(response.receipt.generation);
        setProjectLoadResponse(response);
        setProjectSaveReceipt(null);
        setRecoveryInspection(inspection);
        setBackupPromotionPreview(preview);
        setProjectError(null);
        setProjectCloseNotice(null);
        dispatch({ kind: "replace", document: active });
        const projectSlug = projectId.replace(/[^a-z0-9._-]/gi, "-").toLowerCase();
        const observedAt = new Date().toISOString();
        const batch = await createProjectRecoveryProposalBatch({
          batchId: `dbx:proposal:desktop-project-recovery-${projectSlug}-${Date.now()}`,
          preview,
          createdAt: observedAt,
        });
        const history = await previewProposalBatch(batch, desktopProposalRequester, observedAt);
        const session = await createDesktopProjectProposalSession({ projectId: batch.base.targetId, batch, history });
        await persistProjectProposalSession(session);
        globalThis.document.title = `DiceBox Project Recovery Proposal Preview PASS · ${projectId} · generation ${preview.generation} · ${preview.contentSha256} · no project write`;
        if (import.meta.env.VITE_DBX_PROJECT_SELF_TEST_EXIT === "1") await finishProjectSelfTest("PASS");
        return;
      }
      if (mode === "backup-promotion-setup") {
        const fixture = await prepareBackupAuthoritativeRecoveryPromotionFixture();
        const preview = await previewBackupAuthoritativeRecovery(fixture.projectId);
        const inspection = await inspectProjectRecovery(fixture.projectId);
        if (
          fixture.status !== "PASS"
          || !fixture.noFoundryWrite
          || preview.status !== "PREVIEW"
          || preview.projectId !== fixture.projectId
          || preview.primary.status !== "MISSING"
          || preview.backup.status !== "VALID"
          || preview.backup.sourceSchemaVersion !== "0.3.0"
          || preview.generation !== fixture.generation
          || preview.contentSha256 !== fixture.contentSha256
          || preview.backupByteSha256 !== fixture.backupByteSha256
          || preview.requiresApproval !== true
          || !preview.noWrite
          || !preview.noFoundryWrite
          || inspection.status !== "PASS"
          || inspection.primary.status !== "MISSING"
          || inspection.backup.status !== "VALID"
          || inspection.recoveredFrom !== "project.backup.json"
          || !inspection.noWrite
          || !inspection.noFoundryWrite
        ) throw new Error("Backup-promotion setup did not establish a missing-primary/current-backup no-write preview.");
        globalThis.document.title = `DiceBox Backup Promotion Preview PASS · ${fixture.projectId} · generation ${fixture.generation} · ${fixture.backupByteSha256} · no write · no Foundry write`;
        if (import.meta.env.VITE_DBX_PROJECT_SELF_TEST_EXIT === "1") await finishProjectSelfTest("PASS");
        return;
      }
      if (mode === "backup-promotion") {
        const projectId = import.meta.env.VITE_DBX_PROJECT_SELF_TEST_ID ?? "dbx:project:desktop-backup-authoritative-recovery-promotion-self-test";
        const preview = await previewBackupAuthoritativeRecovery(projectId);
        const receipt = await promoteBackupAuthoritativeRecovery(preview);
        const response = await loadProjectBundle(projectId);
        const inspection = await inspectProjectRecovery(projectId);
        const catalog = await listProjectBundles();
        const entry = catalog.entries.find((candidate) => candidate.projectId === projectId);
        if (
          receipt.status !== "PASS"
          || !receipt.primaryRestored
          || !receipt.backupUnchanged
          || !receipt.semanticStateUnchanged
          || !receipt.assetTreeUnchanged
          || !receipt.workspaceUnchanged
          || !receipt.foreignStateUnchanged
          || !receipt.authoritativeCurrentReread
          || !receipt.directoryEntrySync
          || !receipt.noFoundryWrite
          || response.receipt.projectId !== projectId
          || response.receipt.generation !== receipt.generation
          || response.receipt.contentSha256 !== receipt.contentSha256
          || response.receipt.recoveredFrom !== undefined
          || inspection.primary.status !== "VALID"
          || inspection.backup.status !== "VALID"
          || inspection.primary.byteSha256 !== inspection.backup.byteSha256
          || inspection.recoveredFrom !== undefined
          || entry?.status !== "PASS"
          || !inspection.noWrite
          || !inspection.noFoundryWrite
        ) throw new Error("Backup promotion did not restore the exact current primary while preserving backup and no-write boundaries.");
        await recordProjectStageReceipt({
          operation: "dicebox.project.stage-self-test",
          status: "PASS",
          phase: "save",
          projectId,
          generation: receipt.generation,
          sceneRevision: 0,
          selectedX: 0,
          contentSha256: receipt.contentSha256,
          sceneCount: receipt.scenes.length,
          noWrite: true,
        });
        globalThis.document.title = `DiceBox Backup Promotion PASS · ${projectId} · generation ${receipt.generation} · primary and backup identical · no Foundry write`;
        if (import.meta.env.VITE_DBX_PROJECT_SELF_TEST_EXIT === "1") await finishProjectSelfTest("PASS");
        return;
      }
      if (mode === "backup-promotion-reread") {
        const projectId = import.meta.env.VITE_DBX_PROJECT_SELF_TEST_ID ?? "dbx:project:desktop-backup-authoritative-recovery-promotion-self-test";
        const response = await loadProjectBundle(projectId);
        const inspection = await inspectProjectRecovery(projectId);
        const catalog = await listProjectBundles();
        const entry = catalog.entries.find((candidate) => candidate.projectId === projectId);
        if (
          response.receipt.migrationStatus !== "current"
          || response.receipt.generation !== 1
          || response.receipt.sceneCount !== 1
          || response.receipt.assetCount !== 0
          || response.receipt.recoveredFrom !== undefined
          || inspection.status !== "PASS"
          || inspection.primary.status !== "VALID"
          || inspection.backup.status !== "VALID"
          || inspection.primary.byteSha256 !== inspection.backup.byteSha256
          || inspection.recoveredFrom !== undefined
          || entry?.projectId !== projectId
          || entry?.generation !== response.receipt.generation
          || !inspection.noWrite
          || !inspection.noFoundryWrite
        ) throw new Error("Fresh-package backup-promotion reread did not preserve the restored current primary, identical backup, catalog, and no-write boundary.");
        globalThis.document.title = `DiceBox Backup Promotion Restart PASS · ${projectId} · generation ${response.receipt.generation} · exact backup retained · no Foundry write`;
        if (import.meta.env.VITE_DBX_PROJECT_SELF_TEST_EXIT === "1") await finishProjectSelfTest("PASS");
        return;
      }
      if (mode === "workspace-acceptance-reread") {
        const projectId = import.meta.env.VITE_DBX_PROJECT_SELF_TEST_ID ?? "dbx:project:desktop-workspace-acceptance-self-test";
        const first = createBlankProjectScene(projectId);
        const second = createBlankProjectScene(projectId, 2);
        const response = await loadProjectBundle(projectId);
        const scenes = response.scenesJson.map(parseStoredScene);
        const active = parseActiveStoredScene(response);
        const asset = response.assets.find((candidate) => candidate.registration?.assetId === active.background.assetId);
        const catalog = await listProjectBundles();
        const entry = catalog.entries.find((candidate) => candidate.projectId === projectId);
        const inspection = await inspectProjectRecovery(projectId);
        if (
          response.receipt.migrationStatus !== "current"
          || response.receipt.generation !== 2
          || response.receipt.sceneCount !== 2
          || response.receipt.assetCount !== 1
          || response.receipt.persistedContentSha256 !== response.receipt.contentSha256
          || response.receipt.scenes.map((scene) => scene.sceneId).join("|") !== [first.id, second.id].join("|")
          || new Set(response.receipt.scenes.map((scene) => scene.sceneSha256)).size !== 2
          || scenes.length !== 2
          || scenes[0]?.id !== first.id
          || scenes[0]?.background.assetId !== undefined
          || active.id !== second.id
          || active.background.assetId === undefined
          || asset?.registration?.role !== "background"
          || response.assets.length !== 1
          || entry?.displayName !== "Stage 8 Workspace Acceptance Renamed"
          || entry?.contentSha256 !== response.receipt.contentSha256
          || entry?.generation !== response.receipt.generation
          || catalog.workspaceMetadataWarning !== null
          || inspection.status !== "PASS"
          || inspection.primary.status !== "VALID"
          || inspection.backup.status !== "VALID"
          || inspection.registeredAssets.length !== 1
          || inspection.registeredAssets[0]?.assetId !== asset.registration.assetId
          || inspection.registeredAssets[0]?.disposition !== "PRESENT_VALID"
          || !inspection.noWrite
          || !inspection.noFoundryWrite
        ) throw new Error("Fresh-package workspace acceptance reread did not preserve the exact two-Scene envelope, registered background, renamed workspace entry, and backup disposition.");
        const preview = await compileSceneFoundryPreview({ projectId, scene: active, assets: response.assets });
        if (preview.blockers.length > 0) throw new Error(`Fresh-package workspace acceptance preview remained blocked: ${preview.blockers.join(", ")}`);
        await recordProjectStageReceipt({
          operation: "dicebox.project.stage-self-test",
          status: "PASS",
          phase: "load-and-compile",
          projectId,
          generation: response.receipt.generation,
          sceneRevision: active.revision,
          selectedX: 0,
          contentSha256: response.receipt.contentSha256,
          planSha256: preview.planSha256,
          candidateCount: preview.documents.length,
          sceneCount: response.receipt.sceneCount,
          assetId: asset.registration.assetId,
          assetSha256: asset.sha256,
          bindingSceneId: active.id,
          noWrite: true,
        });
        globalThis.document.title = `DiceBox Workspace Acceptance Restart PASS · ${projectId} · generation ${response.receipt.generation} · ${response.receipt.contentSha256} · ${asset.registration.assetId} · no Foundry write`;
        if (import.meta.env.VITE_DBX_PROJECT_SELF_TEST_EXIT === "1") await finishProjectSelfTest("PASS");
        return;
      }
      if (mode === "close-reopen-reread") {
        const projectId = import.meta.env.VITE_DBX_PROJECT_SELF_TEST_ID ?? "dbx:project:desktop-close-reopen-self-test";
        const response = await loadProjectBundle(projectId);
        const scenes = response.scenesJson.map(parseStoredScene);
        const active = parseActiveStoredScene(response);
        const asset = response.assets.find((candidate) => candidate.registration?.assetId === active.background.assetId);
        const closeDecision = projectSessionCloseDecision(projectId, scenes, response.scenesJson);
        const catalog = await listProjectBundles();
        const entry = catalog.entries.find((candidate) => candidate.projectId === projectId);
        if (
          closeDecision.status !== "PASS"
          || !closeDecision.noWrite
          || response.receipt.migrationStatus !== "current"
          || response.receipt.generation !== 2
          || response.receipt.sceneCount !== 2
          || response.receipt.assetCount !== 1
          || response.receipt.activeSceneId !== active.id
          || scenes[0]?.id !== createBlankProjectScene(projectId).id
          || scenes[1]?.id !== createBlankProjectScene(projectId, 2).id
          || scenes[0]?.background.assetId !== undefined
          || active.background.assetId === undefined
          || asset?.registration?.role !== "background"
          || asset?.sha256 !== response.assets[0]?.sha256
          || entry?.projectId !== projectId
          || entry?.contentSha256 !== response.receipt.contentSha256
          || entry?.generation !== response.receipt.generation
          || catalog.workspaceMetadataWarning !== null
          || !response.receipt.noFoundryWrite
        ) throw new Error("Fresh-process close/reopen reread did not preserve the clean saved two-Scene project, active binding, asset, or catalog hash.");
        await recordProjectStageReceipt({
          operation: "dicebox.project.stage-self-test",
          status: "PASS",
          phase: "load-and-compile",
          projectId,
          generation: response.receipt.generation,
          sceneRevision: active.revision,
          selectedX: 0,
          contentSha256: response.receipt.contentSha256,
          sceneCount: response.receipt.sceneCount,
          assetId: asset.registration.assetId,
          assetSha256: asset.sha256,
          bindingSceneId: active.id,
          noWrite: true,
        });
        globalThis.document.title = `DiceBox Project Close/Reopen Restart PASS · ${projectId} · generation ${response.receipt.generation} · ${response.receipt.contentSha256} · memory-only close · no Foundry write`;
        if (import.meta.env.VITE_DBX_PROJECT_SELF_TEST_EXIT === "1") await finishProjectSelfTest("PASS");
        return;
      }
      if (mode === "close-reopen") {
        const projectId = import.meta.env.VITE_DBX_PROJECT_SELF_TEST_ID ?? "dbx:project:desktop-close-reopen-self-test";
        const first = createBlankProjectScene(projectId);
        const second = createBlankProjectScene(projectId, 2);
        const initialCatalog = await listProjectBundles();
        if (initialCatalog.entries.some((entry) => entry.projectId === projectId)) {
          throw new Error("Close/reopen self-test requires its fixed test-owned project ID to be absent; it will never overwrite an existing project.");
        }
        const created = await createProjectBundle(projectId, [first, second], second.id, "Stage 8 Close Reopen", initialCatalog.workspaceIndexGeneration);
        const renamed = await renameProjectBundle(projectId, "Stage 8 Close Reopen Renamed", created.workspaceMetadata?.indexGeneration ?? initialCatalog.workspaceIndexGeneration);
        const beforeBinding = await loadProjectBundle(projectId, renamed.indexGeneration);
        const sourceScenes = beforeBinding.scenesJson.map(parseStoredScene);
        const unboundScenes = sourceScenes.map((scene) => ({ ...scene, background: { color: scene.background.color, gridSize: scene.background.gridSize } }));
        const bound = await bindBackgroundAssetToScene(projectId, unboundScenes, second.id, beforeBinding.receipt.generation, {
          mediaType: "image/png",
          bytes: FOUNDATION_SELF_TEST_PNG_BYTES,
          label: "Stage 8 close/reopen background.png",
          provenance: "user-import",
        });
        const saved = await loadProjectBundle(projectId);
        const savedScenes = saved.scenesJson.map(parseStoredScene);
        const active = parseActiveStoredScene(saved);
        const closeDecision = projectSessionCloseDecision(projectId, savedScenes, saved.scenesJson);
        const reopened = await loadProjectBundle(projectId);
        if (
          created.generation !== 1
          || renamed.projectId !== projectId
          || bound.receipt.generation !== 2
          || closeDecision.status !== "PASS"
          || !closeDecision.noWrite
          || reopened.receipt.projectId !== saved.receipt.projectId
          || reopened.receipt.generation !== saved.receipt.generation
          || reopened.receipt.contentSha256 !== saved.receipt.contentSha256
          || reopened.receipt.activeSceneId !== saved.receipt.activeSceneId
          || reopened.receipt.sceneCount !== 2
          || reopened.receipt.assetCount !== 1
          || reopened.scenesJson.join("|") !== saved.scenesJson.join("|")
          || reopened.assets.map((asset) => `${asset.sha256}:${asset.registration?.assetId ?? ""}:${asset.registration?.role ?? ""}`).join("|") !== saved.assets.map((asset) => `${asset.sha256}:${asset.registration?.assetId ?? ""}:${asset.registration?.role ?? ""}`).join("|")
          || active.id !== second.id
          || active.background.assetId !== bound.assetId
          || !saved.receipt.noFoundryWrite
        ) throw new Error("Close/reopen self-test did not preserve the clean saved project across the memory-only close boundary.");
        await recordProjectStageReceipt({
          operation: "dicebox.project.stage-self-test",
          status: "PASS",
          phase: "save",
          projectId,
          generation: reopened.receipt.generation,
          sceneRevision: active.revision,
          selectedX: 0,
          contentSha256: reopened.receipt.contentSha256,
          sceneCount: reopened.receipt.sceneCount,
          assetId: bound.assetId,
          assetSha256: bound.sha256,
          bindingSceneId: active.id,
          noWrite: true,
        });
        globalThis.document.title = `DiceBox Project Close/Reopen PASS · ${projectId} · generation ${reopened.receipt.generation} · ${reopened.receipt.contentSha256} · memory-only close · no Foundry write`;
        if (import.meta.env.VITE_DBX_PROJECT_SELF_TEST_EXIT === "1") await finishProjectSelfTest("PASS");
        return;
      }
      if (mode === "workspace-acceptance") {
        const projectId = import.meta.env.VITE_DBX_PROJECT_SELF_TEST_ID ?? "dbx:project:desktop-workspace-acceptance-self-test";
        const first = createBlankProjectScene(projectId);
        const second = createBlankProjectScene(projectId, 2);
        const initialCatalog = await listProjectBundles();
        if (initialCatalog.entries.some((entry) => entry.projectId === projectId)) {
          throw new Error("Workspace acceptance self-test requires its fixed test-owned project ID to be absent; it will never overwrite an existing project.");
        }
        const created = await createProjectBundle(projectId, [first, second], second.id, "Stage 8 Workspace Acceptance", initialCatalog.workspaceIndexGeneration);
        if (
          created.generation !== 1
          || created.projectId !== projectId
          || created.sceneCount !== 2
          || created.assetCount !== 0
          || created.activeSceneId !== second.id
          || created.scenes.map((scene) => scene.sceneId).join("|") !== [first.id, second.id].join("|")
          || !created.workspaceMetadata
          || !created.directoryEntrySync
          || !created.workspaceMetadata.directoryEntrySync
          || created.workspaceMetadata.displayName !== "Stage 8 Workspace Acceptance"
          || created.backupPreserved
          || !created.noFoundryWrite
        ) throw new Error("Workspace acceptance create did not establish the exact test-owned two-Scene project envelope.");
        const renamed = await renameProjectBundle(projectId, "Stage 8 Workspace Acceptance Renamed", created.workspaceMetadata.indexGeneration);
        if (
          renamed.displayName !== "Stage 8 Workspace Acceptance Renamed"
          || renamed.projectId !== projectId
          || renamed.indexGeneration <= created.workspaceMetadata.indexGeneration
          || !renamed.noFoundryWrite
        ) throw new Error("Workspace acceptance rename did not preserve the same project identity and advance only workspace metadata.");
        const beforeBinding = await loadProjectBundle(projectId, renamed.indexGeneration);
        const sourceScenes = beforeBinding.scenesJson.map(parseStoredScene).map((scene) => ({
          ...scene,
          background: { color: scene.background.color, gridSize: scene.background.gridSize },
        }));
        const bound = await bindBackgroundAssetToScene(projectId, sourceScenes, second.id, beforeBinding.receipt.generation, {
          mediaType: "image/png",
          bytes: FOUNDATION_SELF_TEST_PNG_BYTES,
          label: "Stage 8 workspace acceptance background.png",
          provenance: "user-import",
        });
        const response = await loadProjectBundle(projectId);
        const scenes = response.scenesJson.map(parseStoredScene);
        const active = parseActiveStoredScene(response);
        const asset = response.assets.find((candidate) => candidate.registration?.assetId === bound.assetId);
        const catalog = await listProjectBundles();
        const entry = catalog.entries.find((candidate) => candidate.projectId === projectId);
        const inspection = await inspectProjectRecovery(projectId);
        if (
          bound.receipt.generation !== 2
          || !bound.receipt.directoryEntrySync
          || !bound.receipt.workspaceMetadata?.directoryEntrySync
          || !bound.receipt.backupPreserved
          || response.receipt.projectId !== projectId
          || response.receipt.generation !== bound.receipt.generation
          || response.receipt.contentSha256 !== bound.receipt.contentSha256
          || response.receipt.sceneCount !== 2
          || response.receipt.assetCount !== 1
          || response.receipt.activeSceneId !== second.id
          || response.receipt.scenes.map((scene) => scene.sceneId).join("|") !== [first.id, second.id].join("|")
          || new Set(response.receipt.scenes.map((scene) => scene.sceneSha256)).size !== 2
          || scenes[0]?.background.assetId !== undefined
          || active.id !== second.id
          || active.background.assetId !== bound.assetId
          || !asset
          || asset.registration?.assetId !== bound.assetId
          || asset.registration.role !== "background"
          || asset.sha256 !== bound.sha256
          || entry?.displayName !== "Stage 8 Workspace Acceptance Renamed"
          || entry.contentSha256 !== bound.receipt.contentSha256
          || entry.generation !== bound.receipt.generation
          || catalog.workspaceMetadataWarning !== null
          || inspection.status !== "PASS"
          || inspection.primary.status !== "VALID"
          || inspection.backup.status !== "VALID"
          || inspection.registeredAssets.length !== 1
          || inspection.registeredAssets[0]?.assetId !== bound.assetId
          || inspection.registeredAssets[0]?.disposition !== "PRESENT_VALID"
          || !inspection.noWrite
          || !inspection.noFoundryWrite
        ) throw new Error("Workspace acceptance did not preserve project identity, ordered Scene hashes, active binding, renamed workspace metadata, or backup disposition.");
        await recordProjectStageReceipt({
          operation: "dicebox.project.stage-self-test",
          status: "PASS",
          phase: "save",
          projectId,
          generation: response.receipt.generation,
          sceneRevision: active.revision,
          selectedX: 0,
          contentSha256: response.receipt.contentSha256,
          sceneCount: response.receipt.sceneCount,
          assetId: bound.assetId,
          assetSha256: bound.sha256,
          bindingSceneId: active.id,
          noWrite: true,
        });
        dispatch({ kind: "replace", document: active });
        setProjectScenes(scenes);
        setActiveSceneId(active.id);
        setProjectCatalog(catalog.entries);
        setSelectedProjectId(projectId);
        setActiveProjectId(projectId);
        setProjectGeneration(response.receipt.generation);
        setWorkspaceIndexGeneration(catalog.workspaceIndexGeneration);
        setProjectLoadResponse(response);
        setProjectSaveReceipt(bound.receipt);
        globalThis.document.title = `DiceBox Workspace Acceptance PASS · ${projectId} · generation ${response.receipt.generation} · ${response.receipt.contentSha256} · ${bound.assetId} · no Foundry write`;
        if (import.meta.env.VITE_DBX_PROJECT_SELF_TEST_EXIT === "1") await finishProjectSelfTest("PASS");
        return;
      }
      if (mode === "detach-reread") {
        const projectId = "dbx:project:desktop-background-detach-self-test";
        const response = await loadProjectBundle(projectId);
        const scenes = response.scenesJson.map(parseStoredScene);
        if (
          response.receipt.migrationStatus !== "current"
          || scenes.length !== 2
          || response.assets.length !== 0
          || scenes.some((scene) => scene.background.assetId !== undefined)
        ) throw new Error("Fresh-process detach reread did not preserve ordered unbound Scenes and descriptor removal.");
        globalThis.document.title = `DiceBox Missing Background Detach Restart PASS · ${projectId} · generation ${response.receipt.generation} · ${response.receipt.contentSha256} · no Foundry write`;
        return;
      }
      if (mode === "detach") {
        const projectId = "dbx:project:desktop-background-detach-self-test";
        const inspection = await inspectProjectRecovery(projectId);
        const eligible = inspection.registeredAssets.filter((asset) => asset.restoreEligible);
        if (
          inspection.status !== "BLOCKED"
          || inspection.blockerCode !== "REGISTERED_ASSET_BLOB_MISSING"
          || inspection.primary.status !== "VALID"
          || inspection.recoveredFrom !== undefined
          || eligible.length !== 1
          || !inspection.noWrite
          || !inspection.noFoundryWrite
        ) throw new Error("Packaged detach inspection did not isolate one primary-authoritative missing registered background.");
        const preview = await previewMissingAssetDetach(projectId, eligible[0].assetId);
        if (
          preview.generation + 1 !== preview.nextGeneration
          || preview.affectedScenes.length !== 1
          || preview.resultingScenes.length !== 2
          || preview.resultingAssetCount !== 0
          || !preview.requiresApproval
          || !preview.noWrite
          || !preview.noFoundryWrite
        ) throw new Error("Packaged detach preview did not bind exact Scene, descriptor, generation, and preservation scope.");
        const receipt = await detachMissingAsset(preview);
        const response = await loadProjectBundle(projectId);
        const scenes = response.scenesJson.map(parseStoredScene);
        if (
          receipt.previousGeneration !== preview.generation
          || receipt.generation !== preview.nextGeneration
          || receipt.contentSha256 !== preview.resultingContentSha256
          || !receipt.descriptorRemoved
          || !receipt.assetTreeUnchanged
          || !receipt.workspaceUnchanged
          || !receipt.foreignStateUnchanged
          || !receipt.backupPreservesPriorEnvelope
          || !receipt.targetRemainsAbsent
          || !receipt.authoritativeReload
          || !receipt.noFoundryWrite
          || response.receipt.contentSha256 !== receipt.contentSha256
          || response.assets.length !== 0
          || scenes.length !== 2
          || scenes.some((scene) => scene.background.assetId !== undefined)
        ) throw new Error("Packaged detach execution or authoritative reread violated its exact preservation contract.");
        setDetachReceipt(receipt);
        setProjectLoadResponse(response);
        setProjectScenes(scenes);
        setActiveSceneId(response.activeSceneId);
        setActiveProjectId(projectId);
        setSelectedProjectId(projectId);
        setProjectGeneration(receipt.generation);
        globalThis.document.title = `DiceBox Missing Background Detach PASS · ${receipt.assetId} · ${receipt.previewSha256} · generation ${receipt.previousGeneration}→${receipt.generation} · no Foundry write`;
        return;
      }
      if (mode === "detach-setup") {
        const projectId = "dbx:project:desktop-background-detach-self-test";
        const first = createBlankProjectScene(projectId);
        const second = createBlankProjectScene(projectId, 2);
        const catalog = await listProjectBundles();
        const existing = catalog.entries.find((entry) => entry.projectId === projectId);
        if (existing) throw new Error("Packaged detach setup requires an absent test-owned project ID.");
        await createProjectBundle(projectId, [first, second], second.id, "Missing Background Detach Self Test", catalog.workspaceIndexGeneration);
        const created = await loadProjectBundle(projectId);
        const result = await bindBackgroundAssetToScene(projectId, created.scenesJson.map(parseStoredScene), second.id, created.receipt.generation, {
          mediaType: "image/png",
          bytes: FOUNDATION_SELF_TEST_PNG_BYTES,
          label: "Detach background.png",
          provenance: "user-import",
        });
        const response = await loadProjectBundle(projectId);
        if (
          response.receipt.sceneCount !== 2
          || response.receipt.assetCount !== 1
          || parseActiveStoredScene(response).background.assetId !== result.assetId
        ) throw new Error("Packaged detach setup did not create one exact two-Scene registered binding.");
        globalThis.document.title = `DiceBox Missing Background Detach Setup PASS · ${result.assetId} · generation ${result.receipt.generation} · no Foundry write`;
        return;
      }
      if (mode === "migration-persist-setup") {
        const fixture = await prepareLegacyMigrationPersistenceFixture();
        const preview = await previewProjectMigrationPersist(fixture.projectId);
        if (
          fixture.sourceSchemaVersion !== "0.2.0"
          || preview.authoritativeSource !== "project.json"
          || preview.sourceSchemaVersion !== fixture.sourceSchemaVersion
          || preview.targetSchemaVersion !== "0.3.0"
          || preview.generation !== fixture.generation
          || preview.nextGeneration !== fixture.generation + 1
          || preview.persistedContentSha256 !== fixture.persistedContentSha256
          || preview.scenes.length !== 2
          || preview.assetCount !== 1
          || !preview.requiresApproval
          || !preview.noWrite
          || !preview.noFoundryWrite
        ) throw new Error("Packaged migration persistence preview did not bind the exact primary legacy project and no-write approval scope.");
        const proposalStorage = browserDesktopProjectProposalSessionStorage();
        const existingProposal = await loadDesktopProjectProposalSession(proposalStorage, fixture.projectId);
        if (existingProposal.status === "BLOCKED") throw new Error(existingProposal.reason);
        if (existingProposal.status === "PASS") {
          if (!["rejected", "cancelled", "stale", "committed", "recovered", "undone", "redone"].includes(existingProposal.session.history.status)) {
            throw new Error("Packaged migration self-test found a non-terminal prior proposal session.");
          }
          await clearTerminalDesktopProjectProposalSession(proposalStorage, fixture.projectId);
        }
        const observedAt = new Date().toISOString();
        const batch = await createProjectRecoveryProposalBatch({
          batchId: `dbx:proposal:packaged-migration-${Date.now()}`,
          preview,
          createdAt: observedAt,
        });
        const previewedHistory = await previewProposalBatch(batch, desktopProposalRequester, observedAt);
        const previewedSession = await createDesktopProjectProposalSession({ projectId: fixture.projectId, batch, history: previewedHistory });
        await saveDesktopProjectProposalSession(proposalStorage, fixture.projectId, previewedSession);
        const approvedSession = await approveDesktopProjectProposalSession(previewedSession, desktopProposalReviewer, batch.base, new Date().toISOString());
        await saveDesktopProjectProposalSession(proposalStorage, fixture.projectId, approvedSession);
        const applyingSession = await beginDesktopProjectProposalSessionApply(approvedSession, desktopProposalReviewer, batch.base, new Date().toISOString());
        await saveDesktopProjectProposalSession(proposalStorage, fixture.projectId, applyingSession);
        const receipt = await persistProjectMigration(preview);
        const response = await loadProjectBundle(fixture.projectId);
        const inspection = await inspectProjectRecovery(fixture.projectId);
        const explanation = await explainProjectMigration(fixture.projectId);
        const catalogAfterApply = await listProjectBundles();
        const catalogEntryAfterApply = catalogAfterApply.entries.find((entry) => entry.projectId === fixture.projectId);
        if (
          receipt.previousGeneration !== fixture.generation
          || receipt.generation !== fixture.generation + 1
          || receipt.previousContentSha256 !== fixture.persistedContentSha256
          || receipt.contentSha256 !== preview.resultingContentSha256
          || !receipt.semanticStateUnchanged
          || !receipt.assetTreeUnchanged
          || !receipt.workspaceUnchanged
          || !receipt.foreignStateUnchanged
          || !receipt.backupPreservesLegacyPrimary
          || !receipt.authoritativeCurrentReread
          || !receipt.directoryEntrySync
          || !receipt.noFoundryWrite
          || inspection.status !== "PASS"
          || inspection.projectId !== fixture.projectId
          || inspection.generation !== receipt.generation
          || inspection.contentSha256 !== receipt.contentSha256
          || inspection.migrationStatus !== "current"
          || inspection.primary.sourceSchemaVersion !== receipt.targetSchemaVersion
          || inspection.backup.sourceSchemaVersion !== receipt.sourceSchemaVersion
          || !inspection.noWrite
          || !inspection.noFoundryWrite
          || response.receipt.migrationStatus !== "current"
          || response.receipt.generation !== receipt.generation
          || response.receipt.contentSha256 !== receipt.contentSha256
          || response.receipt.sceneCount !== 2
          || !["PASS", "PARTIAL"].includes(catalogAfterApply.status)
          || !catalogEntryAfterApply
          || catalogEntryAfterApply.status !== "PASS"
          || catalogEntryAfterApply.generation !== receipt.generation
          || catalogEntryAfterApply.contentSha256 !== receipt.contentSha256
          || explanation.primary.sourceSchemaVersion !== "0.3.0"
          || explanation.backup.sourceSchemaVersion !== "0.2.0"
        ) throw new Error("Packaged migration persistence commit or authoritative reread violated the exact legacy-backup and semantic-preservation contract.");
        const committedSession = await commitDesktopProjectProposalSessionAfterReread(applyingSession, desktopProposalReviewer, { status: "matched", targetId: fixture.projectId as typeof batch.base.targetId, revision: receipt.generation, sha256: receipt.contentSha256 }, new Date().toISOString());
        if (committedSession.history.status !== "committed" || committedSession.history.receipts.length !== 4) throw new Error("Packaged migration proposal history did not commit after the matched authoritative reread.");
        await saveDesktopProjectProposalSession(proposalStorage, fixture.projectId, committedSession);
        setMigrationPersistReceipt(receipt);
        setMigrationExplanation(explanation);
        setProjectLoadResponse(response);
        setProjectProposalSession(committedSession);
        setSelectedProjectId(fixture.projectId);
        globalThis.document.title = `DiceBox Migration Persistence PASS · ${receipt.sourceSchemaVersion}→${receipt.targetSchemaVersion} · generation ${receipt.previousGeneration}→${receipt.generation} · ${receipt.previewSha256} · no Foundry write`;
        if (import.meta.env.VITE_DBX_PROJECT_SELF_TEST_EXIT === "1") await finishProjectSelfTest("PASS");
        return;
      }
      if (mode === "migration-persist-reread") {
        const projectId = "dbx:project:desktop-legacy-migration-persistence-self-test-v2";
        const response = await loadProjectBundle(projectId);
        const explanation = await explainProjectMigration(projectId);
        if (
          response.receipt.migrationStatus !== "current"
          || response.receipt.generation !== 2
          || response.receipt.sceneCount !== 2
          || response.receipt.assetCount !== 1
          || explanation.status !== "preview-only"
          || explanation.sourceSchemaVersion !== "0.3.0"
          || explanation.migrationStatus !== "current"
          || explanation.primary.status !== "VALID"
          || explanation.primary.sourceSchemaVersion !== "0.3.0"
          || explanation.backup.status !== "VALID"
          || explanation.backup.sourceSchemaVersion !== "0.2.0"
          || !response.receipt.noFoundryWrite
          || !explanation.noWrite
          || !explanation.noFoundryWrite
        ) throw new Error("Fresh-process migration persistence reread did not preserve current primary, legacy backup, two-Scene semantics, and no-write authority.");
        setMigrationExplanation(explanation);
        setProjectLoadResponse(response);
        setSelectedProjectId(projectId);
        globalThis.document.title = `DiceBox Migration Persistence Restart PASS · current generation ${response.receipt.generation} · legacy backup 0.2.0 · ${response.receipt.contentSha256} · no project or Foundry write`;
        if (import.meta.env.VITE_DBX_PROJECT_SELF_TEST_EXIT === "1") await finishProjectSelfTest("PASS");
        return;
      }
      if (mode === "migration") {
        const projectId = "dbx:project:desktop-migration-explanation-self-test";
        const explanation = await explainProjectMigration(projectId);
        const expectedActions = [
          "add-asset-registration-boundary-in-memory",
          "preserve-scenes-and-assets",
          "write-only-on-explicit-save",
        ];
        if (
          explanation.status !== "preview-only"
          || explanation.authoritativeSource !== "project.json"
          || explanation.sourceSchemaVersion !== "0.2.0"
          || explanation.targetSchemaVersion !== "0.3.0"
          || explanation.migrationStatus !== "migrated-in-memory"
          || explanation.actions.join("|") !== expectedActions.join("|")
          || explanation.blockers.length !== 0
          || !explanation.contentSha256
          || !explanation.noWrite
          || !explanation.noFoundryWrite
        ) throw new Error("Packaged migration explanation did not preserve exact legacy source, ordered actions, and no-write authority.");
        setMigrationExplanation(explanation);
        setSelectedProjectId(projectId);
        globalThis.document.title = `DiceBox Migration Explanation PASS · ${explanation.authoritativeSource} · ${explanation.sourceSchemaVersion}→${explanation.targetSchemaVersion} · ${explanation.contentSha256} · no project or Foundry write`;
        return;
      }
      if (mode === "recovery") {
        const projectId = "dbx:project:desktop-background-asset-self-test";
        const inspection = await inspectProjectRecovery(projectId);
        const eligible = inspection.registeredAssets.filter((asset) => asset.restoreEligible);
        if (
          inspection.status !== "BLOCKED"
          || inspection.blockerCode !== "REGISTERED_ASSET_BLOB_MISSING"
          || !inspection.noWrite
          || !inspection.noFoundryWrite
          || eligible.length !== 1
          || eligible[0].mediaType !== "image/png"
        ) throw new Error("Packaged recovery inspection did not isolate exactly one missing registered PNG blob without writing.");
        const preview = await previewMissingAssetRestore(projectId, eligible[0].assetId, eligible[0].mediaType, FOUNDATION_SELF_TEST_PNG_BYTES);
        if (
          preview.assetId !== eligible[0].assetId
          || preview.assetSha256 !== eligible[0].sha256
          || preview.candidateSha256 !== eligible[0].sha256
          || preview.candidateByteLength !== eligible[0].byteLength
          || !preview.requiresApproval
          || !preview.noWrite
          || !preview.noFoundryWrite
        ) throw new Error("Packaged recovery preview did not bind the exact registered asset bytes and approval scope.");
        const receipt = await restoreMissingAsset(preview, FOUNDATION_SELF_TEST_PNG_BYTES);
        const rereadInspection = await inspectProjectRecovery(projectId);
        const restored = rereadInspection.registeredAssets.find((asset) => asset.assetId === preview.assetId);
        if (
          receipt.assetSha256 !== preview.assetSha256
          || receipt.previewSha256 !== preview.previewSha256
          || receipt.authoritativeAssetSha256 !== preview.assetSha256
          || !receipt.createNewOnly
          || !receipt.noProjectWrite
          || !receipt.noFoundryWrite
          || rereadInspection.status !== "PASS"
          || rereadInspection.restoreEligible
          || restored?.disposition !== "PRESENT_VALID"
        ) throw new Error("Packaged recovery authoritative reread did not prove an exact create-new-only restore.");
        const response = await loadProjectBundle(projectId);
        const scenes = response.scenesJson.map(parseStoredScene);
        const active = parseActiveStoredScene(response);
        const asset = response.assets.find((candidate) => candidate.registration?.assetId === active.background.assetId);
        if (
          response.receipt.contentSha256 !== preview.contentSha256
          || response.receipt.contentSha256 !== receipt.authoritativeProjectContentSha256
          || asset?.sha256 !== preview.assetSha256
          || scenes.length !== 2
        ) throw new Error("Recovered project load did not preserve the exact envelope, Scene set, and registered asset identity.");
        const foundry = await compileSceneFoundryPreview({ projectId, scene: active, assets: response.assets });
        if (foundry.blockers.length > 0) throw new Error(`Recovered background preview remained blocked: ${foundry.blockers.join(", ")}`);
        await recordProjectStageReceipt({
          operation: "dicebox.project.stage-self-test",
          status: "PASS",
          phase: "load-and-compile",
          projectId,
          generation: response.receipt.generation,
          sceneRevision: active.revision,
          selectedX: 0,
          contentSha256: response.receipt.contentSha256,
          planSha256: foundry.planSha256,
          candidateCount: foundry.documents.length,
          sceneCount: scenes.length,
          assetId: receipt.assetId,
          assetSha256: receipt.authoritativeAssetSha256,
          bindingSceneId: active.id,
          noWrite: true,
        });
        setRecoveryInspection(rereadInspection);
        setRecoveryReceipt(receipt);
        dispatch({ kind: "replace", document: active });
        setProjectScenes(scenes);
        setActiveSceneId(active.id);
        setActiveProjectId(projectId);
        setSelectedProjectId(projectId);
        setProjectGeneration(response.receipt.generation);
        setProjectLoadResponse(response);
        setFoundryPreview(foundry);
        globalThis.document.title = `DiceBox Missing Asset Recovery PASS · ${receipt.assetId} · ${receipt.previewSha256} · ${foundry.planSha256} · create-new-only · no project or Foundry write`;
        return;
      }
      if (mode === "asset-reread") {
        const projectId = "dbx:project:desktop-background-asset-self-test";
        const response = await loadProjectBundle(projectId);
        const scenes = response.scenesJson.map(parseStoredScene);
        const active = parseActiveStoredScene(response);
        const asset = response.assets.find((candidate) => candidate.registration?.assetId === active.background.assetId);
        if (
          response.receipt.migrationStatus !== "current"
          || scenes.length !== 2
          || active.id !== createBlankProjectScene(projectId, 2).id
          || scenes[0]?.background.assetId !== undefined
          || !active.background.assetId
          || asset?.registration?.role !== "background"
          || response.assets.length !== 1
        ) throw new Error("Fresh-process background asset reread did not preserve exact Scene binding and registration identity.");
        const preview = await compileSceneFoundryPreview({ projectId, scene: active, assets: response.assets });
        if (preview.blockers.length > 0) throw new Error(`Bound background preview remained blocked: ${preview.blockers.join(", ")}`);
        await recordProjectStageReceipt({
          operation: "dicebox.project.stage-self-test",
          status: "PASS",
          phase: "load-and-compile",
          projectId,
          generation: response.receipt.generation,
          sceneRevision: active.revision,
          selectedX: 0,
          contentSha256: response.receipt.contentSha256,
          planSha256: preview.planSha256,
          candidateCount: preview.documents.length,
          sceneCount: scenes.length,
          assetId: asset.registration.assetId,
          assetSha256: asset.sha256,
          bindingSceneId: active.id,
          noWrite: true,
        });
        globalThis.document.title = `DiceBox Background Asset Restart PASS · ${asset.registration.assetId} · ${active.id} · ${preview.planSha256} · no Foundry write`;
        return;
      }
      if (mode === "asset") {
        const projectId = "dbx:project:desktop-background-asset-self-test";
        const first = createBlankProjectScene(projectId);
        const second = createBlankProjectScene(projectId, 2);
        const catalog = await listProjectBundles();
        const existing = catalog.entries.find((entry) => entry.projectId === projectId && entry.status === "PASS");
        const created = existing
          ? await loadProjectBundle(projectId)
          : await createProjectBundle(projectId, [first, second], second.id, "Background Asset Self Test", catalog.workspaceIndexGeneration).then(() => loadProjectBundle(projectId));
        const sourceScenes = created.scenesJson.map(parseStoredScene).map((scene) => ({
          ...scene,
          background: { color: scene.background.color, gridSize: scene.background.gridSize },
        }));
        const result = await bindBackgroundAssetToScene(projectId, sourceScenes, second.id, created.receipt.generation, {
          mediaType: "image/png",
          bytes: FOUNDATION_SELF_TEST_PNG_BYTES,
          label: "Packaged background.png",
          provenance: "user-import",
        });
        const response = await loadProjectBundle(projectId);
        const active = parseActiveStoredScene(response);
        const registered = response.assets.find((asset) => asset.registration?.assetId === result.assetId);
        if (response.receipt.sceneCount !== 2 || response.receipt.assetCount !== 1 || active.background.assetId !== result.assetId || !registered) {
          throw new Error("Packaged background import did not preserve one exact registered binding.");
        }
        await recordProjectStageReceipt({
          operation: "dicebox.project.stage-self-test",
          status: "PASS",
          phase: "save",
          projectId,
          generation: result.receipt.generation,
          sceneRevision: active.revision,
          selectedX: 0,
          contentSha256: result.receipt.contentSha256,
          sceneCount: response.receipt.sceneCount,
          assetId: result.assetId,
          assetSha256: result.sha256,
          bindingSceneId: active.id,
          noWrite: true,
        });
        globalThis.document.title = `DiceBox Background Asset Save PASS · ${result.assetId} · ${active.id} · generation ${result.receipt.generation} · no Foundry write`;
        return;
      }
      if (mode === "multiscene-reread") {
        const projectId = "dbx:project:desktop-multiscene-self-test";
        const response = await loadProjectBundle(projectId);
        const scenes = response.scenesJson.map(parseStoredScene);
        const active = parseActiveStoredScene(response);
        if (
          response.receipt.migrationStatus !== "current"
          || response.receipt.sceneCount !== 2
          || response.receipt.scenes.length !== 2
          || active.id !== createBlankProjectScene(projectId, 2).id
          || new Set(scenes.map((scene) => scene.id)).size !== 2
        ) throw new Error("Fresh-process multi-Scene reread did not preserve order, identity, hashes, and active navigation.");
        const preview = await compileSceneFoundryPreview({ projectId, scene: active, assets: response.assets });
        await recordProjectStageReceipt({
          operation: "dicebox.project.stage-self-test",
          status: "PASS",
          phase: "load-and-compile",
          projectId,
          generation: response.receipt.generation,
          sceneRevision: active.revision,
          selectedX: 0,
          contentSha256: response.receipt.contentSha256,
          planSha256: preview.planSha256,
          candidateCount: preview.documents.length,
          noWrite: true,
        });
        dispatch({ kind: "replace", document: active });
        setProjectScenes(scenes);
        setActiveSceneId(active.id);
        setActiveProjectId(projectId);
        setSelectedProjectId(projectId);
        setProjectGeneration(response.receipt.generation);
        setProjectLoadResponse(response);
        setFoundryPreview(preview);
        globalThis.document.title = `DiceBox Multi-Scene Restart PASS · ${projectId} · generation ${response.receipt.generation} · active ${active.id} · ${preview.documents.length} selected-Scene candidates · no Foundry write`;
        return;
      }
      if (mode === "multiscene") {
        const projectId = "dbx:project:desktop-multiscene-self-test";
        const first = createBlankProjectScene(projectId);
        const second = createBlankProjectScene(projectId, 2);
        const catalog = await listProjectBundles();
        const existing = catalog.entries.find((entry) => entry.projectId === projectId && entry.status === "PASS");
        const receipt = existing
          ? await saveProjectBundle(projectId, [first, second], second.id, existing.generation ?? 0)
          : await createProjectBundle(projectId, [first, second], second.id, "Multi-Scene Self Test", catalog.workspaceIndexGeneration);
        const response = await loadProjectBundle(projectId);
        const scenes = response.scenesJson.map(parseStoredScene);
        const active = parseActiveStoredScene(response);
        if (
          receipt.sceneCount !== 2
          || response.receipt.sceneCount !== 2
          || response.receipt.contentSha256 !== receipt.contentSha256
          || response.receipt.scenes.map((scene) => scene.sceneId).join("|") !== [first.id, second.id].join("|")
          || active.id !== second.id
        ) throw new Error("Packaged multi-Scene save/load did not preserve ordered identity, hashes, and active navigation.");
        await recordProjectStageReceipt({
          operation: "dicebox.project.stage-self-test",
          status: "PASS",
          phase: "save",
          projectId,
          generation: receipt.generation,
          sceneRevision: active.revision,
          selectedX: 0,
          contentSha256: receipt.contentSha256,
          noWrite: true,
        });
        dispatch({ kind: "replace", document: active });
        setProjectScenes(scenes);
        setActiveSceneId(active.id);
        setActiveProjectId(projectId);
        setSelectedProjectId(projectId);
        setProjectGeneration(response.receipt.generation);
        setProjectLoadResponse(response);
        setProjectSaveReceipt(receipt);
        globalThis.document.title = `DiceBox Multi-Scene Save PASS · ${projectId} · generation ${receipt.generation} · ${receipt.sceneCount} Scenes · active ${receipt.activeSceneId} · no Foundry write`;
        return;
      }
      if (mode === "workspace-reread") {
        const catalog = await listProjectBundles();
        const source = catalog.entries.find((entry) => entry.status === "PASS" && entry.displayName === "Workspace Source Renamed");
        const target = catalog.entries.find((entry) => entry.status === "PASS" && entry.displayName === "Workspace Copy Renamed");
        if (!source || !target || source.lastOpenedSequence <= target.lastOpenedSequence || catalog.workspaceMetadataWarning) {
          throw new Error("Persisted workspace display names or deterministic recent order did not survive restart.");
        }
        const sourceLoad = await loadProjectBundle(source.projectId);
        const targetLoad = await loadProjectBundle(target.projectId);
        if (
          sourceLoad.receipt.sceneSha256 !== targetLoad.receipt.sceneSha256
          || sourceLoad.receipt.contentSha256 === targetLoad.receipt.contentSha256
          || sourceLoad.workspaceMetadata
          || targetLoad.workspaceMetadata
        ) throw new Error("Restart reread changed project content or wrote workspace recency.");
        const sourceScene = parseActiveStoredScene(sourceLoad);
        dispatch({ kind: "replace", document: sourceScene });
        setProjectScenes(sourceLoad.scenesJson.map(parseStoredScene));
        setActiveSceneId(sourceLoad.activeSceneId);
        setProjectCatalog(catalog.entries);
        setSelectedProjectId(source.projectId);
        setActiveProjectId(source.projectId);
        setProjectGeneration(sourceLoad.receipt.generation);
        setWorkspaceIndexGeneration(catalog.workspaceIndexGeneration);
        setProjectLoadResponse(sourceLoad);
        globalThis.document.title = `DiceBox Workspace Metadata Restart PASS · ${source.projectId} · ${target.projectId} · workspace generation ${catalog.workspaceIndexGeneration} · no metadata write · no Foundry write`;
        return;
      }
      if (mode === "workspace") {
        const sourceProjectId = projectIdFromInput(`workspace-self-test-${Date.now()}`);
        const targetProjectId = `${sourceProjectId}-copy`;
        const sourceScene = createBlankProjectScene(sourceProjectId);
        const initialCatalog = await listProjectBundles();
        const sourceCreate = await createProjectBundle(sourceProjectId, [sourceScene], sourceScene.id, "Workspace Source", initialCatalog.workspaceIndexGeneration);
        const sourceLoad = await loadProjectBundle(sourceProjectId, sourceCreate.workspaceMetadata?.indexGeneration);
        const targetSave = await saveProjectAsBundle(sourceProjectId, targetProjectId, [sourceScene], sourceScene.id, "Workspace Copy", sourceLoad.workspaceMetadata?.indexGeneration ?? 0);
        const sourceRename = await renameProjectBundle(sourceProjectId, "Workspace Source Renamed", targetSave.workspaceMetadata?.indexGeneration ?? 0);
        const targetRename = await renameProjectBundle(targetProjectId, "Workspace Copy Renamed", sourceRename.indexGeneration);
        const targetLoad = await loadProjectBundle(targetProjectId, targetRename.indexGeneration);
        const sourceReread = await loadProjectBundle(sourceProjectId, targetLoad.workspaceMetadata?.indexGeneration);
        const catalog = await listProjectBundles();
        const bothCataloged = [sourceProjectId, targetProjectId].every((projectId) => catalog.entries.some((entry) => entry.projectId === projectId && entry.status === "PASS"));
        const sourceCatalog = catalog.entries.find((entry) => entry.projectId === sourceProjectId);
        const targetCatalog = catalog.entries.find((entry) => entry.projectId === targetProjectId);
        if (
          sourceCreate.generation !== 1
          || targetSave.generation !== 1
          || !sourceCreate.workspaceMetadata
          || !sourceLoad.workspaceMetadata
          || !targetSave.workspaceMetadata
          || !targetLoad.workspaceMetadata
          || !sourceReread.workspaceMetadata
          || sourceLoad.receipt.contentSha256 !== sourceReread.receipt.contentSha256
          || sourceLoad.receipt.sceneSha256 !== targetLoad.receipt.sceneSha256
          || sourceRename.lastOpenedSequence !== sourceLoad.workspaceMetadata.lastOpenedSequence
          || targetRename.lastOpenedSequence !== targetSave.workspaceMetadata.lastOpenedSequence
          || sourceCatalog?.displayName !== "Workspace Source Renamed"
          || targetCatalog?.displayName !== "Workspace Copy Renamed"
          || catalog.entries.findIndex((entry) => entry.projectId === sourceProjectId) >= catalog.entries.findIndex((entry) => entry.projectId === targetProjectId)
          || sourceScene.entities.length !== 0
          || sourceScene.id.includes("fixture")
          || !bothCataloged
        ) throw new Error("Packaged workspace reread did not preserve the bounded project contract.");
        const targetScene = parseActiveStoredScene(targetLoad);
        dispatch({ kind: "replace", document: targetScene });
        setProjectScenes(targetLoad.scenesJson.map(parseStoredScene));
        setActiveSceneId(targetLoad.activeSceneId);
        setProjectCatalog(catalog.entries);
        setSelectedProjectId(targetProjectId);
        setActiveProjectId(targetProjectId);
        setProjectGeneration(targetLoad.receipt.generation);
        setWorkspaceIndexGeneration(catalog.workspaceIndexGeneration);
        setWorkspaceMetadataWarning(catalog.workspaceMetadataWarning);
        setProjectLoadResponse(targetLoad);
        setProjectSaveReceipt(targetSave);
        globalThis.document.title = `DiceBox Workspace Metadata PASS · ${sourceProjectId} · ${targetProjectId} · workspace generation ${catalog.workspaceIndexGeneration} · content ${targetLoad.receipt.contentSha256} · no Foundry write`;
        return;
      }
      if (mode === "save") {
        let generation = 0;
        try {
          generation = (await loadFoundationSelfTestBundle()).receipt.generation;
        } catch {
          generation = 0;
        }
        const staged = applySceneCommand(fixtureScene, {
          schemaVersion: "0.1.0",
          kind: "translate-entity",
          commandId: "project-self-test-save",
          baseRevision: fixtureScene.revision,
          entityId: "dbx:apparatus:core",
          deltaX: 16,
          deltaY: 0,
          origin: { kind: "human", principalId: "desktop-self-test", reason: "Persist restart fixture" },
        }).document;
        const receipt = await saveFoundationSelfTestBundle(staged, generation);
        const selectedX = staged.entities.find((entity) => entity.id === "dbx:apparatus:core")?.x ?? -1;
        await recordProjectStageReceipt({
          operation: "dicebox.project.stage-self-test",
          status: "PASS",
          phase: "save",
          projectId: FOUNDATION_SELF_TEST_PROJECT_ID,
          generation: receipt.generation,
          sceneRevision: staged.revision,
          selectedX,
          contentSha256: receipt.contentSha256,
          noWrite: true,
        });
        globalThis.document.title = `DiceBox Project Save PASS · generation ${receipt.generation}`;
        return;
      }
      const response = await loadFoundationSelfTestBundle();
      const loaded = parseActiveStoredScene(response);
      const preview = await compileSceneFoundryPreview({
        projectId: FOUNDATION_SELF_TEST_PROJECT_ID,
        scene: loaded,
        assets: response.assets,
      });
      const selectedX = loaded.entities.find((entity) => entity.id === "dbx:apparatus:core")?.x ?? -1;
      await recordProjectStageReceipt({
        operation: "dicebox.project.stage-self-test",
        status: "PASS",
        phase: "load-and-compile",
        projectId: FOUNDATION_SELF_TEST_PROJECT_ID,
        generation: response.receipt.generation,
        sceneRevision: loaded.revision,
        selectedX,
        contentSha256: response.receipt.contentSha256,
        planSha256: preview.planSha256,
        candidateCount: preview.documents.length,
        noWrite: true,
      });
      dispatch({ kind: "replace", document: loaded });
      setProjectScenes(response.scenesJson.map(parseStoredScene));
      setActiveSceneId(response.activeSceneId);
      setProjectGeneration(response.receipt.generation);
      setProjectLoadResponse(response);
      setFoundryPreview(preview);
      globalThis.document.title = `DiceBox Project Reload PASS · generation ${response.receipt.generation} · ${preview.documents.length} candidates`;
    };
    void run().catch(async (error: unknown) => {
      const message = error instanceof Error ? error.message : JSON.stringify(error);
      setProjectError(message);
      globalThis.document.title = `DiceBox Project Self-Test BLOCKED · ${message}`;
       if (import.meta.env.VITE_DBX_PROJECT_SELF_TEST_EXIT === "1" && (mode?.startsWith("selected-recovery") || mode?.startsWith("handout-asset") || mode?.startsWith("audio-asset") || mode?.startsWith("token-asset") || mode?.startsWith("backup-promotion") || mode?.startsWith("dangling-reference") || mode?.startsWith("broken-reference-detach") || mode?.startsWith("migration-persist") || mode?.startsWith("close-reopen") || mode === "workspace-acceptance" || mode === "workspace-acceptance-reread" || mode === "rename-execute" || mode === "rename-ui-execute" || mode === "save-execute" || mode === "create-execute" || mode === "save-as-execute" || mode === "save-as-ui-execute" || mode === "asset-bind-execute" || mode === "add-scene-execute" || mode === "persistent-add-scene-execute" || mode === "handout-register-execute" || mode === "audio-register-execute" || mode === "token-register-execute")) {
        await finishProjectSelfTest("BLOCKED");
      }
    });
  }, [nativeProjectStoreAvailable]);

  useEffect(() => {
    if (!nativeProjectStoreAvailable || import.meta.env.VITE_DBX_PROJECT_SELF_TEST || import.meta.env.VITE_DBX_SOURCE_FIDELITY_SELF_TEST === "1") return;
    void refreshProjectCatalog().catch((error: unknown) => setProjectError(formatProjectStoreFailure(error)));
  }, [nativeProjectStoreAvailable, refreshProjectCatalog]);

  useEffect(() => {
    if (!nativeProjectStoreAvailable || projectCatalog.length === 0 || projectCatalogFocusInitialized.current) return;
    projectCatalogFocusInitialized.current = true;
    focusProjectCatalog();
    setProjectCatalogFocusStatus(globalThis.document.activeElement === projectCatalogRef.current ? "focused" : "not-focused");
  }, [focusProjectCatalog, nativeProjectStoreAvailable, projectCatalog.length]);

  useEffect(() => {
    function handleKeyboardNudge(event: KeyboardEvent) {
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLSelectElement || event.target instanceof HTMLTextAreaElement) return;
      if (event.key === "ArrowLeft") void nudge(-8, 0);
      else if (event.key === "ArrowRight") void nudge(8, 0);
      else if (event.key === "ArrowUp") void nudge(0, -8);
      else if (event.key === "ArrowDown") void nudge(0, 8);
      else return;
      event.preventDefault();
    }

    window.addEventListener("keydown", handleKeyboardNudge);
    return () => window.removeEventListener("keydown", handleKeyboardNudge);
  }, [nudge]);

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <span className="eyebrow">DiceBox Campaign Helper</span>
          <h1>{document.name}</h1>
        </div>
        <div className={errors.length === 0 ? "status status--ok" : "status status--blocked"} aria-live="polite">
          {errors.length === 0 ? `Semantic document valid · revision ${document.revision}` : `${errors.length} validation blockers`}
        </div>
      </header>

      <nav className="project-nav" aria-label="Project navigation">
        <h2>Project</h2>
        <button className="nav-item nav-item--active" type="button">Scenes</button>
        <button className="nav-item" type="button" disabled>Actors</button>
        <button className="nav-item" type="button" disabled>Items</button>
        <button className="nav-item" type="button" disabled>Compile</button>
        <div className="project-summary">
          <span>Schema</span><strong>{document.schemaVersion}</strong>
          <span>Revision</span><strong>{document.revision}</strong>
          <span>Entities</span><strong>{document.entities.length}</strong>
        </div>
        <section className="utility-harness" aria-labelledby="utility-harness-heading">
          <div className="utility-harness__heading">
            <h2 id="utility-harness-heading">Utility harness</h2>
            <span>read-only</span>
          </div>
          <dl>
            <div><dt>Document</dt><dd>{document.id}</dd></div>
            <div><dt>Views</dt><dd>main + preview</dd></div>
            <div><dt>Command path</dt><dd>SceneCommand</dd></div>
            <div><dt>Capabilities</dt><dd>core:default</dd></div>
          </dl>
          <button type="button" onClick={runUtilityHarness}>Run local checks</button>
          <output aria-live="polite">
            {harnessReceipt
              ? `${harnessReceipt.status}: ${harnessReceipt.projectedEntities} entities · ${harnessReceipt.synchronizedViews} views · origin parity ${harnessReceipt.originParity ? "PASS" : "BLOCKED"} · no write`
              : "Checks not run."}
          </output>
          <button type="button" disabled={!nativeCodexProbeAvailable || codexJobBusy || codexAccount?.status !== "PASS"} onClick={runTechnicalBuilderAcceptance}>
            {codexJobBusy ? "Running isolated technical job…" : "Run isolated technical acceptance job"}
          </button>
          <output aria-live="polite">
            {codexJobError
              ?? (codexJobReceipt
                ? `${codexJobReceipt.status}: ${codexJobReceipt.readback.changedPaths.length} isolated file reread · runtime authority false · integration still requires review`
                : "No Codex technical job run.")}
          </output>
        </section>
      </nav>

      <main className="workspace" aria-label="Scene editor">
        <section className="canvas-panel" aria-labelledby="canvas-heading">
          <div className="panel-heading"><h2 id="canvas-heading">Semantic canvas</h2><span>1536 × 1024</span></div>
          <SceneViewport document={document} selectedEntityId={state.selectedEntityId} label="Semantic Scene main canvas" onSelect={select} />
          <aside className="preview-card" aria-labelledby="preview-heading">
            <div className="preview-heading"><h2 id="preview-heading">Map preview</h2><span>same document</span></div>
            <SceneViewport compact document={document} selectedEntityId={state.selectedEntityId} label="Upper-right synchronized map preview" />
          </aside>
        </section>
      </main>

      <aside className="inspector" aria-label="Scene inspector">
        <h2>Inspector</h2>
        <label htmlFor="entity-select">Selected object</label>
        <select id="entity-select" value={state.selectedEntityId} onChange={(event) => select(event.target.value)}>
          {document.entities.map((entity) => <option key={entity.id} value={entity.id}>{entity.name}</option>)}
        </select>
        {selected && <div className="property-grid">
          <span>Stable ID</span><code>{selected.id}</code>
          <span>Kind</span><strong>{selected.kind}</strong>
          <span>X / Y</span><strong>{selected.x} / {selected.y}</strong>
          <span>Size</span><strong>{selected.width} × {selected.height}</strong>
          <span>Authority</span><strong>{selected.locked ? "Fixture locked" : "Editable"}</strong>
        </div>}
        <fieldset disabled={!selected || selected.locked}>
          <legend>Move selected object</legend>
          {selected && <form className="position-form" key={`${selected.id}:${document.revision}`} onSubmit={applyPosition}>
            <label htmlFor="position-x">X</label>
            <input id="position-x" name="x" type="number" defaultValue={selected.x} step="1" />
            <label htmlFor="position-y">Y</label>
            <input id="position-y" name="y" type="number" defaultValue={selected.y} step="1" />
            <button type="submit">Preview position</button>
          </form>}
          <div className="nudge-grid">
            <button type="button" onClick={() => void nudge(0, -8)} aria-label="Preview moving selected object up">↑</button>
            <button type="button" onClick={() => void nudge(-8, 0)} aria-label="Preview moving selected object left">←</button>
            <button type="button" onClick={() => void nudge(8, 0)} aria-label="Preview moving selected object right">→</button>
            <button type="button" onClick={() => void nudge(0, 8)} aria-label="Preview moving selected object down">↓</button>
          </div>
          <p>Arrow keys preview an eight-unit semantic move; approval and Apply are required.</p>
        </fieldset>
        <section className="approval-tray" aria-labelledby="approval-heading">
          <h2 id="approval-heading">History & approval</h2>
          <p>{state.lastError ?? (state.lastReceipt ? `${state.lastReceipt.operation} · revision ${document.revision}` : "No proposed commands.")}</p>
          <div className="history-actions">
            <button type="button" disabled={state.history.past.length === 0} onClick={() => void undoDesktopHistory()}>Undo</button>
            <button type="button" disabled={state.history.future.length === 0} onClick={() => void redoDesktopHistory()}>Redo</button>
          </div>
          <div className="campaign-director-chat">
            <h3>Campaign Director</h3>
            <p>{directorPersistenceStatus}</p>
            <ol className="campaign-director-history" aria-label="Campaign Director conversation history">
              {directorConversation.messages.length === 0 && <li>No conversation turns yet.</li>}
              {directorConversation.messages.map((message) => <li key={message.messageId}>
                <strong>{message.role === "user" ? "You" : "Director"}</strong>
                <span>{message.content}</span>
                {message.citations.length > 0 && <small>{message.citations.map((citation) => `${citation.label} [${citation.sourceId}]`).join(" · ")}</small>}
              </li>)}
            </ol>
            <form onSubmit={submitDirectorPrompt}>
              <label htmlFor="campaign-director-prompt">Ask, inspect, preview, or request recovery</label>
              <textarea
                id="campaign-director-prompt"
                value={directorPrompt}
                onChange={(event) => setDirectorPrompt(event.target.value)}
                maxLength={1200}
                rows={3}
                disabled={!directorPersistenceReady || directorBusy || !selected || selected.locked}
              />
              <button type="submit" disabled={!directorPersistenceReady || directorBusy || !selected || selected.locked || directorPrompt.trim().length === 0}>
                {directorBusy ? "Streaming Campaign Director…" : nativeCampaignDirectorAvailable ? `Send via ${directorProviderMode}` : "Preview locally (no provider)"}
              </button>
            </form>
            <div className="history-actions">
              <button type="button" disabled={!directorConversation.turns.some((turn) => turn.status === "streaming")} onClick={cancelDirectorRequest}>Cancel turn</button>
              <button type="button" disabled={directorBusy || !directorConversation.turns.some((turn) => ["cancelled", "blocked", "offline"].includes(turn.status))} onClick={retryDirectorRequest}>Retry last blocked turn</button>
            </div>
            {directorConversation.turns.at(-1) && <small>
              Intent {directorConversation.turns.at(-1)!.intent} · {directorConversation.turns.at(-1)!.status} · context {directorConversation.turns.at(-1)!.contextBudget.usedChars}/{directorConversation.turns.at(-1)!.contextBudget.requestedChars} chars · attempt {directorConversation.turns.at(-1)!.attempt} · no write
            </small>}
          </div>
          <output aria-live="polite">
            {directorError ?? (directorProposal?.status === "BLOCKED"
              ? `BLOCKED: ${directorProposal.code} · ${directorProposal.reason}`
              : directorProposalSessionStatus)}
          </output>
          {directorProposalInspection && <div className="property-grid" aria-label="Generic proposal review details">
            <span>Producer / provider</span><strong>{directorProposalInspection.producer.kind} · {directorProposalInspection.producer.provider ?? "none"}</strong>
            <span>Batch</span><code>{directorProposalInspection.batchId} · r{directorProposalInspection.batchRevision}</code>
            <span>SHA-256</span><code>{directorProposalInspection.batchSha256}</code>
            <span>Risk / status</span><strong>{directorProposalInspection.risk} · {directorProposalInspection.status}</strong>
            <span>Review authority</span><strong>{directorProposalInspection.reviewAuthority.domain} · {directorProposalInspection.reviewAuthority.requiredRole}</strong>
            <span>Target authority</span><strong>{directorProposalInspection.targetAuthority.domain} · active GM {String(directorProposalInspection.targetAuthority.requiredActiveGm)}</strong>
            <span>Commands / receipts</span><strong>{directorProposalInspection.commandCount} / {directorProposalInspection.historyLength}</strong>
            <span>Dependencies</span><code>{directorProposalSession?.batch.commands.flatMap((command) => command.dependsOn).join(", ") || "none"}</code>
          </div>}
          <div className="history-actions" aria-label="Proposal review actions">
            <button type="button" disabled={directorProposalSession?.history.status !== "previewed"} onClick={() => void approveDirectorProposal()}>Approve exact proposal</button>
            <button type="button" disabled={directorProposalSession?.history.status !== "previewed"} onClick={() => void editDirectorProposal()}>Edit: double X move</button>
            <button type="button" disabled={directorProposalSession?.history.status !== "previewed"} onClick={() => void rejectDirectorProposal()}>Reject</button>
            <button type="button" disabled={!directorProposalSession || !["previewed", "approved"].includes(directorProposalSession.history.status)} onClick={() => void cancelDirectorProposal()}>Cancel proposal</button>
            <button type="button" disabled={directorProposalSession?.history.status !== "approved"} onClick={() => void applyDirectorProposal()}>Apply approved proposal</button>
          </div>
          {directorProposalSession && <ol className="campaign-director-history" aria-label="Append-only proposal receipt history">
            {directorProposalSession.history.receipts.map((receipt) => <li key={receipt.receiptId}>
              <strong>{receipt.sequence}. {receipt.transition}</strong>
              <span>{receipt.fromStatus ?? "new"} → {receipt.toStatus} · {receipt.actor.role} · {receipt.observedAt}</span>
              {receipt.reread && <small>reread {receipt.reread.status} · revision {receipt.reread.revision ?? "unknown"} · {receipt.reread.sha256 ?? "hash unknown"}</small>}
            </li>)}
          </ol>}
        </section>
        <section className="native-geometry" aria-labelledby="native-geometry-heading">
          <h2 id="native-geometry-heading">Native geometry</h2>
          <p>One batched Rust IPC computes a deterministic patch. The shared SceneCommand path applies it as one undoable revision.</p>
          <button type="button" disabled={!nativeGeometryAvailable || geometryBusy || !selected || selected.locked} onClick={commitNativeGeometry}>
            {geometryBusy ? "Computing 10k fixture…" : "Commit +8 X with 10k index"}
          </button>
          <output aria-live="polite">
            {geometryError
              ?? (geometryReceipt
                ? `PASS: ${geometryReceipt.stats.entityCount} indexed · ${geometryReceipt.patches.length} patched · revision ${geometryReceipt.beforeRevision}→${geometryReceipt.afterRevision} · no external write`
                : nativeGeometryAvailable ? "Ready for a native geometry commit." : "Native geometry is available in the packaged desktop app.")}
          </output>
        </section>
        <section className="project-store" aria-labelledby="project-store-heading">
          <h2 id="project-store-heading">Project &amp; compile</h2>
          <p>Fixed app-local projects with ordered Scenes, one explicit active Scene, immutable IDs, mutable project display names, deterministic recent ordering, atomic save, and a no-write Foundry 14 preview. No project opens automatically.</p>
          <label htmlFor="project-name">Display name for create, save-as, or rename</label>
          <input id="project-name" value={projectNameInput} onChange={(event) => setProjectNameInput(event.target.value)} disabled={!nativeProjectStoreAvailable || projectBusy} />
          <div className="history-actions">
            <button type="button" disabled={!nativeProjectStoreAvailable || projectBusy} onClick={() => void previewCreateNewProject()}>Preview create blank project</button>
            <button type="button" disabled={!nativeProjectStoreAvailable || projectBusy || !activeProjectId} onClick={() => void previewSaveCurrentProjectAs()}>Preview save-as new project</button>
            <button type="button" disabled={!nativeProjectStoreAvailable || projectBusy || !selectedProjectId || !selectedCatalogEntry || selectedCatalogEntry.status !== "PASS" || projectRenamePreview !== null} onClick={previewSelectedProjectRenameProposal}>Preview rename selected display name</button>
          </div>
          <label htmlFor="project-catalog">Stored projects</label>
          <select ref={projectCatalogRef} id="project-catalog" aria-describedby="project-catalog-recovery-help" autoFocus value={selectedProjectId} onFocus={() => setProjectCatalogFocusStatus("focused")} onBlur={() => setProjectCatalogFocusStatus("not-focused")} onChange={(event) => {
            setSelectedProjectId(event.target.value);
            setMigrationExplanation(null);
            setBackupPromotionPreview(null);
            setBackupPromotionReceipt(null);
            setProjectRenamePreview(null);
            setProjectCreatePreview(null);
            setProjectSavePreview(null);
            setProjectSaveAsPreview(null);
            setProjectSaveAsContent(null);
            setProjectSaveContent(null);
            setProjectSaveInverseContent(null);
            setProjectProposalSession(null);
            setProjectProposalSessionStatus("Loading the exact project proposal session…");
            setProjectProposalSessionError(null);
            setRecoveryInspection(null);
             setRecoveryPreview(null);
             setRecoveryCandidateBytes(null);
             setRecoveryReceipt(null);
             setDetachPreview(null);
             setDetachReceipt(null);
             setProjectError(null);
          }} disabled={!nativeProjectStoreAvailable || projectBusy || projectCatalog.length === 0}>
            <option value="">Select a project</option>
            {projectCatalog.map((entry) => <option key={entry.projectId} value={entry.projectId}>
              {entry.displayName} · {entry.status === "PASS" ? `recent ${entry.lastOpenedSequence} · generation ${entry.generation} · ${entry.sceneCount} Scene${entry.sceneCount === 1 ? "" : "s"}` : entry.blockerCode}
            </option>)}
          </select>
          <p id="project-catalog-recovery-help">If native focus navigation is unavailable, press Ctrl+Alt+Shift+F to focus this exact catalog without selecting or persisting a project.</p>
          <output id="project-catalog-focus-status" aria-live="polite">Project catalog focus: {projectCatalogFocusStatus === "focused" ? "PASS · exact selector focused" : "not observed"} · no project selected or persisted.</output>
          <output id="project-selector-recovery-status" aria-live="polite">M332 selector recovery: {import.meta.env.VITE_DBX_SELECTOR_RECOVERY === DESKTOP_SELECTOR_RECOVERY_MODE ? projectSelectorRecoveryStatus : "disabled outside explicit self-test mode"}. Ctrl+Alt+Shift+E selects only the exact test project in memory; it never persists or writes project state.</output>
          <output id="desktop-source-fidelity-status" aria-live="polite">Package source fidelity: {DESKTOP_PACKAGE_SOURCE_FIDELITY_MARKER} · current M332 selector recovery and metadata-only rename review are present.</output>
          <div className="history-actions">
            <button type="button" disabled={!nativeProjectStoreAvailable || projectBusy || !selectedProjectId || selectedCatalogEntry?.status !== "PASS"} onClick={openSelectedProject}>Open selected</button>
            <button type="button" disabled={!nativeProjectStoreAvailable || projectBusy || !selectedProjectId} onClick={explainSelectedProjectMigration}>Explain migration &amp; recovery</button>
            <button type="button" disabled={!nativeProjectStoreAvailable || projectBusy || !selectedProjectId} onClick={inspectSelectedProjectRecovery}>Inspect recovery</button>
            <button type="button" disabled={!nativeProjectStoreAvailable || projectBusy} onClick={() => {
              setProjectError(null);
              void refreshProjectCatalog().catch((error: unknown) => setProjectError(formatProjectStoreFailure(error)));
            }}>Refresh catalog</button>
          </div>
          <section aria-labelledby="project-migration-heading">
            <h3 id="project-migration-heading">Migration &amp; recovery explanation</h3>
            <p>This project-ID-bound inspection derives schema and primary-or-backup authority from persisted app-local bytes. It never migrates, promotes, or writes.</p>
            <output aria-live="polite">
              {migrationExplanation
                ? `${migrationExplanation.status}: ${migrationExplanation.authoritativeSource ?? "no validated source"} · schema ${migrationExplanation.sourceSchemaVersion ?? "unknown"} → ${migrationExplanation.targetSchemaVersion} · ${migrationExplanation.migrationStatus ?? "blocked"} · generation ${migrationExplanation.generation ?? "unavailable"} · retry ${migrationExplanation.retry} · no write · no Foundry write`
                : "Select a project and request its no-write migration explanation."}
            </output>
            {migrationExplanation ? <>
              <p>Primary <code>{migrationExplanation.primary.relativePath}</code>: {migrationExplanation.primary.status} · schema {migrationExplanation.primary.sourceSchemaVersion ?? "unknown"} · {migrationExplanation.primary.blockerCode ?? "no blocker"}</p>
              <p>Backup <code>{migrationExplanation.backup.relativePath}</code>: {migrationExplanation.backup.status} · schema {migrationExplanation.backup.sourceSchemaVersion ?? "unknown"} · {migrationExplanation.backup.blockerCode ?? "no blocker"}</p>
              <p>Ordered migration actions:</p>
              <ol>{migrationExplanation.actions.map((action) => <li key={action}><code>{action}</code></li>)}</ol>
              {migrationExplanation.blockers.length > 0 ? <>
                <p>Blockers:</p>
                <ul>{migrationExplanation.blockers.map((blocker) => <li key={blocker}>{blocker}</li>)}</ul>
              </> : <p>No migration blocker; this remains a preview-only explanation.</p>}
            </> : null}
            <div className="history-actions">
              <button
                type="button"
                disabled={!nativeProjectStoreAvailable || projectBusy || !selectedProjectId || migrationPersistPreview !== null}
                onClick={previewSelectedProjectMigrationPersist}
              >Preview supported migration persistence</button>
              <button
                type="button"
                disabled={!nativeProjectStoreAvailable || projectBusy || !migrationPersistPreview || !projectProposalSession || projectProposalSession.history.status !== "previewed"}
                onClick={() => { void approveSelectedProjectProposal(); }}
              >Approve migration proposal</button>
              <button
                type="button"
                disabled={projectBusy || !migrationPersistPreview || !projectProposalSession || !["previewed", "approved"].includes(projectProposalSession.history.status)}
                onClick={() => {
                  setMigrationPersistPreview(null);
                  setProjectError(null);
                  void cancelSelectedProjectProposal();
                }}
              >Cancel migration proposal</button>
            </div>
            <output aria-live="polite">
              {migrationPersistPreview
                ? `PREVIEW: primary ${migrationPersistPreview.sourceSchemaVersion} → ${migrationPersistPreview.targetSchemaVersion} · generation ${migrationPersistPreview.generation} → ${migrationPersistPreview.nextGeneration} · ${migrationPersistPreview.scenes.length} Scene${migrationPersistPreview.scenes.length === 1 ? "" : "s"} · exact legacy backup required · ${migrationPersistPreview.previewSha256.slice(0, 12)}… · no write · no Foundry write`
                : migrationPersistReceipt
                  ? `PASS: ${migrationPersistReceipt.sourceSchemaVersion} → ${migrationPersistReceipt.targetSchemaVersion} · generation ${migrationPersistReceipt.previousGeneration} → ${migrationPersistReceipt.generation} · semantic state preserved · legacy backup preserved · authoritative current reread · no Foundry write`
                  : "Migration persistence requires a supported primary, an absent prior backup, a no-write preview, and explicit approval."}
            </output>
          </section>
          <section aria-labelledby="project-recovery-heading">
            <h3 id="project-recovery-heading">Missing background recovery</h3>
            <p>Inspection is no-write. Restoration requires exact matching bytes, and existing or tampered blobs are never overwritten. If the original bytes are unavailable, detach preview can remove only the missing binding and its now-unreferenced descriptor after explicit approval; existing or tampered blobs are never detached.</p>
            <output aria-live="polite">
            {recoveryInspection
              ? `${recoveryInspection.status}: ${recoveryInspection.blockerCode ?? "no blocker"} · primary ${recoveryInspection.primary.status} · backup ${recoveryInspection.backup.status} · ${recoveryInspection.registeredAssets.length} registered asset${recoveryInspection.registeredAssets.length === 1 ? "" : "s"} · ${recoveryInspection.pendingArtifacts.length} owned pending artifact${recoveryInspection.pendingArtifacts.length === 1 ? "" : "s"} · restore ${recoveryInspection.restoreEligible ? "eligible" : "blocked"} · no write`
              : "Select a project and inspect recovery status."}
            </output>
            <p>Backup-authoritative promotion is exact-one and only applies when the primary is missing and the current-schema backup is valid. It restores the backup bytes without changing generation or semantic state; a present or corrupt primary is never replaced.</p>
            <div className="history-actions">
              <button type="button" disabled={!nativeProjectStoreAvailable || projectBusy || !selectedProjectId || backupPromotionPreview !== null} onClick={() => { void previewSelectedBackupPromotion(); }}>Preview missing-primary backup promotion</button>
              <button type="button" disabled={!nativeProjectStoreAvailable || projectBusy || !backupPromotionPreview || projectProposalSession?.history.status !== "approved" || projectProposalSession.batch.commands[0]?.kind !== "project.recovery.backup-promote"} onClick={() => { void applySelectedBackupPromotionProposal(); }}>Apply approved backup promotion</button>
              <button type="button" disabled={projectBusy || !backupPromotionPreview} onClick={cancelSelectedBackupPromotion}>Cancel backup promotion</button>
            </div>
            <output aria-live="polite">
              {backupPromotionPreview
                ? `REVIEW BACKUP PROMOTION: ${backupPromotionPreview.projectId} · primary ${backupPromotionPreview.primary.status} · backup ${backupPromotionPreview.backup.status} · generation ${backupPromotionPreview.generation} · ${backupPromotionPreview.backupByteSha256.slice(0, 12)}… · no write`
                : backupPromotionReceipt
                  ? `PASS: restored primary from exact backup bytes · generation ${backupPromotionReceipt.generation} unchanged · backup/semantic/assets/workspace/foreign state preserved · authoritative reread · no Foundry write`
                  : "No backup-authoritative promotion preview pending."}
            </output>
            <section aria-labelledby="project-proposal-heading">
              <h4 id="project-proposal-heading">Project recovery proposal review</h4>
              <p>This review surface accepts one selected backup-authoritative preview, one supported legacy-migration persistence preview, one metadata-only project-rename preview, one exact blank-project create preview, one content-bearing project-save preview, one source-preserving project-save-as preview, or one approved asset preview for a non-scene handout, WAV audio file, PNG/WebP token image, or selected-Scene background binding. Preview and approval persist proposal history locally; approval never promotes a backup, renames a project, creates project content, saves project content, registers an asset, or invokes project-store execution; approval also never persists a migration. Applying a migration, project rename, create, save, save-as, handout, audio, token, or background action is a separate explicit action; the editor updates only after the required authoritative reread.</p>
              <details open>
                <summary>Typed local-project operation contract: {TYPED_LOCAL_PROJECT_REVIEW_APPLY_VISIBLE_METADATA.length} operations</summary>
                <p>This read-only summary is sourced from the typed contract matrix. Every entry requires human review, targets the local project, and keeps apply operation-specific; no generic executor is exposed.</p>
                <ul aria-label="Typed local-project operation contract" data-testid="typed-local-project-operation-contract">
                  {TYPED_LOCAL_PROJECT_REVIEW_APPLY_VISIBLE_METADATA.map((operation) => (
                    <li key={operation.commandKind}>
                      <code>{operation.commandKind}</code> · review <code>{operation.reviewAuthority}</code> · target <code>{operation.targetAuthority}</code> · apply <code>{operation.applyAuthority}</code> · no generic executor
                    </li>
                  ))}
                </ul>
              </details>
              <details open>
                <summary>Typed operation-lifecycle evidence envelope: {TYPED_LOCAL_PROJECT_OPERATION_LIFECYCLE_EVIDENCE_ENVELOPE.length} operations · aggregate Stage 11 acceptance remains partial</summary>
                <p>This is a read-only, non-certifying metadata envelope. It records bounded operation evidence and remaining gaps; it does not execute, approve, persist, recover, or bridge authority.</p>
                <ul aria-label="Typed operation-lifecycle evidence envelope" data-testid="typed-operation-lifecycle-evidence-envelope">
                  {TYPED_LOCAL_PROJECT_OPERATION_LIFECYCLE_EVIDENCE_ENVELOPE.map((operation) => (
                    <li key={operation.commandKind}>
                      <code>{operation.commandKind}</code> · handler <code>{operation.applyHandler}</code> · evidence <code>{operation.evidenceStatus}</code> · {operation.boundedEvidence} Remaining gap: {operation.remainingGap} <em>read-only · non-certifying · no execution authority</em>
                    </li>
                  ))}
                </ul>
              </details>
              <details open>
                <summary>Typed operation-to-proposal-history evidence binding: {TYPED_LOCAL_PROJECT_OPERATION_PROPOSAL_HISTORY_BINDING.length} operations · review/approval coverage only · Stage 11 remains partial</summary>
                <p>This is a read-only, non-certifying metadata binding to the existing proposal-history state vocabulary. It reports bounded review/approval coverage and remaining lifecycle gaps; it does not transition history, execute, persist, recover, or add authority.</p>
                <ul aria-label="Typed operation-to-proposal-history evidence binding" data-testid="typed-operation-to-proposal-history-evidence-binding">
                  {TYPED_LOCAL_PROJECT_OPERATION_PROPOSAL_HISTORY_BINDING.map((operation) => (
                    <li key={operation.commandKind}>
                      <code>{operation.commandKind}</code> · handler <code>{operation.applyHandler}</code> · history vocabulary <code>{operation.proposalHistoryStates.join(", ")}</code> · bounded states <code>{operation.boundedHistoryStates.join(", ")}</code> · {operation.remainingHistoryGap} <em>read-only · non-certifying · no execution authority</em>
                    </li>
                  ))}
                </ul>
              </details>
              <details open>
                <summary>Typed operation/history lifecycle coverage matrix: {TYPED_LOCAL_PROJECT_OPERATION_HISTORY_LIFECYCLE_COVERAGE.length} operations × 11 states · preview/approval observed only · Stage 11 remains partial</summary>
                <p>This is a read-only, non-certifying coverage matrix derived from the existing operation binding and history vocabulary. It makes observed preview/approval states and unobserved later-state gaps inspectable; it does not transition history, execute, persist, recover, or add authority.</p>
                <ul aria-label="Typed operation history lifecycle coverage matrix" data-testid="typed-operation-history-lifecycle-coverage-matrix">
                  {TYPED_LOCAL_PROJECT_OPERATION_HISTORY_LIFECYCLE_COVERAGE.map((operation) => (
                    <li key={operation.commandKind}>
                      <code>{operation.commandKind}</code> · handler <code>{operation.applyHandler}</code> · vocabulary <code>{operation.historyStates.join(", ")}</code> · observed <code>{operation.observedHistoryStates.join(", ")}</code> · unobserved <code>{operation.unobservedHistoryStates.join(", ")}</code> · {operation.remainingLifecycleGap} <em>read-only · non-certifying · no execution authority</em>
                    </li>
                  ))}
                </ul>
              </details>
              <details open>
                <summary>Typed proposal-history transition projection: {TYPED_LOCAL_PROJECT_PROPOSAL_HISTORY_TRANSITION_PROJECTION.length} states · core-source derived · Stage 11 remains partial</summary>
                <p>This is a read-only, non-certifying projection of the existing core allowed-transition vocabulary. It makes current transition semantics inspectable without invoking a transition, executing a proposal, persisting state, recovering an outcome, or adding authority.</p>
                <ul aria-label="Typed proposal-history transition projection" data-testid="typed-proposal-history-transition-projection">
                  {TYPED_LOCAL_PROJECT_PROPOSAL_HISTORY_TRANSITION_PROJECTION.map((entry) => (
                    <li key={entry.historyState}>
                      <code>{entry.historyState}</code> · allowed transitions <code>{entry.allowedTransitions.length === 0 ? "none" : entry.allowedTransitions.join(", ")}</code> · source <code>{entry.source}</code> <em>read-only · non-certifying · no execution authority</em>
                    </li>
                  ))}
                </ul>
              </details>
              <details open>
                <summary>Typed operation-to-history-transition coverage: {TYPED_LOCAL_PROJECT_OPERATION_HISTORY_TRANSITION_COVERAGE.length} operations × 11 states · handler-bound · Stage 11 remains partial</summary>
                <p>This is a read-only, non-certifying cross-binding of each existing operation-specific handler to the core transition projection. It makes operation coverage inspectable; it does not invoke transitions, execute proposals, persist state, recover outcomes, or add authority.</p>
                <ul aria-label="Typed operation to history transition coverage" data-testid="typed-operation-history-transition-coverage">
                  {TYPED_LOCAL_PROJECT_OPERATION_HISTORY_TRANSITION_COVERAGE.map((operation) => (
                    <li key={operation.commandKind}>
                      <code>{operation.commandKind}</code> · handler <code>{operation.applyHandler}</code> · {operation.transitionProjection.length} history states from <code>{operation.source}</code> · <em>read-only · non-certifying · no execution authority</em>
                    </li>
                  ))}
                </ul>
              </details>
              <details open>
                <summary>Cross-producer lifecycle evidence: {TYPED_LOCAL_PROJECT_PRODUCER_EVIDENCE_SUMMARY.length} families · aggregate Stage 11 acceptance remains partial</summary>
                <p>This is a non-certifying, read-only evidence summary. It records bounded evidence and remaining gaps; it does not execute, approve, persist, recover, or bridge authority.</p>
                <ul aria-label="Cross-producer lifecycle evidence summary" data-testid="cross-producer-lifecycle-evidence-summary">
                  {TYPED_LOCAL_PROJECT_PRODUCER_EVIDENCE_SUMMARY.map((entry) => (
                    <li key={entry.familyId}>
                      <strong>{entry.label}</strong> · <code>{entry.evidenceStatus}</code> · {entry.boundedEvidence} Remaining gap: {entry.remainingGap} <em>non-certifying</em>
                    </li>
                  ))}
                </ul>
              </details>
              <details open>
                <summary>Review-terminal lifecycle evidence: {TYPED_LOCAL_PROJECT_REVIEW_TERMINAL_STATE_EVIDENCE_SUMMARY.evidenceCount} projections · {TYPED_LOCAL_PROJECT_REVIEW_TERMINAL_STATE_EVIDENCE_SUMMARY.commandKindCount} operations × {TYPED_LOCAL_PROJECT_REVIEW_TERMINAL_STATE_EVIDENCE_SUMMARY.terminalStateCount} states · Stage 11 remains partial</summary>
                <p>This is a read-only, non-certifying review-terminal lifecycle projection for rejected, cancelled, and stale outcomes. It binds operation contracts to the existing core transition vocabulary and terminal no-apply semantics; it does not invoke transitions, execute, persist, recover, or add authority.</p>
                <ul aria-label="Review-terminal lifecycle evidence" data-testid="review-terminal-lifecycle-evidence">
                  {TYPED_LOCAL_PROJECT_REVIEW_TERMINAL_STATE_EVIDENCE.map((entry) => (
                    <li key={`${entry.commandKind}-${entry.reviewTerminalState}`}>
                      <code>{entry.commandKind}</code> · handler <code>{entry.applyHandler}</code> · terminal state <code>{entry.reviewTerminalState}</code> · transition <code>{entry.transition}</code> · allowed source <code>{entry.allowedSourceStatuses.join(", ")}</code> · after <code>{entry.allowedTransitionsAfter.length === 0 ? "none" : entry.allowedTransitionsAfter.join(", ")}</code> · terminal no-apply · <em>read-only · non-certifying · no execution authority · transition not invoked</em>
                    </li>
                  ))}
                </ul>
              </details>
              <details open>
                <summary>Applying/unknown-outcome lifecycle evidence: {TYPED_LOCAL_PROJECT_APPLYING_UNKNOWN_EVIDENCE_SUMMARY.evidenceCount} checkpoints · {TYPED_LOCAL_PROJECT_APPLYING_UNKNOWN_EVIDENCE_SUMMARY.commandKindCount} operations × {TYPED_LOCAL_PROJECT_APPLYING_UNKNOWN_EVIDENCE_SUMMARY.checkpointCount} checkpoints · Stage 11 remains partial</summary>
                <p>This is a read-only, non-certifying applying/unknown-outcome lifecycle projection. It binds the existing operation contracts to core begin-apply, mark-unknown, and recover-after-reread semantics, and makes retry-forbidden-until-authoritative-reread explicit; it does not invoke transitions, execute, persist, recover results, or add authority.</p>
                <ul aria-label="Applying and unknown-outcome lifecycle evidence" data-testid="applying-unknown-lifecycle-evidence">
                  {TYPED_LOCAL_PROJECT_APPLYING_UNKNOWN_EVIDENCE.map((entry) => (
                    <li key={`${entry.commandKind}-${entry.checkpoint}`}>
                      <code>{entry.commandKind}</code> · handler <code>{entry.applyHandler}</code> · checkpoint <code>{entry.checkpoint}</code> · {entry.sourceStatus} <code>{entry.transition}</code> {entry.destinationStatus} · reread {entry.rereadRequired ? "required" : "not required at this checkpoint"} · retry <code>{entry.retryPolicy}</code> · recovery results <code>{entry.recoveryResults}</code> · <em>read-only · non-certifying · no execution authority · transition not invoked</em>
                    </li>
                  ))}
                </ul>
              </details>
              <details open>
                <summary>Recovery-result lifecycle evidence: {TYPED_LOCAL_PROJECT_RECOVERY_RESULT_EVIDENCE_SUMMARY.evidenceCount} projections · {TYPED_LOCAL_PROJECT_RECOVERY_RESULT_EVIDENCE_SUMMARY.commandKindCount} operations × {TYPED_LOCAL_PROJECT_RECOVERY_RESULT_EVIDENCE_SUMMARY.rereadStatusCount} reread statuses · Stage 11 remains partial</summary>
                <p>This is a read-only, non-certifying recovery-result projection. It exposes the existing recover-after-reread mapping and exact reread-shape rules; it does not invoke recovery, execute, persist, add transition authority, or certify committed/recovered behavior.</p>
                <ul aria-label="Recovery-result lifecycle evidence" data-testid="recovery-result-lifecycle-evidence">
                  {TYPED_LOCAL_PROJECT_RECOVERY_RESULT_EVIDENCE.map((entry) => (
                    <li key={`${entry.commandKind}-${entry.rereadStatus}`}>
                      <code>{entry.commandKind}</code> · handler <code>{entry.applyHandler}</code> · reread <code>{entry.rereadStatus}</code> · result <code>{entry.resultStatus}</code> · <code>{entry.rereadRequirement}</code> · retry <code>{entry.retryPolicy}</code> · <em>read-only · non-certifying · no execution or transition authority · recovery not invoked</em>
                    </li>
                  ))}
                </ul>
              </details>
              <details open>
                <summary>Undo/redo lifecycle evidence: {TYPED_LOCAL_PROJECT_UNDO_REDO_EVIDENCE_SUMMARY.evidenceCount} projections · {TYPED_LOCAL_PROJECT_UNDO_REDO_EVIDENCE_SUMMARY.commandKindCount} operations × {TYPED_LOCAL_PROJECT_UNDO_REDO_EVIDENCE_SUMMARY.sourceStatusCount} transitions · Stage 11 remains partial</summary>
                <p>This is a read-only, non-certifying undo/redo projection. It exposes the existing core transition map and matched post-transition reread boundary; operation-specific undo/redo handlers and reread classifiers remain unprojected or unproven, and the M747 recovery-result projection is preserved out of scope. It does not invoke undo, redo, execute, persist, add transition authority, or certify runtime behavior.</p>
                <ul aria-label="Undo and redo lifecycle evidence" data-testid="undo-redo-lifecycle-evidence">
                  {TYPED_LOCAL_PROJECT_UNDO_REDO_EVIDENCE.map((entry) => (
                    <li key={`${entry.commandKind}-${entry.sourceStatus}`}>
                      <code>{entry.commandKind}</code> · handler <code>{entry.applyHandler}</code> · <code>{entry.sourceStatus}</code> <code>{entry.transition}</code> {entry.destinationStatus} · reread <code>{entry.rereadStatus}</code> · {entry.rereadRequirement} · <em>read-only · non-certifying · no execution or transition authority · transition not invoked</em>
                    </li>
                  ))}
                </ul>
              </details>
              <details open>
                <summary>Project.save handler/classifier evidence: {TYPED_PROJECT_SAVE_UNDO_REDO_CLASSIFIER_EVIDENCE_SUMMARY.evidenceCount} projections · {TYPED_PROJECT_SAVE_UNDO_REDO_CLASSIFIER_EVIDENCE_SUMMARY.commandKind} only · Stage 11 remains partial</summary>
                <p>This is a read-only, non-certifying project.save handler/classifier binding. It exposes the existing operation-specific undo/readback surface and the missing redo binding; it does not invoke project.save undo, redo, execute, persist, add transition authority, or certify runtime behavior.</p>
                <ul aria-label="Project save undo redo classifier evidence" data-testid="project-save-undo-redo-classifier-evidence">
                  {TYPED_PROJECT_SAVE_UNDO_REDO_CLASSIFIER_EVIDENCE.map((entry) => (
                    <li key={`${entry.commandKind}-${entry.sourceStatus}`}>
                      <code>{entry.commandKind}</code> · <code>{entry.sourceStatus}</code> <code>{entry.transition}</code> {entry.destinationStatus} · handler <code>{entry.undoRedoHandler}</code> · reread classifier <code>{entry.matchedRereadClassifier}</code> · {entry.rereadRequirement} · <em>read-only · non-certifying · no execution or transition authority · transition not invoked</em>
                    </li>
                  ))}
                </ul>
              </details>
              <details open>
                <summary>Terminal-history evidence index: {projectTerminalHistoryEvidenceIndex.directProjectionCount} direct projections · {projectTerminalHistoryEvidenceIndex.typedOperationKindCount} typed operations · Stage 11 remains partial</summary>
                <p>This is a read-only, non-certifying inventory of exact terminal-history bridge, focused-test, and receipt artifacts. It records provenance only; it does not transition history, execute, persist, recover, or add authority.</p>
                <ul aria-label="Terminal-history evidence index" data-testid="terminal-history-evidence-index">
                  {projectTerminalHistoryEvidenceIndex.operations.map((entry) => (
                    <li key={entry.commandKind}>
                      <code>{entry.commandKind}</code> · bridge <code>{entry.bridgeSource}</code> · test <code>{entry.focusedTest}</code> · receipt <code>{entry.receipt}</code> · {entry.authority} · <em>read-only · non-certifying · no execution or transition authority</em>
                    </li>
                  ))}
                  {projectTerminalHistoryEvidenceIndex.supplementalProjections.map((entry) => (
                    <li key={entry.projectionId}>
                      <code>{entry.projectionId}</code> · source <code>{entry.source}</code> · test <code>{entry.focusedTest}</code> · receipt <code>{entry.receipt}</code> · {entry.projectionKind} · <em>read-only · non-certifying · no execution or transition authority</em>
                    </li>
                  ))}
                </ul>
              </details>
              <div className="history-actions">
                <button
                  type="button"
                  disabled={projectBusy || !backupPromotionPreview || (projectProposalSession !== null && !["rejected", "cancelled", "stale", "committed", "recovered", "undone", "redone"].includes(projectProposalSession.history.status))}
                onClick={() => { void previewSelectedBackupPromotionProposal(); }}
                >Review backup preview as proposal</button>
                <button
                  type="button"
                  disabled={projectBusy || !migrationPersistPreview || projectProposalSession?.history.status !== "approved" || projectProposalSession.batch.commands[0]?.kind !== "project.migration.persist"}
                  onClick={applySelectedProjectMigrationPersistProposal}
                >Apply approved migration persistence</button>
                <button
                  type="button"
                  disabled={projectBusy || !selectedProjectId || !selectedCatalogEntry || selectedCatalogEntry.status !== "PASS" || !selectedCatalogEntry.contentSha256 || projectRenamePreview !== null || (projectProposalSession !== null && !["rejected", "cancelled", "stale", "committed", "recovered", "undone", "redone"].includes(projectProposalSession.history.status))}
                  onClick={previewSelectedProjectRenameProposal}
                >Review selected rename as proposal</button>
                <button
                  type="button"
                  disabled={projectBusy || projectReviewApplyCoverage?.reviewerApprovalDispatchReady !== true}
                  onClick={() => { void approveSelectedProjectProposal(); }}
                >Approve project recovery proposal</button>
                <button
                  type="button"
                  disabled={projectBusy || projectProposalSession?.history.status !== "approved" || projectProposalSession.batch.commands[0]?.kind !== "project.create"}
                  onClick={applySelectedProjectCreateProposal}
                >Apply approved project create</button>
                <button
                  type="button"
                  disabled={projectBusy || projectProposalSession?.history.status !== "approved" || projectProposalSession.batch.commands[0]?.kind !== "project.rename"}
                  onClick={applySelectedProjectRenameProposal}
                >Apply approved project rename</button>
                <button
                  type="button"
                  disabled={projectBusy || projectProposalSession?.history.status !== "approved" || projectProposalSession.batch.commands[0]?.kind !== "project.save"}
                  onClick={applySelectedProjectSaveProposal}
                >Apply approved project save</button>
                <button
                  type="button"
                  disabled={projectBusy || projectProposalSession?.history.status !== "approved" || projectProposalSession.batch.commands[0]?.kind !== "project.save-as"}
                  onClick={applySelectedProjectSaveAsProposal}
                >Apply approved project save-as</button>
                <button
                  type="button"
                  disabled={projectBusy || projectProposalSession?.history.status !== "approved" || projectProposalSession.batch.commands[0]?.kind !== "project.asset.register-handout"}
                  onClick={applySelectedProjectHandoutProposal}
                >Apply approved handout registration</button>
                <button
                  type="button"
                  disabled={projectBusy || projectProposalSession?.history.status !== "approved" || projectProposalSession.batch.commands[0]?.kind !== "project.asset.register-audio"}
                  onClick={applySelectedProjectAudioProposal}
                >Apply approved audio registration</button>
                <button
                  type="button"
                  disabled={projectBusy || projectProposalSession?.history.status !== "approved" || projectProposalSession.batch.commands[0]?.kind !== "project.asset.register-token"}
                  onClick={applySelectedProjectTokenProposal}
                >Apply approved token registration</button>
                <button
                  type="button"
                  disabled={projectBusy || projectProposalSession?.history.status !== "approved" || projectProposalSession.batch.commands[0]?.kind !== "project.asset.bind"}
                  onClick={applySelectedProjectBackgroundProposal}
                >Apply approved background binding</button>
                <button
                  type="button"
                  disabled={projectBusy || projectProposalSession?.history.status !== "approved" || projectProposalSession.batch.commands[0]?.kind !== "project.add-scene"}
                  onClick={applySelectedCommittedProjectAddScene}
                >Apply approved in-memory Scene</button>
                <button
                  type="button"
                  disabled={projectBusy || projectProposalSession?.history.status !== "committed" || projectProposalSession.batch.commands[0]?.kind !== "project.add-scene"}
                  onClick={undoSelectedCommittedProjectAddScene}
                >Undo committed in-memory Scene</button>
                <button
                  type="button"
                  disabled={projectBusy || projectProposalSession?.history.status !== "previewed"}
                  onClick={rejectSelectedProjectProposal}
                >Reject project proposal</button>
                <button
                  type="button"
                  disabled={projectBusy || !projectProposalSession || !["previewed", "approved"].includes(projectProposalSession.history.status)}
                  onClick={cancelSelectedProjectProposal}
                >Cancel project proposal</button>
                <button
                  type="button"
                  disabled={projectBusy || !projectProposalSession || !["previewed", "approved"].includes(projectProposalSession.history.status)}
                  onClick={markSelectedProjectProposalStale}
                >Mark project proposal stale</button>
                <button
                  type="button"
                  disabled={projectBusy || !projectProposalSession || !["rejected", "cancelled", "stale", "committed", "recovered", "undone", "redone"].includes(projectProposalSession.history.status)}
                  onClick={clearSelectedTerminalProjectProposal}
                >Clear terminal project proposal session</button>
              </div>
              <output aria-live="polite">
                {projectProposalSessionError
                  ?? (projectSavePreview
                    ? "REVIEW PROJECT SAVE: " + projectSavePreview.projectId + " · generation " + projectSavePreview.currentGeneration + " → next save · " + projectSavePreview.proposedSceneCount + " Scenes · active " + projectSavePreview.proposedActiveSceneId + " · " + projectSavePreview.previewSha256.slice(0, 12) + "… · no write · no Foundry write"
                   : projectSaveAsPreview
                     ? "REVIEW PROJECT SAVE-AS: " + projectSaveAsPreview.sourceProjectId + " → " + projectSaveAsPreview.targetProjectId + " · source generation " + projectSaveAsPreview.sourceGeneration + " · " + projectSaveAsPreview.sourceSceneCount + " Scenes · " + projectSaveAsPreview.sourceAssetCount + " assets · collection " + projectSaveAsPreview.sourceAssetCollectionSha256.slice(0, 12) + "… · target absent · " + projectSaveAsPreview.previewSha256.slice(0, 12) + "… · no write · no Foundry write"
                   : projectHandoutPreview
                     ? "REVIEW PROJECT HANDOUT: " + projectHandoutPreview.projectId + " · generation " + projectHandoutPreview.currentGeneration + " · " + projectHandoutPreview.role + " " + projectHandoutPreview.assetId + " · " + projectHandoutPreview.proposedAssetCount + " total assets · " + projectHandoutPreview.previewSha256.slice(0, 12) + "… · no write · no Foundry write"
                     : projectAudioPreview
                       ? "REVIEW PROJECT AUDIO: " + projectAudioPreview.projectId + " · generation " + projectAudioPreview.currentGeneration + " · " + projectAudioPreview.role + " " + projectAudioPreview.assetId + " · " + projectAudioPreview.proposedAssetCount + " total assets · " + projectAudioPreview.previewSha256.slice(0, 12) + "… · no write · no Foundry write"
                       : projectTokenPreview
                         ? "REVIEW PROJECT TOKEN: " + projectTokenPreview.projectId + " · generation " + projectTokenPreview.currentGeneration + " · " + projectTokenPreview.role + " " + projectTokenPreview.assetId + " · " + projectTokenPreview.proposedAssetCount + " total assets · " + projectTokenPreview.previewSha256.slice(0, 12) + "… · no write · no Foundry write"
                     : projectBackgroundPreview
                       ? "REVIEW PROJECT BACKGROUND: " + projectBackgroundPreview.projectId + " · generation " + projectBackgroundPreview.currentGeneration + " · Scene " + projectBackgroundPreview.sceneId + " · " + projectBackgroundPreview.assetId + " · " + projectBackgroundPreview.proposedAssetCount + " total assets · " + projectBackgroundPreview.previewSha256.slice(0, 12) + "… · no write · no Foundry write"
                    : migrationPersistPreview
                     ? `REVIEW LEGACY MIGRATION: ${migrationPersistPreview.projectId} · ${migrationPersistPreview.sourceSchemaVersion} → ${migrationPersistPreview.targetSchemaVersion} · generation ${migrationPersistPreview.generation} → ${migrationPersistPreview.nextGeneration} · ${migrationPersistPreview.scenes.length} Scenes · legacy backup required · ${migrationPersistPreview.previewSha256.slice(0, 12)}… · no write · no Foundry write`
                    : projectCreatePreview
                    ? `REVIEW PROJECT CREATE: ${projectCreatePreview.targetProjectId} · Scene ${projectCreatePreview.sceneIds[0]} · workspace generation ${projectCreatePreview.workspaceIndexGeneration} · target absent · generation 0 → 1 · ${projectCreatePreview.previewSha256.slice(0, 12)}… · no write · no Foundry write`
                    : projectRenamePreview
                      ? `REVIEW PROJECT RENAME: ${projectRenamePreview.currentDisplayName} → ${projectRenamePreview.proposedDisplayName} · workspace generation ${projectRenamePreview.workspaceIndexGeneration} · content ${projectRenamePreview.contentSha256.slice(0, 12)}… · no write · no Foundry write`
                    : projectProposalSessionStatus)}
              </output>
              <p>Keyboard recovery fallback: in the explicit selector self-test only, press Ctrl+Alt+Shift+V after the exact ephemeral project selection to create its session-only metadata-only rename review; press Ctrl+Alt+Shift+P to create a session-only proposal from the visible backup preview; press Ctrl+Alt+Shift+A to approve, Ctrl+Alt+Shift+R to reject, or Ctrl+Alt+Shift+K to cancel a session-only project proposal; press Ctrl+Alt+Shift+S to mark a previewed or approved proposal stale, or Ctrl+Alt+Shift+C to clear an exact terminal session when native focus navigation is unavailable. These actions change session state only; they never write project content, rename a project, or promote the backup.</p>
              {projectProposalInspection && projectProposalSession ? <>
                <p>
                  <strong>Proposal metadata:</strong> {projectProposalInspection.producer.kind}/{projectProposalInspection.producer.provider ?? "no-provider"} · project <code>{projectProposalInspection.projectId}</code> · generation {projectProposalSession.batch.base.revision} · base <code>{projectProposalSession.batch.base.sha256}</code> · risk {projectProposalInspection.risk} · {projectProposalInspection.reviewAuthority.domain}/{projectProposalInspection.targetAuthority.domain} · operation <code>{projectProposalSession.batch.commands[0]?.kind ?? "none"}</code>{projectProposalSession.batch.commands[0]?.kind === "project.migration.persist" ? ` · ${String(projectProposalSession.batch.commands[0]?.payload.sourceSchemaVersion)} → ${String(projectProposalSession.batch.commands[0]?.payload.targetSchemaVersion)} · generation ${String(projectProposalSession.batch.commands[0]?.payload.generation)} → ${String(projectProposalSession.batch.commands[0]?.payload.nextGeneration)}` : projectProposalSession.batch.commands[0]?.kind === "project.create" ? ` · target absent · ${String(projectProposalSession.batch.commands[0]?.payload.targetProjectId)} · ${String(projectProposalSession.batch.commands[0]?.payload.sceneCount)} Scene` : projectProposalSession.batch.commands[0]?.kind === "project.rename" ? ` · ${String(projectProposalSession.batch.commands[0]?.payload.currentDisplayName)} → ${String(projectProposalSession.batch.commands[0]?.payload.proposedDisplayName)}` : projectProposalSession.batch.commands[0]?.kind === "project.asset.register-handout" || projectProposalSession.batch.commands[0]?.kind === "project.asset.register-audio" || projectProposalSession.batch.commands[0]?.kind === "project.asset.register-token" ? ` · ${String(projectProposalSession.batch.commands[0]?.payload.role)} · ${String(projectProposalSession.batch.commands[0]?.payload.assetId)} · ${String(projectProposalSession.batch.commands[0]?.payload.proposedAssetCount)} assets` : projectProposalSession.batch.commands[0]?.kind === "project.asset.bind" ? ` · background · Scene ${String(projectProposalSession.batch.commands[0]?.payload.sceneId)} · ${String(projectProposalSession.batch.commands[0]?.payload.assetId)} · ${String(projectProposalSession.batch.commands[0]?.payload.proposedAssetCount)} assets` : ""} · history {projectProposalInspection.historyLength}
                </p>
                <p>
                  <strong>Typed local-project review/apply coverage:</strong> {projectReviewApplyCoverage?.status ?? "BLOCKED"} · operation <code>{projectReviewApplyCoverage?.commandKind ?? "outside allowlist"}</code> · exact target {projectReviewApplyCoverage?.exactTarget ? "yes" : "no"} · reviewer dispatch {projectReviewApplyCoverage?.reviewerApprovalDispatchReady ? "ready" : "not ready"} · operation-specific apply {projectReviewApplyCoverage?.operationSpecificApplyReady ? "ready" : "not ready"} · no generic executor authority{projectReviewApplyCoverage?.reason ? ` · ${projectReviewApplyCoverage.reason}` : ""}
                </p>
                <ol className="campaign-director-history" aria-label="Project proposal append-only receipt history">
                  {projectProposalSession.history.receipts.map((receipt) => <li key={receipt.receiptId}>
                    <strong>{receipt.sequence}. {receipt.transition}</strong>
                    <span>{receipt.fromStatus ?? "new"} → {receipt.toStatus} · {receipt.actor.role} · {receipt.observedAt}</span>
                  </li>)}
                </ol>
              </> : null}
            </section>
            {recoveryInspection?.registeredAssets.map((asset) => <p key={asset.assetId}>
              <code>{asset.assetId}</code> · {asset.disposition} · {asset.mediaType} · Scene{asset.affectedSceneIds.length === 1 ? "" : "s"} {asset.affectedSceneIds.join(", ") || "none"} · {asset.restoreEligible ? "eligible" : asset.blockerCode ?? "blocked"}
            </p>)}
            {recoveryInspection?.brokenSceneReferences.length ? <>
              <p>Broken Scene background references are diagnostic-only evidence. No detach, rebind, replacement, cleanup, migration, or backup promotion is performed by inspection.</p>
              {recoveryInspection.brokenSceneReferences.map((reference) => <p key={`${reference.source}:${reference.sceneId}:${reference.assetId}`}>
                <code>{reference.sceneId}</code> → <code>{reference.assetId}</code> · {reference.blockerCode} · {reference.source} · retry {reference.retry}
              </p>)}
              <label htmlFor="project-broken-reference">Choose exactly one diagnosed reference to repair</label>
              <select
                id="project-broken-reference"
                value={selectedBrokenReferenceKey ?? ""}
                disabled={projectBusy || brokenReferencePreview !== null}
                onChange={(event) => {
                  setSelectedBrokenReferenceKey(event.target.value || null);
                  setBrokenReferencePreview(null);
                  setBrokenReferenceReceipt(null);
                  setProjectError(null);
                }}
              >
                <option value="">Select one broken reference…</option>
                {recoveryInspection.brokenSceneReferences
                  .filter((reference) => reference.source.endsWith("/project.json"))
                  .map((reference) => <option key={`${reference.sceneId}:${reference.assetId}`} value={`${reference.sceneId}:${reference.assetId}`}>
                    {reference.sceneId} → {reference.assetId} · {reference.blockerCode}
                  </option>)}
              </select>
              <p>Repair is exact-one and approval-bound. It removes only the selected Scene background binding; role-mismatched handout descriptors and blobs remain preserved.</p>
              <output aria-live="polite">
                {brokenReferencePreview
                  ? `REVIEW BROKEN REFERENCE: ${brokenReferencePreview.sceneId} → ${brokenReferencePreview.assetId} · ${brokenReferencePreview.blockerCode} · generation ${brokenReferencePreview.generation} → ${brokenReferencePreview.nextGeneration} · descriptor ${brokenReferencePreview.assetDescriptorPreserved ? "preserved" : "not present"} · no write`
                  : brokenReferenceReceipt
                    ? `PASS: detached only ${brokenReferenceReceipt.sceneId} → ${brokenReferenceReceipt.assetId} · descriptor ${brokenReferenceReceipt.assetDescriptorPreserved ? "preserved" : "not present"} · ${brokenReferenceReceipt.residualBrokenReferenceCount} remaining diagnostic reference${brokenReferenceReceipt.residualBrokenReferenceCount === 1 ? "" : "s"} · authoritative reread · no Foundry write`
                    : "No broken-reference repair preview pending."}
              </output>
              <div className="history-actions">
                <button type="button" disabled={!selectedBrokenReference || projectBusy || brokenReferencePreview !== null} onClick={() => void previewSelectedBrokenReferenceDetach()}>Preview exact-one binding detach</button>
                <button type="button" disabled={!brokenReferencePreview || projectBusy || projectProposalSession?.history.status !== "approved" || projectProposalSession.batch.commands[0]?.kind !== "project.broken-reference.detach"} onClick={applySelectedBrokenReferenceDetachProposal}>Apply approved exact-one binding detach</button>
                <button type="button" disabled={!brokenReferencePreview || projectBusy} onClick={cancelSelectedBrokenReferenceDetach}>Cancel repair</button>
              </div>
            </> : null}
            {recoveryInspection?.pendingArtifacts.length ? <>
              <p>Owned staged pending artifacts are read-only recovery evidence. They are never cleared, promoted, renamed, or quarantined by this inspection.</p>
              {recoveryInspection.pendingArtifacts.map((artifact) => <p key={`${artifact.artifactKind}:${artifact.relativePath}`}>
                <code>{artifact.relativePath}</code> · {artifact.artifactKind} · {artifact.status} · {artifact.stagedContentSha256?.slice(0, 12) ?? "digest unavailable"} · {artifact.blockerCode ?? "recovery required"} · retry {artifact.retry}
              </p>)}
            </> : null}
            <label htmlFor="project-recovery-asset">Choose exactly one eligible missing background</label>
            <select
              id="project-recovery-asset"
              value={selectedRecoveryAssetId ?? ""}
              disabled={!recoveryInspection || projectBusy || recoveryPreview !== null || detachPreview !== null}
              onChange={(event) => {
                setSelectedRecoveryAssetId(event.target.value || null);
                setRecoveryPreview(null);
                setRecoveryCandidateBytes(null);
                setDetachPreview(null);
                setProjectError(null);
              }}
              aria-describedby="project-recovery-asset-help"
            >
              <option value="">Select one eligible asset…</option>
              {recoveryInspection?.registeredAssets.map((asset) => <option key={asset.assetId} value={asset.assetId} disabled={!asset.restoreEligible}>
                {asset.assetId} · {asset.mediaType} · {asset.restoreEligible ? "eligible" : asset.blockerCode ?? "blocked"}
              </option>)}
            </select>
            <p id="project-recovery-asset-help">Selection is exact-one and approval-bound. Unselected missing assets remain visible and untouched.</p>
            <p>{selectedRecoveryAsset ? `Selected recovery asset: ${selectedRecoveryAsset.assetId} · ${selectedRecoveryAsset.affectedSceneIds.join(", ")}` : "No eligible recovery asset selected."}</p>
            <label htmlFor="project-background-restore">Exact replacement bytes for selected missing background</label>
            <input
              id="project-background-restore"
              type="file"
              accept="image/png,image/webp"
              disabled={!nativeProjectStoreAvailable || projectBusy || !selectedRecoveryAsset || recoveryPreview !== null}
              onChange={previewSelectedProjectAssetRestore}
            />
            <output aria-live="polite">
              {recoveryPreview
                ? `REVIEW: ${recoveryPreview.assetId} · ${recoveryPreview.candidateByteLength} bytes · ${recoveryPreview.candidateSha256.slice(0, 12)}… · preview ${recoveryPreview.previewSha256.slice(0, 12)}… · project generation ${recoveryPreview.generation} unchanged · no write`
                : recoveryReceipt
                  ? `PASS: restored ${recoveryReceipt.assetId} with create-new-only write · envelope/project/Scenes/workspace/backups/foreign state unchanged · no Foundry write`
                  : "No exact-byte restoration preview pending."}
            </output>
            <div className="history-actions">
              <button type="button" disabled={!recoveryPreview || !recoveryCandidateBytes || projectBusy || projectProposalSession?.history.status !== "approved" || projectProposalSession.batch.commands[0]?.kind !== "project.asset.restore"} onClick={applySelectedProjectAssetRestoreProposal}>Apply approved exact-byte restore</button>
              <button type="button" disabled={!recoveryPreview || projectBusy} onClick={cancelSelectedProjectAssetRestore}>Cancel restore</button>
            </div>
            <output aria-live="polite">
              {detachPreview
                ? `REVIEW DETACH: ${detachPreview.assetId} · ${detachPreview.affectedScenes.length} affected Scene${detachPreview.affectedScenes.length === 1 ? "" : "s"} · generation ${detachPreview.generation} → ${detachPreview.nextGeneration} · resulting project ${detachPreview.resultingContentSha256.slice(0, 12)}… · asset tree unchanged · no write`
                : detachReceipt
                  ? `PASS: detached ${detachReceipt.assetId} from ${detachReceipt.affectedScenes.length} Scene${detachReceipt.affectedScenes.length === 1 ? "" : "s"} · descriptor removed · prior envelope backed up · authoritative reload passed · no Foundry write`
                  : "No missing-background detach preview pending."}
            </output>
            <div className="history-actions">
              <button type="button" disabled={!selectedRecoveryAsset || recoveryPreview !== null || detachPreview !== null || projectBusy} onClick={previewSelectedProjectAssetDetach}>Preview detach selected background</button>
              <button type="button" disabled={!detachPreview || projectBusy || projectProposalSession?.history.status !== "approved" || projectProposalSession.batch.commands[0]?.kind !== "project.asset.detach"} onClick={applySelectedProjectAssetDetachProposal}>Apply approved missing-background detach</button>
              <button type="button" disabled={!detachPreview || projectBusy} onClick={cancelSelectedProjectAssetDetach}>Cancel detach</button>
            </div>
          </section>
          <div className="history-actions">
            <button type="button" disabled={!nativeProjectStoreAvailable || projectBusy || !activeProjectId || !projectDirty} onClick={() => void previewSaveCurrentProject()}>Preview save active project</button>
            <button type="button" disabled={!nativeProjectStoreAvailable || projectBusy || !activeProjectId} onClick={reloadSavedProject}>Reload active project</button>
            <button type="button" disabled={!nativeProjectStoreAvailable || projectBusy || !activeProjectId} onClick={closeActiveProject}>Close active project</button>
          </div>
          <p>{activeProjectId ? `Active immutable ID: ${activeProjectId}` : "No persisted project is active; the visible foundation Scene is an unsaved template."}</p>
          <p>{projectDirty ? "Unsaved Scene changes are present. Save the active project before closing; close will not discard them." : activeProjectId ? "Project session is clean; close clears only in-memory editor state." : "No project session is open."}</p>
          <label htmlFor="project-scenes">Active Scene</label>
          <select id="project-scenes" value={activeSceneId} onChange={(event) => switchProjectScene(event.target.value)} disabled={!activeProjectId || projectBusy}>
            {currentProjectScenes.map((scene, index) => <option key={scene.id} value={scene.id}>{index + 1}. {scene.name} · {scene.id}</option>)}
          </select>
          <button type="button" disabled={!activeProjectId || projectBusy || currentProjectScenes.length >= 256 || (projectProposalSession !== null && !["rejected", "cancelled", "stale", "committed", "recovered", "undone", "redone"].includes(projectProposalSession.history.status))} onClick={() => void previewProjectAddScene}>Preview blank Scene addition</button>
          <p>{activeProjectId ? `${currentProjectScenes.length} ordered Scene${currentProjectScenes.length === 1 ? "" : "s"} · active ${activeSceneId} · adding a Scene is preview → approval → committed in-memory apply → explicit undo, with no project persistence or Foundry write.` : "Scene navigation becomes available after a project is created or opened."}</p>
          <label htmlFor="project-background-import">Selected Scene background (PNG, max 32 MiB)</label>
          <input id="project-background-import" type="file" accept="image/png" disabled={!nativeProjectStoreAvailable || projectBusy || !activeProjectId || projectDirty} onChange={importSelectedSceneBackground} />
          <p>{document.background.assetId ? `Bound background: ${document.background.assetId}` : "No background asset is bound; importing a PNG creates a no-write, approval-bound background proposal and never selects an image implicitly."}</p>
          <label htmlFor="project-handout-import">Non-scene handout asset (PNG or WebP, max 32 MiB)</label>
          <input id="project-handout-import" type="file" accept="image/png,image/webp" disabled={!nativeProjectStoreAvailable || projectBusy || !activeProjectId} onChange={importProjectHandout} />
          <p>{handoutAssetId ? `Registered handout: ${handoutAssetId}` : "No handout asset is registered; handouts remain non-scene assets and are never selected as backgrounds."}</p>
          <label htmlFor="project-audio-import">Non-scene audio asset (WAV / audio/wav, max 32 MiB)</label>
          <input id="project-audio-import" type="file" accept="audio/wav" disabled={!nativeProjectStoreAvailable || projectBusy || !activeProjectId} onChange={importProjectAudio} />
          <p>{audioAssetId ? `Registered audio: ${audioAssetId}` : "No audio asset is registered; audio remains non-scene metadata and is never selected as a background."}</p>
          <label htmlFor="project-token-import">Non-scene token image (PNG or WebP, max 32 MiB)</label>
          <input id="project-token-import" type="file" accept="image/png,image/webp" disabled={!nativeProjectStoreAvailable || projectBusy || !activeProjectId} onChange={importProjectToken} />
          <p>{tokenAssetId ? `Registered token image: ${tokenAssetId}` : "No token image is registered; token remains non-scene metadata and is never selected as a background."}</p>
          <p>{workspaceMetadataWarning ? `Workspace metadata warning: ${workspaceMetadataWarning}. Valid projects remain readable.` : `Workspace metadata generation ${workspaceIndexGeneration} · recent order is monotonic, not wall-clock based.`}</p>
          <button type="button" disabled={!nativeProjectStoreAvailable || projectBusy || !activeProjectId || projectGeneration === 0} onClick={compileFoundryPreview}>Compile no-write Foundry preview</button>
          <output aria-live="polite">
            {projectError
              ?? projectCloseNotice
              ?? (foundryPreview
                ? `PASS: ${foundryPreview.documents.length} candidates · ${foundryPreview.planSha256.slice(0, 12)}… · foreign/unknown preserved · no write`
                : projectLoadResponse
                  ? `Loaded generation ${projectLoadResponse.receipt.generation} · ${projectLoadResponse.receipt.sceneCount} Scene${projectLoadResponse.receipt.sceneCount === 1 ? "" : "s"} · ${projectLoadResponse.receipt.migrationStatus} · ${projectLoadResponse.receipt.assetCount} content-addressed asset · no Foundry write`
                  : projectSaveReceipt
                    ? `Saved generation ${projectSaveReceipt.generation} atomically · ${projectSaveReceipt.sceneCount} Scene${projectSaveReceipt.sceneCount === 1 ? "" : "s"} · ${projectSaveReceipt.contentSha256.slice(0, 12)}… · no Foundry write`
                    : nativeProjectStoreAvailable ? `${projectCatalog.length} catalog entr${projectCatalog.length === 1 ? "y" : "ies"} · choose or create a project; no implicit fixture write` : "Project storage is available in the packaged desktop app.")}
          </output>
        </section>
        <section className="codex-account" aria-labelledby="codex-account-heading">
          <h2 id="codex-account-heading">AI account boundaries</h2>
          <p>Campaign Director transport is explicitly selected. Subscription, API usage, and offline modes never switch automatically; proposals remain review-only until application approval.</p>
          <label htmlFor="campaign-director-provider">Campaign Director provider</label>
          <select
            id="campaign-director-provider"
            value={directorProviderMode}
            onChange={(event) => {
              setDirectorProviderMode(event.target.value as CampaignDirectorProviderMode);
              setDirectorProposal(null);
              setDirectorError(null);
            }}
          >
            <option value="chatgpt-subscription">ChatGPT subscription (managed App Server)</option>
            <option value="api-key">API key backup (separate billing)</option>
            <option value="offline">AI offline</option>
          </select>
          <form className="credential-form" autoComplete="off" onSubmit={storeDirectorCredential}>
            <label htmlFor="campaign-director-api-key">Campaign Director API key</label>
            <input
              id="campaign-director-api-key"
              name="campaign-director-api-key"
              type="password"
              value={directorApiKey}
              onChange={(event) => setDirectorApiKey(event.target.value)}
              autoComplete="new-password"
              spellCheck={false}
              disabled={!nativeCampaignDirectorAvailable || directorCredentialBusy}
            />
            <button type="submit" disabled={!nativeCampaignDirectorAvailable || directorCredentialBusy || directorApiKey.length === 0}>Store in OS credential manager</button>
          </form>
          <div className="history-actions">
            <button type="button" disabled={!nativeCampaignDirectorAvailable || directorCredentialBusy} onClick={inspectDirectorCredential}>Check API credential</button>
            <button type="button" disabled={!nativeCampaignDirectorAvailable || directorCredentialBusy || directorCredential?.source !== "os-keyring"} onClick={clearDirectorCredential}>Remove stored key</button>
          </div>
          <output aria-live="polite">
            {directorCredentialError
              ?? (directorCredential
                ? `${directorCredential.status}: Campaign Director credential ${directorCredential.configured ? `configured via ${directorCredential.source}` : "not configured"} · secret not returned · no project write`
                : "Campaign Director credential not checked. The key is never written to the project.")}
          </output>
          <button type="button" disabled={!nativeCodexProbeAvailable || codexProbeBusy} onClick={inspectCodexAccount}>
            {codexProbeBusy ? "Checking Codex…" : "Check Codex account"}
          </button>
          <output aria-live="polite">
            {codexProbeError
              ?? (codexAccount
                ? `${codexAccount.status}: Codex ${codexAccount.authMode ?? "not signed in"}${codexAccount.planType ? ` · ${codexAccount.planType} plan` : ""} · ${formatRateLimit(codexAccount.rateLimitMetadata)} · ${formatUsage(codexAccount.usageMetadata)} · managed ChatGPT uses subscription access; API key backup is separately billed and never selected automatically · API key ${codexAccount.campaignDirectorApiKeyConfigured ? `configured via ${codexAccount.campaignDirectorCredentialSource}` : "not configured"} · secrets not returned · no write`
                : nativeCodexProbeAvailable ? "Codex account not checked." : "Codex account probing is available in the packaged desktop app.")}
          </output>
        </section>
      </aside>
    </div>
  );
}
