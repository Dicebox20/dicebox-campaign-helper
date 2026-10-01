import { describe, expect, it } from "vitest";
import { createProposalBatch, previewProposalBatch } from "../packages/dicebox-core/src/proposal-batch.js";
import { createDesktopProjectProposalSession } from "../apps/campaign-helper-desktop/src/project-proposal-session.js";
import {
  inspectTypedLocalProjectReviewApplyCoverage,
  TYPED_LOCAL_PROJECT_REVIEW_APPLY_COMMAND_KINDS,
} from "../apps/campaign-helper-desktop/src/project-review-apply-coverage.js";

const projectId = "dbx:project:review-apply-coverage";

async function sessionFor(kind: string, options?: { targetId?: string; authority?: "local-project" | "foundry-active-gm"; commandCount?: number }) {
  const commandCount = options?.commandCount ?? 1;
  const targetId = options?.targetId ?? projectId;
  const batch = await createProposalBatch({
    schemaVersion: "0.1.0",
    batchId: `dbx:proposal:review-apply-${kind.replace(/[^a-z0-9]+/gi, "-")}`,
    revision: 0,
    previousBatchSha256: null,
    producer: { kind: "project-store", sourceId: kind, provider: null },
    reviewAuthority: { domain: "human-review", requiredRole: "reviewer" },
    targetAuthority: { domain: options?.authority ?? "local-project", requiredActiveGm: options?.authority === "foundry-active-gm" },
    risk: "medium",
    base: { targetId, revision: 1, sha256: "a".repeat(64) },
    commands: Array.from({ length: commandCount }, (_, index) => ({ commandId: `dbx:proposal-command:review-apply-${index}`, kind, dependsOn: [], payload: { projectId: targetId, previewSha256: "b".repeat(64) } })),
    createdAt: "2026-08-28T21:00:00.000Z",
  });
  const history = await previewProposalBatch(batch, { actorId: "requester", role: "requester" }, "2026-08-28T21:00:01.000Z");
  return createDesktopProjectProposalSession({ projectId, batch, history });
}

describe("M384 typed local-project review/apply coverage", () => {
  it("covers every existing local-project command kind as a session-only review/apply contract", async () => {
    expect(TYPED_LOCAL_PROJECT_REVIEW_APPLY_COMMAND_KINDS).toHaveLength(14);
    for (const kind of TYPED_LOCAL_PROJECT_REVIEW_APPLY_COMMAND_KINDS) {
      const coverage = inspectTypedLocalProjectReviewApplyCoverage(await sessionFor(kind));
      expect(coverage).toMatchObject({ status: "PASS", commandKind: kind, exactTarget: true, reviewerApprovalDispatchReady: true, operationSpecificApplyReady: false, noNewExecutorAuthority: true });
    }
  });

  it("fails closed for foreign authority, target mismatch, multi-command batches, and unlisted kinds", async () => {
    const session = await sessionFor("project.save");
    expect(inspectTypedLocalProjectReviewApplyCoverage({ ...session, batch: { ...session.batch, commands: [{ ...session.batch.commands[0]!, kind: "project.unknown" }] } })).toMatchObject({ status: "BLOCKED", reason: expect.stringMatching(/allowlist/) });
    expect(inspectTypedLocalProjectReviewApplyCoverage({ ...session, projectId: "dbx:project:other" })).toMatchObject({ status: "BLOCKED", reason: expect.stringMatching(/target/) });
    expect(inspectTypedLocalProjectReviewApplyCoverage({ ...session, batch: { ...session.batch, commands: [session.batch.commands[0]!, session.batch.commands[0]!] } })).toMatchObject({ status: "BLOCKED", reason: expect.stringMatching(/Exactly one/) });
    expect(inspectTypedLocalProjectReviewApplyCoverage({ ...session, batch: { ...session.batch, targetAuthority: { domain: "foundry-active-gm", requiredActiveGm: true } } })).toMatchObject({ status: "BLOCKED", reason: expect.stringMatching(/local-project/) });
  });
});
