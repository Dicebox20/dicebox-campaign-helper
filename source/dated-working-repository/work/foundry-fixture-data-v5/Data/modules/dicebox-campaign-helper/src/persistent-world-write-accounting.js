/**
 * Fixed, package-owned accounting for the M1186 Signal/Rune proof boundary.
 *
 * This records only the native Foundry write calls made by the reviewed
 * candidate adapter while an exact, active-GM write window is open. It does
 * not inspect storage, intercept arbitrary methods, expose a caller-supplied
 * operation, or claim persistence. Persistence is a separate post-restart
 * owned-document reread.
 */

const MODULE_ID = "dicebox-campaign-helper";
const EXACT_FOUNDRY_VERSION = "14.367";
const SYSTEM_ID = "dnd5e";
const SYSTEM_VERSION = "5.3.3";
const CANDIDATE_ID = "m1141-signal-rune";
const BASE_AUTHORING_SCOPE = "m1217-four-scene-base-authoring";
const ACCOUNTING_OPERATION = "dicebox.persistent-world.native-write-accounting";
const ALLOWED_SCOPES = new Set([CANDIDATE_ID, BASE_AUTHORING_SCOPE]);

const activeWindows = new WeakMap();
const lastReceipts = new WeakMap();

function activeGm(runtime) {
  const user = runtime.game?.user;
  const elected = runtime.game?.users?.activeGM;
  return Boolean(user?.isGM && elected?.id && user.id === elected.id);
}

function exactTarget(runtime) {
  return runtime.game?.version === EXACT_FOUNDRY_VERSION
    && runtime.game?.system?.id === SYSTEM_ID
    && runtime.game?.system?.version === SYSTEM_VERSION;
}

function freezeRecord(record) {
  return Object.freeze({ ...record });
}

function snapshot(window, status = null, extra = {}) {
  const records = window.records.map(freezeRecord);
  const resolved = records.filter((record) => record.outcome === "resolved").length;
  const unknown = records.filter((record) => record.outcome === "unknown").length;
  const derivedStatus = status ?? (unknown > 0 ? "UNKNOWN" : records.length > 0 ? "OBSERVED" : "BLOCKED");
  return Object.freeze({
    receiptVersion: 1,
    operation: ACCOUNTING_OPERATION,
    status: derivedStatus,
    evidenceClass: derivedStatus === "OBSERVED" ? "fixture" : derivedStatus === "UNKNOWN" ? "unknown" : "blocked",
    candidateId: window.scope,
    scope: window.scope,
    target: Object.freeze({
      foundryVersion: runtimeVersion(window.runtime),
      systemId: window.runtime.game?.system?.id ?? null,
      systemVersion: window.runtime.game?.system?.version ?? null,
      exactTargetMatch: exactTarget(window.runtime),
      activeGm: activeGm(window.runtime),
    }),
    noWrite: true,
    observedMutation: records.length > 0,
    nativeWriteCalls: records.length,
    nativeWriteCallsResolved: resolved,
    nativeWriteCallsUnknown: unknown,
    records: Object.freeze(records),
    persistenceClaim: "not-claimed-by-write-accounting",
    readyClaim: false,
    ...extra,
  });
}

function runtimeVersion(runtime) {
  return runtime.game?.version ?? null;
}

function blocked(runtime, blockers, scope = CANDIDATE_ID) {
  const window = { runtime, scope, records: [] };
  return snapshot(window, "BLOCKED", { blockers: Object.freeze([...blockers]), observedMutation: false });
}

/** Begin only one of the package-owned, fixed write windows. */
export function beginPersistentWorldWriteAccounting(runtime = globalThis, options = {}) {
  const scope = options?.scope ?? CANDIDATE_ID;
  if (!ALLOWED_SCOPES.has(scope)) return blocked(runtime, ["The requested native-write accounting scope is not package-owned or allowlisted."], scope);
  if (!exactTarget(runtime)) return blocked(runtime, [`Foundry ${EXACT_FOUNDRY_VERSION} / ${SYSTEM_ID}@${SYSTEM_VERSION} is required.`]);
  if (!activeGm(runtime)) return blocked(runtime, ["The current user must be the elected active GM."]);
  if (activeWindows.has(runtime)) return blocked(runtime, ["A persistent-world accounting window is already active; no nested window was opened."]);
  const window = { runtime, scope, records: [], startedAt: new Date().toISOString() };
  activeWindows.set(runtime, window);
  return Object.freeze({ status: "OPEN", operation: ACCOUNTING_OPERATION, candidateId: scope, scope, exactTargetMatch: true, activeGm: true });
}

/** Record the start of one fixed adapter-owned native write call. */
export function startPersistentWorldNativeWrite(runtime = globalThis, details = {}) {
  const window = activeWindows.get(runtime);
  if (!window) return null;
  const record = {
    method: details.method,
    documentType: details.documentType,
    semanticId: details.semanticId,
    outcome: "started",
  };
  window.records.push(record);
  return record;
}

/** Mark the exact write call as resolved after its native promise completes. */
export function finishPersistentWorldNativeWrite(runtime = globalThis, record, details = {}) {
  if (!record) return;
  record.outcome = "resolved";
  if (typeof details.count === "number") record.documentCount = details.count;
}

/** Mark an outcome-unknown write call; callers must not blindly retry. */
export function failPersistentWorldNativeWrite(runtime = globalThis, record, error = null) {
  if (!record) return;
  record.outcome = "unknown";
  record.error = error instanceof Error ? error.message : typeof error === "string" ? error : "Native write outcome is unknown.";
}

/** Close the fixed accounting window and retain its redacted receipt locally. */
export function endPersistentWorldWriteAccounting(runtime = globalThis, extra = {}) {
  const window = activeWindows.get(runtime);
  if (!window) return blocked(runtime, ["No active M1186 native-write accounting window exists."]);
  activeWindows.delete(runtime);
  const receipt = snapshot(window, null, {
    startedAt: window.startedAt,
    endedAt: new Date().toISOString(),
    blockers: Object.freeze([]),
    ...extra,
  });
  lastReceipts.set(runtime, receipt);
  return receipt;
}

/** Read the last fixed receipt without creating a new write window. */
export function readPersistentWorldWriteAccounting(runtime = globalThis) {
  return lastReceipts.get(runtime) ?? blocked(runtime, ["No completed M1186 native-write accounting receipt is present in this client."]);
}

export function clearPersistentWorldWriteAccounting(runtime = globalThis) {
  activeWindows.delete(runtime);
  lastReceipts.delete(runtime);
}

export { ACCOUNTING_OPERATION, BASE_AUTHORING_SCOPE, CANDIDATE_ID };
