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
  displayNameFromInput,
  inspectProjectRecovery,
  listProjectBundles,
  loadProjectBundle,
  saveProjectBundle,
  type ProjectCatalogEntry,
  type ProjectCatalogResponse,
  type ProjectLoadResponse,
  type ProjectRecoveryInspectionReceipt,
  type ProjectSaveReceipt,
} from "./project-store";
import {
  hashProjectSaveContent,
  type ProjectSaveContent,
  type ProjectSaveAssetInput,
} from "./project-save-proposal-adapter";

export type ProjectSaveStore = Readonly<{
  list: () => Promise<ProjectCatalogResponse>;
  load: (projectId: string) => Promise<ProjectLoadResponse>;
  inspect: (projectId: string) => Promise<ProjectRecoveryInspectionReceipt>;
  save: (projectId: string, content: ProjectSaveContent, expectedGeneration: number) => Promise<ProjectSaveReceipt>;
}>;

export const nativeProjectSaveStore: ProjectSaveStore = {
  list: listProjectBundles,
  load: (projectId) => loadProjectBundle(projectId),
  inspect: inspectProjectRecovery,
  save: (projectId, content, expectedGeneration) => saveProjectBundle(projectId, content.scenes, content.activeSceneId, expectedGeneration, content.assets),
};

export type ProjectSaveAuthoritativeRead = Readonly<{
  projectId: string;
  generation: number;
  contentSha256: string;
  semanticContentSha256: string;
  activeSceneId: string;
  sceneCount: number;
  assetCount: number;
  primaryByteSha256: string;
  backupByteSha256: string;
  catalog: ProjectCatalogResponse;
  catalogEntry: ProjectCatalogEntry;
  project: ProjectLoadResponse;
  recovery: ProjectRecoveryInspectionReceipt;
  noWrite: true;
  noFoundryWrite: true;
}>;

export type ProjectSaveExecutionReceipt = Readonly<{
  operation: "dicebox.project.save.execute";
  status: "PASS";
  projectId: string;
  batchId: string;
  before: ProjectSaveAuthoritativeRead;
  afterApply: ProjectSaveAuthoritativeRead;
  afterUndo: ProjectSaveAuthoritativeRead;
  save: ProjectSaveReceipt;
  inverseRestore: ProjectSaveReceipt;
  history: ProposalBatchHistory;
  projectContentWrite: true;
  noFoundryWrite: true;
}>;

export type ProjectSaveExecutionFailureCode = "PROJECT_SAVE_NOT_APPROVED" | "PROJECT_SAVE_CONFLICT" | "PROJECT_SAVE_OUTCOME_UNKNOWN";

export class ProjectSaveExecutionError extends Error {
  readonly code: ProjectSaveExecutionFailureCode;
  readonly authoritativeRead: ProjectSaveAuthoritativeRead | null;

  constructor(code: ProjectSaveExecutionFailureCode, message: string, authoritativeRead: ProjectSaveAuthoritativeRead | null = null) {
    super(message);
    this.name = "ProjectSaveExecutionError";
    this.code = code;
    this.authoritativeRead = authoritativeRead;
  }
}

const stableIdPattern = /^dbx:[a-z0-9][a-z0-9._-]*:[a-z0-9][a-z0-9._-]*$/;
const sha256Pattern = /^[0-9a-f]{64}$/;

function conflict(message: string, authoritativeRead: ProjectSaveAuthoritativeRead | null = null): ProjectSaveExecutionError {
  return new ProjectSaveExecutionError("PROJECT_SAVE_CONFLICT", message, authoritativeRead);
}

function record(value: unknown, label: string): Record<string, unknown> {
  if (value === null || typeof value !== "object" || Array.isArray(value)) throw conflict(`${label} must be an object.`);
  return value as Record<string, unknown>;
}

function canonicalize(value: unknown): string {
  if (value === null || typeof value === "string" || typeof value === "boolean") return JSON.stringify(value);
  if (typeof value === "number") {
    if (!Number.isFinite(value)) throw conflict("Project save state cannot contain a non-finite number.");
    return JSON.stringify(value);
  }
  if (Array.isArray(value)) return `[${value.map(canonicalize).join(",")}]`;
  const object = record(value, "Project save state");
  return `{${Object.keys(object).sort().map((key) => `${JSON.stringify(key)}:${canonicalize(object[key])}`).join(",")}}`;
}

async function hashSemanticProjectContent(project: ProjectLoadResponse): Promise<string> {
  return hashValue({
    activeSceneId: project.activeSceneId,
    assets: project.assets,
    scenesJson: canonicalLoadedSceneJson(project),
  });
}

async function hashValue(value: unknown): Promise<string> {
  const digest = await globalThis.crypto.subtle.digest("SHA-256", new TextEncoder().encode(canonicalize(value)));
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

function exactCatalogEntry(catalog: ProjectCatalogResponse, projectId: string): ProjectCatalogEntry {
  if (!(catalog.status === "PASS" || catalog.status === "PARTIAL") || catalog.noWrite !== true || catalog.noFoundryWrite !== true) {
    throw conflict("Project catalog reread is not an exact no-write PASS or target-eligible PARTIAL result.");
  }
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

export async function readAuthoritativeProjectSaveState(store: ProjectSaveStore, projectId: string): Promise<ProjectSaveAuthoritativeRead> {
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
  if (catalogEntry.generation !== project.receipt.generation || catalogEntry.contentSha256 !== project.receipt.contentSha256) {
    throw conflict("Project catalog and project content rereads disagree on generation or content hash.");
  }
  return {
    projectId,
    generation: project.receipt.generation,
    contentSha256: project.receipt.contentSha256,
    semanticContentSha256: await hashSemanticProjectContent(project),
    activeSceneId: project.activeSceneId,
    sceneCount: project.scenesJson.length,
    assetCount: project.assets.length,
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

type ProjectSaveCommandPayload = Readonly<{
  operation: "project.save";
  projectId: string;
  expectedGeneration: number;
  currentContentSha256: string;
  contentDescriptorSha256: string;
  proposedSceneCount: number;
  proposedActiveSceneId: string;
  proposedAssetCount: number;
}>;

function exactSaveCommand(session: DesktopProjectProposalSession): ProjectSaveCommandPayload {
  if (session.history.status !== "approved") throw new ProjectSaveExecutionError("PROJECT_SAVE_NOT_APPROVED", `Project save execution requires an approved session; current status is ${session.history.status}.`);
  if (
    session.batch.producer.kind !== "project-store"
    || session.batch.producer.sourceId !== "desktop.project.save"
    || session.batch.producer.provider !== null
    || session.batch.commands.length !== 1
    || session.batch.commands[0]?.kind !== "project.save"
  ) throw conflict("Project save execution requires exactly one desktop.project.save project-store command.");
  const payload = record(session.batch.commands[0].payload, "Project save payload");
  const expectedKeys = ["contentDescriptorSha256", "currentContentSha256", "expectedGeneration", "operation", "projectId", "proposedActiveSceneId", "proposedAssetCount", "proposedSceneCount"];
  if (Object.keys(payload).sort().join("|") !== expectedKeys.sort().join("|")) throw conflict("Project save payload contains unknown or missing fields.");
  if (
    payload.operation !== "project.save"
    || payload.projectId !== session.projectId
    || payload.projectId !== session.batch.base.targetId
    || payload.expectedGeneration !== session.batch.base.revision
    || typeof payload.expectedGeneration !== "number"
    || !Number.isSafeInteger(payload.expectedGeneration)
    || typeof payload.currentContentSha256 !== "string"
    || !sha256Pattern.test(payload.currentContentSha256)
    || typeof payload.contentDescriptorSha256 !== "string"
    || !sha256Pattern.test(payload.contentDescriptorSha256)
    || typeof payload.proposedActiveSceneId !== "string"
    || !stableIdPattern.test(payload.proposedActiveSceneId)
    || !Number.isSafeInteger(payload.proposedSceneCount)
    || (payload.proposedSceneCount as number) < 1
    || !Number.isSafeInteger(payload.proposedAssetCount)
    || (payload.proposedAssetCount as number) < 0
  ) throw conflict("Project save payload is not the exact validated metadata-only shape.");
  return payload as ProjectSaveCommandPayload;
}

function sceneJson(content: ProjectSaveContent): readonly string[] {
  return content.scenes.map(serializeSceneDocument);
}

function canonicalLoadedSceneJson(project: ProjectLoadResponse): readonly string[] {
  return project.scenesJson.map((stored) => serializeSceneDocument(migrateSceneDocument(JSON.parse(stored) as SceneDocument)));
}

function assertBeforeState(before: ProjectSaveAuthoritativeRead, command: ProjectSaveCommandPayload, content: ProjectSaveContent, inverseContent: ProjectSaveContent, descriptorSha256: string): void {
  if (
    before.generation !== command.expectedGeneration
    || before.contentSha256 !== command.currentContentSha256
    || content.scenes.length !== command.proposedSceneCount
    || content.activeSceneId !== command.proposedActiveSceneId
    || content.assets.length !== command.proposedAssetCount
    || descriptorSha256 !== command.contentDescriptorSha256
    || inverseContent.scenes.length !== before.sceneCount
    || inverseContent.activeSceneId !== before.activeSceneId
    || inverseContent.assets.length !== before.assetCount
    || JSON.stringify(sceneJson(inverseContent)) !== JSON.stringify(canonicalLoadedSceneJson(before.project))
  ) throw conflict("Approved project.save content or inverse snapshot does not match the authoritative base.", before);
  if (JSON.stringify(sceneJson(content)) === JSON.stringify(sceneJson(inverseContent)) && content.activeSceneId === inverseContent.activeSceneId) {
    throw conflict("M340 content-bearing project.save must change semantic content before the inverse restore.", before);
  }
}

function assertSaveReceipt(receipt: ProjectSaveReceipt, projectId: string, expectedGeneration: number): void {
  if (
    receipt.operation !== "dicebox.project.save"
    || receipt.status !== "PASS"
    || receipt.projectId !== projectId
    || receipt.generation !== expectedGeneration + 1
    || receipt.atomicReplace !== true
    || receipt.directoryEntrySync !== true
    || receipt.backupPreserved !== true
    || receipt.noFoundryWrite !== true
  ) throw conflict("Project save returned an unexpected or non-attested receipt.");
}

function assertAppliedState(before: ProjectSaveAuthoritativeRead, after: ProjectSaveAuthoritativeRead, receipt: ProjectSaveReceipt, content: ProjectSaveContent): void {
  if (
    after.generation !== before.generation + 1
    || after.contentSha256 !== receipt.contentSha256
    || after.semanticContentSha256 === before.semanticContentSha256
    || after.activeSceneId !== content.activeSceneId
    || after.sceneCount !== content.scenes.length
    || after.assetCount !== content.assets.length
    || JSON.stringify(canonicalLoadedSceneJson(after.project)) !== JSON.stringify(sceneJson(content))
    || after.backupByteSha256 !== before.primaryByteSha256
    || after.primaryByteSha256 === before.primaryByteSha256
  ) throw conflict("Post-save reread did not show the exact proposed content and rotated prior primary envelope.", after);
}

function assertRestoredState(before: ProjectSaveAuthoritativeRead, applied: ProjectSaveAuthoritativeRead, after: ProjectSaveAuthoritativeRead, receipt: ProjectSaveReceipt, inverseContent: ProjectSaveContent): void {
  if (
    after.generation !== applied.generation + 1
    || after.contentSha256 !== receipt.contentSha256
    || after.semanticContentSha256 !== before.semanticContentSha256
    || after.activeSceneId !== inverseContent.activeSceneId
    || after.sceneCount !== inverseContent.scenes.length
    || after.assetCount !== inverseContent.assets.length
    || JSON.stringify(canonicalLoadedSceneJson(after.project)) !== JSON.stringify(sceneJson(inverseContent))
    || after.backupByteSha256 !== applied.primaryByteSha256
    || after.primaryByteSha256 === applied.primaryByteSha256
  ) throw conflict("Post-inverse reread did not restore the exact semantic project content and rotate the applied envelope.", after);
}

function rereadFor(state: ProjectSaveAuthoritativeRead): ProposalBatchReread {
  return {
    status: "matched",
    targetId: state.projectId as ProposalBatchReread["targetId"],
    revision: state.generation,
    sha256: state.contentSha256,
  };
}

function projectSaveContentFromLoad(project: ProjectLoadResponse): ProjectSaveContent {
  return {
    scenes: project.scenesJson.map((sceneJson) => migrateSceneDocument(JSON.parse(sceneJson) as SceneDocument)),
    activeSceneId: project.activeSceneId,
    assets: [],
  };
}

export async function executeApprovedProjectSave(input: Readonly<{
  session: unknown;
  content: ProjectSaveContent;
  inverseContent: ProjectSaveContent;
  executor: ProposalBatchActor;
  store?: ProjectSaveStore;
}>): Promise<ProjectSaveExecutionReceipt> {
  const session = await validateDesktopProjectProposalSession(input.session);
  const command = exactSaveCommand(session);
  if (input.executor.role !== "reviewer") throw new ProjectSaveExecutionError("PROJECT_SAVE_NOT_APPROVED", "Project save execution requires a reviewer executor.");
  const store = input.store ?? nativeProjectSaveStore;
  const before = await readAuthoritativeProjectSaveState(store, session.projectId);
  const descriptorSha256 = await hashProjectSaveContent(input.content);
  const inverseContent = input.inverseContent;
  assertBeforeState(before, command, input.content, inverseContent, descriptorSha256);
  const applying = await beginDesktopProjectProposalSessionApply(session, input.executor, session.batch.base, new Date().toISOString());

  let save: ProjectSaveReceipt;
  try {
    save = await store.save(session.projectId, input.content, before.generation);
  } catch (error) {
    let authoritativeRead: ProjectSaveAuthoritativeRead | null = null;
    try {
      authoritativeRead = await readAuthoritativeProjectSaveState(store, session.projectId);
    } catch {
      // The failed native call and failed reread remain outcome-unknown; no retry is safe.
    }
    throw new ProjectSaveExecutionError("PROJECT_SAVE_OUTCOME_UNKNOWN", `Project save transport failed; no retry was attempted. ${error instanceof Error ? error.message : String(error)}`, authoritativeRead);
  }
  assertSaveReceipt(save, session.projectId, before.generation);
  const afterApply = await readAuthoritativeProjectSaveState(store, session.projectId);
  assertAppliedState(before, afterApply, save, input.content);
  const committedHistorySession = await commitDesktopProjectProposalSessionAfterReread(applying, input.executor, rereadFor(afterApply), new Date().toISOString());

  let inverseRestore: ProjectSaveReceipt;
  try {
    inverseRestore = await store.save(session.projectId, inverseContent, afterApply.generation);
  } catch (error) {
    let authoritativeRead: ProjectSaveAuthoritativeRead | null = null;
    try {
      authoritativeRead = await readAuthoritativeProjectSaveState(store, session.projectId);
    } catch {
      // The inverse failure and reread failure remain outcome-unknown; no retry is safe.
    }
    throw new ProjectSaveExecutionError("PROJECT_SAVE_OUTCOME_UNKNOWN", `Project inverse restore transport failed; no retry was attempted. ${error instanceof Error ? error.message : String(error)}`, authoritativeRead);
  }
  assertSaveReceipt(inverseRestore, session.projectId, afterApply.generation);
  const afterUndo = await readAuthoritativeProjectSaveState(store, session.projectId);
  assertRestoredState(before, afterApply, afterUndo, inverseRestore, inverseContent);
  const undoneSession = await undoDesktopProjectProposalSession(committedHistorySession, input.executor, rereadFor(afterUndo), new Date().toISOString());

  return {
    operation: "dicebox.project.save.execute",
    status: "PASS",
    projectId: session.projectId,
    batchId: session.batch.batchId,
    before,
    afterApply,
    afterUndo,
    save,
    inverseRestore,
    history: undoneSession.history,
    projectContentWrite: true,
    noFoundryWrite: true,
  };
}

export function projectSaveContentFromProjectLoad(project: ProjectLoadResponse): ProjectSaveContent {
  return projectSaveContentFromLoad(project);
}

export type { ProjectSaveAssetInput };
