const src=game.scenes.get("aIKQmFiuXWipEdyb"),s=game.scenes.get("La9krMOMBhAhDLi6"),t=game.scenes.get("HWitOe1wSid7MZ1y");
const targets=[["T3 ancient",src,"Tkg7XpsF7X1P3ZVJ"],["F1 T3 arrival",s,"zKNU1R3JGIMMt017"],["F1 to F2",s,"iuoEHBXWtXgzYmMh"],["F2 F1 arrival",t,"pplHOCmUZOqFymOy"]];
const regions=targets.map(([key,scene,id])=>{const r=scene.regions.get(id),o=r?.toObject()??{};return{key,sceneId:scene.id,id,flags:r.getFlag("world","dicebox"),shapes:o.shapes,behaviorCount:r.behaviors.size,visibility:o.visibility,locked:o.locked,elevation:o.elevation};});
const f1Source=s.regions.get("iuoEHBXWtXgzYmMh").behaviors.get("FElgIMZFVX5GleSy").system.source;
const other={f1Transition: s.getFlag("world","dicebox")?.transitions,t3Route:src.getFlag("world","dicebox")?.route,firstGL:game.users.filter(u=>u.active&&u.isGM).sort((a,b)=>a.id.localeCompare(b.id))[0]?.id};
let uuid=await fromUuid("Scene.La9krMOMBhAhDLi6.Region.zKNU1R3JGIMMt017");
return{operation:"cl50.t3-f1-authority-inspection",noWrite:true,destinationResolvable:uuid?.documentName==="Region",resolvedId:uuid?.id,regions,f1Source,other};