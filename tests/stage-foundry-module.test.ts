import { describe, expect, it } from "vitest";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

describe("collision-safe Foundry module staging", () => {
  it("stages reviewed raster candidates without claiming package binding into an explicit destination", async () => {
    const { stageFoundryModule } = await import("../tools/stage-foundry-module.mjs");
    const destinationRoot = await mkdtemp(join(tmpdir(), "dbx-foundry-stage-"));
    try {
      const report = await stageFoundryModule({
        sourceRoot: process.cwd(),
        destinationRoot,
      });
      expect(report).toMatchObject({
        status: "PASS",
        operation: "foundry.module.stage",
        noWorldMutation: true,
        packageId: "dicebox-campaign-helper",
      });
      expect(report.notes[0]).toContain("Signal and Rune are scene-bound");
      expect(report.notes[0]).toContain("Tram and Core remain final-map-required");
      expect(report.files.map((file: { relativePath: string }) => file.relativePath)).toEqual([
        "module.json",
        "src/entry-20260823-program-scene-v2.js",
        "src/module.js",
        "src/ascendancy-installer.js",
        "src/foundry-live-bridge.js",
        "src/tram-calibration-installer.js",
        "src/tram-routing-fixture-installer.js",
        "src/tram-rush-hour-dialog.js",
        "src/tram-coordinate-calibration.js",
        "src/tram-access-behavior.js",
        "src/tram-access-fixture-installer.js",
        "src/program-scene-vertical-slice.js",
        "ascendancy-campaign-package.json",
        "tram-calibration-package.json",
        "tram-routing-fixture-package.json",
        "program-scene-vertical-slice-package.json",
        "assets/maps/ascendancy-tram-depot-v3.png",
        "assets/maps/ascendancy-signal-frequency-chamber-v2.png",
        "assets/maps/ascendancy-rune-mechanism-chamber-v2.png",
        "assets/maps/ascendancy-central-core-control-chamber-v2.png",
        "assets/maps/ascendancy-tram-calibration-graybox-v1.png",
        "assets/maps/ascendancy-tram-calibration-marker-v1.svg",
        "assets/maps/ascendancy-tram-depot-routing-yard-v6-neutral.png",
        "assets/tiles/ascendancy-tram-rail-grid-v2.svg",
        "assets/tiles/ascendancy-tram-rail-grid-v3.svg",
        "assets/tiles/ascendancy-tram-core-rail-v2.svg",
        "assets/tiles/ascendancy-tram-gate-v2.svg",
        "assets/tiles/ascendancy-tram-car-horizontal-v1.svg",
        "assets/tiles/ascendancy-tram-car-vertical-v1.svg",
      ]);
      const manifest = JSON.parse(await readFile(join(destinationRoot, "modules", "dicebox-campaign-helper", "module.json"), "utf8"));
      expect(manifest).toMatchObject({ id: "dicebox-campaign-helper" });
      await expect(readFile(join(destinationRoot, "modules", "dicebox-campaign-helper", "assets", "maps", "ascendancy-tram-depot-v3.png"))).resolves.toHaveLength(2835325);
      await expect(readFile(join(destinationRoot, "modules", "dicebox-campaign-helper", "assets", "tiles", "ascendancy-tram-rail-grid-v2.svg"), "utf8")).resolves.toContain("<svg");
      await expect(readFile(join(destinationRoot, "modules", "dicebox-campaign-helper", "assets", "tiles", "ascendancy-tram-rail-grid-v3.svg"), "utf8")).resolves.toContain("TO CORE");
      await expect(readFile(join(destinationRoot, "modules", "dicebox-campaign-helper", "src", "tram-rush-hour-dialog.js"), "utf8")).resolves.toContain("openTramRushHourDialog");
      await expect(readFile(join(destinationRoot, "modules", "dicebox-campaign-helper", "src", "tram-coordinate-calibration.js"), "utf8")).resolves.toContain("clientCoordinatesFromCanvas");
    } finally {
      await rm(destinationRoot, { recursive: true, force: true });
    }
  });

  it("refuses to overwrite an existing destination module", async () => {
    const { stageFoundryModule } = await import("../tools/stage-foundry-module.mjs");
    const destinationRoot = await mkdtemp(join(tmpdir(), "dbx-foundry-stage-"));
    try {
      const moduleRoot = join(destinationRoot, "modules", "dicebox-campaign-helper");
      await (await import("node:fs/promises")).mkdir(moduleRoot, { recursive: true });
      const report = await stageFoundryModule({ sourceRoot: process.cwd(), destinationRoot });
      expect(report.status).toBe("BLOCKED");
      expect(report.notes[0]).toContain("already exists");
    } finally {
      await rm(destinationRoot, { recursive: true, force: true });
    }
  });

  it("requires an explicit destination for module updates and updates an owned staged module", async () => {
    const { stageFoundryModule } = await import("../tools/stage-foundry-module.mjs");
    // @ts-expect-error The tooling helper is intentionally a checked-in ESM script without a generated declaration file.
    const { updateFoundryModule } = await import("../tools/update-foundry-module.mjs");
    await expect(updateFoundryModule({ sourceRoot: process.cwd() })).rejects.toThrow("An explicit destinationRoot is required.");
    const destinationRoot = await mkdtemp(join(tmpdir(), "dbx-foundry-update-"));
    try {
      await stageFoundryModule({ sourceRoot: process.cwd(), destinationRoot });
      const report = await updateFoundryModule({ sourceRoot: process.cwd(), destinationRoot });
      expect(report).toMatchObject({ status: "PASS", operation: "foundry.module.update", noWorldMutation: true, packageId: "dicebox-campaign-helper" });
    } finally {
      await rm(destinationRoot, { recursive: true, force: true });
    }
  });
});
