import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import {
  createProjectStage11FreshExactRuntimeEvidenceAttachment,
  ProjectStage11FreshExactRuntimeEvidenceAttachmentValidationError,
} from "../apps/campaign-helper-desktop/src/project-stage11-fresh-exact-runtime-evidence-attachment";

const readReceipt = (): unknown => JSON.parse(readFileSync(new URL("../outputs/m1018-stage11-host-window-recovery-and-final-exact-runtime-reread-receipt.json", import.meta.url), "utf8"));

describe("M1020 Stage 11 fresh exact-runtime evidence attachment", () => {
  it("binds the exact receipt as one non-certifying producer-scoped observation", () => {
    const attachment = createProjectStage11FreshExactRuntimeEvidenceAttachment(readReceipt());
    expect(attachment).toMatchObject({
      schemaVersion: "0.1.0",
      milestone: "M1020",
      sourceMilestone: "M1018",
      evidenceLabel: "local",
      receipt: "outputs/m1018-stage11-host-window-recovery-and-final-exact-runtime-reread-receipt.json",
      receiptSha256: "C64E7137308D211BAE4B7C0DD72E239C317C06EE26CE17690205934FA88B4D7C",
      target: { worldId: "dbx-test-world", foundryVersion: "14.367", systemId: "dnd5e", systemVersion: "5.3.3", diceboxModuleVersion: "0.1.15", port: 30001 },
      browser: "Chrome external browser",
      viewport: { width: 1920, height: 863, minimumWidth: 1024, minimumHeight: 768 },
      currentUser: "Gamemaster",
      currentUserIsGm: true,
      activeScene: "DiceBox Tram Routing Projection",
      diceboxControlsObserved: 3,
      foundryControlsObserved: 8,
      supervisorPid: 16128,
      worldDocumentWrites: 0,
      balladTouched: false,
      adminPasswordConfigured: false,
      extensionNoiseClassified: true,
      resolutionWarning: false,
      noWrite: true,
      noAuthorityGrant: true,
      noExecutionAuthority: true,
      noTransitionAuthority: true,
      noRecoveryAuthority: true,
      noGenericExecutor: true,
      noFoundryWrite: true,
      noProjectMutation: true,
      foreignStatePreserved: true,
      readOnly: true,
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
    expect(Object.isFrozen(attachment)).toBe(true);
    expect(Object.isFrozen(attachment.target)).toBe(true);
  });

  it("fails closed and disallows retry for source drift", () => {
    const receipt = readReceipt() as Record<string, unknown>;
    const cases = [
      { ...receipt, unexpected: true },
      { ...receipt, stage: "deployment" },
      { ...receipt, browserObservation: { ...(receipt.browserObservation as Record<string, unknown>), defaultViewport: { innerWidth: 800, innerHeight: 600, minimumWidth: 1024, minimumHeight: 768, meetsMinimum: false } } },
      { ...receipt, limits: { ...(receipt.limits as Record<string, unknown>), playerPasswordsGenerated: true } },
    ];
    for (const candidate of cases) {
      try {
        createProjectStage11FreshExactRuntimeEvidenceAttachment(candidate);
        throw new Error("expected exact-runtime validation to fail");
      } catch (error) {
        expect(error).toBeInstanceOf(ProjectStage11FreshExactRuntimeEvidenceAttachmentValidationError);
        expect((error as ProjectStage11FreshExactRuntimeEvidenceAttachmentValidationError).retryAllowed).toBe(false);
      }
    }
  });
});
