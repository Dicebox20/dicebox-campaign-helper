import { createProposalBatch, type ProposalBatch, type ProposalBatchInput } from "@dicebox/core";
import { serializeSceneDocument, validateSceneDocument, type SceneDocument } from "@dicebox/scene";

export const PROJECT_SAVE_PREVIEW_OPERATION = "dicebox.project.save.preview" as const;

export type ProjectSaveAssetInput = Readonly<{
  mediaType: string;
  bytes: readonly number[];
  registration?: Readonly<{
    assetId: string;
    role: "background" | "handout" | "audio" | "token";
    label: string;
    provenance: string;
    approval: "approved";
  }>;
}>;

export type ProjectSaveContent = Readonly<{
  scenes: readonly SceneDocument[];
  activeSceneId: string;
  assets: readonly ProjectSaveAssetInput[];
}>;

export type ProjectSavePreview = Readonly<{
  operation: typeof PROJECT_SAVE_PREVIEW_OPERATION;
  status: "PREVIEW";
  projectId: string;
  currentGeneration: number;
  currentContentSha256: string;
  contentDescriptorSha256: string;
  proposedSceneCount: number;
  proposedActiveSceneId: string;
  proposedAssetCount: number;
  requiresApproval: true;
  noWrite: true;
  noFoundryWrite: true;
  previewSha256: string;
}>;

export type ProjectSaveProposalInput = Readonly<{
  batchId: ProposalBatchInput["batchId"];
  preview: unknown;
  createdAt: string;
}>;

const stableIdPattern = /^dbx:[a-z0-9][a-z0-9._-]*:[a-z0-9][a-z0-9._-]*$/;
const sha256Pattern = /^[0-9a-f]{64}$/;

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
    if (!Number.isFinite(value)) throw new Error("Project save content cannot contain a non-finite number.");
    return JSON.stringify(value);
  }
  if (Array.isArray(value)) return `[${value.map(canonicalize).join(",")}]`;
  const object = record(value, "Project save value");
  return `{${Object.keys(object).sort().map((key) => `${JSON.stringify(key)}:${canonicalize(object[key])}`).join(",")}}`;
}

async function sha256(value: unknown): Promise<string> {
  const digest = await globalThis.crypto.subtle.digest("SHA-256", new TextEncoder().encode(canonicalize(value)));
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

function validateContent(content: ProjectSaveContent): ProjectSaveContent {
  if (content.scenes.length === 0 || content.scenes.length > 256) throw new Error("Project save content requires 1–256 Scenes.");
  if (!content.scenes.some((scene) => scene.id === content.activeSceneId)) throw new Error("Project save content active Scene must identify one supplied Scene.");
  if (new Set(content.scenes.map((scene) => scene.id)).size !== content.scenes.length) throw new Error("Project save content Scene IDs must be unique.");
  for (const scene of content.scenes) {
    const errors = validateSceneDocument(scene);
    if (errors.length > 0) throw new Error(`Project save content contains an invalid Scene: ${errors.join("; ")}`);
  }
  for (const asset of content.assets) {
    if (asset.bytes.length === 0 || asset.bytes.length > 32 * 1024 * 1024 || asset.bytes.some((byte) => !Number.isInteger(byte) || byte < 0 || byte > 255)) {
      throw new Error("Project save content assets must contain 1 byte through 32 MiB of byte values.");
    }
  }
  return content;
}

export async function hashProjectSaveContent(content: ProjectSaveContent): Promise<string> {
  const validated = validateContent(content);
  return sha256({
    activeSceneId: validated.activeSceneId,
    assets: validated.assets.map((asset) => ({
      ...(asset.registration === undefined ? {} : { registration: asset.registration }),
      bytes: [...asset.bytes],
      mediaType: asset.mediaType,
    })),
    scenes: validated.scenes.map(serializeSceneDocument),
  });
}

function previewIdentity(input: Omit<ProjectSavePreview, "operation" | "status" | "requiresApproval" | "noWrite" | "noFoundryWrite" | "previewSha256">): Record<string, unknown> {
  return {
    operation: PROJECT_SAVE_PREVIEW_OPERATION,
    projectId: stableId(input.projectId, "projectId"),
    currentGeneration: nonnegativeInteger(input.currentGeneration, "currentGeneration"),
    currentContentSha256: sha256Value(input.currentContentSha256, "currentContentSha256"),
    contentDescriptorSha256: sha256Value(input.contentDescriptorSha256, "contentDescriptorSha256"),
    proposedSceneCount: nonnegativeInteger(input.proposedSceneCount, "proposedSceneCount"),
    proposedActiveSceneId: stableId(input.proposedActiveSceneId, "proposedActiveSceneId"),
    proposedAssetCount: nonnegativeInteger(input.proposedAssetCount, "proposedAssetCount"),
    requiresApproval: true,
    noWrite: true,
    noFoundryWrite: true,
  };
}

export async function createProjectSavePreview(input: Readonly<{
  projectId: string;
  currentGeneration: number;
  currentContentSha256: string;
  contentDescriptorSha256: string;
  proposedSceneCount: number;
  proposedActiveSceneId: string;
  proposedAssetCount: number;
}>): Promise<ProjectSavePreview> {
  const identity = previewIdentity(input);
  const previewSha256 = await sha256(identity);
  return { ...identity, status: "PREVIEW", previewSha256, requiresApproval: true, noWrite: true, noFoundryWrite: true } as ProjectSavePreview;
}

function validatePreview(input: unknown): ProjectSavePreview {
  const value = record(input, "Project save preview");
  assertExactKeys(value, ["contentDescriptorSha256", "currentContentSha256", "currentGeneration", "noFoundryWrite", "noWrite", "operation", "previewSha256", "projectId", "proposedActiveSceneId", "proposedAssetCount", "proposedSceneCount", "requiresApproval", "status"], "Project save preview");
  if (value.operation !== PROJECT_SAVE_PREVIEW_OPERATION || value.status !== "PREVIEW" || value.requiresApproval !== true || value.noWrite !== true || value.noFoundryWrite !== true) throw new Error("Project save preview must be a PREVIEW with approval required and no writes.");
  const normalized = previewIdentity({
    projectId: stableId(value.projectId, "projectId"),
    currentGeneration: nonnegativeInteger(value.currentGeneration, "currentGeneration"),
    currentContentSha256: sha256Value(value.currentContentSha256, "currentContentSha256"),
    contentDescriptorSha256: sha256Value(value.contentDescriptorSha256, "contentDescriptorSha256"),
    proposedSceneCount: nonnegativeInteger(value.proposedSceneCount, "proposedSceneCount"),
    proposedActiveSceneId: stableId(value.proposedActiveSceneId, "proposedActiveSceneId"),
    proposedAssetCount: nonnegativeInteger(value.proposedAssetCount, "proposedAssetCount"),
  });
  const previewSha256 = sha256Value(value.previewSha256, "previewSha256");
  return { ...normalized, status: "PREVIEW", previewSha256, requiresApproval: true, noWrite: true, noFoundryWrite: true } as ProjectSavePreview;
}

export async function createProjectSaveProposalBatch(input: ProjectSaveProposalInput): Promise<ProposalBatch> {
  const preview = validatePreview(input.preview);
  if (preview.previewSha256 !== await sha256({
    operation: preview.operation,
    projectId: preview.projectId,
    currentGeneration: preview.currentGeneration,
    currentContentSha256: preview.currentContentSha256,
    contentDescriptorSha256: preview.contentDescriptorSha256,
    proposedSceneCount: preview.proposedSceneCount,
    proposedActiveSceneId: preview.proposedActiveSceneId,
    proposedAssetCount: preview.proposedAssetCount,
    requiresApproval: true,
    noWrite: true,
    noFoundryWrite: true,
  })) throw new Error("Project save preview hash does not match its canonical contents.");
  const baseSha256 = await sha256({ projectId: preview.projectId, generation: preview.currentGeneration, contentSha256: preview.currentContentSha256 });
  const localPart = input.batchId.split(":").at(-1) ?? "project-save";
  return createProposalBatch({
    schemaVersion: "0.1.0",
    batchId: input.batchId,
    revision: 0,
    previousBatchSha256: null,
    producer: { kind: "project-store", sourceId: "desktop.project.save", provider: null },
    reviewAuthority: { domain: "human-review", requiredRole: "reviewer" },
    targetAuthority: { domain: "local-project", requiredActiveGm: false },
    risk: "high",
    base: { targetId: preview.projectId, revision: preview.currentGeneration, sha256: baseSha256 },
    commands: [{
      commandId: `dbx:proposal-command:${localPart}-000`,
      kind: "project.save",
      dependsOn: [],
      payload: {
        operation: "project.save",
        projectId: preview.projectId,
        expectedGeneration: preview.currentGeneration,
        currentContentSha256: preview.currentContentSha256,
        contentDescriptorSha256: preview.contentDescriptorSha256,
        proposedSceneCount: preview.proposedSceneCount,
        proposedActiveSceneId: preview.proposedActiveSceneId,
        proposedAssetCount: preview.proposedAssetCount,
      },
    }],
    createdAt: input.createdAt,
  });
}
