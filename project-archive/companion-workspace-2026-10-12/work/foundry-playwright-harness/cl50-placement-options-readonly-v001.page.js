// CL-50 placement semantics research, non-persisted Token/Region only. No teleport.
const scene=game.scenes.get("ez9MSQ8QIO4cW6zo");
const mouth=scene?.regions.get("OOmnx3XAmw95E410");
const errors=[];
if(game.world?.id!=="the-lost-mine-of-phandalin" || (game.version??game.release?.version)!=="14.367" || game.system?.version!=="5.3.3") errors.push("Stack drift");
if(!scene||!mouth||mouth.getFlag("world","dicebox")?.stableId!=="dbx:central-lodge:t2:region:mouth-b")errors.push("Target drift");
if(errors.length)return{operation:"CL50-PLACEMENT-OPTIONS-READONLY",noWrite:true,status:"BLOCKED",errors};
const ephemeral=new foundry.documents.RegionDocument({name:"Temporary CL50 offset diagnostic",hidden:true,shapes:[{type:"rectangle",x:3560,y:1230,width:300,height:360,rotation:0,gridBased:false,hole:false}]},{parent:scene});
const scenario=[
 {label:"center no offset",options:{placement:"center",snap:false,avoidOccupied:false}},
 {label:"center offset (120,0)",options:{placement:"center",snap:false,offset:{x:120,y:0},avoidOccupied:false}},
 {label:"center offset (-120,0)",options:{placement:"center",snap:false,offset:{x:-120,y:0},avoidOccupied:false}},
 {label:"relative no offset",options:{placement:"relative",snap:false,avoidOccupied:false}},
 {label:"relative offset (120,0)",options:{placement:"relative",snap:false,offset:{x:120,y:0},avoidOccupied:false}},
 {label:"random no snap",options:{placement:"random",snap:false,avoidOccupied:false}}
];
const samples=[];
for(const s of scenario) {
 const result=[];
 for(let j=0;j<2;j++){
  try{
   const tok=(await ephemeral.spawnTokens([{name:"CL50 ephemeral proof only",x:0,y:0,width:1,height:1,actorLink:false}],{...s.options,create:false}))?.[0];
   result.push(tok?{x:tok.x,y:tok.y,stored:scene.tokens.has(tok.id),returnMouthCenter:tok.testInsideRegion(mouth)}:{error:"No token returned"});
  }catch(e){result.push({error:String(e).slice(0,350)});}
 }
 samples.push({scenario:s.label,options:s.options,repeat:result});
}
return{operation:"CL50-PLACEMENT-OPTIONS-READONLY",noWrite:true,status:"OBSERVED_ONLY",world:game.world.id,version:game.version,sceneId:scene.id,sourceBehaviorCount:mouth.behaviors.size,sceneTokenCount:scene.tokens.size,ephemeralRegionPersisted:scene.regions.has(ephemeral.id),samples,interpretationLimit:"spawnTokens create:false observations do not prove any teleport destination will be pinned or that source/destination move is collision-safe"};