import {
  applySceneCommand,
  SceneCommandError,
  type SceneCommand,
  type SceneDocument,
} from "@dicebox/scene";
import {
  CAMPAIGN_DIRECTOR_MAX_CONTEXT_CHARS,
  CAMPAIGN_DIRECTOR_MAX_OUTPUT_TOKENS,
  redactDirectorText,
} from "./shared";

export const CAMPAIGN_DIRECTOR_SCHEMA_VERSION = "0.2.0" as const;
export * from "./proposal-adapter.js";

export * from "./conversation";
export {
  CAMPAIGN_DIRECTOR_MAX_CONTEXT_CHARS,
  CAMPAIGN_DIRECTOR_MAX_OUTPUT_TOKENS,
  redactDirectorText,
} from "./shared";

export type CampaignDirectorProviderMode = "chatgpt-subscription" | "api-key" | "offline";

export type CampaignDirectorProviderSelection = Readonly<{
  status: "PASS";
  requested: CampaignDirectorProviderMode;
  selected: CampaignDirectorProviderMode;
  automaticFallback: false;
  billing: "chatgpt-subscription" | "api-usage" | "none";
}> | Readonly<{
  status: "BLOCKED";
  requested: CampaignDirectorProviderMode;
  selected: null;
  automaticFallback: false;
  code: "PROVIDER_UNAVAILABLE";
  reason: string;
}>;

export function selectCampaignDirectorProvider(input: Readonly<{
  requested: CampaignDirectorProviderMode;
  subscriptionAvailable: boolean;
  apiKeyConfigured: boolean;
}>): CampaignDirectorProviderSelection {
  if (input.requested === "offline") {
    return { status: "PASS", requested: input.requested, selected: "offline", automaticFallback: false, billing: "none" };
  }
  if (input.requested === "chatgpt-subscription" && input.subscriptionAvailable) {
    return { status: "PASS", requested: input.requested, selected: input.requested, automaticFallback: false, billing: "chatgpt-subscription" };
  }
  if (input.requested === "api-key" && input.apiKeyConfigured) {
    return { status: "PASS", requested: input.requested, selected: input.requested, automaticFallback: false, billing: "api-usage" };
  }
  return {
    status: "BLOCKED",
    requested: input.requested,
    selected: null,
    automaticFallback: false,
    code: "PROVIDER_UNAVAILABLE",
    reason: input.requested === "chatgpt-subscription"
      ? "The managed ChatGPT subscription route is unavailable; choose API-key backup or AI offline explicitly."
      : "The separately billed API-key route is not configured; choose ChatGPT subscription or AI offline explicitly.",
  };
}

export type CampaignDirectorProviderMetadata = Readonly<{
  mode: CampaignDirectorProviderMode;
  available: boolean;
  authMode: string | null;
  planType: string | null;
  rateLimitWindow: string | null;
  usageSummary: string | null;
  billing: "chatgpt-subscription" | "api-usage" | "none";
  secretsReturned: false;
}>;

export type DirectorKnowledgeRecord = Readonly<{
  id: string;
  kind: "fact" | "decision" | "open_item" | "trial";
  text: string;
  sourceId: string;
}>;

export type DirectorFunctionCall = Readonly<{
  id: string;
  type: "function_call";
  name: string;
  arguments: string;
}>;

export type DirectorResponseEnvelope = Readonly<{
  id?: unknown;
  model?: unknown;
  status?: unknown;
  error?: unknown;
  output?: unknown;
}>;

export type DirectorProposalReceipt = Readonly<{
  operation: "dicebox.campaign-director.proposal.review";
  status: "PASS";
  schemaVersion: typeof CAMPAIGN_DIRECTOR_SCHEMA_VERSION;
  callId: string;
  toolName: "propose_scene_command";
  documentId: string;
  baseRevision: number;
  proposedRevision: number;
  command: SceneCommand;
  patches: readonly Readonly<{
    entityId: string;
    before: Readonly<{ x: number; y: number; width: number; height: number }>;
    after: Readonly<{ x: number; y: number; width: number; height: number }>;
  }>[];
  noWrite: true;
  approvalRequired: true;
}>;

export type DirectorBlockedReceipt = Readonly<{
  operation: "dicebox.campaign-director.proposal.review";
  status: "BLOCKED";
  schemaVersion: typeof CAMPAIGN_DIRECTOR_SCHEMA_VERSION;
  callId: string;
  code: "UNKNOWN_TOOL" | "INVALID_ARGUMENTS" | "INVALID_COMMAND" | "STALE_REVISION" | "RESPONSE_ERROR" | "NO_PROPOSAL" | "MULTIPLE_PROPOSALS" | "REFUSAL";
  reason: string;
  noWrite: true;
}>;

export type DirectorReviewReceipt = DirectorProposalReceipt | DirectorBlockedReceipt;

export type DirectorKnowledgeReceipt = Readonly<{
  operation: "dicebox.campaign-director.knowledge.review";
  status: "PASS";
  schemaVersion: typeof CAMPAIGN_DIRECTOR_SCHEMA_VERSION;
  callId: string;
  toolName: "query_project" | "explain_project";
  subject: string;
  records: readonly DirectorKnowledgeRecord[];
  noWrite: true;
}>;

export function selectDirectorKnowledgeSlice(
  records: readonly DirectorKnowledgeRecord[],
  terms: readonly string[],
  maxChars = CAMPAIGN_DIRECTOR_MAX_CONTEXT_CHARS,
): readonly DirectorKnowledgeRecord[] {
  if (!Number.isSafeInteger(maxChars) || maxChars <= 0 || maxChars > CAMPAIGN_DIRECTOR_MAX_CONTEXT_CHARS) {
    throw new Error(`Director context budget must be between 1 and ${CAMPAIGN_DIRECTOR_MAX_CONTEXT_CHARS} characters.`);
  }
  const normalizedTerms = terms.map((term) => term.trim().toLowerCase()).filter(Boolean);
  const ranked = records
    .map((record) => ({
      record,
      score: normalizedTerms.reduce((score, term) => score + (record.text.toLowerCase().includes(term) ? 1 : 0), 0),
    }))
    .filter(({ score }) => normalizedTerms.length === 0 || score > 0)
    .sort((left, right) => right.score - left.score || left.record.id.localeCompare(right.record.id));
  const selected: DirectorKnowledgeRecord[] = [];
  let used = 0;
  for (const { record } of ranked) {
    const safe = { ...record, text: redactDirectorText(record.text) };
    const size = JSON.stringify(safe).length;
    if (used + size > maxChars) continue;
    selected.push(safe);
    used += size;
  }
  return selected;
}

export const CAMPAIGN_DIRECTOR_TOOLS = [
  {
    type: "function",
    name: "query_project",
    description: "Request a bounded read-only DiceBox project or knowledge-base query.",
    strict: true,
    parameters: {
      type: "object",
      additionalProperties: false,
      properties: {
        term: { type: "string", minLength: 1, maxLength: 200 },
        kinds: { type: "array", items: { enum: ["fact", "decision", "open_item", "trial"] }, minItems: 1, maxItems: 4 },
      },
      required: ["term", "kinds"],
    },
  },
  {
    type: "function",
    name: "explain_project",
    description: "Explain current project state from the supplied read-only document and KB slice.",
    strict: true,
    parameters: {
      type: "object",
      additionalProperties: false,
      properties: { subject: { type: "string", minLength: 1, maxLength: 300 } },
      required: ["subject"],
    },
  },
  {
    type: "function",
    name: "propose_scene_command",
    description: "Propose one typed Scene translation. This never executes the command.",
    strict: true,
    parameters: {
      type: "object",
      additionalProperties: false,
      properties: {
        commandId: { type: "string", minLength: 1, maxLength: 120 },
        baseRevision: { type: "integer", minimum: 0 },
        entityId: { type: "string", pattern: "^dbx:" },
        deltaX: { type: "number" },
        deltaY: { type: "number" },
        reason: { type: "string", minLength: 1, maxLength: 500 },
      },
      required: ["commandId", "baseRevision", "entityId", "deltaX", "deltaY", "reason"],
    },
  },
] as const;

export function buildCampaignDirectorResponseRequest(input: Readonly<{
  model: string;
  userIntent: string;
  document: SceneDocument;
  knowledge: readonly DirectorKnowledgeRecord[];
}>): Readonly<Record<string, unknown>> {
  if (input.model.trim() === "") throw new Error("Campaign Director model is required.");
  const safeIntent = redactDirectorText(input.userIntent);
  const safeKnowledge = selectDirectorKnowledgeSlice(input.knowledge, safeIntent.split(/\W+/).filter(Boolean));
  return {
    model: input.model,
    store: false,
    parallel_tool_calls: false,
    max_output_tokens: CAMPAIGN_DIRECTOR_MAX_OUTPUT_TOKENS,
    tool_choice: { type: "function", name: "propose_scene_command" },
    instructions: "You are the DiceBox Campaign Director. Explain, query, or propose exactly one typed command. Never claim execution, approval, or committed state.",
    input: [{
      role: "user",
      content: JSON.stringify({
        intent: safeIntent,
        document: {
          id: input.document.id,
          revision: input.document.revision,
          width: input.document.width,
          height: input.document.height,
          entities: input.document.entities.map(({ id, kind, name, x, y, width, height, locked }) => ({ id, kind, name, x, y, width, height, locked })),
        },
        knowledge: safeKnowledge,
      }),
    }],
    tools: CAMPAIGN_DIRECTOR_TOOLS,
  };
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : null;
}

export function extractCampaignDirectorFunctionCall(response: DirectorResponseEnvelope): DirectorFunctionCall | DirectorBlockedReceipt {
  const responseId = typeof response.id === "string" ? response.id : "response-unknown";
  if (response.error) return blocked(responseId, "RESPONSE_ERROR", "The Responses API returned an error.");
  if (response.status !== "completed") return blocked(responseId, "RESPONSE_ERROR", `The Responses API did not complete: ${String(response.status ?? "unknown")}.`);
  if (!Array.isArray(response.output)) return blocked(responseId, "NO_PROPOSAL", "The Responses API returned no output items.");

  const calls: DirectorFunctionCall[] = [];
  let refusal = false;
  for (const itemValue of response.output) {
    const item = asRecord(itemValue);
    if (!item) continue;
    if (item.type === "function_call" && typeof item.name === "string" && typeof item.arguments === "string") {
      const callId = typeof item.call_id === "string"
        ? item.call_id
        : typeof item.id === "string" ? item.id : `${responseId}-call-${calls.length + 1}`;
      calls.push({ id: callId, type: "function_call", name: item.name, arguments: item.arguments });
    }
    if (item.type === "refusal") refusal = true;
    if (item.type === "message" && Array.isArray(item.content)) {
      refusal ||= item.content.some((content) => asRecord(content)?.type === "refusal");
    }
  }
  if (refusal) return blocked(responseId, "REFUSAL", "The Campaign Director refused the proposal request.");
  if (calls.length === 0) return blocked(responseId, "NO_PROPOSAL", "The Campaign Director returned no typed proposal call.");
  if (calls.length > 1) return blocked(responseId, "MULTIPLE_PROPOSALS", "The Campaign Director returned more than one proposal call.");
  return calls[0]!;
}

export function reviewCampaignDirectorResponse(document: SceneDocument, response: DirectorResponseEnvelope): DirectorReviewReceipt {
  const extracted = extractCampaignDirectorFunctionCall(response);
  return "status" in extracted ? extracted : reviewCampaignDirectorFunctionCall(document, extracted);
}

export function reviewCampaignDirectorKnowledgeCall(
  records: readonly DirectorKnowledgeRecord[],
  call: DirectorFunctionCall,
): DirectorKnowledgeReceipt | DirectorBlockedReceipt {
  if (call.name !== "query_project" && call.name !== "explain_project") {
    return blocked(call.id, "UNKNOWN_TOOL", `Unsupported knowledge tool: ${call.name}`);
  }
  let value: unknown;
  try {
    value = JSON.parse(call.arguments);
  } catch {
    return blocked(call.id, "INVALID_ARGUMENTS", "Function arguments are not valid JSON.");
  }
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return blocked(call.id, "INVALID_ARGUMENTS", "Function arguments must be an object.");
  }
  const args = value as Record<string, unknown>;
  if (call.name === "query_project") {
    if (Object.keys(args).sort().join(",") !== "kinds,term" || typeof args.term !== "string" || args.term.trim() === "" || args.term.length > 200 || !Array.isArray(args.kinds)) {
      return blocked(call.id, "INVALID_ARGUMENTS", "Bounded query arguments are missing or invalid.");
    }
    const kinds = args.kinds;
    if (kinds.length < 1 || kinds.length > 4 || kinds.some((kind) => !["fact", "decision", "open_item", "trial"].includes(String(kind)))) {
      return blocked(call.id, "INVALID_ARGUMENTS", "Bounded query kinds are invalid.");
    }
    const selected = selectDirectorKnowledgeSlice(
      records.filter((record) => kinds.includes(record.kind)),
      args.term.split(/\W+/).filter(Boolean),
    );
    return {
      operation: "dicebox.campaign-director.knowledge.review",
      status: "PASS",
      schemaVersion: CAMPAIGN_DIRECTOR_SCHEMA_VERSION,
      callId: call.id,
      toolName: "query_project",
      subject: redactDirectorText(args.term),
      records: selected,
      noWrite: true,
    };
  }
  if (Object.keys(args).join(",") !== "subject" || typeof args.subject !== "string" || args.subject.trim() === "" || args.subject.length > 300) {
    return blocked(call.id, "INVALID_ARGUMENTS", "Explanation subject is missing or invalid.");
  }
  return {
    operation: "dicebox.campaign-director.knowledge.review",
    status: "PASS",
    schemaVersion: CAMPAIGN_DIRECTOR_SCHEMA_VERSION,
    callId: call.id,
    toolName: "explain_project",
    subject: redactDirectorText(args.subject),
    records: selectDirectorKnowledgeSlice(records, args.subject.split(/\W+/).filter(Boolean)),
    noWrite: true,
  };
}

function blocked(callId: string, code: DirectorBlockedReceipt["code"], reason: string): DirectorBlockedReceipt {
  return {
    operation: "dicebox.campaign-director.proposal.review",
    status: "BLOCKED",
    schemaVersion: CAMPAIGN_DIRECTOR_SCHEMA_VERSION,
    callId,
    code,
    reason: redactDirectorText(reason),
    noWrite: true,
  };
}

export function reviewCampaignDirectorFunctionCall(document: SceneDocument, call: DirectorFunctionCall): DirectorReviewReceipt {
  if (call.name !== "propose_scene_command") return blocked(call.id, "UNKNOWN_TOOL", `Unsupported proposal tool: ${call.name}`);
  let value: unknown;
  try {
    value = JSON.parse(call.arguments);
  } catch {
    return blocked(call.id, "INVALID_ARGUMENTS", "Function arguments are not valid JSON.");
  }
  if (!value || typeof value !== "object" || Array.isArray(value)) return blocked(call.id, "INVALID_ARGUMENTS", "Function arguments must be an object.");
  const args = value as Record<string, unknown>;
  const expectedKeys = ["baseRevision", "commandId", "deltaX", "deltaY", "entityId", "reason"];
  const receivedKeys = Object.keys(args).sort();
  if (receivedKeys.length !== expectedKeys.length || receivedKeys.some((key, index) => key !== expectedKeys[index])) {
    return blocked(call.id, "INVALID_ARGUMENTS", "Typed Scene command contains unknown or missing fields.");
  }
  if (
    typeof args.commandId !== "string" || typeof args.entityId !== "string" || typeof args.reason !== "string"
    || !Number.isSafeInteger(args.baseRevision) || typeof args.deltaX !== "number" || !Number.isFinite(args.deltaX)
    || typeof args.deltaY !== "number" || !Number.isFinite(args.deltaY)
    || args.commandId.trim() === "" || args.reason.trim() === "" || !args.entityId.startsWith("dbx:")
  ) return blocked(call.id, "INVALID_ARGUMENTS", "Typed Scene command fields are missing or invalid.");

  const command: SceneCommand = {
    schemaVersion: "0.1.0",
    kind: "translate-entity",
    commandId: args.commandId,
    baseRevision: args.baseRevision as number,
    entityId: args.entityId,
    deltaX: args.deltaX,
    deltaY: args.deltaY,
    origin: {
      kind: "ai-fixture",
      principalId: "campaign-director",
      reason: redactDirectorText(args.reason),
    },
  };
  try {
    const preview = applySceneCommand(document, command);
    return {
      operation: "dicebox.campaign-director.proposal.review",
      status: "PASS",
      schemaVersion: CAMPAIGN_DIRECTOR_SCHEMA_VERSION,
      callId: call.id,
      toolName: "propose_scene_command",
      documentId: document.id,
      baseRevision: document.revision,
      proposedRevision: preview.document.revision,
      command,
      patches: preview.receipt.patches,
      noWrite: true,
      approvalRequired: true,
    };
  } catch (error) {
    if (error instanceof SceneCommandError) {
      return blocked(call.id, error.code === "STALE_REVISION" ? "STALE_REVISION" : "INVALID_COMMAND", error.message);
    }
    return blocked(call.id, "INVALID_COMMAND", error instanceof Error ? error.message : String(error));
  }
}
