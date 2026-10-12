import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import {C,confirmSandboxUrl,validateClient,validateIsolation,reserveSingleCommitClaim} from "./clscale-disposable-teleport-acceptance-v001.mjs";

const attestation={schema:1,testOnly:true,safeToCommit:true,blockers:[],port:30010,
 world:C.world,dataRoot:C.dataRoot,listenerPid:8123,worldCount:1,moduleDirectoryCount:0};
const client={origin:C.origin,path:"/game",ready:true,world:C.world,gmId:"scratchGM-id",
 gm:true,foundry:"14.367",system:"dnd5e",version:"5.3.3",
 sceneCount:0,actorCount:0,activePlayers:0,activeModuleCount:0,nonGMAccountCount:0};

test("isolated test instance contract passes a complete synthetic witness",()=>{
 assert.equal(validateIsolation({...attestation}),true);
 assert.equal(validateClient({...client}),true);
 assert.equal(confirmSandboxUrl("http://127.0.0.1:30010/game"),true);
});
for(const [name,change] of [
 ["wrong server port",{port:30000}],
 ["wrong world ID",{world:C.liveWorld}],
 ["production dataPath",{dataRoot:"C:\\Users\\rujie\\AppData\\Local\\FoundryVTT"}],
 ["bad listener PID",{listenerPid:0}],
 ["second world installed",{worldCount:2}],
 ["shared modules installed",{moduleDirectoryCount:3}],
 ["nonempty blockers",{blockers:["SANDBOX_MISSING"]}],
 ["missing safe witness",{safeToCommit:false}]
]){
 test("isolation fail-closed: "+name,()=>{
   assert.throws(()=>validateIsolation({...attestation,...change}));
 });
}
for(const [name,change] of [
 ["production game",{world:C.liveWorld}],
 ["production user",{gmId:C.liveGM}],
 ["wrong origin",{origin:"http://127.0.0.1:30000"}],
 ["wrong path",{path:"/setup"}],
 ["wrong Foundry version",{foundry:"14.366"}],
 ["wrong system version",{version:"5.3.2"}],
 ["nonempty scene roster",{sceneCount:21}],
 ["nonempty actor roster",{actorCount:1}],
 ["connected player",{activePlayers:1}],
 ["inactive player account",{nonGMAccountCount:1}],
 ["active modules",{activeModuleCount:1}],
 ["not a GM",{gm:false}]
]){
 test("browser identity fail-closed: "+name,()=>{
   assert.throws(()=>validateClient({...client,...change}));
 });
}
for(const url of ["http://127.0.0.1:30000/game",
 "http://localhost:30010/game","http://127.0.0.1:30010/setup",
 "http://127.0.0.1:30010/game?world=a","http://evil.local:30010/game",
 "https://127.0.0.1:30010/game"]){
 test("URL boundary refuses "+url,()=>assert.throws(()=>confirmSandboxUrl(url)));
}

test("durable commit claim is strictly single-use in an isolated test directory",()=>{
 const folder=fs.mkdtempSync(path.join(os.tmpdir(),"dicebox-f1-claim-fixture-"));
 try{
  const args={world:C.world,operation:"single-scratch-teleport",port:30010};
  const claim=reserveSingleCommitClaim(folder,args);
  assert.equal(fs.existsSync(claim),true);
  assert.equal(JSON.parse(fs.readFileSync(claim,"utf8")).world,C.world);
  assert.throws(()=>reserveSingleCommitClaim(folder,args),{code:"EEXIST"});
  assert.throws(()=>reserveSingleCommitClaim(folder,{...args,world:C.liveWorld}));
 }finally{fs.rmSync(folder,{recursive:true,force:true});}
});
