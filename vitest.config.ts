import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["tests/**/*.test.ts"],
    passWithNoTests: false,
    // The stdio/Foundry harness tests launch real child processes; allow normal
    // Windows process startup variance without changing their assertions.
    testTimeout: 15000,
  },
});
