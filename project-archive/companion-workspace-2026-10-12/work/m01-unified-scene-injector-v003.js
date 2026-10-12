/**
 * DiceBox / Beyond the Realms — M01 Unified Scene Injector v003
 * Established BTR guarded, repeatable, MapSpec-driven injector conventions.
 * Foundry 14.367 / dnd5e 5.3.3; run as the active Gamemaster.
 * ONE macro installs/reconciles scene + Level art + walls + lights + Regions
 * + working Regionwright mining. Does not auto-start monster hunts.
 * Travel Regions are created but MUST NOT teleport until destination UUIDs exist.
 * No external writes beyond the exact scene/owned embedded documents.
 */
(async () => {
  "use strict";
  const OP = "btr.m01.unified.install.v003";
  const WORLD = "the-forgotten-realms", FOLDER = "Rg5vUAEEv53v2KY1";
  const SCENE_ID = "poijD5fkVUWZMJEH", NAME = "M01 — The Forgotten Road";
  const LEVEL = "defaultLevel0000", OWNER = "dicebox-campaign-helper";
  const PACKAGE = "dicebox-btr-underdark-expedition-v001";
  const MAP_ID = "btr-expedition-m01-forgotten-road";
  const BUILD = "dicebox-m01-forgotten-road-stage-v001";
  const DIR = "worlds/the-forgotten-realms/assets/dicebox-expedition";
  const ART = DIR + "/M01_Forgotten_Road_final.png";
  const MANIFEST = DIR + "/M01_build_manifest.json";
  const ART_SHA = "dad418cf5ff2eb0a1cd0491881a60452b28b91325f0b65cd968b410dfba70e9a";
  const WALL_COUNT = 156, LIGHT_COUNT = 10, REGION_COUNT = 4;
  const info = { operation:OP, result:"PRECHECK", created:{}, preserved:{},
    warnings:[], pending:[], counts:{}, sceneId:null };
  const halt = reason => { throw new Error(reason); };
  const managed = (kind, id) => ({
    owner:OWNER, packageId:PACKAGE, kind,
    semanticId:MAP_ID + ":" + id, schemaVersion:"1.0.0"
  });
  const tags = doc => doc?.flags?.[OWNER] ?? {};
  const own = (doc, kind, id) => {
    const m=tags(doc).managed;
    return m?.owner===OWNER && m?.packageId===PACKAGE &&
      m?.kind===kind && m?.semanticId===MAP_ID+":"+id;
  };
  const levelOnly = doc => Array.isArray(doc?.levels) && doc.levels.length===1 && doc.levels[0]===LEVEL;
  const count = (key, kind) => { info[key][kind]=(info[key][kind]??0)+1; };

  try {
    if (game.world?.id!==WORLD || game.version!=="14.367" ||
        game.system?.id!=="dnd5e" || game.system?.version!=="5.3.3" ||
        !game.user?.isGM || game.users?.activeGM?.id!==game.user.id) {
      halt("Run as elected active Gamemaster in the specified Foundry world/system.");
    }
    const folder=game.folders.get(FOLDER);
    if (folder?.type!=="Scene" || folder?.name!=="Beyond the Realms — Underdark Expedition" ||
        folder?.folder?.name!=="The Underdark") halt("Exact scene-folder authority not found.");

    // Physical asset preflight precedes all Scene writes.
    const files=await foundry.applications.apps.FilePicker.implementation.browse("data",DIR);
    if (!Array.from(files.files??[]).some(f=>String(f)===ART))
      halt("Approved M01 art is missing: "+ART);
    const artResponse=await fetch(ART,{cache:"no-store"});
    if(!artResponse.ok) halt("M01 art is not served by Foundry.");
    if(globalThis.crypto?.subtle) {
      const data=await artResponse.arrayBuffer();
      const hash=[...new Uint8Array(await crypto.subtle.digest("SHA-256",data))]
        .map(n=>n.toString(16).padStart(2,"0")).join("");
      if(hash!==ART_SHA) halt("M01 artwork SHA-256 mismatch.");
    } else info.warnings.push("Browser hash API unavailable; local art SHA-256 was verified during staging.");

    const response=await fetch(MANIFEST,{cache:"no-store"});
    if(!response.ok) halt("Compiled BUILD manifest missing.");
    const m=await response.json();
    if(m.build_id!==BUILD || m.scene_name!==NAME || m.sha256!==ART_SHA ||
      m.canvas?.width!==1536 || m.canvas?.height!==1024 ||
      m.geometry?.walls?.length!==WALL_COUNT || m.lights?.length!==LIGHT_COUNT ||
      m.regions?.length!==REGION_COUNT ||
      !m.geometry?.excluded_from_wall_generation?.some(s=>s.includes("roadside half-walls")))
      halt("BUILD manifest/asset mismatch.");

    // Entire package is validated before its first runtime mutation.
    const unique = (values,what) => {
      if(new Set(values).size!==values.length) halt("Duplicate "+what+" in manifest.");
    };
    unique(m.geometry.walls.map(w=>w.id),"wall IDs");
    unique(m.lights.map(l=>l.id),"light IDs");
    unique(m.regions.map(r=>r.id),"region IDs");
    for(const w of m.geometry.walls){
      if (!Array.isArray(w.c)||w.c.length!==4||
        w.c.some((n,i)=>!Number.isFinite(n)||n<0||n>(i%2===0?1536:1024))||
        (w.c[0]===w.c[2]&&w.c[1]===w.c[3])||
        w.move!==20 || w.sight!==20 || w.door!==0 ||
        /roadside|half.wall|pit.rim/i.test(w.group||""))
        halt("Invalid or disallowed wall "+w.id);
    }
    for(const l of m.lights)
      if(!Number.isFinite(l.x)||!Number.isFinite(l.y)||l.x<0||l.x>1536||l.y<0||l.y>1024)
        halt("Invalid light anchor "+l.id);
    for(const r of m.regions){
      if(r.shape==="polygon" && (r.points?.length??0)<3) halt("Invalid Region polygon "+r.id);
      if(!["polygon","circle"].includes(r.shape)) halt("Unsupported Region shape "+r.id);
    }
    if(!game.modules.get("regionwright-mining")?.active||
      typeof game.modules.get("regionwright-mining")?.api?.configureRegion!=="function"||
      typeof game.modules.get("regionwright-mining")?.api?.readRegion!=="function")
      halt("Regionwright Mining runtime API unavailable; cannot install M01 mechanics.");

    // Reuse original scene and default Level. Never overwrite a foreign match.
    let scene=game.scenes.get(SCENE_ID);
    const overlaps=game.scenes.contents.filter(s=>s.name===NAME ||
      s.flags?.[OWNER]?.underdarkMap?.mapId===MAP_ID ||
      s.flags?.[OWNER]?.managed?.semanticId===MAP_ID);
    if(scene){
      if(overlaps.length!==1 || overlaps[0].id!==SCENE_ID ||
        scene.name!==NAME || scene.folder?.id!==FOLDER ||
        scene.flags?.[OWNER]?.managed?.packageId!==PACKAGE)
        halt("Scene ownership ambiguity: no changes made.");
      count("preserved","scene");
    } else {
      if(overlaps.length) halt("Foreign scene name/mapId collision.");
      scene=await Scene.create({
        name:NAME, folder:FOLDER, width:1536,height:1024,padding:0,
        navigation:false,active:false,backgroundColor:"#080b10",
        grid:{type:0,size:64,distance:5,units:"ft"},
        flags:{[OWNER]:{
          managed:{owner:OWNER,packageId:PACKAGE,kind:"scene",semanticId:MAP_ID,schemaVersion:"1.0.0"},
          underdarkMap:{mapId:MAP_ID,packageId:PACKAGE,rendererPath:ART,rendererSha256:ART_SHA}
        }}
      },{renderSheet:false});
      if(!scene?.id) halt("Scene create outcome unknown. Read world before retry.");
      count("created","scene");
    }
    info.sceneId=scene.id;
    if(scene.width!==1536||scene.height!==1024||scene.folder?.id!==FOLDER)
      halt("Scene geometry/folder has drifted; preserve GM edits and stop.");
    const levels=scene.levels?.contents??[];
    if(levels.length!==1 || levels[0].id!==LEVEL) halt("Default Level topology is not the expected single Level.");
    if(levels[0].background?.src===ART) count("preserved","levelBackground");
    else if(!levels[0].background?.src) {
      await scene.updateEmbeddedDocuments("Level",[{_id:LEVEL,"background.src":ART}]);
      count("created","levelBackground");
    } else halt("Different background is installed; refusing overwrite.");
    if(scene.levels.get(LEVEL)?.background?.src!==ART)
      halt("Level background did not persist: inspect Scene.");

    // Walls: unique stable segment identities. Never delete or alter edited geometry.
    const currentWalls=scene.walls.contents;
    const foreignWalls=currentWalls.filter(w=>!tags(w).m01Wall?.mapId || tags(w).m01Wall.mapId!==MAP_ID);
    if(foreignWalls.length)
      halt("Foreign/manual walls already exist. Stop before adding potentially overlapping walls.");
    const wallById=new Map();
    for(const w of currentWalls){
      const id=tags(w).m01Wall?.segmentId;
      if(wallById.has(id)) halt("Duplicate managed wall segment "+id);
      wallById.set(id,w);
    }
    const addWalls=[];
    for(const def of m.geometry.walls){
      const previous=wallById.get(def.id);
      if(previous){
        if(!levelOnly(previous)||previous.c.some((n,i)=>n!==def.c[i]))
          info.warnings.push("Existing wall "+def.id+" has changed. Preserved GM geometry.");
        count("preserved","walls");
      } else {
        addWalls.push({
          c:def.c,levels:[LEVEL],move:def.move,sight:def.sight,
          light:def.light,sound:def.sound,door:0,dir:def.dir,
          flags:{[OWNER]:{
            managed:managed("wall",def.id),
            m01Wall:{mapId:MAP_ID,buildId:BUILD,segmentId:def.id,
              group:def.group,geometryStatus:"PROVISIONAL"}
          }}
        });
      }
    }
    if(addWalls.length){
      const inserted=await scene.createEmbeddedDocuments("Wall",addWalls);
      if(inserted.length!==addWalls.length) halt("Wall write count uncertain; reread before retry.");
      info.created.walls=inserted.length;
    }

    // Soft dynamic lighting. Foundry atmosphere remains dark; no wide floodlights.
    const lightById=new Map();
    for(const existing of scene.lights.contents){
      const id=tags(existing).m01Light?.anchorId;
      if(id && lightById.has(id)) halt("Duplicate managed light "+id);
      if(id) lightById.set(id,existing);
      else info.warnings.push("Unmanaged light preserved: "+existing.id);
    }
    const lightData=[];
    for(const def of m.lights){
      const previous=lightById.get(def.id);
      if(previous){count("preserved","lights");continue;}
      const torch=def.intent==="warm torch", mineral=def.intent.includes("mineral");
      lightData.push({
        name:def.id,x:def.x,y:def.y,levels:[LEVEL],hidden:false,walls:true,vision:true,
        config:{
          bright:torch?6:0,dim:torch?14:(mineral?7:10),negative:false,
          alpha:torch?0.18:0.12,color:torch?"#d99158":(mineral?"#79b3bb":"#6eb9ac"),
          luminosity:torch?0.24:0.10,attenuation:0.5,angle:360,
          animation:torch?{type:"torch",speed:2,intensity:2}:{type:null,speed:5,intensity:5}
        },
        flags:{[OWNER]:{
          managed:managed("light",def.id),
          m01Light:{mapId:MAP_ID,buildId:BUILD,anchorId:def.id,
            intent:def.intent,configStatus:"SOFT_PRELIMINARY"}
        }}
      });
    }
    if(lightData.length){
      const docs=await scene.createEmbeddedDocuments("AmbientLight",lightData);
      if(docs.length!==lightData.length)halt("Light write uncertain; reread before retry.");
      info.created.lights=docs.length;
    }

    // Regions: ALL authored together. Hunt start remains manual by approved design.
    const regionDefs = {
      "M01-MINING-01":{name:"M01 — Iron Deposit",purpose:"iron-ore",status:"ACTIVE_MINING"},
      "M01-HABITAT-01":{name:"M01 — Fungal Hunting Habitat",purpose:"hunting",status:"MANUAL_HUNT_START"},
      "M01-ENTRY-WEST":{name:"M01 — West Road Arrival",purpose:"arrival",status:"DESTINATION_PENDING"},
      "M01-EXIT-EAST":{name:"M01 — East Road Exit",purpose:"travel",status:"M02_NOT_YET_AVAILABLE"}
    };
    const makeShape=def=>def.shape==="polygon"
      ? {type:"polygon",points:def.points.flat(),hole:false}
      : {type:"circle",x:def.center[0],y:def.center[1],radius:48,hole:false,gridBased:false};
    const currentRegions=scene.regions.contents;
    const regionById=new Map();
    for(const r of currentRegions){
      const id=tags(r).m01Region?.regionId;
      if(id&&regionById.has(id))halt("Duplicate managed Region "+id);
      if(id)regionById.set(id,r);
      else info.warnings.push("Unmanaged Region preserved: "+r.id);
    }
    const regionData=[];
    for(const def of m.regions){
      const spec=regionDefs[def.id];
      if(!spec)halt("Region mechanics missing for "+def.id);
      if(regionById.has(def.id)){count("preserved","regions");continue;}
      regionData.push({
        name:spec.name,levels:[LEVEL],shapes:[makeShape(def)],
        hidden:false,locked:false,visibility:4,
        ownership:{default:2},color:def.id==="M01-MINING-01"?"#b97d4c":"#49617b",
        flags:{[OWNER]:{
          managed:managed("region",def.id),
          m01Region:{mapId:MAP_ID,buildId:BUILD,regionId:def.id,
            purpose:spec.purpose,status:spec.status,
            autoHuntStart:false,travelAutoTeleport:false}
        }}
      });
    }
    if(regionData.length){
      const docs=await scene.createEmbeddedDocuments("Region",regionData);
      if(docs.length!==regionData.length)halt("Region creation incomplete; reread before retry.");
      info.created.regions=docs.length;
    }

    // Regionwright Mining integration: preserve used swings on reruns.
    const mining=scene.regions.contents.filter(r=>
      tags(r).m01Region?.regionId==="M01-MINING-01");
    if(mining.length!==1)halt("Iron Region missing/ambiguous after create.");
    const miningApi=game.modules.get("regionwright-mining").api;
    const prior=miningApi.readRegion(mining[0]);
    if(prior) {
      if(prior.oreId!=="iron-ore")halt("Existing mining configuration differs; preserve live state.");
      count("preserved","miningConfiguration");
    } else {
      await miningApi.configureRegion({region:mining[0],oreId:"iron-ore"});
      count("created","miningConfiguration");
    }

    // Explicit, honest region-behavior bounds: no invented teleports or hunt starts.
    info.pending.push("Western travel destination and landing Region UUID not confirmed.");
    info.pending.push("M02 Tallcap Forest Scene/arrival Region UUID not installed.");
    info.pending.push("Manual GM hunt start: do not attach automatic hunting RegionBehavior.");
    info.pending.push("Mining-pit reachability and geometry require in-game verification.");
    info.pending.push("Roadway token movement, wall sight and 36x24 scale require playtest.");

    const reread=game.scenes.get(scene.id);
    const ownedWalls=reread.walls.contents.filter(w=>tags(w).m01Wall?.mapId===MAP_ID);
    const ownedLights=reread.lights.contents.filter(l=>tags(l).m01Light?.mapId===MAP_ID);
    const ownedRegions=reread.regions.contents.filter(r=>tags(r).m01Region?.mapId===MAP_ID);
    info.counts={scene:1,level:reread.levels.size,
      walls:ownedWalls.length,lights:ownedLights.length,regions:ownedRegions.length,
      workingMiningRegions:ownedRegions.filter(r=>
        tags(r).m01Region?.regionId==="M01-MINING-01" &&
        miningApi.readRegion(r)?.oreId==="iron-ore").length,
      teleportBehaviors:ownedRegions.reduce((n,r)=>n+(r.behaviors?.contents??[]).filter(b=>b.type==="teleportToken").length,0)};
    if(info.counts.level!==1||reread.levels.get(LEVEL)?.background?.src!==ART||
      info.counts.walls!==WALL_COUNT||info.counts.lights!==LIGHT_COUNT||
      info.counts.regions!==REGION_COUNT||info.counts.workingMiningRegions!==1) {
      info.result="OUTCOME_UNKNOWN_CHECK_LIVE";
      console.error("[DiceBox M01 Unified Injector]",info);
      ui.notifications.error("M01 unified install needs inspection. Do not duplicate.");
      return info;
    }
    info.result="INSTALLED_WITH_DOCUMENTED_ROUTE_AND_PLAYTEST_BLOCKERS";
    console.log("[DiceBox M01 Unified Injector]",info);
    ui.notifications.info("M01 scene, 156 walls, 10 lights, 4 Regions and iron mining installed. Travel/playtest pending.");
    return info;
  }catch(e){
    info.result="BLOCKED_OR_PARTIAL_OUTCOME_REQUIRES_REREAD";
    info.error=String(e?.message??e);
    console.error("[DiceBox M01 Unified Injector]",info,e);
    ui.notifications.error("M01 unified injector stopped; inspect console before retry.");
    return info;
  }
})();
