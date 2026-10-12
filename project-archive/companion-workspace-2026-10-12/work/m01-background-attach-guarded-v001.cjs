const {chromium}=require('C:/Users/rujie/Documents/Codex/2026-08-20/dicebox-campaign-helper/node_modules/playwright');
(async()=>{const b=await chromium.launch({headless:true,args:['--disable-gpu']});const c=await b.newContext();const p=await c.newPage();try{await p.goto('http://10.0.0.26:30000/join',{waitUntil:'domcontentloaded',timeout:22000});await p.locator('#join-username').waitFor({timeout:20000});await p.locator('#join-username').fill('Assistant Gamemaster');await p.locator('#join-password').fill('');await p.locator('#join-game-form button[type=submit]').click();await p.waitForURL('**/game',{timeout:26000});await p.waitForFunction(()=>globalThis.game?.scenes?.get('poijD5fkVUWZMJEH')&&game?.user?.isGM,null,{timeout:130000});
console.log(JSON.stringify(await p.evaluate(async ()=>{
const id='poijD5fkVUWZMJEH',src='worlds/the-forgotten-realms/assets/dicebox-expedition/M01_Forgotten_Road_final.png',s=game.scenes.get(id);
const info={world:game.world?.id,user:game.user?.name,isGM:game.user?.isGM,version:game.version,system:game.system?.version,sceneId:s.id,name:s.name,folder:s.folder?.id,current:s.background?.src,sceneCount:game.scenes.size};
if(info.world!=='the-forgotten-realms'||info.user!=='Assistant Gamemaster'||!info.isGM||info.version!=='14.367'||info.system!=='5.3.3'||info.folder!=='Rg5vUAEEv53v2KY1'||info.name!=='M01 — The Forgotten Road')return{status:'BLOCKED_IDENTITY',info};
if(info.current===src)return{status:'ALREADY_CORRECT_NO_WRITE',info};
if(info.current!==null)return{status:'BLOCKED_FOREIGN_BACKGROUND',info};
if(game.scenes.size!==237)return{status:'BLOCKED_SCENE_COUNT_DRIFT',info};
const listing=await foundry.applications.apps.FilePicker.implementation.browse('data','worlds/the-forgotten-realms/assets/dicebox-expedition');
if(!Array.from(listing.files??[]).some(x=>String(x).endsWith('/M01_Forgotten_Road_final.png')))return{status:'BLOCKED_ASSET_MISSING',info};
await s.update({'background.src':src},{render:false});
const actual=game.scenes.get(id);
return {status:actual.background?.src===src?'BACKGROUND_ATTACHED_VERIFIED':'UPDATE_OUTCOME_UNKNOWN',info,readback:{id:actual.id,src:actual.background?.src,folder:actual.folder?.id,dimensions:[actual.width,actual.height],walls:actual.walls.size,lights:actual.lights.size,regions:actual.regions.size,scenes:game.scenes.size}}
}),null,2))}catch(e){console.log('ERROR '+String(e?.message??e))}finally{await b.close()}})();