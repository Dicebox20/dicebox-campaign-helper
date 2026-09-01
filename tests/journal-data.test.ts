import { describe, expect, it } from "vitest";
import {
  foundryJournalEntryCreateDataSchema,
  mapManagedJournalEntryCreateData,
} from "@dicebox/bridge";
import { createManagedJournalEntrySpec } from "@dicebox/compiler";
import { createStableDiceBoxId } from "@dicebox/core";

function createPlan(operation: "create" | "update" = "create") {
  return createManagedJournalEntrySpec({
    planId: createStableDiceBoxId("plan", "foundry-data"),
    semantic: { id: createStableDiceBoxId("journal", "foundry-data"), kind: "journal" },
    operation,
    title: "Native JournalEntry fixture",
    content: "Mapped to a native JournalEntryPage.",
  });
}

describe("Foundry JournalEntry API data mapper", () => {
  it("maps DiceBox intent to the documented parent and embedded page shape", () => {
    const data = mapManagedJournalEntryCreateData({
      plan: createPlan(),
      pageType: "text",
      textFormat: 1,
    });

    expect(foundryJournalEntryCreateDataSchema.parse(data)).toEqual(data);
    expect(data).toEqual({
      name: "Native JournalEntry fixture",
      pages: [{
        name: "Native JournalEntry fixture",
        type: "text",
        text: { content: "Mapped to a native JournalEntryPage.", format: 1 },
      }],
      flags: {
        "dicebox-campaign-helper": {
          schemaVersion: "0.1.0",
          semanticId: "dbx:journal:foundry-data",
          planId: "dbx:plan:foundry-data",
        },
      },
    });
  });

  it("does not guess page type or text format", () => {
    expect(() => mapManagedJournalEntryCreateData({
      plan: createPlan(),
      pageType: "",
      textFormat: 1,
    })).toThrow();
    expect(() => mapManagedJournalEntryCreateData({
      plan: createPlan(),
      pageType: "text",
      textFormat: -1,
    })).toThrow();
  });

  it("does not map updates without a known embedded page binding", () => {
    expect(() => mapManagedJournalEntryCreateData({
      plan: createPlan("update"),
      pageType: "text",
      textFormat: 1,
    })).toThrow(/JournalEntryPage binding/);
  });

  it("rejects arbitrary top-level fields", () => {
    expect(() => foundryJournalEntryCreateDataSchema.parse({
      name: "unsafe",
      pages: [],
      flags: { arbitrary: true },
    })).toThrow();
  });
});
