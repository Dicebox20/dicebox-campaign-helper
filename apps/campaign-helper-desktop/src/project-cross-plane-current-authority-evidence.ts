import {
  bridgeProjectAggregateCurrentAuthorityEvidence,
  type ProjectAggregateCurrentAuthorityEvidenceReceipt,
} from "./project-aggregate-current-authority-evidence";
import {
  createProjectStage11FoundryInverseEvidence,
  type ProjectStage11FoundryInverseEvidenceReceipt,
} from "./project-stage11-foundry-inverse-evidence";
import {
  createProjectStage11LoadedAuthorityControlCrossPlaneEvidence,
  type ProjectStage11LoadedAuthorityControlCrossPlaneEvidence,
} from "./project-stage11-loaded-authority-control-cross-plane-evidence";

export const PROJECT_CROSS_PLANE_CURRENT_AUTHORITY_EVIDENCE_SCHEMA_VERSION = "0.1.0" as const;

export type ProjectCrossPlaneCurrentAuthorityEvidenceReceipt = Readonly<{
  schemaVersion: typeof PROJECT_CROSS_PLANE_CURRENT_AUTHORITY_EVIDENCE_SCHEMA_VERSION;
  status: "PASS";
  disposition: "cross-plane-partial";
  localEvidence: ProjectAggregateCurrentAuthorityEvidenceReceipt;
  fixtureEvidence: Readonly<{
    evidenceLabel: "fixture";
    operation: "dicebox.runtime-evidence.diagnostic";
    status: "OBSERVED";
    redacted: true;
    noWrite: true;
    exactTargetMatch: true;
    activeGmObserved: true;
    readiness: Readonly<{ pass: 10; blocked: 1; unknown: 0; total: 11 }>;
  }>;
  packageStageEvidence: Readonly<{
    evidenceLabel: "fixture";
    operation: "foundry.module.update";
    status: "PARTIAL";
    target: Readonly<{ foundryVersion: "14.367"; systemId: "dnd5e"; systemVersion: "5.3.3" }>;
    sourceAndServedHashesMatch: true;
    diagnosticMarkersPresent: true;
    noWorldMutation: true;
    worldDocumentWrites: 0;
    balladTouched: false;
    nativeGmDialog: "NOT_OBSERVED";
    browserControlRuntime: "unavailable";
    retryAttempted: false;
  }>;
  currentActiveGmDialogEvidence: Readonly<{
    evidenceLabel: "fixture";
    operation: "dicebox.current-active-gm-authority.diagnostic";
    status: "OBSERVED";
    target: Readonly<{ foundryVersion: "14.367"; systemId: "dnd5e"; systemVersion: "5.3.3" }>;
    currentUserIsGm: true;
    currentUserMatchesActiveGm: true;
    redacted: true;
    noWrite: true;
    noPermissionClaim: true;
    noExecutionAuthority: true;
    readyClaim: false;
    worldDocumentWrites: 0;
    balladTouched: false;
  }>;
  ownedScenePermissionEvidence: Readonly<{
    evidenceLabel: "fixture";
    operation: "dicebox.owned-scene-permission.diagnostic";
    status: "OBSERVED";
    target: Readonly<{ worldId: "dbx-test-world"; foundryVersion: "14.367"; systemId: "dnd5e"; systemVersion: "5.3.3"; port: 30003 }>;
    stableId: "dbx:scene:desktop-shell-fixture";
    ownedSceneCanUpdate: true;
    redacted: true;
    noWrite: true;
    noUpdateInvoked: true;
    noGenericAuthorityClaim: true;
    noExecutionAuthority: true;
    readyClaim: false;
    shutdown: Readonly<{ status: "STOPPED"; worldDocumentWrites: 0; balladTouched: false }>;
  }>;
  loadedAuthorityControlEvidence?: ProjectStage11LoadedAuthorityControlCrossPlaneEvidence;
  foundryInverseEvidence: ProjectStage11FoundryInverseEvidenceReceipt;
  authority: Readonly<{ local: "operation-specific"; fixture: "read-only-active-gm-observed"; package: "served-no-dialog-observation"; directRuntime: "current-active-gm-identity-observed"; scenePermission: "one-owned-scene-predicate-observed"; foundryInverse: "producer-scoped-fixture-observed"; aggregate: "not-granted" }>;
  readOnly: true;
  noExecutionAuthority: true;
  noTransitionAuthority: true;
  noFoundryWrite: true;
  noProjectMutation: true;
  readyClaim: false;
  stage11AcceptanceStatus: "blocked";
  stage12Started: false;
  remainingBlockers: readonly string[];
}>;

export class ProjectCrossPlaneCurrentAuthorityEvidenceValidationError extends Error {
  readonly code = "CROSS_PLANE_CURRENT_AUTHORITY_EVIDENCE_VALIDATION_FAILED" as const;
  readonly retryAllowed = false;
  constructor(message: string) { super(message); this.name = "ProjectCrossPlaneCurrentAuthorityEvidenceValidationError"; }
}

function blocked(message: string): never { throw new ProjectCrossPlaneCurrentAuthorityEvidenceValidationError(message); }
function record(value: unknown, label: string): Record<string, unknown> {
  if (value === null || typeof value !== "object" || Array.isArray(value)) blocked(`${label} must be an object.`);
  return value as Record<string, unknown>;
}
function exact(value: unknown, expected: string | number | boolean, label: string): void {
  if (value !== expected) blocked(`${label} must be ${String(expected)}.`);
}
function exactKeys(value: Record<string, unknown>, expected: readonly string[], label: string): void {
  const actual = Object.keys(value).sort(); const required = [...expected].sort();
  if (actual.length !== required.length || actual.some((key, index) => key !== required[index])) blocked(`${label} contains unknown or missing fields.`);
}

function validateFixtureEvidence(input: unknown): ProjectCrossPlaneCurrentAuthorityEvidenceReceipt["fixtureEvidence"] {
  const fixture = record(input, "fixture evidence");
  exactKeys(fixture, ["activeGmObserved", "evidenceLabel", "exactTargetMatch", "noWrite", "operation", "readiness", "redacted", "status"], "fixture evidence");
  exact(fixture.evidenceLabel, "fixture", "fixture evidence.evidenceLabel");
  exact(fixture.operation, "dicebox.runtime-evidence.diagnostic", "fixture evidence.operation");
  exact(fixture.status, "OBSERVED", "fixture evidence.status");
  exact(fixture.redacted, true, "fixture evidence.redacted");
  exact(fixture.noWrite, true, "fixture evidence.noWrite");
  exact(fixture.exactTargetMatch, true, "fixture evidence.exactTargetMatch");
  exact(fixture.activeGmObserved, true, "fixture evidence.activeGmObserved");
  const readiness = record(fixture.readiness, "fixture evidence.readiness");
  exactKeys(readiness, ["blocked", "pass", "total", "unknown"], "fixture evidence.readiness");
  exact(readiness.pass, 10, "fixture evidence.readiness.pass"); exact(readiness.blocked, 1, "fixture evidence.readiness.blocked"); exact(readiness.unknown, 0, "fixture evidence.readiness.unknown"); exact(readiness.total, 11, "fixture evidence.readiness.total");
  return Object.freeze({ evidenceLabel: "fixture", operation: "dicebox.runtime-evidence.diagnostic", status: "OBSERVED", redacted: true, noWrite: true, exactTargetMatch: true, activeGmObserved: true, readiness: Object.freeze({ pass: 10, blocked: 1, unknown: 0, total: 11 }) });
}

function validatePackageStageEvidence(input: unknown): ProjectCrossPlaneCurrentAuthorityEvidenceReceipt["packageStageEvidence"] {
  const stage = record(input, "package-stage evidence");
  exactKeys(stage, ["balladTouched", "browserControlRuntime", "diagnosticMarkersPresent", "evidenceLabel", "nativeGmDialog", "noWorldMutation", "operation", "retryAttempted", "sourceAndServedHashesMatch", "status", "target", "worldDocumentWrites"], "package-stage evidence");
  exact(stage.evidenceLabel, "fixture", "package-stage evidence.evidenceLabel");
  exact(stage.operation, "foundry.module.update", "package-stage evidence.operation");
  exact(stage.status, "PARTIAL", "package-stage evidence.status");
  exact(stage.sourceAndServedHashesMatch, true, "package-stage evidence.sourceAndServedHashesMatch");
  exact(stage.diagnosticMarkersPresent, true, "package-stage evidence.diagnosticMarkersPresent");
  exact(stage.noWorldMutation, true, "package-stage evidence.noWorldMutation");
  exact(stage.worldDocumentWrites, 0, "package-stage evidence.worldDocumentWrites");
  exact(stage.balladTouched, false, "package-stage evidence.balladTouched");
  exact(stage.nativeGmDialog, "NOT_OBSERVED", "package-stage evidence.nativeGmDialog");
  exact(stage.browserControlRuntime, "unavailable", "package-stage evidence.browserControlRuntime");
  exact(stage.retryAttempted, false, "package-stage evidence.retryAttempted");
  const target = record(stage.target, "package-stage evidence.target");
  exactKeys(target, ["foundryVersion", "systemId", "systemVersion"], "package-stage evidence.target");
  exact(target.foundryVersion, "14.367", "package-stage evidence.target.foundryVersion");
  exact(target.systemId, "dnd5e", "package-stage evidence.target.systemId");
  exact(target.systemVersion, "5.3.3", "package-stage evidence.target.systemVersion");
  return Object.freeze({ evidenceLabel: "fixture", operation: "foundry.module.update", status: "PARTIAL", target: Object.freeze({ foundryVersion: "14.367", systemId: "dnd5e", systemVersion: "5.3.3" }), sourceAndServedHashesMatch: true, diagnosticMarkersPresent: true, noWorldMutation: true, worldDocumentWrites: 0, balladTouched: false, nativeGmDialog: "NOT_OBSERVED", browserControlRuntime: "unavailable", retryAttempted: false });
}

function validateCurrentActiveGmDialogEvidence(input: unknown): ProjectCrossPlaneCurrentAuthorityEvidenceReceipt["currentActiveGmDialogEvidence"] {
  const dialog = record(input, "current active-GM dialog evidence");
  exactKeys(dialog, ["balladTouched", "currentUserIsGm", "currentUserMatchesActiveGm", "evidenceLabel", "noExecutionAuthority", "noPermissionClaim", "noWrite", "operation", "readyClaim", "redacted", "status", "target", "worldDocumentWrites"], "current active-GM dialog evidence");
  exact(dialog.evidenceLabel, "fixture", "current active-GM dialog evidence.evidenceLabel");
  exact(dialog.operation, "dicebox.current-active-gm-authority.diagnostic", "current active-GM dialog evidence.operation");
  exact(dialog.status, "OBSERVED", "current active-GM dialog evidence.status");
  for (const field of ["currentUserIsGm", "currentUserMatchesActiveGm", "redacted", "noWrite", "noPermissionClaim", "noExecutionAuthority"] as const) exact(dialog[field], true, `current active-GM dialog evidence.${field}`);
  exact(dialog.readyClaim, false, "current active-GM dialog evidence.readyClaim");
  exact(dialog.worldDocumentWrites, 0, "current active-GM dialog evidence.worldDocumentWrites");
  exact(dialog.balladTouched, false, "current active-GM dialog evidence.balladTouched");
  const target = record(dialog.target, "current active-GM dialog evidence.target");
  exactKeys(target, ["foundryVersion", "systemId", "systemVersion"], "current active-GM dialog evidence.target");
  exact(target.foundryVersion, "14.367", "current active-GM dialog evidence.target.foundryVersion");
  exact(target.systemId, "dnd5e", "current active-GM dialog evidence.target.systemId");
  exact(target.systemVersion, "5.3.3", "current active-GM dialog evidence.target.systemVersion");
  return Object.freeze({ evidenceLabel: "fixture", operation: "dicebox.current-active-gm-authority.diagnostic", status: "OBSERVED", target: Object.freeze({ foundryVersion: "14.367", systemId: "dnd5e", systemVersion: "5.3.3" }), currentUserIsGm: true, currentUserMatchesActiveGm: true, redacted: true, noWrite: true, noPermissionClaim: true, noExecutionAuthority: true, readyClaim: false, worldDocumentWrites: 0, balladTouched: false });
}

function validateOwnedScenePermissionEvidence(input: unknown): ProjectCrossPlaneCurrentAuthorityEvidenceReceipt["ownedScenePermissionEvidence"] {
  const evidence = record(input, "owned Scene permission evidence");
  exactKeys(evidence, ["evidenceLabel", "noExecutionAuthority", "noGenericAuthorityClaim", "noUpdateInvoked", "noWrite", "operation", "ownedSceneCanUpdate", "readyClaim", "redacted", "shutdown", "stableId", "status", "target"], "owned Scene permission evidence");
  exact(evidence.evidenceLabel, "fixture", "owned Scene permission evidence.evidenceLabel");
  exact(evidence.operation, "dicebox.owned-scene-permission.diagnostic", "owned Scene permission evidence.operation");
  exact(evidence.status, "OBSERVED", "owned Scene permission evidence.status");
  for (const field of ["ownedSceneCanUpdate", "redacted", "noWrite", "noUpdateInvoked", "noGenericAuthorityClaim", "noExecutionAuthority"] as const) exact(evidence[field], true, `owned Scene permission evidence.${field}`);
  exact(evidence.readyClaim, false, "owned Scene permission evidence.readyClaim");
  exact(evidence.stableId, "dbx:scene:desktop-shell-fixture", "owned Scene permission evidence.stableId");
  const target = record(evidence.target, "owned Scene permission evidence.target");
  exactKeys(target, ["foundryVersion", "port", "systemId", "systemVersion", "worldId"], "owned Scene permission evidence.target");
  exact(target.worldId, "dbx-test-world", "owned Scene permission evidence.target.worldId"); exact(target.foundryVersion, "14.367", "owned Scene permission evidence.target.foundryVersion"); exact(target.systemId, "dnd5e", "owned Scene permission evidence.target.systemId"); exact(target.systemVersion, "5.3.3", "owned Scene permission evidence.target.systemVersion"); exact(target.port, 30003, "owned Scene permission evidence.target.port");
  const shutdown = record(evidence.shutdown, "owned Scene permission evidence.shutdown");
  exactKeys(shutdown, ["balladTouched", "status", "worldDocumentWrites"], "owned Scene permission evidence.shutdown");
  exact(shutdown.status, "STOPPED", "owned Scene permission evidence.shutdown.status"); exact(shutdown.worldDocumentWrites, 0, "owned Scene permission evidence.shutdown.worldDocumentWrites"); exact(shutdown.balladTouched, false, "owned Scene permission evidence.shutdown.balladTouched");
  return Object.freeze({ evidenceLabel: "fixture", operation: "dicebox.owned-scene-permission.diagnostic", status: "OBSERVED", target: Object.freeze({ worldId: "dbx-test-world", foundryVersion: "14.367", systemId: "dnd5e", systemVersion: "5.3.3", port: 30003 }), stableId: "dbx:scene:desktop-shell-fixture", ownedSceneCanUpdate: true, redacted: true, noWrite: true, noUpdateInvoked: true, noGenericAuthorityClaim: true, noExecutionAuthority: true, readyClaim: false, shutdown: Object.freeze({ status: "STOPPED", worldDocumentWrites: 0, balladTouched: false }) });
}

export function bridgeProjectCrossPlaneCurrentAuthorityEvidence(localInput: unknown, fixtureInput: unknown, packageStageInput: unknown, currentActiveGmDialogInput: unknown, ownedScenePermissionInput: unknown, foundryInverseInput: unknown, loadedAuthorityControlInput?: unknown): ProjectCrossPlaneCurrentAuthorityEvidenceReceipt {
  const localEvidence = bridgeProjectAggregateCurrentAuthorityEvidence(localInput);
  const fixtureEvidence = validateFixtureEvidence(fixtureInput);
  const packageStageEvidence = validatePackageStageEvidence(packageStageInput);
  const currentActiveGmDialogEvidence = validateCurrentActiveGmDialogEvidence(currentActiveGmDialogInput);
  const ownedScenePermissionEvidence = validateOwnedScenePermissionEvidence(ownedScenePermissionInput);
  const foundryInverseEvidence = createProjectStage11FoundryInverseEvidence(foundryInverseInput);
  const loadedAuthorityControlEvidence = loadedAuthorityControlInput === undefined
    ? undefined
    : createProjectStage11LoadedAuthorityControlCrossPlaneEvidence(loadedAuthorityControlInput);
  return Object.freeze({
    schemaVersion: PROJECT_CROSS_PLANE_CURRENT_AUTHORITY_EVIDENCE_SCHEMA_VERSION,
    status: "PASS", disposition: "cross-plane-partial", localEvidence, fixtureEvidence, packageStageEvidence, currentActiveGmDialogEvidence, ownedScenePermissionEvidence, foundryInverseEvidence,
    ...(loadedAuthorityControlEvidence ? { loadedAuthorityControlEvidence } : {}),
    authority: Object.freeze({ local: "operation-specific", fixture: "read-only-active-gm-observed", package: "served-no-dialog-observation", directRuntime: "current-active-gm-identity-observed", scenePermission: "one-owned-scene-predicate-observed", foundryInverse: "producer-scoped-fixture-observed", aggregate: "not-granted" }),
    readOnly: true, noExecutionAuthority: true, noTransitionAuthority: true, noFoundryWrite: true, noProjectMutation: true,
    readyClaim: false, stage11AcceptanceStatus: "blocked", stage12Started: false,
    remainingBlockers: Object.freeze(["The owned-Scene predicate is limited to one redacted canUserModify(update) result; it does not invoke or prove update execution, proposal authority, or generic/every-document authority.", "The historical served package-stage evidence remains distinct and does not itself prove the direct dialog result.", "Cross-producer lifecycle and recovery continuity remains incomplete.", "Stage 11 acceptance is blocked and Stage 12 remains locked."]),
  });
}
