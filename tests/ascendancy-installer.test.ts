import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
// @ts-expect-error The Foundry browser entry intentionally has no local Foundry type dependency.
import { installAscendancyCampaign } from "../packages/dicebox-foundry/src/ascendancy-installer.js";

const root = resolve(import.meta.dirname, "..");

describe("Ascendancy Foundry installer gate", () => {
  it("does not mutate the authorized 14.365 compatibility lane", async () => {
    let sceneCreateCalls = 0;
    const runtime = {
      game: {
        version: "14.365",
        system: { id: "dnd5e", version: "5.3.3" },
        user: { id: "gm", isGM: true },
        users: { activeGM: { id: "gm" } },
        scenes: { contents: [] },
      },
      Scene: { create: async () => { sceneCreateCalls += 1; } },
    };
    const receipt = await installAscendancyCampaign(runtime);
    expect(receipt.status).toBe("BLOCKED");
    expect(receipt.noWrite).toBe(true);
    expect(sceneCreateCalls).toBe(0);
    expect(receipt.blockers.join(" ")).toContain("14.367");
  });

  it("ships the compiled package beside the installer and keeps four spatial sources", () => {
    const packageData = JSON.parse(readFileSync(resolve(root, "packages/dicebox-foundry/ascendancy-campaign-package.json"), "utf8"));
    expect(packageData.mutation).toBe("disabled-until-exact-runtime-gate");
    expect(packageData.spatialBlueprints).toHaveLength(4);
    expect(packageData.regionPlans).toHaveLength(4);
    expect(packageData.assets.bound).toHaveLength(4);
    expect(packageData.assets.bound[0]).toMatchObject({
      assetId: "dbx:asset:map-ascendancy-tram-depot",
      status: "final-map-required",
      path: null,
    });
    expect(packageData.regionPlans.find((plan: { roomId: string }) => plan.roomId === "dbx:room:ascendancy-tram-depot").regions).toHaveLength(39);
  });

  it("uses nested Foundry flags and contains a provenance-bound recovery path", () => {
    const source = readFileSync(resolve(root, "packages/dicebox-foundry/src/ascendancy-installer.js"), "utf8");
    expect(source).toContain("flags: {");
    expect(source).toContain("findRecoverableScene");
    expect(source).toContain("Multiple recoverable DiceBox scenes matched");
    expect(source).toContain("sceneRecovered");
    expect(source).toContain("const WALL_NORMAL = 20;");
    expect(source).toContain("modules/${MODULE_ID}/assets/maps/${filename}");
    expect(source).toContain("Foundry 14 stores a Scene renderer on its initial embedded Level.");
    expect(source).toContain("scene?.initialLevel");
    expect(source).toContain("Scene.initialLevel renderer is unavailable or ambiguous");
    expect(source).toContain("Read every target before any owned Wall replacement.");
    expect(source).toContain("await ensureRenderer(reread, expectedBackground, room.roomId);");
    expect(source).toContain("rendererSource(reread) !== expectedBackground");
    expect(source).toContain("Compiled campaign package has no reviewed renderer for every Scene; installation is blocked before any Foundry write.");
    expect(source).toContain("repairAscendancyCampaignRenderersAndGeometry");
    expect(source).toContain('runtime.Hooks.on("getSceneControlButtons"');
    expect(source).toContain('globalThis.Hooks.once("init", () => registerControl(globalThis));');
    expect(source).not.toContain('globalThis.Hooks.once("ready", () => {\n    expose(globalThis);\n    registerControl(globalThis);');
    expect(source).toContain("const tools = controls?.tokens?.tools;");
    expect(source).toContain('tools["dicebox-ascendancy-repair"]');
    expect(source).toContain("Only existing DiceBox-owned Scene backgrounds and boundary Wall documents were reconciled");
    expect(source).toContain('evidenceClass: "full_function"');
    expect(source).not.toContain('evidenceClass: "target-bound"');
    expect(source).not.toContain("move: 1");
  });
});
