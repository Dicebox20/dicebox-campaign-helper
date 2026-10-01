import { describe, expect, it } from "vitest";
import {
  bridgeProjectAggregateCurrentAuthorityEvidence,
  createProjectAggregateCurrentAuthorityEvidence,
  projectAggregateCurrentAuthorityEvidenceSchema,
} from "../apps/campaign-helper-desktop/src/project-aggregate-current-authority-evidence";

describe("M768 aggregate current-authority and producer-coverage evidence", () => {
  it("binds exact typed operation, producer-family, projection, and redo coverage", () => {
    const result = createProjectAggregateCurrentAuthorityEvidence();
    expect(result).toMatchObject({
      status: "PASS",
      disposition: "aggregate-partial",
      currentAuthorityStatus: "partial",
      stage11AcceptanceStatus: "blocked",
      stage12Started: false,
      typedOperationKindCount: 14,
      indexedOperationCount: 14,
      directProjectionCount: 16,
      supplementalProjectionCount: 2,
      producerFamilyCount: 11,
      redoBindingCount: 9,
      readOnly: true,
      nonCertifying: true,
      noExecutionAuthority: true,
      noTransitionAuthority: true,
      noGenericExecutor: true,
      noFoundryWrite: true,
      noProjectMutation: true,
      foreignStatePreserved: true,
      execution: "not-implemented",
      transitionInvocation: "not-invoked",
      rereadInvocation: "not-invoked",
      readyClaim: false,
    });
    expect(result.operationEvidence).toHaveLength(14);
    expect(result.producerFamilies).toHaveLength(11);
    expect(result.redoBindings.map((entry) => entry.commandKind)).toEqual([
      "project.create",
      "project.save",
      "project.rename",
      "project.add-scene.persist",
      "project.asset.bind",
      "project.asset.register-audio",
      "project.asset.register-handout",
      "project.asset.register-token",
      "project.add-scene.commit-in-memory",
    ]);
  });

  it("round-trips the canonical report through the fail-closed schema", () => {
    const result = createProjectAggregateCurrentAuthorityEvidence();
    expect(bridgeProjectAggregateCurrentAuthorityEvidence(result)).toEqual(result);
    expect(projectAggregateCurrentAuthorityEvidenceSchema.parse(result)).toEqual(result);
    expect(projectAggregateCurrentAuthorityEvidenceSchema.safeParse(result)).toMatchObject({ success: true });
  });

  it("rejects duplicate, missing, and foreign operation evidence", () => {
    const result = createProjectAggregateCurrentAuthorityEvidence();
    const duplicate = structuredClone(result) as unknown as { operationEvidence: Array<{ commandKind: string }> };
    duplicate.operationEvidence[13]!.commandKind = duplicate.operationEvidence[0]!.commandKind;
    expect(() => bridgeProjectAggregateCurrentAuthorityEvidence(duplicate)).toThrow(/exactly bind every typed operation/i);

    const missing = structuredClone(result) as unknown as { operationEvidence: Array<unknown> };
    missing.operationEvidence.pop();
    expect(() => bridgeProjectAggregateCurrentAuthorityEvidence(missing)).toThrow(/exactly bind every typed operation/i);

    const foreign = structuredClone(result) as unknown as { redoBindings: Array<{ receipt: string }> };
    foreign.redoBindings[0]!.receipt = "outputs/foreign-receipt.json";
    expect(() => bridgeProjectAggregateCurrentAuthorityEvidence(foreign)).toThrow(/nine applicable bounded redo receipts/i);
  });

  it("rejects authority promotion, execution, Foundry, and ready claims", () => {
    const result = createProjectAggregateCurrentAuthorityEvidence();
    const promoted = structuredClone(result) as unknown as { currentAuthorityStatus: string; readyClaim: boolean };
    promoted.currentAuthorityStatus = "pass";
    expect(() => bridgeProjectAggregateCurrentAuthorityEvidence(promoted)).toThrow(/currentAuthorityStatus/i);

    const executable = structuredClone(result) as unknown as { noExecutionAuthority: boolean; execution: string };
    executable.noExecutionAuthority = false;
    expect(() => bridgeProjectAggregateCurrentAuthorityEvidence(executable)).toThrow(/noExecutionAuthority/i);

    const ready = structuredClone(result) as unknown as { readyClaim: boolean };
    ready.readyClaim = true;
    expect(() => bridgeProjectAggregateCurrentAuthorityEvidence(ready)).toThrow(/readyClaim/i);
  });
});
