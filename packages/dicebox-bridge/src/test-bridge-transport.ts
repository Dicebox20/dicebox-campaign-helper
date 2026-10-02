import { z } from "zod";
import {
  DiceBoxErrorSchema,
  type Result,
} from "@dicebox/core";
import {
  bridgeResponseSchema,
  type BridgeResponse,
  type FixedOperationBridge,
} from "./test-bridge.js";

/**
 * This is a framing adapter, not a server. The caller owns stdio, a reviewed
 * loopback, or another explicitly authorized transport. No method names or
 * executable code are accepted at this boundary.
 */
export const FIXED_BRIDGE_TRANSPORT_VERSION = "0.1.0" as const;
export const DEFAULT_MAX_JSON_LINE_BYTES = 64 * 1024;

export const bridgeTransportResponseSchema = z.discriminatedUnion("ok", [
  z.object({
    protocolVersion: z.literal(FIXED_BRIDGE_TRANSPORT_VERSION),
    ok: z.literal(true),
    value: bridgeResponseSchema,
  }).strict(),
  z.object({
    protocolVersion: z.literal(FIXED_BRIDGE_TRANSPORT_VERSION),
    ok: z.literal(false),
    error: DiceBoxErrorSchema,
  }).strict(),
]);

export type BridgeTransportResponse = z.infer<typeof bridgeTransportResponseSchema>;

export interface FixedOperationJsonLinesTransportOptions {
  /** Maximum UTF-8 size of one complete JSON line, including no delimiter. */
  readonly maxLineBytes?: number;
}

export interface FixedOperationJsonLinesTransport {
  readonly maxLineBytes: number;
  readonly handleLine: (line: string) => Promise<string>;
  readonly handleLines: (lines: AsyncIterable<string> | Iterable<string>) => AsyncGenerator<string>;
}

function transportFailure(
  code: "INVALID_INPUT" | "NOT_READY" | "UNKNOWN_OUTCOME",
  message: string,
): string {
  return JSON.stringify(bridgeTransportResponseSchema.parse({
    protocolVersion: FIXED_BRIDGE_TRANSPORT_VERSION,
    ok: false,
    error: { code, message, retry: code === "UNKNOWN_OUTCOME" ? "after-reread" : "never" },
  }));
}

function lineByteLength(line: string): number {
  return new TextEncoder().encode(line).byteLength;
}

function validateMaxLineBytes(value: number | undefined): number {
  const maxLineBytes = value ?? DEFAULT_MAX_JSON_LINE_BYTES;
  if (!Number.isSafeInteger(maxLineBytes) || maxLineBytes < 1024 || maxLineBytes > 1024 * 1024) {
    throw new Error("maxLineBytes must be an integer between 1024 and 1048576.");
  }
  return maxLineBytes;
}

function encodeResult(result: Result<BridgeResponse>): string {
  if (!result.ok) {
    return JSON.stringify(bridgeTransportResponseSchema.parse({
      protocolVersion: FIXED_BRIDGE_TRANSPORT_VERSION,
      ok: false,
      error: result.error,
    }));
  }
  return JSON.stringify(bridgeTransportResponseSchema.parse({
    protocolVersion: FIXED_BRIDGE_TRANSPORT_VERSION,
    ok: true,
    value: result.value,
  }));
}

export function createFixedOperationJsonLinesTransport(
  bridge: FixedOperationBridge,
  options: FixedOperationJsonLinesTransportOptions = {},
): FixedOperationJsonLinesTransport {
  const maxLineBytes = validateMaxLineBytes(options.maxLineBytes);

  const handleLine = async (line: string): Promise<string> => {
    if (typeof line !== "string" || line.includes("\n") || line.includes("\r")) {
      return transportFailure("INVALID_INPUT", "The bridge transport accepts exactly one JSON value per line.");
    }
    if (lineByteLength(line) > maxLineBytes) {
      return transportFailure("INVALID_INPUT", "The bridge request exceeded the maximum JSON line size.");
    }
    if (line.trim().length === 0) {
      return transportFailure("INVALID_INPUT", "Blank lines are not bridge requests.");
    }

    let input: unknown;
    try {
      input = JSON.parse(line) as unknown;
    } catch {
      return transportFailure("INVALID_INPUT", "The bridge request was not valid JSON.");
    }

    try {
      return encodeResult(await bridge.handle(input));
    } catch {
      return transportFailure("UNKNOWN_OUTCOME", "Bridge dispatch did not return a response; reread before retrying.");
    }
  };

  const handleLines = async function* (
    lines: AsyncIterable<string> | Iterable<string>,
  ): AsyncGenerator<string> {
    if (Symbol.asyncIterator in Object(lines)) {
      for await (const line of lines as AsyncIterable<string>) yield await handleLine(line);
      return;
    }
    for (const line of lines as Iterable<string>) yield await handleLine(line);
  };

  return { maxLineBytes, handleLine, handleLines };
}
