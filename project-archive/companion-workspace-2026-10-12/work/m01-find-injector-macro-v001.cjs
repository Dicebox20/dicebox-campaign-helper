const {chromium}=require('C:/Users/rujie/Documents/Codex/2026-08-20/dicebox-campaign-helper/node_modules/playwright');
(async()=>{const b=await chromium.launch({headless:true,args:['--disable-gpu','--disable-dev-shm-usage']});const c=await b.newContext();const p=await c.newPage();try{
await p.goto('http://10.0.0.26:30000/join',{waitUntil:'domcontentloaded',timeout:20000});
await p.locator('#join-username').waitFor({timeout:20000});await p.locator('#join-username').fill('Assistant Gamemaster');await p.locator('#join-password').fill('');await p.locator('#join-game-form button[type=submit]').click();await p.waitForURL('**/game',{timeout:20000});
await p.waitForFunction(()=>globalThis.game?.macros?.size>=0&&globalThis.game?.folders?.size>0,null,{timeout:150000});
console.log(JSON.stringify(await p.evaluate(()=>{
const ms=game.macros.contents.map(m=>({id:m.id,name:m.name,type:m.type,folder:m.folder?.name||null,scriptSize:m.command?.length||0,scriptSnippet:/scene|inject|template|map/i.test(m.name)?m.command?.slice(0,400):undefined})).filter(m=>/scene|inject|map|template|btr|dicebox|regionwright/i.test(m.name)||/inject|template/i.test(m.folder||''));
const f=game.folders.get('Rg5vUAEEv53v2KY1');
return{world:game.world.id,user:game.user.name,version:game.version,system:game.system.version,macrosTotal:game.macros.size,matching:ms,folder:{id:f?.id,name:f?.name,parent:f?.folder?.id||null},sceneCount:game.scenes.size,existingM01:game.scenes.contents.filter(x=>/forgotten road/i.test(x.name)).map(x=>({id:x.id,name:x.name}))}
}),null,2));
}catch(e){console.log('ERROR '+e.message)}finally{await b.close()}})();