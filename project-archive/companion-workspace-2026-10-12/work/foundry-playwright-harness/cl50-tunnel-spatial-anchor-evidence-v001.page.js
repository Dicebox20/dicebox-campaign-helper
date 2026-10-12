const keys=[["N1","MAbLfBqG7qIVVuLN"],["T1","ImeIdHbYb6kZKAdt"],["N2","4pc5akMBieHU7GvV"],["T2","ez9MSQ8QIO4cW6zo"],["N3","pHQvDUDlyWZFuNrX"],["T3","aIKQmFiuXWipEdyb"]],data=[];
for(const [k,id] of keys){
 const s=game.scenes.get(id),shape=[];
 for(const r of s?.regions??[]){
  if(!/mouth|railway tunnel|main railway|branch railway|rail tunnel|tunnel [AB]|entrance|exit/i.test(r.name))continue;
  const o=r.toObject();
  shape.push({name:r.name,id:r.id,stableId:r.getFlag("world","dicebox")?.stableId,shapes:o.shapes});
 }
 data.push({scene:k,sceneId:id,name:s?.name,dimensions:{width:s?.width,height:s?.height,padding:s?.padding,grid:s?.grid?.size},regions:shape});
}
return{operation:"cl50.tunnel-spatial-anchor-evidence.v001",noWrite:true,evidence:data,conclusion:"Coordinate orientation alone is not route authority without physically inspecting map topology."};