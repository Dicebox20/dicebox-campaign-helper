import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { provisionDisposableFixture } from "../tools/provision-disposable-fixture.mjs";

async function sourceData() {
  const root = await mkdtemp(join(tmpdir(), "dbx-fixture-source-"));
  await mkdir(join(root, "systems", "dnd5e"), { recursive: true });
  await mkdir(join(root, "modules", "regionwright"), { recursive: true });
  await mkdir(join(root, "systems", "dnd5e", "packs", "fixture-pack"), { recursive: true });
  await mkdir(join(root, "worlds", "the-ballad-of-chauser-bill", "data"), { recursive: true });
  await writeFile(join(root, "systems", "dnd5e", "system.json"), JSON.stringify({ id: "dnd5e", version: "5.3.3" }));
  await writeFile(join(root, "modules", "regionwright", "module.json"), JSON.stringify({ id: "regionwright", version: "0.1.4" }));
  await writeFile(join(root, "systems", "dnd5e", "packs", "fixture-pack", "LOCK"), "runtime-only");
  await writeFile(join(root, "worlds", "the-ballad-of-chauser-bill", "data", "sentinel.txt"), "must-not-copy");
  return root;
}

describe("disposable Foundry fixture provisioning", () => {
  it("creates a fresh exact fixture without copying a source world", async () => {
    const sourceDataPath = await sourceData();
    const destinationParent = await mkdtemp(join(tmpdir(), "dbx-fixture-destination-"));
    const destinationRoot = join(destinationParent, "data");
    try {
      const report = await provisionDisposableFixture({ sourceDataPath, destinationRoot });
      expect(report.status).toBe("PASS");
      expect(report.worldId).toBe("dbx-test-world");
      expect(report.noBalladWorldAccess).toBe(true);
      expect(report.dataPath).toBe(join(destinationRoot, "Data"));
      expect(existsSync(join(destinationRoot, "Data", "worlds", "the-ballad-of-chauser-bill"))).toBe(false);
      expect(existsSync(join(destinationRoot, "Data", "modules", "dicebox-campaign-helper", "module.json"))).toBe(true);
      expect(existsSync(join(destinationRoot, "Data", "systems", "dnd5e", "packs", "fixture-pack", "LOCK"))).toBe(false);
      const world = JSON.parse(await readFile(join(destinationRoot, "Data", "worlds", "dbx-test-world", "world.json"), "utf8"));
      expect(world).toMatchObject({ id: "dbx-test-world", coreVersion: "14.367", system: "dnd5e", systemVersion: "5.3.3" });
      expect(world.flags.diceboxCampaignHelper).toMatchObject({ fixture: true, sourceWorldCopied: false, resetScope: "owned-fixture-only" });
    } finally {
      await rm(sourceDataPath, { recursive: true, force: true });
      await rm(destinationParent, { recursive: true, force: true });
    }
  });

  it("fails closed when the destination already exists or aliases source data", async () => {
    const sourceDataPath = await sourceData();
    const destinationParent = await mkdtemp(join(tmpdir(), "dbx-fixture-destination-"));
    try {
      const existing = await provisionDisposableFixture({ sourceDataPath, destinationRoot: destinationParent });
      expect(existing.status).toBe("BLOCKED");
      expect(existing.notes.join(" ")).toContain("already exists");
      const alias = await provisionDisposableFixture({ sourceDataPath, destinationRoot: sourceDataPath });
      expect(alias.status).toBe("BLOCKED");
      expect(alias.notes.join(" ")).toContain("overlap");
      const nested = await provisionDisposableFixture({ sourceDataPath, destinationRoot: join(sourceDataPath, "nested-fixture") });
      expect(nested.status).toBe("BLOCKED");
      expect(nested.notes.join(" ")).toContain("overlap");
    } finally {
      await rm(sourceDataPath, { recursive: true, force: true });
      await rm(destinationParent, { recursive: true, force: true });
    }
  });

  it("cleans a newly created destination after staging failure so retry remains possible", async () => {
    const sourceDataPath = await sourceData();
    const sourceRoot = await mkdtemp(join(tmpdir(), "dbx-fixture-module-source-"));
    const destinationParent = await mkdtemp(join(tmpdir(), "dbx-fixture-destination-"));
    const destinationRoot = join(destinationParent, "data");
    try {
      const report = await provisionDisposableFixture({ sourceDataPath, sourceRoot, destinationRoot });
      expect(report.status).toBe("UNKNOWN");
      expect(report.cleanup).toBe("created destination removed");
      expect(existsSync(destinationRoot)).toBe(false);
      const retry = await provisionDisposableFixture({ sourceDataPath, destinationRoot });
      expect(retry.status).toBe("PASS");
    } finally {
      await rm(sourceDataPath, { recursive: true, force: true });
      await rm(sourceRoot, { recursive: true, force: true });
      await rm(destinationParent, { recursive: true, force: true });
    }
  });
});
