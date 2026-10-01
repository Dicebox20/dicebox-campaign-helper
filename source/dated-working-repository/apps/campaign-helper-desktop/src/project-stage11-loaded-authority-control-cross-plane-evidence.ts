import {
  createProjectStage11LoadedAuthorityControlAggregateEvidence,
} from "./project-stage11-loaded-authority-control-aggregate-evidence";

export const PROJECT_STAGE11_LOADED_AUTHORITY_CONTROL_CROSS_PLANE_EVIDENCE_SCHEMA_VERSION = "0.1.0" as const;

const RECEIPT = "outputs/m952-stage11-exact-v4-loaded-module-authority-control-observation-closure-receipt.json" as const;

export type ProjectStage11LoadedAuthorityControlCrossPlaneEvidence = Readonly<{
  schemaVersion: typeof PROJECT_STAGE11_LOADED_AUTHORITY_CONTROL_CROSS_PLANE_EVIDENCE_SCHEMA_VERSION;
  milestone: "M955";
  sourceMilestone: "M952";
  sourceAggregateMilestone: "M953";
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
  supplementalOnly: true;
  preservesExistingAuthorityPlanes: true;
  foreignStatePreserved: true;
  readOnly: true;
  nonCertifying: true;
  aggregateAttachment: "supplemental-loaded-authority-control-cross-plane-binding";
  currentAuthority: "partial";
  aggregateAuthority: "not-granted";
  countsChanged: false;
  readyClaim: false;
  stage11AcceptanceStatus: "blocked";
  stage12Started: false;
}>;

export class ProjectStage11LoadedAuthorityControlCrossPlaneEvidenceValidationError extends Error {
  readonly code = "STAGE11_LOADED_AUTHORITY_CONTROL_CROSS_PLANE_EVIDENCE_VALIDATION_FAILED" as const;
  readonly retryAllowed = false;
  constructor(message: string) {
    super(message);
    this.name = "ProjectStage11LoadedAuthorityControlCrossPlaneEvidenceValidationError";
  }
}

function blocked(message: string): never {
  throw new ProjectStage11LoadedAuthorityControlCrossPlaneEvidenceValidationError(message);
}

function exact(value: unknown, expected: string | number | boolean, label: string): void {
  if (value !== expected) blocked(`${label} must be ${String(expected)}.`);
}

export function createProjectStage11LoadedAuthorityControlCrossPlaneEvidence(input: unknown): ProjectStage11LoadedAuthorityControlCrossPlaneEvidence {
  const aggregate = createProjectStage11LoadedAuthorityControlAggregateEvidence(input);
  exact(aggregate.schemaVersion, "0.1.0", "M955 aggregate schemaVersion");
  exact(aggregate.milestone, "M953", "M955 aggregate milestone");
  exact(aggregate.sourceMilestone, "M952", "M955 aggregate sourceMilestone");
  exact(aggregate.evidenceLabel, "local", "M955 aggregate evidenceLabel");
  exact(aggregate.operation, "dicebox.foundry.loaded-authority-controls", "M955 aggregate operation");
  exact(aggregate.currentUserIsGm, true, "M955 aggregate currentUserIsGm");
  exact(aggregate.currentUserMatchesActiveGm, true, "M955 aggregate currentUserMatchesActiveGm");
  exact(aggregate.ownedSceneCanUpdate, true, "M955 aggregate ownedSceneCanUpdate");
  exact(aggregate.controlsObserved, 2, "M955 aggregate controlsObserved");
  exact(aggregate.moduleExecutionObserved, true, "M955 aggregate moduleExecutionObserved");
  exact(aggregate.noWrite, true, "M955 aggregate noWrite");
  exact(aggregate.noUpdateInvoked, true, "M955 aggregate noUpdateInvoked");
  exact(aggregate.noGenericAuthorityClaim, true, "M955 aggregate noGenericAuthorityClaim");
  exact(aggregate.noExecutionAuthority, true, "M955 aggregate noExecutionAuthority");
  exact(aggregate.noAuthorityGrant, true, "M955 aggregate noAuthorityGrant");
  exact(aggregate.noFoundryWrite, true, "M955 aggregate noFoundryWrite");
  exact(aggregate.producerScopedOnly, true, "M955 aggregate producerScopedOnly");
  exact(aggregate.foreignStatePreserved, true, "M955 aggregate foreignStatePreserved");
  exact(aggregate.readOnly, true, "M955 aggregate readOnly");
  exact(aggregate.nonCertifying, true, "M955 aggregate nonCertifying");
  exact(aggregate.aggregateAuthority, "not-granted", "M955 aggregate aggregateAuthority");
  exact(aggregate.countsChanged, false, "M955 aggregate countsChanged");
  exact(aggregate.readyClaim, false, "M955 aggregate readyClaim");
  exact(aggregate.stage11AcceptanceStatus, "blocked", "M955 aggregate stage11AcceptanceStatus");
  exact(aggregate.stage12Started, false, "M955 aggregate stage12Started");
  return Object.freeze({
    schemaVersion: PROJECT_STAGE11_LOADED_AUTHORITY_CONTROL_CROSS_PLANE_EVIDENCE_SCHEMA_VERSION,
    milestone: "M955",
    sourceMilestone: "M952",
    sourceAggregateMilestone: "M953",
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
    supplementalOnly: true,
    preservesExistingAuthorityPlanes: true,
    foreignStatePreserved: true,
    readOnly: true,
    nonCertifying: true,
    aggregateAttachment: "supplemental-loaded-authority-control-cross-plane-binding",
    currentAuthority: "partial",
    aggregateAuthority: "not-granted",
    countsChanged: false,
    readyClaim: false,
    stage11AcceptanceStatus: "blocked",
    stage12Started: false,
  });
}
