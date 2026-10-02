import { z } from "zod";
import {
  StableDiceBoxIdSchema,
  type StableDiceBoxId,
} from "@dicebox/core";

const sha256Pattern = /^[0-9a-f]{64}$/;

export const approvedAssetRoles = [
  "background",
  "token",
  "handout",
  "audio",
  "font",
  "texture",
  "ui",
] as const;

export type ApprovedAssetRole = (typeof approvedAssetRoles)[number];

const assetDescriptorSchema = z.object({
  locator: z.string().min(1),
  mimeType: z.string().regex(/^[^/\s]+\/[^/\s]+$/),
  sha256: z.string().regex(sha256Pattern),
  byteLength: z.number().int().positive(),
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
}).strict();

export const approvedAssetVariantSchema = assetDescriptorSchema.extend({
  variantId: StableDiceBoxIdSchema,
  label: z.string().min(1),
}).strict();

export const approvedAssetSchema = assetDescriptorSchema.extend({
  assetId: StableDiceBoxIdSchema,
  role: z.enum(approvedAssetRoles),
  label: z.string().min(1),
  provenance: z.string().min(1),
  approval: z.literal("approved"),
  variants: z.array(approvedAssetVariantSchema).max(32),
}).strict().superRefine((value, context) => {
  const variantIds = new Set<string>();
  for (const [index, variant] of value.variants.entries()) {
    if (variant.variantId === value.assetId) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["variants", index, "variantId"],
        message: "A variant must have an identity distinct from its parent asset.",
      });
    }
    if (variantIds.has(variant.variantId)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["variants", index, "variantId"],
        message: "Variant identities must be unique within an asset.",
      });
    }
    variantIds.add(variant.variantId);
  }
});

export type ApprovedAssetVariant = z.infer<typeof approvedAssetVariantSchema>;
export type ApprovedAsset = z.infer<typeof approvedAssetSchema>;

export const approvedAssetManifestSchema = z.object({
  schemaVersion: z.literal("0.1.0"),
  manifestId: StableDiceBoxIdSchema,
  assets: z.array(approvedAssetSchema).max(2000),
}).strict().superRefine((value, context) => {
  const assetIds = new Set<string>();
  for (const [index, asset] of value.assets.entries()) {
    if (assetIds.has(asset.assetId)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["assets", index, "assetId"],
        message: "Asset identities must be unique within a manifest.",
      });
    }
    assetIds.add(asset.assetId);
  }
});

export type ApprovedAssetManifest = z.infer<typeof approvedAssetManifestSchema>;

export function createApprovedAsset(input: {
  readonly assetId: StableDiceBoxId;
  readonly role: ApprovedAssetRole;
  readonly label: string;
  readonly locator: string;
  readonly mimeType: string;
  readonly sha256: string;
  readonly byteLength: number;
  readonly width?: number;
  readonly height?: number;
  readonly provenance: string;
  readonly variants?: readonly ApprovedAssetVariant[];
}): ApprovedAsset {
  return approvedAssetSchema.parse({
    assetId: input.assetId,
    role: input.role,
    label: input.label,
    locator: input.locator,
    mimeType: input.mimeType,
    sha256: input.sha256,
    byteLength: input.byteLength,
    ...(input.width === undefined ? {} : { width: input.width }),
    ...(input.height === undefined ? {} : { height: input.height }),
    provenance: input.provenance,
    approval: "approved",
    variants: [...(input.variants ?? [])],
  });
}

export function createApprovedAssetManifest(input: {
  readonly manifestId: StableDiceBoxId;
  readonly assets: readonly ApprovedAsset[];
}): ApprovedAssetManifest {
  return approvedAssetManifestSchema.parse({
    schemaVersion: "0.1.0",
    manifestId: input.manifestId,
    assets: [...input.assets],
  });
}

export function validateApprovedAssetManifest(input: unknown): ApprovedAssetManifest {
  return approvedAssetManifestSchema.parse(input);
}
