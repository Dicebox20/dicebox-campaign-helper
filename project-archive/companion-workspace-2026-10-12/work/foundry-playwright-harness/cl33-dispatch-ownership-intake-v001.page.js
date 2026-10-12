// CL-33 inspect exact live dispatch and action ownership; read only
const k=game.macros.get("FHQiFYx6OntZVo9d")?.command??"",qs=["const isPrimaryGM","const primaryGM","const action =","const request =","macro.execute","speaker?.dicebox","speaker.dicebox","const tokenDoc","const actorDoc","const requireActor"];
const r=qs.map(q=>{const i=k.indexOf(q);return{q,i,excerpt:i<0?null:k.slice(Math.max(0,i-900),Math.min(k.length,i+2400))}});
const fromScene=game.scenes.get("sI4YVZZChgey1qNi"),out=[];
for(const r of fromScene?.regions??[])for(const b of r.behaviors){const src=b.system?.source??"";if(src.includes("macro:runtime")||src.includes("k.execute"))out.push({region:r.name,behavior:b.name,source:src.slice(0,1600)});}
return{operation:"cl33-dispatch-ownership-intake",noWrite:true,kernel:r,existingPatterns:out.slice(0,3)};