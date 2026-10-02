export const PROJECT_STAGE11_DIRECT_HUMAN_PROPOSAL_EVIDENCE_SCHEMA_VERSION = "0.1.0" as const;

export type ProjectStage11DirectHumanProposalEvidenceReceipt = Readonly<{
  schemaVersion: typeof PROJECT_STAGE11_DIRECT_HUMAN_PROPOSAL_EVIDENCE_SCHEMA_VERSION;
  status: "PASS";
  disposition: "one-producer-scoped-local-browser-observation";
  observations: readonly [Readonly<{
    milestone: "M306";
    producer: "human";
    lifecycle: "preview-approval-apply-reread-undo-redo";
  }>];
  observedLifecycleCount: 1;
  producerScopedOnly: true;
  localBrowserObserved: true;
  previewNoWrite: true;
  approvalNoWrite: true;
  applyRereadMatched: true;
  undoRereadMatched: true;
  redoRereadMatched: true;
  browserDiagnosticsEmpty: true;
  readOnly: true;
  nonCertifying: true;
  noAuthorityGrant: true;
  noCoverageClaim: true;
  noFoundryAuthority: true;
  noExecutionAuthority: true;
  noProjectMutation: true;
  stage11AcceptanceStatus: "blocked";
  stage12Started: false;
  readyClaim: false;
}>;

export class ProjectStage11DirectHumanProposalEvidenceValidationError extends Error {
  readonly code = "STAGE11_DIRECT_HUMAN_PROPOSAL_EVIDENCE_VALIDATION_FAILED" as const;
  readonly retryAllowed = false;
  constructor(message: string) { super(message); this.name = "ProjectStage11DirectHumanProposalEvidenceValidationError"; }
}

function blocked(message: string): never { throw new ProjectStage11DirectHumanProposalEvidenceValidationError(message); }
function record(value: unknown, label: string): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) blocked(`${label} must be an object.`);
  return value as Record<string, unknown>;
}
function exact(value: unknown, expected: string | number | boolean, label: string): void {
  if (value !== expected) blocked(`${label} must be ${String(expected)}.`);
}
function exactKeys(value: Record<string, unknown>, expected: readonly string[], label: string): void {
  const actual = Object.keys(value).sort(); const required = [...expected].sort();
  if (actual.length !== required.length || actual.some((key, index) => key !== required[index])) blocked(`${label} contains unknown or missing fields.`);
}
function nonEmptyString(value: unknown, label: string): void {
  if (typeof value !== "string" || value.length === 0) blocked(`${label} must be a non-empty string.`);
}
function exactEmptyArray(value: unknown, label: string): void {
  if (!Array.isArray(value) || value.length !== 0) blocked(`${label} must be empty.`);
}
function exactHash(value: unknown, expected: string, label: string): void { exact(value, expected, label); }

export function createProjectStage11DirectHumanProposalEvidence(input: unknown): ProjectStage11DirectHumanProposalEvidenceReceipt {
  const receipt = record(input, "M306 receipt");
  exactKeys(receipt, ["approval", "apply", "browserDiagnostics", "browserTarget", "doesNotProve", "evidenceLabel", "foundryWrites", "initial", "milestone", "preview", "projectWrites", "receiptId", "receiptVersion", "readyClaim", "redo", "runtimeOrProviderCall", "stageId", "status", "undo"], "M306 receipt");
  exact(receipt.receiptVersion, 1, "M306.receiptVersion");
  exact(receipt.receiptId, "dbx:receipt:m306-stage11-local-browser-human-proposal-acceptance-2026-08-27", "M306.receiptId");
  exact(receipt.stageId, "proposal-approval-history", "M306.stageId");
  exact(receipt.milestone, "M306", "M306.milestone");
  exact(receipt.evidenceLabel, "local", "M306.evidenceLabel");
  exact(receipt.status, "PASS", "M306.status");
  exact(receipt.browserTarget, "http://127.0.0.1:1420/", "M306.browserTarget");
  exact(receipt.runtimeOrProviderCall, false, "M306.runtimeOrProviderCall");
  exact(receipt.projectWrites, 0, "M306.projectWrites");
  exact(receipt.foundryWrites, 0, "M306.foundryWrites");
  exact(receipt.readyClaim, false, "M306.readyClaim");

  const initial = record(receipt.initial, "M306.initial");
  exactKeys(initial, ["sceneRevision", "selectedStableId", "x", "y"], "M306.initial");
  exact(initial.sceneRevision, 0, "M306.initial.sceneRevision"); exact(initial.selectedStableId, "dbx:apparatus:core", "M306.initial.selectedStableId"); exact(initial.x, 608, "M306.initial.x"); exact(initial.y, 376, "M306.initial.y");

  const preview = record(receipt.preview, "M306.preview");
  exactKeys(preview, ["batchId", "batchRevision", "batchSha256", "commands", "dependencies", "provider", "producer", "receipts", "reviewAuthority", "risk", "sceneRevision", "stateChanged", "status", "targetAuthority", "x", "y"], "M306.preview");
  exact(preview.producer, "human", "M306.preview.producer"); exact(preview.provider, "none", "M306.preview.provider"); exact(preview.batchId, "dbx:proposal:desktop-human-1", "M306.preview.batchId"); exact(preview.batchRevision, 0, "M306.preview.batchRevision"); exactHash(preview.batchSha256, "9e826366f903d843443421016d8268da24e2c73a79a27723aac93cbd95e24df1", "M306.preview.batchSha256"); exact(preview.risk, "low", "M306.preview.risk"); exact(preview.status, "previewed", "M306.preview.status"); exact(preview.reviewAuthority, "human-review/reviewer", "M306.preview.reviewAuthority"); exact(preview.targetAuthority, "local-project/active-GM-false", "M306.preview.targetAuthority"); exact(preview.commands, 1, "M306.preview.commands"); exact(preview.receipts, 1, "M306.preview.receipts"); exact(preview.dependencies, "none", "M306.preview.dependencies"); exact(preview.sceneRevision, 0, "M306.preview.sceneRevision"); exact(preview.x, 608, "M306.preview.x"); exact(preview.y, 376, "M306.preview.y"); exact(preview.stateChanged, false, "M306.preview.stateChanged");

  const approval = record(receipt.approval, "M306.approval");
  exactKeys(approval, ["applyEnabled", "receipts", "sceneRevision", "stateChanged", "status", "x", "y"], "M306.approval"); exact(approval.status, "approved", "M306.approval.status"); exact(approval.receipts, 2, "M306.approval.receipts"); exact(approval.sceneRevision, 0, "M306.approval.sceneRevision"); exact(approval.x, 608, "M306.approval.x"); exact(approval.y, 376, "M306.approval.y"); exact(approval.stateChanged, false, "M306.approval.stateChanged"); exact(approval.applyEnabled, true, "M306.approval.applyEnabled");

  const apply = record(receipt.apply, "M306.apply");
  exactKeys(apply, ["rereadMatched", "receipts", "resultSha256", "sceneRevision", "status", "x", "y"], "M306.apply"); exact(apply.status, "committed", "M306.apply.status"); exact(apply.sceneRevision, 1, "M306.apply.sceneRevision"); exact(apply.x, 616, "M306.apply.x"); exact(apply.y, 376, "M306.apply.y"); exact(apply.receipts, 4, "M306.apply.receipts"); exact(apply.rereadMatched, true, "M306.apply.rereadMatched"); exactHash(apply.resultSha256, "d8516a001595fb0d1957c38664956e8a51580dac271891d8a0bcc82ebad27519", "M306.apply.resultSha256");

  const undo = record(receipt.undo, "M306.undo");
  exactKeys(undo, ["rereadMatched", "receipts", "resultSha256", "sceneRevision", "status", "x", "y"], "M306.undo"); exact(undo.status, "undone", "M306.undo.status"); exact(undo.sceneRevision, 2, "M306.undo.sceneRevision"); exact(undo.x, 608, "M306.undo.x"); exact(undo.y, 376, "M306.undo.y"); exact(undo.receipts, 5, "M306.undo.receipts"); exact(undo.rereadMatched, true, "M306.undo.rereadMatched"); exactHash(undo.resultSha256, "addc01c8a37b22c06558058107d187c60ec4789461754141e247ff2f0281d1d0", "M306.undo.resultSha256");

  const redo = record(receipt.redo, "M306.redo");
  exactKeys(redo, ["rereadMatched", "receipts", "resultSha256", "sceneRevision", "status", "x", "y"], "M306.redo"); exact(redo.status, "redone", "M306.redo.status"); exact(redo.sceneRevision, 3, "M306.redo.sceneRevision"); exact(redo.x, 616, "M306.redo.x"); exact(redo.y, 376, "M306.redo.y"); exact(redo.receipts, 6, "M306.redo.receipts"); exact(redo.rereadMatched, true, "M306.redo.rereadMatched"); exactHash(redo.resultSha256, "341c6bff288a727c697e1b5b51e14bcf39c9af581cb12c06bc4805c76cf88113", "M306.redo.resultSha256");

  const diagnostics = record(receipt.browserDiagnostics, "M306.browserDiagnostics");
  exactKeys(diagnostics, ["errors", "warnings"], "M306.browserDiagnostics"); exactEmptyArray(diagnostics.warnings, "M306.browserDiagnostics.warnings"); exactEmptyArray(diagnostics.errors, "M306.browserDiagnostics.errors");
  const limits = receipt.doesNotProve;
  if (!Array.isArray(limits) || limits.length !== 5 || limits[0] !== "persistent project or project-store generic integration" || limits[1] !== "Technical Builder repository promotion" || limits[2] !== "Foundry execution or active-GM authority" || limits[3] !== "Stage 11 acceptance" || limits[4] !== "Ready-to-Play") blocked("M306.doesNotProve must retain its exact non-certification limits.");

  return Object.freeze({
    schemaVersion: PROJECT_STAGE11_DIRECT_HUMAN_PROPOSAL_EVIDENCE_SCHEMA_VERSION,
    status: "PASS",
    disposition: "one-producer-scoped-local-browser-observation",
    observations: Object.freeze([Object.freeze({ milestone: "M306", producer: "human", lifecycle: "preview-approval-apply-reread-undo-redo" })]) as ProjectStage11DirectHumanProposalEvidenceReceipt["observations"],
    observedLifecycleCount: 1,
    producerScopedOnly: true,
    localBrowserObserved: true,
    previewNoWrite: true,
    approvalNoWrite: true,
    applyRereadMatched: true,
    undoRereadMatched: true,
    redoRereadMatched: true,
    browserDiagnosticsEmpty: true,
    readOnly: true,
    nonCertifying: true,
    noAuthorityGrant: true,
    noCoverageClaim: true,
    noFoundryAuthority: true,
    noExecutionAuthority: true,
    noProjectMutation: true,
    stage11AcceptanceStatus: "blocked",
    stage12Started: false,
    readyClaim: false,
  });
}

export const projectStage11DirectHumanProposalEvidenceSchema = Object.freeze({
  parse(input: unknown): ProjectStage11DirectHumanProposalEvidenceReceipt { return createProjectStage11DirectHumanProposalEvidence(input); },
  safeParse(input: unknown) {
    try { return { success: true as const, data: createProjectStage11DirectHumanProposalEvidence(input) }; }
    catch (error) {
      const validationError = error instanceof ProjectStage11DirectHumanProposalEvidenceValidationError ? error : new ProjectStage11DirectHumanProposalEvidenceValidationError(error instanceof Error ? error.message : String(error));
      return { success: false as const, error: validationError };
    }
  },
});
