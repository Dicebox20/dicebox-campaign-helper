import { describe, expect, it } from "vitest";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

describe("read-only Foundry fixture preflight", () => {
  it("classifies compatible manifests while keeping the live probe untested", async () => {
    const { createPreflightReport } = await import("../tools/foundry-preflight.mjs");
    const root = await mkdtemp(join(tmpdir(), "dbx-foundry-preflight-"));
    try {
      const data = join(root, "Data");
      await mkdir(join(data, "worlds", "dbx-test-world"), { recursive: true });
      await mkdir(join(data, "systems", "dnd5e"), { recursive: true });
      await mkdir(join(data, "modules", "dicebox-campaign-helper"), { recursive: true });
      await mkdir(join(data, "modules", "midi-qol"), { recursive: true });
      await mkdir(join(data, "modules", "dae"), { recursive: true });
      await writeFile(join(data, "worlds", "dbx-test-world", "world.json"), JSON.stringify({
        id: "dbx-test-world",
        coreVersion: "14.367",
        system: "dnd5e",
        systemVersion: "5.3.3",
      }));
      await writeFile(join(data, "systems", "dnd5e", "system.json"), JSON.stringify({ id: "dnd5e", version: "5.3.3" }));
      await writeFile(join(data, "modules", "dicebox-campaign-helper", "module.json"), JSON.stringify({ id: "dicebox-campaign-helper", version: "0.1.0" }));
      await writeFile(join(data, "modules", "midi-qol", "module.json"), JSON.stringify({ id: "midi-qol", version: "14.0.11" }));
      await writeFile(join(data, "modules", "dae", "module.json"), JSON.stringify({ id: "dae", version: "14.0.13" }));

      const report = createPreflightReport({ dataPath: root, worldId: "dbx-test-world" });
      expect(report.status).toBe("BLOCKED");
      expect(report.noWrite).toBe(true);
      expect(report.observed).toMatchObject({
        worldCoreVersion: "14.367",
        worldSystem: "dnd5e",
        worldSystemVersion: "5.3.3",
        installedSystemVersion: "5.3.3",
        diceboxModuleVersion: "0.1.0",
        midiQolVersion: "14.0.11",
        daeVersion: "14.0.13",
      });
      expect(report.checks.find((entry: { id: string }) => entry.id === "foundry-target")?.status).toBe("PASS");
      expect(report.checks.find((entry: { id: string }) => entry.id === "live-runtime-probe")?.status).toBe("NOT_TESTED");
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  });

  it("records a 14.365 world as a target mismatch without changing it", async () => {
    const { createPreflightReport } = await import("../tools/foundry-preflight.mjs");
    const root = await mkdtemp(join(tmpdir(), "dbx-foundry-preflight-"));
    try {
      const data = join(root, "Data");
      await mkdir(join(data, "worlds", "regionwright-testmap"), { recursive: true });
      await mkdir(join(data, "systems", "dnd5e"), { recursive: true });
      await writeFile(join(data, "worlds", "regionwright-testmap", "world.json"), JSON.stringify({
        id: "regionwright-testmap",
        coreVersion: "14.365",
        system: "dnd5e",
        systemVersion: "5.3.3",
      }));
      await writeFile(join(data, "systems", "dnd5e", "system.json"), JSON.stringify({ id: "dnd5e", version: "5.3.3" }));

      const report = createPreflightReport({ dataPath: root, worldId: "regionwright-testmap" });
      expect(report.status).toBe("BLOCKED");
      expect(report.observed.worldCoreVersion).toBe("14.365");
      expect(report.checks.find((entry: { id: string }) => entry.id === "foundry-target")?.status).toBe("BLOCKED");
      expect(report.notes[0]).toContain("read-only");
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  });
});
