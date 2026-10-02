import { describe, expect, it } from "vitest";
import {
  createManagedJournalEntrySpec,
  previewManagedJournalEntry,
  validateManagedJournalEntrySpec,
} from "@dicebox/compiler";
import { createStableDiceBoxId, type RuntimeProfile } from "@dicebox/core";

const observedAt = "2026-08-21T01:00:00.000Z";

function runtimeProfile(writeState: "available" | "unavailable" = "available"): RuntimeProfile {
  return {
    phase: "ready",
    foundryVersion: "14.367",
    systemId: "dnd5e",
    systemVersion: "5.3.3",
    observedAt,
    activeModuleIds: ["dicebox-campaign-helper"],
    documentTypes: ["JournalEntry"],
    capabilities: [
      { id: "foundry.document.write", state: writeState, reason: writeState === "available" ? "fixture" : "write gate is closed" },
      { id: "foundry.document.read", state: "available", reason: "fixture" },
      { id: "foundry.users.active-gm", state: "available", reason: "fixture" },
    ],
  };
}

function createSpec(operation: "create" | "update" = "create") {
  return createManagedJournalEntrySpec({
    planId: createStableDiceBoxId("plan", "journal-entrance"),
    semantic: { id: createStableDiceBoxId("journal", "entrance"), kind: "journal" },
    operation,
    title: "Entrance briefing",
    content: "A deterministic fixture entry.",
    expectedBindingGeneration: operation === "create" ? 0 : 1,
  });
}

describe("M3 managed JournalEntry preview", () => {
  it("produces a ready preview only when exact runtime, write capability, and GM authority are present", () => {
    const preview = previewManagedJournalEntry(createSpec(), runtimeProfile(), { authority: "gm", observedAt });

    expect(preview.review.status).toBe("ready");
    expect(preview.review.findings).toEqual([]);
    expect(preview.receipt).toMatchObject({
      operation: "document-plan.preview",
      status: "previewed",
      evidenceClass: "deterministic",
      authority: "gm",
    });
  });

  it("blocks a player or unavailable capability without attempting a write", () => {
    const preview = previewManagedJournalEntry(createSpec(), runtimeProfile("unavailable"), { authority: "none", observedAt });
    const codes = preview.review.findings.map((item) => item.code);

    expect(preview.review.status).toBe("blocked");
    expect(codes).toEqual(expect.arrayContaining([
      "WRITE_CAPABILITY_UNAVAILABLE",
      "GM_AUTHORITY_REQUIRED",
    ]));
    expect(preview.receipt.notes.join(" ")).toContain("no Foundry Document mutation");
  });

  it("requires a known binding generation for update previews", () => {
    const update = { ...createSpec("update"), expectedBindingGeneration: 0 };
    const preview = previewManagedJournalEntry(update, runtimeProfile(), { authority: "gm", observedAt });

    expect(preview.review.status).toBe("blocked");
    expect(preview.review.findings.map((item) => item.code)).toContain("BINDING_REQUIRED");
  });

  it("rejects unsupported raw document fields", () => {
    expect(() => validateManagedJournalEntrySpec({
      ...createSpec(),
      flags: { arbitrary: "runtime patch" },
    })).toThrow();
  });
});
