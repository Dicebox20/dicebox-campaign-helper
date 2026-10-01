import { createProposalBatch, type ProposalBatch, type ProposalBatchInput } from "@dicebox/core";
import { serializeSceneDocument, validateSceneDocument, type SceneDocument } from "@dicebox/scene";
import { displayNameFromInput, type StoredAsset } from "./project-store";

export const PROJECT_SAVE_AS_PREVIEW_OPERATION = "dicebox.project.save-as.preview" as const;

export type ProjectSaveAsPreview = Readonly<{
  operation: typeof PROJECT_SAVE_AS_PREVIEW_OPERATION;
  status: "PREVIEW";
  sourceProjectId: string;
  targetProjectId: string;
  sourceGeneration: number;
  sourceContentSha256: string;
  sourceAssetCount: number;
  sourceAssetCollectionSha256: string;
  workspaceIndexGeneration: number;
  sourceSceneIds: readonly string[];
  sourceScenesSha256: string;
  sourceActiveSceneId: string;
  sourceSceneCount: number;
  proposedDisplayName: string;
  targetAbsent: true;
  requiresApproval: true;
  noWrite: true;
  noFoundryWrite: true;
  previewSha256: string;
}>;

export type ProjectSaveAsProposalInput = Readonly<{ batchId: ProposalBatchInput["batchId"]; preview: unknown; createdAt: string }>;

const stableIdPattern = /^dbx:[a-z0-9][a-z0-9._-]*:[a-z0-9][a-z0-9._-]*$/;
const sceneIdPattern = /^dbx:scene:[a-z0-9][a-z0-9._-]*$/;
const sha256Pattern = /^[0-9a-f]{64}$/;

function record(value: unknown, label: string): Record<string, unknown> {
  if (value === null || typeof value !== "object" || Array.isArray(value)) throw new Error(`${label} must be an object.`);
  return value as Record<string, unknown>;
}

function text(value: unknown, label: string): string {
  if (typeof value !== "string" || value.length === 0 || value.trim() !== value) throw new Error(`${label} must be a non-empty trimmed string.`);
  return value;
}

function stableId(value: unknown, label: string): string {
  const parsed = text(value, label);
  if (!stableIdPattern.test(parsed)) throw new Error(`${label} must be a stable DiceBox ID.`);
  return parsed;
}

function sceneId(value: unknown, label: string): string {
  const parsed = stableId(value, label);
  if (!sceneIdPattern.test(parsed)) throw new Error(`${label} must be a stable Scene ID.`);
  return parsed;
}

function hashValue(value: unknown, label: string): string {
  const parsed = text(value, label);
  if (!sha256Pattern.test(parsed)) throw new Error(`${label} must be a lowercase SHA-256 value.`);
  return parsed;
}

function integer(value: unknown, label: string): number {
  if (!Number.isSafeInteger(value) || (value as number) < 0) throw new Error(`${label} must be a nonnegative safe integer.`);
  return value as number;
}

function ids(value: unknown, label: string): readonly string[] {
  if (!Array.isArray(value) || value.length === 0 || value.length > 256) throw new Error(`${label} must contain 1–256 Scene IDs.`);
  const parsed = value.map((entry, index) => sceneId(entry, `${label}[${index}]`));
  if (new Set(parsed).size !== parsed.length) throw new Error(`${label} must contain unique Scene IDs.`);
  return parsed;
}

function canonicalize(value: unknown): string {
  if (value === null || typeof value === "string" || typeof value === "boolean") return JSON.stringify(value);
  if (typeof value === "number") {
    if (!Number.isFinite(value)) throw new Error("Save-as values cannot contain non-finite numbers.");
    return JSON.stringify(value);
  }
  if (Array.isArray(value)) return `[${value.map(canonicalize).join(",")}]`;
  const object = record(value, "Save-as value");
  return `{${Object.keys(object).sort().map((key) => `${JSON.stringify(key)}:${canonicalize(object[key])}`).join(",")}}`;
}

async function sha256(value: unknown): Promise<string> {
  const digest = await globalThis.crypto.subtle.digest("SHA-256", new TextEncoder().encode(canonicalize(value)));
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

export async function hashProjectSaveAsAssetCollection(assets: readonly StoredAsset[]): Promise<string> {
  return sha256(assets.map((asset) => ({
    sha256: asset.sha256,
    mediaType: asset.mediaType,
    byteLength: asset.byteLength,
    relativePath: asset.relativePath,
    ...(asset.registration === undefined ? {} : { registration: asset.registration }),
  })));
}

async function scenesSha256(projectId: string, scenes: readonly SceneDocument[], activeSceneId: string): Promise<string> {
  if (scenes.length === 0 || scenes.length > 256 || !scenes.some((scene) => scene.id === activeSceneId) || new Set(scenes.map((scene) => scene.id)).size !== scenes.length) throw new Error("Save-as source requires an ordered unique Scene collection with an active Scene.");
  for (const [index, scene] of scenes.entries()) {
    const errors = validateSceneDocument(scene);
    if (errors.length > 0) throw new Error(`Save-as source contains an invalid Scene at index ${index}: ${errors.join("; ")}`);
    sceneId(scene.id, `scenes[${index}].id`);
  }
  return sha256({ activeSceneId: sceneId(activeSceneId, "activeSceneId"), projectId: stableId(projectId, "projectId"), scenes: scenes.map(serializeSceneDocument) });
}

type ProjectSaveAsPreviewIdentity = Readonly<Omit<ProjectSaveAsPreview, "status" | "targetAbsent" | "requiresApproval" | "noWrite" | "noFoundryWrite" | "previewSha256">>;

function identity(input: Readonly<Omit<ProjectSaveAsPreview, "operation" | "status" | "targetAbsent" | "requiresApproval" | "noWrite" | "noFoundryWrite" | "previewSha256">>): ProjectSaveAsPreviewIdentity {
  return {
    operation: PROJECT_SAVE_AS_PREVIEW_OPERATION,
    sourceProjectId: stableId(input.sourceProjectId, "sourceProjectId"),
    targetProjectId: stableId(input.targetProjectId, "targetProjectId"),
    sourceGeneration: integer(input.sourceGeneration, "sourceGeneration"),
    sourceContentSha256: hashValue(input.sourceContentSha256, "sourceContentSha256"),
    sourceAssetCount: integer(input.sourceAssetCount, "sourceAssetCount"),
    sourceAssetCollectionSha256: hashValue(input.sourceAssetCollectionSha256, "sourceAssetCollectionSha256"),
    workspaceIndexGeneration: integer(input.workspaceIndexGeneration, "workspaceIndexGeneration"),
    sourceSceneIds: ids(input.sourceSceneIds, "sourceSceneIds"),
    sourceScenesSha256: hashValue(input.sourceScenesSha256, "sourceScenesSha256"),
    sourceActiveSceneId: sceneId(input.sourceActiveSceneId, "sourceActiveSceneId"),
    sourceSceneCount: integer(input.sourceSceneCount, "sourceSceneCount"),
    proposedDisplayName: displayNameFromInput(text(input.proposedDisplayName, "proposedDisplayName")),
  };
}

const previewKeys = ["noFoundryWrite", "noWrite", "operation", "previewSha256", "proposedDisplayName", "requiresApproval", "sourceActiveSceneId", "sourceAssetCollectionSha256", "sourceAssetCount", "sourceContentSha256", "sourceGeneration", "sourceProjectId", "sourceSceneCount", "sourceSceneIds", "sourceScenesSha256", "status", "targetAbsent", "targetProjectId", "workspaceIndexGeneration"] as const;

function validatePreview(input: unknown): ProjectSaveAsPreview {
  const value = record(input, "Project save-as preview");
  if (Object.keys(value).sort().join("|") !== [...previewKeys].sort().join("|")) throw new Error("Project save-as preview contains unknown or missing fields.");
  if (value.operation !== PROJECT_SAVE_AS_PREVIEW_OPERATION || value.status !== "PREVIEW" || value.targetAbsent !== true || value.requiresApproval !== true || value.noWrite !== true || value.noFoundryWrite !== true) throw new Error("Project save-as preview must be approval-bound, target-absent, and no-write.");
  const normalized = identity({
    sourceProjectId: stableId(value.sourceProjectId, "sourceProjectId"),
    targetProjectId: stableId(value.targetProjectId, "targetProjectId"),
    sourceGeneration: integer(value.sourceGeneration, "sourceGeneration"),
    sourceContentSha256: hashValue(value.sourceContentSha256, "sourceContentSha256"),
    sourceAssetCount: integer(value.sourceAssetCount, "sourceAssetCount"),
    sourceAssetCollectionSha256: hashValue(value.sourceAssetCollectionSha256, "sourceAssetCollectionSha256"),
    workspaceIndexGeneration: integer(value.workspaceIndexGeneration, "workspaceIndexGeneration"),
    sourceSceneIds: ids(value.sourceSceneIds, "sourceSceneIds"),
    sourceScenesSha256: hashValue(value.sourceScenesSha256, "sourceScenesSha256"),
    sourceActiveSceneId: sceneId(value.sourceActiveSceneId, "sourceActiveSceneId"),
    sourceSceneCount: integer(value.sourceSceneCount, "sourceSceneCount"),
    proposedDisplayName: displayNameFromInput(text(value.proposedDisplayName, "proposedDisplayName")),
  });
  if (normalized.sourceProjectId === normalized.targetProjectId || normalized.sourceSceneIds.length !== normalized.sourceSceneCount || normalized.sourceSceneCount < 1 || normalized.sourceGeneration < 1) throw new Error("Project save-as preview must describe distinct source/target IDs and one existing source.");
  return { ...normalized, status: "PREVIEW", targetAbsent: true, requiresApproval: true, noWrite: true, noFoundryWrite: true, previewSha256: hashValue(value.previewSha256, "previewSha256") } as ProjectSaveAsPreview;
}

export async function createProjectSaveAsPreview(input: Readonly<{
  sourceProjectId: string;
  targetProjectId: string;
  sourceGeneration: number;
  sourceContentSha256: string;
  sourceAssetCount: number;
  sourceAssetCollectionSha256: string;
  workspaceIndexGeneration: number;
  scenes: readonly SceneDocument[];
  activeSceneId: string;
  proposedDisplayName: string;
}>): Promise<ProjectSaveAsPreview> {
  const normalized = identity({
    sourceProjectId: input.sourceProjectId,
    targetProjectId: input.targetProjectId,
    sourceGeneration: input.sourceGeneration,
    sourceContentSha256: input.sourceContentSha256,
    sourceAssetCount: input.sourceAssetCount,
    sourceAssetCollectionSha256: hashValue(input.sourceAssetCollectionSha256, "sourceAssetCollectionSha256"),
    workspaceIndexGeneration: input.workspaceIndexGeneration,
    sourceSceneIds: input.scenes.map((scene) => scene.id),
    sourceScenesSha256: await scenesSha256(input.sourceProjectId, input.scenes, input.activeSceneId),
    sourceActiveSceneId: input.activeSceneId,
    sourceSceneCount: input.scenes.length,
    proposedDisplayName: input.proposedDisplayName,
  });
  if (normalized.sourceProjectId === normalized.targetProjectId) throw new Error("Save-as source and target must be distinct.");
  return { ...normalized, status: "PREVIEW", targetAbsent: true, requiresApproval: true, noWrite: true, noFoundryWrite: true, previewSha256: await sha256({ ...normalized, targetAbsent: true, requiresApproval: true, noWrite: true, noFoundryWrite: true }) } as ProjectSaveAsPreview;
}

export async function createProjectSaveAsProposalBatch(input: ProjectSaveAsProposalInput): Promise<ProposalBatch> {
  const preview = validatePreview(input.preview);
  const expectedPreviewSha256 = await sha256({
    operation: preview.operation,
    sourceProjectId: preview.sourceProjectId,
    targetProjectId: preview.targetProjectId,
    sourceGeneration: preview.sourceGeneration,
    sourceContentSha256: preview.sourceContentSha256,
    sourceAssetCount: preview.sourceAssetCount,
    sourceAssetCollectionSha256: preview.sourceAssetCollectionSha256,
    workspaceIndexGeneration: preview.workspaceIndexGeneration,
    sourceSceneIds: preview.sourceSceneIds,
    sourceScenesSha256: preview.sourceScenesSha256,
    sourceActiveSceneId: preview.sourceActiveSceneId,
    sourceSceneCount: preview.sourceSceneCount,
    proposedDisplayName: preview.proposedDisplayName,
    targetAbsent: true,
    requiresApproval: true,
    noWrite: true,
    noFoundryWrite: true,
  });
  if (preview.previewSha256 !== expectedPreviewSha256) throw new Error("Project save-as preview hash does not match its canonical contents.");
  const baseSha256 = await sha256({ sourceContentSha256: preview.sourceContentSha256, sourceGeneration: preview.sourceGeneration, sourceProjectId: preview.sourceProjectId, targetProjectId: preview.targetProjectId, workspaceIndexGeneration: preview.workspaceIndexGeneration });
  const localPart = input.batchId.split(":").at(-1) ?? "project-save-as";
  return createProposalBatch({
    schemaVersion: "0.1.0",
    batchId: input.batchId,
    revision: 0,
    previousBatchSha256: null,
    producer: { kind: "project-store", sourceId: "desktop.project.save-as", provider: null },
    reviewAuthority: { domain: "human-review", requiredRole: "reviewer" },
    targetAuthority: { domain: "local-project", requiredActiveGm: false },
    risk: "high",
    base: { targetId: preview.sourceProjectId, revision: preview.sourceGeneration, sha256: baseSha256 },
    commands: [{
      commandId: `dbx:proposal-command:${localPart}-000`,
      kind: "project.save-as",
      dependsOn: [],
      payload: {
        operation: "project.save-as",
        sourceProjectId: preview.sourceProjectId,
        targetProjectId: preview.targetProjectId,
        sourceGeneration: preview.sourceGeneration,
        sourceContentSha256: preview.sourceContentSha256,
        sourceAssetCount: preview.sourceAssetCount,
        sourceAssetCollectionSha256: preview.sourceAssetCollectionSha256,
        workspaceIndexGeneration: preview.workspaceIndexGeneration,
        sourceSceneIds: preview.sourceSceneIds,
        sourceScenesSha256: preview.sourceScenesSha256,
        sourceActiveSceneId: preview.sourceActiveSceneId,
        sourceSceneCount: preview.sourceSceneCount,
        proposedDisplayName: preview.proposedDisplayName,
        targetAbsent: true,
        previewSha256: preview.previewSha256,
      },
    }],
    createdAt: input.createdAt,
  });
}
