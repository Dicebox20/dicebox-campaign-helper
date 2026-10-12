let obj=game.scenes.get("La9krMOMBhAhDLi6")?.regions.get("zKNU1R3JGIMMt017");let source=null;for(let i=0;obj&&i<9;i++,obj=Object.getPrototypeOf(obj)){if(obj.constructor?.name==="RegionDocument"){source=String(obj.constructor);break;}}
if(!source)throw Error("SOURCE_MISSING");
const matches=[...source.matchAll(/#getTokenDestinations\s*\(/g)].map(m=>m.index);
return{readOnly:true,matches,sections:matches.map(pos=>({pos,excerpt:source.slice(pos-60,pos+11500)}))};