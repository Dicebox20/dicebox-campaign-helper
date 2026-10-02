import {
  projectStage11FreshExactRuntimeCurrentAuthorityLinkageAttachmentSchema,
  type ProjectStage11FreshExactRuntimeCurrentAuthorityLinkageAttachment,
} from "./project-stage11-fresh-exact-runtime-current-authority-linkage-attachment";
import {
  projectStage11CrossProducerLifecycleContinuityBoundaryEvidenceSchema,
  type ProjectStage11CrossProducerLifecycleContinuityBoundaryEvidence,
} from "./project-stage11-cross-producer-lifecycle-continuity-boundary-evidence";

export const PROJECT_STAGE11_FRESH_EXACT_RUNTIME_LIFECYCLE_CONTINUITY_INDEX_BRIDGE_SCHEMA_VERSION = "0.1.0" as const;

const FRESH_RUNTIME_LINKAGE_SOURCE = "apps/campaign-helper-desktop/src/project-stage11-fresh-exact-runtime-current-authority-linkage-attachment.ts" as const;
const LIFECYCLE_BOUNDARY_SOURCE = "apps/campaign-helper-desktop/src/project-stage11-cross-producer-lifecycle-continuity-boundary-evidence.ts" as const;

export type ProjectStage11FreshExactRuntimeLifecycleContinuityIndexBridge = Readonly<{
  schemaVersion: typeof PROJECT_STAGE11_FRESH_EXACT_RUNTIME_LIFECYCLE_CONTINUITY_INDEX_BRIDGE_SCHEMA_VERSION;
  milestone: "M1024";
  sourceMilestone: "M1022";
  lifecycleBoundaryMilestone: "M1012";
  evidenceLabel: "local";
  freshRuntimeLinkageSource: typeof FRESH_RUNTIME_LINKAGE_SOURCE;
  lifecycleBoundarySource: typeof LIFECYCLE_BOUNDARY_SOURCE;
  bridgeStatus: "bound-strict-typed-non-certifying";
  freshRuntimeLinkageStatus: "bound-to-current-authority-index-non-certifying";
  lifecycleBoundaryStatus: "modeled-cross-producer-partial";
  currentAuthorityStatus: "partial";
  aggregateAuthority: "not-granted";
  modeledOnly: true;
  crossProducerContinuity: "unproven";
  committedRecoveredContinuity: "not-proven";
  modeledOperationCount: 14;
  terminalHistoryIndexCount: 14;
  reviewTerminalEvidenceCount: 42;
  applyingUnknownEvidenceCount: 42;
  recoveryResultEvidenceCount: 56;
  undoRedoEvidenceCount: 28;
  currentAuthorityRedoBindingCount: 9;
  stage11MatrixRedoBindingCount: 8;
  aggregateDirectStrandCount: 9;
  directProjectionCount: 16;
  countScopeStatus: "preserved-explicit-8-9-9";
  indexEntry: Readonly<{
    runtimeMilestone: "M1018";
    aggregateMilestone: "M1020";
    currentAuthorityLinkageMilestone: "M1022";
    lifecycleBoundaryMilestone: "M1012";
    receipt: "outputs/m1018-stage11-host-window-recovery-and-final-exact-runtime-reread-receipt.json";
    receiptSha256: "C64E7137308D211BAE4B7C0DD72E239C317C06EE26CE17690205934FA88B4D7C";
    lifecycleDisposition: "modeled-cross-producer-partial";
    modeledOnly: true;
    committedRecoveredContinuity: "not-proven";
    nonCertifying: true;
    noAuthorityGrant: true;
  }>;
  readOnly: true;
  nonCertifying: true;
  noAuthorityGrant: true;
  noExecutionAuthority: true;
  noTransitionAuthority: true;
  noRecoveryAuthority: true;
  noGenericExecutor: true;
  noFoundryWrite: true;
  noProjectMutation: true;
  stage11AcceptanceStatus: "blocked";
  stage12Started: false;
  readyClaim: false;
}>;

export class ProjectStage11FreshExactRuntimeLifecycleContinuityIndexBridgeValidationError extends Error {
  readonly code = "STAGE11_FRESH_EXACT_RUNTIME_LIFECYCLE_CONTINUITY_INDEX_BRIDGE_VALIDATION_FAILED" as const;
  readonly retryAllowed = false;

  constructor(message: string) {
    super(message);
    this.name = "ProjectStage11FreshExactRuntimeLifecycleContinuityIndexBridgeValidationError";
  }
}

function blocked(message: string): never {
  throw new ProjectStage11FreshExactRuntimeLifecycleContinuityIndexBridgeValidationError(message);
}

function record(value: unknown, label: string): Record<string, unknown> {
  if (value === null || typeof value !== "object" || Array.isArray(value)) blocked(`${label} must be an object.`);
  return value as Record<string, unknown>;
}

function exact(value: unknown, expected: string | number | boolean, label: string): void {
  if (value !== expected) blocked(`${label} must be ${String(expected)}.`);
}

function exactKeys(value: Record<string, unknown>, expected: readonly string[], label: string): void {
  const actual = Object.keys(value).sort();
  const required = [...expected].sort();
  if (actual.length !== required.length || actual.some((key, index) => key !== required[index])) blocked(`${label} contains unknown or missing fields.`);
}

function validateFreshRuntimeLinkage(input: unknown): ProjectStage11FreshExactRuntimeCurrentAuthorityLinkageAttachment {
  const result = projectStage11FreshExactRuntimeCurrentAuthorityLinkageAttachmentSchema.safeParse(input);
  if (!result.success) blocked(`M1022 fresh exact-runtime linkage is invalid: ${result.error.message}`);
  exact(result.data.currentAuthorityStatus, "partial", "M1022 currentAuthorityStatus");
  exact(result.data.aggregateAuthority, "not-granted", "M1022 aggregateAuthority");
  exact(result.data.modeledOperationCount, 14, "M1022 modeledOperationCount");
  exact(result.data.currentAuthorityRedoBindingCount, 9, "M1022 currentAuthorityRedoBindingCount");
  exact(result.data.stage11MatrixRedoBindingCount, 8, "M1022 stage11MatrixRedoBindingCount");
  exact(result.data.aggregateDirectStrandCount, 9, "M1022 aggregateDirectStrandCount");
  exact(result.data.directProjectionCount, 16, "M1022 directProjectionCount");
  exact(result.data.countScopeStatus, "preserved-explicit-8-9-9", "M1022 countScopeStatus");
  return result.data;
}

function validateLifecycleBoundary(input: unknown): ProjectStage11CrossProducerLifecycleContinuityBoundaryEvidence {
  const result = projectStage11CrossProducerLifecycleContinuityBoundaryEvidenceSchema.safeParse(input);
  if (!result.success) blocked(`M1012 lifecycle boundary is invalid: ${result.error.message}`);
  exact(result.data.currentAuthority, "PARTIAL", "M1012 currentAuthority");
  exact(result.data.aggregateAuthority, "NOT_GRANTED", "M1012 aggregateAuthority");
  exact(result.data.disposition, "modeled-cross-producer-partial", "M1012 disposition");
  exact(result.data.modeledOnly, true, "M1012 modeledOnly");
  exact(result.data.crossProducerContinuity, "unproven", "M1012 crossProducerContinuity");
  exact(result.data.committedRecoveredContinuity, "not-proven", "M1012 committedRecoveredContinuity");
  exact(result.data.operationCount, 14, "M1012 operationCount");
  exact(result.data.terminalHistoryIndexCount, 14, "M1012 terminalHistoryIndexCount");
  exact(result.data.reviewTerminalEvidenceCount, 42, "M1012 reviewTerminalEvidenceCount");
  exact(result.data.applyingUnknownEvidenceCount, 42, "M1012 applyingUnknownEvidenceCount");
  exact(result.data.recoveryResultEvidenceCount, 56, "M1012 recoveryResultEvidenceCount");
  exact(result.data.undoRedoEvidenceCount, 28, "M1012 undoRedoEvidenceCount");
  exact(result.data.currentAuthorityRedoEntries, 9, "M1012 currentAuthorityRedoEntries");
  exact(result.data.stage11MatrixRedoBindings, 8, "M1012 stage11MatrixRedoBindings");
  exact(result.data.aggregateDirectStrandCount, 9, "M1012 aggregateDirectStrandCount");
  exact(result.data.countScopeStatus, "preserved-explicit-8-9-9", "M1012 countScopeStatus");
  return result.data;
}

function parseBridge(input: unknown): ProjectStage11FreshExactRuntimeLifecycleContinuityIndexBridge {
  const value = record(input, "M1024 fresh exact-runtime lifecycle-continuity index bridge");
  exactKeys(value, [
    "schemaVersion", "milestone", "sourceMilestone", "lifecycleBoundaryMilestone", "evidenceLabel", "freshRuntimeLinkageSource", "lifecycleBoundarySource", "bridgeStatus", "freshRuntimeLinkageStatus", "lifecycleBoundaryStatus", "currentAuthorityStatus", "aggregateAuthority", "modeledOnly", "crossProducerContinuity", "committedRecoveredContinuity", "modeledOperationCount", "terminalHistoryIndexCount", "reviewTerminalEvidenceCount", "applyingUnknownEvidenceCount", "recoveryResultEvidenceCount", "undoRedoEvidenceCount", "currentAuthorityRedoBindingCount", "stage11MatrixRedoBindingCount", "aggregateDirectStrandCount", "directProjectionCount", "countScopeStatus", "indexEntry", "readOnly", "nonCertifying", "noAuthorityGrant", "noExecutionAuthority", "noTransitionAuthority", "noRecoveryAuthority", "noGenericExecutor", "noFoundryWrite", "noProjectMutation", "stage11AcceptanceStatus", "stage12Started", "readyClaim",
  ], "M1024 bridge");
  exact(value.schemaVersion, "0.1.0", "M1024.schemaVersion");
  exact(value.milestone, "M1024", "M1024.milestone");
  exact(value.sourceMilestone, "M1022", "M1024.sourceMilestone");
  exact(value.lifecycleBoundaryMilestone, "M1012", "M1024.lifecycleBoundaryMilestone");
  exact(value.evidenceLabel, "local", "M1024.evidenceLabel");
  exact(value.freshRuntimeLinkageSource, FRESH_RUNTIME_LINKAGE_SOURCE, "M1024.freshRuntimeLinkageSource");
  exact(value.lifecycleBoundarySource, LIFECYCLE_BOUNDARY_SOURCE, "M1024.lifecycleBoundarySource");
  exact(value.bridgeStatus, "bound-strict-typed-non-certifying", "M1024.bridgeStatus");
  exact(value.freshRuntimeLinkageStatus, "bound-to-current-authority-index-non-certifying", "M1024.freshRuntimeLinkageStatus");
  exact(value.lifecycleBoundaryStatus, "modeled-cross-producer-partial", "M1024.lifecycleBoundaryStatus");
  exact(value.currentAuthorityStatus, "partial", "M1024.currentAuthorityStatus");
  exact(value.aggregateAuthority, "not-granted", "M1024.aggregateAuthority");
  exact(value.modeledOnly, true, "M1024.modeledOnly");
  exact(value.crossProducerContinuity, "unproven", "M1024.crossProducerContinuity");
  exact(value.committedRecoveredContinuity, "not-proven", "M1024.committedRecoveredContinuity");
  for (const [field, expected] of [["modeledOperationCount", 14], ["terminalHistoryIndexCount", 14], ["reviewTerminalEvidenceCount", 42], ["applyingUnknownEvidenceCount", 42], ["recoveryResultEvidenceCount", 56], ["undoRedoEvidenceCount", 28], ["currentAuthorityRedoBindingCount", 9], ["stage11MatrixRedoBindingCount", 8], ["aggregateDirectStrandCount", 9], ["directProjectionCount", 16]] as const) exact(value[field], expected, `M1024.${field}`);
  exact(value.countScopeStatus, "preserved-explicit-8-9-9", "M1024.countScopeStatus");
  for (const field of ["readOnly", "nonCertifying", "noAuthorityGrant", "noExecutionAuthority", "noTransitionAuthority", "noRecoveryAuthority", "noGenericExecutor", "noFoundryWrite", "noProjectMutation"] as const) exact(value[field], true, `M1024.${field}`);
  exact(value.stage11AcceptanceStatus, "blocked", "M1024.stage11AcceptanceStatus");
  exact(value.stage12Started, false, "M1024.stage12Started");
  exact(value.readyClaim, false, "M1024.readyClaim");
  const indexEntry = record(value.indexEntry, "M1024.indexEntry");
  exactKeys(indexEntry, ["runtimeMilestone", "aggregateMilestone", "currentAuthorityLinkageMilestone", "lifecycleBoundaryMilestone", "receipt", "receiptSha256", "lifecycleDisposition", "modeledOnly", "committedRecoveredContinuity", "nonCertifying", "noAuthorityGrant"], "M1024.indexEntry");
  exact(indexEntry.runtimeMilestone, "M1018", "M1024.indexEntry.runtimeMilestone");
  exact(indexEntry.aggregateMilestone, "M1020", "M1024.indexEntry.aggregateMilestone");
  exact(indexEntry.currentAuthorityLinkageMilestone, "M1022", "M1024.indexEntry.currentAuthorityLinkageMilestone");
  exact(indexEntry.lifecycleBoundaryMilestone, "M1012", "M1024.indexEntry.lifecycleBoundaryMilestone");
  exact(indexEntry.receipt, "outputs/m1018-stage11-host-window-recovery-and-final-exact-runtime-reread-receipt.json", "M1024.indexEntry.receipt");
  exact(indexEntry.receiptSha256, "C64E7137308D211BAE4B7C0DD72E239C317C06EE26CE17690205934FA88B4D7C", "M1024.indexEntry.receiptSha256");
  exact(indexEntry.lifecycleDisposition, "modeled-cross-producer-partial", "M1024.indexEntry.lifecycleDisposition");
  exact(indexEntry.modeledOnly, true, "M1024.indexEntry.modeledOnly");
  exact(indexEntry.committedRecoveredContinuity, "not-proven", "M1024.indexEntry.committedRecoveredContinuity");
  exact(indexEntry.nonCertifying, true, "M1024.indexEntry.nonCertifying");
  exact(indexEntry.noAuthorityGrant, true, "M1024.indexEntry.noAuthorityGrant");
  return value as ProjectStage11FreshExactRuntimeLifecycleContinuityIndexBridge;
}

export function createProjectStage11FreshExactRuntimeLifecycleContinuityIndexBridge(input: unknown): ProjectStage11FreshExactRuntimeLifecycleContinuityIndexBridge {
  const bundle = record(input, "M1024 source bundle");
  exactKeys(bundle, ["freshRuntimeCurrentAuthorityLinkage", "lifecycleBoundary"], "M1024 source bundle");
  const freshRuntime = validateFreshRuntimeLinkage(bundle.freshRuntimeCurrentAuthorityLinkage);
  const lifecycle = validateLifecycleBoundary(bundle.lifecycleBoundary);
  return Object.freeze({
    schemaVersion: PROJECT_STAGE11_FRESH_EXACT_RUNTIME_LIFECYCLE_CONTINUITY_INDEX_BRIDGE_SCHEMA_VERSION,
    milestone: "M1024",
    sourceMilestone: "M1022",
    lifecycleBoundaryMilestone: "M1012",
    evidenceLabel: "local",
    freshRuntimeLinkageSource: FRESH_RUNTIME_LINKAGE_SOURCE,
    lifecycleBoundarySource: LIFECYCLE_BOUNDARY_SOURCE,
    bridgeStatus: "bound-strict-typed-non-certifying",
    freshRuntimeLinkageStatus: freshRuntime.freshRuntimeAttachmentStatus,
    lifecycleBoundaryStatus: lifecycle.disposition,
    currentAuthorityStatus: freshRuntime.currentAuthorityStatus,
    aggregateAuthority: freshRuntime.aggregateAuthority,
    modeledOnly: lifecycle.modeledOnly,
    crossProducerContinuity: lifecycle.crossProducerContinuity,
    committedRecoveredContinuity: lifecycle.committedRecoveredContinuity,
    modeledOperationCount: lifecycle.operationCount,
    terminalHistoryIndexCount: lifecycle.terminalHistoryIndexCount,
    reviewTerminalEvidenceCount: lifecycle.reviewTerminalEvidenceCount,
    applyingUnknownEvidenceCount: lifecycle.applyingUnknownEvidenceCount,
    recoveryResultEvidenceCount: lifecycle.recoveryResultEvidenceCount,
    undoRedoEvidenceCount: lifecycle.undoRedoEvidenceCount,
    currentAuthorityRedoBindingCount: freshRuntime.currentAuthorityRedoBindingCount,
    stage11MatrixRedoBindingCount: freshRuntime.stage11MatrixRedoBindingCount,
    aggregateDirectStrandCount: freshRuntime.aggregateDirectStrandCount,
    directProjectionCount: freshRuntime.directProjectionCount,
    countScopeStatus: "preserved-explicit-8-9-9",
    indexEntry: Object.freeze({
      runtimeMilestone: "M1018",
      aggregateMilestone: "M1020",
      currentAuthorityLinkageMilestone: "M1022",
      lifecycleBoundaryMilestone: "M1012",
      receipt: freshRuntime.indexEntry.receipt,
      receiptSha256: freshRuntime.indexEntry.receiptSha256,
      lifecycleDisposition: lifecycle.disposition,
      modeledOnly: true,
      committedRecoveredContinuity: lifecycle.committedRecoveredContinuity,
      nonCertifying: true,
      noAuthorityGrant: true,
    }),
    readOnly: true,
    nonCertifying: true,
    noAuthorityGrant: true,
    noExecutionAuthority: true,
    noTransitionAuthority: true,
    noRecoveryAuthority: true,
    noGenericExecutor: true,
    noFoundryWrite: true,
    noProjectMutation: true,
    stage11AcceptanceStatus: "blocked",
    stage12Started: false,
    readyClaim: false,
  });
}

export const projectStage11FreshExactRuntimeLifecycleContinuityIndexBridgeSchema = Object.freeze({
  parse(input: unknown): ProjectStage11FreshExactRuntimeLifecycleContinuityIndexBridge {
    return parseBridge(input);
  },
  safeParse(input: unknown):
    | Readonly<{ success: true; data: ProjectStage11FreshExactRuntimeLifecycleContinuityIndexBridge }>
    | Readonly<{ success: false; error: ProjectStage11FreshExactRuntimeLifecycleContinuityIndexBridgeValidationError }> {
    try {
      return { success: true, data: parseBridge(input) };
    } catch (error) {
      const validationError = error instanceof ProjectStage11FreshExactRuntimeLifecycleContinuityIndexBridgeValidationError
        ? error
        : new ProjectStage11FreshExactRuntimeLifecycleContinuityIndexBridgeValidationError(error instanceof Error ? error.message : String(error));
      return { success: false, error: validationError };
    }
  },
});
