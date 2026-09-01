import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = resolve(import.meta.dirname, "..");

describe("tooling contract", () => {
  it("keeps the harness lanes explicit and read-only by default", () => {
    const manifest = JSON.parse(readFileSync(resolve(root, "tools/harness-manifest.json"), "utf8"));
    expect(manifest.lanes.map((lane: { id: string }) => lane.id)).toEqual([
      "contract",
      "static-package",
      "utility-e2e",
      "visible-chrome",
      "mcp-loopback",
      "dicebox-foundry-page-main",
      "live-foundry"
    ]);
    expect(manifest.mcpPolicy.readOnlyDefault).toBe(true);
    expect(manifest.mcpPolicy.forbidden).toContain("arbitrary document mutation");
  });

  it("requires receipts and version gates for live lanes", () => {
    const manifest = JSON.parse(readFileSync(resolve(root, "tools/harness-manifest.json"), "utf8"));
    expect(manifest.target).toMatchObject({ foundry: "14.367", system: "dnd5e@5.3.3" });
    expect(manifest.lanes.find((lane: { id: string }) => lane.id === "utility-e2e").artifacts).toContain("redacted JSON receipt");
    expect(manifest.lanes.find((lane: { id: string }) => lane.id === "mcp-loopback").allowedOperations).not.toContain("execute");
    expect(manifest.lanes.find((lane: { id: string }) => lane.id === "mcp-loopback")).toMatchObject({
      stdioAdapter: "createFixedOperationStdioServer",
      receiptSchema: "StdioTransportReceiptSchema",
      receiptCommand: "npm run bridge:stdio:receipt",
      foundryApiBoundary: expect.stringContaining('Hooks.once("ready")'),
      networkEnabledByDefault: false,
      mutationEnabledByDefault: false,
    });
    expect(manifest.lanes.find((lane: { id: string }) => lane.id === "live-foundry")).toMatchObject({
      runtimeEvidenceSchema: "FoundryRuntimeEvidenceSchema",
      runtimeEvidenceAuditCommand: "npm run foundry:evidence-audit",
      fixturePlanSchema: "FoundryFixturePlanSchema",
      fixturePlanCommand: "npm run foundry:fixture-plan",
      fixtureObservationSchema: "FoundryFixtureObservationReceiptSchema",
      fixtureObservationAuditCommand: "npm run foundry:fixture-observation-audit",
      fixtureObservationBundleSchema: "FoundryFixtureObservationBundleAuditSchema",
      fixtureObservationBundleAuditCommand: "npm run foundry:fixture-observation-bundle-audit",
    });
  });

  it("requires the implementation plan to name official Foundry API bindings", () => {
    const matrix = readFileSync(resolve(root, "docs/FOUNDRY-API-BINDING-MATRIX-2026-08-21.md"), "utf8");
    expect(matrix).toContain("Hooks.once(\"ready\"");
    expect(matrix).toContain("JournalEntry.create");
    expect(matrix).toContain('entry.createEmbeddedDocuments("JournalEntryPage"');
    expect(matrix).toContain('flags["dicebox-campaign-helper"]');
    expect(matrix).toContain("JournalEntry.update(changed)");
    expect(matrix).toContain("plan.applyApproved");
    expect(matrix).toContain("snapshot.redacted");
    expect(matrix).toContain("Deterministic redacted fingerprint");
    expect(matrix).toContain("game.settings.register");
    expect(matrix).toContain("game.users.activeGM");
    expect(matrix).toContain("RegionDocument");
  });
});
