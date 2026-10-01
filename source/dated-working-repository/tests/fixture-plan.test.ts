import { spawnSync } from "node:child_process";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { FoundryFixturePlanSchema, createFoundryFixturePlan } from "@dicebox/core";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const cli = resolve(root, "tools/print-foundry-fixture-plan.ts");
const tsxCli = resolve(root, "node_modules/tsx/dist/cli.mjs");

describe("exact Foundry fixture plan", () => {
  it("defines the exact target, two client contexts, owned reset, and no-write seeds", () => {
    const plan = createFoundryFixturePlan();
    expect(FoundryFixturePlanSchema.parse(plan)).toMatchObject({
      operation: "foundry.fixture.plan",
      status: "blocked",
      noWrite: true,
      mutation: "disabled",
      target: {
        foundryVersion: "14.367",
        systemId: "dnd5e",
        systemVersion: "5.3.3",
        worldId: "dbx-test-world",
      },
      contexts: ["GM", "Player3"],
      resetPolicy: "owned-fixture-only",
    });
    expect(plan.seeds).toHaveLength(3);
    expect(plan.seeds.every((seed) => seed.rawPayload === false && seed.mutation === "deferred-until-exact-runtime")).toBe(true);
  });

  it("requires every observation to name a Foundry API and receipt context", () => {
    const plan = createFoundryFixturePlan();
    expect(plan.apiChecks.length).toBeGreaterThanOrEqual(10);
    expect(plan.apiChecks.every((check) => check.status === "required" && check.noWrite && check.foundryApi.length > 0)).toBe(true);
    expect(plan.apiChecks.map((check) => check.foundryApi).join(" | ")).toContain("Hooks.once(\"ready\")");
    expect(plan.apiChecks.map((check) => check.foundryApi).join(" | ")).toContain("fromUuid");
    expect(plan.apiChecks.map((check) => check.foundryApi).join(" | ")).toContain("game.users.activeGM");
    expect(plan.blockers.length).toBeGreaterThan(0);
  });

  it("prints a machine-readable blocked plan as a real process", () => {
    const result = spawnSync(process.execPath, [tsxCli, cli], {
      cwd: root,
      encoding: "utf8",
      windowsHide: true,
    });
    expect(result.error).toBeUndefined();
    expect(result.status).toBe(0);
    const plan = FoundryFixturePlanSchema.parse(JSON.parse(result.stdout));
    expect(plan).toMatchObject({ operation: "foundry.fixture.plan", status: "blocked", noWrite: true });
    expect(result.stderr).toBe("");
  });
});
