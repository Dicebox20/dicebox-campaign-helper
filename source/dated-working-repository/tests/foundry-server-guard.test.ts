import { mkdir, mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { buildFoundryNodeLaunch, inspectFoundryLaunch } from "../tools/foundry-server.mjs";

async function fixture() {
  const root = await mkdtemp(join(tmpdir(), "dbx-foundry-launch-"));
  const worldId = "dbx-test-world";
  await mkdir(join(root, "Data", "worlds", worldId), { recursive: true });
  await writeFile(join(root, "Data", "worlds", worldId, "world.json"), JSON.stringify({
    id: worldId,
    title: "DiceBox Test World",
    coreVersion: "14.365",
    system: "dnd5e",
    systemVersion: "5.3.3",
  }));
  const entry = join(root, "main.mjs");
  await writeFile(entry, "export {};\n");
  return { root, worldId, entry };
}

describe("Foundry server launch guard", () => {
  it("requires an explicit non-default disposable path", () => {
    const report = inspectFoundryLaunch();
    expect(report.status).toBe("BLOCKED");
    expect(report.noDefaultDataPath).toBe(true);
    expect(report.blockers.join(" ")).toContain("explicit disposable dataPath");
  });

  it("validates the world identity and constructs unambiguous Node arguments", async () => {
    const testFixture = await fixture();
    const report = inspectFoundryLaunch({
      dataPath: testFixture.root,
      worldId: testFixture.worldId,
      foundryEntry: testFixture.entry,
      port: 3011,
    });
    expect(report.status).toBe("PASS");
    expect(report.observedWorld).toMatchObject({ id: "dbx-test-world", coreVersion: "14.365", system: "dnd5e" });
    const launch = buildFoundryNodeLaunch({
      dataPath: testFixture.root,
      worldId: testFixture.worldId,
      foundryEntry: testFixture.entry,
      port: 3011,
    });
    expect(launch.args).toEqual([
      testFixture.entry,
      `--dataPath=${testFixture.root}`,
      "--world=dbx-test-world",
      "--port=3011",
    ]);
  });

  it("adds an optional fixture-local administrator argument without changing the base target", async () => {
    const testFixture = await fixture();
    const launch = buildFoundryNodeLaunch({
      dataPath: testFixture.root,
      worldId: testFixture.worldId,
      foundryEntry: testFixture.entry,
      port: 3011,
      adminPassword: "fixture-secret",
    });
    expect(launch.args.at(-1)).toBe("--adminPassword=fixture-secret");
    expect(launch.adminPasswordConfigured).toBe(true);
  });

  it("constructs a setup-only launch without a world argument", async () => {
    const testFixture = await fixture();
    const report = inspectFoundryLaunch({
      dataPath: testFixture.root,
      worldId: testFixture.worldId,
      foundryEntry: testFixture.entry,
      port: 3011,
      setupOnly: true,
    });
    expect(report.status).toBe("PASS");
    expect(report.setupOnly).toBe(true);
    expect(report.checks.worldManifest).toBe("NOT_APPLICABLE");
    const launch = buildFoundryNodeLaunch({
      dataPath: testFixture.root,
      worldId: testFixture.worldId,
      foundryEntry: testFixture.entry,
      port: 3011,
      setupOnly: true,
    });
    expect(launch.args).toEqual([
      testFixture.entry,
      `--dataPath=${testFixture.root}`,
      "--port=3011",
    ]);
  });

  it("rejects a mismatched world manifest before launch", async () => {
    const testFixture = await fixture();
    await writeFile(join(testFixture.root, "Data", "worlds", testFixture.worldId, "world.json"), JSON.stringify({ id: "other-world" }));
    const report = inspectFoundryLaunch({
      dataPath: testFixture.root,
      worldId: testFixture.worldId,
      foundryEntry: testFixture.entry,
      port: 3011,
    });
    expect(report.status).toBe("BLOCKED");
    expect(report.blockers.join(" ")).toContain("identity does not match");
  });

  it("fails closed when Foundry's configuration lock is present", async () => {
    const testFixture = await fixture();
    await mkdir(join(testFixture.root, "Config", "options.json.lock"), { recursive: true });
    const report = inspectFoundryLaunch({
      dataPath: testFixture.root,
      worldId: testFixture.worldId,
      foundryEntry: testFixture.entry,
      port: 3011,
    });
    expect(report.status).toBe("BLOCKED");
    expect(report.checks.configLock).toBe("BLOCKED");
    expect(report.blockers.join(" ")).toContain("options.json.lock");
    expect(report.blockers.join(" ")).toContain("quarantine");
  });
});
