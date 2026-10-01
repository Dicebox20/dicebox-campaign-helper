import {
  projectAggregateCurrentAuthorityEvidenceSchema,
  type ProjectAggregateCurrentAuthorityEvidenceReceipt,
} from "./project-aggregate-current-authority-evidence";

export const PROJECT_STAGE11_CURRENT_AUTHORITY_LINKAGE_EVIDENCE_SCHEMA_VERSION = "0.1.0" as const;

const AGGREGATE_LEDGER_SOURCE = "apps/campaign-helper-desktop/src/project-stage11-aggregate-evidence-ledger.ts" as const;
const CURRENT_AUTHORITY_SOURCE = "apps/campaign-helper-desktop/src/project-aggregate-current-authority-evidence.ts" as const;

const HANDLER_CLASSIFIER_FIELDS = [
  "projectSaveRedoHandlerClassifierAggregateEvidence",
  "projectPersistentAddSceneRedoHandlerClassifierAggregateEvidence",
  "projectRenameRedoHandlerClassifierAggregateEvidence",
  "projectSaveAsRedoHandlerClassifierAggregateEvidence",
  "projectCreateRedoHandlerClassifierAggregateEvidence",
  "projectHandoutAssetRedoHandlerClassifierAggregateEvidence",
  "projectAudioAssetRedoHandlerClassifierAggregateEvidence",
  "projectTokenAssetRedoHandlerClassifierAggregateEvidence",
  "projectAssetBindRedoHandlerClassifierAggregateEvidence",
  "projectInMemoryAddSceneRedoHandlerClassifierAggregateEvidence",
] as const;

const SEMANTIC_FIELDS = [
  "persistentAddSceneSemanticRedoEvidence",
  "audioAssetSemanticRedoEvidence",
  "handoutAssetSemanticRedoEvidence",
  "tokenAssetSemanticRedoEvidence",
  "assetBindSemanticRedoEvidence",
  "saveAsSemanticRedoEvidence",
  "renameSemanticRedoEvidence",
  "createSemanticRedoEvidence",
  "inMemoryAddSceneSemanticRedoEvidence",
] as const;

const CURRENT_AUTHORITY_REDO_BINDINGS = [
  "project.create",
  "project.save",
  "project.rename",
  "project.add-scene.persist",
  "project.asset.bind",
  "project.asset.register-audio",
  "project.asset.register-handout",
  "project.asset.register-token",
  "project.add-scene.commit-in-memory",
] as const;

export type ProjectStage11CurrentAuthorityLinkageEvidence = Readonly<{
  schemaVersion: typeof PROJECT_STAGE11_CURRENT_AUTHORITY_LINKAGE_EVIDENCE_SCHEMA_VERSION;
  milestone: "M1010";
  evidenceLabel: "local";
  aggregateLedgerSource: typeof AGGREGATE_LEDGER_SOURCE;
  currentAuthoritySource: typeof CURRENT_AUTHORITY_SOURCE;
  aggregateLedgerStatus: "aggregate-stage11-partial";
  currentAuthorityStatus: "partial";
  aggregateAuthority: "not-granted";
  handlerClassifierAggregateAttachmentCount: 10;
  semanticAggregateAttachmentCount: 9;
  currentAuthorityRedoBindingCount: 9;
  currentAuthorityRedoBindingEntries: readonly string[];
  stage11MatrixRedoBindingCount: 8;
  aggregateDirectStrandCount: 9;
  modeledOperationCount: 14;
  directProjectionCount: 16;
  linkageStatus: "bound-strict-typed-non-certifying";
  countScopeStatus: "preserved-explicit-8-9-9";
  crossProducerContinuity: "unproven";
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

export class ProjectStage11CurrentAuthorityLinkageEvidenceValidationError extends Error {
  readonly code = "STAGE11_CURRENT_AUTHORITY_LINKAGE_EVIDENCE_VALIDATION_FAILED" as const;
  readonly retryAllowed = false;

  constructor(message: string) {
    super(message);
    this.name = "ProjectStage11CurrentAuthorityLinkageEvidenceValidationError";
  }
}

function blocked(message: string): never {
  throw new ProjectStage11CurrentAuthorityLinkageEvidenceValidationError(message);
}

function record(value: unknown, label: string): Record<string, unknown> {
  if (value === null || typeof value !== "object" || Array.isArray(value)) blocked(`${label} must be an object.`);
  return value as Record<string, unknown>;
}

function exact(value: unknown, expected: string | number | boolean, label: string): void {
  if (value !== expected) blocked(`${label} must be ${String(expected)}.`);
}

function exactStrings(value: unknown, expected: readonly string[], label: string): readonly string[] {
  if (!Array.isArray(value) || value.length !== expected.length || value.some((entry, index) => entry !== expected[index])) blocked(`${label} must match the exact approved ordered list.`);
  return value as readonly string[];
}

function validateAggregateLedger(input: unknown): void {
  const aggregate = record(input, "aggregate ledger");
  exact(aggregate.schemaVersion, "0.1.0", "aggregate ledger.schemaVersion");
  exact(aggregate.status, "PASS", "aggregate ledger.status");
  exact(aggregate.disposition, "aggregate-stage11-partial", "aggregate ledger.disposition");
  exact(aggregate.operationCount, 14, "aggregate ledger.operationCount");
  exact(aggregate.readOnly, true, "aggregate ledger.readOnly");
  exact(aggregate.nonCertifying, true, "aggregate ledger.nonCertifying");
  exact(aggregate.noPermissionAuthority, true, "aggregate ledger.noPermissionAuthority");
  exact(aggregate.noExecutionAuthority, true, "aggregate ledger.noExecutionAuthority");
  exact(aggregate.noTransitionAuthority, true, "aggregate ledger.noTransitionAuthority");
  exact(aggregate.noRecoveryAuthority, true, "aggregate ledger.noRecoveryAuthority");
  exact(aggregate.noFoundryWrite, true, "aggregate ledger.noFoundryWrite");
  exact(aggregate.noProjectMutation, true, "aggregate ledger.noProjectMutation");
  exact(aggregate.readyClaim, false, "aggregate ledger.readyClaim");
  exact(aggregate.stage11AcceptanceStatus, "blocked", "aggregate ledger.stage11AcceptanceStatus");
  exact(aggregate.stage12Started, false, "aggregate ledger.stage12Started");

  const aggregateCurrentAuthority = record(aggregate.currentAuthority, "aggregate ledger.currentAuthority");
  const aggregateAuthority = record(aggregateCurrentAuthority.authority, "aggregate ledger.currentAuthority.authority");
  exact(aggregateAuthority.aggregate, "not-granted", "aggregate ledger.currentAuthority.authority.aggregate");
  const lifecycle = record(aggregate.lifecycleContinuity, "aggregate ledger.lifecycleContinuity");
  exact(lifecycle.stage11AcceptanceStatus, "blocked", "aggregate ledger.lifecycleContinuity.stage11AcceptanceStatus");

  for (const field of HANDLER_CLASSIFIER_FIELDS) {
    const evidence = record(aggregate[field], `aggregate ledger.${field}`);
    exact(evidence.aggregateAttachment, "one-producer-scoped-non-certifying", `aggregate ledger.${field}.aggregateAttachment`);
    exact(evidence.operationCount, 14, `aggregate ledger.${field}.operationCount`);
    exact(evidence.operationCountChanged, false, `aggregate ledger.${field}.operationCountChanged`);
    exact(evidence.aggregateAuthority, "not-granted", `aggregate ledger.${field}.aggregateAuthority`);
    exact(evidence.stage11AcceptanceStatus, "blocked", `aggregate ledger.${field}.stage11AcceptanceStatus`);
    exact(evidence.stage12Started, false, `aggregate ledger.${field}.stage12Started`);
    exact(evidence.readyClaim, false, `aggregate ledger.${field}.readyClaim`);
  }

  for (const field of SEMANTIC_FIELDS) {
    const evidence = record(aggregate[field], `aggregate ledger.${field}`);
    exact(evidence.aggregateAttachment, "one-producer-scoped-non-certifying", `aggregate ledger.${field}.aggregateAttachment`);
    exact(evidence.countsChanged, false, `aggregate ledger.${field}.countsChanged`);
    exact(evidence.aggregateAuthority, "not-granted", `aggregate ledger.${field}.aggregateAuthority`);
    exact(evidence.stage11AcceptanceStatus, "blocked", `aggregate ledger.${field}.stage11AcceptanceStatus`);
    exact(evidence.stage12Started, false, `aggregate ledger.${field}.stage12Started`);
    exact(evidence.readyClaim, false, `aggregate ledger.${field}.readyClaim`);
  }
}

function validateCurrentAuthority(input: unknown): ProjectAggregateCurrentAuthorityEvidenceReceipt {
  const result = projectAggregateCurrentAuthorityEvidenceSchema.safeParse(input);
  if (!result.success) blocked(`current authority evidence is invalid: ${result.error.message}`);
  const receipt = result.data;
  exact(receipt.currentAuthorityStatus, "partial", "current authority.currentAuthorityStatus");
  exact(receipt.stage11AcceptanceStatus, "blocked", "current authority.stage11AcceptanceStatus");
  exact(receipt.stage12Started, false, "current authority.stage12Started");
  exact(receipt.typedOperationKindCount, 14, "current authority.typedOperationKindCount");
  exact(receipt.indexedOperationCount, 14, "current authority.indexedOperationCount");
  exact(receipt.directProjectionCount, 16, "current authority.directProjectionCount");
  exact(receipt.redoBindingCount, 9, "current authority.redoBindingCount");
  exact(receipt.authority.aggregate, "not-granted", "current authority.authority.aggregate");
  return receipt;
}

function parseEvidence(input: unknown): ProjectStage11CurrentAuthorityLinkageEvidence {
  const value = record(input, "M1010 current-authority linkage evidence");
  const expectedKeys = [
    "aggregateAuthority", "aggregateDirectStrandCount", "aggregateLedgerSource", "aggregateLedgerStatus", "countScopeStatus", "crossProducerContinuity", "currentAuthorityRedoBindingCount", "currentAuthorityRedoBindingEntries", "currentAuthoritySource", "currentAuthorityStatus", "directProjectionCount", "evidenceLabel", "handlerClassifierAggregateAttachmentCount", "linkageStatus", "modeledOperationCount", "milestone", "noAuthorityGrant", "noExecutionAuthority", "noFoundryWrite", "noGenericExecutor", "noProjectMutation", "noRecoveryAuthority", "noTransitionAuthority", "nonCertifying", "readOnly", "readyClaim", "schemaVersion", "semanticAggregateAttachmentCount", "stage11AcceptanceStatus", "stage11MatrixRedoBindingCount", "stage12Started",
  ].sort();
  const actualKeys = Object.keys(value).sort();
  if (actualKeys.length !== expectedKeys.length || actualKeys.some((key, index) => key !== expectedKeys[index])) blocked("M1010 current-authority linkage evidence contains unknown or missing fields.");
  exact(value.schemaVersion, PROJECT_STAGE11_CURRENT_AUTHORITY_LINKAGE_EVIDENCE_SCHEMA_VERSION, "M1010.schemaVersion");
  exact(value.milestone, "M1010", "M1010.milestone");
  exact(value.evidenceLabel, "local", "M1010.evidenceLabel");
  exact(value.aggregateLedgerSource, AGGREGATE_LEDGER_SOURCE, "M1010.aggregateLedgerSource");
  exact(value.currentAuthoritySource, CURRENT_AUTHORITY_SOURCE, "M1010.currentAuthoritySource");
  exact(value.aggregateLedgerStatus, "aggregate-stage11-partial", "M1010.aggregateLedgerStatus");
  exact(value.currentAuthorityStatus, "partial", "M1010.currentAuthorityStatus");
  exact(value.aggregateAuthority, "not-granted", "M1010.aggregateAuthority");
  exact(value.handlerClassifierAggregateAttachmentCount, 10, "M1010.handlerClassifierAggregateAttachmentCount");
  exact(value.semanticAggregateAttachmentCount, 9, "M1010.semanticAggregateAttachmentCount");
  exact(value.currentAuthorityRedoBindingCount, 9, "M1010.currentAuthorityRedoBindingCount");
  exactStrings(value.currentAuthorityRedoBindingEntries, CURRENT_AUTHORITY_REDO_BINDINGS, "M1010.currentAuthorityRedoBindingEntries");
  exact(value.stage11MatrixRedoBindingCount, 8, "M1010.stage11MatrixRedoBindingCount");
  exact(value.aggregateDirectStrandCount, 9, "M1010.aggregateDirectStrandCount");
  exact(value.modeledOperationCount, 14, "M1010.modeledOperationCount");
  exact(value.directProjectionCount, 16, "M1010.directProjectionCount");
  exact(value.linkageStatus, "bound-strict-typed-non-certifying", "M1010.linkageStatus");
  exact(value.countScopeStatus, "preserved-explicit-8-9-9", "M1010.countScopeStatus");
  exact(value.crossProducerContinuity, "unproven", "M1010.crossProducerContinuity");
  for (const field of ["readOnly", "nonCertifying", "noAuthorityGrant", "noExecutionAuthority", "noTransitionAuthority", "noRecoveryAuthority", "noGenericExecutor", "noFoundryWrite", "noProjectMutation"] as const) exact(value[field], true, `M1010.${field}`);
  exact(value.stage11AcceptanceStatus, "blocked", "M1010.stage11AcceptanceStatus");
  exact(value.stage12Started, false, "M1010.stage12Started");
  exact(value.readyClaim, false, "M1010.readyClaim");
  return value as ProjectStage11CurrentAuthorityLinkageEvidence;
}

export function createProjectStage11CurrentAuthorityLinkageEvidence(input: unknown): ProjectStage11CurrentAuthorityLinkageEvidence {
  const value = record(input, "M1010 source bundle");
  const keys = Object.keys(value).sort();
  if (keys.join(",") !== "aggregateLedger,currentAuthority") blocked("M1010 source bundle contains unknown or missing fields.");
  validateAggregateLedger(value.aggregateLedger);
  const currentAuthority = validateCurrentAuthority(value.currentAuthority);
  return Object.freeze({
    schemaVersion: PROJECT_STAGE11_CURRENT_AUTHORITY_LINKAGE_EVIDENCE_SCHEMA_VERSION,
    milestone: "M1010",
    evidenceLabel: "local",
    aggregateLedgerSource: AGGREGATE_LEDGER_SOURCE,
    currentAuthoritySource: CURRENT_AUTHORITY_SOURCE,
    aggregateLedgerStatus: "aggregate-stage11-partial",
    currentAuthorityStatus: currentAuthority.currentAuthorityStatus,
    aggregateAuthority: currentAuthority.authority.aggregate,
    handlerClassifierAggregateAttachmentCount: 10,
    semanticAggregateAttachmentCount: 9,
    currentAuthorityRedoBindingCount: 9,
    currentAuthorityRedoBindingEntries: currentAuthority.redoBindings.map(({ commandKind }) => commandKind),
    stage11MatrixRedoBindingCount: 8,
    aggregateDirectStrandCount: 9,
    modeledOperationCount: 14,
    directProjectionCount: 16,
    linkageStatus: "bound-strict-typed-non-certifying",
    countScopeStatus: "preserved-explicit-8-9-9",
    crossProducerContinuity: "unproven",
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

export const projectStage11CurrentAuthorityLinkageEvidenceSchema = Object.freeze({
  parse(input: unknown): ProjectStage11CurrentAuthorityLinkageEvidence {
    return parseEvidence(input);
  },
  safeParse(input: unknown):
    | Readonly<{ success: true; data: ProjectStage11CurrentAuthorityLinkageEvidence }>
    | Readonly<{ success: false; error: ProjectStage11CurrentAuthorityLinkageEvidenceValidationError }> {
    try {
      return { success: true, data: parseEvidence(input) };
    } catch (error) {
      const validationError = error instanceof ProjectStage11CurrentAuthorityLinkageEvidenceValidationError
        ? error
        : new ProjectStage11CurrentAuthorityLinkageEvidenceValidationError(error instanceof Error ? error.message : String(error));
      return { success: false, error: validationError };
    }
  },
});
