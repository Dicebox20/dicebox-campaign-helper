import { describe, expect, it } from "vitest";
import {
  createFoundryReferenceReadAdapter,
  type FoundryReferenceDocument,
} from "@dicebox/bridge";
import { createStableDiceBoxId, type RuntimeBinding } from "@dicebox/core";

const semantic = {
  id: createStableDiceBoxId("journal", "link-target"),
  kind: "journal" as const,
};

const binding: RuntimeBinding = {
  semantic,
  runtime: "foundry",
  documentType: "JournalEntry",
  documentId: "link-target-1",
  uuid: "JournalEntry.world.link-target-1",
  generation: 1,
};

function documentFor(overrides: Partial<FoundryReferenceDocument> = {}): FoundryReferenceDocument {
  return {
    id: binding.documentId,
    uuid: binding.uuid,
    documentName: "JournalEntry",
    name: "Exact target",
    ...overrides,
  };
}

describe("read-only Foundry exact reference resolver", () => {
  it("resolves an exact binding through the official fromUuid surface", async () => {
    let calls = 0;
    const adapter = createFoundryReferenceReadAdapter({
      fromUuid: async (uuid) => {
        calls += 1;
        return uuid === binding.uuid ? documentFor() : null;
      },
    });

    const result = await adapter.resolve(binding);

    expect(adapter.adapterId).toBe("foundry.reference.read@14.367");
    expect(adapter.foundryApi.read).toBe("fromUuid");
    expect(calls).toBe(1);
    expect(result).toEqual({
      ok: true,
      value: {
        binding,
        documentType: "JournalEntry",
        documentId: binding.documentId,
        uuid: binding.uuid,
        displayName: "Exact target",
      },
    });
  });

  it("uses game.journal.get only as the exact JournalEntry fallback", async () => {
    let calls = 0;
    const adapter = createFoundryReferenceReadAdapter({
      game: {
        journal: {
          get: (id) => {
            calls += 1;
            return id === binding.documentId ? documentFor() : null;
          },
        },
      },
    });

    const result = await adapter.resolve(binding);

    expect(adapter.foundryApi.read).toBe("game.journal.get");
    expect(calls).toBe(1);
    expect(result.ok).toBe(true);
  });

  it("returns null for a missing target without inventing a replacement", async () => {
    const adapter = createFoundryReferenceReadAdapter({ fromUuid: async () => null });

    const result = await adapter.resolve(binding);

    expect(result).toEqual({ ok: true, value: null });
  });

  it("rejects an observed document of the wrong Foundry type", async () => {
    const adapter = createFoundryReferenceReadAdapter({
      fromUuid: async () => documentFor({ documentName: "Actor" }),
    });

    const result = await adapter.resolve(binding);

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe("FORBIDDEN");
  });

  it("preserves unknown identity mismatches and malformed documents", async () => {
    const mismatch = createFoundryReferenceReadAdapter({
      fromUuid: async () => documentFor({ uuid: "JournalEntry.world.other" }),
    });
    const malformed = createFoundryReferenceReadAdapter({
      fromUuid: async () => ({
        id: binding.documentId,
        uuid: binding.uuid,
        name: "Missing type",
      }),
    });

    const mismatchResult = await mismatch.resolve(binding);
    const malformedResult = await malformed.resolve(binding);

    for (const result of [mismatchResult, malformedResult]) {
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error.code).toBe("UNKNOWN_OUTCOME");
        expect(result.error.retry).toBe("after-reread");
      }
    }
  });

  it("fails closed when no exact Foundry read surface is available", async () => {
    const adapter = createFoundryReferenceReadAdapter({});

    const result = await adapter.resolve(binding);

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe("UNAVAILABLE");
  });

  it("converts resolver exceptions to unknown outcome instead of retrying blindly", async () => {
    const adapter = createFoundryReferenceReadAdapter({
      fromUuid: async () => {
        throw new Error("resolution timeout");
      },
    });

    const result = await adapter.resolve(binding);

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe("UNKNOWN_OUTCOME");
      expect(result.error.retry).toBe("after-reread");
    }
  });
});
