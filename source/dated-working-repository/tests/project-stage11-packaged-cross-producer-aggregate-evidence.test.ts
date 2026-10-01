import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  createProjectStage11PackagedCrossProducerAggregateEvidence,
} from "../apps/campaign-helper-desktop/src/project-stage11-packaged-cross-producer-aggregate-evidence";

const receipt = JSON.parse(readFileSync("outputs/m942-stage11-fresh-v5-packaged-desktop-observation-closure-receipt.json", "utf8"));

describe("M944 packaged cross-producer aggregate evidence", () => {
  it("attaches the exact M942 packaged v5 lifecycle receipt without authority promotion", () => {
    expect(createProjectStage11PackagedCrossProducerAggregateEvidence(receipt)).toEqual({
      schemaVersion: "0.1.0",
      milestone: "M944",
      sourceMilestone: "M942",
      evidenceLabel: "local",
      receipt: "outputs/m942-stage11-fresh-v5-packaged-desktop-observation-closure-receipt.json",
      operation: "dicebox.project.cross-producer.packaged-conformance",
      target: "dbx:project:desktop-cross-producer-commit-recovery-self-test-v5",
      assetBindingCommitGeneration: 2,
      backupPromotionRestoredGeneration: 2,
      packagedLifecycleObserved: true,
      proposalHistoriesCommitted: true,
      foreignStatePreserved: true,
      noFoundryWrite: true,
      processClosedAndAbsent: true,
      runtimeRetry: false,
      aggregateAttachment: "one-cross-producer-packaged-producer-scoped-non-certifying",
      producerScopedOnly: true,
      readOnly: true,
      nonCertifying: true,
      noAuthorityGrant: true,
      noExecutionAuthority: true,
      noTransitionAuthority: true,
      noGenericExecutor: true,
      noFoundryAuthority: true,
      noForeignProjectMutation: true,
      aggregateAuthority: "not-granted",
      countsChanged: false,
      readyClaim: false,
      stage11AcceptanceStatus: "blocked",
      stage12Started: false,
    });
  });

  it("rejects altered packaged identity, lifecycle claims, and unknown fields", () => {
    expect(() => createProjectStage11PackagedCrossProducerAggregateEvidence({
      ...receipt,
      artifactMatch: { ...receipt.artifactMatch, mode: "cross-producer-commit-recovery-ui-v4-execute" },
    })).toThrow(/artifactMatch\.mode/);
    expect(() => createProjectStage11PackagedCrossProducerAggregateEvidence({
      ...receipt,
      observation: { ...receipt.observation, visibleResult: receipt.observation.visibleResult.replace("generation 2", "generation 9") },
    })).toThrow(/observation\.visibleResult/);
    expect(() => createProjectStage11PackagedCrossProducerAggregateEvidence({ ...receipt, foreignField: true })).toThrow(/unknown or missing/);
  });

  it("rejects promoted authority or missing preservation boundaries", () => {
    expect(() => createProjectStage11PackagedCrossProducerAggregateEvidence({
      ...receipt,
      limits: { ...receipt.limits, authorityPromoted: true },
    })).toThrow(/authorityPromoted/);
    expect(() => createProjectStage11PackagedCrossProducerAggregateEvidence({
      ...receipt,
      limits: { ...receipt.limits, foreignStateTouched: true },
    })).toThrow(/foreignStateTouched/);
  });
});
