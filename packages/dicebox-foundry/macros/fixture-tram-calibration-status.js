/**
 * DiceBox fixture-only Tram calibration status injection macro.
 *
 * Reviewed transport for an already-loaded fixed adapter. It reads status,
 * writes no Foundry Document, sends no network request, and is GM-only.
 */

const receipt = globalThis.game?.diceboxTramCalibration?.status?.();
if (!receipt) {
  globalThis.ui?.notifications?.warn?.("DiceBox Tram calibration adapter is not available in this client.");
  console.warn("[DiceBox] Fixture Tram calibration adapter is unavailable.");
  return null;
}

console.info("[DiceBox] Fixture Tram calibration status " + JSON.stringify(receipt));
globalThis.ui?.notifications?.info?.(`DiceBox Tram calibration: ${receipt.status} (${receipt.operation}).`);
return receipt;
