import type { ProposalBatchActor, ProposalBatchHistory, ProposalBatchReread } from "@dicebox/core";
import { migrateSceneDocument, validateSceneDocument, type SceneDocument } from "@dicebox/scene";
import {
  beginDesktopProjectProposalSessionApply,
  commitDesktopProjectProposalSessionAfterReread,
  markDesktopProjectProposalOutcomeUnknown,
  validateDesktopProjectProposalSession,
  type DesktopProjectProposalSession,
} from "./project-proposal-session";
import {
  displayNameFromInput,
  inspectProjectRecovery,
  listProjectBundles,
  loadProjectBundle,
  createProjectBundle,
  type ProjectCatalogEntry,
  type ProjectCatalogResponse,
  type ProjectLoadResponse,
  type ProjectRecoveryInspectionReceipt,
  type ProjectSaveReceipt,
  type StoredAsset,
} from "./project-store";
import { hashProjectPersistentAddSceneState } from "./project-persistent-add-scene-proposal-adapter";

export type ProjectCreateStore = Readonly<{
  list: () => Promise<ProjectCatalogResponse>;
  load: (projectId: string) => Promise<ProjectLoadResponse>;
  inspect: (projectId: string) => Promise<ProjectRecoveryInspectionReceipt>;
  create: (projectId: string, scenes: readonly SceneDocument[], activeSceneId: string, displayName: string, expectedWorkspaceGeneration: number) => Promise<ProjectSaveReceipt>;
}>;

export const nativeProjectCreateStore: ProjectCreateStore = {
  list: listProjectBundles,
  load: (projectId) => loadProjectBundle(projectId),
  inspect: inspectProjectRecovery,
  create: createProjectBundle,
};

type ProjectCreateProjectRead = Readonly<{
  projectId: string;
  generation: number;
  contentSha256: string;
  sceneIds: readonly string[];
  scenesSha256: string;
  activeSceneId: string;
  sceneCount: number;
  assets: readonly StoredAsset[];
  assetCollectionSha256: string;
  catalogEntry: ProjectCatalogEntry;
  project: ProjectLoadResponse;
  recovery: ProjectRecoveryInspectionReceipt;
  noWrite: true;
  noFoundryWrite: true;
}>;

export type ProjectCreateAuthoritativeRead = Readonly<{
  target: ProjectCreateProjectRead | null;
  targetAbsent: boolean;
  workspaceIndexGeneration: number;
  catalog: ProjectCatalogResponse;
  noWrite: true;
  noFoundryWrite: true;
}>;

export type ProjectCreateExecutionReceipt = Readonly<{
  operation: "dicebox.project.create.execute";
  status: "PASS";
  targetProjectId: string;
  batchId: string;
  before: ProjectCreateAuthoritativeRead;
  afterApply: ProjectCreateAuthoritativeRead;
  create: ProjectSaveReceipt;
  history: ProposalBatchHistory;
  projectContentWrite: true;
  projectPersistenceWrite: true;
  targetCreated: true;
  firstGenerationBackupMissing: true;
  noFoundryWrite: true;
}>;

export type ProjectCreateExecutionFailureCode = "PROJECT_CREATE_NOT_APPROVED" | "PROJECT_CREATE_CONFLICT" | "PROJECT_CREATE_OUTCOME_UNKNOWN";

export class ProjectCreateExecutionError extends Error {
  readonly code: ProjectCreateExecutionFailureCode;
  readonly authoritativeRead: ProjectCreateAuthoritativeRead | null;
  readonly session: DesktopProjectProposalSession | null;

  constructor(code: ProjectCreateExecutionFailureCode, message: string, authoritativeRead: ProjectCreateAuthoritativeRead | null = null, session: DesktopProjectProposalSession | null = null) {
    super(message);
    this.name = "ProjectCreateExecutionError";
    this.code = code;
    this.authoritativeRead = authoritativeRead;
    this.session = session;
  }
}

const stableIdPattern = /^dbx:[a-z0-9][a-z0-9._-]*:[a-z0-9][a-z0-9._-]*$/;
const sceneIdPattern = /^dbx:scene:[a-z0-9][a-z0-9._-]*$/;
const sha256Pattern = /^[0-9a-f]{64}$/;

function conflict(message: string, read: ProjectCreateAuthoritativeRead | null = null): ProjectCreateExecutionError {
  return new ProjectCreateExecutionError("PROJECT_CREATE_CONFLICT", message, read);
}

function record(value: unknown, label: string): Record<string, unknown> {
  if (value === null || typeof value !== "object" || Array.isArray(value)) throw conflict(`${label} must be an object.`);
  return value as Record<string, unknown>;
}

function exactString(value: unknown, pattern: RegExp, label: string): string {
  if (typeof value !== "string" || value.trim() !== value || !pattern.test(value)) throw conflict(`${label} is invalid.`);
  return value;
}

function integer(value: unknown, label: string): number {
  if (!Number.isSafeInteger(value) || (value as number) < 0) throw conflict(`${label} is invalid.`);
  return value as number;
}

function ids(value: unknown, label: string): readonly string[] {
  if (!Array.isArray(value) || value.length === 0 || value.length > 256) throw conflict(`${label} is invalid.`);
  const parsed = value.map((entry, index) => exactString(entry, sceneIdPattern, `${label}[${index}]`));
  if (new Set(parsed).size !== parsed.length) throw conflict(`${label} contains duplicate IDs.`);
  return parsed;
}

function hash(value: unknown, label: string): string {
  return exactString(value, sha256Pattern, label);
}

function sameStrings(left: readonly string[], right: readonly string[]): boolean {
  return left.length === right.length && left.every((value, index) => value === right[index]);
}

function canonicalize(value: unknown): string {
  if (value === null || typeof value === "string" || typeof value === "boolean") return JSON.stringify(value);
  if (typeof value === "number") {
    if (!Number.isFinite(value)) throw conflict("Project create state cannot contain a non-finite number.");
    return JSON.stringify(value);
  }
  if (Array.isArray(value)) return `[${value.map(canonicalize).join(",")}]`;
  const object = record(value, "Project create state");
  return `{${Object.keys(object).sort().map((key) => `${JSON.stringify(key)}:${canonicalize(object[key])}`).join(",")}}`;
}

async function sha256(value: unknown): Promise<string> {
  const digest = await globalThis.crypto.subtle.digest("SHA-256", new TextEncoder().encode(canonicalize(value)));
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function assetHash(assets: readonly StoredAsset[]): Promise<string> {
  return sha256(assets.map((asset) => ({ sha256: asset.sha256, mediaType: asset.mediaType, byteLength: asset.byteLength, relativePath: asset.relativePath, ...(asset.registration === undefined ? {} : { registration: asset.registration }) })));
}

function backupIsValidForProject(generation: number, status: string): boolean {
  return status === "VALID" || (generation === 1 && status === "MISSING");
}

function catalogEntry(catalog: ProjectCatalogResponse, projectId: string): ProjectCatalogEntry {
  if (!(catalog.status === "PASS" || catalog.status === "PARTIAL") || catalog.noWrite !== true || catalog.noFoundryWrite !== true) throw conflict("Project catalog reread is not an exact no-write result.");
  const matches = catalog.entries.filter((entry) => entry.projectId === projectId);
  if (matches.length !== 1 || matches[0]!.status !== "PASS" || matches[0]!.generation === null || matches[0]!.contentSha256 === null) throw conflict("The requested project catalog entry is absent, blocked, or lacks content evidence.");
  return matches[0]!;
}

async function readProject(store: ProjectCreateStore, catalog: ProjectCatalogResponse, projectId: string): Promise<ProjectCreateProjectRead> {
  const entry = catalogEntry(catalog, projectId);
  const project = await store.load(projectId);
  const recovery = await store.inspect(projectId);
  if (project.receipt.status !== "PASS" || project.receipt.projectId !== projectId || project.receipt.noFoundryWrite !== true || recovery.status !== "PASS" || recovery.projectId !== projectId || recovery.noWrite !== true || recovery.noFoundryWrite !== true || recovery.generation !== project.receipt.generation || recovery.contentSha256 !== project.receipt.contentSha256 || recovery.primary.status !== "VALID" || !backupIsValidForProject(project.receipt.generation, recovery.backup.status) || entry.generation !== project.receipt.generation || entry.contentSha256 !== project.receipt.contentSha256) throw conflict("Created project, catalog, and recovery rereads do not agree on one valid exact project.");
  const scenes = project.scenesJson.map((value) => migrateSceneDocument(JSON.parse(value) as SceneDocument));
  for (const [index, scene] of scenes.entries()) {
    const errors = validateSceneDocument(scene);
    if (errors.length > 0) throw conflict(`Project ${projectId} contains an invalid Scene at index ${index}: ${errors.join("; ")}`);
  }
  const sceneIdsValue = scenes.map((scene) => exactString(scene.id, sceneIdPattern, "scene.id"));
  if (scenes.length === 0 || scenes.length > 256 || new Set(sceneIdsValue).size !== scenes.length || !sceneIdsValue.includes(project.activeSceneId)) throw conflict("Project create requires an ordered unique Scene collection and an active Scene.");
  return {
    projectId,
    generation: project.receipt.generation,
    contentSha256: project.receipt.contentSha256,
    sceneIds: sceneIdsValue,
    scenesSha256: await hashProjectPersistentAddSceneState({ projectId, scenes, activeSceneId: project.activeSceneId }),
    activeSceneId: project.activeSceneId,
    sceneCount: scenes.length,
    assets: project.assets,
    assetCollectionSha256: await assetHash(project.assets),
    catalogEntry: entry,
    project,
    recovery,
    noWrite: true,
    noFoundryWrite: true,
  };
}

export async function readAuthoritativeProjectCreateState(store: ProjectCreateStore, targetProjectId: string): Promise<ProjectCreateAuthoritativeRead> {
  const catalog = await store.list();
  if (!(catalog.status === "PASS" || catalog.status === "PARTIAL") || catalog.noWrite !== true || catalog.noFoundryWrite !== true) throw conflict("Project catalog is not an exact no-write result.");
  if (catalog.entries.some((entry) => entry.projectId === targetProjectId)) throw conflict("Project create target already exists; no overwrite or cleanup is permitted.");
  return { target: null, targetAbsent: true, workspaceIndexGeneration: catalog.workspaceIndexGeneration, catalog, noWrite: true, noFoundryWrite: true };
}

async function readAfterCreate(store: ProjectCreateStore, targetProjectId: string): Promise<ProjectCreateAuthoritativeRead> {
  const catalog = await store.list();
  const target = await readProject(store, catalog, targetProjectId);
  return { target, targetAbsent: false, workspaceIndexGeneration: catalog.workspaceIndexGeneration, catalog, noWrite: true, noFoundryWrite: true };
}

type ProjectCreateCommandPayload = Readonly<{
  operation: "project.create";
  targetProjectId: string;
  workspaceIndexGeneration: number;
  sceneIds: readonly string[];
  scenesSha256: string;
  activeSceneId: string;
  sceneCount: number;
  proposedDisplayName: string;
  targetAbsent: true;
  previewSha256: string;
}>;

function exactCommand(session: DesktopProjectProposalSession): ProjectCreateCommandPayload {
  if (session.history.status !== "approved") throw new ProjectCreateExecutionError("PROJECT_CREATE_NOT_APPROVED", `Project create execution requires an approved session; current status is ${session.history.status}.`);
  if (session.batch.producer.kind !== "project-store" || session.batch.producer.sourceId !== "desktop.project.create" || session.batch.producer.provider !== null || session.batch.commands.length !== 1 || session.batch.commands[0]?.kind !== "project.create") throw conflict("Project create execution requires exactly one project-store/no-provider command.");
  const payload = record(session.batch.commands[0].payload, "Project create payload");
  const expectedKeys = ["activeSceneId", "operation", "previewSha256", "proposedDisplayName", "sceneCount", "sceneIds", "scenesSha256", "targetAbsent", "targetProjectId", "workspaceIndexGeneration"];
  if (Object.keys(payload).sort().join("|") !== expectedKeys.sort().join("|")) throw conflict("Project create payload contains unknown or missing fields.");
  const parsed = {
    operation: payload.operation,
    targetProjectId: exactString(payload.targetProjectId, stableIdPattern, "targetProjectId"),
    workspaceIndexGeneration: integer(payload.workspaceIndexGeneration, "workspaceIndexGeneration"),
    sceneIds: ids(payload.sceneIds, "sceneIds"),
    scenesSha256: hash(payload.scenesSha256, "scenesSha256"),
    activeSceneId: exactString(payload.activeSceneId, sceneIdPattern, "activeSceneId"),
    sceneCount: integer(payload.sceneCount, "sceneCount"),
    proposedDisplayName: displayNameFromInput(exactString(payload.proposedDisplayName, /^.+$/, "proposedDisplayName")),
    targetAbsent: payload.targetAbsent,
    previewSha256: hash(payload.previewSha256, "previewSha256"),
  };
  if (parsed.operation !== "project.create" || parsed.targetProjectId !== session.projectId || parsed.targetProjectId !== session.batch.base.targetId || session.batch.base.revision !== 0 || parsed.targetAbsent !== true || parsed.sceneIds.length !== parsed.sceneCount || parsed.sceneCount < 1 || !parsed.sceneIds.includes(parsed.activeSceneId)) throw conflict("Project create payload is not the exact validated metadata-only shape.");
  return parsed as ProjectCreateCommandPayload;
}

function nextObservedAt(session: DesktopProjectProposalSession): string {
  const last = session.history.receipts.at(-1)?.observedAt;
  const lastTime = last === undefined ? 0 : Date.parse(last);
  return new Date(Math.max(Date.now(), lastTime + 1)).toISOString();
}

async function assertBase(before: ProjectCreateAuthoritativeRead, command: ProjectCreateCommandPayload, content: Readonly<{ scenes: readonly SceneDocument[]; activeSceneId: string }>, baseSha256: string): Promise<void> {
  if (!before.targetAbsent || before.target !== null) throw conflict("The project-create target is no longer absent; no overwrite or cleanup is permitted.", before);
  const contentScenesSha256 = await hashProjectPersistentAddSceneState({ projectId: command.targetProjectId, scenes: content.scenes, activeSceneId: content.activeSceneId });
  const expectedBase = await sha256({ targetProjectId: command.targetProjectId, workspaceIndexGeneration: command.workspaceIndexGeneration, sceneIds: command.sceneIds, scenesSha256: command.scenesSha256, activeSceneId: command.activeSceneId, sceneCount: command.sceneCount });
  if (baseSha256 !== expectedBase || before.workspaceIndexGeneration !== command.workspaceIndexGeneration || !sameStrings(command.sceneIds, content.scenes.map((scene) => scene.id)) || content.activeSceneId !== command.activeSceneId || content.scenes.length !== command.sceneCount || contentScenesSha256 !== command.scenesSha256) throw conflict("The approved project-create base is stale, foreign, or does not preserve the exact proposed Scene collection.", before);
}

function targetReread(read: ProjectCreateAuthoritativeRead): ProposalBatchReread {
  if (!read.target) throw conflict("Project-create reread has no target project.", read);
  return { status: "matched", targetId: read.target.projectId as ProposalBatchReread["targetId"], revision: read.target.generation, sha256: read.target.contentSha256 };
}

export async function executeApprovedProjectCreate(input: Readonly<{
  session: unknown;
  content: Readonly<{ scenes: readonly SceneDocument[]; activeSceneId: string }>;
  executor: ProposalBatchActor;
  store?: ProjectCreateStore;
}>): Promise<ProjectCreateExecutionReceipt> {
  const session = await validateDesktopProjectProposalSession(input.session);
  const command = exactCommand(session);
  if (input.executor.role !== "reviewer") throw new ProjectCreateExecutionError("PROJECT_CREATE_NOT_APPROVED", "Project create execution requires a reviewer executor.");
  const store = input.store ?? nativeProjectCreateStore;
  const before = await readAuthoritativeProjectCreateState(store, command.targetProjectId);
  await assertBase(before, command, input.content, session.batch.base.sha256);
  let applying: DesktopProjectProposalSession;
  try {
    applying = await beginDesktopProjectProposalSessionApply(session, input.executor, session.batch.base, nextObservedAt(session));
  } catch (error) {
    throw conflict(`Project create apply could not begin: ${error instanceof Error ? error.message : String(error)}`, before);
  }
  let create: ProjectSaveReceipt;
  try {
    create = await store.create(command.targetProjectId, input.content.scenes, input.content.activeSceneId, command.proposedDisplayName, before.workspaceIndexGeneration);
  } catch (error) {
    const reread = await readAfterCreate(store, command.targetProjectId).catch(() => null);
    const unknown = await markDesktopProjectProposalOutcomeUnknown(applying, input.executor, nextObservedAt(applying));
    throw new ProjectCreateExecutionError("PROJECT_CREATE_OUTCOME_UNKNOWN", `Project create outcome is unknown; retry is forbidden until authoritative reread: ${error instanceof Error ? error.message : String(error)}`, reread, unknown);
  }
  const createReceiptIsAttested = create.operation === "dicebox.project.create"
    && create.status === "PASS"
    && create.projectId === command.targetProjectId
    && create.generation === 1
    && create.atomicReplace === true
    && create.directoryEntrySync === true
    && create.backupPreserved === false
    && create.noFoundryWrite === true
    && create.workspaceMetadata?.projectId === command.targetProjectId
    && create.workspaceMetadata?.displayName === command.proposedDisplayName
    && create.workspaceMetadata?.indexGeneration === before.workspaceIndexGeneration + 1
    && create.workspaceMetadata?.noFoundryWrite === true;
  if (!createReceiptIsAttested) {
    const reread = await readAfterCreate(store, command.targetProjectId).catch(() => null);
    const unknown = await markDesktopProjectProposalOutcomeUnknown(applying, input.executor, nextObservedAt(applying));
    throw new ProjectCreateExecutionError("PROJECT_CREATE_OUTCOME_UNKNOWN", "Project create returned an incomplete or non-attested post-write receipt; retry is forbidden until authoritative reread.", reread, unknown);
  }
  const afterApply = await readAfterCreate(store, command.targetProjectId);
  if (!afterApply.target || afterApply.workspaceIndexGeneration !== create.workspaceMetadata!.indexGeneration || afterApply.target.projectId !== command.targetProjectId || afterApply.target.generation !== 1 || afterApply.target.contentSha256 !== create.contentSha256 || afterApply.target.sceneCount !== input.content.scenes.length || afterApply.target.activeSceneId !== input.content.activeSceneId || afterApply.target.scenesSha256 !== command.scenesSha256 || afterApply.target.assets.length !== 0 || afterApply.target.catalogEntry.displayName !== command.proposedDisplayName || afterApply.target.catalogEntry.contentSha256 !== create.contentSha256 || afterApply.target.recovery.backup.status !== "MISSING" || afterApply.catalog.status === "PARTIAL" && afterApply.catalog.entries.length === 0) throw conflict("Post-create reread did not prove exact first-generation target content, missing first-generation backup, workspace metadata, and target validity.", afterApply);
  const committed = await commitDesktopProjectProposalSessionAfterReread(applying, input.executor, targetReread(afterApply), nextObservedAt(applying));
  return {
    operation: "dicebox.project.create.execute",
    status: "PASS",
    targetProjectId: command.targetProjectId,
    batchId: session.batch.batchId,
    before,
    afterApply,
    create,
    history: committed.history,
    projectContentWrite: true,
    projectPersistenceWrite: true,
    targetCreated: true,
    firstGenerationBackupMissing: true,
    noFoundryWrite: true,
  };
}
