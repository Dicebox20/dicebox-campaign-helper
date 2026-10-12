import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import {chromium} from "playwright-core";
const root=String.raw`C:\Users\rujie\Documents\Codex\DiceBox Campaign Helper`;
const oldPath=path.join(root,"outputs","foreman-checkpoints","clscale-f1-arrival-source-readonly-v001.json");
const dest=path.join(root,"outputs","foreman-checkpoints","clscale-f1-infernal-light-drift-evidence-v001.json");
const saved=JSON.parse(fs.readFileSync(oldPath,"utf8"));
const old=saved.scenes.find(s=>s.id==="La9krMOMBhAhDLi6");
if(!old||fs.existsSync(dest))throw Error("BASELINE_OR_OUTPUT_DRIFT");
const sha=v=>crypto.createHash("sha256").update(JSON.stringify(v)).digest("hex");
if(sha(old.source)!==old.sha)throw Error("BASELINE_HASH_INVALID");
const browser=await chromium.connectOverCDP("http://127.0.0.1:9223");
try{
 const page=browser.contexts().flatMap(c=>c.pages()).find(p=>p.url().includes("localhost:30000/game"));
 if(!page)throw Error("NO_EXACT_LIVE_PAGE");
 const latest=await page.evaluate(()=>{
  if(!game.ready||game.world?.id!=="the-lost-mine-of-phandalin"||!game.user?.isGM||
     game.version!=="14.367"||game.system?.version!=="5.3.3")throw Error("PRODUCTION_IDENTITY_DRIFT");
  const ids=["La9krMOMBhAhDLi6","aIKQmFiuXWipEdyb","HWitOe1wSid7MZ1y"];
  return{world:game.world.id,nonGM:game.users.filter(x=>x.active&&!x.isGM).length,
   sceneSources:Object.fromEntries(ids.map(id=>[id,game.scenes.get(id).toObject()])),
   ledger:game.journal.get("xhlXv6CCH34HVga3")?.getFlag("world","dicebox")?.state,
   meow:game.scenes.get("La9krMOMBhAhDLi6").tokens.map(t=>({id:t.id,actorId:t.actorId,x:t.x,y:t.y,width:t.width,height:t.height})),
   ret:game.scenes.get("U8S5ZrTjaPIkTUIL").tokens.map(t=>({id:t.id,actorId:t.actorId,x:t.x,y:t.y,width:t.width,height:t.height}))};
 });
 const now=latest.sceneSources["La9krMOMBhAhDLi6"];
 const region=now.regions.find(r=>r._id==="uJsKPrR5yEXhhLZ3");
 const oldRegion=old.source.regions.find(r=>r._id==="uJsKPrR5yEXhhLZ3");
 if(!region||!oldRegion||region.name!=="F1 — System — Infernal Light"||
  region.behaviors.length!==0||oldRegion.shapes[0].x!==141||oldRegion.shapes[0].y!==-7||
  region.shapes[0].x!==-3||region.shapes[0].y!==-4||
  now.grid.size!==120||latest.nonGM!==0||
  sha(latest.ledger)!=="ec3f1a02887b80a342653681d217d357f7bb7f5b44fa436555d57bf12c44cfd4"||
  latest.ledger.revision!==13||sha(now)!=="eff632c06bb6e3281c2116e3959af3171ac95dc16ddab3a2ddd7fc23e316cd03"||
  sha(latest.sceneSources["aIKQmFiuXWipEdyb"])!==saved.scenes.find(x=>x.id==="aIKQmFiuXWipEdyb").sha||
  sha(latest.sceneSources["HWitOe1wSid7MZ1y"])!==saved.scenes.find(x=>x.id==="HWitOe1wSid7MZ1y").sha)
  throw Error("STRICT_SCENE_OR_LEDGER_DRIFT");
 const normalized=JSON.parse(JSON.stringify(now));
 const normReg=normalized.regions.find(r=>r._id===region._id);
 normReg.shapes[0].x=141;normReg.shapes[0].y=-7;
 if(sha(normalized)!==old.sha)throw Error("MORE_THAN_TWO_UNAPPROVED_CHANGES");
 const result={status:"READONLY_TWO_FIELD_DRIFT_PROVEN_NOT_A_LIVE_FIX",capturedUtc:new Date().toISOString(),
  sceneId:"La9krMOMBhAhDLi6",sceneName:now.name,
  oldSHA:old.sha,currentSHA:sha(now),normalizedOriginalSHA:sha(normalized),
  regionId:region._id,regionName:region.name,regionBehaviorCount:region.behaviors.length,
  changedFields:[{path:"regions.uJsKPrR5yEXhhLZ3.shapes[0].x",before:141,after:-3},
                 {path:"regions.uJsKPrR5yEXhhLZ3.shapes[0].y",before:-7,after:-4}],
  unrelatedLiveChecks:{t3Sha:sha(latest.sceneSources["aIKQmFiuXWipEdyb"]),f2Sha:sha(latest.sceneSources["HWitOe1wSid7MZ1y"]),
    puzzleLedgerSha:sha(latest.ledger),ledgerRevision:latest.ledger.revision,
    meow:latest.meow,ret:latest.ret},
  sourceCurrent:now,originOfChange:"UNKNOWN",safeToPromoteOldContract:false,
  warning:"Region coordinates could alter lighting and must not be silently reverted"};
 fs.writeFileSync(dest,JSON.stringify(result,null,2),{encoding:"utf8",flag:"wx"});
 console.log(JSON.stringify({status:result.status,path:dest,oldSHA:result.oldSHA,currentSHA:result.currentSHA,exactlyTwoFieldChanges:true,regionBehaviorCount:0,ledgerRevision:13,noFoundryWrite:true}));
}finally{await browser.close();}
