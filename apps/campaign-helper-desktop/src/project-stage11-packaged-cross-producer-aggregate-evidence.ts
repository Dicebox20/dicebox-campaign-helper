export const PROJECT_STAGE11_PACKAGED_CROSS_PRODUCER_AGGREGATE_EVIDENCE_SCHEMA_VERSION = "0.1.0" as const;

const RECEIPT = "outputs/m942-stage11-fresh-v5-packaged-desktop-observation-closure-receipt.json" as const;

export type ProjectStage11PackagedCrossProducerAggregateEvidence = Readonly<{
  schemaVersion: typeof PROJECT_STAGE11_PACKAGED_CROSS_PRODUCER_AGGREGATE_EVIDENCE_SCHEMA_VERSION;
  milestone: "M944";
  sourceMilestone: "M942";
  evidenceLabel: "local";
  receipt: typeof RECEIPT;
  operation: "dicebox.project.cross-producer.packaged-conformance";
  target: "dbx:project:desktop-cross-producer-commit-recovery-self-test-v5";
  assetBindingCommitGeneration: 2;
  backupPromotionRestoredGeneration: 2;
  packagedLifecycleObserved: true;
  proposalHistoriesCommitted: true;
  foreignStatePreserved: true;
  noFoundryWrite: true;
  processClosedAndAbsent: true;
  runtimeRetry: false;
  aggregateAttachment: "one-cross-producer-packaged-producer-scoped-non-certifying";
  producerScopedOnly: true;
  readOnly: true;
  nonCertifying: true;
  noAuthorityGrant: true;
  noExecutionAuthority: true;
  noTransitionAuthority: true;
  noGenericExecutor: true;
  noFoundryAuthority: true;
  noForeignProjectMutation: true;
  aggregateAuthority: "not-granted";
  countsChanged: false;
  readyClaim: false;
  stage11AcceptanceStatus: "blocked";
  stage12Started: false;
}>;

export class ProjectStage11PackagedCrossProducerAggregateEvidenceValidationError extends Error {
  readonly code = "STAGE11_PACKAGED_CROSS_PRODUCER_AGGREGATE_EVIDENCE_VALIDATION_FAILED" as const;
  readonly retryAllowed = false;
  constructor(message: string) {
    super(message);
    this.name = "ProjectStage11PackagedCrossProducerAggregateEvidenceValidationError";
  }
}

function blocked(message: string): never {
  throw new ProjectStage11PackagedCrossProducerAggregateEvidenceValidationError(message);
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

function exactArray(value: unknown, expected: readonly string[], label: string): void {
  if (!Array.isArray(value) || value.length !== expected.length || value.some((entry, index) => entry !== expected[index])) blocked(`${label} must retain the exact expected values.`);
}

function validateSourceReceipt(input: unknown): void {
  const receipt = record(input, "M944 M942 packaged closure receipt");
  exactKeys(receipt, ["artifactMatch", "disposition", "doesNotProve", "evidenceClass", "inputs", "limits", "milestone", "nextGate", "observation", "scope", "stage", "status", "validation"], "M944 M942 packaged closure receipt");
  exact(receipt.milestone, "M942", "M944 M942 packaged closure receipt.milestone");
  exact(receipt.stage, "proposal-approval-history", "M944 M942 packaged closure receipt.stage");
  exact(receipt.status, "PASS LOCAL PACKAGED CROSS-PRODUCER SELF-TEST; STAGE 11 NOT ACCEPTED", "M944 M942 packaged closure receipt.status");
  exact(receipt.evidenceClass, "local", "M944 M942 packaged closure receipt.evidenceClass");
  exact(receipt.nextGate, "M943 post-M942 packaged cross-producer observation read-only reconciliation authorization", "M944 M942 packaged closure receipt.nextGate");

  const artifactMatch = record(receipt.artifactMatch, "M944 M942 artifactMatch");
  exactKeys(artifactMatch, ["executableSha256", "exitMode", "mode", "rendererSha256"], "M944 M942 artifactMatch");
  exact(artifactMatch.executableSha256, "D1D8DFC014113E75C020544E35A66A915DD27BB18D00FD551DB4AEDC44BEC79B", "M944 M942 artifactMatch.executableSha256");
  exact(artifactMatch.rendererSha256, "96B75D8E4238D17504B13F7EC03A0D70084DECB51E222C91F87300BF7D90837E", "M944 M942 artifactMatch.rendererSha256");
  exact(artifactMatch.mode, "cross-producer-commit-recovery-ui-v5-execute", "M944 M942 artifactMatch.mode");
  exact(artifactMatch.exitMode, "0", "M944 M942 artifactMatch.exitMode");

  const observation = record(receipt.observation, "M944 M942 observation");
  exactKeys(observation, ["close", "launch", "processAbsence", "selfTestEvidence", "visibleResult"], "M944 M942 observation");
  exact(observation.visibleResult, "PASS: DiceBox Cross-Producer Commit Recovery · dbx:project:desktop-cross-producer-commit-recovery-self-test-v5 · asset.bind committed generation 2 · backup promotion restored generation 2 · foreign state preserved · proposal histories committed · no Foundry write.", "M944 M942 observation.visibleResult");
  exact(observation.selfTestEvidence, "The packaged surface reports a generation-2 asset.bind commit, backup-promotion restoration of generation 2, foreign-state preservation, committed proposal histories, and the no-Foundry-write boundary.", "M944 M942 observation.selfTestEvidence");
  exact(observation.processAbsence, "PASS: no dicebox-campaign-helper-desktop, cargo, or rustc process remained after close.", "M944 M942 observation.processAbsence");
  exact(observation.close, "The exact packaged window was closed once with Alt+F4 after the accessibility read.", "M944 M942 observation.close");

  const disposition = record(receipt.disposition, "M944 M942 disposition");
  exactKeys(disposition, ["next", "preservation", "result"], "M944 M942 disposition");
  exact(disposition.result, "M942 provides directly observed packaged v5 cross-producer lifecycle evidence for the exact test-owned v5 target, but remains producer-scoped and non-certifying.", "M944 M942 disposition.result");
  exact(disposition.preservation, "No retry, cleanup, storage inspection, foreign-state action, provider/credential/account action, or player-password action occurred during M942.", "M944 M942 disposition.preservation");
  exact(disposition.next, "Perform a read-only reconciliation of M942 against the complete Stage 11 matrix and aggregate/current-authority surfaces before any attachment or promotion.", "M944 M942 disposition.next");

  const validation = record(receipt.validation, "M944 M942 validation");
  exactKeys(validation, ["accessibilityRead", "diffCheck", "processReread"], "M944 M942 validation");
  exact(validation.accessibilityRead, "PASS: visible packaged title and exact v5 project identity/lifecycle summary were read from the returned application window.", "M944 M942 validation.accessibilityRead");
  exact(validation.processReread, "PASS: app list and process query showed the exact packaged process absent after close.", "M944 M942 validation.processReread");
  exact(validation.diffCheck, "PASS: no code change was made during M942; prior artifact diff hygiene remains clean.", "M944 M942 validation.diffCheck");

  const limits = record(receipt.limits, "M944 M942 limits");
  exactKeys(limits, ["authoritativeLocalStorageRereadByForeman", "captured", "foreignStateTouched", "launched", "packagedLifecycleObserved", "playerPasswordsGenerated", "projectIdentityObserved", "projectMutatedOrCleaned", "providerOrCredentialActivity", "storageInspected", "visibleWindowRead", "authorityPromoted", "stage11AcceptanceStatus", "stage12Started", "readyClaim"], "M944 M942 limits");
  exact(limits.launched, true, "M944 M942 limits.launched");
  exact(limits.visibleWindowRead, true, "M944 M942 limits.visibleWindowRead");
  exact(limits.packagedLifecycleObserved, true, "M944 M942 limits.packagedLifecycleObserved");
  exact(limits.projectIdentityObserved, true, "M944 M942 limits.projectIdentityObserved");
  exact(limits.authoritativeLocalStorageRereadByForeman, false, "M944 M942 limits.authoritativeLocalStorageRereadByForeman");
  exact(limits.captured, false, "M944 M942 limits.captured");
  exact(limits.storageInspected, false, "M944 M942 limits.storageInspected");
  exact(limits.projectMutatedOrCleaned, false, "M944 M942 limits.projectMutatedOrCleaned");
  exact(limits.providerOrCredentialActivity, false, "M944 M942 limits.providerOrCredentialActivity");
  exact(limits.playerPasswordsGenerated, false, "M944 M942 limits.playerPasswordsGenerated");
  exact(limits.foreignStateTouched, false, "M944 M942 limits.foreignStateTouched");
  exact(limits.authorityPromoted, false, "M944 M942 limits.authorityPromoted");
  exact(limits.stage11AcceptanceStatus, "blocked", "M944 M942 limits.stage11AcceptanceStatus");
  exact(limits.stage12Started, false, "M944 M942 limits.stage12Started");
  exact(limits.readyClaim, false, "M944 M942 limits.readyClaim");

  exactArray(receipt.doesNotProve, ["aggregate current authority across all producer families", "Foreman independent storage reread or Stage 11 acceptance", "Foundry, active-GM, player, provider, credential, or account behavior", "Stage 12 entry", "Ready-to-Play"], "M944 M942 doesNotProve");
}

export function createProjectStage11PackagedCrossProducerAggregateEvidence(input: unknown): ProjectStage11PackagedCrossProducerAggregateEvidence {
  validateSourceReceipt(input);
  const receipt = record(input, "M944 packaged cross-producer aggregate input");
  const artifactMatch = record(receipt.artifactMatch, "M944 packaged cross-producer aggregate input.artifactMatch");
  const observation = record(receipt.observation, "M944 packaged cross-producer aggregate input.observation");
  const limits = record(receipt.limits, "M944 packaged cross-producer aggregate input.limits");
  exact(limits.packagedLifecycleObserved, true, "M944 packaged cross-producer aggregate input.limits.packagedLifecycleObserved");
  exact(limits.projectIdentityObserved, true, "M944 packaged cross-producer aggregate input.limits.projectIdentityObserved");
  exact(limits.authorityPromoted, false, "M944 packaged cross-producer aggregate input.limits.authorityPromoted");
  exact(limits.stage11AcceptanceStatus, "blocked", "M944 packaged cross-producer aggregate input.limits.stage11AcceptanceStatus");
  exact(limits.stage12Started, false, "M944 packaged cross-producer aggregate input.limits.stage12Started");
  exact(limits.readyClaim, false, "M944 packaged cross-producer aggregate input.limits.readyClaim");
  exact(limits.foreignStateTouched, false, "M944 packaged cross-producer aggregate input.limits.foreignStateTouched");
  exact(limits.playerPasswordsGenerated, false, "M944 packaged cross-producer aggregate input.limits.playerPasswordsGenerated");
  exact(limits.providerOrCredentialActivity, false, "M944 packaged cross-producer aggregate input.limits.providerOrCredentialActivity");
  exact(artifactMatch.mode, "cross-producer-commit-recovery-ui-v5-execute", "M944 packaged cross-producer aggregate input.artifactMatch.mode");
  exact(artifactMatch.exitMode, "0", "M944 packaged cross-producer aggregate input.artifactMatch.exitMode");
  exact(observation.visibleResult, "PASS: DiceBox Cross-Producer Commit Recovery · dbx:project:desktop-cross-producer-commit-recovery-self-test-v5 · asset.bind committed generation 2 · backup promotion restored generation 2 · foreign state preserved · proposal histories committed · no Foundry write.", "M944 packaged cross-producer aggregate input.observation.visibleResult");
  return Object.freeze({
    schemaVersion: PROJECT_STAGE11_PACKAGED_CROSS_PRODUCER_AGGREGATE_EVIDENCE_SCHEMA_VERSION,
    milestone: "M944",
    sourceMilestone: "M942",
    evidenceLabel: "local",
    receipt: RECEIPT,
    operation: "dicebox.project.cross-producer.packaged-conformance",
    target: "dbx:project:desktop-cross-producer-commit-recovery-self-test-v5",
    assetBindingCommitGeneration: 2,
    backupPromotionRestoredGeneration: 2,
    packagedLifecycleObserved: true,
    proposalHistoriesCommitted: true,
    foreignStatePreserved: true,
    noFoundryWrite: true,
    processClosedAndAbsent: true,
    runtimeRetry: false,
    aggregateAttachment: "one-cross-producer-packaged-producer-scoped-non-certifying",
    producerScopedOnly: true,
    readOnly: true,
    nonCertifying: true,
    noAuthorityGrant: true,
    noExecutionAuthority: true,
    noTransitionAuthority: true,
    noGenericExecutor: true,
    noFoundryAuthority: true,
    noForeignProjectMutation: true,
    aggregateAuthority: "not-granted",
    countsChanged: false,
    readyClaim: false,
    stage11AcceptanceStatus: "blocked",
    stage12Started: false,
  });
}
