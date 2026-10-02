import type { ProposalBatchActor, ProposalBatchHistory, ProposalBatchReread } from "@dicebox/core";
import { migrateSceneDocument, serializeSceneDocument, type SceneDocument } from "@dicebox/scene";
import {
  beginDesktopProjectProposalSessionApply,
  commitDesktopProjectProposalSessionAfterReread,
  markDesktopProjectProposalOutcomeUnknown,
  undoDesktopProjectProposalSession,
  validateDesktopProjectProposalSession,
  type DesktopProjectProposalSession,
} from "./project-proposal-session";
import {
  inspectProjectRecovery,
  listProjectBundles,
  loadProjectBundle,
  saveProjectBundle,
  type ProjectCatalogEntry,
  type ProjectCatalogResponse,
  type ProjectLoadResponse,
  type ProjectRecoveryInspectionReceipt,
  type ProjectSaveReceipt,
  type StoredAsset,
} from "./project-store";
import {
  deriveNextPersistentBlankProjectScene,
  hashProjectPersistentAddSceneBase,
  hashProjectPersistentAddSceneState,
  validateProjectPersistentAddSceneState,
  type ProjectPersistentAddSceneState,
} from "./project-persistent-add-scene-proposal-adapter";

export type ProjectPersistentAddSceneStore = Readonly<{
  list: () => Promise<ProjectCatalogResponse>;
  load: (projectId: string) => Promise<ProjectLoadResponse>;
  inspect: (projectId: string) => Promise<ProjectRecoveryInspectionReceipt>;
  save: (projectId: string, scenes: readonly SceneDocument[], activeSceneId: string, expectedGeneration: number) => Promise<ProjectSaveReceipt>;
}>;

export const nativeProjectPersistentAddSceneStore: ProjectPersistentAddSceneStore = {
  list: listProjectBundles,
  load: (projectId) => loadProjectBundle(projectId),
  inspect: inspectProjectRecovery,
  // Omitting assets is deliberate: the native store's merge-only asset authority preserves existing assets.
  save: (projectId, scenes, activeSceneId, expectedGeneration) => saveProjectBundle(projectId, scenes, activeSceneId, expectedGeneration),
};

export type ProjectPersistentAddSceneAuthoritativeRead = Readonly<{
  projectId: string;
  generation: number;
  contentSha256: string;
  sceneIds: readonly string[];
  scenesSha256: string;
  activeSceneId: string;
  sceneCount: number;
  assets: readonly StoredAsset[];
  assetCollectionSha256: string;
  primaryByteSha256: string;
  backupByteSha256: string;
  catalog: ProjectCatalogResponse;
  catalogEntry: ProjectCatalogEntry;
  project: ProjectLoadResponse;
  recovery: ProjectRecoveryInspectionReceipt;
  noWrite: true;
  noFoundryWrite: true;
}>;

export type ProjectPersistentAddSceneExecutionReceipt = Readonly<{
  operation: "dicebox.project.add-scene.persist.execute";
  status: "PASS";
  projectId: string;
  batchId: string;
  addedSceneId: string;
  addedOrdinal: number;
  before: ProjectPersistentAddSceneAuthoritativeRead;
  afterApply: ProjectPersistentAddSceneAuthoritativeRead;
  afterUndo: ProjectPersistentAddSceneAuthoritativeRead;
  save: ProjectSaveReceipt;
  inverseRestore: ProjectSaveReceipt;
  history: ProposalBatchHistory;
  projectContentWrite: true;
  projectPersistenceWrite: true;
  sceneContentRestored: true;
  assetsPreserved: true;
  noFoundryWrite: true;
}>;

export type ProjectPersistentAddSceneExecutionFailureCode = "PROJECT_PERSISTENT_ADD_SCENE_NOT_APPROVED" | "PROJECT_PERSISTENT_ADD_SCENE_CONFLICT" | "PROJECT_PERSISTENT_ADD_SCENE_OUTCOME_UNKNOWN";

export class ProjectPersistentAddSceneExecutionError extends Error {
  readonly code: ProjectPersistentAddSceneExecutionFailureCode;
  readonly authoritativeRead: ProjectPersistentAddSceneAuthoritativeRead | null;
  readonly session: DesktopProjectProposalSession | null;

  constructor(code: ProjectPersistentAddSceneExecutionFailureCode, message: string, authoritativeRead: ProjectPersistentAddSceneAuthoritativeRead | null = null, session: DesktopProjectProposalSession | null = null) {
    super(message);
    this.name = "ProjectPersistentAddSceneExecutionError";
    this.code = code;
    this.authoritativeRead = authoritativeRead;
    this.session = session;
  }
}

const stableIdPattern = /^dbx:[a-z0-9][a-z0-9._-]*:[a-z0-9][a-z0-9._-]*$/;
const sceneIdPattern = /^dbx:scene:[a-z0-9][a-z0-9._-]*$/;
const sha256Pattern = /^[0-9a-f]{64}$/;

function conflict(message: string, authoritativeRead: ProjectPersistentAddSceneAuthoritativeRead | null = null): ProjectPersistentAddSceneExecutionError {
  return new ProjectPersistentAddSceneExecutionError("PROJECT_PERSISTENT_ADD_SCENE_CONFLICT", message, authoritativeRead);
}

function record(value: unknown, label: string): Record<string, unknown> {
  if (value === null || typeof value !== "object" || Array.isArray(value)) throw conflict(`${label} must be an object.`);
  return value as Record<string, unknown>;
}

function exactString(value: unknown, pattern: RegExp, label: string): string {
  if (typeof value !== "string" || value.trim() !== value || !pattern.test(value)) throw conflict(`${label} is invalid.`);
  return value;
}

function hash(value: unknown, label: string): string {
  return exactString(value, sha256Pattern, label);
}

function sceneIds(value: unknown, label: string): readonly string[] {
  if (!Array.isArray(value) || value.length === 0 || value.length > 256) throw conflict(`${label} is invalid.`);
  const values = value.map((entry, index) => exactString(entry, sceneIdPattern, `${label}[${index}]`));
  if (new Set(values).size !== values.length) throw conflict(`${label} contains duplicate IDs.`);
  return values;
}

function integer(value: unknown, label: string): number {
  if (!Number.isSafeInteger(value) || (value as number) < 0) throw conflict(`${label} is invalid.`);
  return value as number;
}

function sameStrings(left: readonly string[], right: readonly string[]): boolean {
  return left.length === right.length && left.every((value, index) => value === right[index]);
}

function sameJson(left: readonly string[], right: readonly string[]): boolean {
  return left.length === right.length && left.every((value, index) => value === right[index]);
}

function canonicalize(value: unknown): string {
  if (value === null || typeof value === "string" || typeof value === "boolean") return JSON.stringify(value);
  if (typeof value === "number") {
    if (!Number.isFinite(value)) throw conflict("Persistent add-Scene state cannot contain a non-finite number.");
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

function canonicalLoadedScenes(project: ProjectLoadResponse): readonly SceneDocument[] {
  return project.scenesJson.map((sceneJson) => migrateSceneDocument(JSON.parse(sceneJson) as SceneDocument));
}

function assetCollection(value: readonly StoredAsset[]): readonly StoredAsset[] {
  return value.map((asset) => ({
    sha256: asset.sha256,
    mediaType: asset.mediaType,
    byteLength: asset.byteLength,
    relativePath: asset.relativePath,
    ...(asset.registration === undefined ? {} : { registration: asset.registration }),
  }));
}

async function assetCollectionSha256(assets: readonly StoredAsset[]): Promise<string> {
  return sha256(assetCollection(assets));
}

function exactCatalogEntry(catalog: ProjectCatalogResponse, projectId: string): ProjectCatalogEntry {
  if (!(catalog.status === "PASS" || catalog.status === "PARTIAL") || catalog.noWrite !== true || catalog.noFoundryWrite !== true) throw conflict("Project catalog reread is not an exact no-write PASS or target-eligible PARTIAL result.");
  const matches = catalog.entries.filter((entry) => entry.projectId === projectId);
  if (matches.length !== 1) throw conflict("Project catalog does not contain exactly one entry for the requested project.");
  const entry = matches[0]!;
  if (entry.status !== "PASS" || entry.generation === null || entry.contentSha256 === null) throw conflict("The requested project catalog entry is blocked or lacks content evidence.");
  return entry;
}

function validByteHash(value: string | undefined, label: string): string {
  if (value === undefined || !sha256Pattern.test(value)) throw conflict(`${label} lacks a valid persisted byte hash.`);
  return value;
}

export async function readAuthoritativeProjectPersistentAddSceneState(store: ProjectPersistentAddSceneStore, projectId: string): Promise<ProjectPersistentAddSceneAuthoritativeRead> {
  const catalog = await store.list();
  const catalogEntry = exactCatalogEntry(catalog, projectId);
  const project = await store.load(projectId);
  const recovery = await store.inspect(projectId);
  if (
    project.receipt.status !== "PASS"
    || project.receipt.projectId !== projectId
    || project.receipt.noFoundryWrite !== true
    || recovery.status !== "PASS"
    || recovery.projectId !== projectId
    || recovery.noWrite !== true
    || recovery.noFoundryWrite !== true
    || recovery.generation !== project.receipt.generation
    || recovery.contentSha256 !== project.receipt.contentSha256
    || recovery.primary.status !== "VALID"
    || recovery.backup.status !== "VALID"
  ) throw conflict("Project, recovery, and catalog rereads do not agree on one valid exact project state.");
  if (catalogEntry.generation !== project.receipt.generation || catalogEntry.contentSha256 !== project.receipt.contentSha256) throw conflict("Project catalog and project content rereads disagree on generation or content hash.");
  const scenes = canonicalLoadedScenes(project);
  const state = validateProjectPersistentAddSceneState({ projectId, generation: project.receipt.generation, contentSha256: project.receipt.contentSha256, scenes, activeSceneId: project.activeSceneId });
  return {
    projectId,
    generation: state.generation,
    contentSha256: state.contentSha256,
    sceneIds: state.scenes.map((scene) => scene.id),
    scenesSha256: await hashProjectPersistentAddSceneState(state),
    activeSceneId: state.activeSceneId,
    sceneCount: state.scenes.length,
    assets: assetCollection(project.assets),
    assetCollectionSha256: await assetCollectionSha256(project.assets),
    primaryByteSha256: validByteHash(recovery.primary.byteSha256, "Primary project envelope"),
    backupByteSha256: validByteHash(recovery.backup.byteSha256, "Backup project envelope"),
    catalog,
    catalogEntry,
    project,
    recovery,
    noWrite: true,
    noFoundryWrite: true,
  };
}

type ProjectPersistentAddSceneCommandPayload = Readonly<{
  operation: "project.add-scene.persist";
  projectId: string;
  expectedGeneration: number;
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
  previewSha256: string;
}>;

function exactCommand(session: DesktopProjectProposalSession): ProjectPersistentAddSceneCommandPayload {
  if (session.history.status !== "approved") throw new ProjectPersistentAddSceneExecutionError("PROJECT_PERSISTENT_ADD_SCENE_NOT_APPROVED", `Persistent add-Scene execution requires an approved session; current status is ${session.history.status}.`);
  if (session.batch.producer.kind !== "project-store" || session.batch.producer.sourceId !== "desktop.project.add-scene.persist" || session.batch.producer.provider !== null || session.batch.commands.length !== 1 || session.batch.commands[0]?.kind !== "project.add-scene.persist") throw conflict("Persistent add-Scene execution requires exactly one project-store/no-provider command.");
  const payload = record(session.batch.commands[0].payload, "Persistent add-Scene payload");
  const expectedKeys = ["addedOrdinal", "addedSceneId", "currentActiveSceneId", "currentContentSha256", "currentSceneCount", "currentSceneIds", "currentScenesSha256", "expectedGeneration", "operation", "previewSha256", "proposedActiveSceneId", "proposedSceneCount", "proposedSceneIds", "proposedScenesSha256", "projectId"];
  if (Object.keys(payload).sort().join("|") !== expectedKeys.sort().join("|")) throw conflict("Persistent add-Scene payload contains unknown or missing fields.");
  const parsed = {
    operation: payload.operation,
    projectId: exactString(payload.projectId, stableIdPattern, "projectId"),
    expectedGeneration: integer(payload.expectedGeneration, "expectedGeneration"),
    currentContentSha256: hash(payload.currentContentSha256, "currentContentSha256"),
    currentSceneIds: sceneIds(payload.currentSceneIds, "currentSceneIds"),
    proposedSceneIds: sceneIds(payload.proposedSceneIds, "proposedSceneIds"),
    currentScenesSha256: hash(payload.currentScenesSha256, "currentScenesSha256"),
    proposedScenesSha256: hash(payload.proposedScenesSha256, "proposedScenesSha256"),
    currentActiveSceneId: exactString(payload.currentActiveSceneId, sceneIdPattern, "currentActiveSceneId"),
    proposedActiveSceneId: exactString(payload.proposedActiveSceneId, sceneIdPattern, "proposedActiveSceneId"),
    currentSceneCount: integer(payload.currentSceneCount, "currentSceneCount"),
    proposedSceneCount: integer(payload.proposedSceneCount, "proposedSceneCount"),
    addedSceneId: exactString(payload.addedSceneId, sceneIdPattern, "addedSceneId"),
    addedOrdinal: integer(payload.addedOrdinal, "addedOrdinal"),
    previewSha256: hash(payload.previewSha256, "previewSha256"),
  };
  if (parsed.operation !== "project.add-scene.persist" || parsed.projectId !== session.projectId || parsed.projectId !== session.batch.base.targetId || parsed.expectedGeneration !== session.batch.base.revision || parsed.currentSceneCount < 1 || parsed.currentSceneCount >= 256 || parsed.proposedSceneCount !== parsed.currentSceneCount + 1 || parsed.proposedSceneIds.length !== parsed.proposedSceneCount || parsed.currentSceneIds.length !== parsed.currentSceneCount || parsed.proposedActiveSceneId !== parsed.addedSceneId || parsed.currentSceneIds.includes(parsed.addedSceneId) || !parsed.proposedSceneIds.includes(parsed.addedSceneId) || parsed.addedOrdinal < 2 || parsed.addedOrdinal > 256) throw conflict("Persistent add-Scene payload is not the exact validated metadata-only shape.");
  return parsed as ProjectPersistentAddSceneCommandPayload;
}

function matchedReread(receipt: ProjectPersistentAddSceneAuthoritativeRead, targetId: ProposalBatchReread["targetId"]): ProposalBatchReread {
  return { status: "matched", targetId, revision: receipt.generation, sha256: receipt.contentSha256 };
}

function sceneJson(scenes: readonly SceneDocument[]): readonly string[] {
  return scenes.map(serializeSceneDocument);
}

function nextObservedAt(session: DesktopProjectProposalSession): string {
  const last = session.history.receipts.at(-1)?.observedAt;
  const lastTime = last === undefined ? 0 : Date.parse(last);
  return new Date(Math.max(Date.now(), lastTime + 1)).toISOString();
}

function assertSceneState(read: ProjectPersistentAddSceneAuthoritativeRead, scenes: readonly SceneDocument[], activeSceneId: string, expectedScenesSha256: string, label: string): void {
  const expectedJson = sceneJson(scenes);
  if (read.sceneCount !== scenes.length || read.activeSceneId !== activeSceneId || !sameStrings(read.sceneIds, scenes.map((scene) => scene.id)) || read.scenesSha256 !== expectedScenesSha256 || !sameJson(read.project.scenesJson.map((value) => serializeSceneDocument(migrateSceneDocument(JSON.parse(value) as SceneDocument))), expectedJson)) throw conflict(`${label} did not match the exact ordered Scene collection.`, read);
}

function assertSaveReceipt(receipt: ProjectSaveReceipt, projectId: string, expectedGeneration: number): void {
  if (receipt.operation !== "dicebox.project.save" || receipt.status !== "PASS" || receipt.projectId !== projectId || receipt.generation !== expectedGeneration + 1 || receipt.atomicReplace !== true || receipt.directoryEntrySync !== true || receipt.backupPreserved !== true || receipt.noFoundryWrite !== true) throw conflict("Persistent add-Scene save returned an unexpected or non-attested receipt.");
}

async function assertBase(before: ProjectPersistentAddSceneAuthoritativeRead, command: ProjectPersistentAddSceneCommandPayload, content: Readonly<{ scenes: readonly SceneDocument[]; activeSceneId: string }>, inverse: Readonly<{ scenes: readonly SceneDocument[]; activeSceneId: string }>, batchBaseSha256: string): Promise<Readonly<{ addedOrdinal: number }>> {
  const currentState = validateProjectPersistentAddSceneState({ projectId: before.projectId, generation: before.generation, contentSha256: before.contentSha256, scenes: canonicalLoadedScenes(before.project), activeSceneId: before.activeSceneId });
  const inverseState = validateProjectPersistentAddSceneState({ projectId: before.projectId, generation: before.generation, contentSha256: before.contentSha256, scenes: inverse.scenes, activeSceneId: inverse.activeSceneId });
  const contentState = validateProjectPersistentAddSceneState({ projectId: before.projectId, generation: before.generation, contentSha256: before.contentSha256, scenes: content.scenes, activeSceneId: content.activeSceneId });
  if (batchBaseSha256 !== await hashProjectPersistentAddSceneBase(currentState) || before.generation !== command.expectedGeneration || before.contentSha256 !== command.currentContentSha256 || !sameStrings(before.sceneIds, command.currentSceneIds) || before.sceneCount !== command.currentSceneCount || before.activeSceneId !== command.currentActiveSceneId || before.scenesSha256 !== command.currentScenesSha256 || JSON.stringify(sceneJson(inverseState.scenes)) !== JSON.stringify(sceneJson(currentState.scenes)) || inverseState.activeSceneId !== currentState.activeSceneId) throw conflict("The approved persistent add-Scene base is stale, foreign, or has a mismatched inverse snapshot.", before);
  const added = deriveNextPersistentBlankProjectScene(currentState);
  const expectedScenes = [...currentState.scenes, added.scene];
  if (contentState.activeSceneId !== added.scene.id || contentState.scenes.length !== expectedScenes.length || !sameStrings(contentState.scenes.map((scene) => scene.id), expectedScenes.map((scene) => scene.id)) || await hashProjectPersistentAddSceneState(contentState) !== command.proposedScenesSha256 || !sameStrings(command.proposedSceneIds, expectedScenes.map((scene) => scene.id)) || command.proposedActiveSceneId !== added.scene.id || command.proposedSceneCount !== expectedScenes.length || command.addedSceneId !== added.scene.id || command.addedOrdinal !== added.ordinal) throw conflict("The approved persistent add-Scene proposal does not match deterministic Scene derivation.", before);
  return { addedOrdinal: added.ordinal };
}

export async function executeApprovedProjectPersistentAddScene(input: Readonly<{
  session: unknown;
  content: Readonly<{ scenes: readonly SceneDocument[]; activeSceneId: string }>;
  inverseContent: Readonly<{ scenes: readonly SceneDocument[]; activeSceneId: string }>;
  executor: ProposalBatchActor;
  store?: ProjectPersistentAddSceneStore;
}>): Promise<ProjectPersistentAddSceneExecutionReceipt> {
  const session = await validateDesktopProjectProposalSession(input.session);
  const command = exactCommand(session);
  if (input.executor.role !== "reviewer") throw new ProjectPersistentAddSceneExecutionError("PROJECT_PERSISTENT_ADD_SCENE_NOT_APPROVED", "Persistent add-Scene execution requires a reviewer executor.");
  const store = input.store ?? nativeProjectPersistentAddSceneStore;
  const before = await readAuthoritativeProjectPersistentAddSceneState(store, session.projectId);
  const { addedOrdinal } = await assertBase(before, command, input.content, input.inverseContent, session.batch.base.sha256);
  let applying: DesktopProjectProposalSession;
  try {
    applying = await beginDesktopProjectProposalSessionApply(session, input.executor, session.batch.base, nextObservedAt(session));
  } catch (error) {
    throw conflict(`Persistent add-Scene apply could not begin: ${error instanceof Error ? error.message : String(error)}`, before);
  }
  let save: ProjectSaveReceipt;
  try {
    save = await store.save(session.projectId, input.content.scenes, input.content.activeSceneId, before.generation);
  } catch (error) {
    const reread = await readAuthoritativeProjectPersistentAddSceneState(store, session.projectId).catch(() => null);
    const unknown = await markDesktopProjectProposalOutcomeUnknown(applying, input.executor, nextObservedAt(applying));
    throw new ProjectPersistentAddSceneExecutionError("PROJECT_PERSISTENT_ADD_SCENE_OUTCOME_UNKNOWN", `Persistent add-Scene save outcome is unknown; retry is forbidden until authoritative reread: ${error instanceof Error ? error.message : String(error)}`, reread, unknown);
  }
  assertSaveReceipt(save, session.projectId, before.generation);
  const afterApply = await readAuthoritativeProjectPersistentAddSceneState(store, session.projectId);
  assertSceneState(afterApply, input.content.scenes, input.content.activeSceneId, command.proposedScenesSha256, "Applied persistent add-Scene state");
  if (afterApply.generation !== before.generation + 1 || afterApply.contentSha256 !== save.contentSha256 || afterApply.assetCollectionSha256 !== before.assetCollectionSha256 || afterApply.backupByteSha256 !== before.primaryByteSha256 || afterApply.primaryByteSha256 === before.primaryByteSha256) throw conflict("Applied persistent add-Scene reread did not prove one atomic generation advance and exact asset preservation.", afterApply);
  const committed = await commitDesktopProjectProposalSessionAfterReread(applying, input.executor, matchedReread(afterApply, session.batch.base.targetId), nextObservedAt(applying));
  let inverseRestore: ProjectSaveReceipt;
  try {
    inverseRestore = await store.save(session.projectId, input.inverseContent.scenes, input.inverseContent.activeSceneId, afterApply.generation);
  } catch (error) {
    const reread = await readAuthoritativeProjectPersistentAddSceneState(store, session.projectId).catch(() => null);
    const unknown = await markDesktopProjectProposalOutcomeUnknown(committed, input.executor, nextObservedAt(committed));
    throw new ProjectPersistentAddSceneExecutionError("PROJECT_PERSISTENT_ADD_SCENE_OUTCOME_UNKNOWN", `Persistent add-Scene inverse outcome is unknown; retry is forbidden until authoritative reread: ${error instanceof Error ? error.message : String(error)}`, reread, unknown);
  }
  assertSaveReceipt(inverseRestore, session.projectId, afterApply.generation);
  const afterUndo = await readAuthoritativeProjectPersistentAddSceneState(store, session.projectId);
  const beforeState = validateProjectPersistentAddSceneState({ projectId: before.projectId, generation: before.generation, contentSha256: before.contentSha256, scenes: canonicalLoadedScenes(before.project), activeSceneId: before.activeSceneId });
  const inverseScenesSha256 = await hashProjectPersistentAddSceneState({ projectId: before.projectId, scenes: input.inverseContent.scenes, activeSceneId: input.inverseContent.activeSceneId });
  assertSceneState(afterUndo, input.inverseContent.scenes, input.inverseContent.activeSceneId, inverseScenesSha256, "Inverse-restored persistent add-Scene state");
  if (afterUndo.generation !== afterApply.generation + 1 || afterUndo.assetCollectionSha256 !== before.assetCollectionSha256 || afterUndo.contentSha256 !== inverseRestore.contentSha256 || afterUndo.backupByteSha256 !== afterApply.primaryByteSha256 || afterUndo.primaryByteSha256 === afterApply.primaryByteSha256 || afterUndo.scenesSha256 !== await hashProjectPersistentAddSceneState(beforeState)) throw conflict("Inverse persistent add-Scene reread did not restore the exact original Scene/content selection and asset collection.", afterUndo);
  const undone = await undoDesktopProjectProposalSession(committed, input.executor, matchedReread(afterUndo, session.batch.base.targetId), nextObservedAt(committed));
  return {
    operation: "dicebox.project.add-scene.persist.execute",
    status: "PASS",
    projectId: session.projectId,
    batchId: session.batch.batchId,
    addedSceneId: command.addedSceneId,
    addedOrdinal,
    before,
    afterApply,
    afterUndo,
    save,
    inverseRestore,
    history: undone.history,
    projectContentWrite: true,
    projectPersistenceWrite: true,
    sceneContentRestored: true,
    assetsPreserved: true,
    noFoundryWrite: true,
  };
}
