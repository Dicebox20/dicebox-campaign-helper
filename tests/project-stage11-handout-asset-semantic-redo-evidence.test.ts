import { describe, expect, it } from "vitest";
import { bridgeProjectHandoutAssetRegistrationRedoToTerminalHistory } from "../apps/campaign-helper-desktop/src/project-handout-asset-terminal-history.js";
import {
  createProjectStage11HandoutAssetSemanticRedoEvidence,
  projectStage11HandoutAssetSemanticRedoEvidenceSchema,
} from "../apps/campaign-helper-desktop/src/project-stage11-handout-asset-semantic-redo-evidence.js";
import { createHandoutAssetRedoExecutionReceipt } from "./project-handout-asset-semantic-redo-fixtures.js";

async function bridgedReceipt() {
  return bridgeProjectHandoutAssetRegistrationRedoToTerminalHistory(await createHandoutAssetRedoExecutionReceipt());
}

describe("M898 handout-asset semantic redo evidence", () => {
  it("composes the strict handout redo bridge into a non-certifying semantic receipt", async () => {
    const source = await bridgedReceipt();
    expect(source.status).toBe("redone");
    const result = createProjectStage11HandoutAssetSemanticRedoEvidence(source);

    expect(result).toMatchObject({
      schemaVersion: "0.1.0",
      milestone: "M898",
      evidenceLabel: "local",
      receipt: "outputs/m898-stage11-handout-asset-semantic-redo-composition-closure-receipt.json",
      status: "bounded-local",
      operation: "project.asset.register-handout.redo",
      semantic: "redo-post-state",
      matchedReread: true,
      generationAdvanced: true,
      contentHashChanged: true,
      assetTreePreserved: true,
      contentAddressedHandoutRegistrationPreserved: true,
      scenePreserved: true,
      envelopeRotated: true,
      driftRejected: "handout-asset/content/Scene/envelope/readback identity drift",
      readOnly: true,
      nonCertifying: true,
      noExecutionAuthority: true,
      noTransitionAuthority: true,
      noGenericExecutor: true,
      noFoundryWrite: true,
      noProjectMutation: true,
      readyClaim: false,
      stage11AcceptanceStatus: "blocked",
      stage12Started: false,
    });
    expect(result.sourceReceipt.authoritativeRereads.afterRedo.assets).toEqual(result.sourceReceipt.authoritativeRereads.beforeRedo.assets);
    expect(projectStage11HandoutAssetSemanticRedoEvidenceSchema.parse(result)).toEqual(result);
  });

  it("fails closed for semantic, descriptor, Scene, and authority drift", async () => {
    const base = await bridgedReceipt();

    const equalContent = structuredClone(base) as any;
    equalContent.authoritativeRereads.afterRedo.contentSha256 = equalContent.authoritativeRereads.beforeRedo.contentSha256;
    equalContent.matchedReread.sha256 = equalContent.authoritativeRereads.afterRedo.contentSha256;
    equalContent.redoReceipt.contentSha256 = equalContent.authoritativeRereads.afterRedo.contentSha256;
    expect(() => createProjectStage11HandoutAssetSemanticRedoEvidence(equalContent)).toThrow(/content|hash|semantic|receipt|project/i);

    const descriptorDrift = structuredClone(base) as any;
    descriptorDrift.asset.label = "foreign handout";
    expect(() => createProjectStage11HandoutAssetSemanticRedoEvidence(descriptorDrift)).toThrow(/asset|label|descriptor/i);

    const sceneDrift = structuredClone(base) as any;
    sceneDrift.authoritativeRereads.afterRedo.project.scenesJson[0] = JSON.stringify({ id: "dbx:scene:foreign" });
    expect(() => createProjectStage11HandoutAssetSemanticRedoEvidence(sceneDrift)).toThrow(/Scene|preserv|active/i);

    const authorityDrift = structuredClone(base) as any;
    authorityDrift.noTransitionAuthority = false;
    expect(() => createProjectStage11HandoutAssetSemanticRedoEvidence(authorityDrift)).toThrow(/transition|authority/i);
  });
});
