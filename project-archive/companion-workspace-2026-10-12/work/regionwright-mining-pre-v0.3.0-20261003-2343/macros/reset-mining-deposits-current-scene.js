(async () => {
  const api = game.modules.get("regionwright-mining")?.api;
  if (!api) return ui.notifications.error("Mining Deposits & Extraction is not ready.");
  try {
    const result = await api.resetScene();
    ui.notifications.info(`Reset ${result.reset} mining deposit${result.reset === 1 ? "" : "s"} on ${result.scene.name}.`);
  } catch (error) {
    ui.notifications.warn(error.message ?? String(error));
  }
})();
