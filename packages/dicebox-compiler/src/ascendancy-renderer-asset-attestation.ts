import { z } from "zod";
import { createStableDiceBoxId } from "@dicebox/core";
import {
  attestApprovedAssetBytes,
  createAssetAttestationGate,
  type AssetAttestationGate,
  type AssetBytes,
} from "./asset-attestation.js";
import {
  createApprovedAsset,
  createApprovedAssetManifest,
  validateApprovedAssetManifest,
  type ApprovedAssetManifest,
} from "./media-registry.js";

const rendererAssetSpecs = [
  {
    assetId: createStableDiceBoxId("asset", "map-rune-mechanism-chamber"),
    label: "Ascendancy Rune Mechanism Chamber renderer",
    locator: "assets/maps/ascendancy-rune-mechanism-chamber-v2.png",
    sha256: "f45922e219a12fba6b79a26ad0d6b5ebbaf51add86c025e9b676da24707d507b",
    byteLength: 2748729,
  },
  {
    assetId: createStableDiceBoxId("asset", "map-signal-frequency-chamber"),
    label: "Ascendancy Signal Frequency Chamber renderer",
    locator: "assets/maps/ascendancy-signal-frequency-chamber-v2.png",
    sha256: "db9307932865b0d3a23c5a8aa61082d520206443318658de7e03c773a1a9972e",
    byteLength: 2935616,
  },
] as const;

const rendererManifestId = createStableDiceBoxId("manifest", "m1086-signal-rune-renderers");

function expectedManifest(): ApprovedAssetManifest {
  return createApprovedAssetManifest({
    manifestId: rendererManifestId,
    assets: rendererAssetSpecs.map((spec) => createApprovedAsset({
      assetId: spec.assetId,
      role: "background",
      label: spec.label,
      locator: spec.locator,
      mimeType: "image/png",
      sha256: spec.sha256,
      byteLength: spec.byteLength,
      width: 1536,
      height: 1024,
      provenance: "assets/maps/README.md;outputs/m34-map-renderer-research-static-receipt.json;outputs/m35-ascendancy-campaign-package-static-receipt.json",
    })),
  });
}

function assertExpectedManifest(input: ApprovedAssetManifest): ApprovedAssetManifest {
  const expected = expectedManifest();
  if (JSON.stringify(input) !== JSON.stringify(expected)) {
    throw new Error("M1086 approved renderer manifest drifted from the exact local Signal/Rune asset evidence.");
  }
  return input;
}

/** Return the exact approved metadata for the two current scene-bound renderer files. */
export function createAscendancyRendererApprovedAssetManifest(): ApprovedAssetManifest {
  return assertExpectedManifest(expectedManifest());
}

export function validateAscendancyRendererApprovedAssetManifest(input: unknown): ApprovedAssetManifest {
  return assertExpectedManifest(validateApprovedAssetManifest(input));
}

export const ascendancyRendererAttestationInputSchema = z.object({
  signalBytes: z.custom<AssetBytes>(),
  runeBytes: z.custom<AssetBytes>(),
  observedAt: z.string().datetime({ offset: true }),
}).strict();

export type AscendancyRendererAttestationInput = z.infer<typeof ascendancyRendererAttestationInputSchema>;

async function collectRendererAttestations(input: AscendancyRendererAttestationInput): Promise<{
  readonly manifest: ApprovedAssetManifest;
  readonly attestations: Awaited<ReturnType<typeof attestApprovedAssetBytes>>[];
}> {
  const parsed = ascendancyRendererAttestationInputSchema.parse(input);
  const manifest = createAscendancyRendererApprovedAssetManifest();
  const rune = manifest.assets.find((asset) => asset.assetId === rendererAssetSpecs[0].assetId);
  const signal = manifest.assets.find((asset) => asset.assetId === rendererAssetSpecs[1].assetId);
  if (!rune || !signal) throw new Error("M1086 renderer manifest is missing the required Rune or Signal asset.");
  const attestations = await Promise.all([
    attestApprovedAssetBytes(rune, parsed.runeBytes, { observedAt: parsed.observedAt }),
    attestApprovedAssetBytes(signal, parsed.signalBytes, { observedAt: parsed.observedAt }),
  ]);
  return { manifest, attestations };
}

/** Attest only caller-supplied local bytes; this helper never fetches, uploads, or creates documents. */
export async function attestAscendancyRendererBytes(input: AscendancyRendererAttestationInput): Promise<AssetAttestationGate> {
  const parsed = ascendancyRendererAttestationInputSchema.parse(input);
  const { manifest, attestations } = await collectRendererAttestations(parsed);
  const rune = manifest.assets.find((asset) => asset.assetId === rendererAssetSpecs[0].assetId);
  const signal = manifest.assets.find((asset) => asset.assetId === rendererAssetSpecs[1].assetId);
  if (!rune || !signal) throw new Error("M1086 renderer manifest is missing the required Rune or Signal asset.");
  return createAssetAttestationGate({
    manifest,
    requiredAssetIds: [rune.assetId, signal.assetId],
    dependentDocumentIds: [],
    attestations,
    observedAt: parsed.observedAt,
  });
}

/** Scope future dependent-document eligibility without creating or mutating any document. */
export async function createAscendancySignalRuneDependentDocumentEligibilityGate(input: AscendancyRendererAttestationInput): Promise<AssetAttestationGate> {
  const parsed = ascendancyRendererAttestationInputSchema.parse(input);
  const { manifest, attestations } = await collectRendererAttestations(parsed);
  const rune = manifest.assets.find((asset) => asset.assetId === rendererAssetSpecs[0].assetId);
  const signal = manifest.assets.find((asset) => asset.assetId === rendererAssetSpecs[1].assetId);
  if (!rune || !signal) throw new Error("M1088 renderer manifest is missing the required Rune or Signal asset.");
  return createAssetAttestationGate({
    manifest,
    requiredAssetIds: [rune.assetId, signal.assetId],
    dependentDocumentIds: [
      createStableDiceBoxId("scene", "signal-frequency-chamber"),
      createStableDiceBoxId("scene", "rune-mechanism-chamber"),
    ],
    attestations,
    observedAt: parsed.observedAt,
  });
}
