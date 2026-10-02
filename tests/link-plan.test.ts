import { describe, expect, it } from "vitest";
import {
  createExactDocumentLinkPlan,
  validateExactDocumentLinkPlan,
} from "@dicebox/compiler";
import { createStableDiceBoxId, type RuntimeBinding } from "@dicebox/core";

const source = {
  id: createStableDiceBoxId("journal", "link-source"),
  kind: "journal" as const,
};
const target = {
  id: createStableDiceBoxId("journal", "link-target"),
  kind: "journal" as const,
};
const binding: RuntimeBinding = {
  semantic: target,
  runtime: "foundry",
  documentType: "JournalEntry",
  documentId: "link-target-1",
  uuid: "JournalEntry.world.link-target-1",
  generation: 1,
};

describe("exact document link plan", () => {
  it("binds a reviewed semantic target to its exact Foundry UUID", () => {
    const plan = createExactDocumentLinkPlan({
      linkId: createStableDiceBoxId("link", "source-to-target"),
      source,
      target,
      targetBinding: binding,
      label: "Open target",
    });

    expect(plan.schemaVersion).toBe("0.1.0");
    expect(plan.targetBinding.uuid).toBe("JournalEntry.world.link-target-1");
    expect(validateExactDocumentLinkPlan(plan)).toEqual(plan);
  });

  it("rejects a runtime binding that belongs to another semantic target", () => {
    expect(() => createExactDocumentLinkPlan({
      linkId: createStableDiceBoxId("link", "mismatched"),
      source,
      target,
      targetBinding: {
        ...binding,
        semantic: {
          id: createStableDiceBoxId("journal", "foreign-target"),
          kind: "journal",
        },
      },
      label: "Unsafe target",
    })).toThrow(/semantic target/);
  });

  it("does not accept an empty label or unvalidated arbitrary link fields", () => {
    expect(() => createExactDocumentLinkPlan({
      linkId: createStableDiceBoxId("link", "empty-label"),
      source,
      target,
      targetBinding: binding,
      label: "",
    })).toThrow();

    expect(() => validateExactDocumentLinkPlan({
      schemaVersion: "0.1.0",
      linkId: createStableDiceBoxId("link", "extra"),
      source,
      target,
      targetBinding: binding,
      label: "Target",
      execute: "new Function('return true')",
    })).toThrow();
  });
});
