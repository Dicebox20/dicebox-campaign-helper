// CL-33 local-only mocked contract test. Zero Foundry access.
const {readFileSync}=require("node:fs");
const assert=require("node:assert/strict");
const AsyncFunction=Object.getPrototypeOf(async function(){}).constructor;
const specs=JSON.parse(readFileSync("./cl33-migration-sources-v001.json","utf8"));
let checks=0;
function harness(spec,{primary=true,player=false,accepted=true,already=false,missingWorldItem=false,throwGrant=false,gate=null}={}){
 const state={items:{[spec.itemKey]:{recovered:already}}},trace={dialogs:0,grants:0,warnings:0,request:null};
 const gmA={id:"J",isGM:true,active:true},gmB={id:"Z",isGM:true,active:true};
 const owner={id:"P",isGM:false,active:true};
 const game={
  users:[gmB,owner,gmA],user:player?owner:(primary?gmA:gmB),
  macros:{get:id=>id!=="FHQiFYx6OntZVo9d"?null:{execute:async args=>{trace.grants++;trace.request=args; if(throwGrant)throw new Error("failed");state.items[spec.itemKey].recovered=true;return{status:"PASS"};}}},
  journal:{get:id=>id!=="xhlXv6CCH34HVga3"?null:{getFlag:()=>({state})}},
  items:[{getFlag:()=>({stableId:"dbx:central-lodge:item:"+spec.itemKey})}, ...(missingWorldItem?[{getFlag:()=>({stableId:"dbx:central-lodge:item:"+spec.itemKey})}]:[])]
 };
 const token={uuid:"Scene.test.Token.1",actor:{uuid:"Actor.test"}};
 const event={data:{token},user:owner,name:"tokenEnter"};
 const foundry={applications:{api:{DialogV2:{confirm:async ()=>{trace.dialogs++;if(gate)await gate;return accepted;}}}}};
 const ui={notifications:{warn:()=>trace.warnings++}};
 const globals={};
 return{run:new AsyncFunction("event","game","foundry","ui","globalThis",spec.source),event,game,foundry,ui,globals,trace,state};
}
async function call(h){await h.run(h.event,h.game,h.foundry,h.ui,h.globals);}
(async()=>{
for(const spec of specs){
 new AsyncFunction("event","game","foundry","ui","globalThis",spec.source);
 const h1=harness(spec,{primary:false});await call(h1);assert.equal(h1.trace.dialogs,0);assert.equal(h1.trace.grants,0);checks++;
 const h2=harness(spec,{player:true});await call(h2);assert.equal(h2.trace.dialogs,0);assert.equal(h2.trace.grants,0);checks++;
 const h3=harness(spec,{accepted:false});await call(h3);assert.equal(h3.trace.dialogs,1);assert.equal(h3.trace.grants,0);assert.equal(h3.state.items[spec.itemKey].recovered,false);checks++;
 const h4=harness(spec,{accepted:true});await call(h4);assert.equal(h4.trace.dialogs,1);assert.equal(h4.trace.grants,1);assert.equal(h4.trace.request.speaker.dicebox.itemKey,spec.itemKey);assert.equal(h4.trace.request.actor.uuid,"Actor.test");await call(h4);assert.equal(h4.trace.grants,1);checks++;
 const h5=harness(spec,{already:true});await call(h5);assert.equal(h5.trace.dialogs,0);assert.equal(h5.trace.grants,0);checks++;
 const h6=harness(spec,{missingWorldItem:true});await call(h6);assert.equal(h6.trace.dialogs,0);assert.equal(h6.trace.grants,0);checks++;
 const h7=harness(spec,{throwGrant:true});const old=console.error;console.error=()=>{};try{await call(h7);}finally{console.error=old;}assert.equal(h7.trace.warnings,1);assert.equal(h7.state.items[spec.itemKey].recovered,false);checks++;
 let release=()=>{};const gate=new Promise(r=>{release=r});const h8=harness(spec,{accepted:true,gate});const run1=call(h8);await Promise.resolve();const run2=call(h8);release();await Promise.all([run1,run2]);assert.equal(h8.trace.dialogs,1);assert.equal(h8.trace.grants,1);checks++;
 console.log(spec.scene+" simulated contracts PASS: 8/8");
}
console.log("CL33 MOCKED CONTRACTS PASS "+checks+"/24 (offline only, no Foundry action)");
})().catch(e=>{console.error("CL33 MOCKED CONTRACTS FAIL",e.stack);process.exitCode=1});
