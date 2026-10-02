import { z } from "zod";

export const semanticKinds = [
  "campaign",
  "folder",
  "journal",
  "actor",
  "item",
  "scene",
  "region",
  "asset",
] as const;

export type SemanticKind = (typeof semanticKinds)[number];
export type StableDiceBoxId = string & { readonly __diceboxStableId: unique symbol };

export interface SemanticRef {
  readonly id: StableDiceBoxId;
  readonly kind: SemanticKind;
}

export type FoundryDocumentType =
  | "Folder"
  | "JournalEntry"
  | "Actor"
  | "Item"
  | "Scene"
  | "Region"
  | "Level"
  | "Wall"
  | "Token"
  | "AmbientLight"
  | "AmbientSound"
  | "Tile"
  | "Drawing"
  | "Note";

export interface RuntimeBinding {
  readonly semantic: SemanticRef;
  readonly runtime: "foundry";
  readonly documentType: FoundryDocumentType;
  readonly documentId: string;
  readonly uuid: string;
  readonly generation: number;
  /** Runtime-only identity for the managed JournalEntryPage projection. */
  readonly embeddedDocumentId?: string;
  readonly displayName?: string;
}

const stableIdPattern = /^dbx:[a-z0-9][a-z0-9._-]*:[a-z0-9][a-z0-9._-]*$/;

export function createStableDiceBoxId(namespace: string, localKey: string): StableDiceBoxId {
  const id = `dbx:${namespace}:${localKey}`.toLowerCase();
  if (!stableIdPattern.test(id)) {
    throw new Error(`Invalid DiceBox semantic ID: ${id}`);
  }
  return id as StableDiceBoxId;
}

export function isStableDiceBoxId(value: string): value is StableDiceBoxId {
  return stableIdPattern.test(value);
}

export const StableDiceBoxIdSchema = z.string().regex(stableIdPattern).transform((value) => value as StableDiceBoxId);

export const SemanticKindSchema = z.enum(semanticKinds);

export const SemanticRefSchema = z.object({
  id: StableDiceBoxIdSchema,
  kind: SemanticKindSchema,
});

export const RuntimeBindingSchema = z.object({
  semantic: SemanticRefSchema,
  runtime: z.literal("foundry"),
  documentType: z.enum(["Folder", "JournalEntry", "Actor", "Item", "Scene", "Region", "Level", "Wall", "Token", "AmbientLight", "AmbientSound", "Tile", "Drawing", "Note"]),
  documentId: z.string().min(1),
  uuid: z.string().min(1),
  generation: z.number().int().nonnegative(),
  embeddedDocumentId: z.string().min(1).optional(),
  displayName: z.string().min(1).optional(),
});
