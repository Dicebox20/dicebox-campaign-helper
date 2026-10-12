/** Source-only N3 two-stage cartography patch. Never installs or calls Foundry. */
import {readFile,writeFile,mkdir,stat} from "node:fs/promises";
import path from "node:path";
import {fileURLToPath} from "node:url";
import {createHash} from "node:crypto";
const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const CATALOG=path.join(ROOT,"work/clscale-central-lodge-migration-v001/story-reconstruction-audit-20261010/full-evidence-catalog.json");
const OUT=path.join(ROOT,"work/clscale-central-lodge-migration-v001/n3-two-stage-20261010/staged-source-patch.json");
const hash=x=>createHash("sha256").update(x).digest("hex");
const ensure=(cond,msg)=>{if(!cond)throw Error("N3_SOURCE_DRIFT_STOP:"+msg);};
const PRELIMINARY="// N3 preliminary cartography: first-stage unlock, no Scene travel.\nif(event?.name && event.name!==\"tokenEnter\")return;\nconst __n3k=game.macros.find(m=>m.getFlag?.(\"world\",\"dicebox\")?.stableId===\"dbx:central-lodge:macro:runtime\");\nconst __n3t=event?.data?.token??event?.token??null;\nconst __n3a=__n3t?.actor??null;\nif(!__n3k||!__n3a)return;\nconst __n3pre=await __n3k.execute({actor:__n3a,token:__n3t,event,speaker:{dicebox:{\n contract:\"dicebox-region-behavior/v1\",action:\"gate\",trigger:\"TOKEN_ENTER\",\n statePath:\"puzzles.n3.routeOverlay.preliminaryResolved\",\n requirements:[{type:\"state\",path:\"puzzles.n3.routeOverlay.oldEstateSurvey\",equals:true},\n   {type:\"state\",path:\"puzzles.n3.routeOverlay.cultPassageDiagram\",equals:true}],\n incompleteMessage:\"<p>The estate survey and cult passage diagram must first be aligned.</p>\",\n successMessage:\"<p>Two layers reveal the abandoned railway spur. The complete survey still lacks a later fragment.</p>\"\n}}});\nif(![\"PASS\",\"ALREADY_RESOLVED\"].includes(__n3pre?.status))return __n3pre;\nconst __n3ledger=game.journal.find(j=>j.getFlag?.(\"world\",\"dicebox\")?.stableId===\"dbx:central-lodge:state\");\nconst __n3state=__n3ledger?.getFlag?.(\"world\",\"dicebox\")?.state??null;\nif(__n3state?.puzzles?.n3?.routeOverlay?.recentRouteFragment!==true)return __n3pre;\n// Preserve the original full three-layer overlay exactly for post-T3 return.\nreturn await (async()=> {\n";
const oldPath="puzzles.n3.routeOverlay.resolved";
const newPath="puzzles.n3.routeOverlay.preliminaryResolved";
export function buildN3TwoStagePatch(catalog){
 ensure(catalog?.status==="FROZEN_FIXTURE_SOURCE_VERIFIED","catalog");
 const b=catalog.behaviors??[];
 const get=s=>b.filter(x=>x.name.includes(s));
 const branches=get("three-proof hidden spur unlock");
 const finals=get("cartography-route-overlay");
 ensure(branches.length===1&&finals.length===1,"exact two behaviors");
 const [branch]=branches,[final]=finals;
 ensure(branch.sceneId===final.sceneId&&branch.sceneId==="pHQvDUDlyWZFuNrX","N3 scene ID");
 ensure(branch.regionId==="RP1jYOH738xl9hks"&&branch.id==="yikneH7tFfD5zsr6","branch identity");
 ensure(final.regionId==="VE8p4CvgzqvhihuF"&&final.id==="CAGlvXbm6uLupoRw","cartography identity");
 ensure(!branch.disabled&&!final.disabled,"unexpected disabled source");
 ensure(hash(branch.source)==="3ae5572a2e6df1e2a2611630163b90e73450ba400acd0a9d38ab4d4a2e6d4cbd","branch source hash mismatch");
 ensure(hash(final.source)==="e55af15f2d7ac960e283519f4fae3ed97748d7fcd3f7e0f598843b7be05753c0","overlay source hash mismatch");
 ensure(branch.source.split(oldPath).length===2,"one branch prerequisite expected");
 ensure(branch.source.includes("The restored board, railway switch, and completed route overlay agree."),"branch old success");
 const newBranch=branch.source.replace(oldPath,newPath)
  .replace("The restored board, railway switch, and completed route overlay agree.",
           "The restored board, railway switch, and preliminary route overlay agree.");
 ensure(!newBranch.includes(oldPath)&&newBranch.includes("puzzles.n3.departureBoardResolved")&&
  newBranch.includes("puzzles.n3.switchWheelInstalled"),"original proofs preserved");
 for(const p of ["puzzles.n3.routeOverlay.resolved","puzzles.n3.routeOverlay.oldEstateSurvey",
                  "puzzles.n3.routeOverlay.cultPassageDiagram","puzzles.n3.routeOverlay.recentRouteFragment"])
  ensure(final.source.includes(p),"original final gate:"+p);
 const newFinal=PRELIMINARY+final.source+"\n})();";
 ensure(!newFinal.includes("teleportToken")&&!newBranch.includes("teleportToken"),"no native teleport");
 const patches=[
  {sceneId:branch.sceneId,regionId:branch.regionId,behaviorId:branch.id,role:"n3_hidden_branch_logical_unlock",
   expectedOldHash:hash(branch.source),newSourceHash:hash(newBranch),expectedDisabled:false,newSource:newBranch},
  {sceneId:final.sceneId,regionId:final.regionId,behaviorId:final.id,role:"n3_preliminary_and_original_full_overlay",
   expectedOldHash:hash(final.source),newSourceHash:hash(newFinal),expectedDisabled:false,newSource:newFinal}
 ];
 return {schema:"mysterious-lodge-n3-two-stage-source-patch/v1",
  sourceAuthority:"OWNER_APPROVED_TWO_STAGE_20261010",
  worldId:"dbx-test-world",executionAuthorized:false,
  sourceEvidence:"Frozen copied fixture; recheck exact LIVE source hashes and GM before any installation",
  gateSemantics:{preliminary:"oldEstateSurvey+cultPassageDiagram",
   branch:"departureBoardResolved+switchWheelInstalled+preliminaryResolved",
   completed:"oldEstateSurvey+cultPassageDiagram+recentRouteFragment",
   fragmentLocation:"T3",physicalTravel:"NOT_INSTALLED_IN_THIS_PATCH",
   fastTravelPreview:"DISABLED_UNCHANGED"},
  patches};
}
if(process.argv.includes("--stage")){
 const data=JSON.parse(await readFile(CATALOG,"utf8"));
 const manifest=buildN3TwoStagePatch(data);
 await mkdir(path.dirname(OUT),{recursive:true});
 try{await stat(OUT);throw Error("STAGE_ALREADY_EXISTS_STOP");}
 catch(e){if(e.code!=="ENOENT")throw e;}
 await writeFile(OUT,JSON.stringify(manifest,null,2)+"\n",{flag:"wx"});
 console.log(JSON.stringify({status:"PASS_SOURCE_ONLY_PATCH_STAGED",path:OUT,
  patches:manifest.patches.map(x=>({id:x.behaviorId,old:x.expectedOldHash,new:x.newSourceHash})),
  foundryChanged:false},null,2));
}
