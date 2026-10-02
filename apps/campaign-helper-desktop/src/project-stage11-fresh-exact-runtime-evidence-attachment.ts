export const PROJECT_STAGE11_FRESH_EXACT_RUNTIME_EVIDENCE_ATTACHMENT_SCHEMA_VERSION = "0.1.0" as const;

const RECEIPT = "outputs/m1018-stage11-host-window-recovery-and-final-exact-runtime-reread-receipt.json" as const;
const RECEIPT_SHA256 = "C64E7137308D211BAE4B7C0DD72E239C317C06EE26CE17690205934FA88B4D7C" as const;

export type ProjectStage11FreshExactRuntimeEvidenceAttachment = Readonly<{
  schemaVersion: typeof PROJECT_STAGE11_FRESH_EXACT_RUNTIME_EVIDENCE_ATTACHMENT_SCHEMA_VERSION;
  milestone: "M1020";
  sourceMilestone: "M1018";
  evidenceLabel: "local";
  receipt: typeof RECEIPT;
  receiptSha256: typeof RECEIPT_SHA256;
  operation: "dicebox.foundry.fresh-exact-runtime-current-authority";
  target: Readonly<{
    worldId: "dbx-test-world";
    foundryVersion: "14.367";
    systemId: "dnd5e";
    systemVersion: "5.3.3";
    diceboxModuleVersion: "0.1.15";
    port: 30001;
  }>;
  browser: "Chrome external browser";
  viewport: Readonly<{ width: 1920; height: 863; minimumWidth: 1024; minimumHeight: 768 }>;
  currentUser: "Gamemaster";
  currentUserIsGm: true;
  activeScene: "DiceBox Tram Routing Projection";
  diceboxControlsObserved: 3;
  foundryControlsObserved: 8;
  supervisorPid: 16128;
  worldDocumentWrites: 0;
  balladTouched: false;
  adminPasswordConfigured: false;
  extensionNoiseClassified: true;
  resolutionWarning: false;
  noWrite: true;
  noAuthorityGrant: true;
  noExecutionAuthority: true;
  noTransitionAuthority: true;
  noRecoveryAuthority: true;
  noGenericExecutor: true;
  noFoundryWrite: true;
  noProjectMutation: true;
  foreignStatePreserved: true;
  readOnly: true;
  nonCertifying: true;
  producerScopedOnly: true;
  attachment: "one-fresh-exact-runtime-producer-scoped-non-certifying";
  currentAuthority: "partial";
  aggregateAuthority: "not-granted";
  countsChanged: false;
  stage11AcceptanceStatus: "blocked";
  stage12Started: false;
  readyClaim: false;
}>;

export class ProjectStage11FreshExactRuntimeEvidenceAttachmentValidationError extends Error {
  readonly code = "STAGE11_FRESH_EXACT_RUNTIME_EVIDENCE_ATTACHMENT_VALIDATION_FAILED" as const;
  readonly retryAllowed = false;
  constructor(message: string) {
    super(message);
    this.name = "ProjectStage11FreshExactRuntimeEvidenceAttachmentValidationError";
  }
}

function blocked(message: string): never {
  throw new ProjectStage11FreshExactRuntimeEvidenceAttachmentValidationError(message);
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
  const receipt = record(input, "M1018 exact-runtime receipt");
  exactKeys(receipt, ["schemaVersion", "milestone", "stage", "status", "evidenceClass", "scope", "target", "browserObservation", "supervisorObservation", "consoleObservation", "reconciliation", "validation", "limits", "doesNotProve", "next"], "M1018 exact-runtime receipt");
  exact(receipt.schemaVersion, "0.1.0", "M1018 receipt.schemaVersion");
  exact(receipt.milestone, "M1018", "M1018 receipt.milestone");
  exact(receipt.stage, "proposal-approval-history", "M1018 receipt.stage");
  exact(receipt.status, "PASS EXACT-RUNTIME CURRENT-AUTHORITY OBSERVATION; STAGE 11 NOT ACCEPTED", "M1018 receipt.status");
  exact(receipt.evidenceClass, "runtime", "M1018 receipt.evidenceClass");
  exact(receipt.scope, "Perform one bounded host-window/browser recovery and final exact-runtime/current-authority reread against the disposable fixture.", "M1018 receipt.scope");
  exact(receipt.next, "Record M1018 closure and M1019 authorization in the roadmap, active card, and rebuilt/verified knowledge base; then perform one read-only reconciliation of exact-runtime evidence against the complete Stage 11 authority matrix.", "M1018 receipt.next");

  const target = record(receipt.target, "M1018 target");
  exactKeys(target, ["worldId", "dataPath", "foundry", "system", "systemVersion", "diceboxModuleVersion", "port", "commandFingerprint"], "M1018 target");
  exact(target.worldId, "dbx-test-world", "M1018 target.worldId");
  exact(target.dataPath, "work/foundry-fixture-data-v2", "M1018 target.dataPath");
  exact(target.foundry, "14.367", "M1018 target.foundry");
  exact(target.system, "dnd5e", "M1018 target.system");
  exact(target.systemVersion, "5.3.3", "M1018 target.systemVersion");
  exact(target.diceboxModuleVersion, "0.1.15", "M1018 target.diceboxModuleVersion");
  exact(target.port, 30001, "M1018 target.port");
  exact(target.commandFingerprint, "47E4A213511831674B50D1BC6194B6876E9D78B60CB0037B7387C09D57A26F3F", "M1018 target.commandFingerprint");

  const browser = record(receipt.browserObservation, "M1018 browserObservation");
  exactKeys(browser, ["browser", "url", "title", "defaultViewport", "visibleUser", "visibleScene", "visibleRuntimeText", "diceboxControlsVisible", "foundryControlsVisible"], "M1018 browserObservation");
  exact(browser.browser, "Chrome external browser", "M1018 browserObservation.browser");
  exact(browser.url, "http://127.0.0.1:30001/game", "M1018 browserObservation.url");
  exact(browser.title, "Foundry Virtual Tabletop", "M1018 browserObservation.title");
  exact(browser.visibleUser, "Gamemaster [GM]", "M1018 browserObservation.visibleUser");
  exact(browser.visibleScene, "DiceBox Tram Routing Projection", "M1018 browserObservation.visibleScene");
  exactArray(browser.visibleRuntimeText, ["TRAM COORDINATES: MATCH", "0 drifted checks · no Foundry writes", "GAME PAUSED"], "M1018 browserObservation.visibleRuntimeText");
  exactArray(browser.diceboxControlsVisible, ["Prepare DiceBox Ascendancy", "Repair DiceBox Ascendancy maps and geometry", "Apply DiceBox Program Scene vertical slice"], "M1018 browserObservation.diceboxControlsVisible");
  exactArray(browser.foundryControlsVisible, ["Token Controls", "Tile Controls", "Drawing Tools", "Wall Controls", "Lighting Controls", "Ambient Sound Controls", "Region Controls", "Journal Notes"], "M1018 browserObservation.foundryControlsVisible");
  const viewport = record(browser.defaultViewport, "M1018 defaultViewport");
  exactKeys(viewport, ["innerWidth", "innerHeight", "minimumWidth", "minimumHeight", "meetsMinimum"], "M1018 defaultViewport");
  exact(viewport.innerWidth, 1920, "M1018 defaultViewport.innerWidth");
  exact(viewport.innerHeight, 863, "M1018 defaultViewport.innerHeight");
  exact(viewport.minimumWidth, 1024, "M1018 defaultViewport.minimumWidth");
  exact(viewport.minimumHeight, 768, "M1018 defaultViewport.minimumHeight");
  exact(viewport.meetsMinimum, true, "M1018 defaultViewport.meetsMinimum");

  const supervisor = record(receipt.supervisorObservation, "M1018 supervisorObservation");
  exactKeys(supervisor, ["status", "pid", "listenerMatches", "httpReady", "worldDocumentWrites", "balladTouched", "adminPasswordConfigured"], "M1018 supervisorObservation");
  exact(supervisor.status, "PASS", "M1018 supervisorObservation.status");
  exact(supervisor.pid, 16128, "M1018 supervisorObservation.pid");
  exact(supervisor.listenerMatches, true, "M1018 supervisorObservation.listenerMatches");
  exact(supervisor.httpReady, true, "M1018 supervisorObservation.httpReady");
  exact(supervisor.worldDocumentWrites, 0, "M1018 supervisorObservation.worldDocumentWrites");
  exact(supervisor.balladTouched, false, "M1018 supervisorObservation.balladTouched");
  exact(supervisor.adminPasswordConfigured, false, "M1018 supervisorObservation.adminPasswordConfigured");

  const consoleObservation = record(receipt.consoleObservation, "M1018 consoleObservation");
  exactKeys(consoleObservation, ["application", "errors", "resolutionWarning"], "M1018 consoleObservation");
  exact(consoleObservation.application, "DiceBox Campaign Helper loaded; DiceBox Tram Routing Projection Scene was viewed and its canvas was drawn.", "M1018 consoleObservation.application");
  exact(consoleObservation.resolutionWarning, false, "M1018 consoleObservation.resolutionWarning");
  const errors = consoleObservation.errors;
  if (!Array.isArray(errors) || errors.length !== 1) blocked("M1018 consoleObservation.errors must contain the exact extension-noise observation.");
  const error = record(errors[0], "M1018 consoleObservation.errors[0]");
  exactKeys(error, ["message", "url", "classification"], "M1018 consoleObservation.errors[0]");
  exact(error.message, "Error: Could not establish connection. Receiving end does not exist.", "M1018 consoleObservation.errors[0].message");
  exact(error.url, "http://127.0.0.1:30001/join", "M1018 consoleObservation.errors[0].url");
  exact(error.classification, "external Chrome extension message during initial join navigation; not a Foundry/DiceBox application error", "M1018 consoleObservation.errors[0].classification");

  const reconciliation = record(receipt.reconciliation, "M1018 reconciliation");
  exactKeys(reconciliation, ["manifestIdentity", "processAndListenerOwnership", "hostViewportMinimum", "gmIdentityVisible", "activeSceneVisible", "diceboxControlsVisible", "foundryControlsVisible", "currentAuthority", "aggregateAuthority", "crossProducerContinuity", "committedRecoveredContinuity", "runtimeLane", "stage11", "stage12", "readyClaim"], "M1018 reconciliation");
  exact(reconciliation.manifestIdentity, "PASS", "M1018 reconciliation.manifestIdentity");
  exact(reconciliation.processAndListenerOwnership, "PASS", "M1018 reconciliation.processAndListenerOwnership");
  exact(reconciliation.hostViewportMinimum, "PASS", "M1018 reconciliation.hostViewportMinimum");
  exact(reconciliation.gmIdentityVisible, "PASS", "M1018 reconciliation.gmIdentityVisible");
  exact(reconciliation.activeSceneVisible, "PASS", "M1018 reconciliation.activeSceneVisible");
  exact(reconciliation.diceboxControlsVisible, "PASS", "M1018 reconciliation.diceboxControlsVisible");
  exact(reconciliation.foundryControlsVisible, "PASS", "M1018 reconciliation.foundryControlsVisible");
  exact(reconciliation.currentAuthority, "PARTIAL", "M1018 reconciliation.currentAuthority");
  exact(reconciliation.aggregateAuthority, "NOT_GRANTED", "M1018 reconciliation.aggregateAuthority");
  exact(reconciliation.crossProducerContinuity, "unproven", "M1018 reconciliation.crossProducerContinuity");
  exact(reconciliation.committedRecoveredContinuity, "not-proven", "M1018 reconciliation.committedRecoveredContinuity");
  exact(reconciliation.runtimeLane, "PARKED", "M1018 reconciliation.runtimeLane");
  exact(reconciliation.stage11, "BLOCKED", "M1018 reconciliation.stage11");
  exact(reconciliation.stage12, "LOCKED", "M1018 reconciliation.stage12");
  exact(reconciliation.readyClaim, false, "M1018 reconciliation.readyClaim");

  const validation = record(receipt.validation, "M1018 validation");
  exactKeys(validation, ["hostWindowRecovery", "authoritativeReread", "supervisorReread", "noWrite", "foreignState", "passwordBoundary"], "M1018 validation");
  exact(validation.hostWindowRecovery, "PASS: external browser default viewport is 1920x863 and meets the 1024x768 requirement.", "M1018 validation.hostWindowRecovery");
  exact(validation.authoritativeReread, "PASS: exact fixture URL, GM identity, active Scene, DiceBox/Foundry surfaces, paused state, coordinate match, zero drift, and no-write text were reread.", "M1018 validation.authoritativeReread");
  exact(validation.supervisorReread, "PASS: exact process/listener/HTTP ownership remains stable.", "M1018 validation.supervisorReread");
  exact(validation.noWrite, "PASS: no project or Foundry document mutation was invoked; worldDocumentWrites remained 0.", "M1018 validation.noWrite");
  exact(validation.foreignState, "PASS: Ballad untouched.", "M1018 validation.foreignState");
  exact(validation.passwordBoundary, "PASS: no player-role password was entered, generated, or persisted; fixture adminPasswordConfigured remained false.", "M1018 validation.passwordBoundary");

  const limits = record(receipt.limits, "M1018 limits");
  exactKeys(limits, ["readOnlyEvidence", "runtimeInspectionOnly", "noAuthorityGrant", "noExecutionAuthority", "noFoundryWrite", "noProjectMutation", "playerPasswordsGenerated", "foreignStateTouched", "stage11AcceptanceStatus", "stage12Started", "readyClaim"], "M1018 limits");
  exact(limits.readOnlyEvidence, true, "M1018 limits.readOnlyEvidence");
  exact(limits.runtimeInspectionOnly, true, "M1018 limits.runtimeInspectionOnly");
  exact(limits.noAuthorityGrant, true, "M1018 limits.noAuthorityGrant");
  exact(limits.noExecutionAuthority, true, "M1018 limits.noExecutionAuthority");
  exact(limits.noFoundryWrite, true, "M1018 limits.noFoundryWrite");
  exact(limits.noProjectMutation, true, "M1018 limits.noProjectMutation");
  exact(limits.playerPasswordsGenerated, false, "M1018 limits.playerPasswordsGenerated");
  exact(limits.foreignStateTouched, false, "M1018 limits.foreignStateTouched");
  exact(limits.stage11AcceptanceStatus, "blocked", "M1018 limits.stage11AcceptanceStatus");
  exact(limits.stage12Started, false, "M1018 limits.stage12Started");
  exact(limits.readyClaim, false, "M1018 limits.readyClaim");
  exactArray(receipt.doesNotProve, ["complete aggregate current authority", "complete proposal, approval, history, or recovery authority across all producer families", "cross-producer committed/recovered continuity", "project mutation or generic execution", "Stage 11 acceptance", "Stage 12 entry", "Ready-to-Play"], "M1018 doesNotProve");
}

export function createProjectStage11FreshExactRuntimeEvidenceAttachment(input: unknown): ProjectStage11FreshExactRuntimeEvidenceAttachment {
  validateSourceReceipt(input);
  const receipt = record(input, "M1020 fresh exact-runtime aggregate input");
  const target = record(receipt.target, "M1020 fresh exact-runtime aggregate input.target");
  const browser = record(receipt.browserObservation, "M1020 fresh exact-runtime aggregate input.browserObservation");
  const viewport = record(browser.defaultViewport, "M1020 fresh exact-runtime aggregate input.browserObservation.defaultViewport");
  const supervisor = record(receipt.supervisorObservation, "M1020 fresh exact-runtime aggregate input.supervisorObservation");
  const consoleObservation = record(receipt.consoleObservation, "M1020 fresh exact-runtime aggregate input.consoleObservation");
  const reconciliation = record(receipt.reconciliation, "M1020 fresh exact-runtime aggregate input.reconciliation");
  const limits = record(receipt.limits, "M1020 fresh exact-runtime aggregate input.limits");
  exact(supervisor.worldDocumentWrites, 0, "M1020 aggregate input.supervisorObservation.worldDocumentWrites");
  exact(supervisor.balladTouched, false, "M1020 aggregate input.supervisorObservation.balladTouched");
  exact(supervisor.adminPasswordConfigured, false, "M1020 aggregate input.supervisorObservation.adminPasswordConfigured");
  exact(consoleObservation.resolutionWarning, false, "M1020 aggregate input.consoleObservation.resolutionWarning");
  exact(reconciliation.aggregateAuthority, "NOT_GRANTED", "M1020 aggregate input.reconciliation.aggregateAuthority");
  exact(reconciliation.currentAuthority, "PARTIAL", "M1020 aggregate input.reconciliation.currentAuthority");
  exact(limits.playerPasswordsGenerated, false, "M1020 aggregate input.limits.playerPasswordsGenerated");
  exact(limits.stage11AcceptanceStatus, "blocked", "M1020 aggregate input.limits.stage11AcceptanceStatus");
  exact(limits.stage12Started, false, "M1020 aggregate input.limits.stage12Started");
  exact(limits.readyClaim, false, "M1020 aggregate input.limits.readyClaim");

  return Object.freeze({
    schemaVersion: PROJECT_STAGE11_FRESH_EXACT_RUNTIME_EVIDENCE_ATTACHMENT_SCHEMA_VERSION,
    milestone: "M1020",
    sourceMilestone: "M1018",
    evidenceLabel: "local",
    receipt: RECEIPT,
    receiptSha256: RECEIPT_SHA256,
    operation: "dicebox.foundry.fresh-exact-runtime-current-authority",
    target: Object.freeze({
      worldId: target.worldId as "dbx-test-world",
      foundryVersion: target.foundry as "14.367",
      systemId: target.system as "dnd5e",
      systemVersion: target.systemVersion as "5.3.3",
      diceboxModuleVersion: target.diceboxModuleVersion as "0.1.15",
      port: target.port as 30001,
    }),
    browser: browser.browser as "Chrome external browser",
    viewport: {
      width: viewport.innerWidth as 1920,
      height: viewport.innerHeight as 863,
      minimumWidth: viewport.minimumWidth as 1024,
      minimumHeight: viewport.minimumHeight as 768,
    },
    currentUser: (browser.visibleUser as string).replace(" [GM]", "") as "Gamemaster",
    currentUserIsGm: true,
    activeScene: browser.visibleScene as "DiceBox Tram Routing Projection",
    diceboxControlsObserved: (browser.diceboxControlsVisible as unknown[]).length as 3,
    foundryControlsObserved: (browser.foundryControlsVisible as unknown[]).length as 8,
    supervisorPid: supervisor.pid as 16128,
    worldDocumentWrites: supervisor.worldDocumentWrites as 0,
    balladTouched: supervisor.balladTouched as false,
    adminPasswordConfigured: supervisor.adminPasswordConfigured as false,
    extensionNoiseClassified: true,
    resolutionWarning: consoleObservation.resolutionWarning as false,
    noWrite: true,
    noAuthorityGrant: true,
    noExecutionAuthority: true,
    noTransitionAuthority: true,
    noRecoveryAuthority: true,
    noGenericExecutor: true,
    noFoundryWrite: true,
    noProjectMutation: true,
    foreignStatePreserved: true,
    readOnly: limits.readOnlyEvidence as true,
    nonCertifying: true,
    producerScopedOnly: true,
    attachment: "one-fresh-exact-runtime-producer-scoped-non-certifying",
    currentAuthority: "partial",
    aggregateAuthority: "not-granted",
    countsChanged: false,
    stage11AcceptanceStatus: "blocked",
    stage12Started: false,
    readyClaim: false,
  });
}

function parseAttachment(input: unknown): ProjectStage11FreshExactRuntimeEvidenceAttachment {
  const attachment = record(input, "M1020 fresh exact-runtime attachment");
  exactKeys(attachment, [
    "schemaVersion", "milestone", "sourceMilestone", "evidenceLabel", "receipt", "receiptSha256", "operation", "target", "browser", "viewport", "currentUser", "currentUserIsGm", "activeScene", "diceboxControlsObserved", "foundryControlsObserved", "supervisorPid", "worldDocumentWrites", "balladTouched", "adminPasswordConfigured", "extensionNoiseClassified", "resolutionWarning", "noWrite", "noAuthorityGrant", "noExecutionAuthority", "noTransitionAuthority", "noRecoveryAuthority", "noGenericExecutor", "noFoundryWrite", "noProjectMutation", "foreignStatePreserved", "readOnly", "nonCertifying", "producerScopedOnly", "attachment", "currentAuthority", "aggregateAuthority", "countsChanged", "stage11AcceptanceStatus", "stage12Started", "readyClaim",
  ], "M1020 fresh exact-runtime attachment");
  exact(attachment.schemaVersion, "0.1.0", "M1020 attachment.schemaVersion");
  exact(attachment.milestone, "M1020", "M1020 attachment.milestone");
  exact(attachment.sourceMilestone, "M1018", "M1020 attachment.sourceMilestone");
  exact(attachment.evidenceLabel, "local", "M1020 attachment.evidenceLabel");
  exact(attachment.receipt, RECEIPT, "M1020 attachment.receipt");
  exact(attachment.receiptSha256, RECEIPT_SHA256, "M1020 attachment.receiptSha256");
  exact(attachment.operation, "dicebox.foundry.fresh-exact-runtime-current-authority", "M1020 attachment.operation");
  exact(attachment.browser, "Chrome external browser", "M1020 attachment.browser");
  exact(attachment.currentUser, "Gamemaster", "M1020 attachment.currentUser");
  exact(attachment.currentUserIsGm, true, "M1020 attachment.currentUserIsGm");
  exact(attachment.activeScene, "DiceBox Tram Routing Projection", "M1020 attachment.activeScene");
  exact(attachment.diceboxControlsObserved, 3, "M1020 attachment.diceboxControlsObserved");
  exact(attachment.foundryControlsObserved, 8, "M1020 attachment.foundryControlsObserved");
  exact(attachment.supervisorPid, 16128, "M1020 attachment.supervisorPid");
  exact(attachment.worldDocumentWrites, 0, "M1020 attachment.worldDocumentWrites");
  exact(attachment.balladTouched, false, "M1020 attachment.balladTouched");
  exact(attachment.adminPasswordConfigured, false, "M1020 attachment.adminPasswordConfigured");
  exact(attachment.extensionNoiseClassified, true, "M1020 attachment.extensionNoiseClassified");
  exact(attachment.resolutionWarning, false, "M1020 attachment.resolutionWarning");
  for (const field of ["noWrite", "noAuthorityGrant", "noExecutionAuthority", "noTransitionAuthority", "noRecoveryAuthority", "noGenericExecutor", "noFoundryWrite", "noProjectMutation", "foreignStatePreserved", "readOnly", "nonCertifying", "producerScopedOnly"] as const) exact(attachment[field], true, `M1020 attachment.${field}`);
  exact(attachment.attachment, "one-fresh-exact-runtime-producer-scoped-non-certifying", "M1020 attachment.attachment");
  exact(attachment.currentAuthority, "partial", "M1020 attachment.currentAuthority");
  exact(attachment.aggregateAuthority, "not-granted", "M1020 attachment.aggregateAuthority");
  exact(attachment.countsChanged, false, "M1020 attachment.countsChanged");
  exact(attachment.stage11AcceptanceStatus, "blocked", "M1020 attachment.stage11AcceptanceStatus");
  exact(attachment.stage12Started, false, "M1020 attachment.stage12Started");
  exact(attachment.readyClaim, false, "M1020 attachment.readyClaim");
  const target = record(attachment.target, "M1020 attachment.target");
  exactKeys(target, ["worldId", "foundryVersion", "systemId", "systemVersion", "diceboxModuleVersion", "port"], "M1020 attachment.target");
  exact(target.worldId, "dbx-test-world", "M1020 attachment.target.worldId");
  exact(target.foundryVersion, "14.367", "M1020 attachment.target.foundryVersion");
  exact(target.systemId, "dnd5e", "M1020 attachment.target.systemId");
  exact(target.systemVersion, "5.3.3", "M1020 attachment.target.systemVersion");
  exact(target.diceboxModuleVersion, "0.1.15", "M1020 attachment.target.diceboxModuleVersion");
  exact(target.port, 30001, "M1020 attachment.target.port");
  const viewport = record(attachment.viewport, "M1020 attachment.viewport");
  exactKeys(viewport, ["width", "height", "minimumWidth", "minimumHeight"], "M1020 attachment.viewport");
  exact(viewport.width, 1920, "M1020 attachment.viewport.width");
  exact(viewport.height, 863, "M1020 attachment.viewport.height");
  exact(viewport.minimumWidth, 1024, "M1020 attachment.viewport.minimumWidth");
  exact(viewport.minimumHeight, 768, "M1020 attachment.viewport.minimumHeight");
  return attachment as ProjectStage11FreshExactRuntimeEvidenceAttachment;
}

export const projectStage11FreshExactRuntimeEvidenceAttachmentSchema = Object.freeze({
  parse(input: unknown): ProjectStage11FreshExactRuntimeEvidenceAttachment {
    return parseAttachment(input);
  },
  safeParse(input: unknown):
    | Readonly<{ success: true; data: ProjectStage11FreshExactRuntimeEvidenceAttachment }>
    | Readonly<{ success: false; error: ProjectStage11FreshExactRuntimeEvidenceAttachmentValidationError }> {
    try {
      return { success: true, data: parseAttachment(input) };
    } catch (error) {
      const validationError = error instanceof ProjectStage11FreshExactRuntimeEvidenceAttachmentValidationError
        ? error
        : new ProjectStage11FreshExactRuntimeEvidenceAttachmentValidationError(error instanceof Error ? error.message : String(error));
      return { success: false, error: validationError };
    }
  },
});
