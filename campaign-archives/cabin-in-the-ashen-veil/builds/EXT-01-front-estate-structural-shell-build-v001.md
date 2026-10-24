# EXT-01 — Carriage Yard / Blackwood Cabin Front — structural-only BUILD

Single native Foundry Scene injector macro for owner inspection. Source is the v10 approved playable archive edition (SHA256 d957...), not the separately accepted fresher carriage-yard image (SHA256 5284...). Do not represent its 300 × 200 ft exterior geometry as locked canon. Adds 21 basic Wall objects, including one native foyer door and one native locked maze gate, plus eight inert named Regions. No RegionBehaviors or puzzles.

```javascript
// DICEBOX_BUILD_CONTRACT: dicebox-scene-injector-build/v2
// DICEBOX_SINGLE_MACRO: true
// DICEBOX_SCENE_ID: CAVEXT01Yard0001
// DICEBOX_ART_MODE: verified-path
// DICEBOX_WORKFLOW: PREPARE -> RENDER -> INSPECT(PASS=APPROVED) -> BUILD
// DICEBOX_SCALE_PROFILE: battlemap-120
// DICEBOX_GRID_TYPE: gridless
// DICEBOX_GRID_SIZE: 120
// DICEBOX_GRID_DISTANCE: 5
// DICEBOX_GRID_UNITS: ft
// DICEBOX_LOGICAL_SIZE: 60x40
// DICEBOX_SCENE_PIXELS: 7200x4800
// DICEBOX_TOKEN_FOOTPRINT_POLICY: system-size
// DICEBOX_TOKEN_ART_SCALE_POLICY: visual-only
// DICEBOX_GEOMETRY_TOLERANCE_PROFILE: dicebox-geometry-tolerance/v0.1
// DICEBOX_DISCOVERY_CONTRACT: dicebox-discovery/v1
// DICEBOX_DISCOVERY_COUNT: 0
// DICEBOX_DISCOVERY_DENSITY: ordinary
// DICEBOX_DISCOVERY_VISIBLE_ANCHORS: true
// DICEBOX_DISCOVERY_NOTICE_POLICY: flat-d20-no-modifiers
// DICEBOX_DISCOVERY_NOTICE_STATE: per-character-once-until-reset
// EXT-01 front estate — structure-only canary, archived approved visual-pass edition.
// This is NOT an assertion that later fresh-accepted Carriage Yard art was deployed.
// 300x200-ft projection and region/wall coordinates are PROVISIONAL until owner inspection.
(async () => {
  const SPEC = Object.freeze({
    world:"cabin-in-the-ashen-veil", origin:"http://127.0.0.1:30000",
    sceneId:"CAVEXT01Yard0001", sceneKey:"EXT-01",
    sceneName:"EXT-01 - Carriage Yard and Cabin Front",
    levelId:"defaultLevel0000",
    art:"Maps/cabin-in-the-ashen-veil/ext-01_carriage-yard_visual-pass.png",
    artSha256:"d957783eeedfe640da78c8f1eeadda5135c66da05c0f3f04c9eb952f9ab34d1c",
    artBytes:4312224, artWidth:1536, artHeight:1024,
    specVersion:"cav-ext01-structural-shell-v001"
  });
  const DICEBOX_SCENE_SCALE = Object.freeze({
    gridType:0,gridSize:120,distance:5,units:"ft",
    logicalColumns:60,logicalRows:40,width:7200,height:4800
  });
  const px=v=>Math.round(v*(DICEBOX_SCENE_SCALE.width/SPEC.artWidth));
  const rawWalls = [
    // Cabin roof footprint and south porch threshold; one closed ordinary entry door
    [[492,100,1060,100],"roof-north",0,0],
    [[492,100,492,344],"roof-west",0,0],
    [[1060,100,1060,344],"roof-east",0,0],
    [[492,344,731,344],"cabin-front-west",0,0],
    [[849,344,1060,344],"cabin-front-east",0,0],
    [[731,344,849,344],"front-foyer-door",1,0],
    // Shack and Privy are roof-bound exterior obstacles; interiors are separate scenes
    [[135,151,307,151],"shack-north",0,0],
    [[135,151,135,277],"shack-west",0,0],
    [[307,151,307,277],"shack-east",0,0],
    [[135,277,307,277],"shack-south",0,0],
    [[1235,145,1390,145],"privy-north",0,0],
    [[1235,145,1235,275],"privy-west",0,0],
    [[1390,145,1390,275],"privy-east",0,0],
    [[1235,275,1390,275],"privy-south",0,0],
    // Iron gate is a locked native door, with adjacent fixed barrier spans
    [[280,65,346,65],"maze-gate-west",0,0],
    [[346,65,441,65],"maze-gate-locked",1,2],
    [[441,65,505,65],"maze-gate-east",0,0],
    // South approach fences are structural map boundaries, NOT teleport walls
    [[225,700,615,840],"southwest-stone-fence",0,0],
    [[615,840,615,1024],"south-road-west-fence",0,0],
    [[950,830,1350,700],"southeast-stone-fence",0,0],
    [[950,830,950,1024],"south-road-east-fence",0,0]
  ];
  const rawRegions=[
    ["Cabin Front Porch",[735,348,852,348,852,430,735,430],"H-G02"],
    ["Iron Maze Gate",[316,42,470,42,470,150,316,150],"FM-01"],
    ["West Grove Trail",[4,274,99,274,99,386,4,386],"EXT-TRAIL"],
    ["South Arrival Road",[707,906,856,906,856,1018,707,1018],"OUTSIDE"],
    ["Pond and Dock Approach",[1199,483,1347,483,1347,643,1199,643],"EXT-02"],
    ["Donovan Shack Approach",[145,194,309,194,309,297,145,297],"EXT-03"],
    ["Privy Approach",[1234,177,1411,177,1411,309,1234,309],"EXT-04"],
    ["Family Carriage",[484,556,627,556,627,704,484,704],"CARRIAGE"]
  ];
  const receipt={
    operation:"cav.ext01.structural-shell-install",build:SPEC.specVersion,
    status:"BLOCKED",sceneId:SPEC.sceneId,created:false,world:SPEC.world,
    artworkSHA256:SPEC.artSha256,geometryAuthority:"ARCHIVED_APPROVED_VISUAL_PASS_PROVISIONAL",
    warnings:[
      "This is the v10 archive's owner-accepted EXT-01 visual-pass PNG (d957...), NOT the separately approved newer full Carriage Yard render (5284...).",
      "300 x 200-foot projection and geometry are provisional; owner will perform visual inspection.",
      "No transitions, puzzle behaviors, carriage looting, lighting, sounds, or gate-unlock mechanics installed."
    ]};
  function log(){console.log("[DICEBOX_EXT01_INSTALL_RECEIPT] "+JSON.stringify(receipt));}
  try{
    if(location.origin!==SPEC.origin||location.pathname!=="/game"||
      !game?.ready||game.world?.id!==SPEC.world||!game.user?.isGM||
      !game.users?.activeGM||game.users.activeGM.id!==game.user.id){
      receipt.reason="Exact-world/origin/elected-GM check failed";log();return;
    }
    if(game.version!=="14.367"||game.system?.id!=="dnd5e"||
      game.system?.version!=="5.3.3"){
      receipt.reason="Runtime stack mismatch";log();return;
    }
    const old=game.scenes.get(SPEC.sceneId)||
      game.scenes.contents.find(s=>s.getFlag("dicebox-campaign-helper","cavStructuralSceneKey")===SPEC.sceneKey);
    if(old){receipt.status="BLOCKED_ALREADY_EXISTS";receipt.existingId=old.id;log();return;}
    const resp=await fetch("/"+SPEC.art,{cache:"no-store"});
    if(!resp.ok)throw Error("Background not served HTTP "+resp.status);
    const bytes=new Uint8Array(await resp.arrayBuffer());
    if(bytes.length!==SPEC.artBytes||bytes[0]!==137||bytes[1]!==80||
      bytes[2]!==78||bytes[3]!==71)throw Error("Background PNG type/length mismatch");
    const v=new DataView(bytes.buffer,bytes.byteOffset,bytes.byteLength);
    if(v.getUint32(16,false)!==SPEC.artWidth||v.getUint32(20,false)!==SPEC.artHeight)
      throw Error("Background intrinsic resolution mismatch");
    if(!crypto?.subtle)throw Error("SHA256 unavailable in this context");
    const hash=[...new Uint8Array(await crypto.subtle.digest("SHA-256",bytes))]
      .map(x=>x.toString(16).padStart(2,"0")).join("");
    if(hash!==SPEC.artSha256)throw Error("Background SHA256 mismatch");
    receipt.artVerified=true;
    const walls=rawWalls.map(([c,objectKey,door,ds],i)=>({
      _id:"CAV01W"+String(i+1).padStart(10,"0"),
      c:c.map(px),levels:[SPEC.levelId],door,ds,
      flags:{"dicebox-campaign-helper":{objectKey:"cav:ext01:"+objectKey,
        phase:"STRUCTURAL_SHELL_TEST"}}
    }));
    const regions=rawRegions.map(([name,coords,destination],i)=>({
      _id:"CAV01R"+String(i+1).padStart(10,"0"),
      name:"EXT-01 - "+name,
      levels:[SPEC.levelId],
      shapes:[{type:"polygon",points:coords.map(px)}],
      behaviors:[],
      flags:{"dicebox-campaign-helper":{
        objectKey:"cav:ext01:region:"+(i+1),
        intendedDestination:destination,
        inertUntilApprovedGameplayPhase:true
      }}
    }));
    if(walls.length!==21||regions.length!==8||regions.some(r=>r.behaviors.length))
      throw Error("Object roster differs from approved shell plan");
    const sceneData={
      _id:SPEC.sceneId,name:SPEC.sceneName,
      width:DICEBOX_SCENE_SCALE.width,
      height:DICEBOX_SCENE_SCALE.height,padding:0,
      grid:{type:DICEBOX_SCENE_SCALE.gridType,
        size:DICEBOX_SCENE_SCALE.gridSize,
        distance:DICEBOX_SCENE_SCALE.distance,
        units:DICEBOX_SCENE_SCALE.units},
      levels:[{_id:SPEC.levelId,name:"Estate Ground",
        elevation:{bottom:0,top:20},background:{src:SPEC.art}}],
      initialLevel:SPEC.levelId,
      navigation:true,active:false,walls,regions,
      flags:{"dicebox-campaign-helper":{
        cavStructuralSceneKey:SPEC.sceneKey,
        phase:"STRUCTURAL_SHELL_TEST",specVersion:SPEC.specVersion,
        approvedArtSha256:SPEC.artSha256,
        imageEdition:"OCT23_V10_ARCHIVE_VISUAL_PASS",
        laterAcceptedArtNotYetDeployed:true,
        geometryStatus:"PROVISIONAL_EXT01_300x200FT",
        discoveries:0,regionBehaviorCount:0,ownerPuzzleDeferral:true
      }}
    };
    const Class=CONFIG.Scene.documentClass;
    const preview=new Class(sceneData);
    preview.validate({strict:true});
    if(preview.levels.size!==1||preview.walls.size!==21||preview.regions.size!==8||
      preview.regions.contents.some(r=>r.behaviors.size!==0)||
      preview.levels.contents[0]?.background?.src!==SPEC.art||
      preview.walls.contents.some(w=>!w.toObject().levels.includes(SPEC.levelId))||
      preview.regions.contents.some(r=>!r.toObject().levels.includes(SPEC.levelId)))
      throw Error("Native Scene/Wall/Region validation failed before commit");
    const created=await Class.create(sceneData,{keepId:true});
    receipt.created=Boolean(created?.id===SPEC.sceneId);
    const live=game.scenes.get(SPEC.sceneId);
    if(!live){receipt.status="OUTCOME_UNKNOWN";throw Error("No collection readback after Scene.create");}
    receipt.sceneUuid=live.uuid;
    receipt.levelCount=live.levels.size;
    receipt.wallCount=live.walls.size;
    receipt.doorWallCount=live.walls.contents.filter(w=>w.door===1).length;
    receipt.regionCount=live.regions.size;
    receipt.behaviors=live.regions.contents.reduce((n,r)=>n+r.behaviors.size,0);
    receipt.background=live.levels.contents[0]?.background.src;
    receipt.grid={type:live.grid.type,size:live.grid.size,
      distance:live.grid.distance,units:live.grid.units,
      width:live.width,height:live.height};
    receipt.status=receipt.created&&receipt.levelCount===1&&receipt.wallCount===21&&
      receipt.doorWallCount===2&&receipt.regionCount===8&&receipt.behaviors===0&&
      receipt.background===SPEC.art?"READY_WITH_WARNINGS":"FAILED_REREAD";
  }catch(e){
    receipt.reason=String(e?.message??e).slice(0,450);
    const s=game?.scenes?.get(SPEC.sceneId);
    if(s){receipt.created=true;receipt.status="OUTCOME_NEEDS_REREAD";receipt.sceneUuid=s.uuid;
      receipt.wallCount=s.walls.size;receipt.regionCount=s.regions.size;}
    else receipt.status="BLOCKED_OR_UNKNOWN";
  }
  log();
})();
```
