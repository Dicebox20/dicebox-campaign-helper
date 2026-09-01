import { z } from "zod";
import {
  DICEBOX_PACKAGE_ID,
  RuntimeFingerprintSchema,
  RuntimeProfileSchema,
  StableDiceBoxIdSchema,
  createRuntimeFingerprint,
  type RuntimeFingerprint,
  type RuntimeProfile,
  type StableDiceBoxId,
} from "@dicebox/core";

const foundryDocumentTypes = ["Scene", "Level", "Wall", "Region", "Tile", "JournalEntry"] as const;
const documentOperations = ["create", "update"] as const;

const finiteNumber = z.number().finite();

const scenePayloadSchema = z.object({
  documentType: z.literal("Scene"),
  fields: z.object({
    name: z.string().min(1),
    width: finiteNumber,
    height: finiteNumber,
    gridSize: finiteNumber.int().positive(),
  }).strict(),
}).strict();

const levelPayloadSchema = z.object({
  documentType: z.literal("Level"),
  fields: z.object({
    backgroundSrc: z.string().min(1).nullable(),
  }).strict(),
}).strict();

const wallPayloadSchema = z.object({
  documentType: z.literal("Wall"),
  fields: z.object({
    coordinates: z.tuple([finiteNumber, finiteNumber, finiteNumber, finiteNumber]),
    door: z.number().int().min(0).max(1),
  }).strict(),
}).strict();

const regionPayloadSchema = z.object({
  documentType: z.literal("Region"),
  fields: z.object({
    name: z.string().min(1),
    polygonPoints: z.array(finiteNumber).min(6).refine((points) => points.length % 2 === 0, {
      message: "Region polygon points must contain x/y pairs.",
    }),
    hole: z.boolean(),
  }).strict(),
}).strict();

const tilePayloadSchema = z.object({
  documentType: z.literal("Tile"),
  fields: z.object({
    x: finiteNumber,
    y: finiteNumber,
    width: finiteNumber,
    height: finiteNumber,
    textureSrc: z.string().min(1).nullable(),
  }).strict(),
}).strict();

const journalEntryPayloadSchema = z.object({
  documentType: z.literal("JournalEntry"),
  fields: z.object({
    name: z.string().min(1),
    content: z.string(),
  }).strict(),
}).strict();

export const foundryIrPayloadSchema = z.discriminatedUnion("documentType", [
  scenePayloadSchema,
  levelPayloadSchema,
  wallPayloadSchema,
  regionPayloadSchema,
  tilePayloadSchema,
  journalEntryPayloadSchema,
]);

export type FoundryIrPayload = z.infer<typeof foundryIrPayloadSchema>;

export const foundryIrDocumentSchema = z.object({
  stableId: StableDiceBoxIdSchema,
  documentType: z.enum(foundryDocumentTypes),
  operation: z.enum(documentOperations),
  parentStableId: StableDiceBoxIdSchema.nullable(),
  dependencies: z.array(StableDiceBoxIdSchema).max(500),
  foundryApi: z.string().min(1),
  ownership: z.object({
    moduleId: z.literal(DICEBOX_PACKAGE_ID),
    stableId: StableDiceBoxIdSchema,
    mode: z.literal("managed"),
  }).strict(),
  payload: foundryIrPayloadSchema,
}).strict();

export type FoundryIrDocument = z.infer<typeof foundryIrDocumentSchema>;

export const foundryIrTargetSchema = z.object({
  packageId: z.literal(DICEBOX_PACKAGE_ID),
  foundryVersion: z.string().min(1),
  systemId: z.string().min(1),
  systemVersion: z.string().min(1),
  adapterId: z.string().min(1),
  adapterVersion: z.string().min(1),
  profileFingerprintId: StableDiceBoxIdSchema,
}).strict();

export type FoundryIrTarget = z.infer<typeof foundryIrTargetSchema>;

export const foundryIrPlanSchema = z.object({
  schemaVersion: z.literal("0.1.0"),
  planId: StableDiceBoxIdSchema,
  target: foundryIrTargetSchema,
  runtimeFingerprint: RuntimeFingerprintSchema,
  documents: z.array(foundryIrDocumentSchema).max(500),
  dependencyOrder: z.array(StableDiceBoxIdSchema).max(500),
  planSha256: z.string().regex(/^[0-9a-f]{64}$/),
}).strict();

export type FoundryIrPlan = z.infer<typeof foundryIrPlanSchema>;

export type FoundryIrDocumentInput = {
  readonly stableId: string;
  readonly documentType: (typeof foundryDocumentTypes)[number];
  readonly operation: (typeof documentOperations)[number];
  readonly parentStableId: string | null;
  readonly dependencies?: readonly string[];
  readonly foundryApi: string;
  readonly ownership: {
    readonly moduleId: string;
    readonly stableId: string;
    readonly mode: "managed";
  };
  readonly payload: unknown;
};

export type CreateFoundryIrPlanInput = {
  readonly planId: string;
  readonly target: Omit<FoundryIrTarget, "packageId" | "profileFingerprintId">;
  readonly runtimeProfile: RuntimeProfile;
  readonly documents: readonly FoundryIrDocumentInput[];
};

function compareStableIds(left: string, right: string): number {
  return left < right ? -1 : left > right ? 1 : 0;
}

function arraysEqual(left: readonly string[], right: readonly string[]): boolean {
  return left.length === right.length && left.every((value, index) => value === right[index]);
}

function sortUniqueDependencies(document: FoundryIrDocument): FoundryIrDocument {
  const dependencies = [...document.dependencies].sort(compareStableIds);
  if (new Set(dependencies).size !== dependencies.length) {
    throw new Error(`Foundry IR document ${document.stableId} contains duplicate dependencies.`);
  }
  return { ...document, dependencies };
}

function assertDocumentRelations(document: FoundryIrDocument): void {
  if (document.ownership.stableId !== document.stableId) {
    throw new Error(`Foundry IR document ${document.stableId} has mismatched managed ownership.`);
  }
  if (document.payload.documentType !== document.documentType) {
    throw new Error(`Foundry IR document ${document.stableId} has a payload/document type mismatch.`);
  }
}

function normalizeDocuments(input: readonly FoundryIrDocumentInput[]): FoundryIrDocument[] {
  return input.map((document) => {
    const parsed = foundryIrDocumentSchema.parse({
      ...document,
      dependencies: document.dependencies ?? [],
    });
    const normalized = sortUniqueDependencies(parsed);
    assertDocumentRelations(normalized);
    return normalized;
  });
}

function dependencyOrder(documents: readonly FoundryIrDocument[]): StableDiceBoxId[] {
  const byId = new Map<string, FoundryIrDocument>();
  for (const document of documents) {
    if (byId.has(document.stableId)) {
      throw new Error(`Foundry IR contains duplicate document ID ${document.stableId}.`);
    }
    byId.set(document.stableId, document);
  }

  const indegree = new Map<string, number>();
  const dependents = new Map<string, string[]>();
  for (const document of documents) {
    indegree.set(document.stableId, document.dependencies.length);
    for (const dependency of document.dependencies) {
      if (dependency === document.stableId) {
        throw new Error(`Foundry IR document ${document.stableId} cannot depend on itself.`);
      }
      if (!byId.has(dependency)) {
        throw new Error(`Foundry IR document ${document.stableId} depends on missing document ${dependency}.`);
      }
      const children = dependents.get(dependency) ?? [];
      children.push(document.stableId);
      dependents.set(dependency, children);
    }
    if (document.parentStableId !== null && !document.dependencies.includes(document.parentStableId)) {
      throw new Error(`Foundry IR document ${document.stableId} must depend on its parent.`);
    }
  }

  const available: string[] = documents
    .filter((document) => indegree.get(document.stableId) === 0)
    .map((document) => document.stableId)
    .sort(compareStableIds);
  const ordered: StableDiceBoxId[] = [];

  while (available.length > 0) {
    const current = available.shift();
    if (!current) throw new Error("Foundry IR dependency queue unexpectedly emptied.");
    ordered.push(current as StableDiceBoxId);
    for (const child of (dependents.get(current) ?? []).sort(compareStableIds)) {
      const nextDegree = (indegree.get(child) ?? 0) - 1;
      indegree.set(child, nextDegree);
      if (nextDegree === 0) {
        available.push(child);
        available.sort(compareStableIds);
      }
    }
  }

  if (ordered.length !== documents.length) {
    throw new Error("Foundry IR dependency graph contains a cycle.");
  }
  return ordered;
}

function orderedDocuments(documents: readonly FoundryIrDocument[], order: readonly string[]): FoundryIrDocument[] {
  const byId = new Map<string, FoundryIrDocument>(documents.map((document) => [document.stableId, document]));
  return order.map((stableId) => {
    const document = byId.get(stableId);
    if (!document) throw new Error(`Foundry IR dependency order references missing document ${stableId}.`);
    return document;
  });
}

function assertTargetProfileIdentity(target: FoundryIrTarget, fingerprint: RuntimeFingerprint): void {
  if (target.profileFingerprintId !== fingerprint.fingerprintId) {
    throw new Error("Foundry IR target profile fingerprint identity does not match the runtime fingerprint.");
  }
  if (target.foundryVersion !== fingerprint.foundryVersion
    || target.systemId !== fingerprint.systemId
    || target.systemVersion !== fingerprint.systemVersion) {
    throw new Error("Foundry IR target identity does not match the runtime fingerprint target.");
  }
  if (fingerprint.foundryVersion === null || fingerprint.systemId === null || fingerprint.systemVersion === null) {
    throw new Error("Foundry IR requires non-null runtime target identity.");
  }
}

function unsignedPlan(plan: FoundryIrPlan): Omit<FoundryIrPlan, "planSha256"> {
  const { planSha256: _planSha256, ...withoutHash } = plan;
  return withoutHash;
}

export function canonicalizeFoundryIr(value: unknown): string {
  if (value === null || typeof value !== "object") {
    const encoded = JSON.stringify(value);
    if (encoded === undefined) throw new Error("Cannot canonicalize an undefined Foundry IR value.");
    return encoded;
  }
  if (Array.isArray(value)) return `[${value.map((item) => canonicalizeFoundryIr(item)).join(",")}]`;
  const record = value as Record<string, unknown>;
  return `{${Object.keys(record).sort(compareStableIds).map((key) => `${JSON.stringify(key)}:${canonicalizeFoundryIr(record[key])}`).join(",")}}`;
}

export async function sha256FoundryIr(value: string): Promise<string> {
  const digest = await globalThis.crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

export function validateFoundryIrPlan(input: unknown): FoundryIrPlan {
  const plan = foundryIrPlanSchema.parse(input);
  assertTargetProfileIdentity(plan.target, plan.runtimeFingerprint);
  const normalizedDocuments = plan.documents.map(sortUniqueDependencies);
  for (const document of normalizedDocuments) {
    if (!arraysEqual(document.dependencies, plan.documents.find((candidate) => candidate.stableId === document.stableId)?.dependencies ?? [])) {
      throw new Error(`Foundry IR document ${document.stableId} dependencies are not canonicalized.`);
    }
    assertDocumentRelations(document);
  }
  const computedOrder = dependencyOrder(normalizedDocuments);
  if (!arraysEqual(computedOrder, plan.dependencyOrder)) {
    throw new Error("Foundry IR dependency order is not the canonical topological order.");
  }
  const ordered = orderedDocuments(normalizedDocuments, computedOrder);
  if (!arraysEqual(ordered.map((document) => document.stableId), plan.dependencyOrder)) {
    throw new Error("Foundry IR dependency order does not cover the document set exactly once.");
  }
  return plan;
}

export async function createFoundryIrPlan(input: CreateFoundryIrPlanInput): Promise<FoundryIrPlan> {
  const runtimeProfile = RuntimeProfileSchema.parse(input.runtimeProfile);
  const runtimeFingerprint = RuntimeFingerprintSchema.parse(createRuntimeFingerprint(runtimeProfile));
  const target = foundryIrTargetSchema.parse({
    ...input.target,
    packageId: DICEBOX_PACKAGE_ID,
    profileFingerprintId: runtimeFingerprint.fingerprintId,
  });
  assertTargetProfileIdentity(target, runtimeFingerprint);
  const documents = normalizeDocuments(input.documents);
  const order = dependencyOrder(documents);
  const unsigned = {
    schemaVersion: "0.1.0" as const,
    planId: StableDiceBoxIdSchema.parse(input.planId),
    target,
    runtimeFingerprint,
    documents: orderedDocuments(documents, order),
    dependencyOrder: order,
  };
  const planSha256 = await sha256FoundryIr(canonicalizeFoundryIr(unsigned));
  return validateFoundryIrPlan({ ...unsigned, planSha256 });
}

export async function verifyFoundryIrPlanHash(input: unknown): Promise<boolean> {
  try {
    const plan = validateFoundryIrPlan(input);
    return (await sha256FoundryIr(canonicalizeFoundryIr(unsignedPlan(plan)))) === plan.planSha256;
  } catch {
    return false;
  }
}

export function serializeFoundryIrPlan(input: unknown): string {
  return canonicalizeFoundryIr(validateFoundryIrPlan(input));
}
