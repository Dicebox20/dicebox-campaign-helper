// CL13: bounded, read-only behavior-shape introspection, no callbacks invoked.
const configs=[
['M1','U8S5ZrTjaPIkTUIL',['0Ek2b2Ongw0RNNeK','5H97UQm6VF3vw5Ru','LmLxI7Ao8uFTyShb']],
['U1','if9iWDRjSwI87EeX',[]],
['E4','DLcheEi6e5OHOYmU',['wzANpkb9bbFlB8z9','BjAgwMeaS9UUi7er']]
];
const summaries=configs.map(([label,id,focus])=>{
const s=game.scenes.get(id);return {label,scene:id,
regions:s?.regions.map(r=>({id:r.id,name:r.name,behaviors:r.behaviors.map(b=>({
id:b.id,name:b.name,type:b.type,events:b.system?.events,
sourcePreview:focus.includes(r.id)?String(b.system?.source??'').slice(0,4200):null,
stableId:b.getFlag('world','dicebox')?.stableId
}))}))}});
const kernel=game.macros.get('FHQiFYx6OntZVo9d');
const src=String(kernel?.command??'');
const names=['execute','runObserve','runGate','runSocket','runPickup','updateState','setState','ledger'];
const snippets=names.map(t=>{const i=src.indexOf(t);return i<0?{key:t,found:false}:{key:t,found:true,near:src.slice(Math.max(i-160,0),i+550)}});
return {operation:'cl13.m1.behavior-shapes',noWrite:true,summaries,kernelSnippets:snippets};
