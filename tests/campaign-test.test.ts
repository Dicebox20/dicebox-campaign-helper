import { describe, expect, it } from "vitest";
import { createCurrentCampaignTest, currentCampaignTestSchema, validateCurrentCampaignTest } from "@dicebox/core";

describe("current Ballad of Chauser Bill campaign test fixture", () => {
  it("captures the confirmed three teams, nine stages, four rooms, and finale", () => {
    const scenario = createCurrentCampaignTest();
    expect(currentCampaignTestSchema.parse(scenario)).toEqual(scenario);
    expect(scenario.teams.map((team) => team.label)).toEqual([
      "Aleister + Sprocket",
      "Dalton + Andrew",
      "Lawson + Tactal",
    ]);
    expect(scenario.rooms.map((room) => room.label)).toEqual([
      "Signal / Frequency Chamber",
      "Ascendancy Tram Depot",
      "Rune Mechanism Chamber",
      "Central Core Control Chamber",
    ]);
    expect(scenario.stages).toHaveLength(9);
    expect(scenario.stages.filter((stage) => stage.kind === "cooperative" || stage.kind === "scene")).toHaveLength(4);
    expect(scenario.stages.every((stage) => stage.finalSpec.status === "final-chat-spec")).toBe(true);
    expect(scenario.stages.find((stage) => stage.label === "Circuit Routing")?.finalSpec.requirements.join(" ")).toContain("Validation traverses");
    expect(scenario.stages.find((stage) => stage.label === "Tram Routing Controller")?.finalSpec.requirements.join(" ")).toContain("six-move");
    expect(scenario.stages.find((stage) => stage.label === "Tram Routing Controller")?.kind).toBe("scene");
    expect(scenario.stages.find((stage) => stage.label === "Tram Repair")?.owner).toBe("regionwright-minigame");
    expect(scenario.stages.find((stage) => stage.label === "Rune Memory")?.finalSpec.requirements.join(" ")).toContain("Twenty cards");
    expect(scenario.finale.activationCount).toBe(6);
  });

  it("keeps map art subordinate to Spatial Blueprint and keeps mutation disabled", () => {
    const scenario = createCurrentCampaignTest();
    expect(scenario.rooms.every((room) => room.geometryOwner === "spatial-blueprint" && room.renderer === "scene-background" && room.gridlessRenderer)).toBe(true);
    expect(scenario.mutation).toBe("disabled-until-exact-runtime-gate");
    expect(scenario.finale.mutation).toBe("disabled-until-exact-runtime-gate");
    expect(scenario.rooms.flatMap((room) => room.foundryApis).join(" | ")).toContain("scene.getEmbeddedCollection(\"Region\")");
  });

  it("records the chat provenance and explicitly excludes later setup/video material", () => {
    const scenario = createCurrentCampaignTest();
    expect(scenario.source.chatUrl).toBe("https://chatgpt.com/c/6a2dbc07-5518-83e8-ae7a-7ac6065acefe");
    expect(scenario.source.sourceFilter).toBe("original-campaign-design-after-prime-arachnid-defeat");
    expect(scenario.source.excludedMaterial.join(" | ")).toContain("later Regionwright");
    expect(scenario.source.excludedMaterial.join(" | ")).toContain("cinematic/video");
    expect(validateCurrentCampaignTest(scenario).scenarioId).toBe(scenario.scenarioId);
  });
});
