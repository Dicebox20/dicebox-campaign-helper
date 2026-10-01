import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const repoRoot = resolve(process.cwd());
const stagedRoot = resolve(repoRoot, "work/foundry-fixture-data-v4/Data/modules/regionwright");
const externalRoot = "C:/Users/rujie/Documents/Region Editor";

function read(path: string): string {
  return readFileSync(path, "utf8");
}

function sha256(path: string): string {
  return createHash("sha256").update(read(path)).digest("hex");
}

function syntaxCheck(path: string): void {
  execFileSync(process.execPath, ["--check", path], { stdio: "pipe" });
}

describe("current Regionwright staged fixture entrypoint contract", () => {
  const stagedManifestPath = resolve(stagedRoot, "module.json");
  const stagedPremiumPath = resolve(stagedRoot, "premium/scripts/premium-module.js");
  const stagedPremiumWrapperPath = resolve(stagedRoot, "premium/scripts/premium-module-readback-rw-0.1.5-20260907-readback-1.js");
  const stagedHarnessPath = resolve(stagedRoot, "premium/scripts/ascendancy-fixture-harness.js");
  const externalPremiumPath = `${externalRoot}/premium/scripts/premium-module.js`;
  const externalPremiumWrapperPath = `${externalRoot}/premium/scripts/premium-module-readback-rw-0.1.5-20260907-readback-1.js`;
  const externalHarnessPath = `${externalRoot}/premium/scripts/ascendancy-fixture-harness.js`;

  it("binds the exact v4 manifest to the intended premium entrypoint and fixture harness", () => {
    const manifest = JSON.parse(read(stagedManifestPath)) as { id?: string; version?: string; esmodules?: string[] };
    const premium = read(stagedPremiumPath);
    const harness = read(stagedHarnessPath);

    expect(manifest).toMatchObject({ id: "regionwright", version: "0.1.5" });
    expect(manifest.esmodules).toContain("scripts/module-readback-rw-0.1.5-20260907-readback-1.js");
    expect(manifest.esmodules).toContain("premium/scripts/premium-module-readback-rw-0.1.5-20260907-readback-1.js");
    expect(manifest.esmodules).not.toContain("premium/scripts/premium-module-fixture-init-v1.js");
    expect(premium).toContain('import { ascendancyAPI, installAscendancySocket } from "./ascendancy.js";');
    expect(premium).toContain('import { ascendancyFixtureHarness, installAscendancyFixtureControls } from "./ascendancy-fixture-harness.js";');
    expect(premium).toContain("ascendancy: Object.freeze({ ...ascendancyAPI, handoff: ascendancyLiveInstaller, fixtureHarness: ascendancyFixtureHarness })");
    expect(premium).toContain('Hooks.once("init", () => {');
    expect(premium).toContain("installAscendancyFixtureControls();");
    expect(read(stagedPremiumWrapperPath)).toBe('import "./premium-module.js?rw-0.1.5-20260907-readback-1";\n');
    expect(harness).toContain("export function installAscendancyFixtureControls()");
    expect(harness).toContain("export const ascendancyFixtureHarness");
  });

  it("pins the current provenance and staged hashes without claiming byte parity", () => {
    expect(sha256(externalPremiumPath)).toBe("63e69a0735c70e763b7ecf340d5f0bf813d59255e0b66188268ebc75e3498cb3");
    expect(sha256(stagedPremiumPath)).toBe("66439c3a813ed2ebee5a20e4e67671bc0ecea5b381a24c5acd03657d155bd220");
    expect(sha256(externalPremiumWrapperPath)).toBe("3914c46dd9060d51262f034a953cf0a9178e8c632dc56384e862f37892078f83");
    expect(sha256(stagedPremiumWrapperPath)).toBe("3914c46dd9060d51262f034a953cf0a9178e8c632dc56384e862f37892078f83");
    expect(sha256(externalHarnessPath)).toBe("3360cbd1d37f5220cc5d9b35044dcc0df417e415fa3dec1566c6f498a34a3edb");
    expect(sha256(stagedHarnessPath)).toBe("b86c248da294ffdf44af4b6c4f3217498679cb28323b0c6598163290acd636c6");
    expect(sha256(stagedManifestPath)).toBe("6a80f9c009a47a87d96e979f59c36580b6ba1d48a56e9f5d8c25ae203d95c86e");

    const externalHarness = read(externalHarnessPath).replaceAll("?rw-0.1.5-20260822-minigames-3", "").replaceAll("\r\n", "\n");
    const stagedHarness = read(stagedHarnessPath).replaceAll("\r\n", "\n");
    expect(stagedHarness).toBe(externalHarness);
    expect(read(externalPremiumPath)).toContain("ascendancyBalladRuntime");
    expect(read(externalPremiumPath)).toContain("puzzleHUD");
    expect(read(externalPremiumPath)).toContain("PREMIUM_RUNTIME_FINGERPRINT");
    expect(read(stagedPremiumPath)).not.toContain("ascendancyBalladRuntime");
    expect(read(stagedPremiumPath)).not.toContain("puzzleHUD");
    expect(read(stagedPremiumPath)).not.toContain("PREMIUM_RUNTIME_FINGERPRINT");
  });

  it("passes syntax validation for external provenance and staged runtime files", () => {
    for (const path of [externalPremiumPath, stagedPremiumPath, externalHarnessPath, stagedHarnessPath]) syntaxCheck(path);
  });
});
