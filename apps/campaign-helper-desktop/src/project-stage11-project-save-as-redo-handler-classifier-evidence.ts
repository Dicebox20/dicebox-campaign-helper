import {
  TYPED_PROPOSAL_BATCH_ALLOWED_TRANSITIONS,
  TYPED_PROPOSAL_BATCH_UNDO_REDO_TRANSITIONS,
} from "@dicebox/core";
import { TYPED_LOCAL_PROJECT_REVIEW_APPLY_OPERATION_CONTRACTS } from "./project-review-apply-coverage";
import {
  bridgeProjectSaveAsRedoToTerminalHistory,
  projectSaveAsTerminalHistoryReceiptSchema as projectSaveAsRedoTerminalHistoryReceiptSchema,
} from "./project-save-as-terminal-history";

export const PROJECT_STAGE11_PROJECT_SAVE_AS_REDO_HANDLER_CLASSIFIER_EVIDENCE_SCHEMA_VERSION = "0.1.0" as const;

const PROJECT_SAVE_AS_COMMAND_KIND = "project.save-as" as const;
const PROJECT_SAVE_AS_OPERATION = TYPED_LOCAL_PROJECT_REVIEW_APPLY_OPERATION_CONTRACTS["project.save-as"];
const M782_SOURCE_RECEIPT = "outputs/m782-stage11-project-save-as-redo-terminal-history-closure-receipt.json" as const;
const M910_SEMANTIC_RECEIPT = "outputs/m910-stage11-project-save-as-semantic-redo-composition-closure-receipt.json" as const;

export const TYPED_PROJECT_SAVE_AS_REDO_HANDLER_CLASSIFIER_BINDING = {
  handler: bridgeProjectSaveAsRedoToTerminalHistory,
  handlerName: "bridgeProjectSaveAsRedoToTerminalHistory",
  rereadClassifier: projectSaveAsRedoTerminalHistoryReceiptSchema,
  rereadClassifierName: "projectSaveAsRedoTerminalHistoryReceiptSchema",
  status: "bound-operation-specific",
} as const;

export type ProjectSaveAsRedoHandlerClassifierEvidence = Readonly<{
  schemaVersion: typeof PROJECT_STAGE11_PROJECT_SAVE_AS_REDO_HANDLER_CLASSIFIER_EVIDENCE_SCHEMA_VERSION;
  commandKind: typeof PROJECT_SAVE_AS_COMMAND_KIND;
  operation: "dicebox.project.save-as";
  reviewAuthority: "human-review";
  targetAuthority: "local-project";
  applyAuthority: "operation-specific";
  operationAuthority: "not-granted";
  applyHandler: string;
  sourceStatus: "undone";
  transition: "redo";
  destinationStatus: "redone";
  allowedTransitionsBefore: readonly string[];
  allowedTransitionsAfter: readonly string[];
  redoHandler: "bridgeProjectSaveAsRedoToTerminalHistory";
  matchedRereadClassifier: "projectSaveAsRedoTerminalHistoryReceiptSchema";
  handlerBindingStatus: "bound-operation-specific";
  rereadStatus: "matched";
  rereadRequirement: "matched-post-transition-exact-source-and-target-with-generation-and-hash";
  exactSourceAndTargetRequired: true;
  generationAndHashRequired: true;
  targetAbsentBeforeRedoRequired: true;
  targetPresentAfterRedoRequired: true;
  sourcePreserved: true;
  contentPreserved: true;
  sceneCollectionPreserved: true;
  assetCollectionPreserved: true;
  targetCreationIntegrityPreserved: true;
  transitionInvocation: "not-invoked";
  rereadInvocation: "not-invoked";
  m782RedoBridge: "preserved-out-of-scope";
  m910SemanticEvidence: "preserved-out-of-scope";
  noTransitionAuthority: true;
  executionAuthority: "none";
  foreignStateMutation: "none";
  liveBehavior: "unproven";
  readOnly: true;
  nonCertifying: true;
  noExecutionAuthority: true;
  noGenericExecutor: true;
  stage11Ready: false;
  stage12Started: false;
  source: "project-save-as-terminal-history-and-core-undo-redo-contract";
  evidenceStatus: "bounded-project-save-as-redo-handler-classifier-binding";
  remainingGap: string;
}>;

export class ProjectSaveAsRedoHandlerClassifierEvidenceValidationError extends Error {
  readonly code = "PROJECT_SAVE_AS_REDO_HANDLER_CLASSIFIER_EVIDENCE_VALIDATION_FAILED" as const;
  readonly retryAllowed = false;

  constructor(message: string) {
    super(message);
    this.name = "ProjectSaveAsRedoHandlerClassifierEvidenceValidationError";
  }
}

function blocked(message: string): never {
  throw new ProjectSaveAsRedoHandlerClassifierEvidenceValidationError(message);
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

function validateM782BridgeReceipt(input: unknown): void {
  const source = record(input, "M782 source receipt");
  exact(source.receiptVersion, 1, "M782.receiptVersion");
  exact(source.milestone, "M782", "M782.milestone");
  exact(source.status, "PASS LOCAL CODE-ONLY; STAGE 11 NOT ACCEPTED", "M782.status");
  if (typeof source.validation !== "string" || !source.validation.includes("focused 1 file/3 tests")) blocked("M782 validation provenance is not exact.");
  if (typeof source.result !== "string" || !source.result.includes("Source-bound canonical history plus separate recreated-target reread")) blocked("M782 redo bridge provenance is not exact.");
}

function validateM910SemanticReceipt(input: unknown): void {
  const source = record(input, "M910 semantic receipt");
  exact(source.milestone, "M910", "M910.milestone");
  exact(source.status, "PASS LOCAL CODE-ONLY COMPOSITION; STAGE 11 NOT ACCEPTED", "M910.status");
  const evidence = record(source.evidence, "M910.evidence");
  exact(evidence.operation, "project.save-as.redo", "M910.evidence.operation");
  exact(evidence.strictProducerReceipt, "dicebox.project.save-as.redo", "M910.evidence.strictProducerReceipt");
  for (const field of ["sourceAndTargetIdentityPreserved", "targetAbsentBeforeRedo", "targetPresentAfterRedo", "sourcePreserved", "generationAdvanced", "contentPreserved", "sceneCollectionPreserved", "assetCollectionPreserved", "matchedReread", "targetCreationIntegrityPreserved"] as const) exact(evidence[field], true, `M910.evidence.${field}`);
  exact(evidence.backupPromotion, "NOT_APPLICABLE_ONE_WAY", "M910.evidence.backupPromotion");
  const validation = record(source.validation, "M910.validation");
  if (typeof validation.negativeCoverage !== "string" || !validation.negativeCoverage.includes("authority drift fail closed")) blocked("M910 negative-coverage provenance is not exact.");
}

function validateSources(input: unknown): void {
  const value = record(input, "M979 source bundle");
  exactKeys(value, ["bridgeReceipt", "semanticReceipt"], "M979 source bundle");
  validateM782BridgeReceipt(value.bridgeReceipt);
  validateM910SemanticReceipt(value.semanticReceipt);
}

export const TYPED_PROJECT_SAVE_AS_REDO_HANDLER_CLASSIFIER_EVIDENCE: readonly ProjectSaveAsRedoHandlerClassifierEvidence[] = Object.freeze([{
  schemaVersion: PROJECT_STAGE11_PROJECT_SAVE_AS_REDO_HANDLER_CLASSIFIER_EVIDENCE_SCHEMA_VERSION,
  commandKind: PROJECT_SAVE_AS_COMMAND_KIND,
  operation: "dicebox.project.save-as",
  reviewAuthority: PROJECT_SAVE_AS_OPERATION.reviewAuthority,
  targetAuthority: PROJECT_SAVE_AS_OPERATION.targetAuthority,
  applyAuthority: PROJECT_SAVE_AS_OPERATION.applyAuthority,
  operationAuthority: "not-granted",
  applyHandler: PROJECT_SAVE_AS_OPERATION.applyHandler,
  sourceStatus: "undone",
  transition: TYPED_PROPOSAL_BATCH_UNDO_REDO_TRANSITIONS.undone.transition,
  destinationStatus: TYPED_PROPOSAL_BATCH_UNDO_REDO_TRANSITIONS.undone.destinationStatus,
  allowedTransitionsBefore: TYPED_PROPOSAL_BATCH_ALLOWED_TRANSITIONS.undone,
  allowedTransitionsAfter: TYPED_PROPOSAL_BATCH_ALLOWED_TRANSITIONS.redone,
  redoHandler: "bridgeProjectSaveAsRedoToTerminalHistory",
  matchedRereadClassifier: "projectSaveAsRedoTerminalHistoryReceiptSchema",
  handlerBindingStatus: "bound-operation-specific",
  rereadStatus: "matched",
  rereadRequirement: "matched-post-transition-exact-source-and-target-with-generation-and-hash",
  exactSourceAndTargetRequired: true,
  generationAndHashRequired: true,
  targetAbsentBeforeRedoRequired: true,
  targetPresentAfterRedoRequired: true,
  sourcePreserved: true,
  contentPreserved: true,
  sceneCollectionPreserved: true,
  assetCollectionPreserved: true,
  targetCreationIntegrityPreserved: true,
  transitionInvocation: "not-invoked",
  rereadInvocation: "not-invoked",
  m782RedoBridge: "preserved-out-of-scope",
  m910SemanticEvidence: "preserved-out-of-scope",
  noTransitionAuthority: true,
  executionAuthority: "none",
  foreignStateMutation: "none",
  liveBehavior: "unproven",
  readOnly: true,
  nonCertifying: true,
  noExecutionAuthority: true,
  noGenericExecutor: true,
  stage11Ready: false,
  stage12Started: false,
  source: "project-save-as-terminal-history-and-core-undo-redo-contract",
  evidenceStatus: "bounded-project-save-as-redo-handler-classifier-binding",
  remainingGap: "Aggregate current authority, packaged/runtime authority, and live active-GM/Foundry behavior remain outside this operation-specific binding.",
}]);

export const TYPED_PROJECT_SAVE_AS_REDO_HANDLER_CLASSIFIER_EVIDENCE_SUMMARY = {
  schemaVersion: PROJECT_STAGE11_PROJECT_SAVE_AS_REDO_HANDLER_CLASSIFIER_EVIDENCE_SCHEMA_VERSION,
  commandKind: PROJECT_SAVE_AS_COMMAND_KIND,
  operationKindCount: 1,
  evidenceCount: TYPED_PROJECT_SAVE_AS_REDO_HANDLER_CLASSIFIER_EVIDENCE.length,
  sourceStatus: "undone" as const,
  redoHandler: "bridgeProjectSaveAsRedoToTerminalHistory" as const,
  redoRereadClassifier: "projectSaveAsRedoTerminalHistoryReceiptSchema" as const,
  rereadRequirement: "matched-post-transition-exact-source-and-target-with-generation-and-hash" as const,
  transitionInvocation: "not-invoked" as const,
  rereadInvocation: "not-invoked" as const,
  m782RedoBridge: "preserved-out-of-scope" as const,
  m910SemanticEvidence: "preserved-out-of-scope" as const,
  noTransitionAuthority: true as const,
  executionAuthority: "none" as const,
  readOnly: true as const,
  nonCertifying: true as const,
  noExecutionAuthority: true as const,
  noGenericExecutor: true as const,
  stage11Ready: false as const,
  stage12Started: false as const,
  remainingGap: "Aggregate current authority, packaged/runtime authority, and live active-GM/Foundry behavior remain outside this bounded project.save-as projection.",
};

function parseEvidence(input: unknown): ProjectSaveAsRedoHandlerClassifierEvidence {
  const value = record(input, "M979 project.save-as evidence");
  exactKeys(value, [
    "allowedTransitionsAfter", "allowedTransitionsBefore", "applyAuthority", "applyHandler", "assetCollectionPreserved", "commandKind", "contentPreserved", "destinationStatus", "evidenceStatus", "exactSourceAndTargetRequired", "executionAuthority", "foreignStateMutation", "generationAndHashRequired", "handlerBindingStatus", "liveBehavior", "m782RedoBridge", "m910SemanticEvidence", "matchedRereadClassifier", "noExecutionAuthority", "noGenericExecutor", "noTransitionAuthority", "nonCertifying", "operation", "operationAuthority", "readOnly", "rereadInvocation", "rereadRequirement", "rereadStatus", "reviewAuthority", "schemaVersion", "sceneCollectionPreserved", "source", "sourcePreserved", "sourceStatus", "stage11Ready", "stage12Started", "targetAbsentBeforeRedoRequired", "targetCreationIntegrityPreserved", "targetAuthority", "targetPresentAfterRedoRequired", "transition", "transitionInvocation", "redoHandler", "remainingGap",
  ], "M979 project.save-as evidence");
  exact(value.schemaVersion, PROJECT_STAGE11_PROJECT_SAVE_AS_REDO_HANDLER_CLASSIFIER_EVIDENCE_SCHEMA_VERSION, "M979.schemaVersion");
  exact(value.commandKind, PROJECT_SAVE_AS_COMMAND_KIND, "M979.commandKind");
  exact(value.operation, "dicebox.project.save-as", "M979.operation");
  exact(value.reviewAuthority, "human-review", "M979.reviewAuthority");
  exact(value.targetAuthority, "local-project", "M979.targetAuthority");
  exact(value.applyAuthority, "operation-specific", "M979.applyAuthority");
  exact(value.operationAuthority, "not-granted", "M979.operationAuthority");
  exact(value.sourceStatus, "undone", "M979.sourceStatus");
  exact(value.transition, "redo", "M979.transition");
  exact(value.destinationStatus, "redone", "M979.destinationStatus");
  exact(value.redoHandler, "bridgeProjectSaveAsRedoToTerminalHistory", "M979.redoHandler");
  exact(value.matchedRereadClassifier, "projectSaveAsRedoTerminalHistoryReceiptSchema", "M979.matchedRereadClassifier");
  exact(value.handlerBindingStatus, "bound-operation-specific", "M979.handlerBindingStatus");
  exact(value.rereadStatus, "matched", "M979.rereadStatus");
  exact(value.rereadRequirement, "matched-post-transition-exact-source-and-target-with-generation-and-hash", "M979.rereadRequirement");
  for (const field of ["exactSourceAndTargetRequired", "generationAndHashRequired", "targetAbsentBeforeRedoRequired", "targetPresentAfterRedoRequired", "sourcePreserved", "contentPreserved", "sceneCollectionPreserved", "assetCollectionPreserved", "targetCreationIntegrityPreserved", "noTransitionAuthority", "readOnly", "nonCertifying", "noExecutionAuthority", "noGenericExecutor", "stage11Ready", "stage12Started"] as const) exact(value[field], field === "stage11Ready" || field === "stage12Started" ? false : true, `M979.${field}`);
  exact(value.transitionInvocation, "not-invoked", "M979.transitionInvocation");
  exact(value.rereadInvocation, "not-invoked", "M979.rereadInvocation");
  exact(value.m782RedoBridge, "preserved-out-of-scope", "M979.m782RedoBridge");
  exact(value.m910SemanticEvidence, "preserved-out-of-scope", "M979.m910SemanticEvidence");
  exact(value.evidenceStatus, "bounded-project-save-as-redo-handler-classifier-binding", "M979.evidenceStatus");
  return value as ProjectSaveAsRedoHandlerClassifierEvidence;
}

export function createProjectSaveAsRedoHandlerClassifierEvidence(input: unknown): readonly ProjectSaveAsRedoHandlerClassifierEvidence[] {
  validateSources(input);
  return Object.freeze(TYPED_PROJECT_SAVE_AS_REDO_HANDLER_CLASSIFIER_EVIDENCE.map((entry) => Object.freeze({ ...entry })));
}

export const projectSaveAsRedoHandlerClassifierEvidenceSchema = Object.freeze({
  parse(input: unknown): readonly ProjectSaveAsRedoHandlerClassifierEvidence[] {
    const value = input as unknown[];
    if (!Array.isArray(value) || value.length !== 1) blocked("M979 evidence must contain exactly one redo projection.");
    return Object.freeze(value.map(parseEvidence));
  },
  safeParse(input: unknown):
    | Readonly<{ success: true; data: readonly ProjectSaveAsRedoHandlerClassifierEvidence[] }>
    | Readonly<{ success: false; error: ProjectSaveAsRedoHandlerClassifierEvidenceValidationError }> {
    try {
      return { success: true, data: this.parse(input) };
    } catch (error) {
      const validationError = error instanceof ProjectSaveAsRedoHandlerClassifierEvidenceValidationError
        ? error
        : new ProjectSaveAsRedoHandlerClassifierEvidenceValidationError(error instanceof Error ? error.message : String(error));
      return { success: false, error: validationError };
    }
  },
});

export const M979_PROJECT_SAVE_AS_REDO_HANDLER_CLASSIFIER_SOURCE_RECEIPTS = Object.freeze({
  bridge: M782_SOURCE_RECEIPT,
  semantic: M910_SEMANTIC_RECEIPT,
});
