// Independent CL91 M2 portrait serialized source and state verifier; read-only.
const sha=async x=>Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(String(x)))),b=>b.toString(16).padStart(2,'0')).join('');
const scene=game.scenes.get('JZkxX6lUQe8Nc8xJ'),nr=scene?.regions.get('fMT43gKz5Am84FEi'),sr=scene?.regions.get('FRY091GwobgD2M5i');
const n=nr?.behaviors.get('NxUruGwqnow13Krv'),s=sr?.behaviors.get('IdriZEGhxUY9whcV');
const stage=String(s?.system?.source??'');
const nstart='// BEGIN ORIGINAL M2 PORTRAIT NOTICE SOURCE (unchanged)\n',nend='\n// END ORIGINAL M2 PORTRAIT NOTICE SOURCE';
const pstart='// BEGIN ORIGINAL M2 SIGNET PICKUP SOURCE (unchanged)\n',pend='\n// END ORIGINAL M2 SIGNET PICKUP SOURCE';
const embeddedNotice=stage.includes(nstart)?stage.split(nstart)[1]?.split(nend)[0]??'':'';
const embeddedSignet=stage.includes(pstart)?stage.split(pstart)[1]?.split(pend)[0]??'':'';
const ids=["0CSBwzcszPKyaB8u","5K1uASAARnX8aZhP","EDdktL7VUihbpKe9","UNySMm7YkyYfh41x","Zq8iXByDVhHRbA7w","sI4YVZZChgey1qNi","iqfCcDpEer4pwrJj","DLcheEi6e5OHOYmU","U8S5ZrTjaPIkTUIL","JZkxX6lUQe8Nc8xJ","LXTA8mx1rJ2L6e2J","MAbLfBqG7qIVVuLN","4pc5akMBieHU7GvV","pHQvDUDlyWZFuNrX","if9iWDRjSwI87EeX","PVf6Gbrv9HbB88uZ","La9krMOMBhAhDLi6","ImeIdHbYb6kZKAdt","ez9MSQ8QIO4cW6zo","aIKQmFiuXWipEdyb","HWitOe1wSid7MZ1y"].map(i=>game.scenes.get(i));
const stableIds=[],disabled=[];
for(const sc of ids)if(sc)for(const reg of sc.regions)for(const b of reg.behaviors){stableIds.push(b.getFlag('world','dicebox')?.stableId);if(b.disabled)disabled.push(b.id);}
const ledger=game.journal.get('xhlXv6CCH34HVga3')?.getFlag('world','dicebox')?.state;
const result={noticeId:n?.id,noticeDisabled:n?.disabled,noticeSourceSha:await sha(n?.system?.source??''),
noticeFlagSha:n?.getFlag('world','dicebox')?.sourceHash,
signetId:s?.id,signetDisabled:s?.disabled,signetSourceSha:await sha(stage),
signetFlagSha:s?.getFlag('world','dicebox')?.sourceHash,
signetStableId:s?.getFlag('world','dicebox')?.stableId,
embeddedNoticeSha:await sha(embeddedNotice),embeddedSignetSha:await sha(embeddedSignet),
signetEvents:Array.from(s?.system?.events??[]),noticeEvents:Array.from(n?.system?.events??[]),
scenes:ids.length,missingScenes:ids.filter(s=>!s).length,regions:ids.reduce((n,s)=>n+(s?.regions.size??0),0),
behaviors:stableIds.length,stableIds:new Set(stableIds).size,disabledIds:disabled,
items:game.items.filter(i=>i.getFlag('world','dicebox')?.stableId?.startsWith('dbx:central-lodge:item:')).length,
ledgerRevision:ledger?.revision,ledgerSha:await sha(JSON.stringify(ledger)),
portraitObserved:ledger?.puzzles?.m2?.founderPortraitObserved,portraitOpened:ledger?.puzzles?.m2?.founderPortraitOpened,
oldEstateSurveyRecovered:ledger?.items?.['old-estate-survey']?.recovered,
kernelSha:await sha(game.macros.get('FHQiFYx6OntZVo9d')?.command??''),
u2HistorySha:await sha(game.scenes.get('PVf6Gbrv9HbB88uZ')?.regions.get('qa4n4o834OZTKPoV')?.behaviors.get('WOiGF1WlGZM3fO8I')?.system?.source??''),
m1ClockSha:await sha(game.scenes.get('U8S5ZrTjaPIkTUIL')?.regions.get('3tIrR12uv8ppFkOb')?.behaviors.get('OUMWc1YjJ5DTSFzM')?.system?.source??'')};
const ok=result.noticeId==='NxUruGwqnow13Krv'&&result.noticeDisabled===true&&result.signetId==='IdriZEGhxUY9whcV'&&result.signetDisabled===false
&&result.noticeSourceSha==='49c934bb7ef15bfeddfb6d0f76564fa7b69764a3b3b24ec043feafe1aa5a9a46'
&&result.noticeFlagSha===result.noticeSourceSha
&&result.signetSourceSha==='4b341ee93374af01b64b07061b4f509ea701d5cd2b1d02f8ee98562a17f98cf6'
&&result.signetFlagSha===result.signetSourceSha
&&result.signetStableId==='dbx:central-lodge:m2:behavior:founder-portrait-signet'
&&result.embeddedNoticeSha===result.noticeSourceSha
&&result.embeddedSignetSha==='bbf7de80e832e453ff9c284b36194a42a7190d18847e29be1d5b49b654a09ec2'
&&result.signetEvents.length===1&&result.signetEvents[0]==='tokenEnter'&&result.noticeEvents.length===1&&result.noticeEvents[0]==='tokenEnter'
&&result.missingScenes===0&&result.regions===202&&result.behaviors===118&&result.stableIds===118
&&result.disabledIds.length===1&&result.disabledIds[0]==='NxUruGwqnow13Krv'
&&result.items===33&&result.ledgerRevision===2
&&result.ledgerSha==='7feef0b3823ed64e52eaecd2fbe886d020a0a8b92dda2c54a334bbc8017d38f7'
&&result.portraitObserved===false&&result.portraitOpened===false&&result.oldEstateSurveyRecovered===false
&&result.kernelSha==='6264c467211d4f5c94cfaaa9437eae88582599061b9d8a4951391830a3e8f814'
&&result.u2HistorySha==='11bbc0837bf1a4ccc20c62b523f8b9acc1061078a585a1f7e36de5cc303c4b32'
&&result.m1ClockSha==='5ee8f97403d5144cbacf64e57ea58862bf4daf4ec4643088531e7f27e12ac997';
return{operation:'cl91-m2-single-writer-final-readonly-v001',noWrite:true,status:ok?'PASS_SOURCE_INSTALLED_NO_GAMEPLAY_TEST':'BLOCKED_READBACK',result};
