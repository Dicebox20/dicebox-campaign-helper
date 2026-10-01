import { describe, expect, it } from "vitest";
import { bridgeProjectTokenAssetRegistrationRedoToTerminalHistory } from "../apps/campaign-helper-desktop/src/project-token-asset-terminal-history.js";
import {
  createProjectStage11TokenAssetSemanticRedoEvidence,
  projectStage11TokenAssetSemanticRedoEvidenceSchema,
} from "../apps/campaign-helper-desktop/src/project-stage11-token-asset-semantic-redo-evidence.js";
import {
  approveProposalBatch,
  beginProposalApply,
  commitProposalAfterReread,
  createProposalBatch,
  previewProposalBatch,
  redoProposalBatch,
  undoProposalBatch,
} from "../packages/dicebox-core/src/index.js";

const projectId = "dbx:project:m727-token";
const batchId = "dbx:proposal:m727-token";
const commandId = "dbx:proposal-command:m727-token";
const sceneId = "dbx:scene:m727-token";
const assetSha256 = "d".repeat(64);
const assetId = `dbx:asset:sha256-${assetSha256}`;
const observed = (second: number) => `2026-08-31T00:00:${String(second).padStart(2, "0")}.000Z`;

function tokenAsset() {
  return {
    sha256: assetSha256,
    mediaType: "image/webp",
    byteLength: 32,
    relativePath: "assets/tokens/m727-token.webp",
    registration: { assetId, role: "token", label: "M727 token", provenance: "user-import" },
  };
}

function registeredAsset() {
  return { assetId, sha256: assetSha256, mediaType: "image/webp", byteLength: 32, relativePath: "assets/tokens/m727-token.webp", disposition: "PRESENT_VALID" };
}

function projectRead(generation: number, contentSha256: string, assetCollectionSha256: string, primaryByteSha256: string, backupByteSha256: string) {
  const assets = generation === 2 ? [] : [tokenAsset()];
  const registeredAssets = assets.length === 0 ? [] : [registeredAsset()];
  return {
    projectId,
    generation,
    contentSha256,
    sceneContentSha256: "a".repeat(64),
    assetCollectionSha256,
    activeSceneId: sceneId,
    sceneCount: 1,
    assetCount: assets.length,
    assets,
    primaryByteSha256,
    backupByteSha256,
    catalog: {
      operation: "dicebox.project.catalog",
      status: "PASS",
      entries: [{ projectId, status: "PASS", generation, contentSha256, sceneCount: 1, assetCount: assets.length, displayName: "M727" }],
      workspaceIndexGeneration: generation + 10,
      noWrite: true,
      noFoundryWrite: true,
    },
    catalogEntry: { projectId, status: "PASS", generation, contentSha256, sceneCount: 1, assetCount: assets.length, displayName: "M727" },
    project: {
      scenesJson: [JSON.stringify({ id: sceneId })],
      activeSceneId: sceneId,
      assets,
      receipt: { operation: "dicebox.project.load", status: "PASS", projectId, generation, contentSha256, activeSceneId: sceneId, sceneCount: 1, assetCount: assets.length, noFoundryWrite: true },
    },
    recovery: {
      operation: "dicebox.project.recovery.inspect",
      status: "PASS",
      projectId,
      generation,
      contentSha256,
      noWrite: true,
      noFoundryWrite: true,
      primary: { status: "VALID", byteSha256: primaryByteSha256 },
      backup: { status: "VALID", byteSha256: backupByteSha256 },
      registeredAssets,
    },
    noWrite: true,
    noFoundryWrite: true,
  };
}

async function createTokenAssetRedoExecutionReceipt(overrides: Record<string, unknown> = {}) {
  const batch = await createProposalBatch({
    schemaVersion: "0.1.0",
    batchId,
    revision: 0,
    previousBatchSha256: null,
    producer: { kind: "project-store", sourceId: "desktop.project.asset.register-token", provider: null },
    reviewAuthority: { domain: "human-review", requiredRole: "reviewer" },
    targetAuthority: { domain: "local-project", requiredActiveGm: false },
    risk: "high",
    base: { targetId: projectId, revision: 2, sha256: "c".repeat(64) },
    commands: [{ commandId, kind: "project.asset.register-token", dependsOn: [], payload: { operation: "project.asset.register-token", projectId } }],
    createdAt: observed(0),
  });
  let history = await previewProposalBatch(batch, { actorId: "requester", role: "requester" }, observed(1));
  history = await approveProposalBatch(history, batch, { actorId: "reviewer", role: "reviewer" }, batch.base, observed(2));
  history = await beginProposalApply(history, batch, { actorId: "reviewer", role: "reviewer" }, batch.base, observed(3));
  history = await commitProposalAfterReread(history, batch, { actorId: "reviewer", role: "reviewer" }, { status: "matched", targetId: projectId, revision: 3, sha256: "e".repeat(64) }, observed(4));
  history = await undoProposalBatch(history, batch, { actorId: "reviewer", role: "reviewer" }, { status: "matched", targetId: projectId, revision: 4, sha256: "f".repeat(64) }, observed(5));
  const afterRedo = projectRead(5, "7".repeat(64), "2".repeat(64), "5".repeat(64), "4".repeat(64));
  history = await redoProposalBatch(history, batch, { actorId: "reviewer", role: "reviewer" }, { status: "matched", targetId: projectId, revision: 5, sha256: "7".repeat(64) }, observed(6));
  return {
    operation: "dicebox.project.asset.register-token.redo",
    status: "PASS",
    projectId,
    batchId,
    asset: { assetId, assetSha256, mediaType: "image/webp", role: "token", label: "M727 token", provenance: "user-import" },
    beforeRedo: projectRead(4, "f".repeat(64), "2".repeat(64), "4".repeat(64), "3".repeat(64)),
    afterRedo,
    redoReceipt: { operation: "dicebox.project.save", status: "PASS", projectId, generation: 5, contentSha256: "7".repeat(64), sceneSha256: "a".repeat(64), sceneCount: 1, activeSceneId: sceneId, scenes: [{ sceneId, sceneSha256: "a".repeat(64) }], assetCount: 1, projectRelativePath: "projects/m727-token/project.json", atomicReplace: true, directoryEntrySync: true, backupPreserved: true, noFoundryWrite: true },
    history,
    matchedReread: { status: "matched", targetId: projectId, revision: 5, sha256: "7".repeat(64) },
    projectContentWrite: false,
    assetBytesPersisted: false,
    assetTreePreserved: true,
    sceneContentRestored: false,
    noProjectMutation: true,
    noFoundryWrite: true,
    ...overrides,
  };
}

async function bridgedReceipt() {
  return bridgeProjectTokenAssetRegistrationRedoToTerminalHistory(await createTokenAssetRedoExecutionReceipt());
}

describe("M900 token-asset semantic redo evidence", () => {
  it("composes the strict token redo bridge into a non-certifying semantic receipt", async () => {
    const source = await bridgedReceipt();
    expect(source.status).toBe("redone");
    const result = createProjectStage11TokenAssetSemanticRedoEvidence(source);

    expect(result).toMatchObject({
      schemaVersion: "0.1.0",
      milestone: "M900",
      evidenceLabel: "local",
      receipt: "outputs/m900-stage11-token-asset-semantic-redo-composition-closure-receipt.json",
      status: "bounded-local",
      operation: "project.asset.register-token.redo",
      semantic: "redo-post-state",
      matchedReread: true,
      generationAdvanced: true,
      contentHashChanged: true,
      assetTreePreserved: true,
      contentAddressedTokenRegistrationPreserved: true,
      scenePreserved: true,
      envelopeRotated: true,
      driftRejected: "token-asset/content/Scene/envelope/readback identity drift",
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
    expect(projectStage11TokenAssetSemanticRedoEvidenceSchema.parse(result)).toEqual(result);
  });

  it("fails closed for semantic, descriptor, Scene, and authority drift", async () => {
    const base = await bridgedReceipt();

    const equalContent = structuredClone(base) as any;
    equalContent.authoritativeRereads.afterRedo.contentSha256 = equalContent.authoritativeRereads.beforeRedo.contentSha256;
    equalContent.matchedReread.sha256 = equalContent.authoritativeRereads.afterRedo.contentSha256;
    equalContent.redoReceipt.contentSha256 = equalContent.authoritativeRereads.afterRedo.contentSha256;
    expect(() => createProjectStage11TokenAssetSemanticRedoEvidence(equalContent)).toThrow(/content|hash|semantic|receipt|project/i);

    const descriptorDrift = structuredClone(base) as any;
    descriptorDrift.asset.label = "foreign token";
    expect(() => createProjectStage11TokenAssetSemanticRedoEvidence(descriptorDrift)).toThrow(/asset|label|descriptor/i);

    const sceneDrift = structuredClone(base) as any;
    sceneDrift.authoritativeRereads.afterRedo.project.scenesJson[0] = JSON.stringify({ id: "dbx:scene:foreign" });
    expect(() => createProjectStage11TokenAssetSemanticRedoEvidence(sceneDrift)).toThrow(/Scene|preserv|active/i);

    const authorityDrift = structuredClone(base) as any;
    authorityDrift.noTransitionAuthority = false;
    expect(() => createProjectStage11TokenAssetSemanticRedoEvidence(authorityDrift)).toThrow(/transition|authority/i);
  });
});
