"use strict";
const fs=require("node:fs"),assert=require("node:assert/strict"),crypto=require("node:crypto");
const c=JSON.parse(fs.readFileSync("cl52-horror-pacing-contract-v001.json","utf8"));
const backup=JSON.parse(fs.readFileSync("receipts/region-cleanup-2026-10-07/all-21-scenes-all-202-regions-full-backup-v001.json","utf8"));
const allRegions=backup.sceneData.flatMap(s=>s.regions.map(r=>({id:r._id,scene:s.name})));
const known=new Set(allRegions.map(x=>x.id));
const scenes=Object.values(c.sceneCategories).flat();
assert.equal(new Set(scenes).size,21,"21 unique canonical geography Scenes");
assert.equal(scenes.length,21);
assert.equal(c.candidateCues.length,12);
assert.equal(new Set(c.candidateCues.map(x=>x.key)).size,12);
assert.equal(c.globalHardRules.duplicateNightScenesForbidden,true);
assert.equal(c.globalHardRules.noStrobe,true);
assert.equal(c.globalHardRules.noRapidFlicker,true);
assert.equal(c.globalHardRules.GMAuthoredCueGateRequired,true);
assert.equal(c.globalHardRules.globalDayNightTrigger,"UNRESOLVED_GM_APPROVAL");
let checks=6,modeled=0;
function canPreviewCue(cue,{primary=false,gmApproved=false,triggered=false,alreadyConsumed=false,night=false}={}){
 if(!primary||!gmApproved||!triggered)return{status:"BLOCKED_UNAUTHORIZED"};
 if(cue.trigger==="M1_clock_mechanism_authorized")return{status:"BLOCKED_AUTHORED_CLOCK_GATE"};
 if(cue.kind==="one-shot-visual"||cue.kind==="one-shot-audio"){
   if(alreadyConsumed)return{status:"SUPPRESSED_ALREADY_CONSUMED"};
 }
 return{status:"ELIGIBLE_FOR_FUTURE_AUTHORED_PREVIEW",noFoundryMutation:true};
}
for(const cue of c.candidateCues){
 assert.equal(scenes.includes(cue.scene),true,"cue scene mapped: "+cue.key);checks++;
 assert.equal(cue.allowed,true);checks++;
 assert.equal(cue.trigger!=="tokenEnter",true);checks++;
 if(cue.sourceRegionId){assert.equal(known.has(cue.sourceRegionId),true,"anchor present: "+cue.key);checks++;}
 assert.equal(canPreviewCue(cue).status,"BLOCKED_UNAUTHORIZED");checks++;
 assert.equal(canPreviewCue(cue,{primary:true,gmApproved:false,triggered:true}).status,"BLOCKED_UNAUTHORIZED");checks++;
 assert.equal(canPreviewCue(cue,{primary:true,gmApproved:true,triggered:false}).status,"BLOCKED_UNAUTHORIZED");checks++;
 const x=canPreviewCue(cue,{primary:true,gmApproved:true,triggered:true});
 if(cue.key==="m1-clock-chime")assert.equal(x.status,"BLOCKED_AUTHORED_CLOCK_GATE");
 else assert.equal(x.status,"ELIGIBLE_FOR_FUTURE_AUTHORED_PREVIEW");
 checks++;
 if(cue.kind.startsWith("one-shot")){assert.equal(canPreviewCue(cue,{primary:true,gmApproved:true,triggered:true,alreadyConsumed:true}).status,"SUPPRESSED_ALREADY_CONSUMED");checks++;}
 modeled++;
}
const digest=crypto.createHash("sha256").update(fs.readFileSync("cl52-horror-pacing-contract-v001.json")).digest("hex");
const result={operation:"central-lodge.cl52.local-contract-tests-v001",status:"PASS",noWrite:true,cueCount:modeled,scenes:scenes.length,checks,contractSha256:digest,noGameplayCanary:true};
fs.writeFileSync("receipts/cl52-horror-pacing-contract-test-v001.json",JSON.stringify(result,null,2)+"\n");
console.log("CL52_LOCAL_PACING_CONTRACT_PASS",JSON.stringify(result));