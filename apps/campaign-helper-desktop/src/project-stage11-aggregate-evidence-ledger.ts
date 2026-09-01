import {
  bridgeProjectCrossPlaneCurrentAuthorityEvidence,
  type ProjectCrossPlaneCurrentAuthorityEvidenceReceipt,
} from "./project-cross-plane-current-authority-evidence";
import {
  bridgeProjectCrossProducerLifecycleContinuityEvidence,
  type ProjectCrossProducerLifecycleContinuityEvidenceReceipt,
} from "./project-cross-producer-lifecycle-continuity-evidence";
import {
  type ProjectStage11DirectLifecycleEvidenceReceipt,
} from "./project-stage11-direct-lifecycle-evidence";
import {
  type ProjectStage11DirectHumanProposalEvidenceReceipt,
} from "./project-stage11-direct-human-proposal-evidence";
import {
  type ProjectStage11DirectCampaignDirectorProposalEvidenceReceipt,
} from "./project-stage11-direct-campaign-director-proposal-evidence";
import {
  createProjectStage11UpdateWitnessEvidence,
  type ProjectStage11UpdateWitnessEvidenceReceipt,
} from "./project-stage11-update-witness-evidence";
import {
  createProjectStage11PackagedRuntimeDiagnosticEvidence,
  type ProjectStage11PackagedRuntimeDiagnosticEvidenceReceipt,
} from "./project-stage11-packaged-runtime-diagnostic-evidence";
import {
  createProjectStage11PackagedAssetDetachEvidence,
  type ProjectStage11PackagedAssetDetachEvidenceReceipt,
} from "./project-stage11-packaged-asset-detach-evidence";
import {
  createProjectStage11PackagedAssetRestoreEvidence,
  type ProjectStage11PackagedAssetRestoreEvidenceReceipt,
} from "./project-stage11-packaged-asset-restore-evidence";
import {
  createProjectStage11PackagedBrokenReferenceEvidence,
  type ProjectStage11PackagedBrokenReferenceEvidenceReceipt,
} from "./project-stage11-packaged-broken-reference-evidence";
import {
  createProjectStage11BackupPromotionRecoveryEvidence,
  type ProjectStage11BackupPromotionRecoveryEvidenceReceipt,
} from "./project-stage11-backup-promotion-recovery-evidence";
import {
  createProjectStage11ProposalSemanticEvidence,
  type ProjectStage11ProposalSemanticEvidence,
} from "./project-stage11-proposal-semantic-evidence";
import {
  createProjectStage11SemanticRedoEvidence,
  type ProjectStage11SemanticRedoEvidence,
} from "./project-stage11-semantic-redo-evidence";

export const PROJECT_STAGE11_AGGREGATE_EVIDENCE_LEDGER_SCHEMA_VERSION = "0.1.0" as const;

export type ProjectStage11AggregateEvidenceLedgerReceipt = Readonly<{
  schemaVersion: typeof PROJECT_STAGE11_AGGREGATE_EVIDENCE_LEDGER_SCHEMA_VERSION;
  status: "PASS";
  disposition: "aggregate-stage11-partial";
  currentAuthority: ProjectCrossPlaneCurrentAuthorityEvidenceReceipt;
  lifecycleContinuity: ProjectCrossProducerLifecycleContinuityEvidenceReceipt;
  directLocalLifecycleEvidence: ProjectStage11DirectLifecycleEvidenceReceipt;
  directHumanProposalEvidence: ProjectStage11DirectHumanProposalEvidenceReceipt;
  directCampaignDirectorProposalEvidence: ProjectStage11DirectCampaignDirectorProposalEvidenceReceipt;
  directUpdateWitnessEvidence: ProjectStage11UpdateWitnessEvidenceReceipt;
  directPackagedRuntimeDiagnosticEvidence: ProjectStage11PackagedRuntimeDiagnosticEvidenceReceipt;
  directPackagedAssetDetachEvidence: ProjectStage11PackagedAssetDetachEvidenceReceipt;
  directPackagedAssetRestoreEvidence?: ProjectStage11PackagedAssetRestoreEvidenceReceipt;
  directPackagedBrokenReferenceEvidence?: ProjectStage11PackagedBrokenReferenceEvidenceReceipt;
  directBackupPromotionRecoveryEvidence?: ProjectStage11BackupPromotionRecoveryEvidenceReceipt;
  proposalSemanticEvidence: ProjectStage11ProposalSemanticEvidence;
  semanticRedoEvidence: ProjectStage11SemanticRedoEvidence;
  directOwnedScenePermissionEvidence: "one-owned-scene-predicate-observed";
  directRuntimeEvidence: "current-active-gm-identity-observed";
  historicalPackageEvidence: "served-no-dialog-observation";
  lifecycleEvidence: "modeled-cross-producer-partial";
  operationCount: 14;
  readOnly: true;
  nonCertifying: true;
  noPermissionAuthority: true;
  noExecutionAuthority: true;
  noTransitionAuthority: true;
  noRecoveryAuthority: true;
  noFoundryWrite: true;
  noProjectMutation: true;
  readyClaim: false;
  stage11AcceptanceStatus: "blocked";
  stage12Started: false;
  remainingBlockers: readonly string[];
}>;

export class ProjectStage11AggregateEvidenceLedgerValidationError extends Error {
  readonly code = "STAGE11_AGGREGATE_EVIDENCE_LEDGER_VALIDATION_FAILED" as const;
  readonly retryAllowed = false;
  constructor(message: string) { super(message); this.name = "ProjectStage11AggregateEvidenceLedgerValidationError"; }
}

function blocked(message: string): never { throw new ProjectStage11AggregateEvidenceLedgerValidationError(message); }
function exact(value: unknown, expected: string | number | boolean, label: string): void {
  if (value !== expected) blocked(`${label} must be ${String(expected)}.`);
}
function exactKeys(value: Record<string, unknown>, expected: readonly string[], label: string): void {
  const actual = Object.keys(value).sort();
  const required = [...expected].sort();
  if (actual.length !== required.length || actual.some((key, index) => key !== required[index])) blocked(`${label} contains unknown or missing fields.`);
}

function validateDirectLocalLifecycleEvidence(input: unknown): ProjectStage11DirectLifecycleEvidenceReceipt {
  const receipt = input as Record<string, unknown>;
  if (!receipt || typeof receipt !== "object" || Array.isArray(receipt)) blocked("direct local lifecycle evidence must be an object.");
  const actualKeys = Object.keys(receipt).sort();
  // M797's receipt is intentionally represented by its stable typed output, not by raw producer payloads.
  const requiredKeys = ["disposition", "noAuthorityGrant", "noCoverageClaim", "noExecutionAuthority", "noFoundryAuthority", "noFoundryWrite", "noRecoveryAuthority", "observations", "observedLifecycleCount", "producerScopedOnly", "readOnly", "schemaVersion", "stage11AcceptanceStatus", "stage12Started", "status"].sort();
  if (actualKeys.length !== requiredKeys.length || actualKeys.some((key, index) => key !== requiredKeys[index])) blocked("direct local lifecycle evidence contains unknown or missing fields.");
  exact(receipt.schemaVersion, "0.1.0", "direct local lifecycle evidence.schemaVersion");
  exact(receipt.status, "PASS", "direct local lifecycle evidence.status");
  exact(receipt.disposition, "two-producer-scoped-local-observations", "direct local lifecycle evidence.disposition");
  exact(receipt.observedLifecycleCount, 2, "direct local lifecycle evidence.observedLifecycleCount");
  for (const field of ["producerScopedOnly", "readOnly", "noAuthorityGrant", "noCoverageClaim", "noFoundryAuthority", "noExecutionAuthority", "noRecoveryAuthority", "noFoundryWrite"] as const) exact(receipt[field], true, `direct local lifecycle evidence.${field}`);
  exact(receipt.stage11AcceptanceStatus, "blocked", "direct local lifecycle evidence.stage11AcceptanceStatus");
  exact(receipt.stage12Started, false, "direct local lifecycle evidence.stage12Started");
  const observations = receipt.observations;
  if (!Array.isArray(observations) || observations.length !== 2) blocked("direct local lifecycle evidence must contain exactly two observations.");
  const expected = [
    { milestone: "M466", producer: "project.recovery.backup-promotion", lifecycle: "preview-proposal-approval-apply-reread" },
    { milestone: "M645", producer: "project.save", lifecycle: "preview-approval-save-reread-inverse-restore" },
  ];
  observations.forEach((value, index) => {
    if (!value || typeof value !== "object" || Array.isArray(value)) blocked(`direct local lifecycle evidence.observations[${index}] must be an object.`);
    const observation = value as Record<string, unknown>;
    exactKeys(observation, ["lifecycle", "milestone", "producer"], `direct local lifecycle evidence.observations[${index}]`);
    exact(observation.milestone, expected[index]!.milestone, `direct local lifecycle evidence.observations[${index}].milestone`);
    exact(observation.producer, expected[index]!.producer, `direct local lifecycle evidence.observations[${index}].producer`);
    exact(observation.lifecycle, expected[index]!.lifecycle, `direct local lifecycle evidence.observations[${index}].lifecycle`);
  });
  return receipt as ProjectStage11DirectLifecycleEvidenceReceipt;
}

function validateDirectHumanProposalEvidence(input: unknown): ProjectStage11DirectHumanProposalEvidenceReceipt {
  const receipt = input as Record<string, unknown>;
  if (!receipt || typeof receipt !== "object" || Array.isArray(receipt)) blocked("direct human proposal evidence must be an object.");
  const requiredKeys = ["approvalNoWrite", "applyRereadMatched", "browserDiagnosticsEmpty", "disposition", "localBrowserObserved", "noAuthorityGrant", "noCoverageClaim", "noExecutionAuthority", "noFoundryAuthority", "noProjectMutation", "nonCertifying", "observations", "observedLifecycleCount", "previewNoWrite", "producerScopedOnly", "readOnly", "redoRereadMatched", "schemaVersion", "stage11AcceptanceStatus", "stage12Started", "status", "undoRereadMatched", "readyClaim"].sort();
  const actualKeys = Object.keys(receipt).sort();
  if (actualKeys.length !== requiredKeys.length || actualKeys.some((key, index) => key !== requiredKeys[index])) blocked("direct human proposal evidence contains unknown or missing fields.");
  exact(receipt.schemaVersion, "0.1.0", "direct human proposal evidence.schemaVersion");
  exact(receipt.status, "PASS", "direct human proposal evidence.status");
  exact(receipt.disposition, "one-producer-scoped-local-browser-observation", "direct human proposal evidence.disposition");
  exact(receipt.observedLifecycleCount, 1, "direct human proposal evidence.observedLifecycleCount");
  for (const field of ["producerScopedOnly", "localBrowserObserved", "previewNoWrite", "approvalNoWrite", "applyRereadMatched", "undoRereadMatched", "redoRereadMatched", "browserDiagnosticsEmpty", "readOnly", "nonCertifying", "noAuthorityGrant", "noCoverageClaim", "noFoundryAuthority", "noExecutionAuthority", "noProjectMutation"] as const) exact(receipt[field], true, `direct human proposal evidence.${field}`);
  exact(receipt.stage11AcceptanceStatus, "blocked", "direct human proposal evidence.stage11AcceptanceStatus");
  exact(receipt.stage12Started, false, "direct human proposal evidence.stage12Started");
  exact(receipt.readyClaim, false, "direct human proposal evidence.readyClaim");
  const observations = receipt.observations;
  if (!Array.isArray(observations) || observations.length !== 1) blocked("direct human proposal evidence must contain one observation.");
  const observation = observations[0];
  if (!observation || typeof observation !== "object" || Array.isArray(observation)) blocked("direct human proposal evidence.observations[0] must be an object.");
  const item = observation as Record<string, unknown>;
  exactKeys(item, ["lifecycle", "milestone", "producer"], "direct human proposal evidence.observations[0]");
  exact(item.milestone, "M306", "direct human proposal evidence.observations[0].milestone");
  exact(item.producer, "human", "direct human proposal evidence.observations[0].producer");
  exact(item.lifecycle, "preview-approval-apply-reread-undo-redo", "direct human proposal evidence.observations[0].lifecycle");
  return receipt as ProjectStage11DirectHumanProposalEvidenceReceipt;
}

function validateDirectCampaignDirectorProposalEvidence(input: unknown): ProjectStage11DirectCampaignDirectorProposalEvidenceReceipt {
  const receipt = input as Record<string, unknown>;
  if (!receipt || typeof receipt !== "object" || Array.isArray(receipt)) blocked("direct Campaign Director proposal evidence must be an object.");
  const requiredKeys = ["approvalNoWrite", "applyRereadMatched", "browserDiagnosticsEmpty", "disposition", "localBrowserObserved", "noAuthorityGrant", "noCoverageClaim", "noExecutionAuthority", "noFoundryAuthority", "noProjectMutation", "nonCertifying", "observations", "observedLifecycleCount", "previewNoWrite", "producerScopedOnly", "readOnly", "redoRereadMatched", "readyClaim", "schemaVersion", "stage11AcceptanceStatus", "stage12Started", "staleInvalidated", "status", "undoRereadMatched"].sort();
  const actualKeys = Object.keys(receipt).sort();
  if (actualKeys.length !== requiredKeys.length || actualKeys.some((key, index) => key !== requiredKeys[index])) blocked("direct Campaign Director proposal evidence contains unknown or missing fields.");
  exact(receipt.schemaVersion, "0.1.0", "direct Campaign Director proposal evidence.schemaVersion");
  exact(receipt.status, "PASS", "direct Campaign Director proposal evidence.status");
  exact(receipt.disposition, "one-producer-scoped-local-browser-observation", "direct Campaign Director proposal evidence.disposition");
  exact(receipt.observedLifecycleCount, 1, "direct Campaign Director proposal evidence.observedLifecycleCount");
  for (const field of ["producerScopedOnly", "localBrowserObserved", "previewNoWrite", "approvalNoWrite", "applyRereadMatched", "undoRereadMatched", "redoRereadMatched", "staleInvalidated", "browserDiagnosticsEmpty", "readOnly", "nonCertifying", "noAuthorityGrant", "noCoverageClaim", "noFoundryAuthority", "noExecutionAuthority", "noProjectMutation"] as const) exact(receipt[field], true, `direct Campaign Director proposal evidence.${field}`);
  exact(receipt.stage11AcceptanceStatus, "blocked", "direct Campaign Director proposal evidence.stage11AcceptanceStatus");
  exact(receipt.stage12Started, false, "direct Campaign Director proposal evidence.stage12Started");
  exact(receipt.readyClaim, false, "direct Campaign Director proposal evidence.readyClaim");
  const observations = receipt.observations;
  if (!Array.isArray(observations) || observations.length !== 1) blocked("direct Campaign Director proposal evidence must contain one observation.");
  const observation = observations[0];
  if (!observation || typeof observation !== "object" || Array.isArray(observation)) blocked("direct Campaign Director proposal evidence.observations[0] must be an object.");
  const item = observation as Record<string, unknown>;
  exactKeys(item, ["lifecycle", "milestone", "producer"], "direct Campaign Director proposal evidence.observations[0]");
  exact(item.milestone, "M303", "direct Campaign Director proposal evidence.observations[0].milestone");
  exact(item.producer, "campaign-director", "direct Campaign Director proposal evidence.observations[0].producer");
  exact(item.lifecycle, "preview-approval-apply-reread-undo-redo-stale-invalidation", "direct Campaign Director proposal evidence.observations[0].lifecycle");
  return receipt as ProjectStage11DirectCampaignDirectorProposalEvidenceReceipt;
}

export function createProjectStage11AggregateEvidenceLedger(
  localInput: unknown,
  fixtureInput: unknown,
  packageStageInput: unknown,
  currentActiveGmDialogInput: unknown,
  ownedScenePermissionInput: unknown,
  foundryInverseInput: unknown,
  lifecycleInput: unknown,
  directLocalLifecycleInput: unknown,
  directHumanProposalInput: unknown,
  directCampaignDirectorProposalInput: unknown,
  proposalSemanticInput: unknown,
  semanticRedoInput: unknown,
  updateWitnessInput?: unknown,
  witnessRereadInput?: unknown,
  packagedRuntimeDiagnosticInput?: unknown,
  packagedAssetDetachInput?: unknown,
  packagedAssetRestoreInput?: unknown,
  packagedBrokenReferenceInput?: unknown,
  backupPromotionRecoveryInput?: unknown,
): ProjectStage11AggregateEvidenceLedgerReceipt {
  const currentAuthority = bridgeProjectCrossPlaneCurrentAuthorityEvidence(localInput, fixtureInput, packageStageInput, currentActiveGmDialogInput, ownedScenePermissionInput, foundryInverseInput);
  const lifecycleContinuity = bridgeProjectCrossProducerLifecycleContinuityEvidence(lifecycleInput, foundryInverseInput);
  const directLocalLifecycleEvidence = validateDirectLocalLifecycleEvidence(directLocalLifecycleInput);
  const directHumanProposalEvidence = validateDirectHumanProposalEvidence(directHumanProposalInput);
  const directCampaignDirectorProposalEvidence = validateDirectCampaignDirectorProposalEvidence(directCampaignDirectorProposalInput);
  const directUpdateWitnessEvidence = createProjectStage11UpdateWitnessEvidence(updateWitnessInput, witnessRereadInput);
  const directPackagedRuntimeDiagnosticEvidence = createProjectStage11PackagedRuntimeDiagnosticEvidence(packagedRuntimeDiagnosticInput);
  const directPackagedAssetDetachEvidence = createProjectStage11PackagedAssetDetachEvidence(packagedAssetDetachInput);
  const directPackagedAssetRestoreEvidence = packagedAssetRestoreInput === undefined ? undefined : createProjectStage11PackagedAssetRestoreEvidence(packagedAssetRestoreInput);
  const directPackagedBrokenReferenceEvidence = packagedBrokenReferenceInput === undefined ? undefined : createProjectStage11PackagedBrokenReferenceEvidence(packagedBrokenReferenceInput);
  const directBackupPromotionRecoveryEvidence = backupPromotionRecoveryInput === undefined ? undefined : createProjectStage11BackupPromotionRecoveryEvidence(backupPromotionRecoveryInput);
  if (proposalSemanticInput === undefined) blocked("proposal semantic evidence is required and cannot be manufactured by the aggregate ledger.");
  const proposalSemanticEvidence = createProjectStage11ProposalSemanticEvidence(proposalSemanticInput);
  if (semanticRedoInput === undefined) blocked("semantic redo evidence is required and cannot be manufactured by the aggregate ledger.");
  const semanticRedoEvidence = createProjectStage11SemanticRedoEvidence(semanticRedoInput);
  if (currentAuthority.authority.aggregate !== "not-granted") blocked("current authority aggregate must remain not-granted.");
  if (currentAuthority.authority.directRuntime !== "current-active-gm-identity-observed") blocked("direct runtime evidence must be the fixed current-active-GM identity observation.");
  if (currentAuthority.authority.scenePermission !== "one-owned-scene-predicate-observed" || currentAuthority.ownedScenePermissionEvidence.noUpdateInvoked !== true) blocked("owned Scene permission evidence must remain one no-update predicate observation.");
  if (currentAuthority.authority.package !== "served-no-dialog-observation") blocked("historical package evidence must remain distinct served-no-dialog observation.");
  if (currentAuthority.authority.foundryInverse !== "producer-scoped-fixture-observed" || currentAuthority.foundryInverseEvidence.observedLifecycleCount !== 1) blocked("Foundry inverse evidence must remain one producer-scoped fixture observation.");
  if (currentAuthority.stage11AcceptanceStatus !== "blocked" || lifecycleContinuity.stage11AcceptanceStatus !== "blocked") blocked("all evidence planes must retain Stage 11 blocked.");
  if (currentAuthority.stage12Started || lifecycleContinuity.stage12Started) blocked("Stage 12 must remain locked.");
  if (lifecycleContinuity.operationCount !== 14 || lifecycleContinuity.modeledOnly !== true || lifecycleContinuity.noRecoveryAuthority !== true) blocked("lifecycle evidence must retain exact modeled-only fourteen-operation coverage.");
  if (directLocalLifecycleEvidence.observedLifecycleCount !== 2 || directLocalLifecycleEvidence.producerScopedOnly !== true || directLocalLifecycleEvidence.noFoundryWrite !== true) blocked("direct local lifecycle evidence must remain two producer-scoped no-Foundry-write observations.");
  if (directHumanProposalEvidence.observedLifecycleCount !== 1 || directHumanProposalEvidence.producerScopedOnly !== true || directHumanProposalEvidence.localBrowserObserved !== true) blocked("direct human proposal evidence must remain one producer-scoped local-browser observation.");
  if (directCampaignDirectorProposalEvidence.observedLifecycleCount !== 1 || directCampaignDirectorProposalEvidence.producerScopedOnly !== true || directCampaignDirectorProposalEvidence.staleInvalidated !== true) blocked("direct Campaign Director proposal evidence must remain one producer-scoped stale-invalidated local-browser observation.");
  if (directUpdateWitnessEvidence.observedLifecycleCount !== 1 || directUpdateWitnessEvidence.producerScopedOnly !== true || directUpdateWitnessEvidence.independentNoWriteReread !== true || directUpdateWitnessEvidence.restorationReread !== true) blocked("direct update witness evidence must remain one producer-scoped fixed update and independent no-write reread observation.");
  if (directPackagedRuntimeDiagnosticEvidence.observedLifecycleCount !== 1 || directPackagedRuntimeDiagnosticEvidence.producerScopedOnly !== true || directPackagedRuntimeDiagnosticEvidence.redactedNoWriteObserved !== true) blocked("direct packaged/runtime diagnostic evidence must remain one producer-scoped redacted no-write observation.");
  if (directPackagedAssetDetachEvidence.observedLifecycleCount !== 1 || directPackagedAssetDetachEvidence.producerScopedOnly !== true || directPackagedAssetDetachEvidence.packagedLifecycleObserved !== true || directPackagedAssetDetachEvidence.authoritativeReread !== true) blocked("direct packaged project.asset.detach evidence must remain one producer-scoped packaged lifecycle and authoritative reread observation.");
  if (directPackagedAssetRestoreEvidence && (directPackagedAssetRestoreEvidence.observedLifecycleCount !== 1 || directPackagedAssetRestoreEvidence.producerScopedOnly !== true || directPackagedAssetRestoreEvidence.packagedLifecycleObserved !== true || directPackagedAssetRestoreEvidence.authoritativeReread !== true)) blocked("direct packaged project.asset.restore evidence must remain one producer-scoped packaged lifecycle and authoritative reread observation.");
  if (directPackagedBrokenReferenceEvidence && (directPackagedBrokenReferenceEvidence.observedLifecycleCount !== 1 || directPackagedBrokenReferenceEvidence.producerScopedOnly !== true || directPackagedBrokenReferenceEvidence.packagedLifecycleObserved !== true || directPackagedBrokenReferenceEvidence.authoritativeReread !== true)) blocked("direct packaged project.broken-reference.detach evidence must remain one producer-scoped packaged lifecycle and authoritative reread observation.");
  if (directBackupPromotionRecoveryEvidence && (directBackupPromotionRecoveryEvidence.observedLifecycleCount !== 1 || directBackupPromotionRecoveryEvidence.producerScopedOnly !== true || directBackupPromotionRecoveryEvidence.recoveryObserved !== true || directBackupPromotionRecoveryEvidence.authoritativeReread !== true)) blocked("direct backup-promotion recovery evidence must remain one producer-scoped recovery and authoritative reread observation.");
  return Object.freeze({
    schemaVersion: PROJECT_STAGE11_AGGREGATE_EVIDENCE_LEDGER_SCHEMA_VERSION,
    status: "PASS",
    disposition: "aggregate-stage11-partial",
    currentAuthority,
    lifecycleContinuity,
    directLocalLifecycleEvidence,
    directHumanProposalEvidence,
    directCampaignDirectorProposalEvidence,
    directUpdateWitnessEvidence,
    directPackagedRuntimeDiagnosticEvidence,
    directPackagedAssetDetachEvidence,
    ...(directPackagedAssetRestoreEvidence ? { directPackagedAssetRestoreEvidence } : {}),
    ...(directPackagedBrokenReferenceEvidence ? { directPackagedBrokenReferenceEvidence } : {}),
    ...(directBackupPromotionRecoveryEvidence ? { directBackupPromotionRecoveryEvidence } : {}),
    proposalSemanticEvidence,
    semanticRedoEvidence,
    directOwnedScenePermissionEvidence: "one-owned-scene-predicate-observed",
    directRuntimeEvidence: "current-active-gm-identity-observed",
    historicalPackageEvidence: "served-no-dialog-observation",
    lifecycleEvidence: "modeled-cross-producer-partial",
    operationCount: 14,
    readOnly: true,
    nonCertifying: true,
    noPermissionAuthority: true,
    noExecutionAuthority: true,
    noTransitionAuthority: true,
    noRecoveryAuthority: true,
    noFoundryWrite: true,
    noProjectMutation: true,
    readyClaim: false,
    stage11AcceptanceStatus: "blocked",
    stage12Started: false,
    remainingBlockers: Object.freeze([
      "The direct current-active-GM receipt and one owned-Scene predicate remain read-only evidence; they do not prove update execution, proposal authority, or generic/every-document authority.",
      "The lifecycle record is modeled continuity only; it does not prove cross-producer committed or recovered behavior.",
      "The direct update-witness evidence is one fixed owned-Scene fixture strand; it does not grant generic Foundry authority or prove cross-producer coverage.",
      "The packaged/runtime diagnostic is one redacted no-write fixture observation; exact-runtime behavior, permission, and cross-producer authority remain unproven.",
      "The packaged project.asset.detach evidence is one producer-scoped local-project lifecycle; it does not prove every-producer coverage or aggregate recovery authority.",
      "The packaged project.asset.restore evidence is one producer-scoped local-project lifecycle; it does not prove every-producer coverage or aggregate recovery authority.",
      "The packaged project.broken-reference.detach evidence is one producer-scoped local-project lifecycle; it does not prove every-producer coverage or aggregate recovery authority.",
      "The backup-promotion recovery evidence is one producer-scoped local-project recovery lifecycle; it does not prove every-producer coverage or aggregate recovery authority.",
      "Aggregate Stage 11 acceptance remains blocked and Stage 12 remains locked.",
    ]),
  });
}
