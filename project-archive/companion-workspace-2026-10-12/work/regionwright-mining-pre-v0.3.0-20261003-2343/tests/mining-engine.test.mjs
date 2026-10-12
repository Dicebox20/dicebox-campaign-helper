import assert from "node:assert/strict";
import {
  DEFAULT_MAX_ATTEMPTS,
  TIMING_STAGE_CYCLES_MS,
  TIMING_RING_BASE_DIAMETER_PX,
  TIMING_RING_MIN_SCALE,
  createMiningDepositConfig,
  normalizeMiningDepositConfig,
  normalizeTimingScores,
  scoreTimingDiameter,
  scoreTimingRatio,
  timingLabelForScore,
  timingRingDiameterForRatio,
  yieldForAthletics,
  yieldForTimingScores
} from "../mining-engine.js";

// Legacy API remains stable.
assert.equal(yieldForAthletics(1), 0);
assert.equal(yieldForAthletics(9), 0);
assert.equal(yieldForAthletics(10), 1);
assert.equal(yieldForAthletics(14), 1);
assert.equal(yieldForAthletics(15), 2);
assert.equal(yieldForAthletics(19), 2);
assert.equal(yieldForAthletics(20), 3);
assert.equal(yieldForAthletics(24), 3);
assert.equal(yieldForAthletics(25), 4);
assert.equal(yieldForAthletics(29), 4);
assert.equal(yieldForAthletics(30), 5);
assert.equal(yieldForAthletics(99), 5);
assert.equal(yieldForAthletics("bad"), 0);

assert.deepEqual(TIMING_STAGE_CYCLES_MS, [1500, 1350, 1200]);
assert.equal(TIMING_RING_BASE_DIAMETER_PX, 250);
assert.equal(TIMING_RING_MIN_SCALE, 0.08);
assert.equal(timingRingDiameterForRatio(0), 20);
assert.equal(timingRingDiameterForRatio(1), 250);
assert.equal(timingRingDiameterForRatio(Number.NaN), 250);
assert.equal(Number(timingRingDiameterForRatio(0.025).toFixed(2)), 25.75);
assert.equal(scoreTimingDiameter(20), 5);
assert.equal(scoreTimingDiameter(26), 5);
assert.equal(scoreTimingDiameter(26.01), 4);
assert.equal(scoreTimingDiameter(62), 4);
assert.equal(scoreTimingDiameter(62.01), 3);
assert.equal(scoreTimingDiameter(103), 3);
assert.equal(scoreTimingDiameter(103.01), 2);
assert.equal(scoreTimingDiameter(149), 2);
assert.equal(scoreTimingDiameter(149.01), 1);
assert.equal(scoreTimingDiameter(200), 1);
assert.equal(scoreTimingDiameter(200.01), 0);
assert.equal(scoreTimingDiameter(Number.NaN), 0);
assert.equal(scoreTimingRatio(0), 5);
assert.equal(scoreTimingRatio(0.5), 2);
assert.equal(scoreTimingRatio(1), 0);
assert.equal(scoreTimingRatio(Number.NaN), 0);
assert.equal(timingLabelForScore(5), "Perfect");
assert.equal(timingLabelForScore(0), "Miss");
assert.deepEqual(normalizeTimingScores([5, 3, 4]), [5, 3, 4]);
assert.equal(normalizeTimingScores([5, 3]), null);
assert.equal(normalizeTimingScores([5, 3, 9]), null);
assert.equal(normalizeTimingScores([5, 3, 4.5]), null);
assert.equal(yieldForTimingScores([5, 5, 5]), 5);
assert.equal(yieldForTimingScores([5, 3, 4]), 4);
assert.equal(yieldForTimingScores([5, 0, 5]), 3);
assert.equal(yieldForTimingScores([1, 1, 0]), 1);
assert.equal(yieldForTimingScores([0, 0, 0]), 0);
assert.equal(yieldForTimingScores([5, 5]), 0);

const fresh = createMiningDepositConfig({ oreId: "iron-ore" });
assert.equal(fresh.maxAttempts, DEFAULT_MAX_ATTEMPTS);
assert.equal(fresh.attemptsUsed, 0);
assert.equal(fresh.depleted, false);

const last = createMiningDepositConfig({ oreId: "iron-ore", attemptsUsed: 5 });
assert.equal(last.attemptsUsed, 5);
assert.equal(last.depleted, true);

const clamped = normalizeMiningDepositConfig({ oreId: "gold-ore", maxAttempts: 5, attemptsUsed: 99 });
assert.equal(clamped.attemptsUsed, 5);
assert.equal(clamped.depleted, true);

import { ORE_ORDER, getOre, createOreItemSource } from "../catalog.js";

assert.deepEqual(ORE_ORDER, [
  "iron-ore", "copper-ore", "silver-ore", "gold-ore", "mithral-ore", "adamantine-ore"
]);
assert.equal(getOre("iron-ore").price.value, 1);
assert.equal(getOre("iron-ore").price.denomination, "sp");
assert.equal(getOre("adamantine-ore").price.value, 50);
assert.equal(getOre("adamantine-ore").price.denomination, "gp");
const stack = createOreItemSource("gold-ore", 3);
assert.equal(stack.type, "loot");
assert.equal(stack.system.quantity, 3);
assert.equal(stack.system.weight.value, 1);
assert.equal(stack.flags["regionwright-mining"].ore.oreId, "gold-ore");
assert.equal(stack.flags["regionwright-mining"].ore.tier, "rare");

console.log("regionwright-mining pure tests: PASS");
