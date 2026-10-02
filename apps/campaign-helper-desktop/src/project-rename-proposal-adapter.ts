import { createProposalBatch, type ProposalBatch, type ProposalBatchInput } from "@dicebox/core";

type JsonRecord = Record<string, unknown>;

export const PROJECT_RENAME_PREVIEW_OPERATION = "dicebox.project.rename.preview" as const;

export type ProjectRenamePreview = Readonly<{
  operation: typeof PROJECT_RENAME_PREVIEW_OPERATION;
  status: "PREVIEW";
  projectId: string;
  workspaceIndexGeneration: number;
  currentDisplayName: string;
  proposedDisplayName: string;
  contentSha256: string;
  previewSha256: string;
  requiresApproval: true;
  noWrite: true;
  noFoundryWrite: true;
}>;

export type ProjectRenamePreviewInput = Readonly<{
  projectId: string;
  workspaceIndexGeneration: number;
  currentDisplayName: string;
  proposedDisplayName: string;
  contentSha256: string;
}>;

export type ProjectRenameProposalInput = Readonly<{
  batchId: ProposalBatchInput["batchId"];
  preview: unknown;
  createdAt: string;
}>;

const stableIdPattern = /^dbx:[a-z0-9][a-z0-9._-]*:[a-z0-9][a-z0-9._-]*$/;
const sha256Pattern = /^[0-9a-f]{64}$/;
const previewKeys = [
  "contentSha256", "currentDisplayName", "noFoundryWrite", "noWrite", "operation", "previewSha256",
  "projectId", "proposedDisplayName", "requiresApproval", "status", "workspaceIndexGeneration",
] as const;

function record(value: unknown, label: string): JsonRecord {
  if (value === null || typeof value !== "object" || Array.isArray(value)) throw new Error(`${label} must be an object.`);
  return value as JsonRecord;
}

function assertExactKeys(value: JsonRecord, expected: readonly string[], label: string): void {
  const actual = Object.keys(value).sort().join("|");
  const canonical = [...expected].sort().join("|");
  if (actual !== canonical) throw new Error(`${label} contains unknown or missing fields.`);
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

function sha256Value(value: unknown, label: string): string {
  const parsed = text(value, label);
  if (!sha256Pattern.test(parsed)) throw new Error(`${label} must be a lowercase SHA-256 value.`);
  return parsed;
}

function generation(value: unknown, label: string): number {
  if (!Number.isSafeInteger(value) || (value as number) < 0) throw new Error(`${label} must be a nonnegative safe integer.`);
  return value as number;
}

function displayName(value: unknown, label: string): string {
  const parsed = text(value, label);
  if ([...parsed].length > 100 || [...parsed].some((character) => /[\u0000-\u001f\u007f]/u.test(character))) {
    throw new Error(`${label} must be 1–100 non-control characters.`);
  }
  return parsed;
}

function canonicalize(value: unknown): string {
  if (value === null || typeof value === "string" || typeof value === "boolean") return JSON.stringify(value);
  if (typeof value === "number") {
    if (!Number.isFinite(value)) throw new Error("Rename preview values cannot contain non-finite numbers.");
    return JSON.stringify(value);
  }
  if (Array.isArray(value)) return `[${value.map(canonicalize).join(",")}]`;
  const object = record(value, "Canonical rename preview value");
  return `{${Object.keys(object).sort().map((key) => `${JSON.stringify(key)}:${canonicalize(object[key])}`).join(",")}}`;
}

async function sha256(value: unknown): Promise<string> {
  const digest = await globalThis.crypto.subtle.digest("SHA-256", new TextEncoder().encode(canonicalize(value)));
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

function previewIdentity(input: ProjectRenamePreviewInput): JsonRecord {
  return {
    operation: PROJECT_RENAME_PREVIEW_OPERATION,
    projectId: stableId(input.projectId, "projectId"),
    workspaceIndexGeneration: generation(input.workspaceIndexGeneration, "workspaceIndexGeneration"),
    currentDisplayName: displayName(input.currentDisplayName, "currentDisplayName"),
    proposedDisplayName: displayName(input.proposedDisplayName, "proposedDisplayName"),
    contentSha256: sha256Value(input.contentSha256, "contentSha256"),
    requiresApproval: true,
    noWrite: true,
    noFoundryWrite: true,
  };
}

function validatePreview(input: unknown): ProjectRenamePreview {
  const value = record(input, "Project rename preview");
  assertExactKeys(value, previewKeys, "Project rename preview");
  if (value.operation !== PROJECT_RENAME_PREVIEW_OPERATION) throw new Error("Project rename preview operation is unsupported.");
  if (value.status !== "PREVIEW") throw new Error("Project rename preview status must be PREVIEW.");
  if (value.requiresApproval !== true || value.noWrite !== true || value.noFoundryWrite !== true) throw new Error("Project rename preview must be approval-bound and no-write.");
  const normalized = previewIdentity({
    projectId: stableId(value.projectId, "projectId"),
    workspaceIndexGeneration: generation(value.workspaceIndexGeneration, "workspaceIndexGeneration"),
    currentDisplayName: displayName(value.currentDisplayName, "currentDisplayName"),
    proposedDisplayName: displayName(value.proposedDisplayName, "proposedDisplayName"),
    contentSha256: sha256Value(value.contentSha256, "contentSha256"),
  });
  if (normalized.currentDisplayName === normalized.proposedDisplayName) throw new Error("Project rename preview must change the display name.");
  const previewSha256 = sha256Value(value.previewSha256, "previewSha256");
  return {
    ...normalized,
    status: "PREVIEW",
    previewSha256,
    requiresApproval: true,
    noWrite: true,
    noFoundryWrite: true,
  } as ProjectRenamePreview;
}

function localPart(id: string): string {
  return id.split(":").at(-1) ?? "project-rename";
}

export async function createProjectRenamePreview(input: ProjectRenamePreviewInput): Promise<ProjectRenamePreview> {
  const normalized = previewIdentity(input);
  if (normalized.currentDisplayName === normalized.proposedDisplayName) throw new Error("Project rename preview must change the display name.");
  const previewSha256 = await sha256(normalized);
  return { ...normalized, status: "PREVIEW", previewSha256, requiresApproval: true, noWrite: true, noFoundryWrite: true } as ProjectRenamePreview;
}

export async function createProjectRenameProposalBatch(input: ProjectRenameProposalInput): Promise<ProposalBatch> {
  const preview = validatePreview(input.preview);
  const expectedPreviewSha256 = await sha256({
    operation: preview.operation,
    projectId: preview.projectId,
    workspaceIndexGeneration: preview.workspaceIndexGeneration,
    currentDisplayName: preview.currentDisplayName,
    proposedDisplayName: preview.proposedDisplayName,
    contentSha256: preview.contentSha256,
    requiresApproval: true,
    noWrite: true,
    noFoundryWrite: true,
  });
  if (preview.previewSha256 !== expectedPreviewSha256) throw new Error("Project rename preview hash does not match its canonical contents.");
  const baseSha256 = await sha256({
    projectId: preview.projectId,
    workspaceIndexGeneration: preview.workspaceIndexGeneration,
    currentDisplayName: preview.currentDisplayName,
    contentSha256: preview.contentSha256,
  });
  return createProposalBatch({
    schemaVersion: "0.1.0",
    batchId: input.batchId,
    revision: 0,
    previousBatchSha256: null,
    producer: { kind: "human", sourceId: "desktop.project.rename", provider: null },
    reviewAuthority: { domain: "human-review", requiredRole: "reviewer" },
    targetAuthority: { domain: "local-project", requiredActiveGm: false },
    risk: "medium",
    base: { targetId: preview.projectId, revision: preview.workspaceIndexGeneration, sha256: baseSha256 },
    commands: [{
      commandId: `dbx:proposal-command:${localPart(input.batchId)}-000`,
      kind: "project.rename",
      dependsOn: [],
      payload: {
        operation: "project.rename",
        projectId: preview.projectId,
        workspaceIndexGeneration: preview.workspaceIndexGeneration,
        currentDisplayName: preview.currentDisplayName,
        proposedDisplayName: preview.proposedDisplayName,
        contentSha256: preview.contentSha256,
        previewSha256: preview.previewSha256,
      },
    }],
    createdAt: input.createdAt,
  });
}
