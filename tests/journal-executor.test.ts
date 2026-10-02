import { describe, expect, it } from "vitest";
import {
  mapManagedJournalEntryCreateData,
  type JournalEntryFixtureAdapter,
  type ManagedJournalEntryRecord,
} from "@dicebox/bridge";
import {
  approveTransaction,
  createPreviewTransaction,
  fingerprintManagedJournalEntry,
  createAppendOnlyTransactionJournalStore,
  previewManagedJournalEntry,
  TransactionJournalLedger,
  type DocumentPlanPreview,
} from "@dicebox/compiler";
import { executeApprovedJournalEntryCreate } from "@dicebox/bridge";
import { createStableDiceBoxId, type Result, type RuntimeBinding, type RuntimeProfile } from "@dicebox/core";

const approvedAt = "2026-08-21T02:00:00.000Z";
const executingAt = "2026-08-21T02:05:00.000Z";

function runtime(): RuntimeProfile {
  return {
    phase: "ready",
    foundryVersion: "14.367",
    systemId: "dnd5e",
    systemVersion: "5.3.3",
    observedAt: approvedAt,
    activeModuleIds: ["dicebox-campaign-helper"],
    documentTypes: ["JournalEntry"],
    capabilities: [
      { id: "foundry.document.write", state: "available", reason: "fixture" },
      { id: "foundry.document.read", state: "available", reason: "fixture" },
      { id: "foundry.users.active-gm", state: "available", reason: "fixture" },
    ],
  };
}

function preview(): DocumentPlanPreview {
  return previewManagedJournalEntry({
    schemaVersion: "0.1.0",
    planId: createStableDiceBoxId("plan", "executor-journal"),
    semantic: { id: createStableDiceBoxId("journal", "executor"), kind: "journal" },
    documentType: "JournalEntry",
    operation: "create",
    title: "Executor fixture",
    content: "A fixture for adapter-independent execution.",
    expectedBindingGeneration: 0,
  }, runtime(), { authority: "gm", observedAt: approvedAt });
}

function approved() {
  const currentPreview = preview();
  const transaction = createPreviewTransaction(currentPreview);
  const token = {
    schemaVersion: "0.1.0" as const,
    tokenId: createStableDiceBoxId("approval", "executor"),
    planId: currentPreview.plan.planId,
    previewReceiptId: currentPreview.receipt.receiptId as `dbx:${string}:${string}`,
    planFingerprint: fingerprintManagedJournalEntry(currentPreview.plan),
    approvedBy: "gm" as const,
    approvedByUserId: "gm-fixture",
    approvedAt,
    expiresAt: "2026-08-21T03:00:00.000Z",
  };
  const result = approveTransaction(transaction, currentPreview, token, {
    observedAt: approvedAt,
    activeGmUserId: "gm-fixture",
  });
  if (!result.ok) throw new Error(result.error.message);
  const journal = new TransactionJournalLedger();
  const recordedPreview = journal.append(transaction);
  if (!recordedPreview.ok) throw new Error(recordedPreview.error.message);
  const recordedApproval = journal.append(result.value);
  if (!recordedApproval.ok) throw new Error(recordedApproval.error.message);
  return { currentPreview, transaction: result.value, journal };
}

function fixtureAdapter(mode: "success" | "unknown-before" | "unknown-after" | "read-mismatch" | "read-failure"): JournalEntryFixtureAdapter {
  const records = new Map<string, ManagedJournalEntryRecord>();
  const idempotency = new Map<string, RuntimeBinding>();
  return {
    adapterId: "fixture.journal-entry@0.1.0",
    runtime: "fixture",
    foundryApi: {
      read: "fromUuid",
      create: "JournalEntry.create",
      createPage: "entry.createEmbeddedDocuments",
      update: "JournalEntry.update",
    },
    async read(binding) {
      if (mode === "read-failure") return { ok: false, error: { code: "UNKNOWN_OUTCOME", message: "fixture read timeout", retry: "after-reread" } };
      const record = records.get(binding.uuid) ?? null;
      if (record && mode === "read-mismatch") return { ok: true, value: { ...record, content: "foreign state" } };
      return { ok: true, value: record };
    },
    async create(plan, idempotencyKey) {
      const existing = idempotency.get(idempotencyKey);
      if (existing) return { ok: true, value: existing };
      mapManagedJournalEntryCreateData({ plan, pageType: "text", textFormat: 1 });
      if (mode === "unknown-before") return { ok: false, error: { code: "UNKNOWN_OUTCOME", message: "fixture create timeout", retry: "after-reread" } };
      const binding: RuntimeBinding = {
        semantic: plan.semantic,
        runtime: "foundry",
        documentType: "JournalEntry",
        documentId: "executor123",
        uuid: "JournalEntry.world.executor123",
        generation: 1,
      };
      idempotency.set(idempotencyKey, binding);
      records.set(binding.uuid, { semantic: plan.semantic, planId: plan.planId, binding, title: plan.title, content: plan.content });
      if (mode === "unknown-after") return { ok: false, error: { code: "UNKNOWN_OUTCOME", message: "fixture response lost after commit", retry: "after-reread" } };
      return { ok: true, value: binding };
    },
    async update(_plan, binding): Promise<Result<RuntimeBinding>> {
      return { ok: true, value: binding };
    },
  };
}

describe("M3 adapter-independent JournalEntry executor", () => {
  it("commits only after the adapter result and exact read-back agree", async () => {
    const { currentPreview, transaction, journal } = approved();
    const result = await executeApprovedJournalEntryCreate({
      preview: currentPreview,
      transaction,
      adapter: fixtureAdapter("success"),
      observedAt: executingAt,
      currentRuntime: runtime(),
      activeGmUserId: "gm-fixture",
      journal,
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.state).toBe("committed");
      expect(result.value.transaction.stage).toBe("committed");
      expect(result.value.binding?.uuid).toBe("JournalEntry.world.executor123");
      expect(result.value.receipt.evidenceClass).toBe("created_document");
    }
  });

  it("can persist every staged transition through the async append-only store", async () => {
    const { currentPreview, transaction, journal: inMemoryJournal } = approved();
    const initialEntries = JSON.parse(inMemoryJournal.toJSON()) as readonly unknown[];
    let text = `${initialEntries.map((entry) => JSON.stringify(entry)).join("\n")}\n`;
    const durableJournal = createAppendOnlyTransactionJournalStore({
      read: async () => text,
      append: async (line: string) => { text += line; },
    });
    const result = await executeApprovedJournalEntryCreate({
      preview: currentPreview,
      transaction,
      adapter: fixtureAdapter("success"),
      observedAt: executingAt,
      currentRuntime: runtime(),
      activeGmUserId: "gm-fixture",
      journal: durableJournal,
    });

    expect(result.ok).toBe(true);
    const entries = await durableJournal.entries();
    expect(entries.ok).toBe(true);
    if (entries.ok) expect(entries.value).toHaveLength(5);
    expect(text.trim().split("\n")).toHaveLength(5);
  });

  it("preserves unknown outcome when the create call times out before a verifiable result", async () => {
    const { currentPreview, transaction, journal } = approved();
    const result = await executeApprovedJournalEntryCreate({
      preview: currentPreview,
      transaction,
      adapter: fixtureAdapter("unknown-before"),
      observedAt: executingAt,
      currentRuntime: runtime(),
      activeGmUserId: "gm-fixture",
      journal,
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.state).toBe("unknown-outcome");
      expect(result.value.transaction.stage).toBe("unknown-outcome");
      expect(result.value.receipt.status).toBe("unknown");
    }
  });

  it("does not claim commit when the adapter may have committed but returned unknown", async () => {
    const { currentPreview, transaction, journal } = approved();
    const result = await executeApprovedJournalEntryCreate({
      preview: currentPreview,
      transaction,
      adapter: fixtureAdapter("unknown-after"),
      observedAt: executingAt,
      currentRuntime: runtime(),
      activeGmUserId: "gm-fixture",
      journal,
    });

    expect(result.ok).toBe(true);
    if (result.ok) expect(result.value.transaction.stage).toBe("unknown-outcome");
  });

  it("does not claim commit when read-back fails or returns a mismatched record", async () => {
    for (const mode of ["read-failure", "read-mismatch"] as const) {
      const { currentPreview, transaction, journal } = approved();
      const result = await executeApprovedJournalEntryCreate({
        preview: currentPreview,
        transaction,
        adapter: fixtureAdapter(mode),
        observedAt: executingAt,
        currentRuntime: runtime(),
        activeGmUserId: "gm-fixture",
        journal,
      });
      expect(result.ok).toBe(true);
      if (result.ok) expect(result.value.state).toBe("unknown-outcome");
    }
  });

  it("rejects a blocked or non-approved transaction before calling the adapter", async () => {
    const currentPreview = preview();
    const transaction = createPreviewTransaction(currentPreview);
    let called = false;
    const adapter = fixtureAdapter("success");
    const guardedAdapter = {
      ...adapter,
      async create(...args: Parameters<typeof adapter.create>) {
        called = true;
        return adapter.create(...args);
      },
    };
    const result = await executeApprovedJournalEntryCreate({
      preview: currentPreview,
      transaction,
      adapter: guardedAdapter,
      observedAt: executingAt,
      currentRuntime: runtime(),
      activeGmUserId: "gm-fixture",
      journal: new TransactionJournalLedger(),
    });

    expect(result.ok).toBe(false);
    expect(called).toBe(false);
  });

  it("rechecks the active GM identity before the adapter call", async () => {
    const { currentPreview, transaction, journal } = approved();
    let called = false;
    const adapter = fixtureAdapter("success");
    const guardedAdapter = {
      ...adapter,
      async create(...args: Parameters<typeof adapter.create>) {
        called = true;
        return adapter.create(...args);
      },
    };
    const result = await executeApprovedJournalEntryCreate({
      preview: currentPreview,
      transaction,
      adapter: guardedAdapter,
      observedAt: executingAt,
      currentRuntime: runtime(),
      activeGmUserId: "different-gm",
      journal,
    });

    expect(result.ok).toBe(false);
    expect(called).toBe(false);
  });
});
