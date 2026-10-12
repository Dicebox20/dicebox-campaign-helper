// CL13 read-only M1 events, U1/E4 source preview and kernel message contract.
const specs=[
 ['M1','U8S5ZrTjaPIkTUIL',['0Ek2b2Ongw0RNNeK','5H97UQm6VF3vw5Ru','LmLxI7Ao8uFTyShb','3tIrR12uv8ppFkOb']],
 ['U1','if9iWDRjSwI87EeX',['fgo4icYioZu3ekbr','V1JRfiR56dgVGRa3']],
 ['E4','DLcheEi6e5OHOYmU',['wzANpkb9bbFlB8z9','eRjDUWAIS206MyZV','BjAgwMeaS9UUi7er']]
];
const scenes=specs.map(([label,sid,rids])=>{
 const scene=game.scenes.get(sid);
 return {scene:label,sceneId:sid,regions:rids.map(rid=>{
 const r=scene?.regions.get(rid);
 return {id:rid,regionName:r?.name,regionStableId:r?.getFlag('world','dicebox')?.stableId,
  behaviors:r?.behaviors.map(b=>({id:b.id,name:b.name,stableId:b.getFlag('world','dicebox')?.stableId,
   type:b.type,events:Array.from(b.system?.events??[]),disabled:b.disabled,
   toObjectKeys:Object.keys(b.toObject()),
   systemKeys:Object.keys(b.system?.toObject?.()??{}),
   source:String(b.system?.source??'').slice(0,5000)}))};
 })};
});
const k=game.macros.get('FHQiFYx6OntZVo9d');const src=String(k?.command??'');
const need=['const runObserve','const writeState','async function write','isPrimaryGM','getProperty','statePath','oncePerActor'];
const kernel=need.map(key=>{let idx=src.indexOf(key);return {key,at:idx,sample:idx<0?null:src.slice(Math.max(0,idx-250),idx+2800)}})
return {operation:'cl13-clock-advanced-readonly',noWrite:true,scenes,kernel,availableDialog:typeof foundry?.applications?.api?.DialogV2?.wait};
