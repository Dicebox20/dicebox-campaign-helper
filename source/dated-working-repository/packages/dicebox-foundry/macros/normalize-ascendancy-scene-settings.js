/**
 * DiceBox GM-only scene-settings injection macro.
 *
 * Scope: only the three user-supplied Scene UUIDs. This macro intentionally
 * never changes a renderer, Level, Wall, Tile, Region, RegionBehavior, flag,
 * ownership record, or puzzle state.
 */
const TARGET_SCENE_UUIDS = Object.freeze([
  "Scene.spVI07qS6NwPAKkn",
  "Scene.Vk6IMQh7jTxmKBtH",
  "Scene.Pu025lbCjgkxrUJj",
]);

const DICEBOX_SCENE_SETTINGS = Object.freeze({
  width: 1536,
  height: 1024,
  padding: 0,
  backgroundColor: "#080b10",
  grid: Object.freeze({ type: 0, size: 64, distance: 5, units: "grid-unit" }),
});

if (!game.user?.isGM || game.users.activeGM?.id !== game.user.id) {
  throw new Error("DiceBox scene settings require the currently elected active GM.");
}

const scenes = [];
for (const uuid of TARGET_SCENE_UUIDS) {
  const scene = await fromUuid(uuid);
  if (!scene || scene.documentName !== "Scene") {
    throw new Error(`Expected a Scene at ${uuid}; no changes were made.`);
  }
  scenes.push(scene);
}

function describe(scene) {
  const source = scene.toObject();
  return {
    uuid: scene.uuid,
    name: scene.name,
    width: scene.width,
    height: scene.height,
    padding: scene.padding,
    backgroundColor: scene.backgroundColor,
    grid: { ...(source.grid ?? {}), type: scene.grid?.type, size: scene.grid?.size, distance: scene.grid?.distance, units: scene.grid?.units },
  };
}

const preview = scenes.map(describe);
const confirmed = await foundry.applications.api.DialogV2.confirm({
  window: { title: "Apply DiceBox Scene Settings" },
  content: `<p>This updates canvas and grid settings on ${scenes.length} declared Scenes only.</p><p>It will not alter backgrounds, Levels, Walls, Tiles, Regions, Behaviors, or puzzle state.</p><pre>${foundry.utils.escapeHTML(JSON.stringify(preview, null, 2))}</pre>`,
  yes: { label: "Apply and reread" },
  no: { label: "Cancel" },
  rejectClose: false,
});

if (!confirmed) {
  ui.notifications.info("DiceBox scene-setting update cancelled.");
  return;
}

const applied = [];
try {
  for (const scene of scenes) {
    const current = scene.toObject();
    await scene.update({
      width: DICEBOX_SCENE_SETTINGS.width,
      height: DICEBOX_SCENE_SETTINGS.height,
      padding: DICEBOX_SCENE_SETTINGS.padding,
      backgroundColor: DICEBOX_SCENE_SETTINGS.backgroundColor,
      grid: { ...(current.grid ?? {}), ...DICEBOX_SCENE_SETTINGS.grid },
    });

    const reread = await fromUuid(scene.uuid);
    const actual = describe(reread);
    const valid = actual.width === 1536
      && actual.height === 1024
      && actual.padding === 0
      && actual.backgroundColor === "#080b10"
      && actual.grid.type === 0
      && actual.grid.size === 64
      && actual.grid.distance === 5
      && actual.grid.units === "grid-unit";
    if (!valid) throw new Error(`Authoritative reread failed for ${scene.name}.`);
    applied.push(actual);
  }

  const receipt = Object.freeze({ operation: "dicebox.scene-settings.apply", status: "PASS", targetSceneUuids: TARGET_SCENE_UUIDS, applied, authoritativeReread: true });
  console.log("DiceBox scene settings receipt", receipt);
  ui.notifications.info(`DiceBox settings applied and verified for ${applied.length} Scenes.`);
  receipt;
} catch (error) {
  const receipt = Object.freeze({ operation: "dicebox.scene-settings.apply", status: "UNKNOWN", targetSceneUuids: TARGET_SCENE_UUIDS, applied, error: String(error), recovery: "Do not retry blindly. Reread the three declared Scenes before a new preview." });
  console.error("DiceBox scene settings outcome may be partial", receipt);
  ui.notifications.error("Scene update may be partial. Do not rerun blindly; inspect the console receipt first.");
  throw error;
}
