const fixture = game.diceboxTramRoutingFixture;
if (!fixture?.previewVisualRefresh || !fixture?.applyVisualRefresh) {
  throw new Error("The reviewed DiceBox fixture Tram visual-refresh adapter is unavailable.");
}

const preview = fixture.previewVisualRefresh();
console.log(preview);
if (preview.status !== "PASS") {
  ui.notifications.error("Tram visual-refresh preview did not pass. See console receipt.");
  return preview;
}

const approved = await foundry.applications.api.DialogV2.confirm({
  window: { title: "Refresh Fixture Tram Artwork" },
  content: `<p>Update only ${preview.updates.length} DiceBox-owned Tram Tile texture path(s).</p><p>No Scene, Wall, Region, behavior, macro, board state, or foreign document will change.</p>`,
  yes: { label: "Refresh Artwork", icon: "fa-solid fa-paint-roller" },
  no: { label: "Cancel", icon: "fa-solid fa-xmark" },
});
if (!approved) return Object.freeze({ operation: "tram-routing.fixture.visual-refresh.apply", status: "CANCELLED", noWrite: true });

const receipt = await fixture.applyVisualRefresh({ approved: true, planToken: preview.planToken });
console.log(receipt);
ui.notifications[receipt.status === "PASS" ? "info" : "error"](`Tram visual refresh: ${receipt.status}.`);
return receipt;
