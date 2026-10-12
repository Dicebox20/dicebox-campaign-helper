from pathlib import Path
import json,hashlib
r=Path(r'C:\Users\rujie\Documents\Codex\DiceBox Campaign Helper\work\foundry-playwright-harness')
s=(r/'cl91-u2-household-interpretation-source-v001.js').read_text(encoding='utf-8')
sha=lambda x:hashlib.sha256(x.encode('utf-8')).hexdigest()
assert s.endswith('\n'), 'unexpected staged source terminator'
header="""// U2 CL91 guarded source install, exact Foundry 14.367 target, one RegionBehavior only.
const SHA=async x=>Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(String(x)))),b=>b.toString(16).padStart(2,'0')).join('');
if(game.version!=='14.367'||game.world.id!=='the-lost-mine-of-phandalin'||game.system.id!=='dnd5e'||game.system.version!=='5.3.3'
 ||!game.user.isGM||game.user.name!=='Assistant Gamemaster'||game.users.some(u=>u.active&&!u.isGM))
 throw Error('CL91_WRONG_STACK_OR_ACTIVE_PLAYERS');
const ledger=game.journal.get('xhlXv6CCH34HVga3')?.getFlag('world','dicebox')?.state;
if(ledger?.revision!==2||await SHA(JSON.stringify(ledger))!=='7feef0b3823ed64e52eaecd2fbe886d020a0a8b92dda2c54a334bbc8017d38f7'
||ledger?.puzzles?.u2?.servantHistoryObserved!==false||ledger?.puzzles?.u2?.servantHistoryInterpreted!==false)
throw Error('CL91_LEDGER_DRIFT');
const canonical=["0CSBwzcszPKyaB8u","5K1uASAARnX8aZhP","EDdktL7VUihbpKe9","UNySMm7YkyYfh41x","Zq8iXByDVhHRbA7w","sI4YVZZChgey1qNi","iqfCcDpEer4pwrJj","DLcheEi6e5OHOYmU","U8S5ZrTjaPIkTUIL","JZkxX6lUQe8Nc8xJ","LXTA8mx1rJ2L6e2J","MAbLfBqG7qIVVuLN","4pc5akMBieHU7GvV","pHQvDUDlyWZFuNrX","if9iWDRjSwI87EeX","PVf6Gbrv9HbB88uZ","La9krMOMBhAhDLi6","ImeIdHbYb6kZKAdt","ez9MSQ8QIO4cW6zo","aIKQmFiuXWipEdyb","HWitOe1wSid7MZ1y"].map(id=>game.scenes.get(id));
if(canonical.some(s=>!s)||canonical.reduce((n,s)=>n+s.regions.size,0)!==202||
canonical.reduce((n,s)=>n+[...s.regions].reduce((j,r)=>j+r.behaviors.size,0),0)!==117)
throw Error('CL91_ROSTER_DRIFT');
const scene=game.scenes.get('PVf6Gbrv9HbB88uZ'),region=scene?.regions.get('qa4n4o834OZTKPoV');
const original=region?.behaviors.get('J11ZvQh4lqzEsvRi');
if(!region||region.behaviors.size!==1||region.getFlag('world','dicebox')?.stableId!=='dbx:central-lodge:u2:region:u2-servant-history'
 ||original?.disabled||await SHA(original?.system?.source??'')!=='f815c0920579b163800a7bf5548d252dad398aeb245e90c48ce5363b0defd372')
throw Error('CL91_U2_ORIGINAL_DRIFT');
const kernel=game.macros.get('FHQiFYx6OntZVo9d');
if(await SHA(kernel?.command??'')!=='6264c467211d4f5c94cfaaa9437eae88582599061b9d8a4951391830a3e8f814')
throw Error('CL91_KERNEL_DRIFT');
for(const [regionId,behaviorId,key] of [
 ['UsCSlj3KWoPGpT5L','5kg4pLVIvyQJRQIK','u2.servant-room-absence'],
 ['UXQMAhtVpmZVrwsR','Vmdk1xKIRFD3ppU2','u2.nursery-contradiction']
]){
 const b=scene.regions.get(regionId)?.behaviors.get(behaviorId);
 if(!b||b.disabled||!String(b.system?.source??'').includes('"noticeKey":"'+key+'"'))throw Error('CL91_NOTICE_DRIFT:'+key);
}
const stableId='dbx:central-lodge:u2:behavior:servant-history-interpretation-v001';
if(game.scenes.some(s=>s.regions.some(r=>r.behaviors.some(b=>b.getFlag('world','dicebox')?.stableId===stableId))))
throw Error('CL91_DUPLICATE_BEHAVIOR');
"""
header+=f"const source={json.dumps(s,ensure_ascii=False)};\nconst expectedSourceHash={json.dumps(sha(s))},expectedStoredHash={json.dumps(sha(s[:-1]))};\n"
header+="""if(await SHA(source)!==expectedSourceHash||!source.endsWith("\\n"))throw Error('CL91_STAGED_SOURCE_HASH_DRIFT');
const payload={name:"DiceBox U2 — Household History Interpretation",type:"executeScript",disabled:false,
 system:{events:["tokenMoveIn"],source},
 flags:{world:{dicebox:{stableId,owner:"central-lodge",version:"cl91-u2-history-v001"}}}};
"""
preview=header+"""return{operation:'cl91-u2-history-preview-v001',noWrite:true,status:'PASS_STAGED_NOT_INSTALLED',
 countBefore:117,expectedCountAfter:118,regionId:region.id,originalBehaviorId:original.id,
 sourceHash:expectedSourceHash,normalizedSourceHash:expectedStoredHash,ledgerRevision:ledger.revision,
 playerCanary:false};
"""
apply=header+"""const created=await region.createEmbeddedDocuments('RegionBehavior',[payload]);
if(created?.length!==1)throw Error('CL91_CREATE_OUTCOME_UNKNOWN');
const installed=scene.regions.get(region.id).behaviors.filter(b=>b.getFlag('world','dicebox')?.stableId===stableId);
if(installed.length!==1||installed[0].disabled||!installed[0].system?.events?.has('tokenMoveIn')||
 installed[0].system.source!==source.slice(0,-1)||await SHA(installed[0].system.source)!==expectedStoredHash)
throw Error('CL91_POST_CREATE_OUTCOME_UNKNOWN_DO_NOT_REPLAY');
return {operation:'cl91-u2-history-apply-v001',noWrite:false,status:'PASS',behaviorId:installed[0].id,
 sourceSha:expectedStoredHash,ledgerRevision:game.journal.get('xhlXv6CCH34HVga3')?.getFlag('world','dicebox')?.state?.revision};
"""
for name,content in [("cl91-u2-history-preview-v001.page.js",preview),("cl91-u2-history-apply-v001.page.js",apply)]:
 p=r/name
 if p.exists():raise SystemExit('STOP existing installer '+name)
 p.write_text(content,encoding='utf-8')
 print('STAGED',name,'SHA',sha(content))
print('SOURCE_SHA',sha(s),'EXPECTED_STORED_SHA',sha(s[:-1]))
