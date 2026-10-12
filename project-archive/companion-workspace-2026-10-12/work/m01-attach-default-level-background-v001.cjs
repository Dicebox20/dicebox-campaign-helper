const {chromium}=require('C:/Users/rujie/Documents/Codex/2026-08-20/dicebox-campaign-helper/node_modules/playwright');
(async()=>{
 const b=await chromium.launch({headless:true,args:['--disable-gpu','--disable-dev-shm-usage']});const p=await b.newPage();
 try {
  await p.goto('http://10.0.0.26:30000/join',{waitUntil:'domcontentloaded',timeout:25000});
  await p.locator('#join-username').waitFor({timeout:25000});await p.locator('#join-username').fill('Assistant Gamemaster');await p.locator('#join-password').fill('');await p.locator('#join-game-form button[type=submit]').click();
  await p.waitForURL('**/game',{timeout:30000});
  await p.waitForFunction(()=>globalThis.game?.scenes?.get('poijD5fkVUWZMJEH')&&game.user?.isGM,null,{timeout:170000});
  const result=await p.evaluate(async()=>{
   const id='poijD5fkVUWZMJEH',folderId='Rg5vUAEEv53v2KY1',src='worlds/the-forgotten-realms/assets/dicebox-expedition/M01_Forgotten_Road_final.png';
   const scene=game.scenes.get(id);
   const initial={world:game.world?.id,version:game.version,system:game.system?.version,user:game.user?.name,gm:game.user?.isGM,
    sceneId:scene?.id,name:scene?.name,folder:scene?.folder?.id,
    sceneCount:game.scenes?.size,levels:scene?.levels?.contents?.map(l=>({id:l.id,name:l.name,bg:l.background?.src??null})),
    initialLevel:scene?.initialLevel,sceneBackground:scene?.background?.src??null,
    walls:scene?.walls?.size,regions:scene?.regions?.size,lights:scene?.lights?.size};
   function blocked(reason){return{status:'BLOCKED_NO_WRITE',reason,initial}}
   if(initial.world!=='the-forgotten-realms'||initial.version!=='14.367'||initial.system!=='5.3.3'||initial.user!=='Assistant Gamemaster'||!initial.gm)return blocked('identity/runtime');
   if(initial.sceneId!==id||initial.name!=='M01 — The Forgotten Road'||initial.folder!==folderId||initial.sceneCount!==237)return blocked('scene/folder/count drift');
   if(initial.walls!==0||initial.regions!==0||initial.lights!==0)return blocked('unexpected placeables');
   const all=scene?.levels?.contents??[];if(all.length!==1)return blocked('expected exactly one default Level');
   const level=all[0];if(level.id!=='defaultLevel0000')return blocked('unexpected default Level ID: '+level.id);
   if(level.background?.src===src)return{status:'ALREADY_INSTALLED_NO_WRITE',initial};
   if(level.background?.src && level.background.src!==src)return blocked('existing different Level art');
   const picker=await foundry.applications.apps.FilePicker.implementation.browse('data','worlds/the-forgotten-realms/assets/dicebox-expedition');
   if(!Array.from(picker.files??[]).some(x=>String(x)===src))return blocked('image not visible to FilePicker');
   let updateResult;
   try {updateResult=await scene.updateEmbeddedDocuments('Level',[{_id:level.id,'background.src':src}]);}
   catch(e){return {status:'UPDATE_EXCEPTION_CHECK_STATE',initial,error:String(e?.message??e)}}
   const reread=game.scenes.get(id);
   const rereadLevel=reread?.levels?.get(level.id);
   const after={sceneId:reread?.id,folder:reread?.folder?.id,name:reread?.name,levelId:rereadLevel?.id,
    bg:rereadLevel?.background?.src??null,sceneBackground:reread?.background?.src??null,
    walls:reread?.walls?.size,regions:reread?.regions?.size,lights:reread?.lights?.size,
    sceneCount:game.scenes.size,updateIds:(updateResult??[]).map(x=>x.id)};
   const ok=after.bg===src&&after.sceneId===id&&after.folder===folderId&&after.sceneCount===237;
   return{status:ok?'LEVEL_BACKGROUND_VERIFIED':'UPDATE_OUTCOME_UNKNOWN',initial,after};
  });
  console.log(JSON.stringify(result,null,2));
 }catch(e){console.log(JSON.stringify({status:'TRANSPORT_ERROR_CHECK_STATE',error:String(e?.message??e)},null,2))}
 finally{await b.close()}
})();