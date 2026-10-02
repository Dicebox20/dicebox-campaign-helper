import { createProposalBatch, type ProposalBatch, type ProposalBatchInput } from "@dicebox/core";
import { validateSceneDocument, type SceneDocument } from "@dicebox/scene";

export const PROJECT_HANDOUT_ASSET_REGISTER_PREVIEW_OPERATION = "dicebox.project.asset.register-handout.preview" as const;

export type ProjectHandoutAssetCandidate = Readonly<{
  mediaType: "image/png" | "image/webp";
  bytes: readonly number[];
  label: string;
  provenance: "user-import";
}>;

export type ProjectHandoutAssetContent = Readonly<{
  scenes: readonly SceneDocument[];
  activeSceneId: string;
  candidate: ProjectHandoutAssetCandidate;
}>;

export type ProjectHandoutAssetDescriptor = Readonly<{
  assetId: string;
  assetSha256: string;
  mediaType: "image/png" | "image/webp";
  role: "handout";
  label: string;
  provenance: "user-import";
}>;

export type ProjectHandoutAssetRegistrationPreview = Readonly<{
  operation: typeof PROJECT_HANDOUT_ASSET_REGISTER_PREVIEW_OPERATION;
  status: "PREVIEW";
  projectId: string;
  currentGeneration: number;
  currentContentSha256: string;
  candidateDescriptorSha256: string;
  assetId: string;
  assetSha256: string;
  role: "handout";
  proposedSceneCount: number;
  proposedActiveSceneId: string;
  proposedAssetCount: number;
  requiresApproval: true;
  noWrite: true;
  noFoundryWrite: true;
  previewSha256: string;
}>;

export type ProjectHandoutAssetRegistrationProposalInput = Readonly<{
  batchId: ProposalBatchInput["batchId"];
  preview: unknown;
  createdAt: string;
}>;

const stableIdPattern = /^dbx:[a-z0-9][a-z0-9._-]*:[a-z0-9][a-z0-9._-]*$/;
const sha256Pattern = /^[0-9a-f]{64}$/;
const pngSignature = [137, 80, 78, 71, 13, 10, 26, 10] as const;
const webpSignature = [82, 73, 70, 70, undefined, undefined, undefined, undefined, 87, 69, 66, 80] as const;

function record(value: unknown, label: string): Record<string, unknown> {
  if (value === null || typeof value !== "object" || Array.isArray(value)) throw new Error(`${label} must be an object.`);
  return value as Record<string, unknown>;
}

function assertExactKeys(value: Record<string, unknown>, expected: readonly string[], label: string): void {
  if (Object.keys(value).sort().join("|") !== [...expected].sort().join("|")) throw new Error(`${label} contains unknown or missing fields.`);
}

function stableId(value: unknown, label: string): string {
  if (typeof value !== "string" || value.trim() !== value || !stableIdPattern.test(value)) throw new Error(`${label} must be a stable DiceBox ID.`);
  return value;
}

function sha256Value(value: unknown, label: string): string {
  if (typeof value !== "string" || value.trim() !== value || !sha256Pattern.test(value)) throw new Error(`${label} must be a lowercase SHA-256 value.`);
  return value;
}

function nonnegativeInteger(value: unknown, label: string): number {
  if (!Number.isSafeInteger(value) || (value as number) < 0) throw new Error(`${label} must be a nonnegative safe integer.`);
  return value as number;
}

function canonicalize(value: unknown): string {
  if (value === null || typeof value === "string" || typeof value === "boolean") return JSON.stringify(value);
  if (typeof value === "number") {
    if (!Number.isFinite(value)) throw new Error("Handout asset value cannot contain a non-finite number.");
    return JSON.stringify(value);
  }
  if (Array.isArray(value)) return `[${value.map(canonicalize).join(",")}]`;
  const object = record(value, "Handout asset value");
  return `{${Object.keys(object).sort().map((key) => `${JSON.stringify(key)}:${canonicalize(object[key])}`).join(",")}}`;
}

async function hashValue(value: unknown): Promise<string> {
  const digest = await globalThis.crypto.subtle.digest("SHA-256", new TextEncoder().encode(canonicalize(value)));
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function hashBytes(bytes: readonly number[]): Promise<string> {
  const digest = await globalThis.crypto.subtle.digest("SHA-256", Uint8Array.from(bytes).buffer);
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

function validateCandidate(candidate: ProjectHandoutAssetCandidate): void {
  if (candidate.mediaType !== "image/png" && candidate.mediaType !== "image/webp") throw new Error("Handout candidates must be PNG or WebP images.");
  if (!candidate.label || candidate.label.trim() !== candidate.label || [...candidate.label].length > 100 || [...candidate.label].some((character) => /[\u0000-\u001f\u007f]/u.test(character))) {
    throw new Error("Handout asset label must be 1–100 trimmed non-control characters.");
  }
  if (candidate.provenance !== "user-import") throw new Error("M345 accepts user-import handout provenance only.");
  if (candidate.bytes.length === 0 || candidate.bytes.length > 32 * 1024 * 1024 || candidate.bytes.some((byte) => !Number.isInteger(byte) || byte < 0 || byte > 255)) {
    throw new Error("Handout asset bytes must contain 1 byte through 32 MiB of byte values.");
  }
  const isPng = pngSignature.every((byte, index) => candidate.bytes[index] === byte);
  const isWebp = webpSignature.every((byte, index) => byte === undefined || candidate.bytes[index] === byte);
  if ((candidate.mediaType === "image/png" && !isPng) || (candidate.mediaType === "image/webp" && !isWebp)) throw new Error("Handout asset signature does not match its PNG or WebP media type.");
}

export async function deriveProjectHandoutAssetDescriptor(input: ProjectHandoutAssetCandidate): Promise<ProjectHandoutAssetDescriptor> {
  validateCandidate(input);
  const assetSha256 = await hashBytes(input.bytes);
  return {
    assetId: `dbx:asset:sha256-${assetSha256}`,
    assetSha256,
    mediaType: input.mediaType,
    role: "handout",
    label: input.label,
    provenance: input.provenance,
  };
}

export function validateProjectHandoutAssetContent(content: ProjectHandoutAssetContent): ProjectHandoutAssetContent {
  stableId(content.activeSceneId, "activeSceneId");
  if (content.scenes.length === 0 || content.scenes.length > 256) throw new Error("Handout asset content requires 1–256 Scenes.");
  if (!content.scenes.some((scene) => scene.id === content.activeSceneId)) throw new Error("Handout asset active Scene must identify one supplied Scene.");
  if (new Set(content.scenes.map((scene) => scene.id)).size !== content.scenes.length) throw new Error("Handout asset Scene IDs must be unique.");
  for (const scene of content.scenes) {
    const errors = validateSceneDocument(scene);
    if (errors.length > 0) throw new Error(`Handout asset content contains an invalid Scene: ${errors.join("; ")}`);
  }
  validateCandidate(content.candidate);
  return content;
}

function previewIdentity(input: Omit<ProjectHandoutAssetRegistrationPreview, "operation" | "status" | "requiresApproval" | "noWrite" | "noFoundryWrite" | "previewSha256">): Record<string, unknown> {
  return {
    operation: PROJECT_HANDOUT_ASSET_REGISTER_PREVIEW_OPERATION,
    projectId: stableId(input.projectId, "projectId"),
    currentGeneration: nonnegativeInteger(input.currentGeneration, "currentGeneration"),
    currentContentSha256: sha256Value(input.currentContentSha256, "currentContentSha256"),
    candidateDescriptorSha256: sha256Value(input.candidateDescriptorSha256, "candidateDescriptorSha256"),
    assetId: stableId(input.assetId, "assetId"),
    assetSha256: sha256Value(input.assetSha256, "assetSha256"),
    role: "handout",
    proposedSceneCount: nonnegativeInteger(input.proposedSceneCount, "proposedSceneCount"),
    proposedActiveSceneId: stableId(input.proposedActiveSceneId, "proposedActiveSceneId"),
    proposedAssetCount: nonnegativeInteger(input.proposedAssetCount, "proposedAssetCount"),
    requiresApproval: true,
    noWrite: true,
    noFoundryWrite: true,
  };
}

export async function createProjectHandoutAssetRegistrationPreview(input: Readonly<{
  projectId: string;
  currentGeneration: number;
  currentContentSha256: string;
  candidate: ProjectHandoutAssetCandidate;
  proposedSceneCount: number;
  proposedActiveSceneId: string;
  proposedAssetCount: number;
}>): Promise<ProjectHandoutAssetRegistrationPreview> {
  const descriptor = await deriveProjectHandoutAssetDescriptor(input.candidate);
  const candidateDescriptorSha256 = await hashValue(descriptor);
  const identity = previewIdentity({
    projectId: input.projectId,
    currentGeneration: input.currentGeneration,
    currentContentSha256: input.currentContentSha256,
    candidateDescriptorSha256,
    assetId: descriptor.assetId,
    assetSha256: descriptor.assetSha256,
    role: "handout",
    proposedSceneCount: input.proposedSceneCount,
    proposedActiveSceneId: input.proposedActiveSceneId,
    proposedAssetCount: input.proposedAssetCount,
  });
  return { ...identity, status: "PREVIEW", previewSha256: await hashValue(identity), requiresApproval: true, noWrite: true, noFoundryWrite: true } as ProjectHandoutAssetRegistrationPreview;
}

function validatePreview(input: unknown): ProjectHandoutAssetRegistrationPreview {
  const value = record(input, "Project handout asset registration preview");
  assertExactKeys(value, ["assetId", "assetSha256", "candidateDescriptorSha256", "currentContentSha256", "currentGeneration", "noFoundryWrite", "noWrite", "operation", "previewSha256", "projectId", "proposedActiveSceneId", "proposedAssetCount", "proposedSceneCount", "requiresApproval", "role", "status"], "Project handout asset registration preview");
  if (value.operation !== PROJECT_HANDOUT_ASSET_REGISTER_PREVIEW_OPERATION || value.status !== "PREVIEW" || value.requiresApproval !== true || value.noWrite !== true || value.noFoundryWrite !== true || value.role !== "handout") throw new Error("Project handout asset registration preview must be a PREVIEW with approval required, no writes, and the handout role.");
  const normalized = previewIdentity({
    projectId: stableId(value.projectId, "projectId"),
    currentGeneration: nonnegativeInteger(value.currentGeneration, "currentGeneration"),
    currentContentSha256: sha256Value(value.currentContentSha256, "currentContentSha256"),
    candidateDescriptorSha256: sha256Value(value.candidateDescriptorSha256, "candidateDescriptorSha256"),
    assetId: stableId(value.assetId, "assetId"),
    assetSha256: sha256Value(value.assetSha256, "assetSha256"),
    role: "handout",
    proposedSceneCount: nonnegativeInteger(value.proposedSceneCount, "proposedSceneCount"),
    proposedActiveSceneId: stableId(value.proposedActiveSceneId, "proposedActiveSceneId"),
    proposedAssetCount: nonnegativeInteger(value.proposedAssetCount, "proposedAssetCount"),
  });
  return { ...normalized, status: "PREVIEW", previewSha256: sha256Value(value.previewSha256, "previewSha256"), requiresApproval: true, noWrite: true, noFoundryWrite: true } as ProjectHandoutAssetRegistrationPreview;
}

export async function createProjectHandoutAssetRegistrationProposalBatch(input: ProjectHandoutAssetRegistrationProposalInput): Promise<ProposalBatch> {
  const preview = validatePreview(input.preview);
  const identity = {
    operation: preview.operation,
    projectId: preview.projectId,
    currentGeneration: preview.currentGeneration,
    currentContentSha256: preview.currentContentSha256,
    candidateDescriptorSha256: preview.candidateDescriptorSha256,
    assetId: preview.assetId,
    assetSha256: preview.assetSha256,
    role: preview.role,
    proposedSceneCount: preview.proposedSceneCount,
    proposedActiveSceneId: preview.proposedActiveSceneId,
    proposedAssetCount: preview.proposedAssetCount,
    requiresApproval: true,
    noWrite: true,
    noFoundryWrite: true,
  };
  if (preview.previewSha256 !== await hashValue(identity)) throw new Error("Project handout asset registration preview hash does not match its canonical contents.");
  const baseSha256 = await hashValue({ projectId: preview.projectId, generation: preview.currentGeneration, contentSha256: preview.currentContentSha256 });
  const localPart = input.batchId.split(":").at(-1) ?? "handout-register";
  return createProposalBatch({
    schemaVersion: "0.1.0",
    batchId: input.batchId,
    revision: 0,
    previousBatchSha256: null,
    producer: { kind: "project-store", sourceId: "desktop.project.asset.register-handout", provider: null },
    reviewAuthority: { domain: "human-review", requiredRole: "reviewer" },
    targetAuthority: { domain: "local-project", requiredActiveGm: false },
    risk: "high",
    base: { targetId: preview.projectId, revision: preview.currentGeneration, sha256: baseSha256 },
    commands: [{
      commandId: `dbx:proposal-command:${localPart}-000`,
      kind: "project.asset.register-handout",
      dependsOn: [],
      payload: {
        operation: "project.asset.register-handout",
        projectId: preview.projectId,
        expectedGeneration: preview.currentGeneration,
        currentContentSha256: preview.currentContentSha256,
        candidateDescriptorSha256: preview.candidateDescriptorSha256,
        assetId: preview.assetId,
        assetSha256: preview.assetSha256,
        role: preview.role,
        proposedSceneCount: preview.proposedSceneCount,
        proposedActiveSceneId: preview.proposedActiveSceneId,
        proposedAssetCount: preview.proposedAssetCount,
      },
    }],
    createdAt: input.createdAt,
  });
}

export async function hashProjectHandoutAssetDescriptor(input: ProjectHandoutAssetDescriptor): Promise<string> {
  return hashValue(input);
}

export function projectHandoutAssetInputFromCandidate(candidate: ProjectHandoutAssetCandidate, descriptor: ProjectHandoutAssetDescriptor): Readonly<{
  mediaType: "image/png" | "image/webp";
  bytes: readonly number[];
  registration: Readonly<{ assetId: string; role: "handout"; label: string; provenance: "user-import"; approval: "approved" }>;
}> {
  validateCandidate(candidate);
  if (descriptor.assetId !== `dbx:asset:sha256-${descriptor.assetSha256}` || descriptor.role !== "handout" || descriptor.mediaType !== candidate.mediaType || descriptor.label !== candidate.label || descriptor.provenance !== candidate.provenance) throw new Error("Handout asset descriptor does not match the exact candidate.");
  return {
    mediaType: candidate.mediaType,
    bytes: [...candidate.bytes],
    registration: { assetId: descriptor.assetId, role: "handout", label: candidate.label, provenance: candidate.provenance, approval: "approved" },
  };
}
