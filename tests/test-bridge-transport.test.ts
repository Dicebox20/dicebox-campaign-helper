import { describe, expect, it } from "vitest";
import {
  bridgeTransportResponseSchema,
  createFixedOperationBridge,
  createFixedOperationJsonLinesTransport,
  FIXED_TEST_WORLD_ID,
} from "@dicebox/bridge";
import { createStableDiceBoxId } from "@dicebox/core";

const observedAt = "2026-08-21T06:30:00.000Z";

function runtime() {
  return {
    phase: "ready" as const,
    foundryVersion: "14.367",
    systemId: "dnd5e",
    systemVersion: "5.3.3",
    observedAt,
    activeModuleIds: ["dicebox-campaign-helper"],
    documentTypes: ["JournalEntry"],
    capabilities: [
      { id: "foundry.document.write" as const, state: "available" as const, reason: "fixture" },
      { id: "foundry.document.read" as const, state: "available" as const, reason: "fixture" },
      { id: "foundry.users.active-gm" as const, state: "available" as const, reason: "fixture" },
    ],
  };
}

function statusLine(requestKey: string) {
  return JSON.stringify({
    schemaVersion: "0.1.0",
    requestId: createStableDiceBoxId("request", requestKey),
    worldId: FIXED_TEST_WORLD_ID,
    operation: "status",
  });
}

describe("fixed-operation JSON-lines transport", () => {
  it("wraps a valid fixed operation in a versioned response envelope", async () => {
    const transport = createFixedOperationJsonLinesTransport(
      createFixedOperationBridge({ runtime: runtime() }),
    );

    const response = bridgeTransportResponseSchema.parse(JSON.parse(await transport.handleLine(statusLine("transport-status"))));

    expect(response.ok).toBe(true);
    if (response.ok) {
      expect(response.value.operation).toBe("status");
      expect(response.value.payload).toMatchObject({ readOnly: true, mutationEnabled: false });
    }
  });

  it("returns redacted transport errors for malformed JSON and blank lines", async () => {
    const transport = createFixedOperationJsonLinesTransport(
      createFixedOperationBridge({ runtime: runtime() }),
    );

    const malformed = bridgeTransportResponseSchema.parse(JSON.parse(await transport.handleLine("{not-json")));
    const blank = bridgeTransportResponseSchema.parse(JSON.parse(await transport.handleLine("   ")));

    expect(malformed.ok).toBe(false);
    expect(blank.ok).toBe(false);
    if (!malformed.ok && !blank.ok) {
      expect(malformed.error.code).toBe("INVALID_INPUT");
      expect(blank.error.code).toBe("INVALID_INPUT");
      expect(malformed.error.message).not.toContain("SyntaxError");
    }
  });

  it("rejects embedded delimiters and oversized lines before dispatch", async () => {
    let dispatched = false;
    const bridge = createFixedOperationBridge({ runtime: runtime() });
    const originalHandle = bridge.handle;
    bridge.handle = async (input) => {
      dispatched = true;
      return originalHandle(input);
    };
    const transport = createFixedOperationJsonLinesTransport(bridge, { maxLineBytes: 1024 });

    const delimiter = bridgeTransportResponseSchema.parse(JSON.parse(await transport.handleLine(`${statusLine("delimiter")}\nignored`)));
    const oversized = bridgeTransportResponseSchema.parse(JSON.parse(await transport.handleLine("x".repeat(1025))));

    expect(delimiter.ok).toBe(false);
    expect(oversized.ok).toBe(false);
    expect(dispatched).toBe(false);
  });

  it("preserves dispatcher failures without inventing a successful response", async () => {
    const transport = createFixedOperationJsonLinesTransport(
      createFixedOperationBridge({ runtime: runtime() }),
    );
    const wrongWorld = JSON.stringify({
      schemaVersion: "0.1.0",
      requestId: createStableDiceBoxId("request", "wrong-world-transport"),
      worldId: "production-world",
      operation: "status",
    });

    const response = bridgeTransportResponseSchema.parse(JSON.parse(await transport.handleLine(wrongWorld)));

    expect(response.ok).toBe(false);
    if (!response.ok) expect(response.error.code).toBe("INVALID_INPUT");
  });

  it("converts an unexpected handler failure into an outcome-unknown response", async () => {
    const bridge = createFixedOperationBridge({
      runtime: runtime(),
      handlers: {
        selectFixture: async () => {
          throw new Error("fixture transport failed");
        },
      },
    });
    const transport = createFixedOperationJsonLinesTransport(bridge);
    const request = JSON.stringify({
      schemaVersion: "0.1.0",
      requestId: createStableDiceBoxId("request", "handler-failure"),
      worldId: FIXED_TEST_WORLD_ID,
      operation: "fixture.select",
      fixtureId: createStableDiceBoxId("fixture", "journal"),
      idempotencyKey: createStableDiceBoxId("idempotency", "handler-failure"),
    });

    const response = bridgeTransportResponseSchema.parse(JSON.parse(await transport.handleLine(request)));

    expect(response.ok).toBe(false);
    if (!response.ok) {
      expect(response.error.code).toBe("UNKNOWN_OUTCOME");
      expect(response.error.retry).toBe("after-reread");
    }
  });

  it("handles synchronous and asynchronous line sources one request at a time", async () => {
    const transport = createFixedOperationJsonLinesTransport(
      createFixedOperationBridge({ runtime: runtime() }),
    );

    const syncResponses = [];
    for await (const line of transport.handleLines([statusLine("sync-1"), statusLine("sync-2")])) {
      syncResponses.push(bridgeTransportResponseSchema.parse(JSON.parse(line)));
    }

    async function* lines() {
      yield statusLine("async-1");
      yield statusLine("async-2");
    }
    const asyncResponses = [];
    for await (const line of transport.handleLines(lines())) {
      asyncResponses.push(bridgeTransportResponseSchema.parse(JSON.parse(line)));
    }

    expect(syncResponses).toHaveLength(2);
    expect(asyncResponses).toHaveLength(2);
    expect(syncResponses.every((response) => response.ok)).toBe(true);
    expect(asyncResponses.every((response) => response.ok)).toBe(true);
  });

  it("rejects unsafe transport limits at construction", () => {
    expect(() => createFixedOperationJsonLinesTransport(
      createFixedOperationBridge({ runtime: runtime() }),
      { maxLineBytes: 512 },
    )).toThrow(/maxLineBytes/);
  });
});
