#!/usr/bin/env node
/**
 * Validates only the format of an owner-collected DCH Foundry client observation.
 * It never authenticates the origin, forwards private User identities or promotes M0.
 */
import { readFile, stat } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const worldId = "dbx-test-world";
const moduleId = "dicebox-campaign-helper";
const operation = "dch.m0.disposable-v3.browser-gm-self-observation";
const maxBytes = 16 * 1024;
const object = (v) => v !== null && typeof v === "object" && !Array.isArray(v);
const keys = (v, names) => object(v) &&
  Object.keys(v).every((key) => names.includes(key));
const nonempty = (v, maximum = 128) => typeof v === "string" &&
  v.trim().length > 0 && v.length <= maximum;
const allowedUser = ["id", "name", "role"];
const allowedCurrentUser = [...allowedUser, "isGM", "isSelf", "isActiveGM", "active"];

function common() {
  return {
    schemaVersion: "1.0.0",
    operation: "dch.m0.client-observation-format-validation",
    evidenceClass: "UNTRUSTED_BROWSER_CLIENT_DATA",
    authenticatedFoundryGmByHost: false,
    independentlyAuthenticatedHostCaller: false,
    authenticatedChatGptCaller: false,
    moduleLoadedByteHashVerified: false,
    worldMutation: false,
    m0Acceptance: "NOT_ACCEPTED",
    verifiedM0Criteria: 0,
  };
}
function blocked(code) {
  return Object.freeze({ ...common(), status: "BLOCKED_CLIENT_FORMAT", reason: code });
}
function validUser(u) {
  return keys(u, allowedUser) && nonempty(u.id) &&
    nonempty(u.name, 160) && Number.isInteger(u.role) &&
    u.role >= 0 && u.role <= 4;
}
function trustClaimsAreUnpromoted(v) {
  return v.noFoundryWrite === true && v.networkRequests === 0 &&
    v.independentlyAuthenticatedHostCaller === false &&
    v.authenticatedChatGptCaller === false &&
    v.loadedModuleByteHashVerified === false &&
    v.m0Acceptance === "NOT_ACCEPTED";
}

/**
 * Pure format check; does not verify origin, authenticity or browser execution.
 * IMPORTANT: returns no name, id, raw source or observedAtUtc.
 */
export function classifyClientObservation(v) {
  if (!keys(v, [
    "schemaVersion", "operation", "status", "evidenceClass",
    "observedAtUtc", "target", "currentUser", "electedActiveGm",
    "existingUsers", "dchModule", "noFoundryWrite", "networkRequests",
    "independentlyAuthenticatedHostCaller", "authenticatedChatGptCaller",
    "loadedModuleByteHashVerified", "m0Acceptance", "remainingBlockers",
    "expectedWorldId", "reason",
  ]) || v.schemaVersion !== "1.0.0" || v.operation !== operation ||
      v.evidenceClass !== "browser-client-self-observation" ||
      !trustClaimsAreUnpromoted(v)) {
    return blocked("UNRECOGNIZED_OR_PROMOTED_CLIENT_REPORT");
  }
  if (v.status === "BLOCKED") {
    if (nonempty(v.reason, 120) && v.expectedWorldId === worldId &&
      !Object.hasOwn(v, "existingUsers") && !Object.hasOwn(v, "currentUser")) {
      return Object.freeze({ ...common(), status: "CLIENT_OBSERVER_BLOCKED",
        reason: "BROWSER_DID_NOT_ESTABLISH_GM" });
    }
    return blocked("MALFORMED_BLOCKED_REPORT");
  }
  if (v.status !== "OBSERVED_CLIENT_ONLY") return blocked("UNRECOGNIZED_OBSERVATION_STATE");
  const target = v.target;
  if (!keys(target, ["exactWorldId", "foundryVersion", "systemId", "systemVersion"]) ||
      target.exactWorldId !== worldId ||
      !/^14\.\d+(?:\.\d+)?$/.test(String(target.foundryVersion ?? "")) ||
      target.systemId !== "dnd5e" || target.systemVersion !== "5.3.3") {
    return blocked("WRONG_WORLD_OR_VERSION");
  }
  if (!nonempty(v.observedAtUtc, 35) || !Number.isFinite(Date.parse(v.observedAtUtc))) {
    return blocked("MALFORMED_OBSERVATION_TIMESTAMP");
  }
  const u = v.currentUser;
  if (!keys(u, allowedCurrentUser) || !validUser({ id: u?.id, name: u?.name, role: u?.role }) ||
      u.role !== 4 || u.isGM !== true || u.isSelf !== true ||
      u.isActiveGM !== true || u.active !== true) {
    return blocked("CURRENT_USER_NOT_VALID_ELECTED_GM");
  }
  const gm = v.electedActiveGm;
  if (!keys(gm, [...allowedUser, "sameAsCurrentUser"]) ||
      !validUser({ id: gm?.id, name: gm?.name, role: gm?.role }) ||
      gm.id !== u.id || gm.role !== 4 || gm.sameAsCurrentUser !== true) {
    return blocked("ELECTED_GM_MISMATCH");
  }
  const users = v.existingUsers;
  if (!Array.isArray(users) || users.length < 1 || users.length > 50 ||
      users.some((x) => !validUser(x)) ||
      new Set(users.map((x) => x.id)).size !== users.length ||
      !users.some((x) => x.id === u.id && x.role === 4)) {
    return blocked("PRIVATE_USER_LIST_INVALID");
  }
  const mod = v.dchModule;
  if (!keys(mod, ["id", "version", "active"]) || mod.id !== moduleId ||
      mod.version !== "0.1.15" || mod.active !== true) {
    return blocked("DCH_MODULE_NOT_OBSERVED_ACTIVE");
  }
  if (!Array.isArray(v.remainingBlockers) || v.remainingBlockers.length < 1 ||
      v.remainingBlockers.length > 8 ||
      v.remainingBlockers.some((x) => !nonempty(x, 300))) {
    return blocked("MISSING_CLIENT_ONLY_LIMITATIONS");
  }
  return Object.freeze({
    ...common(),
    status: "VALID_CLIENT_FORMAT_NOT_AUTHENTICATED",
    exactWorldFormatMatch: true,
    currentAndElectedGmFieldsMatch: true,
    dchModuleActiveFormatMatch: true,
    boundedUserCollectionFormatMatch: true,
    identitiesRedacted: true,
    note: "Synthetic/forged data can pass this check. Require authenticated runtime corroboration.",
  });
}

async function main() {
  const path = process.argv[2];
  if (!path) {
    process.stdout.write(JSON.stringify(blocked("OWNER_CLIENT_REPORT_NOT_PROVIDED")) + "\n");
    process.exitCode = 2;
    return;
  }
  let report;
  try {
    const filepath = resolve(path);
    const info = await stat(filepath);
    if (!info.isFile() || info.size > maxBytes) throw Error("NOT_BOUNDED_LOCAL_JSON");
    report = JSON.parse(await readFile(filepath, "utf8"));
  } catch {
    process.stdout.write(JSON.stringify(blocked("UNREADABLE_OR_INVALID_LOCAL_JSON")) + "\n");
    process.exitCode = 2;
    return;
  }
  const classification = classifyClientObservation(report);
  process.stdout.write(JSON.stringify(classification) + "\n");
  process.exitCode = classification.status === "VALID_CLIENT_FORMAT_NOT_AUTHENTICATED" ? 0 : 2;
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch(() => {
    process.stdout.write(JSON.stringify(blocked("VALIDATION_UNAVAILABLE")) + "\n");
    process.exitCode = 2;
  });
}
