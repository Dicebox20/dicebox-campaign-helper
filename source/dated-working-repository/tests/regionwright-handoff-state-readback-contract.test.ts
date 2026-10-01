import { readFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import { describe, expect, it } from "vitest";

const packagePath = "packages/dicebox-foundry/ascendancy-campaign-package.json";
const installerPaths = [
  "C:/Users/rujie/Documents/Region Editor/premium/scripts/ascendancy-live-installer.js",
  "work/foundry-fixture-data-v4/Data/modules/regionwright/premium/scripts/ascendancy-live-installer.js",
];
const modulePaths = [
  "C:/Users/rujie/Documents/Region Editor/scripts/module.js",
  "work/foundry-fixture-data-v4/Data/modules/regionwright/scripts/module.js",
];

function marker(owner: string, packageId: string, kind: string, semanticId: string) {
  return { owner, packageId, kind, semanticId };
}

function buildRuntime(packageData: any) {
  const scenes: any[] = [];
  const byUuid = new Map<string, any>();
  const byRegionId = new Map<string, any>();
  const packageId = packageData.packageId;
  for (const [sceneIndex, plan] of packageData.regionPlans.entries()) {
    const scene = {
      uuid: `Scene.fixture-${sceneIndex}`,
      flags: { "dicebox-campaign-helper": { managed: marker("dicebox-campaign-helper", packageId, "scene", plan.roomId) } },
      regions: [] as any[],
    };
    for (const regionPlan of plan.regions) {
      const behaviors: any[] = [];
      const configured = regionPlan.interaction === "popup-personal"
        || regionPlan.interaction === "physical-cooperative"
        || regionPlan.interaction === "final-station"
        || regionPlan.behaviorBinding === "dbx:stage:six-person-simultaneous-activation";
      if (configured) {
        behaviors.push({
          type: "executeScript",
          disabled: false,
          flags: { regionwright: { ascendancy: { handoffKey: `region:${regionPlan.regionId}`, semanticId: regionPlan.behaviorBinding, kind: "fixture" } } },
        });
      }
      const region = {
        uuid: `Region.fixture-${regionPlan.regionId}`,
        flags: { "dicebox-campaign-helper": { managed: marker("dicebox-campaign-helper", packageId, "region", regionPlan.regionId) } },
        behaviors,
        getEmbeddedCollection: (name: string) => name === "RegionBehavior" ? behaviors : [],
        update: () => { throw new Error("mutation API invoked"); },
        updateEmbeddedDocuments: () => { throw new Error("mutation API invoked"); },
        createEmbeddedDocuments: () => { throw new Error("mutation API invoked"); },
      };
      scene.regions.push(region);
      byRegionId.set(regionPlan.regionId, region);
      byUuid.set(region.uuid, region);
    }
    scenes.push(scene);
    byUuid.set(scene.uuid, scene);
  }
  for (const plan of packageData.regionPlans) {
    for (const teleport of plan.teleports) {
      const source = byRegionId.get(teleport.fromRegionId);
      const destination = byRegionId.get(teleport.toRegionId);
      source.behaviors.push({
        type: "teleportToken",
        disabled: false,
        system: { destinations: [destination.uuid] },
        flags: { regionwright: { ascendancy: { handoffKey: `teleport:${teleport.teleportId}`, semanticId: teleport.teleportId, kind: "native-teleport" } } },
      });
    }
  }
  const runtime: any = {
    game: {
      world: { id: "dbx-test-world" },
      version: "14.367",
      system: { id: "dnd5e", version: "5.3.3" },
      user: { id: "gm", isGM: true },
      users: { activeGM: { id: "gm" } },
      scenes: { contents: scenes },
      macros: { contents: [] },
    },
    fromUuid: async (uuid: string) => byUuid.get(uuid) ?? null,
    fetch: async () => { throw new Error("fetch should not be used when the package is supplied"); },
  };
  return { runtime, scenes, byRegionId };
}

async function loadPackage() {
  return JSON.parse(await readFile(packagePath, "utf8"));
}

async function loadInstaller() {
  return import(pathToFileURL("C:/Users/rujie/Documents/Region Editor/premium/scripts/ascendancy-live-installer.js").href);
}

describe("Regionwright handoff current-state readback contract", () => {
  it("keeps the installer copies and new control block aligned without overwriting unrelated module differences", async () => {
    const [installerSource, installerStaged, moduleSource, moduleStaged] = await Promise.all([installerPaths[0]!, installerPaths[1]!, modulePaths[0]!, modulePaths[1]!].map(path => readFile(path, "utf8"))) as [string, string, string, string];
    expect(installerSource).toBe(installerStaged);
    const controlPattern = /  const ascendancyReadbackToolName[\s\S]*?onChange: \(\) => api\.premium\?\.ascendancy\?\.handoff\?\.openReadback\?\.\(\)\n    \};\n  \}/;
    expect(moduleSource.match(controlPattern)?.[0]).toBe(moduleStaged.match(controlPattern)?.[0]);
    expect(installerSource).toContain("export async function readAscendancyRegionwrightHandoffState");
    expect(installerSource).toContain("provenance: \"current-state-derived\"");
    const start = installerSource.indexOf("export async function readAscendancyRegionwrightHandoffState");
    const end = installerSource.indexOf("export async function openAscendancyHandoffStateReadback", start);
    const readbackSource = installerSource.slice(start, end);
    expect(readbackSource).not.toContain("inspectAscendancyRegionwrightHandoff");
    expect(readbackSource).not.toContain("updateEmbeddedDocuments");
    expect(readbackSource).not.toContain("createEmbeddedDocuments");
    expect(readbackSource).not.toContain("sessionStorage");
  });

  it("reads the canonical 61/22/5 fixture through Foundry APIs while mutation APIs are unavailable", async () => {
    const packageData = await loadPackage();
    const { runtime } = buildRuntime(packageData);
    const installer = await loadInstaller();
    const result = await installer.readAscendancyRegionwrightHandoffState({ runtime, campaignPackage: packageData });
    expect(result).toMatchObject({
      operation: "ascendancy.regionwright.state-readback",
      status: "PASS",
      provenance: "current-state-derived",
      historicalInstallerReceipt: "not-observable",
      noWrite: true,
      apply: false,
      authoritativeReread: true,
      noWritesPerformed: true,
      readyClaim: false,
      expected: { helperRegionCount: 61, regionwrightBehaviorCount: 22, teleportBindingCount: 5 },
      observed: { helperRegionCount: 61, regionwrightBehaviorCount: 22, teleportBindingCount: 5, playerFacingMacroCount: 0 },
    });
    const serialized = JSON.stringify(result);
    expect(serialized).not.toContain('"flags"');
    expect(serialized).not.toContain('"system"');
    expect(serialized).not.toContain('"uuid"');
    expect(serialized).not.toContain("Region.fixture-");
    expect(serialized).not.toContain("await game.modules");
  });

  it("fails closed for missing, duplicate, foreign, malformed, and failed-reread state without retry", async () => {
    const packageData = await loadPackage();
    const installer = await loadInstaller();

    const missing = buildRuntime(packageData);
    missing.scenes[0].regions.pop();
    const missingResult = await installer.readAscendancyRegionwrightHandoffState({ runtime: missing.runtime, campaignPackage: packageData });
    expect(missingResult).toMatchObject({ status: "BLOCKED", noWrite: true, readyClaim: false });

    const duplicate = buildRuntime(packageData);
    const duplicateRegion = [...duplicate.byRegionId.values()].find(region => region.behaviors.length > 0);
    duplicateRegion.behaviors.push({ ...duplicateRegion.behaviors[0] });
    const duplicateResult = await installer.readAscendancyRegionwrightHandoffState({ runtime: duplicate.runtime, campaignPackage: packageData });
    expect(duplicateResult).toMatchObject({ status: "BLOCKED", noWrite: true });
    expect(duplicateResult.readbackErrors.some((error: any) => error.issue === "duplicate-handoff-key")).toBe(true);

    const foreign = buildRuntime(packageData);
    const foreignRegion = [...foreign.byRegionId.values()].find(region => region.behaviors.length > 0);
    foreignRegion.behaviors.push({ type: "executeScript", disabled: false, flags: { regionwright: { ascendancy: { handoffKey: "foreign:behavior", semanticId: "foreign", kind: "foreign" } } } });
    const foreignResult = await installer.readAscendancyRegionwrightHandoffState({ runtime: foreign.runtime, campaignPackage: packageData });
    expect(foreignResult).toMatchObject({ status: "BLOCKED", noWrite: true });
    expect(foreignResult.readbackErrors.some((error: any) => error.issue === "unexpected-behavior-key")).toBe(true);

    const malformed = buildRuntime(packageData);
    const malformedRegion = [...malformed.byRegionId.values()].find(region => region.behaviors.length > 0);
    delete malformedRegion.behaviors[0].flags.regionwright.ascendancy.semanticId;
    const malformedResult = await installer.readAscendancyRegionwrightHandoffState({ runtime: malformed.runtime, campaignPackage: packageData });
    expect(malformedResult).toMatchObject({ status: "BLOCKED", noWrite: true });
    expect(malformedResult.readbackErrors.some((error: any) => error.issue === "malformed-regionwright-behavior")).toBe(true);

    const failedReread = buildRuntime(packageData);
    let rereadCalls = 0;
    failedReread.runtime.fromUuid = async () => { rereadCalls += 1; throw new Error("readback unavailable"); };
    const failedResult = await installer.readAscendancyRegionwrightHandoffState({ runtime: failedReread.runtime, campaignPackage: packageData });
    expect(failedResult).toMatchObject({ status: "BLOCKED", authoritativeReread: false, noWrite: true });
    expect(rereadCalls).toBe(4);
  });
});
