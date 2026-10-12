import assert from "node:assert/strict";
import {
  DEFAULT_MAX_ATTEMPTS,
  createMiningDepositConfig,
  normalizeMiningDepositConfig,
  yieldForAthletics
} from "../mining-engine.js";

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
