import type { ProposalBatchHistory, ProposalBatchReread, ProposalBatchActor } from "@dicebox/core";
import {
  beginDesktopProjectProposalSessionApply,
  commitDesktopProjectProposalSessionAfterReread,
  markDesktopProjectProposalOutcomeUnknown,
  undoDesktopProjectProposalSession,
  validateDesktopProjectProposalSession,
  type DesktopProjectProposalSession,
} from "./project-proposal-session";
import {
  deriveNextBlankProjectScene,
  hashProjectAddSceneBase,
  hashProjectAddSceneState,
  validateProjectAddSceneState,
  type ProjectAddSceneState,
} from "./project-add-scene-proposal-adapter";

export type ProjectAddSceneStore = Readonly<{
  read: (projectId: string) => Promise<ProjectAddSceneState>;
  replace: (projectId: string, state: ProjectAddSceneState) => Promise<void>;
}>;

export const inMemoryProjectAddSceneStore = (initial: ProjectAddSceneState): ProjectAddSceneStore => {
  let current = validateProjectAddSceneState(initial);
  return {
    read: async (projectId) => {
      if (projectId !== current.projectId) throw new Error("The in-memory add-Scene store does not contain the exact project.");
      return current;
    },
    replace: async (projectId, state) => {
      if (projectId !== current.projectId || state.projectId !== projectId) throw new Error("The in-memory add-Scene store rejected a foreign project.");
      current = validateProjectAddSceneState(state);
    },
  };
};

export type ProjectAddSceneAuthoritativeRead = Readonly<{
  projectId: string;
  sceneIds: readonly string[];
  scenesSha256: string;
  activeSceneId: string;
  sceneCount: number;
  noWrite: true;
  noPersistenceWrite: true;
  noFoundryWrite: true;
}>;

export type ProjectAddSceneExecutionReceipt = Readonly<{
  operation: "dicebox.project.add-scene.execute";
  status: "PASS";
  projectId: string;
  batchId: string;
  addedSceneId: string;
  addedOrdinal: number;
  before: ProjectAddSceneAuthoritativeRead;
  afterApply: ProjectAddSceneAuthoritativeRead;
  afterUndo: ProjectAddSceneAuthoritativeRead;
  history: ProposalBatchHistory;
  projectContentWrite: false;
  projectPersistenceWrite: false;
  noFoundryWrite: true;
}>;

export type ProjectAddSceneExecutionFailureCode = "PROJECT_ADD_SCENE_NOT_APPROVED" | "PROJECT_ADD_SCENE_CONFLICT" | "PROJECT_ADD_SCENE_OUTCOME_UNKNOWN";

export class ProjectAddSceneExecutionError extends Error {
  readonly code: ProjectAddSceneExecutionFailureCode;
  readonly authoritativeRead: ProjectAddSceneAuthoritativeRead | null;
  readonly session: DesktopProjectProposalSession | null;

  constructor(code: ProjectAddSceneExecutionFailureCode, message: string, authoritativeRead: ProjectAddSceneAuthoritativeRead | null = null, session: DesktopProjectProposalSession | null = null) {
    super(message);
    this.name = "ProjectAddSceneExecutionError";
    this.code = code;
    this.authoritativeRead = authoritativeRead;
    this.session = session;
  }
}

const stableIdPattern = /^dbx:[a-z0-9][a-z0-9._-]*:[a-z0-9][a-z0-9._-]*$/;
const sceneIdPattern = /^dbx:scene:[a-z0-9][a-z0-9._-]*$/;
const sha256Pattern = /^[0-9a-f]{64}$/;

function conflict(message: string, authoritativeRead: ProjectAddSceneAuthoritativeRead | null = null): ProjectAddSceneExecutionError {
  return new ProjectAddSceneExecutionError("PROJECT_ADD_SCENE_CONFLICT", message, authoritativeRead);
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

type ProjectAddSceneCommandPayload = Readonly<{
  operation: "project.add-scene";
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
  previewSha256: string;
}>;

function exactCommand(session: DesktopProjectProposalSession, requiredStatus: "approved" | "committed" = "approved"): ProjectAddSceneCommandPayload {
  if (session.history.status !== requiredStatus) throw new ProjectAddSceneExecutionError("PROJECT_ADD_SCENE_NOT_APPROVED", `Project add-Scene execution requires a ${requiredStatus} session; current status is ${session.history.status}.`);
  if (session.batch.producer.kind !== "human" || session.batch.producer.sourceId !== "desktop.project.add-scene" || session.batch.producer.provider !== null || session.batch.commands.length !== 1 || session.batch.commands[0]?.kind !== "project.add-scene") {
    throw conflict("Project add-Scene execution requires exactly one human/no-provider project.add-scene command.");
  }
  const payload = record(session.batch.commands[0].payload, "Project add-Scene payload");
  const expectedKeys = ["addedOrdinal", "addedSceneId", "currentActiveSceneId", "currentSceneCount", "currentSceneIds", "currentScenesSha256", "operation", "previewSha256", "proposedActiveSceneId", "proposedSceneCount", "proposedSceneIds", "proposedScenesSha256", "projectId"];
  if (Object.keys(payload).sort().join("|") !== expectedKeys.sort().join("|")) throw conflict("Project add-Scene payload contains unknown or missing fields.");
  const parsed = {
    operation: payload.operation,
    projectId: exactString(payload.projectId, stableIdPattern, "projectId"),
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
  if (parsed.operation !== "project.add-scene" || parsed.projectId !== session.projectId || parsed.projectId !== session.batch.base.targetId || session.batch.base.revision !== parsed.currentSceneCount || parsed.currentSceneCount < 1 || parsed.currentSceneCount >= 256 || parsed.proposedSceneCount !== parsed.currentSceneCount + 1 || parsed.proposedSceneIds.length !== parsed.proposedSceneCount || parsed.currentSceneIds.length !== parsed.currentSceneCount || parsed.proposedActiveSceneId !== parsed.addedSceneId || parsed.currentSceneIds.includes(parsed.addedSceneId) || !parsed.proposedSceneIds.includes(parsed.addedSceneId) || parsed.addedOrdinal < 2 || parsed.addedOrdinal > 256) {
    throw conflict("Project add-Scene payload is not the exact validated metadata-only shape.");
  }
  return parsed as ProjectAddSceneCommandPayload;
}

async function readInternal(store: ProjectAddSceneStore, projectId: string): Promise<{ state: ProjectAddSceneState; receipt: ProjectAddSceneAuthoritativeRead }> {
  let state: ProjectAddSceneState;
  try {
    state = validateProjectAddSceneState(await store.read(projectId));
  } catch (error) {
    throw conflict(`Authoritative in-memory add-Scene reread failed: ${error instanceof Error ? error.message : String(error)}`);
  }
  if (state.projectId !== projectId) throw conflict("Authoritative in-memory add-Scene reread returned a foreign project.");
  const scenesSha256 = await hashProjectAddSceneState(state);
  const receipt: ProjectAddSceneAuthoritativeRead = {
    projectId,
    sceneIds: state.scenes.map((scene) => scene.id),
    scenesSha256,
    activeSceneId: state.activeSceneId,
    sceneCount: state.scenes.length,
    noWrite: true,
    noPersistenceWrite: true,
    noFoundryWrite: true,
  };
  return { state, receipt };
}

function matchedReread(receipt: ProjectAddSceneAuthoritativeRead, targetId: ProposalBatchReread["targetId"]): ProposalBatchReread {
  return { status: "matched", targetId, revision: receipt.sceneCount, sha256: receipt.scenesSha256 };
}

async function assertBase(state: ProjectAddSceneState, command: ProjectAddSceneCommandPayload, batchBaseSha256: string): Promise<Readonly<{ proposed: ProjectAddSceneState; addedOrdinal: number }>> {
  const stateSha256 = await hashProjectAddSceneState(state);
  if (state.projectId !== command.projectId || state.scenes.length !== command.currentSceneCount || state.activeSceneId !== command.currentActiveSceneId || !sameStrings(state.scenes.map((scene) => scene.id), command.currentSceneIds) || stateSha256 !== command.currentScenesSha256 || batchBaseSha256 !== await hashProjectAddSceneBase(state)) {
    throw conflict("The approved add-Scene base is stale or foreign.");
  }
  const added = deriveNextBlankProjectScene(state);
  const proposed: ProjectAddSceneState = { projectId: state.projectId, scenes: [...state.scenes, added.scene], activeSceneId: added.scene.id };
  if (added.scene.id !== command.addedSceneId || added.ordinal !== command.addedOrdinal || !sameStrings(proposed.scenes.map((scene) => scene.id), command.proposedSceneIds) || command.proposedActiveSceneId !== proposed.activeSceneId || command.proposedSceneCount !== proposed.scenes.length || await hashProjectAddSceneState(proposed) !== command.proposedScenesSha256) {
    throw conflict("The approved add-Scene proposal does not match deterministic editor derivation.");
  }
  return { proposed, addedOrdinal: added.ordinal };
}

export async function readAuthoritativeProjectAddSceneState(store: ProjectAddSceneStore, projectId: string): Promise<ProjectAddSceneAuthoritativeRead> {
  return (await readInternal(store, projectId)).receipt;
}

export async function executeProjectAddScene(input: Readonly<{
  session: DesktopProjectProposalSession;
  store: ProjectAddSceneStore;
  executor: ProposalBatchActor;
  observedAt: string;
}>): Promise<ProjectAddSceneExecutionReceipt> {
  const session = await validateDesktopProjectProposalSession(input.session);
  const command = exactCommand(session);
  const beforeRead = await readInternal(input.store, command.projectId);
  const { proposed, addedOrdinal } = await assertBase(beforeRead.state, command, session.batch.base.sha256);
  let applying: DesktopProjectProposalSession;
  try {
    applying = await beginDesktopProjectProposalSessionApply(session, input.executor, session.batch.base, input.observedAt);
  } catch (error) {
    throw conflict(`Project add-Scene apply could not begin: ${error instanceof Error ? error.message : String(error)}`, beforeRead.receipt);
  }
  try {
    await input.store.replace(command.projectId, proposed);
  } catch (error) {
    const reread = await readInternal(input.store, command.projectId).catch(() => null);
    const unknown = await markDesktopProjectProposalOutcomeUnknown(applying, input.executor, input.observedAt);
    throw new ProjectAddSceneExecutionError("PROJECT_ADD_SCENE_OUTCOME_UNKNOWN", `Project add-Scene transport outcome is unknown; retry is forbidden until authoritative reread: ${error instanceof Error ? error.message : String(error)}`, reread?.receipt ?? null, unknown);
  }
  const afterApplyRead = await readInternal(input.store, command.projectId);
  if (afterApplyRead.receipt.sceneCount !== proposed.scenes.length || afterApplyRead.receipt.activeSceneId !== proposed.activeSceneId || !sameStrings(afterApplyRead.receipt.sceneIds, proposed.scenes.map((scene) => scene.id)) || afterApplyRead.receipt.scenesSha256 !== command.proposedScenesSha256) {
    throw conflict("The applied add-Scene state failed authoritative reread.", afterApplyRead.receipt);
  }
  const committed = await commitDesktopProjectProposalSessionAfterReread(applying, input.executor, matchedReread(afterApplyRead.receipt, session.batch.base.targetId), input.observedAt);
  try {
    await input.store.replace(command.projectId, beforeRead.state);
  } catch (error) {
    const reread = await readInternal(input.store, command.projectId).catch(() => null);
    const unknown = await markDesktopProjectProposalOutcomeUnknown(committed, input.executor, input.observedAt);
    throw new ProjectAddSceneExecutionError("PROJECT_ADD_SCENE_OUTCOME_UNKNOWN", `Project add-Scene inverse outcome is unknown; retry is forbidden until authoritative reread: ${error instanceof Error ? error.message : String(error)}`, reread?.receipt ?? null, unknown);
  }
  const afterUndoRead = await readInternal(input.store, command.projectId);
  if (afterUndoRead.receipt.sceneCount !== beforeRead.receipt.sceneCount || afterUndoRead.receipt.activeSceneId !== beforeRead.receipt.activeSceneId || !sameStrings(afterUndoRead.receipt.sceneIds, beforeRead.receipt.sceneIds) || afterUndoRead.receipt.scenesSha256 !== beforeRead.receipt.scenesSha256) {
    throw conflict("The inverse add-Scene removal failed authoritative reread.", afterUndoRead.receipt);
  }
  const undone = await undoDesktopProjectProposalSession(committed, input.executor, matchedReread(afterUndoRead.receipt, session.batch.base.targetId), input.observedAt);
  return {
    operation: "dicebox.project.add-scene.execute",
    status: "PASS",
    projectId: command.projectId,
    batchId: session.batch.batchId,
    addedSceneId: command.addedSceneId,
    addedOrdinal,
    before: beforeRead.receipt,
    afterApply: afterApplyRead.receipt,
    afterUndo: afterUndoRead.receipt,
    history: undone.history,
    projectContentWrite: false,
    projectPersistenceWrite: false,
    noFoundryWrite: true,
  };
}

/**
 * This is deliberately separate from executeProjectAddScene.  The older
 * executor is fixture evidence and proves an immediate inverse restore;
 * this executor is the editor-facing, committed in-memory action whose
 * inverse is invoked later through undoCommittedProjectAddScene.
 */
export type CommittedProjectAddSceneExecutionReceipt = Readonly<{
  operation: "dicebox.project.add-scene.commit-in-memory";
  status: "PASS";
  projectId: string;
  batchId: string;
  addedSceneId: string;
  addedOrdinal: number;
  before: ProjectAddSceneAuthoritativeRead;
  afterApply: ProjectAddSceneAuthoritativeRead;
  session: DesktopProjectProposalSession;
  projectContentWrite: false;
  projectPersistenceWrite: false;
  noFoundryWrite: true;
}>;

export type CommittedProjectAddSceneUndoReceipt = Readonly<{
  operation: "dicebox.project.add-scene.undo-in-memory";
  status: "PASS";
  projectId: string;
  batchId: string;
  afterUndo: ProjectAddSceneAuthoritativeRead;
  session: DesktopProjectProposalSession;
  projectContentWrite: false;
  projectPersistenceWrite: false;
  noFoundryWrite: true;
}>;

export async function executeCommittedProjectAddScene(input: Readonly<{
  session: DesktopProjectProposalSession;
  store: ProjectAddSceneStore;
  executor: ProposalBatchActor;
  observedAt: string;
}>): Promise<CommittedProjectAddSceneExecutionReceipt> {
  const session = await validateDesktopProjectProposalSession(input.session);
  const command = exactCommand(session);
  const beforeRead = await readInternal(input.store, command.projectId);
  const { proposed, addedOrdinal } = await assertBase(beforeRead.state, command, session.batch.base.sha256);
  let applying: DesktopProjectProposalSession;
  try {
    applying = await beginDesktopProjectProposalSessionApply(session, input.executor, session.batch.base, input.observedAt);
  } catch (error) {
    throw conflict(`Committed in-memory add-Scene apply could not begin: ${error instanceof Error ? error.message : String(error)}`, beforeRead.receipt);
  }
  try {
    await input.store.replace(command.projectId, proposed);
  } catch (error) {
    const reread = await readInternal(input.store, command.projectId).catch(() => null);
    const unknown = await markDesktopProjectProposalOutcomeUnknown(applying, input.executor, input.observedAt);
    throw new ProjectAddSceneExecutionError("PROJECT_ADD_SCENE_OUTCOME_UNKNOWN", `Committed in-memory add-Scene outcome is unknown; retry is forbidden until authoritative reread: ${error instanceof Error ? error.message : String(error)}`, reread?.receipt ?? null, unknown);
  }
  const afterApplyRead = await readInternal(input.store, command.projectId);
  if (afterApplyRead.receipt.sceneCount !== proposed.scenes.length || afterApplyRead.receipt.activeSceneId !== proposed.activeSceneId || !sameStrings(afterApplyRead.receipt.sceneIds, proposed.scenes.map((scene) => scene.id)) || afterApplyRead.receipt.scenesSha256 !== command.proposedScenesSha256) {
    throw conflict("Committed in-memory add-Scene failed authoritative reread.", afterApplyRead.receipt);
  }
  const committed = await commitDesktopProjectProposalSessionAfterReread(applying, input.executor, matchedReread(afterApplyRead.receipt, session.batch.base.targetId), input.observedAt);
  return { operation: "dicebox.project.add-scene.commit-in-memory", status: "PASS", projectId: command.projectId, batchId: session.batch.batchId, addedSceneId: command.addedSceneId, addedOrdinal, before: beforeRead.receipt, afterApply: afterApplyRead.receipt, session: committed, projectContentWrite: false, projectPersistenceWrite: false, noFoundryWrite: true };
}

export async function undoCommittedProjectAddScene(input: Readonly<{
  session: DesktopProjectProposalSession;
  store: ProjectAddSceneStore;
  inverseState: ProjectAddSceneState;
  executor: ProposalBatchActor;
  observedAt: string;
}>): Promise<CommittedProjectAddSceneUndoReceipt> {
  const session = await validateDesktopProjectProposalSession(input.session);
  const command = exactCommand(session, "committed");
  const beforeUndo = await readInternal(input.store, command.projectId);
  const inverseState = validateProjectAddSceneState(input.inverseState);
  if (inverseState.projectId !== command.projectId || inverseState.scenes.length !== command.currentSceneCount || inverseState.activeSceneId !== command.currentActiveSceneId || !sameStrings(inverseState.scenes.map((scene) => scene.id), command.currentSceneIds) || await hashProjectAddSceneState(inverseState) !== command.currentScenesSha256) throw conflict("Committed in-memory add-Scene inverse is not the exact approved base.", beforeUndo.receipt);
  if (beforeUndo.receipt.sceneCount !== command.proposedSceneCount || beforeUndo.receipt.activeSceneId !== command.proposedActiveSceneId || !sameStrings(beforeUndo.receipt.sceneIds, command.proposedSceneIds) || beforeUndo.receipt.scenesSha256 !== command.proposedScenesSha256) throw conflict("Committed in-memory add-Scene has drifted; authoritative recovery is required before undo.", beforeUndo.receipt);
  try {
    await input.store.replace(command.projectId, inverseState);
  } catch (error) {
    const reread = await readInternal(input.store, command.projectId).catch(() => null);
    const unknown = await markDesktopProjectProposalOutcomeUnknown(session, input.executor, input.observedAt);
    throw new ProjectAddSceneExecutionError("PROJECT_ADD_SCENE_OUTCOME_UNKNOWN", `Committed in-memory add-Scene undo outcome is unknown; retry is forbidden until authoritative reread: ${error instanceof Error ? error.message : String(error)}`, reread?.receipt ?? null, unknown);
  }
  const afterUndo = await readInternal(input.store, command.projectId);
  if (afterUndo.receipt.sceneCount !== inverseState.scenes.length || afterUndo.receipt.activeSceneId !== inverseState.activeSceneId || !sameStrings(afterUndo.receipt.sceneIds, inverseState.scenes.map((scene) => scene.id)) || afterUndo.receipt.scenesSha256 !== command.currentScenesSha256) throw conflict("Committed in-memory add-Scene undo failed authoritative reread.", afterUndo.receipt);
  const undone = await undoDesktopProjectProposalSession(session, input.executor, matchedReread(afterUndo.receipt, session.batch.base.targetId), input.observedAt);
  return { operation: "dicebox.project.add-scene.undo-in-memory", status: "PASS", projectId: command.projectId, batchId: session.batch.batchId, afterUndo: afterUndo.receipt, session: undone, projectContentWrite: false, projectPersistenceWrite: false, noFoundryWrite: true };
}
