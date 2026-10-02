import type { ProposalBatchActor, ProposalBatchHistory, ProposalBatchReread } from "@dicebox/core";
import {
  beginDesktopProjectProposalSessionApply,
  commitDesktopProjectProposalSessionAfterReread,
  undoDesktopProjectProposalSession,
  validateDesktopProjectProposalSession,
  type DesktopProjectProposalSession,
} from "./project-proposal-session";
import {
  displayNameFromInput,
  listProjectBundles,
  loadProjectBundle,
  renameProjectBundle,
  type ProjectCatalogEntry,
  type ProjectCatalogResponse,
  type ProjectLoadResponse,
  type WorkspaceMetadataReceipt,
} from "./project-store";

type ProjectRenameCommandPayload = Readonly<{
  operation: "project.rename";
  projectId: string;
  workspaceIndexGeneration: number;
  currentDisplayName: string;
  proposedDisplayName: string;
  contentSha256: string;
  previewSha256: string;
}>;

export type ProjectRenameStore = Readonly<{
  list: () => Promise<ProjectCatalogResponse>;
  load: (projectId: string) => Promise<ProjectLoadResponse>;
  rename: (projectId: string, displayName: string, expectedWorkspaceGeneration: number) => Promise<WorkspaceMetadataReceipt>;
}>;

export const nativeProjectRenameStore: ProjectRenameStore = {
  list: listProjectBundles,
  load: (projectId) => loadProjectBundle(projectId),
  rename: renameProjectBundle,
};

export type ProjectRenameAuthoritativeRead = Readonly<{
  projectId: string;
  displayName: string;
  workspaceIndexGeneration: number;
  generation: number;
  contentSha256: string;
  authoritativeStateSha256: string;
  catalog: ProjectCatalogResponse;
  catalogEntry: ProjectCatalogEntry;
  project: ProjectLoadResponse;
  noWrite: true;
  noFoundryWrite: true;
}>;

export type ProjectRenameExecutionReceipt = Readonly<{
  operation: "dicebox.project.rename.execute";
  status: "PASS";
  projectId: string;
  batchId: string;
  currentDisplayName: string;
  proposedDisplayName: string;
  before: ProjectRenameAuthoritativeRead;
  afterApply: ProjectRenameAuthoritativeRead;
  afterUndo: ProjectRenameAuthoritativeRead;
  apply: WorkspaceMetadataReceipt;
  undo: WorkspaceMetadataReceipt;
  history: ProposalBatchHistory;
  projectContentWrite: false;
  noFoundryWrite: true;
}>;

export type ProjectRenameExecutionFailureCode = "PROJECT_RENAME_NOT_APPROVED" | "PROJECT_RENAME_CONFLICT" | "PROJECT_RENAME_OUTCOME_UNKNOWN";

export class ProjectRenameExecutionError extends Error {
  readonly code: ProjectRenameExecutionFailureCode;
  readonly authoritativeRead: ProjectRenameAuthoritativeRead | null;

  constructor(code: ProjectRenameExecutionFailureCode, message: string, authoritativeRead: ProjectRenameAuthoritativeRead | null = null) {
    super(message);
    this.name = "ProjectRenameExecutionError";
    this.code = code;
    this.authoritativeRead = authoritativeRead;
  }
}

const sha256Pattern = /^[0-9a-f]{64}$/;

function record(value: unknown, label: string): Record<string, unknown> {
  if (value === null || typeof value !== "object" || Array.isArray(value)) throw new ProjectRenameExecutionError("PROJECT_RENAME_CONFLICT", `${label} must be an object.`);
  return value as Record<string, unknown>;
}

function exactRenameCommand(session: DesktopProjectProposalSession): ProjectRenameCommandPayload {
  if (session.history.status !== "approved") {
    throw new ProjectRenameExecutionError("PROJECT_RENAME_NOT_APPROVED", `Project rename execution requires an approved session; current status is ${session.history.status}.`);
  }
  if (session.batch.commands.length !== 1 || session.batch.commands[0]?.kind !== "project.rename") {
    throw new ProjectRenameExecutionError("PROJECT_RENAME_CONFLICT", "Project rename execution requires exactly one project.rename command.");
  }
  const payload = record(session.batch.commands[0].payload, "Project rename payload");
  const expectedKeys = ["contentSha256", "currentDisplayName", "operation", "previewSha256", "projectId", "proposedDisplayName", "workspaceIndexGeneration"];
  if (Object.keys(payload).sort().join("|") !== expectedKeys.sort().join("|")) {
    throw new ProjectRenameExecutionError("PROJECT_RENAME_CONFLICT", "Project rename payload contains unknown or missing fields.");
  }
  if (
    payload.operation !== "project.rename"
    || payload.projectId !== session.projectId
    || payload.projectId !== session.batch.base.targetId
    || payload.workspaceIndexGeneration !== session.batch.base.revision
    || typeof payload.workspaceIndexGeneration !== "number"
    || !Number.isSafeInteger(payload.workspaceIndexGeneration)
    || typeof payload.currentDisplayName !== "string"
    || typeof payload.proposedDisplayName !== "string"
    || typeof payload.contentSha256 !== "string"
    || typeof payload.previewSha256 !== "string"
    || !sha256Pattern.test(payload.contentSha256)
    || !sha256Pattern.test(payload.previewSha256)
    || displayNameFromInput(payload.currentDisplayName) !== payload.currentDisplayName
    || displayNameFromInput(payload.proposedDisplayName) !== payload.proposedDisplayName
    || payload.currentDisplayName === payload.proposedDisplayName
  ) {
    throw new ProjectRenameExecutionError("PROJECT_RENAME_CONFLICT", "Project rename payload is not the exact validated metadata-only shape.");
  }
  return payload as ProjectRenameCommandPayload;
}

function canonicalState(value: Readonly<{
  projectId: string;
  displayName: string;
  workspaceIndexGeneration: number;
  generation: number;
  contentSha256: string;
}>): string {
  return JSON.stringify({
    contentSha256: value.contentSha256,
    displayName: value.displayName,
    generation: value.generation,
    projectId: value.projectId,
    workspaceIndexGeneration: value.workspaceIndexGeneration,
  });
}

async function hashState(value: Readonly<{
  projectId: string;
  displayName: string;
  workspaceIndexGeneration: number;
  generation: number;
  contentSha256: string;
}>): Promise<string> {
  const digest = await globalThis.crypto.subtle.digest("SHA-256", new TextEncoder().encode(canonicalState(value)));
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

function matchingCatalogEntry(catalog: ProjectCatalogResponse, projectId: string): ProjectCatalogEntry {
  const matches = catalog.entries.filter((entry) => entry.projectId === projectId);
  if (!(catalog.status === "PASS" || catalog.status === "PARTIAL") || matches.length !== 1) {
    throw new ProjectRenameExecutionError("PROJECT_RENAME_CONFLICT", "Authoritative project catalog is not a complete or exact-target PARTIAL result for the requested project.");
  }
  const entry = matches[0]!;
  if (entry.status !== "PASS" || entry.generation === null || entry.contentSha256 === null) {
    throw new ProjectRenameExecutionError("PROJECT_RENAME_CONFLICT", "The exact project catalog entry is blocked or lacks content evidence.");
  }
  return entry;
}

export async function readAuthoritativeProjectRenameState(store: ProjectRenameStore, projectId: string): Promise<ProjectRenameAuthoritativeRead> {
  const catalog = await store.list();
  if (catalog.noWrite !== true || catalog.noFoundryWrite !== true) throw new ProjectRenameExecutionError("PROJECT_RENAME_CONFLICT", "Project catalog reread did not attest no-write and no-Foundry behavior.");
  const catalogEntry = matchingCatalogEntry(catalog, projectId);
  const project = await store.load(projectId);
  if (project.receipt.status !== "PASS" || project.receipt.projectId !== projectId || project.receipt.noFoundryWrite !== true) {
    throw new ProjectRenameExecutionError("PROJECT_RENAME_CONFLICT", "Project content reread did not return the exact PASS project without Foundry write.");
  }
  if (
    project.receipt.generation !== catalogEntry.generation
    || project.receipt.contentSha256 !== catalogEntry.contentSha256
    || project.receipt.contentSha256 === null
    || !Number.isSafeInteger(catalog.workspaceIndexGeneration)
    || catalog.workspaceIndexGeneration < 0
  ) {
    throw new ProjectRenameExecutionError("PROJECT_RENAME_CONFLICT", "Catalog and project rereads disagree on the exact project content or workspace generation.");
  }
  const state = {
    projectId,
    displayName: catalogEntry.displayName,
    workspaceIndexGeneration: catalog.workspaceIndexGeneration,
    generation: catalogEntry.generation,
    contentSha256: catalogEntry.contentSha256,
  } as const;
  return {
    ...state,
    authoritativeStateSha256: await hashState(state),
    catalog,
    catalogEntry,
    project,
    noWrite: true,
    noFoundryWrite: true,
  };
}

function assertBeforeState(state: ProjectRenameAuthoritativeRead, command: ProjectRenameCommandPayload): void {
  if (
    state.projectId !== command.projectId
    || state.workspaceIndexGeneration !== command.workspaceIndexGeneration
    || state.displayName !== command.currentDisplayName
    || state.contentSha256 !== command.contentSha256
  ) throw new ProjectRenameExecutionError("PROJECT_RENAME_CONFLICT", "The approved project.rename base is stale or no longer matches authoritative state.", state);
}

function assertAppliedState(before: ProjectRenameAuthoritativeRead, after: ProjectRenameAuthoritativeRead, command: ProjectRenameCommandPayload): void {
  if (
    after.projectId !== command.projectId
    || after.displayName !== command.proposedDisplayName
    || after.workspaceIndexGeneration <= before.workspaceIndexGeneration
    || after.generation !== before.generation
    || after.contentSha256 !== before.contentSha256
  ) throw new ProjectRenameExecutionError("PROJECT_RENAME_CONFLICT", "Post-rename reread did not show exactly the proposed display name with content unchanged.", after);
}

function assertUndoneState(before: ProjectRenameAuthoritativeRead, applied: ProjectRenameAuthoritativeRead, after: ProjectRenameAuthoritativeRead, command: ProjectRenameCommandPayload): void {
  if (
    after.projectId !== command.projectId
    || after.displayName !== command.currentDisplayName
    || after.workspaceIndexGeneration <= applied.workspaceIndexGeneration
    || after.generation !== before.generation
    || after.contentSha256 !== before.contentSha256
  ) throw new ProjectRenameExecutionError("PROJECT_RENAME_CONFLICT", "Post-undo reread did not restore the original display name with content unchanged.", after);
}

function rereadFor(state: ProjectRenameAuthoritativeRead): ProposalBatchReread {
  return {
    status: "matched",
    targetId: state.projectId as ProposalBatchReread["targetId"],
    revision: state.workspaceIndexGeneration,
    sha256: state.authoritativeStateSha256,
  };
}

function now(): string {
  return new Date().toISOString();
}

export async function executeApprovedProjectRename(input: Readonly<{
  session: unknown;
  executor: ProposalBatchActor;
  store?: ProjectRenameStore;
}>): Promise<ProjectRenameExecutionReceipt> {
  const session = await validateDesktopProjectProposalSession(input.session);
  const command = exactRenameCommand(session);
  if (input.executor.role !== "reviewer") throw new ProjectRenameExecutionError("PROJECT_RENAME_NOT_APPROVED", "Project rename execution requires a reviewer executor.");
  const store = input.store ?? nativeProjectRenameStore;
  const before = await readAuthoritativeProjectRenameState(store, session.projectId);
  assertBeforeState(before, command);
  const applying = await beginDesktopProjectProposalSessionApply(session, input.executor, session.batch.base, now());

  let apply: WorkspaceMetadataReceipt;
  try {
    apply = await store.rename(session.projectId, command.proposedDisplayName, before.workspaceIndexGeneration);
  } catch (error) {
    let authoritativeRead: ProjectRenameAuthoritativeRead | null = null;
    try {
      authoritativeRead = await readAuthoritativeProjectRenameState(store, session.projectId);
    } catch {
      // The original native failure and the reread failure are both retained by the typed outcome-unknown error.
    }
    throw new ProjectRenameExecutionError("PROJECT_RENAME_OUTCOME_UNKNOWN", `Project rename transport failed; no retry was attempted. ${error instanceof Error ? error.message : String(error)}`, authoritativeRead);
  }
  if (apply.status !== "PASS" || apply.projectId !== session.projectId || apply.displayName !== command.proposedDisplayName || apply.noFoundryWrite !== true) {
    throw new ProjectRenameExecutionError("PROJECT_RENAME_CONFLICT", "Project rename returned an unexpected or non-attested receipt.");
  }
  const afterApply = await readAuthoritativeProjectRenameState(store, session.projectId);
  assertAppliedState(before, afterApply, command);
  const committedHistory = await commitDesktopProjectProposalSessionAfterReread(applying, input.executor, rereadFor(afterApply), now());

  let undo: WorkspaceMetadataReceipt;
  try {
    undo = await store.rename(session.projectId, command.currentDisplayName, afterApply.workspaceIndexGeneration);
  } catch (error) {
    let authoritativeRead: ProjectRenameAuthoritativeRead | null = null;
    try {
      authoritativeRead = await readAuthoritativeProjectRenameState(store, session.projectId);
    } catch {
      // The original inverse transport failure and the reread failure remain outcome-unknown; no retry is safe.
    }
    throw new ProjectRenameExecutionError("PROJECT_RENAME_OUTCOME_UNKNOWN", `Project inverse rename transport failed; no retry was attempted. ${error instanceof Error ? error.message : String(error)}`, authoritativeRead);
  }
  if (undo.status !== "PASS" || undo.projectId !== session.projectId || undo.displayName !== command.currentDisplayName || undo.noFoundryWrite !== true) {
    throw new ProjectRenameExecutionError("PROJECT_RENAME_CONFLICT", "Inverse project rename returned an unexpected or non-attested receipt.");
  }
  const afterUndo = await readAuthoritativeProjectRenameState(store, session.projectId);
  assertUndoneState(before, afterApply, afterUndo, command);
  const undoneSession = await undoDesktopProjectProposalSession(committedHistory, input.executor, rereadFor(afterUndo), now());

  return {
    operation: "dicebox.project.rename.execute",
    status: "PASS",
    projectId: session.projectId,
    batchId: session.batch.batchId,
    currentDisplayName: command.currentDisplayName,
    proposedDisplayName: command.proposedDisplayName,
    before,
    afterApply,
    afterUndo,
    apply,
    undo,
    history: undoneSession.history,
    projectContentWrite: false,
    noFoundryWrite: true,
  };
}
