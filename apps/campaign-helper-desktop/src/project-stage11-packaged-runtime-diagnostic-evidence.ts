export const PROJECT_STAGE11_PACKAGED_RUNTIME_DIAGNOSTIC_EVIDENCE_SCHEMA_VERSION = "0.1.0" as const;

export type ProjectStage11PackagedRuntimeDiagnosticEvidenceReceipt = Readonly<{
  schemaVersion: typeof PROJECT_STAGE11_PACKAGED_RUNTIME_DIAGNOSTIC_EVIDENCE_SCHEMA_VERSION;
  status: "PASS";
  disposition: "one-producer-scoped-packaged-runtime-diagnostic-observation";
  observations: readonly [Readonly<{
    milestone: "M773";
    producer: "foundry.runtime-evidence-diagnostic";
    lifecycle: "staged-visible-active-gm-redacted-no-write-authoritative-reread";
  }>];
  observedLifecycleCount: 1;
  producerScopedOnly: true;
  packageAndRuntimeObserved: true;
  redactedNoWriteObserved: true;
  visibleActiveGmObserved: true;
  authoritativeReread: true;
  foreignStatePreserved: true;
  noRuntimeMutation: true;
  readOnly: true;
  nonCertifying: true;
  noAuthorityGrant: true;
  noCoverageClaim: true;
  noFoundryAuthority: true;
  noExecutionAuthority: true;
  noRecoveryAuthority: true;
  noProjectMutation: true;
  stage11AcceptanceStatus: "blocked";
  stage12Started: false;
  readyClaim: false;
}>;

export class ProjectStage11PackagedRuntimeDiagnosticEvidenceValidationError extends Error {
  readonly code = "STAGE11_PACKAGED_RUNTIME_DIAGNOSTIC_EVIDENCE_VALIDATION_FAILED" as const;
  readonly retryAllowed = false;
  constructor(message: string) { super(message); this.name = "ProjectStage11PackagedRuntimeDiagnosticEvidenceValidationError"; }
}

function blocked(message: string): never { throw new ProjectStage11PackagedRuntimeDiagnosticEvidenceValidationError(message); }
function record(value: unknown, label: string): Record<string, unknown> { if (!value || typeof value !== "object" || Array.isArray(value)) blocked(`${label} must be an object.`); return value as Record<string, unknown>; }
function exact(value: unknown, expected: string | number | boolean, label: string): void { if (value !== expected) blocked(`${label} must be ${String(expected)}.`); }
function exactKeys(value: Record<string, unknown>, expected: readonly string[], label: string): void { const actual = Object.keys(value).sort(); const required = [...expected].sort(); if (actual.length !== required.length || actual.some((key, index) => key !== required[index])) blocked(`${label} contains unknown or missing fields.`); }
function exactArray(value: unknown, expected: readonly string[], label: string): void { if (!Array.isArray(value) || value.length !== expected.length || value.some((item, index) => item !== expected[index])) blocked(`${label} must retain exact ordered values.`); }

export function createProjectStage11PackagedRuntimeDiagnosticEvidence(input: unknown): ProjectStage11PackagedRuntimeDiagnosticEvidenceReceipt {
  const receipt = record(input, "M773 receipt");
  exactKeys(receipt, ["authoritativeReread", "evidenceLabel", "milestone", "next", "notes", "preservation", "readyClaim", "receiptId", "receiptVersion", "runtimeReadback", "stage", "stagedArtifact", "status", "target"], "M773 receipt");
  exact(receipt.receiptVersion, 1, "M773.receiptVersion"); exact(receipt.receiptId, "dbx:receipt:m773-stage11-packaged-diagnostic-staging-and-readback-closure-2026-08-31", "M773.receiptId"); exact(receipt.milestone, "M773", "M773.milestone"); exact(receipt.stage, "proposal-approval-history", "M773.stage"); exact(receipt.evidenceLabel, "fixture", "M773.evidenceLabel"); exact(receipt.status, "PASS FIXTURE READBACK; NON-CERTIFYING", "M773.status"); exact(receipt.readyClaim, false, "M773.readyClaim"); exact(receipt.next, "M774 may only reconcile the new fixture evidence with the still-partial Stage 11 clauses and select one bounded remaining gap.", "M773.next");
  const target = record(receipt.target, "M773.target"); exactKeys(target, ["dataPath", "foundryVersion", "package", "port", "system", "worldId"], "M773.target"); exact(target.dataPath, "work/foundry-fixture-data-v4", "M773.target.dataPath"); exact(target.worldId, "dbx-test-world", "M773.target.worldId"); exact(target.port, 30003, "M773.target.port"); exact(target.foundryVersion, "14.367", "M773.target.foundryVersion"); exact(target.system, "dnd5e@5.3.3", "M773.target.system"); exact(target.package, "dicebox-campaign-helper@0.1.15", "M773.target.package");
  const artifact = record(receipt.stagedArtifact, "M773.stagedArtifact"); exactKeys(artifact, ["entry", "entrySha256", "moduleSha256", "noWorldMutation", "stageOperation"], "M773.stagedArtifact"); exact(artifact.moduleSha256, "B7329E018062CEF2AB73416F90B097648F37F7A11B44C9112F86BB553D1EF597", "M773.stagedArtifact.moduleSha256"); exact(artifact.entrySha256, "DB39BC0362EF23574813A4F5EF69265ED3EACE31FE75B510747662A84AE66779", "M773.stagedArtifact.entrySha256"); exact(artifact.entry, "src/entry-20260823-program-scene-v2.js -> module.js?dbx=0.1.17", "M773.stagedArtifact.entry"); exact(artifact.stageOperation, "foundry.module.update", "M773.stagedArtifact.stageOperation"); exact(artifact.noWorldMutation, true, "M773.stagedArtifact.noWorldMutation");
  const runtime = record(receipt.runtimeReadback, "M773.runtimeReadback"); exactKeys(runtime, ["control", "exactTargetMatch", "noWrite", "operation", "readiness", "redacted", "remainingBlocker", "status", "visibleActiveGm"], "M773.runtimeReadback"); exact(runtime.visibleActiveGm, "Gamemaster [GM]", "M773.runtimeReadback.visibleActiveGm"); exact(runtime.control, "Show DiceBox Runtime Evidence Diagnostics", "M773.runtimeReadback.control"); exact(runtime.operation, "dicebox.runtime-evidence.diagnostic", "M773.runtimeReadback.operation"); exact(runtime.status, "OBSERVED", "M773.runtimeReadback.status"); exact(runtime.redacted, true, "M773.runtimeReadback.redacted"); exact(runtime.noWrite, true, "M773.runtimeReadback.noWrite"); exact(runtime.exactTargetMatch, true, "M773.runtimeReadback.exactTargetMatch"); exact(runtime.remainingBlocker, "Exact-runtime behavior and permission proof remains separately blocked.", "M773.runtimeReadback.remainingBlocker"); const readiness = record(runtime.readiness, "M773.runtimeReadback.readiness"); exactKeys(readiness, ["blocked", "pass", "status", "total", "unknown"], "M773.runtimeReadback.readiness"); exact(readiness.status, "blocked", "M773.runtimeReadback.readiness.status"); exact(readiness.pass, 10, "M773.runtimeReadback.readiness.pass"); exact(readiness.blocked, 1, "M773.runtimeReadback.readiness.blocked"); exact(readiness.unknown, 0, "M773.runtimeReadback.readiness.unknown"); exact(readiness.total, 11, "M773.runtimeReadback.readiness.total");
  const reread = record(receipt.authoritativeReread, "M773.authoritativeReread"); exactKeys(reread, ["balladTouched", "pid", "sourceAndStagedHashesMatch", "supervisorStatus", "worldDocumentWrites"], "M773.authoritativeReread"); exact(reread.supervisorStatus, "PASS", "M773.authoritativeReread.supervisorStatus"); exact(reread.pid, 14220, "M773.authoritativeReread.pid"); exact(reread.sourceAndStagedHashesMatch, true, "M773.authoritativeReread.sourceAndStagedHashesMatch"); exact(reread.worldDocumentWrites, 0, "M773.authoritativeReread.worldDocumentWrites"); exact(reread.balladTouched, false, "M773.authoritativeReread.balladTouched");
  const preservation = record(receipt.preservation, "M773.preservation"); exactKeys(preservation, ["foundryDocumentWrites", "playerPasswordsGenerated", "projectWrites", "providerOrCredentialActivity", "settingsWrites", "stage11Accepted", "stage12Started"], "M773.preservation"); exact(preservation.projectWrites, 0, "M773.preservation.projectWrites"); exact(preservation.settingsWrites, 0, "M773.preservation.settingsWrites"); exact(preservation.foundryDocumentWrites, 0, "M773.preservation.foundryDocumentWrites"); exact(preservation.providerOrCredentialActivity, false, "M773.preservation.providerOrCredentialActivity"); exact(preservation.playerPasswordsGenerated, false, "M773.preservation.playerPasswordsGenerated"); exact(preservation.stage11Accepted, false, "M773.preservation.stage11Accepted"); exact(preservation.stage12Started, false, "M773.preservation.stage12Started");
  exactArray(receipt.notes, ["The first update attempt used the fixture parent rather than its owned Data directory and was refused before mutation; the corrected explicit Data root update passed.", "The supervisor performed its standard exact-owned restart recovery; this is fixture process evidence, not live behavior or authority certification."], "M773.notes");
  return Object.freeze({ schemaVersion: PROJECT_STAGE11_PACKAGED_RUNTIME_DIAGNOSTIC_EVIDENCE_SCHEMA_VERSION, status: "PASS", disposition: "one-producer-scoped-packaged-runtime-diagnostic-observation", observations: Object.freeze([Object.freeze({ milestone: "M773", producer: "foundry.runtime-evidence-diagnostic", lifecycle: "staged-visible-active-gm-redacted-no-write-authoritative-reread" })]) as ProjectStage11PackagedRuntimeDiagnosticEvidenceReceipt["observations"], observedLifecycleCount: 1, producerScopedOnly: true, packageAndRuntimeObserved: true, redactedNoWriteObserved: true, visibleActiveGmObserved: true, authoritativeReread: true, foreignStatePreserved: true, noRuntimeMutation: true, readOnly: true, nonCertifying: true, noAuthorityGrant: true, noCoverageClaim: true, noFoundryAuthority: true, noExecutionAuthority: true, noRecoveryAuthority: true, noProjectMutation: true, stage11AcceptanceStatus: "blocked", stage12Started: false, readyClaim: false });
}
