const actor=game.actors.get('2g6CmPQqhSkRQQZm'),journal=game.journal.get('xhlXv6CCH34HVga3');
if(!game.ready||game.world?.id!=='the-lost-mine-of-phandalin'||game.version!=='14.367'||game.system?.version!=='5.3.3'||game.user?.name!=='Assistant Gamemaster'||!game.user?.isGM||[...game.users].some(u=>u.active&&!u.isGM))throw Error('STACK_AUTHORITY_DRIFT');
const before=journal?.getFlag('world','dicebox')?.state;const flags=journal?.getFlag('world','dicebox');const H=async v=>Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(JSON.stringify(v)))),b=>b.toString(16).padStart(2,'0')).join('');
if(!actor||!journal||!before||before.revision!==12||await H(before)!=='9336ee4b38457f27d34cc005f7d216300b38932048e224ec915770f161589906'||await H(actor.toObject())!=='3229f7a3ecf1b1bed6456a9ee10ee26d06508abd7050871a6c9058d08da17dbb')throw Error('EXACT_LEDGER_ACTOR_DRIFT');
const removeId='2g6CmPQqhSkRQQZm',item=actor.items.get('6YiaeulYci78TZRg');if(!item||item.name!=='Water Control Wheel'||item.getFlag('world','dicebox')?.canonicalStableId!=='dbx:central-lodge:item:water-control-wheel'||item.getFlag('world','dicebox')?.grantedAt!=='2026-10-09T02:28:53.093Z')throw Error('ITEM_GRANT_DRIFT');
const after=foundry.utils.deepClone(before);const removed=[];
const keys=['observation:c1','c1','observation:c2','observation:e2','e3','observation:n1','n1','observation:n2','n2','n3','observation:u2'];
for(const nk of keys){const domain=after.notices?.[nk];if(!domain)throw Error('MISSING_NOTICE_'+nk);let n=0;for(const [type,records] of Object.entries(domain)){const entry=records?.[removeId];if(!entry)continue;const at=entry.seenAt??entry.attemptedAt??null;if(!at||at<'2026-10-09T02:00:00.000Z')throw Error('NOT_MEASURING_ONLY_'+nk+'.'+type);delete records[removeId];removed.push({path:'notices.'+nk+'.'+type+'.'+removeId,date:at});n++;if(Object.keys(records).length===0)delete domain[type];}if(!n)throw Error('NO_TARGET_NOTICE_'+nk);if(Object.keys(domain).length===0)delete after.notices[nk];}
const booleans=['e2.recentUseObserved','c1.devilWorshipInterpreted','c2.cultRecordsInterpreted','u2.servantHistoryObserved','n1.estateRailwayInterpreted','n2.grottoStationInterpreted'];
for(const spec of booleans){const [group,key]=spec.split('.');if(after.puzzles?.[group]?.[key]!==true)throw Error('PUZZLE_FLAG_DRIFT_'+spec);after.puzzles[group][key]=false;removed.push({path:'puzzles.'+spec,to:false});}
if(after.items['water-control-wheel']?.recovered!==true||after.items['water-control-wheel']?.recoveredByActorUuid!=='Actor.'+removeId||after.items['water-control-wheel']?.recoveredAt!=='2026-10-09T02:28:53.411Z')throw Error('RECOVERY_OWNER_DRIFT');
after.items['water-control-wheel']={...after.items['water-control-wheel'],recovered:false,recoveredAt:null,recoveredByActorUuid:null};
removed.push({path:'items.water-control-wheel',restored:'unrecovered'});
after.revision=13;after.updatedAt=new Date().toISOString();
if(before.notices['observation:e1']===undefined||!before.notices.m1?.['recent-disturbance'])throw Error('HISTORICAL_PROGRESS_MISSING');
const journalFlags=foundry.utils.deepClone(journal.flags);
if(Object.keys(journalFlags.world??{}).join(',')!=='dicebox')throw Error('FLAG_NAMESPACE_DRIFT');
journalFlags.world.dicebox={...flags,state:after};
await journal.update({flags:journalFlags},{diff:false,recursive:false});
if(await H(journal.getFlag('world','dicebox')?.state)!==await H(after))throw Error('OUTCOME_UNKNOWN_AFTER_JOURNAL_UPDATE_NO_BLIND_RETRY');
await actor.deleteEmbeddedDocuments('Item',[item.id]);
const actualLedger=journal.getFlag('world','dicebox')?.state;
if(await H(actualLedger)!==await H(after)||actor.items.has(item.id))throw Error('OUTCOME_UNKNOWN_CLEANUP_VERIFICATION_NO_RETRY');
return{operation:'clscale-meow-targeted-cleanup-apply-v001',status:'PASS_BOUNDED_CLEANUP',newLedgerSHA:await H(actualLedger),ledgerRevision:actualLedger.revision,actorSourceSHA:await H(actor.toObject()),removedMeowNoticeCount:removed.filter(x=>x.path.startsWith('notices.')).length,removedItemId:item.id,remainingNoticeKeys:Object.keys(actualLedger.notices),remainingMeowCentralTokens:[...game.scenes].reduce((n,s)=>n+[...s.tokens].filter(t=>t.actorId===removeId&&/Central Lodge|^F[12] —/.test(s.name)).length,0)};
