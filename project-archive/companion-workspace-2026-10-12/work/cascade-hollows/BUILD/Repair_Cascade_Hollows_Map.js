(async () => {
  const scene = game.scenes.get("FOP6lUmKv07ReHms") ?? game.scenes.getName("Cascade Hollows");
  if (!scene) throw new Error("Cascade Hollows scene was not found.");

  const path = "worlds/" + game.world.id + "/Cascade_Hollows.webp";
  const level = scene.initialLevel ?? scene.levels?.contents?.[0] ?? null;
  if (!level) throw new Error("Cascade Hollows has no initial Scene Level.");

  await level.update({ "background.src": path });
  await scene.update({ width: 1536, height: 1024, padding: 0, navigation: true });

  try {
    await foundry.canvas.TextureLoader.loader.load([path]);
  } catch (error) {
    console.warn("Cascade Hollows texture preload warning", error);
  }

  await scene.view();

  console.log("Cascade Hollows renderer repaired", {
    sceneId: scene.id,
    levelId: level.id,
    renderer: level.background?.src ?? level._source?.background?.src ?? path
  });

  ui.notifications.info("Cascade Hollows map image attached successfully.");
})();