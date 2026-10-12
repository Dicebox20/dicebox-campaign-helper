// Read-only CL91 M2 geometry and behavior source comparison.
const scene=game.scenes.get('JZkxX6lUQe8Nc8xJ'),ids=[
['notice','fMT43gKz5Am84FEi','NxUruGwqnow13Krv'],['signet','FRY091GwobgD2M5i','IdriZEGhxUY9whcV']];
const sha=async t=>Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(String(t)))),b=>b.toString(16).padStart(2,'0')).join('');
const regions=[];for(const [key,rid,bid]of ids){const r=scene?.regions.get(rid),b=r?.behaviors.get(bid);
regions.push({role:key,id:r?.id,name:r?.name,shapes:r?.shapes?.map(x=>x.toObject?.()??x),behaviorId:b?.id,
 events:Array.from(b?.system?.events??[]),source:b?.system?.source,sourceSha:await sha(b?.system?.source??''),
 flags:b?.flags,regionBehaviorCount:r?.behaviors?.size});}
const state=game.journal.get('xhlXv6CCH34HVga3')?.getFlag('world','dicebox')?.state;
return {operation:'cl91.m2.notice.signet.geometry',noWrite:true,foundry:game.version,
 canonical:{ledgerRevision:state?.revision,observed:state?.puzzles?.m2?.founderPortraitObserved,
 opened:state?.puzzles?.m2?.founderPortraitOpened,foundersSignetRecovered:state?.items?.['founders-signet']?.recovered,estateSurveyRecovered:state?.items?.['old-estate-survey']?.recovered},
 users:game.users.filter(x=>x.active).map(x=>({id:x.id,name:x.name,isGM:x.isGM})),regions};