/** M02 attempt #5 — no-write deterministic Geometry QA v003.
 * Run from repo root: npx tsx work/btr-underdark-expedition/M02-ATTEMPT5-GEOMETRY-AUDIT-v003.ts
 * Prereq: Node/tsx; no external geometry libraries. Does NOT certify image-ground precision or Foundry movement.
 */
import {readFileSync} from "node:fs";
import {assessRouteClearance,assessWallAlignment} from "../../packages/dicebox-compiler/src/geometry-tolerance.js";
import {validateSpatialBlueprint} from "../../packages/dicebox-compiler/src/spatial-blueprint.js";
const root="work/btr-underdark-expedition/";
const m=JSON.parse(readFileSync(root+"M02-ATTEMPT5-FEATURE-MANIFEST-CANDIDATE-v003.json","utf8"));
const bp=validateSpatialBlueprint(JSON.parse(readFileSync(root+"M02-ATTEMPT5-SPATIAL-BLUEPRINT-CANDIDATE-v003.json","utf8")));
type P=[number,number];const v=(a:any):P=>[Number(a[0]),Number(a[1])];
function footprint(shape:readonly any[]):P[]{
 if(typeof shape[0]==="number"){const [x,y,rx,ry]=shape.map(Number);return Array.from({length:128},(_,i):P=>[x+rx*Math.cos(2*Math.PI*i/128),y+ry*Math.sin(2*Math.PI*i/128)])}
 return shape.map(v);
}
const orientation=(a:P,b:P,c:P)=>(b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0]);
function intersects(a:P,b:P,c:P,d:P):boolean{
 const vals=[orientation(a,b,c),orientation(a,b,d),orientation(c,d,a),orientation(c,d,b)];
 if(vals[0]*vals[1]<0 && vals[2]*vals[3]<0)return true;
 if(vals.some(x=>Math.abs(x)<1e-12)){
  const on=(x:P,y:P,z:P)=>Math.abs(orientation(x,y,z))<1e-10 && z[0]>=Math.min(x[0],y[0])-1e-8 && z[0]<=Math.max(x[0],y[0])+1e-8 && z[1]>=Math.min(x[1],y[1])-1e-8 && z[1]<=Math.max(x[1],y[1])+1e-8;
  return on(a,b,c)||on(a,b,d)||on(c,d,a)||on(c,d,b)
 }
 return false;
}
function distPointSegment(p:P,a:P,b:P):number{
 const dx=b[0]-a[0],dy=b[1]-a[1],l=dx*dx+dy*dy;
 const t=l>0?Math.max(0,Math.min(1,((p[0]-a[0])*dx+(p[1]-a[1])*dy)/l)):0;
 return Math.hypot(p[0]-(a[0]+t*dx),p[1]-(a[1]+t*dy));
}
function segmentDistance(a:P,b:P,c:P,d:P):number{
 if(intersects(a,b,c,d))return 0;
 return Math.min(distPointSegment(a,c,d),distPointSegment(b,c,d),distPointSegment(c,a,b),distPointSegment(d,a,b))
}
function inside(p:P,poly:P[]):boolean{
 let result=false;
 for(let i=0;i<poly.length;i++){
  const a=poly[i],b=poly[(i+1)%poly.length];
  if(distPointSegment(p,a,b)<1e-8)return true;
  if((a[1]>p[1])!==(b[1]>p[1]) && p[0]<(b[0]-a[0])*(p[1]-a[1])/(b[1]-a[1])+a[0])result=!result
 }
 return result
}
function polylineDistance(line:P[],boundary:P[],closed:boolean):number{
 if(closed && line.some(p=>inside(p,boundary)))return 0;
 let md=Infinity;
 for(let i=0;i<line.length-1;i++)
  for(let j=0;j<(closed?boundary.length:boundary.length-1);j++)
   md=Math.min(md,segmentDistance(line[i],line[i+1],boundary[j],boundary[(j+1)%boundary.length]));
 return md;
}
const grounded=m.groundedObstacles.map((o:any)=>({key:o.key,points:footprint(o.footprintSourcePx)}));
const cliffs=Object.entries(m.cavernWallLines).map(([key,coords])=>({key,points:(coords as any[]).map(v)}));
const PX_PER_FT=1536/180,RADIUS=2.5*PX_PER_FT,EDGE_UNCERTAINTY_PX=6;
function routeIsSimple(line:P[]):boolean {
 if(line.length<2)return false;
 for(let i=0;i<line.length-1;i++){
  if(Math.hypot(line[i][0]-line[i+1][0],line[i][1]-line[i+1][1])<1e-8)return false;
  for(let j=i+2;j<line.length-1;j++){
   if(intersects(line[i],line[i+1],line[j],line[j+1]))return false;
  }
 }
 return true;
}
function shapePolygon(sh:any):P[]{
 if(sh.kind==="polygon")return sh.points.map((p:any):P=>[p.x,p.y]);
 if(sh.kind==="rectangle")return [[sh.x,sh.y],[sh.x+sh.width,sh.y],[sh.x+sh.width,sh.y+sh.height],[sh.x,sh.y+sh.height]];
 if(sh.kind==="ellipse")return Array.from({length:120},(_,i):P=>[sh.x+sh.width/2+sh.width/2*Math.cos(i*2*Math.PI/120),sh.y+sh.height/2+sh.height/2*Math.sin(i*2*Math.PI/120)]);
 throw new Error("unsupported Region shape "+sh.kind);
}
const regionById=new Map(bp.regions.map((r:any)=>[r.regionId,r]));
const anchorAssessments=bp.anchors.map((a:any)=>{
 const reg:any=regionById.get(a.targetRegionId);if(!reg)throw new Error("Missing Region "+a.targetRegionId);
 const p:P=[a.position.x,a.position.y],poly=shapePolygon(reg.shapes[0]);
 const edgeDist=Math.min(...poly.map((q,i)=>distPointSegment(p,q,poly[(i+1)%poly.length])));
 const insideShape=inside(p,poly);const fullClearance=insideShape&&edgeDist>=a.clearance;
 return {id:a.anchorId,inside:insideShape,regionFootprintClear:fullClearance,clearanceMarginScenePx:+(edgeDist-a.clearance).toFixed(3)};
});
const reviews=m.routes.map((r:any)=>{
 const line=(r.waypointsSourcePx as any[]).map(v);
 const nearestSolid=grounded.map((o:any)=>({id:o.key,px:polylineDistance(line,o.points,true)})).sort((a:any,b:any)=>a.px-b.px)[0];
 const nearestCliff=cliffs.map((o:any)=>({id:o.key,px:polylineDistance(line,o.points,false)})).sort((a:any,b:any)=>a.px-b.px)[0];
 const closest=Math.min(nearestSolid.px,nearestCliff.px);
 const simple=routeIsSimple(line);
 const reserve=closest-RADIUS-EDGE_UNCERTAINTY_PX;
 const policy=assessRouteClearance({routeId:r.semanticKey,kind:r.targetWidthFt===15?"main-road":"forest-trail",
  phase:"blueprint",observedMinWidthFt:(2*closest)/PX_PER_FT,measurementUncertaintyFt:(2*EDGE_UNCERTAINTY_PX)/PX_PER_FT,
  requiredFootprintFt:5,continuousWalkableSurface:"unknown",groundFootprintClassification:"uncertain",
  sweptTokenClearance:reserve>0?"unverified":"fail"});
 return {route:r.semanticKey,waypoints:line.length,nearestSolid:{id:nearestSolid.id,centerDistancePx:+nearestSolid.px.toFixed(3)},
  nearestCliff:{id:nearestCliff.id,centerDistancePx:+nearestCliff.px.toFixed(3)},requiredRadiusPx:+RADIUS.toFixed(3),
  assumedEdgeUncertaintyPx:EDGE_UNCERTAINTY_PX,minimumReserveAfterUncertaintyPx:+reserve.toFixed(3),
  isSimple:simple, draftedSweep:reserve>0&&simple?"PASS_DRAFT_GEOMETRY_ONLY":"FAIL_DRAFT_GEOMETRY",
  policyStatus:policy.status,policyCodes:policy.findings.map(x=>x.code)}
});
const wall=assessWallAlignment({wallId:"dbx:wall:m02-005-northeast-crest-groundrock-01",
 sourceUncertaintyFt:EDGE_UNCERTAINTY_PX/PX_PER_FT,groundFeature:"solid",functionalError:"none"});
const result={operation:"m02.005.full-routes.geometry-audit/v003",sourceImageSHA256:m.source.sha256,
 expectedImageSHA256:"878b465fde2c7e823e20bdd4f020e95abe0cd49740cb60e133f34c443a096bdf",
 blueprint:{walls:bp.walls.length,regions:bp.regions.length,anchors:bp.anchors.length,levels:bp.levels.length},
 groundedObstacleGroups:grounded.length,routes:reviews,anchorQA:anchorAssessments,wallAlignment:{status:wall.status,codes:wall.findings.map(x=>x.code)},
 status:"NEEDS_RECONCILIATION",paintReady:false,foundryWrites:0};
if(bp.walls.length!==203||bp.regions.length!==6||bp.anchors.length!==6||grounded.length!==23||
 m.source.sha256!==result.expectedImageSHA256||reviews[0].route!=="m02-005-main-road"||
 reviews[1].route!=="m02-005-north-loop"||reviews[1].draftedSweep!=="PASS_DRAFT_GEOMETRY_ONLY"||
 reviews[2].draftedSweep!=="PASS_DRAFT_GEOMETRY_ONLY"||anchorAssessments.some(a=>!a.regionFootprintClear)||reviews.some(r=>!r.isSimple)||wall.status!=="REVIEW")throw Error("QA_RECONCILIATION_MISMATCH");
console.log(JSON.stringify(result,null,2));
