import { describe, expect, it } from "vitest";
import { resolve } from "node:path";
import { provisionFixtureUser, TARGET } from "../tools/provision-fixture-user.mjs";

const fixtureRoot = resolve(process.cwd(), "work", "foundry-fixture-data-v3");
const stopped = Object.freeze({ status: "STOPPED", listeners: [], worldDocumentWrites: 0, balladTouched: false });
const guard = Object.freeze({
  status: "PASS",
  noDefaultDataPath: true,
  checks: { dataPath: "PASS", worldManifest: "PASS", configLock: "PASS" },
  observedWorld: { id: TARGET.worldId },
});
const manifestPreflight = Object.freeze({
  status: "BLOCKED",
  noWrite: true,
  checks: [
    { id: "world-manifest", status: "PASS" },
    { id: "world-id", status: "PASS" },
    { id: "live-runtime-probe", status: "NOT_TESTED" },
  ],
});
const authority = Object.freeze({ route: "/setup", surface: "foundry-native-setup-ui", mutation: "not-executed" });

describe("collision-safe isolated fixture-user provisioning preflight", () => {
  it("returns a native-setup plan for the exact target and preserves existing users", async () => {
    const result = await provisionFixtureUser({
      dataPath: fixtureRoot,
      worldId: TARGET.worldId,
      port: TARGET.port,
      runtimeStatus: stopped,
      launchGuard: guard,
      manifestPreflight,
      authority,
      existingUsers: [{ id: "existing-gm", name: "Gamemaster", role: 4 }],
      payload: { name: TARGET.userName, role: TARGET.role },
    });
    expect(result).toMatchObject({
      status: "PASS",
      outcome: "native-setup-required",
      mutationPerformed: false,
      readyClaim: false,
      noCredentialsEntered: true,
      noSecretRecorded: true,
      noRawLevelDbAccess: true,
      noWorldDocumentMutation: true,
      noBalladAccess: true,
      worldDocumentWrites: 0,
      balladTouched: false,
      preservedUserCount: 1,
    });
  });

  it("is idempotent for an exact existing GM and never asks for a secret", async () => {
    const result = await provisionFixtureUser({
      dataPath: fixtureRoot,
      worldId: TARGET.worldId,
      port: TARGET.port,
      runtimeStatus: stopped,
      launchGuard: guard,
      manifestPreflight,
      authority,
      existingUsers: [{ id: "fixture-gm", name: TARGET.userName, role: TARGET.role }],
      payload: { name: TARGET.userName, role: TARGET.role },
    });
    expect(result).toMatchObject({ status: "PASS", outcome: "exact-match", mutationPerformed: false, readyClaim: false });
  });

  it("blocks wrong targets, conflicting identities, live owners, and untyped payloads", async () => {
    const wrongTarget = await provisionFixtureUser({
      dataPath: resolve(process.cwd(), "work", "foundry-fixture-data-v2"),
      worldId: TARGET.worldId,
      port: TARGET.port,
      runtimeStatus: stopped,
      existingUsers: [],
      payload: { name: TARGET.userName, role: TARGET.role, password: "redacted" },
    });
    expect(wrongTarget.status).toBe("BLOCKED");
    expect(wrongTarget.mutationPerformed).toBe(false);

    const conflict = await provisionFixtureUser({
      dataPath: fixtureRoot,
      worldId: TARGET.worldId,
      port: TARGET.port,
      runtimeStatus: stopped,
      launchGuard: guard,
      manifestPreflight,
      authority,
      existingUsers: [{ id: "conflict", name: TARGET.userName, role: 3 }],
      payload: { name: TARGET.userName, role: TARGET.role },
    });
    expect(conflict.status).toBe("BLOCKED");
    expect(conflict.blockers.some((value: string) => value.includes("conflicting existing User"))).toBe(true);

    const live = await provisionFixtureUser({
      dataPath: fixtureRoot,
      worldId: TARGET.worldId,
      port: TARGET.port,
      runtimeStatus: { status: "PASS", listeners: [1234], worldDocumentWrites: 0, balladTouched: false },
      launchGuard: guard,
      manifestPreflight,
      authority,
      existingUsers: [],
      payload: { name: TARGET.userName, role: TARGET.role },
    });
    expect(live.status).toBe("BLOCKED");
    expect(live.blockers.some((value: string) => value.includes("no-listener"))).toBe(true);
  });

  it("rejects malformed or credential-bearing User observations without echoing them", async () => {
    const result = await provisionFixtureUser({
      dataPath: fixtureRoot,
      worldId: TARGET.worldId,
      port: TARGET.port,
      runtimeStatus: stopped,
      launchGuard: guard,
      manifestPreflight,
      authority,
      existingUsers: [{ id: "existing-gm", name: "Gamemaster", role: 4, password: "fixture-secret" }, { id: "bad", name: "", role: 4 }],
      payload: { name: TARGET.userName, role: TARGET.role },
    });
    const serialized = JSON.stringify(result);
    expect(result.status).toBe("BLOCKED");
    expect(serialized).toContain("credential and runtime fields are rejected");
    expect(serialized).not.toContain("fixture-secret");
  });
});
