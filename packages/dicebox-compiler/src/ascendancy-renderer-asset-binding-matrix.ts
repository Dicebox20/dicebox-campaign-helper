import { z } from "zod";
import { StableDiceBoxIdSchema, createStableDiceBoxId } from "@dicebox/core";
import { createCurrentCampaignPackage } from "./campaign-package.js";
import { createAscendancyMapBlueprints } from "./ascendancy-map-blueprints.js";

const rendererHashPattern = /^[A-F0-9]{64}$/;

const rendererBindingRowSchema = z.object({
  sceneId: StableDiceBoxIdSchema,
  blueprintId: StableDiceBoxIdSchema,
  assetId: StableDiceBoxIdSchema,
  roomId: StableDiceBoxIdSchema,
  status: z.enum(["scene-bound", "final-map-required"]),
  path: z.string().min(1).nullable(),
  documentedSha256: z.string().regex(rendererHashPattern).nullable(),
  hashEvidence: z.enum(["documented-source-hash", "not-available"]),
  observedSha256: z.null(),
  attestationStatus: z.literal("not-observed"),
  renderer: z.literal("scene-background"),
  geometryOwner: z.literal("spatial-blueprint"),
  nativeMapping: z.literal("not-proven"),
  runtimeState: z.literal("not-modeled"),
}).strict().superRefine((value, context) => {
  const sceneSuffix = value.sceneId.split(":").at(-1);
  const blueprintSuffix = value.blueprintId.split(":").at(-1);
  const roomSuffix = value.roomId.split(":").at(-1);
  if (!sceneSuffix || sceneSuffix !== blueprintSuffix || sceneSuffix !== roomSuffix) {
    context.addIssue({ code: z.ZodIssueCode.custom, path: ["blueprintId"], message: "Scene, Blueprint, and room IDs must share one local key." });
  }
  if (value.status === "scene-bound"
    && (value.path === null || value.documentedSha256 === null || value.hashEvidence !== "documented-source-hash")) {
    context.addIssue({ code: z.ZodIssueCode.custom, path: ["status"], message: "Scene-bound renderers require a source path and documented hash evidence." });
  }
  if (value.status === "final-map-required"
    && (value.path !== null || value.documentedSha256 !== null || value.hashEvidence !== "not-available")) {
    context.addIssue({ code: z.ZodIssueCode.custom, path: ["status"], message: "Final-map-required renderers cannot claim a path or documented hash." });
  }
});

const rendererBindingAuthoritySchema = z.object({
  renderer: z.literal("scene-background"),
  geometry: z.literal("spatial-blueprint"),
  assetAttestation: z.literal("not-observed"),
  nativeMapping: z.literal("not-proven"),
  runtime: z.literal("not-modeled"),
}).strict();

export const ascendancyRendererAssetBindingMatrixSchema = z.object({
  schemaVersion: z.literal("0.1.0"),
  matrixId: StableDiceBoxIdSchema,
  evidenceClass: z.literal("local"),
  scenes: z.array(rendererBindingRowSchema).length(4),
  authority: rendererBindingAuthoritySchema,
  mutation: z.literal("disabled-until-exact-runtime-gate"),
}).strict().superRefine((value, context) => {
  const sceneIds = new Set<string>();
  const blueprintIds = new Set<string>();
  const assetIds = new Set<string>();
  const roomIds = new Set<string>();
  value.scenes.forEach((row, index) => {
    if (!sceneIds.add(row.sceneId)) context.addIssue({ code: z.ZodIssueCode.custom, path: ["scenes", index, "sceneId"], message: "Scene IDs must be unique." });
    if (!blueprintIds.add(row.blueprintId)) context.addIssue({ code: z.ZodIssueCode.custom, path: ["scenes", index, "blueprintId"], message: "Blueprint IDs must be unique." });
    if (!assetIds.add(row.assetId)) context.addIssue({ code: z.ZodIssueCode.custom, path: ["scenes", index, "assetId"], message: "Asset IDs must be unique." });
    if (!roomIds.add(row.roomId)) context.addIssue({ code: z.ZodIssueCode.custom, path: ["scenes", index, "roomId"], message: "Room IDs must be unique." });
  });
});

export type AscendancyRendererAssetBindingMatrix = z.infer<typeof ascendancyRendererAssetBindingMatrixSchema>;

const documentedRendererHashes: Readonly<Record<string, string | null>> = {
  "signal-frequency-chamber": "DB9307932865B0D3A23C5A8AA61082D520206443318658DE7E03C773A1A9972E",
  "ascendancy-tram-depot": "591DB926FF0A733282CC047BCF5094B9057449D00D168EF751C0991107F1B988",
  "rune-mechanism-chamber": "F45922E219A12FBA6B79A26AD0D6B5EBBAF51ADD86C025E9B676DA24707D507B",
  "central-core-control-chamber": "8BA721E5B8499323BDCC868284DBF20C53A2BA07EC919F1BF9E923D89238EF11",
};

function expectedRows(): AscendancyRendererAssetBindingMatrix["scenes"] {
  const campaignPackage = createCurrentCampaignPackage();
  const blueprints = createAscendancyMapBlueprints();
  return blueprints.map((blueprint) => {
    const suffix = blueprint.blueprintId.split(":").at(-1);
    if (!suffix) throw new Error("M1082 Blueprint stable ID is missing its local key.");
    const sceneId = createStableDiceBoxId("scene", suffix);
    const roomId = createStableDiceBoxId("room", suffix);
    const asset = campaignPackage.assets.bound.find((candidate) => candidate.roomId === roomId);
    if (!asset) throw new Error(`M1082 renderer asset is missing for ${roomId}.`);
    const assetId = StableDiceBoxIdSchema.parse(asset.assetId);
    const documentedSha256 = documentedRendererHashes[suffix];
    if (documentedSha256 === undefined) throw new Error(`M1082 renderer hash source is missing for ${suffix}.`);
    return {
      sceneId,
      blueprintId: blueprint.blueprintId,
      assetId,
      roomId,
      status: asset.status,
      path: asset.path,
      documentedSha256,
      hashEvidence: documentedSha256 ? "documented-source-hash" as const : "not-available" as const,
      observedSha256: null,
      attestationStatus: "not-observed" as const,
      renderer: asset.renderer,
      geometryOwner: asset.geometryOwner,
      nativeMapping: "not-proven" as const,
      runtimeState: "not-modeled" as const,
    };
  });
}

function expectedMatrixScenes(input: AscendancyRendererAssetBindingMatrix["scenes"]): void {
  if (JSON.stringify(input) !== JSON.stringify(expectedRows())) {
    throw new Error("M1082 renderer/asset-binding matrix drifted from the campaign package and playable Scene sources.");
  }
}

/** Report renderer binding status without fetching bytes or changing package data. */
export function createAscendancyRendererAssetBindingMatrix(): AscendancyRendererAssetBindingMatrix {
  return validateAscendancyRendererAssetBindingMatrix({
    schemaVersion: "0.1.0",
    matrixId: createStableDiceBoxId("matrix", "m1082-renderer-asset-binding-status"),
    evidenceClass: "local",
    scenes: expectedRows(),
    authority: {
      renderer: "scene-background",
      geometry: "spatial-blueprint",
      assetAttestation: "not-observed",
      nativeMapping: "not-proven",
      runtime: "not-modeled",
    },
    mutation: "disabled-until-exact-runtime-gate",
  });
}

export function validateAscendancyRendererAssetBindingMatrix(input: unknown): AscendancyRendererAssetBindingMatrix {
  const matrix = ascendancyRendererAssetBindingMatrixSchema.parse(input);
  expectedMatrixScenes(matrix.scenes);
  return matrix;
}
