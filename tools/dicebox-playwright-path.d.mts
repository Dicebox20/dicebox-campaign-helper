export const PLAYWRIGHT_PATH_PROTOCOL: "dicebox-playwright-browser-path/1";
export const PLAYWRIGHT_MCP_PACKAGE: "@playwright/mcp@latest";
export const PLAYWRIGHT_CONFIG_PATH: "deploy/sqyre-relay/playwright-mcp.config.example.json";
export const PLAYWRIGHT_SERVER_HOST: "127.0.0.1";
export const PLAYWRIGHT_SERVER_PORT: 8931;

export function normalizeAllowedOrigin(value: unknown): string;
export function validatePlaywrightPathConfig(config?: Record<string, unknown>): {
  protocol: string;
  status: "PASS_LOCAL" | "BLOCKED";
  valid: boolean;
  server: { host: string | null; port: number };
  allowedOrigins: readonly string[];
  browserMode: string;
  noAutomaticAuthentication: true;
  noModuleMutationAuthority: true;
  readyClaim: false;
  blockers: readonly string[];
};
export function readPlaywrightPathConfig(path?: string): Record<string, unknown>;
export function createPlaywrightLaunchPlan(options?: { configPath?: string }): {
  command: "npx";
  args: readonly ["@playwright/mcp@latest", "--config", string];
  transport: "MCP HTTP";
  noInstallPerformed: true;
  noBrowserAttached: true;
  requiresAuthenticatedTunnelForRemoteChatGPT: true;
};
export function checkPlaywrightPathTemplate(path?: string): {
  protocol: string;
  status: "PASS_LOCAL" | "BLOCKED";
  valid: boolean;
  server: { host: string | null; port: number };
  allowedOrigins: readonly string[];
  browserMode: string;
  noAutomaticAuthentication: true;
  noModuleMutationAuthority: true;
  readyClaim: false;
  blockers: readonly string[];
  configPath: string;
  launchPlan: {
    command: "npx";
    args: readonly ["@playwright/mcp@latest", "--config", string];
    transport: "MCP HTTP";
    noInstallPerformed: true;
    noBrowserAttached: true;
    requiresAuthenticatedTunnelForRemoteChatGPT: true;
  };
};

