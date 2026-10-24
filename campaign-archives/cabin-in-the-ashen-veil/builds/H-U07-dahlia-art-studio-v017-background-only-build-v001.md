# H-U07 Dahlia's Studio — approved V017 image-only Foundry Scene BUILD v001

**Status: BUILT AS SOURCE; NOT EXECUTED; NOT NATIVE-VALIDATED.** Authored after visual PASS of V017 approved PNG; current exact Foundry runtime `/game` context is not available via the installed CDP harness because `127.0.0.1:9224` is not listening. The approved binary is currently in connected private Drive and NOT present under the expected Foundry Data path. **Do not run** before transferring that exact SHA-approved asset and verifying the elected GM/world.

**Boundaries:** Standalone scene `CAVHU07ArtStudio` with one Level and approved background, zero Walls, zero Regions/RegionBehaviors and no teleports, puzzles, rewards, tokens, system Item changes or player Macros. This is a GM-only one-paste installer command; gameplay scripting occurs separately after source puzzle continuity and manual geometry. Scene scale is deliberately **provisional**, with no statement that 1536x1024 art pixels are approved physical feet. Native scene dimensions set to intrinsic 1536x1024 to preserve image ratio.

**Owner source:** [Approved V017 exact image receipt](../render-attempts/h-u07-single-render-v017-final-art-pass-2026-10-24.md). Sha256 `67c9e5c84ff120d65600648ddb014e30a00f1ec6226c6e309e994db54aab4704`, width 1536, height 1024, 2,888,738 bytes.

**Safety:** This installer blocks unexpected location/origin/world/active GM/runtime, unexpected existing H-U07 Scene, missing/altered asset, schema mismatch. It checks source PNG over native same-origin fetch and SHA-256, creates only a single Scene and re-reads its persisted state. Native writes are not attempted on any other Scene or Actor. If a commit outcome is uncertain, inspect world records; NEVER replay blindly.

```javascript
// DICEBOX_BUILD_CONTRACT: dicebox-scene-injector-build/v2
// DICEBOX_SINGLE_MACRO: true
// DICEBOX_SCENE_ID: CAVHU07ArtStudio
// DICEBOX_ART_MODE: verified-path
// DICEBOX_WORKFLOW: PREPARE -> RENDER -> INSPECT(FINAL PASS) -> BUILD
// DICEBOX_SCALE_PROFILE: battlemap-120-provisional
// DICEBOX_GRID_TYPE: gridless
// DICEBOX_GRID_SIZE: 120
// DICEBOX_GRID_DISTANCE: 5
// DICEBOX_GRID_UNITS: ft
// DICEBOX_SCENE_PIXELS: 1536x1024
// DICEBOX_LOGICAL_SIZE: provisional-unmeasured
// DICEBOX_DISCOVERY_CONTRACT: dicebox-discovery/v1
// DICEBOX_DISCOVERY_COUNT: 0
// H-U07 V017: approved visual background only; no owner-drawn walls or puzzle content in this build.
// Native installer is GM-only tooling, NOT a player-executed Macro.
(async () => {
  const SPEC = Object.freeze({
    world: "cabin-in-the-ashen-veil",
    origin: "http://127.0.0.1:30000",
    sceneId: "CAVHU07ArtStudio",
    sceneName: "H-U07 - Dahlia's Art Studio",
    sceneKey: "H-U07",
    levelId: "defaultLevel0000",
    image: "Maps/cabin-in-the-ashen-veil/h-u07-dahlia-art-studio-approved-v017-2026-10-24.png",
    imageSha256: "67c9e5c84ff120d65600648ddb014e30a00f1ec6226c6e309e994db54aab4704",
    imageBytes: 2888738,
    imageWidth: 1536,
    imageHeight: 1024,
    buildVersion: "cav-h-u07-approved-background-only-v001"
  });
  const receipt = {
    operation: "cav.h-u07.approved-background-only.build-v001",
    version: SPEC.buildVersion,
    status: "BLOCKED",
    created: false,
    world: SPEC.world,
    sceneId: SPEC.sceneId,
    imageSha256: SPEC.imageSha256,
    intendedWallCount: 0,
    intendedRegionCount: 0,
    regionBehaviorCount: 0,
    warnings: [
      "Image-only shell: no native collision walls, doorway Regions, puzzle items, teleports, actors or scripts.",
      "House-wide physical scale and portal coordinates remain unmeasured and unapproved.",
      "The hidden eastern H-U08 Workshop is a later prayer-gated, separate Scene."
    ]
  };
  function emit() {
    console.log("[DICEBOX_HU07_APPROVED_BACKGROUND_BUILD] " + JSON.stringify(receipt));
  }
  try {
    if (location.origin !== SPEC.origin ||
        location.pathname !== "/game" ||
        !game?.ready || game.world?.id !== SPEC.world ||
        game.user?.isGM !== true ||
        game.users?.activeGM?.id !== game.user.id) {
      receipt.reason = "Exact Foundry origin/world/ready/elected-GM requirement failed";
      emit(); return;
    }
    if (game.version !== "14.367" || game.system?.id !== "dnd5e" ||
        game.system?.version !== "5.3.3") {
      receipt.reason = "Foundry or dnd5e runtime differs from validated target";
      emit(); return;
    }
    const existing = game.scenes.get(SPEC.sceneId) ??
      game.scenes.contents.find(s =>
        s.getFlag("dicebox-campaign-helper", "cavStructuralSceneKey") === SPEC.sceneKey ||
        s.name === SPEC.sceneName || /H.U07.*(?:Dahlia|Art Studio)/i.test(s.name));
    if (existing) {
      receipt.status = "BLOCKED_ALREADY_EXISTS";
      receipt.reason = "Scene name, canonical key or ID already exists; never overwrite/duplicate owner work";
      receipt.existingSceneId = existing.id;
      emit(); return;
    }
    const asset = await fetch("/" + SPEC.image, {method:"GET",cache:"no-store"});
    if (!asset.ok || !(asset.headers.get("content-type") ?? "").includes("image/png")) {
      receipt.reason = "Native Foundry asset is unavailable or not PNG";
      receipt.assetHttpStatus = asset.status;
      emit(); return;
    }
    const bin = new Uint8Array(await asset.arrayBuffer());
    const view = new DataView(bin.buffer,bin.byteOffset,bin.byteLength);
    const isPng = bin.length >= 24 && bin[0] === 137 && bin[1] === 80 &&
      bin[2] === 78 && bin[3] === 71 &&
      view.getUint32(16,false) === SPEC.imageWidth &&
      view.getUint32(20,false) === SPEC.imageHeight;
    if (!isPng || bin.length !== SPEC.imageBytes) {
      receipt.reason = "Approved PNG byte count/header/image dimensions mismatch";
      receipt.servedBytes = bin.length;
      emit(); return;
    }
    if (!globalThis.crypto?.subtle) {
      receipt.reason = "WebCrypto digest unavailable";
      emit(); return;
    }
    const digest = await crypto.subtle.digest("SHA-256",bin);
    const sha = [...new Uint8Array(digest)]
      .map(x=>x.toString(16).padStart(2,"0")).join("");
    if (sha !== SPEC.imageSha256) {
      receipt.reason = "Approved source SHA-256 mismatch";
      receipt.servedSha256 = sha;
      emit(); return;
    }
    receipt.assetVerified = true;
    const data = {
      _id: SPEC.sceneId,
      name: SPEC.sceneName,
      width: SPEC.imageWidth,
      height: SPEC.imageHeight,
      padding: 0,
      grid: {type:0,size:120,distance:5,units:"ft"},
      levels: [{
        _id: SPEC.levelId,
        name: "Upper Floor",
        elevation:{bottom:0,top:20},
        background:{src:SPEC.image}
      }],
      initialLevel: SPEC.levelId,
      navigation: true,
      active: false,
      walls: [],
      regions: [],
      flags: {"dicebox-campaign-helper": {
        cavStructuralSceneKey: SPEC.sceneKey,
        phase: "ART_APPROVED_BACKGROUND_ONLY",
        approvedArtSha256: SPEC.imageSha256,
        buildVersion: SPEC.buildVersion,
        visualStatus: "OWNER_DELEGATED_FINAL_ART_PASS",
        geometryStatus: "AWAITING_MANUAL_WALLS_AND_OWNER_SCALE_SURVEY",
        portalStatus: "H-U02_WEST_NOT_IMPLEMENTED",
        hiddenWorkshopStatus: "H-U08_EAST_PRAYER_GATE_NOT_IMPLEMENTED",
        regionBehaviorCount: 0,
        discoveryCount: 0
      }}
    };
    const Cls = CONFIG.Scene.documentClass;
    const probe = new Cls(data);
    probe.validate({strict:true});
    if (probe.levels.size !== 1 || probe.walls.size !== 0 || probe.regions.size !== 0 ||
        probe.levels.contents[0]?.id !== SPEC.levelId ||
        probe.levels.contents[0]?.background.src !== SPEC.image)
      throw Error("Native precommit Scene/Level schema verification failed");
    if (game.scenes.get(SPEC.sceneId))
      throw Error("Scene appeared during source verification; abort");
    receipt.status = "COMMIT_IN_PROGRESS";
    const made = await Cls.create(data,{keepId:true});
    receipt.created = made?.id === SPEC.sceneId;
    const s = game.scenes.get(SPEC.sceneId);
    if (!s) throw Error("Scene create returned without authoritative world collection readback");
    receipt.sceneUuid = s.uuid;
    receipt.sceneIdReadback = s.id;
    receipt.levelCount = s.levels.size;
    receipt.wallCount = s.walls.size;
    receipt.regionCount = s.regions.size;
    receipt.regionBehaviorCount = s.regions.contents.reduce((n,r)=>n+r.behaviors.size,0);
    receipt.backgroundReadback = s.levels.contents[0]?.background?.src ?? null;
    receipt.gridReadback = {type:s.grid.type,size:s.grid.size,distance:s.grid.distance,units:s.grid.units};
    receipt.dimensions = {width:s.width,height:s.height};
    receipt.status =
      receipt.created && s.width === SPEC.imageWidth && s.height === SPEC.imageHeight &&
      receipt.levelCount === 1 && receipt.wallCount === 0 && receipt.regionCount === 0 &&
      receipt.regionBehaviorCount === 0 && receipt.backgroundReadback === SPEC.image
      ? "CREATED_VERIFIED_BACKGROUND_ONLY" : "OUTCOME_NEEDS_REREAD";
    if(receipt.status !== "CREATED_VERIFIED_BACKGROUND_ONLY")
      receipt.reason = "Readback mismatch; preserve scene for investigation rather than replaying create";
  } catch(err) {
    receipt.reason = String(err?.message??err).slice(0,400);
    const already = game?.scenes?.get(SPEC.sceneId);
    if (already) {
      receipt.status = "OUTCOME_NEEDS_REREAD";
      receipt.created = true;
      receipt.sceneUuid = already.uuid;
    } else if(receipt.status === "COMMIT_IN_PROGRESS") {
      receipt.status = "OUTCOME_UNKNOWN_CHECK_NATIVE_BEFORE_RETRY";
    } else {
      receipt.status = "BLOCKED_BEFORE_COMMIT";
    }
  }
  emit();
})();
```

**Native checklist once the Foundry login and exact asset exist:**
1. Verify Foundry 14.367 / dnd5e 5.3.3 / elected active GM / exact world `cabin-in-the-ashen-veil`. Re-read all H-U07-like Scene names and flags (owner may have installed content independently).
2. Transfer the unchanged approved V017 PNG into `Maps/cabin-in-the-ashen-veil/h-u07-dahlia-art-studio-approved-v017-2026-10-24.png`, preserving identical byte count and SHA256.
3. Execute the build source once in authorized GM console/session only; capture its one-line `[DICEBOX_HU07_APPROVED_BACKGROUND_BUILD]` native receipt.
4. Verify in-game Scene, one Upper Floor Level/background, art checksum, and still zero Walls/Regions/Behaviors.
5. Separate owner/manual Wall/door and scale verification stage, then approved interactive puzzle compilation/test, including two distinct Sune prayers, `027` clue, Mirror and one-time rewards. Do not mark PLAYTESTED before actual non-GM tests.

**Next action if asset transfer/browser unavailable:** keep status `BUILD_SOURCE_STAGED_NO_WORLD_WRITE` and re-probe next turn, rather than substitute a different image or temporarily broaden file sharing.
