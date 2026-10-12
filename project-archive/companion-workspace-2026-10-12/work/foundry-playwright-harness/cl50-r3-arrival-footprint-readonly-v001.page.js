// CL-50 R3 N2 Tunnel B ↔ T2 Mouth A. Read-only ephemeral token footprint and wall geometry preflight.
const OP="cl50.r3.arrival-footprint-readonly-v001";
const expected={world:"the-lost-mine-of-phandalin",foundry:"14.367",dnd5e:"5.3.3",revision:1};
const endpoints=[
{key:"N2 Tunnel B arrival",scene:"4pc5akMBieHU7GvV",mouth:"shIAThge7cNy0JjT",stable:"dbx:central-lodge:n2:region:n2-railway-tunnel-b",rect:{x:3730,y:1360,width:140,height:360}},
{key:"T2 Mouth A arrival",scene:"ez9MSQ8QIO4cW6zo",mouth:"3OGR0atcJokXJo6b",stable:"dbx:central-lodge:t2:region:mouth-a",rect:{x:440,y:1090,width:360,height:360}}
];
const issues=[],results=[];
if(game.world?.id!==expected.world||(game.version??game.release?.version)!==expected.foundry||game.system?.version!==expected.dnd5e)issues.push("runtime identity differs");
const ledger=game.journal.get("xhlXv6CCH34HVga3")?.getFlag("world","dicebox")?.state??{};
if(ledger.revision!==expected.revision)issues.push("ledger revision differs");
const cross=(a,b)=>a.x*b.y-a.y*b.x,segCross=(p,q,w)=>{const c=w.c;if(!c||c.length<4||w.move===0)return false;const ab={x:q.x-p.x,y:q.y-p.y},cd={x:c[2]-c[0],y:c[3]-c[1]},ac={x:c[0]-p.x,y:c[1]-p.y};const det=cross(ab,cd);if(Math.abs(det)<0.00001)return false;const t=cross(ac,cd)/det,u=cross(ac,ab)/det;return t>0.00001&&t<0.99999&&u>0.00001&&u<0.99999;};
const boxHits=(a,b)=>a.x<b.x+b.width&&a.x+a.width>b.x&&a.y<b.y+b.height&&a.y+a.height>b.y;
for(const e of endpoints){
 const scene=game.scenes.get(e.scene),mouth=scene?.regions.get(e.mouth);
 if(!scene||!mouth||mouth.getFlag("world","dicebox")?.stableId!==e.stable){issues.push(e.key+" endpoint/stableId mismatch");continue;}
 const shape=mouth.toObject().shapes.find(q=>q.type==="rectangle");
 if(!shape){issues.push(e.key+" nonrectangular mouth");continue;}
 const flags=mouth.getFlag("world","dicebox")??{};
 const tests=[];
 for(const squares of [1,2]){
  try{
   const tmp=new foundry.documents.RegionDocument({name:"CL50 R3 nonpersisted test",hidden:true,shapes:[{type:"rectangle",...e.rect,rotation:0,gridBased:false,hole:false}]},{parent:scene});
   const sample=(await tmp.spawnTokens([{name:"R3 ephemeral probe",width:squares,height:squares,x:0,y:0,actorLink:false}],{create:false,placement:"center",snap:false,avoidOccupied:true}))?.[0];
   if(!sample){tests.push({squares,error:"no ephemeral position"});continue;}
   const size=scene.grid.size,box={x:sample.x,y:sample.y,width:Number(sample.width)*size,height:Number(sample.height)*size};
   const origin={x:shape.x+shape.width/2,y:shape.y+shape.height/2};
   const arrival={x:box.x+box.width/2,y:box.y+box.height/2};
   const wallCrossings=[...scene.walls].filter(w=>segCross(origin,arrival,w)).map(w=>({id:w.id,door:w.door,ds:w.ds,move:w.move}));
   const occupied=[...scene.tokens].filter(t=>boxHits(box,{x:t.x,y:t.y,width:Number(t.width)*size,height:Number(t.height)*size})).map(t=>t.id);
   const overlapping=[...scene.regions].filter(r=>r.toObject().shapes.some(sh=>sh.type==="rectangle"&&boxHits(box,sh))).map(r=>({id:r.id,name:r.name,behaviors:[...r.behaviors].map(b=>({id:b.id,name:b.name}))}));
   const mouthFootprintCollision=boxHits(box,shape),centerInside=sample.testInsideRegion(mouth),inBounds=box.x>=0&&box.y>=0&&box.x+box.width<=scene.width&&box.y+box.height<=scene.height;
   tests.push({squares,box,returnMouthCenterTest:centerInside,returnMouthFootprintCollision:mouthFootprintCollision,overlappingRegions:overlapping,blockingWallCrossings:wallCrossings,occupiedBy:occupied,inSceneBounds:inBounds,persisted:scene.tokens.has(sample.id),geometryPass:inBounds&&!mouthFootprintCollision&&wallCrossings.length===0&&occupied.length===0});
  }catch(err){tests.push({squares,error:String(err).slice(0,700)});}
 }
 results.push({key:e.key,sceneId:scene.id,regionId:mouth.id,stableId:flags.stableId,flags,mouthShape:shape,sourceRegionBehaviors:mouth.behaviors.size,sceneTokens:scene.tokens.size,sceneWalls:scene.walls.size,proposedLandingRectangle:e.rect,tests});
}
return{operation:OP,noWrite:true,status:issues.length?"BLOCKED":"READONLY_DIAGNOSTIC_PASS",issues,route:"R3 N2 Tunnel B <-> T2 Mouth A",results,limitations:["Rectangular token-footprint vs Region intersection, not runtime movement/navmesh certification","Wall centerline crossing is sampled, not full polygonal raycast or door permission verification","No token or Region persisted, no teleport or Macro executed","GM/player canary still required"]};