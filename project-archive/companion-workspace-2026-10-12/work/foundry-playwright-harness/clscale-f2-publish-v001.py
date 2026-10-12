from pathlib import Path
import hashlib,sqlite3
r=Path(r'C:\Users\rujie\Documents\Codex\DiceBox Campaign Helper')
db=r/'database/dicebox_campaign_helper_knowledge.sqlite'
src=r/'work/foundry-playwright-harness/clscale-f2-kb-v001.sql'
dest=r/'database/seed.d/zzzzzzzzzzzzzzzzzzzzzzzzz-2026-10-09-clscale-f2-grid240-verified.sql'
backup=r/'database/dicebox_campaign_helper_knowledge.sqlite.pre-clscale-f2-v001'
if backup.exists() or dest.exists():raise SystemExit('STOP F2 knowledge seed/backup already exists')
with sqlite3.connect('file:'+db.as_posix()+'?mode=ro',uri=True) as c:
 if c.execute('pragma integrity_check').fetchone()!=('ok',):raise SystemExit('STOP integrity')
 if c.execute("select count(*) from kb_facts where fact_id='F-2026-10-09-CL-SCALE-F2-GRID240-INSTALLED'").fetchone()!=(0,):raise SystemExit('STOP F2 existing fact')
 if c.execute("select status from kb_open_items where item_id='O-2026-10-08-CL-SCALE-INTERIOR-CALIBRATION'").fetchone()!=('in_progress',):raise SystemExit('STOP work status drift')
with sqlite3.connect(db) as old:
 with sqlite3.connect(':memory:') as test:
  old.backup(test)
  test.executescript(src.read_text(encoding='utf8'))
  if test.execute('pragma integrity_check').fetchone()!=('ok',):raise SystemExit('STOP staged integrity')
 with sqlite3.connect(backup) as saved:old.backup(saved)
dest.write_bytes(src.read_bytes())
print('F2_KB_SEED_STAGED',dest.name,hashlib.sha256(dest.read_bytes()).hexdigest(),'SQLITE_BACKUP',backup.name)
