import { describe, expect, it } from "vitest";
import { createProjectStage11FoundryInverseEvidence } from "../apps/campaign-helper-desktop/src/project-stage11-foundry-inverse-evidence";

const m802 = () => ({
  receiptVersion: 1,
  milestone: "M802",
  operation: "program-scene.inverse.apply",
  status: "PASS",
  evidenceClass: "fixture",
  target: { worldId: "dbx-test-world", port: 30003, foundry: "14.367", system: "dnd5e@5.3.3" },
  currentActiveGm: true,
  freshPreview: "PASS",
  actionTimeConfirmation: true,
  sceneDeleted: true,
  authoritativeReread: true,
  deletedScene: { stableId: "dbx:scene:desktop-shell-fixture", owned: true },
  foreignWorldScenesBefore: 1,
  foreignWorldScenesAfter: 1,
  foreignStatePreserved: true,
  retryPerformed: false,
  receiptClosed: true,
  supervisorAfter: { status: "PASS", worldDocumentWrites: 0, balladTouched: false },
  stage11Accepted: false,
  stage12Started: false,
  readyClaim: false,
  deleteInvoked: true,
  nextAction: "Fresh read-only Stage 11 reconciliation before selecting one bounded remaining gap.",
});

describe("M803 Stage 11 Foundry inverse evidence", () => {
  it("classifies one confirmed Foundry producer observation without promotion", () => {
    expect(createProjectStage11FoundryInverseEvidence(m802())).toMatchObject({
      status: "PASS",
      disposition: "one-producer-scoped-foundry-fixture-observation",
      observedLifecycleCount: 1,
      producerScopedOnly: true,
      foundryMutationObserved: true,
      foreignStatePreserved: true,
      authoritativeReread: true,
      noRetry: true,
      noAuthorityGrant: true,
      noCoverageClaim: true,
      noFoundryAuthority: true,
      noExecutionAuthority: true,
      noRecoveryAuthority: true,
      stage11AcceptanceStatus: "blocked",
      stage12Started: false,
      readyClaim: false,
    });
  });

  it("fails closed for non-owned, unconfirmed, drifted, or promoted receipts", () => {
    expect(() => createProjectStage11FoundryInverseEvidence({ ...m802(), actionTimeConfirmation: false })).toThrow(/actionTimeConfirmation/);
    expect(() => createProjectStage11FoundryInverseEvidence({ ...m802(), deletedScene: { stableId: "foreign", owned: true } })).toThrow(/stableId/);
    expect(() => createProjectStage11FoundryInverseEvidence({ ...m802(), foreignWorldScenesAfter: 2 })).toThrow(/foreignWorldScenesAfter/);
    expect(() => createProjectStage11FoundryInverseEvidence({ ...m802(), stage11Accepted: true })).toThrow(/stage11Accepted/);
  });
});
