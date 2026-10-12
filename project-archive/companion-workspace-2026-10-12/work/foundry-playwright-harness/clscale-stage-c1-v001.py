from pathlib import Path
import subprocess,json,hashlib
r=Path(r'C:\Users\rujie\Documents\Codex\DiceBox Campaign Helper')
w=r/'work/foundry-playwright-harness'
ID='EDdktL7VUihbpKe9';label='C1';target=240
sha=lambda s:hashlib.sha256(s.encode('utf-8')).hexdigest()
read=f"""// {label} exact source baseline, no writes.
const s=game.scenes.get('{ID}');
const ledger=game.journal.get('xhlXv6CCH34HVga3')?.getFlag('world','dicebox')?.state;
const H=async v=>Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(String(v)))),b=>b.toString(16).padStart(2,'0')).join('');
return {{operation:'clscale-c1-full-baseline-v001',noWrite:true,scene:s?.toObject(),sha:await H(JSON.stringify(s?.toObject())),ledgerSha:await H(JSON.stringify(ledger)),revision:ledger?.revision,executor:game.user?.name,nonGM:game.users.filter(u=>u.active&&!u.isGM).map(u=>u.id),roster:{{scenes:game.scenes.size,regions:game.scenes.reduce((n,s)=>n+s.regions.size,0),behaviors:game.scenes.reduce((n,s)=>n+[...s.regions].reduce((m,r)=>m+r.behaviors.size,0),0)}}}};
"""
# The world includes unrelated Scenes; scope roster only to the 21 canonical Central Lodge ids.
jsCanonical='const canonical=["0CSBwzcszPKyaB8u", "5K1uASAARnX8aZhP", "EDdktL7VUihbpKe9", "UNySMm7YkyYfh41x", "Zq8iXByDVhHRbA7w", "sI4YVZZChgey1qNi", "iqfCcDpEer4pwrJj", "DLcheEi6e5OHOYmU", "U8S5ZrTjaPIkTUIL", "JZkxX6lUQe8Nc8xJ", "LXTA8mx1rJ2L6e2J", "MAbLfBqG7qIVVuLN", "4pc5akMBieHU7GvV", "pHQvDUDlyWZFuNrX", "if9iWDRjSwI87EeX", "PVf6Gbrv9HbB88uZ", "La9krMOMBhAhDLi6", "ImeIdHbYb6kZKAdt", "ez9MSQ8QIO4cW6zo", "aIKQmFiuXWipEdyb", "HWitOe1wSid7MZ1y"] .map(id=>game.scenes.get(id));'
oldRead=read
read=read.replace("const ledger=", jsCanonical+"\nconst ledger=", 1)
read=read.replace("game.scenes.size","canonical.length").replace("game.scenes.reduce(", "canonical.reduce(")
rp=w/'clscale-c1-baseline-readonly-v001.page.js'
if rp.exists() and rp.read_bytes()!=oldRead.encode('utf-8') and rp.read_bytes()!=read.encode('utf-8'):
 raise SystemExit('STOP unexpected existing baseline file')
if not rp.exists() or rp.read_bytes()!=read.encode('utf-8'):rp.write_bytes(read.encode('utf-8'))
res=subprocess.run(['node','exec-page.mjs','read',rp.name],cwd=w,capture_output=True,encoding='utf-8',timeout=80)
if res.returncode:raise SystemExit('STOP read only baseline failed '+res.stderr[:700])
q=json.loads(res.stdout)
if q.get('status')!='PASS':raise SystemExit('STOP baseline unexpected '+res.stdout[:700])
x=q['result'];s=x['scene']
if not 'C1' in s['name'] or s['_id']!=ID:raise SystemExit('STOP wrong Scene')
if x['executor']!='Assistant Gamemaster' or x['nonGM'] or x['revision']!=3 or x['ledgerSha']!='e8485e53ea171208894098b263b0223940140e1d52284e26e0546043543977d9':raise SystemExit('STOP ledger/executor drift')
if s['grid']['size']!=120 or s['grid']['type']!=0 or s['grid']['distance']!=5 or s['width']!=4320 or s['height']!=2880 or s['padding']!=0 or s['tokens']:raise SystemExit('STOP Scene not token-free 120px standard')
if x['roster']!={'scenes':21,'regions':202,'behaviors':119}:raise SystemExit('STOP roster changed')
backup=r/'outputs/foreman-checkpoints/clscale-c1-before-grid240-v001.json'
if backup.exists():raise SystemExit('STOP backup already exists')
backup.write_text(json.dumps({'scene':s,'sourceSHA':x['sha'],'ledgerSHA':x['ledgerSha']},ensure_ascii=False,indent=1),encoding='utf-8')
original=repr(s['_stats']['modifiedTime']);priorGM=json.dumps(s['_stats']['lastModifiedBy'])
head=f"""// C1 exact snapshot guarded grid-only resize.
const s=game.scenes.get('{ID}'),ledger=game.journal.get('xhlXv6CCH34HVga3')?.getFlag('world','dicebox')?.state;
const H=async v=>Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(String(v)))),b=>b.toString(16).padStart(2,'0')).join('');
if(game.version!=='14.367'||game.system.version!=='5.3.3'||game.world.id!=='the-lost-mine-of-phandalin'||game.user.name!=='Assistant Gamemaster'||!game.user.isGM||game.users.some(u=>u.active&&!u.isGM))throw Error('STACK_OR_PLAYER_DRIFT');
if(!s||s.active||s.grid.size!==120||s.grid.type!==0||s.grid.distance!==5||s.grid.units!=='ft'||s.width!==4320||s.height!==2880||s.tokens.size!==0||s.padding!==0)throw Error('C1_SCENE_DRIFT');
if(await H(JSON.stringify(s.toObject()))!=='{x['sha']}'||ledger?.revision!==3||await H(JSON.stringify(ledger))!=='{x['ledgerSha']}')throw Error('SOURCE_OR_LEDGER_DRIFT');
if(game.scenes.size!==21||game.scenes.reduce((n,s)=>n+s.regions.size,0)!==202||game.scenes.reduce((n,s)=>n+[...s.regions].reduce((m,r)=>m+r.behaviors.size,0),0)!==119)throw Error('ROSTER_DRIFT');
const before=s.toObject();
"""
# Keep live install guard scoped to the canonical campaign roster, not unrelated Foundry Scenes.
head=jsCanonical+"\n"+head.replace("game.scenes.size","canonical.length").replace("game.scenes.reduce(", "canonical.reduce(")
preview=head+f"return{{operation:'clscale-c1-preview-v001',noWrite:true,status:'PASS_STAGED',gridBefore:120,gridAfter:{target},originalSHA:'{x['sha']}',ledgerRevision:ledger.revision,scene:s.name}};"
apply=head+f"""await s.update({{'grid.size':{target}}},{{autoReposition:false}});
const now=game.scenes.get(s.id).toObject(),check=JSON.parse(JSON.stringify(now));
check.grid.size=120;check._stats.modifiedTime={original};check._stats.lastModifiedBy={priorGM};
if(now.grid.size!=={target}||await H(JSON.stringify(check))!=='{x['sha']}'||
await H(JSON.stringify(game.journal.get('xhlXv6CCH34HVga3')?.getFlag('world','dicebox')?.state))!=='{x['ledgerSha']}')
 throw Error('OUTCOME_UNKNOWN_C1_NO_RETRY');
return{{operation:'clscale-c1-apply-v001',status:'PASS_SOURCE_UPDATED',noWrite:false,originalSHA:'{x['sha']}',afterSHA:await H(JSON.stringify(now)),normalizedSHA:await H(JSON.stringify(check))}};
"""
verify=f"""const s=game.scenes.get('{ID}'),ledger=game.journal.get('xhlXv6CCH34HVga3')?.getFlag('world','dicebox')?.state;
const H=async v=>Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(String(v)))),b=>b.toString(16).padStart(2,'0')).join('');
const raw=s.toObject(),check=JSON.parse(JSON.stringify(raw));check.grid.size=120;check._stats.modifiedTime={original};check._stats.lastModifiedBy={priorGM};
const values={{grid:s.grid.size,type:s.grid.type,dist:s.grid.distance,units:s.grid.units,width:s.width,height:s.height,tokens:s.tokens.size,walls:s.walls.size,regions:s.regions.size,lights:s.lights.size,normalizedSHA:await H(JSON.stringify(check)),sourceSHA:await H(JSON.stringify(raw)),ledgerSHA:await H(JSON.stringify(ledger)),revision:ledger.revision}};
const ok=values.grid==={target}&&values.type===0&&values.dist===5&&values.units==='ft'&&values.width===4320&&values.height===2880&&values.tokens===0&&values.normalizedSHA==='{x['sha']}'&&values.ledgerSHA==='{x['ledgerSha']}'&&values.revision===3;
return{{operation:'clscale-c1-final-readonly-v001',noWrite:true,status:ok?'PASS_SOURCE_AND_GEOMETRY_IDENTICAL':'BLOCKED_UNEXPECTED_DRIFT',values}};
"""
for name,body in [('clscale-c1-preview-v001.page.js',preview),('clscale-c1-apply-v001.page.js',apply),('clscale-c1-final-readonly-v001.page.js',verify)]:
 pp=w/name
 if pp.exists():raise SystemExit('STOP existing staged file '+name)
 pp.write_bytes(body.encode('utf-8'))
 print('STAGED',name,sha(body))
print('BACKUP',backup.name,'BEFORE_SHA',x['sha'],'COUNTS',{k:len(s.get(k,[])) for k in ('walls','regions','lights','tokens')})
