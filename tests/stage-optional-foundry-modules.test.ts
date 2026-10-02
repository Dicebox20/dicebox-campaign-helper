import { describe, expect, it } from "vitest";
import { existsSync } from "node:fs";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { stageOptionalFoundryModules } from "../tools/stage-optional-foundry-modules.mjs";

async function makeOptionalSource(overrides: Partial<Record<"dae" | "midi-qol", string>> = {}) {
  const root = await mkdtemp(join(tmpdir(), "dbx-optional-source-"));
  for (const [id, version] of [["dae", "14.0.13"], ["midi-qol", "14.0.11"]] as const) {
    const moduleRoot = join(root, "modules", id);
    await mkdir(moduleRoot, { recursive: true });
    await writeFile(join(moduleRoot, "module.json"), JSON.stringify({ id, version: overrides[id] ?? version }));
    await writeFile(join(moduleRoot, `${id}.js`), `// ${id}`);
  }
  return root;
}

describe("collision-safe optional Foundry module staging", () => {
  it("stages only the approved packages and verifies complete inventories", async () => {
    const source = await makeOptionalSource();
    const destination = await mkdtemp(join(tmpdir(), "dbx-optional-destination-"));
    try {
      const result = await stageOptionalFoundryModules({ sourceDataPath: source, destinationDataPath: destination, observedAt: "2026-08-27T15:00:00.000Z" });
      expect(result.status).toBe("PASS");
      expect(result.packages).toHaveLength(2);
      expect(result.packages.every((pkg) => pkg.inventoryParity === true)).toBe(true);
      expect(result.worldRead).toBe(false);
      expect(result.normalDataLaunched).toBe(false);
      expect(result.readyClaim).toBe(false);
      expect(await readFile(join(destination, "modules", "dae", "dae.js"), "utf8")).toContain("dae");
      expect(await readFile(join(destination, "modules", "midi-qol", "midi-qol.js"), "utf8")).toContain("midi-qol");
    } finally {
      await Promise.all([rm(source, { recursive: true, force: true }), rm(destination, { recursive: true, force: true })]);
    }
  });

  it("refuses existing destinations and approved-version drift without overwrite", async () => {
    const source = await makeOptionalSource();
    const destination = await mkdtemp(join(tmpdir(), "dbx-optional-destination-"));
    try {
      const first = await stageOptionalFoundryModules({ sourceDataPath: source, destinationDataPath: destination });
      expect(first.status).toBe("PASS");
      const before = await readFile(join(destination, "modules", "dae", "module.json"), "utf8");
      const second = await stageOptionalFoundryModules({ sourceDataPath: source, destinationDataPath: destination });
      expect(second.status).toBe("BLOCKED");
      expect(second.blockers.some((value) => value.includes("already exists"))).toBe(true);
      expect(await readFile(join(destination, "modules", "dae", "module.json"), "utf8")).toBe(before);
    } finally {
      await Promise.all([rm(source, { recursive: true, force: true }), rm(destination, { recursive: true, force: true })]);
    }

    const mismatchedSource = await makeOptionalSource({ dae: "14.0.12" });
    const mismatchedDestination = await mkdtemp(join(tmpdir(), "dbx-optional-destination-"));
    try {
      const result = await stageOptionalFoundryModules({ sourceDataPath: mismatchedSource, destinationDataPath: mismatchedDestination });
      expect(result.status).toBe("BLOCKED");
      expect(result.blockers.some((value) => value.includes("approved dae@14.0.13"))).toBe(true);
      expect(existsSync(join(mismatchedDestination, "modules", "dae"))).toBe(false);
    } finally {
      await Promise.all([rm(mismatchedSource, { recursive: true, force: true }), rm(mismatchedDestination, { recursive: true, force: true })]);
    }
  });

  it("fails closed when source and destination Data paths overlap", async () => {
    const source = await makeOptionalSource();
    try {
      const result = await stageOptionalFoundryModules({ sourceDataPath: source, destinationDataPath: join(source, "nested") });
      expect(result.status).toBe("BLOCKED");
      expect(result.blockers).toContain("Source and destination Data paths may not overlap.");
    } finally {
      await rm(source, { recursive: true, force: true });
    }
  });
});
