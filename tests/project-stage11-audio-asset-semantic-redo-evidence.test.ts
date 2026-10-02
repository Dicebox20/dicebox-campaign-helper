import { describe, expect, it } from "vitest";
import {
  bridgeProjectAudioAssetRegistrationRedoToTerminalHistory,
} from "../apps/campaign-helper-desktop/src/project-audio-asset-terminal-history.js";
import {
  createProjectStage11AudioAssetSemanticRedoEvidence,
  projectStage11AudioAssetSemanticRedoEvidenceSchema,
} from "../apps/campaign-helper-desktop/src/project-stage11-audio-asset-semantic-redo-evidence.js";
import { createAudioAssetRedoExecutionReceipt } from "./project-audio-asset-semantic-redo-fixtures.js";

async function bridgedReceipt() {
  return bridgeProjectAudioAssetRegistrationRedoToTerminalHistory(await createAudioAssetRedoExecutionReceipt());
}

describe("M896 audio-asset semantic redo evidence", () => {
  it("composes the strict audio redo bridge into a non-certifying semantic receipt", async () => {
    const source = await bridgedReceipt();
    expect(source.status).toBe("redone");
    const result = createProjectStage11AudioAssetSemanticRedoEvidence(source);

    expect(result).toMatchObject({
      schemaVersion: "0.1.0",
      milestone: "M896",
      evidenceLabel: "local",
      receipt: "outputs/m896-stage11-audio-asset-semantic-redo-composition-closure-receipt.json",
      status: "bounded-local",
      operation: "project.asset.register-audio.redo",
      semantic: "redo-post-state",
      matchedReread: true,
      generationAdvanced: true,
      contentHashChanged: true,
      assetTreePreserved: true,
      approvedAudioRegistrationPreserved: true,
      scenePreserved: true,
      envelopeRotated: true,
      driftRejected: "audio-asset/content/Scene/envelope/readback identity drift",
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
    expect(result.sourceReceipt.operation).toBe("dicebox.project.asset.register-audio.redo");
    expect(result.sourceReceipt.authoritativeRereads.afterRedo.assets).toEqual(result.sourceReceipt.authoritativeRereads.beforeRedo.assets);
    expect(projectStage11AudioAssetSemanticRedoEvidenceSchema.parse(result)).toEqual(result);
  });

  it("fails closed for semantic, identity, and authority drift", async () => {
    const base = await bridgedReceipt();

    const equalContent = structuredClone(base) as any;
    equalContent.authoritativeRereads.afterRedo.contentSha256 = equalContent.authoritativeRereads.beforeRedo.contentSha256;
    equalContent.matchedReread.sha256 = equalContent.authoritativeRereads.afterRedo.contentSha256;
    equalContent.redoReceipt.contentSha256 = equalContent.authoritativeRereads.afterRedo.contentSha256;
    expect(() => createProjectStage11AudioAssetSemanticRedoEvidence(equalContent)).toThrow(/content|hash|semantic|receipt|project/i);

    const descriptorDrift = structuredClone(base) as any;
    descriptorDrift.asset.label = "foreign audio";
    expect(() => createProjectStage11AudioAssetSemanticRedoEvidence(descriptorDrift)).toThrow(/asset|registration|label/i);

    const authorityDrift = structuredClone(base) as any;
    authorityDrift.noGenericExecutor = false;
    expect(() => createProjectStage11AudioAssetSemanticRedoEvidence(authorityDrift)).toThrow(/generic|authority/i);

    const sceneDrift = structuredClone(base) as any;
    sceneDrift.authoritativeRereads.afterRedo.project.scenesJson[0] = JSON.stringify({
      ...JSON.parse(sceneDrift.authoritativeRereads.afterRedo.project.scenesJson[0]),
      name: "foreign Scene",
    });
    expect(() => createProjectStage11AudioAssetSemanticRedoEvidence(sceneDrift)).toThrow(/Scene|preserv|semantic/i);
  });
});
