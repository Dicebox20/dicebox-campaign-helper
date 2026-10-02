/**
 * DiceBox fixture-only Tram routing apply injection macro.
 *
 * Fixed GM transport for one reviewed dbx-test-world apply. It obtains a fresh
 * preview token, asks for an explicit confirmation, and returns the adapter's
 * authoritative reread receipt. It never targets Ballad.
 */

const expectedWorldId = "dbx-test-world";
const game = globalThis.game;
const activeGM = game?.users?.activeGM;
if (game?.world?.id !== expectedWorldId || !game?.user?.isGM || activeGM?.id !== game.user?.id) {
  globalThis.ui?.notifications?.warn?.("DiceBox Tram routing apply requires the elected GM in dbx-test-world.");
  console.warn("[DiceBox] Fixture Tram routing apply blocked by the world or active-GM gate.");
  return Object.freeze({ operation: "tram-routing.fixture.apply", status: "BLOCKED", noWrite: true });
}

const adapter = game.diceboxTramRoutingFixture;
const preview = adapter?.previewInstall?.();
if (!preview) {
  globalThis.ui?.notifications?.warn?.("DiceBox Tram routing adapter is not available in this client.");
  console.warn("[DiceBox] Fixture Tram routing adapter is unavailable.");
  return null;
}

console.info("[DiceBox] Fixture Tram routing apply preview " + JSON.stringify(preview));
if (preview.status !== "PASS") {
  globalThis.ui?.notifications?.warn?.("DiceBox Tram routing preview is " + preview.status + ".");
  return preview;
}

const approved = await globalThis.foundry?.applications?.api?.DialogV2?.confirm({
  window: { title: "Apply fixture Tram routing projection" },
  content: "<p>Apply the reviewed Tram v6 routing rehearsal to dbx-test-world?</p><p>This creates one fixture-only Scene with 11 Walls, 3 doors, 5 fixed rail/gate Tiles, 6 dynamic car Tiles, 39 fixed Regions, and 6 equal-bounds footprint Regions. It does not target Ballad.</p>",
  yes: { label: "Apply fixture Tram routing" },
  no: { label: "Cancel", default: true },
  rejectClose: false,
});

if (!approved) {
  console.info("[DiceBox] Fixture Tram routing apply cancelled.");
  return Object.freeze({ operation: "tram-routing.fixture.apply", status: "CANCELLED", noWrite: true, planId: preview.planId });
}

const receipt = await adapter.applyInstall({ approved: true, planToken: preview.planToken });
console.info("[DiceBox] Fixture Tram routing apply " + JSON.stringify(receipt));
globalThis.ui?.notifications?.info?.("DiceBox Tram routing apply: " + receipt.status + ".");
return receipt;
