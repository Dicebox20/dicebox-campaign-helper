import { describe, expect, it } from "vitest";
import { createProjectStage11FoundryForwardRecoveryEvidence } from "../apps/campaign-helper-desktop/src/project-stage11-foundry-forward-recovery-evidence";

const m830 = () => ({ receiptVersion: 1, milestone: "M830", operation: "program-scene.apply-recovery-drill", status: "PASS", evidenceClass: "fixture", target: { worldId: "dbx-test-world", foundry: "14.367", system: "dnd5e@5.3.3", user: "Gamemaster", port: 30003 }, preview: { status: "PASS", noWrite: true, planSha256: "10c4925a5eabdb7c0f6537440d2f083b1c999ca27fd6719f61f36eafed946c1e", assetSha256: "7adeb330329550eb18753187e8dbf001815bf22e056f14bc2cdc76188b0cf852", assetBytes: 20655, existingComplete: false }, apply: { status: "UNKNOWN", sceneCreated: true, responseDisposition: "intentionally-discarded-after-commit", retryAllowed: false }, recovery: { status: "PASS", authoritativeReread: true, recoveredFromUnknown: true, retryPerformed: false, foreignStatePreserved: true, sceneStableId: "dbx:scene:desktop-shell-fixture", sceneRuntimeId: "Scene.UpjxmDyJLxrcIDUD", initialLevel: 1, walls: 5, regions: 2, tiles: 1 }, shutdown: { status: "STOPPED", listeners: [], worldDocumentWrites: 0, balladTouched: false, stopMethod: "exact-owner-force-fallback-after-normal-termination-refusal" }, limits: { onlyFixedProgramSceneControlUsed: true, noM819PredicateObservation: true, noInverseControl: true, noOtherControl: true, stage11Accepted: false, stage12Entered: false, readyClaim: false } });

describe("M836 Stage 11 Foundry forward recovery evidence", () => {
  it("classifies M830's exact forward unknown/recovery lifecycle without promotion", () => {
    expect(createProjectStage11FoundryForwardRecoveryEvidence(m830())).toMatchObject({ status: "PASS", disposition: "one-producer-scoped-foundry-fixture-forward-recovery-observation", observedLifecycleCount: 1, producerScopedOnly: true, foundryMutationObserved: true, authoritativeReread: true, recoveredFromUnknown: true, noRetry: true, foreignStatePreserved: true, noAuthorityGrant: true, noCoverageClaim: true, noFoundryAuthority: true, noExecutionAuthority: true, noRecoveryAuthority: true, stage11AcceptanceStatus: "blocked", stage12Started: false, readyClaim: false });
  });

  it("fails closed for target, unknown/retry, recovery, preservation, or promotion drift", () => {
    expect(() => createProjectStage11FoundryForwardRecoveryEvidence({ ...m830(), target: { ...m830().target, user: "Player3" } })).toThrow(/target.user/);
    expect(() => createProjectStage11FoundryForwardRecoveryEvidence({ ...m830(), apply: { ...m830().apply, retryAllowed: true } })).toThrow(/retryAllowed/);
    expect(() => createProjectStage11FoundryForwardRecoveryEvidence({ ...m830(), recovery: { ...m830().recovery, authoritativeReread: false } })).toThrow(/authoritativeReread/);
    expect(() => createProjectStage11FoundryForwardRecoveryEvidence({ ...m830(), recovery: { ...m830().recovery, foreignStatePreserved: false } })).toThrow(/foreignStatePreserved/);
    expect(() => createProjectStage11FoundryForwardRecoveryEvidence({ ...m830(), limits: { ...m830().limits, stage11Accepted: true } })).toThrow(/stage11Accepted/);
  });
});
