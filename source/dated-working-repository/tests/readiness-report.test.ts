import { describe, expect, it } from "vitest";
import { fileURLToPath } from "node:url";
import { createBridgeApi } from "@dicebox/bridge";
import { ReadinessReportSchema } from "@dicebox/core";

const packageRoot = fileURLToPath(new URL("../packages/dicebox-foundry/", import.meta.url));

function runtimeFixture(): any {
  return {
    Hooks: { on: () => 1, once: () => 1, callAll: () => undefined },
    game: {
      version: "14.367",
      system: { id: "dnd5e", version: "5.3.3" },
      modules: new Map(),
      documentTypes: {},
      actors: {},
      items: {},
      scenes: { contents: [], get: () => null },
      journal: { contents: [], get: () => null },
      folders: {},
      users: { getDesignatedUser: () => null },
    },
  };
}

describe("blocker-based readiness report", () => {
  it("exposes a safe-mode report through the program bridge", async () => {
    const api = createBridgeApi();
    const response = await api.query({ kind: "readiness-report" });
    expect(response.ok).toBe(true);
    if (response.ok) {
      const report = ReadinessReportSchema.parse(response.value);
      expect(report).toMatchObject({
        status: "blocked",
        evidenceClass: "static",
        source: "fixture",
        noWrite: true,
        target: { exactTargetMatch: false },
      });
      expect(report.blockers.length).toBeGreaterThan(0);
      expect(report.checks.every((check) => check.required && check.foundryApi.length > 0)).toBe(true);
    }
  });

  it("composes the Foundry probe into a deterministic but non-certifying report", async () => {
    const module = await import(`${packageRoot}/src/module.js`);
    const evidence = module.probeRuntime(runtimeFixture());
    const report = ReadinessReportSchema.parse(evidence.readinessReport);

    expect(report).toMatchObject({
      status: "blocked",
      evidenceClass: "deterministic",
      source: "foundry-ready-hook",
      noWrite: true,
      target: {
        foundryVersion: "14.367",
        systemId: "dnd5e",
        systemVersion: "5.3.3",
        exactTargetMatch: true,
      },
    });
    expect(report.checks.find((check) => check.id === "foundry-target-fingerprint")?.status).toBe("pass");
    expect(report.checks.find((check) => check.id === "exact-runtime-behavior")?.status).toBe("blocked");
    expect(report.nextGates.length).toBeGreaterThan(0);
  });

  it("routes readiness through the installed Foundry namespace without enabling mutation", async () => {
    const module = await import(`${packageRoot}/src/module.js`);
    let ready: (() => unknown) | undefined;
    const runtime = runtimeFixture();
    runtime.Hooks.once = (_name: string, callback: () => unknown) => { ready = callback; return 1; };
    module.bootstrapDiceBoxCampaignHelper(runtime);
    ready?.();

    const report = ReadinessReportSchema.parse(
      runtime.game.diceboxCampaignHelper.query({ kind: "readiness-report" }),
    );
    expect(report.status).toBe("blocked");
    expect(runtime.game.diceboxCampaignHelper.describe().mutationEnabled).toBe(false);
  });
});
