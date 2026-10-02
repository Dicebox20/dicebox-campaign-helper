import { createProposalBatch, type ProposalBatch, type ProposalBatchInput } from "@dicebox/core";
import { serializeSceneDocument, validateSceneDocument, type SceneDocument } from "@dicebox/scene";
import { createBlankProjectScene } from "./project-store";

export const PROJECT_PERSISTENT_ADD_SCENE_PREVIEW_OPERATION = "dicebox.project.add-scene.persist.preview" as const;

export type ProjectPersistentAddSceneState = Readonly<{
  projectId: string;
  generation: number;
  contentSha256: string;
  scenes: readonly SceneDocument[];
  activeSceneId: string;
}>;

export type ProjectPersistentAddScenePreview = Readonly<{
  operation: typeof PROJECT_PERSISTENT_ADD_SCENE_PREVIEW_OPERATION;
  status: "PREVIEW";
  projectId: string;
  currentGeneration: number;
  currentContentSha256: string;
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

export type ProjectPersistentAddSceneProposalInput = Readonly<{
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
    if (!Number.isFinite(value)) throw new Error("Persistent add-Scene state cannot contain a non-finite number.");
    return JSON.stringify(value);
  }
  if (Array.isArray(value)) return `[${value.map(canonicalize).join(",")}]`;
  const object = record(value, "Persistent add-Scene state");
  return `{${Object.keys(object).sort().map((key) => `${JSON.stringify(key)}:${canonicalize(object[key])}`).join(",")}}`;
}

async function sha256(value: unknown): Promise<string> {
  const digest = await globalThis.crypto.subtle.digest("SHA-256", new TextEncoder().encode(canonicalize(value)));
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

export function validateProjectPersistentAddSceneState(input: ProjectPersistentAddSceneState): ProjectPersistentAddSceneState {
  const projectId = stableId(input.projectId, "projectId");
  const generation = nonnegativeInteger(input.generation, "generation");
  const contentSha256 = sha256Value(input.contentSha256, "contentSha256");
  if (!Array.isArray(input.scenes) || input.scenes.length === 0 || input.scenes.length >= 256) throw new Error("Persistent add-Scene state must contain 1–255 existing Scenes.");
  const ids = input.scenes.map((scene, index) => {
    const errors = validateSceneDocument(scene);
    if (errors.length > 0) throw new Error(`Persistent add-Scene state contains an invalid Scene at index ${index}: ${errors.join("; ")}`);
    return sceneId(scene.id, `scenes[${index}].id`);
  });
  if (new Set(ids).size !== ids.length) throw new Error("Persistent add-Scene state Scene IDs must be unique.");
  const activeSceneId = sceneId(input.activeSceneId, "activeSceneId");
  if (!ids.includes(activeSceneId)) throw new Error("Persistent add-Scene state active Scene must identify one existing Scene.");
  return { projectId, generation, contentSha256, scenes: input.scenes, activeSceneId };
}

export async function hashProjectPersistentAddSceneState(input: Readonly<Pick<ProjectPersistentAddSceneState, "projectId" | "scenes" | "activeSceneId">>): Promise<string> {
  const projectId = stableId(input.projectId, "projectId");
  if (!Array.isArray(input.scenes) || input.scenes.length === 0 || input.scenes.length > 256) throw new Error("Persistent add-Scene hash requires 1–256 Scenes.");
  const activeSceneId = sceneId(input.activeSceneId, "activeSceneId");
  const ids = input.scenes.map((scene, index) => {
    const errors = validateSceneDocument(scene);
    if (errors.length > 0) throw new Error(`Persistent add-Scene hash contains an invalid Scene at index ${index}: ${errors.join("; ")}`);
    return sceneId(scene.id, `scenes[${index}].id`);
  });
  if (new Set(ids).size !== ids.length || !ids.includes(activeSceneId)) throw new Error("Persistent add-Scene hash contains an invalid Scene identity.");
  return sha256({ activeSceneId, projectId, scenes: input.scenes.map(serializeSceneDocument) });
}

export async function hashProjectPersistentAddSceneBase(input: ProjectPersistentAddSceneState): Promise<string> {
  const state = validateProjectPersistentAddSceneState(input);
  return sha256({ contentSha256: state.contentSha256, generation: state.generation, projectId: state.projectId });
}

export function deriveNextPersistentBlankProjectScene(stateInput: Readonly<Pick<ProjectPersistentAddSceneState, "projectId" | "scenes" | "activeSceneId">>): Readonly<{ scene: SceneDocument; ordinal: number }> {
  const projectId = stableId(stateInput.projectId, "projectId");
  if (!Array.isArray(stateInput.scenes) || stateInput.scenes.length === 0 || stateInput.scenes.length >= 256) throw new Error("The project already contains the maximum 256 Scenes.");
  const ids = new Set(stateInput.scenes.map((scene) => sceneId(scene.id, "scene.id")));
  sceneId(stateInput.activeSceneId, "activeSceneId");
  for (let ordinal = 2; ordinal <= 256; ordinal += 1) {
    const scene = createBlankProjectScene(projectId, ordinal);
    if (!ids.has(scene.id)) return { scene, ordinal };
  }
  throw new Error("The project already contains the maximum 256 Scenes.");
}

type ProjectPersistentAddScenePreviewIdentity = Readonly<Omit<ProjectPersistentAddScenePreview, "status" | "previewSha256">>;

function previewIdentity(input: Readonly<{
  projectId: string;
  currentGeneration: number;
  currentContentSha256: string;
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
}>): ProjectPersistentAddScenePreviewIdentity {
  return {
    operation: PROJECT_PERSISTENT_ADD_SCENE_PREVIEW_OPERATION,
    projectId: stableId(input.projectId, "projectId"),
    currentGeneration: nonnegativeInteger(input.currentGeneration, "currentGeneration"),
    currentContentSha256: sha256Value(input.currentContentSha256, "currentContentSha256"),
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
  };
}

const previewKeys = [
  "addedOrdinal", "addedSceneId", "currentActiveSceneId", "currentContentSha256", "currentGeneration", "currentSceneCount", "currentSceneIds", "currentScenesSha256",
  "noFoundryWrite", "noPersistenceWrite", "noWrite", "operation", "previewSha256", "proposedActiveSceneId", "proposedSceneCount", "proposedSceneIds", "proposedScenesSha256",
  "projectId", "requiresApproval", "status",
] as const;

function validatePreview(input: unknown): ProjectPersistentAddScenePreview {
  const value = record(input, "Persistent add-Scene preview");
  assertExactKeys(value, previewKeys, "Persistent add-Scene preview");
  if (value.operation !== PROJECT_PERSISTENT_ADD_SCENE_PREVIEW_OPERATION || value.status !== "PREVIEW" || value.requiresApproval !== true || value.noWrite !== true || value.noPersistenceWrite !== true || value.noFoundryWrite !== true) throw new Error("Persistent add-Scene preview must be approval-bound and no-write.");
  const normalized = previewIdentity({
    projectId: stableId(value.projectId, "projectId"),
    currentGeneration: nonnegativeInteger(value.currentGeneration, "currentGeneration"),
    currentContentSha256: sha256Value(value.currentContentSha256, "currentContentSha256"),
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
  if (normalized.currentGeneration < 1 || normalized.currentSceneCount >= 256 || normalized.proposedSceneCount !== normalized.currentSceneCount + 1 || normalized.proposedSceneIds.length !== normalized.proposedSceneCount || normalized.currentSceneIds.length !== normalized.currentSceneCount || normalized.proposedActiveSceneId !== normalized.addedSceneId || normalized.currentSceneIds.includes(normalized.addedSceneId) || !normalized.proposedSceneIds.includes(normalized.addedSceneId) || normalized.addedOrdinal < 2 || normalized.addedOrdinal > 256) throw new Error("Persistent add-Scene preview does not describe one exact new Scene.");
  return { ...normalized, status: "PREVIEW", previewSha256: sha256Value(value.previewSha256, "previewSha256") };
}

export async function createProjectPersistentAddScenePreview(input: Readonly<{
  projectId: string;
  currentGeneration: number;
  currentContentSha256: string;
  scenes: readonly SceneDocument[];
  activeSceneId: string;
}>): Promise<ProjectPersistentAddScenePreview> {
  const state = validateProjectPersistentAddSceneState({
    projectId: input.projectId,
    generation: input.currentGeneration,
    contentSha256: input.currentContentSha256,
    scenes: input.scenes,
    activeSceneId: input.activeSceneId,
  });
  const added = deriveNextPersistentBlankProjectScene(state);
  const proposedScenes = [...state.scenes, added.scene];
  const identity = previewIdentity({
    projectId: state.projectId,
    currentGeneration: state.generation,
    currentContentSha256: state.contentSha256,
    currentSceneIds: state.scenes.map((scene) => scene.id),
    proposedSceneIds: proposedScenes.map((scene) => scene.id),
    currentScenesSha256: await hashProjectPersistentAddSceneState(state),
    proposedScenesSha256: await hashProjectPersistentAddSceneState({ projectId: state.projectId, scenes: proposedScenes, activeSceneId: added.scene.id }),
    currentActiveSceneId: state.activeSceneId,
    proposedActiveSceneId: added.scene.id,
    currentSceneCount: state.scenes.length,
    proposedSceneCount: proposedScenes.length,
    addedSceneId: added.scene.id,
    addedOrdinal: added.ordinal,
  });
  return { ...identity, status: "PREVIEW", previewSha256: await sha256(identity) };
}

export async function createProjectPersistentAddSceneProposalBatch(input: ProjectPersistentAddSceneProposalInput): Promise<ProposalBatch> {
  const preview = validatePreview(input.preview);
  const expectedPreviewSha256 = await sha256({
    operation: preview.operation,
    projectId: preview.projectId,
    currentGeneration: preview.currentGeneration,
    currentContentSha256: preview.currentContentSha256,
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
  if (preview.previewSha256 !== expectedPreviewSha256) throw new Error("Persistent add-Scene preview hash does not match its canonical contents.");
  const baseSha256 = await sha256({ projectId: preview.projectId, generation: preview.currentGeneration, contentSha256: preview.currentContentSha256 });
  const localPart = input.batchId.split(":").at(-1) ?? "project-add-scene-persist";
  return createProposalBatch({
    schemaVersion: "0.1.0",
    batchId: input.batchId,
    revision: 0,
    previousBatchSha256: null,
    producer: { kind: "project-store", sourceId: "desktop.project.add-scene.persist", provider: null },
    reviewAuthority: { domain: "human-review", requiredRole: "reviewer" },
    targetAuthority: { domain: "local-project", requiredActiveGm: false },
    risk: "high",
    base: { targetId: preview.projectId, revision: preview.currentGeneration, sha256: baseSha256 },
    commands: [{
      commandId: `dbx:proposal-command:${localPart}-000`,
      kind: "project.add-scene.persist",
      dependsOn: [],
      payload: {
        operation: "project.add-scene.persist",
        projectId: preview.projectId,
        expectedGeneration: preview.currentGeneration,
        currentContentSha256: preview.currentContentSha256,
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
