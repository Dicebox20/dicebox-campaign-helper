import { describe, expect, it } from "vitest";
import {
  bridgeProjectCrossProducerLifecycleContinuityEvidence,
  createProjectCrossProducerLifecycleContinuityEvidence,
} from "../apps/campaign-helper-desktop/src/project-cross-producer-lifecycle-continuity-evidence";

const foundryInverse = () => ({ receiptVersion: 1, milestone: "M802", operation: "program-scene.inverse.apply", status: "PASS", evidenceClass: "fixture", target: { worldId: "dbx-test-world", port: 30003, foundry: "14.367", system: "dnd5e@5.3.3" }, currentActiveGm: true, freshPreview: "PASS", actionTimeConfirmation: true, deleteInvoked: true, sceneDeleted: true, authoritativeReread: true, deletedScene: { stableId: "dbx:scene:desktop-shell-fixture", owned: true }, foreignWorldScenesBefore: 1, foreignWorldScenesAfter: 1, foreignStatePreserved: true, retryPerformed: false, receiptClosed: true, supervisorAfter: { status: "PASS", worldDocumentWrites: 0, balladTouched: false }, stage11Accepted: false, stage12Started: false, readyClaim: false, nextAction: "Fresh read-only Stage 11 reconciliation before selecting one bounded remaining gap." });
const foundryForward = () => ({ receiptVersion: 1, milestone: "M830", operation: "program-scene.apply-recovery-drill", status: "PASS", evidenceClass: "fixture", target: { worldId: "dbx-test-world", foundry: "14.367", system: "dnd5e@5.3.3", user: "Gamemaster", port: 30003 }, preview: { status: "PASS", noWrite: true, planSha256: "10c4925a5eabdb7c0f6537440d2f083b1c999ca27fd6719f61f36eafed946c1e", assetSha256: "7adeb330329550eb18753187e8dbf001815bf22e056f14bc2cdc76188b0cf852", assetBytes: 20655, existingComplete: false }, apply: { status: "UNKNOWN", sceneCreated: true, responseDisposition: "intentionally-discarded-after-commit", retryAllowed: false }, recovery: { status: "PASS", authoritativeReread: true, recoveredFromUnknown: true, retryPerformed: false, foreignStatePreserved: true, sceneStableId: "dbx:scene:desktop-shell-fixture", sceneRuntimeId: "Scene.UpjxmDyJLxrcIDUD", initialLevel: 1, walls: 5, regions: 2, tiles: 1 }, shutdown: { status: "STOPPED", listeners: [], worldDocumentWrites: 0, balladTouched: false, stopMethod: "exact-owner-force-fallback-after-normal-termination-refusal" }, limits: { onlyFixedProgramSceneControlUsed: true, noM819PredicateObservation: true, noInverseControl: true, noOtherControl: true, stage11Accepted: false, stage12Entered: false, readyClaim: false } });

describe("M790 cross-producer lifecycle continuity evidence", () => {
  it("binds exact modeled lifecycle coverage for all fourteen operation-specific handlers", () => {
    const receipt = createProjectCrossProducerLifecycleContinuityEvidence(foundryInverse(), foundryForward());
    expect(receipt).toMatchObject({ status: "PASS", disposition: "modeled-cross-producer-partial", operationCount: 14, terminalHistoryIndexCount: 14, reviewTerminalEvidenceCount: 42, applyingUnknownEvidenceCount: 42, recoveryResultEvidenceCount: 56, undoRedoEvidenceCount: 28, directFoundryObservation: { observedLifecycleCount: 1, producerScopedOnly: true, foreignStatePreserved: true }, directFoundryForwardObservation: { observedLifecycleCount: 1, producerScopedOnly: true, recoveredFromUnknown: true }, modeledOnly: true, noExecutionAuthority: true, noTransitionAuthority: true, noRecoveryAuthority: true, stage11AcceptanceStatus: "blocked", stage12Started: false });
    expect(receipt.operations).toHaveLength(14);
    expect(new Set(receipt.operations.map((entry) => entry.commandKind)).size).toBe(14);
  });

  it("fails closed for altered coverage, authority promotion, and foreign fields", () => {
    const receipt = structuredClone(createProjectCrossProducerLifecycleContinuityEvidence(foundryInverse(), foundryForward()));
    expect(bridgeProjectCrossProducerLifecycleContinuityEvidence(receipt, foundryInverse())).toMatchObject({ status: "PASS" });
    expect(() => bridgeProjectCrossProducerLifecycleContinuityEvidence({ ...receipt, noRecoveryAuthority: false }, foundryInverse())).toThrow(/noRecoveryAuthority/);
    expect(() => bridgeProjectCrossProducerLifecycleContinuityEvidence({ ...receipt, operations: [{ ...receipt.operations[0], recoveryRereadStatuses: ["matched"] }, ...receipt.operations.slice(1)] }, foundryInverse())).toThrow(/recoveryRereadStatuses/);
    expect(() => bridgeProjectCrossProducerLifecycleContinuityEvidence({ ...receipt, foreign: true }, foundryInverse())).toThrow(/unknown or missing/);
    expect(() => bridgeProjectCrossProducerLifecycleContinuityEvidence({ ...receipt, directFoundryObservation: { ...receipt.directFoundryObservation, foreignStatePreserved: false } }, foundryInverse())).toThrow(/foreignStatePreserved/);
    expect(() => bridgeProjectCrossProducerLifecycleContinuityEvidence({ ...receipt, directFoundryForwardObservation: { ...receipt.directFoundryForwardObservation, recoveredFromUnknown: false } }, foundryInverse())).toThrow(/recoveredFromUnknown/);
  });
});
