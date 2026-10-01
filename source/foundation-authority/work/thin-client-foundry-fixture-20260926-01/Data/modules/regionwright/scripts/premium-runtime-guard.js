export const PREMIUM_RUNTIME_GUARD_VERSION = "1.0.0";
// Bump this value whenever the Premium runtime topology changes. It is used
// as the import cache key and is also exposed by the loaded-runtime probe.
export const PREMIUM_RUNTIME_CACHE_KEY = "rw-0.1.5-20260822-minigames-3";
export const PREMIUM_RUNTIME_FINGERPRINT = `regionwright-premium@0.1.5+${PREMIUM_RUNTIME_CACHE_KEY}`;

const STATE_KEY = Symbol.for("regionwright.premiumRuntime.v1");
const STAGES = new Set(["fixtureControls", "sockets", "registration"]);

function state(runtime = globalThis) {
  const holder = runtime ?? globalThis;
  if (holder[STATE_KEY]?.version === PREMIUM_RUNTIME_GUARD_VERSION) return holder[STATE_KEY];
  const next = { version: PREMIUM_RUNTIME_GUARD_VERSION, entryClaimed: false, companionRequested: false, stages: Object.create(null) };
  Object.defineProperty(holder, STATE_KEY, { configurable: true, enumerable: false, value: next, writable: true });
  return next;
}

export function claimPremiumEntry(runtime = globalThis) {
  const current = state(runtime);
  if (current.entryClaimed) return false;
  current.entryClaimed = true;
  return true;
}

export function requestPremiumCompanion(runtime = globalThis) {
  const current = state(runtime);
  if (current.entryClaimed || current.companionRequested) return false;
  current.companionRequested = true;
  return true;
}

export function claimPremiumStage(stage, runtime = globalThis) {
  if (!STAGES.has(stage)) throw new Error(`Unknown Regionwright premium runtime stage: ${stage}`);
  const current = state(runtime);
  if (current.stages[stage]) return false;
  current.stages[stage] = true;
  return true;
}

export function premiumRuntimeStatus(runtime = globalThis) {
  const current = state(runtime);
  return Object.freeze({ version: current.version, entryClaimed: current.entryClaimed, companionRequested: current.companionRequested, stages: Object.freeze({ ...current.stages }) });
}

export function resetPremiumRuntimeGuard(runtime = globalThis) {
  delete (runtime ?? globalThis)[STATE_KEY];
}
