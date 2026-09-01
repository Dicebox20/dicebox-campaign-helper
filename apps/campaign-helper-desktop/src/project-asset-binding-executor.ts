import type { ProposalBatchActor, ProposalBatchHistory, ProposalBatchReread } from "@dicebox/core";
import { migrateSceneDocument, serializeSceneDocument, type SceneDocument } from "@dicebox/scene";
import {
  beginDesktopProjectProposalSessionApply,
  commitDesktopProjectProposalSessionAfterReread,
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
  deriveProjectBackgroundAssetDescriptor,
  projectAssetInputFromCandidate,
  sceneWithBackgroundAsset,
  serializeProjectAssetBindingScenes,
  type ProjectAssetBindingDescriptor,
  type ProjectAssetBindingContent,
} from "./project-asset-binding-proposal-adapter";

export type ProjectAssetBindingStore = Readonly<{
  list: () => Promise<ProjectCatalogResponse>;
  load: (projectId: string) => Promise<ProjectLoadResponse>;
  inspect: (projectId: string) => Promise<ProjectRecoveryInspectionReceipt>;
  save: (projectId: string, scenes: readonly SceneDocument[], activeSceneId: string, expectedGeneration: number, assets: readonly ReturnType<typeof projectAssetInputFromCandidate>[]) => Promise<ProjectSaveReceipt>;
}>;

export const nativeProjectAssetBindingStore: ProjectAssetBindingStore = {
  list: listProjectBundles,
  load: (projectId) => loadProjectBundle(projectId),
  inspect: inspectProjectRecovery,
  save: (projectId, scenes, activeSceneId, expectedGeneration, assets) => saveProjectBundle(projectId, scenes, activeSceneId, expectedGeneration, assets),
};

export type ProjectAssetBindingAuthoritativeRead = Readonly<{
  projectId: string;
  generation: number;
  contentSha256: string;
  semanticContentSha256: string;
  sceneContentSha256: string;
  assetCollectionSha256: string;
  activeSceneId: string;
  sceneCount: number;
  assetCount: number;
  backgroundBindings: readonly Readonly<{ sceneId: string; assetId: string | null }>[];
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

export type ProjectAssetBindingExecutionReceipt = Readonly<{
  operation: "dicebox.project.asset.bind.execute";
  status: "PASS";
  projectId: string;
  batchId: string;
  asset: ProjectAssetBindingDescriptor;
  before: ProjectAssetBindingAuthoritativeRead;
  afterApply: ProjectAssetBindingAuthoritativeRead;
  afterUndo: ProjectAssetBindingAuthoritativeRead;
  save: ProjectSaveReceipt;
  inverseRestore: ProjectSaveReceipt;
  history: ProposalBatchHistory;
  projectContentWrite: true;
  assetBytesPersisted: true;
  assetAdded: boolean;
  assetTreePreserved: true;
  sceneContentRestored: true;
  noFoundryWrite: true;
}>;

export type ProjectAssetBindingCommitReceipt = Readonly<{
  operation: "dicebox.project.asset.bind.commit";
  status: "PASS";
  projectId: string;
  batchId: string;
  asset: ProjectAssetBindingDescriptor;
  before: ProjectAssetBindingAuthoritativeRead;
  afterApply: ProjectAssetBindingAuthoritativeRead;
  save: ProjectSaveReceipt;
  history: ProposalBatchHistory;
  projectContentWrite: true;
  assetBytesPersisted: true;
  assetAdded: boolean;
  assetTreePreserved: true;
  noFoundryWrite: true;
}>;

export type ProjectAssetBindingExecutionFailureCode = "PROJECT_ASSET_BIND_NOT_APPROVED" | "PROJECT_ASSET_BIND_CONFLICT" | "PROJECT_ASSET_BIND_OUTCOME_UNKNOWN";

export class ProjectAssetBindingExecutionError extends Error {
  readonly code: ProjectAssetBindingExecutionFailureCode;
  readonly authoritativeRead: ProjectAssetBindingAuthoritativeRead | null;

  constructor(code: ProjectAssetBindingExecutionFailureCode, message: string, authoritativeRead: ProjectAssetBindingAuthoritativeRead | null = null) {
    super(message);
    this.name = "ProjectAssetBindingExecutionError";
    this.code = code;
    this.authoritativeRead = authoritativeRead;
  }
}

const stableIdPattern = /^dbx:[a-z0-9][a-z0-9._-]*:[a-z0-9][a-z0-9._-]*$/;
const sha256Pattern = /^[0-9a-f]{64}$/;

function conflict(message: string, authoritativeRead: ProjectAssetBindingAuthoritativeRead | null = null): ProjectAssetBindingExecutionError {
  return new ProjectAssetBindingExecutionError("PROJECT_ASSET_BIND_CONFLICT", message, authoritativeRead);
}

function record(value: unknown, label: string): Record<string, unknown> {
  if (value === null || typeof value !== "object" || Array.isArray(value)) throw conflict(`${label} must be an object.`);
  return value as Record<string, unknown>;
}

function canonicalize(value: unknown): string {
  if (value === null || typeof value === "string" || typeof value === "boolean") return JSON.stringify(value);
  if (typeof value === "number") {
    if (!Number.isFinite(value)) throw conflict("Project asset binding state cannot contain a non-finite number.");
    return JSON.stringify(value);
  }
  if (Array.isArray(value)) return `[${value.map(canonicalize).join(",")}]`;
  const object = record(value, "Project asset binding state");
  return `{${Object.keys(object).sort().map((key) => `${JSON.stringify(key)}:${canonicalize(object[key])}`).join(",")}}`;
}

async function hashValue(value: unknown): Promise<string> {
  const digest = await globalThis.crypto.subtle.digest("SHA-256", new TextEncoder().encode(canonicalize(value)));
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

function canonicalLoadedSceneJson(project: ProjectLoadResponse): readonly string[] {
  return project.scenesJson.map((stored) => serializeSceneDocument(migrateSceneDocument(JSON.parse(stored) as SceneDocument)));
}

function backgroundBindings(project: ProjectLoadResponse): readonly Readonly<{ sceneId: string; assetId: string | null }>[] {
  return project.scenesJson.map((stored) => {
    const scene = migrateSceneDocument(JSON.parse(stored) as SceneDocument);
    return { sceneId: scene.id, assetId: scene.background.assetId ?? null };
  });
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

async function hashSemanticProjectState(project: ProjectLoadResponse): Promise<string> {
  return hashValue({ activeSceneId: project.activeSceneId, scenesJson: canonicalLoadedSceneJson(project), assets: project.assets.map(assetIdentity) });
}

async function hashSceneContent(project: ProjectLoadResponse): Promise<string> {
  return hashValue({ activeSceneId: project.activeSceneId, scenesJson: canonicalLoadedSceneJson(project) });
}

async function hashAssetCollection(assets: readonly StoredAsset[]): Promise<string> {
  return hashValue(assets.map(assetIdentity));
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

export async function readAuthoritativeProjectAssetBindingState(store: ProjectAssetBindingStore, projectId: string): Promise<ProjectAssetBindingAuthoritativeRead> {
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
    || (recovery.backup.status !== "VALID" && recovery.backup.status !== "MISSING")
    || project.assets.some((asset) => !registeredAssetIsPresentValid(asset, recovery))
  ) throw conflict("Project, recovery, catalog, or content-addressed asset rereads do not agree on one exact valid project state.");
  if (catalogEntry.generation !== project.receipt.generation || catalogEntry.contentSha256 !== project.receipt.contentSha256 || catalogEntry.assetCount !== project.assets.length) throw conflict("Project catalog and project content rereads disagree on generation, content hash, or asset count.");
  return {
    projectId,
    generation: project.receipt.generation,
    contentSha256: project.receipt.contentSha256,
    semanticContentSha256: await hashSemanticProjectState(project),
    sceneContentSha256: await hashSceneContent(project),
    assetCollectionSha256: await hashAssetCollection(project.assets),
    activeSceneId: project.activeSceneId,
    sceneCount: project.scenesJson.length,
    assetCount: project.assets.length,
    backgroundBindings: backgroundBindings(project),
    assets: project.assets,
    primaryByteSha256: validByteHash(recovery.primary.byteSha256, "Primary project envelope"),
    backupByteSha256: recovery.backup.status === "VALID" ? validByteHash(recovery.backup.byteSha256, "Backup project envelope") : null,
    catalog,
    catalogEntry,
    project,
    recovery,
    noWrite: true,
    noFoundryWrite: true,
  };
}

type ProjectAssetBindingCommandPayload = Readonly<{
  operation: "project.asset.bind";
  projectId: string;
  expectedGeneration: number;
  currentContentSha256: string;
  candidateDescriptorSha256: string;
  assetId: string;
  assetSha256: string;
  role: "background";
  sceneId: string;
  proposedSceneCount: number;
  proposedActiveSceneId: string;
  proposedAssetCount: number;
}>;

function exactAssetBindingCommand(session: DesktopProjectProposalSession): ProjectAssetBindingCommandPayload {
  if (session.history.status !== "approved") throw new ProjectAssetBindingExecutionError("PROJECT_ASSET_BIND_NOT_APPROVED", `Project asset binding requires an approved session; current status is ${session.history.status}.`);
  if (session.batch.producer.kind !== "project-store" || session.batch.producer.sourceId !== "desktop.project.asset.bind" || session.batch.producer.provider !== null || session.batch.commands.length !== 1 || session.batch.commands[0]?.kind !== "project.asset.bind") throw conflict("Project asset binding requires exactly one desktop.project.asset.bind project-store command.");
  const payload = record(session.batch.commands[0].payload, "Project asset binding payload");
  const expectedKeys = ["assetId", "assetSha256", "candidateDescriptorSha256", "currentContentSha256", "expectedGeneration", "operation", "projectId", "proposedActiveSceneId", "proposedAssetCount", "proposedSceneCount", "role", "sceneId"];
  if (Object.keys(payload).sort().join("|") !== expectedKeys.sort().join("|")) throw conflict("Project asset binding payload contains unknown or missing fields.");
  if (
    payload.operation !== "project.asset.bind"
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
    || payload.role !== "background"
    || typeof payload.sceneId !== "string"
    || !stableIdPattern.test(payload.sceneId)
    || !Number.isSafeInteger(payload.proposedSceneCount)
    || (payload.proposedSceneCount as number) < 1
    || !Number.isSafeInteger(payload.proposedAssetCount)
    || (payload.proposedAssetCount as number) < 0
    || typeof payload.proposedActiveSceneId !== "string"
    || !stableIdPattern.test(payload.proposedActiveSceneId)
  ) throw conflict("Project asset binding payload is not the exact validated metadata-only shape.");
  return payload as ProjectAssetBindingCommandPayload;
}

function sameScenes(left: readonly SceneDocument[], right: readonly SceneDocument[]): boolean {
  return JSON.stringify(serializeProjectAssetBindingScenes(left)) === JSON.stringify(serializeProjectAssetBindingScenes(right));
}

function sceneForBinding(content: ProjectAssetBindingContent, descriptor: ProjectAssetBindingDescriptor): SceneDocument {
  const scene = content.scenes.find((candidate) => candidate.id === content.sceneId);
  if (!scene) throw conflict("Asset binding target Scene is not present in the supplied content.");
  return sceneWithBackgroundAsset(scene, descriptor.assetId);
}

type ProjectAssetBindingPlan = Readonly<{ assetAlreadyRegistered: boolean; expectedAssetCount: number }>;

function exactCandidateAsset(asset: StoredAsset | undefined, descriptor: ProjectAssetBindingDescriptor, content: ProjectAssetBindingContent): boolean {
  const registration = asset?.registration;
  return asset !== undefined
    && registration !== undefined
    && asset.mediaType === descriptor.mediaType
    && asset.byteLength === content.candidate.bytes.length
    && asset.relativePath === `assets/sha256/${descriptor.assetSha256}`
    && registration.assetId === descriptor.assetId
    && registration.role === descriptor.role
    && registration.label === descriptor.label
    && registration.provenance === descriptor.provenance
    && registration.approval === "approved";
}

function preservesAssetTree(before: readonly StoredAsset[], after: readonly StoredAsset[]): boolean {
  return before.every((asset) => after.some((candidate) => JSON.stringify(assetIdentity(candidate)) === JSON.stringify(assetIdentity(asset))));
}

function assertBeforeState(before: ProjectAssetBindingAuthoritativeRead, command: ProjectAssetBindingCommandPayload, content: ProjectAssetBindingContent, inverseContent: ProjectAssetBindingContent, descriptor: ProjectAssetBindingDescriptor): ProjectAssetBindingPlan {
  const existing = before.assets.find((asset) => asset.sha256 === descriptor.assetSha256);
  const assetAlreadyRegistered = existing !== undefined;
  const expectedAssetCount = before.assetCount + (assetAlreadyRegistered ? 0 : 1);
  if (before.generation !== command.expectedGeneration || before.contentSha256 !== command.currentContentSha256 || command.assetId !== descriptor.assetId || command.assetSha256 !== descriptor.assetSha256 || command.sceneId !== content.sceneId || command.proposedSceneCount !== content.scenes.length || command.proposedActiveSceneId !== content.activeSceneId || command.proposedAssetCount !== expectedAssetCount || descriptor.role !== "background" || descriptor.mediaType !== "image/png") throw conflict("Approved PNG background binding content does not match the authoritative base.", before);
  if (existing && !exactCandidateAsset(existing, descriptor, content)) throw conflict("The approved PNG candidate collides with a non-identical persisted asset identity.", before);
  const currentTarget = before.backgroundBindings.find((binding) => binding.sceneId === content.sceneId);
  if (!currentTarget || currentTarget.assetId === descriptor.assetId) throw conflict("The approved background binding must target one exact Scene whose current binding differs.", before);
  const expectedApplied = content.scenes.map((scene) => scene.id === content.sceneId ? sceneForBinding(content, descriptor) : scene);
  if (!sameScenes(content.scenes, expectedApplied)) throw conflict("Proposed content changes more than the one exact Scene background binding.", before);
  if (!sameScenes(inverseContent.scenes, before.project.scenesJson.map((stored) => migrateSceneDocument(JSON.parse(stored) as SceneDocument))) || inverseContent.activeSceneId !== before.activeSceneId || inverseContent.sceneId !== content.sceneId || inverseContent.candidate.bytes.length !== content.candidate.bytes.length || JSON.stringify(inverseContent.candidate.bytes) !== JSON.stringify(content.candidate.bytes) || inverseContent.candidate.label !== content.candidate.label || inverseContent.candidate.provenance !== content.candidate.provenance) throw conflict("Inverse binding content does not match the authoritative pre-apply Scene and asset state.", before);
  return { assetAlreadyRegistered, expectedAssetCount };
}

function assertSaveReceipt(receipt: ProjectSaveReceipt, projectId: string, expectedGeneration: number, expectedAssetCount: number): void {
  if (receipt.operation !== "dicebox.project.save" || receipt.status !== "PASS" || receipt.projectId !== projectId || receipt.generation !== expectedGeneration + 1 || receipt.assetCount !== expectedAssetCount || receipt.atomicReplace !== true || receipt.directoryEntrySync !== true || receipt.backupPreserved !== true || receipt.noFoundryWrite !== true) throw conflict("Project asset binding returned an unexpected or non-attested native save receipt.");
}

function assertAppliedState(before: ProjectAssetBindingAuthoritativeRead, after: ProjectAssetBindingAuthoritativeRead, receipt: ProjectSaveReceipt, content: ProjectAssetBindingContent, descriptor: ProjectAssetBindingDescriptor, plan: ProjectAssetBindingPlan): void {
  const target = after.backgroundBindings.find((binding) => binding.sceneId === content.sceneId);
  const asset = after.assets.find((candidate) => candidate.sha256 === descriptor.assetSha256);
  if (after.generation !== before.generation + 1 || after.contentSha256 !== receipt.contentSha256 || after.semanticContentSha256 === before.semanticContentSha256 || after.activeSceneId !== content.activeSceneId || after.sceneCount !== content.scenes.length || after.assetCount !== plan.expectedAssetCount || target?.assetId !== descriptor.assetId || !exactCandidateAsset(asset, descriptor, content) || !preservesAssetTree(before.assets, after.assets) || (plan.assetAlreadyRegistered && after.assetCollectionSha256 !== before.assetCollectionSha256) || after.recovery.registeredAssets.find((candidate) => candidate.assetId === descriptor.assetId)?.disposition !== "PRESENT_VALID" || after.backupByteSha256 !== before.primaryByteSha256 || after.primaryByteSha256 === before.primaryByteSha256) throw conflict("Post-save reread did not show the exact PNG background binding and preserved asset tree.", after);
}

function assertRestoredState(before: ProjectAssetBindingAuthoritativeRead, applied: ProjectAssetBindingAuthoritativeRead, after: ProjectAssetBindingAuthoritativeRead, receipt: ProjectSaveReceipt, inverseContent: ProjectAssetBindingContent, descriptor: ProjectAssetBindingDescriptor, plan: ProjectAssetBindingPlan): void {
  if (after.generation !== applied.generation + 1 || after.contentSha256 !== receipt.contentSha256 || after.sceneContentSha256 !== before.sceneContentSha256 || after.activeSceneId !== inverseContent.activeSceneId || after.sceneCount !== inverseContent.scenes.length || after.assetCount !== plan.expectedAssetCount || JSON.stringify(after.backgroundBindings) !== JSON.stringify(before.backgroundBindings) || !exactCandidateAsset(after.assets.find((asset) => asset.sha256 === descriptor.assetSha256), descriptor, inverseContent) || !preservesAssetTree(applied.assets, after.assets) || (plan.assetAlreadyRegistered && after.assetCollectionSha256 !== before.assetCollectionSha256) || after.backupByteSha256 !== applied.primaryByteSha256 || after.primaryByteSha256 === applied.primaryByteSha256) throw conflict("Post-inverse reread did not restore the exact Scene binding while preserving the asset tree.", after);
}

function rereadFor(state: ProjectAssetBindingAuthoritativeRead): ProposalBatchReread {
  return { status: "matched", targetId: state.projectId as ProposalBatchReread["targetId"], revision: state.generation, sha256: state.contentSha256 };
}

export async function executeApprovedProjectAssetBinding(input: Readonly<{
  session: unknown;
  content: ProjectAssetBindingContent;
  inverseContent: ProjectAssetBindingContent;
  executor: ProposalBatchActor;
  store?: ProjectAssetBindingStore;
}>): Promise<ProjectAssetBindingExecutionReceipt> {
  const session = await validateDesktopProjectProposalSession(input.session);
  const command = exactAssetBindingCommand(session);
  if (input.executor.role !== "reviewer") throw new ProjectAssetBindingExecutionError("PROJECT_ASSET_BIND_NOT_APPROVED", "Project asset binding requires a reviewer executor.");
  const store = input.store ?? nativeProjectAssetBindingStore;
  const before = await readAuthoritativeProjectAssetBindingState(store, session.projectId);
  const descriptor = await deriveProjectBackgroundAssetDescriptor(input.content.candidate, input.content.sceneId);
  const plan = assertBeforeState(before, command, input.content, input.inverseContent, descriptor);
  const applying = await beginDesktopProjectProposalSessionApply(session, input.executor, session.batch.base, new Date().toISOString());
  const nativeAsset = projectAssetInputFromCandidate(input.content.candidate, descriptor);
  let save: ProjectSaveReceipt;
  try {
    save = await store.save(session.projectId, input.content.scenes, input.content.activeSceneId, before.generation, [nativeAsset]);
  } catch (error) {
    let authoritativeRead: ProjectAssetBindingAuthoritativeRead | null = null;
    try { authoritativeRead = await readAuthoritativeProjectAssetBindingState(store, session.projectId); } catch { /* outcome remains unknown; no retry is safe */ }
    throw new ProjectAssetBindingExecutionError("PROJECT_ASSET_BIND_OUTCOME_UNKNOWN", `Project asset binding transport failed; no retry was attempted. ${error instanceof Error ? error.message : String(error)}`, authoritativeRead);
  }
  assertSaveReceipt(save, session.projectId, before.generation, plan.expectedAssetCount);
  const afterApply = await readAuthoritativeProjectAssetBindingState(store, session.projectId);
  assertAppliedState(before, afterApply, save, input.content, descriptor, plan);
  const committed = await commitDesktopProjectProposalSessionAfterReread(applying, input.executor, rereadFor(afterApply), new Date().toISOString());
  let inverseRestore: ProjectSaveReceipt;
  try {
    inverseRestore = await store.save(session.projectId, input.inverseContent.scenes, input.inverseContent.activeSceneId, afterApply.generation, [nativeAsset]);
  } catch (error) {
    let authoritativeRead: ProjectAssetBindingAuthoritativeRead | null = null;
    try { authoritativeRead = await readAuthoritativeProjectAssetBindingState(store, session.projectId); } catch { /* inverse outcome remains unknown; no retry is safe */ }
    throw new ProjectAssetBindingExecutionError("PROJECT_ASSET_BIND_OUTCOME_UNKNOWN", `Project asset binding inverse restore failed; no retry was attempted. ${error instanceof Error ? error.message : String(error)}`, authoritativeRead);
  }
  assertSaveReceipt(inverseRestore, session.projectId, afterApply.generation, plan.expectedAssetCount);
  const afterUndo = await readAuthoritativeProjectAssetBindingState(store, session.projectId);
  assertRestoredState(before, afterApply, afterUndo, inverseRestore, input.inverseContent, descriptor, plan);
  const undone = await undoDesktopProjectProposalSession(committed, input.executor, rereadFor(afterUndo), new Date().toISOString());
  return {
    operation: "dicebox.project.asset.bind.execute",
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
    assetAdded: !plan.assetAlreadyRegistered,
    assetTreePreserved: true,
    sceneContentRestored: true,
    noFoundryWrite: true,
  };
}

export async function executeApprovedProjectAssetBindingCommit(input: Readonly<{
  session: unknown;
  content: ProjectAssetBindingContent;
  executor: ProposalBatchActor;
  store?: ProjectAssetBindingStore;
}>): Promise<ProjectAssetBindingCommitReceipt> {
  const session = await validateDesktopProjectProposalSession(input.session);
  const command = exactAssetBindingCommand(session);
  if (input.executor.role !== "reviewer") throw new ProjectAssetBindingExecutionError("PROJECT_ASSET_BIND_NOT_APPROVED", "Project asset binding requires a reviewer executor.");
  const store = input.store ?? nativeProjectAssetBindingStore;
  const before = await readAuthoritativeProjectAssetBindingState(store, session.projectId);
  const descriptor = await deriveProjectBackgroundAssetDescriptor(input.content.candidate, input.content.sceneId);
  const inverseContent: ProjectAssetBindingContent = {
    ...input.content,
    scenes: before.project.scenesJson.map((stored) => migrateSceneDocument(JSON.parse(stored) as SceneDocument)),
    activeSceneId: before.activeSceneId,
  };
  const plan = assertBeforeState(before, command, input.content, inverseContent, descriptor);
  const applying = await beginDesktopProjectProposalSessionApply(session, input.executor, session.batch.base, new Date().toISOString());
  const nativeAsset = projectAssetInputFromCandidate(input.content.candidate, descriptor);
  let save: ProjectSaveReceipt;
  try {
    save = await store.save(session.projectId, input.content.scenes, input.content.activeSceneId, before.generation, [nativeAsset]);
  } catch (error) {
    let authoritativeRead: ProjectAssetBindingAuthoritativeRead | null = null;
    try { authoritativeRead = await readAuthoritativeProjectAssetBindingState(store, session.projectId); } catch { /* outcome remains unknown; no retry is safe */ }
    throw new ProjectAssetBindingExecutionError("PROJECT_ASSET_BIND_OUTCOME_UNKNOWN", `Project asset binding transport failed; no retry was attempted. ${error instanceof Error ? error.message : String(error)}`, authoritativeRead);
  }
  assertSaveReceipt(save, session.projectId, before.generation, plan.expectedAssetCount);
  const afterApply = await readAuthoritativeProjectAssetBindingState(store, session.projectId);
  assertAppliedState(before, afterApply, save, input.content, descriptor, plan);
  const committed = await commitDesktopProjectProposalSessionAfterReread(applying, input.executor, rereadFor(afterApply), new Date().toISOString());
  return {
    operation: "dicebox.project.asset.bind.commit",
    status: "PASS",
    projectId: session.projectId,
    batchId: session.batch.batchId,
    asset: descriptor,
    before,
    afterApply,
    save,
    history: committed.history,
    projectContentWrite: true,
    assetBytesPersisted: true,
    assetAdded: !plan.assetAlreadyRegistered,
    assetTreePreserved: true,
    noFoundryWrite: true,
  };
}
