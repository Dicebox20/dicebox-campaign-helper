import {
  approveProposalBatch,
  beginProposalApply,
  cancelProposalBatch,
  commitProposalAfterReread,
  createProposalBatch,
  editProposalBatch,
  invalidateStaleProposalBatch,
  markProposalOutcomeUnknown,
  recoverProposalAfterReread,
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

export const DESKTOP_PROJECT_PROPOSAL_SESSION_SCHEMA_VERSION = "0.1.0" as const;

export type DesktopProjectProposalSession = Readonly<{
  schemaVersion: typeof DESKTOP_PROJECT_PROPOSAL_SESSION_SCHEMA_VERSION;
  projectId: string;
  batch: ProposalBatch;
  history: ProposalBatchHistory;
}>;

export type DesktopProjectProposalSessionStorage = Readonly<{
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}>;

export function browserDesktopProjectProposalSessionStorage(): DesktopProjectProposalSessionStorage {
  if (typeof window === "undefined" || !window.localStorage) throw new Error("Project proposal-session storage is available only in the desktop browser surface.");
  return window.localStorage;
}

export type DesktopProjectProposalSessionLoad = Readonly<{
  status: "PASS";
  key: string;
  session: DesktopProjectProposalSession;
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

export function summarizeDesktopProjectProposalSessionLoad(load: DesktopProjectProposalSessionLoad): string {
  if (load.status === "MISSING") return "MISSING";
  if (load.status === "BLOCKED") return `BLOCKED:${load.code}`;
  return `PASS:${load.session.history.status}`;
}

export type DesktopBrokenReferenceUiSessionOwnership = Readonly<{
  disposition: "TEST_OWNED_EXACT" | "OWNERSHIP_UNPROVEN";
  exactProject: boolean;
  exactProducer: boolean;
  exactCommand: boolean;
  exactBase: boolean;
  exactFixture: boolean;
  exactAuthority: boolean;
  exactBatchSemantics: boolean;
  exactIdentity: boolean;
  ownershipToken: boolean;
  previewed: boolean;
}>;

export type DesktopBrokenReferenceUiOwnershipExpectation = Readonly<{
  token: string;
  batchId: string;
  commandId: string;
}>;

export const DESKTOP_BROKEN_REFERENCE_UI_OWNERSHIP_PRODUCER = "project.broken-reference.detach.ui-self-test" as const;
export const DESKTOP_BROKEN_REFERENCE_UI_OWNERSHIP_TOKEN_PREFIX = "dicebox-broken-reference-ui-self-test-token-v1:" as const;
const issuedDesktopBrokenReferenceUiOwnershipTokens = new Map<string, Readonly<{ batchId: string | null; commandId: string | null }>>();

export function createDesktopBrokenReferenceUiOwnershipToken(): string {
  if (typeof globalThis.crypto?.randomUUID !== "function") throw new Error("Broken-reference UI self-test ownership requires a runtime nonce.");
  const token = `${DESKTOP_BROKEN_REFERENCE_UI_OWNERSHIP_TOKEN_PREFIX}${globalThis.crypto.randomUUID()}`;
  issuedDesktopBrokenReferenceUiOwnershipTokens.set(token, { batchId: null, commandId: null });
  return token;
}

export async function createDesktopBrokenReferenceUiOwnedProposalBatch(
  batch: ProposalBatch,
  ownershipToken: string,
): Promise<Readonly<{
  batch: ProposalBatch;
  ownership: DesktopBrokenReferenceUiOwnershipExpectation;
}>> {
  if (!issuedDesktopBrokenReferenceUiOwnershipTokens.has(ownershipToken)) throw new Error("Broken-reference UI self-test ownership requires a current-process token.");
  if (batch.producer.kind !== "project-store" || batch.producer.provider !== null || batch.commands.length !== 1 || batch.commands[0]?.kind !== "project.broken-reference.detach") {
    throw new Error("Broken-reference UI self-test ownership requires the exact project-store broken-reference proposal batch.");
  }
  const { batchSha256: _batchSha256, ...unsignedBatch } = batch;
  const ownedBatch = await createProposalBatch({
    ...unsignedBatch,
    producer: { ...batch.producer, sourceId: DESKTOP_BROKEN_REFERENCE_UI_OWNERSHIP_PRODUCER },
  });
  const command = ownedBatch.commands[0];
  if (!command) throw new Error("Broken-reference UI self-test ownership requires one proposal command.");
  issuedDesktopBrokenReferenceUiOwnershipTokens.set(ownershipToken, { batchId: ownedBatch.batchId, commandId: command.commandId });
  return {
    batch: ownedBatch,
    ownership: { token: ownershipToken, batchId: ownedBatch.batchId, commandId: command.commandId },
  };
}

function canonicalJson(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map((entry) => canonicalJson(entry)).join(",")}]`;
  if (value !== null && typeof value === "object") {
    return `{${Object.entries(value as Record<string, unknown>).sort(([left], [right]) => left.localeCompare(right)).map(([key, entry]) => `${JSON.stringify(key)}:${canonicalJson(entry)}`).join(",")}}`;
  }
  return JSON.stringify(value) ?? "undefined";
}

export function classifyDesktopBrokenReferenceUiSessionOwnership(
  session: DesktopProjectProposalSession | null,
  expectedBatch: ProposalBatch,
  expectedOwnership: DesktopBrokenReferenceUiOwnershipExpectation | null = null,
): DesktopBrokenReferenceUiSessionOwnership {
  const expectedCommand = expectedBatch.commands.length === 1 ? expectedBatch.commands[0] : undefined;
  const sessionCommand = session?.batch.commands.length === 1 ? session.batch.commands[0] : undefined;
  const expectedPayload = expectedCommand?.payload as Record<string, unknown> | undefined;
  const sessionPayload = sessionCommand?.payload as Record<string, unknown> | undefined;
  const exactProject = session !== null
    && session.projectId === expectedBatch.base.targetId
    && session.batch.base.targetId === expectedBatch.base.targetId
    && expectedPayload?.projectId === expectedBatch.base.targetId
    && sessionPayload?.projectId === expectedBatch.base.targetId;
  const exactProducer = expectedBatch.producer.kind === "project-store"
    && expectedBatch.producer.provider === null
    && session?.batch.producer.kind === "project-store"
    && session.batch.producer.sourceId === DESKTOP_BROKEN_REFERENCE_UI_OWNERSHIP_PRODUCER
    && session.batch.producer.provider === null;
  const exactCommand = expectedCommand?.kind === "project.broken-reference.detach"
    && sessionCommand?.kind === expectedCommand.kind;
  const exactBase = session !== null
    && session.batch.base.targetId === expectedBatch.base.targetId
    && session.batch.base.revision === expectedBatch.base.revision
    && session.batch.base.sha256 === expectedBatch.base.sha256;
  const ownershipToken = expectedOwnership !== null
    && expectedOwnership.token.startsWith(DESKTOP_BROKEN_REFERENCE_UI_OWNERSHIP_TOKEN_PREFIX)
    && issuedDesktopBrokenReferenceUiOwnershipTokens.get(expectedOwnership.token)?.batchId === expectedOwnership.batchId
    && issuedDesktopBrokenReferenceUiOwnershipTokens.get(expectedOwnership.token)?.commandId === expectedOwnership.commandId;
  const exactFixture = exactCommand
    && expectedPayload !== undefined
    && sessionPayload !== undefined
    && canonicalJson(sessionPayload) === canonicalJson(expectedPayload);
  const exactAuthority = expectedBatch.reviewAuthority.domain === "human-review"
    && expectedBatch.reviewAuthority.requiredRole === "reviewer"
    && expectedBatch.targetAuthority.domain === "local-project"
    && expectedBatch.targetAuthority.requiredActiveGm === false
    && session?.batch.reviewAuthority.domain === expectedBatch.reviewAuthority.domain
    && session.batch.reviewAuthority.requiredRole === expectedBatch.reviewAuthority.requiredRole
    && session.batch.targetAuthority.domain === expectedBatch.targetAuthority.domain
    && session.batch.targetAuthority.requiredActiveGm === expectedBatch.targetAuthority.requiredActiveGm;
  const exactBatchSemantics = session !== null
    && session.batch.revision === expectedBatch.revision
    && session.batch.previousBatchSha256 === expectedBatch.previousBatchSha256
    && session.batch.risk === expectedBatch.risk
    && session.batch.commands.length === expectedBatch.commands.length
    && sessionCommand !== undefined
    && expectedCommand !== undefined
    && canonicalJson(sessionCommand.dependsOn) === canonicalJson(expectedCommand.dependsOn);
  const targetSlug = expectedBatch.base.targetId.replace(/[^a-z0-9._-]/gi, "-").toLowerCase();
  const batchIdPattern = new RegExp(`^dbx:proposal:desktop-project-broken-reference-detach-${targetSlug}-\\d+$`);
  const expectedIdentity = expectedOwnership !== null
    && batchIdPattern.test(expectedOwnership.batchId)
    && expectedOwnership.commandId === `dbx:proposal-command:${expectedOwnership.batchId.split(":").at(-1) ?? ""}-000`;
  const exactIdentity = session !== null
    && expectedOwnership !== null
    && expectedIdentity
    && session.batch.batchId === expectedOwnership.batchId
    && sessionCommand?.commandId === expectedOwnership.commandId;
  const previewed = session?.history.status === "previewed";
  const exact = exactProject && exactProducer && exactCommand && exactBase && exactFixture && exactAuthority && exactBatchSemantics && exactIdentity && ownershipToken && previewed;
  return {
    disposition: exact ? "TEST_OWNED_EXACT" : "OWNERSHIP_UNPROVEN",
    exactProject,
    exactProducer,
    exactCommand,
    exactBase,
    exactFixture,
    exactAuthority,
    exactBatchSemantics,
    exactIdentity,
    ownershipToken,
    previewed,
  };
}

const stableIdPattern = /^dbx:[a-z0-9][a-z0-9._-]*:[a-z0-9][a-z0-9._-]*$/;
const terminalStatuses = new Set<ProposalBatchHistory["status"]>(["rejected", "cancelled", "stale", "committed", "recovered", "undone", "redone"]);
const forbiddenPayloadKey = /^(bytes|rawBytes|path|absolutePath|credential|password|secret|approved|execute|execution)$/i;
export const DESKTOP_PROJECT_SAVE_UI_SELF_TEST_PROJECT_ID = "dbx:project:desktop-multiscene-self-test" as const;
export const DESKTOP_PROJECT_SAVE_UI_SELF_TEST_SCOPE = "project-save-ui-self-test" as const;
export const DESKTOP_BROKEN_REFERENCE_UI_SELF_TEST_PROJECT_ID = "dbx:project:desktop-broken-reference-ui-lifecycle-self-test-v2" as const;
export const DESKTOP_BROKEN_REFERENCE_UI_SELF_TEST_SCOPE = "broken-reference-ui-self-test" as const;
export const DESKTOP_BROKEN_REFERENCE_UI_SELF_TEST_V3_PROJECT_ID = "dbx:project:desktop-broken-reference-ui-lifecycle-self-test-v3" as const;
export const DESKTOP_BROKEN_REFERENCE_UI_SELF_TEST_V3_SCOPE = "broken-reference-ui-self-test-v3" as const;
export const DESKTOP_BROKEN_REFERENCE_UI_SELF_TEST_V4_PROJECT_ID = "dbx:project:desktop-broken-reference-ui-lifecycle-self-test-v4" as const;
export const DESKTOP_BROKEN_REFERENCE_UI_SELF_TEST_V4_SCOPE = "broken-reference-ui-self-test-v4" as const;
export const DESKTOP_ASSET_DETACH_UI_SELF_TEST_PROJECT_ID = "dbx:project:desktop-asset-detach-ui-lifecycle-self-test-v1" as const;
export const DESKTOP_ASSET_DETACH_UI_SELF_TEST_SCOPE = "asset-detach-ui-self-test" as const;
export const DESKTOP_ASSET_DETACH_UI_SELF_TEST_V2_SCOPE = "asset-detach-ui-self-test-v2" as const;
export const DESKTOP_ASSET_RESTORE_UI_SELF_TEST_PROJECT_ID = "dbx:project:desktop-asset-restore-trace-self-test-v2" as const;
export const DESKTOP_ASSET_RESTORE_UI_SELF_TEST_V2_SCOPE = "asset-restore-ui-self-test-v2" as const;
export const DESKTOP_ASSET_RESTORE_UI_SELF_TEST_V3_PROJECT_ID = "dbx:project:desktop-asset-restore-trace-self-test-v3" as const;
export const DESKTOP_ASSET_RESTORE_UI_SELF_TEST_V3_SCOPE = "asset-restore-ui-self-test-v3" as const;
export type DesktopProjectProposalSessionScope = "ordinary" | typeof DESKTOP_PROJECT_SAVE_UI_SELF_TEST_SCOPE | typeof DESKTOP_BROKEN_REFERENCE_UI_SELF_TEST_SCOPE | typeof DESKTOP_BROKEN_REFERENCE_UI_SELF_TEST_V3_SCOPE | typeof DESKTOP_BROKEN_REFERENCE_UI_SELF_TEST_V4_SCOPE | typeof DESKTOP_ASSET_DETACH_UI_SELF_TEST_SCOPE | typeof DESKTOP_ASSET_DETACH_UI_SELF_TEST_V2_SCOPE | typeof DESKTOP_ASSET_RESTORE_UI_SELF_TEST_V2_SCOPE | typeof DESKTOP_ASSET_RESTORE_UI_SELF_TEST_V3_SCOPE;

export function desktopProjectProposalSessionStorageKey(projectId: string): string {
  if (projectId === DESKTOP_BROKEN_REFERENCE_UI_SELF_TEST_PROJECT_ID || projectId === DESKTOP_BROKEN_REFERENCE_UI_SELF_TEST_V3_PROJECT_ID || projectId === DESKTOP_BROKEN_REFERENCE_UI_SELF_TEST_V4_PROJECT_ID) throw new Error("The broken-reference UI self-test target requires its closed typed session namespace.");
  if (projectId === DESKTOP_ASSET_DETACH_UI_SELF_TEST_PROJECT_ID || projectId === DESKTOP_ASSET_RESTORE_UI_SELF_TEST_PROJECT_ID || projectId === DESKTOP_ASSET_RESTORE_UI_SELF_TEST_V3_PROJECT_ID) throw new Error("This self-test target requires its closed typed session namespace.");
  if (!stableIdPattern.test(projectId)) throw new Error("Project proposal sessions require a stable project ID.");
  return `dicebox.project-proposal-session.v1:${encodeURIComponent(projectId)}`;
}

function desktopProjectProposalSessionStorageKeyForScope(projectId: string, scope: DesktopProjectProposalSessionScope): string {
  if (scope === "ordinary") return desktopProjectProposalSessionStorageKey(projectId);
  const expectedProjectId = scope === DESKTOP_PROJECT_SAVE_UI_SELF_TEST_SCOPE
    ? DESKTOP_PROJECT_SAVE_UI_SELF_TEST_PROJECT_ID
    : scope === DESKTOP_BROKEN_REFERENCE_UI_SELF_TEST_SCOPE
      ? DESKTOP_BROKEN_REFERENCE_UI_SELF_TEST_PROJECT_ID
      : scope === DESKTOP_BROKEN_REFERENCE_UI_SELF_TEST_V3_SCOPE
        ? DESKTOP_BROKEN_REFERENCE_UI_SELF_TEST_V3_PROJECT_ID
        : scope === DESKTOP_BROKEN_REFERENCE_UI_SELF_TEST_V4_SCOPE
          ? DESKTOP_BROKEN_REFERENCE_UI_SELF_TEST_V4_PROJECT_ID
          : scope === DESKTOP_ASSET_DETACH_UI_SELF_TEST_SCOPE || scope === DESKTOP_ASSET_DETACH_UI_SELF_TEST_V2_SCOPE
            ? DESKTOP_ASSET_DETACH_UI_SELF_TEST_PROJECT_ID
            : scope === DESKTOP_ASSET_RESTORE_UI_SELF_TEST_V2_SCOPE
              ? DESKTOP_ASSET_RESTORE_UI_SELF_TEST_PROJECT_ID
              : DESKTOP_ASSET_RESTORE_UI_SELF_TEST_V3_PROJECT_ID;
  if (projectId !== expectedProjectId) {
    if (scope === DESKTOP_BROKEN_REFERENCE_UI_SELF_TEST_SCOPE || scope === DESKTOP_BROKEN_REFERENCE_UI_SELF_TEST_V3_SCOPE || scope === DESKTOP_BROKEN_REFERENCE_UI_SELF_TEST_V4_SCOPE) throw new Error("The broken-reference UI self-test namespace requires its exact fixed test-owned project identity.");
    throw new Error("The self-test namespace requires its exact fixed test-owned project identity.");
  }
  return `dicebox.project-proposal-session.v1:${scope}:${encodeURIComponent(projectId)}`;
}

export function desktopProjectSaveUiSelfTestSessionStorageKey(): string {
  return desktopProjectProposalSessionStorageKeyForScope(DESKTOP_PROJECT_SAVE_UI_SELF_TEST_PROJECT_ID, DESKTOP_PROJECT_SAVE_UI_SELF_TEST_SCOPE);
}

export function desktopBrokenReferenceUiSelfTestSessionStorageKey(): string {
  return desktopProjectProposalSessionStorageKeyForScope(DESKTOP_BROKEN_REFERENCE_UI_SELF_TEST_PROJECT_ID, DESKTOP_BROKEN_REFERENCE_UI_SELF_TEST_SCOPE);
}

export function desktopBrokenReferenceUiV3SelfTestSessionStorageKey(): string {
  return desktopProjectProposalSessionStorageKeyForScope(DESKTOP_BROKEN_REFERENCE_UI_SELF_TEST_V3_PROJECT_ID, DESKTOP_BROKEN_REFERENCE_UI_SELF_TEST_V3_SCOPE);
}

export function desktopBrokenReferenceUiV4SelfTestSessionStorageKey(): string {
  return desktopProjectProposalSessionStorageKeyForScope(DESKTOP_BROKEN_REFERENCE_UI_SELF_TEST_V4_PROJECT_ID, DESKTOP_BROKEN_REFERENCE_UI_SELF_TEST_V4_SCOPE);
}

export function desktopAssetDetachUiSelfTestSessionStorageKey(): string {
  return desktopProjectProposalSessionStorageKeyForScope(DESKTOP_ASSET_DETACH_UI_SELF_TEST_PROJECT_ID, DESKTOP_ASSET_DETACH_UI_SELF_TEST_SCOPE);
}

export function desktopAssetDetachUiV2SelfTestSessionStorageKey(): string {
  return desktopProjectProposalSessionStorageKeyForScope(DESKTOP_ASSET_DETACH_UI_SELF_TEST_PROJECT_ID, DESKTOP_ASSET_DETACH_UI_SELF_TEST_V2_SCOPE);
}

export function desktopAssetRestoreUiV2SelfTestSessionStorageKey(): string {
  return desktopProjectProposalSessionStorageKeyForScope(DESKTOP_ASSET_RESTORE_UI_SELF_TEST_PROJECT_ID, DESKTOP_ASSET_RESTORE_UI_SELF_TEST_V2_SCOPE);
}

export function desktopAssetRestoreUiV3SelfTestSessionStorageKey(): string {
  return desktopProjectProposalSessionStorageKeyForScope(DESKTOP_ASSET_RESTORE_UI_SELF_TEST_V3_PROJECT_ID, DESKTOP_ASSET_RESTORE_UI_SELF_TEST_V3_SCOPE);
}

function record(value: unknown, label: string): Record<string, unknown> {
  if (value === null || typeof value !== "object" || Array.isArray(value)) throw new Error(`${label} must be an object.`);
  return value as Record<string, unknown>;
}

function assertNoForbiddenPayload(value: unknown, path = "batch"): void {
  if (value === null || typeof value !== "object") return;
  if (Array.isArray(value)) {
    value.forEach((entry, index) => assertNoForbiddenPayload(entry, `${path}[${index}]`));
    return;
  }
  for (const [key, entry] of Object.entries(value as Record<string, unknown>)) {
    if (forbiddenPayloadKey.test(key)) throw new Error(`Project proposal payload contains forbidden field ${path}.${key}.`);
    assertNoForbiddenPayload(entry, `${path}.${key}`);
  }
}

function assertProjectBatch(projectId: string, batch: ProposalBatch): void {
  if (batch.base.targetId !== projectId) throw new Error("Project proposal batch target does not match the exact project session key.");
  const isProjectStoreBatch = batch.producer.kind === "project-store" && batch.producer.provider === null;
  const isRenameBatch = batch.producer.kind === "human"
    && batch.producer.sourceId === "desktop.project.rename"
    && batch.producer.provider === null
    && batch.commands.length === 1
    && batch.commands[0]?.kind === "project.rename";
  const isAddSceneBatch = batch.producer.kind === "human"
    && batch.producer.sourceId === "desktop.project.add-scene"
    && batch.producer.provider === null
    && batch.commands.length === 1
    && batch.commands[0]?.kind === "project.add-scene";
  if (!isProjectStoreBatch && !isRenameBatch && !isAddSceneBatch) throw new Error("Project sessions accept project-store batches without a provider or the exact human project.rename/project.add-scene batch only.");
  if (batch.reviewAuthority.domain !== "human-review" || batch.targetAuthority.domain !== "local-project" || batch.targetAuthority.requiredActiveGm) {
    throw new Error("Project sessions require human-review and local-project authority without active-GM execution.");
  }
  if (batch.commands.some((command) => !command.kind.startsWith("project."))) throw new Error("Project sessions accept project-operation commands only.");
  if (isAddSceneBatch) assertExactAddScenePayload(batch.commands[0]!.payload, projectId);
  assertNoForbiddenPayload(batch);
}

function assertBrokenReferenceUiSelfTestBatch(batch: ProposalBatch): void {
  if (batch.producer.kind !== "project-store"
    || batch.producer.provider !== null
    || batch.producer.sourceId !== DESKTOP_BROKEN_REFERENCE_UI_OWNERSHIP_PRODUCER
    || batch.commands.length !== 1
    || batch.commands[0]?.kind !== "project.broken-reference.detach") {
    throw new Error("Broken-reference UI self-test session is not the exact closed test-owned proposal batch.");
  }
}

function assertProjectSaveUiSelfTestBatch(batch: ProposalBatch): void {
  if (batch.producer.kind !== "project-store"
    || batch.producer.provider !== null
    || batch.producer.sourceId !== "desktop.project.save"
    || batch.commands.length !== 1
    || batch.commands[0]?.kind !== "project.save") {
    throw new Error("Project-save UI self-test session is not the exact closed test-owned proposal batch.");
  }
}

function assertExactAddScenePayload(payloadInput: unknown, projectId: string): void {
  const payload = record(payloadInput, "Add-Scene proposal payload");
  const expectedKeys = ["addedOrdinal", "addedSceneId", "currentActiveSceneId", "currentSceneCount", "currentSceneIds", "currentScenesSha256", "operation", "previewSha256", "proposedActiveSceneId", "proposedSceneCount", "proposedSceneIds", "proposedScenesSha256", "projectId"];
  if (Object.keys(payload).sort().join("|") !== expectedKeys.sort().join("|") || payload.operation !== "project.add-scene" || payload.projectId !== projectId) {
    throw new Error("Add-Scene proposal payload is not the exact typed metadata-only shape.");
  }
  if (!Array.isArray(payload.currentSceneIds) || !Array.isArray(payload.proposedSceneIds) || typeof payload.currentScenesSha256 !== "string" || typeof payload.proposedScenesSha256 !== "string" || typeof payload.previewSha256 !== "string" || typeof payload.currentActiveSceneId !== "string" || typeof payload.proposedActiveSceneId !== "string" || typeof payload.addedSceneId !== "string" || typeof payload.currentSceneCount !== "number" || typeof payload.proposedSceneCount !== "number" || typeof payload.addedOrdinal !== "number") {
    throw new Error("Add-Scene proposal payload contains invalid metadata.");
  }
}

export async function validateDesktopProjectProposalSession(input: unknown): Promise<DesktopProjectProposalSession> {
  const value = record(input, "Project proposal session");
  const expectedKeys = ["batch", "history", "projectId", "schemaVersion"];
  if (Object.keys(value).sort().join("|") !== expectedKeys.sort().join("|")) throw new Error("Project proposal session contains unknown or missing fields.");
  if (value.schemaVersion !== DESKTOP_PROJECT_PROPOSAL_SESSION_SCHEMA_VERSION || typeof value.projectId !== "string" || !stableIdPattern.test(value.projectId)) {
    throw new Error("Project proposal session schema or identity is invalid.");
  }
  const batch = await validateProposalBatch(value.batch);
  const history = validateProposalBatchHistory(value.history, batch);
  assertProjectBatch(value.projectId, batch);
  if (history.batchId !== batch.batchId) throw new Error("Project proposal history contains a foreign batch.");
  return { schemaVersion: DESKTOP_PROJECT_PROPOSAL_SESSION_SCHEMA_VERSION, projectId: value.projectId, batch, history };
}

export async function createDesktopProjectProposalSession(input: {
  readonly projectId: string;
  readonly batch: unknown;
  readonly history: unknown;
}): Promise<DesktopProjectProposalSession> {
  return validateDesktopProjectProposalSession({ schemaVersion: DESKTOP_PROJECT_PROPOSAL_SESSION_SCHEMA_VERSION, ...input });
}

export async function createDesktopProjectRenameProposalSession(input: {
  readonly projectId: string;
  readonly batch: unknown;
  readonly history: unknown;
}): Promise<DesktopProjectProposalSession> {
  const batch = await validateProposalBatch(input.batch);
  if (batch.base.targetId !== input.projectId
    || batch.producer.kind !== "human"
    || batch.producer.sourceId !== "desktop.project.rename"
    || batch.producer.provider !== null
    || batch.commands.length !== 1
    || batch.commands[0]?.kind !== "project.rename") {
    throw new Error("Rename sessions require the exact human/no-provider project.rename batch for the project key.");
  }
  const payload = batch.commands[0].payload;
  const expectedKeys = ["contentSha256", "currentDisplayName", "operation", "previewSha256", "projectId", "proposedDisplayName", "workspaceIndexGeneration"];
  if (Object.keys(payload).sort().join("|") !== expectedKeys.sort().join("|")
    || payload.operation !== "project.rename"
    || payload.projectId !== input.projectId
    || typeof payload.contentSha256 !== "string"
    || typeof payload.previewSha256 !== "string"
    || typeof payload.currentDisplayName !== "string"
    || typeof payload.proposedDisplayName !== "string"
    || typeof payload.workspaceIndexGeneration !== "number") {
    throw new Error("Rename proposal payload is not the exact typed metadata-only shape.");
  }
  return createDesktopProjectProposalSession(input);
}

export async function createDesktopProjectAddSceneProposalSession(input: {
  readonly projectId: string;
  readonly batch: unknown;
  readonly history: unknown;
}): Promise<DesktopProjectProposalSession> {
  const batch = await validateProposalBatch(input.batch);
  if (batch.base.targetId !== input.projectId
    || batch.producer.kind !== "human"
    || batch.producer.sourceId !== "desktop.project.add-scene"
    || batch.producer.provider !== null
    || batch.commands.length !== 1
    || batch.commands[0]?.kind !== "project.add-scene") {
    throw new Error("Add-Scene sessions require the exact human/no-provider project.add-scene batch for the project key.");
  }
  assertExactAddScenePayload(batch.commands[0].payload, input.projectId);
  return createDesktopProjectProposalSession(input);
}

export async function serializeDesktopProjectProposalSession(input: unknown): Promise<string> {
  return JSON.stringify(await validateDesktopProjectProposalSession(input));
}

function blocked(key: string, code: Extract<DesktopProjectProposalSessionLoad, { status: "BLOCKED" }>['code'], reason: string): DesktopProjectProposalSessionLoad {
  return { status: "BLOCKED", key, code, reason, session: null, projectContentWrite: false };
}

async function loadDesktopProjectProposalSessionInScope(storage: DesktopProjectProposalSessionStorage, projectId: string, scope: DesktopProjectProposalSessionScope): Promise<DesktopProjectProposalSessionLoad> {
  const key = desktopProjectProposalSessionStorageKeyForScope(projectId, scope);
  let serialized: string | null;
  try {
    serialized = storage.getItem(key);
  } catch {
    return blocked(key, "STORAGE_UNAVAILABLE", "Project proposal-session storage is unavailable; no state was overwritten.");
  }
  if (serialized === null) return { status: "MISSING", key, session: null, projectContentWrite: false };
  try {
    const session = await validateDesktopProjectProposalSession(JSON.parse(serialized) as unknown);
    if (session.projectId !== projectId) return blocked(key, "FOREIGN_SESSION", "Stored project proposal session identity is foreign; no state was overwritten.");
    if (scope === DESKTOP_PROJECT_SAVE_UI_SELF_TEST_SCOPE) assertProjectSaveUiSelfTestBatch(session.batch);
    if (scope === DESKTOP_BROKEN_REFERENCE_UI_SELF_TEST_SCOPE || scope === DESKTOP_BROKEN_REFERENCE_UI_SELF_TEST_V3_SCOPE || scope === DESKTOP_BROKEN_REFERENCE_UI_SELF_TEST_V4_SCOPE) assertBrokenReferenceUiSelfTestBatch(session.batch);
    return { status: "PASS", key, session, projectContentWrite: false };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (/target|identity|foreign|project session key/i.test(message)) return blocked(key, "FOREIGN_SESSION", `${message} No state was overwritten.`);
    if (/authority|active-GM|provider|project-store/i.test(message)) return blocked(key, "UNSUPPORTED_AUTHORITY", `${message} No state was overwritten.`);
    if (/forbidden field|credential|password|secret|bytes|path/i.test(message)) return blocked(key, "CREDENTIAL_MATERIAL", `${message} No state was overwritten.`);
    return blocked(key, "MALFORMED_SESSION", "Stored project proposal session failed validation; no state was overwritten.");
  }
}

export function loadDesktopProjectProposalSession(storage: DesktopProjectProposalSessionStorage, projectId: string): Promise<DesktopProjectProposalSessionLoad> {
  return loadDesktopProjectProposalSessionInScope(storage, projectId, "ordinary");
}

export function loadDesktopProjectSaveUiSelfTestProposalSession(storage: DesktopProjectProposalSessionStorage): Promise<DesktopProjectProposalSessionLoad> {
  return loadDesktopProjectProposalSessionInScope(storage, DESKTOP_PROJECT_SAVE_UI_SELF_TEST_PROJECT_ID, DESKTOP_PROJECT_SAVE_UI_SELF_TEST_SCOPE);
}

export function loadDesktopBrokenReferenceUiSelfTestProposalSession(storage: DesktopProjectProposalSessionStorage): Promise<DesktopProjectProposalSessionLoad> {
  return loadDesktopProjectProposalSessionInScope(storage, DESKTOP_BROKEN_REFERENCE_UI_SELF_TEST_PROJECT_ID, DESKTOP_BROKEN_REFERENCE_UI_SELF_TEST_SCOPE);
}

export function loadDesktopBrokenReferenceUiV3SelfTestProposalSession(storage: DesktopProjectProposalSessionStorage): Promise<DesktopProjectProposalSessionLoad> {
  return loadDesktopProjectProposalSessionInScope(storage, DESKTOP_BROKEN_REFERENCE_UI_SELF_TEST_V3_PROJECT_ID, DESKTOP_BROKEN_REFERENCE_UI_SELF_TEST_V3_SCOPE);
}

export function loadDesktopBrokenReferenceUiV4SelfTestProposalSession(storage: DesktopProjectProposalSessionStorage): Promise<DesktopProjectProposalSessionLoad> {
  return loadDesktopProjectProposalSessionInScope(storage, DESKTOP_BROKEN_REFERENCE_UI_SELF_TEST_V4_PROJECT_ID, DESKTOP_BROKEN_REFERENCE_UI_SELF_TEST_V4_SCOPE);
}

export function loadDesktopAssetDetachUiSelfTestProposalSession(storage: DesktopProjectProposalSessionStorage): Promise<DesktopProjectProposalSessionLoad> {
  return loadDesktopProjectProposalSessionInScope(storage, DESKTOP_ASSET_DETACH_UI_SELF_TEST_PROJECT_ID, DESKTOP_ASSET_DETACH_UI_SELF_TEST_SCOPE);
}

export function loadDesktopAssetDetachUiV2SelfTestProposalSession(storage: DesktopProjectProposalSessionStorage): Promise<DesktopProjectProposalSessionLoad> {
  return loadDesktopProjectProposalSessionInScope(storage, DESKTOP_ASSET_DETACH_UI_SELF_TEST_PROJECT_ID, DESKTOP_ASSET_DETACH_UI_SELF_TEST_V2_SCOPE);
}

export function loadDesktopAssetRestoreUiV2SelfTestProposalSession(storage: DesktopProjectProposalSessionStorage): Promise<DesktopProjectProposalSessionLoad> {
  return loadDesktopProjectProposalSessionInScope(storage, DESKTOP_ASSET_RESTORE_UI_SELF_TEST_PROJECT_ID, DESKTOP_ASSET_RESTORE_UI_SELF_TEST_V2_SCOPE);
}

export function loadDesktopAssetRestoreUiV3SelfTestProposalSession(storage: DesktopProjectProposalSessionStorage): Promise<DesktopProjectProposalSessionLoad> {
  return loadDesktopProjectProposalSessionInScope(storage, DESKTOP_ASSET_RESTORE_UI_SELF_TEST_V3_PROJECT_ID, DESKTOP_ASSET_RESTORE_UI_SELF_TEST_V3_SCOPE);
}

async function saveDesktopProjectProposalSessionInScope(storage: DesktopProjectProposalSessionStorage, projectId: string, sessionInput: unknown, scope: DesktopProjectProposalSessionScope): Promise<Readonly<{
  status: "PASS";
  key: string;
  batchRevision: number;
  historyLength: number;
  projectContentWrite: false;
}>> {
  const session = await validateDesktopProjectProposalSession(sessionInput);
  if (session.projectId !== projectId) throw new Error("Project proposal session identity does not match the exact project key.");
  if (scope === DESKTOP_PROJECT_SAVE_UI_SELF_TEST_SCOPE) assertProjectSaveUiSelfTestBatch(session.batch);
  if (scope === DESKTOP_BROKEN_REFERENCE_UI_SELF_TEST_SCOPE || scope === DESKTOP_BROKEN_REFERENCE_UI_SELF_TEST_V3_SCOPE || scope === DESKTOP_BROKEN_REFERENCE_UI_SELF_TEST_V4_SCOPE) assertBrokenReferenceUiSelfTestBatch(session.batch);
  const key = desktopProjectProposalSessionStorageKeyForScope(projectId, scope);
  const existing = await loadDesktopProjectProposalSessionInScope(storage, projectId, scope);
  if (existing.status === "PASS") {
    if (existing.session.batch.batchId !== session.batch.batchId) throw new Error("An existing project proposal session must reach a terminal state and be cleared before replacement.");
    if (session.history.receipts.length < existing.session.history.receipts.length) throw new Error("Project proposal history cannot be truncated.");
    const prior = existing.session.history.receipts.map((receipt) => JSON.stringify(receipt)).join("|");
    const next = session.history.receipts.slice(0, existing.session.history.receipts.length).map((receipt) => JSON.stringify(receipt)).join("|");
    if (prior !== next) throw new Error("Project proposal history is not append-only.");
  } else if (existing.status === "BLOCKED") {
    throw new Error("Existing project proposal session is invalid; no state was overwritten.");
  }
  storage.setItem(key, JSON.stringify(session));
  return { status: "PASS", key, batchRevision: session.batch.revision, historyLength: session.history.receipts.length, projectContentWrite: false };
}

export function saveDesktopProjectProposalSession(storage: DesktopProjectProposalSessionStorage, projectId: string, sessionInput: unknown): Promise<Readonly<{
  status: "PASS";
  key: string;
  batchRevision: number;
  historyLength: number;
  projectContentWrite: false;
}>> {
  return saveDesktopProjectProposalSessionInScope(storage, projectId, sessionInput, "ordinary");
}

export function saveDesktopProjectSaveUiSelfTestProposalSession(storage: DesktopProjectProposalSessionStorage, sessionInput: unknown): Promise<Readonly<{
  status: "PASS";
  key: string;
  batchRevision: number;
  historyLength: number;
  projectContentWrite: false;
}>> {
  return saveDesktopProjectProposalSessionInScope(storage, DESKTOP_PROJECT_SAVE_UI_SELF_TEST_PROJECT_ID, sessionInput, DESKTOP_PROJECT_SAVE_UI_SELF_TEST_SCOPE);
}

export function saveDesktopBrokenReferenceUiSelfTestProposalSession(storage: DesktopProjectProposalSessionStorage, sessionInput: unknown): Promise<Readonly<{
  status: "PASS";
  key: string;
  batchRevision: number;
  historyLength: number;
  projectContentWrite: false;
}>> {
  return saveDesktopProjectProposalSessionInScope(storage, DESKTOP_BROKEN_REFERENCE_UI_SELF_TEST_PROJECT_ID, sessionInput, DESKTOP_BROKEN_REFERENCE_UI_SELF_TEST_SCOPE);
}

export function saveDesktopBrokenReferenceUiV3SelfTestProposalSession(storage: DesktopProjectProposalSessionStorage, sessionInput: unknown): Promise<Readonly<{
  status: "PASS";
  key: string;
  batchRevision: number;
  historyLength: number;
  projectContentWrite: false;
}>> {
  return saveDesktopProjectProposalSessionInScope(storage, DESKTOP_BROKEN_REFERENCE_UI_SELF_TEST_V3_PROJECT_ID, sessionInput, DESKTOP_BROKEN_REFERENCE_UI_SELF_TEST_V3_SCOPE);
}

export function saveDesktopBrokenReferenceUiV4SelfTestProposalSession(storage: DesktopProjectProposalSessionStorage, sessionInput: unknown): Promise<Readonly<{
  status: "PASS";
  key: string;
  batchRevision: number;
  historyLength: number;
  projectContentWrite: false;
}>> {
  return saveDesktopProjectProposalSessionInScope(storage, DESKTOP_BROKEN_REFERENCE_UI_SELF_TEST_V4_PROJECT_ID, sessionInput, DESKTOP_BROKEN_REFERENCE_UI_SELF_TEST_V4_SCOPE);
}

export function saveDesktopAssetDetachUiSelfTestProposalSession(storage: DesktopProjectProposalSessionStorage, sessionInput: unknown): Promise<Readonly<{
  status: "PASS";
  key: string;
  batchRevision: number;
  historyLength: number;
  projectContentWrite: false;
}>> {
  return saveDesktopProjectProposalSessionInScope(storage, DESKTOP_ASSET_DETACH_UI_SELF_TEST_PROJECT_ID, sessionInput, DESKTOP_ASSET_DETACH_UI_SELF_TEST_SCOPE);
}

export function saveDesktopAssetDetachUiV2SelfTestProposalSession(storage: DesktopProjectProposalSessionStorage, sessionInput: unknown): Promise<Readonly<{
  status: "PASS";
  key: string;
  batchRevision: number;
  historyLength: number;
  projectContentWrite: false;
}>> {
  return saveDesktopProjectProposalSessionInScope(storage, DESKTOP_ASSET_DETACH_UI_SELF_TEST_PROJECT_ID, sessionInput, DESKTOP_ASSET_DETACH_UI_SELF_TEST_V2_SCOPE);
}

export function saveDesktopAssetRestoreUiV2SelfTestProposalSession(storage: DesktopProjectProposalSessionStorage, sessionInput: unknown): Promise<Readonly<{
  status: "PASS";
  key: string;
  batchRevision: number;
  historyLength: number;
  projectContentWrite: false;
}>> {
  return saveDesktopProjectProposalSessionInScope(storage, DESKTOP_ASSET_RESTORE_UI_SELF_TEST_PROJECT_ID, sessionInput, DESKTOP_ASSET_RESTORE_UI_SELF_TEST_V2_SCOPE);
}

export function saveDesktopAssetRestoreUiV3SelfTestProposalSession(storage: DesktopProjectProposalSessionStorage, sessionInput: unknown): Promise<Readonly<{
  status: "PASS";
  key: string;
  batchRevision: number;
  historyLength: number;
  projectContentWrite: false;
}>> {
  return saveDesktopProjectProposalSessionInScope(storage, DESKTOP_ASSET_RESTORE_UI_SELF_TEST_V3_PROJECT_ID, sessionInput, DESKTOP_ASSET_RESTORE_UI_SELF_TEST_V3_SCOPE);
}

export function clearTerminalDesktopAssetRestoreUiV2SelfTestProposalSession(storage: DesktopProjectProposalSessionStorage): Promise<Readonly<{
  status: "PASS";
  key: string;
  cleared: true;
  projectContentWrite: false;
}>> {
  return clearTerminalDesktopProjectProposalSessionInScope(storage, DESKTOP_ASSET_RESTORE_UI_SELF_TEST_PROJECT_ID, DESKTOP_ASSET_RESTORE_UI_SELF_TEST_V2_SCOPE);
}

export function clearTerminalDesktopAssetRestoreUiV3SelfTestProposalSession(storage: DesktopProjectProposalSessionStorage): Promise<Readonly<{
  status: "PASS";
  key: string;
  cleared: true;
  projectContentWrite: false;
}>> {
  return clearTerminalDesktopProjectProposalSessionInScope(storage, DESKTOP_ASSET_RESTORE_UI_SELF_TEST_V3_PROJECT_ID, DESKTOP_ASSET_RESTORE_UI_SELF_TEST_V3_SCOPE);
}

async function clearTerminalDesktopProjectProposalSessionInScope(storage: DesktopProjectProposalSessionStorage, projectId: string, scope: DesktopProjectProposalSessionScope): Promise<Readonly<{
  status: "PASS";
  key: string;
  cleared: true;
  projectContentWrite: false;
}>> {
  const loaded = await loadDesktopProjectProposalSessionInScope(storage, projectId, scope);
  if (loaded.status !== "PASS") throw new Error("Only an existing valid exact project proposal session can be cleared.");
  if (!terminalStatuses.has(loaded.session.history.status)) throw new Error("Only a terminal project proposal session can be cleared.");
  storage.removeItem(loaded.key);
  return { status: "PASS", key: loaded.key, cleared: true, projectContentWrite: false };
}

export function clearTerminalDesktopProjectProposalSession(storage: DesktopProjectProposalSessionStorage, projectId: string): Promise<Readonly<{
  status: "PASS";
  key: string;
  cleared: true;
  projectContentWrite: false;
}>> {
  return clearTerminalDesktopProjectProposalSessionInScope(storage, projectId, "ordinary");
}

export function clearTerminalDesktopProjectSaveUiSelfTestProposalSession(storage: DesktopProjectProposalSessionStorage): Promise<Readonly<{
  status: "PASS";
  key: string;
  cleared: true;
  projectContentWrite: false;
}>> {
  return clearTerminalDesktopProjectProposalSessionInScope(storage, DESKTOP_PROJECT_SAVE_UI_SELF_TEST_PROJECT_ID, DESKTOP_PROJECT_SAVE_UI_SELF_TEST_SCOPE);
}

export function clearTerminalDesktopBrokenReferenceUiSelfTestProposalSession(storage: DesktopProjectProposalSessionStorage): Promise<Readonly<{
  status: "PASS";
  key: string;
  cleared: true;
  projectContentWrite: false;
}>> {
  return clearTerminalDesktopProjectProposalSessionInScope(storage, DESKTOP_BROKEN_REFERENCE_UI_SELF_TEST_PROJECT_ID, DESKTOP_BROKEN_REFERENCE_UI_SELF_TEST_SCOPE);
}

export function clearTerminalDesktopBrokenReferenceUiV3SelfTestProposalSession(storage: DesktopProjectProposalSessionStorage): Promise<Readonly<{
  status: "PASS";
  key: string;
  cleared: true;
  projectContentWrite: false;
}>> {
  return clearTerminalDesktopProjectProposalSessionInScope(storage, DESKTOP_BROKEN_REFERENCE_UI_SELF_TEST_V3_PROJECT_ID, DESKTOP_BROKEN_REFERENCE_UI_SELF_TEST_V3_SCOPE);
}

export function clearTerminalDesktopBrokenReferenceUiV4SelfTestProposalSession(storage: DesktopProjectProposalSessionStorage): Promise<Readonly<{
  status: "PASS";
  key: string;
  cleared: true;
  projectContentWrite: false;
}>> {
  return clearTerminalDesktopProjectProposalSessionInScope(storage, DESKTOP_BROKEN_REFERENCE_UI_SELF_TEST_V4_PROJECT_ID, DESKTOP_BROKEN_REFERENCE_UI_SELF_TEST_V4_SCOPE);
}

export function inspectDesktopProjectProposalSession(session: DesktopProjectProposalSession): Readonly<{
  projectId: string;
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

function replaceHistory(session: DesktopProjectProposalSession, history: ProposalBatchHistory): Promise<DesktopProjectProposalSession> {
  return validateDesktopProjectProposalSession({ ...session, history });
}

export async function approveDesktopProjectProposalSession(session: DesktopProjectProposalSession, actor: ProposalBatchActor, currentBase: ProposalBatchInput["base"], observedAt: string): Promise<DesktopProjectProposalSession> {
  return replaceHistory(session, await approveProposalBatch(session.history, session.batch, actor, currentBase, observedAt));
}

export async function beginDesktopProjectProposalSessionApply(session: DesktopProjectProposalSession, actor: ProposalBatchActor, currentBase: ProposalBatchInput["base"], observedAt: string): Promise<DesktopProjectProposalSession> {
  return replaceHistory(session, await beginProposalApply(session.history, session.batch, actor, currentBase, observedAt));
}

export async function commitDesktopProjectProposalSessionAfterReread(session: DesktopProjectProposalSession, actor: ProposalBatchActor, reread: ProposalBatchReread, observedAt: string): Promise<DesktopProjectProposalSession> {
  return replaceHistory(session, await commitProposalAfterReread(session.history, session.batch, actor, reread, observedAt));
}

export async function undoDesktopProjectProposalSession(session: DesktopProjectProposalSession, actor: ProposalBatchActor, reread: ProposalBatchReread, observedAt: string): Promise<DesktopProjectProposalSession> {
  return replaceHistory(session, await undoProposalBatch(session.history, session.batch, actor, reread, observedAt));
}

export async function rejectDesktopProjectProposalSession(session: DesktopProjectProposalSession, actor: ProposalBatchActor, observedAt: string): Promise<DesktopProjectProposalSession> {
  return replaceHistory(session, await rejectProposalBatch(session.history, session.batch, actor, observedAt));
}

export async function cancelDesktopProjectProposalSession(session: DesktopProjectProposalSession, actor: ProposalBatchActor, observedAt: string): Promise<DesktopProjectProposalSession> {
  return replaceHistory(session, await cancelProposalBatch(session.history, session.batch, actor, observedAt));
}

export async function invalidateStaleDesktopProjectProposalSession(session: DesktopProjectProposalSession, actor: ProposalBatchActor, observedAt: string): Promise<DesktopProjectProposalSession> {
  return replaceHistory(session, await invalidateStaleProposalBatch(session.history, session.batch, actor, observedAt));
}

export async function editDesktopProjectProposalSession(session: DesktopProjectProposalSession, actor: ProposalBatchActor, commands: ProposalBatchInput["commands"], observedAt: string, risk?: ProposalBatchInput["risk"]): Promise<DesktopProjectProposalSession> {
  const edited = await editProposalBatch({ history: session.history, batch: session.batch, actor, observedAt, commands, ...(risk === undefined ? {} : { risk }) });
  return validateDesktopProjectProposalSession({ ...session, batch: edited.batch, history: edited.history });
}

export async function markDesktopProjectProposalOutcomeUnknown(session: DesktopProjectProposalSession, actor: ProposalBatchActor, observedAt: string): Promise<DesktopProjectProposalSession> {
  return replaceHistory(session, await markProposalOutcomeUnknown(session.history, session.batch, actor, observedAt));
}

export async function recoverDesktopProjectProposalSession(session: DesktopProjectProposalSession, actor: ProposalBatchActor, reread: ProposalBatchReread, observedAt: string): Promise<DesktopProjectProposalSession> {
  return replaceHistory(session, await recoverProposalAfterReread(session.history, session.batch, actor, reread, observedAt));
}

export function desktopProjectProposalRecoveryView(session: DesktopProjectProposalSession): Readonly<{
  outcomeUnknown: boolean;
  authoritativeRereadRequired: boolean;
  retryAllowed: boolean;
  latestRereadStatus: ProposalBatchReread["status"] | null;
}> {
  const latestReread = [...session.history.receipts].reverse().find((receipt) => receipt.reread !== null)?.reread ?? null;
  const outcomeUnknown = session.history.status === "unknown-outcome";
  return { outcomeUnknown, authoritativeRereadRequired: outcomeUnknown, retryAllowed: !outcomeUnknown, latestRereadStatus: latestReread?.status ?? null };
}
