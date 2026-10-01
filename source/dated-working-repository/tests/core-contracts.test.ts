import { describe, expect, it } from "vitest";
import {
  EvidenceReceiptSchema,
  RuntimeBindingSchema,
  SemanticRefSchema,
  RuntimeProfileSchema,
  createStableDiceBoxId,
  createCapabilityRegistry,
  describeKnowledgeBase,
} from "@dicebox/core";

describe("M0 core contracts", () => {
  it("keeps semantic identity separate from Foundry names and UUIDs", () => {
    const semantic = { id: createStableDiceBoxId("room", "entrance"), kind: "scene" as const };
    const binding = RuntimeBindingSchema.parse({
      semantic,
      runtime: "foundry",
      documentType: "Scene",
      documentId: "abc123",
      uuid: "Scene.world.abc123",
      generation: 1,
      displayName: "A different display name",
    });

    expect(SemanticRefSchema.parse(semantic)).toEqual(semantic);
    expect(binding.semantic.id).toBe(semantic.id);
    expect(binding.displayName).not.toBe(semantic.id);
    expect(binding.uuid).not.toBe(semantic.id);
  });

  it("validates receipts with evidence and authority fields", () => {
    const receipt = EvidenceReceiptSchema.parse({
      receiptId: "receipt:m0",
      operation: "bridge.health",
      status: "observed",
      evidenceClass: "deterministic",
      authority: "none",
      semanticRefs: [],
      observedAt: "2026-08-21T00:00:00.000Z",
      notes: ["No world mutation occurred."],
    });

    expect(receipt.status).toBe("observed");
    expect(receipt.authority).toBe("none");
  });

  it("describes the SQLite knowledge base as read-only", () => {
    const source = describeKnowledgeBase("C:/foundation");
    expect(source.mode).toBe("read-only");
    expect(source.databasePath).toContain("dicebox_campaign_helper_knowledge.sqlite");
  });

  it("indexes a runtime profile without promoting unknown capabilities", () => {
    const profile = RuntimeProfileSchema.parse({
      phase: "runtime-probe",
      foundryVersion: "14.367",
      systemId: "dnd5e",
      systemVersion: "5.3.3",
      observedAt: "2026-08-21T00:00:00.000Z",
      activeModuleIds: ["dicebox-campaign-helper"],
      documentTypes: ["Actor", "Item"],
      capabilities: [
        { id: "foundry.runtime.probe", state: "available", reason: "observed" },
        { id: "foundry.document.write", state: "unavailable", reason: "gated" },
      ],
    });
    const registry = createCapabilityRegistry(profile);
    expect(registry.supports("foundry.runtime.probe").state).toBe("available");
    expect(registry.supports("foundry.document.write").state).toBe("unavailable");
    expect(registry.supports("bridge.health").state).toBe("unknown");
  });
});
