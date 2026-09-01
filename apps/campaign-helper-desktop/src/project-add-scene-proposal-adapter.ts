import { createProposalBatch, type ProposalBatch, type ProposalBatchInput } from "@dicebox/core";
import { serializeSceneDocument, validateSceneDocument, type SceneDocument } from "@dicebox/scene";
import { createBlankProjectScene } from "./project-store";

export const PROJECT_ADD_SCENE_PREVIEW_OPERATION = "dicebox.project.add-scene.preview" as const;

export type ProjectAddSceneState = Readonly<{
  projectId: string;
  scenes: readonly SceneDocument[];
  activeSceneId: string;
}>;

export type ProjectAddScenePreview = Readonly<{
  operation: typeof PROJECT_ADD_SCENE_PREVIEW_OPERATION;
  status: "PREVIEW";
  projectId: string;
  currentSceneIds: readonly string[];
  proposedSceneIds: readonly string[];
  currentScenesSha256: string;
  proposedScenesSha256: string;
  currentActiveSceneId: string;
  proposedActiveSceneId: string;
  currentSceneCount: number;
  proposedSceneCount: number;
  addedSceneId: string;
  addedOrdinal: number;
  requiresApproval: true;
  noWrite: true;
  noPersistenceWrite: true;
  noFoundryWrite: true;
  previewSha256: string;
}>;

export type ProjectAddSceneProposalInput = Readonly<{
  batchId: ProposalBatchInput["batchId"];
  preview: unknown;
  createdAt: string;
}>;

const stableIdPattern = /^dbx:[a-z0-9][a-z0-9._-]*:[a-z0-9][a-z0-9._-]*$/;
const sceneIdPattern = /^dbx:scene:[a-z0-9][a-z0-9._-]*$/;
const sha256Pattern = /^[0-9a-f]{64}$/;

function record(value: unknown, label: string): Record<string, unknown> {
  if (value === null || typeof value !== "object" || Array.isArray(value)) throw new Error(`${label} must be an object.`);
  return value as Record<string, unknown>;
}

function assertExactKeys(value: Record<string, unknown>, expected: readonly string[], label: string): void {
  if (Object.keys(value).sort().join("|") !== [...expected].sort().join("|")) throw new Error(`${label} contains unknown or missing fields.`);
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

function sha256Value(value: unknown, label: string): string {
  const parsed = text(value, label);
  if (!sha256Pattern.test(parsed)) throw new Error(`${label} must be a lowercase SHA-256 value.`);
  return parsed;
}

function nonnegativeInteger(value: unknown, label: string): number {
  if (!Number.isSafeInteger(value) || (value as number) < 0) throw new Error(`${label} must be a nonnegative safe integer.`);
  return value as number;
}

function sceneIds(value: unknown, label: string): readonly string[] {
  if (!Array.isArray(value) || value.length === 0 || value.length > 256) throw new Error(`${label} must contain 1–256 Scene IDs.`);
  const parsed = value.map((entry, index) => sceneId(entry, `${label}[${index}]`));
  if (new Set(parsed).size !== parsed.length) throw new Error(`${label} must contain unique Scene IDs.`);
  return parsed;
}

function canonicalize(value: unknown): string {
  if (value === null || typeof value === "string" || typeof value === "boolean") return JSON.stringify(value);
  if (typeof value === "number") {
    if (!Number.isFinite(value)) throw new Error("Add-Scene state cannot contain a non-finite number.");
    return JSON.stringify(value);
  }
  if (Array.isArray(value)) return `[${value.map(canonicalize).join(",")}]`;
  const object = record(value, "Add-Scene state");
  return `{${Object.keys(object).sort().map((key) => `${JSON.stringify(key)}:${canonicalize(object[key])}`).join(",")}}`;
}

async function sha256(value: unknown): Promise<string> {
  const digest = await globalThis.crypto.subtle.digest("SHA-256", new TextEncoder().encode(canonicalize(value)));
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

export function validateProjectAddSceneState(input: ProjectAddSceneState): ProjectAddSceneState {
  const projectId = stableId(input.projectId, "projectId");
  if (!Array.isArray(input.scenes) || input.scenes.length === 0 || input.scenes.length >= 256) throw new Error("Add-Scene state must contain 1–255 existing Scenes.");
  const ids = input.scenes.map((scene, index) => {
    const errors = validateSceneDocument(scene);
    if (errors.length > 0) throw new Error(`Add-Scene state contains an invalid Scene at index ${index}: ${errors.join("; ")}`);
    return sceneId(scene.id, `scenes[${index}].id`);
  });
  if (new Set(ids).size !== ids.length) throw new Error("Add-Scene state Scene IDs must be unique.");
  const activeSceneId = sceneId(input.activeSceneId, "activeSceneId");
  if (!ids.includes(activeSceneId)) throw new Error("Add-Scene state active Scene must identify one existing Scene.");
  return { projectId, scenes: input.scenes, activeSceneId };
}

export async function hashProjectAddSceneState(input: ProjectAddSceneState): Promise<string> {
  const state = validateProjectAddSceneState(input);
  return sha256({
    activeSceneId: state.activeSceneId,
    projectId: state.projectId,
    scenes: state.scenes.map(serializeSceneDocument),
  });
}

export async function hashProjectAddSceneBase(input: ProjectAddSceneState): Promise<string> {
  const state = validateProjectAddSceneState(input);
  return sha256({
    activeSceneId: state.activeSceneId,
    projectId: state.projectId,
    revision: state.scenes.length,
    scenesSha256: await hashProjectAddSceneState(state),
  });
}

export function deriveNextBlankProjectScene(stateInput: ProjectAddSceneState): Readonly<{ scene: SceneDocument; ordinal: number }> {
  const state = validateProjectAddSceneState(stateInput);
  const existing = new Set(state.scenes.map((scene) => scene.id));
  for (let ordinal = 2; ordinal <= 256; ordinal += 1) {
    const scene = createBlankProjectScene(state.projectId, ordinal);
    if (!existing.has(scene.id)) return { scene, ordinal };
  }
  throw new Error("The project already contains the maximum 256 Scenes.");
}

type ProjectAddScenePreviewIdentity = Readonly<{
  operation: typeof PROJECT_ADD_SCENE_PREVIEW_OPERATION;
  projectId: string;
  currentSceneIds: readonly string[];
  proposedSceneIds: readonly string[];
  currentScenesSha256: string;
  proposedScenesSha256: string;
  currentActiveSceneId: string;
  proposedActiveSceneId: string;
  currentSceneCount: number;
  proposedSceneCount: number;
  addedSceneId: string;
  addedOrdinal: number;
  requiresApproval: true;
  noWrite: true;
  noPersistenceWrite: true;
  noFoundryWrite: true;
}>;

function previewIdentity(input: Readonly<{
  projectId: string;
  currentSceneIds: readonly string[];
  proposedSceneIds: readonly string[];
  currentScenesSha256: string;
  proposedScenesSha256: string;
  currentActiveSceneId: string;
  proposedActiveSceneId: string;
  currentSceneCount: number;
  proposedSceneCount: number;
  addedSceneId: string;
  addedOrdinal: number;
}>): ProjectAddScenePreviewIdentity {
  return {
    operation: PROJECT_ADD_SCENE_PREVIEW_OPERATION,
    projectId: stableId(input.projectId, "projectId"),
    currentSceneIds: sceneIds(input.currentSceneIds, "currentSceneIds"),
    proposedSceneIds: sceneIds(input.proposedSceneIds, "proposedSceneIds"),
    currentScenesSha256: sha256Value(input.currentScenesSha256, "currentScenesSha256"),
    proposedScenesSha256: sha256Value(input.proposedScenesSha256, "proposedScenesSha256"),
    currentActiveSceneId: sceneId(input.currentActiveSceneId, "currentActiveSceneId"),
    proposedActiveSceneId: sceneId(input.proposedActiveSceneId, "proposedActiveSceneId"),
    currentSceneCount: nonnegativeInteger(input.currentSceneCount, "currentSceneCount"),
    proposedSceneCount: nonnegativeInteger(input.proposedSceneCount, "proposedSceneCount"),
    addedSceneId: sceneId(input.addedSceneId, "addedSceneId"),
    addedOrdinal: nonnegativeInteger(input.addedOrdinal, "addedOrdinal"),
    requiresApproval: true,
    noWrite: true,
    noPersistenceWrite: true,
    noFoundryWrite: true,
  } as ProjectAddScenePreviewIdentity;
}

const previewKeys = [
  "addedOrdinal", "addedSceneId", "currentActiveSceneId", "currentSceneCount", "currentSceneIds", "currentScenesSha256",
  "noFoundryWrite", "noPersistenceWrite", "noWrite", "operation", "previewSha256", "proposedActiveSceneId", "proposedSceneCount",
  "proposedSceneIds", "proposedScenesSha256", "projectId", "requiresApproval", "status",
] as const;

function validatePreview(input: unknown): ProjectAddScenePreview {
  const value = record(input, "Project add-Scene preview");
  assertExactKeys(value, previewKeys, "Project add-Scene preview");
  if (value.operation !== PROJECT_ADD_SCENE_PREVIEW_OPERATION || value.status !== "PREVIEW" || value.requiresApproval !== true || value.noWrite !== true || value.noPersistenceWrite !== true || value.noFoundryWrite !== true) {
    throw new Error("Project add-Scene preview must be approval-bound and no-write.");
  }
  const normalized = previewIdentity({
    projectId: stableId(value.projectId, "projectId"),
    currentSceneIds: sceneIds(value.currentSceneIds, "currentSceneIds"),
    proposedSceneIds: sceneIds(value.proposedSceneIds, "proposedSceneIds"),
    currentScenesSha256: sha256Value(value.currentScenesSha256, "currentScenesSha256"),
    proposedScenesSha256: sha256Value(value.proposedScenesSha256, "proposedScenesSha256"),
    currentActiveSceneId: sceneId(value.currentActiveSceneId, "currentActiveSceneId"),
    proposedActiveSceneId: sceneId(value.proposedActiveSceneId, "proposedActiveSceneId"),
    currentSceneCount: nonnegativeInteger(value.currentSceneCount, "currentSceneCount"),
    proposedSceneCount: nonnegativeInteger(value.proposedSceneCount, "proposedSceneCount"),
    addedSceneId: sceneId(value.addedSceneId, "addedSceneId"),
    addedOrdinal: nonnegativeInteger(value.addedOrdinal, "addedOrdinal"),
  });
  if (normalized.currentSceneCount >= 256 || normalized.proposedSceneCount !== normalized.currentSceneCount + 1 || normalized.proposedSceneIds.length !== normalized.proposedSceneCount || normalized.currentSceneIds.length !== normalized.currentSceneCount || normalized.proposedActiveSceneId !== normalized.addedSceneId || normalized.currentSceneIds.includes(normalized.addedSceneId) || normalized.proposedSceneIds.includes(normalized.addedSceneId) === false) {
    throw new Error("Project add-Scene preview does not describe one exact new Scene.");
  }
  if (normalized.addedOrdinal < 2 || normalized.addedOrdinal > 256) throw new Error("Added Scene ordinal must be from 2 through 256.");
  const previewSha256 = sha256Value(value.previewSha256, "previewSha256");
  return { ...normalized, status: "PREVIEW", previewSha256, requiresApproval: true, noWrite: true, noPersistenceWrite: true, noFoundryWrite: true } as ProjectAddScenePreview;
}

export async function createProjectAddScenePreview(stateInput: ProjectAddSceneState): Promise<ProjectAddScenePreview> {
  const state = validateProjectAddSceneState(stateInput);
  const added = deriveNextBlankProjectScene(state);
  const proposed: ProjectAddSceneState = { projectId: state.projectId, scenes: [...state.scenes, added.scene], activeSceneId: added.scene.id };
  const identity = previewIdentity({
    projectId: state.projectId,
    currentSceneIds: state.scenes.map((scene) => scene.id),
    proposedSceneIds: proposed.scenes.map((scene) => scene.id),
    currentScenesSha256: await hashProjectAddSceneState(state),
    proposedScenesSha256: await hashProjectAddSceneState(proposed),
    currentActiveSceneId: state.activeSceneId,
    proposedActiveSceneId: proposed.activeSceneId,
    currentSceneCount: state.scenes.length,
    proposedSceneCount: proposed.scenes.length,
    addedSceneId: added.scene.id,
    addedOrdinal: added.ordinal,
  });
  return { ...identity, status: "PREVIEW", previewSha256: await sha256(identity), requiresApproval: true, noWrite: true, noPersistenceWrite: true, noFoundryWrite: true } as ProjectAddScenePreview;
}

export async function createProjectAddSceneProposalBatch(input: ProjectAddSceneProposalInput): Promise<ProposalBatch> {
  const preview = validatePreview(input.preview);
  const expectedPreviewSha256 = await sha256({
    operation: preview.operation,
    projectId: preview.projectId,
    currentSceneIds: preview.currentSceneIds,
    proposedSceneIds: preview.proposedSceneIds,
    currentScenesSha256: preview.currentScenesSha256,
    proposedScenesSha256: preview.proposedScenesSha256,
    currentActiveSceneId: preview.currentActiveSceneId,
    proposedActiveSceneId: preview.proposedActiveSceneId,
    currentSceneCount: preview.currentSceneCount,
    proposedSceneCount: preview.proposedSceneCount,
    addedSceneId: preview.addedSceneId,
    addedOrdinal: preview.addedOrdinal,
    requiresApproval: true,
    noWrite: true,
    noPersistenceWrite: true,
    noFoundryWrite: true,
  });
  if (preview.previewSha256 !== expectedPreviewSha256) throw new Error("Project add-Scene preview hash does not match its canonical contents.");
  const baseSha256 = await sha256({ projectId: preview.projectId, revision: preview.currentSceneCount, scenesSha256: preview.currentScenesSha256, activeSceneId: preview.currentActiveSceneId });
  const localPart = input.batchId.split(":").at(-1) ?? "project-add-scene";
  return createProposalBatch({
    schemaVersion: "0.1.0",
    batchId: input.batchId,
    revision: 0,
    previousBatchSha256: null,
    producer: { kind: "human", sourceId: "desktop.project.add-scene", provider: null },
    reviewAuthority: { domain: "human-review", requiredRole: "reviewer" },
    targetAuthority: { domain: "local-project", requiredActiveGm: false },
    risk: "medium",
    base: { targetId: preview.projectId, revision: preview.currentSceneCount, sha256: baseSha256 },
    commands: [{
      commandId: `dbx:proposal-command:${localPart}-000`,
      kind: "project.add-scene",
      dependsOn: [],
      payload: {
        operation: "project.add-scene",
        projectId: preview.projectId,
        currentSceneIds: preview.currentSceneIds,
        proposedSceneIds: preview.proposedSceneIds,
        currentScenesSha256: preview.currentScenesSha256,
        proposedScenesSha256: preview.proposedScenesSha256,
        currentActiveSceneId: preview.currentActiveSceneId,
        proposedActiveSceneId: preview.proposedActiveSceneId,
        currentSceneCount: preview.currentSceneCount,
        proposedSceneCount: preview.proposedSceneCount,
        addedSceneId: preview.addedSceneId,
        addedOrdinal: preview.addedOrdinal,
        previewSha256: preview.previewSha256,
      },
    }],
    createdAt: input.createdAt,
  });
}
