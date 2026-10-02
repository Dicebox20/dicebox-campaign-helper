import { describe, expect, it } from "vitest";
import {
  createSpatialProjectionPlan,
  previewSpatialProjectionPlan,
  validateSpatialProjectionPlan,
} from "@dicebox/compiler";
import { createStableDiceBoxId, type RuntimeProfile } from "@dicebox/core";
import { createSpatialBlueprint } from "@dicebox/compiler";

const observedAt = "2026-08-21T01:00:00.000Z";
const levelId = createStableDiceBoxId("level", "ground");
const regionId = createStableDiceBoxId("region", "entry");

function blueprint() {
  return createSpatialBlueprint({
    blueprintId: createStableDiceBoxId("blueprint", "room-plan"),
    name: "Entry Room",
    origin: { x: 100, y: 200 },
    bounds: { width: 20, height: 12 },
    grid: { size: 100, unitsPerCell: 5 },
    scale: { pixelsPerUnit: 20, unit: "feet" },
    levels: [{ levelId, label: "Ground", elevation: 0 }],
    walls: [{
      wallId: createStableDiceBoxId("wall", "north-plan"),
      levelId,
      a: { x: 0, y: 0 },
      b: { x: 20, y: 0 },
      thickness: 0.2,
    }],
    regions: [{
      regionId,
      label: "Entry",
      shapes: [{
        shapeId: createStableDiceBoxId("shape", "entry-plan"),
        kind: "rectangle",
        levelId,
        x: 2,
        y: 2,
        width: 4,
        height: 3,
      }],
    }],
    anchors: [{
      anchorId: createStableDiceBoxId("anchor", "door-plan"),
      kind: "door",
      levelId,
      position: { x: 2, y: 0 },
      clearance: 1,
      targetRegionId: regionId,
    }],
  });
}

function runtimeProfile(overrides: Partial<RuntimeProfile> = {}): RuntimeProfile {
  return {
    phase: "ready",
    foundryVersion: "14.367",
    systemId: "dnd5e",
    systemVersion: "5.3.3",
    observedAt,
    activeModuleIds: ["dicebox-campaign-helper"],
    documentTypes: ["Scene", "Region"],
    capabilities: [
      { id: "foundry.scene.read", state: "available", reason: "fixture" },
      { id: "foundry.scene.write", state: "available", reason: "fixture" },
      { id: "foundry.region.read", state: "available", reason: "fixture" },
      { id: "foundry.region.write", state: "available", reason: "fixture" },
      { id: "foundry.users.active-gm", state: "available", reason: "fixture" },
    ],
    ...overrides,
  };
}

describe("Spatial Projection Plan", () => {
  it("creates a strict deterministic Scene → Wall → Region plan", () => {
    const plan = createSpatialProjectionPlan({
      planId: createStableDiceBoxId("plan", "spatial-entry"),
      scene: { id: createStableDiceBoxId("scene", "entry-room"), kind: "scene" },
      blueprint: blueprint(),
    });

    expect(plan.operation).toBe("create");
    expect(plan.mutation).toBe("disabled-until-exact-runtime-gate");
    expect(plan.foundryApi).toMatchObject({
      sceneCreate: "Scene.create",
      wallCreate: 'scene.createEmbeddedDocuments("Wall", ...)',
      regionCreate: 'scene.createEmbeddedDocuments("Region", ...)',
      regionDocument: "RegionDocument",
    });
    expect(plan.steps.map((step) => [step.order, step.kind, step.sourceCount])).toEqual([
      [1, "scene", 1],
      [2, "walls", 1],
      [3, "regions", 1],
    ]);
    expect(plan.anchorIntents[0]).toMatchObject({ kind: "door", x: 2, y: 0 });
    expect(validateSpatialProjectionPlan(plan)).toEqual(plan);
  });

  it("produces a ready preview only with exact target capabilities and GM authority", () => {
    const plan = createSpatialProjectionPlan({
      planId: createStableDiceBoxId("plan", "spatial-preview"),
      scene: { id: createStableDiceBoxId("scene", "preview-room"), kind: "scene" },
      blueprint: blueprint(),
    });
    const preview = previewSpatialProjectionPlan(plan, runtimeProfile(), { authority: "gm", observedAt });

    expect(preview.review.status).toBe("ready");
    expect(preview.review.findings).toEqual([]);
    expect(preview.receipt).toMatchObject({
      operation: "spatial-plan.preview",
      status: "previewed",
      evidenceClass: "deterministic",
      authority: "gm",
    });
    expect(preview.receipt.notes.join(" ")).toContain("no Scene.create");
  });

  it("blocks mutation preview when the exact Scene/Region gates or GM authority are absent", () => {
    const plan = createSpatialProjectionPlan({
      planId: createStableDiceBoxId("plan", "spatial-blocked"),
      scene: { id: createStableDiceBoxId("scene", "blocked-room"), kind: "scene" },
      blueprint: blueprint(),
    });
    const blocked = previewSpatialProjectionPlan(plan, runtimeProfile({
      capabilities: [
        { id: "foundry.scene.read", state: "available", reason: "read only" },
        { id: "foundry.scene.write", state: "unavailable", reason: "Scene write is not installed" },
        { id: "foundry.region.read", state: "unknown", reason: "Region shape probe pending" },
        { id: "foundry.region.write", state: "unavailable", reason: "Region write is gated" },
        { id: "foundry.users.active-gm", state: "available", reason: "fixture" },
      ],
    }), { authority: "none", observedAt });

    expect(blocked.review.status).toBe("blocked");
    expect(blocked.review.findings.map((finding) => finding.code)).toEqual(expect.arrayContaining([
      "FOUNDRY_SCENE_WRITE_UNAVAILABLE",
      "FOUNDRY_REGION_READ_UNAVAILABLE",
      "FOUNDRY_REGION_WRITE_UNAVAILABLE",
      "GM_AUTHORITY_REQUIRED",
    ]));
  });

  it("rejects a foreign semantic target and tampered operation order or raw payload", () => {
    const plan = createSpatialProjectionPlan({
      planId: createStableDiceBoxId("plan", "spatial-strict"),
      scene: { id: createStableDiceBoxId("scene", "strict-room"), kind: "scene" },
      blueprint: blueprint(),
    });

    expect(() => createSpatialProjectionPlan({
      planId: plan.planId,
      scene: { id: createStableDiceBoxId("journal", "not-a-scene"), kind: "journal" },
      blueprint: plan.blueprint,
    })).toThrow(/Scene semantic/);
    expect(() => validateSpatialProjectionPlan({
      ...plan,
      steps: [plan.steps[1], plan.steps[0], plan.steps[2]],
    })).toThrow(/deterministic Scene/);
    expect(() => validateSpatialProjectionPlan({ ...plan, foundryPayload: { eval: "new Function" } })).toThrow();
  });
});
