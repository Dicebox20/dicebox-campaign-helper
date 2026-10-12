/**
 * BTR/DiceBox Scene Injector adaptation: M01 Forgotten Road.
 * Adapted from the established Cascade Hollows single-macro template and
 * BTR Scene Injector runtime handoff; background-only first install.
 * Expected world: the-forgotten-realms / Foundry 14.367 / dnd5e 5.3.3.
 *
 * Invariants: idempotent, no foreign scene overwrite; exclude unreviewed
 * walls/Regions/lights until follow-up checked steps.
 */
(async () => {
  "use strict";
  const OP = "dicebox.btr.m01.background.install.v001";
  const WORLD = "the-forgotten-realms";
  const FOLDER = "Rg5vUAEEv53v2KY1";
  const NAME = "M01 — The Forgotten Road";
  const MAP_ID = "btr-expedition-m01-forgotten-road";
  const PACKAGE_ID = "dicebox-btr-underdark-expedition-v001";
  const SCOPE = "dicebox-campaign-helper";
  const SRC = "worlds/the-forgotten-realms/assets/dicebox-expedition/M01_Forgotten_Road_final.png";
  const SHA256 = "dad418cf5ff2eb0a1cd0491881a60452b28b91325f0b65cd968b410dfba70e9a";
  const fail = (message) => { throw new Error(OP + ": " + message); };
  try {
    if (!game.user?.isGM || game.user.name !== "Assistant Gamemaster") fail("Wrong executor; requires authorized Assistant Gamemaster");
    if (game.world?.id !== WORLD || game.version !== "14.367" || game.system?.id !== "dnd5e" || game.system?.version !== "5.3.3") fail("Wrong exact world or runtime");
    const folder = game.folders.get(FOLDER);
    if (!folder || folder.type !== "Scene" || folder.name !== "Beyond the Realms — Underdark Expedition" || folder.folder?.name !== "The Underdark") fail("Folder authority mismatch");
    const named = game.scenes.contents.filter(scene => scene.name === NAME);
    const managed = game.scenes.contents.filter(scene =>
      scene.flags?.[SCOPE]?.managed?.semanticId === MAP_ID ||
      scene.flags?.[SCOPE]?.underdarkMap?.mapId === MAP_ID
    );
    if (named.length || managed.length) {
      if (named.length===1 && managed.length===1 && named[0].id===managed[0].id) {
        const s=named[0];
        console.log("[DiceBox M01 Injector]",{operation:OP,status:"ALREADY_INSTALLED_NO_WRITE",sceneId:s.id,name:s.name});
        return {status:"ALREADY_INSTALLED_NO_WRITE",sceneId:s.id};
      }
      fail("Name or managed mapId already present; refusing to overwrite or duplicate");
    }
    const FilePickerClass = foundry.applications.apps.FilePicker.implementation;
    const listing = await FilePickerClass.browse("data", "worlds/the-forgotten-realms/assets/dicebox-expedition");
    if (!Array.from(listing.files ?? []).some(file => String(file).endsWith("/M01_Forgotten_Road_final.png"))) fail("Verified background not visible to Foundry FilePicker");
    const data = {
      name: NAME, folder: FOLDER, navigation:false, active:false,
      width:1536, height:1024, padding:0,
      backgroundColor:"#080b10",
      background:{src:SRC},
      grid:{type:0,size:64,distance:5,units:"ft"},
      flags:{[SCOPE]:{
        managed:{packageId:PACKAGE_ID,owner:SCOPE,kind:"scene",semanticId:MAP_ID,schemaVersion:"1.0.0"},
        underdarkMap:{mapId:MAP_ID,packageId:PACKAGE_ID,rendererPath:SRC,rendererSha256:SHA256,
          stage:"BACKGROUND_ONLY",scaleStatus:"PENDING_IN_GAME_CALIBRATION",
          regionStatus:"NOT_INSTALLED",wallStatus:"NOT_INSTALLED",lightStatus:"NOT_INSTALLED"}
      }}
    };
    const scene = await Scene.create(data,{renderSheet:false});
    if (!scene?.id) fail("Scene.create returned no Scene ID; reread before retry");
    const saved=game.scenes.get(scene.id);
    if (!saved || saved.name!==NAME || saved.folder?.id!==FOLDER || saved.background?.src!==SRC ||
        saved.width!==1536 || saved.height!==1024 || saved.walls?.size!==0 || saved.regions?.size!==0) {
      console.error("[DiceBox M01 Injector] REREAD_MISMATCH",scene?.id);
      return {status:"OUTCOME_UNKNOWN_REREAD_MISMATCH",sceneId:scene.id};
    }
    const result={operation:OP,status:"CREATED_VERIFIED",sceneId:saved.id,name:saved.name,folderId:saved.folder?.id,
      src:saved.background.src,walls:saved.walls.size,regions:saved.regions.size,lights:saved.lights?.size??0,
      width:saved.width,height:saved.height};
    console.log("[DiceBox M01 Injector]",result);
    ui.notifications.info("DiceBox M01 — The Forgotten Road added to Expedition Scenes.");
    return result;
  } catch (error) {
    console.error("[DiceBox M01 Injector] BLOCKED",error);
    ui.notifications.error("M01 injection blocked: "+String(error?.message??error).slice(0,140));
    return {operation:OP,status:"BLOCKED",error:String(error?.message??error)};
  }
})();
