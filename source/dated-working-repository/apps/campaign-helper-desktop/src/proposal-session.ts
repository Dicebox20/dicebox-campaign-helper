import {
  approveProposalBatch,
  beginProposalApply,
  cancelProposalBatch,
  commitProposalAfterReread,
  editProposalBatch,
  invalidateStaleProposalBatch,
  markProposalOutcomeUnknown,
  recoverProposalAfterReread,
  redoProposalBatch,
  rejectProposalBatch,
  undoProposalBatch,
  validateProposalBatch,
  validateProposalBatchHistory,
  type ProposalBatch,
  type ProposalBatchActor,
  type ProposalBatchHistory,
  type ProposalBatchInput,
  type ProposalBatchReread,
} from "@dicebox/core";

export const DESKTOP_PROPOSAL_SESSION_SCHEMA_VERSION = "0.1.0" as const;

export type DesktopProposalSession = Readonly<{
  schemaVersion: typeof DESKTOP_PROPOSAL_SESSION_SCHEMA_VERSION;
  projectId: string;
  sceneId: string;
  batch: ProposalBatch;
  history: ProposalBatchHistory;
}>;

export type DesktopAlignmentRelationshipReview = Readonly<{
  relationId: string;
  fromEntityId: string;
  toEntityId: string;
  axis: "x" | "y" | "center";
}>;

export type DesktopProposalSessionStorage = Readonly<{
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}>;

export type DesktopProposalSessionLoad = Readonly<{
  status: "PASS";
  key: string;
  session: DesktopProposalSession;
  projectContentWrite: false;
}> | Readonly<{
  status: "MISSING";
  key: string;
  session: null;
  projectContentWrite: false;
}> | Readonly<{
  status: "BLOCKED";
  key: string;
  code: "MALFORMED_SESSION" | "FOREIGN_SESSION" | "UNSUPPORTED_AUTHORITY" | "CREDENTIAL_MATERIAL" | "STORAGE_UNAVAILABLE";
  reason: string;
  session: null;
  projectContentWrite: false;
}>;

const stableIdPattern = /^dbx:[a-z0-9][a-z0-9._-]*:[a-z0-9][a-z0-9._-]*$/;
const terminalStatuses = new Set<ProposalBatchHistory["status"]>(["rejected", "cancelled", "stale", "committed", "recovered"]);
const credentialKeyPattern = /^(api[_-]?key|access[_-]?token|password|secret|credential)$/i;
const credentialValuePattern = /^(sk-[a-z0-9_-]{8,}|bearer\s+[a-z0-9._-]{8,})$/i;
const stableRelationshipIdPattern = /^dbx:relation:[a-z0-9][a-z0-9._-]*$/;

export function inspectDesktopAlignmentRelationship(session: DesktopProposalSession | null): DesktopAlignmentRelationshipReview | null {
  const command = session?.batch.commands.length === 1 ? session.batch.commands[0] : null;
  if (!command || command.kind !== "scene.add-relationship" || command.payload.kind !== "add-relationship") return null;
  const value = command.payload.relationship;
  if (value === null || typeof value !== "object" || Array.isArray(value)) return null;
  const relationship = value as Record<string, unknown>;
  const relationId = relationship.relationId;
  const fromEntityId = relationship.fromEntityId;
  const toEntityId = relationship.toEntityId;
  const axis = relationship.axis;
  if (
    relationship.kind !== "align"
    || typeof relationId !== "string"
    || !stableRelationshipIdPattern.test(relationId)
    || typeof fromEntityId !== "string"
    || !stableIdPattern.test(fromEntityId)
    || typeof toEntityId !== "string"
    || !stableIdPattern.test(toEntityId)
    || fromEntityId === toEntityId
    || (axis !== "x" && axis !== "y" && axis !== "center")
  ) return null;
  return { relationId, fromEntityId, toEntityId, axis };
}

export function browserDesktopProposalSessionStorage(): DesktopProposalSessionStorage {
  if (typeof window === "undefined") throw new Error("Browser proposal-session storage is unavailable.");
  return window.localStorage;
}

export function desktopProposalSessionStorageKey(projectId: string, sceneId: string): string {
  if (!stableIdPattern.test(projectId) || !stableIdPattern.test(sceneId)) throw new Error("Desktop proposal sessions require stable project and Scene IDs.");
  return `dicebox.proposal-session.v1:${encodeURIComponent(projectId)}:${encodeURIComponent(sceneId)}`;
}

function assertNoCredentials(value: unknown, path = "session"): void {
  if (typeof value === "string") {
    if (credentialValuePattern.test(value.trim())) throw new Error(`Credential material is forbidden at ${path}.`);
    return;
  }
  if (value === null || typeof value !== "object") return;
  if (Array.isArray(value)) {
    value.forEach((entry, index) => assertNoCredentials(entry, `${path}[${index}]`));
    return;
  }
  for (const [key, entry] of Object.entries(value as Record<string, unknown>)) {
    if (credentialKeyPattern.test(key)) throw new Error(`Credential field ${path}.${key} is forbidden.`);
    assertNoCredentials(entry, `${path}.${key}`);
  }
}

function assertIdentity(projectId: string, sceneId: string, session: DesktopProposalSession): void {
  if (session.projectId !== projectId || session.sceneId !== sceneId) throw new Error("Stored proposal session identity does not match the active project and Scene.");
  if (session.batch.base.targetId !== sceneId || session.history.batchId !== session.batch.batchId) throw new Error("Proposal session batch target or history identity is foreign.");
}

function assertLocalAuthority(batch: ProposalBatch): void {
  if (batch.targetAuthority.domain !== "local-project" || batch.targetAuthority.requiredActiveGm) {
    throw new Error("Desktop proposal sessions accept local-project batches only; repository and active-GM authority remain separate.");
  }
  if (batch.reviewAuthority.domain !== "human-review") throw new Error("Desktop local-project sessions require the human-review domain.");
}

export async function validateDesktopProposalSession(input: unknown): Promise<DesktopProposalSession> {
  if (input === null || typeof input !== "object" || Array.isArray(input)) throw new Error("Proposal session must be an object.");
  const record = input as Record<string, unknown>;
  const expectedKeys = ["batch", "history", "projectId", "sceneId", "schemaVersion"];
  if (Object.keys(record).sort().join("|") !== expectedKeys.sort().join("|")) throw new Error("Proposal session contains unknown or missing fields.");
  if (record.schemaVersion !== DESKTOP_PROPOSAL_SESSION_SCHEMA_VERSION || typeof record.projectId !== "string" || typeof record.sceneId !== "string") {
    throw new Error("Proposal session identity or schema version is invalid.");
  }
  desktopProposalSessionStorageKey(record.projectId, record.sceneId);
  const batch = await validateProposalBatch(record.batch);
  const history = validateProposalBatchHistory(record.history, batch);
  const session: DesktopProposalSession = {
    schemaVersion: DESKTOP_PROPOSAL_SESSION_SCHEMA_VERSION,
    projectId: record.projectId,
    sceneId: record.sceneId,
    batch,
    history,
  };
  assertIdentity(session.projectId, session.sceneId, session);
  assertLocalAuthority(batch);
  assertNoCredentials(session);
  return session;
}

export async function createDesktopProposalSession(input: {
  readonly projectId: string;
  readonly sceneId: string;
  readonly batch: unknown;
  readonly history: unknown;
}): Promise<DesktopProposalSession> {
  return validateDesktopProposalSession({ schemaVersion: DESKTOP_PROPOSAL_SESSION_SCHEMA_VERSION, ...input });
}

export async function serializeDesktopProposalSession(input: unknown): Promise<string> {
  return JSON.stringify(await validateDesktopProposalSession(input));
}

function blocked(key: string, code: Extract<DesktopProposalSessionLoad, { status: "BLOCKED" }>["code"], reason: string): DesktopProposalSessionLoad {
  return { status: "BLOCKED", key, code, reason, session: null, projectContentWrite: false };
}

export async function loadDesktopProposalSession(storage: DesktopProposalSessionStorage, projectId: string, sceneId: string): Promise<DesktopProposalSessionLoad> {
  const key = desktopProposalSessionStorageKey(projectId, sceneId);
  let serialized: string | null;
  try {
    serialized = storage.getItem(key);
  } catch {
    return blocked(key, "STORAGE_UNAVAILABLE", "Proposal-session storage is unavailable; no state was overwritten.");
  }
  if (serialized === null) return { status: "MISSING", key, session: null, projectContentWrite: false };
  try {
    const decoded = JSON.parse(serialized) as unknown;
    const session = await validateDesktopProposalSession(decoded);
    assertIdentity(projectId, sceneId, session);
    return { status: "PASS", key, session, projectContentWrite: false };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (/identity|target|foreign/i.test(message)) return blocked(key, "FOREIGN_SESSION", `${message} No state was overwritten.`);
    if (/local-project|authority|human-review/i.test(message)) return blocked(key, "UNSUPPORTED_AUTHORITY", `${message} No state was overwritten.`);
    if (/credential/i.test(message)) return blocked(key, "CREDENTIAL_MATERIAL", `${message} No state was overwritten.`);
    return blocked(key, "MALFORMED_SESSION", "Stored proposal session failed validation; no state was overwritten.");
  }
}

export async function saveDesktopProposalSession(storage: DesktopProposalSessionStorage, projectId: string, sceneId: string, sessionInput: unknown): Promise<Readonly<{
  status: "PASS";
  key: string;
  batchRevision: number;
  historyLength: number;
  projectContentWrite: false;
}>> {
  const session = await validateDesktopProposalSession(sessionInput);
  assertIdentity(projectId, sceneId, session);
  const key = desktopProposalSessionStorageKey(projectId, sceneId);
  storage.setItem(key, JSON.stringify(session));
  return { status: "PASS", key, batchRevision: session.batch.revision, historyLength: session.history.receipts.length, projectContentWrite: false };
}

export async function clearTerminalDesktopProposalSession(storage: DesktopProposalSessionStorage, projectId: string, sceneId: string): Promise<Readonly<{
  status: "PASS";
  key: string;
  cleared: true;
  projectContentWrite: false;
}>> {
  const loaded = await loadDesktopProposalSession(storage, projectId, sceneId);
  if (loaded.status !== "PASS") throw new Error("Only an existing valid exact proposal session can be cleared.");
  if (!terminalStatuses.has(loaded.session.history.status)) throw new Error("Only a terminal proposal session can be cleared.");
  storage.removeItem(loaded.key);
  return { status: "PASS", key: loaded.key, cleared: true, projectContentWrite: false };
}

export function inspectDesktopProposalSession(session: DesktopProposalSession): Readonly<{
  projectId: string;
  sceneId: string;
  batchId: string;
  batchRevision: number;
  batchSha256: string;
  producer: ProposalBatch["producer"];
  risk: ProposalBatch["risk"];
  reviewAuthority: ProposalBatch["reviewAuthority"];
  targetAuthority: ProposalBatch["targetAuthority"];
  commandCount: number;
  status: ProposalBatchHistory["status"];
  historyLength: number;
  noWrite: true;
}> {
  return {
    projectId: session.projectId,
    sceneId: session.sceneId,
    batchId: session.batch.batchId,
    batchRevision: session.batch.revision,
    batchSha256: session.batch.batchSha256,
    producer: session.batch.producer,
    risk: session.batch.risk,
    reviewAuthority: session.batch.reviewAuthority,
    targetAuthority: session.batch.targetAuthority,
    commandCount: session.batch.commands.length,
    status: session.history.status,
    historyLength: session.history.receipts.length,
    noWrite: true,
  };
}

export function desktopProposalRecoveryView(session: DesktopProposalSession): Readonly<{
  outcomeUnknown: boolean;
  authoritativeRereadRequired: boolean;
  retryAllowed: boolean;
  latestRereadStatus: "matched" | "not-committed" | "conflict" | "unknown" | null;
}> {
  const latestReread = [...session.history.receipts].reverse().find((receipt) => receipt.reread !== null)?.reread ?? null;
  const outcomeUnknown = session.history.status === "unknown-outcome";
  return {
    outcomeUnknown,
    authoritativeRereadRequired: outcomeUnknown,
    retryAllowed: !outcomeUnknown,
    latestRereadStatus: latestReread?.status ?? null,
  };
}

async function replaceHistory(session: DesktopProposalSession, history: ProposalBatchHistory): Promise<DesktopProposalSession> {
  return validateDesktopProposalSession({ ...session, history });
}

export async function approveDesktopProposalSession(session: DesktopProposalSession, actor: ProposalBatchActor, currentBase: ProposalBatchInput["base"], observedAt: string): Promise<DesktopProposalSession> {
  return replaceHistory(session, await approveProposalBatch(session.history, session.batch, actor, currentBase, observedAt));
}

export async function beginDesktopProposalSessionApply(session: DesktopProposalSession, actor: ProposalBatchActor, currentBase: ProposalBatchInput["base"], observedAt: string): Promise<DesktopProposalSession> {
  return replaceHistory(session, await beginProposalApply(session.history, session.batch, actor, currentBase, observedAt));
}

export async function commitDesktopProposalSession(session: DesktopProposalSession, actor: ProposalBatchActor, reread: ProposalBatchReread, observedAt: string): Promise<DesktopProposalSession> {
  return replaceHistory(session, await commitProposalAfterReread(session.history, session.batch, actor, reread, observedAt));
}

export async function undoDesktopProposalSession(session: DesktopProposalSession, actor: ProposalBatchActor, reread: ProposalBatchReread, observedAt: string): Promise<DesktopProposalSession> {
  return replaceHistory(session, await undoProposalBatch(session.history, session.batch, actor, reread, observedAt));
}

export async function redoDesktopProposalSession(session: DesktopProposalSession, actor: ProposalBatchActor, reread: ProposalBatchReread, observedAt: string): Promise<DesktopProposalSession> {
  return replaceHistory(session, await redoProposalBatch(session.history, session.batch, actor, reread, observedAt));
}

export async function rejectDesktopProposalSession(session: DesktopProposalSession, actor: ProposalBatchActor, observedAt: string): Promise<DesktopProposalSession> {
  return replaceHistory(session, await rejectProposalBatch(session.history, session.batch, actor, observedAt));
}

export async function cancelDesktopProposalSession(session: DesktopProposalSession, actor: ProposalBatchActor, observedAt: string): Promise<DesktopProposalSession> {
  return replaceHistory(session, await cancelProposalBatch(session.history, session.batch, actor, observedAt));
}

export async function invalidateStaleDesktopProposalSession(session: DesktopProposalSession, actor: ProposalBatchActor, observedAt: string): Promise<DesktopProposalSession> {
  return replaceHistory(session, await invalidateStaleProposalBatch(session.history, session.batch, actor, observedAt));
}

export async function editDesktopProposalSession(session: DesktopProposalSession, actor: ProposalBatchActor, commands: ProposalBatchInput["commands"], observedAt: string, risk?: ProposalBatchInput["risk"]): Promise<DesktopProposalSession> {
  const edited = await editProposalBatch({ history: session.history, batch: session.batch, actor, observedAt, commands, ...(risk === undefined ? {} : { risk }) });
  return validateDesktopProposalSession({ ...session, batch: edited.batch, history: edited.history });
}

export async function markDesktopProposalOutcomeUnknown(session: DesktopProposalSession, actor: ProposalBatchActor, observedAt: string): Promise<DesktopProposalSession> {
  return replaceHistory(session, await markProposalOutcomeUnknown(session.history, session.batch, actor, observedAt));
}

export async function recoverDesktopProposalSession(session: DesktopProposalSession, actor: ProposalBatchActor, reread: ProposalBatchReread, observedAt: string): Promise<DesktopProposalSession> {
  return replaceHistory(session, await recoverProposalAfterReread(session.history, session.batch, actor, reread, observedAt));
}
