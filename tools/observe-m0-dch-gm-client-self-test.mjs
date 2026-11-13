import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";
import { test } from "node:test";

const source = readFileSync(join(dirname(fileURLToPath(import.meta.url)), "observe-m0-dch-gm-client.js"), "utf8");

function fixture() {
  const user = {
    id: "fixture-gm-1", name: "Disposable GM", role: 4,
    isGM: true, isSelf: true, isActiveGM: true, active: true,
  };
  return {
    ready: true,
    view: "game",
    world: { id: "dbx-test-world" },
    system: { id: "dnd5e", version: "5.3.3" },
    version: "14.367",
    user,
    users: { activeGM: { ...user }, contents: [user, {
      id: "fixture-player-2", name: "Disposable Player", role: 1,
      credential: "never-report-this",
    }] },
    modules: new Map([["dicebox-campaign-helper", {
      id: "dicebox-campaign-helper", version: "0.1.15", active: true,
    }]]),
  };
}

function observe(game) {
  const logs = [];
  const context = {
    game, console: { info(...args) { logs.push(args); } },
    fetch() { throw new Error("Unexpected network access"); },
  };
  const observation = vm.runInNewContext(source, context, { timeout: 700 });
  assert.equal(logs.length, 1);
  assert.equal(logs[0][0], "DCH M0 browser observation:");
  assert.deepEqual(JSON.parse(logs[0][1]), JSON.parse(JSON.stringify(observation)));
  return observation;
}

test("exact elected GM + world + module returns a client-only observation with no authority promotion", () => {
  const result = observe(fixture());
  assert.equal(result.status, "OBSERVED_CLIENT_ONLY");
  assert.equal(result.target.exactWorldId, "dbx-test-world");
  assert.equal(result.currentUser.role, 4);
  assert.equal(result.electedActiveGm.sameAsCurrentUser, true);
  assert.equal(result.dchModule.active, true);
  assert.equal(result.existingUsers.length, 2);
  assert.deepEqual(Object.keys(result.existingUsers[1]).sort(), ["id", "name", "role"]);
  assert.equal(JSON.stringify(result).includes("never-report-this"), false);
  assert.equal(result.noFoundryWrite, true);
  assert.equal(result.networkRequests, 0);
  assert.equal(result.independentlyAuthenticatedHostCaller, false);
  assert.equal(result.authenticatedChatGptCaller, false);
  assert.equal(result.loadedModuleByteHashVerified, false);
  assert.equal(result.m0Acceptance, "NOT_ACCEPTED");
});

const denied = [
  ["no game object", (g) => null, "AUTHENTICATED_GAME_VIEW_NOT_READY"],
  ["game not ready", (g) => ({ ...g, ready: false }), "AUTHENTICATED_GAME_VIEW_NOT_READY"],
  ["setup view", (g) => ({ ...g, view: "setup" }), "AUTHENTICATED_GAME_VIEW_NOT_READY"],
  ["wrong world", (g) => ({ ...g, world: { id: "unrelated-world" } }), "EXACT_DISPOSABLE_WORLD_NOT_OBSERVED"],
  ["wrong system", (g) => ({ ...g, system: { id: "pf2e", version: "5.3.3" } }), "PINNED_FOUNDRY_SYSTEM_NOT_OBSERVED"],
  ["wrong dnd5e version", (g) => ({ ...g, system: { id: "dnd5e", version: "5.4.0" } }), "PINNED_FOUNDRY_SYSTEM_NOT_OBSERVED"],
  ["wrong Foundry major", (g) => ({ ...g, version: "13.0" }), "PINNED_FOUNDRY_SYSTEM_NOT_OBSERVED"],
  ["player self claim", (g) => ({ ...g, user: { ...g.user, role: 1, isGM: false, isActiveGM: false } }), "CURRENT_CLIENT_IS_NOT_ACTIVE_ELECTED_GM"],
  ["assistant GM only", (g) => ({ ...g, user: { ...g.user, role: 3 } }), "CURRENT_CLIENT_IS_NOT_ACTIVE_ELECTED_GM"],
  ["missing current user name", (g) => ({ ...g, user: { ...g.user, name: null } }), "CURRENT_CLIENT_IS_NOT_ACTIVE_ELECTED_GM"],
  ["missing elected GM name", (g) => ({ ...g, users: { ...g.users, activeGM: { ...g.user, name: null } } }), "ELECTED_ACTIVE_GM_MISMATCH"],
  ["not current client", (g) => ({ ...g, user: { ...g.user, isSelf: false } }), "CURRENT_CLIENT_IS_NOT_ACTIVE_ELECTED_GM"],
  ["inactive user", (g) => ({ ...g, user: { ...g.user, active: false } }), "CURRENT_CLIENT_IS_NOT_ACTIVE_ELECTED_GM"],
  ["not elected GM", (g) => ({ ...g, user: { ...g.user, isActiveGM: false } }), "CURRENT_CLIENT_IS_NOT_ACTIVE_ELECTED_GM"],
  ["active GM mismatch", (g) => ({ ...g, users: { ...g.users, activeGM: { ...g.user, id: "other-gm" } } }), "ELECTED_ACTIVE_GM_MISMATCH"],
  ["no active GM", (g) => ({ ...g, users: { ...g.users, activeGM: null } }), "ELECTED_ACTIVE_GM_MISMATCH"],
  ["module inactive", (g) => ({ ...g, modules: new Map([["dicebox-campaign-helper", { id: "dicebox-campaign-helper", version: "0.1.15", active: false }]]) }), "DCH_MODULE_VERSION_OR_ACTIVE_STATUS_UNVERIFIED"],
  ["wrong DCH module version", (g) => ({ ...g, modules: new Map([["dicebox-campaign-helper", { id: "dicebox-campaign-helper", version: "0.1.14", active: true }]]) }), "DCH_MODULE_VERSION_OR_ACTIVE_STATUS_UNVERIFIED"],
  ["missing user collection", (g) => ({ ...g, users: { ...g.users, contents: null } }), "AUTHORITATIVE_USER_COLLECTION_NOT_READABLE"],
  ["wrong user record", (g) => ({ ...g, users: { ...g.users, contents: [{ id: g.user.id, name: g.user.name, role: -1 }] } }), "AUTHORITATIVE_USER_COLLECTION_NOT_READABLE"],
  ["missing current user from collection", (g) => ({ ...g, users: { ...g.users, contents: [{ id: "unrelated", name: "Other", role: 4 }] } }), "AUTHORITATIVE_USER_COLLECTION_NOT_READABLE"],
];
for (const [name, mutator, expected] of denied) {
  test("fail closed: " + name, () => {
    const result = observe(mutator(fixture()));
    assert.equal(result.status, "BLOCKED");
    assert.equal(result.reason, expected);
    assert.equal(result.existingUsers, undefined);
    assert.equal(result.m0Acceptance, "NOT_ACCEPTED");
    assert.equal(result.authenticatedChatGptCaller, false);
    assert.equal(result.noFoundryWrite, true);
  });
}

test("user collection bounded at 50 entries to prevent unbounded name export", () => {
  const g = fixture();
  g.users.contents = Array.from({ length: 51 }, (_, i) => ({
    id: "fixture-" + i, name: "Test " + i, role: 1,
  }));
  const result = observe(g);
  assert.equal(result.status, "BLOCKED");
  assert.equal(result.reason, "AUTHORITATIVE_USER_COLLECTION_NOT_READABLE");
});

test("no world, user, module or collection object is mutated by observer", () => {
  const game = fixture();
  const original = JSON.stringify({
    world: game.world, user: game.user, users: game.users,
    module: game.modules.get("dicebox-campaign-helper"),
  });
  observe(game);
  assert.equal(JSON.stringify({
    world: game.world, user: game.user, users: game.users,
    module: game.modules.get("dicebox-campaign-helper"),
  }), original);
});

test("exceptions in uninitialized Foundry surfaces fail closed", () => {
  const game = fixture();
  Object.defineProperty(game, "user", { get() { throw new Error("not initialized"); } });
  const result = observe(game);
  assert.equal(result.status, "BLOCKED");
  assert.equal(result.reason, "LIVE_CLIENT_OBSERVATION_UNAVAILABLE");
});
