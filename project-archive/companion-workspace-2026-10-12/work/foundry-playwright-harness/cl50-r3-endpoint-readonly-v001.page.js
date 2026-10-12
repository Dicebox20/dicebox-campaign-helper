// CL50 R3 live endpoint geometry discovery; no mutations, no tokens generated.
const scope=[
{key:"N2 Tunnel B",scene:"4pc5akMBieHU7GvV",region:"shIAThge7cNy0JjT"},
{key:"T2 Mouth A",scene:"ez9MSQ8QIO4cW6zo",region:"3OGR0atcJokXJo6b"}
];
const rows=[],issues=[];
for(const e of scope){
 const s=game.scenes.get(e.scene),r=s?.regions.get(e.region);
 if(!r){issues.push("Missing "+e.key);continue;}
 rows.push({key:e.key,sceneId:s.id,sceneName:s.name,regionId:r.id,flags:r.getFlag("world","dicebox")??null,shapes:r.toObject().shapes,regionBehaviors:r.behaviors.size,sceneDimensions:{width:s.width,height:s.height},gridSize:s.grid.size,walls:s.walls.size,tokens:[...s.tokens].map(t=>({id:t.id,x:t.x,y:t.y,width:t.width,height:t.height})),otherRectRegions:[...s.regions].filter(q=>q.id!==r.id).map(q=>({id:q.id,name:q.name,shapes:q.toObject().shapes,behaviors:[...q.behaviors].map(b=>({id:b.id,name:b.name}))}))});
}
return {operation:"cl50.r3.endpoint-readonly-v001",noWrite:true,issues,rows};