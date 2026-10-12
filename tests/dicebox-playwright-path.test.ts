import { describe, expect, it } from "vitest";
import {
  PLAYWRIGHT_CONFIG_PATH,
  checkPlaywrightPathTemplate,
  createPlaywrightLaunchPlan,
  normalizeAllowedOrigin,
  validatePlaywrightPathConfig,
} from "../tools/dicebox-playwright-path.mjs";

describe("optional Playwright Foundry browser path", () => {
  it("validates the loopback extension-mode template without starting a browser", () => {
    const report = checkPlaywrightPathTemplate();
    expect(report).toMatchObject({
      status: "PASS_LOCAL",
      valid: true,
      configPath: PLAYWRIGHT_CONFIG_PATH,
      browserMode: "existing-browser-extension",
      noAutomaticAuthentication: true,
      noModuleMutationAuthority: true,
      readyClaim: false,
      server: { host: "127.0.0.1", port: 8931 },
    });
    expect(report.allowedOrigins).toEqual(["https://replace-with-exact-sqyre-origin.example"]);
    expect(report.launchPlan.noInstallPerformed).toBe(true);
    expect(report.launchPlan.noBrowserAttached).toBe(true);
  });

  it("normalizes only exact secure origins or loopback fixture origins", () => {
    expect(normalizeAllowedOrigin("https://sqyre.example")).toBe("https://sqyre.example");
    expect(normalizeAllowedOrigin("http://127.0.0.1:30004")).toBe("http://127.0.0.1:30004");
    expect(() => normalizeAllowedOrigin("*")).toThrow(/exact origin/);
    expect(() => normalizeAllowedOrigin("http://remote.example")).toThrow(/https/);
    expect(() => normalizeAllowedOrigin("file:///C:/secret")).toThrow(/https/);
    expect(() => normalizeAllowedOrigin("https://sqyre.example/path")).toThrow(/origin-only/);
  });

  it("fails closed for public server binding and broad browser policy", () => {
    const report = validatePlaywrightPathConfig({
      extension: true,
      server: { host: "0.0.0.0", port: 8931 },
      network: { allowedOrigins: ["*"] },
      capabilities: ["core", "devtools"],
      sharedBrowserContext: true,
      allowUnrestrictedFileAccess: true,
    });
    expect(report.valid).toBe(false);
    expect(report.blockers.join(" ")).toMatch(/loopback|wildcard|core|shared|unrestricted/);
  });

  it("keeps remote browser endpoints and persistent credential paths out of the template", () => {
    const report = validatePlaywrightPathConfig({
      extension: true,
      server: { host: "127.0.0.1", port: 8931 },
      network: { allowedOrigins: ["https://sqyre.example"] },
      capabilities: ["core"],
      sharedBrowserContext: false,
      allowUnrestrictedFileAccess: false,
      browser: { cdpEndpoint: "http://127.0.0.1:9222", userDataDir: "C:/profile" },
    });
    expect(report.valid).toBe(false);
    expect(report.blockers.join(" ")).toMatch(/remote browser endpoint|persistent credential path/);
  });

  it("produces an upstream launch plan without installing or attaching anything", () => {
    expect(createPlaywrightLaunchPlan()).toEqual({
      command: "npx",
      args: ["@playwright/mcp@latest", "--config", PLAYWRIGHT_CONFIG_PATH],
      transport: "MCP HTTP",
      noInstallPerformed: true,
      noBrowserAttached: true,
      requiresAuthenticatedTunnelForRemoteChatGPT: true,
    });
  });
});

