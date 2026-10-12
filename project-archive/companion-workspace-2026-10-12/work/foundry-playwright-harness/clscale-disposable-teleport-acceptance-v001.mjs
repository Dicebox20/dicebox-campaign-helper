import fs from "node:fs";
import path from "node:path";
import {pathToFileURL} from "node:url";
import {spawnSync} from "node:child_process";
import {createHash} from "node:crypto";
import {chromium} from "playwright-core";

export const C = Object.freeze({
  world:"dicebox-f1-teleport-acceptance-v001",
  origin:"http://127.0.0.1:30010",
  dataRoot:String.raw`C:\Users\rujie\Documents\Codex\DiceBox Campaign Helper\work\foundry-teleport-sandbox-v001\userdata`,
  liveWorld:"the-lost-mine-of-phandalin",
  liveGM:"pnTxw7VYpYR4IKWE",
  livePort:30000,
  guardScript:String.raw`C:\Users\rujie\Documents\Codex\DiceBox Campaign Helper\work\foundry-playwright-harness\clscale-isolated-foundry-server-gate-v001.ps1`
});
export function validateIsolation(r){
  if(r?.schema!==1||r?.testOnly!==true||r?.safeToCommit!==true||
     r?.port!==30010||r?.world!==C.world||r?.dataRoot!==C.dataRoot||
     !Array.isArray(r?.blockers)||r.blockers.length)throw Error("ISOLATION_ATTESTATION_FAILED");
  if(!Number.isInteger(r.listenerPid)||r.listenerPid<1||
     r.worldCount!==1||r.moduleDirectoryCount!==0)throw Error("ISOLATION_SCOPE_NOT_SINGLE_OWNER");
  return true;
}
export function validateClient(v){
  if(v.origin!==C.origin||v.path!=="/game"||v.world!==C.world||
     v.world===C.liveWorld||v.gmId===C.liveGM||!v.gm||!v.ready||
     v.foundry!=="14.367"||v.system!=="dnd5e"||v.version!=="5.3.3"||
     v.sceneCount!==0||v.actorCount!==0||v.activePlayers!==0||v.nonGMAccountCount!==0||
     v.activeModuleCount!==0)throw Error("SANDBOX_CLIENT_IDENTITY_NOT_EMPTY_OR_SAFE");
  return true;
}
export function confirmSandboxUrl(url){
  const u=new URL(url);
  if(u.origin!==C.origin||u.pathname!=="/game"||
     u.username||u.password||u.search||u.hash)throw Error("NOT_EXACT_SANDBOX_GAME_URL");
  return true;
}
export function reserveSingleCommitClaim(receiptDir,metadata){
  if(!metadata||metadata.world!==C.world||metadata.operation!=="single-scratch-teleport")throw Error("CLAIM_METADATA_NOT_SCRATCH_SCOPED");
  fs.mkdirSync(receiptDir,{recursive:true});
  const claimFile=path.join(receiptDir,"first-committed-attempt-claim-v001.json");
  fs.writeFileSync(claimFile,JSON.stringify(metadata,null,2),{encoding:"utf8",flag:"wx"});
  return claimFile;
}
const called=Boolean(process.argv[1] && import.meta.url.toLowerCase()===pathToFileURL(path.resolve(process.argv[1])).href.toLowerCase());
if(called){
  const args=process.argv.slice(2);
  const commit=args.length===2&&args[0]==="--commit"&&args[1]==="--disposable-test-world-only";
  const preflight=args.length===1&&args[0]==="--preflight";
  if(!preflight&&!commit){console.error("USAGE: node clscale-disposable-teleport-acceptance-v001.mjs --preflight");process.exit(2);}
  try {
    const ps=spawnSync("powershell.exe",["-NoProfile","-File",C.guardScript],{encoding:"utf8",timeout:15000,windowsHide:true});
    const line=ps.stdout?.trim().split(/\r?\n/).at(-1);
    if(!line)throw Error("ISOLATION_GUARD_UNAVAILABLE");
    const attestation=JSON.parse(line);
    if(!attestation.safeToCommit){
      console.log(JSON.stringify({phase:"ISOLATION_PREFLIGHT",status:"BLOCKED_FAIL_CLOSED",blockers:attestation.blockers,attemptedCommit:false}));
      process.exit(4);
    }
    validateIsolation(attestation);
    // A separate, intentionally absent authorization file prevents an unapproved commit.
    if(commit){
      const consent=path.join(C.dataRoot,"Config","clscale-commit-authorization-v001.json");
      if(!fs.existsSync(consent))throw Error("COMMITTED_TEST_NOT_SEPARATELY_AUTHORIZED");
      const a=JSON.parse(fs.readFileSync(consent,"utf8"));
      if(a?.world!==C.world||a?.port!==30010||a?.approved!==true||
         a?.operation!=="single-scratch-teleport")throw Error("COMMIT_AUTHORIZATION_INVALID");
    }
    const browser=await chromium.connectOverCDP("http://127.0.0.1:9223");
    try{
      const page=browser.contexts().flatMap(c=>c.pages()).find(p=>{
        try {return confirmSandboxUrl(p.url());}catch{return false;}
      });
      if(!page)throw Error("SANDBOX_BROWSER_SESSION_NOT_AUTHENTICATED");
      const observed=await page.evaluate(()=>{
        const u=new URL(window.location.href),gm=game?.user;
        return{origin:u.origin,path:u.pathname,ready:game?.ready??false,world:game?.world?.id,
          gmId:gm?.id,gm:!!gm?.isGM,foundry:game?.version,system:game?.system?.id,
          version:game?.system?.version,sceneCount:game?.scenes?.size,
          actorCount:game?.actors?.size,activePlayers:game?.users?.filter(x=>x.active&&!x.isGM).length,
          activeModuleCount:game?.modules?.filter(m=>m.active).length,
          nonGMAccountCount:game?.users?.filter(x=>!x.isGM).length};
      });
      validateClient(observed);
      if(preflight){console.log(JSON.stringify({phase:"DISPOSABLE_PREFLIGHT",status:"PASS_READY_NOT_COMMITTED",attemptedCommit:false,identity:observed,serverPid:attestation.listenerPid}));process.exitCode=0;}
      else{
        // Durable single-use marker BEFORE any database writes. An interrupted
        // commit must never be replayed without independent scratch-state review.
        const claim=reserveSingleCommitClaim(path.join(C.dataRoot,"teleport-acceptance-receipts"),{
          world:C.world,operation:"single-scratch-teleport",port:30010,
          startedAt:new Date().toISOString(),sandboxServerPid:attestation.listenerPid,
          policy:"ONE_COMMITTED_ATTEMPT_ONLY_NO_AUTOMATIC_RETRY"
        });
        console.log(JSON.stringify({phase:"COMMIT_CLAIM_CREATED",claim,world:C.world}));
        const result=await page.evaluate(async()=>{
          if(game.world?.id!=="dicebox-f1-teleport-acceptance-v001"||game.scenes.size||
            game.actors.size||!game.user?.isGM||game.users.some(x=>!x.isGM)||
            game.modules.some(x=>x.active))throw Error("SCRATCH_SCOPE_CHANGED_BEFORE_WRITE");
          const source=await Scene.create({name:"DBX-SCRATCH-SOURCE-ONLY",width:4320,height:2880,
            padding:0,grid:{type:0,size:240,distance:5,units:"ft"}});
          const dest=await Scene.create({name:"DBX-SCRATCH-F1-ONLY",width:4320,height:2880,
            padding:0,grid:{type:0,size:240,distance:5,units:"ft"}});
          if(!source||!dest||source===dest)throw Error("SCRATCH_SCENE_CREATION_FAILED");
          const [region]=await dest.createEmbeddedDocuments("Region",[{
            name:"DBX-SCRATCH-ARRIVAL-ONLY",shapes:[{type:"rectangle",x:2390,y:1860,width:280,height:280}],
            behaviors:[]}]);
          const [sourceToken]=await source.createEmbeddedDocuments("Token",[{
            name:"DBX-SCRATCH-TOKEN-ONLY",x:1000,y:1000,width:1,height:1,actorLink:false,
            disposition:0}]);
          if(!region||!sourceToken||dest.tokens.size!==0||source.tokens.size!==1)throw Error("SCRATCH_SOURCE_CREATION_DRIFT");
          const ep=await region.spawnTokens([sourceToken],{placement:"center",snap:false,create:false});
          if(ep.length!==1||ep[0].x!==2410||ep[0].y!==1880||
            ep[0].width!==1||ep[0].height!==1)throw Error("SCRATCH_EPHEMERAL_DESTINATION_FAILED");
          const events={created:0,deleted:0};
          const onCreate=t=>{if(t.parent?.id===dest.id)events.created++;};
          const onDelete=t=>{if(t.parent?.id===source.id)events.deleted++;};
          Hooks.on("createToken",onCreate);Hooks.on("deleteToken",onDelete);
          let token;
          try {token=await region.teleportToken(sourceToken,{placement:"center",snap:false,pan:false});}
          finally {Hooks.off("createToken",onCreate);Hooks.off("deleteToken",onDelete);}
          const destToken=[...dest.tokens];
          const passed=source.tokens.size===0&&destToken.length===1&&
             destToken[0].id===token?.id&&destToken[0].x===2410&&destToken[0].y===1880&&
             destToken[0].width===1&&destToken[0].height===1&&game.scenes.size===2&&
             game.actors.size===0&&events.created===1&&events.deleted===1;
          return{status:passed?"PASS_COMMITTED_IN_DISPOSABLE_WORLD":"BLOCKED_AFTER_COMMIT_NO_REPLAY",
            sourceSceneId:source.id,destinationSceneId:dest.id,sourceTokenCount:source.tokens.size,
            destToken:destToken.map(t=>({id:t.id,x:t.x,y:t.y,width:t.width,height:t.height})),
            eventCounts:events,sceneCount:game.scenes.size,actorCount:game.actors.size};
        });
        const receiptDir=path.join(C.dataRoot,"teleport-acceptance-receipts");
        fs.mkdirSync(receiptDir,{recursive:true});
        const raw=JSON.stringify({world:C.world,when:new Date().toISOString(),serverPid:attestation.listenerPid,result},null,2);
        const receipt=path.join(receiptDir,"first-committed-attempt-v001.json");
        fs.writeFileSync(receipt,raw,{flag:"wx"});
        console.log(JSON.stringify({status:result.status,receipt,sha256:createHash("sha256").update(raw).digest("hex"),result}));
        if(result.status!=="PASS_COMMITTED_IN_DISPOSABLE_WORLD")process.exitCode=6;
      }
    }finally{await browser.close();}
  }catch(e){console.error("FAIL_CLOSED",e.message);process.exitCode=5;}
}