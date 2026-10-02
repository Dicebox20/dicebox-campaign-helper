import { CAMPAIGN_DIRECTOR_MAX_CONTEXT_CHARS, redactDirectorText } from "./shared";

export const CAMPAIGN_DIRECTOR_CONVERSATION_VERSION = "0.1.0" as const;

export type CampaignDirectorIntent = "explain" | "inspect" | "plan-preview" | "execute-recover";
export type CampaignDirectorTurnStatus = "streaming" | "completed" | "cancelled" | "blocked" | "offline";

export type CampaignDirectorCitation = Readonly<{
  citationId: string;
  recordId: string;
  sourceId: string;
  label: string;
}>;

export type CampaignDirectorContextBudget = Readonly<{
  requestedChars: number;
  usedChars: number;
  recordCount: number;
  truncated: boolean;
}>;

export type CampaignDirectorMessage = Readonly<{
  messageId: string;
  role: "user" | "assistant";
  content: string;
  citations: readonly CampaignDirectorCitation[];
}>;

export type CampaignDirectorTurn = Readonly<{
  turnId: string;
  attempt: number;
  intent: CampaignDirectorIntent;
  status: CampaignDirectorTurnStatus;
  userMessageId: string;
  assistantMessageId: string | null;
  streamedText: string;
  contextBudget: CampaignDirectorContextBudget;
  errorCode: "CANCELLED" | "PROVIDER_ERROR" | "PROVIDER_OFFLINE" | null;
  retryOfTurnId: string | null;
  noWrite: true;
}>;

export type CampaignDirectorConversation = Readonly<{
  schemaVersion: typeof CAMPAIGN_DIRECTOR_CONVERSATION_VERSION;
  conversationId: string;
  projectId: string;
  revision: number;
  messages: readonly CampaignDirectorMessage[];
  turns: readonly CampaignDirectorTurn[];
  noWrite: true;
}>;

export type CampaignDirectorAnswerReceipt = Readonly<{
  operation: "dicebox.campaign-director.answer";
  status: "PASS";
  conversationId: string;
  turnId: string;
  intent: "explain" | "inspect";
  answer: string;
  citations: readonly CampaignDirectorCitation[];
  contextBudget: CampaignDirectorContextBudget;
  noWrite: true;
}>;

export type CampaignDirectorConversationProposalReceipt = Readonly<{
  operation: "dicebox.campaign-director.conversation-proposal";
  status: "PASS";
  conversationId: string;
  turnId: string;
  intent: "plan-preview" | "execute-recover";
  proposalReceiptId: string;
  citations: readonly CampaignDirectorCitation[];
  contextBudget: CampaignDirectorContextBudget;
  noWrite: true;
  approvalRequired: true;
}>;

const stableId = /^dbx:[a-z0-9][a-z0-9:._-]{2,159}$/;

function requireId(value: string, label: string): void {
  if (!stableId.test(value)) throw new Error(`${label} must be a stable DiceBox ID.`);
}

function validateBudget(budget: CampaignDirectorContextBudget): CampaignDirectorContextBudget {
  if (!Number.isSafeInteger(budget.requestedChars) || budget.requestedChars < 0 || budget.requestedChars > CAMPAIGN_DIRECTOR_MAX_CONTEXT_CHARS) {
    throw new Error(`Requested context budget must be between 0 and ${CAMPAIGN_DIRECTOR_MAX_CONTEXT_CHARS}.`);
  }
  if (!Number.isSafeInteger(budget.usedChars) || budget.usedChars < 0 || budget.usedChars > budget.requestedChars) {
    throw new Error("Used context budget must be a non-negative integer no larger than requestedChars.");
  }
  if (!Number.isSafeInteger(budget.recordCount) || budget.recordCount < 0) throw new Error("Context recordCount must be a non-negative integer.");
  return { ...budget };
}

function validateCitations(citations: readonly CampaignDirectorCitation[]): readonly CampaignDirectorCitation[] {
  const seen = new Set<string>();
  return citations.map((citation) => {
    requireId(citation.citationId, "citationId");
    if (citation.recordId.trim() === "" || citation.sourceId.trim() === "" || citation.label.trim() === "") throw new Error("Citation record, source, and label are required.");
    if (seen.has(citation.citationId)) throw new Error(`Duplicate citation: ${citation.citationId}`);
    seen.add(citation.citationId);
    return { ...citation, label: redactDirectorText(citation.label) };
  });
}

export function classifyCampaignDirectorIntent(text: string): CampaignDirectorIntent {
  const normalized = text.trim().toLowerCase();
  if (!normalized) throw new Error("Campaign Director intent text is required.");
  if (/\b(execute|apply|commit|recover|retry|undo|fix)\b/.test(normalized)) return "execute-recover";
  if (/\b(plan|preview|propose|draft|change|move|create|update|edit)\b/.test(normalized)) return "plan-preview";
  if (/\b(inspect|check|show|list|status|verify|audit|find)\b/.test(normalized)) return "inspect";
  return "explain";
}

export function createCampaignDirectorConversation(input: Readonly<{
  conversationId: string;
  projectId: string;
}>): CampaignDirectorConversation {
  requireId(input.conversationId, "conversationId");
  requireId(input.projectId, "projectId");
  return {
    schemaVersion: CAMPAIGN_DIRECTOR_CONVERSATION_VERSION,
    conversationId: input.conversationId,
    projectId: input.projectId,
    revision: 0,
    messages: [],
    turns: [],
    noWrite: true,
  };
}

function replaceTurn(conversation: CampaignDirectorConversation, turn: CampaignDirectorTurn): CampaignDirectorConversation {
  const index = conversation.turns.findIndex((item) => item.turnId === turn.turnId);
  if (index < 0) throw new Error(`Unknown Campaign Director turn: ${turn.turnId}`);
  const turns = [...conversation.turns];
  turns[index] = turn;
  return { ...conversation, revision: conversation.revision + 1, turns };
}

function activeTurn(conversation: CampaignDirectorConversation, turnId: string): CampaignDirectorTurn {
  requireId(turnId, "turnId");
  const turn = conversation.turns.find((item) => item.turnId === turnId);
  if (!turn) throw new Error(`Unknown Campaign Director turn: ${turnId}`);
  if (turn.status !== "streaming") throw new Error(`Turn ${turnId} is ${turn.status}; only streaming turns can transition.`);
  return turn;
}

export function beginCampaignDirectorTurn(conversation: CampaignDirectorConversation, input: Readonly<{
  turnId: string;
  userMessageId: string;
  content: string;
  contextBudget: CampaignDirectorContextBudget;
  retryOfTurnId?: string | null;
}>): CampaignDirectorConversation {
  requireId(input.turnId, "turnId");
  requireId(input.userMessageId, "userMessageId");
  if (conversation.turns.some((turn) => turn.turnId === input.turnId)) throw new Error(`Duplicate turn: ${input.turnId}`);
  if (conversation.messages.some((message) => message.messageId === input.userMessageId)) throw new Error(`Duplicate message: ${input.userMessageId}`);
  if (conversation.turns.some((turn) => turn.status === "streaming")) throw new Error("Only one Campaign Director turn may stream at a time.");
  const safeContent = redactDirectorText(input.content.trim());
  if (!safeContent) throw new Error("User message content is required.");
  let attempt = 1;
  let retryOfTurnId: string | null = input.retryOfTurnId ?? null;
  if (retryOfTurnId) {
    requireId(retryOfTurnId, "retryOfTurnId");
    const prior = conversation.turns.find((turn) => turn.turnId === retryOfTurnId);
    if (!prior || !["cancelled", "blocked", "offline"].includes(prior.status)) throw new Error("Retry requires a prior cancelled, blocked, or offline turn.");
    attempt = prior.attempt + 1;
  }
  const message: CampaignDirectorMessage = { messageId: input.userMessageId, role: "user", content: safeContent, citations: [] };
  const turn: CampaignDirectorTurn = {
    turnId: input.turnId,
    attempt,
    intent: classifyCampaignDirectorIntent(safeContent),
    status: "streaming",
    userMessageId: input.userMessageId,
    assistantMessageId: null,
    streamedText: "",
    contextBudget: validateBudget(input.contextBudget),
    errorCode: null,
    retryOfTurnId,
    noWrite: true,
  };
  return { ...conversation, revision: conversation.revision + 1, messages: [...conversation.messages, message], turns: [...conversation.turns, turn] };
}

export function appendCampaignDirectorStreamDelta(conversation: CampaignDirectorConversation, turnId: string, delta: string): CampaignDirectorConversation {
  const turn = activeTurn(conversation, turnId);
  const safeDelta = redactDirectorText(delta);
  if (!safeDelta) throw new Error("Streaming delta is required.");
  return replaceTurn(conversation, { ...turn, streamedText: turn.streamedText + safeDelta });
}

export function cancelCampaignDirectorTurn(conversation: CampaignDirectorConversation, turnId: string): CampaignDirectorConversation {
  const turn = activeTurn(conversation, turnId);
  return replaceTurn(conversation, { ...turn, status: "cancelled", errorCode: "CANCELLED" });
}

export function failCampaignDirectorTurn(conversation: CampaignDirectorConversation, turnId: string, offline = false): CampaignDirectorConversation {
  const turn = activeTurn(conversation, turnId);
  return replaceTurn(conversation, { ...turn, status: offline ? "offline" : "blocked", errorCode: offline ? "PROVIDER_OFFLINE" : "PROVIDER_ERROR" });
}

function completeTurn(conversation: CampaignDirectorConversation, input: Readonly<{
  turnId: string;
  assistantMessageId: string;
  content: string;
  citations: readonly CampaignDirectorCitation[];
}>): Readonly<{ conversation: CampaignDirectorConversation; turn: CampaignDirectorTurn; citations: readonly CampaignDirectorCitation[] }> {
  const turn = activeTurn(conversation, input.turnId);
  requireId(input.assistantMessageId, "assistantMessageId");
  if (conversation.messages.some((message) => message.messageId === input.assistantMessageId)) throw new Error(`Duplicate message: ${input.assistantMessageId}`);
  const content = redactDirectorText((turn.streamedText + input.content).trim());
  if (!content) throw new Error("Assistant response content is required.");
  const citations = validateCitations(input.citations);
  const assistant: CampaignDirectorMessage = { messageId: input.assistantMessageId, role: "assistant", content, citations };
  const completed = { ...turn, status: "completed" as const, assistantMessageId: input.assistantMessageId, streamedText: content };
  const withMessage = { ...conversation, messages: [...conversation.messages, assistant] };
  return { conversation: replaceTurn(withMessage, completed), turn: completed, citations };
}

export function completeCampaignDirectorAnswer(conversation: CampaignDirectorConversation, input: Readonly<{
  turnId: string;
  assistantMessageId: string;
  content: string;
  citations: readonly CampaignDirectorCitation[];
}>): Readonly<{ conversation: CampaignDirectorConversation; receipt: CampaignDirectorAnswerReceipt }> {
  const completed = completeTurn(conversation, input);
  if (completed.turn.intent !== "explain" && completed.turn.intent !== "inspect") throw new Error("Answer completion requires an explain or inspect turn.");
  return {
    conversation: completed.conversation,
    receipt: {
      operation: "dicebox.campaign-director.answer",
      status: "PASS",
      conversationId: conversation.conversationId,
      turnId: input.turnId,
      intent: completed.turn.intent,
      answer: completed.turn.streamedText,
      citations: completed.citations,
      contextBudget: completed.turn.contextBudget,
      noWrite: true,
    },
  };
}

export function completeCampaignDirectorProposal(conversation: CampaignDirectorConversation, input: Readonly<{
  turnId: string;
  assistantMessageId: string;
  content: string;
  citations: readonly CampaignDirectorCitation[];
  proposalReceiptId: string;
}>): Readonly<{ conversation: CampaignDirectorConversation; receipt: CampaignDirectorConversationProposalReceipt }> {
  requireId(input.proposalReceiptId, "proposalReceiptId");
  const completed = completeTurn(conversation, input);
  if (completed.turn.intent !== "plan-preview" && completed.turn.intent !== "execute-recover") throw new Error("Proposal completion requires a plan-preview or execute-recover turn.");
  return {
    conversation: completed.conversation,
    receipt: {
      operation: "dicebox.campaign-director.conversation-proposal",
      status: "PASS",
      conversationId: conversation.conversationId,
      turnId: input.turnId,
      intent: completed.turn.intent,
      proposalReceiptId: input.proposalReceiptId,
      citations: completed.citations,
      contextBudget: completed.turn.contextBudget,
      noWrite: true,
      approvalRequired: true,
    },
  };
}

export function serializeCampaignDirectorConversation(conversation: CampaignDirectorConversation): string {
  validateCampaignDirectorConversation(conversation);
  return JSON.stringify(conversation);
}

export function parseCampaignDirectorConversation(serialized: string): CampaignDirectorConversation {
  const parsed: unknown = JSON.parse(serialized);
  validateCampaignDirectorConversation(parsed);
  return parsed as CampaignDirectorConversation;
}

export function validateCampaignDirectorConversation(value: unknown): asserts value is CampaignDirectorConversation {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("Conversation must be an object.");
  const conversation = value as Partial<CampaignDirectorConversation>;
  if (conversation.schemaVersion !== CAMPAIGN_DIRECTOR_CONVERSATION_VERSION || conversation.noWrite !== true) throw new Error("Conversation schema or authority marker is invalid.");
  requireId(String(conversation.conversationId ?? ""), "conversationId");
  requireId(String(conversation.projectId ?? ""), "projectId");
  if (!Number.isSafeInteger(conversation.revision) || Number(conversation.revision) < 0 || !Array.isArray(conversation.messages) || !Array.isArray(conversation.turns)) throw new Error("Conversation revision, messages, or turns are invalid.");
  const messageIds = new Set<string>();
  const citationIds = new Set<string>();
  const messagesById = new Map<string, CampaignDirectorMessage>();
  for (const message of conversation.messages) {
    requireId(message.messageId, "messageId");
    if (messageIds.has(message.messageId) || !["user", "assistant"].includes(message.role) || typeof message.content !== "string" || !message.content.trim() || !Array.isArray(message.citations)) throw new Error("Conversation message is invalid or duplicated.");
    messageIds.add(message.messageId);
    messagesById.set(message.messageId, message);
    for (const citation of validateCitations(message.citations)) {
      if (citationIds.has(citation.citationId)) throw new Error(`Duplicate conversation citation: ${citation.citationId}`);
      citationIds.add(citation.citationId);
    }
  }
  const turnIds = new Set<string>();
  const turnsById = new Map<string, CampaignDirectorTurn>();
  let streaming = 0;
  for (const turn of conversation.turns) {
    requireId(turn.turnId, "turnId");
    if (turnIds.has(turn.turnId) || !["explain", "inspect", "plan-preview", "execute-recover"].includes(turn.intent) || !["streaming", "completed", "cancelled", "blocked", "offline"].includes(turn.status) || turn.noWrite !== true) throw new Error("Conversation turn is invalid or duplicated.");
    turnIds.add(turn.turnId);
    const userMessage = messagesById.get(turn.userMessageId);
    const assistantMessage = turn.assistantMessageId ? messagesById.get(turn.assistantMessageId) : undefined;
    if (!userMessage || userMessage.role !== "user" || (turn.assistantMessageId && (!assistantMessage || assistantMessage.role !== "assistant"))) throw new Error("Conversation turn references an unknown or mismatched message.");
    if (!Number.isSafeInteger(turn.attempt) || turn.attempt < 1) throw new Error("Conversation turn attempt is invalid.");
    validateBudget(turn.contextBudget);
    if (turn.status === "completed") {
      if (!assistantMessage || turn.errorCode !== null || turn.streamedText !== assistantMessage.content) throw new Error("Completed turn state is inconsistent.");
    } else if (turn.assistantMessageId !== null) {
      throw new Error("Incomplete turn cannot reference an assistant message.");
    }
    const expectedError = turn.status === "cancelled" ? "CANCELLED" : turn.status === "offline" ? "PROVIDER_OFFLINE" : turn.status === "blocked" ? "PROVIDER_ERROR" : null;
    if (turn.errorCode !== expectedError) throw new Error("Conversation turn error state is inconsistent.");
    if (turn.retryOfTurnId) {
      const prior = turnsById.get(turn.retryOfTurnId);
      if (!prior || !["cancelled", "blocked", "offline"].includes(prior.status) || turn.attempt !== prior.attempt + 1) throw new Error("Conversation retry chain is invalid.");
    } else if (turn.attempt !== 1) {
      throw new Error("Initial conversation turn attempt must be one.");
    }
    turnsById.set(turn.turnId, turn);
    if (turn.status === "streaming") streaming += 1;
  }
  if (streaming > 1) throw new Error("Only one conversation turn may be streaming.");
  if (Number(conversation.revision) < conversation.turns.length) throw new Error("Conversation revision is stale.");
}
