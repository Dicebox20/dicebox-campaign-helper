from pathlib import Path
import sqlite3,subprocess,shutil,hashlib
root=Path(r'C:\Users\rujie\Documents\Codex\DiceBox Campaign Helper')
seed=root/'database/seed.sql'
db=root/'database/dicebox_campaign_helper_knowledge.sqlite'
patch=root/'work/foundry-playwright-harness/cl13-seventh-winter-approved-kb-v001.sql'
marker='D-2026-10-08-CL13-SEVENTH-WINTER-0435'
before=seed.read_text(encoding='utf-8-sig')
if marker in before:
 print('ALREADY_IN_SEED',marker)
else:
 backup=seed.with_name('seed.sql.pre-cl13-v001')
 if backup.exists():raise RuntimeError('Refusing to overwrite prior seed backup')
 shutil.copy2(seed,backup)
 db_backup=db.with_name('dicebox_campaign_helper_knowledge.sqlite.pre-cl13-v001')
 if db_backup.exists():raise RuntimeError('Refusing to overwrite prior SQLite backup')
 with sqlite3.connect(db) as src, sqlite3.connect(db_backup) as dst:src.backup(dst)
 append='\n\n'+patch.read_text(encoding='utf-8')+'\n'
 tmp=seed.with_suffix('.sql.cl13temp')
 tmp.write_text(before+append,encoding='utf-8')
 tmp.replace(seed)
 try:
  proc=subprocess.run(['python',str(root/'database/build_database.py')],capture_output=True,text=True,timeout=90)
  print('BUILD_EXIT',proc.returncode,'STDOUT',proc.stdout[:2500],'STDERR',proc.stderr[:1500])
  if proc.returncode:raise RuntimeError('KB builder returned nonzero')
 except Exception:
  print('REBUILD_FAILED restoring original seed/DB backup')
  shutil.copy2(backup,seed);shutil.copy2(db_backup,db)
  raise
with sqlite3.connect(f'file:{db.as_posix()}?mode=ro',uri=True) as c:
 print('KB_INTEGRITY',c.execute('pragma integrity_check').fetchone()[0])
 print('KB_NEW_DECISION',c.execute('select status from kb_decisions where decision_id=?',(marker,)).fetchone())
 print('KB_NEW_OPEN',c.execute('select status from kb_open_items where item_id=?',('O-2026-10-08-CL13-CLOCK-RUNTIME-PREVIEW',)).fetchone())
print('SEED_SHA256',hashlib.sha256(seed.read_bytes()).hexdigest())
