import { describe, expect, it } from "vitest";
import {
  createFixedOperationBridge,
  FIXED_TEST_WORLD_ID,
  redactSnapshot,
} from "@dicebox/bridge";
import { createStableDiceBoxId } from "@dicebox/core";
import { RuntimeFingerprintSchema, RuntimeProbeReceiptSchema } from "@dicebox/core";

const observedAt = "2026-08-21T06:30:00.000Z";
const fixtureId = createStableDiceBoxId("fixture", "journal");

function runtime() {
  return {
    phase: "ready" as const,
    foundryVersion: "14.367",
    systemId: "dnd5e",
    systemVersion: "5.3.3",
    observedAt,
    activeModuleIds: ["dicebox-campaign-helper"],
    documentTypes: ["JournalEntry"],
    capabilities: [
      { id: "foundry.document.write" as const, state: "available" as const, reason: "fixture" },
      { id: "foundry.document.read" as const, state: "available" as const, reason: "fixture" },
      { id: "foundry.users.active-gm" as const, state: "available" as const, reason: "fixture" },
    ],
  };
}

function requestId(localKey: string) {
  return createStableDiceBoxId("request", localKey);
}

function plan() {
  return {
    schemaVersion: "0.1.0" as const,
    planId: createStableDiceBoxId("plan", "bridge-preview"),
    semantic: { id: createStableDiceBoxId("journal", "bridge-preview"), kind: "journal" as const },
    documentType: "JournalEntry" as const,
    operation: "create" as const,
    title: "Bridge preview",
    content: "No mutation is performed by this request.",
    expectedBindingGeneration: 0,
  };
}

describe("fixed-operation local bridge", () => {
  it("reports a schema-validated read-only status", async () => {
    const bridge = createFixedOperationBridge({ runtime: runtime() });
    const result = await bridge.handle({
      schemaVersion: "0.1.0",
      requestId: requestId("status"),
      worldId: FIXED_TEST_WORLD_ID,
      operation: "status",
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.status).toBe("PASS");
      expect(result.value.receipt.evidenceClass).toBe("deterministic");
      expect(result.value.payload).toMatchObject({ readOnly: true, mutationEnabled: false });
      const payload = result.value.payload as { readonly runtimeFingerprint: unknown; readonly probeReceipt: unknown };
      expect(RuntimeFingerprintSchema.parse(payload.runtimeFingerprint).exactTargetMatch).toBe(true);
      expect(RuntimeProbeReceiptSchema.parse(payload.probeReceipt).noWrite).toBe(true);
    }
  });

  it("previews a managed JournalEntry without a mutation handler", async () => {
    const bridge = createFixedOperationBridge({ runtime: runtime() });
    const result = await bridge.handle({
      schemaVersion: "0.1.0",
      requestId: requestId("preview"),
      worldId: FIXED_TEST_WORLD_ID,
      operation: "plan.preview",
      plan: plan(),
      authority: "gm",
      observedAt,
      idempotencyKey: createStableDiceBoxId("idempotency", "preview"),
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.status).toBe("PASS");
      expect(result.value.receipt.notes.join(" ")).toContain("no Foundry Document mutation");
    }
  });

  it("redacts UUIDs, titles, and content from a snapshot", () => {
    const snapshot = redactSnapshot({
      fixtureId,
      runtime: runtime(),
      bindings: [{
        semantic: { id: createStableDiceBoxId("journal", "redacted"), kind: "journal" },
        runtime: "foundry",
        documentType: "JournalEntry",
        documentId: "secret-document-id",
        uuid: "JournalEntry.world.secret-document-id",
        generation: 2,
      }],
    }, observedAt);
    const serialized = JSON.stringify(snapshot);

    expect(snapshot.managedDocuments[0]?.bindingFingerprint).toMatch(/^redacted:/);
    expect(serialized).not.toContain("secret-document-id");
    expect(serialized).not.toContain("JournalEntry.world");
    expect(serialized).not.toContain("title");
    expect(serialized).not.toContain("content");
  });

  it("rejects non-JournalEntry bindings at the redaction boundary", () => {
    expect(() => redactSnapshot({
      fixtureId,
      runtime: runtime(),
      bindings: [{
        semantic: { id: createStableDiceBoxId("actor", "not-journal"), kind: "actor" },
        runtime: "foundry",
        documentType: "Actor",
        documentId: "actor-id",
        uuid: "Actor.world.actor-id",
        generation: 1,
      }],
    }, observedAt)).toThrow(/non-JournalEntry/);
  });

  it("requires a reviewed handler for fixture selection and deduplicates requests", async () => {
    let calls = 0;
    const bridge = createFixedOperationBridge({
      runtime: runtime(),
      handlers: {
        selectFixture: async (selectedFixtureId) => {
          calls += 1;
          return { ok: true, value: { fixtureId: selectedFixtureId, selected: true as const } };
        },
      },
    });
    const base = {
      schemaVersion: "0.1.0" as const,
      requestId: requestId("fixture-select"),
      worldId: FIXED_TEST_WORLD_ID,
      operation: "fixture.select" as const,
      fixtureId,
      idempotencyKey: createStableDiceBoxId("idempotency", "fixture-select"),
    };
    expect((await bridge.handle(base)).ok).toBe(true);
    expect((await bridge.handle(base)).ok).toBe(true);
    expect(calls).toBe(1);

    const changed = await bridge.handle({ ...base, fixtureId: createStableDiceBoxId("fixture", "other") });
    expect(changed.ok).toBe(false);
    if (!changed.ok) expect(changed.error.code).toBe("FORBIDDEN");
  });

  it("keeps apply/reset unavailable even when their request shapes contain approval", async () => {
    const bridge = createFixedOperationBridge({ runtime: runtime() });
    const approval = {
      schemaVersion: "0.1.0" as const,
      tokenId: createStableDiceBoxId("approval", "bridge"),
      planId: plan().planId,
      previewReceiptId: createStableDiceBoxId("receipt", "bridge-preview"),
      planFingerprint: "fnv1a:12345678",
      approvedBy: "gm" as const,
      approvedByUserId: "gm-fixture",
      approvedAt: observedAt,
      expiresAt: "2026-08-21T07:30:00.000Z",
    };
    const result = await bridge.handle({
      schemaVersion: "0.1.0",
      requestId: requestId("apply"),
      worldId: FIXED_TEST_WORLD_ID,
      operation: "plan.applyApproved",
      plan: plan(),
      previewReceiptId: approval.previewReceiptId,
      approvalToken: approval,
      activeGmUserId: "gm-fixture",
      observedAt,
      idempotencyKey: createStableDiceBoxId("idempotency", "apply"),
    });

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe("NOT_READY");
  });

  it("rejects an approval token that names a different plan before the readiness gate", async () => {
    const bridge = createFixedOperationBridge({ runtime: runtime() });
    const currentPlan = plan();
    const approval = {
      schemaVersion: "0.1.0" as const,
      tokenId: createStableDiceBoxId("approval", "mismatch"),
      planId: createStableDiceBoxId("plan", "other"),
      previewReceiptId: createStableDiceBoxId("receipt", "bridge-preview-mismatch"),
      planFingerprint: "fnv1a:12345678",
      approvedBy: "gm" as const,
      approvedByUserId: "gm-fixture",
      approvedAt: observedAt,
      expiresAt: "2026-08-21T07:30:00.000Z",
    };
    const result = await bridge.handle({
      schemaVersion: "0.1.0",
      requestId: requestId("apply-mismatch"),
      worldId: FIXED_TEST_WORLD_ID,
      operation: "plan.applyApproved",
      plan: currentPlan,
      previewReceiptId: approval.previewReceiptId,
      approvalToken: approval,
      activeGmUserId: "gm-fixture",
      observedAt,
      idempotencyKey: createStableDiceBoxId("idempotency", "apply-mismatch"),
    });

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe("FORBIDDEN");
  });

  it("rejects unknown operations and non-test worlds before dispatch", async () => {
    const bridge = createFixedOperationBridge({ runtime: runtime() });
    const unknown = await bridge.handle({
      schemaVersion: "0.1.0",
      requestId: requestId("unknown"),
      worldId: FIXED_TEST_WORLD_ID,
      operation: "execute-anything",
    });
    const wrongWorld = await bridge.handle({
      schemaVersion: "0.1.0",
      requestId: requestId("wrong-world"),
      worldId: "production-world",
      operation: "status",
    });

    expect(unknown.ok).toBe(false);
    expect(wrongWorld.ok).toBe(false);
  });
});
