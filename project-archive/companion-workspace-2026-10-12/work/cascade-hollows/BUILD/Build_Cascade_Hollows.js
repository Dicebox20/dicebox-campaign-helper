(async () => {
  "use strict";

  const SCOPE = "dicebox-campaign-helper";
  const MANAGED = "managed";
  const MAP_FLAG = "underdarkMap";
  const TELEPORT_FLAG = "underdarkTeleport";
  const PACKAGE_ID = "dicebox-underdark-cascade-hollows-v2";
  const MAP_ID = "cascade-hollows";
  const SCENE_NAME = "Cascade Hollows";
  const RENDERER_PATH = "worlds/" + game.world.id + "/Cascade_Hollows.webp";

  const REGIONS = [
    { id:"cascade-arrival-shimmerdeep", name:"Cascade Arrival - Shimmerdeep", kind:"arrival", b:[92,468,118,142], persistence:"route-anchor" },
    { id:"cascade-return-shimmerdeep", name:"Return to Shimmerdeep Shelf", kind:"travel", b:[18,474,92,170], persistence:"reusable", routeKey:"shimmerdeep-cascade" },
    { id:"cascade-arrival-fossil-deeps", name:"Cascade Arrival - Fossil Deeps", kind:"arrival", b:[1394,176,92,118], persistence:"route-anchor" },
    { id:"cascade-exit-fossil-deeps", name:"Passage to Fossil Deeps", kind:"travel", b:[1470,165,64,132], persistence:"reusable", routeKey:"cascade-fossil-deeps" },

    { id:"cascade-ore-common-01", name:"Exposed Iron Vein", kind:"ore", b:[1196,86,138,128], persistence:"mining-system", oreId:"iron" },

    { id:"cascade-fishing-plunge-01", name:"Upper Plunge Pool", kind:"fishing", b:[176,104,252,216], persistence:"fishing-system", biome:"underdark", pondTier:"common" },
    { id:"cascade-fishing-channel-02", name:"Central Channel", kind:"fishing", b:[548,382,322,188], persistence:"fishing-system", biome:"underdark", pondTier:"uncommon" },
    { id:"cascade-fishing-deep-03", name:"Lower Deep Basin", kind:"fishing", b:[827,518,390,268], persistence:"fishing-system", biome:"underdark", pondTier:"uncommon" },

    { id:"cascade-resource-glowcap-01", name:"Glowcap Island", kind:"renewable-resource", b:[1010,114,112,104], persistence:"per-character-long-rest", reward:"Glowcap Bundle" },
    { id:"cascade-resource-deepmoss-02", name:"Deepmoss Shelf", kind:"renewable-resource", b:[455,558,128,112], persistence:"per-character-long-rest", reward:"Deepmoss" },
    { id:"cascade-resource-clay-03", name:"Cave Clay Bank", kind:"renewable-resource", b:[1038,762,272,176], persistence:"per-character-long-rest", reward:"Cave Clay" },
    { id:"cascade-resource-shellbed-04", name:"Shallow Shell Bed", kind:"renewable-resource", b:[1196,568,172,136], persistence:"per-character-long-rest", reward:"Shell material" },

    { id:"cascade-salvage-washup-01", name:"Washed-Up Expedition Debris", kind:"salvage", b:[1320,326,126,112], persistence:"global-one-time", reward:"Expedition supplies" },

    { id:"cascade-discovery-crystal-01", name:"Resonant Crystal Nodule", kind:"discovery", b:[1190,42,128,112], persistence:"global-one-time", reward:"Resonant Crystal Nodule" },
    { id:"cascade-discovery-shellcase-02", name:"Unusual Shell Specimen", kind:"discovery", b:[1092,770,112,104], persistence:"global-one-time", reward:"Shell specimen" },
    { id:"cascade-discovery-cache-03", name:"Hidden Deep-Gnome Cache", kind:"discovery", b:[68,672,134,132], persistence:"global-one-time", reward:"Expedition cache" },

    { id:"cascade-creature-zone-crab-01", name:"Cave Crab Harvesting Margin", kind:"creature-harvest", b:[1270,606,166,134], persistence:"existing-harvest-contract" },

    { id:"cascade-environment-dry-shelf-01", name:"Dry Staging Shelf", kind:"environment", b:[764,198,238,154], persistence:"reusable" },
    { id:"cascade-environment-waterfall-path-02", name:"Waterfall Side Path", kind:"environment", b:[350,275,176,150], persistence:"reusable" }
  ];

  const TELEPORTS = [
    {
      id:"cascade-to-shimmerdeep",
      routeKey:"shimmerdeep-cascade",
      source:{ mapId:MAP_ID, sceneName:SCENE_NAME, regionId:"cascade-return-shimmerdeep" },
      target:{ mapId:"shimmerdeep-shelf", sceneName:"Shimmerdeep Shelf", regionId:"shimmerdeep-arrival-cascade" }
    },
    {
      id:"shimmerdeep-to-cascade",
      routeKey:"shimmerdeep-cascade",
      source:{ mapId:"shimmerdeep-shelf", sceneName:"Shimmerdeep Shelf", regionId:"shimmerdeep-exit-cascade" },
      target:{ mapId:MAP_ID, sceneName:SCENE_NAME, regionId:"cascade-arrival-shimmerdeep" }
    },
    {
      id:"cascade-to-fossil-deeps",
      routeKey:"cascade-fossil-deeps",
      source:{ mapId:MAP_ID, sceneName:SCENE_NAME, regionId:"cascade-exit-fossil-deeps" },
      target:{ mapId:"fossil-deeps", sceneName:"Fossil Deeps", regionId:"fossil-arrival-cascade" }
    },
    {
      id:"fossil-deeps-to-cascade",
      routeKey:"cascade-fossil-deeps",
      source:{ mapId:"fossil-deeps", sceneName:"Fossil Deeps", regionId:"fossil-return-cascade" },
      target:{ mapId:MAP_ID, sceneName:SCENE_NAME, regionId:"cascade-arrival-fossil-deeps" }
    }
  ];

  const list = c => c?.contents ?? (c?.values ? Array.from(c.values()) : Array.from(c ?? []));
  const marker = d => d?.flags?.[SCOPE]?.[MANAGED] ?? null;
  const mapFlag = d => d?.flags?.[SCOPE]?.[MAP_FLAG] ?? null;

  function owned(d, kind, semanticId) {
    const m = marker(d);
    return m?.owner === SCOPE &&
      m?.packageId === PACKAGE_ID &&
      m?.kind === kind &&
      m?.semanticId === semanticId;
  }

  function managed(kind, semanticId) {
    return {
      owner:SCOPE,
      packageId:PACKAGE_ID,
      kind,
      semanticId,
      schemaVersion:"1.0.0"
    };
  }

  function stableRegionId(region) {
    return marker(region)?.semanticId
      ?? region?.flags?.[SCOPE]?.exploration?.regionId
      ?? region?.flags?.[SCOPE]?.regionId
      ?? null;
  }

  function runtimeGate() {
    const problems = [];
    if (!String(game.version ?? "").startsWith("14.367")) problems.push("Foundry 14.367 is required. Observed: " + game.version);
    if (game.system?.id !== "dnd5e" || game.system?.version !== "5.3.3") problems.push("D&D5e 5.3.3 is required. Observed: " + game.system?.id + " " + game.system?.version);
    if (!game.user?.isGM) problems.push("Run this macro as a GM.");
    return problems;
  }

  function resolveScene(ref) {
    const scenes = list(game.scenes);
    const stable = scenes.filter(s =>
      mapFlag(s)?.mapId === ref.mapId ||
      marker(s)?.semanticId === ref.mapId ||
      s?.flags?.[SCOPE]?.mapId === ref.mapId
    );
    if (stable.length === 1) return stable[0];
    if (stable.length > 1) return null;

    const exact = scenes.filter(s => s.name === ref.sceneName);
    return exact.length === 1 ? exact[0] : null;
  }

  function resolveRegion(scene, regionId) {
    if (!scene) return null;
    const regions = list(scene.regions);
    const stable = regions.filter(r => stableRegionId(r) === regionId);
    if (stable.length === 1) return stable[0];
    if (stable.length > 1) return null;

    const localName = REGIONS.find(r => r.id === regionId)?.name;
    const exact = regions.filter(r => r.name === regionId || (localName && r.name === localName));
    return exact.length === 1 ? exact[0] : null;
  }

  async function upsertScene() {
    const scenes = list(game.scenes);
    let scene = scenes.find(s => owned(s, "scene", MAP_ID)) ?? null;

    if (!scene) {
      const existingByStableId = scenes.filter(s =>
        mapFlag(s)?.mapId === MAP_ID ||
        marker(s)?.semanticId === MAP_ID ||
        s?.flags?.[SCOPE]?.mapId === MAP_ID
      );

      if (existingByStableId.length === 1) {
        scene = existingByStableId[0];
      } else if (existingByStableId.length > 1) {
        throw new Error("More than one scene claims the Cascade Hollows map ID.");
      }
    }

    if (!scene) {
      const exactName = scenes.filter(s => s.name === SCENE_NAME);
      if (exactName.length > 1) throw new Error("More than one scene is named Cascade Hollows.");
      if (exactName.length === 1) scene = exactName[0];
    }

    const sceneData = {
      name:SCENE_NAME,
      width:1536,
      height:1024,
      padding:0,
      navigation:true,
      backgroundColor:"#080b10",
      background:{ src:RENDERER_PATH },
      grid:{ type:0, size:64, distance:5, units:"ft" },
      flags:{
        [SCOPE]:{
          [MANAGED]:managed("scene", MAP_ID),
          [MAP_FLAG]:{
            mapId:MAP_ID,
            branch:"Northwest / Shimmerdeep Reach",
            renderer:RENDERER_PATH
          }
        }
      }
    };

    if (!scene) {
      const SceneClass = foundry.documents.Scene;
      scene = await SceneClass.create(sceneData, { renderSheet:false });
      return { scene, action:"created" };
    }

    await scene.update({
      name:SCENE_NAME,
      width:1536,
      height:1024,
      padding:0,
      navigation:true,
      backgroundColor:"#080b10",
      "background.src":RENDERER_PATH,
      "grid.type":0,
      ["flags." + SCOPE + "." + MANAGED]:managed("scene", MAP_ID),
      ["flags." + SCOPE + "." + MAP_FLAG]:{
        mapId:MAP_ID,
        branch:"Northwest / Shimmerdeep Reach",
        renderer:RENDERER_PATH
      }
    });

    return { scene:game.scenes.get(scene.id) ?? scene, action:"updated" };
  }

  function regionData(def) {
    const [x,y,width,height] = def.b;
    return {
      name:def.name,
      shapes:[{ type:"rectangle", x, y, width, height, rotation:0 }],
      elevation:{ bottom:null, top:null },
      color:"#2a9d8f",
      flags:{
        [SCOPE]:{
          [MANAGED]:managed("region", def.id),
          exploration:{
            mapId:MAP_ID,
            regionId:def.id,
            kind:def.kind,
            persistence:def.persistence,
            routeKey:def.routeKey ?? null,
            rewardFamily:def.reward ?? null,
            implementation:["fishing","ore"].includes(def.kind) ? "system" : "placeholder"
          }
        }
      }
    };
  }

  async function upsertRegions(scene) {
    const result = new Map();
    let created = 0;
    let updated = 0;

    for (const def of REGIONS) {
      const matches = list(scene.regions).filter(r => owned(r, "region", def.id));
      if (matches.length > 1) throw new Error("Duplicate Cascade Region: " + def.id);

      let region = matches[0] ?? null;
      if (!region) {
        const made = await scene.createEmbeddedDocuments("Region", [regionData(def)]);
        region = made[0];
        created++;
      } else {
        const data = regionData(def);
        await scene.updateEmbeddedDocuments("Region", [{ _id:region.id, ...data }]);
        region = scene.regions.get(region.id) ?? region;
        updated++;
      }
      result.set(def.id, region);
    }

    return { byId:result, created, updated };
  }

  async function configureFishingAndMining(byId) {
    const report = { fishing:[], mining:[], warnings:[] };

    const fishingApi = game.modules.get("regionwright-fishing")?.api;
    for (const def of REGIONS.filter(r => r.kind === "fishing")) {
      if (!fishingApi?.inject) {
        report.warnings.push("Fishing module/API unavailable: " + def.id);
        continue;
      }
      try {
        await fishingApi.inject({
          region:byId.get(def.id),
          biome:def.biome,
          pondTier:def.pondTier
        });
        report.fishing.push(def.id);
      } catch (error) {
        report.warnings.push("Fishing setup failed for " + def.id + ": " + (error?.message ?? error));
      }
    }

    const miningApi = game.modules.get("regionwright-mining")?.api;
    for (const def of REGIONS.filter(r => r.kind === "ore")) {
      if (!miningApi?.configureRegion) {
        report.warnings.push("Mining module/API unavailable: " + def.id);
        continue;
      }
      try {
        await miningApi.configureRegion({
          region:byId.get(def.id),
          oreId:def.oreId
        });
        report.mining.push(def.id);
      } catch (error) {
        report.warnings.push("Mining setup failed for " + def.id + ": " + (error?.message ?? error));
      }
    }

    return report;
  }

  function teleportData(spec, destinationUuid) {
    return {
      name:"Dicebox Route - " + spec.id,
      type:"teleportToken",
      disabled:false,
      system:{
        destinations:[destinationUuid],
        placement:"center",
        snap:true,
        choice:false,
        revealed:false,
        dialog:{ revealed:null, unrevealed:null },
        transition:{ type:null, duration:1500 }
      },
      flags:{
        [SCOPE]:{
          [TELEPORT_FLAG]:{
            packageId:PACKAGE_ID,
            teleportId:spec.id,
            routeKey:spec.routeKey
          }
        }
      }
    };
  }

  async function bindTeleport(spec) {
    const sourceScene = resolveScene(spec.source);
    const targetScene = resolveScene(spec.target);
    if (!sourceScene || !targetScene) return { id:spec.id, status:"unlinked-scene-missing" };

    const sourceRegion = resolveRegion(sourceScene, spec.source.regionId);
    const targetRegion = resolveRegion(targetScene, spec.target.regionId);
    if (!sourceRegion || !targetRegion?.uuid) return { id:spec.id, status:"unlinked-region-missing" };

    const behaviors = list(sourceRegion.getEmbeddedCollection?.("RegionBehavior") ?? sourceRegion.behaviors);
    const matches = behaviors.filter(b =>
      b?.flags?.[SCOPE]?.[TELEPORT_FLAG]?.packageId === PACKAGE_ID &&
      b?.flags?.[SCOPE]?.[TELEPORT_FLAG]?.teleportId === spec.id
    );

    const data = teleportData(spec, targetRegion.uuid);

    if (matches[0]) {
      await sourceRegion.updateEmbeddedDocuments("RegionBehavior", [{ _id:matches[0].id, ...data }]);
      return { id:spec.id, status:"updated" };
    }

    await sourceRegion.createEmbeddedDocuments("RegionBehavior", [data]);
    return { id:spec.id, status:"created" };
  }

  const gate = runtimeGate();
  if (gate.length) throw new Error(gate.join("\n"));

  ui.notifications.info("Building Cascade Hollows...");

  const sceneResult = await upsertScene();
  const regionResult = await upsertRegions(sceneResult.scene);
  const systemReport = await configureFishingAndMining(regionResult.byId);

  const routeReport = [];
  for (const spec of TELEPORTS) {
    try {
      routeReport.push(await bindTeleport(spec));
    } catch (error) {
      routeReport.push({ id:spec.id, status:"warning", message:error?.message ?? String(error) });
    }
  }

  const scene = game.scenes.get(sceneResult.scene.id) ?? sceneResult.scene;
  const ownedRegions = list(scene.regions).filter(r => {
    const m = marker(r);
    return m?.owner === SCOPE &&
      m?.packageId === PACKAGE_ID &&
      m?.kind === "region";
  });

  if (ownedRegions.length !== REGIONS.length) {
    throw new Error("Cascade build ended with " + ownedRegions.length + " of " + REGIONS.length + " managed Regions.");
  }

  const receipt = {
    mapId:MAP_ID,
    status:"PASS",
    sceneAction:sceneResult.action,
    sceneId:scene.id,
    renderer:RENDERER_PATH,
    managedRegions:ownedRegions.length,
    fishingConfigured:systemReport.fishing,
    miningConfigured:systemReport.mining,
    warnings:systemReport.warnings,
    routes:routeReport
  };

  console.log("Cascade Hollows BUILD receipt", receipt);

  await scene.view();

  if (systemReport.warnings.length) {
    ui.notifications.warn("Cascade Hollows built with " + systemReport.warnings.length + " integration warning(s). See console.");
  } else {
    ui.notifications.info("Cascade Hollows built successfully.");
  }

  return receipt;
})();