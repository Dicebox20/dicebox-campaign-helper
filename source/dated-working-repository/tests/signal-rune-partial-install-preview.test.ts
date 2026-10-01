import { describe, expect, it } from "vitest";
// @ts-expect-error browser adapter has no Foundry dependency.
import { installSignalRunePartialInstallPreviewApi, openSignalRunePartialInstallPreviewControl, previewSignalRunePartialInstall, registerSignalRunePartialInstallPreviewControl } from "../packages/dicebox-foundry/src/signal-rune-partial-install-preview.js";

const runtime = (sceneNames = ["Signal / Frequency Chamber", "Rune Mechanism Chamber"]) => ({ game: { version: "14.367", system: { id: "dnd5e", version: "5.3.3" }, user: { id: "gm", isGM: true }, users: { activeGM: { id: "gm" } }, scenes: { contents: sceneNames.map((name, index) => ({ id: String(index), name })) } } });
describe("fixed Signal/Rune partial-install preview", () => {
  it("returns only two immutable no-write candidates", () => { const receipt = previewSignalRunePartialInstall(runtime()); expect(receipt).toMatchObject({ status: "PASS", noWrite: true, apply: false }); expect(receipt.candidates).toHaveLength(2); expect(receipt.excluded).toHaveLength(2); });
  it("fails closed for duplicate or missing scene bindings", () => { expect(previewSignalRunePartialInstall(runtime(["Signal / Frequency Chamber", "Signal / Frequency Chamber", "Rune Mechanism Chamber"])).status).toBe("BLOCKED"); expect(previewSignalRunePartialInstall(runtime(["Signal / Frequency Chamber"])).status).toBe("BLOCKED"); });
  it("registers only for the elected GM and adds one fixed control", () => {
    let handler: ((controls: any) => void) | undefined;
    const candidate: any = runtime(); candidate.Hooks = { on: (_event: string, callback: typeof handler) => { handler = callback; } };
    expect(registerSignalRunePartialInstallPreviewControl(candidate)).toBe(true);
    expect(Object.keys(candidate.game.diceboxSignalRunePartialInstallPreview)).toEqual(["preview"]);
    const controls: any = { tokens: { tools: {} } }; handler?.(controls);
    expect(controls.tokens.tools["dicebox-signal-rune-partial-install-preview"]).toMatchObject({ title: "Preview DiceBox Signal/Rune Partial Install", visible: true });
    candidate.game.users.activeGM.id = "other";
    expect(registerSignalRunePartialInstallPreviewControl(candidate)).toBe(false);
  });
  it("renders only a close-only receipt dialog", async () => {
    let dialog: any;
    const candidate: any = runtime(); candidate.foundry = { applications: { api: { DialogV2: { wait: async (options: any) => { dialog = options; } } } }, utils: { escapeHTML: (value: string) => value } };
    installSignalRunePartialInstallPreviewApi(candidate);
    await expect(openSignalRunePartialInstallPreviewControl(candidate)).resolves.toMatchObject({ status: "PASS", noWrite: true, apply: false });
    expect(dialog.buttons).toEqual([{ action: "close", label: "Close", icon: "fa-solid fa-xmark" }]);
  });
});
