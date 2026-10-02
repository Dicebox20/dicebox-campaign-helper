import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { createProjectAggregateCurrentAuthorityEvidence } from "../apps/campaign-helper-desktop/src/project-aggregate-current-authority-evidence";
import { createProjectCrossProducerLifecycleContinuityEvidence } from "../apps/campaign-helper-desktop/src/project-cross-producer-lifecycle-continuity-evidence";
import { createProjectStage11AggregateEvidenceLedger } from "../apps/campaign-helper-desktop/src/project-stage11-aggregate-evidence-ledger";
import { createProjectStage11ProposalSemanticEvidence } from "../apps/campaign-helper-desktop/src/project-stage11-proposal-semantic-evidence";
import { createProjectStage11SemanticRedoEvidence } from "../apps/campaign-helper-desktop/src/project-stage11-semantic-redo-evidence";

const fixture = () => ({ evidenceLabel: "fixture", operation: "dicebox.runtime-evidence.diagnostic", status: "OBSERVED", redacted: true, noWrite: true, exactTargetMatch: true, activeGmObserved: true, readiness: { pass: 10, blocked: 1, unknown: 0, total: 11 } });
const packageStage = () => ({ evidenceLabel: "fixture", operation: "foundry.module.update", status: "PARTIAL", target: { foundryVersion: "14.367", systemId: "dnd5e", systemVersion: "5.3.3" }, sourceAndServedHashesMatch: true, diagnosticMarkersPresent: true, noWorldMutation: true, worldDocumentWrites: 0, balladTouched: false, nativeGmDialog: "NOT_OBSERVED", browserControlRuntime: "unavailable", retryAttempted: false });
const dialog = () => ({ evidenceLabel: "fixture", operation: "dicebox.current-active-gm-authority.diagnostic", status: "OBSERVED", target: { foundryVersion: "14.367", systemId: "dnd5e", systemVersion: "5.3.3" }, currentUserIsGm: true, currentUserMatchesActiveGm: true, redacted: true, noWrite: true, noPermissionClaim: true, noExecutionAuthority: true, readyClaim: false, worldDocumentWrites: 0, balladTouched: false });
const ownedScenePermission = () => ({ evidenceLabel: "fixture", operation: "dicebox.owned-scene-permission.diagnostic", status: "OBSERVED", target: { worldId: "dbx-test-world", foundryVersion: "14.367", systemId: "dnd5e", systemVersion: "5.3.3", port: 30003 }, stableId: "dbx:scene:desktop-shell-fixture", ownedSceneCanUpdate: true, redacted: true, noWrite: true, noUpdateInvoked: true, noGenericAuthorityClaim: true, noExecutionAuthority: true, readyClaim: false, shutdown: { status: "STOPPED", worldDocumentWrites: 0, balladTouched: false } });
const foundryInverse = () => ({ receiptVersion: 1, milestone: "M802", operation: "program-scene.inverse.apply", status: "PASS", evidenceClass: "fixture", target: { worldId: "dbx-test-world", port: 30003, foundry: "14.367", system: "dnd5e@5.3.3" }, currentActiveGm: true, freshPreview: "PASS", actionTimeConfirmation: true, deleteInvoked: true, sceneDeleted: true, authoritativeReread: true, deletedScene: { stableId: "dbx:scene:desktop-shell-fixture", owned: true }, foreignWorldScenesBefore: 1, foreignWorldScenesAfter: 1, foreignStatePreserved: true, retryPerformed: false, receiptClosed: true, supervisorAfter: { status: "PASS", worldDocumentWrites: 0, balladTouched: false }, stage11Accepted: false, stage12Started: false, readyClaim: false, nextAction: "Fresh read-only Stage 11 reconciliation before selecting one bounded remaining gap." });
const foundryForward = () => ({ receiptVersion: 1, milestone: "M830", operation: "program-scene.apply-recovery-drill", status: "PASS", evidenceClass: "fixture", target: { worldId: "dbx-test-world", foundry: "14.367", system: "dnd5e@5.3.3", user: "Gamemaster", port: 30003 }, preview: { status: "PASS", noWrite: true, planSha256: "10c4925a5eabdb7c0f6537440d2f083b1c999ca27fd6719f61f36eafed946c1e", assetSha256: "7adeb330329550eb18753187e8dbf001815bf22e056f14bc2cdc76188b0cf852", assetBytes: 20655, existingComplete: false }, apply: { status: "UNKNOWN", sceneCreated: true, responseDisposition: "intentionally-discarded-after-commit", retryAllowed: false }, recovery: { status: "PASS", authoritativeReread: true, recoveredFromUnknown: true, retryPerformed: false, foreignStatePreserved: true, sceneStableId: "dbx:scene:desktop-shell-fixture", sceneRuntimeId: "Scene.UpjxmDyJLxrcIDUD", initialLevel: 1, walls: 5, regions: 2, tiles: 1 }, shutdown: { status: "STOPPED", listeners: [], worldDocumentWrites: 0, balladTouched: false, stopMethod: "exact-owner-force-fallback-after-normal-termination-refusal" }, limits: { onlyFixedProgramSceneControlUsed: true, noM819PredicateObservation: true, noInverseControl: true, noOtherControl: true, stage11Accepted: false, stage12Entered: false, readyClaim: false } });
const directLocalLifecycle = () => ({ schemaVersion: "0.1.0", status: "PASS", disposition: "two-producer-scoped-local-observations", observations: [{ milestone: "M466", producer: "project.recovery.backup-promotion", lifecycle: "preview-proposal-approval-apply-reread" }, { milestone: "M645", producer: "project.save", lifecycle: "preview-approval-save-reread-inverse-restore" }], observedLifecycleCount: 2, producerScopedOnly: true, readOnly: true, noAuthorityGrant: true, noCoverageClaim: true, noFoundryAuthority: true, noExecutionAuthority: true, noRecoveryAuthority: true, noFoundryWrite: true, stage11AcceptanceStatus: "blocked", stage12Started: false });
const directHumanProposal = () => ({ schemaVersion: "0.1.0", status: "PASS", disposition: "one-producer-scoped-local-browser-observation", observations: [{ milestone: "M306", producer: "human", lifecycle: "preview-approval-apply-reread-undo-redo" }], observedLifecycleCount: 1, producerScopedOnly: true, localBrowserObserved: true, previewNoWrite: true, approvalNoWrite: true, applyRereadMatched: true, undoRereadMatched: true, redoRereadMatched: true, browserDiagnosticsEmpty: true, readOnly: true, nonCertifying: true, noAuthorityGrant: true, noCoverageClaim: true, noFoundryAuthority: true, noExecutionAuthority: true, noProjectMutation: true, stage11AcceptanceStatus: "blocked", stage12Started: false, readyClaim: false });
const directCampaignDirectorProposal = () => ({ schemaVersion: "0.1.0", status: "PASS", disposition: "one-producer-scoped-local-browser-observation", observations: [{ milestone: "M303", producer: "campaign-director", lifecycle: "preview-approval-apply-reread-undo-redo-stale-invalidation" }], observedLifecycleCount: 1, producerScopedOnly: true, localBrowserObserved: true, previewNoWrite: true, approvalNoWrite: true, applyRereadMatched: true, undoRereadMatched: true, redoRereadMatched: true, staleInvalidated: true, browserDiagnosticsEmpty: true, readOnly: true, nonCertifying: true, noAuthorityGrant: true, noCoverageClaim: true, noFoundryAuthority: true, noExecutionAuthority: true, noProjectMutation: true, stage11AcceptanceStatus: "blocked", stage12Started: false, readyClaim: false });
const updateWitness = () => ({ receiptVersion: 1, milestone: "M848", operation: "program-scene.update-witness.apply", status: "PARTIAL", evidenceClass: "fixture", fixture: { dataRoot: "work/foundry-fixture-data-v4", worldId: "dbx-test-world", port: 30003, foundry: "14.367", system: "dnd5e 5.3.3", user: "Gamemaster", password: "blank" }, sourceAndStagedProgramSceneSha256: "916196925B1F8A3D225F75210DA0645FBE42C200BB826B38736E056E463FBABD", control: { label: "Run DiceBox owned-Scene update witness", visibleToGamemaster: true }, preview: { status: "PASS", operation: "program-scene.update-witness.preview", noWrite: true, stableId: "dbx:scene:desktop-shell-fixture", baseline: "absent", activeGMPassed: true }, apply: { status: "PASS", noWrite: false, stableId: "dbx:scene:desktop-shell-fixture", managedField: "dicebox-campaign-helper.stage11UpdateWitness", updateInvoked: true, authoritativeReread: true, restorationReread: true, foreignStatePreserved: true, retryPerformed: false, stage11Accepted: false, stage12Started: false, readyClaim: false }, independentReread: { status: "UNAVAILABLE", method: "supported browser-isolated read-only page-scope evaluator", reason: "Foundry game runtime object was unavailable in that isolated context; no generic evaluator or retry was used." }, closure: { tabClosed: true, finalFixtureStatus: "STOPPED/no listener", worldDocumentWrites: 0, balladTouched: false }, stage11AcceptanceStatus: "blocked", stage12Started: false, readyClaim: false });
const witnessReread = () => ({ receiptVersion: 1, milestone: "M854", operation: "program-scene.update-witness.reread", status: "PASS", evidenceClass: "fixture", fixture: { dataRoot: "work/foundry-fixture-data-v4", worldId: "dbx-test-world", port: 30003, foundry: "14.367", system: "dnd5e 5.3.3", user: "Gamemaster", password: "blank" }, sourceAndStagedProgramSceneSha256: "3A063C2DEC5A4BF7AD7B6B13CE602FF4EDCF32071C419E3AD7C5D265274113AB", control: { label: "Show DiceBox owned-Scene witness reread", visibleToGamemaster: true }, observation: { status: "OBSERVED", noWrite: true, stableId: "dbx:scene:desktop-shell-fixture", complete: true, counts: { walls: 5, regions: 2, tiles: 1 }, updateWitnessBaseline: "absent", foreignWorldScenes: 1, authoritativeReread: true, noGenericQuery: true, noUpdateInvoked: true, retryPerformed: false, stage11Accepted: false, stage12Started: false, readyClaim: false }, closure: { tabClosed: true, finalFixtureStatus: "STOPPED/no listener", worldDocumentWrites: 0, balladTouched: false }, stage11AcceptanceStatus: "blocked", stage12Started: false, readyClaim: false });
const packagedRuntimeDiagnostic = () => ({ receiptVersion: 1, receiptId: "dbx:receipt:m773-stage11-packaged-diagnostic-staging-and-readback-closure-2026-08-31", milestone: "M773", stage: "proposal-approval-history", evidenceLabel: "fixture", status: "PASS FIXTURE READBACK; NON-CERTIFYING", readyClaim: false, target: { dataPath: "work/foundry-fixture-data-v4", worldId: "dbx-test-world", port: 30003, foundryVersion: "14.367", system: "dnd5e@5.3.3", package: "dicebox-campaign-helper@0.1.15" }, stagedArtifact: { moduleSha256: "B7329E018062CEF2AB73416F90B097648F37F7A11B44C9112F86BB553D1EF597", entrySha256: "DB39BC0362EF23574813A4F5EF69265ED3EACE31FE75B510747662A84AE66779", entry: "src/entry-20260823-program-scene-v2.js -> module.js?dbx=0.1.17", stageOperation: "foundry.module.update", noWorldMutation: true }, runtimeReadback: { visibleActiveGm: "Gamemaster [GM]", control: "Show DiceBox Runtime Evidence Diagnostics", operation: "dicebox.runtime-evidence.diagnostic", status: "OBSERVED", redacted: true, noWrite: true, exactTargetMatch: true, readiness: { status: "blocked", pass: 10, blocked: 1, unknown: 0, total: 11 }, remainingBlocker: "Exact-runtime behavior and permission proof remains separately blocked." }, authoritativeReread: { supervisorStatus: "PASS", pid: 14220, worldDocumentWrites: 0, balladTouched: false, sourceAndStagedHashesMatch: true }, preservation: { projectWrites: 0, settingsWrites: 0, foundryDocumentWrites: 0, providerOrCredentialActivity: false, playerPasswordsGenerated: false, stage11Accepted: false, stage12Started: false }, notes: ["The first update attempt used the fixture parent rather than its owned Data directory and was refused before mutation; the corrected explicit Data root update passed.", "The supervisor performed its standard exact-owned restart recovery; this is fixture process evidence, not live behavior or authority certification."], next: "M774 may only reconcile the new fixture evidence with the still-partial Stage 11 clauses and select one bounded remaining gap." });
const packagedAssetDetach = () => JSON.parse(readFileSync(new URL("../outputs/m582-stage11-selected-missing-asset-detach-packaged-observation-closure-receipt.json", import.meta.url), "utf8")) as unknown;
const packagedAssetRestore = () => JSON.parse(readFileSync(new URL("../outputs/m593-stage11-asset-restore-fresh-v3-packaged-observation-closure-receipt.json", import.meta.url), "utf8")) as unknown;
const packagedBrokenReference = () => JSON.parse(readFileSync(new URL("../outputs/m552-stage11-broken-reference-ui-v4-packaged-observation-closure-receipt.json", import.meta.url), "utf8")) as unknown;
const backupPromotionRecovery = () => JSON.parse(readFileSync(new URL("../outputs/m466-stage11-backup-promotion-closure-receipt.json", import.meta.url), "utf8")) as unknown;
const packagedCrossProducer = () => JSON.parse(readFileSync(new URL("../outputs/m942-stage11-fresh-v5-packaged-desktop-observation-closure-receipt.json", import.meta.url), "utf8")) as unknown;
const proposalSemantic = () => createProjectStage11ProposalSemanticEvidence();
const semanticRedo = () => createProjectStage11SemanticRedoEvidence({
  schemaVersion: "0.1.0",
  milestone: "M890",
  evidenceLabel: "local",
  receipt: "outputs/m890-stage11-operation-specific-semantic-redo-composition-closure-receipt.json",
  status: "bounded-local",
  operationSemantics: [
    { operation: "project.save", semantic: "redo-post-state", matchedReread: true, generationAdvanced: true, envelopeRotated: true, semanticHashChangedInFixture: true, semanticHashValidation: "shape-only", driftRejected: "content-hash/redo-receipt identity drift" },
    { operation: "project.add-scene.persist", semantic: "redo-post-state", matchedReread: true, generationAdvanced: true, envelopeRotated: true, sceneAppended: true, activeSceneSelected: true, assetsPreserved: true, driftRejected: "Scene-set/readback identity drift" },
  ],
  saveSemanticHash: "shape-only",
  backupPromotionUndoRedo: "not-applicable-one-way",
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

function aggregateWith(semantic: unknown, redo: unknown, persistentAddSceneSemanticRedo?: unknown, audioAssetSemanticRedo?: unknown, handoutAssetSemanticRedo?: unknown, tokenAssetSemanticRedo?: unknown, assetBindSemanticRedo?: unknown, saveAsSemanticRedo?: unknown, renameSemanticRedo?: unknown, createSemanticRedo?: unknown, inMemoryAddSceneSemanticRedo?: unknown, nativeCrossProducerConformance?: unknown, packagedCrossProducerInput?: unknown, loadedAuthorityControlInput?: unknown, projectSaveCurrentAuthorityLifecycleInput?: unknown, projectSaveRedoHandlerClassifierAggregateInput?: unknown, projectPersistentAddSceneRedoHandlerClassifierAggregateInput?: unknown, projectRenameRedoHandlerClassifierAggregateInput?: unknown, projectSaveAsRedoHandlerClassifierAggregateInput?: unknown, projectCreateRedoHandlerClassifierAggregateInput?: unknown, projectHandoutAssetRedoHandlerClassifierAggregateInput?: unknown, projectAudioAssetRedoHandlerClassifierAggregateInput?: unknown, projectTokenAssetRedoHandlerClassifierAggregateInput?: unknown, projectAssetBindRedoHandlerClassifierAggregateInput?: unknown, projectInMemoryAddSceneRedoHandlerClassifierAggregateInput?: unknown, freshExactRuntimeInput?: unknown) {
  const milestoneOf = (input: unknown): unknown => input && typeof input === "object" && !Array.isArray(input) ? (input as { milestone?: unknown }).milestone : undefined;
  const attachmentCandidates = [projectPersistentAddSceneRedoHandlerClassifierAggregateInput, projectRenameRedoHandlerClassifierAggregateInput, projectSaveAsRedoHandlerClassifierAggregateInput, projectCreateRedoHandlerClassifierAggregateInput, projectHandoutAssetRedoHandlerClassifierAggregateInput, projectAudioAssetRedoHandlerClassifierAggregateInput, projectTokenAssetRedoHandlerClassifierAggregateInput, projectAssetBindRedoHandlerClassifierAggregateInput, projectInMemoryAddSceneRedoHandlerClassifierAggregateInput];
  const persistentAddSceneRedoHandlerClassifierAggregateInput = attachmentCandidates.find((input) => milestoneOf(input) === "M971");
  const renameRedoHandlerClassifierAggregateInput = attachmentCandidates.find((input) => milestoneOf(input) === "M975");
  const saveAsRedoHandlerClassifierAggregateInput = attachmentCandidates.find((input) => milestoneOf(input) === "M979");
  const createRedoHandlerClassifierAggregateInput = attachmentCandidates.find((input) => milestoneOf(input) === "M984");
  const handoutAssetRedoHandlerClassifierAggregateInput = attachmentCandidates.find((input) => milestoneOf(input) === "M989");
  const audioAssetRedoHandlerClassifierAggregateInput = attachmentCandidates.find((input) => milestoneOf(input) === "M993");
  const tokenAssetRedoHandlerClassifierAggregateInput = attachmentCandidates.find((input) => milestoneOf(input) === "M997");
  const assetBindRedoHandlerClassifierAggregateInput = attachmentCandidates.find((input) => milestoneOf(input) === "M1001");
  const inMemoryAddSceneRedoHandlerClassifierAggregateInput = attachmentCandidates.find((input) => milestoneOf(input) === "M1006");
  return createProjectStage11AggregateEvidenceLedger(createProjectAggregateCurrentAuthorityEvidence(), fixture(), packageStage(), dialog(), ownedScenePermission(), foundryInverse(), createProjectCrossProducerLifecycleContinuityEvidence(foundryInverse(), foundryForward()), directLocalLifecycle(), directHumanProposal(), directCampaignDirectorProposal(), semantic, redo, updateWitness(), witnessReread(), packagedRuntimeDiagnostic(), packagedAssetDetach(), packagedAssetRestore(), packagedBrokenReference(), backupPromotionRecovery(), persistentAddSceneSemanticRedo, audioAssetSemanticRedo, handoutAssetSemanticRedo, tokenAssetSemanticRedo, assetBindSemanticRedo, saveAsSemanticRedo, renameSemanticRedo, createSemanticRedo, inMemoryAddSceneSemanticRedo, nativeCrossProducerConformance, packagedCrossProducerInput, loadedAuthorityControlInput, projectSaveCurrentAuthorityLifecycleInput, projectSaveRedoHandlerClassifierAggregateInput, persistentAddSceneRedoHandlerClassifierAggregateInput, renameRedoHandlerClassifierAggregateInput, saveAsRedoHandlerClassifierAggregateInput, createRedoHandlerClassifierAggregateInput, handoutAssetRedoHandlerClassifierAggregateInput, audioAssetRedoHandlerClassifierAggregateInput, tokenAssetRedoHandlerClassifierAggregateInput, assetBindRedoHandlerClassifierAggregateInput, inMemoryAddSceneRedoHandlerClassifierAggregateInput, freshExactRuntimeInput);
}

const aggregateWithProjectCreate = (receipt: unknown): ReturnType<typeof aggregateWith> => Reflect.apply(aggregateWith, undefined, [
  proposalSemantic(),
  semanticRedo(),
  ...Array.from({ length: 17 }, () => undefined),
  receipt,
]);

const aggregateWithProjectAudio = (receipt: unknown): ReturnType<typeof aggregateWith> => Reflect.apply(aggregateWith, undefined, [
  proposalSemantic(),
  semanticRedo(),
  ...Array.from({ length: 19 }, () => undefined),
  receipt,
]);

const aggregateWithProjectToken = (receipt: unknown): ReturnType<typeof aggregateWith> => Reflect.apply(aggregateWith, undefined, [
  proposalSemantic(),
  semanticRedo(),
  ...Array.from({ length: 20 }, () => undefined),
  receipt,
]);

const aggregateWithProjectAssetBind = (receipt: unknown): ReturnType<typeof aggregateWith> => Reflect.apply(aggregateWith, undefined, [
  proposalSemantic(),
  semanticRedo(),
  ...Array.from({ length: 21 }, () => undefined),
  receipt,
]);

const aggregateWithProjectInMemoryAddScene = (receipt: unknown): ReturnType<typeof aggregateWith> => Reflect.apply(aggregateWith, undefined, [
  proposalSemantic(),
  semanticRedo(),
  ...Array.from({ length: 22 }, () => undefined),
  receipt,
]);

const aggregateWithFreshExactRuntime = (receipt: unknown): ReturnType<typeof aggregateWith> => Reflect.apply(aggregateWith, undefined, [
  proposalSemantic(),
  semanticRedo(),
  ...Array.from({ length: 23 }, () => undefined),
  receipt,
]);

describe("M796 Stage 11 aggregate evidence ledger", () => {
  it("reconciles the exact partial authority and lifecycle planes without promotion", () => {
    expect(createProjectStage11AggregateEvidenceLedger(createProjectAggregateCurrentAuthorityEvidence(), fixture(), packageStage(), dialog(), ownedScenePermission(), foundryInverse(), createProjectCrossProducerLifecycleContinuityEvidence(foundryInverse(), foundryForward()), directLocalLifecycle(), directHumanProposal(), directCampaignDirectorProposal(), proposalSemantic(), semanticRedo(), updateWitness(), witnessReread(), packagedRuntimeDiagnostic(), packagedAssetDetach(), packagedAssetRestore(), packagedBrokenReference(), backupPromotionRecovery())).toMatchObject({ status: "PASS", disposition: "aggregate-stage11-partial", currentAuthority: { foundryInverseEvidence: { observedLifecycleCount: 1 }, ownedScenePermissionEvidence: { stableId: "dbx:scene:desktop-shell-fixture", noUpdateInvoked: true }, authority: { foundryInverse: "producer-scoped-fixture-observed", scenePermission: "one-owned-scene-predicate-observed" } }, lifecycleContinuity: { directFoundryObservation: { observedLifecycleCount: 1, producerScopedOnly: true }, directFoundryForwardObservation: { observedLifecycleCount: 1, recoveredFromUnknown: true } }, directLocalLifecycleEvidence: { observedLifecycleCount: 2, producerScopedOnly: true, noFoundryWrite: true }, directHumanProposalEvidence: { observedLifecycleCount: 1, producerScopedOnly: true, localBrowserObserved: true }, directCampaignDirectorProposalEvidence: { observedLifecycleCount: 1, producerScopedOnly: true, staleInvalidated: true }, directUpdateWitnessEvidence: { observedLifecycleCount: 1, producerScopedOnly: true, restorationReread: true, independentNoWriteReread: true }, directPackagedRuntimeDiagnosticEvidence: { observedLifecycleCount: 1, producerScopedOnly: true, redactedNoWriteObserved: true }, directPackagedAssetDetachEvidence: { observedLifecycleCount: 1, producerScopedOnly: true, packagedLifecycleObserved: true, authoritativeReread: true, noFoundryWrite: true }, directPackagedAssetRestoreEvidence: { observedLifecycleCount: 1, producerScopedOnly: true, packagedLifecycleObserved: true, authoritativeReread: true, noFoundryWrite: true }, directPackagedBrokenReferenceEvidence: { observedLifecycleCount: 1, producerScopedOnly: true, packagedLifecycleObserved: true, authoritativeReread: true, noFoundryWrite: true }, directBackupPromotionRecoveryEvidence: { observedLifecycleCount: 1, producerScopedOnly: true, recoveryObserved: true, authoritativeReread: true, noFoundryWrite: true }, directOwnedScenePermissionEvidence: "one-owned-scene-predicate-observed", directRuntimeEvidence: "current-active-gm-identity-observed", historicalPackageEvidence: "served-no-dialog-observation", lifecycleEvidence: "modeled-cross-producer-partial", operationCount: 14, proposalSemanticEvidence: { milestone: "M886", receipt: "outputs/m886-stage11-operation-specific-undo-redo-semantic-composition-closure-receipt.json", backupPromotionUndoRedo: "not-applicable-one-way" }, semanticRedoEvidence: { milestone: "M890", receipt: "outputs/m890-stage11-operation-specific-semantic-redo-composition-closure-receipt.json", saveSemanticHash: "shape-only" }, noPermissionAuthority: true, noExecutionAuthority: true, noRecoveryAuthority: true, stage11AcceptanceStatus: "blocked", stage12Started: false });
  });

  it("fails closed for altered dialog authority or lifecycle acceptance", () => {
    expect(() => createProjectStage11AggregateEvidenceLedger(createProjectAggregateCurrentAuthorityEvidence(), fixture(), packageStage(), { ...dialog(), noPermissionClaim: false }, ownedScenePermission(), foundryInverse(), createProjectCrossProducerLifecycleContinuityEvidence(foundryInverse(), foundryForward()), directLocalLifecycle(), directHumanProposal(), directCampaignDirectorProposal(), proposalSemantic(), semanticRedo())).toThrow(/noPermissionClaim/);
    const lifecycle = structuredClone(createProjectCrossProducerLifecycleContinuityEvidence(foundryInverse(), foundryForward())) as { stage11AcceptanceStatus: string };
    lifecycle.stage11AcceptanceStatus = "accepted";
    expect(() => createProjectStage11AggregateEvidenceLedger(createProjectAggregateCurrentAuthorityEvidence(), fixture(), packageStage(), dialog(), ownedScenePermission(), foundryInverse(), lifecycle, directLocalLifecycle(), directHumanProposal(), directCampaignDirectorProposal(), proposalSemantic(), semanticRedo())).toThrow(/stage11AcceptanceStatus/);
    expect(() => createProjectStage11AggregateEvidenceLedger(createProjectAggregateCurrentAuthorityEvidence(), fixture(), packageStage(), dialog(), ownedScenePermission(), foundryInverse(), createProjectCrossProducerLifecycleContinuityEvidence(foundryInverse(), foundryForward()), { ...directLocalLifecycle(), observations: [{ milestone: "foreign", producer: "foreign", lifecycle: "foreign" }, directLocalLifecycle().observations[1]] }, directHumanProposal(), directCampaignDirectorProposal(), proposalSemantic(), semanticRedo())).toThrow(/milestone/);
    expect(() => createProjectStage11AggregateEvidenceLedger(createProjectAggregateCurrentAuthorityEvidence(), fixture(), packageStage(), dialog(), { ...ownedScenePermission(), stableId: "foreign" }, foundryInverse(), createProjectCrossProducerLifecycleContinuityEvidence(foundryInverse(), foundryForward()), directLocalLifecycle(), directHumanProposal(), directCampaignDirectorProposal(), proposalSemantic(), semanticRedo())).toThrow(/stableId/);
    expect(() => createProjectStage11AggregateEvidenceLedger(createProjectAggregateCurrentAuthorityEvidence(), fixture(), packageStage(), dialog(), ownedScenePermission(), foundryInverse(), createProjectCrossProducerLifecycleContinuityEvidence(foundryInverse(), foundryForward()), directLocalLifecycle(), { ...directHumanProposal(), localBrowserObserved: false }, directCampaignDirectorProposal(), proposalSemantic(), semanticRedo())).toThrow(/localBrowserObserved/);
    expect(() => createProjectStage11AggregateEvidenceLedger(createProjectAggregateCurrentAuthorityEvidence(), fixture(), packageStage(), dialog(), ownedScenePermission(), foundryInverse(), createProjectCrossProducerLifecycleContinuityEvidence(foundryInverse(), foundryForward()), directLocalLifecycle(), directHumanProposal(), { ...directCampaignDirectorProposal(), staleInvalidated: false }, proposalSemantic(), semanticRedo())).toThrow(/staleInvalidated/);
  });

  it("fails closed when the M886 aggregate attachment is absent or drifts", () => {
    expect(() => aggregateWith(undefined, semanticRedo())).toThrow(/proposal semantic evidence/i);
    const base = proposalSemantic();
    expect(() => aggregateWith({ ...base, receipt: "outputs/foreign-receipt.json" }, semanticRedo())).toThrow(/receipt/i);
    expect(() => aggregateWith({ ...base, operationSemantics: [{ ...base.operationSemantics[0], semantic: "committed-one-way" }, base.operationSemantics[1]] }, semanticRedo())).toThrow(/operationSemantics|semantic/i);
    expect(() => aggregateWith({ ...base, noExecutionAuthority: false }, semanticRedo())).toThrow(/noExecutionAuthority/i);
    expect(() => aggregateWith({ ...base, backupPromotionUndoRedo: "supported" }, semanticRedo())).toThrow(/backupPromotionUndoRedo/i);
  });

  it("fails closed when the M890 aggregate attachment is absent or drifts", () => {
    expect(() => aggregateWith(proposalSemantic(), undefined)).toThrow(/semantic redo evidence/i);
    const base = semanticRedo();
    expect(() => aggregateWith(proposalSemantic(), { ...base, receipt: "outputs/foreign-receipt.json" })).toThrow(/receipt/i);
    expect(() => aggregateWith(proposalSemantic(), { ...base, saveSemanticHash: "strict" })).toThrow(/saveSemanticHash/i);
    expect(() => aggregateWith(proposalSemantic(), { ...base, noExecutionAuthority: false })).toThrow(/noExecutionAuthority/i);
    expect(() => aggregateWith(proposalSemantic(), { ...base, backupPromotionUndoRedo: "supported" })).toThrow(/backupPromotionUndoRedo/i);
  });

  it("attaches the exact M912 persistent add-Scene semantic redo receipt without changing authority", () => {
    const receipt = JSON.parse(readFileSync(new URL("../outputs/m912-stage11-persistent-add-scene-semantic-redo-composition-closure-receipt.json", import.meta.url), "utf8")) as unknown;
    const result = aggregateWith(proposalSemantic(), semanticRedo(), receipt);
    expect(result.persistentAddSceneSemanticRedoEvidence).toMatchObject({ milestone: "M914", sourceMilestone: "M912", receipt: "outputs/m912-stage11-persistent-add-scene-semantic-redo-composition-closure-receipt.json", operation: "project.add-scene.persist.redo", aggregateAttachment: "one-producer-scoped-non-certifying", aggregateAuthority: "not-granted", countsChanged: false, stage11AcceptanceStatus: "blocked", stage12Started: false, readyClaim: false });
    expect(result.operationCount).toBe(14);
    expect(result.currentAuthority.authority.aggregate).toBe("not-granted");
  });

  it("attaches the exact M896 audio-asset semantic redo receipt without changing authority", () => {
    const receipt = JSON.parse(readFileSync(new URL("../outputs/m896-stage11-audio-asset-semantic-redo-composition-closure-receipt.json", import.meta.url), "utf8")) as unknown;
    const result = aggregateWith(proposalSemantic(), semanticRedo(), undefined, receipt);
    expect(result.audioAssetSemanticRedoEvidence).toMatchObject({ milestone: "M916", sourceMilestone: "M896", receipt: "outputs/m896-stage11-audio-asset-semantic-redo-composition-closure-receipt.json", operation: "project.asset.register-audio.redo", aggregateAttachment: "one-producer-scoped-non-certifying", aggregateAuthority: "not-granted", countsChanged: false, stage11AcceptanceStatus: "blocked", stage12Started: false, readyClaim: false });
    expect(result.operationCount).toBe(14);
    expect(result.currentAuthority.authority.aggregate).toBe("not-granted");
  });

  it("attaches the exact M898 handout-asset semantic redo receipt without changing authority", () => {
    const receipt = JSON.parse(readFileSync(new URL("../outputs/m898-stage11-handout-asset-semantic-redo-composition-closure-receipt.json", import.meta.url), "utf8")) as unknown;
    const result = aggregateWith(proposalSemantic(), semanticRedo(), undefined, undefined, receipt);
    expect(result.handoutAssetSemanticRedoEvidence).toMatchObject({ milestone: "M918", sourceMilestone: "M898", receipt: "outputs/m898-stage11-handout-asset-semantic-redo-composition-closure-receipt.json", operation: "project.asset.register-handout.redo", aggregateAttachment: "one-producer-scoped-non-certifying", aggregateAuthority: "not-granted", countsChanged: false, stage11AcceptanceStatus: "blocked", stage12Started: false, readyClaim: false });
    expect(result.operationCount).toBe(14);
    expect(result.currentAuthority.authority.aggregate).toBe("not-granted");
  });

  it("attaches the exact M900 token-asset semantic redo receipt without changing authority", () => {
    const receipt = JSON.parse(readFileSync(new URL("../outputs/m900-stage11-token-asset-semantic-redo-composition-closure-receipt.json", import.meta.url), "utf8")) as unknown;
    const result = aggregateWith(proposalSemantic(), semanticRedo(), undefined, undefined, undefined, receipt);
    expect(result.tokenAssetSemanticRedoEvidence).toMatchObject({ milestone: "M920", sourceMilestone: "M900", receipt: "outputs/m900-stage11-token-asset-semantic-redo-composition-closure-receipt.json", operation: "project.asset.register-token.redo", aggregateAttachment: "one-producer-scoped-non-certifying", aggregateAuthority: "not-granted", countsChanged: false, stage11AcceptanceStatus: "blocked", stage12Started: false, readyClaim: false });
    expect(result.operationCount).toBe(14);
    expect(result.currentAuthority.authority.aggregate).toBe("not-granted");
  });

  it("attaches the exact M908 asset-bind semantic redo receipt without changing authority", () => {
    const receipt = JSON.parse(readFileSync(new URL("../outputs/m908-stage11-project-asset-bind-semantic-redo-composition-closure-receipt.json", import.meta.url), "utf8")) as unknown;
    const result = aggregateWith(proposalSemantic(), semanticRedo(), undefined, undefined, undefined, undefined, receipt);
    expect(result.assetBindSemanticRedoEvidence).toMatchObject({ milestone: "M923", sourceMilestone: "M908", receipt: "outputs/m908-stage11-project-asset-bind-semantic-redo-composition-closure-receipt.json", operation: "project.asset.bind.redo", aggregateAttachment: "one-producer-scoped-non-certifying", aggregateAuthority: "not-granted", countsChanged: false, stage11AcceptanceStatus: "blocked", stage12Started: false, readyClaim: false });
    expect(result.operationCount).toBe(14);
    expect(result.currentAuthority.authority.aggregate).toBe("not-granted");
  });

  it("attaches the exact M910 save-as semantic redo receipt without changing authority", () => {
    const receipt = JSON.parse(readFileSync(new URL("../outputs/m910-stage11-project-save-as-semantic-redo-composition-closure-receipt.json", import.meta.url), "utf8")) as unknown;
    const result = aggregateWith(proposalSemantic(), semanticRedo(), undefined, undefined, undefined, undefined, undefined, receipt);
    expect(result.saveAsSemanticRedoEvidence).toMatchObject({ milestone: "M925", sourceMilestone: "M910", receipt: "outputs/m910-stage11-project-save-as-semantic-redo-composition-closure-receipt.json", operation: "project.save-as.redo", aggregateAttachment: "one-producer-scoped-non-certifying", aggregateAuthority: "not-granted", countsChanged: false, stage11AcceptanceStatus: "blocked", stage12Started: false, readyClaim: false });
    expect(result.operationCount).toBe(14);
    expect(result.currentAuthority.authority.aggregate).toBe("not-granted");
  });

  it("attaches the exact M902 rename semantic redo receipt without changing authority", () => {
    const receipt = JSON.parse(readFileSync(new URL("../outputs/m902-stage11-project-rename-semantic-redo-composition-closure-receipt.json", import.meta.url), "utf8")) as unknown;
    const result = aggregateWith(proposalSemantic(), semanticRedo(), undefined, undefined, undefined, undefined, undefined, undefined, receipt);
    expect(result.renameSemanticRedoEvidence).toMatchObject({ milestone: "M927", sourceMilestone: "M902", receipt: "outputs/m902-stage11-project-rename-semantic-redo-composition-closure-receipt.json", operation: "project.rename.redo", byteHashRotation: "not-claimed", aggregateAttachment: "one-producer-scoped-non-certifying", aggregateAuthority: "not-granted", countsChanged: false, stage11AcceptanceStatus: "blocked", stage12Started: false, readyClaim: false });
    expect(result.operationCount).toBe(14);
    expect(result.currentAuthority.authority.aggregate).toBe("not-granted");
  });

  it("attaches the exact M904 create semantic redo receipt without changing authority", () => {
    const receipt = JSON.parse(readFileSync(new URL("../outputs/m904-stage11-project-create-semantic-redo-composition-closure-receipt.json", import.meta.url), "utf8")) as unknown;
    const result = aggregateWith(proposalSemantic(), semanticRedo(), undefined, undefined, undefined, undefined, undefined, undefined, undefined, receipt);
    expect(result.createSemanticRedoEvidence).toMatchObject({ milestone: "M929", sourceMilestone: "M904", receipt: "outputs/m904-stage11-project-create-semantic-redo-composition-closure-receipt.json", operation: "project.create.redo", byteHashRotation: "not-claimed", aggregateAttachment: "one-producer-scoped-non-certifying", aggregateAuthority: "not-granted", countsChanged: false, stage11AcceptanceStatus: "blocked", stage12Started: false, readyClaim: false });
    expect(result.operationCount).toBe(14);
    expect(result.currentAuthority.authority.aggregate).toBe("not-granted");
  });

  it("attaches the exact M906 in-memory add-Scene semantic redo receipt without changing authority", () => {
    const receipt = JSON.parse(readFileSync(new URL("../outputs/m906-stage11-in-memory-add-scene-semantic-redo-composition-closure-receipt.json", import.meta.url), "utf8")) as unknown;
    const result = aggregateWith(proposalSemantic(), semanticRedo(), undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, receipt);
    expect(result.inMemoryAddSceneSemanticRedoEvidence).toMatchObject({ milestone: "M931", sourceMilestone: "M906", receipt: "outputs/m906-stage11-in-memory-add-scene-semantic-redo-composition-closure-receipt.json", operation: "project.add-scene.commit-in-memory.redo", byteHashRotation: "not-claimed", aggregateAttachment: "one-producer-scoped-non-certifying", aggregateAuthority: "not-granted", countsChanged: false, stage11AcceptanceStatus: "blocked", stage12Started: false, readyClaim: false });
    expect(result.operationCount).toBe(14);
    expect(result.currentAuthority.authority.aggregate).toBe("not-granted");
  });

  it("attaches the exact M963 project.save current-authority/lifecycle evidence without changing aggregate authority", () => {
    const receipt = JSON.parse(readFileSync(new URL("../outputs/m645-stage11-observable-save-ui-packaged-observation-receipt.json", import.meta.url), "utf8")) as unknown;
    const result = aggregateWith(proposalSemantic(), semanticRedo(), undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, receipt);
    expect(result.projectSaveCurrentAuthorityLifecycleEvidence).toMatchObject({ milestone: "M963", sourceMilestone: "M645", producer: "project.save", operation: "project.save", directCurrentAuthority: "operation-specific-local-project", aggregateAuthority: "not-granted", lifecycle: "preview→approval→save→reread→inverse-restore", noProjectMutationByM963: true, stage11AcceptanceStatus: "blocked", stage12Started: false, readyClaim: false });
    expect(result.operationCount).toBe(14);
    expect(result.currentAuthority.authority.aggregate).toBe("not-granted");
  });

  it("attaches the exact M968 project.save redo handler/classifier evidence without changing aggregate authority", () => {
    const receipt = JSON.parse(readFileSync(new URL("../outputs/m966-stage11-project-save-redo-handler-classifier-evidence-bridge-closure-receipt.json", import.meta.url), "utf8")) as unknown;
    const result = aggregateWith(proposalSemantic(), semanticRedo(), undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, receipt);
    expect(result.projectSaveRedoHandlerClassifierAggregateEvidence).toMatchObject({ milestone: "M968", sourceMilestone: "M966", producer: "project.save", operation: "project.save.redo", handler: "bridgeProjectSaveRedoToTerminalHistory", rereadClassifier: "projectSaveRedoTerminalHistoryReceiptSchema", aggregateAttachment: "one-producer-scoped-non-certifying", operationCount: 14, operationCountChanged: false, aggregateAuthority: "not-granted", stage11AcceptanceStatus: "blocked", stage12Started: false, readyClaim: false });
    expect(result.operationCount).toBe(14);
    expect(result.currentAuthority.authority.aggregate).toBe("not-granted");
  });

  it("attaches the exact M973 persistent add-Scene redo handler/classifier evidence without changing aggregate authority", () => {
    const receipt = JSON.parse(readFileSync(new URL("../outputs/m971-stage11-persistent-add-scene-redo-handler-classifier-evidence-closure-receipt.json", import.meta.url), "utf8")) as unknown;
    const result = aggregateWith(proposalSemantic(), semanticRedo(), undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, receipt);
    expect(result.projectPersistentAddSceneRedoHandlerClassifierAggregateEvidence).toMatchObject({ milestone: "M973", sourceMilestone: "M971", producer: "project.add-scene.persist", operation: "project.add-scene.persist.redo", handler: "bridgeProjectPersistentAddSceneRedoToTerminalHistory", rereadClassifier: "projectPersistentAddSceneRedoTerminalHistoryReceiptSchema", aggregateAttachment: "one-producer-scoped-non-certifying", orderedSceneSetRequired: true, operationCount: 14, operationCountChanged: false, aggregateAuthority: "not-granted", stage11AcceptanceStatus: "blocked", stage12Started: false, readyClaim: false });
    expect(result.operationCount).toBe(14);
    expect(result.currentAuthority.authority.aggregate).toBe("not-granted");
  });

  it("attaches the exact M874 native cross-producer conformance receipt without changing authority", () => {
    const receipt = JSON.parse(readFileSync(new URL("../outputs/m874-stage11-native-cross-producer-conformance-closure-receipt.json", import.meta.url), "utf8")) as unknown;
    const result = aggregateWith(proposalSemantic(), semanticRedo(), undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, receipt);
    expect(result.nativeCrossProducerConformanceEvidence).toMatchObject({ milestone: "M933", sourceMilestone: "M874", receipt: "outputs/m874-stage11-native-cross-producer-conformance-closure-receipt.json", operation: "dicebox.project.cross-producer.native-conformance", aggregateAttachment: "one-cross-producer-producer-scoped-non-certifying", aggregateAuthority: "not-granted", countsChanged: false, stage11AcceptanceStatus: "blocked", stage12Started: false, readyClaim: false });
    expect(result.operationCount).toBe(14);
    expect(result.currentAuthority.authority.aggregate).toBe("not-granted");
  });

  it("attaches the exact M942 packaged v5 cross-producer receipt without changing authority", () => {
    const receipt = packagedCrossProducer();
    const result = aggregateWith(proposalSemantic(), semanticRedo(), undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, receipt);
    expect(result.packagedCrossProducerEvidence).toMatchObject({ milestone: "M944", sourceMilestone: "M942", receipt: "outputs/m942-stage11-fresh-v5-packaged-desktop-observation-closure-receipt.json", operation: "dicebox.project.cross-producer.packaged-conformance", target: "dbx:project:desktop-cross-producer-commit-recovery-self-test-v5", packagedLifecycleObserved: true, proposalHistoriesCommitted: true, foreignStatePreserved: true, noFoundryWrite: true, aggregateAttachment: "one-cross-producer-packaged-producer-scoped-non-certifying", aggregateAuthority: "not-granted", countsChanged: false, stage11AcceptanceStatus: "blocked", stage12Started: false, readyClaim: false });
    expect(result.operationCount).toBe(14);
    expect(result.currentAuthority.authority.aggregate).toBe("not-granted");
  });

  it("attaches the exact M952 loaded authority-control receipt without changing operation count or authority", () => {
    const receipt = JSON.parse(readFileSync(new URL("../outputs/m952-stage11-exact-v4-loaded-module-authority-control-observation-closure-receipt.json", import.meta.url), "utf8")) as unknown;
    const result = aggregateWith(proposalSemantic(), semanticRedo(), undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, receipt);
    expect(result.loadedAuthorityControlEvidence).toMatchObject({ milestone: "M953", sourceMilestone: "M952", receipt: "outputs/m952-stage11-exact-v4-loaded-module-authority-control-observation-closure-receipt.json", operation: "dicebox.foundry.loaded-authority-controls", controlsObserved: 2, moduleExecutionObserved: true, ownedSceneCanUpdate: true, noFoundryWrite: true, playerPasswordEntered: false, aggregateAttachment: "one-loaded-authority-control-producer-scoped-non-certifying", aggregateAuthority: "not-granted", countsChanged: false, stage11AcceptanceStatus: "blocked", stage12Started: false, readyClaim: false });
    expect(result.currentAuthority.loadedAuthorityControlEvidence).toMatchObject({ milestone: "M955", sourceMilestone: "M952", sourceAggregateMilestone: "M953", operation: "dicebox.foundry.loaded-authority-controls", supplementalOnly: true, preservesExistingAuthorityPlanes: true, currentAuthority: "partial", aggregateAuthority: "not-granted", countsChanged: false, stage11AcceptanceStatus: "blocked", stage12Started: false, readyClaim: false });
    expect(result.operationCount).toBe(14);
    expect(result.currentAuthority.authority.aggregate).toBe("not-granted");
  });

  it("attaches the exact M975 project.rename redo handler/classifier receipt without changing authority", () => {
    const receipt = JSON.parse(readFileSync(new URL("../outputs/m975-stage11-project-rename-redo-handler-classifier-evidence-closure-receipt.json", import.meta.url), "utf8")) as unknown;
    const result = aggregateWith(proposalSemantic(), semanticRedo(), undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, receipt);
    expect(result.projectRenameRedoHandlerClassifierAggregateEvidence).toMatchObject({
      milestone: "M977",
      sourceMilestone: "M975",
      sourceReceipt: "outputs/m975-stage11-project-rename-redo-handler-classifier-evidence-closure-receipt.json",
      producer: "project.rename",
      operation: "project.rename.redo",
      handler: "bridgeProjectRenameRedoToTerminalHistory",
      rereadClassifier: "projectRenameRedoTerminalHistoryReceiptSchema",
      metadataOnlyRenameRequired: true,
      projectContentPreserved: true,
      aggregateAttachment: "one-producer-scoped-non-certifying",
      aggregateAuthority: "not-granted",
      operationCountChanged: false,
      stage11AcceptanceStatus: "blocked",
      stage12Started: false,
      readyClaim: false,
    });
    expect(result.operationCount).toBe(14);
    expect(result.currentAuthority.authority.aggregate).toBe("not-granted");
  });

  it("attaches the exact M979 project.save-as redo handler/classifier receipt without changing authority", () => {
    const receipt = JSON.parse(readFileSync(new URL("../outputs/m979-stage11-project-save-as-redo-handler-classifier-evidence-closure-receipt.json", import.meta.url), "utf8")) as unknown;
    const result = aggregateWith(proposalSemantic(), semanticRedo(), undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, receipt);
    expect(result.projectSaveAsRedoHandlerClassifierAggregateEvidence).toMatchObject({
      milestone: "M981",
      sourceMilestone: "M979",
      sourceReceipt: "outputs/m979-stage11-project-save-as-redo-handler-classifier-evidence-closure-receipt.json",
      producer: "project.save-as",
      operation: "project.save-as.redo",
      handler: "bridgeProjectSaveAsRedoToTerminalHistory",
      rereadClassifier: "projectSaveAsRedoTerminalHistoryReceiptSchema",
      canonicalClassifierSurface: "projectSaveAsTerminalHistoryReceiptSchema",
      sourceAndTargetIdentityPreserved: true,
      targetAbsentBeforeRedo: true,
      targetPresentAfterRedo: true,
      targetCreationIntegrityPreserved: true,
      aggregateAttachment: "one-producer-scoped-non-certifying",
      aggregateAuthority: "not-granted",
      operationCount: 14,
      operationCountChanged: false,
      stage11AcceptanceStatus: "blocked",
      stage12Started: false,
      readyClaim: false,
    });
    expect(result.operationCount).toBe(14);
    expect(result.currentAuthority.authority.aggregate).toBe("not-granted");
  });

  it("attaches the exact M984 project.create redo handler/classifier receipt without changing authority", () => {
    const receipt = JSON.parse(readFileSync(new URL("../outputs/m984-stage11-project-create-redo-handler-classifier-evidence-closure-receipt.json", import.meta.url), "utf8")) as unknown;
    const result = aggregateWithProjectCreate(receipt);
    expect(result.projectCreateRedoHandlerClassifierAggregateEvidence).toMatchObject({
      milestone: "M986",
      sourceMilestone: "M984",
      sourceReceipt: "outputs/m984-stage11-project-create-redo-handler-classifier-evidence-closure-receipt.json",
      producer: "project.create",
      operation: "project.create.redo",
      handler: "bridgeProjectCreateRedoToTerminalHistory",
      rereadClassifier: "projectCreateRedoTerminalHistoryReceiptSchema",
      bindingStatus: "bound-operation-specific",
      matchedRereadRequired: true,
      targetIdentityPreserved: true,
      targetAbsentBeforeRedo: true,
      targetPresentAfterRedo: true,
      generationAdvanced: true,
      firstGenerationContentIdentityPreserved: true,
      scenesPreserved: true,
      assetCollectionPreserved: true,
      byteHashRotation: "not-claimed",
      aggregateAttachment: "one-producer-scoped-non-certifying",
      aggregateAuthority: "not-granted",
      operationCount: 14,
      operationCountChanged: false,
      stage11AcceptanceStatus: "blocked",
      stage12Started: false,
      readyClaim: false,
    });
    expect(result.operationCount).toBe(14);
    expect(result.currentAuthority.authority.aggregate).toBe("not-granted");
  });

  it("fails closed for altered M984 project.create handler/classifier provenance", () => {
    const receipt = JSON.parse(readFileSync(new URL("../outputs/m984-stage11-project-create-redo-handler-classifier-evidence-closure-receipt.json", import.meta.url), "utf8")) as Record<string, unknown>;
    const implementation = receipt.implementation as Record<string, unknown>;
    expect(() => aggregateWithProjectCreate({ ...receipt, implementation: { ...implementation, redoClassifier: "foreign-classifier" } })).toThrow(/M984\.implementation\.redoClassifier/);
  });

  it("attaches the exact M993 project.asset.register-audio redo handler/classifier receipt without changing authority", () => {
    const receipt = JSON.parse(readFileSync(new URL("../outputs/m993-stage11-project-audio-asset-redo-handler-classifier-evidence-closure-receipt.json", import.meta.url), "utf8")) as unknown;
    const result = aggregateWithProjectAudio(receipt);
    expect(result.projectAudioAssetRedoHandlerClassifierAggregateEvidence).toMatchObject({
      milestone: "M995",
      sourceMilestone: "M993",
      sourceReceipt: "outputs/m993-stage11-project-audio-asset-redo-handler-classifier-evidence-closure-receipt.json",
      producer: "project.asset.register-audio",
      operation: "project.asset.register-audio.redo",
      handler: "bridgeProjectAudioAssetRegistrationRedoToTerminalHistory",
      rereadClassifier: "projectAudioAssetRedoTerminalHistoryReceiptSchema",
      bindingStatus: "bound-operation-specific",
      matchedRereadRequired: true,
      audioAssetIdentityPreserved: true,
      approvedAudioRegistrationPreserved: true,
      aggregateAttachment: "one-producer-scoped-non-certifying",
      aggregateAuthority: "not-granted",
      operationCount: 14,
      operationCountChanged: false,
      stage11AcceptanceStatus: "blocked",
      stage12Started: false,
      readyClaim: false,
    });
    expect(result.operationCount).toBe(14);
    expect(result.currentAuthority.authority.aggregate).toBe("not-granted");
  });

  it("fails closed for altered M993 audio handler/classifier provenance", () => {
    const receipt = JSON.parse(readFileSync(new URL("../outputs/m993-stage11-project-audio-asset-redo-handler-classifier-evidence-closure-receipt.json", import.meta.url), "utf8")) as Record<string, unknown>;
    const implementation = receipt.implementation as Record<string, unknown>;
    expect(() => aggregateWithProjectAudio({ ...receipt, implementation: { ...implementation, redoHandler: "foreign-handler" } })).toThrow(/M993\.implementation\.redoHandler/);
  });

  it("attaches the exact M1001 project.asset.bind redo handler/classifier receipt without changing authority", () => {
    const receipt = JSON.parse(readFileSync(new URL("../outputs/m1001-stage11-project-asset-bind-redo-handler-classifier-evidence-closure-receipt.json", import.meta.url), "utf8")) as unknown;
    const result = aggregateWithProjectAssetBind(receipt);
    expect(result.projectAssetBindRedoHandlerClassifierAggregateEvidence).toMatchObject({
      milestone: "M1003",
      sourceMilestone: "M1001",
      sourceReceipt: "outputs/m1001-stage11-project-asset-bind-redo-handler-classifier-evidence-closure-receipt.json",
      producer: "project.asset.bind",
      operation: "project.asset.bind.redo",
      handler: "bridgeProjectAssetBindingRedoToTerminalHistory",
      rereadClassifier: "projectAssetBindingRedoTerminalHistoryReceiptSchema",
      bindingStatus: "bound-operation-specific",
      matchedRereadRequired: true,
      assetDescriptorPreserved: true,
      contentAddressedAssetIdentityPreserved: true,
      bindingTransitionPreserved: true,
      aggregateAttachment: "one-producer-scoped-non-certifying",
      aggregateAuthority: "not-granted",
      operationCount: 14,
      operationCountChanged: false,
      stage11AcceptanceStatus: "blocked",
      stage12Started: false,
      readyClaim: false,
    });
    expect(result.operationCount).toBe(14);
    expect(result.currentAuthority.authority.aggregate).toBe("not-granted");
  });

  it("fails closed for altered M1001 asset-bind handler/classifier provenance", () => {
    const receipt = JSON.parse(readFileSync(new URL("../outputs/m1001-stage11-project-asset-bind-redo-handler-classifier-evidence-closure-receipt.json", import.meta.url), "utf8")) as Record<string, unknown>;
    const implementation = receipt.implementation as Record<string, unknown>;
    expect(() => aggregateWithProjectAssetBind({ ...receipt, implementation: { ...implementation, handler: "foreign-handler" } })).toThrow(/M1001\.implementation\.handler/);
  });

  it("attaches the exact M1006 in-memory add-Scene redo handler/classifier evidence without changing authority", () => {
    const receipt = JSON.parse(readFileSync(new URL("../outputs/m1006-stage11-in-memory-add-scene-redo-handler-classifier-evidence-closure-receipt.json", import.meta.url), "utf8")) as unknown;
    const result = aggregateWithProjectInMemoryAddScene(receipt);
    expect(result.projectInMemoryAddSceneRedoHandlerClassifierAggregateEvidence).toMatchObject({
      milestone: "M1008",
      sourceMilestone: "M1006",
      sourceReceipt: "outputs/m1006-stage11-in-memory-add-scene-redo-handler-classifier-evidence-closure-receipt.json",
      producer: "project.add-scene.commit-in-memory",
      operation: "project.add-scene.commit-in-memory.redo",
      handler: "bridgeProjectAddSceneInMemoryRedoToTerminalHistory",
      rereadClassifier: "projectAddSceneInMemoryRedoTerminalHistoryReceiptSchema",
      bindingStatus: "bound-operation-specific",
      matchedRereadRequired: true,
      orderedSceneSetPreserved: true,
      addedSceneAppended: true,
      activeSceneSelected: true,
      assetPreservation: true,
      nonPersistencePreserved: true,
      byteHashRotation: "not-claimed",
      aggregateAttachment: "one-producer-scoped-non-certifying",
      aggregateAuthority: "not-granted",
      operationCount: 14,
      operationCountChanged: false,
      stage11AcceptanceStatus: "blocked",
      stage12Started: false,
      readyClaim: false,
    });
    expect(result.operationCount).toBe(14);
    expect(result.currentAuthority.authority.aggregate).toBe("not-granted");
  });

  it("fails closed for altered M1006 in-memory add-Scene handler/classifier provenance", () => {
    const receipt = JSON.parse(readFileSync(new URL("../outputs/m1006-stage11-in-memory-add-scene-redo-handler-classifier-evidence-closure-receipt.json", import.meta.url), "utf8")) as Record<string, unknown>;
    const implementation = receipt.implementation as Record<string, unknown>;
    expect(() => aggregateWithProjectInMemoryAddScene({ ...receipt, implementation: { ...implementation, handler: "foreign-handler" } })).toThrow(/M1006\.implementation\.handler/);
  });

  it("attaches the exact M1018 runtime receipt without changing aggregate authority", () => {
    const receipt = JSON.parse(readFileSync(new URL("../outputs/m1018-stage11-host-window-recovery-and-final-exact-runtime-reread-receipt.json", import.meta.url), "utf8")) as unknown;
    const result = aggregateWithFreshExactRuntime(receipt);
    expect(result.freshExactRuntimeEvidenceAttachment).toMatchObject({
      milestone: "M1020",
      sourceMilestone: "M1018",
      receipt: "outputs/m1018-stage11-host-window-recovery-and-final-exact-runtime-reread-receipt.json",
      operation: "dicebox.foundry.fresh-exact-runtime-current-authority",
      browser: "Chrome external browser",
      viewport: { width: 1920, height: 863, minimumWidth: 1024, minimumHeight: 768 },
      currentUser: "Gamemaster",
      currentUserIsGm: true,
      activeScene: "DiceBox Tram Routing Projection",
      noWrite: true,
      aggregateAuthority: "not-granted",
      countsChanged: false,
      stage11AcceptanceStatus: "blocked",
      stage12Started: false,
      readyClaim: false,
    });
    expect(result.operationCount).toBe(14);
    expect(result.currentAuthority.authority.aggregate).toBe("not-granted");
  });

  it("fails closed for drift in the exact M1018 runtime receipt", () => {
    const receipt = JSON.parse(readFileSync(new URL("../outputs/m1018-stage11-host-window-recovery-and-final-exact-runtime-reread-receipt.json", import.meta.url), "utf8")) as Record<string, unknown>;
    expect(() => aggregateWithFreshExactRuntime({ ...receipt, foreignField: true })).toThrow(/unknown or missing fields/i);
    const browser = receipt.browserObservation as Record<string, unknown>;
    expect(() => aggregateWithFreshExactRuntime({ ...receipt, browserObservation: { ...browser, visibleUser: "Player [Player]" } })).toThrow(/visibleUser/);
    const supervisor = receipt.supervisorObservation as Record<string, unknown>;
    expect(() => aggregateWithFreshExactRuntime({ ...receipt, supervisorObservation: { ...supervisor, worldDocumentWrites: 1 } })).toThrow(/worldDocumentWrites/);
  });
});
