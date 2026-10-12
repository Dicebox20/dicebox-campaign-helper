// CL-50 R4 NO WRITE: ephemeral 1x1 and 2x2 token landing preflight for T2 B ↔ N3 West.
const OP="cl50.r4.arrival-footprint-readonly-v001",E=[
{name:"T2 Mouth B",scene:"ez9MSQ8QIO4cW6zo",region:"OOmnx3XAmw95E410",stable:"dbx:central-lodge:t2:region:mouth-b",rect:{x:3560,y:1230,width:300,height:360}},
{name:"N3 West",scene:"pHQvDUDlyWZFuNrX",region:"foYsFHsLXtCbfiyR",stable:"dbx:central-lodge:n3:region:n3-main-railway-west",rect:{x:670,y:1300,width:260,height:380}}];
const issues=[],rows=[],cross=(a,b)=>a.x*b.y-a.y*b.x,intersects=(a,b)=>a.x<b.x+b.width&&a.x+a.width>b.x&&a.y<b.y+b.height&&a.y+a.height>b.y;
if(game.world?.id!=="the-lost-mine-of-phandalin"||(game.version??game.release?.version)!=="14.367"||game.system.version!=="5.3.3")issues.push("world/stack drift");
const ledger=game.journal.get("xhlXv6CCH34HVga3")?.getFlag("world","dicebox")?.state??{};
if(ledger.revision!==1)issues.push("ledger changed");
for(const e of E){
const s=game.scenes.get(e.scene),r=s?.regions.get(e.region),f=r?.getFlag("world","dicebox")??{};
if(!r||f.stableId!==e.stable){issues.push("Endpoint "+e.name+" missing/stableId drift");continue;}
const src=r.toObject().shapes.find(a=>a.type==="rectangle");if(!src){issues.push("Nonrectangle mouth "+e.name);continue;}
const results=[];
for(const squares of [1,2]){
try{
const t=new foundry.documents.RegionDocument({name:"R4 temporary no-write placement probe",hidden:true,shapes:[{type:"rectangle",...e.rect,rotation:0,hole:false,gridBased:false}]},{parent:s});
const sample=(await t.spawnTokens([{name:"temporary R4",width:squares,height:squares,x:0,y:0,actorLink:false}],{create:false,placement:"center",snap:false,avoidOccupied:true}))?.[0];
if(!sample){results.push({squares,error:"no sample"});continue;}
const size=s.grid.size,box={x:sample.x,y:sample.y,width:Number(sample.width)*size,height:Number(sample.height)*size};
const oc=[...s.tokens].filter(q=>intersects(box,{x:q.x,y:q.y,width:q.width*size,height:q.height*size})).map(q=>q.id);
const overlaps=[...s.regions].filter(q=>q.toObject().shapes.some(sh=>sh.type==="rectangle"&&intersects(box,sh))).map(q=>({regionId:q.id,name:q.name,behaviors:[...q.behaviors].map(b=>({id:b.id,name:b.name}))}));
const from={x:src.x+src.width/2,y:src.y+src.height/2},to={x:box.x+box.width/2,y:box.y+box.height/2};
const walls=[...s.walls].filter(w=>{if(!w.c||w.move===0)return false;const v={x:to.x-from.x,y:to.y-from.y},cd={x:w.c[2]-w.c[0],y:w.c[3]-w.c[1]},ac={x:w.c[0]-from.x,y:w.c[1]-from.y},d=cross(v,cd);if(Math.abs(d)<0.00001)return false;const t=cross(ac,cd)/d,u=cross(ac,v)/d;return t>0.00001&&t<0.99999&&u>0.00001&&u<0.99999;}).map(w=>({id:w.id,door:w.door,ds:w.ds,move:w.move}));
const inBounds=box.x>=0&&box.y>=0&&box.x+box.width<=s.width&&box.y+box.height<=s.height;
const mouthCollision=intersects(box,src);
const activeOverlaps=overlaps.filter(x=>x.regionId!==e.region&&x.behaviors.length>0);
results.push({squares,box,inBounds,insideMouthCenter:sample.testInsideRegion(r),mouthFootprintCollision:mouthCollision,overlapRegions:overlaps,activeOverlaps,blockingWallCrossings:walls,occupiedBy:oc,persisted:s.tokens.has(sample.id),geometryPass:inBounds&&!mouthCollision&&!oc.length&&!walls.length});
}catch(err){results.push({squares,error:String(err).slice(0,500)});}
}
rows.push({endpoint:e.name,sceneId:s.id,regionId:r.id,stableId:f.stableId,sourceRegionBehaviors:r.behaviors.size,sourceFlags:f,mouthShape:src,ephemeralRectangle:e.rect,sceneTokens:s.tokens.size,sceneWallCount:s.walls.size,tests:results});
}
return{operation:OP,noWrite:true,status:issues.length?"BLOCKED":"READONLY_DIAGNOSTIC_PASS",issues,route:"R4 T2 Mouth B ↔ N3 West",rows,limits:["Only rectangle-footprint region intersections and sampled straight center-to-center wall crossings; not navmesh, door permission or player delivery","No token, Region, teleport, behavior or Macro persisted/executed","Route topology approved, exact landings still provisional","N3 notice overlap may intentionally trigger player-facing discovery"]};