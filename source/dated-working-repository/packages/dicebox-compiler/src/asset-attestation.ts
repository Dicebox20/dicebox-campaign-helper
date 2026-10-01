import { z } from "zod";
import {
  StableDiceBoxIdSchema,
  type StableDiceBoxId,
} from "@dicebox/core";
import {
  approvedAssetManifestSchema,
  approvedAssetSchema,
  type ApprovedAsset,
  type ApprovedAssetManifest,
} from "./media-registry.js";
import { canonicalizeFoundryIr } from "./foundry-ir.js";

const sha256Pattern = /^[0-9a-f]{64}$/;
const attestationSources = ["provided-bytes", "read-only-fetch", "none"] as const;
const attestationStatuses = ["attested", "mismatch", "missing", "unavailable"] as const;

export const assetByteAttestationSchema = z.object({
  schemaVersion: z.literal("0.1.0"),
  assetId: StableDiceBoxIdSchema,
  expectedSha256: z.string().regex(sha256Pattern),
  observedSha256: z.string().regex(sha256Pattern).nullable(),
  expectedByteLength: z.number().int().positive(),
  observedByteLength: z.number().int().nonnegative().nullable(),
  source: z.enum(attestationSources),
  status: z.enum(attestationStatuses),
  attestedAt: z.string().datetime({ offset: true }),
  noWrite: z.literal(true),
  notes: z.array(z.string().min(1)).max(12),
}).strict();

export type AssetByteAttestation = z.infer<typeof assetByteAttestationSchema>;

export const assetAttestationGateSchema = z.object({
  schemaVersion: z.literal("0.1.0"),
  manifestId: StableDiceBoxIdSchema,
  requiredAssetIds: z.array(StableDiceBoxIdSchema).max(2000),
  dependentDocumentIds: z.array(StableDiceBoxIdSchema).max(500),
  attestations: z.array(assetByteAttestationSchema).max(2000),
  status: z.enum(["ready", "blocked"]),
  noWrite: z.literal(true),
}).strict();

export type AssetAttestationGate = z.infer<typeof assetAttestationGateSchema>;

export type AssetBytes = Uint8Array | ArrayBuffer;

export type ReadOnlyAssetFetcher = (locator: string, assetId: StableDiceBoxId) => Promise<AssetBytes>;

function compareIds(left: string, right: string): number {
  return left < right ? -1 : left > right ? 1 : 0;
}

function sortedUniqueIds(values: readonly string[], label: string): StableDiceBoxId[] {
  const parsed = values.map((value) => StableDiceBoxIdSchema.parse(value));
  if (new Set(parsed).size !== parsed.length) throw new Error(`${label} must contain unique stable IDs.`);
  return parsed.sort(compareIds);
}

function assertSortedIds(values: readonly string[], label: string): void {
  if (!values.every((value, index) => index === 0 || compareIds(values[index - 1]!, value) <= 0)) {
    throw new Error(`${label} must be sorted by stable ID.`);
  }
  if (new Set(values).size !== values.length) throw new Error(`${label} must contain unique stable IDs.`);
}

function bytesToUint8Array(bytes: AssetBytes): Uint8Array {
  return bytes instanceof Uint8Array ? new Uint8Array(bytes) : new Uint8Array(bytes);
}

async function sha256Bytes(bytes: Uint8Array): Promise<string> {
  const digest = await globalThis.crypto.subtle.digest("SHA-256", bytes as unknown as BufferSource);
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

function assetForId(manifest: ApprovedAssetManifest, assetId: StableDiceBoxId): ApprovedAsset {
  const asset = manifest.assets.find((candidate) => candidate.assetId === assetId);
  if (!asset) throw new Error(`Required asset ${assetId} is not present in manifest ${manifest.manifestId}.`);
  return asset;
}

function statusForObservation(expectedSha256: string, expectedByteLength: number, observedSha256: string, observedByteLength: number): AssetByteAttestation["status"] {
  return expectedSha256 === observedSha256 && expectedByteLength === observedByteLength ? "attested" : "mismatch";
}

export async function attestApprovedAssetBytes(
  assetInput: unknown,
  bytes: AssetBytes,
  options: { readonly observedAt: string; readonly source?: "provided-bytes" },
): Promise<AssetByteAttestation> {
  const asset = approvedAssetSchema.parse(assetInput);
  const observedBytes = bytesToUint8Array(bytes);
  const observedSha256 = await sha256Bytes(observedBytes);
  const status = statusForObservation(asset.sha256, asset.byteLength, observedSha256, observedBytes.byteLength);
  return assetByteAttestationSchema.parse({
    schemaVersion: "0.1.0",
    assetId: asset.assetId,
    expectedSha256: asset.sha256,
    observedSha256,
    expectedByteLength: asset.byteLength,
    observedByteLength: observedBytes.byteLength,
    source: options.source ?? "provided-bytes",
    status,
    attestedAt: options.observedAt,
    noWrite: true,
    notes: status === "attested"
      ? ["Supplied bytes match the approved SHA-256 digest and byte length; no upload or dependent-document creation was attempted."]
      : ["Supplied bytes do not match the approved SHA-256 digest and/or byte length; dependent-document creation remains blocked."],
  });
}

export async function attestApprovedAssetFromReadOnlyFetch(
  assetInput: unknown,
  fetcher: ReadOnlyAssetFetcher,
  options: { readonly observedAt: string },
): Promise<AssetByteAttestation> {
  const asset = approvedAssetSchema.parse(assetInput);
  try {
    const bytes = await fetcher(asset.locator, asset.assetId);
    const attestation = await attestApprovedAssetBytes(asset, bytes, {
      observedAt: options.observedAt,
      source: "provided-bytes",
    });
    return assetByteAttestationSchema.parse({ ...attestation, source: "read-only-fetch" });
  } catch {
    return assetByteAttestationSchema.parse({
      schemaVersion: "0.1.0",
      assetId: asset.assetId,
      expectedSha256: asset.sha256,
      observedSha256: null,
      expectedByteLength: asset.byteLength,
      observedByteLength: null,
      source: "read-only-fetch",
      status: "unavailable",
      attestedAt: options.observedAt,
      noWrite: true,
      notes: ["The read-only asset fetch failed or returned an unusable byte source; dependent-document creation remains blocked."],
    });
  }
}

function assertAttestationMatchesAsset(attestation: AssetByteAttestation, asset: ApprovedAsset): void {
  if (attestation.expectedSha256 !== asset.sha256 || attestation.expectedByteLength !== asset.byteLength) {
    throw new Error(`Asset attestation for ${asset.assetId} does not match the current approved manifest.`);
  }
  if (attestation.status === "attested"
    && (attestation.observedSha256 !== asset.sha256 || attestation.observedByteLength !== asset.byteLength)) {
    throw new Error(`Asset attestation for ${asset.assetId} is marked attested without exact digest and byte-length agreement.`);
  }
  if (attestation.status === "mismatch" && attestation.observedSha256 === null && attestation.observedByteLength === null) {
    throw new Error(`Asset attestation for ${asset.assetId} cannot mark absent observations as a byte mismatch.`);
  }
  if ((attestation.status === "missing" || attestation.status === "unavailable")
    && (attestation.observedSha256 !== null || attestation.observedByteLength !== null)) {
    throw new Error(`Asset attestation for ${asset.assetId} cannot include observed bytes for ${attestation.status} state.`);
  }
}

function assertGateStatus(gate: AssetAttestationGate): void {
  const expectedStatus = gate.attestations.length === gate.requiredAssetIds.length
    && gate.attestations.every((attestation) => attestation.status === "attested")
    ? "ready"
    : "blocked";
  if (gate.status !== expectedStatus) throw new Error("Asset attestation gate status does not match its attestations.");
}

export function validateAssetAttestationGate(manifestInput: unknown, gateInput: unknown): AssetAttestationGate {
  const manifest = approvedAssetManifestSchema.parse(manifestInput);
  const gate = assetAttestationGateSchema.parse(gateInput);
  assertSortedIds(gate.requiredAssetIds, "Required asset IDs");
  assertSortedIds(gate.dependentDocumentIds, "Dependent document IDs");
  assertSortedIds(gate.attestations.map((attestation) => attestation.assetId), "Asset attestations");

  const required = new Set(gate.requiredAssetIds);
  const seen = new Set<string>();
  for (const assetId of gate.requiredAssetIds) assetForId(manifest, assetId);
  for (const attestation of gate.attestations) {
    if (!required.has(attestation.assetId)) throw new Error(`Asset attestation ${attestation.assetId} is not required by the gate.`);
    if (!seen.add(attestation.assetId)) throw new Error(`Asset ${attestation.assetId} has duplicate attestations.`);
    assertAttestationMatchesAsset(attestation, assetForId(manifest, attestation.assetId));
  }
  if (seen.size !== required.size) throw new Error("Asset attestation gate is missing a required asset attestation.");
  assertGateStatus(gate);
  return gate;
}

export function createAssetAttestationGate(input: {
  readonly manifest: unknown;
  readonly requiredAssetIds: readonly string[];
  readonly dependentDocumentIds: readonly string[];
  readonly attestations?: readonly unknown[];
  readonly observedAt: string;
}): AssetAttestationGate {
  const manifest = approvedAssetManifestSchema.parse(input.manifest);
  const requiredAssetIds = sortedUniqueIds(input.requiredAssetIds, "Required asset IDs");
  const dependentDocumentIds = sortedUniqueIds(input.dependentDocumentIds, "Dependent document IDs");
  const provided = (input.attestations ?? []).map((attestation) => assetByteAttestationSchema.parse(attestation));
  const byAssetId = new Map<string, AssetByteAttestation>();
  for (const attestation of provided) {
    if (!requiredAssetIds.includes(attestation.assetId)) throw new Error(`Asset attestation ${attestation.assetId} is not required by the gate.`);
    if (byAssetId.has(attestation.assetId)) throw new Error(`Asset ${attestation.assetId} has duplicate attestations.`);
    assertAttestationMatchesAsset(attestation, assetForId(manifest, attestation.assetId));
    byAssetId.set(attestation.assetId, attestation);
  }
  const attestations = requiredAssetIds.map((assetId) => byAssetId.get(assetId) ?? assetByteAttestationSchema.parse({
    schemaVersion: "0.1.0",
    assetId,
    expectedSha256: assetForId(manifest, assetId).sha256,
    observedSha256: null,
    expectedByteLength: assetForId(manifest, assetId).byteLength,
    observedByteLength: null,
    source: "none",
    status: "missing",
    attestedAt: input.observedAt,
    noWrite: true,
    notes: ["No byte attestation was supplied for this required asset; dependent-document creation remains blocked."],
  }));
  const gate = assetAttestationGateSchema.parse({
    schemaVersion: "0.1.0",
    manifestId: manifest.manifestId,
    requiredAssetIds,
    dependentDocumentIds,
    attestations,
    status: attestations.every((attestation) => attestation.status === "attested") ? "ready" : "blocked",
    noWrite: true,
  });
  return validateAssetAttestationGate(manifest, gate);
}

export function assertAssetAttestationForDependentDocuments(
  manifestInput: unknown,
  gateInput: unknown,
  dependentDocumentIds: readonly string[],
): true {
  const gate = validateAssetAttestationGate(manifestInput, gateInput);
  const requestedIds = sortedUniqueIds(dependentDocumentIds, "Dependent document IDs");
  if (gate.status !== "ready") {
    throw new Error("Asset attestation gate is blocked; dependent-document creation is not eligible.");
  }
  if (requestedIds.some((stableId) => !gate.dependentDocumentIds.includes(stableId))) {
    throw new Error("Dependent-document creation requested an ID outside the attested gate scope.");
  }
  return true;
}

export function serializeAssetAttestationGate(input: unknown): string {
  return canonicalizeFoundryIr(assetAttestationGateSchema.parse(input));
}
