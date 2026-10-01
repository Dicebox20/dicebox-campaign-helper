import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { approveDesktopProjectProposalSession, createDesktopProjectProposalSession } from "../apps/campaign-helper-desktop/src/project-proposal-session.js";
import { inspectTypedLocalProjectReviewApplyCoverage, TYPED_LOCAL_PROJECT_REVIEW_APPLY_COMMAND_KINDS, TYPED_LOCAL_PROJECT_REVIEW_APPLY_OPERATION_CONTRACTS, TYPED_LOCAL_PROJECT_REVIEW_APPLY_VISIBLE_METADATA } from "../apps/campaign-helper-desktop/src/project-review-apply-coverage.js";
import { createProposalBatch, previewProposalBatch } from "../packages/dicebox-core/src/proposal-batch.js";

const projectId = "dbx:project:review-apply-acceptance";
const appSource = readFileSync(resolve(import.meta.dirname, "..", "apps", "campaign-helper-desktop", "src", "App.tsx"), "utf8");

async function createReviewSession(kind: string) {
  const batch = await createProposalBatch({
    schemaVersion: "0.1.0", batchId: `dbx:proposal:review-apply-acceptance-${kind.replace(/[^a-z0-9]+/gi, "-")}`, revision: 0, previousBatchSha256: null,
    producer: { kind: "project-store", sourceId: kind, provider: null }, reviewAuthority: { domain: "human-review", requiredRole: "reviewer" },
    targetAuthority: { domain: "local-project", requiredActiveGm: false }, risk: "medium", base: { targetId: projectId, revision: 4, sha256: "a".repeat(64) },
    commands: [{ commandId: `dbx:proposal-command:review-apply-acceptance-${kind.replace(/[^a-z0-9]+/gi, "-")}`, kind, dependsOn: [], payload: { projectId, previewSha256: "b".repeat(64) } }], createdAt: "2026-08-28T22:00:00.000Z",
  });
  const history = await previewProposalBatch(batch, { actorId: "requester", role: "requester" }, "2026-08-28T22:00:01.000Z");
  return createDesktopProjectProposalSession({ projectId, batch, history });
}

describe("M391 fixed local-project review-surface acceptance alignment", () => {
  it("proves all 14 current kinds transition preview → approved without project execution", async () => {
    expect(Object.keys(TYPED_LOCAL_PROJECT_REVIEW_APPLY_OPERATION_CONTRACTS)).toEqual([...TYPED_LOCAL_PROJECT_REVIEW_APPLY_COMMAND_KINDS]);
    for (const kind of TYPED_LOCAL_PROJECT_REVIEW_APPLY_COMMAND_KINDS) {
      const contract = TYPED_LOCAL_PROJECT_REVIEW_APPLY_OPERATION_CONTRACTS[kind];
      const previewed = await createReviewSession(kind);
      expect(inspectTypedLocalProjectReviewApplyCoverage(previewed)).toMatchObject({ status: "PASS", commandKind: kind, reviewerApprovalDispatchReady: true, operationSpecificApplyReady: false, applyHandler: contract.applyHandler, noNewExecutorAuthority: true });
      const approved = await approveDesktopProjectProposalSession(previewed, { actorId: "reviewer", role: "reviewer" }, previewed.batch.base, "2026-08-28T22:00:02.000Z");
      expect(inspectTypedLocalProjectReviewApplyCoverage(approved)).toMatchObject({ status: "PASS", commandKind: kind, reviewerApprovalDispatchReady: false, operationSpecificApplyReady: true, applyHandler: contract.applyHandler, noNewExecutorAuthority: true });
      expect(approved.history.receipts).toHaveLength(2);
    }
  });

  it("keeps the review surface on explicit operation-specific apply handlers", () => {
    for (const contract of Object.values(TYPED_LOCAL_PROJECT_REVIEW_APPLY_OPERATION_CONTRACTS)) expect(appSource).toContain(contract.applyHandler);
    expect(appSource).toContain("Typed local-project review/apply coverage:");
    expect(appSource).not.toContain("applyGenericProjectProposal");
    expect(appSource).not.toContain("executeGenericProjectProposal");
  });

  it("projects exactly the typed 14-operation contract as read-only visible metadata", () => {
    expect(TYPED_LOCAL_PROJECT_REVIEW_APPLY_VISIBLE_METADATA).toHaveLength(14);
    expect(TYPED_LOCAL_PROJECT_REVIEW_APPLY_VISIBLE_METADATA.map((operation) => operation.commandKind)).toEqual([...TYPED_LOCAL_PROJECT_REVIEW_APPLY_COMMAND_KINDS]);
    for (const operation of TYPED_LOCAL_PROJECT_REVIEW_APPLY_VISIBLE_METADATA) {
      expect(operation).toMatchObject({ reviewAuthority: "human-review", targetAuthority: "local-project", applyAuthority: "operation-specific", noGenericExecutor: true });
    }
    expect(appSource).toContain("TYPED_LOCAL_PROJECT_REVIEW_APPLY_VISIBLE_METADATA.map");
    expect(appSource).toContain("Typed local-project operation contract:");
    expect(appSource).toContain('data-testid="typed-local-project-operation-contract"');
    expect(appSource).toContain("no generic executor");
    expect(appSource).toContain("read-only summary is sourced from the typed contract matrix");
  });
});
