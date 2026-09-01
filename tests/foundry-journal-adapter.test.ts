import { describe, expect, it } from "vitest";
import {
  createFoundryJournalEntryAdapter,
  createFoundryJournalEntryReadAdapter,
  DICEBOX_JOURNAL_FLAG_SCOPE,
  type FoundryJournalEntryDocument,
} from "@dicebox/bridge";
import { createManagedJournalEntrySpec } from "@dicebox/compiler";
import { createStableDiceBoxId, type RuntimeBinding } from "@dicebox/core";

const semantic = { id: createStableDiceBoxId("journal", "adapter"), kind: "journal" as const };

function createPlan() {
  return createManagedJournalEntrySpec({
    planId: createStableDiceBoxId("plan", "adapter-create"),
    semantic,
    operation: "create",
    title: "Adapter Journal",
    content: "Created through the Foundry factory.",
  });
}

type FakeDocument = Omit<FoundryJournalEntryDocument, "name" | "pages" | "flags" | "update"> & {
  name: string;
  pages: Array<Record<string, unknown>>;
  flags: Record<string, unknown>;
  update(changed: Record<string, unknown>): Promise<FakeDocument>;
};

function documentFor(plan = createPlan()): FakeDocument {
  const document: FakeDocument = {
    id: "journal-adapter-1",
    uuid: "JournalEntry.world.journal-adapter-1",
    documentName: "JournalEntry",
    name: plan.title,
    pages: [{
      id: "page-adapter-1",
      name: plan.title,
      type: "text",
      text: { content: plan.content, format: 1 },
    }],
    flags: {
      [DICEBOX_JOURNAL_FLAG_SCOPE]: {
        schemaVersion: "0.1.0",
        semanticId: plan.semantic.id,
        planId: plan.planId,
      },
    },
    update: async (changed: Record<string, unknown>) => {
    document.name = changed.name as string;
    document.pages = changed.pages as Array<Record<string, unknown>>;
    return document;
    },
  };
  return document;
}

function runtime(document: FakeDocument, includeInCollection = true) {
  let createCalls = 0;
  const adapter = createFoundryJournalEntryAdapter({
    JournalEntry: {
      async create(data) {
        createCalls += 1;
        expect(data.name).toBe("Adapter Journal");
        expect(data.pages[0]?.text.content).toBe("Created through the Foundry factory.");
        expect(data.flags[DICEBOX_JOURNAL_FLAG_SCOPE].semanticId).toBe(semantic.id);
        return document;
      },
    },
    fromUuid: async (uuid) => uuid === document.uuid ? document : null,
    game: {
      journal: {
        contents: includeInCollection ? [document] : [],
        get: (id) => id === document.id ? document : null,
      },
    },
    pageType: "text",
    textFormat: 1,
  });
  return { adapter, getCreateCalls: () => createCalls };
}

describe("versioned Foundry JournalEntry adapter", () => {
  it("provides a read-only adapter that uses fromUuid without accepting write APIs", async () => {
    const plan = createPlan();
    const document = documentFor(plan);
    let fromUuidCalls = 0;
    const adapter = createFoundryJournalEntryReadAdapter({
      fromUuid: async (uuid) => {
        fromUuidCalls += 1;
        return uuid === document.uuid ? document : null;
      },
    });
    const binding: RuntimeBinding = {
      semantic,
      runtime: "foundry",
      documentType: "JournalEntry",
      documentId: "journal-adapter-1",
      uuid: "JournalEntry.world.journal-adapter-1",
      generation: 1,
      embeddedDocumentId: "page-adapter-1",
    };

    const result = await adapter.read(binding);

    expect(adapter.adapterId).toBe("foundry.journal-entry.read@14.367");
    expect(adapter.foundryApi.read).toBe("fromUuid");
    expect(fromUuidCalls).toBe(1);
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.value?.content).toBe(plan.content);
  });

  it("provides the same read-only contract through game.journal.get", async () => {
    const plan = createPlan();
    const document = documentFor(plan);
    let getCalls = 0;
    const adapter = createFoundryJournalEntryReadAdapter({
      game: {
        journal: {
          get: (id) => {
            getCalls += 1;
            return id === document.id ? document : null;
          },
        },
      },
    });
    const binding: RuntimeBinding = {
      semantic,
      runtime: "foundry",
      documentType: "JournalEntry",
      documentId: "journal-adapter-1",
      uuid: "JournalEntry.world.journal-adapter-1",
      generation: 1,
      embeddedDocumentId: "page-adapter-1",
    };

    const result = await adapter.read(binding);

    expect(adapter.foundryApi.read).toBe("game.journal.get");
    expect(getCalls).toBe(1);
    expect(result.ok).toBe(true);
  });

  it("fails closed when no read surface exists and preserves unknown resolution outcomes", async () => {
    const plan = createPlan();
    const document = documentFor(plan);
    const missing = createFoundryJournalEntryReadAdapter({});
    const throwing = createFoundryJournalEntryReadAdapter({
      fromUuid: async () => { throw new Error("read timeout"); },
    });
    const binding: RuntimeBinding = {
      semantic,
      runtime: "foundry",
      documentType: "JournalEntry",
      documentId: "journal-adapter-1",
      uuid: "JournalEntry.world.journal-adapter-1",
      generation: 1,
      embeddedDocumentId: "page-adapter-1",
    };

    const unavailable = await missing.read(binding);
    const unknown = await throwing.read(binding);

    expect(unavailable.ok).toBe(false);
    if (!unavailable.ok) expect(unavailable.error.code).toBe("UNAVAILABLE");
    expect(unknown.ok).toBe(false);
    if (!unknown.ok) {
      expect(unknown.error.code).toBe("UNKNOWN_OUTCOME");
      expect(unknown.error.retry).toBe("after-reread");
    }
  });

  it("reuses the ownership and page-shape guards on read-only foreign state", async () => {
    const plan = createPlan();
    const document = documentFor(plan);
    document.flags[DICEBOX_JOURNAL_FLAG_SCOPE] = {
      schemaVersion: "0.1.0",
      semanticId: createStableDiceBoxId("journal", "foreign-read"),
      planId: plan.planId,
    };
    const adapter = createFoundryJournalEntryReadAdapter({ fromUuid: async () => document });
    const binding: RuntimeBinding = {
      semantic,
      runtime: "foundry",
      documentType: "JournalEntry",
      documentId: "journal-adapter-1",
      uuid: "JournalEntry.world.journal-adapter-1",
      generation: 1,
      embeddedDocumentId: "page-adapter-1",
    };

    const result = await adapter.read(binding);

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe("FORBIDDEN");
  });

  it("calls JournalEntry.create with a marked native parent/page payload and returns page binding", async () => {
    const plan = createPlan();
    const document = documentFor(plan);
    const { adapter, getCreateCalls } = runtime(document, false);
    const result = await adapter.create(plan, createStableDiceBoxId("idempotency", "adapter-create"));

    expect(result.ok).toBe(true);
    expect(getCreateCalls()).toBe(1);
    if (result.ok) {
      expect(result.value.uuid).toBe(document.uuid);
      expect(result.value.embeddedDocumentId).toBe("page-adapter-1");
      expect(adapter.foundryApi.create).toBe("JournalEntry.create");
      expect(adapter.foundryApi.createPage).toBe("entry.createEmbeddedDocuments");
    }
  });

  it("reuses a matching managed document discovered through game.journal.contents", async () => {
    const plan = createPlan();
    const document = documentFor(plan);
    const { adapter, getCreateCalls } = runtime(document);
    const result = await adapter.create(plan, createStableDiceBoxId("idempotency", "adapter-create"));

    expect(result.ok).toBe(true);
    expect(getCreateCalls()).toBe(0);
  });

  it("rejects foreign state during authoritative read-back", async () => {
    const plan = createPlan();
    const document = documentFor(plan);
    document.flags[DICEBOX_JOURNAL_FLAG_SCOPE] = {
      schemaVersion: "0.1.0",
      semanticId: createStableDiceBoxId("journal", "foreign"),
      planId: plan.planId,
    };
    const { adapter } = runtime(document);
    const binding: RuntimeBinding = {
      semantic,
      runtime: "foundry",
      documentType: "JournalEntry",
      documentId: "journal-adapter-1",
      uuid: "JournalEntry.world.journal-adapter-1",
      generation: 1,
      embeddedDocumentId: "page-adapter-1",
    };
    const result = await adapter.read(binding);

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe("FORBIDDEN");
  });

  it("updates only the reviewed managed page through JournalEntry.update and reads it back", async () => {
    const original = createPlan();
    const document = documentFor(original);
    const { adapter } = runtime(document);
    const created = await adapter.create(original, createStableDiceBoxId("idempotency", "adapter-create"));
    expect(created.ok).toBe(true);
    if (!created.ok) return;
    const updatePlan = createManagedJournalEntrySpec({
      planId: createStableDiceBoxId("plan", "adapter-update"),
      semantic,
      operation: "update",
      title: "Updated Adapter Journal",
      content: "Updated through JournalEntry.update.",
      expectedBindingGeneration: 1,
    });
    const updated = await adapter.update(updatePlan, created.value, createStableDiceBoxId("idempotency", "adapter-update"));

    expect(updated.ok).toBe(true);
    expect(document.name).toBe("Updated Adapter Journal");
    expect((document.pages[0]?.text as Record<string, unknown>).content).toBe("Updated through JournalEntry.update.");
    if (updated.ok) expect(updated.value.generation).toBe(2);
  });

  it("preserves unknown outcome when JournalEntry.create cannot return a binding", async () => {
    const plan = createPlan();
    const adapter = createFoundryJournalEntryAdapter({
      JournalEntry: { create: async () => ({ id: "missing-page", uuid: "JournalEntry.world.missing-page" }) },
      pageType: "text",
      textFormat: 1,
    });
    const result = await adapter.create(plan, createStableDiceBoxId("idempotency", "missing-page"));

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe("UNKNOWN_OUTCOME");
  });
});
