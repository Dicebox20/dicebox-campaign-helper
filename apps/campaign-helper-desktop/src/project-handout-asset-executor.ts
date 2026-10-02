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
  deriveProjectHandoutAssetDescriptor,
  projectHandoutAssetInputFromCandidate,
  type ProjectHandoutAssetContent,
  type ProjectHandoutAssetDescriptor,
} from "./project-handout-asset-proposal-adapter";

export type ProjectHandoutAssetRegistrationStore = Readonly<{
  list: () => Promise<ProjectCatalogResponse>;
  load: (projectId: string) => Promise<ProjectLoadResponse>;
  inspect: (projectId: string) => Promise<ProjectRecoveryInspectionReceipt>;
  save: (projectId: string, scenes: readonly SceneDocument[], activeSceneId: string, expectedGeneration: number, assets?: readonly ReturnType<typeof projectHandoutAssetInputFromCandidate>[]) => Promise<ProjectSaveReceipt>;
}>;

export const nativeProjectHandoutAssetRegistrationStore: ProjectHandoutAssetRegistrationStore = {
  list: listProjectBundles,
  load: (projectId) => loadProjectBundle(projectId),
  inspect: inspectProjectRecovery,
  save: (projectId, scenes, activeSceneId, expectedGeneration, assets) => saveProjectBundle(projectId, scenes, activeSceneId, expectedGeneration, assets),
};

export type ProjectHandoutAssetAuthoritativeRead = Readonly<{
  projectId: string;
  generation: number;
  contentSha256: string;
  sceneContentSha256: string;
  assetCollectionSha256: string;
  activeSceneId: string;
  sceneCount: number;
  assetCount: number;
  assets: readonly StoredAsset[];
  primaryByteSha256: string;
  backupByteSha256: string | null;
  catalog: ProjectCatalogResponse;
  catalogEntry: ProjectCatalogEntry;
  project: ProjectLoadResponse;
  recovery: ProjectRecoveryInspectionReceipt;
  noWrite: true;
  noFoundryWrite: true;
}>;

export type ProjectHandoutAssetRegistrationExecutionReceipt = Readonly<{
  operation: "dicebox.project.asset.register-handout.execute";
  status: "PASS";
  projectId: string;
  batchId: string;
  asset: ProjectHandoutAssetDescriptor;
  before: ProjectHandoutAssetAuthoritativeRead;
  afterApply: ProjectHandoutAssetAuthoritativeRead;
  afterUndo: ProjectHandoutAssetAuthoritativeRead;
  save: ProjectSaveReceipt;
  inverseRestore: ProjectSaveReceipt;
  history: ProposalBatchHistory;
  projectContentWrite: true;
  assetBytesPersisted: true;
  assetTreePreserved: true;
  sceneContentRestored: true;
  noFoundryWrite: true;
}>;

export type ProjectHandoutAssetRegistrationExecutionFailureCode = "PROJECT_HANDOUT_ASSET_NOT_APPROVED" | "PROJECT_HANDOUT_ASSET_CONFLICT" | "PROJECT_HANDOUT_ASSET_OUTCOME_UNKNOWN";

export class ProjectHandoutAssetRegistrationExecutionError extends Error {
  readonly code: ProjectHandoutAssetRegistrationExecutionFailureCode;
  readonly authoritativeRead: ProjectHandoutAssetAuthoritativeRead | null;
  readonly session: DesktopProjectProposalSession | null;

  constructor(code: ProjectHandoutAssetRegistrationExecutionFailureCode, message: string, authoritativeRead: ProjectHandoutAssetAuthoritativeRead | null = null, session: DesktopProjectProposalSession | null = null) {
    super(message);
    this.name = "ProjectHandoutAssetRegistrationExecutionError";
    this.code = code;
    this.authoritativeRead = authoritativeRead;
    this.session = session;
  }
}

const stableIdPattern = /^dbx:[a-z0-9][a-z0-9._-]*:[a-z0-9][a-z0-9._-]*$/;
const sha256Pattern = /^[0-9a-f]{64}$/;

function conflict(message: string, authoritativeRead: ProjectHandoutAssetAuthoritativeRead | null = null): ProjectHandoutAssetRegistrationExecutionError {
  return new ProjectHandoutAssetRegistrationExecutionError("PROJECT_HANDOUT_ASSET_CONFLICT", message, authoritativeRead);
}

function record(value: unknown, label: string): Record<string, unknown> {
  if (value === null || typeof value !== "object" || Array.isArray(value)) throw conflict(`${label} must be an object.`);
  return value as Record<string, unknown>;
}

function canonicalize(value: unknown): string {
  if (value === null || typeof value === "string" || typeof value === "boolean") return JSON.stringify(value);
  if (typeof value === "number") {
    if (!Number.isFinite(value)) throw conflict("Handout asset state cannot contain a non-finite number.");
    return JSON.stringify(value);
  }
  if (Array.isArray(value)) return `[${value.map(canonicalize).join(",")}]`;
  const object = record(value, "Handout asset state");
  return `{${Object.keys(object).sort().map((key) => `${JSON.stringify(key)}:${canonicalize(object[key])}`).join(",")}}`;
}

async function hashValue(value: unknown): Promise<string> {
  const digest = await globalThis.crypto.subtle.digest("SHA-256", new TextEncoder().encode(canonicalize(value)));
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

function canonicalLoadedSceneJson(project: ProjectLoadResponse): readonly string[] {
  return project.scenesJson.map((stored) => serializeSceneDocument(migrateSceneDocument(JSON.parse(stored) as SceneDocument)));
}

function assetIdentity(asset: StoredAsset): Record<string, unknown> {
  return {
    sha256: asset.sha256,
    mediaType: asset.mediaType,
    byteLength: asset.byteLength,
    relativePath: asset.relativePath,
    ...(asset.registration === undefined ? {} : { registration: asset.registration }),
  };
}

async function hashSceneContent(project: ProjectLoadResponse): Promise<string> {
  return hashValue({ activeSceneId: project.activeSceneId, scenesJson: canonicalLoadedSceneJson(project) });
}

async function hashAssetCollection(assets: readonly StoredAsset[]): Promise<string> {
  return hashValue(assets.map(assetIdentity));
}

async function hashSemanticProjectState(project: ProjectLoadResponse): Promise<string> {
  return hashValue({ activeSceneId: project.activeSceneId, scenesJson: canonicalLoadedSceneJson(project), assets: project.assets.map(assetIdentity) });
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

function validBackupByteHash(recovery: ProjectRecoveryInspectionReceipt, generation: number): string | null {
  if (recovery.backup.status === "VALID") return validByteHash(recovery.backup.byteSha256, "Backup project envelope");
  if (generation === 1 && recovery.backup.status === "MISSING" && recovery.backup.byteSha256 === undefined) return null;
  throw conflict("Backup project envelope is not valid, or its missing first-generation state is not exact.");
}

function registeredAssetIsPresentValid(asset: StoredAsset, recovery: ProjectRecoveryInspectionReceipt): boolean {
  if (asset.registration === undefined) return true;
  const matches = recovery.registeredAssets.filter((candidate) => candidate.assetId === asset.registration?.assetId);
  return matches.length === 1
    && matches[0]?.sha256 === asset.sha256
    && matches[0]?.mediaType === asset.mediaType
    && matches[0]?.byteLength === asset.byteLength
    && matches[0]?.relativePath === asset.relativePath
    && matches[0]?.disposition === "PRESENT_VALID"
    && matches[0]?.blockerCode === undefined;
}

export async function readAuthoritativeProjectHandoutAssetState(store: ProjectHandoutAssetRegistrationStore, projectId: string): Promise<ProjectHandoutAssetAuthoritativeRead> {
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
    || (recovery.backup.status !== "VALID" && !(project.receipt.generation === 1 && recovery.backup.status === "MISSING" && recovery.backup.byteSha256 === undefined))
    || project.assets.some((asset) => !registeredAssetIsPresentValid(asset, recovery))
  ) throw conflict("Project, recovery, catalog, or content-addressed asset rereads do not agree on one exact valid project state.");
  if (catalogEntry.generation !== project.receipt.generation || catalogEntry.contentSha256 !== project.receipt.contentSha256 || catalogEntry.assetCount !== project.assets.length) throw conflict("Project catalog and project content rereads disagree on generation, content hash, or asset count.");
  return {
    projectId,
    generation: project.receipt.generation,
    contentSha256: project.receipt.contentSha256,
    sceneContentSha256: await hashSceneContent(project),
    assetCollectionSha256: await hashAssetCollection(project.assets),
    activeSceneId: project.activeSceneId,
    sceneCount: project.scenesJson.length,
    assetCount: project.assets.length,
    assets: project.assets,
    primaryByteSha256: validByteHash(recovery.primary.byteSha256, "Primary project envelope"),
    backupByteSha256: validBackupByteHash(recovery, project.receipt.generation),
    catalog,
    catalogEntry,
    project,
    recovery,
    noWrite: true,
    noFoundryWrite: true,
  };
}

type ProjectHandoutAssetCommandPayload = Readonly<{
  operation: "project.asset.register-handout";
  projectId: string;
  expectedGeneration: number;
  currentContentSha256: string;
  candidateDescriptorSha256: string;
  assetId: string;
  assetSha256: string;
  role: "handout";
  proposedSceneCount: number;
  proposedActiveSceneId: string;
  proposedAssetCount: number;
}>;

function exactHandoutCommand(session: DesktopProjectProposalSession): ProjectHandoutAssetCommandPayload {
  if (session.history.status !== "approved") throw new ProjectHandoutAssetRegistrationExecutionError("PROJECT_HANDOUT_ASSET_NOT_APPROVED", `Handout asset registration requires an approved session; current status is ${session.history.status}.`);
  if (session.batch.producer.kind !== "project-store" || session.batch.producer.sourceId !== "desktop.project.asset.register-handout" || session.batch.producer.provider !== null || session.batch.commands.length !== 1 || session.batch.commands[0]?.kind !== "project.asset.register-handout") throw conflict("Handout asset registration requires exactly one desktop.project.asset.register-handout project-store command.");
  const payload = record(session.batch.commands[0].payload, "Handout asset registration payload");
  const expectedKeys = ["assetId", "assetSha256", "candidateDescriptorSha256", "currentContentSha256", "expectedGeneration", "operation", "projectId", "proposedActiveSceneId", "proposedAssetCount", "proposedSceneCount", "role"];
  if (Object.keys(payload).sort().join("|") !== expectedKeys.sort().join("|")) throw conflict("Handout asset registration payload contains unknown or missing fields.");
  if (
    payload.operation !== "project.asset.register-handout"
    || payload.projectId !== session.projectId
    || payload.projectId !== session.batch.base.targetId
    || payload.expectedGeneration !== session.batch.base.revision
    || typeof payload.expectedGeneration !== "number"
    || !Number.isSafeInteger(payload.expectedGeneration)
    || typeof payload.currentContentSha256 !== "string"
    || !sha256Pattern.test(payload.currentContentSha256)
    || typeof payload.candidateDescriptorSha256 !== "string"
    || !sha256Pattern.test(payload.candidateDescriptorSha256)
    || typeof payload.assetId !== "string"
    || !stableIdPattern.test(payload.assetId)
    || typeof payload.assetSha256 !== "string"
    || !sha256Pattern.test(payload.assetSha256)
    || payload.role !== "handout"
    || !Number.isSafeInteger(payload.proposedSceneCount)
    || (payload.proposedSceneCount as number) < 1
    || !Number.isSafeInteger(payload.proposedAssetCount)
    || (payload.proposedAssetCount as number) < 1
    || typeof payload.proposedActiveSceneId !== "string"
    || !stableIdPattern.test(payload.proposedActiveSceneId)
  ) throw conflict("Handout asset registration payload is not the exact validated metadata-only shape.");
  return payload as ProjectHandoutAssetCommandPayload;
}

function sameScenes(left: readonly SceneDocument[], right: readonly SceneDocument[]): boolean {
  return JSON.stringify(left.map(serializeSceneDocument)) === JSON.stringify(right.map(serializeSceneDocument));
}

function scenesFromProject(project: ProjectLoadResponse): readonly SceneDocument[] {
  return project.scenesJson.map((stored) => migrateSceneDocument(JSON.parse(stored) as SceneDocument));
}

function assertBeforeState(before: ProjectHandoutAssetAuthoritativeRead, command: ProjectHandoutAssetCommandPayload, content: ProjectHandoutAssetContent, inverseContent: ProjectHandoutAssetContent, descriptor: ProjectHandoutAssetDescriptor): void {
  if (before.generation !== command.expectedGeneration || before.contentSha256 !== command.currentContentSha256 || command.assetId !== descriptor.assetId || command.assetSha256 !== descriptor.assetSha256 || command.proposedSceneCount !== content.scenes.length || command.proposedActiveSceneId !== content.activeSceneId || command.proposedAssetCount !== before.assetCount + 1) throw conflict("Approved PNG handout registration content does not match the authoritative base.", before);
  if (!sameScenes(content.scenes, scenesFromProject(before.project)) || content.activeSceneId !== before.activeSceneId) throw conflict("Handout registration content must preserve the exact authoritative Scene collection and active Scene.", before);
  if (!sameScenes(inverseContent.scenes, scenesFromProject(before.project)) || inverseContent.activeSceneId !== before.activeSceneId || JSON.stringify(inverseContent.candidate.bytes) !== JSON.stringify(content.candidate.bytes) || inverseContent.candidate.label !== content.candidate.label || inverseContent.candidate.provenance !== content.candidate.provenance) throw conflict("Inverse handout restore content does not match the authoritative pre-apply Scene state.", before);
  if (before.assets.some((asset) => asset.sha256 === descriptor.assetSha256 || asset.registration?.assetId === descriptor.assetId)) throw conflict("The approved PNG handout asset already exists in the authoritative base; additive registration would not be an exact new-asset slice.", before);
}

function assertSaveReceipt(receipt: ProjectSaveReceipt, projectId: string, expectedGeneration: number, expectedAssetCount: number): void {
  if (receipt.operation !== "dicebox.project.save" || receipt.status !== "PASS" || receipt.projectId !== projectId || receipt.generation !== expectedGeneration + 1 || receipt.assetCount !== expectedAssetCount || receipt.atomicReplace !== true || receipt.directoryEntrySync !== true || receipt.backupPreserved !== true || receipt.noFoundryWrite !== true) throw conflict("Project handout registration returned an unexpected or non-attested native save receipt.");
}

function assertAppliedState(before: ProjectHandoutAssetAuthoritativeRead, after: ProjectHandoutAssetAuthoritativeRead, receipt: ProjectSaveReceipt, content: ProjectHandoutAssetContent, descriptor: ProjectHandoutAssetDescriptor): void {
  const asset = after.assets.find((candidate) => candidate.sha256 === descriptor.assetSha256);
  if (after.generation !== before.generation + 1 || after.contentSha256 !== receipt.contentSha256 || after.sceneContentSha256 !== before.sceneContentSha256 || after.activeSceneId !== content.activeSceneId || after.sceneCount !== content.scenes.length || after.assetCount !== before.assetCount + 1 || !asset || asset.registration?.assetId !== descriptor.assetId || asset.registration.role !== "handout" || asset.registration.label !== descriptor.label || asset.registration.provenance !== descriptor.provenance || after.recovery.registeredAssets.find((candidate) => candidate.assetId === descriptor.assetId)?.disposition !== "PRESENT_VALID" || after.backupByteSha256 !== before.primaryByteSha256 || after.primaryByteSha256 === before.primaryByteSha256) throw conflict("Post-save reread did not show the exact PNG handout registration or preserved Scene content.", after);
}

function assertRestoredState(before: ProjectHandoutAssetAuthoritativeRead, applied: ProjectHandoutAssetAuthoritativeRead, after: ProjectHandoutAssetAuthoritativeRead, receipt: ProjectSaveReceipt, inverseContent: ProjectHandoutAssetContent, descriptor: ProjectHandoutAssetDescriptor): void {
  const retained = after.assets.find((candidate) => candidate.sha256 === descriptor.assetSha256);
  if (after.generation !== applied.generation + 1 || after.contentSha256 !== receipt.contentSha256 || after.sceneContentSha256 !== before.sceneContentSha256 || after.activeSceneId !== inverseContent.activeSceneId || after.sceneCount !== inverseContent.scenes.length || after.assetCount !== applied.assetCount || !retained || retained.registration?.role !== "handout" || after.assetCollectionSha256 === before.assetCollectionSha256 || after.backupByteSha256 !== applied.primaryByteSha256 || after.primaryByteSha256 === applied.primaryByteSha256) throw conflict("Post-inverse reread did not restore Scene/content state while preserving the additive handout asset tree.", after);
}

function rereadFor(state: ProjectHandoutAssetAuthoritativeRead): ProposalBatchReread {
  return { status: "matched", targetId: state.projectId as ProposalBatchReread["targetId"], revision: state.generation, sha256: state.contentSha256 };
}

export async function executeApprovedProjectHandoutAssetRegistration(input: Readonly<{
  session: unknown;
  content: ProjectHandoutAssetContent;
  inverseContent: ProjectHandoutAssetContent;
  executor: ProposalBatchActor;
  store?: ProjectHandoutAssetRegistrationStore;
}>): Promise<ProjectHandoutAssetRegistrationExecutionReceipt> {
  const session = await validateDesktopProjectProposalSession(input.session);
  const command = exactHandoutCommand(session);
  if (input.executor.role !== "reviewer") throw new ProjectHandoutAssetRegistrationExecutionError("PROJECT_HANDOUT_ASSET_NOT_APPROVED", "Handout asset registration requires a reviewer executor.");
  const store = input.store ?? nativeProjectHandoutAssetRegistrationStore;
  const before = await readAuthoritativeProjectHandoutAssetState(store, session.projectId);
  const descriptor = await deriveProjectHandoutAssetDescriptor(input.content.candidate);
  assertBeforeState(before, command, input.content, input.inverseContent, descriptor);
  const applying = await beginDesktopProjectProposalSessionApply(session, input.executor, session.batch.base, new Date().toISOString());
  const nativeAsset = projectHandoutAssetInputFromCandidate(input.content.candidate, descriptor);
  let save: ProjectSaveReceipt;
  try {
    save = await store.save(session.projectId, input.content.scenes, input.content.activeSceneId, before.generation, [nativeAsset]);
  } catch (error) {
    let authoritativeRead: ProjectHandoutAssetAuthoritativeRead | null = null;
    try { authoritativeRead = await readAuthoritativeProjectHandoutAssetState(store, session.projectId); } catch { /* outcome remains unknown; no retry is safe */ }
    const unknown = await markDesktopProjectProposalOutcomeUnknown(applying, input.executor, new Date().toISOString());
    throw new ProjectHandoutAssetRegistrationExecutionError("PROJECT_HANDOUT_ASSET_OUTCOME_UNKNOWN", `Handout asset registration outcome is unknown; retry is forbidden until authoritative reread: ${error instanceof Error ? error.message : String(error)}`, authoritativeRead, unknown);
  }
  assertSaveReceipt(save, session.projectId, before.generation, before.assetCount + 1);
  const afterApply = await readAuthoritativeProjectHandoutAssetState(store, session.projectId);
  assertAppliedState(before, afterApply, save, input.content, descriptor);
  const committed = await commitDesktopProjectProposalSessionAfterReread(applying, input.executor, rereadFor(afterApply), new Date().toISOString());
  let inverseRestore: ProjectSaveReceipt;
  try {
    inverseRestore = await store.save(session.projectId, input.inverseContent.scenes, input.inverseContent.activeSceneId, afterApply.generation);
  } catch (error) {
    let authoritativeRead: ProjectHandoutAssetAuthoritativeRead | null = null;
    try { authoritativeRead = await readAuthoritativeProjectHandoutAssetState(store, session.projectId); } catch { /* inverse outcome remains unknown; no retry is safe */ }
    const unknown = await markDesktopProjectProposalOutcomeUnknown(committed, input.executor, new Date().toISOString());
    throw new ProjectHandoutAssetRegistrationExecutionError("PROJECT_HANDOUT_ASSET_OUTCOME_UNKNOWN", `Handout asset registration inverse restore outcome is unknown; retry is forbidden until authoritative reread: ${error instanceof Error ? error.message : String(error)}`, authoritativeRead, unknown);
  }
  assertSaveReceipt(inverseRestore, session.projectId, afterApply.generation, afterApply.assetCount);
  const afterUndo = await readAuthoritativeProjectHandoutAssetState(store, session.projectId);
  assertRestoredState(before, afterApply, afterUndo, inverseRestore, input.inverseContent, descriptor);
  const undone = await undoDesktopProjectProposalSession(committed, input.executor, rereadFor(afterUndo), new Date().toISOString());
  return {
    operation: "dicebox.project.asset.register-handout.execute",
    status: "PASS",
    projectId: session.projectId,
    batchId: session.batch.batchId,
    asset: descriptor,
    before,
    afterApply,
    afterUndo,
    save,
    inverseRestore,
    history: undone.history,
    projectContentWrite: true,
    assetBytesPersisted: true,
    assetTreePreserved: true,
    sceneContentRestored: true,
    noFoundryWrite: true,
  };
}
