import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";

const packagePath = "packages/dicebox-foundry/ascendancy-campaign-package.json";
const installerPaths = [
  "C:/Users/rujie/Documents/Region Editor/modules/regionwright/scripts/ascendancy-live-installer.js",
  "work/foundry-fixture-data-v4/Data/modules/regionwright/premium/scripts/ascendancy-live-installer.js",
];

describe("Regionwright handoff preview contract", () => {
  it("derives preview metadata from the canonical package in source and staged copies", async () => {
    const packageData = JSON.parse(await readFile(packagePath, "utf8")) as {
      regionPlans: Array<{
        regions: Array<{ interaction?: string; behaviorBinding?: string }>;
        teleports: unknown[];
      }>;
      regionwrightHandoff?: { finalActivation?: { stageId?: string } };
    };
    const regions = packageData.regionPlans.flatMap((plan) => plan.regions);
    const finalStageId = packageData.regionwrightHandoff?.finalActivation?.stageId;
    const summary = {
      popupBehaviorCount: regions.filter((region) => region.interaction === "popup-personal").length,
      cooperativeRegionBindingCount: regions.filter((region) => region.interaction === "physical-cooperative").length,
      finalCoreBindingCount: regions.filter((region) => region.interaction === "final-station" || region.behaviorBinding === finalStageId).length,
      teleportBehaviorCount: packageData.regionPlans.reduce((count, plan) => count + plan.teleports.length, 0),
    };
    expect(summary).toEqual({ popupBehaviorCount: 5, cooperativeRegionBindingCount: 6, finalCoreBindingCount: 7, teleportBehaviorCount: 5 });

    for (const installerPath of installerPaths) {
      const source = await readFile(installerPath, "utf8");
      expect(source).toContain("function handoffSummaryFor(packageData)");
      expect(source).toContain("...summary");
      expect(source).toContain("${result.popupBehaviorCount} popup");
      expect(source).toContain("${result.cooperativeRegionBindingCount} cooperative");
      expect(source).toContain("${result.finalCoreBindingCount} final/core");
      expect(source).toContain("${result.teleportBehaviorCount} teleports");
      expect(source).not.toContain("popupBehaviorCount: 5");
      expect(source).not.toContain("cooperativeRegionBindingCount: 5");
      expect(source).not.toContain("finalCoreBindingCount: 7");
      expect(source).not.toContain("teleportBehaviorCount: 5");
      expect(source).not.toContain("5 popup, 5 cooperative, 7 final/core, and 5 teleports");
    }
  });
});
