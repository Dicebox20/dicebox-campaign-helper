import { describe, expect, it } from "vitest";
import type { JournalEntryAdapter } from "@dicebox/bridge";
import { createStableDiceBoxId, type Result, type RuntimeBinding } from "@dicebox/core";
import { createManagedJournalEntrySpec } from "@dicebox/compiler";

describe("M3 JournalEntry adapter port", () => {
  it("keeps the future adapter narrow and idempotency-bound", () => {
    const adapter: JournalEntryAdapter = {
      adapterId: "foundry.journal-entry@0.1.0",
      runtime: "foundry",
      foundryApi: {
        read: "fromUuid",
        create: "JournalEntry.create",
        createPage: "entry.createEmbeddedDocuments",
        update: "JournalEntry.update",
      },
      async read() {
        return { ok: true, value: null };
      },
      async create(_plan, _idempotencyKey): Promise<Result<RuntimeBinding>> {
        return {
          ok: true,
          value: {
            semantic: { id: createStableDiceBoxId("journal", "port"), kind: "journal" },
            runtime: "foundry",
            documentType: "JournalEntry",
            documentId: "fixture",
            uuid: "JournalEntry.world.fixture",
            generation: 1,
          },
        };
      },
      async update(_plan, binding) {
        return { ok: true, value: binding };
      },
    };
    const plan = createManagedJournalEntrySpec({
      planId: createStableDiceBoxId("plan", "port"),
      semantic: { id: createStableDiceBoxId("journal", "port"), kind: "journal" },
      operation: "create",
      title: "Port fixture",
      content: "No arbitrary patch fields.",
    });

    expect(adapter.adapterId).toBe("foundry.journal-entry@0.1.0");
    expect(adapter.foundryApi.create).toBe("JournalEntry.create");
    expect(adapter.foundryApi.createPage).toBe("entry.createEmbeddedDocuments");
    expect(plan.documentType).toBe("JournalEntry");
    expect("patch" in adapter).toBe(false);
  });
});
