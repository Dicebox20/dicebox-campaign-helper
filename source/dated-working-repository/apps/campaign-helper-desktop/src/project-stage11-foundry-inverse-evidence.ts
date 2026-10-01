export const PROJECT_STAGE11_FOUNDRY_INVERSE_EVIDENCE_SCHEMA_VERSION = "0.1.0" as const;

export type ProjectStage11FoundryInverseEvidenceReceipt = Readonly<{
  schemaVersion: typeof PROJECT_STAGE11_FOUNDRY_INVERSE_EVIDENCE_SCHEMA_VERSION;
  status: "PASS";
  disposition: "one-producer-scoped-foundry-fixture-observation";
  observations: readonly [Readonly<{
    milestone: "M802";
    producer: "foundry.program-scene.inverse";
    lifecycle: "preview-confirm-apply-authoritative-reread";
  }>];
  observedLifecycleCount: 1;
  producerScopedOnly: true;
  foundryMutationObserved: true;
  foreignStatePreserved: true;
  authoritativeReread: true;
  noRetry: true;
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

export class ProjectStage11FoundryInverseEvidenceValidationError extends Error {
  readonly code = "STAGE11_FOUNDRY_INVERSE_EVIDENCE_VALIDATION_FAILED" as const;
  readonly retryAllowed = false;
  readonly authoritativeRereadRequired = true;

  constructor(message: string) {
    super(message);
    this.name = "ProjectStage11FoundryInverseEvidenceValidationError";
  }
}

function blocked(message: string): never {
  throw new ProjectStage11FoundryInverseEvidenceValidationError(message);
}

function record(value: unknown, label: string): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) blocked(`${label} must be an object.`);
  return value as Record<string, unknown>;
}

function exactKeys(value: Record<string, unknown>, expected: readonly string[], label: string): void {
  const actual = Object.keys(value).sort();
  const required = [...expected].sort();
  if (actual.length !== required.length || actual.some((key, index) => key !== required[index])) blocked(`${label} contains unknown or missing fields.`);
}

function exact(value: unknown, expected: string | number | boolean, label: string): void {
  if (value !== expected) blocked(`${label} must be ${String(expected)}.`);
}

function nonEmptyString(value: unknown, label: string): string {
  if (typeof value !== "string" || value.length === 0) blocked(`${label} must be a non-empty string.`);
  return value;
}

export function createProjectStage11FoundryInverseEvidence(input: unknown): ProjectStage11FoundryInverseEvidenceReceipt {
  const receipt = record(input, "M802 receipt");
  exactKeys(receipt, [
    "actionTimeConfirmation", "authoritativeReread", "currentActiveGm", "deleteInvoked", "deletedScene", "evidenceClass",
    "foreignStatePreserved", "foreignWorldScenesAfter", "foreignWorldScenesBefore", "freshPreview", "milestone", "nextAction",
    "operation", "receiptClosed", "receiptVersion", "readyClaim", "retryPerformed", "sceneDeleted", "stage11Accepted", "stage12Started",
    "status", "supervisorAfter", "target",
  ], "M802 receipt");
  exact(receipt.receiptVersion, 1, "M802.receiptVersion");
  exact(receipt.milestone, "M802", "M802.milestone");
  exact(receipt.operation, "program-scene.inverse.apply", "M802.operation");
  exact(receipt.status, "PASS", "M802.status");
  exact(receipt.evidenceClass, "fixture", "M802.evidenceClass");
  exact(receipt.currentActiveGm, true, "M802.currentActiveGm");
  exact(receipt.freshPreview, "PASS", "M802.freshPreview");
  exact(receipt.actionTimeConfirmation, true, "M802.actionTimeConfirmation");
  exact(receipt.sceneDeleted, true, "M802.sceneDeleted");
  exact(receipt.authoritativeReread, true, "M802.authoritativeReread");
  exact(receipt.foreignWorldScenesBefore, 1, "M802.foreignWorldScenesBefore");
  exact(receipt.foreignWorldScenesAfter, 1, "M802.foreignWorldScenesAfter");
  exact(receipt.foreignStatePreserved, true, "M802.foreignStatePreserved");
  exact(receipt.retryPerformed, false, "M802.retryPerformed");
  exact(receipt.receiptClosed, true, "M802.receiptClosed");
  exact(receipt.stage11Accepted, false, "M802.stage11Accepted");
  exact(receipt.stage12Started, false, "M802.stage12Started");
  exact(receipt.readyClaim, false, "M802.readyClaim");
  nonEmptyString(receipt.nextAction, "M802.nextAction");

  const target = record(receipt.target, "M802.target");
  exactKeys(target, ["foundry", "port", "system", "worldId"], "M802.target");
  exact(target.worldId, "dbx-test-world", "M802.target.worldId");
  exact(target.port, 30003, "M802.target.port");
  exact(target.foundry, "14.367", "M802.target.foundry");
  exact(target.system, "dnd5e@5.3.3", "M802.target.system");

  const deletedScene = record(receipt.deletedScene, "M802.deletedScene");
  exactKeys(deletedScene, ["owned", "stableId"], "M802.deletedScene");
  exact(deletedScene.stableId, "dbx:scene:desktop-shell-fixture", "M802.deletedScene.stableId");
  exact(deletedScene.owned, true, "M802.deletedScene.owned");

  const supervisor = record(receipt.supervisorAfter, "M802.supervisorAfter");
  exactKeys(supervisor, ["balladTouched", "status", "worldDocumentWrites"], "M802.supervisorAfter");
  exact(supervisor.status, "PASS", "M802.supervisorAfter.status");
  exact(supervisor.worldDocumentWrites, 0, "M802.supervisorAfter.worldDocumentWrites");
  exact(supervisor.balladTouched, false, "M802.supervisorAfter.balladTouched");

  return Object.freeze({
    schemaVersion: PROJECT_STAGE11_FOUNDRY_INVERSE_EVIDENCE_SCHEMA_VERSION,
    status: "PASS",
    disposition: "one-producer-scoped-foundry-fixture-observation",
    observations: Object.freeze([
      Object.freeze({ milestone: "M802", producer: "foundry.program-scene.inverse", lifecycle: "preview-confirm-apply-authoritative-reread" }),
    ]) as ProjectStage11FoundryInverseEvidenceReceipt["observations"],
    observedLifecycleCount: 1,
    producerScopedOnly: true,
    foundryMutationObserved: true,
    foreignStatePreserved: true,
    authoritativeReread: true,
    noRetry: true,
    readOnly: true,
    nonCertifying: true,
    noAuthorityGrant: true,
    noCoverageClaim: true,
    noFoundryAuthority: true,
    noExecutionAuthority: true,
    noRecoveryAuthority: true,
    noProjectMutation: true,
    stage11AcceptanceStatus: "blocked",
    stage12Started: false,
    readyClaim: false,
  });
}

export const projectStage11FoundryInverseEvidenceSchema = Object.freeze({
  parse(input: unknown): ProjectStage11FoundryInverseEvidenceReceipt {
    return createProjectStage11FoundryInverseEvidence(input);
  },
  safeParse(input: unknown) {
    try {
      return { success: true as const, data: createProjectStage11FoundryInverseEvidence(input) };
    } catch (error) {
      const validationError = error instanceof ProjectStage11FoundryInverseEvidenceValidationError
        ? error
        : new ProjectStage11FoundryInverseEvidenceValidationError(error instanceof Error ? error.message : String(error));
      return { success: false as const, error: validationError };
    }
  },
});
