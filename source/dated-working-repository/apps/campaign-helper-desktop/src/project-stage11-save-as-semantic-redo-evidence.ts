import {
  bridgeProjectSaveAsRedoToTerminalHistory,
  type ProjectSaveAsRedoTerminalHistoryReceipt,
} from "./project-save-as-terminal-history";

export const PROJECT_STAGE11_SAVE_AS_SEMANTIC_REDO_EVIDENCE_SCHEMA_VERSION = "0.1.0" as const;

const M910_RECEIPT = "outputs/m910-stage11-project-save-as-semantic-redo-composition-closure-receipt.json" as const;

export type ProjectStage11SaveAsSemanticRedoEvidence = Readonly<{
  schemaVersion: typeof PROJECT_STAGE11_SAVE_AS_SEMANTIC_REDO_EVIDENCE_SCHEMA_VERSION;
  milestone: "M910";
  evidenceLabel: "local";
  receipt: typeof M910_RECEIPT;
  status: "bounded-local";
  operation: "project.save-as.redo";
  semantic: "redo-post-state";
  sourceAndTargetIdentityPreserved: true;
  targetAbsentBeforeRedo: true;
  targetPresentAfterRedo: true;
  sourcePreserved: true;
  generationAdvanced: true;
  contentPreserved: true;
  sceneCollectionPreserved: true;
  assetCollectionPreserved: true;
  matchedReread: true;
  targetCreationIntegrityPreserved: true;
  driftRejected: "source/target/absence-presence/content/Scene/assets/reread/authority drift";
  sourceReceipt: ProjectSaveAsRedoTerminalHistoryReceipt;
  readOnly: true;
  nonCertifying: true;
  noExecutionAuthority: true;
  noTransitionAuthority: true;
  noGenericExecutor: true;
  noFoundryWrite: true;
  noProjectMutation: true;
  readyClaim: false;
  stage11AcceptanceStatus: "blocked";
  stage12Started: false;
}>;

export class ProjectStage11SaveAsSemanticRedoEvidenceValidationError extends Error {
  readonly code = "STAGE11_SAVE_AS_SEMANTIC_REDO_EVIDENCE_VALIDATION_FAILED" as const;
  readonly retryAllowed = false;

  constructor(message: string) {
    super(message);
    this.name = "ProjectStage11SaveAsSemanticRedoEvidenceValidationError";
  }
}

function blocked(message: string): never {
  throw new ProjectStage11SaveAsSemanticRedoEvidenceValidationError(message);
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

type ProjectSaveAsProjectRead = ProjectSaveAsRedoTerminalHistoryReceipt["authoritativeRereads"]["beforeRedo"]["source"];

function sameProjectRead(left: ProjectSaveAsProjectRead, right: ProjectSaveAsProjectRead): boolean {
  return left.projectId === right.projectId
    && left.generation === right.generation
    && left.contentSha256 === right.contentSha256
    && left.sceneIds.join("\u0000") === right.sceneIds.join("\u0000")
    && left.scenesSha256 === right.scenesSha256
    && left.activeSceneId === right.activeSceneId
    && left.sceneCount === right.sceneCount
    && left.assetCollectionSha256 === right.assetCollectionSha256
    && JSON.stringify(left.assets) === JSON.stringify(right.assets);
}

function strictSource(input: unknown): ProjectSaveAsRedoTerminalHistoryReceipt {
  const candidate = record(input, "M910 project.save-as redo source receipt");
  try {
    if (candidate.disposition === "terminal-redone") {
      const expectedTerminalKeys = [
        "applyAuthority", "authoritativeReread", "authoritativeRereadRequired", "authoritativeRereads", "batchId", "blocker", "bridgeOnly", "commandKind", "disposition", "execution", "foreignStatePreserved", "history", "historyStatus", "historyTransitions", "matchedReread", "noExecutionAuthority", "noFoundryWrite", "noGenericExecutor", "noProjectMutation", "noTransitionAuthority", "operation", "outcomeUnknown", "readyClaim", "rereadClassifier", "rereadInvocation", "retryAllowed", "schemaVersion", "sourceProjectContentWrite", "sourceReceipt", "sourceProjectId", "status", "targetAuthority", "targetProjectId", "transitionInvocation",
      ] as const;
      exactKeys(candidate, expectedTerminalKeys, "M910 terminal project.save-as redo receipt");
      const rereads = record(candidate.authoritativeRereads, "M910 terminal authoritativeRereads");
      return bridgeProjectSaveAsRedoToTerminalHistory({
        operation: candidate.operation,
        status: "PASS",
        sourceProjectId: candidate.sourceProjectId,
        targetProjectId: candidate.targetProjectId,
        batchId: candidate.batchId,
        beforeRedo: record(rereads.beforeRedo, "M910 terminal beforeRedo"),
        afterRedo: record(rereads.afterRedo, "M910 terminal afterRedo"),
        matchedReread: candidate.matchedReread,
        history: candidate.history,
        sourceReceipt: candidate.sourceReceipt,
        noProjectMutation: candidate.noProjectMutation,
        noFoundryWrite: candidate.noFoundryWrite,
      });
    }
    return bridgeProjectSaveAsRedoToTerminalHistory(candidate);
  } catch (error) {
    blocked(`M910 project.save-as redo source receipt is not strict terminal-history evidence: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export function createProjectStage11SaveAsSemanticRedoEvidence(input: unknown): ProjectStage11SaveAsSemanticRedoEvidence {
  const sourceReceipt = strictSource(input);
  exact(sourceReceipt.operation, "dicebox.project.save-as.redo", "M910 source receipt.operation");
  exact(sourceReceipt.matchedReread.status, "matched", "M910 source receipt.matchedReread.status");
  exact(sourceReceipt.matchedReread.targetId, sourceReceipt.targetProjectId, "M910 source receipt.matchedReread.targetId");

  const beforeRedo = sourceReceipt.authoritativeRereads.beforeRedo;
  const afterRedo = sourceReceipt.authoritativeRereads.afterRedo;
  const beforeSource = beforeRedo.source;
  const afterSource = afterRedo.source;
  const afterTarget = afterRedo.target;
  const originalTarget = sourceReceipt.sourceReceipt.afterApply.target;
  if (!beforeSource || !afterSource || !afterTarget || !originalTarget) blocked("M910 project.save-as redo does not provide complete source and target rereads.");
  if (beforeRedo.target !== null || beforeRedo.targetAbsent !== true) blocked("M910 project.save-as redo does not prove target absence before redo.");
  if (afterRedo.targetAbsent !== false || afterTarget.projectId !== sourceReceipt.targetProjectId) blocked("M910 project.save-as redo does not prove target presence after redo.");
  if (beforeSource.projectId !== sourceReceipt.sourceProjectId || afterSource.projectId !== sourceReceipt.sourceProjectId || !sameProjectRead(beforeSource, afterSource)) blocked("M910 project.save-as redo does not preserve the exact source project.");
  if (afterTarget.generation <= originalTarget.generation) blocked("M910 project.save-as redo does not prove a later target generation.");
  if (afterTarget.contentSha256 !== originalTarget.contentSha256 || afterTarget.scenesSha256 !== originalTarget.scenesSha256 || afterTarget.sceneCount !== originalTarget.sceneCount || afterTarget.activeSceneId !== originalTarget.activeSceneId || afterTarget.assetCollectionSha256 !== originalTarget.assetCollectionSha256 || JSON.stringify(afterTarget.assets) !== JSON.stringify(originalTarget.assets)) {
    blocked("M910 project.save-as redo does not preserve target content, Scene, and asset-collection identity.");
  }
  if (sourceReceipt.sourceReceipt.sourcePreserved !== true || sourceReceipt.sourceReceipt.targetCreated !== true || sourceReceipt.sourceReceipt.saveAs.atomicReplace !== true || sourceReceipt.sourceReceipt.saveAs.directoryEntrySync !== true) blocked("M910 project.save-as redo does not preserve source or target-creation integrity.");
  if (sourceReceipt.matchedReread.revision !== afterTarget.generation || sourceReceipt.matchedReread.sha256 !== afterTarget.contentSha256) blocked("M910 project.save-as redo matched reread does not match the authoritative target reread.");

  return Object.freeze({
    schemaVersion: PROJECT_STAGE11_SAVE_AS_SEMANTIC_REDO_EVIDENCE_SCHEMA_VERSION,
    milestone: "M910",
    evidenceLabel: "local",
    receipt: M910_RECEIPT,
    status: "bounded-local",
    operation: "project.save-as.redo",
    semantic: "redo-post-state",
    sourceAndTargetIdentityPreserved: true,
    targetAbsentBeforeRedo: true,
    targetPresentAfterRedo: true,
    sourcePreserved: true,
    generationAdvanced: true,
    contentPreserved: true,
    sceneCollectionPreserved: true,
    assetCollectionPreserved: true,
    matchedReread: true,
    targetCreationIntegrityPreserved: true,
    driftRejected: "source/target/absence-presence/content/Scene/assets/reread/authority drift",
    sourceReceipt,
    readOnly: true,
    nonCertifying: true,
    noExecutionAuthority: sourceReceipt.noExecutionAuthority,
    noTransitionAuthority: sourceReceipt.noTransitionAuthority,
    noGenericExecutor: sourceReceipt.noGenericExecutor,
    noFoundryWrite: sourceReceipt.noFoundryWrite,
    noProjectMutation: sourceReceipt.noProjectMutation,
    readyClaim: sourceReceipt.readyClaim,
    stage11AcceptanceStatus: "blocked",
    stage12Started: false,
  });
}

function parseEvidence(input: unknown): ProjectStage11SaveAsSemanticRedoEvidence {
  const value = record(input, "M910 project.save-as semantic redo evidence");
  const expectedKeys = [
    "assetCollectionPreserved", "contentPreserved", "driftRejected", "evidenceLabel", "generationAdvanced", "matchedReread", "milestone", "noExecutionAuthority", "noFoundryWrite", "noGenericExecutor", "noProjectMutation", "noTransitionAuthority", "nonCertifying", "operation", "readOnly", "receipt", "readyClaim", "schemaVersion", "sceneCollectionPreserved", "semantic", "sourceAndTargetIdentityPreserved", "sourcePreserved", "sourceReceipt", "stage11AcceptanceStatus", "stage12Started", "status", "targetAbsentBeforeRedo", "targetCreationIntegrityPreserved", "targetPresentAfterRedo",
  ] as const;
  const actualKeys = Object.keys(value).sort();
  const wantedKeys = [...expectedKeys].sort();
  if (actualKeys.length !== wantedKeys.length || actualKeys.some((key, index) => key !== wantedKeys[index])) blocked("M910 project.save-as semantic redo evidence contains unknown or missing fields.");
  const expected = createProjectStage11SaveAsSemanticRedoEvidence(value.sourceReceipt);
  exact(value.schemaVersion, expected.schemaVersion, "M910 evidence.schemaVersion");
  exact(value.milestone, expected.milestone, "M910 evidence.milestone");
  exact(value.evidenceLabel, expected.evidenceLabel, "M910 evidence.evidenceLabel");
  exact(value.receipt, expected.receipt, "M910 evidence.receipt");
  exact(value.status, expected.status, "M910 evidence.status");
  exact(value.operation, expected.operation, "M910 evidence.operation");
  exact(value.semantic, expected.semantic, "M910 evidence.semantic");
  for (const field of ["sourceAndTargetIdentityPreserved", "targetAbsentBeforeRedo", "targetPresentAfterRedo", "sourcePreserved", "generationAdvanced", "contentPreserved", "sceneCollectionPreserved", "assetCollectionPreserved", "matchedReread", "targetCreationIntegrityPreserved"] as const) exact(value[field], true, `M910 evidence.${field}`);
  exact(value.driftRejected, expected.driftRejected, "M910 evidence.driftRejected");
  for (const field of ["readOnly", "nonCertifying", "noExecutionAuthority", "noTransitionAuthority", "noGenericExecutor", "noFoundryWrite", "noProjectMutation"] as const) exact(value[field], true, `M910 evidence.${field}`);
  exact(value.readyClaim, false, "M910 evidence.readyClaim");
  exact(value.stage11AcceptanceStatus, "blocked", "M910 evidence.stage11AcceptanceStatus");
  exact(value.stage12Started, false, "M910 evidence.stage12Started");
  return { ...expected, sourceReceipt: expected.sourceReceipt };
}

export const projectStage11SaveAsSemanticRedoEvidenceSchema = Object.freeze({
  parse(input: unknown): ProjectStage11SaveAsSemanticRedoEvidence {
    return parseEvidence(input);
  },
  safeParse(input: unknown):
    | Readonly<{ success: true; data: ProjectStage11SaveAsSemanticRedoEvidence }>
    | Readonly<{ success: false; error: ProjectStage11SaveAsSemanticRedoEvidenceValidationError }> {
    try {
      return { success: true, data: parseEvidence(input) };
    } catch (error) {
      const validationError = error instanceof ProjectStage11SaveAsSemanticRedoEvidenceValidationError
        ? error
        : new ProjectStage11SaveAsSemanticRedoEvidenceValidationError(error instanceof Error ? error.message : String(error));
      return { success: false, error: validationError };
    }
  },
});
