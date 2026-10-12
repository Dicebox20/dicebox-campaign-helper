// Static review of exact CL-50/F1 transfer destinations. NEVER executes Region scripts.
import {createRequire}from"node:module";import{join,resolve,dirname}from"node:path";
import{fileURLToPath}from"node:url";import{writeFile}from"node:fs/promises";
const require=createRequire(import.meta.url);
const{ClassicLevel}=require("C:/Program Files/Foundry Virtual Tabletop/resources/app/node_modules/classic-level");
const repo=resolve(dirname(fileURLToPath(import.meta.url)),"..");
const root=join(repo,"work","foundry-fixture-data-permanent","Data","worlds","dbx-test-world","data","scenes");
const out=join(repo,"work","clscale-central-lodge-migration-v001","clscale-teleport-static-gate-v001.json");
const routes=[
 {route:"F1→F2",behavior:"FElgIMZFVX5GleSy",sourceScene:"La9krMOMBhAhDLi6",sourceRegion:"iuoEHBXWtXgzYmMh",destinationScene:"HWitOe1wSid7MZ1y",destinationRegion:"pplHOCmUZOqFymOy",stableId:null},
 {route:"E1→M1",behavior:"HBtxj5OwVSOJdqnC",sourceScene:"Zq8iXByDVhHRbA7w",sourceRegion:"QS7OpvIilyyDpmLc",destinationScene:"U8S5ZrTjaPIkTUIL",destinationRegion:"4b8vfvKAKXBS6kfW",stableId:"dbx:central-lodge:m1:region:m1-transition-main-door",sourceStable:"dbx:central-lodge:m1"},
 {route:"T3→F1",behavior:"tSqhDN5CtAHzccmf",sourceScene:"aIKQmFiuXWipEdyb",sourceRegion:"Tkg7XpsF7X1P3ZVJ",destinationScene:"La9krMOMBhAhDLi6",destinationRegion:"zKNU1R3JGIMMt017",stableId:"dbx:central-lodge:f1:region:transition:t3-arrival",sourceStable:"dbx:central-lodge:f1"},
 {route:"T3→N3",behavior:"pZpcYXFn517t6L5U",sourceScene:"aIKQmFiuXWipEdyb",sourceRegion:"YElrtisbXN3DJ2Sw",destinationScene:"pHQvDUDlyWZFuNrX",destinationRegion:"RP1jYOH738xl9hks",stableId:"dbx:central-lodge:n3:region:n3-branch-railway",sourceStable:"dbx:central-lodge:n3"}
];
const db=new ClassicLevel(root,{keyEncoding:"utf8",valueEncoding:"utf8"});await db.open();
const got=async key=>{let x=await db.get(key);return x?JSON.parse(x):null;};
const findings=[],failures=[];
try {
 for(const item of routes){
  const prefix=id=>"!scenes.regions!"+id;
  const skey=prefix(item.sourceScene+"."+item.sourceRegion),dkey=prefix(item.destinationScene+"."+item.destinationRegion);
  const bkey="!scenes.regions.behaviors!"+item.sourceScene+"."+item.sourceRegion+"."+item.behavior;
  const [src,dst,behavior,sourceScene]=await Promise.all([got(skey),got(dkey),got(bkey),got("!scenes!"+item.sourceScene)]);
  const code=behavior?.system?.source??"";
  const destStable=dst?.flags?.world?.dicebox?.stableId??null;
  const srcStable=src?.flags?.world?.dicebox?.destinationStableSceneId??null;
  const result={route:item.route,sourceExists:!!src,destinationExists:!!dst,behaviorExists:!!behavior,
   destinationStableMatches:item.stableId?destStable===item.stableId:null,
   sourceDestinationStableMatches:item.sourceStable?srcStable===item.sourceStable:null,
   behaviorEnabled:behavior?.disabled===false,entryEvent:behavior?.system?.events??null,
   gmAuthoritative:/activeGMs|__primary/.test(code),gmConfirm:/DialogV2\.confirm/.test(code),
   pendingGuard:/pending\.has/.test(code),cooldownGuard:/declinedUntil/.test(code),
   usesRandomPlacement:/placement:\s*["']random["']/.test(code),
   usesFixedPlacement:/placement:\s*["'](?:exact|fixed)["']|\bx:\s*\d+\s*,\s*y:\s*\d+/.test(code),
   persistentTransferRecovery:/getFlag\([^\n]*transfer|setFlag\([^\n]*transfer|interruptedTransfer|recoveryState/.test(code),
   currentF1InnerWardResolved:item.route==="F1→F2"?(sourceScene?.flags?.world?.dicebox?.f1?.innerWardResolved??null):undefined};
  if(!result.sourceExists||!result.destinationExists||!result.behaviorExists||result.destinationStableMatches===false||result.sourceDestinationStableMatches===false)failures.push(item.route+" broken reference or flag");
  findings.push(result);
 }
}finally{await db.close();}
const report={status:failures.length?"REFERENCE_GATE_FAIL":"REFERENCE_GATE_PASS_WITH_RUNTIME_BLOCKERS",
 auditedAt:new Date().toISOString(),fixture:"dbx-test-world",findings,failures,
 blockers:["All four routes use random arrival; fixed arrival is not proven",
 "No script shows persistent interrupted-transfer recovery",
 "F1→F2 is puzzle-flag gated but has no GM confirmation dialog",
 "This static check cannot establish token ownership or in-game behavior"]};
if(process.argv.includes("--save"))await writeFile(out,JSON.stringify(report,null,2)+"\n");
console.log(JSON.stringify(report,null,2));if(failures.length)process.exitCode=1;