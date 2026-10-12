from pathlib import Path
import hashlib,sqlite3,subprocess,os
root=Path(r'C:\Users\rujie\Documents\Codex\DiceBox Campaign Helper')
dbdir=root/'database'
seed=dbdir/'seed.sql'
prior=dbdir/'seed.sql.pre-cl13-v001'
patch=root/'work/foundry-playwright-harness/cl13-seventh-winter-approved-kb-v001.sql'
db=dbdir/'dicebox_campaign_helper_knowledge.sqlite'
dbprior=dbdir/'dicebox_campaign_helper_knowledge.sqlite.pre-cl13-v001'
marker=b'D-2026-10-08-CL13-SEVENTH-WINTER-0435'
orig=seed.read_bytes()
old_hash='A4C302E002FC3A229EFA0E059871AC0E1A6CF6E98AE84065AA2926A9AAC9F6EDCB2'
# Always confirm against the authoritative previous SHA.
old_hash='A4C302E002FC3A229EFA0E059871AC0E1A6CF6E98AE84065B99323204523E4F3'
if hashlib.sha256(orig).hexdigest().upper()!=old_hash:raise SystemExit('STOP unexpected canonical seed hash')
if prior.read_bytes()!=orig:raise SystemExit('STOP original backup mismatch')
delta=b'\n'+patch.read_bytes()+b'\n'
if marker not in delta or marker in orig or not dbprior.exists():raise SystemExit('STOP invalid patch preconditions')
print('PRECONDITIONS_PASS','base',len(orig),'append_bytes',len(delta))
try:
 with open(seed,'ab') as f:
  wrote=f.write(delta);f.flush();os.fsync(f.fileno())
 if wrote!=len(delta) or seed.read_bytes()!=orig+delta:raise RuntimeError('post-write bytes mismatch')
 print('GUARDED_APPEND_PASS',hashlib.sha256(seed.read_bytes()).hexdigest())
 proc=subprocess.run(['python',str(dbdir/'build_database.py')],capture_output=True,text=True,timeout=95)
 print('REBUILD_EXIT',proc.returncode)
 print('REBUILD_STDOUT',proc.stdout.strip()[:2200])
 print('REBUILD_STDERR',proc.stderr.strip()[:2000])
 if proc.returncode:raise RuntimeError('canonical KB builder failed')
 with sqlite3.connect('file:'+str(db).replace('\\','/')+'?mode=ro',uri=True) as c:
  v=c.execute('select status from kb_decisions where decision_id=?',(marker.decode(),)).fetchone()
  o=c.execute('select status from kb_open_items where item_id=?',('O-2026-10-08-CL13-CLOCK-RUNTIME-PREVIEW',)).fetchone()
  print('DECISION',v,'OPEN_ITEM',o)
  if v!=('locked',) or o!=('in_progress',):raise RuntimeError('KB expected record not found')
 print('KB_REBUILD_SUCCESS')
except BaseException as ex:
 print('GUARDED_BUILD_FAILED',repr(ex))
 try:
  if seed.read_bytes()==orig+delta:
   with open(seed,'r+b') as f:
    f.truncate(len(orig));f.flush();os.fsync(f.fileno())
   print('SEED_RESTORED',hashlib.sha256(seed.read_bytes()).hexdigest())
  else:print('SEED_UNEXPECTED: no rollback without manual reconciliation')
 except BaseException as err:print('RECOVERY_STOP',repr(err))
 print('Database outcome remains to be inspected; do not blind replay')
 raise
