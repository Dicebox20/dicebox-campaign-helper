import { describe, expect, it } from "vitest";
import { describeDchLocalBridgeTransport } from "../apps/campaign-helper-desktop/src/dch-foundry-transport";

const baseline = {
  operation: "dch.desktop.foundry.local-bridge-transport",
  status: "BLOCKED_AUTHENTICATED_RUNTIME_NOT_PROVEN",
  endpoint: "127.0.0.1:8797",
  authenticatedGmVerified: false,
  worldVerified: false,
  moduleRuntimeVerified: false,
  noFoundryWrite: true,
} as const;

describe("DCH local MCP desktop status is transport-only", () => {
  it("does not certify a GM from an open TCP port", () => {
    const value = describeDchLocalBridgeTransport({
      ...baseline, transport: "DEFAULT_PORT_REACHABLE_UNVERIFIED",
    });
    expect(value).toContain("TCP");
    expect(value).toContain("NOT VERIFIED");
    expect(value).toContain("no Foundry write");
  });

  it("does not declare an installed module missing when only the default port is closed", () => {
    const value = describeDchLocalBridgeTransport({
      ...baseline, transport: "DEFAULT_PORT_NOT_REACHABLE",
    });
    expect(value).toContain("Default local MCP port is not reachable");
    expect(value).toContain("NOT VERIFIED");
  });

  it("rejects a forged GM-verified claim", () => {
    const value = describeDchLocalBridgeTransport({
      ...baseline, transport: "DEFAULT_PORT_REACHABLE_UNVERIFIED",
      authenticatedGmVerified: true,
    });
    expect(value).toContain("Unrecognized diagnostic");
    expect(value).not.toContain("responds to TCP");
  });

  it("rejects unrecognized endpoints or world attestation", () => {
    const reports = [
      { ...baseline, transport: "DEFAULT_PORT_REACHABLE_UNVERIFIED", endpoint: "0.0.0.0:8797" },
      { ...baseline, transport: "DEFAULT_PORT_REACHABLE_UNVERIFIED", worldVerified: true },
      { ...baseline, transport: "DEFAULT_PORT_REACHABLE_UNVERIFIED", moduleRuntimeVerified: true },
      { ...baseline, transport: "DEFAULT_PORT_REACHABLE_UNVERIFIED", noFoundryWrite: false },
    ];
    for (const report of reports) {
      expect(describeDchLocalBridgeTransport(report)).toContain("Unrecognized diagnostic");
    }
  });

  it("fails closed on missing or malformed native receipt", () => {
    for (const value of [null, undefined, "", {}, { status: "PASS" }]) {
      expect(describeDchLocalBridgeTransport(value)).toContain("unverified");
    }
  });
});