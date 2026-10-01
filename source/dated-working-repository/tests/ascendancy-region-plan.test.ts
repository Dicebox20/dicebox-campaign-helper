import { describe, expect, it } from "vitest";
import { createAscendancyRegionPlans, validateAscendancyRegionPlan } from "@dicebox/compiler";

describe("Ascendancy orthogonal Region coordinate plans", () => {
  it("declares four 1536x1024 Scene plans with stable Regions and teleports", () => {
    const plans = createAscendancyRegionPlans();
    expect(plans).toHaveLength(4);
    for (const plan of plans) {
      expect(validateAscendancyRegionPlan(plan)).toEqual(plan);
      expect(plan.canvas).toEqual({ width: 1536, height: 1024 });
      expect(plan.geometryOwner).toBe("spatial-blueprint");
      expect(plan.coordinateSource).toBe("campaign-helper-orthogonal-coordinate-plan");
      expect(plan.macroPolicy).toEqual({ mode: "none-in-current-campaign", playerFacingMacroIds: [], explicitPlayerOwnershipRequiredIfAdded: true, inheritedPermissionsAccepted: false, readbackRequired: true });
      expect(plan.teleports.every((teleport) => teleport.activeGMRequired)).toBe(true);
      expect(plan.regions.every((region) => region.shape === "rectangle")).toBe(true);
      expect(plan.regions.every((region) => region.macroBinding === null)).toBe(true);
    }
  });

  it("keeps cooperative/final/Scene Regions out of popup ownership and binds the tram anchors", () => {
    const plans = createAscendancyRegionPlans();
    const popupRegions = plans.flatMap((plan) => plan.regions.filter((region) => region.popup));
    const nonPopup = plans.flatMap((plan) => plan.regions.filter((region) => region.interaction !== "popup-personal"));
    const tram = plans.find((plan) => plan.roomId === "dbx:room:ascendancy-tram-depot");
    expect(popupRegions.every((region) => region.owner === "regionwright-popup" && region.interaction === "popup-personal")).toBe(true);
    expect(nonPopup.every((region) => region.popup === false)).toBe(true);
    expect(tram?.regions.filter((region) => region.interaction === "tram-anchor")).toHaveLength(36);
    expect(tram?.regions.find((region) => region.behaviorBinding === "dbx:puzzle:dalton-tram-repair")).toMatchObject({ interaction: "popup-personal", owner: "regionwright-popup", popup: true, bounds: { x: 1120, y: 120, width: 300, height: 220 } });
    expect(tram?.regions.find((region) => region.behaviorBinding === "dbx:cooperative:dalton-andrew-tram-troubleshooting")).toMatchObject({ interaction: "physical-cooperative", owner: "dicebox-foundry-region", popup: false, bounds: { x: 1120, y: 640, width: 300, height: 220 } });
    expect(tram?.regions.find((region) => region.regionId === "dbx:region:tram-exit")).toMatchObject({
      label: "Tram rail to Core controls", bounds: { x: 1080, y: 400, width: 390, height: 95 }, behaviorBinding: "dbx:tram:core-rail-access",
    });
  });

  it("centers every Core final-station Region on its corresponding visible console", () => {
    const core = createAscendancyRegionPlans().find((plan) => plan.roomId === "dbx:room:central-core-control-chamber")!;
    const stations = core.regions.filter((region) => region.interaction === "final-station");
    expect(stations.map((region) => ({ x: region.bounds.x + region.bounds.width / 2, y: region.bounds.y + region.bounds.height / 2 }))).toEqual([
      { x: 384, y: 365 }, { x: 768, y: 365 }, { x: 1152, y: 365 },
      { x: 384, y: 670 }, { x: 768, y: 670 }, { x: 1152, y: 670 },
    ]);
  });

  it("routes the Tram east exit to the aligned Core west entry rather than the north entry", () => {
    const plans = createAscendancyRegionPlans();
    const tram = plans.find((plan) => plan.roomId === "dbx:room:ascendancy-tram-depot")!;
    const core = plans.find((plan) => plan.roomId === "dbx:room:central-core-control-chamber")!;

    expect(tram.teleports).toContainEqual(expect.objectContaining({ teleportId: "dbx:teleport:tram-to-core", fromRegionId: "dbx:region:tram-exit", toRegionId: "dbx:region:core-entry-west" }));
    expect(core.regions.find((region) => region.regionId === "dbx:region:core-entry-west")).toMatchObject({
      bounds: { x: 24, y: 400, width: 176, height: 95 }, behaviorBinding: "dbx:tram:core-rail-access",
    });
  });
});
