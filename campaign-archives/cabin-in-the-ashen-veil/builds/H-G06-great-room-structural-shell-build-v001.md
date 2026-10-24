# H-G06 Great Room — structural-only Scene Injector BUILD v2

This single macro installs one **provisional tactical test shell** based on the approved Great Room artwork. It creates one Level, eight structural perimeter Walls and five named inert Regions. No RegionBehaviors, teleports, puzzle logic, locks, rewards or tokens are created. The Candidate B physical dimensions remain provisional until house-wide reconciliation; the scene is marked accordingly.

```javascript
// DICEBOX_BUILD_CONTRACT: dicebox-scene-injector-build/v2
// DICEBOX_SINGLE_MACRO: true
// DICEBOX_SCENE_ID: CAVHG06GreatRoom
// DICEBOX_ART_MODE: verified-path
// DICEBOX_WORKFLOW: PREPARE -> RENDER -> INSPECT(PASS=APPROVED) -> BUILD
// DICEBOX_SCALE_PROFILE: battlemap-120
// DICEBOX_GRID_TYPE: gridless
// DICEBOX_GRID_SIZE: 120
// DICEBOX_GRID_DISTANCE: 5
// DICEBOX_GRID_UNITS: ft
// DICEBOX_LOGICAL_SIZE: 7x8
// DICEBOX_SCENE_PIXELS: 840x960
// DICEBOX_TOKEN_FOOTPRINT_POLICY: system-size
// DICEBOX_TOKEN_ART_SCALE_POLICY: visual-only
// DICEBOX_GEOMETRY_TOLERANCE_PROFILE: dicebox-geometry-tolerance/v0.1
// DICEBOX_DISCOVERY_CONTRACT: dicebox-discovery/v1
// DICEBOX_DISCOVERY_COUNT: 0
// DICEBOX_DISCOVERY_DENSITY: ordinary
// DICEBOX_DISCOVERY_VISIBLE_ANCHORS: true
// DICEBOX_DISCOVERY_NOTICE_POLICY: flat-d20-no-modifiers
// DICEBOX_DISCOVERY_NOTICE_STATE: per-character-once-until-reset
// H-G06 PHASE-1 STRUCTURAL TEST, NOT FINAL PHYSICAL HOUSE BLUEPRINT.
// Expected Foundry: 14.367, DND5e 5.3.3; no RegionBehaviors or puzzles.
// Owner request: install approved image, Walls and only named inert Regions.
(async () => {
  const SPEC = Object.freeze({
    world: "cabin-in-the-ashen-veil",
    origin: "http://127.0.0.1:30000",
    sceneId: "CAVHG06GreatRoom",
    sceneName: "H-G06 - Great Room",
    levelId: "defaultLevel0000",
    art: "Maps/cabin-in-the-ashen-veil/h-g06-great-room-owner-approved.png",
    artSha256: "c7e5305718d5aea1ddbcd374d0374f51b714bf6d860adf0cc0aabb3a29a4f0ee",
    artBytes: 2800071,
    artWidth: 1173,
    artHeight: 1341,
    specVersion: "cav-h-g06-structural-shell-v001"
  });
  const DICEBOX_SCENE_SCALE = Object.freeze({
    gridType: 0,
    gridSize: 120,
    distance: 5,
    units: "ft",
    logicalColumns: 7,
    logicalRows: 8,
    width: 840,
    height: 960
  });
  const wallLines = Object.freeze([
    [55,42,362,42],
    [510,42,780,42],
    [55,42,55,339],
    [55,522,55,864],
    [780,42,780,339],
    [780,522,780,864],
    [55,864,336,864],
    [511,864,780,864]
  ]);
  const regionDefs = Object.freeze([
    ["Foyer Doorway", [329,806,510,806,510,877,329,877], "H-G02"],
    ["Dining Room Doorway", [47,335,140,335,140,532,47,532], "H-G01"],
    ["Allen Study Doorway", [703,335,787,335,787,531,703,531], "H-G05"],
    ["Rear Family Room Doorway", [347,34,515,34,515,120,347,120], "H-G09"],
    ["Upstairs Staircase", [648,85,742,85,742,448,648,448], "H-U02"]
  ]);
  const result = {operation: "cav.h-g06.structural-shell-install", version: SPEC.specVersion,
    status: "BLOCKED", sceneId: SPEC.sceneId, world: SPEC.world, created: false,
    artSha256: SPEC.artSha256, wallCount: 0, regionCount: 0, regionBehaviorCount: 0,
    provisionalGeometry: true, warnings: [
      "35x40-ft Candidate B is a reversible tactical test scale, not an owner-approved house-wide blueprint.",
      "Cardinal passages and upstairs landing are named and INERT; no teleport/lock/puzzle logic is installed."
    ]};
  const send = () => {
    console.log("[DICEBOX_HG06_INSTALL_RECEIPT] " + JSON.stringify(result));
    if (globalThis.ui?.notifications) ui.notifications[result.created ? "info" : "warn"](
      result.created ? "H-G06 Great Room structural shell installed (5 inert Regions)." :
        "H-G06 installation BLOCKED; review console receipt.");
  };
  try {
    if (location.origin !== SPEC.origin || location.pathname !== "/game" ||
        !game?.ready || game.world?.id !== SPEC.world ||
        game.user?.isGM !== true || !game.users?.activeGM ||
        game.users.activeGM.id !== game.user.id) {
      result.reason = "Exact-origin/world/ready/elected-active-GM permission gate not satisfied";
      send(); return;
    }
    if (game.version !== "14.367" || game.system?.id !== "dnd5e" || game.system?.version !== "5.3.3") {
      result.reason = "Foundry/system runtime not the verified target";
      send(); return;
    }
    const existing = game.scenes.get(SPEC.sceneId) ??
      game.scenes.contents.find(s => s.getFlag("dicebox-campaign-helper","cavStructuralSceneKey") === "H-G06");
    if (existing) {
      result.status = "BLOCKED_ALREADY_EXISTS";
      result.reason = "Existing managed Scene found; never auto-overwrite or duplicate";
      result.existingId = existing.id;
      send(); return;
    }
    const artResponse = await fetch("/" + SPEC.art, {method:"GET", cache:"no-store"});
    if (!artResponse.ok) throw Error("Verified art missing: HTTP "+artResponse.status);
    const bytes = new Uint8Array(await artResponse.arrayBuffer());
    const dv = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    if (bytes.length !== SPEC.artBytes ||
        bytes[0] !== 137 || bytes[1] !== 80 || bytes[2] !== 78 || bytes[3] !== 71 ||
        dv.getUint32(16, false) !== SPEC.artWidth || dv.getUint32(20, false) !== SPEC.artHeight)
      throw Error("PNG byte-length, signature or intrinsic dimensions mismatch");
    if (!globalThis.crypto?.subtle) throw Error("Browser WebCrypto unavailable; cannot verify art");
    const hashBuf = await crypto.subtle.digest("SHA-256", bytes);
    const hash = [...new Uint8Array(hashBuf)].map(x => x.toString(16).padStart(2,"0")).join("");
    if (hash !== SPEC.artSha256) throw Error("Approved-art SHA256 mismatch");
    result.artVerified = true;
    const walls = wallLines.map((c,i) => ({
      _id: "CAV06W" + String(i+1).padStart(10,"0"),
      c: [...c],
      levels: [SPEC.levelId],
      flags: {"dicebox-campaign-helper": {objectKey: "cav:h-g06:perimeter-wall:"+(i+1)}}
    }));
    const regions = regionDefs.map(([name,points,destination],i) => ({
      _id: "CAV06R" + String(i+1).padStart(10,"0"),
      name: "H-G06 - " + name,
      levels: [SPEC.levelId],
      shapes: [{type:"polygon",points:[...points]}],
      behaviors: [],
      flags: {"dicebox-campaign-helper": {
        objectKey:"cav:h-g06:region:"+(i+1), intendedDestination: destination,
        inertUntilPuzzleAndTransitionPhase:true
      }}
    }));
    if (regions.some(x => x.behaviors.length !== 0) || walls.length !== 8 || regions.length !== 5)
      throw Error("Unexpected managed-object roster");
    for (const c of [[362,510],[339,522],[339,522],[336,511]]) {
      if ((c[1]-c[0]) < DICEBOX_SCENE_SCALE.gridSize) throw Error("Passage aperture under 5ft");
    }
    const sceneData = {
      _id: SPEC.sceneId,
      name: SPEC.sceneName,
      width: DICEBOX_SCENE_SCALE.width,
      height: DICEBOX_SCENE_SCALE.height,
      padding: 0,
      grid: {
        type: DICEBOX_SCENE_SCALE.gridType,
        size: DICEBOX_SCENE_SCALE.gridSize,
        distance: DICEBOX_SCENE_SCALE.distance,
        units: DICEBOX_SCENE_SCALE.units
      },
      levels: [{
        _id: SPEC.levelId, name:"Ground Floor",
        elevation:{bottom:0,top:20},
        background:{src:SPEC.art}
      }],
      initialLevel: SPEC.levelId,
      navigation: true,
      active: false,
      walls, regions,
      flags: {"dicebox-campaign-helper": {
        cavStructuralSceneKey:"H-G06",
        phase:"STRUCTURAL_SHELL_TEST",
        specVersion:SPEC.specVersion,
        approvedArtSha256:SPEC.artSha256,
        geometryStatus:"PROVISIONAL_CANDIDATE_B_NOT_CANON",
        discoveryCount:0, regionBehaviorCount:0,
        ownerPuzzleDeferral:true
      }}
    };
    const Cls = CONFIG.Scene.documentClass;
    const probe = new Cls(sceneData);
    probe.validate({strict:true});
    if (probe.levels.size !== 1 || probe.walls.size !== 8 || probe.regions.size !== 5 ||
        probe.levels.contents[0]?.id !== SPEC.levelId ||
        probe.levels.contents[0]?.background.src !== SPEC.art ||
        probe.regions.contents.some(r => r.behaviors.size !== 0))
      throw Error("Native unsaved Scene/Level/Wall/Region validation failed");
    if (game.scenes.get(SPEC.sceneId)) throw Error("Scene appeared before commit; no mutation attempted");
    const created = await Cls.create(sceneData,{keepId:true});
    result.created = Boolean(created?.id === SPEC.sceneId);
    const reread = game.scenes.get(SPEC.sceneId);
    if (!reread) throw Error("Creation returned without authoritative collection readback");
    result.sceneUuid = reread.uuid;
    result.wallCount = reread.walls.size;
    result.regionCount = reread.regions.size;
    result.regionBehaviorCount = reread.regions.contents.reduce((s,r) => s+r.behaviors.size,0);
    result.assetPath = reread.levels.contents[0]?.background.src;
    result.levelCount = reread.levels.size;
    result.grid = {type:reread.grid.type, size:reread.grid.size,
      distance:reread.grid.distance, units:reread.grid.units};
    result.regionNames = reread.regions.contents.map(r=>r.name);
    result.status = result.created &&
      result.levelCount === 1 && result.wallCount === 8 &&
      result.regionCount === 5 && result.regionBehaviorCount === 0 &&
      result.assetPath === SPEC.art &&
      reread.width === DICEBOX_SCENE_SCALE.width &&
      reread.height === DICEBOX_SCENE_SCALE.height
      ? "READY_WITH_WARNINGS" : "FAILED_REREAD";
    if(result.status !== "READY_WITH_WARNINGS") {
      result.reason = "Persisted Scene does not match expected shell; inspect manually, do not retry";
    }
  } catch(e) {
    result.status = result.created ? "OUTCOME_NEEDS_REREAD" : "BLOCKED_OR_UNKNOWN";
    result.reason = String(e?.message ?? e).slice(0,500);
    const readback = game.scenes.get(SPEC.sceneId);
    if (readback) {
      result.created = true; result.sceneUuid = readback.uuid;
      result.wallCount=readback.walls.size; result.regionCount=readback.regions.size;
      result.regionBehaviorCount=readback.regions.contents.reduce((n,r)=>n+r.behaviors.size,0);
      result.status="OUTCOME_NEEDS_REREAD";
    }
  }
  send();
})();
```
