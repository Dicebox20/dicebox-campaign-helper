from pathlib import Path
import subprocess,json,hashlib
r=Path(r'C:\Users\rujie\Documents\Codex\DiceBox Campaign Helper')
w=r/'work/foundry-playwright-harness'
out=r/'outputs/foreman-checkpoints/clscale-m2-before-grid320-v001.json'
if out.exists():raise SystemExit('STOP: backup exists, no overwrite')
cmd=['node','exec-page.mjs','read','clscale-m2-full-scene-backup-readonly-v001.page.js']
p=subprocess.run(cmd,cwd=w,capture_output=True,encoding='utf-8',timeout=80)
if p.returncode:raise SystemExit('STOP: no-write backup request failed '+p.stderr[:2000])
j=json.loads(p.stdout)
if j.get('status')!='PASS' or j.get('result',{}).get('operation')!='clscale-m2-full-scene-backup-readonly-v001':raise SystemExit('STOP unexpected response')
x=j['result']
if x['identity']['world']!='the-lost-mine-of-phandalin' or x['identity']['version']!='14.367' or x['identity']['user']!='Assistant Gamemaster' or x['identity']['nonGMs']:raise SystemExit('STOP identity mismatch')
if x['originalSha']!='c96c3026a7b5ae152871ceb5191770f3474fd9410958a1701bcff4c3c34d72d5' or x['ledgerRevision']!=3 or x['ledgerSHA']!='e8485e53ea171208894098b263b0223940140e1d52284e26e0546043543977d9':
 raise SystemExit('STOP live state drift, new acceptance required')
s=x['scene']
if s['_id']!='JZkxX6lUQe8Nc8xJ' or s['grid']['size']!=120 or s['grid']['type']!=0 or s['width']!=4320 or s['height']!=2880 or s['tokens']:
 raise SystemExit('STOP scene fields drift')
out.parent.mkdir(exist_ok=True,parents=True)
out.write_text(json.dumps({'source':'exact Foundry read-only toObject','operation':x['operation'],'sceneSha':x['originalSha'],'ledgerSha':x['ledgerSHA'],'scene':s},ensure_ascii=False,indent=1),encoding='utf-8')
print('SNAPSHOT_WRITTEN',out.name,'SHA256',hashlib.sha256(out.read_bytes()).hexdigest(),'SCENE_ORIGINAL_SHA',x['originalSha'],'BACKUP_BYTES',out.stat().st_size)
