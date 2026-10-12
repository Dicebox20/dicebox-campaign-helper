/**
 * Cascade Hollows Foundry VTT injector.
 * Target: Foundry VTT 14.367 / D&D5e 5.3.3.
 * Evidence status: staged build only until executed and reread in the target world.
 */
(async () => {
  "use strict";

  const TARGET = Object.freeze({ foundryVersion:"14.367", systemId:"dnd5e", systemVersion:"5.3.3" });
  const SCOPE = "dicebox-campaign-helper";
  const MANAGED_KEY = "managed";
  const MAP_KEY = "underdarkMap";
  const TELEPORT_KEY = "underdarkTeleport";
  const PACKAGE_ID = "dicebox-underdark-cascade-hollows-v1";
  const MAP_ID = "cascade-hollows";
  const SCENE_NAME = "Cascade Hollows";
  const RENDERER_PATH = "worlds/" + game.world.id + "/dicebox/maps/underdark/cascade-hollows.webp";
  const RENDERER_SHA256 = "6b8107a2e40d193db50bcd2fe1d595ccdecbfdeb7c189b99318c832816b09369";

  const REGIONS = Object.freeze([
    { id:"cascade-arrival-shimmerdeep", label:"Cascade Arrival - Shimmerdeep", kind:"arrival", bounds:[92,468,118,142], persistence:"route-anchor" },
    { id:"cascade-return-shimmerdeep", label:"Return to Shimmerdeep Shelf", kind:"travel", bounds:[18,474,92,170], persistence:"reusable", routeKey:"shimmerdeep-cascade" },
    { id:"cascade-arrival-fossil-deeps", label:"Cascade Arrival - Fossil Deeps", kind:"arrival", bounds:[1394,176,92,118], persistence:"route-anchor" },
    { id:"cascade-exit-fossil-deeps", label:"Passage to Fossil Deeps", kind:"travel", bounds:[1470,165,64,132], persistence:"reusable", routeKey:"cascade-fossil-deeps" },

    { id:"cascade-ore-common-01", label:"Exposed Iron Vein", kind:"ore", bounds:[1196,86,138,128], persistence:"mining-system", oreId:"iron" },

    { id:"cascade-fishing-plunge-01", label:"Upper Plunge Pool", kind:"fishing", bounds:[176,104,252,216], persistence:"fishing-system", biome:"underdark", pondTier:"common" },
    { id:"cascade-fishing-channel-02", label:"Central Channel", kind:"fishing", bounds:[548,382,322,188], persistence:"fishing-system", biome:"underdark", pondTier:"uncommon" },
    { id:"cascade-fishing-deep-03", label:"Lower Deep Basin", kind:"fishing", bounds:[827,518,390,268], persistence:"fishing-system", biome:"underdark", pondTier:"uncommon" },

    { id:"cascade-resource-glowcap-01", label:"Glowcap Island", kind:"renewable-resource", bounds:[1010,114,112,104], persistence:"per-character-long-rest", rewardFamily:"Glowcap Bundle" },
    { id:"cascade-resource-deepmoss-02", label:"Deepmoss Shelf", kind:"renewable-resource", bounds:[455,558,128,112], persistence:"per-character-long-rest", rewardFamily:"Deepmoss" },
    { id:"cascade-resource-clay-03", label:"Cave Clay Bank", kind:"renewable-resource", bounds:[1038,762,272,176], persistence:"per-character-long-rest", rewardFamily:"Cave Clay" },
    { id:"cascade-resource-shellbed-04", label:"Shallow Shell Bed", kind:"renewable-resource", bounds:[1196,568,172,136], persistence:"per-character-long-rest", rewardFamily:"Shell material" },

    { id:"cascade-salvage-washup-01", label:"Washed-Up Expedition Debris", kind:"salvage", bounds:[1320,326,126,112], persistence:"global-one-time", rewardFamily:"Expedition supplies" },

    { id:"cascade-discovery-crystal-01", label:"Resonant Crystal Nodule", kind:"discovery", bounds:[1190,42,128,112], persistence:"global-one-time", rewardFamily:"Resonant Crystal Nodule" },
    { id:"cascade-discovery-shellcase-02", label:"Unusual Shell Specimen", kind:"discovery", bounds:[1092,770,112,104], persistence:"global-one-time", rewardFamily:"Shell specimen" },
    { id:"cascade-discovery-cache-03", label:"Hidden Deep-Gnome Cache", kind:"discovery", bounds:[68,672,134,132], persistence:"global-one-time", rewardFamily:"Expedition cache" },

    { id:"cascade-creature-zone-crab-01", label:"Cave Crab Harvesting Margin", kind:"creature-harvest", bounds:[1270,606,166,134], persistence:"existing-harvest-contract" },

    { id:"cascade-environment-dry-shelf-01", label:"Dry Staging Shelf", kind:"environment", bounds:[764,198,238,154], persistence:"reusable" },
    { id:"cascade-environment-waterfall-path-02", label:"Waterfall Side Path", kind:"environment", bounds:[350,275,176,150], persistence:"reusable" }
  ]);

  const TELEPORTS = Object.freeze([
    {
      teleportId:"cascade-to-shimmerdeep",
      routeKey:"shimmerdeep-cascade",
      source:{ mapId:MAP_ID, sceneName:SCENE_NAME, regionId:"cascade-return-shimmerdeep" },
      destination:{ mapId:"shimmerdeep-shelf", sceneName:"Shimmerdeep Shelf", regionId:"shimmerdeep-arrival-cascade" }
    },
    {
      teleportId:"shimmerdeep-to-cascade",
      routeKey:"shimmerdeep-cascade",
      source:{ mapId:"shimmerdeep-shelf", sceneName:"Shimmerdeep Shelf", regionId:"shimmerdeep-exit-cascade" },
      destination:{ mapId:MAP_ID, sceneName:SCENE_NAME, regionId:"cascade-arrival-shimmerdeep" }
    },
    {
      teleportId:"cascade-to-fossil-deeps",
      routeKey:"cascade-fossil-deeps",
      source:{ mapId:MAP_ID, sceneName:SCENE_NAME, regionId:"cascade-exit-fossil-deeps" },
      destination:{ mapId:"fossil-deeps", sceneName:"Fossil Deeps", regionId:"fossil-arrival-cascade" }
    },
    {
      teleportId:"fossil-deeps-to-cascade",
      routeKey:"cascade-fossil-deeps",
      source:{ mapId:"fossil-deeps", sceneName:"Fossil Deeps", regionId:"fossil-return-cascade" },
      destination:{ mapId:MAP_ID, sceneName:SCENE_NAME, regionId:"cascade-arrival-fossil-deeps" }
    }
  ]);

  const contents = value => value?.contents ?? (value?.values ? Array.from(value.values()) : Array.from(value ?? []));
  const marker = doc => doc?.flags?.[SCOPE]?.[MANAGED_KEY] ?? null;
  const mapMarker = doc => doc?.flags?.[SCOPE]?.[MAP_KEY] ?? null;
  const regionSemanticId = doc =>
    marker(doc)?.semanticId
    ?? doc?.flags?.[SCOPE]?.regionId
    ?? doc?.flags?.[SCOPE]?.region?.regionId
    ?? null;

  function activeGm() {
    return Boolean(game.user?.isGM && game.users?.activeGM?.id && game.users.activeGM.id === game.user.id);
  }

  function runtimeGate() {
    const failed = [];
    if (game.version !== TARGET.foundryVersion) failed.push("Foundry " + TARGET.foundryVersion + " required; observed " + game.version + ".");
    if (game.system?.id !== TARGET.systemId || game.system?.version !== TARGET.systemVersion) {
      failed.push("D&D5e " + TARGET.systemVersion + " required; observed " + (game.system?.id ?? "unknown") + " " + (game.system?.version ?? "unknown") + ".");
    }
    if (!activeGm()) failed.push("Run as the elected active GM.");
    return failed;
  }

  function managed(kind, semanticId) {
    return {
      packageId: PACKAGE_ID,
      kind,
      semanticId,
      schemaVersion: "1.0.0",
      owner: SCOPE
    };
  }

  function sceneIsOwned(scene) {
    const m = marker(scene);
    return m?.owner === SCOPE && m?.packageId === PACKAGE_ID && m?.kind === "scene" && m?.semanticId === MAP_ID;
  }

  function regionIsOwned(region, semanticId) {
    const m = marker(region);
    return m?.owner === SCOPE && m?.packageId === PACKAGE_ID && m?.kind === "region" && m?.semanticId === semanticId;
  }

  const FoundryFilePicker = foundry.applications.apps.FilePicker.implementation;

  async function ensureRenderer() {
    const slash = RENDERER_PATH.lastIndexOf("/");
    const dir = RENDERER_PATH.slice(0, slash);
    const fileName = RENDERER_PATH.slice(slash + 1);

    try {
      const listing = await FoundryFilePicker.browse("data", dir);
      if (contents(listing?.files).some(path => String(path).endsWith("/" + fileName) || String(path) === RENDERER_PATH)) return RENDERER_PATH;
    } catch {}

    const segments = dir.split("/");
    let current = "";
    for (const segment of segments) {
      current = current ? current + "/" + segment : segment;
      try { await FoundryFilePicker.createDirectory("data", current); } catch {}
    }

    const picked = await new Promise(resolve => {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/webp,image/png,image/jpeg";
      input.style.display = "none";
      input.addEventListener("change", () => {
        const selected = input.files?.[0] ?? null;
        input.remove();
        resolve(selected);
      }, { once:true });
      document.body.appendChild(input);
      input.click();
    });

    if (!picked) throw new Error("Renderer selection cancelled. Choose the downloaded Cascade Hollows image from your Downloads folder.");

    const uploadFile = picked.name === fileName
      ? picked
      : new File([picked], fileName, { type: picked.type || "image/webp" });

    const uploaded = await FoundryFilePicker.upload("data", dir, uploadFile, {}, { notify:false });
    const uploadedPath = uploaded?.path ?? uploaded?.files?.[0] ?? null;
    if (!uploadedPath) throw new Error("Foundry did not report a renderer upload path.");

    return uploadedPath;
  }

  function resolveScene(ref) {
    const scenes = contents(game.scenes);
    const stable = scenes.filter(scene =>
      mapMarker(scene)?.mapId === ref.mapId
      || marker(scene)?.semanticId === ref.mapId
      || scene?.flags?.[SCOPE]?.mapId === ref.mapId
    );
    if (stable.length === 1) return { status:"resolved", scene:stable[0], method:"stable-metadata" };
    if (stable.length > 1) return { status:"ambiguous", scene:null, method:"stable-metadata", count:stable.length };
    const exact = scenes.filter(scene => scene.name === ref.sceneName);
    if (exact.length === 1) return { status:"resolved", scene:exact[0], method:"exact-name" };
    if (exact.length > 1) return { status:"ambiguous", scene:null, method:"exact-name", count:exact.length };
    return { status:"missing", scene:null, method:null, count:0 };
  }

  function resolveRegion(scene, regionId) {
    const regions = contents(scene?.regions);
    const stable = regions.filter(region => regionSemanticId(region) === regionId);
    if (stable.length === 1) return { status:"resolved", region:stable[0], method:"stable-metadata" };
    if (stable.length > 1) return { status:"ambiguous", region:null, method:"stable-metadata", count:stable.length };
    const localDef = REGIONS.find(r => r.id === regionId);
    const exact = regions.filter(region => region.name === regionId || (localDef && region.name === localDef.label));
    if (exact.length === 1) return { status:"resolved", region:exact[0], method:"exact-name" };
    if (exact.length > 1) return { status:"ambiguous", region:null, method:"exact-name", count:exact.length };
    return { status:"missing", region:null, method:null, count:0 };
  }

  async function upsertScene() {
    const scenes = contents(game.scenes);
    let scene = scenes.find(sceneIsOwned) ?? null;
    if (!scene) {
      const stableConflicts = scenes.filter(scene =>
        mapMarker(scene)?.mapId === MAP_ID
        || marker(scene)?.semanticId === MAP_ID
        || scene?.flags?.[SCOPE]?.mapId === MAP_ID
      );
      if (stableConflicts.length) throw new Error("Cascade mapId conflict. A non-owned scene already claims " + MAP_ID + ".");
      const nameConflicts = scenes.filter(scene => scene.name === SCENE_NAME);
      if (nameConflicts.length) throw new Error('Foreign/manual scene named "' + SCENE_NAME + '" already exists. Refusing to overwrite it.');
      const SceneClass = foundry?.documents?.Scene ?? globalThis.Scene;
      scene = await SceneClass.create({
        name: SCENE_NAME,
        width: 1536,
        height: 1024,
        padding: 0,
        backgroundColor: "#080b10",
        background: { src: RENDERER_PATH },
        grid: { type: 0, size: 64, distance: 5, units: "ft" },
        flags: {
          [SCOPE]: {
            [MANAGED_KEY]: managed("scene", MAP_ID),
            [MAP_KEY]: {
              mapId: MAP_ID,
              packageId: PACKAGE_ID,
              rendererPath: RENDERER_PATH,
              rendererSha256: RENDERER_SHA256,
              branch: "Northwest / Shimmerdeep Reach"
            }
          }
        }
      }, { renderSheet:false });
      return { action:"created", scene };
    }

    await scene.update({
      name: SCENE_NAME,
      width: 1536,
      height: 1024,
      padding: 0,
      backgroundColor: "#080b10",
      "background.src": RENDERER_PATH,
      "grid.type": 0,
      ["flags." + SCOPE + "." + MANAGED_KEY]: managed("scene", MAP_ID),
      ["flags." + SCOPE + "." + MAP_KEY]: {
        mapId: MAP_ID,
        packageId: PACKAGE_ID,
        rendererPath: RENDERER_PATH,
        rendererSha256: RENDERER_SHA256,
        branch: "Northwest / Shimmerdeep Reach"
      }
    });
    return { action:"updated", scene };
  }

  function regionSource(definition) {
    const [x,y,width,height] = definition.bounds;
    return {
      name: definition.label,
      shapes: [{ type:"rectangle", x, y, width, height, rotation:0 }],
      elevation: { bottom:null, top:null },
      color: "#2a9d8f",
      flags: {
        [SCOPE]: {
          [MANAGED_KEY]: managed("region", definition.id),
          exploration: {
            mapId: MAP_ID,
            regionId: definition.id,
            kind: definition.kind,
            persistence: definition.persistence,
            routeKey: definition.routeKey ?? null,
            rewardFamily: definition.rewardFamily ?? null,
            status: ["fishing","ore"].includes(definition.kind) ? "system-managed" : "managed-placeholder"
          }
        }
      }
    };
  }

  async function upsertRegions(scene) {
    const byId = new Map();
    let created = 0;
    let updated = 0;
    for (const def of REGIONS) {
      const owned = contents(scene.regions).filter(region => regionIsOwned(region, def.id));
      if (owned.length > 1) throw new Error("Duplicate owned Cascade Region: " + def.id + ".");
      let region = owned[0] ?? null;
      if (!region) {
        const createdDocs = await scene.createEmbeddedDocuments("Region", [regionSource(def)]);
        region = createdDocs[0];
        created += 1;
      } else {
        const [x,y,width,height] = def.bounds;
        await scene.updateEmbeddedDocuments("Region", [{
          _id: region.id,
          name: def.label,
          shapes: [{ type:"rectangle", x, y, width, height, rotation:0 }],
          elevation: { bottom:null, top:null },
          color: "#2a9d8f",
          ["flags." + SCOPE + "." + MANAGED_KEY]: managed("region", def.id),
          ["flags." + SCOPE + ".exploration"]: {
            mapId: MAP_ID,
            regionId: def.id,
            kind: def.kind,
            persistence: def.persistence,
            routeKey: def.routeKey ?? null,
            rewardFamily: def.rewardFamily ?? null,
            status: ["fishing","ore"].includes(def.kind) ? "system-managed" : "managed-placeholder"
          }
        }]);
        region = scene.regions.get(region.id) ?? region;
        updated += 1;
      }
      byId.set(def.id, region);
    }
    return { created, updated, byId };
  }

  async function configureSystems(byId) {
    const result = { fishing:[], mining:[], blockers:[] };

    const fishingModule = game.modules.get("regionwright-fishing");
    const fishingApi = fishingModule?.active ? fishingModule.api : null;
    for (const def of REGIONS.filter(region => region.kind === "fishing")) {
      const region = byId.get(def.id);
      if (!fishingApi?.inject) {
        result.blockers.push("Fishing API unavailable for " + def.id + ".");
        continue;
      }
      await fishingApi.inject({ region, biome:def.biome, pondTier:def.pondTier });
      result.fishing.push({ regionId:def.id, biome:def.biome, pondTier:def.pondTier });
    }

    const miningModule = game.modules.get("regionwright-mining");
    const miningApi = miningModule?.active ? miningModule.api : null;
    for (const def of REGIONS.filter(region => region.kind === "ore")) {
      const region = byId.get(def.id);
      if (!miningApi?.configureRegion) {
        result.blockers.push("Mining API unavailable for " + def.id + ".");
        continue;
      }
      await miningApi.configureRegion({ region, oreId:def.oreId });
      result.mining.push({ regionId:def.id, oreId:def.oreId });
    }

    return result;
  }

  function teleportBehaviorData(spec, destinationUuid) {
    return {
      name: "Dicebox: " + spec.teleportId,
      type: "teleportToken",
      disabled: false,
      system: {
        destinations: [destinationUuid],
        placement: "center",
        snap: true,
        choice: false,
        revealed: false,
        dialog: { revealed:null, unrevealed:null },
        transition: { type:null, duration:1500 }
      },
      flags: {
        [SCOPE]: {
          [TELEPORT_KEY]: {
            packageId: PACKAGE_ID,
            teleportId: spec.teleportId,
            routeKey: spec.routeKey,
            fromRegionId: spec.source.regionId,
            toRegionId: spec.destination.regionId
          }
        }
      }
    };
  }

  async function upsertTeleportBehavior(sourceRegion, spec, destinationRegion) {
    const behaviors = contents(sourceRegion.getEmbeddedCollection?.("RegionBehavior") ?? sourceRegion.behaviors);
    const owned = behaviors.filter(behavior =>
      behavior?.flags?.[SCOPE]?.[TELEPORT_KEY]?.packageId === PACKAGE_ID
      && behavior?.flags?.[SCOPE]?.[TELEPORT_KEY]?.teleportId === spec.teleportId
    );
    if (owned.length > 1) throw new Error("Duplicate owned teleport behavior: " + spec.teleportId + ".");
    const data = teleportBehaviorData(spec, destinationRegion.uuid);
    if (owned[0]) {
      await sourceRegion.updateEmbeddedDocuments("RegionBehavior", [{ _id:owned[0].id, ...data }]);
      return "updated";
    }
    await sourceRegion.createEmbeddedDocuments("RegionBehavior", [data]);
    return "created";
  }

  async function bindTeleport(spec) {
    const sourceSceneResult = resolveScene(spec.source);
    const destinationSceneResult = resolveScene(spec.destination);
    if (sourceSceneResult.status !== "resolved" || destinationSceneResult.status !== "resolved") {
      return {
        teleportId: spec.teleportId,
        status:"unlinked",
        sourceScene: sourceSceneResult.status,
        destinationScene: destinationSceneResult.status
      };
    }
    const sourceRegionResult = resolveRegion(sourceSceneResult.scene, spec.source.regionId);
    const destinationRegionResult = resolveRegion(destinationSceneResult.scene, spec.destination.regionId);
    if (sourceRegionResult.status !== "resolved" || destinationRegionResult.status !== "resolved") {
      return {
        teleportId: spec.teleportId,
        status:"unlinked",
        sourceRegion: sourceRegionResult.status,
        destinationRegion: destinationRegionResult.status
      };
    }
    const action = await upsertTeleportBehavior(sourceRegionResult.region, spec, destinationRegionResult.region);
    return {
      teleportId: spec.teleportId,
      status:"linked",
      action,
      sourceRegionUuid:sourceRegionResult.region.uuid,
      destinationRegionUuid:destinationRegionResult.region.uuid
    };
  }

  async function reread(scene) {
    const current = game.scenes.get(scene.id) ?? scene;
    const ownedRegions = contents(current.regions).filter(region => {
      const m = marker(region);
      return m?.owner === SCOPE && m?.packageId === PACKAGE_ID && m?.kind === "region";
    });
    const missing = REGIONS.filter(def => !ownedRegions.some(region => marker(region)?.semanticId === def.id)).map(def => def.id);
    return {
      sceneId: current.id,
      sceneUuid: current.uuid,
      sceneName: current.name,
      mapId: mapMarker(current)?.mapId ?? marker(current)?.semanticId ?? null,
      rendererPath: current.background?.src ?? current._source?.background?.src ?? null,
      ownedRegionCount: ownedRegions.length,
      expectedRegionCount: REGIONS.length,
      missingRegionIds: missing
    };
  }

  const failedGate = runtimeGate();
  if (failedGate.length) throw new Error(failedGate.join("\n"));
  await ensureRenderer();

  const sceneResult = await upsertScene();
  const regionResult = await upsertRegions(sceneResult.scene);
  const systems = await configureSystems(regionResult.byId);

  const teleports = [];
  for (const spec of TELEPORTS) teleports.push(await bindTeleport(spec));

  const final = await reread(sceneResult.scene);
  if (final.missingRegionIds.length) throw new Error("Cascade reread missing Regions: " + final.missingRegionIds.join(", "));
  if (final.ownedRegionCount !== REGIONS.length) throw new Error("Cascade reread count drift: " + final.ownedRegionCount + "/" + REGIONS.length + ".");

  const receipt = Object.freeze({
    operation:"dicebox.underdark-map.install",
    status: systems.blockers.length ? "PASS_WITH_BLOCKERS" : "PASS",
    evidenceClass:"target-bound-runtime-readback",
    liveVerified:true,
    packageId:PACKAGE_ID,
    mapId:MAP_ID,
    target:TARGET,
    renderer:{ path:RENDERER_PATH, sha256:RENDERER_SHA256 },
    scene:{ action:sceneResult.action, id:final.sceneId, uuid:final.sceneUuid, name:final.sceneName },
    regions:{ created:regionResult.created, updated:regionResult.updated, expected:REGIONS.length, reread:final.ownedRegionCount },
    systems,
    teleports,
    preservation:"Only Dicebox-managed Cascade documents and exact approved route endpoints are mutated. Foreign/manual scene state is preserved."
  });

  console.log("Cascade Hollows install receipt", receipt);
  ui.notifications.info("Cascade Hollows: " + receipt.status + ". " + REGIONS.length + " managed Regions reread.");
  return receipt;
})();