// DiceBox — M01 Wall Injector v001 (Foundry 14.367, D&D5e 5.3.3)
// Reads the approved staged BUILD manifest; adds only M01 candidate walls.
// Safe to rerun: never duplicates or overwrites existing walls.
(async () => {
  "use strict";
  const OP = "dicebox.m01.walls.install.v001";
  const WORLD = "the-forgotten-realms";
  const SCENE_ID = "poijD5fkVUWZMJEH";
  const FOLDER_ID = "Rg5vUAEEv53v2KY1";
  const MAP_NAME = "M01 — The Forgotten Road";
  const PACKAGE = "dicebox-btr-underdark-expedition-v001";
  const OWNER = "dicebox-campaign-helper";
  const MAP_ID = "btr-expedition-m01-forgotten-road";
  const DIR = "worlds/the-forgotten-realms/assets/dicebox-expedition";
  const IMAGE = DIR + "/M01_Forgotten_Road_final.png";
  const MANIFEST = DIR + "/M01_build_manifest.json";
  const BUILD = "dicebox-m01-forgotten-road-stage-v001";
  const expected = 156;
  const report = { operation: OP, status: "NOT_STARTED", expected };

  try {
    if (!game.user?.isGM || game.world?.id !== WORLD ||
        game.version !== "14.367" || game.system?.id !== "dnd5e" ||
        game.system?.version !== "5.3.3") {
      throw new Error("World, system/version, or GM permission mismatch");
    }

    const scene = game.scenes.get(SCENE_ID);
    if (!scene || scene.name !== MAP_NAME || scene.folder?.id !== FOLDER_ID) {
      throw new Error("Target scene or expedition folder does not match");
    }
    if (scene.background?.src !== IMAGE ||
        scene.width !== 1536 || scene.height !== 1024) {
      throw new Error("M01 background or dimensions incorrect; no walls written");
    }

    const response = await fetch(MANIFEST, { cache: "no-store" });
    if (!response.ok) throw new Error("BUILD manifest unavailable: HTTP " + response.status);
    const data = await response.json();
    const definitions = data?.geometry?.walls;
    if (data.build_id !== BUILD || data.scene_name !== MAP_NAME ||
        data.sha256 !== "dad418cf5ff2eb0a1cd0491881a60452b28b91325f0b65cd968b410dfba70e9a" ||
        data.canvas?.width !== 1536 || data.canvas?.height !== 1024 ||
        !Array.isArray(definitions) || definitions.length !== expected) {
      throw new Error("Manifest identity/count mismatch; no walls written");
    }
    if (!data.geometry.excluded_from_wall_generation
        ?.some(s => String(s).includes("roadside half-walls"))) {
      throw new Error("Roadside half-wall exclusion is missing");
    }

    const seen = new Set();
    const wallData = definitions.map(w => {
      const c = w.c;
      if (typeof w.id !== "string" || seen.has(w.id) ||
          /roadside|half-wall|pit-rim/i.test(w.group || "") ||
          !Array.isArray(c) || c.length !== 4 ||
          !c.every((n, i) => Number.isFinite(n) && n >= 0 &&
            n <= (i % 2 === 0 ? 1536 : 1024)) ||
          (c[0] === c[2] && c[1] === c[3]) ||
          w.move !== 20 || w.sight !== 20 || w.door !== 0) {
        throw new Error("Unsafe or invalid wall definition: " + (w.id || "?"));
      }
      seen.add(w.id);
      return {
        c, move: w.move, sight: w.sight, light: w.light,
        sound: w.sound, door: 0, dir: w.dir,
        flags: {
          [OWNER]: {
            managed: {
              owner: OWNER, packageId: PACKAGE, kind: "wall",
              semanticId: MAP_ID + ":" + w.id, schemaVersion: "1.0.0"
            },
            m01Wall: { mapId: MAP_ID, buildId: BUILD, segmentId: w.id,
              group: w.group, geometryStatus: "PROVISIONAL" }
          }
        }
      };
    });

    const existing = scene.walls.contents;
    const owned = existing.filter(w =>
      w.flags?.[OWNER]?.m01Wall?.mapId === MAP_ID &&
      w.flags?.[OWNER]?.m01Wall?.buildId === BUILD);
    if (existing.length) {
      if (existing.length === expected && owned.length === expected &&
          new Set(owned.map(w => w.flags[OWNER].m01Wall.segmentId)).size === expected &&
          owned.every(w => {
            const spec = definitions.find(x => x.id === w.flags[OWNER].m01Wall.segmentId);
            return spec && w.c.every((n, i) => n === spec.c[i]);
          })) {
        report.status = "ALREADY_INSTALLED_NO_WRITE";
        report.count = owned.length;
        console.log("[DiceBox M01 Wall Injector]", report);
        ui.notifications.info("M01 walls already installed; no duplicates created.");
        return;
      }
      throw new Error("Scene already has walls or a partial install; refusing to overwrite");
    }

    // Single bounded live write, followed by a verified readback.
    const created = await scene.createEmbeddedDocuments("Wall", wallData);
    const saved = game.scenes.get(SCENE_ID);
    const confirmed = saved.walls.contents.filter(w =>
      w.flags?.[OWNER]?.m01Wall?.mapId === MAP_ID &&
      w.flags?.[OWNER]?.m01Wall?.buildId === BUILD);
    report.status = created.length === expected &&
      saved.walls.size === expected && confirmed.length === expected
      ? "PASS_PROVISIONAL_GEOMETRY" : "OUTCOME_UNKNOWN_REREAD_REQUIRED";
    report.created = created.length;
    report.wallCount = saved.walls.size;
    report.ownedCount = confirmed.length;
    report.sceneId = saved.id;
    report.roadsideHalfWalls = "EXCLUDED";
    console.log("[DiceBox M01 Wall Injector]", report);
    if (report.status === "PASS_PROVISIONAL_GEOMETRY") {
      ui.notifications.info("M01: 156 provisional walls installed. Check alignment in-game.");
    } else {
      ui.notifications.error("M01 wall count mismatch. Do not rerun until inspected.");
    }
  } catch (error) {
    report.status = "BLOCKED_OR_OUTCOME_UNKNOWN";
    report.error = String(error?.message ?? error);
    console.error("[DiceBox M01 Wall Injector]", report);
    ui.notifications.error("M01 walls: " + report.error.slice(0, 140));
  }
})();
