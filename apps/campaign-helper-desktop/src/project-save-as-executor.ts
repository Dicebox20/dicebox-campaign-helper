import type { ProposalBatchActor, ProposalBatchHistory, ProposalBatchReread } from "@dicebox/core";
import { migrateSceneDocument, serializeSceneDocument, validateSceneDocument, type SceneDocument } from "@dicebox/scene";
import {
  beginDesktopProjectProposalSessionApply,
  commitDesktopProjectProposalSessionAfterReread,
  markDesktopProjectProposalOutcomeUnknown,
  validateDesktopProjectProposalSession,
  type DesktopProjectProposalSession,
} from "./project-proposal-session";
import {
  displayNameFromInput,
  listProjectBundles,
  loadProjectBundle,
  inspectProjectRecovery,
  saveProjectAsBundle,
  type ProjectCatalogEntry,
  type ProjectCatalogResponse,
  type ProjectLoadResponse,
  type ProjectRecoveryInspectionReceipt,
  type ProjectSaveReceipt,
  type StoredAsset,
} from "./project-store";
import { hashProjectPersistentAddSceneState } from "./project-persistent-add-scene-proposal-adapter";

export type ProjectSaveAsStore = Readonly<{
  list: () => Promise<ProjectCatalogResponse>;
  load: (projectId: string) => Promise<ProjectLoadResponse>;
  inspect: (projectId: string) => Promise<ProjectRecoveryInspectionReceipt>;
  saveAs: (sourceProjectId: string, targetProjectId: string, scenes: readonly SceneDocument[], activeSceneId: string, displayName: string, expectedWorkspaceGeneration: number) => Promise<ProjectSaveReceipt>;
}>;

export const nativeProjectSaveAsStore: ProjectSaveAsStore = {
  list: listProjectBundles,
  load: (projectId) => loadProjectBundle(projectId),
  inspect: inspectProjectRecovery,
  saveAs: saveProjectAsBundle,
};

type ProjectSaveAsProjectRead = Readonly<{
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

export type ProjectSaveAsAuthoritativeRead = Readonly<{
  source: ProjectSaveAsProjectRead;
  target: ProjectSaveAsProjectRead | null;
  targetAbsent: boolean;
  workspaceIndexGeneration: number;
  catalog: ProjectCatalogResponse;
  noWrite: true;
  noFoundryWrite: true;
}>;

export type ProjectSaveAsExecutionReceipt = Readonly<{
  operation: "dicebox.project.save-as.execute";
  status: "PASS";
  sourceProjectId: string;
  targetProjectId: string;
  batchId: string;
  before: ProjectSaveAsAuthoritativeRead;
  afterApply: ProjectSaveAsAuthoritativeRead;
  saveAs: ProjectSaveReceipt;
  history: ProposalBatchHistory;
  projectContentWrite: true;
  projectPersistenceWrite: true;
  sourcePreserved: true;
  targetCreated: true;
  noFoundryWrite: true;
}>;

export type ProjectSaveAsExecutionFailureCode = "PROJECT_SAVE_AS_NOT_APPROVED" | "PROJECT_SAVE_AS_CONFLICT" | "PROJECT_SAVE_AS_OUTCOME_UNKNOWN";

export class ProjectSaveAsExecutionError extends Error {
  readonly code: ProjectSaveAsExecutionFailureCode;
  readonly authoritativeRead: ProjectSaveAsAuthoritativeRead | null;
  readonly session: DesktopProjectProposalSession | null;

  constructor(code: ProjectSaveAsExecutionFailureCode, message: string, authoritativeRead: ProjectSaveAsAuthoritativeRead | null = null, session: DesktopProjectProposalSession | null = null) {
    super(message);
    this.name = "ProjectSaveAsExecutionError";
    this.code = code;
    this.authoritativeRead = authoritativeRead;
    this.session = session;
  }
}

const stableIdPattern = /^dbx:[a-z0-9][a-z0-9._-]*:[a-z0-9][a-z0-9._-]*$/;
const sceneIdPattern = /^dbx:scene:[a-z0-9][a-z0-9._-]*$/;
const sha256Pattern = /^[0-9a-f]{64}$/;

function conflict(message: string, read: ProjectSaveAsAuthoritativeRead | null = null): ProjectSaveAsExecutionError {
  return new ProjectSaveAsExecutionError("PROJECT_SAVE_AS_CONFLICT", message, read);
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
    if (!Number.isFinite(value)) throw conflict("Save-as state cannot contain a non-finite number.");
    return JSON.stringify(value);
  }
  if (Array.isArray(value)) return `[${value.map(canonicalize).join(",")}]`;
  const object = record(value, "Save-as state");
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

function registeredAssetsMatch(project: ProjectLoadResponse, recovery: ProjectRecoveryInspectionReceipt): boolean {
  const expected = project.assets.filter((asset) => asset.registration !== undefined);
  if (recovery.registeredAssets.length !== expected.length) return false;
  const observedIds = new Set<string>();
  return expected.every((asset) => {
    const registration = asset.registration!;
    const observed = recovery.registeredAssets.find((candidate) => candidate.assetId === registration.assetId);
    if (!observed || observedIds.has(observed.assetId)) return false;
    observedIds.add(observed.assetId);
    return observed.role === registration.role
      && observed.sha256 === asset.sha256
      && observed.mediaType === asset.mediaType
      && observed.byteLength === asset.byteLength
      && observed.relativePath === asset.relativePath
      && observed.disposition === "PRESENT_VALID";
  });
}

async function readProject(store: ProjectSaveAsStore, catalog: ProjectCatalogResponse, projectId: string): Promise<ProjectSaveAsProjectRead> {
  const entry = catalogEntry(catalog, projectId);
  const project = await store.load(projectId);
  const recovery = await store.inspect(projectId);
  if (project.receipt.status !== "PASS" || project.receipt.projectId !== projectId || project.receipt.noFoundryWrite !== true || project.receipt.assetCount !== project.assets.length || recovery.status !== "PASS" || recovery.projectId !== projectId || recovery.noWrite !== true || recovery.noFoundryWrite !== true || recovery.generation !== project.receipt.generation || recovery.contentSha256 !== project.receipt.contentSha256 || recovery.primary.status !== "VALID" || !backupIsValidForProject(project.receipt.generation, recovery.backup.status) || !registeredAssetsMatch(project, recovery) || entry.generation !== project.receipt.generation || entry.contentSha256 !== project.receipt.contentSha256) throw conflict("Source or target project, catalog, and recovery rereads do not agree on one valid exact project and asset tree.");
  const scenes = project.scenesJson.map((value) => migrateSceneDocument(JSON.parse(value) as SceneDocument));
  for (const [index, scene] of scenes.entries()) {
    const errors = validateSceneDocument(scene);
    if (errors.length > 0) throw conflict(`Project ${projectId} contains an invalid Scene at index ${index}: ${errors.join("; ")}`);
  }
  const sceneIdsValue = scenes.map((scene) => exactString(scene.id, sceneIdPattern, "scene.id"));
  if (scenes.length === 0 || scenes.length > 256 || new Set(sceneIdsValue).size !== scenes.length || !sceneIdsValue.includes(project.activeSceneId)) throw conflict("Project save-as requires an ordered unique Scene collection and an active Scene.");
  const state = { projectId, scenes, activeSceneId: project.activeSceneId } as const;
  return {
    projectId,
    generation: project.receipt.generation,
    contentSha256: project.receipt.contentSha256,
    sceneIds: sceneIdsValue,
    scenesSha256: await hashProjectPersistentAddSceneState(state),
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

export async function readAuthoritativeProjectSaveAsState(store: ProjectSaveAsStore, sourceProjectId: string, targetProjectId: string): Promise<ProjectSaveAsAuthoritativeRead> {
  const catalog = await store.list();
  const source = await readProject(store, catalog, sourceProjectId);
  const targetMatches = catalog.entries.filter((entry) => entry.projectId === targetProjectId);
  if (targetMatches.length > 0) throw conflict("Project save-as target already exists; no overwrite or cleanup is permitted.");
  return { source, target: null, targetAbsent: true, workspaceIndexGeneration: catalog.workspaceIndexGeneration, catalog, noWrite: true, noFoundryWrite: true };
}

async function readAfterSaveAs(store: ProjectSaveAsStore, sourceProjectId: string, targetProjectId: string): Promise<ProjectSaveAsAuthoritativeRead> {
  const catalog = await store.list();
  const source = await readProject(store, catalog, sourceProjectId);
  const target = await readProject(store, catalog, targetProjectId);
  return { source, target, targetAbsent: false, workspaceIndexGeneration: catalog.workspaceIndexGeneration, catalog, noWrite: true, noFoundryWrite: true };
}

type ProjectSaveAsCommandPayload = Readonly<{
  operation: "project.save-as";
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
  previewSha256: string;
}>;

function exactCommand(session: DesktopProjectProposalSession): ProjectSaveAsCommandPayload {
  if (session.history.status !== "approved") throw new ProjectSaveAsExecutionError("PROJECT_SAVE_AS_NOT_APPROVED", `Project save-as execution requires an approved session; current status is ${session.history.status}.`);
  if (session.batch.producer.kind !== "project-store" || session.batch.producer.sourceId !== "desktop.project.save-as" || session.batch.producer.provider !== null || session.batch.commands.length !== 1 || session.batch.commands[0]?.kind !== "project.save-as") throw conflict("Project save-as execution requires exactly one project-store/no-provider command.");
  const payload = record(session.batch.commands[0].payload, "Project save-as payload");
  const expectedKeys = ["operation", "sourceProjectId", "targetProjectId", "sourceGeneration", "sourceContentSha256", "sourceAssetCount", "sourceAssetCollectionSha256", "workspaceIndexGeneration", "sourceSceneIds", "sourceScenesSha256", "sourceActiveSceneId", "sourceSceneCount", "proposedDisplayName", "targetAbsent", "previewSha256"];
  if (Object.keys(payload).sort().join("|") !== expectedKeys.sort().join("|")) throw conflict("Project save-as payload contains unknown or missing fields.");
  const parsed = {
    operation: payload.operation,
    sourceProjectId: exactString(payload.sourceProjectId, stableIdPattern, "sourceProjectId"),
    targetProjectId: exactString(payload.targetProjectId, stableIdPattern, "targetProjectId"),
    sourceGeneration: integer(payload.sourceGeneration, "sourceGeneration"),
    sourceContentSha256: hash(payload.sourceContentSha256, "sourceContentSha256"),
    sourceAssetCount: integer(payload.sourceAssetCount, "sourceAssetCount"),
    sourceAssetCollectionSha256: hash(payload.sourceAssetCollectionSha256, "sourceAssetCollectionSha256"),
    workspaceIndexGeneration: integer(payload.workspaceIndexGeneration, "workspaceIndexGeneration"),
    sourceSceneIds: ids(payload.sourceSceneIds, "sourceSceneIds"),
    sourceScenesSha256: hash(payload.sourceScenesSha256, "sourceScenesSha256"),
    sourceActiveSceneId: exactString(payload.sourceActiveSceneId, sceneIdPattern, "sourceActiveSceneId"),
    sourceSceneCount: integer(payload.sourceSceneCount, "sourceSceneCount"),
    proposedDisplayName: displayNameFromInput(exactString(payload.proposedDisplayName, /^.+$/, "proposedDisplayName")),
    targetAbsent: payload.targetAbsent,
    previewSha256: hash(payload.previewSha256, "previewSha256"),
  };
  if (parsed.operation !== "project.save-as" || parsed.sourceProjectId !== session.projectId || parsed.sourceProjectId !== session.batch.base.targetId || parsed.targetProjectId === parsed.sourceProjectId || parsed.sourceGeneration !== session.batch.base.revision || parsed.targetAbsent !== true || parsed.sourceSceneIds.length !== parsed.sourceSceneCount || parsed.sourceSceneCount < 1) throw conflict("Project save-as payload is not the exact validated metadata-only shape.");
  return parsed as ProjectSaveAsCommandPayload;
}

function nextObservedAt(session: DesktopProjectProposalSession): string {
  const last = session.history.receipts.at(-1)?.observedAt;
  const lastTime = last === undefined ? 0 : Date.parse(last);
  return new Date(Math.max(Date.now(), lastTime + 1)).toISOString();
}

async function assertBase(before: ProjectSaveAsAuthoritativeRead, command: ProjectSaveAsCommandPayload, content: Readonly<{ scenes: readonly SceneDocument[]; activeSceneId: string }>, baseSha256: string): Promise<void> {
  const source = before.source;
  const contentScenesSha256 = await hashProjectPersistentAddSceneState({ projectId: command.sourceProjectId, scenes: content.scenes, activeSceneId: content.activeSceneId });
  const expectedBase = await sha256({ sourceContentSha256: command.sourceContentSha256, sourceGeneration: command.sourceGeneration, sourceProjectId: command.sourceProjectId, targetProjectId: command.targetProjectId, workspaceIndexGeneration: command.workspaceIndexGeneration });
  if (baseSha256 !== expectedBase || source.generation !== command.sourceGeneration || source.contentSha256 !== command.sourceContentSha256 || source.assets.length !== command.sourceAssetCount || source.assetCollectionSha256 !== command.sourceAssetCollectionSha256 || before.workspaceIndexGeneration !== command.workspaceIndexGeneration || !sameStrings(source.sceneIds, command.sourceSceneIds) || source.sceneCount !== command.sourceSceneCount || source.activeSceneId !== command.sourceActiveSceneId || source.scenesSha256 !== command.sourceScenesSha256 || !sameStrings(source.sceneIds, content.scenes.map((scene) => scene.id)) || content.activeSceneId !== source.activeSceneId || contentScenesSha256 !== command.sourceScenesSha256) throw conflict("The approved save-as base is stale, foreign, or does not preserve the exact source Scene and asset collection.", before);
}

function sourceReread(receipt: ProjectSaveAsAuthoritativeRead): ProposalBatchReread {
  return { status: "matched", targetId: receipt.source.projectId as ProposalBatchReread["targetId"], revision: receipt.source.generation, sha256: receipt.source.contentSha256 };
}

function sameAssets(left: readonly StoredAsset[], right: readonly StoredAsset[]): boolean {
  return left.length === right.length && left.every((asset, index) => {
    const other = right[index];
    if (!other || asset.sha256 !== other.sha256 || asset.mediaType !== other.mediaType || asset.byteLength !== other.byteLength || asset.relativePath !== other.relativePath) return false;
    if (asset.registration === undefined || other.registration === undefined) return asset.registration === other.registration;
    return asset.registration.assetId === other.registration.assetId
      && asset.registration.role === other.registration.role
      && asset.registration.label === other.registration.label
      && asset.registration.provenance === other.registration.provenance
      && asset.registration.approval === other.registration.approval;
  });
}

export async function executeApprovedProjectSaveAs(input: Readonly<{
  session: unknown;
  content: Readonly<{ scenes: readonly SceneDocument[]; activeSceneId: string }>;
  executor: ProposalBatchActor;
  store?: ProjectSaveAsStore;
}>): Promise<ProjectSaveAsExecutionReceipt> {
  const session = await validateDesktopProjectProposalSession(input.session);
  const command = exactCommand(session);
  if (input.executor.role !== "reviewer") throw new ProjectSaveAsExecutionError("PROJECT_SAVE_AS_NOT_APPROVED", "Project save-as execution requires a reviewer executor.");
  const store = input.store ?? nativeProjectSaveAsStore;
  const before = await readAuthoritativeProjectSaveAsState(store, command.sourceProjectId, command.targetProjectId);
  await assertBase(before, command, input.content, session.batch.base.sha256);
  let applying: DesktopProjectProposalSession;
  try {
    applying = await beginDesktopProjectProposalSessionApply(session, input.executor, session.batch.base, nextObservedAt(session));
  } catch (error) {
    throw conflict(`Project save-as apply could not begin: ${error instanceof Error ? error.message : String(error)}`, before);
  }
  let saveAs: ProjectSaveReceipt;
  try {
    saveAs = await store.saveAs(command.sourceProjectId, command.targetProjectId, input.content.scenes, input.content.activeSceneId, command.proposedDisplayName, before.workspaceIndexGeneration);
  } catch (error) {
    const reread = await readAuthoritativeProjectSaveAsState(store, command.sourceProjectId, command.targetProjectId).catch(() => null);
    const unknown = await markDesktopProjectProposalOutcomeUnknown(applying, input.executor, nextObservedAt(applying));
    throw new ProjectSaveAsExecutionError("PROJECT_SAVE_AS_OUTCOME_UNKNOWN", `Project save-as outcome is unknown; retry is forbidden until authoritative reread: ${error instanceof Error ? error.message : String(error)}`, reread, unknown);
  }
  const saveAsReceiptIsAttested = saveAs.operation === "dicebox.project.save-as"
    && saveAs.status === "PASS"
    && saveAs.projectId === command.targetProjectId
    && saveAs.generation >= 1
    && saveAs.atomicReplace === true
    && saveAs.directoryEntrySync === true
    && saveAs.noFoundryWrite === true
    && saveAs.workspaceMetadata?.projectId === command.targetProjectId
    && saveAs.workspaceMetadata?.displayName === command.proposedDisplayName
    && saveAs.workspaceMetadata?.indexGeneration === before.workspaceIndexGeneration + 1
    && saveAs.assetCount === command.sourceAssetCount
    && saveAs.workspaceMetadata?.noFoundryWrite === true;
  if (!saveAsReceiptIsAttested) {
    const reread = await readAfterSaveAs(store, command.sourceProjectId, command.targetProjectId).catch(() => null);
    const unknown = await markDesktopProjectProposalOutcomeUnknown(applying, input.executor, nextObservedAt(applying));
    throw new ProjectSaveAsExecutionError("PROJECT_SAVE_AS_OUTCOME_UNKNOWN", "Project save-as returned an incomplete or non-attested post-write receipt; retry is forbidden until authoritative reread.", reread, unknown);
  }
  const afterApply = await readAfterSaveAs(store, command.sourceProjectId, command.targetProjectId);
  const targetScenesSha256 = await hashProjectPersistentAddSceneState({ projectId: command.targetProjectId, scenes: input.content.scenes, activeSceneId: input.content.activeSceneId });
  if (!afterApply.target || afterApply.workspaceIndexGeneration !== saveAs.workspaceMetadata!.indexGeneration || afterApply.target.projectId !== command.targetProjectId || afterApply.target.sceneCount !== input.content.scenes.length || afterApply.target.activeSceneId !== input.content.activeSceneId || afterApply.target.scenesSha256 !== targetScenesSha256 || afterApply.target.assets.length !== before.source.assets.length || afterApply.target.assetCollectionSha256 !== before.source.assetCollectionSha256 || !sameAssets(afterApply.target.assets, before.source.assets) || afterApply.source.generation !== before.source.generation || afterApply.source.contentSha256 !== before.source.contentSha256 || afterApply.source.scenesSha256 !== before.source.scenesSha256 || afterApply.source.activeSceneId !== before.source.activeSceneId || afterApply.source.assetCollectionSha256 !== before.source.assetCollectionSha256 || afterApply.target.catalogEntry.displayName !== command.proposedDisplayName || afterApply.target.catalogEntry.contentSha256 !== saveAs.contentSha256 || afterApply.target.generation !== saveAs.generation || afterApply.catalog.status === "PARTIAL" && afterApply.catalog.entries.length === 0) throw conflict("Post-save-as reread did not prove exact target content, source preservation, workspace metadata, target asset tree, and target validity.", afterApply);
  const committed = await commitDesktopProjectProposalSessionAfterReread(applying, input.executor, sourceReread(afterApply), nextObservedAt(applying));
  return {
    operation: "dicebox.project.save-as.execute",
    status: "PASS",
    sourceProjectId: command.sourceProjectId,
    targetProjectId: command.targetProjectId,
    batchId: session.batch.batchId,
    before,
    afterApply,
    saveAs,
    history: committed.history,
    projectContentWrite: true,
    projectPersistenceWrite: true,
    sourcePreserved: true,
    targetCreated: true,
    noFoundryWrite: true,
  };
}
