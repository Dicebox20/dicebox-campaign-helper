import { execFileSync } from "node:child_process";
import { describe, expect, it } from "vitest";

const root = new URL("..", import.meta.url).pathname.replace(/^\//, "").replaceAll("/", "\\");
const python = process.env.DICEBOX_PYTHON ?? "python";
const queryScript = `${root}database\\query_knowledge.py`;
const database = `${root}database\\dicebox_campaign_helper_knowledge.sqlite`;

function query(...args: string[]) {
  return JSON.parse(execFileSync(python, [queryScript, "--database", database, ...args], {
    encoding: "utf8",
    windowsHide: true,
  }));
}

describe("cross-project tool catalog query", () => {
  it("finds the Utility Harness/Playwright lane with provenance", () => {
    const result = query("--kind", "tools", "--term", "playwright", "--limit", "10");
    expect(result.mode).toBe("read-only");
    expect(result.rows).toEqual(expect.arrayContaining([
      expect.objectContaining({
        project_id: "dicebox",
        tool_id: "TOOL-DICEBOX-LANE-UTILITY_E2E",
        tool_kind: "harness",
        source_id: "SRC-TOOLS-CROSS-PROJECT-20260926",
      }),
    ]));
  });

  it("filters project target surfaces without executing them", () => {
    const result = query("--kind", "tools", "--project-id", "paldex", "--limit", "10");
    expect(result.rows).toEqual(expect.arrayContaining([
      expect.objectContaining({
        tool_id: "TOOL-PALDEX-NX-SERVER_PROJECT_JSON",
        tool_kind: "target",
        evidence_status: expect.stringContaining("dependency/runtime execution unavailable"),
      }),
    ]));
  });
});
