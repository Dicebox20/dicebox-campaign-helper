// Read-only derived candidate grid constraints. No scene, actor or token updates.
const ids=["0CSBwzcszPKyaB8u","5K1uASAARnX8aZhP","EDdktL7VUihbpKe9","UNySMm7YkyYfh41x","Zq8iXByDVhHRbA7w","sI4YVZZChgey1qNi","iqfCcDpEer4pwrJj","DLcheEi6e5OHOYmU","U8S5ZrTjaPIkTUIL","JZkxX6lUQe8Nc8xJ","LXTA8mx1rJ2L6e2J","MAbLfBqG7qIVVuLN","4pc5akMBieHU7GvV","pHQvDUDlyWZFuNrX","if9iWDRjSwI87EeX","PVf6Gbrv9HbB88uZ","La9krMOMBhAhDLi6","ImeIdHbYb6kZKAdt","ez9MSQ8QIO4cW6zo","aIKQmFiuXWipEdyb","HWitOe1wSid7MZ1y"];
const scenes=ids.map(id=>{const s=game.scenes.get(id);if(!s)return{id,missing:true};
const doorLengths=s.walls.contents.filter(w=>w.door>0).map(w=>Math.round(Math.hypot(w.c[2]-w.c[0],w.c[3]-w.c[1]))).sort((a,b)=>a-b);
const dims=s.regions.contents.map(r=>({id:r.id,name:r.name,
 minDim:r.shapes.length?Math.min(...r.shapes.map(sh=>Math.min(sh.width??Infinity,sh.height??Infinity))):null,
 maxDim:r.shapes.length?Math.max(...r.shapes.map(sh=>Math.max(sh.width??0,sh.height??0))):null,
 events:r.behaviors.contents.flatMap(b=>Array.from(b.system?.events??[])),
 flags:r.getFlag('world','dicebox')??null}));
const a=dims.map(x=>x.minDim).filter(x=>x!=null&&Number.isFinite(x)).sort((a,b)=>a-b);
return{id,name:s.name,doorLengths,shortestDoor:doorLengths[0]??null,
 regionMin:a[0]??null,regionQuartile:a[Math.floor(a.length/4)]??null,
 smallestRegions:dims.sort((a,b)=>(a.minDim??1e8)-(b.minDim??1e8)).slice(0,4).map(x=>({name:x.name,minDim:x.minDim,events:x.events})),
 docTokens:s.tokens.contents.map(t=>({id:t.id,name:t.name,x:t.x,y:t.y,width:t.width,height:t.height,actor:t.actorId})),
 gridSchema:{class:s.grid?.constructor?.name,size:s.grid?.size,type:s.grid?.type},
 lighting:s.lights.size,vision:s.tokenVision};
});
let metadata={};
try{const fld=game.scenes.documentClass?.schema?.fields?.grid?.fields?.size??game.scenes.constructor?.documentClass?.schema?.fields?.grid?.fields?.size??null;metadata={min:fld?.min,max:fld?.max,initial:fld?.initial,type:fld?.constructor?.name}}catch(e){metadata={error:String(e)}}
return{operation:'cl92-grid-constraint-review-v001',noWrite:true,scenes,metadata};
