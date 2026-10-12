/**
 * DiceBox/BTR Scene Injector v002: M01 Forgotten Road, Foundry 14.367.
 * Established single-macro guarded pattern, corrected for v14 Level.background.src.
 * Image asset must already exist in Foundry data directory (map-first rule).
 * Read-only preflight -> guarded Scene creation -> default Level art attach -> reread.
 * No walls, regions, lights, destinations, or foreign document modifications.
 */
(async () => {
 "use strict";
 const OP="dicebox.m01.inject-background.v002",WORLD="the-forgotten-realms",
 FOLDER="Rg5vUAEEv53v2KY1",NAME="M01 — The Forgotten Road",
 MAP_ID="btr-expedition-m01-forgotten-road",SCOPE="dicebox-campaign-helper",
 PACKAGE="dicebox-btr-underdark-expedition-v001",
 SRC="worlds/the-forgotten-realms/assets/dicebox-expedition/M01_Forgotten_Road_final.png",
 SHA256="dad418cf5ff2eb0a1cd0491881a60452b28b91325f0b65cd968b410dfba70e9a";
 try {
  if(game.world?.id!==WORLD||game.version!=="14.367"||game.system?.id!=="dnd5e"||game.system?.version!=="5.3.3"||!game.user?.isGM||game.user.name!=="Assistant Gamemaster")throw Error("Exact world, version, or authorized user differs");
  const folder=game.folders.get(FOLDER);
  if(folder?.name!=="Beyond the Realms — Underdark Expedition"||folder?.folder?.name!=="The Underdark"||folder.type!=="Scene")throw Error("Folder authority mismatch");
  const matches=game.scenes.contents.filter(s=>s.name===NAME||s.flags?.[SCOPE]?.managed?.semanticId===MAP_ID);
  if(matches.length>1)throw Error("Ambiguous scene: stop and reconcile");
  if(matches.length===1){
    const s=matches[0],l=s.levels?.contents??[];
    if(s.name!==NAME||s.folder?.id!==FOLDER||s.flags?.[SCOPE]?.managed?.semanticId!==MAP_ID)throw Error("Foreign or mismatched scene: refusing mutation");
    const ok=l.length===1&&l[0].id==="defaultLevel0000"&&l[0].background?.src===SRC;
    const result={operation:OP,status:ok?"ALREADY_INSTALLED_VERIFIED":"EXISTING_SCENE_NEEDS_REVIEW_NO_WRITE",sceneId:s.id,levelBackground:l[0]?.background?.src??null};
    console.log("[DiceBox M01 Injector]",result);return result;
  }
  const picker=foundry.applications.apps.FilePicker.implementation;
  const listing=await picker.browse("data","worlds/the-forgotten-realms/assets/dicebox-expedition");
  if(!Array.from(listing.files??[]).some(x=>String(x)===SRC))throw Error("Map asset must be injected into Foundry file directory first");
  const flags={[SCOPE]:{managed:{owner:SCOPE,packageId:PACKAGE,kind:"scene",semanticId:MAP_ID,schemaVersion:"1.0.0"},
    underdarkMap:{mapId:MAP_ID,packageId:PACKAGE,rendererPath:SRC,rendererSha256:SHA256,stage:"BACKGROUND_ONLY",scaleStatus:"PENDING_IN_GAME_CALIBRATION",
      wallStatus:"NOT_INSTALLED",regionStatus:"NOT_INSTALLED",lightStatus:"NOT_INSTALLED"}}};
  const scene=await Scene.create({name:NAME,folder:FOLDER,width:1536,height:1024,padding:0,
    navigation:false,active:false,backgroundColor:"#080b10",grid:{type:0,size:64,distance:5,units:"ft"},flags},{renderSheet:false});
  if(!scene?.id)throw Error("Scene outcome unknown; reread before retry");
  const levels=scene.levels?.contents??[];
  if(levels.length!==1||levels[0].id!=="defaultLevel0000")throw Error("Scene created but default Level differs; stop for review");
  await scene.updateEmbeddedDocuments("Level",[{_id:levels[0].id,"background.src":SRC}]);
  const stored=game.scenes.get(scene.id),level=stored?.levels?.get("defaultLevel0000");
  const ok=stored?.folder?.id===FOLDER&&stored.name===NAME&&level?.background?.src===SRC&&stored.walls?.size===0&&stored.regions?.size===0&&stored.lights?.size===0;
  const result={operation:OP,status:ok?"CREATED_VERIFIED":"OUTCOME_UNKNOWN_REQUIRES_REREAD",sceneId:scene.id,folder:stored?.folder?.id,levelBackground:level?.background?.src??null};
  console.log("[DiceBox M01 Injector]",result);
  if(ok)ui.notifications.info("M01 — The Forgotten Road added to Scenes");
  return result;
 }catch(e){const result={operation:OP,status:"BLOCKED_OR_OUTCOME_UNKNOWN",error:String(e?.message??e)};
  console.error("[DiceBox M01 Injector]",result);ui.notifications.error("M01 Injector blocked; inspect console and Scene inventory.");return result}
})();
