const items=[
 ['U1','if9iWDRjSwI87EeX','V1JRfiR56dgVGRa3','875pl2PyFUnEYO75'],
 ['E4','DLcheEi6e5OHOYmU','eRjDUWAIS206MyZV','AjFHwHDxH7Pg9Vel'],
 ['M1','U8S5ZrTjaPIkTUIL','5H97UQm6VF3vw5Ru','1SyWN6w9CrUxgVhb'],
 ['CLOCK','U8S5ZrTjaPIkTUIL','3tIrR12uv8ppFkOb',null]];
const sha=async s=>Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256",new TextEncoder().encode(s))),x=>x.toString(16).padStart(2,'0')).join('');
const results=[];
for(const [name,sid,rid,bid] of items){
const scene=game.scenes.get(sid),r=scene?.regions.get(rid),b=bid?r?.behaviors.get(bid):null;
results.push({name,sid,rid,bid,behaviorCount:r?.behaviors.size,canCreate:typeof r?.createEmbeddedDocuments==='function',
 stableId:r?.getFlag('world','dicebox')?.stableId,behaviorStableId:b?.getFlag('world','dicebox')?.stableId,
 sourceSha:b?await sha(String(b.system?.source??'')):null,sourceLength:b?.system?.source?.length});
}
const ledger=game.journal.get('xhlXv6CCH34HVga3')?.getFlag('world','dicebox')?.state;
return {noWrite:true,results,ledgerRevision:ledger?.revision,puzzle:ledger?.puzzles?.m1,gameVersion:game.version};
