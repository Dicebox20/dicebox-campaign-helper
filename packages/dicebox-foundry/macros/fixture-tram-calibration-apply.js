/**
 * DiceBox fixture-only Tram coordinate calibration injection macro.
 *
 * Fixed GM transport for the reviewed dbx-test-world adapter. It previews,
 * requires an explicit UI confirmation, applies only the current preview
 * token, and emits the adapter's authoritative reread receipt.
 */

const adapter = globalThis.game?.diceboxTramCalibration;
const preview = adapter?.preview?.();
if (!preview) {
  globalThis.ui?.notifications?.warn?.("DiceBox Tram calibration adapter is not available in this client.");
  console.warn("[DiceBox] Fixture Tram calibration adapter is unavailable.");
  return null;
}

console.info("[DiceBox] Fixture Tram calibration preview " + JSON.stringify(preview));
if (preview.status !== "PASS") {
  globalThis.ui?.notifications?.warn?.("DiceBox Tram calibration preview is " + preview.status + ".");
  return preview;
}

const approved = await globalThis.foundry?.applications?.api?.DialogV2?.confirm({
  window: { title: "Apply fixture Tram calibration" },
  content: "<p>Apply the reviewed fixture-only Tram coordinate calibration?</p><p>This creates one dedicated fixture Scene with 11 Walls, 3 doors, one Tile, and one Region. It does not target Ballad.</p>",
  yes: { label: "Apply fixture calibration" },
  no: { label: "Cancel", default: true },
  rejectClose: false,
});

if (!approved) {
  console.info("[DiceBox] Fixture Tram calibration apply cancelled.");
  return Object.freeze({ operation: "tram-calibration.apply", status: "CANCELLED", noWrite: true, planId: preview.planId });
}

const receipt = await adapter.apply({ approved: true, planToken: preview.planToken });
console.info("[DiceBox] Fixture Tram calibration apply " + JSON.stringify(receipt));
globalThis.ui?.notifications?.info?.("DiceBox Tram calibration apply: " + receipt.status + ".");
return receipt;
