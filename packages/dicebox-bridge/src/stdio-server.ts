import { z } from "zod";
import { FIXED_TEST_WORLD_ID } from "./test-bridge.js";
import {
  createFixedOperationJsonLinesTransport,
  type FixedOperationJsonLinesTransport,
  type FixedOperationJsonLinesTransportOptions,
} from "./test-bridge-transport.js";
import type { FixedOperationBridge } from "./test-bridge.js";

export interface FixedOperationStdioServerInput {
  readonly lines: AsyncIterable<string> | Iterable<string>;
  readonly writeLine: (line: string) => void | Promise<void>;
}

export interface FixedOperationStdioServerOptions extends FixedOperationJsonLinesTransportOptions {
  readonly bridge: FixedOperationBridge;
  readonly input: FixedOperationStdioServerInput;
}

export const stdioServerReportSchema = z.object({
  schemaVersion: z.literal("0.1.0"),
  transport: z.literal("stdio"),
  worldId: z.literal(FIXED_TEST_WORLD_ID),
  status: z.enum(["completed", "blocked", "unknown"]),
  requests: z.number().int().nonnegative(),
  responses: z.number().int().nonnegative(),
  readOnly: z.literal(true),
  mutationEnabled: z.literal(false),
  networkEnabled: z.literal(false),
  notes: z.array(z.string().min(1)).max(12),
}).strict();

export type StdioServerReport = z.infer<typeof stdioServerReportSchema>;

export interface FixedOperationStdioServer {
  readonly transport: FixedOperationJsonLinesTransport;
  readonly run: () => Promise<StdioServerReport>;
}

/**
 * Bind the fixed bridge to a caller-owned stdio stream.
 *
 * This is deliberately a stream adapter, not an MCP server or a network
 * listener. The host owns process.stdin/stdout; this function only forwards
 * bounded JSON-lines responses and never adds methods or authority.
 */
export function createFixedOperationStdioServer(
  options: FixedOperationStdioServerOptions,
): FixedOperationStdioServer {
  const transport = createFixedOperationJsonLinesTransport(options.bridge, options);

  return {
    transport,
    run: async () => {
      let requests = 0;
      let responses = 0;
      try {
        for await (const response of transport.handleLines(options.input.lines)) {
          requests += 1;
          await options.input.writeLine(`${response}\n`);
          responses += 1;
        }
        return stdioServerReportSchema.parse({
          schemaVersion: "0.1.0",
          transport: "stdio",
          worldId: FIXED_TEST_WORLD_ID,
          status: "completed",
          requests,
          responses,
          readOnly: true,
          mutationEnabled: false,
          networkEnabled: false,
          notes: ["The stdio adapter forwarded fixed JSON-lines operations only; no network or Foundry mutation surface was added."],
        });
      } catch {
        return stdioServerReportSchema.parse({
          schemaVersion: "0.1.0",
          transport: "stdio",
          worldId: FIXED_TEST_WORLD_ID,
          status: "unknown",
          requests,
          responses,
          readOnly: true,
          mutationEnabled: false,
          networkEnabled: false,
          notes: ["The stdio stream or output failed; transport outcome is unknown and must be reread before retrying."],
        });
      }
    },
  };
}
