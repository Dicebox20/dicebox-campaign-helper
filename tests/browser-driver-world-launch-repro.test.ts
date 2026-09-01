import { afterEach, describe, expect, it } from "vitest";
import { inspectWorldLaunchFixture, renderWorldLaunchFixture, startWorldLaunchFixture } from "../tools/browser-driver-world-launch-repro.mjs";

const fixtures: Array<{ close: () => Promise<void> }> = [];

afterEach(async () => {
  await Promise.all(fixtures.splice(0).map((fixture) => fixture.close()));
});

describe("browser-driver delegated worldLaunch local reproduction", () => {
  it("declares a loopback-only no-write primary-click contract", () => {
    expect(inspectWorldLaunchFixture()).toMatchObject({
      status: "PASS",
      host: "127.0.0.1",
      persistentWrite: false,
      foundryLaunch: false,
      readyClaim: false,
      contract: {
        selector: "a[data-action=worldLaunch]",
        delegated: true,
        primaryButtonOnly: true,
        navigationPrevented: true,
      },
    });
  });

  it("renders the visible enabled link and rejects non-primary dispatch", () => {
    const markup = renderWorldLaunchFixture();
    expect(markup).toContain('id="world-launch" data-action="worldLaunch"');
    expect(markup).toContain('aria-disabled="false"');
    expect(markup).toContain('if (event.button !== 0) return;');
    expect(markup).toContain('event.preventDefault();');
    expect(markup).toContain("DISPATCHED_PRIMARY_WORLD_LAUNCH");
  });

  it("serves only the ephemeral loopback fixture and its inspection receipt", async () => {
    const fixture = await startWorldLaunchFixture();
    fixtures.push(fixture);
    const page = await fetch(fixture.url);
    expect(page.status).toBe(200);
    expect(page.headers.get("cache-control")).toBe("no-store");
    expect(await page.text()).toContain("Launch World");
    const inspection = await fetch(new URL("/receipt", fixture.url));
    expect(inspection.status).toBe(200);
    await expect(inspection.json()).resolves.toMatchObject({ status: "PASS", foundryLaunch: false, persistentWrite: false });
    const rejected = await fetch(new URL("/not-authorized", fixture.url));
    expect(rejected.status).toBe(404);
  });
});
