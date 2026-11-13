import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";

const packagePath = "packages/dicebox-foundry/ascendancy-campaign-package.json";
const auditPaths = [
  "C:/Users/rujie/Documents/Region Editor/modules/regionwright/scripts/ascendancy-live-installer.js",
  "work/foundry-fixture-data-v4/Data/modules/regionwright/premium/scripts/ascendancy-live-installer.js",
  "work/foundry-fixture-data-v5/Data/modules/regionwright/premium/scripts/ascendancy-live-installer.js",
];

describe("Regionwright handoff audit contract", () => {
  it("derives aggregate helper-region expectations from the canonical package in source and staged copies", async () => {
    const packageData = JSON.parse(await readFile(packagePath, "utf8")) as {
      regionPlans: Array<{ roomId: string; regions: unknown[] }>;
    };
    const roomCounts = packageData.regionPlans.map((plan) => [plan.roomId, plan.regions.length]);
    const total = packageData.regionPlans.reduce((count, plan) => count + plan.regions.length, 0);
    expect(roomCounts).toEqual([
      ["dbx:room:signal-frequency-chamber", 6],
      ["dbx:room:ascendancy-tram-depot", 39],
      ["dbx:room:rune-mechanism-chamber", 6],
      ["dbx:room:central-core-control-chamber", 10],
    ]);
    expect(total).toBe(61);

    const derivedCheck = "const expectedHelperRegionCount = packageData.regionPlans.reduce((count, plan) => count + plan.regions.length, 0);";
    for (const auditPath of auditPaths) {
      const source = await readFile(auditPath, "utf8");
      expect(source).toContain(derivedCheck);
      expect(source).toContain("if (helperRegionCount !== expectedHelperRegionCount)");
      expect(source).not.toContain("if (helperRegionCount !== 60)");
      expect(source).toContain("if (regionwrightBehaviorCount !== 22)");
      expect(source).toContain("if (teleports.length !== 5)");
    }
  });
});
