// N3 branch-policy evidence only. No Foundry mutation or token movement.
const SN3='pHQvDUDlyWZFuNrX',ST3='aIKQmFiuXWipEdyb';
const n3=game.scenes.get(SN3),t3=game.scenes.get(ST3),journal=game.journal.get('xhlXv6CCH34HVga3');
const state=journal?.getFlag('world','dicebox')?.state;
const sha=async s=>Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(String(s??'')))),b=>b.toString(16).padStart(2,'0')).join('');
const interested=['RP1jYOH738xl9hks','VE8p4CvgzqvhihuF','eNrbnN68TYvMaBcT','7el4eN3Uwzxy7Wmi','foYsFHsLXtCbfiyR'];
const regs=interested.map(id=>{const r=n3?.regions.get(id);return {id,name:r?.name,stableId:r?.getFlag('world','dicebox')?.stableId,
shapes:r?.shapes?.map(x=>x.toObject?.()??x),behaviors:r?.behaviors?.map(b=>({id:b.id,name:b.name,stableId:b.getFlag('world','dicebox')?.stableId,disabled:b.disabled,events:Array.from(b.system?.events??[]),source:b.system?.source??''}))}});
const exits=t3?.regions?.filter(r=>/n3/i.test(r.name+" "+(r.getFlag('world','dicebox')?.stableId??''))).map(r=>({id:r.id,name:r.name,
shapes:r.shapes?.map(x=>x.toObject?.()??x),behaviors:r.behaviors.map(b=>({id:b.id,events:Array.from(b.system?.events??[]),sourceSha:null,source:b.system?.source??''}))}));
return{operation:'cl91-n3-branch-gate-readonly-v001',noWrite:true,stack:{version:game.version,system:game.system.version,world:game.world.id},
ledger:{revision:state?.revision,n3:state?.puzzles?.n3,items:Object.fromEntries(Object.entries(state?.items??{}).filter(([k])=>['station-route-plate','railway-switch-wheel','old-estate-survey','cult-passage-diagram','recent-route-fragment','brass-baggage-token'].includes(k)))},
n3:{sceneId:n3?.id,regions:n3?.regions?.size,behaviors:n3?.regions?.reduce((a,r)=>a+r.behaviors.size,0),interested:regs},
t3:{sceneId:t3?.id,returnRegions:exits},activePlayers:game.users.filter(u=>u.active&&!u.isGM).map(u=>u.id)};
