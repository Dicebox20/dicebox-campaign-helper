export const PROJECT_STAGE11_DIRECT_CAMPAIGN_DIRECTOR_PROPOSAL_EVIDENCE_SCHEMA_VERSION = "0.1.0" as const;

export type ProjectStage11DirectCampaignDirectorProposalEvidenceReceipt = Readonly<{
  schemaVersion: typeof PROJECT_STAGE11_DIRECT_CAMPAIGN_DIRECTOR_PROPOSAL_EVIDENCE_SCHEMA_VERSION;
  status: "PASS";
  disposition: "one-producer-scoped-local-browser-observation";
  observations: readonly [Readonly<{
    milestone: "M303";
    producer: "campaign-director";
    lifecycle: "preview-approval-apply-reread-undo-redo-stale-invalidation";
  }>];
  observedLifecycleCount: 1;
  producerScopedOnly: true;
  localBrowserObserved: true;
  previewNoWrite: true;
  approvalNoWrite: true;
  applyRereadMatched: true;
  undoRereadMatched: true;
  redoRereadMatched: true;
  staleInvalidated: true;
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

export class ProjectStage11DirectCampaignDirectorProposalEvidenceValidationError extends Error {
  readonly code = "STAGE11_DIRECT_CAMPAIGN_DIRECTOR_PROPOSAL_EVIDENCE_VALIDATION_FAILED" as const;
  readonly retryAllowed = false;
  constructor(message: string) { super(message); this.name = "ProjectStage11DirectCampaignDirectorProposalEvidenceValidationError"; }
}

function blocked(message: string): never { throw new ProjectStage11DirectCampaignDirectorProposalEvidenceValidationError(message); }
function record(value: unknown, label: string): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) blocked(`${label} must be an object.`);
  return value as Record<string, unknown>;
}
function exact(value: unknown, expected: string | number | boolean, label: string): void {
  if (value !== expected) blocked(`${label} must be ${String(expected)}.`);
}
function keys(value: Record<string, unknown>, expected: readonly string[], label: string): void {
  const actual = Object.keys(value).sort(); const required = [...expected].sort();
  if (actual.length !== required.length || actual.some((key, index) => key !== required[index])) blocked(`${label} contains unknown or missing fields.`);
}
function empty(value: unknown, label: string): void { if (!Array.isArray(value) || value.length !== 0) blocked(`${label} must be empty.`); }
function matchedReread(value: unknown, label: string): void {
  if (typeof value !== "string" || !/^matched revision [1-3] with visible 64-character SHA-256$/.test(value)) blocked(`${label} must be an exact matched reread.`);
}

export function createProjectStage11DirectCampaignDirectorProposalEvidence(input: unknown): ProjectStage11DirectCampaignDirectorProposalEvidenceReceipt {
  const receipt = record(input, "M303 receipt");
  keys(receipt, ["browserSurface", "credentialAccess", "doesNotProve", "evidenceLabel", "foundryWrites", "milestone", "observation", "persistentProjectWrites", "preconditions", "providerCalls", "readyClaim", "receiptId", "receiptVersion", "stageId", "status", "url"], "M303 receipt");
  exact(receipt.receiptVersion, 1, "M303.receiptVersion"); exact(receipt.receiptId, "dbx:receipt:m303-stage11-local-browser-proposal-acceptance-2026-08-27", "M303.receiptId"); exact(receipt.stageId, "proposal-approval-history", "M303.stageId"); exact(receipt.milestone, "M303", "M303.milestone"); exact(receipt.evidenceLabel, "local", "M303.evidenceLabel"); exact(receipt.status, "PASS", "M303.status"); exact(receipt.readyClaim, false, "M303.readyClaim"); exact(receipt.browserSurface, "Codex in-app browser", "M303.browserSurface"); exact(receipt.url, "http://127.0.0.1:1420/", "M303.url"); exact(receipt.providerCalls, 0, "M303.providerCalls"); exact(receipt.credentialAccess, 0, "M303.credentialAccess"); exact(receipt.persistentProjectWrites, 0, "M303.persistentProjectWrites"); exact(receipt.foundryWrites, 0, "M303.foundryWrites");

  const preconditions = record(receipt.preconditions, "M303.preconditions");
  keys(preconditions, ["focusedGovernanceTests", "knowledgeBase", "m302ReceiptSha256", "workflow"], "M303.preconditions"); exact(preconditions.workflow, "PASS: 10/16, proposal-approval-history active, M303 next", "M303.preconditions.workflow"); exact(preconditions.knowledgeBase, "PASS: 429 sources / 464 facts / 413 decisions / 427 trials", "M303.preconditions.knowledgeBase"); exact(preconditions.focusedGovernanceTests, "PASS: 2 files / 85 tests", "M303.preconditions.focusedGovernanceTests"); exact(preconditions.m302ReceiptSha256, "577E6D5F7A1A9B3F33548E8BFD33906C5CA5E1843B4D25236E7CB62053256607", "M303.preconditions.m302ReceiptSha256");

  const observation = record(receipt.observation, "M303.observation");
  keys(observation, ["apply", "approval", "browserWarningsOrErrors", "initial", "preview", "redo", "staleInvalidation", "undo"], "M303.observation");
  const initial = record(observation.initial, "M303.initial"); keys(initial, ["entityId", "sceneRevision", "x", "y"], "M303.initial"); exact(initial.entityId, "dbx:apparatus:core", "M303.initial.entityId"); exact(initial.sceneRevision, 0, "M303.initial.sceneRevision"); exact(initial.x, 608, "M303.initial.x"); exact(initial.y, 376, "M303.initial.y");
  const preview = record(observation.preview, "M303.preview"); keys(preview, ["dependencies", "noWrite", "producer", "provider", "receiptTransitions", "reviewAuthority", "risk", "sceneRevision", "status", "targetAuthority", "x", "y"], "M303.preview"); exact(preview.producer, "campaign-director", "M303.preview.producer"); exact(preview.provider, "local-fixture", "M303.preview.provider"); exact(preview.risk, "medium", "M303.preview.risk"); exact(preview.status, "previewed", "M303.preview.status"); exact(preview.reviewAuthority, "human-review/reviewer", "M303.preview.reviewAuthority"); exact(preview.targetAuthority, "local-project/active-gm-false", "M303.preview.targetAuthority"); exact(preview.sceneRevision, 0, "M303.preview.sceneRevision"); exact(preview.x, 608, "M303.preview.x"); exact(preview.y, 376, "M303.preview.y"); exact(preview.noWrite, true, "M303.preview.noWrite"); if (!Array.isArray(preview.dependencies) || preview.dependencies.length !== 0 || JSON.stringify(preview.receiptTransitions) !== JSON.stringify(["preview"])) blocked("M303.preview must preserve no dependency/preview-only state.");
  const approval = record(observation.approval, "M303.approval"); keys(approval, ["applyEnabled", "noWrite", "sceneRevision", "status", "x", "y"], "M303.approval"); exact(approval.status, "approved", "M303.approval.status"); exact(approval.sceneRevision, 0, "M303.approval.sceneRevision"); exact(approval.x, 608, "M303.approval.x"); exact(approval.y, 376, "M303.approval.y"); exact(approval.applyEnabled, true, "M303.approval.applyEnabled"); exact(approval.noWrite, true, "M303.approval.noWrite");
  const apply = record(observation.apply, "M303.apply"); keys(apply, ["receiptTransitions", "reread", "sceneRevision", "status", "x", "y"], "M303.apply"); exact(apply.status, "committed", "M303.apply.status"); exact(apply.sceneRevision, 1, "M303.apply.sceneRevision"); exact(apply.x, 616, "M303.apply.x"); exact(apply.y, 376, "M303.apply.y"); if (JSON.stringify(apply.receiptTransitions) !== JSON.stringify(["preview", "approve", "begin-apply", "commit-after-reread"])) blocked("M303.apply receipt transitions drifted."); matchedReread(apply.reread, "M303.apply.reread");
  for (const [name, revision, status, x] of [["undo", 2, "undone", 608], ["redo", 3, "redone", 616]] as const) { const value = record(observation[name], `M303.${name}`); keys(value, ["receiptSequence", "reread", "sceneRevision", "status", "x", "y"], `M303.${name}`); exact(value.status, status, `M303.${name}.status`); exact(value.sceneRevision, revision, `M303.${name}.sceneRevision`); exact(value.x, x, `M303.${name}.x`); exact(value.y, 376, `M303.${name}.y`); exact(value.receiptSequence, revision + 2, `M303.${name}.receiptSequence`); matchedReread(value.reread, `M303.${name}.reread`); }
  const stale = record(observation.staleInvalidation, "M303.staleInvalidation"); keys(stale, ["applyEnabled", "humanEditRevision", "humanEditX", "humanEditY", "previewBaseRevision", "receiptTransitions", "status"], "M303.staleInvalidation"); exact(stale.previewBaseRevision, 3, "M303.staleInvalidation.previewBaseRevision"); exact(stale.humanEditRevision, 4, "M303.staleInvalidation.humanEditRevision"); exact(stale.humanEditX, 624, "M303.staleInvalidation.humanEditX"); exact(stale.humanEditY, 376, "M303.staleInvalidation.humanEditY"); exact(stale.status, "stale", "M303.staleInvalidation.status"); exact(stale.applyEnabled, false, "M303.staleInvalidation.applyEnabled"); if (JSON.stringify(stale.receiptTransitions) !== JSON.stringify(["preview", "invalidate-stale"])) blocked("M303.staleInvalidation receipt transitions drifted."); empty(observation.browserWarningsOrErrors, "M303.browserWarningsOrErrors");
  const limits = receipt.doesNotProve; const expectedLimits = ["managed or API-key provider execution", "Technical Builder repository integration or promotion", "project-store mutation normalization", "Foundry execution or active-GM authority", "every mutating producer uses the generic lifecycle", "Stage 11 acceptance", "Ready-to-Play"];
  if (!Array.isArray(limits) || JSON.stringify(limits) !== JSON.stringify(expectedLimits)) blocked("M303.doesNotProve must retain exact non-certification limits.");

  return Object.freeze({ schemaVersion: PROJECT_STAGE11_DIRECT_CAMPAIGN_DIRECTOR_PROPOSAL_EVIDENCE_SCHEMA_VERSION, status: "PASS", disposition: "one-producer-scoped-local-browser-observation", observations: Object.freeze([Object.freeze({ milestone: "M303", producer: "campaign-director", lifecycle: "preview-approval-apply-reread-undo-redo-stale-invalidation" })]) as ProjectStage11DirectCampaignDirectorProposalEvidenceReceipt["observations"], observedLifecycleCount: 1, producerScopedOnly: true, localBrowserObserved: true, previewNoWrite: true, approvalNoWrite: true, applyRereadMatched: true, undoRereadMatched: true, redoRereadMatched: true, staleInvalidated: true, browserDiagnosticsEmpty: true, readOnly: true, nonCertifying: true, noAuthorityGrant: true, noCoverageClaim: true, noFoundryAuthority: true, noExecutionAuthority: true, noProjectMutation: true, stage11AcceptanceStatus: "blocked", stage12Started: false, readyClaim: false });
}

export const projectStage11DirectCampaignDirectorProposalEvidenceSchema = Object.freeze({
  parse(input: unknown): ProjectStage11DirectCampaignDirectorProposalEvidenceReceipt { return createProjectStage11DirectCampaignDirectorProposalEvidence(input); },
  safeParse(input: unknown) { try { return { success: true as const, data: createProjectStage11DirectCampaignDirectorProposalEvidence(input) }; } catch (error) { return { success: false as const, error: error instanceof ProjectStage11DirectCampaignDirectorProposalEvidenceValidationError ? error : new ProjectStage11DirectCampaignDirectorProposalEvidenceValidationError(error instanceof Error ? error.message : String(error)) }; } },
});
