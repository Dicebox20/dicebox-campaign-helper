import { describe, expect, it } from "vitest";
import { reviewCampaignDirectorFunctionCall } from "@dicebox/director";
import { applySceneCommand, createSceneHistory, executeSceneCommand } from "@dicebox/scene";
import { fixtureScene } from "../apps/campaign-helper-desktop/src/fixture-scene";
import {
  createCampaignDirectorDesktopProposalSession,
  createHumanDesktopProposalSession,
  prepareDesktopProposalApplication,
  proposalHistoryRereadTarget,
  sha256SceneDocument,
} from "../apps/campaign-helper-desktop/src/proposal-application";
import {
  approveDesktopProposalSession,
  commitDesktopProposalSession,
  redoDesktopProposalSession,
  undoDesktopProposalSession,
} from "../apps/campaign-helper-desktop/src/proposal-session";

const requester = { actorId: "desktop-user", role: "requester" as const };
const reviewer = { actorId: "desktop-user", role: "reviewer" as const };
const projectId = "dbx:project:desktop-proposal-application";
const at = (second: number) => `2026-08-28T03:00:${String(second).padStart(2, "0")}.000Z`;

function reviewedProposal() {
  return reviewCampaignDirectorFunctionCall(fixtureScene, {
    id: "director-call-1",
    type: "function_call",
    name: "propose_scene_command",
    arguments: JSON.stringify({
      commandId: "desktop-director-test-1",
      baseRevision: fixtureScene.revision,
      entityId: "dbx:apparatus:core",
      deltaX: 8,
      deltaY: 0,
      reason: "Bounded desktop application test",
    }),
  });
}

describe("desktop generic proposal application", () => {
  it("stages an exact low-risk no-write human Scene proposal", async () => {
    const review = reviewedProposal();
    if (review.status !== "PASS") throw new Error("fixture review blocked");
    const humanCommand = {
      ...review.command,
      commandId: "desktop-human-test-1",
      origin: { kind: "human" as const, principalId: "desktop-user", reason: "Human preview test" },
    };
    const before = JSON.stringify(fixtureScene);
    const session = await createHumanDesktopProposalSession({
      projectId,
      batchId: "dbx:proposal:desktop-human-application",
      command: humanCommand,
      document: fixtureScene,
      requester,
      observedAt: at(0),
    });
    expect(session).toMatchObject({
      batch: {
        producer: { kind: "human", provider: null },
        reviewAuthority: { domain: "human-review", requiredRole: "reviewer" },
        targetAuthority: { domain: "local-project", requiredActiveGm: false },
        risk: "low",
      },
      history: { status: "previewed" },
    });
    expect(JSON.stringify(fixtureScene)).toBe(before);
  });

  it("stages a no-write Director preview with producer, authority, hash, and history evidence", async () => {
    const before = JSON.stringify(fixtureScene);
    const session = await createCampaignDirectorDesktopProposalSession({
      projectId,
      batchId: "dbx:proposal:desktop-application-1",
      receipt: reviewedProposal(),
      provider: "local-fixture",
      document: fixtureScene,
      requester,
      observedAt: at(0),
    });

    expect(session).toMatchObject({
      projectId,
      sceneId: fixtureScene.id,
      batch: {
        producer: { kind: "campaign-director", provider: "local-fixture" },
        reviewAuthority: { domain: "human-review", requiredRole: "reviewer" },
        targetAuthority: { domain: "local-project", requiredActiveGm: false },
        risk: "medium",
      },
      history: { status: "previewed" },
    });
    expect(session.batch.base.sha256).toBe(await sha256SceneDocument(fixtureScene));
    expect(JSON.stringify(fixtureScene)).toBe(before);
  });

  it("applies only an exact approved base and records matched commit, undo, and redo rereads", async () => {
    const previewed = await createCampaignDirectorDesktopProposalSession({
      projectId,
      batchId: "dbx:proposal:desktop-application-2",
      receipt: reviewedProposal(),
      provider: "local-fixture",
      document: fixtureScene,
      requester,
      observedAt: at(0),
    });
    const approved = await approveDesktopProposalSession(previewed, reviewer, previewed.batch.base, at(1));
    const prepared = await prepareDesktopProposalApplication({ session: approved, projectId, document: fixtureScene, executor: reviewer, observedAt: at(2) });
    expect(prepared.applyingSession.history.status).toBe("applying");
    expect(fixtureScene.revision).toBe(0);

    const applied = applySceneCommand(fixtureScene, prepared.command).document;
    expect(await sha256SceneDocument(applied)).toBe(prepared.expectedSha256);
    const committed = await commitDesktopProposalSession(prepared.applyingSession, reviewer, {
      status: "matched",
      targetId: prepared.applyingSession.batch.base.targetId,
      revision: applied.revision,
      sha256: prepared.expectedSha256,
    }, at(3));
    const undone = await undoDesktopProposalSession(committed, reviewer, {
      status: "matched",
      targetId: committed.batch.base.targetId,
      revision: fixtureScene.revision,
      sha256: await sha256SceneDocument(fixtureScene),
    }, at(4));
    const redone = await redoDesktopProposalSession(undone, reviewer, {
      status: "matched",
      targetId: undone.batch.base.targetId,
      revision: applied.revision,
      sha256: await sha256SceneDocument(applied),
    }, at(5));

    expect(redone.history.status).toBe("redone");
    expect(redone.history.receipts.map((receipt) => receipt.transition)).toEqual([
      "preview", "approve", "begin-apply", "commit-after-reread", "undo", "redo",
    ]);
  });

  it("blocks an approved proposal when the current serialized Scene base has drifted", async () => {
    const previewed = await createCampaignDirectorDesktopProposalSession({
      projectId,
      batchId: "dbx:proposal:desktop-application-3",
      receipt: reviewedProposal(),
      provider: "local-fixture",
      document: fixtureScene,
      requester,
      observedAt: at(0),
    });
    const approved = await approveDesktopProposalSession(previewed, reviewer, previewed.batch.base, at(1));
    const driftReview = reviewedProposal();
    if (driftReview.status !== "PASS") throw new Error("fixture review blocked");
    const drifted = applySceneCommand(fixtureScene, driftReview.command).document;
    await expect(prepareDesktopProposalApplication({ session: approved, projectId, document: drifted, executor: reviewer, observedAt: at(2) })).rejects.toThrow(/stale/i);
  });

  it("predicts authoritative undo and redo documents with monotonic restoration revisions", () => {
    const review = reviewedProposal();
    if (review.status !== "PASS") throw new Error("fixture review blocked");
    const appliedHistory = executeSceneCommand(createSceneHistory(fixtureScene), review.command);
    const undoTarget = proposalHistoryRereadTarget(appliedHistory, "undo");
    expect(undoTarget).toMatchObject({ revision: 2, entities: expect.arrayContaining([expect.objectContaining({ id: "dbx:apparatus:core", x: 608 })]) });
    const undoneHistory = { ...appliedHistory, present: undoTarget, past: [], future: [appliedHistory.present] };
    const redoTarget = proposalHistoryRereadTarget(undoneHistory, "redo");
    expect(redoTarget).toMatchObject({ revision: 3, entities: expect.arrayContaining([expect.objectContaining({ id: "dbx:apparatus:core", x: 616 })]) });
  });
});
