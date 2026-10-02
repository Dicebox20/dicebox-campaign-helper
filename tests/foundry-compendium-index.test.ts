import { describe, expect, it } from "vitest";
import {
  createFoundryCompendiumIndexReadAdapter,
  type FoundryCompendiumIndexEntry,
} from "@dicebox/bridge";

const packId = "dnd5e.content.spells";
const entryId = "spell-target-1";
const uuid = `Compendium.${packId}.Item.${entryId}`;
const entry: FoundryCompendiumIndexEntry = {
  _id: entryId,
  uuid,
  name: "Target Spell",
  type: "Item",
};

function indexFor(value: FoundryCompendiumIndexEntry | null = entry) {
  return {
    get: (id: string) => id === entryId ? value : null,
    getName: (name: string) => name === "Target Spell" ? value : null,
  };
}

describe("read-only Foundry compendium index adapter", () => {
  it("looks up an exact entry ID through game.packs.get and pack.index.get", async () => {
    let packCalls = 0;
    let indexCalls = 0;
    const adapter = createFoundryCompendiumIndexReadAdapter({
      game: {
        packs: {
          get: (id) => {
            packCalls += 1;
            return id === packId ? {
              index: {
                get: (entryKey) => {
                  indexCalls += 1;
                  return indexFor().get(entryKey);
                },
              },
            } : null;
          },
        },
      },
    });

    const result = await adapter.lookup({ packId, documentType: "Item", entryId });

    expect(adapter.adapterId).toBe("foundry.compendium.index.read@14.367");
    expect(adapter.foundryApi.pack).toBe("game.packs.get");
    expect(packCalls).toBe(1);
    expect(indexCalls).toBe(1);
    expect(result).toEqual({
      ok: true,
      value: {
        packId,
        entryId,
        uuid,
        documentType: "Item",
        displayName: "Target Spell",
      },
    });
  });

  it("allows an exact reviewed name only through pack.index.getName", async () => {
    let nameCalls = 0;
    const adapter = createFoundryCompendiumIndexReadAdapter({
      game: { packs: { get: () => ({
        index: {
          get: () => null,
          getName: (name) => {
            nameCalls += 1;
            return name === "Target Spell" ? entry : null;
          },
        },
      }) } },
    });

    const result = await adapter.lookup({ packId, documentType: "Item", exactName: "Target Spell" });

    expect(nameCalls).toBe(1);
    expect(result.ok).toBe(true);
  });

  it("loads a missing index through the official pack.getIndex read surface", async () => {
    let getIndexCalls = 0;
    const adapter = createFoundryCompendiumIndexReadAdapter({
      game: { packs: { get: () => ({
        getIndex: async () => {
          getIndexCalls += 1;
          return indexFor();
        },
      }) } },
    });

    const result = await adapter.lookup({ packId, documentType: "Item", entryId });

    expect(getIndexCalls).toBe(1);
    expect(result.ok).toBe(true);
  });

  it("preserves missing packs and entries as null", async () => {
    const missingPack = createFoundryCompendiumIndexReadAdapter({
      game: { packs: { get: () => null } },
    });
    const missingEntry = createFoundryCompendiumIndexReadAdapter({
      game: { packs: { get: () => ({ index: indexFor(null) }) } },
    });

    expect(await missingPack.lookup({ packId, documentType: "Item", entryId }))
      .toEqual({ ok: true, value: null });
    expect(await missingEntry.lookup({ packId, documentType: "Item", entryId }))
      .toEqual({ ok: true, value: null });
  });

  it("rejects malformed or mismatched index identity as unknown", async () => {
    const malformed = createFoundryCompendiumIndexReadAdapter({
      game: { packs: { get: () => ({ index: indexFor({ ...entry, uuid: "Compendium.other.Item.bad" }) }) } },
    });
    const wrongType = createFoundryCompendiumIndexReadAdapter({
      game: { packs: { get: () => ({ index: indexFor({ ...entry, type: "Actor" }) }) } },
    });

    for (const result of [
      await malformed.lookup({ packId, documentType: "Item", entryId }),
      await wrongType.lookup({ packId, documentType: "Item", entryId }),
    ]) {
      expect(result.ok).toBe(false);
      if (!result.ok) expect(["UNKNOWN_OUTCOME", "FORBIDDEN"]).toContain(result.error.code);
    }
  });

  it("fails closed for unavailable surfaces, invalid selectors, and lookup failures", async () => {
    const unavailable = createFoundryCompendiumIndexReadAdapter({});
    const invalid = createFoundryCompendiumIndexReadAdapter({ game: { packs: { get: () => ({ index: indexFor() }) } } });
    const throwing = createFoundryCompendiumIndexReadAdapter({
      game: { packs: { get: () => { throw new Error("pack read timeout"); } } },
    });

    const unavailableResult = await unavailable.lookup({ packId, documentType: "Item", entryId });
    const invalidResult = await invalid.lookup({ packId, documentType: "Item" });
    const throwingResult = await throwing.lookup({ packId, documentType: "Item", entryId });

    expect(unavailableResult.ok).toBe(false);
    if (!unavailableResult.ok) expect(unavailableResult.error.code).toBe("UNAVAILABLE");
    expect(invalidResult.ok).toBe(false);
    if (!invalidResult.ok) expect(invalidResult.error.code).toBe("INVALID_INPUT");
    expect(throwingResult.ok).toBe(false);
    if (!throwingResult.ok) {
      expect(throwingResult.error.code).toBe("UNKNOWN_OUTCOME");
      expect(throwingResult.error.retry).toBe("after-reread");
    }
  });
});
