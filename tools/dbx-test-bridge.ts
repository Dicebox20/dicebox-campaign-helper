import { createInterface } from "node:readline";
import {
  createFixedOperationBridge,
  createFixedOperationStdioServer,
  createSafeModeRuntimeProfile,
} from "@dicebox/bridge";

/**
 * Safe local host for first-round bridge wiring.
 *
 * This launcher deliberately starts with the M0 safe-mode profile. It is a
 * process/stdio integration check, not a Foundry connector. A future exact
 * fixture host may provide reviewed runtime evidence through a separate
 * adapter; this command never discovers a world, opens a socket, or enables
 * mutation from environment variables.
 */
const input = createInterface({ input: process.stdin, crlfDelay: Infinity });
const server = createFixedOperationStdioServer({
  bridge: {
    ...createFixedOperationBridgeForSafeMode(),
  },
  input: {
    lines: input,
    writeLine: async (line) => {
      await new Promise<void>((resolve, reject) => {
        process.stdout.write(line, (error) => error ? reject(error) : resolve());
      });
    },
  },
});

try {
  const report = await server.run();
  process.stderr.write(`${JSON.stringify(report)}\n`);
  if (report.status === "unknown") process.exitCode = 2;
} catch (error) {
  process.stderr.write(`${JSON.stringify({ status: "unknown", error: "stdio bridge host failed" })}\n`);
  process.exitCode = 2;
}

function createFixedOperationBridgeForSafeMode() {
  // Kept in a function so the launcher has exactly one safe runtime profile
  // construction point and cannot accidentally accept a caller-supplied world.
  return createFixedOperationBridge({ runtime: createSafeModeRuntimeProfile() });
}
