/**
 * DiceBox fixture-only Tram routing preview injection macro.
 *
 * Fixed GM transport for the reviewed dbx-test-world routing adapter. It
 * performs no Foundry document write and returns the current preview receipt.
 */

const expectedWorldId = "dbx-test-world";
const game = globalThis.game;
const activeGM = game?.users?.activeGM;
if (game?.world?.id !== expectedWorldId || !game?.user?.isGM || activeGM?.id !== game.user?.id) {
  globalThis.ui?.notifications?.warn?.("DiceBox Tram routing preview requires the elected GM in dbx-test-world.");
  console.warn("[DiceBox] Fixture Tram routing preview blocked by the world or active-GM gate.");
  return Object.freeze({ operation: "tram-routing.fixture.preview", status: "BLOCKED", noWrite: true });
}

const preview = game.diceboxTramRoutingFixture?.previewInstall?.();
if (!preview) {
  globalThis.ui?.notifications?.warn?.("DiceBox Tram routing adapter is not available in this client.");
  console.warn("[DiceBox] Fixture Tram routing adapter is unavailable.");
  return null;
}

console.info("[DiceBox] Fixture Tram routing preview " + JSON.stringify(preview));
globalThis.ui?.notifications?.info?.(`DiceBox Tram routing preview: ${preview.status} (${preview.operation}).`);
return preview;
