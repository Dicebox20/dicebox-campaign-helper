// CL50 route contract fixtures: read-only exact current mouth geometry and state.
const entries=[
 {key:"N1 East",scene:"MAbLfBqG7qIVVuLN",region:"xsitdXO94BHJkYKX"},
 {key:"T1 A",scene:"ImeIdHbYb6kZKAdt",region:"ewIAYppRLvgIV1b7"},
 {key:"T1 B",scene:"ImeIdHbYb6kZKAdt",region:"91XmuJ9LGbsJY52W"},
 {key:"N2 A",scene:"4pc5akMBieHU7GvV",region:"lYps0Z5806d0W8wX"},
 {key:"N2 B",scene:"4pc5akMBieHU7GvV",region:"shIAThge7cNy0JjT"},
 {key:"T2 A",scene:"ez9MSQ8QIO4cW6zo",region:"3OGR0atcJokXJo6b"},
 {key:"T2 B",scene:"ez9MSQ8QIO4cW6zo",region:"OOmnx3XAmw95E410"},
 {key:"N3 West",scene:"pHQvDUDlyWZFuNrX",region:"foYsFHsLXtCbfiyR"}
];const out=[],errors=[];
for(const e of entries){const s=game.scenes.get(e.scene),r=s?.regions.get(e.region);if(!r){errors.push("Missing "+e.key);continue;}const fs=r.getFlag("world","dicebox")??{};out.push({...e,stableId:fs.stableId,bindingStatus:fs.bindingStatus??null,destinationStableSceneId:fs.destinationStableSceneId??null,sourceBehaviorCount:r.behaviors.size,mouthRect:r.toObject().shapes.find(sh=>sh.type==="rectangle"),grid:s.grid.size,sceneTokens:s.tokens.size});}
return{operation:"cl50.eight-mouth-geometry-check-v001",noWrite:true,status:errors.length?"BLOCKED":"PASS",world:game.world.id,system:game.system.version,foundry:game.version,errors,mouths:out};