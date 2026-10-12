// Read-only canonical Central Lodge scene art and grid calibration inventory.
const ids=["0CSBwzcszPKyaB8u","5K1uASAARnX8aZhP","EDdktL7VUihbpKe9","UNySMm7YkyYfh41x","Zq8iXByDVhHRbA7w","sI4YVZZChgey1qNi","iqfCcDpEer4pwrJj","DLcheEi6e5OHOYmU","U8S5ZrTjaPIkTUIL","JZkxX6lUQe8Nc8xJ","LXTA8mx1rJ2L6e2J","MAbLfBqG7qIVVuLN","4pc5akMBieHU7GvV","pHQvDUDlyWZFuNrX","if9iWDRjSwI87EeX","PVf6Gbrv9HbB88uZ","La9krMOMBhAhDLi6","ImeIdHbYb6kZKAdt","ez9MSQ8QIO4cW6zo","aIKQmFiuXWipEdyb","HWitOe1wSid7MZ1y"];
const scenes=ids.map(id=>game.scenes.get(id)).map(s=>({
 id:s?.id,name:s?.name,navName:s?.navName,folder:s?.folder?.name,active:s?.active,
 grid:{type:s?.grid?.type,size:s?.grid?.size,distance:s?.grid?.distance,units:s?.grid?.units,style:s?.grid?.style,thickness:s?.grid?.thickness},
 dimensions:{width:s?.width,height:s?.height,padding:s?.padding,background:s?.background?.toObject?.()??s?.background,initial:s?.dimensions?{width:s.dimensions.width,height:s.dimensions.height,sceneWidth:s.dimensions.sceneWidth,sceneHeight:s.dimensions.sceneHeight,sceneX:s.dimensions.sceneX,sceneY:s.dimensions.sceneY}:null},
 backdrop:s?.background?.src??s?.background?.texture?.src??null,foreground:s?.foreground,
 stats:{tokens:s?.tokens?.size,walls:s?.walls?.size,tiles:s?.tiles?.size,regions:s?.regions?.size,notes:s?.notes?.size},
 sampleTokens:s?.tokens?.contents?.slice(0,3).map(t=>({name:t.name,actorId:t.actorId,width:t.width,height:t.height,x:t.x,y:t.y,textureScaleX:t.texture?.scaleX,textureScaleY:t.texture?.scaleY}))??[],
 flags:s?.getFlag?.('world','dicebox')??null
}));
return{operation:'cl92.scene-grid-calibration-v001',noWrite:true,stack:{foundry:game.version,dnd5e:game.system.version,world:game.world.id},scenes};
