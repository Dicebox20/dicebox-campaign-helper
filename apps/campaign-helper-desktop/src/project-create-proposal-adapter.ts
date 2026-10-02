import { createProposalBatch, type ProposalBatch, type ProposalBatchInput } from "@dicebox/core";
import { serializeSceneDocument, validateSceneDocument, type SceneDocument } from "@dicebox/scene";
import { displayNameFromInput } from "./project-store";

export const PROJECT_CREATE_PREVIEW_OPERATION = "dicebox.project.create.preview" as const;

export type ProjectCreatePreview = Readonly<{
  operation: typeof PROJECT_CREATE_PREVIEW_OPERATION;
  status: "PREVIEW";
  targetProjectId: string;
  workspaceIndexGeneration: number;
  sceneIds: readonly string[];
  scenesSha256: string;
  activeSceneId: string;
  sceneCount: number;
  proposedDisplayName: string;
  targetAbsent: true;
  requiresApproval: true;
  noWrite: true;
  noFoundryWrite: true;
  previewSha256: string;
}>;

export type ProjectCreateProposalInput = Readonly<{ batchId: ProposalBatchInput["batchId"]; preview: unknown; createdAt: string }>;

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
    if (!Number.isFinite(value)) throw new Error("Project create values cannot contain non-finite numbers.");
    return JSON.stringify(value);
  }
  if (Array.isArray(value)) return `[${value.map(canonicalize).join(",")}]`;
  const object = record(value, "Project create value");
  return `{${Object.keys(object).sort().map((key) => `${JSON.stringify(key)}:${canonicalize(object[key])}`).join(",")}}`;
}

async function sha256(value: unknown): Promise<string> {
  const digest = await globalThis.crypto.subtle.digest("SHA-256", new TextEncoder().encode(canonicalize(value)));
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function scenesSha256(projectId: string, scenes: readonly SceneDocument[], activeSceneId: string): Promise<string> {
  if (scenes.length === 0 || scenes.length > 256 || !scenes.some((scene) => scene.id === activeSceneId) || new Set(scenes.map((scene) => scene.id)).size !== scenes.length) throw new Error("Project create requires an ordered unique Scene collection with an active Scene.");
  for (const [index, scene] of scenes.entries()) {
    const errors = validateSceneDocument(scene);
    if (errors.length > 0) throw new Error(`Project create contains an invalid Scene at index ${index}: ${errors.join("; ")}`);
    sceneId(scene.id, `scenes[${index}].id`);
  }
  return sha256({ activeSceneId: sceneId(activeSceneId, "activeSceneId"), projectId: stableId(projectId, "projectId"), scenes: scenes.map(serializeSceneDocument) });
}

type ProjectCreatePreviewIdentity = Readonly<Omit<ProjectCreatePreview, "status" | "targetAbsent" | "requiresApproval" | "noWrite" | "noFoundryWrite" | "previewSha256">>;

function identity(input: Readonly<Omit<ProjectCreatePreview, "operation" | "status" | "targetAbsent" | "requiresApproval" | "noWrite" | "noFoundryWrite" | "previewSha256">>): ProjectCreatePreviewIdentity {
  return {
    operation: PROJECT_CREATE_PREVIEW_OPERATION,
    targetProjectId: stableId(input.targetProjectId, "targetProjectId"),
    workspaceIndexGeneration: integer(input.workspaceIndexGeneration, "workspaceIndexGeneration"),
    sceneIds: ids(input.sceneIds, "sceneIds"),
    scenesSha256: hashValue(input.scenesSha256, "scenesSha256"),
    activeSceneId: sceneId(input.activeSceneId, "activeSceneId"),
    sceneCount: integer(input.sceneCount, "sceneCount"),
    proposedDisplayName: displayNameFromInput(text(input.proposedDisplayName, "proposedDisplayName")),
  };
}

const previewKeys = ["activeSceneId", "noFoundryWrite", "noWrite", "operation", "previewSha256", "proposedDisplayName", "requiresApproval", "sceneCount", "sceneIds", "scenesSha256", "status", "targetAbsent", "targetProjectId", "workspaceIndexGeneration"] as const;

function validatePreview(input: unknown): ProjectCreatePreview {
  const value = record(input, "Project create preview");
  if (Object.keys(value).sort().join("|") !== [...previewKeys].sort().join("|")) throw new Error("Project create preview contains unknown or missing fields.");
  if (value.operation !== PROJECT_CREATE_PREVIEW_OPERATION || value.status !== "PREVIEW" || value.targetAbsent !== true || value.requiresApproval !== true || value.noWrite !== true || value.noFoundryWrite !== true) throw new Error("Project create preview must be approval-bound, target-absent, and no-write.");
  const normalized = identity({
    targetProjectId: stableId(value.targetProjectId, "targetProjectId"),
    workspaceIndexGeneration: integer(value.workspaceIndexGeneration, "workspaceIndexGeneration"),
    sceneIds: ids(value.sceneIds, "sceneIds"),
    scenesSha256: hashValue(value.scenesSha256, "scenesSha256"),
    activeSceneId: sceneId(value.activeSceneId, "activeSceneId"),
    sceneCount: integer(value.sceneCount, "sceneCount"),
    proposedDisplayName: displayNameFromInput(text(value.proposedDisplayName, "proposedDisplayName")),
  });
  if (!normalized.sceneIds.includes(normalized.activeSceneId) || normalized.sceneIds.length !== normalized.sceneCount || normalized.sceneCount < 1) throw new Error("Project create preview must describe one existing ordered Scene collection and its active Scene.");
  return { ...normalized, status: "PREVIEW", targetAbsent: true, requiresApproval: true, noWrite: true, noFoundryWrite: true, previewSha256: hashValue(value.previewSha256, "previewSha256") } as ProjectCreatePreview;
}

export async function createProjectCreatePreview(input: Readonly<{
  targetProjectId: string;
  workspaceIndexGeneration: number;
  scenes: readonly SceneDocument[];
  activeSceneId: string;
  proposedDisplayName: string;
}>): Promise<ProjectCreatePreview> {
  const normalized = identity({
    targetProjectId: input.targetProjectId,
    workspaceIndexGeneration: input.workspaceIndexGeneration,
    sceneIds: input.scenes.map((scene) => scene.id),
    scenesSha256: await scenesSha256(input.targetProjectId, input.scenes, input.activeSceneId),
    activeSceneId: input.activeSceneId,
    sceneCount: input.scenes.length,
    proposedDisplayName: input.proposedDisplayName,
  });
  return { ...normalized, status: "PREVIEW", targetAbsent: true, requiresApproval: true, noWrite: true, noFoundryWrite: true, previewSha256: await sha256({ ...normalized, targetAbsent: true, requiresApproval: true, noWrite: true, noFoundryWrite: true }) } as ProjectCreatePreview;
}

export async function createProjectCreateProposalBatch(input: ProjectCreateProposalInput): Promise<ProposalBatch> {
  const preview = validatePreview(input.preview);
  const expectedPreviewSha256 = await sha256({
    operation: preview.operation,
    targetProjectId: preview.targetProjectId,
    workspaceIndexGeneration: preview.workspaceIndexGeneration,
    sceneIds: preview.sceneIds,
    scenesSha256: preview.scenesSha256,
    activeSceneId: preview.activeSceneId,
    sceneCount: preview.sceneCount,
    proposedDisplayName: preview.proposedDisplayName,
    targetAbsent: true,
    requiresApproval: true,
    noWrite: true,
    noFoundryWrite: true,
  });
  if (preview.previewSha256 !== expectedPreviewSha256) throw new Error("Project create preview hash does not match its canonical contents.");
  const baseSha256 = await sha256({ targetProjectId: preview.targetProjectId, workspaceIndexGeneration: preview.workspaceIndexGeneration, sceneIds: preview.sceneIds, scenesSha256: preview.scenesSha256, activeSceneId: preview.activeSceneId, sceneCount: preview.sceneCount });
  const localPart = input.batchId.split(":").at(-1) ?? "project-create";
  return createProposalBatch({
    schemaVersion: "0.1.0",
    batchId: input.batchId,
    revision: 0,
    previousBatchSha256: null,
    producer: { kind: "project-store", sourceId: "desktop.project.create", provider: null },
    reviewAuthority: { domain: "human-review", requiredRole: "reviewer" },
    targetAuthority: { domain: "local-project", requiredActiveGm: false },
    risk: "high",
    base: { targetId: preview.targetProjectId, revision: 0, sha256: baseSha256 },
    commands: [{
      commandId: `dbx:proposal-command:${localPart}-000`,
      kind: "project.create",
      dependsOn: [],
      payload: {
        operation: "project.create",
        targetProjectId: preview.targetProjectId,
        workspaceIndexGeneration: preview.workspaceIndexGeneration,
        sceneIds: preview.sceneIds,
        scenesSha256: preview.scenesSha256,
        activeSceneId: preview.activeSceneId,
        sceneCount: preview.sceneCount,
        proposedDisplayName: preview.proposedDisplayName,
        targetAbsent: true,
        previewSha256: preview.previewSha256,
      },
    }],
    createdAt: input.createdAt,
  });
}
