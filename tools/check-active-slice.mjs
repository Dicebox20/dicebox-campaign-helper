import { readFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";

const VALID_STATUSES = new Set(["pending", "in_progress", "passed"]);
const VALID_EVIDENCE_LABELS = new Set([
  "research",
  "local",
  "staged",
  "fixture",
  "Ballad",
  "player-accepted",
]);
const LANE_NAMES = ["build", "live", "research"];
const EXPECTED_IDEA_DOCUMENT = "https://docs.google.com/document/d/14clSbMu2QMqvokg6Y8svG-QcjSqpse-rO73z66muA7o/edit";
const EXPECTED_SYNCHRONIZATION_ORDER = [
  "accepted-change",
  "roadmap-and-active-checklist",
  "knowledge-base-rebuild-and-verification",
  "implementation",
  "scheduled-shared-document-mirror",
];
const EXPECTED_ISOLATED_WORKSPACE_OPTION = {
  id: "bounded-isolated-workspace-conflict-avoidance-2026-08-26",
  status: "closed-m225-verified",
  scope: "The Foreman may use a separate Codex worktree or project-local disposable workspace for a bounded Worker assignment, risky build, or verification run when isolation reduces overlapping edits, build collisions, runtime-state interference, or evidence ambiguity. The option is not mandatory and cannot create a second Foreman or authority plane.",
  authority: "The canonical roadmap, active card, exact shared idea document, reproducible KB, source repository, and runtime retain their existing authority. Isolated work starts from an identified source state, preserves user and foreign files, excludes shared live-runtime control unless separately authorized, and returns a compact receipt for Foreman review at a clean integration boundary.",
  deterministicCheck: "The workflow checker requires the option's exact authority and prohibition fields, while tests prove it remains optional and does not alter the single active stage, lane limits, synchronization order, or single-Foreman integration boundary.",
  prohibitions: [
    "cannot bypass accepted-change synchronization",
    "cannot grant Foundry authority",
    "cannot auto-promote isolated results",
    "cannot conceal or overwrite conflicting edits",
    "cannot create a competing project goal",
  ],
};
const EXPECTED_WORKFLOW_DOCUMENT = "docs/CAMPAIGN-HELPER-DEVELOPMENT-WORKFLOW-2026-08-26.md";
const EXPECTED_WORKFLOW_VERSION = "2026-08-26.3";
const EXPECTED_SHARED_FILE_SYNCHRONIZATION_SCHEDULE = {
  id: "batched-shared-file-synchronization-2026-08-26",
  status: "implemented-m230-verified",
};
const EXPECTED_BRIDGE_REPOSITORY = {
  owner: "Dicebox20",
  name: "chatgpt-codex-project-bridge",
  intendedUrl: "https://github.com/Dicebox20/chatgpt-codex-project-bridge",
  visibility: "private",
  authority: "communication-and-evidence-mirror-only",
};
const EXPECTED_AUTHORITY_PLANES = [
  "normative-contracts-and-adrs",
  "roadmap-and-active-card",
  "reproducible-development-kb",
  "canonical-project-files-and-content-addressed-assets",
  "sovereign-live-foundry-state",
  "communication-and-evidence-mirrors",
];
const EXPECTED_STAGE_ORDER = [
  "architecture-decisions",
  "desktop-shell-skeleton",
  "semantic-command-spine",
  "rust-geometry-kernel",
  "project-store-and-compiler",
  "foundry-adapter-vertical-slice",
  "subscription-ai-provider-spine",
  "real-project-workspaces",
  "foundry-execution-evidence-foundation",
  "campaign-director-chat",
  "proposal-approval-history",
  "scene-authoring-breadth",
  "desktop-foundry-control",
  "campaign-content-compiler",
  "image-provider-benchmark",
  "product-hardening-release",
];

function nonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function cloneForOutput(value) {
  return value === undefined ? null : value;
}

function arraysEqual(actual, expected) {
  return Array.isArray(actual) && actual.length === expected.length &&
    actual.every((value, index) => value === expected[index]);
}

function validateChangeSynchronization(card, violations) {
  const sync = card?.changeSynchronization;
  if (!sync || typeof sync !== "object" || Array.isArray(sync)) {
    violations.push("changeSynchronization is required.");
    return null;
  }
  if (sync.ideaDocument !== EXPECTED_IDEA_DOCUMENT) {
    violations.push("changeSynchronization.ideaDocument must match the exact shared DiceBox idea document.");
  }
  if (!Array.isArray(sync.order) || sync.order.length !== EXPECTED_SYNCHRONIZATION_ORDER.length ||
      sync.order.some((value, index) => value !== EXPECTED_SYNCHRONIZATION_ORDER[index])) {
    violations.push("changeSynchronization.order must be accepted-change, roadmap-and-active-checklist, knowledge-base-rebuild-and-verification, implementation, scheduled-shared-document-mirror.");
  }
  if (!nonEmptyString(sync.implementationBlockedUntil) ||
      !/roadmap|checklist/i.test(sync.implementationBlockedUntil) ||
      !/scheduled communication mirror/i.test(sync.implementationBlockedUntil) ||
      !/knowledge base/i.test(sync.implementationBlockedUntil)) {
    violations.push("changeSynchronization.implementationBlockedUntil must name the roadmap/checklist, knowledge base, and non-blocking scheduled communication mirror boundary.");
  }
  if (!nonEmptyString(sync.preGateAllowance) ||
      !/read-only inspection/i.test(sync.preGateAllowance) ||
      !/research/i.test(sync.preGateAllowance) ||
      !/emergency containment/i.test(sync.preGateAllowance)) {
    violations.push("changeSynchronization.preGateAllowance must preserve read-only inspection, research, and emergency containment only.");
  }
  return sync;
}

function validateSharedFileSynchronizationSchedule(card, violations) {
  const schedule = card?.sharedFileSynchronizationSchedule;
  if (!schedule || typeof schedule !== "object" || Array.isArray(schedule)) {
    violations.push("sharedFileSynchronizationSchedule is required.");
    return null;
  }
  for (const [field, expected] of Object.entries(EXPECTED_SHARED_FILE_SYNCHRONIZATION_SCHEDULE)) {
    if (schedule[field] !== expected) {
      violations.push(`sharedFileSynchronizationSchedule.${field} must equal ${expected}.`);
    }
  }
  if (!nonEmptyString(schedule.scope) || !/immediate canonical control plane/i.test(schedule.scope) || !/implementation bundle/i.test(schedule.scope) || !/cannot pause/i.test(schedule.scope)) {
    violations.push("sharedFileSynchronizationSchedule.scope must preserve immediate non-blocking local control and explicit implementation bundles.");
  }
  if (!nonEmptyString(schedule.cadence) || !/one routine acceptance update and one routine closure or handoff update per local work session/i.test(schedule.cadence) || !/one routine update in any 24-hour period/i.test(schedule.cadence) || !/never blocks local progress/i.test(schedule.cadence) || !/Monday at 09:00 America\/Los_Angeles/i.test(schedule.cadence)) {
    violations.push("sharedFileSynchronizationSchedule.cadence must preserve the non-blocking Google session/24-hour and GitHub Monday cadence.");
  }
  if (!nonEmptyString(schedule.safetyBoundary) || !/never replaces source-project reread/i.test(schedule.safetyBoundary) || !/hidden reasoning/i.test(schedule.safetyBoundary) || !/local roadmap\/card and KB gate/i.test(schedule.safetyBoundary)) {
    violations.push("sharedFileSynchronizationSchedule.safetyBoundary must preserve source reread, disclosure, and local bundle boundaries.");
  }
  if (!nonEmptyString(schedule.implementationBlockedUntil) || !/exact shared idea document/i.test(schedule.implementationBlockedUntil) || !/database\/seed\.sql/i.test(schedule.implementationBlockedUntil) || !/cannot block a governed local product slice/i.test(schedule.implementationBlockedUntil)) {
    violations.push("sharedFileSynchronizationSchedule.implementationBlockedUntil must retain the non-blocking shared-document record and KB gate.");
  }
  return schedule;
}

function validateIsolatedWorkspaceOption(card, violations) {
  const option = card?.isolatedWorkspaceOption;
  if (!option || typeof option !== "object" || Array.isArray(option)) {
    violations.push("isolatedWorkspaceOption is required.");
    return null;
  }
  for (const field of ["id", "status", "scope", "authority", "deterministicCheck"]) {
    if (option[field] !== EXPECTED_ISOLATED_WORKSPACE_OPTION[field]) {
      violations.push(`isolatedWorkspaceOption.${field} must preserve the accepted M224 value.`);
    }
  }
  if (!arraysEqual(option.prohibitions, EXPECTED_ISOLATED_WORKSPACE_OPTION.prohibitions)) {
    violations.push("isolatedWorkspaceOption.prohibitions must preserve the exact five M224 authority boundaries in order.");
  }
  if (!nonEmptyString(option.knowledgeBaseAuthorization) ||
      !/M224/.test(option.knowledgeBaseAuthorization) ||
      !/F-298/.test(option.knowledgeBaseAuthorization) ||
      !/D-258/.test(option.knowledgeBaseAuthorization) ||
      !/T-271/.test(option.knowledgeBaseAuthorization) ||
      !/M225/.test(option.knowledgeBaseAuthorization) ||
      !/F-299/.test(option.knowledgeBaseAuthorization) ||
      !/D-259/.test(option.knowledgeBaseAuthorization) ||
      !/T-272/.test(option.knowledgeBaseAuthorization)) {
    violations.push("isolatedWorkspaceOption.knowledgeBaseAuthorization must preserve M224/F-298/D-258/T-271 and M225/F-299/D-259/T-272.");
  }
  return option;
}

function validateAcceptedWorkflowChange(card, violations) {
  const accepted = card?.acceptedWorkflowChange;
  if (!accepted || typeof accepted !== "object" || Array.isArray(accepted)) {
    violations.push("acceptedWorkflowChange is required.");
    return null;
  }
  for (const field of ["id", "status", "scope", "acceptanceObservation", "deterministicCheck", "evidenceBoundary"]) {
    if (!nonEmptyString(accepted[field])) violations.push(`acceptedWorkflowChange.${field} must be non-empty.`);
  }

  const workflow = accepted.developmentWorkflow;
  if (!workflow || typeof workflow !== "object" || Array.isArray(workflow)) {
    violations.push("acceptedWorkflowChange.developmentWorkflow is required.");
  } else {
    if (workflow.document !== EXPECTED_WORKFLOW_DOCUMENT) {
      violations.push(`developmentWorkflow.document must be ${EXPECTED_WORKFLOW_DOCUMENT}.`);
    }
    if (workflow.version !== EXPECTED_WORKFLOW_VERSION) {
      violations.push(`developmentWorkflow.version must be ${EXPECTED_WORKFLOW_VERSION}.`);
    }
    if (!arraysEqual(workflow.authorityPlanes, EXPECTED_AUTHORITY_PLANES)) {
      violations.push("developmentWorkflow.authorityPlanes must preserve the exact six authority planes in order.");
    }
    if (workflow.evidenceFoundationStage !== "foundry-execution-evidence-foundation") {
      violations.push("developmentWorkflow.evidenceFoundationStage must be foundry-execution-evidence-foundation.");
    }
    if (workflow.legacyMacroFixture !== "Iggwilv Final Chamber") {
      violations.push("developmentWorkflow.legacyMacroFixture must preserve the Iggwilv Final Chamber evidence identity.");
    }
  }

  const bridge = accepted.communicationRepository;
  if (!bridge || typeof bridge !== "object" || Array.isArray(bridge)) {
    violations.push("acceptedWorkflowChange.communicationRepository is required.");
  } else {
    for (const [field, expected] of Object.entries(EXPECTED_BRIDGE_REPOSITORY)) {
      if (bridge[field] !== expected) {
        violations.push(`communicationRepository.${field} must equal ${expected}.`);
      }
    }
    if (!nonEmptyString(bridge.creationBlockedUntil) || !/shared idea document/i.test(bridge.creationBlockedUntil) || !/KB authorization/i.test(bridge.creationBlockedUntil)) {
      violations.push("communicationRepository.creationBlockedUntil must preserve the shared-document and KB authorization gate.");
    }
  }

  const evidence = accepted.evidenceBoundary ?? "";
  for (const identity of [
    "6a8d229e-48d4-83e8-bb79-defa7247e0ff",
    "qn2AcIJc8oCKymiI",
    "60BE1AA71386C3457BD313E319E7133724E752E1077F396050A056E69E4425A2",
    "460F79B11EA457EC9EFC3DCBE2C8D2C534516054D8247944F26096245DF5CF35",
  ]) {
    if (!evidence.includes(identity)) violations.push(`acceptedWorkflowChange.evidenceBoundary must preserve ${identity}.`);
  }
  return accepted;
}

export function evaluateActiveSlice(card) {
  const violations = [];
  const changeSynchronization = validateChangeSynchronization(card, violations);
  const sharedFileSynchronizationSchedule = validateSharedFileSynchronizationSchedule(card, violations);
  const isolatedWorkspaceOption = validateIsolatedWorkspaceOption(card, violations);
  const acceptedWorkflowChange = validateAcceptedWorkflowChange(card, violations);

  for (const field of ["schemaVersion", "goalId", "outcome", "acceptanceObservation", "owner"]) {
    if (!nonEmptyString(card?.[field])) violations.push(`Missing non-empty ${field}.`);
  }

  const steps = Array.isArray(card?.steps) ? card.steps : [];
  if (steps.length === 0) violations.push("At least one ordered acceptance step is required.");
  if (!arraysEqual(steps.map((step) => step?.id), EXPECTED_STAGE_ORDER)) {
    violations.push("steps must preserve the exact 16-stage DiceBox product order with the Foundry execution/evidence foundation at Stage 9.");
  }
  if (steps.some((step) => step?.id === "utility-harness")) {
    violations.push("utility-harness must not remain a standalone product stage.");
  }

  const ids = new Set();
  for (const [index, step] of steps.entries()) {
    const prefix = `steps[${index}]`;
    if (!nonEmptyString(step?.id)) violations.push(`${prefix}.id must be non-empty.`);
    else if (ids.has(step.id)) violations.push(`Duplicate step id: ${step.id}.`);
    else ids.add(step.id);

    if (!VALID_STATUSES.has(step?.status)) {
      violations.push(`${prefix}.status must be pending, in_progress, or passed.`);
    }
    for (const field of [
      "label",
      "acceptanceObservation",
      "allowedScope",
      "deterministicCheck",
      "liveCheck",
      "stopCondition",
      "requiredEvidenceLabel",
    ]) {
      if (!nonEmptyString(step?.[field])) violations.push(`${prefix}.${field} must be non-empty.`);
    }
    if (!VALID_EVIDENCE_LABELS.has(step?.requiredEvidenceLabel)) {
      violations.push(`${prefix}.requiredEvidenceLabel is invalid.`);
    }
    if (step?.status === "passed") {
      if (!step.evidence || typeof step.evidence !== "object") {
        violations.push(`${prefix} is passed but has no evidence object.`);
      } else {
        if (step.evidence.label !== step.requiredEvidenceLabel) {
          violations.push(`${prefix} evidence label must equal ${step.requiredEvidenceLabel}.`);
        }
        if (!nonEmptyString(step.evidence.observation)) {
          violations.push(`${prefix}.evidence.observation must be non-empty.`);
        }
        if (!Array.isArray(step.evidence.artifacts) || step.evidence.artifacts.length === 0) {
          violations.push(`${prefix}.evidence.artifacts must contain direct evidence.`);
        }
      }
    }
  }

  const evidenceFoundation = steps.find((step) => step?.id === "foundry-execution-evidence-foundation");
  if (evidenceFoundation) {
    const foundationContract = [
      evidenceFoundation.allowedScope,
      evidenceFoundation.deterministicCheck,
      evidenceFoundation.liveCheck,
      evidenceFoundation.stopCondition,
    ].filter(nonEmptyString).join(" ");
    for (const [pattern, message] of [
      [/asset-attestation-before-document-creation|asset attestation/i, "Stage 9 must require asset attestation before dependent document creation."],
      [/canonical installer\/verifier|canonical specification/i, "Stage 9 must derive installer and verifier expectations from one canonical specification."],
      [/hash-drift blocker|hash drift/i, "Stage 9 must block promotion on installed-versus-expected hash drift."],
      [/GM\/player|GM and player/i, "Stage 9 must require GM/player authority and behavior observations."],
    ]) {
      if (!pattern.test(foundationContract)) violations.push(message);
    }
  }

  const firstIncompleteIndex = steps.findIndex((step) => step.status !== "passed");
  const readyClaim = steps.length > 0 && firstIncompleteIndex === -1;
  const activeStep = readyClaim ? null : steps[firstIncompleteIndex];

  if (!readyClaim) {
    if (activeStep?.status !== "in_progress") {
      violations.push("The first incomplete step must be the single in_progress step.");
    }
    for (let index = 0; index < firstIncompleteIndex; index += 1) {
      if (steps[index].status !== "passed") violations.push(`Step ${steps[index].id} skips an earlier gate.`);
    }
    for (let index = firstIncompleteIndex + 1; index < steps.length; index += 1) {
      if (steps[index].status !== "pending") {
        violations.push(`Step ${steps[index].id} must remain pending until ${activeStep?.id} passes.`);
      }
    }
    const inProgress = steps.filter((step) => step.status === "in_progress");
    if (inProgress.length !== 1) violations.push("Exactly one step must be in_progress.");
  } else if (steps.some((step) => step.status === "in_progress")) {
    violations.push("A ready slice cannot retain an in_progress step.");
  }

  if (!readyClaim && !nonEmptyString(card?.nextAction)) {
    violations.push("A non-ready slice requires exactly one explicit nextAction.");
  }

  const lanes = card?.activeLanes ?? {};
  const activeLaneItems = [];
  for (const lane of LANE_NAMES) {
    const values = Array.isArray(lanes[lane]) ? lanes[lane] : [];
    if (values.length > 1) violations.push(`The ${lane} lane has more than one active item.`);
    for (const value of values) {
      activeLaneItems.push({ lane, stepId: value });
      if (!nonEmptyString(value)) violations.push(`The ${lane} lane contains an empty step id.`);
      if (activeStep && value !== activeStep.id) {
        violations.push(`The ${lane} lane points to ${value}, not the current step ${activeStep.id}.`);
      }
    }
  }
  if (!readyClaim && activeLaneItems.length === 0) {
    violations.push("The current step must occupy one build, live, or research lane.");
  }
  if (activeLaneItems.length > 3) violations.push("At most one build, one live, and one research item may be active.");

  const failureControl = card?.failureControl ?? {};
  if (!readyClaim && failureControl.stageId !== activeStep?.id) {
    violations.push("failureControl.stageId must match the current step.");
  }
  const failures = Number(failureControl.failures ?? 0);
  if (!Number.isInteger(failures) || failures < 0) violations.push("failureControl.failures must be a non-negative integer.");
  if (failures >= 2 && failureControl.recoveryMode !== true) {
    violations.push("Second same-class failure reached: stop live retries and enter recoveryMode.");
  }
  if (failureControl.recoveryMode === true) {
    if (!nonEmptyString(failureControl.reproduction)) {
      violations.push("Recovery mode requires a bounded reproduction.");
    }
    if (!nonEmptyString(failureControl.validatedFix)) {
      violations.push("Recovery mode requires a locally validated fix before another live attempt.");
    }
  }

  const passed = steps.filter((step) => step.status === "passed").length;
  const score = steps.length === 0 ? 0 : Math.round((passed / steps.length) * 100);

  return {
    operation: "dicebox.workflow.active-slice.check",
    status: violations.length === 0 ? "PASS" : "FAIL",
    goalId: cloneForOutput(card?.goalId),
    score,
    passedGates: passed,
    totalGates: steps.length,
    activeStage: cloneForOutput(activeStep?.id),
    evidenceLabelRequired: cloneForOutput(activeStep?.requiredEvidenceLabel),
    nextAction: readyClaim ? null : cloneForOutput(card?.nextAction),
    activeLanes: activeLaneItems,
    failureControl: {
      runtimeClass: cloneForOutput(failureControl.runtimeClass),
      failures: Number.isFinite(failures) ? failures : null,
      recoveryMode: failureControl.recoveryMode === true,
    },
    changeSynchronization: changeSynchronization ? {
      ideaDocument: cloneForOutput(changeSynchronization.ideaDocument),
      order: cloneForOutput(changeSynchronization.order),
    } : null,
    sharedFileSynchronizationSchedule: sharedFileSynchronizationSchedule ? {
      id: cloneForOutput(sharedFileSynchronizationSchedule.id),
      status: cloneForOutput(sharedFileSynchronizationSchedule.status),
    } : null,
    isolatedWorkspaceOption: isolatedWorkspaceOption ? {
      id: cloneForOutput(isolatedWorkspaceOption.id),
      status: cloneForOutput(isolatedWorkspaceOption.status),
    } : null,
    acceptedWorkflowChange: acceptedWorkflowChange ? {
      id: cloneForOutput(acceptedWorkflowChange.id),
      workflowDocument: cloneForOutput(acceptedWorkflowChange.developmentWorkflow?.document),
      workflowVersion: cloneForOutput(acceptedWorkflowChange.developmentWorkflow?.version),
      communicationRepository: cloneForOutput(acceptedWorkflowChange.communicationRepository?.intendedUrl),
    } : null,
    readyClaim,
    violations,
  };
}

async function main() {
  const cardPath = process.argv[2] ?? "docs/ACTIVE-TRAM-SLICE.json";
  const card = JSON.parse(await readFile(cardPath, "utf8"));
  const result = evaluateActiveSlice(card);
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  if (result.status !== "PASS") process.exitCode = 1;
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  await main();
}
