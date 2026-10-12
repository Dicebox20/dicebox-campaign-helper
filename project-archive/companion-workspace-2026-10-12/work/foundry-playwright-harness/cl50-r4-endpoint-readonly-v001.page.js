// Read-only R4 T2 Mouth B ↔ N3 West endpoint discovery.
const e=[{name:"T2 Mouth B",scene:"ez9MSQ8QIO4cW6zo",region:"OOmnx3XAmw95E410"},{name:"N3 West",scene:"pHQvDUDlyWZFuNrX",region:"foYsFHsLXtCbfiyR"}],rows=[],errors=[];
for(const x of e){
const s=game.scenes.get(x.scene),r=s?.regions.get(x.region);
if(!r){errors.push("Missing "+x.name);continue;}
rows.push({name:x.name,sceneId:s.id,sceneName:s.name,regionId:r.id,flags:r.getFlag("world","dicebox"),shapes:r.toObject().shapes,behaviors:r.behaviors.size,scene:{width:s.width,height:s.height,gridSize:s.grid.size,wallCount:s.walls.size,tokenCount:s.tokens.size},otherRegions:[...s.regions].filter(q=>q.id!==r.id).map(q=>({id:q.id,name:q.name,shapes:q.toObject().shapes,behaviors:[...q.behaviors].map(b=>({id:b.id,name:b.name}))}))});
}
return{operation:"cl50.r4.endpoint-readonly-v001",noWrite:true,errors,rows};