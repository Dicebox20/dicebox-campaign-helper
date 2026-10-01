import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";

describe("fixture Tram calibration status macro", () => {
  it("is a fixed read-only GM transport to the dedicated adapter", async () => {
    const source = await readFile("packages/dicebox-foundry/macros/fixture-tram-calibration-status.js", "utf8");
    expect(source).toContain("game?.diceboxTramCalibration?.status?.()");
    expect(source).toContain("Fixture Tram calibration status");
    expect(source).toContain("JSON.stringify(receipt)");
    expect(source).not.toMatch(/\beval\b|new Function|WebSocket|create\(|update\(|delete\(/);
  });

  it("keeps fixture apply behind a fresh preview token and explicit DialogV2 confirmation", async () => {
    const source = await readFile("packages/dicebox-foundry/macros/fixture-tram-calibration-apply.js", "utf8");
    expect(source).toContain("adapter?.preview?.()");
    expect(source).toContain("DialogV2?.confirm");
    expect(source).toContain("planToken: preview.planToken");
    expect(source).toContain('approved: true');
    expect(source).not.toMatch(/\beval\b|new Function|WebSocket|create\(|update\(|delete\(/);
  });

  it("keeps Tram routing inspection fixture-only, elected-GM gated, and read-only", async () => {
    const source = await readFile("packages/dicebox-foundry/macros/fixture-tram-routing-preview.js", "utf8");
    expect(source).toContain('expectedWorldId = "dbx-test-world"');
    expect(source).toContain("activeGM?.id !== game.user?.id");
    expect(source).toContain("diceboxTramRoutingFixture?.previewInstall?.()");
    expect(source).toContain("JSON.stringify(preview)");
    expect(source).not.toMatch(/\beval\b|new Function|WebSocket|create\(|update\(|delete\(/);
  });

  it("keeps Tram routing apply behind a fresh preview token and DialogV2 confirmation", async () => {
    const source = await readFile("packages/dicebox-foundry/macros/fixture-tram-routing-apply.js", "utf8");
    expect(source).toContain('expectedWorldId = "dbx-test-world"');
    expect(source).toContain("adapter?.previewInstall?.()");
    expect(source).toContain("DialogV2?.confirm");
    expect(source).toContain("planToken: preview.planToken");
    expect(source).toContain("applyInstall({ approved: true");
    expect(source).not.toMatch(/\beval\b|new Function|WebSocket|create\(|update\(|delete\(/);
  });
});
