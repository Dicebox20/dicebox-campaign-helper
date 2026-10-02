export const PROJECT_STAGE11_PROJECT_SAVE_AS_REDO_HANDLER_CLASSIFIER_AGGREGATE_EVIDENCE_SCHEMA_VERSION = "0.1.0" as const;

const SOURCE_RECEIPT = "outputs/m979-stage11-project-save-as-redo-handler-classifier-evidence-closure-receipt.json" as const;

export type ProjectStage11ProjectSaveAsRedoHandlerClassifierAggregateEvidence = Readonly<{
  schemaVersion: typeof PROJECT_STAGE11_PROJECT_SAVE_AS_REDO_HANDLER_CLASSIFIER_AGGREGATE_EVIDENCE_SCHEMA_VERSION;
  milestone: "M981";
  sourceMilestone: "M979";
  evidenceLabel: "local";
  sourceReceipt: typeof SOURCE_RECEIPT;
  producer: "project.save-as";
  operation: "project.save-as.redo";
  handler: "bridgeProjectSaveAsRedoToTerminalHistory";
  rereadClassifier: "projectSaveAsRedoTerminalHistoryReceiptSchema";
  canonicalClassifierSurface: "projectSaveAsTerminalHistoryReceiptSchema";
  bindingStatus: "bound-operation-specific";
  matchedRereadRequired: true;
  sourceAndTargetIdentityPreserved: true;
  targetAbsentBeforeRedo: true;
  targetPresentAfterRedo: true;
  sourcePreserved: true;
  contentPreserved: true;
  sceneCollectionPreserved: true;
  assetCollectionPreserved: true;
  targetCreationIntegrityPreserved: true;
  sourceInvocation: false;
  rereadInvocation: false;
  operationCount: 14;
  operationCountChanged: false;
  aggregateAttachment: "one-producer-scoped-non-certifying";
  currentAuthority: "partial";
  aggregateAuthority: "not-granted";
  readOnly: true;
  nonCertifying: true;
  noAuthorityGrant: true;
  noExecutionAuthority: true;
  noTransitionAuthority: true;
  noGenericExecutor: true;
  noProjectMutation: true;
  stage11AcceptanceStatus: "blocked";
  stage12Started: false;
  readyClaim: false;
}>;

export class ProjectStage11ProjectSaveAsRedoHandlerClassifierAggregateEvidenceValidationError extends Error {
  readonly code = "STAGE11_PROJECT_SAVE_AS_REDO_HANDLER_CLASSIFIER_AGGREGATE_EVIDENCE_VALIDATION_FAILED" as const;
  readonly retryAllowed = false;

  constructor(message: string) {
    super(message);
    this.name = "ProjectStage11ProjectSaveAsRedoHandlerClassifierAggregateEvidenceValidationError";
  }
}

function blocked(message: string): never {
  throw new ProjectStage11ProjectSaveAsRedoHandlerClassifierAggregateEvidenceValidationError(message);
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
  const wanted = [...expected].sort();
  if (actual.length !== wanted.length || actual.some((key, index) => key !== wanted[index])) blocked(`${label} contains unknown or missing fields.`);
}

function validateSourceReceipt(input: unknown): void {
  const source = record(input, "M979 source receipt");
  exact(source.milestone, "M979", "M979.milestone");
  exact(source.status, "PASS LOCAL CODE-ONLY PROJECT.SAVE-AS REDO HANDLER/CLASSIFIER EVIDENCE; STAGE 11 NOT ACCEPTED", "M979.status");
  const implementation = record(source.implementation, "M979.implementation");
  exact(implementation.source, "apps/campaign-helper-desktop/src/project-stage11-project-save-as-redo-handler-classifier-evidence.ts", "M979.implementation.source");
  exact(implementation.operation, "project.save-as.redo", "M979.implementation.operation");
  exact(implementation.commandKind, "project.save-as", "M979.implementation.commandKind");
  exact(implementation.redoHandler, "bridgeProjectSaveAsRedoToTerminalHistory", "M979.implementation.redoHandler");
  exact(implementation.redoClassifier, "projectSaveAsRedoTerminalHistoryReceiptSchema", "M979.implementation.redoClassifier");
  exact(implementation.canonicalClassifierSurface, "projectSaveAsTerminalHistoryReceiptSchema", "M979.implementation.canonicalClassifierSurface");
  exact(implementation.bindingStatus, "bound-operation-specific", "M979.implementation.bindingStatus");
  exact(implementation.rereadRequirement, "matched-post-transition-exact-source-and-target-with-generation-and-hash", "M979.implementation.rereadRequirement");
  exact(implementation.sourceStatus, "undone", "M979.implementation.sourceStatus");
  exact(implementation.destinationStatus, "redone", "M979.implementation.destinationStatus");
  for (const field of ["sourceAndTargetIdentityPreserved", "targetAbsentBeforeRedo", "targetPresentAfterRedo", "sourcePreserved", "contentPreserved", "sceneCollectionPreserved", "assetCollectionPreserved", "targetCreationIntegrityPreserved", "sourceSemanticEvidencePreserved"] as const) {
    exact(implementation[field], true, `M979.implementation.${field}`);
  }
  for (const field of ["sourceInvocation", "rereadInvocation"] as const) exact(implementation[field], false, `M979.implementation.${field}`);
  const safety = record(source.safety, "M979.safety");
  exact(safety.operationAuthority, "not-granted", "M979.safety.operationAuthority");
  for (const field of ["noTransitionAuthority", "noExecutionAuthority", "noGenericExecutor", "readOnly", "nonCertifying", "noProjectMutation", "noFoundryWrite", "foreignStatePreserved", "runtimeOrFoundryAction", "providerOrCredentialActivity", "playerPasswordsGenerated", "stage12Started", "readyClaim"] as const) {
    exact(safety[field], field === "runtimeOrFoundryAction" || field === "providerOrCredentialActivity" || field === "playerPasswordsGenerated" || field === "stage12Started" || field === "readyClaim" ? false : true, `M979.safety.${field}`);
  }
  exact(safety.stage11AcceptanceStatus, "blocked", "M979.safety.stage11AcceptanceStatus");
  const boundary = record(source.aggregateBoundary, "M979.aggregateBoundary");
  exact(boundary.operationCount, 14, "M979.aggregateBoundary.operationCount");
  exact(boundary.operationCountChanged, false, "M979.aggregateBoundary.operationCountChanged");
  exact(boundary.stage11PartialClauses, 4, "M979.aggregateBoundary.stage11PartialClauses");
  exact(boundary.producerFamilies, 11, "M979.aggregateBoundary.producerFamilies");
  exact(boundary.directProjections, 16, "M979.aggregateBoundary.directProjections");
  exact(boundary.stage11MatrixRedoBindings, 8, "M979.aggregateBoundary.stage11MatrixRedoBindings");
  exact(boundary.aggregateDirectStrands, 9, "M979.aggregateBoundary.aggregateDirectStrands");
  exact(boundary.currentAuthority, "PARTIAL", "M979.aggregateBoundary.currentAuthority");
  exact(boundary.aggregateAuthority, "NOT_GRANTED", "M979.aggregateBoundary.aggregateAuthority");
  exact(boundary.runtime, "PARKED", "M979.aggregateBoundary.runtime");
}

function parseEvidence(input: unknown): ProjectStage11ProjectSaveAsRedoHandlerClassifierAggregateEvidence {
  const value = record(input, "M981 project.save-as aggregate evidence");
  exactKeys(value, [
    "aggregateAttachment", "aggregateAuthority", "assetCollectionPreserved", "bindingStatus", "canonicalClassifierSurface", "contentPreserved", "currentAuthority", "evidenceLabel", "handler", "matchedRereadRequired", "milestone", "noAuthorityGrant", "noExecutionAuthority", "noGenericExecutor", "noProjectMutation", "noTransitionAuthority", "nonCertifying", "operation", "operationCount", "operationCountChanged", "producer", "readOnly", "readyClaim", "rereadClassifier", "rereadInvocation", "schemaVersion", "sceneCollectionPreserved", "sourceAndTargetIdentityPreserved", "sourceInvocation", "sourceMilestone", "sourcePreserved", "sourceReceipt", "stage11AcceptanceStatus", "stage12Started", "targetAbsentBeforeRedo", "targetCreationIntegrityPreserved", "targetPresentAfterRedo",
  ].sort(), "M981 project.save-as aggregate evidence");
  exact(value.schemaVersion, PROJECT_STAGE11_PROJECT_SAVE_AS_REDO_HANDLER_CLASSIFIER_AGGREGATE_EVIDENCE_SCHEMA_VERSION, "M981.schemaVersion");
  exact(value.milestone, "M981", "M981.milestone");
  exact(value.sourceMilestone, "M979", "M981.sourceMilestone");
  exact(value.evidenceLabel, "local", "M981.evidenceLabel");
  exact(value.sourceReceipt, SOURCE_RECEIPT, "M981.sourceReceipt");
  exact(value.producer, "project.save-as", "M981.producer");
  exact(value.operation, "project.save-as.redo", "M981.operation");
  exact(value.handler, "bridgeProjectSaveAsRedoToTerminalHistory", "M981.handler");
  exact(value.rereadClassifier, "projectSaveAsRedoTerminalHistoryReceiptSchema", "M981.rereadClassifier");
  exact(value.canonicalClassifierSurface, "projectSaveAsTerminalHistoryReceiptSchema", "M981.canonicalClassifierSurface");
  exact(value.bindingStatus, "bound-operation-specific", "M981.bindingStatus");
  for (const field of ["matchedRereadRequired", "sourceAndTargetIdentityPreserved", "targetAbsentBeforeRedo", "targetPresentAfterRedo", "sourcePreserved", "contentPreserved", "sceneCollectionPreserved", "assetCollectionPreserved", "targetCreationIntegrityPreserved"] as const) exact(value[field], true, `M981.${field}`);
  exact(value.sourceInvocation, false, "M981.sourceInvocation");
  exact(value.rereadInvocation, false, "M981.rereadInvocation");
  exact(value.operationCount, 14, "M981.operationCount");
  exact(value.operationCountChanged, false, "M981.operationCountChanged");
  exact(value.aggregateAttachment, "one-producer-scoped-non-certifying", "M981.aggregateAttachment");
  exact(value.currentAuthority, "partial", "M981.currentAuthority");
  exact(value.aggregateAuthority, "not-granted", "M981.aggregateAuthority");
  for (const field of ["readOnly", "nonCertifying", "noAuthorityGrant", "noExecutionAuthority", "noTransitionAuthority", "noGenericExecutor", "noProjectMutation"] as const) exact(value[field], true, `M981.${field}`);
  exact(value.stage11AcceptanceStatus, "blocked", "M981.stage11AcceptanceStatus");
  exact(value.stage12Started, false, "M981.stage12Started");
  exact(value.readyClaim, false, "M981.readyClaim");
  return value as ProjectStage11ProjectSaveAsRedoHandlerClassifierAggregateEvidence;
}

export function createProjectStage11ProjectSaveAsRedoHandlerClassifierAggregateEvidence(input: unknown): ProjectStage11ProjectSaveAsRedoHandlerClassifierAggregateEvidence {
  validateSourceReceipt(input);
  return Object.freeze({
    schemaVersion: PROJECT_STAGE11_PROJECT_SAVE_AS_REDO_HANDLER_CLASSIFIER_AGGREGATE_EVIDENCE_SCHEMA_VERSION,
    milestone: "M981",
    sourceMilestone: "M979",
    evidenceLabel: "local",
    sourceReceipt: SOURCE_RECEIPT,
    producer: "project.save-as",
    operation: "project.save-as.redo",
    handler: "bridgeProjectSaveAsRedoToTerminalHistory",
    rereadClassifier: "projectSaveAsRedoTerminalHistoryReceiptSchema",
    canonicalClassifierSurface: "projectSaveAsTerminalHistoryReceiptSchema",
    bindingStatus: "bound-operation-specific",
    matchedRereadRequired: true,
    sourceAndTargetIdentityPreserved: true,
    targetAbsentBeforeRedo: true,
    targetPresentAfterRedo: true,
    sourcePreserved: true,
    contentPreserved: true,
    sceneCollectionPreserved: true,
    assetCollectionPreserved: true,
    targetCreationIntegrityPreserved: true,
    sourceInvocation: false,
    rereadInvocation: false,
    operationCount: 14,
    operationCountChanged: false,
    aggregateAttachment: "one-producer-scoped-non-certifying",
    currentAuthority: "partial",
    aggregateAuthority: "not-granted",
    readOnly: true,
    nonCertifying: true,
    noAuthorityGrant: true,
    noExecutionAuthority: true,
    noTransitionAuthority: true,
    noGenericExecutor: true,
    noProjectMutation: true,
    stage11AcceptanceStatus: "blocked",
    stage12Started: false,
    readyClaim: false,
  });
}

export const projectStage11ProjectSaveAsRedoHandlerClassifierAggregateEvidenceSchema = Object.freeze({
  parse(input: unknown): ProjectStage11ProjectSaveAsRedoHandlerClassifierAggregateEvidence {
    return parseEvidence(input);
  },
  safeParse(input: unknown):
    | Readonly<{ success: true; data: ProjectStage11ProjectSaveAsRedoHandlerClassifierAggregateEvidence }>
    | Readonly<{ success: false; error: ProjectStage11ProjectSaveAsRedoHandlerClassifierAggregateEvidenceValidationError }> {
    try {
      return { success: true, data: parseEvidence(input) };
    } catch (error) {
      const validationError = error instanceof ProjectStage11ProjectSaveAsRedoHandlerClassifierAggregateEvidenceValidationError
        ? error
        : new ProjectStage11ProjectSaveAsRedoHandlerClassifierAggregateEvidenceValidationError(error instanceof Error ? error.message : String(error));
      return { success: false, error: validationError };
    }
  },
});
