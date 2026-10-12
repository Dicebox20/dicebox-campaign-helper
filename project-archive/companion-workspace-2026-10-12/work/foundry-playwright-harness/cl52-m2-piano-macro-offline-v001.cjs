const fs=require("node:fs"),assert=require("node:assert/strict"),crypto=require("node:crypto");
const source=fs.readFileSync("cl52-m2-piano-macro-v001.txt","utf8"),AF=Object.getPrototypeOf(async function(){}).constructor,run=new AF("game","canvas","ui","foundry","globalThis",source);
const primary={id:"J",isGM:true,active:true},assistant={id:"Z",isGM:true,active:true},player={id:"P",isGM:false,active:true,viewedScene:"M2"};
function harness({gm="J",onScene=true,audience=true,consumed=false,accept=true,failAudio=false,wait=null}={}){
 const state={consumed},trace={dialogs:0,updates:0,plays:0,warnings:0,errors:0,recipients:[]};
 const scene={id:"M2",getFlag:()=>({cl52:{m2HauntedPianoPlayed:state.consumed}}),update:async doc=>{trace.updates++;assert.equal(doc["flags.world.dicebox.cl52.m2HauntedPianoPlayed"],true);state.consumed=true}};
 const users=[primary,assistant,{...player,viewedScene:audience?"M2":"else"}];users.filter=Array.prototype.filter.bind(users);
 const game={users,user:users.find(u=>u.id===gm),scenes:{get:id=>id==="JZkxX6lUQe8Nc8xJ"?scene:null}};
 const canvas={scene:{id:onScene?"M2":"Else"}};
 const foundry={applications:{api:{DialogV2:{confirm:async()=>{trace.dialogs++;if(wait)await wait;return accept}}}},audio:{AudioHelper:{play:async(data,opt)=>{trace.plays++;trace.recipients=opt.recipients;assert.ok(data.src.endsWith("m2-haunted-piano-v001.wav"));if(failAudio)throw Error("audio outcome unknown");return{status:"ok"};}}}};
 const ui={notifications:{warn:()=>trace.warnings++,error:()=>trace.errors++}},globals={};
 return{invoke:()=>run(game,canvas,ui,foundry,globals),trace,state};
}
(async()=>{
 let cases=0;const check=(msg,fn)=>{cases++;return fn()};
 for(const gm of ["Z","P"]){const h=harness({gm});const r=await h.invoke();check("non primary",()=>{assert.equal(r.status,"IGNORED_NON_PRIMARY_GM");assert.equal(h.trace.plays,0)})}
 {const h=harness({onScene:false});check("wrong scene",async()=>{assert.equal((await h.invoke()).status,"BLOCKED_GM_NOT_VIEWING_M2");assert.equal(h.trace.plays,0)})}
 {const h=harness({audience:false});check("no audience",async()=>{assert.equal((await h.invoke()).status,"BLOCKED_NO_PLAYERS_VIEWING_M2");assert.equal(h.trace.updates,0)})}
 {const h=harness({consumed:true});check("already consumed",async()=>{assert.equal((await h.invoke()).status,"ALREADY_PLAYED");assert.equal(h.trace.plays,0)})}
 {const h=harness({accept:false});check("cancel",async()=>{assert.equal((await h.invoke()).status,"CANCELLED");assert.equal(h.trace.plays,0);assert.equal(h.state.consumed,false)})}
 {const h=harness();check("one successful playback",async()=>{assert.equal((await h.invoke()).status,"PASS");assert.equal(h.trace.updates,1);assert.equal(h.trace.plays,1);assert.deepEqual(h.trace.recipients,["P"]);assert.equal((await h.invoke()).status,"ALREADY_PLAYED")})}
 {const h=harness({failAudio:true});const err=console.error;console.error=()=>{};try{check("uncertain audio consumed",async()=>{assert.equal((await h.invoke()).status,"PLAYBACK_OUTCOME_UNKNOWN_CONSUMED");assert.equal(h.state.consumed,true);assert.equal(h.trace.warnings,1)})}finally{console.error=err}}
 let release;const promise=new Promise(resolve=>{release=resolve});const h=harness({wait:promise});const a=h.invoke();await Promise.resolve();const b=h.invoke();release();const rs=await Promise.all([a,b]);check("concurrent",()=>{assert.ok(rs.some(r=>r.status==="BUSY"));assert.equal(h.trace.plays,1)});
 console.log("CL52_M2_OFFLINE_MACRO_CONTRACTS_PASS "+cases+" cases, sourceSha="+crypto.createHash("sha256").update(source).digest("hex"));
})().catch(e=>{console.error(e.stack);process.exitCode=1});