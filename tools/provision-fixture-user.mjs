import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import { dirname, join, parse, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createFixtureSupervisor, defaultFixtureSupervisorConfig } from "./foundry-fixture-supervisor.mjs";
import { createPreflightReport } from "./foundry-preflight.mjs";
import { inspectFoundryLaunch } from "./foundry-server.mjs";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const TARGET = Object.freeze({
  dataPath: resolve(repoRoot, "work", "foundry-fixture-data-v3"),
  worldId: "dbx-test-world",
  port: 30002,
  userName: "Codex Fixture GM",
  role: 4,
  roleName: "GAMEMASTER",
});

function targetReceipt(dataPath = TARGET.dataPath, worldId = TARGET.worldId, port = TARGET.port) {
  return Object.freeze({
    dataPath: typeof dataPath === "string" ? resolve(dataPath) : null,
    worldId: typeof worldId === "string" ? worldId : null,
    port: Number.isInteger(port) ? port : Number(port) || null,
    userName: TARGET.userName,
    role: TARGET.role,
    roleName: TARGET.roleName,
  });
}

function blocked(blockers, target, extra = {}) {
  return Object.freeze({
    receiptVersion: 1,
    receiptId: `dbx:receipt:fixture-user-preflight-${randomUUID()}`,
    operation: "foundry.fixture.user.preflight",
    status: "BLOCKED",
    evidenceClass: "blocked",
    readyClaim: false,
    mutationPerformed: false,
    noCredentialsEntered: true,
    noSecretRecorded: true,
    noRawLevelDbAccess: true,
    noWorldDocumentMutation: true,
    noBalladAccess: true,
    worldDocumentWrites: 0,
    balladTouched: false,
    target,
    blockers: Object.freeze([...blockers]),
    ...extra,
  });
}

function pathWithin(parent, child) {
  const comparison = relative(resolve(parent), resolve(child));
  return comparison === "" || (!comparison.startsWith("..") && !parse(comparison).root);
}

function inspectExistingUsers(existingUsers) {
  if (!Array.isArray(existingUsers)) {
    return { users: null, blockers: ["An authoritative read-only User collection observation is required before provisioning."] };
  }
  const blockers = [];
  const users = [];
  const allowedKeys = new Set(["id", "name", "role"]);
  for (const user of existingUsers) {
    if (!user || typeof user !== "object" || Array.isArray(user)) {
      blockers.push("The User observation contains an untyped record; no mutation is permitted.");
      continue;
    }
    if (Object.keys(user).some((key) => !allowedKeys.has(key))) {
      blockers.push("The User observation contains fields outside the id/name/role allowlist; credential and runtime fields are rejected.");
      continue;
    }
    if (typeof user.id !== "string" || !user.id || typeof user.name !== "string" || !user.name.trim() || !Number.isInteger(user.role) || user.role < 0 || user.role > 4) {
      blockers.push("The User observation contains an incomplete or invalid id/name/role record; do not guess or repair it.");
      continue;
    }
    users.push({ id: user.id, name: user.name.trim(), role: user.role });
  }
  return { users, blockers };
}

function checkTarget(input, target) {
  const blockers = [];
  if (!target.dataPath) blockers.push("An explicit disposable v3 dataPath is required.");
  if (target.dataPath && target.dataPath.toLowerCase() !== TARGET.dataPath.toLowerCase()) blockers.push("Only the exact repository-owned work/foundry-fixture-data-v3 target is allowed.");
  if (target.dataPath && parse(target.dataPath).root === target.dataPath) blockers.push("A filesystem root cannot be used as the fixture dataPath.");
  if (target.worldId !== TARGET.worldId) blockers.push("Only dbx-test-world is allowed for fixture-user provisioning.");
  if (target.port !== TARGET.port) blockers.push("Only port 30002 is allowed for fixture-user provisioning.");
  const normalDataPath = process.env.LOCALAPPDATA ? resolve(process.env.LOCALAPPDATA, "FoundryVTT", "Data") : null;
  if (normalDataPath && target.dataPath?.toLowerCase() === normalDataPath.toLowerCase()) blockers.push("The normal local Foundry data path is forbidden.");
  if (target.dataPath && pathWithin(target.dataPath, resolve(repoRoot, "work", "foundry-fixture-data-v3", "..", ".."))) blockers.push("The fixture target may not contain the repository parent or normal campaign data.");
  if (typeof input.userName !== "undefined" && input.userName !== TARGET.userName) blockers.push("Only the approved synthetic fixture username is allowed.");
  if (typeof input.role !== "undefined" && input.role !== TARGET.role) blockers.push("Only the Foundry Gamemaster role is allowed.");
  if (typeof input.roleName !== "undefined" && input.roleName !== TARGET.roleName) blockers.push("Only the Foundry GAMEMASTER role label is allowed.");
  return blockers;
}

function checkPayload(payload) {
  if (typeof payload === "undefined") return ["The exact typed User payload is required before a native setup operation may be considered."];
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) return ["The requested User payload must be a plain object."];
  const allowed = new Set(["name", "role"]);
  const unexpected = Object.keys(payload).filter((key) => !allowed.has(key));
  if (unexpected.length) return ["The User payload contains fields outside the exact name/role allowlist; secrets and runtime fields are rejected."];
  if (payload.name !== TARGET.userName || payload.role !== TARGET.role) return ["The User payload must exactly name Codex Fixture GM with role 4 (Gamemaster)."];
  return [];
}

function checkRuntime(runtimeStatus) {
  if (!runtimeStatus || typeof runtimeStatus !== "object") return ["A fresh supervisor status reread is required before provisioning."];
  const blockers = [];
  if (runtimeStatus.status !== "STOPPED") blockers.push("Provisioning requires the exact v3 supervisor to be STOPPED.");
  if (!Array.isArray(runtimeStatus.listeners) || runtimeStatus.listeners.length) blockers.push("Provisioning requires a fresh no-listener observation on the exact v3 port.");
  if (runtimeStatus.worldDocumentWrites !== 0) blockers.push("A nonzero worldDocumentWrites receipt blocks provisioning.");
  if (runtimeStatus.balladTouched !== false) blockers.push("A proof of no Ballad access is required before fixture provisioning.");
  return blockers;
}

function manifestPreflightIsDeterministicallyReady(manifestPreflight) {
  if (!manifestPreflight || manifestPreflight.noWrite !== true || !Array.isArray(manifestPreflight.checks)) return false;
  const deterministicChecks = manifestPreflight.checks.filter((check) => check?.id !== "live-runtime-probe");
  return deterministicChecks.length > 0 && deterministicChecks.every((check) => check?.status === "PASS");
}

async function readWorldManifest(dataPath, worldId) {
  const path = join(dataPath, "Data", "worlds", worldId, "world.json");
  try {
    const manifest = JSON.parse(await readFile(path, "utf8"));
    return { path, manifest };
  } catch {
    return { path, manifest: null };
  }
}

/**
 * Prepare one exact native Foundry User-management operation without writing
 * any User collection, LevelDB file, world document, or secret. The returned
 * PASS means the later native setup surface may be used once; it is not a
 * claim that a User was created.
 */
export async function provisionFixtureUser(input = {}) {
  const target = targetReceipt(input.dataPath, input.worldId, input.port);
  const blockers = [
    ...checkTarget(input, target),
    ...checkPayload(input.payload),
    ...checkRuntime(input.runtimeStatus),
  ];
  if (["password", "secret", "credentials", "passwordSalt"].some((key) => Object.prototype.hasOwnProperty.call(input, key))) blockers.push("Credential or secret material is not accepted by this preflight and must never enter source or receipts.");
  if (input.authority?.route !== "/setup" || input.authority?.surface !== "foundry-native-setup-ui") blockers.push("Only the exact native Foundry setup/admin surface is an allowed authority boundary.");
  if (input.authority?.mutation !== "not-executed") blockers.push("This helper is a preflight only and cannot execute a User mutation.");
  if (input.launchGuard?.status !== "PASS" || input.launchGuard?.noDefaultDataPath !== true || input.launchGuard?.checks?.configLock !== "PASS" || input.launchGuard?.observedWorld?.id !== TARGET.worldId) blockers.push("The exact repository launch guard did not prove the stopped v3 target and clear configuration lock.");
  if (!manifestPreflightIsDeterministicallyReady(input.manifestPreflight)) blockers.push("The deterministic Foundry manifest preflight did not prove the exact no-write target.");

  const userObservation = inspectExistingUsers(input.existingUsers);
  const users = userObservation.users;
  blockers.push(...userObservation.blockers);
  const matching = users?.filter((user) => user.name === TARGET.userName) ?? [];
  if (matching.some((user) => user.role !== TARGET.role)) blockers.push("A conflicting existing User identity is preserved as a blocker; no overwrite or rename is permitted.");
  if (matching.length > 1) blockers.push("Duplicate matching User identities are ambiguous; no mutation is permitted.");

  if (!target.dataPath || !existsSync(target.dataPath)) blockers.push("The exact v3 fixture dataPath must exist before provisioning.");
  const world = target.dataPath ? await readWorldManifest(target.dataPath, target.worldId) : { path: null, manifest: null };
  if (!world.manifest) blockers.push("The exact v3 world manifest could not be read.");
  else if (world.manifest.id !== TARGET.worldId) blockers.push("The exact v3 world manifest identity does not match dbx-test-world.");
  const balladWorld = target.dataPath ? join(target.dataPath, "Data", "worlds", "the-ballad-of-chauser-bill") : null;
  if (balladWorld && existsSync(balladWorld)) blockers.push("A Ballad world is present beneath the target; provisioning refuses to proceed.");

  if (blockers.length) return blocked(blockers, target, { worldManifestPath: world.path, existingUserCount: users?.length ?? null });

  if (matching.length === 1) {
    return Object.freeze({
      receiptVersion: 1,
      receiptId: `dbx:receipt:fixture-user-preflight-${randomUUID()}`,
      operation: "foundry.fixture.user.preflight",
      status: "PASS",
      evidenceClass: "deterministic",
      readyClaim: false,
      mutationPerformed: false,
      outcome: "exact-match",
      noCredentialsEntered: true,
      noSecretRecorded: true,
      noRawLevelDbAccess: true,
      noWorldDocumentMutation: true,
      noBalladAccess: true,
      worldDocumentWrites: 0,
      balladTouched: false,
      target,
      existingUser: Object.freeze({ id: matching[0].id, name: TARGET.userName, role: TARGET.role, roleName: TARGET.roleName }),
      preservedUserCount: users.length,
      nextAction: "Authoritatively reread the exact native User record and final stopped/filesystem state; no User mutation is needed.",
      blockers: Object.freeze([]),
    });
  }

  return Object.freeze({
    receiptVersion: 1,
    receiptId: `dbx:receipt:fixture-user-preflight-${randomUUID()}`,
    operation: "foundry.fixture.user.preflight",
    status: "PASS",
    evidenceClass: "deterministic",
    readyClaim: false,
    mutationPerformed: false,
    outcome: "native-setup-required",
    noCredentialsEntered: true,
    noSecretRecorded: true,
    noRawLevelDbAccess: true,
    noWorldDocumentMutation: true,
    noBalladAccess: true,
    worldDocumentWrites: 0,
    balladTouched: false,
    target,
    requestedUser: Object.freeze({ name: TARGET.userName, role: TARGET.role, roleName: TARGET.roleName }),
    preservedUserCount: users.length,
    nextAction: "Use only the exact native Foundry User Management surface to create this one User, then reread identity and role. Do not write LevelDB directly.",
    blockers: Object.freeze([]),
  });
}

async function main() {
  const config = defaultFixtureSupervisorConfig({
    DICEBOX_FIXTURE_DATA_PATH: TARGET.dataPath,
    DICEBOX_FIXTURE_WORLD_ID: TARGET.worldId,
    DICEBOX_FIXTURE_PORT: String(TARGET.port),
  });
  const launchGuard = inspectFoundryLaunch({
    dataPath: config.dataPath,
    worldId: config.worldId,
    foundryEntry: config.foundryEntry,
    nodePath: config.nodePath,
    port: config.port,
  });
  const manifestPreflight = createPreflightReport({ dataPath: config.dataPath, worldId: config.worldId });
  const runtimeStatus = await createFixtureSupervisor(config).status();
  const payload = { name: TARGET.userName, role: TARGET.role };
  const existingUsersRaw = process.env.DICEBOX_FIXTURE_USER_EXISTING_USERS_JSON;
  let existingUsers = null;
  if (existingUsersRaw) {
    try {
      existingUsers = JSON.parse(existingUsersRaw);
    } catch {
      existingUsers = { invalidObservation: true };
    }
  }
  const receipt = await provisionFixtureUser({
    dataPath: config.dataPath,
    worldId: config.worldId,
    port: config.port,
    runtimeStatus,
    launchGuard,
    manifestPreflight,
    authority: { route: "/setup", surface: "foundry-native-setup-ui", mutation: "not-executed" },
    existingUsers,
    payload,
  });
  const receiptPath = process.env.DICEBOX_FIXTURE_USER_RECEIPT_PATH
    ? resolve(process.env.DICEBOX_FIXTURE_USER_RECEIPT_PATH)
    : null;
  if (receiptPath) {
    if (!pathWithin(repoRoot, receiptPath)) throw new Error("The fixture-user receipt path must remain inside the repository.");
    await mkdir(dirname(receiptPath), { recursive: true });
    await writeFile(receiptPath, JSON.stringify(receipt, null, 2) + "\n", "utf8");
  }
  console.log(JSON.stringify(receipt, null, 2));
  if (receipt.status !== "PASS") process.exitCode = 2;
}

const invokedPath = process.argv[1] ? resolve(process.argv[1]) : null;
if (invokedPath === fileURLToPath(import.meta.url)) main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

export { TARGET };
