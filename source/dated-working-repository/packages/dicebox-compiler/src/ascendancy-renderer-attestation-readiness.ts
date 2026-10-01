import { z } from "zod";
import { StableDiceBoxIdSchema, createStableDiceBoxId } from "@dicebox/core";
import {
  createAscendancyRendererAssetBindingMatrix,
  type AscendancyRendererAssetBindingMatrix,
} from "./ascendancy-renderer-asset-binding-matrix.js";

const documentedHashPattern = /^[A-F0-9]{64}$/;

const readinessRowSchema = z.object({
  sceneId: StableDiceBoxIdSchema,
  blueprintId: StableDiceBoxIdSchema,
  assetId: StableDiceBoxIdSchema,
  roomId: StableDiceBoxIdSchema,
  rendererStatus: z.enum(["scene-bound", "final-map-required"]),
  path: z.string().min(1).nullable(),
  documentedSha256: z.string().regex(documentedHashPattern).nullable(),
  evidenceClass: z.enum(["documented-only", "final-map-required"]),
  nextGate: z.enum(["manifest-and-byte-attestation-required", "blocked-by-final-map"]),
  approvedManifest: z.enum(["required", "not-eligible-until-final-map"]),
  expectedByteLength: z.enum(["required-from-approved-manifest", "unavailable-until-final-map"]),
  observedSha256: z.null(),
  attestationStatus: z.literal("not-observed"),
  dependentDocumentEligibility: z.literal("blocked"),
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
  if (value.rendererStatus === "scene-bound"
    && (value.path === null || value.documentedSha256 === null
      || value.evidenceClass !== "documented-only"
      || value.nextGate !== "manifest-and-byte-attestation-required"
      || value.approvedManifest !== "required"
      || value.expectedByteLength !== "required-from-approved-manifest")) {
    context.addIssue({ code: z.ZodIssueCode.custom, path: ["evidenceClass"], message: "Scene-bound rows require documented-only evidence and the typed manifest-and-byte-attestation gate." });
  }
  if (value.rendererStatus === "final-map-required"
    && (value.path !== null || value.documentedSha256 !== null
      || value.evidenceClass !== "final-map-required"
      || value.nextGate !== "blocked-by-final-map"
      || value.approvedManifest !== "not-eligible-until-final-map"
      || value.expectedByteLength !== "unavailable-until-final-map")) {
    context.addIssue({ code: z.ZodIssueCode.custom, path: ["evidenceClass"], message: "Final-map-required rows cannot claim renderer or attestation readiness." });
  }
});

const readinessAuthoritySchema = z.object({
  renderer: z.literal("scene-background"),
  geometry: z.literal("spatial-blueprint"),
  assetAttestation: z.literal("not-observed"),
  dependentDocuments: z.literal("blocked"),
  nativeMapping: z.literal("not-proven"),
  runtime: z.literal("not-modeled"),
}).strict();

export const ascendancyRendererAttestationReadinessEnvelopeSchema = z.object({
  schemaVersion: z.literal("0.1.0"),
  envelopeId: StableDiceBoxIdSchema,
  sourceMatrixId: StableDiceBoxIdSchema,
  evidenceClass: z.literal("local"),
  scenes: z.array(readinessRowSchema).length(4),
  authority: readinessAuthoritySchema,
  mutation: z.literal("disabled-until-exact-runtime-gate"),
}).strict().superRefine((value, context) => {
  const seen = new Set<string>();
  value.scenes.forEach((row, index) => {
    if (!seen.add(row.sceneId)) {
      context.addIssue({ code: z.ZodIssueCode.custom, path: ["scenes", index, "sceneId"], message: "Scene IDs must be unique." });
    }
  });
});

export type AscendancyRendererAttestationReadinessEnvelope = z.infer<typeof ascendancyRendererAttestationReadinessEnvelopeSchema>;

function expectedRows(matrix: AscendancyRendererAssetBindingMatrix): AscendancyRendererAttestationReadinessEnvelope["scenes"] {
  return matrix.scenes.map((scene) => scene.status === "scene-bound"
    ? {
      sceneId: scene.sceneId,
      blueprintId: scene.blueprintId,
      assetId: scene.assetId,
      roomId: scene.roomId,
      rendererStatus: scene.status,
      path: scene.path,
      documentedSha256: scene.documentedSha256,
      evidenceClass: "documented-only" as const,
      nextGate: "manifest-and-byte-attestation-required" as const,
      approvedManifest: "required" as const,
      expectedByteLength: "required-from-approved-manifest" as const,
      observedSha256: null,
      attestationStatus: "not-observed" as const,
      dependentDocumentEligibility: "blocked" as const,
      geometryOwner: scene.geometryOwner,
      nativeMapping: scene.nativeMapping,
      runtimeState: scene.runtimeState,
    }
    : {
      sceneId: scene.sceneId,
      blueprintId: scene.blueprintId,
      assetId: scene.assetId,
      roomId: scene.roomId,
      rendererStatus: scene.status,
      path: scene.path,
      documentedSha256: scene.documentedSha256,
      evidenceClass: "final-map-required" as const,
      nextGate: "blocked-by-final-map" as const,
      approvedManifest: "not-eligible-until-final-map" as const,
      expectedByteLength: "unavailable-until-final-map" as const,
      observedSha256: null,
      attestationStatus: "not-observed" as const,
      dependentDocumentEligibility: "blocked" as const,
      geometryOwner: scene.geometryOwner,
      nativeMapping: scene.nativeMapping,
      runtimeState: scene.runtimeState,
    });
}

function expectedEnvelopeScenes(input: AscendancyRendererAttestationReadinessEnvelope["scenes"]): void {
  const matrix = createAscendancyRendererAssetBindingMatrix();
  if (JSON.stringify(input) !== JSON.stringify(expectedRows(matrix))) {
    throw new Error("M1084 renderer attestation-readiness envelope drifted from the current renderer matrix.");
  }
}

/** Classify renderer evidence and attestation prerequisites without fetching bytes or authorizing dependent documents. */
export function createAscendancyRendererAttestationReadinessEnvelope(): AscendancyRendererAttestationReadinessEnvelope {
  const matrix = createAscendancyRendererAssetBindingMatrix();
  return validateAscendancyRendererAttestationReadinessEnvelope({
    schemaVersion: "0.1.0",
    envelopeId: createStableDiceBoxId("envelope", "m1084-renderer-attestation-readiness"),
    sourceMatrixId: matrix.matrixId,
    evidenceClass: "local",
    scenes: expectedRows(matrix),
    authority: {
      renderer: "scene-background",
      geometry: "spatial-blueprint",
      assetAttestation: "not-observed",
      dependentDocuments: "blocked",
      nativeMapping: "not-proven",
      runtime: "not-modeled",
    },
    mutation: "disabled-until-exact-runtime-gate",
  });
}

export function validateAscendancyRendererAttestationReadinessEnvelope(input: unknown): AscendancyRendererAttestationReadinessEnvelope {
  const envelope = ascendancyRendererAttestationReadinessEnvelopeSchema.parse(input);
  expectedEnvelopeScenes(envelope.scenes);
  return envelope;
}
