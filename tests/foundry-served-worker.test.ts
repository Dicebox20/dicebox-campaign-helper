import { describe, expect, it } from "vitest";
import { readFile } from "node:fs/promises";
import { auditServedWorker, readCanonicalWorkerExpectation } from "../tools/audit-foundry-served-worker.mjs";

describe("served worker parity audit", () => {
  it("uses the current canonical receipt and reports source/canonical parity", async () => {
    const source = await readFile("packages/dicebox-foundry/src/foundry-live-bridge.js");
    const result = await auditServedWorker({
      observedAt: "2026-08-27T14:30:00.000Z",
      fetchImpl: async () => new Response(source, { status: 200, headers: { "content-type": "text/javascript" } }),
    });
    expect(result.status).toBe("PASS");
    expect(result.served.sourceServedParity).toBe(true);
    expect(result.served.canonicalParity).toBe(true);
    expect(result.noWrite).toBe(true);
    expect(result.readyClaim).toBe(false);
    expect(result.blockers).toEqual([]);
  });

  it("supports an exact v4 target without weakening the v3 default guard", async () => {
    const source = await readFile("packages/dicebox-foundry/src/foundry-live-bridge.js");
    const result = await auditServedWorker({
      baseUrl: "http://127.0.0.1:30003",
      target: {
        dataRoot: "work/foundry-fixture-data-v4",
        worldId: "dbx-test-world",
        foundryVersion: "14.367",
        systemId: "dnd5e",
        systemVersion: "5.3.3",
        port: 30003,
      },
      observedAt: "2026-08-27T14:30:15.000Z",
      fetchImpl: async (url, init) => {
        expect(url).toBe("http://127.0.0.1:30003/modules/dicebox-campaign-helper/src/foundry-live-bridge.js");
        expect(init).toMatchObject({ method: "GET", redirect: "manual" });
        return new Response(source, { status: 200, headers: { "content-type": "text/javascript" } });
      },
    });
    expect(result.status).toBe("PASS");
    expect(result.target).toMatchObject({ dataRoot: "work/foundry-fixture-data-v4", port: 30003 });
    expect(result.request.requestCount).toBe(1);
  });

  it("preserves the historical Iggwilv canonical drift when explicitly selected", async () => {
    const source = await readFile("packages/dicebox-foundry/src/foundry-live-bridge.js");
    const result = await auditServedWorker({
      specPath: "outputs/m249-foundry-artifact-spec-receipt.json",
      observedAt: "2026-08-27T14:30:30.000Z",
      fetchImpl: async () => new Response(source, { status: 200, headers: { "content-type": "text/javascript" } }),
    });
    expect(result.status).toBe("BLOCKED");
    expect(result.served.sourceServedParity).toBe(true);
    expect(result.served.canonicalParity).toBe(false);
    expect(result.canonical.sha256).toBe("460F79B11EA457EC9EFC3DCBE2C8D2C534516054D8247944F26096245DF5CF35");
  });

  it("fails closed on a non-200 response without treating it as served parity", async () => {
    const result = await auditServedWorker({
      observedAt: "2026-08-27T14:31:00.000Z",
      fetchImpl: async () => new Response("join", { status: 302, headers: { location: "/join" } }),
    });
    expect(result.status).toBe("BLOCKED");
    expect(result.served.status).toBe(302);
    expect(result.served.sha256).not.toBeNull();
    expect(result.served.sourceServedParity).toBe(false);
    expect(result.blockers.some((value) => value.includes("HTTP 302"))).toBe(true);
  });

  it("rejects a base URL outside the exact disposable runtime", async () => {
    await expect(auditServedWorker({ baseUrl: "http://127.0.0.1:30001", fetchImpl: async () => new Response() }))
      .rejects.toThrow("restricted");
    await expect(readCanonicalWorkerExpectation()).resolves.toMatchObject({
      sha256: "2B4F79997CAB9C963C7F3826BFD2BAF2B3DEC256F630970A8D7CDD983743AA87",
    });
  });
});
