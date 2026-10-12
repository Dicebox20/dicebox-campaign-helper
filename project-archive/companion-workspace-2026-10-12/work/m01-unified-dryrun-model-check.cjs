const {chromium}=require('C:/Users/rujie/Documents/Codex/2026-08-20/dicebox-campaign-helper/node_modules/playwright');
(async()=>{
const b=await chromium.launch({headless:true,args:['--disable-gpu']});const p=await b.newPage();
try{
await p.goto('http://10.0.0.26:30000/join',{waitUntil:'domcontentloaded',timeout:25000});
await p.locator('#join-username').waitFor({timeout:20000});await p.locator('#join-username').fill('Assistant Gamemaster');
await p.locator('#join-password').fill('');await p.locator('#join-game-form button[type=submit]').click();
await p.waitForURL('**/game',{timeout:30000});
await p.waitForFunction(()=>game?.scenes?.get('poijD5fkVUWZMJEH'),null,{timeout:150000});
const r=await p.evaluate(()=>{
const scene=game.scenes.get('poijD5fkVUWZMJEH');
const cls=(n)=>globalThis.getDocumentClass?.(n)??globalThis[n+"Document"]??null;
const sample=(n,data)=>{try{const Class=cls(n);if(!Class)return{class:false};const doc=new Class(data,{parent:scene});let failure;try{doc.validate({clean:false,strict:true})}catch(e){failure=String(e.message)}return{class:Class.name,object:doc.toObject(),failure}}catch(e){return{error:String(e.message)}}};
return{user:game.user.name,sceneId:scene.id,config:Object.keys(globalThis.CONST?.REGION_VISIBILITY??{}),
 models:{
wall:sample('Wall',{c:[100,120,200,220],levels:['defaultLevel0000'],move:20,sight:20,light:20,sound:20}),
light:sample('AmbientLight',{x:100,y:200,name:'M01 Test Preview',levels:['defaultLevel0000'],config:{bright:6,dim:14,color:'#d99158',luminosity:0.24,animation:{type:'torch',speed:2,intensity:2}}}),
circle:sample('Region',{name:'M01 Dryrun Circle',levels:['defaultLevel0000'],shapes:[{type:'circle',x:42,y:540,radius:48,hole:false,gridBased:false}],visibility:4,hidden:false,locked:false,ownership:{default:2}}),
polygon:sample('Region',{name:'M01 Dryrun Polygon',levels:['defaultLevel0000'],shapes:[{type:'polygon',points:[750,574,1008,572,1067,694,1005,796,823,805,721,719],hole:false}],visibility:4,hidden:false,locked:false,ownership:{default:2}})
}}});
console.log(JSON.stringify(r,null,2));
}catch(e){console.log("ERROR "+e.message)}finally{await b.close()}
})();