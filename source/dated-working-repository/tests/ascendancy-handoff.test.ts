import { describe, expect, it } from "vitest";
import { createAscendancyRegionwrightHandoff, validateAscendancyRegionwrightHandoff } from "@dicebox/core";

describe("Ascendancy Regionwright handoff", () => {
  it("declares the six stable personal puzzle IDs and intended character ownership", () => {
    const handoff = createAscendancyRegionwrightHandoff();
    expect(validateAscendancyRegionwrightHandoff(handoff)).toEqual(handoff);
    expect(handoff.personalPuzzles.map((puzzle) => puzzle.puzzleId)).toEqual([
      "dbx:puzzle:aleister-frequency",
      "dbx:puzzle:sprocket-circuit",
      "dbx:puzzle:dalton-tram-repair",
      "dbx:puzzle:andrew-tram-routing",
      "dbx:puzzle:lawson-rune-memory",
      "dbx:puzzle:tactal-rune-slotting",
    ]);
    expect(handoff.characters).toHaveLength(6);
    expect(handoff.characters.every((character) => character.runtimeUserId === null)).toBe(true);
  });

  it("keeps Regionwright popups, physical Regions, and Andrew's Scene controller separate", () => {
    const handoff = createAscendancyRegionwrightHandoff();
    const andrew = handoff.personalPuzzles.find((puzzle) => puzzle.externalId === "andrew-tram-routing");
    expect(andrew).toMatchObject({ owner: "dicebox-scene", interaction: "foundry-scene-controller", popup: false, regionwrightEntryPoint: null });
    expect(handoff.personalPuzzles.filter((puzzle) => puzzle.owner === "regionwright-popup")).toHaveLength(5);
    expect(handoff.cooperativeStages).toHaveLength(3);
    expect(handoff.cooperativeStages.every((stage) => stage.popup === false && stage.interaction === "physical-scene-region")).toBe(true);
    expect(handoff.contract.daltonRepairOwner).toBe("regionwright-popup");
    expect(handoff.contract.andrewsRushHourOwner).toBe("dicebox-scene-engine");
    expect(handoff.personalPuzzles.find((puzzle) => puzzle.externalId === "dalton-tram-repair")).toMatchObject({
      characterId: "dbx:actor:dalton",
      authorizedControllerCharacterIds: ["dbx:actor:dalton", "dbx:actor:andrew-mcconaughey"],
    });
    expect(andrew?.authorizedControllerCharacterIds).toEqual(["dbx:actor:andrew-mcconaughey"]);
    expect(handoff.contract.macroOwnership).toEqual({ mode: "none-in-current-campaign", macroIds: [], policy: "explicit-player-owner-if-introduced", inheritedPermissionsAccepted: false, foundryField: "ownership.default", readbackRequired: true });
  });

  it("carries the tram Scene geometry and an explicit, runtime-gated API contract", () => {
    const handoff = createAscendancyRegionwrightHandoff();
    const tramRoom = handoff.rooms.find((room) => room.roomId === "dbx:room:ascendancy-tram-depot");
    expect(tramRoom).toMatchObject({ canvas: { width: 1536, height: 1024 }, logicalBoard: { rows: 6, columns: 6, origin: { x: 420, y: 210 }, cellWidth: 110, cellHeight: 95, anchorCount: 36 } });
    expect(handoff.source.apiRoot).toBe('game.modules.get("regionwright")?.api?.premium?.ascendancy');
    expect(handoff.source.files.map((file) => file.path)).toContain("premium/scripts/ascendancy-engine.js");
    expect(handoff.source.files.map((file) => file.path)).toContain("premium/scripts/ascendancy.js");
    expect(handoff.contract.mutation).toBe("disabled-until-exact-runtime-gate");
    expect(handoff.finalActivation.stationCharacterIds).toHaveLength(6);
    expect(handoff.finalActivation.roundSemantics).toMatchObject({ mode: "same-round", roundField: "finalActivation.activationRound", resetOnRoundChange: true, completionRequiresSameRound: true });
    expect(handoff.progressionEdges).toHaveLength(10);
    expect(handoff.progressionEdges.filter((edge) => edge.kind === "pair-complete-to-final").map((edge) => edge.fromId)).toEqual([
      "dbx:pair:aleister-sprocket",
      "dbx:pair:dalton-andrew",
      "dbx:pair:lawson-tactal",
    ]);
    expect(handoff.progressionEdges.some((edge) => edge.fromId === "dbx:puzzle:andrew-tram-routing" && edge.kind === "pair-complete-to-final")).toBe(false);
    expect(handoff.contract.cooperativeStageHookSemantics).toContain("entry notification only");
  });
});
