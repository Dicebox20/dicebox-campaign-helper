const ledger=game.journal.get('xhlXv6CCH34HVga3')?.getFlag('world','dicebox')?.state??null;
const sha=async x=>Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(String(x)))),b=>b.toString(16).padStart(2,'0')).join('');
const e1=game.scenes.get('Zq8iXByDVhHRbA7w');
return{operation:'cl-scale-revision-drift-readonly-v001',noWrite:true,
 ledger:{revision:ledger?.revision,updatedAt:ledger?.updatedAt,sha:await sha(JSON.stringify(ledger)),noticeKeys:Object.keys(ledger?.notices??{}),noticeSummaries:Object.fromEntries(Object.entries(ledger?.notices??{}).map(([key,value])=>[key,{recordCount:Object.keys(value??{}).length,flags:Array.isArray(value)?'array':typeof value}])),e1RecentUseObserved:ledger?.puzzles?.e1?.recentUseObserved,
 m1Solved:ledger?.puzzles?.m1?.clockSettingResolved,m2Observed:ledger?.puzzles?.m2?.founderPortraitObserved,n3BranchUnlocked:ledger?.puzzles?.n3?.t3BranchUnlocked},
 users:game.users.filter(u=>u.active).map(u=>({isGM:u.isGM,name:u.name})),
 e1Tokens:e1?.tokens?.size,sceneMapMeta:{m1Grid:game.scenes.get('U8S5ZrTjaPIkTUIL')?.grid?.size,m2Grid:game.scenes.get('JZkxX6lUQe8Nc8xJ')?.grid?.size,n3Grid:game.scenes.get('pHQvDUDlyWZFuNrX')?.grid?.size}};
