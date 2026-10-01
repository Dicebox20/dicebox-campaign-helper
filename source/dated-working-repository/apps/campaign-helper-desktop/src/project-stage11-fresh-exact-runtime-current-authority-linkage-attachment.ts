import {
  projectStage11CurrentAuthorityLinkageEvidenceSchema,
  type ProjectStage11CurrentAuthorityLinkageEvidence,
} from "./project-stage11-current-authority-linkage-evidence";
import {
  projectStage11FreshExactRuntimeEvidenceAttachmentSchema,
  type ProjectStage11FreshExactRuntimeEvidenceAttachment,
} from "./project-stage11-fresh-exact-runtime-evidence-attachment";

export const PROJECT_STAGE11_FRESH_EXACT_RUNTIME_CURRENT_AUTHORITY_LINKAGE_ATTACHMENT_SCHEMA_VERSION = "0.1.0" as const;

const CURRENT_AUTHORITY_LINKAGE_SOURCE = "apps/campaign-helper-desktop/src/project-stage11-current-authority-linkage-evidence.ts" as const;
const AGGREGATE_LEDGER_SOURCE = "apps/campaign-helper-desktop/src/project-stage11-aggregate-evidence-ledger.ts" as const;

export type ProjectStage11FreshExactRuntimeCurrentAuthorityLinkageAttachment = Readonly<{
  schemaVersion: typeof PROJECT_STAGE11_FRESH_EXACT_RUNTIME_CURRENT_AUTHORITY_LINKAGE_ATTACHMENT_SCHEMA_VERSION;
  milestone: "M1022";
  sourceMilestone: "M1020";
  evidenceLabel: "local";
  currentAuthorityLinkageSource: typeof CURRENT_AUTHORITY_LINKAGE_SOURCE;
  aggregateLedgerSource: typeof AGGREGATE_LEDGER_SOURCE;
  currentAuthorityLinkageStatus: "bound-strict-typed-non-certifying";
  freshRuntimeAttachmentStatus: "bound-to-current-authority-index-non-certifying";
  currentAuthorityStatus: "partial";
  aggregateAuthority: "not-granted";
  currentAuthorityRedoBindingCount: 9;
  stage11MatrixRedoBindingCount: 8;
  aggregateDirectStrandCount: 9;
  modeledOperationCount: 14;
  directProjectionCount: 16;
  countScopeStatus: "preserved-explicit-8-9-9";
  indexEntry: Readonly<{
    sourceMilestone: "M1018";
    aggregateMilestone: "M1020";
    operation: "dicebox.foundry.fresh-exact-runtime-current-authority";
    receipt: "outputs/m1018-stage11-host-window-recovery-and-final-exact-runtime-reread-receipt.json";
    receiptSha256: "C64E7137308D211BAE4B7C0DD72E239C317C06EE26CE17690205934FA88B4D7C";
    target: "dbx-test-world / Foundry 14.367 / dnd5e 5.3.3 / DiceBox 0.1.15 / port 30001";
    browser: "Chrome external browser";
    viewport: "1920x863";
    currentUser: "Gamemaster [GM]";
    activeScene: "DiceBox Tram Routing Projection";
    nonCertifying: true;
    noAuthorityGrant: true;
  }>;
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

export class ProjectStage11FreshExactRuntimeCurrentAuthorityLinkageAttachmentValidationError extends Error {
  readonly code = "STAGE11_FRESH_EXACT_RUNTIME_CURRENT_AUTHORITY_LINKAGE_ATTACHMENT_VALIDATION_FAILED" as const;
  readonly retryAllowed = false;

  constructor(message: string) {
    super(message);
    this.name = "ProjectStage11FreshExactRuntimeCurrentAuthorityLinkageAttachmentValidationError";
  }
}

function blocked(message: string): never {
  throw new ProjectStage11FreshExactRuntimeCurrentAuthorityLinkageAttachmentValidationError(message);
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

function validateLinkage(input: unknown): ProjectStage11CurrentAuthorityLinkageEvidence {
  const result = projectStage11CurrentAuthorityLinkageEvidenceSchema.safeParse(input);
  if (!result.success) blocked(`M1010 current-authority linkage is invalid: ${result.error.message}`);
  exact(result.data.handlerClassifierAggregateAttachmentCount, 10, "M1010 handlerClassifierAggregateAttachmentCount");
  exact(result.data.semanticAggregateAttachmentCount, 9, "M1010 semanticAggregateAttachmentCount");
  exact(result.data.currentAuthorityRedoBindingCount, 9, "M1010 currentAuthorityRedoBindingCount");
  exact(result.data.stage11MatrixRedoBindingCount, 8, "M1010 stage11MatrixRedoBindingCount");
  exact(result.data.aggregateDirectStrandCount, 9, "M1010 aggregateDirectStrandCount");
  exact(result.data.modeledOperationCount, 14, "M1010 modeledOperationCount");
  exact(result.data.directProjectionCount, 16, "M1010 directProjectionCount");
  exact(result.data.countScopeStatus, "preserved-explicit-8-9-9", "M1010 countScopeStatus");
  return result.data;
}

function validateAttachment(input: unknown): ProjectStage11FreshExactRuntimeEvidenceAttachment {
  const result = projectStage11FreshExactRuntimeEvidenceAttachmentSchema.safeParse(input);
  if (!result.success) blocked(`M1020 fresh exact-runtime attachment is invalid: ${result.error.message}`);
  return result.data;
}

function parseAttachment(input: unknown): ProjectStage11FreshExactRuntimeCurrentAuthorityLinkageAttachment {
  const value = record(input, "M1022 fresh exact-runtime current-authority linkage attachment");
  exactKeys(value, [
    "schemaVersion", "milestone", "sourceMilestone", "evidenceLabel", "currentAuthorityLinkageSource", "aggregateLedgerSource", "currentAuthorityLinkageStatus", "freshRuntimeAttachmentStatus", "currentAuthorityStatus", "aggregateAuthority", "currentAuthorityRedoBindingCount", "stage11MatrixRedoBindingCount", "aggregateDirectStrandCount", "modeledOperationCount", "directProjectionCount", "countScopeStatus", "indexEntry", "crossProducerContinuity", "readOnly", "nonCertifying", "noAuthorityGrant", "noExecutionAuthority", "noTransitionAuthority", "noRecoveryAuthority", "noGenericExecutor", "noFoundryWrite", "noProjectMutation", "stage11AcceptanceStatus", "stage12Started", "readyClaim",
  ], "M1022 attachment");
  exact(value.schemaVersion, "0.1.0", "M1022.schemaVersion");
  exact(value.milestone, "M1022", "M1022.milestone");
  exact(value.sourceMilestone, "M1020", "M1022.sourceMilestone");
  exact(value.evidenceLabel, "local", "M1022.evidenceLabel");
  exact(value.currentAuthorityLinkageSource, CURRENT_AUTHORITY_LINKAGE_SOURCE, "M1022.currentAuthorityLinkageSource");
  exact(value.aggregateLedgerSource, AGGREGATE_LEDGER_SOURCE, "M1022.aggregateLedgerSource");
  exact(value.currentAuthorityLinkageStatus, "bound-strict-typed-non-certifying", "M1022.currentAuthorityLinkageStatus");
  exact(value.freshRuntimeAttachmentStatus, "bound-to-current-authority-index-non-certifying", "M1022.freshRuntimeAttachmentStatus");
  exact(value.currentAuthorityStatus, "partial", "M1022.currentAuthorityStatus");
  exact(value.aggregateAuthority, "not-granted", "M1022.aggregateAuthority");
  exact(value.currentAuthorityRedoBindingCount, 9, "M1022.currentAuthorityRedoBindingCount");
  exact(value.stage11MatrixRedoBindingCount, 8, "M1022.stage11MatrixRedoBindingCount");
  exact(value.aggregateDirectStrandCount, 9, "M1022.aggregateDirectStrandCount");
  exact(value.modeledOperationCount, 14, "M1022.modeledOperationCount");
  exact(value.directProjectionCount, 16, "M1022.directProjectionCount");
  exact(value.countScopeStatus, "preserved-explicit-8-9-9", "M1022.countScopeStatus");
  exact(value.crossProducerContinuity, "unproven", "M1022.crossProducerContinuity");
  for (const field of ["readOnly", "nonCertifying", "noAuthorityGrant", "noExecutionAuthority", "noTransitionAuthority", "noRecoveryAuthority", "noGenericExecutor", "noFoundryWrite", "noProjectMutation"] as const) exact(value[field], true, `M1022.${field}`);
  exact(value.stage11AcceptanceStatus, "blocked", "M1022.stage11AcceptanceStatus");
  exact(value.stage12Started, false, "M1022.stage12Started");
  exact(value.readyClaim, false, "M1022.readyClaim");
  const indexEntry = record(value.indexEntry, "M1022.indexEntry");
  exactKeys(indexEntry, ["sourceMilestone", "aggregateMilestone", "operation", "receipt", "receiptSha256", "target", "browser", "viewport", "currentUser", "activeScene", "nonCertifying", "noAuthorityGrant"], "M1022.indexEntry");
  exact(indexEntry.sourceMilestone, "M1018", "M1022.indexEntry.sourceMilestone");
  exact(indexEntry.aggregateMilestone, "M1020", "M1022.indexEntry.aggregateMilestone");
  exact(indexEntry.operation, "dicebox.foundry.fresh-exact-runtime-current-authority", "M1022.indexEntry.operation");
  exact(indexEntry.receipt, "outputs/m1018-stage11-host-window-recovery-and-final-exact-runtime-reread-receipt.json", "M1022.indexEntry.receipt");
  exact(indexEntry.receiptSha256, "C64E7137308D211BAE4B7C0DD72E239C317C06EE26CE17690205934FA88B4D7C", "M1022.indexEntry.receiptSha256");
  exact(indexEntry.target, "dbx-test-world / Foundry 14.367 / dnd5e 5.3.3 / DiceBox 0.1.15 / port 30001", "M1022.indexEntry.target");
  exact(indexEntry.browser, "Chrome external browser", "M1022.indexEntry.browser");
  exact(indexEntry.viewport, "1920x863", "M1022.indexEntry.viewport");
  exact(indexEntry.currentUser, "Gamemaster [GM]", "M1022.indexEntry.currentUser");
  exact(indexEntry.activeScene, "DiceBox Tram Routing Projection", "M1022.indexEntry.activeScene");
  exact(indexEntry.nonCertifying, true, "M1022.indexEntry.nonCertifying");
  exact(indexEntry.noAuthorityGrant, true, "M1022.indexEntry.noAuthorityGrant");
  return value as ProjectStage11FreshExactRuntimeCurrentAuthorityLinkageAttachment;
}

export function createProjectStage11FreshExactRuntimeCurrentAuthorityLinkageAttachment(input: unknown): ProjectStage11FreshExactRuntimeCurrentAuthorityLinkageAttachment {
  const bundle = record(input, "M1022 source bundle");
  exactKeys(bundle, ["currentAuthorityLinkage", "freshExactRuntimeAttachment"], "M1022 source bundle");
  const linkage = validateLinkage(bundle.currentAuthorityLinkage);
  const freshRuntime = validateAttachment(bundle.freshExactRuntimeAttachment);
  exact(linkage.aggregateAuthority, "not-granted", "M1022 source linkage.aggregateAuthority");
  exact(freshRuntime.aggregateAuthority, "not-granted", "M1022 source freshRuntime.aggregateAuthority");
  exact(freshRuntime.currentAuthority, "partial", "M1022 source freshRuntime.currentAuthority");
  return Object.freeze({
    schemaVersion: PROJECT_STAGE11_FRESH_EXACT_RUNTIME_CURRENT_AUTHORITY_LINKAGE_ATTACHMENT_SCHEMA_VERSION,
    milestone: "M1022",
    sourceMilestone: "M1020",
    evidenceLabel: "local",
    currentAuthorityLinkageSource: CURRENT_AUTHORITY_LINKAGE_SOURCE,
    aggregateLedgerSource: AGGREGATE_LEDGER_SOURCE,
    currentAuthorityLinkageStatus: "bound-strict-typed-non-certifying",
    freshRuntimeAttachmentStatus: "bound-to-current-authority-index-non-certifying",
    currentAuthorityStatus: "partial",
    aggregateAuthority: "not-granted",
    currentAuthorityRedoBindingCount: linkage.currentAuthorityRedoBindingCount,
    stage11MatrixRedoBindingCount: linkage.stage11MatrixRedoBindingCount,
    aggregateDirectStrandCount: linkage.aggregateDirectStrandCount,
    modeledOperationCount: linkage.modeledOperationCount,
    directProjectionCount: linkage.directProjectionCount,
    countScopeStatus: "preserved-explicit-8-9-9",
    indexEntry: Object.freeze({
      sourceMilestone: "M1018",
      aggregateMilestone: "M1020",
      operation: freshRuntime.operation,
      receipt: freshRuntime.receipt,
      receiptSha256: freshRuntime.receiptSha256,
      target: "dbx-test-world / Foundry 14.367 / dnd5e 5.3.3 / DiceBox 0.1.15 / port 30001",
      browser: freshRuntime.browser,
      viewport: `${freshRuntime.viewport.width}x${freshRuntime.viewport.height}`,
      currentUser: "Gamemaster [GM]",
      activeScene: freshRuntime.activeScene,
      nonCertifying: true,
      noAuthorityGrant: true,
    }),
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

export const projectStage11FreshExactRuntimeCurrentAuthorityLinkageAttachmentSchema = Object.freeze({
  parse(input: unknown): ProjectStage11FreshExactRuntimeCurrentAuthorityLinkageAttachment {
    return parseAttachment(input);
  },
  safeParse(input: unknown):
    | Readonly<{ success: true; data: ProjectStage11FreshExactRuntimeCurrentAuthorityLinkageAttachment }>
    | Readonly<{ success: false; error: ProjectStage11FreshExactRuntimeCurrentAuthorityLinkageAttachmentValidationError }> {
    try {
      return { success: true, data: parseAttachment(input) };
    } catch (error) {
      const validationError = error instanceof ProjectStage11FreshExactRuntimeCurrentAuthorityLinkageAttachmentValidationError
        ? error
        : new ProjectStage11FreshExactRuntimeCurrentAuthorityLinkageAttachmentValidationError(error instanceof Error ? error.message : String(error));
      return { success: false, error: validationError };
    }
  },
});
