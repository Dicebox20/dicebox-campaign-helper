const macro=game.macros.get('FHQiFYx6OntZVo9d'),s=String(macro?.command??'');
const terms=['statePath','action === "observe"','action === "pickup"','writeState','hasProperty','getProperty','setProperty','ledger'];
const hits=terms.map(t=>{let start=0,arr=[];while(start<s.length&&arr.length<4){const at=s.indexOf(t,start);if(at<0)break;arr.push({at,excerpt:s.slice(Math.max(0,at-220),Math.min(s.length,at+650))});start=at+t.length;}return {term:t,hits:arr}});
const led=game.journal.get('xhlXv6CCH34HVga3');
const allState=led?.getFlag('world','dicebox')?.state;
return {operation:'cl91.m2-u2-kernel-readonly-v001',noWrite:true,macroLength:s.length,hits,ledger:{revision:allState?.revision,topLevelKeys:Object.keys(allState??{}),m2:allState?.puzzles?.m2,u2:allState?.puzzles?.u2},ledgerFlagKeys:Object.keys(led?.getFlag('world','dicebox')??{})};
