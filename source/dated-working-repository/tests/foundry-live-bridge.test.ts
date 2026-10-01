import { describe, expect, it } from "vitest";

describe("DiceBox page-main Foundry live bridge contract", () => {
  it("exposes only the reviewed fixed operations and loopback boundary", async () => {
    // @ts-expect-error Foundry browser entry intentionally has no local declaration file.
    const module = await import("../packages/dicebox-foundry/src/foundry-live-bridge.js");
    expect(module.BRIDGE_PROTOCOL).toBe("dicebox-foundry-live-bridge/1");
    expect(module.BRIDGE_URL).toBe("ws://127.0.0.1:8797/dicebox-foundry");
    expect(module.ALLOWED_OPERATIONS).toEqual([
      "bridge.status",
      "helper.readiness",
      "ascendancy.preview",
      "ascendancy.install",
      "ascendancy.repair.preview",
      "ascendancy.repair",
      "ascendancy.snapshot",
      "harness.status",
    ]);
    const blocked = module.boundary({
      settings: { get: () => false },
      user: { isGM: true, id: "gm" },
      users: { activeGM: { id: "gm" } },
      world: { id: "the-ballad-of-chauser-bill" },
    });
    expect(blocked).toContain("Enable the DiceBox private bridge");
  });

  it("requires both explicit settings, the elected GM, and the exact world", async () => {
    // @ts-expect-error Foundry browser entry intentionally has no local declaration file.
    const { boundary } = await import("../packages/dicebox-foundry/src/foundry-live-bridge.js");
    const game = {
      settings: { get: (_scope: string, key: string) => ({ enableMcpTestBridge: true, enableVerificationHarness: true, verificationWorldId: "the-ballad-of-chauser-bill" }[key as "enableMcpTestBridge"])
      },
      user: { isGM: true, id: "gm" },
      users: { activeGM: { id: "gm" } },
      world: { id: "other-world" },
    };
    expect(boundary(game)).toContain("restricted");
  });

  it("uses the installer API key published by the Ascendancy installer", async () => {
    const installerSource = await (await import("node:fs/promises")).readFile("packages/dicebox-foundry/src/ascendancy-installer.js", "utf8");
    const bridgeSource = await (await import("node:fs/promises")).readFile("packages/dicebox-foundry/src/foundry-live-bridge.js", "utf8");
    expect(installerSource).toContain('const INSTALLER_KEY = "diceboxCampaignHelperInstall";');
    expect(bridgeSource).toContain('const INSTALLER_KEY = "diceboxCampaignHelperInstall";');
    expect(bridgeSource).toContain("this.game?.[INSTALLER_KEY]");
    expect(bridgeSource).not.toContain("diceboxCampaignHelperAscendancyInstaller");
  });

  it("redacts runtime bindings in owned Scene/Wall/Region snapshots", async () => {
    // @ts-expect-error Foundry browser entry intentionally has no local declaration file.
    const { summarizeSnapshot } = await import("../packages/dicebox-foundry/src/foundry-live-bridge.js");
    const snapshot = summarizeSnapshot({ scenes: { contents: [{ uuid: "Scene.secret", flags: { "dicebox-campaign-helper": { managed: { owner: "dicebox-campaign-helper", packageId: "dbx:package:test", semanticId: "dbx:room:test" } } }, walls: { contents: [{ uuid: "Scene.secret.Wall.secret", flags: { "dicebox-campaign-helper": { managed: { owner: "dicebox-campaign-helper", packageId: "dbx:package:test", semanticId: "dbx:wall:test" } } } }] }, regions: { contents: [] } }] } });
    expect(snapshot.scenes[0]).toMatchObject({ semanticId: "dbx:room:test", binding: "redacted:secret" });
    expect(snapshot.scenes[0].walls[0].binding).toBe("redacted:secret");
    expect(JSON.stringify(snapshot)).not.toContain("Scene.secret");
  });
});
