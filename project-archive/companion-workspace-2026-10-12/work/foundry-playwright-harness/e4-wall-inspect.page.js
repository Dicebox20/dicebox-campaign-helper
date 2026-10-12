const s=game.scenes.get("DLcheEi6e5OHOYmU");
const walls=Array.from(s?.walls??[]).map(w=>({
 id:w.id,
 c:w.c,
 door:w.door,
 ds:w.ds,
 move:w.move,
 sight:w.sight,
 light:w.light,
 sound:w.sound,
 dir:w.dir,
 flags:foundry.utils.deepClone(w.flags??{})
}));
return{operation:"central-lodge.cl20.e4.wall-inspect",status:"PASS",noWrite:true,count:walls.length,walls};