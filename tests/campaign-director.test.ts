import { describe, expect, it } from "vitest";
import {
  buildCampaignDirectorResponseRequest,
  extractCampaignDirectorFunctionCall,
  reviewCampaignDirectorFunctionCall,
  reviewCampaignDirectorKnowledgeCall,
  reviewCampaignDirectorResponse,
  selectCampaignDirectorProvider,
  selectDirectorKnowledgeSlice,
} from "../packages/dicebox-director/src/index";
import type { SceneDocument } from "../packages/dicebox-scene/src/index";

const scene: SceneDocument = {
  schemaVersion: "0.1.0",
  revision: 4,
  id: "dbx:scene:director-test",
  name: "Director Test",
  width: 1000,
  height: 800,
  background: { color: 0x101010, gridSize: 50 },
  entities: [{ id: "dbx:apparatus:test", kind: "apparatus", name: "Test", x: 100, y: 100, width: 100, height: 100, color: 0xffffff, locked: false }],
};

function call(overrides: Record<string, unknown> = {}) {
  return {
    id: "call-1",
    type: "function_call" as const,
    name: "propose_scene_command",
    arguments: JSON.stringify({ commandId: "ai-1", baseRevision: 4, entityId: "dbx:apparatus:test", deltaX: 8, deltaY: 0, reason: "Align apparatus", ...overrides }),
  };
}

describe("bounded Campaign Director", () => {
  it("requires explicit provider selection and never performs paid automatic fallback", () => {
    expect(selectCampaignDirectorProvider({ requested: "chatgpt-subscription", subscriptionAvailable: false, apiKeyConfigured: true })).toMatchObject({
      status: "BLOCKED", selected: null, automaticFallback: false, code: "PROVIDER_UNAVAILABLE",
    });
    expect(selectCampaignDirectorProvider({ requested: "api-key", subscriptionAvailable: true, apiKeyConfigured: true })).toMatchObject({
      status: "PASS", selected: "api-key", billing: "api-usage", automaticFallback: false,
    });
    expect(selectCampaignDirectorProvider({ requested: "offline", subscriptionAvailable: true, apiKeyConfigured: true })).toMatchObject({
      status: "PASS", selected: "offline", billing: "none", automaticFallback: false,
    });
  });

  it("builds a Responses request with three strict typed tools and no credential", () => {
    const request = buildCampaignDirectorResponseRequest({ model: "gpt-test", userIntent: "Move the apparatus", document: scene, knowledge: [] });
    expect(request.store).toBe(false);
    expect(request.parallel_tool_calls).toBe(false);
    expect(request.tool_choice).toEqual({ type: "function", name: "propose_scene_command" });
    expect(request.max_output_tokens).toBe(1_000);
    expect(request.tools).toHaveLength(3);
    expect(JSON.stringify(request)).not.toMatch(/api[_-]?key|access[_-]?token/i);
  });

  it("returns a validated no-write proposal requiring approval", () => {
    const receipt = reviewCampaignDirectorFunctionCall(scene, call());
    expect(receipt).toMatchObject({ status: "PASS", noWrite: true, approvalRequired: true, baseRevision: 4, proposedRevision: 5 });
    if (receipt.status === "PASS") expect(receipt.command.origin).toMatchObject({ kind: "ai-fixture", principalId: "campaign-director" });
    expect(scene.revision).toBe(4);
  });

  it("blocks stale state and an unknown tool", () => {
    expect(reviewCampaignDirectorFunctionCall(scene, call({ baseRevision: 3 }))).toMatchObject({ status: "BLOCKED", code: "STALE_REVISION" });
    expect(reviewCampaignDirectorFunctionCall(scene, { ...call(), name: "execute_foundry" })).toMatchObject({ status: "BLOCKED", code: "UNKNOWN_TOOL" });
  });

  it("blocks invalid commands through the deterministic Scene validator", () => {
    expect(reviewCampaignDirectorFunctionCall(scene, call({ deltaX: 5000 }))).toMatchObject({ status: "BLOCKED", code: "INVALID_COMMAND" });
    expect(reviewCampaignDirectorFunctionCall(scene, call({ unexpected: true }))).toMatchObject({ status: "BLOCKED", code: "INVALID_ARGUMENTS" });
    expect(reviewCampaignDirectorFunctionCall(scene, call({ deltaX: Number.POSITIVE_INFINITY }))).toMatchObject({ status: "BLOCKED", code: "INVALID_ARGUMENTS" });
  });

  it("extracts exactly one current Responses API function call and keeps it review-only", () => {
    const response = {
      id: "resp-1",
      model: "gpt-test",
      status: "completed",
      output: [{ type: "function_call", call_id: "call-live", name: "propose_scene_command", arguments: call().arguments }],
    };
    expect(extractCampaignDirectorFunctionCall(response)).toMatchObject({ id: "call-live", name: "propose_scene_command" });
    expect(reviewCampaignDirectorResponse(scene, response)).toMatchObject({
      status: "PASS",
      noWrite: true,
      approvalRequired: true,
      callId: "call-live",
    });
    expect(scene.revision).toBe(4);
  });

  it("refuses missing, multiple, incomplete, and refusal response envelopes", () => {
    expect(reviewCampaignDirectorResponse(scene, { id: "r0", status: "completed", output: [] })).toMatchObject({ status: "BLOCKED", code: "NO_PROPOSAL" });
    expect(reviewCampaignDirectorResponse(scene, {
      id: "r1", status: "completed", output: [
        { type: "function_call", call_id: "a", name: "propose_scene_command", arguments: call().arguments },
        { type: "function_call", call_id: "b", name: "propose_scene_command", arguments: call().arguments },
      ],
    })).toMatchObject({ status: "BLOCKED", code: "MULTIPLE_PROPOSALS" });
    expect(reviewCampaignDirectorResponse(scene, { id: "r2", status: "incomplete", output: [] })).toMatchObject({ status: "BLOCKED", code: "RESPONSE_ERROR" });
    expect(reviewCampaignDirectorResponse(scene, {
      id: "r3", status: "completed", output: [{ type: "message", content: [{ type: "refusal", refusal: "No" }] }],
    })).toMatchObject({ status: "BLOCKED", code: "REFUSAL" });
  });

  it("bounds knowledge context and redacts secrets", () => {
    const selected = selectDirectorKnowledgeSlice([
      { id: "F-1", kind: "fact", sourceId: "SRC-1", text: "apparatus token sk-1234567890SECRET" },
      { id: "F-2", kind: "fact", sourceId: "SRC-2", text: "unrelated" },
    ], ["apparatus"], 200);
    expect(selected).toHaveLength(1);
    expect(selected[0]?.text).toContain("[REDACTED]");
    expect(JSON.stringify(selected).length).toBeLessThanOrEqual(200);
  });

  it("validates bounded query and explanation tools without write authority", () => {
    const records = [
      { id: "F-1", kind: "fact" as const, sourceId: "SRC-1", text: "semantic apparatus alignment" },
      { id: "D-1", kind: "decision" as const, sourceId: "SRC-2", text: "unrelated policy" },
    ];
    expect(reviewCampaignDirectorKnowledgeCall(records, {
      id: "query-1",
      type: "function_call",
      name: "query_project",
      arguments: JSON.stringify({ term: "apparatus", kinds: ["fact"] }),
    })).toMatchObject({ status: "PASS", toolName: "query_project", noWrite: true, records: [{ id: "F-1" }] });
    expect(reviewCampaignDirectorKnowledgeCall(records, {
      id: "explain-1",
      type: "function_call",
      name: "explain_project",
      arguments: JSON.stringify({ subject: "semantic apparatus" }),
    })).toMatchObject({ status: "PASS", toolName: "explain_project", noWrite: true });
    expect(reviewCampaignDirectorKnowledgeCall(records, {
      id: "query-bad",
      type: "function_call",
      name: "query_project",
      arguments: JSON.stringify({ term: "apparatus", kinds: ["fact"], sql: "SELECT *" }),
    })).toMatchObject({ status: "BLOCKED", code: "INVALID_ARGUMENTS" });
  });
});
