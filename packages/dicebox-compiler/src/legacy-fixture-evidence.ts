import { z } from "zod";
import { StableDiceBoxIdSchema } from "@dicebox/core";
import { canonicalizeFoundryIr, sha256FoundryIr } from "./foundry-ir.js";
import { foundryArtifactDriftReportSchema } from "./foundry-artifact-spec.js";

const sha256Pattern = /^[0-9a-f]{64}$/i;
const sha256 = z.string().regex(sha256Pattern).transform((value) => value.toLowerCase());
const finite = z.number().finite();
const positiveInteger = z.number().int().positive();

const dimensionsSchema = z.object({
  width: positiveInteger,
  height: positiveInteger,
}).strict();

const rendererSchema = z.object({
  path: z.string().min(1),
  sha256,
  byteLength: positiveInteger,
  dimensions: dimensionsSchema,
  source: z.string().min(1),
}).strict();

const chatSourceSchema = z.object({
  conversationId: z.string().uuid(),
  manifestSha256: sha256,
  sourceReceipt: z.string().min(1),
}).strict();

const runtimeSourceSchema = z.object({
  foundryVersion: z.string().min(1),
  systemId: z.string().min(1),
  systemVersion: z.string().min(1),
  worldId: z.string().min(1),
  sceneId: z.string().min(1),
  sceneUuid: z.string().min(1),
  sceneExportSha256: sha256,
  sceneExportBytes: positiveInteger,
  canvas: dimensionsSchema,
  gridSize: positiveInteger,
  walls: z.number().int().nonnegative(),
  regions: z.number().int().nonnegative(),
  levels: z.number().int().nonnegative(),
  tiles: z.number().int().nonnegative(),
  tokens: z.number().int().nonnegative(),
  lights: z.number().int().nonnegative(),
  anchorBehaviors: z.number().int().nonnegative(),
  behaviorEvent: z.string().min(1).nullable(),
}).strict();

const transformObservedSchema = z.object({
  status: z.literal("observed"),
  image: dimensionsSchema,
  scene: dimensionsSchema,
  gridSize: positiveInteger,
  scale: z.object({ x: finite, y: finite }).strict(),
  offset: z.object({ x: finite, y: finite }).strict(),
  coordinateSpace: z.literal("scene-pixels"),
  source: z.string().min(1),
}).strict();

const unavailableObservationSchema = z.object({
  status: z.enum(["unavailable", "blocked"]),
  source: z.string().min(1),
  reason: z.string().min(1),
}).strict();

export const legacyFixtureTransformSchema = z.discriminatedUnion("status", [
  transformObservedSchema,
  unavailableObservationSchema,
]);

const boundsSchema = z.object({
  label: z.string().min(1),
  coordinateSpace: z.enum(["image-pixels", "scene-pixels", "grid-cells"]),
  x: finite,
  y: finite,
  width: z.number().finite().positive(),
  height: z.number().finite().positive(),
  confidence: z.number().finite().min(0).max(1).nullable(),
  padding: z.number().finite().nonnegative().nullable(),
}).strict();

const observedBoundsSchema = z.object({
  status: z.literal("observed"),
  source: z.string().min(1),
  objects: z.array(boundsSchema).min(1).max(256),
  reviewedBy: z.string().min(1).nullable(),
}).strict();

export const legacyFixtureBoundsObservationSchema = z.discriminatedUnion("status", [
  observedBoundsSchema,
  unavailableObservationSchema,
]);

const observedDigestSchema = z.object({
  status: z.literal("observed"),
  sha256,
  source: z.string().min(1),
}).strict();

export const legacyFixtureDigestObservationSchema = z.discriminatedUnion("status", [
  observedDigestSchema,
  unavailableObservationSchema,
]);

const paritySchema = z.object({
  status: z.enum(["pass", "blocked", "unavailable"]),
  specId: StableDiceBoxIdSchema.nullable(),
  specSha256: sha256.nullable(),
  report: foundryArtifactDriftReportSchema.nullable(),
  source: z.string().min(1),
  blockers: z.array(z.string().min(1)).max(100),
  noWrite: z.literal(true),
  foreignArtifactsPreserved: z.literal(true),
}).strict().superRefine((value, context) => {
  if (value.status === "unavailable" && value.report !== null) {
    context.addIssue({ code: z.ZodIssueCode.custom, path: ["report"], message: "Unavailable parity cannot carry a report." });
  }
  if (value.status !== "unavailable" && value.report === null) {
    context.addIssue({ code: z.ZodIssueCode.custom, path: ["report"], message: "Observed or blocked parity must carry the canonical artifact drift report." });
  }
  if (value.report !== null) {
    if (value.report.status === "pass" && value.status !== "pass") {
      context.addIssue({ code: z.ZodIssueCode.custom, path: ["status"], message: "Parity status must agree with the canonical report." });
    }
    if (value.report.status === "blocked" && value.status !== "blocked") {
      context.addIssue({ code: z.ZodIssueCode.custom, path: ["status"], message: "Parity status must agree with the canonical report." });
    }
    if (value.specId !== value.report.specId || value.specSha256 !== value.report.specSha256) {
      context.addIssue({ code: z.ZodIssueCode.custom, path: ["specId"], message: "Parity specification identity must bind the canonical report." });
    }
  }
});

const authoritativeRegionRereadSchema = z.object({
  status: z.literal("authoritative"),
  source: z.string().min(1),
  foundryApi: z.string().min(1),
  sceneUuid: z.string().min(1),
  regionCount: z.number().int().nonnegative(),
  regionRuntimeIds: z.array(z.string().min(1)).max(200),
  exactTargetMatch: z.literal(true),
  matchesAcceptedBounds: z.literal(true),
  readbackSha256: sha256,
}).strict();

export const legacyFixtureRegionRereadSchema = z.discriminatedUnion("status", [
  authoritativeRegionRereadSchema,
  unavailableObservationSchema,
]);

const baseEvidenceSchema = z.object({
  schemaVersion: z.literal("0.1.0"),
  fixtureId: StableDiceBoxIdSchema,
  fixtureKind: z.literal("iggwilv-final-chamber"),
  evidenceLabel: z.literal("fixture"),
  source: z.object({
    chat: chatSourceSchema,
    runtime: runtimeSourceSchema,
    renderer: rendererSchema,
  }).strict(),
  transform: legacyFixtureTransformSchema,
  proposedBounds: legacyFixtureBoundsObservationSchema,
  acceptedBounds: legacyFixtureBoundsObservationSchema,
  digests: z.object({
    prediction: legacyFixtureDigestObservationSchema,
    blueprint: legacyFixtureDigestObservationSchema,
  }).strict(),
  artifactParity: paritySchema,
  authoritativeRegionReread: legacyFixtureRegionRereadSchema,
  geometryAuthority: z.literal("spatial-blueprint"),
  rendererRole: z.literal("renderer-only"),
  macroRole: z.literal("legacy-transport-only"),
  noWrite: z.literal(true),
  readyClaim: z.literal(false),
}).strict();

const unsignedEvidenceSchema = baseEvidenceSchema.extend({
  blockers: z.array(z.string().min(1)).max(100),
  promotion: z.enum(["eligible", "blocked"]),
});

export const iggwilvLegacyFixtureEvidenceSchema = unsignedEvidenceSchema.extend({
  evidenceSha256: sha256,
}).strict();

export type IggwilvLegacyFixtureEvidence = z.infer<typeof iggwilvLegacyFixtureEvidenceSchema>;

export type IggwilvLegacyFixtureEvidenceInput = z.input<typeof baseEvidenceSchema>;

function unique(values: readonly string[]): string[] {
  return [...new Set(values)];
}

function deriveBlockers(value: z.infer<typeof baseEvidenceSchema>): string[] {
  const blockers: string[] = [];
  if (value.source.renderer.dimensions.width !== value.source.runtime.canvas.width
    || value.source.renderer.dimensions.height !== value.source.runtime.canvas.height) {
    blockers.push("Renderer dimensions do not match the corroborated Scene canvas.");
  }
  if (value.source.runtime.gridSize <= 0) blockers.push("Scene grid size is not positive.");
  if (value.transform.status !== "observed") blockers.push(`Image-to-Scene transform is ${value.transform.status}; exact scale and offset are unavailable.`);
  if (value.proposedBounds.status !== "observed") blockers.push(`Proposed object bounds are ${value.proposedBounds.status}; no bounds may be inferred from pixels or names.`);
  if (value.acceptedBounds.status !== "observed") blockers.push(`Accepted object bounds are ${value.acceptedBounds.status}; no GM-approved geometry is available.`);
  if (value.digests.prediction.status !== "observed") blockers.push(`Prediction digest is ${value.digests.prediction.status}; prediction provenance is incomplete.`);
  if (value.digests.blueprint.status !== "observed") blockers.push(`Spatial Blueprint digest is ${value.digests.blueprint.status}; geometry promotion is unavailable.`);
  if (value.artifactParity.status === "unavailable") {
    blockers.push("Canonical installer/verifier parity is unavailable.");
  } else if (value.artifactParity.status === "blocked") {
    blockers.push("Canonical installer/verifier parity is blocked; promotion cannot proceed.");
    if (value.artifactParity.report) blockers.push(...value.artifactParity.report.blockers);
  }
  if (value.authoritativeRegionReread.status !== "authoritative") {
    blockers.push(`Authoritative Foundry Region reread is ${value.authoritativeRegionReread.status}; supplied summaries are not live reread evidence.`);
  }
  return unique(blockers);
}

export function validateIggwilvLegacyFixtureEvidence(input: unknown): IggwilvLegacyFixtureEvidence {
  return iggwilvLegacyFixtureEvidenceSchema.parse(input);
}

export async function createIggwilvLegacyFixtureEvidence(
  input: IggwilvLegacyFixtureEvidenceInput,
): Promise<IggwilvLegacyFixtureEvidence> {
  const base = baseEvidenceSchema.parse(input);
  const blockers = deriveBlockers(base);
  const unsigned = {
    ...base,
    blockers,
    promotion: blockers.length === 0 ? "eligible" as const : "blocked" as const,
  };
  const evidenceSha256 = await sha256FoundryIr(canonicalizeFoundryIr(unsigned));
  return validateIggwilvLegacyFixtureEvidence({ ...unsigned, evidenceSha256 });
}

export async function verifyIggwilvLegacyFixtureEvidenceHash(input: unknown): Promise<boolean> {
  try {
    const evidence = validateIggwilvLegacyFixtureEvidence(input);
    const { evidenceSha256: _evidenceSha256, ...unsigned } = evidence;
    return (await sha256FoundryIr(canonicalizeFoundryIr(unsigned))) === evidence.evidenceSha256;
  } catch {
    return false;
  }
}

export function serializeIggwilvLegacyFixtureEvidence(input: unknown): string {
  return canonicalizeFoundryIr(validateIggwilvLegacyFixtureEvidence(input));
}
