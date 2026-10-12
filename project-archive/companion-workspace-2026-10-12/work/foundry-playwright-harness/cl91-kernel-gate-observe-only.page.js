const s=game.macros.get("FHQiFYx6OntZVo9d")?.command??"",terms=["const runGate", "const runObserve","const runSocket","const commit","const writeState","isPrimaryGM","const runTransition"],out=[];
for(const q of terms){const i=s.indexOf(q);out.push({q,index:i,source:i<0?null:s.slice(i,i+3800)});}
return{operation:"cl91-kernel-gate-observe-only",noWrite:true,source:out};