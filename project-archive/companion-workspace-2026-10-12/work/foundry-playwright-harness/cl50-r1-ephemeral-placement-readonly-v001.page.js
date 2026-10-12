// No writes: test ephemeral RegionDocument + spawnTokens(create:false) for CL50 R1.
const E=[
 {key:"N1 East arrival",scene:"MAbLfBqG7qIVVuLN",mouth:"xsitdXO94BHJkYKX",rect:{x:3722,y:1310,width:136,height:320}},
 {key:"T1 Mouth A arrival",scene:"ImeIdHbYb6kZKAdt",mouth:"ewIAYppRLvgIV1b7",rect:{x:430,y:1240,width:380,height:400}}
];
const results=[];
for(const e of E){
 const s=game.scenes.get(e.scene),orig=s.regions.get(e.mouth),created=[];
 for(const size of [1,2]){
  const reg=new foundry.documents.RegionDocument({name:"CL50 nonpersisted R1 landing test",shapes:[{type:"rectangle",...e.rect,rotation:0,hole:false,gridBased:false}],hidden:true},{parent:s});
  try{
   const tok=await reg.spawnTokens([{name:"Ephemeral footprint only",width:size,height:size,actorLink:false,x:0,y:0,elevation:0}],{create:false,placement:"center",snap:false,avoidOccupied:true});
   const t=tok?.[0]; const bb={x:t?.x,y:t?.y,width:(t?.width??size)*s.grid.size,height:(t?.height??size)*s.grid.size};
   const intersects=[];for(const r of s.regions){if(t?.testInsideRegion(r))intersects.push({id:r.id,name:r.name,behaviors:r.behaviors.size});}
   created.push({size,result:"PASS_EPHEMERAL",position:bb,insideOriginMouth:t?.testInsideRegion(orig)??null,otherRegions:intersects,owned:t?.isOwner,ephemeralPersisted:s.tokens.has(t?.id)});
  }catch(err){created.push({size,result:"NO_PLACEMENT",error:String(err).slice(0,500)});}
 }
 results.push({key:e.key,scene:s.id,sourceMouth:orig.id,ephemeralRegion:e.rect,savedRegion:false,tests:created});
}
return {operation:"cl50.r1.ephemeral-placement.readonly.v001",noWrite:true,results};