export const MODULE_ID = "regionwright-mining";
export const MINING_REGION_FLAG = "miningDeposit";
export const MINING_ORE_FLAG = "ore";
export const MINING_PICKAXE_FLAG = "pickaxe";
export const MINING_SOCKET = `module.${MODULE_ID}`;
export const DEFAULT_MAX_ATTEMPTS = 5;

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
