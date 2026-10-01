import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  createProjectStage11NativeCrossProducerConformanceAggregateEvidence,
} from "../apps/campaign-helper-desktop/src/project-stage11-native-cross-producer-conformance-aggregate-evidence";

const receipt = JSON.parse(readFileSync("outputs/m874-stage11-native-cross-producer-conformance-closure-receipt.json", "utf8"));

describe("M933 native cross-producer conformance aggregate evidence", () => {
  it("attaches the exact M874 native commit-to-recovery receipt without authority promotion", () => {
    expect(createProjectStage11NativeCrossProducerConformanceAggregateEvidence(receipt)).toEqual({
      schemaVersion: "0.1.0",
      milestone: "M933",
      sourceMilestone: "M874",
      evidenceLabel: "local",
      receipt: "outputs/m874-stage11-native-cross-producer-conformance-closure-receipt.json",
      operation: "dicebox.project.cross-producer.native-conformance",
      target: "dbx:project:desktop-cross-producer-commit-recovery-self-test-v3",
      projectCreateGeneration: 1,
      assetBindingCommitGeneration: 2,
      transientGeneration: 3,
      committedBackupGeneration: 2,
      primaryRemoved: true,
      missingPrimaryValidBackupObserved: true,
      recoveryApprovalRequired: true,
      recoveryApplied: true,
      authoritativeRestoredReread: true,
      backupPreserved: true,
      semanticStatePreserved: true,
      assetTreePreserved: true,
      workspacePreserved: true,
      foreignStatePreserved: true,
      noFoundryWrite: true,
      runtimeRetry: false,
      desktopRuntime: "not-run",
      aggregateAttachment: "one-cross-producer-producer-scoped-non-certifying",
      producerScopedOnly: true,
      readOnly: true,
      nonCertifying: true,
      noAuthorityGrant: true,
      noExecutionAuthority: true,
      noTransitionAuthority: true,
      noGenericExecutor: true,
      noFoundryAuthority: true,
      noProjectMutation: true,
      aggregateAuthority: "not-granted",
      countsChanged: false,
      readyClaim: false,
      stage11AcceptanceStatus: "blocked",
      stage12Started: false,
    });
  });

  it("rejects altered source semantics and unknown fields", () => {
    expect(() => createProjectStage11NativeCrossProducerConformanceAggregateEvidence({
      ...receipt,
      scenario: {
        ...receipt.scenario,
        assetBindingCommit: { ...receipt.scenario.assetBindingCommit, generation: 99 },
      },
    })).toThrow(/assetBindingCommit\.generation/);
    expect(() => createProjectStage11NativeCrossProducerConformanceAggregateEvidence({ ...receipt, foreignField: true })).toThrow(/unknown or missing/);
  });

  it("rejects promoted authority and invalid recovery boundaries", () => {
    expect(() => createProjectStage11NativeCrossProducerConformanceAggregateEvidence({
      ...receipt,
      limits: { ...receipt.limits, foundryAuthority: true },
    })).toThrow(/foundryAuthority/);
    expect(() => createProjectStage11NativeCrossProducerConformanceAggregateEvidence({
      ...receipt,
      scenario: {
        ...receipt.scenario,
        recoveryApply: { ...receipt.scenario.recoveryApply, authoritativeCurrentReread: false },
      },
    })).toThrow(/authoritativeCurrentReread/);
  });
});
