from pathlib import Path
import sys,json,hashlib,subprocess,math
R=Path(r'C:\Users\rujie\Documents\Codex\DiceBox Campaign Helper')
W=R/'work/foundry-playwright-harness'
DATA={
'N1':dict(id='MAbLfBqG7qIVVuLN',target=150,token='DOCKvaCKDr8MUP8S',pos=(3207,1079),regions=11,west='h0rAVwjsaVkKLQBa',east='xsitdXO94BHJkYKX',minSpan=300,doors=None),
'N2':dict(id='4pc5akMBieHU7GvV',target=160,token='yrEySwR08mLg8Xll',pos=(2836,1662),regions=9,west='lYps0Z5806d0W8wX',east='shIAThge7cNy0JjT',minSpan=200,doors=5)}
if len(sys.argv)!=2 or sys.argv[1] not in DATA:raise SystemExit('USAGE: python clscale-stage-reference-room-v001.py N1|N2')
L=sys.argv[1];o=DATA[L];P='clscale-ref-'+L.lower()+'-grid'+str(o['target'])+'-v001';sha=lambda t:hashlib.sha256(t.encode()).hexdigest()
canonical=['0CSBwzcszPKyaB8u','5K1uASAARnX8aZhP','EDdktL7VUihbpKe9','UNySMm7YkyYfh41x','Zq8iXByDVhHRbA7w','sI4YVZZChgey1qNi','iqfCcDpEer4pwrJj','DLcheEi6e5OHOYmU','U8S5ZrTjaPIkTUIL','JZkxX6lUQe8Nc8xJ','LXTA8mx1rJ2L6e2J','MAbLfBqG7qIVVuLN','4pc5akMBieHU7GvV','pHQvDUDlyWZFuNrX','if9iWDRjSwI87EeX','PVf6Gbrv9HbB88uZ','La9krMOMBhAhDLi6','ImeIdHbYb6kZKAdt','ez9MSQ8QIO4cW6zo','aIKQmFiuXWipEdyb','HWitOe1wSid7MZ1y']
JS_IDS=json.dumps(canonical)
LEDGER='ec3f1a02887b80a342653681d217d357f7bb7f5b44fa436555d57bf12c44cfd4'
base=f"""const s=game.scenes.get('{o['id']}'),ledger=game.journal.get('xhlXv6CCH34HVga3')?.getFlag('world','dicebox')?.state,canonical={JS_IDS}.map(id=>game.scenes.get(id));
const H=async v=>Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(JSON.stringify(v)))),b=>b.toString(16).padStart(2,'0')).join('');
if(!game.ready||game.version!=='14.367'||game.world.id!=='the-lost-mine-of-phandalin'||game.system.version!=='5.3.3'||game.user.name!=='Assistant Gamemaster'||!game.user.isGM||game.users.some(u=>u.active&&!u.isGM))throw Error('AUTHORITY_DRIFT');
if(!s||s.active||s.grid.size!==120||s.grid.type!==0||s.grid.distance!==5||s.grid.units!=='ft'||s.width!==4320||s.height!==2880||s.padding!==0||s.tokens.size!==1||s.regions.size!=={o['regions']})throw Error('SCENE_DRIFT');
const t=s.tokens.get('{o['token']}');
if(!t||t.actorId!=='2g6CmPQqhSkRQQZm'||t.x!=={o['pos'][0]}||t.y!=={o['pos'][1]}||t.width!==1||t.height!==1||t.texture.scaleX!==1||t.texture.scaleY!==1)throw Error('REFERENCE_TOKEN_DRIFT');
if(canonical.some(x=>!x)||canonical.reduce((n,s)=>n+s.regions.size,0)!==202||canonical.reduce((n,s)=>n+[...s.regions].reduce((m,r)=>m+r.behaviors.size,0),0)!==119)throw Error('ROSTER_DRIFT');
if(ledger?.revision!==13||await H(ledger)!=='{LEDGER}')throw Error('SOVEREIGN_LEDGER_DRIFT');
const trans=['{o['west']}','{o['east']}'].map(id=>s.regions.get(id));if(trans.some(r=>!r||!r.getFlag('world','dicebox')?.stableId||![...r.shapes].some(q=>q.type==='rectangle'&&q.width>={2*o['target']}&&q.height>={2*o['target']})))throw Error('CL50_TRANSITION_SIZE_DRIFT');
const walls=[...s.walls],doors=walls.filter(w=>w.door>0);
if(doors.some(w=>Math.hypot(w.c[2]-w.c[0],w.c[3]-w.c[1])<1.15*{o['target']}))throw Error('DOOR_TOO_NARROW');
const orig=s.toObject();
"""
rp=W/(P+'-baseline-readonly.page.js')
if rp.exists():raise SystemExit('STOP already staged baseline')
rp.write_text(base+f"return {{operation:'{P}-baseline',noWrite:true,scene:orig,sourceSHA:await H(orig),ledgerSHA:await H(ledger),revision:ledger.revision}};",encoding='utf8')
res=subprocess.run(['node','exec-page.mjs','read',rp.name],cwd=W,capture_output=True,text=True,timeout=60)
if res.returncode:raise SystemExit('STOP BASELINE_TRANSPORT '+res.stderr[:700])
try:x=json.loads(res.stdout)['result'];s=x['scene']
except Exception as e:raise SystemExit('STOP BASELINE_RESULT '+str(e))
if x['revision']!=13 or x['ledgerSHA']!=LEDGER:raise SystemExit('STOP NEW LEDGER BASELINE_DRIFT')
if o['doors'] is not None and len([w for w in s['walls'] if w.get('door',0)>0])!=o['doors']:raise SystemExit('STOP DOOR_COUNT_DRIFT')
token=s['tokens'][0]
if token['_id']!=o['token'] or (token['x'],token['y'])!=o['pos']:raise SystemExit('STOP TOKEN_SOURCE_DRIFT')
backup=R/'outputs/foreman-checkpoints'/f'{P}-before.json'
if backup.exists():raise SystemExit('STOP backup already exists')
backup.write_text(json.dumps({'Scene':s,'sourceSHA':x['sourceSHA'],'ledgerSHA':LEDGER,'revision':13},ensure_ascii=False,indent=1),encoding='utf8')
originalMod=json.dumps(s['_stats']['modifiedTime']);originalGM=json.dumps(s['_stats']['lastModifiedBy'])
guard=base+f"""if(await H(orig)!=='{x['sourceSHA']}')throw Error('EXACT_ORIGINAL_SOURCE_DRIFT');
"""
preview=guard+f"return{{operation:'{P}-preview',status:'PASS_STAGED',noWrite:true,oldGrid:120,newGrid:{o['target']},tokenId:'{o['token']}',tokenPixelPosition:[t.x,t.y],oldSceneSHA:'{x['sourceSHA']}'}};"
apply=guard+f"""await s.update({{'grid.size':{o['target']}}},{{autoReposition:false}});
const now=s.toObject(),normal=JSON.parse(JSON.stringify(now));
normal.grid.size=120;normal._stats.modifiedTime={originalMod};normal._stats.lastModifiedBy={originalGM};
if(now.grid.size!=={o['target']}||await H(normal)!=='{x['sourceSHA']}'||await H(game.journal.get('xhlXv6CCH34HVga3')?.getFlag('world','dicebox')?.state)!=='{LEDGER}')throw Error('OUTCOME_UNKNOWN_DO_NOT_RETRY');
return{{operation:'{P}-apply',status:'PASS_SOURCE_UPDATED',oldSHA:'{x['sourceSHA']}',afterSHA:await H(now),normalizedSHA:await H(normal),tokenId:t.id,tokenX:t.x,tokenY:t.y}};
"""
verify=f"""const s=game.scenes.get('{o['id']}'),ledger=game.journal.get('xhlXv6CCH34HVga3')?.getFlag('world','dicebox')?.state;
const H=async v=>Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(JSON.stringify(v)))),b=>b.toString(16).padStart(2,'0')).join('');
const now=s.toObject(),normal=JSON.parse(JSON.stringify(now)),tok=s.tokens.get('{o['token']}');
normal.grid.size=120;normal._stats.modifiedTime={originalMod};normal._stats.lastModifiedBy={originalGM};
const valid=now.grid.size==={o['target']}&&await H(normal)==='{x['sourceSHA']}'&&tok?.x==={o['pos'][0]}&&tok?.y==={o['pos'][1]}&&tok?.width===1&&tok?.height===1&&ledger?.revision===13&&await H(ledger)==='{LEDGER}';
return{{operation:'{P}-final',noWrite:true,status:valid?'PASS_FULL_SOURCE_AND_TOKEN':'BLOCKED_DRIFT',grid:now.grid.size,sourceSHA:await H(now),normalSHA:await H(normal),token:tok?{{id:tok.id,x:tok.x,y:tok.y}}:null,tokenCount:s.tokens.size,regionCount:s.regions.size,walls:s.walls.size,lights:s.lights.size,ledgerSHA:await H(ledger),ledgerRev:ledger?.revision}};
"""
for suf,body in [('preview-readonly.page.js',preview),('apply-write.page.js',apply),('final-readonly.page.js',verify)]:
 p=W/(P+'-'+suf)
 if p.exists():raise SystemExit('STOP '+p.name+' exists')
 p.write_text(body,encoding='utf8')
 print('STAGED',p.name,sha(body))
print('BACKUP',backup.name,'SOURCE_SHA',x['sourceSHA'],'SCENE',s['name'],'TARGET',o['target'],'TOKEN',o['token'],'WALLS',len(s['walls']),'REGIONS',len(s['regions']))
