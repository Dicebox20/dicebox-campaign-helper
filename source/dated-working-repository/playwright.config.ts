import { defineConfig } from "@playwright/test";

const rawUtilityHarnessUrl = process.env.UTILITY_HARNESS_URL;
const utilityHarnessUrl = rawUtilityHarnessUrl === undefined || rawUtilityHarnessUrl === ""
  ? undefined
  : new URL(rawUtilityHarnessUrl).toString();

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  workers: 1,
  retries: 0,
  timeout: 30_000,
  reporter: [["html", { open: "never", outputFolder: "playwright-report" }], ["list"]],
  use: {
    baseURL: utilityHarnessUrl,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure"
  },
  projects: [
    { name: "utility-harness" },
    { name: "accessibility" }
  ]
});
