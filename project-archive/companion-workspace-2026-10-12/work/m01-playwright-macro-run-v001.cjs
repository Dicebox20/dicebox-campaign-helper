const fs=require('fs');
const {chromium}=require('C:/Users/rujie/Documents/Codex/2026-08-20/dicebox-campaign-helper/node_modules/playwright');
const source=fs.readFileSync('C:/Users/rujie/Documents/Codex/DiceBox Campaign Helper/work/inject-m01-forgotten-road-v001.js','utf8');
(async()=>{const b=await chromium.launch({headless:true,args:['--disable-gpu','--disable-dev-shm-usage']});const c=await b.newContext({viewport:{width:1440,height:900}});const p=await c.newPage();const logs=[];
p.on('console',m=>{if(/DiceBox M01 Injector/i.test(m.text()))logs.push(m.type()+' '+m.text().slice(0,1500))});p.on('pageerror',e=>logs.push('pageerror '+e.message.slice(0,500)));
try{
 await p.goto('http://10.0.0.26:30000/join',{waitUntil:'domcontentloaded',timeout:22000});
 await p.locator('#join-username').waitFor({timeout:20000});
 await p.locator('#join-username').fill('Assistant Gamemaster');
 await p.locator('#join-password').fill('');
 await p.locator('#join-game-form button[type=submit]').click();
 await p.waitForURL('**/game',{timeout:30000});
 await p.waitForFunction(()=>globalThis.game?.scenes?.size>=236&&game?.folders?.get('Rg5vUAEEv53v2KY1')&&game.user?.name==='Assistant Gamemaster',null,{timeout:150000});
 const before=await p.evaluate(()=>({world:game.world.id,user:game.user.name,gm:game.user.isGM,scenes:game.scenes.size,matching:game.scenes.contents.filter(s=>s.name==='M01 — The Forgotten Road').map(s=>s.id)}));
 if(before.world!=='the-forgotten-realms'||!before.gm||before.matching.length) {console.log(JSON.stringify({status:'BLOCKED_PRECHECK',before},null,2));return;}
 const macro=await p.evaluate(async (command)=>{let m=new Macro({name:'DiceBox — Inject M01 Forgotten Road (temporary)',type:'script',command}); try {return await m.execute()}catch(e){return{macroExecuteError:String(e.message??e)}}},source);
 await p.waitForTimeout(2500);
 const after=await p.evaluate(()=>({world:game.world.id,user:game.user.name,scenes:game.scenes.size,matches:game.scenes.contents.filter(s=>s.name==='M01 — The Forgotten Road').map(s=>({id:s.id,folder:s.folder?.id,bg:s.background?.src,width:s.width,height:s.height,walls:s.walls.size,regions:s.regions.size,lights:s.lights.size,flags:s.flags?.['dicebox-campaign-helper']?.underdarkMap}))}));
 console.log(JSON.stringify({status:after.matches.length===1&&after.scenes===before.scenes+1?'CREATED_VERIFIED':'INSPECT_RESULT',before,macro,after,logs},null,2));
}catch(e){console.log(JSON.stringify({status:'ERROR_REQUIRES_REREAD',error:String(e?.message??e),logs},null,2))}finally{await b.close()}})();
