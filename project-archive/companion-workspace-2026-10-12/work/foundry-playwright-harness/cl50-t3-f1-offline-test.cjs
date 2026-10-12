// CL-50 offline mocked behavior simulation — does not access Foundry.
const fs=require("node:fs"),assert=require("node:assert/strict"),AsyncFunction=Object.getPrototypeOf(async function(){}).constructor;
const source=fs.readFileSync("./cl50-t3-f1-source-v001.txt","utf8");
const run=new AsyncFunction("event","game","foundry","CONST","ui","globalThis",source);
const GM={id:"J",isGM:true,active:true},ASSIST={id:"Z",isGM:true,active:true},PLAYER={id:"P",isGM:false,active:true,character:{id:"a1"}};
function make({executor="J",approve=true,binding=true,dest=true,crash=false,gate=null}={}){
 const trace={dialogs:0,teleports:0,pulls:0,warnings:0};
 const actor={id:"a1",uuid:"Actor.a1",testUserPermission:()=>true};
 const token={id:"t1",actor};
 const from={id:"aIKQmFiuXWipEdyb",regions:{get:()=>({getFlag:()=>({destinationStableSceneId:binding?"dbx:central-lodge:f1":null})})}};
 const to={id:"La9krMOMBhAhDLi6",pullUsers:async u=>{trace.pulls++;assert.deepEqual(u,["P"])}};
 const target={id:"zKNU1R3JGIMMt017",parent:to,getFlag:()=>({stableId:"dbx:central-lodge:f1:region:transition:t3-arrival"}),teleportToken:async()=>{trace.teleports++;if(crash)throw Error("Mock teleport fail")}};
 const game={user:[GM,ASSIST,PLAYER].find(u=>u.id===executor),users:Object.assign([ASSIST,PLAYER,GM],{get:id=>[GM,ASSIST,PLAYER].find(u=>u.id===id),find:fn=>[GM,ASSIST,PLAYER].find(fn)}),scenes:{get:id=>id===from.id?from:id===to.id?{regions:{get:()=>dest?target:null}}:null}};
 const foundry={applications:{api:{DialogV2:{confirm:async()=>{trace.dialogs++;if(gate)await gate;return approve}}}}};
 const ui={notifications:{warn:()=>trace.warnings++}};
 const context={};
 const event={data:{token},region:{parent:from},user:{id:"P"}};
 return{trace,invoke:()=>run(event,game,foundry,{DOCUMENT_OWNERSHIP_LEVELS:{OWNER:3}},ui,context)};
}
(async()=>{
 let n=0;
 for(const who of ["P","Z"]){const m=make({executor:who});await m.invoke();assert.equal(m.trace.teleports,0);assert.equal(m.trace.dialogs,0);n++}
 const no=make({approve:false});await no.invoke();assert.equal(no.trace.dialogs,1);assert.equal(no.trace.teleports,0);await no.invoke();assert.equal(no.trace.dialogs,1);n++;
 const yes=make();await yes.invoke();assert.deepEqual([yes.trace.dialogs,yes.trace.teleports,yes.trace.pulls],[1,1,1]);n++;
 for(const opts of [{binding:false},{dest:false}]){const m=make(opts);await m.invoke();assert.equal(m.trace.dialogs,0);assert.equal(m.trace.teleports,0);n++;}
 const saved=console.error;console.error=()=>{};try{const err=make({crash:true});await err.invoke();assert.equal(err.trace.warnings,1);assert.equal(err.trace.pulls,0);n++;}finally{console.error=saved}
 let release;const wait=new Promise(r=>release=r);const concurrent=make({gate:wait});const x=concurrent.invoke();await Promise.resolve();const y=concurrent.invoke();release();await Promise.all([x,y]);assert.equal(concurrent.trace.dialogs,1);assert.equal(concurrent.trace.teleports,1);n++;
 console.log("CL50 T3 F1 OFFLINE MOCK PASS "+n+"/8: non-GM, refusal, success, absent authority, absent destination, failed teleport, concurrent event suppression");
})().catch(e=>{console.error(e.stack);process.exitCode=1});