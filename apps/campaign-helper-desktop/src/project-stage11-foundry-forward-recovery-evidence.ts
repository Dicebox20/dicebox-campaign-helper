export const PROJECT_STAGE11_FOUNDRY_FORWARD_RECOVERY_EVIDENCE_SCHEMA_VERSION = "0.1.0" as const;

export type ProjectStage11FoundryForwardRecoveryEvidenceReceipt = Readonly<{
  schemaVersion: typeof PROJECT_STAGE11_FOUNDRY_FORWARD_RECOVERY_EVIDENCE_SCHEMA_VERSION;
  status: "PASS";
  disposition: "one-producer-scoped-foundry-fixture-forward-recovery-observation";
  observations: readonly [Readonly<{
    milestone: "M830";
    producer: "foundry.program-scene.forward";
    lifecycle: "preview-approved-create-unknown-authoritative-recovery-reread";
  }>];
  observedLifecycleCount: 1;
  producerScopedOnly: true;
  foundryMutationObserved: true;
  authoritativeReread: true;
  recoveredFromUnknown: true;
  noRetry: true;
  foreignStatePreserved: true;
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

export class ProjectStage11FoundryForwardRecoveryEvidenceValidationError extends Error {
  readonly code = "STAGE11_FOUNDRY_FORWARD_RECOVERY_EVIDENCE_VALIDATION_FAILED" as const;
  readonly retryAllowed = false;
  readonly authoritativeRereadRequired = true;

  constructor(message: string) {
    super(message);
    this.name = "ProjectStage11FoundryForwardRecoveryEvidenceValidationError";
  }
}

function blocked(message: string): never { throw new ProjectStage11FoundryForwardRecoveryEvidenceValidationError(message); }
function record(value: unknown, label: string): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) blocked(`${label} must be an object.`);
  return value as Record<string, unknown>;
}
function exactKeys(value: Record<string, unknown>, expected: readonly string[], label: string): void {
  const actual = Object.keys(value).sort(); const required = [...expected].sort();
  if (actual.length !== required.length || actual.some((key, index) => key !== required[index])) blocked(`${label} contains unknown or missing fields.`);
}
function exact(value: unknown, expected: string | number | boolean, label: string): void {
  if (value !== expected) blocked(`${label} must be ${String(expected)}.`);
}

export function createProjectStage11FoundryForwardRecoveryEvidence(input: unknown): ProjectStage11FoundryForwardRecoveryEvidenceReceipt {
  const receipt = record(input, "M830 receipt");
  exactKeys(receipt, ["apply", "evidenceClass", "limits", "milestone", "operation", "preview", "receiptVersion", "recovery", "shutdown", "status", "target"], "M830 receipt");
  exact(receipt.receiptVersion, 1, "M830.receiptVersion"); exact(receipt.milestone, "M830", "M830.milestone");
  exact(receipt.operation, "program-scene.apply-recovery-drill", "M830.operation"); exact(receipt.status, "PASS", "M830.status"); exact(receipt.evidenceClass, "fixture", "M830.evidenceClass");

  const target = record(receipt.target, "M830.target");
  exactKeys(target, ["foundry", "port", "system", "user", "worldId"], "M830.target");
  exact(target.worldId, "dbx-test-world", "M830.target.worldId"); exact(target.foundry, "14.367", "M830.target.foundry");
  exact(target.system, "dnd5e@5.3.3", "M830.target.system"); exact(target.user, "Gamemaster", "M830.target.user"); exact(target.port, 30003, "M830.target.port");

  const preview = record(receipt.preview, "M830.preview");
  exactKeys(preview, ["assetBytes", "assetSha256", "existingComplete", "noWrite", "planSha256", "status"], "M830.preview");
  exact(preview.status, "PASS", "M830.preview.status"); exact(preview.noWrite, true, "M830.preview.noWrite");
  exact(preview.planSha256, "10c4925a5eabdb7c0f6537440d2f083b1c999ca27fd6719f61f36eafed946c1e", "M830.preview.planSha256");
  exact(preview.assetSha256, "7adeb330329550eb18753187e8dbf001815bf22e056f14bc2cdc76188b0cf852", "M830.preview.assetSha256");
  exact(preview.assetBytes, 20655, "M830.preview.assetBytes"); exact(preview.existingComplete, false, "M830.preview.existingComplete");

  const apply = record(receipt.apply, "M830.apply");
  exactKeys(apply, ["responseDisposition", "retryAllowed", "sceneCreated", "status"], "M830.apply");
  exact(apply.status, "UNKNOWN", "M830.apply.status"); exact(apply.sceneCreated, true, "M830.apply.sceneCreated");
  exact(apply.responseDisposition, "intentionally-discarded-after-commit", "M830.apply.responseDisposition"); exact(apply.retryAllowed, false, "M830.apply.retryAllowed");

  const recovery = record(receipt.recovery, "M830.recovery");
  exactKeys(recovery, ["authoritativeReread", "foreignStatePreserved", "initialLevel", "recoveredFromUnknown", "regions", "retryPerformed", "sceneRuntimeId", "sceneStableId", "status", "tiles", "walls"], "M830.recovery");
  exact(recovery.status, "PASS", "M830.recovery.status"); exact(recovery.authoritativeReread, true, "M830.recovery.authoritativeReread");
  exact(recovery.recoveredFromUnknown, true, "M830.recovery.recoveredFromUnknown"); exact(recovery.retryPerformed, false, "M830.recovery.retryPerformed");
  exact(recovery.foreignStatePreserved, true, "M830.recovery.foreignStatePreserved"); exact(recovery.sceneStableId, "dbx:scene:desktop-shell-fixture", "M830.recovery.sceneStableId");
  if (typeof recovery.sceneRuntimeId !== "string" || recovery.sceneRuntimeId.length === 0) blocked("M830.recovery.sceneRuntimeId must be a non-empty string.");
  exact(recovery.initialLevel, 1, "M830.recovery.initialLevel"); exact(recovery.walls, 5, "M830.recovery.walls"); exact(recovery.regions, 2, "M830.recovery.regions"); exact(recovery.tiles, 1, "M830.recovery.tiles");

  const shutdown = record(receipt.shutdown, "M830.shutdown");
  exactKeys(shutdown, ["balladTouched", "listeners", "status", "stopMethod", "worldDocumentWrites"], "M830.shutdown");
  exact(shutdown.status, "STOPPED", "M830.shutdown.status"); if (!Array.isArray(shutdown.listeners) || shutdown.listeners.length !== 0) blocked("M830.shutdown.listeners must be empty.");
  exact(shutdown.worldDocumentWrites, 0, "M830.shutdown.worldDocumentWrites"); exact(shutdown.balladTouched, false, "M830.shutdown.balladTouched");
  exact(shutdown.stopMethod, "exact-owner-force-fallback-after-normal-termination-refusal", "M830.shutdown.stopMethod");

  const limits = record(receipt.limits, "M830.limits");
  exactKeys(limits, ["noInverseControl", "noM819PredicateObservation", "noOtherControl", "onlyFixedProgramSceneControlUsed", "readyClaim", "stage11Accepted", "stage12Entered"], "M830.limits");
  exact(limits.onlyFixedProgramSceneControlUsed, true, "M830.limits.onlyFixedProgramSceneControlUsed"); exact(limits.noM819PredicateObservation, true, "M830.limits.noM819PredicateObservation");
  exact(limits.noInverseControl, true, "M830.limits.noInverseControl"); exact(limits.noOtherControl, true, "M830.limits.noOtherControl");
  exact(limits.stage11Accepted, false, "M830.limits.stage11Accepted"); exact(limits.stage12Entered, false, "M830.limits.stage12Entered"); exact(limits.readyClaim, false, "M830.limits.readyClaim");

  return Object.freeze({
    schemaVersion: PROJECT_STAGE11_FOUNDRY_FORWARD_RECOVERY_EVIDENCE_SCHEMA_VERSION, status: "PASS",
    disposition: "one-producer-scoped-foundry-fixture-forward-recovery-observation",
    observations: Object.freeze([Object.freeze({ milestone: "M830", producer: "foundry.program-scene.forward", lifecycle: "preview-approved-create-unknown-authoritative-recovery-reread" })]) as ProjectStage11FoundryForwardRecoveryEvidenceReceipt["observations"],
    observedLifecycleCount: 1, producerScopedOnly: true, foundryMutationObserved: true, authoritativeReread: true, recoveredFromUnknown: true, noRetry: true, foreignStatePreserved: true,
    readOnly: true, nonCertifying: true, noAuthorityGrant: true, noCoverageClaim: true, noFoundryAuthority: true, noExecutionAuthority: true, noRecoveryAuthority: true, noProjectMutation: true,
    stage11AcceptanceStatus: "blocked", stage12Started: false, readyClaim: false,
  });
}

export const projectStage11FoundryForwardRecoveryEvidenceSchema = Object.freeze({
  parse(input: unknown): ProjectStage11FoundryForwardRecoveryEvidenceReceipt { return createProjectStage11FoundryForwardRecoveryEvidence(input); },
  safeParse(input: unknown) {
    try { return { success: true as const, data: createProjectStage11FoundryForwardRecoveryEvidence(input) }; }
    catch (error) { return { success: false as const, error: error instanceof ProjectStage11FoundryForwardRecoveryEvidenceValidationError ? error : new ProjectStage11FoundryForwardRecoveryEvidenceValidationError(error instanceof Error ? error.message : String(error)) }; }
  },
});
