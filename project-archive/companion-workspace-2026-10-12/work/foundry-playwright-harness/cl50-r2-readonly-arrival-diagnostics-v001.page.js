// Read-only CL-50 R2 spatial proof; no teleport, no persistent token/Region changes.
const OP="cl50.r2.arrival-diagnostics-v001",E=[
 {key:"N2 Tunnel A arrival",scene:"4pc5akMBieHU7GvV",mouth:"lYps0Z5806d0W8wX",stable:"dbx:central-lodge:n2:region:n2-railway-tunnel-a",targetRect:{x:450,y:1380,width:110,height:320}},
 {key:"T1 Mouth B arrival",scene:"ImeIdHbYb6kZKAdt",mouth:"91XmuJ9LGbsJY52W",stable:"dbx:central-lodge:t1:region:mouth-b",targetRect:{x:3600,y:1240,width:300,height:400}}];
const expected={world:"the-lost-mine-of-phandalin",foundry:"14.367",system:"5.3.3",ledgerRevision:1};
const issues=[],results=[];
const a=game.scenes.get("4pc5akMBieHU7GvV"),b=game.scenes.get("ImeIdHbYb6kZKAdt");
if(game.world?.id!==expected.world||(game.version??game.release?.version)!==expected.foundry||game.system?.version!==expected.system)issues.push("stack drift");
const ledger=game.journal.get("xhlXv6CCH34HVga3")?.getFlag("world","dicebox")?.state??{};
if(ledger.revision!==1)issues.push("ledger revision changed");
for(const e of E){
 const scene=game.scenes.get(e.scene),mouth=scene?.regions.get(e.mouth);
 if(!scene||!mouth||mouth.getFlag("world","dicebox")?.stableId!==e.stable){issues.push(e.key+" endpoint drift");continue;}
 const samples=[];
 for(const sz of [1,2]){
  const temp=new foundry.documents.RegionDocument({name:"Ephemeral R2 inspection only",hidden:true,shapes:[{type:"rectangle",...e.targetRect,rotation:0,hole:false,gridBased:false}]},{parent:scene});
  try {
   const t=(await temp.spawnTokens([{name:"Read only temporary R2",width:sz,height:sz,x:0,y:0,actorLink:false}],{create:false,placement:"center",snap:false,avoidOccupied:true}))?.[0];
   if(!t){samples.push({size:sz,error:"no sample"});continue;}
   const width=Number(t.width)*scene.grid.size,height=Number(t.height)*scene.grid.size,box={x:t.x,y:t.y,width,height};
   const rshape=mouth.toObject().shapes.find(sh=>sh.type==="rectangle");
   const mouthRectangleCollision=box.x<rshape.x+rshape.width&&box.x+box.width>rshape.x&&box.y<rshape.y+rshape.height&&box.y+box.height>rshape.y;
   const overlaps=[...scene.regions].filter(r=>r.toObject().shapes.some(sh=>sh.type==="rectangle"&&box.x<sh.x+sh.width&&box.x+width>sh.x&&box.y<sh.y+sh.height&&box.y+height>sh.y)).map(r=>({id:r.id,name:r.name,behaviors:[...r.behaviors].map(b=>b.name)}));
   const occupied=[...scene.tokens].filter(other=>box.x<other.x+Number(other.width)*scene.grid.size&&box.x+width>other.x&&box.y<other.y+Number(other.height)*scene.grid.size&&box.y+height>other.y).map(other=>other.id);
   const src={x:(rshape.x+rshape.width/2),y:(rshape.y+rshape.height/2)},dest={x:box.x+width/2,y:box.y+height/2};
   const crosses=(w)=>{const q=w.c;const cross=(p,v)=>p.x*v.y-p.y*v.x;const ab={x:dest.x-src.x,y:dest.y-src.y},cd={x:q[2]-q[0],y:q[3]-q[1]},ac={x:q[0]-src.x,y:q[1]-src.y},den=cross(ab,cd);if(Math.abs(den)<1e-9)return false;const t=cross(ac,cd)/den,u=cross(ac,ab)/den;return t>0.00001&&t<0.99999&&u>0.00001&&u<0.99999};
   const blockingWalls=[...scene.walls].filter(w=>w.move!==0&&crosses(w)).map(w=>({id:w.id,move:w.move,door:w.door,ds:w.ds}));
   const flags=mouth.getFlag("world","dicebox")??{};
   samples.push({size:sz,topLeft:{x:box.x,y:box.y},box,insideReturnTrigger:t.testInsideRegion(mouth),mouthRectangleCollision,overlaps,occupied,blockingWalls,ghostPersisted:scene.tokens.has(t.id),viableGeometricPreview:!mouthRectangleCollision&&!occupied.length&&!blockingWalls.length});
  }catch(err){samples.push({size:sz,error:String(err)});}
 }
 results.push({endpoint:e.key,sceneId:e.scene,regionId:mouth.id,stableId:e.stable,mouthShape:mouth.toObject().shapes,targetRect:e.targetRect,behaviorCount:mouth.behaviors.size,flags:mouth.getFlag("world","dicebox"),sceneTokens:scene.tokens.size,samples});
}
return{operation:OP,noWrite:true,status:issues.length?"BLOCKED":"READONLY_DIAGNOSTIC_PASS",issues,route:"R2 T1 Mouth B <-> N2 Tunnel A",regionCount:{N2:a?.regions.size,T1:b?.regions.size},results,caveats:["Only rectangles and straight Wall-crossing sample, not navmesh or live event delivery","Ephemeral tokens never persisted; no Region added","User approval resolves topology, not exact landing positions or gameplay canary"]};