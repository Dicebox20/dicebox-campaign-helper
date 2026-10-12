// CL-50 railway candidate landing preview. READ ONLY: does not establish canonical route authority.
const expected={world:"the-lost-mine-of-phandalin",foundry:"14.367",dnd5e:"5.3.3",ledgerRevision:1};
const entries=[
 {key:"N1 East",scene:"MAbLfBqG7qIVVuLN",region:"xsitdXO94BHJkYKX",side:"right"},
 {key:"T1 Mouth A",scene:"ImeIdHbYb6kZKAdt",region:"ewIAYppRLvgIV1b7",side:"left"},
 {key:"T1 Mouth B",scene:"ImeIdHbYb6kZKAdt",region:"91XmuJ9LGbsJY52W",side:"right"},
 {key:"N2 Tunnel A",scene:"4pc5akMBieHU7GvV",region:"lYps0Z5806d0W8wX",side:"left"},
 {key:"N2 Tunnel B",scene:"4pc5akMBieHU7GvV",region:"shIAThge7cNy0JjT",side:"right"},
 {key:"T2 Mouth A",scene:"ez9MSQ8QIO4cW6zo",region:"3OGR0atcJokXJo6b",side:"left"},
 {key:"T2 Mouth B",scene:"ez9MSQ8QIO4cW6zo",region:"OOmnx3XAmw95E410",side:"right"},
 {key:"N3 West",scene:"pHQvDUDlyWZFuNrX",region:"foYsFHsLXtCbfiyR",side:"left"}
];
const errors=[],warn=[],rows=[];
const ver=game.version??game.release?.version;
const ledger=game.journal.get("xhlXv6CCH34HVga3")?.getFlag("world","dicebox")?.state??{};
if(game.world.id!==expected.world||ver!==expected.foundry||game.system.version!==expected.dnd5e)errors.push("Exact runtime target differs");
if(ledger.revision!==expected.ledgerRevision)errors.push("Ledger revision changed: "+String(ledger.revision));
const EPS=0.00001;
const segIntersect=(a,b,c,d)=>{
 const cross=(u,v)=>u.x*v.y-u.y*v.x;
 const ab={x:b.x-a.x,y:b.y-a.y},ac={x:c.x-a.x,y:c.y-a.y},cd={x:d.x-c.x,y:d.y-c.y};
 const den=cross(ab,cd);if(Math.abs(den)<EPS)return false;
 const t=cross(ac,cd)/den,u=cross(ac,ab)/den;return t>EPS&&t<1-EPS&&u>EPS&&u<1-EPS;
};
for(const e of entries){
 const scene=game.scenes.get(e.scene),r=scene?.regions.get(e.region);
 if(!scene||!r){errors.push("Missing endpoint "+e.key);continue;}
 const f=r.getFlag("world","dicebox")??{},o=r.toObject(),rect=o.shapes.find(a=>a.type==="rectangle");
 if(!rect){errors.push("Non-rectangle endpoint "+e.key);continue;}
 const size=scene.grid?.size??120;
 const centerY=rect.y+rect.height/2;
 const centerX=rect.x+rect.width/2;
 const x=e.side==="left"?rect.x+rect.width+2*size:rect.x-2*size;
 const y=centerY;
 const anchor={x:centerX,y:centerY},target={x,y};
 const walls=[...scene.walls].filter(w=>{const a=w.c;if(!a||a.length<4)return false;const [x1,y1,x2,y2]=a;return segIntersect(anchor,target,{x:x1,y:y1},{x:x2,y:y2})}).map(w=>({id:w.id,door:w.door,ds:w.ds,move:w.move}));
 const margin=0.5*size;
 const atInOtherRegions=[];
 for(const other of scene.regions){
  if(other.id===r.id)continue;
  // Rectangular regions only; record other geometry as unknown.
  const shapes=other.toObject().shapes??[];
  if(shapes.some(sh=>sh.type==="rectangle"&&sh.x<=x&&x<=sh.x+sh.width&&sh.y<=y&&y<=sh.y+sh.height))atInOtherRegions.push({id:other.id,name:other.name,behaviors:other.behaviors.size});
 }
 const tokens=[...scene.tokens].filter(t=>Math.abs((t.x+(t.width??1)*size/2)-x)<(t.width??1)*size/2+margin&&Math.abs((t.y+(t.height??1)*size/2)-y)<(t.height??1)*size/2+margin).map(t=>({id:t.id,name:t.name}));
 const inSource=x>=rect.x&&x<=rect.x+rect.width&&y>=rect.y&&y<=rect.y+rect.height;
 const inBounds=x>=size&&x<=scene.width-size&&y>=size&&y<=scene.height-size;
 const blockers=[...(inSource?["insideArrivalMouth"]:[]),...(inBounds?[]:["outsideSafeMapBounds"]),...(walls.length?["wallSegmentOnApproach"]:[]),...(tokens.length?["tokenOccupancy"]:[])];
 if(otherCollisionUnsafe(atInOtherRegions))blockers.push("otherActiveRegionOverlap");
 function otherCollisionUnsafe(a){return a.some(n=>n.behaviors>0&&/transition|mouth|railway|tunnel|portal|exit/i.test(n.name));}
 const row={key:e.key,sceneId:e.scene,regionId:e.region,stableId:f.stableId,sourceRect:{x:rect.x,y:rect.y,width:rect.width,height:rect.height},candidateCenter:{x,y},anchorCenter:anchor,wallSegmentIntersections:walls,overlappingRectangularRegions:atInOtherRegions,nearbyTokenIds:tokens,blockers,limitations:["Candidate is center point, not a token-sized collision polygon","Checks only rectangular Region overlap and straight-line wall crossing","No navmesh, sight, or dynamic access guarantees","No one-way route authority or approved destination implied"]}; rows.push(row);
 if(blockers.length)warn.push({endpoint:e.key,blockers});
}
return{operation:"cl50.railway-landing-readonly-v001",status:errors.length?"BLOCKED":"PASS_WITH_REVIEW",noWrite:true,errors,warnings:warn,counts:{endpoints:rows.length,cleanCenterCandidates:rows.filter(r=>!r.blockers.length).length},runtime:{world:game.world.id,foundry:ver,dnd5e:game.system.version,ledgerRevision:ledger.revision},preApprovalOnly:true,proposedRoutePairs:[["N1 East","T1 Mouth A"],["T1 Mouth B","N2 Tunnel A"],["N2 Tunnel B","T2 Mouth A"],["T2 Mouth B","N3 West"]],landingCandidates:rows};
