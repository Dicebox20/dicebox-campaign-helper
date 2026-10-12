(async () => {
  const api = game.modules.get("regionwright-mining")?.api;
  if (!api) return ui.notifications.error("Mining Deposits & Extraction is not ready.");
  try {
    await api.openSetup();
  } catch (error) {
    ui.notifications.warn(error.message ?? String(error));
  }
})();
