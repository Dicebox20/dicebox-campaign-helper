import { webcrypto } from "node:crypto";
import { readFile } from "node:fs/promises";
import { readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { describe, expect, it } from "vitest";

const installerPath = "work/foundry-fixture-data-v5/Data/modules/regionwright/premium/scripts/ascendancy-live-installer.js";
const sidecarPath = "work/foundry-fixture-data-v5/Data/modules/regionwright/premium/scripts/ascendancy-live-installer-byte-attestation.json";
const moduleControlPath = "work/foundry-fixture-data-v5/Data/modules/regionwright/scripts/module.js";
const manifestPath = "work/foundry-fixture-data-v5/Data/modules/regionwright/module.json";
const moduleWrapperPath = "work/foundry-fixture-data-v5/Data/modules/regionwright/scripts/module-readback-rw-0.1.5-20260907-identity-1.js";
const premiumWrapperPath = "work/foundry-fixture-data-v5/Data/modules/regionwright/premium/scripts/premium-module-readback-rw-0.1.5-20260907-identity-1.js";
const premiumModulePath = "work/foundry-fixture-data-v5/Data/modules/regionwright/premium/scripts/premium-module.js";
const installerBytes = readFileSync(installerPath);
const sidecar = JSON.parse(readFileSync(sidecarPath, "utf8")) as Record<string, unknown>;

function runtime(fetcher: (url: string) => Promise<unknown>, user: Record<string, unknown> = { id: "gm", isGM: true }) {
  return {
    game: { version: "14.367", system: { id: "dnd5e", version: "5.3.3" }, user, users: { activeGM: user }, scenes: { contents: [] } },
    crypto: webcrypto,
    fetch: fetcher,
  };
}

function responseFor(url: string, bytes: Uint8Array) {
  if (url.endsWith("ascendancy-live-installer-byte-attestation.json")) return { ok: true, status: 200, json: async () => sidecar };
  return { ok: true, status: 200, arrayBuffer: async () => bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) };
}

describe("Regionwright premium loaded identity attestation", () => {
  it("matches the executing installer URL to the pinned sidecar under the exact GM gate", async () => {
    const calls: string[] = [];
    const implementation = await import(`${pathToFileURL(installerPath).href}?m1281-success`);
    const receipt = await implementation.readLoadedIdentity({ runtime: runtime(async url => { calls.push(url); return responseFor(url, new Uint8Array(installerBytes)); }) });
    expect(receipt).toMatchObject({ operation: "regionwright.premium.loaded-identity", status: "OBSERVED", noWrite: true, apply: false, readyClaim: false, authoritativeReread: true });
    expect(receipt.loadedByte).toMatchObject({ modulePath: "premium/scripts/ascendancy-live-installer.js", expectedBytes: installerBytes.byteLength, observedBytes: installerBytes.byteLength, match: true });
    expect(calls).toHaveLength(2);
    expect(calls[0]).toContain("ascendancy-live-installer-byte-attestation.json");
    expect(calls[1]).toContain("ascendancy-live-installer.js");
  });

  it("fails closed on installer-byte drift without mutation or retry", async () => {
    const implementation = await import(`${pathToFileURL(installerPath).href}?m1281-mismatch`);
    const altered = new Uint8Array(installerBytes);
    altered[0] = (altered[0] ?? 0) ^ 1;
    const receipt = await implementation.readLoadedIdentity({ runtime: runtime(async url => responseFor(url, altered)) });
    expect(receipt).toMatchObject({ operation: "regionwright.premium.loaded-identity", status: "BLOCKED", noWrite: true, apply: false, readyClaim: false });
    expect(receipt.reason).toContain("did not match the pinned sidecar");
    expect(receipt.loadedByte).toMatchObject({ match: false, expectedBytes: installerBytes.byteLength, observedBytes: installerBytes.byteLength });
  });

  it("does not issue byte requests without the exact active-GM gate", async () => {
    const calls: string[] = [];
    const implementation = await import(`${pathToFileURL(installerPath).href}?m1281-gate`);
    const receipt = await implementation.readLoadedIdentity({ runtime: runtime(async url => { calls.push(url); return responseFor(url, new Uint8Array(installerBytes)); }, { id: "player", isGM: false }) });
    expect(receipt).toMatchObject({ status: "BLOCKED", noWrite: true, apply: false, readyClaim: false });
    expect(receipt.reason).toContain("current user must be the elected active GM");
    expect(calls).toHaveLength(0);
  });

  it("exposes only the fixed read-only identity control in the v5 Region Controls source", async () => {
    const source = await readFile(moduleControlPath, "utf8");
    expect(source).toContain('title: "Audit Regionwright premium loaded identity"');
    expect(source).toContain("loadedIdentity?.open?.()");
    expect(source).not.toContain("new Function");
  });

  it("uses one cache-consistent v5 wrapper topology for the changed main and premium entrypoints", () => {
    const manifest = JSON.parse(readFileSync(manifestPath, "utf8")) as { esmodules?: string[] };
    expect(manifest.esmodules).toEqual([
      "scripts/module-readback-rw-0.1.5-20260907-identity-1.js",
      "premium/scripts/premium-module-readback-rw-0.1.5-20260907-identity-1.js",
    ]);
    expect(readFileSync(moduleWrapperPath, "utf8")).toBe('import "./module.js?rw-0.1.5-20260907-identity-1";\n');
    expect(readFileSync(premiumWrapperPath, "utf8")).toBe('import "./premium-module.js?rw-0.1.5-20260907-identity-1";\n');
    expect(readFileSync(moduleControlPath, "utf8")).toContain('premium-runtime-guard.js?rw-0.1.5-20260907-identity-1');
    expect(readFileSync(premiumModulePath, "utf8")).toContain('ascendancy-live-installer.js?rw-0.1.5-20260907-identity-1');
    expect(readFileSync(premiumModulePath, "utf8")).toContain('premium-runtime-guard.js?rw-0.1.5-20260907-identity-1');
  });
});
