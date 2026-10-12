const x=game.scenes.get("aIKQmFiuXWipEdyb"),f=game.scenes.get("La9krMOMBhAhDLi6");
const t=x?.regions.get("Tkg7XpsF7X1P3ZVJ"),a=f?.regions.get("zKNU1R3JGIMMt017");
return{operation:"cl50.t3-f1.exact-anchor-check",noWrite:true,sourceRegionExists:!!t,destinationRegionExists:!!a,
t3SceneId:x?.id,f1SceneId:f?.id,sourceRegionId:t?.id,destinationRegionId:a?.id,
sourceRole:t?.getFlag("world","dicebox")?.regionRole??null,
sourceBinding:t?.getFlag("world","dicebox")?.bindingStatus??null,
f1ArrivalStableId:a?.getFlag("world","dicebox")?.stableId??null,
f1DeclaredT3Arrival:f?.getFlag("world","dicebox")?.transitions?.t3Arrival??null,
destinationBehaviorCount:a?.behaviors.size,
sourceBehaviorCount:t?.behaviors.size};