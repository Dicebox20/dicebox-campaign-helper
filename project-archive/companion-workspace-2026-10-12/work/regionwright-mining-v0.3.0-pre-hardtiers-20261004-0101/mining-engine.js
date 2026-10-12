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

export const MINING_DIFFICULTY_PROFILES = Object.freeze({
  common: Object.freeze([1500, 1350, 1200]),
  uncommon: Object.freeze([1400, 1250, 1100]),
  rare: Object.freeze([1300, 1150, 1000]),
  "very-rare": Object.freeze([1200, 1050, 900]),
  exceptional: Object.freeze([1100, 950, 825]),
  legendary: Object.freeze([1000, 875, 800]),
  "legendary-plus": Object.freeze([950, 850, 800])
});
export const TIMING_STAGE_CYCLES_MS = MINING_DIFFICULTY_PROFILES.common;
export function timingCyclesForDifficulty(value) {
  const key = String(value ?? "common").trim().toLowerCase().replaceAll(" ", "-");
  return MINING_DIFFICULTY_PROFILES[key] ?? MINING_DIFFICULTY_PROFILES.common;
}
export const TIMING_RING_BASE_DIAMETER_PX = 250;
export const TIMING_RING_MIN_SCALE = 0.08;
export const TIMING_RING_SCALE_RANGE = 1 - TIMING_RING_MIN_SCALE;
export const TIMING_SCORE_BANDS = Object.freeze([
  Object.freeze({ maxDiameterPx: 26, score: 5, label: "Perfect" }),
  Object.freeze({ maxDiameterPx: 62, score: 4, label: "Excellent" }),
  Object.freeze({ maxDiameterPx: 103, score: 3, label: "Great" }),
  Object.freeze({ maxDiameterPx: 149, score: 2, label: "Good" }),
  Object.freeze({ maxDiameterPx: 200, score: 1, label: "Glancing" }),
  Object.freeze({ maxDiameterPx: Infinity, score: 0, label: "Miss" })
]);

export function timingRingDiameterForRatio(ratio) {
  const value = Number(ratio);
  const normalized = Number.isFinite(value) ? Math.max(0, Math.min(1, value)) : 1;
  const scale = TIMING_RING_MIN_SCALE + (normalized * TIMING_RING_SCALE_RANGE);
  return TIMING_RING_BASE_DIAMETER_PX * scale;
}

export function scoreTimingDiameter(diameterPx) {
  const value = Number(diameterPx);
  if (!Number.isFinite(value)) return 0;
  const diameter = Math.max(0, value);
  return TIMING_SCORE_BANDS.find(band => diameter <= band.maxDiameterPx)?.score ?? 0;
}

// Compatibility helper: callers may still submit the normalized pulse ratio,
// but scoring is now derived from the ring diameter actually rendered by the UI.
export function scoreTimingRatio(ratio) {
  return scoreTimingDiameter(timingRingDiameterForRatio(ratio));
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
