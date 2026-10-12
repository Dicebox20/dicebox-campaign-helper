// CL-50 R1: read-only exact-scene approach and API signature diagnostic. No changes.
const id="central-lodge.cl50.r1.footprint-api-readonly.v001";
const defs=[
 {name:"N1 East",scene:"MAbLfBqG7qIVVuLN",region:"xsitdXO94BHJkYKX",candidate:{x:3620,y:1470}},
 {name:"T1 Mouth A",scene:"ImeIdHbYb6kZKAdt",region:"ewIAYppRLvgIV1b7",candidate:{x:540,y:1440}}
];
const result=[];
for(const d of defs){
 const s=game.scenes.get(d.scene),r=s?.regions.get(d.region);
 if(!s||!r){result.push({endpoint:d.name,error:"missing"});continue;}
 const co=r.toObject().shapes??[], grid=s.grid?.size??120;
 const ws=[...s.walls].map(w=>({id:w.id,coords:w.c,move:w.move,sight:w.sight,door:w.door,ds:w.ds})).filter(w=>w.coords&&((w.coords[0]>d.candidate.x-800&&w.coords[0]<d.candidate.x+800)||(w.coords[2]>d.candidate.x-800&&w.coords[2]<d.candidate.x+800))&&((w.coords[1]>d.candidate.y-800&&w.coords[1]<d.candidate.y+800)||(w.coords[3]>d.candidate.y-800&&w.coords[3]<d.candidate.y+800)));
 const ts=[...s.tokens].map(t=>({id:t.id,name:t.name,actorId:t.actorId,x:t.x,y:t.y,width:t.width,height:t.height,isLinked:t.actorLink}));
 result.push({endpoint:d.name,scene:{id:s.id,name:s.name,dimensions:{width:s.width,height:s.height},grid,wallCount:s.walls.size,tokenCount:s.tokens.size,regionCount:s.regions.size},region:{id:r.id,stableId:r.getFlag("world","dicebox")?.stableId,flags:r.getFlag("world","dicebox"),shapes:co,behaviorCount:r.behaviors.size},tokens:ts,wallsNear:ws,api:{teleportSource:String(r.teleportToken).slice(0,4500),teleportPrototypeName:r.teleportToken?.name}});
}
return{operation:id,mode:"read",result,primaryActiveGm:game.users.filter(u=>u.active&&u.isGM).map(u=>({id:u.id,name:u.name}))};