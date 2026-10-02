import { z } from "zod";
import { StableDiceBoxIdSchema, createStableDiceBoxId } from "@dicebox/core";
import { createAscendancyMapBlueprints } from "./ascendancy-map-blueprints.js";
import { createAscendancyRegionPlans } from "./ascendancy-region-plan.js";
import { createAscendancyRuneFurnishingPlanFixture, createAscendancySignalFurnishingPlanFixture } from "./ascendancy-furnishing-plan-fixture.js";

const roomKeys = ["signal-frequency-chamber", "rune-mechanism-chamber"] as const;
const runtimeSceneIds = {
  "signal-frequency-chamber": "AneddhKAAfk5HlsA",
  "rune-mechanism-chamber": "p9Mbi0CJWe9KvJhH",
} as const;

const documentTypes = ["Scene", "Level", "Wall", "Region", "Tile", "Token", "AmbientLight", "AmbientSound", "Drawing", "Note"] as const;
const placeableDocumentType = {
  tile: "Tile",
  token: "Token",
  ambientLight: "AmbientLight",
  ambientSound: "AmbientSound",
  drawing: "Drawing",
  note: "Note",
} as const;

const candidateOperationSchema = z.object({
  candidateId: StableDiceBoxIdSchema,
  documentType: z.enum(documentTypes),
  operation: z.enum(["create-candidate", "update-candidate"]),
  parentCandidateId: StableDiceBoxIdSchema.nullable(),
  sourceIds: z.array(StableDiceBoxIdSchema).min(1).max(500),
  count: z.number().int().positive(),
  foundryApi: z.string().min(1),
  previewOnly: z.literal(true),
  approvalRequired: z.literal(true),
  authoritativeRereadRequired: z.literal(true),
  runtimeBinding: z.literal("not-created"),
  payload: z.literal("not-materialized"),
  dispatch: z.literal("disabled"),
}).strict();

const excludedRuntimeSceneSchema = z.object({
  sceneIdRuntime: z.enum(["AneddhKAAfk5HlsA", "p9Mbi0CJWe9KvJhH"]),
  disposition: z.literal("foreign-existing-scene-preserved"),
  adoption: z.literal("excluded"),
}).strict();

const roomSchema = z.object({
  roomId: z.enum(["dbx:room:signal-frequency-chamber", "dbx:room:rune-mechanism-chamber"]),
  sceneStableId: StableDiceBoxIdSchema,
  sceneCandidateId: StableDiceBoxIdSchema,
  blueprintId: StableDiceBoxIdSchema,
  regionPlanId: StableDiceBoxIdSchema,
  furnishingPlanId: StableDiceBoxIdSchema,
  assetId: StableDiceBoxIdSchema,
  geometryOwner: z.literal("spatial-blueprint"),
  existingRuntimeScene: excludedRuntimeSceneSchema,
  operations: z.array(candidateOperationSchema).length(10),
}).strict();

export const ascendancySignalRuneFreshSceneCandidatePreviewSchema = z.object({
  schemaVersion: z.literal("0.1.0"),
  operation: z.literal("dicebox.ascendancy.signal-rune.fresh-scene-candidate.preview"),
  planId: z.literal("dbx:plan:m1141-signal-rune-fresh-scene-candidate-preview"),
  status: z.literal("PREVIEWED"),
  rooms: z.tuple([roomSchema, roomSchema]),
  excludedRooms: z.tuple([z.literal("dbx:room:ascendancy-tram-depot"), z.literal("dbx:room:central-core-control-chamber")]),
  excludedRuntimeScenes: z.tuple([excludedRuntimeSceneSchema, excludedRuntimeSceneSchema]),
  noWrite: z.literal(true),
  apply: z.literal(false),
  approvalRequired: z.literal(true),
  authoritativeRereadRequired: z.literal(true),
  foreignState: z.literal("preserve"),
  runtimeBinding: z.literal("not-created"),
  payload: z.literal("not-materialized"),
  dispatch: z.literal("disabled"),
  mutation: z.literal("disabled-until-exact-runtime-gate"),
  readyClaim: z.literal(false),
}).strict();

export type AscendancySignalRuneFreshSceneCandidatePreview = z.infer<typeof ascendancySignalRuneFreshSceneCandidatePreviewSchema>;

function candidateId(roomKey: string, documentType: string): z.infer<typeof StableDiceBoxIdSchema> {
  return createStableDiceBoxId("candidate", `m1141-${roomKey}-${documentType.toLowerCase()}`);
}

function roomPreview(roomKey: (typeof roomKeys)[number]): z.infer<typeof roomSchema> {
  const sceneStableId = createStableDiceBoxId("scene", roomKey);
  const blueprint = createAscendancyMapBlueprints().find((item) => item.blueprintId === createStableDiceBoxId("blueprint", roomKey));
  const regionPlan = createAscendancyRegionPlans().find((item) => item.sceneId === sceneStableId);
  const furnishingPlan = roomKey === "signal-frequency-chamber"
    ? createAscendancySignalFurnishingPlanFixture()
    : createAscendancyRuneFurnishingPlanFixture();
  if (!blueprint || !regionPlan) throw new Error(`M1141 reviewed source plan is unavailable for ${roomKey}.`);
  const sceneCandidateId = candidateId(roomKey, "Scene");
  const operations = [
    {
      candidateId: sceneCandidateId,
      documentType: "Scene" as const,
      operation: "create-candidate" as const,
      parentCandidateId: null,
      sourceIds: [sceneStableId],
      count: 1,
      foundryApi: "Scene.create(data)",
    },
    {
      candidateId: candidateId(roomKey, "Level"),
      documentType: "Level" as const,
      operation: "update-candidate" as const,
      parentCandidateId: sceneCandidateId,
      sourceIds: blueprint.levels.map((level) => level.levelId),
      count: blueprint.levels.length,
      foundryApi: "scene.initialLevel.update(data)",
    },
    {
      candidateId: candidateId(roomKey, "Wall"),
      documentType: "Wall" as const,
      operation: "create-candidate" as const,
      parentCandidateId: sceneCandidateId,
      sourceIds: blueprint.walls.map((wall) => wall.wallId),
      count: blueprint.walls.length,
      foundryApi: 'scene.createEmbeddedDocuments("Wall", data)',
    },
    {
      candidateId: candidateId(roomKey, "Region"),
      documentType: "Region" as const,
      operation: "create-candidate" as const,
      parentCandidateId: sceneCandidateId,
      sourceIds: regionPlan.regions.map((region) => region.regionId),
      count: regionPlan.regions.length,
      foundryApi: 'scene.createEmbeddedDocuments("Region", data)',
    },
    ...furnishingPlan.items.map((item) => ({
      candidateId: candidateId(roomKey, placeableDocumentType[item.kind]),
      documentType: placeableDocumentType[item.kind],
      operation: "create-candidate" as const,
      parentCandidateId: sceneCandidateId,
      sourceIds: [item.furnishingId],
      count: 1,
      foundryApi: `scene.createEmbeddedDocuments("${placeableDocumentType[item.kind]}", data)`,
    })),
  ].map((operation) => ({
    ...operation,
    previewOnly: true as const,
    approvalRequired: true as const,
    authoritativeRereadRequired: true as const,
    runtimeBinding: "not-created" as const,
    payload: "not-materialized" as const,
    dispatch: "disabled" as const,
  }));
  return roomSchema.parse({
    roomId: createStableDiceBoxId("room", roomKey),
    sceneStableId,
    sceneCandidateId,
    blueprintId: blueprint.blueprintId,
    regionPlanId: regionPlan.planId,
    furnishingPlanId: furnishingPlan.planId,
    assetId: createStableDiceBoxId("asset", `map-${roomKey}`),
    geometryOwner: "spatial-blueprint",
    existingRuntimeScene: { sceneIdRuntime: runtimeSceneIds[roomKey], disposition: "foreign-existing-scene-preserved", adoption: "excluded" },
    operations,
  });
}

/**
 * Builds fresh package-owned candidates without adopting the foreign runtime Scenes.
 * This is a pure description of candidate operations; it never calls Foundry.
 */
export function createAscendancySignalRuneFreshSceneCandidatePreview(): AscendancySignalRuneFreshSceneCandidatePreview {
  const rooms = roomKeys.map(roomPreview) as [z.infer<typeof roomSchema>, z.infer<typeof roomSchema>];
  const excludedRuntimeScenes = rooms.map((room) => room.existingRuntimeScene) as [z.infer<typeof excludedRuntimeSceneSchema>, z.infer<typeof excludedRuntimeSceneSchema>];
  return ascendancySignalRuneFreshSceneCandidatePreviewSchema.parse({
    schemaVersion: "0.1.0",
    operation: "dicebox.ascendancy.signal-rune.fresh-scene-candidate.preview",
    planId: "dbx:plan:m1141-signal-rune-fresh-scene-candidate-preview",
    status: "PREVIEWED",
    rooms,
    excludedRooms: ["dbx:room:ascendancy-tram-depot", "dbx:room:central-core-control-chamber"],
    excludedRuntimeScenes,
    noWrite: true,
    apply: false,
    approvalRequired: true,
    authoritativeRereadRequired: true,
    foreignState: "preserve",
    runtimeBinding: "not-created",
    payload: "not-materialized",
    dispatch: "disabled",
    mutation: "disabled-until-exact-runtime-gate",
    readyClaim: false,
  });
}
