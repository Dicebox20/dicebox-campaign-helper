import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  createProjectStage11ProjectSaveCurrentAuthorityLifecycleEvidence,
  projectStage11ProjectSaveCurrentAuthorityLifecycleEvidenceSchema,
} from "../apps/campaign-helper-desktop/src/project-stage11-project-save-current-authority-lifecycle-evidence.js";

const sourceReceiptPath = "../outputs/m645-stage11-observable-save-ui-packaged-observation-receipt.json";

function sourceReceipt(): any {
  return JSON.parse(readFileSync(new URL(sourceReceiptPath, import.meta.url), "utf8"));
}

describe("M963 Stage 11 project.save current-authority/lifecycle evidence", () => {
  it("projects the exact M645 producer observation without promoting authority", () => {
    const result = createProjectStage11ProjectSaveCurrentAuthorityLifecycleEvidence(sourceReceipt());

    expect(result).toEqual({
      schemaVersion: "0.1.0",
      milestone: "M963",
      sourceMilestone: "M645",
      evidenceLabel: "local",
      sourceReceipt: "outputs/m645-stage11-observable-save-ui-packaged-observation-receipt.json",
      producer: "project.save",
      operation: "project.save",
      projectId: "dbx:project:desktop-multiscene-self-test",
      lifecycle: "preview→approval→save→reread→inverse-restore",
      sourceOperationObserved: true,
      sourceMutationObserved: true,
      directCurrentAuthority: "operation-specific-local-project",
      aggregateAuthority: "not-granted",
      sourceObservation: { generation: 10, historyEntries: 5, terminalState: "undone / clean / active", foundryWrite: false },
      authoritativeReread: { primaryGeneration: 10, backupGeneration: 9, remainingExactTargetPids: [] },
      lifecycleCoverage: { preview: true, approval: true, apply: true, authoritativeReread: true, inverseRestore: true },
      foreignStatePreserved: true,
      noFoundryWrite: true,
      readOnly: true,
      nonCertifying: true,
      noAuthorityGrant: true,
      noExecutionAuthority: true,
      noTransitionAuthority: true,
      noGenericExecutor: true,
      noProjectMutationByM963: true,
      stage11AcceptanceStatus: "blocked",
      stage12Started: false,
      readyClaim: false,
    });
    expect(projectStage11ProjectSaveCurrentAuthorityLifecycleEvidenceSchema.parse(result)).toEqual(result);
    const closureReceipt = JSON.parse(readFileSync(new URL("../outputs/m963-stage11-project-save-current-authority-lifecycle-evidence-slice-receipt.json", import.meta.url), "utf8")) as unknown;
    expect(projectStage11ProjectSaveCurrentAuthorityLifecycleEvidenceSchema.parse(closureReceipt)).toEqual(result);
  });

  it("fails closed for altered producer identity, lifecycle, or reread state", () => {
    const wrongProducer = sourceReceipt();
    wrongProducer.accessibilityObservation.projectId = "dbx:project:foreign";
    expect(() => createProjectStage11ProjectSaveCurrentAuthorityLifecycleEvidence(wrongProducer)).toThrow(/projectId/i);

    const wrongLifecycle = sourceReceipt();
    wrongLifecycle.accessibilityObservation.terminalTitle = "DiceBox Project Save UI Execute PASS · dbx:project:desktop-multiscene-self-test · preview→approval→save→reread · generation 10 · history 5 · no Foundry write";
    expect(() => createProjectStage11ProjectSaveCurrentAuthorityLifecycleEvidence(wrongLifecycle)).toThrow(/terminalTitle/i);

    const staleReread = sourceReceipt();
    staleReread.authoritativeReread.remainingExactTargetPids = ["1234"];
    expect(() => createProjectStage11ProjectSaveCurrentAuthorityLifecycleEvidence(staleReread)).toThrow(/remainingExactTargetPids/i);
  });

  it("fails closed for promoted or certifying output", () => {
    const result = createProjectStage11ProjectSaveCurrentAuthorityLifecycleEvidence(sourceReceipt());

    expect(() => projectStage11ProjectSaveCurrentAuthorityLifecycleEvidenceSchema.parse({ ...result, aggregateAuthority: "granted" })).toThrow(/aggregateAuthority/i);
    expect(() => projectStage11ProjectSaveCurrentAuthorityLifecycleEvidenceSchema.parse({ ...result, noProjectMutationByM963: false })).toThrow(/noProjectMutationByM963/i);
    expect(() => projectStage11ProjectSaveCurrentAuthorityLifecycleEvidenceSchema.parse({ ...result, readyClaim: true })).toThrow(/readyClaim/i);
  });
});
