import { createProposalBatch, type ProposalBatch, type ProposalBatchInput } from "@dicebox/core";
import { serializeSceneDocument, validateSceneDocument, type SceneDocument } from "@dicebox/scene";

export const PROJECT_ASSET_BIND_PREVIEW_OPERATION = "dicebox.project.asset.bind.preview" as const;

export type ProjectBackgroundAssetCandidate = Readonly<{
  mediaType: "image/png";
  bytes: readonly number[];
  label: string;
  provenance: "user-import";
}>;

export type ProjectBackgroundBindingContent = Readonly<{
  scenes: readonly SceneDocument[];
  activeSceneId: string;
  sceneId: string;
  candidate: ProjectBackgroundAssetCandidate;
}>;

export type ProjectAssetBindingContent = ProjectBackgroundBindingContent;

export type ProjectAssetBindingDescriptor = Readonly<{
  assetId: string;
  assetSha256: string;
  mediaType: "image/png";
  role: "background";
  sceneId: string;
  label: string;
  provenance: "user-import";
}>;

export type ProjectAssetBindingPreview = Readonly<{
  operation: typeof PROJECT_ASSET_BIND_PREVIEW_OPERATION;
  status: "PREVIEW";
  projectId: string;
  currentGeneration: number;
  currentContentSha256: string;
  candidateDescriptorSha256: string;
  assetId: string;
  assetSha256: string;
  role: "background";
  sceneId: string;
  proposedSceneCount: number;
  proposedActiveSceneId: string;
  proposedAssetCount: number;
  requiresApproval: true;
  noWrite: true;
  noFoundryWrite: true;
  previewSha256: string;
}>;

export type ProjectAssetBindingProposalInput = Readonly<{
  batchId: ProposalBatchInput["batchId"];
  preview: unknown;
  createdAt: string;
}>;

const stableIdPattern = /^dbx:[a-z0-9][a-z0-9._-]*:[a-z0-9][a-z0-9._-]*$/;
const sha256Pattern = /^[0-9a-f]{64}$/;
const pngSignature = [137, 80, 78, 71, 13, 10, 26, 10] as const;

function record(value: unknown, label: string): Record<string, unknown> {
  if (value === null || typeof value !== "object" || Array.isArray(value)) throw new Error(`${label} must be an object.`);
  return value as Record<string, unknown>;
}

function assertExactKeys(value: Record<string, unknown>, expected: readonly string[], label: string): void {
  if (Object.keys(value).sort().join("|") !== [...expected].sort().join("|")) throw new Error(`${label} contains unknown or missing fields.`);
}

function stableId(value: unknown, label: string): string {
  if (typeof value !== "string" || !stableIdPattern.test(value) || value.trim() !== value) throw new Error(`${label} must be a stable DiceBox ID.`);
  return value;
}

function sha256Value(value: unknown, label: string): string {
  if (typeof value !== "string" || !sha256Pattern.test(value) || value.trim() !== value) throw new Error(`${label} must be a lowercase SHA-256 value.`);
  return value;
}

function nonnegativeInteger(value: unknown, label: string): number {
  if (!Number.isSafeInteger(value) || (value as number) < 0) throw new Error(`${label} must be a nonnegative safe integer.`);
  return value as number;
}

function canonicalize(value: unknown): string {
  if (value === null || typeof value === "string" || typeof value === "boolean") return JSON.stringify(value);
  if (typeof value === "number") {
    if (!Number.isFinite(value)) throw new Error("Asset binding content cannot contain a non-finite number.");
    return JSON.stringify(value);
  }
  if (Array.isArray(value)) return `[${value.map(canonicalize).join(",")}]`;
  const object = record(value, "Asset binding value");
  return `{${Object.keys(object).sort().map((key) => `${JSON.stringify(key)}:${canonicalize(object[key])}`).join(",")}}`;
}

async function hashValue(value: unknown): Promise<string> {
  const digest = await globalThis.crypto.subtle.digest("SHA-256", new TextEncoder().encode(canonicalize(value)));
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function hashBytes(bytes: readonly number[]): Promise<string> {
  const owned = Uint8Array.from(bytes);
  const digest = await globalThis.crypto.subtle.digest("SHA-256", owned.buffer);
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

function validateCandidate(candidate: ProjectBackgroundAssetCandidate): void {
  if (candidate.mediaType !== "image/png") throw new Error("M341 accepts PNG background candidates only.");
  if (!candidate.label || candidate.label.trim() !== candidate.label || [...candidate.label].length > 100 || [...candidate.label].some((character) => /[\u0000-\u001f\u007f]/u.test(character))) {
    throw new Error("Background asset label must be 1–100 trimmed non-control characters.");
  }
  if (candidate.provenance !== "user-import") throw new Error("M341 accepts user-import background provenance only.");
  if (candidate.bytes.length === 0 || candidate.bytes.length > 32 * 1024 * 1024 || candidate.bytes.some((byte) => !Number.isInteger(byte) || byte < 0 || byte > 255)) {
    throw new Error("Background asset bytes must contain 1 byte through 32 MiB of byte values.");
  }
  if (!pngSignature.every((byte, index) => candidate.bytes[index] === byte)) throw new Error("Background asset must contain a PNG signature.");
}

export async function deriveProjectBackgroundAssetDescriptor(input: ProjectBackgroundAssetCandidate, sceneId: string): Promise<ProjectAssetBindingDescriptor> {
  validateCandidate(input);
  const assetSha256 = await hashBytes(input.bytes);
  return {
    assetId: `dbx:asset:sha256-${assetSha256}`,
    assetSha256,
    mediaType: "image/png",
    role: "background",
    sceneId: stableId(sceneId, "sceneId"),
    label: input.label,
    provenance: input.provenance,
  };
}

export function validateProjectBackgroundBindingContent(content: ProjectBackgroundBindingContent): ProjectBackgroundBindingContent {
  stableId(content.activeSceneId, "activeSceneId");
  stableId(content.sceneId, "sceneId");
  if (content.scenes.length === 0 || content.scenes.length > 256) throw new Error("Asset binding content requires 1–256 Scenes.");
  if (!content.scenes.some((scene) => scene.id === content.activeSceneId)) throw new Error("Asset binding active Scene must identify one supplied Scene.");
  if (!content.scenes.some((scene) => scene.id === content.sceneId)) throw new Error("Asset binding target Scene must identify one supplied Scene.");
  if (new Set(content.scenes.map((scene) => scene.id)).size !== content.scenes.length) throw new Error("Asset binding Scene IDs must be unique.");
  for (const scene of content.scenes) {
    const errors = validateSceneDocument(scene);
    if (errors.length > 0) throw new Error(`Asset binding content contains an invalid Scene: ${errors.join("; ")}`);
  }
  validateCandidate(content.candidate);
  return content;
}

function descriptorIdentity(input: Omit<ProjectAssetBindingPreview, "operation" | "status" | "requiresApproval" | "noWrite" | "noFoundryWrite" | "previewSha256">): Record<string, unknown> {
  return {
    operation: PROJECT_ASSET_BIND_PREVIEW_OPERATION,
    projectId: stableId(input.projectId, "projectId"),
    currentGeneration: nonnegativeInteger(input.currentGeneration, "currentGeneration"),
    currentContentSha256: sha256Value(input.currentContentSha256, "currentContentSha256"),
    candidateDescriptorSha256: sha256Value(input.candidateDescriptorSha256, "candidateDescriptorSha256"),
    assetId: stableId(input.assetId, "assetId"),
    assetSha256: sha256Value(input.assetSha256, "assetSha256"),
    role: "background",
    sceneId: stableId(input.sceneId, "sceneId"),
    proposedSceneCount: nonnegativeInteger(input.proposedSceneCount, "proposedSceneCount"),
    proposedActiveSceneId: stableId(input.proposedActiveSceneId, "proposedActiveSceneId"),
    proposedAssetCount: nonnegativeInteger(input.proposedAssetCount, "proposedAssetCount"),
    requiresApproval: true,
    noWrite: true,
    noFoundryWrite: true,
  };
}

export async function createProjectAssetBindingPreview(input: Readonly<{
  projectId: string;
  currentGeneration: number;
  currentContentSha256: string;
  candidate: ProjectBackgroundAssetCandidate;
  sceneId: string;
  proposedSceneCount: number;
  proposedActiveSceneId: string;
  proposedAssetCount: number;
}>): Promise<ProjectAssetBindingPreview> {
  const descriptor = await deriveProjectBackgroundAssetDescriptor(input.candidate, input.sceneId);
  const candidateDescriptorSha256 = await hashValue(descriptor);
  const identity = descriptorIdentity({
    projectId: input.projectId,
    currentGeneration: input.currentGeneration,
    currentContentSha256: input.currentContentSha256,
    candidateDescriptorSha256,
    assetId: descriptor.assetId,
    assetSha256: descriptor.assetSha256,
    role: "background",
    sceneId: descriptor.sceneId,
    proposedSceneCount: input.proposedSceneCount,
    proposedActiveSceneId: input.proposedActiveSceneId,
    proposedAssetCount: input.proposedAssetCount,
  });
  return {
    ...identity,
    status: "PREVIEW",
    previewSha256: await hashValue(identity),
    requiresApproval: true,
    noWrite: true,
    noFoundryWrite: true,
  } as ProjectAssetBindingPreview;
}

function validatePreview(input: unknown): ProjectAssetBindingPreview {
  const value = record(input, "Project asset binding preview");
  assertExactKeys(value, ["assetId", "assetSha256", "candidateDescriptorSha256", "currentContentSha256", "currentGeneration", "noFoundryWrite", "noWrite", "operation", "previewSha256", "projectId", "proposedActiveSceneId", "proposedAssetCount", "proposedSceneCount", "requiresApproval", "role", "sceneId", "status"], "Project asset binding preview");
  if (value.operation !== PROJECT_ASSET_BIND_PREVIEW_OPERATION || value.status !== "PREVIEW" || value.requiresApproval !== true || value.noWrite !== true || value.noFoundryWrite !== true || value.role !== "background") throw new Error("Project asset binding preview must be a PREVIEW with approval required, no writes, and the background role.");
  const normalized = descriptorIdentity({
    projectId: stableId(value.projectId, "projectId"),
    currentGeneration: nonnegativeInteger(value.currentGeneration, "currentGeneration"),
    currentContentSha256: sha256Value(value.currentContentSha256, "currentContentSha256"),
    candidateDescriptorSha256: sha256Value(value.candidateDescriptorSha256, "candidateDescriptorSha256"),
    assetId: stableId(value.assetId, "assetId"),
    assetSha256: sha256Value(value.assetSha256, "assetSha256"),
    role: "background",
    sceneId: stableId(value.sceneId, "sceneId"),
    proposedSceneCount: nonnegativeInteger(value.proposedSceneCount, "proposedSceneCount"),
    proposedActiveSceneId: stableId(value.proposedActiveSceneId, "proposedActiveSceneId"),
    proposedAssetCount: nonnegativeInteger(value.proposedAssetCount, "proposedAssetCount"),
  });
  const previewSha256 = sha256Value(value.previewSha256, "previewSha256");
  return { ...normalized, status: "PREVIEW", previewSha256, requiresApproval: true, noWrite: true, noFoundryWrite: true } as ProjectAssetBindingPreview;
}

export async function createProjectAssetBindingProposalBatch(input: ProjectAssetBindingProposalInput): Promise<ProposalBatch> {
  const preview = validatePreview(input.preview);
  if (preview.previewSha256 !== await hashValue({
    operation: preview.operation,
    projectId: preview.projectId,
    currentGeneration: preview.currentGeneration,
    currentContentSha256: preview.currentContentSha256,
    candidateDescriptorSha256: preview.candidateDescriptorSha256,
    assetId: preview.assetId,
    assetSha256: preview.assetSha256,
    role: preview.role,
    sceneId: preview.sceneId,
    proposedSceneCount: preview.proposedSceneCount,
    proposedActiveSceneId: preview.proposedActiveSceneId,
    proposedAssetCount: preview.proposedAssetCount,
    requiresApproval: true,
    noWrite: true,
    noFoundryWrite: true,
  })) throw new Error("Project asset binding preview hash does not match its canonical contents.");
  const baseSha256 = await hashValue({ projectId: preview.projectId, generation: preview.currentGeneration, contentSha256: preview.currentContentSha256 });
  const localPart = input.batchId.split(":").at(-1) ?? "asset-bind";
  return createProposalBatch({
    schemaVersion: "0.1.0",
    batchId: input.batchId,
    revision: 0,
    previousBatchSha256: null,
    producer: { kind: "project-store", sourceId: "desktop.project.asset.bind", provider: null },
    reviewAuthority: { domain: "human-review", requiredRole: "reviewer" },
    targetAuthority: { domain: "local-project", requiredActiveGm: false },
    risk: "high",
    base: { targetId: preview.projectId, revision: preview.currentGeneration, sha256: baseSha256 },
    commands: [{
      commandId: `dbx:proposal-command:${localPart}-000`,
      kind: "project.asset.bind",
      dependsOn: [],
      payload: {
        operation: "project.asset.bind",
        projectId: preview.projectId,
        expectedGeneration: preview.currentGeneration,
        currentContentSha256: preview.currentContentSha256,
        candidateDescriptorSha256: preview.candidateDescriptorSha256,
        assetId: preview.assetId,
        assetSha256: preview.assetSha256,
        role: preview.role,
        sceneId: preview.sceneId,
        proposedSceneCount: preview.proposedSceneCount,
        proposedActiveSceneId: preview.proposedActiveSceneId,
        proposedAssetCount: preview.proposedAssetCount,
      },
    }],
    createdAt: input.createdAt,
  });
}

export async function hashProjectAssetBindingDescriptor(input: ProjectAssetBindingDescriptor): Promise<string> {
  return hashValue(input);
}

export function projectAssetInputFromCandidate(candidate: ProjectBackgroundAssetCandidate, descriptor: ProjectAssetBindingDescriptor): Readonly<{
  mediaType: "image/png";
  bytes: readonly number[];
  registration: Readonly<{ assetId: string; role: "background"; label: string; provenance: "user-import"; approval: "approved" }>;
}> {
  validateCandidate(candidate);
  return {
    mediaType: "image/png",
    bytes: [...candidate.bytes],
    registration: { assetId: descriptor.assetId, role: "background", label: candidate.label, provenance: candidate.provenance, approval: "approved" },
  };
}

export function sceneWithBackgroundAsset(scene: SceneDocument, assetId: string): SceneDocument {
  stableId(assetId, "assetId");
  return { ...scene, background: { ...scene.background, assetId } };
}

export function serializeProjectAssetBindingScenes(scenes: readonly SceneDocument[]): readonly string[] {
  return scenes.map(serializeSceneDocument);
}
