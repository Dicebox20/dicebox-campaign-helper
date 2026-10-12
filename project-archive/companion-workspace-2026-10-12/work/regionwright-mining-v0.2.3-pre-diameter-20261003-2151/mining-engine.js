export const MODULE_ID = "regionwright-mining";
export const MINING_REGION_FLAG = "miningDeposit";
export const MINING_ORE_FLAG = "ore";
export const MINING_PICKAXE_FLAG = "pickaxe";
export const MINING_SOCKET = `module.${MODULE_ID}`;
export const DEFAULT_MAX_ATTEMPTS = 5;

// Legacy Athletics resolver retained for public-API compatibility. The default
// gameplay resolver is the three-strike timing puzzle below.
export const YIELD_BANDS = Object.freeze([
  Object.freeze({ min: 30, yield: 5 }),
  Object.freeze({ min: 25, yield: 4 }),
  Object.freeze({ min: 20, yield: 3 }),
  Object.freeze({ min: 15, yield: 2 }),
  Object.freeze({ min: 10, yield: 1 }),
  Object.freeze({ min: -Infinity, yield: 0 })
]);

export function yieldForAthletics(total) {
  const value = Number(total);
  if (!Number.isFinite(value)) return 0;
  return YIELD_BANDS.find(band => value >= band.min)?.yield ?? 0;
}

export const TIMING_STAGE_CYCLES_MS = Object.freeze([1500, 1350, 1200]);
export const TIMING_SCORE_BANDS = Object.freeze([
  Object.freeze({ maxRatio: 0.025, score: 5, label: "Perfect" }),
  Object.freeze({ maxRatio: 0.18, score: 4, label: "Excellent" }),
  Object.freeze({ maxRatio: 0.36, score: 3, label: "Great" }),
  Object.freeze({ maxRatio: 0.56, score: 2, label: "Good" }),
  Object.freeze({ maxRatio: 0.78, score: 1, label: "Glancing" }),
  Object.freeze({ maxRatio: Infinity, score: 0, label: "Miss" })
]);

export function scoreTimingRatio(ratio) {
  const value = Number(ratio);
  if (!Number.isFinite(value)) return 0;
  const normalized = Math.max(0, Math.min(1, value));
  return TIMING_SCORE_BANDS.find(band => normalized <= band.maxRatio)?.score ?? 0;
}

export function timingLabelForScore(score) {
  const value = Math.max(0, Math.min(5, Math.trunc(Number(score) || 0)));
  return TIMING_SCORE_BANDS.find(band => band.score === value)?.label ?? "Miss";
}

export function normalizeTimingScores(scores) {
  if (!Array.isArray(scores) || scores.length !== TIMING_STAGE_CYCLES_MS.length) return null;
  const normalized = scores.map(value => Number(value));
  if (normalized.some(value => !Number.isInteger(value) || value < 0 || value > 5)) return null;
  return Object.freeze(normalized);
}

export function yieldForTimingScores(scores) {
  const normalized = normalizeTimingScores(scores);
  if (!normalized) return 0;
  const average = normalized.reduce((sum, value) => sum + value, 0) / normalized.length;
  return Math.max(0, Math.min(5, Math.round(average)));
}

export function normalizeAttempts(value, maxAttempts = DEFAULT_MAX_ATTEMPTS) {
  const max = Math.max(1, Math.trunc(Number(maxAttempts) || DEFAULT_MAX_ATTEMPTS));
  return Math.max(0, Math.min(max, Math.trunc(Number(value) || 0)));
}

export function createMiningDepositConfig({ oreId, maxAttempts = DEFAULT_MAX_ATTEMPTS, attemptsUsed = 0 } = {}) {
  if (!oreId) throw new Error("A mining deposit requires an oreId.");
  const max = Math.max(1, Math.trunc(Number(maxAttempts) || DEFAULT_MAX_ATTEMPTS));
  const used = normalizeAttempts(attemptsUsed, max);
  return Object.freeze({
    version: 1,
    oreId: String(oreId),
    maxAttempts: max,
    attemptsUsed: used,
    depleted: used >= max
  });
}

export function normalizeMiningDepositConfig(raw) {
  if (!raw || typeof raw !== "object" || !raw.oreId) return null;
  return createMiningDepositConfig(raw);
}
