const s=game.scenes.get("DLcheEi6e5OHOYmU");
const clone=v=>foundry.utils.deepClone(v);
const rows=Array.from(s?.walls??[]).map(w=>{
 const flags=clone(w.flags??{});
 const stableId=flags?.world?.dicebox?.stableId??flags?.["dicebox-campaign-helper"]?.stableId??null;
 return {
  id:w.id,c:clone(w.c),door:w.door,ds:w.ds,move:w.move,sight:w.sight,sound:w.sound,light:w.light,dir:w.dir,flags,stableId
 };
});
return{operation:"central-lodge.cl20.e4.wall-preflight",status:"PASS",noWrite:true,count:rows.length,doors:rows.filter(x=>x.door&&x.door!==0),walls:rows};