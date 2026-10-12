const k=game.macros.get("FHQiFYx6OntZVo9d");
const src=String(k?.command??"");
const i=src.indexOf("const runGate");
const j=src.indexOf("const runTransition",i+1);
const wall=game.scenes.get("DLcheEi6e5OHOYmU")?.walls.get("kyoCHP9xmMSxCIwi");
return {
 operation:"central-lodge.cl20.e4.gate-door-contract-inspect",
 status:"PASS",noWrite:true,
 runGateSource:i>=0&&j>i?src.slice(i,j):null,
 door:{id:wall?.id??null,door:wall?.door??null,ds:wall?.ds??null,flags:foundry.utils.deepClone(wall?.flags??{})},
 constants:globalThis.CONST?.WALL_DOOR_STATES??null
};