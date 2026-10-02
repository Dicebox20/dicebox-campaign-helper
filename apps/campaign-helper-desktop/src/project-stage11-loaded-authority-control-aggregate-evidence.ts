export const PROJECT_STAGE11_LOADED_AUTHORITY_CONTROL_AGGREGATE_EVIDENCE_SCHEMA_VERSION = "0.1.0" as const;

const RECEIPT = "outputs/m952-stage11-exact-v4-loaded-module-authority-control-observation-closure-receipt.json" as const;

export type ProjectStage11LoadedAuthorityControlAggregateEvidence = Readonly<{
  schemaVersion: typeof PROJECT_STAGE11_LOADED_AUTHORITY_CONTROL_AGGREGATE_EVIDENCE_SCHEMA_VERSION;
  milestone: "M953";
  sourceMilestone: "M952";
  evidenceLabel: "local";
  receipt: typeof RECEIPT;
  operation: "dicebox.foundry.loaded-authority-controls";
  target: Readonly<{
    worldId: "dbx-test-world";
    foundryVersion: "14.367";
    systemId: "dnd5e";
    systemVersion: "5.3.3";
    port: 30003;
  }>;
  currentUserIsGm: true;
  currentUserMatchesActiveGm: true;
  ownedSceneCanUpdate: true;
  controlsObserved: 2;
  moduleExecutionObserved: true;
  noWrite: true;
  noUpdateInvoked: true;
  noGenericAuthorityClaim: true;
  noExecutionAuthority: true;
  noAuthorityGrant: true;
  noFoundryWrite: true;
  producerScopedOnly: true;
  foreignStatePreserved: true;
  readOnly: true;
  nonCertifying: true;
  aggregateAttachment: "one-loaded-authority-control-producer-scoped-non-certifying";
  aggregateAuthority: "not-granted";
  cleanShutdown: true;
  countsChanged: false;
  playerPasswordEntered: false;
  readyClaim: false;
  stage11AcceptanceStatus: "blocked";
  stage12Started: false;
}>;

export class ProjectStage11LoadedAuthorityControlAggregateEvidenceValidationError extends Error {
  readonly code = "STAGE11_LOADED_AUTHORITY_CONTROL_AGGREGATE_EVIDENCE_VALIDATION_FAILED" as const;
  readonly retryAllowed = false;
  constructor(message: string) {
    super(message);
    this.name = "ProjectStage11LoadedAuthorityControlAggregateEvidenceValidationError";
  }
}

function blocked(message: string): never {
  throw new ProjectStage11LoadedAuthorityControlAggregateEvidenceValidationError(message);
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
  const receipt = record(input, "M953 M952 loaded-authority-control closure receipt");
  exactKeys(receipt, ["milestone", "stage", "status", "evidenceClass", "scope", "target", "clientSession", "diagnostics", "close", "reconciliation", "limits", "doesNotProve", "next", "receiptVersion"], "M953 M952 loaded-authority-control closure receipt");
  exact(receipt.milestone, "M952", "M953 M952 receipt.milestone");
  exact(receipt.stage, "proposal-approval-history", "M953 M952 receipt.stage");
  exact(receipt.status, "PASS LOADED AUTHORITY DIAGNOSTICS OBSERVED; AGGREGATE NOT GRANTED; STAGE 11 NOT ACCEPTED", "M953 M952 receipt.status");
  exact(receipt.evidenceClass, "local", "M953 M952 receipt.evidenceClass");
  exact(receipt.scope, "Use one exact disposable v4 client session to observe package-loaded authority controls and their redacted read-only receipts, then close and reread the fixture without document mutation.", "M953 M952 receipt.scope");
  exact(receipt.next, "Run only the authorized M953 strict typed aggregate attachment of this exact producer-scoped runtime observation.", "M953 M952 receipt.next");
  exact(receipt.receiptVersion, "0.1.0", "M953 M952 receipt.receiptVersion");

  const target = record(receipt.target, "M953 M952 target");
  exactKeys(target, ["dataPath", "worldId", "foundryVersion", "systemId", "systemVersion", "foundryEntry", "port", "adminPasswordConfigured", "fixturePid"], "M953 M952 target");
  exact(target.dataPath, "C:\\Users\\rujie\\Documents\\Codex\\2026-08-20\\dicebox-campaign-helper\\work\\foundry-fixture-data-v4", "M953 M952 target.dataPath");
  exact(target.worldId, "dbx-test-world", "M953 M952 target.worldId");
  exact(target.foundryVersion, "14.367", "M953 M952 target.foundryVersion");
  exact(target.systemId, "dnd5e", "M953 M952 target.systemId");
  exact(target.systemVersion, "5.3.3", "M953 M952 target.systemVersion");
  exact(target.foundryEntry, "C:\\Program Files\\Foundry Virtual Tabletop\\resources\\app\\main.mjs", "M953 M952 target.foundryEntry");
  exact(target.port, 30003, "M953 M952 target.port");
  exact(target.adminPasswordConfigured, false, "M953 M952 target.adminPasswordConfigured");
  exact(target.fixturePid, 2468, "M953 M952 target.fixturePid");

  const clientSession = record(receipt.clientSession, "M953 M952 clientSession");
  exactKeys(clientSession, ["status", "url", "title", "user", "role", "passwordEntered", "moduleExecution", "controlPresence", "outerWindowNote"], "M953 M952 clientSession");
  exact(clientSession.status, "OBSERVED", "M953 M952 clientSession.status");
  exact(clientSession.url, "http://127.0.0.1:30003/game", "M953 M952 clientSession.url");
  exact(clientSession.title, "Foundry Virtual Tabletop", "M953 M952 clientSession.title");
  exact(clientSession.user, "Gamemaster", "M953 M952 clientSession.user");
  exact(clientSession.role, "GM", "M953 M952 clientSession.role");
  exact(clientSession.passwordEntered, false, "M953 M952 clientSession.passwordEntered");
  exact(clientSession.moduleExecution, "OBSERVED_BY_EXACT_CONTROL_REGISTRATION", "M953 M952 clientSession.moduleExecution");
  exact(clientSession.outerWindowNote, "The client reported an outer 1280x720 window below Foundry's 1024x768 minimum; the DOM still exposed the exact controls. A temporary viewport override was reset before closure.", "M953 M952 clientSession.outerWindowNote");

  const controlPresence = record(clientSession.controlPresence, "M953 M952 clientSession.controlPresence");
  exactKeys(controlPresence, ["currentActiveGm", "ownedScenePermission"], "M953 M952 clientSession.controlPresence");
  const currentControl = record(controlPresence.currentActiveGm, "M953 M952 currentActiveGm control");
  exactKeys(currentControl, ["controlId", "title", "visible", "button"], "M953 M952 currentActiveGm control");
  exact(currentControl.controlId, "dicebox-current-active-gm-authority-diagnostic", "M953 M952 currentActiveGm control.controlId");
  exact(currentControl.title, "Show DiceBox Current Active-GM Diagnostic", "M953 M952 currentActiveGm control.title");
  exact(currentControl.visible, true, "M953 M952 currentActiveGm control.visible");
  exact(currentControl.button, true, "M953 M952 currentActiveGm control.button");
  const ownedControl = record(controlPresence.ownedScenePermission, "M953 M952 ownedScenePermission control");
  exactKeys(ownedControl, ["controlId", "title", "visible", "button"], "M953 M952 ownedScenePermission control");
  exact(ownedControl.controlId, "dicebox-owned-scene-permission-diagnostic", "M953 M952 ownedScenePermission control.controlId");
  exact(ownedControl.title, "Show DiceBox Owned-Scene Permission Diagnostic", "M953 M952 ownedScenePermission control.title");
  exact(ownedControl.visible, true, "M953 M952 ownedScenePermission control.visible");
  exact(ownedControl.button, true, "M953 M952 ownedScenePermission control.button");

  const diagnostics = record(receipt.diagnostics, "M953 M952 diagnostics");
  exactKeys(diagnostics, ["currentActiveGm", "ownedScenePermission"], "M953 M952 diagnostics");
  const currentDiagnostic = record(diagnostics.currentActiveGm, "M953 M952 currentActiveGm diagnostic");
  exactKeys(currentDiagnostic, ["schemaVersion", "operation", "status", "evidenceClass", "target", "currentUserIsGm", "currentUserMatchesActiveGm", "redacted", "noWrite", "noPermissionClaim", "noExecutionAuthority", "readyClaim", "remainingBlockers"], "M953 M952 currentActiveGm diagnostic");
  exact(currentDiagnostic.schemaVersion, "0.1.0", "M953 M952 currentActiveGm diagnostic.schemaVersion");
  exact(currentDiagnostic.operation, "dicebox.current-active-gm-authority.diagnostic", "M953 M952 currentActiveGm diagnostic.operation");
  exact(currentDiagnostic.status, "OBSERVED", "M953 M952 currentActiveGm diagnostic.status");
  exact(currentDiagnostic.evidenceClass, "runtime-observation", "M953 M952 currentActiveGm diagnostic.evidenceClass");
  exact(currentDiagnostic.currentUserIsGm, true, "M953 M952 currentActiveGm diagnostic.currentUserIsGm");
  exact(currentDiagnostic.currentUserMatchesActiveGm, true, "M953 M952 currentActiveGm diagnostic.currentUserMatchesActiveGm");
  exact(currentDiagnostic.redacted, true, "M953 M952 currentActiveGm diagnostic.redacted");
  exact(currentDiagnostic.noWrite, true, "M953 M952 currentActiveGm diagnostic.noWrite");
  exact(currentDiagnostic.noPermissionClaim, true, "M953 M952 currentActiveGm diagnostic.noPermissionClaim");
  exact(currentDiagnostic.noExecutionAuthority, true, "M953 M952 currentActiveGm diagnostic.noExecutionAuthority");
  exact(currentDiagnostic.readyClaim, false, "M953 M952 currentActiveGm diagnostic.readyClaim");
  const currentTarget = record(currentDiagnostic.target, "M953 M952 currentActiveGm diagnostic.target");
  exactKeys(currentTarget, ["foundryVersion", "systemId", "systemVersion"], "M953 M952 currentActiveGm diagnostic.target");
  exact(currentTarget.foundryVersion, "14.367", "M953 M952 currentActiveGm diagnostic.target.foundryVersion");
  exact(currentTarget.systemId, "dnd5e", "M953 M952 currentActiveGm diagnostic.target.systemId");
  exact(currentTarget.systemVersion, "5.3.3", "M953 M952 currentActiveGm diagnostic.target.systemVersion");
  exactArray(currentDiagnostic.remainingBlockers, ["This snapshot does not probe or prove document-write permission, proposal authority, execution authority, or Stage 11 acceptance."], "M953 M952 currentActiveGm diagnostic.remainingBlockers");

  const ownedDiagnostic = record(diagnostics.ownedScenePermission, "M953 M952 ownedScenePermission diagnostic");
  exactKeys(ownedDiagnostic, ["schemaVersion", "operation", "status", "evidenceClass", "target", "stableId", "ownedSceneCanUpdate", "redacted", "noWrite", "noUpdateInvoked", "noGenericAuthorityClaim", "noExecutionAuthority", "readyClaim", "remainingBlockers"], "M953 M952 ownedScenePermission diagnostic");
  exact(ownedDiagnostic.schemaVersion, "0.1.0", "M953 M952 ownedScenePermission diagnostic.schemaVersion");
  exact(ownedDiagnostic.operation, "dicebox.owned-scene-permission.diagnostic", "M953 M952 ownedScenePermission diagnostic.operation");
  exact(ownedDiagnostic.status, "OBSERVED", "M953 M952 ownedScenePermission diagnostic.status");
  exact(ownedDiagnostic.evidenceClass, "runtime-observation", "M953 M952 ownedScenePermission diagnostic.evidenceClass");
  exact(ownedDiagnostic.stableId, "dbx:scene:desktop-shell-fixture", "M953 M952 ownedScenePermission diagnostic.stableId");
  exact(ownedDiagnostic.ownedSceneCanUpdate, true, "M953 M952 ownedScenePermission diagnostic.ownedSceneCanUpdate");
  exact(ownedDiagnostic.redacted, true, "M953 M952 ownedScenePermission diagnostic.redacted");
  exact(ownedDiagnostic.noWrite, true, "M953 M952 ownedScenePermission diagnostic.noWrite");
  exact(ownedDiagnostic.noUpdateInvoked, true, "M953 M952 ownedScenePermission diagnostic.noUpdateInvoked");
  exact(ownedDiagnostic.noGenericAuthorityClaim, true, "M953 M952 ownedScenePermission diagnostic.noGenericAuthorityClaim");
  exact(ownedDiagnostic.noExecutionAuthority, true, "M953 M952 ownedScenePermission diagnostic.noExecutionAuthority");
  exact(ownedDiagnostic.readyClaim, false, "M953 M952 ownedScenePermission diagnostic.readyClaim");
  const ownedTarget = record(ownedDiagnostic.target, "M953 M952 ownedScenePermission diagnostic.target");
  exactKeys(ownedTarget, ["worldId", "foundryVersion", "systemId", "systemVersion", "port"], "M953 M952 ownedScenePermission diagnostic.target");
  exact(ownedTarget.worldId, "dbx-test-world", "M953 M952 ownedScenePermission diagnostic.target.worldId");
  exact(ownedTarget.foundryVersion, "14.367", "M953 M952 ownedScenePermission diagnostic.target.foundryVersion");
  exact(ownedTarget.systemId, "dnd5e", "M953 M952 ownedScenePermission diagnostic.target.systemId");
  exact(ownedTarget.systemVersion, "5.3.3", "M953 M952 ownedScenePermission diagnostic.target.systemVersion");
  exact(ownedTarget.port, 30003, "M953 M952 ownedScenePermission diagnostic.target.port");
  exactArray(ownedDiagnostic.remainingBlockers, ["This records only one owned Scene canUserModify(update) predicate. It does not invoke or prove update execution, proposal authority, generic or every-document authority, Stage 11 acceptance, Stage 12 entry, or Ready-to-Play."], "M953 M952 ownedScenePermission diagnostic.remainingBlockers");

  const close = record(receipt.close, "M953 M952 close");
  exactKeys(close, ["status", "processPid", "ownershipEvidence", "forcedTerminationRequired", "finalReread"], "M953 M952 close");
  exact(close.status, "PASS", "M953 M952 close.status");
  exact(close.processPid, 2468, "M953 M952 close.processPid");
  exact(close.ownershipEvidence, "exact-process-and-exclusive-port", "M953 M952 close.ownershipEvidence");
  exact(close.forcedTerminationRequired, true, "M953 M952 close.forcedTerminationRequired");
  const finalReread = record(close.finalReread, "M953 M952 close.finalReread");
  exactKeys(finalReread, ["status", "listeners", "stateStatus", "stoppedAt", "worldDocumentWrites", "balladTouched"], "M953 M952 close.finalReread");
  exact(finalReread.status, "STOPPED", "M953 M952 close.finalReread.status");
  exactArray(finalReread.listeners, [], "M953 M952 close.finalReread.listeners");
  exact(finalReread.stateStatus, "stopped", "M953 M952 close.finalReread.stateStatus");
  exact(finalReread.stoppedAt, "2026-09-01T18:14:47.887Z", "M953 M952 close.finalReread.stoppedAt");
  exact(finalReread.worldDocumentWrites, 0, "M953 M952 close.finalReread.worldDocumentWrites");
  exact(finalReread.balladTouched, false, "M953 M952 close.finalReread.balladTouched");

  const reconciliation = record(receipt.reconciliation, "M953 M952 reconciliation");
  exactKeys(reconciliation, ["packageLoaded", "currentActiveGm", "ownedScenePermission", "currentAuthority", "aggregateAuthority", "runtimeLane", "stage11", "stage12", "readyClaim"], "M953 M952 reconciliation");
  exact(reconciliation.packageLoaded, "OBSERVED_BY_EXACT_CONTROLS", "M953 M952 reconciliation.packageLoaded");
  exact(reconciliation.currentActiveGm, "ONE_REDACTED_PRODUCER_SCOPED_OBSERVATION", "M953 M952 reconciliation.currentActiveGm");
  exact(reconciliation.ownedScenePermission, "ONE_REDACTED_PRODUCER_SCOPED_OBSERVATION", "M953 M952 reconciliation.ownedScenePermission");
  exact(reconciliation.currentAuthority, "PARTIAL", "M953 M952 reconciliation.currentAuthority");
  exact(reconciliation.aggregateAuthority, "NOT_GRANTED", "M953 M952 reconciliation.aggregateAuthority");
  exact(reconciliation.runtimeLane, "PARKED", "M953 M952 reconciliation.runtimeLane");
  exact(reconciliation.stage11, "BLOCKED", "M953 M952 reconciliation.stage11");
  exact(reconciliation.stage12, "LOCKED", "M953 M952 reconciliation.stage12");
  exact(reconciliation.readyClaim, false, "M953 M952 reconciliation.readyClaim");

  const limits = record(receipt.limits, "M953 M952 limits");
  exactKeys(limits, ["fixtureSessions", "diagnosticControlsObserved", "browserOrDesktopInput", "documentWrites", "documentUpdateInvoked", "genericExecutor", "defaultDataPathUsed", "userWorldTouched", "packageInstalled", "projectMutatedOrCleaned", "providerOrCredentialActivity", "playerPasswordsGenerated", "playerPasswordEntered", "foreignStateTouched", "authorityPromoted", "stage11AcceptanceStatus", "stage12Started", "readyClaim"], "M953 M952 limits");
  exact(limits.fixtureSessions, 1, "M953 M952 limits.fixtureSessions");
  exact(limits.diagnosticControlsObserved, 2, "M953 M952 limits.diagnosticControlsObserved");
  exact(limits.browserOrDesktopInput, true, "M953 M952 limits.browserOrDesktopInput");
  exact(limits.documentWrites, 0, "M953 M952 limits.documentWrites");
  exact(limits.documentUpdateInvoked, false, "M953 M952 limits.documentUpdateInvoked");
  exact(limits.genericExecutor, false, "M953 M952 limits.genericExecutor");
  exact(limits.defaultDataPathUsed, false, "M953 M952 limits.defaultDataPathUsed");
  exact(limits.userWorldTouched, false, "M953 M952 limits.userWorldTouched");
  exact(limits.packageInstalled, false, "M953 M952 limits.packageInstalled");
  exact(limits.projectMutatedOrCleaned, false, "M953 M952 limits.projectMutatedOrCleaned");
  exact(limits.providerOrCredentialActivity, false, "M953 M952 limits.providerOrCredentialActivity");
  exact(limits.playerPasswordsGenerated, false, "M953 M952 limits.playerPasswordsGenerated");
  exact(limits.playerPasswordEntered, false, "M953 M952 limits.playerPasswordEntered");
  exact(limits.foreignStateTouched, false, "M953 M952 limits.foreignStateTouched");
  exact(limits.authorityPromoted, false, "M953 M952 limits.authorityPromoted");
  exact(limits.stage11AcceptanceStatus, "blocked", "M953 M952 limits.stage11AcceptanceStatus");
  exact(limits.stage12Started, false, "M953 M952 limits.stage12Started");
  exact(limits.readyClaim, false, "M953 M952 limits.readyClaim");
  exactArray(receipt.doesNotProve, ["generic or every-document authority", "document update execution or proposal application", "aggregate current authority or complete cross-producer continuity", "Stage 11 acceptance", "Stage 12 entry", "Ready-to-Play"], "M953 M952 doesNotProve");
}

export function createProjectStage11LoadedAuthorityControlAggregateEvidence(input: unknown): ProjectStage11LoadedAuthorityControlAggregateEvidence {
  validateSourceReceipt(input);
  const receipt = record(input, "M953 loaded-authority-control aggregate input");
  const target = record(receipt.target, "M953 loaded-authority-control aggregate input.target");
  const clientSession = record(receipt.clientSession, "M953 loaded-authority-control aggregate input.clientSession");
  const controlPresence = record(clientSession.controlPresence, "M953 loaded-authority-control aggregate input.clientSession.controlPresence");
  const diagnostics = record(receipt.diagnostics, "M953 loaded-authority-control aggregate input.diagnostics");
  const currentDiagnostic = record(diagnostics.currentActiveGm, "M953 loaded-authority-control aggregate input.diagnostics.currentActiveGm");
  const ownedDiagnostic = record(diagnostics.ownedScenePermission, "M953 loaded-authority-control aggregate input.diagnostics.ownedScenePermission");
  const close = record(receipt.close, "M953 loaded-authority-control aggregate input.close");
  const finalReread = record(close.finalReread, "M953 loaded-authority-control aggregate input.close.finalReread");
  const limits = record(receipt.limits, "M953 loaded-authority-control aggregate input.limits");
  exact(clientSession.passwordEntered, false, "M953 aggregate input.clientSession.passwordEntered");
  exact(clientSession.moduleExecution, "OBSERVED_BY_EXACT_CONTROL_REGISTRATION", "M953 aggregate input.clientSession.moduleExecution");
  exact(Object.keys(controlPresence).length, 2, "M953 aggregate input.clientSession.controlPresence");
  exact(currentDiagnostic.currentUserIsGm, true, "M953 aggregate input.currentDiagnostic.currentUserIsGm");
  exact(currentDiagnostic.currentUserMatchesActiveGm, true, "M953 aggregate input.currentDiagnostic.currentUserMatchesActiveGm");
  exact(ownedDiagnostic.ownedSceneCanUpdate, true, "M953 aggregate input.ownedDiagnostic.ownedSceneCanUpdate");
  exact(ownedDiagnostic.noUpdateInvoked, true, "M953 aggregate input.ownedDiagnostic.noUpdateInvoked");
  exact(finalReread.worldDocumentWrites, 0, "M953 aggregate input.finalReread.worldDocumentWrites");
  exact(limits.documentWrites, 0, "M953 aggregate input.limits.documentWrites");
  exact(limits.documentUpdateInvoked, false, "M953 aggregate input.limits.documentUpdateInvoked");
  exact(limits.genericExecutor, false, "M953 aggregate input.limits.genericExecutor");
  exact(limits.playerPasswordsGenerated, false, "M953 aggregate input.limits.playerPasswordsGenerated");
  exact(limits.playerPasswordEntered, false, "M953 aggregate input.limits.playerPasswordEntered");
  exact(limits.foreignStateTouched, false, "M953 aggregate input.limits.foreignStateTouched");
  exact(limits.authorityPromoted, false, "M953 aggregate input.limits.authorityPromoted");
  exact(limits.stage11AcceptanceStatus, "blocked", "M953 aggregate input.limits.stage11AcceptanceStatus");
  exact(limits.stage12Started, false, "M953 aggregate input.limits.stage12Started");
  exact(limits.readyClaim, false, "M953 aggregate input.limits.readyClaim");
  return Object.freeze({
    schemaVersion: PROJECT_STAGE11_LOADED_AUTHORITY_CONTROL_AGGREGATE_EVIDENCE_SCHEMA_VERSION,
    milestone: "M953",
    sourceMilestone: "M952",
    evidenceLabel: "local",
    receipt: RECEIPT,
    operation: "dicebox.foundry.loaded-authority-controls",
    target: Object.freeze({
      worldId: "dbx-test-world",
      foundryVersion: "14.367",
      systemId: "dnd5e",
      systemVersion: "5.3.3",
      port: 30003,
    }),
    currentUserIsGm: true,
    currentUserMatchesActiveGm: true,
    ownedSceneCanUpdate: true,
    controlsObserved: 2,
    moduleExecutionObserved: true,
    noWrite: true,
    noUpdateInvoked: true,
    noGenericAuthorityClaim: true,
    noExecutionAuthority: true,
    noAuthorityGrant: true,
    noFoundryWrite: true,
    producerScopedOnly: true,
    foreignStatePreserved: true,
    readOnly: true,
    nonCertifying: true,
    aggregateAttachment: "one-loaded-authority-control-producer-scoped-non-certifying",
    aggregateAuthority: "not-granted",
    cleanShutdown: true,
    countsChanged: false,
    playerPasswordEntered: false,
    readyClaim: false,
    stage11AcceptanceStatus: "blocked",
    stage12Started: false,
  });
}
