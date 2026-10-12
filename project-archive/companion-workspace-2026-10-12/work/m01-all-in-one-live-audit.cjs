const {chromium}=require('C:/Users/rujie/Documents/Codex/2026-08-20/dicebox-campaign-helper/node_modules/playwright');
(async()=>{
 const browser=await chromium.launch({headless:true,args:['--disable-gpu']}); const page=await browser.newPage();
 try {
  await page.goto('http://10.0.0.26:30000/join',{waitUntil:'domcontentloaded',timeout:25000});
  await page.locator('#join-username').waitFor({timeout:20000});
  await page.locator('#join-username').fill('Assistant Gamemaster');
  await page.locator('#join-password').fill('');
  await page.locator('#join-game-form button[type=submit]').click();
  await page.waitForURL('**/game',{timeout:30000});
  await page.waitForFunction(()=>globalThis.game?.scenes?.get('poijD5fkVUWZMJEH'),null,{timeout:150000});
  const result=await page.evaluate(()=>{
    const scene=game.scenes.get('poijD5fkVUWZMJEH');
    const modules=['regionwright-mining','regionwright-hunting-gathering','regionwright-fishing']
      .map(id=>{const m=game.modules.get(id);return{id,active:m?.active,version:m?.version,api:m?.api?Object.keys(m.api):null}});
    const refScene=game.scenes.contents.find(s=>s.levels?.size===1&&s.walls.size&&s.regions.size);
    return {world:game.world.id,user:game.user.name,activeGM:game.users.activeGM?.name,sceneId:scene.id,sceneCount:game.scenes.size,
      folder:scene.folder?.id,background:scene.background?.src,
      levels:scene.levels.contents.map(l=>({id:l.id,background:l.background.src})),
      walls:scene.walls.size,wallSample:scene.walls.contents.slice(0,2).map(w=>w.toObject()),
      regions:scene.regions.size,lights:scene.lights.size,modules,
      example:refScene?{scene:refScene.name,wall:refScene.walls.contents[0]?.toObject(),
        region:refScene.regions.contents[0]?.toObject(),
        light:refScene.lights.contents[0]?.toObject()}:null,
      schemas:{wall:Object.keys(foundry.documents.Wall?.schema?.fields??{}),region:Object.keys(foundry.documents.Region?.schema?.fields??{}),
        light:Object.keys(foundry.documents.AmbientLight?.schema?.fields??{})}
    };
  });
  console.log(JSON.stringify(result,null,2));
 }catch(e){console.log('ERROR '+e.message)}
 finally{await browser.close()}
})();