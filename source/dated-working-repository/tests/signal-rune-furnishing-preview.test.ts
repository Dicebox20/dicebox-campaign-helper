import { describe, expect, it } from "vitest";
import { createAscendancyRuneFurnishingPlanFixture, createAscendancySignalFurnishingPlanFixture } from "../packages/dicebox-compiler/src/ascendancy-furnishing-plan-fixture.js";
// @ts-expect-error browser adapter remains deliberately untyped in Node.
import { SignalRuneFurnishingPreviewAdapter, registerSignalRuneFurnishingPreviewControl } from "../packages/dicebox-foundry/src/signal-rune-furnishing-preview.js";

const plans = { "dbx:scene:signal-frequency-chamber": createAscendancySignalFurnishingPlanFixture(), "dbx:scene:rune-mechanism-chamber": createAscendancyRuneFurnishingPlanFixture() };
const attestations = { "dbx:asset:map-signal-frequency-chamber": { assetId: "dbx:asset:map-signal-frequency-chamber", status: "ready", noWrite: true }, "dbx:asset:map-rune-mechanism-chamber": { assetId: "dbx:asset:map-rune-mechanism-chamber", status: "ready", noWrite: true } };
function runtime() { const scenes = [{ id: "signal", name: "Signal / Frequency Chamber" }, { id: "rune", name: "Rune Mechanism Chamber" }, { id: "foreign", name: "Ascendancy Tram Depot" }]; return { game: { world: { id: "dbx-test-world" }, version: "14.367", system: { id: "dnd5e", version: "5.3.3" }, user: { id: "gm", isGM: true }, users: { activeGM: { id: "gm" } }, scenes: { contents: scenes, get: (id: string) => scenes.find((scene) => scene.id === id) } } }; }
describe("fixed Signal/Rune furnishing preview", () => {
  it("previews exactly the two attested six-item plans without writes", () => {
    const receipt = new SignalRuneFurnishingPreviewAdapter({ runtime: runtime(), plans, attestations }).previewAll();
    expect(receipt).toMatchObject({ status: "PASS", noWrite: true, foreignStatePreserved: true });
    expect(receipt.previews).toHaveLength(2);
    expect(receipt.previews.every((entry: any) => entry.itemCount === 6 && entry.stepCount === 6)).toBe(true);
    expect("apply" in Object.getPrototypeOf(new SignalRuneFurnishingPreviewAdapter())).toBe(false);
  });
  it("fails closed for runtime, attestation, and duplicate Scene drift", () => {
    const bad = runtime(); bad.game.users.activeGM.id = "other"; bad.game.scenes.contents.push({ id: "signal-2", name: "Signal / Frequency Chamber" });
    const receipt = new SignalRuneFurnishingPreviewAdapter({ runtime: bad, plans, attestations: { ...attestations, "dbx:asset:map-rune-mechanism-chamber": { assetId: "dbx:asset:map-rune-mechanism-chamber", status: "missing", noWrite: true } } }).previewAll();
    expect(receipt).toMatchObject({ status: "BLOCKED", noWrite: true });
    expect(receipt.blockers.length).toBeGreaterThan(1);
  });
  it("registers one GM-only close-only control without an apply surface", () => {
    let callback: any; const live: any = runtime(); live.Hooks = { on: (_: string, handler: any) => { callback = handler; } };
    expect(registerSignalRuneFurnishingPreviewControl(live)).toBe(true);
    const controls: any = { tokens: { tools: {} } }; callback(controls);
    expect(controls.tokens.tools["dicebox-signal-rune-furnishing-preview"]).toMatchObject({ button: true, visible: true, title: "Preview DiceBox Signal/Rune Furnishings" });
    expect(Object.keys(live.game.diceboxSignalRuneFurnishingPreview)).toEqual(["preview"]);
  });
});
