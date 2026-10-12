// CL91 M2 one-writer exact-hash/geometry/source guarded PREVIEW/APPLY.
const sha=async x=>Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(String(x)))),b=>b.toString(16).padStart(2,'0')).join('');
if(game.version!=='14.367'||game.system.id!=='dnd5e'||game.system.version!=='5.3.3'||game.world.id!=='the-lost-mine-of-phandalin'
 ||game.user.name!=='Assistant Gamemaster'||!game.user.isGM||game.users.some(u=>u.active&&!u.isGM))
 throw Error('M2_WRONG_STACK_OR_ACTIVE_PLAYER');
const scene=game.scenes.get('JZkxX6lUQe8Nc8xJ');
const noticeRegion=scene?.regions.get('fMT43gKz5Am84FEi'),signetRegion=scene?.regions.get('FRY091GwobgD2M5i');
const n=noticeRegion?.behaviors.get('NxUruGwqnow13Krv'),s=signetRegion?.behaviors.get('IdriZEGhxUY9whcV');
if(!n||!s||n.disabled||s.disabled||n.type!=='executeScript'||s.type!=='executeScript'
||noticeRegion.behaviors.size!==1||signetRegion.behaviors.size!==1||!n.system?.events?.has('tokenEnter')
||!s.system?.events?.has('tokenEnter'))throw Error('M2_BEHAVIOR_MODE_DRIFT');
const flag=(b)=>b.getFlag('world','dicebox');
if(flag(n)?.stableId!=='dbx:central-lodge:m2:behavior:portrait-notice'
||flag(s)?.stableId!=='dbx:central-lodge:m2:behavior:founder-portrait-signet')
throw Error('M2_STABLE_ID_DRIFT');
const origNoticeSha='49c934bb7ef15bfeddfb6d0f76564fa7b69764a3b3b24ec043feafe1aa5a9a46';
const origSignetSha='bbf7de80e832e453ff9c284b36194a42a7190d18847e29be1d5b49b654a09ec2';
if(await sha(n.system.source)!==origNoticeSha||await sha(s.system.source)!==origSignetSha
||flag(n)?.sourceHash!==origNoticeSha||flag(s)?.sourceHash!==origSignetSha)
throw Error('M2_BEHAVIOR_SOURCE_OR_FLAG_DRIFT');
const shapes=[noticeRegion.shapes[0],signetRegion.shapes[0]];
if(shapes[0]?.type!=='rectangle'||shapes[1]?.type!=='rectangle'
||shapes[0].x!==440||shapes[0].y!==400||shapes[0].width!==760||shapes[0].height!==600
||shapes[1].x!==420||shapes[1].y!==390||shapes[1].width!==800||shapes[1].height!==650)
throw Error('M2_REGION_GEOMETRY_DRIFT');
const ledger=game.journal.get('xhlXv6CCH34HVga3')?.getFlag('world','dicebox')?.state;
if(ledger?.revision!==2||await sha(JSON.stringify(ledger))!=='7feef0b3823ed64e52eaecd2fbe886d020a0a8b92dda2c54a334bbc8017d38f7'
||ledger?.puzzles?.m2?.founderPortraitObserved!==false
||ledger?.puzzles?.m2?.founderPortraitOpened!==false
||ledger?.items?.['founders-signet']?.recovered!==false
||ledger?.items?.['old-estate-survey']?.recovered!==false)
throw Error('M2_LEDGER_DRIFT');
if(await sha(game.macros.get('FHQiFYx6OntZVo9d')?.command??'')!=='6264c467211d4f5c94cfaaa9437eae88582599061b9d8a4951391830a3e8f814')
throw Error('M2_KERNEL_DRIFT');
const ids=["0CSBwzcszPKyaB8u","5K1uASAARnX8aZhP","EDdktL7VUihbpKe9","UNySMm7YkyYfh41x","Zq8iXByDVhHRbA7w","sI4YVZZChgey1qNi","iqfCcDpEer4pwrJj","DLcheEi6e5OHOYmU","U8S5ZrTjaPIkTUIL","JZkxX6lUQe8Nc8xJ","LXTA8mx1rJ2L6e2J","MAbLfBqG7qIVVuLN","4pc5akMBieHU7GvV","pHQvDUDlyWZFuNrX","if9iWDRjSwI87EeX","PVf6Gbrv9HbB88uZ","La9krMOMBhAhDLi6","ImeIdHbYb6kZKAdt","ez9MSQ8QIO4cW6zo","aIKQmFiuXWipEdyb","HWitOe1wSid7MZ1y"].map(id=>game.scenes.get(id));
const counts={scenes:ids.length,missing:ids.filter(s=>!s).length,
regions:ids.reduce((t,x)=>t+(x?.regions.size??0),0),
behaviors:ids.reduce((t,x)=>t+(x?[...x.regions].reduce((q,r)=>q+r.behaviors.size,0):0),0),
items:game.items.filter(i=>i.getFlag('world','dicebox')?.stableId?.startsWith('dbx:central-lodge:item:')).length};
if(counts.missing||counts.regions!==202||counts.behaviors!==118||counts.items!==33)throw Error('M2_ROSTER_DRIFT');
const composedSource="// CL91 M2 Founder Portrait: single serialized Notice -> observation -> Signet pickup.\n// Existing Notice and Signet source bodies below are embedded verbatim from actual Foundry.\n// Replaces only original outer Signet RegionBehavior source; inner Notice is disabled separately.\n// Gameplay behavior not certified until the user runs final campaign acceptance.\nif(event?.name&&event.name!==\"tokenEnter\")return;\nif(event?.region?.id&&event.region.id!==\"FRY091GwobgD2M5i\")return;\nconst gm=game.users.filter(u=>u.active&&u.isGM).sort((a,b)=>a.id.localeCompare(b.id))[0];\nif(!game.user?.isGM||gm?.id!==game.user.id)return;\nconst scene=game.scenes.get(\"JZkxX6lUQe8Nc8xJ\");\nconst token=event?.data?.token??event?.token??null,actor=token?.actor??null;\nif(!token||!actor||token.parent?.id!==\"JZkxX6lUQe8Nc8xJ\")return;\nconst requestingUser=event?.user??null;\nif(requestingUser&&!requestingUser.isGM&&!actor.testUserPermission(requestingUser,CONST.DOCUMENT_OWNERSHIP_LEVELS.OWNER))return;\nconst ledger=game.journal.get(\"xhlXv6CCH34HVga3\");\nconst getState=()=>ledger?.getFlag(\"world\",\"dicebox\")?.state??null;\nif(!ledger||!getState()||typeof game.macros.find!==\"function\")return;\nconst controller=globalThis.__diceboxM2FounderPortraitQueue??={tail:Promise.resolve()};\nconst previous=controller.tail;\nlet release;\ncontroller.tail=new Promise(resolve=>release=resolve);\nawait previous.catch(()=>{});\ntry {\n const state=getState();\n if(state?.puzzles?.m2?.founderPortraitObserved!==true&&state?.puzzles?.m2?.founderPortraitObserved!==false)return;\n const originalNotice=async()=>{\n// BEGIN ORIGINAL M2 PORTRAIT NOTICE SOURCE (unchanged)\nconst k = game.macros.find(m => m.getFlag?.(\"world\",\"dicebox\")?.stableId === \"dbx:central-lodge:macro:runtime\");\nif (!k) { console.error(\"[Central Lodge M2] Runtime Kernel missing.\"); return; }\nconst t = event?.data?.token ?? event?.token ?? null;\nconst a = t?.actor ?? null;\nreturn await k.execute({actor:a,token:t,event,speaker:{dicebox:{\"contract\":\"dicebox-discovery/v1\",\"action\":\"notice\",\"trigger\":\"TOKEN_ENTER\",\"noticeKey\":\"m2.portrait-eye\",\"dc\":6,\"stage2Skill\":\"Investigation\",\"successMessage\":\"<p>The founder’s portrait is subtly wrong. One eye does not match the other, and close inspection reveals a fitted recess where a small artificial eye was meant to sit.</p>\",\"followUp\":\"Suggested follow-up: Investigation.\",\"failure\":\"silent\",\"oncePerCharacter\":true,\"autoAwardItem\":false,\"criticalClueFallback\":\"The portrait remains physically examinable, and the eye mechanism can still be used if the missing Glass Eye is recovered.\"}}});\n// END ORIGINAL M2 PORTRAIT NOTICE SOURCE\n };\n const noticeResult=await originalNotice();\n if(![\"PASS\",\"ALREADY_ATTEMPTED\"].includes(noticeResult?.status))return;\n if(getState()?.puzzles?.m2?.founderPortraitObserved===false){\n  const k=game.macros.find(m=>m.getFlag?.(\"world\",\"dicebox\")?.stableId===\"dbx:central-lodge:macro:runtime\");\n  if(!k)return;\n  const observed=await k.execute({actor,token,event,speaker:{dicebox:{\n   contract:\"dicebox-region-behavior/v1\",action:\"observe\",trigger:\"TOKEN_ENTER\",\n   observationKey:\"m2.founder-portrait-examined\",oncePerActor:false,\n   statePath:\"puzzles.m2.founderPortraitObserved\",value:true,\n   message:\"<p>You study the founder’s stern expression and the workmanship of the frame. Some details seem intentionally altered, although their purpose is not yet clear.</p>\"\n  }}});\n  if(observed?.status!==\"PASS\"||getState()?.puzzles?.m2?.founderPortraitObserved!==true)return;\n }\n const originalSignet=async()=>{\n// BEGIN ORIGINAL M2 SIGNET PICKUP SOURCE (unchanged)\nconst k = game.macros.find(m => m.getFlag?.(\"world\",\"dicebox\")?.stableId === \"dbx:central-lodge:macro:runtime\");\nif (!k) { console.error(\"[Central Lodge M2] Runtime Kernel missing.\"); return; }\nconst t = event?.data?.token ?? event?.token ?? null;\nconst a = t?.actor ?? null;\nif (!a) return;\nconst hasRequired = Array.from(a.items ?? []).some(i => i.getFlag?.(\"world\",\"dicebox\")?.stableId === \"dbx:central-lodge:item:founders-signet\");\nif (!hasRequired) return;\nreturn await k.execute({actor:a,token:t,event,speaker:{dicebox:{\"contract\":\"dicebox-region-behavior/v1\",\"action\":\"pickup\",\"trigger\":\"TOKEN_ENTER\",\"itemKey\":\"old-estate-survey\",\"statePath\":\"puzzles.m2.founderPortraitOpened\",\"value\":true,\"message\":\"<p>The Founder’s Signet engages a concealed fitting in the Founder Portrait. A hidden compartment releases, revealing the <strong>Old Estate Survey</strong>.</p>\",\"persistentPickup\":true}}});\n// END ORIGINAL M2 SIGNET PICKUP SOURCE\n };\n return await originalSignet();\n}finally{release();}";
const composedSha="4b341ee93374af01b64b07061b4f509ea701d5cd2b1d02f8ee98562a17f98cf6";
if(await sha(composedSource)!==composedSha||!composedSource.includes(n.system.source)||!composedSource.includes(s.system.source))
throw Error('M2_COMPOSITE_SOURCE_DRIFT');
await noticeRegion.updateEmbeddedDocuments('RegionBehavior',[{_id:n.id,disabled:true}]);
const disabled=game.scenes.get(scene.id)?.regions.get(noticeRegion.id)?.behaviors.get(n.id);
if(!disabled?.disabled||await sha(disabled.system.source)!==origNoticeSha)
 throw Error('M2_OUTCOME_UNKNOWN_AFTER_NOTICE_DISABLE_DO_NOT_REPLAY');
await signetRegion.updateEmbeddedDocuments('RegionBehavior',[{
 _id:s.id,system:{source:composedSource},
 flags:{world:{dicebox:{sourceHash:composedSha,orchestration:'serial-notice-observe-signet-v001'}}}
}]);
const current=game.scenes.get(scene.id)?.regions.get(signetRegion.id)?.behaviors.get(s.id);
if(!current||current.disabled||await sha(current.system.source)!==composedSha
 ||current.getFlag('world','dicebox')?.sourceHash!==composedSha
 ||game.journal.get('xhlXv6CCH34HVga3')?.getFlag('world','dicebox')?.state?.revision!==2)
 throw Error('M2_OUTCOME_UNKNOWN_AFTER_COMPOSITE_UPDATE_DO_NOT_REPLAY');
return {operation:'cl91-m2-single-writer-apply-v001',noWrite:false,status:'PASS',
 noticeBehaviorId:disabled.id,noticeDisabled:disabled.disabled,noticeSha:origNoticeSha,
 updatedSignetBehaviorId:current.id,sourceSha:composedSha,ledgerRevision:2};
