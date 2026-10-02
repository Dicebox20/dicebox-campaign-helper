import { describe, expect, it } from "vitest";
import {
  appendCampaignDirectorStreamDelta,
  beginCampaignDirectorTurn,
  cancelCampaignDirectorTurn,
  classifyCampaignDirectorIntent,
  completeCampaignDirectorAnswer,
  completeCampaignDirectorProposal,
  createCampaignDirectorConversation,
  failCampaignDirectorTurn,
  parseCampaignDirectorConversation,
  serializeCampaignDirectorConversation,
} from "../packages/dicebox-director/src/index";

const budget = { requestedChars: 1200, usedChars: 420, recordCount: 2, truncated: false } as const;
const citations = [{ citationId: "dbx:citation:f1", recordId: "F-1", sourceId: "SRC-1", label: "Current project fact" }] as const;

function conversation() {
  return createCampaignDirectorConversation({ conversationId: "dbx:conversation:test", projectId: "dbx:project:test" });
}

describe("Campaign Director conversation core", () => {
  it("classifies all four intents deterministically with authority-first precedence", () => {
    expect(classifyCampaignDirectorIntent("Why is the room locked?")).toBe("explain");
    expect(classifyCampaignDirectorIntent("Inspect current Scene status")).toBe("inspect");
    expect(classifyCampaignDirectorIntent("Preview a move for the altar")).toBe("plan-preview");
    expect(classifyCampaignDirectorIntent("Apply the approved change and recover if needed")).toBe("execute-recover");
  });

  it("persists a streamed cited answer with exact context-budget accounting", () => {
    let state = beginCampaignDirectorTurn(conversation(), { turnId: "dbx:turn:one", userMessageId: "dbx:message:user-one", content: "Explain the current project", contextBudget: budget });
    state = appendCampaignDirectorStreamDelta(state, "dbx:turn:one", "The current ");
    const completed = completeCampaignDirectorAnswer(state, { turnId: "dbx:turn:one", assistantMessageId: "dbx:message:assistant-one", content: "project is bounded.", citations });
    expect(completed.receipt).toMatchObject({ status: "PASS", intent: "explain", noWrite: true, contextBudget: budget, citations });
    expect(completed.conversation.messages).toHaveLength(2);
    expect(completed.conversation.turns[0]).toMatchObject({ status: "completed", streamedText: "The current project is bounded." });
    expect(parseCampaignDirectorConversation(serializeCampaignDirectorConversation(completed.conversation))).toEqual(completed.conversation);
  });

  it("emits a no-write approval-required proposal receipt", () => {
    const state = beginCampaignDirectorTurn(conversation(), { turnId: "dbx:turn:plan", userMessageId: "dbx:message:user-plan", content: "Preview a move", contextBudget: budget });
    const completed = completeCampaignDirectorProposal(state, {
      turnId: "dbx:turn:plan",
      assistantMessageId: "dbx:message:assistant-plan",
      content: "One typed translation is ready for review.",
      citations,
      proposalReceiptId: "dbx:receipt:proposal-one",
    });
    expect(completed.receipt).toMatchObject({ status: "PASS", intent: "plan-preview", noWrite: true, approvalRequired: true });
  });

  it("preserves cancelled, offline, and failed history while retrying as a new attempt", () => {
    let state = beginCampaignDirectorTurn(conversation(), { turnId: "dbx:turn:cancelled", userMessageId: "dbx:message:user-cancelled", content: "Inspect status", contextBudget: budget });
    state = cancelCampaignDirectorTurn(state, "dbx:turn:cancelled");
    state = beginCampaignDirectorTurn(state, { turnId: "dbx:turn:retry", userMessageId: "dbx:message:user-retry", content: "Inspect status", contextBudget: budget, retryOfTurnId: "dbx:turn:cancelled" });
    state = failCampaignDirectorTurn(state, "dbx:turn:retry", true);
    state = beginCampaignDirectorTurn(state, { turnId: "dbx:turn:retry-two", userMessageId: "dbx:message:user-retry-two", content: "Inspect status", contextBudget: budget, retryOfTurnId: "dbx:turn:retry" });
    state = failCampaignDirectorTurn(state, "dbx:turn:retry-two");
    expect(state.turns.map(({ status, attempt, retryOfTurnId }) => ({ status, attempt, retryOfTurnId }))).toEqual([
      { status: "cancelled", attempt: 1, retryOfTurnId: null },
      { status: "offline", attempt: 2, retryOfTurnId: "dbx:turn:cancelled" },
      { status: "blocked", attempt: 3, retryOfTurnId: "dbx:turn:retry" },
    ]);
  });

  it("blocks stale transitions, duplicate IDs, invalid budgets, and tampered serialized state", () => {
    let state = beginCampaignDirectorTurn(conversation(), { turnId: "dbx:turn:one", userMessageId: "dbx:message:user-one", content: "Explain state", contextBudget: budget });
    state = cancelCampaignDirectorTurn(state, "dbx:turn:one");
    expect(() => appendCampaignDirectorStreamDelta(state, "dbx:turn:one", "late")).toThrow(/only streaming turns/);
    expect(() => beginCampaignDirectorTurn(state, { turnId: "dbx:turn:one", userMessageId: "dbx:message:user-two", content: "Explain", contextBudget: budget })).toThrow(/Duplicate turn/);
    expect(() => beginCampaignDirectorTurn(conversation(), { turnId: "dbx:turn:bad", userMessageId: "dbx:message:user-bad", content: "Explain", contextBudget: { ...budget, usedChars: 1300 } })).toThrow(/Used context budget/);
    const tampered = JSON.stringify({ ...state, noWrite: false });
    expect(() => parseCampaignDirectorConversation(tampered)).toThrow(/schema or authority marker/);
    const inconsistent = JSON.stringify({ ...state, turns: [{ ...state.turns[0], status: "completed", errorCode: null }] });
    expect(() => parseCampaignDirectorConversation(inconsistent)).toThrow(/Completed turn state is inconsistent/);
  });

  it("redacts secrets from messages, stream deltas, and citation labels", () => {
    let state = beginCampaignDirectorTurn(conversation(), { turnId: "dbx:turn:redact", userMessageId: "dbx:message:user-redact", content: "Explain sk-1234567890SECRET", contextBudget: budget });
    state = appendCampaignDirectorStreamDelta(state, "dbx:turn:redact", "Bearer abcdefghijklmnop ");
    const completed = completeCampaignDirectorAnswer(state, {
      turnId: "dbx:turn:redact",
      assistantMessageId: "dbx:message:assistant-redact",
      content: "done",
      citations: [{ ...citations[0], label: "api_key=supersecret" }],
    });
    expect(JSON.stringify(completed)).not.toMatch(/SECRET|abcdefghijklmnop|supersecret/);
    expect(JSON.stringify(completed)).toContain("[REDACTED]");
  });
});
