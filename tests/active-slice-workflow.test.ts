import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { evaluateActiveSlice } from "../tools/check-active-slice.mjs";

const root = resolve(import.meta.dirname, "..");
const currentCard = JSON.parse(readFileSync(resolve(root, "docs", "ACTIVE-PROGRAM-SLICE.json"), "utf8"));

function cloneCard() {
  return structuredClone(currentCard);
}

describe("active-slice workflow gate", () => {
  it("accepts the current program slice and returns one next action", () => {
    const result = evaluateActiveSlice(cloneCard());
    expect(result).toMatchObject({
      status: "PASS",
      goalId: "O-116",
      activeStage: "proposal-approval-history",
      evidenceLabelRequired: "local",
      readyClaim: false,
      violations: [],
      changeSynchronization: {
        ideaDocument: "https://docs.google.com/document/d/14clSbMu2QMqvokg6Y8svG-QcjSqpse-rO73z66muA7o/edit",
        order: [
          "accepted-change",
          "roadmap-and-active-checklist",
          "knowledge-base-rebuild-and-verification",
          "implementation",
          "scheduled-shared-document-mirror",
        ],
      },
      sharedFileSynchronizationSchedule: {
        id: "batched-shared-file-synchronization-2026-08-26",
        status: "implemented-m230-verified",
      },
      isolatedWorkspaceOption: {
        id: "bounded-isolated-workspace-conflict-avoidance-2026-08-26",
        status: "closed-m225-verified",
      },
      acceptedWorkflowChange: {
        id: "reconciled-workflow-iggwilv-evidence-and-cross-project-bridge-2026-08-26",
        workflowDocument: "docs/CAMPAIGN-HELPER-DEVELOPMENT-WORKFLOW-2026-08-26.md",
        workflowVersion: "2026-08-26.3",
        communicationRepository: "https://github.com/Dicebox20/chatgpt-codex-project-bridge",
      },
    });
    expect(result.nextAction).toBe(currentCard.nextAction);
    if (typeof result.nextAction !== "string") throw new Error("Workflow checker returned no string next action.");
    expect(result.nextAction.trim().length).toBeGreaterThan(0);
  });

  it("rejects a drifted shared idea-document identity", () => {
    const card = cloneCard();
    card.changeSynchronization.ideaDocument = "https://docs.google.com/document/d/wrong/edit";
    const result = evaluateActiveSlice(card);
    expect(result.status).toBe("FAIL");
    expect(result.violations).toContain("changeSynchronization.ideaDocument must match the exact shared DiceBox idea document.");
  });

  it("rejects a changed synchronization order", () => {
    const card = cloneCard();
    card.changeSynchronization.order = [
      "accepted-change",
      "roadmap-and-active-checklist",
      "shared-idea-document",
      "knowledge-base-rebuild-and-verification",
      "implementation",
      "scheduled-shared-document-mirror",
    ];
    const result = evaluateActiveSlice(card);
    expect(result.status).toBe("FAIL");
    expect(result.violations).toContain("changeSynchronization.order must be accepted-change, roadmap-and-active-checklist, knowledge-base-rebuild-and-verification, implementation, scheduled-shared-document-mirror.");
  });

  it("rejects a missing synchronization gate", () => {
    const card = cloneCard();
    delete card.changeSynchronization;
    const result = evaluateActiveSlice(card);
    expect(result.status).toBe("FAIL");
    expect(result.violations).toContain("changeSynchronization is required.");
  });

  it("rejects isolated-workspace authority or KB-provenance drift", () => {
    const card = cloneCard();
    card.isolatedWorkspaceOption.authority = "A worktree may replace the canonical source.";
    card.isolatedWorkspaceOption.prohibitions.pop();
    card.isolatedWorkspaceOption.knowledgeBaseAuthorization = "M224/F-298/D-258/T-271 only";
    const result = evaluateActiveSlice(card);
    expect(result.status).toBe("FAIL");
    expect(result.violations).toContain("isolatedWorkspaceOption.authority must preserve the accepted M224 value.");
    expect(result.violations).toContain("isolatedWorkspaceOption.prohibitions must preserve the exact five M224 authority boundaries in order.");
    expect(result.violations).toContain("isolatedWorkspaceOption.knowledgeBaseAuthorization must preserve M224/F-298/D-258/T-271 and M225/F-299/D-259/T-272.");
  });

  it("rejects drift in the governing workflow version and authority planes", () => {
    const card = cloneCard();
    card.acceptedWorkflowChange.developmentWorkflow.version = "2026-08-26.2";
    card.acceptedWorkflowChange.developmentWorkflow.authorityPlanes.reverse();
    const result = evaluateActiveSlice(card);
    expect(result.status).toBe("FAIL");
    expect(result.violations).toContain("developmentWorkflow.version must be 2026-08-26.3.");
    expect(result.violations).toContain("developmentWorkflow.authorityPlanes must preserve the exact six authority planes in order.");
  });

  it("rejects shared-file cadence, local-control, or disclosure-boundary drift", () => {
    const card = cloneCard();
    card.sharedFileSynchronizationSchedule.cadence = "Write every local implementation step.";
    card.sharedFileSynchronizationSchedule.safetyBoundary = "The mirror replaces source project reread.";
    const result = evaluateActiveSlice(card);
    expect(result.status).toBe("FAIL");
    expect(result.violations).toContain("sharedFileSynchronizationSchedule.cadence must preserve the non-blocking Google session/24-hour and GitHub Monday cadence.");
    expect(result.violations).toContain("sharedFileSynchronizationSchedule.safetyBoundary must preserve source reread, disclosure, and local bundle boundaries.");
  });

  it("rejects drift in the private communication-repository identity or authority", () => {
    const card = cloneCard();
    card.acceptedWorkflowChange.communicationRepository.intendedUrl = "https://github.com/Dicebox20/wrong";
    card.acceptedWorkflowChange.communicationRepository.visibility = "public";
    const result = evaluateActiveSlice(card);
    expect(result.status).toBe("FAIL");
    expect(result.violations).toContain("communicationRepository.intendedUrl must equal https://github.com/Dicebox20/chatgpt-codex-project-bridge.");
    expect(result.violations).toContain("communicationRepository.visibility must equal private.");
  });

  it("rejects stage-order drift and restoration of a standalone Utility Harness stage", () => {
    const card = cloneCard();
    card.steps[8].id = "utility-harness";
    const result = evaluateActiveSlice(card);
    expect(result.status).toBe("FAIL");
    expect(result.violations).toContain("steps must preserve the exact 16-stage DiceBox product order with the Foundry execution/evidence foundation at Stage 9.");
    expect(result.violations).toContain("utility-harness must not remain a standalone product stage.");
  });

  it("rejects a Stage 9 contract that loses canonical verification and promotion blockers", () => {
    const card = cloneCard();
    const foundation = card.steps.find((step: { id: string }) => step.id === "foundry-execution-evidence-foundation");
    if (!foundation) throw new Error("Foundry execution/evidence foundation fixture is missing.");
    foundation.allowedScope = "Typed Foundry IR only.";
    foundation.deterministicCheck = "IR tests pass.";
    foundation.liveCheck = "Run one fixture.";
    foundation.stopCondition = "Stop on failure.";
    const result = evaluateActiveSlice(card);
    expect(result.status).toBe("FAIL");
    expect(result.violations).toContain("Stage 9 must require asset attestation before dependent document creation.");
    expect(result.violations).toContain("Stage 9 must derive installer and verifier expectations from one canonical specification.");
    expect(result.violations).toContain("Stage 9 must block promotion on installed-versus-expected hash drift.");
    expect(result.violations).toContain("Stage 9 must require GM/player authority and behavior observations.");
  });

  it("rejects advancing a later gate before the active program stage passes", () => {
    const card = cloneCard();
    const later = card.steps.find((step: { id: string }) => step.id === "image-provider-benchmark");
    if (!later) throw new Error("Image-provider stage fixture is missing.");
    later.status = "in_progress";
    const result = evaluateActiveSlice(card);
    expect(result.status).toBe("FAIL");
    expect(result.violations).toContain("Exactly one step must be in_progress.");
  });

  it("rejects more than one item in a workflow lane", () => {
    const card = cloneCard();
    card.activeLanes.build.push("subscription-ai-provider-spine");
    const result = evaluateActiveSlice(card);
    expect(result.status).toBe("FAIL");
    expect(result.violations).toContain("The build lane has more than one active item.");
  });

  it("requires direct evidence before a gate can pass", () => {
    const card = cloneCard();
    card.steps[0].evidence = null;
    const result = evaluateActiveSlice(card);
    expect(result.status).toBe("FAIL");
    expect(result.violations).toContain("steps[0] is passed but has no evidence object.");
  });

  it("stops a same-class retry after the second failure until recovery is proved", () => {
    const card = cloneCard();
    card.failureControl.failures = 2;
    card.failureControl.recoveryMode = false;
    card.failureControl.reproduction = null;
    card.failureControl.validatedFix = null;
    let result = evaluateActiveSlice(card);
    expect(result.status).toBe("FAIL");
    expect(result.violations).toContain("Second same-class failure reached: stop live retries and enter recoveryMode.");

    card.failureControl.recoveryMode = true;
    card.failureControl.reproduction = "Reproduced the local View failure without any Foundry write.";
    card.failureControl.validatedFix = "Focused local check proves the narrow view-selection fix.";
    result = evaluateActiveSlice(card);
    expect(result.status).toBe("PASS");
  });
});
