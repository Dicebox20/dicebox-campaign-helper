export const PROJECT_STAGE11_UPDATE_WITNESS_EVIDENCE_SCHEMA_VERSION = "0.1.0" as const;

export type ProjectStage11UpdateWitnessEvidenceReceipt = Readonly<{
  schemaVersion: typeof PROJECT_STAGE11_UPDATE_WITNESS_EVIDENCE_SCHEMA_VERSION;
  status: "PASS";
  disposition: "one-producer-scoped-foundry-fixture-update-and-independent-reread-observation";
  observations: readonly [Readonly<{
    milestones: readonly ["M848", "M854"];
    producer: "foundry.program-scene.update-witness";
    lifecycle: "preview-approved-update-authoritative-reread-restore-reread-independent-no-write-reread";
  }>];
  observedLifecycleCount: 1;
  producerScopedOnly: true;
  foundryMutationObserved: true;
  foreignStatePreserved: true;
  authoritativeReread: true;
  restorationReread: true;
  independentNoWriteReread: true;
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

export class ProjectStage11UpdateWitnessEvidenceValidationError extends Error {
  readonly code = "STAGE11_UPDATE_WITNESS_EVIDENCE_VALIDATION_FAILED" as const;
  readonly retryAllowed = false;
  constructor(message: string) { super(message); this.name = "ProjectStage11UpdateWitnessEvidenceValidationError"; }
}
function blocked(message: string): never { throw new ProjectStage11UpdateWitnessEvidenceValidationError(message); }
function record(value: unknown, label: string): Record<string, unknown> { if (!value || typeof value !== "object" || Array.isArray(value)) blocked(`${label} must be an object.`); return value as Record<string, unknown>; }
function exact(value: unknown, expected: string | number | boolean, label: string): void { if (value !== expected) blocked(`${label} must be ${String(expected)}.`); }
function exactKeys(value: Record<string, unknown>, expected: readonly string[], label: string): void { const actual = Object.keys(value).sort(); const required = [...expected].sort(); if (actual.length !== required.length || actual.some((key, index) => key !== required[index])) blocked(`${label} contains unknown or missing fields.`); }

function validateFixture(value: unknown, label: string): void {
  const fixture = record(value, label);
  exactKeys(fixture, ["dataRoot", "foundry", "password", "port", "system", "user", "worldId"], label);
  exact(fixture.dataRoot, "work/foundry-fixture-data-v4", `${label}.dataRoot`); exact(fixture.worldId, "dbx-test-world", `${label}.worldId`); exact(fixture.port, 30003, `${label}.port`); exact(fixture.foundry, "14.367", `${label}.foundry`); exact(fixture.system, "dnd5e 5.3.3", `${label}.system`); exact(fixture.user, "Gamemaster", `${label}.user`); exact(fixture.password, "blank", `${label}.password`);
}
function validateClosure(value: unknown, label: string): void { const closure = record(value, label); exactKeys(closure, ["balladTouched", "finalFixtureStatus", "tabClosed", "worldDocumentWrites"], label); exact(closure.tabClosed, true, `${label}.tabClosed`); exact(closure.finalFixtureStatus, "STOPPED/no listener", `${label}.finalFixtureStatus`); exact(closure.worldDocumentWrites, 0, `${label}.worldDocumentWrites`); exact(closure.balladTouched, false, `${label}.balladTouched`); }

export function createProjectStage11UpdateWitnessEvidence(updateInput: unknown, rereadInput: unknown): ProjectStage11UpdateWitnessEvidenceReceipt {
  const update = record(updateInput, "M848 receipt");
  exactKeys(update, ["apply", "closure", "control", "evidenceClass", "fixture", "independentReread", "milestone", "operation", "preview", "readyClaim", "receiptVersion", "sourceAndStagedProgramSceneSha256", "stage11AcceptanceStatus", "stage12Started", "status"], "M848 receipt");
  exact(update.receiptVersion, 1, "M848.receiptVersion"); exact(update.milestone, "M848", "M848.milestone"); exact(update.operation, "program-scene.update-witness.apply", "M848.operation"); exact(update.status, "PARTIAL", "M848.status"); exact(update.evidenceClass, "fixture", "M848.evidenceClass"); exact(update.stage11AcceptanceStatus, "blocked", "M848.stage11AcceptanceStatus"); exact(update.stage12Started, false, "M848.stage12Started"); exact(update.readyClaim, false, "M848.readyClaim"); validateFixture(update.fixture, "M848.fixture");
  const updateControl = record(update.control, "M848.control"); exactKeys(updateControl, ["label", "visibleToGamemaster"], "M848.control"); exact(updateControl.label, "Run DiceBox owned-Scene update witness", "M848.control.label"); exact(updateControl.visibleToGamemaster, true, "M848.control.visibleToGamemaster");
  const preview = record(update.preview, "M848.preview"); exactKeys(preview, ["activeGMPassed", "baseline", "noWrite", "operation", "stableId", "status"], "M848.preview"); exact(preview.status, "PASS", "M848.preview.status"); exact(preview.operation, "program-scene.update-witness.preview", "M848.preview.operation"); exact(preview.noWrite, true, "M848.preview.noWrite"); exact(preview.stableId, "dbx:scene:desktop-shell-fixture", "M848.preview.stableId"); exact(preview.baseline, "absent", "M848.preview.baseline"); exact(preview.activeGMPassed, true, "M848.preview.activeGMPassed");
  const apply = record(update.apply, "M848.apply"); exactKeys(apply, ["authoritativeReread", "foreignStatePreserved", "managedField", "noWrite", "readyClaim", "restorationReread", "retryPerformed", "stableId", "stage11Accepted", "stage12Started", "status", "updateInvoked"], "M848.apply"); exact(apply.status, "PASS", "M848.apply.status"); exact(apply.noWrite, false, "M848.apply.noWrite"); exact(apply.stableId, "dbx:scene:desktop-shell-fixture", "M848.apply.stableId"); exact(apply.managedField, "dicebox-campaign-helper.stage11UpdateWitness", "M848.apply.managedField"); for (const field of ["updateInvoked", "authoritativeReread", "restorationReread", "foreignStatePreserved"] as const) exact(apply[field], true, `M848.apply.${field}`); exact(apply.retryPerformed, false, "M848.apply.retryPerformed"); exact(apply.stage11Accepted, false, "M848.apply.stage11Accepted"); exact(apply.stage12Started, false, "M848.apply.stage12Started"); exact(apply.readyClaim, false, "M848.apply.readyClaim");
  const unavailable = record(update.independentReread, "M848.independentReread"); exactKeys(unavailable, ["method", "reason", "status"], "M848.independentReread"); exact(unavailable.status, "UNAVAILABLE", "M848.independentReread.status"); validateClosure(update.closure, "M848.closure");
  const reread = record(rereadInput, "M854 receipt");
  exactKeys(reread, ["closure", "control", "evidenceClass", "fixture", "milestone", "observation", "operation", "readyClaim", "receiptVersion", "sourceAndStagedProgramSceneSha256", "stage11AcceptanceStatus", "stage12Started", "status"], "M854 receipt"); exact(reread.receiptVersion, 1, "M854.receiptVersion"); exact(reread.milestone, "M854", "M854.milestone"); exact(reread.operation, "program-scene.update-witness.reread", "M854.operation"); exact(reread.status, "PASS", "M854.status"); exact(reread.evidenceClass, "fixture", "M854.evidenceClass"); exact(reread.stage11AcceptanceStatus, "blocked", "M854.stage11AcceptanceStatus"); exact(reread.stage12Started, false, "M854.stage12Started"); exact(reread.readyClaim, false, "M854.readyClaim"); validateFixture(reread.fixture, "M854.fixture");
  const rereadControl = record(reread.control, "M854.control"); exactKeys(rereadControl, ["label", "visibleToGamemaster"], "M854.control"); exact(rereadControl.label, "Show DiceBox owned-Scene witness reread", "M854.control.label"); exact(rereadControl.visibleToGamemaster, true, "M854.control.visibleToGamemaster");
  const observation = record(reread.observation, "M854.observation"); exactKeys(observation, ["authoritativeReread", "complete", "counts", "foreignWorldScenes", "noGenericQuery", "noUpdateInvoked", "noWrite", "readyClaim", "retryPerformed", "stableId", "stage11Accepted", "stage12Started", "status", "updateWitnessBaseline"], "M854.observation"); exact(observation.status, "OBSERVED", "M854.observation.status"); exact(observation.noWrite, true, "M854.observation.noWrite"); exact(observation.stableId, "dbx:scene:desktop-shell-fixture", "M854.observation.stableId"); exact(observation.complete, true, "M854.observation.complete"); exact(observation.updateWitnessBaseline, "absent", "M854.observation.updateWitnessBaseline"); exact(observation.foreignWorldScenes, 1, "M854.observation.foreignWorldScenes"); for (const field of ["authoritativeReread", "noGenericQuery", "noUpdateInvoked"] as const) exact(observation[field], true, `M854.observation.${field}`); exact(observation.retryPerformed, false, "M854.observation.retryPerformed"); exact(observation.stage11Accepted, false, "M854.observation.stage11Accepted"); exact(observation.stage12Started, false, "M854.observation.stage12Started"); exact(observation.readyClaim, false, "M854.observation.readyClaim"); const counts = record(observation.counts, "M854.observation.counts"); exactKeys(counts, ["regions", "tiles", "walls"], "M854.observation.counts"); exact(counts.walls, 5, "M854.observation.counts.walls"); exact(counts.regions, 2, "M854.observation.counts.regions"); exact(counts.tiles, 1, "M854.observation.counts.tiles"); validateClosure(reread.closure, "M854.closure");
  return Object.freeze({ schemaVersion: PROJECT_STAGE11_UPDATE_WITNESS_EVIDENCE_SCHEMA_VERSION, status: "PASS", disposition: "one-producer-scoped-foundry-fixture-update-and-independent-reread-observation", observations: Object.freeze([Object.freeze({ milestones: Object.freeze(["M848", "M854"]) as readonly ["M848", "M854"], producer: "foundry.program-scene.update-witness", lifecycle: "preview-approved-update-authoritative-reread-restore-reread-independent-no-write-reread" })]) as ProjectStage11UpdateWitnessEvidenceReceipt["observations"], observedLifecycleCount: 1, producerScopedOnly: true, foundryMutationObserved: true, foreignStatePreserved: true, authoritativeReread: true, restorationReread: true, independentNoWriteReread: true, noRetry: true, readOnly: true, nonCertifying: true, noAuthorityGrant: true, noCoverageClaim: true, noFoundryAuthority: true, noExecutionAuthority: true, noRecoveryAuthority: true, noProjectMutation: true, stage11AcceptanceStatus: "blocked", stage12Started: false, readyClaim: false });
}
