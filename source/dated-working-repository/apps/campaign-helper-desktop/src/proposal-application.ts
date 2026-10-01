import { previewProposalBatch, type ProposalBatchActor, type ProposalBatchInput } from "@dicebox/core";
import { createCampaignDirectorProposalBatch, type DirectorReviewReceipt } from "@dicebox/director";
import {
  applySceneCommand,
  createHumanSceneProposalBatch,
  redoSceneHistory,
  serializeSceneDocument,
  undoSceneHistory,
  type SceneCommand,
  type SceneDocument,
  type SceneHistory,
} from "@dicebox/scene";
import {
  beginDesktopProposalSessionApply,
  createDesktopProposalSession,
  type DesktopProposalSession,
} from "./proposal-session";

export async function sha256SceneDocument(document: SceneDocument): Promise<string> {
  const digest = await globalThis.crypto.subtle.digest("SHA-256", new TextEncoder().encode(serializeSceneDocument(document)));
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

export function proposalHistoryRereadTarget(history: SceneHistory, transition: "undo" | "redo"): SceneDocument {
  const next = transition === "undo" ? undoSceneHistory(history) : redoSceneHistory(history);
  if (next === history) throw new Error(`Scene ${transition} has no available history target.`);
  return next.present;
}

export async function createCampaignDirectorDesktopProposalSession(input: {
  readonly projectId: string;
  readonly batchId: ProposalBatchInput["batchId"];
  readonly receipt: DirectorReviewReceipt;
  readonly provider: string;
  readonly document: SceneDocument;
  readonly requester: ProposalBatchActor;
  readonly observedAt: string;
}): Promise<DesktopProposalSession> {
  if (input.receipt.status !== "PASS") throw new Error("Only a validated Campaign Director proposal can enter desktop review.");
  if (input.receipt.documentId !== input.document.id || input.receipt.baseRevision !== input.document.revision) {
    throw new Error("Campaign Director proposal does not target the current exact Scene base.");
  }
  const batch = await createCampaignDirectorProposalBatch({
    batchId: input.batchId,
    receipt: input.receipt,
    documentSha256: await sha256SceneDocument(input.document),
    provider: input.provider,
    createdAt: input.observedAt,
  });
  const history = await previewProposalBatch(batch, input.requester, input.observedAt);
  return createDesktopProposalSession({ projectId: input.projectId, sceneId: input.document.id, batch, history });
}

export async function createHumanDesktopProposalSession(input: {
  readonly projectId: string;
  readonly batchId: ProposalBatchInput["batchId"];
  readonly command: SceneCommand;
  readonly document: SceneDocument;
  readonly requester: ProposalBatchActor;
  readonly observedAt: string;
}): Promise<DesktopProposalSession> {
  if (input.command.origin.kind !== "human" || input.command.baseRevision !== input.document.revision) {
    throw new Error("Human proposal must target the current exact Scene revision with human provenance.");
  }
  const batch = await createHumanSceneProposalBatch({
    batchId: input.batchId,
    document: input.document,
    documentSha256: await sha256SceneDocument(input.document),
    command: input.command,
    createdAt: input.observedAt,
    risk: "low",
  });
  const history = await previewProposalBatch(batch, input.requester, input.observedAt);
  return createDesktopProposalSession({ projectId: input.projectId, sceneId: input.document.id, batch, history });
}

function sceneCommand(session: DesktopProposalSession): SceneCommand {
  if (session.batch.commands.length !== 1 || !session.batch.commands[0]!.kind.startsWith("scene.")) {
    throw new Error("Desktop Scene apply requires exactly one reviewed Scene command.");
  }
  return session.batch.commands[0]!.payload as SceneCommand;
}

export async function prepareDesktopProposalApplication(input: {
  readonly session: DesktopProposalSession;
  readonly projectId: string;
  readonly document: SceneDocument;
  readonly executor: ProposalBatchActor;
  readonly observedAt: string;
}): Promise<Readonly<{
  applyingSession: DesktopProposalSession;
  command: SceneCommand;
  expectedDocument: SceneDocument;
  expectedSha256: string;
}>> {
  if (input.session.projectId !== input.projectId || input.session.sceneId !== input.document.id) {
    throw new Error("Proposal apply requires the exact active project and Scene session.");
  }
  const currentBase = {
    targetId: input.document.id,
    revision: input.document.revision,
    sha256: await sha256SceneDocument(input.document),
  };
  const applyingSession = await beginDesktopProposalSessionApply(input.session, input.executor, currentBase, input.observedAt);
  const command = sceneCommand(applyingSession);
  const expectedDocument = applySceneCommand(input.document, command).document;
  return {
    applyingSession,
    command,
    expectedDocument,
    expectedSha256: await sha256SceneDocument(expectedDocument),
  };
}
